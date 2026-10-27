#include <emscripten.h>
#include <string>
#include "pet.h"
extern Pet &tp_battle_pet();
extern "C" {
EMSCRIPTEN_KEEPALIVE const char *tp_journal_json(){static std::string out;out=tp_battle_pet().journalJSON();return out.c_str();}
}


#include <algorithm>
#include <cstdint>

extern "C" uint32_t tp_f4_store_pending_token();
extern "C" int tp_battle_is_open();

namespace tp_journal_unread_detail {
constexpr uint32_t LIMIT=0x7ffffffeu;
struct State {
 bool valid=true,initialized=false;
 uint32_t total=0,seen=0;
};
State load(bool checkCurrent=true){
 State out;
 const auto size=uint32_t(tp_battle_pet().journalSize());
 const auto &store=Preferences::store();
 const auto ver=store.find("jruver"),total=store.find("jrutot"),
  seen=store.find("jruseen");
 if(ver==store.end()&&total==store.end()&&seen==store.end()){
  out.total=out.seen=size;
  return out;
 }
 out.initialized=true;
 if(ver==store.end()||total==store.end()||seen==store.end()||
    !std::holds_alternative<int64_t>(ver->second)||
    !std::holds_alternative<int64_t>(total->second)||
    !std::holds_alternative<int64_t>(seen->second)){
  out.valid=false;return out;
 }
 const auto v=std::get<int64_t>(ver->second);
 const auto t=std::get<int64_t>(total->second);
 const auto s=std::get<int64_t>(seen->second);
 if(v!=1||t<0||t>LIMIT||s<0||s>t||(checkCurrent&&t<size)){
  out.valid=false;return out;
 }
 out.total=uint32_t(t);out.seen=uint32_t(s);
 return out;
}
void write(const State &state){
 Preferences p;
 p.putUChar("jruver",1);
 p.putUInt("jrutot",state.total);
 p.putUInt("jruseen",state.seen);
}
}

// Internal event hook, deliberately not exported as a JS event generator.
extern "C" void tp_journal_unread_added(uint32_t previousCount){
 using namespace tp_journal_unread_detail;
 auto state=load(false);
 if(!state.valid||previousCount>200)return;
 if(!state.initialized){
  state.total=state.seen=previousCount;
 }else if(state.total<previousCount){
  return;
 }
 if(state.total==LIMIT){
  // Refuse an exhausted counter instead of silently losing new entries.
  Preferences().putUChar("jruver",2);return;
 }
 state.total++;write(state);
}

extern "C" {
EMSCRIPTEN_KEEPALIVE const char *tp_journal_unread_state(){
 using namespace tp_journal_unread_detail;
 static std::string result;
 const auto state=load();
 if(!state.valid){result="null";return result.c_str();}
 const auto unread=std::min(
  state.total-state.seen,uint32_t(tp_battle_pet().journalSize())
 );
 result="{\"version\":1,\"total\":"+std::to_string(state.total)+
  ",\"seen\":"+std::to_string(state.seen)+
  ",\"unread\":"+std::to_string(unread)+
  ",\"initialized\":"+(state.initialized?std::string("true"):"false")+"}";
 return result.c_str();
}
EMSCRIPTEN_KEEPALIVE int tp_journal_unread_mark(
 uint32_t token,uint32_t expectedTotal){
 using namespace tp_journal_unread_detail;
 if(!token||tp_f4_store_pending_token()!=token||tp_battle_is_open())return 0;
 auto state=load();
 if(!state.valid||expectedTotal>state.total)return 0;
 if(state.initialized&&expectedTotal<=state.seen)return 1;
 state.seen=std::max(state.seen,expectedTotal);
 write(state);return 1;
}
}
