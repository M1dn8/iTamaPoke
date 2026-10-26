/* Kanto league controller. Checkpoints only after committed victories. */
(function(){'use strict';let D=window.TPKantoLeagueData,region=0;let busy=false,variant=0,preview=-1,error='',phase='choose';
const leagueText=(key,params={})=>window.TPLeagueText?
 window.TPLeagueText.t(key,params):TPText.t('leagueTeam.'+key,params);
const c=(n,...a)=>Module.ccall(n,'number',a.map(()=> 'number'),a);
const scoped=(mod,r,n,type,args=[])=>window.TPRegions?TPRegions.call(mod,r,n,type,args):r===0?mod.ccall(n,type,args.map(()=> 'number'),args):null;
function teamCore(mod=Module){
 return !!mod&&typeof mod._tp_lgt_view==='function'&&
  !!window.TPLeagueCollection?.supported;
}
const view=(r=region,mod=Module)=>{
 if(teamCore(mod)){
  const v=JSON.parse(mod.ccall('tp_lgt_view','string',['number'],[r]));
  if(v.kind!=='legacy')return {
   ...v,region:r,teamMode:true,
   note:window.TPLeagueText?window.TPLeagueText.note(v.note):v.note||''
  };
 }
 return {...JSON.parse(scoped(mod,r,'tp_lg_view','string')),region:r};
};
const command=(n,...args)=>{
 if(view().teamMode&&['tp_lg_abort','tp_lg_turn'].includes(n)){
  const target=n==='tp_lg_abort'?'tp_lgt_abort':'tp_lgt_turn';
  return Module.ccall(target,'number',
   [region,...args].map(()=>'number'),[region,...args]);
 }
 return scoped(Module,region,n,'number',args);
};
const label=()=>region===1?'Johto':'Kanto';
const champ=()=>region===1?'Siegfried':'Blau';
function ready(){return !!Module&&typeof Module[region===1?'_tp_region_lg_view':'_tp_lg_view']==='function';}
function open(wanted=window.TPArena?.region??0){if(screen!=='arena'||tpSaveReplacing||busy||window.TPHall?.active||!Number.isInteger(wanted)||wanted<0||wanted>1||wanted===1&&!window.TPRegions?.available(1))return false;region=wanted;D=window.TPRegions?.catalog(region)?.league||window.TPKantoLeagueData;variant=0;if(!ready()){error='Bitte den neuen WASM-Kern bauen.';}phase='choose';preview=-1;screen='league';dragStart=dragNow=null;return true;}
function back(){if(busy)return;attackMenu=false;try{if(ready())command('tp_lg_abort');}catch(_){}screen='arena';phase='choose';preview=-1;error='';}
async function transaction(kind,args=[]){if(busy||tpSaveReplacing)return false;const owner=region,mod=Module;const native=(n,...a)=>scoped(mod,owner,n,'number',a);busy=true;tpSaveReplacing=true;tpSaveEpoch++;let token=0,durable=false;
 try{token=native(kind,...args);if(!token)throw Error('Ligaaktion gerade nicht moeglich.');const bytes=exportStateBytes(mod);TPStoreTools.parseLegacy(bytes);if(await writeSave(bytes,true)!==true)throw Error('Speicherung nicht bestaetigt.');durable=true;if(native('tp_lg_finish',token,1)!==1)throw Error('Gespeichert, aber lokalen Abschluss pruefen. App neu oeffnen.');error='';phase=kind==='tp_lg_prepare_win'?'checkpoint':'fight';attackMenu=false;if(kind==='tp_lg_prepare_win'&&!view(owner,mod).state&&window.TPHall&&document.visibilityState==='visible')queueMicrotask(()=>window.TPHall.open(true,owner));if(document.visibilityState!=='visible'&&phase==='fight'){native('tp_lg_abort');phase='choose';}return true;
 }catch(e){if(token&&!durable)native('tp_lg_finish',token,0);error=e.message||String(e);phase=durable?'fatal':kind==='tp_lg_prepare_win'?'retry':'choose';return false;}
 finally{tpSaveEpoch++;tpSaveReplacing=false;busy=false;}}
async function teamTransaction(kind,replace=false){
 if(busy||tpSaveReplacing||window.TPCollection?.blocked||
    document.visibilityState!=='visible')return false;
 const owner=region,mod=Module,collection=window.TPLeagueCollection;
 if(!teamCore(mod)||!collection||!window.TPBattleView){
  error=leagueText('core');
  return false;
 }
 busy=true;error='';
 try{
  if(kind!=='win'){
   await collection.prepare();
   if(Module!==mod||region!==owner||screen!=='league'||
      document.visibilityState!=='visible'||choice!=='none')
    throw Error(leagueText('contextChanged'));
  }
  if(kind==='start')await collection.start(owner,variant,replace);
  else if(kind==='resume')await collection.resume(owner);
  else await collection.complete(owner);
  if(Module!==mod||region!==owner)
   throw Error(leagueText('contextReload'));
  phase=kind==='win'?'checkpoint':'fight';attackMenu=false;
  const v=view(owner,mod);
  if(kind==='win'&&v.done&&!v.state&&window.TPHall&&
     document.visibilityState==='visible')
   queueMicrotask(()=>window.TPHall.open(true,owner));
  if(document.visibilityState!=='visible'&&phase==='fight'){
   mod.ccall('tp_lgt_abort','number',['number'],[owner]);
   phase='choose';
  }
  return true;
 }catch(e){
  const fatal=!!window.TPCollection?.blocked||Module!==mod||region!==owner;
  error=fatal?leagueText('reload'):
   window.TPLeagueText?window.TPLeagueText.error(e):e.message||String(e);
  phase=fatal?'fatal':kind==='win'?'retry':'choose';
  statusEl.textContent=error;
  return false;
 }finally{busy=false;}
}
function resume(){const v=view();if(window.TPBattleEnergy&&(!window.TPBattleEnergy.supported||(v.index===20&&!window.TPBattleEnergy.view.champ.can))){error=window.TPBattleEnergy.line('champ');return false;}return view().teamMode?teamTransaction('resume'):
 transaction('tp_lg_prepare_resume');}
function start(){let v=view();if(window.TPBattleEnergy&&(!window.TPBattleEnergy.supported||!window.TPBattleEnergy.view.elite.can)){error=window.TPBattleEnergy.line('elite');return false;}if((v.state===1||v.teamMode&&v.state===2)&&
 !confirm(leagueText(v.teamMode?'replaceTeam':'replaceSingle')))return;
 if(v.teamMode)return teamTransaction('start',!!v.state);
 return transaction('tp_lg_prepare_start',[variant]);}
function saveWin(){
 return view().teamMode?teamTransaction('win'):
  transaction('tp_lg_prepare_win');
}
function text(s,x,y,size=14,color=UI.ink,w=430){ctx.fillStyle=color;ctx.textAlign='center';ctx.font=size+'px monospace';ctx.fillText(s,x,y,w);}
function button(s,x,y,w=326,h=36,on=true){ctx.fillStyle=on?UI.white:UI.track;roundRect(x,y,w,h,9);ctx.fill();ctx.strokeStyle=UI.track;ctx.lineWidth=1;ctx.stroke();text(s,x+w/2,y+h/2+5,14,on?UI.ink:'#e9ece6',w-12);}
function heading(i){return i<4?'Top Vier · '+D.names[i]:'Champ · '+champ();}
function team(i){return i<4?D.elite[i]:D.champions[variant];}
function sprite(dex,x,y,form=0,shiny=false){const s=form?megaSpriteFor(shiny,form):spriteFor(dex,shiny);if(!s){text('?',x,y,34);return;}const a=s.actions[TPAct.idle];if(!a)return;const img=frameImageData(s,TPAct.idle,frameIndexAt(a,performance.now(),true));if(!img)return;frameCanvas.width=a.w;frameCanvas.height=a.h;frameCtx.putImageData(img,0,0);const z=Math.min(3,130/a.w,120/a.h);ctx.imageSmoothingEnabled=false;ctx.drawImage(frameCanvas,x-a.w*z/2,y-a.h*z,a.w*z,a.h*z);}
function draw(){if(window.TPHall?.active){window.TPHall.draw();return;}ctx.fillStyle='#f7efe6';ctx.fillRect(0,0,466,466);text(label()+' · Pokémon-Liga',233,30,23);if(!ready()){text(error||'Neuen WASM-Kern bauen.',233,180);button('Zurück',70,416);return;}let v;try{v=view();}catch(e){error=e.message;text(error,233,180);button('Zurück',70,416);return;}
 if(phase==='fatal'){text(error,233,160,14,UI.barBad);button('App neu laden',70,414);return;}
 if(v.live&&window.TPBattleView){if(!v.actor){command('tp_lg_abort');phase='choose';error='Pflege-Pokemon nicht mehr passend.';return;}if(v.resolved&&v.won&&!busy&&phase!=='retry'&&phase!=='fatal')saveWin();window.TPBattleView.drawLeague(v,error,phase==='retry');return;}
 if(v.live){phase=phase==='retry'?'retry':'fight';const trainer=Math.min(4,Math.floor(v.index/5)),slot=trainer===4?v.index-20:v.index%5;text(heading(trainer)+' · '+(slot+1)+' / '+(trainer===4?6:5),233,61,15);text(fns.dexName(v.playerDex),123,88,14);text(fns.dexName(v.dex)+' · Lv. '+v.level,343,88,14);drawBattleHpBar(58,110,v.hp,v.maxHp,UI.barOK);drawBattleHpBar(278,110,v.enemyHp,v.enemyMaxHp,UI.barBad);sprite(v.playerDex,123,285,v.form,!!v.shiny);sprite(v.dex,343,285);text('Heilungen im gesamten Lauf: '+v.rests+' / 5',233,310,13);
  if(!v.actor){command('tp_lg_abort');phase='choose';error='Pflege-Pokemon nicht mehr passend.';return;}
  if(v.resolved){if(v.won){text(error||'Sieg wird gespeichert …',233,345,14,error?UI.barBad:UI.ink);if(!busy&&phase!=='retry'&&phase!=='fatal')saveWin();if(phase==='retry'){button('Speichern erneut versuchen',70,360);button('Lauf abbrechen',70,414);}}else{text('Niederlage · neuer Lauf beginnt bei '+D.names[0]+'.',233,346,14);button('Zur Ligaübersicht',70,414);}return;}
  if(attackMenu){button('Schnell',74,298,150,44);button('Kräftig',242,298,150,44);}
  button('Angriff',58,358,108,58);button('Ausweichen',179,358,108,58);button('Heilen '+v.rests,300,358,108,58);button('Abbruch',184,151,98,30);return;}
 if(phase==='checkpoint'){if(v.done&&!v.state){text(label()+'-Champ!',233,130,30);text('Regionalabschluss dauerhaft gespeichert.',233,174,16);text('Dein Ehrenplatz wartet in der Ruhmeshalle.',233,207,13);button('Ruhmeshalle',70,280);}else{text('Gegner besiegt · Zwischenstand gespeichert',233,115,17);text('Rest-KP: '+v.hp+' / '+v.maxHp,233,156);text(v.teamMode?leagueText('activeRests',{count:v.rests}):
 'Verbleibende Heilungen: '+v.rests+' / 5',233,188);text('Nächster Gegner: '+heading(Math.min(4,Math.floor(v.index/5))),233,224);if(v.index===20&&window.TPBattleEnergy)text(window.TPBattleEnergy.line('champ'),233,244,11);button(v.index===20?'Champ starten · 30 Energie':'Weiter',70,252,326,36,v.index!==20||!window.TPBattleEnergy||!!window.TPBattleEnergy.view?.champ.can);}button('Pausieren / Zurück zu den Arenen',70,424);return;}
 if(preview>=0){
 const colors=region===1?['#a18ab6','#748965','#8d8167','#514a63','#526f65']:['#729baa','#8d8167','#82738a','#526f65','#ad9765'];
 TPOpponentTeam.header({name:D.names[preview],subtitle:label()+' · '+(preview<4?'Top Vier':'Champ'),color:colors[preview],image:TPOpponentTeam.portrait(
  region===0
   ? ['kanto-elite-lorelei','kanto-elite-bruno','kanto-elite-agathe','kanto-elite-siegfried','kanto-champ-blau'][preview]
   : ['johto-elite-willi','johto-elite-koga','johto-elite-bruno','johto-elite-melanie','johto-champ-siegfried'][preview]
 )});
 TPOpponentTeam.draw(team(preview),{y:110,rowHeight:80});
 button('Zur Ligaübersicht',70,414);return;}
 text(v.done?label()+' abgeschlossen · Wiederholung möglich':(region===1?'Gold/Silber':'Rot/Blau')+' · fünf Gegner · Originallevel',233,53,13);if(region===0)D.variants.forEach((s,i)=>button((variant===i?'✓ ':'')+s,30+i*145,70,136,40));else button('Champ · Siegfried',70,70,326,40);D.names.forEach((n,i)=>button((i===4?'Champ · ':'')+n,70,125+i*36,326,30));
 const notice=error||(!v.supported?'Ligadaten nicht unterstützt.':!v.unlocked?'Noch gesperrt: erst alle acht '+label()+'-Orden.':v.state===2?'Unterbrochener Kampf: neuer Lauf ab '+D.names[0]+'.':v.state===1?(v.actor?'Gespeicherter Lauf kann fortgesetzt werden.':'Zwischenstand gehört einem anderen Pflege-Pokemon.'):(window.TPBattleEnergy?window.TPBattleEnergy.line('elite')+' · Top Vier gesamt': (v.teamMode?leagueText('budget'):'Fünf Heilungen für alle 26 Pokémon zusammen.')));text(notice,233,324,12,error?UI.barBad:UI.ink);
 if(v.state===1&&v.actor){button('Fortsetzen · Rest-KP '+v.hp+' · Heilen '+v.rests,70,343,326,34,!!v.unlocked&&(v.index!==20||!window.TPBattleEnergy||!!window.TPBattleEnergy.view?.champ.can));button(leagueText(v.teamMode?'newTeam':'newSingle'),70,382,326,30,!!v.unlocked&&!!v.supported&&(!window.TPBattleEnergy||!!window.TPBattleEnergy.view?.elite.can));}else button(leagueText(v.teamMode?'startTeam':'startSingle'),70,360,326,40,!!v.unlocked&&!!v.supported&&(!window.TPBattleEnergy||!!window.TPBattleEnergy.view?.elite.can));button('Ruhmeshalle',70,425,156,30);button('Zurück',240,425,156,30);statusEl.textContent=label()+'-Liga';}
let attackMenu=false;
function tap(x,y){if(busy||tpSaveReplacing)return;if(window.TPHall?.active){window.TPHall.tap(x,y);return;}if(!ready()){if(y>=416)back();return;}const v=view();if(phase==='fatal'){if(y>=414)window.location.reload();return;}
 if(v.live&&window.TPBattleView){const a=window.TPBattleView.tapLeague(x,y,v,error,phase==='retry');const actions={quick:1,heavy:2,dodge:3,rest:4};if(v.teamMode&&a&&/^member[0-5]$/.test(a)){
 if(!v.resolved&&!v.pending)
  Module.ccall('tp_lgt_switch','number',['number','number'],
   [region,Number(a.slice(6))]);
}else if(a in actions)command('tp_lg_turn',actions[a]);else if(a==='retry')saveWin();else if(a==='abort'&&(v.resolved||confirm('Ligalauf aufgeben? Bereits bezahlte Energie wird nicht erstattet.')))back();return;}
 if(v.live){if(v.resolved){if(v.won&&phase==='retry'&&y>=360&&y<=400)saveWin();else if(y>=414)back();return;}if(x>=184&&x<=282&&y>=151&&y<=181){back();return;}if(attackMenu){attackMenu=false;if(y>=298&&y<=342){if(x>=74&&x<=224)command('tp_lg_turn',1);else if(x>=242&&x<=392)command('tp_lg_turn',2);}return;}if(y>=358&&y<=416){if(x>=58&&x<=166)attackMenu=true;else if(x>=179&&x<=287)command('tp_lg_turn',3);else if(x>=300&&x<=408)command('tp_lg_turn',4);}return;}
 if(phase==='checkpoint'){if(v.done&&!v.state&&x>=70&&x<=396&&y>=280&&y<=316){window.TPHall?.open(true,region);return;}if(y>=424){back();return;}if(x>=70&&x<=396&&y>=252&&y<=288&&v.state===1)resume();return;}if(preview>=0){if(y>=414)preview=-1;return;}if(y>=425){if(x>=70&&x<=226)window.TPHall?.open(false,region);else if(x>=240&&x<=396)back();return;}if(y>=70&&y<=110){if(region!==0)return;const i=Math.floor((x-30)/145);if(i>=0&&i<3)variant=i;return;}if(x>=70&&x<=396&&y>=125&&y<=299){const i=Math.floor((y-125)/36);if(i<5)preview=i;return;}if(!v.supported||!v.unlocked)return;if(v.state===1&&v.actor){if(y>=343&&y<=377)resume();else if(y>=382&&y<=412)start();}else if(y>=360&&y<=400)start();}
function hidden(){if(document.visibilityState!=='visible'&&!busy&&ready()){const v=view();if(v.live)command('tp_lg_abort');attackMenu=false;phase='choose';}}
document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',hidden);
window.TPLeague=Object.freeze({open,draw,tap,back,get region(){return region;},get busy(){return busy||!!window.TPHall?.busy;},get state(){return ready()?view():null;},get diagnostics(){return Object.freeze({phase,error,busy,attackMenu});}});})();
