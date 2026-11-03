// Browser document events required by the manager's visibility-pause hook.
// This extends the isolated Node DOM double; production code is unchanged.
function __f4RunWithDocumentEvents(code,context,...options){
 const doc=context&&context.document;
 if(doc&&typeof doc.addEventListener!=='function'){
  const listeners=new Map();const previous=typeof doc.dispatchEvent==='function'?doc.dispatchEvent.bind(doc):null;
  doc.addEventListener=function(type,listener,option=false){if(!listener)return;const capture=option===true||!!option?.capture;const list=listeners.get(type)||[];if(!list.some(x=>x.listener===listener&&x.capture===capture))list.push({listener,capture,once:!!option?.once});listeners.set(type,list);};
  doc.removeEventListener=function(type,listener,option=false){const capture=option===true||!!option?.capture;listeners.set(type,(listeners.get(type)||[]).filter(x=>x.listener!==listener||x.capture!==capture));};
  doc.dispatchEvent=function(event){if(!event||typeof event.type!=='string')throw Error('Event type required');for(const item of [...(listeners.get(event.type)||[])]){if(!(listeners.get(event.type)||[]).includes(item))continue;if(item.once)doc.removeEventListener(event.type,item.listener,item.capture);if(typeof item.listener==='function')item.listener.call(doc,event);else if(typeof item.listener.handleEvent==='function')item.listener.handleEvent(event);}const old=previous?previous(event):true;return old!==false&&!event.defaultPrevented;};
 }
 return require('node:vm').runInContext(code,context,...options);
}
(function(){const vm=require('node:vm'),assert=require('node:assert/strict'),doc={visibilityState:'visible'},c=vm.createContext({document:doc});
 __f4RunWithDocumentEvents("globalThis.pauseCalls=0;globalThis.pauseHandler=()=>{if(document.visibilityState!=='visible')pauseCalls++;};document.addEventListener('visibilitychange',pauseHandler);",c);
 doc.visibilityState='hidden';doc.dispatchEvent({type:'visibilitychange'});assert.equal(c.pauseCalls,1);doc.removeEventListener('visibilitychange',c.pauseHandler);doc.dispatchEvent({type:'visibilitychange'});assert.equal(c.pauseCalls,1);
 let once=0;doc.addEventListener('visibilitychange',()=>once++,{once:true});doc.dispatchEvent({type:'visibilitychange'});doc.dispatchEvent({type:'visibilitychange'});assert.equal(once,1);
})();

