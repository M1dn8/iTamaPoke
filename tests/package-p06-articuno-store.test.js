 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const M=require('../browser_ver/web/collection-model.js');
const A=require('../browser_ver/web/collection-admission-model.js');
const Z=require('../browser_ver/web/articuno-story-model.js');
const enc=new TextEncoder();
let checks=0;
const ok=v=>{assert(v);checks++;};
function pack(values){
 const count=Buffer.alloc(4);count.writeUInt32LE(values.size);
 return new Uint8Array(Buffer.concat([count,...Array.from(values,([key,f])=>{
  const name=Buffer.from(key);
  let data;
  if(f.type===0)data=Buffer.from([+f.value]);
  else if(f.type===1){data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(f.value));}
  else data=Buffer.from(f.value);
  const size=Buffer.alloc(4);size.writeUInt32LE(data.length);
  return Buffer.concat([Buffer.from([name.length]),name,
   Buffer.from([f.type]),size,data]);
 })]));
}
function crc(bytes,pending){
 let h=2166136261;
 for(const b of bytes)h=Math.imul(h^b,16777619);
 return Math.imul(h^(pending?1:0),16777619)>>>0;
}
const bird={dex:144,level:50,nickname:'',shiny:false,origin:'wild',
 data:{stats:{atk:120,def:110,spe:130},genes:null,training:null}};
const care=M.attachCurrent(M.create(),{
 dex:1,level:10,nickname:'',shiny:false,origin:'existing',
 data:{lifeToken:1,genes:{atk:100,def:100,spe:100},
  stats:{atk:50,def:50,spe:50}}
});
const ready=Z.advance(Z.advance(Z.create(),'investigate'),'secure');
const won=Z.confirmVictory(ready,A.create(),bird);
const completed=A.complete(won.admission,care,{mode:'box'});
const ctx={TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,
 TPCollectionModel:M,TPAdmissionModel:A,TPArktosModel:Z};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('browser_ver/web/storage-tools.js','utf8'),ctx);

function profile(story=null,admission=null,collection=care){
 const values=new Map();
 const put=(key,type,value)=>values.set(key,{type,value});
 for(const [key,type,value] of [
  ['init',0,true],['dexn',1,1],['age',1,540],
  ['f4lver',1,1],['f4life',1,1],
  ['f4col',3,enc.encode(M.encode(collection))]
 ])put(key,type,value);
 if(story){
  put('arcver',1,story.version);put('arcstep',1,story.step);
  put('arctick',1,story.ticket);
 }
 if(admission){
  const bytes=enc.encode(A.encode(admission)),pending=!!admission.pending;
  put('f4aver',1,1);put('f4admit',3,bytes);
  put('f4apend',0,pending);put('f4acrc',1,crc(bytes,pending));
 }
 return values;
}
const parse=values=>ctx.TPStoreTools.parseLegacy(pack(values));
function accepts(values){parse(values);checks++;}
function rejects(values){assert.throws(()=>parse(values));checks++;}

accepts(profile());
for(const s of [Z.create(),Z.advance(Z.create(),'investigate'),ready])
 accepts(profile(s));
accepts(profile(won.story,won.admission));
accepts(profile(won.story,completed.admission,completed.collection));
const released=M.releaseStored(completed.collection,completed.id,{confirmed:true});
accepts(profile(won.story,completed.admission,released));

rejects(profile(null,won.admission));
rejects(profile(null,completed.admission,completed.collection));
rejects(profile(ready,won.admission));
rejects(profile(won.story));
for(const key of ['arcver','arcstep','arctick']){
 const v=profile(won.story,won.admission);v.delete(key);rejects(v);
}
for(const [key,type,value] of [
 ['arcver',1,2],['arcver',0,true],['arcstep',1,4],
 ['arcstep',1,2],['arctick',1,0],['arctick',1,2],['arctick',1,-1]
]){
 const v=profile(won.story,won.admission);
 v.set(key,{type,value});rejects(v);
}
const other=A.queue(A.create(),{
 kind:'join',source:'story:test:other',pokemon:bird
});
rejects(profile(won.story,other));
const wrong=A.queue(A.create(),{
 kind:'join',source:Z.SOURCE,pokemon:{...bird,level:49}
});
rejects(profile(won.story,wrong));
const duplicate=A.queue(completed.admission,{
 kind:'join',source:Z.SOURCE,pokemon:bird
});
rejects(profile(won.story,duplicate,completed.collection));

