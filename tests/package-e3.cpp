#include <cassert>
#include <ctime>
#include <cstring>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet live;Pet &tp_battle_pet(){return live;}
static bool fighting=false;extern "C" int tp_battle_is_open(){return fighting;}extern "C" int tp_wild_prompt_active(){return 0;}
extern "C" int tp_e_apply(int);extern "C" int tp_e_finish(int);extern "C" const char *tp_e_view();
static Pet load(int dex,unsigned version=3,unsigned mask=0,unsigned training=0,bool legacy=false){
 Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",dex);p.putShort("eggT2",303);p.putUInt("age",44*60);p.putUChar("gatk",100);p.putUChar("gdef",100);p.putUChar("gspe",100);p.putUChar("bond",80);p.putUChar("full",100);p.putUChar("joy",100);p.putUChar("ene",100);p.putUChar("hyg",100);p.putBool("shy",true);p.putUChar("mgver",version);p.putUChar("mgmask",mask);p.putUChar("mgtrain",training);p.putBool("mgstone",legacy);p.putString("nick","Fang");Pet out;out.begin();return out;
}
int main(int argc,char**){
 const uint32_t now=uint32_t(std::time(nullptr));Preferences prefs;const auto form=tpMegaById(3);assert(form&&form->dex==303&&form->stoneBit==4&&form->type1==TYPE_STEEL&&form->type2==TYPE_FAIRY);
 // All old E2 combinations remain exact and never gain the new bit.
 for(int dex:{6,376,303,-1})for(unsigned mask=0;mask<4;mask++){
  Pet p=load(dex,2,mask,2);assert(p.megaStoneMask()==mask);assert(p.megaTrainingCount()==((dex==6||dex==376)?2:0));p.setClock(now);assert(prefs.getUChar("mgver")==3&&prefs.getUChar("mgmask")==mask);
 }
 // Valid E2 active forms retain deadlines, cooldown and progress.
 for(int dex:{6,376}){
  Pet unused=load(dex,2,3,2);const uint8_t id=dex==6?1:2;const uint32_t start=now-100;
  prefs.putUChar("mgform",id);prefs.putUInt("mgstart",start);prefs.putUInt("mgend",start+900);prefs.putUInt("mgcool",start+4500);prefs.putUInt("mgseen",now-1);
  Pet p;p.begin();assert(p.megaActive(now)&&p.megaStoneMask()==3&&p.megaTrainingCount()==2);assert(p.megaEndsAt()==start+900&&p.megaCooldownAt()==start+4500);p.setClock(now);Pet q;q.begin();assert(q.megaActive(now)&&q.megaEndsAt()==start+900&&q.megaCooldownAt()==start+4500);
 }
 for(unsigned mask=0;mask<8;mask++)for(int dex:{6,376,303}){Pet p=load(dex,3,mask);const unsigned bit=dex==6?1:dex==376?2:4;assert(p.megaStoneMask()==mask&&p.megaStoneOwned()==bool(mask&bit));}
 Pet old=load(303,2,255,3,true);assert(old.megaStoneMask()==3&&!old.megaStoneOwned()&&old.megaTrainingCount()==0&&!old.megaActivate(now));
 Pet first=load(303,1,255,3,true);assert(first.megaStoneMask()==1&&!first.megaStoneOwned()&&first.megaTrainingCount()==0);
 Pet p=load(303,3,3);const auto raised=p.registeredCount();p.applyTypeResult(0);assert(p.megaTrainingCount()==0);p.applyTypeResult(1);p.applyMemoResult(1);p.trainStrength(1);p.fullness=p.joy=p.energy=p.hygiene=100;assert(p.megaQuestReady());assert(p.megaClaim(now)&&!p.megaClaim(now)&&p.megaStoneMask()==7);
 const auto atk=p.atkStat(),def=p.defStat(),spe=p.speStat();assert(p.megaActivate(now)&&p.megaFormId()==3);assert(p.megaAtk(now)==atk*160/100&&p.megaDef(now)==def*140/100&&p.megaSpe(now)==spe*125/100);assert(p.speciesId==303&&p.shiny&&std::strcmp(p.nick,"Fang")==0&&p.registeredCount()==raised);
 p.setClock(now);Pet reloaded;reloaded.begin();assert(reloaded.megaStoneMask()==7&&reloaded.megaActive(now+899));const auto n=reloaded.journalSize();reloaded.megaUpdate(now+900);assert(!reloaded.megaActive(now+900)&&reloaded.journalSize()==n+1);assert(reloaded.journalJSON().find("\"a\":3")!=std::string::npos);assert(!reloaded.megaActivate(now+4499)&&reloaded.megaActivate(now+4500));
 // Trainer-wide cooldown cannot be avoided by moving to an eligible new actor.
 Pet cooling=load(303,3,7);prefs.putUInt("mgcool",now+100);Pet blocked;blocked.begin();assert(!blocked.megaActivate(now));
 // Claim/activation share the existing reversible save transaction.
 live=load(303,3,3,3);const auto store=Preferences::store();assert(tp_e_apply(0)&&live.megaStoneMask()==7);assert(tp_e_finish(0)&&live.megaStoneMask()==3&&Preferences::store()==store);assert(tp_e_apply(0)&&tp_e_finish(1));assert(tp_e_apply(1)&&live.megaActive(now));assert(tp_e_finish(0)&&!live.megaActive(now)&&live.megaCooldownAt()==0&&live.megaStoneMask()==7);
 const std::string json=tp_e_view();assert(json.find("\"form\":3")!=std::string::npos&&json.find("Mega-Flunkifer")!=std::string::npos);
 if(argc>1){std::cout<<json;return 0;}
 std::cout<<"E3 core passed: E1/E2 exact migration, deadlines, 8 independent masks, no retro-progress, Flunkifer challenge/bonuses/identity/reload/cooldown/journal and transaction rollback.\n";
}
