
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let c;
class Element{
 constructor(tag){
  this.tag=tag;this.children=[];this.attributes={};this.events={};
  this.style={setProperty(){}};this.disabled=false;this.hidden=false;
 }
 append(...items){
  for(const item of items){item.parentNode=this;this.children.push(item);}
 }
 appendChild(item){this.append(item);return item;}
 replaceChildren(...items){
  for(const item of this.children)item.parentNode=null;
  this.children=[];this.append(...items);
 }
 setAttribute(key,value){this.attributes[key]=String(value);}
 addEventListener(name,fn){this.events[name]=fn;}
 get isConnected(){return this===host||!!this.parentNode?.isConnected;}
 querySelectorAll(selector){
  return this.children.flatMap(item=>[
   ...(selector==='button'&&item.tag==='button'?[item]:[]),
   ...item.querySelectorAll(selector)]);
 }
 getContext(){return new Proxy({},{get:()=>()=>{},set:()=>true});}
 focus(){c.document.activeElement=this;}
}
const host=new Element('host'),calls=[];let badgeMask=0;
const data={leaders:Array.from({length:8},(_,i)=>({
 id:'leader'+i,name:'Leader '+i,city:'Town '+i,
 badge:'Badge '+i,color:'#888',team:[[25,5+i]]
}))};
c={
 console,Date,Math,Object,Number,Array,JSON,Promise,Map,Set,Uint8Array,ArrayBuffer,
 screen:'activity',cardPage:4,tpSaveReplacing:false,choice:'none',
 dragStart:null,dragNow:null,performance:{now:()=>1000},
 TPKantoArena:data,statusEl:{},
 document:{
  visibilityState:'visible',createElement:tag=>new Element(tag),
  getElementById:()=>host,addEventListener(){}
 },
 addEventListener(){},TPTrainer:{canOpen:()=>true},
 TPRegions:{
  selected:0,available:id=>id===0,catalog:()=>({arena:data}),
  remember:()=>true,locked:()=>false,
  call:(mod,r,name,type,args)=>mod.ccall(name,type,[],args)
 },
 TPTrainerArt:{picture:async()=>({image:{width:80,height:80}})},
 TPOpponentTeam:{header(){},draw(){}},
 fns:{dexName:id=>'Species '+id,dexType1:()=>1,dexType2:()=>0},
 TYPE_NAMES:['','Normal'],typeColor565:()=>0,rgb565:()=>'#555555',
 spriteFor:()=>null,ensureSprite(){},TPAct:{idle:0},
 UI:{ink:'#000'},roundRect(){},
 ctx:new Proxy({},{get:()=>()=>{},set:()=>true}),
 Module:{
  ccall(name){calls.push(name);return name==='tp_f3_mask'?badgeMask:0;},
  _tp_battle_close(){calls.push('close');}
 }
};
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/arena.js','utf8'),c);
assert(c.TPArena.open('activity'));c.TPArena.draw();
const page=host.children.find(e=>e.id==='tp-arena-page');
assert(page&&!page.hidden);
const find=(attr,value)=>page.querySelectorAll('button').find(e=>
 Object.prototype.hasOwnProperty.call(e.attributes,attr)&&
 (value===undefined||e.attributes[attr]===value));
const click=e=>{assert(e&&!e.disabled);e.events.click();};
assert.equal(page.querySelectorAll('button')
 .filter(e=>'data-arena-leader' in e.attributes).length,8);
click(find('data-arena-leader','2'));
assert.equal(c.screen,'arena');
assert.equal(find('data-arena-leader','2').attributes['aria-pressed'],'true');
assert(!calls.some(name=>/prepare|begin|attach|start/.test(name)));
click(find('data-arena-open'));
assert.equal(page.attributes['data-arena-view'],'detail');
assert.equal(c.screen,'arena');
click(find('data-arena-subback'));
assert.equal(page.attributes['data-arena-view'],'leaders');
assert(find('data-arena-region-toggle'));
assert(find('data-arena-option','badges'));
assert.equal(find('data-arena-option','league').disabled,true);
assert.equal(find('data-arena-options'),undefined);
click(find('data-arena-option','badges'));
assert.equal(page.attributes['data-arena-view'],'case');
assert.equal(page.querySelectorAll('button')
 .filter(e=>'data-arena-case-badge' in e.attributes).length,8);
click(find('data-arena-case-badge','1'));
click(find('data-arena-open'));
assert.equal(page.attributes['data-arena-view'],'detail');
click(find('data-arena-subback'));
assert.equal(page.attributes['data-arena-view'],'case');
click(find('data-arena-subback'));
assert.equal(page.attributes['data-arena-view'],'leaders');
badgeMask=255;c.TPArena.draw();
assert.equal(find('data-arena-option','league').disabled,false);
assert.equal(page.querySelectorAll('button')
 .filter(e=>e.attributes['data-owned']==='true').length,8);
click(find('data-arena-exit'));
assert.equal(c.screen,'activity');assert(page.hidden);
assert(!calls.some(name=>/prepare|begin|attach|start/.test(name)));
console.log('Arena selection DOM passed: eight actual controls, selected leader, read-only browsing, explicit detail opening, options and activity return. Native gameplay mocked; browser proof remains separate.');
