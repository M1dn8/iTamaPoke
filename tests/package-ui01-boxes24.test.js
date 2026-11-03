
'use strict';
const assert=require('node:assert/strict');
const M=require('../browser_ver/web/collection-model.js');
const B=require('../browser_ver/web/collection-boxes.js');
const snapshot=(origin='wild',data={})=>({
 dex:25,level:17,nickname:'',shiny:false,origin,
 data:{stats:{atk:42,def:31,spe:60},...data}
});
function envelope(state){
 const payload=JSON.stringify(state);
 let hash=2166136261;
 for(const byte of new TextEncoder().encode(payload)){
  hash^=byte;hash=Math.imul(hash,16777619);
 }
 return JSON.stringify({format:'ITC1',payload,
  checksum:(hash>>>0).toString(16).padStart(8,'0')});
}
class Element{
 constructor(tag){
  this.tagName=tag;this.children=[];this.events={};this.style={};
  this.hidden=false;this.disabled=false;this.textContent='';this.value='';
 }
 append(...items){for(const item of items){this.children.push(item);item.parent=this;}}
 appendChild(item){this.append(item);return item;}
 replaceChildren(){this.children=[];}
 setAttribute(key,value){this[key]=value;}
 addEventListener(key,fn){this.events[key]=fn;}
 focus(){}
 querySelectorAll(){return flat(this).filter(x=>x.tagName==='button');}
 async click(){
  if(this.disabled)return;
  this.events.click?.();
  await new Promise(resolve=>setImmediate(resolve));
 }
}
const flat=node=>[node,...node.children.flatMap(flat)];
const button=(root,label)=>{
 const matches=flat(root).filter(x=>x.tagName==='button'&&x.textContent===label);
 assert.equal(matches.length,1,label);return matches[0];
};
(async()=>{
 assert.equal(M.SLOTS,24);assert.equal(M.VERSION,2);
 const legacy={
  schema:'itamapoke.collection',version:1,revision:7,nextId:202,
  boxes:Array.from({length:10},(_,b)=>({
   name:'Alt '+b,slots:Array.from({length:20},(_,i)=>b*20+i+1)
  })),
  active:201,team:[1,2,3,4,5,6],
  mons:Array.from({length:201},(_,i)=>({
   id:i+1,...snapshot(i===200?'existing':'wild')
  }))
 };
 const original=JSON.stringify(legacy);
 const migrated=M.decode(envelope(legacy));
 assert.equal(JSON.stringify(legacy),original);
 assert.equal(migrated.revision,7);assert.equal(migrated.nextId,202);
 assert.deepEqual(migrated.mons,legacy.mons);
 assert.deepEqual(migrated.team,legacy.team);
 for(let i=0;i<10;i++){
  assert.deepEqual(migrated.boxes[i].slots.slice(0,20),legacy.boxes[i].slots);
  assert.deepEqual(migrated.boxes[i].slots.slice(20),[null,null,null,null]);
 }
 assert(M.needsCarePlacement(migrated));
 const repaired=M.selectTeam(migrated,201,2);
 assert(!M.needsCarePlacement(repaired));
 assert.equal(repaired.active,201);
 assert.deepEqual(repaired.team,[1,201,3,4,5,6]);
 assert.deepEqual(repaired.mons,migrated.mons);
 assert.deepEqual(repaired.boxes,migrated.boxes);
 assert.throws(()=>M.unselectTeam(repaired,201),
  e=>e.code==='CARE_MEMBER_PINNED');
 assert.throws(()=>M.selectTeam(repaired,2,201),
  e=>e.code==='CARE_MEMBER_PINNED');
 assert.deepEqual(M.decode(M.encode(repaired)),repaired);
 const small=JSON.parse(original);small.team=[1,2];
 assert.deepEqual(M.decode(envelope(small)).team,[1,2,201]);
 const corrupt=JSON.parse(original);
 corrupt.boxes[0].slots[1]=corrupt.boxes[0].slots[0];
 assert.throws(()=>M.decode(envelope(corrupt)));
 const future=JSON.parse(JSON.stringify(repaired));future.version=3;
 assert.throws(()=>M.decode(envelope(future)),e=>e.code==='UNSUPPORTED_VERSION');
 let full=M.attachCurrent(M.create(),snapshot('existing'));
 for(let i=0;i<240;i++)full=M.catchWild(full,snapshot());
 assert.equal(M.summary(full).stored,240);assert.equal(full.mons.length,241);
 assert.throws(()=>M.catchWild(full,snapshot()),e=>e.code==='BOXES_FULL');
 assert.throws(()=>M.endCare(full,full.active,'keep'),e=>e.code==='BOXES_FULL');

 let state=M.attachCurrent(M.create(),snapshot('raised',{bond:90,careMistakes:19}));
 const care=state.active;
 assert.deepEqual(state.team,[care]);
 state=M.catchWild(state,snapshot('wild',{
  bond:24,careMistakes:3,fullness:70,joy:80,energy:90,hygiene:100
 }));
 const stored=state.nextId-1;
 state=M.selectTeam(state,stored);state=M.moveTeam(state,stored,-1);
 const session=M.session(state,async()=>true);
 const controller={read:()=>session.get(),apply:(...args)=>session.apply(...args),
  get busy(){return session.busy;},blocked:false};
 const host=new Element('host');
 const ui=B.create({
  model:M,getController:()=>controller,getHost:()=>host,
  document:{createElement:tag=>new Element(tag)},
  nameForDex:d=>'Species '+d,
  getEvolutionRules:()=>[{to:26,baseLevel:16,bond:30,time:1}],
  schedule:()=>0,cancel(){},repeat:()=>0,stop(){}
 });
 assert(ui.open());
 const root=host.children[0];
 await button(root,'Teamplanung 2 / 6').click();
 assert.equal(flat(root).filter(x=>x['data-team-id'])[0]['data-team-id'],String(care));
 assert(!flat(root).some(x=>x.textContent==='Freien Teamplatz belegen'));
 await button(root,'Boxen').click();
 await flat(root).find(x=>x['data-mon-id']===String(stored)).click();
 await button(root,'Verwalten').click();
 assert.equal(button(root,'Ins Team')['data-action-column'],'1');
 assert.equal(button(root,'In andere Box verschieben')['data-action-row'],'2');
 assert.equal(button(root,'Details')['data-action-row'],'3');
 assert.equal(button(root,'Namen ändern')['data-action-column'],'2');
 const before=M.encode(session.get());
 await button(root,'Details').click();
 const texts=flat(root).map(x=>x.textContent);
 assert(texts.includes('Level 17 / 19'));assert(texts.includes('Bindung 24 / 30'));
 assert.equal(flat(root).filter(x=>x['data-stat']).length,3);
 assert(!flat(root).some(x=>x.tagName==='button'&&/entwickeln/i.test(x.textContent)));
 assert.equal(M.encode(session.get()),before);
 ui.close();

 const refusing=M.session(repaired,async()=>false),prior=refusing.get();
 await assert.rejects(refusing.apply('renameBox',0,'Nicht gespeichert'),
  e=>e.code==='PERSIST_REJECTED');
 assert.deepEqual(refusing.get(),prior);
 console.log('UI01 boxes24 passed: strict v1 migration, exact IDs/positions, 240 stored plus care, explicit full-team care placement, pinned care membership, separate display/battle order, specimen-specific evolution level/bond, no box evolution, and durable-write refusal.');
})().catch(error=>{console.error(error);process.exit(1);});
