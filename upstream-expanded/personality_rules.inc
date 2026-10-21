// C4 personality implementation, included once by pet.cpp.
void Pet::initializePersonality() {
  if(personalityReady)return;
  personalityKind=uint8_t(legacyPersonality());
  for(uint8_t i=0;i<4;i++){personalityScores[i]=0;personalityEventMinutes[i]=0;}
  if(personalityKind>=1&&personalityKind<=4)personalityScores[personalityKind-1]=6;
  personalityEventMask=0;personalityChanged=false;personalityChangeMinute=0;
  personalitySleepMinutes=0;personalitySleepMarked=false;
  if(personalityClock<ageMinutes)personalityClock=ageMinutes;
  personalityReady=true;
}
void Pet::resetPersonality() {
  personalityReady=true;personalityKind=PERS_BALANCED;
  for(uint8_t i=0;i<4;i++){personalityScores[i]=0;personalityEventMinutes[i]=0;}
  personalityEventMask=0;personalityChanged=false;personalityChangeMinute=0;
  personalitySleepMinutes=0;personalitySleepMarked=false;
}
void Pet::savePersonality() {
  initializePersonality();
  prefs.putUChar("psver",1);prefs.putUChar("pskind",personalityKind);prefs.putUChar("psbond",bondToday>8?8:bondToday);prefs.putUInt("psbday",personalityBondDay);
  prefs.putBytes("psvec",personalityScores,sizeof(personalityScores));
  prefs.putBytes("psevt",personalityEventMinutes,sizeof(personalityEventMinutes));
  prefs.putUChar("psmask",personalityEventMask);prefs.putBool("pschg",personalityChanged);
  prefs.putUInt("pstchg",personalityChangeMinute);prefs.putUChar("pssleep",personalitySleepMinutes);
  prefs.putBool("psrest",personalitySleepMarked);prefs.putUInt("psclock",personalityClock);
  prefs.putUInt("psday",personalityBonusDay);prefs.putUChar("psused",personalityBonusesToday);
  prefs.putUInt("psbonus",personalityBonusMinute);prefs.putBool("psbst",personalityBonusStamped);
}
void Pet::loadPersonality() {
  personalityReady=false;
  personalityBondDay=prefs.getUInt("psbday",lastCareDay);
  personalityClock=prefs.getUInt("psclock",ageMinutes);
  if(personalityClock<ageMinutes)personalityClock=ageMinutes;
  personalityBonusDay=prefs.getUInt("psday",0);
  personalityBonusesToday=prefs.getUChar("psused",0);if(personalityBonusesToday>3)personalityBonusesToday=3;
  personalityBonusMinute=prefs.getUInt("psbonus",0);
  personalityBonusStamped=prefs.getBool("psbst",false);
  if(personalityBonusMinute>personalityClock)personalityBonusMinute=personalityClock;
  if(prefs.getUChar("psver",0)!=1){initializePersonality();return;}
  bondToday=prefs.getUChar("psbond",0);if(bondToday>8)bondToday=8;
  personalityReady=true;personalityKind=prefs.getUChar("pskind",PERS_BALANCED);
  if(personalityKind>PERS_LAZY)personalityKind=PERS_BALANCED;
  if(prefs.getBytes("psvec",personalityScores,sizeof(personalityScores))!=sizeof(personalityScores))for(auto &v:personalityScores)v=0;
  for(auto &v:personalityScores)if(v>10)v=10;
  personalityEventMask=prefs.getUChar("psmask",0)&15;
  if(prefs.getBytes("psevt",personalityEventMinutes,sizeof(personalityEventMinutes))!=sizeof(personalityEventMinutes)){for(auto &v:personalityEventMinutes)v=0;personalityEventMask=0;}
  for(uint8_t i=0;i<4;i++)if(personalityEventMinutes[i]>ageMinutes){personalityEventMinutes[i]=0;personalityEventMask&=uint8_t(~(1<<i));}
  personalityChanged=prefs.getBool("pschg",false);personalityChangeMinute=prefs.getUInt("pstchg",0);
  if(personalityChangeMinute>ageMinutes){personalityChanged=false;personalityChangeMinute=0;}
  personalitySleepMinutes=prefs.getUChar("pssleep",0);if(personalitySleepMinutes>30)personalitySleepMinutes=30;
  personalitySleepMarked=prefs.getBool("psrest",false);
  if(!sleeping){personalitySleepMinutes=0;personalitySleepMarked=false;}
  if(isEgg())resetPersonality();
}
void Pet::personalityMinute() {
  initializePersonality();if(personalityClock<0xffffffffUL)personalityClock++;updatePersonality();
}
void Pet::personalityRestMinute() {
  initializePersonality();if(isEgg()||!sleeping)return;
  if(personalitySleepMinutes<30)personalitySleepMinutes++;
  if(personalitySleepMinutes>=30&&!personalitySleepMarked){notePersonality(3);personalitySleepMarked=true;pendingSave=true;}
}
void Pet::updatePersonality() {
  if(personalityChanged&&(ageMinutes<personalityChangeMinute||ageMinutes-personalityChangeMinute<30))return;
  uint8_t candidate=PERS_BALANCED,maxScore=0;
  for(uint8_t i=0;i<4;i++)if(personalityScores[i]>maxScore){maxScore=personalityScores[i];candidate=i+1;}
  if(maxScore>=6){
    uint8_t second=0;for(uint8_t i=0;i<4;i++)if(i+1!=candidate&&personalityScores[i]>second)second=personalityScores[i];
    if(maxScore<second+2)return;
  }else if(maxScore<=2)candidate=PERS_BALANCED;else return;
  if(candidate!=personalityKind){personalityKind=candidate;personalityChanged=true;personalityChangeMinute=ageMinutes;pendingSave=true;}
}
void Pet::notePersonality(uint8_t axis) {
  if(axis>3||isEgg()||ceremony!=CER_NONE||evolving()||(sleeping&&axis<=1))return;
  initializePersonality();const uint8_t bit=1<<axis;
  if(!(personalityEventMask&bit)||(ageMinutes>=personalityEventMinutes[axis]&&ageMinutes-personalityEventMinutes[axis]>=10)){
    personalityEventMinutes[axis]=ageMinutes;personalityEventMask|=bit;
    for(uint8_t i=0;i<4;i++){if(i==axis)personalityScores[i]=personalityScores[i]>8?10:personalityScores[i]+2;else if(personalityScores[i])personalityScores[i]--;}
    updatePersonality();pendingSave=true;
  }
  if(axis!=3)applyPersonalityBonus(axis);
}
bool Pet::applyPersonalityBonus(uint8_t axis) {
  if(axis>3||isEgg()||(sleeping&&axis!=2)||ceremony!=CER_NONE||evolving())return false;
  initializePersonality();const uint32_t day=today();if(!day)return false;
  if(personalityBonusDay!=day){personalityBonusDay=day;personalityBonusesToday=0;}
  if(personalityBonusesToday>=3)return false;
  if(personalityBonusStamped&&(personalityClock<personalityBonusMinute||personalityClock-personalityBonusMinute<30))return false;
  bool gained=false;
  if(personalityKind==PERS_BALANCED&&axis<=2){const auto old=joy;joy=clamp100(int(joy)+1);gained=joy>old;}
  else if(personalityKind==PERS_PLAYFUL&&axis==0){const auto old=joy;joy=clamp100(int(joy)+2);gained=joy>old;}
  else if(personalityKind==PERS_BRAVE&&axis==1){const auto old=joy;joy=clamp100(int(joy)+2);gained=joy>old;}
  else if(personalityKind==PERS_CALM&&axis==2&&bondToday<8){const auto old=bond;addBond(1);gained=bond>old;}
  else if(personalityKind==PERS_LAZY&&axis==3){const auto old=energy;energy=clamp100(int(energy)+2);gained=energy>old;}
  if(gained){personalityBonusesToday++;personalityBonusMinute=personalityClock;personalityBonusStamped=true;pendingSave=true;}
  return gained;
}
