#include <array>
#include <cassert>
#include <iostream>
#include <sstream>
#include "../browser_ver/core/wild-team-runtime.h"
#include "../browser_ver/core/league-team-state.h"

namespace L=tp_league_team;

static BattleStats stats(unsigned atk,unsigned def,unsigned spe,unsigned level=30){
  BattleStats s{};
  s.atk=atk;s.def=def;s.spe=spe;s.level=level;s.type1=1;
  return s;
}

static void winCurrent(TPWildTeamRuntime &team,BattleRuntime &battle){
  battle.enemyHp=1;
  for(unsigned luck=0;luck<100;luck++){
    auto candidate=team;
    auto candidateBattle=battle;
    const auto result=candidate.act(
      candidateBattle,BATTLE_ATTACK_HEAVY,uint8_t(luck)
    );
    if(result.accepted&&result.resolved&&result.won){
      team=candidate;battle=candidateBattle;return;
    }
  }
  assert(false&&"Prepared victory fixture failed");
}

static std::string fingerprint(
    const TPWildTeamRuntime &team,const BattleRuntime &battle){
  std::array<TPWildTeamCheckpoint,6> saved{};
  std::size_t active=99;
  assert(team.snapshot(battle,saved.data(),saved.size(),active));
  std::ostringstream out;
  out<<team.count()<<':'<<active<<':'<<battle.round<<':'
     <<battle.enemyHp<<':'<<battle.enemyMaxHp<<':'
     <<battle.playerDamageTotal<<':'<<battle.enemyDamageTotal<<':'
     <<battle.counterReady;
  for(std::size_t i=0;i<team.count();i++){
    const auto &m=saved[i];const auto &s=m.entry.stats;
    out<<'|'<<m.entry.id<<':'<<m.entry.dex<<':'<<unsigned(s.level)
       <<':'<<s.atk<<':'<<s.def<<':'<<s.spe<<':'<<s.hp
       <<':'<<unsigned(s.type1)<<':'<<unsigned(s.type2)<<':'<<s.mega
       <<':'<<m.hp<<':'<<m.maxHp<<':'<<unsigned(m.rests);
  }
  return out.str();
}

