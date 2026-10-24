// One Kanto shiny-egg entitlement. Mutations use the existing whole-Pet/store undo.
#include <emscripten.h>
#include <string>
#include "pet.h"
#include "evolution_rules.h"
#include "regional_reward_egg.h"
extern Pet &tp_battle_pet();
extern "C" {int tp_battle_is_open();int tp_wild_prompt_active();int tp_f4_store_size();int tp_f4_store_pending();uint32_t tp_f4_store_begin();int tp_f4_store_finish(uint32_t,int);}
namespace tp_reward_detail {
struct Reward {int state=0,dex=0;uint32_t armed=0,born=0;};
bool integer(const char*key,int64_t&out){auto it=Preferences::store().find(key);if(it==Preferences::store().end()||!std::holds_alternative<int64_t>(it->second))return false;out=std::get<int64_t>(it->second);return true;}
uint32_t life(){int64_t v=0,n=0;return integer("f4lver",v)&&v==1&&integer("f4life",n)&&n>0&&n<=0x7fffffff?uint32_t(n):0;}
bool unlocked(){int64_t v=0,date=0;auto it=Preferences::store().find("lgkdone");return integer("lgver",v)&&v==1&&integer("lgkdate",date)&&date>=0&&date<=0xffffffffLL&&it!=Preferences::store().end()&&std::holds_alternative<bool>(it->second)&&std::get<bool>(it->second);}
bool allowed(int dex){return dex>=1&&dex<=151&&dex!=132&&TP_EGG_ELIGIBLE[dex]&&DEX_TBL[dex].rarity!=R_LEGENDARIO;}
bool load(Reward&r){r={};auto&s=Preferences::store();bool any=false;for(const char*k:{"rkver","rkstate","rkdex","rkarm","rkborn"})any=any||s.count(k);if(!any)return true;int64_t ver=0,state=0,dex=0,arm=0,born=0;if(!integer("rkver",ver)||ver!=1||!integer("rkstate",state)||state<1||state>3||!integer("rkdex",dex)||dex>151||dex<1||!allowed(int(dex))||!integer("rkarm",arm)||arm<0||arm>=0x7fffffff||!integer("rkborn",born)||born<0||born>0x7fffffff)return false;if((state==1&&(arm||born))||(state==2&&(!arm||born))||(state==3&&(!arm||born!=arm+1)))return false;r={int(state),int(dex),uint32_t(arm),uint32_t(born)};return true;}
void save(const Reward&r){Preferences p;p.putUChar("rkver",1);p.putUChar("rkstate",r.state);p.putShort("rkdex",r.dex);p.putUInt("rkarm",r.armed);p.putUInt("rkborn",r.born);}
bool quiet(){const auto&p=tp_battle_pet();return Preferences().getBool("init",false)&&!p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving()&&life()&&life()<0x7fffffff&&!tp_battle_is_open()&&!tp_wild_prompt_active()&&!tp_f4_store_pending()&&tp_f4_store_size()>0;}
}
bool tpRewardEggConsume(int16_t &target,bool &shiny){using namespace tp_reward_detail;Reward r;if(!load(r)||!unlocked()||r.state!=2||!life()||life()!=r.armed+1)return false;target=int16_t(r.dex);shiny=true;r.state=3;r.born=life();save(r);return true;}
extern "C" {
// 0: immutable selection; 1: arm for next natural newEgg; 2: disarm, retaining selection.
EMSCRIPTEN_KEEPALIVE uint32_t tp_rg_prepare(int operation,int dex){using namespace tp_reward_detail;Reward r;if(!load(r)||!unlocked()||!quiet())return 0;if(operation==0){if(r.state!=0||!allowed(dex))return 0;r.state=1;r.dex=dex;}else if(operation==1){if(r.state!=1)return 0;r.state=2;r.armed=life();}else if(operation==2){if(r.state!=2)return 0;r.state=1;r.armed=r.born=0;}else return 0;uint32_t token=tp_f4_store_begin();if(!token)return 0;save(r);return token;}
EMSCRIPTEN_KEEPALIVE int tp_rg_allowed(int dex){return tp_reward_detail::allowed(dex)?1:0;}
EMSCRIPTEN_KEEPALIVE const char *tp_rg_view(){using namespace tp_reward_detail;static std::string out;Reward r;const bool supported=load(r),eligible=unlocked(),q=quiet();if(!supported)r={};out="{\"supported\":"+std::to_string(supported?1:0)+",\"eligible\":"+std::to_string(eligible?1:0)+",\"state\":"+std::to_string(r.state)+",\"dex\":"+std::to_string(r.dex)+",\"armedLife\":"+std::to_string(r.armed)+",\"bornLife\":"+std::to_string(r.born)+",\"life\":"+std::to_string(life())+",\"stale\":"+std::to_string(r.state==2&&life()!=r.armed?1:0)+",\"canChoose\":"+std::to_string(supported&&eligible&&q&&r.state==0?1:0)+",\"canArm\":"+std::to_string(supported&&eligible&&q&&r.state==1?1:0)+",\"canDisarm\":"+std::to_string(supported&&eligible&&q&&r.state==2?1:0)+",\"candidates\":[";bool first=true;for(int d=1;d<=151;d++)if(allowed(d)){if(!first)out+=',';out+=std::to_string(d);first=false;}out+="]}";return out.c_str();}
}
