// F3: local arena UI, profile badge case and commit-confirmed handover.
(function(){'use strict';
let data=window.TPKantoArena,region=0,choosingRegion=false;
let selected=0,tab='leaders',detail=false,origin='leaders',session=null,saving=false,artBusy=false,message='';
let entryReturn='card';
const pictures=new Map(),loading=new Set();let artGeneration=0;
const call=(name,...args)=>Module.ccall(name,'number',args.map(()=> 'number'),args);
const scoped=(mod,r,name,...args)=>window.TPRegions?TPRegions.call(mod,r,name,'number',args):r===0?mod.ccall(name,'number',args.map(()=> 'number'),args):0;
const regional=(r,name,...args)=>scoped(Module,r,name,...args);
const label=()=>region===1?'Johto':'Kanto';
const get=k=>call('tp_f3_get',k),mask=()=>regional(region,'tp_f3_mask');
function chooseRegion(id){if(screen!=='arena'||busy()||active()||tpSaveReplacing||!Number.isInteger(id)||id<0||id>1||window.TPRegions?.locked())return false;if(id===1&&!window.TPRegions?.available(1)){message=window.TPRegions?.reason(1)||'Johto ist gesperrt.';return false;}const info=window.TPRegions?.catalog(id);if(!info&&id!==0)return false;if(window.TPRegions&&!TPRegions.remember(id))return false;region=id;data=info?info.arena:window.TPKantoArena;selected=0;tab=origin='leaders';detail=false;session=null;message='';choosingRegion=false;invalidatePortraits();return true;}
function regionPicker(){ctx.fillStyle=UI.bgDay;ctx.fillRect(0,0,466,466);text('Region waehlen',233,44,22);text('Orden, Liga und Ehrenei bleiben getrennt.',233,83,13);for(let id=0;id<2;id++){const y=125+id*113,enabled=id===0||!!window.TPRegions?.available(id),p=window.TPRegions?.progress(id);button((region===id?'✓ ':'')+(id===0?'Kanto · Rot/Blau':'Johto · Gold/Silber'),60,y,346,68,enabled);text(enabled?(p&&p.mask>=0?'Orden '+Array.from({length:8},(_,i)=>!!(p.mask&(1<<i))).filter(Boolean).length+' / 8'+(p.league.done?' · Champ-Titel':''):'Fortschrittsdaten nicht lesbar'):(window.TPRegions?.reason(id)||'Johto ist gesperrt.'),233,y+91,12);}button('Zurueck',70,414,326,36);statusEl.textContent='Regionen · Kanto / Johto';}

function active(){try{return typeof Module!=='undefined'&&!!Module&&!!get(0);}catch(_e){return false;}}
function busy(){return saving||artBusy;}
function canOpen(from='card'){
 return !busy()&&!!window.TPTrainer?.canOpen(from);
}
function open(from='card'){if(!canOpen(from))return false;entryReturn=from;arenaPageKey='';session=null;message='';tab='leaders';detail=false;dragStart=dragNow=null;screen='arena';const wanted=window.TPRegions?.selected||0;if(!chooseRegion(wanted))chooseRegion(0);return true;}
function back(){if(busy())return;Module._tp_battle_close();session=null;screen='arena';detail=false;dragStart=dragNow=null;}
function leave(){if(busy())return;Module._tp_battle_close();session=null;screen=entryReturn;if(entryReturn==='card')cardPage=4;dragStart=dragNow=null;}
function abort(){if(saving)return false;const saved=session?.phase==='done';if(active())Module._tp_battle_close();session=null;screen='arena';detail=false;message=saved?'Arena beendet – Orden gespeichert.':'Arena beendet; kein weiterer Orden vergeben.';dragStart=dragNow=null;return true;}

function teamView(){
 if(!session?.team||session.mod!==Module||!active())return null;
 try{
  const v=JSON.parse(Module.ccall('tp_wt_view','string',[],[]));
  return v.arena&&v.session===session.token&&v.region===session.region?v:null;
 }catch(_){return null;}
}
function switchTo(index){
 if(busy()||tpSaveReplacing||window.TPCollection?.busy||
    window.TPCollection?.blocked||session?.phase!=='fighting'||
    !Number.isInteger(index)||index<0||index>5)return false;
 const v=teamView();
 if(!v?.live||v.seriesDone||fns.battleResolved()||
    index>=v.count||index===v.active||v.members[index].hp<=0)return false;
 return call('tp_wt_switch',index)===1;
}
function start(id=selected){
 if(screen!=='arena'||busy()||tpSaveReplacing||
    document.visibilityState!=='visible'||choice!=='none'||
    !Number.isInteger(id)||id<0||id>=data.leaders.length||
    window.TPTraining?.busy||window.TPMega?.busy||
    window.TPExpeditions?.busy||window.TPLeague?.busy||
    window.TPCollection?.busy||window.TPCollection?.blocked)return false;
 return startPaid(id);
}
async function startPaid(id){
 if(region===1&&!window.TPRegions?.available(1)){
  message=window.TPRegions?.reason(1)||'Johto ist gesperrt.';
  statusEl.textContent=message;return false;
 }
 if(!window.TPBattleEnergy?.supported||
    !window.TPArenaResult?.supported||
    typeof Module._tp_wt_arena_attach!=='function'){
  message='Bitte den aktuellen Spielkern laden.';return false;
 }
 if(!window.TPBattleEnergy.view?.arena.can){
  message=window.TPBattleEnergy.line('arena');return false;
 }
 const owner=region,mod=Module;
 const paid=(name,...args)=>scoped(mod,owner,name,...args);
 saving=true;message='';
 let ticket=0,durable=false,locked=false,hold=false;
 try{
  await window.TPArenaResult.prepare();
  if(Module!==mod||screen!=='arena'||region!==owner||
     document.visibilityState!=='visible'||choice!=='none'||
     tpSaveReplacing||window.TPCollection?.blocked||
     window.TPCollectionGame?.dialogOpen||
     window.TPMega?.busy||window.TPTraining?.busy||
     window.TPExpeditions?.busy||window.TPLeague?.busy||
     fns.wildPromptActive())throw Error('Arena-Startkontext geändert.');

  const state=TPCollection.read();
  TPCollectionModel.validate(state);
  const ids=state.team.length?state.team:
   state.active===null?[]:[state.active];
  if(!ids.length||ids.length>6)throw Error('Kein gültiges Arena-Team.');

  const members=ids.map(id=>{
   const m=state.mons.find(p=>p.id===id),stats=m?.data.stats;
   if(!m||!stats||!['atk','def','spe'].every(
    key=>Number.isInteger(stats[key])&&stats[key]>=1&&stats[key]<=65535
   ))throw Error('Kampfwerte des Arena-Teams fehlen.');
   return m;
  });
  if(call('tp_wt_stage_begin',members.length)!==1)
   throw Error('Teamvorbereitung abgelehnt.');
  members.forEach((m,index)=>{
   const s=m.data.stats;
   if(mod.ccall('tp_wt_stage_entry','number',[
    'number','number','number','number','number','number','number',
    'number','number','string'
   ],[
    index,m.id,m.dex,m.level,s.atk,s.def,s.spe,
    m.id===state.active?1:0,m.shiny?1:0,m.nickname
   ])!==1)throw Error('Teammitglied abgelehnt.');
  });

  tpSaveReplacing=true;tpSaveEpoch++;locked=true;
  ticket=paid('tp_energy_arena_begin',id);
  if(!ticket)throw Error('Arena-Start gerade nicht möglich.');
  const tentative=call('tp_f3_get',2);
  if(!tentative||call('tp_wt_arena_attach',tentative)!==1)
   throw Error('Arena-Team konnte nicht angehängt werden.');

  const bytes=exportStateBytes(mod);
  TPStoreTools.parseLegacy(bytes);
  if(await writeSave(bytes,true)!==true)
   throw Error('Energiekosten nicht gespeichert.');
  durable=true;
  const token=paid('tp_energy_arena_finish',ticket,1);
  if(token!==tentative)
   throw Error('Startbestätigung unklar – bitte App neu öffnen.');

  selected=id;
  session={
   region:owner,id,token,mod,team:true,phase:'fighting',
   since:performance.now(),error:'',rewards:[]
  };
  message='';dragStart=dragNow=null;
  battleReturn='arena';screen='battle';picture(id);
  if(document.visibilityState!=='visible'){
   Module._tp_battle_close();session=null;screen='arena';detail=false;
  }
  return true;
 }catch(error){
  if(ticket&&!durable){
   try{
    if(paid('tp_energy_arena_finish',ticket,0)!==1)hold=true;
   }catch(_){hold=true;}
  }else if(durable){
   hold=true;
  }
  message=hold?'Speicherabschluss unklar – bitte App neu öffnen.':
   error.message||String(error);
  statusEl.textContent=message;
  window.TPDiagnostics?.record('manager',error);
  return false;
 }finally{
  if(locked)tpSaveEpoch++;
  if(hold){tpSaveReplacing=true;saving=true;}
  else{if(locked)tpSaveReplacing=false;saving=false;}
 }
}

function checkEnd(){
 if(!session||session.mod!==Module||!active()||
    session.phase!=='fighting'||!fns.battleResolved()||
    window.TPTrainer.get(3))return false;
 complete();return true;
}
async function complete(){
 if(!session||saving||session.mod!==Module||!active()||
    !['fighting','failed'].includes(session.phase))return false;
 const s=session,v=teamView();
 if(!v?.seriesDone||v.resultDone)return false;
 saving=true;s.phase='saving';s.error='';s.won=v.won;
 try{
  await window.TPArenaResult.complete();
  const current=TPCollection.read();
  s.rewards=v.members.filter(m=>m.levelGains>0).map(m=>{
   const updated=current.mons.find(p=>p.id===m.id);
   return {
    id:m.id,gains:m.levelGains,
    name:updated?.nickname||fns.dexName(m.dex),
    level:updated?.level??m.level
   };
  });
  s.phase=v.won?(get(3)===3?'repeat':'done'):'lost';
  s.since=performance.now();
  if(v.won&&typeof playSfx==='function')playSfx(6);
  return true;
 }catch(error){
  const unsafe=window.TPCollection?.blocked;
  s.phase=unsafe?'unsafe':'failed';
  s.error=unsafe?'Speicherabschluss unklar – bitte App neu öffnen.':
   'Nicht gespeichert – Ergebnis erneut speichern.';
  s.since=performance.now();
  statusEl.textContent=s.error;
  window.TPDiagnostics?.record('manager',error);
  return false;
 }finally{
  saving=false;
  if(document.visibilityState!=='visible'&&
     !['failed','unsafe'].includes(s.phase)){
   if(active())Module._tp_battle_close();
   session=null;screen='arena';detail=false;
  }
 }
}

let arenaPage=null,arenaPageKey='';
let arenaPagePortrait=null,arenaPagePaintAt=-Infinity;
let arenaPageBadges=[];

function arenaPageHide(){if(arenaPage)arenaPage.hidden=true;}

function arenaPageNode(tag,text,cls){
 const el=document.createElement(tag);
 if(text!==undefined)el.textContent=text;
 if(cls)el.className=cls;
 return el;
}
function arenaPageButton(text,action,disabled=false){
 const el=arenaPageNode('button',text);el.type='button';el.disabled=disabled;
 el.addEventListener('click',()=>{
  if(screen!=='arena'||arenaPage?.hidden||busy()||tpSaveReplacing||
   document.visibilityState!=='visible'||el.disabled||!el.isConnected)return;
  action();
  if(screen==='arena')draw();else arenaPageHide();
 });
 return el;
}

function arenaPageActionIcon(kind){
 const symbol=arenaPageNode('canvas',undefined,'tp-arena-action-icon');
 symbol.width=24;symbol.height=24;symbol.setAttribute('aria-hidden','true');
 const paint=symbol.getContext('2d');
 if(!paint)return symbol;
 paint.strokeStyle='#315b83';paint.fillStyle='#315b83';paint.lineWidth=2;
 paint.lineCap='round';paint.lineJoin='round';
 if(kind==='region'){
  paint.beginPath();paint.arc(12,12,8,0,Math.PI*2);paint.stroke();
  paint.beginPath();paint.ellipse(12,12,4,8,0,0,Math.PI*2);paint.stroke();
  paint.beginPath();paint.moveTo(4,12);paint.lineTo(20,12);paint.stroke();
 }else if(kind==='case'){
  paint.strokeRect(3,7,18,14);paint.strokeRect(9,3,6,4);
  for(let row=0;row<2;row++)for(let col=0;col<4;col++)
   paint.fillRect(5+col*4,10+row*5,2,2);
 }else if(kind==='league'){
  paint.fillStyle='#d7b768';paint.fillRect(7,4,10,9);
  paint.strokeRect(7,4,10,9);
  paint.beginPath();
  paint.moveTo(7,6);paint.lineTo(3,6);paint.lineTo(3,10);paint.lineTo(7,12);
  paint.moveTo(17,6);paint.lineTo(21,6);paint.lineTo(21,10);paint.lineTo(17,12);
  paint.stroke();
  paint.beginPath();paint.moveTo(12,13);paint.lineTo(12,19);paint.stroke();
  paint.fillStyle='#315b83';paint.fillRect(7,20,10,2);
 }
 if(kind==='challenge'){
  symbol.setAttribute('data-arena-icon','challenge-vs');
  paint.fillStyle='#315b83';
  paint.font='700 16px monospace';
  paint.textAlign='left';
  paint.textBaseline='alphabetic';
  const vsMetrics=paint.measureText('VS')||{};
  const vsWidth=Number.isFinite(vsMetrics.width)?vsMetrics.width:19;
  const vsLeft=Number.isFinite(vsMetrics.actualBoundingBoxLeft)?
   vsMetrics.actualBoundingBoxLeft:0;
  const vsRight=Number.isFinite(vsMetrics.actualBoundingBoxRight)?
   vsMetrics.actualBoundingBoxRight:vsWidth;
  const vsAscent=Number.isFinite(vsMetrics.actualBoundingBoxAscent)?
   vsMetrics.actualBoundingBoxAscent:12;
  const vsDescent=Number.isFinite(vsMetrics.actualBoundingBoxDescent)?
   vsMetrics.actualBoundingBoxDescent:0;
  paint.fillText('VS',
   symbol.width/2+(vsLeft-vsRight)/2,
   symbol.height/2+(vsAscent-vsDescent)/2);
 }
 return symbol;
}

function arenaPagePaint(){
 if(!arenaPagePortrait||arenaPage?.hidden)return;
 const now=performance.now();
 if(now-arenaPagePaintAt<140)return;
 arenaPagePaintAt=now;
 for(const item of arenaPageBadges){
  const target=item.canvas.getContext('2d');
  if(!target)continue;
  target.clearRect(0,0,64,64);
  const painter=region===1?window.TPBadgeUI?.drawJohto:window.TPBadgeUI?.draw;
  if(typeof painter==='function')
   painter(item.index,32,32,25,true,target);
 }
 const paint=arenaPagePortrait.getContext('2d');if(!paint)return;
 paint.clearRect(0,0,224,112);paint.imageSmoothingEnabled=false;
 paint.fillStyle='#f6f9fa';paint.fillRect(0,0,224,112);
 const image=picture(selected);
 if(image){
  const scale=Math.min(1.5,116/image.width,104/image.height);
  paint.drawImage(image,112-image.width*scale/2,108-image.height*scale,
   image.width*scale,image.height*scale);
 }else{
  paint.fillStyle='#526574';paint.textAlign='center';paint.font='12px monospace';
  paint.fillText('Lokale Grafik fehlt',112,62);
 }
}
function arenaPageEnsure(host){
 if(!arenaPage){
  arenaPage=arenaPageNode('section');arenaPage.id='tp-arena-page';
  arenaPage.setAttribute('role','dialog');
  arenaPage.setAttribute('aria-modal','true');
  host.appendChild(arenaPage);
  arenaPage.addEventListener('keydown',event=>{
   if(screen!=='arena'||arenaPage.hidden)return;
   if(event.key==='Escape'&&!busy()&&!tpSaveReplacing){
    event.preventDefault();event.stopPropagation();
    if(detail||tab==='badges'){
     arenaSubBack();draw();
    }else{leave();arenaPageHide();}
    return;
   }
   if(event.key!=='Tab')return;
   const items=Array.from(arenaPage.querySelectorAll('button'))
    .filter(el=>!el.disabled);
   const first=items[0],last=items[items.length-1];
   if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();last?.focus();
   }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();first?.focus();
   }
  });
 }
}


