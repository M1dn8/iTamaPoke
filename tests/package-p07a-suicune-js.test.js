 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const M=require('../browser_ver/web/collection-model.js');
const A=require('../browser_ver/web/collection-admission-model.js');
const Z=require('../browser_ver/web/zapdos-story-model.js');
const S=require('../browser_ver/web/suicune-story-model.js');
const C=require('../browser_ver/web/collection-zapdos.js');
const R=require('../browser_ver/web/suicune-source-preview.js');
const enc=new TextEncoder();
let parserChecks=0;

const care=M.attachCurrent(M.create(),{
 dex:1,level:10,nickname:'',shiny:false,origin:'existing',
 data:{
  lifeToken:1,genes:{atk:100,def:100,spe:100},
  stats:{atk:50,def:50,spe:50}
 }
});
const pokemon={
 dex:245,level:50,nickname:'',shiny:false,origin:'wild',
 data:{stats:{atk:120,def:110,spe:130},genes:null,training:null}
};
const ready=S.advance(S.advance(S.create(),'investigate'),'secure');
const won=S.confirmVictory(ready,A.create(),pokemon);
const joined=A.complete(won.admission,care,{mode:'box'});

assert.equal(S.SOURCE,'story:johto:suicune');
assert.equal(S.create().schema,'itamapoke.story.suicune');
for(const state of [S.create(),S.advance(S.create(),'investigate'),ready]){
 assert.deepEqual(S.decode(S.encode(state)),state);
 assert(Object.isFrozen(state));
}
assert.throws(()=>S.fromNative(2,2,0));
assert.throws(()=>S.confirmVictory(ready,A.create(),{...pokemon,dex:144}));
assert.throws(()=>S.confirmVictory(ready,A.create(),{...pokemon,level:49}));
assert.throws(()=>S.confirmVictory(ready,A.create(),{...pokemon,shiny:true}));

function pack(values){
 const count=Buffer.alloc(4);count.writeUInt32LE(values.size);
 return new Uint8Array(Buffer.concat([
  count,...Array.from(values,([key,f])=>{
   const name=Buffer.from(key);
   let data;
   if(f.type===0)data=Buffer.from([+f.value]);
   else if(f.type===1){
    data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(f.value));
   }else data=Buffer.from(f.value);
   const size=Buffer.alloc(4);size.writeUInt32LE(data.length);
   return Buffer.concat([
    Buffer.from([name.length]),name,Buffer.from([f.type]),size,data
   ]);
  })
 ]));
}
function crc(bytes,pending){
 let h=2166136261;
 for(const b of bytes)h=Math.imul(h^b,16777619);
 return Math.imul(h^(pending?1:0),16777619)>>>0;
}
function profile(story=null,admission=null,collection=care){
 const values=new Map();
 const put=(key,type,value)=>values.set(key,{type,value});
 for(const [key,type,value] of [
  ['init',0,true],['dexn',1,1],['age',1,540],
  ['f4lver',1,1],['f4life',1,1],
  ['f4col',3,enc.encode(M.encode(collection))]
 ])put(key,type,value);
 if(story){
  put('suiver',1,story.version);put('suistep',1,story.step);
  put('suitick',1,story.ticket);
 }
 if(admission){
  const bytes=enc.encode(A.encode(admission)),pending=!!admission.pending;
  put('f4aver',1,1);put('f4admit',3,bytes);
  put('f4apend',0,pending);put('f4acrc',1,crc(bytes,pending));
 }
 return values;
}
const ctx={
 TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,
 TPCollectionModel:M,TPAdmissionModel:A,TPZapdosModel:Z,TPSuicuneModel:S
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('browser_ver/web/storage-tools.js','utf8'),ctx);
const parse=values=>ctx.TPStoreTools.parseLegacy(pack(values));
function accepts(values){parse(values);parserChecks++;}
function rejects(values){assert.throws(()=>parse(values));parserChecks++;}

const legacy=profile();
assert.deepEqual(parse(legacy).raw,pack(legacy));
assert(!parse(legacy).values.has('suiver'));
accepts(legacy);
for(const state of [S.create(),S.advance(S.create(),'investigate'),ready])
 accepts(profile(state));
accepts(profile(won.story,won.admission));
accepts(profile(won.story,joined.admission,joined.collection));
const released=M.releaseStored(joined.collection,joined.id,{confirmed:true});
accepts(profile(won.story,joined.admission,released));
const trained=M.grantStoredBattleLevel(joined.collection,joined.id);
accepts(profile(won.story,joined.admission,trained));

