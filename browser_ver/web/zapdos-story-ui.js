/* P06 story page and combat orchestration. No independent save store. */
(function(root){
 'use strict';
 const tr=(key,params={})=>root.TPZapdosText.t(key,params);
 const svc=()=>root.TPZapdos,collection=()=>root.TPCollection;
 const call=(name,args=[])=>Module.ccall(
  name,'number',args.map(v=>typeof v==='string'?'string':'number'),args
 );
 let body=null,cached=null,message='',starting=false,saving=false,claiming=false;
 let ownedBattle=0,ownedMod=null,attempted=false,resultError='',historicalCaught=false;
 const busy=()=>starting||saving||claiming;
 function owns(){
  try{return !!ownedBattle&&Module===ownedMod&&
   call('tp_zpd_get',[0])===1&&call('tp_zpd_get',[4])===ownedBattle;}
  catch(_){return false;}
 }
 function report(error){
  try{root.TPDiagnostics?.record('write',error);}catch(_){}
 }
 function node(tag,text){
  const n=document.createElement(tag);
  if(text!==undefined)n.textContent=text;
  return n;
 }
 function button(label,fn,disabled=false,safe=false){
  const b=node('button',label);b.type='button';b.disabled=disabled;
  b.addEventListener('click',()=>{
   if(b.disabled||!safe&&(busy()||collection()?.busy||collection()?.blocked))return;
   try{const result=fn();if(result?.catch)result.catch(report);}
   catch(error){report(error);}
  });
  return b;
 }
 function visible(){
  return !!body?.isConnected&&!body.closest('#tp-app-page')?.hidden;
 }
 function render(){
  if(!visible())return;
  body.replaceChildren();
  if(!svc()?.supported){body.append(node('p',tr('unavailable')));return;}
  if(collection().blocked){
   body.append(node('p',tr('reload')),
    button(tr('reloadButton'),()=>root.location.reload(),false,true));
   return;
  }
  try{
   if(!busy()&&!collection().busy)cached=svc().view();
   if(!cached)throw Error('No published story view');
  }catch(_){
   body.append(node('p',tr('invalid')),
    button(tr('reloadButton'),()=>root.location.reload(),false,true));
   return;
  }
  const disabled=busy()||collection().busy;
  if(message)body.append(node('p',message));
  if(disabled)body.append(node('p',tr('saving')));
  if(cached.phase==='investigate'){
   body.append(node('h3',tr('introTitle')),node('p',tr('intro')),
    button(tr('investigate'),()=>advance('investigate'),disabled));
  }else if(cached.phase==='secure'){
   body.append(node('h3',tr('secureTitle')),node('p',tr('secureText')),
    button(tr('secure'),()=>advance('secure'),disabled));
  }else if(cached.phase==='duel'){
   const canStart=cached.canBattle&&!!call('tp_battle_can_start');
   body.append(node('h3',tr('duelTitle')),node('p',tr('duelText')),
    node('p',tr('level')),
    button(tr('start'),start,disabled||!canStart));
   if(!cached.canBattle){
    body.append(node('p',tr('blocked')),
     button(tr('admission'),openAdmission,disabled));
   }else if(!canStart)body.append(node('p',tr('cannotStart')));
  }else if(cached.phase==='waiting'){
   body.append(node('h3',tr('waitingTitle')),node('p',tr('waitingText')),
    button(tr('admission'),openAdmission,disabled));
  }else{
   body.append(node('h3',tr('completeTitle')),node('p',tr('completeText')));
  }
 }
 function mount(host){
  body=host;body.id='tp-zapdos-page';body.tabIndex=0;
  body.className='tp-app-list';
  body.style.cssText='overflow:auto;min-height:0;display:flex;'+
   'flex-direction:column;gap:12px;padding-bottom:16px;';
  cached=null;render();
 }
 async function advance(action){
  if(busy())return false;
  starting=true;message='';render();
  try{await svc().advance(action);return true;}
  catch(error){
   message=tr(error.code==='RELOAD_REQUIRED'?'reload':'saveFailed');
   report(error);return false;
  }finally{starting=false;render();}
 }
 function blocked(){
  return tpSaveReplacing||collection()?.busy||collection()?.blocked||
   root.TPCollectionGame?.dialogOpen||root.TPAdmissionUI?.active||
   root.TPAdmissionUI?.busy||root.TPMega?.busy||root.TPTraining?.busy||
   root.TPArena?.busy||root.TPLeague?.busy||root.TPExpeditions?.busy||
   root.TPBoxes?.active;
 }
 async function start(){
  if(busy()||blocked()||!svc()?.supported||
     !root.TPAppMenu?.active||screen!=='settings'||choice!=='none'||
     document.visibilityState!=='visible')return false;
  const mod=Module,origin=body;
  starting=true;message='';render();
  try{
   await svc().prepare();
   if(Module!==mod||body!==origin||!visible()||screen!=='settings'||
      !root.TPAppMenu.active||blocked()||choice!=='none'||
      document.visibilityState!=='visible')
    throw Error('ZAPDOS_START_CONTEXT_CHANGED');
   const s=collection().read();
   root.TPCollectionModel.validate(s);
   const ids=s.team.length?s.team:s.active===null?[]:[s.active];
   if(!ids.length||ids.length>6)throw Error('ZAPDOS_TEAM_UNAVAILABLE');
   const members=ids.map(id=>{
    const m=s.mons.find(p=>p.id===id),stats=m?.data.stats;
    if(!m||!stats||!['atk','def','spe'].every(
     k=>Number.isInteger(stats[k])&&stats[k]>=1&&stats[k]<=65535
    ))throw Error('ZAPDOS_STATS_UNAVAILABLE');
    return m;
   });
   if(call('tp_wt_stage_begin',[members.length])!==1)
    throw Error('ZAPDOS_STAGE_REFUSED');
   for(let i=0;i<members.length;i++){
    const m=members[i],stats=m.data.stats;
    if(call('tp_wt_stage_entry',[
     i,m.id,m.dex,m.level,stats.atk,stats.def,stats.spe,
     m.id===s.active?1:0,m.shiny?1:0,m.nickname
    ])!==1)throw Error('ZAPDOS_MEMBER_REFUSED');
   }
   if(call('tp_zpd_start')!==1)throw Error('ZAPDOS_START_REFUSED');
   ownedBattle=call('tp_zpd_get',[4]);ownedMod=mod;
   historicalCaught=!!call('tp_battle_wild_already_caught');
   attempted=false;resultError='';
   root.TPAppMenu.close();
   dragStart=dragNow=null;battleReturn='idle';screen='battle';
   return true;
  }catch(error){
   message=tr(error.code==='RELOAD_REQUIRED'?'reload':'startFailed');
   statusEl.textContent=message;report(error);return false;
  }finally{starting=false;render();}
 }
 async function saveResult(){
  if(saving||starting||claiming||!owns()||collection().blocked||
     call('tp_zpd_get',[1])!==1)return false;
  saving=true;attempted=true;resultError='';
  try{await svc().complete();return true;}
  catch(error){
   resultError=tr(error.code==='RELOAD_REQUIRED'?'reload':'saveFailed');
   statusEl.textContent=resultError;report(error);return false;
  }finally{saving=false;}
 }
 function poll(){
  if(owns()&&!busy()&&!attempted&&call('tp_zpd_get',[1])===1)
   void saveResult();
 }
 function switchTo(index){
  if(!owns()||busy()||blocked()||!Number.isInteger(index)||
     index<0||index>5)return false;
  return call('tp_wt_switch',[index])===1;
 }
 function openAdmission(){
  if(busy()||blocked())return false;
  root.TPAppMenu.close();return root.TPAdmissionUI.open();
 }
 function showStory(){root.TPAppMenu.show('zapdos');}
 async function finish(){
  if(!owns()||busy()||collection().busy||collection().blocked||
     call('tp_zpd_get',[2])!==1)return false;
  const won=call('tp_zpd_get',[3])===1;
  Module._tp_battle_close();
  if(call('tp_battle_is_open'))return false;
  ownedBattle=0;ownedMod=null;resultError='';
  screen='idle';dragStart=dragNow=null;
  message=won?'':tr('loss');
  if(won&&svc().view().phase==='waiting'){
   const s=collection().read(),pending=root.TPAdmission.read().pending;
   if(s.team.length<6&&root.TPCollectionModel.summary(s).stored<200&&
      !root.TPAdmission.autoAttempted(pending.ticket)){
    claiming=true;
    try{
     await root.TPAdmission.complete({mode:'auto'});
     message=tr('taken');
    }catch(error){
     message=tr(error.code==='RELOAD_REQUIRED'?'reload':'saveFailed');
     statusEl.textContent=message;report(error);
    }finally{claiming=false;}
    showStory();
   }else root.TPAdmissionUI.open();
  }else showStory();
  return true;
 }
 function abort(){
  if(!owns()||busy()||collection().busy||collection().blocked)return false;
  if(call('tp_zpd_get',[1])===1||call('tp_zpd_get',[2])===1)return false;
  if(!root.confirm(tr('abortConfirm')))return false;
  Module._tp_battle_close();
  if(call('tp_battle_is_open'))return false;
  ownedBattle=0;ownedMod=null;resultError='';message='';
  screen='idle';showStory();return true;
 }
 root.TPZapdosUI=Object.freeze({
  mount,start,advance,poll,switchTo,retry:saveResult,finish,abort,owns,text:tr,
  get busy(){return busy();},
  get saving(){return owns()&&saving;},
  get resultPending(){return owns()&&call('tp_zpd_get',[1])===1;},
  get error(){return owns()?resultError:'';},
  get headline(){
   if(!owns())return '';
   if(call('tp_zpd_get',[1]))return tr('savingResult');
   if(call('tp_zpd_get',[2]))return tr(call('tp_zpd_get',[3])?'victory':'loss');
   return '';
  },
  get reward(){
   return owns()&&call('tp_zpd_get',[2])&&call('tp_zpd_get',[3])?
    tr('joinReady'):'';
  },
  get caught(){
   return owns()&&(historicalCaught||
    !!call('tp_zpd_get',[2])&&!!call('tp_zpd_get',[3]));
  }
 });
})(typeof globalThis!=='undefined'?globalThis:this);
