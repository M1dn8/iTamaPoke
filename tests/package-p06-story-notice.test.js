'use strict';
const assert=require('node:assert/strict');
const T=require('../browser_ver/web/storage-tools.js');

function save(extra=[]){
 const entries=[
  ['init',0,true],['dexn',1,1],['age',1,540],['eggT2',1,1],
  ...extra
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
assert.doesNotThrow(()=>T.parseLegacy(save()));
for(const read of [0,1])
 assert.doesNotThrow(()=>T.parseLegacy(save([
  ['stynver',1,1],['stynread',1,read]
 ])));
for(const fields of [
 [['stynver',1,1]],
 [['stynread',1,1]],
 [['stynver',1,2],['stynread',1,1]],
 [['stynver',0,true],['stynread',1,1]],
 [['stynver',1,1],['stynread',0,true]],
 [['stynver',1,1],['stynread',1,-1]],
 [['stynver',1,1],['stynread',1,2]]
])assert.throws(()=>T.parseLegacy(save(fields)));
console.log('Story notice save validation passed: absent legacy metadata, valid flags, partial/type/future/range refusal.');
