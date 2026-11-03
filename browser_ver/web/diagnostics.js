// D2: local, bounded, content-free diagnostic snapshots. No telemetry.
(function(){
"use strict";
const labels={read:"Spielstand konnte nicht gelesen werden",write:"Speicherung fehlgeschlagen",frame:"Fehler beim Zeichnen",manager:"Verwaltungsfehler",runtime:"Laufzeitfehler",promise:"Unbehandelter Vorgang",probe:"Diagnoseprüfung fehlgeschlagen",report:"Bericht konnte nicht ausgegeben werden"};
const allowedNames=new Set(["QuotaExceededError","AbortError","SecurityError","InvalidStateError","NotAllowedError","DataError","UnknownError","TypeError","RangeError","SyntaxError","Error"]);
let lastSave=null,lastOutcome=null,errors=[],checks=null,pending=null,memory=null;
function record(code,error){try{if(!Object.prototype.hasOwnProperty.call(labels,code))code="runtime";let name="Unbekannt";try{if(allowedNames.has(error?.name))name=error.name;}catch(_e){}const now=Date.now(),last=errors[errors.length-1];if(last&&last.code===code&&last.art===name&&now-last.zeit<5000){last.anzahl++;last.zeit=now;}else{errors.push({code,art:name,zeit:now,anzahl:1});errors=errors.slice(-20);}if(code==="write")lastOutcome="Fehler";}catch(_e){}}
function saved(bytes){try{lastSave={zeit:Date.now(),bytes:Number.isFinite(bytes)?Math.max(0,bytes):0};lastOutcome="Bestätigt";}catch(_e){}}
function version(){const s=document.querySelector('meta[name="tp-build"]')?.content||"";return /^[a-f0-9]{7,40}$/i.test(s)?s:"lokal";}
function state(){return JSON.parse(JSON.stringify({version:version(),letzteSpeicherung:lastSave,speicherergebnis:lastOutcome,pruefung:checks,fehler:errors,leistung:window.TPPerformance?.snapshot()||null,grafikcache:memory}));}
function bounded(p,ms=3000){return new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error("Zeitlimit")),ms);Promise.resolve(p).then(v=>{clearTimeout(t);resolve(v);},e=>{clearTimeout(t);reject(e);});});}
function readOnly(name,store,key,hasKey=false){return new Promise((resolve,reject)=>{
 let done=false,db=null;const finish=(error,value)=>{if(done)return;done=true;clearTimeout(timer);if(db)db.close();error?reject(error):resolve(value);};
 const timer=setTimeout(()=>finish(Error("Zeitlimit")),3000);
 let request;try{request=indexedDB.open(name);}catch(e){finish(e);return;}
 request.onupgradeneeded=()=>{try{request.transaction.abort();}catch(_e){}finish(null,{vorhanden:false});};
 request.onerror=()=>{if(!done)finish(request.error||Error("Datenbank nicht verfügbar"));};
 request.onblocked=()=>finish(Error("Datenbank blockiert"));
 request.onsuccess=()=>{db=request.result;if(done){db.close();return;}try{
  if(!db.objectStoreNames.contains(store)){finish(null,{vorhanden:false});return;}
  const tx=db.transaction(store,"readonly"),object=tx.objectStore(store),r=hasKey?object.get(key):object.count();let value;
  r.onsuccess=()=>{value=r.result;};r.onerror=()=>finish(r.error||Error("Lesefehler"));tx.onabort=()=>finish(tx.error||Error("Lesen abgebrochen"));tx.onerror=()=>finish(tx.error||Error("Lesefehler"));tx.oncomplete=()=>finish(null,{vorhanden:true,wert:value});
 }catch(e){finish(e);}};
});}
async function saveCheck(){try{const r=await readOnly("itamapoke","save","state",true);if(!r.vorhanden||!r.wert)return {status:"Keine gespeicherte Kopie gefunden"};TPStoreTools.parseLegacy(r.wert);return {status:"Gespeicherte Kopie lesbar",bytes:r.wert.byteLength};}catch(e){return {status:"Gespeicherte Kopie nicht prüfbar"};}}
async function fileCheck(){const result={};for(const [label,db,store]of [["Grafikdateien","itamapoke-assets","sprites"],["Rufdateien","itamapoke-cries","cries"],["Textsprachen","itamapoke-dexentries","text"]]){try{const r=await readOnly(db,store);result[label]=r.vorhanden?r.wert:0;}catch(_e){result[label]=null;}}return result;}
async function offlineCheck(){
 if(!navigator.serviceWorker||!window.caches||typeof MessageChannel==="undefined")return {status:"Nicht unterstützt"};
 const controller=navigator.serviceWorker.controller;if(!controller)return {status:"Kein steuernder Offline-Dienst"};
 let port;
 try{
  const info=await bounded(new Promise((resolve,reject)=>{const channel=new MessageChannel();port=channel.port1;port.onmessage=e=>resolve(e.data);port.onmessageerror=()=>reject(Error("Antwort nicht lesbar"));controller.postMessage({type:"TP_DIAGNOSTICS"},[channel.port2]);}));
  if(!info||!Array.isArray(info.files)||info.files.length<1||info.files.length>256||typeof info.version!=="string")return {status:"Offline-Dienst nicht prüfbar"};
  const pageVersion=document.querySelector('meta[name="tp-build"]')?.content;
  if(info.version!==pageVersion)return {status:"Versionswechsel erkannt – erneut öffnen"};
  const base=new URL(".",controller.scriptURL),cacheName="itamapoke-"+info.version;
  let found=0;for(const file of info.files){if(typeof file!=="string")throw Error("Ungültige Liste");const url=new URL(file,base);if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname)||url.search||url.hash)throw Error("Ungültiger Pfad");const response=await bounded(caches.match(url.href,{cacheName,ignoreSearch:true}));if(response?.ok)found++;}
  return {status:found===info.files.length?"Vollständig":"Nicht vollständig",vorhanden:found,erwartet:info.files.length};
 }catch(_e){return {status:"Offline-Dienst nicht prüfbar"};}finally{port?.close();}
}
async function storageCheck(){if(!navigator.storage?.estimate)return null;try{const s=await bounded(navigator.storage.estimate());return {genutzt:Number.isFinite(s.usage)?s.usage:null,rahmen:Number.isFinite(s.quota)?s.quota:null};}catch(_e){return null;}}
function check(){if(pending)return pending;pending=(async()=>{try{const [spielstand,dateien,offline,speicher]=await Promise.all([saveCheck(),fileCheck(),offlineCheck(),storageCheck()]);checks={zeit:Date.now(),spielstand,dateien,offline,speicher};try{memory=typeof tpSpriteMemoryStats==="function"?{zeit:Date.now(),...tpSpriteMemoryStats()}:null;}catch(_e){memory=null;}}catch(e){record("probe",e);checks={zeit:Date.now(),status:"Prüfung nicht vollständig möglich"};}return state();})().finally(()=>{pending=null;});return pending;}
function report(){const s=state();return {format:"iTamaPoke-Diagnose-1",erstellt:new Date().toISOString(),...s,hinweis:"Momentaufnahme. Speicherbestätigungen und Fehler nur seit diesem App-Start. Keine Spielstandinhalte. Dateizahlen prüfen keine Dateiinhalte."};}
async function saveReport(){const bytes=JSON.stringify(report(),null,2),name="iTamaPoke-Diagnose-"+new Date().toISOString().replace(/[:.]/g,"-")+".json",blob=new Blob([bytes],{type:"application/json"});
 try{if(typeof File!=="undefined"&&navigator.canShare){const file=new File([blob],name,{type:"application/json"});if(navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"iTamaPoke-Diagnose"});return "Bericht an Teilen übergeben.";}}}catch(e){if(e?.name==="AbortError")return "Ausgabe abgebrochen.";}
 const a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.appendChild(a);try{a.click();}finally{setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},3000);}return "Bericht an Dateiausgabe übergeben.";
}

