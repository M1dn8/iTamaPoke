const assert=require("node:assert/strict");
globalThis.crypto=require("node:crypto").webcrypto;
const T=require("../browser_ver/web/storage-tools.js");
function legacy(){
 const entries=[["init",0,Buffer.from([1])],["dexn",1,number(387)],["eggT2",1,number(387)],["age",1,number(1020)],["bond",1,number(0)],["dexreg",3,Buffer.from([1])],["dexcgt",3,Buffer.from([2])]];
 const count=Buffer.alloc(4);count.writeUInt32LE(entries.length);return Buffer.concat([count,...entries.map(([key,type,value])=>{const k=Buffer.from(key),len=Buffer.alloc(4);len.writeUInt32LE(value.length);return Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),len,value]);})]);
}
function number(n){const b=Buffer.alloc(8);b.writeBigInt64LE(BigInt(n));return b;}
function sprite(){return Uint8Array.from([84,80,75,50,1,1,0,0,0,0,1,1,1,70,0,0]);}
(async()=>{
 const raw=legacy(),p=T.parseLegacy(raw);assert.equal(p.summary.dex,387);assert.equal(p.summary.level,18);assert.equal(p.summary.raised,1);assert.equal(p.summary.caught,1);
 assert.equal((await T.decode(raw)).format,"Klassischer Spielstand");
 const wrapped=await T.seal(raw,{createdAt:"test",build:"test"});const result=await T.decode(wrapped);assert.equal(result.format,"Version 1");assert.deepEqual(Buffer.from(result.raw),raw);
 const corrupt=wrapped.slice();corrupt[corrupt.length-1]^=1;await assert.rejects(()=>T.decode(corrupt),/Pruefsumme/);
 const future=wrapped.slice();future[4]=2;await assert.rejects(()=>T.decode(future),/version/i);
 for(let n=0;n<raw.length;n++)assert.throws(()=>T.parseLegacy(raw.subarray(0,n)));
 assert.throws(()=>T.parseLegacy(Buffer.concat([raw,Buffer.from([0])])));
 assert.equal(T.canonicalSprite("p1000.bin").dex,1000);assert.equal(T.canonicalSprite("PS1025.BIN").key,"ps1025.bin");assert.equal(T.canonicalSprite("p1.bin").key,"p001.bin");assert.equal(T.canonicalSprite("p1026.bin"),null);assert.equal(T.canonicalSprite("p0000.bin"),null);
 assert.equal(T.inspectSprite(sprite()).kind,"single-frame");const bad=sprite();bad[bad.length-1]=3;assert.throws(()=>T.inspectSprite(bad),/Palette/);assert.throws(()=>T.inspectSprite(sprite().slice(0,-1)),/abgeschnitten/);
 assert.throws(()=>T.inspectThumbs(Uint8Array.from([84,80,84,72,1,0])));
 console.log("Package B save format, checksum, truncation, sprite validation and 4-digit ID tests passed.");
})().catch(e=>{console.error(e);process.exit(1);});
