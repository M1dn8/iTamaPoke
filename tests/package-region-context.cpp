#include <cassert>
#include <ctime>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet hero;Pet &tp_battle_pet(){return hero;}
extern "C" int tp_is_egg(){return hero.isEgg();}extern "C" int tp_sleeping(){return hero.sleeping;}extern "C" int tp_species_id(){return hero.speciesId;}extern "C" int tp_level(){return hero.level();}
#include "../browser_ver/core/browser_battle.cpp"
#include "../browser_ver/core/browser_league.cpp"
void load(){tp_lg_abort();Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",150);p.putShort("eggT2",1);p.putUInt("age",99*60);for(const char*k:{"gatk","gdef","gspe","tatk","tdef","tspe","full","joy","ene","hyg"})p.putUChar(k,100);p.putUChar("agver",1);p.putUChar("agmask",255);p.putUChar("f4lver",1);p.putUInt("f4life",1);p.putUChar("mgver",3);hero=Pet();hero.begin();hero.setClock(uint32_t(std::time(nullptr)));}
static std::string view(int region){return tp_region_league_view(region);}
static void noWriteRead(){const auto before=Preferences::store();for(int i:{-1,0,1,2,255,256}){(void)tp_region_arena_mask(i);(void)tp_region_arena_date(i,0);(void)view(i);}assert(Preferences::store()==before);}
int main(int argc,char**){
 load();std::vector<std::string> samples;
 Preferences::store().clear();noWriteRead();assert(tp_region_arena_mask(0)==0&&tp_region_arena_mask(1)==0);assert(view(1).find("\"supported\":1")!=std::string::npos);assert(Preferences::store().empty());
 load();Preferences p;p.putUInt("agt0",1700000000);p.putUChar("jagver",1);p.putUChar("jagmask",2);p.putUInt("jagt1",1700000100);
 assert(tp_region_arena_mask(0)==255&&tp_region_arena_mask(1)==2);assert(tp_region_arena_date(0,0)==1700000000&&tp_region_arena_date(1,1)==1700000100);assert(tp_region_arena_date(1,0)==0&&tp_region_arena_date(0,8)==0);
 int t=tp_lg_prepare_start(0);assert(t>0&&tp_lg_finish(t,1));run.enemyHp=0;resolved=won=true;t=tp_lg_prepare_win();assert(t>0&&tp_lg_finish(t,1));
 A k{};assert(read(k)&&k[0]==1&&k[1]==1&&k[3]==1);A j=k;j[0]=2;j[3]=7;
 p.putUChar("jlgver",1);p.putBool("jlgdone",false);p.putUInt("jlgdate",0);Preferences::store()["jlgrun"]=encode(j);
 Preferences::store()["jlhdata"]=std::vector<uint8_t>{1,2,3};p.putUChar("jrkstate",3);
 assert(supported(TP_JOHTO_KEYS,2));A got{};assert(read(got,TP_JOHTO_KEYS,2)&&got==j);assert(read(got)&&got==k);
 const auto kantobytes=std::get<std::vector<uint8_t>>(Preferences::store().at("lgkrun"));
 samples.push_back(view(0));samples.push_back(view(1));noWriteRead();assert(std::get<std::vector<uint8_t>>(Preferences::store().at("lgkrun"))==kantobytes);
 // Copying a Kanto checkpoint into Johto must fail, rather than silently cross-load.
 Preferences::store()["jlgrun"]=kantobytes;assert(!supported(TP_JOHTO_KEYS,2));noWriteRead();assert(read(got)&&got==k);
 Preferences::store()["jlgrun"]=encode(j);auto damaged=encode(j);damaged[10]^=1;Preferences::store()["jlgrun"]=damaged;assert(!supported(TP_JOHTO_KEYS,2));noWriteRead();
 Preferences::store()["jlgrun"]=encode(j);p.putUChar("jlgver",2);assert(!supported(TP_JOHTO_KEYS,2));noWriteRead();p.putUChar("jlgver",1);
 p.putUChar("jagver",2);assert(tp_region_arena_mask(1)==-1&&tp_region_arena_mask(0)==255);noWriteRead();p.putUChar("jagver",1);
 for(int region:{-1,2,255,256,512}){assert(tp_region_arena_mask(region)==-1);assert(view(region).find("\"supported\":0")!=std::string::npos);}
 // Reading another region must not change the active real Kanto session or its save.
 t=tp_lg_prepare_resume();assert(t>0&&tp_lg_finish(t,1));const auto session=active;const auto store=Preferences::store();const auto hp=run.playerHp;const auto id=viewId;
 (void)view(1);(void)tp_region_arena_mask(1);assert(live&&active==session&&run.playerHp==hp&&viewId==id&&Preferences::store()==store);tp_lg_abort();
 if(argc>1){for(const auto &s:samples)std::cout<<s<<"\n";return 0;}
 std::cout<<"Regional context passed: separate arena masks/dates and saved league progress, exact Kanto checkpoint preservation, cross-region checkpoint rejection, CRC/future guards, unknown IDs, zero read-time writes and unchanged active Kanto session. Johto UI availability enabled.\n";
}
