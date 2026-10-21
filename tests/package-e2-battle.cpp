#include <cassert>
#include <ctime>
#include <iostream>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet live;Pet &tp_battle_pet(){return live;}
extern "C" int tp_is_egg(){return live.isEgg();}extern "C" int tp_sleeping(){return live.sleeping;}extern "C" int tp_species_id(){return live.speciesId;}extern "C" int tp_level(){return live.level();}
#include "../browser_ver/core/browser_battle.cpp"
int main(){
 const uint32_t now=uint32_t(std::time(nullptr));Preferences::store().clear();live.speciesId=376;live.ageMinutes=49*60;live.bond=80;live.fullness=live.joy=live.energy=live.hygiene=100;
 live.applyTypeResult(1);live.applyMemoResult(1);live.trainStrength(1);live.fullness=live.joy=live.energy=live.hygiene=100;assert(live.megaClaim(now));
 const auto base=live.atkStat();assert(live.megaActivate(now));startBattle(143,50);assert(gPlayer.mega&&gPlayer.atk==base*160/100&&gPlayer.type2==TYPE_PSYCHIC&&gPlayer.type1==TYPE_STEEL&&gPlayerMegaForm==2);assert(tp_e_battle_mega()&&tp_e_battle_form()==2);
 const auto snapshot=gPlayer.atk;live.megaUpdate(now+900);assert(!live.megaActive(now+900));assert(gPlayer.atk==snapshot&&tp_e_battle_mega());tp_battle_close();assert(!tp_e_battle_mega());startBattle(143,50);assert(!gPlayer.mega&&gPlayer.atk==live.atkStat()&&gPlayer.type2==TYPE_PSYCHIC&&gPlayer.type1==TYPE_STEEL&&gPlayerMegaForm==0);
 unsigned improved=0;BattleStats normal=gPlayer,mega=normal;mega.atk=normal.atk*160/100;mega.def=normal.def*140/100;mega.spe=normal.spe*125/100;mega.type2=TYPE_PSYCHIC;mega.mega=true;
 for(int dex:{1,3,9,25,68,94,130,143})for(unsigned seed=0;seed<100;seed++){
  auto enemy=wildBattleStats(dex,50);auto a=beginBattleRuntime(normal,enemy),b=beginBattleRuntime(mega,enemy);BattleTurnResult ta{},tb{};
  for(unsigned turn=0;turn<20;turn++){const auto luck=uint8_t((seed+turn*37)%100);if(!ta.battleEnded)ta=stepBattle(a,BATTLE_ATTACK_HEAVY,luck);if(!tb.battleEnded)tb=stepBattle(b,BATTLE_ATTACK_HEAVY,luck);}
  if((tb.playerWon&&!ta.playerWon)||(ta.playerWon&&tb.playerWon&&b.round<a.round)||b.playerHp*uint32_t(a.playerMaxHp)>a.playerHp*uint32_t(b.playerMaxHp))improved++;
 }
 assert(improved>0);std::cout<<"E2 Metagross browser-battle bridge passed: real bonus/type snapshot, expiry grace, next battle normal; improved turn-engine cases "<<improved<<" / 800.\n";
}
