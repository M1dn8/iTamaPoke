#include <cassert>
#include <ctime>
#include <cstring>
#include <iostream>
#include "pet.h"
#include "battle.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet live;Pet &tp_battle_pet(){return live;}
static bool fighting=false;extern "C" int tp_battle_is_open(){return fighting;}extern "C" int tp_wild_prompt_active(){return 0;}
extern "C" int tp_e_apply(int);extern "C" int tp_e_finish(int);extern "C" const char *tp_e_view();
static Pet load(int dex,unsigned version=0,unsigned mask=0,unsigned training=0,bool legacyStone=false){
 Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",dex);p.putShort("eggT2",374);p.putUInt("age",44*60);p.putUChar("gatk",100);p.putUChar("gdef",100);p.putUChar("gspe",100);p.putUChar("bond",80);p.putUChar("full",100);p.putUChar("joy",100);p.putUChar("ene",100);p.putUChar("hyg",100);p.putBool("shy",true);p.putUChar("mgver",version);p.putUChar("mgmask",mask);p.putUChar("mgtrain",training);p.putBool("mgstone",legacyStone);p.putString("nick","Metallfreund");Pet out;out.begin();return out;
}
int main(int argc,char**){
 const uint32_t now=uint32_t(std::time(nullptr));assert(tpMegaById(1)->dex==6&&tpMegaById(2)->dex==376);assert(tpMegaById(2)->type1==TYPE_STEEL&&tpMegaById(2)->type2==TYPE_PSYCHIC);
 // Existing E1 Glurak unlock, progress and running deadlines survive exactly.
 Pet old=load(6,1,0,2,true);Preferences prefs;const uint32_t start=now-100;prefs.putUChar("mgform",1);prefs.putUInt("mgstart",start);prefs.putUInt("mgend",start+900);prefs.putUInt("mgcool",start+4500);prefs.putUInt("mgseen",now-1);
 Pet migrated;migrated.begin();assert(migrated.megaStoneMask()==1&&migrated.megaTrainingCount()==2&&migrated.megaActive(now));assert(migrated.megaEndsAt()==start+900&&migrated.megaCooldownAt()==start+4500);migrated.setClock(now);assert(prefs.getUChar("mgver")==3&&prefs.getUChar("mgmask")==1);
 // A Glurak stone never unlocks Metagross. E1 progress cannot be retro-credited.
 Pet meta=load(376,1,0,3,true);assert(meta.megaSupported()&&meta.megaFormId()==2&&meta.megaStoneMask()==1&&!meta.megaStoneOwned()&&meta.megaTrainingCount()==0&&!meta.megaActivate(now));
 meta.applyTypeResult(1);meta.applyMemoResult(1);meta.trainStrength(1);meta.fullness=meta.joy=meta.energy=meta.hygiene=100;assert(meta.megaQuestReady());assert(meta.megaClaim(now)&&!meta.megaClaim(now)&&meta.megaStoneMask()==3);
 const auto atk=meta.atkStat(),def=meta.defStat(),spe=meta.speStat();const auto count=meta.registeredCount();assert(meta.megaActivate(now));assert(meta.megaAtk(now)==atk*160/100&&meta.megaDef(now)==def*140/100&&meta.megaSpe(now)==spe*125/100);
 assert(meta.speciesId==376&&meta.registeredCount()==count&&meta.shiny&&std::strcmp(meta.nick,"Metallfreund")==0);meta.setClock(now);Pet restored;restored.begin();assert(restored.megaStoneMask()==3&&restored.megaActive(now+899));
 const auto entries=restored.journalSize();restored.megaUpdate(now+900);assert(!restored.megaActive(now+900)&&restored.journalSize()==entries+1);assert(restored.journalJSON().find("\"a\":2")!=std::string::npos);assert(!restored.megaActivate(now+4499)&&restored.megaActivate(now+4500));
 // Actual normal Metang -> Metagross evolution, with no save replacement/identity loss.
 Pet metang=load(375,2,1);assert(!metang.megaSupported());metang.applyTypeResult(1);assert(metang.megaTrainingCount()==0);assert(metang.evolveTo(376));assert(metang.megaSupported()&&metang.megaFormId()==2&&!metang.megaStoneOwned()&&metang.megaTrainingCount()==0);assert(metang.shiny&&std::strcmp(metang.nick,"Metallfreund")==0&&metang.megaStoneMask()==1);
 // Separate mask is part of the same reversible IndexedDB transaction protocol.
 live=load(376,2,1,3);const auto store=Preferences::store();assert(tp_e_apply(0)&&live.megaStoneMask()==3);assert(tp_e_finish(0)&&live.megaStoneMask()==1);assert(store==Preferences::store());assert(tp_e_apply(0)&&tp_e_finish(1));assert(tp_e_apply(1)&&live.megaActive(now));assert(tp_e_finish(0)&&!live.megaActive(now)&&live.megaCooldownAt()==0&&live.megaStoneMask()==3);
 const std::string json=tp_e_view();assert(json.find("\"form\":2")!=std::string::npos&&json.find("Mega-Metagross")!=std::string::npos);
 Pet onlyMeta=load(6,2,2,3);assert(onlyMeta.megaStoneMask()==2&&!onlyMeta.megaStoneOwned()&&!onlyMeta.megaActivate(now));
 Pet both=load(376,2,3);assert(both.megaStoneOwned()&&both.megaStoneMask()==3);
 if(argc>1){std::cout<<tp_e_view();return 0;}
 std::cout<<"E2 core passed: exact E1 migration, independent stones, natural Metang evolution, Metagross bonuses/types, expiry/reload, identity and rollback.\n";
}
