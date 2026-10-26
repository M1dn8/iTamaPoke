#pragma once
#include <cstdint>
class Pet;
namespace tp_league_team {struct State;}
#if defined(__EMSCRIPTEN__) || defined(TP_HALL_TEST)
bool tpHallSupported();
bool tpHallSupportedFor(int);
bool tpHallStageTeamWinFor(int,const tp_league_team::State&,uint32_t);
bool tpHallStageWin(const Pet&,uint8_t level,uint8_t form,uint32_t life,uint8_t variant,uint32_t date);
bool tpHallStageSeen();
bool tpHallStageWinFor(int,const Pet&,uint8_t,uint8_t,uint32_t,uint8_t,uint32_t);
bool tpHallStageSeenFor(int);
#else
inline bool tpHallSupported(){return true;}
inline bool tpHallStageWin(const Pet&,uint8_t,uint8_t,uint32_t,uint8_t,uint32_t){return true;}
inline bool tpHallStageSeen(){return false;}
inline bool tpHallSupportedFor(int region){return region==0&&tpHallSupported();}
inline bool tpHallStageWinFor(int region,const Pet&p,uint8_t l,uint8_t f,uint32_t life,uint8_t v,uint32_t date){return region==0&&tpHallStageWin(p,l,f,life,v,date);}
inline bool tpHallStageSeenFor(int){return false;}
#endif
