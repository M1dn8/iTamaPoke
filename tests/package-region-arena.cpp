#include <cassert>
#include <ctime>
#include <iostream>
#include <map>
#include <string>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet hero;Pet &tp_battle_pet(){return hero;}
extern "C" int tp_is_egg(){return hero.isEgg();}extern "C" int tp_sleeping(){return hero.sleeping;}extern "C" int tp_species_id(){return hero.speciesId;}extern "C" int tp_level(){return hero.level();}
#include "../browser_ver/core/browser_battle.cpp"
#include "../browser_ver/core/browser_league.cpp"
#include "../browser_ver/core/browser_battle_energy.cpp"
extern "C" int tp_f4_store_pending();
static void energy(int n){hero.energy=uint8_t(n);Preferences().putUChar("ene",uint8_t(n));}
static void setup(){
 assert(!gArenaUndo&&!tp_energy_detail::arenaToken&&!tp_f4_store_pending());tp_lg_abort();tp_battle_close();gWildPromptActive=false;
 Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",150);p.putShort("eggT2",150);p.putUInt("age",5940);
 for(const char*k:{"gatk","gdef","gspe","tatk","tdef","tspe","full","joy","ene","hyg","bond"})p.putUChar(k,100);
 p.putUChar("agver",1);p.putUChar("agmask",1);p.putUInt("agt0",1700000000);p.putUChar("lgver",1);p.putBool("lgkdone",true);p.putUInt("lgkdate",1700000000);
 p.putUChar("rkver",1);p.putUChar("rkstate",1);p.putShort("rkdex",4);p.putUInt("rkarm",0);p.putUInt("rkborn",0);p.putUChar("f4lver",1);p.putUInt("f4life",1);p.putUChar("mgver",3);
 hero=Pet();hero.begin();hero.setClock(uint32_t(std::time(nullptr)));energy(100);
}
static std::map<std::string,Preferences::Value> kanto(){
 std::map<std::string,Preferences::Value> out;const char *names[]={"agver","agmask","lgver","lgkrun","lgkdone","lgkdate","lhver","lhdata","rkver","rkstate","rkdex","rkarm","rkborn"};const auto &s=Preferences::store();
 for(const char *n:names){auto i=s.find(n);if(i!=s.end())out.insert(*i);}for(int d=0;d<8;d++){auto i=s.find("agt"+std::to_string(d));if(i!=s.end())out.insert(*i);}return out;
}
static int paid(int region,int id){const auto token=tp_region_energy_arena_begin(region,id);assert(token);const int session=tp_region_energy_arena_finish(region,token,1);assert(session>0);assert(tp_region_arena_session_region()==region);return session;}
static void win(){gRun.enemyHp=0;gTurn.playerWon=true;gTurn.battleEnded=true;finishBattle();}
static void syntheticSeries(int region,int id,int token){
 const auto *leader=arenaLeaderFor(region,id);assert(leader);for(unsigned i=0;i<leader->count;i++){
  assert(gDex==leader->team[i].dex&&gLevel==leader->team[i].level&&gTrainerIndex==i);assert(!gCatchOffered);
  win();if(i+1<leader->count){assert(!tp_region_arena_apply(region,token));const auto hp=gRun.playerHp;gRun.restUsesLeft=1;assert(tp_f2_next());assert(gRun.playerHp==hp&&gRun.restUsesLeft==1);}
 }assert(gResolved&&gTurn.playerWon&&!gTrainerNext&&!gCatchOffered);
}
#include "region-access-checks.h"

