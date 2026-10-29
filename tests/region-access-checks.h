#pragma once
static void checkJohtoGate(){
 Preferences p;
 for(int mask=0;mask<256;mask++){
  setup();
  p.putUChar("agmask",uint8_t(mask));
  p.putBool("lgkdone",false);p.putUInt("lgkdate",0);
  p.putUChar("jagver",1);p.putUChar("jagmask",255);
  p.putUChar("jlgver",1);p.putBool("jlgdone",true);
  p.putUInt("jlgdate",1700000000);
  const auto before=Preferences::store();
  assert(tp_region_access(0)==1&&tp_region_access(1)==0);
  assert(!tp_region_arena_start(1,0));
  assert(!tp_region_energy_arena_begin(1,0));
  assert(Preferences::store()==before&&hero.energy==100);
  assert(!gOpen&&!tp_f4_store_pending());
 }
 for(int damage=0;damage<11;damage++){
  setup();
  auto &s=Preferences::store();
  if(damage==0)s.erase("lgver");
  if(damage==1)s.erase("lgkdone");
  if(damage==2)s.erase("lgkdate");
  if(damage==3)s["lgver"]=int64_t(2);
  if(damage==4)s["lgver"]=true;
  if(damage==5)s["lgkdone"]=int64_t(1);
  if(damage==6)s["lgkdate"]=true;
  if(damage==7)s["lgkdate"]=int64_t(-1);
  if(damage==8)s["lgkdate"]=int64_t(0x100000000ULL);
  if(damage==9)s["lgkdone"]=false;
  if(damage==10){
   s.erase("lgver");s.erase("lgkdone");s.erase("lgkdate");
   s["lgkrun"]=std::vector<uint8_t>{1};
  }
  const auto before=s;
  assert(tp_region_access(1)<0);
  assert(!tp_region_arena_start(1,0));
  assert(!tp_region_energy_arena_begin(1,0));
  assert(Preferences::store()==before&&hero.energy==100);
  assert(!gOpen&&!tp_f4_store_pending());
 }
 setup();
 for(const char *key:{"lgver","lgkdone","lgkdate"})
  Preferences::store().erase(key);
 assert(tp_region_access(1)==0);
 assert(tp_region_access(-1)<0&&tp_region_access(2)<0);
 assert(tp_region_arena_start(0,0)>0);
 assert(hero.energy==75);
 tp_battle_close();
 setup();
 const auto before=Preferences::store();
 assert(tp_region_access(1)==1&&Preferences::store()==before);
 p.putUInt("lgkdate",0);
 assert(tp_region_access(1)==1);
 setup();
 std::cout<<"Johto gate passed: all 256 Kanto badge masks insufficient "
  "without Kanto League completion; Johto history cannot substitute; "
  "direct/paid starts refused before energy or store changes; malformed "
  "proof refused; existing progress retained; Kanto start unchanged.\n";
}
