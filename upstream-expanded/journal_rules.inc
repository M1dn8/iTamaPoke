#include <ctime>
#include <cstring>
namespace {
uint32_t tpJournalNow(){const auto n=std::time(nullptr);return n>0&&uint64_t(n)<=0xffffffffULL?uint32_t(n):0;}
void tpJournalEsc(std::string &out,const char *text){
 out+=char(34);static const char hex[]="0123456789abcdef";
 for(const unsigned char *p=(const unsigned char*)text;*p;p++){const auto c=*p;if(c==34||c==92){out+=char(92);out+=char(c);}else if(c<32){out+=char(92);out+="u00";out+=hex[c>>4];out+=hex[c&15];}else out+=char(c);}out+=char(34);
}
}
void Pet::journalEnsure(){if(journalReady)return;journalReady=true;journalNeedsBaseline=false;journalCount=0;journalLevels=journalCollection=0;journalLastFrom=journalLastTo=0;std::memset(&journalPending,0,sizeof(journalPending));}
void Pet::loadJournal(){
 journalReady=true;journalCount=0;journalLevels=journalCollection=0;journalLastFrom=journalLastTo=0;std::memset(&journalPending,0,sizeof(journalPending));
 journalNeedsBaseline=prefs.getUChar("jrver",0)!=1;if(journalNeedsBaseline)return;
 uint16_t count=prefs.getUShort("jrcount",0);if(count>200)count=200;
 if(prefs.getBytes("jrdata",journalEntries,size_t(count)*sizeof(TPJournalEntry))==size_t(count)*sizeof(TPJournalEntry)){
  for(uint16_t i=0;i<count;i++){auto entry=journalEntries[i];entry.nickname[23]=0;if(entry.kind<JR_EGG||entry.kind>JR_END||entry.species>DEX_COUNT)continue;journalEntries[journalCount++]=entry;}
 }
 journalLevels=prefs.getUChar("jrlvl",0)&15;journalCollection=prefs.getUChar("jrdex",0)&31;
 journalLastFrom=prefs.getUShort("jrfrom",0);journalLastTo=prefs.getUShort("jrto",0);
 if(prefs.getBytes("jrpend",&journalPending,sizeof(journalPending))!=sizeof(journalPending))std::memset(&journalPending,0,sizeof(journalPending));
 journalPending.nickname[23]=0;
 if(journalPending.from>DEX_COUNT||journalPending.to>DEX_COUNT||!journalPending.from||!journalPending.to)std::memset(&journalPending,0,sizeof(journalPending));
}
void Pet::prepareJournalBaseline(){
 if(!journalNeedsBaseline)return;journalNeedsBaseline=false;
 const uint8_t levels[]={10,25,50,100};if(!isEgg())for(uint8_t i=0;i<4;i++)if(level()>=levels[i])journalLevels|=1<<i;
 const uint16_t goals[]={10,25,50,100,DEX_COUNT};const auto count=registeredCount();for(uint8_t i=0;i<5;i++)if(count>=goals[i])journalCollection|=1<<i;
}
void Pet::saveJournal(){
 journalEnsure();journalFinalize();prefs.putUChar("jrver",1);prefs.putUShort("jrcount",journalCount);prefs.putBytes("jrdata",journalEntries,size_t(journalCount)*sizeof(TPJournalEntry));
 prefs.putUChar("jrlvl",journalLevels);prefs.putUChar("jrdex",journalCollection);prefs.putUShort("jrfrom",journalLastFrom);prefs.putUShort("jrto",journalLastTo);prefs.putBytes("jrpend",&journalPending,sizeof(journalPending));
}
void Pet::journalAdd(uint8_t kind,uint16_t a,uint16_t b,uint16_t species,uint8_t flags,const char *name,uint32_t epoch){
 journalEnsure();journalFinalize();TPJournalEntry entry;std::memset(&entry,0,sizeof(entry));entry.epoch=epoch?epoch:tpJournalNow();entry.kind=kind;entry.a=a;entry.b=b;entry.flags=flags;
 entry.species=species==0xffff?(isEgg()?0:uint16_t(speciesId)):species;if(entry.species>DEX_COUNT)entry.species=0;
 if(entry.species&&kind!=JR_CAPTURE&&kind!=JR_EGG&&kind!=JR_COLLECTION){const char *n=name?name:nick;std::strncpy(entry.nickname,n,sizeof(entry.nickname)-1);}
 if(journalCount==200){std::memmove(journalEntries,journalEntries+1,199*sizeof(TPJournalEntry));journalCount=199;}
 journalEntries[journalCount++]=entry;pendingSave=true;
}
void Pet::journalNewCreature(){journalEnsure();journalLevels=0;journalLastFrom=journalLastTo=0;journalAdd(JR_EGG,0,0,0);}
void Pet::journalMilestones(){
 journalEnsure();const uint8_t levels[]={10,25,50,100};
 if(!isEgg())for(uint8_t i=0;i<4;i++)if(level()>=levels[i]&&!(journalLevels&(1<<i))){journalLevels|=1<<i;journalAdd(JR_LEVEL,levels[i]);}
 const uint16_t goals[]={10,25,50,100,DEX_COUNT};const auto count=registeredCount();for(uint8_t i=0;i<5;i++)if(count>=goals[i]&&!(journalCollection&(1<<i))){journalCollection|=1<<i;journalAdd(JR_COLLECTION,goals[i],0,0);}
}
void Pet::journalEvolution(uint16_t from,uint16_t to){
 if(!from||!to||from==to||from>DEX_COUNT||to>DEX_COUNT)return;journalEnsure();journalFinalize();
 if(journalLastFrom==from&&journalLastTo==to)return;
 if(journalPending.to)journalFinalize(journalPending.due);
 journalLastFrom=from;journalLastTo=to;std::memset(&journalPending,0,sizeof(journalPending));journalPending.epoch=tpJournalNow();journalPending.due=journalPending.epoch+(EVOLVE_ANIM_MS+999)/1000;journalPending.from=from;journalPending.to=to;std::strncpy(journalPending.nickname,nick,23);pendingSave=true;
}
void Pet::journalFinalize(uint32_t epoch){
 if(!journalReady||!journalPending.to)return;const auto now=epoch?epoch:tpJournalNow();if(now<journalPending.due&&(evolving()||journalPending.due-now>1))return;
 const auto p=journalPending;std::memset(&journalPending,0,sizeof(journalPending));journalAdd(JR_EVOLVE,p.to,0,p.from,0,p.nickname,now<p.due?now:p.due);
}
std::string Pet::journalJSON(){
 journalEnsure();journalFinalize();std::string out="[";
 for(uint16_t i=0;i<journalCount;i++){
  if(i)out+=',';const auto &e=journalEntries[i];out+='{';
  tpJournalEsc(out,"t");out+=':';out+=std::to_string(e.epoch);out+=',';
  tpJournalEsc(out,"k");out+=':';out+=std::to_string(e.kind);out+=',';
  tpJournalEsc(out,"s");out+=':';out+=std::to_string(e.species);out+=',';
  tpJournalEsc(out,"a");out+=':';out+=std::to_string(e.a);out+=',';
  tpJournalEsc(out,"b");out+=':';out+=std::to_string(e.b);out+=',';
  tpJournalEsc(out,"f");out+=':';out+=std::to_string(e.flags);out+=',';
  tpJournalEsc(out,"n");out+=':';tpJournalEsc(out,e.nickname);out+='}';
 }
 out+=']';return out;
}
