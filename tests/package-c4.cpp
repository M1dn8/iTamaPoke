#include <cassert>
#include <cstring>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Preferences pref;
static Pet make(int kind=0,bool legacy=false,uint8_t seed=6){
 Preferences::store().clear();pref.putBool("init",true);pref.putShort("dexn",1);pref.putShort("eggT2",1);pref.putUInt("age",540);pref.putUChar("full",80);pref.putUChar("joy",50);pref.putUChar("ene",80);pref.putUChar("hyg",80);pref.putUChar("bond",20);pref.putUChar("gatk",100);pref.putUChar("gdef",100);pref.putUChar("gspe",100);
 uint8_t bits[Pet::DEX_BITMAP_BYTES]={1};pref.putBytes("dexreg",bits,sizeof(bits));
 if(!legacy){pref.putUChar("psver",1);pref.putUChar("pskind",kind);uint8_t scores[4]={0};if(kind)scores[kind-1]=seed;pref.putBytes("psvec",scores,sizeof(scores));}
 Pet p;p.begin();p.setClock(100000);p.lastCareDay=(100000+3600)/86400;return p;
}
static void minutes(Pet&p,int n){for(int i=0;i<n;i++){g_millis+=60000;p.update(g_millis);}}
static void careReady(Pet&p){p.fullness=80;p.joy=50;p.energy=80;p.hygiene=80;}
int main(){
 Pet p=make();p.playResult(1);assert(p.personalityScore(0)==2);p.playResult(1);assert(p.personalityScore(0)==2);p.playResult(0);assert(p.personalityScore(0)==2);
 minutes(p,10);p.playResult(1);assert(p.personalityScore(0)==4);minutes(p,10);p.playResult(1);assert(p.personality()==PERS_PLAYFUL&&p.personalityScore(0)==6);
 p.energy=1;p.weight=100;assert(p.personality()==PERS_PLAYFUL);
 // Per-category cooldown: battle can count independently, but no instant type change.
 p=make();p.playResult(1);p.applyBattleWin(1,false);assert(p.personalityScore(0)==1&&p.personalityScore(1)==2);
 // Thirty-minute type-change lock.
 p=make(1);uint8_t scores[4]={2,5,0,0};pref.putBytes("psvec",scores,4);pref.putBool("pschg",true);pref.putUInt("pstchg",530);Pet locked;locked.begin();locked.setClock(100000);locked.lastCareDay=1;locked.applyBattleWin(1,false);assert(locked.personality()==PERS_PLAYFUL);minutes(locked,20);careReady(locked);locked.applyBattleWin(1,false);assert(locked.personality()==PERS_BRAVE);
 p=make(1,false,3);p.caress();assert(p.personality()==PERS_BALANCED);
 // No care points or bonus for a completely ineffective action.
 p=make(3);p.fullness=p.joy=p.energy=p.hygiene=p.bond=100;p.poops=0;p.caress();assert(p.personalityScore(2)==6&&pref.getUChar("psused",0)==0);
 p=make(3);p.caress();assert(p.bond==22&&pref.getUChar("psused",0)==1);
 p=make(3);p.caress();for(int i=0;i<6;i++)p.caress();assert(p.bond==28);minutes(p,30);p.joy=50;const auto cappedBond=p.bond;p.caress();assert(p.bond==cappedBond&&pref.getUChar("psused",0)==1);
 // First care via an item on a new day does not lose the binding counter.
 p=make(3);p.caress();minutes(p,30);careReady(p);p.setClock(186400);p.itemCounts[EXP_ITEM_ENERGY]=1;p.energy=40;const auto oldBond=p.bond;assert(p.useExpeditionItem(EXP_ITEM_ENERGY));assert(p.bond==oldBond+1&&pref.getUInt("psbday",0)==2);p.caress();assert(pref.getUChar("psbond",0)>=2&&pref.getUChar("psbond",0)<=8);
 // Meaningful item care during sleep remains care, without waking the pet.
 p=make(3);p.sleeping=true;p.energy=40;p.itemCounts[EXP_ITEM_ENERGY]=1;assert(p.useExpeditionItem(EXP_ITEM_ENERGY));assert(p.sleeping&&p.personalityScore(2)==8&&pref.getUChar("psused",0)==1);
 // Caps do not spend a bonus; a later meaningful effect can use it.
 p=make(1);p.joy=100;p.playResult(1);assert(pref.getUChar("psused",0)==0);p.joy=50;p.playResult(1);assert(p.joy==59&&pref.getUChar("psused",0)==1);
 // Shared 30-minute/three-per-day bonus budget.
 p=make(1);for(int i=0;i<4;i++){if(i)minutes(p,30);careReady(p);p.playResult(1);assert(p.joy==(i<3?59:57));}assert(pref.getUChar("psused",0)==3);
 // Sleep threshold, persistence and exactly one event per continuous sleep.
 p=make();p.toggleLight();minutes(p,29);assert(p.personalityScore(3)==0);p.setClock(100000);Pet asleep;asleep.begin();minutes(asleep,1);assert(asleep.personalityScore(3)==2);minutes(asleep,60);assert(asleep.personalityScore(3)==2);asleep.setClock(100000);Pet again;again.begin();minutes(again,1);assert(again.personalityScore(3)==2);
 p=make(4);p.energy=40;p.toggleLight();minutes(p,1);assert(p.energy==46);p.toggleLight();assert(p.energy==48&&pref.getUChar("psused",0)==1);p.toggleLight();p.toggleLight();assert(p.energy==48);
 // Genuine offline sleep also counts once.
 p=make();p.toggleLight();p.setClock(100000);p.syncClock(100000+3600);assert(p.personalityScore(3)==2);
 // Migration uses the old displayed personality exactly once.
 p=make(0,true);Preferences::store().erase("psver");pref.putUShort("ghi",30);Pet migrated;migrated.begin();assert(migrated.personality()==PERS_PLAYFUL&&migrated.personalityScore(0)==6);migrated.setClock(100000);pref.putUShort("ghi",0);Pet persisted;persisted.begin();assert(persisted.personality()==PERS_PLAYFUL);
 // Evolution keeps personality; a new egg/hatch clears only individual state.
 p=make(1);p.ageMinutes=16*60;p.fullness=p.joy=p.energy=p.hygiene=80;p.evolve();assert(p.speciesId==2&&p.personality()==PERS_PLAYFUL&&p.personalityScore(0)==6);
 g_millis+=10000;p=make(1);p.gameHi=77;p.joy=50;p.playResult(1);assert(pref.getUChar("psused",0)==1);auto oldClock=pref.getUInt("psclock",0);p.newEgg();assert(p.personality()==PERS_BALANCED&&p.gameHi==77&&pref.getUInt("psclock",0)==oldClock&&pref.getUChar("psused",0)==1);for(int i=0;i<4;i++)assert(p.personalityScore(i)==0);p.eggTap();p.eggTap();p.eggTap();assert(!p.isEgg()&&p.personality()==PERS_BALANCED);p.joy=50;p.ensureDailyGoals();int dailyExtra=0;for(int i=0;i<DAILY_GOAL_COUNT;i++)if(p.dailyGoalType[i]==DAILY_GOAL_PLAY&&!p.dailyGoalComplete(i))dailyExtra+=4;p.playResult(1);assert(p.joy==57+dailyExtra&&pref.getUChar("psused",0)==1);
 std::cout<<"C4 passed: points/cooldowns, stable traits, meaningful care, limits, sleep/live/offline persistence, migration, evolution, new eggs and shared bonus budget.\n";
}
