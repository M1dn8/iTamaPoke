// P05c paid team-run entry/resume. Browser ownership/model validation required.
// Uses the existing whole-Pet/Preferences collection transaction.
// No win reward, collection mutation or Hall completion entry point yet.
#include <emscripten.h>
#include <ctime>
#include <memory>
#include <vector>
#include "pet.h"
#include "region-progress-keys.h"
#include "league-hall.h"
#include "battle-energy.h"
#include "league-team-session.h"

extern Pet &tp_battle_pet();
extern "C" {
int tp_battle_is_open();
int tp_wild_prompt_active();
int tp_f4_store_size();
int tp_f4_store_pending();
uint32_t tp_f4_store_begin();
uint32_t tp_f4_store_begin_league_result_context();
int tp_f4_store_finish(uint32_t,int);
}

namespace tp_lgt_detail {
namespace L=tp_league_team;
L::Session session;
std::unique_ptr<L::Session> prepared;
uint32_t ticket=0;
int owner=-1,pendingRegion=-1;
int operation=0; // 1 entry, 2 result
uint32_t winToken=0;
bool winAttempted=false,winApplied=false;
std::vector<uint8_t> preparedBytes;
uint32_t battleSerial=0;
uint16_t lastDealt=0,lastTaken=0,lastHeal=0;
BattleTurnResult lastTurn{};

const TPRegionProgressKeys *keys(int region){
  return region>=0&&region<=1?
    tpRegionProgressKeys(uint8_t(region)):nullptr;
}
bool integer(const char *key,int64_t &out){
  const auto &store=Preferences::store();
  const auto it=store.find(key);
  if(it==store.end()||!std::holds_alternative<int64_t>(it->second))
    return false;
  out=std::get<int64_t>(it->second);return true;
}
uint32_t life(){
  int64_t version=0,value=0;
  return integer("f4lver",version)&&version==1&&
    integer("f4life",value)&&value>0&&value<=0x7fffffff?
    uint32_t(value):0;
}
bool actor(const L::State &state){
  const auto &p=tp_battle_pet();
  const auto &c=state.care;
  return !p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&
    !p.evolving()&&life()==c.life&&p.ageMinutes>=c.age&&
    p.speciesId==int(c.dex)&&p.shiny==c.shiny&&
    p.geneAtk==c.geneAtk&&p.geneDef==c.geneDef&&p.geneSpe==c.geneSpe;
}
bool unlocked(const TPRegionProgressKeys &k){
  int64_t version=0,mask=0;
  return integer(k.arenaVersion,version)&&version==1&&
    integer(k.arenaMask,mask)&&mask==255;
}

// Missing profile is allowed; partial/future/legacy-run profiles are not.
// Existing 88-byte single-player runs remain entirely on the old path.
bool profileSupported(int region,bool &has,L::State &saved){
  const auto *k=keys(region);
  if(!k)return false;
  const auto &store=Preferences::store();
  has=false;
  if(!store.count(k->leagueVersion))
    return !store.count(k->leagueRun)&&!store.count(k->leagueDone)&&
      !store.count(k->leagueDate);
  int64_t version=0,date=0;
  const auto done=store.find(k->leagueDone);
  if(!integer(k->leagueVersion,version)||version!=1||
     !integer(k->leagueDate,date)||date<0||date>0xffffffffLL||
     done==store.end()||!std::holds_alternative<bool>(done->second)||
     (!std::get<bool>(done->second)&&date!=0))return false;
  const auto run=store.find(k->leagueRun);
  if(run==store.end())return true;
  if(!std::holds_alternative<std::vector<uint8_t>>(run->second)||
     !L::decode(std::get<std::vector<uint8_t>>(run->second),region,saved))
    return false;
  has=true;return true;
}
bool quiet(int region){
  const auto *k=keys(region);
  const auto &p=tp_battle_pet();
  return k&&!ticket&&!prepared&&!session.live()&&
    !tp_battle_is_open()&&!tp_wild_prompt_active()&&
    !tp_f4_store_pending()&&tp_f4_store_size()>0&&
    !p.isEgg()&&!p.sleeping&&p.ceremony==CER_NONE&&
    !p.evolving()&&life()&&unlocked(*k)&&tpHallSupportedFor(region);
}
void ensureProfile(int region){
  const auto &k=*keys(region);
  Preferences p;p.putUChar(k.leagueVersion,1);
  if(!Preferences::store().count(k.leagueDone))
    p.putBool(k.leagueDone,false);
  if(!Preferences::store().count(k.leagueDate))
    p.putUInt(k.leagueDate,0);
}
void freezeCare(L::State &state){
  auto &p=tp_battle_pet();
  const auto now=uint32_t(std::time(nullptr));
  p.megaUpdate(now);
  for(auto &m:state.members){
    if(m.id!=state.care.id)continue;
    BattleStats s{};
    s.level=p.level();s.atk=p.megaAtk(now);
    s.def=p.megaDef(now);s.spe=p.megaSpe(now);
    s.mega=p.megaActive(now);
    const auto *form=tpMegaByDex(p.speciesId);
    s.type1=s.mega&&form?form->type1:DEX_TBL[p.speciesId].type1;
    s.type2=s.mega&&form?form->type2:DEX_TBL[p.speciesId].type2;
    m.stats=s;m.form=s.mega?p.megaFormId():0;
    m.nick=p.nick;m.shiny=p.shiny;
    m.maxHp=L::initialMaxHp(s);m.hp=m.maxHp;
  }
}
uint32_t stage(int region,L::State state,bool fresh){
  const auto token=tp_f4_store_begin();
  if(!token)return 0;

  auto next=std::make_unique<L::Session>();
  if(fresh)freezeCare(state);
  const bool opened=fresh?next->start(state):next->resume(state);
  if(!opened||
     (fresh&&!tpEnergySpend(1))||
     (!fresh&&state.index==20&&!tpEnergySpend(2))){
    tp_f4_store_finish(token,0);return 0;
  }
  std::vector<uint8_t> encoded;
  if(!L::encode(next->state(),encoded)){
    tp_f4_store_finish(token,0);return 0;
  }
  ensureProfile(region);
  preparedBytes=encoded;
  Preferences::store()[keys(region)->leagueRun]=std::move(encoded);
  prepared=std::move(next);
  ticket=token;pendingRegion=region;operation=1;
  return token;
}
uint32_t start(int region,const uint8_t *data,int length,int replace){
  if((replace!=0&&replace!=1)||!quiet(region)||!data||
     length<1||length>int(L::MAX_BYTES))return 0;
  L::State state,old;bool has=false;
  if(!profileSupported(region,has,old)||(has&&!replace)||
     !L::decode(std::vector<uint8_t>(data,data+length),region,state)||
     state.phase!=L::IN_PROGRESS||state.index!=0||
     !actor(state)||!tpEnergyCan(1))return 0;
  // Source must be genuinely fresh before native care-stat replacement.
  for(const auto &m:state.members)
    if(m.hp!=m.maxHp||m.rests!=5)return 0;
  return stage(region,std::move(state),true);
}
uint32_t resume(int region){
  if(!quiet(region))return 0;
  L::State state;bool has=false;
  if(!profileSupported(region,has,state)||!has||
     state.phase!=L::CHECKPOINT||!actor(state)||
     (state.index==20&&!tpEnergyCan(2)))return 0;
  return stage(region,std::move(state),false);
}
bool winEligible(int region){
  if(region!=owner||!session.live()||!session.resolved()||
     session.pending()||!actor(session.state())||
     !tpHallSupportedFor(region))return false;
  L::State current,combat;
  bool has=false;
  if(!profileSupported(region,has,current)||!has||
     current.phase!=L::IN_PROGRESS||!session.capture(combat))return false;
  std::vector<uint8_t> persisted,expected;
  return L::encode(current,persisted)&&
    L::encode(session.state(),expected)&&persisted==expected;
}
uint32_t beginWin(int region){
  if(ticket||prepared||tp_f4_store_pending()||!winEligible(region))
    return 0;
  const auto token=tp_f4_store_begin_league_result_context();
  if(!token)return 0;
  ticket=token;pendingRegion=region;operation=2;
  winToken=0;winAttempted=winApplied=false;preparedBytes.clear();
  return token;
}
int applyWin(int region,uint32_t token){
  if(!ticket||ticket!=token||pendingRegion!=region||operation!=2||
     winAttempted||!winEligible(region))return 0;
  winAttempted=true;
  uint32_t date=0;
  if(session.state().index==25){
    const auto clock=std::time(nullptr);
    if(clock<946684800||uint64_t(clock)>0xffffffffULL)return 0;
    date=uint32_t(clock);
  }
  auto &pet=tp_battle_pet();
  bool granted=false;
  if(session.activeId()==session.state().care.id&&pet.level()<100){
    if(!pet.grantBattleLevel())return 0;
    granted=true;
  }
  L::WinPlan plan;
  winToken=session.prepareWin(plan,granted);
  if(!winToken)return 0;

  const bool encoded=plan.final?
    L::encodeTerminal(plan.next,preparedBytes):
    L::encode(plan.next,preparedBytes);
  if(!encoded)return 0;
  const auto &k=*keys(region);
  if(plan.final){
    if(!tpHallStageTeamWinFor(region,plan.next,date))return 0;
    auto &store=Preferences::store();
    const auto done=store.find(k.leagueDone);
    if(done==store.end()||!std::holds_alternative<bool>(done->second))
      return 0;
    if(!std::get<bool>(done->second)){
      Preferences p;p.putBool(k.leagueDone,true);p.putUInt(k.leagueDate,date);
    }
    store.erase(k.leagueRun);
  }else{
    Preferences::store()[k.leagueRun]=preparedBytes;
  }
  winApplied=true;return 1;
}
int finish(int region,uint32_t token,int commit){
  if(!ticket||ticket!=token||region!=pendingRegion||
     (commit!=0&&commit!=1)||
     (operation==1&&!prepared)||
     (operation==2&&commit&&!winApplied)||
     (operation!=1&&operation!=2))return 0;
  if(!tp_f4_store_finish(token,commit))return 0;
  if(operation==1){
    if(commit){
      session=std::move(*prepared);owner=region;
      if(++battleSerial==0)++battleSerial;
      lastDealt=lastTaken=lastHeal=0;lastTurn={};
    }
  }else{
    if(winToken&&!session.finishWin(winToken,commit!=0))return 0;
    if(commit)owner=-1;
  }
  prepared.reset();preparedBytes.clear();
  ticket=0;pendingRegion=-1;operation=0;winToken=0;
  winAttempted=winApplied=false;
  return 1;
}
bool canAct(int region){
  if(ticket||!session.live()||owner!=region)return false;
  if(!actor(session.state())){
    session.abort();owner=-1;return false;
  }
  return true;
}
int runSize(int region,uint32_t token){
  if(token){
    if(ticket!=token||pendingRegion!=region||
       (operation==1?!prepared:!winApplied))return -1;
    return int(preparedBytes.size());
  }else if(ticket){
    return -1;
  }
  L::State saved;bool has=false;
  if(!profileSupported(region,has,saved))return -1;
  if(!has)return 0;
  return int(std::get<std::vector<uint8_t>>(
    Preferences::store().at(keys(region)->leagueRun)
  ).size());
}
const uint8_t *runPtr(int region,uint32_t token){
  if(runSize(region,token)<=0)return nullptr;
  if(token)return preparedBytes.data();
  return std::get<std::vector<uint8_t>>(
    Preferences::store().at(keys(region)->leagueRun)
  ).data();
}
std::string jsonQuote(const std::string &value){
  std::string out="\"";
  for(unsigned char c:value){
    if(c=='"'||c=='\\'){out+='\\';out+=char(c);}
    else if(c<32){
      const char *hex="0123456789abcdef";
      out+="\\u00";out+=hex[c>>4];out+=hex[c&15];
    }else out+=char(c);
  }
  return out+'"';
}
const char *view(int region){
  static std::string out;
  const auto *k=keys(region);
  if(!k){
    out="{\"kind\":\"unsupported\",\"supported\":0}";
    return out.c_str();
  }
  const bool own=session.live()&&owner==region;
  const bool pending=ticket&&pendingRegion==region;
  const auto &store=Preferences::store();
  const auto old=store.find(k->leagueRun);
  if(!own&&!pending&&old!=store.end()&&
     std::holds_alternative<std::vector<uint8_t>>(old->second)&&
     std::get<std::vector<uint8_t>>(old->second).size()==88){
    out="{\"kind\":\"legacy\"}";return out.c_str();
  }

  L::State saved;
  bool has=false;
  const bool validProfile=profileSupported(region,has,saved);
  const bool supported=validProfile&&tpHallSupportedFor(region);
  const L::State state=own?session.state():has?saved:L::State{};
  const size_t count=own||has?state.members.size():0;
  const size_t active=count?(own?session.activeIndex():state.active):0;
  const L::Member *member=count?&state.members[active]:nullptr;
  const uint8_t index=count?state.index:0;
  const uint8_t variant=count?state.variant:0;
  const TPLeagueMon *enemy=region==0?
    (variant<3&&index<26?&kLeagueTeams[variant][index]:nullptr):
    (variant==0?tpJohtoLeagueMonAt(index):nullptr);
  int64_t date=0;
  if(validProfile)integer(k->leagueDate,date);
  const auto done=store.find(k->leagueDone);
  const bool completed=validProfile&&done!=store.end()&&
    std::holds_alternative<bool>(done->second)&&std::get<bool>(done->second);

  out="{\"kind\":"+jsonQuote(own||has?"team":supported?"empty":"unsupported");
  auto number=[&](const char *name,int64_t value){
    out+=",\""+std::string(name)+"\":"+std::to_string(value);
  };
  number("region",region);number("supported",supported);
  number("unlocked",unlocked(*k));number("done",completed);number("date",date);
  number("state",own?L::IN_PROGRESS:has?state.phase:0);
  number("live",own);number("pending",pending);
  number("actor",count&&actor(state));
  number("variant",variant);number("index",index);
  number("resolved",own&&session.resolved());
  number("won",own&&session.won());
  number("battleId",own?battleSerial:0);
  number("active",active);number("count",count);
  number("needsSwitch",own&&session.needsSwitch());
  number("hp",own?session.battle().playerHp:member?member->hp:0);
  number("maxHp",own?session.battle().playerMaxHp:member?member->maxHp:0);
  number("rests",own?session.battle().restUsesLeft:member?member->rests:5);
  number("enemyHp",own?session.battle().enemyHp:0);
  number("enemyMaxHp",own?session.battle().enemyMaxHp:0);
  number("dex",enemy?enemy->dex:0);number("level",enemy?enemy->level:0);
  number("playerDex",member?member->dex:tp_battle_pet().speciesId);
  number("playerLevel",member?member->stats.level:0);
  number("shiny",member&&member->shiny);number("form",member?member->form:0);
  number("atk",member?member->stats.atk:0);
  number("def",member?member->stats.def:0);
  number("spe",member?member->stats.spe:0);
  number("type1",member?member->stats.type1:0);
  number("type2",member?member->stats.type2:0);
  number("round",own?session.battle().round:0);
  number("dealt",own?lastDealt:0);number("taken",own?lastTaken:0);
  number("heal",own?lastHeal:0);
  out+=",\"nick\":"+jsonQuote(member?member->nick:"");
  const char *note=!own?"":lastTurn.restFailed?"Keine Heilung":
    lastTurn.counterReady?"Konter bereit":
    lastTurn.enemyDodged?"Gegner ausgewichen":
    lastTurn.playerDodged?"Ausgewichen":"";
  out+=",\"note\":"+jsonQuote(note)+",\"members\":[";
  for(size_t i=0;i<count;i++){
    if(i)out+=",";
    const auto &m=state.members[i];
    out+="{\"id\":"+std::to_string(m.id)+
      ",\"dex\":"+std::to_string(m.dex)+
      ",\"level\":"+std::to_string(m.stats.level)+
      ",\"nick\":"+jsonQuote(m.nick)+
      ",\"shiny\":"+(m.shiny?"true":"false")+
      ",\"form\":"+std::to_string(m.form)+
      ",\"hp\":"+std::to_string(own?session.memberHp(i):m.hp)+
      ",\"maxHp\":"+std::to_string(m.maxHp)+
      ",\"rests\":"+std::to_string(own?session.memberRests(i):m.rests)+
      ",\"wins\":"+std::to_string(m.wins)+
      ",\"levelGains\":"+std::to_string(m.levelGains)+"}";
  }
  out+="]}";return out.c_str();
}
} // namespace tp_lgt_detail

