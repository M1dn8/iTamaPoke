/* Journal seen boundary through the existing collection transaction. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPCollectionJournal=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const fail=code=>{throw Object.assign(Error(code),{code});};
 function create(mod,M){
  const supported=['tp_journal_unread_state','tp_journal_unread_mark']
   .every(name=>typeof mod['_'+name]==='function');
  let controller=null,published=null;
  function snapshot(){
   if(!supported)fail('JOURNAL_UNREAD_CORE_UNAVAILABLE');
   let value;
   try{
    value=JSON.parse(mod.ccall('tp_journal_unread_state','string',[],[]));
   }catch(_){fail('INVALID_JOURNAL_UNREAD');}
   if(!value||value.version!==1||
      !Number.isInteger(value.total)||value.total<0||value.total>0x7ffffffe||
      !Number.isInteger(value.seen)||value.seen<0||value.seen>value.total||
      !Number.isInteger(value.unread)||value.unread<0||value.unread>200||
      value.unread>value.total-value.seen||
      typeof value.initialized!=='boolean')
    fail('INVALID_JOURNAL_UNREAD');
   return Object.freeze({...value});
  }
  function guard(){
   if(!controller)fail('COLLECTION_NOT_BOUND');
   if(controller.blocked)fail('RELOAD_REQUIRED');
  }
  function read(){
   guard();
   if(controller.busy){
    if(published===null)fail('BUSY');
    return published;
   }
   published=snapshot();return published;
  }
  const nativeActions=Object.freeze({
   journalSeen(before,token,expectedTotal){
    M.validate(before);
    const current=snapshot();
    if(!Number.isInteger(expectedTotal)||expectedTotal<0||
       expectedTotal>current.total)fail('INVALID_JOURNAL_BOUNDARY');
    if(mod.ccall('tp_journal_unread_mark','number',
       ['number','number'],[token,expectedTotal])!==1)
     fail('NATIVE_JOURNAL_SEEN_REFUSED');
    if(snapshot().seen<expectedTotal)fail('JOURNAL_SEEN_MISMATCH');
    return before;
   }
  });
  async function acknowledge(expectedTotal){
   guard();
   if(controller.busy)fail('BUSY');
   const current=read();
   if(!Number.isInteger(expectedTotal)||expectedTotal<0||
      expectedTotal>current.total)fail('INVALID_JOURNAL_BOUNDARY');
   if(!current.initialized||expectedTotal>current.seen)
    await controller.act('journalSeen',expectedTotal);
   return read();
  }
  return Object.freeze({
   supported,nativeActions,read,acknowledge,
   bind(value){
    if(controller)fail('ALREADY_BOUND');
    controller=value;
   }
  });
 }
 return Object.freeze({create});
});
