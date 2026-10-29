/* Read-only encounter portrait, using the shared local TPK2 loader. */
(function(root){
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-encounter{
  gap:8px;
 }
 #tp-app-page .tp-zapdos-encounter>h3,
 #tp-app-page .tp-zapdos-encounter>p{
  text-align:center!important;margin:0;
 }
 #tp-app-page .tp-zapdos-encounter>p{
  font-size:12px;line-height:1.35;
 }
 #tp-app-page .tp-zapdos-encounter>button{
  align-self:stretch;width:100%;min-height:44px;flex-shrink:0;
 }
 #tp-app-page .tp-zapdos-portrait{
  position:relative;isolation:isolate;flex-shrink:0;
  width:100%;aspect-ratio:384 / 180;overflow:hidden;
  background:#536675;border:1px solid #6f7874;
  box-sizing:border-box;
 }
 #tp-app-page .tp-zapdos-portrait canvas{
  position:absolute;inset:0;z-index:1;
  display:block;width:100%;height:100%;
  image-rendering:pixelated;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page) .tp-zapdos-challenge{
  position:absolute;inset:0;z-index:3;
  display:block;width:100%;height:100%;
  min-height:0!important;margin:0!important;padding:0!important;
  border:0!important;border-radius:0!important;
  background:transparent!important;box-shadow:none!important;
  transform:none!important;cursor:pointer;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page) .tp-zapdos-challenge:focus-visible{
  outline:3px solid #ffe784!important;outline-offset:-4px;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page) .tp-zapdos-challenge:disabled{
  cursor:default;
 }
 #tp-app-page .tp-zapdos-art-status{
  position:absolute;inset:0;z-index:2;
  display:flex;align-items:center;justify-content:center;
  padding:12px;margin:0;text-align:center;
  font-size:12px;line-height:1.35;
  color:#fff8e7;background:rgba(34,48,59,.78);
 }
 `;
 document.head.appendChild(style);

 function create(text,options={}){
  const dex=[144,145,146,150,151].includes(options.dex)?options.dex:145;
  let disposed=false;
  const element=document.createElement('div');
  element.className='tp-zapdos-portrait';
  const scenery=options.scene?options.scene():root.TPPowerPlantScene?.create('inside');
  if(scenery)element.append(scenery);

  const canvas=document.createElement('canvas');
  canvas.width=384;canvas.height=180;
  canvas.dataset.dex=String(dex);canvas.dataset.ready='loading';
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label',text('artName'));

  const status=document.createElement('p');
  status.className='tp-zapdos-art-status';
  status.setAttribute('role','status');
  status.textContent=text('artLoading');
  element.append(canvas,status);

  async function paint(){
   try{
    const sprite=await loadSprite(dex,false);
    if(disposed||!element.isConnected)return;
    const action=sprite?.actions[TPAct.idle];
    const image=action?frameImageData(sprite,TPAct.idle,0):null;
    if(!image)throw Error('ZAPDOS_LOCAL_IDLE_FRAME_UNAVAILABLE');

    let left=image.width,right=-1,top=image.height,bottom=-1;
    for(let y=0;y<image.height;y++){
     for(let x=0;x<image.width;x++){
      if(!image.data[(y*image.width+x)*4+3])continue;
      left=Math.min(left,x);right=Math.max(right,x);
      top=Math.min(top,y);bottom=Math.max(bottom,y);
     }
    }
    if(right<left||bottom<top)
     throw Error('ZAPDOS_LOCAL_IDLE_FRAME_EMPTY');

    const off=document.createElement('canvas');
    off.width=image.width;off.height=image.height;
    off.getContext('2d').putImageData(image,0,0);
    const width=right-left+1,height=bottom-top+1;
    const scale=Math.min(6,352/width,164/height)*(dex===151?0.65:dex===144||dex===146||dex===150?0.8:1);
    const context=canvas.getContext('2d');
    context.clearRect(0,0,384,180);
    context.imageSmoothingEnabled=false;
    context.drawImage(
     off,left,top,width,height,
     (384-width*scale)/2,(180-height*scale)/2,
     width*scale,height*scale
    );
    canvas.dataset.ready='true';
    status.style.display='none';
   }catch(error){
    if(disposed||!element.isConnected)return;
    canvas.dataset.ready='missing';
    status.textContent=text('artMissing');
    if(error.message!=='ZAPDOS_LOCAL_IDLE_FRAME_UNAVAILABLE'){
     try{root.TPDiagnostics?.record('manager',error);}catch(_){}
    }
   }
  }
  const ready=paint();
  return Object.freeze({
   element,ready,
   dispose(){disposed=true;}
  });
 }
 root.TPZapdosPortrait=Object.freeze({create});
})(typeof globalThis!=='undefined'?globalThis:this);
