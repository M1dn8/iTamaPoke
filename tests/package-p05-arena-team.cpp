#include <cassert>
#include <ctime>
#include <iostream>
#include <string>
#include "pet.h"

uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}

static Pet hero;
Pet &tp_battle_pet(){return hero;}
extern "C" int tp_is_egg(){return hero.isEgg();}
extern "C" int tp_sleeping(){return hero.sleeping;}
extern "C" int tp_species_id(){return hero.speciesId;}
extern "C" int tp_level(){return hero.level();}

#include "../browser_ver/core/browser_battle.cpp"
#include "../browser_ver/core/browser_league.cpp"
#include "../browser_ver/core/browser_battle_energy.cpp"

extern "C" int tp_f4_store_pending();
extern "C" int tp_f4_store_stage(uint32_t,const uint8_t*,int);

static void setup(){
  assert(!gArenaUndo);
  assert(!tp_energy_detail::arenaToken);
  assert(!tp_f4_store_pending());
  tp_lg_abort();
  tp_battle_close();
  gWildPromptActive=false;
  Preferences::store().clear();

  Preferences p;
  p.putBool("init",true);
  p.putShort("dexn",150);
  p.putShort("eggT2",150);
  p.putUInt("age",5940);
  for(const char *key:{
      "gatk","gdef","gspe","tatk","tdef","tspe",
      "full","joy","ene","hyg","bond"})
    p.putUChar(key,100);
  p.putUChar("mgver",3);
  p.putString("nick","Care");

  hero=Pet();
  hero.begin();
  hero.setClock(uint32_t(std::time(nullptr)));
  hero.energy=100;
  p.putUChar("ene",100);
  std::srand(7);

  assert(tp_f3_mask()==0);
  assert(tp_region_arena_mask(1)==0);
}

static void stage(){
  assert(tp_wt_stage_begin(2)==1);
  assert(tp_wt_stage_entry(
    0,100,25,30,400,400,400,0,0,"Alpha")==1);
  assert(tp_wt_stage_entry(
    1,101,25,30,400,400,400,0,0,"Beta")==1);
}

static int beginPaid(int region){
  stage();
  const auto entry=tp_region_energy_arena_begin(region,0);
  assert(entry && hero.energy==75);
  assert(tp_f4_store_pending());
  const int token=tp_f3_get(2);
  assert(token>0);

  assert(!tp_wt_arena_attach(token+1));
  assert(gWildTeam.count()==0);
  assert(tp_wt_arena_attach(token)==1);
  assert(gWildTeam.count()==2);
  assert(!tp_wt_arena_attach(token));
  assert(tp_wt_player_dex()==25);
  assert(gPlayer.level==30 && gPlayer.atk==400);
  assert(gRun.restUsesLeft==2);
  assert(gWTStageCount==0 && gWTStageMask==0);

  assert(tp_region_energy_arena_finish(region,entry,1)==token);
  assert(!tp_f4_store_pending());
  return token;
}

// Prepared low enemy HP, but attacks still use the real native action path.
static void winCurrent(){
  const auto index=gWildTeam.activeIndex();
  const auto before=gWTArenaLevelGains;
  const unsigned frozenLevel=gWTMembers[index].entry.stats.level;
  gRun.enemyHp=1;
  for(unsigned turn=0;turn<100&&!gResolved;turn++)
    performAction(BATTLE_ATTACK_QUICK);
  assert(gResolved && gTurn.playerWon);
  assert(gWildTeam.resolved());
  assert(gRun.playerHp>0 && gRun.enemyHp==0);
  const unsigned expected=before[index]+
    (frozenLevel+before[index]<100?1u:0u);
  assert(gWTArenaLevelGains[index]==expected);
  for(unsigned i=0;i<gWildTeam.count();i++)
    if(i!=index)assert(gWTArenaLevelGains[i]==before[i]);
  const auto counted=gWTArenaLevelGains;
  finishBattle();
  assert(gWTArenaLevelGains==counted);
}

// Deliberately overwhelming enemy fixture to exercise own-member defeat.
static void defeatCurrent(){
  gRun.playerHp=1;
  gRun.enemyHp=65535;
  gRun.enemyMaxHp=65535;
  gRun.enemy.atk=65535;
  gRun.enemy.def=65535;
  gRun.enemy.spe=65535;
  for(unsigned turn=0;
      turn<100&&!gResolved&&!gWildTeam.needsSwitch();turn++)
    performAction(BATTLE_ATTACK_HEAVY);
  assert(gRun.playerHp==0);
}


static void stageResultTransport(uint32_t token){
  const char bytes[]="P05b native arena result transport fixture";
  assert(tp_f4_store_stage(token,
    reinterpret_cast<const uint8_t*>(bytes),sizeof(bytes)-1));
}

