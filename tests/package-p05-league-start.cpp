#include <cassert>
#include <ctime>
#include <iostream>
#include "pet.h"

uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}
static Pet hero;
Pet &tp_battle_pet(){return hero;}
extern "C" int tp_is_egg(){return hero.isEgg();}
extern "C" int tp_sleeping(){return hero.sleeping;}
extern "C" int tp_species_id(){return hero.speciesId;}
extern "C" int tp_level(){return hero.level();}

#include "../browser_ver/core/browser_battle.cpp"
#include "../browser_ver/core/browser_league.cpp"
#include "../browser_ver/core/browser_battle_energy.cpp"
#include "../browser_ver/core/browser_league_team.cpp"

namespace L=tp_league_team;
extern "C" uint32_t tp_f4_store_begin();
extern "C" int tp_f4_store_finish(uint32_t,int);

void setup(){
  assert(!tp_lgt_detail::ticket&&!tp_f4_store_pending()&&!undo);
  if(tp_lgt_owned())assert(tp_lgt_abort(tp_lgt_session_region()));
  tp_region_lg_abort(0);tp_region_lg_abort(1);tp_battle_close();
  gWildPromptActive=false;
  Preferences::store().clear();
  Preferences p;
  p.putBool("init",true);p.putShort("dexn",150);p.putShort("eggT2",150);
  p.putUInt("age",5940);p.putUChar("f4lver",1);p.putUInt("f4life",1);
  p.putUChar("mgver",3);
  for(const char *key:{"gatk","gdef","gspe","full","joy","ene","hyg"})
    p.putUChar(key,100);
  for(const char *key:{"agver","jagver"})p.putUChar(key,1);
  for(const char *key:{"agmask","jagmask"})p.putUChar(key,255);
  // Transport fixture only. JS model validity is tested separately.
  Preferences::store()["f4col"]=std::vector<uint8_t>{'I','T','C','1'};
  hero=Pet();hero.begin();hero.setClock(uint32_t(std::time(nullptr)));
}
L::State source(int region){
  L::State s;s.region=uint8_t(region);
  s.care.id=100;s.care.life=1;s.care.age=hero.ageMinutes;
  s.care.dex=uint16_t(hero.speciesId);s.care.shiny=hero.shiny;
  s.care.geneAtk=hero.geneAtk;s.care.geneDef=hero.geneDef;
  s.care.geneSpe=hero.geneSpe;
  for(unsigned i=0;i<3;i++){
    L::Member m;m.id=100+i;m.dex=i?25:150;
    m.stats=wildBattleStats(m.dex,30);m.nick=i?"Box":"Provided care";
    m.maxHp=L::initialMaxHp(m.stats);m.hp=m.maxHp;
    s.members.push_back(m);
  }
  assert(L::valid(s));return s;
}
std::vector<uint8_t> wire(const L::State &s){
  std::vector<uint8_t> b;assert(L::encode(s,b));return b;
}
uint32_t start(int region,const L::State &s,int replace=0){
  const auto b=wire(s);
  return tp_lgt_prepare_start(region,b.data(),int(b.size()),replace);
}
void energy(int value){
  hero.energy=uint8_t(value);Preferences().putUChar("ene",uint8_t(value));
}
L::State saved(int region){
  const auto *keys=tpRegionProgressKeys(uint8_t(region));
  L::State s;
  assert(L::decode(std::get<std::vector<uint8_t>>(
    Preferences::store().at(keys->leagueRun)),region,s));
  return s;
}

