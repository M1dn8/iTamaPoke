 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const G=require('../browser_ver/web/victory-road-game.js');

const initial=G.createRound();
assert.equal(initial.view().phase,'idle');
assert(!initial.move(15));assert(!initial.select(20));assert(!initial.reset());
assert(initial.start());assert(!initial.start());
const pristine=initial.view();
for(const bad of [-1,25,NaN,Infinity,'20',null,0])
 assert(!initial.select(bad));
assert.deepEqual(initial.view(),pristine);
assert(initial.select(20));
for(const bad of [19,16,21,22,-1,25,NaN,'15'])
 assert(!initial.move(bad));
assert.equal(initial.view().moves,0);
assert(initial.move(15));assert.equal(initial.view().selected,15);
assert(initial.reset());assert.deepEqual(initial.view().rocks,[20,21,22]);
assert.equal(initial.view().moves,0);assert.equal(initial.view().selected,null);

const collision=G.createRound();collision.start();collision.select(20);
for(const to of [15,10,11,12,17])assert(collision.move(to));
const beforeCollision=collision.view();assert(!collision.move(22));
assert.deepEqual(collision.view(),beforeCollision);

const paths=[
 [20,15,10,11,12,7,2,1,0],
 [22,17,12,7,2,1],
 [21,22,17,12,7,2]
];
for(const path of paths){
 assert(initial.select(path[0]));
 for(const to of path.slice(1))assert(initial.move(to));
}
assert.equal(initial.view().phase,'complete');
assert.equal(initial.view().placed,3);
assert.equal(initial.view().moves,18);
assert(!initial.start());assert(!initial.reset());
assert(!initial.move(7));assert(!initial.select(2));
initial.cancel();assert.equal(initial.view().phase,'complete');
for(const value of [
 initial.view(),initial.view().rocks,initial.view().goals,initial.view().floors
])assert(Object.isFrozen(value));
assert.throws(()=>initial.view().rocks.push(1),TypeError);

const cancelled=G.createRound();
cancelled.start();cancelled.select(20);cancelled.move(15);cancelled.cancel();
assert.equal(cancelled.view().phase,'idle');assert(cancelled.start());
assert.deepEqual(cancelled.view().rocks,[20,21,22]);
assert.equal(cancelled.view().moves,0);

const key=state=>[...state].sort((a,b)=>a-b).join(',');
const base=G.createRound().view(),floor=new Set(base.floors);
const queue=[base.goals],distance=new Map([[key(base.goals),0]]);
for(let head=0;head<queue.length;head++){
 const state=queue[head];
 for(const rock of state)for(const to of floor){
  if(state.includes(to)||
     Math.abs(rock%5-to%5)+
     Math.abs(Math.floor(rock/5)-Math.floor(to/5))!==1)continue;
  const next=state.map(p=>p===rock?to:p),id=key(next);
  if(!distance.has(id)){
   distance.set(id,distance.get(key(state))+1);queue.push(next);
  }
 }
}
assert.equal(base.goals.length,3);
assert.equal(distance.size,220);
assert.equal(distance.size,floor.size*(floor.size-1)*(floor.size-2)/6);
assert.equal(distance.get(key(base.rocks)),18);
console.log(
 'Lavados revised rock logic passed: three rocks, shared bottleneck, '+
 'legal moves, collision refusal, free reset/cancel and immutable views; '+
 '220 reachable placements and an eighteen-move minimum. No visual acceptance claim.'
);

class FakeNode{
 constructor(tag){
  this.tagName=tag;this.children=[];this.parent=null;this.dataset={};
  this.attributes={};this.listeners=new Map();
  this.disabled=false;this.hidden=false;this.connected=false;
 }
 get isConnected(){return this.connected||!!this.parent?.isConnected;}
 append(...nodes){
  for(const n of nodes){
   n.remove();n.parent=this;this.children.push(n);
  }
 }
 appendChild(n){this.append(n);return n;}
 remove(){
  if(this.parent){
   this.parent.children=this.parent.children.filter(n=>n!==this);
   this.parent=null;
  }
 }
 setAttribute(k,v){this.attributes[k]=String(v);}
 addEventListener(k,fn){
  this.listeners.set(k,[...(this.listeners.get(k)||[]),fn]);
 }
 removeEventListener(k,fn){
  this.listeners.set(k,(this.listeners.get(k)||[]).filter(f=>f!==fn));
 }
 emit(k){
  if(this.disabled)return;
  for(const fn of [...(this.listeners.get(k)||[])])fn({detail:1});
 }
}
function find(node,predicate){
 if(predicate(node))return node;
 for(const child of node.children){
  const found=find(child,predicate);
  if(found)return found;
 }
 return null;
}

const doc=new FakeNode('document');
doc.visibilityState='visible';
doc.head=new FakeNode('head');
doc.head.connected=true;
doc.createElement=tag=>new FakeNode(tag);
doc.getElementById=id=>find(doc.head,n=>n.id===id);

