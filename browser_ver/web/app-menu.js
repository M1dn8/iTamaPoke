// C5: in-game home menu and diary; existing functions become full-size pages.
(function(){
"use strict";
let coreReady=false,active=false,page="main",proxy=null,pendingOrigin="main",dexOrigin=false,restoreChecked=false,gesture=null,suppressClickUntil=0;
const canvas=document.getElementById("tp"),shell=document.createElement("div");shell.id="tp-game-shell";canvas.parentNode.insertBefore(shell,canvas);shell.appendChild(canvas);canvas.tabIndex=0;canvas.setAttribute("aria-label","Pokémon-Spiel. Nach unten wischen oder Pfeil nach unten: Menü.");
const root=document.createElement("section");root.id="tp-app-page";root.hidden=true;root.setAttribute("aria-label","Spielmenü");root.setAttribute("lang","de");shell.appendChild(root);
const overlays=new Set(),watched=new WeakSet();
function visible(n){if(n.hidden||n.style.display==="none")return false;const c=typeof getComputedStyle==="function"?getComputedStyle(n):null;return !c||(c.display!=="none"&&c.visibility!=="hidden");}
function ready(){return coreReady&&!!Module&&!!fns;}
function quiet(){return ready()&&!window.TPBoxes?.active&&!window.TPCollectionGame?.dialogOpen&&!tpSaveReplacing&&!(window.TPExpeditions&&window.TPExpeditions.busy)&&!["game","gamemenu","battle","trainer","keyboard","arena"].includes(screen)&&!fns.ceremony()&&!fns.evolvingNow()&&!fns.wildPromptActive()&&choice==="none";}
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function button(text,fn,cls){const b=el("button",text,cls);b.type="button";b.addEventListener("click",e=>{if(Date.now()<suppressClickUntil){e.preventDefault();return;}try{fn();}catch(err){notice(err.message||String(err));}});return b;}
function notice(text){let n=root.querySelector(".tp-app-notice");if(!n){n=el("p",undefined,"tp-app-notice");n.setAttribute("role","status");root.appendChild(n);}n.textContent=text;}
function remember(value){try{if(value)sessionStorage.setItem("tp-app-return",value);else sessionStorage.removeItem("tp-app-return");}catch(_e){}}
function show(which="main"){
 if(!quiet())return;const tpPage=window.TPPerformance?.begin();active=true;page=which;screen="settings";root.hidden=false;root.replaceChildren();root.className=which==="main"?"tp-app-main":"";
 dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;
 const head=el("header",undefined,"tp-app-head");head.appendChild(el("h2",{main:"Menü",journal:"Tagebuch",settings:"Einstellungen",files:"Dateien",diagnostics:"Diagnose",rights:"Quellen & Nutzungsrechte"}[which]||"Menü"));
 if(which!=="main")head.appendChild(button("Zurück",()=>show(["files","diagnostics","rights"].includes(which)?"settings":"main")));
 root.appendChild(head);
 if(which==="main"){
  const grid=el("div",undefined,"tp-app-grid");
  for(const[text,fn]of [["Tagebuch",()=>show("journal")],["Entwicklung",()=>legacy(["Entwicklung"],"main")],["Pokédex",()=>legacy(["Dex-Suche","Pokédex-Suche"],"main")],["Eier",()=>legacy(["Eier"],"main",true)],["Sicherungen",()=>legacy(["Sicherungen","Sicherung prüfen","Sicherung pruefen"],"main",true)],["Einstellungen",()=>show("settings")]])grid.appendChild(button(text,fn));
  root.append(grid,button("Zurück zum Pokémon",close,"tp-app-home"));
 }else if(which==="settings"){
  const list=el("div",undefined,"tp-app-actions");
  list.append(button("Ton: "+["Aus","Vibration","An"][soundMode],()=>{setSoundMode((soundMode+1)%3);if(soundMode!==0)playSfx(18);show("settings");}),button("Sprache: "+["Spanisch","Englisch","Französisch","Deutsch","Italienisch","Portugiesisch","Koreanisch","Koreanische Namen"][fns.language()],()=>{Module.ccall("tp_set_language",null,["number"],[(fns.language()+1)%LANG_CODES.length]);saveNow(Module);show("settings");}),button("Dateien verwalten",()=>show("files")),button("Diagnose",()=>show("diagnostics")),button("Quellen & Nutzungsrechte",()=>show("rights")));
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
 }else if(which==="journal"){
  const list=el("div",undefined,"tp-app-list");list.tabIndex=0;list.setAttribute("aria-label","Tagebucheinträge");root.appendChild(list);
  try{const snapshot=Module.ccall("tp_journal_json","string",[],[]);renderJournal(list,JSON.parse(snapshot));setTimeout(()=>{if(!active||proxy||page!=="journal"||!ready())return;try{const next=Module.ccall("tp_journal_json","string",[],[]);if(next!==snapshot){const top=list.scrollTop;list.replaceChildren();renderJournal(list,JSON.parse(next));list.scrollTop=top;}}catch(_e){}},1100);}catch(_e){list.appendChild(el("p","Tagebuch nicht verfügbar. Bitte den aktuellen Test-Build öffnen."));}
 }
 const first=root.querySelector("button");if(first)first.focus();window.TPPerformance?.page(which,tpPage);
}
function close(){if(!ready()||tpSaveReplacing)return;active=false;proxy=null;dexOrigin=false;root.hidden=true;screen="idle";remember(null);canvas.focus?.();}
function findLegacy(names){const found=Array.from(document.querySelectorAll(".tp-tools button")).filter(b=>names.includes(b.textContent.trim()));if(found.length!==1)throw Error("Funktion gerade nicht eindeutig verfügbar.");return found[0];}
function legacy(names,origin,keep=false){const b=findLegacy(names);if(b.disabled){notice("Diese Funktion ist gerade nicht verfügbar.");return;}pendingOrigin=origin;if(keep)remember("main");b.click();adopt();}
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
 for(const n of shown){const back=n.querySelector(".tp-modal-head button");if(back&&back.textContent!=="Zurück")back.textContent="Zurück";}
 if(shown.length){if(!proxy)proxy=pendingOrigin;active=true;root.hidden=true;return;}
 if(proxy){const origin=proxy;proxy=null;remember(null);
  if(ready()&&(fns.ceremony()||fns.evolvingNow())){active=false;root.hidden=true;screen="idle";return;}
  if(screen!=="settings"){active=false;root.hidden=true;dexOrigin=screen==="dex";return;}
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
 case 4:return species(e.s)+" wurde zum ersten Mal gefangen.";
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
function renderJournal(list,entries){
 if(!Array.isArray(entries)||!entries.length){list.appendChild(el("p","Noch keine Einträge. Neue Ereignisse werden ab dieser Version festgehalten."));return;}
 let lastDay=null;for(const g of groupEntries(entries)){
  const e=g.e,key=dayKey(e.t);if(key!==lastDay){lastDay=key;const d=new Date(e.t*1000),today=dayKey(Math.floor(Date.now()/1000)),y=new Date();y.setDate(y.getDate()-1);list.appendChild(el("h3",key==="unknown"?"Ohne Zeitangabe":key===today?"Heute":key===[y.getFullYear(),y.getMonth(),y.getDate()].join("-")?"Gestern":d.toLocaleDateString("de-DE"),"tp-app-date"));}
  const row=el("article",undefined,"tp-app-entry");const time=e.t?new Date(e.t*1000).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}):"—";
  row.append(el("time",time),el("p",eventText(e,g.count)));list.appendChild(row);
 }
}
root.addEventListener("pointerdown",e=>{if(page==="main"&&!proxy)gesture={x:e.clientX,y:e.clientY};});
root.addEventListener("pointerup",e=>{if(!gesture)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;if(page==="main"&&Math.abs(dy)>60&&Math.abs(dy)>Math.abs(dx)*1.4){suppressClickUntil=Date.now()+350;e.preventDefault();if(dy<0)close();}});
root.addEventListener("click",e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
root.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();if(page==="main")close();else show(["files","diagnostics","rights"].includes(page)?"settings":"main");}if(e.key==="Tab"){const nodes=Array.from(root.querySelectorAll(page==="rights"?"button:not(:disabled),a[href],summary,.tp-rights-scroll":"button:not(:disabled),.tp-app-list")),first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
canvas.addEventListener("keydown",e=>{if(e.key==="ArrowDown"&&screen==="idle"&&quiet()&&(typeof swipeAllowed!=="function"||swipeAllowed())){e.preventDefault();show("main");}});
adopt();new MutationObserver(adopt).observe(document.body,{childList:true});
window.TPAppMenu={
 markReady(){coreReady=true;if(!restoreChecked){restoreChecked=true;let target=null;try{target=sessionStorage.getItem("tp-app-return");}catch(_e){}remember(null);if(target)show("main");}},
 swipe(dir){if(!quiet())return false;if(screen==="idle"&&dir>0&&choice==="none"){show("main");return true;}if(screen==="dex"&&dexOrigin){dexOrigin=false;show("main");return true;}return false;},
 canvasTap(x,y){if(active)return true;if(screen==="dex"&&dexOrigin&&x>=360&&x<=456&&y>=8&&y<=44){dexOrigin=false;show("main");return true;}return false;},
 returnDex(){if(!dexOrigin)return false;dexOrigin=false;show("main");return true;},
 drawDexBack(){if(!dexOrigin)return;ctx.fillStyle=UI.white;roundRect(360,8,96,36,8);ctx.fill();ctx.strokeStyle=UI.track;ctx.lineWidth=1;roundRect(360,8,96,36,8);ctx.stroke();ctx.fillStyle=UI.ink;ctx.font="bold 13px monospace";ctx.textAlign="center";ctx.fillText("Menü",408,31);},
 show,close,eventText,groupEntries,dayKey,
 get ready(){return ready();},
 get active(){return active;}
};
setInterval(()=>{
 if(active&&ready()&&(fns.ceremony()||fns.evolvingNow())){for(const n of overlays)if(visible(n)){const b=n.querySelector(".tp-modal-head button");b?.click();if(visible(n))n.hidden=true;}active=false;proxy=null;root.hidden=true;screen="idle";remember(null);}
},150);
})();