void testCombinedLeagueWins(){
  unsigned fights=0;
  for(int region:{0,1}){
    for(int variant=0;variant<(region==0?3:1);variant++){
      setup();
      hero.ageMinutes=1740;
      Preferences().putUInt("age",hero.ageMinutes);
      auto initial=source(region);initial.variant=uint8_t(variant);
      auto entry=start(region,initial);
      assert(entry&&tp_lgt_finish(region,entry,1));
      for(unsigned index=0;index<26;index++){
        auto &battle=const_cast<BattleRuntime&>(
          tp_lgt_detail::session.battle()
        );
        // Synthetic low-HP opponent for transaction coverage, not balance.
        battle.enemyHp=1;battle.enemy.atk=1;battle.enemy.def=1;
        const unsigned selected=index%2;
        if(tp_lgt_detail::session.activeId()!=100+selected)
          assert(tp_lgt_switch(region,int(selected)));
        for(unsigned turn=0;turn<100&&!tp_lgt_detail::session.resolved();turn++)
          assert(tp_lgt_turn(region,BATTLE_ATTACK));
        assert(tp_lgt_detail::session.resolved()&&battle.enemyHp==0);
        const auto readStore=Preferences::store();
        const std::string readView=tp_lgt_view(region);
        assert(readView.find("\"won\":1")!=std::string::npos);
        assert(readView.find("\"active\":"+std::to_string(selected))!=
          std::string::npos);
        assert(Preferences::store()==readStore);

        const auto storeBefore=Preferences::store();
        const auto levelBefore=hero.level();
        const auto hpBefore=battle.playerHp;
        auto result=tp_lgt_win_begin(region);
        assert(result&&tp_f4_store_pending());
        assert(!tp_lgt_turn(region,BATTLE_ATTACK));
        assert(!tp_lgt_win_begin(region));
        assert(!tp_lgt_win_apply(1-region,result));
        assert(!tp_lgt_finish(region,result,1));
        assert(tp_lgt_win_apply(region,result));
        assert(!tp_lgt_win_apply(region,result));
        assert(hero.level()==levelBefore+(selected==0?1:0));
        const int size=tp_lgt_prepared_size(region,result);
        const auto *ptr=tp_lgt_prepared_ptr(region,result);
        assert(size>0&&ptr);
        L::State plan;
        const std::vector<uint8_t> payload(ptr,ptr+size);
        assert(index==25?L::decodeTerminal(payload,region,plan):
          L::decode(payload,region,plan));
        assert(plan.index==index+1&&plan.active==selected);
        assert(plan.members[selected].id==100+selected);
        assert(tp_lgt_finish(region,result,0));
        assert(Preferences::store()==storeBefore&&hero.level()==levelBefore);
        assert(tp_lgt_detail::session.resolved());
        assert(tp_lgt_detail::session.battle().playerHp==hpBefore);

        result=tp_lgt_win_begin(region);
        assert(result&&tp_lgt_win_apply(region,result));
        assert(tp_lgt_finish(region,result,1));
        assert(!tp_lgt_owned()&&!tp_f4_store_pending());
        assert(!tp_lgt_win_apply(region,result));
        fights++;
        if(index<25){
          const auto checkpoint=saved(region);
          assert(checkpoint.index==index+1);
          entry=tp_lgt_prepare_resume(region);
          assert(entry&&tp_lgt_finish(region,entry,1));
          assert(tp_lgt_detail::session.battle().playerHp==
            checkpoint.members[checkpoint.active].hp);
          assert(tp_lgt_detail::session.state().members[0].stats.level==30);
        }else{
          const auto *keys=tpRegionProgressKeys(uint8_t(region));
          assert(!Preferences::store().count(keys->leagueRun));
          assert(Preferences().getBool(keys->leagueDone,false));
          assert(Preferences().getUChar(keys->hallVersion,0)==2);
          const auto &hall=std::get<std::vector<uint8_t>>(
            Preferences::store().at(keys->hallData)
          );
          assert(hall[2]==(region==0?'K':'J'));
          assert(hero.level()==43);
          assert(!tp_lgt_prepare_resume(region));
        }
      }
    }
  }
  std::cout<<"P05c combined native league wins passed: "<<fights
    <<" resolved synthetic-opponent wins, actual care grants, actual "
      "winner IDs, frozen stats, every-win whole-state rollback/retry, "
      "single-application guards, checkpoint carry, final team Hall/title/"
      "run deletion in one transaction and both regions. Collection "
      "level application is covered separately by the JS model test; "
      "not a balancing or browser UI proof.\n";
}

