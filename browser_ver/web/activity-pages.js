
/* UI01 activity selection. Existing controllers retain gameplay authority. */
(function(root){
 'use strict';
 const words={
  en:{training:'Training',battle:'Battle',strength:'Strength',defence:'Defence',
   speed:'Speed',attack:'Attack',defenceValue:'Defence',speedValue:'Speed',
   duration:'10 seconds',instruction:'Tap the play area during training.',
   startTraining:'Start training',failed:'Currently unavailable.',
   wild:'Wild battle',trainer:'Trainer',arena:'Arena',startBattle:'Start battle',
   openSelection:'Open selection',team:'Team',current:'Current Pokémon',
   wildInfo:'Battle with your selected team.',
   trainerInfo:'Choose an existing trainer duel.',
   arenaInfo:'Choose the region and arena.'},
  de:{training:'Training',battle:'Kampf',strength:'Stärke',defence:'Verteidigung',
   speed:'Tempo',attack:'Angriff',defenceValue:'Verteidigung',speedValue:'Tempo',
   duration:'10 Sekunden',instruction:'Tippe während des Trainings auf die Spielfläche.',
   startTraining:'Training starten',failed:'Gerade nicht verfügbar.',
   wild:'Wildkampf',trainer:'Trainer',arena:'Arena',startBattle:'Kampf starten',
   openSelection:'Auswahl öffnen',team:'Team',current:'Aktuelles Pokémon',
   wildInfo:'Kampf mit deinem ausgewählten Team.',
   trainerInfo:'Vorhandenes Trainerduell auswählen.',
   arenaInfo:'Region und Arena auswählen.'},
  es:{training:'Entrenamiento',battle:'Combate',strength:'Fuerza',defence:'Defensa',
   speed:'Velocidad',attack:'Ataque',defenceValue:'Defensa',speedValue:'Velocidad',
   duration:'10 segundos',instruction:'Toca la zona de juego durante el entrenamiento.',
   startTraining:'Entrenar',failed:'No disponible ahora.',
   wild:'Salvaje',trainer:'Entrenador',arena:'Gimnasio',startBattle:'Combatir',
   openSelection:'Abrir selección',team:'Equipo',current:'Pokémon actual',
   wildInfo:'Combate con tu equipo seleccionado.',
   trainerInfo:'Elige un duelo de entrenador.',
   arenaInfo:'Elige región y gimnasio.'},
  fr:{training:'Entraînement',battle:'Combat',strength:'Force',defence:'Défense',
   speed:'Vitesse',attack:'Attaque',defenceValue:'Défense',speedValue:'Vitesse',
   duration:'10 secondes',instruction:'Touchez la zone de jeu pendant l’entraînement.',
   startTraining:'Commencer',failed:'Indisponible actuellement.',
   wild:'Sauvage',trainer:'Dresseur',arena:'Arène',startBattle:'Combattre',
   openSelection:'Ouvrir la sélection',team:'Équipe',current:'Pokémon actuel',
   wildInfo:'Combat avec votre équipe sélectionnée.',
   trainerInfo:'Choisissez un duel de dresseur.',
   arenaInfo:'Choisissez la région et l’arène.'}
 };

 const sceneWords={
  en:{strengthScene:'Build strength',defenceScene:'Hold your ground',
   speedScene:'Pick up speed',preview:'Training preview'},
  de:{strengthScene:'Kraft aufbauen',defenceScene:'Standhalten',
   speedScene:'Tempo steigern',preview:'Trainingsvorschau'},
  es:{strengthScene:'Ganar fuerza',defenceScene:'Resistir',
   speedScene:'Ganar velocidad',preview:'Vista previa'},
  fr:{strengthScene:'Gagner en force',defenceScene:'Tenir bon',
   speedScene:'Prendre de la vitesse',preview:'Aperçu'}
 };
 for(const code of ['en','de','es','fr'])Object.assign(words[code],sceneWords[code]);


 const battleWords={
  en:{battlePreview:'Battle preview',lead:'Starts with',
   ownCare:'Your current Pokémon',wildScene:'Into the wild',
   trainerScene:'Ready for a duel',arenaScene:'Challenge the arena'},
  de:{battlePreview:'Kampfvorschau',lead:'Startmitglied',
   ownCare:'Dein aktuelles Pokémon',wildScene:'Auf in die Wildnis',
   trainerScene:'Bereit fürs Duell',arenaScene:'Die Arena herausfordern'},
  es:{battlePreview:'Vista previa del combate',lead:'Miembro inicial',
   ownCare:'Tu Pokémon actual',wildScene:'A la naturaleza',
   trainerScene:'Listo para un duelo',arenaScene:'Desafía al gimnasio'},
  fr:{battlePreview:'Aperçu du combat',lead:'Premier membre',
   ownCare:'Votre Pokémon actuel',wildScene:'Dans la nature',
   trainerScene:'Prêt pour un duel',arenaScene:'Défier l’arène'}
 };
 for(const code of ['en','de','es','fr'])Object.assign(words[code],battleWords[code]);


 const fourWords={
  de:{trainer:'Trainerkampf',arena:'Arenakampf',league:'Ligakampf',
   leagueInfo:'Region auswählen. Ein gespeicherter Lauf behält seinen Kader.',
   planning:'Aktuelle Teamplanung',chooseBattle:'Kampfart wählen'},
  en:{trainer:'Trainer battle',arena:'Gym battle',league:'League battle',
   leagueInfo:'Choose a region. A saved run keeps its roster.',
   planning:'Current team plan',chooseBattle:'Choose battle type'},
  es:{trainer:'Entrenador',arena:'Gimnasio',league:'Liga',
   leagueInfo:'Elige región. La partida guardada conserva su equipo.',
   planning:'Equipo planificado',chooseBattle:'Elige combate'},
  fr:{trainer:'Dresseur',arena:'Arène',league:'Ligue',
   leagueInfo:'Choisissez la région. Le parcours sauvegardé garde son équipe.',
   planning:'Équipe prévue',chooseBattle:'Choisissez le combat'}
 };
 for(const code of ['en','de','es','fr'])
  Object.assign(words[code],fourWords[code]);


 const regionWords={
  de:{regionSelect:'Region auswählen'},
  en:{regionSelect:'Choose region'},
  es:{regionSelect:'Elegir región'},
  fr:{regionSelect:'Choisir la région'}
 };
 for(const code of ['en','de','es','fr'])
  Object.assign(words[code],regionWords[code]);

 if(root.TPText?.registerLocale)
  for(const code of ['en','de','es','fr'])
   root.TPText.registerLocale(code,Object.fromEntries(
    Object.entries(words[code]).map(([key,value])=>['activityPage.'+key,value])
   ));
 const t=key=>root.TPText?.t?
  root.TPText.t('activityPage.'+key):words.de[key];
 const backText=()=>root.TPText?.t?root.TPText.t('common.back'):'Zurück';
 const training=[
  {id:'strength',kind:0,label:'strength',value:'attack',read:'atkStat'},
  {id:'defence',kind:1,label:'defence',value:'defenceValue',read:'defStat'},
  {id:'speed',kind:2,label:'speed',value:'speedValue',read:'speStat'}
 ];
 const battle=[
  {id:'wild',label:'wild'},
  {id:'trainer',label:'trainer'},
  {id:'arena',label:'arena'},
  {id:'league',label:'league'}
 ];
 let view=null,layer=null,busy=false,last='',message='';
 let previewCanvas=null,previewAt=-Infinity,previewBuffer=null;
 const previewBounds=new WeakMap();
 let trainerPortrait=null,trainerPortraitBusy=false,trainerPortraitAt=-Infinity;
 function node(tag,text,cls){
  const element=document.createElement(tag);
  if(text!==undefined)element.textContent=text;
  if(cls)element.className=cls;
  return element;
 }
 function active(){return !!view&&screen==='activity';}
 function inContext(page){return active()&&view.page===page;}
 function canOpen(page){
  try{
   return ['training','battle'].includes(page)&&!busy&&!!Module&&
    screen==='idle'&&document.visibilityState==='visible'&&choice==='none'&&
    !fns.awaitingStarter()&&!fns.isEgg()&&!fns.sleeping()&&
    !fns.ceremony()&&!fns.evolvingNow()&&!fns.wildPromptActive()&&
    !tpSaveReplacing&&!root.TPAppMenu?.active&&!root.TPBoxes?.active&&
    !root.TPCollection?.busy&&!root.TPCollection?.blocked&&
    !root.TPCollectionGame?.dialogOpen&&!root.TPAdmissionUI?.active&&
    !root.TPAdmissionUI?.busy&&!root.TPTraining?.busy&&!root.TPMega?.busy&&
    !root.TPArena?.busy&&!root.TPLeague?.busy&&!root.TPExpeditions?.busy;
  }catch(_){return false;}
 }
 function button(label,fn,disabled=false){
  const element=node('button',label);
  element.type='button';element.disabled=disabled;
  element.addEventListener('click',()=>{
   if(!active()||busy||element.disabled||element.isConnected===false)return;
   fn();
  });
  return element;
 }
 function close(){
  if(busy||!active())return false;
  view=null;message='';last='';layer.hidden=true;
  dragStart=dragNow=null;screen='idle';canvas.focus?.();return true;
 }

 function goBack(){
 if(!active()||busy)return false;
 return close();
}

 function ensureLayer(){
  if(layer)return;
  layer=node('section',undefined,'tp-activity-page');
  layer.id='tp-activity-page';layer.hidden=true;
  layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');
  document.getElementById('tp-game-shell').appendChild(layer);
  layer.addEventListener('keydown',event=>{
   if(!active())return;
   if(event.key==='Escape'){
    event.preventDefault();event.stopPropagation();
    if(!busy)goBack();return;
   }
   if(event.key!=='Tab')return;
   const buttons=Array.from(layer.querySelectorAll('button'))
    .filter(element=>!element.disabled&&
     (typeof element.getClientRects!=='function'||element.getClientRects().length));
   const first=buttons[0],last=buttons[buttons.length-1];
   if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();last?.focus();
   }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();first?.focus();
   }
  });
 }
 function imageBounds(image){
 if(previewBounds.has(image))return previewBounds.get(image);
 const width=image.width,height=image.height;
 let left=width,top=height,right=-1,bottom=-1;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)
  if(image.data[(y*width+x)*4+3]){
   left=Math.min(left,x);right=Math.max(right,x);
   top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
 const result=right>=left?{x:left,y:top,w:right-left+1,h:bottom-top+1}:null;
 previewBounds.set(image,result);return result;
}
function paintPreview(force=false){
 if(active()&&view.page==='battle'){paintBattlePreview(force);return;}
 if(!previewCanvas||!active()||view.page!=='training')return;
 const now=performance.now();
 if(!force&&now-previewAt<140)return;
 previewAt=now;
 const paint=previewCanvas.getContext('2d');
 if(!paint)return;
 const width=previewCanvas.width,height=previewCanvas.height;
 paint.clearRect(0,0,width,height);paint.imageSmoothingEnabled=false;
 paint.fillStyle='#f6f9fa';paint.fillRect(0,0,width,height);
 paint.fillStyle='#dce6df';paint.fillRect(12,87,width-24,2);
 const maps=root.TPActions?.icons;
 const defending=view.selected==='defence';
 const running=view.selected==='speed';
 if(defending&&maps?.shield)
  drawIconOn(paint,maps.shield,25,7,5);
 if(running){
  const palette=iconPalette();
  paint.fillStyle=palette.C;
  paint.fillRect(23,42,25,3);paint.fillRect(12,55,29,3);
  paint.fillRect(28,68,17,3);
  paint.fillStyle=palette.S;
  paint.fillRect(24,88,18,2);paint.fillRect(70,88,18,2);
  paint.fillRect(116,88,18,2);paint.fillRect(162,88,18,2);
 }
 let drawn=false;
 try{
  if(typeof currentSprite!=='undefined'&&currentSprite&&
     typeof frameImageData==='function'&&typeof TPAct!=='undefined'){
   const act=running&&currentSprite.actions[TPAct.walkR]?TPAct.walkR:TPAct.idle;
   const action=currentSprite.actions[act];
   if(action){
    const frame=frameIndexAt(action,now,true);
    const image=frameImageData(currentSprite,act,frame);
    if(image?.data&&image.width&&image.height){
     const bounds=imageBounds(image);
     if(bounds){
      if(!previewBuffer)previewBuffer=document.createElement('canvas');
      if(previewBuffer.width!==image.width)previewBuffer.width=image.width;
      if(previewBuffer.height!==image.height)previewBuffer.height=image.height;
      previewBuffer.getContext('2d').putImageData(image,0,0);
      const scale=Math.min(3,94/bounds.w,(defending?64:76)/bounds.h);
      const center=running?116:68;
      paint.drawImage(previewBuffer,bounds.x,bounds.y,bounds.w,bounds.h,
       center-bounds.w*scale/2,86-bounds.h*scale,bounds.w*scale,bounds.h*scale);
      drawn=true;
     }
    }
   }
  }
 }catch(_){}
 if(!drawn){
  paint.fillStyle='#526574';paint.textAlign='center';paint.textBaseline='alphabetic';
  paint.font='bold 28px monospace';paint.fillText('?',running?116:68,65);
 }
 if(view.selected==='strength'&&maps?.training){
  drawIconOn(paint,maps.training,162,31,3);
  const palette=iconPalette();paint.fillStyle=palette.r;
  paint.fillRect(143,47,4,4);paint.fillRect(148,39,3,3);
 }else if(defending){
  const palette=iconPalette();paint.fillStyle=palette.B;
  for(const [x,y]of [[150,27],[166,45],[146,66]]){
   paint.fillRect(x,y,5,5);paint.fillRect(x+7,y+1,8,3);
  }
 }
}

