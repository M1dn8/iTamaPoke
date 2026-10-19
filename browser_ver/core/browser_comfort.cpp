#include <emscripten.h>
#include "pet.h"
#include "evolution_rules.h"
#include "dayphase.h"
extern Pet &tp_battle_pet();
namespace {
const TPEvolutionRule *ruleAt(int from, int index) {
  if (from < 1 || from > DEX_COUNT || index < 0) return nullptr;
  for (unsigned i=0; i<TP_EVOLUTION_COUNT; ++i) {
    if (TP_EVOLUTIONS[i].from != from) continue;
    if (index-- == 0) return &TP_EVOLUTIONS[i];
  }
  return nullptr;
}
}
extern "C" {
EMSCRIPTEN_KEEPALIVE int tp_evo_rule_count(int from) {
  int n=0; for (unsigned i=0;i<TP_EVOLUTION_COUNT;++i) if(TP_EVOLUTIONS[i].from==from) ++n;
  return n;
}
// fields: target, needed level, needed bond, time, level ok, bond ok,
// time ok, care ok, awake, all ready, base level.
EMSCRIPTEN_KEEPALIVE int tp_evo_rule_field(int from,int index,int field) {
  const auto *r=ruleAt(from,index); if(!r) return -1;
  Pet &p=tp_battle_pet();
  const bool current = p.speciesId==from && !p.isEgg();
  unsigned mistakes=current?p.careMistakes:0;
  const unsigned phase=dayPhaseFromEpoch(p.lastSeenEpoch);
  bool timeOK=tpEvoRuleReady(*r,100,100,phase,p.lastSeenEpoch!=0,0);
  switch(field) {
    case 0:return r->to;
    case 1:return tpEvoNeededLevel(*r,mistakes);
    case 2:return r->bond;
    case 3:return r->time;
    case 4:return current && p.level()>=tpEvoNeededLevel(*r,mistakes);
    case 5:return current && p.bond>=r->bond;
    case 6:return timeOK;
    case 7:return current && p.lowestStat()>=40;
    case 8:return current && !p.sleeping;
    case 9:return current && !p.sleeping && p.lowestStat()>=40 && p.ceremony==CER_NONE && !p.evolving() && tpEvoRuleReady(*r,p.level(),p.bond,phase,p.lastSeenEpoch!=0,p.careMistakes);
    case 10:return r->level;
    default:return -1;
  }
}
EMSCRIPTEN_KEEPALIVE int tp_evo_choose(int target) { if(target<1 || target>DEX_COUNT)return 0; return tp_battle_pet().evolveTo((int16_t)target)?1:0; }
}
