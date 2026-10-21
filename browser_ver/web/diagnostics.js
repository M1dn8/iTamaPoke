// D2: local, bounded, content-free diagnostic snapshots. No telemetry.
(function(){
"use strict";
const labels={read:"Spielstand konnte nicht gelesen werden",write:"Speicherung fehlgeschlagen",frame:"Fehler beim Zeichnen",manager:"Verwaltungsfehler",runtime:"Laufzeitfehler",promise:"Unbehandelter Vorgang",probe:"Diagnoseprüfung fehlgeschlagen",report:"Bericht konnte nicht ausgegeben werden"};
const allowedNames=new Set(["QuotaExceededError","AbortError","SecurityError","InvalidStateError","NotAllowedError","DataError","UnknownError","TypeError","RangeError","SyntaxError","Error"]);
let lastSave=null,lastOutcome=null,errors=[],checks=null,pending=null;
function record(code,error){try{if(!Object.prototype.hasOwnProperty.call(labels,code))code="runtime";let name="Unbekannt";try{if(allowedNames.has(error?.name))name=error.name;}catch(_e){}const now=Date.now(),last=errors[errors.length-1];if(last&&last.code===code&&last.art===name&&now-last.zeit<5000){last.anzahl++;last.zeit=now;}else{errors.push({code,art:name,zeit:now,anzahl:1});errors=errors.slice(-20);}if(code==="write")lastOutcome="Fehler";}catch(_e){}}
function saved(bytes){try{lastSave={zeit:Date.now(),bytes:Number.isFinite(bytes)?Math.max(0,bytes):0};lastOutcome="Bestätigt";}catch(_e){}}
function version(){const s=document.querySelector('meta[name="tp-build"]')?.content||"";return /^[a-f0-9]{7,40}$/i.test(s)?s:"lokal";}
function state(){return JSON.parse(JSON.stringify({version:version(),letzteSpeicherung:lastSave,speicherergebnis:lastOutcome,pruefung:checks,fehler:errors}));}
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
function check(){if(pending)return pending;pending=(async()=>{try{const [spielstand,dateien,offline,speicher]=await Promise.all([saveCheck(),fileCheck(),offlineCheck(),storageCheck()]);checks={zeit:Date.now(),spielstand,dateien,offline,speicher};}catch(e){record("probe",e);checks={zeit:Date.now(),status:"Prüfung nicht vollständig möglich"};}return state();})().finally(()=>{pending=null;});return pending;}
function report(){const s=state();return {format:"iTamaPoke-Diagnose-1",erstellt:new Date().toISOString(),...s,hinweis:"Momentaufnahme. Speicherbestätigungen und Fehler nur seit diesem App-Start. Keine Spielstandinhalte. Dateizahlen prüfen keine Dateiinhalte."};}
async function saveReport(){const bytes=JSON.stringify(report(),null,2),name="iTamaPoke-Diagnose-"+new Date().toISOString().replace(/[:.]/g,"-")+".json",blob=new Blob([bytes],{type:"application/json"});
 try{if(typeof File!=="undefined"&&navigator.canShare){const file=new File([blob],name,{type:"application/json"});if(navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"iTamaPoke-Diagnose"});return "Bericht an Teilen übergeben.";}}}catch(e){if(e?.name==="AbortError")return "Ausgabe abgebrochen.";}
 const a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.appendChild(a);try{a.click();}finally{setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},3000);}return "Bericht an Dateiausgabe übergeben.";
}
function mount(host,alive){
 const make=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 const values=make("div"),actions=make("div"),note=make("p","Momentaufnahme. Speicherung und Fehler: nur seit diesem App-Start. Keine automatische Reparatur oder Übertragung."),status=make("p");values.className="tp-app-list";values.tabIndex=0;values.setAttribute("aria-label","Diagnosewerte");actions.className="tp-diagnostic-actions";note.className="tp-small";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const run=make("button","Prüfen"),save=make("button","Bericht speichern");run.type=save.type="button";actions.append(run,save);host.append(values,note,actions,status);
 function row(label,value){const p=make("p");p.append(make("strong",label+": "),document.createTextNode(value));values.appendChild(p);}
 function render(){if(!alive())return;values.replaceChildren();const s=state(),c=s.pruefung;row("Version",s.version);row("Spielstand",c?.spielstand?.status||"Nicht geprüft");row("Letzte bestätigte Speicherung",s.letzteSpeicherung?new Date(s.letzteSpeicherung.zeit).toLocaleString("de-DE"):"Seit App-Start noch nicht bestätigt");if(s.speicherergebnis==="Fehler")row("Speicherwarnung","Letzter erfasster Schreibversuch fehlgeschlagen");row("Offline-Dateien",c?.offline?.status||"Nicht geprüft");if(Number.isFinite(c?.offline?.erwartet))row("Offline-Bestand",c.offline.vorhanden+" / "+c.offline.erwartet);if(c?.dateien)for(const [key,value]of Object.entries(c.dateien))row(key,value===null?"Nicht prüfbar":String(value));row("Dateiprüfung","Nur Anzahl, keine Inhaltsprüfung");if(c?.speicher){const mb=v=>v===null?"unbekannt":(v/1048576).toFixed(1)+" MB";row("Speicher dieser Website (Schätzung)",mb(c.speicher.genutzt)+" genutzt; Rahmen "+mb(c.speicher.rahmen));}row("Letzter erfasster Fehler",s.fehler.length?labels[s.fehler[s.fehler.length-1].code]:"Seit App-Start keiner erfasst");if(c?.zeit)row("Prüfzeit",new Date(c.zeit).toLocaleString("de-DE"));}
 async function refresh(){run.disabled=save.disabled=true;status.textContent="Prüfung läuft …";await check();if(!alive())return;render();run.disabled=save.disabled=false;status.textContent="Prüfung abgeschlossen.";}
 run.addEventListener("click",refresh);save.addEventListener("click",()=>{saveReport().then(text=>{if(alive())status.textContent=text;}).catch(e=>{record("report",e);if(alive()){render();status.textContent="Bericht konnte nicht ausgegeben werden.";}});});render();refresh();
}
window.addEventListener("error",e=>record("runtime",e.error),true);window.addEventListener("unhandledrejection",e=>record("promise",e.reason));
window.TPDiagnostics=Object.freeze({saved,record,check,state,report,saveReport,mount});
})();
