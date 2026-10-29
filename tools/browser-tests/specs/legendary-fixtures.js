 'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const M=require('../../../browser_ver/web/collection-model.js');
const A=require('../../../browser_ver/web/collection-admission-model.js');
const models={
 zapdos:require('../../../browser_ver/web/zapdos-story-model.js'),
 articuno:require('../../../browser_ver/web/articuno-story-model.js'),
 moltres:require('../../../browser_ver/web/moltres-story-model.js'),
 mewtwo:require('../../../browser_ver/web/mewtwo-story-model.js'),
 mew:require('../../../browser_ver/web/mew-story-model.js')
};
const halls=require('../fixtures/p06-mew-hall.json');
const scope={
 TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,
 TPCollectionModel:M,TPAdmissionModel:A,
 TPZapdosModel:models.zapdos,TPArktosModel:models.articuno,
 TPLavadosModel:models.moltres,TPMewtuModel:models.mewtwo,
 TPMewModel:models.mew
};
vm.createContext(scope);
vm.runInContext(fs.readFileSync(
 path.resolve(__dirname,'../../../browser_ver/web/storage-tools.js'),'utf8'
),scope);
const profiles=Object.freeze([
 Object.freeze({id:'moltres',dex:146,prefix:'mlt',service:'TPLavados',ui:'TPLavadosUI',text:'TPLavadosText',place:'Siegesstraße'}),
 Object.freeze({id:'mewtwo',dex:150,prefix:'mtw',service:'TPMewtu',ui:'TPMewtuUI',text:'TPMewtuText',place:'Azuria-Höhle'}),
 Object.freeze({id:'mew',dex:151,prefix:'mew',service:'TPMew',ui:'TPMewUI',text:'TPMewText',place:'Nuggetbrücke'})
]);
function unpack(buffer){
 const fields=new Map();let at=4;
 for(let i=0;i<buffer.readUInt32LE(0);i++){
  const length=buffer[at++],key=buffer.toString('utf8',at,at+length);
  at+=length;
  const type=buffer[at++],size=buffer.readUInt32LE(at);at+=4;
  fields.set(key,[type,Buffer.from(buffer.subarray(at,at+size))]);at+=size;
 }
 if(at!==buffer.length)throw Error('Invalid base fixture');
 return fields;
}
function pack(fields){
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);
 return Buffer.concat([count,...Array.from(fields,([key,[type,value]])=>{
  const name=Buffer.from(key),size=Buffer.alloc(4);
  size.writeUInt32LE(value.length);
  return Buffer.concat([Buffer.from([name.length]),name,Buffer.from([type]),size,value]);
 })]);
}
function fixture(base,id,{step=0,kanto=255,league=true,hall=2}={}){
 const profile=profiles.find(p=>p.id===id);
 if(!profile||![0,1,2].includes(step)||!halls[hall])
  throw Error('Unsupported legendary fixture');
 const fields=unpack(base);
 const number=(key,value)=>{
  const bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));
  fields.set(key,[1,bytes]);
 };
 const bool=(key,value)=>fields.set(key,[0,Buffer.from([Number(value)])]);
 for(const [key,value] of Object.entries({
  dexn:1,eggT2:1,age:540,lang:3,full:100,joy:100,ene:100,hyg:100,bond:80,
  gatk:100,gdef:100,gspe:100,tatk:0,tdef:0,tspe:0,
  f4lver:1,f4life:1,agver:1,agmask:kanto,
  lgver:1,lgkdate:league?1700000000:0,jagver:1,jagmask:0,
  jlgver:1,jlgdate:0
 }))number(key,value);
 bool('init',true);bool('shy',false);bool('stpk',false);
 bool('lgkdone',league);bool('jlgdone',false);
 fields.delete('lgkrun');fields.delete('jlgrun');
 fields.set('nick',[2,Buffer.from('Browser-Test')]);
 const collection=M.attachCurrent(M.create(),{
  dex:1,level:10,nickname:'Browser-Test',shiny:false,origin:'existing',
  data:{lifeToken:1,genes:{atk:100,def:100,spe:100},
   training:{atk:0,def:0,spe:0},stats:{atk:50,def:50,spe:50}}
 });
 fields.set('f4col',[3,Buffer.from(M.encode(collection))]);
 const row=halls[hall];
 number('lhver',row.version);
 fields.set('lhdata',[3,Buffer.from(row.hex,'hex')]);
 number(profile.prefix+'ver',1);
 number(profile.prefix+'step',step);
 number(profile.prefix+'tick',0);
 number(profile.prefix+'nver',1);
 number(profile.prefix+'nread',1);
 const raw=pack(fields);
 scope.TPStoreTools.parseLegacy(new Uint8Array(raw));
 models[id].validateProfile(
  models[id].fromNative(1,step,0),A.create(),collection
 );
 return raw;
}
module.exports={
 profiles,fixture,
 inspect:buffer=>scope.TPStoreTools.parseLegacy(new Uint8Array(buffer))
};
