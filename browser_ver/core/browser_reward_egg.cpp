// Per-region shiny-egg entitlements; existing whole-Pet/store transaction owns writes.
#include <emscripten.h>
#include <string>
#include "pet.h"
#include "evolution_rules.h"
#include "regional_reward_egg.h"
#include "region-progress-keys.h"
extern Pet &tp_battle_pet();
extern "C" {int tp_battle_is_open();int tp_wild_prompt_active();int tp_f4_store_size();int tp_f4_store_pending();uint32_t tp_f4_store_pending_token();uint32_t tp_f4_store_begin();int tp_f4_store_finish(uint32_t,int);}
namespace tp_reward_detail {
struct Reward {int state=0,dex=0;uint32_t armed=0,born=0;};
const TPRegionProgressKeys *keysFor(int region){return region>=0&&region<=255?tpRegionProgressKeys(uint8_t(region)):nullptr;}
bool integer(const char*key,int64_t&out){auto it=Preferences::store().find(key);if(it==Preferences::store().end()||!std::holds_alternative<int64_t>(it->second))return false;out=std::get<int64_t>(it->second);return true;}
uint32_t life(){int64_t v=0,n=0;return integer("f4lver",v)&&v==1&&integer("f4life",n)&&n>0&&n<=0x7fffffff?uint32_t(n):0;}
bool unlocked(int region=0){const auto *k=keysFor(region);if(!k)return false;int64_t v=0,date=0;auto it=Preferences::store().find(k->leagueDone);return integer(k->leagueVersion,v)&&v==1&&integer(k->leagueDate,date)&&date>=(region==0?0:1)&&date<=0xffffffffLL&&it!=Preferences::store().end()&&std::holds_alternative<bool>(it->second)&&std::get<bool>(it->second);}
bool allowed(int dex,int region=0){
 if(region==0)return dex>=1&&dex<=151&&dex!=132&&TP_EGG_ELIGIBLE[dex]&&DEX_TBL[dex].rarity!=R_LEGENDARIO;
 if(region!=1||dex<152||dex>251||dex==201||dex==243||dex==244||dex==245||dex==249||dex==250||dex==251)return false;
 return TP_EGG_ELIGIBLE[dex]&&DEX_TBL[dex].rarity!=R_LEGENDARIO;
}
bool load(Reward&r,int region=0){r={};const auto *k=keysFor(region);if(!k)return false;auto&s=Preferences::store();bool any=false;for(const char*key:{k->rewardVersion,k->rewardState,k->rewardDex,k->rewardArmed,k->rewardBorn})any=any||s.count(key);if(!any)return true;int64_t ver=0,state=0,dex=0,arm=0,born=0;if(!integer(k->rewardVersion,ver)||ver!=1||!integer(k->rewardState,state)||state<1||state>3||!integer(k->rewardDex,dex)||dex<(region==0?1:152)||dex>(region==0?151:251)||!allowed(int(dex),region)||!integer(k->rewardArmed,arm)||arm<0||arm>=0x7fffffff||!integer(k->rewardBorn,born)||born<0||born>0x7fffffff)return false;if((state==1&&(arm||born))||(state==2&&(!arm||born))||(state==3&&(!arm||born!=arm+1)))return false;r={int(state),int(dex),uint32_t(arm),uint32_t(born)};return true;}
void save(const Reward&r,int region=0){const auto *k=keysFor(region);Preferences p;p.putUChar(k->rewardVersion,1);p.putUChar(k->rewardState,r.state);p.putShort(k->rewardDex,r.dex);p.putUInt(k->rewardArmed,r.armed);p.putUInt(k->rewardBorn,r.born);}
bool quiet(){const auto&p=tp_battle_pet();return Preferences().getBool("init",false)&&!p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving()&&life()&&life()<0x7fffffff&&!tp_battle_is_open()&&!tp_wild_prompt_active()&&!tp_f4_store_pending()&&tp_f4_store_size()>0;}
struct Queue {bool supported=true;int count=0,region=-1;Reward values[2];};
Queue queue(){Queue q;for(int i=0;i<2;i++){if(!load(q.values[i],i)){q.supported=false;continue;}if(q.values[i].state==2){q.count++;q.region=i;}}return q;}
uint32_t pendingToken=0;int pendingRegion=-1;
void syncPending(){if(!pendingToken||tp_f4_store_pending_token()!=pendingToken){pendingToken=0;pendingRegion=-1;}}
uint32_t prepare(int region,int operation,int dex){
 syncPending();Reward r;if(!load(r,region)||!unlocked(region)||!quiet())return 0;
 if(operation==0){if(r.state!=0||!allowed(dex,region))return 0;r.state=1;r.dex=dex;}
 else if(operation==1){const auto q=queue();if(r.state!=1||!q.supported||q.count!=0)return 0;r.state=2;r.armed=life();}
 else if(operation==2){if(r.state!=2)return 0;r.state=1;r.armed=r.born=0;}
 else return 0;
 const uint32_t token=tp_f4_store_begin();if(!token)return 0;save(r,region);pendingToken=token;pendingRegion=region;return token;
}
int finish(int region,uint32_t token,int commit){syncPending();if(!pendingToken||pendingRegion!=region||pendingToken!=token||(commit!=0&&commit!=1))return 0;const int result=tp_f4_store_finish(token,commit);if(result==1){pendingToken=0;pendingRegion=-1;}return result;}
const char *view(int region){syncPending();static std::string out;Reward r;const bool supported=load(r,region),eligible=unlocked(region),q=quiet();const auto queued=queue();if(!supported)r={};out="{\"supported\":"+std::to_string(supported?1:0)+",\"eligible\":"+std::to_string(eligible?1:0)+",\"state\":"+std::to_string(r.state)+",\"dex\":"+std::to_string(r.dex)+",\"armedLife\":"+std::to_string(r.armed)+",\"bornLife\":"+std::to_string(r.born)+",\"life\":"+std::to_string(life())+",\"stale\":"+std::to_string(r.state==2&&life()!=r.armed?1:0)+",\"canChoose\":"+std::to_string(supported&&eligible&&q&&r.state==0?1:0)+",\"canArm\":"+std::to_string(supported&&eligible&&q&&r.state==1&&queued.supported&&queued.count==0?1:0)+",\"canDisarm\":"+std::to_string(supported&&eligible&&q&&r.state==2?1:0)+",\"queueSupported\":"+std::to_string(queued.supported?1:0)+",\"queueConflict\":"+std::to_string(queued.supported&&queued.count>1?1:0)+",\"armedRegion\":"+std::to_string(queued.supported&&queued.count==1?queued.region:-1)+",\"pendingRegion\":"+std::to_string(pendingRegion)+",\"candidates\":[";bool first=true;for(int d=region==1?152:1;d<=(region==0?151:region==1?251:0);d++)if(allowed(d,region)){if(!first)out+=',';out+=std::to_string(d);first=false;}out+="]}";return out.c_str();}
}
bool tpRewardEggConsume(int16_t &target,bool &shiny){using namespace tp_reward_detail;const auto q=queue();if(!q.supported||q.count!=1||!unlocked(q.region)||!life())return false;Reward r=q.values[q.region];if(life()!=r.armed+1)return false;target=int16_t(r.dex);shiny=true;r.state=3;r.born=life();save(r,q.region);return true;}
extern "C" {
EMSCRIPTEN_KEEPALIVE uint32_t tp_rg_prepare(int op,int dex){return tp_reward_detail::prepare(0,op,dex);}
EMSCRIPTEN_KEEPALIVE int tp_rg_allowed(int dex){return tp_reward_detail::allowed(dex)?1:0;}
EMSCRIPTEN_KEEPALIVE const char *tp_rg_view(){return tp_reward_detail::view(0);}
EMSCRIPTEN_KEEPALIVE uint32_t tp_region_rg_prepare(int region,int op,int dex){return tp_reward_detail::prepare(region,op,dex);}
EMSCRIPTEN_KEEPALIVE int tp_region_rg_finish(int region,uint32_t token,int commit){return tp_reward_detail::finish(region,token,commit);}
EMSCRIPTEN_KEEPALIVE int tp_region_rg_allowed(int region,int dex){return tp_reward_detail::allowed(dex,region)?1:0;}
EMSCRIPTEN_KEEPALIVE const char *tp_region_rg_view(int region){return tp_reward_detail::view(region);}
EMSCRIPTEN_KEEPALIVE int tp_region_rg_pending_region(){tp_reward_detail::syncPending();return tp_reward_detail::pendingRegion;}
}
