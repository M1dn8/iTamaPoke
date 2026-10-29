#include <cassert>
#include <iostream>
#include <vector>
#include "pet.h"
#include "../browser_ver/core/region-progress-keys.h"
#include "../browser_ver/core/league-hall.h"

uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}
static Pet hero;
static bool battleOpen=false;
static uint32_t dateSerial=0;
Pet &tp_battle_pet(){return hero;}
extern "C" int tp_battle_is_open(){return battleOpen?1:0;}
extern "C" {
int tp_story_access(int);
int tp_story_step(int);
int tp_story_ticket(int);
int tp_story_notice_read(int);
int tp_story_notice_mark(uint32_t,int);
int tp_story_advance(uint32_t,int,int);
uint32_t tp_f4_store_begin();
int tp_f4_store_finish(uint32_t,int);
int tp_f4_store_pending();
}
static void setup(){
 assert(!tp_f4_store_pending());
 Preferences::store().clear();Preferences p;
 p.putBool("init",true);p.putShort("dexn",1);p.putUInt("age",540);
 p.putUChar("ene",80);
 p.putUChar("agver",1);p.putUChar("agmask",255);
 p.putUChar("lgver",1);p.putBool("lgkdone",true);
 p.putUInt("lgkdate",1700000000u);
 hero=Pet();hero.begin();battleOpen=false;dateSerial=0;
}
static void win(int region,int variant){
 assert(tpHallStageWinFor(
  region,hero,hero.level(),0,1,uint8_t(variant),
  1700000000u+(++dateSerial)
 ));
}
static void variants(int mask){
 for(int variant=0;variant<3;variant++)
  if(mask&(1<<variant))win(0,variant);
}
int main(int argc,char **argv){
 if(argc==2&&std::string(argv[1])=="--review-fixtures"){
  const char *digits="0123456789abcdef";
  std::cout<<"[";
  for(int fixture=0;fixture<3;fixture++){
   setup();
   if(fixture==0)variants(3);
   else if(fixture==1)for(int n=0;n<3;n++)win(0,0);
   else variants(7);
   const int mask=tpHallCompletedVariantsFor(0);
   const int allowed=tp_story_access(151);
   assert(mask==(fixture==0?3:fixture==1?1:7));
   assert(allowed==int(fixture==2));
   const auto &s=Preferences::store();
   const auto version=std::get<int64_t>(s.at("lhver"));
   const auto &bytes=std::get<std::vector<uint8_t>>(s.at("lhdata"));
   if(fixture)std::cout<<",";
   std::cout<<"{\"mask\":"<<mask<<",\"access\":"<<allowed
    <<",\"version\":"<<version<<",\"hex\":\"";
   for(const auto byte:bytes)
    std::cout<<digits[byte>>4]<<digits[byte&15];
   std::cout<<"\"}";
  }
  std::cout<<"]\n";return 0;
 }

 for(int mask=0;mask<8;mask++){
  setup();variants(mask);
  const auto before=Preferences::store();
  const auto energy=hero.energy;
  assert(tpHallCompletedVariantsFor(0)==mask);
  assert(tp_story_access(151)==int(mask==7));
  assert(tp_story_step(151)==0&&tp_story_ticket(151)==0);
  assert(Preferences::store()==before);
  auto token=tp_f4_store_begin();assert(token);
  assert(!tp_story_notice_mark(token+1,151));
  assert(tp_story_notice_mark(token,151)==int(mask==7));
  assert(tp_story_advance(token,151,0)==int(mask==7));
  assert(tp_f4_store_finish(token,0));
  assert(Preferences::store()==before&&hero.energy==energy);
 }

 for(int repeats:{3,15}){
  setup();
  for(int n=0;n<repeats;n++)win(0,1);
  assert(tpHallCompletedVariantsFor(0)==2);
  assert(tp_story_access(151)==0);
 }

 setup();
 for(int n=0;n<3;n++)win(1,0);
 assert(tpHallCompletedVariantsFor(1)==1);
 assert(tpHallCompletedVariantsFor(0)==0);
 assert(tp_story_access(151)==0);

 setup();variants(7);
 Preferences p;
 p.putBool("lgkdone",false);p.putUInt("lgkdate",0);
 assert(tp_story_access(151)==0);
 p.putUChar("lgver",2);
 assert(tp_story_access(151)<0);

 setup();variants(7);
 for(const char *key:{"lgver","lgkdone","lgkdate"})
  Preferences::store().erase(key);
 assert(tp_story_access(151)==0);

 setup();variants(7);
 const auto valid=Preferences::store();
 for(int damage=0;damage<7;damage++){
  Preferences::store()=valid;
  auto &s=Preferences::store();
  if(damage==0)s.erase("lhver");
  if(damage==1)s.erase("lhdata");
  if(damage==2)s["lhver"]=int64_t(3);
  if(damage==3)s["lhver"]=true;
  if(damage==4)s["lhdata"]=int64_t(1);
  if(damage==5){
   auto &bytes=std::get<std::vector<uint8_t>>(s.at("lhdata"));
   bytes[5]^=1;
  }
  if(damage==6){
   auto &bytes=std::get<std::vector<uint8_t>>(s.at("lhdata"));
   bytes[2]='J';
  }
  const auto before=s;
  assert(tpHallCompletedVariantsFor(0)<0);
  assert(tp_story_access(151)<0);
  auto token=tp_f4_store_begin();assert(token);
  assert(!tp_story_notice_mark(token,151));
  assert(!tp_story_advance(token,151,0));
  assert(tp_f4_store_finish(token,0));
  assert(Preferences::store()==before);
 }

 // Historical variant mask survives trimming the displayed records.
 setup();variants(7);
 for(int n=0;n<15;n++)win(0,0);
 const auto historical=Preferences::store();
 assert(tpHallCompletedVariantsFor(0)==7);
 assert(tp_story_access(151)==1);
 hero=Pet();hero.begin();
 assert(tpHallCompletedVariantsFor(0)==7);
 assert(Preferences::store()==historical);

 auto token=tp_f4_store_begin();assert(token);
 battleOpen=true;
 assert(!tp_story_notice_mark(token,151));
 assert(!tp_story_advance(token,151,0));
 battleOpen=false;
 assert(tp_story_notice_mark(token,151));
 assert(tp_story_advance(token,151,0));
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==historical);

 token=tp_f4_store_begin();assert(token);
 assert(tp_story_notice_mark(token,151));
 assert(tp_story_advance(token,151,0));
 assert(tp_f4_store_finish(token,1));
 hero=Pet();hero.begin();
 assert(tp_story_step(151)==1&&tp_story_notice_read(151)==1);

 // Established story entitlement remains available for free retries.
 for(const char *key:{"lgver","lgkdone","lgkdate","lhver","lhdata"})
  Preferences::store().erase(key);
 assert(tp_story_access(151)==1);
 token=tp_f4_store_begin();assert(token);
 assert(tp_story_advance(token,151,1));
 assert(tp_f4_store_finish(token,1));
 assert(tp_story_step(151)==2&&hero.energy==80);
 assert(tpHallCompletedVariantsFor(2)<0);

 std::cout<<"Mew native access passed: actual Hall serialization/decoding, "
  "all eight variant masks, repeated same-variant and Johto refusal, "
  "league-proof/CRC/type/future/region guards, historical mask after record "
  "trimming, read-only queries, notice/progress rollback and reload. "
  "Hall victories are synthetic fixtures, not a full League replay.\n";
}
