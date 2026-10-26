#include <cassert>
#include <iomanip>
#include <iostream>
#include <string>
#include "../browser_ver/core/league-team-state.h"

namespace L=tp_league_team;

static L::State fixture(unsigned count=2){
  L::State s;
  s.care={100,1,540,150,100,100,100,false};
  for(unsigned i=0;i<count;i++){
    L::Member m;
    m.id=100+i;m.dex=i?25:150;
    m.stats.level=30;m.stats.atk=100;m.stats.def=400;m.stats.spe=100;
    m.stats.type1=1;
    m.nick=i?"Blitz \"Zwei\"":"Care";
    m.maxHp=m.hp=L::initialMaxHp(m.stats);
    s.members.push_back(m);
  }
  return s;
}

static void repair(std::vector<uint8_t> &bytes){
  const auto sum=L::checksum(bytes,bytes.size()-4);
  for(unsigned i=0;i<4;i++)bytes[bytes.size()-4+i]=uint8_t(sum>>(8*i));
}

int main(int argc,char **argv){
  if(argc>1&&std::string(argv[1])=="--hex"){
    std::vector<uint8_t> bytes;
    assert(L::encode(fixture(),bytes));
    for(auto byte:bytes)
      std::cout<<std::hex<<std::setw(2)<<std::setfill('0')<<unsigned(byte);
    std::cout<<"\n";return 0;
  }

  unsigned roundtrips=0;
  for(unsigned region=0;region<2;region++)
    for(unsigned variant=0;variant<(region?1u:3u);variant++)
      for(unsigned count=1;count<=6;count++)
        for(unsigned index=0;index<26;index++)
          for(unsigned phase=1;phase<=2;phase++){
            if(!index&&phase==L::CHECKPOINT)continue;
            auto s=fixture(count);
            s.region=region;s.variant=variant;s.index=index;s.phase=phase;
            s.members[0].wins=index;
            s.members[0].levelGains=index;
            s.members[0].rests=index%6;
            if(count>1){s.members[1].hp=0;s.members[1].rests=0;}
            if(count>2)s.members[2].nick="雷";
            std::vector<uint8_t> bytes,reencoded;
            assert(L::valid(s)&&L::encode(s,bytes));
            L::State restored;
            assert(L::decode(bytes,region,restored));
            assert(L::encode(restored,reencoded)&&reencoded==bytes);
            assert(restored.members.size()==count);
            assert(restored.members[0].stats.level==30);
            assert(restored.members[0].levelGains==index);
            assert(restored.care.life==1&&restored.care.id==100);
            assert(!L::decode(bytes,1-int(region),restored));
            roundtrips++;
          }

  const auto original=fixture();
  std::vector<uint8_t> bytes;
  assert(L::encode(original,bytes));

  auto refuse=[&](const L::State &bad){
    auto output=bytes;
    assert(!L::valid(bad));
    assert(!L::encode(bad,output)&&output==bytes);
  };
  auto bad=original;bad.region=2;refuse(bad);
  bad=original;bad.region=1;bad.variant=1;refuse(bad);
  bad=original;bad.phase=3;refuse(bad);
  bad=original;bad.phase=L::CHECKPOINT;refuse(bad);
  bad=original;bad.index=26;refuse(bad);
  bad=original;bad.active=2;refuse(bad);
  bad=original;bad.care.life=0;refuse(bad);
  bad=original;bad.care.id=0xffffffffu;refuse(bad);
  bad=original;bad.members[1].id=100;refuse(bad);
  bad=original;bad.members[0].dex=25;refuse(bad);
  bad=original;bad.members[0].stats.hp=1;refuse(bad);
  bad=original;bad.members[0].stats.level=101;refuse(bad);
  bad=original;bad.members[0].stats.atk=0;refuse(bad);
  bad=original;bad.members[0].stats.type1=0;refuse(bad);
  bad=original;bad.members[0].stats.mega=true;refuse(bad);
  bad=original;bad.members[0].maxHp++;refuse(bad);
  bad=original;bad.members[0].hp=0;refuse(bad);
  bad=original;bad.members[1].rests=6;refuse(bad);
  bad=original;bad.members[1].wins=1;refuse(bad);
  bad=original;bad.members[1].nick=std::string(24,'x');refuse(bad);
  bad=original;bad.members[1].nick="\n";refuse(bad);
  bad=original;bad.members[1].nick=std::string("\xc0\x80",2);refuse(bad);

  // A boxed-only party still binds the separate care identity.
  auto boxed=original;
  for(auto &m:boxed.members){m.id+=100;m.dex=25;}
  assert(L::valid(boxed));

  // Stored-member grants must match wins/cap; care grants may be lower.
  auto capped=original;
  capped.index=2;capped.phase=L::CHECKPOINT;
  capped.members[1].stats.level=99;
  capped.members[1].maxHp=capped.members[1].hp=
    L::initialMaxHp(capped.members[1].stats);
  capped.members[1].wins=2;capped.members[1].levelGains=1;
  assert(L::valid(capped));
  bad=capped;bad.members[1].levelGains=2;refuse(bad);
  bad=capped;bad.members[1].levelGains=0;refuse(bad);
  capped.members[1].stats.level=100;
  capped.members[1].maxHp=capped.members[1].hp=
    L::initialMaxHp(capped.members[1].stats);
  capped.members[1].levelGains=0;
  assert(L::valid(capped));
  auto aged=original;aged.index=2;aged.phase=L::CHECKPOINT;
  aged.members[0].wins=2;aged.members[0].levelGains=0;
  assert(L::valid(aged));

  // Decode failure never publishes partial state.
  auto refuseBytes=[&](const std::vector<uint8_t> &input,int region=0){
    auto output=original;
    assert(!L::decode(input,region,output));
    std::vector<uint8_t> preserved;
    assert(L::encode(output,preserved)&&preserved==bytes);
  };
  for(size_t size=0;size<bytes.size();size++)
    refuseBytes(std::vector<uint8_t>(bytes.begin(),bytes.begin()+size));
  for(size_t pos=0;pos<bytes.size();pos++)
    for(unsigned bit=0;bit<8;bit++){
      auto corrupt=bytes;corrupt[pos]^=uint8_t(1u<<bit);
      refuseBytes(corrupt);
    }
  for(const auto mutation:std::vector<std::pair<size_t,uint8_t>>{
      {3,2},{4,3},{6,26},{7,6},{8,0},{8,7},{26,2},
      {40,0},{43,2},{48,6},{49,1}}){
    auto corrupt=bytes;corrupt[mutation.first]=mutation.second;
    repair(corrupt);refuseBytes(corrupt);
  }
  auto trailing=bytes;
  trailing.insert(trailing.end()-4,0);
  repair(trailing);refuseBytes(trailing);
  refuseBytes(std::vector<uint8_t>(L::MAX_BYTES+1,0));
  refuseBytes(bytes,-1);refuseBytes(bytes,2);

  std::cout<<"P05c league-state codec passed: "<<roundtrips
    <<" regional/variant/member/checkpoint roundtrips, stable IDs/order, "
      "separate care binding, frozen stats, five-rest bounds, fainted "
      "reserves, committed-win/grant caps, UTF-8, checksum/truncation/"
      "future/cross-region rejection and unchanged output on failure. "
      "No Preferences, legacy migration, combat or Hall integration claimed.\n";
}
