/* P05b: combined team-arena result through the whole-save controller. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPCollectionArenaResult=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function fail(code){throw Object.assign(new Error(code),{code});}
 const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;

 function create(mod,M,baseBridge,reconcile=s=>s){
  const supported=[
   '_tp_wt_view','_tp_wt_arena_result_begin',
   '_tp_wt_arena_result_apply','_tp_wt_arena_result_finish'
  ].every(name=>typeof mod[name]==='function');
  const call=(name,args=[])=>mod.ccall(
   name,'number',args.map(()=>'number'),args
  );
  const view=()=>JSON.parse(mod.ccall('tp_wt_view','string',[],[]));
  let lease=null,controller=null;

  function terminal(s){
   return s&&s.live===1&&s.arena===true&&s.seriesDone===true&&
    s.resultDone===false&&typeof s.won==='boolean'&&
    integer(s.region,0,1)&&integer(s.session,1,0x7ffffffe);
  }

  const bridge=Object.freeze({
   read:()=>baseBridge.read(),
   begin(context){
    if(context!=='arenaResult')return baseBridge.begin(context);
    if(!supported||lease)return 0;
    const s=view();
    if(!terminal(s))return 0;
    const token=call('tp_wt_arena_result_begin',[s.region,s.session]);
    if(token)lease={token,region:s.region,session:s.session};
    return token;
   },
   stage:(token,data)=>baseBridge.stage(token,data),
   finish(token,commit){
    if(lease&&token===lease.token){
     const result=call('tp_wt_arena_result_finish',[
      lease.region,lease.session,token,commit
     ]);
     if(result===1)lease=null;
     return result;
    }
    return baseBridge.finish(token,commit);
   }
  });

  const nativeActions=Object.freeze({
   arenaPrepare(before,token){return reconcile(before,token);},
   arenaResult(before,token){
    if(!supported||!lease||lease.token!==token)
     fail('NATIVE_ARENA_RESULT_UNAVAILABLE');

    before=reconcile(before,token);
    M.validate(before);
    const s=view();
    if(!terminal(s)||s.region!==lease.region||s.session!==lease.session)
     fail('ARENA_RESULT_CHANGED');

    const ids=before.team.length?before.team:
     before.active===null?[]:[before.active];
    if(!ids.length||ids.length>6||s.count!==ids.length||
       !Array.isArray(s.members)||s.members.length!==ids.length||
       !integer(s.opponentCount,1,6))
     fail('ARENA_ROSTER_CHANGED');

    let total=0;
    for(let i=0;i<ids.length;i++){
     const member=s.members[i],mon=before.mons.find(p=>p.id===ids[i]);
     if(!member||!mon||member.id!==ids[i]||member.dex!==mon.dex||
        !integer(member.level,1,100)||
        !integer(member.levelGains,0,100-member.level)||
        (member.id!==before.active&&member.level!==mon.level))
      fail('ARENA_ROSTER_CHANGED');
     total+=member.levelGains;
    }
    if(total>s.opponentCount)fail('INVALID_ARENA_LEVEL_GAINS');

    const careBefore=before.active===null?null:
     before.mons.find(m=>m.id===before.active);
    const careGains=s.members.find(m=>m.id===before.active)?.levelGains||0;
    const outcome=call('tp_wt_arena_result_apply',[
     lease.region,lease.session,token
    ]);
    if(s.won?![1,2].includes(outcome):outcome!==3)
     fail('NATIVE_ARENA_RESULT_REFUSED');

    let after=reconcile(before,token);
    M.validate(after);
    const careAfter=after.active===null?null:
     after.mons.find(m=>m.id===after.active);

    if(before.active!==after.active||!!careBefore!==!!careAfter)
     fail('CARE_IDENTITY_CHANGED');
    if(careBefore){
     if(careAfter.dex!==careBefore.dex||
        careAfter.shiny!==careBefore.shiny||
        careAfter.origin!==careBefore.origin||
        careAfter.data.lifeToken!==careBefore.data.lifeToken)
      fail('CARE_IDENTITY_CHANGED');
     if(careAfter.level!==Math.min(100,careBefore.level+careGains))
      fail('CARE_REWARD_MISMATCH');
    }

    for(const member of s.members){
     if(member.id===before.active)continue;
     for(let gain=0;gain<member.levelGains;gain++)
      after=M.grantStoredBattleLevel(after,member.id);
    }
    M.validate(after);
    return after;
   }
  });

  return Object.freeze({
   bridge,nativeActions,supported,
   bind(c){
    if(controller)fail('ALREADY_BOUND');
    controller=c;
   },
   prepare(){
    if(!controller)fail('COLLECTION_NOT_BOUND');
    return controller.act('arenaPrepare');
   },
   complete(){
    if(!controller)fail('COLLECTION_NOT_BOUND');
    return controller.act('arenaResult');
   }
  });
 }
 return Object.freeze({create});
});
