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
const overlay=create("div",undefined,"tp-modal");overlay.hidden=true;
const panel=create("section",undefined,"tp-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-labelledby","tp-egg-plan-title");overlay.appendChild(panel);document.body.appendChild(overlay);
function close(){if(busy)return;overlay.hidden=true;document.body.style.overflow=previousOverflow;previousFocus?.focus();}
overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
overlay.addEventListener("keydown",e=>{
 if(e.key==="Escape"){e.preventDefault();close();return;}
 if(e.key!=="Tab")return;const nodes=Array.from(panel.querySelectorAll("button:not(:disabled),select:not(:disabled),input:not(:disabled)"));const first=nodes[0],last=nodes[nodes.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
});
function row(labelText,input){const label=create("label",undefined,"tp-label");label.style.cssText="display:block;margin:12px 0";label.append(document.createTextNode(labelText),input);panel.appendChild(label);}
function select(options,current){const input=create("select");input.style.cssText="width:100%;min-height:44px;font-size:16px;margin:6px 0";options.forEach((label,value)=>{const option=create("option",label);option.value=value;input.appendChild(option);});input.value=String(current);return input;}
function note(text){panel.appendChild(create("p",text,"tp-small"));}
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
 try{pending=readPlan();used=readPlan(true);editable=!!call("tp_egg_plan_can_set");}catch(_e){throw Error("Der C1-Spielkern ist nicht verfuegbar. Bitte den vollstaendig gebauten C1-Teststand oeffnen.");}
 if(overlay.hidden){previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;}
 panel.replaceChildren();const head=create("div",undefined,"tp-modal-head"),title=create("h2","Naechstes Ei planen");title.id="tp-egg-plan-title";const exit=button("Schliessen",close);head.append(title,exit);panel.appendChild(head);
 overlay.hidden=false;document.body.style.overflow="hidden";dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;exit.focus();
 const card=create("article",undefined,"tp-card");card.append(create("h3","Gespeicherter Plan"),create("p",describe(pending)));panel.appendChild(card);
 if(fns.isEgg()){
  note("Dieses Ei wurde bereits ausgelost. Hier gibt es keinen Neuwurf, und seine Art bleibt verborgen. Einen neuen Plan kannst du nach dem Schluepfen festlegen.");
  note("Bei diesem Ei beruecksichtigt: "+describe(used));
 }else{
  note("Dein aktuelles Pokemon bleibt unveraendert. Der Plan gilt einmalig fuer das naechste Ei nach dem regulaeren Ende dieser Aufzucht, auch bei Freilassen oder Weglaufen.");
 }
 const generation=select(["Alle Generationen",...Array.from({length:9},(_,i)=>"Generation "+(i+1))],pending.generation),type=select(types,pending.type);
 row("Bevorzugte Generation",generation);row("Bevorzugter Typ",type);
 const unraised=create("input");unraised.type="checkbox";unraised.checked=pending.unraised;
 const label=create("label");label.append(unraised,document.createTextNode(" Noch nicht aufgezogene Arten staerker gewichten"));panel.appendChild(label);
 note("Jeder passende Wunsch gibt einer Art das dreifache Losgewicht. Wuensche werden kombiniert (maximal 27-faches Gewicht). Das bedeutet nicht die dreifache Wahrscheinlichkeit und ist keine Garantie fuer Typ, Generation oder eine bestimmte Art.");
 note("Seltenheitswurf, Schillernd-Chance, ei-faehige Arten und der bisherige Vorrang unvollstaendiger Entwicklungslinien bleiben unveraendert. Die Gewichtung wirkt nur innerhalb des danach verwendeten Kandidatenpools. Gibt es darin keine passenden Arten, bleibt die Auswahl entsprechend ungefaerbt.");
 const status=create("p",undefined,"tp-small");status.setAttribute("role","status");const controls=[generation,type,unraised];
 const save=button("Plan speichern und neu laden",()=>storePlan({generation:Number(generation.value),type:Number(type.value),unraised:unraised.checked},status,controls));
 const clear=button("Zufall wiederherstellen",()=>storePlan({generation:0,type:0,unraised:false},status,controls));controls.push(save,clear);
 const actions=create("div",undefined,"tp-modal-row");actions.append(save,clear);panel.append(actions,status);
 controls.forEach(n=>n.disabled=!editable);
 if(fns.awaitingStarter())note("Die erste Starterauswahl bleibt unveraendert.");
 note("Der Plan wird im Spielstand gespeichert und von den Sicherungen aus Paket B mitgenommen. Beim Erzeugen des naechsten Eis wird er verbraucht. Neuladen desselben Eis erzeugt keine neue Art und keinen neuen Schillernd-Wurf.");
}
const launch=button("Eier",open);document.querySelector(".tp-tools").appendChild(launch);
launch.disabled=true;setInterval(()=>{launch.disabled=busy||!quiet();},700);
})();
