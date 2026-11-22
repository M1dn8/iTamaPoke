// P07a native preparation contract. Synthetic Preferences only.
#include <cassert>
#include <cstdint>
#include <iostream>
#include <string>
#include "pet.h"
#include "../browser_ver/core/region-progress-keys.h"

uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}
Pet hero;
bool battleOpen=false;
Pet &tp_battle_pet(){return hero;}

extern "C" {
int tp_battle_is_open(){return battleOpen?1:0;}
uint32_t tp_f4_store_begin();
int tp_f4_store_finish(uint32_t,int);
int tp_story_step(int);
int tp_story_ticket(int);
int tp_story_access(int);
int tp_story_region(int);
int tp_story_badges(int);
int tp_story_kanto_badges(int);
int tp_story_notice_read(int);
int tp_story_notice_mark(uint32_t,int);
int tp_story_advance(uint32_t,int,int);
int tp_suicune_source_complete(uint32_t,int,int,int);
}

void fixture(int mask=15,bool unlocked=true){
 battleOpen=false;
 Preferences::store().clear();
 Preferences p;
 p.putBool("init",true);
 p.putShort("dexn",1);p.putShort("eggT2",1);
 p.putUInt("age",5940);
 for(const char *key:{"full","joy","ene","hyg","bond"})
  p.putUChar(key,80);
 for(const char *key:{"gatk","gdef","gspe"})
  p.putUChar(key,100);
 p.putUChar(TP_KANTO_KEYS.arenaVersion,1);
 p.putUChar(TP_KANTO_KEYS.arenaMask,255);
 p.putUChar(TP_JOHTO_KEYS.arenaVersion,1);
 p.putUChar(TP_JOHTO_KEYS.arenaMask,uint8_t(mask));
 p.putUChar(TP_KANTO_KEYS.leagueVersion,1);
 p.putBool(TP_KANTO_KEYS.leagueDone,unlocked);
 p.putUInt(TP_KANTO_KEYS.leagueDate,unlocked?1700000000u:0u);
 hero=Pet();hero.begin();
}

void investigate(){
 const auto token=tp_f4_store_begin();assert(token);
 assert(tp_story_advance(token,245,0));
 assert(tp_f4_store_finish(token,1));
 assert(tp_story_step(245)==1);
}