function battlePreviewInfo(){
 let state=null;
 try{state=root.TPCollection?.read();}catch(_){}
 if(!state)return {member:null,active:null,count:0,name:''};
 const trainer=view.selected==='trainer';
 const ids=trainer?
  (state.active===null?[]:[state.active]):
  state.team.length?state.team.slice():
  state.active===null?[]:[state.active];
 const member=state.mons.find(mon=>mon.id===ids[0])||null;
 const name=member?
  member.id===state.active?fns.name():
  member.nickname||fns.dexName(member.dex):'';
 return {member,active:state.active,count:ids.length,name};
}
function trainerPreviewImage(){
 const now=Date.now();
 if(!trainerPortrait&&!trainerPortraitBusy&&now-trainerPortraitAt>=4000){
  trainerPortraitAt=now;
  if(typeof root.TPTrainerArt?.picture==='function'){
   trainerPortraitBusy=true;
   root.TPTrainerArt.picture('kanto-youngster')
    .then(result=>{if(result?.image)trainerPortrait=result.image;})
    .catch(error=>{
     try{root.TPDiagnostics?.record('manager',error);}catch(_){}
    })
    .finally(()=>{trainerPortraitBusy=false;});
  }
 }
 return trainerPortrait;
}


function paintBattleDestination(paint,kind,now){
 if(kind!=='arena'&&kind!=='league')return false;
 const p=iconPalette(),ink=p.k||'#292831',white=p.w||'#f6f9fa';
 const blink=Math.floor(now/560)%2===0;
 const rect=(color,x,y,w,h)=>{
  paint.fillStyle=color;paint.fillRect(x,y,w,h);
 };
 paint.save();
 if(kind==='arena'){
  rect('#cbd5d1',140,84,74,4);
  rect(ink,145,38,66,46);
  rect('#c2d0d6',148,41,60,40);
  rect(ink,141,30,74,12);
  rect(p.R||'#9f303c',144,33,68,6);
  rect(ink,149,24,58,8);
  rect(p.r||'#d45862',152,27,52,3);
  rect(ink,158,47,12,12);
  rect('#79c5dc',161,50,6,6);
  rect(ink,187,47,12,12);
  rect('#79c5dc',190,50,6,6);
  rect(ink,170,62,17,22);
  rect('#526574',173,65,11,19);
  rect(blink?'#a6d8e7':'#79c5dc',176,66,5,11);
  rect(ink,170,30,17,14);
  rect(p.r||'#d45862',173,33,11,4);
  rect(white,173,37,11,4);
  rect(ink,173,36,11,2);
  rect(ink,177,35,3,4);
  rect(white,178,36,1,2);
  rect('#94a5ad',151,76,12,5);
  rect('#94a5ad',195,76,10,5);
 }else{
  rect('#cbd5d1',141,84,73,4);
  for(let i=0;i<4;i++){
   const x=146+i*17;
   rect(ink,x,27,10,9);
   rect('#c4d6e1',x+2,29,6,5);
   rect(blink&&i%2===0?'#fff0a0':'#d7b768',x+3,30,4,3);
  }
  rect(ink,156,43,10,17);
  rect('#d7b768',159,46,4,10);
  rect(ink,192,43,10,17);
  rect('#d7b768',195,46,4,10);
  rect(ink,164,39,30,22);
  rect('#d7b768',167,42,24,16);
  rect('#f6dda0',168,43,5,12);
  rect('#b49959',185,43,5,12);
  rect(ink,170,59,18,6);
  rect('#d7b768',173,59,12,3);
  rect(ink,175,64,8,12);
  rect('#d7b768',177,65,4,9);
  rect(ink,161,76,36,8);
  rect('#b49959',164,78,30,4);
  rect(blink?'#fff7ce':'#f6dda0',175,46,6,6);
 }
 paint.restore();return true;
}

