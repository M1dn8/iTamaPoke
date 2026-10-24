#include <cassert>
#include <ctime>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet hero;Pet &tp_battle_pet(){return hero;}
extern "C" int tp_is_egg(){return hero.isEgg();}extern "C" int tp_sleeping(){return hero.sleeping;}extern "C" int tp_species_id(){return hero.speciesId;}extern "C" int tp_level(){return hero.level();}
#include "../browser_ver/core/browser_battle.cpp"
#include "../browser_ver/core/browser_league.cpp"
static void load(){if(undo)tp_lg_finish(token,0);tp_lg_abort();tp_battle_close();Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",376);p.putShort("eggT2",376);p.putUInt("age",2940);p.putUChar("agver",1);p.putUChar("agmask",255);p.putUChar("f4lver",1);p.putUInt("f4life",1);hero=Pet();hero.begin();hero.fullness=hero.joy=hero.energy=hero.hygiene=100;hero.bond=80;hero.shiny=true;hero.rename("Stahl & <Zwei>");hero.applyTypeResult(1);hero.applyMemoResult(1);hero.trainStrength(1);hero.fullness=hero.joy=hero.energy=hero.hygiene=100;const auto now=uint32_t(std::time(nullptr));assert(hero.megaClaim(now)&&hero.megaActivate(now));}
static int oldWildLevel(int petLevel,int luck){int base=petLevel?petLevel:1;int delta=luck<55?luck%3-1:luck<85?-2-luck%3:2+luck%2;int n=base+delta;return n<1?1:n>100?100:n;}
static void checkWildLevelPolicy(){
 for(unsigned level=0;level<256;level++)for(unsigned luck=0;luck<256;luck++){
  const int n=wildLevelFor(uint8_t(level),uint8_t(luck));assert(n>=1&&n<=30);
  if(level<=27)assert(n==oldWildLevel(level,luck));
  else assert(n==oldWildLevel(27,luck));
 }
 bool levels[31]{};unsigned distinct=0;
 for(unsigned luck=0;luck<100;luck++){int n=wildLevelFor(97,uint8_t(luck));if(!levels[n]){levels[n]=true;distinct++;}}
 assert(distinct==8&&levels[23]&&levels[30]);
}
static void checkWildEntryPaths(){
 load();hero.ageMinutes=uint32_t(99)*MINUTES_PER_LEVEL;assert(hero.level()==100);
 const auto age=hero.ageMinutes;const auto owned=hero.caughtCount();
 for(unsigned seed=0;seed<100;seed++){
  std::srand(seed);tp_battle_start();assert(gOpen&&!gTrainer&&gLevel>=1&&gLevel<=30&&gPlayer.level==100);
  const auto expected=wildBattleStats(gDex,gLevel);assert(gEnemy.level==gLevel&&gEnemy.atk==expected.atk&&gEnemy.def==expected.def&&gEnemy.spe==expected.spe);
  assert(hero.ageMinutes==age&&hero.caughtCount()==owned);tp_battle_close();
 }
 unsigned prompts=0;
 for(unsigned seed=0;seed<256;seed++){
  std::srand(seed);gWildPromptActive=false;gNextWildEligibleMs=1;gLastWildCheckMs=0;g_millis=100000;
  tp_battle_check_wild(1);
  if(!tp_wild_prompt_active())continue;
  const auto dex=tp_wild_prompt_dex(),level=tp_wild_prompt_level();assert(level>=1&&level<=30);
  tp_wild_accept();assert(gOpen&&!gTrainer&&gDex==dex&&gLevel==level&&gEnemy.level==level);prompts++;tp_battle_close();
 }
 assert(prompts>0);
 assert(tp_f2_start(1));assert(gLevel==100&&gEnemy.level==100);tp_battle_close();
 for(unsigned id=0;id<kKantoArenaCount;id++){assert(tp_f3_start(id)>0);assert(gLevel==kKantoArenas[id].team[0].level);tp_battle_close();}
 assert(hero.ageMinutes==age&&hero.caughtCount()==owned);
}

int main(int argc,char**argv){checkWildLevelPolicy();checkWildEntryPaths();load();const auto now=uint32_t(std::time(nullptr));startBattle(143,50);assert(tp_bv_get(1)==50&&tp_bv_get(5)==2&&tp_bv_get(6)==1);const auto id=tp_bv_get(0);hero.megaUpdate(now+900);hero.ageMinutes+=60;assert(tp_bv_get(1)==50&&tp_bv_get(5)==2);bool hit=false;for(unsigned seed=0;seed<200&&!hit;seed++){std::srand(seed);gRun=beginBattleRuntime(gPlayer,gEnemy);gRun.enemyHp=1;gResolved=false;performAction(BATTLE_ATTACK_HEAVY);if(gBvDealt){assert(gBvDealt==1&&gRun.enemyHp==0);hit=true;}}assert(hit);gRun=beginBattleRuntime(gPlayer,gEnemy);gRun.playerHp=gRun.playerMaxHp-50;gResolved=false;const auto hp=gRun.playerHp;performAction(BATTLE_REST);assert(tp_bv_get(9)==50&&gRun.playerHp==hp+50-tp_bv_get(8));tp_battle_close();startBattle(143,50);assert(tp_bv_get(5)==0&&tp_bv_get(0)!=id&&tp_bv_get(7)==0);
load();int t=tp_lg_prepare_start(0);assert(t>0&&tp_lg_finish(t,1));assert(active[17]==50&&active[20]==2);hero.megaUpdate(now+900);hero.ageMinutes+=60;const auto before=run.playerHp;assert(tp_lg_turn(BATTLE_ATTACK_HEAVY));assert(lastTaken<=before);assert(lastDealt==run.playerDamageTotal);assert(active[17]==50&&active[20]==2);if(argc>1){std::cout<<tp_lg_view()<<"\n";return 0;}
run=beginBattleRuntime(stats(active),wildBattleStats(87,54));run.playerHp=run.playerMaxHp-40;run.restUsesLeft=5;resolved=false;assert(tp_lg_turn(BATTLE_REST));assert(lastHeal==40&&run.playerHp==run.playerMaxHp-lastTaken);std::cout<<"Wildlevel 1..30 passed (65536 combinations, manual/prompt paths, unchanged trainer/arena levels). Battle presentation native passed: frozen Mega2/shiny/level, expiry grace, exact KO damage clamp, distinct heal/taken damage, new-opponent reset, actual league snapshot and no engine formula changes.\n";}
