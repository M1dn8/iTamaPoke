/* F4-B2: connect the actual immutable model to the native whole-Pet/store
 * checkpoint and the caller's atomic whole-save write. No gameplay hooks.
 */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TPCollectionPersistence=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const MAX=262144,encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true});
const operations=new Set(['attachCurrent','syncCurrent','catchWild','endCare','renameBox','renamePokemon','moveBox','selectTeam','unselectTeam','moveTeam','releaseStored']);
class PersistenceError extends Error{constructor(code){super(code);this.name='CollectionPersistenceError';this.code=code;}}
const fail=code=>{throw new PersistenceError(code);};
function equal(a,b){return a.length===b.length&&a.every((v,i)=>v===b[i]);}
function create({model,bridge,acquire,exportSave,validateSave,persist,nativeActions={}}){
 for(const fn of [model?.decode,model?.encode,model?.create,bridge?.read,bridge?.begin,bridge?.stage,bridge?.finish,acquire,exportSave,validateSave,persist])if(typeof fn!=='function')fail('INVALID_ADAPTER');
 let busy=false,blocked=false,published=null;
 function load(){const raw=bridge.read();return raw===null?model.create():model.decode(decoder.decode(raw));}
 function read(){if(busy){if(published===null)fail('BUSY');return published;}published=load();return published;}
 async function execute(operation,args,nativeAction){
  if(blocked)fail('RELOAD_REQUIRED');if(busy)fail('BUSY');
  if(nativeAction){if(!Object.prototype.hasOwnProperty.call(nativeActions,operation)||typeof nativeActions[operation]!=="function")fail('UNKNOWN_OPERATION');}
  else if(!operations.has(operation))fail('UNKNOWN_OPERATION');
  busy=true;let release=null,token=0,durable=false;
  try{
   release=acquire(nativeAction?operation:null);if(typeof release!=='function')fail('GATE_NOT_ACQUIRED');
   published=load();let candidate,data;
   const encodeCandidate=()=>{const encoded=model.encode(candidate);data=encoder.encode(encoded);if(!data.length||data.length>MAX)fail('COLLECTION_TOO_LARGE');};
   if(!nativeAction){candidate=model[operation](published,...args);encodeCandidate();}
   token=bridge.begin(nativeAction?operation:null);if(!Number.isInteger(token)||token<1||token>0x7fffffff){token=0;fail('NATIVE_BEGIN_REFUSED');}
   if(nativeAction){candidate=nativeActions[operation](published,token,...args);encodeCandidate();}
   if(bridge.stage(token,data)!==1)fail('NATIVE_STAGE_REFUSED');
   const raw=exportSave();const bytes=Uint8Array.from(raw),parsed=validateSave(bytes),field=parsed.values.get('f4col');
   if(!field||field.type!==3||!equal(Uint8Array.from(field.value),data))fail('EXPORT_COLLECTION_MISMATCH');
   if(await persist(bytes)!==true)fail('WRITE_NOT_CONFIRMED');
   durable=true;published=candidate;
   if(bridge.finish(token,1)!==1)fail('NATIVE_CONFIRM_FAILED');token=0;
   return published;
  }catch(error){
   if(durable){blocked=true;}else if(token){try{if(bridge.finish(token,0)!==1)blocked=true;}catch(_){blocked=true;}}
   if(blocked){const fatal=new PersistenceError('RELOAD_REQUIRED');fatal.cause=error;throw fatal;}
   throw error;
  }finally{
   // Failed rollback or post-durability confirmation: keep all gates held.
   // Reload will read the atomically committed old/new complete save.
   if(!blocked){busy=false;if(release)release();}
  }
 }
 const apply=(operation,...args)=>execute(operation,args,false);
 const act=(operation,...args)=>execute(operation,args,true);
 return Object.freeze({read,apply,act,get busy(){return busy;},get blocked(){return blocked;}});
}
function nativeBridge(mod){
 const call=(name,args=[])=>mod.ccall(name,'number',args.map(()=> 'number'),args);
 return Object.freeze({
  read(){const size=call('tp_f4_store_size');if(size===0)return null;if(!Number.isInteger(size)||size<0||size>MAX)fail('COLLECTION_TRANSPORT_INVALID');const ptr=call('tp_f4_store_ptr');if(!Number.isSafeInteger(ptr)||ptr<=0||ptr+size>mod.HEAPU8.length)fail('COLLECTION_POINTER_INVALID');return mod.HEAPU8.slice(ptr,ptr+size);},
  begin(){return call('tp_f4_store_begin');},
  stage(token,data){if(!(data instanceof Uint8Array)||!data.length||data.length>MAX)fail('COLLECTION_TOO_LARGE');const ptr=mod._malloc(data.length);if(!ptr)fail('ALLOCATION_FAILED');try{mod.HEAPU8.set(data,ptr);return call('tp_f4_store_stage',[token,ptr,data.length]);}finally{mod._free(ptr);}},
  finish(token,commit){return call('tp_f4_store_finish',[token,commit]);}
 });
}
return Object.freeze({create,nativeBridge,PersistenceError,MAX});
});