const locales={};
const context={
 document:doc,
 TPText:{
  registerLocale(code,entries){
   locales[code]={...(locales[code]||{}),...entries};
  },
  t(name,params={}){
   return locales.de[name].replace(
    /\{(\w+)\}/g,(_,k)=>String(params[k])
   );
  }
 }
};
vm.createContext(context);
const source=fs.readFileSync(
 'browser_ver/web/victory-road-game.js','utf8'
);
vm.runInContext(source,context);
const UI=context.TPVictoryRoadGame;

assert.equal(UI.text('complete'),'Durchgang freigelegt!');
const expectedKeys=Object.keys(locales.en).sort();
assert.equal(expectedKeys.length,14);
for(const code of ['de','en','es','fr']){
 assert.deepEqual(Object.keys(locales[code]).sort(),expectedKeys);
 for(const value of Object.values(locales[code]))
  assert.equal(typeof value,'string');
}
assert(!/\b(?:Module|localStorage|indexedDB)\b/.test(source));

const host=new FakeNode('host');
host.connected=true;
const cell=i=>find(
 host,n=>n.tagName==='button'&&n.dataset.cell===String(i)
);
const control=action=>find(host,n=>n.dataset.action===action);
const flush=async()=>{
 for(let i=0;i<5;i++)await Promise.resolve();
};
function solveUI(){
 for(const path of paths){
  cell(path[0]).emit('click');
  for(const to of path.slice(1))cell(to).emit('click');
 }
}

(async()=>{
 let enabled=true,calls=0,outcome=false;
 const game=UI.create({
  available:()=>enabled,
  complete:async()=>{calls++;return outcome;}
 });
 assert(!game.start());
 game.attach(host,false);
 assert(game.start());
 assert(!game.start());

 enabled=false;
 cell(20).emit('click');
 assert.equal(cell(20).attributes['aria-pressed'],'false');

 enabled=true;
 game.attach(host,true);
 cell(20).emit('click');
 assert.equal(cell(20).attributes['aria-pressed'],'false');

 game.attach(host,false);
 cell(20).emit('click');
 cell(15).emit('click');
 control('reset').emit('click');
 assert.equal(cell(20).dataset.rock,'true');

 doc.visibilityState='hidden';
 doc.emit('visibilitychange');
 assert(!game.start());
 doc.visibilityState='visible';
 doc.emit('visibilitychange');
 assert(game.start());

 solveUI();
 assert(game.solved);
 assert.equal(calls,1);
 control('start').emit('click');
 assert.equal(calls,1);

 await flush();
 assert(game.solved);
 assert(!control('start').disabled);
 assert.equal(control('start').textContent,'Speichern erneut versuchen');

 outcome=true;
 control('start').emit('click');
 await flush();
 assert.equal(calls,2);
 control('start').emit('click');
 assert.equal(calls,2);
 game.attach(host,false);
 control('start').emit('click');
 assert.equal(calls,2);

 game.dispose();
 game.dispose();
 assert.equal(host.children.length,0);
 assert.throws(
  ()=>game.attach(host,false),/DISPOSED_VICTORY_GAME/
 );
 assert.equal((doc.listeners.get('visibilitychange')||[]).length,0);

 let pendingResolve,pendingCalls=0;
 const deferred=UI.create({
  available:()=>true,
  complete:()=>{
   pendingCalls++;
   return new Promise(resolve=>{pendingResolve=resolve;});
  }
 });
 deferred.attach(host,false);
 assert(deferred.start());
 solveUI();
 assert.equal(pendingCalls,1);
 control('reset').emit('click');
 control('start').emit('click');
 assert.equal(pendingCalls,1);
 deferred.dispose();
 pendingResolve(true);
 await flush();
 assert.equal(host.children.length,0);
 assert.equal((doc.listeners.get('visibilitychange')||[]).length,0);

 const rejected=UI.create({
  available:()=>true,
  complete:async()=>{throw Error('quota');}
 });
 rejected.attach(host,false);
 rejected.start();
 solveUI();
 await flush();
 assert(rejected.solved);
 assert(!control('start').disabled);
 assert.equal(control('start').textContent,'Speichern erneut versuchen');
 rejected.dispose();

 assert.equal(
  doc.head.children.filter(n=>n.id==='tp-victory-game-style').length,1
 );
 console.log(
  'Lavados game DOM-double checks passed: lifecycle, disabled/background '+
  'guards, reset, visibility restart, single-flight completion, '+
  'false/throw save retry, no duplicate callback after success, disposal '+
  'during save and four locale catalogues. DOM doubles only; no real-'+
  'browser, touch, layout or iPhone acceptance claim.'
 );
})().catch(error=>{
 console.error(error);
 process.exit(1);
});
