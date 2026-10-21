#include <emscripten.h>
#include <ctime>
#include <memory>
#include <string>
#include "pet.h"
extern Pet &tp_battle_pet();
extern "C" int tp_battle_is_open();
extern "C" int tp_wild_prompt_active();
namespace {std::unique_ptr<Pet> undoPet;std::map<std::string,Preferences::Value> undoStore;
uint32_t now(){const auto n=std::time(nullptr);return n>0&&uint64_t(n)<0xffffffffULL?uint32_t(n):0;}}
extern "C" {
EMSCRIPTEN_KEEPALIVE int tp_e_shiny(){return tp_battle_pet().shiny?1:0;}
EMSCRIPTEN_KEEPALIVE const char *tp_e_view(){
 static std::string out;Pet &p=tp_battle_pet();const auto n=now();const auto f=tpMegaByDex(p.speciesId);
 out="{\"form\":"+std::to_string(p.megaFormId())+",\"dex\":"+std::to_string(p.speciesId)+",\"name\":\""+(f?f->name:"")+"\",\"baseName\":\""+(f?f->baseName:"")+"\",\"stones\":"+std::to_string(p.megaStoneMask())+",\"supported\":"+std::to_string(p.megaSupported())+",\"stone\":"+std::to_string(p.megaStoneOwned())+",\"training\":"+std::to_string(p.megaTrainingCount())+",\"quest\":"+std::to_string(p.megaQuestReady())+",\"active\":"+std::to_string(p.megaActive(n))+",\"end\":"+std::to_string(p.megaEndsAt())+",\"cool\":"+std::to_string(p.megaCooldownAt())+",\"now\":"+std::to_string(n)+",\"shiny\":"+std::to_string(p.shiny)+",\"bond\":"+std::to_string(p.bond)+",\"care\":"+std::to_string(p.lowestStat())+",\"base\":["+std::to_string(p.atkStat())+","+std::to_string(p.defStat())+","+std::to_string(p.speStat())+"]}";return out.c_str();
}
EMSCRIPTEN_KEEPALIVE int tp_e_apply(int action){
 if(undoPet||tp_battle_is_open()||tp_wild_prompt_active()||action<0||action>1)return 0;
 Pet &p=tp_battle_pet();undoStore=Preferences::store();undoPet=std::make_unique<Pet>(p);
 const bool ok=action==0?p.megaClaim(now()):p.megaActivate(now());
 if(!ok){p=*undoPet;Preferences::store()=undoStore;undoPet.reset();undoStore.clear();return 0;}return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_e_finish(int commit){if(!undoPet)return 0;if(!commit){tp_battle_pet()=*undoPet;Preferences::store()=undoStore;}undoPet.reset();undoStore.clear();return 1;}
}
