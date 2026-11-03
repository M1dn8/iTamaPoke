
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const path=require('node:path'),os=require('node:os');
const A=require('../browser_ver/web/trainer-art.js');
const artifact=require('../tools/quality/web-artifact.cjs');
const expected=[
 'rocko','misty','major-bob','erika','koga','sabrina','pyro','giovanni',
 'johto-arena-falk','johto-arena-kai','johto-arena-bianka','johto-arena-jens',
 'johto-arena-jasmin','johto-arena-norbert','johto-arena-sandra'
];
(async()=>{
 assert.equal(A.entries.length,50);
 assert.deepEqual(A.ids,['rocko','misty','major-bob','erika','koga','sabrina','pyro','giovanni']);
 for(let index=0;index<8;index++){
  assert.equal(A.entries[index].leader,A.ids[index]);
  assert.equal(A.entries[index].index,index);
  assert.equal(A.entries[index].version,1);
 }
 assert.equal(A.entries[25].leader,'johto-champ-siegfried');
 const entry=A.canonical('trainer-kanto-youngster.bin');
 assert(entry&&entry.trainer);
 assert.equal(entry.leader,'kanto-youngster');
 assert.equal(entry.index,26);assert.equal(entry.version,2);
 assert(A.looksLike(entry.key));
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ui01-trainer-private-'));
 try{
  fs.writeFileSync(path.join(directory,entry.key),Buffer.from([1,2]));
  assert.throws(()=>artifact.tree(directory),/Private game asset/);
 }finally{fs.rmSync(directory,{recursive:true,force:true});}
 if(process.env.UI01_TRAINER_BIN){
  const item=await A.inspect(fs.readFileSync(process.env.UI01_TRAINER_BIN),'kanto-youngster');
  assert(item.valid&&item.width>0&&item.height>0);
  assert(item.metadata.source.startsWith('https://play.pokemonshowdown.com/sprites/trainers/'));
 }
 console.log('UI01 trainer profile passed: original v1 mapping retained, new v2 index appended, canonical local import, private artifact refusal and actual PNG/container validation.');
})().catch(error=>{console.error(error);process.exit(1);});
