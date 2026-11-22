/* Shared review narrative. Original text/actions retained; no story authority. */
(function(root){
 'use strict';
 const locales={
  de:{previous:'Vorheriger Textabschnitt',next:'Nächster Textabschnitt',page:'Textabschnitt {page} von {count}'},
  en:{previous:'Previous passage',next:'Next passage',page:'Passage {page} of {count}'},
  es:{previous:'Pasaje anterior',next:'Siguiente pasaje',page:'Pasaje {page} de {count}'},
  fr:{previous:'Passage précédent',next:'Passage suivant',page:'Passage {page} sur {count}'}
 };
 if(root.TPText?.registerLocale)
  for(const code of ['en','de','es','fr'])
   root.TPText.registerLocale(code,Object.fromEntries(
    Object.entries(locales[code]).map(([key,value])=>['storyNarrative.'+key,value])
   ));
 const text=(key,params={})=>{
  if(root.TPText?.t)return root.TPText.t('storyNarrative.'+key,params);
  return locales.de[key].replace(/\{(\w+)\}/g,(_,name)=>params[name]??'');
 };
 const node=(tag,cls)=>{
  const n=document.createElement(tag);if(cls)n.className=cls;return n;
 };
 function ensureStyle(){
  if(document.getElementById('tp-story-narrative-style'))return;
  const style=node('style');style.id='tp-story-narrative-style';
  style.textContent=`
  #tp-story-stage .tp-story-card{
   display:grid;grid-template-rows:24px minmax(0,1fr) 44px;
   gap:4px;flex:1;min-width:0;min-height:0;width:100%;
   height:100%;box-sizing:border-box;overflow:hidden;
   color:#294b52;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
   background:
    radial-gradient(ellipse at 100% 0%,#ffffff9c,transparent 65%),
    linear-gradient(135deg,#ffffff26,transparent 70%)
  }
  #tp-story-stage .tp-story-card[data-kind="ice"]{color:#344f70}
  #tp-story-stage .tp-story-card-head{
   display:flex;align-items:center;gap:7px;min-width:0
  }
  #tp-story-stage .tp-story-card-sign{
   display:flex;align-items:center;justify-content:center;
   width:24px;height:24px;flex:0 0 24px;border-radius:50%;
   background:#b7ddd85c;color:#387d81
  }
  #tp-story-stage [data-kind="ice"] .tp-story-card-sign{
   color:#507eaa;background:#bbd6ef70
  }
  #tp-story-stage .tp-story-card-sign svg{width:21px;height:21px}
  #tp-story-stage .tp-story-card-head h3{
   margin:0;font:650 12px/1.15 system-ui,-apple-system,sans-serif;
   letter-spacing:.1px;min-width:0
  }
  #tp-story-stage .tp-story-card-body{
   min-width:0;min-height:0;overflow:hidden;white-space:pre-line;
   overflow-wrap:anywhere;padding:2px 2px 0;box-sizing:border-box;
   font:13px/1.35 system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
   background-position:right bottom;background-repeat:no-repeat;
   background-size:68px 46px
  }
  #tp-story-stage [data-kind="water"] .tp-story-card-body{
   background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 60'%3E%3Cg fill='none' stroke='%23498585' opacity='.10' stroke-width='2'%3E%3Cpath d='M5 35q15-12 30 0t30 0t30 0M5 47q15-12 30 0t30 0t30 0'/%3E%3C/g%3E%3C/svg%3E")
  }
  #tp-story-stage [data-kind="ice"] .tp-story-card-body{
   background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 60'%3E%3Cg fill='none' stroke='%23507eaa' opacity='.12' stroke-width='2'%3E%3Cpath d='M63 5v50M42 17l42 26M42 43l42-26M57 11l6 6 6-6M57 49l6-6 6 6'/%3E%3C/g%3E%3C/svg%3E")
  }
  #tp-story-stage .tp-story-card-footer{
   display:grid;grid-template-columns:44px minmax(0,1fr) 44px;
   gap:4px;min-width:0;align-items:stretch
  }
  #tp-story-stage .tp-story-copy .tp-story-card button{
   min-width:44px;min-height:44px;height:44px;
   margin:0;padding:4px;box-sizing:border-box;
   font:600 12px/1.15 system-ui,-apple-system,sans-serif;
   border:1px solid #87a6aa;border-radius:9px;
   color:#315e68;background:#f8fcf4cc;
   box-shadow:inset 0 1px #ffffff
  }
  #tp-story-stage .tp-story-copy [data-kind="ice"] button{
   color:#3d658d;border-color:#99afc2
  }
  #tp-story-stage .tp-story-card button:disabled{
   opacity:.5;cursor:default
  }
  #tp-story-stage .tp-story-card button:focus-visible{
   outline:2px solid #315b83;outline-offset:-3px
  }
  #tp-story-stage .tp-story-card-footer>button svg{width:20px;height:20px}
  #tp-story-stage .tp-story-card-middle{min-width:0;display:flex;align-items:stretch;justify-content:center}
  #tp-story-stage .tp-story-native{min-width:0;width:100%}
  #tp-story-stage .tp-story-copy .tp-story-native>button{width:100%}
  #tp-story-stage .tp-story-dots{
   display:flex;align-items:center;justify-content:center;gap:4px
  }
  #tp-story-stage .tp-story-dots i{
   width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.22
  }
  #tp-story-stage .tp-story-dots i[data-current="true"]{opacity:1}
  #tp-story-stage .tp-story-card[data-pages="1"] .tp-story-card-footer{
   grid-template-columns:minmax(0,1fr)
  }
  #tp-story-stage .tp-story-card[data-pages="1"] .tp-story-card-footer>button{
   display:none
  }
  #tp-story-stage .tp-story-card [hidden]{display:none!important}
  `;
  style.textContent+="\n  /* P07a illustrated ice narrative. */\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-copy:has(.tp-story-card[data-kind=\"ice\"]){\n   padding:0;gap:0;overflow:hidden\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-copy>.tp-power-copy:has(>.tp-story-card[data-kind=\"ice\"]){\n   flex:1;height:100%;min-height:0;gap:0\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-card[data-kind=\"ice\"]{\n   position:relative;padding:8px 11px;gap:4px;\n   grid-template-rows:22px minmax(0,1fr) 44px;\n   background-color:#dcece8;\n   background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20240%20180%22%3E%0A%3Cdefs%3E%0A%20%3ClinearGradient%20id%3D%22cave%22%20x2%3D%220%22%20y2%3D%221%22%3E%0A%20%20%3Cstop%20stop-color%3D%22%23bad9df%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23e8f1ed%22%2F%3E%0A%20%3C%2FlinearGradient%3E%0A%20%3ClinearGradient%20id%3D%22crystal%22%20x2%3D%221%22%20y2%3D%220%22%3E%0A%20%20%3Cstop%20stop-color%3D%22%236ea7bd%22%2F%3E%3Cstop%20offset%3D%22.48%22%20stop-color%3D%22%23ddfaff%22%2F%3E%0A%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2395c4d2%22%2F%3E%0A%20%3C%2FlinearGradient%3E%0A%20%3CradialGradient%20id%3D%22light%22%3E%0A%20%20%3Cstop%20stop-color%3D%22%23f7fbef%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23e8f2e9%22%20stop-opacity%3D%220%22%2F%3E%0A%20%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Cpath%20fill%3D%22url%28%23cave%29%22%20d%3D%22M0%200H240V180H0Z%22%2F%3E%0A%3Cpath%20fill%3D%22%2388b4c3%22%20opacity%3D%22.45%22%0A%20d%3D%22M0%200H240L218%2022%20199%2013%20177%2036%20145%2017%20117%2029%2087%209%2055%2026%2025%2012%200%2034Z%22%2F%3E%0A%3Cellipse%20cx%3D%22119%22%20cy%3D%2277%22%20rx%3D%22111%22%20ry%3D%2276%22%20fill%3D%22url%28%23light%29%22%2F%3E%0A%3Cpath%20fill%3D%22url%28%23crystal%29%22%20d%3D%22M0%200H15L23%2046%2012%2091%2024%20136%2016%20180H0Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23e2faff%22%20opacity%3D%22.8%22%20d%3D%22M2%200H7L14%2046%206%2089%2015%20135%209%20180H2Z%22%2F%3E%0A%3Cpath%20fill%3D%22url%28%23crystal%29%22%20d%3D%22M240%200H223L218%2043%20229%2089%20214%20141%20224%20180H240Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23e4fbff%22%20d%3D%22M235%200H230L226%2044%20235%2089%20222%20141%20231%20180H237Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23d7e9e6%22%20d%3D%22M0%20148%2032%20140%2064%20151%20104%20141%20151%20152%20192%20140%20240%20150V180H0Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23f1f7ee%22%20d%3D%22M0%20163%2047%20153%2092%20162%20137%20156%20182%20164%20222%20151%20240%20159V180H0Z%22%2F%3E%0A%3Cpath%20fill%3D%22url%28%23crystal%29%22%20d%3D%22m8%20157%2010-35%2010%208%208%2039-20%207Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23efffff%22%20d%3D%22m18%20128%204%207%205%2031-9%204Z%22%2F%3E%0A%3Cpath%20fill%3D%22url%28%23crystal%29%22%20d%3D%22m201%20175%2010-31%2010%206%2010%2025Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23eaffff%22%20d%3D%22m212%20149%204%205%205%2018-10-1Z%22%2F%3E%0A%3Cpath%20d%3D%22M44%20169q24-5%2044%200m69%202q17-4%2031-1%22%20fill%3D%22none%22%20stroke%3D%22%23b7d5dc%22%20stroke-width%3D%222%22%2F%3E%0A%3Cg%20fill%3D%22%23fafff7%22%20opacity%3D%22.85%22%3E%0A%20%3Ccircle%20cx%3D%2231%22%20cy%3D%2236%22%20r%3D%221.5%22%2F%3E%3Ccircle%20cx%3D%22206%22%20cy%3D%2257%22%20r%3D%221.5%22%2F%3E%0A%20%3Ccircle%20cx%3D%2222%22%20cy%3D%22104%22%20r%3D%221%22%2F%3E%3Ccircle%20cx%3D%22213%22%20cy%3D%22113%22%20r%3D%221%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E\");\n   background-size:100% 100%;background-repeat:no-repeat;\n   color:#304f64\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-card> :not([hidden]){\n   position:relative;z-index:1\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-card::before{\n   content:\"\";position:absolute;inset:0;pointer-events:none;\n   opacity:.28;\n   background-image:\n    radial-gradient(circle at 15% 26%,#ffffff 1px,transparent 2px),\n    radial-gradient(circle at 86% 64%,#ffffff 1px,transparent 2px);\n   background-size:61px 79px,83px 97px;\n   animation:tp-story-ice-drift 7s linear infinite\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-card-head h3{\n   font:700 12px/1.15 system-ui,-apple-system,sans-serif;\n   color:#35566c;letter-spacing:.1px\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-card-sign{\n   width:22px;height:22px;flex-basis:22px;\n   color:#5285a1;background:#f4ffffab\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-card-body{\n   padding:1px 2px 0;background-image:none;\n   color:#2d4c60;font:13px/1.35 system-ui,-apple-system,sans-serif;\n   text-shadow:0 1px #ffffffa0\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-copy .tp-story-card button{\n   background:#eef8f3e3;color:#3b6380;border-color:#94b7c2;\n   border-radius:11px;box-shadow:inset 0 1px #ffffffc0\n  }\n  #tp-story-stage[data-story=\"articuno\"] .tp-story-copy .tp-story-native>button{\n   background:linear-gradient(180deg,#f4fffaed,#cee4e8ed);\n   border-color:#82aab8;font-weight:700\n  }\n  @keyframes tp-story-ice-drift{\n   from{background-position:0 -8px,0 0}\n   to{background-position:4px 16px,-3px 20px}\n  }\n  #tp-story-stage[data-reduced=\"true\"] .tp-story-card::before{animation:none}\n  @media(prefers-reduced-motion:reduce){\n   #tp-story-stage .tp-story-card::before{animation:none!important}\n  }\n";
  document.head.append(style);
 }
 function decorate(host,options={}){
  const original=[...host.childNodes];
  const elements=[...host.children];
  if(host.querySelector('.tp-ice-game,.tp-sui-controls'))return ()=>{};
  const actions=elements.filter(n=>n.tagName==='BUTTON');
  const paragraphs=elements.filter(n=>n.tagName==='P'&&
    (typeof options.paragraphFilter!=='function'||options.paragraphFilter(n)));
  const heading=elements.find(n=>n.tagName==='H3');
  const full=paragraphs.map(n=>n.textContent).join('\n\n').trim();
  if(!full||actions.length>1)return ()=>{};
  ensureStyle();
  const card=node('section','tp-story-card');
  card.dataset.kind=options.kind||'water';
   if(options.journey)card.dataset.journey='true';
  const stash=node('div');stash.hidden=true;stash.append(...original);
  const header=node('div','tp-story-card-head');
  const sign=node('span','tp-story-card-sign');sign.setAttribute('aria-hidden','true');
  sign.innerHTML=options.kind==='ice'?
   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2v20M3 7l18 10M3 17 21 7M8 4l4 4 4-4M8 20l4-4 4 4M3 11l5-1-1-5M21 13l-5 1 1 5"/></svg>':
   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11Z"/><path d="M9 14q0 3 3 3"/></svg>';
  const title=node('h3');title.textContent=heading?.textContent||options.title||'';
  header.append(sign,title);
  const body=node('div','tp-story-card-body');
  const footer=node('div','tp-story-card-footer');
  const previous=node('button'),next=node('button');
  previous.type=next.type='button';
  previous.dataset.storyPrevious='';next.dataset.storyNext='';
  previous.setAttribute('aria-label',text('previous'));
  next.setAttribute('aria-label',text('next'));
  previous.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>';
  next.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg>';
  const middle=node('div','tp-story-card-middle');
  const native=node('div','tp-story-native');
  native.append(...actions);
  const dots=node('span','tp-story-dots');dots.setAttribute('role','img');
  middle.append(native,dots);footer.append(previous,middle,next);
  card.append(stash,header,body,footer);host.append(card);
  let disposed=false,index=0,pages=[],observer=null;
  function show(){
   if(disposed||!pages.length)return;
   index=Math.max(0,Math.min(index,pages.length-1));
   body.textContent=pages[index];
   body.setAttribute('aria-live','polite');
   card.dataset.pages=String(pages.length);
   card.dataset.page=String(index);
   previous.disabled=index===0;
   next.disabled=index===pages.length-1;
   native.hidden=index!==pages.length-1||actions.length===0;
   dots.hidden=pages.length<=1||!native.hidden;
   dots.setAttribute('aria-label',text('page',{page:index+1,count:pages.length}));
   dots.replaceChildren();
   const start=Math.max(0,Math.min(index-3,pages.length-7));
   for(let i=start;i<Math.min(pages.length,start+7);i++){
    const dot=node('i');dot.dataset.current=String(i===index);dots.append(dot);
   }
  }
  function paginate(){
   if(disposed||!body.clientWidth||!body.clientHeight)return;
   body.setAttribute('aria-live','off');
   const chars=Array.from(full);pages=[];let start=0;
   while(start<chars.length){
    let lo=1,hi=chars.length-start,best=0;
    while(lo<=hi){
     const count=Math.floor((lo+hi)/2);
     body.textContent=chars.slice(start,start+count).join('').trim();
     if(body.scrollHeight<=body.clientHeight){best=count;lo=count+1;}
     else hi=count-1;
    }
    if(!best)best=1;
    let end=start+best;
    if(end<chars.length){
     const candidate=chars.slice(start,end);
     let boundary=-1;
     for(let i=candidate.length-1;i>=0;i--)
      if(/\s/.test(candidate[i])){boundary=i;break;}
     if(boundary>best/2)end=start+boundary+1;
    }
    const passage=chars.slice(start,end).join('').trim();
    if(passage)pages.push(passage);
    start=end;
   }
   if(!pages.length)pages=[''];
   show();
  }
  previous.addEventListener('click',()=>{if(!disposed&&index>0){index--;show();}});
  next.addEventListener('click',()=>{if(!disposed&&index<pages.length-1){index++;show();}});
  if(typeof ResizeObserver==='function'){
   observer=new ResizeObserver(paginate);observer.observe(body);
  }
  paginate();
  return ()=>{
   if(disposed)return;disposed=true;observer?.disconnect();
   if(card.parentNode===host)host.replaceChildren(...original);
  };
 }
 root.TPStoryNarrative=Object.freeze({decorate});
})(globalThis);
