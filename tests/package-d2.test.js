const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/diagnostics.js','utf8');
function env(databases={}){
 const calls=[],events={};const c={console,Date,JSON,Number,Object,Set,Array,Promise,URL,setTimeout,clearTimeout,Uint8Array,Error,navigator:{},document:{querySelector:()=>({content:'abcdef123456'})},TPStoreTools:{parseLegacy:b=>{if(!b.byteLength)throw Error('bad');}},addEventListener:(name,fn)=>{events[name]=fn;}};
 c.indexedDB={open(name){calls.push(['open',name]);const r={transaction:{abort(){calls.push(['abort-create',name]);}}};queueMicrotask(()=>{
  if(!databases[name]){r.onupgradeneeded();r.onerror?.();return;}
  r.result={objectStoreNames:{contains:store=>!!databases[name][store]},close(){},transaction(store,mode){calls.push(['transaction',mode]);assert.equal(mode,'readonly');const tx={objectStore:()=>({get(key){return request(databases[name][store][key]);},count(){return request(Object.keys(databases[name][store]).length);}})};function request(value){const req={};queueMicrotask(()=>{req.result=value;req.onsuccess();tx.oncomplete();});return req;}return tx;}};r.onsuccess();
 });return r;}};
 c.window=c;vm.createContext(c);vm.runInContext(source,c);return {c,d:c.TPDiagnostics,calls,events};
}
(async()=>{
 const raw=new Uint8Array([1,2,3,4]);const {c,d,calls,events}=env({'itamapoke':{save:{state:raw}},'itamapoke-assets':{sprites:{a:raw,b:raw}},'itamapoke-cries':{cries:{}},'itamapoke-dexentries':{text:{de:'PRIVATE'}}});
 assert.equal(d.state().letzteSpeicherung,null);
 d.record('manager',{name:'MyPrivateNickname',message:'PRIVATE',stack:'PRIVATE'});for(let i=0;i<30;i++)d.record(i%2?'runtime':'promise',{name:'Error',message:'PRIVATE'});assert.equal(d.state().fehler.length,20);assert(!JSON.stringify(d.report()).includes('PRIVATE'));assert(!JSON.stringify(d.report()).includes('MyPrivateNickname'));
 const snapshot=await d.check();assert.equal(snapshot.pruefung.spielstand.status,'Gespeicherte Kopie lesbar');assert.equal(snapshot.pruefung.dateien.Grafikdateien,2);assert.equal(snapshot.pruefung.offline.status,'Nicht unterstützt');assert(calls.filter(x=>x[0]==='transaction').every(x=>x[1]==='readonly'));
 const missing=env();await missing.d.check();assert(missing.calls.some(x=>x[0]==='abort-create'));assert(!missing.calls.some(x=>x[0]==='transaction'));
 let reply={version:'abcdef123456',files:['./index.html','./diagnostics.js']},hits=0;
 c.MessageChannel=class{constructor(){this.port1={close(){}};this.port2={peer:this.port1};}};
 c.navigator.serviceWorker={controller:{scriptURL:'https://example.test/game/sw.js',postMessage(message,ports){assert.equal(message.type,'TP_DIAGNOSTICS');queueMicrotask(()=>ports[0].peer.onmessage({data:reply}));}}};
 c.caches={match:async(url,options)=>{assert(url.startsWith('https://example.test/game/'));assert.equal(options.cacheName,'itamapoke-abcdef123456');hits++;return {ok:true};}};
 assert.equal((await d.check()).pruefung.offline.status,'Vollständig');assert.equal(hits,2);
 c.caches.match=async()=>undefined;assert.equal((await d.check()).pruefung.offline.status,'Nicht vollständig');
 reply={version:'123456abcdef',files:['./index.html']};assert.equal((await d.check()).pruefung.offline.status,'Versionswechsel erkannt – erneut öffnen');
 reply={version:'abcdef123456',files:['https://private.example/secret']};assert.equal((await d.check()).pruefung.offline.status,'Offline-Dienst nicht prüfbar');assert(!JSON.stringify(d.report()).includes('private.example'));
 const main=fs.readFileSync('browser_ver/web/main.js','utf8');const a=main.indexOf('var tpSaveEpoch = 0;'),b=main.indexOf('// Pulls the current store',a);let tx;
 c.openDb=async()=>({transaction(){tx={objectStore:()=>({put(){}})};return tx;}});c.tpSaveReplacing=false;c.STORE_NAME="save";c.SAVE_KEY="state";vm.runInContext(main.slice(a,b),c);
 const saving=c.writeSave(raw);await new Promise(setImmediate);assert.equal(d.state().letzteSpeicherung,null);tx.oncomplete();await saving;assert.equal(d.state().letzteSpeicherung.bytes,4);const confirmed=d.state().letzteSpeicherung.zeit;
 const log=c.console;c.console={warn(){}};const failure=c.writeSave(raw);await new Promise(setImmediate);tx.error={name:'QuotaExceededError',message:'PRIVATE'};tx.onabort();await failure;c.console=log;assert.equal(d.state().speicherergebnis,'Fehler');assert.equal(d.state().letzteSpeicherung.zeit,confirmed);assert(!JSON.stringify(d.report()).includes('PRIVATE'));
 c.tpSaveReplacing=true;const prior=tx;await c.writeSave(raw);assert.equal(tx,prior);assert.equal(d.state().speicherergebnis,'Fehler');
 for(const file of ['browser_ver/web/index.html','browser_ver/web/sw.js'])assert(fs.readFileSync(file,'utf8').includes('diagnostics.js'));
 assert(fs.readFileSync('browser_ver/web/sw.js','utf8').includes('event.ports[0].postMessage({version:VERSION,files:FILES})'));
 console.log('D2: bounded private-free reports, read-only/missing databases, commit-only save confirmation, abort and replacement gate passed.');
})().catch(e=>{console.error(e);process.exit(1);});
