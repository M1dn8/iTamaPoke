
/* UI01 action picker: UI ownership only, no duplicate gameplay or storage. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports){module.exports=api;return;}
 const words={
  en:{actions:'Actions',games:'Play',training:'Training',battle:'Battle',
   expedition:'Expedition',strength:'Strength',defence:'Defence',speed:'Speed',
   wild:'Wild',trainer:'Trainer',arena:'Arena',failed:'Currently unavailable.'},
  de:{actions:'Aktionen',games:'Spielen',training:'Training',battle:'Kampf',
   expedition:'Expedition',strength:'Stärke',defence:'Abwehr',speed:'Tempo',
   wild:'Wild',trainer:'Trainer',arena:'Arena',failed:'Gerade nicht verfügbar.'},
  es:{actions:'Acciones',games:'Jugar',training:'Entrenar',battle:'Combate',
   expedition:'Expedición',strength:'Fuerza',defence:'Defensa',speed:'Velocidad',
   wild:'Salvaje',trainer:'Entrenador',arena:'Gimnasio',failed:'No disponible ahora.'},
  fr:{actions:'Actions',games:'Jouer',training:'Entraîner',battle:'Combat',
   expedition:'Expédition',strength:'Force',defence:'Défense',speed:'Vitesse',
   wild:'Sauvage',trainer:'Dresseur',arena:'Arène',failed:'Indisponible actuellement.'}
 };
 if(root.TPText?.registerLocale)
  for(const code of ['en','de','es','fr'])
   root.TPText.registerLocale(code,Object.fromEntries(
    Object.entries(words[code]).map(([key,value])=>['actionMenu.'+key,value])
   ));
 const label=key=>root.TPText?.t?
  root.TPText.t('actionMenu.'+key):words.de[key]||key;
 function canOpen(){
  try{
   return !!Module&&screen==='idle'&&choice==='none'&&
    document.visibilityState==='visible'&&!fns.awaitingStarter()&&
    !fns.isEgg()&&!fns.sleeping()&&!fns.ceremony()&&!fns.evolvingNow()&&
    !fns.wildPromptActive()&&!tpSaveReplacing&&performance.now()>=confirmUntil&&
    !root.TPAppMenu?.active&&!root.TPBoxes?.active&&
    !root.TPCollection?.busy&&!root.TPCollection?.blocked&&
    !root.TPCollectionGame?.dialogOpen&&!root.TPAdmissionUI?.active&&
    !root.TPAdmissionUI?.busy&&!root.TPTraining?.busy&&!root.TPMega?.busy&&
    !root.TPExpeditions?.busy&&!root.TPArena?.busy&&!root.TPLeague?.busy&&
    !root.TPWildTeam?.starting&&!root.TPWildTeam?.saving;
  }catch(_){return false;}
 }
 function enabled(id){
 try{
  if(id==='games')return true;
  if(id==='training'||id==='battle')return !!root.TPActivities?.canOpen(id);
  if(id==='expedition')return typeof root.TPExpeditions?.open==='function';
 }catch(_){}
 return false;
}
 function invoke(id){
 if(id==='games'){dragStart=dragNow=null;screen='gamemenu';return true;}
 if(id==='training'||id==='battle')return root.TPActivities.open(id);
 if(id==='expedition')return root.TPExpeditions.open('idle');
 return false;
}
 function symbol(id,x,y){
 const map=id==='games'?TPIcon.play:api.icons[id];
 if(map)drawIcon(map,x-24,y-24,3);
}

root.TPActions=api.create({
 canOpen,enabled,label,invoke,
 onOpen(){feedMenuUntil=0;dragStart=dragNow=null;holdFired=false;},
 paint(view){
  ctx.save();ctx.fillStyle=UI.white;ctx.strokeStyle=UI.ink;ctx.lineWidth=1;
  roundRect(101,288,264,64,14);ctx.fill();ctx.stroke();
  for(const item of view.items){
   ctx.save();ctx.globalAlpha=item.enabled&&!view.busy?1:0.4;
   symbol(item.id,item.x+item.w/2,item.y+32);
   ctx.restore();
  }
  statusEl.textContent=label('actions')+' · '+
   (view.notice||view.items.map(item=>item.label).join(' · '));
  ctx.restore();
 }
});
 document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState!=='visible')root.TPActions.close(true);
 });
 root.addEventListener('pagehide',()=>root.TPActions.close(true));
 root.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&root.TPActions.active&&!root.TPActions.busy){
   event.preventDefault();event.stopImmediatePropagation();
   root.TPActions.close();
  }
 },true);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';

 function glyph(paint){
  const rows=Array.from({length:16},()=>Array(16).fill('.'));
  const set=(x,y,color)=>{
   if(x>=0&&x<16&&y>=0&&y<16)rows[y][x]=color;
  };
  const rect=(x,y,w,h,color)=>{
   for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)set(xx,yy,color);
  };
  const line=(x0,y0,x1,y1,color,width=1)=>{
   const dx=Math.abs(x1-x0),sx=x0<x1?1:-1;
   const dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;
   let error=dx+dy;
   for(;;){
    const half=Math.floor(width/2);
    rect(x0-half,y0-half,width,width,color);
    if(x0===x1&&y0===y1)break;
    const twice=2*error;
    if(twice>=dy){error+=dy;x0+=sx;}
    if(twice<=dx){error+=dx;y0+=sy;}
   }
  };
  paint({set,rect,line});
  return Object.freeze(rows.map(row=>row.join('')));
 }
 const icons=Object.freeze({
 training:glyph(({set,rect})=>{
  rect(5,0,6,1,'k');rect(7,1,2,3,'k');
  rect(5,4,6,1,'k');rect(4,5,8,8,'k');
  rect(5,5,6,8,'r');rect(10,6,1,6,'R');
  rect(5,6,1,4,'w');rect(5,13,6,1,'k');
  rect(6,14,4,1,'k');set(7,3,'c');set(8,3,'c');
 }),
 battle:glyph(({set,rect})=>{
  rect(1,2,14,2,'k');rect(2,3,12,1,'c');
  rect(1,4,2,10,'k');rect(13,4,2,10,'k');
  rect(2,4,1,9,'C');rect(13,4,1,9,'C');
  rect(0,14,4,1,'k');rect(12,14,4,1,'k');
  for(let y=5;y<15;y++)for(let x=3;x<13;x++){
   const distance=Math.hypot(x-7.5,y-9.5);
   if(distance<=4.5)set(x,y,distance>=3.4?'k':y<9?'r':'w');
  }
  rect(4,9,8,1,'k');rect(6,8,4,3,'k');rect(7,9,2,1,'w');
 }),
 expedition:glyph(({rect,set})=>{
  rect(5,1,6,3,'k');rect(6,2,4,1,'c');
  rect(4,3,8,1,'k');rect(3,4,10,10,'k');
  rect(4,4,8,9,'g');rect(11,5,1,8,'G');
  rect(2,6,1,6,'k');rect(13,6,1,6,'k');
  rect(5,8,6,5,'k');rect(6,9,4,3,'c');
  rect(4,14,8,1,'k');set(5,5,'w');set(6,5,'w');
 }),
 shield:glyph(({set})=>{
  for(let y=2;y<=13;y++){
   const half=y<8?5:Math.max(1,13-y);
   const left=Math.ceil(7.5-half),right=Math.floor(7.5+half);
   for(let x=left;x<=right;x++)
    set(x,y,y===2||x===left||x===right||y===13?'B':'b');
  }
  set(6,4,'w');set(6,5,'w');set(6,6,'w');set(7,3,'B');set(8,3,'B');
 })


});

 const groups={
  root:['games','training','battle','expedition'],
  training:['strength','defence','speed'],
  battle:['wild','trainer','arena']
 };
 function create({
  clock=()=>performance.now(),canOpen=()=>false,enabled=()=>true,
  label=id=>id,invoke=()=>false,onOpen=()=>{},paint=()=>{}
 }={}){
  let mode='closed',until=0,busy=false,notice='',epoch=0;
  function close(force=false){
   if(busy&&!force)return false;
   mode='closed';until=0;notice='';epoch++;return true;
  }
  function alive(now=clock()){
   if(mode==='closed')return false;
   if(!busy&&(now>=until||!canOpen())){close(true);return false;}
   return true;
  }
  function targets(){
   if(!alive())return [];
   const ids=groups[mode],width=264/ids.length;
   return ids.map((id,index)=>({
    id,label:label(id),enabled:!!enabled(id),
    x:101+index*width,y:288,w:width,h:64
   }));
  }
  function open(now=clock()){
   if(busy||!canOpen())return false;
   epoch++;mode='root';until=now+6000;notice='';onOpen();return true;
  }
  async function choose(id,now=clock()){
   if(!alive(now)||busy)return false;
   const item=targets().find(item=>item.id===id);
   if(!item)return false;
   until=now+6000;
   if(!item.enabled){notice=label('failed');return false;}

   const ticket=epoch;
   busy=true;
   try{
    const result=await invoke(id);
    if(ticket!==epoch)return false;
    if(result===true){close(true);return true;}
    notice=label('failed');return false;
   }catch(_){
    if(ticket===epoch)notice=label('failed');
    return false;
   }finally{busy=false;}
  }
  function tap(x,y,now=clock()){
   if(!alive(now))return false;
   if(busy)return true;
   const item=targets().find(item=>
    x>=item.x&&x<item.x+item.w&&y>=item.y&&y<=item.y+item.h
   );
   if(!item){close();return true;}
   void choose(item.id,now);return true;
  }
  return Object.freeze({
   open,close,tap,choose,
   draw(){if(alive())paint({mode,busy,notice,items:targets()});},
   inContext(value){return alive()&&mode===value;},
   get active(){return alive();},
   get busy(){return busy;},
   get mode(){alive();return mode;},
   get targets(){return targets();},
   get notice(){return notice;},
   get icons(){return icons;}
  });
 }
 return Object.freeze({create,icons});
});
