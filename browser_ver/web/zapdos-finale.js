/* Cosmetic admission ceremony. No writes, capture rolls or new individuals. */
(function(root){
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-finale{
  flex:1 1 0;min-height:0;gap:6px;
  overflow:hidden!important;padding-bottom:0!important;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-finale>h3{
  flex:0 0 auto;font-size:clamp(12px,3.4vw,16px);line-height:1.15;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-finale>p{
  flex:0 0 auto;font-size:11px;line-height:1.2;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-finale .tp-zapdos-finale-art{
  display:flex;flex-direction:column;flex:1 1 0;
  min-height:0;gap:4px;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-finale .tp-zapdos-portrait{
  flex:1 1 0;min-height:32px;aspect-ratio:auto;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-finale .tp-zapdos-portrait canvas{
  object-fit:contain;
 }
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-finale .tp-zapdos-finale-caption,
 #tp-app-page :is(#tp-zapdos-page,#tp-articuno-page,#tp-moltres-page,#tp-mewtwo-page,#tp-mew-page).tp-zapdos-finale .tp-zapdos-finale-note{
  flex:0 0 auto;margin:0;font-size:11px;line-height:1.2;
 }
 #tp-app-page .tp-zapdos-finale-art .tp-zapdos-portrait canvas{
  transform-origin:50% 62%;
 }
 #tp-app-page .tp-zapdos-capture-ball{
  position:absolute;left:50%;top:62%;z-index:3;
  width:42px;height:42px;border:3px solid #29343c;
  border-radius:50%;overflow:hidden;box-sizing:border-box;
  background:#f7f2e5;opacity:0;
  transform:translate(-50%,-50%);
 }
 #tp-app-page .tp-zapdos-ball-top{
  position:absolute;inset:0 0 50%;background:#d85449;
  border-bottom:3px solid #29343c;
  transform-origin:0 100%;
 }
 #tp-app-page .tp-zapdos-ball-center{
  position:absolute;left:50%;top:50%;width:12px;height:12px;
  transform:translate(-50%,-50%);
  background:#f7f2e5;border:3px solid #29343c;
  border-radius:50%;box-sizing:border-box;
 }
 #tp-app-page .tp-zapdos-finale-art[data-capture="playing"]
  canvas[data-ready="true"]{
  animation:tp-zapdos-absorb 7.2s linear both;
 }
 #tp-app-page .tp-zapdos-finale-art[data-capture="playing"]
  .tp-zapdos-capture-ball{
  animation:tp-zapdos-capture-ball 7.2s linear both;
 }
 #tp-app-page .tp-zapdos-finale-art[data-capture="playing"]
  .tp-zapdos-ball-top{
  animation:tp-zapdos-ball-open 7.2s linear both;
 }
 #tp-app-page .tp-zapdos-finale-art[data-capture="done"] canvas{
  opacity:0;
 }
 #tp-app-page .tp-zapdos-finale-art[data-capture="done"]
  .tp-zapdos-capture-ball{
  opacity:1;transform:translate(-50%,-50%);
 }
 #tp-app-page .tp-zapdos-finale-caption,
 #tp-app-page .tp-zapdos-finale-note{
  margin:6px 0 0;text-align:center;font-size:12px;line-height:1.35;
 }
 @keyframes tp-zapdos-absorb{
  0%,18%{opacity:1;transform:scale(1)}
  42%,100%{opacity:0;transform:scale(.02)}
 }
 @keyframes tp-zapdos-capture-ball{
  0%,8%{opacity:0;transform:translate(-220%,100%) rotate(-60deg);filter:none}
  25%,49%{opacity:1;transform:translate(-50%,-50%) rotate(0)}
  53%{opacity:1;transform:translate(-50%,-50%) rotate(-13deg)}
  57%{opacity:1;transform:translate(-50%,-50%) rotate(13deg)}
  61%,62%{opacity:1;transform:translate(-50%,-50%) rotate(0)}
  66%{opacity:1;transform:translate(-50%,-50%) rotate(-13deg)}
  70%{opacity:1;transform:translate(-50%,-50%) rotate(13deg)}
  74%,75%{opacity:1;transform:translate(-50%,-50%) rotate(0)}
  79%{opacity:1;transform:translate(-50%,-50%) rotate(-13deg)}
  83%{opacity:1;transform:translate(-50%,-50%) rotate(13deg)}
  87%,94%{opacity:1;transform:translate(-50%,-50%) rotate(0);filter:none}
  96%{opacity:1;transform:translate(-50%,-50%) rotate(0);
   filter:brightness(1.9) drop-shadow(0 0 9px #ffe784)}
  99%,100%{opacity:1;transform:translate(-50%,-50%) rotate(0);filter:none}
 }
 @keyframes tp-zapdos-ball-open{
  0%,20%{transform:translateY(0) rotate(0)}
  26%,39%{transform:translateY(-7px) rotate(-12deg)}
  46%,100%{transform:translateY(0) rotate(0)}
 }
 @media(prefers-reduced-motion:reduce){
  #tp-app-page .tp-zapdos-finale-art *{animation:none!important}
 }
 `;
 document.head.appendChild(style);

 function create(text,options={}){
  let disposed=false,timer=0;
  const element=document.createElement('div');
  element.className='tp-zapdos-finale-art';
  element.dataset.capture='loading';
  const portrait=root.TPZapdosPortrait.create(text,options);
  const ball=document.createElement('span');
  ball.className='tp-zapdos-capture-ball';
  ball.setAttribute('aria-hidden','true');
  ball.innerHTML='<span class="tp-zapdos-ball-top"></span>'+
   '<span class="tp-zapdos-ball-center"></span>';
  portrait.element.append(ball);

  const caption=document.createElement('p');
  caption.className='tp-zapdos-finale-caption';
  caption.setAttribute('role','status');
  const note=document.createElement('p');
  note.className='tp-zapdos-finale-note';
  note.style.display='none';
  element.append(portrait.element,caption,note);
  const motion=root.matchMedia('(prefers-reduced-motion: reduce)');

  function settle(){
   if(disposed)return;
   if(timer)clearTimeout(timer);
   timer=0;element.dataset.capture='done';
   caption.textContent=text('finaleCaptured');
  }
  function animationEnded(event){
   if(event.target===ball&&event.animationName==='tp-zapdos-capture-ball')
    settle();
  }
  function visibilityChanged(){
   if(document.visibilityState!=='visible'&&
      element.dataset.capture==='playing')settle();
  }
  function preferenceChanged(){
   if(motion.matches&&element.dataset.capture==='playing')settle();
  }
  ball.addEventListener('animationend',animationEnded);
  document.addEventListener('visibilitychange',visibilityChanged);
  motion.addEventListener('change',preferenceChanged);

  portrait.ready.then(()=>{
   if(disposed||!element.isConnected)return;
   const canvas=portrait.element.querySelector('canvas');
   const missing=canvas.dataset.ready!=='true';
   const status=portrait.element.querySelector('.tp-zapdos-art-status');
   if(status)status.style.display='none';
   if(missing){
    note.textContent=text('finaleArtMissing');
    note.style.display='';
   }
   if(missing||motion.matches||document.visibilityState!=='visible'){
    settle();return;
   }
   caption.textContent=text('finaleAnimating');
   element.dataset.capture='playing';
   timer=setTimeout(settle,8000);
  });

  return Object.freeze({
   element,
   dispose(){
    if(disposed)return;
    disposed=true;
    if(timer)clearTimeout(timer);
    timer=0;portrait.dispose();
    ball.removeEventListener('animationend',animationEnded);
    document.removeEventListener('visibilitychange',visibilityChanged);
    motion.removeEventListener('change',preferenceChanged);
   }
  });
 }
 root.TPZapdosFinale=Object.freeze({create});
})(typeof globalThis!=='undefined'?globalThis:this);
