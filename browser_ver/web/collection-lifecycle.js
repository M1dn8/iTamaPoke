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
 async function openEnd(kind,box=globalThis.TPBoxes?.state.box||0){if(!['farewell','release'].includes(kind)||dialog||opening||controller?.busy)return false;opening=true;try{if(!supported)error('NATIVE_LIFECYCLE_UNAVAILABLE');await ensureCurrent();const s=state(),v=controller.read();if(!s.snapshot||s.ceremony||v.active===null)return false;
  const doc=globalThis.document,host=doc.getElementById('tp-game-shell');if(!host)error('DIALOG_HOST_MISSING');const node=(tag,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  const root=node('section');root.className='tp-f4-care-dialog';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Pflege beenden');root.style.cssText='position:absolute;inset:0;z-index:40;background:#f4f0e7;color:#273744;box-sizing:border-box;padding:20px;overflow:auto;font:15px/1.4 system-ui;touch-action:pan-y;';
  const species=nameForDex(s.snapshot.dex),title=(s.snapshot.nickname?s.snapshot.nickname+' ('+species+')':species)+(s.snapshot.shiny?' · Schillernd':'')+' · Lv. '+s.snapshot.level;
  root.append(node('h2',kind==='farewell'?'Abschied':'Pflege beenden'),node('p',title),node('p','Behalten verschiebt dasselbe Individuum in deine Sammlung. Endgueltiges Gehenlassen entfernt es aus deinem Besitz; historische Nachweise bleiben erhalten.'));
  if(kind==='release')root.append(node('p','Behalten erzeugt keine zusaetzlichen Abschieds- oder Ei-Boni.'));const buttons=[];
  const button=(label,action)=>{const b=node('button',label);b.type='button';b.style.cssText='display:block;width:100%;min-height:44px;margin:12px 0;padding:10px;border-radius:9px;border:1px solid #aeb7bc;background:#fff;color:#273744;font:inherit;';b.addEventListener('click',action);buttons.push(b);root.append(b);return b;};
  const finish=async keep=>{if(controller.busy)return;if(!keep&&!globalThis.confirm(title+' endgueltig '+(kind==='farewell'?'verabschieden':'freilassen')+'? Dieses Exemplar kann nicht zurueckgeholt werden.'))return;buttons.forEach(b=>b.disabled=true);const ok=await end(kind,keep,{confirmed:!keep,expectedLife:s.token,box});if(ok)close();else{buttons.forEach(b=>b.disabled=false);info.textContent=message;keepButton.disabled=M.summary(controller.read()).stored>=200;}};
  const keepButton=button(kind==='farewell'?'In Sammlung behalten':'Pflege beenden und behalten',()=>finish(true));keepButton.disabled=M.summary(v).stored>=200;button(kind==='farewell'?'Endgueltig verabschieden':'Endgueltig freilassen',()=>finish(false));const cancel=button('Abbrechen',close);const info=node('p',keepButton.disabled?'Boxen voll – Behalten erst nach dem Freigeben eines Platzes moeglich.':'');root.append(info);root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});dialog=root;host.append(root);cancel.focus();return true;
 }catch(e){note(e);return false;}finally{opening=false;}}
 return Object.freeze({supported,nativeActions,reconcile,ensureCurrent,poll,end,openEnd,close,bind(c){if(controller)error('ALREADY_BOUND');controller=c;},get ready(){return supported&&!!last&&!message&&!controller?.busy;},get dialogOpen(){return !!dialog;},get message(){return message;}});
}
return Object.freeze({create});
});
