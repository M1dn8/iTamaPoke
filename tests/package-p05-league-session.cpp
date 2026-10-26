#include <cassert>
#include <iostream>
#include <vector>
#include "league-team-session.h"

namespace L=tp_league_team;

L::State fresh(unsigned region=0,unsigned variant=0,unsigned count=3){
  L::State s;
  s.region=uint8_t(region);s.variant=uint8_t(variant);
  s.care.id=100;s.care.life=1;s.care.age=540;s.care.dex=150;
  s.care.geneAtk=s.care.geneDef=s.care.geneSpe=100;
  for(unsigned i=0;i<count;i++){
    L::Member m;
    m.id=101+i;m.dex=25;m.nick=i?"Reserve":"Starter";
    m.stats.level=99;
    m.stats.atk=m.stats.def=m.stats.spe=60000;
    m.stats.type1=1;
    m.maxHp=L::initialMaxHp(m.stats);m.hp=m.maxHp;
    s.members.push_back(m);
  }
  assert(L::valid(s));
  return s;
}

std::vector<uint8_t> wire(const L::State &s){
  std::vector<uint8_t> out;
  assert(L::encode(s,out));
  return out;
}

void win(L::Session &session){
  for(unsigned i=0;i<200&&!session.resolved();i++){
    const auto turn=session.act(BATTLE_ATTACK,uint8_t(i%100));
    assert(turn.accepted);
    assert(!turn.needsSwitch);
  }
  assert(session.resolved());
}

int main(){
  unsigned fights=0;
  for(unsigned region=0;region<2;region++){
    for(unsigned variant=0;variant<(region==0?3u:1u);variant++){
      L::Session session;
      assert(session.start(fresh(region,variant)));
      for(unsigned index=0;index<26;index++){
        const auto *enemy=region==0?&kLeagueTeams[variant][index]:
          tpJohtoLeagueMonAt(index);
        const auto expected=beginBattleRuntime(
          session.state().members[0].stats,
          wildBattleStats(enemy->dex,enemy->level)
        );
        assert(session.battle().enemyMaxHp==expected.enemyMaxHp);
        assert(session.battle().enemy.level==enemy->level);
        assert(session.battle().round==expected.round);
        assert(!session.battle().counterReady);
        assert(session.state().members[0].stats.level==99);

        L::WinPlan untouched;
        untouched.winnerId=999;
        assert(!session.prepareWin(untouched));
        assert(untouched.winnerId==999);
        win(session);
        fights++;

        L::State before;
        assert(session.capture(before));
        const auto beforeBytes=wire(before);
        const auto hp=session.battle().playerHp;
        const auto round=session.battle().round;

        L::WinPlan plan;
        auto token=session.prepareWin(plan);
        assert(token&&session.pending());
        assert(plan.winnerId==101);
        assert(plan.next.index==index+1);
        assert(plan.next.members[0].wins==index+1);
        assert(plan.next.members[0].levelGains==1);
        assert(plan.boxLevelDelta==(index==0?1:0));
        assert(!plan.careLevelGranted);
        assert(plan.final==(index==25));
        assert(!session.act(BATTLE_ATTACK,0).accepted);
        assert(!session.select(1,0).accepted);
        assert(!session.abort());
        assert(!session.finishWin(token+1,true));
        assert(session.pending());
        assert(session.finishWin(token,false));
        assert(!session.pending()&&session.live());
        assert(session.battle().playerHp==hp);
        assert(session.battle().round==round);
        L::State after;
        assert(session.capture(after));
        assert(wire(after)==beforeBytes);
        assert(!session.finishWin(token,true));

        L::WinPlan retry;
        const auto retryToken=session.prepareWin(retry);
        assert(retryToken&&retryToken!=token);
        assert(retry.winnerId==plan.winnerId);
        assert(retry.next.members[0].wins==plan.next.members[0].wins);
        assert(session.finishWin(retryToken,true));
        assert(!session.live()&&!session.pending());

        if(index<25){
          const auto bytes=wire(retry.next);
          L::State decoded;
          assert(L::decode(bytes,int(region),decoded));
          assert(session.resume(decoded));
          assert(session.battle().playerHp==retry.next.members[0].hp);
          assert(session.battle().restUsesLeft==5);
        }else{
          assert(!L::valid(retry.next));
          std::vector<uint8_t> output={9,8,7};
          assert(!L::encode(retry.next,output));
          assert((output==std::vector<uint8_t>{9,8,7}));
          assert(!session.resume(retry.next));
        }
      }
    }
  }

  // Preserve damaged members and spent rests on a real checkpoint.
  auto saved=fresh();
  saved.phase=L::CHECKPOINT;saved.index=1;saved.active=2;
  saved.members[0].wins=1;saved.members[0].levelGains=1;
  saved.members[0].hp/=2;saved.members[0].rests=2;
  saved.members[1].hp=0;saved.members[1].rests=0;
  saved.members[2].hp/=3;saved.members[2].rests=1;
  const auto bytes=wire(saved);
  L::State decoded;
  assert(L::decode(bytes,0,decoded));
  L::Session restored;
  assert(restored.resume(decoded));
  assert(restored.activeId()==103);
  assert(restored.battle().playerHp==saved.members[2].hp);
  assert(restored.battle().restUsesLeft==1);
  assert(!restored.select(1,0).accepted);
  L::State captured;
  assert(restored.capture(captured));
  assert(captured.members[0].hp==saved.members[0].hp);
  assert(captured.members[1].hp==0);
  assert(captured.members[1].rests==0);
  assert(captured.members[2].rests==1);
  assert(restored.select(0,0).accepted);
  assert(restored.activeId()==101);
  assert(restored.battle().restUsesLeft==2);

  // Invalid/reentrant opens do not change an existing session.
  const auto previousHp=restored.battle().playerHp;
  const auto previousId=restored.activeId();
  assert(!restored.start(fresh()));
  assert(!restored.resume(decoded));
  assert(restored.battle().playerHp==previousHp);
  assert(restored.activeId()==previousId);
  assert(restored.abort());
  auto invalid=fresh();invalid.members[0].rests=4;
  assert(!restored.start(invalid));
  assert(!restored.live());
  assert(!restored.resume(fresh()));
  auto unknown=fresh();unknown.region=2;
  assert(!restored.start(unknown));

  // A care winner records a gain only when the adapter reports one.
  for(bool grant:{false,true}){
    auto care=fresh(0,0,1);
    care.members[0].id=care.care.id;
    care.members[0].dex=care.care.dex;
    L::Session session;
    assert(session.start(care));win(session);
    L::WinPlan plan;
    const auto token=session.prepareWin(plan,grant);
    assert(token&&plan.careLevelGranted==grant);
    assert(plan.next.members[0].levelGains==unsigned(grant));
    assert(plan.boxLevelDelta==0);
    assert(session.finishWin(token,true));
  }

  // No care reward may be attributed to a boxed winner.
  {
    L::Session session;
    assert(session.start(fresh()));win(session);
    L::WinPlan plan;plan.winnerId=777;
    assert(!session.prepareWin(plan,true));
    assert(plan.winnerId==777&&!session.pending());
  }

  std::cout<<"P05c native league session passed: "<<fights
   <<" catalog fights across Kanto variants and Johto, real checkpoint "
     "reconstruction, frozen stats, retained HP/rests/fainted reserves, "
     "actual winner accounting, deferred level caps, prepared-win action "
     "lock, stale-token refusal, rollback/retry and non-encodable final "
     "history. No Preferences, ownership, reward application, Hall or "
     "live browser integration claimed.\n";
}
