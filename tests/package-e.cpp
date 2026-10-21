#include <cassert>
#include <ctime>
#include <cstring>
#include <iostream>
#include "pet.h"
#include "battle.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet live;Pet &tp_battle_pet(){return live;}
static bool fighting=false;extern "C" int tp_battle_is_open(){return fighting;}extern "C" int tp_wild_prompt_active(){return 0;}
extern "C" int tp_e_apply(int);extern "C" int tp_e_finish(int);
static Pet specimen(){Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",6);p.putShort("eggT2",4);p.putUInt("age",49*60);p.putUChar("gatk",100);p.putUChar("gdef",100);p.putUChar("gspe",100);p.putUChar("bond",80);p.putUChar("full",100);p.putUChar("joy",100);p.putUChar("ene",100);p.putUChar("hyg",100);p.putBool("shy",true);Pet pet;pet.begin();pet.rename("Testname");return pet;}
int main(){
 const uint32_t now=uint32_t(std::time(nullptr));Pet p=specimen();assert(p.megaSupported()&&!p.megaStoneOwned()&&p.megaTrainingCount()==0);
 p.applyTypeResult(0);assert(p.megaTrainingCount()==0);p.applyTypeResult(1);p.applyMemoResult(1);p.trainStrength(1);p.fullness=p.joy=p.energy=p.hygiene=100;assert(p.megaTrainingCount()==3&&p.megaQuestReady());
 assert(p.megaClaim(now));assert(!p.megaClaim(now));const auto normalAtk=p.atkStat(),normalDef=p.defStat(),normalSpe=p.speStat();const auto level=p.level();const auto reg=p.registeredCount();
 assert(p.megaActivate(now));assert(!p.megaActivate(now));assert(p.megaEndsAt()==now+900&&p.megaCooldownAt()==now+4500);assert(p.megaAtk(now)==normalAtk*160/100&&p.megaDef(now)==normalDef*140/100&&p.megaSpe(now)==normalSpe*125/100);
 assert(p.atkStat()==normalAtk&&p.speciesId==6&&p.level()==level&&p.registeredCount()==reg&&p.shiny&&std::strcmp(p.nick,"Testname")==0);
 p.setClock(now);Pet reload;reload.begin();assert(reload.megaActive(now+899));const auto entries=reload.journalSize();reload.megaUpdate(now+900);assert(!reload.megaActive(now+900)&&reload.journalSize()==entries+1);reload.megaUpdate(now+901);assert(reload.journalSize()==entries+1);assert(reload.megaAtk(now+901)==normalAtk);assert(!reload.megaActivate(now+4499));assert(reload.megaActivate(now+4500));
 reload.megaUpdate(now-10);assert(!reload.megaActive(now-10));assert(!reload.megaActivate(now-10));
 // New individual resets only challenge/form; trainer stone and cooldown survive.
 reload.release();g_millis+=10001;reload.update(g_millis);assert(reload.isEgg()&&(reload.megaStoneMask()&1)&&reload.megaTrainingCount()==0);
 // Claim and activate are reversible until the actual IndexedDB commit finishes.
 live=specimen();live.applyTypeResult(1);live.applyMemoResult(1);live.trainStrength(1);live.fullness=live.joy=live.energy=live.hygiene=100;live.setClock(now);
 const auto store=Preferences::store();assert(tp_e_apply(0)==1&&live.megaStoneOwned());assert(tp_e_finish(0)==1&&!live.megaStoneOwned());assert(Preferences::store()==store);
 assert(tp_e_apply(0)==1&&tp_e_finish(1)==1);assert(tp_e_apply(1)==1&&live.megaActive(now));assert(tp_e_finish(0)==1&&!live.megaActive(now));assert(live.megaCooldownAt()==0);
 fighting=true;assert(tp_e_apply(1)==0);fighting=false;
 // Combat benefit with identical enemy and luck, no permanent stat inflation.
 Pet fighter=specimen();fighter.applyTypeResult(1);fighter.applyMemoResult(1);fighter.trainStrength(1);fighter.fullness=fighter.joy=fighter.energy=fighter.hygiene=100;assert(fighter.megaClaim(now));
 BattleStats normal{};normal.level=fighter.level();normal.atk=fighter.atkStat();normal.def=fighter.defStat();normal.spe=fighter.speStat();normal.type1=TYPE_FIRE;normal.type2=TYPE_FLYING;
 assert(fighter.megaActivate(now));BattleStats mega=normal;mega.atk=fighter.megaAtk(now);mega.def=fighter.megaDef(now);mega.spe=fighter.megaSpe(now);mega.type2=TYPE_DRAGON;mega.mega=true;
 unsigned better=0;for(int dex:{1,3,9,25,68,94,130,143})for(unsigned luck=0;luck<100;luck++){
  auto enemy=wildBattleStats(dex,50);auto a=resolveBattle(normal,enemy,{uint8_t(luck)}),b=resolveBattle(mega,enemy,{uint8_t(luck)});if((b.playerWon&&!a.playerWon)||(b.playerWon&&a.playerWon&&b.rounds<a.rounds))better++;
 }
 assert(better>0);auto enemy=wildBattleStats(143,50);auto a=beginBattleRuntime(normal,enemy),b=beginBattleRuntime(mega,enemy);assert(b.playerMaxHp>a.playerMaxHp);auto turn=stepBattle(b,BATTLE_ATTACK_HEAVY,99);assert(turn.playerDamage<=b.enemyMaxHp*45/100);
 std::cout<<"E core passed: quest, one-shot stone, persistence/expiry/cooldown, rollback, shiny/name/identity; improved legacy simulation cases "<<better<<" / 800.\n";
}
