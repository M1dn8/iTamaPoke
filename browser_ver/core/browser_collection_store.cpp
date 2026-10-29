// F4-B1: reversible opaque collection storage inside the existing Preferences
// map. Not called by the game until JS validation + gameplay hooks are ready.
#include <emscripten.h>
#include <cstdint>
#include <memory>
#include <string>
#include <vector>
#include "pet.h"
#include "region-progress-keys.h"
#include "region-access.h"
#include "league-hall.h"
extern Pet &tp_battle_pet();
extern uint32_t g_millis;
extern "C" int tp_battle_is_open();
#if defined(__EMSCRIPTEN__) || defined(TP_ZPD_TEST)
extern "C" int tp_zpd_can_result_begin();
#endif
#if defined(__EMSCRIPTEN__) || defined(TP_ADMISSION_CAPTURE_TEST)
extern "C" int tp_f4_capture_admission_context();
#endif
#if defined(__EMSCRIPTEN__) || defined(TP_LGT_TEST)
extern "C" int tp_lgt_can_result_begin();
#endif
namespace {
constexpr const char *KEY="f4col";
constexpr int LIMIT=262144;
using Bytes=std::vector<uint8_t>;
using Store=std::map<std::string,Preferences::Value>;
struct Undo {Pet pet;Store values;uint32_t token;Undo(const Pet&p,const Store&s,uint32_t t):pet(p),values(s),token(t){}};
std::unique_ptr<Undo> undo;
uint32_t serial=0;
bool lifeAudioQuiet=false;
bool utf8(const uint8_t*p,int n){
 for(int i=0;i<n;){uint32_t cp=p[i++];int extra=0;if(!cp)return false;if(cp<128)continue;
  if(cp>=194&&cp<=223){extra=1;cp&=31;}else if(cp>=224&&cp<=239){extra=2;cp&=15;}else if(cp>=240&&cp<=244){extra=3;cp&=7;}else return false;
  if(extra>n-i)return false;const int count=extra;while(extra--){const uint8_t c=p[i++];if((c&192)!=128)return false;cp=(cp<<6)|(c&63);}
  if((count==1&&cp<128)||(count==2&&cp<2048)||(count==3&&cp<65536)||cp>1114111||(cp>=55296&&cp<=57343))return false;
 }return true;
}
// P06 admission transport. JSON/model validation remains in JS.
// CRC covers both payload and pending flag; unknown/partial state is refused.
constexpr int F4_ADMISSION_LIMIT=65536;
uint32_t f4AdmissionChecksum(const Bytes &bytes,bool pending){
 uint32_t hash=2166136261u;
 for(const auto byte:bytes){hash^=byte;hash*=16777619u;}
 hash^=pending?1u:0u;hash*=16777619u;
 return hash;
}
int f4AdmissionTransport(bool *pending=nullptr){
 const auto &s=Preferences::store();
 bool any=false;
 for(const char *key:{"f4aver","f4admit","f4apend","f4acrc"})
  any=any||s.count(key);
 if(!any){if(pending)*pending=false;return 0;}
 const auto ver=s.find("f4aver"),data=s.find("f4admit"),
  flag=s.find("f4apend"),crc=s.find("f4acrc");
 if(ver==s.end()||data==s.end()||flag==s.end()||crc==s.end()||
    !std::holds_alternative<int64_t>(ver->second)||
    std::get<int64_t>(ver->second)!=1||
    !std::holds_alternative<Bytes>(data->second)||
    !std::holds_alternative<bool>(flag->second)||
    !std::holds_alternative<int64_t>(crc->second))return -1;
 const auto &bytes=std::get<Bytes>(data->second);
 const auto stored=std::get<int64_t>(crc->second);
 const bool waiting=std::get<bool>(flag->second);
 if(bytes.empty()||bytes.size()>size_t(F4_ADMISSION_LIMIT)||
    !utf8(bytes.data(),int(bytes.size()))||
    stored<0||stored>0xffffffffLL||
    uint32_t(stored)!=f4AdmissionChecksum(bytes,waiting))return -2;
 if(pending)*pending=waiting;
 return int(bytes.size());
}
// P06 fixed Zapdos pilot: typed scalar transport, no speculative migration.
// Absent old profile = step 0. Partial/future data is never treated as absent.
enum class StoryUnlock { Badges, FirstLeague, AllLeagueVariants };
struct StoryProfile {
 const char *versionKey,*stepKey,*ticketKey,*noticeVersion,*noticeRead;
 int badges;
 StoryUnlock unlock=StoryUnlock::Badges;
};
constexpr StoryProfile ZAPDOS_PROFILE{
 "zpdver","zpdstep","zpdtick","stynver","stynread",4
};
constexpr StoryProfile ARKTOS_PROFILE{
 "arcver","arcstep","arctick","arcnver","arcnread",6
};
constexpr StoryProfile LAVADOS_PROFILE{
 "mltver","mltstep","mlttick","mltnver","mltnread",8
};
constexpr StoryProfile MEWTWO_PROFILE{
 "mtwver","mtwstep","mtwtick","mtwnver","mtwnread",0,
 StoryUnlock::FirstLeague
};
constexpr StoryProfile MEW_PROFILE{
 "mewver","mewstep","mewtick","mewnver","mewnread",0,
 StoryUnlock::AllLeagueVariants
};
const StoryProfile *storyProfile(int dex){
 return dex==145?&ZAPDOS_PROFILE:
  dex==144?&ARKTOS_PROFILE:
  dex==146?&LAVADOS_PROFILE:
  dex==150?&MEWTWO_PROFILE:
  dex==151?&MEW_PROFILE:nullptr;
}
int storyState(const StoryProfile &profile,uint32_t *ticket=nullptr){
 const auto &s=Preferences::store();
 bool any=false;
 for(const char *key:{profile.versionKey,profile.stepKey,profile.ticketKey})any=any||s.count(key);
 if(!any){if(ticket)*ticket=0;return 0;}
 const auto ver=s.find(profile.versionKey),step=s.find(profile.stepKey),id=s.find(profile.ticketKey);
 if(ver==s.end()||step==s.end()||id==s.end()||
    !std::holds_alternative<int64_t>(ver->second)||
    !std::holds_alternative<int64_t>(step->second)||
    !std::holds_alternative<int64_t>(id->second))return -1;
 const auto v=std::get<int64_t>(ver->second);
 const auto n=std::get<int64_t>(step->second);
 const auto t=std::get<int64_t>(id->second);
 if(v!=1||n<0||n>3||t<0||t>0x7ffffffeLL||
    (n==3?t==0:t!=0))return -2;
 if(ticket)*ticket=uint32_t(t);
 return int(n);
}
int zpdState(uint32_t *ticket=nullptr){
 return storyState(ZAPDOS_PROFILE,ticket);
}
void storyWrite(const StoryProfile &profile,int step,uint32_t ticket){
 Preferences p;
 p.putUChar(profile.versionKey,1);p.putUChar(profile.stepKey,uint8_t(step));
 p.putUInt(profile.ticketKey,ticket);
}
void zpdWrite(int step,uint32_t ticket){
 storyWrite(ZAPDOS_PROFILE,step,ticket);
}

// P06 story notice metadata. Reads never initialize or repair old saves.
int storyNoticeState(const StoryProfile &profile){
 const auto &s=Preferences::store();
 const auto ver=s.find(profile.noticeVersion),read=s.find(profile.noticeRead);
 if(ver==s.end()&&read==s.end())return 0;
 if(ver==s.end()||read==s.end()||
    !std::holds_alternative<int64_t>(ver->second)||
    !std::holds_alternative<int64_t>(read->second))return -1;
 const auto v=std::get<int64_t>(ver->second);
 const auto r=std::get<int64_t>(read->second);
 return v==1&&r>=0&&r<=1?int(r):-1;
}
int zpdNoticeState(){return storyNoticeState(ZAPDOS_PROFILE);}
int zpdKantoMask(){
 const auto &s=Preferences::store();
 const auto &keys=TP_KANTO_KEYS;
 const auto ver=s.find(keys.arenaVersion);
 if(ver==s.end()){
  if(s.count(keys.arenaMask))return -1;
  for(unsigned i=0;i<8;i++)
   if(s.count(keys.arenaDatePrefix+std::to_string(i)))return -1;
  return 0;
 }
 if(!std::holds_alternative<int64_t>(ver->second)||
    std::get<int64_t>(ver->second)!=1)return -1;
 const auto mask=s.find(keys.arenaMask);
 if(mask==s.end()||!std::holds_alternative<int64_t>(mask->second))return -1;
 const auto value=std::get<int64_t>(mask->second);
 return value>=0&&value<=255?int(value):-1;
}
int zpdKantoBadges(){
 const int mask=zpdKantoMask();
 if(mask<0)return -1;
 int count=0;
 for(unsigned bit=0;bit<8;bit++)if(mask&(1<<bit))count++;
 return count;
}
// Historical Kanto completion metadata is shared by single/team runs.
// No writes or repair; an unfinished later run does not erase past completion.
int storyKantoLeagueCompleted(){return tpKantoLeagueCompletionState();}

int storyAccess(const StoryProfile &profile){
 const int step=storyState(profile);
 if(step<0||storyNoticeState(profile)<0)return -1;
 if(step>0)return 1;
 if(profile.unlock==StoryUnlock::FirstLeague)
  return storyKantoLeagueCompleted();
 if(profile.unlock==StoryUnlock::AllLeagueVariants){
  const int completed=storyKantoLeagueCompleted();
  if(completed!=1)return completed;
  const int variants=tpHallCompletedVariantsFor(0);
  return variants<0?-1:variants==7?1:0;
 }
 const int badges=zpdKantoBadges();
 return badges<0?-1:badges>=profile.badges?1:0;
}
int zpdAccess(){return storyAccess(ZAPDOS_PROFILE);}
int storyNoticeMark(const StoryProfile &profile,uint32_t token){
 if(!undo||undo->token!=token||tp_battle_is_open()||
    storyAccess(profile)!=1||storyNoticeState(profile)<0)return 0;
 if(storyNoticeState(profile)==1)return 1;
 Preferences p;
 p.putUChar(profile.noticeVersion,1);p.putUChar(profile.noticeRead,1);
 return 1;
}
int storyAdvance(const StoryProfile &profile,uint32_t token,int expectedStep){
 if(!undo||undo->token!=token||tp_battle_is_open()||
    expectedStep<0||expectedStep>1||storyState(profile)!=expectedStep||
    storyNoticeState(profile)<0||(expectedStep==0&&storyAccess(profile)!=1))return 0;
 storyWrite(profile,expectedStep+1,0);return 1;
}

std::string quote(const char*s){std::string out="\"";for(unsigned i=0;i<23&&s[i];i++){const unsigned char c=static_cast<unsigned char>(s[i]);if(c=='"'||c=='\\')out+='\\';if(c<32){char b[7];snprintf(b,sizeof(b),"\\u%04x",c);out+=b;}else out+=char(c);}return out+'"';}
}
extern "C" {
// 0 = absent old save; negative = present but invalid/unreadable. Never erase it.
EMSCRIPTEN_KEEPALIVE int tp_f4_store_size(){const auto&s=Preferences::store();auto it=s.find(KEY);if(it==s.end())return 0;if(!std::holds_alternative<Bytes>(it->second))return -1;const auto&b=std::get<Bytes>(it->second);if(b.empty()||b.size()>size_t(LIMIT))return -2;if(!utf8(b.data(),int(b.size())))return -3;return int(b.size());}
EMSCRIPTEN_KEEPALIVE const uint8_t *tp_f4_store_ptr(){if(tp_f4_store_size()<=0)return nullptr;return std::get<Bytes>(Preferences::store().at(KEY)).data();}
// Read-only transport API. Negative means unreadable, never "empty".
EMSCRIPTEN_KEEPALIVE int tp_f4_admission_size(){
 return f4AdmissionTransport();
}
EMSCRIPTEN_KEEPALIVE const uint8_t *tp_f4_admission_ptr(){
 return f4AdmissionTransport()>0?
  std::get<Bytes>(Preferences::store().at("f4admit")).data():nullptr;
}
EMSCRIPTEN_KEEPALIVE int tp_f4_admission_pending(){
 bool pending=false;
 const int size=f4AdmissionTransport(&pending);
 return size<0?-1:pending?1:0;
}
// Uses the existing whole-Pet/store checkpoint. No independent transaction.
EMSCRIPTEN_KEEPALIVE int tp_f4_admission_stage(
 uint32_t token,const uint8_t *data,int len,int pending){
 if(!undo||undo->token!=token||!data||len<=0||
    len>F4_ADMISSION_LIMIT||(pending!=0&&pending!=1)||
    !utf8(data,len)||f4AdmissionTransport()<0)return 0;
 Bytes bytes(data,data+len);
 const auto crc=f4AdmissionChecksum(bytes,pending!=0);
 Preferences p;
 p.putUChar("f4aver",1);p.putBool("f4apend",pending!=0);
 p.putUInt("f4acrc",crc);
 Preferences::store()["f4admit"]=std::move(bytes);
 return 1;
}
// Story-specific admission staging, not a general journal-event API.
// The JS admission model validates the decoded pending record and binds
// its ticket to the native story ticket. Native storage remains opaque.
// Consuming the pending flag prevents repeated application.
// Pet, journal and unread metadata share the existing whole-state undo.
EMSCRIPTEN_KEEPALIVE int tp_story_admission_stage(
 uint32_t token,int dex,const uint8_t *data,int len,uint32_t ticket){
 const auto *profile=storyProfile(dex);
 uint32_t expected=0;
 bool waiting=false;
 if(!profile||!undo||undo->token!=token||!ticket||tp_battle_is_open()||
    storyState(*profile,&expected)!=3||expected!=ticket||
    f4AdmissionTransport(&waiting)<=0||!waiting)return 0;
 if(!tp_f4_admission_stage(token,data,len,0))return 0;
 tp_battle_pet().journalStoryAdmission(uint16_t(dex));
 return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_zpd_admission_stage(
 uint32_t token,const uint8_t *data,int len,uint32_t ticket){
 return tp_story_admission_stage(token,145,data,len,ticket);
}
// Read-only; a negative value means unreadable, never "new adventure".
EMSCRIPTEN_KEEPALIVE int tp_zpd_step(){return zpdState();}
EMSCRIPTEN_KEEPALIVE int tp_zpd_ticket(){
 uint32_t ticket=0;
 return zpdState(&ticket)<0?-1:int(ticket);
}

EMSCRIPTEN_KEEPALIVE int tp_zpd_kanto_badges(){return zpdKantoBadges();}
EMSCRIPTEN_KEEPALIVE int tp_zpd_access(){return zpdAccess();}
EMSCRIPTEN_KEEPALIVE int tp_zpd_notice_read(){return zpdNoticeState();}
EMSCRIPTEN_KEEPALIVE int tp_zpd_notice_mark(uint32_t token){
 return storyNoticeMark(ZAPDOS_PROFILE,token);
}

// Investigation and securing only. Victory has no public scalar setter.
EMSCRIPTEN_KEEPALIVE int tp_zpd_advance(
 uint32_t token,int expectedStep){
 return storyAdvance(ZAPDOS_PROFILE,token,expectedStep);
}

// Shared preparation only; no public victory/completion setter.
EMSCRIPTEN_KEEPALIVE int tp_story_step(int dex){
 const auto *p=storyProfile(dex);
 return p?storyState(*p):-1;
}
EMSCRIPTEN_KEEPALIVE int tp_story_ticket(int dex){
 const auto *p=storyProfile(dex);uint32_t ticket=0;
 return !p||storyState(*p,&ticket)<0?-1:int(ticket);
}
EMSCRIPTEN_KEEPALIVE int tp_story_kanto_badges(int dex){
 return storyProfile(dex)?zpdKantoBadges():-1;
}
EMSCRIPTEN_KEEPALIVE int tp_story_access(int dex){
 const auto *p=storyProfile(dex);
 return p?storyAccess(*p):-1;
}
EMSCRIPTEN_KEEPALIVE int tp_story_notice_read(int dex){
 const auto *p=storyProfile(dex);
 return p?storyNoticeState(*p):-1;
}
EMSCRIPTEN_KEEPALIVE int tp_story_notice_mark(uint32_t token,int dex){
 const auto *p=storyProfile(dex);
 return p?storyNoticeMark(*p,token):0;
}
EMSCRIPTEN_KEEPALIVE int tp_story_advance(
 uint32_t token,int dex,int expectedStep){
 const auto *p=storyProfile(dex);
 return p?storyAdvance(*p,token,expectedStep):0;
}

// Internal pairing for the upcoming verified Zapdos-result adapter.
// Not EMSCRIPTEN_KEEPALIVE: cannot be called as a JavaScript victory shortcut.
// JSON/ticket linkage is additionally checked by the strict whole-save parser.
// Internal only: the battle owner verifies the resolved outcome.
int tp_story_store_victory(uint32_t token,int dex,uint32_t ticket){
 const auto *profile=storyProfile(dex);
 if(!profile||!undo||undo->token!=token||!tp_battle_is_open()||
    storyState(*profile)!=2||ticket<1||ticket>0x7ffffffeu||
    tp_f4_admission_pending()!=1)return 0;
 storyWrite(*profile,3,ticket);return 1;
}
int tp_zpd_store_victory(uint32_t token,uint32_t ticket){
 return tp_story_store_victory(token,145,ticket);
}

EMSCRIPTEN_KEEPALIVE int tp_f4_store_pending(){return undo?1:0;}
// Read-only token identity for region-owned callers; does not begin a transaction.
EMSCRIPTEN_KEEPALIVE uint32_t tp_f4_store_pending_token(){return undo?undo->token:0;}
static uint32_t beginStore(bool resolvedCatchContext){
 if(undo||(!resolvedCatchContext&&tp_battle_is_open())||!Preferences().getBool("init",false)||tp_f4_store_size()<0||serial>=0x7fffffffu)return 0;
 const uint32_t token=++serial;undo=std::make_unique<Undo>(tp_battle_pet(),Preferences::store(),token);return token;
}
EMSCRIPTEN_KEEPALIVE uint32_t tp_f4_store_begin(){return beginStore(false);}
// A pending admission may be completed in quiet care/box context, or
// immediately after this adapter's confirmed successful capture.
EMSCRIPTEN_KEEPALIVE uint32_t tp_f4_admission_begin(){
 bool pending=false;
 if(f4AdmissionTransport(&pending)<=0||!pending)return 0;
 if(!tp_battle_is_open())return beginStore(false);
#if defined(__EMSCRIPTEN__) || defined(TP_ADMISSION_CAPTURE_TEST)
 return tp_f4_capture_admission_context()?beginStore(true):0;
#else
 return 0;
#endif
}
// Internal pairing with tp_f4_capture_begin, which checks capture eligibility.
EMSCRIPTEN_KEEPALIVE uint32_t tp_f4_store_begin_catch_context(){return tp_battle_is_open()?beginStore(true):0;}
// Internal pairing only: tp_wt_result_begin checks the resolved team outcome.
// Not a new general-purpose JavaScript collection-write entry point.
uint32_t tp_f4_store_begin_wild_result_context(){
 return tp_battle_is_open()?beginStore(true):0;
}
// Internal only: the native Zapdos adapter verifies its resolved result.
uint32_t tp_f4_store_begin_zapdos_result_context(){
#if defined(__EMSCRIPTEN__) || defined(TP_ZPD_TEST)
 return tp_zpd_can_result_begin()?beginStore(true):0;
#else
 return 0;
#endif
}
// Internal pairing only: the arena result entry point checks ownership
// and the completed series before opening this whole-state transaction.
uint32_t tp_f4_store_begin_arena_result_context(){
 return tp_battle_is_open()?beginStore(true):0;
}
#if defined(__EMSCRIPTEN__) || defined(TP_LGT_TEST)
// Internal only. The league adapter verifies its resolved winning session.
uint32_t tp_f4_store_begin_league_result_context(){
 return tp_lgt_can_result_begin()?beginStore(true):0;
}
#endif
// Opaque UTF-8 ITC1 model bytes are validated in the JS model before this call.
// The native layer checks transport/type/bounds, NOT the JSON model/checksum.
EMSCRIPTEN_KEEPALIVE int tp_f4_store_stage(uint32_t token,const uint8_t *data,int len){
 if(!undo||token!=undo->token||!data||len<=0||len>LIMIT||!utf8(data,len))return 0;
 Preferences::store()[KEY]=Bytes(data,data+len);return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_f4_store_finish(uint32_t token,int commit){
 if(!undo||token!=undo->token||(commit!=0&&commit!=1))return 0;
 if(!commit){tp_battle_pet()=undo->pet;Preferences::store()=undo->values;}
 undo.reset();return 1;
}
// Read-only DTO. No individual ID, invented origin, capture date or Mega copy.
EMSCRIPTEN_KEEPALIVE const char *tp_f4_current_snapshot(){
 static std::string result;const auto&p=tp_battle_pet();if(!Preferences().getBool("init",false)||p.isEgg()||p.speciesId<1||p.speciesId>DEX_COUNT){result="null";return result.c_str();}
 result="{\"dex\":"+std::to_string(p.speciesId)+",\"level\":"+std::to_string(p.level())+",\"nickname\":"+quote(p.nick)+",\"shiny\":"+(p.shiny?"true":"false")+",\"data\":{\"ageMinutes\":"+std::to_string(p.ageMinutes)+",\"genes\":{\"atk\":"+std::to_string(p.geneAtk)+",\"def\":"+std::to_string(p.geneDef)+",\"spe\":"+std::to_string(p.geneSpe)+"},\"training\":{\"atk\":"+std::to_string(p.trAtk)+",\"def\":"+std::to_string(p.trDef)+",\"spe\":"+std::to_string(p.trSpe)+"},\"stats\":{\"atk\":"+std::to_string(p.atkStat())+",\"def\":"+std::to_string(p.defStat())+",\"spe\":"+std::to_string(p.speStat())+"},\"medals\":"+std::to_string(p.medals)+",\"bond\":"+std::to_string(p.bond)+",\"fullness\":"+std::to_string(p.fullness)+",\"joy\":"+std::to_string(p.joy)+",\"energy\":"+std::to_string(p.energy)+",\"hygiene\":"+std::to_string(p.hygiene)+",\"careMistakes\":"+std::to_string(p.careMistakes)+",\"streak\":"+std::to_string(p.streak)+",\"personality\":"+std::to_string(int(p.personality()))+"}}";return result.c_str();
}

static int lifeToken(){
 const auto&s=Preferences::store();auto v=s.find("f4lver"),l=s.find("f4life");if(v==s.end()&&l==s.end())return 0;
 if(v==s.end()||l==s.end()||!std::holds_alternative<int64_t>(v->second)||!std::holds_alternative<int64_t>(l->second))return -1;
 const auto version=std::get<int64_t>(v->second),id=std::get<int64_t>(l->second);return version==1&&id>=1&&id<=0x7fffffffLL?int(id):-1;
}
EMSCRIPTEN_KEEPALIVE int tp_f4_life_audio_quiet(){return lifeAudioQuiet?1:0;}
EMSCRIPTEN_KEEPALIVE const char *tp_f4_life_state(){
 static std::string out;const auto&p=tp_battle_pet();const int token=lifeToken();out="{\"valid\":"+std::string(token>=0?"true":"false")+",\"initialized\":"+(token>0?"true":"false")+",\"token\":"+std::to_string(token)+",\"profileDex\":"+std::to_string(Preferences().getShort("dexn",-1))+",\"ceremony\":"+std::to_string(int(p.ceremony))+",\"snapshot\":"+tp_f4_current_snapshot()+"}";return out.c_str();
}
EMSCRIPTEN_KEEPALIVE int tp_f4_life_ensure(uint32_t token){if(!undo||undo->token!=token||!Preferences().getBool("init",false))return 0;const int life=lifeToken();if(life<0)return 0;if(life)return life;Preferences p;p.putUChar("f4lver",1);p.putUInt("f4life",1);return 1;}
EMSCRIPTEN_KEEPALIVE int tp_f4_life_end(uint32_t token,int kind,int expectedLife,uint32_t nowMs){
 auto&p=tp_battle_pet();const int life=lifeToken();if(!undo||undo->token!=token||tp_battle_is_open()||life<=0||life!=expectedLife||life>=0x7fffffff||p.isEgg()||p.ceremony!=CER_NONE||p.evolving()||kind<0||kind>2)return 0;
 if(kind==0&&!p.canFarewellNow())return 0;if(kind==2&&!p.canRunawayNow())return 0;
 g_millis=nowMs;lifeAudioQuiet=true;if(kind==0)p.startFarewell();else if(kind==1)p.release();else p.startRunaway();lifeAudioQuiet=false;
 return p.ceremony==uint8_t(kind==0?CER_FAREWELL:kind==1?CER_RELEASE:CER_RUNAWAY)?1:0;
}

}
