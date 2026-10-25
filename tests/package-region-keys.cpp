#include <cassert>
#include <cctype>
#include <cstring>
#include <iostream>
#include <set>
#include <string>
#include <vector>
#include "Preferences.h"
#include "region-progress-keys.h"
static std::vector<std::string> fields(const TPRegionProgressKeys &k){return {
k.arenaVersion,k.arenaMask,k.arenaDatePrefix,k.leagueVersion,k.leagueRun,k.leagueDone,k.leagueDate,k.hallVersion,k.hallData,k.rewardVersion,k.rewardState,k.rewardDex,k.rewardArmed,k.rewardBorn};}
static std::vector<std::string> stored(const TPRegionProgressKeys &k){auto out=fields(k);out.erase(out.begin()+2);for(int i=0;i<8;i++)out.push_back(std::string(k.arenaDatePrefix)+std::to_string(i));return out;}
int main(){
 assert(uint8_t(TPProgressRegion::Kanto)==0&&uint8_t(TPProgressRegion::Johto)==1);
 const std::vector<std::string> legacy={"agver","agmask","agt","lgver","lgkrun","lgkdone","lgkdate","lhver","lhdata","rkver","rkstate","rkdex","rkarm","rkborn"};
 assert(fields(TP_KANTO_KEYS)==legacy);
 assert(tpRegionProgressKeys(0)==&TP_KANTO_KEYS&&tpRegionProgressKeys(1)==&TP_JOHTO_KEYS);
 std::set<std::string> unique;
 for(const auto *k:{&TP_KANTO_KEYS,&TP_JOHTO_KEYS})for(const auto &s:stored(*k)){
  assert(!s.empty()&&s.size()<=15);for(unsigned char c:s)assert(std::isalnum(c));assert(unique.insert(s).second);
 }
 Preferences::store().clear();Preferences p;
 auto empty=Preferences::store();for(unsigned i=2;i<256;i++)assert(tpRegionProgressKeys(uint8_t(i))==nullptr);assert(Preferences::store()==empty);
 // Opaque sentinels verify namespace isolation, not validity of a Hall/run payload.
 const auto oldKeys=stored(TP_KANTO_KEYS),newKeys=stored(TP_JOHTO_KEYS);
 for(size_t i=0;i<oldKeys.size();i++)p.putString(oldKeys[i].c_str(),("Kanto-"+std::to_string(i)).c_str());
 const auto original=Preferences::store();
 for(size_t i=0;i<newKeys.size();i++)p.putString(newKeys[i].c_str(),("Johto-"+std::to_string(i)).c_str());
 for(const auto &entry:original)assert(Preferences::store().at(entry.first)==entry.second);
 for(const auto &key:newKeys)Preferences::store().erase(key);assert(Preferences::store()==original);
 assert(tpRegionProgressKeys(0)==&TP_KANTO_KEYS&&Preferences::store()==original);
 std::cout<<"Region key foundation passed: "<<legacy.size()<<" exact legacy names, "<<unique.size()<<" disjoint concrete keys, 254 rejected IDs, no read-time writes, Johto write/delete isolation and unchanged Kanto sentinels. Actual Kanto decoding/transactions are checked by the existing suites.\n";
}
