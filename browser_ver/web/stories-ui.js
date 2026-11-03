/* P06 story catalogue and commit-confirmed unlock notice. */
(function(root){
 'use strict';
 const keys=[
  'unavailable','invalid','locked','new','open','waiting','done',
  'plant','hintTitle','hintText','read','view','saving','saveFailed'
 ];
 const messages={
  en:[
   'Please load the current game core.',
   'Story progress cannot be read. No changes were made.',
   'Requires four different Kanto badges ({count}/4).',
   'New','Open','Admission pending','Completed','Power Plant',
   'Pokédex · New story',
   'A new story is available in your Pokédex.',
   'Mark notice as read','View stories','Saving…',
   'Saving failed. The notice remains unread. Please try again.'
  ],
  de:[
   'Bitte den aktuellen Spielkern laden.',
   'Geschichtenfortschritt nicht lesbar. Es wurde nichts geändert.',
   'Freischaltung nach vier unterschiedlichen Kanto-Orden ({count}/4).',
   'Neu','Offen','Aufnahme wartet','Abgeschlossen','Kraftwerk',
   'Pokédex · Neue Geschichte',
   'In deinem Pokédex ist eine neue Geschichte verfügbar.',
   'Hinweis gelesen','Geschichten ansehen','Wird gespeichert…',
   'Speichern fehlgeschlagen. Der Hinweis bleibt ungelesen. Bitte erneut versuchen.'
  ],
  es:[
   'Carga el núcleo actual del juego.',
   'No se puede leer el progreso. No se ha cambiado nada.',
   'Requiere cuatro medallas diferentes de Kanto ({count}/4).',
   'Nuevo','Disponible','Incorporación pendiente','Completado','Central de Energía',
   'Pokédex · Nueva historia',
   'Hay una nueva historia disponible en tu Pokédex.',
   'Marcar aviso como leído','Ver historias','Guardando…',
   'No se pudo guardar. El aviso sigue sin leer. Inténtalo de nuevo.'
  ],
  fr:[
   'Chargez le moteur actuel du jeu.',
   'La progression est illisible. Aucune modification effectuée.',
   'Nécessite quatre badges différents de Kanto ({count}/4).',
   'Nouveau','Disponible','Admission en attente','Terminé','Centrale',
   'Pokédex · Nouvelle histoire',
   'Une nouvelle histoire est disponible dans votre Pokédex.',
   'Marquer comme lu','Voir les histoires','Enregistrement…',
   "Échec de l’enregistrement. L’avis reste non lu. Réessayez."
  ]
 };
 for(const code of ['en','de','es','fr'])
  root.TPText.registerLocale(code,Object.fromEntries(
   keys.map((key,index)=>['stories.'+key,messages[code][index]])
  ));
 const countText={
  en:'Open stories: {count}',
  de:'Offene Geschichten: {count}',
  es:'Historias abiertas: {count}',
  fr:'Histoires ouvertes : {count}'
 };
 for(const code of ['en','de','es','fr'])
  root.TPText.registerLocale(code,{'stories.openCount':countText[code]});
 const emptyText={
  en:'There is nothing to discover here yet. Come back later!',
  de:'Hier ist noch nichts zu entdecken. Komm später wieder!',
  es:'Todavía no hay nada que descubrir aquí. ¡Vuelve más tarde!',
  fr:"Il n’y a encore rien à découvrir ici. Reviens plus tard !"
 };
 for(const code of ['en','de','es','fr'])
  root.TPText.registerLocale(code,{'stories.empty':emptyText[code]});

 const noticeRetryText={
  en:"Saving failed. Tap to try again.",
  de:"Speichern fehlgeschlagen. Erneut tippen.",
  es:"No se guardó. Toca para reintentar.",
  fr:"Échec de sauvegarde. Réessaie."
 };
 for(const code of ["en","de","es","fr"])
  root.TPText.registerLocale(code,{"stories.saveFailedShort":noticeRetryText[code]});

 const journalText={
  en:['New journal entries: {count}',
   'The journal read status could not be saved. Reopen the journal to try again.',
   'Reload the application before making further changes.'],
  de:['Neue Tagebucheinträge: {count}',
   'Der Tagebuch-Lesestand konnte nicht gespeichert werden. Zum Wiederholen das Tagebuch erneut öffnen.',
   'Bitte die Anwendung neu laden, bevor du weitere Änderungen vornimmst.'],
  es:['Nuevas entradas del diario: {count}',
   'No se pudo guardar el estado de lectura. Abre el diario de nuevo para reintentarlo.',
   'Recarga la aplicación antes de realizar más cambios.'],
  fr:['Nouvelles entrées du journal : {count}',
   'Impossible d’enregistrer la lecture. Rouvrez le journal pour réessayer.',
   'Rechargez l’application avant toute autre modification.']
 };
 for(const code of ['en','de','es','fr'])
  root.TPText.registerLocale(code,{
   'journalUnread.count':journalText[code][0],
   'journalUnread.saveFailed':journalText[code][1],
   'journalUnread.reload':journalText[code][2]
  });
 const tr=(key,params={})=>root.TPText.t('stories.'+key,params);

 const style=document.createElement('style');
 style.textContent=`
 #tp-app-page.tp-pokedex-hub{
  padding:8px;gap:8px;overflow:hidden;
 }
 #tp-app-page.tp-pokedex-hub>.tp-app-head{
  flex:0 0 auto;margin:0;
 }
 #tp-app-page.tp-pokedex-hub>.tp-app-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  grid-template-rows:repeat(3,minmax(44px,1fr));
  gap:6px;flex:1 1 0;min-height:144px;margin:0;
 }
 #tp-app-page.tp-pokedex-hub>.tp-app-grid>button{
  min-width:0;min-height:44px;padding:4px;margin:0;
 }
 #tp-story-unlock{
  flex:0 0 auto;
 }
 #tp-app-page .tp-story-info{
  display:flex;align-items:center;justify-content:center;
  gap:8px;width:100%;min-height:44px;
  box-sizing:border-box;padding:4px 8px;margin:0;
  font-size:12px;line-height:1.2;text-align:center;
 }
 #tp-app-page .tp-story-info-text{
  flex:1;min-width:0;text-align:center;
 }
 #tp-app-page .tp-story-info-symbol{
  display:inline-flex;align-items:center;justify-content:center;
  flex:0 0 18px;width:18px;height:18px;
  box-sizing:border-box;border:2px solid currentColor;
  border-radius:50%;font:bold 13px monospace;line-height:1;
 }
 `;

 style.textContent+=`
 #tp-app-page.tp-pokedex-hub #tp-story-unlock>.tp-story-info{
  background-color:#e7f0ff!important;color:#17375e!important;
  border-color:#17375e!important;border-width:2px!important;
 }
 #tp-app-page.tp-pokedex-hub .tp-story-info-symbol{
  background-color:#17375e!important;color:#ffffff!important;border-color:#17375e!important;
 }
 #tp-app-page.tp-pokedex-hub .tp-app-grid>button[data-hub]{
  position:relative;padding-left:22px;padding-right:22px;
 }
 #tp-app-page.tp-pokedex-hub .tp-hub-count{
  position:absolute;right:5px;top:50%;transform:translateY(-50%);
  display:inline-flex;align-items:center;justify-content:center;
  min-width:18px;height:18px;padding:0 4px;box-sizing:border-box;
  border-radius:9px;background-color:#b3261e!important;color:#ffffff!important;
  font:bold 11px monospace;line-height:1;
 }
 `;

 style.textContent+=`
 #tp-app-page .tp-unread-dot{
  display:inline-block;flex:0 0 8px;
  width:8px;height:8px;min-width:8px;min-height:8px;
  padding:0!important;border:0!important;border-radius:50%;
  background-color:#b3261e!important;
  font-size:0;line-height:0;
 }
 #tp-app-page .tp-story-open-dot{
  margin-left:auto;
 }
 #tp-app-page .tp-app-entry p>.tp-unread-dot{
  vertical-align:middle;margin-right:6px;
 }
 `;
 style.textContent+=`
 #tp-app-page #tp-stories-page button[data-story][data-complete="true"]{
  opacity:.65!important;filter:grayscale(.8);cursor:default;
 }
 `;
 document.head.appendChild(style);

 let host=null,kind='list',cached=null,saving=false,message='';
 const svc=()=>root.TPZapdos;
 function node(tag,text){
  const n=document.createElement(tag);
  if(text!==undefined)n.textContent=text;
  return n;
 }
 function visible(){
  return !!host?.isConnected&&!host.closest('#tp-app-page')?.hidden;
 }
 function button(label,action,disabled=false){
  const n=node('button',label);n.type='button';n.disabled=disabled;
  n.addEventListener('click',()=>{
   if(n.disabled||saving||root.TPCollection?.busy||tpSaveReplacing)return;
   action();
  });
  return n;
 }
 function icon(){
  const n=node('span');
  n.setAttribute('aria-hidden','true');
  n.style.cssText='width:38px;flex:0 0 38px;display:block;';
  n.innerHTML='<svg viewBox="0 0 40 40" width="38" height="38" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 35V18l10 5V15l10 6V8h7v27ZM4 35h32M26 8V4h5v4"/><path d="m19 22-5 7h5l-3 6 9-10h-6l3-3"/></svg>';
  return n;
 }
 function updateJournalCount(){
  const target=document.querySelector(
   '#tp-app-page.tp-pokedex-hub button[data-hub="journal"]'
  );
  if(!target||target.closest('#tp-app-page')?.hidden||
     !root.TPJournalUnread?.supported)return;
  let state;
  try{state=root.TPJournalUnread.read();}catch(_){return;}
  target.querySelector('.tp-hub-count')?.remove();
  target.removeAttribute('aria-description');
  if(!state.unread)return;
  const badge=node('span',String(state.unread));
  badge.className='tp-hub-count';badge.setAttribute('aria-hidden','true');
  target.appendChild(badge);
  target.setAttribute('aria-description',
   root.TPText.t('journalUnread.count',{count:state.unread}));
 }
 function updateStoryCount(state){
  const target=document.querySelector(
   '#tp-app-page.tp-pokedex-hub button[data-hub="stories"]'
  );
  if(!target)return;
  target.querySelector('.tp-hub-count')?.remove();
  target.removeAttribute('aria-description');
  const count=state.filter(entry=>entry.unlocked&&entry.phase!=='complete').length;
  if(!count)return;
  const badge=node('span',String(count));
  badge.className='tp-hub-count';
  badge.setAttribute('aria-hidden','true');
  target.appendChild(badge);
  target.setAttribute('aria-description',tr('openCount',{count}));
 }
 function readCatalogue(){
  const entries=[];
  for(const [id,order,service] of [
   ['zapdos',1,root.TPZapdos],['articuno',2,root.TPArktos],
   ['moltres',3,root.TPLavados],['mewtwo',4,root.TPMewtu],['mew',5,root.TPMew]
  ]){
   if(!service?.noticeSupported)continue;
   entries.push({id,order,service,...service.access()});
  }
  return entries;
 }

 // UI01-05: selecting and paging never advances or acknowledges a story.
 let storyPane=null,storyNav=null,storySelected=null,storyPage=null;
 let storyTiles=[],storyPrev=null,storyNext=null,storyIndicator=null;
 const storyPageSize=3;
 const previewLocales={
  en:{
   previewStart:"Start story",previewResume:"Continue story",
   previewPrevious:"Previous stories",previewNext:"Next stories",
   previewList:"Choose a story",previewLabel:"Story introduction",
   "teaser.zapdos":"The lights flicker. What is disturbing the power plant?",
   "teaser.articuno":"Snow hides the cave entrance. What lies beyond?",
   "teaser.moltres":"A feather glows among the rocks. Where does the path lead?",
   "teaser.mewtwo":"An unseen force blocks your way. What lies beyond?",
   "teaser.mew":"Something darts through the leaves. A trail begins past the bridge."
  },
  de:{
   previewStart:"Geschichte starten",previewResume:"Geschichte fortsetzen",
   previewPrevious:"Vorherige Geschichten",previewNext:"Weitere Geschichten",
   previewList:"Geschichte auswählen",previewLabel:"Geschichteneinstieg",
   "teaser.zapdos":"Im Kraftwerk flackert das Licht. Was stört die Anlage?",
   "teaser.articuno":"Schnee wirbelt vor dem Höhleneingang. Was liegt dahinter?",
   "teaser.moltres":"Zwischen Felsen glimmt eine Feder. Wohin führt der Seitenpfad?",
   "teaser.mewtwo":"Eine unsichtbare Kraft hält dich auf. Was liegt dahinter?",
   "teaser.mew":"Etwas huscht durchs Laub. Hinter der Brücke beginnt eine Spur."
  },
  es:{
   previewStart:"Iniciar historia",previewResume:"Continuar historia",
   previewPrevious:"Historias anteriores",previewNext:"Más historias",
   previewList:"Elegir una historia",previewLabel:"Inicio de la historia",
   "teaser.zapdos":"Las luces parpadean. ¿Qué altera la central?",
   "teaser.articuno":"La nieve oculta la cueva. ¿Qué habrá detrás?",
   "teaser.moltres":"Una pluma brilla entre rocas. ¿Adónde lleva el sendero?",
   "teaser.mewtwo":"Una fuerza invisible te frena. ¿Qué habrá detrás?",
   "teaser.mew":"Algo cruza el follaje. Una pista sigue tras el puente."
  },
  fr:{
   previewStart:"Lancer l’histoire",previewResume:"Continuer l’histoire",
   previewPrevious:"Histoires précédentes",previewNext:"Autres histoires",
   previewList:"Choisir une histoire",previewLabel:"Début de l’histoire",
   "teaser.zapdos":"Les lumières vacillent. Qu’est-ce qui trouble la centrale ?",
   "teaser.articuno":"La neige cache la grotte. Que se trouve-t-il derrière ?",
   "teaser.moltres":"Une plume luit entre les rochers. Où mène ce passage ?",
   "teaser.mewtwo":"Une force invisible te bloque. Que cache la grotte ?",
   "teaser.mew":"Les feuilles bougent. Une piste commence derrière le pont."
  }
 };
 for(const code of ['en','de','es','fr'])
  root.TPText.registerLocale(code,Object.fromEntries(
   Object.entries(previewLocales[code]).map(([key,value])=>['stories.'+key,value])
  ));
 function storyPlace(entry){
  const text={
   articuno:root.TPArktosText,moltres:root.TPLavadosText,
   mewtwo:root.TPMewtuText,mew:root.TPMewText
  }[entry.id];
  return text?text.t('place'):tr('plant');
 }
 function storyAction(label,fn,disabled=false){
  const b=node('button',label);
  b.type='button';b.disabled=disabled;
  b.addEventListener('click',()=>{
   if(b.disabled||b.isConnected===false||kind!=='list'||!visible()||
      saving||root.TPCollection?.busy||
      (typeof tpSaveReplacing!=='undefined'&&tpSaveReplacing)||
      document.visibilityState==='hidden')return;
   fn();
  });
  return b;
 }
 function storyIcon(id){
  const art={
   zapdos:['#866033','<path d="M4 20V9h6V5h4v4h6v11Z" fill="#fff0cf"/><path d="m13 10-4 5h4l-2 4 5-6h-4Z"/>'],
   articuno:['#315b83','<path d="M4 20V12a8 8 0 0 1 16 0v8Z" fill="#dbe9f5"/><path d="M12 7v12M7 10l10 6M7 16l10-6"/>'],
   moltres:['#963c45','<path d="m3 20 4-13 5-4 5 4 4 13Z" fill="#f4dadd"/><path d="M9 16c6 0 7-6 6-8-4 0-7 3-6 8Zm0 1 6-8"/>'],
   mewtwo:['#71538a','<path d="M4 18V12a8 8 0 0 1 16 0v6Z" fill="#ece2f5"/><path d="M9 17v-5a3 3 0 0 1 6 0v5M3 21h18"/>'],
   mew:['#3e7455','<path d="M3 14h18v4H3Z" fill="#dceedd"/><path d="M5 8v13M19 8v13M5 11h14M9 14v4M15 14v4"/>']
  }[id];
  const icon=node('span');
  icon.className='tp-story-place-icon';
  icon.setAttribute('aria-hidden','true');
  icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="'+art[0]+
   '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+
   art[1]+'</svg>';
  return icon;
 }
 function paintStoryPreview(entry){
  if(!storyPane)return;
  storyPane.replaceChildren();
  storyPane.dataset.story=entry.id;
  const copy=node('p',message||tr('teaser.'+entry.id));
  copy.setAttribute('role',message?'alert':'status');
  const start=storyAction(
   entry.done?tr('done'):
    tr(entry.phase==='investigate'?'previewStart':'previewResume'),
   ()=>{
    if(storySelected!==entry.id)return;
    try{
     const current=entry.service.access();
     if(!current.unlocked||current.phase==='complete'){render();return;}
     root.TPAppMenu.show(entry.id);
    }catch(_){message=tr('invalid');render();}
   },!entry.available||entry.done
  );
  start.dataset.storyStart=entry.id;
  storyPane.append(copy,start);
 }
 function selectStoryEntry(entry){
  storySelected=entry.id;message='';
  for(const tile of storyTiles)
   tile.setAttribute('aria-pressed',String(tile.dataset.story===storySelected));
  paintStoryPreview(entry);
 }
 function paintStoryPage(entries,requested,chooseFirst=false){
  const size=storyNav?storyPageSize:entries.length;
  const pages=Math.max(1,Math.ceil(entries.length/size));
  storyPage=Math.max(0,Math.min(pages-1,requested));
  const first=storyPage*size,last=first+size;
  for(let i=0;i<storyTiles.length;i++)
   storyTiles[i].hidden=i<first||i>=last;
  if(chooseFirst){
   const shown=entries.slice(first,last);
   selectStoryEntry(shown.find(entry=>!entry.done)||shown[0]);
  }
  if(storyPrev)storyPrev.disabled=storyPage===0;
  if(storyNext)storyNext.disabled=storyPage===pages-1;
  if(storyIndicator)storyIndicator.textContent=(storyPage+1)+' / '+pages;
 }
 function renderStorySelection(entries){
  const retained=entries.find(entry=>entry.id===storySelected);
  const chosen=retained||entries.find(entry=>!entry.done)||entries[0];
  storySelected=chosen.id;
  if(storyPage===null||!retained)
   storyPage=Math.floor(entries.indexOf(chosen)/storyPageSize);
  for(const entry of entries){
   const status=entry.done?tr('done'):entry.fresh?tr('new'):tr('open');
   const tile=storyAction('',()=>selectStoryEntry(entry),
    !entry.available||entry.done);
   tile.dataset.story=entry.id;
   tile.dataset.complete=String(entry.done);
   tile.setAttribute('aria-pressed',String(entry.id===storySelected));
   const place=node('span',storyPlace(entry));
   place.className='tp-story-place';
   const state=node('span',' · '+status);
   state.className='tp-story-status-sr';
   tile.append(storyIcon(entry.id),place,state);
   if(entry.available&&!entry.done){
    const dot=node('span');
    dot.className='tp-unread-dot tp-story-open-dot';
    dot.setAttribute('aria-hidden','true');tile.appendChild(dot);
    tile.setAttribute('aria-description',tr('openCount',{count:1}));
   }
   storyTiles.push(tile);host.append(tile);
  }
  if(storyNav&&entries.length>storyPageSize){
   storyNav.hidden=false;
   storyPrev=storyAction('‹',()=>paintStoryPage(entries,storyPage-1,true));
   storyPrev.id='tp-stories-prev';
   storyPrev.setAttribute('aria-label',tr('previewPrevious'));
   storyNext=storyAction('›',()=>paintStoryPage(entries,storyPage+1,true));
   storyNext.id='tp-stories-next';
   storyNext.setAttribute('aria-label',tr('previewNext'));
   storyIndicator=node('span');
   storyIndicator.setAttribute('role','status');
   storyNav.append(storyPrev,storyIndicator,storyNext);
  }
  paintStoryPage(entries,storyPage);
  paintStoryPreview(chosen);
  if(!storyPane&&message)host.append(node('p',message));
 }

 function render(){
  if(!visible())return;
  host.replaceChildren();
  if(kind==='list'){
   storyTiles=[];storyPrev=null;storyNext=null;storyIndicator=null;
   if(storyPane){
    storyPane.replaceChildren();delete storyPane.dataset.story;
   }
   if(storyNav){storyNav.replaceChildren();storyNav.hidden=true;}
  }
  try{
   if(!saving&&!root.TPCollection?.busy)cached=readCatalogue();
   if(!cached?.length){
    if(kind==='list')host.append(node('p',tr('unavailable')));
    return;
   }
  }catch(_){host.append(node('p',tr('invalid')));return;}
  updateStoryCount(cached);updateJournalCount();
  if(kind==='hint'){
   if(!cached.some(entry=>
    entry.unlocked&&entry.phase!=='complete'&&entry.newlyUnlocked
   ))return;
   const info=button('',()=>acknowledge(true),saving);
   info.className='tp-story-info';
   info.setAttribute('aria-label',tr('hintText'));
   info.setAttribute('aria-busy',String(saving));
   const symbol=node('span','i');
   symbol.className='tp-story-info-symbol';
   symbol.setAttribute('aria-hidden','true');
   const label=node('span',tr('hintText'));
   label.className='tp-story-info-text';
   info.append(symbol,label);host.append(info);
   if(message){
    label.textContent=tr('saveFailedShort');
    const error=node('span',message);
    error.id='tp-story-notice-error';
    error.className='tp-story-notice-detail';
    error.setAttribute('role','alert');
    info.setAttribute('aria-describedby',error.id);
    info.append(error);
   }
   return;
  }
  // Reveal only accessible stories; retain completed adventures.
  const entries=cached
   .filter(entry=>entry.unlocked||entry.phase==='complete')
   .map(entry=>({...entry,
    available:entry.unlocked,fresh:entry.newlyUnlocked,
    done:entry.phase==='complete'
   }));
  if(!entries.length){
   const empty=node('p',tr('empty'));
   empty.className='tp-stories-empty';
   empty.setAttribute('role','status');
   empty.style.cssText='margin:0;padding:12px;text-align:center;';
   host.append(empty);
   return;
  }
  const rank=e=>e.done?3:e.fresh?0:e.available?1:2;
  entries.sort((a,b)=>rank(a)-rank(b)||b.order-a.order);
  renderStorySelection(entries);
 }
 async function acknowledge(openStories){
  if(saving)return;
  const origin=host,mod=Module;
  saving=true;message='';render();
  let confirmed=false;
  try{
   for(const entry of cached.filter(entry=>
    entry.unlocked&&entry.phase!=='complete'&&entry.newlyUnlocked
   ))
    await entry.service.acknowledgeNotice();
   confirmed=true;
  }catch(error){
   message=tr('saveFailed');
   try{root.TPDiagnostics?.record('write',error);}catch(_){}
  }finally{saving=false;}
  if(Module!==mod||host!==origin||!visible())return;
  if(confirmed&&openStories)root.TPAppMenu.show('stories');
  else render();
 }
 function mount(target,mode='list',options={}){
  host=target;kind=mode;cached=null;message='';
  storyPane=options.preview||null;storyNav=options.navigation||null;
  storyPage=null;
  if(mode==='list'){
   host.setAttribute('role','group');
   host.setAttribute('aria-label',tr('previewList'));
  }
  if(storyPane){
   storyPane.setAttribute('role','region');
   storyPane.setAttribute('aria-label',tr('previewLabel'));
  }
  host.id=mode==='hint'?'tp-story-unlock':'tp-stories-page';
  host.style.cssText='display:flex;flex-direction:column;gap:10px;'+
   'min-height:0;overflow:auto;';
  render();
 }
 function drawNotice(x,y){
  if(!svc()?.noticeSupported||root.TPCollection?.busy||tpSaveReplacing)return;
  try{
   const call=name=>Module.ccall(name,'number',[],[]);
   const zapdosNew=call('tp_zpd_step')===0&&
    call('tp_zpd_access')===1&&call('tp_zpd_notice_read')===0;
   const artCall=name=>Module.ccall(name,'number',['number'],[144]);
   const arktosNew=typeof Module._tp_story_step==='function'&&
    artCall('tp_story_step')===0&&artCall('tp_story_access')===1&&
    artCall('tp_story_notice_read')===0;
   const fireCall=name=>Module.ccall(name,'number',['number'],[146]);
   const moltresNew=typeof Module._tp_story_step==='function'&&
    fireCall('tp_story_step')===0&&fireCall('tp_story_access')===1&&
    fireCall('tp_story_notice_read')===0;
   const mindCall=name=>Module.ccall(name,'number',['number'],[150]);
   const mewtwoNew=typeof Module._tp_story_step==='function'&&
    mindCall('tp_story_step')===0&&mindCall('tp_story_access')===1&&
    mindCall('tp_story_notice_read')===0;
   const mewCall=name=>Module.ccall(name,'number',['number'],[151]);
   const mewNew=typeof Module._tp_story_step==='function'&&
    mewCall('tp_story_step')===0&&mewCall('tp_story_access')===1&&
    mewCall('tp_story_notice_read')===0;
   if(!zapdosNew&&!arktosNew&&!moltresNew&&!mewtwoNew&&!mewNew)return;
   ctx.save();
   ctx.fillStyle='#17375e';ctx.strokeStyle='#fff7eb';ctx.lineWidth=1.5;
   ctx.beginPath();ctx.arc(x+18,y-18,8,0,Math.PI*2);
   ctx.fill();ctx.stroke();
   ctx.fillStyle='#ffffff';ctx.font='bold 12px monospace';
   ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillText('i',x+18,y-18);
   ctx.restore();
  }catch(_){}
 }
 setInterval(updateJournalCount,1000);
 root.TPStoriesUI=Object.freeze({
  mount:(target,options)=>mount(target,'list',options),
  mountHint:target=>mount(target,'hint'),
  drawNotice,text:tr,get busy(){return saving;}
 });
})(typeof globalThis!=='undefined'?globalThis:this);
