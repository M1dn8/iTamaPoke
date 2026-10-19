#pragma once
#include <stdint.h>

// GENERADO por tools/gen_dex.py desde tools/dex_data.py - no editar

#define DEX_COUNT 1025
#define DEX_EEVEE 133  // rama al azar: 134/135/136

#define DEX_LANG_COUNT 7

// rareza: 0 = solo por evolucion, 1 = comun, 2 = raro, 3 = legendario
enum : uint8_t { R_EVO = 0, R_COMUN, R_RARO, R_LEGENDARIO };

// tipos de combate: datos actuales de PokeAPI para las 151 especies Kanto
enum : uint8_t {
  TYPE_NONE = 0, TYPE_NORMAL, TYPE_FIRE, TYPE_WATER, TYPE_ELECTRIC, TYPE_GRASS,
  TYPE_ICE, TYPE_FIGHTING, TYPE_POISON, TYPE_GROUND, TYPE_FLYING, TYPE_PSYCHIC,
  TYPE_BUG, TYPE_ROCK, TYPE_GHOST, TYPE_DRAGON, TYPE_DARK, TYPE_STEEL, TYPE_FAIRY
};

struct DexEntry {
  const char *name;
  uint16_t evolvesTo;   // numero de dex, 0 = forma final (>255 con gen 3)
  uint8_t evolveLevel;
  uint8_t rarity;       // sale de huevo si > 0
  uint16_t accent;      // color RGB565 del tipo para la UI
  uint8_t bHp, bAtk, bDef, bSpe;  // base stats reales de gen 1
  uint8_t type1, type2; // tipos de combate, TYPE_NONE si no hay secundario
  uint8_t biome;        // 0 pradera 1 playa 2 bosque 3 volcan 4 montana 5 nieve
};

static const DexEntry DEX_TBL[DEX_COUNT + 1] = {
  { "?", 0, 0, 0, 0x2946, 50, 50, 50, 50, TYPE_NONE, TYPE_NONE, 0 },  // 0: sin usar
  { "BULBASAUR", 2, 16, R_COMUN, 0x3C49, 45, 49, 49, 45, TYPE_GRASS, TYPE_POISON, 2 },  // 1 grass/poison
  { "IVYSAUR", 3, 32, R_EVO, 0x3C49, 60, 62, 63, 60, TYPE_GRASS, TYPE_POISON, 2 },  // 2 grass/poison
  { "VENUSAUR", 0, 0, R_EVO, 0x3C49, 80, 82, 83, 80, TYPE_GRASS, TYPE_POISON, 2 },  // 3 grass/poison
  { "CHARMANDER", 5, 16, R_COMUN, 0xEA87, 39, 52, 43, 65, TYPE_FIRE, TYPE_NONE, 3 },  // 4 fire
  { "CHARMELEON", 6, 36, R_EVO, 0xEA87, 58, 64, 58, 80, TYPE_FIRE, TYPE_NONE, 3 },  // 5 fire
  { "CHARIZARD", 0, 0, R_EVO, 0xEA87, 78, 84, 78, 100, TYPE_FIRE, TYPE_FLYING, 3 },  // 6 fire/flying
  { "SQUIRTLE", 8, 16, R_COMUN, 0x4C98, 44, 48, 65, 43, TYPE_WATER, TYPE_NONE, 1 },  // 7 water
  { "WARTORTLE", 9, 36, R_EVO, 0x4C98, 59, 63, 80, 58, TYPE_WATER, TYPE_NONE, 1 },  // 8 water
  { "BLASTOISE", 0, 0, R_EVO, 0x4C98, 79, 83, 100, 78, TYPE_WATER, TYPE_NONE, 1 },  // 9 water
  { "CATERPIE", 11, 7, R_COMUN, 0x7CC4, 45, 30, 35, 45, TYPE_BUG, TYPE_NONE, 2 },  // 10 bug
  { "METAPOD", 12, 10, R_EVO, 0x7CC4, 50, 20, 55, 30, TYPE_BUG, TYPE_NONE, 2 },  // 11 bug
  { "BUTTERFREE", 0, 0, R_EVO, 0x7CC4, 60, 45, 50, 70, TYPE_BUG, TYPE_FLYING, 2 },  // 12 bug/flying
  { "WEEDLE", 14, 7, R_COMUN, 0x7CC4, 40, 35, 30, 50, TYPE_BUG, TYPE_POISON, 2 },  // 13 bug/poison
  { "KAKUNA", 15, 10, R_EVO, 0x7CC4, 45, 25, 50, 35, TYPE_BUG, TYPE_POISON, 2 },  // 14 bug/poison
  { "BEEDRILL", 0, 0, R_EVO, 0x7CC4, 65, 90, 40, 75, TYPE_BUG, TYPE_POISON, 2 },  // 15 bug/poison
  { "PIDGEY", 17, 18, R_COMUN, 0x8C4D, 40, 45, 40, 56, TYPE_NORMAL, TYPE_FLYING, 0 },  // 16 normal/flying
  { "PIDGEOTTO", 18, 36, R_EVO, 0x8C4D, 63, 60, 55, 71, TYPE_NORMAL, TYPE_FLYING, 0 },  // 17 normal/flying
  { "PIDGEOT", 0, 0, R_EVO, 0x8C4D, 83, 80, 75, 101, TYPE_NORMAL, TYPE_FLYING, 0 },  // 18 normal/flying
  { "RATTATA", 20, 20, R_COMUN, 0x8C4D, 30, 56, 35, 72, TYPE_NORMAL, TYPE_NONE, 0 },  // 19 normal
  { "RATICATE", 0, 0, R_EVO, 0x8C4D, 55, 81, 60, 97, TYPE_NORMAL, TYPE_NONE, 0 },  // 20 normal
  { "SPEAROW", 22, 20, R_COMUN, 0x8C4D, 40, 60, 30, 70, TYPE_NORMAL, TYPE_FLYING, 0 },  // 21 normal/flying
  { "FEAROW", 0, 0, R_EVO, 0x8C4D, 65, 90, 65, 100, TYPE_NORMAL, TYPE_FLYING, 0 },  // 22 normal/flying
  { "EKANS", 24, 22, R_COMUN, 0x8A73, 35, 60, 44, 55, TYPE_POISON, TYPE_NONE, 0 },  // 23 poison
  { "ARBOK", 0, 0, R_EVO, 0x8A73, 60, 95, 69, 80, TYPE_POISON, TYPE_NONE, 0 },  // 24 poison
  { "PIKACHU", 26, 30, R_COMUN, 0xBCA1, 35, 55, 40, 90, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 25 electric
  { "RAICHU", 0, 0, R_EVO, 0xBCA1, 60, 90, 55, 110, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 26 electric
  { "SANDSHREW", 28, 22, R_COMUN, 0xB447, 50, 75, 85, 40, TYPE_GROUND, TYPE_NONE, 4 },  // 27 ground
  { "SANDSLASH", 0, 0, R_EVO, 0xB447, 75, 100, 110, 65, TYPE_GROUND, TYPE_NONE, 4 },  // 28 ground
  { "NIDORAN H", 30, 16, R_COMUN, 0x8A73, 55, 47, 52, 41, TYPE_POISON, TYPE_NONE, 0 },  // 29 poison
  { "NIDORINA", 31, 30, R_EVO, 0x8A73, 70, 62, 67, 56, TYPE_POISON, TYPE_NONE, 0 },  // 30 poison
  { "NIDOQUEEN", 0, 0, R_EVO, 0x8A73, 90, 92, 87, 76, TYPE_POISON, TYPE_GROUND, 0 },  // 31 poison/ground
  { "NIDORAN M", 33, 16, R_COMUN, 0x8A73, 46, 57, 40, 50, TYPE_POISON, TYPE_NONE, 0 },  // 32 poison
  { "NIDORINO", 34, 30, R_EVO, 0x8A73, 61, 72, 57, 65, TYPE_POISON, TYPE_NONE, 0 },  // 33 poison
  { "NIDOKING", 0, 0, R_EVO, 0x8A73, 81, 102, 77, 85, TYPE_POISON, TYPE_GROUND, 0 },  // 34 poison/ground
  { "CLEFAIRY", 36, 30, R_COMUN, 0x8C4D, 70, 45, 48, 35, TYPE_FAIRY, TYPE_NONE, 0 },  // 35 fairy
  { "CLEFABLE", 0, 0, R_EVO, 0x8C4D, 95, 70, 73, 60, TYPE_FAIRY, TYPE_NONE, 0 },  // 36 fairy
  { "VULPIX", 38, 30, R_COMUN, 0xEA87, 38, 41, 40, 65, TYPE_FIRE, TYPE_NONE, 3 },  // 37 fire
  { "NINETALES", 0, 0, R_EVO, 0xEA87, 73, 76, 75, 100, TYPE_FIRE, TYPE_NONE, 3 },  // 38 fire
  { "JIGGLYPUFF", 40, 30, R_COMUN, 0x8C4D, 115, 45, 20, 20, TYPE_NORMAL, TYPE_FAIRY, 0 },  // 39 normal/fairy
  { "WIGGLYTUFF", 0, 0, R_EVO, 0x8C4D, 140, 70, 45, 45, TYPE_NORMAL, TYPE_FAIRY, 0 },  // 40 normal/fairy
  { "ZUBAT", 42, 22, R_COMUN, 0x8A73, 40, 45, 35, 55, TYPE_POISON, TYPE_FLYING, 0 },  // 41 poison/flying
  { "GOLBAT", 169, 25, R_EVO, 0x8A73, 75, 80, 70, 90, TYPE_POISON, TYPE_FLYING, 0 },  // 42 poison/flying
  { "ODDISH", 44, 21, R_COMUN, 0x3C49, 45, 50, 55, 30, TYPE_GRASS, TYPE_POISON, 2 },  // 43 grass/poison
  { "GLOOM", 45, 36, R_EVO, 0x3C49, 60, 65, 70, 40, TYPE_GRASS, TYPE_POISON, 2 },  // 44 grass/poison
  { "VILEPLUME", 0, 0, R_EVO, 0x3C49, 75, 80, 85, 50, TYPE_GRASS, TYPE_POISON, 2 },  // 45 grass/poison
  { "PARAS", 47, 24, R_COMUN, 0x7CC4, 35, 70, 55, 25, TYPE_BUG, TYPE_GRASS, 2 },  // 46 bug/grass
  { "PARASECT", 0, 0, R_EVO, 0x7CC4, 60, 95, 80, 30, TYPE_BUG, TYPE_GRASS, 2 },  // 47 bug/grass
  { "VENONAT", 49, 31, R_COMUN, 0x7CC4, 60, 55, 50, 45, TYPE_BUG, TYPE_POISON, 2 },  // 48 bug/poison
  { "VENOMOTH", 0, 0, R_EVO, 0x7CC4, 70, 65, 60, 90, TYPE_BUG, TYPE_POISON, 2 },  // 49 bug/poison
  { "DIGLETT", 51, 26, R_COMUN, 0xB447, 10, 55, 25, 95, TYPE_GROUND, TYPE_NONE, 4 },  // 50 ground
  { "DUGTRIO", 0, 0, R_EVO, 0xB447, 35, 100, 50, 120, TYPE_GROUND, TYPE_NONE, 4 },  // 51 ground
  { "MEOWTH", 53, 28, R_COMUN, 0x8C4D, 40, 45, 35, 90, TYPE_NORMAL, TYPE_NONE, 0 },  // 52 normal
  { "PERSIAN", 0, 0, R_EVO, 0x8C4D, 65, 70, 60, 115, TYPE_NORMAL, TYPE_NONE, 0 },  // 53 normal
  { "PSYDUCK", 55, 33, R_COMUN, 0x4C98, 50, 52, 48, 55, TYPE_WATER, TYPE_NONE, 1 },  // 54 water
  { "GOLDUCK", 0, 0, R_EVO, 0x4C98, 80, 82, 78, 85, TYPE_WATER, TYPE_NONE, 1 },  // 55 water
  { "MANKEY", 57, 28, R_COMUN, 0xA2A5, 40, 80, 35, 70, TYPE_FIGHTING, TYPE_NONE, 0 },  // 56 fighting
  { "PRIMEAPE", 0, 0, R_EVO, 0xA2A5, 65, 105, 60, 95, TYPE_FIGHTING, TYPE_NONE, 0 },  // 57 fighting
  { "GROWLITHE", 59, 30, R_RARO, 0xEA87, 55, 70, 45, 60, TYPE_FIRE, TYPE_NONE, 3 },  // 58 fire
  { "ARCANINE", 0, 0, R_EVO, 0xEA87, 90, 110, 80, 95, TYPE_FIRE, TYPE_NONE, 3 },  // 59 fire
  { "POLIWAG", 61, 25, R_COMUN, 0x4C98, 40, 50, 40, 90, TYPE_WATER, TYPE_NONE, 1 },  // 60 water
  { "POLIWHIRL", 62, 36, R_EVO, 0x4C98, 65, 65, 65, 90, TYPE_WATER, TYPE_NONE, 1 },  // 61 water
  { "POLIWRATH", 0, 0, R_EVO, 0x4C98, 90, 95, 95, 70, TYPE_WATER, TYPE_FIGHTING, 1 },  // 62 water/fighting
  { "ABRA", 64, 16, R_COMUN, 0xD28F, 25, 20, 15, 90, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 63 psychic
  { "KADABRA", 65, 40, R_EVO, 0xD28F, 40, 35, 30, 105, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 64 psychic
  { "ALAKAZAM", 0, 0, R_EVO, 0xD28F, 55, 50, 45, 120, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 65 psychic
  { "MACHOP", 67, 28, R_COMUN, 0xA2A5, 70, 80, 50, 35, TYPE_FIGHTING, TYPE_NONE, 0 },  // 66 fighting
  { "MACHOKE", 68, 40, R_EVO, 0xA2A5, 80, 100, 70, 45, TYPE_FIGHTING, TYPE_NONE, 0 },  // 67 fighting
  { "MACHAMP", 0, 0, R_EVO, 0xA2A5, 90, 130, 80, 55, TYPE_FIGHTING, TYPE_NONE, 0 },  // 68 fighting
  { "BELLSPROUT", 70, 21, R_COMUN, 0x3C49, 50, 75, 35, 40, TYPE_GRASS, TYPE_POISON, 2 },  // 69 grass/poison
  { "WEEPINBELL", 71, 36, R_EVO, 0x3C49, 65, 90, 50, 55, TYPE_GRASS, TYPE_POISON, 2 },  // 70 grass/poison
  { "VICTREEBEL", 0, 0, R_EVO, 0x3C49, 80, 105, 65, 70, TYPE_GRASS, TYPE_POISON, 2 },  // 71 grass/poison
  { "TENTACOOL", 73, 30, R_COMUN, 0x4C98, 40, 40, 35, 70, TYPE_WATER, TYPE_POISON, 1 },  // 72 water/poison
  { "TENTACRUEL", 0, 0, R_EVO, 0x4C98, 80, 70, 65, 100, TYPE_WATER, TYPE_POISON, 1 },  // 73 water/poison
  { "GEODUDE", 75, 25, R_COMUN, 0x9407, 40, 80, 100, 20, TYPE_ROCK, TYPE_GROUND, 4 },  // 74 rock/ground
  { "GRAVELER", 76, 40, R_EVO, 0x9407, 55, 95, 115, 35, TYPE_ROCK, TYPE_GROUND, 4 },  // 75 rock/ground
  { "GOLEM", 0, 0, R_EVO, 0x9407, 80, 120, 130, 45, TYPE_ROCK, TYPE_GROUND, 4 },  // 76 rock/ground
  { "PONYTA", 78, 40, R_RARO, 0xEA87, 50, 85, 55, 90, TYPE_FIRE, TYPE_NONE, 3 },  // 77 fire
  { "RAPIDASH", 0, 0, R_EVO, 0xEA87, 65, 100, 70, 105, TYPE_FIRE, TYPE_NONE, 3 },  // 78 fire
  { "SLOWPOKE", 80, 37, R_COMUN, 0x4C98, 90, 65, 65, 15, TYPE_WATER, TYPE_PSYCHIC, 1 },  // 79 water/psychic
  { "SLOWBRO", 0, 0, R_EVO, 0x4C98, 95, 75, 110, 30, TYPE_WATER, TYPE_PSYCHIC, 1 },  // 80 water/psychic
  { "MAGNEMITE", 82, 30, R_COMUN, 0xBCA1, 25, 35, 70, 45, TYPE_ELECTRIC, TYPE_STEEL, 0 },  // 81 electric/steel
  { "MAGNETON", 0, 0, R_EVO, 0xBCA1, 50, 60, 95, 70, TYPE_ELECTRIC, TYPE_STEEL, 0 },  // 82 electric/steel
  { "FARFETCHD", 0, 0, R_RARO, 0x8C4D, 52, 90, 55, 60, TYPE_NORMAL, TYPE_FLYING, 0 },  // 83 normal/flying
  { "DODUO", 85, 31, R_COMUN, 0x8C4D, 35, 85, 45, 75, TYPE_NORMAL, TYPE_FLYING, 0 },  // 84 normal/flying
  { "DODRIO", 0, 0, R_EVO, 0x8C4D, 60, 110, 70, 110, TYPE_NORMAL, TYPE_FLYING, 0 },  // 85 normal/flying
  { "SEEL", 87, 34, R_COMUN, 0x4C98, 65, 45, 55, 45, TYPE_WATER, TYPE_NONE, 1 },  // 86 water
  { "DEWGONG", 0, 0, R_EVO, 0x4C98, 90, 70, 80, 70, TYPE_WATER, TYPE_ICE, 1 },  // 87 water/ice
  { "GRIMER", 89, 38, R_RARO, 0x8A73, 80, 80, 50, 25, TYPE_POISON, TYPE_NONE, 0 },  // 88 poison
  { "MUK", 0, 0, R_EVO, 0x8A73, 105, 105, 75, 50, TYPE_POISON, TYPE_NONE, 0 },  // 89 poison
  { "SHELLDER", 91, 30, R_COMUN, 0x4C98, 30, 65, 100, 40, TYPE_WATER, TYPE_NONE, 1 },  // 90 water
  { "CLOYSTER", 0, 0, R_EVO, 0x4C98, 50, 95, 180, 70, TYPE_WATER, TYPE_ICE, 1 },  // 91 water/ice
  { "GASTLY", 93, 25, R_COMUN, 0x6AD3, 30, 35, 30, 80, TYPE_GHOST, TYPE_POISON, 0 },  // 92 ghost/poison
  { "HAUNTER", 94, 40, R_EVO, 0x6AD3, 45, 50, 45, 95, TYPE_GHOST, TYPE_POISON, 0 },  // 93 ghost/poison
  { "GENGAR", 0, 0, R_EVO, 0x6AD3, 60, 65, 60, 110, TYPE_GHOST, TYPE_POISON, 0 },  // 94 ghost/poison
  { "ONIX", 208, 40, R_RARO, 0x9407, 35, 45, 160, 70, TYPE_ROCK, TYPE_GROUND, 4 },  // 95 rock/ground
  { "DROWZEE", 97, 26, R_COMUN, 0xD28F, 60, 48, 45, 42, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 96 psychic
  { "HYPNO", 0, 0, R_EVO, 0xD28F, 85, 73, 70, 67, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 97 psychic
  { "KRABBY", 99, 28, R_COMUN, 0x4C98, 30, 105, 90, 50, TYPE_WATER, TYPE_NONE, 1 },  // 98 water
  { "KINGLER", 0, 0, R_EVO, 0x4C98, 55, 130, 115, 75, TYPE_WATER, TYPE_NONE, 1 },  // 99 water
  { "VOLTORB", 101, 30, R_COMUN, 0xBCA1, 40, 30, 50, 100, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 100 electric
  { "ELECTRODE", 0, 0, R_EVO, 0xBCA1, 60, 50, 70, 150, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 101 electric
  { "EXEGGCUTE", 103, 30, R_COMUN, 0x3C49, 60, 40, 80, 40, TYPE_GRASS, TYPE_PSYCHIC, 2 },  // 102 grass/psychic
  { "EXEGGUTOR", 0, 0, R_EVO, 0x3C49, 95, 95, 85, 55, TYPE_GRASS, TYPE_PSYCHIC, 2 },  // 103 grass/psychic
  { "CUBONE", 105, 28, R_COMUN, 0xB447, 50, 50, 95, 35, TYPE_GROUND, TYPE_NONE, 4 },  // 104 ground
  { "MAROWAK", 0, 0, R_EVO, 0xB447, 60, 80, 110, 45, TYPE_GROUND, TYPE_NONE, 4 },  // 105 ground
  { "HITMONLEE", 0, 0, R_RARO, 0xA2A5, 50, 120, 53, 87, TYPE_FIGHTING, TYPE_NONE, 0 },  // 106 fighting
  { "HITMONCHAN", 0, 0, R_RARO, 0xA2A5, 50, 105, 79, 76, TYPE_FIGHTING, TYPE_NONE, 0 },  // 107 fighting
  { "LICKITUNG", 0, 0, R_RARO, 0x8C4D, 90, 55, 75, 30, TYPE_NORMAL, TYPE_NONE, 0 },  // 108 normal
  { "KOFFING", 110, 35, R_COMUN, 0x8A73, 40, 65, 95, 35, TYPE_POISON, TYPE_NONE, 0 },  // 109 poison
  { "WEEZING", 0, 0, R_EVO, 0x8A73, 65, 90, 120, 60, TYPE_POISON, TYPE_NONE, 0 },  // 110 poison
  { "RHYHORN", 112, 42, R_RARO, 0xB447, 80, 85, 95, 25, TYPE_GROUND, TYPE_ROCK, 4 },  // 111 ground/rock
  { "RHYDON", 0, 0, R_EVO, 0xB447, 105, 130, 120, 40, TYPE_GROUND, TYPE_ROCK, 4 },  // 112 ground/rock
  { "CHANSEY", 242, 25, R_RARO, 0x8C4D, 250, 5, 5, 50, TYPE_NORMAL, TYPE_NONE, 0 },  // 113 normal
  { "TANGELA", 0, 0, R_RARO, 0x3C49, 65, 55, 115, 60, TYPE_GRASS, TYPE_NONE, 2 },  // 114 grass
  { "KANGASKHAN", 0, 0, R_RARO, 0x8C4D, 105, 95, 80, 90, TYPE_NORMAL, TYPE_NONE, 0 },  // 115 normal
  { "HORSEA", 117, 32, R_COMUN, 0x4C98, 30, 40, 70, 60, TYPE_WATER, TYPE_NONE, 1 },  // 116 water
  { "SEADRA", 230, 40, R_EVO, 0x4C98, 55, 65, 95, 85, TYPE_WATER, TYPE_NONE, 1 },  // 117 water
  { "GOLDEEN", 119, 33, R_COMUN, 0x4C98, 45, 67, 60, 63, TYPE_WATER, TYPE_NONE, 1 },  // 118 water
  { "SEAKING", 0, 0, R_EVO, 0x4C98, 80, 92, 65, 68, TYPE_WATER, TYPE_NONE, 1 },  // 119 water
  { "STARYU", 121, 30, R_COMUN, 0x4C98, 30, 45, 55, 85, TYPE_WATER, TYPE_NONE, 1 },  // 120 water
  { "STARMIE", 0, 0, R_EVO, 0x4C98, 60, 75, 85, 115, TYPE_WATER, TYPE_PSYCHIC, 1 },  // 121 water/psychic
  { "MR. MIME", 0, 0, R_RARO, 0xD28F, 40, 45, 65, 90, TYPE_PSYCHIC, TYPE_FAIRY, 0 },  // 122 psychic/fairy
  { "SCYTHER", 212, 40, R_RARO, 0x7CC4, 70, 110, 80, 105, TYPE_BUG, TYPE_FLYING, 2 },  // 123 bug/flying
  { "JYNX", 0, 0, R_RARO, 0x4DB8, 65, 50, 35, 95, TYPE_ICE, TYPE_PSYCHIC, 5 },  // 124 ice/psychic
  { "ELECTABUZZ", 0, 0, R_RARO, 0xBCA1, 65, 83, 57, 105, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 125 electric
  { "MAGMAR", 0, 0, R_RARO, 0xEA87, 65, 95, 57, 93, TYPE_FIRE, TYPE_NONE, 3 },  // 126 fire
  { "PINSIR", 0, 0, R_RARO, 0x7CC4, 65, 125, 100, 85, TYPE_BUG, TYPE_NONE, 2 },  // 127 bug
  { "TAUROS", 0, 0, R_RARO, 0x8C4D, 75, 100, 95, 110, TYPE_NORMAL, TYPE_NONE, 0 },  // 128 normal
  { "MAGIKARP", 130, 20, R_COMUN, 0x4C98, 20, 10, 55, 80, TYPE_WATER, TYPE_NONE, 1 },  // 129 water
  { "GYARADOS", 0, 0, R_EVO, 0x4C98, 95, 125, 79, 81, TYPE_WATER, TYPE_FLYING, 1 },  // 130 water/flying
  { "LAPRAS", 0, 0, R_RARO, 0x4C98, 130, 85, 80, 60, TYPE_WATER, TYPE_ICE, 1 },  // 131 water/ice
  { "DITTO", 0, 0, R_RARO, 0x8C4D, 48, 48, 48, 48, TYPE_NORMAL, TYPE_NONE, 0 },  // 132 normal
  { "EEVEE", 134, 30, R_COMUN, 0x8C4D, 55, 55, 50, 55, TYPE_NORMAL, TYPE_NONE, 0 },  // 133 normal
  { "VAPOREON", 0, 0, R_EVO, 0x4C98, 130, 65, 60, 65, TYPE_WATER, TYPE_NONE, 1 },  // 134 water
  { "JOLTEON", 0, 0, R_EVO, 0xBCA1, 65, 65, 60, 130, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 135 electric
  { "FLAREON", 0, 0, R_EVO, 0xEA87, 65, 130, 60, 65, TYPE_FIRE, TYPE_NONE, 3 },  // 136 fire
  { "PORYGON", 233, 40, R_RARO, 0x8C4D, 65, 60, 70, 40, TYPE_NORMAL, TYPE_NONE, 0 },  // 137 normal
  { "OMANYTE", 139, 40, R_RARO, 0x9407, 35, 40, 100, 35, TYPE_ROCK, TYPE_WATER, 1 },  // 138 rock/water
  { "OMASTAR", 0, 0, R_EVO, 0x9407, 70, 60, 125, 55, TYPE_ROCK, TYPE_WATER, 1 },  // 139 rock/water
  { "KABUTO", 141, 40, R_RARO, 0x9407, 30, 80, 90, 55, TYPE_ROCK, TYPE_WATER, 1 },  // 140 rock/water
  { "KABUTOPS", 0, 0, R_EVO, 0x9407, 60, 115, 105, 80, TYPE_ROCK, TYPE_WATER, 1 },  // 141 rock/water
  { "AERODACTYL", 0, 0, R_RARO, 0x9407, 80, 105, 65, 130, TYPE_ROCK, TYPE_FLYING, 4 },  // 142 rock/flying
  { "SNORLAX", 0, 0, R_RARO, 0x8C4D, 160, 110, 65, 30, TYPE_NORMAL, TYPE_NONE, 0 },  // 143 normal
  { "ARTICUNO", 0, 0, R_LEGENDARIO, 0x4DB8, 90, 85, 100, 85, TYPE_ICE, TYPE_FLYING, 5 },  // 144 ice/flying
  { "ZAPDOS", 0, 0, R_LEGENDARIO, 0xBCA1, 90, 90, 85, 100, TYPE_ELECTRIC, TYPE_FLYING, 0 },  // 145 electric/flying
  { "MOLTRES", 0, 0, R_LEGENDARIO, 0xEA87, 90, 100, 90, 90, TYPE_FIRE, TYPE_FLYING, 3 },  // 146 fire/flying
  { "DRATINI", 148, 30, R_RARO, 0x5A98, 41, 64, 45, 50, TYPE_DRAGON, TYPE_NONE, 1 },  // 147 dragon
  { "DRAGONAIR", 149, 55, R_EVO, 0x5A98, 61, 84, 65, 70, TYPE_DRAGON, TYPE_NONE, 1 },  // 148 dragon
  { "DRAGONITE", 0, 0, R_EVO, 0x5A98, 91, 134, 95, 80, TYPE_DRAGON, TYPE_FLYING, 1 },  // 149 dragon/flying
  { "MEWTWO", 0, 0, R_LEGENDARIO, 0xD28F, 106, 110, 90, 130, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 150 psychic
  { "MEW", 0, 0, R_LEGENDARIO, 0xD28F, 100, 100, 100, 100, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 151 psychic
  { "CHIKORITA", 153, 16, R_RARO, 0x3C49, 45, 49, 65, 45, TYPE_GRASS, TYPE_NONE, 2 },  // 152 grass
  { "BAYLEEF", 154, 32, R_EVO, 0x3C49, 60, 62, 80, 60, TYPE_GRASS, TYPE_NONE, 2 },  // 153 grass
  { "MEGANIUM", 0, 0, R_EVO, 0x3C49, 80, 82, 100, 80, TYPE_GRASS, TYPE_NONE, 2 },  // 154 grass
  { "CYNDAQUIL", 156, 14, R_RARO, 0xEA87, 39, 52, 43, 65, TYPE_FIRE, TYPE_NONE, 3 },  // 155 fire
  { "QUILAVA", 157, 36, R_EVO, 0xEA87, 58, 64, 58, 80, TYPE_FIRE, TYPE_NONE, 3 },  // 156 fire
  { "TYPHLOSION", 0, 0, R_EVO, 0xEA87, 78, 84, 78, 100, TYPE_FIRE, TYPE_NONE, 3 },  // 157 fire
  { "TOTODILE", 159, 18, R_RARO, 0x4C98, 50, 65, 64, 43, TYPE_WATER, TYPE_NONE, 1 },  // 158 water
  { "CROCONAW", 160, 30, R_EVO, 0x4C98, 65, 80, 80, 58, TYPE_WATER, TYPE_NONE, 1 },  // 159 water
  { "FERALIGATR", 0, 0, R_EVO, 0x4C98, 85, 105, 100, 78, TYPE_WATER, TYPE_NONE, 1 },  // 160 water
  { "SENTRET", 162, 15, R_COMUN, 0x8C4D, 35, 46, 34, 20, TYPE_NORMAL, TYPE_NONE, 0 },  // 161 normal
  { "FURRET", 0, 0, R_EVO, 0x8C4D, 85, 76, 64, 90, TYPE_NORMAL, TYPE_NONE, 0 },  // 162 normal
  { "HOOTHOOT", 164, 20, R_COMUN, 0x8C4D, 60, 30, 30, 50, TYPE_NORMAL, TYPE_FLYING, 0 },  // 163 normal/flying
  { "NOCTOWL", 0, 0, R_EVO, 0x8C4D, 100, 50, 50, 70, TYPE_NORMAL, TYPE_FLYING, 0 },  // 164 normal/flying
  { "LEDYBA", 166, 18, R_COMUN, 0x7CC4, 40, 20, 30, 55, TYPE_BUG, TYPE_FLYING, 2 },  // 165 bug/flying
  { "LEDIAN", 0, 0, R_EVO, 0x7CC4, 55, 35, 50, 85, TYPE_BUG, TYPE_FLYING, 2 },  // 166 bug/flying
  { "SPINARAK", 168, 22, R_COMUN, 0x7CC4, 40, 60, 40, 30, TYPE_BUG, TYPE_POISON, 2 },  // 167 bug/poison
  { "ARIADOS", 0, 0, R_EVO, 0x7CC4, 70, 90, 70, 40, TYPE_BUG, TYPE_POISON, 2 },  // 168 bug/poison
  { "CROBAT", 0, 0, R_EVO, 0x8A73, 85, 90, 80, 130, TYPE_POISON, TYPE_FLYING, 0 },  // 169 poison/flying
  { "CHINCHOU", 171, 27, R_COMUN, 0x4C98, 75, 38, 38, 67, TYPE_WATER, TYPE_ELECTRIC, 1 },  // 170 water/electric
  { "LANTURN", 0, 0, R_EVO, 0x4C98, 125, 58, 58, 67, TYPE_WATER, TYPE_ELECTRIC, 1 },  // 171 water/electric
  { "PICHU", 25, 25, R_COMUN, 0xBCA1, 20, 40, 15, 60, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 172 electric
  { "CLEFFA", 35, 25, R_COMUN, 0xC333, 50, 25, 28, 15, TYPE_FAIRY, TYPE_NONE, 0 },  // 173 fairy
  { "IGGLYBUFF", 39, 25, R_COMUN, 0x8C4D, 90, 30, 15, 15, TYPE_NORMAL, TYPE_FAIRY, 0 },  // 174 normal/fairy
  { "TOGEPI", 176, 25, R_COMUN, 0xC333, 35, 20, 65, 20, TYPE_FAIRY, TYPE_NONE, 0 },  // 175 fairy
  { "TOGETIC", 0, 0, R_EVO, 0xC333, 55, 40, 85, 40, TYPE_FAIRY, TYPE_FLYING, 0 },  // 176 fairy/flying
  { "NATU", 178, 25, R_COMUN, 0xD28F, 40, 50, 45, 70, TYPE_PSYCHIC, TYPE_FLYING, 0 },  // 177 psychic/flying
  { "XATU", 0, 0, R_EVO, 0xD28F, 65, 75, 70, 95, TYPE_PSYCHIC, TYPE_FLYING, 0 },  // 178 psychic/flying
  { "MAREEP", 180, 15, R_COMUN, 0xBCA1, 55, 40, 40, 35, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 179 electric
  { "FLAAFFY", 181, 30, R_EVO, 0xBCA1, 70, 55, 55, 45, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 180 electric
  { "AMPHAROS", 0, 0, R_EVO, 0xBCA1, 90, 75, 85, 55, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 181 electric
  { "BELLOSSOM", 0, 0, R_RARO, 0x3C49, 75, 80, 95, 50, TYPE_GRASS, TYPE_NONE, 2 },  // 182 grass
  { "MARILL", 184, 18, R_EVO, 0x4C98, 70, 20, 50, 40, TYPE_WATER, TYPE_FAIRY, 1 },  // 183 water/fairy
  { "AZUMARILL", 0, 0, R_EVO, 0x4C98, 100, 50, 80, 50, TYPE_WATER, TYPE_FAIRY, 1 },  // 184 water/fairy
  { "SUDOWOODO", 0, 0, R_EVO, 0x9407, 70, 100, 115, 30, TYPE_ROCK, TYPE_NONE, 4 },  // 185 rock
  { "POLITOED", 0, 0, R_RARO, 0x4C98, 90, 75, 75, 70, TYPE_WATER, TYPE_NONE, 1 },  // 186 water
  { "HOPPIP", 188, 18, R_COMUN, 0x3C49, 35, 35, 40, 50, TYPE_GRASS, TYPE_FLYING, 2 },  // 187 grass/flying
  { "SKIPLOOM", 189, 27, R_EVO, 0x3C49, 55, 45, 50, 80, TYPE_GRASS, TYPE_FLYING, 2 },  // 188 grass/flying
  { "JUMPLUFF", 0, 0, R_EVO, 0x3C49, 75, 55, 70, 110, TYPE_GRASS, TYPE_FLYING, 2 },  // 189 grass/flying
  { "AIPOM", 0, 0, R_RARO, 0x8C4D, 55, 70, 55, 85, TYPE_NORMAL, TYPE_NONE, 0 },  // 190 normal
  { "SUNKERN", 192, 30, R_COMUN, 0x3C49, 30, 30, 30, 30, TYPE_GRASS, TYPE_NONE, 2 },  // 191 grass
  { "SUNFLORA", 0, 0, R_EVO, 0x3C49, 75, 75, 55, 30, TYPE_GRASS, TYPE_NONE, 2 },  // 192 grass
  { "YANMA", 0, 0, R_COMUN, 0x7CC4, 65, 65, 45, 95, TYPE_BUG, TYPE_FLYING, 2 },  // 193 bug/flying
  { "WOOPER", 195, 20, R_COMUN, 0x4C98, 55, 45, 45, 15, TYPE_WATER, TYPE_GROUND, 1 },  // 194 water/ground
  { "QUAGSIRE", 0, 0, R_EVO, 0x4C98, 95, 85, 85, 35, TYPE_WATER, TYPE_GROUND, 1 },  // 195 water/ground
  { "ESPEON", 0, 0, R_RARO, 0xD28F, 65, 65, 60, 110, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 196 psychic
  { "UMBREON", 0, 0, R_RARO, 0x5A47, 95, 65, 110, 65, TYPE_DARK, TYPE_NONE, 2 },  // 197 dark
  { "MURKROW", 0, 0, R_RARO, 0x5A47, 60, 85, 42, 91, TYPE_DARK, TYPE_FLYING, 2 },  // 198 dark/flying
  { "SLOWKING", 0, 0, R_COMUN, 0x4C98, 95, 75, 80, 30, TYPE_WATER, TYPE_PSYCHIC, 1 },  // 199 water/psychic
  { "MISDREAVUS", 0, 0, R_RARO, 0x6AD3, 60, 60, 60, 85, TYPE_GHOST, TYPE_NONE, 0 },  // 200 ghost
  { "UNOWN", 0, 0, R_COMUN, 0xD28F, 48, 72, 48, 48, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 201 psychic
  { "WOBBUFFET", 0, 0, R_EVO, 0xD28F, 190, 33, 58, 33, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 202 psychic
  { "GIRAFARIG", 0, 0, R_COMUN, 0x8C4D, 70, 80, 65, 85, TYPE_NORMAL, TYPE_PSYCHIC, 0 },  // 203 normal/psychic
  { "PINECO", 205, 31, R_COMUN, 0x7CC4, 50, 65, 90, 15, TYPE_BUG, TYPE_NONE, 2 },  // 204 bug
  { "FORRETRESS", 0, 0, R_EVO, 0x7CC4, 75, 90, 140, 40, TYPE_BUG, TYPE_STEEL, 2 },  // 205 bug/steel
  { "DUNSPARCE", 0, 0, R_COMUN, 0x8C4D, 100, 70, 70, 45, TYPE_NORMAL, TYPE_NONE, 0 },  // 206 normal
  { "GLIGAR", 0, 0, R_COMUN, 0xB447, 65, 75, 105, 85, TYPE_GROUND, TYPE_FLYING, 4 },  // 207 ground/flying
  { "STEELIX", 0, 0, R_EVO, 0x6BF1, 75, 85, 200, 30, TYPE_STEEL, TYPE_GROUND, 4 },  // 208 steel/ground
  { "SNUBBULL", 210, 23, R_COMUN, 0xC333, 60, 80, 50, 30, TYPE_FAIRY, TYPE_NONE, 0 },  // 209 fairy
  { "GRANBULL", 0, 0, R_EVO, 0xC333, 90, 120, 75, 45, TYPE_FAIRY, TYPE_NONE, 0 },  // 210 fairy
  { "QWILFISH", 0, 0, R_RARO, 0x4C98, 65, 95, 85, 85, TYPE_WATER, TYPE_POISON, 1 },  // 211 water/poison
  { "SCIZOR", 0, 0, R_EVO, 0x7CC4, 70, 130, 100, 65, TYPE_BUG, TYPE_STEEL, 2 },  // 212 bug/steel
  { "SHUCKLE", 0, 0, R_COMUN, 0x7CC4, 20, 10, 230, 5, TYPE_BUG, TYPE_ROCK, 2 },  // 213 bug/rock
  { "HERACROSS", 0, 0, R_RARO, 0x7CC4, 80, 125, 75, 85, TYPE_BUG, TYPE_FIGHTING, 2 },  // 214 bug/fighting
  { "SNEASEL", 0, 0, R_COMUN, 0x5A47, 55, 95, 55, 115, TYPE_DARK, TYPE_ICE, 2 },  // 215 dark/ice
  { "TEDDIURSA", 217, 30, R_COMUN, 0x8C4D, 60, 80, 50, 40, TYPE_NORMAL, TYPE_NONE, 0 },  // 216 normal
  { "URSARING", 0, 0, R_EVO, 0x8C4D, 90, 130, 75, 55, TYPE_NORMAL, TYPE_NONE, 0 },  // 217 normal
  { "SLUGMA", 219, 38, R_COMUN, 0xEA87, 40, 40, 40, 20, TYPE_FIRE, TYPE_NONE, 3 },  // 218 fire
  { "MAGCARGO", 0, 0, R_EVO, 0xEA87, 60, 50, 120, 30, TYPE_FIRE, TYPE_ROCK, 3 },  // 219 fire/rock
  { "SWINUB", 221, 33, R_COMUN, 0x4DB8, 50, 50, 40, 50, TYPE_ICE, TYPE_GROUND, 5 },  // 220 ice/ground
  { "PILOSWINE", 0, 0, R_EVO, 0x4DB8, 100, 100, 80, 50, TYPE_ICE, TYPE_GROUND, 5 },  // 221 ice/ground
  { "CORSOLA", 0, 0, R_COMUN, 0x4C98, 65, 55, 95, 35, TYPE_WATER, TYPE_ROCK, 1 },  // 222 water/rock
  { "REMORAID", 224, 25, R_COMUN, 0x4C98, 35, 65, 35, 65, TYPE_WATER, TYPE_NONE, 1 },  // 223 water
  { "OCTILLERY", 0, 0, R_EVO, 0x4C98, 75, 105, 75, 45, TYPE_WATER, TYPE_NONE, 1 },  // 224 water
  { "DELIBIRD", 0, 0, R_RARO, 0x4DB8, 45, 55, 45, 75, TYPE_ICE, TYPE_FLYING, 5 },  // 225 ice/flying
  { "MANTINE", 0, 0, R_EVO, 0x4C98, 85, 40, 70, 70, TYPE_WATER, TYPE_FLYING, 1 },  // 226 water/flying
  { "SKARMORY", 0, 0, R_RARO, 0x6BF1, 65, 80, 140, 70, TYPE_STEEL, TYPE_FLYING, 4 },  // 227 steel/flying
  { "HOUNDOUR", 229, 24, R_COMUN, 0x5A47, 45, 60, 30, 65, TYPE_DARK, TYPE_FIRE, 2 },  // 228 dark/fire
  { "HOUNDOOM", 0, 0, R_EVO, 0x5A47, 75, 90, 50, 95, TYPE_DARK, TYPE_FIRE, 2 },  // 229 dark/fire
  { "KINGDRA", 0, 0, R_EVO, 0x4C98, 75, 95, 95, 85, TYPE_WATER, TYPE_DRAGON, 1 },  // 230 water/dragon
  { "PHANPY", 232, 25, R_COMUN, 0xB447, 90, 60, 60, 40, TYPE_GROUND, TYPE_NONE, 4 },  // 231 ground
  { "DONPHAN", 0, 0, R_EVO, 0xB447, 90, 120, 120, 50, TYPE_GROUND, TYPE_NONE, 4 },  // 232 ground
  { "PORYGON2", 0, 0, R_EVO, 0x8C4D, 85, 80, 90, 60, TYPE_NORMAL, TYPE_NONE, 0 },  // 233 normal
  { "STANTLER", 0, 0, R_RARO, 0x8C4D, 73, 95, 62, 85, TYPE_NORMAL, TYPE_NONE, 0 },  // 234 normal
  { "SMEARGLE", 0, 0, R_RARO, 0x8C4D, 55, 20, 35, 75, TYPE_NORMAL, TYPE_NONE, 0 },  // 235 normal
  { "TYROGUE", 106, 20, R_COMUN, 0xA2A5, 35, 35, 35, 35, TYPE_FIGHTING, TYPE_NONE, 0 },  // 236 fighting
  { "HITMONTOP", 0, 0, R_RARO, 0xA2A5, 50, 95, 95, 70, TYPE_FIGHTING, TYPE_NONE, 0 },  // 237 fighting
  { "SMOOCHUM", 124, 30, R_RARO, 0x4DB8, 45, 30, 15, 65, TYPE_ICE, TYPE_PSYCHIC, 5 },  // 238 ice/psychic
  { "ELEKID", 125, 30, R_RARO, 0xBCA1, 45, 63, 37, 95, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 239 electric
  { "MAGBY", 126, 30, R_RARO, 0xEA87, 45, 75, 37, 83, TYPE_FIRE, TYPE_NONE, 3 },  // 240 fire
  { "MILTANK", 0, 0, R_RARO, 0x8C4D, 95, 80, 105, 100, TYPE_NORMAL, TYPE_NONE, 0 },  // 241 normal
  { "BLISSEY", 0, 0, R_EVO, 0x8C4D, 255, 10, 10, 55, TYPE_NORMAL, TYPE_NONE, 0 },  // 242 normal
  { "RAIKOU", 0, 0, R_LEGENDARIO, 0xBCA1, 90, 85, 75, 115, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 243 electric
  { "ENTEI", 0, 0, R_LEGENDARIO, 0xEA87, 115, 115, 85, 100, TYPE_FIRE, TYPE_NONE, 3 },  // 244 fire
  { "SUICUNE", 0, 0, R_LEGENDARIO, 0x4C98, 100, 75, 115, 85, TYPE_WATER, TYPE_NONE, 1 },  // 245 water
  { "LARVITAR", 247, 30, R_RARO, 0x9407, 50, 64, 50, 41, TYPE_ROCK, TYPE_GROUND, 4 },  // 246 rock/ground
  { "PUPITAR", 248, 55, R_EVO, 0x9407, 70, 84, 70, 51, TYPE_ROCK, TYPE_GROUND, 4 },  // 247 rock/ground
  { "TYRANITAR", 0, 0, R_EVO, 0x9407, 100, 134, 110, 61, TYPE_ROCK, TYPE_DARK, 4 },  // 248 rock/dark
  { "LUGIA", 0, 0, R_LEGENDARIO, 0xD28F, 106, 90, 130, 110, TYPE_PSYCHIC, TYPE_FLYING, 0 },  // 249 psychic/flying
  { "HO-OH", 0, 0, R_LEGENDARIO, 0xEA87, 106, 130, 90, 90, TYPE_FIRE, TYPE_FLYING, 3 },  // 250 fire/flying
  { "CELEBI", 0, 0, R_LEGENDARIO, 0xD28F, 100, 100, 100, 100, TYPE_PSYCHIC, TYPE_GRASS, 0 },  // 251 psychic/grass
  { "TREECKO", 253, 16, R_RARO, 0x3C49, 40, 45, 35, 70, TYPE_GRASS, TYPE_NONE, 2 },  // 252 grass
  { "GROVYLE", 254, 36, R_EVO, 0x3C49, 50, 65, 45, 95, TYPE_GRASS, TYPE_NONE, 2 },  // 253 grass
  { "SCEPTILE", 0, 0, R_EVO, 0x3C49, 70, 85, 65, 120, TYPE_GRASS, TYPE_NONE, 2 },  // 254 grass
  { "TORCHIC", 256, 16, R_RARO, 0xEA87, 45, 60, 40, 45, TYPE_FIRE, TYPE_NONE, 3 },  // 255 fire
  { "COMBUSKEN", 257, 36, R_EVO, 0xEA87, 60, 85, 60, 55, TYPE_FIRE, TYPE_FIGHTING, 3 },  // 256 fire/fighting
  { "BLAZIKEN", 0, 0, R_EVO, 0xEA87, 80, 120, 70, 80, TYPE_FIRE, TYPE_FIGHTING, 3 },  // 257 fire/fighting
  { "MUDKIP", 259, 16, R_RARO, 0x4C98, 50, 70, 50, 40, TYPE_WATER, TYPE_NONE, 1 },  // 258 water
  { "MARSHTOMP", 260, 36, R_EVO, 0x4C98, 70, 85, 70, 50, TYPE_WATER, TYPE_GROUND, 1 },  // 259 water/ground
  { "SWAMPERT", 0, 0, R_EVO, 0x4C98, 100, 110, 90, 60, TYPE_WATER, TYPE_GROUND, 1 },  // 260 water/ground
  { "POOCHYENA", 262, 18, R_COMUN, 0x5A47, 35, 55, 35, 35, TYPE_DARK, TYPE_NONE, 2 },  // 261 dark
  { "MIGHTYENA", 0, 0, R_EVO, 0x5A47, 70, 90, 70, 70, TYPE_DARK, TYPE_NONE, 2 },  // 262 dark
  { "ZIGZAGOON", 264, 20, R_COMUN, 0x8C4D, 38, 30, 41, 60, TYPE_NORMAL, TYPE_NONE, 0 },  // 263 normal
  { "LINOONE", 0, 0, R_EVO, 0x8C4D, 78, 70, 61, 100, TYPE_NORMAL, TYPE_NONE, 0 },  // 264 normal
  { "WURMPLE", 266, 7, R_COMUN, 0x7CC4, 45, 45, 35, 20, TYPE_BUG, TYPE_NONE, 2 },  // 265 bug
  { "SILCOON", 267, 10, R_EVO, 0x7CC4, 50, 35, 55, 15, TYPE_BUG, TYPE_NONE, 2 },  // 266 bug
  { "BEAUTIFLY", 0, 0, R_EVO, 0x7CC4, 60, 70, 50, 65, TYPE_BUG, TYPE_FLYING, 2 },  // 267 bug/flying
  { "CASCOON", 269, 10, R_COMUN, 0x7CC4, 50, 35, 55, 15, TYPE_BUG, TYPE_NONE, 2 },  // 268 bug
  { "DUSTOX", 0, 0, R_EVO, 0x7CC4, 60, 50, 70, 65, TYPE_BUG, TYPE_POISON, 2 },  // 269 bug/poison
  { "LOTAD", 271, 14, R_COMUN, 0x4C98, 40, 30, 30, 30, TYPE_WATER, TYPE_GRASS, 1 },  // 270 water/grass
  { "LOMBRE", 272, 30, R_EVO, 0x4C98, 60, 50, 50, 50, TYPE_WATER, TYPE_GRASS, 1 },  // 271 water/grass
  { "LUDICOLO", 0, 0, R_EVO, 0x4C98, 80, 70, 70, 70, TYPE_WATER, TYPE_GRASS, 1 },  // 272 water/grass
  { "SEEDOT", 274, 14, R_COMUN, 0x3C49, 40, 40, 50, 30, TYPE_GRASS, TYPE_NONE, 2 },  // 273 grass
  { "NUZLEAF", 275, 30, R_EVO, 0x3C49, 70, 70, 40, 60, TYPE_GRASS, TYPE_DARK, 2 },  // 274 grass/dark
  { "SHIFTRY", 0, 0, R_EVO, 0x3C49, 90, 100, 60, 80, TYPE_GRASS, TYPE_DARK, 2 },  // 275 grass/dark
  { "TAILLOW", 277, 22, R_COMUN, 0x8C4D, 40, 55, 30, 85, TYPE_NORMAL, TYPE_FLYING, 0 },  // 276 normal/flying
  { "SWELLOW", 0, 0, R_EVO, 0x8C4D, 60, 85, 60, 125, TYPE_NORMAL, TYPE_FLYING, 0 },  // 277 normal/flying
  { "WINGULL", 279, 25, R_COMUN, 0x4C98, 40, 30, 30, 85, TYPE_WATER, TYPE_FLYING, 1 },  // 278 water/flying
  { "PELIPPER", 0, 0, R_EVO, 0x4C98, 60, 50, 100, 65, TYPE_WATER, TYPE_FLYING, 1 },  // 279 water/flying
  { "RALTS", 281, 20, R_COMUN, 0xD28F, 28, 25, 25, 40, TYPE_PSYCHIC, TYPE_FAIRY, 0 },  // 280 psychic/fairy
  { "KIRLIA", 282, 30, R_EVO, 0xD28F, 38, 35, 35, 50, TYPE_PSYCHIC, TYPE_FAIRY, 0 },  // 281 psychic/fairy
  { "GARDEVOIR", 0, 0, R_EVO, 0xD28F, 68, 65, 65, 80, TYPE_PSYCHIC, TYPE_FAIRY, 0 },  // 282 psychic/fairy
  { "SURSKIT", 284, 22, R_COMUN, 0x7CC4, 40, 30, 32, 65, TYPE_BUG, TYPE_WATER, 2 },  // 283 bug/water
  { "MASQUERAIN", 0, 0, R_EVO, 0x7CC4, 70, 60, 62, 80, TYPE_BUG, TYPE_FLYING, 2 },  // 284 bug/flying
  { "SHROOMISH", 286, 23, R_COMUN, 0x3C49, 60, 40, 60, 35, TYPE_GRASS, TYPE_NONE, 2 },  // 285 grass
  { "BRELOOM", 0, 0, R_EVO, 0x3C49, 60, 130, 80, 70, TYPE_GRASS, TYPE_FIGHTING, 2 },  // 286 grass/fighting
  { "SLAKOTH", 288, 18, R_COMUN, 0x8C4D, 60, 60, 60, 30, TYPE_NORMAL, TYPE_NONE, 0 },  // 287 normal
  { "VIGOROTH", 289, 36, R_EVO, 0x8C4D, 80, 80, 80, 90, TYPE_NORMAL, TYPE_NONE, 0 },  // 288 normal
  { "SLAKING", 0, 0, R_EVO, 0x8C4D, 150, 160, 100, 100, TYPE_NORMAL, TYPE_NONE, 0 },  // 289 normal
  { "NINCADA", 291, 20, R_COMUN, 0x7CC4, 31, 45, 90, 40, TYPE_BUG, TYPE_GROUND, 2 },  // 290 bug/ground
  { "NINJASK", 0, 0, R_EVO, 0x7CC4, 61, 90, 45, 160, TYPE_BUG, TYPE_FLYING, 2 },  // 291 bug/flying
  { "SHEDINJA", 0, 0, R_RARO, 0x7CC4, 1, 90, 45, 40, TYPE_BUG, TYPE_GHOST, 2 },  // 292 bug/ghost
  { "WHISMUR", 294, 20, R_COMUN, 0x8C4D, 64, 51, 23, 28, TYPE_NORMAL, TYPE_NONE, 0 },  // 293 normal
  { "LOUDRED", 295, 40, R_EVO, 0x8C4D, 84, 71, 43, 48, TYPE_NORMAL, TYPE_NONE, 0 },  // 294 normal
  { "EXPLOUD", 0, 0, R_EVO, 0x8C4D, 104, 91, 63, 68, TYPE_NORMAL, TYPE_NONE, 0 },  // 295 normal
  { "MAKUHITA", 297, 24, R_COMUN, 0xA2A5, 72, 60, 30, 25, TYPE_FIGHTING, TYPE_NONE, 0 },  // 296 fighting
  { "HARIYAMA", 0, 0, R_EVO, 0xA2A5, 144, 120, 60, 50, TYPE_FIGHTING, TYPE_NONE, 0 },  // 297 fighting
  { "AZURILL", 183, 25, R_COMUN, 0x8C4D, 50, 20, 40, 20, TYPE_NORMAL, TYPE_FAIRY, 0 },  // 298 normal/fairy
  { "NOSEPASS", 0, 0, R_COMUN, 0x9407, 30, 45, 135, 30, TYPE_ROCK, TYPE_NONE, 4 },  // 299 rock
  { "SKITTY", 301, 30, R_COMUN, 0x8C4D, 50, 45, 45, 50, TYPE_NORMAL, TYPE_NONE, 0 },  // 300 normal
  { "DELCATTY", 0, 0, R_EVO, 0x8C4D, 70, 65, 65, 90, TYPE_NORMAL, TYPE_NONE, 0 },  // 301 normal
  { "SABLEYE", 0, 0, R_RARO, 0x5A47, 50, 75, 75, 50, TYPE_DARK, TYPE_GHOST, 2 },  // 302 dark/ghost
  { "MAWILE", 0, 0, R_RARO, 0x6BF1, 50, 85, 85, 50, TYPE_STEEL, TYPE_FAIRY, 4 },  // 303 steel/fairy
  { "ARON", 305, 32, R_COMUN, 0x6BF1, 50, 70, 100, 30, TYPE_STEEL, TYPE_ROCK, 4 },  // 304 steel/rock
  { "LAIRON", 306, 42, R_EVO, 0x6BF1, 60, 90, 140, 40, TYPE_STEEL, TYPE_ROCK, 4 },  // 305 steel/rock
  { "AGGRON", 0, 0, R_EVO, 0x6BF1, 70, 110, 180, 50, TYPE_STEEL, TYPE_ROCK, 4 },  // 306 steel/rock
  { "MEDITITE", 308, 37, R_COMUN, 0xA2A5, 30, 40, 55, 60, TYPE_FIGHTING, TYPE_PSYCHIC, 0 },  // 307 fighting/psychic
  { "MEDICHAM", 0, 0, R_EVO, 0xA2A5, 60, 60, 75, 80, TYPE_FIGHTING, TYPE_PSYCHIC, 0 },  // 308 fighting/psychic
  { "ELECTRIKE", 310, 26, R_COMUN, 0xBCA1, 40, 45, 40, 65, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 309 electric
  { "MANECTRIC", 0, 0, R_EVO, 0xBCA1, 70, 75, 60, 105, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 310 electric
  { "PLUSLE", 0, 0, R_COMUN, 0xBCA1, 60, 50, 40, 95, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 311 electric
  { "MINUN", 0, 0, R_COMUN, 0xBCA1, 60, 40, 50, 95, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 312 electric
  { "VOLBEAT", 0, 0, R_COMUN, 0x7CC4, 65, 73, 75, 85, TYPE_BUG, TYPE_NONE, 2 },  // 313 bug
  { "ILLUMISE", 0, 0, R_COMUN, 0x7CC4, 65, 47, 75, 85, TYPE_BUG, TYPE_NONE, 2 },  // 314 bug
  { "ROSELIA", 0, 0, R_EVO, 0x3C49, 50, 60, 45, 65, TYPE_GRASS, TYPE_POISON, 2 },  // 315 grass/poison
  { "GULPIN", 317, 26, R_COMUN, 0x8A73, 70, 43, 53, 40, TYPE_POISON, TYPE_NONE, 0 },  // 316 poison
  { "SWALOT", 0, 0, R_EVO, 0x8A73, 100, 73, 83, 55, TYPE_POISON, TYPE_NONE, 0 },  // 317 poison
  { "CARVANHA", 319, 30, R_COMUN, 0x4C98, 45, 90, 20, 65, TYPE_WATER, TYPE_DARK, 1 },  // 318 water/dark
  { "SHARPEDO", 0, 0, R_EVO, 0x4C98, 70, 120, 40, 95, TYPE_WATER, TYPE_DARK, 1 },  // 319 water/dark
  { "WAILMER", 321, 40, R_COMUN, 0x4C98, 130, 70, 35, 60, TYPE_WATER, TYPE_NONE, 1 },  // 320 water
  { "WAILORD", 0, 0, R_EVO, 0x4C98, 170, 90, 45, 60, TYPE_WATER, TYPE_NONE, 1 },  // 321 water
  { "NUMEL", 323, 33, R_COMUN, 0xEA87, 60, 60, 40, 35, TYPE_FIRE, TYPE_GROUND, 3 },  // 322 fire/ground
  { "CAMERUPT", 0, 0, R_EVO, 0xEA87, 70, 100, 70, 40, TYPE_FIRE, TYPE_GROUND, 3 },  // 323 fire/ground
  { "TORKOAL", 0, 0, R_COMUN, 0xEA87, 70, 85, 140, 20, TYPE_FIRE, TYPE_NONE, 3 },  // 324 fire
  { "SPOINK", 326, 32, R_COMUN, 0xD28F, 60, 25, 35, 60, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 325 psychic
  { "GRUMPIG", 0, 0, R_EVO, 0xD28F, 80, 45, 65, 80, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 326 psychic
  { "SPINDA", 0, 0, R_COMUN, 0x8C4D, 60, 60, 60, 60, TYPE_NORMAL, TYPE_NONE, 0 },  // 327 normal
  { "TRAPINCH", 329, 35, R_COMUN, 0xB447, 45, 100, 45, 10, TYPE_GROUND, TYPE_NONE, 4 },  // 328 ground
  { "VIBRAVA", 330, 45, R_EVO, 0xB447, 50, 70, 50, 70, TYPE_GROUND, TYPE_DRAGON, 4 },  // 329 ground/dragon
  { "FLYGON", 0, 0, R_EVO, 0xB447, 80, 100, 80, 100, TYPE_GROUND, TYPE_DRAGON, 4 },  // 330 ground/dragon
  { "CACNEA", 332, 32, R_COMUN, 0x3C49, 50, 85, 40, 35, TYPE_GRASS, TYPE_NONE, 2 },  // 331 grass
  { "CACTURNE", 0, 0, R_EVO, 0x3C49, 70, 115, 60, 55, TYPE_GRASS, TYPE_DARK, 2 },  // 332 grass/dark
  { "SWABLU", 334, 35, R_COMUN, 0x8C4D, 45, 40, 60, 50, TYPE_NORMAL, TYPE_FLYING, 0 },  // 333 normal/flying
  { "ALTARIA", 0, 0, R_EVO, 0x5A98, 75, 70, 90, 80, TYPE_DRAGON, TYPE_FLYING, 1 },  // 334 dragon/flying
  { "ZANGOOSE", 0, 0, R_COMUN, 0x8C4D, 73, 115, 60, 90, TYPE_NORMAL, TYPE_NONE, 0 },  // 335 normal
  { "SEVIPER", 0, 0, R_COMUN, 0x8A73, 73, 100, 60, 65, TYPE_POISON, TYPE_NONE, 0 },  // 336 poison
  { "LUNATONE", 0, 0, R_RARO, 0x9407, 90, 55, 65, 70, TYPE_ROCK, TYPE_PSYCHIC, 4 },  // 337 rock/psychic
  { "SOLROCK", 0, 0, R_RARO, 0x9407, 90, 95, 85, 70, TYPE_ROCK, TYPE_PSYCHIC, 4 },  // 338 rock/psychic
  { "BARBOACH", 340, 30, R_COMUN, 0x4C98, 50, 48, 43, 60, TYPE_WATER, TYPE_GROUND, 1 },  // 339 water/ground
  { "WHISCASH", 0, 0, R_EVO, 0x4C98, 110, 78, 73, 60, TYPE_WATER, TYPE_GROUND, 1 },  // 340 water/ground
  { "CORPHISH", 342, 30, R_COMUN, 0x4C98, 43, 80, 65, 35, TYPE_WATER, TYPE_NONE, 1 },  // 341 water
  { "CRAWDAUNT", 0, 0, R_EVO, 0x4C98, 63, 120, 85, 55, TYPE_WATER, TYPE_DARK, 1 },  // 342 water/dark
  { "BALTOY", 344, 36, R_COMUN, 0xB447, 40, 40, 55, 55, TYPE_GROUND, TYPE_PSYCHIC, 4 },  // 343 ground/psychic
  { "CLAYDOL", 0, 0, R_EVO, 0xB447, 60, 70, 105, 75, TYPE_GROUND, TYPE_PSYCHIC, 4 },  // 344 ground/psychic
  { "LILEEP", 346, 40, R_RARO, 0x9407, 66, 41, 77, 23, TYPE_ROCK, TYPE_GRASS, 4 },  // 345 rock/grass
  { "CRADILY", 0, 0, R_EVO, 0x9407, 86, 81, 97, 43, TYPE_ROCK, TYPE_GRASS, 4 },  // 346 rock/grass
  { "ANORITH", 348, 40, R_RARO, 0x9407, 45, 95, 50, 75, TYPE_ROCK, TYPE_BUG, 4 },  // 347 rock/bug
  { "ARMALDO", 0, 0, R_EVO, 0x9407, 75, 125, 100, 45, TYPE_ROCK, TYPE_BUG, 4 },  // 348 rock/bug
  { "FEEBAS", 350, 40, R_COMUN, 0x4C98, 20, 15, 20, 80, TYPE_WATER, TYPE_NONE, 1 },  // 349 water
  { "MILOTIC", 0, 0, R_EVO, 0x4C98, 95, 60, 79, 81, TYPE_WATER, TYPE_NONE, 1 },  // 350 water
  { "CASTFORM", 0, 0, R_RARO, 0x8C4D, 70, 70, 70, 70, TYPE_NORMAL, TYPE_NONE, 0 },  // 351 normal
  { "KECLEON", 0, 0, R_COMUN, 0x8C4D, 60, 90, 70, 40, TYPE_NORMAL, TYPE_NONE, 0 },  // 352 normal
  { "SHUPPET", 354, 37, R_COMUN, 0x6AD3, 44, 75, 35, 45, TYPE_GHOST, TYPE_NONE, 0 },  // 353 ghost
  { "BANETTE", 0, 0, R_EVO, 0x6AD3, 64, 115, 65, 65, TYPE_GHOST, TYPE_NONE, 0 },  // 354 ghost
  { "DUSKULL", 356, 37, R_COMUN, 0x6AD3, 20, 40, 90, 25, TYPE_GHOST, TYPE_NONE, 0 },  // 355 ghost
  { "DUSCLOPS", 0, 0, R_EVO, 0x6AD3, 40, 70, 130, 25, TYPE_GHOST, TYPE_NONE, 0 },  // 356 ghost
  { "TROPIUS", 0, 0, R_COMUN, 0x3C49, 99, 68, 83, 51, TYPE_GRASS, TYPE_FLYING, 2 },  // 357 grass/flying
  { "CHIMECHO", 0, 0, R_EVO, 0xD28F, 75, 50, 80, 65, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 358 psychic
  { "ABSOL", 0, 0, R_RARO, 0x5A47, 65, 130, 60, 75, TYPE_DARK, TYPE_NONE, 2 },  // 359 dark
  { "WYNAUT", 202, 15, R_COMUN, 0xD28F, 95, 23, 48, 23, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 360 psychic
  { "SNORUNT", 362, 42, R_COMUN, 0x4DB8, 50, 50, 50, 50, TYPE_ICE, TYPE_NONE, 5 },  // 361 ice
  { "GLALIE", 0, 0, R_EVO, 0x4DB8, 80, 80, 80, 80, TYPE_ICE, TYPE_NONE, 5 },  // 362 ice
  { "SPHEAL", 364, 32, R_COMUN, 0x4DB8, 70, 40, 50, 25, TYPE_ICE, TYPE_WATER, 5 },  // 363 ice/water
  { "SEALEO", 365, 44, R_EVO, 0x4DB8, 90, 60, 70, 45, TYPE_ICE, TYPE_WATER, 5 },  // 364 ice/water
  { "WALREIN", 0, 0, R_EVO, 0x4DB8, 110, 80, 90, 65, TYPE_ICE, TYPE_WATER, 5 },  // 365 ice/water
  { "CLAMPERL", 367, 40, R_COMUN, 0x4C98, 35, 64, 85, 32, TYPE_WATER, TYPE_NONE, 1 },  // 366 water
  { "HUNTAIL", 0, 0, R_EVO, 0x4C98, 55, 104, 105, 52, TYPE_WATER, TYPE_NONE, 1 },  // 367 water
  { "GOREBYSS", 0, 0, R_COMUN, 0x4C98, 55, 84, 105, 52, TYPE_WATER, TYPE_NONE, 1 },  // 368 water
  { "RELICANTH", 0, 0, R_RARO, 0x4C98, 100, 90, 130, 55, TYPE_WATER, TYPE_ROCK, 1 },  // 369 water/rock
  { "LUVDISC", 0, 0, R_COMUN, 0x4C98, 43, 30, 55, 97, TYPE_WATER, TYPE_NONE, 1 },  // 370 water
  { "BAGON", 372, 30, R_RARO, 0x5A98, 45, 75, 60, 50, TYPE_DRAGON, TYPE_NONE, 1 },  // 371 dragon
  { "SHELGON", 373, 50, R_EVO, 0x5A98, 65, 95, 100, 50, TYPE_DRAGON, TYPE_NONE, 1 },  // 372 dragon
  { "SALAMENCE", 0, 0, R_EVO, 0x5A98, 95, 135, 80, 100, TYPE_DRAGON, TYPE_FLYING, 1 },  // 373 dragon/flying
  { "BELDUM", 375, 20, R_RARO, 0x6BF1, 40, 55, 80, 30, TYPE_STEEL, TYPE_PSYCHIC, 4 },  // 374 steel/psychic
  { "METANG", 376, 45, R_EVO, 0x6BF1, 60, 75, 100, 50, TYPE_STEEL, TYPE_PSYCHIC, 4 },  // 375 steel/psychic
  { "METAGROSS", 0, 0, R_EVO, 0x6BF1, 80, 135, 130, 70, TYPE_STEEL, TYPE_PSYCHIC, 4 },  // 376 steel/psychic
  { "REGIROCK", 0, 0, R_LEGENDARIO, 0x9407, 80, 100, 200, 50, TYPE_ROCK, TYPE_NONE, 4 },  // 377 rock
  { "REGICE", 0, 0, R_LEGENDARIO, 0x4DB8, 80, 50, 100, 50, TYPE_ICE, TYPE_NONE, 5 },  // 378 ice
  { "REGISTEEL", 0, 0, R_LEGENDARIO, 0x6BF1, 80, 75, 150, 50, TYPE_STEEL, TYPE_NONE, 4 },  // 379 steel
  { "LATIAS", 0, 0, R_LEGENDARIO, 0x5A98, 80, 80, 90, 110, TYPE_DRAGON, TYPE_PSYCHIC, 1 },  // 380 dragon/psychic
  { "LATIOS", 0, 0, R_LEGENDARIO, 0x5A98, 80, 90, 80, 110, TYPE_DRAGON, TYPE_PSYCHIC, 1 },  // 381 dragon/psychic
  { "KYOGRE", 0, 0, R_LEGENDARIO, 0x4C98, 100, 100, 90, 90, TYPE_WATER, TYPE_NONE, 1 },  // 382 water
  { "GROUDON", 0, 0, R_LEGENDARIO, 0xB447, 100, 150, 140, 90, TYPE_GROUND, TYPE_NONE, 4 },  // 383 ground
  { "RAYQUAZA", 0, 0, R_LEGENDARIO, 0x5A98, 105, 150, 90, 95, TYPE_DRAGON, TYPE_FLYING, 1 },  // 384 dragon/flying
  { "JIRACHI", 0, 0, R_LEGENDARIO, 0x6BF1, 100, 100, 100, 100, TYPE_STEEL, TYPE_PSYCHIC, 4 },  // 385 steel/psychic
  { "DEOXYS", 0, 0, R_LEGENDARIO, 0xD28F, 50, 150, 50, 150, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 386 psychic
  { "TURTWIG", 0, 0, R_RARO, 0x3C49, 55, 68, 64, 31, TYPE_GRASS, TYPE_NONE, 2 },  // 387: standalone egg; evolution not configured
  { "GROTLE", 0, 0, R_RARO, 0x3C49, 75, 89, 85, 36, TYPE_GRASS, TYPE_NONE, 2 },  // 388: standalone egg; evolution not configured
  { "TORTERRA", 0, 0, R_RARO, 0x3C49, 95, 109, 105, 56, TYPE_GRASS, TYPE_GROUND, 2 },  // 389: standalone egg; evolution not configured
  { "CHIMCHAR", 0, 0, R_RARO, 0xEA87, 44, 58, 44, 61, TYPE_FIRE, TYPE_NONE, 3 },  // 390: standalone egg; evolution not configured
  { "MONFERNO", 0, 0, R_RARO, 0xEA87, 64, 78, 52, 81, TYPE_FIRE, TYPE_FIGHTING, 3 },  // 391: standalone egg; evolution not configured
  { "INFERNAPE", 0, 0, R_RARO, 0xEA87, 76, 104, 71, 108, TYPE_FIRE, TYPE_FIGHTING, 3 },  // 392: standalone egg; evolution not configured
  { "PIPLUP", 0, 0, R_RARO, 0x4C98, 53, 51, 53, 40, TYPE_WATER, TYPE_NONE, 1 },  // 393: standalone egg; evolution not configured
  { "PRINPLUP", 0, 0, R_RARO, 0x4C98, 64, 66, 68, 50, TYPE_WATER, TYPE_NONE, 1 },  // 394: standalone egg; evolution not configured
  { "EMPOLEON", 0, 0, R_RARO, 0x4C98, 84, 86, 88, 60, TYPE_WATER, TYPE_STEEL, 1 },  // 395: standalone egg; evolution not configured
  { "STARLY", 0, 0, R_RARO, 0x8C4D, 40, 55, 30, 60, TYPE_NORMAL, TYPE_FLYING, 0 },  // 396: standalone egg; evolution not configured
  { "STARAVIA", 0, 0, R_RARO, 0x8C4D, 55, 75, 50, 80, TYPE_NORMAL, TYPE_FLYING, 0 },  // 397: standalone egg; evolution not configured
  { "STARAPTOR", 0, 0, R_RARO, 0x8C4D, 85, 120, 70, 100, TYPE_NORMAL, TYPE_FLYING, 0 },  // 398: standalone egg; evolution not configured
  { "BIDOOF", 0, 0, R_RARO, 0x8C4D, 59, 45, 40, 31, TYPE_NORMAL, TYPE_NONE, 0 },  // 399: standalone egg; evolution not configured
  { "BIBAREL", 0, 0, R_RARO, 0x8C4D, 79, 85, 60, 71, TYPE_NORMAL, TYPE_WATER, 1 },  // 400: standalone egg; evolution not configured
  { "KRICKETOT", 0, 0, R_RARO, 0x7CC4, 37, 25, 41, 25, TYPE_BUG, TYPE_NONE, 2 },  // 401: standalone egg; evolution not configured
  { "KRICKETUNE", 0, 0, R_RARO, 0x7CC4, 77, 85, 51, 65, TYPE_BUG, TYPE_NONE, 2 },  // 402: standalone egg; evolution not configured
  { "SHINX", 0, 0, R_RARO, 0xBCA1, 45, 65, 34, 45, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 403: standalone egg; evolution not configured
  { "LUXIO", 0, 0, R_RARO, 0xBCA1, 60, 85, 49, 60, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 404: standalone egg; evolution not configured
  { "LUXRAY", 0, 0, R_RARO, 0xBCA1, 80, 120, 79, 70, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 405: standalone egg; evolution not configured
  { "BUDEW", 0, 0, R_RARO, 0x3C49, 40, 30, 35, 55, TYPE_GRASS, TYPE_POISON, 2 },  // 406: standalone egg; evolution not configured
  { "ROSERADE", 0, 0, R_RARO, 0x3C49, 60, 70, 65, 90, TYPE_GRASS, TYPE_POISON, 2 },  // 407: standalone egg; evolution not configured
  { "CRANIDOS", 0, 0, R_RARO, 0x9407, 67, 125, 40, 58, TYPE_ROCK, TYPE_NONE, 4 },  // 408: standalone egg; evolution not configured
  { "RAMPARDOS", 0, 0, R_RARO, 0x9407, 97, 165, 60, 58, TYPE_ROCK, TYPE_NONE, 4 },  // 409: standalone egg; evolution not configured
  { "SHIELDON", 0, 0, R_RARO, 0x9407, 30, 42, 118, 30, TYPE_ROCK, TYPE_STEEL, 4 },  // 410: standalone egg; evolution not configured
  { "BASTIODON", 0, 0, R_RARO, 0x9407, 60, 52, 168, 30, TYPE_ROCK, TYPE_STEEL, 4 },  // 411: standalone egg; evolution not configured
  { "BURMY", 0, 0, R_RARO, 0x7CC4, 40, 29, 45, 36, TYPE_BUG, TYPE_NONE, 2 },  // 412: standalone egg; evolution not configured
  { "WORMADAM", 0, 0, R_RARO, 0x7CC4, 60, 59, 85, 36, TYPE_BUG, TYPE_GRASS, 2 },  // 413: standalone egg; evolution not configured
  { "MOTHIM", 0, 0, R_RARO, 0x7CC4, 70, 94, 50, 66, TYPE_BUG, TYPE_FLYING, 2 },  // 414: standalone egg; evolution not configured
  { "COMBEE", 0, 0, R_RARO, 0x7CC4, 30, 30, 42, 70, TYPE_BUG, TYPE_FLYING, 2 },  // 415: standalone egg; evolution not configured
  { "VESPIQUEN", 0, 0, R_RARO, 0x7CC4, 70, 80, 102, 40, TYPE_BUG, TYPE_FLYING, 2 },  // 416: standalone egg; evolution not configured
  { "PACHIRISU", 0, 0, R_RARO, 0xBCA1, 60, 45, 70, 95, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 417: standalone egg; evolution not configured
  { "BUIZEL", 0, 0, R_RARO, 0x4C98, 55, 65, 35, 85, TYPE_WATER, TYPE_NONE, 1 },  // 418: standalone egg; evolution not configured
  { "FLOATZEL", 0, 0, R_RARO, 0x4C98, 85, 105, 55, 115, TYPE_WATER, TYPE_NONE, 1 },  // 419: standalone egg; evolution not configured
  { "CHERUBI", 0, 0, R_RARO, 0x3C49, 45, 35, 45, 35, TYPE_GRASS, TYPE_NONE, 2 },  // 420: standalone egg; evolution not configured
  { "CHERRIM", 0, 0, R_RARO, 0x3C49, 70, 60, 70, 85, TYPE_GRASS, TYPE_NONE, 2 },  // 421: standalone egg; evolution not configured
  { "SHELLOS", 0, 0, R_RARO, 0x4C98, 76, 48, 48, 34, TYPE_WATER, TYPE_NONE, 1 },  // 422: standalone egg; evolution not configured
  { "GASTRODON", 0, 0, R_RARO, 0x4C98, 111, 83, 68, 39, TYPE_WATER, TYPE_GROUND, 1 },  // 423: standalone egg; evolution not configured
  { "AMBIPOM", 0, 0, R_RARO, 0x8C4D, 75, 100, 66, 115, TYPE_NORMAL, TYPE_NONE, 0 },  // 424: standalone egg; evolution not configured
  { "DRIFLOON", 0, 0, R_RARO, 0x6AD3, 90, 50, 34, 70, TYPE_GHOST, TYPE_FLYING, 0 },  // 425: standalone egg; evolution not configured
  { "DRIFBLIM", 0, 0, R_RARO, 0x6AD3, 150, 80, 44, 80, TYPE_GHOST, TYPE_FLYING, 0 },  // 426: standalone egg; evolution not configured
  { "BUNEARY", 0, 0, R_RARO, 0x8C4D, 55, 66, 44, 85, TYPE_NORMAL, TYPE_NONE, 0 },  // 427: standalone egg; evolution not configured
  { "LOPUNNY", 0, 0, R_RARO, 0x8C4D, 65, 76, 84, 105, TYPE_NORMAL, TYPE_NONE, 0 },  // 428: standalone egg; evolution not configured
  { "MISMAGIUS", 0, 0, R_RARO, 0x6AD3, 60, 60, 60, 105, TYPE_GHOST, TYPE_NONE, 0 },  // 429: standalone egg; evolution not configured
  { "HONCHKROW", 0, 0, R_RARO, 0x5A47, 100, 125, 52, 71, TYPE_DARK, TYPE_FLYING, 2 },  // 430: standalone egg; evolution not configured
  { "GLAMEOW", 0, 0, R_RARO, 0x8C4D, 49, 55, 42, 85, TYPE_NORMAL, TYPE_NONE, 0 },  // 431: standalone egg; evolution not configured
  { "PURUGLY", 0, 0, R_RARO, 0x8C4D, 71, 82, 64, 112, TYPE_NORMAL, TYPE_NONE, 0 },  // 432: standalone egg; evolution not configured
  { "CHINGLING", 0, 0, R_RARO, 0xD28F, 45, 30, 50, 45, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 433: standalone egg; evolution not configured
  { "STUNKY", 0, 0, R_RARO, 0x8A73, 63, 63, 47, 74, TYPE_POISON, TYPE_DARK, 2 },  // 434: standalone egg; evolution not configured
  { "SKUNTANK", 0, 0, R_RARO, 0x8A73, 103, 93, 67, 84, TYPE_POISON, TYPE_DARK, 2 },  // 435: standalone egg; evolution not configured
  { "BRONZOR", 0, 0, R_RARO, 0x6BF1, 57, 24, 86, 23, TYPE_STEEL, TYPE_PSYCHIC, 4 },  // 436: standalone egg; evolution not configured
  { "BRONZONG", 0, 0, R_RARO, 0x6BF1, 67, 89, 116, 33, TYPE_STEEL, TYPE_PSYCHIC, 4 },  // 437: standalone egg; evolution not configured
  { "BONSLY", 0, 0, R_RARO, 0x9407, 50, 80, 95, 10, TYPE_ROCK, TYPE_NONE, 4 },  // 438: standalone egg; evolution not configured
  { "MIME JR.", 0, 0, R_RARO, 0xD28F, 20, 25, 45, 60, TYPE_PSYCHIC, TYPE_FAIRY, 0 },  // 439: standalone egg; evolution not configured
  { "HAPPINY", 0, 0, R_RARO, 0x8C4D, 100, 5, 5, 30, TYPE_NORMAL, TYPE_NONE, 0 },  // 440: standalone egg; evolution not configured
  { "CHATOT", 0, 0, R_RARO, 0x8C4D, 76, 65, 45, 91, TYPE_NORMAL, TYPE_FLYING, 0 },  // 441: standalone egg; evolution not configured
  { "SPIRITOMB", 0, 0, R_RARO, 0x6AD3, 50, 92, 108, 35, TYPE_GHOST, TYPE_DARK, 2 },  // 442: standalone egg; evolution not configured
  { "GIBLE", 0, 0, R_RARO, 0x5A98, 58, 70, 45, 42, TYPE_DRAGON, TYPE_GROUND, 4 },  // 443: standalone egg; evolution not configured
  { "GABITE", 0, 0, R_RARO, 0x5A98, 68, 90, 65, 82, TYPE_DRAGON, TYPE_GROUND, 4 },  // 444: standalone egg; evolution not configured
  { "GARCHOMP", 0, 0, R_RARO, 0x5A98, 108, 130, 95, 102, TYPE_DRAGON, TYPE_GROUND, 4 },  // 445: standalone egg; evolution not configured
  { "MUNCHLAX", 0, 0, R_RARO, 0x8C4D, 135, 85, 40, 5, TYPE_NORMAL, TYPE_NONE, 0 },  // 446: standalone egg; evolution not configured
  { "RIOLU", 0, 0, R_RARO, 0xA2A5, 40, 70, 40, 60, TYPE_FIGHTING, TYPE_NONE, 0 },  // 447: standalone egg; evolution not configured
  { "LUCARIO", 0, 0, R_RARO, 0xA2A5, 70, 110, 70, 90, TYPE_FIGHTING, TYPE_STEEL, 4 },  // 448: standalone egg; evolution not configured
  { "HIPPOPOTAS", 0, 0, R_RARO, 0xB447, 68, 72, 78, 32, TYPE_GROUND, TYPE_NONE, 4 },  // 449: standalone egg; evolution not configured
  { "HIPPOWDON", 0, 0, R_RARO, 0xB447, 108, 112, 118, 47, TYPE_GROUND, TYPE_NONE, 4 },  // 450: standalone egg; evolution not configured
  { "SKORUPI", 0, 0, R_RARO, 0x8A73, 40, 50, 90, 65, TYPE_POISON, TYPE_BUG, 2 },  // 451: standalone egg; evolution not configured
  { "DRAPION", 0, 0, R_RARO, 0x8A73, 70, 90, 110, 95, TYPE_POISON, TYPE_DARK, 2 },  // 452: standalone egg; evolution not configured
  { "CROAGUNK", 0, 0, R_RARO, 0x8A73, 48, 61, 40, 50, TYPE_POISON, TYPE_FIGHTING, 0 },  // 453: standalone egg; evolution not configured
  { "TOXICROAK", 0, 0, R_RARO, 0x8A73, 83, 106, 65, 85, TYPE_POISON, TYPE_FIGHTING, 0 },  // 454: standalone egg; evolution not configured
  { "CARNIVINE", 0, 0, R_RARO, 0x3C49, 74, 100, 72, 46, TYPE_GRASS, TYPE_NONE, 2 },  // 455: standalone egg; evolution not configured
  { "FINNEON", 0, 0, R_RARO, 0x4C98, 49, 49, 56, 66, TYPE_WATER, TYPE_NONE, 1 },  // 456: standalone egg; evolution not configured
  { "LUMINEON", 0, 0, R_RARO, 0x4C98, 69, 69, 76, 91, TYPE_WATER, TYPE_NONE, 1 },  // 457: standalone egg; evolution not configured
  { "MANTYKE", 0, 0, R_RARO, 0x4C98, 45, 20, 50, 50, TYPE_WATER, TYPE_FLYING, 1 },  // 458: standalone egg; evolution not configured
  { "SNOVER", 0, 0, R_RARO, 0x3C49, 60, 62, 50, 40, TYPE_GRASS, TYPE_ICE, 5 },  // 459: standalone egg; evolution not configured
  { "ABOMASNOW", 0, 0, R_RARO, 0x3C49, 90, 92, 75, 60, TYPE_GRASS, TYPE_ICE, 5 },  // 460: standalone egg; evolution not configured
  { "WEAVILE", 0, 0, R_RARO, 0x5A47, 70, 120, 65, 125, TYPE_DARK, TYPE_ICE, 5 },  // 461: standalone egg; evolution not configured
  { "MAGNEZONE", 0, 0, R_RARO, 0xBCA1, 70, 70, 115, 60, TYPE_ELECTRIC, TYPE_STEEL, 4 },  // 462: standalone egg; evolution not configured
  { "LICKILICKY", 0, 0, R_RARO, 0x8C4D, 110, 85, 95, 50, TYPE_NORMAL, TYPE_NONE, 0 },  // 463: standalone egg; evolution not configured
  { "RHYPERIOR", 0, 0, R_RARO, 0xB447, 115, 140, 130, 40, TYPE_GROUND, TYPE_ROCK, 4 },  // 464: standalone egg; evolution not configured
  { "TANGROWTH", 0, 0, R_RARO, 0x3C49, 100, 100, 125, 50, TYPE_GRASS, TYPE_NONE, 2 },  // 465: standalone egg; evolution not configured
  { "ELECTIVIRE", 0, 0, R_RARO, 0xBCA1, 75, 123, 67, 95, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 466: standalone egg; evolution not configured
  { "MAGMORTAR", 0, 0, R_RARO, 0xEA87, 75, 95, 67, 83, TYPE_FIRE, TYPE_NONE, 3 },  // 467: standalone egg; evolution not configured
  { "TOGEKISS", 0, 0, R_RARO, 0xC333, 85, 50, 95, 80, TYPE_FAIRY, TYPE_FLYING, 0 },  // 468: standalone egg; evolution not configured
  { "YANMEGA", 0, 0, R_RARO, 0x7CC4, 86, 76, 86, 95, TYPE_BUG, TYPE_FLYING, 2 },  // 469: standalone egg; evolution not configured
  { "LEAFEON", 0, 0, R_RARO, 0x3C49, 65, 110, 130, 95, TYPE_GRASS, TYPE_NONE, 2 },  // 470: standalone egg; evolution not configured
  { "GLACEON", 0, 0, R_RARO, 0x4DB8, 65, 60, 110, 65, TYPE_ICE, TYPE_NONE, 5 },  // 471: standalone egg; evolution not configured
  { "GLISCOR", 0, 0, R_RARO, 0xB447, 75, 95, 125, 95, TYPE_GROUND, TYPE_FLYING, 4 },  // 472: standalone egg; evolution not configured
  { "MAMOSWINE", 0, 0, R_RARO, 0x4DB8, 110, 130, 80, 80, TYPE_ICE, TYPE_GROUND, 5 },  // 473: standalone egg; evolution not configured
  { "PORYGON-Z", 0, 0, R_RARO, 0x8C4D, 85, 80, 70, 90, TYPE_NORMAL, TYPE_NONE, 0 },  // 474: standalone egg; evolution not configured
  { "GALLADE", 0, 0, R_RARO, 0xD28F, 68, 125, 65, 80, TYPE_PSYCHIC, TYPE_FIGHTING, 0 },  // 475: standalone egg; evolution not configured
  { "PROBOPASS", 0, 0, R_RARO, 0x9407, 60, 55, 145, 40, TYPE_ROCK, TYPE_STEEL, 4 },  // 476: standalone egg; evolution not configured
  { "DUSKNOIR", 0, 0, R_RARO, 0x6AD3, 45, 100, 135, 45, TYPE_GHOST, TYPE_NONE, 0 },  // 477: standalone egg; evolution not configured
  { "FROSLASS", 0, 0, R_RARO, 0x4DB8, 70, 80, 70, 110, TYPE_ICE, TYPE_GHOST, 5 },  // 478: standalone egg; evolution not configured
  { "ROTOM", 0, 0, R_RARO, 0xBCA1, 50, 50, 77, 91, TYPE_ELECTRIC, TYPE_GHOST, 0 },  // 479: standalone egg; evolution not configured
  { "UXIE", 0, 0, R_LEGENDARIO, 0xD28F, 75, 75, 130, 95, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 480: standalone egg; evolution not configured
  { "MESPRIT", 0, 0, R_LEGENDARIO, 0xD28F, 80, 105, 105, 80, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 481: standalone egg; evolution not configured
  { "AZELF", 0, 0, R_LEGENDARIO, 0xD28F, 75, 125, 70, 115, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 482: standalone egg; evolution not configured
  { "DIALGA", 0, 0, R_LEGENDARIO, 0x6BF1, 100, 120, 120, 90, TYPE_STEEL, TYPE_DRAGON, 4 },  // 483: standalone egg; evolution not configured
  { "PALKIA", 0, 0, R_LEGENDARIO, 0x4C98, 90, 120, 100, 100, TYPE_WATER, TYPE_DRAGON, 1 },  // 484: standalone egg; evolution not configured
  { "HEATRAN", 0, 0, R_LEGENDARIO, 0xEA87, 91, 90, 106, 77, TYPE_FIRE, TYPE_STEEL, 3 },  // 485: standalone egg; evolution not configured
  { "REGIGIGAS", 0, 0, R_LEGENDARIO, 0x8C4D, 110, 160, 110, 100, TYPE_NORMAL, TYPE_NONE, 0 },  // 486: standalone egg; evolution not configured
  { "GIRATINA", 0, 0, R_LEGENDARIO, 0x6AD3, 150, 100, 120, 90, TYPE_GHOST, TYPE_DRAGON, 0 },  // 487: standalone egg; evolution not configured
  { "CRESSELIA", 0, 0, R_LEGENDARIO, 0xD28F, 120, 70, 110, 85, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 488: standalone egg; evolution not configured
  { "PHIONE", 0, 0, R_LEGENDARIO, 0x4C98, 80, 80, 80, 80, TYPE_WATER, TYPE_NONE, 1 },  // 489: standalone egg; evolution not configured
  { "MANAPHY", 0, 0, R_LEGENDARIO, 0x4C98, 100, 100, 100, 100, TYPE_WATER, TYPE_NONE, 1 },  // 490: standalone egg; evolution not configured
  { "DARKRAI", 0, 0, R_LEGENDARIO, 0x5A47, 70, 90, 90, 125, TYPE_DARK, TYPE_NONE, 2 },  // 491: standalone egg; evolution not configured
  { "SHAYMIN", 0, 0, R_LEGENDARIO, 0x3C49, 100, 100, 100, 100, TYPE_GRASS, TYPE_NONE, 2 },  // 492: standalone egg; evolution not configured
  { "ARCEUS", 0, 0, R_LEGENDARIO, 0x8C4D, 120, 120, 120, 120, TYPE_NORMAL, TYPE_NONE, 0 },  // 493: standalone egg; evolution not configured
  { "VICTINI", 0, 0, R_LEGENDARIO, 0xD28F, 100, 100, 100, 100, TYPE_PSYCHIC, TYPE_FIRE, 3 },  // 494: standalone egg; evolution not configured
  { "SNIVY", 0, 0, R_RARO, 0x3C49, 45, 45, 55, 63, TYPE_GRASS, TYPE_NONE, 2 },  // 495: standalone egg; evolution not configured
  { "SERVINE", 0, 0, R_RARO, 0x3C49, 60, 60, 75, 83, TYPE_GRASS, TYPE_NONE, 2 },  // 496: standalone egg; evolution not configured
  { "SERPERIOR", 0, 0, R_RARO, 0x3C49, 75, 75, 95, 113, TYPE_GRASS, TYPE_NONE, 2 },  // 497: standalone egg; evolution not configured
  { "TEPIG", 0, 0, R_RARO, 0xEA87, 65, 63, 45, 45, TYPE_FIRE, TYPE_NONE, 3 },  // 498: standalone egg; evolution not configured
  { "PIGNITE", 0, 0, R_RARO, 0xEA87, 90, 93, 55, 55, TYPE_FIRE, TYPE_FIGHTING, 3 },  // 499: standalone egg; evolution not configured
  { "EMBOAR", 0, 0, R_RARO, 0xEA87, 110, 123, 65, 65, TYPE_FIRE, TYPE_FIGHTING, 3 },  // 500: standalone egg; evolution not configured
  { "OSHAWOTT", 0, 0, R_RARO, 0x4C98, 55, 55, 45, 45, TYPE_WATER, TYPE_NONE, 1 },  // 501: standalone egg; evolution not configured
  { "DEWOTT", 0, 0, R_RARO, 0x4C98, 75, 75, 60, 60, TYPE_WATER, TYPE_NONE, 1 },  // 502: standalone egg; evolution not configured
  { "SAMUROTT", 0, 0, R_RARO, 0x4C98, 95, 100, 85, 70, TYPE_WATER, TYPE_NONE, 1 },  // 503: standalone egg; evolution not configured
  { "PATRAT", 0, 0, R_RARO, 0x8C4D, 45, 55, 39, 42, TYPE_NORMAL, TYPE_NONE, 0 },  // 504: standalone egg; evolution not configured
  { "WATCHOG", 0, 0, R_RARO, 0x8C4D, 60, 85, 69, 77, TYPE_NORMAL, TYPE_NONE, 0 },  // 505: standalone egg; evolution not configured
  { "LILLIPUP", 0, 0, R_RARO, 0x8C4D, 45, 60, 45, 55, TYPE_NORMAL, TYPE_NONE, 0 },  // 506: standalone egg; evolution not configured
  { "HERDIER", 0, 0, R_RARO, 0x8C4D, 65, 80, 65, 60, TYPE_NORMAL, TYPE_NONE, 0 },  // 507: standalone egg; evolution not configured
  { "STOUTLAND", 0, 0, R_RARO, 0x8C4D, 85, 110, 90, 80, TYPE_NORMAL, TYPE_NONE, 0 },  // 508: standalone egg; evolution not configured
  { "PURRLOIN", 0, 0, R_RARO, 0x5A47, 41, 50, 37, 66, TYPE_DARK, TYPE_NONE, 2 },  // 509: standalone egg; evolution not configured
  { "LIEPARD", 0, 0, R_RARO, 0x5A47, 64, 88, 50, 106, TYPE_DARK, TYPE_NONE, 2 },  // 510: standalone egg; evolution not configured
  { "PANSAGE", 0, 0, R_RARO, 0x3C49, 50, 53, 48, 64, TYPE_GRASS, TYPE_NONE, 2 },  // 511: standalone egg; evolution not configured
  { "SIMISAGE", 0, 0, R_RARO, 0x3C49, 75, 98, 63, 101, TYPE_GRASS, TYPE_NONE, 2 },  // 512: standalone egg; evolution not configured
  { "PANSEAR", 0, 0, R_RARO, 0xEA87, 50, 53, 48, 64, TYPE_FIRE, TYPE_NONE, 3 },  // 513: standalone egg; evolution not configured
  { "SIMISEAR", 0, 0, R_RARO, 0xEA87, 75, 98, 63, 101, TYPE_FIRE, TYPE_NONE, 3 },  // 514: standalone egg; evolution not configured
  { "PANPOUR", 0, 0, R_RARO, 0x4C98, 50, 53, 48, 64, TYPE_WATER, TYPE_NONE, 1 },  // 515: standalone egg; evolution not configured
  { "SIMIPOUR", 0, 0, R_RARO, 0x4C98, 75, 98, 63, 101, TYPE_WATER, TYPE_NONE, 1 },  // 516: standalone egg; evolution not configured
  { "MUNNA", 0, 0, R_RARO, 0xD28F, 76, 25, 45, 24, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 517: standalone egg; evolution not configured
  { "MUSHARNA", 0, 0, R_RARO, 0xD28F, 116, 55, 85, 29, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 518: standalone egg; evolution not configured
  { "PIDOVE", 0, 0, R_RARO, 0x8C4D, 50, 55, 50, 43, TYPE_NORMAL, TYPE_FLYING, 0 },  // 519: standalone egg; evolution not configured
  { "TRANQUILL", 0, 0, R_RARO, 0x8C4D, 62, 77, 62, 65, TYPE_NORMAL, TYPE_FLYING, 0 },  // 520: standalone egg; evolution not configured
  { "UNFEZANT", 0, 0, R_RARO, 0x8C4D, 80, 115, 80, 93, TYPE_NORMAL, TYPE_FLYING, 0 },  // 521: standalone egg; evolution not configured
  { "BLITZLE", 0, 0, R_RARO, 0xBCA1, 45, 60, 32, 76, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 522: standalone egg; evolution not configured
  { "ZEBSTRIKA", 0, 0, R_RARO, 0xBCA1, 75, 100, 63, 116, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 523: standalone egg; evolution not configured
  { "ROGGENROLA", 0, 0, R_RARO, 0x9407, 55, 75, 85, 15, TYPE_ROCK, TYPE_NONE, 4 },  // 524: standalone egg; evolution not configured
  { "BOLDORE", 0, 0, R_RARO, 0x9407, 70, 105, 105, 20, TYPE_ROCK, TYPE_NONE, 4 },  // 525: standalone egg; evolution not configured
  { "GIGALITH", 0, 0, R_RARO, 0x9407, 85, 135, 130, 25, TYPE_ROCK, TYPE_NONE, 4 },  // 526: standalone egg; evolution not configured
  { "WOOBAT", 0, 0, R_RARO, 0xD28F, 65, 45, 43, 72, TYPE_PSYCHIC, TYPE_FLYING, 0 },  // 527: standalone egg; evolution not configured
  { "SWOOBAT", 0, 0, R_RARO, 0xD28F, 67, 57, 55, 114, TYPE_PSYCHIC, TYPE_FLYING, 0 },  // 528: standalone egg; evolution not configured
  { "DRILBUR", 0, 0, R_RARO, 0xB447, 60, 85, 40, 68, TYPE_GROUND, TYPE_NONE, 4 },  // 529: standalone egg; evolution not configured
  { "EXCADRILL", 0, 0, R_RARO, 0xB447, 110, 135, 60, 88, TYPE_GROUND, TYPE_STEEL, 4 },  // 530: standalone egg; evolution not configured
  { "AUDINO", 0, 0, R_RARO, 0x8C4D, 103, 60, 86, 50, TYPE_NORMAL, TYPE_NONE, 0 },  // 531: standalone egg; evolution not configured
  { "TIMBURR", 0, 0, R_RARO, 0xA2A5, 75, 80, 55, 35, TYPE_FIGHTING, TYPE_NONE, 0 },  // 532: standalone egg; evolution not configured
  { "GURDURR", 0, 0, R_RARO, 0xA2A5, 85, 105, 85, 40, TYPE_FIGHTING, TYPE_NONE, 0 },  // 533: standalone egg; evolution not configured
  { "CONKELDURR", 0, 0, R_RARO, 0xA2A5, 105, 140, 95, 45, TYPE_FIGHTING, TYPE_NONE, 0 },  // 534: standalone egg; evolution not configured
  { "TYMPOLE", 0, 0, R_RARO, 0x4C98, 50, 50, 40, 64, TYPE_WATER, TYPE_NONE, 1 },  // 535: standalone egg; evolution not configured
  { "PALPITOAD", 0, 0, R_RARO, 0x4C98, 75, 65, 55, 69, TYPE_WATER, TYPE_GROUND, 1 },  // 536: standalone egg; evolution not configured
  { "SEISMITOAD", 0, 0, R_RARO, 0x4C98, 105, 95, 75, 74, TYPE_WATER, TYPE_GROUND, 1 },  // 537: standalone egg; evolution not configured
  { "THROH", 0, 0, R_RARO, 0xA2A5, 120, 100, 85, 45, TYPE_FIGHTING, TYPE_NONE, 0 },  // 538: standalone egg; evolution not configured
  { "SAWK", 0, 0, R_RARO, 0xA2A5, 75, 125, 75, 85, TYPE_FIGHTING, TYPE_NONE, 0 },  // 539: standalone egg; evolution not configured
  { "SEWADDLE", 0, 0, R_RARO, 0x7CC4, 45, 53, 70, 42, TYPE_BUG, TYPE_GRASS, 2 },  // 540: standalone egg; evolution not configured
  { "SWADLOON", 0, 0, R_RARO, 0x7CC4, 55, 63, 90, 42, TYPE_BUG, TYPE_GRASS, 2 },  // 541: standalone egg; evolution not configured
  { "LEAVANNY", 0, 0, R_RARO, 0x7CC4, 75, 103, 80, 92, TYPE_BUG, TYPE_GRASS, 2 },  // 542: standalone egg; evolution not configured
  { "VENIPEDE", 0, 0, R_RARO, 0x7CC4, 30, 45, 59, 57, TYPE_BUG, TYPE_POISON, 2 },  // 543: standalone egg; evolution not configured
  { "WHIRLIPEDE", 0, 0, R_RARO, 0x7CC4, 40, 55, 99, 47, TYPE_BUG, TYPE_POISON, 2 },  // 544: standalone egg; evolution not configured
  { "SCOLIPEDE", 0, 0, R_RARO, 0x7CC4, 60, 100, 89, 112, TYPE_BUG, TYPE_POISON, 2 },  // 545: standalone egg; evolution not configured
  { "COTTONEE", 0, 0, R_RARO, 0x3C49, 40, 27, 60, 66, TYPE_GRASS, TYPE_FAIRY, 2 },  // 546: standalone egg; evolution not configured
  { "WHIMSICOTT", 0, 0, R_RARO, 0x3C49, 60, 67, 85, 116, TYPE_GRASS, TYPE_FAIRY, 2 },  // 547: standalone egg; evolution not configured
  { "PETILIL", 0, 0, R_RARO, 0x3C49, 45, 35, 50, 30, TYPE_GRASS, TYPE_NONE, 2 },  // 548: standalone egg; evolution not configured
  { "LILLIGANT", 0, 0, R_RARO, 0x3C49, 70, 60, 75, 90, TYPE_GRASS, TYPE_NONE, 2 },  // 549: standalone egg; evolution not configured
  { "BASCULIN", 0, 0, R_RARO, 0x4C98, 70, 92, 65, 98, TYPE_WATER, TYPE_NONE, 1 },  // 550: standalone egg; evolution not configured
  { "SANDILE", 0, 0, R_RARO, 0xB447, 50, 72, 35, 65, TYPE_GROUND, TYPE_DARK, 2 },  // 551: standalone egg; evolution not configured
  { "KROKOROK", 0, 0, R_RARO, 0xB447, 60, 82, 45, 74, TYPE_GROUND, TYPE_DARK, 2 },  // 552: standalone egg; evolution not configured
  { "KROOKODILE", 0, 0, R_RARO, 0xB447, 95, 117, 80, 92, TYPE_GROUND, TYPE_DARK, 2 },  // 553: standalone egg; evolution not configured
  { "DARUMAKA", 0, 0, R_RARO, 0xEA87, 70, 90, 45, 50, TYPE_FIRE, TYPE_NONE, 3 },  // 554: standalone egg; evolution not configured
  { "DARMANITAN", 0, 0, R_RARO, 0xEA87, 105, 140, 55, 95, TYPE_FIRE, TYPE_NONE, 3 },  // 555: standalone egg; evolution not configured
  { "MARACTUS", 0, 0, R_RARO, 0x3C49, 75, 86, 67, 60, TYPE_GRASS, TYPE_NONE, 2 },  // 556: standalone egg; evolution not configured
  { "DWEBBLE", 0, 0, R_RARO, 0x7CC4, 50, 65, 85, 55, TYPE_BUG, TYPE_ROCK, 2 },  // 557: standalone egg; evolution not configured
  { "CRUSTLE", 0, 0, R_RARO, 0x7CC4, 70, 105, 125, 45, TYPE_BUG, TYPE_ROCK, 2 },  // 558: standalone egg; evolution not configured
  { "SCRAGGY", 0, 0, R_RARO, 0x5A47, 50, 75, 70, 48, TYPE_DARK, TYPE_FIGHTING, 2 },  // 559: standalone egg; evolution not configured
  { "SCRAFTY", 0, 0, R_RARO, 0x5A47, 65, 90, 115, 58, TYPE_DARK, TYPE_FIGHTING, 2 },  // 560: standalone egg; evolution not configured
  { "SIGILYPH", 0, 0, R_RARO, 0xD28F, 72, 58, 80, 97, TYPE_PSYCHIC, TYPE_FLYING, 0 },  // 561: standalone egg; evolution not configured
  { "YAMASK", 0, 0, R_RARO, 0x6AD3, 38, 30, 85, 30, TYPE_GHOST, TYPE_NONE, 0 },  // 562: standalone egg; evolution not configured
  { "COFAGRIGUS", 0, 0, R_RARO, 0x6AD3, 58, 50, 145, 30, TYPE_GHOST, TYPE_NONE, 0 },  // 563: standalone egg; evolution not configured
  { "TIRTOUGA", 0, 0, R_RARO, 0x4C98, 54, 78, 103, 22, TYPE_WATER, TYPE_ROCK, 1 },  // 564: standalone egg; evolution not configured
  { "CARRACOSTA", 0, 0, R_RARO, 0x4C98, 74, 108, 133, 32, TYPE_WATER, TYPE_ROCK, 1 },  // 565: standalone egg; evolution not configured
  { "ARCHEN", 0, 0, R_RARO, 0x9407, 55, 112, 45, 70, TYPE_ROCK, TYPE_FLYING, 4 },  // 566: standalone egg; evolution not configured
  { "ARCHEOPS", 0, 0, R_RARO, 0x9407, 75, 140, 65, 110, TYPE_ROCK, TYPE_FLYING, 4 },  // 567: standalone egg; evolution not configured
  { "TRUBBISH", 0, 0, R_RARO, 0x8A73, 50, 50, 62, 65, TYPE_POISON, TYPE_NONE, 0 },  // 568: standalone egg; evolution not configured
  { "GARBODOR", 0, 0, R_RARO, 0x8A73, 80, 95, 82, 75, TYPE_POISON, TYPE_NONE, 0 },  // 569: standalone egg; evolution not configured
  { "ZORUA", 0, 0, R_RARO, 0x5A47, 40, 65, 40, 65, TYPE_DARK, TYPE_NONE, 2 },  // 570: standalone egg; evolution not configured
  { "ZOROARK", 0, 0, R_RARO, 0x5A47, 60, 105, 60, 105, TYPE_DARK, TYPE_NONE, 2 },  // 571: standalone egg; evolution not configured
  { "MINCCINO", 0, 0, R_RARO, 0x8C4D, 55, 50, 40, 75, TYPE_NORMAL, TYPE_NONE, 0 },  // 572: standalone egg; evolution not configured
  { "CINCCINO", 0, 0, R_RARO, 0x8C4D, 75, 95, 60, 115, TYPE_NORMAL, TYPE_NONE, 0 },  // 573: standalone egg; evolution not configured
  { "GOTHITA", 0, 0, R_RARO, 0xD28F, 45, 30, 50, 45, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 574: standalone egg; evolution not configured
  { "GOTHORITA", 0, 0, R_RARO, 0xD28F, 60, 45, 70, 55, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 575: standalone egg; evolution not configured
  { "GOTHITELLE", 0, 0, R_RARO, 0xD28F, 70, 55, 95, 65, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 576: standalone egg; evolution not configured
  { "SOLOSIS", 0, 0, R_RARO, 0xD28F, 45, 30, 40, 20, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 577: standalone egg; evolution not configured
  { "DUOSION", 0, 0, R_RARO, 0xD28F, 65, 40, 50, 30, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 578: standalone egg; evolution not configured
  { "REUNICLUS", 0, 0, R_RARO, 0xD28F, 110, 65, 75, 30, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 579: standalone egg; evolution not configured
  { "DUCKLETT", 0, 0, R_RARO, 0x4C98, 62, 44, 50, 55, TYPE_WATER, TYPE_FLYING, 1 },  // 580: standalone egg; evolution not configured
  { "SWANNA", 0, 0, R_RARO, 0x4C98, 75, 87, 63, 98, TYPE_WATER, TYPE_FLYING, 1 },  // 581: standalone egg; evolution not configured
  { "VANILLITE", 0, 0, R_RARO, 0x4DB8, 36, 50, 50, 44, TYPE_ICE, TYPE_NONE, 5 },  // 582: standalone egg; evolution not configured
  { "VANILLISH", 0, 0, R_RARO, 0x4DB8, 51, 65, 65, 59, TYPE_ICE, TYPE_NONE, 5 },  // 583: standalone egg; evolution not configured
  { "VANILLUXE", 0, 0, R_RARO, 0x4DB8, 71, 95, 85, 79, TYPE_ICE, TYPE_NONE, 5 },  // 584: standalone egg; evolution not configured
  { "DEERLING", 0, 0, R_RARO, 0x8C4D, 60, 60, 50, 75, TYPE_NORMAL, TYPE_GRASS, 2 },  // 585: standalone egg; evolution not configured
  { "SAWSBUCK", 0, 0, R_RARO, 0x8C4D, 80, 100, 70, 95, TYPE_NORMAL, TYPE_GRASS, 2 },  // 586: standalone egg; evolution not configured
  { "EMOLGA", 0, 0, R_RARO, 0xBCA1, 55, 75, 60, 103, TYPE_ELECTRIC, TYPE_FLYING, 0 },  // 587: standalone egg; evolution not configured
  { "KARRABLAST", 0, 0, R_RARO, 0x7CC4, 50, 75, 45, 60, TYPE_BUG, TYPE_NONE, 2 },  // 588: standalone egg; evolution not configured
  { "ESCAVALIER", 0, 0, R_RARO, 0x7CC4, 70, 135, 105, 20, TYPE_BUG, TYPE_STEEL, 2 },  // 589: standalone egg; evolution not configured
  { "FOONGUS", 0, 0, R_RARO, 0x3C49, 69, 55, 45, 15, TYPE_GRASS, TYPE_POISON, 2 },  // 590: standalone egg; evolution not configured
  { "AMOONGUSS", 0, 0, R_RARO, 0x3C49, 114, 85, 70, 30, TYPE_GRASS, TYPE_POISON, 2 },  // 591: standalone egg; evolution not configured
  { "FRILLISH", 0, 0, R_RARO, 0x4C98, 55, 40, 50, 40, TYPE_WATER, TYPE_GHOST, 1 },  // 592: standalone egg; evolution not configured
  { "JELLICENT", 0, 0, R_RARO, 0x4C98, 100, 60, 70, 60, TYPE_WATER, TYPE_GHOST, 1 },  // 593: standalone egg; evolution not configured
  { "ALOMOMOLA", 0, 0, R_RARO, 0x4C98, 165, 75, 80, 65, TYPE_WATER, TYPE_NONE, 1 },  // 594: standalone egg; evolution not configured
  { "JOLTIK", 0, 0, R_RARO, 0x7CC4, 50, 47, 50, 65, TYPE_BUG, TYPE_ELECTRIC, 2 },  // 595: standalone egg; evolution not configured
  { "GALVANTULA", 0, 0, R_RARO, 0x7CC4, 70, 77, 60, 108, TYPE_BUG, TYPE_ELECTRIC, 2 },  // 596: standalone egg; evolution not configured
  { "FERROSEED", 0, 0, R_RARO, 0x3C49, 44, 50, 91, 10, TYPE_GRASS, TYPE_STEEL, 2 },  // 597: standalone egg; evolution not configured
  { "FERROTHORN", 0, 0, R_RARO, 0x3C49, 74, 94, 131, 20, TYPE_GRASS, TYPE_STEEL, 2 },  // 598: standalone egg; evolution not configured
  { "KLINK", 0, 0, R_RARO, 0x6BF1, 40, 55, 70, 30, TYPE_STEEL, TYPE_NONE, 4 },  // 599: standalone egg; evolution not configured
  { "KLANG", 0, 0, R_RARO, 0x6BF1, 60, 80, 95, 50, TYPE_STEEL, TYPE_NONE, 4 },  // 600: standalone egg; evolution not configured
  { "KLINKLANG", 0, 0, R_RARO, 0x6BF1, 60, 100, 115, 90, TYPE_STEEL, TYPE_NONE, 4 },  // 601: standalone egg; evolution not configured
  { "TYNAMO", 0, 0, R_RARO, 0xBCA1, 35, 55, 40, 60, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 602: standalone egg; evolution not configured
  { "EELEKTRIK", 0, 0, R_RARO, 0xBCA1, 65, 85, 70, 40, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 603: standalone egg; evolution not configured
  { "EELEKTROSS", 0, 0, R_RARO, 0xBCA1, 85, 115, 80, 50, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 604: standalone egg; evolution not configured
  { "ELGYEM", 0, 0, R_RARO, 0xD28F, 55, 55, 55, 30, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 605: standalone egg; evolution not configured
  { "BEHEEYEM", 0, 0, R_RARO, 0xD28F, 75, 75, 75, 40, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 606: standalone egg; evolution not configured
  { "LITWICK", 0, 0, R_RARO, 0x6AD3, 50, 30, 55, 20, TYPE_GHOST, TYPE_FIRE, 3 },  // 607: standalone egg; evolution not configured
  { "LAMPENT", 0, 0, R_RARO, 0x6AD3, 60, 40, 60, 55, TYPE_GHOST, TYPE_FIRE, 3 },  // 608: standalone egg; evolution not configured
  { "CHANDELURE", 0, 0, R_RARO, 0x6AD3, 60, 55, 90, 80, TYPE_GHOST, TYPE_FIRE, 3 },  // 609: standalone egg; evolution not configured
  { "AXEW", 0, 0, R_RARO, 0x5A98, 46, 87, 60, 57, TYPE_DRAGON, TYPE_NONE, 0 },  // 610: standalone egg; evolution not configured
  { "FRAXURE", 0, 0, R_RARO, 0x5A98, 66, 117, 70, 67, TYPE_DRAGON, TYPE_NONE, 0 },  // 611: standalone egg; evolution not configured
  { "HAXORUS", 0, 0, R_RARO, 0x5A98, 76, 147, 90, 97, TYPE_DRAGON, TYPE_NONE, 0 },  // 612: standalone egg; evolution not configured
  { "CUBCHOO", 0, 0, R_RARO, 0x4DB8, 55, 70, 40, 40, TYPE_ICE, TYPE_NONE, 5 },  // 613: standalone egg; evolution not configured
  { "BEARTIC", 0, 0, R_RARO, 0x4DB8, 95, 130, 80, 50, TYPE_ICE, TYPE_NONE, 5 },  // 614: standalone egg; evolution not configured
  { "CRYOGONAL", 0, 0, R_RARO, 0x4DB8, 80, 50, 50, 105, TYPE_ICE, TYPE_NONE, 5 },  // 615: standalone egg; evolution not configured
  { "SHELMET", 0, 0, R_RARO, 0x7CC4, 50, 40, 85, 25, TYPE_BUG, TYPE_NONE, 2 },  // 616: standalone egg; evolution not configured
  { "ACCELGOR", 0, 0, R_RARO, 0x7CC4, 80, 70, 40, 145, TYPE_BUG, TYPE_NONE, 2 },  // 617: standalone egg; evolution not configured
  { "STUNFISK", 0, 0, R_RARO, 0xB447, 109, 66, 84, 32, TYPE_GROUND, TYPE_ELECTRIC, 4 },  // 618: standalone egg; evolution not configured
  { "MIENFOO", 0, 0, R_RARO, 0xA2A5, 45, 85, 50, 65, TYPE_FIGHTING, TYPE_NONE, 0 },  // 619: standalone egg; evolution not configured
  { "MIENSHAO", 0, 0, R_RARO, 0xA2A5, 65, 125, 60, 105, TYPE_FIGHTING, TYPE_NONE, 0 },  // 620: standalone egg; evolution not configured
  { "DRUDDIGON", 0, 0, R_RARO, 0x5A98, 77, 120, 90, 48, TYPE_DRAGON, TYPE_NONE, 0 },  // 621: standalone egg; evolution not configured
  { "GOLETT", 0, 0, R_RARO, 0xB447, 59, 74, 50, 35, TYPE_GROUND, TYPE_GHOST, 4 },  // 622: standalone egg; evolution not configured
  { "GOLURK", 0, 0, R_RARO, 0xB447, 89, 124, 80, 55, TYPE_GROUND, TYPE_GHOST, 4 },  // 623: standalone egg; evolution not configured
  { "PAWNIARD", 0, 0, R_RARO, 0x5A47, 45, 85, 70, 60, TYPE_DARK, TYPE_STEEL, 2 },  // 624: standalone egg; evolution not configured
  { "BISHARP", 0, 0, R_RARO, 0x5A47, 65, 125, 100, 70, TYPE_DARK, TYPE_STEEL, 2 },  // 625: standalone egg; evolution not configured
  { "BOUFFALANT", 0, 0, R_RARO, 0x8C4D, 95, 110, 95, 55, TYPE_NORMAL, TYPE_NONE, 0 },  // 626: standalone egg; evolution not configured
  { "RUFFLET", 0, 0, R_RARO, 0x8C4D, 70, 83, 50, 60, TYPE_NORMAL, TYPE_FLYING, 0 },  // 627: standalone egg; evolution not configured
  { "BRAVIARY", 0, 0, R_RARO, 0x8C4D, 100, 123, 75, 80, TYPE_NORMAL, TYPE_FLYING, 0 },  // 628: standalone egg; evolution not configured
  { "VULLABY", 0, 0, R_RARO, 0x5A47, 70, 55, 75, 60, TYPE_DARK, TYPE_FLYING, 2 },  // 629: standalone egg; evolution not configured
  { "MANDIBUZZ", 0, 0, R_RARO, 0x5A47, 110, 65, 105, 80, TYPE_DARK, TYPE_FLYING, 2 },  // 630: standalone egg; evolution not configured
  { "HEATMOR", 0, 0, R_RARO, 0xEA87, 85, 97, 66, 65, TYPE_FIRE, TYPE_NONE, 3 },  // 631: standalone egg; evolution not configured
  { "DURANT", 0, 0, R_RARO, 0x7CC4, 58, 109, 112, 109, TYPE_BUG, TYPE_STEEL, 2 },  // 632: standalone egg; evolution not configured
  { "DEINO", 0, 0, R_RARO, 0x5A47, 52, 65, 50, 38, TYPE_DARK, TYPE_DRAGON, 2 },  // 633: standalone egg; evolution not configured
  { "ZWEILOUS", 0, 0, R_RARO, 0x5A47, 72, 85, 70, 58, TYPE_DARK, TYPE_DRAGON, 2 },  // 634: standalone egg; evolution not configured
  { "HYDREIGON", 0, 0, R_RARO, 0x5A47, 92, 105, 90, 98, TYPE_DARK, TYPE_DRAGON, 2 },  // 635: standalone egg; evolution not configured
  { "LARVESTA", 0, 0, R_RARO, 0x7CC4, 55, 85, 55, 60, TYPE_BUG, TYPE_FIRE, 3 },  // 636: standalone egg; evolution not configured
  { "VOLCARONA", 0, 0, R_RARO, 0x7CC4, 85, 60, 65, 100, TYPE_BUG, TYPE_FIRE, 3 },  // 637: standalone egg; evolution not configured
  { "COBALION", 0, 0, R_LEGENDARIO, 0x6BF1, 91, 90, 129, 108, TYPE_STEEL, TYPE_FIGHTING, 4 },  // 638: standalone egg; evolution not configured
  { "TERRAKION", 0, 0, R_LEGENDARIO, 0x9407, 91, 129, 90, 108, TYPE_ROCK, TYPE_FIGHTING, 4 },  // 639: standalone egg; evolution not configured
  { "VIRIZION", 0, 0, R_LEGENDARIO, 0x3C49, 91, 90, 72, 108, TYPE_GRASS, TYPE_FIGHTING, 2 },  // 640: standalone egg; evolution not configured
  { "TORNADUS", 0, 0, R_LEGENDARIO, 0x8C4D, 79, 115, 70, 111, TYPE_FLYING, TYPE_NONE, 0 },  // 641: standalone egg; evolution not configured
  { "THUNDURUS", 0, 0, R_LEGENDARIO, 0xBCA1, 79, 115, 70, 111, TYPE_ELECTRIC, TYPE_FLYING, 0 },  // 642: standalone egg; evolution not configured
  { "RESHIRAM", 0, 0, R_LEGENDARIO, 0x5A98, 100, 120, 100, 90, TYPE_DRAGON, TYPE_FIRE, 3 },  // 643: standalone egg; evolution not configured
  { "ZEKROM", 0, 0, R_LEGENDARIO, 0x5A98, 100, 150, 120, 90, TYPE_DRAGON, TYPE_ELECTRIC, 0 },  // 644: standalone egg; evolution not configured
  { "LANDORUS", 0, 0, R_LEGENDARIO, 0xB447, 89, 125, 90, 101, TYPE_GROUND, TYPE_FLYING, 4 },  // 645: standalone egg; evolution not configured
  { "KYUREM", 0, 0, R_LEGENDARIO, 0x5A98, 125, 130, 90, 95, TYPE_DRAGON, TYPE_ICE, 5 },  // 646: standalone egg; evolution not configured
  { "KELDEO", 0, 0, R_LEGENDARIO, 0x4C98, 91, 72, 90, 108, TYPE_WATER, TYPE_FIGHTING, 1 },  // 647: standalone egg; evolution not configured
  { "MELOETTA", 0, 0, R_LEGENDARIO, 0x8C4D, 100, 77, 77, 90, TYPE_NORMAL, TYPE_PSYCHIC, 0 },  // 648: standalone egg; evolution not configured
  { "GENESECT", 0, 0, R_LEGENDARIO, 0x7CC4, 71, 120, 95, 99, TYPE_BUG, TYPE_STEEL, 2 },  // 649: standalone egg; evolution not configured
  { "CHESPIN", 0, 0, R_RARO, 0x3C49, 56, 61, 65, 38, TYPE_GRASS, TYPE_NONE, 2 },  // 650: standalone egg; evolution not configured
  { "QUILLADIN", 0, 0, R_RARO, 0x3C49, 61, 78, 95, 57, TYPE_GRASS, TYPE_NONE, 2 },  // 651: standalone egg; evolution not configured
  { "CHESNAUGHT", 0, 0, R_RARO, 0x3C49, 88, 107, 122, 64, TYPE_GRASS, TYPE_FIGHTING, 2 },  // 652: standalone egg; evolution not configured
  { "FENNEKIN", 0, 0, R_RARO, 0xEA87, 40, 45, 40, 60, TYPE_FIRE, TYPE_NONE, 3 },  // 653: standalone egg; evolution not configured
  { "BRAIXEN", 0, 0, R_RARO, 0xEA87, 59, 59, 58, 73, TYPE_FIRE, TYPE_NONE, 3 },  // 654: standalone egg; evolution not configured
  { "DELPHOX", 0, 0, R_RARO, 0xEA87, 75, 69, 72, 104, TYPE_FIRE, TYPE_PSYCHIC, 3 },  // 655: standalone egg; evolution not configured
  { "FROAKIE", 0, 0, R_RARO, 0x4C98, 41, 56, 40, 71, TYPE_WATER, TYPE_NONE, 1 },  // 656: standalone egg; evolution not configured
  { "FROGADIER", 0, 0, R_RARO, 0x4C98, 54, 63, 52, 97, TYPE_WATER, TYPE_NONE, 1 },  // 657: standalone egg; evolution not configured
  { "GRENINJA", 0, 0, R_RARO, 0x4C98, 72, 95, 67, 122, TYPE_WATER, TYPE_DARK, 1 },  // 658: standalone egg; evolution not configured
  { "BUNNELBY", 0, 0, R_RARO, 0x8C4D, 38, 36, 38, 57, TYPE_NORMAL, TYPE_NONE, 0 },  // 659: standalone egg; evolution not configured
  { "DIGGERSBY", 0, 0, R_RARO, 0x8C4D, 85, 56, 77, 78, TYPE_NORMAL, TYPE_GROUND, 4 },  // 660: standalone egg; evolution not configured
  { "FLETCHLING", 0, 0, R_RARO, 0x8C4D, 45, 50, 43, 62, TYPE_NORMAL, TYPE_FLYING, 0 },  // 661: standalone egg; evolution not configured
  { "FLETCHINDER", 0, 0, R_RARO, 0xEA87, 62, 73, 55, 84, TYPE_FIRE, TYPE_FLYING, 3 },  // 662: standalone egg; evolution not configured
  { "TALONFLAME", 0, 0, R_RARO, 0xEA87, 78, 81, 71, 126, TYPE_FIRE, TYPE_FLYING, 3 },  // 663: standalone egg; evolution not configured
  { "SCATTERBUG", 0, 0, R_RARO, 0x7CC4, 38, 35, 40, 35, TYPE_BUG, TYPE_NONE, 2 },  // 664: standalone egg; evolution not configured
  { "SPEWPA", 0, 0, R_RARO, 0x7CC4, 45, 22, 60, 29, TYPE_BUG, TYPE_NONE, 2 },  // 665: standalone egg; evolution not configured
  { "VIVILLON", 0, 0, R_RARO, 0x7CC4, 80, 52, 50, 89, TYPE_BUG, TYPE_FLYING, 2 },  // 666: standalone egg; evolution not configured
  { "LITLEO", 0, 0, R_RARO, 0xEA87, 62, 50, 58, 72, TYPE_FIRE, TYPE_NORMAL, 3 },  // 667: standalone egg; evolution not configured
  { "PYROAR", 0, 0, R_RARO, 0xEA87, 86, 68, 72, 106, TYPE_FIRE, TYPE_NORMAL, 3 },  // 668: standalone egg; evolution not configured
  { "FLABÉBÉ", 0, 0, R_RARO, 0xC333, 44, 38, 39, 42, TYPE_FAIRY, TYPE_NONE, 0 },  // 669: standalone egg; evolution not configured
  { "FLOETTE", 0, 0, R_RARO, 0xC333, 54, 45, 47, 52, TYPE_FAIRY, TYPE_NONE, 0 },  // 670: standalone egg; evolution not configured
  { "FLORGES", 0, 0, R_RARO, 0xC333, 78, 65, 68, 75, TYPE_FAIRY, TYPE_NONE, 0 },  // 671: standalone egg; evolution not configured
  { "SKIDDO", 0, 0, R_RARO, 0x3C49, 66, 65, 48, 52, TYPE_GRASS, TYPE_NONE, 2 },  // 672: standalone egg; evolution not configured
  { "GOGOAT", 0, 0, R_RARO, 0x3C49, 123, 100, 62, 68, TYPE_GRASS, TYPE_NONE, 2 },  // 673: standalone egg; evolution not configured
  { "PANCHAM", 0, 0, R_RARO, 0xA2A5, 67, 82, 62, 43, TYPE_FIGHTING, TYPE_NONE, 0 },  // 674: standalone egg; evolution not configured
  { "PANGORO", 0, 0, R_RARO, 0xA2A5, 95, 124, 78, 58, TYPE_FIGHTING, TYPE_DARK, 2 },  // 675: standalone egg; evolution not configured
  { "FURFROU", 0, 0, R_RARO, 0x8C4D, 75, 80, 60, 102, TYPE_NORMAL, TYPE_NONE, 0 },  // 676: standalone egg; evolution not configured
  { "ESPURR", 0, 0, R_RARO, 0xD28F, 62, 48, 54, 68, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 677: standalone egg; evolution not configured
  { "MEOWSTIC", 0, 0, R_RARO, 0xD28F, 74, 48, 76, 104, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 678: standalone egg; evolution not configured
  { "HONEDGE", 0, 0, R_RARO, 0x6BF1, 45, 80, 100, 28, TYPE_STEEL, TYPE_GHOST, 4 },  // 679: standalone egg; evolution not configured
  { "DOUBLADE", 0, 0, R_RARO, 0x6BF1, 59, 110, 150, 35, TYPE_STEEL, TYPE_GHOST, 4 },  // 680: standalone egg; evolution not configured
  { "AEGISLASH", 0, 0, R_RARO, 0x6BF1, 60, 50, 140, 60, TYPE_STEEL, TYPE_GHOST, 4 },  // 681: standalone egg; evolution not configured
  { "SPRITZEE", 0, 0, R_RARO, 0xC333, 78, 52, 60, 23, TYPE_FAIRY, TYPE_NONE, 0 },  // 682: standalone egg; evolution not configured
  { "AROMATISSE", 0, 0, R_RARO, 0xC333, 101, 72, 72, 29, TYPE_FAIRY, TYPE_NONE, 0 },  // 683: standalone egg; evolution not configured
  { "SWIRLIX", 0, 0, R_RARO, 0xC333, 62, 48, 66, 49, TYPE_FAIRY, TYPE_NONE, 0 },  // 684: standalone egg; evolution not configured
  { "SLURPUFF", 0, 0, R_RARO, 0xC333, 82, 80, 86, 72, TYPE_FAIRY, TYPE_NONE, 0 },  // 685: standalone egg; evolution not configured
  { "INKAY", 0, 0, R_RARO, 0x5A47, 53, 54, 53, 45, TYPE_DARK, TYPE_PSYCHIC, 2 },  // 686: standalone egg; evolution not configured
  { "MALAMAR", 0, 0, R_RARO, 0x5A47, 86, 92, 88, 73, TYPE_DARK, TYPE_PSYCHIC, 2 },  // 687: standalone egg; evolution not configured
  { "BINACLE", 0, 0, R_RARO, 0x9407, 42, 52, 67, 50, TYPE_ROCK, TYPE_WATER, 1 },  // 688: standalone egg; evolution not configured
  { "BARBARACLE", 0, 0, R_RARO, 0x9407, 72, 105, 115, 68, TYPE_ROCK, TYPE_WATER, 1 },  // 689: standalone egg; evolution not configured
  { "SKRELP", 0, 0, R_RARO, 0x8A73, 50, 60, 60, 30, TYPE_POISON, TYPE_WATER, 1 },  // 690: standalone egg; evolution not configured
  { "DRAGALGE", 0, 0, R_RARO, 0x8A73, 65, 75, 90, 44, TYPE_POISON, TYPE_DRAGON, 0 },  // 691: standalone egg; evolution not configured
  { "CLAUNCHER", 0, 0, R_RARO, 0x4C98, 50, 53, 62, 44, TYPE_WATER, TYPE_NONE, 1 },  // 692: standalone egg; evolution not configured
  { "CLAWITZER", 0, 0, R_RARO, 0x4C98, 71, 73, 88, 59, TYPE_WATER, TYPE_NONE, 1 },  // 693: standalone egg; evolution not configured
  { "HELIOPTILE", 0, 0, R_RARO, 0xBCA1, 44, 38, 33, 70, TYPE_ELECTRIC, TYPE_NORMAL, 0 },  // 694: standalone egg; evolution not configured
  { "HELIOLISK", 0, 0, R_RARO, 0xBCA1, 62, 55, 52, 109, TYPE_ELECTRIC, TYPE_NORMAL, 0 },  // 695: standalone egg; evolution not configured
  { "TYRUNT", 0, 0, R_RARO, 0x9407, 58, 89, 77, 48, TYPE_ROCK, TYPE_DRAGON, 4 },  // 696: standalone egg; evolution not configured
  { "TYRANTRUM", 0, 0, R_RARO, 0x9407, 82, 121, 119, 71, TYPE_ROCK, TYPE_DRAGON, 4 },  // 697: standalone egg; evolution not configured
  { "AMAURA", 0, 0, R_RARO, 0x9407, 77, 59, 50, 46, TYPE_ROCK, TYPE_ICE, 5 },  // 698: standalone egg; evolution not configured
  { "AURORUS", 0, 0, R_RARO, 0x9407, 123, 77, 72, 58, TYPE_ROCK, TYPE_ICE, 5 },  // 699: standalone egg; evolution not configured
  { "SYLVEON", 0, 0, R_RARO, 0xC333, 95, 65, 65, 60, TYPE_FAIRY, TYPE_NONE, 0 },  // 700: standalone egg; evolution not configured
  { "HAWLUCHA", 0, 0, R_RARO, 0xA2A5, 78, 92, 75, 118, TYPE_FIGHTING, TYPE_FLYING, 0 },  // 701: standalone egg; evolution not configured
  { "DEDENNE", 0, 0, R_RARO, 0xBCA1, 67, 58, 57, 101, TYPE_ELECTRIC, TYPE_FAIRY, 0 },  // 702: standalone egg; evolution not configured
  { "CARBINK", 0, 0, R_RARO, 0x9407, 50, 50, 150, 50, TYPE_ROCK, TYPE_FAIRY, 4 },  // 703: standalone egg; evolution not configured
  { "GOOMY", 0, 0, R_RARO, 0x5A98, 45, 50, 35, 40, TYPE_DRAGON, TYPE_NONE, 0 },  // 704: standalone egg; evolution not configured
  { "SLIGGOO", 0, 0, R_RARO, 0x5A98, 68, 75, 53, 60, TYPE_DRAGON, TYPE_NONE, 0 },  // 705: standalone egg; evolution not configured
  { "GOODRA", 0, 0, R_RARO, 0x5A98, 90, 100, 70, 80, TYPE_DRAGON, TYPE_NONE, 0 },  // 706: standalone egg; evolution not configured
  { "KLEFKI", 0, 0, R_RARO, 0x6BF1, 57, 80, 91, 75, TYPE_STEEL, TYPE_FAIRY, 4 },  // 707: standalone egg; evolution not configured
  { "PHANTUMP", 0, 0, R_RARO, 0x6AD3, 43, 70, 48, 38, TYPE_GHOST, TYPE_GRASS, 2 },  // 708: standalone egg; evolution not configured
  { "TREVENANT", 0, 0, R_RARO, 0x6AD3, 85, 110, 76, 56, TYPE_GHOST, TYPE_GRASS, 2 },  // 709: standalone egg; evolution not configured
  { "PUMPKABOO", 0, 0, R_RARO, 0x6AD3, 49, 66, 70, 51, TYPE_GHOST, TYPE_GRASS, 2 },  // 710: standalone egg; evolution not configured
  { "GOURGEIST", 0, 0, R_RARO, 0x6AD3, 65, 90, 122, 84, TYPE_GHOST, TYPE_GRASS, 2 },  // 711: standalone egg; evolution not configured
  { "BERGMITE", 0, 0, R_RARO, 0x4DB8, 55, 69, 85, 28, TYPE_ICE, TYPE_NONE, 5 },  // 712: standalone egg; evolution not configured
  { "AVALUGG", 0, 0, R_RARO, 0x4DB8, 95, 117, 184, 28, TYPE_ICE, TYPE_NONE, 5 },  // 713: standalone egg; evolution not configured
  { "NOIBAT", 0, 0, R_RARO, 0x8C4D, 40, 30, 35, 55, TYPE_FLYING, TYPE_DRAGON, 0 },  // 714: standalone egg; evolution not configured
  { "NOIVERN", 0, 0, R_RARO, 0x8C4D, 85, 70, 80, 123, TYPE_FLYING, TYPE_DRAGON, 0 },  // 715: standalone egg; evolution not configured
  { "XERNEAS", 0, 0, R_LEGENDARIO, 0xC333, 126, 131, 95, 99, TYPE_FAIRY, TYPE_NONE, 0 },  // 716: standalone egg; evolution not configured
  { "YVELTAL", 0, 0, R_LEGENDARIO, 0x5A47, 126, 131, 95, 99, TYPE_DARK, TYPE_FLYING, 2 },  // 717: standalone egg; evolution not configured
  { "ZYGARDE", 0, 0, R_LEGENDARIO, 0x5A98, 108, 100, 121, 95, TYPE_DRAGON, TYPE_GROUND, 4 },  // 718: standalone egg; evolution not configured
  { "DIANCIE", 0, 0, R_LEGENDARIO, 0x9407, 50, 100, 150, 50, TYPE_ROCK, TYPE_FAIRY, 4 },  // 719: standalone egg; evolution not configured
  { "HOOPA", 0, 0, R_LEGENDARIO, 0xD28F, 80, 110, 60, 70, TYPE_PSYCHIC, TYPE_GHOST, 0 },  // 720: standalone egg; evolution not configured
  { "VOLCANION", 0, 0, R_LEGENDARIO, 0xEA87, 80, 110, 120, 70, TYPE_FIRE, TYPE_WATER, 3 },  // 721: standalone egg; evolution not configured
  { "ROWLET", 0, 0, R_RARO, 0x3C49, 68, 55, 55, 42, TYPE_GRASS, TYPE_FLYING, 2 },  // 722: standalone egg; evolution not configured
  { "DARTRIX", 0, 0, R_RARO, 0x3C49, 78, 75, 75, 52, TYPE_GRASS, TYPE_FLYING, 2 },  // 723: standalone egg; evolution not configured
  { "DECIDUEYE", 0, 0, R_RARO, 0x3C49, 78, 107, 75, 70, TYPE_GRASS, TYPE_GHOST, 2 },  // 724: standalone egg; evolution not configured
  { "LITTEN", 0, 0, R_RARO, 0xEA87, 45, 65, 40, 70, TYPE_FIRE, TYPE_NONE, 3 },  // 725: standalone egg; evolution not configured
  { "TORRACAT", 0, 0, R_RARO, 0xEA87, 65, 85, 50, 90, TYPE_FIRE, TYPE_NONE, 3 },  // 726: standalone egg; evolution not configured
  { "INCINEROAR", 0, 0, R_RARO, 0xEA87, 95, 115, 90, 60, TYPE_FIRE, TYPE_DARK, 3 },  // 727: standalone egg; evolution not configured
  { "POPPLIO", 0, 0, R_RARO, 0x4C98, 50, 54, 54, 40, TYPE_WATER, TYPE_NONE, 1 },  // 728: standalone egg; evolution not configured
  { "BRIONNE", 0, 0, R_RARO, 0x4C98, 60, 69, 69, 50, TYPE_WATER, TYPE_NONE, 1 },  // 729: standalone egg; evolution not configured
  { "PRIMARINA", 0, 0, R_RARO, 0x4C98, 80, 74, 74, 60, TYPE_WATER, TYPE_FAIRY, 1 },  // 730: standalone egg; evolution not configured
  { "PIKIPEK", 0, 0, R_RARO, 0x8C4D, 35, 75, 30, 65, TYPE_NORMAL, TYPE_FLYING, 0 },  // 731: standalone egg; evolution not configured
  { "TRUMBEAK", 0, 0, R_RARO, 0x8C4D, 55, 85, 50, 75, TYPE_NORMAL, TYPE_FLYING, 0 },  // 732: standalone egg; evolution not configured
  { "TOUCANNON", 0, 0, R_RARO, 0x8C4D, 80, 120, 75, 60, TYPE_NORMAL, TYPE_FLYING, 0 },  // 733: standalone egg; evolution not configured
  { "YUNGOOS", 0, 0, R_RARO, 0x8C4D, 48, 70, 30, 45, TYPE_NORMAL, TYPE_NONE, 0 },  // 734: standalone egg; evolution not configured
  { "GUMSHOOS", 0, 0, R_RARO, 0x8C4D, 88, 110, 60, 45, TYPE_NORMAL, TYPE_NONE, 0 },  // 735: standalone egg; evolution not configured
  { "GRUBBIN", 0, 0, R_RARO, 0x7CC4, 47, 62, 45, 46, TYPE_BUG, TYPE_NONE, 2 },  // 736: standalone egg; evolution not configured
  { "CHARJABUG", 0, 0, R_RARO, 0x7CC4, 57, 82, 95, 36, TYPE_BUG, TYPE_ELECTRIC, 2 },  // 737: standalone egg; evolution not configured
  { "VIKAVOLT", 0, 0, R_RARO, 0x7CC4, 77, 70, 90, 43, TYPE_BUG, TYPE_ELECTRIC, 2 },  // 738: standalone egg; evolution not configured
  { "CRABRAWLER", 0, 0, R_RARO, 0xA2A5, 47, 82, 57, 63, TYPE_FIGHTING, TYPE_NONE, 0 },  // 739: standalone egg; evolution not configured
  { "CRABOMINABLE", 0, 0, R_RARO, 0xA2A5, 97, 132, 77, 43, TYPE_FIGHTING, TYPE_ICE, 5 },  // 740: standalone egg; evolution not configured
  { "ORICORIO", 0, 0, R_RARO, 0xEA87, 75, 70, 70, 93, TYPE_FIRE, TYPE_FLYING, 3 },  // 741: standalone egg; evolution not configured
  { "CUTIEFLY", 0, 0, R_RARO, 0x7CC4, 40, 45, 40, 84, TYPE_BUG, TYPE_FAIRY, 2 },  // 742: standalone egg; evolution not configured
  { "RIBOMBEE", 0, 0, R_RARO, 0x7CC4, 60, 55, 60, 124, TYPE_BUG, TYPE_FAIRY, 2 },  // 743: standalone egg; evolution not configured
  { "ROCKRUFF", 0, 0, R_RARO, 0x9407, 45, 65, 40, 60, TYPE_ROCK, TYPE_NONE, 4 },  // 744: standalone egg; evolution not configured
  { "LYCANROC", 0, 0, R_RARO, 0x9407, 75, 115, 65, 112, TYPE_ROCK, TYPE_NONE, 4 },  // 745: standalone egg; evolution not configured
  { "WISHIWASHI", 0, 0, R_RARO, 0x4C98, 45, 20, 20, 40, TYPE_WATER, TYPE_NONE, 1 },  // 746: standalone egg; evolution not configured
  { "MAREANIE", 0, 0, R_RARO, 0x8A73, 50, 53, 62, 45, TYPE_POISON, TYPE_WATER, 1 },  // 747: standalone egg; evolution not configured
  { "TOXAPEX", 0, 0, R_RARO, 0x8A73, 50, 63, 152, 35, TYPE_POISON, TYPE_WATER, 1 },  // 748: standalone egg; evolution not configured
  { "MUDBRAY", 0, 0, R_RARO, 0xB447, 70, 100, 70, 45, TYPE_GROUND, TYPE_NONE, 4 },  // 749: standalone egg; evolution not configured
  { "MUDSDALE", 0, 0, R_RARO, 0xB447, 100, 125, 100, 35, TYPE_GROUND, TYPE_NONE, 4 },  // 750: standalone egg; evolution not configured
  { "DEWPIDER", 0, 0, R_RARO, 0x4C98, 38, 40, 52, 27, TYPE_WATER, TYPE_BUG, 1 },  // 751: standalone egg; evolution not configured
  { "ARAQUANID", 0, 0, R_RARO, 0x4C98, 68, 70, 92, 42, TYPE_WATER, TYPE_BUG, 1 },  // 752: standalone egg; evolution not configured
  { "FOMANTIS", 0, 0, R_RARO, 0x3C49, 40, 55, 35, 35, TYPE_GRASS, TYPE_NONE, 2 },  // 753: standalone egg; evolution not configured
  { "LURANTIS", 0, 0, R_RARO, 0x3C49, 70, 105, 90, 45, TYPE_GRASS, TYPE_NONE, 2 },  // 754: standalone egg; evolution not configured
  { "MORELULL", 0, 0, R_RARO, 0x3C49, 40, 35, 55, 15, TYPE_GRASS, TYPE_FAIRY, 2 },  // 755: standalone egg; evolution not configured
  { "SHIINOTIC", 0, 0, R_RARO, 0x3C49, 60, 45, 80, 30, TYPE_GRASS, TYPE_FAIRY, 2 },  // 756: standalone egg; evolution not configured
  { "SALANDIT", 0, 0, R_RARO, 0x8A73, 48, 44, 40, 77, TYPE_POISON, TYPE_FIRE, 3 },  // 757: standalone egg; evolution not configured
  { "SALAZZLE", 0, 0, R_RARO, 0x8A73, 68, 64, 60, 117, TYPE_POISON, TYPE_FIRE, 3 },  // 758: standalone egg; evolution not configured
  { "STUFFUL", 0, 0, R_RARO, 0x8C4D, 70, 75, 50, 50, TYPE_NORMAL, TYPE_FIGHTING, 0 },  // 759: standalone egg; evolution not configured
  { "BEWEAR", 0, 0, R_RARO, 0x8C4D, 120, 125, 80, 60, TYPE_NORMAL, TYPE_FIGHTING, 0 },  // 760: standalone egg; evolution not configured
  { "BOUNSWEET", 0, 0, R_RARO, 0x3C49, 42, 30, 38, 32, TYPE_GRASS, TYPE_NONE, 2 },  // 761: standalone egg; evolution not configured
  { "STEENEE", 0, 0, R_RARO, 0x3C49, 52, 40, 48, 62, TYPE_GRASS, TYPE_NONE, 2 },  // 762: standalone egg; evolution not configured
  { "TSAREENA", 0, 0, R_RARO, 0x3C49, 72, 120, 98, 72, TYPE_GRASS, TYPE_NONE, 2 },  // 763: standalone egg; evolution not configured
  { "COMFEY", 0, 0, R_RARO, 0xC333, 51, 52, 90, 100, TYPE_FAIRY, TYPE_NONE, 0 },  // 764: standalone egg; evolution not configured
  { "ORANGURU", 0, 0, R_RARO, 0x8C4D, 90, 60, 80, 60, TYPE_NORMAL, TYPE_PSYCHIC, 0 },  // 765: standalone egg; evolution not configured
  { "PASSIMIAN", 0, 0, R_RARO, 0xA2A5, 100, 120, 90, 80, TYPE_FIGHTING, TYPE_NONE, 0 },  // 766: standalone egg; evolution not configured
  { "WIMPOD", 0, 0, R_RARO, 0x7CC4, 25, 35, 40, 80, TYPE_BUG, TYPE_WATER, 1 },  // 767: standalone egg; evolution not configured
  { "GOLISOPOD", 0, 0, R_RARO, 0x7CC4, 75, 125, 140, 40, TYPE_BUG, TYPE_WATER, 1 },  // 768: standalone egg; evolution not configured
  { "SANDYGAST", 0, 0, R_RARO, 0x6AD3, 55, 55, 80, 15, TYPE_GHOST, TYPE_GROUND, 4 },  // 769: standalone egg; evolution not configured
  { "PALOSSAND", 0, 0, R_RARO, 0x6AD3, 85, 75, 110, 35, TYPE_GHOST, TYPE_GROUND, 4 },  // 770: standalone egg; evolution not configured
  { "PYUKUMUKU", 0, 0, R_RARO, 0x4C98, 55, 60, 130, 5, TYPE_WATER, TYPE_NONE, 1 },  // 771: standalone egg; evolution not configured
  { "TYPE: NULL", 0, 0, R_LEGENDARIO, 0x8C4D, 95, 95, 95, 59, TYPE_NORMAL, TYPE_NONE, 0 },  // 772: standalone egg; evolution not configured
  { "SILVALLY", 0, 0, R_LEGENDARIO, 0x8C4D, 95, 95, 95, 95, TYPE_NORMAL, TYPE_NONE, 0 },  // 773: standalone egg; evolution not configured
  { "MINIOR", 0, 0, R_RARO, 0x9407, 60, 60, 100, 60, TYPE_ROCK, TYPE_FLYING, 4 },  // 774: standalone egg; evolution not configured
  { "KOMALA", 0, 0, R_RARO, 0x8C4D, 65, 115, 65, 65, TYPE_NORMAL, TYPE_NONE, 0 },  // 775: standalone egg; evolution not configured
  { "TURTONATOR", 0, 0, R_RARO, 0xEA87, 60, 78, 135, 36, TYPE_FIRE, TYPE_DRAGON, 3 },  // 776: standalone egg; evolution not configured
  { "TOGEDEMARU", 0, 0, R_RARO, 0xBCA1, 65, 98, 63, 96, TYPE_ELECTRIC, TYPE_STEEL, 4 },  // 777: standalone egg; evolution not configured
  { "MIMIKYU", 0, 0, R_RARO, 0x6AD3, 55, 90, 80, 96, TYPE_GHOST, TYPE_FAIRY, 0 },  // 778: standalone egg; evolution not configured
  { "BRUXISH", 0, 0, R_RARO, 0x4C98, 68, 105, 70, 92, TYPE_WATER, TYPE_PSYCHIC, 1 },  // 779: standalone egg; evolution not configured
  { "DRAMPA", 0, 0, R_RARO, 0x8C4D, 78, 60, 85, 36, TYPE_NORMAL, TYPE_DRAGON, 0 },  // 780: standalone egg; evolution not configured
  { "DHELMISE", 0, 0, R_RARO, 0x6AD3, 70, 131, 100, 40, TYPE_GHOST, TYPE_GRASS, 2 },  // 781: standalone egg; evolution not configured
  { "JANGMO-O", 0, 0, R_RARO, 0x5A98, 45, 55, 65, 45, TYPE_DRAGON, TYPE_NONE, 0 },  // 782: standalone egg; evolution not configured
  { "HAKAMO-O", 0, 0, R_RARO, 0x5A98, 55, 75, 90, 65, TYPE_DRAGON, TYPE_FIGHTING, 0 },  // 783: standalone egg; evolution not configured
  { "KOMMO-O", 0, 0, R_RARO, 0x5A98, 75, 110, 125, 85, TYPE_DRAGON, TYPE_FIGHTING, 0 },  // 784: standalone egg; evolution not configured
  { "TAPU KOKO", 0, 0, R_LEGENDARIO, 0xBCA1, 70, 115, 85, 130, TYPE_ELECTRIC, TYPE_FAIRY, 0 },  // 785: standalone egg; evolution not configured
  { "TAPU LELE", 0, 0, R_LEGENDARIO, 0xD28F, 70, 85, 75, 95, TYPE_PSYCHIC, TYPE_FAIRY, 0 },  // 786: standalone egg; evolution not configured
  { "TAPU BULU", 0, 0, R_LEGENDARIO, 0x3C49, 70, 130, 115, 75, TYPE_GRASS, TYPE_FAIRY, 2 },  // 787: standalone egg; evolution not configured
  { "TAPU FINI", 0, 0, R_LEGENDARIO, 0x4C98, 70, 75, 115, 85, TYPE_WATER, TYPE_FAIRY, 1 },  // 788: standalone egg; evolution not configured
  { "COSMOG", 0, 0, R_LEGENDARIO, 0xD28F, 43, 29, 31, 37, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 789: standalone egg; evolution not configured
  { "COSMOEM", 0, 0, R_LEGENDARIO, 0xD28F, 43, 29, 131, 37, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 790: standalone egg; evolution not configured
  { "SOLGALEO", 0, 0, R_LEGENDARIO, 0xD28F, 137, 137, 107, 97, TYPE_PSYCHIC, TYPE_STEEL, 4 },  // 791: standalone egg; evolution not configured
  { "LUNALA", 0, 0, R_LEGENDARIO, 0xD28F, 137, 113, 89, 97, TYPE_PSYCHIC, TYPE_GHOST, 0 },  // 792: standalone egg; evolution not configured
  { "NIHILEGO", 0, 0, R_RARO, 0x9407, 109, 53, 47, 103, TYPE_ROCK, TYPE_POISON, 4 },  // 793: standalone egg; evolution not configured
  { "BUZZWOLE", 0, 0, R_RARO, 0x7CC4, 107, 139, 139, 79, TYPE_BUG, TYPE_FIGHTING, 2 },  // 794: standalone egg; evolution not configured
  { "PHEROMOSA", 0, 0, R_RARO, 0x7CC4, 71, 137, 37, 151, TYPE_BUG, TYPE_FIGHTING, 2 },  // 795: standalone egg; evolution not configured
  { "XURKITREE", 0, 0, R_RARO, 0xBCA1, 83, 89, 71, 83, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 796: standalone egg; evolution not configured
  { "CELESTEELA", 0, 0, R_RARO, 0x6BF1, 97, 101, 103, 61, TYPE_STEEL, TYPE_FLYING, 4 },  // 797: standalone egg; evolution not configured
  { "KARTANA", 0, 0, R_RARO, 0x3C49, 59, 181, 131, 109, TYPE_GRASS, TYPE_STEEL, 2 },  // 798: standalone egg; evolution not configured
  { "GUZZLORD", 0, 0, R_RARO, 0x5A47, 223, 101, 53, 43, TYPE_DARK, TYPE_DRAGON, 2 },  // 799: standalone egg; evolution not configured
  { "NECROZMA", 0, 0, R_LEGENDARIO, 0xD28F, 97, 107, 101, 79, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 800: standalone egg; evolution not configured
  { "MAGEARNA", 0, 0, R_LEGENDARIO, 0x6BF1, 80, 95, 115, 65, TYPE_STEEL, TYPE_FAIRY, 4 },  // 801: standalone egg; evolution not configured
  { "MARSHADOW", 0, 0, R_LEGENDARIO, 0xA2A5, 90, 125, 80, 125, TYPE_FIGHTING, TYPE_GHOST, 0 },  // 802: standalone egg; evolution not configured
  { "POIPOLE", 0, 0, R_RARO, 0x8A73, 67, 73, 67, 73, TYPE_POISON, TYPE_NONE, 0 },  // 803: standalone egg; evolution not configured
  { "NAGANADEL", 0, 0, R_RARO, 0x8A73, 73, 73, 73, 121, TYPE_POISON, TYPE_DRAGON, 0 },  // 804: standalone egg; evolution not configured
  { "STAKATAKA", 0, 0, R_RARO, 0x9407, 61, 131, 211, 13, TYPE_ROCK, TYPE_STEEL, 4 },  // 805: standalone egg; evolution not configured
  { "BLACEPHALON", 0, 0, R_RARO, 0xEA87, 53, 127, 53, 107, TYPE_FIRE, TYPE_GHOST, 3 },  // 806: standalone egg; evolution not configured
  { "ZERAORA", 0, 0, R_LEGENDARIO, 0xBCA1, 88, 112, 75, 143, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 807: standalone egg; evolution not configured
  { "MELTAN", 0, 0, R_LEGENDARIO, 0x6BF1, 46, 65, 65, 34, TYPE_STEEL, TYPE_NONE, 4 },  // 808: standalone egg; evolution not configured
  { "MELMETAL", 0, 0, R_LEGENDARIO, 0x6BF1, 135, 143, 143, 34, TYPE_STEEL, TYPE_NONE, 4 },  // 809: standalone egg; evolution not configured
  { "GROOKEY", 0, 0, R_RARO, 0x3C49, 50, 65, 50, 65, TYPE_GRASS, TYPE_NONE, 2 },  // 810: standalone egg; evolution not configured
  { "THWACKEY", 0, 0, R_RARO, 0x3C49, 70, 85, 70, 80, TYPE_GRASS, TYPE_NONE, 2 },  // 811: standalone egg; evolution not configured
  { "RILLABOOM", 0, 0, R_RARO, 0x3C49, 100, 125, 90, 85, TYPE_GRASS, TYPE_NONE, 2 },  // 812: standalone egg; evolution not configured
  { "SCORBUNNY", 0, 0, R_RARO, 0xEA87, 50, 71, 40, 69, TYPE_FIRE, TYPE_NONE, 3 },  // 813: standalone egg; evolution not configured
  { "RABOOT", 0, 0, R_RARO, 0xEA87, 65, 86, 60, 94, TYPE_FIRE, TYPE_NONE, 3 },  // 814: standalone egg; evolution not configured
  { "CINDERACE", 0, 0, R_RARO, 0xEA87, 80, 116, 75, 119, TYPE_FIRE, TYPE_NONE, 3 },  // 815: standalone egg; evolution not configured
  { "SOBBLE", 0, 0, R_RARO, 0x4C98, 50, 40, 40, 70, TYPE_WATER, TYPE_NONE, 1 },  // 816: standalone egg; evolution not configured
  { "DRIZZILE", 0, 0, R_RARO, 0x4C98, 65, 60, 55, 90, TYPE_WATER, TYPE_NONE, 1 },  // 817: standalone egg; evolution not configured
  { "INTELEON", 0, 0, R_RARO, 0x4C98, 70, 85, 65, 120, TYPE_WATER, TYPE_NONE, 1 },  // 818: standalone egg; evolution not configured
  { "SKWOVET", 0, 0, R_RARO, 0x8C4D, 70, 55, 55, 25, TYPE_NORMAL, TYPE_NONE, 0 },  // 819: standalone egg; evolution not configured
  { "GREEDENT", 0, 0, R_RARO, 0x8C4D, 120, 95, 95, 20, TYPE_NORMAL, TYPE_NONE, 0 },  // 820: standalone egg; evolution not configured
  { "ROOKIDEE", 0, 0, R_RARO, 0x8C4D, 38, 47, 35, 57, TYPE_FLYING, TYPE_NONE, 0 },  // 821: standalone egg; evolution not configured
  { "CORVISQUIRE", 0, 0, R_RARO, 0x8C4D, 68, 67, 55, 77, TYPE_FLYING, TYPE_NONE, 0 },  // 822: standalone egg; evolution not configured
  { "CORVIKNIGHT", 0, 0, R_RARO, 0x8C4D, 98, 87, 105, 67, TYPE_FLYING, TYPE_STEEL, 4 },  // 823: standalone egg; evolution not configured
  { "BLIPBUG", 0, 0, R_RARO, 0x7CC4, 25, 20, 20, 45, TYPE_BUG, TYPE_NONE, 2 },  // 824: standalone egg; evolution not configured
  { "DOTTLER", 0, 0, R_RARO, 0x7CC4, 50, 35, 80, 30, TYPE_BUG, TYPE_PSYCHIC, 2 },  // 825: standalone egg; evolution not configured
  { "ORBEETLE", 0, 0, R_RARO, 0x7CC4, 60, 45, 110, 90, TYPE_BUG, TYPE_PSYCHIC, 2 },  // 826: standalone egg; evolution not configured
  { "NICKIT", 0, 0, R_RARO, 0x5A47, 40, 28, 28, 50, TYPE_DARK, TYPE_NONE, 2 },  // 827: standalone egg; evolution not configured
  { "THIEVUL", 0, 0, R_RARO, 0x5A47, 70, 58, 58, 90, TYPE_DARK, TYPE_NONE, 2 },  // 828: standalone egg; evolution not configured
  { "GOSSIFLEUR", 0, 0, R_RARO, 0x3C49, 40, 40, 60, 10, TYPE_GRASS, TYPE_NONE, 2 },  // 829: standalone egg; evolution not configured
  { "ELDEGOSS", 0, 0, R_RARO, 0x3C49, 60, 50, 90, 60, TYPE_GRASS, TYPE_NONE, 2 },  // 830: standalone egg; evolution not configured
  { "WOOLOO", 0, 0, R_RARO, 0x8C4D, 42, 40, 55, 48, TYPE_NORMAL, TYPE_NONE, 0 },  // 831: standalone egg; evolution not configured
  { "DUBWOOL", 0, 0, R_RARO, 0x8C4D, 72, 80, 100, 88, TYPE_NORMAL, TYPE_NONE, 0 },  // 832: standalone egg; evolution not configured
  { "CHEWTLE", 0, 0, R_RARO, 0x4C98, 50, 64, 50, 44, TYPE_WATER, TYPE_NONE, 1 },  // 833: standalone egg; evolution not configured
  { "DREDNAW", 0, 0, R_RARO, 0x4C98, 90, 115, 90, 74, TYPE_WATER, TYPE_ROCK, 1 },  // 834: standalone egg; evolution not configured
  { "YAMPER", 0, 0, R_RARO, 0xBCA1, 59, 45, 50, 26, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 835: standalone egg; evolution not configured
  { "BOLTUND", 0, 0, R_RARO, 0xBCA1, 69, 90, 60, 121, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 836: standalone egg; evolution not configured
  { "ROLYCOLY", 0, 0, R_RARO, 0x9407, 30, 40, 50, 30, TYPE_ROCK, TYPE_NONE, 4 },  // 837: standalone egg; evolution not configured
  { "CARKOL", 0, 0, R_RARO, 0x9407, 80, 60, 90, 50, TYPE_ROCK, TYPE_FIRE, 3 },  // 838: standalone egg; evolution not configured
  { "COALOSSAL", 0, 0, R_RARO, 0x9407, 110, 80, 120, 30, TYPE_ROCK, TYPE_FIRE, 3 },  // 839: standalone egg; evolution not configured
  { "APPLIN", 0, 0, R_RARO, 0x3C49, 40, 40, 80, 20, TYPE_GRASS, TYPE_DRAGON, 2 },  // 840: standalone egg; evolution not configured
  { "FLAPPLE", 0, 0, R_RARO, 0x3C49, 70, 110, 80, 70, TYPE_GRASS, TYPE_DRAGON, 2 },  // 841: standalone egg; evolution not configured
  { "APPLETUN", 0, 0, R_RARO, 0x3C49, 110, 85, 80, 30, TYPE_GRASS, TYPE_DRAGON, 2 },  // 842: standalone egg; evolution not configured
  { "SILICOBRA", 0, 0, R_RARO, 0xB447, 52, 57, 75, 46, TYPE_GROUND, TYPE_NONE, 4 },  // 843: standalone egg; evolution not configured
  { "SANDACONDA", 0, 0, R_RARO, 0xB447, 72, 107, 125, 71, TYPE_GROUND, TYPE_NONE, 4 },  // 844: standalone egg; evolution not configured
  { "CRAMORANT", 0, 0, R_RARO, 0x8C4D, 70, 85, 55, 85, TYPE_FLYING, TYPE_WATER, 1 },  // 845: standalone egg; evolution not configured
  { "ARROKUDA", 0, 0, R_RARO, 0x4C98, 41, 63, 40, 66, TYPE_WATER, TYPE_NONE, 1 },  // 846: standalone egg; evolution not configured
  { "BARRASKEWDA", 0, 0, R_RARO, 0x4C98, 61, 123, 60, 136, TYPE_WATER, TYPE_NONE, 1 },  // 847: standalone egg; evolution not configured
  { "TOXEL", 0, 0, R_RARO, 0xBCA1, 40, 38, 35, 40, TYPE_ELECTRIC, TYPE_POISON, 0 },  // 848: standalone egg; evolution not configured
  { "TOXTRICITY", 0, 0, R_RARO, 0xBCA1, 75, 98, 70, 75, TYPE_ELECTRIC, TYPE_POISON, 0 },  // 849: standalone egg; evolution not configured
  { "SIZZLIPEDE", 0, 0, R_RARO, 0xEA87, 50, 65, 45, 45, TYPE_FIRE, TYPE_BUG, 3 },  // 850: standalone egg; evolution not configured
  { "CENTISKORCH", 0, 0, R_RARO, 0xEA87, 100, 115, 65, 65, TYPE_FIRE, TYPE_BUG, 3 },  // 851: standalone egg; evolution not configured
  { "CLOBBOPUS", 0, 0, R_RARO, 0xA2A5, 50, 68, 60, 32, TYPE_FIGHTING, TYPE_NONE, 0 },  // 852: standalone egg; evolution not configured
  { "GRAPPLOCT", 0, 0, R_RARO, 0xA2A5, 80, 118, 90, 42, TYPE_FIGHTING, TYPE_NONE, 0 },  // 853: standalone egg; evolution not configured
  { "SINISTEA", 0, 0, R_RARO, 0x6AD3, 40, 45, 45, 50, TYPE_GHOST, TYPE_NONE, 0 },  // 854: standalone egg; evolution not configured
  { "POLTEAGEIST", 0, 0, R_RARO, 0x6AD3, 60, 65, 65, 70, TYPE_GHOST, TYPE_NONE, 0 },  // 855: standalone egg; evolution not configured
  { "HATENNA", 0, 0, R_RARO, 0xD28F, 42, 30, 45, 39, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 856: standalone egg; evolution not configured
  { "HATTREM", 0, 0, R_RARO, 0xD28F, 57, 40, 65, 49, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 857: standalone egg; evolution not configured
  { "HATTERENE", 0, 0, R_RARO, 0xD28F, 57, 90, 95, 29, TYPE_PSYCHIC, TYPE_FAIRY, 0 },  // 858: standalone egg; evolution not configured
  { "IMPIDIMP", 0, 0, R_RARO, 0x5A47, 45, 45, 30, 50, TYPE_DARK, TYPE_FAIRY, 2 },  // 859: standalone egg; evolution not configured
  { "MORGREM", 0, 0, R_RARO, 0x5A47, 65, 60, 45, 70, TYPE_DARK, TYPE_FAIRY, 2 },  // 860: standalone egg; evolution not configured
  { "GRIMMSNARL", 0, 0, R_RARO, 0x5A47, 95, 120, 65, 60, TYPE_DARK, TYPE_FAIRY, 2 },  // 861: standalone egg; evolution not configured
  { "OBSTAGOON", 0, 0, R_RARO, 0x5A47, 93, 90, 101, 95, TYPE_DARK, TYPE_NORMAL, 2 },  // 862: standalone egg; evolution not configured
  { "PERRSERKER", 0, 0, R_RARO, 0x6BF1, 70, 110, 100, 50, TYPE_STEEL, TYPE_NONE, 4 },  // 863: standalone egg; evolution not configured
  { "CURSOLA", 0, 0, R_RARO, 0x6AD3, 60, 95, 50, 30, TYPE_GHOST, TYPE_NONE, 0 },  // 864: standalone egg; evolution not configured
  { "SIRFETCH’D", 0, 0, R_RARO, 0xA2A5, 62, 135, 95, 65, TYPE_FIGHTING, TYPE_NONE, 0 },  // 865: standalone egg; evolution not configured
  { "MR. RIME", 0, 0, R_RARO, 0x4DB8, 80, 85, 75, 70, TYPE_ICE, TYPE_PSYCHIC, 5 },  // 866: standalone egg; evolution not configured
  { "RUNERIGUS", 0, 0, R_RARO, 0xB447, 58, 95, 145, 30, TYPE_GROUND, TYPE_GHOST, 4 },  // 867: standalone egg; evolution not configured
  { "MILCERY", 0, 0, R_RARO, 0xC333, 45, 40, 40, 34, TYPE_FAIRY, TYPE_NONE, 0 },  // 868: standalone egg; evolution not configured
  { "ALCREMIE", 0, 0, R_RARO, 0xC333, 65, 60, 75, 64, TYPE_FAIRY, TYPE_NONE, 0 },  // 869: standalone egg; evolution not configured
  { "FALINKS", 0, 0, R_RARO, 0xA2A5, 65, 100, 100, 75, TYPE_FIGHTING, TYPE_NONE, 0 },  // 870: standalone egg; evolution not configured
  { "PINCURCHIN", 0, 0, R_RARO, 0xBCA1, 48, 101, 95, 15, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 871: standalone egg; evolution not configured
  { "SNOM", 0, 0, R_RARO, 0x4DB8, 30, 25, 35, 20, TYPE_ICE, TYPE_BUG, 5 },  // 872: standalone egg; evolution not configured
  { "FROSMOTH", 0, 0, R_RARO, 0x4DB8, 70, 65, 60, 65, TYPE_ICE, TYPE_BUG, 5 },  // 873: standalone egg; evolution not configured
  { "STONJOURNER", 0, 0, R_RARO, 0x9407, 100, 125, 135, 70, TYPE_ROCK, TYPE_NONE, 4 },  // 874: standalone egg; evolution not configured
  { "EISCUE", 0, 0, R_RARO, 0x4DB8, 75, 80, 110, 50, TYPE_ICE, TYPE_NONE, 5 },  // 875: standalone egg; evolution not configured
  { "INDEEDEE", 0, 0, R_RARO, 0xD28F, 60, 65, 55, 95, TYPE_PSYCHIC, TYPE_NORMAL, 0 },  // 876: standalone egg; evolution not configured
  { "MORPEKO", 0, 0, R_RARO, 0xBCA1, 58, 95, 58, 97, TYPE_ELECTRIC, TYPE_DARK, 2 },  // 877: standalone egg; evolution not configured
  { "CUFANT", 0, 0, R_RARO, 0x6BF1, 72, 80, 49, 40, TYPE_STEEL, TYPE_NONE, 4 },  // 878: standalone egg; evolution not configured
  { "COPPERAJAH", 0, 0, R_RARO, 0x6BF1, 122, 130, 69, 30, TYPE_STEEL, TYPE_NONE, 4 },  // 879: standalone egg; evolution not configured
  { "DRACOZOLT", 0, 0, R_RARO, 0xBCA1, 90, 100, 90, 75, TYPE_ELECTRIC, TYPE_DRAGON, 0 },  // 880: standalone egg; evolution not configured
  { "ARCTOZOLT", 0, 0, R_RARO, 0xBCA1, 90, 100, 90, 55, TYPE_ELECTRIC, TYPE_ICE, 5 },  // 881: standalone egg; evolution not configured
  { "DRACOVISH", 0, 0, R_RARO, 0x4C98, 90, 90, 100, 75, TYPE_WATER, TYPE_DRAGON, 1 },  // 882: standalone egg; evolution not configured
  { "ARCTOVISH", 0, 0, R_RARO, 0x4C98, 90, 90, 100, 55, TYPE_WATER, TYPE_ICE, 5 },  // 883: standalone egg; evolution not configured
  { "DURALUDON", 0, 0, R_RARO, 0x6BF1, 70, 95, 115, 85, TYPE_STEEL, TYPE_DRAGON, 4 },  // 884: standalone egg; evolution not configured
  { "DREEPY", 0, 0, R_RARO, 0x5A98, 28, 60, 30, 82, TYPE_DRAGON, TYPE_GHOST, 0 },  // 885: standalone egg; evolution not configured
  { "DRAKLOAK", 0, 0, R_RARO, 0x5A98, 68, 80, 50, 102, TYPE_DRAGON, TYPE_GHOST, 0 },  // 886: standalone egg; evolution not configured
  { "DRAGAPULT", 0, 0, R_RARO, 0x5A98, 88, 120, 75, 142, TYPE_DRAGON, TYPE_GHOST, 0 },  // 887: standalone egg; evolution not configured
  { "ZACIAN", 0, 0, R_LEGENDARIO, 0xC333, 92, 120, 115, 138, TYPE_FAIRY, TYPE_NONE, 0 },  // 888: standalone egg; evolution not configured
  { "ZAMAZENTA", 0, 0, R_LEGENDARIO, 0xA2A5, 92, 120, 115, 138, TYPE_FIGHTING, TYPE_NONE, 0 },  // 889: standalone egg; evolution not configured
  { "ETERNATUS", 0, 0, R_LEGENDARIO, 0x8A73, 140, 85, 95, 130, TYPE_POISON, TYPE_DRAGON, 0 },  // 890: standalone egg; evolution not configured
  { "KUBFU", 0, 0, R_LEGENDARIO, 0xA2A5, 60, 90, 60, 72, TYPE_FIGHTING, TYPE_NONE, 0 },  // 891: standalone egg; evolution not configured
  { "URSHIFU", 0, 0, R_LEGENDARIO, 0xA2A5, 100, 130, 100, 97, TYPE_FIGHTING, TYPE_DARK, 2 },  // 892: standalone egg; evolution not configured
  { "ZARUDE", 0, 0, R_LEGENDARIO, 0x5A47, 105, 120, 105, 105, TYPE_DARK, TYPE_GRASS, 2 },  // 893: standalone egg; evolution not configured
  { "REGIELEKI", 0, 0, R_LEGENDARIO, 0xBCA1, 80, 100, 50, 200, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 894: standalone egg; evolution not configured
  { "REGIDRAGO", 0, 0, R_LEGENDARIO, 0x5A98, 200, 100, 50, 80, TYPE_DRAGON, TYPE_NONE, 0 },  // 895: standalone egg; evolution not configured
  { "GLASTRIER", 0, 0, R_LEGENDARIO, 0x4DB8, 100, 145, 130, 30, TYPE_ICE, TYPE_NONE, 5 },  // 896: standalone egg; evolution not configured
  { "SPECTRIER", 0, 0, R_LEGENDARIO, 0x6AD3, 100, 65, 60, 130, TYPE_GHOST, TYPE_NONE, 0 },  // 897: standalone egg; evolution not configured
  { "CALYREX", 0, 0, R_LEGENDARIO, 0xD28F, 100, 80, 80, 80, TYPE_PSYCHIC, TYPE_GRASS, 2 },  // 898: standalone egg; evolution not configured
  { "WYRDEER", 0, 0, R_RARO, 0x8C4D, 103, 105, 72, 65, TYPE_NORMAL, TYPE_PSYCHIC, 0 },  // 899: standalone egg; evolution not configured
  { "KLEAVOR", 0, 0, R_RARO, 0x7CC4, 70, 135, 95, 85, TYPE_BUG, TYPE_ROCK, 2 },  // 900: standalone egg; evolution not configured
  { "URSALUNA", 0, 0, R_RARO, 0xB447, 130, 140, 105, 50, TYPE_GROUND, TYPE_NORMAL, 4 },  // 901: standalone egg; evolution not configured
  { "BASCULEGION", 0, 0, R_RARO, 0x4C98, 120, 112, 65, 78, TYPE_WATER, TYPE_GHOST, 1 },  // 902: standalone egg; evolution not configured
  { "SNEASLER", 0, 0, R_RARO, 0xA2A5, 80, 130, 60, 120, TYPE_FIGHTING, TYPE_POISON, 0 },  // 903: standalone egg; evolution not configured
  { "OVERQWIL", 0, 0, R_RARO, 0x5A47, 85, 115, 95, 85, TYPE_DARK, TYPE_POISON, 2 },  // 904: standalone egg; evolution not configured
  { "ENAMORUS", 0, 0, R_LEGENDARIO, 0xC333, 74, 115, 70, 106, TYPE_FAIRY, TYPE_FLYING, 0 },  // 905: standalone egg; evolution not configured
  { "SPRIGATITO", 0, 0, R_RARO, 0x3C49, 40, 61, 54, 65, TYPE_GRASS, TYPE_NONE, 2 },  // 906: standalone egg; evolution not configured
  { "FLORAGATO", 0, 0, R_RARO, 0x3C49, 61, 80, 63, 83, TYPE_GRASS, TYPE_NONE, 2 },  // 907: standalone egg; evolution not configured
  { "MEOWSCARADA", 0, 0, R_RARO, 0x3C49, 76, 110, 70, 123, TYPE_GRASS, TYPE_DARK, 2 },  // 908: standalone egg; evolution not configured
  { "FUECOCO", 0, 0, R_RARO, 0xEA87, 67, 45, 59, 36, TYPE_FIRE, TYPE_NONE, 3 },  // 909: standalone egg; evolution not configured
  { "CROCALOR", 0, 0, R_RARO, 0xEA87, 81, 55, 78, 49, TYPE_FIRE, TYPE_NONE, 3 },  // 910: standalone egg; evolution not configured
  { "SKELEDIRGE", 0, 0, R_RARO, 0xEA87, 104, 75, 100, 66, TYPE_FIRE, TYPE_GHOST, 3 },  // 911: standalone egg; evolution not configured
  { "QUAXLY", 0, 0, R_RARO, 0x4C98, 55, 65, 45, 50, TYPE_WATER, TYPE_NONE, 1 },  // 912: standalone egg; evolution not configured
  { "QUAXWELL", 0, 0, R_RARO, 0x4C98, 70, 85, 65, 65, TYPE_WATER, TYPE_NONE, 1 },  // 913: standalone egg; evolution not configured
  { "QUAQUAVAL", 0, 0, R_RARO, 0x4C98, 85, 120, 80, 85, TYPE_WATER, TYPE_FIGHTING, 1 },  // 914: standalone egg; evolution not configured
  { "LECHONK", 0, 0, R_RARO, 0x8C4D, 54, 45, 40, 35, TYPE_NORMAL, TYPE_NONE, 0 },  // 915: standalone egg; evolution not configured
  { "OINKOLOGNE", 0, 0, R_RARO, 0x8C4D, 110, 100, 75, 65, TYPE_NORMAL, TYPE_NONE, 0 },  // 916: standalone egg; evolution not configured
  { "TAROUNTULA", 0, 0, R_RARO, 0x7CC4, 35, 41, 45, 20, TYPE_BUG, TYPE_NONE, 2 },  // 917: standalone egg; evolution not configured
  { "SPIDOPS", 0, 0, R_RARO, 0x7CC4, 60, 79, 92, 35, TYPE_BUG, TYPE_NONE, 2 },  // 918: standalone egg; evolution not configured
  { "NYMBLE", 0, 0, R_RARO, 0x7CC4, 33, 46, 40, 45, TYPE_BUG, TYPE_NONE, 2 },  // 919: standalone egg; evolution not configured
  { "LOKIX", 0, 0, R_RARO, 0x7CC4, 71, 102, 78, 92, TYPE_BUG, TYPE_DARK, 2 },  // 920: standalone egg; evolution not configured
  { "PAWMI", 0, 0, R_RARO, 0xBCA1, 45, 50, 20, 60, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 921: standalone egg; evolution not configured
  { "PAWMO", 0, 0, R_RARO, 0xBCA1, 60, 75, 40, 85, TYPE_ELECTRIC, TYPE_FIGHTING, 0 },  // 922: standalone egg; evolution not configured
  { "PAWMOT", 0, 0, R_RARO, 0xBCA1, 70, 115, 70, 105, TYPE_ELECTRIC, TYPE_FIGHTING, 0 },  // 923: standalone egg; evolution not configured
  { "TANDEMAUS", 0, 0, R_RARO, 0x8C4D, 50, 50, 45, 75, TYPE_NORMAL, TYPE_NONE, 0 },  // 924: standalone egg; evolution not configured
  { "MAUSHOLD", 0, 0, R_RARO, 0x8C4D, 74, 75, 70, 111, TYPE_NORMAL, TYPE_NONE, 0 },  // 925: standalone egg; evolution not configured
  { "FIDOUGH", 0, 0, R_RARO, 0xC333, 37, 55, 70, 65, TYPE_FAIRY, TYPE_NONE, 0 },  // 926: standalone egg; evolution not configured
  { "DACHSBUN", 0, 0, R_RARO, 0xC333, 57, 80, 115, 95, TYPE_FAIRY, TYPE_NONE, 0 },  // 927: standalone egg; evolution not configured
  { "SMOLIV", 0, 0, R_RARO, 0x3C49, 41, 35, 45, 30, TYPE_GRASS, TYPE_NORMAL, 2 },  // 928: standalone egg; evolution not configured
  { "DOLLIV", 0, 0, R_RARO, 0x3C49, 52, 53, 60, 33, TYPE_GRASS, TYPE_NORMAL, 2 },  // 929: standalone egg; evolution not configured
  { "ARBOLIVA", 0, 0, R_RARO, 0x3C49, 78, 69, 90, 39, TYPE_GRASS, TYPE_NORMAL, 2 },  // 930: standalone egg; evolution not configured
  { "SQUAWKABILLY", 0, 0, R_RARO, 0x8C4D, 82, 96, 51, 92, TYPE_NORMAL, TYPE_FLYING, 0 },  // 931: standalone egg; evolution not configured
  { "NACLI", 0, 0, R_RARO, 0x9407, 55, 55, 75, 25, TYPE_ROCK, TYPE_NONE, 4 },  // 932: standalone egg; evolution not configured
  { "NACLSTACK", 0, 0, R_RARO, 0x9407, 60, 60, 100, 35, TYPE_ROCK, TYPE_NONE, 4 },  // 933: standalone egg; evolution not configured
  { "GARGANACL", 0, 0, R_RARO, 0x9407, 100, 100, 130, 35, TYPE_ROCK, TYPE_NONE, 4 },  // 934: standalone egg; evolution not configured
  { "CHARCADET", 0, 0, R_RARO, 0xEA87, 40, 50, 40, 35, TYPE_FIRE, TYPE_NONE, 3 },  // 935: standalone egg; evolution not configured
  { "ARMAROUGE", 0, 0, R_RARO, 0xEA87, 85, 60, 100, 75, TYPE_FIRE, TYPE_PSYCHIC, 3 },  // 936: standalone egg; evolution not configured
  { "CERULEDGE", 0, 0, R_RARO, 0xEA87, 75, 125, 80, 85, TYPE_FIRE, TYPE_GHOST, 3 },  // 937: standalone egg; evolution not configured
  { "TADBULB", 0, 0, R_RARO, 0xBCA1, 61, 31, 41, 45, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 938: standalone egg; evolution not configured
  { "BELLIBOLT", 0, 0, R_RARO, 0xBCA1, 109, 64, 91, 45, TYPE_ELECTRIC, TYPE_NONE, 0 },  // 939: standalone egg; evolution not configured
  { "WATTREL", 0, 0, R_RARO, 0xBCA1, 40, 40, 35, 70, TYPE_ELECTRIC, TYPE_FLYING, 0 },  // 940: standalone egg; evolution not configured
  { "KILOWATTREL", 0, 0, R_RARO, 0xBCA1, 70, 70, 60, 125, TYPE_ELECTRIC, TYPE_FLYING, 0 },  // 941: standalone egg; evolution not configured
  { "MASCHIFF", 0, 0, R_RARO, 0x5A47, 60, 78, 60, 51, TYPE_DARK, TYPE_NONE, 2 },  // 942: standalone egg; evolution not configured
  { "MABOSSTIFF", 0, 0, R_RARO, 0x5A47, 80, 120, 90, 85, TYPE_DARK, TYPE_NONE, 2 },  // 943: standalone egg; evolution not configured
  { "SHROODLE", 0, 0, R_RARO, 0x8A73, 40, 65, 35, 75, TYPE_POISON, TYPE_NORMAL, 0 },  // 944: standalone egg; evolution not configured
  { "GRAFAIAI", 0, 0, R_RARO, 0x8A73, 63, 95, 65, 110, TYPE_POISON, TYPE_NORMAL, 0 },  // 945: standalone egg; evolution not configured
  { "BRAMBLIN", 0, 0, R_RARO, 0x3C49, 40, 65, 30, 60, TYPE_GRASS, TYPE_GHOST, 2 },  // 946: standalone egg; evolution not configured
  { "BRAMBLEGHAST", 0, 0, R_RARO, 0x3C49, 55, 115, 70, 90, TYPE_GRASS, TYPE_GHOST, 2 },  // 947: standalone egg; evolution not configured
  { "TOEDSCOOL", 0, 0, R_RARO, 0xB447, 40, 40, 35, 70, TYPE_GROUND, TYPE_GRASS, 2 },  // 948: standalone egg; evolution not configured
  { "TOEDSCRUEL", 0, 0, R_RARO, 0xB447, 80, 70, 65, 100, TYPE_GROUND, TYPE_GRASS, 2 },  // 949: standalone egg; evolution not configured
  { "KLAWF", 0, 0, R_RARO, 0x9407, 70, 100, 115, 75, TYPE_ROCK, TYPE_NONE, 4 },  // 950: standalone egg; evolution not configured
  { "CAPSAKID", 0, 0, R_RARO, 0x3C49, 50, 62, 40, 50, TYPE_GRASS, TYPE_NONE, 2 },  // 951: standalone egg; evolution not configured
  { "SCOVILLAIN", 0, 0, R_RARO, 0x3C49, 65, 108, 65, 75, TYPE_GRASS, TYPE_FIRE, 3 },  // 952: standalone egg; evolution not configured
  { "RELLOR", 0, 0, R_RARO, 0x7CC4, 41, 50, 60, 30, TYPE_BUG, TYPE_NONE, 2 },  // 953: standalone egg; evolution not configured
  { "RABSCA", 0, 0, R_RARO, 0x7CC4, 75, 50, 85, 45, TYPE_BUG, TYPE_PSYCHIC, 2 },  // 954: standalone egg; evolution not configured
  { "FLITTLE", 0, 0, R_RARO, 0xD28F, 30, 35, 30, 75, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 955: standalone egg; evolution not configured
  { "ESPATHRA", 0, 0, R_RARO, 0xD28F, 95, 60, 60, 105, TYPE_PSYCHIC, TYPE_NONE, 0 },  // 956: standalone egg; evolution not configured
  { "TINKATINK", 0, 0, R_RARO, 0xC333, 50, 45, 45, 58, TYPE_FAIRY, TYPE_STEEL, 4 },  // 957: standalone egg; evolution not configured
  { "TINKATUFF", 0, 0, R_RARO, 0xC333, 65, 55, 55, 78, TYPE_FAIRY, TYPE_STEEL, 4 },  // 958: standalone egg; evolution not configured
  { "TINKATON", 0, 0, R_RARO, 0xC333, 85, 75, 77, 94, TYPE_FAIRY, TYPE_STEEL, 4 },  // 959: standalone egg; evolution not configured
  { "WIGLETT", 0, 0, R_RARO, 0x4C98, 10, 55, 25, 95, TYPE_WATER, TYPE_NONE, 1 },  // 960: standalone egg; evolution not configured
  { "WUGTRIO", 0, 0, R_RARO, 0x4C98, 35, 100, 50, 120, TYPE_WATER, TYPE_NONE, 1 },  // 961: standalone egg; evolution not configured
  { "BOMBIRDIER", 0, 0, R_RARO, 0x8C4D, 70, 103, 85, 82, TYPE_FLYING, TYPE_DARK, 2 },  // 962: standalone egg; evolution not configured
  { "FINIZEN", 0, 0, R_RARO, 0x4C98, 70, 45, 40, 75, TYPE_WATER, TYPE_NONE, 1 },  // 963: standalone egg; evolution not configured
  { "PALAFIN", 0, 0, R_RARO, 0x4C98, 100, 70, 72, 100, TYPE_WATER, TYPE_NONE, 1 },  // 964: standalone egg; evolution not configured
  { "VAROOM", 0, 0, R_RARO, 0x6BF1, 45, 70, 63, 47, TYPE_STEEL, TYPE_POISON, 4 },  // 965: standalone egg; evolution not configured
  { "REVAVROOM", 0, 0, R_RARO, 0x6BF1, 80, 119, 90, 90, TYPE_STEEL, TYPE_POISON, 4 },  // 966: standalone egg; evolution not configured
  { "CYCLIZAR", 0, 0, R_RARO, 0x5A98, 70, 95, 65, 121, TYPE_DRAGON, TYPE_NORMAL, 0 },  // 967: standalone egg; evolution not configured
  { "ORTHWORM", 0, 0, R_RARO, 0x6BF1, 70, 85, 145, 65, TYPE_STEEL, TYPE_NONE, 4 },  // 968: standalone egg; evolution not configured
  { "GLIMMET", 0, 0, R_RARO, 0x9407, 48, 35, 42, 60, TYPE_ROCK, TYPE_POISON, 4 },  // 969: standalone egg; evolution not configured
  { "GLIMMORA", 0, 0, R_RARO, 0x9407, 83, 55, 90, 86, TYPE_ROCK, TYPE_POISON, 4 },  // 970: standalone egg; evolution not configured
  { "GREAVARD", 0, 0, R_RARO, 0x6AD3, 50, 61, 60, 34, TYPE_GHOST, TYPE_NONE, 0 },  // 971: standalone egg; evolution not configured
  { "HOUNDSTONE", 0, 0, R_RARO, 0x6AD3, 72, 101, 100, 68, TYPE_GHOST, TYPE_NONE, 0 },  // 972: standalone egg; evolution not configured
  { "FLAMIGO", 0, 0, R_RARO, 0x8C4D, 82, 115, 74, 90, TYPE_FLYING, TYPE_FIGHTING, 0 },  // 973: standalone egg; evolution not configured
  { "CETODDLE", 0, 0, R_RARO, 0x4DB8, 108, 68, 45, 43, TYPE_ICE, TYPE_NONE, 5 },  // 974: standalone egg; evolution not configured
  { "CETITAN", 0, 0, R_RARO, 0x4DB8, 170, 113, 65, 73, TYPE_ICE, TYPE_NONE, 5 },  // 975: standalone egg; evolution not configured
  { "VELUZA", 0, 0, R_RARO, 0x4C98, 90, 102, 73, 70, TYPE_WATER, TYPE_PSYCHIC, 1 },  // 976: standalone egg; evolution not configured
  { "DONDOZO", 0, 0, R_RARO, 0x4C98, 150, 100, 115, 35, TYPE_WATER, TYPE_NONE, 1 },  // 977: standalone egg; evolution not configured
  { "TATSUGIRI", 0, 0, R_RARO, 0x5A98, 68, 50, 60, 82, TYPE_DRAGON, TYPE_WATER, 1 },  // 978: standalone egg; evolution not configured
  { "ANNIHILAPE", 0, 0, R_RARO, 0xA2A5, 110, 115, 80, 90, TYPE_FIGHTING, TYPE_GHOST, 0 },  // 979: standalone egg; evolution not configured
  { "CLODSIRE", 0, 0, R_RARO, 0x8A73, 130, 75, 60, 20, TYPE_POISON, TYPE_GROUND, 4 },  // 980: standalone egg; evolution not configured
  { "FARIGIRAF", 0, 0, R_RARO, 0x8C4D, 120, 90, 70, 60, TYPE_NORMAL, TYPE_PSYCHIC, 0 },  // 981: standalone egg; evolution not configured
  { "DUDUNSPARCE", 0, 0, R_RARO, 0x8C4D, 125, 100, 80, 55, TYPE_NORMAL, TYPE_NONE, 0 },  // 982: standalone egg; evolution not configured
  { "KINGAMBIT", 0, 0, R_RARO, 0x5A47, 100, 135, 120, 50, TYPE_DARK, TYPE_STEEL, 2 },  // 983: standalone egg; evolution not configured
  { "GREAT TUSK", 0, 0, R_RARO, 0xB447, 115, 131, 131, 87, TYPE_GROUND, TYPE_FIGHTING, 4 },  // 984: standalone egg; evolution not configured
  { "SCREAM TAIL", 0, 0, R_RARO, 0xC333, 115, 65, 99, 111, TYPE_FAIRY, TYPE_PSYCHIC, 0 },  // 985: standalone egg; evolution not configured
  { "BRUTE BONNET", 0, 0, R_RARO, 0x3C49, 111, 127, 99, 55, TYPE_GRASS, TYPE_DARK, 2 },  // 986: standalone egg; evolution not configured
  { "FLUTTER MANE", 0, 0, R_RARO, 0x6AD3, 55, 55, 55, 135, TYPE_GHOST, TYPE_FAIRY, 0 },  // 987: standalone egg; evolution not configured
  { "SLITHER WING", 0, 0, R_RARO, 0x7CC4, 85, 135, 79, 81, TYPE_BUG, TYPE_FIGHTING, 2 },  // 988: standalone egg; evolution not configured
  { "SANDY SHOCKS", 0, 0, R_RARO, 0xBCA1, 85, 81, 97, 101, TYPE_ELECTRIC, TYPE_GROUND, 4 },  // 989: standalone egg; evolution not configured
  { "IRON TREADS", 0, 0, R_RARO, 0xB447, 90, 112, 120, 106, TYPE_GROUND, TYPE_STEEL, 4 },  // 990: standalone egg; evolution not configured
  { "IRON BUNDLE", 0, 0, R_RARO, 0x4DB8, 56, 80, 114, 136, TYPE_ICE, TYPE_WATER, 5 },  // 991: standalone egg; evolution not configured
  { "IRON HANDS", 0, 0, R_RARO, 0xA2A5, 154, 140, 108, 50, TYPE_FIGHTING, TYPE_ELECTRIC, 0 },  // 992: standalone egg; evolution not configured
  { "IRON JUGULIS", 0, 0, R_RARO, 0x5A47, 94, 80, 86, 108, TYPE_DARK, TYPE_FLYING, 2 },  // 993: standalone egg; evolution not configured
  { "IRON MOTH", 0, 0, R_RARO, 0xEA87, 80, 70, 60, 110, TYPE_FIRE, TYPE_POISON, 3 },  // 994: standalone egg; evolution not configured
  { "IRON THORNS", 0, 0, R_RARO, 0x9407, 100, 134, 110, 72, TYPE_ROCK, TYPE_ELECTRIC, 4 },  // 995: standalone egg; evolution not configured
  { "FRIGIBAX", 0, 0, R_RARO, 0x5A98, 65, 75, 45, 55, TYPE_DRAGON, TYPE_ICE, 5 },  // 996: standalone egg; evolution not configured
  { "ARCTIBAX", 0, 0, R_RARO, 0x5A98, 90, 95, 66, 62, TYPE_DRAGON, TYPE_ICE, 5 },  // 997: standalone egg; evolution not configured
  { "BAXCALIBUR", 0, 0, R_RARO, 0x5A98, 115, 145, 92, 87, TYPE_DRAGON, TYPE_ICE, 5 },  // 998: standalone egg; evolution not configured
  { "GIMMIGHOUL", 0, 0, R_RARO, 0x6AD3, 45, 30, 70, 10, TYPE_GHOST, TYPE_NONE, 0 },  // 999: standalone egg; evolution not configured
  { "GHOLDENGO", 0, 0, R_RARO, 0x6BF1, 87, 60, 95, 84, TYPE_STEEL, TYPE_GHOST, 4 },  // 1000: standalone egg; evolution not configured
  { "WO-CHIEN", 0, 0, R_LEGENDARIO, 0x5A47, 85, 85, 100, 70, TYPE_DARK, TYPE_GRASS, 2 },  // 1001: standalone egg; evolution not configured
  { "CHIEN-PAO", 0, 0, R_LEGENDARIO, 0x5A47, 80, 120, 80, 135, TYPE_DARK, TYPE_ICE, 5 },  // 1002: standalone egg; evolution not configured
  { "TING-LU", 0, 0, R_LEGENDARIO, 0x5A47, 155, 110, 125, 45, TYPE_DARK, TYPE_GROUND, 2 },  // 1003: standalone egg; evolution not configured
  { "CHI-YU", 0, 0, R_LEGENDARIO, 0x5A47, 55, 80, 80, 100, TYPE_DARK, TYPE_FIRE, 3 },  // 1004: standalone egg; evolution not configured
  { "ROARING MOON", 0, 0, R_RARO, 0x5A98, 105, 139, 71, 119, TYPE_DRAGON, TYPE_DARK, 2 },  // 1005: standalone egg; evolution not configured
  { "IRON VALIANT", 0, 0, R_RARO, 0xC333, 74, 130, 90, 116, TYPE_FAIRY, TYPE_FIGHTING, 0 },  // 1006: standalone egg; evolution not configured
  { "KORAIDON", 0, 0, R_LEGENDARIO, 0xA2A5, 100, 135, 115, 135, TYPE_FIGHTING, TYPE_DRAGON, 0 },  // 1007: standalone egg; evolution not configured
  { "MIRAIDON", 0, 0, R_LEGENDARIO, 0xBCA1, 100, 85, 100, 135, TYPE_ELECTRIC, TYPE_DRAGON, 0 },  // 1008: standalone egg; evolution not configured
  { "WALKING WAKE", 0, 0, R_RARO, 0x4C98, 99, 83, 91, 109, TYPE_WATER, TYPE_DRAGON, 1 },  // 1009: standalone egg; evolution not configured
  { "IRON LEAVES", 0, 0, R_RARO, 0x3C49, 90, 130, 88, 104, TYPE_GRASS, TYPE_PSYCHIC, 2 },  // 1010: standalone egg; evolution not configured
  { "DIPPLIN", 0, 0, R_RARO, 0x3C49, 80, 80, 110, 40, TYPE_GRASS, TYPE_DRAGON, 2 },  // 1011: standalone egg; evolution not configured
  { "POLTCHAGEIST", 0, 0, R_RARO, 0x3C49, 40, 45, 45, 50, TYPE_GRASS, TYPE_GHOST, 2 },  // 1012: standalone egg; evolution not configured
  { "SINISTCHA", 0, 0, R_RARO, 0x3C49, 71, 60, 106, 70, TYPE_GRASS, TYPE_GHOST, 2 },  // 1013: standalone egg; evolution not configured
  { "OKIDOGI", 0, 0, R_LEGENDARIO, 0x8A73, 88, 128, 115, 80, TYPE_POISON, TYPE_FIGHTING, 0 },  // 1014: standalone egg; evolution not configured
  { "MUNKIDORI", 0, 0, R_LEGENDARIO, 0x8A73, 88, 75, 66, 106, TYPE_POISON, TYPE_PSYCHIC, 0 },  // 1015: standalone egg; evolution not configured
  { "FEZANDIPITI", 0, 0, R_LEGENDARIO, 0x8A73, 88, 91, 82, 99, TYPE_POISON, TYPE_FAIRY, 0 },  // 1016: standalone egg; evolution not configured
  { "OGERPON", 0, 0, R_LEGENDARIO, 0x3C49, 80, 120, 84, 110, TYPE_GRASS, TYPE_NONE, 2 },  // 1017: standalone egg; evolution not configured
  { "ARCHALUDON", 0, 0, R_RARO, 0x6BF1, 90, 105, 130, 85, TYPE_STEEL, TYPE_DRAGON, 4 },  // 1018: standalone egg; evolution not configured
  { "HYDRAPPLE", 0, 0, R_RARO, 0x3C49, 106, 80, 110, 44, TYPE_GRASS, TYPE_DRAGON, 2 },  // 1019: standalone egg; evolution not configured
  { "GOUGING FIRE", 0, 0, R_RARO, 0xEA87, 105, 115, 121, 91, TYPE_FIRE, TYPE_DRAGON, 3 },  // 1020: standalone egg; evolution not configured
  { "RAGING BOLT", 0, 0, R_RARO, 0xBCA1, 125, 73, 91, 75, TYPE_ELECTRIC, TYPE_DRAGON, 0 },  // 1021: standalone egg; evolution not configured
  { "IRON BOULDER", 0, 0, R_RARO, 0x9407, 90, 120, 80, 124, TYPE_ROCK, TYPE_PSYCHIC, 4 },  // 1022: standalone egg; evolution not configured
  { "IRON CROWN", 0, 0, R_RARO, 0x6BF1, 90, 72, 100, 98, TYPE_STEEL, TYPE_PSYCHIC, 4 },  // 1023: standalone egg; evolution not configured
  { "TERAPAGOS", 0, 0, R_LEGENDARIO, 0x8C4D, 90, 65, 85, 60, TYPE_NORMAL, TYPE_NONE, 0 },  // 1024: standalone egg; evolution not configured
  { "PECHARUNT", 0, 0, R_LEGENDARIO, 0x8A73, 88, 88, 160, 88, TYPE_POISON, TYPE_GHOST, 0 },  // 1025: standalone egg; evolution not configured
};

// nombres localizados en el orden de Lang: ES, EN, FR, DE, IT, PT, KO
static const char *const DEX_NAMES[DEX_LANG_COUNT][DEX_COUNT + 1] = {
  // ES
  { "?", "BULBASAUR", "IVYSAUR", "VENUSAUR", "CHARMANDER", "CHARMELEON", "CHARIZARD", "SQUIRTLE", "WARTORTLE", "BLASTOISE", "CATERPIE", "METAPOD", "BUTTERFREE", "WEEDLE", "KAKUNA", "BEEDRILL", "PIDGEY", "PIDGEOTTO", "PIDGEOT", "RATTATA", "RATICATE", "SPEAROW", "FEAROW", "EKANS", "ARBOK", "PIKACHU", "RAICHU", "SANDSHREW", "SANDSLASH", "NIDORAN F", "NIDORINA", "NIDOQUEEN", "NIDORAN M", "NIDORINO", "NIDOKING", "CLEFAIRY", "CLEFABLE", "VULPIX", "NINETALES", "JIGGLYPUFF", "WIGGLYTUFF", "ZUBAT", "GOLBAT", "ODDISH", "GLOOM", "VILEPLUME", "PARAS", "PARASECT", "VENONAT", "VENOMOTH", "DIGLETT", "DUGTRIO", "MEOWTH", "PERSIAN", "PSYDUCK", "GOLDUCK", "MANKEY", "PRIMEAPE", "GROWLITHE", "ARCANINE", "POLIWAG", "POLIWHIRL", "POLIWRATH", "ABRA", "KADABRA", "ALAKAZAM", "MACHOP", "MACHOKE", "MACHAMP", "BELLSPROUT", "WEEPINBELL", "VICTREEBEL", "TENTACOOL", "TENTACRUEL", "GEODUDE", "GRAVELER", "GOLEM", "PONYTA", "RAPIDASH", "SLOWPOKE", "SLOWBRO", "MAGNEMITE", "MAGNETON", "FARFETCHD", "DODUO", "DODRIO", "SEEL", "DEWGONG", "GRIMER", "MUK", "SHELLDER", "CLOYSTER", "GASTLY", "HAUNTER", "GENGAR", "ONIX", "DROWZEE", "HYPNO", "KRABBY", "KINGLER", "VOLTORB", "ELECTRODE", "EXEGGCUTE", "EXEGGUTOR", "CUBONE", "MAROWAK", "HITMONLEE", "HITMONCHAN", "LICKITUNG", "KOFFING", "WEEZING", "RHYHORN", "RHYDON", "CHANSEY", "TANGELA", "KANGASKHAN", "HORSEA", "SEADRA", "GOLDEEN", "SEAKING", "STARYU", "STARMIE", "MR. MIME", "SCYTHER", "JYNX", "ELECTABUZZ", "MAGMAR", "PINSIR", "TAUROS", "MAGIKARP", "GYARADOS", "LAPRAS", "DITTO", "EEVEE", "VAPOREON", "JOLTEON", "FLAREON", "PORYGON", "OMANYTE", "OMASTAR", "KABUTO", "KABUTOPS", "AERODACTYL", "SNORLAX", "ARTICUNO", "ZAPDOS", "MOLTRES", "DRATINI", "DRAGONAIR", "DRAGONITE", "MEWTWO", "MEW", "CHIKORITA", "BAYLEEF", "MEGANIUM", "CYNDAQUIL", "QUILAVA", "TYPHLOSION", "TOTODILE", "CROCONAW", "FERALIGATR", "SENTRET", "FURRET", "HOOTHOOT", "NOCTOWL", "LEDYBA", "LEDIAN", "SPINARAK", "ARIADOS", "CROBAT", "CHINCHOU", "LANTURN", "PICHU", "CLEFFA", "IGGLYBUFF", "TOGEPI", "TOGETIC", "NATU", "XATU", "MAREEP", "FLAAFFY", "AMPHAROS", "BELLOSSOM", "MARILL", "AZUMARILL", "SUDOWOODO", "POLITOED", "HOPPIP", "SKIPLOOM", "JUMPLUFF", "AIPOM", "SUNKERN", "SUNFLORA", "YANMA", "WOOPER", "QUAGSIRE", "ESPEON", "UMBREON", "MURKROW", "SLOWKING", "MISDREAVUS", "UNOWN", "WOBBUFFET", "GIRAFARIG", "PINECO", "FORRETRESS", "DUNSPARCE", "GLIGAR", "STEELIX", "SNUBBULL", "GRANBULL", "QWILFISH", "SCIZOR", "SHUCKLE", "HERACROSS", "SNEASEL", "TEDDIURSA", "URSARING", "SLUGMA", "MAGCARGO", "SWINUB", "PILOSWINE", "CORSOLA", "REMORAID", "OCTILLERY", "DELIBIRD", "MANTINE", "SKARMORY", "HOUNDOUR", "HOUNDOOM", "KINGDRA", "PHANPY", "DONPHAN", "PORYGON2", "STANTLER", "SMEARGLE", "TYROGUE", "HITMONTOP", "SMOOCHUM", "ELEKID", "MAGBY", "MILTANK", "BLISSEY", "RAIKOU", "ENTEI", "SUICUNE", "LARVITAR", "PUPITAR", "TYRANITAR", "LUGIA", "HO-OH", "CELEBI", "TREECKO", "GROVYLE", "SCEPTILE", "TORCHIC", "COMBUSKEN", "BLAZIKEN", "MUDKIP", "MARSHTOMP", "SWAMPERT", "POOCHYENA", "MIGHTYENA", "ZIGZAGOON", "LINOONE", "WURMPLE", "SILCOON", "BEAUTIFLY", "CASCOON", "DUSTOX", "LOTAD", "LOMBRE", "LUDICOLO", "SEEDOT", "NUZLEAF", "SHIFTRY", "TAILLOW", "SWELLOW", "WINGULL", "PELIPPER", "RALTS", "KIRLIA", "GARDEVOIR", "SURSKIT", "MASQUERAIN", "SHROOMISH", "BRELOOM", "SLAKOTH", "VIGOROTH", "SLAKING", "NINCADA", "NINJASK", "SHEDINJA", "WHISMUR", "LOUDRED", "EXPLOUD", "MAKUHITA", "HARIYAMA", "AZURILL", "NOSEPASS", "SKITTY", "DELCATTY", "SABLEYE", "MAWILE", "ARON", "LAIRON", "AGGRON", "MEDITITE", "MEDICHAM", "ELECTRIKE", "MANECTRIC", "PLUSLE", "MINUN", "VOLBEAT", "ILLUMISE", "ROSELIA", "GULPIN", "SWALOT", "CARVANHA", "SHARPEDO", "WAILMER", "WAILORD", "NUMEL", "CAMERUPT", "TORKOAL", "SPOINK", "GRUMPIG", "SPINDA", "TRAPINCH", "VIBRAVA", "FLYGON", "CACNEA", "CACTURNE", "SWABLU", "ALTARIA", "ZANGOOSE", "SEVIPER", "LUNATONE", "SOLROCK", "BARBOACH", "WHISCASH", "CORPHISH", "CRAWDAUNT", "BALTOY", "CLAYDOL", "LILEEP", "CRADILY", "ANORITH", "ARMALDO", "FEEBAS", "MILOTIC", "CASTFORM", "KECLEON", "SHUPPET", "BANETTE", "DUSKULL", "DUSCLOPS", "TROPIUS", "CHIMECHO", "ABSOL", "WYNAUT", "SNORUNT", "GLALIE", "SPHEAL", "SEALEO", "WALREIN", "CLAMPERL", "HUNTAIL", "GOREBYSS", "RELICANTH", "LUVDISC", "BAGON", "SHELGON", "SALAMENCE", "BELDUM", "METANG", "METAGROSS", "REGIROCK", "REGICE", "REGISTEEL", "LATIAS", "LATIOS", "KYOGRE", "GROUDON", "RAYQUAZA", "JIRACHI", "DEOXYS", "TURTWIG", "GROTLE", "TORTERRA", "CHIMCHAR", "MONFERNO", "INFERNAPE", "PIPLUP", "PRINPLUP", "EMPOLEON", "STARLY", "STARAVIA", "STARAPTOR", "BIDOOF", "BIBAREL", "KRICKETOT", "KRICKETUNE", "SHINX", "LUXIO", "LUXRAY", "BUDEW", "ROSERADE", "CRANIDOS", "RAMPARDOS", "SHIELDON", "BASTIODON", "BURMY", "WORMADAM", "MOTHIM", "COMBEE", "VESPIQUEN", "PACHIRISU", "BUIZEL", "FLOATZEL", "CHERUBI", "CHERRIM", "SHELLOS", "GASTRODON", "AMBIPOM", "DRIFLOON", "DRIFBLIM", "BUNEARY", "LOPUNNY", "MISMAGIUS", "HONCHKROW", "GLAMEOW", "PURUGLY", "CHINGLING", "STUNKY", "SKUNTANK", "BRONZOR", "BRONZONG", "BONSLY", "MIME JR.", "HAPPINY", "CHATOT", "SPIRITOMB", "GIBLE", "GABITE", "GARCHOMP", "MUNCHLAX", "RIOLU", "LUCARIO", "HIPPOPOTAS", "HIPPOWDON", "SKORUPI", "DRAPION", "CROAGUNK", "TOXICROAK", "CARNIVINE", "FINNEON", "LUMINEON", "MANTYKE", "SNOVER", "ABOMASNOW", "WEAVILE", "MAGNEZONE", "LICKILICKY", "RHYPERIOR", "TANGROWTH", "ELECTIVIRE", "MAGMORTAR", "TOGEKISS", "YANMEGA", "LEAFEON", "GLACEON", "GLISCOR", "MAMOSWINE", "PORYGON-Z", "GALLADE", "PROBOPASS", "DUSKNOIR", "FROSLASS", "ROTOM", "UXIE", "MESPRIT", "AZELF", "DIALGA", "PALKIA", "HEATRAN", "REGIGIGAS", "GIRATINA", "CRESSELIA", "PHIONE", "MANAPHY", "DARKRAI", "SHAYMIN", "ARCEUS", "VICTINI", "SNIVY", "SERVINE", "SERPERIOR", "TEPIG", "PIGNITE", "EMBOAR", "OSHAWOTT", "DEWOTT", "SAMUROTT", "PATRAT", "WATCHOG", "LILLIPUP", "HERDIER", "STOUTLAND", "PURRLOIN", "LIEPARD", "PANSAGE", "SIMISAGE", "PANSEAR", "SIMISEAR", "PANPOUR", "SIMIPOUR", "MUNNA", "MUSHARNA", "PIDOVE", "TRANQUILL", "UNFEZANT", "BLITZLE", "ZEBSTRIKA", "ROGGENROLA", "BOLDORE", "GIGALITH", "WOOBAT", "SWOOBAT", "DRILBUR", "EXCADRILL", "AUDINO", "TIMBURR", "GURDURR", "CONKELDURR", "TYMPOLE", "PALPITOAD", "SEISMITOAD", "THROH", "SAWK", "SEWADDLE", "SWADLOON", "LEAVANNY", "VENIPEDE", "WHIRLIPEDE", "SCOLIPEDE", "COTTONEE", "WHIMSICOTT", "PETILIL", "LILLIGANT", "BASCULIN", "SANDILE", "KROKOROK", "KROOKODILE", "DARUMAKA", "DARMANITAN", "MARACTUS", "DWEBBLE", "CRUSTLE", "SCRAGGY", "SCRAFTY", "SIGILYPH", "YAMASK", "COFAGRIGUS", "TIRTOUGA", "CARRACOSTA", "ARCHEN", "ARCHEOPS", "TRUBBISH", "GARBODOR", "ZORUA", "ZOROARK", "MINCCINO", "CINCCINO", "GOTHITA", "GOTHORITA", "GOTHITELLE", "SOLOSIS", "DUOSION", "REUNICLUS", "DUCKLETT", "SWANNA", "VANILLITE", "VANILLISH", "VANILLUXE", "DEERLING", "SAWSBUCK", "EMOLGA", "KARRABLAST", "ESCAVALIER", "FOONGUS", "AMOONGUSS", "FRILLISH", "JELLICENT", "ALOMOMOLA", "JOLTIK", "GALVANTULA", "FERROSEED", "FERROTHORN", "KLINK", "KLANG", "KLINKLANG", "TYNAMO", "EELEKTRIK", "EELEKTROSS", "ELGYEM", "BEHEEYEM", "LITWICK", "LAMPENT", "CHANDELURE", "AXEW", "FRAXURE", "HAXORUS", "CUBCHOO", "BEARTIC", "CRYOGONAL", "SHELMET", "ACCELGOR", "STUNFISK", "MIENFOO", "MIENSHAO", "DRUDDIGON", "GOLETT", "GOLURK", "PAWNIARD", "BISHARP", "BOUFFALANT", "RUFFLET", "BRAVIARY", "VULLABY", "MANDIBUZZ", "HEATMOR", "DURANT", "DEINO", "ZWEILOUS", "HYDREIGON", "LARVESTA", "VOLCARONA", "COBALION", "TERRAKION", "VIRIZION", "TORNADUS", "THUNDURUS", "RESHIRAM", "ZEKROM", "LANDORUS", "KYUREM", "KELDEO", "MELOETTA", "GENESECT", "CHESPIN", "QUILLADIN", "CHESNAUGHT", "FENNEKIN", "BRAIXEN", "DELPHOX", "FROAKIE", "FROGADIER", "GRENINJA", "BUNNELBY", "DIGGERSBY", "FLETCHLING", "FLETCHINDER", "TALONFLAME", "SCATTERBUG", "SPEWPA", "VIVILLON", "LITLEO", "PYROAR", "FLABÉBÉ", "FLOETTE", "FLORGES", "SKIDDO", "GOGOAT", "PANCHAM", "PANGORO", "FURFROU", "ESPURR", "MEOWSTIC", "HONEDGE", "DOUBLADE", "AEGISLASH", "SPRITZEE", "AROMATISSE", "SWIRLIX", "SLURPUFF", "INKAY", "MALAMAR", "BINACLE", "BARBARACLE", "SKRELP", "DRAGALGE", "CLAUNCHER", "CLAWITZER", "HELIOPTILE", "HELIOLISK", "TYRUNT", "TYRANTRUM", "AMAURA", "AURORUS", "SYLVEON", "HAWLUCHA", "DEDENNE", "CARBINK", "GOOMY", "SLIGGOO", "GOODRA", "KLEFKI", "PHANTUMP", "TREVENANT", "PUMPKABOO", "GOURGEIST", "BERGMITE", "AVALUGG", "NOIBAT", "NOIVERN", "XERNEAS", "YVELTAL", "ZYGARDE", "DIANCIE", "HOOPA", "VOLCANION", "ROWLET", "DARTRIX", "DECIDUEYE", "LITTEN", "TORRACAT", "INCINEROAR", "POPPLIO", "BRIONNE", "PRIMARINA", "PIKIPEK", "TRUMBEAK", "TOUCANNON", "YUNGOOS", "GUMSHOOS", "GRUBBIN", "CHARJABUG", "VIKAVOLT", "CRABRAWLER", "CRABOMINABLE", "ORICORIO", "CUTIEFLY", "RIBOMBEE", "ROCKRUFF", "LYCANROC", "WISHIWASHI", "MAREANIE", "TOXAPEX", "MUDBRAY", "MUDSDALE", "DEWPIDER", "ARAQUANID", "FOMANTIS", "LURANTIS", "MORELULL", "SHIINOTIC", "SALANDIT", "SALAZZLE", "STUFFUL", "BEWEAR", "BOUNSWEET", "STEENEE", "TSAREENA", "COMFEY", "ORANGURU", "PASSIMIAN", "WIMPOD", "GOLISOPOD", "SANDYGAST", "PALOSSAND", "PYUKUMUKU", "CÓDIGO CERO", "SILVALLY", "MINIOR", "KOMALA", "TURTONATOR", "TOGEDEMARU", "MIMIKYU", "BRUXISH", "DRAMPA", "DHELMISE", "JANGMO-O", "HAKAMO-O", "KOMMO-O", "TAPU KOKO", "TAPU LELE", "TAPU BULU", "TAPU FINI", "COSMOG", "COSMOEM", "SOLGALEO", "LUNALA", "NIHILEGO", "BUZZWOLE", "PHEROMOSA", "XURKITREE", "CELESTEELA", "KARTANA", "GUZZLORD", "NECROZMA", "MAGEARNA", "MARSHADOW", "POIPOLE", "NAGANADEL", "STAKATAKA", "BLACEPHALON", "ZERAORA", "MELTAN", "MELMETAL", "GROOKEY", "THWACKEY", "RILLABOOM", "SCORBUNNY", "RABOOT", "CINDERACE", "SOBBLE", "DRIZZILE", "INTELEON", "SKWOVET", "GREEDENT", "ROOKIDEE", "CORVISQUIRE", "CORVIKNIGHT", "BLIPBUG", "DOTTLER", "ORBEETLE", "NICKIT", "THIEVUL", "GOSSIFLEUR", "ELDEGOSS", "WOOLOO", "DUBWOOL", "CHEWTLE", "DREDNAW", "YAMPER", "BOLTUND", "ROLYCOLY", "CARKOL", "COALOSSAL", "APPLIN", "FLAPPLE", "APPLETUN", "SILICOBRA", "SANDACONDA", "CRAMORANT", "ARROKUDA", "BARRASKEWDA", "TOXEL", "TOXTRICITY", "SIZZLIPEDE", "CENTISKORCH", "CLOBBOPUS", "GRAPPLOCT", "SINISTEA", "POLTEAGEIST", "HATENNA", "HATTREM", "HATTERENE", "IMPIDIMP", "MORGREM", "GRIMMSNARL", "OBSTAGOON", "PERRSERKER", "CURSOLA", "SIRFETCH’D", "MR. RIME", "RUNERIGUS", "MILCERY", "ALCREMIE", "FALINKS", "PINCURCHIN", "SNOM", "FROSMOTH", "STONJOURNER", "EISCUE", "INDEEDEE", "MORPEKO", "CUFANT", "COPPERAJAH", "DRACOZOLT", "ARCTOZOLT", "DRACOVISH", "ARCTOVISH", "DURALUDON", "DREEPY", "DRAKLOAK", "DRAGAPULT", "ZACIAN", "ZAMAZENTA", "ETERNATUS", "KUBFU", "URSHIFU", "ZARUDE", "REGIELEKI", "REGIDRAGO", "GLASTRIER", "SPECTRIER", "CALYREX", "WYRDEER", "KLEAVOR", "URSALUNA", "BASCULEGION", "SNEASLER", "OVERQWIL", "ENAMORUS", "SPRIGATITO", "FLORAGATO", "MEOWSCARADA", "FUECOCO", "CROCALOR", "SKELEDIRGE", "QUAXLY", "QUAXWELL", "QUAQUAVAL", "LECHONK", "OINKOLOGNE", "TAROUNTULA", "SPIDOPS", "NYMBLE", "LOKIX", "PAWMI", "PAWMO", "PAWMOT", "TANDEMAUS", "MAUSHOLD", "FIDOUGH", "DACHSBUN", "SMOLIV", "DOLLIV", "ARBOLIVA", "SQUAWKABILLY", "NACLI", "NACLSTACK", "GARGANACL", "CHARCADET", "ARMAROUGE", "CERULEDGE", "TADBULB", "BELLIBOLT", "WATTREL", "KILOWATTREL", "MASCHIFF", "MABOSSTIFF", "SHROODLE", "GRAFAIAI", "BRAMBLIN", "BRAMBLEGHAST", "TOEDSCOOL", "TOEDSCRUEL", "KLAWF", "CAPSAKID", "SCOVILLAIN", "RELLOR", "RABSCA", "FLITTLE", "ESPATHRA", "TINKATINK", "TINKATUFF", "TINKATON", "WIGLETT", "WUGTRIO", "BOMBIRDIER", "FINIZEN", "PALAFIN", "VAROOM", "REVAVROOM", "CYCLIZAR", "ORTHWORM", "GLIMMET", "GLIMMORA", "GREAVARD", "HOUNDSTONE", "FLAMIGO", "CETODDLE", "CETITAN", "VELUZA", "DONDOZO", "TATSUGIRI", "ANNIHILAPE", "CLODSIRE", "FARIGIRAF", "DUDUNSPARCE", "KINGAMBIT", "COLMILARGO", "COLAGRITO", "FURIOSETA", "MELENALETEO", "REPTALADA", "PELARENA", "FERRODADA", "FERROSACO", "FERROPALMAS", "FERROCUELLO", "FERROPOLILLA", "FERROPÚAS", "FRIGIBAX", "ARCTIBAX", "BAXCALIBUR", "GIMMIGHOUL", "GHOLDENGO", "WO-CHIEN", "CHIEN-PAO", "TING-LU", "CHI-YU", "BRAMALUNA", "FERROPALADÍN", "KORAIDON", "MIRAIDON", "ONDULAGUA", "FERROVERDOR", "DIPPLIN", "POLTCHAGEIST", "SINISTCHA", "OKIDOGI", "MUNKIDORI", "FEZANDIPITI", "OGERPON", "ARCHALUDON", "HYDRAPPLE", "FLAMARIETE", "ELECTROFURIA", "FERROMOLE", "FERROTESTA", "TERAPAGOS", "PECHARUNT" },
  // EN
  { "?", "BULBASAUR", "IVYSAUR", "VENUSAUR", "CHARMANDER", "CHARMELEON", "CHARIZARD", "SQUIRTLE", "WARTORTLE", "BLASTOISE", "CATERPIE", "METAPOD", "BUTTERFREE", "WEEDLE", "KAKUNA", "BEEDRILL", "PIDGEY", "PIDGEOTTO", "PIDGEOT", "RATTATA", "RATICATE", "SPEAROW", "FEAROW", "EKANS", "ARBOK", "PIKACHU", "RAICHU", "SANDSHREW", "SANDSLASH", "NIDORAN F", "NIDORINA", "NIDOQUEEN", "NIDORAN M", "NIDORINO", "NIDOKING", "CLEFAIRY", "CLEFABLE", "VULPIX", "NINETALES", "JIGGLYPUFF", "WIGGLYTUFF", "ZUBAT", "GOLBAT", "ODDISH", "GLOOM", "VILEPLUME", "PARAS", "PARASECT", "VENONAT", "VENOMOTH", "DIGLETT", "DUGTRIO", "MEOWTH", "PERSIAN", "PSYDUCK", "GOLDUCK", "MANKEY", "PRIMEAPE", "GROWLITHE", "ARCANINE", "POLIWAG", "POLIWHIRL", "POLIWRATH", "ABRA", "KADABRA", "ALAKAZAM", "MACHOP", "MACHOKE", "MACHAMP", "BELLSPROUT", "WEEPINBELL", "VICTREEBEL", "TENTACOOL", "TENTACRUEL", "GEODUDE", "GRAVELER", "GOLEM", "PONYTA", "RAPIDASH", "SLOWPOKE", "SLOWBRO", "MAGNEMITE", "MAGNETON", "FARFETCHD", "DODUO", "DODRIO", "SEEL", "DEWGONG", "GRIMER", "MUK", "SHELLDER", "CLOYSTER", "GASTLY", "HAUNTER", "GENGAR", "ONIX", "DROWZEE", "HYPNO", "KRABBY", "KINGLER", "VOLTORB", "ELECTRODE", "EXEGGCUTE", "EXEGGUTOR", "CUBONE", "MAROWAK", "HITMONLEE", "HITMONCHAN", "LICKITUNG", "KOFFING", "WEEZING", "RHYHORN", "RHYDON", "CHANSEY", "TANGELA", "KANGASKHAN", "HORSEA", "SEADRA", "GOLDEEN", "SEAKING", "STARYU", "STARMIE", "MR. MIME", "SCYTHER", "JYNX", "ELECTABUZZ", "MAGMAR", "PINSIR", "TAUROS", "MAGIKARP", "GYARADOS", "LAPRAS", "DITTO", "EEVEE", "VAPOREON", "JOLTEON", "FLAREON", "PORYGON", "OMANYTE", "OMASTAR", "KABUTO", "KABUTOPS", "AERODACTYL", "SNORLAX", "ARTICUNO", "ZAPDOS", "MOLTRES", "DRATINI", "DRAGONAIR", "DRAGONITE", "MEWTWO", "MEW", "CHIKORITA", "BAYLEEF", "MEGANIUM", "CYNDAQUIL", "QUILAVA", "TYPHLOSION", "TOTODILE", "CROCONAW", "FERALIGATR", "SENTRET", "FURRET", "HOOTHOOT", "NOCTOWL", "LEDYBA", "LEDIAN", "SPINARAK", "ARIADOS", "CROBAT", "CHINCHOU", "LANTURN", "PICHU", "CLEFFA", "IGGLYBUFF", "TOGEPI", "TOGETIC", "NATU", "XATU", "MAREEP", "FLAAFFY", "AMPHAROS", "BELLOSSOM", "MARILL", "AZUMARILL", "SUDOWOODO", "POLITOED", "HOPPIP", "SKIPLOOM", "JUMPLUFF", "AIPOM", "SUNKERN", "SUNFLORA", "YANMA", "WOOPER", "QUAGSIRE", "ESPEON", "UMBREON", "MURKROW", "SLOWKING", "MISDREAVUS", "UNOWN", "WOBBUFFET", "GIRAFARIG", "PINECO", "FORRETRESS", "DUNSPARCE", "GLIGAR", "STEELIX", "SNUBBULL", "GRANBULL", "QWILFISH", "SCIZOR", "SHUCKLE", "HERACROSS", "SNEASEL", "TEDDIURSA", "URSARING", "SLUGMA", "MAGCARGO", "SWINUB", "PILOSWINE", "CORSOLA", "REMORAID", "OCTILLERY", "DELIBIRD", "MANTINE", "SKARMORY", "HOUNDOUR", "HOUNDOOM", "KINGDRA", "PHANPY", "DONPHAN", "PORYGON2", "STANTLER", "SMEARGLE", "TYROGUE", "HITMONTOP", "SMOOCHUM", "ELEKID", "MAGBY", "MILTANK", "BLISSEY", "RAIKOU", "ENTEI", "SUICUNE", "LARVITAR", "PUPITAR", "TYRANITAR", "LUGIA", "HO-OH", "CELEBI", "TREECKO", "GROVYLE", "SCEPTILE", "TORCHIC", "COMBUSKEN", "BLAZIKEN", "MUDKIP", "MARSHTOMP", "SWAMPERT", "POOCHYENA", "MIGHTYENA", "ZIGZAGOON", "LINOONE", "WURMPLE", "SILCOON", "BEAUTIFLY", "CASCOON", "DUSTOX", "LOTAD", "LOMBRE", "LUDICOLO", "SEEDOT", "NUZLEAF", "SHIFTRY", "TAILLOW", "SWELLOW", "WINGULL", "PELIPPER", "RALTS", "KIRLIA", "GARDEVOIR", "SURSKIT", "MASQUERAIN", "SHROOMISH", "BRELOOM", "SLAKOTH", "VIGOROTH", "SLAKING", "NINCADA", "NINJASK", "SHEDINJA", "WHISMUR", "LOUDRED", "EXPLOUD", "MAKUHITA", "HARIYAMA", "AZURILL", "NOSEPASS", "SKITTY", "DELCATTY", "SABLEYE", "MAWILE", "ARON", "LAIRON", "AGGRON", "MEDITITE", "MEDICHAM", "ELECTRIKE", "MANECTRIC", "PLUSLE", "MINUN", "VOLBEAT", "ILLUMISE", "ROSELIA", "GULPIN", "SWALOT", "CARVANHA", "SHARPEDO", "WAILMER", "WAILORD", "NUMEL", "CAMERUPT", "TORKOAL", "SPOINK", "GRUMPIG", "SPINDA", "TRAPINCH", "VIBRAVA", "FLYGON", "CACNEA", "CACTURNE", "SWABLU", "ALTARIA", "ZANGOOSE", "SEVIPER", "LUNATONE", "SOLROCK", "BARBOACH", "WHISCASH", "CORPHISH", "CRAWDAUNT", "BALTOY", "CLAYDOL", "LILEEP", "CRADILY", "ANORITH", "ARMALDO", "FEEBAS", "MILOTIC", "CASTFORM", "KECLEON", "SHUPPET", "BANETTE", "DUSKULL", "DUSCLOPS", "TROPIUS", "CHIMECHO", "ABSOL", "WYNAUT", "SNORUNT", "GLALIE", "SPHEAL", "SEALEO", "WALREIN", "CLAMPERL", "HUNTAIL", "GOREBYSS", "RELICANTH", "LUVDISC", "BAGON", "SHELGON", "SALAMENCE", "BELDUM", "METANG", "METAGROSS", "REGIROCK", "REGICE", "REGISTEEL", "LATIAS", "LATIOS", "KYOGRE", "GROUDON", "RAYQUAZA", "JIRACHI", "DEOXYS", "TURTWIG", "GROTLE", "TORTERRA", "CHIMCHAR", "MONFERNO", "INFERNAPE", "PIPLUP", "PRINPLUP", "EMPOLEON", "STARLY", "STARAVIA", "STARAPTOR", "BIDOOF", "BIBAREL", "KRICKETOT", "KRICKETUNE", "SHINX", "LUXIO", "LUXRAY", "BUDEW", "ROSERADE", "CRANIDOS", "RAMPARDOS", "SHIELDON", "BASTIODON", "BURMY", "WORMADAM", "MOTHIM", "COMBEE", "VESPIQUEN", "PACHIRISU", "BUIZEL", "FLOATZEL", "CHERUBI", "CHERRIM", "SHELLOS", "GASTRODON", "AMBIPOM", "DRIFLOON", "DRIFBLIM", "BUNEARY", "LOPUNNY", "MISMAGIUS", "HONCHKROW", "GLAMEOW", "PURUGLY", "CHINGLING", "STUNKY", "SKUNTANK", "BRONZOR", "BRONZONG", "BONSLY", "MIME JR.", "HAPPINY", "CHATOT", "SPIRITOMB", "GIBLE", "GABITE", "GARCHOMP", "MUNCHLAX", "RIOLU", "LUCARIO", "HIPPOPOTAS", "HIPPOWDON", "SKORUPI", "DRAPION", "CROAGUNK", "TOXICROAK", "CARNIVINE", "FINNEON", "LUMINEON", "MANTYKE", "SNOVER", "ABOMASNOW", "WEAVILE", "MAGNEZONE", "LICKILICKY", "RHYPERIOR", "TANGROWTH", "ELECTIVIRE", "MAGMORTAR", "TOGEKISS", "YANMEGA", "LEAFEON", "GLACEON", "GLISCOR", "MAMOSWINE", "PORYGON-Z", "GALLADE", "PROBOPASS", "DUSKNOIR", "FROSLASS", "ROTOM", "UXIE", "MESPRIT", "AZELF", "DIALGA", "PALKIA", "HEATRAN", "REGIGIGAS", "GIRATINA", "CRESSELIA", "PHIONE", "MANAPHY", "DARKRAI", "SHAYMIN", "ARCEUS", "VICTINI", "SNIVY", "SERVINE", "SERPERIOR", "TEPIG", "PIGNITE", "EMBOAR", "OSHAWOTT", "DEWOTT", "SAMUROTT", "PATRAT", "WATCHOG", "LILLIPUP", "HERDIER", "STOUTLAND", "PURRLOIN", "LIEPARD", "PANSAGE", "SIMISAGE", "PANSEAR", "SIMISEAR", "PANPOUR", "SIMIPOUR", "MUNNA", "MUSHARNA", "PIDOVE", "TRANQUILL", "UNFEZANT", "BLITZLE", "ZEBSTRIKA", "ROGGENROLA", "BOLDORE", "GIGALITH", "WOOBAT", "SWOOBAT", "DRILBUR", "EXCADRILL", "AUDINO", "TIMBURR", "GURDURR", "CONKELDURR", "TYMPOLE", "PALPITOAD", "SEISMITOAD", "THROH", "SAWK", "SEWADDLE", "SWADLOON", "LEAVANNY", "VENIPEDE", "WHIRLIPEDE", "SCOLIPEDE", "COTTONEE", "WHIMSICOTT", "PETILIL", "LILLIGANT", "BASCULIN", "SANDILE", "KROKOROK", "KROOKODILE", "DARUMAKA", "DARMANITAN", "MARACTUS", "DWEBBLE", "CRUSTLE", "SCRAGGY", "SCRAFTY", "SIGILYPH", "YAMASK", "COFAGRIGUS", "TIRTOUGA", "CARRACOSTA", "ARCHEN", "ARCHEOPS", "TRUBBISH", "GARBODOR", "ZORUA", "ZOROARK", "MINCCINO", "CINCCINO", "GOTHITA", "GOTHORITA", "GOTHITELLE", "SOLOSIS", "DUOSION", "REUNICLUS", "DUCKLETT", "SWANNA", "VANILLITE", "VANILLISH", "VANILLUXE", "DEERLING", "SAWSBUCK", "EMOLGA", "KARRABLAST", "ESCAVALIER", "FOONGUS", "AMOONGUSS", "FRILLISH", "JELLICENT", "ALOMOMOLA", "JOLTIK", "GALVANTULA", "FERROSEED", "FERROTHORN", "KLINK", "KLANG", "KLINKLANG", "TYNAMO", "EELEKTRIK", "EELEKTROSS", "ELGYEM", "BEHEEYEM", "LITWICK", "LAMPENT", "CHANDELURE", "AXEW", "FRAXURE", "HAXORUS", "CUBCHOO", "BEARTIC", "CRYOGONAL", "SHELMET", "ACCELGOR", "STUNFISK", "MIENFOO", "MIENSHAO", "DRUDDIGON", "GOLETT", "GOLURK", "PAWNIARD", "BISHARP", "BOUFFALANT", "RUFFLET", "BRAVIARY", "VULLABY", "MANDIBUZZ", "HEATMOR", "DURANT", "DEINO", "ZWEILOUS", "HYDREIGON", "LARVESTA", "VOLCARONA", "COBALION", "TERRAKION", "VIRIZION", "TORNADUS", "THUNDURUS", "RESHIRAM", "ZEKROM", "LANDORUS", "KYUREM", "KELDEO", "MELOETTA", "GENESECT", "CHESPIN", "QUILLADIN", "CHESNAUGHT", "FENNEKIN", "BRAIXEN", "DELPHOX", "FROAKIE", "FROGADIER", "GRENINJA", "BUNNELBY", "DIGGERSBY", "FLETCHLING", "FLETCHINDER", "TALONFLAME", "SCATTERBUG", "SPEWPA", "VIVILLON", "LITLEO", "PYROAR", "FLABÉBÉ", "FLOETTE", "FLORGES", "SKIDDO", "GOGOAT", "PANCHAM", "PANGORO", "FURFROU", "ESPURR", "MEOWSTIC", "HONEDGE", "DOUBLADE", "AEGISLASH", "SPRITZEE", "AROMATISSE", "SWIRLIX", "SLURPUFF", "INKAY", "MALAMAR", "BINACLE", "BARBARACLE", "SKRELP", "DRAGALGE", "CLAUNCHER", "CLAWITZER", "HELIOPTILE", "HELIOLISK", "TYRUNT", "TYRANTRUM", "AMAURA", "AURORUS", "SYLVEON", "HAWLUCHA", "DEDENNE", "CARBINK", "GOOMY", "SLIGGOO", "GOODRA", "KLEFKI", "PHANTUMP", "TREVENANT", "PUMPKABOO", "GOURGEIST", "BERGMITE", "AVALUGG", "NOIBAT", "NOIVERN", "XERNEAS", "YVELTAL", "ZYGARDE", "DIANCIE", "HOOPA", "VOLCANION", "ROWLET", "DARTRIX", "DECIDUEYE", "LITTEN", "TORRACAT", "INCINEROAR", "POPPLIO", "BRIONNE", "PRIMARINA", "PIKIPEK", "TRUMBEAK", "TOUCANNON", "YUNGOOS", "GUMSHOOS", "GRUBBIN", "CHARJABUG", "VIKAVOLT", "CRABRAWLER", "CRABOMINABLE", "ORICORIO", "CUTIEFLY", "RIBOMBEE", "ROCKRUFF", "LYCANROC", "WISHIWASHI", "MAREANIE", "TOXAPEX", "MUDBRAY", "MUDSDALE", "DEWPIDER", "ARAQUANID", "FOMANTIS", "LURANTIS", "MORELULL", "SHIINOTIC", "SALANDIT", "SALAZZLE", "STUFFUL", "BEWEAR", "BOUNSWEET", "STEENEE", "TSAREENA", "COMFEY", "ORANGURU", "PASSIMIAN", "WIMPOD", "GOLISOPOD", "SANDYGAST", "PALOSSAND", "PYUKUMUKU", "TYPE: NULL", "SILVALLY", "MINIOR", "KOMALA", "TURTONATOR", "TOGEDEMARU", "MIMIKYU", "BRUXISH", "DRAMPA", "DHELMISE", "JANGMO-O", "HAKAMO-O", "KOMMO-O", "TAPU KOKO", "TAPU LELE", "TAPU BULU", "TAPU FINI", "COSMOG", "COSMOEM", "SOLGALEO", "LUNALA", "NIHILEGO", "BUZZWOLE", "PHEROMOSA", "XURKITREE", "CELESTEELA", "KARTANA", "GUZZLORD", "NECROZMA", "MAGEARNA", "MARSHADOW", "POIPOLE", "NAGANADEL", "STAKATAKA", "BLACEPHALON", "ZERAORA", "MELTAN", "MELMETAL", "GROOKEY", "THWACKEY", "RILLABOOM", "SCORBUNNY", "RABOOT", "CINDERACE", "SOBBLE", "DRIZZILE", "INTELEON", "SKWOVET", "GREEDENT", "ROOKIDEE", "CORVISQUIRE", "CORVIKNIGHT", "BLIPBUG", "DOTTLER", "ORBEETLE", "NICKIT", "THIEVUL", "GOSSIFLEUR", "ELDEGOSS", "WOOLOO", "DUBWOOL", "CHEWTLE", "DREDNAW", "YAMPER", "BOLTUND", "ROLYCOLY", "CARKOL", "COALOSSAL", "APPLIN", "FLAPPLE", "APPLETUN", "SILICOBRA", "SANDACONDA", "CRAMORANT", "ARROKUDA", "BARRASKEWDA", "TOXEL", "TOXTRICITY", "SIZZLIPEDE", "CENTISKORCH", "CLOBBOPUS", "GRAPPLOCT", "SINISTEA", "POLTEAGEIST", "HATENNA", "HATTREM", "HATTERENE", "IMPIDIMP", "MORGREM", "GRIMMSNARL", "OBSTAGOON", "PERRSERKER", "CURSOLA", "SIRFETCH’D", "MR. RIME", "RUNERIGUS", "MILCERY", "ALCREMIE", "FALINKS", "PINCURCHIN", "SNOM", "FROSMOTH", "STONJOURNER", "EISCUE", "INDEEDEE", "MORPEKO", "CUFANT", "COPPERAJAH", "DRACOZOLT", "ARCTOZOLT", "DRACOVISH", "ARCTOVISH", "DURALUDON", "DREEPY", "DRAKLOAK", "DRAGAPULT", "ZACIAN", "ZAMAZENTA", "ETERNATUS", "KUBFU", "URSHIFU", "ZARUDE", "REGIELEKI", "REGIDRAGO", "GLASTRIER", "SPECTRIER", "CALYREX", "WYRDEER", "KLEAVOR", "URSALUNA", "BASCULEGION", "SNEASLER", "OVERQWIL", "ENAMORUS", "SPRIGATITO", "FLORAGATO", "MEOWSCARADA", "FUECOCO", "CROCALOR", "SKELEDIRGE", "QUAXLY", "QUAXWELL", "QUAQUAVAL", "LECHONK", "OINKOLOGNE", "TAROUNTULA", "SPIDOPS", "NYMBLE", "LOKIX", "PAWMI", "PAWMO", "PAWMOT", "TANDEMAUS", "MAUSHOLD", "FIDOUGH", "DACHSBUN", "SMOLIV", "DOLLIV", "ARBOLIVA", "SQUAWKABILLY", "NACLI", "NACLSTACK", "GARGANACL", "CHARCADET", "ARMAROUGE", "CERULEDGE", "TADBULB", "BELLIBOLT", "WATTREL", "KILOWATTREL", "MASCHIFF", "MABOSSTIFF", "SHROODLE", "GRAFAIAI", "BRAMBLIN", "BRAMBLEGHAST", "TOEDSCOOL", "TOEDSCRUEL", "KLAWF", "CAPSAKID", "SCOVILLAIN", "RELLOR", "RABSCA", "FLITTLE", "ESPATHRA", "TINKATINK", "TINKATUFF", "TINKATON", "WIGLETT", "WUGTRIO", "BOMBIRDIER", "FINIZEN", "PALAFIN", "VAROOM", "REVAVROOM", "CYCLIZAR", "ORTHWORM", "GLIMMET", "GLIMMORA", "GREAVARD", "HOUNDSTONE", "FLAMIGO", "CETODDLE", "CETITAN", "VELUZA", "DONDOZO", "TATSUGIRI", "ANNIHILAPE", "CLODSIRE", "FARIGIRAF", "DUDUNSPARCE", "KINGAMBIT", "GREAT TUSK", "SCREAM TAIL", "BRUTE BONNET", "FLUTTER MANE", "SLITHER WING", "SANDY SHOCKS", "IRON TREADS", "IRON BUNDLE", "IRON HANDS", "IRON JUGULIS", "IRON MOTH", "IRON THORNS", "FRIGIBAX", "ARCTIBAX", "BAXCALIBUR", "GIMMIGHOUL", "GHOLDENGO", "WO-CHIEN", "CHIEN-PAO", "TING-LU", "CHI-YU", "ROARING MOON", "IRON VALIANT", "KORAIDON", "MIRAIDON", "WALKING WAKE", "IRON LEAVES", "DIPPLIN", "POLTCHAGEIST", "SINISTCHA", "OKIDOGI", "MUNKIDORI", "FEZANDIPITI", "OGERPON", "ARCHALUDON", "HYDRAPPLE", "GOUGING FIRE", "RAGING BOLT", "IRON BOULDER", "IRON CROWN", "TERAPAGOS", "PECHARUNT" },
  // FR
  { "?", "BULBIZARRE", "HERBIZARRE", "FLORIZARRE", "SALAMECHE", "REPTINCEL", "DRACAUFEU", "CARAPUCE", "CARABAFFE", "TORTANK", "CHENIPAN", "CHRYSACIER", "PAPILUSION", "ASPICOT", "COCONFORT", "DARDARGNAN", "ROUCOOL", "ROUCOUPS", "ROUCARNAGE", "RATTATA", "RATTATAC", "PIAFABEC", "RAPASDEPIC", "ABO", "ARBOK", "PIKACHU", "RAICHU", "SABELETTE", "SABLAIREAU", "NIDORAN F", "NIDORINA", "NIDOQUEEN", "NIDORAN M", "NIDORINO", "NIDOKING", "MELOFEE", "MELODELFE", "GOUPIX", "FEUNARD", "RONDOUDOU", "GRODOUDOU", "NOSFERAPTI", "NOSFERALTO", "MYSTHERBE", "ORTIDE", "RAFFLESIA", "PARAS", "PARASECT", "MIMITOSS", "AEROMITE", "TAUPIQUEUR", "TRIOPIKEUR", "MIAOUSS", "PERSIAN", "PSYKOKWAK", "AKWAKWAK", "FEROSINGE", "COLOSSINGE", "CANINOS", "ARCANIN", "PTITARD", "TETARTE", "TARTARD", "ABRA", "KADABRA", "ALAKAZAM", "MACHOC", "MACHOPEUR", "MACKOGNEUR", "CHETIFLOR", "BOUSTIFLOR", "EMPIFLOR", "TENTACOOL", "TENTACRUEL", "RACAILLOU", "GRAVALANCH", "GROLEM", "PONYTA", "GALOPA", "RAMOLOSS", "FLAGADOSS", "MAGNETI", "MAGNETON", "CANARTICHO", "DODUO", "DODRIO", "OTARIA", "LAMANTINE", "TADMORV", "GROTADMORV", "KOKIYAS", "CRUSTABRI", "FANTOMINUS", "SPECTRUM", "ECTOPLASMA", "ONIX", "SOPORIFIK", "HYPNOMADE", "KRABBY", "KRABBOSS", "VOLTORBE", "ELECTRODE", "NOEUNOEUF", "NOADKOKO", "OSSELAIT", "OSSATUEUR", "KICKLEE", "TYGNON", "EXCELANGUE", "SMOGO", "SMOGOGO", "RHINOCORNE", "RHINOFEROS", "LEVEINARD", "SAQUEDENEU", "KANGOUREX", "HYPOTREMPE", "HYPOCEAN", "POISSIRENE", "POISSOROY", "STARI", "STAROSS", "M. MIME", "INSECATEUR", "LIPPOUTOU", "ELEKTEK", "MAGMAR", "SCARABRUTE", "TAUROS", "MAGICARPE", "LEVIATOR", "LOKHLASS", "METAMORPH", "EVOLI", "AQUALI", "VOLTALI", "PYROLI", "PORYGON", "AMONITA", "AMONISTAR", "KABUTO", "KABUTOPS", "PTERA", "RONFLEX", "ARTIKODIN", "ELECTHOR", "SULFURA", "MINIDRACO", "DRACO", "DRACOLOSSE", "MEWTWO", "MEW", "GERMIGNON", "MACRONIUM", "MEGANIUM", "HERICENDRE", "FEURISSON", "TYPHLOSION", "KAIMINUS", "CROCRODIL", "ALIGATUEUR", "FOUINETTE", "FOUINAR", "HOOTHOOT", "NOARFANG", "COXY", "COXYCLAQUE", "MIMIGAL", "MIGALOS", "NOSTENFER", "LOUPIO", "LANTURN", "PICHU", "MELO", "TOUDOUDOU", "TOGEPI", "TOGETIC", "NATU", "XATU", "WATTOUAT", "LAINERGIE", "PHARAMP", "JOLIFLOR", "MARILL", "AZUMARILL", "SIMULARBRE", "TARPAUD", "GRANIVOL", "FLORAVOL", "COTOVOL", "CAPUMAIN", "TOURNEGRIN", "HELIATRONC", "YANMA", "AXOLOTO", "MARAISTE", "MENTALI", "NOCTALI", "CORNEBRE", "ROIGADA", "FEUFOREVE", "ZARBI", "QULBUTOKE", "GIRAFARIG", "POMDEPIK", "FORETRESS", "INSOLOURDO", "SCORPLANE", "STEELIX", "SNUBBULL", "GRANBULL", "QWILFISH", "CIZAYOX", "CARATROC", "SCARHINO", "FARFURET", "TEDDIURSA", "URSARING", "LIMAGMA", "VOLCAROPOD", "MARCACRIN", "COCHIGNON", "CORAYON", "REMORAID", "OCTILLERY", "CADOIZO", "DEMANTA", "AIRMURE", "MALOSSE", "DEMOLOSSE", "HYPOROI", "PHANPY", "DONPHAN", "PORYGON2", "CERFROUSSE", "QUEULORIOR", "DEBUGANT", "KAPOERA", "LIPPOUTI", "ELEKID", "MAGBY", "ECREMEUH", "LEUPHORIE", "RAIKOU", "ENTEI", "SUICUNE", "EMBRYLEX", "YMPHECT", "TYRANOCIF", "LUGIA", "HO-OH", "CELEBI", "ARCKO", "MASSKO", "JUNGKO", "POUSSIFEU", "GALIFEU", "BRASEGALI", "GOBOU", "FLOBIO", "LAGGRON", "MEDHYENA", "GRAHYENA", "ZIGZATON", "LINEON", "CHENIPOTTE", "ARMULYS", "CHARMILLON", "BLINDALYS", "PAPINOX", "NENUPIOT", "LOMBRE", "LUDICOLO", "GRAINIPIOT", "PIFEUIL", "TENGALICE", "NIRONDELLE", "HELEDELLE", "GOELISE", "BEKIPAN", "TARSAL", "KIRLIA", "GARDEVOIR", "ARAKDO", "MASKADRA", "BALIGNON", "CHAPIGNON", "PARECOOL", "VIGOROTH", "MONAFLEMIT", "NINGALE", "NINJASK", "MUNJA", "CHUCHMUR", "RAMBOUM", "BROUHABAM", "MAKUHITA", "HARIYAMA", "AZURILL", "TARINOR", "SKITTY", "DELCATTY", "TENEFIX", "MYSDIBULE", "GALEKID", "GALEGON", "GALEKING", "MEDITIKKA", "CHARMINA", "DYNAVOLT", "ELECSPRINT", "POSIPI", "NEGAPI", "MUCIOLE", "LUMIVOLE", "ROSELIA", "GLOUPTI", "AVALTOUT", "CARVANHA", "SHARPEDO", "WAILMER", "WAILORD", "CHAMALLOT", "CAMERUPT", "CHARTOR", "SPOINK", "GRORET", "SPINDA", "KRAKNOIX", "VIBRANINF", "LIBEGON", "CACNEA", "CACTURNE", "TYLTON", "ALTARIA", "MANGRIFF", "SEVIPER", "SELEROC", "SOLAROC", "BARLOCHE", "BARBICHA", "ECRAPINCE", "COLHOMARD", "BALBUTO", "KAORINE", "LILIA", "VACILYS", "ANORITH", "ARMALDO", "BARPAU", "MILOBELLUS", "MORPHEO", "KECLEON", "POLICHOMBR", "BRANETTE", "SKELENOX", "TERACLOPE", "TROPIUS", "EOKO", "ABSOL", "OKEOKE", "STALGAMIN", "ONIGLALI", "OBALIE", "PHOGLEUR", "KAIMORSE", "COQUIPERL", "SERPANG", "ROSABYSS", "RELICANTH", "LOVDISC", "DRABY", "DRACKHAUS", "DRATTAK", "TERHAL", "METANG", "METALOSSE", "REGIROCK", "REGICE", "REGISTEEL", "LATIAS", "LATIOS", "KYOGRE", "GROUDON", "RAYQUAZA", "JIRACHI", "DEOXYS", "TORTIPOUSS", "BOSKARA", "TORTERRA", "OUISTICRAM", "CHIMPENFEU", "SIMIABRAZ", "TIPLOUF", "PRINPLOUF", "PINGOLÉON", "ÉTOURMI", "ÉTOURVOL", "ÉTOURAPTOR", "KEUNOTOR", "CASTORNO", "CRIKZIK", "MÉLOKRIK", "LIXY", "LUXIO", "LUXRAY", "ROZBOUTON", "ROSERADE", "KRANIDOS", "CHARKOS", "DINOCLIER", "BASTIODON", "CHENITI", "CHENISELLE", "PAPILORD", "APITRINI", "APIREINE", "PACHIRISU", "MUSTÉBOUÉE", "MUSTÉFLOTT", "CERIBOU", "CERIFLOR", "SANCOKI", "TRITOSOR", "CAPIDEXTRE", "BAUDRIVE", "GRODRIVE", "LAPOREILLE", "LOCKPIN", "MAGIRÊVE", "CORBOSS", "CHAGLAM", "CHAFFREUX", "KORILLON", "MOUFOUETTE", "MOUFFLAIR", "ARCHÉOMIRE", "ARCHÉODONG", "MANZAÏ", "MIME JR.", "PTIRAVI", "PIJAKO", "SPIRITOMB", "GRIKNOT", "CARMACHE", "CARCHACROK", "GOINFREX", "RIOLU", "LUCARIO", "HIPPOPOTAS", "HIPPODOCUS", "RAPION", "DRASCORE", "CRADOPAUD", "COATOX", "VORTENTE", "ÉCAYON", "LUMINÉON", "BABIMANTA", "BLIZZI", "BLIZZAROI", "DIMORET", "MAGNÉZONE", "COUDLANGUE", "RHINASTOC", "BOULDENEU", "ÉLEKABLE", "MAGANON", "TOGEKISS", "YANMEGA", "PHYLLALI", "GIVRALI", "SCORVOL", "MAMMOCHON", "PORYGON-Z", "GALLAME", "TARINORME", "NOCTUNOIR", "MOMARTIK", "MOTISMA", "CRÉHELF", "CRÉFOLLET", "CRÉFADET", "DIALGA", "PALKIA", "HEATRAN", "REGIGIGAS", "GIRATINA", "CRESSELIA", "PHIONE", "MANAPHY", "DARKRAI", "SHAYMIN", "ARCEUS", "VICTINI", "VIPÉLIERRE", "LIANAJA", "MAJASPIC", "GRUIKUI", "GROTICHON", "ROITIFLAM", "MOUSTILLON", "MATELOUTRE", "CLAMIRAL", "RATENTIF", "MIRADAR", "PONCHIOT", "PONCHIEN", "MASTOUFFE", "CHACRIPAN", "LÉOPARDUS", "FEUILLAJOU", "FEUILOUTAN", "FLAMAJOU", "FLAMOUTAN", "FLOTAJOU", "FLOTOUTAN", "MUNNA", "MUSHANA", "POICHIGEON", "COLOMBEAU", "DÉFLAISAN", "ZÉBIBRON", "ZÉBLITZ", "NODULITHE", "GÉOLITHE", "GIGALITHE", "CHOVSOURIR", "RHINOLOVE", "ROTOTAUPE", "MINOTAUPE", "NANMÉOUÏE", "CHARPENTI", "OUVRIFIER", "BÉTOCHEF", "TRITONDE", "BATRACNÉ", "CRAPUSTULE", "JUDOKRAK", "KARACLÉE", "LARVEYETTE", "COUVERDURE", "MANTERNEL", "VENIPATTE", "SCOBOLIDE", "BRUTAPODE", "DOUDOUVET", "FARFADUVET", "CHLOROBULE", "FRAGILADY", "BARGANTUA", "MASCAÏMAN", "ESCROCO", "CROCORIBLE", "DARUMAROND", "DARUMACHO", "MARACACHI", "CRABICOQUE", "CRABARAQUE", "BAGGIGUANE", "BAGGAÏD", "CRYPTÉRO", "TUTAFEH", "TUTANKAFER", "CARAPAGOS", "MÉGAPAGOS", "ARKÉAPTI", "AÉROPTÉRYX", "MIAMIASME", "MIASMAX", "ZORUA", "ZOROARK", "CHINCHIDOU", "PASHMILLA", "SCRUTELLA", "MESMÉRELLA", "SIDÉRELLA", "NUCLÉOS", "MÉIOS", "SYMBIOS", "COUANETON", "LAKMÉCYGNE", "SORBÉBÉ", "SORBOUL", "SORBOUBOUL", "VIVALDAIM", "HAYDAIM", "EMOLGA", "CARABING", "LANÇARGOT", "TROMPIGNON", "GAULET", "VISKUSE", "MOYADE", "MAMANBO", "STATITIK", "MYGAVOLT", "GRINDUR", "NOACIER", "TIC", "CLIC", "CLITICLIC", "ANCHWATT", "LAMPÉROIE", "OHMASSACRE", "LEWSOR", "NEITRAM", "FUNÉCIRE", "MÉLANCOLUX", "LUGULABRE", "COUPENOTTE", "INCISACHE", "TRANCHODON", "POLARHUME", "POLAGRIFFE", "HEXAGEL", "ESCARGAUME", "LIMASPEED", "LIMONDE", "KUNGFOUINE", "SHAOFOUINE", "DRAKKARMIN", "GRINGOLEM", "GOLEMASTOC", "SCALPION", "SCALPROIE", "FRISON", "FURAIGLON", "GUERIAIGLE", "VOSTOURNO", "VAUTUTRICE", "AFLAMANOIR", "FERMITE", "SOLOCHI", "DIAMAT", "TRIOXHYDRE", "PYRONILLE", "PYRAX", "COBALTIUM", "TERRAKIUM", "VIRIDIUM", "BORÉAS", "FULGURIS", "RESHIRAM", "ZEKROM", "DÉMÉTÉROS", "KYUREM", "KELDEO", "MELOETTA", "GENESECT", "MARISSON", "BOGUÉRISSE", "BLINDÉPIQUE", "FEUNNEC", "ROUSSIL", "GOUPELIN", "GRENOUSSE", "CROÂPORAL", "AMPHINOBI", "SAPEREAU", "EXCAVARENNE", "PASSEROUGE", "BRAISILLON", "FLAMBUSARD", "LÉPIDONILLE", "PÉRÉGRAIN", "PRISMILLON", "HÉLIONCEAU", "NÉMÉLIOS", "FLABÉBÉ", "FLOETTE", "FLORGES", "CABRIOLAINE", "CHEVROUM", "PANDESPIÈGLE", "PANDARBARE", "COUAFAREL", "PSYSTIGRI", "MISTIGRIX", "MONORPALE", "DIMOCLÈS", "EXAGIDE", "FLUVETIN", "COCOTINE", "SUCROQUIN", "CUPCANAILLE", "SEPIATOP", "SEPIATROCE", "OPERMINE", "GOLGOPATHE", "VENALGUE", "KRAVARECH", "FLINGOUSTE", "GAMBLAST", "GALVARAN", "IGUOLTA", "PTYRANIDUR", "REXILLIUS", "AMAGARA", "DRAGMARA", "NYMPHALI", "BRUTALIBRÉ", "DEDENNE", "STRASSIE", "MUCUSCULE", "COLIMUCUS", "MUPLODOCUS", "TROUSSELIN", "BROCÉLÔME", "DESSÉLIANDE", "PITROUILLE", "BANSHITROUYE", "GRELAÇON", "SÉRACRAWL", "SONISTRELLE", "BRUYVERNE", "XERNEAS", "YVELTAL", "ZYGARDE", "DIANCIE", "HOOPA", "VOLCANION", "BRINDIBOU", "EFFLÈCHE", "ARCHÉDUC", "FLAMIAOU", "MATOUFEU", "FÉLINFERNO", "OTAQUIN", "OTARLETTE", "ORATORIA", "PICASSAUT", "PICLAIRON", "BAZOUCAN", "MANGLOUTON", "ARGOUSTE", "LARVIBULE", "CHRYSAPILE", "LUCANON", "CRABAGARRE", "CRABOMINABLE", "PLUMELINE", "BOMBYDOU", "RUBOMBELLE", "ROCABOT", "LOUGAROC", "FROUSSARDINE", "VORASTÉRIE", "PRÉDASTÉRIE", "TIBOUDET", "BOURRINOS", "ARAQUA", "TARENBULLE", "MIMANTIS", "FLORAMANTIS", "SPODODO", "LAMPIGNON", "TRITOX", "MALAMANDRE", "NOUNOURSON", "CHELOURS", "CROQUINE", "CANDINE", "SUCREINE", "GUÉRILANDE", "GOUROUTAN", "QUARTERMAC", "SOVKIPOU", "SARMURAÏ", "BACABOUH", "TRÉPASSABLE", "CONCOMBAFFE", "TYPE:0", "SILVALLIÉ", "MÉTÉNO", "DODOALA", "BOUMATA", "TOGEDEMARU", "MIMIQUI", "DENTICRISSE", "DRAÏEUL", "SINISTRAIL", "BÉBÉCAILLE", "ÉCAÏD", "ÉKAÏSER", "TOKORICO", "TOKOPIYON", "TOKOTORO", "TOKOPISCO", "COSMOG", "COSMOVUM", "SOLGALEO", "LUNALA", "ZÉROÏD", "MOUSCOTO", "CANCRELOVE", "CÂBLIFÈRE", "BAMBOISELLE", "KATAGAMI", "ENGLOUTYRAN", "NECROZMA", "MAGEARNA", "MARSHADOW", "VÉMINI", "MANDRILLON", "AMA-AMA", "PIERROTEKNIK", "ZERAORA", "MELTAN", "MELMETAL", "OUISTEMPO", "BADABOUIN", "GORYTHMIC", "FLAMBINO", "LAPYRO", "PYROBUT", "LARMÉLÉON", "ARROZARD", "LÉZARGUS", "RONGOURMAND", "RONGRIGOU", "MINISANGE", "BLEUSEILLE", "CORVAILLUS", "LARVADAR", "COLÉODÔME", "ASTRONELLE", "GOUPILOU", "ROUBLENARD", "TOURNICOTON", "BLANCOTON", "MOUMOUTON", "MOUMOUFLON", "KHÉLOCROK", "TORGAMORD", "VOLTOUTOU", "FULGUDOG", "CHARBI", "WAGOMINE", "MONTHRACITE", "VERPOM", "POMDRAPI", "DRATATIN", "DUNAJA", "DUNACONDA", "NIGOSIER", "EMBROCHET", "HASTACUDA", "TOXIZAP", "SALARSEN", "GRILLEPATTES", "SCOLOCENDRE", "POULPAF", "KRAKOS", "THÉFFROI", "POLTHÉGEIST", "BIBICHUT", "CHAPOTUS", "SORCILENCE", "GRIMALIN", "FOURBELIN", "ANGOLIATH", "IXON", "BERSERKATT", "CORAYÔME", "PALARTICHO", "M. GLAQUETTE", "TUTÉTÉKRI", "CRÈMY", "CHARMILLY", "HEXADRON", "WATTAPIK", "FRISSONILLE", "BELDENEIGE", "DOLMAN", "BEKAGLAÇON", "WIMESSIR", "MORPEKO", "CHARIBARI", "PACHYRADJAH", "GALVAGON", "GALVAGLA", "HYDRAGON", "HYDRAGLA", "DURALUGON", "FANTYRM", "DISPAREPTIL", "LANSSORIEN", "ZACIAN", "ZAMAZENTA", "ÉTHERNATOS", "WUSHOURS", "SHIFOURS", "ZARUDE", "REGIELEKI", "REGIDRAGO", "BLIZZEVAL", "SPECTREVAL", "SYLVEROY", "CERBYLLIN", "HACHÉCATEUR", "URSAKING", "PARAGRUEL", "FARFUREX", "QWILPIK", "AMOVÉNUS", "POUSSACHA", "MATOURGEON", "MIASCARADE", "CHOCHODILE", "CROCOGRIL", "FLÂMIGATOR", "COIFFETON", "CANARBELLO", "PALMAVAL", "GOURMELET", "FRAGROIN", "TISSENBOULE", "FILENTRAPPE", "LILLITERELLE", "GAMBEX", "POHM", "POHMOTTE", "POHMARMOTTE", "COMPAGNOL", "FAMIGNOL", "PÂTACHIOT", "BRIOCHIEN", "OLIVINI", "OLIVADO", "ARBOLIVA", "TAPATOÈS", "SELUTIN", "AMASSEL", "GIGANSEL", "CHARBAMBIN", "CARMADURA", "MALVALAME", "TÊTAMPOULE", "AMPIBIDOU", "ZAPÉTREL", "FULGULAIRO", "GRONDOGUE", "DOGRINO", "GRIBOURAIGNE", "TAG-TAG", "VIROVENT", "VIREVORREUR", "TERRACOOL", "TERRACRUEL", "CRAPAROI", "PIMITO", "SCOVILAIN", "LÉBOULÉROU", "BÉRASCA", "FLOTILLON", "CLÉOPSYTRA", "FORGERETTE", "FORGELLA", "FORGELINA", "TAUPIKEAU", "TRIOPIKEAU", "LESTOMBAILE", "DOFIN", "SUPERDOFIN", "VROMBI", "VROMBOTOR", "MOTORIZARD", "FERDETER", "GERMÉCLAT", "FLORÉCLAT", "TOUTOMBE", "TOMBERRO", "FLAMENROULE", "PIÉTACÉ", "BALBALÈZE", "DÉLESTIN", "OYACATA", "NIGIRIGON", "COURROUSINGE", "TERRAISTE", "FARIGIRAF", "DEUSOLOURDO", "SCALPEREUR", "FORT-IVOIRE", "HURLE-QUEUE", "FONGUS-FURIE", "FLOTTE-MÈCHE", "RAMPE-AILES", "PELAGE-SABLÉ", "ROUE-DE-FER", "HOTTE-DE-FER", "PAUME-DE-FER", "TÊTES-DE-FER", "MITE-DE-FER", "ÉPINE-DE-FER", "FRIGODO", "CRYODO", "GLAIVODO", "MORDUDOR", "GROMAGO", "CHONGJIAN", "BAOJIAN", "DINGLU", "YUYU", "RUGIT-LUNE", "GARDE-DE-FER", "KORAIDON", "MIRAIDON", "SERPENTE-EAU", "VERT-DE-FER", "POMDRAMOUR", "POLTCHAGEIST", "THÉFFROYABLE", "FÉLICANIS", "FORTUSIMIA", "FAVIANOS", "OGERPON", "PONDRALUGON", "POMDOROCHI", "FEU-PERÇANT", "IRE-FOUDRE", "ROC-DE-FER", "CHEF-DE-FER", "TERAPAGOS", "PÊCHAMINUS" },
  // DE
  { "?", "BISASAM", "BISAKNOSP", "BISAFLOR", "GLUMANDA", "GLUTEXO", "GLURAK", "SCHIGGY", "SCHILLOK", "TURTOK", "RAUPY", "SAFCON", "SMETTBO", "HORNLIU", "KOKUNA", "BIBOR", "TAUBSI", "TAUBOGA", "TAUBOSS", "RATTFRATZ", "RATTIKARL", "HABITAK", "IBITAK", "RETTAN", "ARBOK", "PIKACHU", "RAICHU", "SANDAN", "SANDAMER", "NIDORAN F", "NIDORINA", "NIDOQUEEN", "NIDORAN M", "NIDORINO", "NIDOKING", "PIEPI", "PIXI", "VULPIX", "VULNONA", "PUMMELUFF", "KNUDDELUFF", "ZUBAT", "GOLBAT", "MYRAPLA", "DUFLOR", "GIFLOR", "PARAS", "PARASEK", "BLUZUK", "OMOT", "DIGDA", "DIGDRI", "MAUZI", "SNOBILIKAT", "ENTON", "ENTORON", "MENKI", "RASAFF", "FUKANO", "ARKANI", "QUAPSEL", "QUAPUTZI", "QUAPPO", "ABRA", "KADABRA", "SIMSALA", "MACHOLLO", "MASCHOCK", "MACHOMEI", "KNOFENSA", "ULTRIGARIA", "SARZENIA", "TENTACHA", "TENTOXA", "KLEINSTEIN", "GEOROK", "GEOWAZ", "PONITA", "GALLOPA", "FLEGMON", "LAHMUS", "MAGNETILO", "MAGNETON", "PORENTA", "DODU", "DODRI", "JUROB", "JUGONG", "SLEIMA", "SLEIMOK", "MUSCHAS", "AUSTOS", "NEBULAK", "ALPOLLO", "GENGAR", "ONIX", "TRAUMATO", "HYPNO", "KRABBY", "KINGLER", "VOLTOBAL", "LEKTROBAL", "OWEI", "KOKOWEI", "TRAGOSSO", "KNOGGA", "KICKLEE", "NOCKCHAN", "SCHLURP", "SMOGON", "SMOGMOG", "RIHORN", "RIZEROS", "CHANEIRA", "TANGELA", "KANGAMA", "SEEPER", "SEEMON", "GOLDINI", "GOLKING", "STERNDU", "STARMIE", "PANTIMOS", "SICHLOR", "ROSSANA", "ELEKTEK", "MAGMAR", "PINSIR", "TAUROS", "KARPADOR", "GARADOS", "LAPRAS", "DITTO", "EVOLI", "AQUANA", "BLITZA", "FLAMARA", "PORYGON", "AMONITAS", "AMOROSO", "KABUTO", "KABUTOPS", "AERODACTYL", "RELAXO", "ARKTOS", "ZAPDOS", "LAVADOS", "DRATINI", "DRAGONIR", "DRAGORAN", "MEWTU", "MEW", "ENDIVIE", "LORBLATT", "MEGANIE", "FEURIGEL", "IGELAVAR", "TORNUPTO", "KARNIMANI", "TYRACROC", "IMPERGATOR", "WIESOR", "WIESENIOR", "HOOTHOOT", "NOCTUH", "LEDYBA", "LEDIAN", "WEBARAK", "ARIADOS", "IKSBAT", "LAMPI", "LANTURN", "PICHU", "PII", "FLUFFELUFF", "TOGEPI", "TOGETIC", "NATU", "XATU", "VOLTILAMM", "WAATY", "AMPHAROS", "BLUBELLA", "MARILL", "AZUMARILL", "MOGELBAUM", "QUAXO", "HOPPSPROSS", "HUBELUPF", "PAPUNGHA", "GRIFFEL", "SONNKERN", "SONNFLORA", "YANMA", "FELINO", "MORLORD", "PSIANA", "NACHTARA", "KRAMURX", "LASCHOKING", "TRAUNFUGIL", "ICOGNITO", "WOINGENAU", "GIRAFARIG", "TANNZA", "FORSTELLKA", "DUMMISEL", "SKORGLA", "STAHLOS", "SNUBBULL", "GRANBULL", "BALDORFISH", "SCHEROX", "POTTROTT", "SKARABORN", "SNIEBEL", "TEDDIURSA", "URSARING", "SCHNECKMAG", "MAGCARGO", "QUIEKEL", "KEIFEL", "CORASONN", "REMORAID", "OCTILLERY", "BOTOGEL", "MANTAX", "PANZAERON", "HUNDUSTER", "HUNDEMON", "SEEDRAKING", "PHANPY", "DONPHAN", "PORYGON2", "DAMHIRPLEX", "FARBEAGLE", "RABAUZ", "KAPOERA", "KUSSILLA", "ELEKID", "MAGBY", "MILTANK", "HEITEIRA", "RAIKOU", "ENTEI", "SUICUNE", "LARVITAR", "PUPITAR", "DESPOTAR", "LUGIA", "HO-OH", "CELEBI", "GECKARBOR", "REPTAIN", "GEWALDRO", "FLEMMLI", "JUNGGLUT", "LOHGOCK", "HYDROPI", "MOORABBEL", "SUMPEX", "FIFFYEN", "MAGNAYEN", "ZIGZACHS", "GERADAKS", "WAUMPEL", "SCHALOKO", "PAPINELLA", "PANEKON", "PUDOX", "LOTURZEL", "LOMBRERO", "KAPPALORES", "SAMURZEL", "BLANAS", "TENGULIST", "SCHWALBINI", "SCHWALBOSS", "WINGULL", "PELIPPER", "TRASLA", "KIRLIA", "GUARDEVOIR", "GEHWEIHER", "MASKEREGEN", "KNILZ", "KAPILZ", "BUMMELZ", "MUNTIER", "LETARKING", "NINCADA", "NINJASK", "NINJATOM", "FLURMEL", "KRAKEELO", "KRAWUMMS", "MAKUHITA", "HARIYAMA", "AZURILL", "NASGNET", "ENECO", "ENEKORO", "ZOBIRIS", "FLUNKIFER", "STOLLUNIOR", "STOLLRAK", "STOLLOSS", "MEDITIE", "MEDITALIS", "FRIZELBLIZ", "VOLTENSO", "PLUSLE", "MINUN", "VOLBEAT", "ILLUMISE", "ROSELIA", "SCHLUPPUCK", "SCHLUKWECH", "KANIVANHA", "TOHAIDO", "WAILMER", "WAILORD", "CAMAUB", "CAMERUPT", "QURTEL", "SPOINK", "GROINK", "PANDIR", "KNACKLION", "VIBRAVA", "LIBELLDRA", "TUSKA", "NOKTUSKA", "WABLU", "ALTARIA", "SENGO", "VIPITIS", "LUNASTEIN", "SONNFEL", "SCHMERBE", "WELSAR", "KREBSCORPS", "KREBUTACK", "PUPPANCE", "LEPUMENTAS", "LILIEP", "WIELIE", "ANORITH", "ARMALDO", "BARSCHWA", "MILOTIC", "FORMEO", "KECLEON", "SHUPPET", "BANETTE", "ZWIRRLICHT", "ZWIRRKLOP", "TROPIUS", "PALIMPALIM", "ABSOL", "ISSO", "SCHNEPPKE", "FIRNONTOR", "SEEMOPS", "SEEJONG", "WALRAISA", "PERLU", "AALABYSS", "SAGANABYSS", "RELICANTH", "LIEBISKUS", "KINDWURM", "DRASCHEL", "BRUTALANDA", "TANHEL", "METANG", "METAGROSS", "REGIROCK", "REGICE", "REGISTEEL", "LATIAS", "LATIOS", "KYOGRE", "GROUDON", "RAYQUAZA", "JIRACHI", "DEOXYS", "CHELAST", "CHELCARAIN", "CHELTERRAR", "PANFLAM", "PANPYRO", "PANFERNO", "PLINFA", "PLIPRIN", "IMPOLEON", "STARALILI", "STARAVIA", "STARAPTOR", "BIDIZA", "BIDIFAS", "ZIRPURZE", "ZIRPEISE", "SHEINUX", "LUXIO", "LUXTRA", "KNOSPI", "ROSERADE", "KOKNODON", "RAMEIDON", "SCHILTERUS", "BOLLTERUS", "BURMY", "BURMADAME", "MOTERPEL", "WADRIBIE", "HONWEISEL", "PACHIRISU", "BAMELIN", "BOJELIN", "KIKUGI", "KINOSO", "SCHALELLOS", "GASTRODON", "AMBIDIFFEL", "DRIFTLON", "DRIFZEPELI", "HASPIROR", "SCHLAPOR", "TRAUNMAGIL", "KRAMSHEF", "CHARMIAN", "SHNURGARST", "KLINGPLIM", "SKUNKAPUH", "SKUNTANK", "BRONZEL", "BRONZONG", "MOBAI", "PANTIMIMI", "WONNEIRA", "PLAUDAGEI", "KRYPPUK", "KAUMALAT", "KNARKSEL", "KNAKRACK", "MAMPFAXO", "RIOLU", "LUCARIO", "HIPPOPOTAS", "HIPPOTERUS", "PIONSKORA", "PIONDRAGI", "GLIBUNKEL", "TOXIQUAK", "VENUFLIBIS", "FINNEON", "LUMINEON", "MANTIRPS", "SHNEBEDECK", "REXBLISAR", "SNIBUNNA", "MAGNEZONE", "SCHLURPLEK", "RIHORNIOR", "TANGOLOSS", "ELEVOLTEK", "MAGBRANT", "TOGEKISS", "YANMEGA", "FOLIPURBA", "GLAZIOLA", "SKORGRO", "MAMUTEL", "PORYGON-Z", "GALAGLADI", "VOLUMINAS", "ZWIRRFINST", "FROSDEDJE", "ROTOM", "SELFE", "VESPRIT", "TOBUTZ", "DIALGA", "PALKIA", "HEATRAN", "REGIGIGAS", "GIRATINA", "CRESSELIA", "PHIONE", "MANAPHY", "DARKRAI", "SHAYMIN", "ARCEUS", "VICTINI", "SERPIFEU", "EFOSERP", "SERPIROYAL", "FLOINK", "FERKOKEL", "FLAMBIREX", "OTTARO", "ZWOTTRONIN", "ADMURAI", "NAGELOTZ", "KUKMARDA", "YORKLEFF", "TERRIBARK", "BISSBARK", "FELILOU", "KLEOPARDA", "VEGIMAK", "VEGICHITA", "GRILLMAK", "GRILLCHITA", "SODAMAK", "SODACHITA", "SOMNIAM", "SOMNIVORA", "DUSSELGURR", "NAVITAUB", "FASASNOB", "ELEZEBA", "ZEBRITZ", "KIESLING", "SEDIMANTUR", "BROCKOLOSS", "FLEKNOIL", "FLETIAMO", "ROTOMURF", "STALOBOR", "OHRDOCH", "PRAKTIBALK", "STREPOLI", "MEISTAGRIF", "SCHALLQUAP", "MEBRANA", "BRANAWARZ", "JIUTESTO", "KARADONIS", "STRAWICKL", "FOLIKON", "MATRIFOL", "TOXIPED", "ROLLUM", "CERAPENDRA", "WAUMBOLL", "ELFUN", "LILMINIP", "DRESSELLA", "BARSCHUFT", "GANOVIL", "ROKKAIMAN", "RABIGATOR", "FLAMPION", "FLAMPIVIAN", "MARACAMBA", "LITHOMITH", "CASTELLITH", "ZURROKEX", "IROKEX", "SYMVOLARA", "MAKABAJA", "ECHNATOLL", "GALAPAFLOS", "KARIPPAS", "FLAPTERYX", "AEROPTERYX", "UNRATÜTOX", "DEPONITOX", "ZORUA", "ZOROARK", "PICOCHILLA", "CHILLABELL", "MOLLIMORBA", "HYPNOMORBA", "MORBITESSE", "MONOZYTO", "MITODOS", "ZYTOMEGA", "PICCOLENTE", "SWARONESS", "GELATINI", "GELATROPPO", "GELATWINO", "SESOKITZ", "KRONJUWILD", "EMOLGA", "LAUKAPS", "CAVALANZAS", "TARNPIGNON", "HUTSASSA", "QUABBEL", "APOQUALLYP", "MAMOLIDA", "WATTZAPF", "VOLTULA", "KASTADUR", "TENTANTEL", "KLIKK", "KLIKLAK", "KLIKDIKLAK", "ZAPPLARDIN", "ZAPPLALEK", "ZAPPLARANG", "PYGRAULON", "MEGALON", "LICHTEL", "LATERNECTO", "SKELABRA", "MILZA", "SHARFAX", "MAXAX", "PETZNIEF", "SIBERIO", "FRIGOMETRI", "SCHNUTHELM", "HYDRAGIL", "FLUNSCHLIK", "LIN-FU", "WIE-SHU", "SHARDRAGO", "GOLBIT", "GOLGANTES", "GLADIANTRI", "CAESURIO", "BISOFANK", "GERONIMATZ", "WASHAKWIL", "SKALLYK", "GRYPHELDIS", "FURNIFRASS", "FERMICULA", "KAPUNO", "DUODINO", "TRIKEPHALO", "IGNIVOR", "RAMOTH", "KOBALIUM", "TERRAKIUM", "VIRIDIUM", "BOREOS", "VOLTOLOS", "RESHIRAM", "ZEKROM", "DEMETEROS", "KYUREM", "KELDEO", "MELOETTA", "GENESECT", "IGAMARO", "IGASTARNISH", "BRIGARON", "FYNX", "RUTENA", "FENNEXIS", "FROXY", "AMPHIZEL", "QUAJUTSU", "SCOPPEL", "GREBBIT", "DARTIRI", "DARTIGNIS", "FIARO", "PURMEL", "PUPONCHO", "VIVILLON", "LEUFEO", "PYROLEO", "FLABÉBÉ", "FLOETTE", "FLORGES", "MÄHIKEL", "CHEVRUMM", "PAM-PAM", "PANDAGRO", "COIFFWAFF", "PSIAU", "PSIAUGON", "GRAMOKLES", "DUOKLES", "DURENGARD", "PARFI", "PARFINESSE", "FLAUSCHLING", "SABBAIONE", "ISCALAR", "CALAMANERO", "BITHORA", "THANATHORA", "ALGITT", "TANDRAK", "SCAMPISTO", "WUMMER", "EGUANA", "ELEZARD", "BALGORAS", "MONARGORAS", "AMARINO", "AMAGARGA", "FEELINARA", "RESLADERO", "DEDENNE", "ROCARA", "VISCORA", "VISCARGOT", "VISCOGON", "CLAVION", "PARAGONI", "TROMBORK", "IRRBIS", "PUMPDJINN", "ARKTIP", "ARKTILAS", "EF-EM", "UHAFNIR", "XERNEAS", "YVELTAL", "ZYGARDE", "DIANCIE", "HOOPA", "VOLCANION", "BAUZ", "ARBORETOSS", "SILVARRO", "FLAMIAU", "MIEZUNDER", "FUEGRO", "ROBBALL", "MARIKECK", "PRIMARENE", "PEPPECK", "TROMPECK", "TUKANON", "MANGUNIOR", "MANGUSPEKTOR", "MABULA", "AKKUP", "DONARION", "KRABBOX", "KRAWELL", "CHOREOGEL", "WOMMEL", "BANDELBY", "WUFFELS", "WOLWEROCK", "LUSARDIN", "GARSTELLA", "AGGROSTELLA", "PAMPULI", "PAMPROSS", "ARAQUA", "ARANESTRO", "IMANTIS", "MANTIDEA", "BUBUNGUS", "LAMELLUX", "MOLUNK", "AMFIRA", "VELURSI", "KOSTURSO", "FRUBBERL", "FRUBAILA", "FRUYAL", "CURELEI", "KOMMANDUTAN", "QUARTERMAK", "REISSLAUS", "TECTASS", "SANKABUH", "COLOSSAND", "GUFA", "TYP:NULL", "AMIGENTO", "METENO", "KOALELU", "TORTUNATOR", "TOGEDEMARU", "MIMIGMA", "KNIRFISH", "SEN-LONG", "MORUDA", "MINIRAS", "MEDIRAS", "GRANDIRAS", "KAPU-RIKI", "KAPU-FALA", "KAPU-TORO", "KAPU-KIME", "COSMOG", "COSMOVUM", "SOLGALEO", "LUNALA", "ANEGO", "MASSKITO", "SCHABELLE", "VOLTRIANT", "KAGURON", "KATAGAMI", "SCHLINGKING", "NECROZMA", "MAGEARNA", "MARSHADOW", "VENICRO", "AGOYON", "MURAMURA", "KOPPLOSIO", "ZERAORA", "MELTAN", "MELMETAL", "CHIMPEP", "CHIMSTIX", "GORTROM", "HOPPLO", "KICKERLO", "LIBERLO", "MEMMEON", "PHLEGLEON", "INTELLEON", "RAFFEL", "SCHLARAFFEL", "MEIKRO", "KRANOVIZ", "KRARMOR", "SENSECT", "KERADAR", "MARITELLIT", "KLEPTIFUX", "GAUNUX", "COTTINI", "COTTOMI", "WOLLY", "ZWOLLOCK", "KAMEHAPS", "KAMALM", "VOLDI", "BELLEKTRO", "KLONKETT", "WAGONG", "MONTECARBO", "KNAPFEL", "DRAPFEL", "SCHLAPFEL", "SALANGA", "SANACONDA", "URGL", "PIKUDA", "BARRAKIEFA", "TOXEL", "RIFFEX", "THERMOPOD", "INFERNOPOD", "KLOPPTOPUS", "KAOCTO", "FATALITEE", "MORTIPOT", "BRIMOVA", "BRIMANO", "SILEMBRIM", "BÄHMON", "PELZEBUB", "OLANGAAR", "BARRIKADAX", "MAUZINGER", "GORGASONN", "LAUCHZELOT", "PANTIFROST", "OGHNATOLL", "HOKUMIL", "POKUSAN", "LEGIOS", "BRITZIGEL", "SNOMNOM", "MOTTINEVA", "HUMANOLITH", "KUBUIN", "SERVOL", "MORPEKO", "KUPFANTI", "PATINARAJA", "LECTRAGON", "LECRYODON", "PESCRAGON", "PESCRYODON", "DURALUDON", "GROLLDRA", "PHANDRA", "KATAPULDRA", "ZACIAN", "ZAMAZENTA", "ENDYNALOS", "DAKUMA", "WULAOSU", "ZARUDE", "REGIELEKI", "REGIDRAGO", "POLAROSS", "PHANTOROSS", "CORONOSPA", "DAMYTHIR", "AXANTOR", "URSALUNA", "SALMAGNIS", "SNIEBOSS", "MYRIADOR", "CUPIDOS", "FELORI", "FELIOSPA", "MASKAGATO", "KROKEL", "LOKROKO", "SKELOKROK", "KWAKS", "FUENTENTE", "BAILONDA", "FERKULI", "FRAGRUNZ", "TARUNDEL", "SPINSIDIAS", "MICRICK", "LEXTREMO", "PAMO", "PAMAMO", "PAMOMAMO", "ZWIEPS", "FAMIEPS", "HEFEL", "BACKEL", "OLINI", "OLIVINIO", "OLITHENA", "KRAWALLORO", "GEOSALI", "SEDISAL", "SALTIGANT", "KNARBON", "CRIMANZO", "AZUGLADIS", "BLIPP", "WAMPITZ", "VOLTREL", "VOLTREAN", "MOBTIFF", "MASTIFIOSO", "SPROXI", "AFFITI", "WEHERBA", "HORRERBA", "TENTAGRA", "TENTERRA", "KLIBBE", "CHILINGEL", "HALUPENJO", "RELLUK", "SKARABAKS", "FLATTUTU", "PSIOPATRA", "FORGITA", "TAFFORGITA", "GRANFORGITA", "SCHLIGDA", "SCHLIGDRI", "ADEBOM", "NORMIFIN", "DELFINATOR", "KNATTOX", "KNATTATOX", "MOPEX", "SCHLURM", "LUMISPROSS", "LUMIFLORA", "GRUFF", "FRIEDWUFF", "FLAMINKNO", "FLANIWAL", "KOLOWAL", "AGILUZA", "HEERASHAI", "NIGIRAGI", "EPITAFF", "SUELORD", "FARIGIRAF", "DUMMIMISEL", "GLADIMPERIO", "RIESENZAHN", "BRÜLLSCHWEIF", "WUTPILZ", "FLATTERHAAR", "KRIECHFLÜGEL", "SANDFELL", "EISENRAD", "EISENBÜNDEL", "EISENHAND", "EISENHALS", "EISENFALTER", "EISENDORN", "FROSPINO", "CRYOSPINO", "ESPINODON", "GIERSPENST", "MONETIGO", "CHONGJIAN", "BAOJIAN", "DINGLU", "YUYU", "DONNERSICHEL", "EISENKRIEGER", "KORAIDON", "MIRAIDON", "WINDEWOGE", "EISENBLATT", "SIRAPFEL", "MORTCHA", "FATALITCHA", "BONINU", "BENESARU", "BEATORI", "OGERPON", "BRIDURADON", "HYDRAPFEL", "KEILFLAMME", "FURIENBLITZ", "EISENFELS", "EISENHAUPT", "TERAPAGOS", "INFAMOMO" },
  // IT
  { "?", "BULBASAUR", "IVYSAUR", "VENUSAUR", "CHARMANDER", "CHARMELEON", "CHARIZARD", "SQUIRTLE", "WARTORTLE", "BLASTOISE", "CATERPIE", "METAPOD", "BUTTERFREE", "WEEDLE", "KAKUNA", "BEEDRILL", "PIDGEY", "PIDGEOTTO", "PIDGEOT", "RATTATA", "RATICATE", "SPEAROW", "FEAROW", "EKANS", "ARBOK", "PIKACHU", "RAICHU", "SANDSHREW", "SANDSLASH", "NIDORAN F", "NIDORINA", "NIDOQUEEN", "NIDORAN M", "NIDORINO", "NIDOKING", "CLEFAIRY", "CLEFABLE", "VULPIX", "NINETALES", "JIGGLYPUFF", "WIGGLYTUFF", "ZUBAT", "GOLBAT", "ODDISH", "GLOOM", "VILEPLUME", "PARAS", "PARASECT", "VENONAT", "VENOMOTH", "DIGLETT", "DUGTRIO", "MEOWTH", "PERSIAN", "PSYDUCK", "GOLDUCK", "MANKEY", "PRIMEAPE", "GROWLITHE", "ARCANINE", "POLIWAG", "POLIWHIRL", "POLIWRATH", "ABRA", "KADABRA", "ALAKAZAM", "MACHOP", "MACHOKE", "MACHAMP", "BELLSPROUT", "WEEPINBELL", "VICTREEBEL", "TENTACOOL", "TENTACRUEL", "GEODUDE", "GRAVELER", "GOLEM", "PONYTA", "RAPIDASH", "SLOWPOKE", "SLOWBRO", "MAGNEMITE", "MAGNETON", "FARFETCHD", "DODUO", "DODRIO", "SEEL", "DEWGONG", "GRIMER", "MUK", "SHELLDER", "CLOYSTER", "GASTLY", "HAUNTER", "GENGAR", "ONIX", "DROWZEE", "HYPNO", "KRABBY", "KINGLER", "VOLTORB", "ELECTRODE", "EXEGGCUTE", "EXEGGUTOR", "CUBONE", "MAROWAK", "HITMONLEE", "HITMONCHAN", "LICKITUNG", "KOFFING", "WEEZING", "RHYHORN", "RHYDON", "CHANSEY", "TANGELA", "KANGASKHAN", "HORSEA", "SEADRA", "GOLDEEN", "SEAKING", "STARYU", "STARMIE", "MR. MIME", "SCYTHER", "JYNX", "ELECTABUZZ", "MAGMAR", "PINSIR", "TAUROS", "MAGIKARP", "GYARADOS", "LAPRAS", "DITTO", "EEVEE", "VAPOREON", "JOLTEON", "FLAREON", "PORYGON", "OMANYTE", "OMASTAR", "KABUTO", "KABUTOPS", "AERODACTYL", "SNORLAX", "ARTICUNO", "ZAPDOS", "MOLTRES", "DRATINI", "DRAGONAIR", "DRAGONITE", "MEWTWO", "MEW", "CHIKORITA", "BAYLEEF", "MEGANIUM", "CYNDAQUIL", "QUILAVA", "TYPHLOSION", "TOTODILE", "CROCONAW", "FERALIGATR", "SENTRET", "FURRET", "HOOTHOOT", "NOCTOWL", "LEDYBA", "LEDIAN", "SPINARAK", "ARIADOS", "CROBAT", "CHINCHOU", "LANTURN", "PICHU", "CLEFFA", "IGGLYBUFF", "TOGEPI", "TOGETIC", "NATU", "XATU", "MAREEP", "FLAAFFY", "AMPHAROS", "BELLOSSOM", "MARILL", "AZUMARILL", "SUDOWOODO", "POLITOED", "HOPPIP", "SKIPLOOM", "JUMPLUFF", "AIPOM", "SUNKERN", "SUNFLORA", "YANMA", "WOOPER", "QUAGSIRE", "ESPEON", "UMBREON", "MURKROW", "SLOWKING", "MISDREAVUS", "UNOWN", "WOBBUFFET", "GIRAFARIG", "PINECO", "FORRETRESS", "DUNSPARCE", "GLIGAR", "STEELIX", "SNUBBULL", "GRANBULL", "QWILFISH", "SCIZOR", "SHUCKLE", "HERACROSS", "SNEASEL", "TEDDIURSA", "URSARING", "SLUGMA", "MAGCARGO", "SWINUB", "PILOSWINE", "CORSOLA", "REMORAID", "OCTILLERY", "DELIBIRD", "MANTINE", "SKARMORY", "HOUNDOUR", "HOUNDOOM", "KINGDRA", "PHANPY", "DONPHAN", "PORYGON2", "STANTLER", "SMEARGLE", "TYROGUE", "HITMONTOP", "SMOOCHUM", "ELEKID", "MAGBY", "MILTANK", "BLISSEY", "RAIKOU", "ENTEI", "SUICUNE", "LARVITAR", "PUPITAR", "TYRANITAR", "LUGIA", "HO-OH", "CELEBI", "TREECKO", "GROVYLE", "SCEPTILE", "TORCHIC", "COMBUSKEN", "BLAZIKEN", "MUDKIP", "MARSHTOMP", "SWAMPERT", "POOCHYENA", "MIGHTYENA", "ZIGZAGOON", "LINOONE", "WURMPLE", "SILCOON", "BEAUTIFLY", "CASCOON", "DUSTOX", "LOTAD", "LOMBRE", "LUDICOLO", "SEEDOT", "NUZLEAF", "SHIFTRY", "TAILLOW", "SWELLOW", "WINGULL", "PELIPPER", "RALTS", "KIRLIA", "GARDEVOIR", "SURSKIT", "MASQUERAIN", "SHROOMISH", "BRELOOM", "SLAKOTH", "VIGOROTH", "SLAKING", "NINCADA", "NINJASK", "SHEDINJA", "WHISMUR", "LOUDRED", "EXPLOUD", "MAKUHITA", "HARIYAMA", "AZURILL", "NOSEPASS", "SKITTY", "DELCATTY", "SABLEYE", "MAWILE", "ARON", "LAIRON", "AGGRON", "MEDITITE", "MEDICHAM", "ELECTRIKE", "MANECTRIC", "PLUSLE", "MINUN", "VOLBEAT", "ILLUMISE", "ROSELIA", "GULPIN", "SWALOT", "CARVANHA", "SHARPEDO", "WAILMER", "WAILORD", "NUMEL", "CAMERUPT", "TORKOAL", "SPOINK", "GRUMPIG", "SPINDA", "TRAPINCH", "VIBRAVA", "FLYGON", "CACNEA", "CACTURNE", "SWABLU", "ALTARIA", "ZANGOOSE", "SEVIPER", "LUNATONE", "SOLROCK", "BARBOACH", "WHISCASH", "CORPHISH", "CRAWDAUNT", "BALTOY", "CLAYDOL", "LILEEP", "CRADILY", "ANORITH", "ARMALDO", "FEEBAS", "MILOTIC", "CASTFORM", "KECLEON", "SHUPPET", "BANETTE", "DUSKULL", "DUSCLOPS", "TROPIUS", "CHIMECHO", "ABSOL", "WYNAUT", "SNORUNT", "GLALIE", "SPHEAL", "SEALEO", "WALREIN", "CLAMPERL", "HUNTAIL", "GOREBYSS", "RELICANTH", "LUVDISC", "BAGON", "SHELGON", "SALAMENCE", "BELDUM", "METANG", "METAGROSS", "REGIROCK", "REGICE", "REGISTEEL", "LATIAS", "LATIOS", "KYOGRE", "GROUDON", "RAYQUAZA", "JIRACHI", "DEOXYS", "TURTWIG", "GROTLE", "TORTERRA", "CHIMCHAR", "MONFERNO", "INFERNAPE", "PIPLUP", "PRINPLUP", "EMPOLEON", "STARLY", "STARAVIA", "STARAPTOR", "BIDOOF", "BIBAREL", "KRICKETOT", "KRICKETUNE", "SHINX", "LUXIO", "LUXRAY", "BUDEW", "ROSERADE", "CRANIDOS", "RAMPARDOS", "SHIELDON", "BASTIODON", "BURMY", "WORMADAM", "MOTHIM", "COMBEE", "VESPIQUEN", "PACHIRISU", "BUIZEL", "FLOATZEL", "CHERUBI", "CHERRIM", "SHELLOS", "GASTRODON", "AMBIPOM", "DRIFLOON", "DRIFBLIM", "BUNEARY", "LOPUNNY", "MISMAGIUS", "HONCHKROW", "GLAMEOW", "PURUGLY", "CHINGLING", "STUNKY", "SKUNTANK", "BRONZOR", "BRONZONG", "BONSLY", "MIME JR.", "HAPPINY", "CHATOT", "SPIRITOMB", "GIBLE", "GABITE", "GARCHOMP", "MUNCHLAX", "RIOLU", "LUCARIO", "HIPPOPOTAS", "HIPPOWDON", "SKORUPI", "DRAPION", "CROAGUNK", "TOXICROAK", "CARNIVINE", "FINNEON", "LUMINEON", "MANTYKE", "SNOVER", "ABOMASNOW", "WEAVILE", "MAGNEZONE", "LICKILICKY", "RHYPERIOR", "TANGROWTH", "ELECTIVIRE", "MAGMORTAR", "TOGEKISS", "YANMEGA", "LEAFEON", "GLACEON", "GLISCOR", "MAMOSWINE", "PORYGON-Z", "GALLADE", "PROBOPASS", "DUSKNOIR", "FROSLASS", "ROTOM", "UXIE", "MESPRIT", "AZELF", "DIALGA", "PALKIA", "HEATRAN", "REGIGIGAS", "GIRATINA", "CRESSELIA", "PHIONE", "MANAPHY", "DARKRAI", "SHAYMIN", "ARCEUS", "VICTINI", "SNIVY", "SERVINE", "SERPERIOR", "TEPIG", "PIGNITE", "EMBOAR", "OSHAWOTT", "DEWOTT", "SAMUROTT", "PATRAT", "WATCHOG", "LILLIPUP", "HERDIER", "STOUTLAND", "PURRLOIN", "LIEPARD", "PANSAGE", "SIMISAGE", "PANSEAR", "SIMISEAR", "PANPOUR", "SIMIPOUR", "MUNNA", "MUSHARNA", "PIDOVE", "TRANQUILL", "UNFEZANT", "BLITZLE", "ZEBSTRIKA", "ROGGENROLA", "BOLDORE", "GIGALITH", "WOOBAT", "SWOOBAT", "DRILBUR", "EXCADRILL", "AUDINO", "TIMBURR", "GURDURR", "CONKELDURR", "TYMPOLE", "PALPITOAD", "SEISMITOAD", "THROH", "SAWK", "SEWADDLE", "SWADLOON", "LEAVANNY", "VENIPEDE", "WHIRLIPEDE", "SCOLIPEDE", "COTTONEE", "WHIMSICOTT", "PETILIL", "LILLIGANT", "BASCULIN", "SANDILE", "KROKOROK", "KROOKODILE", "DARUMAKA", "DARMANITAN", "MARACTUS", "DWEBBLE", "CRUSTLE", "SCRAGGY", "SCRAFTY", "SIGILYPH", "YAMASK", "COFAGRIGUS", "TIRTOUGA", "CARRACOSTA", "ARCHEN", "ARCHEOPS", "TRUBBISH", "GARBODOR", "ZORUA", "ZOROARK", "MINCCINO", "CINCCINO", "GOTHITA", "GOTHORITA", "GOTHITELLE", "SOLOSIS", "DUOSION", "REUNICLUS", "DUCKLETT", "SWANNA", "VANILLITE", "VANILLISH", "VANILLUXE", "DEERLING", "SAWSBUCK", "EMOLGA", "KARRABLAST", "ESCAVALIER", "FOONGUS", "AMOONGUSS", "FRILLISH", "JELLICENT", "ALOMOMOLA", "JOLTIK", "GALVANTULA", "FERROSEED", "FERROTHORN", "KLINK", "KLANG", "KLINKLANG", "TYNAMO", "EELEKTRIK", "EELEKTROSS", "ELGYEM", "BEHEEYEM", "LITWICK", "LAMPENT", "CHANDELURE", "AXEW", "FRAXURE", "HAXORUS", "CUBCHOO", "BEARTIC", "CRYOGONAL", "SHELMET", "ACCELGOR", "STUNFISK", "MIENFOO", "MIENSHAO", "DRUDDIGON", "GOLETT", "GOLURK", "PAWNIARD", "BISHARP", "BOUFFALANT", "RUFFLET", "BRAVIARY", "VULLABY", "MANDIBUZZ", "HEATMOR", "DURANT", "DEINO", "ZWEILOUS", "HYDREIGON", "LARVESTA", "VOLCARONA", "COBALION", "TERRAKION", "VIRIZION", "TORNADUS", "THUNDURUS", "RESHIRAM", "ZEKROM", "LANDORUS", "KYUREM", "KELDEO", "MELOETTA", "GENESECT", "CHESPIN", "QUILLADIN", "CHESNAUGHT", "FENNEKIN", "BRAIXEN", "DELPHOX", "FROAKIE", "FROGADIER", "GRENINJA", "BUNNELBY", "DIGGERSBY", "FLETCHLING", "FLETCHINDER", "TALONFLAME", "SCATTERBUG", "SPEWPA", "VIVILLON", "LITLEO", "PYROAR", "FLABÉBÉ", "FLOETTE", "FLORGES", "SKIDDO", "GOGOAT", "PANCHAM", "PANGORO", "FURFROU", "ESPURR", "MEOWSTIC", "HONEDGE", "DOUBLADE", "AEGISLASH", "SPRITZEE", "AROMATISSE", "SWIRLIX", "SLURPUFF", "INKAY", "MALAMAR", "BINACLE", "BARBARACLE", "SKRELP", "DRAGALGE", "CLAUNCHER", "CLAWITZER", "HELIOPTILE", "HELIOLISK", "TYRUNT", "TYRANTRUM", "AMAURA", "AURORUS", "SYLVEON", "HAWLUCHA", "DEDENNE", "CARBINK", "GOOMY", "SLIGGOO", "GOODRA", "KLEFKI", "PHANTUMP", "TREVENANT", "PUMPKABOO", "GOURGEIST", "BERGMITE", "AVALUGG", "NOIBAT", "NOIVERN", "XERNEAS", "YVELTAL", "ZYGARDE", "DIANCIE", "HOOPA", "VOLCANION", "ROWLET", "DARTRIX", "DECIDUEYE", "LITTEN", "TORRACAT", "INCINEROAR", "POPPLIO", "BRIONNE", "PRIMARINA", "PIKIPEK", "TRUMBEAK", "TOUCANNON", "YUNGOOS", "GUMSHOOS", "GRUBBIN", "CHARJABUG", "VIKAVOLT", "CRABRAWLER", "CRABOMINABLE", "ORICORIO", "CUTIEFLY", "RIBOMBEE", "ROCKRUFF", "LYCANROC", "WISHIWASHI", "MAREANIE", "TOXAPEX", "MUDBRAY", "MUDSDALE", "DEWPIDER", "ARAQUANID", "FOMANTIS", "LURANTIS", "MORELULL", "SHIINOTIC", "SALANDIT", "SALAZZLE", "STUFFUL", "BEWEAR", "BOUNSWEET", "STEENEE", "TSAREENA", "COMFEY", "ORANGURU", "PASSIMIAN", "WIMPOD", "GOLISOPOD", "SANDYGAST", "PALOSSAND", "PYUKUMUKU", "TIPO ZERO", "SILVALLY", "MINIOR", "KOMALA", "TURTONATOR", "TOGEDEMARU", "MIMIKYU", "BRUXISH", "DRAMPA", "DHELMISE", "JANGMO-O", "HAKAMO-O", "KOMMO-O", "TAPU KOKO", "TAPU LELE", "TAPU BULU", "TAPU FINI", "COSMOG", "COSMOEM", "SOLGALEO", "LUNALA", "NIHILEGO", "BUZZWOLE", "PHEROMOSA", "XURKITREE", "CELESTEELA", "KARTANA", "GUZZLORD", "NECROZMA", "MAGEARNA", "MARSHADOW", "POIPOLE", "NAGANADEL", "STAKATAKA", "BLACEPHALON", "ZERAORA", "MELTAN", "MELMETAL", "GROOKEY", "THWACKEY", "RILLABOOM", "SCORBUNNY", "RABOOT", "CINDERACE", "SOBBLE", "DRIZZILE", "INTELEON", "SKWOVET", "GREEDENT", "ROOKIDEE", "CORVISQUIRE", "CORVIKNIGHT", "BLIPBUG", "DOTTLER", "ORBEETLE", "NICKIT", "THIEVUL", "GOSSIFLEUR", "ELDEGOSS", "WOOLOO", "DUBWOOL", "CHEWTLE", "DREDNAW", "YAMPER", "BOLTUND", "ROLYCOLY", "CARKOL", "COALOSSAL", "APPLIN", "FLAPPLE", "APPLETUN", "SILICOBRA", "SANDACONDA", "CRAMORANT", "ARROKUDA", "BARRASKEWDA", "TOXEL", "TOXTRICITY", "SIZZLIPEDE", "CENTISKORCH", "CLOBBOPUS", "GRAPPLOCT", "SINISTEA", "POLTEAGEIST", "HATENNA", "HATTREM", "HATTERENE", "IMPIDIMP", "MORGREM", "GRIMMSNARL", "OBSTAGOON", "PERRSERKER", "CURSOLA", "SIRFETCH’D", "MR. RIME", "RUNERIGUS", "MILCERY", "ALCREMIE", "FALINKS", "PINCURCHIN", "SNOM", "FROSMOTH", "STONJOURNER", "EISCUE", "INDEEDEE", "MORPEKO", "CUFANT", "COPPERAJAH", "DRACOZOLT", "ARCTOZOLT", "DRACOVISH", "ARCTOVISH", "DURALUDON", "DREEPY", "DRAKLOAK", "DRAGAPULT", "ZACIAN", "ZAMAZENTA", "ETERNATUS", "KUBFU", "URSHIFU", "ZARUDE", "REGIELEKI", "REGIDRAGO", "GLASTRIER", "SPECTRIER", "CALYREX", "WYRDEER", "KLEAVOR", "URSALUNA", "BASCULEGION", "SNEASLER", "OVERQWIL", "ENAMORUS", "SPRIGATITO", "FLORAGATO", "MEOWSCARADA", "FUECOCO", "CROCALOR", "SKELEDIRGE", "QUAXLY", "QUAXWELL", "QUAQUAVAL", "LECHONK", "OINKOLOGNE", "TAROUNTULA", "SPIDOPS", "NYMBLE", "LOKIX", "PAWMI", "PAWMO", "PAWMOT", "TANDEMAUS", "MAUSHOLD", "FIDOUGH", "DACHSBUN", "SMOLIV", "DOLLIV", "ARBOLIVA", "SQUAWKABILLY", "NACLI", "NACLSTACK", "GARGANACL", "CHARCADET", "ARMAROUGE", "CERULEDGE", "TADBULB", "BELLIBOLT", "WATTREL", "KILOWATTREL", "MASCHIFF", "MABOSSTIFF", "SHROODLE", "GRAFAIAI", "BRAMBLIN", "BRAMBLEGHAST", "TOEDSCOOL", "TOEDSCRUEL", "KLAWF", "CAPSAKID", "SCOVILLAIN", "RELLOR", "RABSCA", "FLITTLE", "ESPATHRA", "TINKATINK", "TINKATUFF", "TINKATON", "WIGLETT", "WUGTRIO", "BOMBIRDIER", "FINIZEN", "PALAFIN", "VAROOM", "REVAVROOM", "CYCLIZAR", "ORTHWORM", "GLIMMET", "GLIMMORA", "GREAVARD", "HOUNDSTONE", "FLAMIGO", "CETODDLE", "CETITAN", "VELUZA", "DONDOZO", "TATSUGIRI", "ANNIHILAPE", "CLODSIRE", "FARIGIRAF", "DUDUNSPARCE", "KINGAMBIT", "GRANDIZANNE", "CODAURLANTE", "FUNGOFURIOSO", "CRINEALATO", "ALIRASENTI", "PELDISABBIA", "SOLCOFERREO", "SACCOFERREO", "MANOFERREA", "COLLOFERREO", "FALENAFERREA", "SPINEFERREE", "FRIGIBAX", "ARCTIBAX", "BAXCALIBUR", "GIMMIGHOUL", "GHOLDENGO", "WO-CHIEN", "CHIEN-PAO", "TING-LU", "CHI-YU", "LUNARUGGENTE", "EROEFERREO", "KORAIDON", "MIRAIDON", "ACQUECRESPE", "FOGLIAFERREA", "DIPPLIN", "POLTCHAGEIST", "SINISTCHA", "OKIDOGI", "MUNKIDORI", "FEZANDIPITI", "OGERPON", "ARCHALUDON", "HYDRAPPLE", "VAMPEAGUZZE", "FURIATONANTE", "MASSOFERREO", "CAPOFERREO", "TERAPAGOS", "PECHARUNT" },
  // PT
  { "?", "BULBASAUR", "IVYSAUR", "VENUSAUR", "CHARMANDER", "CHARMELEON", "CHARIZARD", "SQUIRTLE", "WARTORTLE", "BLASTOISE", "CATERPIE", "METAPOD", "BUTTERFREE", "WEEDLE", "KAKUNA", "BEEDRILL", "PIDGEY", "PIDGEOTTO", "PIDGEOT", "RATTATA", "RATICATE", "SPEAROW", "FEAROW", "EKANS", "ARBOK", "PIKACHU", "RAICHU", "SANDSHREW", "SANDSLASH", "NIDORAN F", "NIDORINA", "NIDOQUEEN", "NIDORAN M", "NIDORINO", "NIDOKING", "CLEFAIRY", "CLEFABLE", "VULPIX", "NINETALES", "JIGGLYPUFF", "WIGGLYTUFF", "ZUBAT", "GOLBAT", "ODDISH", "GLOOM", "VILEPLUME", "PARAS", "PARASECT", "VENONAT", "VENOMOTH", "DIGLETT", "DUGTRIO", "MEOWTH", "PERSIAN", "PSYDUCK", "GOLDUCK", "MANKEY", "PRIMEAPE", "GROWLITHE", "ARCANINE", "POLIWAG", "POLIWHIRL", "POLIWRATH", "ABRA", "KADABRA", "ALAKAZAM", "MACHOP", "MACHOKE", "MACHAMP", "BELLSPROUT", "WEEPINBELL", "VICTREEBEL", "TENTACOOL", "TENTACRUEL", "GEODUDE", "GRAVELER", "GOLEM", "PONYTA", "RAPIDASH", "SLOWPOKE", "SLOWBRO", "MAGNEMITE", "MAGNETON", "FARFETCHD", "DODUO", "DODRIO", "SEEL", "DEWGONG", "GRIMER", "MUK", "SHELLDER", "CLOYSTER", "GASTLY", "HAUNTER", "GENGAR", "ONIX", "DROWZEE", "HYPNO", "KRABBY", "KINGLER", "VOLTORB", "ELECTRODE", "EXEGGCUTE", "EXEGGUTOR", "CUBONE", "MAROWAK", "HITMONLEE", "HITMONCHAN", "LICKITUNG", "KOFFING", "WEEZING", "RHYHORN", "RHYDON", "CHANSEY", "TANGELA", "KANGASKHAN", "HORSEA", "SEADRA", "GOLDEEN", "SEAKING", "STARYU", "STARMIE", "MR. MIME", "SCYTHER", "JYNX", "ELECTABUZZ", "MAGMAR", "PINSIR", "TAUROS", "MAGIKARP", "GYARADOS", "LAPRAS", "DITTO", "EEVEE", "VAPOREON", "JOLTEON", "FLAREON", "PORYGON", "OMANYTE", "OMASTAR", "KABUTO", "KABUTOPS", "AERODACTYL", "SNORLAX", "ARTICUNO", "ZAPDOS", "MOLTRES", "DRATINI", "DRAGONAIR", "DRAGONITE", "MEWTWO", "MEW", "CHIKORITA", "BAYLEEF", "MEGANIUM", "CYNDAQUIL", "QUILAVA", "TYPHLOSION", "TOTODILE", "CROCONAW", "FERALIGATR", "SENTRET", "FURRET", "HOOTHOOT", "NOCTOWL", "LEDYBA", "LEDIAN", "SPINARAK", "ARIADOS", "CROBAT", "CHINCHOU", "LANTURN", "PICHU", "CLEFFA", "IGGLYBUFF", "TOGEPI", "TOGETIC", "NATU", "XATU", "MAREEP", "FLAAFFY", "AMPHAROS", "BELLOSSOM", "MARILL", "AZUMARILL", "SUDOWOODO", "POLITOED", "HOPPIP", "SKIPLOOM", "JUMPLUFF", "AIPOM", "SUNKERN", "SUNFLORA", "YANMA", "WOOPER", "QUAGSIRE", "ESPEON", "UMBREON", "MURKROW", "SLOWKING", "MISDREAVUS", "UNOWN", "WOBBUFFET", "GIRAFARIG", "PINECO", "FORRETRESS", "DUNSPARCE", "GLIGAR", "STEELIX", "SNUBBULL", "GRANBULL", "QWILFISH", "SCIZOR", "SHUCKLE", "HERACROSS", "SNEASEL", "TEDDIURSA", "URSARING", "SLUGMA", "MAGCARGO", "SWINUB", "PILOSWINE", "CORSOLA", "REMORAID", "OCTILLERY", "DELIBIRD", "MANTINE", "SKARMORY", "HOUNDOUR", "HOUNDOOM", "KINGDRA", "PHANPY", "DONPHAN", "PORYGON2", "STANTLER", "SMEARGLE", "TYROGUE", "HITMONTOP", "SMOOCHUM", "ELEKID", "MAGBY", "MILTANK", "BLISSEY", "RAIKOU", "ENTEI", "SUICUNE", "LARVITAR", "PUPITAR", "TYRANITAR", "LUGIA", "HO-OH", "CELEBI", "TREECKO", "GROVYLE", "SCEPTILE", "TORCHIC", "COMBUSKEN", "BLAZIKEN", "MUDKIP", "MARSHTOMP", "SWAMPERT", "POOCHYENA", "MIGHTYENA", "ZIGZAGOON", "LINOONE", "WURMPLE", "SILCOON", "BEAUTIFLY", "CASCOON", "DUSTOX", "LOTAD", "LOMBRE", "LUDICOLO", "SEEDOT", "NUZLEAF", "SHIFTRY", "TAILLOW", "SWELLOW", "WINGULL", "PELIPPER", "RALTS", "KIRLIA", "GARDEVOIR", "SURSKIT", "MASQUERAIN", "SHROOMISH", "BRELOOM", "SLAKOTH", "VIGOROTH", "SLAKING", "NINCADA", "NINJASK", "SHEDINJA", "WHISMUR", "LOUDRED", "EXPLOUD", "MAKUHITA", "HARIYAMA", "AZURILL", "NOSEPASS", "SKITTY", "DELCATTY", "SABLEYE", "MAWILE", "ARON", "LAIRON", "AGGRON", "MEDITITE", "MEDICHAM", "ELECTRIKE", "MANECTRIC", "PLUSLE", "MINUN", "VOLBEAT", "ILLUMISE", "ROSELIA", "GULPIN", "SWALOT", "CARVANHA", "SHARPEDO", "WAILMER", "WAILORD", "NUMEL", "CAMERUPT", "TORKOAL", "SPOINK", "GRUMPIG", "SPINDA", "TRAPINCH", "VIBRAVA", "FLYGON", "CACNEA", "CACTURNE", "SWABLU", "ALTARIA", "ZANGOOSE", "SEVIPER", "LUNATONE", "SOLROCK", "BARBOACH", "WHISCASH", "CORPHISH", "CRAWDAUNT", "BALTOY", "CLAYDOL", "LILEEP", "CRADILY", "ANORITH", "ARMALDO", "FEEBAS", "MILOTIC", "CASTFORM", "KECLEON", "SHUPPET", "BANETTE", "DUSKULL", "DUSCLOPS", "TROPIUS", "CHIMECHO", "ABSOL", "WYNAUT", "SNORUNT", "GLALIE", "SPHEAL", "SEALEO", "WALREIN", "CLAMPERL", "HUNTAIL", "GOREBYSS", "RELICANTH", "LUVDISC", "BAGON", "SHELGON", "SALAMENCE", "BELDUM", "METANG", "METAGROSS", "REGIROCK", "REGICE", "REGISTEEL", "LATIAS", "LATIOS", "KYOGRE", "GROUDON", "RAYQUAZA", "JIRACHI", "DEOXYS", "TURTWIG", "GROTLE", "TORTERRA", "CHIMCHAR", "MONFERNO", "INFERNAPE", "PIPLUP", "PRINPLUP", "EMPOLEON", "STARLY", "STARAVIA", "STARAPTOR", "BIDOOF", "BIBAREL", "KRICKETOT", "KRICKETUNE", "SHINX", "LUXIO", "LUXRAY", "BUDEW", "ROSERADE", "CRANIDOS", "RAMPARDOS", "SHIELDON", "BASTIODON", "BURMY", "WORMADAM", "MOTHIM", "COMBEE", "VESPIQUEN", "PACHIRISU", "BUIZEL", "FLOATZEL", "CHERUBI", "CHERRIM", "SHELLOS", "GASTRODON", "AMBIPOM", "DRIFLOON", "DRIFBLIM", "BUNEARY", "LOPUNNY", "MISMAGIUS", "HONCHKROW", "GLAMEOW", "PURUGLY", "CHINGLING", "STUNKY", "SKUNTANK", "BRONZOR", "BRONZONG", "BONSLY", "MIME JR.", "HAPPINY", "CHATOT", "SPIRITOMB", "GIBLE", "GABITE", "GARCHOMP", "MUNCHLAX", "RIOLU", "LUCARIO", "HIPPOPOTAS", "HIPPOWDON", "SKORUPI", "DRAPION", "CROAGUNK", "TOXICROAK", "CARNIVINE", "FINNEON", "LUMINEON", "MANTYKE", "SNOVER", "ABOMASNOW", "WEAVILE", "MAGNEZONE", "LICKILICKY", "RHYPERIOR", "TANGROWTH", "ELECTIVIRE", "MAGMORTAR", "TOGEKISS", "YANMEGA", "LEAFEON", "GLACEON", "GLISCOR", "MAMOSWINE", "PORYGON-Z", "GALLADE", "PROBOPASS", "DUSKNOIR", "FROSLASS", "ROTOM", "UXIE", "MESPRIT", "AZELF", "DIALGA", "PALKIA", "HEATRAN", "REGIGIGAS", "GIRATINA", "CRESSELIA", "PHIONE", "MANAPHY", "DARKRAI", "SHAYMIN", "ARCEUS", "VICTINI", "SNIVY", "SERVINE", "SERPERIOR", "TEPIG", "PIGNITE", "EMBOAR", "OSHAWOTT", "DEWOTT", "SAMUROTT", "PATRAT", "WATCHOG", "LILLIPUP", "HERDIER", "STOUTLAND", "PURRLOIN", "LIEPARD", "PANSAGE", "SIMISAGE", "PANSEAR", "SIMISEAR", "PANPOUR", "SIMIPOUR", "MUNNA", "MUSHARNA", "PIDOVE", "TRANQUILL", "UNFEZANT", "BLITZLE", "ZEBSTRIKA", "ROGGENROLA", "BOLDORE", "GIGALITH", "WOOBAT", "SWOOBAT", "DRILBUR", "EXCADRILL", "AUDINO", "TIMBURR", "GURDURR", "CONKELDURR", "TYMPOLE", "PALPITOAD", "SEISMITOAD", "THROH", "SAWK", "SEWADDLE", "SWADLOON", "LEAVANNY", "VENIPEDE", "WHIRLIPEDE", "SCOLIPEDE", "COTTONEE", "WHIMSICOTT", "PETILIL", "LILLIGANT", "BASCULIN", "SANDILE", "KROKOROK", "KROOKODILE", "DARUMAKA", "DARMANITAN", "MARACTUS", "DWEBBLE", "CRUSTLE", "SCRAGGY", "SCRAFTY", "SIGILYPH", "YAMASK", "COFAGRIGUS", "TIRTOUGA", "CARRACOSTA", "ARCHEN", "ARCHEOPS", "TRUBBISH", "GARBODOR", "ZORUA", "ZOROARK", "MINCCINO", "CINCCINO", "GOTHITA", "GOTHORITA", "GOTHITELLE", "SOLOSIS", "DUOSION", "REUNICLUS", "DUCKLETT", "SWANNA", "VANILLITE", "VANILLISH", "VANILLUXE", "DEERLING", "SAWSBUCK", "EMOLGA", "KARRABLAST", "ESCAVALIER", "FOONGUS", "AMOONGUSS", "FRILLISH", "JELLICENT", "ALOMOMOLA", "JOLTIK", "GALVANTULA", "FERROSEED", "FERROTHORN", "KLINK", "KLANG", "KLINKLANG", "TYNAMO", "EELEKTRIK", "EELEKTROSS", "ELGYEM", "BEHEEYEM", "LITWICK", "LAMPENT", "CHANDELURE", "AXEW", "FRAXURE", "HAXORUS", "CUBCHOO", "BEARTIC", "CRYOGONAL", "SHELMET", "ACCELGOR", "STUNFISK", "MIENFOO", "MIENSHAO", "DRUDDIGON", "GOLETT", "GOLURK", "PAWNIARD", "BISHARP", "BOUFFALANT", "RUFFLET", "BRAVIARY", "VULLABY", "MANDIBUZZ", "HEATMOR", "DURANT", "DEINO", "ZWEILOUS", "HYDREIGON", "LARVESTA", "VOLCARONA", "COBALION", "TERRAKION", "VIRIZION", "TORNADUS", "THUNDURUS", "RESHIRAM", "ZEKROM", "LANDORUS", "KYUREM", "KELDEO", "MELOETTA", "GENESECT", "CHESPIN", "QUILLADIN", "CHESNAUGHT", "FENNEKIN", "BRAIXEN", "DELPHOX", "FROAKIE", "FROGADIER", "GRENINJA", "BUNNELBY", "DIGGERSBY", "FLETCHLING", "FLETCHINDER", "TALONFLAME", "SCATTERBUG", "SPEWPA", "VIVILLON", "LITLEO", "PYROAR", "FLABÉBÉ", "FLOETTE", "FLORGES", "SKIDDO", "GOGOAT", "PANCHAM", "PANGORO", "FURFROU", "ESPURR", "MEOWSTIC", "HONEDGE", "DOUBLADE", "AEGISLASH", "SPRITZEE", "AROMATISSE", "SWIRLIX", "SLURPUFF", "INKAY", "MALAMAR", "BINACLE", "BARBARACLE", "SKRELP", "DRAGALGE", "CLAUNCHER", "CLAWITZER", "HELIOPTILE", "HELIOLISK", "TYRUNT", "TYRANTRUM", "AMAURA", "AURORUS", "SYLVEON", "HAWLUCHA", "DEDENNE", "CARBINK", "GOOMY", "SLIGGOO", "GOODRA", "KLEFKI", "PHANTUMP", "TREVENANT", "PUMPKABOO", "GOURGEIST", "BERGMITE", "AVALUGG", "NOIBAT", "NOIVERN", "XERNEAS", "YVELTAL", "ZYGARDE", "DIANCIE", "HOOPA", "VOLCANION", "ROWLET", "DARTRIX", "DECIDUEYE", "LITTEN", "TORRACAT", "INCINEROAR", "POPPLIO", "BRIONNE", "PRIMARINA", "PIKIPEK", "TRUMBEAK", "TOUCANNON", "YUNGOOS", "GUMSHOOS", "GRUBBIN", "CHARJABUG", "VIKAVOLT", "CRABRAWLER", "CRABOMINABLE", "ORICORIO", "CUTIEFLY", "RIBOMBEE", "ROCKRUFF", "LYCANROC", "WISHIWASHI", "MAREANIE", "TOXAPEX", "MUDBRAY", "MUDSDALE", "DEWPIDER", "ARAQUANID", "FOMANTIS", "LURANTIS", "MORELULL", "SHIINOTIC", "SALANDIT", "SALAZZLE", "STUFFUL", "BEWEAR", "BOUNSWEET", "STEENEE", "TSAREENA", "COMFEY", "ORANGURU", "PASSIMIAN", "WIMPOD", "GOLISOPOD", "SANDYGAST", "PALOSSAND", "PYUKUMUKU", "TYPE: NULL", "SILVALLY", "MINIOR", "KOMALA", "TURTONATOR", "TOGEDEMARU", "MIMIKYU", "BRUXISH", "DRAMPA", "DHELMISE", "JANGMO-O", "HAKAMO-O", "KOMMO-O", "TAPU KOKO", "TAPU LELE", "TAPU BULU", "TAPU FINI", "COSMOG", "COSMOEM", "SOLGALEO", "LUNALA", "NIHILEGO", "BUZZWOLE", "PHEROMOSA", "XURKITREE", "CELESTEELA", "KARTANA", "GUZZLORD", "NECROZMA", "MAGEARNA", "MARSHADOW", "POIPOLE", "NAGANADEL", "STAKATAKA", "BLACEPHALON", "ZERAORA", "MELTAN", "MELMETAL", "GROOKEY", "THWACKEY", "RILLABOOM", "SCORBUNNY", "RABOOT", "CINDERACE", "SOBBLE", "DRIZZILE", "INTELEON", "SKWOVET", "GREEDENT", "ROOKIDEE", "CORVISQUIRE", "CORVIKNIGHT", "BLIPBUG", "DOTTLER", "ORBEETLE", "NICKIT", "THIEVUL", "GOSSIFLEUR", "ELDEGOSS", "WOOLOO", "DUBWOOL", "CHEWTLE", "DREDNAW", "YAMPER", "BOLTUND", "ROLYCOLY", "CARKOL", "COALOSSAL", "APPLIN", "FLAPPLE", "APPLETUN", "SILICOBRA", "SANDACONDA", "CRAMORANT", "ARROKUDA", "BARRASKEWDA", "TOXEL", "TOXTRICITY", "SIZZLIPEDE", "CENTISKORCH", "CLOBBOPUS", "GRAPPLOCT", "SINISTEA", "POLTEAGEIST", "HATENNA", "HATTREM", "HATTERENE", "IMPIDIMP", "MORGREM", "GRIMMSNARL", "OBSTAGOON", "PERRSERKER", "CURSOLA", "SIRFETCH’D", "MR. RIME", "RUNERIGUS", "MILCERY", "ALCREMIE", "FALINKS", "PINCURCHIN", "SNOM", "FROSMOTH", "STONJOURNER", "EISCUE", "INDEEDEE", "MORPEKO", "CUFANT", "COPPERAJAH", "DRACOZOLT", "ARCTOZOLT", "DRACOVISH", "ARCTOVISH", "DURALUDON", "DREEPY", "DRAKLOAK", "DRAGAPULT", "ZACIAN", "ZAMAZENTA", "ETERNATUS", "KUBFU", "URSHIFU", "ZARUDE", "REGIELEKI", "REGIDRAGO", "GLASTRIER", "SPECTRIER", "CALYREX", "WYRDEER", "KLEAVOR", "URSALUNA", "BASCULEGION", "SNEASLER", "OVERQWIL", "ENAMORUS", "SPRIGATITO", "FLORAGATO", "MEOWSCARADA", "FUECOCO", "CROCALOR", "SKELEDIRGE", "QUAXLY", "QUAXWELL", "QUAQUAVAL", "LECHONK", "OINKOLOGNE", "TAROUNTULA", "SPIDOPS", "NYMBLE", "LOKIX", "PAWMI", "PAWMO", "PAWMOT", "TANDEMAUS", "MAUSHOLD", "FIDOUGH", "DACHSBUN", "SMOLIV", "DOLLIV", "ARBOLIVA", "SQUAWKABILLY", "NACLI", "NACLSTACK", "GARGANACL", "CHARCADET", "ARMAROUGE", "CERULEDGE", "TADBULB", "BELLIBOLT", "WATTREL", "KILOWATTREL", "MASCHIFF", "MABOSSTIFF", "SHROODLE", "GRAFAIAI", "BRAMBLIN", "BRAMBLEGHAST", "TOEDSCOOL", "TOEDSCRUEL", "KLAWF", "CAPSAKID", "SCOVILLAIN", "RELLOR", "RABSCA", "FLITTLE", "ESPATHRA", "TINKATINK", "TINKATUFF", "TINKATON", "WIGLETT", "WUGTRIO", "BOMBIRDIER", "FINIZEN", "PALAFIN", "VAROOM", "REVAVROOM", "CYCLIZAR", "ORTHWORM", "GLIMMET", "GLIMMORA", "GREAVARD", "HOUNDSTONE", "FLAMIGO", "CETODDLE", "CETITAN", "VELUZA", "DONDOZO", "TATSUGIRI", "ANNIHILAPE", "CLODSIRE", "FARIGIRAF", "DUDUNSPARCE", "KINGAMBIT", "GREAT TUSK", "SCREAM TAIL", "BRUTE BONNET", "FLUTTER MANE", "SLITHER WING", "SANDY SHOCKS", "IRON TREADS", "IRON BUNDLE", "IRON HANDS", "IRON JUGULIS", "IRON MOTH", "IRON THORNS", "FRIGIBAX", "ARCTIBAX", "BAXCALIBUR", "GIMMIGHOUL", "GHOLDENGO", "WO-CHIEN", "CHIEN-PAO", "TING-LU", "CHI-YU", "ROARING MOON", "IRON VALIANT", "KORAIDON", "MIRAIDON", "WALKING WAKE", "IRON LEAVES", "DIPPLIN", "POLTCHAGEIST", "SINISTCHA", "OKIDOGI", "MUNKIDORI", "FEZANDIPITI", "OGERPON", "ARCHALUDON", "HYDRAPPLE", "GOUGING FIRE", "RAGING BOLT", "IRON BOULDER", "IRON CROWN", "TERAPAGOS", "PECHARUNT" },
  // KO
  { "?", "이상해씨", "이상해풀", "이상해꽃", "파이리", "리자드", "리자몽", "꼬부기", "어니부기", "거북왕", "캐터피", "단데기", "버터플", "뿔충이", "딱충이", "독침붕", "구구", "피죤", "피죤투", "꼬렛", "레트라", "깨비참", "깨비드릴조", "아보", "아보크", "피카츄", "라이츄", "모래두지", "고지", "니드런♀", "니드리나", "니드퀸", "니드런♂", "니드리노", "니드킹", "삐삐", "픽시", "식스테일", "나인테일", "푸린", "푸크린", "주뱃", "골뱃", "뚜벅쵸", "냄새꼬", "라플레시아", "파라스", "파라섹트", "콘팡", "도나리", "디그다", "닥트리오", "나옹", "페르시온", "고라파덕", "골덕", "망키", "성원숭", "가디", "윈디", "발챙이", "슈륙챙이", "강챙이", "캐이시", "윤겔라", "후딘", "알통몬", "근육몬", "괴력몬", "모다피", "우츠동", "우츠보트", "왕눈해", "독파리", "꼬마돌", "데구리", "딱구리", "포니타", "날쌩마", "야돈", "야도란", "코일", "레어코일", "파오리", "두두", "두트리오", "쥬쥬", "쥬레곤", "질퍽이", "질뻐기", "셀러", "파르셀", "고오스", "고우스트", "팬텀", "롱스톤", "슬리프", "슬리퍼", "크랩", "킹크랩", "찌리리공", "붐볼", "아라리", "나시", "탕구리", "텅구리", "시라소몬", "홍수몬", "내루미", "또가스", "또도가스", "뿔카노", "코뿌리", "럭키", "덩쿠리", "캥카", "쏘드라", "시드라", "콘치", "왕콘치", "별가사리", "아쿠스타", "마임맨", "스라크", "루주라", "에레브", "마그마", "쁘사이저", "켄타로스", "잉어킹", "갸라도스", "라프라스", "메타몽", "이브이", "샤미드", "쥬피썬더", "부스터", "폴리곤", "암나이트", "암스타", "투구", "투구푸스", "프테라", "잠만보", "프리져", "썬더", "파이어", "미뇽", "신뇽", "망나뇽", "뮤츠", "뮤", "치코리타", "베이리프", "메가니움", "브케인", "마그케인", "블레이범", "리아코", "엘리게이", "장크로다일", "꼬리선", "다꼬리", "부우부", "야부엉", "레디바", "레디안", "페이검", "아리아도스", "크로뱃", "초라기", "랜턴", "피츄", "삐", "푸푸린", "토게피", "토게틱", "네이티", "네이티오", "메리프", "보송송", "전룡", "아르코", "마릴", "마릴리", "꼬지모", "왕구리", "통통코", "두코", "솜솜코", "에이팜", "해너츠", "해루미", "왕자리", "우파", "누오", "에브이", "블래키", "니로우", "야도킹", "무우마", "안농", "마자용", "키링키", "피콘", "쏘콘", "노고치", "글라이거", "강철톤", "블루", "그랑블루", "침바루", "핫삼", "단단지", "헤라크로스", "포푸니", "깜지곰", "링곰", "마그마그", "마그카르고", "꾸꾸리", "메꾸리", "코산호", "총어", "대포무노", "딜리버드", "만타인", "무장조", "델빌", "헬가", "킹드라", "코코리", "코리갑", "폴리곤2", "노라키", "루브도", "배루키", "카포에라", "뽀뽀라", "에레키드", "마그비", "밀탱크", "해피너스", "라이코", "앤테이", "스이쿤", "애버라스", "데기라스", "마기라스", "루기아", "칠색조", "세레비", "나무지기", "나무돌이", "나무킹", "아차모", "영치코", "번치코", "물짱이", "늪짱이", "대짱이", "포챠나", "그라에나", "지그제구리", "직구리", "개무소", "실쿤", "뷰티플라이", "카스쿤", "독케일", "연꽃몬", "로토스", "로파파", "도토링", "잎새코", "다탱구", "테일로", "스왈로", "갈모매", "패리퍼", "랄토스", "킬리아", "가디안", "비구술", "비나방", "버섯꼬", "버섯모", "게을로", "발바로", "게을킹", "토중몬", "아이스크", "껍질몬", "소곤룡", "노공룡", "폭음룡", "마크탕", "하리뭉", "루리리", "코코파스", "에나비", "델케티", "깜까미", "입치트", "가보리", "갱도라", "보스로라", "요가랑", "요가램", "썬더라이", "썬더볼트", "플러시", "마이농", "볼비트", "네오비트", "로젤리아", "꼴깍몬", "꿀꺽몬", "샤프니아", "샤크니아", "고래왕자", "고래왕", "둔타", "폭타", "코터스", "피그점프", "피그킹", "얼루기", "톱치", "비브라바", "플라이곤", "선인왕", "밤선인", "파비코", "파비코리", "쟝고", "세비퍼", "루나톤", "솔록", "미꾸리", "메깅", "가재군", "가재장군", "오뚝군", "점토도리", "릴링", "릴리요", "아노딥스", "아말도", "빈티나", "밀로틱", "캐스퐁", "켈리몬", "어둠대신", "다크펫", "해골몽", "미라몽", "트로피우스", "치렁", "앱솔", "마자", "눈꼬마", "얼음귀신", "대굴레오", "씨레오", "씨카이저", "진주몽", "헌테일", "분홍장이", "시라칸", "사랑동이", "아공이", "쉘곤", "보만다", "메탕", "메탕구", "메타그로스", "레지락", "레지아이스", "레지스틸", "라티아스", "라티오스", "가이오가", "그란돈", "레쿠쟈", "지라치", "테오키스", "모부기", "수풀부기", "토대부기", "불꽃숭이", "파이숭이", "초염몽", "팽도리", "팽태자", "엠페르트", "찌르꼬", "찌르버드", "찌르호크", "비버니", "비버통", "귀뚤뚜기", "귀뚤톡크", "꼬링크", "럭시오", "렌트라", "꼬몽울", "로즈레이드", "두개도스", "램펄드", "방패톱스", "바리톱스", "도롱충이", "도롱마담", "나메일", "세꿀버리", "비퀸", "파치리스", "브이젤", "플로젤", "체리버", "체리꼬", "깝질무", "트리토돈", "겟핸보숭", "흔들풍손", "둥실라이드", "이어롤", "이어롭", "무우마직", "돈크로우", "나옹마", "몬냥이", "랑딸랑", "스컹뿡", "스컹탱크", "동미러", "동탁군", "꼬지지", "흉내내", "핑복", "페라페", "화강돌", "딥상어동", "한바이트", "한카리아스", "먹고자", "리오르", "루카리오", "히포포타스", "하마돈", "스콜피", "드래피온", "삐딱구리", "독개굴", "무스틈니", "형광어", "네오라이트", "타만타", "눈쓰개", "눈설왕", "포푸니라", "자포코일", "내룸벨트", "거대코뿌리", "덩쿠림보", "에레키블", "마그마번", "토게키스", "메가자리", "리피아", "글레이시아", "글라이온", "맘모꾸리", "폴리곤Z", "엘레이드", "대코파스", "야느와르몽", "눈여아", "로토무", "유크시", "엠라이트", "아그놈", "디아루가", "펄기아", "히드런", "레지기가스", "기라티나", "크레세리아", "피오네", "마나피", "다크라이", "쉐이미", "아르세우스", "비크티니", "주리비얀", "샤비", "샤로다", "뚜꾸리", "차오꿀", "염무왕", "수댕이", "쌍검자비", "대검귀", "보르쥐", "보르그", "요테리", "하데리어", "바랜드", "쌔비냥", "레파르다스", "야나프", "야나키", "바오프", "바오키", "앗차프", "앗차키", "몽나", "몽얌나", "콩둘기", "유토브", "켄호로우", "줄뮤마", "제브라이카", "단굴", "암트르", "기가이어스", "또르박쥐", "맘박쥐", "두더류", "몰드류", "다부니", "으랏차", "토쇠골", "노보청", "동챙이", "두까비", "두빅굴", "던지미", "타격귀", "두르보", "두르쿤", "모아머", "마디네", "휠구", "펜드라", "소미안", "엘풍", "치릴리", "드레디어", "배쓰나이", "깜눈크", "악비르", "악비아르", "달막화", "불비달마", "마라카치", "돌살이", "암팰리스", "곤율랭", "곤율거니", "심보러", "데스마스", "데스니칸", "프로토가", "늑골라", "아켄", "아케오스", "깨봉이", "더스트나", "조로아", "조로아크", "치라미", "치라치노", "고디탱", "고디보미", "고디모아젤", "유니란", "듀란", "란쿨루스", "꼬지보리", "스완나", "바닐프티", "바닐리치", "배바닐라", "사철록", "바라철록", "에몽가", "딱정곤", "슈바르고", "깜놀버슬", "뽀록나", "탱그릴", "탱탱겔", "맘복치", "파쪼옥", "전툴라", "철시드", "너트령", "기어르", "기기어르", "기기기어르", "저리어", "저리릴", "저리더프", "리그레", "벰크", "불켜미", "램프라", "샹델라", "터검니", "액슨도", "액스라이즈", "코고미", "툰베어", "프리지오", "쪼마리", "어지리더", "메더", "비조푸", "비조도", "크리만", "골비람", "골루그", "자망칼", "절각참", "버프론", "수리둥보", "워글", "벌차이", "버랜지나", "앤티골", "아이앤트", "모노두", "디헤드", "삼삼드래", "활화르바", "불카모스", "코바르온", "테라키온", "비리디온", "토네로스", "볼트로스", "레시라무", "제크로무", "랜드로스", "큐레무", "케르디오", "메로엣타", "게노세크트", "도치마론", "도치보구", "브리가론", "푸호꼬", "테르나", "마폭시", "개구마르", "개굴반장", "개굴닌자", "파르빗", "파르토", "화살꼬빈", "불화살빈", "파이어로", "분이벌레", "분떠도리", "비비용", "레오꼬", "화염레오", "플라베베", "플라엣테", "플라제스", "메이클", "고고트", "판짱", "부란다", "트리미앙", "냐스퍼", "냐오닉스", "단칼빙", "쌍검킬", "킬가르도", "슈쁘", "프레프티르", "나룸퍼프", "나루림", "오케이징", "칼라마네로", "거북손손", "거북손데스", "수레기", "드래캄", "완철포", "블로스터", "목도리키텔", "일레도리자드", "티고라스", "견고라스", "아마루스", "아마루르가", "님피아", "루차불", "데덴네", "멜리시", "미끄메라", "미끄네일", "미끄래곤", "클레피", "나목령", "대로트", "호바귀", "펌킨인", "꽁어름", "크레베이스", "음뱃", "음번", "제르네아스", "이벨타르", "지가르데", "디안시", "후파", "볼케니온", "나몰빼미", "빼미스로우", "모크나이퍼", "냐오불", "냐오히트", "어흥염", "누리공", "키요공", "누리레느", "콕코구리", "크라파", "왕큰부리", "영구스", "형사구스", "턱지충이", "전지충이", "투구뿌논", "오기지게", "모단단게", "춤추새", "에블리", "에리본", "암멍이", "루가루암", "약어리", "시마사리", "더시마사리", "머드나기", "만마드", "물거미", "깨비물거미", "짜랑랑", "라란티스", "자마슈", "마셰이드", "야도뇽", "염뉴트", "포곰곰", "이븐곰", "달콤아", "달무리나", "달코퀸", "큐아링", "하랑우탄", "내던숭이", "꼬시레", "갑주무사", "모래꿍", "모래성이당", "해무기", "타입:널", "실버디", "메테노", "자말라", "폭거북스", "토게데마루", "따라큐", "치갈기", "할비롱", "타타륜", "짜랑꼬", "짜랑고우", "짜랑고우거", "카푸꼬꼬꼭", "카푸나비나", "카푸브루루", "카푸느지느", "코스모그", "코스모움", "솔가레오", "루나아라", "텅비드", "매시붕", "페로코체", "전수목", "철화구야", "종이신도", "악식킹", "네크로즈마", "마기아나", "마샤도", "베베놈", "아고용", "차곡차곡", "두파팡", "제라오라", "멜탄", "멜메탈", "흥나숭", "채키몽", "고릴타", "염버니", "래비풋", "에이스번", "울머기", "누겔레온", "인텔리레온", "탐리스", "요씽리스", "파라꼬", "파크로우", "아머까오", "두루지벌레", "레돔벌레", "이올브", "훔처우", "폭슬라이", "꼬모카", "백솜모카", "우르", "배우르", "깨물부기", "갈가부기", "멍파치", "펄스멍", "탄동", "탄차곤", "석탄산", "과사삭벌레", "애프룡", "단지래플", "모래뱀", "사다이사", "윽우지", "찌로꼬치", "꼬치조", "일레즌", "스트린더", "태우지네", "다태우지네", "때때무노", "케오퍼스", "데인차", "포트데스", "몸지브림", "손지브림", "브리무음", "메롱꿍", "쏘겨모", "오롱털", "가로막구리", "나이킹", "산호르곤", "창파나이트", "마임꽁꽁", "데스판", "마빌크", "마휘핑", "대여르", "찌르성게", "누니머기", "모스노우", "돌헨진", "빙큐보", "에써르", "모르페코", "끼리동", "대왕끼리동", "파치래곤", "파치르돈", "어래곤", "어치르돈", "두랄루돈", "드라꼰", "드래런치", "드래펄트", "자시안", "자마젠타", "무한다이노", "치고마", "우라오스", "자루도", "레지에레키", "레지드래고", "블리자포스", "레이스포스", "버드렉스", "신비록", "사마자르", "다투곰", "대쓰여너", "포푸니크", "장침바루", "러브로스", "나오하", "나로테", "마스카나", "뜨아거", "악뜨거", "라우드본", "꾸왁스", "아꾸왁", "웨이니발", "맛보돈", "퍼퓨돈", "타랜툴라", "트래피더", "콩알뚜기", "엑스레그", "빠모", "빠모트", "빠르모트", "두리쥐", "파밀리쥐", "쫀도기", "바우첼", "미니브", "올리뇨", "올리르바", "시비꼬", "베베솔트", "스태솔트", "콜로솔트", "카르본", "카디나르마", "파라블레이즈", "빈나두", "찌리배리", "찌리비", "찌리비크", "오라티프", "마피티프", "땃쭈르", "태깅구르", "그푸리", "공푸리", "들눈해", "육파리", "절벼게", "캡싸이", "스코빌런", "구르데", "베라카스", "하느라기", "클레스퍼트라", "어리짱", "벼리짱", "두드리짱", "바다그다", "바닥트리오", "떨구새", "맨돌핀", "돌핀맨", "부르롱", "부르르룸", "모토마", "꿈트렁", "초롱순", "킬라플로르", "망망이", "묘두기", "꼬이밍고", "터벅고래", "우락고래", "가비루사", "어써러셔", "싸리용", "저승갓숭", "토오", "키키링", "노고고치", "대도각참", "위대한엄니", "우렁찬꼬리", "사나운버섯", "날개치는머리", "땅을기는날개", "모래털가죽", "무쇠바퀴", "무쇠보따리", "무쇠손", "무쇠머리", "무쇠독나방", "무쇠가시", "드니차", "드니꽁", "드닐레이브", "모으령", "타부자고", "총지엔", "파오젠", "딩루", "위유이", "고동치는달", "무쇠무인", "코라이돈", "미라이돈", "굽이치는물결", "무쇠잎새", "과미르", "차데스", "그우린차", "조타구", "이야후", "기로치", "오거폰", "브리두라스", "과미드라", "꿰뚫는화염", "날뛰는우레", "무쇠암석", "무쇠감투", "테라파고스", "복숭악동" },
};

// el primer huevo de la partida: iniciales clasicos
static const int16_t CLASSIC_DEX[] = { 1, 4, 7, 25, 133 };
#define NUM_CLASSIC_DEX 5
