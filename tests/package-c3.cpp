#include <cassert>
#include <cstring>
#include <iostream>
#include "pet.h"
#include "i18n.h"
#include "battle.h"
uint32_t g_millis=1000;TPSerialShim Serial;static Pet p;Pet &tp_battle_pet(){return p;}
extern "C" int tp_c3_metric(int);
int main(int argc,char**){
 assert(LANG_DEFAULT==LANG_DE);Preferences::store().clear();loadLang();assert(gLang==LANG_DE);
 assert(std::strcmp(dexName(1),"BISASAM")==0&&std::strcmp(T(S_GAME_MEMO),"MERKEN")==0&&std::strcmp(T(S_TYPE_TITLE),"TYPENTRAINING")==0);
 setLang(LANG_EN);loadLang();assert(gLang==LANG_EN&&std::strcmp(dexName(1),"BULBASAUR")==0);setLang(LANG_DE);loadLang();assert(gLang==LANG_DE);
 p.trAtk=98;p.trDef=100;p.trSpe=7;p.hygiene=91;assert(tp_c3_metric(0)==98&&tp_c3_metric(1)==100&&tp_c3_metric(2)==7&&tp_c3_metric(3)==91&&tp_c3_metric(4)==-1);
 for(int d=1;d<=18;d++){int good=0,bad=0;for(int a=1;a<=18;a++){if(battleTypeEffectPct(a,d,TYPE_NONE)>100)good++;else bad++;}assert(good&&bad>=2);}
 if(argc>1){std::cout<<"[";for(int a=0;a<=18;a++){if(a)std::cout<<",";std::cout<<"[";for(int d=0;d<=18;d++){if(d)std::cout<<",";std::cout<<int(battleTypeEffectPct(a,d,TYPE_NONE));}std::cout<<"]";}std::cout<<"]\n";}
 else std::cout<<"C3 native passed: German default and saved choice, labels/names, raw reward metrics, all 18 types.\n";
}
