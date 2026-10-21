// E1: local-clock deadlines, persistent trainer stone, per-creature challenge.
namespace {
uint16_t tpMegaScale(uint16_t value,unsigned pct){const uint32_t n=uint32_t(value)*pct/100;return n>65535?65535:uint16_t(n);}
}
bool Pet::megaQuestReady() const {return megaSupported()&&!megaStone&&megaTraining>=3&&bond>=50&&lowestStat()>=60&&!sleeping&&ceremony==CER_NONE&&!evolving();}
void Pet::megaTrainingRun(){if(megaSupported()&&!megaStone&&megaTraining<3&&!sleeping)megaTraining++;}
void Pet::megaNewCreature(){if(megaForm)journalAdd(JR_MEGA_END,1);megaTraining=megaForm=0;megaEnd=megaStarted=0;}
void Pet::saveMega(){prefs.putUChar("mgver",1);prefs.putBool("mgstone",megaStone);prefs.putUChar("mgtrain",megaTraining);prefs.putUChar("mgform",megaForm);prefs.putUInt("mgend",megaEnd);prefs.putUInt("mgcool",megaCooldown);prefs.putUInt("mgstart",megaStarted);prefs.putUInt("mgseen",megaSeen);}
void Pet::loadMega(){
 megaStone=false;megaTraining=megaForm=0;megaEnd=megaCooldown=megaStarted=megaSeen=0;if(prefs.getUChar("mgver",0)!=1)return;
 megaStone=prefs.getBool("mgstone",false);megaTraining=prefs.getUChar("mgtrain",0);if(megaTraining>3)megaTraining=3;
 megaForm=prefs.getUChar("mgform",0);megaEnd=prefs.getUInt("mgend",0);megaCooldown=prefs.getUInt("mgcool",0);megaStarted=prefs.getUInt("mgstart",0);megaSeen=prefs.getUInt("mgseen",0);
 if(!megaSupported())megaTraining=0;
 if(megaForm!=1||!megaStone||!megaSupported()||!megaStarted||uint64_t(megaStarted)+900!=megaEnd||uint64_t(megaEnd)+3600!=megaCooldown){megaForm=0;megaEnd=megaStarted=0;}
}
void Pet::megaUpdate(uint32_t now){
 if(!now||uint64_t(now)+4500>0xffffffffULL)return;bool changed=false;
 const bool backwards=now<megaSeen;
 if(megaForm&&(backwards||!megaSupported()||now>=megaEnd)){
  const uint32_t stamp=(!backwards&&now>=megaEnd&&megaEnd)?megaEnd:now;
  journalAdd(JR_MEGA_END,1,0,0xffff,0,nullptr,stamp);megaForm=0;megaEnd=megaStarted=0;changed=true;
 }
 if(backwards){if(megaCooldown>now+3600)megaCooldown=now+3600;megaSeen=now;changed=true;}else if(now>megaSeen)megaSeen=now;
 if(changed)save();
}
bool Pet::megaClaim(uint32_t now){if(!now||!megaQuestReady())return false;megaStone=true;megaSeen=now>megaSeen?now:megaSeen;journalAdd(JR_MEGA_STONE,1,0,0xffff,0,nullptr,now);save();return true;}
bool Pet::megaActivate(uint32_t now){
 megaUpdate(now);
 if(!now||now<megaSeen||uint64_t(now)+4500>0xffffffffULL||!megaSupported()||!megaStone||megaForm||now<megaCooldown||sleeping||ceremony!=CER_NONE||evolving())return false;
 megaForm=1;megaStarted=now;megaSeen=now;megaEnd=now+900;megaCooldown=megaEnd+3600;journalAdd(JR_MEGA_BEGIN,1,0,0xffff,0,nullptr,now);save();return true;
}
uint16_t Pet::megaAtk(uint32_t now) const {return megaActive(now)?tpMegaScale(atkStat(),160):atkStat();}
uint16_t Pet::megaDef(uint32_t now) const {return megaActive(now)?tpMegaScale(defStat(),140):defStat();}
uint16_t Pet::megaSpe(uint32_t now) const {return megaActive(now)?tpMegaScale(speStat(),125):speStat();}
