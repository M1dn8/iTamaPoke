 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const G=require('../browser_ver/web/psi-barrier-game.js');

const round=G.createRound();
assert.equal(round.view().phase,'idle');
assert(!round.press(0).accepted);
assert(round.start(0));assert(!round.start(1));
assert.deepEqual(round.press(100),{accepted:true,hit:false});
assert.equal(round.view().feedback,'early');
assert(!round.press(1440).accepted);
assert.equal(round.view().hits,0);
assert.equal(round.tick(2400).feedback,'');
assert.deepEqual(round.press(3840),{accepted:true,hit:true});
assert(!round.press(3900).accepted);
assert.equal(round.view().hits,1);
assert.deepEqual(round.press(6800),{accepted:true,hit:false});
assert.equal(round.view().feedback,'late');
assert.equal(round.view().hits,1);
assert(round.press(8640).hit);
assert(round.press(11040).hit);
assert.equal(round.view().hits,3);
assert.equal(round.view().phase,'complete');
assert(!round.press(13440).accepted);
assert(!round.start(13440));
round.cancel();
assert.equal(round.view().phase,'complete');
assert(Object.isFrozen(round.view()));
for(const bad of [-1,NaN,Infinity,100])
 assert.throws(()=>round.tick(bad),/INVALID_PSI_CLOCK/);

for(const t of [1120,1760]){
 const boundary=G.createRound();
 boundary.start(0);
 assert(boundary.press(t).hit);
}
const noDeadline=G.createRound();
noDeadline.start(0);
assert.equal(noDeadline.tick(100*2400).phase,'running');
assert(noDeadline.press(100*2400+1440).hit);
noDeadline.cancel();
assert.equal(noDeadline.view().phase,'idle');
assert(noDeadline.start(250000));
assert.equal(noDeadline.view().hits,0);

console.log(
 'Mewtu psi logic passed: target boundaries, three cumulative impulses, '+
 'early/late refusal, one input per cycle, no overall deadline, '+
 'free restart and immutable state.'
);

