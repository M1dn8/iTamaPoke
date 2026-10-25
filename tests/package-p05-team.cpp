#include <cassert>
#include <iostream>
#include "../browser_ver/core/wild-team-runtime.h"

static BattleStats stats(unsigned attack, unsigned defense,
                         unsigned speed, unsigned level = 30) {
  BattleStats s{};
  s.atk = attack;
  s.def = defense;
  s.spe = speed;
  s.level = level;
  s.type1 = 1;
  return s;
}

int main() {
  TPWildTeamEntry entries[7]{};
  for (unsigned i = 0; i < 7; ++i)
    entries[i] = {100 + i, 25, stats(100, 400, 100)};
  const auto enemy = stats(30, 100, 50);
  BattleRuntime battle{};
  TPWildTeamRuntime team;
  assert(team.begin(battle, entries, 6, enemy));
  assert(team.count() == 6 && team.activeId() == 100);
  assert(battle.restUsesLeft == 2 && battle.round == 0);
  for (unsigned i = 0; i < 6; ++i)
    assert(team.hp(i) == team.maxHp(i) && team.hp(i) > 0);

  // Invalid membership must leave a running session untouched.
  assert(!team.begin(battle, entries, 0, enemy));
  assert(!team.begin(battle, entries, 7, enemy));
  assert(!team.begin(battle, nullptr, 1, enemy));
  entries[1].id = entries[0].id;
  assert(!team.begin(battle, entries, 6, enemy));
  entries[1].id = 101;
  entries[1].id = 0;
  assert(!team.begin(battle, entries, 6, enemy));
  entries[1].id = 101;
  entries[1].dex = 0;
  assert(!team.begin(battle, entries, 6, enemy));
  entries[1].dex = 25;
  entries[1].stats.level = 0;
  assert(!team.begin(battle, entries, 6, enemy));
  entries[1].stats.level = 101;
  assert(!team.begin(battle, entries, 6, enemy));
  entries[1].stats.level = 30;
  assert(team.count() == 6 && team.activeId() == 100);

  const auto initialHp = battle.playerHp;
  battle.counterReady = true;
  auto moved = team.select(battle, 1, 50);
  assert(moved.accepted && !moved.resolved);
  assert(team.activeId() == 101 && battle.round == 1);
  assert(moved.turn.playerDamage == 0 && moved.turn.playerHeal == 0);
  assert(!moved.turn.playerDodged && !moved.turn.playerGuarded);
  assert(!moved.turn.quickGuard && !battle.counterReady);
  assert(moved.turn.enemyDamage > 0);
  assert(team.hp(0) == initialHp);
  assert(battle.playerHp == team.maxHp(1) - moved.turn.enemyDamage);
  assert(battle.restUsesLeft == 2);

  const auto injured = team.hp(1);
  assert(team.select(battle, 0, 50).accepted);
  assert(team.hp(1) == injured);
  auto back = team.select(battle, 1, 50);
  assert(back.accepted);
  assert(battle.playerHp == injured - back.turn.enemyDamage);
  assert(battle.round == 3);

  auto healed = team.act(battle, BATTLE_REST, 50);
  assert(healed.accepted && battle.restUsesLeft == 1);
  assert(team.select(battle, 0, 50).accepted);
  assert(battle.restUsesLeft == 1);
  assert(team.act(battle, BATTLE_REST, 50).accepted);
  assert(battle.restUsesLeft == 0);
  assert(team.select(battle, 1, 50).accepted);
  assert(battle.restUsesLeft == 0);

  const auto beforeInvalid = battle.round;
  assert(!team.select(battle, 1, 50).accepted);
  assert(!team.select(battle, 99, 50).accepted);
  assert(!team.act(battle, BATTLE_SWITCH, 50).accepted);
  assert(battle.round == beforeInvalid);

  // KO one member, switch without a bonus enemy turn, then lose the team.
  const auto strongEnemy = stats(5000, 5000, 200, 100);
  assert(team.begin(battle, entries, 2, strongEnemy));
  battle.playerHp = 1;
  const auto defeated = team.act(battle, BATTLE_ATTACK_HEAVY, 50);
  assert(defeated.accepted && defeated.needsSwitch && !defeated.resolved);
  assert(team.hp(0) == 0 && team.needsSwitch());
  const auto rounds = battle.round;
  const auto enemyHp = battle.enemyHp;
  const auto taken = battle.enemyDamageTotal;
  assert(!team.act(battle, BATTLE_ATTACK_QUICK, 50).accepted);
  const auto forced = team.select(battle, 1, 50);
  assert(forced.accepted && !forced.resolved && !team.needsSwitch());
  assert(battle.round == rounds && battle.enemyHp == enemyHp);
  assert(battle.enemyDamageTotal == taken);
  assert(battle.playerHp == team.maxHp(1));
  assert(!team.select(battle, 0, 50).accepted);

  battle.playerHp = 1;
  const auto loss = team.act(battle, BATTLE_ATTACK_HEAVY, 50);
  assert(loss.resolved && !loss.won && !loss.needsSwitch);
  assert(team.hp(0) == 0 && team.hp(1) == 0);
  assert(!team.select(battle, 0, 50).accepted);
  assert(!team.act(battle, BATTLE_REST, 50).accepted);

  // A new session heals both members and restores exactly two heals.
  assert(team.begin(battle, entries, 2, enemy));
  assert(team.hp(0) == team.maxHp(0));
  assert(team.hp(1) == team.maxHp(1));
  assert(battle.round == 0 && battle.restUsesLeft == 2);

  bool won = false;
  for (unsigned luck = 0; luck < 100 && !won; ++luck) {
    assert(team.begin(battle, entries, 2, enemy));
    assert(team.select(battle, 1, 50).accepted);
    battle.enemyHp = 1;
    const auto result = team.act(battle, BATTLE_ATTACK_HEAVY, luck);
    if (result.won) {
      won = true;
      assert(result.resolved && !result.needsSwitch);
      assert(team.activeId() == 101);
      assert(!team.act(battle, BATTLE_ATTACK_HEAVY, luck).accepted);
    }
  }
  assert(won);
  team.clear();
  assert(team.count() == 0 && team.activeId() == 0);
  assert(!team.act(battle, BATTLE_ATTACK_QUICK, 0).accepted);

  std::cout << "P05 team runtime passed: six unique individual IDs, "
    "duplicate species, neutral voluntary switch turn, retained HP, "
    "shared two heals, no counter transfer, forced switch without extra "
    "damage/round, defeated-member exclusion, final loss, actual winner ID "
    "and fresh-session healing. No game hooks or rewards claimed.\n";
}
