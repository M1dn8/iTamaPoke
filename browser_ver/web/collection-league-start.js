/* P05c: validated collection handover for native league start/resume.
 * No UI entry, win rewards or Hall completion.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPCollectionLeagueStart=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true});
 const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 function fail(code){throw Object.assign(Error(code),{code});}
 function ids(s){return s.team.length?s.team:s.active===null?[]:[s.active];}
 function sameIds(a,b){return a.length===b.length&&a.every((v,i)=>v===b[i]);}

 function care(s,life){
  const m=s.mons.find(p=>p.id===s.active),p=life?.snapshot;
  if(!m||!life.valid||!life.initialized||!integer(life.token,1,0x7fffffff)||
     !p||m.dex!==p.dex||m.shiny!==p.shiny||
     m.data.lifeToken!==life.token||
     !integer(p.data?.ageMinutes,0,0xffffffff)||
     !['atk','def','spe'].every(k=>
      integer(p.data?.genes?.[k],0,255)&&
      m.data.genes?.[k]===p.data.genes[k]
     ))fail('LEAGUE_CARE_BINDING_CHANGED');
  return {m,p};
 }

 function roster(M,s,run,life,resume){
  M.validate(s);
  const current=resume?run.members.map(m=>m.id):ids(s);
  const c=care(s,life),binding=run.care;
  if(!current.length||current.length>6||
     new Set(current).size!==current.length||
     !sameIds(current,run.members.map(m=>m.id))||
     binding.id!==s.active||binding.life!==life.token||
     binding.dex!==c.m.dex||binding.shiny!==c.m.shiny||
     binding.age>c.p.data.ageMinutes||
     binding.geneAtk!==c.p.data.genes.atk||
     binding.geneDef!==c.p.data.genes.def||
     binding.geneSpe!==c.p.data.genes.spe)
   fail('LEAGUE_ROSTER_CHANGED');
  for(const member of run.members){
   const mon=s.mons.find(m=>m.id===member.id);
   if(!mon||mon.dex!==member.dex||mon.shiny!==member.shiny)
    fail('LEAGUE_ROSTER_CHANGED');
   if(member.id===s.active)continue;
   const gains=resume?member.levelGains:0;
   if(member.form!==0||mon.level!==member.level+gains||
      !['atk','def','spe'].every(k=>
       integer(mon.data.stats?.[k],1,65535)&&
       mon.data.stats[k]===member[k]+gains
      ))fail('LEAGUE_STORED_PROGRESS_CHANGED');
  }
  return s;
 }

 function create(mod,M,L,baseBridge,reconcile=s=>s){
  const required=[
   'tp_lgt_prepare_start','tp_lgt_prepare_resume','tp_lgt_finish',
   'tp_lgt_win_begin','tp_lgt_win_apply',
   'tp_lgt_saved_size','tp_lgt_saved_ptr',
   'tp_lgt_prepared_size','tp_lgt_prepared_ptr','tp_f4_life_state'
  ];
  const supported=required.every(n=>typeof mod['_'+n]==='function');
  const call=(name,args=[],type='number')=>
   mod.ccall(name,type,args.map(()=>'number'),args);
  const life=()=>JSON.parse(call('tp_f4_life_state',[],'string'));
  let controller=null,intent=null,lease=null;

  function readCollection(){
   const raw=baseBridge.read();
   if(raw===null)fail('LEAGUE_COLLECTION_MISSING');
   return M.decode(decoder.decode(raw));
  }
  function readRun(region,token=0){
   const kind=token?'prepared':'saved',args=token?[region,token]:[region];
   const size=call('tp_lgt_'+kind+'_size',args);
   if(!integer(size,1,L.MAX))fail('LEAGUE_RUN_UNAVAILABLE');
   const ptr=call('tp_lgt_'+kind+'_ptr',args);
   if(!integer(ptr,1,mod.HEAPU8.length-size))
    fail('LEAGUE_RUN_POINTER_INVALID');
   const bytes=mod.HEAPU8.slice(ptr,ptr+size);
   return token&&bytes[6]===26?
    L.decodeTerminal(bytes,region):L.decode(bytes,region);
  }
  function fresh(s,request,currentLife){
   M.validate(s);
   const c=care(s,currentLife),selected=ids(s);
   if(!selected.length||selected.length>6)fail('LEAGUE_TEAM_UNAVAILABLE');
   const run={
    region:request.region,phase:2,variant:request.variant,index:0,active:0,
    care:{
     id:s.active,life:currentLife.token,age:c.p.data.ageMinutes,
     dex:c.m.dex,shiny:c.m.shiny,
     geneAtk:c.p.data.genes.atk,geneDef:c.p.data.genes.def,
     geneSpe:c.p.data.genes.spe
    },
    members:selected.map(id=>{
     const m=s.mons.find(p=>p.id===id),stats=m?.data.stats;
     if(!m||!['atk','def','spe'].every(k=>integer(stats?.[k],1,65535)))
      fail('LEAGUE_STATS_UNAVAILABLE');
     const maxHp=Math.min(65535,Math.max(
      30+m.level*5+stats.def,
      18+m.level*3+Math.floor(stats.def/2)
     ));
     return {
      id:m.id,dex:m.dex,level:m.level,
      atk:stats.atk,def:stats.def,spe:stats.spe,
      type1:call('tp_dex_type1',[m.dex]),
      type2:call('tp_dex_type2',[m.dex]),
      form:0,shiny:m.shiny,nick:m.nickname,
      maxHp,hp:maxHp,rests:5,wins:0,levelGains:0
     };
    })
   };
   L.validate(run);
   roster(M,s,run,currentLife,false);
   return run;
  }
  function nativeStart(region,run,replace){
   const bytes=L.encode(run),ptr=mod._malloc(bytes.length);
   if(!ptr)fail('ALLOCATION_FAILED');
   try{
    mod.HEAPU8.set(bytes,ptr);
    return call('tp_lgt_prepare_start',[region,ptr,bytes.length,+replace]);
   }finally{mod._free(ptr);}
  }

  const bridge=Object.freeze({
   read:()=>baseBridge.read(),
   begin(context){
    if(!['leagueStart','leagueResume','leagueWin'].includes(context))
     return baseBridge.begin(context);
    if(!supported||lease||!intent||intent.context!==context)return 0;
    const before=readCollection(),currentLife=life();
    const run=context==='leagueStart'?
     fresh(before,intent,currentLife):readRun(intent.region);
    if(context==='leagueResume'){
     if(run.phase!==1)fail('LEAGUE_CHECKPOINT_REQUIRED');
     roster(M,before,run,currentLife,true);
    }
    if(context==='leagueWin'){
     if(run.phase!==2)fail('LEAGUE_ACTIVE_RUN_REQUIRED');
     roster(M,before,run,currentLife,true);
    }
    const token=context==='leagueStart'?
     nativeStart(intent.region,run,intent.replace):
     call(context==='leagueWin'?'tp_lgt_win_begin':
      'tp_lgt_prepare_resume',[intent.region]);
    if(token)lease={
     token,region:intent.region,context,before:M.encode(before),
     source:run,applied:false
    };
    return token;
   },
   stage:(token,data)=>baseBridge.stage(token,data),
   finish(token,commit){
    if(lease&&lease.token===token){
     if(commit&&!lease.applied)return 0;
     const result=call('tp_lgt_finish',[lease.region,token,commit]);
     if(result===1)lease=null;
     return result;
    }
    return baseBridge.finish(token,commit);
   }
  });

  function handover(before,token,context){
   if(!lease||lease.token!==token||lease.context!==context||
      M.encode(before)!==lease.before)
    fail('LEAGUE_TRANSACTION_CHANGED');
   const run=readRun(lease.region,token);
   if(run.phase!==2||context==='leagueStart'&&run.index!==0)
    fail('LEAGUE_PREPARED_STATE_CHANGED');
   roster(M,before,run,life(),context==='leagueResume');
   const after=reconcile(before,token);
   M.validate(after);
   if(after.active!==before.active||!sameIds(ids(before),ids(after)))
    fail('LEAGUE_ROSTER_CHANGED');
   roster(M,after,run,life(),context==='leagueResume');
   lease.applied=true;
   return after;
  }
  function winHandover(before,token){
   if(!lease||lease.token!==token||lease.context!=='leagueWin'||
      M.encode(before)!==lease.before)
    fail('LEAGUE_TRANSACTION_CHANGED');

   before=reconcile(before,token);
   M.validate(before);
   const source=lease.source;
   roster(M,before,source,life(),true);
   const careBefore=before.mons.find(m=>m.id===before.active);

   if(call('tp_lgt_win_apply',[lease.region,token])!==1)
    fail('NATIVE_LEAGUE_WIN_REFUSED');
   const run=readRun(lease.region,token);
   if(run.phase!==1||run.index!==source.index+1||
      run.variant!==source.variant||
      JSON.stringify(run.care)!==JSON.stringify(source.care)||
      run.members.length!==source.members.length)
    fail('LEAGUE_WIN_PLAN_CHANGED');

   const frozen=[
    'id','dex','level','atk','def','spe','type1','type2',
    'form','shiny','nick','maxHp'
   ];
   for(let i=0;i<run.members.length;i++){
    const member=run.members[i],old=source.members[i];
    if(!frozen.every(k=>member[k]===old[k])||
       member.rests>old.rests||
       member.wins!==old.wins+(i===run.active?1:0)||
       !integer(member.levelGains-old.levelGains,0,i===run.active?1:0))
     fail('LEAGUE_WIN_PLAN_CHANGED');
   }

   let after=reconcile(before,token);
   M.validate(after);
   const careAfter=after.mons.find(m=>m.id===after.active);
   const careOld=source.members.find(m=>m.id===before.active);
   const careNew=run.members.find(m=>m.id===before.active);
   const careDelta=careOld?careNew.levelGains-careOld.levelGains:0;
   if(after.active!==before.active||!careBefore||!careAfter||
      careAfter.dex!==careBefore.dex||
      careAfter.shiny!==careBefore.shiny||
      careAfter.origin!==careBefore.origin||
      careAfter.data.lifeToken!==careBefore.data.lifeToken||
      careAfter.level!==careBefore.level+careDelta)
    fail('CARE_REWARD_MISMATCH');

   for(let i=0;i<run.members.length;i++){
    const member=run.members[i];
    if(member.id===before.active)continue;
    const delta=member.levelGains-source.members[i].levelGains;
    for(let gain=0;gain<delta;gain++)
     after=M.grantStoredBattleLevel(after,member.id);
   }
   M.validate(after);
   roster(M,after,run,life(),true);
   lease.applied=true;
   return after;
  }
  const nativeActions=Object.freeze({
   leaguePrepare(before,token){return reconcile(before,token);},
   leagueStart(before,token){return handover(before,token,'leagueStart');},
   leagueResume(before,token){return handover(before,token,'leagueResume');},
   leagueWin(before,token){return winHandover(before,token);}
  });
  async function execute(request){
   if(!controller)fail('COLLECTION_NOT_BOUND');
   if(!supported)fail('LEAGUE_CORE_UNAVAILABLE');
   if(intent||lease)fail('BUSY');
   if(!integer(request.region,0,1))fail('INVALID_REGION');
   if(request.context==='leagueStart'&&(
    !integer(request.variant,0,request.region===0?2:0)||
    typeof request.replace!=='boolean'
   ))fail('INVALID_LEAGUE_START');
   intent=Object.freeze(request);
   try{return await controller.act(request.context);}
   finally{intent=null;}
  }

  return Object.freeze({
   bridge,nativeActions,supported,
   bind(c){if(controller)fail('ALREADY_BOUND');controller=c;},
   prepare(){
    if(!controller)fail('COLLECTION_NOT_BOUND');
    return controller.act('leaguePrepare');
   },
   start(region,variant=0,replace=false){
    return execute({context:'leagueStart',region,variant,replace});
   },
   resume(region){return execute({context:'leagueResume',region});},
   complete(region){return execute({context:'leagueWin',region});}
  });
 }
 return Object.freeze({create,validateRoster:roster});
});
