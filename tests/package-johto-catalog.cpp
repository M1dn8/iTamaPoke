#include <cassert>
#include <iostream>
#include <set>
#include <string>
#include "arena-johto.h"
#include "league-johto.h"
static void mon(const TPLeagueMon &m){std::cout<<"["<<m.dex<<","<<unsigned(m.level)<<"]";}
int main(int argc,char**){
 const unsigned counts[]={2,3,2,4,2,3,3,4};std::set<std::string> ids;unsigned gyms=0;
 assert(kJohtoArenaCount==8&&tpJohtoArenaAt(8)==nullptr&&tpJohtoArenaAt(unsigned(-1))==nullptr);
 for(unsigned i=0;i<8;i++){const auto &a=*tpJohtoArenaAt(i);assert(a.count==counts[i]&&ids.insert(a.id).second);for(unsigned j=0;j<a.count;j++){assert(a.team[j].dex>=1&&a.team[j].dex<=251&&a.team[j].level>=1&&a.team[j].level<=100);gyms++;}}
 for(unsigned i=0;i<26;i++){const auto *m=tpJohtoLeagueMonAt(i);assert(m&&m->dex>=1&&m->dex<=251&&m->level>=1&&m->level<=100);}
 assert(tpJohtoLeagueMonAt(26)==nullptr&&tpJohtoLeagueMonAt(unsigned(-1))==nullptr);
 assert(kJohtoArenas[0].team[0].level==7&&kJohtoArenas[0].team[1].level==9);
 assert(kJohtoChampion[1].level==47&&kJohtoChampion[2].level==47&&kJohtoChampion[5].level==50);
 if(argc==1){std::cout<<"Johto Gold/Silver native catalog passed: "<<kJohtoArenaCount<<" gyms, "<<gyms<<" gym opponents, "<<kJohtoEliteOpponentCount<<" Elite Four opponents + "<<kJohtoLeagueOpponentCount-kJohtoEliteOpponentCount<<" Champion opponents; range guards and original-not-remake levels. No gameplay activated.\n";return 0;}
 std::cout<<"{\"arena\":[";
 for(unsigned i=0;i<8;i++){if(i)std::cout<<",";const auto &a=kJohtoArenas[i];std::cout<<"{\"id\":\""<<a.id<<"\",\"name\":\""<<a.name<<"\",\"city\":\""<<a.city<<"\",\"badge\":\""<<a.badge<<"\",\"team\":[";for(unsigned j=0;j<a.count;j++){if(j)std::cout<<",";std::cout<<"["<<a.team[j].dex<<","<<unsigned(a.team[j].level)<<"]";}std::cout<<"]}";}
 std::cout<<"],\"league\":{\"names\":[";for(unsigned i=0;i<5;i++){if(i)std::cout<<",";std::cout<<"\""<<kJohtoLeagueNames[i]<<"\"";}
 std::cout<<"],\"elite\":[";for(unsigned i=0;i<4;i++){if(i)std::cout<<",";std::cout<<"[";for(unsigned j=0;j<5;j++){if(j)std::cout<<",";mon(kJohtoElite[i][j]);}std::cout<<"]";}
 std::cout<<"],\"champion\":[";for(unsigned i=0;i<6;i++){if(i)std::cout<<",";mon(kJohtoChampion[i]);}std::cout<<"]}}\n";
}
