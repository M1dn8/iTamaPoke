/* Original Azuria cave scenery; read-only presentation, no external media. */
(function(root){
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 .tp-cerulean-scene{
  position:relative;width:100%;aspect-ratio:384/180;flex:0 0 auto;
  overflow:hidden;box-sizing:border-box;background:#24383c;border:1px solid #778c8b
 }
 .tp-cerulean-scene svg{display:block;width:100%;height:100%}
 .tp-zapdos-portrait>.tp-cerulean-scene{
  position:absolute;inset:0;height:100%;aspect-ratio:auto
 }
 .tp-cerulean-energy{animation:tp-cerulean-energy 3s ease-in-out infinite}
 @keyframes tp-cerulean-energy{0%,100%{opacity:.45}50%{opacity:.8}}
 @media(prefers-reduced-motion:reduce){
  .tp-cerulean-energy{animation:none!important;opacity:.6}
 }
 #tp-app-page:has(#tp-mewtwo-page){padding:6px}
 #tp-app-page:has(#tp-mewtwo-page)>.tp-app-head{margin-bottom:6px}
 #tp-app-page:has(#tp-mewtwo-page)>.tp-app-head h2{
  font-size:clamp(14px,4vw,19px);line-height:1.15
 }
 #tp-app-page #tp-mewtwo-page{
  display:flex;flex-direction:column;flex:1 1 0;min-height:0;
  overflow:hidden!important;padding-bottom:0!important;gap:6px!important
 }
 #tp-mewtwo-page>p{margin:0;text-align:center;font-size:12px}
 #tp-mewtwo-page.tp-power-prep>.tp-cerulean-scene{
  flex:1 1 0;min-height:48px;aspect-ratio:auto
 }
 #tp-mewtwo-page .tp-power-copy{
  flex:0 0 auto;margin-top:0;padding:4px;gap:4px
 }
 #tp-mewtwo-page .tp-power-copy h3{font-size:15px;margin:0}
 #tp-mewtwo-page .tp-power-copy p{font-size:12px;line-height:1.3;margin:0}
 #tp-app-page #tp-mewtwo-page .tp-ice-open{
  display:block;position:relative;flex:1 1 0;width:100%;
  min-height:48px;margin:0;padding:0;border:0;border-radius:0;
  overflow:hidden;touch-action:manipulation
 }
 #tp-mewtwo-page .tp-ice-open>.tp-cerulean-scene{
  width:100%;height:100%;aspect-ratio:auto;border:0
 }
 #tp-mewtwo-page .tp-zapdos-portrait{flex:1 1 0;min-height:48px}
 #tp-mewtwo-page .tp-zapdos-portrait canvas{object-fit:contain}
 #tp-mewtwo-page.tp-psi-play>.tp-psi-game{
  flex:1 1 0;min-height:0;overflow:hidden
 }
 `;
 document.head.appendChild(style);
 let serial=0;
 function create(kind='blocked',label=''){
  const element=document.createElement('div');
  element.className='tp-cerulean-scene';element.dataset.state=kind;
  element.setAttribute('role','img');element.setAttribute('aria-label',label);
  const id='tp-cerulean-'+(++serial),clear=kind==='inner';
  const view=kind==='blocked'?'42 12 300 156':'0 0 384 180';
  element.innerHTML=
   '<svg viewBox="'+view+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+
   '<defs><linearGradient id="'+id+'-rock" x2="0" y2="1"><stop stop-color="#8d9a8c"/><stop offset="1" stop-color="#435b56"/></linearGradient>'+
   '<radialGradient id="'+id+'-psi"><stop stop-color="#d8bdf3" stop-opacity=".42"/><stop offset="1" stop-color="#6c4c99" stop-opacity=".1"/></radialGradient></defs>'+
   '<path fill="#263c3e" d="M0 0H384V180H0Z"/>'+
   '<path fill="#4a6460" d="M125 26H268V143H125Z"/>'+
   '<path fill="#2b4247" d="M163 28H239V131H163Z"/>'+
   '<path fill="url(#'+id+'-rock)" d="M0 0H384V43L352 34 326 52 295 40 267 58 239 42 211 56 185 39 156 55 130 37 100 53 69 36 36 49 0 34Z"/>'+
   '<path fill="#b0b7a0" d="M0 0H384V16L354 10 328 29 298 18 269 34 239 21 213 35 185 22 156 35 128 20 100 33 67 22 36 35 0 20Z"/>'+
   '<path fill="#6d8273" d="M0 27 43 36 57 71 37 103 56 130 29 180H0ZM384 26 349 35 329 75 347 106 329 133 358 180H384Z"/>'+
   '<path fill="#a3ad93" d="M0 25 22 34 31 66 17 96 30 130 13 180H0ZM384 25 365 36 357 70 371 103 354 137 375 180H384Z"/>'+
   '<path fill="#9ca58a" d="M24 180 73 137 131 125 184 138 234 125 304 141 360 180Z"/>'+
   '<path fill="#c4c3a3" d="M111 180 151 147 208 146 253 137 305 180Z"/>'+
   '<path fill="#315e71" d="M0 180 31 153 67 148 97 161 117 180Z"/>'+
   '<path fill="none" stroke="#8cb9bf" stroke-width="2" d="m23 167 21-3 18 3m-27 9 35-2m-5-17 17 2"/>'+
   '<path fill="#6b7b66" d="m289 160 10-12 17 5 1 10-15 5Zm-206 9 9-6 10 5-3 7-13 1Z"/>'+
   (clear?
    '<g data-cleared="true"><path fill="#73846c" d="M142 145 159 125H235L257 145Z"/><path fill="#c0c2a0" d="M159 125H235L225 117H170Z"/></g>':
    '<g data-barrier="active" class="tp-cerulean-energy">'+
    '<ellipse cx="201" cy="93" rx="66" ry="65" fill="url(#'+id+'-psi)" stroke="#b696dc" stroke-width="2"/>'+
    '<ellipse cx="201" cy="93" rx="50" ry="57" fill="none" stroke="#dfc6f7" stroke-width="1.5"/>'+
    '<path d="M156 58Q201 81 246 58M141 92Q201 114 261 92M154 123Q201 142 247 123" fill="none" stroke="#cfb1ee" stroke-width="1.5"/>'+
    '</g><g data-floating-stones="true" fill="#83917f" stroke="#485e55" stroke-width="1.5">'+
    '<path d="m105 88 7-9 11 4-1 10-12 2Zm166 22 9-10 11 5-3 10-13 1Zm-71-61 5-7 9 3-2 8-8 1Z"/></g>')+
   '</svg>';
  return element;
 }
 root.TPCeruleanCaveScene=Object.freeze({create});
})(typeof globalThis!=='undefined'?globalThis:this);
