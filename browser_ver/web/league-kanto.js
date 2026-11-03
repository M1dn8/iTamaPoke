/* Kanto league controller. Checkpoints only after committed victories. */
(function(){'use strict';let D=window.TPKantoLeagueData,region=0;let entryReturn='arena';let busy=false,variant=0,preview=-1,error='',phase='choose';
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

function canOpen(wanted=window.TPArena?.region??0,from='arena'){
 const activity=from==='activity'&&screen==='activity'&&
  window.TPActivities?.inContext('battle')&&
  window.TPActivities?.battleKind==='league'&&
  window.TPTrainer?.canOpen('activity');
 return !!((from==='arena'&&screen==='arena'||activity)&&
  !tpSaveReplacing&&!busy&&!window.TPHall?.active&&!window.TPHall?.busy&&
  Number.isInteger(wanted)&&wanted>=0&&wanted<=1&&
  (wanted===0||window.TPRegions?.available(1)));
}

function open(wanted=window.TPArena?.region??0,from='arena'){if(!canOpen(wanted,from))return false;entryReturn=from;leagueVictory=null;region=wanted;D=window.TPRegions?.catalog(region)?.league||window.TPKantoLeagueData;variant=0;leaguePageSelected=0;leaguePageVariants=false;leaguePageKey='';if(!ready()){error='Bitte den neuen WASM-Kern bauen.';}phase='choose';preview=-1;screen='league';dragStart=dragNow=null;return true;}
function back(){if(busy)return;leagueVictory=null;attackMenu=false;try{if(ready())command('tp_lg_abort');}catch(_){}screen=entryReturn==='activity'?'activity':'arena';phase='choose';preview=-1;error='';}
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

/* UI01 league flow: ephemeral victory display, durable native checkpoints unchanged. */
let leagueVictory=null;
function leagueVictoryInsideTrainer(index){
 return Number.isInteger(index)&&index>0&&index<26&&
  ![5,10,15,20].includes(index);
}
function leagueVictoryActive(v){
 return !!leagueVictory&&leagueVictory.mod===Module&&
  leagueVictory.region===region&&phase==='checkpoint'&&
  !v.live&&!!v.supported&&!!v.unlocked&&!!v.actor&&!!v.state&&
  v.index===leagueVictory.nextIndex&&!error&&
  document.visibilityState==='visible';
}
function leagueVictoryDraw(v){
 if(!leagueVictoryActive(v)||!window.TPBattleView||!leaguePage)return false;
 window.TPBattleView.drawLeague(leagueVictory.finished,'',false);
 ctx.fillStyle='#f7efe6';ctx.fillRect(0,299,466,167);
 const key=JSON.stringify(['league-victory',region,v.index,busy,tpSaveReplacing]);
 leaguePage.hidden=false;
 if(key!==leaguePageKey){
  leaguePageKey=key;leaguePage.replaceChildren();
  leaguePageCards=[];leaguePagePortraits=[];leagueCheckpointCards=[];
  leaguePageHero=null;
  leaguePage.setAttribute('data-league-view','victory');
  const card=leaguePageNode('div',undefined,'tp-league-saved-card');
  const heading=leaguePageNode('h3','Sieg gespeichert');
  heading.id='tp-league-saved-title';
  leaguePage.setAttribute('aria-labelledby',heading.id);
  const detail=leaguePageNode('p',
   'Weiter gegen '+fns.dexName(v.dex)+' · Lv. '+v.level);
  const actions=leaguePageNode('div',undefined,'tp-league-saved-actions');
  const next=leaguePageButton('Weiter',()=>resume(),busy||tpSaveReplacing);
  next.setAttribute('data-league-resume','');
  next.setAttribute('data-league-saved-next','');
  const overview=leaguePageButton('Übersicht',()=>{
   leagueVictory=null;leaguePageKey='';
  },busy||tpSaveReplacing);
  overview.setAttribute('data-league-saved-overview','');
  actions.append(next,overview);
  card.append(heading,detail,actions);leaguePage.append(card);
 }
 window.TPBattlePokedex?.saved(v,leagueVictory.finished,leaguePage);
 statusEl.textContent='Sieg gespeichert · Weiter zum nächsten Pokémon';
 return true;
}
/* End UI01 league flow. */

function saveWin(){
 const owner=region,mod=Module,finished=view(owner,mod);
 leagueVictory=null;
 const task=finished.teamMode?teamTransaction('win'):
  transaction('tp_lg_prepare_win');
 return Promise.resolve(task).then(ok=>{
  if(ok&&Module===mod&&region===owner&&document.visibilityState==='visible'){
   const saved=view(owner,mod);
   if(finished.live&&finished.resolved&&finished.won&&!saved.live&&
      saved.state===1&&saved.actor&&saved.index===finished.index+1&&
      leagueVictoryInsideTrainer(saved.index))
    leagueVictory={mod,region:owner,nextIndex:saved.index,finished};
  }
  return ok;
 });
}
function leaguePageNode(tag,text,cls){
 const el=document.createElement(tag);
 if(text!==undefined)el.textContent=text;
 if(cls)el.className=cls;
 return el;
}
function leaguePageIcon(kind){
 const symbol=leaguePageNode('canvas',undefined,'tp-league-action-icon');
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
  symbol.setAttribute('data-league-icon','challenge-vs');
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
function leaguePageBounds(image){
 if(leaguePageCropCache.has(image))return leaguePageCropCache.get(image);
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
 leaguePageCropCache.set(image,result);return result;
}
function leaguePageMember(dex,level){
 const card=leaguePageNode('article',undefined,'tp-league-member');
 card.setAttribute('data-league-member',String(dex));
 const image=leaguePageNode('canvas');
 image.width=96;image.height=96;
 image.setAttribute('aria-hidden','true');
 leaguePageCards.push({canvas:image,dex});
 const info=leaguePageNode('div');
 info.append(leaguePageNode('p',fns.dexName(dex)),
  leaguePageNode('small','Lv. '+level));
 const types=leaguePageNode('div',undefined,'tp-league-types');
 for(const type of [...new Set(
  [fns.dexType1(dex),fns.dexType2(dex)].filter(n=>n>0)
 )]){
  const chip=leaguePageNode('span',TYPE_NAMES[type]||String(type));
  const raw=typeColor565(type),red=((raw>>11)&31)*255/31;
  const green=((raw>>5)&63)*255/63,blue=(raw&31)*255/31;
  chip.style.backgroundColor=rgb565(raw);
  chip.style.color=red*.299+green*.587+blue*.114>145?'#202820':'#ffffff';
  types.append(chip);
 }
 info.append(types);card.append(image,info);return card;
}

let leaguePage=null,leaguePageKey='',leaguePageSelected=0;
let leaguePageVariants=false,leaguePageCards=[],leaguePagePortraits=[];
let leaguePageHero=null,leaguePageBuffer=null,leaguePagePaintAt=-Infinity;
const leaguePageCropCache=new WeakMap();

function leaguePageHide(){if(leaguePage)leaguePage.hidden=true;}
function leaguePageBack(){
 if(busy||tpSaveReplacing)return;
 if(preview>=0){preview=-1;leaguePageKey='';}
 else if(leaguePageVariants){leaguePageVariants=false;leaguePageKey='';}
 else back();
}
function leaguePageButton(label,action,disabled=false){
 const el=leaguePageNode('button',label);
 el.type='button';el.disabled=disabled;
 el.addEventListener('click',()=>{
  if(screen!=='league'||leaguePage?.hidden||busy||tpSaveReplacing||
   window.TPHall?.active||document.visibilityState!=='visible'||
   el.disabled||!el.isConnected)return;
  try{
   const result=action();
   if(result&&typeof result.then==='function')
    result.then(()=>{
     if(screen==='league')draw();else leaguePageHide();
    }).catch(e=>{
     error=e.message||String(e);if(screen==='league')draw();
    });
  }catch(e){error=e.message||String(e);}
  if(screen==='league')draw();else leaguePageHide();
 });
 return el;
}

function leaguePageCompanion(index){
 const roster=D.champions[index];
 return Array.isArray(roster)&&roster.length?roster[roster.length-1][0]:null;
}
function leaguePageCompanionCanvas(index,cls){
 const image=leaguePageNode('canvas',undefined,cls);
 image.width=96;image.height=96;image.setAttribute('aria-hidden','true');
 const dex=leaguePageCompanion(index);
 image.setAttribute('data-league-companion',String(dex??''));
 if(dex)leaguePageCards.push({canvas:image,dex});
 return image;
}

function leaguePagePortrait(index){
 const keys=region===0?
  ['kanto-elite-lorelei','kanto-elite-bruno','kanto-elite-agathe',
   'kanto-elite-siegfried','kanto-champ-blau']:
  ['johto-elite-willi','johto-elite-koga','johto-elite-bruno',
   'johto-elite-melanie','johto-champ-siegfried'];
 return window.TPOpponentTeam?.portrait(keys[index])||null;
}
function leaguePagePaintOriginal(){
 const now=performance.now();
 if(now-leaguePagePaintAt<140)return;
 leaguePagePaintAt=now;
 for(const item of leaguePagePortraits){
  const p=item.canvas.getContext('2d');
  p.clearRect(0,0,64,64);p.imageSmoothingEnabled=false;
  const image=leaguePagePortrait(item.index);
  if(image){
   const z=Math.min(60/image.width,60/image.height);
   p.drawImage(image,32-image.width*z/2,62-image.height*z,
    image.width*z,image.height*z);
  }else{
   p.fillStyle='#526574';p.textAlign='center';p.font='16px monospace';
   p.fillText('?',32,40);
  }
 }
 if(leaguePageHero){
  const p=leaguePageHero.getContext('2d');
  p.clearRect(0,0,224,112);p.imageSmoothingEnabled=false;
  const image=leaguePagePortrait(leaguePageSelected);
  if(image){
   const z=Math.min(116/image.width,104/image.height,1.5);
   p.drawImage(image,112-image.width*z/2,108-image.height*z,
    image.width*z,image.height*z);
  }else{
   p.fillStyle='#526574';p.textAlign='center';p.font='12px monospace';
   p.fillText('Lokale Grafik fehlt',112,62);
  }
 }
for(const item of leaguePageCards){
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
  if(!leaguePageBuffer)leaguePageBuffer=document.createElement('canvas');
  leaguePageBuffer.width=image.width;
  leaguePageBuffer.height=image.height;
  leaguePageBuffer.getContext('2d').putImageData(image,0,0);
  const crop=leaguePageBounds(image);
  if(!crop)continue;
  const scale=Math.min(4,92/crop.w,92/crop.h);
  p.imageSmoothingEnabled=false;
  p.drawImage(leaguePageBuffer,crop.x,crop.y,crop.w,crop.h,
   48-crop.w*scale/2,48-crop.h*scale/2,
   crop.w*scale,crop.h*scale);
 }
}

/* Original remains available; only the displayed portrait crop changes. */
const leaguePortraitVariant='B';
const leaguePortraitCropCache=new WeakMap();

function leaguePortraitRect(width,height,pixels){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
  !pixels||pixels.length<width*height*4)return null;
 let left=width,top=height,right=-1,bottom=-1;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  if(pixels[(y*width+x)*4+3]){
   left=Math.min(left,x);right=Math.max(right,x);
   top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
 }
 if(right<left)return null;
 const upperBottom=Math.min(
  bottom,top+Math.max(1,Math.ceil((bottom-top+1)*0.56))-1
 );
 let upperLeft=width,upperRight=-1;
 for(let y=top;y<=upperBottom;y++)for(let x=left;x<=right;x++){
  if(pixels[(y*width+x)*4+3]){
   upperLeft=Math.min(upperLeft,x);
   upperRight=Math.max(upperRight,x);
  }
 }
 if(upperRight<upperLeft)return null;
 const pad=Math.max(1,Math.round(
  Math.min(upperRight-upperLeft+1,upperBottom-top+1)*0.06
 ));
 const x=Math.max(0,upperLeft-pad),y=Math.max(0,top-pad);
 const r=Math.min(width-1,upperRight+pad);
 const b=Math.min(height-1,upperBottom+pad);
 return {x,y,w:r-x+1,h:b-y+1};
}
function leaguePortraitCrop(image){
 if(leaguePortraitCropCache.has(image))
  return leaguePortraitCropCache.get(image);
 let result=null;
 try{
  const buffer=document.createElement('canvas');
  buffer.width=image.width;buffer.height=image.height;
  const paint=buffer.getContext('2d');
  if(paint){
   paint.drawImage(image,0,0);
   const pixels=paint.getImageData(0,0,buffer.width,buffer.height);
   if(pixels?.data)
    result=leaguePortraitRect(buffer.width,buffer.height,pixels.data);
  }
 }catch(_){}
 leaguePortraitCropCache.set(image,result);
 return result;
}
function leaguePortraitDrawA(canvas,image,hero=false){
 if(!image)return false;
 const crop=leaguePortraitCrop(image);
 if(!crop)return false;
 const paint=canvas.getContext('2d');
 if(!paint)return false;
 const maxWidth=hero?canvas.width*0.72:canvas.width-8;
 const maxHeight=canvas.height-8;
 const scale=Math.min(maxWidth/crop.w,maxHeight/crop.h);
 const width=crop.w*scale,height=crop.h*scale;
 paint.clearRect(0,0,canvas.width,canvas.height);
 paint.imageSmoothingEnabled=false;
 paint.drawImage(image,crop.x,crop.y,crop.w,crop.h,
  (canvas.width-width)/2,(canvas.height-height)/2,width,height);
 return true;
}

const leaguePortraitBIds=["kanto-elite-lorelei-portrait-b", "kanto-elite-bruno-portrait-b", "kanto-elite-agathe-portrait-b", "kanto-elite-siegfried-portrait-b", "kanto-champ-blau-portrait-b"];
const leaguePortraitBImages=new Map(),leaguePortraitBLoading=new Set();
const leaguePortraitBJohtoIds=["johto-elite-willi-portrait-b", "kanto-arena-koga-portrait-b", "kanto-elite-bruno-portrait-b", "johto-elite-melanie-portrait-b", "kanto-elite-siegfried-portrait-b"];
function leaguePortraitB(index){
 const ids=region===0?leaguePortraitBIds:
  region===1?leaguePortraitBJohtoIds:[];
 if(index<0||index>=ids.length)return null;
 const key=ids[index];
 if(leaguePortraitBImages.has(key))return leaguePortraitBImages.get(key);
 if(!leaguePortraitBLoading.has(key)&&window.TPTrainerArt){
  leaguePortraitBLoading.add(key);
  window.TPTrainerArt.picture(key).then(result=>{
   leaguePortraitBImages.set(key,result?.image||null);
  }).catch(error=>{
   leaguePortraitBImages.set(key,null);
   try{window.TPDiagnostics?.record('manager',error);}catch(_){}
  }).finally(()=>leaguePortraitBLoading.delete(key));
 }
 return null;
}
function leaguePortraitDrawB(canvas,image){
 if(!image)return false;
 const paint=canvas.getContext('2d');if(!paint)return false;
 const scale=Math.min((canvas.width-4)/image.width,(canvas.height-8)/image.height);
 const width=image.width*scale,height=image.height*scale;
 paint.clearRect(0,0,canvas.width,canvas.height);paint.imageSmoothingEnabled=false;
 paint.drawImage(image,(canvas.width-width)/2,(canvas.height-height)/2,width,height);
 return true;
}
function leaguePagePaint(){
 const before=leaguePagePaintAt;
 leaguePagePaintOriginal();
 for(const item of leaguePagePortraits)
  item.canvas.setAttribute('data-league-portrait-variant',leaguePortraitVariant);
 if(leaguePageHero)
  leaguePageHero.setAttribute('data-league-portrait-variant',leaguePortraitVariant);
 if(leaguePagePaintAt===before)return;
 if(leaguePortraitVariant==='B'){
  for(const item of leaguePagePortraits)
   leaguePortraitDrawB(item.canvas,leaguePortraitB(item.index));
  if(leaguePageHero)
   leaguePortraitDrawB(leaguePageHero,leaguePortraitB(leaguePageSelected));
 }else if(leaguePortraitVariant==='A'){
  for(const item of leaguePagePortraits)
   leaguePortraitDrawA(item.canvas,leaguePagePortrait(item.index));
  if(leaguePageHero)
   leaguePortraitDrawA(leaguePageHero,leaguePagePortrait(leaguePageSelected),true);
 }
}



/* UI01 saved league checkpoint: read native view only, never export/write a save. */
let leagueCheckpointCards=[],leagueCheckpointAt=-Infinity,leagueCheckpointBuffer=null;

function leagueCheckpointBody(v,left,right){
 const index=v.index,trainer=Math.min(4,Math.floor(index/5));
 const slot=index-(trainer<4?trainer*5:20)+1;
 const roster=trainer<4?D.elite[trainer]:D.champions[v.variant];
 const info=leaguePageNode('div',undefined,'tp-checkpoint-next');
 info.tabIndex=0;
 info.setAttribute('data-league-next-index',String(index));

 const stages=leaguePageNode('div',undefined,'tp-checkpoint-stages');
 stages.setAttribute('aria-label','Fortschritt durch Top Vier und Champ');
 D.names.forEach((name,i)=>{
  const state=i<trainer?'done':i===trainer?'current':'next';
  const stage=leaguePageNode('span',undefined,'tp-checkpoint-stage');
  stage.setAttribute('data-stage',state);
  stage.setAttribute('title',name);
  stage.setAttribute('aria-label',name+
   (state==='done'?' · abgeschlossen':state==='current'?' · aktuell':' · noch offen'));
  const portrait=leaguePageNode('canvas');
  portrait.width=64;portrait.height=64;
  portrait.setAttribute('aria-hidden','true');
  leaguePagePortraits.push({canvas:portrait,index:i});
  stage.append(portrait);
  if(state==='done')
   stage.append(leaguePageNode('span','✓','tp-checkpoint-stage-check'));
  stages.append(stage);
 });
 info.append(stages);

 leaguePageHero=leaguePageNode('canvas',undefined,'tp-league-hero');
 leaguePageHero.width=224;leaguePageHero.height=112;
 leaguePageHero.setAttribute('role','img');
 leaguePageHero.setAttribute('aria-label',D.names[trainer]);
 info.append(leaguePageHero,leaguePageNode('h3',D.names[trainer]));

 const foe=leaguePageNode('div',undefined,'tp-checkpoint-foe');
 const picture=leaguePageNode('canvas');
 picture.width=96;picture.height=64;
 picture.setAttribute('aria-hidden','true');
 leagueCheckpointCards.push({
  canvas:picture,mon:{dex:v.dex,shiny:false,form:0}
 });
 const text=leaguePageNode('div');
 text.append(leaguePageNode('p',fns.dexName(v.dex)+' · Lv. '+v.level));
 foe.append(picture,text);info.append(foe);

 const types=leaguePageNode('div',undefined,'tp-checkpoint-types');
 for(const type of [...new Set(
  [fns.dexType1(v.dex),fns.dexType2(v.dex)].filter(n=>n>0)
 )]){
  const chip=leaguePageNode('span',TYPE_NAMES[type]||String(type));
  const raw=typeColor565(type),red=((raw>>11)&31)*255/31;
  const green=((raw>>5)&63)*255/63,blue=(raw&31)*255/31;
  chip.style.backgroundColor=rgb565(raw);
  chip.style.color=red*.299+green*.587+blue*.114>145?'#202820':'#ffffff';
  types.append(chip);
 }
 info.append(types);

 const balls=leaguePageNode('div',undefined,'tp-checkpoint-balls');
 balls.setAttribute('role','img');
 balls.setAttribute('aria-label','Pokémon '+slot+' / '+roster.length);
 for(let i=0;i<roster.length;i++){
  const ball=leaguePageNode('span');
  ball.setAttribute('aria-hidden','true');
  ball.setAttribute('data-ball',
   i<slot-1?'done':i===slot-1?'next':'open');
  balls.append(ball);
 }
 info.append(balls);left.append(info);

 const saved=leaguePageNode('div',undefined,'tp-checkpoint-saved');
 saved.append(leaguePageNode('h3','Dein Team'));
 const grid=leaguePageNode('div',undefined,'tp-checkpoint-roster');
 grid.setAttribute('role','group');
 grid.setAttribute('aria-label','Gespeicherte KP und Heilungen');

 v.members.forEach((mon,i)=>{
  const tile=leaguePageNode('article',undefined,'tp-checkpoint-mon');
  for(const [name,value]of Object.entries({
   'data-league-member-id':mon.id,
   'data-hp':mon.hp,'data-max-hp':mon.maxHp,
   'data-rests':mon.rests,
   'data-active':i===v.active,'data-ko':mon.hp===0
  }))tile.setAttribute(name,String(value));

  tile.append(leaguePageNode('h4',mon.nick||fns.dexName(mon.dex)));

  const image=leaguePageNode('canvas');
  image.width=96;image.height=64;
  image.setAttribute('aria-hidden','true');
  leagueCheckpointCards.push({canvas:image,mon});
  tile.append(image);

  const track=leaguePageNode('div',undefined,'tp-checkpoint-hp');
  track.setAttribute('role','progressbar');
  track.setAttribute('aria-label','Kraftpunkte');
  track.setAttribute('aria-valuemin','0');
  track.setAttribute('aria-valuemax',String(mon.maxHp));
  track.setAttribute('aria-valuenow',String(mon.hp));
  const fill=leaguePageNode('span');
  fill.style.width=(mon.hp/mon.maxHp*100)+'%';
  track.append(fill);
  tile.append(track,leaguePageNode('p',
   mon.hp+' / '+mon.maxHp+' KP','tp-checkpoint-hp-number'));


  if(mon.hp===0)
   tile.append(leaguePageNode('span','Besiegt','tp-checkpoint-ko'));

  tile.setAttribute('aria-label',(mon.nick||fns.dexName(mon.dex))+
   (mon.hp===0?', besiegt':'')+
   ', '+mon.hp+' von '+mon.maxHp+' KP'+
   (i===v.active?', aktives Mitglied':''));
  grid.append(tile);
 });
 saved.append(grid);right.append(saved);
 return info;
}

function leagueCheckpointPaint(){
 const now=performance.now();if(now-leagueCheckpointAt<140)return;
 leagueCheckpointAt=now;
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 for(const {canvas,mon}of leagueCheckpointCards){
  if(!canvas.isConnected)continue;
  const p=canvas.getContext('2d');
  p.clearRect(0,0,96,64);p.imageSmoothingEnabled=false;
  const sprite=mon.form?megaSpriteFor(!!mon.shiny,mon.form):spriteFor(mon.dex,!!mon.shiny);
  if(!sprite){if(!mon.form)ensureSprite(mon.dex);continue;}
  const action=sprite.actions[TPAct.idle];if(!action)continue;
  const image=frameImageData(sprite,TPAct.idle,reduced?0:frameIndexAt(action,now,true));
  if(!image)continue;
  const crop=leaguePageBounds(image);if(!crop)continue;
  if(!leagueCheckpointBuffer)leagueCheckpointBuffer=document.createElement('canvas');
  leagueCheckpointBuffer.width=image.width;leagueCheckpointBuffer.height=image.height;
  leagueCheckpointBuffer.getContext('2d').putImageData(image,0,0);
  const scale=Math.min(4,92/crop.w,60/crop.h);
  p.drawImage(leagueCheckpointBuffer,crop.x,crop.y,crop.w,crop.h,
   48-crop.w*scale/2,32-crop.h*scale/2,crop.w*scale,crop.h*scale);
 }
}
/* End UI01 saved league checkpoint. */

function leaguePageDraw(){
 if(screen!=='league'||window.TPHall?.active||
  phase==='fatal'||
  typeof document.createElement!=='function'||
  typeof document.getElementById!=='function'){
  leaguePageHide();return false;
 }
 let v;
 try{
  v=ready()?view():{
   supported:false,unlocked:false,actor:false,state:0,live:false
  };
 }catch(e){leaguePageHide();return false;}
 if(v.live||phase==='checkpoint'&&v.done&&!v.state){leaguePageHide();return false;}
 const host=document.getElementById('tp-game-shell');
 if(!host){leaguePageHide();return false;}
 if(!leaguePage){
  leaguePage=leaguePageNode('section');leaguePage.id='tp-league-page';
  leaguePage.setAttribute('role','dialog');
  leaguePage.setAttribute('aria-modal','true');host.appendChild(leaguePage);
  leaguePage.addEventListener('keydown',event=>{
   if(leaguePage.hidden||screen!=='league')return;
   if(event.key==='Escape'&&!busy&&!tpSaveReplacing){
    event.preventDefault();event.stopPropagation();
    leaguePageBack();draw();return;
   }
   if(event.key!=='Tab')return;
   const items=Array.from(leaguePage.querySelectorAll('button'))
    .filter(el=>!el.disabled);
   const first=items[0],last=items[items.length-1];
   if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();last?.focus();
   }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();first?.focus();
   }
  });
 }
 if(leagueVictoryDraw(v))return true;
 const teamPage=preview>=0,stored=v.state===1&&!!v.actor;
 const checkpointPage=!teamPage&&!leaguePageVariants&&stored&&
  Array.isArray(v.members)&&v.members.length>0;
 if(checkpointPage)leaguePageSelected=Math.min(4,Math.floor(v.index/5));
 const eliteCan=!window.TPBattleEnergy||!!window.TPBattleEnergy.view?.elite.can;
 const resumeCan=!window.TPBattleEnergy||v.index!==20||
  !!window.TPBattleEnergy.view?.champ.can;
 const canStart=!!v.supported&&!!v.unlocked&&eliteCan&&
  !window.TPCollection?.blocked;
 const canResume=!!v.supported&&!!v.unlocked&&stored&&resumeCan&&
  !window.TPCollection?.blocked;
 const energy=window.TPBattleEnergy?.line(
  stored&&v.index===20?'champ':'elite'
 )||'';
 const budget=window.TPBattleEnergy?.view;
 const primaryCost=stored?
  (v.index===20?budget?.champ?.cost:0):budget?.elite?.cost;
 const costText=budget&&Number.isFinite(primaryCost)?
  'Energie '+budget.energy+' · Kosten '+primaryCost:
  energy;
 const key=JSON.stringify([
  'league-page',region,variant,preview,leaguePageSelected,leaguePageVariants,
  busy,tpSaveReplacing,error,v.state,v.actor,v.supported,v.unlocked,
  v.done,v.index,v.hp,v.maxHp,v.rests,v.variant,canStart,canResume,energy,costText,
  phase,v.active,v.members
 ]);
 leaguePage.hidden=false;
 if(key!==leaguePageKey){
  leaguePageKey=key;leaguePage.replaceChildren();
  leaguePageCards=[];leaguePagePortraits=[];
  leagueCheckpointCards=[];leagueCheckpointAt=-Infinity;
  leaguePageHero=null;leaguePagePaintAt=-Infinity;
  leaguePage.setAttribute('data-league-view',teamPage?'team':checkpointPage?'checkpoint':'overview');
  leaguePage.removeAttribute('aria-hidden');
  leaguePage.setAttribute('data-league-region',String(region));
  if(typeof window.hubDexDesignTokens==='function')
   for(const [name,value]of Object.entries(window.hubDexDesignTokens()))
    host.style.setProperty(name,value);

  const title=teamPage?D.names[preview]:label()+'-Liga';
  leaguePage.setAttribute('aria-label',title);
  const head=leaguePageNode('header',undefined,'tp-activity-head');
  const heading=leaguePageNode('h2',title);heading.id='tp-league-title';
  leaguePage.setAttribute('aria-labelledby',heading.id);
  const exit=leaguePageButton('Zurück',leaguePageBack,busy||tpSaveReplacing);
  exit.setAttribute('data-league-back','');head.append(heading,exit);

  const frame=leaguePageNode('div',undefined,'tp-activity-frame');
  frame.setAttribute('aria-hidden','true');
  for(const cls of [
   'tp-pokedex-display tp-pokedex-display-left',
   'tp-pokedex-display tp-pokedex-display-right','tp-pokedex-spine'
  ])frame.append(leaguePageNode('span',undefined,cls));

  const actions=leaguePageNode('div',undefined,'tp-league-actions');
  const body=leaguePageNode('div',undefined,'tp-activity-body');
  const left=leaguePageNode('div',undefined,'tp-activity-column tp-activity-left');
  const right=leaguePageNode('div',undefined,'tp-activity-column tp-activity-right');

  let noticeHost=null;
  if(teamPage){
   actions.append(leaguePageNode('span',
    label()+' · '+(preview<4?'Top Vier':'Champ')+' · '+D.variants[variant]));
   const columns=[
    leaguePageNode('div',undefined,'tp-league-team-list'),
    leaguePageNode('div',undefined,'tp-league-team-list')
   ];
   team(preview).forEach(([dex,level],i)=>
    columns[i%2].append(leaguePageMember(dex,level)));
   left.append(columns[0]);right.append(columns[1]);
  }else{
   if(checkpointPage){
    noticeHost=leagueCheckpointBody(v,left,right);
    const inspect=leaguePageButton('i',()=>{
     preview=leaguePageSelected;
    },busy||tpSaveReplacing);
    inspect.setAttribute('data-league-team','');
    inspect.setAttribute('aria-label','Nächstes Gegnerteam ansehen');
    inspect.setAttribute('title','Nächstes Gegnerteam ansehen');
    actions.append(inspect);
   }else{
   const list=leaguePageNode('div',undefined,
    leaguePageVariants?'tp-league-editions':'tp-league-portraits');
   if(leaguePageVariants){
    D.variants.forEach((name,index)=>{
     const choice=leaguePageButton('',()=>{
      variant=index;leaguePageVariants=false;
     },busy||tpSaveReplacing);
     choice.append(
      leaguePageCompanionCanvas(index,'tp-league-choice-icon'),
      leaguePageNode('span',leaguePageCompanion(index)?
       fns.dexName(leaguePageCompanion(index)):name));
     choice.setAttribute('title',name);
     choice.setAttribute('aria-label',name);
     choice.setAttribute('data-league-variant',String(index));
     choice.setAttribute('aria-pressed',String(index===variant));
     list.append(choice);
    });
   }else D.names.forEach((name,index)=>{
    const choice=leaguePageButton('',()=>{
     leaguePageSelected=index;
    },busy||tpSaveReplacing);
    choice.setAttribute('data-league-opponent',String(index));
    choice.setAttribute('aria-pressed',String(index===leaguePageSelected));
    choice.setAttribute('aria-label',(index<4?'Top Vier · ':'Champ · ')+name);
    choice.setAttribute('title',name);
    const image=leaguePageNode('canvas');
    image.width=64;image.height=64;image.setAttribute('aria-hidden','true');
    leaguePagePortraits.push({canvas:image,index});
    choice.append(image);list.append(choice);
   });
   left.append(list);

   const card=leaguePageNode('article',undefined,'tp-activity-card');
   const info=leaguePageNode('div',undefined,'tp-activity-info');
   info.tabIndex=0;noticeHost=info;
   leaguePageHero=leaguePageNode('canvas',undefined,'tp-league-hero');
   leaguePageHero.width=224;leaguePageHero.height=112;
   leaguePageHero.setAttribute('role','img');
   leaguePageHero.setAttribute('aria-label',D.names[leaguePageSelected]);
   info.append(leaguePageNode('h3',D.names[leaguePageSelected]),
    leaguePageHero,leaguePageNode('p',leaguePageSelected<4?'Top Vier':'Champ'),
    leaguePageNode('p',D.variants[variant]));
   if(stored)info.append(leaguePageNode('p',
    'Gespeicherter Lauf: '+(D.variants[v.variant]||label())));
   const inspect=leaguePageButton('Team ansehen',()=>{
    preview=leaguePageSelected;
   },busy||tpSaveReplacing);
   inspect.setAttribute('data-league-team','');
   card.append(info,inspect);right.append(card);

   }
   if(region===0){
    const editions=leaguePageButton('',()=>{
     leaguePageVariants=!leaguePageVariants;
    },busy||tpSaveReplacing);
    editions.append(leaguePageCompanionCanvas(
     variant,'tp-league-variant-icon'));
    editions.setAttribute('data-league-variants','');
    editions.setAttribute('aria-label','Champ-Team für neuen Lauf auswählen');
    editions.setAttribute('title',D.variants[variant]);actions.append(editions);
   }
   const primary=leaguePageButton(stored?'▶':'',
    ()=>stored?resume():start(),
    busy||tpSaveReplacing||!(stored?canResume:canStart));
   if(!stored)primary.append(leaguePageIcon('challenge'));
   primary.setAttribute('data-league-primary','');
   primary.setAttribute(stored?'data-league-resume':'data-league-start','');
   primary.setAttribute('aria-label',
    stored?'Gespeicherten Lauf fortsetzen':'Ligalauf starten');
   primary.setAttribute('title',stored?'Gespeicherten Lauf fortsetzen':
    'Ligalauf starten · Beginn bei '+D.names[0]);
   actions.append(primary);

   if(stored){
    const fresh=leaguePageButton('+',()=>start(),
     busy||tpSaveReplacing||!canStart);
    fresh.setAttribute('data-league-start','');
    fresh.setAttribute('aria-label','Neuen Ligalauf beginnen');
    fresh.setAttribute('title','Neuen Ligalauf beginnen'+
     (Number.isFinite(budget?.elite?.cost)?
      ' · Kosten '+budget.elite.cost+' Energie':''));
    actions.append(fresh);
   }
   const hall=leaguePageButton('',()=>window.TPHall?.open(false,region),
    busy||tpSaveReplacing||!window.TPHall);
   hall.append(leaguePageIcon('league'));
   hall.setAttribute('data-league-hall','');
   hall.setAttribute('aria-label','Ruhmeshalle');
   hall.setAttribute('title','Ruhmeshalle');actions.append(hall);
  }

  body.append(left,right);
  const notice=error||
   (!v.supported?'Ligadaten nicht unterstützt.':
    !v.unlocked?'Erst alle acht '+label()+'-Orden erhalten.':
    stored?'Fortsetzen behält den gespeicherten Kader und Zwischenstand.':
    v.state===2?'Unterbrochener Lauf · Neustart nur nach Bestätigung.':
    energy+' · Beginn bei '+D.names[0]);
  if(noticeHost&&(error||!v.supported||!v.unlocked||(!checkpointPage&&stored)||v.state===2))
   noticeHost.append(leaguePageNode('p',notice,'tp-league-notice'));
  const status=leaguePageNode('p',
   (teamPage?'Vorschau · ':'')+costText,'tp-league-energy');
  status.setAttribute('role','status');
  leaguePage.append(head,frame,actions,body,status);
 }
 statusEl.textContent=label()+'-Liga';
 leaguePagePaint();leagueCheckpointPaint();return true;
}

