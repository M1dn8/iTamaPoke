#include <cassert>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <tuple>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet hero;Pet &tp_battle_pet(){return hero;}
static bool fighting=false,wild=false;
extern "C" int tp_battle_is_open(){return fighting;}extern "C" int tp_wild_prompt_active(){return wild;}
#include "../browser_ver/core/browser_reward_egg.cpp"
extern "C" int tp_f4_life_end(uint32_t,int,int,uint32_t);
static void setup(){
 assert(!tp_f4_store_pending());(void)tp_region_rg_pending_region();Preferences::store().clear();Preferences p;
 p.putBool("init",true);p.putShort("dexn",376);p.putShort("eggT2",376);p.putUInt("age",5940);for(const char*k:{"full","joy","ene","hyg","bond","gatk","gdef","gspe"})p.putUChar(k,100);
 uint8_t reg[129]{};reg[0]=1;reg[(376-1)>>3]|=uint8_t(1u<<((376-1)&7));p.putBytes("dexreg",reg,sizeof(reg));p.putUChar("f4lver",1);p.putUInt("f4life",1);p.putUChar("mgver",3);
 p.putUChar("lgver",1);p.putBool("lgkdone",true);p.putUInt("lgkdate",1700000000);p.putUChar("jlgver",1);p.putBool("jlgdone",true);p.putUInt("jlgdate",1700000010);
 const char model[]="opaque native transport fixture";p.putBytes("f4col",model,sizeof(model)-1);g_millis=1000;fighting=wild=false;hero=Pet();hero.begin();hero.setClock(1700000100);hero.rename("Bleibt aktiv");
}
static tp_reward_detail::Reward value(int r){tp_reward_detail::Reward q;assert(tp_reward_detail::load(q,r));return q;}
static void operation(int region,int op,int dex=0){const auto t=tp_region_rg_prepare(region,op,dex);assert(t);assert(tp_region_rg_finish(region,t,1));}
static void hatch(){assert(hero.isEgg());hero.eggTap();hero.eggTap();hero.eggTap();assert(!hero.isEgg());}
int main(int argc,char**){
 setup();const std::string kView=tp_rg_view(),jView=tp_region_rg_view(1);unsigned candidates=0;for(int d=1;d<=1025;d++){
  const bool old=d<=151&&d!=132&&TP_EGG_ELIGIBLE[d]&&DEX_TBL[d].rarity!=R_LEGENDARIO;assert(bool(tp_rg_allowed(d))==old);if(tp_region_rg_allowed(1,d))candidates++;
 }assert(candidates==47);for(int d:{152,155,158,172})assert(tp_region_rg_allowed(1,d));for(int d:{0,1,4,151,153,160,201,243,244,245,249,250,251,252,1025})assert(!tp_region_rg_allowed(1,d));
 for(int region:{-1,2,256}){auto before=Preferences::store();assert(!tp_region_rg_prepare(region,0,152)&&Preferences::store()==before);assert(!tp_region_rg_allowed(region,152));}
 Preferences().putBool("jlgdone",false);auto before=Preferences::store();assert(!tp_region_rg_prepare(1,0,152)&&Preferences::store()==before);Preferences().putBool("jlgdone",true);
 const auto dex=hero.speciesId;const auto age=hero.ageMinutes;const auto genes=std::make_tuple(hero.geneAtk,hero.geneDef,hero.geneSpe);operation(0,0,4);
 before=Preferences::store();auto t=tp_region_rg_prepare(1,0,152);assert(t&&tp_region_rg_pending_region()==1&&!tp_region_rg_finish(0,t,1));assert(!tp_rg_prepare(0,7));assert(tp_region_rg_finish(1,t,0)&&Preferences::store()==before);
 operation(1,0,152);assert(value(0).dex==4&&value(1).dex==152);assert(!tp_region_rg_prepare(1,0,158));
 t=tp_rg_prepare(1,0);assert(t);assert(tp_f4_store_finish(t,1));assert(tp_region_rg_pending_region()==-1);before=Preferences::store();assert(!tp_region_rg_prepare(1,1,0)&&Preferences::store()==before);
 operation(0,2);operation(1,1);assert(value(0).state==1&&value(1).state==2);before=Preferences::store();assert(!tp_rg_prepare(1,0)&&Preferences::store()==before);assert(hero.speciesId==dex&&hero.ageMinutes==age&&std::make_tuple(hero.geneAtk,hero.geneDef,hero.geneSpe)==genes);
 assert(hero.setEggPlan(9,TYPE_GRASS,true));t=tp_f4_store_begin();assert(t&&tp_f4_life_end(t,1,1,g_millis));assert(tp_f4_store_finish(t,0));assert(hero.ceremony==CER_NONE&&value(1).state==2&&tp_reward_detail::life()==1);
 t=tp_f4_store_begin();assert(t&&tp_f4_life_end(t,1,1,g_millis)&&tp_f4_store_finish(t,1));assert(hero.ceremony==CER_RELEASE);
 // Actual ceremony completion calls Pet::newEgg and the existing reward hook.
 before=Preferences::store();t=tp_f4_store_begin();assert(t);g_millis+=60000;assert(hero.update(g_millis));assert(hero.isEgg()&&value(1).state==3&&tp_reward_detail::life()==2);assert(tp_f4_store_finish(t,0)&&Preferences::store()==before&&value(1).state==2&&tp_reward_detail::life()==1);
 t=tp_f4_store_begin();assert(t);g_millis++;assert(hero.update(g_millis));assert(tp_f4_store_finish(t,1));assert(hero.isEgg()&&Preferences().getShort("eggT2",0)==152&&value(1).born==2&&value(0).state==1);
 assert(hero.eggPlanGeneration()==9&&hero.eggPlanType()==TYPE_GRASS&&hero.eggPlanUnraised()&&hero.usedEggPlanGeneration()==0);
 hero=Pet();hero.begin();assert(hero.isEgg()&&value(1).state==3);hatch();assert(hero.speciesId==152&&hero.shiny&&hero.geneAtk>=90&&hero.geneAtk<=110&&hero.geneDef>=90&&hero.geneDef<=110&&hero.geneSpe>=90&&hero.geneSpe<=110);assert(!tp_region_rg_prepare(1,0,155)&&!tp_region_rg_prepare(1,1,0));
 operation(0,1);hero.newEgg();assert(value(0).state==3&&value(0).born==3&&value(1).born==2&&Preferences().getShort("eggT2",0)==4);hatch();assert(hero.speciesId==4&&hero.shiny);hero.newEgg();assert(value(0).born==3&&value(1).born==2);
 // A legacy direct finish must not leave ownership attached to another later F4 transaction.
 setup();t=tp_rg_prepare(0,4);assert(t&&tp_f4_store_finish(t,1));const auto regular=tp_f4_store_begin();assert(regular&&tp_region_rg_pending_region()==-1);assert(!tp_region_rg_finish(0,t,1)&&tp_f4_store_pending_token()==regular);assert(tp_f4_store_finish(regular,0));
 setup();operation(0,0,4);operation(1,0,152);tp_reward_detail::Reward a=value(0),b=value(1);a.state=b.state=2;a.armed=b.armed=1;tp_reward_detail::save(a,0);tp_reward_detail::save(b,1);Preferences().putUInt("f4life",2);before=Preferences::store();int16_t target=133;bool shiny=false;assert(!tpRewardEggConsume(target,shiny)&&target==133&&!shiny&&Preferences::store()==before);assert(std::string(tp_region_rg_view(1)).find("\"queueConflict\":1")!=std::string::npos);
 setup();operation(0,0,4);operation(0,1);Preferences().putUChar("jrkver",2);Preferences().putUInt("f4life",2);before=Preferences::store();target=133;shiny=false;assert(!tpRewardEggConsume(target,shiny)&&target==133&&!shiny&&Preferences::store()==before);operation(0,2);assert(value(0).state==1);before=Preferences::store();assert(!tp_rg_prepare(1,0)&&Preferences::store()==before);
 setup();operation(1,0,155);before=Preferences::store();fighting=true;assert(!tp_region_rg_prepare(1,1,0)&&Preferences::store()==before);fighting=false;wild=true;assert(!tp_region_rg_prepare(1,1,0));wild=false;
 bool ordinaryGenes=false;
 for(unsigned seed=0;seed<256;seed++){
  setup();assert(hero.setEggPlan(9,TYPE_GRASS,true));std::srand(seed);hero.newEgg();hatch();const auto expected=std::make_tuple(hero.geneAtk,hero.geneDef,hero.geneSpe);
  setup();assert(hero.setEggPlan(9,TYPE_GRASS,true));operation(1,0,158);operation(1,1);std::srand(seed);hero.newEgg();hatch();assert(hero.speciesId==158&&hero.shiny&&std::make_tuple(hero.geneAtk,hero.geneDef,hero.geneSpe)==expected);assert(hero.trAtk==0&&hero.trDef==0&&hero.trSpe==0);if(hero.geneAtk!=110||hero.geneDef!=110||hero.geneSpe!=110)ordinaryGenes=true;
 }assert(ordinaryGenes);
 if(argc>1){std::cout<<"{\"kanto\":"<<kView<<",\"johto\":"<<jView<<"}\n";return 0;}
 std::cout<<"Regional reward native passed: unchanged Kanto choices, 47 Johto base choices, independent immutable selections, one cross-region next-egg slot, region/token ownership, exact rollback, real release->newEgg->shiny hatch, two separate once-only births, plan preservation, 256 ordinary gene/RNG comparisons, corrupt double-arm/future refusal and no active replacement. Eligibility flags are fixtures; actual league completion is covered separately.\n";
}