int main(){
  for(int region:{0,1}){
    setup();auto s=source(region);
    energy(69);auto before=Preferences::store();
    assert(!start(region,s)&&Preferences::store()==before&&hero.energy==69);
    energy(100);before=Preferences::store();
    L::State profileProbe;
    bool profileHasRun=false;
    const bool entryQuiet=tp_lgt_detail::quiet(region);
    const bool entryActor=tp_lgt_detail::actor(s);
    const bool entryProfile=tp_lgt_detail::profileSupported(
      region,profileHasRun,profileProbe
    );
    const bool entryHall=tpHallSupportedFor(region);
    const bool entryEnergy=tpEnergyCan(1);
    const int entryCollectionSize=tp_f4_store_size();
    const auto entryLife=tp_lgt_detail::life();

    auto token=start(region,s);
    if(!(token&&hero.energy==50&&tp_lg_owned()&&tp_battle_is_open())){
      std::cerr
        <<"P05c start diagnostic:"
        <<" region="<<region
        <<" token="<<token
        <<" energy="<<unsigned(hero.energy)
        <<" leagueOwned="<<tp_lg_owned()
        <<" battleOpen="<<tp_battle_is_open()
        <<" entryQuiet="<<entryQuiet
        <<" entryActor="<<entryActor
        <<" entryProfile="<<entryProfile
        <<" entryHasRun="<<profileHasRun
        <<" entryHall="<<entryHall
        <<" entryEnergy="<<entryEnergy
        <<" entryCollectionSize="<<entryCollectionSize
        <<" entryLife="<<entryLife
        <<" sourceValid="<<L::valid(s)
        <<" storePending="<<tp_f4_store_pending()
        <<" teamPending="<<tp_lgt_detail::ticket
        <<std::endl;
    }
    assert(token);
    assert(hero.energy==50);
    assert(tp_lg_owned());
    assert(tp_battle_is_open());
    assert(!tp_lgt_detail::session.live());
    assert(tp_region_lg_session_region()==region);
    assert(!tp_f2_can()&&!tp_f4_store_begin());
    assert(!tp_lg_prepare_start(0)&&!tp_region_lg_prepare_start(1,0));
    assert(!tp_lgt_turn(region,BATTLE_ATTACK));
    assert(!tp_lgt_finish(1-region,token,1));
    assert(!tp_lgt_finish(region,token+1,1));
    assert(tp_lgt_finish(region,token,0));
    assert(Preferences::store()==before&&hero.energy==100);
    assert(!tp_lg_owned()&&!tp_f4_store_pending());

    token=start(region,s);
    assert(token&&tp_lgt_finish(region,token,1));
    assert(tp_lgt_detail::session.live()&&hero.energy==50);
    const auto readStore=Preferences::store();
    const std::string readView=tp_lgt_view(region);
    assert(readView.find("\"kind\":\"team\"")!=std::string::npos);
    assert(readView.find("\"count\":3")!=std::string::npos);
    assert(readView.find("\"needsSwitch\":0")!=std::string::npos);
    assert(Preferences::store()==readStore);
    assert(!tp_lgt_finish(region,token,1));
    auto liveState=saved(region);
    assert(liveState.phase==L::IN_PROGRESS);
    assert(liveState.members[0].stats.level==hero.level());
    assert(liveState.members[0].stats.level!=s.members[0].stats.level);
    const auto hp=tp_lgt_detail::session.battle().playerHp;
    assert(!tp_lgt_turn(1-region,BATTLE_ATTACK));
    assert(!tp_lgt_switch(1-region,1)&&!tp_lgt_abort(1-region));
    assert(tp_lgt_detail::session.battle().playerHp==hp);
    tp_region_lg_abort(region);
    assert(tp_lgt_detail::session.live());
    assert(tp_lgt_abort(region));
    before=Preferences::store();
    assert(!tp_lgt_prepare_resume(region)&&Preferences::store()==before);
    assert(!start(region,s)&&Preferences::store()==before);
    energy(100);
    token=start(region,s,1);
    assert(token&&tp_lgt_finish(region,token,0));

    // A committed checkpoint retains the whole party and frozen stats.
    auto checkpoint=liveState;
    checkpoint.phase=L::CHECKPOINT;checkpoint.index=1;checkpoint.active=1;
    checkpoint.members[0].hp=0;checkpoint.members[0].rests=0;
    checkpoint.members[1].wins=1;checkpoint.members[1].levelGains=1;
    checkpoint.members[1].hp/=2;checkpoint.members[1].rests=2;
    const auto *keys=tpRegionProgressKeys(uint8_t(region));
    Preferences::store()[keys->leagueRun]=wire(checkpoint);
    before=Preferences::store();
    token=tp_lgt_prepare_resume(region);
    assert(token&&hero.energy==100);
    assert(tp_lgt_finish(region,token,0)&&Preferences::store()==before);
    token=tp_lgt_prepare_resume(region);
    assert(token&&tp_lgt_finish(region,token,1));
    assert(tp_lgt_detail::session.activeId()==101);
    assert(tp_lgt_detail::session.battle().playerHp==checkpoint.members[1].hp);
    assert(tp_lgt_detail::session.battle().restUsesLeft==2);
    assert(!tp_lgt_switch(region,0));
    assert(tp_lgt_abort(region));

    checkpoint.index=20;checkpoint.members[1].wins=20;
    checkpoint.members[1].levelGains=20;
    Preferences::store()[keys->leagueRun]=wire(checkpoint);
    energy(49);before=Preferences::store();
    assert(!tp_lgt_prepare_resume(region)&&Preferences::store()==before);
    energy(50);before=Preferences::store();
    token=tp_lgt_prepare_resume(region);
    assert(token&&hero.energy==20);
    assert(tp_lgt_finish(region,token,0));
    assert(hero.energy==50&&Preferences::store()==before);
    token=tp_lgt_prepare_resume(region);
    assert(token&&tp_lgt_finish(region,token,1)&&hero.energy==20);
    assert(tp_lgt_abort(region));
    before=Preferences::store();
    assert(!tp_lgt_prepare_resume(region)&&Preferences::store()==before);

    // Preserve unknown format data rather than replacing it.
    auto future=wire(checkpoint);future[3]=2;
    const auto crc=L::checksum(future,future.size()-4);
    for(unsigned i=0;i<4;i++)
      future[future.size()-4+i]=uint8_t(crc>>(8*i));
    Preferences::store()[keys->leagueRun]=future;
    energy(100);before=Preferences::store();
    assert(!start(region,s,1)&&!tp_lgt_prepare_resume(region));
    assert(Preferences::store()==before);

    Preferences::store()[keys->leagueRun]=wire(checkpoint);
    Preferences().putUInt("f4life",2);before=Preferences::store();
    assert(!tp_lgt_prepare_resume(region)&&Preferences::store()==before);
  }

  // Existing single-player checkpoints cannot be replaced by the new API.
  setup();
  auto old=tp_lg_prepare_start(0);
  assert(old&&tp_lg_finish(old,1));
  run.enemyHp=0;resolved=won=true;
  old=tp_lg_prepare_win();
  assert(old&&tp_lg_finish(old,1));
  const auto before=Preferences::store();
  assert(!start(0,source(0),1)&&Preferences::store()==before);

  setup();
  const auto collectionToken=tp_f4_store_begin();
  assert(collectionToken);
  const auto busyStore=Preferences::store();
  assert(!start(0,source(0))&&Preferences::store()==busyStore);
  assert(tp_f4_store_finish(collectionToken,0));

  testCombinedLeagueWins();
  std::cout<<"P05c native team league start passed: shared whole-Pet/store "
    "rollback, 50/30 energy gates, post-save-only launch, global league "
    "ownership and region/token guards, native care-stat freezing, real "
    "team checkpoint resume, retained HP/rests/fainted reserves, interrupted "
    "run refusal, explicit team replacement, legacy/future preservation "
    "and stale-care refusal. Collection JSON is a transport fixture; no "
    "browser ownership, win rewards, Hall or playable UI claimed.\n";
}
