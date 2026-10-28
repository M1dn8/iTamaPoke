/* P06 admission UI: one pending individual, existing collection transactions. */
(function(root){
 'use strict';
 let page=null,notice=null,active=false,busy=false,choosing=false;
 let message='',notified=0,lastTick=0,lastKey='';
 const tr=(key,params={})=>root.TPAdmissionText.t(key,params);
 const service=()=>root.TPAdmission;
 const collection=()=>root.TPCollection;
 const host=()=>document.getElementById('tp-game-shell');
 const mod=()=>typeof Module==='undefined'?null:Module;
 const name=p=>p.nickname||fns.dexName(p.dex);
 function allowed(){
  return !!mod()&&!!root.TPAppMenu?.ready&&!root.TPAppMenu.active&&
   !root.TPBoxes?.active&&!root.TPCollectionGame?.dialogOpen&&
   !collection()?.busy&&!collection()?.blocked&&!tpSaveReplacing&&
   !root.TPArena?.busy&&!root.TPLeague?.busy&&choice==='none'&&
   (['idle','card','settings'].includes(screen)||
    screen==='battle'&&!!fns.battleResolved()&&
     !!fns.battleCatchDone()&&!!fns.battleCatchSuccess());
 }
 function node(tag,text,cls){
  const n=document.createElement(tag);
  if(text!==undefined)n.textContent=text;
  if(cls)n.className=cls;
  return n;
 }
 function button(label,handler,disabled=false){
  const n=node('button',label);n.type='button';n.disabled=disabled;
  n.addEventListener('click',()=>{
   if(!n.disabled&&!busy)handler();
  });
  return n;
 }
 function close(){
  if(busy||collection()?.blocked)return;
  active=false;choosing=false;
  if(page)page.style.display='none';
 }
 function boxes(){
  if(busy||collection()?.blocked)return;
  close();
  if(screen==='battle')mod()._tp_battle_close();
  screen='card';cardPage=3;dragStart=dragNow=null;
  root.TPBoxes.open();
 }
 function completeFinale(pending){
  if(pending?.kind!=='join')return;
  try{root.TPStoryFinales?.show(pending);}
  catch(error){
   try{root.TPDiagnostics?.record('manager',error);}catch(_){}
  }
 }
 async function complete(choice){
  if(busy)return;
  busy=true;message=tr('saving');render();
  let completed=null;
  try{
   const pending=service().read().pending;
   await service().complete(choice);
   busy=false;message='';close();completed=pending;
  }catch(error){
   message=error.code==='RELOAD_REQUIRED'?tr('reload'):
    error.code==='BOXES_FULL'?tr('waiting'):tr('failed');
   try{root.TPDiagnostics?.record('write',error);}catch(_){}
   busy=false;active=true;render();
  }
  if(completed)completeFinale(completed);
 }
 function render(){
  if(!active||!page)return;
  page.replaceChildren();
  const disabled=busy||!!collection()?.busy||!!collection()?.blocked;
  page.append(node('h2',tr('title')));
  let admission,s;
  try{admission=service().read();s=collection().read();}
  catch(_){
   page.append(node('p',tr('unreadable')),
    button(tr('reloadButton'),()=>root.location.reload()));
   return;
  }
  const pending=admission.pending;
  if(!pending){page.append(button(tr('later'),close,disabled));return;}
  const pokemon=pending.pokemon;
  page.append(node('h3',tr('member',{name:name(pokemon),level:pokemon.level})));
  if(message)page.append(node('p',message,'tp-box-message'));
  if(collection().blocked){
   page.append(button(tr('reloadButton'),()=>root.location.reload()));
   return;
  }
  const full=root.TPCollectionModel.summary(s).stored>=200;
  if(full)page.append(node('p',tr('waiting')));
  else if(s.team.length<6){
   page.append(button(tr('accept'),()=>complete({mode:'auto'}),disabled));
  }else if(!choosing){
   page.append(node('p',tr('ask')),
    button(tr('team'),()=>{choosing=true;render();},disabled),
    button(tr('box'),()=>complete({mode:'box'}),disabled));
  }else{
   page.append(node('p',tr('choose')));
   for(const id of s.team){
    const m=s.mons.find(p=>p.id===id),pinned=id===s.active;
    page.append(button(tr('member',{name:name(m),level:m.level})+
     (pinned?' · '+tr('care'):''),
     ()=>complete({mode:'replace',replaceId:id}),disabled||pinned));
   }
   page.append(button(tr('box'),()=>complete({mode:'box'}),disabled));
  }
  page.append(button(tr('boxes'),boxes,disabled));
  const later=button(tr('later'),close,disabled);
  page.append(later);
  if(!disabled)later.focus();
 }
 function open(){
  if(active){render();return true;}
  if(!service()?.supported||!allowed())return false;
  let pending;
  try{pending=service().read().pending;}catch(_){return false;}
  if(!pending)return false;
  if(!page){
   page=node('section',undefined,'tp-box-page');
   page.id='tp-admission-page';
   page.setAttribute('role','dialog');page.setAttribute('aria-modal','true');
   page.style.cssText='position:absolute;inset:0;z-index:50;overflow:auto;'+
    'background:#f7efe6;color:#34423d;padding:16px;box-sizing:border-box;';
   host().append(page);
   page.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();close();}
   });
  }
  notified=pending.ticket;active=true;choosing=false;message='';
  page.style.display='block';dragStart=dragNow=null;render();
  return true;
 }
 function poll(){
  const now=performance.now();
  if(now-lastTick<250||!service()?.supported||!host())return;
  lastTick=now;
  if(collection()?.busy||busy)return;
  if(!notice){
   notice=button(tr('notice'),open);notice.id='tp-admission-notice';
   notice.style.cssText='position:absolute;top:4px;left:8px;right:8px;'+
    'z-index:15;display:none;';
   host().append(notice);
  }
  let admission,s;
  try{admission=service().read();s=collection().read();}
  catch(_){notice.textContent=tr('unreadable');notice.style.display='block';return;}
  const pending=admission.pending;
  notice.style.display=pending&&!active?'block':'none';
  notice.textContent=tr('notice');
  if(!pending){
   if(active&&!collection().blocked)close();
   return;
  }
  const key=pending.ticket+':'+s.revision+':'+message;
  if(active&&key!==lastKey){lastKey=key;render();}
  if(!active&&notified!==pending.ticket&&allowed()){
   notified=pending.ticket;
   if(s.team.length<6&&root.TPCollectionModel.summary(s).stored<200&&
      !service().autoAttempted(pending.ticket)){
    void complete({mode:'auto'});
   }else open();
  }
 }
 root.TPAdmissionUI=Object.freeze({
  open,close,poll,get active(){return active;},get busy(){return busy;}
 });
})(typeof globalThis!=='undefined'?globalThis:this);
