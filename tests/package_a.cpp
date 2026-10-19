#include "pet.h"
#include "evolution_rules.h"
#include "audio.h"
#include <cassert>
#include <cstdio>
uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}
int main(){
  Pet p;p.speciesId=387;p.ageMinutes=17*MINUTES_PER_LEVEL;p.lastSeenEpoch=13*3600;
  p.fullness=p.joy=p.energy=p.hygiene=90;
  assert(!p.evolveTo(389));assert(p.speciesId==387);
  assert(p.evolveTo(388));assert(p.speciesId==388);
  assert(!p.evolveTo(389)); // no second evolution during animation
  Pet m;m.speciesId=126;m.ageMinutes=29*MINUTES_PER_LEVEL;m.lastSeenEpoch=13*3600;m.bond=39;
  assert(!m.evolveTo(467));m.bond=40;assert(m.evolveTo(467));
  Pet e;e.speciesId=133;e.ageMinutes=29*MINUTES_PER_LEVEL;e.lastSeenEpoch=13*3600;e.bond=100;
  assert(!e.evolveTo(197));assert(e.evolveTo(196));
  Pet n;n.speciesId=133;n.ageMinutes=29*MINUTES_PER_LEVEL;n.lastSeenEpoch=23*3600;n.bond=100;
  assert(!n.evolveTo(196));assert(n.evolveTo(197));
  Pet bad;bad.speciesId=387;bad.ageMinutes=17*MINUTES_PER_LEVEL;bad.fullness=39;
  assert(!bad.evolveTo(388));assert(!bad.evolveTo(-1));assert(!bad.evolveTo(1026));
  std::puts("Package A selected evolution tests passed.");
}