function paintBattlePreview(force=false){
 if(!previewCanvas||!active()||view.page!=='battle')return;
 const now=performance.now();
 if(!force&&now-previewAt<140)return;
 previewAt=now;
 const paint=previewCanvas.getContext('2d');
 if(!paint)return;
 paint.clearRect(0,0,previewCanvas.width,previewCanvas.height);
 paint.imageSmoothingEnabled=false;
 paint.fillStyle='#f6f9fa';
 paint.fillRect(0,0,previewCanvas.width,previewCanvas.height);
 paint.fillStyle='#dce6df';paint.fillRect(12,87,200,2);
 const info=battlePreviewInfo(),member=info.member;
 let drawn=false;
 try{
  let sprite=null;
  if(member){
   if(member.id===info.active&&typeof currentSprite!=='undefined')
    sprite=currentSprite;
   else if(typeof spriteFor==='function')
    sprite=spriteFor(member.dex,member.shiny);
  }
  if(sprite&&typeof TPAct!=='undefined'){
   const action=sprite.actions[TPAct.idle];
   if(action){
    const image=frameImageData(sprite,TPAct.idle,frameIndexAt(action,now,true));
    if(image?.data&&image.width&&image.height){
     const bounds=imageBounds(image);
     if(bounds){
      if(!previewBuffer)previewBuffer=document.createElement('canvas');
      if(previewBuffer.width!==image.width)previewBuffer.width=image.width;
      if(previewBuffer.height!==image.height)previewBuffer.height=image.height;
      previewBuffer.getContext('2d').putImageData(image,0,0);
      const scale=Math.min(3,94/bounds.w,76/bounds.h);
      paint.drawImage(previewBuffer,bounds.x,bounds.y,bounds.w,bounds.h,
       (66)-bounds.w*scale/2,
       86-bounds.h*scale,bounds.w*scale,bounds.h*scale);
      drawn=true;
     }
    }
   }
  }
 }catch(_){}
 if(!drawn){
  paint.fillStyle='#526574';paint.textAlign='center';
  paint.font='bold 28px monospace';
  paint.fillText('?',66,65);
 }
 const maps=root.TPActions?.icons,palette=iconPalette();
 if(view.selected==='wild'){
  for(let i=0;i<5;i++){
   const x=147+i*12,y=52+(i%2)*8;
   paint.fillStyle=palette.G;paint.fillRect(x,y,4,34-(i%2)*8);
   paint.fillStyle=palette.g;paint.fillRect(x+4,y+8,6,26-(i%2)*8);
   paint.fillRect(x-4,y+16,4,18-(i%2)*8);
  }
 }else if(view.selected==='trainer'){
  const portrait=trainerPreviewImage();
  if(portrait){
   const scale=Math.min(1.5,76/portrait.width,76/portrait.height);
   const width=portrait.width*scale,height=portrait.height*scale;
   paint.drawImage(portrait,170-width/2,86-height,width,height);
  }else{
   paint.fillStyle='#526574';paint.textAlign='center';
   paint.font='bold 22px monospace';paint.fillText('?',170,65);
  }
 }
 paintBattleDestination(paint,view.selected,now);
 const count=Math.max(0,Math.min(6,info.count));
 const start=112-(count*16+Math.max(0,count-1)*4)/2;
 for(let i=0;i<count;i++)drawIconOn(paint,TPIcon.play,start+i*20,94,1);
}

