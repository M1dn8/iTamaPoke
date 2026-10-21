#include <emscripten.h>
#include <string>
#include "pet.h"
extern Pet &tp_battle_pet();
extern "C" {
EMSCRIPTEN_KEEPALIVE const char *tp_journal_json(){static std::string out;out=tp_battle_pet().journalJSON();return out.c_str();}
}
