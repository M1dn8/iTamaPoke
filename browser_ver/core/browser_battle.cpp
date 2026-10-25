// Wild-battle glue: a plain-C++ port of Sources/Core/TPBattle.mm (itself a
// Swift-facing reimplementation of TamaPoke.ino's wild-encounter-prompt and
// battle-screen logic -- ShadowEnemyx/TamaPoke "Expanded", not the
// upstream/ submodule -- see upstream-expanded/README.md). battle.h/
// battle.cpp (the actual combat math) are used unmodified, exactly like
// browser_glue.cpp does for pet.cpp; this file only replaces TPBattle.mm's
// two platform calls -- arc4random_uniform(100) -> std::rand() % 100, and
// NSProcessInfo.systemUptime -> g_millis (already driven by tp_tick in
// browser_glue.cpp) -- everything else mirrors it line for line so the
// wild-encounter odds, cooldowns, and battle math match the iOS build.
#include <cstdint>
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <string>
#include <ctime>
#include <memory>
#include "arena-kanto.h"
#include "arena-johto.h"
#include "battle-energy.h"
#include "wild-team-runtime.h"
#if defined(__EMSCRIPTEN__) || defined(TP_LG_TEST)
extern "C" int tp_lg_owned();
static bool leagueOwned(){return tp_lg_owned()!=0;}
#else
static bool leagueOwned(){return false;}
#endif

#include <emscripten.h>

#include "pet.h"
#include "region-progress-keys.h"
#include "dex.h"
#include "i18n.h"
#include "battle.h"
#include "dayphase.h"
#include "audio.h"

extern uint32_t g_millis; // browser_glue.cpp

// The one live Pet instance is browser_glue.cpp's; declared there as a file-
// local, so this file gets its own accessor rather than reaching across.
extern "C" int tp_is_egg();
extern "C" int tp_sleeping();
extern "C" int tp_species_id();
extern "C" int tp_level();

namespace {

inline uint8_t rnd100() { return (uint8_t)(std::rand() % 100); }

BattleStats playerStats() {
  BattleStats s{};
  s.level = (uint8_t)tp_level();
  // pet.h doesn't expose atk/def/speStat() through a C export yet (only
  // needed here) -- computed the same way TPBattlePlayerStats() does, via
  // the real Pet methods, reached through the shared instance below.
  return s;
}

} // namespace

// tp_tick() in browser_glue.cpp owns the one Pet; battle math needs read
// access to it (level/species/stats) and, on win/loss, needs to call its
// apply*/tryCatch* methods -- both cross this same extern rather than
// duplicating a second Pet.
extern Pet &tp_battle_pet();

