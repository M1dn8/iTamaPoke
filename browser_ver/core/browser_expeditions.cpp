#include <emscripten.h>
#include <ctime>
#include <memory>
#include "pet.h"
extern Pet &tp_battle_pet();
extern "C" int tp_battle_is_open();
extern "C" int tp_wild_prompt_active();
namespace {
uint32_t nowEpoch() { const auto n=std::time(nullptr); return n>0 && uint64_t(n)<=0xffffffffULL ? uint32_t(n) : 0; }
std::unique_ptr<Pet> undoPet;
std::map<std::string,Preferences::Value> undoStore;
void undo() { if(undoPet){tp_battle_pet()=*undoPet;Preferences::store()=undoStore;} undoPet.reset();undoStore.clear(); }
}
extern "C" {
EMSCRIPTEN_KEEPALIVE double tp_c2_get(int key) {
 Pet &p=tp_battle_pet();
 switch(key) {
 case 0:return p.energy;case 1:return p.fullness;case 2:return p.joy;case 3:return p.hygiene;case 4:return p.bond;
 case 5:return p.isEgg();case 6:return p.sleeping;case 7:return p.ceremony;case 8:return p.evolving();
 case 9:return p.expeditionEndEpoch;case 10:return p.expeditionRoute;case 11:return p.expeditionStartEpoch;
 case 12:return p.expeditionMinutes;case 13:return p.expeditionStartChance;case 14:return p.expeditionLastItem;
 case 15:return p.expeditionLastRoute;case 16:return p.expeditionLastClaimEpoch;
 case 17:return p.trAtk;case 18:return p.trDef;case 19:return p.trSpe;
 case 20:case 21:case 22:case 23:return p.itemCounts[key-20];case 24:return p.expeditionRewardItem;case 25:return p.poops;
 default:return -1;
 }
}
EMSCRIPTEN_KEEPALIVE int tp_c2_cost(int minutes,int route) {
 if(minutes<0||minutes>255||route<0||route>4)return 255;
 return Pet::expeditionEnergyCost(uint8_t(minutes),uint8_t(route));
}
EMSCRIPTEN_KEEPALIVE int tp_c2_reason(int minutes,int route) {
 if(minutes<0||minutes>255||route<0||route>4)return 1;
 if(tp_battle_is_open()||tp_wild_prompt_active())return 12;
 return tp_battle_pet().expeditionStartReason(uint8_t(minutes),nowEpoch(),uint8_t(route));
}
EMSCRIPTEN_KEEPALIVE int tp_c2_chance(int minutes,int route) {
 if(minutes<0||minutes>255||route<0||route>4)return 0;
 return tp_battle_pet().expeditionTrainingChance(uint8_t(minutes),uint8_t(route));
}
EMSCRIPTEN_KEEPALIVE int tp_c2_weight(int route,int item) {
 if(route<0||route>4||item<0||item>2)return 0;
 return tp_battle_pet().expeditionCommonWeight(uint8_t(route),uint8_t(item));
}
EMSCRIPTEN_KEEPALIVE int tp_c2_can_claim() {return tp_battle_pet().canClaimExpedition(nowEpoch());}
// Begin a reversible in-memory action. JS commits IndexedDB before finishing.
EMSCRIPTEN_KEEPALIVE int tp_c2_apply(int action,int minutes,int route,int item,int stat) {
 if(undoPet||action<0||action>2||tp_battle_is_open()||tp_wild_prompt_active())return 0;
 Pet &p=tp_battle_pet();
 if(action==0&&tp_c2_reason(minutes,route))return 0;
 if(action==1&&!p.canClaimExpedition(nowEpoch()))return 0;
 if(action==2&&(item<0||item>3||stat< -1||stat>2))return 0;
 undoStore=Preferences::store();undoPet=std::make_unique<Pet>(p);
 bool ok=false;
 if(action==0){
  const uint8_t total=p.expeditionCommonWeightTotal(uint8_t(route));
  const uint8_t luck=uint8_t(std::rand()%100), roll=uint8_t(std::rand()%(total?total:1));
  ok=p.startExpedition(uint8_t(minutes),nowEpoch(),luck,roll,uint8_t(route));
 }else if(action==1)ok=p.claimExpedition(nowEpoch())!=EXP_ITEM_NONE;
 else ok=p.useExpeditionItem((ExpeditionItem)item,int8_t(stat));
 if(!ok){undo();return 0;}return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_c2_finish(int commit) {
 if(!undoPet)return 0;
 if(!commit)undo();else{undoPet.reset();undoStore.clear();}
 return 1;
}
}
