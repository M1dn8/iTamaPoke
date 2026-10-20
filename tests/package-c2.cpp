#include <cassert>
#include <cstring>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t) {}
static Pet live;
Pet &tp_battle_pet(){return live;}
static bool fighting=false;
extern "C" int tp_battle_is_open(){return fighting;}
extern "C" int tp_wild_prompt_active(){return 0;}
extern "C" int tp_c2_apply(int,int,int,int,int);
extern "C" int tp_c2_finish(int);
extern "C" double tp_c2_get(int);
static Pet specimen(){Pet p;p.speciesId=1;p.fullness=p.joy=p.energy=p.hygiene=80;p.dexReg[0]=1;return p;}
int main(){
 const uint32_t now=100000;
 for(int route=0;route<5;route++)for(auto minutes:{15,30,60}){
  Pet p=specimen();int cost=(minutes==15?12:minutes==30?20:32)+(route==4?6:0);
  assert(Pet::expeditionEnergyCost(minutes,route)==cost);
  p.energy=cost+19;assert(p.expeditionStartReason(minutes,now,route)==10);p.energy++;assert(p.canStartExpedition(minutes,now,route));
 }
 assert(Pet::expeditionEnergyCost(20)==255&&Pet::expeditionEnergyCost(15,5)==255);
 Pet p=specimen();assert(p.expeditionStartReason(15,0)==2);assert(p.expeditionStartReason(60,0xfffffff0UL)==2);
 p.fullness=39;assert(p.expeditionStartReason(15,now)==7);p.fullness=40;p.joy=39;assert(p.expeditionStartReason(15,now)==8);p.joy=40;p.hygiene=39;assert(p.expeditionStartReason(15,now)==9);
 p=specimen();p.sleeping=true;assert(!p.canStartExpedition(15,now));p.sleeping=false;p.speciesId=-1;assert(!p.canStartExpedition(15,now));p.speciesId=1;p.ceremony=CER_RELEASE;assert(!p.canStartExpedition(15,now));
 p=specimen();p.ageMinutes=16*60;p.evolve();assert(p.evolving()&&!p.canStartExpedition(15,now));
 for(auto minutes:{15,30,60}){
  p=specimen();assert(p.expeditionTrainingChance(minutes)==(minutes==15?8:minutes==30?15:25));p.bond=20;assert(p.expeditionTrainingChance(minutes)==(minutes==15?13:minutes==30?22:35));p.bond=50;assert(p.expeditionTrainingChance(minutes)==(minutes==15?18:minutes==30?30:45));assert(p.expeditionTrainingChance(minutes,4)==p.expeditionTrainingChance(minutes)+10);
 }
 for(int route=0;route<5;route++){
  int counts[3]={0};Pet weights=specimen();weights.itemCounts[3]=3;const int total=weights.expeditionCommonWeightTotal(route);
  for(int roll=0;roll<total;roll++){Pet trip=weights;assert(trip.startExpedition(15,now,99,roll,route));counts[trip.expeditionRewardItem]++;}
  for(int item=0;item<3;item++)assert(counts[item]==(route>=1&&route<=3&&item==route-1?3:1));
 }
 p=specimen();p.itemCounts[0]=3;p.itemCounts[3]=3;assert(p.expeditionCommonWeightTotal(1)==2&&p.expeditionCommonWeight(1,0)==0);
 for(int roll=0;roll<2;roll++){Pet trip=p;assert(trip.startExpedition(15,now,99,roll,1));assert(trip.expeditionRewardItem==roll+1);}
 p=specimen();p.itemCounts[0]=p.itemCounts[1]=p.itemCounts[2]=3;assert(p.expeditionTrainingChance(15)==100);assert(p.startExpedition(15,now,99,0));assert(p.expeditionRewardItem==EXP_ITEM_TRAIN);
 p=specimen();p.trAtk=p.trDef=p.trSpe=100;assert(p.expeditionTrainingChance(60,4)==0);p.itemCounts[0]=p.itemCounts[1]=p.itemCounts[2]=3;assert(p.expeditionInventoryFull()&&!p.startExpedition(15,now,0,0));
 p=specimen();p.bond=50;assert(p.startExpedition(15,now,99,0,3));assert(p.energy==68&&p.expeditionStartChance==18&&p.expeditionTrainingChance(15,3)==13);
 const auto end=p.expeditionEndEpoch;const auto reward=p.expeditionRewardItem;assert(end==now+900&&p.expeditionRoute==3&&p.expeditionStartEpoch==now&&p.expeditionMinutes==15);
 assert(!p.startExpedition(15,now,0,0)&&p.energy==68);assert(p.claimExpedition(end-1)==EXP_ITEM_NONE);
 p.itemCounts[reward]=3;assert(p.claimExpedition(end)==EXP_ITEM_NONE&&p.expeditionEndEpoch==end&&p.expeditionRewardItem==reward);
 assert(p.useExpeditionItem((ExpeditionItem)reward));assert(p.claimExpedition(end)==reward&&p.itemCounts[reward]==3);assert(p.claimExpedition(end)==EXP_ITEM_NONE);assert(p.expeditionLastItem==reward&&p.expeditionLastRoute==3&&p.expeditionLastClaimEpoch==end);
 Preferences::store().clear();Preferences prefs;prefs.putBool("init",true);p=specimen();p.setClock(now);assert(p.startExpedition(30,now,99,4,2));const auto savedReward=p.expeditionRewardItem;Pet loaded;loaded.begin();assert(loaded.expeditionRoute==2&&loaded.expeditionMinutes==30&&loaded.expeditionEndEpoch==now+1800&&loaded.expeditionRewardItem==savedReward);
 Preferences::store().clear();prefs.putBool("init",true);prefs.putShort("dexn",1);prefs.putShort("eggT2",1);prefs.putUInt("exend",now);prefs.putUChar("exrwd",EXP_ITEM_ENERGY);Pet legacy;legacy.begin();assert(legacy.expeditionRoute==0&&legacy.expeditionEndEpoch==now&&legacy.expeditionStartChance==255);assert(legacy.claimExpedition(now)==EXP_ITEM_ENERGY);
 // Browser adapter: revert both live state and serialized map on failed commit.
 Preferences::store().clear();live=specimen();live.setClock(uint32_t(std::time(nullptr)));prefs.putUInt("c2test",42);auto saved=Preferences::store();const auto energy=live.energy;
 assert(tp_c2_apply(0,15,4,-1,-1)==1&&live.energy==energy-18);assert(tp_c2_apply(0,15,0,-1,-1)==0);assert(tp_c2_finish(0)==1);assert(live.energy==energy&&live.expeditionEndEpoch==0&&Preferences::store()==saved);
 assert(tp_c2_apply(0,15,4,-1,-1)==1);assert(tp_c2_finish(1)==1&&live.expeditionRoute==4);assert(tp_c2_get(10)==4&&tp_c2_get(12)==15);assert(tp_c2_finish(1)==0);
 live=specimen();fighting=true;assert(tp_c2_apply(0,15,0,-1,-1)==0);fighting=false;
 // A blocked reward is never discarded when all training becomes maximal.
 p=specimen();assert(p.startExpedition(15,now,0,0));assert(p.expeditionRewardItem==EXP_ITEM_TRAIN);p.trAtk=p.trDef=p.trSpe=100;assert(p.claimExpedition(now+900)==EXP_ITEM_NONE&&p.expeditionRewardItem==EXP_ITEM_TRAIN);
 std::cout<<"C2 passed: routes/costs, care and energy boundaries, exact weight cycles, training chances, fallback, persistence, legacy trips, single claim, blocked rewards and commit rollback.\n";
}
