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


extern "C" int tp_f4_store_stage(uint32_t,const uint8_t*,int);
extern "C" int tp_f4_store_pending();

static void winResult(bool careWinner,bool capped=false){
  for(unsigned seed=0;seed<100;seed++){
    load();
    hero.setClock(1700000000);
    hero.ensureDailyGoals();
    hero.dailyGoalType[0]=DAILY_GOAL_BATTLE;
    hero.dailyGoalType[1]=DAILY_GOAL_CARE;
    hero.dailyGoalType[2]=DAILY_GOAL_PLAY;
    assert(hero.dailyGoalTarget(DAILY_GOAL_BATTLE)>0);
    hero.dailyGoalProgress[0]=hero.dailyGoalTarget(DAILY_GOAL_BATTLE)-1;
    hero.dailyGoalProgress[1]=hero.dailyGoalProgress[2]=0;
    hero.dailyGoalDone=0;
    hero.setClock(1700000000);
    if(capped){
      hero.ageMinutes=99*MINUTES_PER_LEVEL;
      hero.setClock(1700000000);
    }
    assert(tp_wt_stage_begin(2));
    assert(tp_wt_stage_entry(0,101,hero.speciesId,hero.level(),
      hero.atkStat(),hero.defStat(),hero.speStat(),1,hero.shiny,""));
    const auto s=wildBattleStats(25,20);
    assert(tp_wt_stage_entry(1,102,25,20,s.atk,s.def,s.spe,0,0,"Blitz"));
    assert(tp_wt_start(0));
    if(!careWinner)assert(tp_wt_switch(1));
    gRun.enemyHp=1;
    std::srand(seed);
    performAction(BATTLE_ATTACK_HEAVY);
    if(gResolved&&gTurn.playerWon)return;
  }
  assert(false&&"deterministic victory fixture");
}

static void stageTransport(uint32_t token){
  // Native transport fixture only; JS model validation is tested separately.
  const char data[]="P05 native result transport fixture";
  assert(tp_f4_store_stage(token,
    reinterpret_cast<const uint8_t*>(data),sizeof(data)-1));
}

