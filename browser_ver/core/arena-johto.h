#pragma once
#include "arena-kanto.h"
// First Johto gym encounters in Gold/Silver; no remake/rematch data.
// Sources and interpretation: docs/REGIONEN-BASIS.md, step 3.
inline constexpr TPArenaLeader kJohtoArenas[] = {
 {"falk","Falk","Viola City","Flügelorden",2,{{16,7},{17,9}}},
 {"kai","Kai","Azalea City","Insektorden",3,{{11,14},{14,14},{123,16}}},
 {"bianka","Bianka","Dukatia City","Basisorden",2,{{35,18},{241,20}}},
 {"jens","Jens","Teak City","Phantomorden",4,{{92,21},{93,21},{93,23},{94,25}}},
 {"hartwig","Hartwig","Anemonia City","Faustorden",2,{{57,27},{62,30}}},
 {"jasmin","Jasmin","Oliviana City","Stahlorden",3,{{81,30},{81,30},{208,35}}},
 {"norbert","Norbert","Mahagonia City","Eisorden",3,{{86,27},{87,29},{221,31}}},
 {"sandra","Sandra","Ebenholz City","Drachenorden",4,{{148,37},{148,37},{148,37},{230,40}}},
};
inline constexpr unsigned kJohtoArenaCount=sizeof(kJohtoArenas)/sizeof(kJohtoArenas[0]);
inline constexpr const TPArenaLeader *tpJohtoArenaAt(unsigned index){return index<kJohtoArenaCount?&kJohtoArenas[index]:nullptr;}
