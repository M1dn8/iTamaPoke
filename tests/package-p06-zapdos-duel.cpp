#include <cassert>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <iterator>
#include <vector>
#include "pet.h"
#include "../browser_ver/core/region-progress-keys.h"

uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}
static Pet hero;
Pet &tp_battle_pet(){return hero;}
extern "C" {
int tp_is_egg(){return hero.isEgg()?1:0;}
int tp_sleeping(){return hero.sleeping?1:0;}
int tp_species_id(){return hero.speciesId;}
int tp_level(){return hero.level();}
int tp_zpd_step();
int tp_zpd_ticket();
int tp_zpd_advance(uint32_t,int);
int tp_zpd_get(int);
int tp_zpd_start();
const char *tp_zpd_snapshot();
uint32_t tp_zpd_result_begin();
int tp_zpd_result_apply(uint32_t,uint32_t);
int tp_zpd_result_finish(uint32_t,int);
uint32_t tp_f4_store_begin();
int tp_f4_store_finish(uint32_t,int);
int tp_f4_admission_pending();
int tp_f4_admission_stage(uint32_t,const uint8_t*,int,int);
uint32_t tp_f4_capture_begin();
uint32_t tp_wt_result_begin();
int tp_wt_stage_begin(int);
int tp_wt_stage_entry(int,uint32_t,int,int,int,int,int,int,int,const char*);
int tp_wt_switch(int);
void tp_battle_close();
int tp_battle_is_open();
int tp_battle_resolved();
int tp_battle_player_won();
int tp_battle_wild_dex();
int tp_battle_wild_level();
int tp_battle_catch_offered();
void tp_battle_try_catch();
void tp_battle_quick_attack();
}
std::vector<uint8_t> read(const char *path){
 std::ifstream in(path,std::ios::binary);assert(in);
 return {std::istreambuf_iterator<char>(in),std::istreambuf_iterator<char>()};
}
void stage(bool strong,int count=1){
 assert(tp_wt_stage_begin(count));
 for(int i=0;i<count;i++)
  assert(tp_wt_stage_entry(i,101u+unsigned(i),strong?376:10,
   strong?100:1,strong?65535:1,strong?65535:1,strong?65535:1,
   0,0,strong?"Strong fixture":"Weak fixture"));
}
void fight(){
 for(int i=0;i<100&&!tp_battle_resolved();i++)tp_battle_quick_attack();
 assert(tp_battle_resolved());
}
int main(int argc,char **argv){
 assert(argc==3);
 const auto pending=read(argv[1]),empty=read(argv[2]);
 std::srand(1);
 Preferences::store().clear();Preferences p;
 p.putBool("init",true);p.putShort("dexn",1);p.putUInt("age",540);
 p.putUChar("ene",80);p.putUChar("joy",70);p.putUChar("bond",50);
 p.putUChar(std::string(TP_KANTO_KEYS.arenaVersion).c_str(),1);
 p.putUChar(std::string(TP_KANTO_KEYS.arenaMask).c_str(),63);
 hero=Pet();hero.begin();

 stage(true);assert(!tp_zpd_start());
 auto token=tp_f4_store_begin();assert(token);
 assert(tp_zpd_advance(token,0)&&tp_f4_store_finish(token,1));
 stage(true);assert(!tp_zpd_start());
 token=tp_f4_store_begin();assert(token);
 assert(tp_zpd_advance(token,1)&&tp_f4_store_finish(token,1));
 const auto ready=Preferences::store();
 const auto energy=hero.energy,joy=hero.joy,bond=hero.bond;
 const auto level=hero.level();
 const auto atk=hero.trAtk,def=hero.trDef,spe=hero.trSpe;
 const auto wins=hero.battleWins,losses=hero.battleLosses;

 // Existing pending admission and unreadable transport both block a new duel.
 token=tp_f4_store_begin();assert(token);
 assert(tp_f4_admission_stage(token,pending.data(),int(pending.size()),1));
 assert(tp_f4_store_finish(token,1));
 stage(true);assert(!tp_zpd_start());
 Preferences::store()=ready;
 p.putBool("f4apend",true);
 stage(true);assert(!tp_zpd_start());
 Preferences::store()=ready;

 // Abort is RAM-only: no story victory, counter or entitlement.
 stage(true,2);assert(tp_zpd_start());
 assert(tp_zpd_get(0)&&tp_battle_wild_dex()==145&&tp_battle_wild_level()==50);
 assert(!tp_zpd_start()&&!tp_zpd_result_begin());
 assert(tp_wt_switch(1));assert(tp_wt_switch(0));
 tp_battle_close();
 assert(!tp_battle_is_open()&&tp_zpd_step()==2);
 assert(Preferences::store()==ready);

 // Actual native victory; wrong result/capture channels cannot claim it.
 stage(true);assert(tp_zpd_start());fight();
 assert(tp_battle_player_won()&&tp_zpd_get(1));
 assert(!tp_battle_catch_offered()&&!tp_f4_capture_begin());
 assert(!tp_wt_result_begin());
 assert(std::string(tp_zpd_snapshot()).find("\"level\":50")!=std::string::npos);
 tp_battle_try_catch();assert(!hero.isCaught(145));
 const auto snapshot=std::string(tp_zpd_snapshot());

 // Actor mismatch is refused without discarding the resolved result.
 const auto gene=hero.geneAtk;hero.geneAtk=uint8_t(gene+1);
 assert(!tp_zpd_result_begin());hero.geneAtk=gene;

 token=tp_zpd_result_begin();assert(token);
 assert(!tp_zpd_result_begin()&&!tp_zpd_result_apply(token+1,1));
 assert(!tp_zpd_result_apply(token,1)); // no staged admission yet
 assert(!tp_zpd_result_finish(token,1));
 tp_battle_close();assert(tp_battle_is_open()); // token protects combat
 assert(tp_f4_admission_stage(token,pending.data(),int(pending.size()),1));
 assert(tp_zpd_result_apply(token,1));
 assert(!tp_zpd_result_apply(token,1));
 assert(hero.isCaught(145)&&hero.battleWins==wins+1);
 assert(hero.level()==level&&hero.energy==energy&&hero.joy==joy&&hero.bond==bond);
 assert(hero.trAtk==atk&&hero.trDef==def&&hero.trSpe==spe);
 assert(tp_zpd_step()==3&&tp_f4_admission_pending()==1);
 assert(tp_zpd_result_finish(token,0));
 assert(Preferences::store()==ready&&tp_zpd_step()==2);
 assert(!hero.isCaught(145)&&hero.battleWins==wins);
 assert(tp_zpd_get(1)&&!tp_zpd_get(2));
 assert(std::string(tp_zpd_snapshot())==snapshot);

 // Retry the same resolved outcome, with no second fight and no catch roll.
 token=tp_zpd_result_begin();assert(token);
 assert(tp_f4_admission_stage(token,pending.data(),int(pending.size()),1));
 assert(tp_zpd_result_apply(token,1));
 assert(tp_zpd_result_finish(token,1));
 assert(tp_zpd_get(2)&&!tp_zpd_get(1)&&tp_zpd_step()==3);
 assert(hero.battleWins==wins+1&&hero.isCaught(145));
 assert(!tp_zpd_result_begin()&&!tp_zpd_result_apply(token,1));
 tp_battle_close();assert(!tp_battle_is_open());
 stage(true);assert(!tp_zpd_start());
 token=tp_f4_store_begin();assert(token);
 assert(tp_f4_admission_stage(token,empty.data(),int(empty.size()),0));
 assert(tp_f4_store_finish(token,1));
 hero=Pet();hero.begin();
 assert(tp_zpd_step()==3&&tp_zpd_ticket()==1&&hero.isCaught(145));
 stage(true);assert(!tp_zpd_start());

 // Separate actual loss: preparation remains, no Zapdos entitlement.
 Preferences::store()=ready;hero=Pet();hero.begin();
 stage(false);assert(tp_zpd_start());fight();
 assert(!tp_battle_player_won()&&tp_zpd_get(1));
 assert(std::string(tp_zpd_snapshot())=="null");
 token=tp_zpd_result_begin();assert(token);
 assert(!tp_zpd_result_apply(token,1));
 assert(tp_zpd_result_apply(token,0));
 assert(tp_zpd_result_finish(token,1));
 assert(tp_zpd_step()==2&&tp_zpd_ticket()==0&&!tp_f4_admission_pending());
 assert(!hero.isCaught(145)&&hero.battleLosses==losses+1);
 assert(hero.energy==energy&&hero.joy==joy&&hero.bond==bond);
 assert(hero.level()==level&&hero.trAtk==atk&&hero.trDef==def&&hero.trSpe==spe);
 tp_battle_close();

 std::cout<<"P06 native Zapdos duel passed: actual battle math and team "
  "runtime, fixed level-50 enemy, switches/abort, actual win and loss, "
  "actor/token guards, no catch channel, no extra level/care/energy reward, "
  "joint victory/admission/history rollback and same-outcome retry, "
  "single entitlement and retained completion after reload. Synthetic "
  "combat stats are fixtures, not a balancing or browser-UI claim.\n";
}
