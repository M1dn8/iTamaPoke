 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const M=require('../browser_ver/web/collection-model.js');
const A=require('../browser_ver/web/collection-admission-model.js');
const Z=require('../browser_ver/web/zapdos-story-model.js');
const P=require('../browser_ver/web/collection-persistence.js');
const G=require('../browser_ver/web/collection-admission.js');
const S=require('../browser_ver/web/collection-zapdos.js');
const enc=new TextEncoder();
let checks=0;
const ok=v=>{assert(v);checks++;};
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
function pack(store){
 const count=Buffer.alloc(4);count.writeUInt32LE(store.size);
 return new Uint8Array(Buffer.concat([count,...Array.from(
  store,([key,{type,value}])=>{
   const name=Buffer.from(key);let bytes;
   if(type===0)bytes=Buffer.from([+value]);
   else if(type===1){bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));}
   else bytes=Buffer.from(value);
   const size=Buffer.alloc(4);size.writeUInt32LE(bytes.length);
   return Buffer.concat([Buffer.from([name.length]),name,
    Buffer.from([type]),size,bytes]);
  }
 )]));
}
function crc(bytes,pending){
 let h=2166136261;
 for(const b of bytes)h=Math.imul(h^b,16777619);
 return Math.imul(h^(pending?1:0),16777619)>>>0;
}
function setup({step=2,won=true}={}){
 const care=M.attachCurrent(M.create(),{
  dex:1,level:10,nickname:'Care',shiny:false,origin:'existing',
  data:{lifeToken:1,genes:{atk:100,def:100,spe:100},
   stats:{atk:50,def:50,spe:50}}
 });
 let store=new Map();
 const put=(k,type,value)=>store.set(k,{type,value});
 for(const [k,type,value] of [
  ['init',0,true],['dexn',1,1],['age',1,540],['f4lver',1,1],
  ['f4life',1,1],['f4col',3,enc.encode(M.encode(care))]
 ])put(k,type,value);
 if(step){put('zpdver',1,1);put('zpdstep',1,step);put('zpdtick',1,0);}
 let disk=pack(store),undo=null,serial=0,held=false,mode='ok',release=null;
 let confirmFail=false,rosterBad=false;
 let combat={open:true,pending:true,done:false,won};
 const heap=new Uint8Array(524288);
 function currentStep(){
  const keys=['zpdver','zpdstep','zpdtick'];
  if(!keys.some(k=>store.has(k)))return 0;
  if(!keys.every(k=>store.has(k)&&store.get(k).type===1))return -1;
  try{
   return Z.fromNative(store.get('zpdver').value,
    store.get('zpdstep').value,store.get('zpdtick').value).step;
  }catch(_){return -1;}
 }
 const mod={
  HEAPU8:heap,_malloc:()=>4096,_free(){},
  ccall(name,type,types,args){
   const bytes=store.get('f4admit')?.value;
   if(name==='tp_f4_admission_size')return bytes?.length||0;
   if(name==='tp_f4_admission_ptr'){
    if(!bytes)return 0;heap.set(bytes,131072);return 131072;
   }
   if(name==='tp_f4_admission_pending')return store.get('f4apend')?.value?1:0;
   if(name==='tp_f4_admission_begin')
    return !combat.open&&store.get('f4apend')?.value?base.begin():0;
   if(name==='tp_zpd_admission_stage'){
     const [token,ptr,size,ticket]=args;
     if(combat.open||currentStep()!==3||
        store.get('zpdtick')?.value!==ticket||
        !store.get('f4apend')?.value)return 0;
     // Transport mock only. Actual native journal effects are checked
     // by the WASM browser integration tests, not simulated here.
     return mod.ccall('tp_f4_admission_stage','number',
      ['number','number','number','number'],[token,ptr,size,0]);
    }
    if(name==='tp_f4_admission_stage'){
    const [token,ptr,size,pending]=args;
    if(!undo||undo.token!==token)return 0;
    const payload=heap.slice(ptr,ptr+size);
    put('f4aver',1,1);put('f4admit',3,payload);
    put('f4apend',0,!!pending);put('f4acrc',1,crc(payload,pending));
    return 1;
   }
   if(name==='tp_zpd_step')return currentStep();
   if(name==='tp_zpd_ticket')
    return currentStep()<0?-1:(store.get('zpdtick')?.value||0);
   if(name==='tp_zpd_advance'){
    const [token,expected]=args;
    if(!undo||undo.token!==token||combat.open||
       expected<0||expected>1||currentStep()!==expected)return 0;
    put('zpdver',1,1);put('zpdstep',1,expected+1);put('zpdtick',1,0);
    return 1;
   }
   if(name==='tp_zpd_get'){
    if(!combat.open)return 0;
    return [1,+combat.pending,+combat.done,+combat.won,9][args[0]]||0;
   }
   if(name==='tp_wt_view')return JSON.stringify({
    live:1,arena:false,count:1,won:combat.won,
    winnerId:combat.won?care.active:0,
    members:[{id:rosterBad?999:care.active,dex:1,level:10}]
   });
   if(name==='tp_zpd_snapshot')return JSON.stringify({
    dex:145,level:50,nickname:'',shiny:false,origin:'wild',
    data:{stats:{atk:120,def:110,spe:130},genes:null,training:null}
   });
   if(name==='tp_zpd_result_begin'){
    if(undo||!combat.open||!combat.pending||currentStep()!==2||
       store.get('f4apend')?.value)return 0;
    return base.begin();
   }
   if(name==='tp_zpd_result_apply'){
    const [token,ticket]=args;
    if(!undo||undo.token!==token||undo.applied)return 0;
    if(combat.won){
     if(!ticket||!store.get('f4apend')?.value)return 0;
     put('zpdver',1,1);put('zpdstep',1,3);put('zpdtick',1,ticket);
    }else if(ticket)return 0;
    undo.applied=true;return 1;
   }
   if(name==='tp_zpd_result_finish'){
    const [token,commit]=args;
    if(!undo||undo.token!==token||commit&&!undo.applied)return 0;
    if(commit&&confirmFail)return 0;
    const result=base.finish(token,commit);
    if(result&&commit){combat.pending=false;combat.done=true;}
    return result;
   }
   throw Error('Unexpected mock transport call: '+name);
  }
 };
 for(const name of [
  'tp_f4_admission_size','tp_f4_admission_ptr','tp_f4_admission_pending',
  'tp_f4_admission_stage','tp_zpd_admission_stage','tp_f4_admission_begin','tp_zpd_step',
  'tp_zpd_ticket','tp_zpd_advance','tp_zpd_start','tp_zpd_get',
  'tp_zpd_snapshot','tp_zpd_result_begin','tp_zpd_result_apply',
  'tp_zpd_result_finish','tp_wt_view','tp_wt_stage_begin','tp_wt_stage_entry'
 ])mod['_'+name]=()=>{};
 const base={
  read:()=>store.get('f4col').value.slice(),
  begin(){
   if(undo)return 0;
   undo={token:++serial,store:structuredClone(store),applied:false};
   return serial;
  },
  stage(token,bytes){
   assert(undo&&undo.token===token);put('f4col',3,bytes.slice());return 1;
  },
  finish(token,commit){
   if(!undo||undo.token!==token)return 0;
   if(!commit)store=undo.store;
   undo=null;return 1;
  }
 };
 const admission=G.create(mod,M,A);
 const story=S.create(mod,M,Z,A,admission,base);
 const context={TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,
  TPCollectionModel:M,TPAdmissionModel:A,TPZapdosModel:Z};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(
  'browser_ver/web/storage-tools.js','utf8'
 ),context);
 const controller=P.create({
  model:M,bridge:admission.wrapBridge(story.bridge),
  nativeActions:{...admission.nativeActions,...story.nativeActions},
  acquire(){
   assert(!held);held=true;return()=>{held=false;};
  },
  exportSave:()=>pack(store),
  validateSave:bytes=>context.TPStoreTools.parseLegacy(bytes),
  async persist(bytes){
   if(mode==='false')return false;
   if(mode==='throw')throw Error('quota');
   if(mode==='defer')return new Promise(resolve=>{
    release=()=>{disk=bytes.slice();resolve(true);};
   });
   disk=bytes.slice();return true;
  }
 });
 admission.bind(controller);story.bind(controller);
 return {
  story,admission,controller,mode:v=>{mode=v;},disk:()=>disk.slice(),
  nativeStep:()=>currentStep(),held:()=>held,
  nativePending:()=>!!store.get('f4apend')?.value,
  closeBattle:()=>{combat.open=false;},
  release:()=>release?.(),waiting:()=>!!release,
  failConfirm:()=>{confirmFail=true;},
  corruptRoster:()=>{rosterBad=true;},
  corruptStory:()=>{put('zpdver',1,2);}
 };
}