int main(){
 checkJohtoGate();
 setup();for(const auto pair:{std::pair<int,int>{-1,0},{2,0},{256,0},{1,-1},{1,8}}){const auto before=Preferences::store();assert(!tp_region_energy_arena_begin(pair.first,pair.second));assert(Preferences::store()==before&&hero.energy==100&&!gOpen&&!tp_f4_store_pending());}
 energy(44);auto before=Preferences::store();assert(!tp_region_energy_arena_begin(1,0)&&Preferences::store()==before);
 energy(45);before=Preferences::store();auto entry=tp_region_energy_arena_begin(1,0);assert(entry&&hero.energy==20&&tp_f4_store_pending());
 assert(!tp_energy_arena_finish(entry,1)&&!tp_region_energy_arena_finish(0,entry,1));assert(!tp_region_energy_arena_begin(0,0));assert(tp_region_energy_arena_finish(1,entry,0)==1);
 assert(Preferences::store()==before&&hero.energy==45&&!gOpen&&!tp_f4_store_pending()&&tp_region_arena_session_region()==-1);
 setup();const auto oldKanto=kanto();const int token=paid(1,0);assert(hero.energy==75&&tp_region_arena_mask(1)==0);syntheticSeries(1,0,token);
 assert(!tp_f3_apply(token)&&!tp_region_arena_apply(0,token));before=Preferences::store();assert(tp_region_arena_apply(1,token)==1);assert(!tp_region_arena_finish(0,token,1)&&!tp_f3_finish(token,1));assert(tp_region_arena_finish(1,token,0));assert(Preferences::store()==before&&tp_region_arena_mask(1)==0&&kanto()==oldKanto);
 assert(tp_region_arena_apply(1,token)==1&&tp_region_arena_finish(1,token,1));assert(tp_region_arena_mask(1)==1&&tp_region_arena_mask(0)==1&&kanto()==oldKanto);const auto date=tp_region_arena_date(1,0);assert(date>0&&!tp_region_arena_apply(1,token));
 const auto caught=hero.caughtCount();tp_battle_try_catch();assert(hero.caughtCount()==caught&&!gCatchTried);tp_battle_close();energy(100);
 const int repeat=paid(1,0);syntheticSeries(1,0,repeat);before=Preferences::store();assert(tp_region_arena_apply(1,repeat)==2&&Preferences::store()==before&&tp_region_arena_date(1,0)==date&&kanto()==oldKanto);tp_battle_close();
 // Reload uses the committed regional keys without migration or a selected-region global.
 hero=Pet();hero.begin();assert(tp_region_arena_mask(1)==1&&tp_region_arena_date(1,0)==date&&kanto()==oldKanto);
 setup();for(int id=0;id<8;id++){energy(100);int s=paid(1,id);syntheticSeries(1,id,s);assert(tp_region_arena_apply(1,s)==1&&tp_region_arena_finish(1,s,1));tp_battle_close();}assert(tp_region_arena_mask(1)==255&&tp_f3_mask()==1);assert(!tp_lg_prepare_start(0));
 // Legacy entry points remain Kanto-only and cannot spend or award through Johto.
 setup();entry=tp_energy_arena_begin(0);assert(entry);const int legacy=tp_energy_arena_finish(entry,1);assert(legacy>0&&gArenaRegion==0);syntheticSeries(0,0,legacy);assert(tp_f3_apply(legacy)==2);tp_battle_close();assert(tp_region_arena_mask(1)==0);
 setup();const int lost=paid(1,0);gRun.playerHp=0;gTurn.playerWon=false;gTurn.battleEnded=true;finishBattle();assert(!tp_region_arena_apply(1,lost)&&!tp_region_arena_mask(1));tp_battle_close();assert(hero.energy==75);
 setup();Preferences().putUChar("jagver",2);before=Preferences::store();assert(!tp_region_energy_arena_begin(1,0)&&Preferences::store()==before&&!gOpen&&!tp_f4_store_pending());
 unsigned wins=0,losses=0;
 for(unsigned id=0;id<8;id++)for(unsigned seed=0;seed<5;seed++){
  setup();std::srand(seed);const auto keep=kanto();int s=paid(1,int(id));
  for(unsigned turn=0;turn<160&&!gResolved;turn++){performAction(BATTLE_ATTACK_QUICK);if(gTrainerNext){const auto hp=gRun.playerHp;const auto rests=gRun.restUsesLeft;assert(tp_f2_next());assert(gRun.playerHp==hp&&gRun.restUsesLeft==rests);}}
  assert(gResolved&&!gTrainerNext&&!gCatchOffered);if(gTurn.playerWon){wins++;assert(tp_region_arena_apply(1,s)==1&&tp_region_arena_finish(1,s,1));assert(tp_region_arena_mask(1)==int(1u<<id));}else{losses++;assert(!tp_region_arena_apply(1,s)&&!tp_region_arena_mask(1));}
  assert(kanto()==keep&&hero.energy==75);tp_battle_close();
 }
 assert(wins>0);std::cout<<"Regional arena native passed: captured region ownership; paid-start rollback/25 energy; cross-region and legacy API guards; 8 actual Johto rosters; final-only regional badges; award rollback/retry; repeat/date/reload preservation; no catches; no Kanto unlock from Johto badges; future-schema refusal. Real-engine series: "<<wins<<" wins, "<<losses<<" losses (not a balancing proof).\n";
}