rejects(profile(null,won.admission));
rejects(profile(null,joined.admission,joined.collection));
rejects(profile(ready,won.admission));
rejects(profile(won.story));
for(const key of ['suiver','suistep','suitick']){
 const values=profile(ready);values.delete(key);rejects(values);
}
for(const [key,type,value] of [
 ['suiver',1,2],['suiver',0,true],['suistep',1,4],
 ['suistep',1,-1],['suitick',1,1],['suitick',1,-1]
]){
 const values=profile(ready);values.set(key,{type,value});rejects(values);
}
for(const value of [0,1]){
 const values=profile();
 values.set('suinver',{type:1,value:1});
 values.set('suinread',{type:1,value});
 accepts(values);
}
for(const change of ['missing','future','type','range']){
 const values=profile();
 values.set('suinver',{type:1,value:change==='future'?2:1});
 if(change!=='missing')
  values.set('suinread',{
   type:change==='type'?0:1,
   value:change==='type'?true:change==='range'?2:0
  });
 rejects(values);
}
const wrong=A.queue(A.create(),{
 kind:'join',source:S.SOURCE,pokemon:{...pokemon,level:49}
});
rejects(profile(won.story,wrong));
const duplicate=A.queue(joined.admission,{
 kind:'join',source:S.SOURCE,pokemon
});
rejects(profile(won.story,duplicate,joined.collection));
const collision=profile(won.story,joined.admission,joined.collection);
collision.set('zpdver',{type:1,value:1});
collision.set('zpdstep',{type:1,value:3});
collision.set('zpdtick',{type:1,value:won.story.ticket});
rejects(collision);

delete ctx.TPSuicuneModel;
accepts(profile(ready));
delete ctx.TPZapdosModel;
accepts(profile());
rejects(profile(ready));
ctx.TPZapdosModel=Z;ctx.TPSuicuneModel=S;

function serviceFixture(name='suicune'){
 const dex=name==='suicune'?245:144;
 const model=name==='suicune'?S:Z.forStory(name);
 let step=0,notice=0,serial=0,activeToken=0,snapshot=null;
 let diskStep=0,writes=0,writer=async()=>true,lastPayload=null;
 const calls=[];
 const names=[
  'tp_story_step','tp_story_ticket','tp_story_advance',
  'tp_story_duel_start','tp_story_duel_get','tp_story_duel_snapshot',
  'tp_story_duel_result_begin','tp_story_duel_result_apply',
  'tp_story_duel_result_finish','tp_wt_view','tp_wt_stage_begin',
  'tp_wt_stage_entry','tp_story_access','tp_story_kanto_badges',
  'tp_story_notice_read','tp_story_notice_mark',
  'tp_story_region','tp_story_badges','tp_suicune_source_complete'
 ];
 const mod={};
 for(const n of names)mod['_'+n]=()=>{};
 mod.ccall=(n,type,types,args)=>{
  calls.push({name:n,args:[...args]});
  if(n==='tp_story_step'){assert.equal(args[0],dex);return step;}
  if(n==='tp_story_ticket'){assert.equal(args[0],dex);return 0;}
  if(n==='tp_story_access'){assert.equal(args[0],dex);return 1;}
  if(n==='tp_story_region'){assert.equal(dex,245);return 1;}
  if(n==='tp_story_badges'){assert.equal(args[0],245);return 4;}
  if(n==='tp_story_kanto_badges'){assert.equal(args[0],144);return 6;}
  if(n==='tp_story_notice_read')return notice;
  if(n==='tp_story_notice_mark'){
   if(args[0]!==activeToken||args[1]!==dex)return 0;
   notice=1;return 1;
  }
  if(n==='tp_story_advance'){
   if(args[0]!==activeToken||args[1]!==dex||args[2]!==step||
      step>1||(dex===245&&step===1))return 0;
   step++;return 1;
  }
  if(n==='tp_suicune_source_complete'){
   assert.equal(args.length,4);
   if(args[0]!==activeToken||step!==1||
      !R.createRound(args.slice(1)).view().solved)return 0;
   step=2;return 1;
  }
  throw Error('Unexpected mock RPC: '+n);
 };
 const base={
  read:()=>care,
  begin(){
   assert.equal(activeToken,0);
   snapshot={step,notice};activeToken=++serial;return activeToken;
  },
  stage:()=>1,
  finish(token,commit){
   assert.equal(token,activeToken);
   if(!commit){step=snapshot.step;notice=snapshot.notice;}
   else diskStep=step;
   activeToken=0;snapshot=null;return 1;
  }
 };
 const admission={supported:true,read:()=>A.create()};
 const svc=C.create(mod,M,model,A,admission,base,s=>s,name);
 const controller={
  busy:false,blocked:false,read:()=>care,
  async act(action,payload){
   assert(!this.busy);
   this.busy=true;lastPayload=payload;
   const token=base.begin(action);
   try{
    const result=svc.nativeActions[action](care,token,payload);
    writes++;
    if(await writer()!==true)throw Error('Synthetic write refusal');
    assert.equal(base.finish(token,1),1);
    this.busy=false;return result;
   }catch(error){
    if(activeToken)base.finish(token,0);
    this.busy=false;throw error;
   }
  }
 };
 svc.bind(controller);
 return {
  svc,mod,calls,
  writer(fn){writer=fn;},
  state:()=>({step,notice,diskStep,writes,activeToken,busy:controller.busy}),
  payload:()=>lastPayload
 };
}