/* UI01 diagnostics: grouped technical display */
const diagnosticUiWords={"en": {"save": "Save", "files": "Files", "memory": "Memory", "system": "System", "check": "Check", "export": "Save report", "working": "Checking …", "done": "Check completed.", "notChecked": "Not checked", "notConfirmed": "Not confirmed since app start", "saveStatus": "Stored save", "lastSave": "Last confirmed save", "saveWarning": "Storage warning", "writeFailed": "Last recorded write failed", "offline": "Offline files", "offlineCount": "Offline inventory", "countOnly": "File counts only; no content check.", "used": "Website storage used", "quota": "Estimated storage quota", "unknown": "Unknown", "buffers": "Known graphics buffers", "objects": "Graphics objects", "notRam": "Graphics cache figures are not total RAM usage.", "version": "Version", "lastError": "Last recorded error", "noError": "None recorded since app start", "checkTime": "Check time", "performance": "Performance measurement", "measurement": "D3b – Pokédex comparison", "firstFrame": "Start to first app cycle", "notRated": "Not assessed", "p95": "Game drawing path P95", "noSamples": "No samples yet", "samples": "samples", "errors": "Errors", "note": "Snapshot. Save confirmations and errors apply only since this app start. No automatic repair or transfer.", "reportFailed": "Report could not be exported."}, "de": {"save": "Spielstand", "files": "Dateien", "memory": "Speicher", "system": "System", "check": "Prüfen", "export": "Bericht speichern", "working": "Prüfung läuft …", "done": "Prüfung abgeschlossen.", "notChecked": "Nicht geprüft", "notConfirmed": "Seit App-Start noch nicht bestätigt", "saveStatus": "Gespeicherter Spielstand", "lastSave": "Letzte bestätigte Speicherung", "saveWarning": "Speicherwarnung", "writeFailed": "Letzter erfasster Schreibversuch fehlgeschlagen", "offline": "Offline-Dateien", "offlineCount": "Offline-Bestand", "countOnly": "Nur Dateianzahl, keine Inhaltsprüfung.", "used": "Website-Speicher genutzt", "quota": "Geschätzter Speicherrahmen", "unknown": "Unbekannt", "buffers": "Bekannte Grafikpuffer", "objects": "Grafikobjekte", "notRam": "Grafikcache-Angaben sind kein Gesamt-RAM.", "version": "Version", "lastError": "Letzter erfasster Fehler", "noError": "Seit App-Start keiner erfasst", "checkTime": "Prüfzeit", "performance": "Leistungsmessung", "measurement": "D3b – Pokédex-Vergleich", "firstFrame": "Start bis erstem App-Durchlauf", "notRated": "Nicht bewertet", "p95": "Zeichenpfad im Spiel P95", "noSamples": "Noch keine Stichproben", "samples": "Stichproben", "errors": "Fehler", "note": "Momentaufnahme. Speicherbestätigungen und Fehler nur seit App-Start. Keine automatische Reparatur oder Übertragung.", "reportFailed": "Bericht konnte nicht ausgegeben werden."}, "es": {"save": "Partida", "files": "Archivos", "memory": "Memoria", "system": "Sistema", "check": "Comprobar", "export": "Guardar informe", "working": "Comprobando …", "done": "Comprobación completada.", "notChecked": "Sin comprobar", "notConfirmed": "Sin confirmar desde el inicio", "saveStatus": "Partida guardada", "lastSave": "Último guardado confirmado", "saveWarning": "Aviso de guardado", "writeFailed": "Falló el último intento registrado", "offline": "Archivos sin conexión", "offlineCount": "Inventario sin conexión", "countOnly": "Solo cantidades; no se verifica el contenido.", "used": "Almacenamiento usado", "quota": "Límite estimado", "unknown": "Desconocido", "buffers": "Búferes gráficos conocidos", "objects": "Objetos gráficos", "notRam": "La caché gráfica no representa toda la RAM.", "version": "Versión", "lastError": "Último error registrado", "noError": "Ninguno desde el inicio", "checkTime": "Hora de comprobación", "performance": "Medición de rendimiento", "measurement": "D3b – comparación Pokédex", "firstFrame": "Inicio hasta primer ciclo", "notRated": "Sin evaluar", "p95": "Dibujo del juego P95", "noSamples": "Aún sin muestras", "samples": "muestras", "errors": "Errores", "note": "Instantánea. Guardados y errores solo desde este inicio. Sin reparación ni transferencia automática.", "reportFailed": "No se pudo exportar el informe."}, "fr": {"save": "Sauvegarde", "files": "Fichiers", "memory": "Mémoire", "system": "Système", "check": "Vérifier", "export": "Enregistrer le rapport", "working": "Vérification …", "done": "Vérification terminée.", "notChecked": "Non vérifié", "notConfirmed": "Non confirmé depuis le démarrage", "saveStatus": "Partie enregistrée", "lastSave": "Dernière sauvegarde confirmée", "saveWarning": "Avertissement", "writeFailed": "Dernière écriture enregistrée en échec", "offline": "Fichiers hors ligne", "offlineCount": "Inventaire hors ligne", "countOnly": "Nombres uniquement ; contenu non vérifié.", "used": "Stockage utilisé", "quota": "Quota estimé", "unknown": "Inconnu", "buffers": "Tampons graphiques connus", "objects": "Objets graphiques", "notRam": "Le cache graphique ne représente pas toute la RAM.", "version": "Version", "lastError": "Dernière erreur enregistrée", "noError": "Aucune depuis le démarrage", "checkTime": "Heure de vérification", "performance": "Mesure des performances", "measurement": "D3b – comparaison Pokédex", "firstFrame": "Démarrage au premier cycle", "notRated": "Non évalué", "p95": "Dessin du jeu P95", "noSamples": "Aucun échantillon", "samples": "échantillons", "errors": "Erreurs", "note": "Instantané. Sauvegardes et erreurs depuis ce démarrage uniquement. Aucune réparation ni transmission automatique.", "reportFailed": "Impossible d’exporter le rapport."}};
/* UI01 diagnostics revision 2: readable instruments and full details */
const diagnosticRevisionWords={"en": {"details": "Details", "overview": "Overview", "graphics": "Graphics", "cries": "Cry files", "texts": "Text languages", "cache": "Graphics cache", "startShort": "Start", "samplesShort": "samples", "emptyValue": "—"}, "de": {"details": "Details", "overview": "Übersicht", "graphics": "Grafiken", "cries": "Rufdateien", "texts": "Textsprachen", "cache": "Grafikcache", "startShort": "Start", "samplesShort": "Messungen", "emptyValue": "—"}, "es": {"details": "Detalles", "overview": "Resumen", "graphics": "Gráficos", "cries": "Gritos", "texts": "Idiomas", "cache": "Caché gráfica", "startShort": "Inicio", "samplesShort": "muestras", "emptyValue": "—"}, "fr": {"details": "Détails", "overview": "Vue générale", "graphics": "Images", "cries": "Fichiers de cris", "texts": "Langues", "cache": "Cache graphique", "startShort": "Début", "samplesShort": "échantillons", "emptyValue": "—"}};
for(const code of ["en","de","es","fr"]){
 Object.assign(diagnosticUiWords[code],diagnosticRevisionWords[code]);
}

