// E1: Mega page inside the existing Pokemon card. No new home tile.
(function(){
"use strict";
let busy=false,cached=null,readAt=0,message="",messageUntil=0;
function call(name,...args){return Module.ccall(name,"number",args.map(()=>"number"),args);}
function view(force=false){try{if(!Module)return null;if(!busy&&(force||!cached||Date.now()-readAt>250)){cached=JSON.parse(Module.ccall("tp_e_view","string",[],[]));readAt=Date.now();}return cached;}catch(_e){return null;}}
function tell(text){message=text;messageUntil=Date.now()+5000;}
function quiet(){return !!Module&&!!fns&&!busy&&!tpSaveReplacing&&!window.TPExpeditions?.busy&&screen==="card"&&cardPage===8&&choice==="none"&&!fns.sleeping()&&!fns.ceremony()&&!fns.evolvingNow()&&!fns.wildPromptActive();}
async function act(action){
 if(!quiet()){tell("Bitte laufenden Vorgang beenden.");return false;}
 const v=view(true);if(!v?.supported)return false;const info=typeof TPStoreTools.megaFormInfo==="function"?TPStoreTools.megaFormInfo(v.form):null;if(!info||info.dex!==v.dex){tell("Bitte aktuellen Mega-Build öffnen.");return false;}if(action===0&&!v.quest)return false;if(action===1&&(!v.stone||v.active||v.now<v.cool))return false;
 const mod=Module;let begun=false,committed=false,locked=false;busy=true;
 try{
  if(action===1){let sprite;try{sprite=await loadMegaSprite(!!v.shiny,v.form);}catch(e){window.TPDiagnostics?.record("manager",e);tell("Mega-Grafik nicht lesbar. Bitte gültige TPK2-Datei laden.");return false;}if(!sprite){tell((v.shiny?info.shiny:info.normal)+" fehlt. Unter Dateien laden.");return false;}}
  if(Module!==mod||tpSaveReplacing||window.TPExpeditions?.busy){tell("Bitte laufenden Speichervorgang abwarten.");return false;}
  tpSaveReplacing=true;tpSaveEpoch++;locked=true;
  if(!mod.ccall("tp_e_apply","number",["number"],[action])){tell("Voraussetzungen haben sich geändert.");return false;}
  begun=true;await writeSave(exportStateBytes(mod),true);committed=true;
  if(!mod.ccall("tp_e_finish","number",["number"],[1]))throw Error("Mega-Commit nicht bestätigt");
  tell(action===0?"Mega-Stein erhalten!":v.name+" aktiviert!");if(typeof playSfx==="function")playSfx(action===0?6:5);return true;
 }catch(e){if(begun&&!committed)mod.ccall("tp_e_finish","number",["number"],[0]);window.TPDiagnostics?.record("manager",e);tell(committed?"Gespeichert. Bei Problemen App neu öffnen.":"Speichern fehlgeschlagen – Aktion zurückgenommen.");return false;}
 finally{if(locked){tpSaveEpoch++;tpSaveReplacing=false;}busy=false;cached=null;readAt=0;}
}
function line(text,y,size=14,color=UI.ink){ctx.font=size+"px monospace";ctx.fillStyle=color;ctx.textAlign="center";ctx.fillText(text,TP.cx,y);}
function stateText(v){if(v.active)return "Mega-Form: noch "+Math.max(1,Math.ceil((v.end-v.now)/60))+" Minuten";if(!v.stone)return v.quest?"Mega-Prüfung bestanden":"Mega-Prüfung";if(v.cool>v.now)return "Wieder bereit in "+Math.ceil((v.cool-v.now)/60)+" Minuten";return "Mega-Entwicklung bereit";}
function button(text,y,enabled){ctx.fillStyle=enabled?UI.white:UI.track;roundRect(75,y,316,44,10);ctx.fill();ctx.strokeStyle=UI.ink;ctx.lineWidth=1;ctx.stroke();line(text,y+28,16);}

/* UI01 Mega page: circular dual display */
const megaPageWords={"de": {"title": "Mega-Entwicklung", "loading": "Mega-Daten werden geladen …", "stone": "Mega-Stein", "owned": "Vorhanden", "notOwned": "Noch nicht erhalten", "quest": "Mega-Prüfung", "claim": "Stein freischaltbar", "ready": "Bereit", "active": "Mega-Form aktiv", "cooldown": "Erholt sich", "sleep": "Schläft", "unsupported": "Keine Mega-Form verfügbar", "bond": "Bindung", "care": "Pflege", "training": "Training", "careHelp": "Alle Pflegewerte mindestens 60.", "trainingHelp": "Ball · Merken · Typen · Boxsack", "claimAction": "Mega-Stein erhalten", "activateAction": "Mega-Entwicklung starten", "saving": "Speichern …", "activeAction": "Mega aktiv", "coolAction": "Erholung läuft", "duration": "15 Min. aktiv · 60 Min. Pause", "remaining": "Restzeit", "rest": "Erholung", "back": "Zurück", "preview": "Wertevorschau"}, "en": {"title": "Mega Evolution", "loading": "Loading Mega data …", "stone": "Mega Stone", "owned": "Owned", "notOwned": "Not obtained yet", "quest": "Mega challenge", "claim": "Stone available", "ready": "Ready", "active": "Mega form active", "cooldown": "Recovering", "sleep": "Sleeping", "unsupported": "No Mega form available", "bond": "Bond", "care": "Care", "training": "Training", "careHelp": "All care values at least 60.", "trainingHelp": "Ball · Memory · Types · Punching bag", "claimAction": "Obtain Mega Stone", "activateAction": "Start Mega Evolution", "saving": "Saving …", "activeAction": "Mega active", "coolAction": "Recovering", "duration": "Active 15 min · Rest 60 min", "remaining": "Time left", "rest": "Recovery", "back": "Back", "preview": "Stat preview"}, "es": {"title": "Megaevolución", "loading": "Cargando datos Mega …", "stone": "Megapiedra", "owned": "Obtenida", "notOwned": "Aún no obtenida", "quest": "Prueba Mega", "claim": "Piedra disponible", "ready": "Listo", "active": "Forma Mega activa", "cooldown": "En recuperación", "sleep": "Durmiendo", "unsupported": "No hay forma Mega", "bond": "Vínculo", "care": "Cuidados", "training": "Entreno", "careHelp": "Todos los cuidados al menos a 60.", "trainingHelp": "Pelota · Memoria · Tipos · Saco", "claimAction": "Obtener Megapiedra", "activateAction": "Iniciar megaevolución", "saving": "Guardando …", "activeAction": "Mega activa", "coolAction": "Recuperándose", "duration": "Activa 15 min · Pausa 60 min", "remaining": "Tiempo", "rest": "Recuperación", "back": "Volver", "preview": "Vista de atributos"}, "fr": {"title": "Méga-Évolution", "loading": "Chargement des données Méga …", "stone": "Méga-Gemme", "owned": "Obtenue", "notOwned": "Pas encore obtenue", "quest": "Épreuve Méga", "claim": "Gemme disponible", "ready": "Prêt", "active": "Forme Méga active", "cooldown": "Récupération", "sleep": "Endormi", "unsupported": "Aucune forme Méga", "bond": "Lien", "care": "Soins", "training": "Entraîn.", "careHelp": "Toutes les valeurs de soins à 60 minimum.", "trainingHelp": "Balle · Mémoire · Types · Sac", "claimAction": "Obtenir la Méga-Gemme", "activateAction": "Lancer la Méga-Évolution", "saving": "Sauvegarde …", "activeAction": "Méga active", "coolAction": "Récupération", "duration": "Active 15 min · Pause 60 min", "remaining": "Temps restant", "rest": "Récupération", "back": "Retour", "preview": "Aperçu des stats"}};
if(window.TPText?.registerLocale){
 for(const code of ["en","de","es","fr"]){
  TPText.registerLocale(code,Object.fromEntries(
   Object.entries(megaPageWords[code]).map(([key,value])=>["megaPage."+key,value])
  ));
 }
}
/* UI01 Mega revision 2: persistent portrait and energy aura */
const megaRevisionWords={"en": {"basis": "Base", "megaValues": "Mega stats", "preview": "Mega preview"}, "de": {"basis": "Basis", "megaValues": "Mega-Werte", "preview": "Mega-Vorschau"}, "es": {"basis": "Base", "megaValues": "Atributos Mega", "preview": "Vista Mega"}, "fr": {"basis": "Base", "megaValues": "Stats Méga", "preview": "Aperçu Méga"}};
if(window.TPText?.registerLocale){
 for(const code of ["en","de","es","fr"]){
  TPText.registerLocale(code,Object.fromEntries(
   Object.entries(megaRevisionWords[code]).map(([key,value])=>["megaPage."+key,value])
  ));
 }
}

const mt=(key)=>TPText.t("megaPage."+key);
let pageRoot=null,pageRAF=null,pageKey="",pageCanvas=null,pageSnapshot=null;
let pageBuffer=null,pagePaintAt=-Infinity,pageOwner=null;
let pageParts=null,rightPanelKey='',lastPageActive=null;
const megaPageGoldMarkup=('<svg viewBox="0 0 28 28" fill="none">'+
   '<defs><linearGradient id="tp-profile-mega-gold" x1="3" y1="2" x2="25" y2="27" gradientUnits="userSpaceOnUse">'+
   '<stop stop-color="#fff4bd"/><stop offset=".23" stop-color="#edc65c"/>'+
   '<stop offset=".47" stop-color="#b77c20"/><stop offset=".61" stop-color="#ffe79b"/>'+
   '<stop offset="1" stop-color="#c58b2c"/></linearGradient></defs>'+
   '<path d="m14 2 11 6v12l-11 6-11-6V8Z" fill="url(#tp-profile-mega-gold)" stroke="#88601f" stroke-width="1.3"/>'+
   '<path d="M8 19V9l6 6 6-6v10" stroke="#805419" stroke-width="2" stroke-linejoin="round"/>'+
   '<path d="m5 9 9-5 8 4M5 10v8" stroke="#fff7ce" stroke-width="1.4" stroke-linecap="round"/>'+
   '<path d="M23 2v6m-3-3h6" stroke="#fff6ce" stroke-width="1.1" stroke-linecap="round"/>'+
   '</svg>').replaceAll('tp-profile-mega-gold','tp-mega-page-gold');

function megaPageMode(v,sleeping){
 if(!v)return "loading";
 if(!v.supported)return "unsupported";
 if(v.active)return "active";
 if(sleeping)return "sleep";
 if(v.stone)return v.cool>v.now?"cooldown":"ready";
 return v.quest?"claim":"quest";
}
function megaClockValue(v){
 const total=v.active?900:3600;
 const seconds=Math.max(0,Math.ceil((v.active?v.end:v.cool)-v.now));
 return {seconds,total,ratio:Math.min(1,seconds/total)};
}
function mn(tag,text,cls){
 const element=document.createElement(tag);
 if(text!==undefined)element.textContent=text;
 if(cls)element.className=cls;
 return element;
}
function megaIcon(kind){
 const element=mn("span",undefined,"tp-mega-icon");
 element.setAttribute("aria-hidden","true");
 const shapes={
  stone:'<path d="m12 2 9 6v9l-9 5-9-5V8Zm-9 6 9 5 9-5m-9 5v9M7 5l5 8 5-8"/>',
  heart:'<path d="M12 21 4 12C-2 5 6 0 12 7c6-7 14-2 8 5Z"/>',
  care:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Zm-5 10 3 3 7-7"/>',
  train:'<path d="M3 8v8m3-10v12m12-12v12m3-10v8M6 12h12"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>'
 };
 element.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+shapes[kind]+'</svg>';
 return element;
}
function ownsPage(){
 return !!Module&&screen==="card"&&cardPage===8&&
  !fns.ceremony()&&!fns.evolvingNow()&&
  !window.TPAppMenu?.active&&!window.TPBoxes?.active&&
  !window.TPAdmissionUI?.active&&!window.TPCollectionGame?.dialogOpen;
}
function pageLocked(){
 return busy||tpSaveReplacing||!!window.TPCollection?.busy||
  !!window.TPCollection?.blocked||!!window.TPExpeditions?.busy;
}
function hidePage(){
 if(pageRoot)pageRoot.hidden=true;
 if(pageRAF!==null)cancelAnimationFrame(pageRAF);
 pageRAF=null;pageKey="";pageCanvas=null;pageSnapshot=null;pageOwner=null;
 rightPanelKey="";lastPageActive=null;pagePaintAt=-Infinity;
}
function backPage(){
 if(pageLocked())return;
 hidePage();cardPage=0;screen="card";
 if(typeof statusUI!=="undefined")statusUI.draw(performance.now());
}
function ensurePage(){
 if(pageRoot)return true;
 const host=document.getElementById("tp-game-shell");
 if(!host)return false;
 pageRoot=mn("section");pageRoot.id="tp-mega-page";pageRoot.hidden=true;
 pageRoot.setAttribute("aria-label",mt("title"));host.append(pageRoot);
 document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&ownsPage()&&!pageRoot.hidden){
   event.preventDefault();event.stopImmediatePropagation();backPage();
  }
 },true);
 return true;
}
function clockTile(v){
 const value=megaClockValue(v),tile=mn("div",undefined,"tp-mega-clock");
 tile.dataset.megaClock="";
 const circle=mn("span",undefined,"tp-mega-clock-ring");
 circle.setAttribute("aria-hidden","true");
 circle.innerHTML='<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="var(--tp-track)" stroke-width="3"/>'+
  '<circle cx="20" cy="20" r="16" pathLength="100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="'+(value.ratio*100)+' 100" transform="rotate(-90 20 20)"/></svg>';
 const text=mn("div");
 const formatted=Math.floor(value.seconds/60)+":"+String(value.seconds%60).padStart(2,"0");
 text.append(mn("span",mt(v.active?"remaining":"rest")),mn("strong",formatted));
 tile.append(circle,text);return tile;
}
function previewRows(v){
 const rows=mn("div",undefined,"tp-mega-preview");
 const percentages=[160,140,125];
 for(let index=0;index<3;index++){
  const row=mn("div");row.dataset.megaStat=String(index);
  row.append(mn("span",fns.statLabel(index)),
   mn("strong",v.base[index]+" → "+Math.floor(v.base[index]*percentages[index]/100)));
  rows.append(row);
 }
 return rows;
}
function requirementRows(v){
 const rows=mn("div",undefined,"tp-mega-requirements");
 for(const [kind,key,value,target]of [
  ["heart","bond",v.bond,50],["care","care",v.care,60],["train","training",v.training,3]
 ]){
  const row=mn("div",undefined,"tp-mega-requirement");
  row.dataset.megaRequirement=key;row.dataset.done=String(value>=target);
  if(key==="care")row.title=mt("careHelp");
  if(key==="training")row.title=mt("trainingHelp");
  row.append(megaIcon(kind),mn("span",mt(key)),
   mn("strong",value+" / "+target),mn("span",value>=target?"✓":"○"));
  rows.append(row);
 }
 return rows;
}

