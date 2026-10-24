// Arena25 / entire Top Four50 / Champion30. Care reserve20, no combat changes.
#include <emscripten.h>
#include <string>
#include "pet.h"
#include "battle-energy.h"
extern Pet &tp_battle_pet();
extern "C" {uint32_t tp_f4_store_begin();int tp_f4_store_finish(uint32_t,int);int tp_f3_start(int);void tp_battle_close();}
namespace tp_energy_detail {
constexpr unsigned costs[]={25,50,30};
uint32_t arenaToken=0;int arenaSession=0;
}
bool tpEnergyCan(unsigned kind){return kind<3&&tp_battle_pet().energy>=tp_energy_detail::costs[kind]+20;}
bool tpEnergySpend(unsigned kind){if(!tpEnergyCan(kind))return false;auto&p=tp_battle_pet();p.energy=uint8_t(p.energy-tp_energy_detail::costs[kind]);Preferences().putUChar("ene",p.energy);return true;}
extern "C" {
EMSCRIPTEN_KEEPALIVE uint32_t tp_energy_arena_begin(int id){using namespace tp_energy_detail;if(arenaToken||!tpEnergyCan(0))return 0;uint32_t t=tp_f4_store_begin();if(!t)return 0;const int s=tp_f3_start(id);if(s<=0){tp_f4_store_finish(t,0);return 0;}arenaToken=t;arenaSession=s;return t;}
// Commit returns the original arena session token; rollback closes tentative combat.
EMSCRIPTEN_KEEPALIVE int tp_energy_arena_finish(uint32_t token,int commit){using namespace tp_energy_detail;if(!arenaToken||arenaToken!=token||(commit!=0&&commit!=1))return 0;const int s=arenaSession;if(!commit)tp_battle_close();if(!tp_f4_store_finish(token,commit))return 0;arenaToken=0;arenaSession=0;return commit?s:1;}
EMSCRIPTEN_KEEPALIVE const char *tp_energy_state(){static std::string out;const auto e=tp_battle_pet().energy;out="{\"energy\":"+std::to_string(e)+",\"reserve\":20";const char*names[]={"arena","elite","champ"};for(unsigned i=0;i<3;i++)out+=",\""+std::string(names[i])+"\":{\"cost\":"+std::to_string(tp_energy_detail::costs[i])+",\"required\":"+std::to_string(tp_energy_detail::costs[i]+20)+",\"can\":"+std::to_string(tpEnergyCan(i)?1:0)+"}";out+="}";return out.c_str();}
}
