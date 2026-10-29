#pragma once
#include <cstdint>
#include <variant>
#include <Preferences.h>
#include "region-progress-keys.h"

// Read-only historical completion proof. No repair, migration or writes.
inline int tpKantoLeagueCompletionState(){
 const auto &s=Preferences::store();
 const auto &k=TP_KANTO_KEYS;
 const bool any=s.count(k.leagueVersion)||s.count(k.leagueDone)||
  s.count(k.leagueDate)||s.count(k.leagueRun);
 if(!any)return 0;
 const auto ver=s.find(k.leagueVersion);
 const auto done=s.find(k.leagueDone);
 const auto date=s.find(k.leagueDate);
 if(ver==s.end()||done==s.end()||date==s.end()||
    !std::holds_alternative<int64_t>(ver->second)||
    !std::holds_alternative<bool>(done->second)||
    !std::holds_alternative<int64_t>(date->second))return -1;
 const auto version=std::get<int64_t>(ver->second);
 const auto when=std::get<int64_t>(date->second);
 const bool completed=std::get<bool>(done->second);
 if(version!=1||when<0||when>0xffffffffLL||
    (!completed&&when!=0))return -1;
 return completed?1:0;
}
inline int tpRegionAccessState(int region){
 if(region==0)return 1;
 if(region==1)return tpKantoLeagueCompletionState();
 return -1;
}
