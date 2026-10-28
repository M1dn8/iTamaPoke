// Strict legacy save parser and optional versioned export envelope.
var tpSaveReplacing = false;
(function(root){
"use strict";
const enc=new TextEncoder(),dec=new TextDecoder("utf-8",{fatal:true});
const MAX=2*1024*1024;
function bytes(value){return value instanceof Uint8Array?value:new Uint8Array(value);}
function parseLegacy(input){
 const b=bytes(input),view=new DataView(b.buffer,b.byteOffset,b.byteLength);let p=0;
 const requireBytes=n=>{if(n<0||p+n>b.length)throw Error("Spielstand abgeschnitten.");};
 requireBytes(4);const count=view.getUint32(p,true);p+=4;
 if(b.length>MAX||count<1||count>512)throw Error("Ungueltige Spielstandgroesse oder Feldzahl.");
 const values=new Map();
 for(let i=0;i<count;i++){
  requireBytes(1);const k=b[p++];if(!k||k>128)throw Error("Ungueltiger Feldname.");
  requireBytes(k+5);const key=dec.decode(b.slice(p,p+k));p+=k;
  if(values.has(key))throw Error("Doppeltes Spielstandfeld.");
  const type=b[p++],len=view.getUint32(p,true);p+=4;requireBytes(len);
  let value;
  if(type===0){if(len!==1||b[p]>1)throw Error("Ungueltiger Wahrheitswert.");value=!!b[p];}
  else if(type===1){if(len!==8)throw Error("Ungueltiger Zahlenwert.");value=view.getInt32(p+4,true)*4294967296+view.getUint32(p,true);if(!Number.isSafeInteger(value))throw Error("Zahl ausserhalb des sicheren Bereichs.");}
  else if(type===2){if(len>4096)throw Error("Textfeld zu gross.");value=dec.decode(b.slice(p,p+len));}
  else if(type===3){if(len>262144)throw Error("Datenfeld zu gross.");value=b.slice(p,p+len);}
  else throw Error("Unbekannter Datentyp.");
  values.set(key,{type,value});p+=len;
 }
 if(p!==b.length)throw Error("Unerwartete Daten hinter dem Spielstand.");
 const get=(k,t,f)=>{const v=values.get(k);if(!v)return f;if(v.type!==t)throw Error("Falscher Typ fuer "+k);return v.value;};
 if(get("init",0,false)!==true)throw Error("Kein initialisierter iTamaPoke-Spielstand.");
 if(!values.has("dexn")||!values.has("age"))throw Error("Pflichtfelder fehlen.");
 const dex=get("dexn",1,-1),age=get("age",1,0),target=get("eggT2",1,1);
 if(["jruver","jrutot","jruseen"].some(k=>values.has(k))){
  if(!["jruver","jrutot","jruseen"].every(k=>values.has(k)))
   throw Error("Tagebuch-Lesestand unvollstaendig.");
  const version=get("jruver",1,-1),total=get("jrutot",1,-1);
  const seen=get("jruseen",1,-1),count=get("jrcount",1,0);
  if(version!==1||!Number.isInteger(total)||total<0||total>0x7ffffffe||
     !Number.isInteger(seen)||seen<0||seen>total||
     !Number.isInteger(count)||count<0||count>200||total<count)
   throw Error("Tagebuch-Lesestand ungueltig oder nicht unterstuetzt.");
 }
 const battleLevelBonus=get("blvl",1,0);
 if(!Number.isInteger(battleLevelBonus)||battleLevelBonus<0||battleLevelBonus>99)throw Error("Ungueltiger Kampf-Levelbonus.");
 if(dex===-1&&battleLevelBonus!==0)throw Error("Ein Ei darf keinen Kampf-Levelbonus besitzen.");
 if(!Number.isInteger(dex)||(dex!==-1&&(dex<1||dex>1025))||age<0||age>0xffffffff||target<1||target>1025)throw Error("Art, Ei oder Alter ausserhalb des unterstuetzten Bereichs.");
 for(const k of ["full","joy","ene","hyg","bond"]){const n=get(k,1,0);if(n<0||n>100)throw Error("Ungueltiger Wert: "+k);}
 for(const k of ["dexreg","dexcgt","dexsh"]){const v=get(k,3,new Uint8Array());if(v.length>129)throw Error("Sammlung stammt aus einem nicht unterstuetzten Datenumfang.");}
 let collectionModel=null,admissionModel=null;
 if(values.has("f4col")){
  const collection=values.get("f4col");
  if(collection.type!==3)throw Error("Falscher Typ fuer individuelle Sammlung.");
  if(!root.TPCollectionModel)throw Error("Sammlungspruefung nicht geladen.");
  try{collectionModel=root.TPCollectionModel.decode(dec.decode(collection.value));}
  catch(e){throw Error("Individuelle Sammlung ungueltig oder nicht unterstuetzt: "+(e.code||e.message));}
 }
 if(values.has("f4lver")||values.has("f4life")){
  const ver=get("f4lver",1,0),life=get("f4life",1,0);
  if(ver!==1||!Number.isInteger(life)||life<1||life>0x7fffffff||!collectionModel)throw Error("Pflege-Identitaetsdaten ungueltig oder nicht unterstuetzt.");
  const ceremony=get("cerp",1,0);
  if(collectionModel.active!==null){const m=collectionModel.mons.find(m=>m.id===collectionModel.active);
   if(dex<1||ceremony||!m||m.data.lifeToken!==life||m.dex!==dex||m.shiny!==get("shy",0,false))throw Error("Pflege-Pokemon und Sammlungsidentitaet passen nicht zusammen.");
   const genes=m.data.genes;if(!genes||genes.atk!==get("gatk",1,100)||genes.def!==get("gdef",1,100)||genes.spe!==get("gspe",1,100))throw Error("Individuelle Pflege-Gene passen nicht zusammen.");
  }else if(dex>0&&!ceremony)throw Error("Aktuelles Pflege-Pokemon fehlt in der individuellen Sammlung.");
 }else if(collectionModel?.active!==null&&collectionModel?.active!==undefined){const m=collectionModel.mons.find(m=>m.id===collectionModel.active);if(m&&m.data.lifeToken!==undefined)throw Error("Pflege-Identitaetsmetadaten fehlen.");}
 // P06: a bounded admission is separate from the ordinary collection.
 if(["f4aver","f4admit","f4apend","f4acrc"].some(k=>values.has(k))){
  if(!collectionModel||!root.TPAdmissionModel)
   throw Error("Aufnahmepruefung oder individuelle Sammlung fehlt.");
  const version=get("f4aver",1,0);
  const payload=get("f4admit",3,new Uint8Array());
  const pending=get("f4apend",0,null),stored=get("f4acrc",1,-1);
  if(version!==1||!payload.length||payload.length>65536||
     typeof pending!=="boolean"||
     !Number.isInteger(stored)||stored<0||stored>0xffffffff)
   throw Error("Aufnahmedaten fehlen oder sind nicht unterstuetzt.");
  let checksum=2166136261;
  for(const byte of payload)checksum=Math.imul(checksum^byte,16777619);
  checksum=Math.imul(checksum^(pending?1:0),16777619)>>>0;
  if(checksum!==stored)throw Error("Aufnahmedaten-Pruefsumme stimmt nicht.");
  let admission;
  try{admission=root.TPAdmissionModel.decode(dec.decode(payload));}
  catch(_){throw Error("Aufnahmestand ungueltig oder nicht unterstuetzt.");}
  admissionModel=admission;
  if((admission.pending!==null)!==pending)
   throw Error("Aufnahme-Wartestatus widerspruechlich.");
  if(admission.pending&&collectionModel.mons.some(m=>
   m.data.admission?.ticket===admission.pending.ticket))
   throw Error("Wartendes Pokemon ist bereits aufgenommen.");
 }
 // P06: validate both profiles against shared admission/collection.
 const storyTickets=new Set();
 for(const config of [
  {
   name:'Zapdos',keys:['zpdver','zpdstep','zpdtick'],
   notice:['stynver','stynread'],
   source:'story:kanto:zapdos',model:root.TPZapdosModel
  },
  {
   name:'Arktos',keys:['arcver','arcstep','arctick'],
   notice:['arcnver','arcnread'],
   source:'story:kanto:articuno',model:root.TPArktosModel
  }
 ]){
  const [noticeVersion,noticeRead]=config.notice;
  if(config.notice.some(k=>values.has(k))){
   if(!config.notice.every(k=>values.has(k))||
      get(noticeVersion,1,-1)!==1||
      ![0,1].includes(get(noticeRead,1,-1)))
    throw Error(config.name+
     '-Hinweisstatus ungueltig oder nicht unterstuetzt.');
  }
  const hasStory=config.keys.some(k=>values.has(k));
  const hasIndividual=collectionModel?.mons.some(
   m=>m.data.admission?.source===config.source
  );
  if(!hasStory&&admissionModel?.pending?.source!==config.source&&
     !hasIndividual)continue;
  if(!collectionModel||!root.TPAdmissionModel||!config.model)
   throw Error(config.name+
    '-Storypruefung oder individuelle Sammlung fehlt.');
  if(hasStory&&!config.keys.every(k=>values.has(k)))
   throw Error(config.name+'-Storydaten sind unvollstaendig.');
  let story;
  try{
   story=hasStory?config.model.fromNative(
    ...config.keys.map(k=>get(k,1,-1))
   ):config.model.create();
   config.model.validateProfile(
    story,admissionModel||root.TPAdmissionModel.create(),collectionModel
   );
  }catch(_){
   throw Error(config.name+
    '-Story, Aufnahme und Sammlung sind widerspruechlich '+
    'oder nicht unterstuetzt.');
  }
  if(story.step===3){
   if(storyTickets.has(story.ticket))
    throw Error('Aufnahme-Ticket wird von mehreren Geschichten verwendet.');
   storyTickets.add(story.ticket);
  }
 }
 // Only the new LT format is interpreted here. Old single-player blobs
 // retain their existing native validation path without JS migration.
 for(const [region,key,versionKey] of [
  [0,"lgkrun","lgver"],[1,"jlgrun","jlgver"]
 ]){
  const field=values.get(key);
  if(!field||field.type!==3||
     field.value[0]!==76||field.value[1]!==84)continue;
  if(!root.TPLeagueTeamState)
   throw Error("Liga-Teampruefung nicht geladen.");
  if(get(versionKey,1,0)!==1||!collectionModel||
     get("f4lver",1,0)!==1)
   throw Error("Liga-Team-Metadaten fehlen oder sind ungueltig.");
  try{root.TPLeagueTeamState.decode(field.value,region);}
  catch(_){throw Error("Liga-Teamdaten ungueltig oder nicht unterstuetzt.");}
 }
 function bitCount(k){let n=0;const v=get(k,3,new Uint8Array());for(let d=0;d<1025;d++)if((v[d>>3]||0)&(1<<(d&7)))n++;return n;}
 return {raw:b.slice(),values,summary:{dex,level:Math.min(100,1+Math.floor(age/60)+battleLevelBonus),age,bond:get("bond",1,0),nick:get("nick",2,""),raised:bitCount("dexreg"),caught:bitCount("dexcgt"),shiny:bitCount("dexsh")}};
}
async function digest(input){
 if(!root.crypto||!root.crypto.subtle)throw Error("Sichere Pruefsumme nicht verfuegbar. HTTPS oder localhost verwenden.");
 const result=await root.crypto.subtle.digest("SHA-256",bytes(input));return Array.from(new Uint8Array(result),v=>v.toString(16).padStart(2,"0")).join("");
}
async function seal(input,metadata){
 const parsed=parseLegacy(input),payload=parsed.raw;
 const meta=Object.assign({},metadata,{schema:1,dexCount:1025,payloadLength:payload.length,sha256:await digest(payload)});
 const json=enc.encode(JSON.stringify(meta));if(json.length>16384)throw Error("Metadaten zu gross.");
 const out=new Uint8Array(12+json.length+payload.length);out.set([84,80,83,86]);const v=new DataView(out.buffer);v.setUint32(4,1,true);v.setUint32(8,json.length,true);out.set(json,12);out.set(payload,12+json.length);return out;
}
async function decode(input){
 const b=bytes(input);if(b.length>MAX+16396)throw Error("Datei zu gross.");
 if(b.length>=4&&b[0]===84&&b[1]===80&&b[2]===83&&b[3]===86){
  if(b.length<12)throw Error("Sicherungskopf abgeschnitten.");const v=new DataView(b.buffer,b.byteOffset,b.byteLength);
  if(v.getUint32(4,true)!==1)throw Error("Nicht unterstuetzte Sicherungsversion.");const len=v.getUint32(8,true);
  if(len<2||len>16384||12+len>b.length)throw Error("Ungueltiger Sicherungskopf.");
  const meta=JSON.parse(dec.decode(b.slice(12,12+len))),raw=b.slice(12+len);
  if(meta.schema!==1||meta.dexCount>1025||meta.payloadLength!==raw.length)throw Error("Sicherungsschema oder Umfang nicht unterstuetzt.");
  if(await digest(raw)!==meta.sha256)throw Error("Pruefsumme stimmt nicht: Sicherung beschaedigt.");
  return Object.assign(parseLegacy(raw),{metadata:meta,format:"Version 1"});
 }
 return Object.assign(parseLegacy(b),{metadata:null,format:"Klassischer Spielstand"});
}
const megaForms=Object.freeze({
 1:Object.freeze({id:1,dex:6,baseName:"Glurak",name:"Mega-Glurak X",normal:"p006-mega-x.bin",shiny:"ps006-mega-x.bin"}),
 2:Object.freeze({id:2,dex:376,baseName:"Metagross",name:"Mega-Metagross",normal:"p376-mega.bin",shiny:"ps376-mega.bin"}),
 3:Object.freeze({id:3,dex:303,baseName:"Flunkifer",name:"Mega-Flunkifer",normal:"p303-mega.bin",shiny:"ps303-mega.bin"})
});
function megaFormInfo(id){return Object.prototype.hasOwnProperty.call(megaForms,id)?megaForms[id]:null;}
function canonicalSprite(name){
 const trainer=root.TPTrainerArt?.canonical(name);if(trainer)return trainer;
 if(/^thumbs\.bin$/i.test(name))return {key:"thumbs.bin",atlas:true};
 const extra=/^(p|ps)(\d{1,4})-mega(?:-(x))?\.bin$/i.exec(name);
 if(extra){const dex=Number(extra[2]),id=dex===6&&extra[3]?1:dex===376&&!extra[3]?2:dex===303&&!extra[3]?3:0;const f=megaFormInfo(id);if(!f)return null;const shiny=extra[1].toLowerCase()==="ps";return {key:shiny?f.shiny:f.normal,dex:f.dex,shiny,form:id===1?"mega-x":"mega",formId:id};}
 const m=/^(ps?)(\d{1,4})\.bin$/i.exec(name);if(!m)return null;const dex=Number(m[2]);if(dex<1||dex>1025)return null;
 return {key:m[1].toLowerCase()+String(dex).padStart(3,"0")+".bin",dex,shiny:m[1].toLowerCase()==="ps"};
}
function inspectSprite(input){
 const b=bytes(input);if(b.length<7||String.fromCharCode(...b.slice(0,4))!=="TPK2")throw Error("Kein TPK2-Sprite.");
 const acts=b[4],pal=b[5]|b[6]<<8;if(!acts||acts>12||!pal||pal>256)throw Error("Ungueltiger Sprite-Kopf.");
 let p=7+pal*2;const ids=new Set();let single=true;
 for(let i=0;i<acts;i++){
  if(p+4>b.length)throw Error("Animationskopf abgeschnitten.");const id=b[p++],w=b[p++],h=b[p++],nf=b[p++];
  if(id>11||ids.has(id)||!w||!h||!nf||nf>24)throw Error("Ungueltige Animation.");ids.add(id);single=single&&nf===1;
  if(p+nf*2+w*h*nf>b.length)throw Error("Animationsdaten abgeschnitten.");
  for(let f=0;f<nf;f++){if((b[p]|b[p+1]<<8)===0)throw Error("Leere Frame-Dauer.");p+=2;}
  const end=p+w*h*nf;while(p<end){const x=b[p++];if(x!==255&&x>=pal)throw Error("Palette und Pixel passen nicht zusammen.");}
 }
 if(!ids.has(0)||p!==b.length)throw Error("Idle fehlt oder Dateilaenge passt nicht.");
 return {valid:true,kind:single?"single-frame":"animated",actions:acts,size:b.length};
}
function inspectThumbs(input){
 const b=bytes(input);if(b.length<6||String.fromCharCode(...b.slice(0,4))!=="TPTH")throw Error("Kein TPTH-Atlas.");
 const v=new DataView(b.buffer,b.byteOffset,b.byteLength),n=v.getUint16(4,true);if(!n||n>1025||6+n*4>b.length)throw Error("Ungueltiger Atlas-Kopf.");
 for(let i=0;i<n;i++){const off=v.getUint32(6+i*4,true);if(!off)continue;if(off<6+n*4||off+3>b.length)throw Error("Ungueltiger Atlas-Offset.");const w=b[off],h=b[off+1],pal=b[off+2];if(!w||!h||!pal||off+3+pal*2+w*h>b.length)throw Error("Atlas abgeschnitten.");}
 return {valid:true,kind:"atlas",size:b.length,count:n};
}
const api={parseLegacy,digest,seal,decode,canonicalSprite,megaFormInfo,inspectSprite,inspectThumbs};root.TPStoreTools=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);
