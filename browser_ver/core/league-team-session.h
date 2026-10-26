#pragma once
#include <cstdint>
#include "league-team-state.h"
#include "wild-team-runtime.h"
#include "league-kanto.h"
#include "league-johto.h"

// Native session only: no Preferences, ownership lookup or reward application.
// The adapter validates collection/care ownership before opening a session.
// It durably stages the WinPlan, then calls finishWin(token, true).
namespace tp_league_team {

struct WinPlan {
  // For final=true, next.index==26 and next is terminal history, NOT a
  // codec-valid checkpoint. The adapter must erase the run on final commit.
  State next{};
  bool final=false;
  uint32_t winnerId=0;
  uint8_t boxLevelDelta=0;
  bool careLevelGranted=false;
};

class Session {
  State state_{};
  TPWildTeamRuntime team_{};
  BattleRuntime battle_{};
  bool live_=false;
  uint32_t serial_=0,pending_=0;
  WinPlan prepared_{};

  static const TPLeagueMon *opponent(const State &s){
    if(s.index>=26)return nullptr;
    if(s.region==0)
      return s.variant<3?&kLeagueTeams[s.variant][s.index]:nullptr;
    if(s.region==1&&s.variant==0)return tpJohtoLeagueMonAt(s.index);
    return nullptr;
  }

  bool open(const State &saved,bool fresh){
    if(live_||pending_||!valid(saved))return false;
    if(fresh){
      if(saved.phase!=IN_PROGRESS||saved.index!=0)return false;
      for(const auto &m:saved.members)
        if(m.hp!=m.maxHp||m.rests!=5)return false;
    }else if(saved.phase!=CHECKPOINT){
      return false;
    }

    const auto *enemy=opponent(saved);
    if(!enemy)return false;
    TPWildTeamCheckpoint members[6]{};
    for(size_t i=0;i<saved.members.size();i++){
      const auto &m=saved.members[i];
      members[i]={
        {m.id,int16_t(m.dex),m.stats},m.hp,m.maxHp,m.rests
      };
    }

    TPWildTeamRuntime next;
    BattleRuntime battle{};
    if(!next.restore(
      battle,members,saved.members.size(),saved.active,
      wildBattleStats(enemy->dex,enemy->level),5
    ))return false;

    // Both objects are installed only after complete validation.
    state_=saved;
    state_.phase=IN_PROGRESS;
    team_=next;
    battle_=battle;
    live_=true;
    return true;
  }

public:
  bool start(const State &fresh){return open(fresh,true);}
  bool resume(const State &checkpoint){return open(checkpoint,false);}

  TPWildTeamResult act(BattleAction action,uint8_t luck){
    if(!live_||pending_)return {};
    return team_.act(battle_,action,luck);
  }

  TPWildTeamResult select(size_t index,uint8_t luck){
    if(!live_||pending_)return {};
    return team_.select(battle_,index,luck);
  }

  bool capture(State &out)const{
    if(!live_)return false;
    TPWildTeamCheckpoint saved[6]{};
    size_t active=0;
    if(!team_.snapshot(battle_,saved,6,active))return false;
    State next=state_;
    next.active=uint8_t(active);
    for(size_t i=0;i<next.members.size();i++){
      if(saved[i].entry.id!=next.members[i].id)return false;
      next.members[i].hp=saved[i].hp;
      next.members[i].maxHp=saved[i].maxHp;
      next.members[i].rests=saved[i].rests;
    }
    if(!valid(next))return false;
    out=std::move(next);
    return true;
  }

  // careLevelGranted is a report from the adapter's staged Pet transaction,
  // not an instruction to change Pet here. False records no care level gain.
  // Box gains are deferred accounting only; no collection is changed here.
  uint32_t prepareWin(WinPlan &out,bool careLevelGranted=false){
    if(!live_||pending_||serial_>=0x7ffffffeu||
       !team_.resolved()||battle_.enemyHp!=0&&
       !battleRoundLimitReached(battle_))return 0;

    // Runtime snapshot also rejects a resolved loss. A timeout victory may
    // leave enemy HP nonzero, so resolution alone is not sufficient.
    State next;
    if(!capture(next))return 0;

    const auto winner=team_.activeIndex();
    if(winner>=next.members.size())return 0;
    auto &member=next.members[winner];
    const bool care=member.id==next.care.id;
    if(careLevelGranted&&(
      !care||member.levelGains>=100u-member.stats.level
    ))return 0;

    const auto previousGain=member.levelGains;
    member.wins++;
    if(care){
      if(careLevelGranted)member.levelGains++;
    }else{
      member.levelGains=uint8_t(std::min(
        unsigned(member.wins),100u-member.stats.level
      ));
    }
    next.index++;
    next.phase=CHECKPOINT;

    WinPlan plan;
    plan.final=next.index==26;
    plan.winnerId=member.id;
    plan.boxLevelDelta=care?0:uint8_t(member.levelGains-previousGain);
    plan.careLevelGranted=careLevelGranted;
    if(!plan.final&&!valid(next))return 0;
    plan.next=std::move(next);

    prepared_=plan;
    pending_=++serial_;
    out=plan;
    return pending_;
  }

  // Failed persistence leaves the resolved battle available for a retry.
  // Successful persistence closes the battle at its committed checkpoint.
  bool finishWin(uint32_t token,bool commit){
    if(!token||token!=pending_)return false;
    if(commit){
      state_=prepared_.next;
      team_.clear();
      battle_=BattleRuntime{};
      live_=false;
    }
    pending_=0;
    prepared_=WinPlan{};
    return true;
  }

  bool abort(){
    if(pending_)return false;
    state_=State{};
    team_.clear();
    battle_=BattleRuntime{};
    live_=false;
    return true;
  }

  bool live()const{return live_;}
  bool pending()const{return pending_!=0;}
  bool needsSwitch()const{return live_&&team_.needsSwitch();}
  bool resolved()const{return live_&&team_.resolved();}
  bool won()const{return live_&&team_.won();}
  size_t activeIndex()const{
    return live_?team_.activeIndex():state_.active;
  }
  uint16_t memberHp(size_t i)const{
    if(i>=state_.members.size())return 0;
    return live_?(i==team_.activeIndex()?battle_.playerHp:team_.hp(i)):
      state_.members[i].hp;
  }
  uint8_t memberRests(size_t i)const{
    if(i>=state_.members.size())return 0;
    return live_?(i==team_.activeIndex()?battle_.restUsesLeft:team_.rests(i)):
      state_.members[i].rests;
  }
  uint32_t activeId()const{return live_?team_.activeId():0;}
  const State &state()const{return state_;}
  const BattleRuntime &battle()const{return battle_;}
};

} // namespace tp_league_team