let invalidCollection=JSON.parse(JSON.stringify(completed.collection));
invalidCollection.mons.find(m=>m.id===completed.id)
 .data.admission.ticket=2;
M.validate(invalidCollection);
rejects(profile(won.story,completed.admission,invalidCollection));
const trained=M.grantStoredBattleLevel(completed.collection,completed.id);
accepts(profile(won.story,completed.admission,trained));

delete ctx.TPArktosModel;
accepts(profile());
rejects(profile(won.story,won.admission));
ctx.TPArktosModel=Z;
ok(Object.isFrozen(Z.fromNative(1,2,0)));
assert.throws(()=>Z.fromNative(2,2,0));checks++;

const pendingPath=process.env.P06_ARTICUNO_PENDING_FIXTURE;
const emptyPath=process.env.P06_ARTICUNO_EMPTY_FIXTURE;
if(pendingPath||emptyPath){
 assert(pendingPath&&emptyPath);
 fs.writeFileSync(pendingPath,A.encode(won.admission));
 fs.writeFileSync(emptyPath,A.encode(completed.admission));
}
console.log('P06 Arktos strict save passed: '+checks+' checks; actual story, '+
 'admission, collection and whole-save parser, legacy absence, preparation, '+
 'linked victory/waiting/completion, later level gains/release, orphan '+
 'provenance and partial/type/future/ticket mismatch refusal. Actual model '+
 'fixtures supplied to native transport tests; no combat/UI claim.');

// Notice metadata must be complete, typed and versioned.
for(const [key,type,value] of [
 ['arcnver',1,1],
 ['arcnread',1,0]
]){
 const values=profile();
 values.set(key,{type,value});
 rejects(values);
}
for(const read of [0,1]){
 const values=profile();
 values.set('arcnver',{type:1,value:1});
 values.set('arcnread',{type:1,value:read});
 accepts(values);
}
for(const [key,type,value] of [
 ['arcnver',1,2],['arcnver',0,true],
 ['arcnread',1,2],['arcnread',0,true]
]){
 const values=profile();
 values.set('arcnver',{type:1,value:1});
 values.set('arcnread',{type:1,value:0});
 values.set(key,{type,value});
 rejects(values);
}

// Both completed stories share one admission ledger, not one story state.
const P=require('../browser_ver/web/zapdos-story-model.js');
ctx.TPZapdosModel=P;
const zapdosReady=P.advance(P.advance(P.create(),'investigate'),'secure');
const zapdosWon=P.confirmVictory(
 zapdosReady,completed.admission,{...bird,dex:145}
);
const bothJoined=A.complete(
 zapdosWon.admission,completed.collection,{mode:'box'}
);
function bothProfile(collection=bothJoined.collection){
 const values=profile(won.story,bothJoined.admission,collection);
 values.set('zpdver',{type:1,value:zapdosWon.story.version});
 values.set('zpdstep',{type:1,value:zapdosWon.story.step});
 values.set('zpdtick',{type:1,value:zapdosWon.story.ticket});
 return values;
}
accepts(bothProfile());
assert.notEqual(won.story.ticket,zapdosWon.story.ticket);

const wrongZapdosTicket=bothProfile();
wrongZapdosTicket.set('zpdtick',{type:1,value:won.story.ticket});
rejects(wrongZapdosTicket);

let releasedBoth=M.releaseStored(
 bothJoined.collection,completed.id,{confirmed:true}
);
releasedBoth=M.releaseStored(
 releasedBoth,bothJoined.id,{confirmed:true}
);
accepts(bothProfile(releasedBoth));
const duplicateHistoricalTicket=bothProfile(releasedBoth);
duplicateHistoricalTicket.set('zpdtick',{
 type:1,value:won.story.ticket
});
rejects(duplicateHistoricalTicket);

delete ctx.TPArktosModel;
rejects(bothProfile());
ctx.TPArktosModel=Z;
delete ctx.TPZapdosModel;
rejects(bothProfile());
ctx.TPZapdosModel=P;

console.log('P06 mixed story saves passed: '+checks+
 ' accumulated checks; Arktos notice validation, both completed profiles, '+
 'shared admission ledger, distinct tickets even after release, '+
 'and required-model refusal. Synthetic save parsing only; '+
 'no native battle or browser acceptance claim.');
