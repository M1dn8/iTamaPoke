/* Transient Arktos challenge; no save, energy or combat authority. */
(function(root,factory){
 'use strict';
 const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPIceCaveGame=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
 'use strict';
 const labels={
  de:['Minispiel starten','Erneut versuchen','Eiszapfen','Fallende Eiszapfen',
   '{seconds} s','Geschafft!','Speichern erneut versuchen',
   'Speichern fehlgeschlagen. Bitte erneut versuchen.',
   'Der Schneesturm ist zu stark, ich muss es noch einmal versuchen.'],
  en:['Start minigame','Try again','Icicle','Falling icicles',
   '{seconds} s','Completed!','Try saving again',
   'Save failed. Please try again.',
   'The snowstorm is too strong. I have to try again.'],
  es:['Iniciar minijuego','Volver a intentar','Carámbano','Carámbanos que caen',
   '{seconds} s','¡Completado!','Reintentar guardado',
   'No se pudo guardar. Inténtalo de nuevo.',
   'La tormenta de nieve es demasiado fuerte, tengo que volver a intentarlo.'],
  fr:['Démarrer le mini-jeu','Réessayer','Stalactite de glace','Chute de stalactites',
   '{seconds} s','Réussi !','Réessayer la sauvegarde',
   'Échec de la sauvegarde. Réessaie.',
   'La tempête de neige est trop forte, je dois réessayer.']
 };
 const labelKeys=[
  'start','again','target','area','time','complete','retrySave','saveFailed','failed'
 ];
 let labelsReady=false;
 function gameText(key,params={}){
  if(!labelsReady){
   for(const [code,values] of ['en','de','es','fr'].map(code=>[code,labels[code]]))
    root.TPText.registerLocale(code,Object.fromEntries(
     labelKeys.map((name,index)=>['articunoGame.'+name,values[index]])
    ));
   labelsReady=true;
  }
  return root.TPText.t('articunoGame.'+key,params);
 }
 const DURATION=10000,GOAL=10,GAP=550,FALL=1800;
 function createRound(random=Math.random){
  if(typeof random!=='function')throw Error('INVALID_GAME_RANDOM');
  function randomPosition(){
   const value=random();
   if(!Number.isFinite(value)||value<0||value>=1)
    throw Error('INVALID_GAME_RANDOM');
   return value;
  }
  let phase='idle',hits=0,start=0,last=-1,next=0,serial=0;
  let targets=new Map();
  function time(now){
   if(!Number.isFinite(now)||now<0||now<last)
    throw Error('INVALID_GAME_CLOCK');
   last=now;return now;
  }
  function view(){
   const elapsed=phase==='idle'?0:
    Math.min(DURATION,Math.max(0,last-start));
   return Object.freeze({
    phase,hits,remaining:DURATION-elapsed,
    targets:Object.freeze(Array.from(targets.values(),target=>Object.freeze({
     id:target.id,x:target.x,
     progress:Math.max(0,(last-target.born)/FALL)
    })))
   });
  }
  function tick(now){
   time(now);
   if(phase!=='running')return view();
   if(now-start>=DURATION){
    phase='failed';targets.clear();return view();
   }
   while(next<=now){
    const id=++serial;
    if(now-next<FALL)
     targets.set(id,{id,born:next,x:randomPosition()});
    next+=GAP;
   }
   for(const [id,target] of targets)
    if(now-target.born>=FALL)targets.delete(id);
   return view();
  }
  return Object.freeze({
   view,tick,
   start(now){
    time(now);
    if(phase==='running'||phase==='complete')return false;
    phase='running';hits=0;start=now;next=now;
    targets.clear();tick(now);return true;
   },
   hit(id,now){
    tick(now);
    if(phase!=='running'||!targets.delete(id))return false;
    if(++hits===GOAL){phase='complete';targets.clear();}
    return true;
   },
   cancel(){
    if(phase==='running'){
     phase='idle';hits=0;targets.clear();
    }
   }
  });
 }
 function create({text=gameText,available,complete}){
  const doc=root.document;
  const round=createRound(),nodes=new Map();
  let disposed=false,pending=false,locked=false,frame=0,note='';
  if(!doc.getElementById('tp-ice-game-style')){
   const style=doc.createElement('style');
   style.id='tp-ice-game-style';
   style.textContent=`
   .tp-ice-game{
    display:flex;flex-direction:column;gap:8px;min-height:0
   }
   .tp-ice-game-row{
    display:flex;justify-content:space-between;font-size:13px
   }
   .tp-ice-game-field{
    position:relative;height:220px;min-height:180px;
    overflow:hidden;touch-action:none;border:1px solid #a7d8ed;
    background:radial-gradient(ellipse at 50% 90%,#a1d9e0,#274b67 65%,#132b43)
   }
   .tp-ice-game-field .tp-icicle{
    position:absolute;top:0;width:48px!important;
    height:64px!important;min-height:64px!important;
    margin:0!important;padding:0!important;border:0!important;
    border-radius:0!important;box-shadow:none!important;
    background:transparent!important;touch-action:none
   }
   .tp-icicle::before{
    content:'';position:absolute;inset:0 7px;
    background:linear-gradient(100deg,#81bcd9,#fff 45%,#8bcbdc 60%,#c6f8ff);
    clip-path:polygon(8% 0,88% 0,68% 50%,48% 100%,25% 55%)
   }
   .tp-icicle:focus-visible{
    outline:2px solid #ffe784!important
   }
   .tp-ice-game-feedback{
    margin:0;font-size:13px;line-height:1.4
   }
   `;
   doc.head.appendChild(style);
  }
  const element=doc.createElement('div');
  element.className='tp-ice-game';
  const row=doc.createElement('div');
  row.className='tp-ice-game-row';
  const progress=doc.createElement('span');
  const clock=doc.createElement('span');
  clock.setAttribute('role','timer');
  clock.setAttribute('aria-live','off');
  row.append(progress,clock);
  const field=doc.createElement('div');
  field.className='tp-ice-game-field';
  field.setAttribute('role','group');
  field.setAttribute('aria-label',text('area'));
  const feedback=doc.createElement('p');
  feedback.className='tp-ice-game-feedback';
  feedback.setAttribute('role','status');
  const button=doc.createElement('button');
  button.type='button';
  element.append(row,field,feedback,button);

  function stop(){
   if(frame)root.cancelAnimationFrame(frame);
   frame=0;
  }
  function usable(){
   return !disposed&&!pending&&!locked&&
    doc.visibilityState==='visible'&&available();
  }
  function paint(){
   if(disposed)return;
   const state=round.view();
   progress.textContent=state.hits+' / 10';
   clock.textContent=state.phase==='complete'?text('complete'):
    text('time',{
     seconds:(Math.ceil(state.remaining/100)/10).toFixed(1)
    });
   const active=new Set(state.targets.map(target=>target.id));
   for(const [id,node] of nodes){
    if(!active.has(id)){node.remove();nodes.delete(id);}
   }
   for(const target of state.targets){
    let node=nodes.get(target.id);
    if(!node){
     node=doc.createElement('button');
     node.type='button';node.className='tp-icicle';
     node.dataset.icicle=String(target.id);
     node.setAttribute('aria-label',text('target'));
     const hit=()=>{
      if(!usable())return;
      round.hit(target.id,root.performance.now());paint();
      if(round.view().phase==='complete'){
       stop();void submit();
      }
     };
     node.addEventListener('pointerdown',event=>{
      if(!event.isPrimary||event.button!==0)return;
      event.preventDefault();hit();
     });
     node.addEventListener('click',event=>{
      if(event.detail===0)hit();
     });
     nodes.set(target.id,node);field.appendChild(node);
    }
    node.style.left=
     `calc(${target.x} * (100% - 56px) + 4px)`;
    node.style.transform=
     `translateY(${target.progress*(field.clientHeight+64)-64}px)`;
   }
   feedback.textContent=note||
    (state.phase==='failed'?text('failed'):'');
   feedback.hidden=!feedback.textContent;
   button.textContent=text(
    state.phase==='complete'?'retrySave':
    state.phase==='failed'?'again':'start'
   );
   button.disabled=!usable()||state.phase==='running';
   button.hidden=state.phase==='running';
  }
  async function submit(){
   if(!usable()||round.view().phase!=='complete')return;
   pending=true;note='';paint();
   try{
    if(await complete()===false)note=text('saveFailed');
   }catch(error){
    note=text('saveFailed');
    try{root.TPDiagnostics?.record('write',error);}catch(_){}
   }finally{
    pending=false;paint();
   }
  }
  function tick(){
   frame=0;
   if(disposed)return;
   if(!element.isConnected||!usable()){
    round.cancel();paint();return;
   }
   round.tick(root.performance.now());paint();
   if(round.view().phase==='running')
    frame=root.requestAnimationFrame(tick);
  }
  function startAttempt(){
   if(!usable()||round.view().phase==='complete')return false;
   note='';
   if(!round.start(root.performance.now()))return false;
   paint();stop();frame=root.requestAnimationFrame(tick);
   return true;
  }
  button.addEventListener('click',()=>{
   if(!usable())return;
   if(round.view().phase==='complete'){
    void submit();return;
   }
   startAttempt();
  });

  function visibility(){
   if(doc.visibilityState!=='visible'){
    stop();round.cancel();
   }
   paint();
  }
  doc.addEventListener('visibilitychange',visibility);
  return Object.freeze({
   start:startAttempt,
   attach(host,disabled){
    if(disposed)throw Error('Disposed ice challenge');
    locked=!!disabled;host.append(element);paint();
   },
   dispose(){
    if(disposed)return;
    disposed=true;stop();
    doc.removeEventListener('visibilitychange',visibility);
   },
   get solved(){return round.view().phase==='complete';}
  });
 }
 return Object.freeze({create,createRound,text:gameText});
});
