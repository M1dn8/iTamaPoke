#pragma once
#include <algorithm>
#include <cstdint>
#include <string>
#include <vector>
#include "battle.h"
#include "dex.h"

// P05c codec only. No Preferences access and no migration of legacy runs.
namespace tp_league_team {

constexpr uint8_t VERSION=1;
constexpr size_t MAX_BYTES=1024;
constexpr uint8_t CHECKPOINT=1;
constexpr uint8_t IN_PROGRESS=2;

struct CareBinding {
  uint32_t id=0,life=0,age=0;
  uint16_t dex=0;
  uint8_t geneAtk=0,geneDef=0,geneSpe=0;
  bool shiny=false;
};

struct Member {
  uint32_t id=0;
  uint16_t dex=0;
  BattleStats stats{};
  std::string nick;
  bool shiny=false;
  uint8_t form=0;
  uint16_t hp=0,maxHp=0;
  uint8_t rests=5,wins=0,levelGains=0;
};

struct State {
  uint8_t region=0,phase=IN_PROGRESS,variant=0,index=0,active=0;
  CareBinding care{};
  std::vector<Member> members;
};

inline bool validId(uint32_t id){
  return id>0&&id<0xffffffffu;
}

inline bool utf8Name(const std::string &s){
  if(s.size()>23)return false;
  size_t at=0;
  while(at<s.size()){
    uint32_t c=static_cast<unsigned char>(s[at++]);
    if(c<32||c==127)return false;
    if(c<128)continue;
    unsigned extra=0;
    uint32_t value=0,minimum=0;
    if(c>=194&&c<=223){extra=1;value=c&31;minimum=128;}
    else if(c>=224&&c<=239){extra=2;value=c&15;minimum=2048;}
    else if(c>=240&&c<=244){extra=3;value=c&7;minimum=65536;}
    else return false;
    if(extra>s.size()-at)return false;
    while(extra--){
      const auto next=static_cast<unsigned char>(s[at++]);
      if((next&192)!=128)return false;
      value=(value<<6)|(next&63);
    }
    if(value<minimum||value>0x10ffff||
       (value>=0xd800&&value<=0xdfff))return false;
  }
  return true;
}

inline uint16_t initialMaxHp(const BattleStats &stats){
  BattleStats enemy{};
  enemy.level=1;enemy.atk=enemy.def=enemy.spe=1;enemy.type1=1;
  return beginBattleRuntime(stats,enemy).playerMaxHp;
}

inline bool validState(const State &s,bool terminal){
  if(s.region>1||(s.phase!=CHECKPOINT&&s.phase!=IN_PROGRESS)||
     s.variant>(s.region==0?2:0)||(terminal?s.index!=26:s.index>25)||
     (terminal&&s.phase!=CHECKPOINT)||
     (s.phase==CHECKPOINT&&s.index==0)||
     s.members.empty()||s.members.size()>6||
     s.active>=s.members.size()||
     !validId(s.care.id)||!s.care.life||s.care.life>0x7fffffff||
     !s.care.dex||s.care.dex>DEX_COUNT)return false;

  unsigned wins=0;
  for(size_t i=0;i<s.members.size();i++){
    const auto &m=s.members[i];
    const auto &p=m.stats;
    if(!validId(m.id)||!m.dex||m.dex>DEX_COUNT||
       p.hp!=0||!p.level||p.level>100||
       !p.atk||!p.def||!p.spe||
       !p.type1||p.type1>18||p.type2>18||
       m.form>3||p.mega!=(m.form>0)||
       !utf8Name(m.nick)||!m.maxHp||
       m.maxHp!=initialMaxHp(p)||m.hp>m.maxHp||
       m.rests>5||m.wins>26||
       m.levelGains>std::min(unsigned(m.wins),100u-p.level))
      return false;

    if(m.id==s.care.id){
      if(m.dex!=s.care.dex||m.shiny!=s.care.shiny)return false;
    }else if(m.levelGains!=std::min(unsigned(m.wins),100u-p.level)){
      return false;
    }

    for(size_t j=0;j<i;j++)
      if(s.members[j].id==m.id)return false;
    wins+=m.wins;
  }

  // A saved run points to the next/current opponent. Prior wins are committed.
  return wins==s.index&&s.members[s.active].hp>0;
}

inline bool valid(const State &s){return validState(s,false);}
inline bool validTerminal(const State &s){return validState(s,true);}

inline uint32_t checksum(const std::vector<uint8_t> &bytes,size_t count){
  uint32_t value=2166136261u;
  for(size_t i=0;i<count;i++){
    value^=bytes[i];
    value*=16777619u;
  }
  return value;
}

inline void put16(std::vector<uint8_t> &out,uint16_t value){
  out.push_back(uint8_t(value));
  out.push_back(uint8_t(value>>8));
}
inline void put32(std::vector<uint8_t> &out,uint32_t value){
  for(unsigned i=0;i<4;i++)out.push_back(uint8_t(value>>(8*i)));
}

inline bool encodeWire(const State &s,std::vector<uint8_t> &out,bool terminal){
  if(!validState(s,terminal))return false;
  std::vector<uint8_t> bytes={
    'L','T',uint8_t(s.region==0?'K':'J'),VERSION,
    s.phase,s.variant,s.index,s.active,uint8_t(s.members.size())
  };
  put32(bytes,s.care.id);
  put32(bytes,s.care.life);
  put32(bytes,s.care.age);
  put16(bytes,s.care.dex);
  bytes.insert(bytes.end(),{
    s.care.geneAtk,s.care.geneDef,s.care.geneSpe,
    uint8_t(s.care.shiny)
  });

  for(const auto &m:s.members){
    put32(bytes,m.id);put16(bytes,m.dex);
    bytes.push_back(m.stats.level);
    put16(bytes,m.stats.atk);put16(bytes,m.stats.def);put16(bytes,m.stats.spe);
    bytes.insert(bytes.end(),{
      m.stats.type1,m.stats.type2,m.form,uint8_t(m.shiny)
    });
    put16(bytes,m.maxHp);put16(bytes,m.hp);
    bytes.insert(bytes.end(),{
      m.rests,m.wins,m.levelGains,uint8_t(m.nick.size())
    });
    bytes.insert(bytes.end(),m.nick.begin(),m.nick.end());
  }
  put32(bytes,checksum(bytes,bytes.size()));
  if(bytes.size()>MAX_BYTES)return false;
  out=std::move(bytes);
  return true;
}

inline bool encode(const State &s,std::vector<uint8_t> &out){
  return encodeWire(s,out,false);
}
inline bool encodeTerminal(const State &s,std::vector<uint8_t> &out){
  return encodeWire(s,out,true);
}

class Reader {
  const std::vector<uint8_t> &bytes;
  size_t at=4,end;
public:
  bool ok=true;
  explicit Reader(const std::vector<uint8_t> &b):bytes(b),end(b.size()-4){}
  uint8_t byte(){
    if(at>=end){ok=false;return 0;}
    return bytes[at++];
  }
  uint16_t word(){
    const uint16_t lo=byte(),hi=byte();
    return uint16_t(lo|(hi<<8));
  }
  uint32_t number(){
    uint32_t value=0;
    for(unsigned i=0;i<4;i++)value|=uint32_t(byte())<<(8*i);
    return value;
  }
  bool boolean(bool &value){
    const auto raw=byte();
    if(raw>1){ok=false;return false;}
    value=raw!=0;
    return ok;
  }
  bool name(std::string &value){
    const auto size=byte();
    if(!ok||size>23||size>end-at){ok=false;return false;}
    value.assign(reinterpret_cast<const char*>(bytes.data()+at),size);
    at+=size;
    return true;
  }
  bool complete()const{return ok&&at==end;}
};

inline bool decodeWire(const std::vector<uint8_t> &bytes,int region,
                       State &out,bool terminal){
  if(region<0||region>1||bytes.size()<31||bytes.size()>MAX_BYTES||
     bytes[0]!='L'||bytes[1]!='T'||
     bytes[2]!=(region==0?'K':'J')||bytes[3]!=VERSION)return false;

  const size_t end=bytes.size()-4;
  uint32_t stored=0;
  for(unsigned i=0;i<4;i++)stored|=uint32_t(bytes[end+i])<<(8*i);
  if(stored!=checksum(bytes,end))return false;

  Reader r(bytes);
  State next;
  next.region=uint8_t(region);
  next.phase=r.byte();next.variant=r.byte();
  next.index=r.byte();next.active=r.byte();
  const auto count=r.byte();
  if(count<1||count>6)return false;
  next.care.id=r.number();next.care.life=r.number();
  next.care.age=r.number();next.care.dex=r.word();
  next.care.geneAtk=r.byte();next.care.geneDef=r.byte();
  next.care.geneSpe=r.byte();
  if(!r.boolean(next.care.shiny))return false;

  for(unsigned i=0;i<count;i++){
    Member m;
    m.id=r.number();m.dex=r.word();m.stats.level=r.byte();
    m.stats.atk=r.word();m.stats.def=r.word();m.stats.spe=r.word();
    m.stats.type1=r.byte();m.stats.type2=r.byte();m.form=r.byte();
    m.stats.mega=m.form>0;
    if(!r.boolean(m.shiny))return false;
    m.maxHp=r.word();m.hp=r.word();
    m.rests=r.byte();m.wins=r.byte();m.levelGains=r.byte();
    if(!r.name(m.nick))return false;
    next.members.push_back(std::move(m));
  }
  if(!r.complete()||!validState(next,terminal))return false;
  out=std::move(next);
  return true;
}

inline bool decode(const std::vector<uint8_t> &bytes,int region,State &out){
  return decodeWire(bytes,region,out,false);
}
inline bool decodeTerminal(
    const std::vector<uint8_t> &bytes,int region,State &out){
  return decodeWire(bytes,region,out,true);
}

} // namespace tp_league_team
