'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const G=require('../browser_ver/web/story-tap-guard.js');

let clock=0,serial=0;
const timers=new Map();
const gate=G.create({
 now:()=>clock,
 setTimer:(fn,delay)=>{
  const id=++serial;timers.set(id,{fn,at:clock+delay});return id;
 },
 clearTimer:id=>timers.delete(id)
});
function at(value){
 clock=value;
 for(const [id,timer] of [...timers]){
  if(timer.at<=clock){timers.delete(id);timer.fn();}
 }
}
gate.arm();assert(!gate.ready());
at(600);gate.pointer('pointerdown',1);
at(610);gate.pointer('pointerup',1);
at(959);assert(!gate.ready());
at(960);assert(gate.ready());
gate.pointer('pointerdown',2);
at(970);gate.pointer('pointerup',2);assert(gate.ready());
at(1000);gate.arm();
at(1100);gate.pointer('pointerdown',3);
at(2000);assert(!gate.ready());
gate.pointer('pointerup',3);
at(2349);assert(!gate.ready());
at(2350);assert(gate.ready());
at(2360);gate.pointer('pointerup',99);assert(!gate.ready());
at(2710);assert(gate.ready());
gate.reset();assert(gate.ready());assert.equal(timers.size,0);


// A contact that began in the minigame must survive reset/arm tracking.
{
 let heldClock=0,heldSerial=0,encounterVisible=false;
 const heldTimers=new Map(),handlers=new Map();
 const documentDouble={
  addEventListener:(type,fn)=>handlers.set(type,fn),
  removeEventListener:type=>handlers.delete(type)
 };
 const heldGate=G.create({
  now:()=>heldClock,
  setTimer:(fn,delay)=>{
   const id=++heldSerial;
   heldTimers.set(id,{fn,at:heldClock+delay});return id;
  },
  clearTimer:id=>heldTimers.delete(id)
 });
 const advanceHeld=value=>{
  heldClock=value;
  for(const [id,timer] of [...heldTimers]){
   if(timer.at<=heldClock){heldTimers.delete(id);timer.fn();}
  }
 };
 heldGate.bind(documentDouble,()=>encounterVisible);
 handlers.get('pointerdown')({pointerId:77});
 heldGate.reset();
 encounterVisible=true;heldGate.arm();
 advanceHeld(1000);assert(!heldGate.ready());
 handlers.get('pointerup')({pointerId:77});
 advanceHeld(1349);assert(!heldGate.ready());
 advanceHeld(1350);assert(heldGate.ready());
 encounterVisible=false;
 handlers.get('pointerdown')({pointerId:88});
 handlers.get('pointercancel')({pointerId:88});
 encounterVisible=true;heldGate.arm();
 advanceHeld(2000);assert(heldGate.ready());
 heldGate.dispose();
 assert.equal(handlers.size,0);assert.equal(heldTimers.size,0);
}


// A release outside the visible encounter must still refresh its readiness.
{
 let releaseClock=0,releaseSerial=0,releaseVisible=true,lastReady=null;
 const releaseTimers=new Map(),releaseHandlers=new Map();
 const releaseGate=G.create({
  now:()=>releaseClock,
  setTimer:(fn,delay)=>{
   const id=++releaseSerial;
   releaseTimers.set(id,{fn,at:releaseClock+delay});return id;
  },
  clearTimer:id=>releaseTimers.delete(id),
  onChange:value=>{lastReady=value;}
 });
 releaseGate.bind({
  addEventListener:(type,fn)=>releaseHandlers.set(type,fn),
  removeEventListener:type=>releaseHandlers.delete(type)
 },()=>releaseVisible);
 const advanceRelease=value=>{
  releaseClock=value;
  for(const [id,timer] of [...releaseTimers])
   if(timer.at<=releaseClock){releaseTimers.delete(id);timer.fn();}
 };
 releaseGate.arm();
 advanceRelease(100);
 releaseHandlers.get('pointerdown')({pointerId:91});
 releaseVisible=false;
 advanceRelease(900);
 assert.equal(lastReady,false);
 assert(!releaseGate.ready());
 releaseHandlers.get('pointerup')({pointerId:91});
 assert.deepEqual([...releaseGate.debug().held],[]);
 advanceRelease(1249);assert(!releaseGate.ready());
 advanceRelease(1250);
 assert(releaseGate.ready());assert.equal(lastReady,true);
 releaseGate.dispose();
 assert.equal(releaseHandlers.size,0);
 assert.equal(releaseTimers.size,0);
}


// Fractional timer boundary must not lose the final ready notification.
{
 let edgeClock=0,edgeSerial=0,edgeNotified=null;
 const edgeTimers=new Map();
 const edgeGate=G.create({
  now:()=>edgeClock,
  setTimer:(fn,delay)=>{
   const id=++edgeSerial;
   edgeTimers.set(id,{fn,at:edgeClock+delay});
   return id;
  },
  clearTimer:id=>edgeTimers.delete(id),
  onChange:value=>{
   edgeNotified=value;
   // Simulate DOM work crossing the deadline after a false notification.
   if(edgeClock===649.75&&value===false)edgeClock=650.25;
  }
 });
 edgeGate.arm();
 assert.equal(edgeTimers.size,1);

 // Simulate a timer callback immediately before the fractional boundary.
 edgeClock=649.75;
 const [firstId,firstTimer]=[...edgeTimers][0];
 edgeTimers.delete(firstId);
 firstTimer.fn();

 assert.equal(edgeGate.ready(),true);
 assert.equal(edgeNotified,false);
 // A false notification must still have a follow-up timer.
 assert.equal(edgeTimers.size,1);

 const [nextId,nextTimer]=[...edgeTimers][0];
 edgeClock=nextTimer.at;
 edgeTimers.delete(nextId);
 nextTimer.fn();

 assert.equal(edgeGate.ready(),true);
 assert.equal(edgeNotified,true);
 assert.equal(edgeTimers.size,0);
 edgeGate.dispose();
}