int main(){
  winResult(true);
  const auto before=Preferences::store();
  const auto age=hero.ageMinutes;
  const auto oldLevel=hero.level();
  const auto oldBonus=hero.battleLevelBonus;
  const auto atk=hero.trAtk,def=hero.trDef,spe=hero.trSpe;
  const auto joy=hero.joy,energy=hero.energy,fullness=hero.fullness;
  const auto wins=hero.battleWins;
  const auto losses=hero.battleLosses;
  const auto streak=hero.battleStreak,best=hero.bestBattleStreak;
  const auto bond=hero.bond;
  const auto goalBefore=hero.dailyGoalProgress[0];

  const auto first=tp_wt_result_begin();
  assert(first&&!tp_wt_result_begin()&&tp_f4_store_pending());
  assert(!tp_wt_result_apply(first+1,101));
  assert(!tp_wt_result_apply(first,102));
  assert(hero.level()==oldLevel);
  assert(!tp_wt_result_finish(first,1));
  assert(tp_wt_result_apply(first,101));
  assert(hero.level()==oldLevel+1&&hero.battleLevelBonus==oldBonus+1);
  assert(hero.ageMinutes==age);
  assert(hero.trAtk==atk&&hero.trDef==def&&hero.trSpe==spe);
  assert(hero.joy==joy&&hero.energy==energy&&hero.fullness==fullness);
  assert(hero.battleWins==wins+1&&hero.battleLosses==losses);
  assert(hero.battleStreak==streak+1);
  assert(hero.bestBattleStreak>=hero.battleStreak);
  assert(hero.dailyGoalProgress[0]==goalBefore+1);
  assert(hero.dailyGoalComplete(0));
  assert(hero.bond==bond);
  assert(!tp_wt_result_apply(first,101));

  tp_battle_close();
  assert(gOpen);
  tp_battle_try_catch();
  tp_battle_leave_wild();
  assert(!gCatchDone&&!tp_f4_capture_begin());

  stageTransport(first);
  assert(tp_wt_result_finish(first,0));
  assert(Preferences::store()==before&&hero.level()==oldLevel);
  assert(hero.battleLevelBonus==oldBonus&&gWTResultPending);
  assert(hero.battleWins==wins&&hero.battleLosses==losses);
  assert(hero.battleStreak==streak&&hero.bestBattleStreak==best);
  assert(hero.dailyGoalProgress[0]==goalBefore&&!hero.dailyGoalComplete(0));
  assert(hero.bond==bond);
  assert(!gCatchOffered&&!tp_f4_store_pending());

  const auto retry=tp_wt_result_begin();
  assert(retry>first&&tp_wt_result_apply(retry,101));
  stageTransport(retry);
  assert(tp_wt_result_finish(retry,1));
  assert(hero.level()==oldLevel+1&&hero.battleLevelBonus==oldBonus+1);
  assert(!gWTResultPending&&!tp_f4_store_pending()&&gCatchOffered);
  assert(hero.battleWins==wins+1&&hero.battleLosses==losses);
  assert(hero.battleStreak==streak+1&&hero.dailyGoalComplete(0));
  assert(hero.joy==joy&&hero.bond==bond);
  Pet persisted;
  persisted.begin();
  assert(persisted.battleWins==wins+1);
  assert(persisted.battleStreak==streak+1&&persisted.dailyGoalComplete(0));
  assert(!tp_wt_result_begin()&&!tp_wt_result_finish(retry,1));
  assert(std::string(tp_wt_view()).find("\"winnerId\":101")!=std::string::npos);

  const auto capture=tp_f4_capture_begin();
  assert(capture&&tp_f4_capture_finish(capture,0));
  tp_battle_close();

  // Stored winner: native layer must not reward the unrelated care pet.
  winResult(false);
  const auto unrelatedLevel=hero.level();
  const auto unrelatedBonus=hero.battleLevelBonus;
  const auto storedToken=tp_wt_result_begin();
  assert(storedToken&&tp_wt_result_apply(storedToken,102));
  stageTransport(storedToken);
  assert(tp_wt_result_finish(storedToken,1));
  assert(hero.level()==unrelatedLevel&&hero.battleLevelBonus==unrelatedBonus);
  assert(hero.battleWins==1&&hero.battleStreak==1);
  assert(hero.dailyGoalComplete(0));
  tp_battle_close();

  // Winning at level 100 still commits successfully, without replacement gain.
  winResult(true,true);
  assert(hero.level()==100&&hero.battleLevelBonus==0);
  const auto maxToken=tp_wt_result_begin();
  assert(maxToken&&tp_wt_result_apply(maxToken,101));
  stageTransport(maxToken);
  assert(tp_wt_result_finish(maxToken,1));
  assert(hero.level()==100&&hero.battleLevelBonus==0);
  tp_battle_close();

  // Rollback is also permitted before applying a result.
  winResult(true);
  const auto untouched=Preferences::store();
  const auto untouchedLevel=hero.level();
  const auto unused=tp_wt_result_begin();
  assert(unused&&tp_wt_result_finish(unused,0));
  assert(Preferences::store()==untouched&&hero.level()==untouchedLevel);
  assert(gWTResultPending);
  tp_battle_close();

  // A final loss resets the profile streak, but has no care penalty.
  load();
  hero.battleStreak=3;hero.bestBattleStreak=4;
  hero.setClock(1700000000);
  stage();assert(tp_wt_start(0));
  const auto lossJoy=hero.joy,lossEnergy=hero.energy;
  const auto lossAge=hero.ageMinutes;
  gRun.playerHp=1;gRun.enemyHp=gRun.enemyMaxHp;
  performAction(BATTLE_ATTACK_HEAVY);
  assert(gWildTeam.needsSwitch()&&tp_wt_switch(1));
  gRun.playerHp=1;gRun.enemyHp=gRun.enemyMaxHp;
  performAction(BATTLE_ATTACK_HEAVY);
  assert(gResolved&&!gTurn.playerWon&&gWTResultPending);

  const auto lossBefore=Preferences::store();
  const auto lossToken=tp_wt_result_begin();
  assert(lossToken&&tp_wt_result_apply(lossToken,0));
  assert(hero.battleLosses==1&&hero.battleWins==0);
  assert(hero.battleStreak==0&&hero.bestBattleStreak==4);
  assert(hero.joy==lossJoy&&hero.energy==lossEnergy&&hero.ageMinutes==lossAge);
  stageTransport(lossToken);
  assert(tp_wt_result_finish(lossToken,0));
  assert(Preferences::store()==lossBefore);
  assert(hero.battleLosses==0&&hero.battleStreak==3);
  const auto lossRetry=tp_wt_result_begin();
  assert(lossRetry&&tp_wt_result_apply(lossRetry,0));
  stageTransport(lossRetry);
  assert(tp_wt_result_finish(lossRetry,1));
  assert(hero.battleLosses==1&&hero.battleStreak==0);
  assert(!tp_wt_result_begin());
  tp_battle_close();

  // Profile counters saturate instead of wrapping to zero.
  load();
  hero.battleWins=hero.battleStreak=hero.bestBattleStreak=0xffffu;
  assert(hero.recordWildBattleOutcome(true));
  assert(hero.battleWins==0xffffu&&hero.battleStreak==0xffffu);
  assert(hero.bestBattleStreak==0xffffu);
  hero.battleLosses=0xffffu;
  assert(hero.recordWildBattleOutcome(false));
  assert(hero.battleLosses==0xffffu&&hero.battleStreak==0);

  // Refuse a changed care identity without opening a transaction.
  winResult(false);
  hero.geneAtk++;
  assert(!tp_wt_result_begin()&&!tp_f4_store_pending());
  tp_battle_close();

  std::cout<<"P05 native wild result passed: bound winner ID, one apply/token, "
    "whole-Pet/store rollback, retry without duplicate care level, cap100, "
    "unrelated care neutrality, blocked close/catch during result, "
    "catch release after commit, profile win/loss/streak rollback/retry, "
    "battle goal completion without care rewards, counter caps and changed-actor refusal. "
    "Stored-winner model update and real IndexedDB write not yet connected.\n";
}
