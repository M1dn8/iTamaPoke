/* P06 story/result adapter. All writes use the existing collection controller.
 * Native code owns combat and entitlement; models own candidate consistency.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPCollectionZapdos=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function fail(code){throw Object.assign(Error(code),{code});}
 function create(mod,M,Z,A,admission,base,reconcile=s=>s){
  const supported=!!Z&&!!A&&!!admission?.supported&&[
   'tp_zpd_step','tp_zpd_ticket','tp_zpd_advance','tp_zpd_start',
   'tp_zpd_get','tp_zpd_snapshot','tp_zpd_result_begin',
   'tp_zpd_result_apply','tp_zpd_result_finish','tp_wt_view',
   'tp_wt_stage_begin','tp_wt_stage_entry'
  ].every(name=>typeof mod['_'+name]==='function');
  const call=(name,args=[])=>mod.ccall(
   name,'number',args.map(()=>'number'),args
  );
  const json=name=>JSON.parse(mod.ccall(name,'string',[],[]));
  let controller=null,published=null,resultToken=0;
  function load(){
   if(!supported)fail('ZAPDOS_CORE_UNAVAILABLE');
   return Z.fromNative(1,call('tp_zpd_step'),call('tp_zpd_ticket'));
  }
  function read(){
   if(controller?.busy){
    if(published===null)fail('BUSY');
    return published;
   }
   published=load();return published;
  }
  function guard(){
   if(!controller)fail('COLLECTION_NOT_BOUND');
   if(controller.blocked)fail('RELOAD_REQUIRED');
   if(controller.busy)fail('BUSY');
   if(!supported)fail('ZAPDOS_CORE_UNAVAILABLE');
  }
  function snapshotBefore(before){
   const story=load(),waiting=admission.read();
   if(published===null)published=story;
   Z.validateProfile(story,waiting,before);
   return {story,waiting};
  }
  const bridge=Object.freeze({
   read:()=>base.read(),
   begin(context){
    if(context!=='zapdosResult')return base.begin(context);
    if(!supported)return 0;
    const token=call('tp_zpd_result_begin');
    if(token)resultToken=token;
    return token;
   },
   stage:(token,data)=>base.stage(token,data),
   finish(token,commit){
    if(resultToken&&token===resultToken){
     const result=call('tp_zpd_result_finish',[token,commit]);
     if(result===1)resultToken=0;
     return result;
    }
    return base.finish(token,commit);
   }
  });
  const nativeActions=Object.freeze({
   zapdosAdvance(before,token,action){
    before=reconcile(before,token);M.validate(before);
    const {story}=snapshotBefore(before);
    const next=Z.advance(story,action);
    if(call('tp_zpd_advance',[token,story.step])!==1)
     fail('NATIVE_ZAPDOS_ADVANCE_REFUSED');
    if(Z.encode(load())!==Z.encode(next))
     fail('ZAPDOS_ADVANCE_MISMATCH');
    return before;
   },
   zapdosPrepare(before,token){
    before=reconcile(before,token);M.validate(before);
    const {story,waiting}=snapshotBefore(before);
    if(!Z.view(story,waiting).canBattle)fail('ZAPDOS_NOT_READY');
    return before;
   },
   zapdosResult(before,token){
    before=reconcile(before,token);M.validate(before);
    const {story,waiting}=snapshotBefore(before);
    if(call('tp_zpd_get',[0])!==1||call('tp_zpd_get',[1])!==1)
     fail('ZAPDOS_RESULT_NOT_PENDING');
    const roster=json('tp_wt_view');
    const ids=before.team.length?before.team:
     before.active===null?[]:[before.active];
    if(!roster.live||roster.arena||!ids.length||ids.length>6||
       roster.count!==ids.length||!Array.isArray(roster.members)||
       roster.members.length!==ids.length||
       roster.members.some((m,i)=>m.id!==ids[i]||
        !before.mons.some(p=>p.id===m.id&&p.dex===m.dex)))
     fail('ZAPDOS_ROSTER_CHANGED');
    const won=call('tp_zpd_get',[3])===1;
    if(!!roster.won!==won||
       (won?!ids.includes(roster.winnerId):roster.winnerId!==0))
     fail('INVALID_ZAPDOS_WINNER');

    let expected=story,ticket=0;
    if(won){
     const pokemon=json('tp_zpd_snapshot');
     const candidates=Z.confirmVictory(story,waiting,pokemon);
     const queued=admission.reserve(token,{
      kind:'join',source:Z.SOURCE,pokemon
     });
     if(A.encode(queued)!==A.encode(candidates.admission))
      fail('ZAPDOS_ADMISSION_CANDIDATE_MISMATCH');
     expected=candidates.story;ticket=expected.ticket;
    }
    if(call('tp_zpd_result_apply',[token,ticket])!==1)
     fail('NATIVE_ZAPDOS_RESULT_REFUSED');
    if(Z.encode(load())!==Z.encode(expected))
     fail('ZAPDOS_RESULT_MISMATCH');

    const after=reconcile(before,token);
    M.validate(after);
    if(after.active!==before.active||after.mons.length!==before.mons.length||
       before.mons.some(m=>!after.mons.some(
        n=>n.id===m.id&&n.dex===m.dex&&n.level===m.level
       )))
     fail('UNEXPECTED_ZAPDOS_COLLECTION_REWARD');
    return after;
   }
  });
  return Object.freeze({
   supported,bridge,nativeActions,read,
   bind(c){if(controller)fail('ALREADY_BOUND');controller=c;},
   view(){
    guard();
    const story=read(),waiting=admission.read();
    Z.validateProfile(story,waiting,controller.read());
    return Z.view(story,waiting);
   },
   advance(action){
    guard();Z.advance(read(),action);admission.read();
    return controller.act('zapdosAdvance',action);
   },
   prepare(){
    guard();
    if(!Z.view(read(),admission.read()).canBattle)fail('ZAPDOS_NOT_READY');
    return controller.act('zapdosPrepare');
   },
   complete(){
    guard();read();admission.read();
    if(call('tp_zpd_get',[0])!==1||call('tp_zpd_get',[1])!==1)
     fail('ZAPDOS_RESULT_NOT_PENDING');
    return controller.act('zapdosResult');
   }
  });
 }
 return Object.freeze({create});
});
