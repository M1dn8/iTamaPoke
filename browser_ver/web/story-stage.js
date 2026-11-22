/* P07a shared review stage: presentation, no save/battle authority. */
(function(root){
 'use strict';
 let active=null;
 const node=(tag,cls,text)=>{
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text!==undefined)n.textContent=text;
  return n;
 };
 function mount(options){
  active?.dispose();
  const host=document.getElementById('tp-game-shell');
  const app=document.getElementById('tp-app-page');
  const external=typeof options.isCurrent==='function';
  if(!host||!app||(!external&&app.hidden)||(external&&!options.isCurrent()))
   throw Error('STORY_STAGE_CONTEXT_MISSING');
  const previous={inert:app.inert,aria:app.getAttribute('aria-hidden')};
  const properties=[];
  if(typeof hubDexDesignTokens==='function')
   for(const [key,value]of Object.entries(hubDexDesignTokens())){
    properties.push([key,host.style.getPropertyValue(key),host.style.getPropertyPriority(key)]);
    host.style.setProperty(key,value);
   }
  const style=node('style');
  style.textContent="#tp-game-shell>#tp-story-stage::before{\n content:\"\";position:absolute;left:10px;top:16px;width:15px;height:15px;\n border:2px solid var(--tp-pokedex-ink);border-radius:50%;\n background:#79c5dc;box-shadow:inset 2px 2px 0 #d9f4fa;\n}\n#tp-game-shell>#tp-story-stage .tp-story-frame-title{\n position:absolute;left:72px;right:72px;top:8px;height:44px;margin:0;\n display:flex;align-items:center;justify-content:center;\n color:var(--tp-pokedex-title);font:700 14px/1 monospace;\n}\n/* UI01 battle detail 2: viewport artwork and contained admission controls. */\n#tp-game-shell>#tp-story-stage .tp-story-frame-title{\n font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\n}\n#tp-game-shell>#tp-story-stage .tp-story-frame-menu{\n position:absolute;left:40px;right:40px;bottom:10px;height:18px;\n margin:0;display:flex;align-items:center;justify-content:center;\n color:var(--tp-pokedex-title);font:700 9px/1 monospace;\n white-space:nowrap;overflow:hidden;\n}\n#tp-game-shell>#tp-story-stage .tp-story-frame-back-slot{\n position:absolute;right:8px;top:8px;width:44px;height:44px;\n}\n#tp-game-shell>#tp-story-stage .tp-story-frame-back-slot>button{\n display:flex;align-items:center;justify-content:center;\n box-sizing:border-box;width:44px;height:44px;min-width:44px;min-height:44px;\n padding:3px;border:1px solid #8196a1;border-radius:6px;\n background:#f6f9fa;color:#292831;\n}\n#tp-game-shell>#tp-story-stage .tp-story-frame-back-slot .tp-nav-back-icon{\n transform:rotate(-90deg);\n}"+`
  #tp-game-shell[data-story-device="true"]{
   position:fixed!important;left:50%!important;top:50%!important;
   right:auto!important;bottom:auto!important;
   transform:translate(-50%,-50%)!important;
   width:min(calc(100vw - 16px),calc(100vh - 16px),466px)!important;
   height:min(calc(100vw - 16px),calc(100vh - 16px),466px)!important;
   max-width:none!important;max-height:none!important;
   aspect-ratio:1!important;margin:0!important;z-index:60
  }
  #tp-game-shell>#tp-story-stage{
   position:absolute;inset:0;z-index:70;box-sizing:border-box;overflow:hidden;
   background:var(--tp-pokedex-shell);
   border:var(--tp-pokedex-frame-border) solid var(--tp-pokedex-ink);
   border-radius:var(--tp-pokedex-frame-radius);
   transform:rotate(90deg);transform-origin:center;
   font:12px/1.2 monospace;color:var(--tp-ink,#292831)
  }
  #tp-story-stage .tp-story-frame{
   position:absolute;
   left:calc(var(--tp-pokedex-inset) - var(--tp-pokedex-frame-border));
   right:calc(var(--tp-pokedex-inset) - var(--tp-pokedex-frame-border));
   top:calc(var(--tp-pokedex-panel-top) - var(--tp-pokedex-frame-border));
   bottom:calc(var(--tp-pokedex-panel-bottom) - var(--tp-pokedex-frame-border))
  }
  #tp-game-shell #tp-story-stage .tp-story-display{
   overflow:hidden;pointer-events:auto
  }
  #tp-story-stage .tp-story-surface{
   position:absolute;left:50%;top:50%;
   width:var(--tp-story-h);height:var(--tp-story-w);
   transform:translate(-50%,-50%) rotate(-90deg);
   box-sizing:border-box;overflow:hidden;min-width:0;min-height:0
  }
  #tp-story-stage .tp-story-copy{
   display:flex;flex-direction:column;gap:4px;padding:5px;
   overflow:auto;scrollbar-width:thin
  }
  #tp-story-stage .tp-story-copy h3{margin:0;font:bold 12px/1.15 monospace}
  #tp-story-stage .tp-story-copy p{margin:0;font:11px/1.2 monospace}
  #tp-story-stage button{font:11px/1.15 monospace;touch-action:manipulation;box-sizing:border-box}
  #tp-story-stage .tp-story-copy button{
   min-height:44px;min-width:44px;margin:0;padding:4px;
   border:1px solid #8196a1;border-radius:5px;background:#f6f9fa;color:#292831
  }
  #tp-story-stage .tp-power-copy{
   display:flex;flex-direction:column;gap:5px;min-height:0
  }
  #tp-story-stage .tp-story-surface>.tp-ice-scene,
  #tp-story-stage .tp-story-surface>.tp-ice-open,
  #tp-story-stage .tp-story-surface>.tp-zapdos-portrait{
   position:absolute!important;inset:0!important;width:100%!important;
   height:100%!important;max-height:none!important;min-height:0!important;
   margin:0!important;padding:0!important;aspect-ratio:auto!important;
   box-sizing:border-box;overflow:hidden
  }
  #tp-story-stage .tp-ice-open>.tp-ice-scene{
   width:100%;height:100%;aspect-ratio:auto
  }
  /* P07a portrait layers inside shared story stage. */
  #tp-story-stage .tp-zapdos-portrait{
   isolation:isolate;flex-shrink:0;
   background:#536675;border:1px solid #6f7874;
   box-sizing:border-box
  }
  #tp-story-stage .tp-zapdos-portrait canvas{
   position:absolute;inset:0;z-index:1;
   display:block;width:100%;height:100%;
   max-width:100%;max-height:100%;
   object-fit:contain;image-rendering:pixelated
  }
  #tp-story-stage .tp-zapdos-challenge{
   position:absolute;inset:0;z-index:3;
   display:block;width:100%;height:100%;
   min-height:0!important;margin:0!important;padding:0!important;
   border:0!important;border-radius:0!important;
   background:transparent!important;box-shadow:none!important;
   transform:none!important;cursor:pointer
  }
  #tp-story-stage .tp-zapdos-challenge:focus-visible{
   outline:3px solid #ffe784!important;outline-offset:-4px
  }
  #tp-story-stage .tp-zapdos-challenge:disabled{cursor:default}
  #tp-story-stage .tp-zapdos-art-status{
   position:absolute;inset:0;z-index:2;
   display:flex;align-items:center;justify-content:center;
   padding:12px;margin:0;text-align:center;
   font-size:12px;line-height:1.35;
   color:#fff8e7;background:rgba(34,48,59,.78);
   box-sizing:border-box
  }
  #tp-story-stage .tp-story-surface>.tp-ice-game-field{
   position:absolute;inset:0;width:100%;height:100%;
   min-height:0;box-sizing:border-box;margin:0
  }
  #tp-story-stage .tp-story-copy>.tp-ice-game{
   display:flex;flex-direction:column;gap:5px;min-height:0;width:100%
  }
  #tp-story-stage .tp-ice-game-row,
  #tp-story-stage .tp-ice-game-feedback{font:11px/1.2 monospace}
  #tp-story-stage .tp-story-frame-back-slot{z-index:5;pointer-events:auto}
  `;
  document.head.append(style);
  const page=node('section');page.id='tp-story-stage';page.dataset.story=options.story;
  page.setAttribute('role','dialog');page.setAttribute('aria-modal','true');
  page.setAttribute('aria-labelledby','tp-story-stage-title');
  const title=node('h2','tp-story-frame-title',options.title);
  title.id='tp-story-stage-title';
  const frame=node('div','tp-story-frame');
  const a=node('div','tp-pokedex-display tp-pokedex-display-left tp-story-display');
  const b=node('div','tp-pokedex-display tp-pokedex-display-right tp-story-display');
  const upper=node('div','tp-story-surface');
  const lower=node('div','tp-story-surface tp-story-copy');
  const spine=node('span','tp-pokedex-spine');spine.setAttribute('aria-hidden','true');
  a.append(upper);b.append(lower);frame.append(a,b,spine);
  const slot=node('div','tp-story-frame-back-slot');
  const back=node('button','','Zurück');back.type='button';
  root.TPNavBack?.decorate(back,root.TPText?.t?.('common.back')||'Zurück');
  slot.append(back);
  page.append(title,frame,node('p','tp-story-frame-menu',options.caption),slot);
  app.inert=true;app.setAttribute('aria-hidden','true');
  host.setAttribute('data-story-device','true');host.append(page);
  let disposed=false,raf=0,size='';
  let observer=null;
  function measure(){
   const value=[a.clientWidth,a.clientHeight,b.clientWidth,b.clientHeight].join('/');
   if(value===size)return;size=value;
   for(const [display,surface]of [[a,upper],[b,lower]]){
    surface.style.setProperty('--tp-story-w',display.clientWidth+'px');
    surface.style.setProperty('--tp-story-h',display.clientHeight+'px');
   }
  }
  function dispose(){
   if(disposed)return;disposed=true;
   root.cancelAnimationFrame(raf);observer?.disconnect();
   document.removeEventListener('keydown',keyboard,true);
   try{options.onDispose?.();}
   finally{
    page.remove();style.remove();host.removeAttribute('data-story-device');
    app.inert=previous.inert;
    if(previous.aria===null)app.removeAttribute('aria-hidden');
    else app.setAttribute('aria-hidden',previous.aria);
    if(!host.hasAttribute('data-battle-device'))
     for(const [key,value,priority]of properties){
      if(value)host.style.setProperty(key,value,priority);
      else host.style.removeProperty(key);
     }
    if(active===api)active=null;
   }
  }
  function close(){
   if(options.canClose&&!options.canClose())return;
   dispose();options.onClose?.();
  }
  function keyboard(event){
   if(event.key==='Escape'){
    event.preventDefault();event.stopImmediatePropagation();close();return;
   }
   if(event.key!=='Tab')return;
   const list=[...page.querySelectorAll('button:not(:disabled),[tabindex="0"]')]
    .filter(n=>n.getClientRects().length&&!n.closest('[hidden]'));
   if(!list.length)return;
   const i=list.indexOf(document.activeElement);
   event.preventDefault();
   list[(i+(event.shiftKey?-1:1)+list.length)%list.length].focus();
  }
  const rect=n=>{
   const r=n.getBoundingClientRect();
   return {x:r.x,y:r.y,width:r.width,height:r.height};
  };
  const api=Object.freeze({
   upper,lower,page,dispose,close,measure,
   state:()=>({
    story:options.story,hull:rect(page),upper:rect(upper),lower:rect(lower),
    lowerOverflow:lower.scrollHeight>lower.clientHeight,
    /* P07a narrative runtime inspection */
    narrative:{
     moduleLoaded:typeof root.TPStoryNarrative?.decorate==='function',
     sourceHasNarrativeCall:
      root.TPSuicuneSourcePreview?.open?.toString().includes('TPStoryNarrative')??false,
     stylePresent:!!document.getElementById('tp-story-narrative-style'),
     lowerElements:[...lower.children].map(n=>({
      tag:n.tagName,classes:n.className,
      text:n.textContent.slice(0,100)
     })),
     input:(()=>{
      const copy=lower.querySelector(':scope > .tp-power-copy')||lower;
      return {
       tags:[...copy.children].map(n=>n.tagName),
       paragraphs:[...copy.children].filter(n=>n.tagName==='P').length,
       buttons:[...copy.children].filter(n=>n.tagName==='BUTTON').length,
       hasGame:!!copy.querySelector('.tp-ice-game,.tp-sui-controls')
      };
     })(),
     cards:[...lower.querySelectorAll('.tp-story-card')].map(n=>{
      const r=n.getBoundingClientRect(),c=getComputedStyle(n);
      const body=n.querySelector('.tp-story-card-body');
      return {
       width:r.width,height:r.height,display:c.display,font:c.font,
       pages:n.dataset.pages,page:n.dataset.page,
       bodyFont:body?getComputedStyle(body).font:null,
       bodyHeight:body?.clientHeight,
       bodyScrollHeight:body?.scrollHeight
      };
     })
    }
   })
  });
  active=api;measure();
  if(typeof ResizeObserver==='function'){
   observer=new ResizeObserver(measure);observer.observe(a);observer.observe(b);
  }
  back.addEventListener('click',close);
  document.addEventListener('keydown',keyboard,true);
  function tick(now){
   if(disposed)return;
   if(!app.isConnected||(!external&&app.hidden)||!page.isConnected||
      (external&&!options.isCurrent())){dispose();return;}
   measure();options.onFrame?.(now);raf=root.requestAnimationFrame(tick);
  }
  raf=root.requestAnimationFrame(tick);
  return api;
 }
 root.TPStoryStage=Object.freeze({
  mount,dispose:()=>active?.dispose(),state:()=>active?.state()||null
 });
})(globalThis);
