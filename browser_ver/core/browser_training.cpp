// F1: session counters do not touch the pet until one reversible completion.
#include <emscripten.h>
#include <cstdint>
#include <memory>
#include "pet.h"
extern Pet &tp_battle_pet();
extern "C" int tp_battle_is_open();extern "C" int tp_wild_prompt_active();
namespace {
uint32_t serial=0,token=0,started=0,lastTap=0,startAge=0;uint16_t hits=0;uint8_t kind=0,phase=0,gain=0,before=0;bool hadTap=false,newHigh=false;int16_t species=-1;uint8_t ga=0,gd=0,gs=0;
std::unique_ptr<Pet> undoPet;std::map<std::string,Preferences::Value> undoStore;
uint8_t value(const Pet &p){return kind==TRAIN_STAT_ATK?p.trAtk:kind==TRAIN_STAT_DEF?p.trDef:p.trSpe;}
uint16_t record(const Pet &p){return kind==TRAIN_STAT_ATK?p.strHi:kind==TRAIN_STAT_DEF?p.defenseTrainHi:p.speedTrainHi;}
bool eligible(){const Pet &p=tp_battle_pet();return !p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&!p.evolving()&&!tp_battle_is_open()&&!tp_wild_prompt_active();}
bool actor(){const Pet &p=tp_battle_pet();return p.speciesId==species&&p.geneAtk==ga&&p.geneDef==gd&&p.geneSpe==gs&&p.ageMinutes>=startAge;}
}
extern "C" {
EMSCRIPTEN_KEEPALIVE int tp_f1_can(){return phase!=1&&!undoPet&&eligible();}
EMSCRIPTEN_KEEPALIVE int tp_f1_start(int stat,uint32_t now){
 if(stat<0||stat>TRAIN_STAT_SPE||phase==1||undoPet||!eligible()||now>0xffffffffU-15000||serial>=0x7ffffffe)return 0;
 Pet &p=tp_battle_pet();kind=uint8_t(stat);token=++serial;started=now;hits=0;gain=0;hadTap=newHigh=false;phase=1;species=p.speciesId;ga=p.geneAtk;gd=p.geneDef;gs=p.geneSpe;startAge=p.ageMinutes;before=value(p);return int(token);
}
EMSCRIPTEN_KEEPALIVE int tp_f1_tap(int id,uint32_t now){
 if(id<=0||uint32_t(id)!=token||phase!=1||undoPet||!eligible()||!actor()||now<started||now-started>=10000||hits==65535||(hadTap&&now<=lastTap))return 0;
 hits++;lastTap=now;hadTap=true;return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_f1_cancel(int id){if(id<=0||uint32_t(id)!=token||phase!=1||undoPet)return 0;phase=4;return 1;}
EMSCRIPTEN_KEEPALIVE int tp_f1_apply(int id,uint32_t now){
 if(id<=0||uint32_t(id)!=token||phase!=1||undoPet||!eligible()||!actor()||now<started||now-started<10000||now-started>15000)return 0;
 Pet &p=tp_battle_pet();undoStore=Preferences::store();undoPet=std::make_unique<Pet>(p);phase=2;const auto high=record(p);gain=hits?p.trainCombat(kind,hits):0;newHigh=hits>high;return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_f1_finish(int id,int commit){
 if(id<=0||uint32_t(id)!=token||!undoPet||(commit!=0&&commit!=1))return 0;
 if(!commit){tp_battle_pet()=*undoPet;Preferences::store()=undoStore;gain=0;newHigh=false;phase=5;}else phase=3;
 undoPet.reset();undoStore.clear();return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_f1_get(int key){const Pet &p=tp_battle_pet();switch(key){case 0:return phase;case 1:return kind;case 2:return hits;case 3:return gain;case 4:return record(p);case 5:return newHigh;case 6:return value(p);case 7:return token;case 8:return before;default:return -1;}}
}
