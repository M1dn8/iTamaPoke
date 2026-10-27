'use strict';
const assert=require('node:assert/strict');
const M=require('../browser_ver/web/collection-model.js');
const A=require('../browser_ver/web/collection-admission-model.js');
const Z=require('../browser_ver/web/zapdos-story-model.js');
const P=require('../browser_ver/web/collection-persistence.js');
const Adapter=require('../browser_ver/web/collection-zapdos.js');
globalThis.TPCollectionModel=M;
globalThis.TPAdmissionModel=A;
globalThis.TPZapdosModel=Z;
const T=require('../browser_ver/web/storage-tools.js');

const encoder=new TextEncoder();
let collection=encoder.encode(M.encode(M.create()));
let notice=0,allowed=1,badges=6,checkpoint=null,serial=0;
let rejectWrite=false,writeCount=0,durable=null,held=null;

const mod={
 ccall(name,_return,_types,args){
  switch(name){
   case 'tp_zpd_step':return 0;
   case 'tp_zpd_ticket':return 0;
   case 'tp_zpd_access':return allowed;
   case 'tp_zpd_kanto_badges':return badges;
   case 'tp_zpd_notice_read':return notice;
   case 'tp_zpd_notice_mark':
    if(!checkpoint||args[0]!==checkpoint.token||!allowed)return 0;
    notice=1;return 1;
   default:throw Error('Unexpected simulated native call: '+name);
  }
 }
};
for(const name of [
 'tp_zpd_step','tp_zpd_ticket','tp_zpd_advance','tp_zpd_start',
 'tp_zpd_get','tp_zpd_snapshot','tp_zpd_result_begin',
 'tp_zpd_result_apply','tp_zpd_result_finish','tp_wt_view',
 'tp_wt_stage_begin','tp_wt_stage_entry','tp_zpd_access',
 'tp_zpd_kanto_badges','tp_zpd_notice_read','tp_zpd_notice_mark'
])mod['_'+name]=()=>{};

const base={
 read:()=>Uint8Array.from(collection),
 begin(){
  assert.equal(checkpoint,null);
  const token=++serial;
  checkpoint={token,notice,collection:Uint8Array.from(collection)};
  return token;
 },
 stage(token,data){
  assert.equal(token,checkpoint.token);
  collection=Uint8Array.from(data);return 1;
 },
 finish(token,commit){
  assert.equal(token,checkpoint.token);
  if(!commit){
   notice=checkpoint.notice;collection=checkpoint.collection;
  }
  checkpoint=null;return 1;
 }
};
const admission={supported:true,read:()=>A.create()};
const adapter=Adapter.create(mod,M,Z,A,admission,base);

function exportSave(){
 const entries=[
  ['init',0,true],['dexn',1,1],['age',1,540],['eggT2',1,1],
  ['f4col',3,collection],['stynver',1,1],['stynread',1,notice]
 ];
 const count=Buffer.alloc(4);count.writeUInt32LE(entries.length);
 return Buffer.concat([count,...entries.map(([key,type,value])=>{
  const k=Buffer.from(key);
  let bytes;
  if(type===0)bytes=Buffer.from([value?1:0]);
  else if(type===1){
   bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));
  }else bytes=Buffer.from(value);
  const size=Buffer.alloc(4);size.writeUInt32LE(bytes.length);
  return Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),size,bytes]);
 })]);
}

let gate=false;
const controller=P.create({
 model:M,bridge:adapter.bridge,nativeActions:adapter.nativeActions,
 acquire(){
  assert.equal(gate,false);gate=true;
  return ()=>{gate=false;};
 },
 exportSave,validateSave:T.parseLegacy,
 async persist(bytes){
  writeCount++;
  if(rejectWrite)throw Error('Simulated quota failure');
  if(held)await held.promise;
  durable=Uint8Array.from(bytes);return true;
 }
});
adapter.bind(controller);

(async()=>{
 assert.equal(adapter.noticeSupported,true);
 assert.deepEqual(adapter.access(),{
  phase:'investigate',canBattle:false,ticket:0,
  unlocked:true,badges:6,noticeRead:false,newlyUnlocked:true
 });
 assert.equal(writeCount,0);

 allowed=0;badges=5;
 await assert.rejects(()=>adapter.acknowledgeNotice(),/ZAPDOS_LOCKED/);
 assert.equal(writeCount,0);assert.equal(notice,0);
 allowed=1;badges=6;

 notice=-1;
 assert.throws(()=>adapter.access(),/INVALID_ZAPDOS_ACCESS/);
 notice=0;

 const before=Uint8Array.from(collection);
 rejectWrite=true;
 await assert.rejects(
  ()=>adapter.acknowledgeNotice(),/Simulated quota failure/
 );
 assert.equal(notice,0);
 assert.deepEqual(collection,before);
 assert.equal(checkpoint,null);
 assert.equal(gate,false);
 assert.equal(controller.busy,false);
 assert.equal(controller.blocked,false);
 assert.equal(durable,null);

 rejectWrite=false;
 let release;
 held={promise:new Promise(resolve=>{release=resolve;})};
 const pending=adapter.acknowledgeNotice();
 assert.equal(controller.busy,true);
 assert.equal(gate,true);
 await assert.rejects(()=>adapter.acknowledgeNotice(),/BUSY/);
 release();
 const confirmed=await pending;
 held=null;

 assert.equal(confirmed.noticeRead,true);
 assert.equal(confirmed.newlyUnlocked,false);
 assert.equal(controller.busy,false);
 assert.equal(gate,false);
 assert.equal(T.parseLegacy(durable).values.get('stynread').value,1);
 const writes=writeCount,transactions=serial;
 await adapter.acknowledgeNotice();
 assert.equal(writeCount,writes);
 assert.equal(serial,transactions);
 assert.deepEqual(collection,before);

 console.log('Story access adapter passed: actual JS adapter/controller/models/parser; read-only access, locked refusal, failed-write rollback, busy gate, durable confirmation and idempotency. Native transport and persistence are simulated; no browser/native authority claim.');
})().catch(error=>{console.error(error);process.exitCode=1;});
