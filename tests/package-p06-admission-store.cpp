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
Pet &tp_battle_pet(){return hero;}
extern "C" int tp_battle_is_open(){return 0;}
extern "C" {
int tp_f4_admission_size();
const uint8_t *tp_f4_admission_ptr();
int tp_f4_admission_pending();
int tp_f4_admission_stage(uint32_t,const uint8_t*,int,int);
uint32_t tp_f4_store_begin();
int tp_f4_store_finish(uint32_t,int);
}
std::vector<uint8_t> read(const char *path){
 std::ifstream in(path,std::ios::binary);
 assert(in);
 return std::vector<uint8_t>(
  std::istreambuf_iterator<char>(in),std::istreambuf_iterator<char>()
 );
}
int main(int argc,char **argv){
 assert(argc==3);
 const auto pending=read(argv[1]),empty=read(argv[2]);
 assert(!pending.empty()&&!empty.empty());
 Preferences::store().clear();Preferences p;
 p.putBool("init",true);p.putShort("dexn",1);p.putUInt("age",540);
 p.putUChar("ene",80);
 hero=Pet();hero.begin();
 const auto initial=Preferences::store();
 const auto energy=hero.energy;
 assert(tp_f4_admission_size()==0&&!tp_f4_admission_ptr());
 assert(tp_f4_admission_pending()==0);
 assert(!tp_f4_admission_stage(1,pending.data(),int(pending.size()),1));

 auto token=tp_f4_store_begin();assert(token);
 assert(!tp_f4_admission_stage(token+1,pending.data(),int(pending.size()),1));
 assert(!tp_f4_admission_stage(token,pending.data(),0,1));
 assert(!tp_f4_admission_stage(token,pending.data(),int(pending.size()),2));
 assert(tp_f4_admission_stage(token,pending.data(),int(pending.size()),1));
 hero.energy=17;p.putUChar("ene",17);
 assert(tp_f4_admission_pending()==1);
 assert(tp_f4_admission_size()==int(pending.size()));
 assert(std::vector<uint8_t>(tp_f4_admission_ptr(),
  tp_f4_admission_ptr()+pending.size())==pending);
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==initial&&hero.energy==energy);
 assert(tp_f4_admission_size()==0);

 token=tp_f4_store_begin();assert(token);
 assert(tp_f4_admission_stage(token,pending.data(),int(pending.size()),1));
 assert(tp_f4_store_finish(token,1));
 assert(tp_f4_admission_pending()==1);
 const auto waiting=Preferences::store();
 // Generic care/collection transactions remain possible while waiting.
 token=tp_f4_store_begin();assert(token);
 assert(tp_f4_admission_stage(token,empty.data(),int(empty.size()),0));
 assert(tp_f4_admission_pending()==0);
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==waiting&&tp_f4_admission_pending()==1);

 token=tp_f4_store_begin();assert(token);
 assert(tp_f4_admission_stage(token,empty.data(),int(empty.size()),0));
 assert(tp_f4_store_finish(token,1));
 assert(tp_f4_admission_pending()==0);
 const auto completed=Preferences::store();
 hero=Pet();hero.begin();
 assert(tp_f4_admission_size()==int(empty.size()));

 auto damaged=std::get<std::vector<uint8_t>>(
  Preferences::store().at("f4admit"));
 damaged[0]^=1;Preferences::store()["f4admit"]=damaged;
 assert(tp_f4_admission_size()<0&&tp_f4_admission_pending()<0);
 auto bad=Preferences::store();
 token=tp_f4_store_begin();assert(token);
 assert(!tp_f4_admission_stage(token,empty.data(),int(empty.size()),0));
 assert(tp_f4_store_finish(token,0)&&Preferences::store()==bad);

 Preferences::store()=completed;p.putBool("f4apend",true);
 assert(tp_f4_admission_size()<0);
 Preferences::store()=completed;p.putUChar("f4aver",2);
 assert(tp_f4_admission_size()<0);
 bad=Preferences::store();
 token=tp_f4_store_begin();assert(token);
 assert(!tp_f4_admission_stage(token,empty.data(),int(empty.size()),0));
 assert(tp_f4_store_finish(token,0)&&Preferences::store()==bad);

 for(const char *key:{"f4aver","f4admit","f4apend","f4acrc"}){
  Preferences::store()=completed;Preferences::store().erase(key);
  assert(tp_f4_admission_size()<0);
 }
 Preferences::store()=completed;
 const auto beforeRead=Preferences::store();
 (void)tp_f4_admission_size();(void)tp_f4_admission_ptr();
 (void)tp_f4_admission_pending();
 assert(Preferences::store()==beforeRead);
 std::cout<<"P06 native admission transport passed: actual JS fixtures, "
  "shared whole-Pet/store rollback/commit, retained empty-state counter "
  "container, read neutrality, care transaction availability, exact bytes "
  "and checksum/future/partial refusal. JSON semantics are validated in "
  "the actual JS parser, not claimed in the opaque native transport.\n";
}
