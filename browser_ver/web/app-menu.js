// C5: in-game home menu and diary; existing functions become full-size pages.
(function(){
"use strict";

const navigationLabels={
 de:["Pokédex-Zentrale","Arten-Pokédex","Boxen"],
 en:["Pokédex hub","Species Pokédex","Boxes"],
 es:["Central Pokédex","Pokédex de especies","Cajas"],
 fr:["Centre Pokédex","Pokédex des espèces","Boîtes"]
};
// New translation keys require the English catalogue first.
for(const code of ["en","de","es","fr"]){
 const labels=navigationLabels[code];
 TPText.registerLocale(code,{
  "navigation.hub":labels[0],"navigation.species":labels[1],"navigation.collection":labels[2]
 });
}


for(const [code,label] of [
 ["en","Search Pokédex"],["de","Pokédex-Suche"],
 ["es","Buscar en Pokédex"],["fr","Rechercher dans le Pokédex"]
])TPText.registerLocale(code,{"navigation.dexSearch":label});

// Translate display text only; keep legacy routing labels unchanged.
const menuKeys=Object.freeze({"Boxen":"navigation.collection","Sammlung":"navigation.collection","Pokédex-Zentrale":"navigation.hub","Arten-Pokédex":"navigation.species","Geschichten":"zapdos.menu","Menü":"menu.title","Tagebuch":"menu.journal","Entwicklung":"menu.evolution","Pokédex":"menu.dex","Eier":"menu.eggs","Sicherungen":"menu.backups","Einstellungen":"menu.settings","Dateien":"menu.files","Diagnose":"menu.diagnostics","Quellen & Nutzungsrechte":"menu.rights","Zurück zum Pokémon":"menu.home","Dateien verwalten":"menu.manage","Grafiken laden (Pokemon und Leiter)":"menu.graphics","Rufe laden":"menu.cries","Pokédex-Texte laden":"menu.dextext","Dateibestand prüfen":"menu.inventory","Neues Spiel":"menu.reset","Startet mit einem neuen Spielstand. Vorherige Sicherheitsabfragen bleiben erhalten.":"menu.resetNotice","Diagnose nicht verfügbar. Bitte aktuellen Build öffnen.":"menu.diagnosticsUnavailable","Tagebuch nicht verfügbar. Bitte den aktuellen Test-Build öffnen.":"menu.journalUnavailable","Diese Funktion ist gerade nicht verfügbar.":"menu.unavailable","Funktion gerade nicht eindeutig verfügbar.":"menu.ambiguous","Pokémon-Spiel. Nach unten wischen oder Pfeil nach unten: Menü.":"menu.ariaCanvas","Spielmenü":"menu.aria","Tagebucheinträge":"menu.journalEntries","Zurück":"common.back"});
function menuText(value){
 return typeof value==='string'&&Object.prototype.hasOwnProperty.call(menuKeys,value)
  ?TPText.t(menuKeys[value]):value;
}

let coreReady=false,active=false,page="main",proxy=null,pendingOrigin="main",dexOrigin=false,dexReturn="main",sectionOrigin="main",restoreChecked=false,gesture=null,suppressClickUntil=0;
const canvas=document.getElementById("tp"),shell=document.createElement("div");shell.id="tp-game-shell";canvas.parentNode.insertBefore(shell,canvas);shell.appendChild(canvas);canvas.tabIndex=0;canvas.setAttribute("aria-label",TPText.t("menu.ariaCanvas"));
const root=document.createElement("section");root.id="tp-app-page";root.hidden=true;root.setAttribute("aria-label",TPText.t("menu.aria"));root.setAttribute("lang",TPText.language());shell.appendChild(root);
const overlays=new Set(),watched=new WeakSet();
function visible(n){if(n.hidden||n.style.display==="none")return false;const c=typeof getComputedStyle==="function"?getComputedStyle(n):null;return !c||(c.display!=="none"&&c.visibility!=="hidden");}
function ready(){return coreReady&&!!Module&&!!fns;}
function quiet(){return !window.TPActions?.active&&!window.TPActions?.busy&&screen!=='expedition'&&screen!=='activity'&&!window.TPActivities?.active&&!window.TPActivities?.busy&&ready()&&!window.TPCollection?.busy&&!window.TPZapdosUI?.busy&&!window.TPArktosUI?.busy&&!window.TPLavadosUI?.busy&&!window.TPMewtuUI?.busy&&!window.TPMewUI?.busy&&!window.TPStoriesUI?.busy&&!window.TPBoxes?.active&&!window.TPCollectionGame?.dialogOpen&&!tpSaveReplacing&&!(window.TPExpeditions&&window.TPExpeditions.busy)&&!["game","gamemenu","battle","trainer","keyboard","arena","league"].includes(screen)&&!fns.ceremony()&&!fns.evolvingNow()&&!fns.wildPromptActive()&&choice==="none";}
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=menuText(text);if(cls)n.className=cls;return n;}
function button(text,fn,cls){const b=el("button",text,cls);b.type="button";b.addEventListener("click",e=>{if(Date.now()<suppressClickUntil){e.preventDefault();return;}try{fn();}catch(err){notice(err.message||String(err));}});return b;}
// UI01 hub icons: local vector paths, no external media or extra labels.
const hubIconPaths=Object.freeze({
 collection:'<path d="M3 7h18v14H3zM2 3h20v4H2z"/><circle cx="8" cy="14" r="2"/><circle cx="16" cy="14" r="2"/>',
 journal:'<path d="M6 3h13v18H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/><path d="M6 3v18M10 8h5M10 12h5"/>',
 stories:'<path d="M12 6C9 3 5 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-7-1-10 2Z"/><path d="M12 6v15"/>',
 species:'<circle cx="12" cy="12" r="9"/><path d="M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3"/>',
 eggs:'<path d="M19 15c0 5-3 7-7 7s-7-2-7-7C5 9 9 2 12 2s7 7 7 13Z"/><path d="m7 12 3 2 3-3 4 2"/>',
 evolution:'<path d="M12 21V4m-6 6 6-6 6 6"/><path d="M4 17h4m8 0h4M3 6h3m12 0h3"/>'
});
function hubButton(text,fn,key){
 const b=button(text,fn);b.dataset.hub=key;
 const paths=hubIconPaths[key];
 if(paths){
  const icon=el('span',undefined,'tp-hub-icon');
  icon.setAttribute('aria-hidden','true');
  icon.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" '+
   'fill="none" stroke="currentColor" stroke-width="1.8" '+
   'stroke-linecap="round" stroke-linejoin="round" focusable="false">'+
   paths+'</svg>';
  b.appendChild(icon);
 }
 return b;
}
function notice(text){
 if(page==="journal"&&journalView&&journalLive(journalView)){
  journalView.message=menuText(text);
  journalDetail(journalView);
  return;
 }
let n=root.querySelector(".tp-app-notice");if(!n){n=el("p",undefined,"tp-app-notice");n.setAttribute("role","status");root.appendChild(n);}n.textContent=menuText(text);}
function remember(value){try{if(value)sessionStorage.setItem("tp-app-return",value);else sessionStorage.removeItem("tp-app-return");}catch(_e){}}
function parentPage(which){
 if(["zapdos","articuno","moltres","mewtwo","mew"].includes(which))return "stories";
 if(which==="stories")return "pokedex";
 if(which==="journal")return sectionOrigin;
 return ["files","diagnostics","rights"].includes(which)?"settings":"main";
}

/* UI01 administration: shared device and existing actions */
const adminWords={"en": {"backupHint": "Export, inspect or import a save.", "settingsHint": "Sound, language and local files.", "filesTitle": "Local files", "filesHint": "Choose a file category on the left.", "filesChecks": "The existing file selection and import checks stay in place.", "resetHint": "Starts a new save. Confirmations remain required."}, "de": {"backupHint": "Spielstände sichern, prüfen und laden.", "settingsHint": "Ton, Sprache und lokale Dateien.", "filesTitle": "Lokale Dateien", "filesHint": "Wähle links die gewünschte Dateiart.", "filesChecks": "Dateiauswahl und Importprüfungen bleiben unverändert.", "resetHint": "Neuer Spielstand. Bestätigungen bleiben erhalten."}, "es": {"backupHint": "Exportar, comprobar o importar una partida.", "settingsHint": "Sonido, idioma y archivos locales.", "filesTitle": "Archivos locales", "filesHint": "Elige una categoría de archivo a la izquierda.", "filesChecks": "Se mantienen el selector y las comprobaciones de importación.", "resetHint": "Nueva partida. Se mantienen las confirmaciones."}, "fr": {"backupHint": "Exporter, vérifier ou importer une partie.", "settingsHint": "Son, langue et fichiers locaux.", "filesTitle": "Fichiers locaux", "filesHint": "Choisissez une catégorie de fichier à gauche.", "filesChecks": "La sélection et les vérifications d’import restent inchangées.", "resetHint": "Nouvelle partie. Confirmations conservées."}};
if(window.TPText?.registerLocale){
 for(const code of ["en","de","es","fr"]){
  TPText.registerLocale(code,Object.fromEntries(
   Object.entries(adminWords[code]).map(([key,value])=>["adminPage."+key,value])
  ));
 }
}
/* UI01 files: concise tiles and retained import actions */
const adminFileWords={"en": {"graphicsShort": "Load graphics", "inventoryShort": "Inventory"}, "de": {"graphicsShort": "Grafiken laden", "inventoryShort": "Bestand"}, "es": {"graphicsShort": "Cargar gráficos", "inventoryShort": "Archivos"}, "fr": {"graphicsShort": "Charger images", "inventoryShort": "Inventaire"}};
if(window.TPText?.registerLocale){
 for(const code of ["en","de","es","fr"]){
  TPText.registerLocale(code,Object.fromEntries(
   Object.entries(adminFileWords[code]).map(([key,value])=>["adminPage."+key,value])
  ));
 }
}

const adminText=key=>TPText.t("adminPage."+key);
function adminIcon(kind){
 const n=el("span",undefined,"tp-admin-icon");
 n.setAttribute("aria-hidden","true");
 const paths={
  backup:'<path d="M4 3h13l4 4v14H3V3Zm3 0v7h10V3M7 21v-7h10v7m-3-16v3"/>',
  settings:'<path d="m9 2-1 4-4 1 1 4-3 3 3 3 1 4 4-1 3 2 3-3 4-1-1-4 2-3-3-3V4l-4 1Z"/><circle cx="12" cy="12" r="4"/>',
  sound:'<path d="M3 9h4l5-5v16l-5-5H3Zm13-2c4 3 4 7 0 10m3-13c6 5 6 11 0 16"/>',
  language:'<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20M4 6h16M4 18h16"/>',
  files:'<path d="M2 6h8l2 3h10l-2 12H3Zm0 0V3h8l2 3h8v3"/>',
  diagnostics:'<path d="M3 3h18v18H3Zm2 10h4l2-6 3 10 2-5h3"/>',
  graphics:'<path d="M3 3h18v18H3Zm1 15 5-6 4 4 3-4 5 6"/><circle cx="8" cy="8" r="2"/>',
  cries:'<path d="M5 6v12m4-15v18m4-13v8m4-11v14m4-9v4"/>',
  texts:'<path d="M5 2h11l4 4v16H4V2Zm3 7h8M8 13h8m-8 4h5"/>',
  inventory:'<path d="M3 18H2V5h8l2 3h9v3M2 5V3h8l2 2"/><circle cx="14" cy="15" r="5"/><path d="m18 19 4 4"/>'
 };
 n.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+paths[kind]+'</svg>';
 return n;
}
function adminMark(buttonNode,kind){
 buttonNode.dataset.adminAction=kind;
 if(kind==="graphics"||kind==="inventory"){
  const fullLabel=buttonNode.textContent;
  buttonNode.setAttribute("aria-label",fullLabel);
  buttonNode.title=fullLabel;
  buttonNode.textContent=adminText(kind==="graphics"?"graphicsShort":"inventoryShort");
 }
 buttonNode.appendChild(adminIcon(kind));
}
function adminColumn(){
 const column=el("div",undefined,"tp-admin-column");
 const content=el("div",undefined,"tp-admin-content");
 column.appendChild(content);
 return {column,content};
}
function decorateAdministration(which){
 if(!["main","settings","files"].includes(which))return;
 applyHubDesign();
 root.className+=" tp-admin-page tp-admin-"+which;
 const frame=el("div",undefined,"tp-admin-frame");
 frame.setAttribute("aria-hidden","true");
 for(const cls of ["tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right","tp-pokedex-spine"]){
  frame.appendChild(el("span",undefined,cls));
 }

 if(which==="main"){
  const grid=root.querySelector(".tp-app-grid");
  const home=root.querySelector(".tp-app-home");
  const choices=Array.from(grid.children);
  if(choices.length!==2)throw Error("Verwaltungseinstieg nicht eindeutig.");
  grid.replaceChildren();grid.className+=" tp-admin-body";
  for(let index=0;index<2;index++){
   const panel=adminColumn();
   const kind=index===0?"backup":"settings";
   adminMark(choices[index],kind);
   choices[index].className+=" tp-admin-main-card";
   panel.content.append(choices[index],
    el("p",adminText(index===0?"backupHint":"settingsHint"),"tp-admin-description"));
   grid.appendChild(panel.column);
  }
  root.append(frame,grid,home);
  if(!home.querySelector("canvas")&&!home.querySelector("svg")){
   const arrow=el("canvas");
   if(window.TPNavBack&&typeof arrow.getContext==="function"){
    arrow.width=arrow.height=24;arrow.setAttribute("aria-hidden","true");
    TPNavBack.draw(arrow.getContext("2d"),0,0,24,"#315b83");
    home.appendChild(arrow);
   }else{
    const fallback=el("span",undefined,"tp-admin-home-arrow");
    fallback.setAttribute("aria-hidden","true");
    fallback.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5 3 11l6 6M4 11h10a6 6 0 0 1 6 6v2"/></svg>';
    home.appendChild(fallback);
   }
  }
  return;
 }

 const body=el("div",undefined,"tp-admin-body");
 const left=adminColumn(),right=adminColumn();
 const list=root.querySelector(".tp-app-actions");
 if(!list)throw Error("Vorhandene Verwaltungsaktionen fehlen.");
 list.className+=" tp-admin-tile-grid";
 const choices=Array.from(list.children);
 if(choices.length!==4)throw Error("Vorhandene Verwaltungsaktionen nicht eindeutig.");
 const kinds=which==="settings"?
  ["sound","language","files","diagnostics"]:["graphics","cries","texts","inventory"];
 choices.forEach((item,index)=>adminMark(item,kinds[index]));
 left.content.appendChild(list);

 if(which==="settings"){
  const rights=root.querySelector(".tp-app-rights-link");
  const danger=root.querySelector(".tp-app-danger");
  if(!rights||!danger)throw Error("Vorhandene Informations-/Rücksetzwege fehlen.");
  const hint=danger.querySelector("p");
  if(hint)hint.textContent=adminText("resetHint");
  right.content.append(rights,danger);
 }else{
  const help=el("div",undefined,"tp-admin-file-help");
  help.append(adminIcon("files"),el("h3",adminText("filesTitle")),
   el("p",adminText("filesHint")),el("p",adminText("filesChecks")));
  right.content.appendChild(help);
 }
 body.append(left.column,right.column);root.append(frame,body);
}

function show(which="main"){
 if(!quiet())return;disposeJournal();hideDexNavigation();if(which==="main"||which==="pokedex")sectionOrigin=which;const tpPage=window.TPPerformance?.begin();active=true;page=which;screen="settings";root.hidden=false;TPText.refresh();root.setAttribute("lang",TPText.language());root.setAttribute("aria-label",TPText.t("menu.aria"));canvas.setAttribute("aria-label",TPText.t("menu.ariaCanvas"));root.replaceChildren();root.className=which==="pokedex"?"tp-app-main tp-pokedex-hub":which==="stories"?"tp-pokedex-stories":which==="journal"?"tp-pokedex-journal":which==="main"?"tp-app-main":"";
 dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;
 const head=el("header",undefined,"tp-app-head");head.appendChild(el("h2",{stories:"Geschichten",pokedex:"Pokédex-Zentrale",main:"Menü",journal:"Tagebuch",settings:"Einstellungen",files:"Dateien",diagnostics:"Diagnose",rights:"Quellen & Nutzungsrechte",zapdos:TPText.t("zapdos.title"),articuno:window.TPArktosText?.t("title"),moltres:window.TPLavadosText?.t("title"),mewtwo:window.TPMewtuText?.t("title"),mew:window.TPMewText?.t("title")}[which]||"Menü"));
 if(which!=="main")head.appendChild(button("Zurück",()=>which==="pokedex"?close():show(parentPage(which))));
 root.appendChild(head);
 if(which==="main"){
  const grid=el("div",undefined,"tp-app-grid");
  for(const[text,fn]of [["Sicherungen",()=>legacy(["Sicherungen","Sicherung prüfen","Sicherung pruefen"],"main",true)],["Einstellungen",()=>show("settings")]])grid.appendChild(button(text,fn));
  root.append(grid,button("Zurück zum Pokémon",close,"tp-app-home"));
 }else if(which==="pokedex"){
  applyHubDesign();
  const grid=el("div",undefined,"tp-app-grid");
  for(const name of [
   "tp-pokedex-display tp-pokedex-display-left",
   "tp-pokedex-display tp-pokedex-display-right",
   "tp-pokedex-spine"
  ]){
   const part=el("span",undefined,name);
   part.setAttribute("aria-hidden","true");
   grid.appendChild(part);
  }
  grid.append(
   hubButton("Tagebuch",()=>show("journal"),"journal"),
   hubButton("Geschichten",()=>show("stories"),"stories"),
   hubButton("Pokédex",()=>openSpeciesDex("pokedex"),"species"),
   hubButton("Eier",()=>openHubTool("eggs"),"eggs"),
   hubButton("Entwicklung",()=>openHubTool("evolution"),"evolution"),
   hubButton("Boxen",openCollection,"collection")
  );
  const hint=el("div");
  root.append(hint,grid);
  window.TPStoriesUI?.mountHint(hint);
 }else if(which==="settings"){
  const rights=button("Quellen & Nutzungsrechte",()=>show("rights"),"tp-app-rights-link");rights.style.flex="0 0 auto";rights.style.marginBottom="10px";root.appendChild(rights);
  const list=el("div",undefined,"tp-app-actions");
  list.append(button(TPText.t("settings.sound",{value:TPText.t(["sound.off","sound.vibration","sound.on"][soundMode])}),()=>{setSoundMode((soundMode+1)%3);if(soundMode!==0)playSfx(18);show("settings");}),button(TPText.t("settings.language",{value:TPText.t(["language.es","language.en","language.fr","language.de","language.it","language.pt","language.ko","language.koNames"][fns.language()])}),()=>{Module.ccall("tp_set_language",null,["number"],[(fns.language()+1)%LANG_CODES.length]);saveNow(Module);show("settings");}),button("Dateien verwalten",()=>show("files")),button("Diagnose",()=>show("diagnostics")));
  root.appendChild(list);const danger=el("div",undefined,"tp-app-danger");danger.append(el("p","Startet mit einem neuen Spielstand. Vorherige Sicherheitsabfragen bleiben erhalten."),button("Neues Spiel",()=>{remember(null);clickID("gameReset","settings");}));root.appendChild(danger);
 }else if(which==="files"){
  const list=el("div",undefined,"tp-app-actions");
  for(const[text,id]of [["Grafiken laden (Pokemon und Leiter)","spriteLoad"],["Rufe laden","cryLoad"],["Pokédex-Texte laden","dexEntryLoad"]])list.appendChild(button(text,()=>clickID(id,"files")));
  list.appendChild(button("Dateibestand prüfen",()=>legacy(["Dateien","Assets"],"files")));root.appendChild(list);
 }else if(which==="diagnostics"){
  applyHubDesign();root.className+=" tp-admin-page tp-admin-diagnostics";
  const body=el("div",undefined,"tp-diagnostics");root.appendChild(body);
  if(window.TPDiagnostics)window.TPDiagnostics.mount(body,()=>active&&!proxy&&page==="diagnostics");else body.appendChild(el("p","Diagnose nicht verfügbar. Bitte aktuellen Build öffnen."));
 }else if(which==="rights"){
  applyHubDesign();root.className+=" tp-admin-page tp-admin-rights";
  const body=el("div",undefined,"tp-rights-scroll");root.appendChild(body);
  window.TPRights.mount(body,()=>active&&!proxy&&page==="rights").catch(e=>notice(e.message));
 }else if(which==="stories"){
  applyHubDesign();
  const frame=el("div",undefined,"tp-stories-frame");
  frame.setAttribute("aria-hidden","true");
  for(const name of [
   "tp-pokedex-display tp-pokedex-display-left",
   "tp-pokedex-display tp-pokedex-display-right",
   "tp-pokedex-spine"
  ]){
   const part=el("span",undefined,name);
   part.setAttribute("aria-hidden","true");
   frame.appendChild(part);
  }
  const body=el("div");
  const preview=el("div");
  preview.id="tp-story-preview";
  const navigation=el("div",undefined,"tp-stories-nav");
  navigation.hidden=true;
  root.append(frame,body,preview,navigation);
  window.TPStoriesUI.mount(body,{preview,navigation});
 }else if(which==="mew"){
  const body=el("div");root.appendChild(body);window.TPMewUI.mount(body);
 }else if(which==="mewtwo"){
  const body=el("div");root.appendChild(body);window.TPMewtuUI.mount(body);
 }else if(which==="moltres"){
  const body=el("div");root.appendChild(body);window.TPLavadosUI.mount(body);
 }else if(which==="articuno"){
  const body=el("div");root.appendChild(body);window.TPArktosUI.mount(body);
 }else if(which==="zapdos"){
  const body=el("div");root.appendChild(body);window.TPZapdosUI.mount(body);
 }else if(which==="journal"){
  mountJournal();
 }
 decorateAdministration(which);
 const first=root.querySelector("button");if(first)first.focus();window.TPPerformance?.page(which,tpPage);
}
function close(){if(!ready()||tpSaveReplacing||window.TPStoriesUI?.busy)return;disposeJournal();active=false;proxy=null;dexOrigin=false;hideDexNavigation();root.hidden=true;screen="idle";remember(null);canvas.focus?.();}
function applyHubDesign(){
 if(typeof hubDexDesignTokens!=="function")return;
 for(const [name,value] of Object.entries(hubDexDesignTokens())){
  if(shell.style.getPropertyValue?.(name)!==value)
   shell.style.setProperty?.(name,value);
 }
}
function openCollection(){
 if(!quiet())return;
 if(typeof window.TPBoxes?.open!=="function"||
    window.TPBoxes.open("pokedex")!==true){
  notice("Diese Funktion ist gerade nicht verfügbar.");
 }
}
function openHubTool(kind){
 if(!quiet())return;
 const eggs=kind==="eggs";
 const open=eggs?window.TPEggPlanning?.open:
  fns.isEgg()===0?window.TPComfort?.openEvolution:null;
 if(typeof open!=="function"){
  notice("Diese Funktion ist gerade nicht verfügbar.");return;
 }
 pendingOrigin="pokedex";
 if(eggs)remember("pokedex");
 try{open();adopt();}
 catch(error){if(eggs)remember(null);throw error;}
}

let pendingDexReturn=null;
const dexTitle=el("h2",TPText.t("menu.dex"),"tp-dex-heading");
dexTitle.id="tp-dex-title";dexTitle.hidden=true;
const dexBack=button(TPText.t("common.back"),returnFromDex,"tp-dex-nav");
dexBack.id="tp-dex-back";dexBack.hidden=true;
const dexSearch=button("",()=>openSpeciesSearch(dexReturn),"tp-dex-nav");
dexSearch.id="tp-dex-search";dexSearch.hidden=true;
dexSearch.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" '+
 'aria-hidden="true" focusable="false" fill="none" stroke="currentColor" '+
 'stroke-width="2"><circle cx="10" cy="10" r="6"/>'+
 '<path d="m15 15 6 6"/></svg>';
shell.append(dexTitle,dexBack,dexSearch);

function hideDexNavigation(){
 pendingDexReturn=null;
 if(!dexTitle.hidden)dexTitle.hidden=true;
 if(!dexBack.hidden)dexBack.hidden=true;
 if(!dexSearch.hidden)dexSearch.hidden=true;
}
function syncDexNavigation(){
 const shown=screen==="dex"&&dexOrigin&&!active;
 if(pendingDexReturn){
  if(!shown||pendingDexReturn.mod!==Module||
     pendingDexReturn.target!==dexReturn){
   pendingDexReturn=null;
  }else if(quiet()){
   pendingDexReturn=null;
   returnFromDex();
   return;
  }
 }
 const hidden=!shown;
 if(dexTitle.hidden!==hidden)dexTitle.hidden=hidden;
 if(dexBack.hidden!==hidden)dexBack.hidden=hidden;
 if(dexSearch.hidden!==hidden)dexSearch.hidden=hidden;
 if(shown){
  const disabled=!quiet();
  if(dexBack.disabled!==disabled)dexBack.disabled=disabled;
  if(dexSearch.disabled!==disabled)dexSearch.disabled=disabled;
  const titleLabel=TPText.t("menu.dex");
  if(dexTitle.textContent!==titleLabel)dexTitle.textContent=titleLabel;
  const backLabel=TPText.t("common.back");
  if(dexBack.textContent!==backLabel)dexBack.textContent=backLabel;
  const searchLabel=TPText.t("navigation.dexSearch");
  if(dexSearch.getAttribute("aria-label")!==searchLabel)
   dexSearch.setAttribute("aria-label",searchLabel);
 }
}
function returnFromDex(){
 if(!dexOrigin||screen!=="dex"||active)return false;
 if(!quiet()){
  pendingDexReturn={mod:Module,target:dexReturn};
  syncDexNavigation();
  return true;
 }
 pendingDexReturn=null;
 const target=dexReturn;
 if(typeof stopCry==="function")stopCry();
 if(dexScreen==="detail"){
  dexScreen="grid";
  dexDetailPage=0;
  syncDexNavigation();
  return true;
 }
 dexOrigin=false;hideDexNavigation();show(target);
 return true;
}
function openSpeciesDex(origin){
 if(!quiet())return false;
 if(fns.awaitingStarter()!==0||fns.isEgg()!==0||
    typeof openPokedexFromIdle!=="function"||
    typeof swipeAllowed==="function"&&!swipeAllowed()){
  notice("Diese Funktion ist gerade nicht verfügbar.");return false;
 }
 close();
 // UI01: explicit visible entry, independent of horizontal gestures.
 openPokedexFromIdle();
 if(screen!=="dex"){show(origin);return false;}
 dexOrigin=true;dexReturn=origin;
 syncDexNavigation();
 return true;
}
function openSpeciesSearch(origin){
 if(!quiet()||typeof window.TPComfort?.openDex!=="function")return;
 pendingOrigin=origin;
 hideDexNavigation();
 window.TPComfort.openDex();
 adopt();
}
function findLegacy(names){const found=Array.from(document.querySelectorAll(".tp-tools button")).filter(b=>names.includes(b.textContent.trim()));if(found.length!==1)throw Error("Funktion gerade nicht eindeutig verfügbar.");return found[0];}
function legacy(names,origin,keep=false){const b=findLegacy(names);if(b.disabled){notice("Diese Funktion ist gerade nicht verfügbar.");return;}pendingOrigin=origin;if(keep)remember(origin);b.click();adopt();}
function clickID(id,origin){const b=document.getElementById(id);if(!b||b.disabled){notice("Diese Funktion ist gerade nicht verfügbar.");return;}pendingOrigin=origin;b.click();adopt();}
function adopt(){
 for(const overlay of document.querySelectorAll(".tp-modal")){
  overlays.add(overlay);if(overlay.parentNode!==shell)shell.appendChild(overlay);
  if(!watched.has(overlay)){watched.add(overlay);new MutationObserver(sync).observe(overlay,{attributes:true,attributeFilter:["hidden","style","class"],childList:true,subtree:true});}
 }
 sync();
}
function sync(){
 const shown=Array.from(overlays).filter(visible);
 for(const n of shown){const back=n.querySelector(".tp-modal-head button");if(back&&back.textContent!==TPText.t("common.back"))back.textContent=TPText.t("common.back");}
 if(shown.length){if(!proxy)proxy=pendingOrigin;active=true;root.hidden=true;return;}
 if(proxy){const origin=proxy;proxy=null;remember(null);
  if(ready()&&(fns.ceremony()||fns.evolvingNow())){active=false;root.hidden=true;screen="idle";return;}
  if(screen!=="settings"){active=false;root.hidden=true;dexOrigin=screen==="dex";if(dexOrigin)dexReturn=origin;syncDexNavigation();return;}
  show(origin);
 }
}
function species(id){try{const m=typeof TP_DEX_META!=="undefined"&&TP_DEX_META[id-1];if(m&&m.names)return m.names.de||m.names.en;}catch(_e){}return id&&ready()?fns.dexName(id):"Pokémon";}
function actor(e){const name=species(e.s);return e.n?e.n+" ("+name+")":name;}
const personality=["ausgeglichen","verspielt","mutig","ruhig","gemütlich"],game=["Ballspiel","Fangen","Merken","Putzen","Typentraining","Boxsacktraining","Tempotraining","Verteidigungstraining"],route=["Erkundung","Beerenwiese","Quellpfad","Waldlichtung","Trainingspfad"],item=["Nahrung","Energie","Pflege","Training"];
function eventText(e,count=1){
 switch(e.k){
 case 1:return "Ein neues Ei ist angekommen.";
 case 2:return (e.f&1?"Ein schillerndes ":"")+species(e.s)+" ist geschlüpft.";
 case 3:return actor(e)+" hat sich zu "+species(e.a)+" entwickelt.";
 case 4:return e.f&2?TPText.t("zapdos.journalJoin",{
   name:e.s===145?TPText.t("zapdos.artName"):species(e.s)
  }):species(e.s)+" wurde zum ersten Mal gefangen.";
 case 5:return actor(e)+" ist jetzt "+(personality[e.b]||"ausgeglichen")+".";
 case 6:return "Neuer Rekord beim "+(game[e.a]||"Minispiel")+": "+e.b+(e.a===2?" Runden.":e.a===5?" Treffer.":e.a===6?" Trainingsschritte.":e.a===7?" Abwehraktionen.":" Punkte.");
 case 7:return (route[e.a]||"Expedition")+": "+(item[e.b]||"Gegenstand")+" ×"+count+" erhalten.";
 case 8:return actor(e)+" hat Level "+e.a+" erreicht.";
 case 9:return e.a+" Arten aufgezogen.";
 case 10:{const medals=["Level 10","Level 25","Level 50","Lieblingsbeere entdeckt","Sieben Tage Pflegeserie","Starke Bindung","Endform","Fit und gut gepflegt"].filter((_,i)=>e.a&(1<<i));return actor(e)+": Medaille erhalten – "+medals.join(", ")+".";}
 case 12:return "Mega-Stein für "+(window.TPStoreTools?.megaFormInfo?.(e.a)?.baseName||"Glurak")+" erhalten.";
 case 13:return actor(e)+" hat sich in "+(window.TPStoreTools?.megaFormInfo?.(e.a)?.name||"Mega-Glurak X")+" verwandelt.";
 case 14:return actor(e)+" ist zur normalen Form zurückgekehrt.";
 case 11:return e.a===1?"Du hast dich von "+actor(e)+" verabschiedet.":e.a===2?actor(e)+" ist weggelaufen.":"Du hast "+actor(e)+" freigelassen.";
 default:return "";
 }
}
function dayKey(epoch){if(!epoch)return "unknown";const d=new Date(epoch*1000);return [d.getFullYear(),d.getMonth(),d.getDate()].join("-");}
function groupEntries(entries){const out=[];for(const e of entries.slice(-200).reverse()){const prev=out[out.length-1];if(e.k===7&&prev&&prev.e.k===7&&prev.e.a===e.a&&prev.e.b===e.b&&prev.e.s===e.s&&prev.e.n===e.n&&dayKey(prev.e.t)===dayKey(e.t)){prev.count++;prev.first=e.t;}else out.push({e,count:1,first:e.t});}return out;}
function markJournalRead(){
 const service=window.TPJournalUnread;
 if(!service?.supported)return;
 const controls=Array.from(root.querySelectorAll("button"));
 const disabledBefore=controls.map(button=>button.disabled);
 const visit=journalView;
 root.setAttribute("aria-busy","true");
 controls.forEach(button=>button.disabled=true);
 Promise.resolve().then(()=>{
  const opening=service.read();
  return service.acknowledge(opening.total);
 }).catch(error=>{
  if(active&&page==="journal")
   notice(TPText.t(error.code==="RELOAD_REQUIRED"?
    "journalUnread.reload":"journalUnread.saveFailed"));
 }).finally(()=>{
  controls.forEach((button,index)=>{
   if(button.isConnected!==false)button.disabled=disabledBefore[index];
  });
  if(journalView===visit&&visit&&journalLive(visit)){
   root.setAttribute("aria-busy","false");
   journalPaintPage(visit,visit.page);
   journalReflow(visit);
  }
 });
}


// UI01-06: presentation only; the existing read-boundary transaction is retained.
let journalView=null;
const journalKinds=Object.freeze({
 all:null,pokemon:[1,2,3,4,5,11],level:[8],
 success:[6,9,10],expedition:[7],mega:[12,13,14]
});
const journalWords={
 en:{
  all:"All",pokemon:"Pokémon",level:"Level",success:"Milestones",
  expedition:"Expedition",mega:"Mega",filters:"Journal filters",
  previous:"Previous entry",next:"Next entry",
  detail:"Journal entry",noTime:"No timestamp",
  noMatch:"No entries match this filter.",
  empty:"No entries yet. New events are recorded from this version onward.",
  entry:"Entry",favorite:"Favourite berry found",
  titles:["Egg arrived","Hatched","Evolution","New companion","Personality",
   "New record","Expedition","Level up","Raised species","Medal",
   "Farewell","Mega Stone","Mega Evolution","Normal form"]
 },
 de:{
  all:"Alle",pokemon:"Pokémon",level:"Level",success:"Erfolge",
  expedition:"Expedition",mega:"Mega",filters:"Tagebuchfilter",
  previous:"Vorheriger Eintrag",next:"Nächster Eintrag",
  detail:"Tagebucheintrag",noTime:"Ohne Zeitangabe",
  noMatch:"Keine Einträge für diesen Filter.",
  empty:"Noch keine Einträge. Neue Ereignisse werden ab dieser Version festgehalten.",
  entry:"Eintrag",favorite:"Lieblingsbeere entdeckt",
  titles:["Ei angekommen","Geschlüpft","Entwicklung","Neuer Begleiter","Charakter",
   "Neuer Rekord","Expedition","Levelaufstieg","Arten aufgezogen","Medaille",
   "Abschied","Mega-Stein","Mega-Verwandlung","Normalform"]
 },
 es:{
  all:"Todo",pokemon:"Pokémon",level:"Nivel",success:"Logros",
  expedition:"Expedición",mega:"Mega",filters:"Filtros del diario",
  previous:"Entrada anterior",next:"Siguiente entrada",
  detail:"Entrada del diario",noTime:"Sin fecha",
  noMatch:"No hay entradas para este filtro.",
  empty:"Todavía no hay entradas. Los nuevos eventos se registran desde esta versión.",
  entry:"Entrada",favorite:"Baya favorita descubierta",
  titles:["Nuevo huevo","Eclosión","Evolución","Nuevo compañero","Carácter",
   "Nuevo récord","Expedición","Subida de nivel","Especies criadas","Medalla",
   "Despedida","Megapiedra","Megaevolución","Forma normal"]
 },
 fr:{
  all:"Tout",pokemon:"Pokémon",level:"Niveaux",success:"Réussites",
  expedition:"Expédition",mega:"Méga",filters:"Filtres du journal",
  previous:"Entrée précédente",next:"Entrée suivante",
  detail:"Entrée du journal",noTime:"Sans date",
  noMatch:"Aucune entrée pour ce filtre.",
  empty:"Aucune entrée pour le moment. Les nouveaux événements sont enregistrés depuis cette version.",
  entry:"Entrée",favorite:"Baie préférée découverte",
  titles:["Nouvel œuf","Éclosion","Évolution","Nouveau compagnon","Caractère",
   "Nouveau record","Expédition","Niveau gagné","Espèces élevées","Médaille",
   "Au revoir","Méga-Gemme","Méga-Évolution","Forme normale"]
 }
};
for(const code of ["en","de","es","fr"]){
 const words=journalWords[code],entries={};
 for(const [key,value]of Object.entries(words))
  if(key!=="titles")entries["journal.view."+key]=value;
 words.titles.forEach((value,index)=>{
  entries["journal.view.kind"+(index+1)]=value;
 });
 TPText.registerLocale(code,entries);
}
function journalText(key){return TPText.t("journal.view."+key);}
function journalCategory(kind){
 for(const [key,kinds]of Object.entries(journalKinds))
  if(kinds&&kinds.includes(kind))return key;
 return "all";
}
function journalIcon(category){
 const paths={
  all:hubIconPaths.journal,
  pokemon:hubIconPaths.species,
  level:hubIconPaths.evolution,
  success:'<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
  expedition:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16"/>',
  mega:'<path d="m12 2 8 10-8 10-8-10ZM4 12h16M12 2v20"/>'
 };
 const colours={
  all:"#315b83",pokemon:"#963c45",level:"#3e7455",
  success:"#866033",expedition:"#356b70",mega:"#71538a"
 };
 const icon=el("span",undefined,"tp-journal-icon");
 icon.setAttribute("aria-hidden","true");
 icon.style.color=colours[category]||colours.all;
 icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '+
  'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+
  (paths[category]||paths.all)+'</svg>';
 return icon;
}
function journalArrow(direction){
 const icon=el("span",undefined,"tp-journal-arrow");
 icon.setAttribute("aria-hidden","true");
 icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '+
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+
  (direction<0?'<path d="m14 6-6 6 6 6"/>':'<path d="m10 6 6 6-6 6"/>')+
  '</svg>';
 return icon;
}
function journalLive(view){
 return journalView===view&&active&&!proxy&&page==="journal"&&
  Module===view.mod&&view.list.parentNode===root;
}
function disposeJournal(){
 if(journalView?.observer)journalView.observer.disconnect();
 journalView=null;
}
function journalButton(view,label,fn,cls){
 const b=button(label,()=>{
  if(!journalLive(view)||!quiet()||b.disabled||b.isConnected===false)return;
  fn();
 },cls);
 return b;
}
function journalReflow(view){
 // Retained internal completion hook; text now scrolls naturally inside its card.
 if(!journalLive(view))return;
}
function journalTitle(entry){
 return journalText(entry.k===10&&entry.a===8?"favorite":
  entry.k>=1&&entry.k<=14?"kind"+entry.k:"entry");
}
function journalDetail(view){
 if(!journalLive(view))return;
 const group=view.groups.find(g=>g.key===view.selected);
 view.copy.className=view.message?
  "tp-journal-copy tp-app-notice":"tp-journal-copy";
 view.copy.setAttribute("role",view.message?"alert":"status");
 view.badge.replaceChildren();
 view.value.textContent="";
 view.actor.textContent="";
 view.actor.hidden=true;
 view.time.textContent="";
 if(!group&&!view.message){
  view.title.textContent="";
  view.copy.textContent="";
  view.card.hidden=true;
  return;
 }
 view.card.hidden=false;
 const entry=group?.e;
 const category=entry?journalCategory(entry.k):"all";
 view.card.dataset.category=category;
 view.detail.dataset.journalKind=String(entry?.k||0);
 view.badge.appendChild(journalIcon(category));
 view.title.textContent=entry?journalTitle(entry):journalText("detail");
 if(entry){
  if(entry.k===8)view.value.textContent="Lv. "+entry.a;
  else if(entry.k===7)view.value.textContent="×"+group.count;
  else if(entry.k===9)view.value.textContent=String(entry.a);
  if([2,3,4,5,8,10,11,13,14].includes(entry.k)){
   view.actor.textContent=entry.k===3?
    species(entry.s)+" → "+species(entry.a):actor(entry);
   view.actor.hidden=false;
  }
  if(entry.t){
   const date=new Date(entry.t*1000);
   view.time.textContent=date.toLocaleDateString("de-DE",{
    day:"2-digit",month:"2-digit"
   })+" · "+date.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});
   view.time.setAttribute("aria-label",date.toLocaleString("de-DE"));
   view.time.setAttribute("title",date.toLocaleString("de-DE"));
   view.time.setAttribute("datetime",date.toISOString());
  }else view.time.textContent=journalText("noTime");
 }
 view.copy.textContent=view.message||(entry?eventText(entry,group.count):"");
 view.copy.scrollTop=0;
}
function journalFiltered(view){
 return view.groups.filter(g=>
  view.filter==="all"||journalKinds[view.filter].includes(g.e.k)
 );
}
function journalPaintPage(view,requested){
 const filtered=journalFiltered(view);
 view.page=Math.max(0,Math.min(Math.max(0,filtered.length-1),requested));
 const group=filtered[view.page];
 view.selected=group?group.key:null;
 const first=Math.floor(view.page/3)*3;
 const keys=new Set(filtered.slice(first,first+3).map(g=>g.key));
 for(const row of view.rows){
  row.hidden=!keys.has(row.dataset.journalKey);
  row._journalButton.setAttribute(
   "aria-pressed",String(row.dataset.journalKey===view.selected)
  );
 }
 const navigation=filtered.length>1;
 view.previous.hidden=!navigation;
 view.next.hidden=!navigation;
 view.pageCounter.hidden=!navigation;
 view.previous.disabled=!navigation||view.page===0;
 view.next.disabled=!navigation||view.page===filtered.length-1;
 view.pageCounter.textContent=journalText(view.filter)+" · "+
  (filtered.length?view.page+1:0)+" / "+filtered.length;
 view.empty.hidden=filtered.length>0;
 view.empty.textContent=journalText(view.groups.length?"noMatch":"empty");
 journalDetail(view);
}
function journalSelect(view,group){
 const filtered=journalFiltered(view);
 const index=filtered.findIndex(g=>g.key===group.key);
 if(index>=0)journalPaintPage(view,index);
}
function renderJournal(list,entries){
 const view=journalView;
 if(!view||view.list!==list||!journalLive(view))return;
 const oldSelection=view.selected,oldScroll=view.copy.scrollTop||0;
 entries=Array.isArray(entries)?entries:[];
 let total=entries.length;
 try{
  if(window.TPJournalUnread?.supported){
   const state=window.TPJournalUnread.read();
   total=state.total;
   if(view.boundary===null)view.boundary=state.total-state.unread;
  }
 }catch(_e){}
 const base=total-entries.length;
 const annotated=entries.map((entry,index)=>({
  ...entry,_tpOrdinal:base+index+1,
  _tpUnread:view.boundary!==null&&base+index+1>view.boundary
 }));
 view.groups=groupEntries(annotated).map(g=>({
  ...g,key:String(g.e._tpOrdinal)
 }));
 list.replaceChildren();view.rows=[];
 let lastDay=null;
 for(const group of view.groups){
  const e=group.e,key=dayKey(e.t);
  if(key!==lastDay){
   lastDay=key;
   const date=new Date(e.t*1000);
   list.appendChild(el("h3",
    key==="unknown"?"Ohne Zeitangabe":date.toLocaleDateString("de-DE"),
    "tp-app-date tp-journal-sr"));
  }
  const row=el("article",undefined,"tp-app-entry");
  row.dataset.journalKey=group.key;
  row.dataset.journalKind=String(e.k);
  const pick=journalButton(view,"",()=>journalSelect(view,group));
  pick.setAttribute("aria-pressed","false");
  pick.append(
   journalIcon(journalCategory(e.k)),
   el("span",journalText(e.k>=1&&e.k<=14?"kind"+e.k:"entry"),"tp-journal-title")
  );
  if(e._tpUnread){
   const dot=el("span",undefined,"tp-unread-dot");
   dot.setAttribute("aria-hidden","true");pick.appendChild(dot);
   row.dataset.journalNew="true";
   row.setAttribute("aria-description",TPText.t("stories.new"));
  }
  row._journalButton=pick;
  row.append(pick,el("p",eventText(e,group.count),"tp-journal-sr"));
  list.appendChild(row);view.rows.push(row);
 }
 view.empty=el("p",undefined,"tp-journal-empty");
 view.empty.setAttribute("role","status");list.appendChild(view.empty);
 const filtered=journalFiltered(view);
 const selected=filtered.findIndex(g=>g.key===oldSelection);
 journalPaintPage(view,selected>=0?selected:0);
 if(view.selected===oldSelection)view.copy.scrollTop=oldScroll;
}
function mountJournal(){
 applyHubDesign();
 const frame=el("div",undefined,"tp-journal-frame");
 frame.setAttribute("aria-hidden","true");
 for(const name of [
  "tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right",
  "tp-pokedex-spine"
 ]){
  const part=el("span",undefined,name);
  part.setAttribute("aria-hidden","true");frame.appendChild(part);
 }
 const list=el("div",undefined,"tp-app-list tp-journal-list");
 list.id="tp-journal-list";list.tabIndex=0;
 list.setAttribute("aria-label",TPText.t("menu.journalEntries"));
 const detail=el("div",undefined,"tp-journal-detail");
 detail.id="tp-journal-detail";
 detail.setAttribute("role","region");
 detail.setAttribute("aria-label",journalText("detail"));
 const toolbar=el("div",undefined,"tp-journal-toolbar");
 toolbar.setAttribute("role","group");
 toolbar.setAttribute("aria-label",journalText("filters"));
 const view={
  mod:Module,list,detail,toolbar,groups:[],rows:[],
  selected:null,filter:"all",page:0,message:"",
  boundary:null,observer:null,filterButtons:[]
 };
 journalView=view;
 view.card=el("div",undefined,"tp-journal-card");
 const hero=el("div",undefined,"tp-journal-card-hero");
 view.badge=el("div",undefined,"tp-journal-card-badge");
 const heading=el("div",undefined,"tp-journal-card-heading");
 view.title=el("div",undefined,"tp-journal-card-title");
 view.value=el("div",undefined,"tp-journal-card-value");
 heading.append(view.title,view.value);
 hero.append(view.badge,heading);
 view.actor=el("div",undefined,"tp-journal-card-actor");
 view.time=el("time",undefined,"tp-journal-time");
 view.copy=el("p",undefined,"tp-journal-copy");
 view.copy.tabIndex=0;
 view.card.append(hero,view.actor,view.time,view.copy);
 detail.appendChild(view.card);
 for(const category of Object.keys(journalKinds)){
  const pick=journalButton(view,"",()=>{
   view.filter=category;
   for(const b of view.filterButtons)
    b.setAttribute("aria-pressed",String(b.dataset.journalFilter===category));
   journalPaintPage(view,0);
  });
  pick.dataset.journalFilter=category;
  pick.setAttribute("aria-label",journalText(category));
  pick.setAttribute("title",journalText(category));
  pick.setAttribute("aria-pressed",String(category==="all"));
  pick.appendChild(journalIcon(category));
  view.filterButtons.push(pick);toolbar.appendChild(pick);
 }
 view.previous=journalButton(view,"",()=>journalPaintPage(view,view.page-1),
  "tp-journal-entry-nav");
 view.previous.id="tp-journal-prev";
 view.previous.setAttribute("aria-label",journalText("previous"));
 view.next=journalButton(view,"",()=>journalPaintPage(view,view.page+1),
  "tp-journal-entry-nav");
 view.next.id="tp-journal-next";
 view.next.setAttribute("aria-label",journalText("next"));
 for(const [control,direction]of [[view.previous,-1],[view.next,1]]){
  const face=el("span",undefined,"tp-journal-nav-face");
  face.appendChild(journalArrow(direction));control.appendChild(face);
 }
 view.pageCounter=el("span",undefined,"tp-journal-entry-counter");
 view.pageCounter.id="tp-journal-page";
 view.pageCounter.setAttribute("role","status");
 root.append(frame,toolbar,list,detail,view.previous,view.pageCounter,view.next);
 let snapshot;
 try{
  snapshot=Module.ccall("tp_journal_json","string",[],[]);
  renderJournal(list,JSON.parse(snapshot));
  markJournalRead();
 }catch(_e){
  renderJournal(list,[]);
  notice(TPText.t("menu.journalUnavailable"));
 }
 setTimeout(()=>{
  if(!journalLive(view)||!ready()||!quiet())return;
  try{
   const next=Module.ccall("tp_journal_json","string",[],[]);
   if(next!==snapshot)renderJournal(list,JSON.parse(next));
  }catch(_e){}
 },1100);
}

