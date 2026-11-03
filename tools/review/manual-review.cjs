#!/usr/bin/env node
'use strict';

const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const http=require('node:http'),crypto=require('node:crypto');
const readline=require('node:readline');
const {createRequire}=require('node:module');

const ROOT=path.resolve(__dirname,'../..');
const projectRequire=createRequire(
 path.join(ROOT,'tools/browser-tests/package.json')
);
const {chromium}=projectRequire('@playwright/test');
const {makeServer}=require(
 path.join(ROOT,'tools/browser-tests/server.cjs')
);

const argv=process.argv.slice(2);
if(argv.length!==2||argv[0]!=='--saves')
 throw Error('Aufruf: manual-review.cjs --saves ORDNER');

const saves=fs.realpathSync(argv[1]);
if(!process.stdin.isTTY)
 throw Error('Ein interaktives Terminal wird benötigt.');

if(!globalThis.crypto)globalThis.crypto=crypto.webcrypto;

for(const [globalName,file] of [
 ['TPCollectionModel','collection-model.js'],
 ['TPAdmissionModel','collection-admission-model.js'],
 ['TPLeagueTeamState','league-team-state.js'],
 ['TPZapdosModel','zapdos-story-model.js'],
 ['TPArktosModel','articuno-story-model.js'],
 ['TPLavadosModel','moltres-story-model.js'],
 ['TPMewtuModel','mewtwo-story-model.js'],
 ['TPMewModel','mew-story-model.js']
]){
 globalThis[globalName]=require(
  path.join(ROOT,'browser_ver/web',file)
 );
}
const T=require(path.join(ROOT,'browser_ver/web/storage-tools.js'));

// P06 review profile configuration
const defaultNames=[
 '01-drei-orden',
 '02-vier-orden',
 '03-fuenf-orden',
 '04-sechs-orden-einstieg',
 '05-arktos-minispiel',
 '06-arktos-begegnung',
 '07-arktos-aufnahme-wartet',
 '08-arktos-finale'
];

const manifestPath=path.join(saves,'review.json');
const hasManifest=fs.existsSync(manifestPath);
const manifest=hasManifest?
 JSON.parse(fs.readFileSync(manifestPath,'utf8')):null;

if(hasManifest){
 if(!manifest||typeof manifest!=='object'||Array.isArray(manifest)||
    Object.keys(manifest).length!==3||
    !['schema','story','names'].every(key=>
     Object.prototype.hasOwnProperty.call(manifest,key))||
    manifest.schema!==1||
    !['articuno','moltres','mewtwo','mew','catalogue','journal','mega'].includes(manifest.story)||
    !Array.isArray(manifest.names)||manifest.names.length!==8||
    manifest.names.some((name,index)=>
     typeof name!=='string'||name.length>96||
     !/^[0-9]{2}-[a-z0-9-]+$/.test(name)||
     !name.startsWith(String(index+1).padStart(2,'0')+'-'))||
    new Set(manifest.names).size!==8)
  throw Error('Ungueltiges Reviewprofil.');
}
const reviewStory=hasManifest?manifest.story:'articuno';
const names=Object.freeze([...(hasManifest?manifest.names:defaultNames)]);
// End P06 review profile configuration

let context,server,page,output,origin;
let current=5,busy=false,closing=false,shot=0,eventCount=0;
let graphicsLoaded=false;

const profile=path.join(
 os.homedir(),
 'Library/Application Support/iTamaPoke-Revisionsbrowser-Playwright'
);
const fixtures=new Map();

