#pragma once
#include <stdint.h>
// Browser gift override only. All isolated legacy builds keep their exact path.
#if defined(__EMSCRIPTEN__) || defined(TP_REWARD_EGG_TEST)
bool tpRewardEggConsume(int16_t &target,bool &shiny);
#else
inline bool tpRewardEggConsume(int16_t&,bool&){return false;}
#endif