let arenaSubCards=[],arenaSubCanvas=null,arenaSubCaption=null;
let arenaSubAt=-Infinity,arenaSubBuffer=null;


function arenaCaseRegions(){
 return [0,1].filter(id=>id===0||!!window.TPRegions?.available(id));
}
function arenaCaseMove(step){
 if(screen!=='arena'||detail||tab!=='badges'||busy()||tpSaveReplacing||
  ![-1,1].includes(step)||window.TPRegions?.locked())return false;
 const regions=arenaCaseRegions(),index=regions.indexOf(region);
 const wanted=regions[index+step];
 if(index<0||wanted===undefined||!chooseRegion(wanted))return false;
 tab=origin='badges';arenaPageKey='';return true;
}
const arenaSubCropCache=new WeakMap();
function arenaSubBounds(image){
 if(arenaSubCropCache.has(image))return arenaSubCropCache.get(image);
 let left=image.width,top=image.height,right=-1,bottom=-1;
 for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
  if(image.data[(y*image.width+x)*4+3]){
   left=Math.min(left,x);right=Math.max(right,x);
   top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
 }
 const result=right>=left?{
  x:left,y:top,w:right-left+1,h:bottom-top+1
 }:null;
 arenaSubCropCache.set(image,result);return result;
}

function arenaSubBack(){
 if(busy()||tpSaveReplacing)return;
 if(detail){detail=false;tab=origin;}else tab='leaders';
 choosingRegion=false;message='';arenaPageKey='';
}
function arenaSubMember(dex,level){
 const card=arenaPageNode('article',undefined,'tp-arena-member');
 card.setAttribute('data-arena-member',String(dex));
 const image=arenaPageNode('canvas');
 image.width=96;image.height=96;
 image.setAttribute('aria-hidden','true');
 arenaSubCards.push({canvas:image,dex});
 const info=arenaPageNode('div');
 info.append(arenaPageNode('p',fns.dexName(dex)),
  arenaPageNode('small','Lv. '+level));
 const types=arenaPageNode('div',undefined,'tp-arena-types');
 for(const type of [...new Set(
  [fns.dexType1(dex),fns.dexType2(dex)].filter(n=>n>0)
 )]){
  const chip=arenaPageNode('span',TYPE_NAMES[type]||String(type));
  const raw=typeColor565(type),red=((raw>>11)&31)*255/31;
  const green=((raw>>5)&63)*255/63,blue=(raw&31)*255/31;
  chip.style.backgroundColor=rgb565(raw);
  chip.style.color=red*.299+green*.587+blue*.114>145?'#202820':'#ffffff';
  types.append(chip);
 }
 info.append(types);card.append(image,info);return card;
}
function arenaSubPaint(){
 const now=performance.now();
 if(now-arenaSubAt<140)return;
 arenaSubAt=now;
 if(arenaSubCaption){
  const p=arenaSubCaption.getContext('2d');
  p.clearRect(0,0,48,44);
  const image=picture(selected);
  if(image){
   const scale=Math.min(44/image.width,44/image.height);
   p.imageSmoothingEnabled=false;
   p.drawImage(image,24-image.width*scale/2,
    44-image.height*scale,image.width*scale,image.height*scale);
  }
 }
 for(const item of arenaSubCards){
  const p=item.canvas.getContext('2d');
  if(!p)continue;
  p.clearRect(0,0,96,96);
  const sprite=spriteFor(item.dex,false);
  if(!sprite){ensureSprite(item.dex);continue;}
  const action=sprite.actions[TPAct.idle];
  if(!action)continue;
  const image=frameImageData(
   sprite,TPAct.idle,frameIndexAt(action,now,true)
  );
  if(!image)continue;
  if(!arenaSubBuffer)arenaSubBuffer=document.createElement('canvas');
  arenaSubBuffer.width=image.width;
  arenaSubBuffer.height=image.height;
  arenaSubBuffer.getContext('2d').putImageData(image,0,0);
  const crop=arenaSubBounds(image);
  if(!crop)continue;
  const scale=Math.min(4,92/crop.w,92/crop.h);
  p.imageSmoothingEnabled=false;
  p.drawImage(arenaSubBuffer,crop.x,crop.y,crop.w,crop.h,
   48-crop.w*scale/2,48-crop.h*scale/2,
   crop.w*scale,crop.h*scale);
 }
 if(arenaSubCanvas){
  const p=arenaSubCanvas.getContext('2d');
  p.clearRect(0,0,224,112);
  const painter=region===1?window.TPBadgeUI?.drawJohto:window.TPBadgeUI?.draw;
  if(typeof painter==='function')
   painter(selected,112,56,40,owned(selected),p);
 }
 for(const item of arenaPageBadges){
  const p=item.canvas.getContext('2d');
  if(!p)continue;
  p.clearRect(0,0,64,64);
  const painter=region===1?window.TPBadgeUI?.drawJohto:window.TPBadgeUI?.draw;
  if(typeof painter==='function')
   painter(item.index,32,32,25,owned(item.index),p);
 }
}
function arenaSubpageDraw(){
 if(screen!=='arena'||choosingRegion||(!detail&&tab!=='badges')||
  typeof document.createElement!=='function'||
  typeof document.getElementById!=='function')return false;
 const host=document.getElementById('tp-game-shell');
 if(!host)return false;
 arenaPageEnsure(host);arenaPage.hidden=false;
 const mode=detail?'detail':'case',m=mask(),leader=data.leaders[selected];
 const energy=window.TPBattleEnergy?.line('arena')||'';
 const caseRegions=arenaCaseRegions();
 const casesLocked=!!window.TPRegions?.locked();
 const canStart=m>=0&&!busy()&&!tpSaveReplacing&&
  !window.TPCollection?.blocked&&
  (!window.TPBattleEnergy||!!window.TPBattleEnergy.view?.arena.can);
 const key=JSON.stringify([
  'arena-sub',mode,region,selected,m,busy(),tpSaveReplacing,
  message,energy,canStart,caseRegions.join(','),casesLocked
 ]);
 if(key!==arenaPageKey){
  arenaPageKey=key;arenaPage.replaceChildren();arenaPagePortrait=null;
  arenaPageBadges=[];arenaSubCards=[];arenaSubCanvas=null;
  arenaSubCaption=null;arenaSubAt=-Infinity;
  arenaPage.setAttribute('data-arena-view',mode);
  arenaPage.setAttribute('data-arena-region',String(region));
  const title=detail?leader.name:'Orden · '+label();
  arenaPage.setAttribute('aria-label',title);
  if(typeof window.hubDexDesignTokens==='function')
   for(const [name,value]of Object.entries(window.hubDexDesignTokens()))
    host.style.setProperty(name,value);

  const head=arenaPageNode('header',undefined,'tp-activity-head');
  const heading=arenaPageNode('h2',title);
  heading.id='tp-arena-title';
  arenaPage.setAttribute('aria-labelledby',heading.id);
  const back=arenaPageButton('Zurück',arenaSubBack,busy()||tpSaveReplacing);
  back.setAttribute('data-arena-subback','');
  head.append(heading,back);

  const frame=arenaPageNode('div',undefined,'tp-activity-frame');
  frame.setAttribute('aria-hidden','true');
  for(const cls of ['tp-pokedex-display tp-pokedex-display-left',
   'tp-pokedex-display tp-pokedex-display-right','tp-pokedex-spine'])
   frame.append(arenaPageNode('span',undefined,cls));

  const caption=arenaPageNode('div',undefined,'tp-arena-sub-caption');
  if(detail){
   arenaSubCaption=arenaPageNode('canvas');
   arenaSubCaption.width=48;arenaSubCaption.height=44;
   arenaSubCaption.setAttribute('aria-hidden','true');
   caption.append(arenaSubCaption,
    arenaPageNode('span',leader.city+' · '+leader.badge));
  }else caption.append(arenaPageNode('span',
   m<0?'Ordensstand nicht lesbar':
   Array.from({length:8},(_,i)=>owned(i,m)?1:0)
    .reduce((a,b)=>a+b,0)+' von 8 Orden'));

  const body=arenaPageNode('div',undefined,'tp-activity-body');
  const left=arenaPageNode('div',undefined,'tp-activity-column tp-activity-left');
  const right=arenaPageNode('div',undefined,'tp-activity-column tp-activity-right');

  const footer=arenaPageNode('div',undefined,'tp-arena-sub-footer');
  const detailActions=arenaPageNode('div',undefined,'tp-arena-detail-actions');
  if(detail){
   const columns=[
    arenaPageNode('div',undefined,'tp-arena-team-list'),
    arenaPageNode('div',undefined,'tp-arena-team-list')
   ];
   leader.team.forEach(([dex,level],i)=>
    columns[i%2].append(arenaSubMember(dex,level)));
   for(const column of columns)
    column.style.setProperty('--tp-arena-team-rows',
     '3');
   left.append(columns[0]);right.append(columns[1]);
   const challengeLabel=owned(selected,m)?
    'Erneut herausfordern':'Herausfordern';
   const fight=arenaPageButton('',()=>{
     const task=start(selected);
     if(task&&typeof task.then==='function')
      task.then(()=>{
       if(screen==='arena')draw();else arenaPageHide();
      }).catch(error=>{
       message=error.message||'Kampfstart fehlgeschlagen.';
       if(screen==='arena')draw();
      });
    },!canStart);
   fight.setAttribute('data-arena-challenge','');
   fight.setAttribute('aria-label',challengeLabel);
   fight.setAttribute('title',challengeLabel);
   fight.className='tp-arena-detail-action';
   fight.append(arenaPageActionIcon('challenge'));
   detailActions.append(fight);
  }else{
   const grid=arenaPageNode('div',undefined,'tp-arena-list');
   grid.setAttribute('data-arena-list','badges');
   for(let i=0;i<8;i++){
    const item=data.leaders[i],got=owned(i,m);
    const pick=arenaPageButton('',()=>{
     selected=i;message='';
    },busy()||tpSaveReplacing);
    pick.setAttribute('data-arena-case-badge',String(i));
    pick.setAttribute('data-arena-leader',String(i));
    pick.setAttribute('data-owned',String(got));
    pick.setAttribute('aria-pressed',String(i===selected));
    pick.setAttribute('aria-label',
     item.badge+' · '+(got?'Erhalten':'Noch offen'));
    const symbol=arenaPageNode('canvas',undefined,'tp-arena-badge-symbol');
    symbol.width=64;symbol.height=64;
    symbol.setAttribute('aria-hidden','true');
    pick.append(symbol);grid.append(pick);
    arenaPageBadges.push({canvas:symbol,index:i});
   }
   left.append(grid);
   const card=arenaPageNode('article',undefined,'tp-activity-card');
   const info=arenaPageNode('div',undefined,'tp-activity-info');
   info.tabIndex=0;
   arenaSubCanvas=arenaPageNode('canvas',undefined,'tp-arena-portrait');
   arenaSubCanvas.width=224;arenaSubCanvas.height=112;
   arenaSubCanvas.setAttribute('role','img');
   arenaSubCanvas.setAttribute('aria-label',leader.badge);
   info.append(arenaPageNode('h3',leader.badge),arenaSubCanvas,
    arenaPageNode('p',leader.name),
    arenaPageNode('p',m<0?'Stand nicht lesbar':
     owned(selected,m)?date(selected):'Noch nicht erhalten'));
   const open=arenaPageButton('Arena ansehen',()=>{
    origin='badges';detail=true;
   },busy()||tpSaveReplacing||m<0);
   open.setAttribute('data-arena-open','');
   card.append(info,open);right.append(card);
   const pager=arenaPageNode('div',undefined,'tp-arena-case-pager');
   const position=caseRegions.indexOf(region);
   const previous=arenaPageButton('',()=>arenaCaseMove(-1),
    busy()||tpSaveReplacing||casesLocked||position<=0);
   previous.className='tp-arena-case-nav';
   previous.setAttribute('data-arena-case-prev','');
   previous.setAttribute('aria-label','Vorheriger Ordenkoffer');
   previous.setAttribute('title','Vorheriger Ordenkoffer');
   previous.append(arenaPageNode('span','‹','tp-arena-arrow-face'));
   const next=arenaPageButton('',()=>arenaCaseMove(1),
    busy()||tpSaveReplacing||casesLocked||
    position<0||position>=caseRegions.length-1);
   next.className='tp-arena-case-nav';
   next.setAttribute('data-arena-case-next','');
   next.setAttribute('aria-label','Nächster Ordenkoffer');
   next.setAttribute('title','Nächster Ordenkoffer');
   next.append(arenaPageNode('span','›','tp-arena-arrow-face'));
   const current=arenaPageNode('span',
    label()+'\\n'+(position+1)+' / '+caseRegions.length,
    'tp-arena-case-label');
   current.textContent=label()+'\n'+(position+1)+' / '+caseRegions.length;
   pager.append(previous,current,next);footer.append(pager);
  }

  body.append(left,right);
  const status=arenaPageNode('p',
   message||(detail?energy:''),'tp-arena-frame-status');
  status.setAttribute('role','status');
  footer.append(status);
  arenaPage.append(head,frame,caption,body,footer);
  if(detail)arenaPage.append(detailActions);
 }
 statusEl.textContent=detail?'Arena · '+leader.name:'Arena · Ordenkoffer';
 arenaSubPaint();return true;
}