(async()=>{
 const progress=setup({step:0});progress.closeBattle();
 eq(progress.story.view().phase,'investigate');
 await progress.story.advance('investigate');
 eq(progress.story.read().step,1);
 await progress.story.advance('secure');
 eq(progress.story.view().phase,'duel');
 await progress.story.prepare();
 await assert.rejects(async()=>progress.story.advance('secure'));
 progress.corruptStory();
 assert.throws(()=>progress.story.read());checks++;

 for(const mode of ['false','throw']){
  const t=setup(),before=t.controller.read(),disk=t.disk();
  t.mode(mode);
  await assert.rejects(t.story.complete());
  eq(t.disk(),disk);eq(t.controller.read(),before);
  eq(t.story.read().step,2);eq(t.admission.read().pending,null);
  ok(!t.controller.blocked&&!t.held());
  t.mode('ok');await t.story.complete();
  eq(t.story.view().phase,'waiting');
  eq(t.controller.read(),before);
  eq(t.admission.read().pending.pokemon.level,50);
  await assert.rejects(async()=>t.story.complete());
  await assert.rejects(async()=>t.story.prepare());
  t.closeBattle();
  await t.admission.complete({mode:'auto'});
  eq(t.story.view().phase,'complete');
  eq(t.controller.read().mons.length,before.mons.length+1);
  eq(t.controller.read().team.length,before.team.length+1);
 }

 const deferred=setup(),old=deferred.controller.read();
 deferred.mode('defer');
 const operation=deferred.story.complete();
 for(let i=0;i<30&&!deferred.waiting();i++)
  await new Promise(resolve=>setImmediate(resolve));
 ok(deferred.waiting()&&deferred.held());
 eq(deferred.nativeStep(),3);eq(deferred.nativePending(),true);
 eq(deferred.story.read().step,2);
 eq(deferred.admission.read().pending,null);
 eq(deferred.controller.read(),old);
 await assert.rejects(async()=>deferred.story.complete(),e=>e.code==='BUSY');
 deferred.release();await operation;
 eq(deferred.story.read().step,3);
 eq(deferred.story.view().phase,'waiting');ok(!deferred.held());

 const loss=setup({won:false}),beforeLoss=loss.controller.read();
 await loss.story.complete();
 eq(loss.story.read().step,2);eq(loss.admission.read().pending,null);
 eq(loss.controller.read(),beforeLoss);

 const stale=setup(),staleDisk=stale.disk();
 stale.corruptRoster();
 await assert.rejects(stale.story.complete(),e=>e.code==='ZAPDOS_ROSTER_CHANGED');
 eq(stale.disk(),staleDisk);eq(stale.story.read().step,2);
 eq(stale.admission.read().pending,null);

 const fatal=setup();fatal.failConfirm();
 await assert.rejects(fatal.story.complete(),e=>e.code==='RELOAD_REQUIRED');
 ok(fatal.controller.blocked&&fatal.held());
 await assert.rejects(async()=>fatal.story.complete(),e=>e.code==='RELOAD_REQUIRED');

 console.log('P06 Zapdos browser controller passed: '+checks+' assertions '+
  'plus rejection checks; actual story/admission/collection models, actual '+
  'persistence controller and strict whole-save parser; preparation, joint '+
  'victory/admission candidates, failed-write rollback/retry, deferred old '+
  'publication, loss without entitlement, stale roster refusal, admission '+
  'handover and post-durability reload lock. Native transport is mocked; '+
  'actual combat is covered separately; story UI is not yet claimed.');
})().catch(error=>{console.error(error);process.exit(1);});
