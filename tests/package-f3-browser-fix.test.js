const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/arena.js','utf8');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVR4nGN0q4j6z0ABYKJE86gBowaMGjCYDAAAvLgCN3gxOuEAAAAASUVORK5CYII=','base64');
function env({rejectBlobs=true,fail=false,initial=null}={}){
 const store=new Map(initial?[['rocko',initial]]:[]),urls=new Map(),writes=[];let serial=0;
 const database={objectStoreNames:{contains:()=>true},close(){},transaction(name,mode){const tx={objectStore(){return {put(value,key){if(fail)throw new DOMException('fixture quota','QuotaExceededError');if(rejectBlobs&&value instanceof Blob)throw new DOMException('fixture WebKit blob limitation','DataCloneError');assert(value instanceof ArrayBuffer);store.set(key,value.slice(0));writes.push(value);queueMicrotask(()=>tx.oncomplete?.());},get(key){const req={};queueMicrotask(()=>{req.result=store.get(key);req.onsuccess?.();queueMicrotask(()=>tx.oncomplete?.());});return req;}};}};return tx;}};
 const c={ArrayBuffer,Uint8Array,DataView,Blob,Date,Math,Object,Number,Promise,Map,Set,console,setTimeout,clearTimeout,queueMicrotask,screen:'arena',tpSaveReplacing:false,TPKantoArena:{leaders:[{id:'rocko'}]},Module:{ccall:()=>0},addEventListener(){},URL:{createObjectURL(blob){assert(blob instanceof Blob);const key='blob:fixture/'+(++serial);urls.set(key,blob);return key;},revokeObjectURL(key){urls.delete(key);}},Image:class{set src(value){assert(urls.has(value));this.width=this.height=16;queueMicrotask(()=>this.onload());}},indexedDB:{open(){const req={};queueMicrotask(()=>{req.result=database;req.onsuccess?.();});return req;}},document:{addEventListener(){},createElement(tag){assert.equal(tag,'canvas');return {width:0,height:0,getContext:()=>({drawImage(){}}),toBlob(done){queueMicrotask(()=>done(new Blob([png],{type:'image/png'})));}}}}};c.window=c;vm.createContext(c);
 const instrumented=source.replace('window.TPArena=Object.freeze({','window.__f3StorageTest={portraitBlob,picture};window.TPArena=Object.freeze({');assert.notEqual(instrumented,source);vm.runInContext(instrumented,c);
 return {c,api:c.TPArena,test:c.__f3StorageTest,store,writes};
}
(async()=>{
 const e=env();assert(await e.api.importPortrait(new Blob([png],{type:'image/png'}),0));assert(!e.api.busy);const bytes=e.store.get('rocko');assert(bytes instanceof ArrayBuffer);assert.equal(Buffer.compare(Buffer.from(bytes),png),0);assert.equal(e.writes.length,1);
 // A fresh controller must load bytes written by the previous controller.
 const fresh=env({initial:bytes});assert.equal(fresh.test.picture(0),null);await new Promise(setImmediate);assert.equal(fresh.test.picture(0).width,16);
 // Existing Chromium/iPhone Blob data is still readable.
 const old=new Blob([png],{type:'image/png'}),legacy=env({initial:old});assert.equal(legacy.test.portraitBlob(old),old);legacy.test.picture(0);await new Promise(setImmediate);assert.equal(legacy.test.picture(0).height,16);
 const typed=e.test.portraitBlob(new Uint8Array(png));assert.deepEqual(Buffer.from(await typed.arrayBuffer()),png);assert.throws(()=>e.test.portraitBlob('not portrait bytes'));
 const bad=env();await assert.rejects(()=>bad.api.importPortrait(new Blob(['bad']),0),/PNG/);assert(!bad.api.busy&&!bad.writes.length);
 const failure=env({fail:true,initial:bytes});await assert.rejects(()=>failure.api.importPortrait(new Blob([png],{type:'image/png'}),0),/quota/);assert(!failure.api.busy);assert.deepEqual(Buffer.from(failure.store.get('rocko')),png);
 console.log('F3 storage regression passed: binary-only writes under simulated Blob rejection, exact PNG bytes, fresh-controller reload, legacy Blob/typed-array reads, invalid PNG/quota refusal and released busy gate.');
})().catch(e=>{console.error(e);process.exit(1);});
