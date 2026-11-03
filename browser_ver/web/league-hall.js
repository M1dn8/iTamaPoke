/* Kanto Hall: original pixel room, immutable native winner snapshots.
 * No Pokemon artwork is bundled; winner sprites use the existing local loader.
 */
(function(){'use strict';
let region=0;let active=false,busy=false,celebration=false,message='',selected=0,openedAt=0,memberSelected=0;
const leagueText=(key,params={})=>window.TPLeagueText?
 window.TPLeagueText.t(key,params):TPText.t('leagueTeam.'+key,params);
const c=(n,...a)=>Module.ccall(n,'number',a.map(()=> 'number'),a);
const scoped=(mod,r,n,type,args=[])=>window.TPRegions?TPRegions.call(mod,r,n,type,args):r===0?mod.ccall(n,type,args.map(()=> 'number'),args):null;
const label=()=>region===1?'Johto':'Kanto';
function ready(){try{return !!Module&&typeof Module[region===1?'_tp_region_hall_view':'_tp_hall_view']==='function';}catch(_){return false;}}
function view(){return ready()?JSON.parse(scoped(Module,region,'tp_hall_view','string')):{supported:0,legacy:0,legacyDate:0,wins:0,seen:0,variants:0,pendingCeremony:0,records:[]};}
function open(celebrate=false,wanted=window.TPLeague?.region??0){if(screen!=='league'||busy||tpSaveReplacing||window.TPRewardEgg?.active||!Number.isInteger(wanted)||wanted<0||wanted>1||wanted===1&&!window.TPRegions?.available(1))return false;region=wanted;try{
 if(typeof Module._tp_lg_owned==='function'&&c('tp_lg_owned'))return false;
 if(JSON.parse(scoped(Module,region,'tp_lg_view','string')).live)return false;
}catch(_){return false;}const v=view();active=true;hallPageInfoOpen=false;hallPageKey='';message='';selected=Math.max(0,v.records.length-1);
memberSelected=v.records[selected]?.team?.active||0;celebration=!!celebrate&&!!v.pendingCeremony;openedAt=performance.now();dragStart=dragNow=null;return true;}
function close(){if(busy)return;active=false;celebration=false;message='';hallPageHide();dragStart=dragNow=null;}
async function acknowledge(){if(busy||tpSaveReplacing)return false;const v=view();if(!v.supported)return false;if(!v.pendingCeremony){celebration=false;return true;}const owner=region,mod=Module;const native=(n,...a)=>scoped(mod,owner,n,'number',a);busy=true;tpSaveReplacing=true;tpSaveEpoch++;let token=0,durable=false;
 try{token=native('tp_lg_prepare_seen');if(!token)throw Error('Ehrung gerade nicht abschliessbar.');const bytes=exportStateBytes(mod);TPStoreTools.parseLegacy(bytes);if(await writeSave(bytes,true)!==true)throw Error('Speicherung nicht bestaetigt.');durable=true;if(native('tp_lg_finish',token,1)!==1)throw Error('Gespeichert. Fuer den lokalen Abschluss bitte neu laden.');celebration=false;message='Dein Ehrenplatz bleibt dauerhaft erhalten.';return true;
 }catch(e){if(token&&!durable)native('tp_lg_finish',token,0);message=e.message||String(e);return false;}
 finally{tpSaveEpoch++;tpSaveReplacing=false;busy=false;}}
function hallPageNode(tag,text,cls){
 const el=document.createElement(tag);
 if(text!==undefined)el.textContent=text;
 if(cls)el.className=cls;
 return el;
}
function hallPageIcon(kind){
 const symbol=hallPageNode('canvas',undefined,'tp-hall-action-icon');
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
function hallPageBounds(image){
 if(hallPageCropCache.has(image))return hallPageCropCache.get(image);
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
 hallPageCropCache.set(image,result);return result;
}

let hallPage=null,hallPageKey='',hallPageCanvas=null;
let hallPageAt=-Infinity,hallPageBuffer=null;
const hallPageCropCache=new WeakMap();
let hallPageInfoOpen=false;

function hallPageHide(){
 if(hallPage)hallPage.hidden=true;
 hallPageLayoutReset();
}
function hallPageButton(label,action,disabled=false){
 const el=hallPageNode('button',label);
 el.type='button';el.disabled=disabled;
 el.addEventListener('click',()=>{
  if(!active||screen!=='league'||hallPage?.hidden||busy||tpSaveReplacing||
   window.TPRewardEgg?.active||document.visibilityState!=='visible'||
   el.disabled||!el.isConnected)return;
  try{
   const task=action();
   if(task&&typeof task.then==='function')
    task.then(()=>{
     if(active)draw();else hallPageHide();
    }).catch(error=>{
     message=error.message||String(error);if(active)draw();
    });
  }catch(error){message=error.message||String(error);}
  if(active)draw();else hallPageHide();
 });
 return el;
}
function hallPageEggIcon(){
 const image=hallPageNode('canvas',undefined,'tp-hall-action-icon');
 image.width=24;image.height=24;
 image.setAttribute('aria-hidden','true');
 const p=image.getContext('2d');if(!p)return image;
 p.fillStyle='#fffdf7';p.strokeStyle='#315b83';p.lineWidth=2;
 p.beginPath();p.ellipse(12,13,7,9,0,0,Math.PI*2);p.fill();p.stroke();
 p.fillStyle='#79c5dc';p.fillRect(8,9,3,3);p.fillRect(13,14,4,3);
 p.fillStyle='#d7b768';p.fillRect(10,18,3,2);
 return image;
}
function hallPageArrow(symbol,label,action,disabled,attribute){
 const button=hallPageButton('',action,disabled);
 button.className='tp-hall-arrow';
 button.setAttribute(attribute,'');
 button.setAttribute('aria-label',label);
 button.setAttribute('title',label);
 button.append(hallPageNode('span',symbol,'tp-hall-arrow-face'));
 return button;
}

function hallPageRoom(p){
 p.fillStyle='#eee7d7';p.fillRect(0,0,560,280);
 p.fillStyle='#d6c8ab';p.fillRect(0,0,560,186);
 p.fillStyle='#f8efd8';p.fillRect(8,8,544,170);
 p.fillStyle='#b49b6b';p.fillRect(0,178,560,10);
 p.fillStyle='#ddd3bd';p.fillRect(0,188,560,92);

 for(let y=196;y<280;y+=24){
  p.fillStyle='#e8dfcc';p.fillRect(0,y,560,1);
  for(let x=(y%48===4?0:32);x<560;x+=64)
   p.fillRect(x,y,1,24);
 }
 p.fillStyle='#923f43';
 p.beginPath();p.moveTo(248,194);p.lineTo(312,194);
 p.lineTo(366,280);p.lineTo(194,280);p.closePath();p.fill();
 p.strokeStyle='#d6b25a';p.lineWidth=3;p.stroke();

 for(const x of [32,500]){
  p.fillStyle='#baa77e';p.fillRect(x,30,28,142);
  p.fillStyle='#e7d7b2';p.fillRect(x+5,36,7,130);
  p.fillStyle='#a38c5f';
  p.fillRect(x-3,25,34,8);p.fillRect(x-3,168,34,8);
 }
 p.fillStyle='#c7ad73';p.fillRect(202,188,156,12);
 p.fillStyle='#eee0ba';p.fillRect(212,180,136,8);

 const throne=["..........gggggg..........", "........ggyyyyyygg........", "......ggyyggggggyygg......", ".....gyyggppppppggyyg.....", "....gyygppppppppppgyyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "...ggygppppppppppppgygg...", "...gyygppppppppppppgyyg...", "...gyyggggggggggggggyyg...", "...gyyyyyyyyyyyyyyyyyyg...", "...gggggggggggggggggggg...", "....ggg............ggg....", "....gyg............gyg....", "....ggg............ggg...."];
 const colors={g:'#8d692b',y:'#ddba60',p:'#754652'};
 for(let row=0;row<throne.length;row++)
  for(let x=0;x<throne[row].length;x++){
   const color=colors[throne[row][x]];
   if(color){
    p.fillStyle=color;p.fillRect(228+x*4,36+row*4,4,4);
   }
  }

 for(let i=0;i<8;i++){
  const x=i<4?104+i*24:360+(i-4)*24;
  p.fillStyle='#c6a650';
  p.beginPath();p.moveTo(x,46);p.lineTo(x+5,51);
  p.lineTo(x,56);p.lineTo(x-5,51);p.closePath();p.fill();
 }
 p.fillStyle='#8a6b32';p.textAlign='center';
 p.textBaseline='alphabetic';p.font='bold 14px monospace';
 p.fillText(label().toUpperCase(),280,23);
}



function hallPageColor(key,fallback){
 if(typeof getComputedStyle==='function'&&hallPage){
  const value=getComputedStyle(hallPage).getPropertyValue(key).trim();
  if(value)return value;
 }
 const tokens=window.hubDexDesignTokens?.();
 return tokens?.[key]||fallback;
}
function hallPageRoomV3(p){
 const display=hallPageColor('--tp-pokedex-display','#fff');
 const line=hallPageColor('--tp-line','#ded2bd');
 const ink=hallPageColor('--tp-ink','#292831');
 p.fillStyle=display;p.fillRect(0,0,560,280);
 p.strokeStyle=line;p.lineWidth=2;
 p.strokeRect(12,12,536,176);
 p.beginPath();p.moveTo(0,196);p.lineTo(560,196);p.stroke();
 for(let y=220;y<280;y+=24){
  p.beginPath();p.moveTo(0,y);p.lineTo(560,y);p.stroke();
  for(let x=(y%48===28?0:32);x<560;x+=64){
   p.beginPath();p.moveTo(x,y);p.lineTo(x,y+24);p.stroke();
  }
 }
 p.fillStyle='#923f43';
 p.beginPath();p.moveTo(248,194);p.lineTo(312,194);
 p.lineTo(366,280);p.lineTo(194,280);p.closePath();p.fill();
 p.strokeStyle='#d6b25a';p.lineWidth=3;p.stroke();

 for(const x of [32,500]){
  p.fillStyle=display;p.fillRect(x,30,28,142);
  p.strokeStyle=line;p.lineWidth=2;p.strokeRect(x,30,28,142);
  p.fillStyle='#c6a650';
  p.fillRect(x-3,25,34,5);p.fillRect(x-3,172,34,5);
 }
 p.fillStyle=line;p.fillRect(202,188,156,12);
 p.fillStyle=display;p.fillRect(212,180,136,8);
 p.strokeStyle=line;p.lineWidth=2;p.strokeRect(212,180,136,8);

 const throne=["..........gggggg..........", "........ggyyyyyygg........", "......ggyyggggggyygg......", ".....gyyggppppppggyyg.....", "....gyygppppppppppgyyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "....gygppppppppppppgyg....", "...ggygppppppppppppgygg...", "...gyygppppppppppppgyyg...", "...gyyggggggggggggggyyg...", "...gyyyyyyyyyyyyyyyyyyg...", "...gggggggggggggggggggg...", "....ggg............ggg....", "....gyg............gyg....", "....ggg............ggg...."];
 const colors={g:'#8d692b',y:'#ddba60',p:'#754652'};
 for(let row=0;row<throne.length;row++)
  for(let x=0;x<throne[row].length;x++){
   const color=colors[throne[row][x]];
   if(color){
    p.fillStyle=color;p.fillRect(228+x*4,36+row*4,4,4);
   }
  }
 for(let i=0;i<8;i++){
  const x=i<4?104+i*24:360+(i-4)*24;
  p.fillStyle='#c6a650';
  p.beginPath();p.moveTo(x,46);p.lineTo(x+5,51);
  p.lineTo(x,56);p.lineTo(x-5,51);p.closePath();p.fill();
 }
 p.fillStyle=ink;p.textAlign='center';p.textBaseline='alphabetic';
 p.font='bold 14px monospace';
 p.fillText(label().toUpperCase(),280,23);
}

function hallPagePaint(record,member){
 if(!hallPageCanvas)return;
 const now=performance.now();
 if(now-hallPageAt<140)return;
 hallPageAt=now;
 const p=hallPageCanvas.getContext('2d');
 p.clearRect(0,0,560,280);p.imageSmoothingEnabled=false;
 if(hallPageVariant===3)hallPageRoomV3(p);else hallPageRoom(p);
 const mon=member||record;
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 if(hallPageVariant===4)hallFans(p,record,member,now,reduced);

 if(mon){
  const sprite=mon.form?
   megaSpriteFor(!!mon.shiny,mon.form):spriteFor(mon.dex,!!mon.shiny);
  if(sprite){
   const action=sprite.actions[TPAct.idle];
   if(action){
    const frame=frameImageData(sprite,TPAct.idle,
     reduced?0:frameIndexAt(action,now,true));
    const crop=frame?hallPageBounds(frame):null;
    if(crop){
     if(!hallPageBuffer)hallPageBuffer=document.createElement('canvas');
     hallPageBuffer.width=frame.width;
     hallPageBuffer.height=frame.height;
     hallPageBuffer.getContext('2d').putImageData(frame,0,0);
     const scale=Math.min(4,172/crop.w,122/crop.h);
     p.drawImage(hallPageBuffer,crop.x,crop.y,crop.w,crop.h,
      280-crop.w*scale/2,188-crop.h*scale,
      crop.w*scale,crop.h*scale);
    }
   }
  }else{
   if(!mon.form)ensureSprite(mon.dex);
   p.fillStyle='#526574';p.textAlign='center';
   p.font='26px monospace';p.fillText('?',280,150);
  }
 }

 if(celebration&&hallPageVariant===4){
  const t=reduced?0:(now-openedAt)/1000;
  const count=reduced?28:96;
  for(let i=0;i<count;i++){
   p.fillStyle=['#d6b34e','#fff0b0','#ad6870','#79c5dc'][i%4];
   const x=16+(i*47)%520+(reduced?0:Math.sin(t+i)*4);
   const y=28+((i*31+t*(35+i%7*4))%240);
   p.fillRect(x,y,2+i%2,3+i%3);
  }
 }else if(celebration&&now-openedAt<5000&&!reduced){
  const t=(now-openedAt)/1000;
  for(let i=0;i<22;i++){
   p.fillStyle=['#d6b34e','#fff0b0','#ad6870'][i%3];
   p.fillRect(55+(i*23)%450,30+((i*31+t*38)%154),3,5);
  }
 }
}

function hallPageDrawV1(){
 if(!active||screen!=='league'||window.TPRewardEgg?.active||
  typeof document.createElement!=='function'||
  typeof document.getElementById!=='function'){
  hallPageHide();return false;
 }
 const host=document.getElementById('tp-game-shell');
 if(!host){hallPageHide();return false;}
 const v=view(),record=v.records[selected]||null;
 const member=selectedMember(record),members=record?.team?.members||[];

 if(!hallPage){
  hallPage=hallPageNode('section');hallPage.id='tp-hall-page';
  hallPage.setAttribute('role','dialog');
  hallPage.setAttribute('aria-modal','true');
  host.appendChild(hallPage);
  hallPage.addEventListener('keydown',event=>{
   if(!active||hallPage.hidden)return;
   if(event.key==='Escape'&&!busy&&!tpSaveReplacing){
    event.preventDefault();event.stopPropagation();
    if(hallPageInfoOpen){
     hallPageInfoOpen=false;draw();
    }else{close();hallPageHide();}
    return;
   }
   if(event.key!=='Tab')return;
   const buttons=Array.from(hallPage.querySelectorAll('button'))
    .filter(el=>!el.disabled);
   const first=buttons[0],last=buttons[buttons.length-1];
   if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();last?.focus();
   }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();first?.focus();
   }
  });
 }

 hallPage.hidden=false;
 const key=JSON.stringify([
  region,selected,memberSelected,celebration,busy,tpSaveReplacing,message,hallPageInfoOpen,v
 ]);
 if(key!==hallPageKey){
  hallPageKey=key;hallPage.replaceChildren();hallPageAt=-Infinity;
  hallPage.setAttribute('data-hall-region',String(region));
  hallPage.setAttribute('data-hall-celebration',String(celebration));
  if(typeof window.hubDexDesignTokens==='function')
   for(const [name,value]of Object.entries(window.hubDexDesignTokens()))
    host.style.setProperty(name,value);

  const title=celebration?'Champ von '+label()+'!':'Ruhmeshalle · '+label();
  const head=hallPageNode('header',undefined,'tp-activity-head');
  const heading=hallPageNode('h2',title);heading.id='tp-hall-title';
  hallPage.setAttribute('aria-labelledby',heading.id);
  const back=hallPageButton(hallPageInfoOpen?'Zurück':celebration?'Später':'Zurück',
   ()=>{
    if(hallPageInfoOpen)hallPageInfoOpen=false;
    else close();
   },busy||tpSaveReplacing);
  back.setAttribute('data-hall-back','');
  head.append(heading,back);

  const frame=hallPageNode('div',undefined,'tp-activity-frame');
  frame.setAttribute('aria-hidden','true');
  for(const cls of [
   'tp-pokedex-display tp-pokedex-display-left',
   'tp-pokedex-display tp-pokedex-display-right','tp-pokedex-spine'
  ])frame.append(hallPageNode('span',undefined,cls));

  const actions=hallPageNode('div',undefined,'tp-hall-actions');
  if(members.length>1&&hallPageVariant!==4){
   actions.append(
    hallPageArrow('‹','Vorheriges gespeichertes Teammitglied',()=>{
     memberSelected=(memberSelected+members.length-1)%members.length;
    },busy||tpSaveReplacing,'data-hall-member-prev'),
    hallPageNode('span',(memberSelected+1)+' / '+members.length,
     'tp-hall-member-label'),
    hallPageArrow('›','Nächstes gespeichertes Teammitglied',()=>{
     memberSelected=(memberSelected+1)%members.length;
    },busy||tpSaveReplacing,'data-hall-member-next')
   );
  }
  if(!celebration){
   const egg=hallPageButton('',()=>window.TPRewardEgg?.open(region),
    busy||tpSaveReplacing||!v.supported||!window.TPRewardEgg);
   egg.append(hallPageEggIcon());
   egg.setAttribute('data-hall-egg','');
   egg.setAttribute('aria-label','Regionales Shiny-Ehrenei');
   egg.setAttribute('title','Regionales Shiny-Ehrenei');
   actions.append(egg);
  }
  if(celebration){
   const done=hallPageButton('✓',()=>acknowledge(),
    busy||tpSaveReplacing||!v.supported);
   done.setAttribute('data-hall-acknowledge','');
   done.setAttribute('aria-label','Ehrung abschließen');
   done.setAttribute('title','Ehrung abschließen');
   actions.append(done);
  }else if(v.pendingCeremony){
   const celebrate=hallPageButton('',()=>{
    celebration=true;openedAt=performance.now();message='';
   },busy||tpSaveReplacing||!v.supported);
   celebrate.append(hallPageIcon('league'));
   celebrate.setAttribute('data-hall-celebrate','');
   celebrate.setAttribute('aria-label','Siegerehrung ansehen');
   celebrate.setAttribute('title','Siegerehrung ansehen');
   actions.append(celebrate);
  }

  const information=hallPageButton('i',()=>{
   hallPageInfoOpen=!hallPageInfoOpen;
  },busy||tpSaveReplacing);
  information.setAttribute('data-hall-info','');
  information.setAttribute('aria-label','Gespeicherte Siegerdaten anzeigen');
  information.setAttribute('title','Gespeicherte Siegerdaten anzeigen');
  information.setAttribute('aria-expanded',String(hallPageInfoOpen));
  actions.append(information);

  const body=hallPageNode('div',undefined,'tp-activity-body');
  const left=hallPageNode('div',undefined,'tp-hall-stage');
  const right=hallPageNode('div',undefined,'tp-hall-detail-overlay');
  right.hidden=!hallPageInfoOpen;
  right.setAttribute('data-hall-detail-panel','');
  hallPageCanvas=hallPageNode('canvas',undefined,'tp-hall-portrait');
  hallPageCanvas.width=560;hallPageCanvas.height=280;
  hallPageCanvas.setAttribute('role','img');
  hallPageCanvas.setAttribute('data-hall-dex',String((member||record)?.dex??''));
  hallPageCanvas.setAttribute('aria-label',record?
   fns.dexName((member||record).dex):'Ehrenplatz ohne gespeichertes Siegerporträt');
  const plaque=hallPageNode('article',undefined,'tp-hall-plaque');
  const saved=member||record;
  const plaqueName=!v.supported?'Daten nicht verfügbar':
   saved?(saved.nick||fns.dexName(saved.dex)):
   v.legacy?'Abschluss bestätigt':'Dein Ehrenplatz wartet';
  const plaqueText=!v.supported?'Weitere Angaben über Info':
   saved?((saved.shiny?'★ · ':'')+
    (member?'Start-Lv. ':'Lv. ')+saved.level+
    ' · Sieg '+record.sequence+' · '+date(record.date)):
   v.legacy?'Sieger damals nicht erfasst · '+date(v.legacyDate):
   'Hier bleibt dein tatsächlicher Champsieg erhalten.';
  plaque.append(hallPageNode('h3',plaqueName),hallPageNode('p',plaqueText));
  left.append(hallPageCanvas,plaque);

  const info=hallPageNode('article',undefined,'tp-hall-info');info.tabIndex=0;
  if(!v.supported){
   info.append(hallPageNode('h3','Nicht verfügbar'),
    hallPageNode('p',ready()?
     'Ruhmeshallendaten nicht unterstützt.':'Bitte aktuellen Spielkern laden.'));
  }else if(member){
   const species=fns.dexName(member.dex);
   info.append(
    hallPageNode('h3',member.nick||species),
    hallPageNode('p',leagueText('startLevel',{
     species,level:member.level,shiny:member.shiny?leagueText('shiny'):''
    })),
    hallPageNode('p',leagueText('memberWins',{
     wins:member.wins,gains:member.levelGains,
     winner:member.id===record.winnerId?leagueText('lastWinner'):''
    })),
    hallPageNode('p',leagueText('teamTitle',{
     sequence:record.sequence,date:date(record.date)
    })),
    hallPageNode('p',leagueText('teamSummary',{
     count:members.length,wins:v.wins
    }))
   );
  }else if(record){
   const species=fns.dexName(record.dex);
   info.append(
    hallPageNode('h3',record.nick||species),
    hallPageNode('p',(record.nick?species+' · ':'')+
     'Lv. '+record.level+(record.shiny?' · SCHILLERND':'')),
    hallPageNode('p','Erfasster Sieg '+record.sequence+' · '+date(record.date)),
    hallPageNode('p',region===1?'Champ: Siegfried':
     'Champvariante: '+['Glurak','Turtok','Bisaflor'][record.variant]),
    hallPageNode('p','Erfasste Siege: '+v.wins)
   );
  }else if(v.legacy){
   info.append(hallPageNode('h3','Abschluss bestätigt'),
    hallPageNode('p','Sieger-Pokémon damals nicht gespeichert.'),
    hallPageNode('p','Kein heutiges Pokémon wird nachgetragen.'),
    hallPageNode('p',date(v.legacyDate)));
  }else{
   info.append(hallPageNode('h3','Dein Ehrenplatz wartet'),
    hallPageNode('p','Nach einem Champsieg wird hier der tatsächlich gespeicherte Sieger gezeigt.'));
  }
  right.append(info);body.append(left,right);

  const footer=hallPageNode('div',undefined,'tp-hall-footer');
  footer.append(
   hallPageArrow('‹','Vorheriger Ruhmeshalleneintrag',()=>{
    selected=Math.max(0,selected-1);
    memberSelected=v.records[selected]?.team?.active||0;
   },busy||tpSaveReplacing||celebration||selected<=0,'data-hall-record-prev'),
   hallPageNode('span',message||(v.records.length?
    (selected+1)+' / '+v.records.length+' · '+label():label()),
    'tp-hall-footer-label'),
   hallPageArrow('›','Nächster Ruhmeshalleneintrag',()=>{
    selected=Math.min(v.records.length-1,selected+1);
    memberSelected=v.records[selected]?.team?.active||0;
   },busy||tpSaveReplacing||celebration||selected>=v.records.length-1,
    'data-hall-record-next')
  );
  footer.setAttribute('role','group');
  footer.setAttribute('aria-label','Ruhmeshalleneinträge');
  hallPage.append(head,frame,actions,body,footer);
 }
 statusEl.textContent=!v.supported?'Ruhmeshalle nicht verfügbar':
  record?.team?leagueText('hallStatus'):
  celebration?'Siegerehrung · gespeicherter Sieger':
  'Ruhmeshalle · '+v.wins+' erfasste Siege';
 hallPagePaint(record,member);return true;
}

/* Variants: 1=panorama, 2=wide gallery, 3=stacked displays, 4=whole device rotated. */
const hallPageVariant=4;
let hallV2Gallery=null,hallV2Canvas=null,hallV2PlaqueTitle=null;
let hallV2PlaqueText=null,hallV2PaintAt=-Infinity,hallV2Buffer=null;

function hallPageLayoutReset(){
 if(typeof document.getElementById!=='function')return;
 document.getElementById('tp-game-shell')?.removeAttribute?.('data-hall-layout');
}
function hallV2Find(parent,cls){
 return Array.from(parent?.children||[]).find(el=>
  String(el.className||'').split(/\s+/).includes(cls))||null;
}
function hallV2StoredSprite(p,mon,x,y,width,height,now){
 const sprite=mon.form?
  megaSpriteFor(!!mon.shiny,mon.form):spriteFor(mon.dex,!!mon.shiny);
 if(!sprite){
  if(!mon.form)ensureSprite(mon.dex);
  p.fillStyle='#526574';p.textAlign='center';p.font='16px monospace';
  p.fillText('?',x+width/2,y+height/2+5);return;
 }
 const action=sprite.actions[TPAct.idle];if(!action)return;
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const frame=frameImageData(sprite,TPAct.idle,
  reduced?0:frameIndexAt(action,now,true));
 const crop=frame?hallPageBounds(frame):null;if(!crop)return;
 if(!hallV2Buffer)hallV2Buffer=document.createElement('canvas');
 hallV2Buffer.width=frame.width;hallV2Buffer.height=frame.height;
 hallV2Buffer.getContext('2d').putImageData(frame,0,0);
 const scale=Math.min(4,width/crop.w,height/crop.h);
 p.imageSmoothingEnabled=false;
 p.drawImage(hallV2Buffer,crop.x,crop.y,crop.w,crop.h,
  x+(width-crop.w*scale)/2,y+(height-crop.h*scale)/2,
  crop.w*scale,crop.h*scale);
}
function hallV2GalleryPaint(record){
 if(!hallV2Canvas)return;
 const now=performance.now();
 if(now-hallV2PaintAt<140)return;
 hallV2PaintAt=now;
 const p=hallV2Canvas.getContext('2d');
 p.clearRect(0,0,560,280);p.imageSmoothingEnabled=false;
 p.fillStyle='#d6c8ab';p.fillRect(0,0,560,280);
 p.fillStyle='#f8efd8';p.fillRect(8,8,544,196);
 p.fillStyle='#b49b6b';p.fillRect(0,198,560,8);
 p.fillStyle='#ddd3bd';p.fillRect(0,206,560,74);
 p.fillStyle='#8a6b32';p.textAlign='center';
 p.font='bold 12px monospace';
 const members=record?.team?.members||[];
 p.fillText(members.length?'GESPEICHERTES SIEGERTEAM':'EHRENPLATZ',280,17);
 if(members.length){
  members.forEach((mon,index)=>{
   const x=index%2?310:110,y=24+Math.floor(index/2)*54;
   p.fillStyle='#fffaf0';p.fillRect(x,y,140,48);
   p.strokeStyle=index===memberSelected?'#315b83':'#b49959';
   p.lineWidth=index===memberSelected?3:1;
   p.strokeRect(x,y,140,48);
   hallV2StoredSprite(p,mon,x+16,y+3,108,40,now);
  });
 }else{
  p.fillStyle='#d7b768';p.fillRect(220,50,120,58);
  p.strokeStyle='#8d692b';p.lineWidth=4;p.strokeRect(220,50,120,58);
  p.strokeRect(192,59,28,35);p.strokeRect(340,59,28,35);
  p.fillStyle='#b49959';p.fillRect(270,108,20,42);
  p.fillRect(228,150,104,12);
 }
}

let hallV4Decorated=null,hallV4Size='';
function hallV4Copy(el,kind='copy'){
 if(!el||!el.childNodes||el.children.length)return;
 const span=hallPageNode('span',el.textContent,'tp-hall-upright-'+kind);
 el.replaceChildren(span);
}

function hallV4BackIcon(){
 const icon=hallPageNode('canvas',undefined,'tp-hall-back-icon');
 icon.width=24;icon.height=24;icon.setAttribute('aria-hidden','true');
 icon.setAttribute('data-hall-back-icon','curved-left');
 const p=icon.getContext('2d');if(!p)return icon;
 p.strokeStyle='#315b83';p.lineWidth=2.2;
 p.lineCap='round';p.lineJoin='round';
 p.beginPath();p.moveTo(4,8);p.lineTo(12,8);
 p.bezierCurveTo(22,8,23,19,14,21);
 p.bezierCurveTo(8,23,3,19,4,15);p.stroke();
 p.beginPath();p.moveTo(8,4);p.lineTo(4,8);p.lineTo(8,12);p.stroke();
 return icon;
}

let hallTeamThumbs=[],hallTeamPaintAt=-Infinity;
function hallTeamPanel(v,record){
 const members=record?.team?.members;
 if(!v.supported||!Array.isArray(members)||!members.length)return false;
 const plaque=hallV2Find(hallV2Gallery,'tp-hall-plaque');if(!plaque)return false;
 plaque.setAttribute('data-hall-team-display','true');
 const header=hallPageNode('div',label()+' · Sieg '+record.sequence+' · '+date(record.date),
  'tp-hall-team-heading');
 const grid=hallPageNode('div',undefined,'tp-hall-winners');
 grid.setAttribute('role','group');grid.setAttribute('aria-label','Gespeichertes Siegerteam');
 hallTeamThumbs=[];hallTeamPaintAt=-Infinity;
 members.forEach((member,index)=>{
  const name=member.nick||fns.dexName(member.dex);
  const tile=hallPageButton('',()=>{memberSelected=index;},busy||tpSaveReplacing);
  tile.className='tp-hall-winner';
  tile.setAttribute('data-hall-team-index',String(index));
  tile.setAttribute('data-hall-team-id',String(member.id));
  tile.setAttribute('aria-pressed',String(index===memberSelected));
  tile.setAttribute('aria-label',name+' · Start-Level '+member.level+
   (member.id===record.winnerId?' · Letzter Sieger':''));
  const picture=hallPageNode('canvas',undefined,'tp-hall-team-picture');
  picture.width=96;picture.height=64;picture.setAttribute('aria-hidden','true');
  picture.setAttribute('data-hall-team-dex',String(member.dex));
  tile.append(picture,hallPageNode('span',name,'tp-hall-team-name'),
   hallPageNode('small','Lv. '+member.level+(member.shiny?' ★':'')));
  if(member.id===record.winnerId){
   const cup=hallPageIcon('league');cup.className='tp-hall-team-cup';
   cup.setAttribute('aria-hidden','true');tile.append(cup);
   tile.setAttribute('data-hall-final-winner','true');
  }
  hallTeamThumbs.push({picture,member});grid.append(tile);
 });
 const parts=[header,grid];
 if(message){
  const notice=hallPageNode('p',message,'tp-hall-certificate-notice');
  notice.setAttribute('role','status');parts.push(notice);
 }
 plaque.replaceChildren(...parts);return true;
}
function hallTeamPaint(){
 const now=performance.now();if(now-hallTeamPaintAt<140)return;
 hallTeamPaintAt=now;
 for(const {picture,member}of hallTeamThumbs){
  if(!picture.isConnected)continue;
  const p=picture.getContext('2d');p.clearRect(0,0,96,64);
  hallV2StoredSprite(p,member,0,0,96,64,now);
 }
}
function hallFans(p,record,member,now,reduced){
 if(!celebration)return;
 const members=record?.team?.members||[];
 const fans=members.length?members.filter(mon=>mon.id!==member?.id):
  [{dex:1,shiny:false},{dex:25,shiny:false},
   {dex:1,shiny:false},{dex:25,shiny:false}];
 const spots=[[52,224],[460,224],[112,233],[400,233],[164,222],[348,222]];
 fans.slice(0,6).forEach((mon,index)=>{
  const sprite=mon.form?
   megaSpriteFor(!!mon.shiny,mon.form):spriteFor(mon.dex,!!mon.shiny);
  if(!sprite){
   if(!mon.form)ensureSprite(mon.dex);
   return;
  }
  const hop=reduced?0:Math.max(0,Math.sin((now-openedAt)/190+index))*7;
  hallV2StoredSprite(p,mon,spots[index][0],spots[index][1]-hop,48,44,now);
 });
}

function hallV4Certificate(v,record){
 const plaque=hallV2Find(hallV2Gallery,'tp-hall-plaque');if(!plaque)return;
 plaque.setAttribute('data-hall-certificate','true');
 plaque.setAttribute('aria-label',label()+'-Liga · Gespeicherter Champsieg');
 hallTeamThumbs=[];
 if(hallTeamPanel(v,record))return;
 const parts=[hallPageNode('div',label()+'-Liga','tp-hall-certificate-region')];
 const add=(tag,text,cls)=>parts.push(hallPageNode(tag,text,cls));
 if(!v.supported){
  add('h3','Daten nicht verfügbar');
  add('p','Bitte gespeicherte Angaben über Info prüfen.');
 }else if(record){
  const member=selectedMember(record),saved=member||record;
  const species=fns.dexName(saved.dex);
  add('h3',saved.nick||species);
  if(saved.nick&&saved.nick!==species)
   add('p',species,'tp-hall-certificate-species');
  add('p',(member?'Start-Lv. ':'Sieg-Level ')+saved.level+
   (saved.shiny?' · ★ Schillernd':''),'tp-hall-certificate-level');
  if(member){
   add('p','Siege: '+member.wins+' · Levelgewinne: +'+member.levelGains,
    'tp-hall-certificate-stats');
   add('p','Mitglied '+(memberSelected+1)+' / '+record.team.members.length+
    (member.id===record.winnerId?' · Letzter Sieger':''),
    'tp-hall-certificate-member');
  }else{
   add('p',region===1?'Champ: Siegfried':
    'Champvariante: '+(['Glurak','Turtok','Bisaflor'][record.variant]||'nicht erfasst'),
    'tp-hall-certificate-champion');
  }
  add('p','Sieg '+record.sequence+' · '+date(record.date),
   'tp-hall-certificate-date');
 }else if(v.legacy){
  add('h3','Abschluss bestätigt');
  add('p','Sieger-Pokémon damals nicht gespeichert.');
  add('p',date(v.legacyDate),'tp-hall-certificate-date');
 }else{
  add('h3','Dein Ehrenplatz wartet');
  add('p','Hier wird dein tatsächlich gespeicherter Champsieg gewürdigt.');
 }
 if(message){
  const notice=hallPageNode('p',message,'tp-hall-certificate-notice');
  notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');
  parts.push(notice);
 }
 plaque.replaceChildren(...parts);
}
function hallV4Layout(body,stage,v,record){
 const width=stage.clientWidth,height=stage.clientHeight;
 const bw=body.clientWidth,bh=body.clientHeight;
 if(width>0&&height>0&&bw>0&&bh>0){
  const key=[width,height,bw,bh].join('/');
  if(key!==hallV4Size){
   hallV4Size=key;
   for(const [name,value]of Object.entries({
    '--tp-hall-slot-w':width,'--tp-hall-slot-h':height,
    '--tp-hall-body-w':bw,'--tp-hall-body-h':bh
   }))hallPage.style.setProperty(name,value+'px');
  }
 }
 if(hallV4Decorated===body)return;
 hallV4Decorated=body;
 hallPage.setAttribute('data-hall-detail-revision','1');
 const head=hallV2Find(hallPage,'tp-activity-head');
 const heading=Array.from(head?.children||[])[0];
 if(heading)heading.textContent='Ruhmeshalle';
 const buttons=Array.from(hallPage.querySelectorAll('button'));
 const back=buttons.find(button=>typeof button.hasAttribute==='function'?
  button.hasAttribute('data-hall-back'):
  Object.prototype.hasOwnProperty.call(button.attributes||{},'data-hall-back'));
 if(back){
  const text=hallPageInfoOpen?'Zurück zur Ruhmeshalle':
   celebration?'Siegerehrung später fortsetzen':'Zurück zur Liga';
  back.setAttribute('aria-label',celebration&&!hallPageInfoOpen?'Später':'Zurück');
  back.setAttribute('title',text);
  back.replaceChildren(hallV4BackIcon());
 }
 for(const button of buttons){
  if(!button.childNodes)continue;
  if(!button.children.length){hallV4Copy(button,'glyph');continue;}
  for(const child of Array.from(button.children)){
   if(String(child.className||'').includes('tp-hall-arrow-face'))
    hallV4Copy(child,'glyph');
   else child.className+=' tp-hall-upright-icon';
  }
 }
 const actions=hallV2Find(hallPage,'tp-hall-actions');
 hallV4Copy(hallV2Find(actions,'tp-hall-member-label'),'glyph');
 const footer=hallV2Find(hallPage,'tp-hall-footer');
 const counter=hallV2Find(footer,'tp-hall-footer-label');
 if(counter){
  const total=v.records.length;
  const text=total?String(selected+1).padStart(2,'0')+'/'+
   String(total).padStart(2,'0'):'—';
  counter.replaceChildren(hallPageNode('span',text,'tp-hall-entry-counter'));
  counter.setAttribute('aria-label',total?
   'Eintrag '+(selected+1)+' von '+total:'Keine gespeicherten Einträge');
 }
 hallV4Certificate(v,record);
}


function hallPageDraw(){
 const shown=hallPageDrawV1();
 if(!shown){hallPageLayoutReset();return false;}
 hallPage.setAttribute('data-hall-layout-variant',String(hallPageVariant));
 if(hallPageVariant===1){
  hallPageLayoutReset();return true;
 }
 const host=document.getElementById('tp-game-shell');
 if(!host)return true;
 host.setAttribute('data-hall-layout','v'+hallPageVariant);
 const body=hallV2Find(hallPage,'tp-activity-body');
 const stage=hallV2Find(body,'tp-hall-stage');
 if(!body||!stage)return true;

 if(!hallV2Gallery||!hallV2Gallery.isConnected){
  hallV2Gallery=hallPageNode('div',undefined,'tp-hall-gallery');
  hallV2Canvas=hallPageNode('canvas',undefined,'tp-hall-gallery-canvas');
  hallV2Canvas.width=560;hallV2Canvas.height=280;
  hallV2Canvas.setAttribute('role','img');
  hallV2Canvas.setAttribute('aria-label','Ehrenwand mit gespeicherten Siegerdaten');
  const plaque=hallPageNode('article',undefined,
   'tp-hall-plaque tp-hall-gallery-plaque');
  hallV2PlaqueTitle=hallPageNode('h3','');
  hallV2PlaqueText=hallPageNode('p','');
  plaque.append(hallV2PlaqueTitle,hallV2PlaqueText);
  hallV2Gallery.append(hallV2Canvas,plaque);
  body.append(hallV2Gallery);hallV2PaintAt=-Infinity;
 }
 const originalPlaque=hallV2Find(stage,'tp-hall-plaque');
 const parts=Array.from(originalPlaque?.children||[]);
 hallV2PlaqueTitle.textContent=parts[0]?.textContent||'Ehrenplatz';
 hallV2PlaqueText.textContent=parts[1]?.textContent||'';
 const current=view(),record=current.records[selected]||null;
 hallV2Gallery.setAttribute('data-hall-gallery-members',
  String(record?.team?.members?.length||0));
 if(hallPageVariant===2)hallV2GalleryPaint(record);
 if(hallPageVariant===4){
  hallV4Layout(body,stage,current,record);hallTeamPaint();
  hallPageCanvas.setAttribute('data-hall-fans',String(celebration));
  hallPageCanvas.setAttribute('data-hall-fan-kind','pokemon');
 }
 return true;
}


function text(s,x,y,size=14,color='#34423d',max=410){ctx.fillStyle=color;ctx.textAlign='center';ctx.font=size+'px monospace';ctx.fillText(String(s),x,y,max);}
function box(x,y,w,h,fill,stroke='#b9aa8c'){ctx.fillStyle=fill;roundRect(x,y,w,h,7);ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
function button(s,x,y,w=326,h=36){box(x,y,w,h,'#fffaf0');text(s,x+w/2,y+h/2+5,14,'#34423d',w-12);}
function room(){ctx.fillStyle='#eee7d7';ctx.fillRect(0,0,466,466);ctx.fillStyle='#d6c8ab';ctx.fillRect(20,45,426,213);ctx.fillStyle='#f8efd8';ctx.fillRect(28,53,410,188);ctx.fillStyle='#b49b6b';ctx.fillRect(20,238,426,12);ctx.fillStyle='#ddd3bd';ctx.fillRect(20,250,426,154);
 for(let y=250;y<404;y+=26){ctx.fillStyle=(y%52===42)?'#e8dfcc':'#e0d5bc';ctx.fillRect(20,y,426,1);for(let x=20+(y%52===42?0:34);x<446;x+=68)ctx.fillRect(x,y,1,26);}
 ctx.fillStyle='#923f43';ctx.beginPath();ctx.moveTo(208,250);ctx.lineTo(258,250);ctx.lineTo(294,404);ctx.lineTo(172,404);ctx.closePath();ctx.fill();ctx.strokeStyle='#d6b25a';ctx.lineWidth=3;ctx.stroke();
 for(const x of [42,400]){ctx.fillStyle='#baa77e';ctx.fillRect(x,69,24,160);ctx.fillStyle='#e7d7b2';ctx.fillRect(x+5,75,6,146);ctx.fillStyle='#a38c5f';ctx.fillRect(x-3,64,30,8);ctx.fillRect(x-3,225,30,8);}
 ctx.fillStyle='#c7ad73';ctx.fillRect(170,235,126,13);ctx.fillStyle='#eee0ba';ctx.fillRect(179,226,108,9);
 const throne=['..........gggggg..........','........ggyyyyyygg........','......ggyyggggggyygg......','.....gyyggppppppggyyg.....','....gyygppppppppppgyyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','...ggygppppppppppppgygg...','...gyygppppppppppppgyyg...','...gyyggggggggggggggyyg...','...gyyyyyyyyyyyyyyyyyyg...','...gggggggggggggggggggg...','....ggg............ggg....','....gyg............gyg....','....ggg............ggg....'];
 const colors={g:'#8d692b',y:'#ddba60',p:'#754652'};for(let r=0;r<throne.length;r++){const row=throne[r];for(let i=0;i<row.length;){let j=i+1;while(j<row.length&&row[j]===row[i])j++;if(colors[row[i]]){ctx.fillStyle=colors[row[i]];ctx.fillRect(181+i*4,81+r*4,(j-i)*4,4);}i=j;}}
 text(label().toUpperCase(),233,65,13,'#8a6b32');for(let i=0;i<8;i++){const x=92+(i%4)*21+(i>=4?200:0);ctx.fillStyle='#c6a650';ctx.beginPath();ctx.moveTo(x,100);ctx.lineTo(x+6,106);ctx.lineTo(x,112);ctx.lineTo(x-6,106);ctx.closePath();ctx.fill();}}
function sprite(r){if(!r)return;const s=r.form?megaSpriteFor(!!r.shiny,r.form):spriteFor(r.dex,!!r.shiny);if(!s){text('?',233,212,40,'#fff2bf');return;}const a=s.actions[TPAct.idle];if(!a)return;const img=frameImageData(s,TPAct.idle,frameIndexAt(a,performance.now(),true));if(!img)return;frameCanvas.width=a.w;frameCanvas.height=a.h;frameCtx.putImageData(img,0,0);const z=Math.min(3,112/a.w,110/a.h);ctx.imageSmoothingEnabled=false;ctx.drawImage(frameCanvas,233-a.w*z/2,235-a.h*z,a.w*z,a.h*z);}
function selectedMember(record){
 const members=record?.team?.members;
 if(!Array.isArray(members)||!members.length)return null;
 memberSelected=Math.max(0,Math.min(memberSelected,members.length-1));
 return members[memberSelected];
}
function date(n){return n?new Date(n*1000).toLocaleDateString('de-DE'):'Datum nicht erfasst';}
function draw(){if(hallPageDraw())return;if(window.TPRewardEgg?.active){window.TPRewardEgg.draw();return;}const v=view();room();text(celebration?'Du bist Champ von '+label()+'!':'Ruhmeshalle · '+label(),233,30,22);if(!v.supported){box(34,275,398,108,'#fffaf0');text(ready()?'Ruhmeshallendaten nicht unterstützt.':'Bitte den neuen Spielkern bauen.',233,315,15);button('Zurück zur Liga',70,416);statusEl.textContent='Ruhmeshalle nicht verfügbar';return;}
 if(!celebration)button('Shiny-Ei',80,144,94,34);
 const r=v.records[selected]||null,member=selectedMember(r);
 if(r)sprite(member||r);else text(v.legacy?label().toUpperCase()+'-CHAMP':'DEIN EHRENPLATZ',233,205,17,'#fff1be');
 if(member){
  if(r.team.members.length>1){
   button('‹',80,200,42,30);button('›',344,200,42,30);
  }
  text(leagueText('member',{
   current:memberSelected+1,total:r.team.members.length
  }),233,246,11);
 }
 if(celebration&&performance.now()-openedAt<5000){const t=(performance.now()-openedAt)/1000;for(let i=0;i<18;i++){ctx.fillStyle=['#d6b34e','#fff0b0','#ad6870'][i%3];ctx.fillRect(32+(i*29)%400,60+((i*43+t*42)%180),3,6);}}
 box(34,274,398,124,'#fffaf0');
 if(member){
  const species=fns.dexName(member.dex);
  text(member.nick||species,233,298,20);
  text(leagueText('startLevel',{
   species,level:member.level,shiny:member.shiny?leagueText('shiny'):''
  }),233,320,12);
  text(leagueText('memberWins',{
   wins:member.wins,gains:member.levelGains,
   winner:member.id===r.winnerId?leagueText('lastWinner'):''
  }),233,341,11);
  text(leagueText('teamTitle',{sequence:r.sequence,date:date(r.date)}),
   233,360,12);
  text(leagueText('teamSummary',{count:r.team.members.length,wins:v.wins}),
   233,382,11);
 }else if(r){const species=fns.dexName(r.dex);text(r.nick||species,233,298,20);text((r.nick?species+' · ':'')+'Lv. '+r.level+(r.shiny?' · SCHILLERND':''),233,320,13);text('Erfasster Sieg '+r.sequence+' · '+date(r.date),233,341,12);text(region===1?'Champ: Siegfried':'Champvariante: '+['Glurak','Turtok','Bisaflor'][r.variant],233,360,12);text(region===1?'Erfasste Siege: '+v.wins:'Erfasste Siege: '+v.wins+' · Varianten: '+[0,1,2].filter(i=>v.variants&(1<<i)).length+' / 3',233,382,12);}
 else if(v.legacy){text('Dein '+label()+'-Abschluss ist bestätigt.',233,300,16);text('Sieger-Pokémon damals nicht gespeichert.',233,325,13);text('Wir tragen kein heutiges Pokémon nachträglich ein.',233,348,12);text(date(v.legacyDate),233,376,12);}
 else{text('Dieser Platz wartet auf deinen Champsieg.',233,315,16);text('Das tatsächlich siegreiche Pflege-Pokémon',233,344,13);text('wird hier dauerhaft aufgenommen.',233,365,13);}
 if(v.records.length>1&&!celebration){button('‹',34,239,40,28);button('›',392,239,40,28);text((selected+1)+' / '+v.records.length,233,264,11);}
 if(message)text(message,233,410,11,'#934941');
 if(celebration){button('Später',70,424,146,32);button('Ehrung abschließen',250,424,146,32);}else if(v.pendingCeremony){button('Zurück',70,424,146,32);button('Siegerehrung',250,424,146,32);}else button('Zurück zur Liga',70,424,326,32);
 statusEl.textContent=r?.team?leagueText('hallStatus'):celebration?'Siegerehrung · dein tatsächliches Sieger-Pokémon':v.legacy?'Ruhmeshalle · ältere Abschlüsse bleiben anerkannt':'Ruhmeshalle · '+v.wins+' erfasste Siege';}
function tap(x,y){if(busy||tpSaveReplacing)return;if(window.TPRewardEgg?.active){window.TPRewardEgg.tap(x,y);return;}const v=view();
 const record=v.records[selected],member=selectedMember(record);
 if(member&&record.team.members.length>1&&y>=200&&y<=230){
  if(x>=80&&x<=122)
   memberSelected=(memberSelected+record.team.members.length-1)%
    record.team.members.length;
  else if(x>=344&&x<=386)
   memberSelected=(memberSelected+1)%record.team.members.length;
  return;
 }
 if(!celebration&&v.supported&&x>=80&&x<=174&&y>=144&&y<=178){window.TPRewardEgg?.open(region);return;}if(y>=424&&y<=460){if(celebration){if(x>=70&&x<=216)close();else if(x>=250&&x<=396)acknowledge();}else if(v.pendingCeremony){if(x>=70&&x<=216)close();else if(x>=250&&x<=396){celebration=true;openedAt=performance.now();message='';}}else if(x>=70&&x<=396)close();return;}
 if(!celebration&&v.records.length>1&&y>=239&&y<=267){if(x>=34&&x<=74)selected=Math.max(0,selected-1);else if(x>=392&&x<=432)selected=Math.min(v.records.length-1,selected+1);
 memberSelected=v.records[selected]?.team?.active||0;}}
window.TPHall=Object.freeze({open,close,hidePage:hallPageHide,get layoutVariant(){return hallPageVariant;},get region(){return region;},draw,tap,acknowledge,get active(){return active;},get busy(){return busy||!!window.TPRewardEgg?.busy;},get view(){return view();},get diagnostics(){return Object.freeze({active,busy,celebration,message,selected,memberSelected});}});
})();
