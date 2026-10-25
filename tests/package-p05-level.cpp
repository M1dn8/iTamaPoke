#include <cassert>
#include <cstdint>
#include <iostream>
#include <tuple>
#include "pet.h"

uint32_t g_millis = 1000;
TPSerialShim Serial;
void sfxPlay(uint8_t) {}

static Pet loadLegacy(uint32_t age = 95) {
  Preferences::store().clear();
  Preferences p;
  p.putBool("init", true);
  p.putShort("dexn", 1);
  p.putShort("eggT2", 1);
  p.putUInt("age", age);
  p.putUChar("gatk", 100);
  p.putUChar("gdef", 100);
  p.putUChar("gspe", 100);
  p.putUChar("tatk", 7);
  p.putUChar("tdef", 8);
  p.putUChar("tspe", 9);
  Pet pet;
  pet.begin();
  return pet;
}

static auto personalState(const Pet &p) {
  return std::make_tuple(
    p.ageMinutes, p.trAtk, p.trDef, p.trSpe,
    p.fullness, p.joy, p.energy, p.hygiene, p.bond,
    p.battleWins, p.battleLosses, p.battleStreak,
    p.bestBattleStreak
  );
}

int main() {
  Pet pet = loadLegacy();
  assert(pet.battleLevelBonus == 0 && pet.level() == 2);

  const auto personal = personalState(pet);
  const auto atk = pet.atkStat();
  const auto def = pet.defStat();
  const auto spe = pet.speStat();

  assert(pet.grantBattleLevel());
  assert(pet.level() == 3 && pet.battleLevelBonus == 1);
  assert(personalState(pet) == personal);
  assert(pet.atkStat() == atk + 1);
  assert(pet.defStat() == def + 1);
  assert(pet.speStat() == spe + 1);
  assert(Preferences().getUChar("blvl", 0) == 1);
  assert(Preferences().getUInt("age", 0) == 95);

  Pet restored;
  restored.begin();
  assert(restored.level() == 3 && restored.battleLevelBonus == 1);
  assert(personalState(restored) == personal);

  // Existing whole-Pet/store checkpoints must include the new field.
  const Pet checkpoint = restored;
  const auto store = Preferences::store();
  assert(restored.grantBattleLevel());
  assert(restored.level() == 4);
  restored = checkpoint;
  Preferences::store() = store;
  assert(restored.level() == 3 && restored.battleLevelBonus == 1);
  Pet rolledBack;
  rolledBack.begin();
  assert(rolledBack.level() == 3);

  // Care progression keeps its original minute remainder.
  restored.ageMinutes = 119;
  assert(restored.level() == 3);
  restored.ageMinutes = 120;
  assert(restored.level() == 4);

  // All valid bonus values combine with care age and cap at 100.
  unsigned combinations = 0;
  for (uint32_t age = 0; age <= 7200; age += 17) {
    for (unsigned bonus = 0; bonus <= 99; ++bonus) {
      restored.ageMinutes = age;
      restored.battleLevelBonus = uint8_t(bonus);
      const uint32_t raw = 1 + age / 60 + bonus;
      assert(restored.level() == (raw > 100 ? 100 : raw));
      ++combinations;
    }
  }
  restored.ageMinutes = 0xffffffffu;
  restored.battleLevelBonus = 99;
  assert(restored.level() == 100);

  pet = loadLegacy(98 * MINUTES_PER_LEVEL);
  assert(pet.level() == 99 && pet.grantBattleLevel());
  assert(pet.level() == 100 && pet.ageMinutes == 98 * MINUTES_PER_LEVEL);
  const auto capped = Preferences::store();
  const auto cappedPersonal = personalState(pet);
  assert(!pet.grantBattleLevel());
  assert(Preferences::store() == capped);
  assert(personalState(pet) == cappedPersonal);

  pet = loadLegacy(99 * MINUTES_PER_LEVEL);
  const auto alreadyMax = Preferences::store();
  assert(!pet.grantBattleLevel() && pet.battleLevelBonus == 0);
  assert(Preferences::store() == alreadyMax);

  pet = loadLegacy(0);
  for (unsigned i = 0; i < 99; ++i) assert(pet.grantBattleLevel());
  assert(pet.level() == 100 && pet.battleLevelBonus == 99);
  assert(!pet.grantBattleLevel() && pet.ageMinutes == 0);

  pet = loadLegacy();
  pet.ceremony = CER_RELEASE;
  const auto ceremonyStore = Preferences::store();
  assert(!pet.grantBattleLevel());
  assert(Preferences::store() == ceremonyStore);
  pet.ceremony = CER_NONE;
  assert(pet.grantBattleLevel());
  pet.newEgg();
  assert(pet.isEgg() && pet.battleLevelBonus == 0);
  assert(Preferences().getUChar("blvl", 255) == 0);
  const auto eggStore = Preferences::store();
  assert(!pet.grantBattleLevel());
  assert(Preferences::store() == eggStore);

  Pet next;
  next.begin();
  assert(next.isEgg() && next.battleLevelBonus == 0);

  // A hatch must not inherit a stale in-memory bonus.
  next.battleLevelBonus = 9;
  next.chooseStarter(1);
  for (unsigned i = 0; i < 3; ++i) {
    g_millis += 1000;
    next.eggTap();
  }
  assert(!next.isEgg() && next.battleLevelBonus == 0);
  assert(Preferences().getUChar("blvl", 255) == 0);

  std::cout << "P05 level foundation passed: legacy zero, durable reload, "
    "Pet/store checkpoint rollback, unchanged care age/training/counters, "
    "level-dependent stats, " << combinations << " age/bonus combinations, "
    "99->100 cap, repeated data grants, ceremony/egg refusal and "
    "new-individual/hatch reset. No combat reward wiring claimed.\n";
}