function arenaPageDraw(){
 if(screen!=='arena'||detail||tab!=='leaders'||
  typeof document.createElement!=='function'||
  typeof document.getElementById!=='function'){
  arenaPageHide();return false;
 }
 const host=document.getElementById('tp-game-shell');
 if(!host){arenaPageHide();return false;}
 arenaPageEnsure(host);
 arenaPage.hidden=false;
 const m=mask(),leader=data.leaders[selected];
 const key=JSON.stringify([
  region,selected,choosingRegion,m,busy(),tpSaveReplacing,message
 ]);
 if(key!==arenaPageKey){
  arenaPageKey=key;arenaPage.replaceChildren();
  arenaPagePortrait=null;arenaPagePaintAt=-Infinity;arenaPageBadges=[];
  arenaPage.setAttribute('data-arena-view','leaders');
  arenaPage.setAttribute('data-arena-region',String(region));
  arenaPage.setAttribute('aria-label','Arenen · '+label());
  if(typeof window.hubDexDesignTokens==='function')
   for(const [name,value]of Object.entries(window.hubDexDesignTokens()))
    host.style.setProperty(name,value);

  const head=arenaPageNode('header',undefined,'tp-activity-head');
  const title=arenaPageNode('h2','Arenen · '+label());
  title.id='tp-arena-title';
  arenaPage.setAttribute('aria-labelledby',title.id);
  const exit=arenaPageButton('Zurück',()=>leave(),busy()||tpSaveReplacing);
  exit.setAttribute('data-arena-exit','');

  const regionButton=arenaPageButton('',()=>{
   choosingRegion=!choosingRegion;
  },busy()||tpSaveReplacing||!!window.TPRegions?.locked());
  regionButton.append(arenaPageActionIcon('region'),arenaPageNode('span',label()));
  regionButton.setAttribute('data-arena-region-toggle','');
  regionButton.setAttribute('data-arena-option','regions');
  regionButton.setAttribute('aria-label','Region auswählen · '+label());
  regionButton.setAttribute('title','Region auswählen · '+label());
  regionButton.setAttribute('aria-expanded',String(choosingRegion));

  const badgeCase=arenaPageButton('',()=>{
   choosingRegion=false;tab='badges';
  },busy()||tpSaveReplacing);
  badgeCase.append(arenaPageActionIcon('case'));
  badgeCase.setAttribute('data-arena-option','badges');
  badgeCase.setAttribute('aria-label','Ordenkoffer · '+label());
  badgeCase.setAttribute('title','Ordenkoffer · '+label());

  const leagueReady=m>=0&&(m&255)===255;
  const leagueButton=arenaPageButton('',()=>{
   const current=mask();
   if(current>=0&&(current&255)===255)
    window.TPLeague?.open(region);
  },busy()||tpSaveReplacing||!leagueReady);
  leagueButton.append(arenaPageActionIcon('league'));
  leagueButton.setAttribute('data-arena-option','league');
  leagueButton.setAttribute('aria-label','Liga · '+label()+
   (leagueReady?'':' · benötigt alle acht Orden'));
  leagueButton.setAttribute('title',leagueReady?
   'Liga · '+label():'Erst alle acht '+label()+'-Orden erhalten');

  head.append(title,exit);
  const actions=arenaPageNode('div',undefined,'tp-arena-actions');
  actions.setAttribute('role','group');
  actions.setAttribute('aria-label','Arena-Aktionen');
  actions.append(regionButton,badgeCase,leagueButton);


  const frame=arenaPageNode('div',undefined,'tp-activity-frame');
  frame.setAttribute('aria-hidden','true');
  for(const cls of ['tp-pokedex-display tp-pokedex-display-left',
   'tp-pokedex-display tp-pokedex-display-right','tp-pokedex-spine'])
   frame.append(arenaPageNode('span',undefined,cls));

  const body=arenaPageNode('div',undefined,'tp-activity-body');
  const left=arenaPageNode('div',undefined,'tp-activity-column tp-activity-left');
  const right=arenaPageNode('div',undefined,'tp-activity-column tp-activity-right');
  const list=arenaPageNode('div',undefined,'tp-arena-list');


  if(choosingRegion){
   list.setAttribute('data-arena-list','regions');
   for(const id of [0,1]){
    const enabled=id===0||!!window.TPRegions?.available(id);
    const pick=arenaPageButton(id===0?'Kanto':'Johto',()=>{
     if(chooseRegion(id)){
      arenaPageKey='';
     }
    },busy()||tpSaveReplacing||!enabled||!!window.TPRegions?.locked());
    pick.setAttribute('data-arena-region',String(id));
    pick.setAttribute('aria-pressed',String(region===id));
    list.append(pick);
   }
  }else{
   list.setAttribute('data-arena-list','badges');
   for(let i=0;i<data.leaders.length;i++){
    const item=data.leaders[i],got=m>=0&&owned(i,m);
    const pick=arenaPageButton('',()=>{
     selected=i;origin='leaders';message='';
    },busy()||tpSaveReplacing);
    const description=item.badge+' · '+item.name+' · '+
     (m<0?'Stand nicht lesbar':got?'Orden erhalten':'Noch offen');
    pick.setAttribute('data-arena-leader',String(i));
    pick.setAttribute('aria-pressed',String(i===selected));
    pick.setAttribute('data-owned',String(got));
    pick.setAttribute('aria-label',description);
    pick.setAttribute('title',description);
    const symbol=arenaPageNode('canvas',undefined,'tp-arena-badge-symbol');
    symbol.width=64;symbol.height=64;
    symbol.setAttribute('aria-hidden','true');
    pick.append(symbol);
    arenaPageBadges.push({canvas:symbol,index:i});
    list.append(pick);
   }
  }
  left.append(list);

  const card=arenaPageNode('article',undefined,'tp-activity-card');
  const info=arenaPageNode('div',undefined,'tp-activity-info');
  info.tabIndex=0;
  arenaPagePortrait=arenaPageNode('canvas',undefined,'tp-arena-portrait');
  arenaPagePortrait.width=224;arenaPagePortrait.height=112;
  arenaPagePortrait.setAttribute('role','img');
  arenaPagePortrait.setAttribute('aria-label','Arenaleiter '+leader.name);
  arenaPagePortrait.setAttribute('data-arena-portrait-id',leader.id);
  info.append(arenaPageNode('h3',leader.name),arenaPagePortrait,
   arenaPageNode('p',leader.city,'tp-arena-city'),
   arenaPageNode('p',leader.badge));

  const open=arenaPageButton('Arena ansehen',()=>{
   detail=true;origin='leaders';message='';
  },busy()||tpSaveReplacing||m<0);
  open.setAttribute('data-arena-open','');
  card.append(info,open);right.append(card);
  body.append(left,right);

  const status=arenaPageNode('p',
   message||(m<0?'Ordensstand nicht unterstützt.':''),
   'tp-activity-status');
  status.setAttribute('role','status');
  arenaPage.append(head,frame,actions,body,status);
 }
 statusEl.textContent='Arena · '+label()+'-Auswahl';
 arenaPagePaint();return true;
}

