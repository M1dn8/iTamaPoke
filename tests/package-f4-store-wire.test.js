// Real F4-A bytes -> unchanged native production codec -> strict parser.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process');
const M=require('../browser_ver/web/collection-model.js');
const native=process.env.TP_F4_STORE_NATIVE;if(!native)throw Error('TP_F4_STORE_NATIVE fehlt');
const sandbox={TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,DataView,Map,Set,console,TPCollectionModel:M,crypto:require('node:crypto').webcrypto};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('browser_ver/web/storage-tools.js','utf8'),sandbox);const tools=sandbox.TPStoreTools;
(async()=>{const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'f4-wire-model-'));try{
 const result=cp.spawnSync(native,['--snapshot']);assert.equal(result.status,0);const actual=JSON.parse(result.stdout.toString());const state=M.attachCurrent(M.create(),{...actual,origin:'existing'}),normal=M.encode(state);
 for(const maximum of [false,true]){
  const payload=maximum?normal+' '.repeat(262144-Buffer.byteLength(normal)):normal;const file=path.join(tmp,'collection.txt');fs.writeFileSync(file,payload);
  const r=cp.spawnSync(native,['--wire-model',file],{maxBuffer:4*1024*1024});assert.equal(r.status,0,r.stderr.toString());const raw=new Uint8Array(r.stdout),parsed=tools.parseLegacy(raw),field=parsed.values.get('f4col');assert.equal(field.type,3);assert.equal(new TextDecoder().decode(field.value),payload);assert.deepEqual(M.decode(payload),state);assert.equal(parsed.summary.dex,376);assert.equal(parsed.summary.nick,'Atlas');assert.equal(parsed.values.get('agmask').value,3);assert.equal(parsed.values.get('unknown-future').value,'keep-me');
  const sealed=await tools.seal(raw,{test:'F4-B2-real-model-codec'}),restored=await tools.decode(sealed);assert.deepEqual(Buffer.from(restored.raw),Buffer.from(raw));assert.deepEqual(Buffer.from(restored.values.get('f4col').value),Buffer.from(field.value));sealed[sealed.length-1]^=1;await assert.rejects(()=>tools.decode(sealed),/Pruefsumme/);
 }
 console.log('F4-B2 real model/native save wire passed: actual A model and real Pet DTO, original native export/import codec, strict JS model validation, SHA256 envelope and exact 256-KiB boundary.');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exit(1);});