const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto');
const c={crypto:crypto.webcrypto,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,DataView,URL,Blob,console,queueMicrotask};c.window=c;vm.createContext(c);for(const file of ['trainer-art.js','storage-tools.js'])__f4RunWithDocumentEvents(fs.readFileSync('browser_ver/web/'+file,'utf8'),c);const A=c.TPTrainerArt,T=c.TPStoreTools;let checks=0;function eq(a,b){assert.deepEqual(a,b);checks++;}function ok(x){assert(x);checks++;}async function rejects(fn,re){await assert.rejects(fn,re);checks++;}
function db(initial=[]){const stores=new Map([['sprites',new Map(initial)],['assetInfo',new Map()]]);let transactions=0;const api={stores,fail:false,get transactions(){return transactions;},close(){},transaction(store,mode){if(!stores.has(store))stores.set(store,new Map());const values=stores.get(store),pending=[];let scheduled=false;const tx={objectStore(){return {put(value,key){pending.push([key,value]);if(!scheduled){scheduled=true;queueMicrotask(()=>{if(api.fail&&store==='sprites'){tx.error=Error('quota');tx.onabort?.();}else{for(const [k,v] of pending)values.set(k,v);tx.oncomplete?.();}});}},get(key){const q={};queueMicrotask(()=>{q.result=values.get(key);q.onsuccess?.();tx.oncomplete?.();});return q;},getAllKeys(){const q={};queueMicrotask(()=>{q.result=[...values.keys()];q.onsuccess?.();});return q;},getAll(){const q={};queueMicrotask(()=>{q.result=[...values.values()];q.onsuccess?.();});return q;}};}};if(mode==='readwrite')transactions++;return tx;}};return api;}
// UI01: trainer manager DOM capabilities for the real asset job station.
const f4DomObservers=new Set();
function f4DomMutation(target,addedNodes=[],removedNodes=[]){
 for(const observer of f4DomObservers){
  const relevant=observer.targets.some(item=>{
   if(!item.options.childList)return false;
   if(item.target===target)return true;
   if(!item.options.subtree)return false;
   for(let parent=target.parentNode;parent;parent=parent.parentNode)
    if(parent===item.target)return true;
   return false;
  });
  if(!relevant)continue;
  observer.records.push({type:'childList',target,addedNodes,removedNodes});
  if(observer.queued)continue;
  observer.queued=true;
  queueMicrotask(()=>{
   observer.queued=false;
   const records=observer.takeRecords();
   if(records.length)observer.callback(records,observer);
  });
 }
}
class F4MutationObserver{
 constructor(callback){this.callback=callback;this.targets=[];this.records=[];this.queued=false;}
 observe(target,options){
  const existing=this.targets.find(item=>item.target===target);
  if(existing)existing.options={...options};
  else this.targets.push({target,options:{...options}});
  f4DomObservers.add(this);
 }
 disconnect(){this.targets=[];this.records=[];f4DomObservers.delete(this);}
 takeRecords(){const records=this.records;this.records=[];return records;}
}
function f4RequestAnimationFrame(callback){
 return setTimeout(()=>callback(Date.now()),0);
}
class E{
 constructor(tag){
  this.tag=tag;this.tagName=tag.toUpperCase();this.nodeType=1;
  this.children=[];this.parentNode=null;this.style={};
  this.className='';this.id='';this.hidden=false;this.disabled=false;
  this._text='';this._attributes=new Map();this._listeners=new Map();
  const dataName=key=>'data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase());
  this.dataset=new Proxy({},{
   get:(_target,key)=>this.getAttribute(dataName(key))??undefined,
   set:(_target,key,value)=>{this.setAttribute(dataName(key),value);return true;},
   deleteProperty:(_target,key)=>{this.removeAttribute(dataName(key));return true;}
  });
  const tokens=()=>this.className.split(/\s+/).filter(Boolean);
  this.classList={
   contains:value=>tokens().includes(value),
   add:(...values)=>{this.className=[...new Set([...tokens(),...values])].join(' ');},
   remove:(...values)=>{this.className=tokens().filter(value=>!values.includes(value)).join(' ');},
   toggle:(value,force)=>{
    const enabled=force===undefined?!tokens().includes(value):Boolean(force);
    if(enabled)this.classList.add(value);else this.classList.remove(value);
    return enabled;
   }
  };
 }
 get textContent(){
  return this._text+this.children.map(child=>child.textContent||'').join('');
 }
 set textContent(value){
  this.replaceChildren();this._text=String(value??'');
 }
 contains(other){
  for(let current=other;current;current=current.parentNode){
   if(current===this)return true;
  }
  return false;
 }
 // UI01: reflected input type and inventory DOM traversal.
 get type(){
  return this._attributes.get('type')||
   (this.tagName==='INPUT'?'text':this.tagName==='BUTTON'?'submit':'');
 }
 set type(value){this._attributes.set('type',String(value));}
 closest(selector){
  for(let current=this;current;current=current.parentNode){
   if(typeof current.matches==='function'&&current.matches(selector))return current;
  }
  return null;
 }
 get childNodes(){return this.children;}
 get parentElement(){return this.parentNode;}
 get firstChild(){return this.children[0]||null;}
 append(...nodes){for(const child of nodes)this.appendChild(child);}
 appendChild(child){
  if(child.parentNode)child.parentNode.removeChild(child);
  child.parentNode=this;this.children.push(child);
  f4DomMutation(this,[child],[]);return child;
 }
 removeChild(child){
  const index=this.children.indexOf(child);
  if(index<0)throw Error('Child not found');
  this.children.splice(index,1);child.parentNode=null;
  f4DomMutation(this,[],[child]);return child;
 }
 replaceChildren(...nodes){
  const removed=this.children.slice();
  for(const child of removed)child.parentNode=null;
  this.children=[];this._text='';
  if(removed.length)f4DomMutation(this,[],removed);
  this.append(...nodes);
 }
 remove(){if(this.parentNode)this.parentNode.removeChild(this);}
 setAttribute(key,value){
  value=String(value);this._attributes.set(key,value);
  if(key==='class')this.className=value;
  if(key==='id')this.id=value;
  if(key==='disabled')this.disabled=true;
 }
 getAttribute(key){
  if(key==='class')return this.className||null;
  if(key==='id')return this.id||null;
  return this._attributes.get(key)??null;
 }
 hasAttribute(key){return this.getAttribute(key)!==null;}
 removeAttribute(key){
  this._attributes.delete(key);
  if(key==='class')this.className='';
  if(key==='id')this.id='';
  if(key==='disabled')this.disabled=false;
 }
 addEventListener(type,listener){
  if(!this._listeners.has(type))this._listeners.set(type,new Set());
  this._listeners.get(type).add(listener);
 }
 removeEventListener(type,listener){this._listeners.get(type)?.delete(listener);}
 dispatchEvent(event){
  for(const listener of [...(this._listeners.get(event.type)||[])])
   listener.call(this,event);
  return !event.defaultPrevented;
 }
 click(){if(!this.disabled)this.dispatchEvent({type:'click',target:this});}
 focus(){}
 matches(selector){
  let rest=selector.trim(),valid=true;
  rest=rest.replace(/:not\(([^()]*)\)/g,(_whole,inner)=>{
   if(this.matches(inner))valid=false;return '';
  });
  rest=rest.replace(/:(disabled|enabled)/g,(_whole,state)=>{
   if(state==='disabled'?!this.disabled:this.disabled)valid=false;
   return '';
  });
  const tag=rest.match(/^[a-zA-Z][\w-]*|^\*/);
  if(tag){
   if(tag[0]!=='*'&&tag[0].toUpperCase()!==this.tagName)valid=false;
   rest=rest.slice(tag[0].length);
  }
  while(rest){
   let part=rest.match(/^([.#])([\w-]+)/);
   if(part){
    if(part[1]==='.'?!this.classList.contains(part[2]):this.id!==part[2])valid=false;
    rest=rest.slice(part[0].length);continue;
   }
   part=rest.match(/^\[([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?\]/);
   if(part){
    const expected=part[2]??part[3]??part[4];
    if(expected===undefined?!this.hasAttribute(part[1]):this.getAttribute(part[1])!==expected)
     valid=false;
    rest=rest.slice(part[0].length);continue;
   }
   throw Error('Unsupported test selector: '+selector);
  }
  return valid;
 }
 querySelectorAll(selector){
  const alternatives=selector.split(',').map(value=>value.trim());
  const result=[];
  function matchesPath(element,parts){
   if(!element.matches(parts[parts.length-1]))return false;
   let parent=element.parentNode;
   for(let index=parts.length-2;index>=0;index--){
    while(parent&&!parent.matches(parts[index]))parent=parent.parentNode;
    if(!parent)return false;
    parent=parent.parentNode;
   }
   return true;
  }
  function visit(parent){
   for(const child of parent.children){
    if(child instanceof E){
     if(alternatives.some(value=>matchesPath(child,value.split(/\s+(?![^\[]*\])/))))
      result.push(child);
     visit(child);
    }
   }
  }
  visit(this);return result;
 }
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}

function flat(n){return [n,...n.children.filter(x=>typeof x==='object').flatMap(flat)];}
function manager(database){const body=new E('body'),head=new E('head'),bar=new E('bar');Object.assign(c,{document:{body,head,getElementById:id=>[...flat(body),...flat(head)].find(node=>node.id===id)||null,createElement:t=>new E(t),createTextNode:t=>({children:[],textContent:t}),querySelector:()=>bar,activeElement:null},navigator:{},Module:{},fns:{speciesId:()=>1,evolvingNow:()=>false,ceremony:()=>false,wildPromptActive:()=>false},tpSaveReplacing:false,screen:'idle',dragStart:null,dragNow:null,choice:'none',feedMenuUntil:0,confirmUntil:0,ASSET_STORE:'sprites',CRY_STORE:'cries',DEXENTRY_STORE:'entries',openCryDb:async()=>database,openDexEntryDb:async()=>database,indexedDB:{open(){const q={};queueMicrotask(()=>{q.result=database;q.onsuccess?.();});return q;}},openAssetDb:async()=>database,refreshThumbs:async()=>{},spriteCache:new Map(),spriteLoading:new Set(),currentDex:5,loadingDex:5,TPArena:{invalidatePortraits(){c.invalidations=(c.invalidations||0)+1;}},setTimeout:(f,t)=>t===0?setTimeout(f,0):0,setInterval:()=>0,alert:()=>{throw Error('unexpected alert');}});c.Image=class{set src(_){queueMicrotask(()=>this.onload());}};Object.assign(c,{MutationObserver:F4MutationObserver,requestAnimationFrame:f4RequestAnimationFrame,cancelAnimationFrame:clearTimeout});__f4RunWithDocumentEvents(fs.readFileSync('browser_ver/web/management.js','utf8'),c);return {api:c.TPManager,root:body,text:()=>flat(body).map(n=>n.textContent).join('\n')};}
function file(name,b){const raw=Buffer.from(b),a=raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength);return {name,size:raw.length,arrayBuffer:async()=>a};}
(async()=>{const dir=process.env.TP_TRAINER_FIXTURES;if(!dir)throw Error('Run python3 tools/quality/test-f4-trainer.py');__f4RunWithDocumentEvents(fs.readFileSync('browser_ver/web/arena-kanto.js','utf8'),c);eq(JSON.stringify(c.TPKantoArena.leaders.map(x=>x.id)),JSON.stringify(A.ids));const files=A.ids.map(id=>file('trainer-kanto-'+id+'.bin',fs.readFileSync(path.join(dir,'trainer-kanto-'+id+'.bin'))));for(let i=0;i<8;i++){const m=T.canonicalSprite(files[i].name);eq(m.index,i);eq(m.trainer,true);const x=await A.inspect(await files[i].arrayBuffer(),A.ids[i]);eq(x.width,1);eq(x.height,1);eq(x.metadata.author,'Synthetic test author');}
 eq(A.canonical('trainer-kanto-unknown.bin'),null);eq(T.canonicalSprite('p025.bin').key,'p025.bin');eq(T.canonicalSprite('ps376-mega.bin').formId,2);eq(T.canonicalSprite('thumbs.bin').atlas,true);
 const raw=new Uint8Array(await files[0].arrayBuffer());for(const index of [0,4,6,8,12,20,raw.length-1]){const bad=raw.slice();bad[index]^=1;await rejects(()=>A.inspect(bad,'rocko'));}await rejects(()=>A.inspect(raw,'misty'),/passen/);
 const original=await A.inspect(raw);function repack(meta){const m=Buffer.from(JSON.stringify(meta)),head=Buffer.from(raw.slice(0,16));head.writeUInt32LE(m.length,8);const body=Buffer.concat([head,m,Buffer.from(original.png)]);return Buffer.concat([body,crypto.createHash('sha256').update(body).digest()]);}
 await rejects(()=>A.inspect(repack({...original.metadata,author:'bad'+String.fromCharCode(0)})),/Metadaten/);await rejects(()=>A.inspect(repack({...original.metadata,extra:'x'})),/Metadaten/);
 const database=db(),decode=async png=>{A.inspectPNG(png);};const result=await A.importBatch(database,'sprites',files,{decode});eq(result.saved,8);eq(database.transactions,1);eq(database.stores.get('sprites').size,8);ok([...database.stores.get('sprites').values()].every(v=>v instanceof ArrayBuffer));
 const bad=files.slice();bad[3]=file(files[3].name,raw);const before=new Map(database.stores.get('sprites'));await rejects(()=>A.importBatch(database,'sprites',bad,{decode}));eq(database.stores.get('sprites'),before);eq(database.transactions,1);await rejects(()=>A.importBatch(database,'sprites',[files[0],files[0]],{decode}),/doppelte/);eq(database.transactions,1);
 const failing=db([['trainer-kanto-rocko.bin',new Uint8Array([1]).buffer]]),previous=new Map(failing.stores.get('sprites'));failing.fail=true;await rejects(()=>A.importBatch(failing,'sprites',files,{decode}),/quota/);eq(failing.stores.get('sprites'),previous);
 const skipped=await A.importBatch(database,'sprites',files,{decode,onlyMissing:true,readExisting:async k=>database.stores.get('sprites').get(k)});eq(skipped.saved,0);eq(skipped.skipped,8);eq(database.transactions,1);
 const repair=db([['trainer-kanto-rocko.bin',new Uint8Array([1]).buffer]]);eq((await A.importBatch(repair,'sprites',[files[0]],{decode,onlyMissing:true,readExisting:async k=>repair.stores.get('sprites').get(k)})).saved,1);await rejects(()=>A.importBatch(db(),'sprites',files,{decode:async()=>{throw Error('decode failed');}}),/decode failed/);
 const managedDb=db(),m=manager(managedDb);eq(await m.api.importAssets('sprites',files),8);ok(m.text().includes('Leiter: 8 gespeichert'));eq(managedDb.stores.get('sprites').size,8);eq(await m.api.importAssets('sprites',files,true),0);ok(m.text().includes('8 uebersprungen'));
 const mixed=[file('trainer-kanto-misty.bin',raw),file('p025.bin',[84,80,75,50,1,1,0,0,0,0,1,1,1,70,0,0])];eq(await m.api.importAssets('sprites',mixed),1);eq(managedDb.stores.get('sprites').size,9);ok(m.text().includes('Leiterpaket nicht uebernommen'));await m.api.openAssets();eq(m.root.querySelector('[data-assets-category="graphics"] strong')?.textContent,'1 / 1025');eq(A.entries.length,50);eq(A.ids.length,8);eq(A.entries[26].leader,'kanto-youngster');eq(A.entries[26].version,2);eq(m.root.querySelector('[data-assets-category="trainers"] strong')?.textContent,'8 / 50');
 let release;const arenaContext={ArrayBuffer,Uint8Array,DataView,Blob,Date,Math,Object,Number,Promise,Map,Set,console,setTimeout,clearTimeout,screen:'arena',tpSaveReplacing:false,TPKantoArena:{leaders:[{id:'rocko'}]},Module:{ccall:()=>0},addEventListener(){},document:{addEventListener(){}},TPTrainerArt:{picture:()=>new Promise(r=>{release=r;})}};arenaContext.window=arenaContext;vm.createContext(arenaContext);const source=fs.readFileSync('browser_ver/web/arena.js','utf8').replace('window.TPArena=Object.freeze({','window.__artTest={picture};window.TPArena=Object.freeze({');__f4RunWithDocumentEvents(source,arenaContext);const P=arenaContext.__artTest;eq(P.picture(0),null);const oldRelease=release;arenaContext.TPArena.invalidatePortraits();eq(P.picture(0),null);release({image:{marker:'new-bin'}});await new Promise(setImmediate);eq(P.picture(0).marker,'new-bin');oldRelease({image:{marker:'stale'}});await new Promise(setImmediate);eq(P.picture(0).marker,'new-bin');
 console.log('F4-D trainer BIN passed: '+checks+' assertions; Python/JS parity, 8 IDs, headers/SHA/CRC/schema, transaction aborts, only-missing/repair, actual manager mixed import/counters and arena stale-cache priority. Browser image decoding mocked.');})().catch(e=>{console.error(e);process.exit(1);});