function event(kind,data){
 if(output&&eventCount++<200){
  fs.appendFileSync(path.join(output,'events.jsonl'),
   JSON.stringify({
    time:new Date().toISOString(),kind,data
   })+'\n'
  );
 }
}
function help(){
 console.log('\n1–8: Testspielstand neu starten');
 console.log('s: Screenshot + Notiz');
 console.log('r: neu laden, Fortschritt behalten');
 console.log('w: Größe wechseln (Hoch-/Querformat) | h: Hilfe | q: Ende');
 /* UI01 arena review case help */
  console.log(['01-keine-orden','01-johto-ohne-orden'].includes(names[0])?
  names.map((name,index)=>(index+1)+' = '+name.slice(3).replaceAll('-',' ')).join('\n'):
  reviewStory==='mega'?
   names.map((name,index)=>(index+1)+' = '+name.slice(3).replaceAll('-',' ')).join('\n'):
   reviewStory==='journal'?
  '1 = gemischt / neue Einträge · 2 = gemischt / bereits gelesen\n'+
  '3 = kurzer Eintrag · 4 = langer Eintrag\n'+
  '5 = Expeditionsgruppen · 6 = leeres Tagebuch\n'+
  '7 = 120 Einträge · 8 = 200 Einträge\n':
  reviewStory==='catalogue'?
  '1 = leer · 2 = vier Orden · 3 = sechs Orden · 4 = acht Orden\n'+
  '5 = Kanto-Champion · 6 = alle fünf Geschichten\n'+
  '7 = leerer Katalog / Breitencheck · 8 = voller Katalog / Breitencheck\n':
  reviewStory==='mew'?
  '5 = Versteckspiel · 6 = Mew-Begegnung\n':
  reviewStory==='mewtwo'?
  '5 = Psi-Barriere · 6 = Mewtu-Begegnung\n':
  reviewStory==='moltres'?
  '5 = Felsenschieber · 6 = Lavados-Begegnung\n':
  '5 = Eiszapfen-Minispiel · 6 = Arktos-Begegnung\n');
}
/* UI01 winner-team review: existing slot 7, unchanged shortcuts. */
async function ready(){
 await page.waitForFunction(
  ()=>window.TPAppMenu?.ready===true&&
   (!window.TPCollectionGame||window.TPCollectionGame.ready),
  {},
  {timeout:30000}
 );
}

/* UI01 Mega: report existing profile graphics */
let megaGraphicsReported=false;
async function reportMegaProfileGraphics(){
 if(megaGraphicsReported)return;
 const entries=await page.evaluate(async()=>{
  const names=[
   "p006.bin","ps006.bin","p376.bin","ps376.bin","p303.bin","ps303.bin",
   "p006-mega-x.bin","ps006-mega-x.bin",
   "p376-mega.bin","ps376-mega.bin",
   "p303-mega.bin","ps303-mega.bin"
  ];
  const entries=[];
  for(const name of names){
   if(typeof loadSpriteAsset!=="function"){
    entries.push({name,status:"NICHT PRÜFBAR: Leseschnittstelle fehlt"});
    continue;
   }
   try{
    const raw=await loadSpriteAsset(name);
    if(!raw){entries.push({name,status:"FEHLT IM PROFIL"});continue;}
    TPStoreTools.inspectSprite(raw);
    entries.push({name,status:"VORHANDEN UND LESBAR"});
   }catch(error){
    entries.push({name,status:"NICHT LESBAR: "+String(error.message||error)});
   }
  }
  return entries;
 });
 console.log('\nMega-Grafikbestand im vorhandenen Reviewprofil:');
 for(const entry of entries)console.log(entry.status+' · '+entry.name);
 console.log('Nur gelesen: keine Grafik ersetzt oder heruntergeladen.\n');
 megaGraphicsReported=true;
}

