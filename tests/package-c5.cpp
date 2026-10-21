#include <cassert>
#include <cstring>
#include <cstdlib>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Preferences prefs;
static Pet loaded(){
 Preferences::store().clear();prefs.putBool("init",true);prefs.putShort("dexn",1);prefs.putShort("eggT2",1);prefs.putUInt("age",540);prefs.putUChar("full",80);prefs.putUChar("joy",50);prefs.putUChar("ene",80);prefs.putUChar("hyg",80);prefs.putUChar("gatk",100);prefs.putUChar("gdef",100);prefs.putUChar("gspe",100);uint8_t bits[Pet::DEX_BITMAP_BYTES]={1};prefs.putBytes("dexreg",bits,sizeof(bits));Pet p;p.begin();p.setClock(100000);p.lastCareDay=1;return p;
}
int main(int argc,char**){
 Pet p=loaded();assert(p.journalSize()==0);p.caress();assert(p.journalJSON().find("\"k\":8")==std::string::npos);
 p.journalAdd(JR_RECORD,1,22);p.journalAdd(JR_EXPEDITION,2,1);p.setClock(100000);const auto count=p.journalSize();Pet q;q.begin();assert(q.journalSize()==count);
 q.rename("Altname");q.journalAdd(JR_LEVEL,25);q.rename("Neuname");assert(q.journalJSON().find("Altname")!=std::string::npos);
 // Delayed evolution is recorded once and survives a reload during animation.
 p=loaded();p.journalEvolution(1,2);assert(p.journalSize()==0);p.setClock(100000);Pet pending;pending.begin();pending.journalFinalize(0xffffffffUL);assert(pending.journalSize()==1);pending.journalEvolution(1,2);pending.journalFinalize(0xffffffffUL);assert(pending.journalSize()==1);
 p=loaded();p.ageMinutes=16*60;p.fullness=p.joy=p.energy=p.hygiene=80;p.evolve();p.journalFinalize(0xffffffffUL);assert(p.journalJSON().find("\"k\":3")!=std::string::npos);
 p=loaded();auto before=p.journalSize();p.registerCaught(37);auto first=p.journalSize();assert(first>before);p.registerCaught(37);assert(p.journalSize()==first);
 p=loaded();p.expeditionEndEpoch=100000;p.expeditionRewardItem=EXP_ITEM_ENERGY;assert(p.claimExpedition(100000)==EXP_ITEM_ENERGY);auto claimed=p.journalSize();assert(p.journalJSON().find("\"k\":7")!=std::string::npos);assert(p.claimExpedition(100000)==EXP_ITEM_NONE&&p.journalSize()==claimed);
 // No hidden species or shiny status is exposed by a new egg entry.
 p=loaded();p.newEgg();auto egg=p.journalJSON();assert(egg.find("\"k\":1,\"s\":0,\"a\":0,\"b\":0,\"f\":0,\"n\":\"\"")!=std::string::npos);p.eggTap();p.eggTap();p.eggTap();assert(p.journalJSON().find("\"k\":2")!=std::string::npos);
 p=loaded();for(int i=0;i<240;i++)p.journalAdd(JR_RECORD,0,i);assert(p.journalSize()==200);p.setClock(100000);Pet cap;cap.begin();assert(cap.journalSize()==200);
 // JSON text escapes are valid, nickname remains an event snapshot.
 p=loaded();p.rename("A\"B");p.journalAdd(JR_PERSONALITY,0,1);const auto json=p.journalJSON();assert(json.find("A\\\"B")!=std::string::npos);
 if(argc>1)std::cout<<json<<"\n";else std::cout<<"C5 journal passed: persistence, retention, old saves, first catches, name snapshots, delayed evolution and no egg spoilers.\n";
}
