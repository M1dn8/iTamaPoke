#include <cassert>
#include <cstring>
#include <iostream>
#include <ctime>
#include <fstream>
#include <iterator>
#include <emscripten.h>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;static bool battle=false;static unsigned audio=0;
extern "C" int tp_f4_life_audio_quiet();void sfxPlay(uint8_t){if(!tp_f4_life_audio_quiet())audio++;}
static Pet actor;Pet&tp_battle_pet(){return actor;}extern "C" int tp_battle_is_open(){return battle;}
extern "C" uint32_t tp_f4_store_begin();extern "C" int tp_f4_store_stage(uint32_t,const uint8_t*,int);extern "C" int tp_f4_store_finish(uint32_t,int);extern "C" int tp_f4_store_size();
extern "C" int tp_f4_life_ensure(uint32_t);extern "C" int tp_f4_life_end(uint32_t,int,int,uint32_t);extern "C" const char *tp_f4_life_state();extern "C" const char *tp_f4_current_snapshot();
#ifdef TP_F4_SAVE_EXCERPT
namespace {Pet&gPet=actor;bool gStarted=true;}
#include "f4-save.inc"
#endif
static void load(bool egg=false){Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",egg?-1:376);p.putShort("eggT2",1);p.putUInt("age",egg?0:10080);p.putBool("shy",true);p.putString("nick","Atlas");p.putUChar("gatk",100);p.putUChar("gdef",105);p.putUChar("gspe",95);p.putUChar("tatk",55);p.putUChar("full",100);p.putUChar("joy",100);p.putUChar("ene",100);p.putUChar("hyg",100);p.putUChar("agver",1);p.putUChar("agmask",3);actor=Pet();actor.begin();actor.setClock(1700000000);}
static void stage(uint32_t token,const std::string&s="opaque native fixture"){assert(tp_f4_store_stage(token,reinterpret_cast<const uint8_t*>(s.data()),int(s.size())));}
int main(int argc,char**argv){load();if(argc>1&&std::string(argv[1])=="--snapshot"){std::cout<<tp_f4_current_snapshot()<<"\n";return 0;}
#ifdef TP_F4_SAVE_EXCERPT
 if(argc==3&&std::string(argv[1])=="--wire-life"){std::ifstream in(argv[2],std::ios::binary);assert(in.good());std::string model((std::istreambuf_iterator<char>(in)),std::istreambuf_iterator<char>());auto token=tp_f4_store_begin();assert(token&&tp_f4_life_ensure(token)==1);stage(token,model);const int n=tp_export_state();std::vector<uint8_t>bytes(tp_export_ptr(),tp_export_ptr()+n);const auto old=Preferences::store();assert(tp_f4_store_finish(token,1));Preferences::store().clear();tp_import_state(bytes.data(),int(bytes.size()));assert(Preferences::store()==old);std::fwrite(bytes.data(),1,bytes.size(),stdout);return 0;}
#endif
 const auto initial=Preferences::store();const auto original=std::string(tp_f4_current_snapshot());const auto sound=audio;assert(std::string(tp_f4_life_state()).find("\"initialized\":false")!=std::string::npos);assert(Preferences::store()==initial&&!tp_f4_life_ensure(99));
 auto token=tp_f4_store_begin();assert(token&&tp_f4_life_ensure(token)==1&&tp_f4_life_ensure(token)==1);stage(token);assert(tp_f4_store_finish(token,0)&&Preferences::store()==initial&&original==tp_f4_current_snapshot());
 token=tp_f4_store_begin();assert(tp_f4_life_ensure(token)==1);stage(token);assert(tp_f4_store_finish(token,1));const auto enrolled=Preferences::store();
 token=tp_f4_store_begin();assert(!tp_f4_life_end(token+1,0,1,900000)&&!tp_f4_life_end(token,0,2,900000));assert(tp_f4_life_end(token,0,1,900000));assert(actor.ceremony==CER_FAREWELL&&actor.lastEnd==CER_FAREWELL&&g_millis==900000&&audio==sound);assert(tp_f4_store_finish(token,0)&&Preferences::store()==enrolled&&actor.ceremony==CER_NONE&&original==tp_f4_current_snapshot());
 token=tp_f4_store_begin();assert(tp_f4_life_end(token,1,1,1000000));stage(token);assert(tp_f4_store_finish(token,1));g_millis=1000010;actor.update(g_millis);assert(!actor.isEgg());g_millis=1010001;actor.update(g_millis);assert(actor.isEgg()&&Preferences().getUInt("f4life",0)==2&&tp_f4_store_size()>0&&Preferences().getUChar("agmask",0)==3);
 load();token=tp_f4_store_begin();assert(tp_f4_life_ensure(token)==1&&tp_f4_life_end(token,0,1,2000000));stage(token);actor.setClock(1700000001);assert(tp_f4_store_finish(token,1));actor=Pet();actor.begin();assert(actor.isEgg()&&Preferences().getUInt("f4life",0)==2);actor=Pet();actor.begin();assert(Preferences().getUInt("f4life",0)==2);
 load(true);token=tp_f4_store_begin();assert(tp_f4_life_ensure(token)==1);stage(token);assert(tp_f4_store_finish(token,1));actor.eggTap();actor.eggTap();actor.eggTap();assert(!actor.isEgg()&&Preferences().getUInt("f4life",0)==1);token=tp_f4_store_begin();assert(!tp_f4_life_end(token,0,1,0));assert(tp_f4_store_finish(token,0));actor.dbgRunawayReady();token=tp_f4_store_begin();assert(tp_f4_life_end(token,2,1,3000000)&&tp_f4_store_finish(token,0)&&actor.ceremony==CER_NONE);
 load();Pet plain=actor;const auto plainStore=Preferences::store();std::srand(123);plain.newEgg();const auto target=Preferences().getShort("eggT2",-1);const auto shiny=Preferences().getBool("eshy",false);Preferences::store()=plainStore;token=tp_f4_store_begin();assert(tp_f4_life_ensure(token)==1&&tp_f4_store_finish(token,1));std::srand(123);actor.newEgg();assert(Preferences().getShort("eggT2",-2)==target&&Preferences().getBool("eshy",false)==shiny&&Preferences().getUInt("f4life",0)==2);
 load();Preferences p;p.putUInt("f4lver",257);p.putUInt("f4life",9);const auto bad=Preferences::store();token=tp_f4_store_begin();assert(!tp_f4_life_ensure(token)&&tp_f4_store_finish(token,0)&&Preferences::store()==bad);actor.newEgg();assert(p.getUInt("f4lver",0)==257&&p.getUInt("f4life",0)==9);actor.factoryReset();assert(!p.isKey("f4life")&&!p.isKey("f4lver")&&tp_f4_store_size()==0);
 std::cout<<"F4-B3b native lifecycle passed: real snapshots, enrollment/rollback, long-dialog ceremony timing, original endings, nonce/new egg, pending-ceremony reload once, hatch, runaway, unchanged RNG, future metadata and reset.\n";
}
