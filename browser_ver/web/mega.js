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
function line(text,y,size=14,color=UI.ink){ctx.font=size+"px -apple-system,system-ui,sans-serif";ctx.fillStyle=color;ctx.textAlign="center";ctx.fillText(text,TP.cx,y);}
function stateText(v){if(v.active)return "Mega-Form: noch "+Math.max(1,Math.ceil((v.end-v.now)/60))+" Minuten";if(!v.stone)return v.quest?"Mega-Prüfung bestanden":"Mega-Prüfung";if(v.cool>v.now)return "Wieder bereit in "+Math.ceil((v.cool-v.now)/60)+" Minuten";return "Mega-Entwicklung bereit";}
function button(text,y,enabled){ctx.fillStyle=enabled?UI.white:UI.track;roundRect(75,y,316,44,10);ctx.fill();ctx.strokeStyle=UI.ink;ctx.lineWidth=1;ctx.stroke();line(text,y+28,16);}
function draw(){
 const v=view();if(!v){line("Mega-Daten werden geladen …",140);return;}
 line("MEGA-ENTWICKLUNG",43,23);line(v.baseName+" → "+v.name,76,18);line(stateText(v),105,15,v.active?UI.barBad:UI.ink);
 if(!v.stone){line((v.bond>=50?"✓ ":"○ ")+"Bindung: "+v.bond+" / 50",141);line((v.care>=60?"✓ ":"○ ")+"Alle Pflegewerte mindestens 60: "+v.care,171);line((v.training>=3?"✓ ":"○ ")+"Training: "+v.training+" / 3",201);line("Ball · Merken · Typen · Boxsack",227,12,UI.track);}
 else{line("Mega-Stein dauerhaft erhalten",145,15);line("Aktiv: 15 Min. · danach 60 Min. Pause",176,13);line("Kampfbonus: +60 % / +40 % / +25 %",205,13);}
 const percentages=[160,140,125],names=["Angriff","Verteidigung","Tempo"];
 for(let i=0;i<3;i++)line(names[i]+": "+v.base[i]+" → "+Math.floor(v.base[i]*percentages[i]/100),252+i*22,14);
 const enabled=!busy&&!!v.supported&&(v.stone?(!v.active&&v.now>=v.cool):!!v.quest);
 button(busy?"Speichern …":!v.stone?"Mega-Stein abholen":v.active?"Mega-Form aktiv":v.now<v.cool?"Erholung läuft":"Mega-Entwicklung starten",324,enabled);
 if(Date.now()<messageUntil){ctx.fillStyle=UI.bgDay;ctx.fillRect(12,214,442,27);line(message,233,11,UI.barBad);}
 statusEl.textContent="Mega: "+stateText(v);
}
function drawProfileLink(){const v=view();button(v?stateText(v)+" ›":"Zur Mega-Seite ›",324,true);}
function tap(x,y){if(x>=75&&x<=391&&y>=324&&y<=368){const v=view();if(v)act(v.stone?1:0);return true;}return false;}
window.TPMega=Object.freeze({view,act,draw,drawProfileLink,tap,visible:()=>!!view()?.supported,active:()=>!!view()?.active,form:()=>view()?.form||0,name:()=>view()?.name||"Mega-Form",battleForm:()=>{try{return call("tp_e_battle_form");}catch(_e){return 0;}},shiny:()=>{try{return !!call("tp_e_shiny");}catch(_e){return false;}},battleActive:()=>{try{return !!call("tp_e_battle_mega");}catch(_e){return false;}},battleType:i=>{try{return call(i===1?"tp_e_battle_type1":"tp_e_battle_type2");}catch(_e){return 0;}},get busy(){return busy;}});
})();
