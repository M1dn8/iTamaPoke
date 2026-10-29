 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const G=require('../browser_ver/web/mew-hide-game.js');

let sequence=[0,.5,0],position=0;
const round=G.createRound(()=>sequence[position++]);
assert.equal(round.view().phase,'idle');
assert(!round.choose(0,0).accepted);
assert(round.start());assert(!round.start());
assert.equal(round.view().hidden,0);
const first=round.view();
for(const invalid of [-1,3,NaN,1.5,'0'])
 assert(!round.choose(invalid,first.revision).accepted);
assert.deepEqual(round.view(),first);

assert.deepEqual(
 round.choose(1,first.revision),{accepted:true,found:false}
);
assert.equal(round.view().hits,0);
assert.equal(round.view().hidden,0);
assert.equal(round.view().hint,'ears');
assert(!round.choose(0,first.revision).accepted);

for(let i=0;i<3;i++){
 const before=round.view();
 assert(round.choose(before.hidden,before.revision).found);
 const after=round.view();
 if(after.phase!=='complete')
  assert.notEqual(after.hidden,before.hidden);
 assert(!round.choose(0,before.revision).accepted);
}
assert.equal(round.view().hits,3);
assert.equal(round.view().phase,'complete');
assert(!round.start());
round.cancel();
assert.equal(round.view().phase,'complete');
assert(Object.isFrozen(round.view()));
assert(Object.isFrozen(round.view().places));

const retry=G.createRound(()=>0);
retry.start();
const old=retry.view().revision;
retry.cancel();assert(retry.start());
assert(!retry.choose(0,old).accepted);
assert.equal(retry.view().hits,0);

for(const value of [NaN,Infinity,-.1,1,'0']){
 const bad=G.createRound(()=>value);
 assert.throws(()=>bad.start(),/INVALID_MEW_RANDOM/);
 assert.equal(bad.view().phase,'idle');
}
assert.throws(()=>G.createRound(0),/INVALID_MEW_RANDOM/);

const values=[0,NaN,.5];
let n=0;
const transactional=G.createRound(()=>values[n++]);
transactional.start();
const beforeBad=transactional.view();
assert.throws(
 ()=>transactional.choose(0,beforeBad.revision),/INVALID_MEW_RANDOM/
);
assert.deepEqual(transactional.view(),beforeBad);
assert(transactional.choose(0,beforeBad.revision).found);

console.log(
 'Mew hide logic passed: three finds, a different hiding place after '+
 'success, same-round new hint after wrong choice, stale-input refusal, '+
 'free restart, validated randomness and immutable state. '+
 'No timer or native reward authority.'
);

class E{
 constructor(tag){
  this.tagName=tag;this.children=[];this.parent=null;this.dataset={};
  this.attributes={};this.listeners=new Map();this.style={};
  this.disabled=false;this.hidden=false;this.connected=false;
 }
 get isConnected(){return this.connected||!!this.parent?.isConnected;}
 append(...nodes){
  for(const node of nodes){
   node.remove();node.parent=this;this.children.push(node);
  }
 }
 appendChild(node){this.append(node);return node;}
 replaceChildren(...nodes){
  for(const old of this.children)old.parent=null;
  this.children=[];this.append(...nodes);
 }
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
 focus(){doc.activeElement=this;}
 emit(k,data={}){
  const event={
   defaultPrevented:false,
   preventDefault(){this.defaultPrevented=true;},
   ...data
  };
  if(!this.disabled)
   for(const fn of [...(this.listeners.get(k)||[])])fn(event);
  return event;
 }
}
function find(node,p){
 if(p(node))return node;
 for(const child of node.children){
  const hit=find(child,p);if(hit)return hit;
 }
 return null;
}

const doc=new E('document');
doc.visibilityState='visible';
doc.head=new E('head');doc.head.connected=true;
doc.createElement=tag=>new E(tag);
doc.getElementById=id=>find(doc.head,n=>n.id===id);

const locales={};
const context={
 document:doc,
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
 'browser_ver/web/mew-hide-game.js','utf8'
);
vm.runInContext(source,context);
const UI=context.TPMewHideGame;
assert.equal(UI.text('complete'),'Versteckspiel geschafft!');
const keys=Object.keys(locales.en).sort();
assert.equal(keys.length,16);
for(const code of ['en','de','es','fr'])
 assert.deepEqual(Object.keys(locales[code]).sort(),keys);
