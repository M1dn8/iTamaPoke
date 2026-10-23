#include <cassert>
#include <cstring>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet live;Pet &tp_battle_pet(){return live;}static bool battle=false,wild=false;
extern "C" int tp_battle_is_open(){return battle;}extern "C" int tp_wild_prompt_active(){return wild;}
extern "C" int tp_f1_can();extern "C" int tp_f1_start(int,uint32_t);extern "C" int tp_f1_tap(int,uint32_t);extern "C" int tp_f1_apply(int,uint32_t);extern "C" int tp_f1_finish(int,int);extern "C" int tp_f1_cancel(int);extern "C" int tp_f1_get(int);
static void load(){Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",376);p.putShort("eggT2",374);p.putUInt("age",44*60);p.putUChar("gatk",100);p.putUChar("gdef",100);p.putUChar("gspe",100);p.putUChar("bond",80);p.putUChar("full",100);p.putUChar("joy",100);p.putUChar("ene",100);p.putUChar("hyg",100);p.putBool("shy",true);p.putUChar("mgver",3);p.putUChar("mgmask",3);p.putString("nick","Atlas");live=Pet();live.begin();live.setClock(100000);}
int main(){
 for(int kind:{0,1,2}){
  load();live.trAtk=live.trDef=live.trSpe=97;live.weight=30;const auto registered=live.registeredCount();const auto store=Preferences::store();int id=tp_f1_start(kind,1000);assert(id>0&&!tp_f1_start(kind,1001));
  for(int n=0;n<24;n++)assert(tp_f1_tap(id,1100+n*50));assert(!tp_f1_tap(id,2250));assert(!tp_f1_tap(id,11000));assert(!tp_f1_apply(id,10999));assert(live.trAtk==97&&live.trDef==97&&live.trSpe==97&&Preferences::store()==store);
  assert(tp_f1_apply(id,11000));assert(!tp_f1_apply(id,11000));assert(tp_f1_get(3)==3);assert(live.trAtk==(kind==0?100:97)&&live.trDef==(kind==1?100:97)&&live.trSpe==(kind==2?100:97));assert(live.energy==88&&live.fullness==95&&live.weight==22);
  assert(live.speciesId==376&&live.shiny&&std::strcmp(live.nick,"Atlas")==0&&live.registeredCount()==registered&&live.megaStoneMask()==3);assert(tp_f1_finish(id,1)&&!tp_f1_finish(id,1));live.setClock(100000);Pet p;p.begin();assert((kind==0?p.strHi:kind==1?p.defenseTrainHi:p.speedTrainHi)==24);assert(p.megaStoneMask()==3);
 }
 load();int id=tp_f1_start(2,1000);assert(tp_f1_tap(id,1100));assert(tp_f1_cancel(id));assert(!tp_f1_apply(id,11000));int next=tp_f1_start(2,12000);assert(next!=id&&!tp_f1_tap(id,12100));assert(tp_f1_cancel(next));
 load();id=tp_f1_start(1,1000);for(int i=0;i<80;i++)assert(tp_f1_tap(id,1100+i*40));const auto before=Preferences::store();const auto defense=live.trDef;assert(tp_f1_apply(id,11000)&&tp_f1_get(3)==18);assert(!tp_f1_finish(id,2));assert(tp_f1_finish(id,0)&&live.trDef==defense&&live.defenseTrainHi==0&&Preferences::store()==before);
 load();id=tp_f1_start(0,1000);const auto zeroStore=Preferences::store();assert(tp_f1_apply(id,11000));assert(tp_f1_get(3)==0&&live.energy==100&&live.fullness==100&&live.strHi==0);assert(tp_f1_finish(id,1)&&Preferences::store()==zeroStore);
 load();id=tp_f1_start(1,1000);assert(!tp_f1_apply(id,16001));assert(tp_f1_cancel(id));
 load();live.sleeping=true;assert(!tp_f1_can()&&!tp_f1_start(0,1000));live.sleeping=false;live.speciesId=-1;assert(!tp_f1_start(0,1000));live.speciesId=376;live.ceremony=CER_RELEASE;assert(!tp_f1_start(0,1000));live.ceremony=CER_NONE;battle=true;assert(!tp_f1_start(0,1000));battle=false;wild=true;assert(!tp_f1_start(0,1000));wild=false;assert(!tp_f1_start(-1,1000)&&!tp_f1_start(3,1000));
 load();id=tp_f1_start(0,1000);live.speciesId=303;assert(!tp_f1_tap(id,1100)&&!tp_f1_apply(id,11000));assert(tp_f1_cancel(id));
 load();live.speciesId=1;assert(live.evolveTo(2));assert(!tp_f1_can()&&!tp_f1_start(0,1000));
 load();live.speedTrainHi=7;live.defenseTrainHi=9;live.strHi=11;live.setClock(100000);live.newEgg();assert(live.speedTrainHi==7&&live.defenseTrainHi==9&&live.strHi==11);
 // New keys do not retroactively manufacture records, existing strength data stays.
 load();assert(live.speedTrainHi==0&&live.defenseTrainHi==0);assert(live.trainCombat(2,65535)==18);assert(live.trSpe==18&&live.trAtk==0&&live.trDef==0);
 // New rounds count once for an unfinished Mega challenge, not once per tap.
 load();Preferences pref;pref.putUChar("mgmask",0);live.begin();id=tp_f1_start(1,1000);for(int i=0;i<40;i++)assert(tp_f1_tap(id,1100+i*40));assert(live.megaTrainingCount()==0);assert(tp_f1_apply(id,11000)&&live.megaTrainingCount()==1);assert(tp_f1_finish(id,1));
 std::cout<<"F1 native passed: three isolated stat targets/costs/caps, native time/token/eligibility guards, no in-round rewards, exact rollback, zero-run neutrality, identity/records/old saves, no weight reinterpretation and one Mega credit.\n";
}