let diagnosticUiLocaleReady=false;
function diagnosticText(key){
 if(!diagnosticUiLocaleReady&&window.TPText?.registerLocale){
  for(const code of ["en","de","es","fr"]){
   TPText.registerLocale(code,Object.fromEntries(
    Object.entries(diagnosticUiWords[code]).map(([key,value])=>["diagnosticsPage."+key,value])
   ));
  }
  diagnosticUiLocaleReady=true;
 }
 return window.TPText?.t?TPText.t("diagnosticsPage."+key):diagnosticUiWords.en[key];
}
function diagnosticUiRows(s,errorLabel){
 const c=s.pruefung,groups={save:[],files:[],memory:[],system:[]};
 const add=(group,key,value,literal=false)=>groups[group].push({
  key,label:literal?key:diagnosticText(key),value:String(value)
 });
 const date=value=>new Date(value).toLocaleString(
  window.TPText?.language?TPText.language():"de-DE"
 );
 const mb=value=>Number.isFinite(value)?(value/1048576).toFixed(1)+" MB":diagnosticText("unknown");
 add("save","saveStatus",c?.spielstand?.status||diagnosticText("notChecked"));
 add("save","lastSave",s.letzteSpeicherung?date(s.letzteSpeicherung.zeit):diagnosticText("notConfirmed"));
 if(s.speicherergebnis==="Fehler")add("save","saveWarning",diagnosticText("writeFailed"));

 add("files","offline",c?.offline?.status||diagnosticText("notChecked"));
 if(Number.isFinite(c?.offline?.erwartet))
  add("files","offlineCount",c.offline.vorhanden+" / "+c.offline.erwartet);
 if(c?.dateien)for(const [key,value]of Object.entries(c.dateien))
  add("files",key,value===null?diagnosticText("notChecked"):String(value),true);
 add("files","countOnly",diagnosticText("countOnly"));

 if(c?.speicher){
  add("memory","used",mb(c.speicher.genutzt));
  add("memory","quota",mb(c.speicher.rahmen));
 }else add("memory","used",diagnosticText("notChecked"));
 if(s.grafikcache){
  add("memory","buffers",(s.grafikcache.bekanntePufferBytes/1048576).toFixed(2)+" MB");
  add("memory","objects",s.grafikcache.geladeneObjekte);
  add("memory","notRam",diagnosticText("notRam"));
 }

 add("system","version",s.version);
 add("system","lastError",s.fehler.length?errorLabel:diagnosticText("noError"));
 if(c?.zeit)add("system","checkTime",date(c.zeit));
 if(s.leistung){
  add("system","performance",diagnosticText("measurement"));
  add("system","firstFrame",s.leistung.startBisErstemDurchlaufMs===null?
   diagnosticText("notRated"):s.leistung.startBisErstemDurchlaufMs+" ms");
  const idle=s.leistung.messreihen["Zeichenpfad/idle"];
  add("system","p95",idle?idle.p95Ms+" ms · "+idle.fenster+" "+diagnosticText("samples"):
   diagnosticText("noSamples"));
 }
 return groups;
}
function diagnosticUiIcon(kind){
 const n=document.createElement("span");n.className="tp-diagnostic-icon";
 n.setAttribute("aria-hidden","true");
 const paths={
  save:'<path d="M3 3h14l4 4v14H3Zm4 0v7h10V3M7 21v-7h10v7"/>',
  files:'<path d="M2 6h8l2 3h10l-2 12H3ZM2 6V3h8l2 3h8v3"/>',
  memory:'<path d="M6 6h12v12H6Zm3-4v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M9 9h6v6H9Z"/>',
  system:'<path d="M3 3h18v18H3Zm2 10h4l2-6 3 10 2-5h3"/>',
  check:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Zm-5 10 3 3 7-7"/>',
  export:'<path d="M4 2h12l4 4v16H4Zm4 6h8m-8 4h8m-8 4h5"/>',
  details:'<circle cx="12" cy="12" r="9"/><path d="M12 10v8m0-12v1"/>',
  graphics:'<path d="M3 3h18v18H3Zm1 15 5-6 4 4 3-4 5 6"/><circle cx="8" cy="8" r="2"/>',
  cries:'<path d="M3 9h4l5-5v16l-5-5H3Zm13-2c4 3 4 7 0 10"/>',
  texts:'<path d="M3 3h8l1 2 1-2h8v17h-8l-1 2-1-2H3Zm9 2v17"/>'
 };
 n.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+paths[kind]+'</svg>';
 return n;
}