assert(!/\b(?:Module|localStorage|indexedDB)\b/.test(source));

const host=new E('host');host.connected=true;
const action=()=>find(host,n=>n.className==='tp-mew-hide-action');
const body=()=>find(host,n=>n.className==='tp-mew-hide-game');
const hint=()=>find(
 host,n=>n.className==='tp-mew-hide-card'&&!!n.dataset.hint
);
const card=i=>find(
 host,n=>n.className==='tp-mew-hide-card'&&n.dataset.place===String(i)
);
const flush=async()=>{
 for(let i=0;i<5;i++)await Promise.resolve();
};
function solve(){
 for(let i=0;i<3;i++)hint().emit('click');
}

(async()=>{
 let enabled=true,calls=0,outcome=false;
 const game=UI.create({
  random:()=>0,available:()=>enabled,
  complete:async()=>{calls++;return outcome;}
 });
 assert(!game.start());
 game.attach(host,true);assert(!game.start());
 game.attach(host,false);assert(game.start());

 enabled=false;hint().emit('click');
 assert.equal(body().dataset.hits,'0');
 enabled=true;
 card(2).emit('click');
 assert.equal(body().dataset.hits,'0');
 assert.equal(hint().dataset.hint,'ears');

 const stale=hint();
 stale.focus();stale.emit('click');
 assert.equal(body().dataset.hits,'1');
 stale.emit('click');
 assert.equal(body().dataset.hits,'1');
 assert(!stale.isConnected);
 assert(
  card(0).emit('keydown',{key:'Enter',repeat:true}).defaultPrevented
 );

 hint().emit('click');hint().emit('click');
 assert(game.solved);assert.equal(calls,1);
 action().emit('click');assert.equal(calls,1);
 await flush();
 assert(game.solved);
 assert.equal(action().textContent,'Speichern erneut versuchen');

 outcome=true;
 action().emit('click');await flush();
 assert.equal(calls,2);
 action().emit('click');assert.equal(calls,2);
 game.dispose();game.dispose();
 assert.equal(host.children.length,0);
 assert.throws(()=>game.attach(host,false),/DISPOSED_MEW_GAME/);
 assert.equal((doc.listeners.get('visibilitychange')||[]).length,0);

 let finish,pendingCalls=0;
 const pending=UI.create({
  random:()=>0,available:()=>true,
  complete:()=>{
   pendingCalls++;
   return new Promise(resolve=>{finish=resolve;});
  }
 });
 pending.attach(host,false);pending.start();solve();
 assert.equal(pendingCalls,1);
 pending.dispose();finish(true);await flush();
 assert.equal(host.children.length,0);

 const rejected=UI.create({
  random:()=>0,available:()=>true,
  complete:async()=>{throw Error('quota');}
 });
 rejected.attach(host,false);rejected.start();solve();
 await flush();
 assert(rejected.solved);
 assert.equal(action().textContent,'Speichern erneut versuchen');
 assert(!action().disabled);
 rejected.dispose();

 const background=UI.create({
  random:()=>0,available:()=>true,complete:async()=>true
 });
 background.attach(host,false);background.start();
 hint().emit('click');
 doc.visibilityState='hidden';doc.emit('visibilitychange');
 assert(!background.start());
 doc.visibilityState='visible';doc.emit('visibilitychange');
 assert(background.start());
 assert.equal(body().dataset.hits,'0');
 background.dispose();

 assert.equal(
  doc.head.children.filter(n=>n.id==='tp-mew-hide-style').length,1
 );
 assert.equal((doc.listeners.get('visibilitychange')||[]).length,0);

 console.log(
  'Mew hide DOM-double checks passed: primary game controls, accessible '+
  'clues, detached/stale-click refusal, keyboard-repeat guard, busy/'+
  'background handling, one completion callback, false/throw save retry '+
  'without replay, disposal during save and four locales. '+
  'No real touch/layout/browser acceptance claim.'
 );
})().catch(error=>{
 console.error(error);process.exit(1);
});