function text(value,x,y,size=16,color=UI.ink,max=390){ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle=color;ctx.font=`${size}px monospace`;ctx.fillText(String(value),x,y,max);}
function button(label,x,y,w=326,h=42,enabled=true){ctx.fillStyle=enabled?UI.white:'#e5e5df';roundRect(x,y,w,h,10);ctx.fill();ctx.strokeStyle=enabled?UI.ink:UI.track;ctx.lineWidth=1;ctx.stroke();if(window.TPNavBack?.isBackLabel(label))
 window.TPNavBack.draw(ctx,x+w/2-12,y+h/2-12,24,enabled?'#315b83':'#747474');
 else text(label,x+w/2,y+h/2+6,16,enabled?UI.ink:'#747474',w-16);}
function badge(id,x,y,r=24,owned=true){
 if(region===1){if(window.TPBadgeUI?.drawJohto)window.TPBadgeUI.drawJohto(Number(id),x,y,r,owned);else{ctx.strokeStyle=UI.ink;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}return;}if(window.TPBadgeUI){window.TPBadgeUI.draw(Number(id),x,y,r,owned);return;}
 const l=data.leaders[id];ctx.save();ctx.translate(x,y);ctx.scale(r/30,r/30);ctx.strokeStyle=owned?l.color:'#8f9292';ctx.fillStyle=owned?l.color:'#dedfda';ctx.lineWidth=2;
 function poly(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();ctx.stroke();}
 if(id===0){poly([[-15,-25],[15,-25],[26,-11],[26,11],[15,25],[-15,25],[-26,11],[-26,-11]]);ctx.beginPath();ctx.moveTo(-15,-25);ctx.lineTo(15,25);ctx.moveTo(15,-25);ctx.lineTo(-15,25);ctx.stroke();}
 else if(id===1){ctx.beginPath();ctx.moveTo(0,-29);ctx.bezierCurveTo(10,-13,24,1,24,12);ctx.bezierCurveTo(24,35,-24,35,-24,12);ctx.bezierCurveTo(-24,1,-10,-13,0,-29);ctx.fill();ctx.stroke();}
 else if(id===2){const pts=[];for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,d=i%2?18:29;pts.push([Math.cos(a)*d,Math.sin(a)*d]);}poly(pts);ctx.fillStyle=owned?'#6a9ba2':'#f7efe6';ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();}
 else if(id===3){const colors=['#b53a3a','#a27819','#718141','#39814e','#397ab6','#7466a1','#ac5a91','#c37d68'];for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.fillStyle=owned?colors[i]:'#dedfda';ctx.beginPath();ctx.arc(Math.cos(a)*17,Math.sin(a)*17,11,0,Math.PI*2);ctx.fill();ctx.stroke();}ctx.fillStyle=owned?'#f4d872':'#eee';ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.stroke();}
 else if(id===4){ctx.beginPath();ctx.moveTo(0,28);ctx.bezierCurveTo(-48,-4,-18,-37,0,-13);ctx.bezierCurveTo(18,-37,48,-4,0,28);ctx.fill();ctx.stroke();}
 else if(id===5){ctx.beginPath();ctx.arc(0,0,27,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=owned?'#f4d872':'#eee';ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.stroke();}
 else if(id===6){poly([[0,-30],[8,-12],[23,-21],[18,-1],[29,8],[11,11],[0,29],[-11,11],[-29,8],[-18,-1],[-23,-21],[-8,-12]]);}
 else{ctx.beginPath();ctx.moveTo(-18,26);ctx.bezierCurveTo(-41,-7,-8,-27,24,-28);ctx.bezierCurveTo(27,8,6,35,-18,26);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-24,32);ctx.lineTo(15,-18);ctx.stroke();}
 ctx.restore();
}
function owned(id,m=mask()){return m>=0&&!!(m&(1<<id));}
function date(id){const value=regional(region,'tp_f3_date',id);return value?new Date(value*1000).toLocaleDateString('de-DE'):'Datum nicht hinterlegt';}
function draw(){
 if(arenaSubpageDraw())return;
 if(arenaPageDraw())return;
 if(choosingRegion){regionPicker();return;}
 ctx.fillStyle='#f7efe6';ctx.fillRect(0,0,466,466);const m=mask();
 if(m<0){button('Regionen',348,6,108,30);text('Ordensstand nicht unterstützt',233,170,20);text('Keine Arena-Vergabe möglich.',233,205,16);button('Zurück',70,410);return;}
 if(detail){drawDetail(m);return;}
 text((tab==='badges'?'Ordenkoffer · ':'Arenen · ')+label(),190,30,20,UI.ink,280);button('Regionen',348,6,108,30);button('Arenen',70,44,156,34);button('Orden',240,44,156,34);
 if(tab==='badges'){drawCase(m);return;}
 text(tab==='badges'?label()+' · '+Array.from({length:8},(_,i)=>owned(i,m)?1:0).reduce((a,b)=>a+b,0)+' von 8':(region===1?'Gold/Silber':'Rot/Blau')+' · feste Originallevel',233,97,13);
 for(let i=0;i<8;i++){
  const l=data.leaders[i],x=i%2?242:44,y=104+Math.floor(i/2)*72,got=owned(i,m);
  ctx.fillStyle=UI.white;roundRect(x,y,180,66,11);ctx.fill();ctx.strokeStyle=got?l.color:'#c8cbc5';ctx.lineWidth=got?2:1;ctx.stroke();badge(i,x+30,y+31,19,tab==='leaders'||got);
  text(tab==='badges'?l.badge:l.name,x+113,y+23,15,UI.ink,124);text(tab==='badges'?(got?'✓ Erhalten':'Noch offen'):l.city,x+113,y+43,11,UI.ink,124);
  if(tab==='leaders')text(l.team.length+' Pokémon · Lv. '+Math.min(...l.team.map(m=>m[1]))+'–'+Math.max(...l.team.map(m=>m[1])),x+113,y+58,10,UI.ink,124);
 }
 if(message)text(message,233,403,11,UI.barBad);button('Liga',70,414,126,36);button('Zurück',206,414,190,36);statusEl.textContent='Arena · '+(tab==='badges'?'Ordenkoffer':label()+'-Auswahl');
}
function drawCase(m){
 text('Deine '+label()+'-Sammlung · '+Array.from({length:8},(_,i)=>owned(i,m)?1:0).reduce((a,b)=>a+b,0)+' von 8',233,101,14);
 ctx.fillStyle='#54645b';roundRect(38,113,390,239,22);ctx.fill();ctx.fillStyle='#e7e5d9';roundRect(48,123,370,219,16);ctx.fill();ctx.strokeStyle='#9b9279';ctx.lineWidth=2;ctx.stroke();
 for(let i=0;i<8;i++){const x=98+(i%4)*90,y=132+Math.floor(i/4)*105,got=owned(i,m);ctx.fillStyle=got?'#fffdf4':'#d1d7cd';roundRect(x-39,y,78,94,12);ctx.fill();ctx.strokeStyle=got?'#b49959':'#9ba89a';ctx.lineWidth=got?2:1;ctx.stroke();badge(i,x,y+36,25,got);text(data.leaders[i].badge,x,y+74,10,UI.ink,74);text(got?'✓ Erhalten':'Offen',x,y+88,9,UI.ink,74);}
 if(message)text(message,233,390,11,UI.barBad);button('Zurück zum Kampfbereich',70,414,326,36);statusEl.textContent='Arena · Ordenkoffer';
}
function drawDetail(m){
 const l=data.leaders[selected],got=owned(selected,m);
 TPOpponentTeam.header({name:l.name,subtitle:label()+' · '+l.city,color:l.color,image:picture(selected),kind:'arena'});
 badge(selected,119,43,17,got);
 text(l.badge+(got?' · Erhalten':''),283,86,16,UI.ink,280);
 TPOpponentTeam.draw(l.team,{y:110,rowHeight:60});
 text(got?'Erstmals erhalten: '+date(selected):'Sieg über das ganze Team gibt diesen Orden.',233,303,12);text(message||'Dein geplantes Team kämpft; leeres Team: Pflege-Pokémon.',233,321,12,message?UI.barBad:UI.ink);
 button(got?'Erneut herausfordern':'Arena herausfordern',70,333,326,42,!busy()&&!tpSaveReplacing&&(!window.TPBattleEnergy||!!window.TPBattleEnergy.view?.arena.can));if(window.TPBattleEnergy)text(window.TPBattleEnergy.line('arena'),233,395,11,UI.ink,410);button('Zurück',70,420,326,30,!busy());statusEl.textContent='Arena · '+l.name;
}
function tap(x,y){
 if(busy())return;if(choosingRegion){if(y>=414){choosingRegion=false;return;}if(x>=60&&x<=406){if(y>=125&&y<=193)chooseRegion(0);else if(y>=238&&y<=306)chooseRegion(1);}return;}if(x>=348&&x<=456&&y>=6&&y<=36&&!detail){if(!active()&&!tpSaveReplacing&&!window.TPRegions?.locked())choosingRegion=true;return;}if(mask()<0){if(x>=70&&x<=396&&y>=410&&y<=452)leave();return;}
 if(detail){if(x<70||x>396)return;if(y>=333&&y<=375)start(selected);else if(y>=420&&y<=450){detail=false;tab=origin;message='';}return;}
 if(y>=44&&y<=78){if(x>=70&&x<=226)tab='leaders';else if(x>=240&&x<=396)tab='badges';return;}
 if(tab==='badges'){for(let i=0;i<8;i++){const cx=98+i%4*90,top=132+Math.floor(i/4)*105;if(x>=cx-39&&x<=cx+39&&y>=top&&y<=top+94){selected=i;origin=tab;detail=true;message='';return;}}if(x>=70&&x<=396&&y>=414&&y<=450)leave();return;}
 for(let i=0;i<8;i++){const left=i%2?242:44,top=104+Math.floor(i/2)*72;if(x>=left&&x<=left+180&&y>=top&&y<=top+66){selected=i;origin=tab;detail=true;message='';return;}}
 if(y>=414&&y<=450){if(x>=70&&x<=196)window.TPLeague?.open(region);else if(x>=206&&x<=396)leave();}
}
function drawLeader(id,x,y,w,h){
 const image=picture(id);if(image){const s=Math.min(w/image.width,h/image.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(image,x+(w-image.width*s)/2,y+h-image.height*s,image.width*s,image.height*s);return;}
 ctx.fillStyle='#a9b5ae';ctx.beginPath();ctx.arc(x+w/2,y+29,21,0,Math.PI*2);ctx.fill();roundRect(x+w/2-27,y+54,54,h-54,14);ctx.fill();ctx.strokeStyle='#83938a';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(x+w/2+20,y+65);ctx.lineTo(x+w+10,y+80);ctx.stroke();text('Grafik nicht geladen',x+w/2,y+h+16,10,UI.ink,136);
}

function handover(now){
 const s=session,l=data.leaders[s.id],v=teamView();
 const player=v?.members[v.active];
 const headline=s.phase==='saving'?'Arena-Ergebnis speichern …':
  s.phase==='failed'?'Ergebnis nicht gespeichert':
  s.phase==='unsafe'?'Bitte App neu öffnen':
  s.phase==='lost'?'Arena verloren':'Arena gewonnen!';
 ctx.fillStyle='#f7efe6';ctx.fillRect(0,0,466,466);
 text(headline,233,40,23);
 text(l.name+' · '+l.city,233,70,16);
 drawLeader(s.id,62,130,110,140);
 if(player)TPBattleView.drawMember(player,340,286,110);
 if(s.won){
  const awarded=s.phase==='done';
  const reduced=typeof matchMedia==='function'&&
   matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress=awarded?(reduced?1:
   Math.max(0,Math.min(1,(now-s.since)/1000))):0;
  const x=awarded?164+69*(1-(1-progress)**3):233;
  badge(s.id,x,218,awarded?22+progress*21:36,s.phase!=='failed');
 }
 text(l.name,117,304,15);
 text(player?(player.nick||TPBattleView.label(player)):'',340,304,15,UI.ink,160);
 const line=s.phase==='saving'?'Bitte kurz warten.':
  s.phase==='repeat'?'Orden bereits erhalten – Levelboni gespeichert.':
  s.phase==='lost'?'Kein Orden. Verdiente Levelboni wurden gespeichert.':
  s.phase==='done'?l.name+' überreicht dir den '+l.badge+'!':
  'Noch keine neue Belohnung bestätigt.';
 text(line,233,332,14);
 const rewards=s.rewards||[];
 text(s.error||(rewards.length?
  rewards.map(r=>r.name+' Lv. '+r.level).join(' · '):
  ['done','repeat','lost'].includes(s.phase)?'Keine zusätzlichen Levelboni.':''),
  233,355,11,s.error?UI.barBad:UI.ink,438);
 if(!saving&&s.phase!=='unsafe'){
  button(s.phase==='failed'?'Speichern erneut versuchen':
   s.phase==='lost'?'Zur Arenaübersicht':'Ordenkoffer öffnen',70,371,326,36);
  button(s.phase==='failed'?'Arena verlassen':'Weiter',70,418,326,32);
 }
 statusEl.textContent='Arena · '+s.phase;
}
function intercept(now){
 if(!session||session.mod!==Module||!active())return false;
 checkEnd();
 if(!['saving','done','repeat','lost','failed','unsafe'].includes(session.phase))
  return false;
 handover(now);return true;
}
function battleTap(x,y){
 if(!session||!active()||
    !['saving','done','repeat','lost','failed','unsafe'].includes(session.phase))
  return false;
 if(saving||session.phase==='unsafe'||window.TPCollection?.blocked)return true;
 if(x>=70&&x<=396&&y>=371&&y<=407){
  if(session.phase==='failed')complete();
  else{
   const lost=session.phase==='lost';
   back();tab=lost?'leaders':'badges';
  }
 }else if(x>=70&&x<=396&&y>=418&&y<=450){
  if(session.phase==='failed'&&
     !confirm('Nicht gespeicherte Levelboni verwerfen und Arena verlassen?'))
   return true;
  back();
 }
 return true;
}
// Local raster portraits only; no fetches and no remote URLs.
let dbPromise=null;
function database(){
 if(dbPromise)return dbPromise;
 dbPromise=new Promise((resolve,reject)=>{const request=indexedDB.open('itamapoke-arena-art',1);let settled=false;const timer=setTimeout(()=>{if(!settled){settled=true;reject(Error('Grafikspeicher nicht erreichbar'));}},10000);
 request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('portraits'))request.result.createObjectStore('portraits');};
 request.onsuccess=()=>{clearTimeout(timer);if(settled){request.result.close();return;}settled=true;request.result.onversionchange=()=>{request.result.close();dbPromise=null;};resolve(request.result);};request.onerror=()=>{clearTimeout(timer);settled=true;reject(request.error);};
 }).catch(e=>{dbPromise=null;throw e;});return dbPromise;
}
async function decode(blob){const url=URL.createObjectURL(blob);try{return await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('PNG nicht lesbar'));img.src=url;});}finally{URL.revokeObjectURL(url);}}
// Read both legacy Blob portraits and portable PNG byte buffers.
function portraitBlob(value){
 if(value instanceof Blob)return value;
 if(value instanceof ArrayBuffer||ArrayBuffer.isView(value))return new Blob([value],{type:'image/png'});
 throw Error('Gespeicherte Leitergrafik hat ein unbekanntes Format.');
}
function invalidatePortraits(){
 artGeneration++;pictures.clear();loading.clear();
 arenaPortraitBImages.clear();arenaPortraitBLoading.clear();
}
function pictureOriginal(id){
 if(region!==0)return TPOpponentTeam.portrait('johto-arena-'+data.leaders[id].id);
 if(pictures.has(id))return pictures.get(id);
 if(!loading.has(id)){const generation=artGeneration;loading.add(id);(async()=>{let image=null;try{
  if(window.TPTrainerArt){try{const result=await TPTrainerArt.picture(data.leaders[id].id);if(result)image=result.image;}catch(e){window.TPDiagnostics?.record('manager',e);}}
  if(!image){const db=await database(),value=await new Promise((resolve,reject)=>{const tx=db.transaction('portraits','readonly'),q=tx.objectStore('portraits').get(data.leaders[id].id);let found=null;q.onsuccess=()=>{found=q.result;};tx.oncomplete=()=>resolve(found);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Lesen abgebrochen'));});image=value?await decode(portraitBlob(value)):null;}
  if(generation===artGeneration&&!pictures.has(id))pictures.set(id,image);
 }catch(_){if(generation===artGeneration&&!pictures.has(id))pictures.set(id,null);}finally{if(generation===artGeneration)loading.delete(id);}})();}return null;
}

const arenaPortraitVariant='B';
const arenaPortraitBImages=new Map(),arenaPortraitBLoading=new Set();
function picture(id){
 if(arenaPortraitVariant!=='B')return pictureOriginal(id);
 const leader=data.leaders[id];
 if(!leader)return null;
 const key=(region===0?'kanto-arena-':'johto-arena-')+leader.id+'-portrait-b';
 if(arenaPortraitBImages.has(key))
  return arenaPortraitBImages.get(key)||pictureOriginal(id);
 if(!arenaPortraitBLoading.has(key)&&window.TPTrainerArt){
  const generation=artGeneration;
  arenaPortraitBLoading.add(key);
  window.TPTrainerArt.picture(key).then(result=>{
   if(generation===artGeneration)
    arenaPortraitBImages.set(key,result?.image||null);
  }).catch(error=>{
   if(generation===artGeneration)arenaPortraitBImages.set(key,null);
   try{window.TPDiagnostics?.record('manager',error);}catch(_){}
  }).finally(()=>{
   if(generation===artGeneration)arenaPortraitBLoading.delete(key);
  });
 }
 return pictureOriginal(id);
}

async function importPortrait(file,id){
 if(region!==0)throw Error('Johto-Leitergrafiken sind noch nicht importierbar; Platzhalter bleibt sichtbar.');
 if(artBusy||saving||screen!=='arena'||active()||tpSaveReplacing||!Number.isInteger(id)||id<0||id>=8)throw Error('Grafikimport gerade gesperrt');artBusy=true;message='';
 try{
  if(!file||file.size<24||file.size>1024*1024)throw Error('Bitte eine PNG bis 1 MB auswählen.');const bytes=new Uint8Array(await file.arrayBuffer());if([137,80,78,71,13,10,26,10].some((v,i)=>bytes[i]!==v))throw Error('Datei ist keine PNG.');const view=new DataView(bytes.buffer),width=view.getUint32(16),height=view.getUint32(20);if(!width||!height||width>1024||height>1024)throw Error('PNG-Abmessungen: maximal 1024 × 1024.');
  const image=await decode(new Blob([bytes],{type:'image/png'}));const canvas=document.createElement('canvas'),s=Math.min(1,512/image.width,512/image.height);canvas.width=Math.max(1,Math.round(image.width*s));canvas.height=Math.max(1,Math.round(image.height*s));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  const clean=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG konnte nicht vorbereitet werden')),'image/png'));const normalized=await decode(clean),db=await database(),stored=await clean.arrayBuffer();
  await new Promise((resolve,reject)=>{const tx=db.transaction('portraits','readwrite');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Speichern abgebrochen'));tx.objectStore('portraits').put(stored,data.leaders[id].id);});pictures.set(id,normalized);if(window.TPTrainerArt)invalidatePortraits();message='Leitergrafik lokal gespeichert.';return true;
 }catch(e){message=e.message||'Grafik konnte nicht geladen werden.';throw e;}finally{artBusy=false;}
}
let picker=null;
function pickPortrait(id){
 if(busy())return;picker?.remove();const input=document.createElement('input');picker=input;input.type='file';input.accept='image/png,.png';input.hidden=true;input.setAttribute('data-tp-arena-portrait','');document.body.appendChild(input);input.addEventListener('change',()=>{const file=input.files?.[0];input.remove();if(file)importPortrait(file,id).catch(e=>window.TPDiagnostics?.record('manager',e));},{once:true});input.addEventListener('cancel',()=>input.remove(),{once:true});input.click();
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible'&&active()&&!saving)abort();});window.addEventListener('pagehide',()=>{if(active()&&!saving)abort();});
window.TPArena=Object.freeze({open,chooseRegion,hidePage:arenaPageHide,get region(){return region;},get choosingRegion(){return choosingRegion;},canOpen,start,active,abort,draw,tap,intercept,battleTap,checkEnd,complete,badge,importPortrait,invalidatePortraits,get busy(){return busy();},get teamView(){return teamView();},switchTo,get snapshot(){return session?{region:session.region??0,id:session.id,token:session.token,team:!!session.team,phase:session.phase,error:session.error,rewards:session.rewards||[]}:null;}});
})();
