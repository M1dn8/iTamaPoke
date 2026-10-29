/* P06 admission handover through the existing collection controller.
 * reserve() is for trusted native-result actions with an existing token.
 * No capture migration, encounter lock or dialog is activated here.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPCollectionAdmission=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const enc=new TextEncoder(),dec=new TextDecoder('utf-8',{fatal:true});
 function fail(code){throw Object.assign(Error(code),{code});}
 function create(mod,M,A,reconcile=s=>s){
  const supported=!!A&&[
   'tp_f4_admission_size','tp_f4_admission_ptr',
   'tp_f4_admission_pending','tp_f4_admission_stage','tp_f4_admission_begin'
  ].every(name=>typeof mod['_'+name]==='function');
  const call=(name,args=[])=>mod.ccall(
   name,'number',args.map(()=>'number'),args
  );
  let controller=null,published=null,attemptedTicket=0;

  function load(){
   if(!supported)fail('ADMISSION_CORE_UNAVAILABLE');
   const size=call('tp_f4_admission_size');
   if(size===0)return A.create();
   if(!Number.isInteger(size)||size<1||size>A.MAX_BYTES)
    fail('ADMISSION_TRANSPORT_INVALID');
   const ptr=call('tp_f4_admission_ptr');
   if(!Number.isSafeInteger(ptr)||ptr<=0||ptr+size>mod.HEAPU8.length)
    fail('ADMISSION_POINTER_INVALID');
   const state=A.decode(dec.decode(mod.HEAPU8.slice(ptr,ptr+size)));
   const pending=call('tp_f4_admission_pending');
   if(pending!==(state.pending===null?0:1))
    fail('ADMISSION_PENDING_MISMATCH');
   return state;
  }
  function stage(token,state,completed=null){
   const bytes=enc.encode(A.encode(state));
   const ptr=mod._malloc(bytes.length);
   if(!ptr)fail('ALLOCATION_FAILED');
   try{
    mod.HEAPU8.set(bytes,ptr);
    let name='tp_f4_admission_stage';
     let argument=state.pending===null?0:1;
     if(state.pending===null&&completed?.kind==='join'&&
        completed.pokemon.dex===145&&
        typeof mod._tp_zpd_ticket==='function'&&
        call('tp_zpd_ticket')===completed.ticket){
      if(typeof mod._tp_zpd_admission_stage!=='function')
       fail('ADMISSION_JOURNAL_CORE_UNAVAILABLE');
      name='tp_zpd_admission_stage';
      argument=completed.ticket;
     }
     const storyDex=completed?.source==='story:kanto:articuno'?144:
      completed?.source==='story:kanto:moltres'?146:
      completed?.source==='story:kanto:mewtwo'?150:
      completed?.source==='story:kanto:mew'?151:0;
     if(state.pending===null&&completed?.kind==='join'&&storyDex){
      if(completed.pokemon.dex!==storyDex||
         typeof mod._tp_story_ticket!=='function'||
         typeof mod._tp_story_admission_stage!=='function')
       fail('ADMISSION_JOURNAL_CORE_UNAVAILABLE');
      if(call('tp_story_ticket',[storyDex])!==completed.ticket)
       fail('ADMISSION_STORY_TICKET_MISMATCH');
      if(call('tp_story_admission_stage',[
       token,storyDex,ptr,bytes.length,completed.ticket
      ])!==1)fail('ADMISSION_STAGE_REFUSED');
      return;
     }
     if(call(name,[token,ptr,bytes.length,argument])!==1)
      fail('ADMISSION_STAGE_REFUSED');
   }finally{mod._free(ptr);}
  }
  function read(){
   // Never publish native tentative bytes during a durable write.
   if(controller?.busy){
    if(published===null)fail('BUSY');
    return published;
   }
   published=load();return published;
  }
  function reserve(token,record){
   if(!controller||!controller.busy||!Number.isInteger(token)||token<1)
    fail('ADMISSION_TRANSACTION_REQUIRED');
   const before=load();
   if(published===null)published=before;
   const next=A.queue(before,record);
   stage(token,next);
   return next;
  }
  const nativeActions=Object.freeze({
   admissionComplete(before,token,choice={}){
    before=reconcile(before,token);
    M.validate(before);
    const current=load();
    if(published===null)published=current;
    const result=A.complete(current,before,choice);
    stage(token,result.admission,current.pending);
    return result.collection;
   }
  });
  return Object.freeze({
   supported,nativeActions,read,reserve,
   autoAttempted:ticket=>attemptedTicket===ticket,
   check(record){
    const next=A.queue(read(),record);
    if(enc.encode(A.encode(next)).length>A.MAX_BYTES-128)
     fail('ADMISSION_TOO_LARGE');
   },
   wrapBridge(base){
    return Object.freeze({
     read:()=>base.read(),
     begin(context){
      return context==='admissionComplete'?
       (supported?call('tp_f4_admission_begin'):0):base.begin(context);
     },
     stage:(token,data)=>base.stage(token,data),
     finish:(token,commit)=>base.finish(token,commit)
    });
   },
   bind(c){if(controller)fail('ALREADY_BOUND');controller=c;},
   async complete(choice={}){
    if(!controller)fail('COLLECTION_NOT_BOUND');
    if(controller.busy)fail('BUSY');
    if(controller.blocked)fail('RELOAD_REQUIRED');
    const current=read();
    if(!current.pending)fail('NO_PENDING_ADMISSION');
    attemptedTicket=current.pending.ticket;
    return controller.act('admissionComplete',choice);
   }
  });
 }
 return Object.freeze({create});
});
