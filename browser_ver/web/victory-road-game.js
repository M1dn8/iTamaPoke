/* Transient Lavados puzzle. Progress is committed only by the shared callback. */
(function(root,factory){
 'use strict';
 const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPVictoryRoadGame=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
 'use strict';
 const labels={
  en:{start:'Start minigame',reset:'Reset puzzle',area:'Victory Road rock puzzle',
   instructions:'Select a rock, then tap an adjacent free tile. Move all three rocks onto the floor plates.',
   progress:'Floor plates: {count}/{total}',rock:'Rock',goal:'Floor plate',floor:'Free tile',
   selected:'Selected',blocked:'Select a rock and an adjacent free tile.',complete:'Passage cleared!',
   retrySave:'Try saving again',saveFailed:'Save failed. Your solved puzzle is retained.',saving:'Saving…'},
  de:{start:'Minispiel starten',reset:'Rätsel zurücksetzen',area:'Felsenschieber der Siegesstraße',
   instructions:'Wähle einen Felsen und danach ein freies Nachbarfeld. Bewege alle drei Felsen auf die Bodenplatten.',
   progress:'Bodenplatten: {count}/{total}',rock:'Felsen',goal:'Bodenplatte',floor:'Freies Feld',
   selected:'Ausgewählt',blocked:'Wähle einen Felsen und ein freies Nachbarfeld.',complete:'Durchgang freigelegt!',
   retrySave:'Speichern erneut versuchen',saveFailed:'Speichern fehlgeschlagen. Dein gelöstes Rätsel bleibt erhalten.',saving:'Wird gespeichert…'},
  es:{start:'Iniciar minijuego',reset:'Reiniciar puzle',area:'Puzle de rocas de la Calle Victoria',
   instructions:'Selecciona una roca y luego una casilla libre adyacente. Lleva las tres rocas a las placas del suelo.',
   progress:'Placas: {count}/{total}',rock:'Roca',goal:'Placa del suelo',floor:'Casilla libre',
   selected:'Seleccionada',blocked:'Selecciona una roca y una casilla libre adyacente.',complete:'¡Paso despejado!',
   retrySave:'Volver a guardar',saveFailed:'No se pudo guardar. El puzle resuelto se conserva.',saving:'Guardando…'},
  fr:{start:'Démarrer le mini-jeu',reset:'Réinitialiser',area:'Énigme des rochers de la Route Victoire',
   instructions:'Choisis un rocher, puis une case libre voisine. Place les trois rochers sur les dalles.',
   progress:'Dalles : {count}/{total}',rock:'Rocher',goal:'Dalle',floor:'Case libre',
   selected:'Sélectionné',blocked:'Choisis un rocher et une case libre voisine.',complete:'Passage dégagé !',
   retrySave:'Réessayer la sauvegarde',saveFailed:'Échec de la sauvegarde. Ton énigme résolue est conservée.',saving:'Enregistrement…'}
 };
 let labelsReady=false;
 function gameText(key,params={}){
  if(!labelsReady){
   for(const code of ['en','de','es','fr'])
    root.TPText.registerLocale(code,Object.fromEntries(
     Object.entries(labels[code]).map(([name,value])=>['moltresGame.'+name,value])
    ));
   labelsReady=true;
  }
  return root.TPText.t('moltresGame.'+key,params);
 }
 const MAP=Object.freeze(['GGG##','##.##','...##','.#.##','OOO##']);
 const CELLS=MAP.join('');
 const floors=Object.freeze(Array.from(CELLS,(c,i)=>c!=='#'?i:-1).filter(i=>i>=0));
 const goals=Object.freeze(Array.from(CELLS,(c,i)=>c==='G'?i:-1).filter(i=>i>=0));
 const initial=Object.freeze(Array.from(CELLS,(c,i)=>c==='O'?i:-1).filter(i=>i>=0));

 function createRound(){
  let phase='idle',rocks=[...initial],selected=null,moves=0;
  function view(){
   return Object.freeze({
    phase,width:5,floors,goals,
    rocks:Object.freeze([...rocks]),selected,moves,
    placed:goals.filter(i=>rocks.includes(i)).length
   });
  }
  function restore(){rocks=[...initial];selected=null;moves=0;}
  return Object.freeze({
   view,
   start(){
    if(phase!=='idle')return false;
    restore();phase='running';return true;
   },
   select(index){
    if(phase!=='running'||!Number.isInteger(index)||!rocks.includes(index))
     return false;
    selected=index;return true;
   },
   move(index){
    if(phase!=='running'||selected===null||!Number.isInteger(index)||
       !floors.includes(index)||rocks.includes(index)||
       Math.abs(index%5-selected%5)+
       Math.abs(Math.floor(index/5)-Math.floor(selected/5))!==1)
     return false;
    rocks=rocks.map(i=>i===selected?index:i);
    selected=index;moves++;
    if(goals.every(i=>rocks.includes(i))){
     phase='complete';selected=null;
    }
    return true;
   },
   reset(){
    if(phase!=='running')return false;
    restore();return true;
   },
   cancel(){
    if(phase==='running'){restore();phase='idle';}
   }
  });
 }

 function create({text=gameText,available,complete}={}){
  const doc=root.document;
  if(!doc||typeof available!=='function'||typeof complete!=='function')
   throw Error('INVALID_VICTORY_GAME_CONTEXT');

  const round=createRound();
  let disposed=false,pending=false,locked=false,accepted=false,note='';

  if(!doc.getElementById('tp-victory-game-style')){
   const style=doc.createElement('style');
   style.id='tp-victory-game-style';
   style.textContent=`
    .tp-victory-game{
     display:flex;flex-direction:column;gap:6px;min-height:0;width:100%
    }
    .tp-victory-game p{
     font-size:12px;line-height:1.35;margin:0
    }
    .tp-victory-grid{
     display:grid;
     grid-template-columns:repeat(5,minmax(0,1fr));
     grid-template-rows:repeat(5,minmax(0,1fr));
     gap:2px;align-self:center;width:min(100%,240px);
     aspect-ratio:1;background:#30241d;padding:4px;box-sizing:border-box
    }
    .tp-victory-game .tp-victory-cell{
     position:relative;box-sizing:border-box;
     width:100%!important;height:100%!important;
     min-width:0!important;min-height:0!important;
     margin:0!important;padding:0!important;
     border:1px solid #927451!important;border-radius:3px!important;
     background:#c1a16d!important;box-shadow:none!important;
     touch-action:manipulation
    }
    .tp-victory-game .tp-victory-wall{
     background:linear-gradient(145deg,#615345,#332b25)!important;
     border-color:#30241d!important
    }
    .tp-victory-cell[data-goal="true"]::after{
     content:'';position:absolute;inset:20%;
     border:3px solid #624a23;border-radius:50%;box-sizing:border-box
    }
    .tp-victory-cell[data-rock="true"]::before{
     content:'';position:absolute;inset:7%;
     background:linear-gradient(135deg,#aaa08d,#6c665b 55%,#45413c);
     clip-path:polygon(20% 0,75% 4%,100% 35%,88% 85%,48% 100%,5% 77%,0 27%)
    }
    .tp-victory-cell[data-rock="true"][data-goal="true"]::after{
     inset:28%;border-color:#fce28c
    }
    .tp-victory-cell[aria-pressed="true"]{
     outline:3px solid #ffcf57!important;outline-offset:-3px
    }
    .tp-victory-cell:focus-visible{
     outline:3px solid #fff!important;outline-offset:-3px
    }
    .tp-victory-cell:disabled{opacity:1!important}
    .tp-victory-controls{display:flex;gap:6px}
    .tp-victory-controls>button{
     flex:1;min-height:44px!important;font-size:12px
    }
   `;
   doc.head.appendChild(style);
  }

  const make=(tag,className)=>{
   const n=doc.createElement(tag);n.className=className;return n;
  };
  const element=make('div','tp-victory-game');
  const instructions=make('p','tp-victory-instructions');
  instructions.textContent=text('instructions');
  instructions.id='tp-victory-instructions';
  const progress=make('p','tp-victory-progress');
  progress.setAttribute('aria-live','polite');
  const field=make('div','tp-victory-grid');
  field.setAttribute('role','group');
  field.setAttribute('aria-label',text('area'));
  field.setAttribute('aria-describedby','tp-victory-instructions');
  const feedback=make('p','tp-victory-feedback');
  feedback.setAttribute('role','status');
  const controls=make('div','tp-victory-controls');
  const startButton=make('button','tp-victory-start');
  startButton.type='button';startButton.dataset.action='start';
  const resetButton=make('button','tp-victory-reset');
  resetButton.type='button';resetButton.dataset.action='reset';
  controls.append(startButton,resetButton);
  element.append(instructions,progress,field,feedback,controls);

  const cells=[];
  function usable(){
   return !disposed&&!pending&&!locked&&!accepted&&element.isConnected&&
    doc.visibilityState==='visible'&&available();
  }

  for(let index=0;index<25;index++){
   const floor=floors.includes(index);
   const cell=make(
    floor?'button':'div',
    'tp-victory-cell'+(floor?'':' tp-victory-wall')
   );
   cell.dataset.cell=String(index);
   if(floor){
    cell.type='button';
    cell.addEventListener('click',()=>{
     if(!usable()||round.view().phase!=='running')return;
     const state=round.view();
     const ok=state.rocks.includes(index)?
      round.select(index):round.move(index);
     note=ok?'':text('blocked');
     paint();
     if(round.view().phase==='complete')void submit();
    });
   }else cell.setAttribute('aria-hidden','true');
   cells.push(cell);field.appendChild(cell);
  }

  function paint(){
   if(disposed)return;
   const state=round.view(),enabled=usable();
   progress.textContent=text('progress',{
    count:state.placed,total:goals.length
   });
   element.setAttribute('aria-busy',String(pending));
   for(const [index,cell] of cells.entries()){
    if(!floors.includes(index))continue;
    const rock=state.rocks.includes(index),goal=goals.includes(index);
    cell.dataset.rock=String(rock);
    cell.dataset.goal=String(goal);
    cell.setAttribute('aria-pressed',String(state.selected===index));
    cell.setAttribute('aria-label',
     text(rock?'rock':goal?'goal':'floor')+' '+
     (Math.floor(index/5)+1)+','+(index%5+1)+
     (rock&&goal?' · '+text('goal'):'')+
     (state.selected===index?' · '+text('selected'):''));
    cell.disabled=!enabled||state.phase!=='running';
   }
   feedback.textContent=pending?text('saving'):
    note||(state.phase==='complete'?text('complete'):'');
   feedback.hidden=!feedback.textContent;
   startButton.textContent=text(
    state.phase==='complete'?(accepted?'complete':'retrySave'):'start'
   );
   startButton.disabled=!enabled;
   startButton.hidden=state.phase==='running'||accepted;
   resetButton.textContent=text('reset');
   resetButton.disabled=!enabled||state.phase!=='running';
   resetButton.hidden=state.phase!=='running';
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

  startButton.addEventListener('click',()=>{
   if(!usable())return;
   if(round.view().phase==='complete')void submit();
   else start();
  });
  resetButton.addEventListener('click',()=>{
   if(!usable()||!round.reset())return;
   note='';paint();
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
    if(disposed)throw Error('DISPOSED_VICTORY_GAME');
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
