 'use strict';
const assert=require('node:assert/strict');
const M=require('../browser_ver/web/collection-model.js');
const L=require('../browser_ver/web/league-team-state.js');
const P=require('../browser_ver/web/collection-persistence.js');
const G=require('../browser_ver/web/collection-league-start.js');
const enc=new TextEncoder(),dec=new TextDecoder();

function fixture(){
 const care={dex:150,level:30,nickname:'Care',shiny:false,origin:'existing',
  data:{lifeToken:1,ageMinutes:540,genes:{atk:100,def:100,spe:100},
   stats:{atk:100,def:100,spe:100},energy:100}};
 let state=M.attachCurrent(M.create(),care);
 for(let i=0;i<2;i++){
  state=M.catchWild(state,{
   dex:25,level:30,nickname:'Box '+i,shiny:false,origin:'wild',
   data:{stats:{atk:80,def:80,spe:80}}
  });
  state=M.selectTeam(state,state.nextId-1);
 }
 return {state,care};
}

function setup(){
 const f=fixture();
 let raw=enc.encode(M.encode(f.state)),run=null,energy=100,
  careLevel=30,winnerIndex=0;
 let undo=null,serial=0,writeMode='ok',confirmFail=false,held=false,writes=0;
 const heap=new Uint8Array(1048576);
 const copy=b=>b===null?null:b.slice();
 const snapshot=()=>({...f.care,level:careLevel,
  data:{...f.care.data,energy}});
 const life=()=>({valid:true,initialized:true,token:1,snapshot:snapshot()});
 function begin(){
  assert(!undo);
  undo={token:++serial,raw:copy(raw),run:copy(run),energy,careLevel,
   applied:false};
  return serial;
 }
 function finish(token,commit){
  if(!undo||undo.token!==token)return 0;
  if(commit&&confirmFail)return 0;
  if(!commit){raw=undo.raw;run=undo.run;energy=undo.energy;
   careLevel=undo.careLevel;}
  undo=null;return 1;
 }
 const mod={
  HEAPU8:heap,_malloc:()=>4096,_free(){},
  ccall(name,type,types,args){
   if(name==='tp_f4_life_state')return JSON.stringify(life());
   if(name==='tp_dex_type1')return 1;
   if(name==='tp_dex_type2')return 0;
   if(name==='tp_lgt_prepare_start'){
    const [region,ptr,size]=args;
    const s=L.decode(heap.slice(ptr,ptr+size),region);
    const token=begin();run=L.encode(s);energy-=50;return token;
   }
   if(name==='tp_lgt_prepare_resume'){
    const s=L.decode(run,args[0]);
    if(s.phase!==1)return 0;
    const token=begin();s.phase; // Decoder output is immutable.
    const next=JSON.parse(JSON.stringify(s));next.phase=2;
    run=L.encode(next);return token;
   }
   if(name==='tp_lgt_win_begin'){
    const s=L.decode(run,args[0]);
    return s.phase===2&&s.index<26?begin():0;
   }
   if(name==='tp_lgt_win_apply'){
    if(!undo||undo.token!==args[1]||undo.applied)return 0;
    const s=JSON.parse(JSON.stringify(L.decode(run,args[0])));
    s.phase=1;s.index++;s.active=winnerIndex;
    const winner=s.members[winnerIndex];winner.wins++;
    if(winner.id===s.care.id){
     if(careLevel<100){careLevel++;winner.levelGains++;}
    }else{
     winner.levelGains=Math.min(winner.wins,100-winner.level);
    }
    run=s.index===26?L.encodeTerminal(s):L.encode(s);
    undo.applied=true;return 1;
   }
   if(name==='tp_lgt_finish')return finish(args[1],args[2]);
   if(name.endsWith('_size'))return run?run.length:0;
   if(name.endsWith('_ptr')){
    if(!run)return 0;heap.set(run,32768);return 32768;
   }
   throw Error(name);
  }
 };
 for(const name of [
  'tp_lgt_prepare_start','tp_lgt_prepare_resume','tp_lgt_finish',
  'tp_lgt_win_begin','tp_lgt_win_apply',
  'tp_lgt_saved_size','tp_lgt_saved_ptr',
  'tp_lgt_prepared_size','tp_lgt_prepared_ptr','tp_f4_life_state'
 ])mod['_'+name]=()=>{};
 const base={
  read:()=>copy(raw),begin:()=>begin(),
  stage(token,data){
   assert(undo&&undo.token===token);raw=data.slice();return 1;
  },
  finish
 };
 const reconcile=(before,token)=>{
  assert(undo&&undo.token===token);
  return M.syncCurrent(before,before.active,snapshot());
 };
 const adapter=G.create(mod,M,L,base,reconcile);
 const controller=P.create({
  model:M,bridge:adapter.bridge,nativeActions:adapter.nativeActions,
  acquire(){assert(!held);held=true;return()=>{held=false;};},
  exportSave:()=>raw.slice(),
  validateSave:bytes=>({values:new Map([['f4col',{type:3,value:bytes}]])}),
  async persist(){
   writes++;
   if(writeMode==='throw')throw Error('quota');
   return writeMode!=='false';
  }
 });
 adapter.bind(controller);
 return {
  adapter,controller,life,
  state:()=>M.decode(dec.decode(raw)),energy:()=>energy,
  run:()=>run&&L.decode(run,0),
  held:()=>held,writes:()=>writes,
  setWrite:mode=>{writeMode=mode;},
  failConfirm:()=>{confirmFail=true;},
  chooseWinner:index=>{winnerIndex=index;},
  checkpoint(){
   const s=JSON.parse(JSON.stringify(L.decode(run,0)));
   s.phase=1;s.index=1;
   s.members[0].wins=1;
   run=L.encode(s);
  }
 };
}

