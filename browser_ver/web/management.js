// Package B: local snapshots and validated asset import. No network service.
(function(){
"use strict";
const T=TPStoreTools;let busy=false,dbPromise=null,previousFocus=null,viewId=0;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const button=(text,fn)=>{const b=el("button",text);b.type="button";b.addEventListener("click",()=>Promise.resolve().then(fn).catch(error));return b;};
const error=e=>{window.TPDiagnostics?.record("manager",e);console.error("[manager]",e);alert(e&&e.message?e.message:String(e));};
function loaded(){return !!Module&&typeof fns.speciesId==="function";}
function safe(){return loaded()&&!window.TPCollectionGame?.dialogOpen&&!tpSaveReplacing&&!["game","gamemenu","battle","keyboard","league"].includes(screen)&&!fns.evolvingNow()&&!fns.ceremony()&&!fns.wildPromptActive();}
function openDB(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open("itamapoke-management",1);r.onupgradeneeded=()=>{r.result.createObjectStore("snapshots",{keyPath:"id"});r.result.createObjectStore("assetInfo");};r.onsuccess=()=>resolve(r.result);r.onerror=()=>{dbPromise=null;reject(r.error);};});return dbPromise;}
async function getAll(store){const db=await openDB();return new Promise((resolve,reject)=>{const r=db.transaction(store,"readonly").objectStore(store).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);});}
async function put(store,key,value){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readwrite");tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error("Speichertransaktion abgebrochen."));if(key===null)tx.objectStore(store).put(value);else tx.objectStore(store).put(value,key);});}
async function remove(store,key){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readwrite");tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error("Loeschen abgebrochen."));tx.objectStore(store).delete(key);});}
function build(){return document.querySelector('meta[name="tp-build"]')?.content||"local";}
function species(summary){if(summary.dex<0)return "Ei";const m=TP_DEX_META[summary.dex-1];return m?(m.names.de||m.names.en):"#"+summary.dex;}
function summaryText(s){return species(s)+" · Level "+s.level+" · Aufgezogen "+s.raised+" · Gefangen "+s.caught;}
function uid(){return String(Date.now())+"-"+Array.from(crypto.getRandomValues(new Uint8Array(8)),n=>n.toString(16).padStart(2,"0")).join("");}
let snapshotQueue=Promise.resolve();
function snapshot(raw,kind){
 const task=async()=>{const parsed=T.parseLegacy(raw);const record={id:uid(),createdAt:Date.now(),schema:1,build:build(),kind,raw:parsed.raw,summary:parsed.summary,sha256:await T.digest(parsed.raw)};await put("snapshots",null,record);
  if(kind==="auto"){const autos=(await getAll("snapshots")).filter(x=>x.kind==="auto").sort((a,b)=>b.createdAt-a.createdAt);for(const old of autos.slice(8))await remove("snapshots",old.id);}
  return record;};
 const promise=snapshotQueue.then(task);snapshotQueue=promise.catch(()=>{});return promise;
}
const style=el("style");style.textContent=`.tp-manager-status{white-space:pre-wrap;overflow-wrap:anywhere}.tp-tools button{font-size:13px;padding:7px;min-height:44px}.tp-progress{width:100%;height:22px}.tp-panel input[type=file]{display:none}.tp-panel textarea{width:100%;box-sizing:border-box;min-height:120px}`;document.head.appendChild(style);
const overlay=el("div",undefined,"tp-modal");overlay.hidden=true;const panel=el("section",undefined,"tp-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-labelledby","tp-manager-title");overlay.appendChild(panel);document.body.appendChild(overlay);
function close(){if(busy)return;viewId++;overlay.hidden=true;document.body.style.overflow="";if(previousFocus?.focus)previousFocus.focus();}
function begin(title){if(busy)throw Error("Bitte laufenden Vorgang abwarten.");if(!safe())throw Error("Bitte erst Kampf, Minispiel oder Animation beenden.");viewId++;previousFocus=document.activeElement;panel.replaceChildren();const row=el("div",undefined,"tp-modal-head");const h=el("h2",title);h.id="tp-manager-title";const exit=button("Schliessen",close);row.append(h,exit);panel.appendChild(row);overlay.hidden=false;document.body.style.overflow="hidden";dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;exit.focus();}
overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
overlay.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();close();return;}if(e.key!=="Tab")return;const nodes=Array.from(panel.querySelectorAll("button:not(:disabled),input:not([type=file]),select,textarea")).filter(n=>!n.hidden);const a=nodes[0],b=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();b?.focus();}else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a?.focus();}});
const bar=document.querySelector(".tp-tools");const savesButton=button("Sicherungen",openSaves),assetsButton=button("Dateien",openAssets);bar.append(savesButton,assetsButton);
setInterval(()=>{savesButton.disabled=assetsButton.disabled=!safe()||busy;},1000);
function note(text){panel.appendChild(el("p",text,"tp-small"));}
function download(data,name,mime="application/octet-stream"){const blob=new Blob([data],{type:mime});const a=el("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},3000);}
async function shareSave(raw,wrapped,createdAt){
 const data=wrapped?await T.seal(raw,{createdAt:createdAt||new Date().toISOString(),build:build()}):T.parseLegacy(raw).raw;
 const stamp=new Date().toISOString().replace(/[:.]/g,"-");const name="iTamaPoke-"+(wrapped?"v1-":"klassisch-")+stamp+".tpsave";
 const blob=new Blob([data],{type:"application/octet-stream"}),file=new File([blob],name,{type:"application/octet-stream"});
 try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"iTamaPoke-Sicherung"});return;}}catch(e){if(e?.name==="AbortError")return;}
 download(data,name);
}
async function exportCurrent(wrapped=false){if(!safe()||busy)throw Error("Spiel bitte erst in einen ruhigen Zustand bringen.");const raw=exportStateBytes(Module);T.parseLegacy(raw);await writeSave(raw);await shareSave(raw,wrapped);}
async function replaceSave(decoded,label){
 if(busy||!safe())throw Error("Spiel ist gerade beschaeftigt.");
 busy=true;tpSaveReplacing=true;
 try{
  const current=exportStateBytes(Module);T.parseLegacy(current);
  await snapshot(current,"before-import");
  // Force is used only after the safety backup has committed.
  await writeSave(decoded.raw,true);
  Module=null;window.location.reload();
 }catch(e){busy=false;tpSaveReplacing=false;throw e;}
}
async function previewImport(decoded,label){
 begin("Spielstand-Vorschau");panel.appendChild(el("p",label));panel.appendChild(el("h3",summaryText(decoded.summary)));note("Format: "+decoded.format);
 if(decoded.metadata?.createdAt)note("Exportdatum: "+String(decoded.metadata.createdAt));
 note("Vor dem Ersetzen wird der aktuelle Spielstand lokal gesichert. Scheitert diese Sicherung, wird nicht importiert. Grafiken und Rufe werden nicht mitgesichert.");
 panel.appendChild(button("Importieren und aktuellen Stand ersetzen",async()=>{if(!confirm("Diesen Spielstand wirklich laden? Der aktuelle Stand wird vorher gesichert."))return;await replaceSave(decoded,label);}));
 panel.appendChild(button("Abbrechen",close));
}
async function importFile(file){if(file.size>2*1024*1024+16396)throw Error("Sicherungsdatei zu gross.");const decoded=await T.decode(await file.arrayBuffer());await previewImport(decoded,file.name);}
async function resetGame(){
 if(!safe()||busy)throw Error("Spiel ist gerade beschaeftigt.");
 if(!confirm("Neues Spiel starten? Der aktuelle Stand wird vorher lokal gesichert; Grafiken bleiben erhalten."))return;
 if(!confirm("Wirklich mit neuem Ei und neuer Sammlung starten?"))return;
 busy=true;tpSaveReplacing=true;
 try{
  await snapshot(exportStateBytes(Module),"before-reset");const db=await openDb();
  await new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,"readwrite");tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error("Reset abgebrochen."));tx.objectStore(STORE_NAME).delete(SAVE_KEY);});
  Module=null;window.location.reload();
 }catch(e){busy=false;tpSaveReplacing=false;throw e;}
}
async function openSaves(){
 begin("Sicherungen");const tpPage=window.TPPerformance?.begin();const view=viewId;const now=T.parseLegacy(exportStateBytes(Module));panel.appendChild(el("p",summaryText(now.summary)));
 note("Bis zu 8 automatische Sicherungen. Manuelle und Sicherheitskopien vor Import/Reset bleiben bis zum gezielten Loeschen erhalten. Alles liegt nur in diesem Browser: externe Exporte bleiben wichtig.");
 const row=el("div",undefined,"tp-modal-row");row.append(button("Jetzt lokal sichern",async()=>{await snapshot(exportStateBytes(Module),"manual");await openSaves();}),button("Klassisch exportieren",()=>exportCurrent(false)),button("Version 1 exportieren",()=>exportCurrent(true)));panel.appendChild(row);
 note("Version 1 enthaelt Metadaten und eine SHA-256-Pruefsumme. Aeltere App-Versionen benoetigen den klassischen Export. Beide enthalten nur den Spielstand, keine Dateien.");
 const file=el("input");file.type="file";file.accept=".tpsave,.bin";file.addEventListener("change",()=>{const f=file.files[0];file.value="";if(f)importFile(f).catch(error);});panel.appendChild(file);panel.appendChild(button("Sicherung aus Datei laden",()=>file.click()));
 const records=(await getAll("snapshots")).sort((a,b)=>b.createdAt-a.createdAt);if(view!==viewId)return;
 const labels={auto:"Automatisch",manual:"Manuell","before-import":"Vor Import","before-reset":"Vor Reset"};
 for(const record of records){
  const card=el("article",undefined,"tp-card");let decoded;
  try{if(record.sha256&&await T.digest(record.raw)!==record.sha256)throw Error("Lokale Pruefsumme stimmt nicht.");decoded=await T.decode(record.raw);}catch(e){card.appendChild(el("p","Beschaedigte lokale Sicherung: "+e.message));}
  if(view!==viewId)return;card.appendChild(el("h3",(labels[record.kind]||record.kind)+" · "+new Date(record.createdAt).toLocaleString()));
  if(decoded){card.appendChild(el("p",summaryText(decoded.summary)));const actions=el("div",undefined,"tp-modal-row");actions.append(button("Vorschau / Wiederherstellen",()=>previewImport(decoded,"Lokale Sicherung vom "+new Date(record.createdAt).toLocaleString())),button("Exportieren",()=>shareSave(decoded.raw,true,new Date(record.createdAt).toISOString())));card.appendChild(actions);}
  card.appendChild(button("Diese Sicherung loeschen",async()=>{if(!confirm("Nur diese lokale Sicherung loeschen?"))return;await remove("snapshots",record.id);await openSaves();}));panel.appendChild(card);
 }
 if(!records.length)note("Noch keine lokalen Sicherungskopien vorhanden.");if(view===viewId)window.TPPerformance?.page("saves",tpPage);
}
async function allKeys(db,store){return new Promise((resolve,reject)=>{const r=db.transaction(store,"readonly").objectStore(store).getAllKeys();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);});}
async function read(db,store,key){return new Promise((resolve,reject)=>{const r=db.transaction(store,"readonly").objectStore(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function write(db,store,key,value){return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readwrite");tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error("Datei-Speicherung abgebrochen."));tx.objectStore(store).put(value,key);});}
async function inventory(){
 const a=await openAssetDb(),c=await openCryDb(),t=await openDexEntryDb();
 try{return {sprites:await allKeys(a,ASSET_STORE),cries:await allKeys(c,CRY_STORE),text:await allKeys(t,DEXENTRY_STORE),info:await getAll("assetInfo")};}finally{a.close();c.close();t.close();}
}
function spriteIndex(keys){const out=new Set();for(const key of keys){const m=T.canonicalSprite(String(key));if(m&&!m.trainer&&!m.atlas&&!m.form)out.add(m.key);}return out;}
function missing(index,shiny){const out=[];for(let i=1;i<=1025;i++){const key=(shiny?"ps":"p")+String(i).padStart(3,"0")+".bin";if(!index.has(key))out.push(key);}return out;}
function progress(title){begin(title);const p=el("progress",undefined,"tp-progress");p.max=1;p.value=0;const text=el("p","Vorbereitung…","tp-manager-status");panel.append(p,text);return {p,text};}
async function validateInventory(){
 const ui=progress("Grafik-Bestand pruefen");busy=true;let db;let good=0,bad=0,single=0;const issues=[];
 try{db=await openAssetDb();const keys=await allKeys(db,ASSET_STORE);ui.p.max=Math.max(1,keys.length);
  for(let i=0;i<keys.length;i++){const key=String(keys[i]),m=T.canonicalSprite(key);if(!m){issues.push(key+": unbekannter Dateiname");continue;}
   let result;try{const raw=await read(db,ASSET_STORE,keys[i]);result=m.trainer?await TPTrainerArt.inspect(raw,m.leader):m.atlas?T.inspectThumbs(raw):T.inspectSprite(raw);good++;if(result.kind==="single-frame")single++;}catch(e){result={valid:false,kind:"invalid",error:e.message};bad++;issues.push(key+": "+e.message);}
   const {png,...indexResult}=result;await put("assetInfo",key,{key,...indexResult,checkedAt:Date.now()});ui.p.value=i+1;ui.text.textContent=(i+1)+" / "+keys.length+" geprueft";
   if(i%10===0)await new Promise(r=>setTimeout(r,0));
  }
  ui.text.textContent="Gueltig: "+good+" · Fehler: "+bad+" · Einzelbild-Grafiken: "+single;
  note("Einzelbild-Grafik bedeutet: jede Aktion hat einen Frame. Das beweist nicht, woher die Grafik stammt.");
  for(const issue of issues.slice(0,30))note(issue);
  if(issues.length)panel.appendChild(button("Fehlerbericht exportieren",()=>download(issues.join("\n"),"iTamaPoke-Assetfehler.txt","text/plain")));
 }finally{busy=false;if(db)db.close();}
 panel.appendChild(button("Zur Dateiübersicht",openAssets));
}
async function importAssets(kind,files,onlyMissing=false){
 if(!files.length)return;const ui=progress("Dateien importieren");busy=true;
 let db;
 const store=kind==="sprites"?ASSET_STORE:kind==="cries"?CRY_STORE:DEXENTRY_STORE;
 let imported=0,skipped=0,failed=0,trainerImported=0,trainerSkipped=0,trainerFailed=0;const errors=[];
 try{
  db=kind==="sprites"?await openAssetDb():kind==="cries"?await openCryDb():await openDexEntryDb();
  const existing=new Set(await allKeys(db,store));const info=new Map((await getAll("assetInfo")).map(x=>[x.key,x]));ui.p.max=files.length;
  if(kind==="sprites"&&window.TPTrainerArt){const trainers=files.filter(f=>TPTrainerArt.looksLike(f.name));if(trainers.length){try{
   const result=await TPTrainerArt.importBatch(db,store,trainers,{onlyMissing,readExisting:key=>read(db,store,key)});trainerImported=result.saved;trainerSkipped=result.skipped;imported+=result.saved;skipped+=result.skipped;
   for(const item of result.items){try{await put("assetInfo",item.key,{key:item.key,valid:true,kind:"trainer",leader:item.leader,width:item.width,height:item.height,metadata:item.metadata,checkedAt:Date.now()});}catch(_){note("Leitergrafik gespeichert; Zusatzindex nicht aktualisiert. Angaben bleiben im BIN.");}}
   if(result.saved||result.skipped)window.TPArena?.invalidatePortraits?.();
  }catch(e){trainerFailed=trainers.length;failed+=trainers.length;errors.push("Leiterpaket nicht uebernommen: "+e.message);}}}
  for(let i=0;i<files.length;i++){
   const file=files[i];if(kind==="sprites"&&window.TPTrainerArt?.looksLike(file.name)){ui.p.value=i+1;continue;}let key,raw,details;
   try{
    if(kind==="sprites"){
     const m=T.canonicalSprite(file.name);if(!m)throw Error("Kein unterstuetzter Grafik-/Atlasname (1–1025).");key=m.key;
     if(onlyMissing&&existing.has(key)&&info.get(key)?.valid!==false){skipped++;continue;}
     if(file.size>16*1024*1024)throw Error("Datei groesser als 16 MB.");raw=await file.arrayBuffer();details=m.atlas?T.inspectThumbs(raw):T.inspectSprite(raw);
    }else if(kind==="cries"){
     const m=/^psnd(\d{1,4})\.(m4a|mp3|wav|ogg)$/i.exec(file.name);if(!m||+m[1]<1||+m[1]>1025)throw Error("Kein unterstuetzter Ruf-Dateiname.");
     key="psnd"+String(+m[1]).padStart(3,"0")+"."+m[2].toLowerCase();if(onlyMissing&&existing.has(key)){skipped++;continue;}
     if(file.size<1||file.size>16*1024*1024)throw Error("Ruf leer oder zu gross.");raw=await file.arrayBuffer();
    }else{
     const m=/^dex_entries_([a-z]{2})\.txt$/i.exec(file.name);if(!m)throw Error("Name muss dex_entries_<sprache>.txt sein.");key=m[1].toLowerCase();if(onlyMissing&&existing.has(key)){skipped++;continue;}
     if(file.size>4*1024*1024)throw Error("Textdatei zu gross.");raw=await file.text();const table=parseDexEntryText(raw);if(!Object.keys(table).some(d=>+d>=1&&+d<=1025))throw Error("Keine gueltigen Dex-Texte gefunden.");
    }
    await write(db,store,key,raw);existing.add(key);imported++;
    if(details)await put("assetInfo",key,{key,...details,checkedAt:Date.now()});
   }catch(e){failed++;errors.push(file.name+": "+e.message);}
   finally{ui.p.value=i+1;ui.text.textContent=(i+1)+" / "+files.length+" · Importiert "+imported+" · Uebersprungen "+skipped+" · Fehler "+failed;}
   if(i%5===0)await new Promise(r=>setTimeout(r,0));
  }
  if(kind==="sprites"){spriteCache.clear();spriteLoading.clear();currentDex=0;loadingDex=-1;await refreshThumbs();}
  if(kind==="cries"){stopCry();cryBufferCache.clear();await refreshCryIndex();}
  if(kind==="text")dexEntryCache={};
  ui.text.textContent="Importiert "+imported+" (Leiter "+trainerImported+") · Uebersprungen "+skipped+" · Nicht uebernommen "+failed;
  for(const line of errors.slice(0,30))note(line);
  if(errors.length)panel.appendChild(button("Importbericht exportieren",()=>download(errors.join("\n"),"iTamaPoke-Importfehler.txt","text/plain")));
  if(kind==="cries")note("Audio-Dateinamen und Dateigroesse wurden geprueft. Die Abspielbarkeit wird erst beim Dekodieren in der Wiedergabe festgestellt.");
  if(kind==="sprites")note("Leiter: "+trainerImported+" gespeichert · "+trainerSkipped+" uebersprungen · "+trainerFailed+" nicht uebernommen. Leiterpakete sind atomar. Pokemon-/Atlasdateien behalten die bisherige Einzeldatei-Regel.");
  else note("Gueltige Dateien wurden einzeln gespeichert; Fehler bei anderen Dateien rollen sie nicht zurueck.");
 }finally{if(db)db.close();busy=false;}
 panel.appendChild(button("Zur Dateiübersicht",openAssets));return imported;
}
async function openAssets(){
 begin("Dateiverwaltung");const tpPage=window.TPPerformance?.begin();const view=viewId;const inv=await inventory();if(view!==viewId)return;const index=spriteIndex(inv.sprites),normal=missing(index,false),shiny=missing(index,true);
 panel.appendChild(el("p","Normal: "+(1025-normal.length)+" / 1025 · Schillernd: "+(1025-shiny.length)+" / 1025"));
 note("Diese Zahlen zaehlen vorhandene Dateinamen. Erst 'Bestand pruefen' kontrolliert alle gespeicherten Grafik-Dateien.");
 note("Leiterdateien: "+inv.sprites.filter(k=>!!window.TPTrainerArt?.canonical(k)).length+" / 8. Rechte je Datei pruefen.");
 const checked=inv.info.filter(x=>inv.sprites.includes(x.key)&&x.kind!=="trainer"),single=checked.filter(x=>x.valid&&x.kind==="single-frame").length;
 note("Letzte Pruefergebnisse: "+checked.length+" Dateien · "+checked.filter(x=>!x.valid).length+" Fehler · "+single+" Einzelbild-Grafiken. Herkunft/Originalanimation ist daraus nicht sicher ableitbar.");
 const cryIDs=new Set(inv.cries.map(k=>/^psnd(\d{1,4})\./i.exec(String(k))).filter(Boolean).map(m=>+m[1]));
 note("Rufe fuer "+cryIDs.size+" Arten (nicht auf Abspielbarkeit geprueft). Textsprachen: "+(inv.text.join(", ")||"keine")+".");
 panel.appendChild(button("Grafik-Bestand pruefen",validateInventory));
 panel.appendChild(button("Liste fehlender Grafiken exportieren",()=>download(normal.concat(shiny).join("\n"),"iTamaPoke-fehlende-Grafiken.txt","text/plain")));
 const only=el("input");only.type="checkbox";only.checked=true;const label=el("label");label.append(only,document.createTextNode("Nur fehlende Dateien importieren (bekannt fehlerhafte Grafiken werden ersetzt)"));panel.appendChild(label);
 for(const [kind,labelText,accept] of [["sprites","Grafiken / Atlas laden",".bin"],["cries","Rufe laden",".m4a,.mp3,.wav,.ogg"],["text","Dex-Texte laden",".txt"]]){
  const input=el("input");input.type="file";input.multiple=true;input.accept=accept;input.addEventListener("change",()=>{const files=Array.from(input.files||[]);input.value="";if(files.length)importAssets(kind,files,only.checked).catch(error);});panel.appendChild(input);panel.appendChild(button(labelText,()=>input.click()));
 }
 if(navigator.storage?.estimate){try{const s=await navigator.storage.estimate();note("Browser-Speicher (geschaetzt): "+Math.round((s.usage||0)/1048576)+" MB genutzt von "+Math.round((s.quota||0)/1048576)+" MB.");}catch(_e){}}
 note("Dateien bleiben lokal; keine Downloads aus dem Netz, keine NAS-Anbindung. Die Sicherungsdateien enthalten diese Dateien nicht.");if(view===viewId)window.TPPerformance?.page("assets",tpPage);
}
let lastAuto=0,autoWarning=false;
async function autoSave(){if(!safe()||busy||tpSaveReplacing||Date.now()-lastAuto<10*60*1000)return;try{await snapshot(exportStateBytes(Module),"auto");lastAuto=Date.now();}catch(e){console.warn("[backup]",e);if(!autoWarning){autoWarning=true;savesButton.textContent="Sicherung pruefen";}}}
setTimeout(autoSave,5000);setInterval(autoSave,60000);
window.TPManager={openSaves,openAssets,importFile,importAssets,exportCurrent,resetGame};
})();
