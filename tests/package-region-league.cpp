#include <cassert>
#include <ctime>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet hero;Pet &tp_battle_pet(){return hero;}
extern "C" int tp_is_egg(){return hero.isEgg();}extern "C" int tp_sleeping(){return hero.sleeping;}extern "C" int tp_species_id(){return hero.speciesId;}extern "C" int tp_level(){return hero.level();}
#include "../browser_ver/core/browser_battle.cpp"
#include "../browser_ver/core/browser_league.cpp"

#include "../browser_ver/core/browser_battle_energy.cpp"
extern "C" const char *tp_hall_view();extern "C" const char *tp_region_hall_view(int);
static void energy(int value){hero.energy=uint8_t(value);Preferences().putUChar("ene",uint8_t(value));}
static void setup(){
 assert(!undo);tp_region_lg_abort(0);tp_region_lg_abort(1);tp_battle_close();gWildPromptActive=false;Preferences::store().clear();Preferences p;
 p.putBool("init",true);p.putShort("dexn",376);p.putShort("eggT2",376);p.putUInt("age",5940);
 for(const char*k:{"gatk","gdef","gspe","tatk","tdef","tspe","full","joy","ene","hyg","bond"})p.putUChar(k,100);
 p.putUChar("agver",1);p.putUChar("agmask",255);p.putUChar("jagver",1);p.putUChar("jagmask",255);p.putUChar("f4lver",1);p.putUInt("f4life",1);p.putUChar("mgver",3);p.putBool("shy",true);
 hero=Pet();hero.begin();hero.setClock(uint32_t(std::time(nullptr)));hero.rename("Kanto-Sieger");energy(100);
}
static std::map<std::string,Preferences::Value> slice(const TPRegionProgressKeys&k){
 std::map<std::string,Preferences::Value> out;const char*names[]={k.arenaVersion,k.arenaMask,k.leagueVersion,k.leagueRun,k.leagueDone,k.leagueDate,k.hallVersion,k.hallData,k.rewardVersion,k.rewardState,k.rewardDex,k.rewardArmed,k.rewardBorn};
 const auto&s=Preferences::store();for(const auto *n:names){auto it=s.find(n);if(it!=s.end())out.insert(*it);}for(int i=0;i<8;i++){auto it=s.find(std::string(k.arenaDatePrefix)+std::to_string(i));if(it!=s.end())out.insert(*it);}return out;
}
static void syntheticWin(int region){assert(live&&activeRegion==region);run.enemyHp=0;resolved=won=true;}
static void finishRun(int region,int variant=0){
 int t=tp_region_lg_prepare_start(region,variant);assert(t&&tp_region_lg_finish(region,t,1));
 for(unsigned i=0;i<26;i++){assert(activeRegion==region&&active[3]==i);syntheticWin(region);t=tp_region_lg_prepare_win(region);assert(t&&tp_region_lg_finish(region,t,1));if(i<25){t=tp_region_lg_prepare_resume(region);assert(t&&tp_region_lg_finish(region,t,1));}}
}
int main(int argc,char**){
 setup();finishRun(0);const auto initialKanto=slice(TP_KANTO_KEYS);energy(100);hero.rename("Johto & <eins>");
 Preferences p;p.putUChar("jagmask",127);auto before=Preferences::store();assert(!tp_region_lg_prepare_start(1,0)&&Preferences::store()==before);p.putUChar("jagmask",255);
 for(int r:{-1,2,256}){before=Preferences::store();assert(!tp_region_lg_prepare_start(r,0)&&Preferences::store()==before);}assert(!tp_region_lg_prepare_start(1,1));
 before=Preferences::store();int t=tp_region_lg_prepare_start(1,0);assert(t&&hero.energy==50&&tp_region_lg_session_region()==1);assert(!tp_lg_finish(t,1)&&!tp_region_lg_finish(0,t,1));assert(tp_region_lg_finish(1,t,0)&&Preferences::store()==before&&hero.energy==100);
 t=tp_region_lg_prepare_start(1,0);assert(t&&tp_region_lg_finish(1,t,1));assert(live&&activeRegion==1&&active[0]==2&&hero.energy==50);assert(!tp_lg_prepare_start(0)&&!tp_f2_can());
 const auto activeBefore=active;const auto hpBefore=run.playerHp;assert(!tp_lg_turn(BATTLE_ATTACK_QUICK));tp_lg_abort();assert(live&&active==activeBefore&&run.playerHp==hpBefore);
 for(unsigned i=0;i<26;i++){
  const auto *m=tpJohtoLeagueMonAt(i);assert(m&&active[3]==i&&activeRegion==1);const auto expected=wildBattleStats(m->dex,m->level);assert(run.enemyMaxHp==beginBattleRuntime(stats(active),expected).enemyMaxHp);
  if(i==5)energy(0);run.playerHp=run.playerMaxHp-10;run.restUsesLeft=3;syntheticWin(1);before=Preferences::store();
  assert(!tp_lg_prepare_win()&&!tp_region_lg_prepare_win(0));t=tp_region_lg_prepare_win(1);assert(t&&!tp_region_lg_prepare_win(1));assert(!tp_lg_finish(t,1));assert(tp_region_lg_finish(1,t,0)&&Preferences::store()==before&&live);
  t=tp_region_lg_prepare_win(1);assert(t&&tp_region_lg_finish(1,t,1));assert(!live&&slice(TP_KANTO_KEYS)==initialKanto);
  if(i<25){
   A a{};assert(read(a,TP_JOHTO_KEYS,2)&&a[3]==i+1&&a[4]==run.playerHp&&a[6]==3);
   if(i==19){energy(49);before=Preferences::store();assert(!tp_region_lg_prepare_resume(1)&&Preferences::store()==before);energy(50);before=Preferences::store();t=tp_region_lg_prepare_resume(1);assert(t&&hero.energy==20);assert(tp_region_lg_finish(1,t,0)&&Preferences::store()==before&&hero.energy==50);}
   const auto paidBefore=hero.energy;t=tp_region_lg_prepare_resume(1);assert(t&&tp_region_lg_finish(1,t,1));assert(hero.energy==(i==19?paidBefore-30:paidBefore));assert(run.restUsesLeft==3);
  }
 }
 assert(done(TP_JOHTO_KEYS)&&done(TP_KANTO_KEYS)&&!Preferences::store().count("jlgrun"));const auto firstDate=Preferences().getUInt("jlgdate",0);assert(firstDate>0);
 const auto kHall=std::get<std::vector<uint8_t>>(Preferences::store().at("lhdata")),jHall=std::get<std::vector<uint8_t>>(Preferences::store().at("jlhdata"));assert(kHall[2]=='K'&&jHall[2]=='J');
 const std::string kView=tp_hall_view(),jView=tp_region_hall_view(1);assert(jView.find("Johto & <eins>")!=std::string::npos&&jView.find("\"wins\":1")!=std::string::npos);assert(kView.find("Kanto-Sieger")!=std::string::npos&&kView.find("Johto & <eins>")==std::string::npos);
 auto saved=Preferences::store();const Pet savedPet=hero;Preferences::store()["jlhdata"]=kHall;assert(!tpHallSupportedFor(1));before=Preferences::store();energy(100);const auto failStore=Preferences::store();assert(!tp_region_lg_prepare_start(1,0)&&Preferences::store()==failStore);Preferences::store()=saved;hero=savedPet;
 auto damaged=jHall;damaged[10]^=1;Preferences::store()["jlhdata"]=damaged;before=Preferences::store();assert(!tpHallSupportedFor(1)&&Preferences::store()==before);Preferences::store()=saved;
 t=tp_region_lg_prepare_seen(1);assert(t&&!tp_lg_finish(t,1)&&tp_region_lg_finish(1,t,0));assert(std::get<std::vector<uint8_t>>(Preferences::store().at("jlhdata"))==jHall);
 t=tp_region_lg_prepare_seen(1);assert(t&&tp_region_lg_finish(1,t,1)&&!tp_region_lg_prepare_seen(1));assert(slice(TP_KANTO_KEYS)==initialKanto);
 energy(100);hero.rename("Zweiter Johto");finishRun(1);assert(Preferences().getUInt("jlgdate",0)==firstDate&&slice(TP_KANTO_KEYS)==initialKanto);assert(std::string(tp_region_hall_view(1)).find("\"wins\":2")!=std::string::npos);assert(!Preferences::store().count("jrkver"));
 // Keep a Kanto checkpoint while another region runs; the old API cannot steer it.
 energy(100);t=tp_lg_prepare_start(1);assert(t&&tp_lg_finish(t,1));syntheticWin(0);t=tp_lg_prepare_win();assert(t&&tp_lg_finish(t,1));const auto checkpoint=std::get<std::vector<uint8_t>>(Preferences::store().at("lgkrun"));
 energy(100);t=tp_region_lg_prepare_start(1,0);assert(t&&tp_region_lg_finish(1,t,1));assert(!tp_lg_prepare_resume());tp_lg_abort();assert(live&&activeRegion==1);tp_region_lg_abort(1);assert(!live&&std::get<std::vector<uint8_t>>(Preferences::store().at("lgkrun"))==checkpoint);t=tp_lg_prepare_resume();assert(t&&tp_lg_finish(t,1)&&activeRegion==0);tp_lg_abort();
 // Committed progress reloads; interrupted fights do not become resume checkpoints.
 hero=Pet();hero.begin();assert(read(active,TP_KANTO_KEYS,1)&&active[1]==2);assert(!tp_lg_prepare_resume());assert(done(TP_JOHTO_KEYS));
 setup();p.putUChar("jlgver",2);before=Preferences::store();assert(!tp_region_lg_prepare_start(1,0)&&Preferences::store()==before);
 setup();t=tp_region_lg_prepare_start(1,0);assert(t&&tp_region_lg_finish(1,t,1));resolved=true;won=false;assert(!tp_region_lg_prepare_win(1));tp_region_lg_abort(1);assert(!done(TP_JOHTO_KEYS)&&!Preferences::store().count("jlhdata"));
 setup();t=tp_region_lg_prepare_start(1,0);assert(t&&tp_region_lg_finish(1,t,1));p.putUInt("f4life",2);before=Preferences::store();assert(!tp_region_lg_turn(1,BATTLE_ATTACK_QUICK)&&!live&&!done(TP_JOHTO_KEYS)&&Preferences::store()==before);
 unsigned completed=0,losses=0,turns=0;
 for(unsigned seed=0;seed<3;seed++){
  setup();std::srand(seed);const auto keep=slice(TP_KANTO_KEYS);t=tp_region_lg_prepare_start(1,0);assert(t&&tp_region_lg_finish(1,t,1));bool lost=false;
  for(unsigned i=0;i<26;i++){
   for(unsigned n=0;n<100&&!resolved;n++){const int action=run.restUsesLeft&&run.playerHp*100u<run.playerMaxHp*40u?BATTLE_REST:BATTLE_ATTACK_QUICK;assert(tp_region_lg_turn(1,action));turns++;}
   assert(resolved);if(!won){lost=true;losses++;tp_region_lg_abort(1);break;}
   t=tp_region_lg_prepare_win(1);assert(t&&tp_region_lg_finish(1,t,1));if(i<25){t=tp_region_lg_prepare_resume(1);assert(t&&tp_region_lg_finish(1,t,1));}
  }
  if(!lost){completed++;assert(done(TP_JOHTO_KEYS)&&tpHallSupportedFor(1));}assert(slice(TP_KANTO_KEYS)==keep);
 }
 assert(completed+losses==3&&turns>0);
 if(argc>1){const char *hex="0123456789abcdef";std::cout<<"{\"kanto\":"<<kView<<",\"johto\":"<<jView<<",\"kantoHex\":\"";for(auto b:kHall)std::cout<<hex[b>>4]<<hex[b&15];std::cout<<"\",\"johtoHex\":\"";for(auto b:jHall)std::cout<<hex[b>>4]<<hex[b&15];std::cout<<"\"}\n";return 0;}
 std::cout<<"Regional league/Hall passed: captured region/tokens, 26 Johto opponents, 50/30 energy and five-rest carry, zero-energy Elite resumes, every-win rollback, final-win Hall rollback/ack/repeat/reload, actual winner identity, separate Kanto checkpoint/Hall, cross-Hall/future rejection, no egg grant. Real runs: "<<completed<<" completed, "<<losses<<" losses, "<<turns<<" turns (not a balancing proof).\n";
}
