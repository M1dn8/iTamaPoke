// UI01 closeout: care fighter is the real first team member.
'use strict';
const fs=require('node:fs'),path=require('node:path');
const T=require('../../../browser_ver/web/storage-tools.js');
const header=fs.readFileSync(path.join(__dirname,'../../../upstream-expanded/pet.h'),'utf8');
const minutes=header.match(/^#define\s+MINUTES_PER_LEVEL\s+(\d+)/m);
if(!minutes)throw Error('MINUTES_PER_LEVEL missing.');
const perLevel=Number(minutes[1]);
const lossDefTraining=40;

function encode(values){
 const entries=[];
 for(const [key,{type,value}]of values){
  const name=Buffer.from(key);
  let data;
  if(type===0)data=Buffer.from([value?1:0]);
  else if(type===1){data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(value));}
  else data=Buffer.from(value);
  const length=Buffer.alloc(4);length.writeUInt32LE(data.length);
  entries.push(Buffer.concat([Buffer.from([name.length]),name,Buffer.from([type]),length,data]));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(values.size);
 const bytes=Buffer.concat([count,...entries]);
 T.parseLegacy(bytes);return bytes;
}
function withCare(base,{dex,level,nickname,weak=false,loss=false}){
 const values=new Map(T.parseLegacy(base).values);
 for(const key of ['f4col','f4lver','f4life'])values.delete(key);
 const gene=weak?1:255,training=weak?0:255;
 const numbers={
  dexn:dex,eggT2:dex,age:(level-1)*perLevel,blvl:0,
  full:100,joy:100,ene:100,hyg:100,
  gatk:gene,gdef:loss?1:gene,gspe:gene,
  tatk:training,tdef:loss?lossDefTraining:training,tspe:training,
  psver:1,pskind:0,cerp:0,seen:Math.floor(Date.now()/1000)
 };
 for(const [key,value]of Object.entries(numbers))values.set(key,{type:1,value});
 values.set('nick',{type:2,value:nickname});
 values.set('shy',{type:0,value:false});
 values.set('sleep',{type:0,value:false});
 values.set('psvec',{type:3,value:Buffer.alloc(4)});
 return encode(values);
}
module.exports={withCare};
