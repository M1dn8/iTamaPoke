#include <cassert>
#include <iostream>
#include <tuple>
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

static auto state(const TPWildTeamRuntime &team,
                  const BattleRuntime &battle) {
  return std::make_tuple(
    team.count(), team.activeId(), team.needsSwitch(), team.resolved(),
    team.hp(0), team.hp(1), team.maxHp(0), team.maxHp(1),
    battle.playerHp, battle.playerMaxHp, battle.enemyHp,
    battle.enemyMaxHp, battle.restUsesLeft, battle.round,
    battle.playerDamageTotal, battle.enemyDamageTotal,
    battle.player.level, battle.player.atk, battle.player.def,
    battle.player.spe, battle.counterReady
  );
}

// Each luck probe starts from the same state. Only a winning probe is kept.
static void winCurrent(TPWildTeamRuntime &team, BattleRuntime &battle) {
  battle.enemyHp = 1;
  for (unsigned luck = 0; luck < 100; ++luck) {
    auto probeTeam = team;
    auto probeBattle = battle;
    const auto result = probeTeam.act(
      probeBattle, BATTLE_ATTACK_HEAVY, static_cast<uint8_t>(luck)
    );
    if (result.accepted && result.resolved && result.won) {
      team = probeTeam;
      battle = probeBattle;
      assert(team.resolved() && !team.needsSwitch());
      assert(battle.enemyHp == 0 && battle.playerHp > 0);
      return;
    }
  }
  assert(false && "No winning luck value for prepared fixture");
}