extern "C" {
EMSCRIPTEN_KEEPALIVE int tp_lgt_saved_size(int region){
  return tp_lgt_detail::runSize(region,0);
}
EMSCRIPTEN_KEEPALIVE const uint8_t *tp_lgt_saved_ptr(int region){
  return tp_lgt_detail::runPtr(region,0);
}
EMSCRIPTEN_KEEPALIVE int tp_lgt_prepared_size(int region,uint32_t token){
  return token?tp_lgt_detail::runSize(region,token):-1;
}
EMSCRIPTEN_KEEPALIVE const uint8_t *tp_lgt_prepared_ptr(
    int region,uint32_t token){
  return token?tp_lgt_detail::runPtr(region,token):nullptr;
}
// Internal eligibility pairing for the whole-state result checkpoint.
int tp_lgt_can_result_begin(){
  return !tp_lgt_detail::ticket&&
    tp_lgt_detail::winEligible(tp_lgt_detail::owner);
}
EMSCRIPTEN_KEEPALIVE uint32_t tp_lgt_win_begin(int region){
  return tp_lgt_detail::beginWin(region);
}
EMSCRIPTEN_KEEPALIVE int tp_lgt_win_apply(int region,uint32_t token){
  return tp_lgt_detail::applyWin(region,token);
}
EMSCRIPTEN_KEEPALIVE const char *tp_lgt_view(int region){
  return tp_lgt_detail::view(region);
}
EMSCRIPTEN_KEEPALIVE int tp_lgt_owned(){
  return tp_lgt_detail::ticket||tp_lgt_detail::session.live();
}
EMSCRIPTEN_KEEPALIVE int tp_lgt_session_region(){
  return tp_lgt_detail::ticket?tp_lgt_detail::pendingRegion:
    tp_lgt_detail::session.live()?tp_lgt_detail::owner:-1;
}
EMSCRIPTEN_KEEPALIVE uint32_t tp_lgt_prepare_start(
    int region,const uint8_t *data,int length,int replace){
  return tp_lgt_detail::start(region,data,length,replace);
}
EMSCRIPTEN_KEEPALIVE uint32_t tp_lgt_prepare_resume(int region){
  return tp_lgt_detail::resume(region);
}
EMSCRIPTEN_KEEPALIVE int tp_lgt_finish(int region,uint32_t token,int commit){
  return tp_lgt_detail::finish(region,token,commit);
}
EMSCRIPTEN_KEEPALIVE int tp_lgt_turn(int region,int action){
  if(action<int(BATTLE_ATTACK)||action>int(BATTLE_REST)||
     !tp_lgt_detail::canAct(region))return 0;
  auto &current=tp_lgt_detail::session;
  const auto dealt=current.battle().playerDamageTotal;
  const auto taken=current.battle().enemyDamageTotal;
  const auto result=current.act(
    BattleAction(action),uint8_t(std::rand()%100)
  );
  if(!result.accepted)return 0;
  tp_lgt_detail::lastTurn=result.turn;
  tp_lgt_detail::lastDealt=
    uint16_t(current.battle().playerDamageTotal-dealt);
  tp_lgt_detail::lastTaken=
    uint16_t(current.battle().enemyDamageTotal-taken);
  tp_lgt_detail::lastHeal=result.turn.playerHeal;
  return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_lgt_switch(int region,int index){
  if(index<0||index>5||!tp_lgt_detail::canAct(region))return 0;
  auto &current=tp_lgt_detail::session;
  const auto dealt=current.battle().playerDamageTotal;
  const auto taken=current.battle().enemyDamageTotal;
  const auto result=current.select(
    size_t(index),uint8_t(std::rand()%100)
  );
  if(!result.accepted)return 0;
  tp_lgt_detail::lastTurn=result.turn;
  tp_lgt_detail::lastDealt=
    uint16_t(current.battle().playerDamageTotal-dealt);
  tp_lgt_detail::lastTaken=
    uint16_t(current.battle().enemyDamageTotal-taken);
  tp_lgt_detail::lastHeal=0;
  return 1;
}
EMSCRIPTEN_KEEPALIVE int tp_lgt_abort(int region){
  using namespace tp_lgt_detail;
  if(ticket||owner!=region||!session.live())return 0;
  if(!session.abort())return 0;
  owner=-1;return 1;
}
}
