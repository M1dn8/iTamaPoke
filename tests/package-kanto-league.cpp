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
void victory(){assert(live);run.enemyHp=0;resolved=won=true;}
int main(){load();assert(!tp_lg_owned());Preferences p;p.putUChar("agmask",127);assert(!tp_lg_prepare_start(0));p.putUChar("agmask",255);assert(!tp_lg_prepare_start(3));auto old=Preferences::store();int t=tp_lg_prepare_start(0);assert(t>0&&tp_lg_owned()&&!tp_f2_can());assert(!tp_lg_prepare_start(1));assert(tp_lg_finish(t,0));assert(Preferences::store()==old&&!tp_lg_owned());
for(int v=0;v<3;v++){load();int token=tp_lg_prepare_start(v);assert(token>0);assert(tp_lg_finish(token,1)&&live&&run.restUsesLeft==5);for(int i=0;i<26;i++){assert(active[3]==unsigned(i)&&active[2]==unsigned(v));assert(!tp_f2_can()&&tp_battle_is_open());if(i==0){run.playerHp=run.playerMaxHp/2;run.restUsesLeft=3;}auto hp=run.playerHp;auto rests=run.restUsesLeft;victory();auto before=Preferences::store();int win=tp_lg_prepare_win();assert(win>0&&!tp_lg_prepare_win());assert(tp_lg_finish(win,0)&&live);assert(Preferences::store()==before);win=tp_lg_prepare_win();assert(tp_lg_finish(win,1)&&!live);assert(!tp_lg_prepare_win());if(i<25){A saved{};assert(read(saved)&&saved[1]==1&&saved[3]==unsigned(i+1)&&saved[4]==hp&&saved[6]==rests);token=tp_lg_prepare_resume();assert(token>0&&tp_lg_finish(token,1));assert(run.playerHp==hp&&run.restUsesLeft==rests);}else{assert(done());assert(!Preferences::store().count("lgkrun"));}}}
load();t=tp_lg_prepare_start(0);assert(tp_lg_finish(t,1));tp_lg_abort();assert(!tp_lg_prepare_resume());load();t=tp_lg_prepare_start(0);assert(tp_lg_finish(t,1));victory();t=tp_lg_prepare_win();assert(tp_lg_finish(t,1));p.putUInt("f4life",2);assert(!tp_lg_prepare_resume());p.putUInt("f4life",1);p.putUChar("lgver",2);auto future=Preferences::store();assert(!tp_lg_prepare_start(0)&&Preferences::store()==future);
// Ordinary battle math still starts with two rests.
assert(beginBattleRuntime(wildBattleStats(150,100),wildBattleStats(19,2)).restUsesLeft==2);
std::cout<<"Kanto league native: 3 complete variants, 78 durable checkpoint/rollback transitions, HP/rest carry, locks, identity, future fields and unchanged normal rest budget passed.\n";
}