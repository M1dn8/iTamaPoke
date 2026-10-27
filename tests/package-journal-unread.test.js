'use strict';
const assert=require('node:assert/strict');
const T=require('../browser_ver/web/storage-tools.js');
function save(fields){
 const entries=[
  ['init',0,true],['dexn',1,1],['age',1,540],...fields
 ];
 const count=Buffer.alloc(4);count.writeUInt32LE(entries.length);
 return Buffer.concat([count,...entries.map(([key,type,value])=>{
  const k=Buffer.from(key),data=Buffer.alloc(type===0?1:8);
  if(type===0)data[0]=value?1:0;
  else data.writeBigInt64LE(BigInt(value));
  const size=Buffer.alloc(4);size.writeUInt32LE(data.length);
  return Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),size,data]);
 })]);
}
const valid=[
 ['jrcount',1,200],['jruver',1,1],['jrutot',1,237],['jruseen',1,235]
];
assert.doesNotThrow(()=>T.parseLegacy(save([])));
assert.doesNotThrow(()=>T.parseLegacy(save(valid)));
for(const key of ['jruver','jrutot','jruseen'])
 assert.throws(()=>T.parseLegacy(save(valid.filter(field=>field[0]!==key))));
for(const [key,type,value] of [
 ['jruver',1,2],['jrutot',0,true],['jruseen',0,true],
 ['jrutot',1,199],['jruseen',1,238],['jruseen',1,-1],
 ['jrutot',1,0x7fffffff],['jrcount',1,201]
])assert.throws(()=>T.parseLegacy(save(valid.map(
 field=>field[0]===key?[key,type,value]:field
))));
console.log('Journal unread save parser passed: legacy absence, bounded valid metadata and partial/type/future/range refusal.');
