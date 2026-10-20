#include <cassert>
#include <cstring>
#include <cstdlib>
#include <iostream>
#include "pet.h"
#include "egg_plan_rules.h"
#include "evolution_rules.h"
uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t) {}

static Pet specimen() {
  Pet p;p.speciesId=1;p.bond=50;p.streak=7;p.ageMinutes=540;
  for(int d=1;d<=25;d++)p.dexReg[(d-1)>>3]|=1<<((d-1)&7);
  p.dexCaught[0]=4;
  return p;
}
static int16_t legacyPick(Pet &p) {
  if(p.registeredCount()==0)return CLASSIC_DEX[random(NUM_CLASSIC_DEX)];
  uint8_t tier=R_COMUN;
  if(p.lastEnd!=CER_RUNAWAY){bool blessed=p.lastEnd==CER_FAREWELL;int rare=(blessed?45:27)+p.careBonus();int leg=p.registeredCount()>=25?(blessed?10:3)+p.careBonus()/3:0;int r=random(100);if(r<leg)tier=R_LEGENDARIO;else if(r<leg+rare)tier=R_RARO;}
  for(int pass=0;pass<2;pass++)for(int t=tier;t>=R_COMUN;t--){int16_t cand[DEX_COUNT];int n=0;for(int16_t d=1;d<=DEX_COUNT;d++){if(!TP_EGG_ELIGIBLE[d]||DEX_TBL[d].rarity!=t)continue;if(pass==0&&!p.lineHasUnregistered(d))continue;cand[n++]=d;}if(n>0)return cand[random(n)];}
  return CLASSIC_DEX[random(NUM_CLASSIC_DEX)];
}
int main(){
  assert(tpEggGeneration(1)==1&&tpEggGeneration(151)==1&&tpEggGeneration(152)==2);
  assert(tpEggGeneration(905)==8&&tpEggGeneration(906)==9&&tpEggGeneration(1025)==9&&tpEggGeneration(1026)==0);
  assert(tpEggPlanWeight(906,TYPE_GRASS,TYPE_NONE,0,0,false,false)==1);
  assert(tpEggPlanWeight(906,TYPE_GRASS,TYPE_NONE,9,TYPE_GRASS,true,false)==27);
  assert(tpEggPlanWeight(906,TYPE_GRASS,TYPE_NONE,9,TYPE_GRASS,true,true)==9);
  Preferences::store().clear();Pet p=specimen();auto before=p;
  assert(p.setEggPlan(9,TYPE_GRASS,true));assert(!p.setEggPlan(10,TYPE_GRASS,true));assert(!p.setEggPlan(9,19,true));
  assert(p.speciesId==before.speciesId&&p.ageMinutes==before.ageMinutes&&p.bond==before.bond&&p.streak==before.streak);
  assert(std::memcmp(p.dexReg,before.dexReg,sizeof(p.dexReg))==0&&std::memcmp(p.dexCaught,before.dexCaught,sizeof(p.dexCaught))==0);
  p.setClock(100000);Preferences prefs;prefs.putBool("init",true);Pet q;q.begin();
  assert(q.eggPlanGeneration()==9&&q.eggPlanType()==TYPE_GRASS&&q.eggPlanUnraised());
  for(int i=0;i<100;i++)q.pickEggSpecies();assert(q.eggPlanGeneration()==9);
  q.newEgg();assert(q.isEgg()&&q.eggPlanGeneration()==0&&q.eggPlanType()==0&&!q.eggPlanUnraised());
  assert(q.usedEggPlanGeneration()==9&&q.usedEggPlanType()==TYPE_GRASS&&q.usedEggPlanUnraised());
  assert(!q.setEggPlan(1,TYPE_FIRE,false));const int target=prefs.getShort("eggT2",0);const bool shiny=prefs.getBool("eshy",false);
  Pet reloaded;reloaded.begin();assert(prefs.getShort("eggT2",0)==target&&prefs.getBool("eshy",false)==shiny);
  assert(reloaded.usedEggPlanGeneration()==9&&reloaded.eggPlanGeneration()==0);
  reloaded.eggTap();reloaded.eggTap();reloaded.eggTap();assert(reloaded.speciesId==target);
  assert(reloaded.registeredCount()==25+(before.isRegistered(target)?0:1));
  Pet plain=specimen(),planned=specimen();planned.setEggPlan(9,TYPE_GRASS,true);
  int plainGen=0,planGen=0,plainGrass=0,planGrass=0;
  for(int seed=0;seed<4096;seed++){
    std::srand(seed);int a=plain.pickEggSpecies();std::srand(seed);int old=legacyPick(plain);assert(a==old);
    std::srand(seed);int b=planned.pickEggSpecies();assert(TP_EGG_ELIGIBLE[b]&&DEX_TBL[a].rarity==DEX_TBL[b].rarity);
    plainGen+=tpEggGeneration(a)==9;planGen+=tpEggGeneration(b)==9;
    plainGrass+=DEX_TBL[a].type1==TYPE_GRASS||DEX_TBL[a].type2==TYPE_GRASS;planGrass+=DEX_TBL[b].type1==TYPE_GRASS||DEX_TBL[b].type2==TYPE_GRASS;
  }
  assert(planGen>plainGen&&planGrass>plainGrass);
  for(int seed=0;seed<128;seed++){
    Pet a=specimen(),b=specimen();b.setEggPlan(9,TYPE_GRASS,true);
    std::srand(seed);a.newEgg();bool sa=prefs.getBool("eshy",false);std::srand(seed);b.newEgg();assert(sa==prefs.getBool("eshy",false));
  }
  Pet runaway=specimen();runaway.lastEnd=CER_RUNAWAY;runaway.setEggPlan(9,TYPE_GRASS,true);
  for(int i=0;i<256;i++)assert(DEX_TBL[runaway.pickEggSpecies()].rarity==R_COMUN);
  Preferences::store().clear();prefs.putBool("init",true);prefs.putShort("dexn",1);prefs.putShort("eggT2",1);Pet old;old.begin();assert(old.eggPlanGeneration()==0&&old.eggPlanType()==0&&!old.eggPlanUnraised());
  prefs.putUChar("eggen",250);prefs.putUChar("egtyp",250);Pet corrupt;corrupt.begin();assert(corrupt.eggPlanGeneration()==0&&corrupt.eggPlanType()==0);
  std::cout<<"C1 passed: default compatibility, persistence, one-shot consumption, unchanged rarity/Shiny, collection preservation.\n";
  std::cout<<"Sampling 4096 seeds: gen9 "<<plainGen<<" -> "<<planGen<<", grass "<<plainGrass<<" -> "<<planGrass<<"\n";
}
