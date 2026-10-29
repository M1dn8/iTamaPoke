/* Transient Mewtu timing challenge; no independent save or energy authority. */
(function(root,factory){
 'use strict';
 const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPPsiBarrierGame=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
 'use strict';
 const labels={
  en:{start:'Start minigame',area:'Psi barrier',tap:'Send an impulse',
   instructions:'Tap when the shrinking ring crosses the bright band.',
   progress:'Impulses: {count}/{total}',early:'Too early. Wait for the next ring.',
   late:'Too late. Wait for the next ring.',hit:'Impulse successful!',wait:'Wait for the next ring.',
   complete:'Barrier dissolved!',retrySave:'Try saving again',
   saveFailed:'Save failed. Your successful impulses are retained.',saving:'Saving…'},
  de:{start:'Minispiel starten',area:'Psi-Barriere',tap:'Impuls auslösen',
   instructions:'Tippe, wenn der schrumpfende Ring den hellen Zielbereich erreicht.',
   progress:'Impulse: {count}/{total}',early:'Zu früh. Warte auf den nächsten Ring.',
   late:'Zu spät. Warte auf den nächsten Ring.',hit:'Impuls erfolgreich!',wait:'Warte auf den nächsten Ring.',
   complete:'Barriere aufgelöst!',retrySave:'Speichern erneut versuchen',
   saveFailed:'Speichern fehlgeschlagen. Deine erfolgreichen Impulse bleiben erhalten.',saving:'Wird gespeichert…'},
  es:{start:'Iniciar minijuego',area:'Barrera psíquica',tap:'Enviar un impulso',
   instructions:'Toca cuando el anillo que se encoge alcance la banda luminosa.',
   progress:'Impulsos: {count}/{total}',early:'Demasiado pronto. Espera al siguiente anillo.',
   late:'Demasiado tarde. Espera al siguiente anillo.',hit:'¡Impulso logrado!',wait:'Espera al siguiente anillo.',
   complete:'¡Barrera disuelta!',retrySave:'Volver a guardar',
   saveFailed:'No se pudo guardar. Se conservan tus impulsos logrados.',saving:'Guardando…'},
  fr:{start:'Démarrer le mini-jeu',area:'Barrière psychique',tap:'Envoyer une impulsion',
   instructions:'Touche quand le cercle qui rétrécit atteint la bande lumineuse.',
   progress:'Impulsions : {count}/{total}',early:'Trop tôt. Attends le cercle suivant.',
   late:'Trop tard. Attends le cercle suivant.',hit:'Impulsion réussie !',wait:'Attends le cercle suivant.',
   complete:'Barrière dissipée !',retrySave:'Réessayer la sauvegarde',
   saveFailed:'Échec de la sauvegarde. Tes impulsions réussies sont conservées.',saving:'Enregistrement…'}
 };
 let labelsReady=false;
 function gameText(key,params={}){
  if(!labelsReady){
   for(const code of ['en','de','es','fr'])
    root.TPText.registerLocale(code,Object.fromEntries(
     Object.entries(labels[code]).map(([k,v])=>['mewtwoGame.'+k,v])
    ));
   labelsReady=true;
  }
  return root.TPText.t('mewtwoGame.'+key,params);
 }

 const CYCLE=2400,OUTER=80,INNER=20,TARGET=44,BAND=8,GOAL=3;

 function createRound(){
  let phase='idle',hits=0,started=0,last=-1,used=-1,outcome='';
  function view(){
   const elapsed=phase==='idle'?0:Math.max(0,last-started);
   const cycle=Math.floor(elapsed/CYCLE);
   const radius=phase==='complete'?TARGET:
    OUTER-(OUTER-INNER)*(elapsed%CYCLE)/CYCLE;
   return Object.freeze({
    phase,hits,goal:GOAL,cycle,radius,target:TARGET,band:BAND,
    canPress:phase==='running'&&used!==cycle,
    feedback:used===cycle?outcome:'',
    inTarget:radius>=TARGET-BAND&&radius<=TARGET+BAND
   });
  }
  function tick(now){
   if(!Number.isFinite(now)||now<0||now<last)
    throw Error('INVALID_PSI_CLOCK');
   last=now;return view();
  }
  return Object.freeze({
   view,tick,
   start(now){
    if(phase!=='idle')return false;
    tick(now);
    phase='running';hits=0;started=now;used=-1;outcome='';
    return true;
   },
   press(now){
    const state=tick(now);
    if(!state.canPress)
     return Object.freeze({accepted:false,hit:false});
    used=state.cycle;
    const hit=state.inTarget;
    outcome=hit?'hit':state.radius>TARGET+BAND?'early':'late';
    if(hit&&++hits===GOAL)phase='complete';
    return Object.freeze({accepted:true,hit});
   },
   cancel(){
    if(phase==='running'){
     phase='idle';hits=0;used=-1;outcome='';
    }
   }
  });
 }

 function create({text=gameText,available,complete}={}){
  const doc=root.document;
  if(!doc||typeof available!=='function'||typeof complete!=='function')
   throw Error('INVALID_PSI_CONTEXT');

  const round=createRound();
  let disposed=false,pending=false,locked=false,accepted=false,frame=0,note='';
  let pointer=null,keyHeld=null;
  const now=()=>root.performance.now();
  const make=(tag,cls)=>{
   const n=doc.createElement(tag);n.className=cls;return n;
  };

  if(!doc.getElementById('tp-psi-game-style')){
   const style=doc.createElement('style');
   style.id='tp-psi-game-style';
   style.textContent=`
    .tp-psi-game{
     --psi-reserve:124px;container-type:size;
     display:flex;flex-direction:column;align-items:center;gap:6px;
     flex:1 1 0;width:100%;height:100%;min-height:0;overflow:hidden
    }
    .tp-psi-game[data-phase="running"]{--psi-reserve:80px}
    .tp-psi-game p{
     flex:0 0 auto;margin:0;text-align:center;
     font-size:12px;line-height:1.25
    }
    .tp-psi-game .tp-psi-field{
     position:relative;isolation:isolate;flex:0 0 auto;
     align-self:center;box-sizing:border-box;
     width:min(100%,220px)!important;
     width:min(220px,100cqw,calc(100cqh - var(--psi-reserve)))!important;
     height:auto!important;min-height:0!important;aspect-ratio:1;
     margin:0!important;padding:0!important;overflow:hidden;
     background:radial-gradient(circle,#655083,#292238 72%)!important;
     border:1px solid #a895c4!important;border-radius:10px!important;
     touch-action:manipulation
    }
    .tp-psi-field svg{display:block;width:100%;height:100%}
    .tp-psi-field::after{
     content:'';position:absolute;inset:8%;z-index:-1;
     border-radius:50%;box-shadow:0 0 22px #c9a2fa66;
     animation:tp-psi-ambient 4s ease-in-out infinite;
     pointer-events:none
    }
    .tp-psi-field:focus-visible{
     outline:3px solid #ffeb9c!important;outline-offset:-4px
    }
    .tp-psi-game .tp-psi-action{
     flex:0 0 auto;min-height:44px;width:min(100%,220px)
    }
    @keyframes tp-psi-ambient{
     0%,100%{opacity:.35}50%{opacity:.8}
    }
    @media(prefers-reduced-motion:reduce){
     .tp-psi-field::after{animation:none!important}
    }
   `;
   doc.head.appendChild(style);
  }

  const element=make('div','tp-psi-game');
  const instructions=make('p','tp-psi-instructions');
  instructions.textContent=text('instructions');
  const progress=make('p','tp-psi-progress');
  progress.setAttribute('aria-live','polite');
  const field=make('button','tp-psi-field');
  field.type='button';
  field.setAttribute('aria-label',text('tap'));

  const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 200 200');
  svg.setAttribute('aria-hidden','true');

  function circle(radius,stroke,width,extra={}){
   const c=doc.createElementNS('http://www.w3.org/2000/svg','circle');
   for(const [k,v] of Object.entries({
    cx:100,cy:100,r:radius,fill:'none',stroke,
    'stroke-width':width,...extra
   }))c.setAttribute(k,v);
   svg.appendChild(c);return c;
  }

  const segments=[];
  for(let i=0;i<3;i++)segments.push(circle(88,'#ba91e6',5,{
   'stroke-dasharray':'150 403',
   transform:'rotate('+(i*120-90)+' 100 100)'
  }));
  circle(TARGET,'#ead3ff',BAND*2,{opacity:.25});
  circle(TARGET-BAND,'#ead3ff',1,{opacity:.65});
  circle(TARGET+BAND,'#ead3ff',1,{opacity:.65});
  const ring=circle(OUTER,'#f6eeff',4);
  circle(7,'#f3d9ff',2,{fill:'#b790e6'});
  field.appendChild(svg);

  const feedback=make('p','tp-psi-feedback');
  feedback.setAttribute('role','status');
  const action=make('button','tp-psi-action');
  action.type='button';
  element.append(instructions,progress,field,feedback,action);

  function usable(){
   return !disposed&&!pending&&!locked&&!accepted&&element.isConnected&&
    doc.visibilityState==='visible'&&available();
  }
  function stop(){
   if(frame)root.cancelAnimationFrame(frame);
   frame=0;
  }
  function paint(){
   if(disposed)return;
   const state=round.view(),enabled=usable();
   element.dataset.phase=state.phase;
   element.dataset.hits=String(state.hits);
   element.setAttribute('aria-busy',String(pending));
   progress.textContent=text('progress',{count:state.hits,total:GOAL});
   ring.setAttribute('r',state.radius);
   ring.setAttribute('stroke',
    state.feedback==='hit'?'#b9f4db':'#f6eeff');
   ring.style.opacity=state.canPress?'1':'.45';
   segments.forEach((s,i)=>{
    s.style.opacity=i<state.hits?'.12':'1';
   });
   field.disabled=!enabled||state.phase!=='running';
   field.dataset.ready=String(state.canPress);
   const message=state.phase==='complete'?'complete':state.feedback;
   feedback.textContent=pending?text('saving'):
    note||(message?text(message):'');
   feedback.hidden=!feedback.textContent;
   action.textContent=text(
    state.phase==='complete'?'retrySave':'start'
   );
   action.hidden=state.phase==='running'||accepted;
   action.disabled=!enabled;
  }
  async function submit(){
   if(!usable()||round.view().phase!=='complete')return false;
   pending=true;note='';paint();
   try{
    const result=await complete();
    if(result===false)note=text('saveFailed');
    else accepted=true;
    return result!==false;
   }catch(error){
    note=text('saveFailed');
    try{root.TPDiagnostics?.record('write',error);}catch(_){}
    return false;
   }finally{
    pending=false;paint();
   }
  }
  function attempt(){
   if(!usable()||round.view().phase!=='running')return false;
   const result=round.press(now());
   if(!result.accepted)return false;
   note='';paint();
   if(round.view().phase==='complete'){
    stop();void submit();
   }
   return true;
  }
  function tick(){
   frame=0;
   if(disposed)return;
   if(!usable()){
    round.cancel();paint();return;
   }
   round.tick(now());paint();
   if(round.view().phase==='running')
    frame=root.requestAnimationFrame(tick);
  }
  function start(){
   if(!usable()||!round.start(now()))return false;
   note='';paint();stop();
   frame=root.requestAnimationFrame(tick);
   return true;
  }

  field.addEventListener('pointerdown',event=>{
   if(event.isPrimary!==true||event.button!==0||
      pointer!==null||keyHeld!==null||!usable())return;
   event.preventDefault();
   pointer=event.pointerId;
   field.setPointerCapture?.(event.pointerId);
   attempt();
  });
  function pointerEnd(event){
   if(pointer===event.pointerId)pointer=null;
  }
  function keyEnd(event){
   if(keyHeld===event.key)keyHeld=null;
  }
  field.addEventListener('keydown',event=>{
   if(![' ','Enter'].includes(event.key))return;
   event.preventDefault();
   if(event.repeat||keyHeld!==null||pointer!==null||!usable())return;
   keyHeld=event.key;attempt();
  });
  field.addEventListener('click',event=>{
   if(event.detail===0&&pointer===null&&keyHeld===null)attempt();
  });
  action.addEventListener('click',()=>{
   if(!usable())return;
   if(round.view().phase==='complete')void submit();
   else start();
  });

  function visibility(){
   if(doc.visibilityState!=='visible'){
    stop();pointer=null;keyHeld=null;
    round.cancel();note='';
   }
   paint();
  }
  doc.addEventListener('pointerup',pointerEnd);
  doc.addEventListener('pointercancel',pointerEnd);
  doc.addEventListener('keyup',keyEnd);
  doc.addEventListener('visibilitychange',visibility);

  return Object.freeze({
   start,
   attach(host,disabled=false){
    if(disposed)throw Error('DISPOSED_PSI_GAME');
    locked=!!disabled;host.append(element);paint();
   },
   dispose(){
    if(disposed)return;
    disposed=true;stop();round.cancel();
    doc.removeEventListener('pointerup',pointerEnd);
    doc.removeEventListener('pointercancel',pointerEnd);
    doc.removeEventListener('keyup',keyEnd);
    doc.removeEventListener('visibilitychange',visibility);
    element.remove();
   },
   get solved(){return round.view().phase==='complete';}
  });
 }
 return Object.freeze({create,createRound,text:gameText});
});
