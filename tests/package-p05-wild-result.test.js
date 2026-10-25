'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const crypto=require('node:crypto');
const M=require('../browser_ver/web/collection-model.js');
const P=require('../browser_ver/web/collection-persistence.js');
const W=require('../browser_ver/web/collection-wild-result.js');

const sandbox={
 TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,DataView,Map,Set,console,
 TPCollectionModel:M,crypto:crypto.webcrypto
};
vm.createContext(sandbox);
vm.runInContext(
 fs.readFileSync('browser_ver/web/storage-tools.js','utf8'),sandbox
);
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
  else if(type===2)data=Buffer.from(value);
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
 const careLevel=options.careLevel||10;
 const storedLevel=options.storedLevel||20;
 const initialCare=snapshot('existing',careLevel);
 let initial=M.attachCurrent(M.create(),initialCare);
 initial=M.catchWild(initial,snapshot('wild',storedLevel));
 initial=M.selectTeam(initial,2);

 let raw=enc.encode(M.encode(initial)),bonus=0,serial=0,token=0;
 let undo=null,applied=false,pending=true,gate=false,disk;
 let writer=async bytes=>{disk=bytes.slice();return true;};
 const winner=options.winner===undefined?2:options.winner;
 const age=(careLevel-1)*60;
 function exportSave(){
  return pack([
   ['init',0,true],['dexn',1,1],['eggT2',1,1],['age',1,age],
   ['blvl',1,bonus],['gatk',1,100],['gdef',1,100],['gspe',1,100],
   ['f4lver',1,1],['f4life',1,1],['f4col',3,raw]
  ]);
 }
 disk=exportSave();

 const mod={
  _tp_wt_view(){},_tp_wt_result_begin(){},
  _tp_wt_result_apply(){},_tp_wt_result_finish(){},
  ccall(name,type,types,args=[]){
   if(name==='tp_wt_view')return JSON.stringify({
    live:1,count:2,resultPending:pending,winnerId:winner,
    members:(options.badRoster?[2,1]:[1,2]).map(id=>({
     id,dex:initial.mons.find(m=>m.id===id).dex
    }))
   });
   if(name==='tp_wt_result_begin'){
    if(token||!pending)return 0;
    undo={raw:raw.slice(),bonus};applied=false;token=++serial;return token;
   }
   if(name==='tp_wt_result_apply'){
    if(args[0]!==token||applied||args[1]!==winner)return 0;
    if((winner===1||options.wrongCareReward)&&careLevel+bonus<100)bonus++;
    applied=true;return 1;
   }
   if(name==='tp_wt_result_finish'){
    if(args[0]!==token)return 0;
    if(args[1]&&options.failConfirm)return 0;
    if(!args[1]&&options.failRollback)return 0;
    if(args[1])pending=false;
    else{raw=undo.raw;bonus=undo.bonus;}
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
 const result=W.create(mod,M,base,reconcile);
 const controller=P.create({
  model:M,bridge:result.bridge,nativeActions:result.nativeActions,
  acquire(){assert(!gate);gate=true;return ()=>{gate=false;};},
  exportSave,validateSave:T.parseLegacy,persist:bytes=>writer(bytes)
 });
 result.bind(controller);
 return {
  initial,controller,result,
  setWriter(fn){writer=fn;},
  get disk(){return disk;},
  get bonus(){return bonus;},
  get gate(){return gate;},
  get pending(){return pending;}
 };
}

(async()=>{
 let state=M.attachCurrent(M.create(),snapshot('existing',10));
 state=M.catchWild(state,snapshot('wild',20));
 const original=M.encode(state);
 const grown=M.grantStoredBattleLevel(state,2);
 eq(grown.mons[1].level,21);
 eq(grown.mons[1].data.stats,{atk:51,def:61,spe:71});
 eq(grown.mons[1].data.genes,null);
 eq(grown.mons[1].data.training,null);
 eq(grown.active,state.active);
 eq(grown.boxes,state.boxes);
 eq(M.encode(state),original);
 assert.throws(()=>M.grantStoredBattleLevel(state,1),
  e=>e.code==='ACTIVE_NOT_IN_BOX');

 for(const winner of [1,2,0]){
  const e=environment({winner});
  await e.result.complete();
  const saved=M.decode(new TextDecoder().decode(
   T.parseLegacy(e.disk).values.get('f4col').value
  ));
  eq(saved,e.controller.read());
  eq(saved.mons[0].level,winner===1?11:10);
  eq(saved.mons[1].level,winner===2?21:20);
  eq(saved.mons[1].data.training,null);
  ok(!e.gate&&!e.pending&&!e.controller.busy);
  const committed=Buffer.from(e.disk);
  await assert.rejects(e.result.complete(),e=>e.code==='NATIVE_BEGIN_REFUSED');
  eq(Buffer.from(e.disk),committed);
 }

 for(const winner of [1,2]){
  const e=environment({winner});
  const before=e.controller.read(),oldDisk=Buffer.from(e.disk);
  e.setWriter(async()=>{throw Error('quota');});
  await assert.rejects(e.result.complete(),/quota/);
  eq(e.controller.read(),before);
  eq(Buffer.from(e.disk),oldDisk);
  eq(e.bonus,0);
  ok(e.pending&&!e.gate&&!e.controller.blocked&&!e.controller.busy);
  e.setWriter(async()=>true);
  await e.result.complete();
  eq(e.controller.read().mons.find(m=>m.id===winner).level,winner===1?11:21);
 }

 for(const options of [
  {winner:1,careLevel:100},{winner:2,storedLevel:100}
 ]){
  const e=environment(options);
  await e.result.complete();
  eq(e.controller.read().mons.find(m=>m.id===options.winner).level,100);
  eq(e.bonus,0);
 }

 let e=environment();
 let release;
 e.setWriter(()=>new Promise(resolve=>{release=resolve;}));
 const before=e.controller.read(),task=e.result.complete();
 ok(e.gate&&e.controller.busy);
 eq(e.controller.read(),before);
 await assert.rejects(e.result.complete(),e=>e.code==='BUSY');
 release(true);await task;
 eq(e.controller.read().mons[1].level,21);
 ok(!e.gate&&!e.controller.busy);

 for(const options of [{badRoster:true},{wrongCareReward:true}]){
  e=environment(options);
  const old=e.controller.read(),oldDisk=Buffer.from(e.disk);
  await assert.rejects(e.result.complete());
  eq(e.controller.read(),old);
  eq(Buffer.from(e.disk),oldDisk);
  eq(e.bonus,0);
  ok(!e.controller.blocked&&!e.gate);
 }

 e=environment({winner:1,failConfirm:true});
 await assert.rejects(e.result.complete(),e=>e.code==='RELOAD_REQUIRED');
 ok(e.controller.blocked&&e.controller.busy&&e.gate);
 eq(T.parseLegacy(e.disk).summary.level,11);
 await assert.rejects(e.result.complete(),e=>e.code==='RELOAD_REQUIRED');

 e=environment({failRollback:true});
 e.setWriter(async()=>{throw Error('quota');});
 await assert.rejects(e.result.complete(),e=>e.code==='RELOAD_REQUIRED');
 ok(e.controller.blocked&&e.controller.busy&&e.gate);

 console.log('P05 wild result adapter passed: '+checks+
  ' assertions plus rejection checks; actual collection model, persistence '+
  'controller and strict save parser; stored/care/loss ownership, level cap, '+
  'no invented training, whole-save publication, quota rollback/retry, '+
  'duplicate refusal, deferred-write gate, wrong-care/roster rejection '+
  'and blocked unsafe confirmation. Mock native backend, not IndexedDB.');
})().catch(error=>{console.error(error);process.exit(1);});
