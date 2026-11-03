const H=require('./helpers');
const T=require('../../../browser_ver/web/storage-tools.js');

const definitions=Object.freeze([
 {name:'01-glurak-stein-freischalten',dex:6,mask:0,quest:true},
 {name:'02-glurak-bereit',dex:6,mask:1},
 {name:'03-metagross-bereit',dex:376,mask:2},
 {name:'04-flunkifer-bereit',dex:303,mask:4},
 {name:'05-glurak-schillernd',dex:6,mask:1,shiny:true},
 {name:'06-metagross-schillernd',dex:376,mask:2,shiny:true},
 {name:'07-flunkifer-schillernd',dex:303,mask:4,shiny:true},
 {name:'08-glurak-sperrzeit',dex:6,mask:1,cooldown:true}
]);

function encode(values){
 const chunks=[];
 for(const [key,{type,value}]of values){
  const name=Buffer.from(key);
  let bytes;
  if(type===0)bytes=Buffer.from([Number(Boolean(value))]);
  else if(type===1){bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));}
  else bytes=Buffer.from(value);
  const length=Buffer.alloc(4);length.writeUInt32LE(bytes.length);
  chunks.push(Buffer.concat([Buffer.from([name.length]),name,
   Buffer.from([type]),length,bytes]));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(chunks.length);
 return Buffer.concat([count,...chunks]);
}

function createCases(now=Math.floor(Date.now()/1000)){
 return definitions.map(definition=>{
  const values=T.parseLegacy(H.fixture(0)).values;
  const numbers={
   dexn:definition.dex,age:2940,bond:80,full:100,joy:100,ene:100,hyg:100,
   mgver:3,mgmask:definition.mask,mgtrain:3,mgform:0,mgstart:0,mgend:0,
   mgcool:definition.cooldown?now+3600:0,mgseen:now,seen:now,jrlvl:7
  };
  for(const [key,value]of Object.entries(numbers))values.set(key,{type:1,value});
  values.set('mgstone',{type:0,value:Boolean(definition.mask&1)});
  values.set('shy',{type:0,value:Boolean(definition.shiny)});
  for(const key of ['dexreg',...(definition.shiny?['dexsh']:[])]){
   const bytes=Uint8Array.from(values.get(key).value);
   bytes[(definition.dex-1)>>3]|=1<<((definition.dex-1)&7);
   values.set(key,{type:3,value:bytes});
  }
  return {...definition,raw:encode(values),created:now};
 });
}

/* UI01 Mega: fresh isolated case */
async function createFreshCase(definition){
 const item=createCases().find(item=>item.name===definition.name);
 if(!item||item.dex!==definition.dex)throw Error("Mega-Testfalldefinition stimmt nicht.");
 const sealed=await T.seal(item.raw,{});
 const decoded=await T.decode(sealed);
 if(!Buffer.from(decoded.raw).equals(Buffer.from(item.raw)))
  throw Error("Mega-Funktionsfixture stimmt nach seal/decode nicht überein.");
 return {...decoded,raw:Buffer.from(decoded.raw)};
}
module.exports={definitions,createCases,createFreshCase};
