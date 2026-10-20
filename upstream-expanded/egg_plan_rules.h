#pragma once
#include <stdint.h>
// Soft preferences: rarity, eligibility and incomplete-family priority stay unchanged.
inline uint8_t tpEggGeneration(uint16_t dex) {
  static const uint16_t ends[]={151,251,386,493,649,721,809,905,1025};
  if(dex<1||dex>1025)return 0;
  for(uint8_t i=0;i<9;i++)if(dex<=ends[i])return i+1;
  return 0;
}
inline uint8_t tpEggPlanWeight(uint16_t dex,uint8_t type1,uint8_t type2,
                               uint8_t generation,uint8_t type,bool unraised,bool registered) {
  uint8_t weight=1;
  if(generation&&tpEggGeneration(dex)==generation)weight*=3;
  if(type&&(type1==type||type2==type))weight*=3;
  if(unraised&&!registered)weight*=3;
  return weight;
}