(async()=>{
 for(const mode of ['throw','false']){
  const t=setup(),before=M.encode(t.state());
  t.setWrite(mode);
  await assert.rejects(t.adapter.start(0));
  assert.equal(t.energy(),100);
  assert.equal(M.encode(t.state()),before);
  assert.equal(t.run(),null);
  assert(!t.held()&&!t.controller.blocked);
  t.setWrite('ok');
  await t.adapter.start(0);
  assert.equal(t.energy(),50);
  assert.equal(t.state().mons[0].data.energy,50);
  assert.equal(t.run().members.length,3);
  assert.deepEqual(t.run().members.map(m=>m.id),[1,2,3]);
  assert.equal(t.run().members[1].dex,t.run().members[2].dex);
  assert(!t.held());
 }

 const resumed=setup();
 await resumed.adapter.start(0);
 resumed.checkpoint();
 await resumed.adapter.resume(0);
 assert.equal(resumed.energy(),50);
 assert.equal(resumed.run().phase,2);
 assert.equal(resumed.run().index,1);

 const t=setup();
 await assert.rejects(t.adapter.start(2));
 await assert.rejects(t.adapter.start(1,1));
 assert.equal(t.writes(),0);
 await t.adapter.start(0);
 const baseline=t.state(),run=t.run(),life=t.life();
 G.validateRoster(M,baseline,run,life,false);

 const clone=v=>JSON.parse(JSON.stringify(v));
 const swapped=clone(run);
 [swapped.members[1],swapped.members[2]]=
  [swapped.members[2],swapped.members[1]];
 assert.throws(()=>G.validateRoster(M,baseline,swapped,life,false));
 const staleLife=clone(life);staleLife.token=2;
 assert.throws(()=>G.validateRoster(M,baseline,run,staleLife,false));
 const staleStats=clone(run);staleStats.members[1].atk++;
 assert.throws(()=>G.validateRoster(M,baseline,staleStats,life,false));
 const progressed=clone(run);
 progressed.members[1].wins=1;progressed.members[1].levelGains=1;
 assert.throws(()=>G.validateRoster(M,baseline,progressed,life,true));
 const updated=M.grantStoredBattleLevel(baseline,2);
 G.validateRoster(M,updated,progressed,life,true);

 for(const selected of [0,1]){
  const t=setup();
  await t.adapter.start(0);
  t.chooseWinner(selected);
  const before=M.encode(t.state());
  t.setWrite('false');
  await assert.rejects(t.adapter.complete(0));
  assert.equal(M.encode(t.state()),before);
  assert.equal(t.run().index,0);
  assert(!t.held()&&!t.controller.blocked);
  t.setWrite('ok');
  await t.adapter.complete(0);
  assert.equal(t.run().phase,1);
  assert.equal(t.run().index,1);
  assert.equal(t.run().active,selected);
  assert.equal(t.run().members[selected].levelGains,1);
  assert.equal(t.state().mons[selected].level,31);
  assert.equal(t.state().mons[1-selected].level,30);
  if(selected===1)assert.equal(t.state().mons[1].data.stats.atk,81);
  await t.adapter.resume(0);
  assert.equal(t.run().members[selected].level,30);
 }

 const terminalSource=setup();
 await terminalSource.adapter.start(0);
 const terminal=JSON.parse(JSON.stringify(terminalSource.run()));
 terminal.phase=1;terminal.index=26;
 terminal.members[0].wins=26;terminal.members[0].levelGains=26;
 const terminalBytes=L.encodeTerminal(terminal);
 assert.throws(()=>L.decode(terminalBytes,0));
 assert.deepEqual(L.decodeTerminal(terminalBytes,0),terminal);

 const finalConfirm=setup();
 await finalConfirm.adapter.start(0);
 finalConfirm.failConfirm();
 await assert.rejects(
  finalConfirm.adapter.complete(0),e=>e.code==='RELOAD_REQUIRED'
 );
 assert(finalConfirm.controller.blocked&&finalConfirm.held());
 assert.equal(finalConfirm.state().mons[0].level,31);

 // A saved roster is independent of today's selected team.
 const changedPlan=M.moveTeam(baseline,2,1);
 G.validateRoster(M,changedPlan,run,life,true);
 assert.throws(()=>G.validateRoster(M,changedPlan,run,life,false));
 const unselected=M.unselectTeam(changedPlan,2);
 G.validateRoster(M,unselected,run,life,true);
 const released=M.releaseStored(baseline,2,{confirmed:true});
 assert.throws(()=>G.validateRoster(M,released,run,life,true));

 const fatal=setup();
 fatal.failConfirm();
 await assert.rejects(fatal.adapter.start(0),e=>e.code==='RELOAD_REQUIRED');
 assert(fatal.controller.blocked&&fatal.held());
 assert.equal(fatal.energy(),50);
 await assert.rejects(fatal.adapter.resume(0));

 console.log('P05c league collection bridge passed: actual immutable model '+
  'and persistence controller, ordered owned IDs/duplicate species, care '+
  'binding, stored-progress checks, staged care synchronization, rejected '+
  'writes with rollback/retry and durable-confirmation failure held for '+
  'reload, per-win care/box grants with rollback/retry and terminal-codec '+
  'separation. Native bridge is mocked; no playable UI claim.');
})().catch(error=>{console.error(error);process.exit(1);});
