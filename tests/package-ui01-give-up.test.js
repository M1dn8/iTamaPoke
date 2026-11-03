
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/battle-view.js','utf8');
const first=source.indexOf('/* UI01 in-game give-up confirmation:');
assert(first>=0);
let c,open=true,calls=0,current;
class El{
 constructor(tag){
  this.tag=tag;this.children=[];this.attributes={};this.events={};this.hidden=false;
 }
 append(...items){
  for(const item of items){item.parent=this;this.children.push(item);}
 }
 replaceChildren(){this.children=[];}
 setAttribute(k,v){this.attributes[k]=String(v);}
 addEventListener(k,fn){this.events[k]=fn;}
 focus(){c.document.activeElement=this;}
 get isConnected(){return this===host||!!this.parent?.isConnected;}
 querySelectorAll(){
  const walk=n=>n.children.flatMap(x=>[x,...walk(x)]);
  return walk(this).filter(x=>x.tag==='button');
 }
}
const host=new El('host'),events={},texts={};
c={Object,String,Number,console,tpSaveReplacing:false,requestAnimationFrame(){},
 TPText:{
  registerLocale:(lang,entries)=>{if(lang==='de')Object.assign(texts,entries);},
  t:key=>texts[key]
 },
 TPBattleView:{get current(){return current;}},
 TPCollection:{busy:false,blocked:false},TPArena:{busy:false},
 TPLeague:{busy:false,get state(){
  return {live:open?1:0,resolved:0,pending:0,region:0,
   battleId:current.id,round:current.round};
 }},
 document:{
  visibilityState:'visible',activeElement:null,
  createElement:tag=>new El(tag),getElementById:()=>host,
  addEventListener:(key,fn)=>events[key]=fn
 },
 Module:{ccall:name=>name==='tp_battle_is_open'?Number(open):current.id}
};
c.globalThis=c;vm.createContext(c);vm.runInContext(source.slice(first),c);
const button=which=>host.children[0].querySelectorAll()
 .find(x=>x.attributes['data-give-up']===which);
for(const mode of ['wild','trainer','arena','league']){
 current={mode,id:7,region:0,round:2,resolved:false,
  player:{hp:40},enemy:{hp:55},wildTeam:{active:0}};
 open=true;
 c.TPGiveUp.request(current,()=>{calls++;open=false;});
 assert(c.TPGiveUp.pending);
 button('no').events.click();
 assert(!c.TPGiveUp.pending);assert(open);
 c.TPGiveUp.request(current,()=>{calls++;open=false;});
 current={...current,round:3};
 button('yes').events.click();
 assert(open);assert(!c.TPGiveUp.pending);
 c.TPGiveUp.request(current,()=>{calls++;open=false;});
 const yes=button('yes');yes.events.click();yes.events.click();
 assert(!open);assert(!c.TPGiveUp.pending);
}
assert.equal(calls,4);
open=true;c.tpSaveReplacing=true;
c.TPGiveUp.request(current,()=>calls++);
assert(!c.TPGiveUp.pending);assert.equal(calls,4);
console.log('Give-up passed: No, stale round, Yes exactly once and save lock in all four regular battle modes.');
