#include <emscripten.h>
#include "pet.h"
extern Pet &tp_battle_pet();
extern "C" {
EMSCRIPTEN_KEEPALIVE int tp_egg_plan_can_set() { return tp_battle_pet().canSetEggPlan(); }
EMSCRIPTEN_KEEPALIVE int tp_egg_plan_generation() { return tp_battle_pet().eggPlanGeneration(); }
EMSCRIPTEN_KEEPALIVE int tp_egg_plan_type() { return tp_battle_pet().eggPlanType(); }
EMSCRIPTEN_KEEPALIVE int tp_egg_plan_unraised() { return tp_battle_pet().eggPlanUnraised(); }
EMSCRIPTEN_KEEPALIVE int tp_egg_used_generation() { return tp_battle_pet().usedEggPlanGeneration(); }
EMSCRIPTEN_KEEPALIVE int tp_egg_used_type() { return tp_battle_pet().usedEggPlanType(); }
EMSCRIPTEN_KEEPALIVE int tp_egg_used_unraised() { return tp_battle_pet().usedEggPlanUnraised(); }
EMSCRIPTEN_KEEPALIVE int tp_egg_plan_set(int generation,int type,int unraised) {
  if(generation<0||generation>9||type<0||type>TYPE_FAIRY||(unraised!=0&&unraised!=1))return 0;
  return tp_battle_pet().setEggPlan(uint8_t(generation),uint8_t(type),unraised!=0);
}
}
