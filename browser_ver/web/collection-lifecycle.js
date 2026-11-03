/* F4-B3b current-care identity and transactional endings. No dex-bit migration. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TPCollectionLifecycle=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function error(code){const e=new Error(code);e.code=code;throw e;}
function create(mod,M,{canSync=()=>true,notify=()=>{},now=()=>Date.now(),millis=()=>globalThis.performance?.now()||0,nameForDex=d=>'Pokemon #'+d}={}){
 const supported=['_tp_f4_life_state','_tp_f4_life_ensure','_tp_f4_life_end'].every(n=>typeof mod[n]==='function');
 const call=(name,args=[])=>mod.ccall(name,'number',args.map(()=> 'number'),args);
 const state=()=>{if(!supported)error('NATIVE_LIFECYCLE_UNAVAILABLE');const s=JSON.parse(mod.ccall('tp_f4_life_state','string',[],[]));if(!s.valid)error('UNSUPPORTED_LIFECYCLE');return s;};
 const bootExisting=supported?state().profileDex>0:false;let controller=null,last='',retryAt=0,pending=null,dialog=null,opening=false,message=supported?'':'Aktuellen WASM-Build laden.';
 function reconcile(before,token){let s=state();const wasInitialized=s.initialized;if(!wasInitialized){if(!call('tp_f4_life_ensure',[token]))error('LIFECYCLE_INIT_REFUSED');s=state();}if(s.ceremony)return before;
  if(!s.snapshot){if(before.active!==null)error('CARE_IDENTITY_CHANGED');return before;}
  const old=before.active===null?null:before.mons.find(m=>m.id===before.active);
  if(old){const oldLife=old.data.lifeToken;if(!wasInitialized&&oldLife!==undefined)error('CARE_IDENTITY_CHANGED');
   if(oldLife===undefined){if(wasInitialized||old.dex!==s.snapshot.dex||old.shiny!==s.snapshot.shiny||JSON.stringify(old.data.genes)!==JSON.stringify(s.snapshot.data.genes))error('CARE_IDENTITY_CHANGED');}else if(oldLife!==s.token)error('CARE_IDENTITY_CHANGED');
   const snap={...s.snapshot,origin:old.origin,data:{...old.data,...s.snapshot.data,lifeToken:s.token}};
   if(JSON.stringify({...old,id:undefined})===JSON.stringify({...snap,id:undefined}))return before;return M.syncCurrent(before,old.id,snap);
  }
  return M.attachCurrent(before,{...s.snapshot,origin:!wasInitialized&&bootExisting?'existing':'raised',data:{...s.snapshot.data,lifeToken:s.token}});
 }
 const nativeActions=Object.freeze({careSync(before,token){return reconcile(before,token);},careEnd(before,token,kind,keep,expectedLife,confirmed=false,box=0){
  if(!['farewell','release','runaway'].includes(kind)||typeof keep!=='boolean')error('INVALID_ENDING');if(kind==='runaway'&&keep)error('RUNAWAY_CANNOT_BE_KEPT');if(!keep&&kind!=='runaway'&&confirmed!==true)error('CONFIRMATION_REQUIRED');
  const current=reconcile(before,token),s=state();if(s.ceremony||!s.snapshot||current.active===null||s.token!==expectedLife)error('STALE_CARE_DIALOG');
  const next=M.endCare(current,current.active,keep?'keep':kind==='runaway'?'runaway':'release',{box,confirmed:true});
  if(!call('tp_f4_life_end',[token,kind==='farewell'?0:kind==='release'?1:2,expectedLife,millis()>>>0]))error('NATIVE_END_REFUSED');return next;
 }});
 function note(e){message=e.code==='BOXES_FULL'?'Boxen voll – erst Platz schaffen oder abbrechen.':e.code==='NATIVE_LIFECYCLE_UNAVAILABLE'?'Aktuellen WASM-Build laden.':'Sammlung nicht gespeichert – bitte pruefen. '+(e.code||e.message);retryAt=now()+1000;try{notify(message,e);}catch(_){} }
 function startSync(){const s=state(),fingerprint=JSON.stringify(s);if(fingerprint===last)return null;if(s.ceremony){last=fingerprint;return null;}
  const task=controller.act('careSync');const tracked=task.then(()=>{last=JSON.stringify(state());message='';retryAt=0;}).catch(e=>{note(e);throw e;}).finally(()=>{if(pending===tracked)pending=null;});pending=tracked;tracked.catch(()=>{});return tracked;
 }
 async function ensureCurrent(){if(!supported||!controller||dialog||!canSync())return false;if(pending){await pending;return true;}const task=startSync();if(!task)return false;await task;return true;}
 function poll(){if(!supported||!controller||dialog||pending||controller.busy||now()<retryAt||!canSync())return false;try{return !!startSync();}catch(e){note(e);return false;}}
 async function end(kind,keep,{confirmed=false,box=0,expectedLife=null}={}){if(!supported||!controller){note(Object.assign(Error('WASM'),{code:'NATIVE_LIFECYCLE_UNAVAILABLE'}));return false;}try{if(expectedLife===null&&!state().initialized)await ensureCurrent();const s=state();await controller.act('careEnd',kind,keep,expectedLife===null?s.token:expectedLife,confirmed,box);last=JSON.stringify(state());message='';try{mod.onSfx?.(8);}catch(_){}return true;}catch(e){note(e);return false;}}
 function close(){if(controller?.busy)return;if(dialog){dialog.remove();dialog=null;}}

async function openEnd(kind,box=globalThis.TPBoxes?.state.box||0){
 if(!['farewell','release'].includes(kind)||dialog||opening||controller?.busy)return false;
 opening=true;
 try{
  if(!supported)error('NATIVE_LIFECYCLE_UNAVAILABLE');
  await ensureCurrent();
  const s=state(),v=controller.read();
  if(!s.snapshot||s.ceremony||v.active===null)return false;
  const doc=globalThis.document,host=doc.getElementById('tp-game-shell');
  if(!host)error('DIALOG_HOST_MISSING');
  const node=(tag,text)=>{
   const n=doc.createElement(tag);
   if(text!==undefined)n.textContent=text;
   return n;
  };
  if(typeof hubDexDesignTokens==='function')
   for(const [key,value]of Object.entries(hubDexDesignTokens()))
    host.style?.setProperty?.(key,value);
  const root=node('section');
  root.className='tp-f4-care-dialog';
  root.setAttribute('role','dialog');
  root.setAttribute('aria-modal','true');
  root.setAttribute('aria-label','Pflege beenden');
  root.setAttribute('data-ui01-care','true');
  root.setAttribute('data-care-id',String(v.active));
  const species=nameForDex(s.snapshot.dex);
  const title=(s.snapshot.nickname?s.snapshot.nickname+' ('+species+')':species)+
   (s.snapshot.shiny?' · Schillernd':'')+' · Lv. '+s.snapshot.level;
  const head=node('header');head.className='tp-f4-care-head';
  const heading=node('h2',kind==='farewell'?'Abschied':'Pflege beenden');
  const frame=node('div');frame.className='tp-f4-care-frame';
  frame.setAttribute('aria-hidden','true');
  for(const name of [
   'tp-pokedex-display tp-pokedex-display-left',
   'tp-pokedex-display tp-pokedex-display-right',
   'tp-pokedex-spine'
  ]){
   const part=node('span');part.className=name;
   part.setAttribute('aria-hidden','true');frame.append(part);
  }
  const subject=node('div');subject.className='tp-f4-care-subject';
  const card=node('div');card.className='tp-f4-care-subject-card';
const portrait=node('div');portrait.className='tp-f4-care-portrait';
portrait.setAttribute('role','img');portrait.setAttribute('aria-label',title);
const fallback=()=>{
 const symbol=node('span');
 symbol.innerHTML='<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#315b83" stroke-width="2">'+
  '<circle cx="12" cy="12" r="9"/><path d="M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3"/></svg>';
 portrait.append(symbol);
};
try{
 if(typeof currentSprite==='undefined'||!currentSprite||
    typeof frameImageData!=='function'||typeof TPAct==='undefined'){
  fallback();
 }else{
  const image=frameImageData(currentSprite,TPAct.idle,0);
  if(!image?.data||!image.width||!image.height){fallback();}
  else{
   let left=image.width,top=image.height,right=-1,bottom=-1;
   for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)
    if(image.data[(y*image.width+x)*4+3]){
     left=Math.min(left,x);right=Math.max(right,x);
     top=Math.min(top,y);bottom=Math.max(bottom,y);
    }
   const source=node('canvas');source.width=image.width;source.height=image.height;
   const sourceContext=source.getContext?.('2d');
   if(!sourceContext||right<left){fallback();}
   else{
    sourceContext.putImageData(image,0,0);
    const canvas=node('canvas');canvas.width=96;canvas.height=96;
    const context=canvas.getContext('2d');context.imageSmoothingEnabled=false;
    const width=right-left+1,height=bottom-top+1;
    const scale=Math.min(88/width,88/height);
    context.drawImage(source,left,top,width,height,
     (96-width*scale)/2,(96-height*scale)/2,width*scale,height*scale);
    portrait.append(canvas);
   }
  }
 }
}catch(_){fallback();}
  const displayName=s.snapshot.nickname||species;
  const nameLine=node('h3',displayName+(s.snapshot.shiny?' ✦':''));
  const stats=node('div');stats.className='tp-f4-care-stats';
  const bond=node('span');bond.className='tp-f4-care-bond';
  const heart=node('span');heart.setAttribute('aria-hidden','true');
  heart.innerHTML='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#963c45" stroke-width="2">'+
   '<path d="M12 21 3 12C-2 5 7 0 12 6c5-6 14-1 9 6Z"/></svg>';
  const bondValue=Number.isInteger(s.snapshot.data?.bond)?String(s.snapshot.data.bond):'—';
  bond.setAttribute('aria-label','Bindung '+bondValue);
  bond.append(heart,node('span',bondValue));
  stats.append(node('span','Lv. '+s.snapshot.level),bond);
  card.append(portrait,nameLine,stats);
  subject.append(card);

  const actions=node('div');actions.className='tp-f4-care-actions';
  const decision=node('div');decision.className='tp-f4-care-decision';
  const question=node('div');question.className='tp-f4-care-question';
  question.setAttribute('role','group');
  question.setAttribute('aria-label','Freilassen bestätigen');
  question.hidden=true;
  const info=node('p');info.className='tp-f4-care-error';
  info.setAttribute('role','status');
  const warning=node('p','Freilassen ist endgültig!');
  warning.className='tp-f4-care-warning';
  warning.id='tp-f4-care-warning';
  root.setAttribute('aria-describedby',warning.id);

  let confirming=false;
  const buttons=[];
  const button=(label,action,target,cls)=>{
   const b=node('button',label);b.type='button';b.className=cls||'';
   b.addEventListener('click',action);buttons.push(b);target.append(b);return b;
  };
  const showQuestion=shown=>{
   if(controller.busy)return;
   confirming=shown;
   decision.hidden=shown;question.hidden=!shown;
   root.setAttribute('data-care-confirm',String(shown));
   heading.textContent=shown?'Sicher?':kind==='farewell'?'Abschied':'Pflege beenden';
   if(shown)noButton.focus();else backButton.focus();
  };
  const back=()=>{
   if(controller.busy)return;
   if(confirming){showQuestion(false);return;}
   close();
   globalThis.TPAppMenu?.close?.();
  };
  const backButton=button('Zurück',back,head,'tp-f4-care-back');
  head.append(heading);

  const finish=async keep=>{
   if(controller.busy||(!keep&&!confirming))return;
   buttons.forEach(b=>b.disabled=true);
   const ok=await end(kind,keep,{
    confirmed:!keep,expectedLife:s.token,box
   });
   if(ok)close();
   else{
    buttons.forEach(b=>b.disabled=false);
    info.textContent=message;
    keepButton.disabled=M.summary(controller.read()).stored>=M.summary(controller.read()).capacity;
   }
  };
  const keepButton=button(
   kind==='farewell'?'In Sammlung behalten':'In Box verschieben',
   ()=>finish(true),decision,'tp-f4-care-keep'
  );
  keepButton.disabled=M.summary(v).stored>=M.summary(v).capacity;
  button(
   kind==='farewell'?'Endgueltig verabschieden':'Freilassen',
   ()=>showQuestion(true),decision,'tp-f4-care-danger'
  );
  const yesButton=button('Ja',()=>finish(false),question,'tp-f4-care-yes');
  yesButton.setAttribute('aria-describedby',warning.id);
  const noButton=button('Nein',()=>showQuestion(false),question,'tp-f4-care-no');
  actions.append(decision,question,info);
  if(keepButton.disabled)
   info.textContent='Boxen voll – Behalten erst nach dem Freigeben eines Platzes moeglich.';
  root.append(head,frame,subject,actions,warning);
  root.addEventListener('keydown',e=>{
   if(e.key==='Escape'){
    e.preventDefault();e.stopPropagation?.();back();return;
   }
   if(e.key!=='Tab'||typeof root.querySelectorAll!=='function')return;
   const nodes=Array.from(root.querySelectorAll('button:not(:disabled)'))
    .filter(n=>typeof n.getClientRects!=='function'||n.getClientRects().length>0);
   const first=nodes[0],last=nodes[nodes.length-1];
   if(e.shiftKey&&doc.activeElement===first){e.preventDefault();last?.focus();}
   else if(!e.shiftKey&&doc.activeElement===last){e.preventDefault();first?.focus();}
  });
  dialog=root;host.append(root);backButton.focus();return true;
 }catch(e){note(e);return false;}
 finally{opening=false;}
}

return Object.freeze({supported,nativeActions,reconcile,ensureCurrent,poll,end,openEnd,close,bind(c){if(controller)error('ALREADY_BOUND');controller=c;},get ready(){return supported&&!!last&&!message&&!controller?.busy;},get dialogOpen(){return !!dialog;},get message(){return message;}});
}
return Object.freeze({create});
});
