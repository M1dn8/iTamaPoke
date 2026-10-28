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
   ['zapdos',1,root.TPZapdos],['articuno',2,root.TPArktos]
  ]){
   if(!service?.noticeSupported)continue;
   entries.push({id,order,service,...service.access()});
  }
  return entries;
 }
 function render(){
  if(!visible())return;
  host.replaceChildren();
  try{
   if(!saving&&!root.TPCollection?.busy)cached=readCatalogue();
   if(!cached?.length){
    if(kind==='list')host.append(node('p',tr('unavailable')));
    return;
   }
  }catch(_){host.append(node('p',tr('invalid')));return;}
  updateStoryCount(cached);updateJournalCount();
  if(kind==='hint'){
   if(!cached.some(entry=>entry.newlyUnlocked))return;
   const info=button('',()=>acknowledge(true),saving);
   info.className='tp-story-info';
   info.setAttribute('aria-busy',String(saving));
   const symbol=node('span','i');
   symbol.className='tp-story-info-symbol';
   symbol.setAttribute('aria-hidden','true');
   const label=node('span',tr('hintText'));
   label.className='tp-story-info-text';
   info.append(symbol,label);host.append(info);
   if(message){
    const error=node('p',message);
    error.setAttribute('role','alert');host.append(error);
   }
   return;
  }
  const entries=cached.map(entry=>({...entry,
   available:entry.unlocked,fresh:entry.newlyUnlocked,
   done:entry.phase==='complete'
  }));
  const rank=e=>e.done?3:e.fresh?0:e.available?1:2;
  entries.sort((a,b)=>rank(a)-rank(b)||b.order-a.order);
  for(const entry of entries){
   const art=entry.id==='articuno';
   const status=!entry.available?
    (art?root.TPArktosText.t('locked',{count:Math.max(0,entry.badges)}):
     tr('locked',{count:Math.max(0,entry.badges)})):
    entry.done?tr('done'):entry.phase==='waiting'?tr('waiting'):
    entry.fresh?tr('new'):tr('open');
   const tile=button('',()=>{
    try{
     const current=entry.service.access();
     if(!current.unlocked||current.phase==='complete')return;
     root.TPAppMenu.show(entry.id);
    }catch(_){message=tr('invalid');render();}
   },!entry.available||entry.done);
   tile.dataset.story=entry.id;
   tile.dataset.complete=String(entry.done);
   tile.style.cssText='display:flex;align-items:center;gap:12px;'+
    'width:100%;min-height:68px;text-align:left;padding:10px;';
   const symbol=art?node('span','❄'):icon();
   if(art){
    symbol.setAttribute('aria-hidden','true');
    symbol.style.cssText=
     'width:38px;flex:0 0 38px;font-size:30px;text-align:center';
   }
   tile.append(symbol,node('span',
    (art?root.TPArktosText.t('place'):tr('plant'))+' · '+status));
   if(entry.available&&!entry.done){
    const dot=node('span');
    dot.className='tp-unread-dot tp-story-open-dot';
    dot.setAttribute('aria-hidden','true');tile.appendChild(dot);
    tile.setAttribute('aria-description',tr('openCount',{count:1}));
   }
   host.append(tile);
  }
  if(message)host.append(node('p',message));
 }
 async function acknowledge(openStories){
  if(saving)return;
  const origin=host,mod=Module;
  saving=true;message='';render();
  let confirmed=false;
  try{
   for(const entry of cached.filter(entry=>entry.newlyUnlocked))
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
 function mount(target,mode='list'){
  host=target;kind=mode;cached=null;message='';
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
   if(!zapdosNew&&!arktosNew)return;
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
  mount:target=>mount(target),
  mountHint:target=>mount(target,'hint'),
  drawNotice,text:tr,get busy(){return saving;}
 });
})(typeof globalThis!=='undefined'?globalThis:this);