int main(){
  TPWildTeamEntry entries[2]={
    {100,150,stats(300,400,400)},
    {101,25,stats(300,400,400)}
  };
  const auto enemy=stats(30,100,50);
  const auto nextEnemy=stats(40,120,60,35);
  TPWildTeamRuntime team;
  BattleRuntime battle{};

  // Existing callers still start with exactly two shared heals.
  assert(team.begin(battle,entries,2,enemy));
  assert(battle.restUsesLeft==2);
  std::array<TPWildTeamCheckpoint,6> saved{};
  saved[0].entry.id=999;
  std::size_t active=99;
  assert(!team.snapshot(battle,saved.data(),saved.size(),active));
  assert(saved[0].entry.id==999&&active==99);

  // Explicit league budget: five independent heals.
  assert(team.begin(battle,entries,2,enemy,true,5));
  assert(battle.restUsesLeft==5);
  assert(team.act(battle,BATTLE_REST,50).accepted);
  assert(battle.restUsesLeft==4);
  assert(team.select(battle,1,50).accepted);
  assert(battle.restUsesLeft==5);
  assert(team.act(battle,BATTLE_REST,50).accepted);
  assert(team.act(battle,BATTLE_REST,50).accepted);
  assert(battle.restUsesLeft==3);
  const auto reserveHp=battle.playerHp;
  assert(team.select(battle,0,50).accepted);
  assert(battle.restUsesLeft==4);
  assert(team.hp(1)==reserveHp);
  winCurrent(team,battle);

  assert(team.snapshot(battle,saved.data(),saved.size(),active));
  assert(active==0&&saved[0].rests==4&&saved[1].rests==3);
  assert(saved[1].hp==reserveHp);
  assert(saved[0].entry.stats.level==30);

  // Persist through the real codec, then reconstruct a fresh runtime.
  L::State state;
  state.phase=L::CHECKPOINT;state.index=1;
  state.active=uint8_t(active);
  state.care={100,1,540,150,100,100,100,false};
  for(unsigned i=0;i<2;i++){
    L::Member m;
    m.id=saved[i].entry.id;m.dex=saved[i].entry.dex;
    m.stats=saved[i].entry.stats;m.nick=i?"Reserve":"Care";
    m.hp=saved[i].hp;m.maxHp=saved[i].maxHp;m.rests=saved[i].rests;
    m.wins=i==active?1:0;m.levelGains=m.wins;
    state.members.push_back(m);
  }
  std::vector<uint8_t> bytes;
  assert(L::encode(state,bytes));
  L::State decoded;
  assert(L::decode(bytes,0,decoded));

  std::array<TPWildTeamCheckpoint,6> transported{};
  for(std::size_t i=0;i<decoded.members.size();i++){
    const auto &m=decoded.members[i];
    transported[i]={{m.id,int16_t(m.dex),m.stats},m.hp,m.maxHp,m.rests};
  }

  TPWildTeamRuntime restored;
  BattleRuntime resumed{};
  assert(restored.restore(
    resumed,transported.data(),decoded.members.size(),
    decoded.active,nextEnemy,5
  ));
  assert(restored.activeId()==100&&restored.count()==2);
  assert(resumed.playerHp==saved[0].hp);
  assert(resumed.playerMaxHp==saved[0].maxHp);
  assert(resumed.restUsesLeft==4&&resumed.player.level==30);
  assert(resumed.round==0&&!resumed.counterReady);
  assert(resumed.playerDamageTotal==0&&resumed.enemyDamageTotal==0);
  assert(resumed.enemy.level==35);
  assert(resumed.enemyHp==resumed.enemyMaxHp);
  assert(restored.hp(1)==reserveHp);

  // Invalid restores leave both existing runtime objects untouched.
  const auto before=fingerprint(restored,resumed);
  auto refuse=[&](const TPWildTeamCheckpoint *input,
                  std::size_t count,std::size_t chosen,unsigned budget){
    assert(!restored.restore(
      resumed,input,count,chosen,nextEnemy,uint8_t(budget)
    ));
    assert(fingerprint(restored,resumed)==before);
  };
  refuse(nullptr,2,0,5);
  refuse(transported.data(),0,0,5);
  refuse(transported.data(),7,0,5);
  refuse(transported.data(),2,2,5);
  refuse(transported.data(),2,0,6);
  auto invalid=transported;
  invalid[1].entry.id=invalid[0].entry.id;
  refuse(invalid.data(),2,0,5);
  invalid=transported;invalid[0].maxHp++;
  refuse(invalid.data(),2,0,5);
  invalid=transported;invalid[0].hp=invalid[0].maxHp+1;
  refuse(invalid.data(),2,0,5);
  invalid=transported;invalid[0].hp=0;
  refuse(invalid.data(),2,0,5);
  invalid=transported;invalid[1].rests=6;
  refuse(invalid.data(),2,0,5);

  saved[0].entry.id=999;active=99;
  assert(!restored.snapshot(resumed,saved.data(),1,active));
  assert(saved[0].entry.id==999&&active==99);
  assert(!restored.snapshot(resumed,nullptr,6,active));
  auto mismatched=resumed;mismatched.player.atk++;
  assert(!restored.snapshot(mismatched,saved.data(),6,active));
  assert(saved[0].entry.id==999&&active==99);

  assert(restored.select(resumed,1,50).accepted);
  assert(resumed.restUsesLeft==3);
  assert(restored.act(resumed,BATTLE_REST,50).accepted);
  assert(resumed.restUsesLeft==2);
  assert(restored.select(resumed,0,50).accepted);
  assert(resumed.restUsesLeft==4);

  // A defeated reserve stays defeated after checkpoint reconstruction.
  const auto strong=stats(5000,5000,200,100);
  assert(team.begin(battle,entries,2,strong,true,5));
  battle.playerHp=1;
  assert(team.act(battle,BATTLE_ATTACK_HEAVY,50).needsSwitch);
  saved[0].entry.id=999;active=99;
  assert(!team.snapshot(battle,saved.data(),6,active));
  assert(saved[0].entry.id==999&&active==99);
  const auto round=battle.round;
  const auto taken=battle.enemyDamageTotal;
  assert(team.select(battle,1,50).accepted);
  assert(battle.round==round&&battle.enemyDamageTotal==taken);
  assert(battle.restUsesLeft==5);
  winCurrent(team,battle);
  assert(team.snapshot(battle,saved.data(),6,active));
  assert(active==1&&saved[0].hp==0);
  assert(restored.restore(resumed,saved.data(),2,active,nextEnemy,5));
  assert(restored.activeId()==101&&restored.hp(0)==0);
  assert(!restored.select(resumed,0,50).accepted);
  assert(resumed.restUsesLeft==5&&resumed.round==0);

  // Only explicitly beginning a new session restores the whole team.
  assert(restored.begin(resumed,entries,2,enemy,true,5));
  assert(restored.hp(0)==restored.maxHp(0));
  assert(restored.hp(1)==restored.maxHp(1));
  assert(resumed.restUsesLeft==5);
  assert(restored.begin(resumed,entries,2,enemy));
  assert(resumed.restUsesLeft==2);

  std::cout<<"P05c league runtime passed: explicit five-heal budget, "
    "individual retention, real codec/checkpoint reconstruction, frozen "
    "stats, no restore attack/heal, fresh opponent/round, fainted reserves, "
    "atomic invalid-restore refusal and unchanged two-heal default. "
    "No live league/store/Hall integration claimed.\n";
}
