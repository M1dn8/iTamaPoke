#pragma once
// Isolated pre-energy legacy suites retain their original scope; browser and
// dedicated energy tests use the actual policy and transaction path.
#if defined(__EMSCRIPTEN__) || defined(TP_BATTLE_ENERGY_TEST)
bool tpEnergyCan(unsigned kind);
bool tpEnergySpend(unsigned kind);
#else
inline bool tpEnergyCan(unsigned){return true;}
inline bool tpEnergySpend(unsigned){return true;}
#endif