class E{
 constructor(tag){
  this.tagName=tag;this.children=[];this.parent=null;this.dataset={};
  this.attributes={};this.listeners=new Map();this.style={};
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
 emit(k,data={}){
  if(this.disabled)return;
  for(const fn of [...(this.listeners.get(k)||[])])
   fn({detail:1,preventDefault(){},...data});
 }
}
function find(n,p){
 if(p(n))return n;
 for(const c of n.children){
  const f=find(c,p);if(f)return f;
 }
 return null;
}

const doc=new E('document');
doc.visibilityState='visible';
doc.head=new E('head');doc.head.connected=true;
doc.createElement=tag=>new E(tag);
doc.createElementNS=(_,tag)=>new E(tag);
doc.getElementById=id=>find(doc.head,n=>n.id===id);

let now=0,serial=0;
const frames=new Map(),locales={};
const context={
 document:doc,
 performance:{now:()=>now},
 requestAnimationFrame:fn=>{
  frames.set(++serial,fn);return serial;
 },
 cancelAnimationFrame:id=>frames.delete(id),
 TPText:{
  registerLocale(code,entries){
   locales[code]={...(locales[code]||{}),...entries};
  },
  t(key,params={}){
   return locales.de[key].replace(
    /\{(\w+)\}/g,(_,k)=>String(params[k])
   );
  }
 }
};
vm.createContext(context);
const source=fs.readFileSync(
 'browser_ver/web/psi-barrier-game.js','utf8'
);
vm.runInContext(source,context);
const UI=context.TPPsiBarrierGame;
assert.equal(UI.text('complete'),'Barriere aufgelöst!');
const keys=Object.keys(locales.en).sort();
assert.equal(keys.length,13);
for(const code of ['de','en','es','fr'])
 assert.deepEqual(Object.keys(locales[code]).sort(),keys);
assert(!/\b(?:Module|localStorage|indexedDB)\b/.test(source));

const host=new E('host');host.connected=true;
const field=()=>find(host,n=>n.className==='tp-psi-field');
const action=()=>find(host,n=>n.className==='tp-psi-action');
const body=()=>find(host,n=>n.className==='tp-psi-game');

function advance(time){
 now=time;
 for(const [id,fn] of [...frames]){
  frames.delete(id);fn();
 }
}
function down(id=1){
 field().emit('pointerdown',{
  isPrimary:true,button:0,pointerId:id
 });
}
function up(id=1){doc.emit('pointerup',{pointerId:id});}
function solve(base){
 for(let i=0;i<3;i++){
  advance(base+i*2400+1440);down();up();
 }
}
const flush=async()=>{
 for(let i=0;i<5;i++)await Promise.resolve();
};

(async()=>{
 let enabled=true,calls=0,outcome=false;
 const game=UI.create({
  available:()=>enabled,
  complete:async()=>{calls++;return outcome;}
 });
 assert(!game.start());
 game.attach(host,true);assert(!game.start());
 game.attach(host,false);assert(game.start());

 advance(1440);
 field().emit('pointerdown',{
  isPrimary:false,button:0,pointerId:2
 });
 assert.equal(body().dataset.hits,'0');

 enabled=false;down();
 assert.equal(body().dataset.hits,'0');
 enabled=true;
 down();assert.equal(body().dataset.hits,'1');

 advance(3840);down();
 assert.equal(body().dataset.hits,'1');
 up();down();up();
 assert.equal(body().dataset.hits,'2');

 advance(6240);
 field().emit('keydown',{key:'Enter',repeat:true});
 assert.equal(body().dataset.hits,'2');
 field().emit('keydown',{key:'Enter',repeat:false});
 assert(game.solved);assert.equal(calls,1);
 doc.emit('keyup',{key:'Enter'});

 action().emit('click');assert.equal(calls,1);
 await flush();
 assert(game.solved);
 assert.equal(action().textContent,'Speichern erneut versuchen');

 outcome=true;
 action().emit('click');await flush();
 assert.equal(calls,2);
 action().emit('click');assert.equal(calls,2);
 game.dispose();assert.equal(frames.size,0);
 assert.throws(()=>game.attach(host,false),/DISPOSED_PSI_GAME/);

 for(const type of [
  'pointerup','pointercancel','keyup','visibilitychange'
 ])assert.equal((doc.listeners.get(type)||[]).length,0);

 now=10000;
 let finish,pendingCalls=0;
 const pending=UI.create({
  available:()=>true,
  complete:()=>{
   pendingCalls++;
   return new Promise(resolve=>{finish=resolve;});
  }
 });
 pending.attach(host,false);
 assert(pending.start());
 solve(10000);assert.equal(pendingCalls,1);
 pending.dispose();finish(true);await flush();
 assert.equal(host.children.length,0);
 assert.equal(frames.size,0);

 now=20000;
 const rejected=UI.create({
  available:()=>true,
  complete:async()=>{throw Error('quota');}
 });
 rejected.attach(host,false);
 rejected.start();solve(20000);await flush();
 assert(rejected.solved);
 assert.equal(action().textContent,'Speichern erneut versuchen');
 assert(!action().disabled);
 rejected.dispose();

 now=30000;
 const visible=UI.create({
  available:()=>true,complete:async()=>true
 });
 visible.attach(host,false);visible.start();
 doc.visibilityState='hidden';doc.emit('visibilitychange');
 assert.equal(frames.size,0);
 assert(!visible.start());
 doc.visibilityState='visible';doc.emit('visibilitychange');
 assert(visible.start());

 advance(31440);
 field().emit('click',{detail:0});
 assert.equal(body().dataset.hits,'1');
 visible.dispose();
 assert.equal(
  doc.head.children.filter(n=>n.id==='tp-psi-game-style').length,1
 );

 console.log(
  'Mewtu psi DOM-double checks passed: primary-pointer/held-key guards, '+
  'availability, single-flight save, false/throw retry without replay, '+
  'disposal during save, background restart, accessible click and four '+
  'locales. No real touch/layout/browser acceptance claim.'
 );
})().catch(error=>{
 console.error(error);process.exit(1);
});
