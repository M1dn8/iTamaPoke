/* Original Nugget Bridge clearing; no external media or game-state writes. */
(function(root){
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 .tp-nugget-scene{
  position:relative;width:100%;aspect-ratio:384/180;flex:0 0 auto;
  overflow:hidden;box-sizing:border-box;background:#bdd3a3;border:1px solid #71926b
 }
 .tp-nugget-scene svg{display:block;width:100%;height:100%}
 .tp-zapdos-portrait>.tp-nugget-scene{
  position:absolute;inset:0;height:100%;aspect-ratio:auto
 }
 .tp-nugget-trace{animation:tp-nugget-peek 3.4s ease-in-out infinite}
 @keyframes tp-nugget-peek{0%,100%{opacity:.35}45%,70%{opacity:.95}}
 @media(prefers-reduced-motion:reduce){
  .tp-nugget-trace{animation:none!important;opacity:.85}
 }
 #tp-app-page:has(#tp-mew-page){padding:6px}
 #tp-app-page:has(#tp-mew-page)>.tp-app-head{margin-bottom:6px}
 #tp-app-page:has(#tp-mew-page)>.tp-app-head h2{
  font-size:clamp(14px,4vw,19px);line-height:1.15
 }
 #tp-app-page #tp-mew-page{
  display:flex;flex-direction:column;flex:1 1 0;min-height:0;
  overflow:hidden!important;padding-bottom:0!important;gap:6px!important
 }
 #tp-mew-page>p{margin:0;text-align:center;font-size:12px}
 #tp-mew-page.tp-power-prep>.tp-nugget-scene{
  flex:1 1 0;min-height:48px;aspect-ratio:auto
 }
 #tp-mew-page .tp-power-copy{
  flex:0 0 auto;margin-top:0;padding:4px;gap:4px
 }
 #tp-mew-page .tp-power-copy h3{font-size:15px;margin:0}
 #tp-mew-page .tp-power-copy p{font-size:12px;line-height:1.3;margin:0}
 #tp-app-page #tp-mew-page .tp-ice-open{
  display:block;position:relative;flex:1 1 0;width:100%;
  min-height:48px;margin:0;padding:0;border:0;border-radius:0;
  overflow:hidden;touch-action:manipulation
 }
 #tp-mew-page .tp-ice-open>.tp-nugget-scene{
  width:100%;height:100%;aspect-ratio:auto;border:0
 }
 #tp-mew-page .tp-zapdos-portrait{flex:1 1 0;min-height:48px}
 #tp-mew-page .tp-zapdos-portrait canvas{object-fit:contain}
 #tp-mew-page.tp-mew-play>.tp-mew-hide-game{
  flex:1 1 0;min-height:0;overflow:hidden
 }
 `;
 document.head.appendChild(style);
 function create(kind='blocked',label=''){
  const element=document.createElement('div');
  element.className='tp-nugget-scene';element.dataset.state=kind;
  element.setAttribute('role','img');element.setAttribute('aria-label',label);
  const outside=kind==='outside',clear=kind==='inner';
  const view=outside?'0 0 384 180':'48 10 288 150';
  const planks=Array.from({length:8},(_,i)=>
   '<path d="M166 '+(112+i*9)+'H214" stroke="#8d743e" stroke-width="2"/>'
  ).join('');
  element.innerHTML=
   '<svg viewBox="'+view+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+
   '<path fill="#c5d9ac" d="M0 0H384V180H0Z"/>'+
   '<path fill="#7fa06b" d="M0 0H384V55L354 46 325 57 298 43 271 54 239 42 210 51 180 40 146 50 116 38 84 51 54 40 24 51 0 43Z"/>'+
   '<path fill="#4c7850" d="M0 0H384V21L353 32 326 23 300 35 273 24 242 35 211 22 181 33 150 22 119 34 86 25 56 35 25 24 0 33Z"/>'+
   '<path fill="#689360" d="M0 18 42 37 54 75 34 105 49 139 25 180H0ZM384 16 350 34 335 73 353 109 333 145 360 180H384Z"/>'+
   '<path fill="#dce2b4" d="M165 180 169 140Q171 116 190 103L219 110Q209 130 215 150L215 180Z"/>'+
   '<ellipse fill="#d3e3b2" cx="195" cy="125" rx="102" ry="38"/>'+
   '<g data-hiding-place="tree"><path fill="#947951" stroke="#645e40" d="M273 58H294L301 119H264Z"/>'+
   '<path fill="#4e7e4b" stroke="#3b663e" d="M244 70Q230 49 249 32Q247 12 270 17Q288 4 304 23Q329 22 322 47Q337 70 311 79L258 81Z"/>'+
   '<path fill="none" stroke="#83a166" stroke-width="6" d="M251 48Q265 31 282 41M291 27Q310 33 309 49"/></g>'+
   '<g data-hiding-place="rock"><ellipse fill="#a2b88c" cx="275" cy="143" rx="39" ry="9"/>'+
   '<path fill="#8c9982" stroke="#61785e" d="m245 139 2-24 19-14 28 4 16 21-8 19-30 4Z"/>'+
   '<path fill="#b8c0a1" d="m247 115 19-14 28 4-15 20-22 6Z"/></g>'+
   '<g data-hiding-place="bush"><ellipse fill="#9db783" cx="102" cy="132" rx="43" ry="9"/>'+
   '<path fill="#537f43" stroke="#3c683b" d="M62 128Q51 108 70 101Q66 83 87 87Q101 74 115 89Q136 82 140 104Q157 119 139 132Z"/>'+
   '<path fill="none" stroke="#85a55c" stroke-width="5" d="M73 111Q88 96 102 106M111 97Q130 96 133 111"/></g>'+
   (clear?
    '<g data-clearing="open"><ellipse fill="#b2ca8f" cx="191" cy="147" rx="67" ry="11"/><ellipse fill="#e4e9bc" cx="191" cy="144" rx="48" ry="7"/></g>':
    '<g data-pink-trace="true" class="tp-nugget-trace"><path d="M113 109Q133 117 134 103Q135 93 126 97" fill="none" stroke="#edacd0" stroke-width="4" stroke-linecap="round"/></g>')+
   (outside?
    '<g data-bridge="nugget"><path fill="#609dba" d="M0 151Q91 130 180 148T384 145V180H0Z"/>'+
    '<path fill="none" stroke="#a9d0d1" stroke-width="2" d="M7 162H52m89-2h44m46 8h61m39-11h41"/>'+
    '<g data-bridge-deck="center"><path fill="#d7ba69" stroke="#8a713b" stroke-width="2" d="M165 109H215V180H165Z"/>'+planks+
    '<path fill="none" stroke="#f1d386" stroke-width="5" d="M163 108V180M217 108V180"/></g></g>':'')+
   '<g fill="#e7edc2"><path d="m167 76 3-5 3 5-3 4Zm55 73 3-5 3 5-3 4Zm-64 6 3-4 3 4-3 3Z"/></g></svg>';
  return element;
 }
 root.TPNuggetBridgeScene=Object.freeze({create});
})(typeof globalThis!=='undefined'?globalThis:this);
