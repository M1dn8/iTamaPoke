/* P05: whole-save wild result adapter. No UI or automatic reward polling. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPCollectionWildResult=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function fail(code){throw Object.assign(new Error(code),{code});}
 function create(mod,M,baseBridge,reconcile=s=>s){
  const supported=[
   '_tp_wt_view','_tp_wt_result_begin',
   '_tp_wt_result_apply','_tp_wt_result_finish'
  ].every(name=>typeof mod[name]==='function');
  const call=(name,args=[])=>mod.ccall(
   name,'number',args.map(()=>'number'),args
  );
  const view=()=>JSON.parse(mod.ccall('tp_wt_view','string',[],[]));
  let resultToken=0,controller=null;

  const bridge=Object.freeze({
   read:()=>baseBridge.read(),
   begin(context){
    if(context!=='wildResult')return baseBridge.begin(context);
    if(!supported)return 0;
    const token=call('tp_wt_result_begin');
    if(token)resultToken=token;
    return token;
   },
   stage:(token,data)=>baseBridge.stage(token,data),
   finish(token,commit){
    if(resultToken&&token===resultToken){
     const result=call('tp_wt_result_finish',[token,commit]);
     if(result===1)resultToken=0;
     return result;
    }
    return baseBridge.finish(token,commit);
   }
  });

  const nativeActions=Object.freeze({
   wildPrepare(before,token){return reconcile(before,token);},
   wildResult(before,token){
    if(!supported)fail('NATIVE_WILD_RESULT_UNAVAILABLE');
    before=reconcile(before,token);
    M.validate(before);
    const state=view();
    if(!state.live||!state.resultPending||
       !Array.isArray(state.members))fail('WILD_RESULT_NOT_PENDING');

    const ids=before.team.length?before.team:
      before.active===null?[]:[before.active];
    if(!ids.length||ids.length>6||state.count!==ids.length||
       state.members.length!==ids.length||
       state.members.some((m,i)=>m.id!==ids[i]||
         !before.mons.some(p=>p.id===m.id&&p.dex===m.dex))){
     fail('WILD_ROSTER_CHANGED');
    }

    const winner=state.winnerId;
    if(!Number.isSafeInteger(winner)||winner<0||
       (winner!==0&&!ids.includes(winner))){
     fail('INVALID_WILD_WINNER');
    }
    const careBefore=before.active===null?null:
      before.mons.find(m=>m.id===before.active);

    if(call('tp_wt_result_apply',[token,winner])!==1){
     fail('NATIVE_WILD_RESULT_REFUSED');
    }

    let after=reconcile(before,token);
    M.validate(after);
    const careAfter=after.active===null?null:
      after.mons.find(m=>m.id===after.active);
    if(before.active!==after.active||!!careBefore!==!!careAfter){
     fail('CARE_IDENTITY_CHANGED');
    }
    if(careBefore){
     const expected=winner===before.active?
       Math.min(100,careBefore.level+1):careBefore.level;
     if(careAfter.level!==expected)fail('CARE_REWARD_MISMATCH');
    }

    if(winner!==0&&winner!==before.active){
     after=M.grantStoredBattleLevel(after,winner);
    }
    return after;
   }
  });

  return Object.freeze({
   bridge,nativeActions,supported,
   bind(c){
    if(controller)fail('ALREADY_BOUND');
    controller=c;
   },
   complete(){
    if(!controller)fail('COLLECTION_NOT_BOUND');
    return controller.act('wildResult');
   }
  });
 }
 return Object.freeze({create});
});