async function openStory(){
 /* UI01 Mega review profile */
 if(reviewStory==='mega'){
  const H=require(path.join(ROOT,'tools/browser-tests/specs/helpers.js'));
  await reportMegaProfileGraphics();
  await H.openStatus(page);
  return;
 }
 await page.evaluate(
  id=>window.TPAppMenu.show(id),
  reviewStory==='journal'?'journal':(reviewStory==='catalogue'||current<=3)?'stories':reviewStory
 );
}
async function graphics(){
 const files=[];
 for(const name of [...new Set([...[
  'p001.bin','p003.bin','p006.bin','p009.bin','ps009.bin',
  'p025.bin','p094.bin','p149.bin',
  'p144.bin','p145.bin','p146.bin','p150.bin','p151.bin','p376.bin'
 ],...(reviewStory==='mega'?["p006.bin", "ps006.bin", "p376.bin", "ps376.bin", "p303.bin", "ps303.bin", "p006-mega-x.bin", "ps006-mega-x.bin", "p376-mega.bin", "ps376-mega.bin", "p303-mega.bin", "ps303-mega.bin"]:[])])]){
  const file=path.join(ROOT,'Resources/mons',name);
  if(fs.existsSync(file)&&fs.statSync(file).isFile()){
   const bytes=fs.readFileSync(file);
   if(bytes.length<=16*1024*1024){
    files.push({name,bytes:Array.from(bytes)});
   }
  }
 }
 if(files.length){
  await page.evaluate(async entries=>{
   if(typeof importSpriteFiles!=='function')
    throw Error('Grafikimport fehlt.');
   return importSpriteFiles(entries.map(entry=>
    new File([Uint8Array.from(entry.bytes)],entry.name)
   ));
  },files);
 }
 console.log(
  'Lokale Reviewgrafiken:',
  files.map(file=>file.name).join(', ')||
   'keine in Resources/mons; vorhandene Profilgrafiken bleiben erhalten.'
 );
}
async function loadCase(number){
 const oldPages=context.pages();
 const retainedViewport=page?.viewportSize()||null;
 const loader=await context.newPage();
 if(retainedViewport)await loader.setViewportSize(retainedViewport);
 await loader.goto(origin+'/__review_bootstrap__');

 for(const old of oldPages)await old.close();

 page=loader;
 current=number;

 page.on('pageerror',error=>event('pageerror',error.message));
 page.on('console',message=>{
  if(message.type()==='error')event('console',message.text());
 });

 await page.evaluate(async ({raw,label})=>{
  sessionStorage.setItem('__tpReviewLabel',label);

  const db=await new Promise((resolve,reject)=>{
   const request=indexedDB.open('itamapoke',1);
   request.onupgradeneeded=()=>{
    if(!request.result.objectStoreNames.contains('save'))
     request.result.createObjectStore('save');
   };
   request.onerror=()=>reject(request.error);
   request.onsuccess=()=>resolve(request.result);
  });
  try{
   await new Promise((resolve,reject)=>{
    const tx=db.transaction('save','readwrite');
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(
     tx.error||Error('Testimport abgebrochen')
    );
    tx.objectStore('save').put(
     Uint8Array.from(raw),'state'
    );
   });
  }finally{
   db.close();
  }
 },{
  raw:Array.from(fixtures.get(number)),
  label:names[number-1]
 });

 await page.goto(origin+'/');
 await ready();

 if(!graphicsLoaded){
  await graphics();
  graphicsLoaded=true;
 }

 await openStory();
 await page.bringToFront();
 event('fixture',names[number-1]);
 console.log('Aktiv:',names[number-1]);
}
function note(){
 process.stdin.setRawMode(false);
 return new Promise(resolve=>{
  const rl=readline.createInterface({
   input:process.stdin,
   output:process.stdout
  });
  rl.question(
   'Notiz zum Screenshot (Enter = ohne Notiz): ',
   answer=>{
    rl.close();
    if(!closing){
     process.stdin.setRawMode(true);
     process.stdin.resume();
    }
    resolve(answer);
   }
  );
 });
}
async function screenshot(){
 if(!page||page.isClosed())
  throw Error('Kein Reviewfenster geöffnet.');

 const stamp=new Date().toISOString().replace(/[:.]/g,'-');
 const base=String(++shot).padStart(3,'0')+
  '-'+stamp+'-'+names[current-1];

 await page.screenshot({
  path:path.join(output,base+'.png'),
  fullPage:true
 });

 const state=await page.evaluate(()=>{
  const read=fn=>{
   try{return fn();}
   catch(error){
    return {error:error.code||error.message};
   }
  };
  return {
   screen:typeof screen==='string'?screen:'',
   arktos:read(()=>window.TPArktos?.read()),
   lavados:read(()=>window.TPLavados?.read()),
   mewtu:read(()=>window.TPMewtu?.read()),
   mew:read(()=>window.TPMew?.read()),
   diagnostics:read(()=>window.TPDiagnostics?.report)
  };
 }).catch(error=>({error:error.message}));

 console.log('Screenshot aufgenommen.');
 const text=await note();

 fs.writeFileSync(path.join(output,base+'.txt'),text+'\n');
 fs.writeFileSync(
  path.join(output,base+'.json'),
  JSON.stringify({
   fixture:names[current-1],
   viewport:page.viewportSize(),
   note:text,
   state
  },null,2)
 );
 console.log('Gespeichert:',base+'.png / .txt / .json');
}
async function stop(code=0){
 if(closing)return;
 closing=true;

 if(process.stdin.isTTY)process.stdin.setRawMode(false);
 process.stdin.removeListener('keypress',keyHandler);
 process.stdin.pause();

 if(context)await context.close().catch(()=>{});
 if(server?.listening)
  await new Promise(resolve=>server.close(resolve));

 console.log('\nReview beendet. Aufnahmen:',output||'noch keine');
 process.exitCode=code;
}
async function keyHandler(value,key={}){
 if(key.ctrl&&key.name==='c'){
  await stop();
  return;
 }
 if(busy||closing)return;
 busy=true;
 try{
  if(/^[1-8]$/.test(value||'')){
   await loadCase(Number(value));
  }else if(value==='s'){
   await screenshot();
  }else if(value==='r'){
   await page.reload();
   await ready();
   await openStory();
   console.log('Neu geladen, Fortschritt behalten.');
  }else if(value==='w'){
   const sizes=[
 {width:320,height:844},{width:390,height:844},{width:430,height:844},
 {width:568,height:320},{width:844,height:390},{width:926,height:430}
];
const old=page.viewportSize();
const index=sizes.findIndex(size=>size.width===old.width&&size.height===old.height);
const size=sizes[(index+1)%sizes.length];
await page.setViewportSize(size);
console.log('Review-Größe:',size.width+' × '+size.height,
 size.width>size.height?'Querformat':'Hochformat');
  }else if(value==='h'){
   help();
  }else if(value==='q'){
   await stop();
  }
 }catch(error){
  event('command-error',error.message);
  console.error('Reviewfehler:',error.message);
 }finally{
  busy=false;
 }
}

