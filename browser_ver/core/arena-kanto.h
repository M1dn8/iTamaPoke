#pragma once
// Initial Kanto Gym teams, Pokemon Red/Blue; no Yellow or rematches.
// Sources and limitations: docs/PAKET-F3-ARENA.md.
#include <cstdint>
struct TPArenaMember { int16_t dex; uint8_t level; };
struct TPArenaLeader { const char *id,*name,*city,*badge; uint8_t count; TPArenaMember team[6]; };
constexpr TPArenaLeader kKantoArenas[] = {
 {"rocko","Rocko","Marmoria City","Felsorden",2,{{74,12},{95,14}}},
 {"misty","Misty","Azuria City","Quellorden",2,{{120,18},{121,21}}},
 {"major-bob","Major Bob","Orania City","Donnerorden",3,{{100,21},{25,18},{26,24}}},
 {"erika","Erika","Prismania City","Farborden",3,{{71,29},{114,24},{45,29}}},
 {"koga","Koga","Fuchsania City","Seelenorden",4,{{109,37},{89,39},{109,37},{110,43}}},
 {"sabrina","Sabrina","Saffronia City","Sumpforden",4,{{64,38},{122,37},{49,38},{65,43}}},
 {"pyro","Pyro","Zinnoberinsel","Vulkanorden",4,{{58,42},{77,40},{78,42},{59,47}}},
 {"giovanni","Giovanni","Vertania City","Erdorden",5,{{111,45},{51,42},{31,44},{34,45},{112,50}}},
};
constexpr unsigned kKantoArenaCount=sizeof(kKantoArenas)/sizeof(kKantoArenas[0]);
