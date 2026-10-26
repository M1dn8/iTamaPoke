 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const M=require('../browser_ver/web/collection-model.js');
const A=require('../browser_ver/web/collection-admission-model.js');
const enc=new TextEncoder();

const care={
 dex:1,level:10,nickname:'Care',shiny:false,origin:'existing',
 data:{lifeToken:1,genes:{atk:100,def:100,spe:100}}
};
const collection=M.attachCurrent(M.create(),care);
const pending=A.queue(A.create(),{
 kind:'join',source:'story:kanto:zapdos',
 pokemon:{
  dex:145,level:50,nickname:'Zapdos ⚡',shiny:false,origin:'wild',
  data:{stats:{atk:100,def:100,spe:100}}
 }
});
const finished=A.complete(pending,collection,{mode:'box'});

function crc(bytes,pending){
 let hash=2166136261;
 for(const byte of bytes)hash=Math.imul(hash^byte,16777619);
 return Math.imul(hash^(pending?1:0),16777619)>>>0;
}
function pack(fields){
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.length);
 return new Uint8Array(Buffer.concat([count,...fields.map(([key,type,value])=>{
  const name=Buffer.from(key);
  let data;
  if(type===0)data=Buffer.from([+value]);
  else if(type===1){data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(value));}
  else data=Buffer.from(value);
  const size=Buffer.alloc(4);size.writeUInt32LE(data.length);
  return Buffer.concat([Buffer.from([name.length]),name,
   Buffer.from([type]),size,data]);
 })]));
}
function fields(admission=pending,model=collection){
 const bytes=enc.encode(A.encode(admission));
 return [
  ['init',0,true],['dexn',1,1],['age',1,540],
  ['f4lver',1,1],['f4life',1,1],
  ['f4col',3,enc.encode(M.encode(model))],
  ['f4aver',1,1],['f4admit',3,bytes],
  ['f4apend',0,admission.pending!==null],
  ['f4acrc',1,crc(bytes,admission.pending!==null)]
 ];
}
function parser(withModel=true){
 const c={TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,
  TPCollectionModel:M,...(withModel?{TPAdmissionModel:A}:{})};
 vm.createContext(c);
 vm.runInContext(fs.readFileSync('browser_ver/web/storage-tools.js','utf8'),c);
 return c.TPStoreTools;
}
const P=parser();
for(const [admission,model] of [
 [pending,collection],[finished.admission,finished.collection]
]){
 const parsed=P.parseLegacy(pack(fields(admission,model)));
 const raw=parsed.values.get('f4admit').value;
 assert.deepEqual(A.decode(new TextDecoder().decode(raw)),admission);
}
assert.throws(()=>parser(false).parseLegacy(pack(fields())));
for(const key of ['f4aver','f4admit','f4apend','f4acrc']){
 assert.throws(()=>P.parseLegacy(pack(fields().filter(f=>f[0]!==key))));
}
for(const [key,type,value] of [
 ['f4aver',1,2],['f4apend',1,1],['f4acrc',1,0],
 ['f4admit',3,enc.encode('broken')]
]){
 const f=fields();f[f.findIndex(row=>row[0]===key)]=[key,type,value];
 assert.throws(()=>P.parseLegacy(pack(f)));
}
const contradictory=fields();
contradictory.find(f=>f[0]==='f4apend')[2]=false;
contradictory.find(f=>f[0]==='f4acrc')[2]=crc(
 contradictory.find(f=>f[0]==='f4admit')[2],false
);
assert.throws(()=>P.parseLegacy(pack(contradictory)));
assert.throws(()=>P.parseLegacy(pack(fields(pending,finished.collection))));

// A valid transport checksum must not bypass JSON/model validation.
const malformed=fields();
const bad=enc.encode('{"format":"UNKNOWN"}');
malformed.find(f=>f[0]==='f4admit')[2]=bad;
malformed.find(f=>f[0]==='f4acrc')[2]=crc(bad,true);
assert.throws(()=>P.parseLegacy(pack(malformed)));

if(process.env.P06_ADMISSION_PENDING_FIXTURE){
 fs.writeFileSync(process.env.P06_ADMISSION_PENDING_FIXTURE,A.encode(pending));
 fs.writeFileSync(process.env.P06_ADMISSION_EMPTY_FIXTURE,
  A.encode(finished.admission));
}
console.log('P06 admission save parser passed: real model containers, '+
 'pending/completed roundtrips, mandatory transport metadata, UTF-8/model '+
 'validation, checksum/flag consistency, future/partial refusal and '+
 'pending-plus-already-admitted rejection. No gameplay activation claimed.');