function diagnosticUiOverviewNumbers(s){
 const c=s.pruefung;
 const ratio=(value,total)=>Number.isFinite(value)&&value>=0&&
  Number.isFinite(total)&&total>0?Math.max(0,Math.min(1,value/total)):null;
 const number=value=>Number.isFinite(value)?value:null;
 const idle=s.leistung?.messreihen?.["Zeichenpfad/idle"];
 return {
  offlineRatio:ratio(c?.offline?.vorhanden,c?.offline?.erwartet),
  memoryRatio:ratio(c?.speicher?.genutzt,c?.speicher?.rahmen),
  graphics:number(c?.dateien?.Grafikdateien),
  cries:number(c?.dateien?.Rufdateien),
  texts:number(c?.dateien?.Textsprachen),
  used:number(c?.speicher?.genutzt),quota:number(c?.speicher?.rahmen),
  errors:s.fehler.length,
  start:number(s.leistung?.startBisErstemDurchlaufMs),
  p95:number(idle?.p95Ms),samples:number(idle?.fenster)
 };
}
function diagnosticOverview(s,groups,selected,make){
 const n=diagnosticUiOverviewNumbers(s);
 const view=make("div",undefined,"tp-diagnostic-overview tp-diag-"+selected);
 const empty=diagnosticText("emptyValue");
 const field=key=>groups[selected].find(row=>row.key===key)?.value||diagnosticText("notChecked");
 const mb=value=>value===null?diagnosticText("unknown"):(value/1048576).toFixed(1)+" MB";
 function meter(value){
  const track=make("div",undefined,"tp-diag-meter");
  track.setAttribute("aria-hidden","true");
  if(value!==null){
   const fill=make("span");fill.style.width=(value*100)+"%";track.append(fill);
  }else track.dataset.unknown="true";
  return track;
 }
 function labelValue(label,value,cls="tp-diag-instrument"){
  const card=make("div",undefined,cls);
  card.append(make("h3",label),make("p",value));return card;
 }
 if(selected==="save"){
  const card=make("div",undefined,"tp-diag-save-card");
  const copy=make("div");
  copy.append(make("h3",diagnosticText("saveStatus")),make("strong",field("saveStatus")));
  card.append(diagnosticUiIcon("save"),copy);
  const receipt=labelValue(diagnosticText("lastSave"),field("lastSave"),"tp-diag-save-receipt");
  view.append(card,receipt);
  const warning=groups.save.find(row=>row.key==="saveWarning");
  if(warning){
   const note=make("div",undefined,"tp-diag-save-warning");
   note.append(make("strong",warning.label),make("p",warning.value));
   view.append(note);
  }
 }else if(selected==="files"){
  const offline=labelValue(diagnosticText("offline"),field("offline"),"tp-diag-offline");
  const count=groups.files.find(row=>row.key==="offlineCount");
  if(count)offline.append(make("strong",count.value));
  offline.append(meter(n.offlineRatio));
  const counts=make("div",undefined,"tp-diag-file-counts");
  for(const [key,kind]of [["graphics","graphics"],["cries","cries"],["texts","texts"]]){
   const card=make("div",undefined,"tp-diag-file-counter");
   const top=make("div");
   top.append(diagnosticUiIcon(kind),make("strong",n[key]===null?empty:String(n[key])));
   card.append(top,make("span",diagnosticText(key)));counts.append(card);
  }
  view.append(offline,counts,make("p",diagnosticText("countOnly"),"tp-diag-caption"));
 }else if(selected==="memory"){
  const cell=make("div",undefined,"tp-diag-memory-cell");
  const top=make("div");
  top.append(diagnosticUiIcon("memory"),make("strong",n.used===null?empty:mb(n.used)));
  cell.append(top,make("span",diagnosticText("used")),
   make("p",diagnosticText("quota")+": "+mb(n.quota)),meter(n.memoryRatio));
  const cache=make("div",undefined,"tp-diag-cache");
  cache.append(make("h3",diagnosticText("cache")));
  if(s.grafikcache){
   const buffers=make("div"),objects=make("div");
   buffers.append(make("span",diagnosticText("buffers")),
    make("strong",(s.grafikcache.bekanntePufferBytes/1048576).toFixed(2)+" MB"));
   objects.append(make("span",diagnosticText("objects")),
    make("strong",String(s.grafikcache.geladeneObjekte)));
   cache.append(buffers,objects);
  }else cache.append(make("p",diagnosticText("notChecked")));
  cache.append(make("small",diagnosticText("notRam")));
  view.append(cell,cache);
 }else{
  const version=labelValue(diagnosticText("version"),field("version"),"tp-diag-version");
  version.dataset.diagnosticField="version";
  const errors=make("div",undefined,"tp-diag-errors");
  errors.dataset.hasErrors=String(n.errors>0);
  const errorTop=make("div");
  errorTop.append(diagnosticUiIcon("system"),make("span",diagnosticText("errors")),
   make("strong",String(n.errors)));
  errors.append(errorTop,make("p",field("lastError")));
  const performance=make("div",undefined,"tp-diag-performance");
  for(const [key,title,value]of [
   ["start","startShort",n.start],["p95","p95",n.p95]
  ]){
   const card=make("div");
   card.title=diagnosticText(key==="start"?"firstFrame":"p95");
   card.append(make("span",key==="p95"?"P95":diagnosticText(title)),
    make("strong",value===null?empty:value+" ms"));
   if(key==="p95")card.append(make("small",
    n.samples===null?diagnosticText("noSamples"):n.samples+" "+diagnosticText("samplesShort")));
   performance.append(card);
  }
  view.append(version,errors,performance);
 }
 return view;
}

