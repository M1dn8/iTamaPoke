#include <cassert>
#include <ctime>
#include <cstring>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet live;Pet &tp_battle_pet(){return live;}
extern "C" int tp_is_egg(){return live.isEgg();}extern "C" int tp_sleeping(){return live.sleeping;}
extern "C" int tp_species_id(){return live.speciesId;}extern "C" int tp_level(){return live.level();}
#include "../browser_ver/core/browser_battle.cpp"
static void load(){
 if(gArenaUndo)assert(tp_f3_finish(gArenaToken,0));tp_battle_close();gWildPromptActive=false;Preferences::store().clear();Preferences p;
 p.putBool("init",true);p.putShort("dexn",150);p.putShort("eggT2",1);p.putUInt("age",99*60);p.putUChar("gatk",100);p.putUChar("gdef",100);p.putUChar("gspe",100);p.putUChar("tatk",100);p.putUChar("tdef",100);p.putUChar("tspe",100);p.putUChar("full",100);p.putUChar("joy",100);p.putUChar("ene",100);p.putUChar("hyg",100);p.putUChar("bond",80);p.putUChar("mgver",3);p.putString("nick","Arena-Test");live=Pet();live.begin();live.setClock(uint32_t(std::time(nullptr)));
}
static void win(){gRun.enemyHp=0;gTurn.playerWon=true;gTurn.battleEnded=true;finishBattle();}
static int finalWin(int id){
 const int token=tp_f3_start(id);assert(token>0);const auto &leader=kKantoArenas[id];
 for(unsigned i=0;i<leader.count;i++){
  assert(gDex==leader.team[i].dex&&gLevel==leader.team[i].level&&gTrainerIndex==i&&!gCatchOffered&&!tp_f3_apply(token));gRun.playerHp=gRun.playerMaxHp/2;gRun.restUsesLeft=0;win();
  if(i+1<leader.count){assert(gTrainerNext&&!tp_f3_apply(token));const auto hp=gRun.playerHp;assert(tp_f2_next());assert(gRun.playerHp==hp&&gRun.restUsesLeft==0);assert(!tp_f2_next());}
 }
 assert(!gTrainerNext&&gResolved&&gTurn.playerWon);return token;
}
int main(int argc,char **argv){
 if(argc>1&&std::strcmp(argv[1],"--json")==0){std::cout<<tp_f3_catalog()<<"\n";return 0;}
 load();assert(kKantoArenaCount==8&&tp_f3_mask()==0);assert(!tp_f3_start(-1)&&!tp_f3_start(8)&&!tp_f3_apply(1));live.sleeping=true;assert(!tp_f3_start(0));live.sleeping=false;const auto old=Preferences::store();
 int token=finalWin(0);assert(!tp_f3_apply(token+1)&&!tp_f3_finish(token,1));assert(tp_f3_apply(token)==1&&tp_f3_mask()==1&&tp_f3_date(0)>0);assert(!tp_f3_apply(token)&&!tp_f3_finish(token,2));tp_battle_close();assert(gOpen&&gArenaUndo);
 live.setClock(uint32_t(std::time(nullptr))+1);assert(tp_f3_finish(token,0));assert(Preferences::store()==old&&tp_f3_mask()==0);assert(tp_f3_apply(token)==1);assert(tp_f3_finish(token,1)&&!tp_f3_finish(token,1));const auto firstDate=tp_f3_date(0);tp_battle_close();
 assert(tp_f3_mask()==1);Pet restored;restored.begin();restored.setClock(uint32_t(std::time(nullptr)));assert(tp_f3_mask()==1);restored.newEgg();assert(tp_f3_mask()==1&&tp_f3_date(0)==firstDate);
 live=Pet();live.begin();live.speciesId=150;live.ageMinutes=99*60;live.sleeping=false;live.ceremony=CER_NONE;live.fullness=live.joy=live.energy=live.hygiene=100;
 token=finalWin(0);const auto repeatStore=Preferences::store();assert(tp_f3_apply(token)==2&&gArenaPhase==3);assert(!tp_f3_apply(token)&&!tp_f3_finish(token,1));assert(tp_f3_date(0)==firstDate&&Preferences::store()==repeatStore);tp_battle_close();
 for(int id=1;id<8;id++){token=finalWin(id);assert(tp_f3_apply(token)==1&&tp_f3_finish(token,1));tp_battle_close();}
 assert(tp_f3_mask()==255);for(int i=0;i<8;i++)assert(tp_f3_date(i)>0);assert(!tp_f3_date(-1)&&!tp_f3_date(8));live.factoryReset();assert(tp_f3_mask()==0);load();
 token=tp_f3_start(7);gRun.playerHp=0;gTurn.playerWon=false;gTurn.battleEnded=true;finishBattle();assert(!tp_f3_apply(token)&&!tp_f3_mask()&&!gCatchOffered);tp_battle_close();token=tp_f3_start(0);win();assert(!tp_f3_apply(token));tp_battle_close();assert(!tp_f3_apply(token));const auto stale=token;token=finalWin(0);assert(token!=stale&&!tp_f3_apply(stale));live.speciesId=4;assert(!tp_f3_apply(token));tp_battle_close();
 load();Preferences p;p.putUChar("agver",9);p.putUChar("agmask",255);const auto future=Preferences::store();assert(tp_f3_mask()==-1&&!tp_f3_start(0)&&future==Preferences::store());p.putUChar("agver",1);p.putUInt("agmask",300);assert(tp_f3_mask()==-1&&!tp_f3_start(0));
 unsigned wins=0,losses=0;for(int id=0;id<8;id++)for(unsigned seed=0;seed<5;seed++){
  load();std::srand(seed);token=tp_f3_start(id);assert(token>0);const auto before=Preferences::store();
  for(unsigned turn=0;turn<130&&!gResolved;turn++){performAction(BATTLE_ATTACK_QUICK);if(gTrainerNext){const auto hp=gRun.playerHp;const auto rests=gRun.restUsesLeft;assert(tp_f2_next());assert(gRun.playerHp==hp&&gRun.restUsesLeft==rests);}}
  assert(gResolved&&!gTrainerNext&&!gCatchOffered&&gRewardLine.empty()&&Preferences::store()==before&&!tp_f3_mask());if(gTurn.playerWon){wins++;assert(tp_f3_apply(token)==1&&tp_f3_finish(token,1)&&tp_f3_mask()==(1<<id));}else{losses++;assert(!tp_f3_apply(token));}tp_battle_close();
 }
 std::cout<<"F3 native passed: 8 fixed rosters/levels, HP/rest carry, token/final-win guards, exact Pet/store rollback, repeat/date stability, reload/newEgg/reset/legacy/future guards, 40 real series "<<wins<<" wins / "<<losses<<" losses.\n";
}
