
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
if(!globalThis.crypto)globalThis.crypto=require('node:crypto').webcrypto;
const A=require('../browser_ver/web/trainer-art.js');
const baseline=[{"leader": "rocko", "index": 0, "version": 1, "key": "trainer-kanto-rocko.bin"}, {"leader": "misty", "index": 1, "version": 1, "key": "trainer-kanto-misty.bin"}, {"leader": "major-bob", "index": 2, "version": 1, "key": "trainer-kanto-major-bob.bin"}, {"leader": "erika", "index": 3, "version": 1, "key": "trainer-kanto-erika.bin"}, {"leader": "koga", "index": 4, "version": 1, "key": "trainer-kanto-koga.bin"}, {"leader": "sabrina", "index": 5, "version": 1, "key": "trainer-kanto-sabrina.bin"}, {"leader": "pyro", "index": 6, "version": 1, "key": "trainer-kanto-pyro.bin"}, {"leader": "giovanni", "index": 7, "version": 1, "key": "trainer-kanto-giovanni.bin"}, {"leader": "johto-arena-falk", "index": 8, "version": 2, "key": "trainer-johto-arena-falk.bin"}, {"leader": "johto-arena-kai", "index": 9, "version": 2, "key": "trainer-johto-arena-kai.bin"}, {"leader": "johto-arena-bianka", "index": 10, "version": 2, "key": "trainer-johto-arena-bianka.bin"}, {"leader": "johto-arena-jens", "index": 11, "version": 2, "key": "trainer-johto-arena-jens.bin"}, {"leader": "johto-arena-hartwig", "index": 12, "version": 2, "key": "trainer-johto-arena-hartwig.bin"}, {"leader": "johto-arena-jasmin", "index": 13, "version": 2, "key": "trainer-johto-arena-jasmin.bin"}, {"leader": "johto-arena-norbert", "index": 14, "version": 2, "key": "trainer-johto-arena-norbert.bin"}, {"leader": "johto-arena-sandra", "index": 15, "version": 2, "key": "trainer-johto-arena-sandra.bin"}, {"leader": "kanto-elite-lorelei", "index": 16, "version": 2, "key": "trainer-kanto-elite-lorelei.bin"}, {"leader": "kanto-elite-bruno", "index": 17, "version": 2, "key": "trainer-kanto-elite-bruno.bin"}, {"leader": "kanto-elite-agathe", "index": 18, "version": 2, "key": "trainer-kanto-elite-agathe.bin"}, {"leader": "kanto-elite-siegfried", "index": 19, "version": 2, "key": "trainer-kanto-elite-siegfried.bin"}, {"leader": "kanto-champ-blau", "index": 20, "version": 2, "key": "trainer-kanto-champ-blau.bin"}, {"leader": "johto-elite-willi", "index": 21, "version": 2, "key": "trainer-johto-elite-willi.bin"}, {"leader": "johto-elite-koga", "index": 22, "version": 2, "key": "trainer-johto-elite-koga.bin"}, {"leader": "johto-elite-bruno", "index": 23, "version": 2, "key": "trainer-johto-elite-bruno.bin"}, {"leader": "johto-elite-melanie", "index": 24, "version": 2, "key": "trainer-johto-elite-melanie.bin"}, {"leader": "johto-champ-siegfried", "index": 25, "version": 2, "key": "trainer-johto-champ-siegfried.bin"}, {"leader": "kanto-youngster", "index": 26, "version": 2, "key": "trainer-kanto-youngster.bin"}],ids=["kanto-elite-lorelei-portrait-b", "kanto-elite-bruno-portrait-b", "kanto-elite-agathe-portrait-b", "kanto-elite-siegfried-portrait-b", "kanto-champ-blau-portrait-b"];
(async()=>{
 assert.equal(A.entries.length,50);
 assert.deepEqual(A.entries.slice(0,27).map(({leader,index,version,key})=>
  ({leader,index,version,key})),baseline);
 for(let i=0;i<ids.length;i++){
  const key='trainer-'+ids[i]+'.bin',entry=A.canonical(key);
  assert(entry&&entry.trainer);
  assert.equal(entry.index,27+i);assert.equal(entry.version,2);
  assert(A.looksLike(key));
  if(process.env.UI01_B_PORTRAITS){
   const raw=fs.readFileSync(path.join(process.env.UI01_B_PORTRAITS,key));
   const checked=await A.inspect(raw,ids[i]);
   assert.equal(checked.width,128);assert.equal(checked.height,128);
   assert(checked.metadata.author.includes('KI'));
   await assert.rejects(()=>A.inspect(raw,ids[i].replace('-portrait-b','')));
  }
 }
 console.log('League B assets passed: all 27 existing mappings retained, five separate v2 keys appended and optional actual private BIN validation. Browser image import remains separate.');
})().catch(error=>{console.error(error);process.exit(1);});