function mount(host,alive){
 const make=(tag,text,cls)=>{
  const n=document.createElement(tag);
  if(text!==undefined)n.textContent=text;
  if(cls)n.className=cls;
  return n;
 };
 let selected="save",snapshot=null,groups=null,showDetails=false;
 const frame=make("div",undefined,"tp-admin-frame");
 frame.setAttribute("aria-hidden","true");
 for(const cls of ["tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right","tp-pokedex-spine"])
  frame.append(make("span",undefined,cls));

 const body=make("div",undefined,"tp-admin-body");
 const left=make("div",undefined,"tp-admin-column");
 const right=make("div",undefined,"tp-admin-column");
 const categories=make("div",undefined,"tp-diagnostic-categories");
 const values=make("div",undefined,"tp-diagnostic-values");
 values.tabIndex=0;
 left.append(categories);right.append(values);body.append(left,right);

 const actions=make("div",undefined,"tp-diagnostic-toolbar");
 const status=make("p","","tp-diagnostic-status");
 status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const run=make("button",diagnosticText("check"));
 const save=make("button",diagnosticText("export"));
 const detailsButton=make("button",diagnosticText("details"));
 detailsButton.dataset.diagnosticDetails="";
 run.type=save.type=detailsButton.type="button";
 run.dataset.diagnosticCheck="";save.dataset.diagnosticExport="";
 for(const [button,key]of [[run,"check"],[save,"export"],[detailsButton,"details"]]){
  button.title=diagnosticText(key);button.setAttribute("aria-label",diagnosticText(key));
  button.append(diagnosticUiIcon(key));
 }
 actions.append(status,run,save,detailsButton);
 detailsButton.addEventListener("click",()=>{showDetails=!showDetails;renderDetails();});
 const note=make("p",diagnosticText("note"),"tp-diagnostic-note");
 const buttons={};
 for(const key of ["save","files","memory","system"]){
  const button=make("button");button.type="button";
  button.dataset.diagnosticCategory=key;
  const caption=make("span",diagnosticText(key));
  const summary=make("small");
  button.append(diagnosticUiIcon(key),caption,summary);
  button.addEventListener("click",()=>{selected=key;showDetails=false;renderDetails();});
  categories.append(button);buttons[key]={button,summary};
 }
 host.append(frame,actions,body,note);

 function renderDetails(){
  if(!alive()||!groups)return;
  host.dataset.diagnosticView=selected;
  for(const [key,item]of Object.entries(buttons))
   item.button.setAttribute("aria-pressed",String(key===selected));
  values.setAttribute("aria-label",diagnosticText(selected));
  values.dataset.diagnosticMode=showDetails?"details":"overview";
  detailsButton.setAttribute("aria-pressed",String(showDetails));
  const detailLabel=diagnosticText(showDetails?"overview":"details");
  detailsButton.setAttribute("aria-label",detailLabel);detailsButton.title=detailLabel;
  values.replaceChildren();
  if(!showDetails){
   values.append(diagnosticOverview(snapshot,groups,selected,make));return;
  }
  for(const item of groups[selected]){
   const row=make("section",undefined,"tp-diagnostic-row");
   row.dataset.diagnosticField=item.key;
   row.append(make("h3",item.label),make("p",item.value));values.append(row);
  }
 }
 function render(){
  if(!alive())return;
  snapshot=state();
  const latest=snapshot.fehler[snapshot.fehler.length-1];
  const errorLabel=latest?(labels[latest.code]||diagnosticText("unknown")):"";
  groups=diagnosticUiRows(snapshot,errorLabel);
  buttons.save.summary.textContent=snapshot.pruefung?.spielstand?.status||diagnosticText("notChecked");
  buttons.files.summary.textContent=snapshot.pruefung?.offline?.status||diagnosticText("notChecked");
  buttons.memory.summary.textContent=Number.isFinite(snapshot.pruefung?.speicher?.genutzt)?
   (snapshot.pruefung.speicher.genutzt/1048576).toFixed(1)+" MB":diagnosticText("notChecked");
  buttons.system.summary.textContent=diagnosticText("errors")+" "+snapshot.fehler.length;
  buttons.system.button.dataset.hasErrors=String(snapshot.fehler.length>0);
  renderDetails();
 }
 async function refresh(){
  run.disabled=save.disabled=true;
  status.textContent=diagnosticText("working");
  try{
   await check();
   if(!alive())return;
   render();status.textContent=diagnosticText("done");
  }finally{
   if(alive())run.disabled=save.disabled=false;
  }
 }
 run.addEventListener("click",refresh);
 save.addEventListener("click",()=>{
  saveReport().then(text=>{if(alive())status.textContent=text;}).catch(e=>{
   record("report",e);
   if(alive()){render();status.textContent=diagnosticText("reportFailed");}
  });
 });
 render();refresh();
}

window.addEventListener("error",e=>record("runtime",e.error),true);window.addEventListener("unhandledrejection",e=>record("promise",e.reason));
window.TPDiagnostics=Object.freeze({saved,record,check,state,report,saveReport,mount});
})();
