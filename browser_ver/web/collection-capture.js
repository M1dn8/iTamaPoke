/* F4-B3a: atomic wild captures; care identity/endings remain unchanged. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TPCollectionCapture=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function create(mod,model,baseBridge,notify=()=>{},reconcile=(s)=>s){
 let controller=null,pendingToken=0,error='',lastKey='',lastBattle=-1,statusCache=null,successMessage='';
 const supported=['_tp_f4_capture_begin','_tp_f4_capture_attempt','_tp_f4_capture_finish','_tp_f4_capture_snapshot','_tp_f4_capture_battle_id','_tp_f4_store_size','_tp_f4_store_ptr'].every(name=>typeof mod[name]==='function');
 const enc=new TextEncoder();const call=(name,args=[])=>mod.ccall(name,'number',args.map(()=> 'number'),args);
 const snapshot=()=>JSON.parse(mod.ccall('tp_f4_capture_snapshot','string',[],[]));
 const bridge=Object.freeze({read:()=>baseBridge.read(),begin(context){if(context==='wildCapture'){if(!supported)return 0;const token=call('tp_f4_capture_begin');if(token)pendingToken=token;return token;}return baseBridge.begin();},stage:(token,data)=>baseBridge.stage(token,data),finish(token,commit){if(pendingToken===token){const result=call('tp_f4_capture_finish',[token,commit]);if(result===1)pendingToken=0;return result;}return baseBridge.finish(token,commit);}});
 const nativeActions=Object.freeze({wildCapture(before,token,box=0){
  before=reconcile(before,token);
  const preview=snapshot();if(!preview)throw Error('Kein fangbares wildes Pokemon.');
  const candidate=model.catchWild(before,preview,box);
  // Reserve space for the actual timestamp before consuming any catch roll.
  if(enc.encode(model.encode(candidate)).length>262080)throw Object.assign(Error('Sammlungsdaten zu gross; kein Fangversuch ausgefuehrt.'),{code:'COLLECTION_TOO_LARGE'});
  const result=call('tp_f4_capture_attempt',[token]);if(result<0)throw Error('Fangzustand hat sich geaendert.');
  const after=reconcile(before,token);return result===1?model.catchWild(after,snapshot(),box):after;
 }});
 function status(){
  if(!supported)return {allowed:false,message:'Aktuellen WASM-Build laden.'};
  if(!controller)return {allowed:false,message:'Sammlung nicht bereit.'};
  if(controller.busy)return statusCache||{allowed:false,message:'Speichern ...'};
  try{const battle=call('tp_f4_capture_battle_id'),size=call('tp_f4_store_size'),ptr=size>0?call('tp_f4_store_ptr'):0,key=ptr+':'+size;
   if(battle!==lastBattle){lastBattle=battle;error='';successMessage='';lastKey='';}
   if(key!==lastKey||!statusCache){const s=controller.read(),used=model.summary(s).stored;let allowed=used<200,message=used>=200?'Boxen voll – kein Fang moeglich.':'';if(allowed){const preview=snapshot();if(!preview){allowed=false;message='Kein fangbares wildes Pokemon.';}else if(enc.encode(model.encode(model.catchWild(s,preview,0))).length>262080){allowed=false;message='Sammlungsdaten voll – kein Fangversuch.';}}statusCache={allowed,message,stored:used};lastKey=key;}
   return {...statusCache,message:error||statusCache.message};
  }catch(_){return {allowed:false,message:'Sammlung pruefen – kein Fang moeglich.'};}
 }
 async function tryCatch(box=0){
  if(!controller||controller.busy)return false;const s=status();if(!s.allowed){error=s.message;try{notify(error);}catch(_){}return false;}
  error='';try{await controller.act('wildCapture',box);lastKey='';const success=call('tp_battle_catch_success')!==0;if(success){const s=controller.read(),id=s.mons[s.mons.length-1]?.id,b=s.boxes.find(b=>b.slots.includes(id));successMessage=b?'Abgelegt: '+b.name:'Gefangen und gespeichert.';}try{if(typeof mod.onSfx==='function')mod.onSfx(success?12:13);}catch(_){}return true;}
  catch(e){if(e.code==='COLLECTION_TOO_LARGE'&&statusCache)statusCache={...statusCache,allowed:false};error=e.code==='COLLECTION_TOO_LARGE'?'Sammlungsdaten voll – kein Fangversuch.':e.code==='BOXES_FULL'?'Boxen voll – kein Fangversuch ausgefuehrt.':e.code==='RELOAD_REQUIRED'?'Bitte neu laden – Speicherbestaetigung pruefen.':'Speichern fehlgeschlagen – Fang erneut versuchen.';try{notify(error,e);}catch(_){}return false;}
 }
 return Object.freeze({bridge,nativeActions,status,tryCatch,bind(c){if(controller)throw Error('Bereits verbunden');controller=c;},get message(){return successMessage||error;},get error(){return error;}});
}
return Object.freeze({create});
});
