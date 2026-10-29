/* Original Victory Road review scenery; no external media or state writes. */
(function(root){
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 .tp-victory-scene{
  position:relative;width:100%;aspect-ratio:384/180;overflow:hidden;
  flex:0 0 auto;background:#34322c;border:1px solid #82745e;
  box-sizing:border-box
 }
 .tp-victory-scene svg{display:block;width:100%;height:100%}
 .tp-zapdos-portrait>.tp-victory-scene{
  position:absolute;inset:0;height:100%;aspect-ratio:auto
 }
 .tp-victory-feather{
  animation:tp-victory-feather-shimmer 2.8s ease-in-out infinite
 }
 .tp-victory-spark{
  animation:tp-victory-sparkle 3.6s ease-in-out infinite
 }
 @keyframes tp-victory-feather-shimmer{
  0%,100%{opacity:.72}50%{opacity:1}
 }
 @keyframes tp-victory-sparkle{
  0%,35%,100%{opacity:.25}65%{opacity:1}
 }
 @media(prefers-reduced-motion:reduce){
  .tp-victory-feather,.tp-victory-spark{
   animation:none!important;opacity:1
  }
 }
 #tp-app-page:has(#tp-moltres-page){padding:6px}
 #tp-app-page:has(#tp-moltres-page)>.tp-app-head{margin-bottom:6px}
 #tp-app-page:has(#tp-moltres-page)>.tp-app-head h2{
  font-size:clamp(14px,4vw,19px);line-height:1.15
 }
 #tp-app-page #tp-moltres-page{
  display:flex;flex-direction:column;flex:1 1 0;min-height:0;
  overflow:hidden!important;padding-bottom:0!important;
  gap:6px!important;box-sizing:border-box
 }
 #tp-moltres-page>p{margin:0;text-align:center;font-size:12px}
 #tp-moltres-page.tp-power-prep>.tp-victory-scene{
  flex:1 1 0;min-height:48px;aspect-ratio:auto
 }
 #tp-moltres-page .tp-power-copy{
  flex:0 0 auto;margin-top:0;padding:4px;gap:4px
 }
 #tp-moltres-page .tp-power-copy h3{font-size:15px;margin:0}
 #tp-moltres-page .tp-power-copy p{
  font-size:12px;line-height:1.3;margin:0
 }
 #tp-app-page #tp-moltres-page .tp-ice-open{
  display:block;position:relative;flex:1 1 0;width:100%;
  min-height:48px;margin:0;padding:0;border:0;border-radius:0;
  overflow:hidden;touch-action:manipulation
 }
 #tp-moltres-page .tp-ice-open>.tp-victory-scene{
  width:100%;height:100%;aspect-ratio:auto;border:0
 }
 #tp-moltres-page .tp-zapdos-portrait{
  flex:1 1 0;min-height:48px
 }
 #tp-moltres-page .tp-zapdos-portrait canvas{object-fit:contain}
 #tp-app-page #tp-moltres-page .tp-victory-game{
  --tp-victory-reserve:76px;
  display:flex;flex-direction:column;align-items:center;
  flex:1 1 0;width:100%;height:100%;min-height:0;
  gap:6px;overflow:hidden;container-type:size
 }
 #tp-moltres-page .tp-victory-game:has(.tp-victory-feedback:not([hidden])){
  --tp-victory-reserve:104px
 }
 #tp-moltres-page .tp-victory-instructions{
  position:absolute!important;width:1px!important;height:1px!important;
  padding:0!important;margin:-1px!important;overflow:hidden!important;
  clip-path:inset(50%);white-space:nowrap
 }
 #tp-moltres-page .tp-victory-progress,
 #tp-moltres-page .tp-victory-feedback{
  flex:0 0 auto;width:100%;text-align:center;margin:0;
  font-size:11px!important;line-height:1.2!important
 }
 #tp-moltres-page .tp-victory-grid{
  flex:0 0 auto;align-self:center;grid-column:auto;grid-row:auto;
  padding:0;max-width:none;height:auto;
  width:min(100%,228px);
  width:min(228px,100cqw,calc(100cqh - var(--tp-victory-reserve)));
  aspect-ratio:1
 }
 #tp-moltres-page .tp-victory-controls{
  display:flex;flex-direction:column;align-self:center;
  flex:0 0 auto;width:min(100%,228px);gap:4px
 }
 #tp-moltres-page .tp-victory-controls>button{
  min-width:0;min-height:44px!important;padding:4px!important;
  font-size:12px!important;line-height:1.15
 }
 `;
 document.head.appendChild(style);
 let serial=0;

 function rock(name,x,y,scale){
  return '<g data-rock="'+name+'" transform="translate('+x+' '+y+') scale('+scale+')">'+
   '<ellipse cx="1" cy="23" rx="40" ry="9" fill="#171d1b" opacity=".45"/>'+
   '<path d="M-38 12-31-14-8-28 20-23 38-4 34 21 4 28-24 23Z" fill="#777365" stroke="#42463f" stroke-width="2"/>'+
   '<path d="M-31-14-8-28 20-23 12-5-9 2Z" fill="#aaa08a"/>'+
   '<path d="M-38 12-31-14-9 2-15 21-24 23Z" fill="#8b8776"/>'+
   '<path d="M12-5 20-23 38-4 34 21 12 16Z" fill="#5b6055"/>'+
   '<path d="M-9 2 12-5 12 16 4 28-15 21Z" fill="#8e8976"/>'+
   '<path d="M-27-10-11-20M-5-22 12-19M18 3 29 12M-18 9-9 13" fill="none" stroke="#c4b895" stroke-width="2" opacity=".55"/>'+
   '</g>';
 }

 function create(kind='blocked',label=''){
  const element=document.createElement('div');
  element.className='tp-victory-scene';
  element.dataset.state=kind;
  element.setAttribute('role','img');
  element.setAttribute('aria-label',label);
  const id='tp-victory-detail-'+(++serial);
  const clear=kind==='inner';
  const view=kind==='blocked'?'42 14 300 156':'0 0 384 180';

  const floorMarks=Array.from({length:9},(_,i)=>{
   const x=54+i*35,y=151+(i%3)*7;
   return '<path d="M'+x+' '+y+'l10-2 6 3m-3 8 12 1" fill="none" stroke="#766f59" stroke-width="1" opacity=".55"/>';
  }).join('');

  const feather=clear?'':
   '<ellipse cx="190" cy="146" rx="29" ry="10" fill="#ffcc64" opacity=".24"/>'+
   '<g class="tp-victory-feather" data-feather="between-rocks" transform="translate(190 141) rotate(-23)" filter="url(#'+id+'-feather)">'+
   '<path d="M0 6C-3-1-12-9-9-18L0-29C9-25 14-15 9-7L0 6Z" fill="#f2b549" stroke="#e17f32" stroke-width="1.5"/>'+
   '<path d="M0 10 0-26M0-17-7-12M0-11-8-6M0-5-5 0M0-19 7-15M0-12 9-9M0-5 6-3" fill="none" stroke="#fff1ad" stroke-width="1.5" stroke-linecap="round"/>'+
   '</g>'+
   '<g class="tp-victory-spark" fill="#fff2bc">'+
   '<path d="m173 122 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z"/>'+
   '<path d="m207 138 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>'+
   '</g>';

  element.innerHTML=
   '<svg viewBox="'+view+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+
   '<defs>'+
   '<linearGradient id="'+id+'-wall" x2="0" y2="1">'+
   '<stop stop-color="#9b9278"/><stop offset="1" stop-color="#555d50"/>'+
   '</linearGradient>'+
   '<radialGradient id="'+id+'-light">'+
   '<stop stop-color="#d3b981"/><stop offset="1" stop-color="#444c40"/>'+
   '</radialGradient>'+
   '<filter id="'+id+'-feather" x="-100%" y="-100%" width="300%" height="300%">'+
   '<feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="blur"/>'+
   '<feFlood flood-color="#ffd35f" flood-opacity=".9" result="gold"/>'+
   '<feComposite in="gold" in2="blur" operator="in" result="glow"/>'+
   '<feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>'+
   '</filter></defs>'+
   '<path fill="#333e34" d="M0 0H384V180H0Z"/>'+
   '<path fill="url(#'+id+'-light)" d="M95 28H292V155H95Z"/>'+
   '<path fill="#555c4a" d="M153 26H238V114H153Z"/>'+
   '<path fill="#aa9b70" d="M177 29H216V115H177Z"/>'+
   '<path fill="url(#'+id+'-wall)" d="M0 0H384V41L351 34 328 52 294 41 269 60 242 44 218 62 189 42 160 59 132 41 103 58 74 40 42 55 0 37Z"/>'+
   '<path fill="#b3a483" d="M0 0H384V18L351 12 325 29 292 20 267 37 240 24 216 39 189 24 161 37 131 22 104 35 72 24 43 38 0 23Z"/>'+
   '<path fill="#777b65" d="M0 28 42 39 55 73 38 98 57 125 30 180H0ZM384 22 346 37 328 75 346 102 327 131 354 180H384Z"/>'+
   '<path fill="#aaa085" d="M0 23 23 33 30 66 16 96 31 128 12 180H0ZM384 23 366 34 357 69 372 101 353 137 374 180H384Z"/>'+
   '<path fill="#bbb08a" d="M29 180 70 137 128 125 180 133 227 125 302 141 355 180Z"/>'+
   '<path fill="#d0c098" d="M91 180 146 144 199 145 244 137 300 180Z"/>'+
   floorMarks+
   '<g fill="#7a7d65" stroke="#555c4e"><path d="m48 142 8-9 12 4 3 8-13 5Z"/><path d="m307 149 7-11 12 3 3 10-12 4Z"/><path d="m77 161 7-4 7 4-2 6-10 1Z"/></g>'+
   (clear?
    '<path fill="#706f57" d="M138 145 154 127H232L252 145Z"/>'+
    '<path fill="#b5a77c" d="M154 127H232L220 119H166Z"/>'+
    '<path fill="none" stroke="#d8c994" d="M165 130H222M158 136H235"/>':
    rock('rear',191,91,.82)+rock('left',130,126,1.15)+rock('right',250,124,1.1))+
   feather+
   (clear?'':
    '<g fill="#807a5e" stroke="#d5c28a" stroke-width="1.5">'+
    '<ellipse cx="118" cy="166" rx="13" ry="4"/>'+
    '<ellipse cx="191" cy="169" rx="13" ry="4"/>'+
    '<ellipse cx="264" cy="166" rx="13" ry="4"/></g>')+
   '</svg>';
  return element;
 }
 root.TPVictoryRoadScene=Object.freeze({create});
})(typeof globalThis!=='undefined'?globalThis:this);
