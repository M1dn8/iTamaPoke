/* Original cave scenery; no external media or game-state writes. */
(function(root){
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 .tp-ice-scene{
  position:relative;width:100%;aspect-ratio:384/180;overflow:hidden;
  flex:0 0 auto;background:#10283f;border:1px solid #9bc6dd;
  box-sizing:border-box
 }
 .tp-ice-scene svg{display:block;width:100%;height:100%}
 .tp-ice-scene::after{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at 50% 85%,#d7f7ff66,transparent 65%)
 }
 .tp-ice-snow{
  position:absolute;inset:-50%;pointer-events:none;opacity:.85;
  background-image:radial-gradient(circle,#efffff 1px,transparent 2px);
  background-size:23px 29px;
  animation:tp-ice-storm 1.3s linear infinite
 }
 .tp-ice-scene[data-state="outside"] .tp-ice-snow{opacity:.95}
 .tp-ice-scene[data-state="inner"]{animation:tp-ice-clear .8s ease-out}
 .tp-zapdos-portrait>.tp-ice-scene{
  position:absolute;inset:0;height:100%;aspect-ratio:auto
 }
 @keyframes tp-ice-storm{
  from{transform:translate(10%,-5%) rotate(0)}
  to{transform:translate(-10%,10%) rotate(12deg)}
 }
 @keyframes tp-ice-clear{
  from{filter:brightness(1.7);opacity:.4}
  to{filter:none;opacity:1}
 }
 @media(prefers-reduced-motion:reduce){
  .tp-ice-snow,.tp-ice-scene{animation:none!important}
 }
 `;
 document.head.appendChild(style);
 function create(kind='blocked',label=''){
  const element=document.createElement('div');
  element.className='tp-ice-scene';element.dataset.state=kind;
  element.setAttribute('role','img');
  element.setAttribute('aria-label',label);
  element.innerHTML=
   '<svg viewBox="0 0 384 180" aria-hidden="true">'+
   '<path fill="#142f48" d="M0 0H384V180H0Z"/>'+
   '<path fill="#244c67" d="M0 0H384L343 24 310 12 285 55 245 34 210 64 171 39 132 58 91 25 47 49 0 21Z"/>'+
   '<path fill="#73b1cb" d="M0 0 66 0 45 65 67 114 33 180H0ZM384 0H330L350 68 326 121 351 180H384Z"/>'+
   '<path fill="#b6e5ef" d="M0 0 30 0 18 98 37 142 20 180H0ZM384 0H365L371 89 349 145 370 180H384Z"/>'+
   '<path fill="#83bacb" d="M0 180 88 151 151 157 221 146 296 155 384 180Z"/>'+
   '<path fill="#d4f0f2" d="M0 180 134 168 221 173 384 180Z"/>'+
   (kind==='inner'?
    '<path fill="#315f79" d="M120 150 147 83 167 69 190 90 208 63 236 82 267 151Z"/>':
    '<path fill="#aee0ed" d="M81 14 118 18 137 150 100 156ZM142 0 174 13 192 157 160 163ZM205 10 239 0 257 157 220 164ZM269 19 304 4 306 152 278 160Z"/>'+
    '<path fill="#e0faff" d="M97 20 105 24 122 143 113 147ZM156 15 164 19 179 150 171 153ZM226 14 233 12 243 149 235 152Z"/>')+
   '</svg>';
  if(kind==='blocked'){
   const svg=element.querySelector('svg');
   svg.setAttribute('viewBox','48 18 288 135');
   svg.setAttribute('preserveAspectRatio','xMidYMid slice');
  }
  if(kind!=='inner'){
   const snow=document.createElement('span');
   snow.className='tp-ice-snow';snow.setAttribute('aria-hidden','true');
   element.appendChild(snow);
  }
  return element;
 }
 root.TPIceCaveScene=Object.freeze({create});
})(typeof globalThis!=='undefined'?globalThis:this);
