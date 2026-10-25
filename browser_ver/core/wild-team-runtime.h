#pragma once
#include <array>
#include <cstddef>
#include <cstdint>
#include "battle.h"
#include "dex.h"

// P05 combat-only state. Collection ownership and rewards live elsewhere.
// The caller's BattleRuntime remains the single current battle runtime.
struct TPWildTeamEntry {
  uint32_t id = 0;
  int16_t dex = 0;
  BattleStats stats{};
};

struct TPWildTeamResult {
  bool accepted = false;
  bool needsSwitch = false;
  bool resolved = false;
  bool won = false;
  BattleTurnResult turn{};
};

class TPWildTeamRuntime {
  struct Member {
    TPWildTeamEntry entry{};
    uint16_t hp = 0;
    uint16_t maxHp = 0;
  };
  std::array<Member, 6> members{};
  std::size_t size_ = 0;
  std::size_t active_ = 0;
  bool live_ = false;
  bool pending_ = false;
  bool resolved_ = false;

  TPWildTeamResult record(BattleRuntime &battle, BattleTurnResult turn) {
    members[active_].hp = battle.playerHp;
    bool remaining = false;
    for (std::size_t i = 0; i < size_; ++i)
      remaining = remaining || members[i].hp > 0;
    pending_ = turn.battleEnded && !turn.playerWon &&
      battle.enemyHp > 0 && remaining;
    resolved_ = turn.battleEnded && !pending_;
    return {true, pending_, resolved_,
      resolved_ && turn.playerWon, turn};
  }

public:
  bool begin(BattleRuntime &battle, const TPWildTeamEntry *entries,
             std::size_t count, const BattleStats &enemy) {
    if (!entries || count < 1 || count > 6 ||
        enemy.level < 1 || enemy.level > 100) return false;
    for (std::size_t i = 0; i < count; ++i) {
      const auto &e = entries[i];
      if (!e.id || e.dex < 1 || e.dex > DEX_COUNT ||
          e.stats.level < 1 || e.stats.level > 100) return false;
      for (std::size_t j = 0; j < i; ++j)
        if (entries[j].id == e.id) return false;
    }

    TPWildTeamRuntime next;
    next.size_ = count;
    next.live_ = true;
    for (std::size_t i = 0; i < count; ++i) {
      const auto initial = beginBattleRuntime(entries[i].stats, enemy);
      next.members[i] = {entries[i], initial.playerHp, initial.playerMaxHp};
    }
    const auto initial = beginBattleRuntime(entries[0].stats, enemy);
    *this = next;
    battle = initial;
    return true;
  }

  TPWildTeamResult act(BattleRuntime &battle, BattleAction action,
                       uint8_t luck) {
    if (!live_ || resolved_ || pending_ ||
        battle.playerHp == 0 || battle.enemyHp == 0 ||
        action < BATTLE_ATTACK || action > BATTLE_REST) return {};
    return record(battle, stepBattle(battle, action, luck));
  }

  TPWildTeamResult select(BattleRuntime &battle, std::size_t index,
                          uint8_t luck) {
    if (!live_ || resolved_ || index >= size_ || index == active_ ||
        members[index].hp == 0 || battle.enemyHp == 0) return {};

    const bool forced = pending_;
    if (!forced && battle.playerHp == 0) return {};

    members[active_].hp = battle.playerHp;
    active_ = index;
    battle.player = members[index].entry.stats;
    battle.playerHp = members[index].hp;
    battle.playerMaxHp = members[index].maxHp;
    // An earned counter is not transferred to another individual.
    battle.counterReady = false;
    pending_ = false;

    if (forced) return {true, false, false, false, {}};
    return record(battle, stepBattle(battle, BATTLE_SWITCH, luck));
  }

  void clear() { *this = TPWildTeamRuntime{}; }
  std::size_t count() const { return size_; }
  std::size_t activeIndex() const { return active_; }
  uint32_t activeId() const {
    return live_ ? members[active_].entry.id : 0;
  }
  uint32_t id(std::size_t i) const {
    return i < size_ ? members[i].entry.id : 0;
  }
  uint16_t hp(std::size_t i) const {
    return i < size_ ? members[i].hp : 0;
  }
  uint16_t maxHp(std::size_t i) const {
    return i < size_ ? members[i].maxHp : 0;
  }
  bool needsSwitch() const { return pending_; }
  bool resolved() const { return resolved_; }
};
