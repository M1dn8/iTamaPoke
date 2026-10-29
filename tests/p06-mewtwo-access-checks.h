#pragma once
#include "../browser_ver/core/region-progress-keys.h"

static void p06CheckMewtuAccess(){
 const auto original=Preferences::store();
 const auto energy=hero.energy;
 Preferences p;
 const auto &k=TP_KANTO_KEYS;
 const auto &j=TP_JOHTO_KEYS;

 auto fresh=[&](){
  Preferences::store()=original;
  for(const char *key:{
   "mtwver","mtwstep","mtwtick","mtwnver","mtwnread",
   k.leagueVersion,k.leagueDone,k.leagueDate,k.leagueRun
  })Preferences::store().erase(key);
 };
 auto completion=[&](bool done){
  p.putUChar(k.leagueVersion,1);
  p.putBool(k.leagueDone,done);
  p.putUInt(k.leagueDate,done?1700000000u:0u);
 };

 // Every badge mask remains insufficient without Kanto completion.
 for(int mask=0;mask<256;mask++){
  fresh();
  p.putUChar(k.arenaVersion,1);p.putUChar(k.arenaMask,mask);
  p.putUChar(j.leagueVersion,1);
  p.putBool(j.leagueDone,true);p.putUInt(j.leagueDate,1700000000u);
  const auto before=Preferences::store();
  assert(tp_story_access(150)==0);
  assert(tp_story_step(150)==0&&tp_story_ticket(150)==0);
  assert(Preferences::store()==before);
  auto token=tp_f4_store_begin();assert(token);
  assert(!tp_story_notice_mark(token,150));
  assert(!tp_story_advance(token,150,0));
  assert(tp_f4_store_finish(token,0));
  assert(Preferences::store()==before);
 }

 // Historical Kanto completion, not the present badge mask, unlocks it.
 for(int mask=0;mask<256;mask++){
  fresh();
  p.putUChar(k.arenaVersion,1);p.putUChar(k.arenaMask,mask);
  completion(true);
  const auto before=Preferences::store();
  assert(tp_story_access(150)==1);
  auto token=tp_f4_store_begin();assert(token);
  assert(!tp_story_notice_mark(token+1,150));
  assert(tp_story_notice_mark(token,150));
  assert(tp_story_advance(token,150,0));
  assert(tp_f4_store_finish(token,0));
  assert(Preferences::store()==before);
 }

 fresh();completion(false);
 assert(tp_story_access(150)==0);

 // Match existing league metadata semantics for historical saves.
 fresh();completion(true);p.putUInt(k.leagueDate,0);
 assert(tp_story_access(150)==1);

 for(int damage=0;damage<11;damage++){
  fresh();completion(true);
  auto &s=Preferences::store();
  if(damage==0)s.erase(k.leagueVersion);
  if(damage==1)s.erase(k.leagueDone);
  if(damage==2)s.erase(k.leagueDate);
  if(damage==3)s[k.leagueVersion]=int64_t(2);
  if(damage==4)s[k.leagueVersion]=true;
  if(damage==5)s[k.leagueDone]=int64_t(1);
  if(damage==6)s[k.leagueDate]=true;
  if(damage==7)s[k.leagueDate]=int64_t(-1);
  if(damage==8)s[k.leagueDate]=int64_t(0x100000000ULL);
  if(damage==9)s[k.leagueDone]=false;
  if(damage==10){
   s.erase(k.leagueVersion);s.erase(k.leagueDone);s.erase(k.leagueDate);
   s[k.leagueRun]=std::vector<uint8_t>{1};
  }
  const auto before=s;
  assert(tp_story_access(150)<0);
  assert(Preferences::store()==before);
  auto token=tp_f4_store_begin();assert(token);
  assert(!tp_story_notice_mark(token,150));
  assert(!tp_story_advance(token,150,0));
  assert(tp_f4_store_finish(token,0));
  assert(Preferences::store()==before);
 }

 fresh();completion(true);
 const int zapdos=tp_zpd_step();
 const int articuno=tp_story_step(144);
 const int moltres=tp_story_step(146);
 const auto before=Preferences::store();
 auto token=tp_f4_store_begin();assert(token);
 battleOpen=true;
 assert(!tp_story_notice_mark(token,150));
 assert(!tp_story_advance(token,150,0));
 battleOpen=false;
 assert(tp_story_notice_mark(token,150));
 assert(tp_story_advance(token,150,0));
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==before);

 token=tp_f4_store_begin();assert(token);
 assert(tp_story_notice_mark(token,150));
 assert(tp_story_advance(token,150,0));
 assert(tp_f4_store_finish(token,1));
 assert(tp_story_step(150)==1&&tp_story_notice_read(150)==1);
 const auto committed=Preferences::store();
 hero=Pet();hero.begin();
 assert(tp_story_step(150)==1&&tp_story_access(150)==1);
 assert(Preferences::store()==committed);
 assert(tp_zpd_step()==zapdos);
 assert(tp_story_step(144)==articuno&&tp_story_step(146)==moltres);

 // Preserve already established story progress like the other profiles.
 Preferences::store().erase(k.leagueVersion);
 Preferences::store().erase(k.leagueDone);
 Preferences::store().erase(k.leagueDate);
 assert(tp_story_access(150)==1);
 token=tp_f4_store_begin();assert(token);
 assert(tp_story_advance(token,150,1));
 assert(tp_f4_store_finish(token,1));
 assert(tp_story_step(150)==2&&hero.energy==energy);

 Preferences::store()=original;hero=Pet();hero.begin();
 assert(Preferences::store()==original);
 std::cout<<"P06 Mewtu access passed: all 256 badge masks refused without "
  "Kanto completion; Johto excluded; all masks accepted with historical "
  "completion; incomplete/future/type/range metadata refused; notice/"
  "progress rollback, commit, reload, isolation and unchanged energy.\n";
}
