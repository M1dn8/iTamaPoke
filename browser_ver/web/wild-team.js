/* P05a browser orchestration; native code owns combat, collection owns IDs. */
(function(){
'use strict';
const catalogues={"en": {"wildTeam.choose": "Choose a team member", "wildTeam.forced": "Defeated — choose the next Pokémon", "wildTeam.saving": "Saving battle result…", "wildTeam.saveFailed": "Save failed. Please try again.", "wildTeam.retry": "Try saving again", "wildTeam.startFailed": "Battle could not start. Please try again.", "wildTeam.unavailable": "Please load the current game core.", "wildTeam.reload": "Save confirmation unclear — please reload.", "wildTeam.fainted": "defeated", "wildTeam.active": "active", "wildTeam.count": "{ready}/{total} ready", "wildTeam.member": "{name} · Lv. {level}", "wildTeam.hp": "{hp}/{max} HP", "wildTeam.reward": "{name} · Level {level}", "wildTeam.flee": "Run"}, "de": {"wildTeam.choose": "Teammitglied wählen", "wildTeam.forced": "Besiegt — nächstes Pokémon wählen", "wildTeam.saving": "Ergebnis wird gespeichert …", "wildTeam.saveFailed": "Speichern fehlgeschlagen. Bitte erneut versuchen.", "wildTeam.retry": "Speichern erneut versuchen", "wildTeam.startFailed": "Kampfstart fehlgeschlagen. Bitte erneut versuchen.", "wildTeam.unavailable": "Bitte aktuellen Spielkern laden.", "wildTeam.reload": "Speicherabschluss unklar — bitte neu laden.", "wildTeam.fainted": "besiegt", "wildTeam.active": "aktiv", "wildTeam.count": "{ready}/{total} einsatzbereit", "wildTeam.member": "{name} · Lv. {level}", "wildTeam.hp": "{hp}/{max} KP", "wildTeam.reward": "{name} · Level {level}", "wildTeam.flee": "Fliehen"}, "es": {"wildTeam.choose": "Elegir un miembro del equipo", "wildTeam.forced": "Derrotado — elige el siguiente Pokémon", "wildTeam.saving": "Guardando el resultado…", "wildTeam.saveFailed": "No se pudo guardar. Inténtalo de nuevo.", "wildTeam.retry": "Volver a guardar", "wildTeam.startFailed": "No se pudo iniciar el combate. Inténtalo de nuevo.", "wildTeam.unavailable": "Carga la versión actual del juego.", "wildTeam.reload": "Guardado sin confirmar — vuelve a cargar.", "wildTeam.fainted": "derrotado", "wildTeam.active": "activo", "wildTeam.count": "{ready}/{total} disponibles", "wildTeam.member": "{name} · Nv. {level}", "wildTeam.hp": "{hp}/{max} PS", "wildTeam.reward": "{name} · Nivel {level}", "wildTeam.flee": "Huir"}, "fr": {"wildTeam.choose": "Choisir un membre de l’équipe", "wildTeam.forced": "K.O. — choisissez le Pokémon suivant", "wildTeam.saving": "Enregistrement du résultat…", "wildTeam.saveFailed": "Échec de l’enregistrement. Réessayez.", "wildTeam.retry": "Réessayer l’enregistrement", "wildTeam.startFailed": "Impossible de lancer le combat. Réessayez.", "wildTeam.unavailable": "Chargez la version actuelle du jeu.", "wildTeam.reload": "Enregistrement non confirmé — rechargez.", "wildTeam.fainted": "K.O.", "wildTeam.active": "actif", "wildTeam.count": "{ready}/{total} disponibles", "wildTeam.member": "{name} · Niv. {level}", "wildTeam.hp": "{hp}/{max} PV", "wildTeam.reward": "{name} · Niveau {level}", "wildTeam.flee": "Fuir"}};
for(const [code,messages] of Object.entries(catalogues)){
 TPText.registerLocale(code,messages);
}
const tr=(key,params={})=>TPText.t('wildTeam.'+key,params);
let starting=false,saving=false,startNotice='',resultError='',reward='';
let ownedBattle=0,attempted=false;

function supported(){
 try{
  return !!Module&&[
   '_tp_wt_stage_begin','_tp_wt_stage_entry','_tp_wt_start',
   '_tp_wt_switch','_tp_wt_view','_tp_wt_player_dex'
  ].every(key=>typeof Module[key]==='function')&&
   !!window.TPWildResult?.supported;
 }catch(_){return false;}
}
function call(name,args=[]){
 return Module.ccall(name,'number',
  args.map(v=>typeof v==='string'?'string':'number'),args);
}
function view(){
 if(!supported())return null;
 return JSON.parse(Module.ccall('tp_wt_view','string',[],[]));
}
function battleId(){return call('tp_bv_get',[0]);}
function owns(){return ownedBattle!==0&&supported()&&battleId()===ownedBattle;}
function blocked(){
 return tpSaveReplacing||window.TPCollection?.busy||
  window.TPCollection?.blocked||window.TPCollectionGame?.dialogOpen||
  window.TPMega?.busy||window.TPTraining?.busy||window.TPArena?.busy||
  window.TPLeague?.busy||window.TPExpeditions?.busy||
  window.TPBoxes?.active||window.TPAppMenu?.active;
}
function report(error){
 try{window.TPDiagnostics?.record('write',error);}catch(_){}
}
async function start(prompt=false){
 if(starting||saving||blocked())return false;
 const origin=screen,mod=Module;
 if(choice!=='none'||document.visibilityState!=='visible')return false;
 if(prompt){
  if(origin!=='idle'||!fns.wildPromptActive())return false;
 }else if(origin!=='card'||cardPage!==4||fns.wildPromptActive()){
  return false;
 }
 if(!supported()){
  startNotice=tr('unavailable');statusEl.textContent=startNotice;return false;
 }
 starting=true;startNotice='';
 try{
  const controller=window.TPCollection;
  await controller.act('wildPrepare');
  if(Module!==mod||screen!==origin||choice!=='none'||
     document.visibilityState!=='visible'||blocked()){
   throw Error('WILD_START_CONTEXT_CHANGED');
  }
  const state=controller.read();
  TPCollectionModel.validate(state);
  const ids=state.team.length?state.team:
   state.active===null?[]:[state.active];
  if(!ids.length||ids.length>6)throw Error('WILD_TEAM_UNAVAILABLE');

  const members=ids.map(id=>{
   const m=state.mons.find(p=>p.id===id);
   const stats=m?.data.stats;
   if(!m||!stats||!['atk','def','spe'].every(
    key=>Number.isInteger(stats[key])&&stats[key]>=1&&stats[key]<=65535
   ))throw Error('WILD_STATS_UNAVAILABLE');
   return m;
  });
  if(call('tp_wt_stage_begin',[members.length])!==1){
   throw Error('WILD_STAGE_REFUSED');
  }
  for(let index=0;index<members.length;index++){
   const m=members[index],s=m.data.stats;
   if(call('tp_wt_stage_entry',[
    index,m.id,m.dex,m.level,s.atk,s.def,s.spe,
    m.id===state.active?1:0,m.shiny?1:0,m.nickname
   ])!==1)throw Error('WILD_MEMBER_REFUSED');
  }
  if(call('tp_wt_start',[prompt?1:0])!==1)throw Error('WILD_START_REFUSED');

  ownedBattle=battleId();attempted=false;resultError='';reward='';
  dragStart=dragNow=null;
  battleReturn=prompt?'idle':'card';
  screen='battle';
  return true;
 }catch(error){
  startNotice=tr('startFailed');statusEl.textContent=startNotice;
  report(error);return false;
 }finally{starting=false;}
}
async function saveResult(){
 if(saving||!owns()||window.TPCollection?.blocked)return false;
 const state=view();
 if(!state?.resultPending)return false;
 saving=true;attempted=true;resultError='';
 try{
  await window.TPWildResult.complete();
  if(state.winnerId){
   const m=TPCollection.read().mons.find(p=>p.id===state.winnerId);
   if(m)reward=tr('reward',{
    name:m.nickname||fns.dexName(m.dex),level:m.level
   });
  }
  return true;
 }catch(error){
  resultError=tr(error.code==='RELOAD_REQUIRED'?'reload':'saveFailed');
  statusEl.textContent=resultError;
  report(error);return false;
 }finally{saving=false;}
}
function poll(){
 if(!owns()||saving||attempted)return;
 if(view()?.resultPending)void saveResult();
}
function switchTo(index){
 if(!owns()||starting||saving||blocked()||
    !Number.isInteger(index)||index<0||index>5)return false;
 const state=view();
 if(!state?.live||state.resultPending||index>=state.count||
    index===state.active||state.members[index].hp<=0)return false;
 return call('tp_wt_switch',[index])===1;
}
window.TPWildTeam=Object.freeze({
 start,poll,switchTo,retry:saveResult,text:tr,
 get view(){return view();},
 get notice(){return startNotice;},
 get saving(){return owns()&&saving;},
 get error(){return owns()?resultError:'';},
 get reward(){return owns()?reward:'';},
 get starting(){return starting;}
});
})();
