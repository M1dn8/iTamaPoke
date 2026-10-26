#include <cassert>
#include <cstring>
#include <iostream>
#include "pet.h"
#include "league-team-state.h"
#include "league-hall.h"

uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}
static Pet hero;
Pet &tp_battle_pet(){return hero;}
extern "C" int tp_battle_is_open(){return 0;}
extern "C" uint32_t tp_f4_store_begin();
extern "C" int tp_f4_store_finish(uint32_t,int);
extern "C" const char *tp_region_hall_view(int);

namespace L=tp_league_team;
L::State terminal(int region=0){
 L::State s;
 s.region=uint8_t(region);s.phase=L::CHECKPOINT;s.index=26;s.active=1;
 s.care.id=100;s.care.life=7;s.care.age=540;s.care.dex=150;
 s.care.geneAtk=s.care.geneDef=s.care.geneSpe=100;
 for(unsigned i=0;i<2;i++){
  L::Member m;m.id=101+i;m.dex=25;m.stats=wildBattleStats(25,99);
  m.nick=i?"雷 \"Zwei\"":"Erster";m.shiny=i!=0;
  m.maxHp=L::initialMaxHp(m.stats);m.hp=i?m.maxHp:0;
  m.rests=uint8_t(i);m.wins=i?6:20;m.levelGains=1;
  s.members.push_back(m);
 }
 assert(L::validTerminal(s));return s;
}
void setup(){
 Preferences::store().clear();Preferences().putBool("init",true);
 hero=Pet();hero.speciesId=150;hero.shiny=true;
 std::strcpy(hero.nick,"Einzelsieger");
}
void fixture(){
 setup();
 assert(tpHallStageWinFor(0,hero,80,0,1,0,1700000000));
 assert(tpHallStageTeamWinFor(0,terminal(),1700000001));
 assert(tpHallStageTeamWinFor(1,terminal(1),1700000002));
 const char *hex="0123456789abcdef";
 std::cout<<"{\"kanto\":"<<tp_region_hall_view(0)
  <<",\"johto\":"<<tp_region_hall_view(1);
 for(const auto pair:{
  std::pair<const char*,const char*>{"kantoHex","lhdata"},
  {"johtoHex","jlhdata"}
 }){
  std::cout<<",\""<<pair.first<<"\":\"";
  for(auto b:std::get<std::vector<uint8_t>>(
   Preferences::store().at(pair.second)))
   std::cout<<hex[b>>4]<<hex[b&15];
  std::cout<<"\"";
 }
 std::cout<<"}\n";
}
int main(int argc,char**){
 if(argc>1){fixture();return 0;}
 setup();
 const auto s=terminal();
 std::vector<uint8_t> bytes,unchanged={9,8,7};
 assert(!L::valid(s)&&!L::encode(s,unchanged));
 assert((unchanged==std::vector<uint8_t>{9,8,7}));
 assert(L::encodeTerminal(s,bytes));
 L::State decoded;
 assert(L::decodeTerminal(bytes,0,decoded));
 assert(!L::decode(bytes,0,decoded));
 assert(!L::decodeTerminal(bytes,1,decoded));
 auto invalid=s;invalid.members[0].wins--;
 auto before=Preferences::store();
 assert(!tpHallStageTeamWinFor(0,invalid,1700000000));
 assert(Preferences::store()==before);
 assert(!tpHallStageTeamWinFor(1,s,1700000000));
 assert(Preferences::store()==before);

 // Hall writes participate in the actual whole-Pet/store transaction.
 auto token=tp_f4_store_begin();assert(token);
 assert(tpHallStageTeamWinFor(0,s,1700000000));
 assert(Preferences().getUChar("lhver",0)==2);
 assert(tp_f4_store_finish(token,0)&&Preferences::store()==before);
 token=tp_f4_store_begin();assert(token);
 assert(tpHallStageTeamWinFor(0,s,1700000000));
 assert(tp_f4_store_finish(token,1));
 const std::string firstView=tp_region_hall_view(0);
 assert(firstView.find("\"winnerId\":102")!=std::string::npos);
 assert(firstView.find("\"id\":100")!=std::string::npos);
 assert(firstView.find("\"index\":26")!=std::string::npos);
 assert(firstView.find("\"dex\":25")!=std::string::npos);
 assert(!Preferences::store().count("lgkdone"));

 setup();
 assert(tpHallStageWinFor(0,hero,80,0,1,0,1700000000));
 const auto old=std::get<std::vector<uint8_t>>(
  Preferences::store().at("lhdata"));
 assert(old[3]==1&&Preferences().getUChar("lhver",0)==1);
 assert(tpHallStageTeamWinFor(0,s,1700000001));
 assert(Preferences().getUChar("lhver",0)==2);
 const std::string mixed=tp_region_hall_view(0);
 assert(mixed.find("Einzelsieger")!=std::string::npos);
 assert(mixed.find("\"sequence\":2")!=std::string::npos);
 // Subsequent ordinary titles remain ordinary entries within V2.
 assert(tpHallStageWinFor(0,hero,81,0,1,1,1700000002));
 assert(tpHallSupportedFor(0));
 const auto good=Preferences::store();
 const auto blob=std::get<std::vector<uint8_t>>(good.at("lhdata"));
 for(size_t i=0;i<blob.size();i++){
  auto bad=blob;bad[i]^=64;Preferences::store()["lhdata"]=bad;
  const auto badStore=Preferences::store();
  assert(!tpHallSupportedFor(0));
  assert(!tpHallStageTeamWinFor(0,s,1700000010));
  assert(Preferences::store()==badStore);
 }
 Preferences::store()=good;
 Preferences().putUChar("lhver",3);
 before=Preferences::store();
 assert(!tpHallStageTeamWinFor(0,s,1700000010));
 assert(Preferences::store()==before);
 Preferences::store()=good;
 Preferences::store()["jlhdata"]=blob;
 Preferences().putUChar("jlhver",2);
 assert(!tpHallSupportedFor(1)&&tpHallSupportedFor(0));
 Preferences::store()=good;

 token=tp_f4_store_begin();assert(token);
 assert(tpHallStageSeenFor(0));
 assert(tp_f4_store_finish(token,0)&&Preferences::store()==good);
 token=tp_f4_store_begin();assert(token);
 assert(tpHallStageSeenFor(0)&&tp_f4_store_finish(token,1));
 assert(!tpHallStageSeenFor(0));

 setup();
 for(unsigned i=0;i<20;i++)
  assert(tpHallStageTeamWinFor(0,s,1700000000+i));
 const std::string retained=tp_region_hall_view(0);
 assert(retained.find("\"sequence\":1,")!=std::string::npos);
 assert(retained.find("\"sequence\":9,")==std::string::npos);
 assert(retained.find("\"sequence\":10,")!=std::string::npos);
 assert(retained.find("\"sequence\":20,")!=std::string::npos);
 assert(tpHallSupportedFor(0));

 std::cout<<"P05c team Hall passed: terminal-only team payload, ordered "
  "individual IDs/duplicate species, separate off-party care binding, "
  "frozen stats and final-winner identity, V1 preservation until team "
  "write, mixed V2 history, first+11 retention, actual whole-store "
  "rollback/retry/seen, corruption/future/cross-region refusal. No live "
  "league final-win or browser ceremony integration claimed.\n";
}
