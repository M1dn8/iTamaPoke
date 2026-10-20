#include <emscripten.h>
#include "pet.h"
extern Pet &tp_battle_pet();
extern "C" {
EMSCRIPTEN_KEEPALIVE int tp_c3_metric(int metric){const Pet&p=tp_battle_pet();switch(metric){case 0:return p.trAtk;case 1:return p.trDef;case 2:return p.trSpe;case 3:return p.hygiene;default:return -1;}}
}
