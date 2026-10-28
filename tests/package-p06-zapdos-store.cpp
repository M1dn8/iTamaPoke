#include <cassert>
#include <fstream>
#include <iostream>
#include <iterator>
#include <vector>
#include "pet.h"

uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}
static Pet hero;
static bool battleOpen=false;
Pet &tp_battle_pet(){return hero;}
extern "C" int tp_battle_is_open(){return battleOpen?1:0;}
extern "C" {
int tp_zpd_step();
int tp_zpd_kanto_badges();
int tp_zpd_access();
int tp_zpd_notice_read();
int tp_zpd_notice_mark(uint32_t);
int tp_zpd_ticket();
int tp_zpd_advance(uint32_t,int);
int tp_zpd_store_victory(uint32_t,uint32_t);
uint32_t tp_f4_store_begin();
int tp_f4_store_finish(uint32_t,int);
int tp_f4_admission_pending();
int tp_f4_admission_stage(uint32_t,const uint8_t*,int,int);
}
std::vector<uint8_t> read(const char *path){
 std::ifstream in(path,std::ios::binary);assert(in);
 return {std::istreambuf_iterator<char>(in),std::istreambuf_iterator<char>()};
}
#include "p06-story-access-checks.h"
#include "p06-articuno-access-checks.h"

int main(int argc,char **argv){
 assert(argc==3);
 const auto pending=read(argv[1]),completedAdmission=read(argv[2]);
 Preferences::store().clear();Preferences p;
 p.putBool("init",true);p.putShort("dexn",1);p.putUInt("age",540);
 p.putUChar("ene",80);hero=Pet();hero.begin();
 p06CheckStoryAccess();
 p06CheckArktosAccess();
 p06CheckStoryIsolation();
 p.putUChar(std::string(TP_KANTO_KEYS.arenaVersion).c_str(),1);
 p.putUChar(std::string(TP_KANTO_KEYS.arenaMask).c_str(),63);
 const auto initial=Preferences::store();
 const auto energy=hero.energy;
 assert(tp_zpd_step()==0&&tp_zpd_ticket()==0);
 assert(Preferences::store()==initial);
 assert(!tp_zpd_advance(1,0));

 auto token=tp_f4_store_begin();assert(token);
 assert(!tp_zpd_advance(token+1,0));
 assert(!tp_zpd_advance(token,1));
 assert(!tp_zpd_advance(token,2));
 assert(tp_zpd_advance(token,0));
 assert(tp_zpd_step()==1&&!tp_zpd_advance(token,0));
 hero.energy=17;p.putUChar("ene",17);
 assert(tp_f4_store_finish(token,0));
 assert(tp_zpd_step()==0&&Preferences::store()==initial&&hero.energy==energy);

 token=tp_f4_store_begin();assert(token);
 assert(tp_zpd_advance(token,0)&&tp_f4_store_finish(token,1));
 const auto investigated=Preferences::store();
 token=tp_f4_store_begin();assert(token);
 battleOpen=true;assert(!tp_zpd_advance(token,1));battleOpen=false;
 assert(tp_zpd_advance(token,1));
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==investigated&&tp_zpd_step()==1);

 token=tp_f4_store_begin();assert(token);
 assert(tp_zpd_advance(token,1)&&tp_f4_store_finish(token,1));
 const auto ready=Preferences::store();
 assert(tp_zpd_step()==2&&tp_zpd_ticket()==0);

 // Exercise the internal storage pairing, NOT actual combat authority.
 token=tp_f4_store_begin();assert(token);battleOpen=true;
 assert(!tp_zpd_store_victory(token,1));
 assert(tp_f4_admission_stage(token,pending.data(),int(pending.size()),1));
 assert(!tp_zpd_store_victory(token+1,1));
 assert(!tp_zpd_store_victory(token,0));
 assert(!tp_zpd_store_victory(token,0x7fffffffu));
 assert(tp_zpd_store_victory(token,1));
 assert(tp_zpd_step()==3&&tp_zpd_ticket()==1);
 assert(!tp_zpd_store_victory(token,1));
 hero.energy=17;p.putUChar("ene",17);
 assert(tp_f4_store_finish(token,0));battleOpen=false;
 assert(Preferences::store()==ready&&hero.energy==energy);
 assert(tp_zpd_step()==2&&tp_f4_admission_pending()==0);

 token=tp_f4_store_begin();assert(token);battleOpen=true;
 assert(tp_f4_admission_stage(token,pending.data(),int(pending.size()),1));
 assert(tp_zpd_store_victory(token,1));
 assert(tp_f4_store_finish(token,1));battleOpen=false;
 const auto waiting=Preferences::store();
 assert(tp_zpd_step()==3&&tp_zpd_ticket()==1&&tp_f4_admission_pending()==1);
 assert(!tp_zpd_store_victory(token,1));

 token=tp_f4_store_begin();assert(token);
 assert(tp_f4_admission_stage(token,completedAdmission.data(),
  int(completedAdmission.size()),0));
 assert(tp_f4_store_finish(token,1));
 assert(tp_zpd_step()==3&&tp_zpd_ticket()==1&&!tp_f4_admission_pending());
 hero=Pet();hero.begin();
 assert(tp_zpd_step()==3&&tp_zpd_ticket()==1);
 const auto completed=Preferences::store();
 assert(!tp_zpd_advance(1,0));

 for(const char *key:{"zpdver","zpdstep","zpdtick"}){
  Preferences::store()=completed;Preferences::store().erase(key);
  assert(tp_zpd_step()<0&&tp_zpd_ticket()<0);
 }
 Preferences::store()=completed;p.putUChar("zpdver",2);
 assert(tp_zpd_step()<0);
 Preferences::store()=completed;p.putBool("zpdstep",true);
 assert(tp_zpd_step()<0);
 Preferences::store()=completed;p.putUInt("zpdtick",0);
 assert(tp_zpd_step()<0);
 Preferences::store()=ready;p.putUInt("zpdtick",1);
 assert(tp_zpd_step()<0);
 const auto damaged=Preferences::store();
 token=tp_f4_store_begin();assert(token);
 assert(!tp_zpd_advance(token,1));
 assert(tp_f4_store_finish(token,0)&&Preferences::store()==damaged);
 Preferences::store()=waiting;
 const auto beforeRead=Preferences::store();
 (void)tp_zpd_step();(void)tp_zpd_ticket();
 assert(Preferences::store()==beforeRead);

 std::cout<<"P06 native Zapdos storage passed: actual Pet/Preferences, "
  "ordered preparation, existing whole-state rollback/commit, pending "
  "admission pairing, retained victory after admission/reload, no public "
  "victory setter and partial/type/future refusal. Combat ownership and "
  "JSON ticket semantics are not claimed by this scalar storage test.\n";
}