root.addEventListener("pointerdown",e=>{if(page==="main"&&!proxy)gesture={x:e.clientX,y:e.clientY};});
root.addEventListener("pointerup",e=>{if(!gesture)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;if(page==="main"&&Math.abs(dy)>60&&Math.abs(dy)>Math.abs(dx)*1.4){suppressClickUntil=Date.now()+350;e.preventDefault();if(dy<0)close();}});
root.addEventListener("click",e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
root.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();if(page==="main"||page==="pokedex")close();else show(parentPage(page));}if(e.key==="Tab"){const nodes=Array.from(root.querySelectorAll(page==="rights"?"button:not(:disabled),a[href],summary,.tp-rights-scroll":"button:not(:disabled),.tp-app-list,.tp-journal-copy")).filter(n=>page!=="journal"||typeof n.getClientRects!=="function"||n.getClientRects().length>0),first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
canvas.addEventListener("keydown",e=>{if(e.key==="ArrowDown"&&screen==="idle"&&quiet()&&(typeof swipeAllowed!=="function"||swipeAllowed())){e.preventDefault();show("main");}});
adopt();new MutationObserver(adopt).observe(document.body,{childList:true});
window.TPAppMenu={
 markReady(){coreReady=true;if(!restoreChecked){restoreChecked=true;let target=null;try{target=sessionStorage.getItem("tp-app-return");}catch(_e){}remember(null);if(["main","pokedex"].includes(target))show(target);}},
 swipe(dir){if(!quiet())return false;if(screen==="idle"&&dir>0&&choice==="none"){show("main");return true;}if(screen==="dex"&&dexOrigin)return returnFromDex();return false;},
 canvasTap(x,y){
  if(active)return true;
  if(screen!=="dex"||!dexOrigin)return false;
  if(!quiet())return true;
  if(dexScreen==="grid")hubDexGridTap(x,y);
  else hubDexDetailTap(x,y);
  return true;
 },
 returnDex:returnFromDex,
 drawDexBack(){syncDexNavigation();},
 show,close,eventText,groupEntries,dayKey,
 get ready(){return ready();},
 get active(){return active;},
 get page(){return page;},
 get dexFromHub(){return dexOrigin&&!active&&screen==="dex";}
};
setInterval(()=>{
 syncDexNavigation();
 if(active&&ready()&&(fns.ceremony()||fns.evolvingNow())){for(const n of overlays)if(visible(n)){const b=n.querySelector(".tp-modal-head button");b?.click();if(visible(n))n.hidden=true;}active=false;proxy=null;root.hidden=true;screen="idle";remember(null);}
},150);
})();