static void commitResult(int region,int session,int expected){
  const auto token=tp_wt_arena_result_begin(region,session);
  assert(token && tp_f4_store_pending());
  assert(!tp_wt_arena_result_finish(region,session,token,1));
  assert(tp_wt_arena_result_apply(region,session,token)==expected);
  assert(!tp_wt_arena_result_apply(region,session,token));
  stageResultTransport(token);
  assert(tp_wt_arena_result_finish(region,session,token,1));
  assert(gWTArenaResultDone && !tp_f4_store_pending());
  assert(!tp_wt_arena_result_begin(region,session));
  assert(!tp_wt_arena_result_finish(region,session,token,1));
}

int main(){
  // An arena start can be rolled back after successful team attachment.
  setup();
  const auto original=Preferences::store();
  stage();
  auto entry=tp_region_energy_arena_begin(1,0);
  assert(entry && hero.energy==75);
  int token=tp_f3_get(2);
  assert(tp_wt_arena_attach(token));
  assert(gWildTeam.count()==2 && gOpen);
  assert(tp_region_energy_arena_finish(1,entry,0)==1);
  assert(Preferences::store()==original && hero.energy==100);
  assert(!gOpen && gWildTeam.count()==0);
  assert(!tp_f4_store_pending());
  assert(!tp_wt_arena_attach(token));
  assert(tp_region_arena_session_region()==-1);

  // A normal trainer session cannot receive an arena attachment.
  setup();
  stage();
  assert(tp_f2_start(0));
  assert(!tp_wt_arena_attach(1));
  assert(gWildTeam.count()==0);
  tp_battle_close();

  // Both regions: individual rests, enemy advance, final-only own badge.
  for(int region=0;region<2;region++){
    setup();
    token=beginPaid(region);
    const auto paidStore=Preferences::store();
    const auto careDex=hero.speciesId;
    const auto careAge=hero.ageMinutes;
    const auto careLevel=hero.level();
    const std::string careName=hero.nick;

    assert(tp_region_arena_session_region()==region);
    assert(!tp_region_arena_apply(region,token));

    performAction(BATTLE_REST);
    assert(!gResolved && gRun.restUsesLeft==1);
    performAction(BATTLE_REST);
    assert(!gResolved && gRun.restUsesLeft==0);

    assert(tp_wt_switch(1));
    assert(gWildTeam.activeId()==101);
    assert(gRun.restUsesLeft==2);
    performAction(BATTLE_REST);
    assert(!gResolved && gRun.restUsesLeft==1);

    assert(tp_wt_switch(0));
    assert(gRun.restUsesLeft==0);
    assert(tp_wt_switch(1));
    assert(gRun.restUsesLeft==1);

    winCurrent();
    assert(gTrainerNext);
    assert(!tp_region_arena_apply(region,token));
    assert(tp_region_arena_mask(region)==0);
    assert(!gCatchOffered);

    const auto hp=gRun.playerHp;
    const auto maxHp=gRun.playerMaxHp;
    const auto rests=gRun.restUsesLeft;
    const auto reserveHp=gWildTeam.hp(0);
    const auto frozen=gPlayer;
    assert(tp_f2_next());

    const auto *leader=arenaLeaderFor(region,0);
    assert(leader && leader->count==2);
    assert(gTrainerIndex==1);
    assert(gDex==leader->team[1].dex);
    assert(gLevel==leader->team[1].level);
    assert(gWildTeam.activeId()==101);
    assert(gRun.playerHp==hp && gRun.playerMaxHp==maxHp);
    assert(gRun.restUsesLeft==rests);
    assert(gWildTeam.hp(0)==reserveHp);
    assert(gPlayer.level==frozen.level);
    assert(gPlayer.atk==frozen.atk);
    assert(gPlayer.def==frozen.def);
    assert(gPlayer.spe==frozen.spe);
    assert(!gResolved && !gTrainerNext);
    assert(!gWildTeam.resolved());
    assert(!tp_f2_next());

    assert(tp_wt_switch(0));
    assert(gRun.restUsesLeft==0);
    assert(tp_wt_switch(1));
    assert(gRun.restUsesLeft==1);

    winCurrent();
    assert(!gTrainerNext && gTrainerIndex+1==gTrainerCount);
    assert(gWTArenaLevelGains[0]==0);
    assert(gWTArenaLevelGains[1]==2);
    assert(!gCatchOffered);
    assert(Preferences::store()==paidStore);
    assert(hero.speciesId==careDex && hero.ageMinutes==careAge);
    assert(hero.level()==careLevel && std::string(hero.nick)==careName);
    assert(hero.energy==75);

    assert(!tp_region_arena_apply(1-region,token));
    assert(!tp_region_arena_apply(region,token));
    commitResult(region,token,1);
    assert(tp_region_arena_mask(region)==1);
    assert(tp_region_arena_mask(1-region)==0);
    tp_battle_close();
    assert(gWildTeam.count()==0);
  }

  // Defeated members remain unavailable after a subsequent enemy advance.
  setup();
  token=beginPaid(1);
  defeatCurrent();
  assert(!gResolved && gWildTeam.needsSwitch());
  assert(gWildTeam.hp(0)==0);
  assert(!tp_f2_next());
  assert(!tp_region_arena_apply(1,token));

  const auto rounds=gRun.round;
  const auto taken=gRun.enemyDamageTotal;
  const auto enemyHp=gRun.enemyHp;
  assert(tp_wt_switch(1));
  assert(gRun.round==rounds);
  assert(gRun.enemyDamageTotal==taken);
  assert(gRun.enemyHp==enemyHp);
  assert(gRun.playerHp==gWildTeam.maxHp(1));
  assert(gRun.restUsesLeft==2);
  assert(!tp_wt_switch(0));

  // Remove the overwhelming test fixture before the winning attack.
  gRun.enemy=gEnemy;
  winCurrent();
  assert(gTrainerNext && tp_f2_next());
  assert(gWildTeam.hp(0)==0);
  assert(gWildTeam.activeId()==101);
  assert(!tp_wt_switch(0));
  winCurrent();
  assert(!tp_region_arena_apply(1,token));
  commitResult(1,token,1);
  tp_battle_close();

  // Two KOs must stop at 100, based on the frozen starting level.
  for(int startingLevel:{99,100}){
    setup();
    assert(tp_wt_stage_begin(1)==1);
    assert(tp_wt_stage_entry(
      0,300,25,startingLevel,400,400,400,0,0,"Cap")==1);
    const auto capEntry=tp_region_energy_arena_begin(0,0);
    assert(capEntry);
    const int capToken=tp_f3_get(2);
    assert(tp_wt_arena_attach(capToken));
    assert(tp_region_energy_arena_finish(0,capEntry,1)==capToken);
    const auto unchangedStore=Preferences::store();

    winCurrent();
    assert(gTrainerNext);
    assert(gWTArenaLevelGains[0]==unsigned(100-startingLevel));
    assert(tp_f2_next());
    assert(gPlayer.level==startingLevel);
    winCurrent();
    assert(!gTrainerNext);
    assert(gWTArenaLevelGains[0]==unsigned(100-startingLevel));
    assert(gPlayer.level==startingLevel);
    assert(Preferences::store()==unchangedStore);

    tp_battle_close();
    for(const auto gain:gWTArenaLevelGains)assert(gain==0);
  }

  // Entire team defeated: no opponent advance, catch or badge.
  setup();
  token=beginPaid(0);
  const auto paidStore=Preferences::store();
  defeatCurrent();
  assert(gWildTeam.needsSwitch() && !gResolved);
  assert(tp_wt_switch(1));
  defeatCurrent();
  assert(gResolved && !gTurn.playerWon);
  assert(gWildTeam.resolved() && !gWildTeam.needsSwitch());
  assert(gWildTeam.hp(0)==0 && gWildTeam.hp(1)==0);
  assert(!tp_f2_next() && !tp_wt_switch(0));
  assert(!tp_region_arena_apply(0,token));
  assert(!tp_f3_mask() && !tp_region_arena_mask(1));
  assert(!gCatchOffered && hero.energy==75);
  assert(Preferences::store()==paidStore);
  tp_battle_close();


  // Care winner: whole-Pet/store rollback, then exactly one committed gain.
  setup();
  hero.ageMinutes=9*MINUTES_PER_LEVEL;
  Preferences().putUInt("age",hero.ageMinutes);
  assert(hero.level()==10);
  assert(tp_wt_stage_begin(2));
  assert(tp_wt_stage_entry(
    0,100,hero.speciesId,hero.level(),
    hero.atkStat(),hero.defStat(),hero.speStat(),1,hero.shiny,""));
  assert(tp_wt_stage_entry(
    1,101,25,30,400,400,400,0,0,"Beta"));
  entry=tp_region_energy_arena_begin(1,0);
  assert(entry);
  token=tp_f3_get(2);
  assert(tp_wt_arena_attach(token));
  assert(tp_region_energy_arena_finish(1,entry,1)==token);
  winCurrent();
  assert(tp_f2_next());
  assert(tp_wt_switch(1));
  winCurrent();
  assert(gWTArenaLevelGains[0]==1 && gWTArenaLevelGains[1]==1);

  const auto careStore=Preferences::store();
  const auto careAge=hero.ageMinutes;
  const auto careBonus=hero.battleLevelBonus;
  const auto careWins=hero.battleWins;
  const auto careLosses=hero.battleLosses;
  const auto careEnergy=hero.energy;
  const auto careJoy=hero.joy;

  assert(!tp_wt_arena_result_begin(0,token));
  auto result=tp_wt_arena_result_begin(1,token);
  assert(result && !tp_wt_arena_result_begin(1,token));
  assert(!tp_wt_arena_result_apply(0,token,result));
  assert(!tp_wt_arena_result_apply(1,token+1,result));
  assert(!tp_wt_arena_result_apply(1,token,result+1));
  tp_battle_close();
  assert(gOpen);
  assert(tp_wt_arena_result_apply(1,token,result)==1);
  assert(hero.level()==11 && hero.battleLevelBonus==careBonus+1);
  assert(hero.ageMinutes==careAge);
  assert(hero.battleWins==careWins && hero.battleLosses==careLosses);
  assert(hero.energy==careEnergy && hero.joy==careJoy);
  assert(gPlayer.level==30);
  assert(tp_region_arena_mask(1)==1);
  stageResultTransport(result);
  assert(!tp_wt_arena_result_finish(0,token,result,0));
  assert(tp_wt_arena_result_finish(1,token,result,0));
  assert(Preferences::store()==careStore);
  assert(hero.level()==10 && hero.battleLevelBonus==careBonus);
  assert(!gWTArenaResultDone && !tp_region_arena_mask(1));
  assert(gWTArenaLevelGains[0]==1 && gWTArenaLevelGains[1]==1);

  commitResult(1,token,1);
  assert(hero.level()==11 && hero.battleLevelBonus==careBonus+1);
  Pet restored;
  restored.begin();
  assert(restored.level()==11);
  assert(tp_region_arena_mask(1)==1 && tp_region_arena_mask(0)==0);
  tp_battle_close();

  // Repeat victory still has a result transaction; badge date stays fixed.
  setup();
  token=beginPaid(0);
  winCurrent();assert(tp_f2_next());winCurrent();
  commitResult(0,token,1);
  const auto badgeDate=tp_f3_date(0);
  tp_battle_close();
  hero.energy=100;Preferences().putUChar("ene",100);
  token=beginPaid(0);
  winCurrent();assert(tp_f2_next());winCurrent();
  const auto repeatStore=Preferences::store();
  result=tp_wt_arena_result_begin(0,token);
  assert(result);
  assert(tp_wt_arena_result_apply(0,token,result)==2);
  stageResultTransport(result);
  assert(tp_wt_arena_result_finish(0,token,result,0));
  assert(Preferences::store()==repeatStore && tp_f3_date(0)==badgeDate);
  commitResult(0,token,2);
  assert(tp_f3_date(0)==badgeDate);
  tp_battle_close();

  // Loss after one KO retains earned gains for the result/retry.
  setup();
  token=beginPaid(1);
  winCurrent();assert(tp_f2_next());
  defeatCurrent();assert(gWildTeam.needsSwitch());
  assert(tp_wt_switch(1));
  defeatCurrent();
  assert(gResolved && !gTurn.playerWon && !gTrainerNext);
  assert(gWTArenaLevelGains[0]==1 && gWTArenaLevelGains[1]==0);
  const auto lossStore=Preferences::store();
  result=tp_wt_arena_result_begin(1,token);
  assert(result);
  assert(tp_wt_arena_result_apply(1,token,result)==3);
  stageResultTransport(result);
  assert(tp_wt_arena_result_finish(1,token,result,0));
  assert(Preferences::store()==lossStore);
  assert(gWTArenaLevelGains[0]==1 && !gWTArenaResultDone);
  commitResult(1,token,3);
  assert(!tp_f3_mask() && !tp_region_arena_mask(1));
  assert(hero.energy==75);
  tp_battle_close();

  std::cout
    <<"P05b native arena team passed: pre-commit attachment, paid-start "
      "rollback, trainer exclusion, Kanto/Johto series, individual rests, "
      "frozen stats and HP carry, forced switch without extra turn, "
      "persistent fainted members, full-team loss, final-only regional "
      "badges, per-winner deferred gains, duplicate-finish protection, "
      "level 99/100 caps and discard on close. Synthetic KO fixtures; "
      "combined care/store/badge rollback and retry, care-level reload, "
      "cross-region/token guards, repeat-date stability and loss-after-KO "
      "result commit. No validated stored-member update, real durable "
      "browser write or balancing claimed.\n";
}
