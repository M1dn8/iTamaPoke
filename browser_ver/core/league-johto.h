#pragma once
#include "league-kanto.h"
// Ordered roster lists, not a reproduction of the original game's switching AI.
inline constexpr const char *kJohtoLeagueNames[]={"Willi","Koga","Bruno","Melanie","Siegfried"};
inline constexpr TPLeagueMon kJohtoElite[4][5]={
 {{178,40},{124,41},{103,41},{80,41},{178,42}},
 {{168,40},{49,41},{205,43},{89,42},{169,44}},
 {{237,42},{106,42},{107,42},{95,43},{68,46}},
 {{197,42},{45,42},{94,45},{198,44},{229,47}},
};
inline constexpr TPLeagueMon kJohtoChampion[]={{130,44},{149,47},{149,47},{142,46},{6,46},{149,50}};
inline constexpr unsigned kJohtoEliteOpponentCount=20;
inline constexpr unsigned kJohtoLeagueOpponentCount=26;
inline constexpr const TPLeagueMon *tpJohtoLeagueMonAt(unsigned index){return index<20?&kJohtoElite[index/5][index%5]:index<26?&kJohtoChampion[index-20]:nullptr;}
