// F4-B1: reversible opaque collection storage inside the existing Preferences
// map. Not called by the game until JS validation + gameplay hooks are ready.
#include <emscripten.h>
#include <cstdint>
#include <memory>
#include <string>
#include <vector>
#include "pet.h"
extern Pet &tp_battle_pet();
extern uint32_t g_millis;
extern "C" int tp_battle_is_open();
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
std::string quote(const char*s){std::string out="\"";for(unsigned i=0;i<23&&s[i];i++){const unsigned char c=static_cast<unsigned char>(s[i]);if(c=='"'||c=='\\')out+='\\';if(c<32){char b[7];snprintf(b,sizeof(b),"\\u%04x",c);out+=b;}else out+=char(c);}return out+'"';}
}
extern "C" {
// 0 = absent old save; negative = present but invalid/unreadable. Never erase it.
EMSCRIPTEN_KEEPALIVE int tp_f4_store_size(){const auto&s=Preferences::store();auto it=s.find(KEY);if(it==s.end())return 0;if(!std::holds_alternative<Bytes>(it->second))return -1;const auto&b=std::get<Bytes>(it->second);if(b.empty()||b.size()>size_t(LIMIT))return -2;if(!utf8(b.data(),int(b.size())))return -3;return int(b.size());}
EMSCRIPTEN_KEEPALIVE const uint8_t *tp_f4_store_ptr(){if(tp_f4_store_size()<=0)return nullptr;return std::get<Bytes>(Preferences::store().at(KEY)).data();}
EMSCRIPTEN_KEEPALIVE int tp_f4_store_pending(){return undo?1:0;}
// Read-only token identity for region-owned callers; does not begin a transaction.
EMSCRIPTEN_KEEPALIVE uint32_t tp_f4_store_pending_token(){return undo?undo->token:0;}
static uint32_t beginStore(bool resolvedCatchContext){
 if(undo||(!resolvedCatchContext&&tp_battle_is_open())||!Preferences().getBool("init",false)||tp_f4_store_size()<0||serial>=0x7fffffffu)return 0;
 const uint32_t token=++serial;undo=std::make_unique<Undo>(tp_battle_pet(),Preferences::store(),token);return token;
}
EMSCRIPTEN_KEEPALIVE uint32_t tp_f4_store_begin(){return beginStore(false);}
// Internal pairing with tp_f4_capture_begin, which checks capture eligibility.
EMSCRIPTEN_KEEPALIVE uint32_t tp_f4_store_begin_catch_context(){return tp_battle_is_open()?beginStore(true):0;}
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
