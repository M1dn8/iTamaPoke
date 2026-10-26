 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const M=require('../browser_ver/web/collection-model.js');
const A=require('../browser_ver/web/collection-admission-model.js');
const P=require('../browser_ver/web/collection-persistence.js');
const G=require('../browser_ver/web/collection-admission.js');
const enc=new TextEncoder(),dec=new TextDecoder();

function crc(bytes,pending){
 let h=2166136261;
 for(const byte of bytes)h=Math.imul(h^byte,16777619);
 return Math.imul(h^(pending?1:0),16777619)>>>0;
}
function pack(store){
 const count=Buffer.alloc(4);count.writeUInt32LE(store.size);
 return new Uint8Array(Buffer.concat([count,...Array.from(
  store,([key,{type,value}])=>{
   const name=Buffer.from(key);
   let data;
   if(type===0)data=Buffer.from([+value]);
   else if(type===1){data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(value));}
   else data=Buffer.from(value);
   const len=Buffer.alloc(4);len.writeUInt32LE(data.length);
   return Buffer.concat([Buffer.from([name.length]),name,
    Buffer.from([type]),len,data]);
  }
 )]));
}
const record={
 kind:'join',source:'story:kanto:zapdos',
 pokemon:{dex:145,level:50,nickname:'Zapdos',shiny:false,origin:'wild',
  data:{stats:{atk:100,def:100,spe:100}}}
};
function setup(){
 let collection=M.attachCurrent(M.create(),{
  dex:1,level:10,nickname:'Care',shiny:false,origin:'existing',
  data:{lifeToken:1,genes:{atk:100,def:100,spe:100}}
 });
 for(let i=0;i<5;i++){
  collection=M.catchWild(collection,{
   dex:25,level:30,nickname:'Box '+i,shiny:false,origin:'wild',
   data:{stats:{atk:100,def:100,spe:100}}
  });
  collection=M.selectTeam(collection,collection.nextId-1);
 }
 let store=new Map();
 const put=(key,type,value)=>store.set(key,{type,value});
 for(const [key,type,value] of [
  ['init',0,true],['dexn',1,1],['age',1,540],
  ['f4lver',1,1],['f4life',1,1],
  ['f4col',3,enc.encode(M.encode(collection))]
 ])put(key,type,value);
 let disk=pack(store),undo=null,serial=0,held=false,mode='ok';
 let confirmFail=false,releaseWrite=null;
 const heap=new Uint8Array(262144);
 const mod={
  HEAPU8:heap,_malloc:()=>4096,_free(){},
  ccall(name,type,types,args){
   const bytes=store.get('f4admit')?.value;
   if(name==='tp_f4_admission_begin')
    return store.get('f4apend')?.value?base.begin():0;
   if(name==='tp_f4_admission_size')return bytes?.length||0;
   if(name==='tp_f4_admission_ptr'){
    if(!bytes)return 0;heap.set(bytes,131072);return 131072;
   }
   if(name==='tp_f4_admission_pending')
    return store.get('f4apend')?.value?1:0;
   if(name==='tp_f4_admission_stage'){
    const [token,ptr,size,pending]=args;
    if(!undo||undo.token!==token)return 0;
    const payload=heap.slice(ptr,ptr+size);
    put('f4aver',1,1);put('f4admit',3,payload);
    put('f4apend',0,!!pending);put('f4acrc',1,crc(payload,pending));
    return 1;
   }
   throw Error(name);
  }
 };
 for(const name of [
  'tp_f4_admission_size','tp_f4_admission_ptr',
  'tp_f4_admission_pending','tp_f4_admission_stage','tp_f4_admission_begin'
 ])mod['_'+name]=()=>{};

 const base={
  read:()=>store.get('f4col').value.slice(),
  begin(){
   assert(!undo);
   undo={token:++serial,store:structuredClone(store)};
   return serial;
  },
  stage(token,bytes){
   assert(undo&&undo.token===token);put('f4col',3,bytes.slice());return 1;
  },
  finish(token,commit){
   if(!undo||undo.token!==token)return 0;
   if(commit&&confirmFail)return 0;
   if(!commit)store=undo.store;
   undo=null;return 1;
  }
 };
 const context={TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,
  TPCollectionModel:M,TPAdmissionModel:A};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(
  'browser_ver/web/storage-tools.js','utf8'
 ),context);
 const admission=G.create(mod,M,A);
 const controller=P.create({
  model:M,bridge:admission.wrapBridge(base),
  nativeActions:{
   ...admission.nativeActions,
   fixtureReserve(before,token,input){
    admission.reserve(token,input);return before;
   }
  },
  acquire(){assert(!held);held=true;return()=>{held=false;};},
  exportSave:()=>pack(store),
  validateSave:bytes=>context.TPStoreTools.parseLegacy(bytes),
  async persist(bytes){
   if(mode==='throw')throw Error('quota');
   if(mode==='false')return false;
   if(mode==='defer')return new Promise(resolve=>{
    releaseWrite=()=>{disk=bytes.slice();resolve(true);};
   });
   disk=bytes.slice();return true;
  }
 });
 admission.bind(controller);
 return {
  admission,controller,
  reserve:()=>controller.act('fixtureReserve',record),
  native:()=>structuredClone(store),
  disk:()=>disk.slice(),
  mode:value=>{mode=value;},
  failConfirm:()=>{confirmFail=true;},
  release:()=>releaseWrite?.(),
  waiting:()=>releaseWrite!==null,
  held:()=>held
 };
}