(async()=>{
 for(let i=0;i<names.length;i++){
  const decoded=await T.decode(
   fs.readFileSync(path.join(saves,names[i]+'.tpsave'))
  );
  fixtures.set(i+1,decoded.raw);
 }

 const downloads=path.join(os.homedir(),'Downloads');
 fs.mkdirSync(downloads,{recursive:true});
 output=fs.mkdtempSync(
  path.join(downloads,'iTamaPoke-Review-Aufnahmen-')
 );

 const staticHandler=makeServer(
  path.join(ROOT,'browser_ver/web')
 ).listeners('request')[0];

 server=http.createServer((request,response)=>{
  if(request.url==='/__review_bootstrap__'){
   response.writeHead(200,{
    'Content-Type':'text/html; charset=utf-8',
    'Cache-Control':'no-store'
   });
   response.end(
    '<!doctype html><title>Review-Spielstand vorbereiten</title>'
   );
  }else{
   staticHandler(request,response);
  }
 });

 await new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(8766,'127.0.0.1',resolve);
 });
 origin='http://127.0.0.1:8766';

 fs.mkdirSync(profile,{recursive:true});
 const options={
  headless:false,
  viewport:{width:390,height:844},
  deviceScaleFactor:1,
  isMobile:true,
  hasTouch:true,
  locale:'de-DE',
  timezoneId:'Europe/Berlin',
  serviceWorkers:'block',
  acceptDownloads:true
 };

 const executable=chromium.executablePath();
 fs.accessSync(executable,fs.constants.X_OK);
 console.log('Review-Browser:',executable);
 context=await chromium.launchPersistentContext(profile,options);
 context.on('close',()=>{void stop();});

 await context.addInitScript(()=>{
  document.addEventListener('DOMContentLoaded',()=>{
   const badge=document.createElement('div');
   badge.id='tp-manual-review-badge';
   badge.textContent='TEST · '+
    (sessionStorage.getItem('__tpReviewLabel')||'Review');
   badge.style.cssText=
    'position:fixed;top:5px;right:5px;z-index:2147483647;'+
    'pointer-events:none;background:#ffdc65;color:#172130;'+
    'padding:4px 7px;border:1px solid #172130;border-radius:5px;'+
    'font:10px monospace;max-width:85vw';
   document.body.appendChild(badge);
  },{once:true});
 });

 fs.writeFileSync(
  path.join(output,'session.json'),
  JSON.stringify({
   created:new Date().toISOString(),
   saves,profile,origin,node:process.version,
   wasmSha256:crypto.createHash('sha256').update(
    fs.readFileSync(path.join(ROOT,'browser_ver/web/tp_core.wasm'))
   ).digest('hex')
  },null,2)
 );

 console.log('Revisionsbrowser · nur synthetische Testspielstände');
 console.log('Aufnahmen:',output);
 console.log('Profil:',profile);

 await loadCase(['catalogue','journal','mega'].includes(reviewStory)?1:5);

 readline.emitKeypressEvents(process.stdin);
 process.stdin.setRawMode(true);
 process.stdin.on('keypress',keyHandler);
 process.stdin.resume();
 help();
})().catch(async error=>{
 console.error('Start fehlgeschlagen:',error.message);
 event('startup-error',error.message);

 if(page&&!page.isClosed()&&output){
  await page.screenshot({
   path:path.join(output,'startfehler.png'),
   fullPage:true
  }).catch(()=>{});
 }
 await stop(1);
});

process.on('SIGINT',()=>{void stop();});
process.on('SIGTERM',()=>{void stop();});
