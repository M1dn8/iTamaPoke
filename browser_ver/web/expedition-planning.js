// Four fixed expeditions. Direct card buttons; one guaranteed item each.
(function(){
"use strict";
const targets=[
 {route:1,name:"Beerenwiese",item:"Nahrung",minutes:15,cost:12},
 {route:2,name:"Quellpfad",item:"Energie",minutes:15,cost:12},
 {route:3,name:"Waldlichtung",item:"Pflege",minutes:15,cost:12},
 {route:4,name:"Trainingspfad",item:"Training",minutes:30,cost:26}
];
const items=["Nahrung","Energie","Pflege","Training"],oldNames=["Erkundung","Beerenwiese","Quellpfad","Waldlichtung","Trainingspfad"];
let busy=false,cached=null,cachedAt=0,message="",messageUntil=0;
function ready(){return !!Module&&!!fns&&typeof fns.isEgg==="function";}
function quiet(){return ready()&&!["game","gamemenu","battle","keyboard"].includes(screen)&&!fns.evolvingNow()&&!fns.ceremony()&&!fns.wildPromptActive()&&!tpSaveReplacing;}
function call(name,...args){return Module.ccall(name,"number",args.map(()=>"number"),args);}
function tell(text){message=text;messageUntil=Date.now()+7000;}
function invalidate(){cached=null;cachedAt=0;}
function reason(code,cost){return ["","Auswahl nicht verfuegbar","Uhrzeit pruefen","Erst schluepfen lassen","Pokemon schlaeft","Animation abwarten","Expedition erst abholen","Nahrung unter 40","Freude unter 40","Hygiene unter 40","Zu wenig Energie (mind. "+(cost+20)+")","Fach fuer diesen Gegenstand voll","Kampfentscheidung beenden","Training bereits maximal"][code]||"Gerade nicht moeglich";}
function view(){
 if(!ready())return null;
 if(!cached||Date.now()-cachedAt>200){
  const s=Array.from({length:27},(_,i)=>call("tp_c2_get",i));
  if(s[26]!==0&&s[26]!==1)throw Error("Aktueller Spielkern erforderlich");
  cached={s,reasons:targets.map(t=>call("tp_c2_reason",t.minutes,t.route)),canClaim:!!call("tp_c2_can_claim")};cachedAt=Date.now();
 }
 const now=Math.floor(Date.now()/1000),pending=cached.s[9]!==0;
 return {...cached,pending,ready:pending&&now>=cached.s[9],left:Math.max(1,Math.ceil((cached.s[9]-now)/60)),busy,quiet:quiet(),notice:Date.now()<messageUntil?message:""};
}
function toolbarLock(){const nodes=Array.from(document.querySelectorAll("#toolbar,.tp-tools")),before=nodes.map(n=>!!n.inert);nodes.forEach(n=>n.inert=true);return ()=>nodes.forEach((n,i)=>n.inert=before[i]);}
document.addEventListener("click",e=>{if(busy&&e.target?.closest?.("#toolbar,.tp-tools")){e.preventDefault();e.stopImmediatePropagation();}},true);
async function act(action,minutes=15,route=1,item=-1,stat=-1){
 if(busy||!quiet()){tell("Aktion kurz abwarten");return false;}
 if(action===0){const code=call("tp_c2_reason",minutes,route);if(code){tell(reason(code,call("tp_c2_cost",minutes,route)));return false;}}
 const mod=Module;let begun=false,committed=false;const unlock=toolbarLock();busy=true;tpSaveReplacing=true;tpSaveEpoch++;tell("Speichern…");dragStart=null;dragNow=null;
 try{
  if(!call("tp_c2_apply",action,minutes,route,item,stat)){tell(action===1?"Fach voll oder Training maximal":"Aktion gerade nicht moeglich");return false;}
  begun=true;const reward=action===1?call("tp_c2_get",14):-1;
  await writeSave(exportStateBytes(mod),true);committed=true;
  if(!call("tp_c2_finish",1))throw Error("Commit confirmation failed");
  tell(action===0?"Expedition gestartet":action===1?items[reward]+" gefunden":items[item]+" verwendet");
  if(typeof playSfx==="function")playSfx(action===1?6:0);return true;
 }catch(e){console.error("[expedition-c2]",e);if(begun&&!committed)call("tp_c2_finish",0);tell(committed?"Gespeichert – Seite bei Problemen neu laden":"Speichern fehlgeschlagen – Aktion zurueckgenommen");return false;}
 finally{tpSaveEpoch++;tpSaveReplacing=false;busy=false;invalidate();unlock();}
}
window.TPExpeditions={targets,itemNames:items,oldNames,view,tell,
 start(route){const t=targets.find(t=>t.route===route);if(!t){tell("Auswahl nicht verfuegbar");return Promise.resolve(false);}return act(0,t.minutes,t.route);},
 claim:()=>act(1),use:(item,stat=-1)=>act(2,15,1,item,stat),
 get busy(){return busy;},open(){if(!busy){screen="card";cardPage=7;}}
};
})();
