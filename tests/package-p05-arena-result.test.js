 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const crypto=require('node:crypto');
const M=require('../browser_ver/web/collection-model.js');
const P=require('../browser_ver/web/collection-persistence.js');
const A=require('../browser_ver/web/collection-arena-result.js');

const sandbox={
 TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,DataView,Map,Set,console,
 TPCollectionModel:M,crypto:crypto.webcrypto
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('browser_ver/web/storage-tools.js','utf8'),sandbox);
const T=sandbox.TPStoreTools,enc=new TextEncoder();
let checks=0;
function eq(a,b){assert.deepEqual(a,b);checks++;}
function ok(a){assert(a);checks++;}

function pack(entries){
 const chunks=entries.map(([key,type,value])=>{
  const k=Buffer.from(key);
  let data;
  if(type===0)data=Buffer.from([+value]);
  else if(type===1){data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(value));}
  else data=Buffer.from(value);
  const len=Buffer.alloc(4);len.writeUInt32LE(data.length);
  return Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),len,data]);
 });
 const count=Buffer.alloc(4);count.writeUInt32LE(chunks.length);
 return new Uint8Array(Buffer.concat([count,...chunks]));
}
function snapshot(origin,level){
 return {dex:origin==='wild'?25:1,level,nickname:'',shiny:false,origin,
  data:{stats:{atk:50,def:60,spe:70},
   genes:origin==='wild'?null:{atk:100,def:100,spe:100},
   training:origin==='wild'?null:{atk:7,def:8,spe:9},
   ...(origin==='wild'?{}:{lifeToken:1})}};
}
function environment(options={}){
 const careLevel=options.careLevel??10;
 const storedLevel=options.storedLevel??20;
 const region=options.region??0;
 const won=options.won??true,repeat=options.repeat??false;
 const initialCare=snapshot('existing',careLevel);
 let initial=M.attachCurrent(M.create(),initialCare);
 initial=M.catchWild(initial,snapshot('wild',storedLevel));
 initial=M.catchWild(initial,snapshot('wild',99));
 initial=M.selectTeam(initial,2);
 initial=M.selectTeam(initial,3);
 if(options.fallback){
  for(const id of initial.team.slice())initial=M.unselectTeam(initial,id);
 }
 const ids=initial.team.length?initial.team:[initial.active];
 const gains=options.gains??ids.map(id=>Math.min(
  id===2?2:1,100-initial.mons.find(m=>m.id===id).level
 ));
 let raw=enc.encode(M.encode(initial)),bonus=0,serial=0,token=0;
 let undo=null,applied=false,done=false,gate=false;
 let mask=repeat?1:0,date=repeat?1700000000:0;
 let writer=async bytes=>{disk=bytes.slice();return true;};

 function exportSave(){
  const fields=[
   ['init',0,true],['dexn',1,1],['eggT2',1,1],
   ['age',1,(careLevel-1)*60],['blvl',1,bonus],
   ['gatk',1,100],['gdef',1,100],['gspe',1,100],
   ['f4lver',1,1],['f4life',1,1],
   ['agver',1,1],['agmask',1,region===0?mask:0],
   ['jagver',1,1],['jagmask',1,region===1?mask:0],
   ['f4col',3,raw]
  ];
  if(date)fields.push([region===0?'agt0':'jagt0',1,date]);
  return pack(fields);
 }
 let disk=exportSave();
 const mod={
  _tp_wt_view(){},_tp_wt_arena_result_begin(){},
  _tp_wt_arena_result_apply(){},_tp_wt_arena_result_finish(){},
  ccall(name,type,types,args=[]){
   if(name==='tp_wt_view'){
    let members=ids.map((id,i)=>{
     const m=initial.mons.find(p=>p.id===id);
     return {id,dex:m.dex,level:m.level,levelGains:gains[i]};
    });
    if(options.badRoster)members=members.slice().reverse();
    return JSON.stringify({
     live:1,arena:true,seriesDone:!options.intermediate,
     resultDone:done,won,region,session:7,opponentCount:5,
     count:ids.length,members
    });
   }
   if(name==='tp_wt_arena_result_begin'){
    if(args[0]!==region||args[1]!==7||token||done)return 0;
    undo={raw:raw.slice(),bonus,mask,date};
    applied=false;token=++serial;return token;
   }
   if(name==='tp_wt_arena_result_apply'){
    if(args[0]!==region||args[1]!==7||args[2]!==token||applied)return 0;
    const index=ids.indexOf(initial.active);
    bonus=Math.min(100-careLevel,bonus+(index<0?0:gains[index]));
    if(options.wrongCareReward&&careLevel+bonus<100)bonus++;
    const outcome=won?(mask?2:1):3;
    if(outcome===1){mask=1;date=1700000001;}
    applied=true;return outcome;
   }
   if(name==='tp_wt_arena_result_finish'){
    const [r,s,t,commit]=args;
    if(r!==region||s!==7||t!==token)return 0;
    if(commit&&options.failConfirm)return 0;
    if(!commit&&options.failRollback)return 0;
    if(commit)done=true;
    else({raw,bonus,mask,date}=undo);
    token=0;undo=null;return 1;
   }
   throw Error(name);
  }
 };
 const base={
  read:()=>raw.slice(),
  begin(){throw Error('wrong bridge begin');},
  stage(t,bytes){assert.equal(t,token);raw=bytes.slice();return 1;},
  finish(){throw Error('wrong bridge finish');}
 };
 function reconcile(state){
  const old=state.mons.find(m=>m.id===state.active);
  const snap=JSON.parse(JSON.stringify(initialCare));
  snap.level=Math.min(100,careLevel+bonus);
  for(const key of ['atk','def','spe'])snap.data.stats[key]+=bonus;
  return M.syncCurrent(state,old.id,snap);
 }
 const result=A.create(mod,M,base,reconcile);
 const controller=P.create({
  model:M,bridge:result.bridge,nativeActions:result.nativeActions,
  acquire(){assert(!gate);gate=true;return ()=>{gate=false;};},
  exportSave,validateSave:T.parseLegacy,persist:bytes=>writer(bytes)
 });
 result.bind(controller);
 return {
  initial,result,controller,gains,
  setWriter(fn){writer=fn;},
  get disk(){return disk;},get bonus(){return bonus;},
  get gate(){return gate;},get done(){return done;},
  get mask(){return mask;},get date(){return date;}
 };
}

