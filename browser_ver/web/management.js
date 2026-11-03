// Package B: local snapshots and validated asset import. No network service.
(function(){
"use strict";
const T=TPStoreTools;let busy=false,dbPromise=null,previousFocus=null,viewId=0;
let assetPauseRequested=false,assetImportRunning=false;
document.addEventListener("visibilitychange",()=>{if(assetImportRunning&&document.visibilityState!=="visible")assetPauseRequested=true;});
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
const overlay=el("div",undefined,"tp-modal");overlay.hidden=true;const panel=el("section",undefined,"tp-panel");panel.id="tp-manager-panel";panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-labelledby","tp-manager-title");overlay.appendChild(panel);document.body.appendChild(overlay);
function close(){if(busy)return;viewId++;overlay.hidden=true;document.body.style.overflow="";if(previousFocus?.focus)previousFocus.focus();}
function begin(title){if(busy)throw Error("Bitte laufenden Vorgang abwarten.");if(!safe())throw Error("Bitte erst Kampf, Minispiel oder Animation beenden.");viewId++;previousFocus=document.activeElement;panel.replaceChildren();panel.setAttribute("data-manager-layout","");overlay.setAttribute("data-manager-layout","");const row=el("div",undefined,"tp-modal-head");const h=el("h2",title);h.id="tp-manager-title";const exit=button("Schliessen",close);row.append(h,exit);panel.appendChild(row);overlay.hidden=false;document.body.style.overflow="hidden";dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;exit.focus();}
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
/* UI01 saves: existing actions in the shared double display */
const savesUiMessages={"en": {"title": "Backups", "save": "Save locally", "export": "Export", "load": "Load file", "copies": "Local copies", "info": "Information", "current": "Current save", "scope": "Save data only — no media files", "saveHint": "Create an additional copy in this browser.", "exportHint": "Choose the required file format.", "loadHint": "Select a file. Preview and confirmation follow before replacement.", "empty": "No local copies available.", "restore": "Preview / Restore", "share": "Export copy", "delete": "Delete this copy", "previous": "Previous copy", "next": "Next copy"}, "de": {"title": "Sicherungen", "save": "Lokal sichern", "export": "Exportieren", "load": "Datei laden", "copies": "Lokale Kopien", "info": "Informationen", "current": "Aktueller Spielstand", "scope": "Nur Spielstand — keine Mediendateien", "saveHint": "Eine zusätzliche Kopie in diesem Browser anlegen.", "exportHint": "Benötigtes Dateiformat auswählen.", "loadHint": "Datei auswählen. Vor dem Ersetzen folgen Vorschau und Bestätigung.", "empty": "Noch keine lokalen Kopien vorhanden.", "restore": "Vorschau / Wiederherstellen", "share": "Kopie exportieren", "delete": "Diese Kopie löschen", "previous": "Vorherige Kopie", "next": "Nächste Kopie"}, "es": {"title": "Copias", "save": "Guardar local", "export": "Exportar", "load": "Cargar archivo", "copies": "Copias locales", "info": "Información", "current": "Partida actual", "scope": "Solo la partida — sin archivos multimedia", "saveHint": "Crear una copia adicional en este navegador.", "exportHint": "Elegir el formato necesario.", "loadHint": "Seleccionar archivo. Habrá vista previa y confirmación antes de reemplazar.", "empty": "No hay copias locales.", "restore": "Vista previa / Restaurar", "share": "Exportar copia", "delete": "Eliminar esta copia", "previous": "Copia anterior", "next": "Copia siguiente"}, "fr": {"title": "Sauvegardes", "save": "Copie locale", "export": "Exporter", "load": "Charger", "copies": "Copies locales", "info": "Informations", "current": "Partie actuelle", "scope": "Partie uniquement — sans fichiers multimédias", "saveHint": "Créer une copie supplémentaire dans ce navigateur.", "exportHint": "Choisir le format nécessaire.", "loadHint": "Choisir un fichier. Aperçu et confirmation précèdent le remplacement.", "empty": "Aucune copie locale.", "restore": "Aperçu / Restaurer", "share": "Exporter la copie", "delete": "Supprimer cette copie", "previous": "Copie précédente", "next": "Copie suivante"}};
/* UI01 saves revision 2: device shell and readable backup scenes */
const savesSceneWords={"en": {"raised": "Raised", "caught": "Caught", "archive": "Local copy", "unreadable": "Not readable", "exportScene": "File formats", "loadScene": "Read a backup", "exportHint": "Choose a format."}, "de": {"raised": "Aufgezogen", "caught": "Gefangen", "archive": "Lokale Kopie", "unreadable": "Nicht lesbar", "exportScene": "Dateiformate", "loadScene": "Sicherung einlesen", "exportHint": "Format auswählen."}, "es": {"raised": "Criados", "caught": "Capturados", "archive": "Copia local", "unreadable": "No legible", "exportScene": "Formatos", "loadScene": "Leer una copia", "exportHint": "Elegir formato."}, "fr": {"raised": "Élevés", "caught": "Capturés", "archive": "Copie locale", "unreadable": "Illisible", "exportScene": "Formats", "loadScene": "Lire une copie", "exportHint": "Choisir le format."}};
for(const code of ["en","de","es","fr"])
 Object.assign(savesUiMessages[code],savesSceneWords[code]);

function savesSceneGraphic(kind){
 const ns="http://www.w3.org/2000/svg";
 const svg=document.createElementNS(ns,"svg");
 svg.setAttribute("viewBox","0 0 64 48");
 svg.setAttribute("aria-hidden","true");
 svg.classList.add("tp-saves-scene-graphic");
 function shape(tag,attributes,text){
  const element=document.createElementNS(ns,tag);
  for(const [key,value]of Object.entries(attributes))
   element.setAttribute(key,String(value));
  if(text!==undefined)element.textContent=text;
  svg.append(element);return element;
 }
 if(kind==="save"){
  shape("rect",{x:17,y:3,width:30,height:42,rx:5,fill:"#a84a50",stroke:"#292831","stroke-width":1.5});
  shape("rect",{x:22,y:9,width:20,height:15,rx:2,fill:"#d4e4e8",stroke:"#71838c"});
  shape("path",{d:"M26 16h12M32 11v10",stroke:"#315b83","stroke-width":1.5});
  shape("rect",{x:23,y:30,width:18,height:10,rx:1,fill:"#eadcb9",stroke:"#856a3c"});
  shape("path",{d:"M27 32v6m4-6v6m4-6v6",stroke:"#856a3c"});
 }else if(kind==="load"){
  shape("rect",{x:34,y:12,width:26,height:31,rx:4,fill:"#d4e4e8",stroke:"#292831","stroke-width":1.5});
  shape("rect",{x:39,y:17,width:16,height:12,rx:2,fill:"#b9c7cd",stroke:"#71838c"});
  shape("rect",{x:4,y:5,width:19,height:27,rx:2,fill:"#f6f9fa",stroke:"#292831","stroke-width":1.5});
  shape("path",{d:"M8 12h10M8 17h10M8 22h7",stroke:"#8670a3","stroke-width":1.5});
  shape("path",{d:"M21 36h14m-5-5 5 5-5 5",fill:"none",stroke:"#315b83","stroke-width":2});
  shape("circle",{cx:47,cy:36,r:2,fill:"#315b83"});
 }else if(kind==="export"){
  shape("rect",{x:9,y:7,width:22,height:33,rx:2,fill:"#f6f9fa",stroke:"#292831","stroke-width":1.5});
  shape("rect",{x:32,y:11,width:22,height:33,rx:2,fill:"#e9e1f0",stroke:"#292831","stroke-width":1.5});
  shape("path",{d:"M14 14h12m-12 6h12m-12 6h8",stroke:"#315b83","stroke-width":1.5});
  shape("text",{x:43,y:32,"text-anchor":"middle","font-family":"monospace","font-size":11,"font-weight":700,fill:"#8670a3"},"V1");
 }else{
  shape("path",{d:"M5 14h21l5 6h28v24H5Z",fill:"#eadcb9",stroke:"#292831","stroke-width":1.5});
  shape("rect",{x:12,y:5,width:18,height:25,rx:2,fill:"#f6f9fa",stroke:"#856a3c"});
  shape("rect",{x:32,y:9,width:18,height:21,rx:2,fill:"#d4e4e8",stroke:"#71838c"});
  shape("path",{d:"M5 28h54v16H5Z",fill:"#d5c393",stroke:"#292831","stroke-width":1.5});
  shape("rect",{x:25,y:33,width:14,height:6,rx:1,fill:"#f6f9fa",stroke:"#856a3c"});
 }
 return svg;
}
function savesSceneHeader(kind,label){
 const header=el("div",undefined,"tp-saves-scene");
 header.dataset.savesScene=kind;
 header.append(savesSceneGraphic(kind),el("span",label));
 return header;
}
function savesCurrentCard(summary){
 const card=el("div",undefined,"tp-saves-current-card");
 const station=el("div",undefined,"tp-saves-current-station");
 const label=el("div");
 label.append(
  el("small",savesText("current")),
  el("strong",species(summary)),
  el("span","Lv. "+summary.level)
 );
 station.append(savesSceneGraphic("save"),label);
 const stats=el("div",undefined,"tp-saves-current-stats");
 for(const [key,value]of [["raised",summary.raised],["caught",summary.caught]]){
  const cell=el("div");
  cell.append(el("span",savesText(key)),el("strong",String(value)));
  stats.append(cell);
 }
 card.append(station,stats);return card;
}

/* UI01 saves info: complete notes as paged information cards */
const savesInfoWords={"en": {"infoRetention": "Retention", "infoFormats": "Export and contents", "infoStock": "Local copies"}, "de": {"infoRetention": "Aufbewahrung", "infoFormats": "Export und Inhalt", "infoStock": "Bestandshinweis"}, "es": {"infoRetention": "Conservación", "infoFormats": "Exportación y contenido", "infoStock": "Copias locales"}, "fr": {"infoRetention": "Conservation", "infoFormats": "Export et contenu", "infoStock": "Copies locales"}};
for(const code of ["en","de","es","fr"])
 Object.assign(savesUiMessages[code],savesInfoWords[code]);

function savesInfoCard(note,index){
 const card=el("section",undefined,"tp-saves-info-card");
 card.dataset.savesInfoCard=String(index);
 const topic=index===0?"infoRetention":index===1?"infoFormats":"infoStock";
 const header=el("div",undefined,"tp-saves-info-card-head");
 header.append(
  savesSceneGraphic(index===1?"export":"archive"),
  el("h3",savesText(topic))
 );
 card.append(header,note);
 return card;
}

let savesUiRegistered=false;
function savesText(key){
 if(!savesUiRegistered&&window.TPText?.registerLocale){
  for(const code of ["en","de","es","fr"])
   TPText.registerLocale(code,Object.fromEntries(
    Object.entries(savesUiMessages[code]).map(([key,value])=>["savesPage."+key,value])
   ));
  savesUiRegistered=true;
 }
 return window.TPText?.t?TPText.t("savesPage."+key):savesUiMessages.de[key];
}
function savesIcon(kind){
 const ns="http://www.w3.org/2000/svg";
 const svg=document.createElementNS(ns,"svg");
 svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("aria-hidden","true");
 svg.setAttribute("fill","none");svg.setAttribute("stroke","currentColor");
 svg.setAttribute("stroke-width","1.6");svg.setAttribute("stroke-linejoin","round");
 svg.classList.add("tp-saves-icon");
 const paths={
  save:"M3 3h15l3 3v15H3Zm4 0v7h10V3M7 21v-7h10v7",
  export:"M4 14v7h16v-7M12 17V2m-5 5 5-5 5 5",
  load:"M4 14v7h16v-7M12 2v15m-5-5 5 5 5-5",
  copies:"M7 7h14v14H7ZM3 17V3h14",
  info:"M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 8v8m0-12v1",
  restore:"M5 8a8 8 0 1 1-1 9M2 3v6h6",
  share:"M4 14v7h16v-7M12 17V2m-5 5 5-5 5 5",
  delete:"M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"
 };
 const path=document.createElementNS(ns,"path");path.setAttribute("d",paths[kind]);
 svg.append(path);return svg;
}
function decorateSavesPage(summary,records){
 const ownerView=viewId;
 const alive=()=>viewId===ownerView&&panel.getAttribute("data-manager-layout")==="saves";
 const head=panel.querySelector(".tp-modal-head");
 const row=Array.from(panel.children).find(node=>node.classList.contains("tp-modal-row"));
 const main=row?Array.from(row.querySelectorAll("button")):[];
 const files=Array.from(panel.querySelectorAll('input[type="file"]'));
 const load=Array.from(panel.children).find(node=>node.tagName==="BUTTON");
 const cards=Array.from(panel.children).filter(node=>node.tagName==="ARTICLE");
 const paragraphs=Array.from(panel.children).filter(node=>node.tagName==="P");
 if(!head||main.length!==3||files.length!==1||!load||
    cards.length!==records.length||!paragraphs.length)
  throw Error("Vorhandene Sicherungsaktionen nicht eindeutig.");
 const current=paragraphs[0],notes=paragraphs.slice(1),file=files[0];
 const [save,classic,version1]=main;
 const cardButtons=cards.map(card=>Array.from(card.querySelectorAll("button")));
 if(cardButtons.some(buttons=>buttons.length!==1&&buttons.length!==3))
  throw Error("Aktionen einer lokalen Sicherung nicht eindeutig.");

 panel.setAttribute("data-manager-layout","saves");
 overlay.setAttribute("data-manager-layout","saves");
 head.classList.add("tp-saves-head");
 head.querySelector("h2").textContent=savesText("title");
 let selected="save",index=0,showInfo=false,infoIndex=0;

 const frame=el("div",undefined,"tp-saves-frame");
 frame.setAttribute("aria-hidden","true");
 const displays=[el("div"),el("div")],spine=el("div");
 displays.forEach(node=>node.className="tp-saves-display");
 spine.className="tp-saves-spine";frame.append(...displays,spine);

 const toolbar=el("div",undefined,"tp-saves-toolbar");
 const scope=el("span",savesText("scope"),"tp-saves-scope");
 const docks=el("div",undefined,"tp-saves-docks");
 const info=button("",()=>{showInfo=!showInfo;if(showInfo)infoIndex=0;render();});
 info.dataset.savesInfo="";
 info.setAttribute("aria-label",savesText("info"));info.title=savesText("info");
 info.append(savesIcon("info"));toolbar.append(scope,docks,info);

 const body=el("div",undefined,"tp-saves-body");
 const left=el("div",undefined,"tp-saves-left");
 const right=el("div",undefined,"tp-saves-right");right.tabIndex=0;
 const categories=el("div",undefined,"tp-saves-categories");
 left.append(categories);body.append(left,right);

 const panes={};
 for(const key of ["save","export","load","copies","info"]){
  panes[key]=el("div",undefined,"tp-saves-pane");
  panes[key].hidden=true;right.append(panes[key]);
 }
 const hint=(key)=>el("p",savesText(key),"tp-saves-hint");
 panes.save.dataset.savesScenePane="save";
 panes.export.dataset.savesScenePane="export";
 panes.load.dataset.savesScenePane="load";
 panes.save.append(savesCurrentCard(summary),hint("saveHint"),save);
 classic.classList.add("tp-saves-format");
 version1.classList.add("tp-saves-format");
 classic.prepend(savesSceneGraphic("save"));
 version1.prepend(savesSceneGraphic("export"));
 panes.export.append(savesSceneHeader("export",savesText("exportScene")),hint("exportHint"),classic,version1);
 panes.load.append(savesSceneHeader("load",savesText("loadScene")),hint("loadHint"),load);
 const storage=el("div",undefined,"tp-saves-records");
 storage.append(...cards);panes.copies.append(storage);
 if(!cards.length)panes.copies.append(hint("empty"));
 const infoCards=notes.map((note,i)=>savesInfoCard(note,i));
 panes.info.append(...infoCards);
 file.hidden=true;

 const perRecordTools=cardButtons.map((buttons,recordIndex)=>{
  const card=cards[recordIndex];
  const readable=buttons.length===3;
  card.dataset.savesReadable=String(readable);
  card.prepend(savesSceneHeader("archive",savesText(readable?"archive":"unreadable")));
  const dock=el("div",undefined,"tp-saves-record-tools");
  const kinds=buttons.length===3?["restore","share","delete"]:["delete"];
  buttons.forEach((action,i)=>{
   action.dataset.savesAction=kinds[i];
   action.setAttribute("aria-label",savesText(kinds[i]));
   action.title=savesText(kinds[i]);action.append(savesIcon(kinds[i]));
   dock.append(action);
  });
  docks.append(dock);return dock;
 });
 const picks={};
 for(const key of ["save","export","load","copies"]){
  const pick=button("",()=>{selected=key;showInfo=false;render();});
  pick.dataset.savesCategory=key;
  pick.append(savesIcon(key),el("span",savesText(key)));
  if(key==="copies"){
   const count=el("small",String(records.length));count.dataset.savesCount="";
   pick.append(count);
  }
  categories.append(pick);picks[key]=pick;
 }
 const navigation=el("div",undefined,"tp-saves-navigation");
 const previous=button("",()=>{
  if(showInfo){
   if(infoIndex>0){infoIndex--;render();}
  }else if(index>0){index--;render();}
 });
 const next=button("",()=>{
  if(showInfo){
   if(infoIndex+1<infoCards.length){infoIndex++;render();}
  }else if(index+1<cards.length){index++;render();}
 });
 const counter=el("span");
 previous.dataset.savesPrevious="";next.dataset.savesNext="";
 previous.setAttribute("aria-label",savesText("previous"));
 next.setAttribute("aria-label",savesText("next"));
 navigation.append(previous,counter,next);
 panel.replaceChildren(head,frame,toolbar,body,file,navigation);

 function syncFrame(){
  if(!alive()||typeof hubDexLayout!=="function")return;
  const canvas=document.getElementById("tp"),c=canvas.getBoundingClientRect();
  const d=HUB_DEX_DESIGN;
  panel.style.setProperty("background",d.shell,"important");
  panel.style.setProperty("border",d.frameBorder+"px solid "+d.ink,"important");
  panel.style.setProperty("border-radius",d.frameRadius+"px","important");
  const p=panel.getBoundingClientRect(),scale=c.width/466,g=hubDexLayout(c.width);
  const style=getComputedStyle(panel);
  const bx=parseFloat(style.borderLeftWidth)||0,by=parseFloat(style.borderTopWidth)||0;
  const ox=c.left-p.left-bx,oy=c.top-p.top-by;

  const place=(node,r)=>{
   node.style.left=(ox+r.x*scale)+"px";node.style.top=(oy+r.y*scale)+"px";
   node.style.width=(r.w*scale)+"px";node.style.height=(r.h*scale)+"px";
  };
  displays.forEach((node,i)=>{
   place(node,g.displays[i]);node.style.backgroundColor=d.display;
   node.style.borderColor=d.ink;node.style.borderWidth=d.displayBorder+"px";
   node.style.borderRadius=d.displayRadius+"px";
  });
  place(left,g.left);place(right,g.right);
  place(spine,{
   x:g.panel.x+g.panel.w/2-d.spineWidth*g.u/2,
   y:g.panel.y+d.spineInset*g.u,
   w:d.spineWidth*g.u,h:g.panel.h-2*d.spineInset*g.u
  });
  spine.style.backgroundColor=d.spine;spine.style.borderRadius=d.spineRadius+"px";
  toolbar.style.left=(ox+(g.panel.x+g.pad)*scale)+"px";
  toolbar.style.top=(oy+g.filters[0].y*scale)+"px";
  toolbar.style.width=((g.panel.w-2*g.pad)*scale)+"px";
 }
 const syncPaging=ui01BindPaging(panel,navigation,previous,next,counter,alive);
 if(typeof ResizeObserver==="function"){
  const resize=new ResizeObserver(()=>{if(alive())syncFrame();else resize.disconnect();});
  resize.observe(panel);
  const watch=new MutationObserver(()=>{
   if(!alive()){resize.disconnect();watch.disconnect();}
  });
  watch.observe(panel,{childList:true});
 }
 function render(){
  if(!alive())return;
  panel.dataset.savesView=showInfo?"info":selected;
  for(const key of ["save","export","load","copies"]){
   picks[key].setAttribute("aria-pressed",String(selected===key));
   panes[key].hidden=showInfo||selected!==key;
  }
  panes.info.hidden=!showInfo;
  info.setAttribute("aria-pressed",String(showInfo));
  save.hidden=showInfo||selected!=="save";
  classic.hidden=version1.hidden=showInfo||selected!=="export";
  load.hidden=showInfo||selected!=="load";
  cards.forEach((card,i)=>{card.hidden=i!==index;});
  perRecordTools.forEach((dock,i)=>{
   const hidden=showInfo||selected!=="copies"||i!==index;
   dock.hidden=hidden;
   cardButtons[i].forEach(action=>{action.hidden=hidden;});
  });
  infoCards.forEach((card,i)=>{card.hidden=i!==infoIndex;});
  previous.hidden=next.hidden=counter.hidden=!showInfo&&selected!=="copies";
  const activeIndex=showInfo?infoIndex:index;
  const activeTotal=showInfo?infoCards.length:cards.length;
  previous.disabled=activeIndex<=0;
  next.disabled=activeIndex+1>=activeTotal;
  counter.textContent=activeTotal?(activeIndex+1)+" / "+activeTotal:"0 / 0";
  right.scrollTop=0;syncFrame();syncPaging();
 }
 render();
}


/* UI01 paging: actual Pokedex rectangles and glyphs */
function ui01PagingFace(glyph){
 const ns="http://www.w3.org/2000/svg";
 const svg=document.createElementNS(ns,"svg");
 svg.setAttribute("viewBox","0 0 44 44");
 svg.setAttribute("aria-hidden","true");
 svg.classList.add("tp-ui01-paging-face");
 const box=document.createElementNS(ns,"rect");
 for(const [key,value]of Object.entries({
  x:7,y:10,width:30,height:24,rx:5,
  fill:"#f6f9fa",stroke:"#292831","stroke-width":1.5
 }))box.setAttribute(key,String(value));
 const text=document.createElementNS(ns,"text");
 for(const [key,value]of Object.entries({
  x:22,y:22,"text-anchor":"middle","dominant-baseline":"central",
  "font-family":"monospace","font-size":10,"font-weight":700,fill:"#292831"
 }))text.setAttribute(key,String(value));
 text.textContent=glyph;svg.append(box,text);return svg;
}
function ui01BindPaging(owner,nav,previous,next,counter,alive){
 nav.classList.add("tp-ui01-paging");
 previous.replaceChildren(ui01PagingFace("<"));
 next.replaceChildren(ui01PagingFace(">"));
 function sync(){
  for(const button of [previous,next]){
   const svg=button.children[0];
   svg.children[0].setAttribute("fill",button.disabled?"#b9c7cd":"#f6f9fa");
   svg.children[1].setAttribute("fill",button.disabled?"#74838a":"#292831");
  }
  if(typeof hubDexLayout!=="function"||!owner.getBoundingClientRect)return;
  const canvas=document.getElementById("tp");
  if(!canvas?.getBoundingClientRect)return;
  const c=canvas.getBoundingClientRect(),o=owner.getBoundingClientRect();
  if(!(c.width>0))return;
  const g=hubDexLayout(c.width),scale=c.width/466;
  const style=getComputedStyle(owner);
  const bx=parseFloat(style.borderLeftWidth)||0,by=parseFloat(style.borderTopWidth)||0;
  const ox=c.left-o.left-bx,oy=c.top-o.top-by;
  for(const [button,rect]of [[previous,g.previous],[next,g.next]]){
   button.style.left=(ox+rect.x*scale-(44-rect.w*scale)/2)+"px";
   button.style.top=(oy+rect.y*scale-(44-rect.h*scale)/2)+"px";
  }
  counter.style.top=(oy+g.previous.y*scale)+"px";
  counter.style.height=(g.previous.h*scale)+"px";
  counter.style.lineHeight=(g.previous.h*scale)+"px";
 }
 if(typeof ResizeObserver==="function"&&owner.getBoundingClientRect){
  const resize=new ResizeObserver(()=>{if(alive())sync();else resize.disconnect();});
  resize.observe(owner);
  if(typeof MutationObserver==="function"){
   const watch=new MutationObserver(()=>{
    if(!alive()){resize.disconnect();watch.disconnect();}
   });
   watch.observe(owner,{childList:true});
  }
 }
 sync();return sync;
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
 if(!records.length)note("Noch keine lokalen Sicherungskopien vorhanden.");if(view===viewId)decorateSavesPage(now.summary,records);if(view===viewId)window.TPPerformance?.page("saves",tpPage);
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

/* UI01 asset jobs: shared playful progress station */
const assetJobWords={"en": {"check": "Check graphics", "sprites": "Import graphics", "cries": "Import cries", "text": "Import Pokédex texts", "preparing": "Preparing", "working": "Processing", "pauseRequested": "Pause requested", "done": "Completed", "warning": "Completed with notes", "paused": "Paused", "failed": "Operation failed", "valid": "Valid", "errors": "Errors", "notes": "Notes", "imported": "Imported", "skipped": "Skipped", "rejected": "Not imported", "details": "Details", "progress": "Processed", "unknown": "Preparing files", "empty": "No files", "station": "Pokédex file station"}, "de": {"check": "Grafiken prüfen", "sprites": "Grafiken importieren", "cries": "Rufe importieren", "text": "Pokédex-Texte importieren", "preparing": "Vorbereitung", "working": "Bearbeitung", "pauseRequested": "Pause angefordert", "done": "Abgeschlossen", "warning": "Mit Hinweisen beendet", "paused": "Pausiert", "failed": "Vorgang fehlgeschlagen", "valid": "Gültig", "errors": "Fehler", "notes": "Hinweise", "imported": "Übernommen", "skipped": "Übersprungen", "rejected": "Nicht übernommen", "details": "Details", "progress": "Bearbeitet", "unknown": "Dateien vorbereiten", "empty": "Keine Dateien", "station": "Pokédex-Dateistation"}, "es": {"check": "Comprobar gráficos", "sprites": "Importar gráficos", "cries": "Importar gritos", "text": "Importar textos", "preparing": "Preparando", "working": "Procesando", "pauseRequested": "Pausa solicitada", "done": "Completado", "warning": "Finalizado con avisos", "paused": "Pausado", "failed": "Operación fallida", "valid": "Válidos", "errors": "Errores", "notes": "Avisos", "imported": "Importados", "skipped": "Omitidos", "rejected": "No importados", "details": "Detalles", "progress": "Procesados", "unknown": "Preparando archivos", "empty": "Sin archivos", "station": "Estación de archivos"}, "fr": {"check": "Vérifier les images", "sprites": "Importer les images", "cries": "Importer les cris", "text": "Importer les textes", "preparing": "Préparation", "working": "Traitement", "pauseRequested": "Pause demandée", "done": "Terminé", "warning": "Terminé avec remarques", "paused": "En pause", "failed": "Échec de l’opération", "valid": "Valides", "errors": "Erreurs", "notes": "Remarques", "imported": "Importés", "skipped": "Ignorés", "rejected": "Non importés", "details": "Détails", "progress": "Traités", "unknown": "Préparation des fichiers", "empty": "Aucun fichier", "station": "Station de fichiers"}};
let assetJobLocaleReady=false;
function assetJobText(key){
 if(!assetJobLocaleReady&&window.TPText?.registerLocale){
  for(const code of ["en","de","es","fr"]){
   TPText.registerLocale(code,Object.fromEntries(
    Object.entries(assetJobWords[code]).map(([key,value])=>["assetJob."+key,value])
   ));
  }
  assetJobLocaleReady=true;
 }
 return window.TPText?.t?TPText.t("assetJob."+key):assetJobWords.en[key];
}
function assetJobButton(label,fn,kind){
 const element=button(label,fn);element.dataset.assetJobAction=kind;return element;
}
function createAssetJobStation(kind,p,text){
 panel.setAttribute("data-manager-layout","assets-job");
 overlay.setAttribute("data-manager-layout","assets-job");
 const currentView=viewId;
 const head=panel.querySelector(".tp-modal-head");
 head.className+=" tp-job-head";
 head.querySelector("h2").textContent=assetJobText(kind);
 const exit=head.querySelector("button");
 const frame=el("div",undefined,"tp-job-frame");frame.setAttribute("aria-hidden","true");
 for(const cls of ["tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right","tp-pokedex-spine"])
  frame.appendChild(el("span",undefined,cls));

 const toolbar=el("div",undefined,"tp-job-toolbar");
 const phase=el("strong",assetJobText("preparing"),"tp-job-phase");
 const tools=el("div",undefined,"tp-job-tools");toolbar.append(phase,tools);
 let showDetails=false;
 const detailsToggle=button("",()=>{showDetails=!showDetails;refresh();});
 detailsToggle.dataset.assetJobDetails="";
 detailsToggle.setAttribute("aria-label",assetJobText("details"));
 detailsToggle.title=assetJobText("details");
 detailsToggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 10v8m0-12v1"/></svg>';
 tools.appendChild(detailsToggle);

 const body=el("div",undefined,"tp-job-body");
 const left=el("div",undefined,"tp-job-column"),right=el("div",undefined,"tp-job-column");
 const sceneBox=el("div",undefined,"tp-job-left");
 const scene=el("div",undefined,"tp-job-scene");scene.setAttribute("aria-hidden","true");
 scene.innerHTML='<svg viewBox="0 0 120 100">'+
  '<path d="M3 78h114" stroke="#b7b69e" stroke-width="3"/>'+
  '<g fill="#e4d7b8" stroke="#8a8d78"><rect x="5" y="49" width="17" height="24" rx="2"/><rect x="9" y="45" width="17" height="24" rx="2"/></g>'+
  '<rect x="42" y="22" width="39" height="54" rx="6" fill="#a84a50" stroke="#743c46" stroke-width="2"/>'+
  '<rect x="48" y="30" width="27" height="30" rx="2" fill="#c4d1b3" stroke="#71836c"/>'+
  '<path class="tp-job-scan-line" d="M50 42h23" stroke="#69b8c8" stroke-width="3"/>'+
  '<circle cx="53" cy="67" r="3" fill="#e5cd83"/><path d="M64 67h10" stroke="#eadcb9" stroke-width="2"/>'+
  '<path d="M91 66h23v10H91Z" fill="#c2b995" stroke="#878c72"/>'+
  '<g class="tp-job-moving-file" fill="#f0e6ce" stroke="#8d927e"><rect x="8" y="50" width="15" height="20" rx="2"/><path d="M11 55h9m-9 4h9m-9 4h6"/></g>'+
  '</svg>';
 const caption=el("p",assetJobText("station"),"tp-job-scene-caption");
 const filename=el("p","", "tp-job-filename");
 sceneBox.append(scene,caption,filename);left.appendChild(sceneBox);

 const content=el("div",undefined,"tp-job-content");
 const primary=el("div",undefined,"tp-job-primary");
 p.className+=" tp-job-progress";
 const fraction=el("p",assetJobText("unknown"),"tp-job-fraction");
 const cards=el("div",undefined,"tp-job-counts");
 const labels=kind==="check"?["valid","errors","notes"]:["imported","skipped","rejected"];
 const values=[];
 labels.forEach((key,index)=>{
  const card=el("div",undefined,"tp-job-count-card");
  card.dataset.assetJobCount=key;
  const value=el("strong","0");values.push(value);
  card.append(el("span",assetJobText(key)),value);cards.appendChild(card);
 });
 primary.append(p,fraction,cards);
 const details=el("div",undefined,"tp-job-details");details.hidden=true;details.tabIndex=0;
 const fullFilename=el("p","","tp-job-full-filename");
 details.append(fullFilename,text);
 const footer=el("div",undefined,"tp-job-footer");
 content.append(primary,details,footer);right.appendChild(content);body.append(left,right);
 panel.replaceChildren(head,frame,toolbar,body);
 p.removeAttribute("value");

 const model={phase:"preparing",done:0,total:null,counts:[0,0,0],filename:""};
 let queued=false;
 const baseNodes=new Set([head,frame,toolbar,body]);
 function alive(){
  return viewId===currentView&&panel.getAttribute("data-manager-layout")==="assets-job";
 }
 function schedule(){
  if(queued||!alive())return;queued=true;
  requestAnimationFrame(()=>{queued=false;if(alive())refresh();});
 }
 function moveAdditions(){
  if(!alive()){observer.disconnect();return;}
  for(const node of Array.from(panel.children)){
   if(baseNodes.has(node))continue;
   if(node.tagName==="BUTTON"&&node.dataset.assetJobAction==="return"){
    footer.appendChild(node);
   }else if(node.tagName==="BUTTON"&&
    ["pause","report"].includes(node.dataset.assetJobAction)){
    node.title=node.textContent;node.setAttribute("aria-label",node.textContent);
    if(!node.querySelector("svg")){
     const icon=el("span",undefined,"tp-job-tool-icon");icon.setAttribute("aria-hidden","true");
     icon.innerHTML=node.dataset.assetJobAction==="pause"?
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M8 4v16M16 4v16"/></svg>':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 2h12l4 4v16H4Zm4 6h8m-8 4h8m-8 4h5"/></svg>';
     node.appendChild(icon);
    }
    tools.appendChild(node);
   }else{
    details.appendChild(node);
   }
  }
  schedule();
 }
 const observer=new MutationObserver(moveAdditions);
 observer.observe(panel,{childList:true});
 function refresh(){
  if(!alive())return;
  panel.dataset.assetJobPhase=model.phase;
  phase.textContent=assetJobText(model.phase);
  exit.disabled=busy;
  detailsToggle.setAttribute("aria-pressed",String(showDetails));
  primary.hidden=showDetails;details.hidden=!showDetails;
  filename.textContent=model.filename;filename.title=model.filename;
  fullFilename.textContent=model.filename;
  values.forEach((node,index)=>{node.textContent=String(model.counts[index]||0);});
  if(model.total===null){
   p.removeAttribute("value");fraction.textContent=assetJobText("unknown");
  }else{
   p.max=Math.max(1,model.total);p.value=Math.min(model.done,p.max);
   fraction.textContent=model.done+" / "+model.total+" · "+assetJobText("progress");
  }
  const pause=tools.querySelector('[data-asset-job-action="pause"]');
  if(pause)pause.hidden=["done","warning","paused","failed"].includes(model.phase);
 }
 function report(data){
  if(!alive())return;
  Object.assign(model,data);schedule();
 }
 function finish(data){
  if(!alive())return;
  Object.assign(model,data);
  if(!["paused","failed"].includes(model.phase)&&model.total!==null)model.done=model.total;
  moveAdditions();refresh();
 }
 function fail(error){
  if(!alive())return;
  model.phase="failed";text.textContent=String(error.message||error);
  panel.appendChild(assetJobButton("Zur Dateiübersicht",openAssets,"return"));
  moveAdditions();schedule();
 }
 function unlock(){if(alive()){moveAdditions();schedule();}}
 refresh();
 return {p,text,report,finish,fail,unlock};
}

function progress(title,stationKind){begin(title);const p=el("progress",undefined,"tp-progress");p.max=1;p.value=0;const text=el("p","Vorbereitung…","tp-manager-status");panel.append(p,text);return stationKind?createAssetJobStation(stationKind,p,text):{p,text};}
async function validateInventory(){
 const ui=progress("Grafik-Bestand pruefen","check");busy=true;ui.report({phase:"working"});let db;let good=0,bad=0,single=0;const issues=[];
 try{db=await openAssetDb();const keys=await allKeys(db,ASSET_STORE);ui.p.max=Math.max(1,keys.length);ui.report({done:0,total:keys.length});
  for(let i=0;i<keys.length;i++){const key=String(keys[i]),m=T.canonicalSprite(key);if(!m){issues.push(key+": unbekannter Dateiname");ui.report({done:i+1,total:keys.length,counts:[good,bad,issues.length],filename:key});continue;}
   let result;try{const raw=await read(db,ASSET_STORE,keys[i]);result=m.trainer?await TPTrainerArt.inspect(raw,m.leader):m.atlas?T.inspectThumbs(raw):T.inspectSprite(raw);good++;if(result.kind==="single-frame")single++;}catch(e){result={valid:false,kind:"invalid",error:e.message};bad++;issues.push(key+": "+e.message);}
   const {png,...indexResult}=result;await put("assetInfo",key,{key,...indexResult,checkedAt:Date.now()});ui.p.value=i+1;ui.text.textContent=(i+1)+" / "+keys.length+" geprueft";ui.report({done:i+1,total:keys.length,counts:[good,bad,issues.length],filename:key});
   if(i%10===0)await new Promise(r=>setTimeout(r,0));
  }
  ui.text.textContent="Gueltig: "+good+" · Fehler: "+bad+" · Einzelbild-Grafiken: "+single;
  note("Einzelbild-Grafik bedeutet: jede Aktion hat einen Frame. Das beweist nicht, woher die Grafik stammt.");
  for(const issue of issues.slice(0,30))note(issue);
  if(issues.length)panel.appendChild(assetJobButton("Fehlerbericht exportieren",()=>download(issues.join("\n"),"iTamaPoke-Assetfehler.txt","text/plain"),"report"));
 }catch(e){ui.fail(e);throw e;}finally{busy=false;if(db)db.close();ui.unlock();}
 panel.appendChild(assetJobButton("Zur Dateiübersicht",openAssets,"return"));ui.finish({phase:issues.length?"warning":"done",counts:[good,bad,issues.length]});
}
async function importAssets(kind,files,onlyMissing=false){
 if(!files.length)return;const ui=progress("Dateien importieren",kind);busy=true;assetPauseRequested=false;assetImportRunning=kind==="sprites";ui.report({phase:"preparing"});
 if(kind==="sprites"){const pause=button("Nach aktueller Datei pausieren",()=>{assetPauseRequested=true;pause.disabled=true;ui.text.textContent="Pause angefordert – laufende Speicherung wird abgeschlossen.";ui.report({phase:"pauseRequested"});});pause.dataset.assetJobAction="pause";panel.appendChild(pause);}
 let db;
 const store=kind==="sprites"?ASSET_STORE:kind==="cries"?CRY_STORE:DEXENTRY_STORE;
 let imported=0,skipped=0,failed=0,trainerImported=0,trainerSkipped=0,trainerFailed=0,packCount=0;const errors=[];
 try{
  if(kind==="sprites"&&window.TPAssetPacks){const prepared=await TPAssetPacks.prepare(files,{notify:text=>{ui.text.textContent=text;ui.report({filename:text});}});files=prepared.files;packCount=prepared.packs;}
  db=kind==="sprites"?await openAssetDb():kind==="cries"?await openCryDb():await openDexEntryDb();
  const existing=new Set(await allKeys(db,store));const info=new Map((await getAll("assetInfo")).map(x=>[x.key,x]));ui.p.max=files.length;ui.report({phase:assetPauseRequested?"pauseRequested":"working",done:0,total:files.length});
  if(!assetPauseRequested&&kind==="sprites"&&window.TPTrainerArt){const trainers=files.filter(f=>TPTrainerArt.looksLike(f.name));if(trainers.length){try{
   const result=await TPTrainerArt.importBatch(db,store,trainers,{onlyMissing,readExisting:key=>read(db,store,key)});trainerImported=result.saved;trainerSkipped=result.skipped;window.TPOpponentTeam?.invalidatePortraits();imported+=result.saved;skipped+=result.skipped;
   for(const item of result.items){try{await put("assetInfo",item.key,{key:item.key,valid:true,kind:"trainer",leader:item.leader,width:item.width,height:item.height,metadata:item.metadata,checkedAt:Date.now()});}catch(_){note("Leitergrafik gespeichert; Zusatzindex nicht aktualisiert. Angaben bleiben im BIN.");}}
   if(result.saved||result.skipped)window.TPArena?.invalidatePortraits?.();
  }catch(e){trainerFailed=trainers.length;failed+=trainers.length;errors.push("Leiterpaket nicht uebernommen: "+e.message);}}}
  for(let i=0;i<files.length;i++){
   if(kind==="sprites"&&assetPauseRequested)break;
   const file=files[i];if(kind==="sprites"&&window.TPTrainerArt?.looksLike(file.name)){ui.p.value=i+1;ui.report({done:i+1,total:files.length,counts:[imported,skipped,failed],filename:file.name});continue;}let key,raw,details;
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
    if(details){try{await put("assetInfo",key,{key,...details,checkedAt:Date.now()});}catch(e){errors.push(file.name+": Grafik gespeichert, Zusatzindex nicht aktualisiert: "+e.message);}}
   }catch(e){failed++;errors.push(file.name+": "+e.message);}
   finally{ui.p.value=i+1;ui.text.textContent=(i+1)+" / "+files.length+" · Importiert "+imported+" · Uebersprungen "+skipped+" · Fehler "+failed;ui.report({done:i+1,total:files.length,counts:[imported,skipped,failed],filename:file.name});}
   if(i%5===0)await new Promise(r=>setTimeout(r,0));
  }
  if(kind==="sprites"){spriteCache.clear();spriteLoading.clear();currentDex=0;loadingDex=-1;await refreshThumbs();}
  if(kind==="cries"){stopCry();cryBufferCache.clear();await refreshCryIndex();}
  if(kind==="text")dexEntryCache={};
  ui.text.textContent=(assetPauseRequested?"Pausiert · ":"")+"Importiert "+imported+" (Leiter "+trainerImported+") · Uebersprungen "+skipped+" · Nicht uebernommen "+failed;
  if(packCount)note(packCount+" Grafikpaket(e), "+files.length+" Eintraege. Nur benoetigte Dateiinhalte wurden gelesen und geprueft. Bei Nur-fehlende werden vorhandene, nicht als fehlerhaft bekannte Dateinamen geschuetzt; abweichende gueltige Varianten nur bei bewusst ausgeschalteter Option ersetzen.");
  if(assetPauseRequested)note("Bereits bestaetigte Dateien bleiben gespeichert. Dieselben Pakete erneut waehlen und Nur fehlende Dateien aktiviert lassen. Import bitte im Vordergrund durchfuehren.");
  for(const line of errors.slice(0,30))note(line);
  if(errors.length)panel.appendChild(assetJobButton("Importbericht exportieren",()=>download(errors.join("\n"),"iTamaPoke-Importfehler.txt","text/plain"),"report"));
  if(kind==="cries")note("Audio-Dateinamen und Dateigroesse wurden geprueft. Die Abspielbarkeit wird erst beim Dekodieren in der Wiedergabe festgestellt.");
  if(kind==="sprites")note("Leiter: "+trainerImported+" gespeichert · "+trainerSkipped+" uebersprungen · "+trainerFailed+" nicht uebernommen. Leiterpakete sind atomar. Pokemon-/Atlasdateien behalten die bisherige Einzeldatei-Regel.");
  else note("Gueltige Dateien wurden einzeln gespeichert; Fehler bei anderen Dateien rollen sie nicht zurueck.");
 }catch(e){ui.fail(e);throw e;}finally{if(db)db.close();busy=false;assetImportRunning=false;ui.unlock();}
 panel.appendChild(assetJobButton("Zur Dateiübersicht",openAssets,"return"));ui.finish({phase:assetPauseRequested?"paused":(errors.length||failed)?"warning":"done",counts:[imported,skipped,failed]});return imported;
}

/* UI01 assets inventory: categories and retained original controls */
const assetsUiWords={"en": {"title": "File inventory", "graphics": "Graphics", "trainers": "Trainers", "cries": "Cries", "texts": "Texts", "normal": "Normal", "shiny": "Shiny", "languages": "Text languages", "none": "None", "onlyMissing": "Missing only", "info": "Full notes", "namesOnly": "Counts show stored filenames, not a complete content check.", "audioNote": "Available for these species; playback has not been checked.", "trainerNote": "File metadata does not establish usage permission.", "checked": "Last checked", "errors": "Errors", "single": "Single-frame graphics"}, "de": {"title": "Dateibestand", "graphics": "Grafiken", "trainers": "Trainer", "cries": "Rufe", "texts": "Texte", "normal": "Normal", "shiny": "Schillernd", "languages": "Textsprachen", "none": "Keine", "onlyMissing": "Nur fehlende", "info": "Vollständige Hinweise", "namesOnly": "Gezählt werden gespeicherte Dateinamen, keine vollständige Inhaltsprüfung.", "audioNote": "Für diese Arten vorhanden; Abspielbarkeit noch nicht geprüft.", "trainerNote": "Dateiangaben belegen keine Nutzungsfreigabe.", "checked": "Zuletzt geprüft", "errors": "Fehler", "single": "Einzelbild-Grafiken"}, "es": {"title": "Inventario", "graphics": "Gráficos", "trainers": "Entrenadores", "cries": "Gritos", "texts": "Textos", "normal": "Normal", "shiny": "Variocolor", "languages": "Idiomas de textos", "none": "Ninguno", "onlyMissing": "Solo faltantes", "info": "Notas completas", "namesOnly": "Se cuentan nombres guardados, no una revisión completa del contenido.", "audioNote": "Presentes para estas especies; reproducción sin comprobar.", "trainerNote": "Los metadatos no acreditan permiso de uso.", "checked": "Revisados", "errors": "Errores", "single": "Gráficos de un fotograma"}, "fr": {"title": "Inventaire", "graphics": "Images", "trainers": "Dresseurs", "cries": "Cris", "texts": "Textes", "normal": "Normal", "shiny": "Chromatique", "languages": "Langues des textes", "none": "Aucune", "onlyMissing": "Manquants", "info": "Notes complètes", "namesOnly": "Le nombre de noms stockés ne constitue pas une vérification complète.", "audioNote": "Présents pour ces espèces ; lecture non vérifiée.", "trainerNote": "Les métadonnées ne prouvent pas une autorisation.", "checked": "Vérifiés", "errors": "Erreurs", "single": "Images à une trame"}};
/* UI01 assets revision 2: concise overview and explained list export */
const assetsUiRevisionWords={"en": {"info": "Notes", "exportTitle": "Missing graphics", "exportHint": "Exports a text list of missing graphic filenames. No graphics are downloaded.", "exportConfirm": "Export list", "cancel": "Back", "topic1": "Count and check", "topic2": "Import", "topic3": "Storage", "info1a": "File counts are not a content check.", "info1b": "The check concerns stored graphics.", "singleShort": "Single frames:", "animationNote": "Original animation is unconfirmed.", "info2a": "Graphic packs are read in portions.", "info2b": "Keep the app open during import.", "info2c": "Missing only: faulty graphics can be replaced.", "infoLocal": "Stored locally. No automatic downloads.", "infoBackup": "Save backups do not contain media.", "infoRights": "Check origin and usage rights separately."}, "de": {"info": "Hinweise", "exportTitle": "Fehlende Grafiken", "exportHint": "Exportiert eine Textliste fehlender Grafikdateinamen. Es werden keine Grafiken heruntergeladen.", "exportConfirm": "Liste exportieren", "cancel": "Zurück", "topic1": "Zählen & Prüfen", "topic2": "Import", "topic3": "Speicher", "info1a": "Dateizahl ist keine Inhaltsprüfung.", "info1b": "Die Prüfung betrifft gespeicherte Grafiken.", "singleShort": "Einzelbilder:", "animationNote": "Originalanimation unbestätigt.", "info2a": "Grafikpakete werden portionsweise gelesen.", "info2b": "App beim Import offen lassen.", "info2c": "Nur fehlende: fehlerhafte Grafiken können ersetzt werden.", "infoLocal": "Lokal gespeichert. Keine Auto-Downloads.", "infoBackup": "Spielstandssicherungen enthalten keine Medien.", "infoRights": "Herkunft und Nutzungsrechte getrennt prüfen."}, "es": {"info": "Notas", "exportTitle": "Gráficos faltantes", "exportHint": "Exporta una lista de nombres de gráficos faltantes. No descarga gráficos.", "exportConfirm": "Exportar lista", "cancel": "Volver", "topic1": "Contar y comprobar", "topic2": "Importar", "topic3": "Almacenamiento", "info1a": "El número de archivos no verifica su contenido.", "info1b": "La comprobación revisa gráficos guardados.", "singleShort": "Fotogramas únicos:", "animationNote": "Animación original sin confirmar.", "info2a": "Los paquetes se leen por partes.", "info2b": "Mantén la app abierta al importar.", "info2c": "Solo faltantes: pueden reemplazarse gráficos defectuosos.", "infoLocal": "Guardado local. Sin descargas automáticas.", "infoBackup": "Las copias de partida no incluyen medios.", "infoRights": "Comprueba origen y derechos por separado."}, "fr": {"info": "Notes", "exportTitle": "Images manquantes", "exportHint": "Exporte une liste des noms d’images manquantes. Aucune image n’est téléchargée.", "exportConfirm": "Exporter la liste", "cancel": "Retour", "topic1": "Compter et vérifier", "topic2": "Importer", "topic3": "Stockage", "info1a": "Le nombre de fichiers ne vérifie pas leur contenu.", "info1b": "La vérification concerne les images stockées.", "singleShort": "Trames uniques :", "animationNote": "Animation originale non confirmée.", "info2a": "Les paquets sont lus par portions.", "info2b": "Garder l’app ouverte pendant l’import.", "info2c": "Manquants : les images défectueuses peuvent être remplacées.", "infoLocal": "Stockage local. Aucun téléchargement automatique.", "infoBackup": "Les sauvegardes de partie excluent les médias.", "infoRights": "Vérifier séparément origine et droits."}};
for(const code of ["en","de","es","fr"]){
 Object.assign(assetsUiWords[code],assetsUiRevisionWords[code]);
}

let assetsUiLocaleReady=false,assetsUiCategory="graphics";
function assetsUiText(key){
 if(!assetsUiLocaleReady&&window.TPText?.registerLocale){
  for(const code of ["en","de","es","fr"]){
   TPText.registerLocale(code,Object.fromEntries(
    Object.entries(assetsUiWords[code]).map(([key,value])=>["assetsPage."+key,value])
   ));
  }
  assetsUiLocaleReady=true;
 }
 return window.TPText?.t?TPText.t("assetsPage."+key):assetsUiWords.en[key];
}
function assetsUiIcon(kind){
 const n=el("span",undefined,"tp-assets-icon");n.setAttribute("aria-hidden","true");
 const paths={
  graphics:'<path d="M3 3h18v18H3Zm1 15 5-6 4 4 3-4 5 6"/><circle cx="8" cy="8" r="2"/>',
  trainers:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3M7 5h10"/>',
  cries:'<path d="M3 9h4l5-5v16l-5-5H3Zm13-2c4 3 4 7 0 10m3-13c6 5 6 11 0 16"/>',
  texts:'<path d="M3 3h8l1 2 1-2h8v17h-8l-1 2-1-2H3Zm9 2v17M6 8h3m6 0h3M6 12h3m6 0h3"/>',
  validate:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Zm-5 10 3 3 7-7"/>',
  export:'<path d="M3 2h12l4 4v6M3 2v20h10M7 7h6M7 11h6M7 15h3m3 3h9m-4-4 4 4-4 4"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 10v8m0-12v1"/>',
  previous:'<path d="m15 4-8 8 8 8"/>',
  next:'<path d="m9 4 8 8-8 8"/>'
 };
 n.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+paths[kind]+'</svg>';
 return n;
}
function decorateAssetsInventory(inv,normal,shiny,checked,single,cryIDs){
 const head=panel.querySelector(".tp-modal-head");
 const actions=Array.from(panel.querySelectorAll("button")).filter(node=>!head.contains(node));
 const inputs=Array.from(panel.querySelectorAll('input[type="file"]'));
 const only=panel.querySelector('input[type="checkbox"]');
 if(!head||actions.length!==5||inputs.length!==3||!only)
  throw Error("Vorhandene Bestandsaktionen nicht eindeutig.");
 const originalNotes=Array.from(panel.children).filter(node=>node.tagName==="P");
 const onlyLabel=only.closest("label");
 if(!onlyLabel)throw Error("Vorhandene Importoption fehlt.");
 const oldOnlyName=onlyLabel.textContent;
 only.setAttribute("aria-label",oldOnlyName);onlyLabel.title=oldOnlyName;
 onlyLabel.replaceChildren(only,document.createTextNode(assetsUiText("onlyMissing")));
 onlyLabel.className="tp-assets-only";

 panel.setAttribute("data-manager-layout","assets");
 overlay.setAttribute("data-manager-layout","assets");
 head.className+=" tp-assets-head";
 head.querySelector("h2").textContent=assetsUiText("title");
 const host=document.getElementById("tp-game-shell");
 if(host&&typeof hubDexDesignTokens==="function"){
  for(const [name,value]of Object.entries(hubDexDesignTokens()))host.style.setProperty(name,value);
 }

 const frame=el("div",undefined,"tp-assets-frame");frame.setAttribute("aria-hidden","true");
 for(const cls of ["tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right","tp-pokedex-spine"])
  frame.appendChild(el("span",undefined,cls));

 const tools=el("div",undefined,"tp-assets-toolbar");
 for(const [action,kind]of [[actions[0],"validate"],[actions[1],"export"]]){
  action.dataset.assetsTool=kind;
  action.title=action.textContent;action.setAttribute("aria-label",action.textContent);
  if(kind==="export"){
   action.addEventListener("click",event=>{
    if(exportApproved){exportApproved=false;return;}
    event.preventDefault();event.stopImmediatePropagation();
    if(busy||action.disabled)return;
    showExport=true;showInfo=false;renderDetails();
   },true);
  }
  action.appendChild(assetsUiIcon(kind));tools.appendChild(action);
 }
 let showInfo=false,showExport=false,assetsInfoPage=0,exportApproved=false;
 const info=button("",()=>{if(busy)return;showInfo=!showInfo;showExport=false;assetsInfoPage=0;renderDetails();});
 info.dataset.assetsTool="info";info.title=assetsUiText("info");
 info.setAttribute("aria-label",assetsUiText("info"));info.appendChild(assetsUiIcon("info"));
 tools.appendChild(info);

 const body=el("div",undefined,"tp-assets-body");
 const left=el("div",undefined,"tp-assets-column");
 const right=el("div",undefined,"tp-assets-column");
 const categories=el("div",undefined,"tp-assets-categories");
 const content=el("div",undefined,"tp-assets-content");
 left.appendChild(categories);right.appendChild(content);body.append(left,right);
 const hiddenFiles=el("div");hiddenFiles.hidden=true;
 inputs.forEach(input=>hiddenFiles.appendChild(input));
 const trainerCount=inv.sprites.filter(key=>!!window.TPTrainerArt?.canonical(key)).length;
 const trainerTotal=window.TPTrainerArt.entries.length;
 const normalCount=1025-normal.length,shinyCount=1025-shiny.length;
 const keys=["graphics","trainers","cries","texts"];
 const values={
  graphics:normalCount+" / 1025",
  trainers:trainerCount+" / "+trainerTotal,
  cries:String(cryIDs.size),texts:String(inv.text.length)
 };
 const picks=[];
 for(const key of keys){
  const pick=button("",()=>{
   if(busy)return;assetsUiCategory=key;showInfo=false;showExport=false;renderDetails();
  });
  pick.dataset.assetsCategory=key;
  pick.setAttribute("aria-label",assetsUiText(key)+" "+values[key]);
  pick.append(assetsUiIcon(key),el("span",assetsUiText(key)),el("strong",values[key]));
  categories.appendChild(pick);picks.push(pick);
 }
 if(!keys.includes(assetsUiCategory))assetsUiCategory="graphics";

 function metric(target,label,value){
  const row=el("div",undefined,"tp-assets-metric");
  row.append(el("span",label),el("strong",String(value)));target.appendChild(row);
 }

 function coverageCard(label,count,total){
  const card=el("div",undefined,"tp-assets-coverage-card");
  const line=el("div",undefined,"tp-assets-coverage-label");
  line.append(el("span",label),el("strong",count+" / "+total));
  const track=el("div",undefined,"tp-assets-coverage-track");
  track.setAttribute("aria-hidden","true");
  const fill=el("span");fill.style.width=(Math.max(0,Math.min(1,count/total))*100)+"%";
  track.appendChild(fill);card.append(line,track);return card;
 }
 function graphicOverview(){
  const summary=el("div",undefined,"tp-assets-graphic-summary");
  summary.append(coverageCard(assetsUiText("normal"),normalCount,1025),
   coverageCard(assetsUiText("shiny"),shinyCount,1025));
  const checks=el("div",undefined,"tp-assets-check-summary");
  checks.title=assetsUiText("checked");
  const checkedField=el("span"),errorsField=el("span");
  checkedField.append(el("span",assetsUiText("checked")+" "),el("strong",String(checked.length)));
  const errors=checked.filter(item=>!item.valid).length;
  errorsField.append(el("span",assetsUiText("errors")+" "),el("strong",String(errors)));
  errorsField.dataset.hasErrors=String(errors>0);
  checks.append(checkedField,errorsField);summary.appendChild(checks);return summary;
 }
 function renderInfoPage(){
  const box=el("div",undefined,"tp-assets-info-page");
  box.dataset.assetsInfoPage=String(assetsInfoPage);
  box.tabIndex=0;
  box.appendChild(el("h3",assetsUiText("topic"+(assetsInfoPage+1))));
  if(assetsInfoPage===0){
   box.append(el("p",assetsUiText("info1a")),el("p",assetsUiText("info1b")),
    el("p",assetsUiText("singleShort")+" "+single+". "+assetsUiText("animationNote")));
  }else if(assetsInfoPage===1){
   box.append(el("p",assetsUiText("info2a")),el("p",assetsUiText("info2b")),
    el("p",assetsUiText("info2c")));
  }else{
   box.append(el("p",assetsUiText("infoLocal")),el("p",assetsUiText("infoBackup")),
    el("p",assetsUiText("infoRights")));
  }
  const navigation=el("div",undefined,"tp-assets-info-navigation");
  const previous=button("",()=>{
   if(busy||assetsInfoPage===0)return;assetsInfoPage--;renderDetails();
  });
  previous.dataset.assetsInfoPrevious="";previous.disabled=assetsInfoPage===0;
  previous.setAttribute("aria-label",String(assetsInfoPage));
  previous.appendChild(assetsUiIcon("previous"));
  const next=button("",()=>{
   if(busy||assetsInfoPage===2)return;assetsInfoPage++;renderDetails();
  });
  next.dataset.assetsInfoNext="";next.disabled=assetsInfoPage===2;
  next.setAttribute("aria-label",String(assetsInfoPage+2));
  next.appendChild(assetsUiIcon("next"));
  const count=el("span",(assetsInfoPage+1)+" / 3");
  count.dataset.assetsInfoCounter="";
  navigation.append(previous,count,next);
  content.append(box,navigation);
 }
 function renderExportExplanation(){
  const box=el("div",undefined,"tp-assets-export-explanation");
  box.dataset.assetsExportExplanation="";
  box.append(assetsUiIcon("export"),el("h3",assetsUiText("exportTitle")),
   el("p",assetsUiText("exportHint")));
  const row=el("div",undefined,"tp-assets-export-actions");
  const cancel=button(assetsUiText("cancel"),()=>{
   if(busy)return;showExport=false;renderDetails();
  });
  cancel.dataset.assetsExportCancel="";
  const confirm=button(assetsUiText("exportConfirm"),()=>{
   if(busy||actions[1].disabled)return;
   exportApproved=true;
   actions[1].click();
   showExport=false;renderDetails();
  });
  confirm.dataset.assetsExportConfirm="";
  row.append(cancel,confirm);content.append(box,row);
 }
 function renderDetails(){
  picks.forEach(pick=>pick.setAttribute("aria-pressed",
   String(!showInfo&&!showExport&&pick.dataset.assetsCategory===assetsUiCategory)));
  info.setAttribute("aria-pressed",String(showInfo));
  content.replaceChildren();
  if(showExport){renderExportExplanation();return;}
  if(showInfo){renderInfoPage();return;}

  const scroll=el("div",undefined,"tp-assets-details");
  scroll.tabIndex=0;
  const key=assetsUiCategory;
  scroll.setAttribute("aria-label",assetsUiText(key));
  if(key==="graphics"){
   scroll.dataset.assetsGraphicOverview="";
   scroll.appendChild(graphicOverview());
  }else{
   scroll.appendChild(el("h3",assetsUiText(key)));
   if(key==="trainers"){
    metric(scroll,assetsUiText("trainers"),trainerCount+" / "+trainerTotal);
    scroll.appendChild(el("p",assetsUiText("trainerNote")));
   }else if(key==="cries"){
    metric(scroll,assetsUiText("cries"),cryIDs.size);
    scroll.appendChild(el("p",assetsUiText("audioNote")));
   }else{
    metric(scroll,assetsUiText("languages"),inv.text.length);
    scroll.appendChild(el("p",inv.text.join(", ")||assetsUiText("none")));
   }
  }
  const importer=key==="cries"?actions[3]:key==="texts"?actions[4]:actions[2];
  importer.dataset.assetsImport=key;
  content.append(scroll,onlyLabel,importer);
 }

 panel.replaceChildren(head,frame,tools,body,hiddenFiles);
 renderDetails();
}

async function openAssets(){
 begin("Dateiverwaltung");const tpPage=window.TPPerformance?.begin();const view=viewId;const inv=await inventory();if(view!==viewId)return;const index=spriteIndex(inv.sprites),normal=missing(index,false),shiny=missing(index,true);
 panel.appendChild(el("p","Normal: "+(1025-normal.length)+" / 1025 · Schillernd: "+(1025-shiny.length)+" / 1025"));
 note("Diese Zahlen zaehlen vorhandene Dateinamen. Erst 'Bestand pruefen' kontrolliert alle gespeicherten Grafik-Dateien.");
 note("Trainerdateien: "+inv.sprites.filter(k=>!!window.TPTrainerArt?.canonical(k)).length+" / "+window.TPTrainerArt.entries.length+". Rechte je Datei pruefen.");
 const checked=inv.info.filter(x=>inv.sprites.includes(x.key)&&x.kind!=="trainer"),single=checked.filter(x=>x.valid&&x.kind==="single-frame").length;
 note("Letzte Pruefergebnisse: "+checked.length+" Dateien · "+checked.filter(x=>!x.valid).length+" Fehler · "+single+" Einzelbild-Grafiken. Herkunft/Originalanimation ist daraus nicht sicher ableitbar.");
 const cryIDs=new Set(inv.cries.map(k=>/^psnd(\d{1,4})\./i.exec(String(k))).filter(Boolean).map(m=>+m[1]));
 note("Rufe fuer "+cryIDs.size+" Arten (nicht auf Abspielbarkeit geprueft). Textsprachen: "+(inv.text.join(", ")||"keine")+".");
 panel.appendChild(button("Grafik-Bestand pruefen",validateInventory));
 panel.appendChild(button("Liste fehlender Grafiken exportieren",()=>download(normal.concat(shiny).join("\n"),"iTamaPoke-fehlende-Grafiken.txt","text/plain")));
 note("Viele Grafiken: lokale grafikpaket-*.bin statt Tausenden Einzeldateien waehlen. Pakete werden portionsweise gelesen; vorhandene Grafiken bleiben erhalten. Bitte App beim Import im Vordergrund lassen.");
 const only=el("input");only.type="checkbox";only.checked=true;const label=el("label");label.append(only,document.createTextNode("Nur fehlende Dateien importieren (bekannt fehlerhafte Grafiken werden ersetzt)"));panel.appendChild(label);
 for(const [kind,labelText,accept] of [["sprites","Grafiken / Atlas laden",".bin"],["cries","Rufe laden",".m4a,.mp3,.wav,.ogg"],["text","Dex-Texte laden",".txt"]]){
  const input=el("input");input.type="file";input.multiple=true;input.accept=accept;input.addEventListener("change",()=>{const files=Array.from(input.files||[]);input.value="";if(files.length)importAssets(kind,files,only.checked).catch(error);});panel.appendChild(input);panel.appendChild(button(labelText,()=>input.click()));
 }
 if(navigator.storage?.estimate){try{const s=await navigator.storage.estimate();note("Browser-Speicher (geschaetzt): "+Math.round((s.usage||0)/1048576)+" MB genutzt von "+Math.round((s.quota||0)/1048576)+" MB.");}catch(_e){}}
 note("Dateien bleiben lokal; keine Downloads aus dem Netz, keine NAS-Anbindung. Die Sicherungsdateien enthalten diese Dateien nicht.");if(view===viewId)decorateAssetsInventory(inv,normal,shiny,checked,single,cryIDs);if(view===viewId)window.TPPerformance?.page("assets",tpPage);
}
let lastAuto=0,autoWarning=false;
async function autoSave(){if(!safe()||busy||tpSaveReplacing||Date.now()-lastAuto<10*60*1000)return;try{await snapshot(exportStateBytes(Module),"auto");lastAuto=Date.now();}catch(e){console.warn("[backup]",e);if(!autoWarning){autoWarning=true;savesButton.textContent="Sicherung pruefen";}}}
setTimeout(autoSave,5000);setInterval(autoSave,60000);
window.TPManager={openSaves,openAssets,importFile,importAssets,exportCurrent,resetGame};
})();