namespace {

const uint32_t kWildCooldownMs = 20UL * 60UL * 1000UL;
const uint32_t kWildPromptMs = 20000UL;
const uint32_t kWildCheckMs = 60000UL;

// Wild encounter prompt (idle screen)
bool gWildPromptActive = false;
int16_t gWildPromptDex = 0;
uint8_t gWildPromptLevel = 0;
uint32_t gWildPromptUntilMs = 0;
uint32_t gNextWildEligibleMs = 0;
uint32_t gLastWildCheckMs = 0;

// Battle
bool gOpen = false, gResolved = false;
// F2 sessions deliberately live only in RAM; no reward or save-schema changes.
struct TrainerTeam { uint8_t count; int16_t dex[2]; };
constexpr TrainerTeam kTrainerTeams[] = {{1,{19,0}}, {2,{16,19}}};
bool gTrainer=false, gTrainerNext=false;
int gArenaId=-1,gArenaPhase=0;
int gArenaRegion=0;
const TPArenaLeader *arenaLeaderFor(int region,int id){
 if(id<0)return nullptr;
 if(region==0)return id<int(kKantoArenaCount)?&kKantoArenas[id]:nullptr;
 if(region==1)return tpJohtoArenaAt(unsigned(id));
 return nullptr;
}

uint32_t gArenaSerial=0,gArenaToken=0;
std::unique_ptr<Pet> gArenaUndo;
std::map<std::string,Preferences::Value> gArenaStore;
int arenaMask(const TPRegionProgressKeys &keys=TP_KANTO_KEYS){
 const auto &store=Preferences::store();const auto ver=store.find(keys.arenaVersion);
 if(ver==store.end()){
  if(store.count(keys.arenaMask))return -1;
  for(unsigned i=0;i<8;i++)if(store.count(keys.arenaDatePrefix+std::to_string(i)))return -1;
  return 0;
 }
 if(!std::holds_alternative<int64_t>(ver->second)||std::get<int64_t>(ver->second)!=1)return -1;
 const auto entry=store.find(keys.arenaMask);if(entry==store.end()||!std::holds_alternative<int64_t>(entry->second))return -1;
 const auto mask=std::get<int64_t>(entry->second);return mask>=0&&mask<=255?int(mask):-1;
}
uint8_t gTrainerId=0, gTrainerIndex=0, gTrainerCount=0;
uint32_t gTrainerRounds=0, gTrainerDealt=0, gTrainerTaken=0;
int16_t gTrainerSpecies=-1;
uint32_t gTrainerAge=0;
uint8_t gTrainerGa=0,gTrainerGd=0,gTrainerGs=0;
bool trainerActorValid() {
 const Pet &p=tp_battle_pet();
 return !p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving()&&
 p.speciesId==gTrainerSpecies&&p.ageMinutes>=gTrainerAge&&
 p.geneAtk==gTrainerGa&&p.geneDef==gTrainerGd&&p.geneSpe==gTrainerGs;
}
int16_t gDex = 0;
uint8_t gLevel = 0;
BattleStats gPlayer{}, gEnemy{};
uint8_t gPlayerMegaForm=0;
BattleRuntime gRun{};
struct WTMemberSnapshot {
  TPWildTeamEntry entry{};
  std::string nick;
  bool shiny=false;
  bool care=false;
  uint8_t form=0;
};
std::array<WTMemberSnapshot,6> gWTMembers{};
TPWildTeamRuntime gWildTeam;
unsigned gWTStageCount=0,gWTStageMask=0;
bool gWTResultPending=false;
struct WTResultUndo {uint32_t token=0;bool applied=false;};
WTResultUndo gWTResultUndo;
BattleTurnResult gTurn{};
uint32_t gBvId=0;uint16_t gBvDealt=0,gBvTaken=0,gBvHeal=0;
bool gAttackMenuOpen = false;
char gMessage[28] = {0};
bool gLowHpWarned = false;

bool gCatchOffered = false, gCatchTried = false, gCatchDone = false,
     gCatchSuccess = false, gRespectCatch = false;
uint8_t gCatchChance = 0;
std::string gRewardLine;
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
uint32_t gF4BattleId=0,gF4CatchEpoch=0,gF4ActorAge=0;
int gF4Outcome=-1;bool gF4QuietCatch=false,gF4ActorShiny=false;
int16_t gF4ActorDex=0;uint8_t gF4ActorGa=0,gF4ActorGd=0,gF4ActorGs=0;
struct F4CatchUndo {uint32_t token=0;bool tried=false,done=false,success=false,attempted=false;};
F4CatchUndo gF4CatchUndo;
#endif

BattleStats realPlayerStats() {
  Pet &pet = tp_battle_pet();
  BattleStats stats{};
  stats.level = pet.level();
  const uint32_t now=uint32_t(std::time(nullptr));pet.megaUpdate(now);
  stats.atk = pet.megaAtk(now);stats.def = pet.megaDef(now);stats.spe = pet.megaSpe(now);stats.mega=pet.megaActive(now);
  stats.hp = 0;
  if (!pet.isEgg() && pet.speciesId >= 1 && pet.speciesId <= DEX_COUNT) {
    const DexEntry &d = DEX_TBL[pet.speciesId];
    stats.type1 = d.type1;
    const auto form=tpMegaByDex(pet.speciesId);
    stats.type1=stats.mega&&form?form->type1:d.type1;
    stats.type2=stats.mega&&form?form->type2:d.type2;
  }
  return stats;
}

uint8_t dayPhaseNow() {
  return dayPhaseFromEpoch(tp_battle_pet().lastSeenEpoch);
}

void startBattle(int16_t forcedDex, uint8_t forcedLevel) {
  if(leagueOwned()||gWTResultUndo.token)return;
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  if(gF4CatchUndo.token)return;
  if(++gF4BattleId==0)++gF4BattleId;
  gF4Outcome=-1;gF4CatchEpoch=0;
#endif
  if(gArenaUndo)return;
  gArenaId=-1;gArenaPhase=0;gArenaToken=0;gArenaRegion=0;
  gTrainer=false;gTrainerNext=false;gTrainerCount=gTrainerIndex=0;
  gTrainerRounds=gTrainerDealt=gTrainerTaken=0;
  gWildTeam.clear();gWTResultPending=false;
  gRewardLine.clear();
  Pet &pet = tp_battle_pet();
  gWildPromptActive = false;
  gNextWildEligibleMs = g_millis + kWildCooldownMs;

  uint8_t phase = dayPhaseNow();
  if (forcedDex >= 1 && forcedDex <= DEX_COUNT) {
    gDex = forcedDex;
    gLevel = forcedLevel ? forcedLevel : wildLevelFor(pet.level(), rnd100());
  } else {
    gDex = pickWildSpecies(static_cast<uint32_t>(std::rand()), phase);
    gLevel = wildLevelFor(pet.level(), rnd100());
  }
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  gF4ActorDex=pet.speciesId;gF4ActorGa=pet.geneAtk;gF4ActorGd=pet.geneDef;gF4ActorGs=pet.geneSpe;gF4ActorShiny=pet.shiny;gF4ActorAge=pet.ageMinutes;
#endif
  if(++gBvId==0)++gBvId;gBvDealt=gBvTaken=gBvHeal=0;
  gPlayer = realPlayerStats();
  gPlayerMegaForm=gPlayer.mega?pet.megaFormId():0;
  gEnemy = wildBattleStats(gDex, gLevel);
  gEnemy.hp = 0;
  gRun = beginBattleRuntime(gPlayer, gEnemy);
  gTurn = BattleTurnResult{};
  gMessage[0] = 0;
  gAttackMenuOpen = false;
  gLowHpWarned = false;
  gCatchOffered = gCatchTried = gCatchDone = gCatchSuccess = gRespectCatch = false;
  gCatchChance = 0;
  gResolved = false;
  gOpen = true;
}

void finishBattle() {
  if (gResolved) return;
  gResolved = true;
  // P05: result is intentionally not rewarded by the legacy care method.
  // The later result transaction must confirm this pending outcome.
  if(gWildTeam.count()&&!gTrainer){
    gWTResultPending=true;
    gRewardLine.clear();
    gCatchOffered=gCatchTried=gCatchDone=gCatchSuccess=gRespectCatch=false;
    gCatchChance=0;
    sfxPlay(gTurn.playerWon?SFX_BATTLE_WIN:SFX_BATTLE_LOSS);
    return;
  }
  Pet &pet = tp_battle_pet();
  if (gTrainer) {
    gCatchOffered=gCatchTried=gCatchDone=gCatchSuccess=gRespectCatch=false;
    gCatchChance=0;gRewardLine.clear();
    gTrainerNext=gTurn.playerWon&&gRun.playerHp>0&&gTrainerIndex+1<gTrainerCount;
    sfxPlay(gTurn.playerWon?SFX_BATTLE_WIN:SFX_BATTLE_LOSS);
    return;
  }
  if (gTurn.playerWon) {
    bool closeWin = gRun.playerHp <= gRun.playerMaxHp / 3;
    BattleReward reward = pet.applyBattleWin(gDex, closeWin);
    if (reward.amount == 0) {
      gRewardLine = "";
    } else {
      StrId fmt = S_SPD_GAIN_FMT;
      if (reward.stat == BATTLE_REWARD_ATK) fmt = S_ATK_GAIN_FMT;
      else if (reward.stat == BATTLE_REWARD_DEF) fmt = S_DEF_GAIN_FMT;
      char out[24];
      snprintf(out, sizeof(out), T(fmt), reward.amount);
      gRewardLine = out;
    }
    gCatchOffered = true;
    gRespectCatch = false;
    gCatchChance = pet.catchChanceForWild(gDex, gLevel, gPlayer.level, closeWin);
    sfxPlay(SFX_BATTLE_WIN);
  } else {
    gRewardLine = "";
    pet.applyBattleLoss();
    bool closeLoss = gRun.enemyHp > 0 &&
                      (uint32_t)gRun.enemyHp * 100UL <= (uint32_t)gRun.enemyMaxHp * 30UL;
    gCatchChance = closeLoss ? pet.respectCatchChanceForWild(gDex, gLevel, gPlayer.level) : 0;
    gCatchOffered = gCatchChance > 0;
    gRespectCatch = gCatchOffered;
    sfxPlay(SFX_BATTLE_LOSS);
  }
}

} // namespace

