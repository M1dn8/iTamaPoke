// Package A: local-only development inspector and searchable dex.
let tpDexFilter = {query:"",gen:0,type:0,status:"all"};
let tpDexCacheKey = "";
let tpDexCacheIds = [];
function tpComfortDexIds(){
  const key=JSON.stringify(tpDexFilter)+":"+fns.registeredCount()+":"+fns.caughtCount()+":"+dexFilter;
  if(key!==tpDexCacheKey){
    tpDexCacheKey=key;
    tpDexCacheIds=TP_DEX_META.filter(m=>TPDexTools.matches(m,tpDexFilter,{raised:!!fns.dexRegistered(m.id),caught:!!fns.dexCaught(m.id)})&&dexVisible(m.id)).map(m=>m.id);
  }
  return tpDexCacheIds;
}
(function(){
  "use strict";
  const typeNames=["Alle Typen","Normal","Feuer","Wasser","Elektro","Pflanze","Eis","Kampf","Gift","Boden","Flug","Psycho","Kaefer","Gestein","Geist","Drache","Unlicht","Stahl","Fee"];
  const langCodes=["es","en","fr","de","it","pt","ko","ko"];
  let previousFocus=null;
  let auto=false;
  try{auto=localStorage.getItem("tp-auto-evolve")==="1";}catch(_e){}
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const button=(text,fn)=>{const n=el("button",text);n.type="button";n.addEventListener("click",fn);return n;};
  const style=el("style");style.textContent=`
  .tp-tools{display:flex;gap:8px;flex-wrap:wrap;width:min(100%,466px);margin:8px auto}
  .tp-tools button{flex:1;min-height:44px}
  .tp-modal[hidden]{display:none!important}
  .tp-modal{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.8);padding:12px;padding-top:max(12px,env(safe-area-inset-top));padding-bottom:max(12px,env(safe-area-inset-bottom));box-sizing:border-box;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;text-align:left}
  .tp-panel{background:#171c2b;color:#f4f6ff;border:1px solid #69718d;border-radius:16px;padding:16px;max-width:620px;margin:auto;font:16px/1.45 system-ui;box-sizing:border-box}
  .tp-panel h2{margin:0;font-size:22px}.tp-panel h3{font-size:18px;margin:4px 0 10px}
  .tp-panel button,.tp-panel input,.tp-panel select{font:inherit;min-height:44px;border:1px solid #8790a9;border-radius:8px;padding:8px;background:#272f45;color:#fff;box-sizing:border-box;max-width:100%}
  .tp-panel button:disabled{opacity:.45}.tp-panel button{cursor:pointer}
  .tp-panel input[type=checkbox]{min-height:24px;width:24px;vertical-align:middle;margin-right:8px}
  .tp-panel label{display:block;margin:10px 0}.tp-panel input[type=search],.tp-panel select{width:100%}
  .tp-modal-head,.tp-modal-row{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}
  .tp-card{border:1px solid #66718d;border-radius:12px;padding:12px;margin:12px 0;background:#20283a}
  .tp-card p{margin:5px 0}.tp-small{color:#c3cbdf;font-size:14px}
  .tp-ok{color:#9ce8b8}.tp-no{color:#ffd28c}
  .tp-panel :focus-visible{outline:3px solid #9ebeff;outline-offset:2px}
  `;document.head.appendChild(style);
  const bar=el("div",undefined,"tp-tools");
  const evoButton=button("Entwicklung",()=>openEvolution());
  const dexButton=button("Dex-Suche",()=>openDex());
  bar.append(evoButton,dexButton);
  document.getElementById("tp").before(bar);
  const overlay=el("div",undefined,"tp-modal");overlay.hidden=true;
  const panel=el("section",undefined,"tp-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-labelledby","tp-modal-title");
  overlay.appendChild(panel);document.body.appendChild(overlay);
  function loaded(){return !!Module&&typeof fns.speciesId==="function";}
  function safe(){return loaded()&&!fns.awaitingStarter()&&!["game","gamemenu","battle","keyboard"].includes(screen)&&!fns.evolvingNow()&&!fns.ceremony()&&!fns.wildPromptActive();}
  function updateButtons(){const ok=safe();evoButton.disabled=!ok||!!fns.isEgg();dexButton.disabled=!ok;}
  evoButton.disabled=dexButton.disabled=true;
  setInterval(updateButtons,1000);
  function close(){stopEvolutionGrowth();evolutionView=null;overlay.hidden=true;document.body.style.overflow="";if(previousFocus&&previousFocus.focus)previousFocus.focus();}
  function begin(title){
    if(!safe()){alert("Bitte zuerst Spiel, Kampf oder Dialog beenden.");return false;}
    stopEvolutionGrowth();evolutionView=null;overlay.className="tp-modal";panel.className="tp-panel";previousFocus=document.activeElement;panel.replaceChildren();
    const row=el("div",undefined,"tp-modal-head");const h=el("h2",title);h.id="tp-modal-title";
    const exit=button("Schliessen",()=>{if(evolutionView?.infoOpen)showEvolutionInfo(evolutionView,false);else close();});row.append(h,exit);panel.appendChild(row);
    overlay.hidden=false;document.body.style.overflow="hidden";
    dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;
    exit.focus();return true;
  }
  overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
  overlay.addEventListener("keydown",e=>{
    if(evolutionView)return;
    if(e.key==="Escape"){e.preventDefault();close();return;}
    if(e.key!=="Tab")return;
    const nodes=Array.from(panel.querySelectorAll("button:not(:disabled),input,select,[tabindex='0']")).filter(n=>!n.hidden);
    const first=nodes[0],last=nodes[nodes.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  function name(id){const m=TP_DEX_META[id-1];const lang=langCodes[fns.language()]||"en";return m?(m.names[lang]||m.names.en):String(id);}
  function field(from,i,f){return Module.ccall("tp_evo_rule_field","number",["number","number","number"],[from,i,f]);}
  function check(text,ok){return el("p",(ok?"✓ ":"○ ")+text,ok?"tp-ok":"tp-no");}

let evolutionView=null;
/* UI01 closeout: noBond belongs to the initial locale dictionaries */
const evolutionWords={
 en:{
  noBond:"No minimum bond",
  title:"Evolution",level:"Level",bond:"Bond",care:"Care",awake:"Awake",
  time:"Time",any:"Any",day:"Day",night:"Night",evening:"Evening",
  refresh:"Refresh requirements",auto:"Main-game target selection",
  manualState:"Choose yourself",autoState:"Automatic",info:"Info",
  previous:"Previous evolution target",next:"Next evolution target",
  target:"Target",none:"This species has no further evolution.",
  current:"Current Pokémon",infoLeft:"Care",infoRight:"You decide",
  careInfo:"Level, bond and care must meet the requirements.",
  confirmInfo:"Here you choose and confirm the target.",
  rules:"Simplified game rules · Time conditions use UTC.",
  penalty:"Care mistakes are already included in the required level."
 },
 de:{
  noBond:"Keine Mindestbindung",
  title:"Entwicklung",level:"Level",bond:"Bindung",care:"Pflege",awake:"Wach",
  time:"Zeit",any:"Beliebig",day:"Tagsüber",night:"Nachts",evening:"Abends",
  refresh:"Voraussetzungen aktualisieren",auto:"Zielwahl im Hauptspiel",
  manualState:"Selbst wählen",autoState:"Automatisch",info:"Info",
  previous:"Vorheriges Entwicklungsziel",next:"Nächstes Entwicklungsziel",
  target:"Ziel",none:"Diese Art besitzt keine weitere Entwicklung.",
  current:"Aktuelles Pokémon",infoLeft:"Pflegen",infoRight:"Du entscheidest",
  careInfo:"Level, Bindung und Pflege müssen passen.",
  confirmInfo:"Hier wählst und bestätigst du das Ziel.",
  rules:"Vereinfachte Spielregeln · Zeitbedingungen nach UTC.",
  penalty:"Pflegefehler sind im benötigten Level bereits berücksichtigt."
 },
 es:{
  noBond:"Sin vínculo mínimo",
  title:"Evolución",level:"Nivel",bond:"Vínculo",care:"Cuidado",awake:"Despierto",
  time:"Hora",any:"Cualquiera",day:"Día",night:"Noche",evening:"Tarde",
  refresh:"Actualizar requisitos",auto:"Elección del objetivo en el juego principal",
  manualState:"Elegir",autoState:"Automático",info:"Info",
  previous:"Objetivo anterior",next:"Siguiente objetivo",
  target:"Objetivo",none:"Esta especie no tiene otra evolución.",
  current:"Pokémon actual",infoLeft:"Cuidar",infoRight:"Tú decides",
  careInfo:"El nivel, el vínculo y los cuidados deben ser suficientes.",
  confirmInfo:"Aquí eliges y confirmas el objetivo.",
  rules:"Reglas simplificadas · Las condiciones horarias usan UTC.",
  penalty:"Los errores de cuidado ya están incluidos en el nivel requerido."
 },
 fr:{
  noBond:"Aucun lien minimal",
  title:"Évolution",level:"Niveau",bond:"Lien",care:"Soins",awake:"Éveillé",
  time:"Heure",any:"Libre",day:"Jour",night:"Nuit",evening:"Soir",
  refresh:"Actualiser les conditions",auto:"Choix de cible dans le jeu principal",
  manualState:"Choisir",autoState:"Automatique",info:"Info",
  previous:"Cible précédente",next:"Cible suivante",
  target:"Cible",none:"Cette espèce n’a pas d’autre évolution.",
  current:"Pokémon actuel",infoLeft:"Prendre soin",infoRight:"Tu décides",
  careInfo:"Le niveau, le lien et les soins doivent convenir.",
  confirmInfo:"Ici, tu choisis et confirmes la cible.",
  rules:"Règles simplifiées · Les horaires utilisent UTC.",
  penalty:"Les erreurs de soin sont déjà incluses dans le niveau requis."
 }
};
const evolutionGrowthWords={"en": {"growth": "Growth", "growthMaximum": "Maximum level"}, "de": {"growth": "Wachstum", "growthMaximum": "Maximallevel"}, "es": {"growth": "Crecimiento", "growthMaximum": "Nivel máximo"}, "fr": {"growth": "Croissance", "growthMaximum": "Niveau maximal"}};
for(const code of ["en","de","es","fr"])Object.assign(evolutionWords[code],evolutionGrowthWords[code]);
if(typeof TPText!=="undefined")
 for(const code of ["en","de","es","fr"])
  TPText.registerLocale(code,Object.fromEntries(
   Object.entries(evolutionWords[code]).map(([key,value])=>["evolution.view."+key,value])
  ));
function evolutionText(key){
 return typeof TPText!=="undefined"?
  TPText.t("evolution.view."+key):evolutionWords.de[key];
}
function evolutionIcon(kind){
 const paths={
  evolution:'<path d="M12 21V4m-6 6 6-6 6 6M4 17h4m8 0h4"/>',
  level:'<path d="m5 14 7-8 7 8M12 6v15"/>',
  bond:'<path d="M12 21 3 12C-2 5 7 0 12 6c5-6 14-1 9 6Z"/>',
  care:'<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/>',
  awake:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  time:'<circle cx="12" cy="12" r="9"/><path d="M12 5v7l4 3"/>',
  refresh:'<path d="M20 9a8 8 0 1 0 0 6M20 3v6h-6"/>',
  auto:'<path d="M12 21V12L5 5M12 12l7-7M5 10V5h5M14 5h5v5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 6v1"/>',
  confirm:'<path d="m4 12 5 5L20 5"/><path d="M21 13v7H3V3h12"/>',
  pokemon:'<circle cx="12" cy="12" r="9"/><path d="M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3"/>'
 };
 const icon=el("span",undefined,"tp-evo-icon");
 icon.setAttribute("aria-hidden","true");
 icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '+
  'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+
  paths[kind]+'</svg>';
 return icon;
}
function applyEvolutionDesign(){
 const shell=document.getElementById("tp-game-shell");
 if(!shell||typeof hubDexDesignTokens!=="function")return;
 for(const [key,value]of Object.entries(hubDexDesignTokens()))
  shell.style.setProperty(key,value);
}
function evolutionLive(view){
 return evolutionView===view&&!overlay.hidden&&Module===view.mod;
}

/* UI01 evolution growth portrait */
function stopEvolutionGrowth(){
 if(evolutionView&&evolutionView.growthTimer!==undefined){
  clearInterval(evolutionView.growthTimer);
  delete evolutionView.growthTimer;
 }
}
function evolutionGrowthFraction(level,into,per){
 return level>=100?1:Math.max(0,Math.min(1,into/Math.max(1,per)));
}
function attachEvolutionGrowth(view,portrait,subjectCard){
 const ring=el("span",undefined,"tp-evo-growth-ring");
 ring.setAttribute("role","progressbar");
 ring.setAttribute("aria-label",evolutionText("growth"));
 ring.setAttribute("aria-valuemin","0");
 ring.setAttribute("aria-valuemax","100");
 const caption=el("p",undefined,"tp-evo-growth-caption");
 portrait.className+=" tp-evo-growth-portrait";
 portrait.appendChild(ring);
 subjectCard.appendChild(caption);
 let previous="";
 function refresh(){
  const level=fns.level(),into=fns.minutesIntoLevel(),per=fns.minutesPerLevel();
  const ratio=evolutionGrowthFraction(level,into,per);
  const text=level>=100?evolutionText("growthMaximum"):fns.nextLevelLine();
  const key=JSON.stringify([ratio,text]);
  if(key===previous)return;
  previous=key;
  ring.setAttribute("aria-valuenow",String(Math.round(ratio*100)));
  const circumference=2*Math.PI*21;
  ring.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true">'+
   '<circle cx="24" cy="24" r="21" fill="none" stroke="#ded2bd" stroke-width="2"/>'+
   '<circle cx="24" cy="24" r="21" fill="none" stroke="#c4a246" stroke-width="2" '+
   'stroke-linecap="round" transform="rotate(-90 24 24)" '+
   'stroke-dasharray="'+circumference+' '+circumference+'" '+
   'stroke-dashoffset="'+circumference*(1-ratio)+'"/>'+
   '</svg>';
  caption.textContent=text;
 }
 refresh();
 view.growthTimer=setInterval(()=>{
  if(!evolutionLive(view)||fns.speciesId()!==view.from){
   clearInterval(view.growthTimer);
   delete view.growthTimer;
   return;
  }
  refresh();
 },1000);
}

function evolutionPortrait(target){
 const fallback=()=>{
  target.replaceChildren(evolutionIcon("pokemon"));
  target.dataset.art="fallback";
 };
 try{
  if(typeof currentSprite==="undefined"||!currentSprite||
     typeof frameImageData!=="function"||typeof TPAct==="undefined"){
   fallback();return;
  }
  const image=frameImageData(currentSprite,TPAct.idle,0);
  if(!image?.data||!image.width||!image.height){fallback();return;}
  let left=image.width,top=image.height,right=-1,bottom=-1;
  for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)
   if(image.data[(y*image.width+x)*4+3]){
    left=Math.min(left,x);right=Math.max(right,x);
    top=Math.min(top,y);bottom=Math.max(bottom,y);
   }
  if(right<left){fallback();return;}
  const source=el("canvas");source.width=image.width;source.height=image.height;
  const sourceContext=source.getContext?.("2d");
  if(!sourceContext){fallback();return;}
  sourceContext.putImageData(image,0,0);
  const canvas=el("canvas");canvas.width=96;canvas.height=96;
  const c=canvas.getContext("2d");c.imageSmoothingEnabled=false;
  const w=right-left+1,h=bottom-top+1,scale=78/Math.hypot(w,h);
  c.drawImage(source,left,top,w,h,(96-w*scale)/2,(96-h*scale)/2,w*scale,h*scale);
  target.replaceChildren(canvas);target.dataset.art="ready";
 }catch(_e){fallback();}
}
function showEvolutionInfo(view,shown){
 if(!evolutionLive(view))return;
 view.infoOpen=shown;
 view.subject.hidden=shown;view.goal.hidden=shown;
 view.info.hidden=!shown;
 view.previous.hidden=shown||view.targets.length<=1;
 view.next.hidden=shown||view.targets.length<=1;
 view.counter.hidden=shown||view.targets.length<=1;
 view.infoButton.setAttribute("aria-pressed",String(shown));
 view.status.textContent=shown?evolutionText("rules"):"";
 view.infoButton.focus();
}
function paintEvolutionAuto(view){
 view.autoButton.setAttribute("aria-checked",String(auto));
 view.autoButton.setAttribute("title",evolutionText("auto")+": "+
  evolutionText(auto?"autoState":"manualState"));
 view.autoMark.textContent=auto?"A":"M";
}
function paintEvolutionTarget(view,index){
 if(!evolutionLive(view))return;
 view.index=Math.max(0,Math.min(Math.max(0,view.targets.length-1),index));
 view.goal.replaceChildren();
 view.previous.disabled=view.index===0;
 view.next.disabled=view.index>=view.targets.length-1;
 view.previous.hidden=view.next.hidden=view.counter.hidden=
  view.infoOpen||view.targets.length<=1;
 view.counter.textContent=evolutionText("target")+" "+(view.index+1)+" / "+view.targets.length;
 if(!view.targets.length){
  view.goal.dataset.target="";
  const empty=el("div",undefined,"tp-evo-empty");
  empty.append(evolutionIcon("evolution"),el("p",evolutionText("none")));
  view.goal.appendChild(empty);
  return;
 }
 const target=view.targets[view.index];
 view.goal.dataset.target=String(target.to);
 view.goal.dataset.ruleIndex=String(target.index);
 const card=el("div",undefined,"tp-evo-goal-card");
 const title=el("h3",name(target.to));
 const checks=el("div",undefined,"tp-evo-checks");
 checks.tabIndex=0;
 const rows=[
  ["level",evolutionText("level")+" "+view.level+" / "+target.level,target.flags[0]],
  ["bond",target.bond===0?evolutionText("noBond"):evolutionText("bond")+" "+view.bond+" / "+target.bond,target.flags[1]],
  ["time",evolutionText("time")+": "+evolutionText(
   ["any","day","night","evening"][target.time]||"any"),target.flags[2]],
  ["care",evolutionText("care")+" "+view.care+" / 40",target.flags[3]],
  ["awake",evolutionText("awake"),target.flags[4]]
 ];
 rows.forEach(([kind,label,ok],index)=>{
  const row=el("div",undefined,"tp-evo-check");
  row.dataset.evoCheck=String(index);row.dataset.ok=String(ok);
  row.append(evolutionIcon(kind),el("span",label,"tp-evo-check-label"),
   el("span",ok?"✓":"○","tp-evo-check-mark"));
  checks.appendChild(row);
 });
 if(target.level>target.baseLevel)
  checks.appendChild(el("p",evolutionText("penalty"),"tp-evo-penalty"));
 const act=button("Zu "+name(target.to)+" entwickeln",async()=>{
  if(!evolutionLive(view))return;
  await performEvolution(view.from,target.to);
 });
 act.dataset.evoChoose=String(target.to);
 act.disabled=!target.ready;
 card.append(title,checks,act);view.goal.appendChild(card);
}
function readEvolutionTargets(from){
 const targets=[],count=Module.ccall("tp_evo_rule_count","number",["number"],[from]);
 for(let index=0;index<count;index++)
  targets.push({
   index,to:field(from,index,0),level:field(from,index,1),
   bond:field(from,index,2),time:field(from,index,3),
   flags:[4,5,6,7,8].map(key=>!!field(from,index,key)),
   ready:!!field(from,index,9),baseLevel:field(from,index,10)
  });
 return targets;
}
function openEvolution(){
 const retained=evolutionView?.targets[evolutionView.index]?.to;
 if(!begin(evolutionText("title")))return;
 applyEvolutionDesign();
 overlay.className="tp-modal tp-evolution-modal";
 panel.className="tp-panel tp-evolution-panel";
 const from=fns.speciesId();
 const frame=el("div",undefined,"tp-evo-frame");
 frame.setAttribute("aria-hidden","true");
 for(const cls of [
  "tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right",
  "tp-pokedex-spine"
 ]){
  const part=el("span",undefined,cls);
  part.setAttribute("aria-hidden","true");frame.appendChild(part);
 }
 const subject=el("div",undefined,"tp-evo-subject");
 const goal=el("div",undefined,"tp-evo-goal");
 goal.id="tp-evolution-goal";
 const actions=el("div",undefined,"tp-evo-actions");
 const info=el("div",undefined,"tp-evo-info");info.hidden=true;
 const statusLine=el("p",undefined,"tp-evo-status");statusLine.setAttribute("role","status");
 const view={
  mod:Module,from,subject,goal,info,infoOpen:false,status:statusLine,
  level:fns.level(),bond:fns.bond(),
  care:Math.min(fns.fullness(),fns.joy(),fns.energy(),fns.hygiene()),
  targets:readEvolutionTargets(from),index:0
 };
 evolutionView=view;
 const subjectCard=el("div",undefined,"tp-evo-subject-card");
 const portrait=el("div",undefined,"tp-evo-portrait");
 portrait.setAttribute("role","img");portrait.setAttribute("aria-label",name(from));
 evolutionPortrait(portrait);
 const stats=el("div",undefined,"tp-evo-subject-stats");
 const bond=el("span",undefined,"tp-evo-subject-bond");
 bond.setAttribute("aria-label",evolutionText("bond")+" "+view.bond);
 bond.append(evolutionIcon("bond"),el("span",String(view.bond)));
 stats.append(el("span","Lv. "+view.level),bond);
 subjectCard.append(portrait,el("h3",name(from)),stats);
 attachEvolutionGrowth(view,portrait,subjectCard);
 subject.appendChild(subjectCard);
 view.refresh=button("",()=>openEvolution());
 view.refresh.setAttribute("aria-label",evolutionText("refresh"));
 view.refresh.setAttribute("title",evolutionText("refresh"));
 view.refresh.appendChild(evolutionIcon("refresh"));
 view.autoButton=button("",()=>{
  if(!evolutionLive(view))return;
  auto=!auto;
  try{localStorage.setItem("tp-auto-evolve",auto?"1":"0");}catch(_e){}
  paintEvolutionAuto(view);
 });
 view.autoButton.dataset.evoAuto="true";
 view.autoButton.setAttribute("role","switch");
 view.autoButton.setAttribute("aria-label",evolutionText("auto"));
 view.autoMark=el("span",undefined,"tp-evo-auto-mark");
 view.autoButton.append(evolutionIcon("auto"),view.autoMark);
 view.infoButton=button("",()=>showEvolutionInfo(view,!view.infoOpen));
 view.infoButton.setAttribute("aria-label",evolutionText("info"));
 view.infoButton.setAttribute("title",evolutionText("info"));
 view.infoButton.setAttribute("aria-pressed","false");
 view.infoButton.appendChild(evolutionIcon("info"));
 actions.append(view.refresh,view.autoButton,view.infoButton);
 for(const [titleKey,iconKey,copyKey]of [
  ["infoLeft","care","careInfo"],["infoRight","confirm","confirmInfo"]
 ]){
  const column=el("div",undefined,"tp-evo-info-column");
  column.tabIndex=0;
  column.append(evolutionIcon(iconKey),el("h3",evolutionText(titleKey)),
   el("p",evolutionText(copyKey)));
  info.appendChild(column);
 }
 view.previous=button("",()=>paintEvolutionTarget(view,view.index-1));
 view.next=button("",()=>paintEvolutionTarget(view,view.index+1));
 view.previous.id="tp-evolution-prev";view.next.id="tp-evolution-next";
 view.previous.className=view.next.className="tp-evo-nav";
 view.previous.setAttribute("aria-label",evolutionText("previous"));
 view.next.setAttribute("aria-label",evolutionText("next"));
 for(const [node,label]of [[view.previous,"<"],[view.next,">"]])
  node.appendChild(el("span",label,"tp-evo-nav-face"));
 view.counter=el("span",undefined,"tp-evo-counter");
 view.counter.setAttribute("role","status");
 panel.append(frame,subject,goal,actions,info,statusLine,
  view.previous,view.counter,view.next);
 paintEvolutionAuto(view);
 const selected=view.targets.findIndex(target=>target.to===retained);
 paintEvolutionTarget(view,selected>=0?selected:0);
 if(typeof requestAnimationFrame==="function")
  requestAnimationFrame(()=>{
   if(evolutionLive(view))panel.querySelector(".tp-modal-head button")?.focus();
  });
}
const evolutionKeyTarget=typeof window.addEventListener==="function"?window:overlay;
evolutionKeyTarget.addEventListener("keydown",event=>{
 const view=evolutionView;
 if(!view||!evolutionLive(view))return;
 if(event.key==="Escape"){
  event.preventDefault();event.stopPropagation?.();event.stopImmediatePropagation?.();
  if(view.infoOpen)showEvolutionInfo(view,false);else close();
  return;
 }
 if(event.key!=="Tab")return;
 const nodes=Array.from(panel.querySelectorAll(
  "button:not(:disabled),[tabindex='0']"
 )).filter(n=>typeof n.getClientRects!=="function"||n.getClientRects().length>0);
 const first=nodes[0],last=nodes[nodes.length-1];
 if(event.shiftKey&&document.activeElement===first){
  event.preventDefault();last?.focus();
 }else if(!event.shiftKey&&document.activeElement===last){
  event.preventDefault();first?.focus();
 }
},true);

async function performEvolution(from,to){

        if(!safe()||fns.speciesId()!==from){close();return;}
        if(!confirm(name(from)+" wirklich zu "+name(to)+" entwickeln?"))return;
        const ok=Module.ccall("tp_evo_choose","number",["number"],[to]);
        if(!ok){alert("Die Voraussetzungen sind nicht mehr erfuellt.");openEvolution();return;}
        close();screen="idle";choice="none";await saveNow(Module);
}

function status(id){return {raised:!!fns.dexRegistered(id),caught:!!fns.dexCaught(id)};}
  function showInDex(id){
    tpDexFilter={query:"",gen:0,type:0,status:"all"};tpDexCacheKey="";
    dexFilter=0;dexPage=Math.floor((id-1)/16);dexDetailDex=id;dexDetailPage=0;dexScreen="detail";screen="dex";close();
  }
  function openFamily(id){
    if(!begin("Entwicklungsfamilie"))return;
    panel.appendChild(el("p","Uebersicht nach unseren vereinfachten Art-Verbindungen. Sie markiert keine Art als gesammelt.","tp-small"));
    for(const m of TPDexTools.family(TP_DEX_META,id)){
      const card=el("article",undefined,"tp-card");const s=status(m.id);
      card.appendChild(el("h3","#"+m.id+" "+((dexLookupMode||s.raised||s.caught)?name(m.id):"???")));
      if(m.parent)card.appendChild(el("p","Vorentwicklung: #"+m.parent));
      card.appendChild(el("p",s.raised?"Aufgezogen":s.caught?"Gefangen":"Noch nicht gesammelt"));
      card.appendChild(button("Im Pokédex oeffnen",()=>showInDex(m.id)));panel.appendChild(card);
    }
    panel.appendChild(button("Zur Suche",openDex));
  }
  function openDex(){
    if(!begin("Pokédex-Suche"))return;
    const query=el("input");query.type="search";query.placeholder="Name oder Nummer, z.B. Evoli oder 133";query.value=tpDexFilter.query;query.setAttribute("aria-label","Name oder Nummer");
    const gen=el("select"),type=el("select"),collection=el("select");
    function opt(select,value,label){const o=el("option",label);o.value=String(value);select.appendChild(o);}
    opt(gen,0,"Alle Generationen");for(let g=1;g<=9;g++)opt(gen,g,"Generation "+g);
    typeNames.forEach((s,i)=>opt(type,i,s));
    [["all","Alle Sammelstaende"],["missing","Noch nicht gesammelt"],["raised","Aufgezogen"],["caught","Gefangen"]].forEach(([v,t])=>opt(collection,v,t));
    gen.value=String(tpDexFilter.gen);type.value=String(tpDexFilter.type);collection.value=tpDexFilter.status;
    function labeled(label,node){const l=el("label",label);l.appendChild(node);panel.appendChild(l);}
    labeled("Suche",query);labeled("Generation",gen);labeled("Typ",type);labeled("Sammlung",collection);
    const lookup=el("input");lookup.type="checkbox";lookup.checked=dexLookupMode;
    const ll=el("label");ll.append(lookup,document.createTextNode("Nachschlage-Modus: unbekannte Namen und Bilder zeigen (ohne Sammelfreischaltung)"));panel.appendChild(ll);
    const actions=el("div",undefined,"tp-modal-row");panel.appendChild(actions);
    const results=el("div");results.setAttribute("aria-live","polite");panel.appendChild(results);
    let resultPage=0;
    function read(){tpDexFilter={query:query.value,gen:Number(gen.value),type:Number(type.value),status:collection.value};dexLookupMode=lookup.checked;tpDexCacheKey="";}
    function apply(){read();dexFilter=0;dexPage=0;dexScreen="grid";screen="dex";close();}
    actions.append(button("Filter im Pokédex anwenden",apply),button("Zuruecksetzen",()=>{query.value="";gen.value="0";type.value="0";collection.value="all";resultPage=0;render();}));
    const jumps=el("div",undefined,"tp-modal-row");
    jumps.append(button("Erste Dex-Seite",()=>{tpDexFilter={query:"",gen:0,type:0,status:"all"};tpDexCacheKey="";dexFilter=0;dexPage=0;dexScreen="grid";screen="dex";close();}),button("Letzte Dex-Seite",()=>{tpDexFilter={query:"",gen:0,type:0,status:"all"};tpDexCacheKey="";dexFilter=0;dexPage=Math.ceil(fns.dexCount()/16)-1;dexScreen="grid";screen="dex";close();}));panel.appendChild(jumps);
    function render(){
      read();results.replaceChildren();
      const filtered=TP_DEX_META.filter(m=>TPDexTools.matches(m,tpDexFilter,status(m.id)));
      const pages=Math.max(1,Math.ceil(filtered.length/24));resultPage=Math.max(0,Math.min(resultPage,pages-1));
      results.appendChild(el("p",filtered.length+" Treffer · Seite "+(resultPage+1)+" / "+pages));
      for(const m of filtered.slice(resultPage*24,resultPage*24+24)){
        const s=status(m.id),known=s.raised||s.caught;
        const card=el("article",undefined,"tp-card");card.appendChild(el("h3","#"+m.id+" "+((dexLookupMode||known)?name(m.id):"???")));
        card.appendChild(el("p","Generation "+m.gen+" · "+m.types.map(t=>typeNames[t]).join(" / ")));
        card.appendChild(el("p",s.raised?"Aufgezogen":s.caught?"Gefangen":"Noch nicht gesammelt"));
        const row=el("div",undefined,"tp-modal-row");row.append(button("Ansehen",()=>showInDex(m.id)),button("Familie",()=>openFamily(m.id)));card.appendChild(row);results.appendChild(card);
      }
      const nav=el("div",undefined,"tp-modal-row");const prev=button("Zurueck",()=>{resultPage--;render();});prev.disabled=resultPage===0;const next=button("Weiter",()=>{resultPage++;render();});next.disabled=resultPage>=pages-1;nav.append(prev,next);results.appendChild(nav);
    }
    [query,gen,type,collection,lookup].forEach(n=>n.addEventListener(n===query?"input":"change",()=>{resultPage=0;render();}));
    render();
  }
  window.TPComfort={openEvolution,openDex,autoEvolve:()=>auto};
})();
