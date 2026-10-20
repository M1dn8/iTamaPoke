// C2: route selection, exact previews, pending rewards and inventory actions.
(function(){
"use strict";
const routes=["Erkundung","Beerenwiese","Quellpfad","Waldlichtung","Trainingspfad"],items=["Nahrung","Energie","Pflege","Training"];
let busy=false,previousFocus=null,previousOverflow="",updateView=null;
function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function button(text,fn){const b=node("button",text);b.type="button";b.addEventListener("click",()=>Promise.resolve().then(fn).catch(showError));return b;}
function showError(e){console.error("[expedition-c2]",e);alert(e?.message||String(e));}
function ready(){return !!Module&&!!fns&&typeof fns.isEgg==="function";}
function quiet(){return ready()&&!["game","gamemenu","battle","keyboard"].includes(screen)&&!fns.evolvingNow()&&!fns.ceremony()&&!fns.wildPromptActive()&&!tpSaveReplacing;}
function call(name,...args){return Module.ccall(name,"number",args.map(()=>"number"),args);}
function state(){return Array.from({length:26},(_,i)=>call("tp_c2_get",i));}
function date(epoch){return new Date(epoch*1000).toLocaleString();}
function close(){if(busy)return;overlay.hidden=true;document.body.style.overflow=previousOverflow;previousFocus?.focus();updateView=null;}
const overlay=node("div",undefined,"tp-modal");overlay.hidden=true;
const panel=node("section",undefined,"tp-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-labelledby","tp-exp-c2-title");overlay.appendChild(panel);document.body.appendChild(overlay);
overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
overlay.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();close();return;}if(e.key!=="Tab")return;const nodes=Array.from(panel.querySelectorAll("button:not(:disabled),select:not(:disabled)"));const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}});
function select(labels,values,value){const s=node("select");s.style.cssText="width:100%;min-height:44px;font-size:16px;margin:6px 0";labels.forEach((label,i)=>{const o=node("option",label);o.value=values[i];s.appendChild(o);});s.value=String(value);return s;}
function label(text,input){const n=node("label",text);n.style.cssText="display:block;margin:12px 0";n.appendChild(input);panel.appendChild(n);}
function note(text){panel.appendChild(node("p",text,"tp-small"));}
function reason(code,cost){return ["Startbereit.","Ziel oder Dauer ungueltig.","Uhrzeit fehlt oder liegt ausserhalb des unterstuetzten Bereichs.","Ein Ei kann nicht auf Expedition gehen.","Das Pokemon schlaeft.","Bitte Entwicklung oder Zeremonie beenden.","Die laufende Expedition zuerst abschliessen und abholen.","Nahrung muss mindestens 40 betragen.","Freude muss mindestens 40 betragen.","Hygiene muss mindestens 40 betragen.","Mindestens "+(cost+20)+" Energie noetig: "+cost+" Kosten plus 20 Reserve.","Kein sinnvoll aufnehmbarer Gegenstand: Vorrat verwenden oder Trainingskapazitaet pruefen.","Bitte zuerst die Kampfentscheidung beenden."][code]||"Start gerade nicht moeglich.";}
async function act(action,minutes=15,route=0,item=-1,stat=-1){
 if(busy||!quiet())throw Error("Bitte laufende Aktion oder Kampfentscheidung beenden.");
 const mod=Module;let begun=false,committed=false;busy=true;tpSaveReplacing=true;
 panel.querySelectorAll("button,select").forEach(n=>n.disabled=true);
 try{
  if(!call("tp_c2_apply",action,minutes,route,item,stat))throw Error("Aktion nicht mehr moeglich. Bitte die aktuellen Bedingungen pruefen.");begun=true;
  await writeSave(exportStateBytes(mod),true);committed=true;
  call("tp_c2_finish",1);Module=null;window.location.reload();
 }catch(e){
  Module=mod;
  if(begun&&!committed)call("tp_c2_finish",0);
  busy=false;tpSaveReplacing=false;
  panel.querySelectorAll("button,select").forEach(n=>n.disabled=false);updateView?.();
  if(committed)throw Error("Aktion gespeichert. Bitte die Seite neu laden.");
  throw e;
 }
}
function open(){
 if(busy||!quiet())throw Error("Bitte zuerst Kampf, Minispiel oder Animation beenden.");
 let initial;try{initial=state();}catch(_e){throw Error("C2-Spielkern nicht verfuegbar. Bitte den vollstaendig gebauten C2-Teststand oeffnen.");}
 if(overlay.hidden){previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;}
 panel.replaceChildren();const head=node("div",undefined,"tp-modal-head"),title=node("h2","Expeditionen");title.id="tp-exp-c2-title";const exit=button("Schliessen",close);head.append(title,exit);panel.appendChild(head);
 overlay.hidden=false;document.body.style.overflow="hidden";dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;expeditionTrainChoiceOpen=false;exit.focus();
 const status=node("p"),details=node("p",undefined,"tp-small"),last=node("p",undefined,"tp-small");status.setAttribute("role","status");panel.append(status,details,last);
 const route=select(routes,[0,1,2,3,4],initial[9]?initial[10]:initial[15]),duration=select(["15 Minuten","30 Minuten","60 Minuten"],[15,30,60],initial[12]||15);
 label("Expeditionsziel",route);label("Dauer",duration);
 const preview=node("p",undefined,"tp-manager-status");preview.style.whiteSpace="pre-wrap";panel.appendChild(preview);
 const start=button("Expedition starten",()=>act(0,Number(duration.value),Number(route.value)));panel.appendChild(start);
 const claim=button("Belohnung abholen",()=>act(1));panel.appendChild(claim);
 const blocked=node("p",undefined,"tp-small");panel.appendChild(blocked);
 panel.appendChild(node("h3","Inventar"));const cards=[];
 for(let i=0;i<4;i++){
  const card=node("article",undefined,"tp-card"),count=node("p");card.appendChild(count);const actionBox=node("div");actionBox.style.cssText="display:flex;gap:6px;flex-wrap:wrap";card.appendChild(actionBox);const actions=[];
  if(i<3){const b=button(items[i]+" verwenden",()=>{
   const s=state(),wasted=i===0?s[1]>=100&&s[2]>=100:i===1?s[0]>=100:s[3]>=100&&s[25]===0;
   if(wasted&&!confirm("Der Gegenstand hat gerade keine zusaetzliche Pflegewirkung. Trotzdem verwenden, um einen Inventarplatz freizumachen?"))return;
   return act(2,15,0,i,-1);
  });actionBox.appendChild(b);actions.push(b);}
  else for(let stat=0;stat<3;stat++){const b=button(["Angriff +2","Verteidigung +2","Tempo +2"][stat],()=>act(2,15,0,3,stat));actionBox.appendChild(b);actions.push(b);}
  panel.appendChild(card);cards.push({count,actions});
 }
 note("Eine Expedition bringt genau einen Gegenstand. Ergebnis und Endzeit werden beim Start gespeichert. Volle Faecher werden bei der Auswahl ausgeschlossen; eine bereits gespeicherte Belohnung bleibt bis zur moeglichen Abholung erhalten.");
 note("Dein Pokemon bleibt bedienbar. Pflege und normaler Zeitverlauf laufen weiter; du kannst die App schliessen. Ziele koennen waehrend einer laufenden Expedition nicht geaendert werden. Start, Abholung und Gegenstandsverbrauch speichern sofort und laden die Seite neu.");
 updateView=()=>{
  if(busy||!ready())return;const s=state(),now=Math.floor(Date.now()/1000),pending=s[9]!==0,isReady=pending&&now>=s[9];
  const interact=quiet()&&!s[5]&&!s[7]&&!s[8];const minutes=Number(duration.value),r=Number(route.value),cost=call("tp_c2_cost",minutes,r),chance=call("tp_c2_chance",minutes,r),code=call("tp_c2_reason",minutes,r);
  status.textContent=pending?(isReady?"Bereit zur Abholung: "+items[s[24]]:"Unterwegs: "+routes[s[10]]):"Keine Expedition unterwegs.";
  details.textContent=pending?routes[s[10]]+" · "+(s[12]?s[12]+" Minuten":"Dauer aus altem Spielstand nicht gespeichert")+" · "+(isReady?"Fertig seit ":"Fertig am ")+date(s[9])+(isReady?"":" · Noch "+Math.max(1,Math.ceil((s[9]-now)/60))+" Minuten")+" · "+(s[13]<=100?"Trainingschance beim Start: "+s[13]+" %":"Startchance im alten Spielstand nicht gespeichert") : "Nahrung "+s[1]+" · Freude "+s[2]+" · Energie "+s[0]+" · Hygiene "+s[3]+" · Bindung "+s[4];
  last.textContent=s[14]<4&&s[16]?"Letzte Abholung: "+items[s[14]]+" aus "+routes[s[15]]+" am "+date(s[16])+". Aktueller Vorrat: "+s[20+s[14]]+" / 3.":"";
  route.disabled=duration.disabled=pending||!interact;start.hidden=pending;start.disabled=pending||!interact||code!==0;
  claim.hidden=!isReady;claim.disabled=!isReady||!interact||!call("tp_c2_can_claim");
  blocked.textContent=isReady&&claim.disabled?(s[5]?"Nach dem Schluepfen abholen; die Belohnung bleibt gespeichert.":"Abholung gerade gesperrt: Fach voll, Training maximal oder eine Spielaktion aktiv. Die Belohnung bleibt gespeichert."):"";
  preview.hidden=pending;
  const weights=[0,1,2].map(i=>call("tp_c2_weight",r,i)),total=weights.reduce((a,b)=>a+b,0);
  const common=total?"Bei anderem Fund: "+weights.map((w,i)=>items[i]+" "+Math.round(w/total*1000)/10+" %").join(" · "):"Keine gewoehnlichen Gegenstaende aufnehmbar.";
  preview.textContent="Kosten: "+cost+" Energie · Danach: "+(s[0]-cost)+"\nTraining: "+chance+" %\n"+common+"\n"+reason(code,cost)+(weights.some(w=>w===0)?"\nEingeschraenkter Belohnungspool: volle Faecher werden ausgeschlossen.":"")+(chance===100?"\nNur Training aufnehmbar: Der Trainingspfad bringt keinen zusaetzlichen Vorteil.":"");
  for(let i=0;i<4;i++){cards[i].count.textContent=items[i]+": "+s[20+i]+" / 3"+(i===3?" · Training ATK/DEF/TEMPO: "+s[17]+" / "+s[18]+" / "+s[19]:"");cards[i].actions.forEach((b,j)=>b.disabled=!interact||s[20+i]===0||(i===3&&s[17+j]>=100));}
 };
 route.addEventListener("change",()=>updateView?.());duration.addEventListener("change",()=>updateView?.());updateView();
}
setInterval(()=>{if(!overlay.hidden&&!busy)try{updateView?.();}catch(e){showError(e);close();}},1000);
window.TPExpeditions={open};
})();
