/* Transient clearing challenge. No native, save or energy authority. */
(function(root,factory){
 'use strict';
 const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPMewHideGame=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
 'use strict';
 const labels={
  en:{start:'Start minigame',area:'Hidden clearing',
   instructions:'Look for pink traces and tap the matching hiding place.',
   progress:'Discoveries: {count}/{total}',bush:'Bush',tree:'Tree',rock:'Rock',
   wrong:'Look again. There is no pink trace here.',found:'Found!',
   complete:'Hide-and-seek completed!',retrySave:'Try saving again',
   saveFailed:'Save failed. Your completed game is retained.',saving:'Saving…',
   hintTail:'A pink tail tip is visible.',hintEars:'Pink ears are visible.',
   hintShadow:'A pink silhouette is visible.'},
  de:{start:'Minispiel starten',area:'Versteckte Lichtung',
   instructions:'Suche die rosa Spuren und tippe auf das passende Versteck.',
   progress:'Entdeckungen: {count}/{total}',bush:'Busch',tree:'Baum',rock:'Felsen',
   wrong:'Schau noch einmal hin. Hier ist keine rosa Spur.',found:'Gefunden!',
   complete:'Versteckspiel geschafft!',retrySave:'Speichern erneut versuchen',
   saveFailed:'Speichern fehlgeschlagen. Dein gelöstes Versteckspiel bleibt erhalten.',
   saving:'Wird gespeichert…',
   hintTail:'Eine rosa Schwanzspitze ist zu sehen.',hintEars:'Rosa Ohren sind zu sehen.',
   hintShadow:'Eine rosa Silhouette ist zu sehen.'},
  es:{start:'Iniciar minijuego',area:'Claro oculto',
   instructions:'Busca las pistas rosas y toca el escondite correcto.',
   progress:'Hallazgos: {count}/{total}',bush:'Arbusto',tree:'Árbol',rock:'Roca',
   wrong:'Mira otra vez. Aquí no hay ninguna pista rosa.',found:'¡Encontrado!',
   complete:'¡Juego del escondite completado!',retrySave:'Volver a guardar',
   saveFailed:'No se pudo guardar. Se conserva el juego completado.',saving:'Guardando…',
   hintTail:'Se ve la punta de una cola rosa.',hintEars:'Se ven unas orejas rosas.',
   hintShadow:'Se ve una silueta rosa.'},
  fr:{start:'Démarrer le mini-jeu',area:'Clairière cachée',
   instructions:'Cherche les indices roses et touche la bonne cachette.',
   progress:'Découvertes : {count}/{total}',bush:'Buisson',tree:'Arbre',rock:'Rocher',
   wrong:'Regarde encore. Il n’y a pas d’indice rose ici.',found:'Trouvé !',
   complete:'Cache-cache terminé !',retrySave:'Réessayer la sauvegarde',
   saveFailed:'Échec de la sauvegarde. Ton jeu terminé est conservé.',
   saving:'Enregistrement…',
   hintTail:'Le bout d’une queue rose est visible.',hintEars:'Des oreilles roses sont visibles.',
   hintShadow:'Une silhouette rose est visible.'}
 };
 let registered=false;
 function gameText(key,params={}){
  if(!registered){
   for(const code of ['en','de','es','fr'])
    root.TPText.registerLocale(code,Object.fromEntries(
     Object.entries(labels[code]).map(([k,v])=>['mewGame.'+k,v])
    ));
   registered=true;
  }
  return root.TPText.t('mewGame.'+key,params);
 }

 const places=Object.freeze(['bush','tree','rock']);
 const hints=Object.freeze(['tail','ears','shadow']);

 function createRound(random=Math.random){
  if(typeof random!=='function')throw Error('INVALID_MEW_RANDOM');
  let phase='idle',hits=0,hidden=-1,hint=0,revision=0,feedback='';

  function pick(exclude=-1){
   const value=random();
   if(!Number.isFinite(value)||value<0||value>=1)
    throw Error('INVALID_MEW_RANDOM');
   const options=[0,1,2].filter(index=>index!==exclude);
   return options[Math.floor(value*options.length)];
  }
  function view(){
   return Object.freeze({
    phase,hits,goal:3,hidden,
    hint:hints[hint],revision,feedback,places
   });
  }
  return Object.freeze({
   view,
   start(){
    if(phase!=='idle')return false;
    const next=pick();
    phase='running';hits=0;hidden=next;
    hint=0;revision++;feedback='';
    return true;
   },
   choose(index,token){
    if(phase!=='running'||!Number.isInteger(index)||
       index<0||index>2||token!==revision)
     return Object.freeze({accepted:false,found:false});
    const found=index===hidden;
    const next=found&&hits<2?pick(hidden):hidden;
    if(found){
     hits++;hidden=next;hint=0;feedback='found';
     if(hits===3){phase='complete';hidden=-1;}
    }else{
     hint=(hint+1)%hints.length;feedback='wrong';
    }
    revision++;
    return Object.freeze({accepted:true,found});
   },
   cancel(){
    if(phase==='running'){
     phase='idle';hits=0;hidden=-1;hint=0;
     feedback='';revision++;
    }
   }
  });
 }

 function clue(kind){
  if(kind==='tail')
   return '<path d="M0 9Q17 13 17 0Q17-12 7-9Q0-7 6 1" fill="none" stroke="#efa6c9" stroke-width="4" stroke-linecap="round"/>';
  if(kind==='ears')
   return '<path d="M-9 8-8-7-1-1 6-8 11 8Z" fill="#efa6c9" stroke="#bd739b" stroke-width="1.5"/>';
  return '<path d="M-9 8Q-13-2-7-5L-8-11-1-7 5-11 7-4Q15 2 8 11Q2 16-5 11M8 8Q25 17 23 0" fill="#e9a0c7" stroke="#c581aa" stroke-width="2"/>';
 }

 function picture(index,hint){
  const back=index===0?
   '<path d="M8 78Q-4 57 17 50Q11 28 35 32Q48 17 62 33Q85 25 88 49Q109 62 90 80Z" fill="#527d44" stroke="#365e36" stroke-width="2"/><path d="M17 57Q34 39 47 49M53 40Q72 36 79 52M19 72Q36 57 47 65" fill="none" stroke="#80a15d" stroke-width="5"/>':
   index===1?
   '<path d="M40 47H61L67 86H33Z" fill="#907455" stroke="#5f5940" stroke-width="2"/><path d="M15 54Q3 37 23 25Q20 5 43 12Q61 0 73 18Q96 18 88 41Q99 59 75 65L27 65Z" fill="#5f874d" stroke="#3f673d" stroke-width="2"/><path d="M25 38Q38 22 53 31M61 22Q78 30 77 42" fill="none" stroke="#89a76a" stroke-width="6"/>':
   '<path d="M13 80 12 56 32 37 60 33 83 47 91 78 67 88 34 87Z" fill="#8c9381" stroke="#5c6f5b" stroke-width="2"/><path d="M12 56 32 37 60 33 49 58 26 66Z" fill="#b0b59d"/><path d="M49 58 60 33 83 47 91 78 67 88Z" fill="#788574"/><path d="M31 46 42 42M65 69 77 74" stroke="#d1d0b5" stroke-width="2"/>';
  const position=index===0?'54 57':index===1?'61 73':'55 62';
  return '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+
   '<path fill="#d0dfac" d="M0 0H100V100H0Z"/>'+
   '<ellipse cx="50" cy="86" rx="43" ry="8" fill="#9eb783"/>'+back+
   (hint?'<g class="tp-mew-hide-hint" transform="translate('+position+')">'+
    clue(hint)+'</g>':'')+'</svg>';
 }

 function create({
  text=gameText,available,complete,random=Math.random
 }={}){
  const doc=root.document;
  if(!doc||typeof available!=='function'||typeof complete!=='function')
   throw Error('INVALID_MEW_GAME_CONTEXT');

  const round=createRound(random);
  let disposed=false,pending=false,locked=false,accepted=false,note='';

  if(!doc.getElementById('tp-mew-hide-style')){
   const style=doc.createElement('style');
   style.id='tp-mew-hide-style';
   style.textContent=`
    .tp-mew-hide-game{
     --mew-reserve:120px;container-type:size;
     display:flex;flex-direction:column;align-items:center;gap:6px;
     flex:1 1 0;width:100%;height:100%;min-height:0;overflow:hidden
    }
    .tp-mew-hide-game[data-phase="running"]{--mew-reserve:76px}
    .tp-mew-hide-game p{
     flex:0 0 auto;margin:0;font-size:12px;line-height:1.25;text-align:center
    }
    .tp-mew-hide-game[data-phase="complete"]>.tp-mew-hide-instructions{
     display:none
    }
    .tp-mew-hide-choices{
     display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
     flex:0 0 auto;gap:6px;width:min(100%,330px);height:110px;
     height:min(136px,calc(100cqh - var(--mew-reserve)));min-height:60px
    }
    .tp-mew-hide-game .tp-mew-hide-card{
     position:relative;overflow:hidden;box-sizing:border-box;
     min-width:0!important;min-height:0!important;width:100%;height:100%;
     margin:0!important;padding:0!important;
     border:1px solid #6e8d5b!important;border-radius:8px!important;
     background:#d0dfac!important;touch-action:manipulation
    }
    .tp-mew-hide-card svg{display:block;width:100%;height:100%}
    .tp-mew-hide-card>span{
     position:absolute;bottom:2px;left:2px;right:2px;
     background:#eaf0d5e8;font-size:11px;line-height:1.2;
     border-radius:3px;color:#294332
    }
    .tp-mew-hide-card:focus-visible{
     outline:3px solid #f7d56d!important;outline-offset:-4px
    }
    .tp-mew-hide-card:disabled{opacity:1!important}
    .tp-mew-hide-hint{
     animation:tp-mew-hide-peek 3.6s ease-in-out infinite
    }
    @keyframes tp-mew-hide-peek{
     0%,100%{opacity:.45}35%,70%{opacity:1}
    }
    @media(prefers-reduced-motion:reduce){
     .tp-mew-hide-hint{animation:none!important;opacity:1}
    }
    .tp-mew-hide-game .tp-mew-hide-action{
     flex:0 0 auto;width:min(100%,260px);min-height:44px
    }
   `;
   doc.head.appendChild(style);
  }

  const make=(tag,cls)=>{
   const n=doc.createElement(tag);n.className=cls;return n;
  };
  const element=make('div','tp-mew-hide-game');
  const instructions=make('p','tp-mew-hide-instructions');
  instructions.textContent=text('instructions');
  const progress=make('p','tp-mew-hide-progress');
  progress.setAttribute('aria-live','polite');
  const choices=make('div','tp-mew-hide-choices');
  choices.setAttribute('role','group');
  choices.setAttribute('aria-label',text('area'));
  const feedback=make('p','tp-mew-hide-feedback');
  feedback.setAttribute('role','status');
  const action=make('button','tp-mew-hide-action');
  action.type='button';
  element.append(instructions,progress,choices,feedback,action);

  function usable(){
   return !disposed&&!pending&&!locked&&!accepted&&element.isConnected&&
    doc.visibilityState==='visible'&&available();
  }
  function paint(){
   if(disposed)return;
   const state=round.view(),enabled=usable();
   const active=doc.activeElement;
   const restore=Array.from(choices.children).includes(active)?
    active.dataset.place:null;

   element.dataset.phase=state.phase;
   element.dataset.hits=String(state.hits);
   element.setAttribute('aria-busy',String(pending));
   progress.textContent=text('progress',{
    count:state.hits,total:state.goal
   });
   choices.replaceChildren();

   for(let index=0;index<3;index++){
    const button=make('button','tp-mew-hide-card');
    button.type='button';
    const shown=state.phase==='running'&&index===state.hidden;
    button.dataset.place=String(index);
    button.dataset.hint=shown?state.hint:'';
    button.dataset.revision=String(state.revision);
    button.setAttribute('aria-label',text(places[index]));
    button.setAttribute('aria-description',shown?text(
     state.hint==='tail'?'hintTail':
     state.hint==='ears'?'hintEars':'hintShadow'
    ):'');
    button.innerHTML=picture(index,shown?state.hint:null);
    const label=doc.createElement('span');
    label.textContent=text(places[index]);
    button.appendChild(label);
    button.disabled=!enabled||state.phase!=='running';

    button.addEventListener('keydown',event=>{
     if(event.repeat&&['Enter',' '].includes(event.key))
      event.preventDefault();
    });
    button.addEventListener('click',()=>{
     if(!usable()||!button.isConnected)return;
     const result=round.choose(index,state.revision);
     if(!result.accepted)return;
     note='';paint();
     if(round.view().phase==='complete')void submit();
    });
    choices.appendChild(button);
   }

   if(restore!==null&&state.phase==='running')
    Array.from(choices.children)
     .find(b=>b.dataset.place===restore)?.focus?.();

   const message=state.phase==='complete'?'complete':state.feedback;
   feedback.textContent=pending?text('saving'):
    note||(message?text(message):'');
   feedback.hidden=!feedback.textContent;
   action.textContent=text(
    state.phase==='complete'?'retrySave':'start'
   );
   action.disabled=!enabled;
   action.hidden=state.phase==='running'||accepted;
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
  function start(){
   if(!usable()||!round.start())return false;
   note='';paint();return true;
  }
  action.addEventListener('click',()=>{
   if(!usable())return;
   if(round.view().phase==='complete')void submit();
   else start();
  });
  function visibility(){
   if(doc.visibilityState!=='visible'){
    round.cancel();note='';
   }
   paint();
  }
  doc.addEventListener('visibilitychange',visibility);

  return Object.freeze({
   start,
   attach(host,disabled=false){
    if(disposed)throw Error('DISPOSED_MEW_GAME');
    locked=!!disabled;host.append(element);paint();
   },
   dispose(){
    if(disposed)return;
    disposed=true;round.cancel();
    doc.removeEventListener('visibilitychange',visibility);
    element.remove();
   },
   get solved(){return round.view().phase==='complete';}
  });
 }
 return Object.freeze({create,createRound,text:gameText});
});
