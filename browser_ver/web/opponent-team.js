/* Shared read-only opponent team presentation. Local sprites only. */
(function(){
'use strict';
function text(value,x,y,size,width){
 ctx.fillStyle='#292831';ctx.textAlign='left';ctx.textBaseline='alphabetic';
 ctx.font=size+'px monospace';ctx.fillText(String(value),x,y,width);
}
function image(dex,x,y,w,h){
 const s=spriteFor(dex,false);
 if(!s){
  ensureSprite(dex);
  const cx=x+w/2,cy=y+h/2,r=Math.min(w,h)*0.29;
  ctx.save();
  ctx.fillStyle='#e4e8e2';ctx.strokeStyle='#788478';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-r,cy);ctx.lineTo(cx+r,cy);ctx.stroke();
  ctx.fillStyle='#fffdf7';ctx.beginPath();
  ctx.arc(cx,cy,r*0.28,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.restore();
  return;
 }
 const a=s.actions[TPAct.idle];if(!a)return;
 const frame=frameImageData(s,TPAct.idle,frameIndexAt(a,performance.now(),true));
 if(!frame)return;
 frameCanvas.width=a.w;frameCanvas.height=a.h;
 frameCtx.putImageData(frame,0,0);
 const scale=Math.min(3,w/a.w,h/a.h);
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(frameCanvas,x+(w-a.w*scale)/2,
  y+(h-a.h*scale)/2,a.w*scale,a.h*scale);
}
function types(dex){
 return [...new Set([fns.dexType1(dex),fns.dexType2(dex)]
  .filter(t=>t>0))];
}
function typeBadges(dex,x,y,width){
 const values=types(dex),gap=4;
 if(!values.length)return;
 const badgeWidth=(width-gap*(values.length-1))/values.length;
 values.forEach((type,i)=>{
  const left=x+i*(badgeWidth+gap),raw=typeColor565(type);
  const r=((raw>>11)&31)*255/31;
  const g=((raw>>5)&63)*255/63;
  const b=(raw&31)*255/31;
  ctx.fillStyle='rgb('+Math.round(r*0.38+255*0.62)+','+
   Math.round(g*0.38+255*0.62)+','+
   Math.round(b*0.38+255*0.62)+')';
  roundRect(left,y,badgeWidth,15,4);ctx.fill();
  ctx.strokeStyle=rgb565(raw);ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='#202820';ctx.font='9px monospace';
  ctx.textAlign='center';ctx.textBaseline='alphabetic';
  ctx.fillText(TYPE_NAMES[type]||String(type),
   left+badgeWidth/2,y+11,badgeWidth-5);
 });
}
function draw(team,{x=30,y=110,width=406,rowHeight=58,gap=8}={}){
 ctx.save();
 try{
  const w=(width-gap)/2;
  team.forEach(([dex,level],i)=>{
   const left=x+(i%2)*(w+gap),top=y+Math.floor(i/2)*rowHeight;
   ctx.fillStyle='#fffdf7';roundRect(left,top,w,rowHeight-5,8);
   ctx.fill();ctx.strokeStyle='#c8cbc5';ctx.lineWidth=1;ctx.stroke();
   image(dex,left+3,top+3,47,rowHeight-11);
   const tx=left+54,tw=w-60;
   text(fns.dexName(dex),tx,top+16,12,tw);
   text('Lv. '+level,tx,top+32,11,tw);
   typeBadges(dex,tx,top+36,tw);
  });
  if(team.some(([dex])=>!spriteFor(dex,false))){
   ctx.fillStyle='#526052';ctx.font='10px monospace';
   ctx.textAlign='center';ctx.textBaseline='alphabetic';
   ctx.fillText('Einige lokale Grafiken fehlen',
    x+width/2,y+Math.ceil(team.length/2)*rowHeight+8,width);
  }
 }finally{ctx.restore();}
}

function header({name,subtitle,color='#81709b',image=null,kind='trainer'}){
 ctx.save();
 try{
  ctx.fillStyle=color;roundRect(24,10,418,91,12);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.80)';
  roundRect(29,15,408,81,9);ctx.fill();
  ctx.save();roundRect(29,15,408,81,9);ctx.clip();
  ctx.globalAlpha=0.16;ctx.strokeStyle=color;ctx.lineWidth=3;
  for(let i=0;i<7;i++){
   const x=310+i*23;
   ctx.beginPath();ctx.moveTo(x,15);ctx.lineTo(x-45,96);ctx.stroke();
  }
  ctx.restore();
  if(image){
   const s=Math.min(56/image.width,72/image.height);
   ctx.imageSmoothingEnabled=false;
   ctx.drawImage(image,39+(56-image.width*s)/2,
    91-image.height*s,image.width*s,image.height*s);
  }else{
   ctx.fillStyle='#84948a';
   ctx.beginPath();ctx.arc(67,38,12,0,Math.PI*2);ctx.fill();
   roundRect(46,54,42,33,10);ctx.fill();
  }
  const left=kind==='arena'?143:108,width=kind==='arena'?280:315;
  text(name,left,40,20,width);
  text(subtitle,left,61,11,width);
  if(!image&&kind!=='arena')text('Trainerbild fehlt',left,80,10,width);
 }finally{ctx.restore();}
}
const portraits=new Map(),pendingPortraits=new Set();
let portraitEpoch=0;
function portrait(key){
 if(portraits.has(key))return portraits.get(key);
 if(!pendingPortraits.has(key)&&window.TPTrainerArt){
  const epoch=portraitEpoch;
  pendingPortraits.add(key);
  TPTrainerArt.picture(key).then(item=>{
   if(epoch===portraitEpoch)portraits.set(key,item?item.image:null);
  }).catch(error=>{
   if(epoch===portraitEpoch){
    portraits.set(key,null);
    window.TPDiagnostics?.record('manager',error);
   }
  }).finally(()=>{
   if(epoch===portraitEpoch)pendingPortraits.delete(key);
  });
 }
 return null;
}
function invalidatePortraits(){
 portraitEpoch++;portraits.clear();pendingPortraits.clear();
}
window.TPOpponentTeam=Object.freeze({
 draw,header,portrait,invalidatePortraits
});

})();
