#include <cassert>
#include <cstring>
#include <iostream>
#include <string>
#include <vector>
#include <ctime>
#include <cstdio>
#include <fstream>
#include <iterator>
#include <emscripten.h>
#include "pet.h"
uint32_t g_millis=1000;TPSerialShim Serial;void sfxPlay(uint8_t){}
static Pet actor;static bool battle=false;Pet &tp_battle_pet(){return actor;}extern "C" int tp_battle_is_open(){return battle;}
extern "C" int tp_f4_store_size();extern "C" const uint8_t *tp_f4_store_ptr();extern "C" int tp_f4_store_pending();extern "C" uint32_t tp_f4_store_begin();extern "C" int tp_f4_store_stage(uint32_t,const uint8_t*,int);extern "C" int tp_f4_store_finish(uint32_t,int);extern "C" const char *tp_f4_current_snapshot();
#ifdef TP_F4_SAVE_EXCERPT
namespace {Pet &gPet=actor;bool gStarted=true;}
#include "f4-save.inc"
#endif
static void load(){Preferences::store().clear();Preferences p;p.putBool("init",true);p.putShort("dexn",376);p.putShort("eggT2",374);p.putUInt("age",44*60);p.putUChar("gatk",100);p.putUChar("gdef",105);p.putUChar("gspe",95);p.putUChar("tatk",55);p.putUChar("tdef",23);p.putUChar("tspe",14);p.putUChar("full",91);p.putUChar("joy",92);p.putUChar("ene",93);p.putUChar("hyg",94);p.putBool("shy",true);p.putString("nick","Atlas");p.putUChar("agver",1);p.putUChar("agmask",3);p.putString("unknown-future","keep-me");actor=Pet();actor.begin();actor.setClock(1700000000);}
static std::string stored(){int n=tp_f4_store_size();return n>0?std::string(reinterpret_cast<const char*>(tp_f4_store_ptr()),size_t(n)):"";}
int main(int argc,char**argv){
 load();const auto baseline=Preferences::store();const auto original=std::string(tp_f4_current_snapshot());assert(original.find("Atlas")!=std::string::npos&&original.find("\"def\":105")!=std::string::npos&&original.find("\"atk\":55")!=std::string::npos&&original.find("origin")==std::string::npos&&original.find("timestamp")==std::string::npos);assert(Preferences::store()==baseline);assert(tp_f4_store_size()==0&&!tp_f4_store_ptr()&&!tp_f4_store_pending());
 if(argc>1&&std::string(argv[1])=="--snapshot"){std::cout<<original<<"\n";return 0;}
 const std::string bytes="{\"format\":\"ITC1\",\"payload\":\"transport-fixture-only\",\"checksum\":\"not-validated-here\"}";

#ifdef TP_F4_SAVE_EXCERPT
 if(argc>1&&(std::string(argv[1])=="--wire"||std::string(argv[1])=="--wire-max"||std::string(argv[1])=="--wire-model")){
  std::string payload=std::string(argv[1])=="--wire-max"?std::string(262144,'a'):bytes;
  if(std::string(argv[1])=="--wire-model"){assert(argc==3);std::ifstream input(argv[2],std::ios::binary);assert(input.good());payload.assign(std::istreambuf_iterator<char>(input),std::istreambuf_iterator<char>());}
  const auto tok=tp_f4_store_begin();assert(tok&&tp_f4_store_stage(tok,reinterpret_cast<const uint8_t*>(payload.data()),int(payload.size())));
  const int len=tp_export_state();std::vector<uint8_t> raw(tp_export_ptr(),tp_export_ptr()+len);const auto exported=Preferences::store();
  assert(tp_f4_store_finish(tok,1));Preferences::store().clear();tp_import_state(raw.data(),int(raw.size()));assert(Preferences::store()==exported&&stored()==payload);
  Pet restart;restart.begin();assert(restart.speciesId==376&&restart.trAtk==55&&stored()==payload);std::fwrite(raw.data(),1,raw.size(),stdout);return 0;
 }
#endif
 auto stage=[&](uint32_t t){return tp_f4_store_stage(t,reinterpret_cast<const uint8_t*>(bytes.data()),int(bytes.size()));};
 assert(!stage(1)&&!tp_f4_store_finish(1,1));battle=true;assert(!tp_f4_store_begin());battle=false;
 const auto token=tp_f4_store_begin();assert(token&&tp_f4_store_pending()&&!tp_f4_store_begin());assert(!stage(token+1));assert(!tp_f4_store_stage(token,nullptr,1));assert(!tp_f4_store_stage(token,reinterpret_cast<const uint8_t*>(bytes.data()),-1));assert(!tp_f4_store_stage(token,reinterpret_cast<const uint8_t*>(bytes.data()),0));assert(!tp_f4_store_stage(token,reinterpret_cast<const uint8_t*>(bytes.data()),262145));
 const std::vector<std::vector<uint8_t>> bad={{0},{0xc0,0x80},{0xed,0xa0,0x80},{0xf4,0x90,0x80,0x80},{0xe2,0x82},{0x80},{0xff}};for(const auto&b:bad)assert(!tp_f4_store_stage(token,b.data(),int(b.size())));assert(Preferences::store()==baseline);
 assert(stage(token));assert(stored()==bytes);actor.trAtk=88;actor.fullness=5;actor.setClock(1700000099);Preferences().putString("unknown-future","mutated");assert(!tp_f4_store_finish(token+1,0)&&!tp_f4_store_finish(token,2));assert(tp_f4_store_finish(token,0));assert(!tp_f4_store_pending()&&Preferences::store()==baseline&&std::string(tp_f4_current_snapshot())==original&&actor.lastSeenEpoch==1700000000);assert(!tp_f4_store_finish(token,0));
 const auto next=tp_f4_store_begin();assert(next>token&&stage(next)&&tp_f4_store_finish(next,1));assert(stored()==bytes);char unknown[32]={0};Preferences().getString("unknown-future",unknown,sizeof(unknown));assert(std::string(unknown)=="keep-me");assert(Preferences().getUChar("agmask",0)==3);Pet reload;reload.begin();assert(stored()==bytes&&reload.speciesId==376&&reload.trAtk==55);
 const auto saved=Preferences::store();for(const auto&value:std::vector<Preferences::Value>{true,int64_t(1),std::string("x"),std::vector<uint8_t>{},std::vector<uint8_t>{0xff},std::vector<uint8_t>(262145,'x')}){Preferences::store()["f4col"]=value;const auto invalid=Preferences::store();assert(tp_f4_store_size()<0&&!tp_f4_store_ptr()&&!tp_f4_store_begin()&&Preferences::store()==invalid);}Preferences::store()=saved;
 const auto large=tp_f4_store_begin();std::vector<uint8_t>max(262144,'a');assert(tp_f4_store_stage(large,max.data(),int(max.size()))&&tp_f4_store_size()==262144&&tp_f4_store_finish(large,0)&&stored()==bytes);
 const auto unicode=tp_f4_store_begin();const uint8_t valid[]={0xc3,0xa4,0xf0,0x9f,0x98,0x80};assert(tp_f4_store_stage(unicode,valid,6)&&tp_f4_store_finish(unicode,0)&&stored()==bytes);
 for(int i=0;i<100;i++){const auto t=tp_f4_store_begin();assert(t&&stage(t));actor.trAtk=uint8_t(i);actor.setClock(1700001000+i);
#ifdef TP_F4_SAVE_EXCERPT
 tp_export_state();
#endif
assert(tp_f4_store_finish(t,0)&&Preferences::store()==saved&&actor.trAtk==55);}
 actor.factoryReset();assert(tp_f4_store_size()==0);assert(std::string(tp_f4_current_snapshot())=="null");std::cout<<"F4-B1 native storage passed: real Pet snapshot, opaque binary field, token/single-flight/battle/bounds/UTF-8 guards, 100 whole-Pet/store rollbacks including export-clock changes, reload/unknown-key/arena preservation and reset. Native transport only; model/controller validation is exercised separately by the B2 tests.\n";
}