function setMegaText(element,value){
 if(element.textContent!==String(value))element.textContent=String(value);
}
function megaStoneArt(){
 const art=mn("span",undefined,"tp-mega-crystal");
 art.setAttribute("aria-hidden","true");
 art.innerHTML='<svg viewBox="0 0 30 34" fill="none">'+
  '<defs><radialGradient id="tp-mega-crystal-colour" cx=".3" cy=".25" r=".85">'+
  '<stop stop-color="#e4dbff"/><stop offset=".32" stop-color="#99d7ed"/>'+
  '<stop offset=".65" stop-color="#a981cb"/><stop offset="1" stop-color="#57496f"/>'+
  '</radialGradient></defs>'+
  '<ellipse cx="15" cy="17" rx="10" ry="14" transform="rotate(17 15 17)" fill="url(#tp-mega-crystal-colour)" stroke="#8e713c" stroke-width="1.4"/>'+
  '<path d="M19 6c-15 7 9 13-8 22" stroke="#f2a6d9" stroke-width="4" stroke-linecap="round"/>'+
  '<path d="M19 6c-15 7 9 13-8 22" stroke="#fff1fc" stroke-width="1.1" stroke-linecap="round"/>'+
  '<path d="M10 7C5 12 5 18 7 22" stroke="#fff7f1" stroke-width="2" stroke-linecap="round"/>'+
  '<path d="M23 2v6m-3-3h6" stroke="#f7e4af" stroke-width="1.1"/>'+
  '</svg>';
 return art;
}
function ensureMegaShell(){
 if(pageParts){
  pageCanvas=pageParts.canvas;
  return pageParts;
 }
 pageRoot.replaceChildren();

 const head=mn("div",undefined,"tp-status-head");
 const title=mn("h2",mt("title"));
 const back=mn("button");back.type="button";back.dataset.megaBack="";
 back.dataset.megaFocus="back";
 const backArt=mn("canvas");backArt.width=backArt.height=24;
 backArt.setAttribute("aria-hidden","true");
 if(window.TPNavBack){
  TPNavBack.draw(backArt.getContext("2d"),0,0,24,"#315b83");back.append(backArt);
 }else back.textContent="←";
 back.addEventListener("click",backPage);head.append(title,back);

 const phase=mn("div",undefined,"tp-mega-state-line tp-mega-banner");
 const bannerCopy=mn("div",undefined,"tp-mega-banner-copy");
 const phaseTitle=mn("strong");
 const phaseSubtitle=mn("span");
 phaseSubtitle.setAttribute("role","status");
 bannerCopy.append(phaseTitle,phaseSubtitle);
 phase.append(megaStoneArt(),bannerCopy);

 const frame=mn("div",undefined,"tp-status-frame");
 frame.setAttribute("aria-hidden","true");
 for(const cls of ["tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right","tp-pokedex-spine"]){
  frame.append(mn("span",undefined,cls));
 }
 const body=mn("div",undefined,"tp-status-body");
 const left=mn("div",undefined,"tp-status-column");
 const right=mn("div",undefined,"tp-status-column");
 const a=mn("div",undefined,"tp-status-scroll tp-mega-left");
 const b=mn("div",undefined,"tp-status-scroll tp-mega-right");
 left.append(a);right.append(b);body.append(left,right);

 const name=mn("h3",undefined,"tp-mega-form-name");
 const portrait=mn("div",undefined,"tp-mega-portrait-view");
 const halo=mn("span",undefined,"tp-mega-halo");halo.setAttribute("aria-hidden","true");
 halo.innerHTML='<svg viewBox="0 0 100 100">'+
  '<defs><linearGradient id="tp-mega-aura-colour" x1="0" y1="0" x2="1" y2="1">'+
  '<stop stop-color="#77d7e8"/><stop offset=".45" stop-color="#af7bd6"/>'+
  '<stop offset="1" stop-color="#e78fc4"/></linearGradient>'+
  '<filter id="tp-mega-aura-soft" x="-30%" y="-30%" width="160%" height="160%">'+
  '<feGaussianBlur stdDeviation="2"/></filter></defs>'+
  '<circle class="tp-mega-aura-haze" cx="50" cy="50" r="43" fill="none" stroke="url(#tp-mega-aura-colour)" stroke-width="8" filter="url(#tp-mega-aura-soft)"/>'+
  '<circle cx="50" cy="50" r="40" fill="none" stroke="#b58a30" stroke-width="2.4"/>'+
  '<circle cx="50" cy="50" r="38.5" fill="none" stroke="#f3deb0" stroke-width=".8"/>'+
  '<circle class="tp-mega-energy-arc" cx="50" cy="50" r="43" pathLength="100" fill="none" stroke="url(#tp-mega-aura-colour)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="27 73"/>'+
  '<circle class="tp-mega-energy-arc tp-mega-energy-arc-second" cx="50" cy="50" r="46" pathLength="100" fill="none" stroke="#e8c875" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="12 88"/>'+
  '<g class="tp-mega-energy-points" fill="#f8e9ba"><circle cx="50" cy="7" r="1.5"/><circle cx="8" cy="50" r="1"/><circle cx="83" cy="79" r="1.2"/></g>'+
  '<circle class="tp-mega-activation-wave" cx="50" cy="50" r="38" fill="none" stroke="#f2d884" stroke-width="2"/>'+
  '</svg>';
 const emblem=mn("span",undefined,"tp-mega-ring-emblem");
 emblem.setAttribute("aria-hidden","true");emblem.innerHTML=megaPageGoldMarkup;
 const canvas=mn("canvas");canvas.width=canvas.height=160;
 canvas.dataset.megaPortrait="base";canvas.setAttribute("role","img");
 portrait.append(halo,canvas,emblem);

 const timer=mn("div",undefined,"tp-mega-time-plaque");timer.hidden=true;
 timer.dataset.megaTime="";
 const timeLabel=mn("span"),timeValue=mn("strong");
 timer.append(timeLabel,timeValue);
 a.append(name,portrait,timer);
 pageRoot.append(head,phase,frame,body);

 pageParts={title,back,phase,phaseTitle,phaseSubtitle,name,portrait,canvas,
  timer,timeLabel,timeValue,right:b};
 pageCanvas=canvas;
 return pageParts;
}
function megaLargeRequirements(v){
 const stack=mn("div",undefined,"tp-mega-large-requirements");
 for(const [kind,key,value,target]of [
  ["heart","bond",v.bond,50],["care","care",v.care,60],["train","training",v.training,3]
 ]){
  const card=mn("div",undefined,"tp-mega-exam-card");
  card.dataset.megaRequirement=key;card.dataset.done=String(value>=target);
  if(key==="care")card.title=mt("careHelp");
  if(key==="training")card.title=mt("trainingHelp");
  const text=mn("div");
  const valueLine=mn("div",undefined,"tp-mega-exam-number");
  valueLine.append(mn("strong",String(value)),mn("span"," / "+target));
  text.append(mn("span",mt(key),"tp-mega-exam-label"),valueLine);
  card.append(megaIcon(kind),text,mn("span",value>=target?"✓":"○","tp-mega-exam-seal"));
  stack.append(card);
 }
 return stack;
}
function megaValueCards(v){
 const group=mn("div",undefined,"tp-mega-value-group");
 group.append(mn("h4",mt(v.active?"megaValues":"preview")));
 const cards=mn("div",undefined,"tp-mega-value-cards");
 const shapes=[
  '<path d="m5 19 10-10m-5 0 5 5M14 4l6-2-2 6-8 8-4-4Z"/>',
  '<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Z"/>',
  '<path d="m3 6 7 6-7 6m9-12 7 6-7 6"/>'
 ];
 for(let index=0;index<3;index++){
  const card=mn("div",undefined,"tp-mega-stat-card");
  card.dataset.megaStat=String(index);
  const icon=mn("span",undefined,"tp-mega-stat-icon");icon.setAttribute("aria-hidden","true");
  icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+shapes[index]+'</svg>';
  const label=mn("div",undefined,"tp-mega-stat-copy");
  label.append(mn("span",fns.statLabel(index)),mn("small",mt("basis")+" "+v.base[index]));
  const number=mn("strong",String(Math.floor(v.base[index]*[160,140,125][index]/100)));
  card.append(icon,label,number);cards.append(card);
 }
 group.append(cards);return group;
}
function renderMegaRight(v,mode,locked){
 const right=pageParts.right;
 const focused=right.contains(document.activeElement);
 right.replaceChildren();
 if(!v){right.append(mn("p",mt("loading")));return;}
 right.append(v.stone?megaValueCards(v):megaLargeRequirements(v));
 if(v.active)return;
 const action=mn("button");action.type="button";action.dataset.megaFocus="action";
 action.dataset.megaAction=v.stone?"activate":"claim";
 action.disabled=locked||!quiet()||!v.supported||
  (v.stone?Boolean(v.active||v.now<v.cool):!v.quest);
 const key=busy?"saving":!v.stone?"claimAction":v.now<v.cool?"coolAction":"activateAction";
 action.textContent=mt(key);action.title=mt(key);
 action.addEventListener("click",()=>{
  if(action.disabled)return;
  act(v.stone?1:0).catch(error=>{
   window.TPDiagnostics?.record("manager",error);tell(String(error.message||error));
  }).finally(()=>{pageKey="";drawPage();});
 });
 right.append(action);
 if(focused&&!action.disabled)action.focus({preventScroll:true});
}
function renderPage(v,mode,notice,locked){
 const parts=ensureMegaShell();
 pageRoot.dataset.megaMode=mode;
 pageRoot.setAttribute("aria-label",mt("title"));
 setMegaText(parts.title,mt("title"));
 parts.back.disabled=locked;
 parts.back.title=mt("back");parts.back.setAttribute("aria-label",mt("back"));
 setMegaText(parts.phaseTitle,mt(mode));
 setMegaText(parts.phaseSubtitle,notice||(v?.stone?
  mt("stone")+" · "+mt("owned"):mt("stone")+" · "+mt("quest")));
 parts.phase.dataset.notice=String(Boolean(notice));
 parts.phase.dataset.owned=String(Boolean(v?.stone));

 if(v){
  const name=v.active?v.name:fns.dexName(v.dex);
  setMegaText(parts.name,name);
  parts.canvas.dataset.megaPortrait=v.active?"mega":"base";
  parts.canvas.setAttribute("aria-label",name);
  const showTime=Boolean(v.active||v.stone&&v.cool>v.now);
  parts.timer.hidden=!showTime;
  if(showTime){
   const clock=megaClockValue(v);
   setMegaText(parts.timeLabel,mt(v.active?"remaining":"rest"));
   setMegaText(parts.timeValue,
    Math.floor(clock.seconds/60)+":"+String(clock.seconds%60).padStart(2,"0"));
  }
  const activeNow=Boolean(v.active);
  if(lastPageActive===false&&activeNow){
   parts.portrait.classList.add("tp-mega-just-activated");
   setTimeout(()=>parts.portrait.classList.remove("tp-mega-just-activated"),1100);
  }
  lastPageActive=activeNow;
 }else{
  parts.timer.hidden=true;setMegaText(parts.name,mt("loading"));
 }

 const key=JSON.stringify([v?{
  supported:v.supported,stone:v.stone,quest:v.quest,active:v.active,
  training:v.training,bond:v.bond,care:v.care,base:v.base
 }:null,mode,locked,busy,mt("title")]);
 if(key!==rightPanelKey){
  rightPanelKey=key;renderMegaRight(v,mode,locked);
 }
}