(async()=>{
 for(const mode of ['throw','false']){
  const t=setup();
  await t.reserve();
  const before=t.controller.read(),waiting=t.admission.read(),disk=t.disk();
  t.mode(mode);
  await assert.rejects(t.admission.complete({mode:'box'}));
  assert.deepEqual(t.disk(),disk);
  assert.deepEqual(t.controller.read(),before);
  assert.deepEqual(t.admission.read(),waiting);
  assert(!t.controller.blocked&&!t.held());
  t.mode('ok');
  await t.admission.complete({mode:'replace',replaceId:before.team[2]});
  assert.equal(t.admission.read().pending,null);
  const after=t.controller.read(),newId=after.nextId-1;
  assert.equal(after.team[2],newId);
  assert.equal(after.active,before.active);
  assert(after.mons.some(m=>m.id===before.team[2]));
  assert.equal(after.mons.find(m=>m.id===newId).dex,145);
  await assert.rejects(t.admission.complete({mode:'box'}),
   e=>e.code==='NO_PENDING_ADMISSION');
 }

 const pinned=setup();await pinned.reserve();
 const before=pinned.controller.read();
 await assert.rejects(pinned.admission.complete({
  mode:'replace',replaceId:before.active
 }),e=>e.code==='CARE_MEMBER_PINNED');
 assert(pinned.admission.read().pending);
 assert.deepEqual(pinned.controller.read(),before);

 const deferred=setup();await deferred.reserve();
 const oldCollection=deferred.controller.read();
 const oldAdmission=deferred.admission.read();
 deferred.mode('defer');
 const operation=deferred.admission.complete({mode:'box'});
 for(let i=0;i<20&&!deferred.waiting();i++)
  await new Promise(resolve=>setImmediate(resolve));
 assert(deferred.waiting()&&deferred.held());
 assert.equal(deferred.native().get('f4apend').value,false);
 assert.deepEqual(deferred.admission.read(),oldAdmission);
 assert.deepEqual(deferred.controller.read(),oldCollection);
 await assert.rejects(deferred.admission.complete({mode:'box'}),
  e=>e.code==='BUSY');
 deferred.release();await operation;
 assert.equal(deferred.admission.read().pending,null);
 assert(!deferred.held());

 const fatal=setup();await fatal.reserve();fatal.failConfirm();
 await assert.rejects(fatal.admission.complete({mode:'box'}),
  e=>e.code==='RELOAD_REQUIRED');
 assert(fatal.controller.blocked&&fatal.held());
 await assert.rejects(fatal.admission.complete({mode:'box'}));

 console.log('P06 admission controller passed: actual collection/admission '+
  'models, actual persistence controller and strict whole-save parser; '+
  'joint candidates, pinned care, retained replaced individual, rejected '+
  'writes with rollback/retry, old published states during deferred write, '+
  'single-flight and post-durability reload lock. Native transport is mocked; '+
  'capture migration, encounter lock and dialog remain unclaimed.');
})().catch(error=>{console.error(error);process.exit(1);});