function details(){
  const items=view.page==='training'?training:battle;
  const selected=items.find(item=>item.id===view.selected)||items[0];
  let available=false,value='—',metric='',description='',action='';
  if(view.page==='training'){
   available=!!root.TPTraining?.canStart('activity');
   const raw=fns[selected.read]();
   value=Number.isFinite(raw)?String(raw):'—';
   metric=t(selected.value);description=t('instruction');action=t('startTraining');
  }else{
   if(selected.id==='wild')
    available=!!root.TPWildTeam&&!!fns.battleCanStart();
   else if(selected.id==='trainer')
    available=!!root.TPTrainer?.canOpen('activity');
   else if(selected.id==='league')
    available=!!root.TPLeague?.canOpen(view.region,'activity');
   else available=!!root.TPArena?.canOpen('activity');
   if(selected.id==='trainer'){
    metric=t('current');value=fns.name();
   }else{
    const state=root.TPCollection?.read();
    metric=t('team');
    value=state?String(state.team.length||Number(state.active!==null))+' / 6':'—';
   }
   description=t(selected.id+'Info');
   action=t(selected.id==='wild'?'startBattle':'openSelection');
  }
  return {items,selected,available,value,metric,description,action};
 }
 async function launch(){
  if(busy||!active())return;
  const data=details();
  if(!data.available)return;
  busy=true;message='';render(true);
  let result=false;
  try{
   if(view.page==='training')
    result=root.TPTraining.start(data.selected.kind,performance.now(),'activity');
   else if(data.selected.id==='wild')
    result=await root.TPWildTeam.start(false,'activity');
   else if(data.selected.id==='trainer')
    result=root.TPTrainer.open('activity');
   else if(data.selected.id==='league')
    result=root.TPLeague.open(view.region,'activity');
   else result=root.TPArena.open('activity');
   if(result===true){
    layer.hidden=true;last='';canvas.focus?.();
   }else{
    message=view.page==='battle'&&data.selected.id==='wild'?
     root.TPWildTeam?.notice||t('failed'):t('failed');
   }
  }catch(_){message=t('failed');}
  finally{
   busy=false;
   if(active())render(true);
  }
 }


