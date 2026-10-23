#include <cassert>
#include <cstring>
#include <iostream>
#include "pet.h"
extern "C" int tp_f4_capture_audio_quiet();
uint32_t g_millis=1000;TPSerialShim Serial;static unsigned sounds=0;void sfxPlay(uint8_t){if(!tp_f4_capture_audio_quiet())sounds++;}
static Pet actor;Pet &tp_battle_pet(){return actor;}
extern "C" int tp_is_egg(){return actor.isEgg();}extern "C" int tp_sleeping(){return actor.sleeping;}
extern "C" int tp_species_id(){return actor.speciesId;}extern "C" int tp_level(){return actor.level();}
#include "../browser_ver/core/browser_battle.cpp"
extern "C" int tp_f4_store_stage(uint32_t,const uint8_t*,int);extern "C" uint32_t tp_f4_store_begin();
extern "C" int tp_f4_store_size();extern "C" int tp_f4_store_pending();
static void setup(unsigned seed,bool knownNine=false){if(gOpen)tp_battle_close();Preferences::store().clear();actor=Pet();Preferences p;p.putBool("init",true);p.putShort("dexn",150);p.putShort("eggT2",1);p.putUInt("age",5940);p.putUChar("full",100);p.putUChar("joy",70);p.putUChar("ene",100);p.putUChar("hyg",100);p.putUChar("bond",100);if(knownNine){uint8_t reg[129]{};reg[0]=255;p.putBytes("dexreg",reg,sizeof(reg));}actor.begin();actor.setClock(1700000000);std::srand(seed);startBattle(25,17);gRun.enemyHp=0;gTurn.playerWon=true;gTurn.battleEnded=true;finishBattle();}
int main(){unsigned success=0,failure=0;const std::string data="opaque native transport fixture";
 for(unsigned seed=0;seed<40;seed++){
  setup(seed);const auto before=Preferences::store();const auto oldJoy=actor.joy,oldBond=actor.bond;const auto token=tp_f4_capture_begin();assert(token&&!tp_f4_capture_begin()&&!tp_f4_store_begin());assert(!tp_f4_capture_finish(token+1,0)&&tp_f4_capture_attempt(token+1)==-1);
  const std::string preview=tp_f4_capture_snapshot();assert(preview.find("\"dex\":25")!=std::string::npos&&preview.find("\"level\":17")!=std::string::npos&&preview.find("\"genes\":null")!=std::string::npos&&preview.find("capturedAt")==std::string::npos);
  const auto oldId=tp_f4_capture_battle_id();tp_battle_close();assert(gOpen);startBattle(1,2);assert(tp_f4_capture_battle_id()==oldId);tp_battle_leave_wild();assert(!gCatchDone);
  const auto audio=sounds;const int result=tp_f4_capture_attempt(token);assert(result==0||result==1);assert(sounds==audio);const auto timestamp=gF4CatchEpoch;assert(timestamp>0&&gCatchDone&&gCatchTried);assert(tp_f4_capture_attempt(token)==-1);
  assert(tp_f4_store_stage(token,reinterpret_cast<const uint8_t*>(data.data()),int(data.size())));actor.setClock(1700000099);assert(tp_f4_capture_finish(token,0));assert(Preferences::store()==before&&actor.joy==oldJoy&&actor.bond==oldBond&&!gCatchDone&&!gCatchTried&&!tp_f4_store_pending());assert(!tp_f4_capture_finish(token,0));
  actor.bond=0;actor.setClock(1700000100);const auto token2=tp_f4_capture_begin();assert(token2>token);
  std::srand(1234);const int expectedNext=std::rand();std::srand(1234);assert(tp_f4_capture_attempt(token2)==result);assert(std::rand()==expectedNext&&gF4CatchEpoch==timestamp);
  assert(tp_f4_store_stage(token2,reinterpret_cast<const uint8_t*>(data.data()),int(data.size())));assert(tp_f4_capture_finish(token2,1));assert(!tp_f4_store_pending()&&tp_f4_store_size()==int(data.size())&&!tp_f4_capture_begin());
  if(result){success++;assert(actor.isCaught(25));assert(actor.joy==uint8_t(oldJoy+4));assert(actor.bond<=2);}else{failure++;assert(!actor.isCaught(25)&&actor.joy==oldJoy);}
  const auto committed=Preferences::store();tp_battle_try_catch();assert(Preferences::store()==committed);tp_battle_close();assert(!gOpen);
 }assert(success&&failure);actor.newEgg();assert(tp_f4_store_size()==int(data.size()));actor.factoryReset();assert(tp_f4_store_size()==0);
 setup(2);const auto token=tp_f4_capture_begin();assert(token&&tp_f4_capture_finish(token,0)&&gF4Outcome==-1);
 bool milestone=false;for(unsigned seed=0;seed<40&&!milestone;seed++){
  setup(seed,true);assert(actor.knownDexCount()==9);const auto old=Preferences::store();const auto joy=actor.joy;const auto a=tp_f4_capture_begin();const int won=tp_f4_capture_attempt(a);assert(tp_f4_capture_finish(a,0)&&Preferences::store()==old&&actor.joy==joy);
  if(won){const auto b=tp_f4_capture_begin();assert(tp_f4_capture_attempt(b)==1&&tp_f4_capture_finish(b,1));assert(actor.knownDexCount()==10&&actor.joy==uint8_t(joy+9>100?100:joy+9));milestone=true;}tp_battle_close();
 }assert(milestone);
 setup(3);gRespectCatch=true;const auto rtoken=tp_f4_capture_begin();const auto prior=Preferences::store();const int r=tp_f4_capture_attempt(rtoken);assert(r==0||r==1);assert(tp_f4_capture_finish(rtoken,0)&&Preferences::store()==prior);const auto retry=tp_f4_capture_begin();assert(tp_f4_capture_attempt(retry)==r&&tp_f4_capture_finish(retry,1));tp_battle_close();
 setup(1);actor.geneAtk++;assert(!tp_f4_capture_begin());tp_battle_close();
 setup(1);tp_battle_close();assert(tp_f3_start(0));assert(!tp_f4_capture_begin());gRun.enemyHp=0;gTurn.playerWon=true;gTurn.battleEnded=true;finishBattle();assert(!tp_f4_capture_begin()&&!gCatchOffered);tp_battle_close();
 std::cout<<"F4-B3a native capture passed: "<<success<<" successes and "<<failure<<" failures, exact Pet/store/flag rollback, outcome replay without RNG or duplicate rewards, milestone/respect catches, stale tokens, actor checks and no arena catch.\n";
}
