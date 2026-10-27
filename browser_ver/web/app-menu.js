// C5: in-game home menu and diary; existing functions become full-size pages.
(function(){
"use strict";

const navigationLabels={
 de:["Pokédex-Zentrale","Arten-Pokédex"],
 en:["Pokédex hub","Species Pokédex"],
 es:["Central Pokédex","Pokédex de especies"],
 fr:["Centre Pokédex","Pokédex des espèces"]
};
// New translation keys require the English catalogue first.
for(const code of ["en","de","es","fr"]){
 const labels=navigationLabels[code];
 TPText.registerLocale(code,{
  "navigation.hub":labels[0],"navigation.species":labels[1]
 });
}


// Translate display text only; keep legacy routing labels unchanged.
const menuKeys=Object.freeze({"Pokédex-Zentrale":"navigation.hub","Arten-Pokédex":"navigation.species","Geschichten":"zapdos.menu","Menü":"menu.title","Tagebuch":"menu.journal","Entwicklung":"menu.evolution","Pokédex":"menu.dex","Eier":"menu.eggs","Sicherungen":"menu.backups","Einstellungen":"menu.settings","Dateien":"menu.files","Diagnose":"menu.diagnostics","Quellen & Nutzungsrechte":"menu.rights","Zurück zum Pokémon":"menu.home","Dateien verwalten":"menu.manage","Grafiken laden (Pokemon und Leiter)":"menu.graphics","Rufe laden":"menu.cries","Pokédex-Texte laden":"menu.dextext","Dateibestand prüfen":"menu.inventory","Neues Spiel":"menu.reset","Startet mit einem neuen Spielstand. Vorherige Sicherheitsabfragen bleiben erhalten.":"menu.resetNotice","Diagnose nicht verfügbar. Bitte aktuellen Build öffnen.":"menu.diagnosticsUnavailable","Tagebuch nicht verfügbar. Bitte den aktuellen Test-Build öffnen.":"menu.journalUnavailable","Diese Funktion ist gerade nicht verfügbar.":"menu.unavailable","Funktion gerade nicht eindeutig verfügbar.":"menu.ambiguous","Pokémon-Spiel. Nach unten wischen oder Pfeil nach unten: Menü.":"menu.ariaCanvas","Spielmenü":"menu.aria","Tagebucheinträge":"menu.journalEntries","Zurück":"common.back"});
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
function quiet(){return ready()&&!window.TPCollection?.busy&&!window.TPZapdosUI?.busy&&!window.TPStoriesUI?.busy&&!window.TPBoxes?.active&&!window.TPCollectionGame?.dialogOpen&&!tpSaveReplacing&&!(window.TPExpeditions&&window.TPExpeditions.busy)&&!["game","gamemenu","battle","trainer","keyboard","arena","league"].includes(screen)&&!fns.ceremony()&&!fns.evolvingNow()&&!fns.wildPromptActive()&&choice==="none";}
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=menuText(text);if(cls)n.className=cls;return n;}
function button(text,fn,cls){const b=el("button",text,cls);b.type="button";b.addEventListener("click",e=>{if(Date.now()<suppressClickUntil){e.preventDefault();return;}try{fn();}catch(err){notice(err.message||String(err));}});return b;}
function hubButton(text,fn,key){
 const b=button(text,fn);b.dataset.hub=key;return b;
}
function notice(text){let n=root.querySelector(".tp-app-notice");if(!n){n=el("p",undefined,"tp-app-notice");n.setAttribute("role","status");root.appendChild(n);}n.textContent=menuText(text);}
function remember(value){try{if(value)sessionStorage.setItem("tp-app-return",value);else sessionStorage.removeItem("tp-app-return");}catch(_e){}}
function parentPage(which){
 if(which==="zapdos")return "stories";
 if(which==="stories")return "pokedex";
 if(which==="journal")return sectionOrigin;
 return ["files","diagnostics","rights"].includes(which)?"settings":"main";
}
function show(which="main"){
 if(!quiet())return;if(which==="main"||which==="pokedex")sectionOrigin=which;const tpPage=window.TPPerformance?.begin();active=true;page=which;screen="settings";root.hidden=false;TPText.refresh();root.setAttribute("lang",TPText.language());root.setAttribute("aria-label",TPText.t("menu.aria"));canvas.setAttribute("aria-label",TPText.t("menu.ariaCanvas"));root.replaceChildren();root.className=which==="pokedex"?"tp-app-main tp-pokedex-hub":which==="main"?"tp-app-main":"";
 dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;
 const head=el("header",undefined,"tp-app-head");head.appendChild(el("h2",{stories:"Geschichten",pokedex:"Pokédex-Zentrale",main:"Menü",journal:"Tagebuch",settings:"Einstellungen",files:"Dateien",diagnostics:"Diagnose",rights:"Quellen & Nutzungsrechte",zapdos:TPText.t("zapdos.title")}[which]||"Menü"));
 if(which!=="main")head.appendChild(button("Zurück",()=>which==="pokedex"?close():show(parentPage(which))));
 root.appendChild(head);
 if(which==="main"){
  const grid=el("div",undefined,"tp-app-grid");
  for(const[text,fn]of [["Sicherungen",()=>legacy(["Sicherungen","Sicherung prüfen","Sicherung pruefen"],"main",true)],["Einstellungen",()=>show("settings")]])grid.appendChild(button(text,fn));
  root.append(grid,button("Zurück zum Pokémon",close,"tp-app-home"));
 }else if(which==="pokedex"){
  const grid=el("div",undefined,"tp-app-grid");
  grid.append(
   hubButton("Tagebuch",()=>show("journal"),"journal"),
   hubButton("Geschichten",()=>show("stories"),"stories"),
   button("Arten-Pokédex",()=>openSpeciesDex("pokedex")),
   button("Eier",()=>openHubTool("eggs")),
   button("Entwicklung",()=>openHubTool("evolution"))
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
  const body=el("div",undefined,"tp-diagnostics");root.appendChild(body);
  if(window.TPDiagnostics)window.TPDiagnostics.mount(body,()=>active&&!proxy&&page==="diagnostics");else body.appendChild(el("p","Diagnose nicht verfügbar. Bitte aktuellen Build öffnen."));
 }else if(which==="rights"){
  const body=el("div",undefined,"tp-rights-scroll");root.appendChild(body);window.TPRights.mount(body).catch(e=>notice(e.message));
 }else if(which==="stories"){
  const body=el("div");root.appendChild(body);
  window.TPStoriesUI.mount(body);
 }else if(which==="zapdos"){
  const body=el("div");root.appendChild(body);window.TPZapdosUI.mount(body);
 }else if(which==="journal"){
  const list=el("div",undefined,"tp-app-list");list.tabIndex=0;list.setAttribute("aria-label",TPText.t("menu.journalEntries"));root.appendChild(list);
  try{const snapshot=Module.ccall("tp_journal_json","string",[],[]);renderJournal(list,JSON.parse(snapshot));markJournalRead();setTimeout(()=>{if(!active||proxy||page!=="journal"||!ready())return;try{const next=Module.ccall("tp_journal_json","string",[],[]);if(next!==snapshot){const top=list.scrollTop;list.replaceChildren();renderJournal(list,JSON.parse(next));list.scrollTop=top;}}catch(_e){}},1100);}catch(_e){list.appendChild(el("p","Tagebuch nicht verfügbar. Bitte den aktuellen Test-Build öffnen."));}
 }
 const first=root.querySelector("button");if(first)first.focus();window.TPPerformance?.page(which,tpPage);
}
function close(){if(!ready()||tpSaveReplacing||window.TPStoriesUI?.busy)return;active=false;proxy=null;dexOrigin=false;root.hidden=true;screen="idle";remember(null);canvas.focus?.();}
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
function openSpeciesDex(origin){
 if(!quiet())return;
 if(typeof window.TPComfort?.openDex!=="function"){
  notice("Diese Funktion ist gerade nicht verfügbar.");return;
 }
 pendingOrigin=origin;
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
  if(screen!=="settings"){active=false;root.hidden=true;dexOrigin=screen==="dex";if(dexOrigin)dexReturn=origin;return;}
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
 const controls=Array.from(root.querySelectorAll(".tp-app-head button"));
 controls.forEach(button=>button.disabled=true);
 Promise.resolve().then(()=>{
  const opening=service.read();
  return service.acknowledge(opening.total);
 }).catch(error=>{
  if(active&&page==="journal")
   notice(TPText.t(error.code==="RELOAD_REQUIRED"?
    "journalUnread.reload":"journalUnread.saveFailed"));
 }).finally(()=>{
  for(const button of controls)
   if(button.isConnected)button.disabled=false;
 });
}
function renderJournal(list,entries){
 // Capture new-entry marks before the opening snapshot is acknowledged.
 // Keep them visible during this visit; the next visit uses the saved boundary.
 if(Array.isArray(entries)&&window.TPJournalUnread?.supported){
  try{
   const state=window.TPJournalUnread.read();
   const firstNew=Math.max(0,entries.length-state.unread);
   entries=entries.map((entry,index)=>({
    ...entry,_tpUnread:index>=firstNew
   }));
  }catch(_e){}
 }
 if(!Array.isArray(entries)||!entries.length){list.appendChild(el("p","Noch keine Einträge. Neue Ereignisse werden ab dieser Version festgehalten."));return;}
 let lastDay=null;for(const g of groupEntries(entries)){
  const e=g.e,key=dayKey(e.t);if(key!==lastDay){lastDay=key;const d=new Date(e.t*1000),today=dayKey(Math.floor(Date.now()/1000)),y=new Date();y.setDate(y.getDate()-1);list.appendChild(el("h3",key==="unknown"?"Ohne Zeitangabe":key===today?"Heute":key===[y.getFullYear(),y.getMonth(),y.getDate()].join("-")?"Gestern":d.toLocaleDateString("de-DE"),"tp-app-date"));}
  const row=el("article",undefined,"tp-app-entry");const time=e.t?new Date(e.t*1000).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}):"—";
  const content=el("p",eventText(e,g.count));
  if(e._tpUnread){
   const dot=el("span",undefined,"tp-unread-dot");
   dot.setAttribute("aria-hidden","true");
   content.prepend(dot);
   row.dataset.journalNew="true";
   row.setAttribute("aria-description",TPText.t("stories.new"));
  }
  row.append(el("time",time),content);list.appendChild(row);
 }
}
root.addEventListener("pointerdown",e=>{if(page==="main"&&!proxy)gesture={x:e.clientX,y:e.clientY};});
root.addEventListener("pointerup",e=>{if(!gesture)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;if(page==="main"&&Math.abs(dy)>60&&Math.abs(dy)>Math.abs(dx)*1.4){suppressClickUntil=Date.now()+350;e.preventDefault();if(dy<0)close();}});
root.addEventListener("click",e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
root.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();if(page==="main"||page==="pokedex")close();else show(parentPage(page));}if(e.key==="Tab"){const nodes=Array.from(root.querySelectorAll(page==="rights"?"button:not(:disabled),a[href],summary,.tp-rights-scroll":"button:not(:disabled),.tp-app-list")),first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
canvas.addEventListener("keydown",e=>{if(e.key==="ArrowDown"&&screen==="idle"&&quiet()&&(typeof swipeAllowed!=="function"||swipeAllowed())){e.preventDefault();show("main");}});
adopt();new MutationObserver(adopt).observe(document.body,{childList:true});
window.TPAppMenu={
 markReady(){coreReady=true;if(!restoreChecked){restoreChecked=true;let target=null;try{target=sessionStorage.getItem("tp-app-return");}catch(_e){}remember(null);if(["main","pokedex"].includes(target))show(target);}},
 swipe(dir){if(!quiet())return false;if(screen==="idle"&&dir>0&&choice==="none"){show("main");return true;}if(screen==="dex"&&dexOrigin){dexOrigin=false;show(dexReturn);return true;}return false;},
 canvasTap(x,y){if(active)return true;if(screen==="dex"&&dexOrigin&&x>=360&&x<=456&&y>=8&&y<=44){dexOrigin=false;show(dexReturn);return true;}return false;},
 returnDex(){if(!dexOrigin)return false;dexOrigin=false;show(dexReturn);return true;},
 drawDexBack(){if(!dexOrigin)return;ctx.fillStyle=UI.white;roundRect(360,8,96,36,8);ctx.fill();ctx.strokeStyle=UI.track;ctx.lineWidth=1;roundRect(360,8,96,36,8);ctx.stroke();ctx.fillStyle=UI.ink;ctx.font="bold 13px monospace";ctx.textAlign="center";ctx.fillText(TPText.t(dexReturn==="pokedex"?"menu.dex":"menu.title"),408,31);},
 show,close,eventText,groupEntries,dayKey,
 get ready(){return ready();},
 get active(){return active;}
};
setInterval(()=>{
 if(active&&ready()&&(fns.ceremony()||fns.evolvingNow())){for(const n of overlays)if(visible(n)){const b=n.querySelector(".tp-modal-head button");b?.click();if(visible(n))n.hidden=true;}active=false;proxy=null;root.hidden=true;screen="idle";remember(null);}
},150);
})();
