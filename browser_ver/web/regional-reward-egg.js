/* Regional shiny egg: reservation -> explicit next-life arming -> one birth.
 * No ending/release/newEgg operation is exposed by this screen.
 */
(function(){'use strict';let region=0;let active=false,busy=false,page=0,chosen=0,message='';let size=6;
const c=(n,...a)=>Module.ccall(n,'number',a.map(()=> 'number'),a);
const scoped=(mod,r,n,type,args=[])=>window.TPRegions?TPRegions.call(mod,r,n,type,args):r===0?mod.ccall(n,type,args.map(()=> 'number'),args):null;
const label=()=>region===1?'Johto':'Kanto';
function queueHint(v){if(v.queueConflict)return 'Mehrere Vormerkungen: erst bewusst zuruecknehmen.';if(v.queueSupported===0)return 'Andere Belohnungsdaten nicht lesbar; keine Vormerkung.';if(v.armedRegion>=0&&v.armedRegion!==region)return (v.armedRegion===1?'Johto':'Kanto')+'-Ei bereits vorgemerkt; erst dort zuruecknehmen.';return 'Dein normaler Eierplan bleibt fuer ein normales Ei erhalten.';}

function ready(){try{return !!Module&&typeof Module[region===1?'_tp_region_rg_view':'_tp_rg_view']==='function';}catch(_){return false;}}
function view(){return ready()?JSON.parse(scoped(Module,region,'tp_rg_view','string')):{supported:0,eligible:0,state:0,dex:0,candidates:[]};}
function open(wanted=window.TPHall?.region??0){if(!Number.isInteger(wanted)||wanted<0||wanted>1||wanted===1&&!window.TPRegions?.available(1)||active&&wanted!==region)return false;if(screen!=='league'||!window.TPHall?.active||window.TPHall?.busy||tpSaveReplacing||busy)return false;region=wanted;active=true;page=0;chosen=0;message='';confirmation=false;lastKey='';dragStart=dragNow=null;render(true);return true;}
function close(){if(busy||tpSaveReplacing)return;active=false;confirmation=false;message='';if(layer)layer.hidden=true;dragStart=dragNow=null;canvas.focus?.();}
async function transaction(operation,dex=0){if(busy||tpSaveReplacing)return false;const owner=region,mod=Module;const native=(n,...a)=>scoped(mod,owner,n,'number',a);busy=true;tpSaveReplacing=true;tpSaveEpoch++;let token=0,durable=false;
 try{token=native('tp_rg_prepare',operation,dex);if(!token)throw Error('Ehrenei-Aktion gerade nicht moeglich.');const bytes=exportStateBytes(mod);TPStoreTools.parseLegacy(bytes);if(await writeSave(bytes,true)!==true)throw Error('Speicherung nicht bestaetigt.');durable=true;if(native('tp_f4_store_finish',token,1)!==1)throw Error('Gespeichert. Bitte fuer lokalen Abschluss neu laden.');message=operation===0?'Auswahl dauerhaft reserviert.':operation===1?'Fuer das naechste regulaere Pflege-Ei vorgemerkt.':'Vormerkung aufgehoben; deine Auswahl bleibt reserviert.';return true;
 }catch(e){if(token&&!durable)native('tp_f4_store_finish',token,0);message=e.message||String(e);return false;}
 finally{tpSaveEpoch++;tpSaveReplacing=false;busy=false;}}

/* UI01 regional reward device */
let layer=null,upper=null,lower=null,confirmation=false,lastKey='';
let portraits=[],paintAt=-Infinity,buffer=null;
const boundsCache=new WeakMap();
const words={
 de:{
  title:'Shiny-Ehrenei',back:'Zur Ruhmeshalle',
  choose:'Wähle dein Ehrenei',empty:'Noch keine Art ausgewählt',
  open:'Soll das dein nächstes Ei werden?',reserved:'Reserviert',armed:'Vorgemerkt',used:'Eingelöst',
  reserve:'Auswahl reservieren',arm:'Für nächstes Pflege-Ei vormerken',
  disarm:'Vormerkung zurücknehmen',previous:'Vorherige Seite',next:'Nächste Seite',
  guarantee:'Garantiert schillernd · normale Gene',
  confirm:'Diese Art einmalig reservieren?',
  warning:'Die Artenwahl bleibt danach fest. Dein aktuelles Pflege-Pokémon bleibt unverändert.',
  yes:'Ja',no:'Nein',saving:'Speichern …',
  unsupported:'Ehrenei-Daten nicht unterstützt. Bitte den Spielkern prüfen.',
  noTitle:'Zuerst die Liga dieser Region samt Champ besiegen.',
  unavailable:'Auswahl bleibt verfügbar. Das Pflege-Pokémon ist gerade nicht bereit.',
  reservation:'Dein Ehrenei ist dauerhaft reserviert.',
  care:'Vormerken beendet keine Pflege und ersetzt kein Pokémon.',
  nextLife:'Für das nächste reguläre neue Pflege-Ei vorgemerkt.',
  stale:'Vormerkung bitte aufheben und erneut setzen.',
  redeemed:'Ehrenei wurde erzeugt. Der einmalige Anspruch ist eingelöst.',
  noSecond:'Weitere Titelgewinne erzeugen kein zweites Ehrenei.'
 },
 en:{
  title:'Shiny reward egg',back:'Back to Hall of Fame',
  choose:'Choose your reward egg',empty:'No species selected',
  open:'Should this be your next egg?',reserved:'Reserved',armed:'Queued',used:'Redeemed',
  reserve:'Reserve selection',arm:'Queue for next care egg',
  disarm:'Remove from queue',previous:'Previous page',next:'Next page',
  guarantee:'Guaranteed shiny · normal genes',
  confirm:'Reserve this species permanently?',
  warning:'The species choice is final. Your current care Pokémon remains unchanged.',
  yes:'Yes',no:'No',saving:'Saving …',
  unsupported:'Reward data unsupported. Please check the game core.',
  noTitle:'First defeat this region’s League and Champion.',
  unavailable:'Selection remains available. Your care Pokémon is not ready.',
  reservation:'Your reward egg is permanently reserved.',
  care:'Queuing does not end care or replace a Pokémon.',
  nextLife:'Queued for the next regular new care egg.',
  stale:'Please remove and renew this queue entry.',
  redeemed:'The reward egg was created. The one-time reward is redeemed.',
  noSecond:'Further titles do not create a second reward egg.'
 }
};
if(window.TPText?.registerLocale){
 for(const code of ['en','de']){
  TPText.registerLocale(code,Object.fromEntries(
   Object.entries(words[code]).map(([key,value])=>['rewardDevice.'+key,value])
  ));
 }
}
function t(key){
 return window.TPText?.t?
  TPText.t('rewardDevice.'+key):words.de[key];
}
function node(tag,text,cls){
 const element=document.createElement(tag);
 if(text!==undefined)element.textContent=text;
 if(cls)element.className=cls;
 return element;
}
function locked(){return busy||tpSaveReplacing;}
function button(label,key,action,disabled=false,icon=null){
 const element=node('button');
 element.type='button';
 element.disabled=!!disabled;
 element.dataset.rewardAction=key;
 element.setAttribute('aria-label',label);
 element.title=label;
 if(icon){
  const glyph=node('span',undefined,'tp-reward-icon');
  glyph.setAttribute('aria-hidden','true');
  if(icon==='back'&&window.TPNavBack){
   const image=node('canvas');
   image.width=image.height=24;
   TPNavBack.draw(image.getContext('2d'),0,0,24,'#315b83');
   glyph.append(image);
  }else{
   const paths={
    reserve:'<path d="m4 12 5 5L20 5"/>',
    arm:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    disarm:'<circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/>',
    previous:'<path d="m15 4-8 8 8 8"/>',
    next:'<path d="m9 4 8 8-8 8"/>',
    back:'<path d="M9 4 3 10l6 6M3 10h10a7 7 0 0 1 7 7"/>'
   };
   glyph.innerHTML='<svg viewBox="0 0 24 24" fill="none" '+
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" '+
    'stroke-linejoin="round">'+paths[icon]+'</svg>';
  }
  element.append(glyph);
 }else element.textContent=label;
 element.addEventListener('click',()=>{
  if(!active||locked()||element.disabled||!element.isConnected)return;
  const result=action();
  if(active)render(true);
  if(result&&typeof result.then==='function'){
   result.then(()=>{if(active)render(true);});
  }
 });
 return element;
}
function ensureLayer(){
 if(layer)return;
 const host=document.getElementById('tp-game-shell');
 if(!host)throw Error('Spielrahmen fehlt.');
 if(typeof hubDexDesignTokens==='function'){
  for(const [key,value]of Object.entries(hubDexDesignTokens())){
   host.style.setProperty(key,value);
  }
 }
 layer=node('section');
 layer.id='tp-reward-egg-page';
 layer.hidden=true;
 layer.setAttribute('role','dialog');
 layer.setAttribute('aria-modal','true');
 host.append(layer);
 layer.addEventListener('keydown',event=>{
  if(!active)return;
  if(event.key==='Escape'){
   event.preventDefault();event.stopPropagation();
   if(locked())return;
   if(confirmation){confirmation=false;render(true);}
   else close();
  }
  if(event.key==='Tab'){
   const controls=Array.from(layer.querySelectorAll('button:not(:disabled)'))
    .filter(element=>element.getClientRects().length);
   if(!controls.length){event.preventDefault();return;}
   const first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();last.focus();
   }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();first.focus();
   }
  }
 });
 new ResizeObserver(()=>{
  if(!active)return;
  if(layout())render(true);
 }).observe(layer);
}
function layout(){
 if(!upper||!lower)return false;
 for(const pane of [upper,lower]){
  const content=pane.firstElementChild;
  content.style.width=pane.clientHeight+'px';
  content.style.height=pane.clientWidth+'px';
 }
 const wanted=lower.clientHeight>=156?6:4;
 if(wanted===size)return false;
 const first=page*size;
 size=wanted;page=Math.floor(first/size);
 return true;
}
function picture(dex,cls){
 const holder=node('div',undefined,cls);
 const image=node('canvas');
 image.width=160;image.height=120;
 image.setAttribute('role','img');
 image.setAttribute('aria-label',dex?fns.dexName(dex):t('choose'));
 holder.append(image);
 portraits.push({canvas:image,dex});
 return holder;
}
function imageBounds(image){
 if(boundsCache.has(image))return boundsCache.get(image);
 let left=image.width,top=image.height,right=-1,bottom=-1;
 for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
  if(image.data[(y*image.width+x)*4+3]){
   left=Math.min(left,x);right=Math.max(right,x);
   top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
 }
 const result=right>=left?{x:left,y:top,w:right-left+1,h:bottom-top+1}:null;
 boundsCache.set(image,result);return result;
}
function paint(){
 const now=performance.now();
 if(now-paintAt<120)return;
 paintAt=now;
 for(const item of portraits){
  const target=item.canvas,c=target.getContext('2d');
  c.clearRect(0,0,target.width,target.height);
  c.imageSmoothingEnabled=false;
  let image=null;
  if(item.dex){
   const sprite=spriteFor(item.dex,true),action=sprite?.actions?.[TPAct.idle];
   if(action)image=frameImageData(
    sprite,TPAct.idle,frameIndexAt(action,now,true)
   );
  }
  const bounds=image?imageBounds(image):null;
  if(bounds){
   if(!buffer)buffer=document.createElement('canvas');
   buffer.width=image.width;buffer.height=image.height;
   buffer.getContext('2d').putImageData(image,0,0);
   const scale=Math.min((target.width-8)/bounds.w,(target.height-8)/bounds.h);
   c.drawImage(buffer,bounds.x,bounds.y,bounds.w,bounds.h,
    (target.width-bounds.w*scale)/2,(target.height-bounds.h*scale)/2,
    bounds.w*scale,bounds.h*scale);
  }else{
   c.fillStyle='#fff3cf';c.strokeStyle='#866033';c.lineWidth=3;
   c.beginPath();c.ellipse(80,62,25,34,0,0,Math.PI*2);c.fill();c.stroke();
   c.fillStyle='#c39441';
   c.fillRect(67,43,9,9);c.fillRect(83,65,11,9);c.fillRect(65,76,7,7);
   if(item.dex){
    c.fillStyle='#866033';c.font='bold 13px monospace';
    c.textAlign='center';c.fillText('#'+item.dex,80,112);
   }
  }
 }
}
function back(){
 if(confirmation){confirmation=false;render(true);}
 else close();
}
function primary(v){
 if(!v.supported||!v.eligible||confirmation)return null;
 let result=null;
 if(v.state===0){
  result=button(t('reserve'),'reserve',()=>{
   const current=view();
   if(!current.canChoose||!current.candidates.includes(chosen))return;
   confirmation=true;
  },locked()||!v.canChoose||!chosen,'reserve');
 }else if(v.state===1){
  result=button(t('arm'),'arm',()=>{
   if(view().canArm)return transaction(1);
  },locked()||!v.canArm,'arm');
 }else if(v.state===2){
  result=button(t('disarm'),'disarm',()=>{
   if(view().canDisarm)return transaction(2);
  },locked()||!v.canDisarm,'disarm');
 }
 if(result)result.setAttribute('data-reward-primary','');
 return result;
}
function render(force=false){
 if(!active)return;
 ensureLayer();
 const v=view(),candidates=Array.isArray(v.candidates)?v.candidates:[];
 const pages=Math.max(1,Math.ceil(candidates.length/size));
 page=Math.max(0,Math.min(page,pages-1));
 if(v.state!==0)confirmation=false;
 const key=JSON.stringify([v,busy,tpSaveReplacing,page,chosen,
  confirmation,message,size,t('title')]);
 layer.hidden=false;
 if(!force&&key===lastKey)return;
 const focused=layer.contains(document.activeElement)?
  document.activeElement.dataset.rewardAction:null;
 lastKey=key;portraits=[];paintAt=-Infinity;
 layer.replaceChildren();
 layer.setAttribute('aria-label',label()+' · '+t('title'));
 const head=node('header',undefined,'tp-reward-head');
 head.append(node('h2',label()+' · '+t('title')),
  button(t('back'),'back',back,locked(),'back'));
 const screens=node('div',undefined,'tp-reward-screens');
 upper=node('section',undefined,'tp-reward-screen tp-reward-upper');
 lower=node('section',undefined,'tp-reward-screen tp-reward-lower');
 const hero=node('div',undefined,'tp-reward-upright tp-reward-hero');
 const body=node('div',undefined,'tp-reward-upright tp-reward-body');
 upper.append(hero);lower.append(body);
 screens.append(upper,node('span',undefined,'tp-reward-spine'),lower);
 const dex=v.state===0?chosen:v.dex;
 hero.append(picture(dex,'tp-reward-portrait'),
  node('h3',dex?fns.dexName(dex):t('choose')),
  node('p',t(['open','reserved','armed','used'][v.state]||'open')));
 if(!v.supported||!v.eligible){
  const copy=node('div',undefined,'tp-reward-copy');
  copy.append(node('p',t(!v.supported?'unsupported':'noTitle')));
  body.append(copy);
 }else if(confirmation){
  body.classList.add('tp-reward-confirmation');
  const copy=node('div',undefined,'tp-reward-copy');
  copy.append(node('h3',t('confirm')),node('p',t('warning')));
  const decisions=node('div',undefined,'tp-reward-decisions');
  decisions.append(
   button(t('no'),'cancel',()=>{confirmation=false;},locked()),
   button(t('yes'),'confirm',()=>{
    const current=view();
    if(!confirmation||!current.canChoose||
       !current.candidates.includes(chosen))return;
    confirmation=false;
    return transaction(0,chosen);
   },locked())
  );
  body.append(copy,decisions);
 }else if(v.state===0){
  const grid=node('div',undefined,'tp-reward-grid');
  grid.style.gridTemplateColumns='repeat('+(size===6?3:2)+',minmax(0,1fr))';
  for(const dex of candidates.slice(page*size,(page+1)*size)){
   const tile=button(fns.dexName(dex),'choose-'+dex,()=>{
    chosen=dex;message='';
   },locked());
   tile.className='tp-reward-tile';
   tile.dataset.rewardDex=String(dex);
   tile.setAttribute('aria-pressed',String(chosen===dex));
   tile.replaceChildren(picture(dex,'tp-reward-mini'),
    node('span',fns.dexName(dex)));
   grid.append(tile);
  }
  body.append(grid);
 }else{
  const copy=node('div',undefined,'tp-reward-copy');
  copy.append(node('h3',t('guarantee')));
  if(v.state===1){
   copy.append(node('p',t('reservation')),node('p',t('care')),
    node('p',queueHint(v)));
  }else if(v.state===2){
   copy.append(node('p',t(v.stale?'stale':'nextLife')),
    node('p',v.queueConflict||v.queueSupported===0?queueHint(v):t('care')));
  }else{
   copy.append(node('p',t('redeemed')),node('p',t('noSecond')));
  }
  body.append(copy);
 }
 const toolbar=node('div',undefined,'tp-reward-toolbar');
 const action=primary(v);
 if(action)toolbar.append(action);
 const notice=node('p',locked()?t('saving'):
  message||(!v.canChoose&&v.state===0&&v.eligible?t('unavailable'):''),
  'tp-reward-notice');
 notice.setAttribute('role','status');
 hero.append(notice);
 const pager=node('div',undefined,'tp-reward-pager');
 if(v.supported&&v.eligible&&v.state===0&&!confirmation){
  pager.append(
   button(t('previous'),'previous',()=>{page--;},locked()||page===0,'previous'),
   button(t('next'),'next',()=>{page++;},locked()||page+1>=pages,'next')
  );
  head.querySelector('h2').textContent+=' · '+(page+1)+'/'+pages;
 }
 layer.append(head,screens,toolbar,pager);
 layout();
 const focus=focused?
  Array.from(layer.querySelectorAll('button')).find(
   element=>element.dataset.rewardAction===focused&&!element.disabled
  ):null;
 if(focus)focus.focus({preventScroll:true});
 else if(force&&!locked()){
  const target=confirmation?
   layer.querySelector('[data-reward-action="cancel"]'):
   layer.querySelector('[data-reward-action="back"]');
  target?.focus({preventScroll:true});
 }
 paint();
}
function draw(){
 if(!active)return;
 render();paint();
 statusEl.textContent=label()+' · '+t('title')+' · '+
  t(['open','reserved','armed','used'][view().state]||'open');
}
function tap(){return false;}
window.TPRewardEgg=Object.freeze({
 open,close,get region(){return region;},draw,tap,
 get active(){return active;},get busy(){return busy;},get view(){return view();},
 get diagnostics(){
  return Object.freeze({active,busy,page,chosen,message,confirmation,pageSize:size});
 }
});
})();
