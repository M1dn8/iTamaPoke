
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
 removeAttribute(key){delete this.attributes[key];}
 addEventListener(key,fn){this.events[key]=fn;}
 get isConnected(){return this===host||!!this.parentNode?.isConnected;}
 querySelectorAll(selector){
  return this.children.flatMap(item=>[
   ...(selector==='button'&&item.tag==='button'?[item]:[]),
   ...item.querySelectorAll(selector)]);
 }
 getContext(){return new Proxy({},{get:()=>()=>{},set:()=>true});}
 focus(){c.document.activeElement=this;}
}
const host=new Element('host'),calls=[];
const state={
 supported:1,legacy:0,legacyDate:0,wins:2,seen:1,variants:1,pendingCeremony:1,
 records:[
  {sequence:1,dex:150,level:90,shiny:1,form:0,date:1700000000,
   variant:0,nick:'Old winner'},
  {sequence:2,date:1700000001,variant:0,winnerId:9,
   team:{active:0,members:[
    {id:8,dex:25,level:20,shiny:false,nick:'Saved one',wins:10,levelGains:10},
    {id:9,dex:26,level:30,shiny:true,nick:'Saved two',wins:16,levelGains:16}
   ]}}
 ]
};
const baseline=JSON.stringify(state);
c={
 console,Date,Math,Object,Number,Array,JSON,Promise,Map,Set,WeakMap,
 performance:{now:()=>1000},screen:'league',tpSaveReplacing:false,
 tpSaveEpoch:0,dragStart:null,dragNow:null,statusEl:{},
 document:{
  visibilityState:'visible',createElement:tag=>new Element(tag),
  getElementById:()=>host,addEventListener(){}
 },
 TPRegions:{
  available:id=>id===0,
  call:(mod,r,name,type,args)=>mod.ccall(name,type,[],args)
 },
 TPText:{t:key=>key},
 fns:{dexName:id=>'Species '+id,speciesId:()=>1},
 spriteFor:()=>null,ensureSprite(){},addEventListener(){},
 TPRewardEgg:{
  active:false,busy:false,
  open(){this.active=true;return true;},draw(){}
 },
 Module:{
  _tp_hall_view(){},
  ccall(name){
   calls.push(name);
   if(name==='tp_hall_view')return JSON.stringify(state);
   if(name==='tp_lg_view')return '{"live":0}';
   throw Error('Unexpected native write: '+name);
  }
 }
};
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/league-hall.js','utf8'),c);
assert(c.TPHall.open(false,0));c.TPHall.draw();
const page=host.children.find(item=>item.id==='tp-hall-page');
assert(page&&!page.hidden);
if(c.TPHall.layoutVariant===4){
 const walk=node=>[node,...node.children.flatMap(walk)];
 assert.equal(page.attributes['data-hall-detail-revision'],'1');
 const certificate=walk(page).find(node=>
  node.attributes['data-hall-certificate']==='true');
 assert(certificate);
 const content=walk(certificate).map(node=>node.textContent||'').join(' ');
 assert(content.includes('Saved one'));
 assert(!content.includes('Start-Lv.'));
 assert(!content.includes('Siege:'));
 assert(!content.includes('Levelgewinne:'));
 assert(walk(page).some(node=>
  node.attributes['data-hall-back-icon']==='curved-left'));
 const tiles=()=>walk(page).filter(node=>'data-hall-team-index' in node.attributes);
 assert.equal(tiles().length,2);
 tiles()[1].events.click();
 assert.equal(c.TPHall.diagnostics.memberSelected,1);
 tiles()[0].events.click();
 assert.equal(c.TPHall.diagnostics.memberSelected,0);

}
if(c.TPHall.layoutVariant===4){
 assert.equal(host.attributes['data-hall-layout'],'v4');
 assert.equal(page.attributes['data-hall-layout-variant'],'4');
}
const find=attr=>page.querySelectorAll('button')
 .find(item=>attr in item.attributes);
const click=el=>{assert(el&&!el.disabled);el.events.click();};
if(c.TPHall.layoutVariant===4){
 assert.equal(find('data-hall-member-next'),undefined);
 assert.equal(find('data-hall-member-prev'),undefined);
 const tile=page.querySelectorAll('button')
  .find(item=>item.attributes['data-hall-team-index']==='1');
 click(tile);
}else{
 click(find('data-hall-member-next'));
}
assert.equal(c.TPHall.diagnostics.memberSelected,1);
click(find('data-hall-record-prev'));
assert.equal(c.TPHall.diagnostics.selected,0);
click(find('data-hall-record-next'));
assert.equal(c.TPHall.diagnostics.memberSelected,0);
click(find('data-hall-celebrate'));
assert(c.TPHall.diagnostics.celebration);
assert(find('data-hall-acknowledge'));
assert(find('data-hall-record-next').disabled);
assert.equal(JSON.stringify(state),baseline);
assert(calls.every(name=>name==='tp_hall_view'||name==='tp_lg_view'));
click(find('data-hall-back'));
assert.equal(c.TPHall.active,false);assert(page.hidden);
assert.equal(host.attributes['data-hall-layout'],undefined);
console.log('Hall DOM passed: stored member/record navigation, ceremony UI without writes, unchanged snapshots and clean close. Native completion/reward transactions checked separately.');
