// Regional league transactions. Legacy APIs are fixed to Kanto; battle math unchanged.
#include <array>
#include <ctime>
#include <memory>
#include <string>
#include <vector>
#include <cstdlib>
#include <emscripten.h>
#include "pet.h"
#include "region-progress-keys.h"
#include "dex.h"
#include "battle.h"
#include "league-kanto.h"
#include "league-johto.h"
#include "league-hall.h"
#include "battle-energy.h"
#if defined(__EMSCRIPTEN__) || defined(TP_LGT_TEST)
extern "C" int tp_lgt_owned();
extern "C" int tp_lgt_session_region();
static bool leagueTeamOwned(){return tp_lgt_owned()!=0;}
static int leagueTeamRegion(){return tp_lgt_session_region();}
#else
static bool leagueTeamOwned(){return false;}
static int leagueTeamRegion(){return -1;}
#endif
extern "C" int tp_lg_finish(int,int);
extern Pet &tp_battle_pet();
extern "C" int tp_battle_is_open();
extern "C" int tp_wild_prompt_active();
namespace {
using A=std::array<uint32_t,21>;
int activeRegion=0,pendingRegion=0;
uint32_t regionFormat(int region){return region==0?1:2;}
const TPRegionProgressKeys *regionKeys(int region){return region>=0&&region<=255?tpRegionProgressKeys(uint8_t(region)):nullptr;}
const TPLeagueMon *leagueMemberFor(int region,uint32_t variant,uint32_t index){if(index>=26)return nullptr;if(region==0)return variant<3?&kLeagueTeams[variant][index]:nullptr;if(region==1)return variant==0?tpJohtoLeagueMonAt(index):nullptr;return nullptr;}
int leagueFinishFor(int,int,int);

bool live=false,resolved=false,won=false;BattleRuntime run{};BattleTurnResult turn{};A active{};
uint32_t viewId=0;uint16_t lastDealt=0,lastTaken=0,lastHeal=0;
std::string viewQuote(const char*s){std::string out="\"";for(unsigned i=0;i<23&&s[i];i++){unsigned char c=s[i];if(c=='"'||c=='\\')out+='\\';if(c<32){char b[7];snprintf(b,sizeof(b),"\\u%04x",c);out+=b;}else out+=char(c);}return out+'"';}
uint32_t serial=0,token=0;int operation=0;A candidate{};
std::unique_ptr<Pet> undo;std::map<std::string,Preferences::Value> oldStore;
bool integer(const char *key,int64_t &out){const auto&i=Preferences::store().find(key);if(i==Preferences::store().end()||!std::holds_alternative<int64_t>(i->second))return false;out=std::get<int64_t>(i->second);return true;}
uint32_t nonce(){int64_t ver=0,n=0;return integer("f4lver",ver)&&ver==1&&integer("f4life",n)&&n>0&&n<=0x7fffffff?uint32_t(n):0;}
int mask(const TPRegionProgressKeys &keys=TP_KANTO_KEYS){int64_t v=0,m=0;return integer(keys.arenaVersion,v)&&v==1&&integer(keys.arenaMask,m)&&m>=0&&m<=255?int(m):0;}
BattleStats stats(const A&a){BattleStats s{};s.atk=a[14];s.def=a[15];s.spe=a[16];s.level=a[17];s.type1=a[18];s.type2=a[19];s.mega=a[20]>0;return s;}
uint32_t sum(const std::vector<uint8_t>&b,size_t n){uint32_t x=2166136261u;for(size_t i=0;i<n;i++){x^=b[i];x*=16777619u;}return x;}
std::vector<uint8_t> encode(const A&a){std::vector<uint8_t>b;for(auto x:a)for(int i=0;i<4;i++)b.push_back(uint8_t(x>>(i*8)));auto c=sum(b,b.size());for(int i=0;i<4;i++)b.push_back(uint8_t(c>>(i*8)));return b;}
bool decode(const std::vector<uint8_t>&b,A&a,uint32_t format=1){if(b.size()!=88)return false;auto u=[&](size_t p){return uint32_t(b[p])|(uint32_t(b[p+1])<<8)|(uint32_t(b[p+2])<<16)|(uint32_t(b[p+3])<<24);};if(u(84)!=sum(b,84))return false;for(int i=0;i<21;i++)a[i]=u(i*4);
 if(a[0]!=format||(a[1]!=1&&a[1]!=2)||a[2]>(format==1?2:0)||a[3]>25||!a[4]||a[4]>a[5]||a[5]>65535||a[6]>5||a[7]<1||a[7]>DEX_COUNT||a[8]>1||a[9]>255||a[10]>255||a[11]>255||!a[13]||a[13]>0x7fffffff||!a[14]||a[14]>65535||!a[15]||a[15]>65535||!a[16]||a[16]>65535||!a[17]||a[17]>100||!a[18]||a[18]>18||a[19]>18||a[20]>3)return false;
 return beginBattleRuntime(stats(a),wildBattleStats(19,1)).playerMaxHp==a[5];}
bool done(const TPRegionProgressKeys &keys=TP_KANTO_KEYS){const auto&i=Preferences::store().find(keys.leagueDone);return i!=Preferences::store().end()&&std::holds_alternative<bool>(i->second)&&std::get<bool>(i->second);}
bool supported(const TPRegionProgressKeys &keys=TP_KANTO_KEYS,uint32_t format=1){auto&s=Preferences::store();if(!s.count(keys.leagueVersion))return !s.count(keys.leagueRun)&&!s.count(keys.leagueDone)&&!s.count(keys.leagueDate);int64_t v=0,d=0;if(!integer(keys.leagueVersion,v)||v!=1||!integer(keys.leagueDate,d)||d<0||d>0xffffffffLL)return false;const auto&b=s.find(keys.leagueDone);if(b==s.end()||!std::holds_alternative<bool>(b->second)||(!done(keys)&&d!=0))return false;const auto&r=s.find(keys.leagueRun);if(r!=s.end()){A a{};if(!std::holds_alternative<std::vector<uint8_t>>(r->second)||!decode(std::get<std::vector<uint8_t>>(r->second),a,format))return false;}return true;}
bool read(A&a,const TPRegionProgressKeys &keys=TP_KANTO_KEYS,uint32_t format=1){auto i=Preferences::store().find(keys.leagueRun);return i!=Preferences::store().end()&&std::holds_alternative<std::vector<uint8_t>>(i->second)&&decode(std::get<std::vector<uint8_t>>(i->second),a,format);}
bool actor(const A&a){auto&p=tp_battle_pet();return !p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving()&&p.speciesId==int(a[7])&&p.shiny==bool(a[8])&&p.geneAtk==a[9]&&p.geneDef==a[10]&&p.geneSpe==a[11]&&p.ageMinutes>=a[12]&&nonce()==a[13];}
bool eligible(int region=0){const auto *keys=regionKeys(region);if(!keys)return false;auto&p=tp_battle_pet();return !live&&!undo&&!tp_battle_is_open()&&!tp_wild_prompt_active()&&!p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving()&&nonce()&&supported(*keys,regionFormat(region))&&tpHallSupportedFor(region)&&mask(*keys)==255;}
void profile(int region=0){const auto *keys=regionKeys(region);Preferences p;p.putUChar(keys->leagueVersion,1);if(!Preferences::store().count(keys->leagueDone))p.putBool(keys->leagueDone,false);if(!Preferences::store().count(keys->leagueDate))p.putUInt(keys->leagueDate,0);}
int reserve(int op,const A&a,int region=0){if(!regionKeys(region)||undo||serial>=0x7ffffffe)return 0;undo=std::make_unique<Pet>(tp_battle_pet());oldStore=Preferences::store();candidate=a;pendingRegion=region;operation=op;token=++serial;return int(token);}
void launch(const A&a,int region=0){activeRegion=region;if(++viewId==0)++viewId;lastDealt=lastTaken=lastHeal=0;active=a;const auto&m=*leagueMemberFor(region,a[2],a[3]);run=beginBattleRuntime(stats(a),wildBattleStats(m.dex,m.level));run.playerHp=a[4];run.playerMaxHp=a[5];run.restUsesLeft=a[6];turn={};live=true;resolved=won=false;}
int leagueStartFor(int region,int variant){const auto *keys=regionKeys(region);if(!keys||variant<0||variant>(region==0?2:0)||!eligible(region)||!tpEnergyCan(1))return 0;A a{};int t=reserve(1,a,region);if(!t)return 0;auto&p=tp_battle_pet();const auto now=uint32_t(std::time(nullptr));p.megaUpdate(now);BattleStats s{};s.level=p.level();s.atk=p.megaAtk(now);s.def=p.megaDef(now);s.spe=p.megaSpe(now);s.mega=p.megaActive(now);const auto*f=tpMegaByDex(p.speciesId);s.type1=s.mega&&f?f->type1:DEX_TBL[p.speciesId].type1;s.type2=s.mega&&f?f->type2:DEX_TBL[p.speciesId].type2;const auto r=beginBattleRuntime(s,wildBattleStats(leagueMemberFor(region,uint32_t(variant),0)->dex,leagueMemberFor(region,uint32_t(variant),0)->level));candidate={regionFormat(region),2,uint32_t(variant),0,r.playerMaxHp,r.playerMaxHp,5,uint32_t(p.speciesId),uint32_t(p.shiny),p.geneAtk,p.geneDef,p.geneSpe,p.ageMinutes,nonce(),s.atk,s.def,s.spe,s.level,s.type1,s.type2,uint32_t(s.mega?p.megaFormId():0)};if(!tpEnergySpend(1)){leagueFinishFor(region,t,0);return 0;}profile(region);Preferences::store()[keys->leagueRun]=encode(candidate);return t;}
int leagueResumeFor(int region){const auto *keys=regionKeys(region);if(!keys)return 0;A a{};if(!eligible(region)||!read(a,*keys,regionFormat(region))||a[1]!=1||!actor(a)||(a[3]==20&&!tpEnergyCan(2)))return 0;a[1]=2;int t=reserve(1,a,region);if(t){if(a[3]==20&&!tpEnergySpend(2)){leagueFinishFor(region,t,0);return 0;}profile(region);Preferences::store()[keys->leagueRun]=encode(a);}return t;}
int leagueWinFor(int region){const auto *keys=regionKeys(region);if(!keys||activeRegion!=region||!live||!resolved||!won||!actor(active)||undo||!supported(*keys,regionFormat(region)))return 0;A a=active;a[3]++;a[1]=1;a[4]=run.playerHp;a[6]=run.restUsesLeft;const bool final=a[3]==26;int t=reserve(final?3:2,a,region);if(!t)return 0;profile(region);if(final){if(!tpHallStageWinFor(region,tp_battle_pet(),uint8_t(active[17]),uint8_t(active[20]),active[13],uint8_t(active[2]),uint32_t(std::time(nullptr)))){leagueFinishFor(region,t,0);return 0;}Preferences p;if(!done(*keys)){p.putBool(keys->leagueDone,true);p.putUInt(keys->leagueDate,uint32_t(std::time(nullptr)));}Preferences::store().erase(keys->leagueRun);}else Preferences::store()[keys->leagueRun]=encode(a);return t;}
int leagueSeenFor(int region){if(!regionKeys(region)||live||undo||tp_battle_is_open()||tp_wild_prompt_active()||!tpHallSupportedFor(region))return 0;A a{};int t=reserve(4,a,region);if(!t)return 0;if(!tpHallStageSeenFor(region)){leagueFinishFor(region,t,0);return 0;}return t;}
int leagueFinishFor(int region,int id,int commit){if(region!=pendingRegion||id<=0||uint32_t(id)!=token||!undo||(commit!=0&&commit!=1))return 0;if(!commit){tp_battle_pet()=*undo;Preferences::store()=oldStore;}else{if(operation==1)launch(candidate,region);else live=false;}undo.reset();oldStore.clear();token=0;operation=0;pendingRegion=0;return 1;}
void leagueAbortFor(int region){if(region==activeRegion&&!undo){live=false;resolved=won=false;}}
int leagueTurnFor(int region,int action){if(region!=activeRegion)return 0;if(!live||resolved||undo||action<0||action>4||!actor(active)){if(live&&!undo&&!actor(active))live=false;return 0;}const uint16_t d=run.playerDamageTotal,t=run.enemyDamageTotal;turn=stepBattle(run,BattleAction(action),uint8_t(std::rand()%100));lastDealt=uint16_t(run.playerDamageTotal-d);lastTaken=uint16_t(run.enemyDamageTotal-t);lastHeal=turn.playerHeal;if(turn.battleEnded){resolved=true;won=turn.playerWon;}return 1;}
const char *leagueViewFor(int region){static std::string out;const auto *keys=regionKeys(region);if(!keys){out="{\"supported\":0}";return out.c_str();}const bool own=live&&activeRegion==region;A a{};const bool valid=supported(*keys,regionFormat(region)),has=valid&&read(a,*keys,regionFormat(region));if(own)a=active;int state=own?2:has?int(a[1]):0;int index=state?int(a[3]):0,variant=state?int(a[2]):0;const auto&m=*leagueMemberFor(region,uint32_t(variant),uint32_t(index));auto&s=Preferences::store();int64_t date=0;if(valid)integer(keys->leagueDate,date);
 out="{\"supported\":"+std::to_string(valid?1:0)+",\"unlocked\":"+std::to_string(mask(*keys)==255?1:0)+",\"done\":"+std::to_string(valid&&done(*keys)?1:0)+",\"date\":"+std::to_string(date)+",\"state\":"+std::to_string(state)+",\"live\":"+std::to_string(own?1:0)+",\"pending\":"+std::to_string(undo&&pendingRegion==region?1:0)+",\"actor\":"+std::to_string(state&&actor(a)?1:0)+",\"variant\":"+std::to_string(variant)+",\"index\":"+std::to_string(index)+",\"resolved\":"+std::to_string(resolved&&own?1:0)+",\"won\":"+std::to_string(won&&own?1:0)+",\"hp\":"+std::to_string(own?run.playerHp:state?a[4]:0)+",\"maxHp\":"+std::to_string(own?run.playerMaxHp:state?a[5]:0)+",\"rests\":"+std::to_string(own?run.restUsesLeft:state?a[6]:5)+",\"enemyHp\":"+std::to_string(own?run.enemyHp:0)+",\"enemyMaxHp\":"+std::to_string(own?run.enemyMaxHp:0)+",\"dex\":"+std::to_string(m.dex)+",\"level\":"+std::to_string(m.level)+",\"playerDex\":"+std::to_string(state?a[7]:tp_battle_pet().speciesId)+",\"shiny\":"+std::to_string(state?a[8]:tp_battle_pet().shiny)+",\"form\":"+std::to_string(state?a[20]:0)+",\"type1\":"+std::to_string(state?a[18]:0)+",\"type2\":"+std::to_string(state?a[19]:0)+"}";out.pop_back();out+=",\"battleId\":"+std::to_string(viewId)+",\"playerLevel\":"+std::to_string(state?a[17]:0)+",\"atk\":"+std::to_string(state?a[14]:0)+",\"def\":"+std::to_string(state?a[15]:0)+",\"spe\":"+std::to_string(state?a[16]:0)+",\"nick\":"+viewQuote(tp_battle_pet().nick)+",\"round\":"+std::to_string(own?run.round:0)+",\"dealt\":"+std::to_string(own?lastDealt:0)+",\"taken\":"+std::to_string(own?lastTaken:0)+",\"heal\":"+std::to_string(own?lastHeal:0)+",\"note\":"+viewQuote(!own?"":turn.restFailed?"Keine Heilung":turn.counterReady?"Konter bereit":turn.enemyDodged?"Gegner ausgewichen":turn.playerDodged?"Ausgewichen":"")+"}";return out.c_str();}
}
extern "C" {
EMSCRIPTEN_KEEPALIVE const char *tp_region_league_view(int region){
 static std::string out;const auto *keys=regionKeys(region);
 if(!keys){out="{\"supported\":0,\"region\":"+std::to_string(region)+",\"playable\":0}";return out.c_str();}
 const uint32_t format=regionFormat(region);const bool valid=supported(*keys,format);A a{};const bool has=valid&&read(a,*keys,format);int64_t date=0;if(valid)integer(keys->leagueDate,date);
 out="{\"supported\":"+std::to_string(valid?1:0)+",\"region\":"+std::to_string(region)+",\"playable\":"+std::to_string(valid?1:0)+",\"unlocked\":"+std::to_string(mask(*keys)==255?1:0)+",\"done\":"+std::to_string(valid&&done(*keys)?1:0)+",\"date\":"+std::to_string(date)+",\"hasRun\":"+std::to_string(has?1:0)+",\"state\":"+std::to_string(has?a[1]:0)+",\"index\":"+std::to_string(has?a[3]:0)+",\"format\":"+std::to_string(format)+"}";return out.c_str();
}
EMSCRIPTEN_KEEPALIVE int tp_lg_owned(){return live||bool(undo)||leagueTeamOwned();}
EMSCRIPTEN_KEEPALIVE int tp_region_lg_session_region(){return undo?pendingRegion:live?activeRegion:leagueTeamRegion();}
EMSCRIPTEN_KEEPALIVE int tp_lg_prepare_start(int v){return leagueStartFor(0,v);}
EMSCRIPTEN_KEEPALIVE int tp_region_lg_prepare_start(int r,int v){return leagueStartFor(r,v);}
EMSCRIPTEN_KEEPALIVE int tp_lg_prepare_resume(){return leagueResumeFor(0);}
EMSCRIPTEN_KEEPALIVE int tp_region_lg_prepare_resume(int r){return leagueResumeFor(r);}
EMSCRIPTEN_KEEPALIVE int tp_lg_prepare_win(){return leagueWinFor(0);}
EMSCRIPTEN_KEEPALIVE int tp_region_lg_prepare_win(int r){return leagueWinFor(r);}
EMSCRIPTEN_KEEPALIVE int tp_lg_prepare_seen(){return leagueSeenFor(0);}
EMSCRIPTEN_KEEPALIVE int tp_region_lg_prepare_seen(int r){return leagueSeenFor(r);}
EMSCRIPTEN_KEEPALIVE int tp_lg_finish(int t,int c){return leagueFinishFor(0,t,c);}
EMSCRIPTEN_KEEPALIVE int tp_region_lg_finish(int r,int t,int c){return leagueFinishFor(r,t,c);}
EMSCRIPTEN_KEEPALIVE void tp_lg_abort(){leagueAbortFor(0);}
EMSCRIPTEN_KEEPALIVE void tp_region_lg_abort(int r){leagueAbortFor(r);}
EMSCRIPTEN_KEEPALIVE int tp_lg_turn(int a){return leagueTurnFor(0,a);}
EMSCRIPTEN_KEEPALIVE int tp_region_lg_turn(int r,int a){return leagueTurnFor(r,a);}
EMSCRIPTEN_KEEPALIVE const char *tp_lg_view(){return leagueViewFor(0);}
EMSCRIPTEN_KEEPALIVE const char *tp_region_lg_view(int r){return leagueViewFor(r);}
}