int main(int argc,char **argv){
 if(argc==2&&std::string(argv[1])=="--matrix"){
  std::string matrix;
  for(int a=0;a<4;a++)for(int b=0;b<4;b++)for(int c=0;c<4;c++){
   fixture();investigate();
   const auto before=Preferences::store();
   const auto token=tp_f4_store_begin();assert(token);
   matrix+=tp_suicune_source_complete(token,a,b,c)?'1':'0';
   assert(tp_f4_store_finish(token,0));
   assert(Preferences::store()==before);
  }
  std::cout<<"P07A_MATRIX="<<matrix<<"\n";
  return 0;
 }

 fixture();
 assert(tp_story_region(245)==1&&tp_story_region(144)==0);
 assert(tp_story_region(246)==-1&&tp_story_access(246)==-1);
 assert(tp_story_step(245)==0&&tp_story_ticket(245)==0);
 assert(tp_story_notice_read(245)==0);

 // Every distinct Johto badge combination; reads must never write.
 for(int mask=0;mask<256;mask++){
  fixture(mask);
  int count=0;
  for(int bit=0;bit<8;bit++)if(mask&(1<<bit))count++;
  const auto before=Preferences::store();
  assert(tp_story_badges(245)==count);
  assert(tp_story_kanto_badges(245)==8);
  assert(tp_story_access(245)==int(count>=4));
  assert(tp_story_badges(144)==8&&tp_story_access(144)==1);
  assert(Preferences::store()==before);
 }

 // Johto badges do not bypass the historical region gate.
 fixture(255,false);
 auto before=Preferences::store();
 assert(tp_story_access(245)==0);
 auto token=tp_f4_store_begin();assert(token);
 assert(!tp_story_notice_mark(token,245));
 assert(!tp_story_advance(token,245,0));
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==before);

 fixture(0,true);
 assert(tp_story_access(245)==0); // Kanto's eight badges do not count.

 // Malformed regional or story metadata is not repaired.
 for(int damage=0;damage<8;damage++){
  fixture();
  Preferences p;
  if(damage==0)Preferences::store().erase(TP_JOHTO_KEYS.arenaVersion);
  if(damage==1)p.putBool(TP_JOHTO_KEYS.arenaMask,true);
  if(damage==2)p.putUChar(TP_JOHTO_KEYS.arenaVersion,2);
  if(damage==3)p.putUInt(TP_JOHTO_KEYS.arenaMask,256);
  if(damage==4)p.putUChar(TP_KANTO_KEYS.leagueDone,1);
  if(damage==5)p.putUChar("suiver",1);
  if(damage==6)p.putUChar("suinver",1);
  if(damage==7){
   p.putUChar("suiver",2);p.putUChar("suistep",0);p.putUInt("suitick",0);
  }
  before=Preferences::store();
  assert(tp_story_access(245)<0);
  assert(Preferences::store()==before);
 }

 // Notice and preparation use the existing whole-state rollback.
 fixture();
 before=Preferences::store();
 const auto energy=hero.energy;
 token=tp_f4_store_begin();assert(token);
 assert(!tp_story_advance(token+1,245,0));
 assert(tp_story_notice_mark(token,245));
 assert(tp_story_advance(token,245,0));
 assert(!tp_story_advance(token,245,0));
 hero.energy=12;
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==before&&hero.energy==energy);
 assert(tp_story_step(245)==0&&tp_story_notice_read(245)==0);

 // A connection alone cannot skip investigation.
 token=tp_f4_store_begin();assert(token);
 assert(!tp_suicune_source_complete(token,2,0,0));
 assert(tp_f4_store_finish(token,0));

 investigate();
 before=Preferences::store();
 token=tp_f4_store_begin();assert(token);
 assert(!tp_story_advance(token,245,1));
 assert(!tp_story_advance(token,245,2));
 assert(!tp_suicune_source_complete(token+1,2,0,0));
 assert(!tp_suicune_source_complete(token,-1,0,0));
 assert(!tp_suicune_source_complete(token,2,0,4));
 assert(!tp_suicune_source_complete(token,0,1,1));
 assert(Preferences::store()==before);
 battleOpen=true;
 assert(!tp_suicune_source_complete(token,2,0,0));
 battleOpen=false;
 assert(tp_suicune_source_complete(token,2,0,0));
 assert(tp_story_step(245)==2);
 assert(!tp_suicune_source_complete(token,2,0,0));
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==before&&tp_story_step(245)==1);

 // Commit adds only the three Suicune state fields.
 token=tp_f4_store_begin();assert(token);
 assert(tp_suicune_source_complete(token,2,0,2));
 assert(tp_f4_store_finish(token,1));
 auto expected=before;
 expected["suiver"]=int64_t(1);
 expected["suistep"]=int64_t(2);
 expected["suitick"]=int64_t(0);
 assert(Preferences::store()==expected);
 assert(tp_story_step(245)==2&&tp_story_ticket(245)==0);
 hero=Pet();hero.begin();
 assert(tp_story_step(245)==2&&tp_story_access(245)==1);
 token=tp_f4_store_begin();assert(token);
 assert(!tp_suicune_source_complete(token,2,0,0));
 assert(!tp_story_advance(token,245,2));
 assert(tp_f4_store_finish(token,0));
 assert(tp_story_step(245)==2);

 std::cout<<"P07a Suicune native preparation passed: 256 Johto masks, "
  "region gate, Kanto separation, malformed metadata, read neutrality, "
  "token/input/battle guards, verified-only completion, whole-state "
  "rollback, commit, reload and duplicate refusal. "
  "No browser, duel, admission or durable-disk claim.\n";
}