function text(s,x,y,size=14,color=UI.ink,w=430){ctx.fillStyle=color;ctx.textAlign='center';ctx.font=size+'px monospace';ctx.fillText(s,x,y,w);}
function button(s,x,y,w=326,h=36,on=true){ctx.fillStyle=on?UI.white:UI.track;roundRect(x,y,w,h,9);ctx.fill();ctx.strokeStyle=UI.track;ctx.lineWidth=1;ctx.stroke();if(window.TPNavBack?.isBackLabel(s))
 window.TPNavBack.draw(ctx,x+w/2-12,y+h/2-12,24,on?'#315b83':'#e9ece6');
 else text(s,x+w/2,y+h/2+5,14,on?UI.ink:'#e9ece6',w-12);}
function heading(i){return i<4?'Top Vier · '+D.names[i]:'Champ · '+champ();}
function team(i){return i<4?D.elite[i]:D.champions[variant];}
function sprite(dex,x,y,form=0,shiny=false){const s=form?megaSpriteFor(shiny,form):spriteFor(dex,shiny);if(!s){text('?',x,y,34);return;}const a=s.actions[TPAct.idle];if(!a)return;const img=frameImageData(s,TPAct.idle,frameIndexAt(a,performance.now(),true));if(!img)return;frameCanvas.width=a.w;frameCanvas.height=a.h;frameCtx.putImageData(img,0,0);const z=Math.min(3,130/a.w,120/a.h);ctx.imageSmoothingEnabled=false;ctx.drawImage(frameCanvas,x-a.w*z/2,y-a.h*z,a.w*z,a.h*z);}
function draw(){if(leaguePageDraw())return;if(window.TPHall?.active){window.TPHall.draw();return;}ctx.fillStyle='#f7efe6';ctx.fillRect(0,0,466,466);text(label()+' · Pokémon-Liga',233,30,23);if(!ready()){text(error||'Neuen WASM-Kern bauen.',233,180);button('Zurück',70,416);return;}let v;try{v=view();}catch(e){error=e.message;text(error,233,180);button('Zurück',70,416);return;}
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
function tap(x,y){if(busy||tpSaveReplacing)return;if(window.TPHall?.active){window.TPHall.tap(x,y);return;}if(!ready()){if(y>=416)back();return;}const v=view();if(leagueVictoryActive(v))return;if(phase==='fatal'){if(y>=414)window.location.reload();return;}
 if(v.live&&window.TPBattleView){const a=window.TPBattleView.tapLeague(x,y,v,error,phase==='retry');const actions={quick:1,heavy:2,dodge:3,rest:4};if(v.teamMode&&a&&/^member[0-5]$/.test(a)){
 if(!v.resolved&&!v.pending)
  Module.ccall('tp_lgt_switch','number',['number','number'],
   [region,Number(a.slice(6))]);
}else if(a in actions)command('tp_lg_turn',actions[a]);else if(a==='retry')saveWin();else if(a==='abort'){
 if(v.resolved)back();
 else window.TPGiveUp.request(window.TPBattleView.current,()=>back());
}return;}
 if(v.live){if(v.resolved){if(v.won&&phase==='retry'&&y>=360&&y<=400)saveWin();else if(y>=414)back();return;}if(x>=184&&x<=282&&y>=151&&y<=181){back();return;}if(attackMenu){attackMenu=false;if(y>=298&&y<=342){if(x>=74&&x<=224)command('tp_lg_turn',1);else if(x>=242&&x<=392)command('tp_lg_turn',2);}return;}if(y>=358&&y<=416){if(x>=58&&x<=166)attackMenu=true;else if(x>=179&&x<=287)command('tp_lg_turn',3);else if(x>=300&&x<=408)command('tp_lg_turn',4);}return;}
 if(phase==='checkpoint'){if(v.done&&!v.state&&x>=70&&x<=396&&y>=280&&y<=316){window.TPHall?.open(true,region);return;}if(y>=424){back();return;}if(x>=70&&x<=396&&y>=252&&y<=288&&v.state===1)resume();return;}if(preview>=0){if(y>=414)preview=-1;return;}if(y>=425){if(x>=70&&x<=226)window.TPHall?.open(false,region);else if(x>=240&&x<=396)back();return;}if(y>=70&&y<=110){if(region!==0)return;const i=Math.floor((x-30)/145);if(i>=0&&i<3)variant=i;return;}if(x>=70&&x<=396&&y>=125&&y<=299){const i=Math.floor((y-125)/36);if(i<5)preview=i;return;}if(!v.supported||!v.unlocked)return;if(v.state===1&&v.actor){if(y>=343&&y<=377)resume();else if(y>=382&&y<=412)start();}else if(y>=360&&y<=400)start();}
function hidden(){if(document.visibilityState!=='visible'&&!busy&&ready()){const v=view();if(v.live)command('tp_lg_abort');attackMenu=false;phase='choose';}}
document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',hidden);
window.TPLeague=Object.freeze({open,draw,tap,back,hidePage:leaguePageHide,canOpen,get portraitVariant(){return leaguePortraitVariant;},get region(){return region;},get busy(){return busy||!!window.TPHall?.busy;},get state(){return ready()?view():null;},get diagnostics(){return Object.freeze({phase,error,busy,attackMenu});}});})();
