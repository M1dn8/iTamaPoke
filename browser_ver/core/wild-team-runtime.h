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

// Combat-only checkpoint. Names, ownership and reward history live outside.
struct TPWildTeamCheckpoint {
  TPWildTeamEntry entry{};
  uint16_t hp=0,maxHp=0;
  uint8_t rests=0;
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
    uint8_t rests = 0;
  };
  std::array<Member, 6> members{};
  std::size_t size_ = 0;
  std::size_t active_ = 0;
  bool live_ = false;
  bool pending_ = false;
  bool resolved_ = false;
  bool won_ = false;
  // Opt-in for arena series; existing wild callers keep shared rests.
  bool individualRests_ = false;
  uint8_t restBudget_ = 2;

  TPWildTeamResult record(BattleRuntime &battle, BattleTurnResult turn) {
    members[active_].hp = battle.playerHp;
    if (individualRests_)
      members[active_].rests = battle.restUsesLeft;
    bool remaining = false;
    for (std::size_t i = 0; i < size_; ++i)
      remaining = remaining || members[i].hp > 0;
    pending_ = turn.battleEnded && !turn.playerWon &&
      battle.playerHp == 0 && battle.enemyHp > 0 && remaining &&
      !battleRoundLimitReached(battle);
    resolved_ = turn.battleEnded && !pending_;
    won_ = resolved_ && turn.playerWon;
    return {true, pending_, resolved_, won_, turn};
  }

public:
  bool begin(BattleRuntime &battle, const TPWildTeamEntry *entries,
             std::size_t count, const BattleStats &enemy,
             bool individualRests = false, uint8_t restBudget = 2) {
    if (!entries || count < 1 || count > 6 || restBudget > 5 ||
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
    next.individualRests_ = individualRests;
    next.restBudget_ = restBudget;
    for (std::size_t i = 0; i < count; ++i) {
      auto initial = beginBattleRuntime(entries[i].stats, enemy);
      initial.restUsesLeft = restBudget;
      next.members[i] = {
        entries[i], initial.playerHp, initial.playerMaxHp,
        initial.restUsesLeft
      };
    }
    auto initial = beginBattleRuntime(entries[0].stats, enemy);
    initial.restUsesLeft = restBudget;
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
    if (individualRests_)
      members[active_].rests = battle.restUsesLeft;
    active_ = index;
    battle.player = members[index].entry.stats;
    battle.playerHp = members[index].hp;
    battle.playerMaxHp = members[index].maxHp;
    if (individualRests_)
      battle.restUsesLeft = members[index].rests;
    // An earned counter is not transferred to another individual.
    battle.counterReady = false;
    pending_ = false;

    if (forced) return {true, false, false, false, {}};
    return record(battle, stepBattle(battle, BATTLE_SWITCH, luck));
  }

  // Start the next opponent only after a resolved individual victory.
  // Keep the frozen player stats, active member, HP and remaining rests.
  // The caller owns series totals and any deferred level rewards.
  bool nextEnemy(BattleRuntime &battle, const BattleStats &enemy) {
    if (!live_ || !resolved_ || !won_ || pending_ ||
        battle.playerHp == 0 ||
        enemy.level < 1 || enemy.level > 100) return false;

    members[active_].hp = battle.playerHp;
    if (individualRests_)
      members[active_].rests = battle.restUsesLeft;

    const auto hp = battle.playerHp;
    const auto maxHp = battle.playerMaxHp;
    const auto rests = battle.restUsesLeft;
    auto next = beginBattleRuntime(members[active_].entry.stats, enemy);
    next.playerHp = hp;
    next.playerMaxHp = maxHp;
    next.restUsesLeft = rests;

    battle = next;
    pending_ = false;
    resolved_ = false;
    won_ = false;
    return true;
  }


  // Only individual-rest sessions have independently restorable members.
  // A pending replacement or final loss is not a resumable checkpoint.
  bool snapshot(const BattleRuntime &battle, TPWildTeamCheckpoint *out,
                std::size_t capacity, std::size_t &activeIndex) const {
    if (!live_ || !individualRests_ || pending_ ||
        (resolved_ && !won_) || !out || capacity < size_ ||
        !battle.playerHp ||
        battle.playerMaxHp != members[active_].maxHp ||
        battle.playerHp > battle.playerMaxHp ||
        battle.restUsesLeft > restBudget_) return false;

    const auto &expected=members[active_].entry.stats;
    const auto &actual=battle.player;
    if (actual.hp!=expected.hp || actual.level!=expected.level ||
        actual.atk!=expected.atk || actual.def!=expected.def ||
        actual.spe!=expected.spe || actual.type1!=expected.type1 ||
        actual.type2!=expected.type2 || actual.mega!=expected.mega)
      return false;

    std::array<TPWildTeamCheckpoint,6> next{};
    for (std::size_t i=0;i<size_;i++) {
      const auto &member=members[i];
      next[i]={
        member.entry,
        i==active_?battle.playerHp:member.hp,
        member.maxHp,
        i==active_?battle.restUsesLeft:member.rests
      };
      if (next[i].hp>next[i].maxHp || next[i].rests>restBudget_)
        return false;
    }
    for (std::size_t i=0;i<size_;i++)out[i]=next[i];
    activeIndex=active_;
    return true;
  }

  // Restore a committed checkpoint against a fresh opponent.
  // Validate into temporary objects; failure changes neither receiver.
  bool restore(BattleRuntime &battle,
               const TPWildTeamCheckpoint *saved,
               std::size_t count, std::size_t activeIndex,
               const BattleStats &enemy, uint8_t restBudget=5) {
    if (!saved || count<1 || count>6 || activeIndex>=count ||
        restBudget>5) return false;

    TPWildTeamEntry entries[6]{};
    for (std::size_t i=0;i<count;i++)entries[i]=saved[i].entry;
    TPWildTeamRuntime next;
    BattleRuntime restored{};
    if (!next.begin(restored,entries,count,enemy,true,restBudget))
      return false;

    for (std::size_t i=0;i<count;i++) {
      if (saved[i].maxHp!=next.members[i].maxHp ||
          saved[i].hp>saved[i].maxHp ||
          saved[i].rests>restBudget) return false;
      next.members[i].hp=saved[i].hp;
      next.members[i].rests=saved[i].rests;
    }
    if (!next.members[activeIndex].hp) return false;

    next.active_=activeIndex;
    const auto &member=next.members[activeIndex];
    restored.player=member.entry.stats;
    restored.playerHp=member.hp;
    restored.playerMaxHp=member.maxHp;
    restored.restUsesLeft=member.rests;
    restored.counterReady=false;
    *this=next;
    battle=restored;
    return true;
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
  bool won() const { return resolved_&&won_; }
  uint8_t rests(std::size_t i) const {
    return i<size_?members[i].rests:0;
  }
};