int main() {
  TPWildTeamEntry entries[2] = {
    {100, 25, stats(100, 400, 100)},
    {101, 25, stats(100, 400, 100)}
  };
  const auto enemy = stats(30, 100, 50);
  BattleRuntime battle{};
  TPWildTeamRuntime team;

  assert(!team.nextEnemy(battle, enemy));
  assert(team.begin(battle, entries, 2, enemy, true));
  assert(team.count() == 2 && team.activeId() == 100);
  assert(battle.restUsesLeft == 2);

  // An unresolved opponent cannot be replaced.
  auto before = state(team, battle);
  assert(!team.nextEnemy(battle, enemy));
  assert(state(team, battle) == before);

  // Spend both heals on member 100.
  assert(team.act(battle, BATTLE_REST, 50).accepted);
  assert(battle.restUsesLeft == 1);
  assert(team.act(battle, BATTLE_REST, 50).accepted);
  assert(battle.restUsesLeft == 0);

  // Member 101 has its own untouched supply.
  auto moved = team.select(battle, 1, 50);
  assert(moved.accepted && !moved.resolved);
  assert(team.activeId() == 101 && battle.restUsesLeft == 2);
  assert(team.act(battle, BATTLE_REST, 50).accepted);
  assert(battle.restUsesLeft == 1);
  const auto injured101 = battle.playerHp;

  assert(team.select(battle, 0, 50).accepted);
  assert(team.activeId() == 100 && battle.restUsesLeft == 0);
  moved = team.select(battle, 1, 50);
  assert(moved.accepted && battle.restUsesLeft == 1);
  assert(battle.playerHp == injured101 - moved.turn.enemyDamage);

  winCurrent(team, battle);
  const auto winner = team.activeId();
  const auto hp = battle.playerHp;
  const auto maxHp = battle.playerMaxHp;
  const auto rests = battle.restUsesLeft;
  const auto reserveHp = team.hp(0);
  const auto frozen = battle.player;

  // Invalid next opponents must not consume the resolved victory.
  auto invalid = enemy;
  invalid.level = 0;
  before = state(team, battle);
  assert(!team.nextEnemy(battle, invalid));
  assert(state(team, battle) == before);
  invalid.level = 101;
  assert(!team.nextEnemy(battle, invalid));
  assert(state(team, battle) == before);

  const auto nextOpponent = stats(40, 120, 60, 35);
  assert(team.nextEnemy(battle, nextOpponent));
  assert(!team.resolved() && !team.needsSwitch());
  assert(team.activeId() == winner);
  assert(battle.playerHp == hp && battle.playerMaxHp == maxHp);
  assert(battle.restUsesLeft == rests);
  assert(team.hp(0) == reserveHp);
  assert(battle.player.level == frozen.level);
  assert(battle.player.atk == frozen.atk);
  assert(battle.player.def == frozen.def);
  assert(battle.player.spe == frozen.spe);
  assert(battle.enemy.level == 35);
  assert(battle.enemy.atk == nextOpponent.atk);
  assert(battle.enemyHp == battle.enemyMaxHp && battle.enemyHp > 0);
  assert(battle.round == 0);
  assert(battle.playerDamageTotal == 0 && battle.enemyDamageTotal == 0);
  assert(!battle.counterReady);
  assert(!team.nextEnemy(battle, enemy));

  // Switching after the opponent change still restores member 100's zero.
  assert(team.select(battle, 0, 50).accepted);
  assert(battle.restUsesLeft == 0);
  assert(team.select(battle, 1, 50).accepted);
  assert(battle.restUsesLeft == rests);
  winCurrent(team, battle);
  assert(team.nextEnemy(battle, enemy));
  assert(battle.restUsesLeft == rests);

  // KO the weak first member; the second can win without reviving it.
  TPWildTeamEntry knockoutEntries[2] = {
    {200, 25, stats(1, 1, 1)},
    {201, 25, stats(10000, 10000, 10000)}
  };
  const auto strongEnemy = stats(5000, 5000, 200, 100);
  assert(team.begin(battle, knockoutEntries, 2, strongEnemy, true));
  battle.playerHp = 1;
  const auto defeated = team.act(battle, BATTLE_ATTACK_HEAVY, 50);
  assert(defeated.accepted && defeated.needsSwitch);
  assert(!defeated.resolved && team.hp(0) == 0);

  before = state(team, battle);
  assert(!team.nextEnemy(battle, enemy));
  assert(state(team, battle) == before);

  const auto round = battle.round;
  const auto taken = battle.enemyDamageTotal;
  const auto enemyHp = battle.enemyHp;
  const auto forced = team.select(battle, 1, 50);
  assert(forced.accepted && !forced.resolved);
  assert(battle.round == round && battle.enemyDamageTotal == taken);
  assert(battle.enemyHp == enemyHp);
  assert(battle.playerHp == team.maxHp(1));
  assert(battle.restUsesLeft == 2);

  winCurrent(team, battle);
  assert(team.activeId() == 201 && team.hp(0) == 0);
  const auto survivorHp = battle.playerHp;
  assert(team.nextEnemy(battle, enemy));
  assert(team.hp(0) == 0 && team.activeId() == 201);
  assert(battle.playerHp == survivorHp);
  assert(!team.select(battle, 0, 50).accepted);

  // A final team loss cannot advance to another opponent.
  assert(team.begin(battle, entries, 1, strongEnemy, true));
  battle.playerHp = 1;
  const auto lost = team.act(battle, BATTLE_ATTACK_HEAVY, 50);
  assert(lost.accepted && lost.resolved && !lost.won);
  before = state(team, battle);
  assert(!team.nextEnemy(battle, enemy));
  assert(state(team, battle) == before);

  // Only a fresh session restores every member and its individual supply.
  assert(team.begin(battle, entries, 2, enemy, true));
  assert(team.hp(0) == team.maxHp(0));
  assert(team.hp(1) == team.maxHp(1));
  assert(team.activeId() == 100);
  assert(battle.restUsesLeft == 2 && battle.round == 0);
  assert(team.select(battle, 1, 50).accepted);
  assert(battle.restUsesLeft == 2);


  // A timeout loss with living members is final, not a forced switch.
  assert(team.begin(battle, entries, 2, strongEnemy, true));
  battle.round = 19;
  const auto timedLoss = team.act(battle, BATTLE_DODGE, 99);
  assert(battleRoundLimitReached(battle));
  assert(timedLoss.accepted && timedLoss.resolved && !timedLoss.won);
  assert(!timedLoss.needsSwitch && !team.needsSwitch());
  assert(team.hp(0) > 0 && team.hp(1) > 0);
  before = state(team, battle);
  assert(!team.select(battle, 1, 50).accepted);
  assert(!team.act(battle, BATTLE_ATTACK_HEAVY, 50).accepted);
  assert(!team.nextEnemy(battle, enemy));
  assert(state(team, battle) == before);

  // A KO exactly on the final round also cannot resume past the limit.
  assert(team.begin(battle, entries, 2, strongEnemy, true));
  battle.round = 19;
  battle.playerHp = 1;
  const auto finalRoundKO = team.act(battle, BATTLE_ATTACK_HEAVY, 50);
  assert(finalRoundKO.resolved && !finalRoundKO.won);
  assert(!finalRoundKO.needsSwitch && team.hp(0) == 0);
  assert(team.hp(1) > 0);
  assert(!team.select(battle, 1, 50).accepted);

  // A timeout win can advance even though the opponent has remaining HP.
  assert(team.begin(battle, entries, 2, enemy, true));
  battle.round = 19;
  battle.enemyHp = 1;
  const auto timedWin = team.act(battle, BATTLE_DODGE, 0);
  assert(timedWin.resolved && timedWin.won && !timedWin.needsSwitch);
  assert(battleRoundLimitReached(battle) && battle.enemyHp > 0);
  const auto timedHp = battle.playerHp;
  const auto timedRests = battle.restUsesLeft;
  assert(team.nextEnemy(battle, nextOpponent));
  assert(battle.round == 0 && !battleRoundLimitReached(battle));
  assert(battle.playerHp == timedHp && battle.restUsesLeft == timedRests);
  assert(battle.enemyHp == battle.enemyMaxHp);
  assert(!team.resolved());

  team.clear();
  assert(!team.nextEnemy(battle, enemy));

  std::cout << "P05b arena runtime passed: opt-in individual heals, "
    "switch retention, victory-only opponent advance, invalid-advance "
    "preservation, frozen player stats, HP/rest carry, fresh enemy, "
    "forced switch without extra turn, persistent fainted members, "
    "loss refusal, fresh-session reset and final timeout win/loss handling. "
    "No arena entry, storage or reward integration claimed.\n";
}
