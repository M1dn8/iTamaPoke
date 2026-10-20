#include <cassert>
#include <cstring>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet live;Pet &tp_battle_pet(){return live;}
static bool fighting=false;
extern "C" int tp_battle_is_open(){return fighting;}
extern "C" int tp_wild_prompt_active(){return 0;}
extern "C" int tp_c2_apply(int,int,int,int,int);
extern "C" int tp_c2_finish(int);
extern "C" double tp_c2_get(int);
static Pet specimen(){Pet p;p.speciesId=1;p.ageMinutes=540;p.fullness=p.joy=p.energy=p.hygiene=80;p.dexReg[0]=1;return p;}
int main(){
 const uint32_t now=100000;
 for(uint8_t route=1;route<=4;route++){
  const uint8_t minutes=route==4?30:15,cost=route==4?26:12;
  assert(Pet::expeditionEnergyCost(minutes,route)==cost);
  for(uint8_t m:{uint8_t(15),uint8_t(30),uint8_t(60)})if(m!=minutes)assert(!specimen().canStartExpedition(m,now,route));
  for(uint8_t roll:{uint8_t(0),uint8_t(99),uint8_t(255)}){
   Pet p=specimen();auto before=p;assert(p.startExpedition(minutes,now,roll,roll,route));
   assert(p.energy==80-cost&&p.expeditionRewardItem==route-1&&p.expeditionFixedReward==1);
   assert(p.expeditionRoute==route&&p.expeditionMinutes==minutes&&p.expeditionEndEpoch==now+minutes*60);
   assert(p.speciesId==before.speciesId&&p.ageMinutes==before.ageMinutes&&std::memcmp(p.dexReg,before.dexReg,sizeof(p.dexReg))==0);
   assert(!p.startExpedition(minutes,now,0,0,route)&&p.energy==80-cost);
   assert(p.claimExpedition(p.expeditionEndEpoch-1)==EXP_ITEM_NONE);
   const auto end=p.expeditionEndEpoch;assert(p.claimExpedition(end)==route-1);assert(p.itemCounts[route-1]==1&&p.expeditionFixedReward==0);assert(p.claimExpedition(end)==EXP_ITEM_NONE);
  }
  Pet p=specimen();p.itemCounts[route-1]=3;assert(p.expeditionStartReason(minutes,now,route)==11);auto energy=p.energy;assert(!p.startExpedition(minutes,now,0,0,route)&&p.energy==energy);
  p=specimen();p.energy=cost+19;assert(p.expeditionStartReason(minutes,now,route)==10);p.energy++;assert(p.canStartExpedition(minutes,now,route));
 }
 assert(!specimen().canStartExpedition(15,now,0)&&!specimen().canStartExpedition(15,now,5));
 Pet p=specimen();p.trAtk=p.trDef=p.trSpe=100;assert(p.expeditionStartReason(30,now,4)==13);assert(p.canStartExpedition(15,now,1));
 p=specimen();p.fullness=39;assert(p.expeditionStartReason(15,now,1)==7);p.fullness=40;p.joy=39;assert(p.expeditionStartReason(15,now,1)==8);p.joy=40;p.hygiene=39;assert(p.expeditionStartReason(15,now,1)==9);
 p=specimen();p.sleeping=true;assert(!p.canStartExpedition(15,now,1));p.sleeping=false;p.speciesId=-1;assert(!p.canStartExpedition(15,now,1));p.speciesId=1;p.ceremony=CER_RELEASE;assert(!p.canStartExpedition(15,now,1));
 p=specimen();assert(p.startExpedition(15,now,0,0,3));auto end=p.expeditionEndEpoch;p.itemCounts[2]=3;assert(p.claimExpedition(end)==EXP_ITEM_NONE&&p.expeditionRewardItem==2);assert(p.useExpeditionItem(EXP_ITEM_CARE));assert(p.claimExpedition(end)==EXP_ITEM_CARE&&p.itemCounts[2]==3);
 // No random selection is consumed by new expedition starts.
 p=specimen();std::srand(123);const auto expected=std::rand();std::srand(123);assert(p.startExpedition(15,now,99,255,1));assert(std::rand()==expected);
 Preferences::store().clear();Preferences prefs;prefs.putBool("init",true);p=specimen();p.setClock(now);assert(p.startExpedition(30,now,0,0,4));Pet loaded;loaded.begin();assert(loaded.expeditionFixedReward==1&&loaded.expeditionRoute==4&&loaded.expeditionRewardItem==EXP_ITEM_TRAIN&&loaded.expeditionEndEpoch==now+1800);
 // Old route-0 and old variable-duration C2 trips retain their exact reward/end.
 for(uint8_t route:{uint8_t(0),uint8_t(2),uint8_t(4)}){
  Preferences::store().clear();prefs.putBool("init",true);prefs.putShort("dexn",1);prefs.putShort("eggT2",1);prefs.putUInt("exend",now);prefs.putUChar("exrwd",EXP_ITEM_CARE);prefs.putUChar("exroute",route);prefs.putUChar("exmins",60);
  Pet old;old.begin();assert(old.expeditionEndEpoch==now&&old.expeditionRewardItem==EXP_ITEM_CARE&&old.expeditionFixedReward==0);assert(old.claimExpedition(now)==EXP_ITEM_CARE);
 }
 Preferences::store().clear();live=specimen();live.setClock(uint32_t(std::time(nullptr)));prefs.putUInt("unrelated",42);const auto before=Preferences::store();
 assert(tp_c2_apply(0,30,4,-1,-1)==1&&live.energy==54&&live.expeditionFixedReward==1);assert(tp_c2_get(26)==1);assert(tp_c2_apply(0,15,1,-1,-1)==0);assert(tp_c2_finish(0)==1&&live.energy==80&&live.expeditionFixedReward==0&&Preferences::store()==before);
 assert(tp_c2_apply(0,60,4,-1,-1)==0);assert(tp_c2_apply(0,15,0,-1,-1)==0);
 assert(tp_c2_apply(0,15,2,-1,-1)==1&&live.expeditionRewardItem==EXP_ITEM_ENERGY);assert(tp_c2_finish(1)==1);
 live=specimen();fighting=true;assert(tp_c2_apply(0,15,1,-1,-1)==0);fighting=false;
 std::cout<<"C2 fixed passed: four guaranteed items, fixed times/costs, target-specific capacity, no RNG, energy/care limits, one claim, persistence, legacy trips and rollback.\n";
}
