#include <cassert>
#include <cstring>
#include <ctime>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet hero;Pet &tp_battle_pet(){return hero;}
extern "C" int tp_is_egg(){return hero.isEgg();}extern "C" int tp_sleeping(){return hero.sleeping;}extern "C" int tp_species_id(){return hero.speciesId;}extern "C" int tp_level(){return hero.level();}
#include "../browser_ver/core/browser_battle.cpp"
#include "../browser_ver/core/browser_hall.cpp"
#include "../browser_ver/core/browser_league.cpp"
static void load(){if(undo)assert(tp_lg_finish(token,0));tp_lg_abort();Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",150);p.putShort("eggT2",150);p.putUInt("age",5940);for(const char*k:{"gatk","gdef","gspe","tatk","tdef","tspe","full","joy","ene","hyg"})p.putUChar(k,100);p.putUChar("agver",1);p.putUChar("agmask",255);p.putUChar("f4lver",1);p.putUInt("f4life",1);p.putUChar("mgver",3);hero=Pet();hero.begin();hero.setClock(uint32_t(std::time(nullptr)));hero.rename("Sieger & <Eins>");hero.shiny=true;}
static tp_hall_detail::Hall read(){tp_hall_detail::Hall h;assert(tp_hall_detail::load(h));return h;}
static int finalWin(int variant){int t=tp_lg_prepare_start(variant);assert(t>0&&tp_lg_finish(t,1));for(unsigned i=0;i<26;i++){assert(active[3]==i);run.enemyHp=0;resolved=won=true;const int w=tp_lg_prepare_win();assert(w>0);if(i==25)return w;assert(tp_lg_finish(w,1));t=tp_lg_prepare_resume();assert(t>0&&tp_lg_finish(t,1));}assert(false);return 0;}
int main(int argc,char**argv){load();if(argc>1&&std::strcmp(argv[1],"--fixture")==0){assert(tpHallStageWin(hero,100,0,1,2,1700000000));const auto b=std::get<std::vector<uint8_t>>(Preferences::store()["lhdata"]);std::cout<<"{\"version\":1,\"hex\":\"";const char*h="0123456789abcdef";for(auto x:b)std::cout<<h[x>>4]<<h[x&15];std::cout<<"\",\"view\":"<<tp_hall_view()<<"}\n";return 0;}
assert(read().records.empty()&&!read().legacy);auto empty=Preferences::store();assert(!tp_lg_prepare_seen()&&Preferences::store()==empty);
for(int v=0;v<3;v++){const auto before=Preferences::store();int t=finalWin(v);assert(read().wins==unsigned(v+1));assert(!tp_lg_prepare_seen());assert(tp_lg_finish(t,0));assert(read().wins==unsigned(v));t=tp_lg_prepare_win();assert(t>0&&tp_lg_finish(t,1));auto h=read();assert(h.wins==unsigned(v+1)&&h.mask==((1u<<(v+1))-1)&&!h.legacy&&h.records.back().dex==150&&h.records.back().nick=="Sieger & <Eins>"&&h.records.back().shiny&&h.records.back().life==1&&h.records.back().variant==v);auto bytes=Preferences::store();int s=tp_lg_prepare_seen();assert(s>0&&read().seen==h.wins&&!tp_lg_prepare_seen());assert(tp_lg_finish(s,0)&&Preferences::store()==bytes);s=tp_lg_prepare_seen();assert(s>0&&tp_lg_finish(s,1)&&read().seen==h.wins&&!tp_lg_prepare_seen());}
const auto saved=read();hero.newEgg();assert(read().wins==saved.wins&&read().records.front().dex==150);hero=Pet();hero.begin();assert(read().records.front().nick=="Sieger & <Eins>");
load();Preferences p;p.putUChar("lgver",1);p.putBool("lgkdone",true);p.putUInt("lgkdate",1600000000);auto before=Preferences::store();assert(read().legacy&&read().records.empty()&&read().legacyDate==1600000000&&Preferences::store()==before);int t=finalWin(2);assert(tp_lg_finish(t,1));assert(read().legacy&&read().records.front().sequence==1&&read().legacyDate==1600000000&&p.getUInt("lgkdate",0)==1600000000);
for(unsigned i=2;i<=20;i++)assert(tpHallStageWin(hero,100,0,1,uint8_t(i%3),1700000000+i));auto h=read();assert(h.wins==20&&h.records.size()==12&&h.records.front().sequence==1&&h.records[1].sequence==10&&h.records.back().sequence==20&&h.mask==7);
const auto good=Preferences::store();auto b=std::get<std::vector<uint8_t>>(good.at("lhdata"));for(size_t i=0;i<b.size();i++){auto bad=b;bad[i]^=0x40;Preferences::store()["lhdata"]=bad;auto badStore=Preferences::store();assert(!tpHallSupported()&&!tp_lg_prepare_start(0)&&Preferences::store()==badStore);}Preferences::store()=good;p.putUInt("lhver",2);auto future=Preferences::store();assert(!tpHallSupported()&&!tp_lg_prepare_start(0)&&!tp_lg_prepare_seen()&&Preferences::store()==future);hero.factoryReset();assert(!Preferences::store().count("lhver")&&!Preferences::store().count("lhdata"));
load();auto initial=Preferences::store();assert(!tpHallStageWin(hero,0,0,1,0,1700000000)&&Preferences::store()==initial);assert(!tpHallStageWin(hero,100,0,1,3,1700000000)&&Preferences::store()==initial);
std::cout<<"Kanto Hall native passed: 3x26 real league transaction transitions with synthetic victory states; final-win/seen rollback, exact nickname/shiny/life snapshots, variants, retained first + 11 latest, legacy no invented winner, every-byte corruption, future refusal, new egg/reload preservation and reset.\n";
}
