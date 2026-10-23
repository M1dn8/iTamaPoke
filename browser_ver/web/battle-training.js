// F1 direct trainings, native counters; one reversible reward after ten seconds.
(function(){'use strict';
const config=[{kind:0,title:'Stärke-Training',stat:'Angriff',counter:'Treffer',color:'#b53a3a'},{kind:2,title:'Tempo-Training',stat:'Tempo',counter:'Trainingsschritte',color:'#a27819'},{kind:1,title:'Verteidigungs-Training',stat:'Verteidigung',counter:'Abwehraktionen',color:'#397ab6'}];
let state=null,busy=false,notice='',noticeUntil=0;
const call=(name,...args)=>Module.ccall(name,'number',args.map(()=> 'number'),args);
const get=key=>call('tp_f1_get',key);
function owns(){return !!state&&screen==='game'&&gameMode>=5&&gameMode<=7;}
function tell(text){notice=text;noticeUntil=Date.now()+5000;}
function canStart(){try{return !!Module&&!!fns&&screen==='card'&&cardPage===4&&!busy&&!tpSaveReplacing&&!window.TPMega?.busy&&!window.TPExpeditions?.busy&&choice==='none'&&!!call('tp_f1_can');}catch(_e){return false;}}
function start(kind,now=performance.now()){
 if(!canStart())return false;const c=config.find(x=>x.kind===kind);if(!c)return false;
 const id=call('tp_f1_start',kind,now>>>0);if(!id){tell('Training gerade nicht verfügbar.');return false;}
 state={id,kind,config:c,mod:Module,start:now,lastStep:now,lastHit:-1e9,hits:0,before:get(8),record:get(4),phase:'running',gain:0,after:get(8),newHigh:false,error:''};
 dragStart=dragNow=null;holdFired=false;gameMode=5+kind;screen='game';ensureSprite(fns.speciesId());return true;
}
function leave(){screen='card';cardPage=4;dragStart=dragNow=null;}
function abort(message='Training abgebrochen – keine Punkte oder Kosten.'){
 if(!state||busy)return false;if(state.phase==='running'&&Module===state.mod)call('tp_f1_cancel',state.id);state.phase='aborted';tell(message);leave();return true;
}
function tap(now,x=233,y=200){
 if(!owns()||busy)return false;
 if(state.phase==='running'){
  if(x>=151&&x<=315&&y>=400&&y<=444){abort();return true;}
  if(document.visibilityState!=='visible'||Module!==state.mod){abort();return false;}
  if(call('tp_f1_tap',state.id,now>>>0)){state.hits=get(2);state.lastHit=now;if(typeof playSfx==='function')playSfx(state.kind===1?17:2);return true;}return false;
 }
 if(x>=95&&x<=371&&y>=365&&y<=413){leave();return true;}return false;
}
function pointerDown(event){
 if(!owns())return false;if(event.isPrimary===false)return true;event.preventDefault?.();const p=toScreenSpace(event.clientX,event.clientY);tap(performance.now(),p.x,p.y);return true;
}
async function complete(now){
 if(!owns()||busy||state.phase!=='running')return false;
 if(Module!==state.mod||document.visibilityState!=='visible'||tpSaveReplacing||window.TPMega?.busy||window.TPExpeditions?.busy){abort();return false;}
 const current=state,mod=Module,native=(name,...args)=>mod.ccall(name,'number',args.map(()=> 'number'),args),read=key=>native('tp_f1_get',key);let begun=false,committed=false,locked=false;busy=true;current.phase='saving';
 try{
  tpSaveReplacing=true;tpSaveEpoch++;locked=true;
  if(!native('tp_f1_apply',current.id,now>>>0)){current.phase='failed';current.error='Voraussetzungen geändert – keine Punkte übernommen.';native('tp_f1_cancel',current.id);return false;}
  begun=true;await writeSave(exportStateBytes(mod),true);committed=true;
  if(!native('tp_f1_finish',current.id,1))throw Error('Trainings-Commit nicht bestätigt');
  current.gain=read(3);current.after=read(6);current.record=read(4);current.newHigh=!!read(5);current.phase='done';return true;
 }catch(e){
  if(begun&&!committed)native('tp_f1_finish',current.id,0);
  window.TPDiagnostics?.record('manager',e);current.phase=committed?'done':'failed';current.gain=committed?read(3):0;current.after=committed?read(6):current.before;current.record=read(4);current.newHigh=committed&&!!read(5);
  current.error=committed?'Gespeichert; bei Anzeigeproblemen App neu öffnen.':'Speichern fehlgeschlagen – Training zurückgenommen.';return false;
 }finally{if(locked){tpSaveEpoch++;tpSaveReplacing=false;}busy=false;}
}
function step(now){
 if(!owns()||busy||state.phase!=='running')return;
 if(document.visibilityState!=='visible'||Module!==state.mod||now<state.lastStep||now-state.lastStep>2000){abort('Training unterbrochen – keine Punkte oder Kosten.');return;}
 state.lastStep=now;if(now-state.start>=10000)complete(now);
}
function text(value,y,size=16,color=UI.ink){ctx.textAlign='center';ctx.fillStyle=color;ctx.font=`${size}px -apple-system,system-ui,sans-serif`;ctx.fillText(value,TP.cx,y);}
function button(label,x,y,w,color=UI.ink){ctx.fillStyle=UI.white;roundRect(x,y,w,44,10);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke();textAt(label,x+w/2,y+28,14,UI.ink);}
function textAt(value,x,y,size,color){ctx.textAlign='center';ctx.fillStyle=color;ctx.font=`${size}px -apple-system,system-ui,sans-serif`;ctx.fillText(value,x,y);}
function drawActor(now,x,ground,act){
 const sprite=currentSprite;
 if(!sprite){textAt('?',x,ground-25,36,UI.ink);return false;}
 const selected=spriteHas(sprite,act)?act:TPAct.idle,a=sprite.actions[selected];if(!a)return false;
 const frame=frameIndexAt(a,now-state.start,true),img=frameImageData(sprite,selected,frame);if(!img)return false;
 const s=Math.min(spriteScale(sprite,a),2,140/a.w,140/a.h),w=a.w*s,h=a.h*s;
 frameCanvas.width=a.w;frameCanvas.height=a.h;frameCtx.putImageData(img,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(frameCanvas,x-w/2,ground-a.base*s,w,h);return selected===act;
}
function draw(now){
 if(!state){leave();return;}const {ink}=drawGameScene();ensureSprite(fns.speciesId());const c=state.config;
 text(c.title,43,23,ink);text(window.TPMega?.active()?window.TPMega.name():fns.name(),72,15,ink);
 if(state.phase!=='running'){
  text(state.phase==='saving'?'Training wird gespeichert …':state.phase==='failed'?'Nicht gespeichert':'Training abgeschlossen',124,20,ink);
  text(c.counter+': '+state.hits,168,23,ink);
  if(state.phase==='done'){
   text(state.hits===0?'Keine Tipps – kein Zuwachs.':state.gain?c.stat+' +'+state.gain:state.after>=100?c.stat+' bereits maximal':'Zu wenige Tipps für einen Punkt',216,22,c.color);
   text('Trainingswert: '+state.before+' → '+state.after,249,16,ink);text('Rekord: '+state.record+(state.newHigh?' – neuer Rekord!':''),285,16,ink);
  }
  if(state.error)text(state.error,325,12,UI.barBad);
  if(!busy)button('Zurück zum Kampfbereich',95,365,276,ink);statusEl.textContent='Training: '+state.phase;return;
 }
 if(state.kind===0){
  const shake=Math.max(0,1-(now-state.lastHit)/160)*7*Math.sin(now*.08);ctx.fillStyle=ink;ctx.fillRect(322,96,4,30);ctx.fillStyle=c.color;roundRect(290+shake,120,70,138,18);ctx.fill();drawActor(now,140,275,now-state.lastHit<220?TPAct.attack:TPAct.idle);
 }else if(state.kind===2){
  const distance=state.hits*6,back=Math.floor(distance/240)%2===1,x=back?353-distance%240:113+distance%240;
  ctx.strokeStyle=c.color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(50,280);ctx.lineTo(416,280);ctx.stroke();
  const walking=drawActor(now,x,277,back?TPAct.walkL:TPAct.walkR);if(!walking)text('Bewegte Grundanimation – Laufgrafik nicht vorhanden',106,11,ink);
 }else{
  drawActor(now,218,277,TPAct.idle);const pulse=Math.max(0,1-(now-state.lastHit)/220);ctx.strokeStyle=c.color;ctx.lineWidth=3+pulse*4;ctx.beginPath();ctx.moveTo(278,132);ctx.lineTo(313,145);ctx.lineTo(307,218);ctx.lineTo(278,243);ctx.lineTo(249,218);ctx.lineTo(243,145);ctx.closePath();ctx.stroke();
  if(!pulse){const x=420-((now-state.start)%700)/700*110;ctx.fillStyle=c.color;ctx.beginPath();ctx.arc(x,181,6,0,Math.PI*2);ctx.fill();}
 }
 text(c.counter+': '+state.hits,316,29,ink);text('Tippe auf die Spielfläche!',343,14,ink);drawTimeBar(357,12,Math.max(0,10000-(now-state.start)),10000);text('Rekord: '+state.record,391,12,ink);button('Abbrechen',151,400,164,ink);statusEl.textContent=c.title+' · '+state.hits;
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible'&&state?.phase==='running'&&!busy)abort();});
window.TPTraining=Object.freeze({start,canStart,tap,pointerDown,step,draw,abort,complete,get busy(){return busy;},get snapshot(){return state?{kind:state.kind,hits:state.hits,phase:state.phase,gain:state.gain,before:state.before,after:state.after,record:state.record}:null;},get notice(){return Date.now()<noticeUntil?notice:'';}});
})();
