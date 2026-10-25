#include <cassert>
#include <cstring>
#include <iostream>
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

static void load(){
  tp_battle_close();
  gWildPromptActive=false;
  Preferences::store().clear();
  Preferences p;
  p.putBool("init",true);p.putShort("dexn",1);p.putShort("eggT2",1);
  p.putUInt("age",540);
  for(const char *key:{"full","joy","ene","hyg","gatk","gdef","gspe"})
    p.putUChar(key,100);
  hero=Pet();hero.begin();
}

static void stage(){
  assert(tp_wt_stage_begin(2));
  assert(tp_wt_stage_entry(0,101,1,10,
    hero.atkStat(),hero.defStat(),hero.speStat(),1,hero.shiny,"ignored"));
  const auto s=wildBattleStats(25,20);
  assert(tp_wt_stage_entry(1,102,25,20,s.atk,s.def,s.spe,0,1,"Blitz \"Zwei\""));
}

int main(){
  load();
  assert(!tp_wt_stage_begin(0)&&!tp_wt_stage_begin(7));
  assert(tp_wt_stage_begin(2));
  assert(tp_wt_stage_entry(0,101,1,10,
    hero.atkStat(),hero.defStat(),hero.speStat(),1,hero.shiny,""));
  assert(!tp_wt_stage_entry(1,101,25,20,70,70,70,0,0,"duplicate"));
  assert(!tp_wt_start(0)&&!gOpen);
  stage();
  assert(tp_wt_start(0)&&gOpen&&!gTrainer);
  assert(gWildTeam.count()==2&&gWildTeam.activeId()==101);
  assert(tp_wt_player_dex()==1&&gPlayer.level==10);
  assert(gLevel>=1&&gLevel<=30);
  assert(!tp_wt_stage_begin(2)&&!tp_wt_start(0));

  const auto careDex=hero.speciesId;
  const auto careAge=hero.ageMinutes;
  const auto rounds=gRun.round;
  assert(tp_wt_switch(1));
  assert(gRun.round==rounds+1&&gPlayer.level==20);
  assert(tp_wt_player_dex()==25&&tp_bv_get(6)==1);
  assert(std::strcmp(tp_bv_nick(),"Blitz \"Zwei\"")==0);
  assert(std::string(tp_wt_view()).find("Blitz \\\"Zwei\\\"")!=std::string::npos);
  assert(hero.speciesId==careDex&&hero.ageMinutes==careAge);
  tp_battle_close();
  assert(!gWildTeam.count()&&!gWTResultPending);

  // Prompt is not consumed if the staged roster is incomplete.
  load();
  gWildPromptActive=true;gWildPromptDex=143;gWildPromptLevel=30;
  gWildPromptUntilMs=g_millis+20000;
  assert(tp_wt_stage_begin(2));
  assert(!tp_wt_start(1)&&gWildPromptActive&&!gOpen);
  stage();
  assert(tp_wt_start(1)&&!gWildPromptActive);
  assert(gDex==143&&gLevel==30);

  // A member KO does not execute the legacy final-loss path.
  const auto losses=hero.battleLosses;
  gRun.playerHp=1;
  performAction(BATTLE_ATTACK_HEAVY);
  assert(gWildTeam.needsSwitch()&&!gResolved);
  assert(hero.battleLosses==losses);
  const auto forcedRound=gRun.round;
  const auto forcedTaken=gRun.enemyDamageTotal;
  assert(tp_wt_switch(1));
  assert(gRun.round==forcedRound&&gRun.enemyDamageTotal==forcedTaken);
  assert(!tp_wt_switch(0));
  tp_battle_close();

  // Final victory is pending, without care reward or premature capture.
  bool won=false;
  for(unsigned seed=0;seed<100&&!won;seed++){
    load();stage();assert(tp_wt_start(0));assert(tp_wt_switch(1));
    const auto oldStore=Preferences::store();
    const auto oldWins=hero.battleWins;
    const auto oldBonus=hero.battleLevelBonus;
    const auto oldAtk=hero.trAtk,oldDef=hero.trDef,oldSpe=hero.trSpe;
    gRun.enemyHp=1;
    std::srand(seed);
    performAction(BATTLE_ATTACK_HEAVY);
    if(gResolved&&gTurn.playerWon){
      won=true;
      assert(gWTResultPending&&gWildTeam.activeId()==102);
      assert(std::string(tp_wt_view()).find("\"winnerId\":102")!=std::string::npos);
      assert(!gCatchOffered&&!tp_f4_capture_begin());
      assert(hero.battleWins==oldWins&&hero.battleLevelBonus==oldBonus);
      assert(hero.trAtk==oldAtk&&hero.trDef==oldDef&&hero.trSpe==oldSpe);
      assert(Preferences::store()==oldStore);
    }
  }
  assert(won);
  tp_battle_close();

  // Existing entry path remains a legacy single-player battle.
  load();tp_battle_start();
  assert(gOpen&&!gWildTeam.count());
  tp_battle_close();

  std::cout<<"P05 native wild start passed: complete unique roster staging, "
    "manual/prompt starts, preserved prompt on refusal, individual presentation, "
    "unchanged care identity, real native forced switch, pending winner ID, "
    "no legacy care/training reward, no premature catch and legacy entry isolation. "
    "Browser buttons and result commit not yet connected.\n";
}
