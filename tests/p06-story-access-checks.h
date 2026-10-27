
#pragma once
#include "../browser_ver/core/region-progress-keys.h"

static void p06CheckStoryAccess(){
 const auto original=Preferences::store();
 Preferences p;
 const auto kver=std::string(TP_KANTO_KEYS.arenaVersion);
 const auto kmask=std::string(TP_KANTO_KEYS.arenaMask);
 const auto jver=std::string(TP_JOHTO_KEYS.arenaVersion);
 const auto jmask=std::string(TP_JOHTO_KEYS.arenaMask);
 auto badges=[&](int mask){
  Preferences::store()=original;
  p.putUChar(kver.c_str(),1);p.putUChar(kmask.c_str(),mask);
  p.putUChar(jver.c_str(),1);p.putUChar(jmask.c_str(),255);
 };
 assert(tp_zpd_notice_read()==0);
 assert(tp_zpd_access()==0&&tp_zpd_kanto_badges()==0);
 assert(Preferences::store()==original);

 for(int mask=0;mask<256;mask++){
  badges(mask);
  int count=0;
  for(int bit=0;bit<8;bit++)if(mask&(1<<bit))count++;
  const bool allowed=count>=6;
  const auto before=Preferences::store();
  assert(tp_zpd_kanto_badges()==count);
  assert(tp_zpd_access()==int(allowed));
  auto token=tp_f4_store_begin();assert(token);
  assert(!tp_zpd_notice_mark(token+1));
  assert(tp_zpd_notice_mark(token)==int(allowed));
  assert(tp_zpd_notice_read()==int(allowed));
  assert(tp_zpd_advance(token,0)==int(allowed));
  assert(tp_f4_store_finish(token,0));
  assert(Preferences::store()==before&&tp_zpd_notice_read()==0);
 }

 for(int step=1;step<=3;step++){
  badges(0);
  p.putUChar("zpdver",1);p.putUChar("zpdstep",step);
  p.putUInt("zpdtick",step==3?1:0);
  const auto before=Preferences::store();
  assert(tp_zpd_access()==1);
  assert(Preferences::store()==before);
  if(step==1){
   auto token=tp_f4_store_begin();assert(token);
   assert(tp_zpd_advance(token,1));
   assert(tp_f4_store_finish(token,0));
   assert(Preferences::store()==before);
  }
 }

 badges(63);
 p.putBool(kmask.c_str(),true);
 assert(tp_zpd_kanto_badges()<0&&tp_zpd_access()<0);
 badges(63);
 p.putUChar(kver.c_str(),2);
 assert(tp_zpd_kanto_badges()<0&&tp_zpd_access()<0);
 badges(63);
 Preferences::store().erase(kver);
 assert(tp_zpd_kanto_badges()<0&&tp_zpd_access()<0);

 badges(63);
 const auto unread=Preferences::store();
 auto token=tp_f4_store_begin();assert(token);
 battleOpen=true;assert(!tp_zpd_notice_mark(token));battleOpen=false;
 assert(tp_zpd_notice_mark(token)&&tp_zpd_notice_read()==1);
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==unread&&tp_zpd_notice_read()==0);

 token=tp_f4_store_begin();assert(token);
 assert(tp_zpd_notice_mark(token));
 const auto once=Preferences::store();
 assert(tp_zpd_notice_mark(token)&&Preferences::store()==once);
 assert(tp_f4_store_finish(token,1));
 const auto committed=Preferences::store();
 hero=Pet();hero.begin();
 assert(tp_zpd_notice_read()==1);

 for(int damage=0;damage<5;damage++){
  Preferences::store()=committed;
  if(damage==0)Preferences::store().erase("stynver");
  if(damage==1)Preferences::store().erase("stynread");
  if(damage==2)p.putUChar("stynver",2);
  if(damage==3)p.putBool("stynread",true);
  if(damage==4)p.putUChar("stynread",2);
  const auto before=Preferences::store();
  assert(tp_zpd_notice_read()<0&&tp_zpd_access()<0);
  assert(Preferences::store()==before);
  token=tp_f4_store_begin();assert(token);
  assert(!tp_zpd_notice_mark(token)&&!tp_zpd_advance(token,0));
  assert(tp_f4_store_finish(token,0)&&Preferences::store()==before);
 }
 Preferences::store()=original;
 hero=Pet();hero.begin();
 assert(Preferences::store()==original);
 std::cout<<"P06 story access passed: all 256 Kanto masks, Johto excluded, "
  "existing progress retained, notice commit/rollback/reload/idempotency "
  "and malformed metadata refused.\n";
}
