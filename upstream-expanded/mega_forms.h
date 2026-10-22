#pragma once
#include <stdint.h>
#include "dex.h"
struct TPMegaForm {uint8_t id,stoneBit;int16_t dex;const char *baseName,*name;uint8_t type1,type2;};
static const TPMegaForm TP_MEGA_FORMS[]={
 {1,1,6,"Glurak","Mega-Glurak X",TYPE_FIRE,TYPE_DRAGON},
 {2,2,376,"Metagross","Mega-Metagross",TYPE_STEEL,TYPE_PSYCHIC},
 {3,4,303,"Flunkifer","Mega-Flunkifer",TYPE_STEEL,TYPE_FAIRY}
};
inline const TPMegaForm *tpMegaById(uint8_t id){for(const auto &f:TP_MEGA_FORMS)if(f.id==id)return &f;return nullptr;}
inline const TPMegaForm *tpMegaByDex(int16_t dex){for(const auto &f:TP_MEGA_FORMS)if(f.dex==dex)return &f;return nullptr;}