(async()=>{
 const f=serviceFixture();
 assert(f.svc.supported&&f.svc.noticeSupported);
 assert.equal(f.svc.access().badges,4);
 assert.equal(f.svc.read().step,0);
 await f.svc.advance('investigate');
 assert.equal(f.svc.read().step,1);

 const before=f.state();
 for(const value of [
  undefined,null,[],[2,0],[2,0,0,1],[2,0,4],[-1,0,0],
  [2,.5,0],new Array(3),'2,0,0',new Uint8Array([2,0,0])
 ]){
  assert.throws(()=>f.svc.advance('secure',value),
   e=>e.code==='INVALID_SUICUNE_SOURCE_PROOF');
 }
 assert.deepEqual(f.state(),before);

 await assert.rejects(f.svc.advance('secure',[0,1,1]),
  e=>e.code==='NATIVE_SUICUNE_ADVANCE_REFUSED');
 assert.equal(f.state().step,1);
 assert.equal(f.state().diskStep,1);

 let rejectWrite;
 f.writer(()=>new Promise((resolve,reject)=>{rejectWrite=reject;}));
 const proof=[2,0,0];
 const pending=f.svc.advance('secure',proof);
 proof[0]=0;
 assert.equal(f.state().step,2);
 assert.equal(f.state().diskStep,1);
 assert.equal(f.svc.read().step,1);
 assert(f.state().busy);
 assert(Object.isFrozen(f.payload()));
 assert(Object.isFrozen(f.payload().rotations));
 assert.deepEqual(f.payload().rotations,[2,0,0]);
 assert.throws(()=>f.svc.advance('secure',[2,0,0]),e=>e.code==='BUSY');
 rejectWrite(Error('Synthetic source-save failure'));
 await assert.rejects(pending,/Synthetic source-save failure/);
 assert.equal(f.svc.read().step,1);
 assert.equal(f.state().diskStep,1);
 assert.equal(f.state().activeToken,0);

 f.writer(async()=>true);
 await f.svc.advance('secure',[2,0,2]);
 assert.equal(f.svc.read().step,2);
 assert.equal(f.state().diskStep,2);
 assert.equal(f.svc.view().phase,'duel');
 assert.throws(()=>f.svc.advance('secure',[2,0,2]));
 assert(!f.calls.some(c=>c.name==='tp_story_kanto_badges'));
 assert(f.calls.some(c=>c.name==='tp_suicune_source_complete'));

 const old=serviceFixture('articuno');
 assert.equal(old.svc.access().badges,6);
 await old.svc.advance('investigate');
 await old.svc.advance('secure');
 assert.equal(old.svc.read().step,2);
 assert(!old.calls.some(c=>c.name==='tp_suicune_source_complete'));
 assert(!old.calls.some(c=>c.name==='tp_story_region'));

 const unavailable=serviceFixture();
 delete unavailable.mod._tp_suicune_source_complete;
 const unsupported=C.create(
  unavailable.mod,M,S,A,{supported:true,read:()=>A.create()},
  {read:()=>care,begin:()=>0,stage:()=>0,finish:()=>0},s=>s,'suicune'
 );
 assert.equal(unsupported.supported,false);

 console.log(
  'P07a Suicune JS passed: '+parserChecks+' strict save cases; '+
  'shared model, provenance/ticket/notice checks, legacy neutrality, '+
  'regional RPC routing, required core exports, immutable source proof, '+
  'held publication, simulated save rollback/retry and unchanged Arktos route. '+
  'Native calls and persistence mocked; no WASM/browser/durable-save claim.'
 );
})().catch(error=>{console.error(error);process.exitCode=1;});
