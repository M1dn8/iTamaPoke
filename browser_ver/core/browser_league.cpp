// F5 Kanto league. Original state machine; existing battle math unchanged.
#include <array>
#include <ctime>
#include <memory>
#include <string>
#include <vector>
#include <cstdlib>
#include <emscripten.h>
#include "pet.h"
#include "dex.h"
#include "battle.h"
#include "league-kanto.h"
#include "league-hall.h"
extern "C" int tp_lg_finish(int,int);
extern Pet &tp_battle_pet();
extern "C" int tp_battle_is_open();
extern "C" int tp_wild_prompt_active();
namespace {
using A=std::array<uint32_t,21>;
bool live=false,resolved=false,won=false;BattleRuntime run{};BattleTurnResult turn{};A active{};
uint32_t serial=0,token=0;int operation=0;A candidate{};
std::unique_ptr<Pet> undo;std::map<std::string,Preferences::Value> oldStore;
bool integer(const char *key,int64_t &out){const auto&i=Preferences::store().find(key);if(i==Preferences::store().end()||!std::holds_alternative<int64_t>(i->second))return false;out=std::get<int64_t>(i->second);return true;}
uint32_t nonce(){int64_t ver=0,n=0;return integer("f4lver",ver)&&ver==1&&integer("f4life",n)&&n>0&&n<=0x7fffffff?uint32_t(n):0;}
int mask(){int64_t v=0,m=0;return integer("agver",v)&&v==1&&integer("agmask",m)&&m>=0&&m<=255?int(m):0;}
BattleStats stats(const A&a){BattleStats s{};s.atk=a[14];s.def=a[15];s.spe=a[16];s.level=a[17];s.type1=a[18];s.type2=a[19];s.mega=a[20]>0;return s;}
uint32_t sum(const std::vector<uint8_t>&b,size_t n){uint32_t x=2166136261u;for(size_t i=0;i<n;i++){x^=b[i];x*=16777619u;}return x;}
std::vector<uint8_t> encode(const A&a){std::vector<uint8_t>b;for(auto x:a)for(int i=0;i<4;i++)b.push_back(uint8_t(x>>(i*8)));auto c=sum(b,b.size());for(int i=0;i<4;i++)b.push_back(uint8_t(c>>(i*8)));return b;}
bool decode(const std::vector<uint8_t>&b,A&a){if(b.size()!=88)return false;auto u=[&](size_t p){return uint32_t(b[p])|(uint32_t(b[p+1])<<8)|(uint32_t(b[p+2])<<16)|(uint32_t(b[p+3])<<24);};if(u(84)!=sum(b,84))return false;for(int i=0;i<21;i++)a[i]=u(i*4);
 if(a[0]!=1||(a[1]!=1&&a[1]!=2)||a[2]>2||a[3]>25||!a[4]||a[4]>a[5]||a[5]>65535||a[6]>5||a[7]<1||a[7]>DEX_COUNT||a[8]>1||a[9]>255||a[10]>255||a[11]>255||!a[13]||a[13]>0x7fffffff||!a[14]||a[14]>65535||!a[15]||a[15]>65535||!a[16]||a[16]>65535||!a[17]||a[17]>100||!a[18]||a[18]>18||a[19]>18||a[20]>3)return false;
 return beginBattleRuntime(stats(a),wildBattleStats(19,1)).playerMaxHp==a[5];}
bool done(){const auto&i=Preferences::store().find("lgkdone");return i!=Preferences::store().end()&&std::holds_alternative<bool>(i->second)&&std::get<bool>(i->second);}
bool supported(){auto&s=Preferences::store();if(!s.count("lgver"))return !s.count("lgkrun")&&!s.count("lgkdone")&&!s.count("lgkdate");int64_t v=0,d=0;if(!integer("lgver",v)||v!=1||!integer("lgkdate",d)||d<0||d>0xffffffffLL)return false;const auto&b=s.find("lgkdone");if(b==s.end()||!std::holds_alternative<bool>(b->second)||(!done()&&d!=0))return false;const auto&r=s.find("lgkrun");if(r!=s.end()){A a{};if(!std::holds_alternative<std::vector<uint8_t>>(r->second)||!decode(std::get<std::vector<uint8_t>>(r->second),a))return false;}return true;}
bool read(A&a){auto i=Preferences::store().find("lgkrun");return i!=Preferences::store().end()&&std::holds_alternative<std::vector<uint8_t>>(i->second)&&decode(std::get<std::vector<uint8_t>>(i->second),a);}
bool actor(const A&a){auto&p=tp_battle_pet();return !p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving()&&p.speciesId==int(a[7])&&p.shiny==bool(a[8])&&p.geneAtk==a[9]&&p.geneDef==a[10]&&p.geneSpe==a[11]&&p.ageMinutes>=a[12]&&nonce()==a[13];}
bool eligible(){auto&p=tp_battle_pet();return !live&&!undo&&!tp_battle_is_open()&&!tp_wild_prompt_active()&&!p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving()&&nonce()&&supported()&&tpHallSupported()&&mask()==255;}
void profile(){Preferences p;p.putUChar("lgver",1);if(!Preferences::store().count("lgkdone"))p.putBool("lgkdone",false);if(!Preferences::store().count("lgkdate"))p.putUInt("lgkdate",0);}
int reserve(int op,const A&a){if(undo||serial>=0x7ffffffe)return 0;undo=std::make_unique<Pet>(tp_battle_pet());oldStore=Preferences::store();candidate=a;operation=op;token=++serial;return int(token);}
void launch(const A&a){active=a;const auto&m=kLeagueTeams[a[2]][a[3]];run=beginBattleRuntime(stats(a),wildBattleStats(m.dex,m.level));run.playerHp=a[4];run.playerMaxHp=a[5];run.restUsesLeft=a[6];turn={};live=true;resolved=won=false;}
}
extern "C" {
EMSCRIPTEN_KEEPALIVE int tp_lg_owned(){return live||bool(undo);}
EMSCRIPTEN_KEEPALIVE int tp_lg_prepare_start(int variant){if(variant<0||variant>2||!eligible())return 0;A a{};int t=reserve(1,a);if(!t)return 0;auto&p=tp_battle_pet();const auto now=uint32_t(std::time(nullptr));p.megaUpdate(now);BattleStats s{};s.level=p.level();s.atk=p.megaAtk(now);s.def=p.megaDef(now);s.spe=p.megaSpe(now);s.mega=p.megaActive(now);const auto*f=tpMegaByDex(p.speciesId);s.type1=s.mega&&f?f->type1:DEX_TBL[p.speciesId].type1;s.type2=s.mega&&f?f->type2:DEX_TBL[p.speciesId].type2;const auto r=beginBattleRuntime(s,wildBattleStats(87,54));candidate={1,2,uint32_t(variant),0,r.playerMaxHp,r.playerMaxHp,5,uint32_t(p.speciesId),uint32_t(p.shiny),p.geneAtk,p.geneDef,p.geneSpe,p.ageMinutes,nonce(),s.atk,s.def,s.spe,s.level,s.type1,s.type2,uint32_t(s.mega?p.megaFormId():0)};profile();Preferences::store()["lgkrun"]=encode(candidate);return t;}
EMSCRIPTEN_KEEPALIVE int tp_lg_prepare_resume(){A a{};if(!eligible()||!read(a)||a[1]!=1||!actor(a))return 0;a[1]=2;int t=reserve(1,a);if(t){profile();Preferences::store()["lgkrun"]=encode(a);}return t;}
EMSCRIPTEN_KEEPALIVE int tp_lg_prepare_win(){if(!live||!resolved||!won||!actor(active)||undo||!supported())return 0;A a=active;a[3]++;a[1]=1;a[4]=run.playerHp;a[6]=run.restUsesLeft;const bool final=a[3]==26;int t=reserve(final?3:2,a);if(!t)return 0;profile();if(final){if(!tpHallStageWin(tp_battle_pet(),uint8_t(active[17]),uint8_t(active[20]),active[13],uint8_t(active[2]),uint32_t(std::time(nullptr)))){tp_lg_finish(t,0);return 0;}Preferences p;if(!done()){p.putBool("lgkdone",true);p.putUInt("lgkdate",uint32_t(std::time(nullptr)));}Preferences::store().erase("lgkrun");}else Preferences::store()["lgkrun"]=encode(a);return t;}
EMSCRIPTEN_KEEPALIVE int tp_lg_prepare_seen(){if(live||undo||tp_battle_is_open()||tp_wild_prompt_active()||!tpHallSupported())return 0;A a{};int t=reserve(4,a);if(!t)return 0;if(!tpHallStageSeen()){tp_lg_finish(t,0);return 0;}return t;}
EMSCRIPTEN_KEEPALIVE int tp_lg_finish(int id,int commit){if(id<=0||uint32_t(id)!=token||!undo||(commit!=0&&commit!=1))return 0;if(!commit){tp_battle_pet()=*undo;Preferences::store()=oldStore;}else{if(operation==1)launch(candidate);else live=false;}undo.reset();oldStore.clear();token=0;operation=0;return 1;}
EMSCRIPTEN_KEEPALIVE void tp_lg_abort(){if(!undo){live=false;resolved=won=false;}}
EMSCRIPTEN_KEEPALIVE int tp_lg_turn(int action){if(!live||resolved||undo||action<0||action>4||!actor(active)){if(live&&!undo&&!actor(active))live=false;return 0;}turn=stepBattle(run,BattleAction(action),uint8_t(std::rand()%100));if(turn.battleEnded){resolved=true;won=turn.playerWon;}return 1;}
EMSCRIPTEN_KEEPALIVE const char *tp_lg_view(){static std::string out;A a{};const bool valid=supported(),has=valid&&read(a);if(live)a=active;int state=live?2:has?int(a[1]):0;int index=state?int(a[3]):0,variant=state?int(a[2]):0;const auto&m=kLeagueTeams[variant][index];auto&s=Preferences::store();int64_t date=0;if(valid)integer("lgkdate",date);
 out="{\"supported\":"+std::to_string(valid?1:0)+",\"unlocked\":"+std::to_string(mask()==255?1:0)+",\"done\":"+std::to_string(valid&&done()?1:0)+",\"date\":"+std::to_string(date)+",\"state\":"+std::to_string(state)+",\"live\":"+std::to_string(live?1:0)+",\"pending\":"+std::to_string(undo?1:0)+",\"actor\":"+std::to_string(state&&actor(a)?1:0)+",\"variant\":"+std::to_string(variant)+",\"index\":"+std::to_string(index)+",\"resolved\":"+std::to_string(resolved&&live?1:0)+",\"won\":"+std::to_string(won&&live?1:0)+",\"hp\":"+std::to_string(live?run.playerHp:state?a[4]:0)+",\"maxHp\":"+std::to_string(live?run.playerMaxHp:state?a[5]:0)+",\"rests\":"+std::to_string(live?run.restUsesLeft:state?a[6]:5)+",\"enemyHp\":"+std::to_string(live?run.enemyHp:0)+",\"enemyMaxHp\":"+std::to_string(live?run.enemyMaxHp:0)+",\"dex\":"+std::to_string(m.dex)+",\"level\":"+std::to_string(m.level)+",\"playerDex\":"+std::to_string(state?a[7]:tp_battle_pet().speciesId)+",\"shiny\":"+std::to_string(state?a[8]:tp_battle_pet().shiny)+",\"form\":"+std::to_string(state?a[20]:0)+",\"type1\":"+std::to_string(state?a[18]:0)+",\"type2\":"+std::to_string(state?a[19]:0)+"}";return out.c_str();}
}