function drawPage(){
 if(!ownsPage()){hidePage();return false;}
 if(!ensurePage())return false;
 if(pageOwner&&pageOwner!==Module){hidePage();return false;}
 pageOwner=Module;pageRoot.hidden=false;
 const v=view(),mode=megaPageMode(v,fns.sleeping()!==0);
 const notice=Date.now()<messageUntil?message:"",locked=pageLocked();
 const key=JSON.stringify([v,mode,notice,locked,mt("title")]);
 if(key!==pageKey){
  pageKey=key;pageSnapshot=v;renderPage(v,mode,notice,locked);
 }
 statusEl.textContent=mt("title")+" · "+mt(mode);
 return true;
}

function paintPagePortrait(now){
 if(!pageCanvas||!pageSnapshot||now-pagePaintAt<100)return;
 pagePaintAt=now;
 const v=pageSnapshot;
 const sprite=v.active?megaSpriteFor(Boolean(v.shiny),v.form):spriteFor(v.dex,Boolean(v.shiny));
 const reduced=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
 const act=fns.sleeping()&&sprite?.actions?.[TPAct.sleep]?TPAct.sleep:TPAct.idle;
 const action=sprite?.actions?.[act];
 const image=action?frameImageData(sprite,act,reduced?0:frameIndexAt(action,now,true)):null;
 const bounds=image&&typeof hubDexBounds==="function"?hubDexBounds(image):null;
 const box=pageCanvas.getBoundingClientRect();
 const width=Math.max(1,Math.round(box.width)),height=Math.max(1,Math.round(box.height));
 if(pageCanvas.width!==width||pageCanvas.height!==height){
  pageCanvas.width=width;pageCanvas.height=height;pageCanvas.dataset.hasPortrait="false";
 }
 pageParts.portrait.style.setProperty("--tp-mega-orbit-size",Math.min(width,height)+"px");
 const spriteKey=v.dex+":"+v.form+":"+Boolean(v.active)+":"+Boolean(v.shiny);
 if(!bounds&&pageCanvas.dataset.spriteKey===spriteKey&&
  pageCanvas.dataset.hasPortrait==="true")return;
 const c=pageCanvas.getContext("2d");
 c.clearRect(0,0,width,height);c.imageSmoothingEnabled=false;
 if(!bounds){
  c.fillStyle="#8f839d";c.textAlign="center";c.textBaseline="middle";
  c.font="bold 24px monospace";c.fillText("?",width/2,height/2);
  pageCanvas.dataset.spriteKey=spriteKey;pageCanvas.dataset.hasPortrait="false";return;
 }
 if(!pageBuffer)pageBuffer=document.createElement("canvas");
 if(pageBuffer.width!==image.width)pageBuffer.width=image.width;
 if(pageBuffer.height!==image.height)pageBuffer.height=image.height;
 pageBuffer.getContext("2d").putImageData(image,0,0);
 const scale=Math.min(4,Math.min(width,height)*.72/Math.hypot(bounds.w,bounds.h));
 const w=bounds.w*scale,h=bounds.h*scale;
 c.drawImage(pageBuffer,bounds.x,bounds.y,bounds.w,bounds.h,
  width/2-w/2,height/2-h/2,w,h);
 pageCanvas.dataset.spriteKey=spriteKey;pageCanvas.dataset.hasPortrait="true";
}

function pageFrame(now){
 pageRAF=null;
 if(!drawPage())return;
 paintPagePortrait(now);pageRAF=requestAnimationFrame(pageFrame);
}
function draw(){
 if(!drawPage())return;
 paintPagePortrait(performance.now());
 if(pageRAF===null)pageRAF=requestAnimationFrame(pageFrame);
}

function drawProfileLink(){const v=view();button(v?stateText(v)+" ›":"Zur Mega-Seite ›",324,true);}
function tap(x,y){return ownsPage();}
window.TPMega=Object.freeze({view,act,draw,drawProfileLink,tap,visible:()=>!!view()?.supported,active:()=>!!view()?.active,form:()=>view()?.form||0,name:()=>view()?.name||"Mega-Form",battleForm:()=>{try{return call("tp_e_battle_form");}catch(_e){return 0;}},shiny:()=>{try{return !!call("tp_e_shiny");}catch(_e){return false;}},battleActive:()=>{try{return !!call("tp_e_battle_mega");}catch(_e){return false;}},battleType:i=>{try{return call(i===1?"tp_e_battle_type1":"tp_e_battle_type2");}catch(_e){return 0;}},hide:hidePage,get busy(){return busy;}});
})();
