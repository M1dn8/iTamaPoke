// Package C1: a soft, single-use preference for a future egg.
(function(){
"use strict";
let busy=false,previousFocus=null,previousOverflow="";
const create=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
function button(text,fn){const node=create("button",text);node.type="button";node.addEventListener("click",()=>Promise.resolve().then(fn).catch(showError));return node;}
function showError(e){console.error("[egg-plan]",e);alert(e&&e.message?e.message:String(e));}
function ready(){return !!Module&&!!fns&&typeof fns.isEgg==="function";}
function quiet(){return ready()&&!["game","gamemenu","battle","keyboard"].includes(screen)&&!fns.evolvingNow()&&!fns.ceremony()&&!fns.wildPromptActive()&&!tpSaveReplacing;}
function call(name,...args){return Module.ccall(name,"number",args.map(()=>"number"),args);}
function readPlan(used=false){return {generation:call(used?"tp_egg_used_generation":"tp_egg_plan_generation"),type:call(used?"tp_egg_used_type":"tp_egg_plan_type"),unraised:!!call(used?"tp_egg_used_unraised":"tp_egg_plan_unraised")};}
const types=["Alle Typen","Normal","Feuer","Wasser","Elektro","Pflanze","Eis","Kampf","Gift","Boden","Flug","Psycho","Kaefer","Gestein","Geist","Drache","Unlicht","Stahl","Fee"];
function describe(plan){const out=[];if(plan.generation)out.push("Generation "+plan.generation);if(plan.type)out.push(types[plan.type]);if(plan.unraised)out.push("noch nicht aufgezogene Arten");return out.length?out.join(" · "):"Zufall ohne zusaetzliche Gewichtung";}


// UI01-07 revision 2: internal choices; colour remains a wish, not an egg reveal.
let view=null;
const words={
 en:{
  title:"Next egg",back:"Back",generation:"Generation",type:"Type",
  generationLabel:"Preferred generation",typeLabel:"Preferred type",
  all:"All",genShort:"Gen",save:"Save plan and reload",
  clear:"Restore random selection",info:"Info",
  wish:"Your wish",existing:"This egg",colour:"Colour = type wish",
  saveNote:"Saving reloads the game.",unsaved:"Selection not saved yet.",
  fixed:"Already drawn. No reroll.",infoLeft:"Your wishes",infoRight:"Important",
  explain:"Generation and type are preferred.",random:"Chance still decides.",
  guarantee:"A particular species is not guaranteed.",
  noReroll:"An existing egg is not drawn again.",
  unchanged:"Your current Pokémon stays unchanged.",
  hiddenWeight:"Unraised species are additionally preferred."
 },
 de:{
  title:"Nächstes Ei",back:"Zurück",generation:"Generation",type:"Typ",
  generationLabel:"Bevorzugte Generation",typeLabel:"Bevorzugter Typ",
  all:"Alle",genShort:"Gen",save:"Plan speichern und neu laden",
  clear:"Zufall wiederherstellen",info:"Info",
  wish:"Dein Wunsch",existing:"Dieses Ei",colour:"Farbe = Typwunsch",
  saveNote:"Speichern lädt das Spiel neu.",unsaved:"Auswahl noch nicht gespeichert.",
  fixed:"Bereits ausgelost. Kein Neuwurf.",infoLeft:"Deine Wünsche",infoRight:"Wichtig",
  explain:"Generation und Typ werden bevorzugt.",random:"Es bleibt Zufall.",
  guarantee:"Eine bestimmte Art ist nicht garantiert.",
  noReroll:"Ein vorhandenes Ei wird nicht neu ausgelost.",
  unchanged:"Dein aktuelles Pokémon bleibt unverändert.",
  hiddenWeight:"Noch nicht aufgezogene Arten werden zusätzlich bevorzugt."
 },
 es:{
  title:"Próximo huevo",back:"Atrás",generation:"Generación",type:"Tipo",
  generationLabel:"Generación preferida",typeLabel:"Tipo preferido",
  all:"Todo",genShort:"Gen",save:"Guardar plan y recargar",
  clear:"Restaurar selección aleatoria",info:"Info",
  wish:"Tu deseo",existing:"Este huevo",colour:"Color = tipo deseado",
  saveNote:"Guardar recarga el juego.",unsaved:"Selección sin guardar.",
  fixed:"Ya elegido. No se vuelve a elegir.",infoLeft:"Tus deseos",infoRight:"Importante",
  explain:"Se favorecen la generación y el tipo.",random:"El azar sigue decidiendo.",
  guarantee:"No se garantiza una especie concreta.",
  noReroll:"Un huevo existente no se vuelve a elegir.",
  unchanged:"Tu Pokémon actual no cambia.",
  hiddenWeight:"También se favorecen las especies no criadas."
 },
 fr:{
  title:"Prochain œuf",back:"Retour",generation:"Génération",type:"Type",
  generationLabel:"Génération préférée",typeLabel:"Type préféré",
  all:"Tout",genShort:"Gén",save:"Enregistrer le plan et recharger",
  clear:"Rétablir le choix aléatoire",info:"Info",
  wish:"Ton souhait",existing:"Cet œuf",colour:"Couleur = type souhaité",
  saveNote:"Enregistrer recharge le jeu.",unsaved:"Choix non enregistré.",
  fixed:"Déjà choisi. Aucun nouveau tirage.",infoLeft:"Tes souhaits",infoRight:"Important",
  explain:"La génération et le type sont favorisés.",random:"Le hasard décide toujours.",
  guarantee:"Aucune espèce précise n’est garantie.",
  noReroll:"Un œuf existant n’est pas tiré à nouveau.",
  unchanged:"Ton Pokémon actuel reste inchangé.",
  hiddenWeight:"Les espèces non élevées sont aussi favorisées."
 }
};
if(typeof TPText!=="undefined")
 for(const code of ["en","de","es","fr"])
  TPText.registerLocale(code,Object.fromEntries(
   Object.entries(words[code]).map(([key,value])=>["eggPlan.view."+key,value])
  ));
function text(key){
 return typeof TPText!=="undefined"?TPText.t("eggPlan.view."+key):words.de[key];
}

const illustratedWords={
 en:{
  wishTitle:"You choose",wishLine:"Generation and type.",
  chanceTitle:"Chance decides",chanceLine:"No species is guaranteed.",
  fixedTitle:"Already chosen",fixedLine:"This egg stays unchanged.",
  previousChoice:"Previous choices",nextChoice:"More choices"
 },
 de:{
  wishTitle:"Du wählst",wishLine:"Generation und Typ.",
  chanceTitle:"Der Zufall entscheidet",chanceLine:"Keine Art ist garantiert.",
  fixedTitle:"Schon festgelegt",fixedLine:"Dieses Ei bleibt unverändert.",
  previousChoice:"Vorherige Auswahlseite",nextChoice:"Weitere Auswahlseite"
 },
 es:{
  wishTitle:"Tú eliges",wishLine:"Generación y tipo.",
  chanceTitle:"Decide el azar",chanceLine:"Ninguna especie está garantizada.",
  fixedTitle:"Ya elegido",fixedLine:"Este huevo no cambia.",
  previousChoice:"Opciones anteriores",nextChoice:"Más opciones"
 },
 fr:{
  wishTitle:"Tu choisis",wishLine:"Une génération et un type.",
  chanceTitle:"Le hasard décide",chanceLine:"Aucune espèce n’est garantie.",
  fixedTitle:"Déjà choisi",fixedLine:"Cet œuf reste inchangé.",
  previousChoice:"Choix précédents",nextChoice:"Autres choix"
 }
};
for(const code of ["en","de","es","fr"]){
 Object.assign(words[code],illustratedWords[code]);
 if(typeof TPText!=="undefined")
  TPText.registerLocale(code,Object.fromEntries(
   Object.entries(illustratedWords[code]).map(([key,value])=>[
    "eggPlan.view."+key,value
   ])
  ));
}

const colours=[
 "#fff4d6","#c9c4b3","#efaa83","#8cbbdf","#efdb82",
 "#98c779","#abe0df","#d29285","#bd98cc","#d9bd88",
 "#bcc4e8","#e7a2bf","#c1ce84","#c9bb8b","#aaa0ca",
 "#a99be3","#a79b92","#bdcbd0","#e7b8d3"
];
const typePaths=[
 '<path d="M4 8h4l8 8h4M4 16h4l8-8h4M17 5l3 3-3 3M17 13l3 3-3 3"/>',
 '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/>',
 '<path d="M12 2c2 6 8 8 8 13a8 8 0 0 1-16 0c0-4 3-7 5-9 0 5 3 6 3 6s2-4 0-10Z"/>',
 '<path d="M12 2S4 11 4 16a8 8 0 0 0 16 0c0-5-8-14-8-14Z"/>',
 '<path d="m14 2-9 12h7l-2 8 9-13h-7Z"/>',
 '<path d="M4 20C1 7 11 3 21 3c0 11-5 19-17 17ZM4 20 17 7"/>',
 '<path d="M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3"/>',
 '<path d="M5 20V10h4V5h4v5h3V7h3v10l-5 4H8ZM5 13H2v5l4 3"/>',
 '<path d="M5 11a7 7 0 0 1 14 0c0 4-3 5-3 7H8c0-2-3-3-3-7ZM8 18v3h8v-3"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/>',
 '<path d="m2 19 7-12 4 6 3-8 6 14ZM5 19h14"/>',
 '<path d="M3 17C8 5 15 4 22 5c-2 7-8 12-19 12ZM3 17l14-9"/>',
 '<path d="M7 16c-6-6 1-15 9-10 7 5 1 15-6 12-5-2-3-9 2-9 4 0 4 5 1 5"/>',
 '<path d="M8 8h8v9a4 4 0 0 1-8 0ZM9 8 6 4M15 8l3-4M8 12H4M16 12h4M8 16H3M16 16h5M12 8v12"/>',
 '<path d="m4 19-1-8 7-8 10 5 1 11-9 3ZM3 11l9 3 8-6M12 14v8"/>',
 '<path d="M4 21V10a8 8 0 0 1 16 0v11l-4-3-4 3-4-3Z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>',
 '<path d="M4 19 6 8l7-5 7 5-2 7-7 6Zm2-11 7 4 7-4M13 3v9l-2 9M6 8 4 3"/>',
 '<path d="M19 4A9 9 0 1 0 20 19 9 9 0 0 1 19 4Z"/>',
 '<path d="m7 3 10 0 5 9-5 9H7l-5-9Z"/><circle cx="12" cy="12" r="4"/>',
 '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>'
];
const overlay=create("div",undefined,"tp-modal tp-egg-plan-modal");
overlay.hidden=true;
const panel=create("section",undefined,"tp-panel tp-egg-plan-panel");
panel.setAttribute("role","dialog");
panel.setAttribute("aria-modal","true");
panel.setAttribute("aria-labelledby","tp-egg-plan-title");
overlay.appendChild(panel);document.body.appendChild(overlay);
function applyDesign(){
 const shell=document.getElementById("tp-game-shell");
 if(!shell||typeof hubDexDesignTokens!=="function")return;
 for(const [name,value]of Object.entries(hubDexDesignTokens()))
  shell.style.setProperty(name,value);
}
function svg(paths,cls="tp-egg-icon"){
 const node=create("span",undefined,cls);
 node.setAttribute("aria-hidden","true");
 node.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '+
  'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+paths+'</svg>';
 return node;
}
function typeIcon(value){
 return svg(typePaths[value]||typePaths[0]);
}

function typeCategoryIcon(){
 const node=svg('<path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"/>');
 node.dataset.eggCategory="type";
 return node;
}

function actionIcon(kind){
 const paths={
  generation:'<path d="m3 7 9-4 9 4-9 4ZM3 12l9 4 9-4M3 17l9 4 9-4"/>',
  save:'<path d="M4 3h13l4 4v14H3V3ZM7 3v7h10V3M7 21v-7h10v7"/>',
  clear:typePaths[0],
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 6v1"/>',
  previous:'<path d="m14 6-6 6 6 6"/>',
  next:'<path d="m10 6 6 6-6 6"/>'
 };
 return svg(paths[kind]);
}
function close(){
 if(busy)return;
 view?.resizeObserver?.disconnect();
 overlay.hidden=true;document.body.style.overflow=previousOverflow;
 previousFocus?.focus();
}
function currentPlan(){
 return view.isEgg?view.used:view.draft;
}
function dirty(){
 return view.draft.generation!==view.pending.generation||
  view.draft.type!==view.pending.type||
  view.draft.unraised!==view.pending.unraised;
}
function normalStatus(){
 return text(view.isEgg?"fixed":dirty()?"unsaved":"saveNote");
}
function paint(){
 if(!view)return;
 const plan=currentPlan(),colour=colours[plan.type]||colours[0];
 view.art.dataset.wishType=String(plan.type);
 view.art.innerHTML='<svg viewBox="0 0 80 96" aria-hidden="true">'+
  '<path class="tp-egg-shell" d="M40 5C27 5 10 34 10 58c0 23 13 33 30 33s30-10 30-33C70 34 53 5 40 5Z" '+
  'fill="'+colour+'" stroke="#292831" stroke-width="3"/>'+
  '<path d="M23 35c-4 8-6 16-6 23" fill="none" stroke="#ffffff" stroke-opacity=".65" stroke-width="5" stroke-linecap="round"/>'+
  '<path d="m29 48 8-5 7 7-5 10-10-2Zm18 18 9-3 4 8-8 6-7-4Z" fill="#ffffff" fill-opacity=".55"/>'+
  '</svg>';
 view.generationValue.textContent=plan.generation?
  text("genShort")+" "+plan.generation:text("all");
 view.typeValue.replaceChildren(plan.type?typeIcon(plan.type):create("span","—"));
 view.typeValue.setAttribute("title",types[plan.type]||types[0]);
 view.typeValue.setAttribute("aria-label",types[plan.type]||types[0]);
 view.summary.replaceChildren(
  create("span",plan.generation?text("genShort")+" "+plan.generation:text("all"))
 );
 if(plan.type)view.summary.appendChild(typeIcon(plan.type));
}

function pageState(){
 const generation=view.mode==="generation";
 const values=generation?
  [1,2,3,4,5,6,7,8,9]:
  Array.from({length:18},(_,index)=>index+1);
 const width=view.picker.clientWidth||127;
 const size=width>=140?9:6;
 return {values,size,columns:size===9?3:2,pages:Math.ceil(values.length/size)};
}
function renderChoices(){
 if(!view||!["generation","type"].includes(view.mode))return;
 const mode=view.mode,{values,size,columns,pages}=pageState();
 view.choicePage=Math.max(0,Math.min(pages-1,view.choicePage));
 view.choiceSize=size;
 view.picker.dataset.columns=String(columns);
 view.picker.replaceChildren();
 const chosen=currentPlan()[mode];
 for(const value of values.slice(view.choicePage*size,view.choicePage*size+size)){
  const pick=button("",()=>{
   if(busy||!view.editable||view.mode!==mode)return;
   view.draft[mode]=mode==="type"&&view.draft.type===value?0:value;
   setMode("preview");
  });
  pick.setAttribute("aria-pressed",String(value===chosen));
  if(mode==="generation"){
   pick.dataset.eggGeneration=String(value);
   const plaque=create("span",undefined,"tp-egg-gen-plaque");
   const caption=create("span",
    value?text("genShort").toUpperCase():text("all"),
    "tp-egg-gen-caption");
   const number=create("span",value?String(value):"","tp-egg-gen-number");
   if(!value)number.appendChild(actionIcon("clear"));
   plaque.append(caption,number);pick.appendChild(plaque);
   pick.setAttribute("aria-label",value?"Generation "+value:"Alle Generationen");
  }else{
   pick.dataset.eggType=String(value);
   pick.setAttribute("aria-label",types[value]);
   pick.setAttribute("title",types[value]);
   pick.style.setProperty("background-color",colours[value],"important");
   pick.appendChild(typeIcon(value));
  }
  view.picker.appendChild(pick);
 }
 view.choicePrevious.hidden=pages<=1;
 view.choiceNext.hidden=pages<=1;
 view.choicePrevious.disabled=view.choicePage===0;
 view.choiceNext.disabled=view.choicePage===pages-1;
 view.status.textContent=text(mode)+" · "+(view.choicePage+1)+" / "+pages;
}

function renderInfoCards(){
 const left=create("div",undefined,"tp-egg-info-column tp-egg-info-card");
 const right=create("div",undefined,"tp-egg-info-column tp-egg-info-card");
 left.tabIndex=0;right.tabIndex=0;
 const wishes=create("div",undefined,"tp-egg-info-scene tp-egg-info-scene-wish");
 wishes.setAttribute("aria-hidden","true");
 const generationBadge=create("span",undefined,"tp-egg-info-generation-badge");
 generationBadge.appendChild(actionIcon("generation"));
 const typeBadge=create("span",undefined,"tp-egg-info-type-badge");
 typeBadge.style.backgroundColor=currentPlan().type?
  colours[currentPlan().type]:"#e7edf0";
 const chosenType=typeCategoryIcon();
 typeBadge.appendChild(chosenType);
 wishes.append(generationBadge,typeBadge);
 left.append(
  wishes,create("h3",text("wishTitle")),create("p",text("wishLine"))
 );
 const chance=create("div",undefined,"tp-egg-info-scene");
 chance.setAttribute("aria-hidden","true");
 const dice=svg(
  '<rect x="3" y="3" width="18" height="18" rx="3"/>'+
  '<circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/>'+
  '<circle cx="12" cy="12" r="1"/><circle cx="8" cy="16" r="1"/>'+
  '<circle cx="16" cy="16" r="1"/>'
 );
 const littleEgg=create("span",undefined,"tp-egg-info-egg");
 littleEgg.innerHTML='<svg viewBox="0 0 80 96">'+
  '<path d="M40 5C27 5 10 34 10 58c0 23 13 33 30 33s30-10 30-33C70 34 53 5 40 5Z" '+
  'fill="#fff4d6" stroke="#292831" stroke-width="5"/>'+
  '<path d="m29 48 8-5 7 7-5 10-10-2Z" fill="#d5bf88"/>'+
  '</svg>';
 chance.append(dice,littleEgg);
 right.append(
  chance,create("h3",text(view.isEgg?"fixedTitle":"chanceTitle")),
  create("p",text(view.isEgg?"fixedLine":"chanceLine"))
 );
 view.infoPanel.replaceChildren(left,right);
}

function setMode(mode){
 if(!view||busy)return;
 view.mode=mode;
 panel.dataset.eggMode=mode;
 view.settings.hidden=mode==="info";
 view.right.hidden=mode==="info";
 view.infoPanel.hidden=mode!=="info";
 if(mode==="info")renderInfoCards();
 view.preview.hidden=mode!=="preview";
 view.picker.hidden=!["generation","type"].includes(mode);
 view.save.disabled=!view.editable||mode!=="preview";
 view.clear.disabled=!view.editable||mode!=="preview";
 view.infoButton.setAttribute("aria-pressed",String(mode==="info"));
 view.infoButton.setAttribute("aria-expanded",String(mode==="info"));
 view.generationButton.setAttribute("aria-pressed",String(mode==="generation"));
 view.typeButton.setAttribute("aria-pressed",String(mode==="type"));
 view.choicePrevious.hidden=true;view.choiceNext.hidden=true;
 paint();
 if(["generation","type"].includes(mode)){
  const state=pageState();
  const value=currentPlan()[mode];
  const index=state.values.indexOf(value);
  view.choicePage=index>=0?Math.floor(index/state.size):0;
  if(mode==="generation"&&value===0)view.choicePage=0;
  renderChoices();
 }else{
  view.status.textContent=mode==="info"?text("unchanged"):normalStatus();
 }
 const focus=mode==="info"?view.infoButton:
  mode==="generation"?view.generationButton:
  mode==="type"?view.typeButton:view.exit;
 focus?.focus();
}
function openChoices(mode){
 if(!view||busy||!view.editable)return;
 setMode(view.mode===mode?"preview":mode);
}
function field(kind,label,fn){
 const node=button("",fn);
 node.className="tp-egg-field";
 const face=create("span",undefined,"tp-egg-field-face");
 const content=create("span",undefined,"tp-egg-field-copy");
 const caption=create("span",label,"tp-egg-field-name");
 const value=create("span",undefined,"tp-egg-field-value");
 content.append(caption,value);
 face.append(kind==="generation"?actionIcon("generation"):typeCategoryIcon(),content);
 node.appendChild(face);
 return {node,value};
}
overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
const keyTarget=typeof window.addEventListener==="function"?window:overlay;
keyTarget.addEventListener("keydown",e=>{
 if(overlay.hidden)return;
 if(e.key==="Escape"){
  e.preventDefault();
  e.stopPropagation?.();
  e.stopImmediatePropagation?.();
  if(view?.mode!=="preview")setMode("preview");else close();
  return;
 }
 if(e.key!=="Tab")return;
 const nodes=Array.from(panel.querySelectorAll(
  "button:not(:disabled),.tp-egg-info-column"
 )).filter(node=>typeof node.getClientRects!=="function"||node.getClientRects().length>0);
 const first=nodes[0],last=nodes[nodes.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
},true);

async function storePlan(plan,status,controls){
 if(busy||!quiet()||!call("tp_egg_plan_can_set"))throw Error("Bitte Kampf oder Animation beenden. Ein vorhandenes Ei wird nicht neu ausgelost.");
 const previous=readPlan(),mod=Module;let changed=false;
 busy=true;tpSaveReplacing=true;controls.forEach(n=>n.disabled=true);status.textContent="Plan wird gespeichert…";
 try{
  if(!call("tp_egg_plan_set",plan.generation,plan.type,plan.unraised?1:0))throw Error("Plan wurde vom Spielkern abgelehnt.");changed=true;
  await writeSave(exportStateBytes(mod),true);
  // Keep the save gate closed through navigation: an old pending autosave
  // must not overwrite the newly committed plan after the flag is released.
  Module=null;window.location.reload();
 }catch(e){
  Module=mod;
  if(changed)call("tp_egg_plan_set",previous.generation,previous.type,previous.unraised?1:0);
  busy=false;tpSaveReplacing=false;controls.forEach(n=>n.disabled=false);
  status.textContent="Speichern fehlgeschlagen; die bisherige Auswahl bleibt aktiv.";
  throw e;
 }
}




function open(){
 if(busy||!quiet())throw Error("Bitte zuerst Kampf, Minispiel oder Animation beenden.");
 let pending,used,editable;
 try{
  pending=readPlan();used=readPlan(true);editable=!!call("tp_egg_plan_can_set");
 }catch(_e){
  throw Error("Der C1-Spielkern ist nicht verfuegbar. Bitte den vollstaendig gebauten C1-Teststand oeffnen.");
 }
 if(overlay.hidden){
  previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;
 }
 view?.resizeObserver?.disconnect();
 applyDesign();panel.replaceChildren();
 const isEgg=!!fns.isEgg();
 editable=editable&&!isEgg;
 const head=create("div",undefined,"tp-modal-head");
 const title=create("h2",text("title"));title.id="tp-egg-plan-title";
 const exit=button(text("back"),()=>view?.mode!=="preview"?setMode("preview"):close());
 head.append(title,exit);panel.appendChild(head);
 const frame=create("div",undefined,"tp-egg-frame");
 frame.setAttribute("aria-hidden","true");
 for(const name of [
  "tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right",
  "tp-pokedex-spine"
 ]){
  const part=create("span",undefined,name);
  part.setAttribute("aria-hidden","true");frame.appendChild(part);
 }
 const settings=create("div",undefined,"tp-egg-settings");
 const right=create("div",undefined,"tp-egg-right");
 const preview=create("div",undefined,"tp-egg-preview");
 const picker=create("div",undefined,"tp-egg-picker");
 picker.setAttribute("role","group");
 right.append(preview,picker);
 const actions=create("div",undefined,"tp-egg-actions");
 const infoPanel=create("div",undefined,"tp-egg-info-panel");
 const generation=field("generation",text("generation"),()=>openChoices("generation"));
 generation.node.id="tp-egg-generation";
 generation.node.setAttribute("aria-label",text("generationLabel"));
 const type=field("type",text("type"),()=>openChoices("type"));
 type.node.id="tp-egg-type";
 type.node.setAttribute("aria-label",text("typeLabel"));
 generation.node.disabled=!editable;type.node.disabled=!editable;
 settings.append(generation.node,type.node);
 const art=create("span",undefined,"tp-egg-art");
 const summary=create("div",undefined,"tp-egg-summary");
 preview.append(
  create("h3",text(isEgg?"existing":"wish")),
  art,summary
 );
 const status=create("p",undefined,"tp-egg-status");
 status.setAttribute("role","status");
 const controls=[generation.node,type.node];
 const save=button("",()=>storePlan({...view.draft},status,controls));
 save.setAttribute("aria-label",text("save"));
 save.setAttribute("title",text("save"));
 save.appendChild(actionIcon("save"));
 const clear=button("",()=>storePlan({generation:0,type:0,unraised:false},status,controls));
 clear.setAttribute("aria-label",text("clear"));
 clear.setAttribute("title",text("clear"));
 clear.appendChild(actionIcon("clear"));
 const infoButton=button("",()=>setMode(view.mode==="info"?"preview":"info"));
 infoButton.setAttribute("aria-label",text("info"));
 infoButton.setAttribute("title",text("info"));
 infoButton.appendChild(actionIcon("info"));
 actions.append(save,clear,infoButton);
 const choicePrevious=button("",()=>{
  if(busy||!["generation","type"].includes(view.mode))return;
  view.choicePage--;renderChoices();
 });
 const choiceNext=button("",()=>{
  if(busy||!["generation","type"].includes(view.mode))return;
  view.choicePage++;renderChoices();
 });
 choicePrevious.id="tp-egg-choice-prev";
 choiceNext.id="tp-egg-choice-next";
 choicePrevious.className=choiceNext.className="tp-egg-choice-nav";
 choicePrevious.setAttribute("aria-label",text("previousChoice"));
 choiceNext.setAttribute("aria-label",text("nextChoice"));
 for(const [node,kind]of [[choicePrevious,"previous"],[choiceNext,"next"]]){
  const face=create("span",undefined,"tp-egg-nav-face");
  face.textContent=kind==="previous"?"<":">";node.appendChild(face);
 }
 controls.push(save,clear,infoButton,exit,choicePrevious,choiceNext);

 panel.append(frame,settings,right,actions,infoPanel,status,choicePrevious,choiceNext);
 view={
  pending,used,draft:{...pending},editable,isEgg,mode:"preview",choicePage:0,
  settings,right,preview,picker,infoPanel,
  generationButton:generation.node,typeButton:type.node,
  generationValue:generation.value,typeValue:type.value,
  art,summary,status,save,clear,infoButton,exit,choicePrevious,choiceNext
 };
 setMode("preview");
 overlay.hidden=false;document.body.style.overflow="hidden";
 dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;
 exit.focus();
 const openedView=view;
 if(typeof requestAnimationFrame==="function")
  requestAnimationFrame(()=>{
   if(view===openedView&&!overlay.hidden&&view.mode==="preview")exit.focus();
  });
 if(typeof ResizeObserver==="function"){
  view.resizeObserver=new ResizeObserver(()=>{
   if(view!==openedView||overlay.hidden||busy||!["generation","type"].includes(view.mode))return;
   const next=pageState();
   if(next.size!==view.choiceSize){
    const firstIndex=view.choicePage*(view.choiceSize||next.size);
    view.choicePage=Math.floor(firstIndex/next.size);
    renderChoices();
   }
  });
  view.resizeObserver.observe(view.picker);
 }
}
window.TPEggPlanning=Object.freeze({open,get busy(){return busy;}});
const launch=button("Eier",open);document.querySelector(".tp-tools").appendChild(launch);
launch.disabled=true;
setInterval(()=>{
 const disabled=busy||!quiet();
 if(launch.disabled!==disabled)launch.disabled=disabled;
},700);
})();
