// D3a: bounded foreground measurements only. No scheduling/gameplay changes.
(function(){
"use strict";
const LIMIT=180,EVERY=6,modes=new Set(["idle","dex","card","battle","keyboard","gamemenu","settings","menue","typenspiel","minispiel","sonstiges"]),pages=new Set(["main","settings","files","journal","diagnostics","saves","assets"]),series=Object.create(null);
let epoch=0,frameCount=0,previous=null,startMs=null,bootHidden=document.visibilityState==="hidden",rejected=0;
const counters={bestaetigt:0,fehlgeschlagen:0,verworfen:0};
function now(){try{return performance.now();}catch(_e){return null;}}
function visible(){return document.visibilityState==="visible";}
function begin(){try{const t=now();return visible()&&Number.isFinite(t)?{t,epoch}:null;}catch(_e){return null;}}
function valid(token){return token&&visible()&&token.epoch===epoch&&Number.isFinite(token.t);}
function add(key,ms){if(!Number.isFinite(ms)||ms<0||ms>60000){rejected++;return;}const s=series[key]||(series[key]={count:0,values:[]});s.count++;s.values.push(ms);if(s.values.length>LIMIT)s.values.shift();}
function duration(key,token){try{if(valid(token))add(key,now()-token.t);}catch(_e){}}
function page(name,token){if(pages.has(name))duration("Seite/"+name,token);}
function encode(token){duration("Zustands-Export",token);}
function saved(token,outcome){try{if(Object.prototype.hasOwnProperty.call(counters,outcome)){counters[outcome]++;if(outcome!=="verworfen")duration("Schreiben/"+outcome,token);}}catch(_e){}}
function frame(mode,t){try{
 if(!visible()){previous=null;return null;}if(!modes.has(mode))mode="sonstiges";
 if(previous&&previous.mode===mode&&Number.isFinite(t)&&Number.isFinite(previous.t))add("Durchlaufabstand/"+mode,t-previous.t);
 previous={mode,t};const sample=frameCount++%EVERY===0;if(!sample)return null;const token=begin();if(token)token.mode=mode;return token;
}catch(_e){return null;}}
function tick(token,ran){if(ran&&token&&modes.has(token.mode))duration("Nativer Takt/"+token.mode,token);}
function drawStart(token){if(token)token.draw=begin();}
function frameEnd(token,rendered,ok){try{
 if(startMs===null&&!bootHidden&&visible()&&ok){const n=now();if(Number.isFinite(n))startMs=n;}
 if(token&&modes.has(token.mode)&&rendered&&ok)duration("Zeichenpfad/"+token.mode,token.draw);
}catch(_e){}}
function summary(s){const a=s.values.slice().sort((x,y)=>x-y),n=a.length,round=x=>Math.round(x*1000)/1000;return {gesamtErfasst:s.count,fenster:n,mittelMs:round(a.reduce((x,y)=>x+y,0)/n),medianMs:round(n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2),p95Ms:round(a[Math.ceil(n*.95)-1]),maximumMs:round(a[n-1])};}
function snapshot(){try{
 const timings={};for(const key of Object.keys(series).sort())timings[key]=summary(series[key]);
 return {phase:"D3b-Vergleichsversion",startBisErstemDurchlaufMs:startMs===null?null:Math.round(startMs*1000)/1000,startHinweis:bootHidden?"Start wegen Hintergrundphase nicht bewertet":"Navigation bis erstem erfolgreichen App-Durchlauf, keine Bildschirm-Paint-Messung",stichprobeJeder:EVERY,maxWerteJeReihe:LIMIT,verworfen:rejected,schreibvorgaenge:{...counters},messreihen:timings,hinweis:"Nur Vordergrund. Nativer Takt ist tp_tick; Zeichenpfad umfasst bei Minispielen auch deren Schrittberechnung. Abstände sind keine gemessenen Bildschirm-FPS. Werte enthalten Messaufwand. Fenster seit App-Start, begrenzt auf letzte 180 Werte je Reihe."};
}catch(_e){return null;}}
document.addEventListener("visibilitychange",()=>{epoch++;previous=null;frameCount=0;if(startMs===null&&!visible())bootHidden=true;});
window.TPPerformance=Object.freeze({begin,page,encode,saved,frame,tick,drawStart,frameEnd,snapshot});
})();
