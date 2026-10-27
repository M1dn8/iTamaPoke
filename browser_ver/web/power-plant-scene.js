/* Decorative power-plant scenes. No gameplay or storage authority. */
(function(root){
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 #tp-app-page #tp-zapdos-page.tp-power-prep{
  position:relative;isolation:isolate;flex:1;min-height:0;
  padding:0!important;overflow:hidden!important;gap:0;
 }
 #tp-app-page .tp-power-scene{
  position:absolute;inset:0;z-index:0;overflow:hidden;
  background:#536a78;pointer-events:none;
 }
 #tp-app-page .tp-power-scene svg{
  display:block;width:100%;height:100%;
 }
 #tp-app-page #tp-zapdos-page.tp-power-prep>p{
  position:relative;z-index:2;background:#f7efe6;
  padding:6px;margin:0;text-align:center;
 }
 #tp-app-page .tp-power-copy{
  position:relative;z-index:1;display:flex;flex-direction:column;
  gap:8px;margin-top:auto;padding:10px;
  background:rgba(247,239,230,.95);color:#3d3332;
 }
 #tp-app-page .tp-power-copy h3,
 #tp-app-page .tp-power-copy p{
  text-align:center!important;margin:0;
 }
 #tp-app-page .tp-power-copy p{
  font-size:12px;line-height:1.35;
 }
 #tp-app-page .tp-power-copy button{
  align-self:stretch;width:100%;min-height:44px;
 }
 #tp-app-page .tp-power-flicker{
  animation:tp-power-flicker 4.8s linear infinite;
 }
 #tp-app-page .tp-power-flicker-delayed{
  animation-delay:-1.9s;
 }
 #tp-app-page .tp-power-scene[data-scene="outside"] .tp-power-flicker{
  animation-duration:2.4s;
  filter:drop-shadow(0 0 2px #fff0a3);
 }
 @keyframes tp-power-flicker{
  0%,28%,42%,73%,100%{opacity:1}
  33%,38%{opacity:.55}
  79%,86%{opacity:.7}
 }
 @media(prefers-reduced-motion:reduce){
  #tp-app-page .tp-power-flicker{
   animation:none!important;opacity:1;
  }
 }
 `;
 document.head.appendChild(style);

 const outside=`
 <rect width="466" height="340" fill="#748d9c"/>
 <path d="M0 86 44 57 99 83 150 48 215 78 280 50 350 80 410 45 466 71V240H0Z" fill="#526e69"/>
 <rect y="218" width="466" height="122" fill="#52674e"/>
 <path d="M205 214h58l45 126H160Z" fill="#9a9788"/>
 <g stroke="#293e49" stroke-width="3" shape-rendering="crispEdges">
  <path d="M54 98h64V48h23v50h36V35h24v63h48V63h23v35h139v120H54Z" fill="#775f59"/>
  <rect x="65" y="110" width="336" height="108" fill="#a16f59"/>
  <path d="M47 108h362V95H47Z" fill="#455868"/>
  <rect x="188" y="153" width="77" height="65" fill="#354c5a"/>
  <path d="M226 153v65" stroke="#c0c8bc"/>
  <g fill="#ffe784" class="tp-power-flicker">
   <rect x="79" y="125" width="35" height="26"/>
   <rect x="128" y="125" width="35" height="26"/>
   <rect x="286" y="125" width="35" height="26"/>
  </g>
  <g fill="#ffe784" class="tp-power-flicker tp-power-flicker-delayed">
   <rect x="337" y="125" width="35" height="26"/>
   <rect x="79" y="171" width="35" height="25"/>
   <rect x="337" y="171" width="35" height="25"/>
  </g>
  <rect x="204" y="118" width="45" height="28" fill="#d9cf9c"/>
  <path d="m230 121-12 12h10l-5 10 15-15h-11l6-7" fill="#a84c32" stroke="none"/>
  <path d="M19 219v-41m0 9h31m366 32v-41m0 9h31" fill="none"/>
 </g>
 <path d="M0 226h125m217 0h124" stroke="#bac0a5" stroke-width="3"/>
 `;

 const inside=`
 <rect width="466" height="340" fill="#536675"/>
 <path d="M0 215h466v125H0Z" fill="#727b79"/>
 <path d="M0 215h466M233 215v125M110 215 42 340M356 215l68 125M0 272h466"
  stroke="#4c595b" stroke-width="3"/>
 <g stroke="#293d49" stroke-width="3" shape-rendering="crispEdges">
  <path d="M0 29h466M0 48h466M30 0v215M435 0v215" fill="none" stroke="#a5aba0" stroke-width="9"/>
  <path d="M58 0v65h75v37m270-102v64h-66v47" fill="none" stroke="#b79968" stroke-width="7"/>
  <rect x="55" y="83" width="84" height="132" fill="#7c8f91"/>
  <rect x="326" y="83" width="84" height="132" fill="#7c8f91"/>
  <path d="M67 113h60m-60 15h60m-60 15h60m211-30h60m-60 15h60m-60 15h60" stroke="#3a505b"/>
  <rect x="174" y="71" width="117" height="144" fill="#b1aaa0"/>
  <rect x="188" y="87" width="89" height="51" fill="#354d59"/>
  <g fill="#e9c568" class="tp-power-flicker">
   <rect x="198" y="99" width="19" height="12"/>
   <rect x="225" y="99" width="19" height="12"/>
   <rect x="252" y="99" width="15" height="12"/>
  </g>
  <g fill="#a75a43">
   <rect x="194" y="157" width="19" height="36"/>
   <rect x="223" y="157" width="19" height="36"/>
   <rect x="252" y="157" width="19" height="36"/>
  </g>
  <path d="M70 64h68m188 0h79" stroke="#e9d493" stroke-width="7"
   class="tp-power-flicker tp-power-flicker-delayed"/>
 </g>
 <path d="M159 228h146" stroke="#d2ad59" stroke-width="7" stroke-dasharray="16 10"/>
 `;

 function create(kind){
  if(!['outside','inside'].includes(kind))throw Error('Unknown power-plant scene');
  const host=document.createElement('div');
  host.className='tp-power-scene';host.dataset.scene=kind;
  host.setAttribute('aria-hidden','true');
  host.innerHTML='<svg viewBox="0 0 466 340" preserveAspectRatio="xMidYMin slice" '+
   'xmlns="http://www.w3.org/2000/svg">'+
   (kind==='outside'?outside:inside)+'</svg>';
  return host;
 }
 root.TPPowerPlantScene=Object.freeze({create});
})(typeof globalThis!=='undefined'?globalThis:this);