extern "C" {

// --- Static localized labels ---------------------------------------------
// Thin T(StrId) wrappers for every fixed label the battle screen and wild
// prompt need -- everything dynamic (round label, message, result lines)
// has its own snprintf-backed export further down.

EMSCRIPTEN_KEEPALIVE const char *tp_battle_wild_question_text() { return T(S_WILD_Q); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_fight_text() { return T(S_FIGHT); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_later_text() { return T(S_LATER); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_title_text() { return gArenaId>=0?"ARENAKAMPF":gTrainer?"TRAINERKAMPF":T(S_WILD_BATTLE); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_run_text() { return gTrainer?"ABBRUCH":T(S_RUN_BATTLE); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_attack_text() { return T(S_ATTACK); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_dodge_text() { return T(S_DODGE); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_quick_attack_text() { return T(S_QUICK_ATTACK); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_heavy_attack_text() { return T(S_HEAVY_ATTACK); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_catch_wild_text() { return T(S_CATCH_WILD); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_leave_wild_text() { return T(S_LEAVE_WILD); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_ok_text() { return T(S_OK); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_caught_ok_text() { return T(S_CAUGHT_OK); }
EMSCRIPTEN_KEEPALIVE const char *tp_battle_escaped_text() { return T(S_ESCAPED); }

// --- Wild encounter prompt -------------------------------------------

EMSCRIPTEN_KEEPALIVE
void tp_battle_check_wild(int mainScreenReady) {
  uint32_t now = g_millis;
  if (gNextWildEligibleMs == 0) {
    gNextWildEligibleMs = now + kWildCooldownMs;
    return;
  }
  if (gWildPromptActive) return;
  if (now - gLastWildCheckMs < kWildCheckMs) return;
  gLastWildCheckMs = now;
  if ((int32_t)(now - gNextWildEligibleMs) < 0) return;
  if (!mainScreenReady) return;

  Pet &pet = tp_battle_pet();
  uint8_t phase = dayPhaseNow();
  int16_t cand = pickWildSpecies(static_cast<uint32_t>(std::rand()), phase);
  uint8_t chance = (phase == 3) ? 4 : (phase == 0 ? 7 : 8);
  if (phase == 3 && cand >= 1 && cand <= DEX_COUNT) {
    const DexEntry &d = DEX_TBL[cand];
    if (d.type1 == TYPE_GHOST || d.type2 == TYPE_GHOST ||
        d.type1 == TYPE_POISON || d.type2 == TYPE_POISON) chance = 8;
  }
  if (rnd100() >= chance) return;

  gWildPromptDex = cand;
  gWildPromptLevel = wildLevelFor(pet.level(), rnd100());
  gWildPromptActive = true;
  gWildPromptUntilMs = now + kWildPromptMs;
  gNextWildEligibleMs = now + kWildCooldownMs;
}

EMSCRIPTEN_KEEPALIVE
int tp_wild_prompt_active() {
  if (gWildPromptActive && (int32_t)(g_millis - gWildPromptUntilMs) >= 0) {
    gWildPromptActive = false;
  }
  return gWildPromptActive ? 1 : 0;
}
EMSCRIPTEN_KEEPALIVE int tp_wild_prompt_dex() { return gWildPromptDex; }
EMSCRIPTEN_KEEPALIVE int tp_wild_prompt_level() { return gWildPromptLevel; }
EMSCRIPTEN_KEEPALIVE void tp_wild_dismiss() { gWildPromptActive = false; }
EMSCRIPTEN_KEEPALIVE
void tp_wild_accept() {
  if(gOpen)return;
  int16_t dex = gWildPromptDex;
  uint8_t level = gWildPromptLevel;
  gWildPromptActive = false;
  startBattle(dex, level);
}

// --- Lifecycle ---------------------------------------------------------

EMSCRIPTEN_KEEPALIVE
int tp_battle_can_start() {
  Pet &pet = tp_battle_pet();
  return canStartWildBattle(pet.isEgg(), pet.sleeping, pet.ceremony) ? 1 : 0;
}
EMSCRIPTEN_KEEPALIVE void tp_battle_start() { if(!gOpen&&tp_battle_can_start())startBattle(0, 0); }
EMSCRIPTEN_KEEPALIVE
void tp_battle_close() {
  if(gWTResultUndo.token)return;
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  if(gF4CatchUndo.token)return;
  gF4Outcome=-1;gF4CatchEpoch=0;
#endif
  if(gArenaUndo)return;
  gArenaId=-1;gArenaToken=0;gArenaPhase=0;gArenaRegion=0;
  gTrainer=false;gTrainerNext=false;gTrainerCount=gTrainerIndex=0;
  gWildTeam.clear();gWTResultPending=false;
  gWTStageCount=gWTStageMask=0;
  gOpen = false;
  gResolved = false;
  gAttackMenuOpen = false;
  gCatchOffered = gCatchTried = gCatchDone = gCatchSuccess = gRespectCatch = false;
  gCatchChance = 0;
}

EMSCRIPTEN_KEEPALIVE int tp_battle_is_open() { return gOpen||leagueOwned() ? 1 : 0; }
// Read-only battle presentation values; never use current level/form after expiry.
EMSCRIPTEN_KEEPALIVE int tp_bv_get(int key){switch(key){case 0:return int(gBvId&0x7fffffff);case 1:return gPlayer.level;case 2:return gPlayer.atk;case 3:return gPlayer.def;case 4:return gPlayer.spe;case 5:return gPlayerMegaForm;case 6:return gWildTeam.count()?(gWTMembers[gWildTeam.activeIndex()].shiny?1:0):(tp_battle_pet().shiny?1:0);case 7:return gBvDealt;case 8:return gBvTaken;case 9:return gBvHeal;case 10:return gArenaId;case 11:return gPlayer.type1;case 12:return gPlayer.type2;}return 0;}
EMSCRIPTEN_KEEPALIVE const char *tp_bv_nick(){return gWildTeam.count()?gWTMembers[gWildTeam.activeIndex()].nick.c_str():tp_battle_pet().nick;}
EMSCRIPTEN_KEEPALIVE int tp_battle_resolved() { return gResolved ? 1 : 0; }
EMSCRIPTEN_KEEPALIVE int tp_battle_wild_dex() { return gDex; }
EMSCRIPTEN_KEEPALIVE int tp_battle_wild_level() { return gLevel; }
EMSCRIPTEN_KEEPALIVE int tp_battle_wild_already_caught() {
  return !gTrainer&&tp_battle_pet().isCaught(gDex) ? 1 : 0;
}
EMSCRIPTEN_KEEPALIVE int tp_battle_player_hp() { return gRun.playerHp; }
EMSCRIPTEN_KEEPALIVE int tp_battle_player_max_hp() { return gRun.playerMaxHp; }
EMSCRIPTEN_KEEPALIVE int tp_battle_enemy_hp() { return gRun.enemyHp; }
EMSCRIPTEN_KEEPALIVE int tp_battle_enemy_max_hp() { return gRun.enemyMaxHp; }
EMSCRIPTEN_KEEPALIVE int tp_battle_rest_uses_left() { return gRun.restUsesLeft; }
EMSCRIPTEN_KEEPALIVE int tp_battle_attack_menu_open() { return gAttackMenuOpen ? 1 : 0; }
EMSCRIPTEN_KEEPALIVE int tp_battle_last_enemy_damage() { return gTurn.enemyDamage; }
EMSCRIPTEN_KEEPALIVE int tp_battle_player_won() { return gTurn.playerWon ? 1 : 0; }
EMSCRIPTEN_KEEPALIVE int tp_battle_round() { return gRun.round; }

EMSCRIPTEN_KEEPALIVE
const char *tp_battle_message() { return gMessage; }

EMSCRIPTEN_KEEPALIVE
const char *tp_battle_round_label() {
  static std::string out;
  char buf[14];
  snprintf(buf, sizeof(buf), T(S_ROUND_SHORT_FMT), gRun.round + 1);
  out = buf;
  return out.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char *tp_battle_player_label() {
  static std::string out;
  if(gWildTeam.count()){
    const auto &m=gWTMembers[gWildTeam.activeIndex()];
    const auto form=tpMegaById(m.form);
    const char *label=!m.nick.empty()?m.nick.c_str():
      (m.form&&form?form->name:dexName(m.entry.dex));
    char buf[96];
    snprintf(buf,sizeof(buf),"%.23s%s Lv.%u",label,
      m.form&&!m.nick.empty()?" (Mega)":"",gPlayer.level);
    out=buf;return out.c_str();
  }
  Pet &pet = tp_battle_pet();
  const char *name = pet.nick[0] ? pet.nick : (gPlayer.mega&&tpMegaById(gPlayerMegaForm)?tpMegaById(gPlayerMegaForm)->name:dexName(pet.speciesId));
  char buf[64];
  snprintf(buf, sizeof(buf), "%.23s%s Lv.%u", name, gPlayer.mega&&pet.nick[0]?" (Mega)":"", gPlayer.level);
  out = buf;
  return out.c_str();
}
EMSCRIPTEN_KEEPALIVE
const char *tp_battle_enemy_label() {
  static std::string out;
  char buf[28];
  snprintf(buf, sizeof(buf), "%s Lv.%u", dexName(gDex), gLevel);
  out = buf;
  return out.c_str();
}
EMSCRIPTEN_KEEPALIVE const char *tp_battle_rest_text() {
  static std::string out;
  char buf[18];
  snprintf(buf, sizeof(buf), "%s %u", T(S_REST), gRun.restUsesLeft);
  out = buf;
  return out.c_str();
}

// --- Actions -------------------------------------------------------------

EMSCRIPTEN_KEEPALIVE void tp_battle_open_attack_menu() { gAttackMenuOpen = true; }
EMSCRIPTEN_KEEPALIVE void tp_battle_close_attack_menu() { gAttackMenuOpen = false; }

void performAction(BattleAction action) {
  if (!gOpen||gResolved) return;
  if(gTrainer&&!trainerActorValid()){tp_battle_close();return;}
  gAttackMenuOpen = false;
  const uint16_t dealt=gRun.playerDamageTotal,taken=gRun.enemyDamageTotal;
  if(gWildTeam.count()&&!gTrainer){
    const auto result=gWildTeam.act(gRun,action,rnd100());
    if(!result.accepted)return;
    gTurn=result.turn;
    if(!result.resolved)gTurn.battleEnded=false;
  }else{
    gTurn = stepBattle(gRun, action, rnd100());
  }
  gBvDealt=uint16_t(gRun.playerDamageTotal-dealt);gBvTaken=uint16_t(gRun.enemyDamageTotal-taken);gBvHeal=gTurn.playerHeal;

  if (gTurn.restFailed) {
    snprintf(gMessage, sizeof(gMessage), "%s", T(S_NO_REST));
  } else if (gTurn.counterReady) {
    snprintf(gMessage, sizeof(gMessage), "%s", T(S_COUNTER_READY));
  } else if (gTurn.playerRested) {
    char heal[18];
    snprintf(heal, sizeof(heal), T(S_RESTED_FMT), gTurn.playerHeal);
    snprintf(gMessage, sizeof(gMessage), "%s %s", heal, T(S_GUARD));
  } else if (gTurn.playerDamage > 0) {
    if (gTurn.playerTypePct > 100) snprintf(gMessage, sizeof(gMessage), "%s %u", T(S_EFFECTIVE), gTurn.playerDamage);
    else if (gTurn.playerTypePct < 100) snprintf(gMessage, sizeof(gMessage), "%s %u", T(S_NOT_EFFECTIVE), gTurn.playerDamage);
    else snprintf(gMessage, sizeof(gMessage), T(S_HIT_FMT), gTurn.playerDamage);
  } else if (gTurn.enemyDodged) {
    snprintf(gMessage, sizeof(gMessage), "%s", T(S_ENEMY_DODGED));
  } else if (gTurn.playerDodged) {
    snprintf(gMessage, sizeof(gMessage), "%s", T(S_DODGED));
  } else {
    snprintf(gMessage, sizeof(gMessage), "%s", T(S_MISSED));
  }

  if (gTurn.battleEnded) {
    finishBattle();
    return;
  }
  if (!gLowHpWarned && gRun.playerHp > 0 && gRun.playerHp <= gRun.playerMaxHp * 3 / 10) {
    gLowHpWarned = true;
    sfxPlay(SFX_LOW_HP);
  }
  if (gTurn.restFailed) sfxPlay(SFX_DENY);
  else if (gTurn.counterReady) sfxPlay(SFX_COUNTER);
  else if (gTurn.playerRested) sfxPlay(SFX_REST);
  else if (action == BATTLE_ATTACK_QUICK) sfxPlay(SFX_ATTACK_QUICK);
  else if (action == BATTLE_ATTACK_HEAVY) sfxPlay(SFX_ATTACK_HEAVY);
  else if (gTurn.playerDamage > 0 && gTurn.playerTypePct > 100) sfxPlay(SFX_EFFECTIVE);
  else if (gTurn.playerDamage > 0 && gTurn.playerTypePct < 100) sfxPlay(SFX_WEAK_HIT);
  else if (gTurn.enemyDamage > 0) sfxPlay(SFX_ENEMY_HIT);
  else sfxPlay(gTurn.playerDamage > 0 ? SFX_PLAY : SFX_TAP);
}

EMSCRIPTEN_KEEPALIVE void tp_battle_quick_attack() { performAction(BATTLE_ATTACK_QUICK); }
EMSCRIPTEN_KEEPALIVE void tp_battle_heavy_attack() { performAction(BATTLE_ATTACK_HEAVY); }
EMSCRIPTEN_KEEPALIVE void tp_battle_dodge() { performAction(BATTLE_DODGE); }
EMSCRIPTEN_KEEPALIVE void tp_battle_rest() { performAction(BATTLE_REST); }

// --- Resolved screen -----------------------------------------------------

EMSCRIPTEN_KEEPALIVE
const char *tp_battle_result_text() { return T(gTurn.playerWon ? S_WIN : S_LOSS); }
EMSCRIPTEN_KEEPALIVE
const char *tp_battle_rounds_line() {
  static std::string out;
  char buf[48];
  snprintf(buf, sizeof(buf), T(S_ROUNDS_FMT), unsigned(gTrainerRounds+gRun.round));
  out = buf;
  return out.c_str();
}
EMSCRIPTEN_KEEPALIVE
const char *tp_battle_damage_line() {
  static std::string out;
  char buf[80];
  snprintf(buf, sizeof(buf), T(S_DAMAGE_FMT), unsigned(gTrainerDealt+gRun.playerDamageTotal), unsigned(gTrainerTaken+gRun.enemyDamageTotal));
  out = buf;
  return out.c_str();
}
EMSCRIPTEN_KEEPALIVE const char *tp_battle_reward_line() { return gRewardLine.c_str(); }
EMSCRIPTEN_KEEPALIVE int tp_battle_catch_offered() { return gCatchOffered ? 1 : 0; }
EMSCRIPTEN_KEEPALIVE int tp_battle_catch_done() { return gCatchDone ? 1 : 0; }
EMSCRIPTEN_KEEPALIVE int tp_battle_catch_tried() { return gCatchTried ? 1 : 0; }
EMSCRIPTEN_KEEPALIVE int tp_battle_catch_success() { return gCatchSuccess ? 1 : 0; }
EMSCRIPTEN_KEEPALIVE int tp_battle_respect_catch() { return gRespectCatch ? 1 : 0; }
EMSCRIPTEN_KEEPALIVE
const char *tp_battle_close_chance_text() {
  return (gRespectCatch && gCatchOffered && !gCatchDone) ? T(S_CLOSE_CHANCE) : "";
}

EMSCRIPTEN_KEEPALIVE
void tp_battle_try_catch() {
  if(gWTResultPending)return;
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  if(gF4CatchUndo.token&&!gF4QuietCatch)return;
#endif
  if (gTrainer||!gOpen||!gResolved||!gCatchOffered||gCatchDone) return;
  Pet &pet = tp_battle_pet();
  bool closeWin = gRun.playerHp <= gRun.playerMaxHp / 3;
  gCatchTried = true;
  gCatchDone = true;
  uint8_t luck = rnd100();
  if (gRespectCatch) {
    gCatchSuccess = pet.tryRespectCatchWild(gDex, gLevel, gPlayer.level, luck);
  } else {
    gCatchSuccess = pet.tryCatchWild(gDex, gLevel, gPlayer.level, closeWin, luck);
  }
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  if(!gF4QuietCatch)
#endif
  sfxPlay(gCatchSuccess ? SFX_CATCH_OK : SFX_CATCH_FAIL);
}
EMSCRIPTEN_KEEPALIVE
void tp_battle_leave_wild() {
  if(gWTResultPending)return;
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  if(gF4CatchUndo.token)return;
#endif
  gCatchDone = true;
  gCatchTried = false;
  sfxPlay(SFX_TAP);
}

// F2: guarded starts, one native roster, no intermediate awards/catches.
EMSCRIPTEN_KEEPALIVE int tp_f2_can() {
 const Pet &p=tp_battle_pet();
 return !leagueOwned()&&!gOpen&&!gWildPromptActive&&!p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving();
}
EMSCRIPTEN_KEEPALIVE int tp_f2_start(int team) {
 if(team<0||team>=int(sizeof(kTrainerTeams)/sizeof(kTrainerTeams[0]))||!tp_f2_can())return 0;
 const auto &entry=kTrainerTeams[team];
 startBattle(entry.dex[0],tp_battle_pet().level());
 const Pet &p=tp_battle_pet();
 gTrainer=true;gTrainerId=uint8_t(team);gTrainerCount=entry.count;
 gTrainerSpecies=p.speciesId;gTrainerAge=p.ageMinutes;
 gTrainerGa=p.geneAtk;gTrainerGd=p.geneDef;gTrainerGs=p.geneSpe;
 return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_f2_can_actor(){return gOpen&&gTrainer&&trainerActorValid();}
EMSCRIPTEN_KEEPALIVE int tp_f2_get(int key) {
 if(key==0)return gOpen&&gTrainer;
 if(key==1)return gTrainerCount;
 if(key==2)return gTrainerIndex;
 if(key==3)return gOpen&&gTrainer&&gTrainerNext;
 if(key==4)return gTrainerId;
 return 0;
}
EMSCRIPTEN_KEEPALIVE int tp_f2_next() {
 if(!gOpen||!gTrainer||!gResolved||!gTrainerNext||!gTurn.playerWon||!gRun.playerHp)return 0;
 if(!trainerActorValid()){tp_battle_close();return 0;}
 const uint16_t hp=gRun.playerHp,maxHp=gRun.playerMaxHp;
 const uint8_t rests=gRun.restUsesLeft;
 gTrainerRounds+=gRun.round;gTrainerDealt+=gRun.playerDamageTotal;gTrainerTaken+=gRun.enemyDamageTotal;
 ++gTrainerIndex;
 if(++gBvId==0)++gBvId;gBvDealt=gBvTaken=gBvHeal=0;
 if(gArenaId>=0){const auto *leader=arenaLeaderFor(gArenaRegion,gArenaId);if(!leader||gTrainerIndex>=leader->count){tp_battle_close();return 0;}const auto &m=leader->team[gTrainerIndex];gDex=m.dex;gLevel=m.level;}
 else gDex=kTrainerTeams[gTrainerId].dex[gTrainerIndex];
 gEnemy=wildBattleStats(gDex,gLevel);gEnemy.hp=0;
 gRun=beginBattleRuntime(gPlayer,gEnemy);
 gRun.playerHp=hp;gRun.playerMaxHp=maxHp;gRun.restUsesLeft=rests;
 gTurn=BattleTurnResult{};gMessage[0]=0;gAttackMenuOpen=false;
 gResolved=false;gTrainerNext=false;
 return 1;
}
// Profile-level arena keys live in the existing exported Preferences table.
EMSCRIPTEN_KEEPALIVE int tp_f3_mask(){return arenaMask();}
static uint32_t arenaDateFor(const TPRegionProgressKeys &keys,int id){
 if(id<0||id>=int(kKantoArenaCount)||arenaMask(keys)<0||!(arenaMask(keys)&(1<<id)))return 0;
 const auto &s=Preferences::store();const auto it=s.find(keys.arenaDatePrefix+std::to_string(id));
 if(it==s.end()||!std::holds_alternative<int64_t>(it->second))return 0;
 const auto value=std::get<int64_t>(it->second);return value>=946684800&&value<=0xffffffffLL?uint32_t(value):0;
}
EMSCRIPTEN_KEEPALIVE uint32_t tp_f3_date(int id){return arenaDateFor(TP_KANTO_KEYS,id);}
// Explicit region arguments; legacy arena entry points remain Kanto-only.
EMSCRIPTEN_KEEPALIVE int tp_region_arena_mask(int region){
 if(region<0||region>255)return -1;
 const auto *keys=tpRegionProgressKeys(uint8_t(region));return keys?arenaMask(*keys):-1;
}
EMSCRIPTEN_KEEPALIVE uint32_t tp_region_arena_date(int region,int id){
 if(region<0||region>255)return 0;
 const auto *keys=tpRegionProgressKeys(uint8_t(region));return keys?arenaDateFor(*keys,id):0;
}
EMSCRIPTEN_KEEPALIVE int tp_f3_get(int key){
 if(key==0)return gOpen&&gArenaId>=0;
 if(key==1)return gArenaId;
 if(key==2)return int(gArenaToken);
 if(key==3)return gArenaPhase;
 return 0;
}
static int arenaStartFor(int region,int id){
 const auto *leader=arenaLeaderFor(region,id);
 const auto *keys=region>=0&&region<=255?tpRegionProgressKeys(uint8_t(region)):nullptr;
 if(!leader||!keys||!tp_f2_can()||arenaMask(*keys)<0||gArenaUndo||gArenaSerial>=0x7ffffffe)return 0;
 if(!tpEnergySpend(0))return 0;
 startBattle(leader->team[0].dex,leader->team[0].level);
 const Pet &p=tp_battle_pet();gTrainer=true;gTrainerCount=leader->count;gArenaId=id;gArenaRegion=region;gArenaToken=++gArenaSerial;
 gTrainerSpecies=p.speciesId;gTrainerAge=p.ageMinutes;gTrainerGa=p.geneAtk;gTrainerGd=p.geneDef;gTrainerGs=p.geneSpe;
 return int(gArenaToken);
}
EMSCRIPTEN_KEEPALIVE int tp_f3_start(int id){return arenaStartFor(0,id);}
EMSCRIPTEN_KEEPALIVE int tp_region_arena_start(int region,int id){return arenaStartFor(region,id);}
EMSCRIPTEN_KEEPALIVE int tp_region_arena_session_region(){return gOpen&&gArenaId>=0?gArenaRegion:-1;}
static int arenaApplyFor(int region,int token){
 if(region!=gArenaRegion||!arenaLeaderFor(region,gArenaId))return 0;
 const auto *keys=tpRegionProgressKeys(uint8_t(region));if(!keys)return 0;
 if(token<=0||uint32_t(token)!=gArenaToken||gArenaId<0||!gOpen||!gTrainer||!gResolved||gTrainerNext||
 gTrainerIndex+1!=gTrainerCount||!gTurn.playerWon||!gRun.playerHp||gArenaPhase||gArenaUndo||!trainerActorValid())return 0;
 const int mask=arenaMask(*keys);if(mask<0)return 0;
 if(mask&(1<<gArenaId)){gArenaPhase=3;return 2;}
 const std::time_t clock=std::time(nullptr);if(clock<946684800||uint64_t(clock)>0xffffffffULL)return 0;
 gArenaUndo=std::make_unique<Pet>(tp_battle_pet());gArenaStore=Preferences::store();
 Preferences p;p.putUChar(keys->arenaVersion,1);p.putUChar(keys->arenaMask,uint8_t(mask|(1<<gArenaId)));
 const std::string key=keys->arenaDatePrefix+std::to_string(gArenaId);p.putUInt(key.c_str(),uint32_t(clock));gArenaPhase=1;return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_f3_apply(int token){return arenaApplyFor(0,token);}
EMSCRIPTEN_KEEPALIVE int tp_region_arena_apply(int region,int token){return arenaApplyFor(region,token);}
static int arenaFinishFor(int region,int token,int committed){
 if(region!=gArenaRegion)return 0;
 if(token<=0||uint32_t(token)!=gArenaToken||gArenaPhase!=1||!gArenaUndo||(committed!=0&&committed!=1))return 0;
 if(!committed){tp_battle_pet()=*gArenaUndo;Preferences::store()=gArenaStore;gArenaPhase=0;}else gArenaPhase=2;
 gArenaUndo.reset();gArenaStore.clear();return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_f3_finish(int token,int committed){return arenaFinishFor(0,token,committed);}
EMSCRIPTEN_KEEPALIVE int tp_region_arena_finish(int region,int token,int committed){return arenaFinishFor(region,token,committed);}
EMSCRIPTEN_KEEPALIVE const char *tp_f3_catalog(){
 static std::string out;out="[";
 for(unsigned i=0;i<kKantoArenaCount;++i){if(i)out+=",";const auto &l=kKantoArenas[i];
 out+="{\"id\":\""+std::string(l.id)+"\",\"name\":\""+l.name+"\",\"city\":\""+l.city+"\",\"badge\":\""+l.badge+"\",\"team\":[";
 for(unsigned j=0;j<l.count;++j){if(j)out+=",";out+="["+std::to_string(l.team[j].dex)+","+std::to_string(l.team[j].level)+"]";}out+="]}";}
 out+="]";return out.c_str();
}
EMSCRIPTEN_KEEPALIVE int tp_e_battle_form(){return gOpen?gPlayerMegaForm:0;}
EMSCRIPTEN_KEEPALIVE int tp_e_battle_mega(){return gOpen&&gPlayer.mega;}
EMSCRIPTEN_KEEPALIVE int tp_e_battle_type1(){return gPlayer.type1;}
EMSCRIPTEN_KEEPALIVE int tp_e_battle_type2(){return gPlayer.type2;}

#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
extern uint32_t tp_f4_store_begin_catch_context();
extern int tp_f4_store_finish(uint32_t,int);
static bool f4CaptureEligible(){const auto&p=tp_battle_pet();return !gWTResultPending&&!gTrainer&&gArenaId<0&&!gArenaUndo&&gOpen&&gResolved&&gCatchOffered&&!gCatchDone&&!p.isEgg()&&p.ceremony==CER_NONE&&p.speciesId==gF4ActorDex&&p.shiny==gF4ActorShiny&&p.geneAtk==gF4ActorGa&&p.geneDef==gF4ActorGd&&p.geneSpe==gF4ActorGs&&p.ageMinutes>=gF4ActorAge;}
EMSCRIPTEN_KEEPALIVE int tp_f4_capture_audio_quiet(){return gF4QuietCatch?1:0;}
EMSCRIPTEN_KEEPALIVE int tp_f4_capture_battle_id(){return gOpen&&!gTrainer?int(gF4BattleId&0x7fffffffu):0;}
EMSCRIPTEN_KEEPALIVE const char *tp_f4_capture_snapshot(){
 static std::string out;if(!gOpen||gTrainer||gDex<1||gDex>DEX_COUNT){out="null";return out.c_str();}
 out="{\"dex\":"+std::to_string(gDex)+",\"level\":"+std::to_string(gLevel)+",\"nickname\":\"\",\"shiny\":false,\"origin\":\"wild\",\"data\":{\"stats\":{\"atk\":"+std::to_string(gEnemy.atk)+",\"def\":"+std::to_string(gEnemy.def)+",\"spe\":"+std::to_string(gEnemy.spe)+"},\"genes\":null,\"training\":null";
 if(gF4CatchEpoch&&gF4Outcome==1)out+=",\"capturedAt\":"+std::to_string(gF4CatchEpoch);
 out+="}}";return out.c_str();
}
EMSCRIPTEN_KEEPALIVE uint32_t tp_f4_capture_begin(){
 if(gF4CatchUndo.token||!f4CaptureEligible())return 0;
 const auto token=tp_f4_store_begin_catch_context();if(!token)return 0;
 gF4CatchUndo={token,gCatchTried,gCatchDone,gCatchSuccess,false};return token;
}
EMSCRIPTEN_KEEPALIVE int tp_f4_capture_attempt(uint32_t token){
 if(!token||gF4CatchUndo.token!=token||gF4CatchUndo.attempted||!f4CaptureEligible())return -1;
 gF4CatchUndo.attempted=true;
 if(gF4Outcome<0){gF4QuietCatch=true;tp_battle_try_catch();gF4QuietCatch=false;gF4Outcome=gCatchSuccess?1:0;gF4CatchEpoch=uint32_t(std::time(nullptr));}
 else{
  // Re-apply the already rolled result, never a new random chance. Current
  // existing chance bounds make 0 replay success and 99 replay failure.
  Pet&p=tp_battle_pet();const uint8_t replay=gF4Outcome?0:99;
  gCatchTried=gCatchDone=true;gF4QuietCatch=true;
  gCatchSuccess=gRespectCatch?p.tryRespectCatchWild(gDex,gLevel,gPlayer.level,replay):p.tryCatchWild(gDex,gLevel,gPlayer.level,gRun.playerHp<=gRun.playerMaxHp/3,replay);
  gF4QuietCatch=false;if(int(gCatchSuccess)!=gF4Outcome)return -2;
 }
 return gF4Outcome;
}
EMSCRIPTEN_KEEPALIVE int tp_f4_capture_finish(uint32_t token,int commit){
 if(!token||gF4CatchUndo.token!=token||(commit!=0&&commit!=1))return 0;
 if(!tp_f4_store_finish(token,commit))return 0;
 if(!commit){gCatchTried=gF4CatchUndo.tried;gCatchDone=gF4CatchUndo.done;gCatchSuccess=gF4CatchUndo.success;}
 gF4CatchUndo={};return 1;
}
#endif


// P05 native entry points. Not yet enabled by the browser start buttons.
static bool wtStoreFree(){
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  extern int tp_f4_store_pending();
  return tp_f4_store_pending()==0;
#else
  return true;
#endif
}

static std::string wtQuote(const std::string &value){
  std::string out="\"";
  for(const unsigned char c:value){
    if(c=='"'||c=='\\'){out+='\\';out+=char(c);}
    else if(c<32){
      char escaped[7];
      snprintf(escaped,sizeof(escaped),"\\u%04x",unsigned(c));
      out+=escaped;
    }else out+=char(c);
  }
  return out+'"';
}

EMSCRIPTEN_KEEPALIVE int tp_wt_stage_begin(int count){
  if(count<1||count>6||gOpen||leagueOwned()||gArenaUndo||
     !wtStoreFree()||!tp_battle_can_start()||
     tp_battle_pet().evolving())return 0;
  gWTMembers={};
  gWTStageCount=unsigned(count);gWTStageMask=0;
  return 1;
}

EMSCRIPTEN_KEEPALIVE int tp_wt_stage_entry(
    int index,uint32_t id,int dex,int level,int atk,int def,int spe,
    int care,int shiny,const char *nick){
  if(gOpen||!gWTStageCount||index<0||unsigned(index)>=gWTStageCount||
     (gWTStageMask&(1u<<index))||!id||id==0xffffffffu||
     dex<1||dex>DEX_COUNT||level<1||level>100||
     atk<1||atk>65535||def<1||def>65535||spe<1||spe>65535||
     (care!=0&&care!=1)||(shiny!=0&&shiny!=1)||
     !nick||std::strlen(nick)>23)return 0;
  for(unsigned i=0;i<gWTStageCount;i++)
    if((gWTStageMask&(1u<<i))&&gWTMembers[i].entry.id==id)return 0;

  BattleStats stats{};
  uint8_t form=0;
  std::string name=nick;
  bool isShiny=shiny!=0;
  if(care){
    const auto &p=tp_battle_pet();
    if(dex!=p.speciesId||level!=p.level()||isShiny!=p.shiny)return 0;
    stats=realPlayerStats();
    form=stats.mega?p.megaFormId():0;
    name=p.nick;
  }else{
    stats.level=uint8_t(level);
    stats.atk=uint16_t(atk);stats.def=uint16_t(def);stats.spe=uint16_t(spe);
    stats.type1=DEX_TBL[dex].type1;stats.type2=DEX_TBL[dex].type2;
  }
  auto &m=gWTMembers[unsigned(index)];
  m.entry={id,int16_t(dex),stats};
  m.nick=name;m.shiny=isShiny;m.care=care!=0;m.form=form;
  gWTStageMask|=1u<<index;
  return 1;
}

EMSCRIPTEN_KEEPALIVE int tp_wt_start(int prompt){
  if((prompt!=0&&prompt!=1)||gOpen||leagueOwned()||gArenaUndo||
     !wtStoreFree()||!tp_battle_can_start()||
     tp_battle_pet().evolving()||!gWTStageCount||
     gWTStageMask!=((1u<<gWTStageCount)-1u))return 0;
  if(prompt&&!tp_wild_prompt_active())return 0;
  if(!prompt&&gWildPromptActive)return 0;

  const unsigned count=gWTStageCount;
  TPWildTeamEntry entries[6]{};
  for(unsigned i=0;i<count;i++)entries[i]=gWTMembers[i].entry;
  const int16_t dex=prompt?gWildPromptDex:0;
  const uint8_t level=prompt?gWildPromptLevel:0;

  startBattle(dex,level);
  if(!gOpen||!gWildTeam.begin(gRun,entries,count,gEnemy)){
    if(gOpen)tp_battle_close();
    return 0;
  }
  gWTStageCount=gWTStageMask=0;
  gPlayer=gRun.player;
  gPlayerMegaForm=gWTMembers[0].form;
  return 1;
}

EMSCRIPTEN_KEEPALIVE int tp_wt_switch(int index){
  if(!gOpen||gTrainer||gResolved||gWTResultPending||index<0||
     !gWildTeam.count())return 0;
  const auto dealt=gRun.playerDamageTotal,taken=gRun.enemyDamageTotal;
  const auto result=gWildTeam.select(gRun,unsigned(index),rnd100());
  if(!result.accepted)return 0;
  gPlayer=gRun.player;
  gPlayerMegaForm=gWTMembers[gWildTeam.activeIndex()].form;
  gTurn=result.turn;
  if(!result.resolved)gTurn.battleEnded=false;
  gBvDealt=uint16_t(gRun.playerDamageTotal-dealt);
  gBvTaken=uint16_t(gRun.enemyDamageTotal-taken);
  gBvHeal=0;gAttackMenuOpen=false;gLowHpWarned=false;gMessage[0]=0;
  if(result.resolved)finishBattle();
  return 1;
}

EMSCRIPTEN_KEEPALIVE int tp_wt_player_dex(){
  return gWildTeam.count()?
    gWTMembers[gWildTeam.activeIndex()].entry.dex:tp_battle_pet().speciesId;
}

EMSCRIPTEN_KEEPALIVE const char *tp_wt_view(){
  static std::string out;
  const auto count=gWildTeam.count();
  out="{\"live\":"+std::to_string(gOpen&&count?1:0)+
    ",\"count\":"+std::to_string(count)+
    ",\"active\":"+std::to_string(gWildTeam.activeIndex())+
    ",\"needsSwitch\":"+(gWildTeam.needsSwitch()?std::string("true"):"false")+
    ",\"resultPending\":"+(gWTResultPending?std::string("true"):"false")+
    ",\"winnerId\":"+std::to_string(
      gResolved&&gTurn.playerWon?gWildTeam.activeId():0)+
    ",\"members\":[";
  for(unsigned i=0;i<count;i++){
    if(i)out+=",";
    const auto &m=gWTMembers[i];
    const auto &s=m.entry.stats;
    out+="{\"id\":"+std::to_string(m.entry.id)+
      ",\"dex\":"+std::to_string(m.entry.dex)+
      ",\"level\":"+std::to_string(s.level)+
      ",\"nick\":"+wtQuote(m.nick)+
      ",\"shiny\":"+(m.shiny?std::string("true"):"false")+
      ",\"form\":"+std::to_string(m.form)+
      ",\"hp\":"+std::to_string(gWildTeam.hp(i))+
      ",\"maxHp\":"+std::to_string(gWildTeam.maxHp(i))+"}";
  }
  out+="]}";return out.c_str();
}


// P05 result transaction. JS must stage the validated complete collection
// and confirm the whole-save durable write before committing this token.
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
extern uint32_t tp_f4_store_begin_wild_result_context();
extern int tp_f4_store_finish(uint32_t,int);

static bool wtResultActorValid(){
  const auto &p=tp_battle_pet();
  return !p.isEgg()&&p.ceremony==CER_NONE&&
    p.speciesId==gF4ActorDex&&p.shiny==gF4ActorShiny&&
    p.geneAtk==gF4ActorGa&&p.geneDef==gF4ActorGd&&
    p.geneSpe==gF4ActorGs&&p.ageMinutes>=gF4ActorAge;
}
#endif

EMSCRIPTEN_KEEPALIVE uint32_t tp_wt_result_begin(){
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  if(!gOpen||gTrainer||!gResolved||!gWildTeam.count()||
     !gWTResultPending||gWTResultUndo.token||!wtResultActorValid())return 0;
  const auto token=tp_f4_store_begin_wild_result_context();
  if(!token)return 0;
  gWTResultUndo={token,false};
  return token;
#else
  return 0;
#endif
}

EMSCRIPTEN_KEEPALIVE int tp_wt_result_apply(uint32_t token,uint32_t winnerId){
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  if(!token||token!=gWTResultUndo.token||gWTResultUndo.applied||
     !gWTResultPending||!wtResultActorValid())return 0;
  const uint32_t expected=gTurn.playerWon?gWildTeam.activeId():0;
  if(winnerId!=expected)return 0;

  auto &p=tp_battle_pet();
  const auto &winner=gWTMembers[gWildTeam.activeIndex()];
  if(gTurn.playerWon&&winner.care&&p.level()<100){
    if(!p.grantBattleLevel())return 0;
  }

  // Preserve the existing catch policy, using the frozen combat level.
  // No training bonus or legacy care win/loss method is called here.
  gCatchTried=gCatchDone=gCatchSuccess=false;
  gRespectCatch=false;
  if(gTurn.playerWon){
    const bool closeWin=gRun.playerHp<=gRun.playerMaxHp/3;
    gCatchChance=p.catchChanceForWild(gDex,gLevel,gPlayer.level,closeWin);
    gCatchOffered=true;
  }else{
    const bool closeLoss=gRun.enemyHp>0&&
      uint32_t(gRun.enemyHp)*100UL<=uint32_t(gRun.enemyMaxHp)*30UL;
    gCatchChance=closeLoss?
      p.respectCatchChanceForWild(gDex,gLevel,gPlayer.level):0;
    gCatchOffered=gCatchChance>0;
    gRespectCatch=gCatchOffered;
  }
  if(!p.recordWildBattleOutcome(gTurn.playerWon))return 0;
  gWTResultUndo.applied=true;
  return 1;
#else
  (void)token;(void)winnerId;
  return 0;
#endif
}

EMSCRIPTEN_KEEPALIVE int tp_wt_result_finish(uint32_t token,int commit){
#if defined(__EMSCRIPTEN__) || defined(TP_F4_CAPTURE_TEST)
  if(!token||token!=gWTResultUndo.token||(commit!=0&&commit!=1)||
     (commit&&!gWTResultUndo.applied))return 0;
  if(!tp_f4_store_finish(token,commit))return 0;
  if(commit){
    gWTResultPending=false;
  }else{
    gCatchOffered=gCatchTried=gCatchDone=gCatchSuccess=gRespectCatch=false;
    gCatchChance=0;
  }
  gWTResultUndo={};
  return 1;
#else
  (void)token;(void)commit;
  return 0;
#endif
}

} // extern "C"
