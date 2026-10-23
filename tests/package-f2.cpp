#include <cassert>
#include <cstring>
#include <ctime>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet live;Pet &tp_battle_pet(){return live;}
extern "C" int tp_is_egg(){return live.isEgg();}
extern "C" int tp_sleeping(){return live.sleeping;}
extern "C" int tp_species_id(){return live.speciesId;}
extern "C" int tp_level(){return live.level();}
#include "../browser_ver/core/browser_battle.cpp"
static void setup(){
 tp_battle_close();gWildPromptActive=false;Preferences::store().clear();
 live=Pet();live.speciesId=1;live.ageMinutes=9*60;live.geneAtk=live.geneDef=live.geneSpe=100;
 live.fullness=live.joy=live.energy=live.hygiene=100;live.bond=80;
}
static void finishFirst(){gRun.enemyHp=0;gTurn.battleEnded=true;gTurn.playerWon=true;finishBattle();}
int main(){
 setup();assert(tp_f2_can());assert(!tp_f2_start(-1)&&!tp_f2_start(2));
 live.sleeping=true;assert(!tp_f2_start(0));live.sleeping=false;live.ceremony=CER_RELEASE;assert(!tp_f2_start(0));live.ceremony=CER_NONE;
 live.speciesId=-1;assert(!tp_f2_start(0));live.speciesId=1;gWildPromptActive=true;assert(!tp_f2_start(0));gWildPromptActive=false;
 const auto before=Preferences::store();const auto atk=live.trAtk,def=live.trDef,spe=live.trSpe;
 assert(tp_f2_start(1));assert(tp_f2_get(0)&&tp_f2_get(1)==2&&tp_f2_get(2)==0&&!tp_f2_get(3));
 assert(!tp_f2_start(0)&&!tp_f2_next());const auto originalDex=gDex;tp_battle_start();tp_wild_accept();assert(gTrainer&&gDex==originalDex);
 const auto player=gPlayer;const auto maxHp=gRun.playerMaxHp;
 gRun.playerHp=maxHp/2;gRun.restUsesLeft=0;gRun.round=7;gRun.playerDamageTotal=31;gRun.enemyDamageTotal=17;
 finishFirst();assert(gResolved&&gTrainerNext&&!gCatchOffered&&gRewardLine.empty());
 const auto carried=gRun.playerHp;tp_battle_try_catch();assert(!gCatchTried&&Preferences::store()==before);
 assert(tp_f2_next());assert(!tp_f2_next()&&!gResolved&&tp_f2_get(2)==1);
 assert(gRun.playerHp==carried&&gRun.playerMaxHp==maxHp&&gRun.restUsesLeft==0&&gRun.round==0);
 assert(gTrainerRounds==7&&gTrainerDealt==31&&gTrainerTaken==17);
 assert(gPlayer.atk==player.atk&&gPlayer.def==player.def&&gPlayer.spe==player.spe);
 assert(!tp_battle_wild_already_caught()&&gDex!=originalDex);
 finishFirst();assert(gResolved&&!gTrainerNext&&gTurn.playerWon);assert(!tp_f2_next());
 assert(live.trAtk==atk&&live.trDef==def&&live.trSpe==spe&&live.energy==100&&live.fullness==100&&Preferences::store()==before);
 tp_battle_close();assert(!tp_f2_get(0)&&!tp_f2_next());assert(tp_f2_start(0)&&tp_f2_get(1)==1);
 gRun.playerHp=0;gTurn.battleEnded=true;gTurn.playerWon=false;finishBattle();assert(gResolved&&!gTrainerNext&&!gCatchOffered&&gRewardLine.empty());
 tp_battle_try_catch();assert(!gCatchTried&&Preferences::store()==before);tp_battle_close();
 assert(tp_f2_start(1));live.speciesId=4;assert(!tp_f2_can_actor());performAction(BATTLE_ATTACK_QUICK);assert(!gOpen);
 // Actual stepBattle outcomes over both roster sizes: no manufactured trainer reward.
 unsigned wins=0,losses=0;
 for(unsigned team=0;team<2;team++)for(unsigned seed=0;seed<20;seed++){
  setup();std::srand(seed);live.trAtk=100;live.trDef=100;live.trSpe=100;assert(tp_f2_start(team));const auto stored=Preferences::store();
  for(unsigned turn=0;turn<80&&!gResolved;turn++){
   performAction(BATTLE_ATTACK_QUICK);
   if(gTrainerNext){const auto hp=gRun.playerHp;const auto rests=gRun.restUsesLeft;assert(tp_f2_next());assert(gRun.playerHp==hp&&gRun.restUsesLeft==rests);}
  }
  assert(gResolved&&!gTrainerNext&&!gCatchOffered&&gRewardLine.empty());
  if(gTurn.playerWon)wins++;else losses++;
  assert(Preferences::store()==stored&&live.trAtk==100&&live.trDef==100&&live.trSpe==100);
 }
 // Existing wild win/catch path remains enabled.
 setup();startBattle(19,10);finishFirst();assert(!gTrainer&&gCatchOffered);tp_battle_close();
 std::cout<<"F2 native passed: eligibility, invalid roster, mutual battle ownership, carry HP/rests/stats, explicit single-flight transition, full-series totals, no trainer catch/reward/store changes, loss/abort/identity guards; real-engine series "<<wins<<" wins / "<<losses<<" losses; wild catch retained.\n";
}
