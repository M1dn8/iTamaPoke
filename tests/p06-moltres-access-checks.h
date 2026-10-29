
#pragma once
#include "../browser_ver/core/region-progress-keys.h"

extern "C" {
 int tp_story_step(int);
 int tp_story_ticket(int);
 int tp_story_kanto_badges(int);
 int tp_story_access(int);
 int tp_story_notice_read(int);
 int tp_story_notice_mark(uint32_t,int);
 int tp_story_advance(uint32_t,int,int);
}

static void p06CheckMoltresAccess(){
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
 assert(tp_story_notice_read(146)==0);
 assert(tp_story_access(146)==0&&tp_story_kanto_badges(146)==0);
 assert(Preferences::store()==original);

 for(int mask=0;mask<256;mask++){
  badges(mask);
  int count=0;
  for(int bit=0;bit<8;bit++)if(mask&(1<<bit))count++;
  const bool allowed=count>=8;
  const auto before=Preferences::store();
  assert(tp_story_kanto_badges(146)==count);
  assert(tp_story_access(146)==int(allowed));
  auto token=tp_f4_store_begin();assert(token);
  assert(!tp_story_notice_mark(token+1,146));
  assert(tp_story_notice_mark(token,146)==int(allowed));
  assert(tp_story_notice_read(146)==int(allowed));
  assert(tp_story_advance(token,146,0)==int(allowed));
  assert(tp_f4_store_finish(token,0));
  assert(Preferences::store()==before&&tp_story_notice_read(146)==0);
 }

 for(int step=1;step<=3;step++){
  badges(0);
  p.putUChar("mltver",1);p.putUChar("mltstep",step);
  p.putUInt("mlttick",step==3?1:0);
  const auto before=Preferences::store();
  assert(tp_story_access(146)==1);
  assert(Preferences::store()==before);
  if(step==1){
   auto token=tp_f4_store_begin();assert(token);
   assert(tp_story_advance(token,146,1));
   assert(tp_f4_store_finish(token,0));
   assert(Preferences::store()==before);
  }
 }

 badges(255);
 p.putBool(kmask.c_str(),true);
 assert(tp_story_kanto_badges(146)<0&&tp_story_access(146)<0);
 badges(255);
 p.putUChar(kver.c_str(),2);
 assert(tp_story_kanto_badges(146)<0&&tp_story_access(146)<0);
 badges(255);
 Preferences::store().erase(kver);
 assert(tp_story_kanto_badges(146)<0&&tp_story_access(146)<0);

 badges(255);
 const auto unread=Preferences::store();
 auto token=tp_f4_store_begin();assert(token);
 battleOpen=true;assert(!tp_story_notice_mark(token,146));battleOpen=false;
 assert(tp_story_notice_mark(token,146)&&tp_story_notice_read(146)==1);
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==unread&&tp_story_notice_read(146)==0);

 token=tp_f4_store_begin();assert(token);
 assert(tp_story_notice_mark(token,146));
 const auto once=Preferences::store();
 assert(tp_story_notice_mark(token,146)&&Preferences::store()==once);
 assert(tp_f4_store_finish(token,1));
 const auto committed=Preferences::store();
 hero=Pet();hero.begin();
 assert(tp_story_notice_read(146)==1);

 for(int damage=0;damage<5;damage++){
  Preferences::store()=committed;
  if(damage==0)Preferences::store().erase("mltnver");
  if(damage==1)Preferences::store().erase("mltnread");
  if(damage==2)p.putUChar("mltnver",2);
  if(damage==3)p.putBool("mltnread",true);
  if(damage==4)p.putUChar("mltnread",2);
  const auto before=Preferences::store();
  assert(tp_story_notice_read(146)<0&&tp_story_access(146)<0);
  assert(Preferences::store()==before);
  token=tp_f4_store_begin();assert(token);
  assert(!tp_story_notice_mark(token,146)&&!tp_story_advance(token,146,0));
  assert(tp_f4_store_finish(token,0)&&Preferences::store()==before);
 }
 Preferences::store()=original;
 hero=Pet();hero.begin();
 assert(Preferences::store()==original);
 std::cout<<"P06 Lavados story access passed: all 256 Kanto masks, Johto excluded, "
  "existing progress retained, notice commit/rollback/reload/idempotency "
  "and malformed metadata refused.\n";
}

static void p06CheckMoltresIsolation(){
 const auto original=Preferences::store();
 const auto energy=hero.energy;
 Preferences p;
 p.putUChar(TP_KANTO_KEYS.arenaVersion,1);
 p.putUChar(TP_KANTO_KEYS.arenaMask,255);
 const auto before=Preferences::store();

 auto token=tp_f4_store_begin();assert(token);
 // Lavados (146) is supported; 147 is not a story profile.
 for(int dex:{0,147,-1,999}){
  assert(tp_story_step(dex)<0&&tp_story_ticket(dex)<0);
  assert(tp_story_access(dex)<0);
  assert(tp_story_notice_read(dex)<0);
  assert(!tp_story_notice_mark(token,dex));
  assert(!tp_story_advance(token,dex,0));
 }
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==before);

 token=tp_f4_store_begin();assert(token);
 assert(tp_story_notice_mark(token,146));
 assert(tp_story_advance(token,146,0));
 assert(tp_story_step(146)==1&&tp_zpd_step()==0&&tp_story_step(144)==0);
 assert(tp_zpd_notice_read()==0);
 assert(tp_f4_store_finish(token,1));
 const auto arktosStarted=Preferences::store();

 token=tp_f4_store_begin();assert(token);
 assert(tp_zpd_notice_mark(token));
 assert(tp_zpd_advance(token,0));
 assert(tp_story_step(146)==1&&tp_zpd_step()==1);
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==arktosStarted);
 assert(tp_story_step(146)==1&&tp_zpd_step()==0&&tp_story_step(144)==0);

 hero=Pet();hero.begin();
 assert(tp_story_step(146)==1&&tp_zpd_step()==0&&tp_story_step(144)==0);
 assert(tp_story_notice_read(146)==1&&tp_zpd_notice_read()==0&&tp_story_notice_read(144)==0);
 assert(hero.energy==energy);

 Preferences::store()=original;hero=Pet();hero.begin();
 assert(Preferences::store()==original);
 std::cout<<"P06 story isolation passed: independent progress/notices, "
  "unknown profiles refused, shared commit/rollback/reload "
  "and unchanged energy. No Lavados battle/UI claim.\n";
}
