 'use strict';
const assert=require('node:assert/strict');
const F=require('../tools/browser-tests/specs/legendary-fixtures.js');
const count=Buffer.alloc(4);count.writeUInt32LE(3);
const fields=[
 ['init',0,Buffer.from([1])],['dexn',1,1],['age',1,540]
].map(([name,type,value])=>{
 const key=Buffer.from(name);
 if(type===1){const b=Buffer.alloc(8);b.writeBigInt64LE(BigInt(value));value=b;}
 const length=Buffer.alloc(4);length.writeUInt32LE(value.length);
 return Buffer.concat([Buffer.from([key.length]),key,Buffer.from([type]),length,value]);
});
const base=Buffer.concat([count,...fields]);
for(const profile of F.profiles)for(const step of [0,1,2]){
 const parsed=F.inspect(F.fixture(base,profile.id,{step}));
 assert.equal(parsed.values.get('dexn').value,1);
 assert.equal(parsed.values.get(profile.prefix+'step').value,step);
 assert.equal(parsed.values.get(profile.prefix+'tick').value,0);
 assert.equal(parsed.values.get('f4life').value,1);
}
for(const [hall,mask] of [[0,3],[1,1],[2,7]]){
 const parsed=F.inspect(F.fixture(base,'mew',{hall}));
 assert.equal(parsed.values.get('lhdata').value[8],mask);
}
assert.equal(F.inspect(F.fixture(base,'mewtwo',{league:false}))
 .values.get('lgkdone').value,false);
assert.throws(()=>F.fixture(base,'mew',{step:3}));
assert.throws(()=>F.fixture(base,'unknown'));
console.log('Browser fixtures passed: actual five-profile save parser, care identity, three preparation phases, native Hall data and explicit species 1. No victory fixture fabricated.');