function battleRegionIcon(){
 const image=node('canvas',undefined,'tp-battle-region-icon');
 image.width=24;image.height=24;image.setAttribute('aria-hidden','true');
 const paint=image.getContext('2d');
 if(paint){
  paint.strokeStyle='#315b83';paint.lineWidth=2;
  paint.beginPath();paint.arc(12,12,8,0,Math.PI*2);paint.stroke();
  paint.beginPath();paint.ellipse(12,12,4,8,0,0,Math.PI*2);paint.stroke();
  paint.beginPath();paint.moveTo(4,12);paint.lineTo(20,12);paint.stroke();
 }
 return image;
}

function renderBattlePage(force=false){
 const combat=battlePreviewInfo(),data=details();
 const key=JSON.stringify(['battle-stack',view.selected,view.region,!!view.regionChoosing,busy,message,
  data.available,combat.member?.id,combat.member?.dex,combat.member?.shiny,
  combat.name,combat.count,t('wild'),t('league'),data.action,
  !!root.TPRegions?.available(1)]);
 layer.hidden=false;
 if(!force&&key===last)return;
 last=key;layer.replaceChildren();previewCanvas=null;
 layer.setAttribute('data-activity-page','battle');
 layer.setAttribute('data-battle-view',view.selected);
 layer.setAttribute('aria-label',t('battle'));

 const host=document.getElementById('tp-game-shell');
 if(typeof root.hubDexDesignTokens==='function')
  for(const [name,value]of Object.entries(root.hubDexDesignTokens()))
   host.style.setProperty(name,value);

 const head=node('header',undefined,'tp-activity-head');
 const title=node('h2',t('battle'));title.id='tp-activity-title';
 layer.setAttribute('aria-labelledby',title.id);
 head.append(title,button(backText(),goBack,busy));

 const regionActions=node('div',undefined,'tp-battle-region-actions');
 if(view.selected==='arena'||view.selected==='league'){
  const regionButton=button('',()=>{
   view.regionChoosing=!view.regionChoosing;render(true);
  },busy||!!root.TPRegions?.locked());
  regionButton.append(battleRegionIcon());
  regionButton.setAttribute('data-battle-region-toggle','');
  regionButton.setAttribute('aria-label',t('regionSelect')+' · '+
   (view.region===1?'Johto':'Kanto'));
  regionButton.setAttribute('title',t('regionSelect')+' · '+
   (view.region===1?'Johto':'Kanto'));
  regionButton.setAttribute('aria-expanded',String(!!view.regionChoosing));
  regionActions.append(regionButton);
 }
 const frame=node('div',undefined,'tp-activity-frame');
 frame.setAttribute('aria-hidden','true');
 for(const cls of ['tp-pokedex-display tp-pokedex-display-left',
  'tp-pokedex-display tp-pokedex-display-right','tp-pokedex-spine'])
  frame.append(node('span',undefined,cls));

 const body=node('div',undefined,'tp-activity-body');
 const left=node('div',undefined,'tp-activity-column tp-activity-left');
 const right=node('div',undefined,'tp-activity-column tp-activity-right');

 const choices=node('div',undefined,'tp-activity-choices tp-battle-stack');
 choices.setAttribute('aria-label',t('chooseBattle'));

 if(view.regionChoosing){
  choices.style.gridTemplateRows='repeat(2,minmax(44px,1fr))';
  for(const region of [0,1]){
   const enabled=region===0||!!root.TPRegions?.available(region);
   const pick=button(region===0?'Kanto':'Johto',()=>{
    if(root.TPRegions?.remember(region)){
     view.region=region;view.regionChoosing=false;message='';
    }else message=t('failed');
    render(true);
   },busy||!enabled||!!root.TPRegions?.locked());
   pick.setAttribute('data-battle-region',String(region));
   pick.setAttribute('aria-pressed',String(view.region===region));
   choices.append(pick);
  }
 }else for(const item of battle){
  const pick=button(t(item.label),()=>{
   view.selected=item.id;message='';render(true);
  },busy);
  pick.setAttribute('data-activity-choice',item.id);
  pick.setAttribute('aria-pressed',String(item.id===view.selected));
  choices.append(pick);
 }
 left.append(choices);

 const card=node('article',undefined,'tp-activity-card');
 const info=node('div',undefined,'tp-activity-info');
 info.tabIndex=0;
 info.append(node('h3',t(data.selected.label)));

 previewCanvas=node('canvas',undefined,'tp-battle-scene');
 previewCanvas.width=224;previewCanvas.height=112;
 previewCanvas.setAttribute('role','img');
 previewCanvas.setAttribute('data-preview-mon-id',String(combat.member?.id??''));
 previewCanvas.setAttribute('data-preview-scene',view.selected);
 previewCanvas.setAttribute('aria-label',
  t('battlePreview')+' · '+t(data.selected.label)+' · '+combat.name);
 info.append(previewCanvas,
  node('p',data.description,'tp-battle-caption'),
  node('p',combat.name||'—','tp-battle-member'));



 const start=button(data.action,launch,busy||!data.available);
 start.setAttribute('data-activity-start',data.selected.id);
 card.append(info,start);
 right.append(card);
 body.append(left,right);

 const status=node('p',message,'tp-activity-status');
 status.setAttribute('role','status');
 layer.append(head,frame,regionActions,body,status);
 statusEl.textContent=t('battle')+' · '+t(data.selected.label);
 paintPreview(true);
}

 function render(force=false){
  if(!active())return;
  if(view.page==='battle'){renderBattlePage(force);return;}
  const data=details();
  const combat=view.page==='battle'?battlePreviewInfo():null;
  const notice=message||(view.page==='training'?root.TPTraining?.notice||'':'');
  const key=JSON.stringify([
   view.page,view.selected,data.available,data.value,data.metric,busy,notice,
   combat?.member?.id,combat?.member?.dex,combat?.member?.shiny,combat?.name,combat?.count,
   t(view.page),data.action,data.description
  ]);
  layer.hidden=false;
  if(!force&&key===last)return;
  last=key;layer.replaceChildren();
  layer.setAttribute('data-activity-page',view.page);
  layer.setAttribute('aria-label',t(view.page));
  const host=document.getElementById('tp-game-shell');
  if(typeof root.hubDexDesignTokens==='function')
   for(const [key,value]of Object.entries(root.hubDexDesignTokens()))
    host.style.setProperty(key,value);
  const head=node('header',undefined,'tp-activity-head');
  const title=node('h2',t(view.page));title.id='tp-activity-title';
  layer.setAttribute('aria-labelledby',title.id);
  head.append(title,button(backText(),close,busy));
  const frame=node('div',undefined,'tp-activity-frame');
  frame.setAttribute('aria-hidden','true');
  for(const cls of [
   'tp-pokedex-display tp-pokedex-display-left',
   'tp-pokedex-display tp-pokedex-display-right','tp-pokedex-spine'
  ])frame.append(node('span',undefined,cls));
  const body=node('div',undefined,'tp-activity-body');
  const left=node('div',undefined,'tp-activity-column tp-activity-left');
  const right=node('div',undefined,'tp-activity-column tp-activity-right');
  const choices=node('div',undefined,'tp-activity-choices');
  for(const item of data.items){
   const choice=button(t(item.label),()=>{
    view.selected=item.id;message='';render(true);
   },busy);
   choice.setAttribute('data-activity-choice',item.id);
   choice.setAttribute('aria-pressed',String(item.id===data.selected.id));
   choices.append(choice);
  }
  left.append(choices);
  const card=node('article',undefined,'tp-activity-card');
  const info=node('div',undefined,'tp-activity-info');
  info.tabIndex=0;

previewCanvas=null;
  if(view.page==='training'){
   previewCanvas=node('canvas',undefined,'tp-training-scene');
   previewCanvas.width=224;previewCanvas.height=96;
   previewCanvas.setAttribute('role','img');
   previewCanvas.setAttribute('aria-label',
    fns.name()+' · '+t('preview')+' · '+t(data.selected.label));
   const tags=node('div',undefined,'tp-training-tags');
   const stat=node('span',data.metric+' '+data.value);
   const duration=node('span','10 s');
   duration.setAttribute('title',t('duration'));
   tags.append(stat,duration);
   info.append(node('h3',t(data.selected.label)),previewCanvas,
    node('p',t(data.selected.id+'Scene'),'tp-training-caption'),tags);
  }else{
   previewCanvas=node('canvas',undefined,'tp-battle-scene');
   previewCanvas.width=224;previewCanvas.height=112;
   previewCanvas.setAttribute('role','img');
   previewCanvas.setAttribute('data-preview-mon-id',String(combat.member?.id??''));
   previewCanvas.setAttribute('aria-label',
    t('battlePreview')+' · '+t(data.selected.label)+' · '+combat.name);
   const tags=node('div',undefined,'tp-battle-tags');
   tags.append(node('span',view.selected==='trainer'?
    t('ownCare'):t('team')+' '+combat.count+' / 6'));
   const memberName=node('p',combat.name||'—','tp-battle-member');
   memberName.setAttribute('title',t('lead')+': '+(combat.name||'—'));
   info.append(node('h3',t(data.selected.label)),previewCanvas,memberName,
    node('p',t(data.selected.id+'Scene'),'tp-battle-caption'),tags);
  }
  const start=button(data.action,launch,busy||!data.available);
  start.setAttribute('data-activity-start',data.selected.id);
  card.append(info,start);right.append(card);
  body.append(left,right);
  const status=node('p',notice,'tp-activity-status');
  status.setAttribute('role','status');
  layer.append(head,frame,body,status);
  statusEl.textContent=t(view.page)+' · '+t(data.selected.label);
  paintPreview(true);
 }
 function open(page){
  if(!canOpen(page))return false;
  ensureLayer();view={page,selected:page==='training'?'strength':'wild',
   region:root.TPRegions?.selected===1?1:0};
  message='';last='';dragStart=dragNow=null;screen='activity';
  render(true);layer.querySelectorAll('button')[0]?.focus();return true;
 }
 function draw(){
 if(!view){if(screen==='activity')screen='idle';return;}
 if(active()){
  if(typeof ensureSprite==='function')
   ensureSprite(fns.speciesId());
  render();paintPreview();
 }else if(layer)layer.hidden=true;
}
 root.TPActivities=Object.freeze({
  open,close,draw,canOpen,inContext,
  get active(){return active();},
  get busy(){return busy;},
  get battleKind(){return view?.page==='battle'?view.selected:null;},
  get page(){return view?.page||null;}
 });
})(typeof globalThis!=='undefined'?globalThis:this);
