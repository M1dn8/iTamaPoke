'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const A=require('../browser_ver/web/trainer-art.js');

(async()=>{
 const loader=fs.readFileSync('browser_ver/web/trainer-art.js','utf8');
 const packer=fs.readFileSync('tools/pack-trainer-bin.py','utf8');
 const rights=fs.readFileSync('browser_ver/web/rights.js','utf8');
 const manager=fs.readFileSync('browser_ver/web/management.js','utf8');

 assert(loader.includes('Local TPTR-v1/v2 portraits.'));
 assert(packer.includes('Local PNG -> TPTR v1/v2.'));
 assert(!loader.includes('Kein TPTR-v1-Leiterformat.'));
 assert(manager.includes('note("Trainerdateien: "'));
 assert(!manager.includes('note("Leiterdateien: "'));

 assert(rights.includes("node('p','Quellen & Nutzungsrechte')"));
 assert(!rights.includes('Stand 23.10.2026'));
 assert(rights.includes('Lokal dokumentierte Trainer-BINs'));
 assert(rights.includes('Arenaleiter, Top Vier und Champs.'));
 assert(rights.includes('Sie sind nicht verifiziert und belegen keine Nutzungsfreigabe.'));
 assert(rights.includes('Keine gueltigen Trainer-BIN-Angaben gefunden.'));
 assert(rights.includes('Credits ersetzen keine fehlenden Rechte.'));
 assert(rights.includes('Externe Quellenlinks werden nicht automatisch aufgerufen.'));
 assert(rights.includes('Nutzerdateien werden nicht hochgeladen.'));

 const message='Kein unterstuetztes TPTR-Trainerformat (v1/v2).';

 // Invalid signature must retain a clear, version-neutral format error.
 await assert.rejects(
  ()=>A.inspect(new Uint8Array(48)),
  error=>error.message===message
 );

 // Unsupported versions fail before hash or image decoding.
 for(const version of [0,3]){
  const bytes=new Uint8Array(48);
  bytes.set([84,80,84,82]);
  new DataView(bytes.buffer).setUint16(4,version,true);
  await assert.rejects(
   ()=>A.inspect(bytes),
   error=>error.message===message
  );
 }

 // Supported versions reach the existing header validation.
 for(const version of [1,2]){
  const bytes=new Uint8Array(48);
  bytes.set([84,80,84,82]);
  const view=new DataView(bytes.buffer);
  view.setUint16(4,version,true);
  view.setUint16(6,version===1?0:8,true);
  await assert.rejects(()=>A.inspect(bytes),/Kopf/);
 }

 console.log(
  'Trainer labels passed: v1/v2 descriptions, trainer counter, '+
  'source scope, retained rights warnings and actual format errors. '+
  'No browser layout claim.'
 );
})().catch(error=>{console.error(error);process.exit(1);});
