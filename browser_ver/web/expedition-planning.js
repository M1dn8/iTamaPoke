// C2 direct buttons: no extra window, dropdown, confirmation or page reload.
(function(){
"use strict";
const routes=["Erkundung","Beerenwiese","Quellpfad","Waldlichtung","Training"];
const items=["Nahrung","Energie","Pflege","Training"];
let selected=0,busy=false,cached=null,cachedAt=0,message="",messageUntil=0;
function ready(){return !!Module&&!!fns&&typeof fns.isEgg==="function";}
function quiet(){return ready()&&!["game","gamemenu","battle","keyboard"].includes(screen)&&!fns.evolvingNow()&&!fns.ceremony()&&!fns.wildPromptActive()&&!tpSaveReplacing;}
function call(name,...args){return Module.ccall(name,"number",args.map(()=>"number"),args);}
function tell(text){message=text;messageUntil=Date.now()+7000;}
function invalidate(){cached=null;cachedAt=0;}
function reason(code,cost){return ["","Ziel nicht verfuegbar","Uhrzeit pruefen","Erst schluepfen lassen","Pokemon schlaeft","Animation abwarten","Expedition erst abholen","Nahrung unter 40","Freude unter 40","Hygiene unter 40","Zu wenig Energie (mind. "+(cost+20)+")","Inventar voll","Kampfentscheidung beenden"][code]||"Gerade nicht moeglich";}
function view(){
 if(!ready())return null;
 if(!cached||Date.now()-cachedAt>200){
  const s=Array.from({length:26},(_,i)=>call("tp_c2_get",i));
  const active=s[9]!==0,route=active?s[10]:selected;
  const costs=[15,30,60].map(m=>call("tp_c2_cost",m,route));
  cached={s,route,costs,reasons:[15,30,60].map(m=>call("tp_c2_reason",m,route)),canClaim:!!call("tp_c2_can_claim")};cachedAt=Date.now();
 }
 const now=Math.floor(Date.now()/1000),pending=cached.s[9]!==0;
 return {...cached,pending,ready:pending&&now>=cached.s[9],left:Math.max(1,Math.ceil((cached.s[9]-now)/60)),busy,quiet:quiet(),notice:Date.now()<messageUntil?message:""};
}
function selectRoute(route){
 const v=view();if(busy||!v||v.pending||!quiet()||route<0||route>4)return;
 selected=route;message="";invalidate();if(typeof playSfx==="function")playSfx(0);
}
function toolbarLock(){
 const elements=Array.from(document.querySelectorAll("#toolbar,.tp-tools"));
 const previous=elements.map(n=>!!n.inert);elements.forEach(n=>n.inert=true);
 return ()=>elements.forEach((n,i)=>n.inert=previous[i]);
}
// Capture fallback for browsers without inert and toolbar refresh timers.
document.addEventListener("click",e=>{
 if(busy&&e.target?.closest?.("#toolbar,.tp-tools")){e.preventDefault();e.stopImmediatePropagation();}
},true);
async function act(action,minutes=15,route=selected,item=-1,stat=-1){
 if(busy||!quiet()){tell("Aktion kurz abwarten");return false;}
 if(action===0){const code=call("tp_c2_reason",minutes,route);if(code){tell(reason(code,call("tp_c2_cost",minutes,route)));return false;}}
 const mod=Module;let begun=false,committed=false;const unlock=toolbarLock();
 busy=true;tpSaveReplacing=true;tpSaveEpoch++;tell("Speichern…");
 dragStart=null;dragNow=null;
 try{
  if(!call("tp_c2_apply",action,minutes,route,item,stat)){tell(action===1?"Fach voll oder Training maximal":"Aktion gerade nicht moeglich");return false;}
  begun=true;const reward=action===1?call("tp_c2_get",14):-1;
  await writeSave(exportStateBytes(mod),true);committed=true;
  if(!call("tp_c2_finish",1))throw Error("Commit confirmation failed");
  tell(action===0?"Expedition gestartet":action===1?items[reward]+" gefunden":items[item]+" verwendet");
  if(typeof playSfx==="function")playSfx(action===1?6:0);
  return true;
 }catch(e){
  console.error("[expedition-c2]",e);
  if(begun&&!committed)call("tp_c2_finish",0);
  tell(committed?"Gespeichert – Seite bei Problemen neu laden":"Speichern fehlgeschlagen – Aktion zurueckgenommen");
  return false;
 }finally{
  tpSaveEpoch++;tpSaveReplacing=false;busy=false;invalidate();unlock();
 }
}
window.TPExpeditions={
 view,selectRoute,start:minutes=>act(0,minutes),claim:()=>act(1),
 use:(item,stat=-1)=>act(2,15,selected,item,stat),
 tell,routeNames:routes,itemNames:items,
 get busy(){return busy;},
 open(){if(!busy){screen="card";cardPage=7;}}
};
})();