(async()=>{
 for(const region of [0,1]){
  for(const options of [{},{repeat:true},{won:false}]){
   const e=environment({...options,region});
   await e.result.complete();
   const saved=M.decode(new TextDecoder().decode(
    T.parseLegacy(e.disk).values.get('f4col').value
   ));
   eq(saved,e.controller.read());
   eq(saved.mons.map(m=>m.level),[11,22,100]);
   eq(saved.mons[1].data.stats,{atk:52,def:62,spe:72});
   eq(saved.mons[1].data.genes,null);
   eq(saved.mons[1].data.training,null);
   eq(saved.active,e.initial.active);
   eq(saved.team,e.initial.team);
   eq(saved.boxes,e.initial.boxes);
   eq(e.mask,options.won===false?0:1);
   if(options.repeat)eq(e.date,1700000000);
   ok(e.done&&!e.gate&&!e.controller.busy);
   const disk=Buffer.from(e.disk);
   await assert.rejects(e.result.complete(),x=>x.code==='NATIVE_BEGIN_REFUSED');
   eq(Buffer.from(e.disk),disk);
  }
 }

 for(const options of [{},{repeat:true},{won:false}]){
  const e=environment(options);
  const before=e.controller.read(),disk=Buffer.from(e.disk),date=e.date;
  e.setWriter(async()=>{throw Error('quota');});
  await assert.rejects(e.result.complete(),/quota/);
  eq(e.controller.read(),before);
  eq(Buffer.from(e.disk),disk);
  eq(e.bonus,0);eq(e.date,date);
  ok(!e.done&&!e.gate&&!e.controller.blocked);
  e.setWriter(async()=>true);
  await e.result.complete();
  eq(e.controller.read().mons.map(m=>m.level),[11,22,100]);
 }

 for(const options of [
  {careLevel:100,storedLevel:100},
  {careLevel:99,storedLevel:99},
  {gains:[0,0,0]},
  {fallback:true}
 ]){
  const e=environment(options);
  await e.result.complete();
  const levels=e.initial.mons.map((m,i)=>{
   const ids=e.initial.team.length?e.initial.team:[e.initial.active];
   const index=ids.indexOf(m.id);
   return Math.min(100,m.level+(index<0?0:e.gains[index]));
  });
  eq(e.controller.read().mons.map(m=>m.level),levels);
 }

 for(const options of [
  {badRoster:true},{wrongCareReward:true},
  {gains:[-1,2,1]},{gains:[1,6,0]},{gains:[1,2,2]},
  {intermediate:true}
 ]){
  const e=environment(options);
  const before=e.controller.read(),disk=Buffer.from(e.disk);
  await assert.rejects(e.result.complete());
  eq(e.controller.read(),before);eq(Buffer.from(e.disk),disk);
  eq(e.bonus,0);ok(!e.gate&&!e.controller.blocked);
 }

 let e=environment(),release;
 e.setWriter(()=>new Promise(resolve=>{release=resolve;}));
 const before=e.controller.read(),task=e.result.complete();
 ok(e.gate&&e.controller.busy);
 eq(e.controller.read(),before);
 await assert.rejects(e.result.complete(),x=>x.code==='BUSY');
 release(true);await task;
 eq(e.controller.read().mons.map(m=>m.level),[11,22,100]);

 e=environment({failConfirm:true});
 await assert.rejects(e.result.complete(),x=>x.code==='RELOAD_REQUIRED');
 ok(e.controller.blocked&&e.controller.busy&&e.gate);
 eq(T.parseLegacy(e.disk).summary.level,11);

 e=environment({failRollback:true});
 e.setWriter(async()=>{throw Error('quota');});
 await assert.rejects(e.result.complete(),x=>x.code==='RELOAD_REQUIRED');
 ok(e.controller.blocked&&e.controller.busy&&e.gate);

 console.log('P05b arena result adapter passed: '+checks+
  ' assertions plus rejection checks; actual model/controller/save parser, '+
  'multiple individual gains, care identity, both regions, win/repeat/loss, '+
  'date stability, cap100, empty-team fallback, quota rollback/retry, '+
  'duplicate refusal, publication gate and unsafe-confirmation blocking. '+
  'Mock native backend; not browser/IndexedDB integration.');
})().catch(error=>{console.error(error);process.exit(1);});
