'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');

const context={
 crypto:crypto.webcrypto,TextEncoder,TextDecoder,
 Uint8Array,ArrayBuffer,DataView,URL,Blob,console
};
context.window=context;
vm.createContext(context);
for(const name of ['trainer-art.js','storage-tools.js']){
 vm.runInContext(
  fs.readFileSync('browser_ver/web/'+name,'utf8'),context
 );
}
const A=context.TPTrainerArt,T=context.TPStoreTools;
const expected=[
 'rocko','misty','major-bob','erika','koga','sabrina','pyro','giovanni',
 'johto-arena-falk','johto-arena-kai','johto-arena-bianka',
 'johto-arena-jens','johto-arena-hartwig','johto-arena-jasmin',
 'johto-arena-norbert','johto-arena-sandra',
 'kanto-elite-lorelei','kanto-elite-bruno','kanto-elite-agathe',
 'kanto-elite-siegfried','kanto-champ-blau',
 'johto-elite-willi','johto-elite-koga','johto-elite-bruno',
 'johto-elite-melanie','johto-champ-siegfried'
];
let checks=0;
function eq(actual,wanted){
 assert.deepEqual(actual,wanted);checks++;
}
async function rejects(fn){
 await assert.rejects(fn);checks++;
}
function file(name,bytes){
 const b=Uint8Array.from(bytes);
 return {name,size:b.length,arrayBuffer:async()=>b.buffer};
}
function database(){
 const values=new Map();
 const db={values,transactions:0,fail:false,transaction(){
  db.transactions++;
  const pending=[];
  let scheduled=false;
  const tx={objectStore(){return {put(value,key){
   pending.push([key,value]);
   if(scheduled)return;
   scheduled=true;
   queueMicrotask(()=>{
    if(db.fail){
     tx.error=Error('quota');
     tx.onabort?.();
    }else{
     for(const [key,value] of pending)values.set(key,value);
     tx.oncomplete?.();
    }
   });
  }};}};
  return tx;
 }};
 return db;
}
function reheader(input,version,index){
 const body=Buffer.from(input.subarray(0,input.length-32));
 body.writeUInt16LE(version,4);
 body.writeUInt16LE(index,6);
 return Buffer.concat([
  body,crypto.createHash('sha256').update(body).digest()
 ]);
}
(async()=>{
 const dir=process.env.TP_TRAINER_FIXTURES;
 if(!dir)throw Error('Run tools/quality/test-f4-trainer.py');
 eq(JSON.stringify(A.entries.map(e=>e.leader)),JSON.stringify(expected));
 eq(new Set(A.entries.map(e=>e.key)).size,26);
 const files=[],raws=[];
 for(let i=0;i<expected.length;i++){
  const leader=expected[i];
  const key=(i<8?'trainer-kanto-':'trainer-')+leader+'.bin';
  const version=i<8?1:2;
  const entry=A.entries[i];
  eq(entry.key,key);
  eq(entry.index,i);
  eq(entry.version,version);

  const named=A.canonical(key.toUpperCase());
  eq(named.key,key);
  eq(named.leader,leader);
  eq(named.version,version);

  const stored=T.canonicalSprite(key);
  eq(stored.key,key);
  eq(stored.trainer,true);

  const raw=fs.readFileSync(path.join(dir,key));
  raws.push(raw);
  files.push(file(key,raw));
  const checked=await A.inspect(raw,leader);
  eq(checked.leader,leader);
  eq(checked.key,key);
  eq(checked.index,i);
  eq(checked.version,version);
  eq(checked.width,1);
  eq(checked.height,1);
  eq(checked.metadata.author,'Synthetic test author');
  await rejects(()=>A.inspect(raw,expected[(i+1)%expected.length]));
 }

 for(const [raw,version,index] of [
  [raws[0],2,0],[raws[8],1,8],
  [raws[0],0,0],[raws[8],3,8],
  [raws[8],2,26],[raws[8],2,65535]
 ]){
  await rejects(()=>A.inspect(reheader(raw,version,index)));
 }

 const decode=async png=>{A.inspectPNG(png);};
 const db=database();
 const result=await A.importBatch(db,'sprites',files,{decode});
 eq(result.saved,26);
 eq(result.skipped,0);
 eq(db.transactions,1);
 eq(db.values.size,26);
 eq(
  JSON.stringify([...db.values.keys()]),
  JSON.stringify(A.entries.map(e=>e.key))
 );

 const skipped=await A.importBatch(db,'sprites',files,{
  decode,onlyMissing:true,readExisting:async key=>db.values.get(key)
 });
 eq(skipped.saved,0);
 eq(skipped.skipped,26);
 eq(db.transactions,1);

 const mismatch=database(),wrong=files.slice();
 wrong[8]=file(files[8].name,raws[0]);
 await rejects(()=>A.importBatch(mismatch,'sprites',wrong,{decode}));
 eq(mismatch.transactions,0);
 eq(mismatch.values.size,0);

 const duplicate=database();
 await rejects(()=>A.importBatch(
  duplicate,'sprites',[files[8],files[8]],{decode}
 ));
 eq(duplicate.transactions,0);

 const quota=database();
 quota.fail=true;
 await rejects(()=>A.importBatch(quota,'sprites',files,{decode}));
 eq(quota.values.size,0);

 console.log(
  'TPTR v1/v2 passed: '+checks+' assertions; '+
  '26 Python/JS mappings, version separation, rehashed invalid headers, '+
  '26-file import, only-missing, mismatch, duplicates and quota abort. '+
  'Browser image decoding not tested.'
 );
})().catch(error=>{console.error(error);process.exit(1);});