class E{
 constructor(tag){
  this.tagName=tag;this.children=[];this.style={};this.handlers={};
 }
 append(...nodes){this.children.push(...nodes);}
 appendChild(node){this.append(node);return node;}
 replaceChildren(...nodes){this.children=[...nodes];}
 addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
 setAttribute(){} focus(){}
 async click(){
  for(const fn of this.handlers.click||[])fn();
  await new Promise(resolve=>setImmediate(resolve));
 }
}
const source=fs.readFileSync(
 'browser_ver/web/collection-admission-ui.js','utf8'
);
async function admissionCase(dex,mode,fail=false){
 const sourceId='story:kanto:'+({144:'articuno',145:'zapdos',146:'moltres',150:'mewtwo',151:'mew'})[dex];
 let pending={
  kind:'join',source:sourceId,ticket:1,pokemon:{dex,level:50}
 };
 let failing=fail;
 const choices=[],finales=[],shell=new E('shell');
 const size=mode==='auto'?1:6;
 const members=Array.from({length:size},(_,i)=>({
  id:i+1,dex:25,level:10,nickname:'P'+i
 }));
 const collection={
  active:1,team:members.map(m=>m.id),mons:members
 };
 const c={
  console,Module:{},screen:'idle',choice:'none',tpSaveReplacing:false,
  dragStart:null,dragNow:null,cardPage:0,
  fns:{dexName:id=>'Species '+id},
  document:{
   getElementById:()=>shell,createElement:tag=>new E(tag)
  },
  TPAppMenu:{ready:true,active:false},
  TPAdmissionText:{t:key=>key},
  TPCollection:{busy:false,blocked:false,read:()=>collection},
  TPCollectionModel:{summary:()=>({stored:size-1})},
  TPAdmission:{
   supported:true,read:()=>({pending}),
   complete:async choice=>{
    choices.push(choice);
    if(failing)throw Error('synthetic quota');
    pending=null;
   }
  },
  TPStoryFinales:{show(record){
   assert.equal(pending,null);
   assert.equal(c.TPAdmissionUI.active,false);
   finales.push(record);return true;
  }}
 };
 vm.createContext(c);vm.runInContext(source,c);
 assert(c.TPAdmissionUI.open());
 const flat=node=>[node,...node.children.flatMap(flat)];
 const click=async label=>{
  const button=flat(shell).find(n=>
   n.tagName==='button'&&n.textContent===label&&!n.disabled
  );
  assert(button,'Button missing: '+label);
  await button.click();
 };
 if(mode==='later'){
  await click('later');assert.equal(finales.length,0);return;
 }
 if(mode==='replace'){await click('team');await click('member');}
 else await click(mode==='box'?'box':'accept');

 if(fail){
  assert.equal(finales.length,0);assert(pending);failing=false;
  await click(
   mode==='replace'?'member':mode==='box'?'box':'accept'
  );
 }
 assert.equal(finales.length,1);
 assert.equal(finales[0].source,sourceId);
 assert.equal(choices.at(-1).mode,mode);
 if(mode==='replace')assert.equal(choices.at(-1).replaceId,2);
 assert.equal(c.TPAdmissionUI.active,false);
}

(async()=>{
 for(const dex of [145,144,146,150,151])
  for(const mode of ['replace','box','auto'])
   await admissionCase(dex,mode);
 await admissionCase(144,'replace',true);
 await admissionCase(144,'later');
 for(const mode of ['replace','box','auto'])
  await admissionCase(146,mode,true);
 await admissionCase(146,'later');
 for(const mode of ['replace','box','auto'])
  await admissionCase(150,mode,true);
 await admissionCase(150,'later');
 for(const mode of ['replace','box','auto'])
  await admissionCase(151,mode,true);
 await admissionCase(151,'later');

 const ui=fs.readFileSync('browser_ver/web/zapdos-story-ui.js','utf8');
 const a=ui.indexOf(' function admissionCompleted(pending){');
 const b=ui.indexOf(' function showStory(){',a);
 assert(a>=0&&b>a);

 for(const dex of [145,144,146,150,151]){
  let routed=0;
  const provenance={
   kind:'join',ticket:1,
   source:'story:kanto:'+({144:'articuno',145:'zapdos',146:'moltres',150:'mewtwo',151:'mew'})[dex]
  };
  const pending={...provenance,pokemon:{dex}};
  const context={
   config:{dex,source:provenance.source},lastFinaleTicket:0,
   svc:()=>({view:()=>({phase:'complete',ticket:1})}),
   collection:()=>({read:()=>({
    mons:[{dex,data:{admission:provenance}}]
   })}),
   report:error=>{throw error;}
  };
  context.showStory=()=>{
   routed++;context.lastFinaleTicket=1;
  };
  vm.createContext(context);
  vm.runInContext(ui.slice(a,b),context);
  assert.equal(
   context.admissionCompleted({...pending,source:'unrelated'}),false
  );
  assert.equal(context.admissionCompleted({...pending,ticket:2}),false);
  assert.equal(context.admissionCompleted(pending),true);
  assert.equal(routed,1);
  assert.equal(context.admissionCompleted(pending),false);
  assert.equal(routed,1);
 }
 console.log(
  'Story follow-ups passed: transition quiet period, held/stale pointers, '+
  'all five species with replacement/box/auto, save-failure retry, later '+
  'without finale, persisted provenance routing and duplicate-finale '+
  'refusal. UI/model boundaries simulated; real touch, animation and '+
  'native persistence require browser review.'
 );
})().catch(error=>{console.error(error);process.exit(1);});
