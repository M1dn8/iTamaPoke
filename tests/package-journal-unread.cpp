#include <cassert>
#include <iostream>
#include <string>
#include "pet.h"

uint32_t g_millis=1000;
TPSerialShim Serial;
void sfxPlay(uint8_t){}
static Pet hero;
Pet &tp_battle_pet(){return hero;}
extern "C" {
int tp_battle_is_open(){return 0;}
const char *tp_journal_unread_state();
int tp_journal_unread_mark(uint32_t,uint32_t);
uint32_t tp_f4_store_begin();
int tp_f4_store_finish(uint32_t,int);
}
int field(const char *key){
 const std::string value=tp_journal_unread_state();
 const auto token=std::string("\"")+key+"\":";
 const auto position=value.find(token);
 assert(position!=std::string::npos);
 return std::stoi(value.substr(position+token.size()));
}
void add(int count){
 for(int i=0;i<count;i++)
  hero.journalAdd(6,1,2,1,0,"Identical",1000);
}
int main(){
 Preferences::store().clear();Preferences p;
 p.putBool("init",true);p.putShort("dexn",1);
 p.putUInt("age",540);p.putUChar("ene",80);
 p.putUChar("jrver",1);p.putUShort("jrcount",0);
 const uint8_t empty=0;p.putBytes("jrdata",&empty,0);
 hero=Pet();hero.begin();
 // Build an already-initialized profile before testing a legacy baseline.
 // The first begin may itself create legitimate initialization events.
 hero.chooseStarter(1);
 p.putUChar("jrver",1);p.putUShort("jrcount",0);
 p.putBytes("jrdata",&empty,0);
 for(const char *key:{"jruver","jrutot","jruseen"})
  Preferences::store().erase(key);
 hero=Pet();hero.begin();
 const auto original=Preferences::store();
 if(field("unread")!=0){
  std::cerr<<"Unexpected prepared-profile state: "
   <<tp_journal_unread_state()<<"\nJournal: "<<hero.journalJSON()<<"\n";
 }
 assert(field("unread")==0);
 assert(Preferences::store()==original);

 add(230);
 assert(hero.journalSize()==200);
 assert(field("total")==230&&field("seen")==0&&field("unread")==200);
 const auto before=Preferences::store();
 auto token=tp_f4_store_begin();assert(token);
 assert(!tp_journal_unread_mark(token+1,230));
 assert(!tp_journal_unread_mark(token,231));
 assert(tp_journal_unread_mark(token,230)&&field("unread")==0);
 add(1);assert(field("unread")==1);
 assert(tp_f4_store_finish(token,0));
 assert(Preferences::store()==before);
 assert(hero.journalSize()==200&&field("total")==230&&field("unread")==200);

 token=tp_f4_store_begin();assert(token);
 assert(tp_journal_unread_mark(token,230));
 assert(tp_f4_store_finish(token,1));
 add(5);
 assert(hero.journalSize()==200&&field("total")==235&&field("unread")==5);

 const uint32_t opening=uint32_t(field("total"));
 add(2);
 token=tp_f4_store_begin();assert(token);
 assert(tp_journal_unread_mark(token,opening));
 assert(field("unread")==2);
 const auto once=Preferences::store();
 assert(tp_journal_unread_mark(token,opening)&&Preferences::store()==once);
 assert(tp_f4_store_finish(token,1));

 // Existing public save-triggering path, used only to persist this fixture.
 hero.chooseStarter(1);
 hero=Pet();hero.begin();
 assert(hero.journalSize()==200&&field("total")==237&&field("unread")==2);
 const auto committed=Preferences::store();

 for(int damage=0;damage<6;damage++){
  Preferences::store()=committed;
  if(damage==0)Preferences::store().erase("jruver");
  if(damage==1)Preferences::store().erase("jrutot");
  if(damage==2)p.putUChar("jruver",2);
  if(damage==3)p.putBool("jruseen",true);
  if(damage==4)p.putUInt("jruseen",238);
  if(damage==5)p.putUInt("jrutot",199);
  const auto damaged=Preferences::store();
  assert(std::string(tp_journal_unread_state())=="null");
  assert(Preferences::store()==damaged);
  token=tp_f4_store_begin();assert(token);
  assert(!tp_journal_unread_mark(token,237));
  assert(tp_f4_store_finish(token,0)&&Preferences::store()==damaged);
 }
 Preferences::store()=committed;

 // Legacy entries form a baseline, not a burst of new notifications.
 for(const char *key:{"jruver","jrutot","jruseen"})
  Preferences::store().erase(key);
 assert(field("total")==200&&field("seen")==200&&field("unread")==0);
 add(1);
 assert(field("total")==201&&field("seen")==200&&field("unread")==1);

 std::cout<<"Native journal unread passed: actual journalAdd, identical events "
  "and timestamps, 200-entry rollover, snapshot-based seen boundary, whole-state "
  "rollback, commit/reload, idempotency, legacy baseline and invalid metadata refusal.\n";
}
