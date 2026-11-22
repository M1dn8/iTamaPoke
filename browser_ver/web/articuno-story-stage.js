/* Review-only layout adapter. Existing controller and DOM handlers retained. */
(function(root){
 'use strict';
 let current=null;

 /* P07a existing admission finale in the story stage. */
 function ensureFinaleStyle(story='articuno'){
  const id='tp-'+story+'-stage-finale-style';
  if(document.getElementById(id))return;
  const original=[...document.querySelectorAll('style')].find(
   n=>n.textContent.includes('@keyframes tp-zapdos-absorb')
  );
  if(!original?.sheet)throw Error('ARKTOS_FINALE_STYLE_NOT_LOADED');
  const scope='#tp-story-stage[data-story="'+story+'"][data-story-finale="true"]';
  const relevant=/\.tp-zapdos-(?:finale-(?:art|caption|note)|portrait|capture-ball|ball-top|ball-center)\b/;
  const css=[...original.sheet.cssRules]
   .filter(rule=>!rule.selectorText||relevant.test(rule.selectorText))
   .map(rule=>rule.cssText
    .replace(/#tp-app-page\s+:is\([^)]*\)\.tp-zapdos-finale/g,scope)
    .replace(/#tp-app-page/g,scope))
   .join('\n');
  const style=document.createElement('style');style.id=id;
  style.textContent=css+`
   ${scope} .tp-zapdos-finale-art{
    display:flex;flex-direction:column;
    width:100%;height:100%;min-height:0;min-width:0;
    box-sizing:border-box;overflow:hidden
   }
   ${scope} .tp-zapdos-finale-art>.tp-zapdos-portrait{
    position:relative;inset:auto;flex:1 1 0;
    width:100%;height:auto;min-height:32px;aspect-ratio:auto
   }
  `;
  document.head.append(style);
 }

 function open(options={}){
   const profile={
    story:'articuno',pageId:'tp-articuno-page',title:'Arktos',
    kind:'ice',introTitle:root.TPArktosText.t('introTitle'),
    ...options
   };
  current?.dispose();
  if(profile.story==='suicune')root.TPSourceStoryStage.ensureTheme();
   const body=document.getElementById(profile.pageId);
  if(!body)throw Error('ARKTOS_STORY_NOT_MOUNTED');
  let stage,observer,disposed=false,original=[];
  let releaseNarrative=()=>{};
  const fields=new WeakMap();
   /* P07a source finale feedback stays in the lower display. */
   let feedbackObserver=null,finaleFeedback=[];
   function restoreFinaleFeedback(){
    feedbackObserver?.disconnect();feedbackObserver=null;
    for(const item of finaleFeedback)item.art.append(...item.nodes);
    finaleFeedback=[];
   }
   function refreshNarrative(finale=false){
    if(disposed)return;
    releaseNarrative();releaseNarrative=()=>{};
    if(stage.lower.querySelector('.tp-ice-game'))return;
    const copy=stage.lower.querySelector(':scope > .tp-power-copy')||stage.lower;
    const options={kind:profile.kind,title:profile.introTitle};
    if(profile.story==='suicune'&&finale&&finaleFeedback.length){
     options.journey=true;
     const caption=finaleFeedback[0].nodes.find(
      n=>n.classList.contains('tp-zapdos-finale-caption')
     );
     const journeyText=root.TPSuicuneText.t('journeyText');
     const captured=caption?.textContent===root.TPSuicuneText.t('finaleCaptured');
     const levelText=root.TPSuicuneText.t('level');
     options.paragraphFilter=n=>{
      if(n.textContent===levelText)return false;
      if(n.textContent===journeyText)
       return captured||!caption?.textContent.trim();
      if(n===caption)return !captured;
      if(n.classList.contains('tp-zapdos-finale-note')&&n.style.display==='none')
       return false;
      return true;
     };
    }
    releaseNarrative=root.TPStoryNarrative?.decorate(copy,options)||(()=>{});
   }
  function distribute(){
   if(disposed||!body.isConnected)return;
   const nodes=[...body.children];if(!nodes.length)return;
    const finale=nodes.some(n=>n.matches('.tp-zapdos-finale-art'));
    if(finale)ensureFinaleStyle(profile.story);
    stage.page.dataset.storyFinale=String(finale);
   releaseNarrative();releaseNarrative=()=>{};
    restoreFinaleFeedback();
    if(profile.story==='suicune'&&finale){
     for(const art of nodes.filter(n=>n.matches('.tp-zapdos-finale-art'))){
      const feedback=[...art.children].filter(n=>
       n.matches('.tp-zapdos-finale-caption,.tp-zapdos-finale-note')
      );
      finaleFeedback.push({art,nodes:feedback});
     }
    }
    original=nodes;
   stage.upper.replaceChildren();stage.lower.replaceChildren();
   for(const n of nodes){
    if(n.matches('.tp-ice-game')){
     const field=n.querySelector('.tp-ice-game-field')||fields.get(n);
     if(field){fields.set(n,field);stage.upper.append(field);}
     stage.lower.append(n);
    }else if(n.matches('.tp-ice-scene,.tp-ice-open,.tp-zapdos-portrait,.tp-zapdos-finale-art')){
     stage.upper.append(n);
    }else stage.lower.append(n);
   }
   for(const item of finaleFeedback)stage.lower.append(...item.nodes);
    refreshNarrative(finale);
    if(finaleFeedback.length){
     feedbackObserver=new MutationObserver(()=>{
      if(!disposed)refreshNarrative(true);
     });
     for(const item of finaleFeedback)
      for(const feedback of item.nodes)
       feedbackObserver.observe(feedback,{
        childList:true,subtree:true,characterData:true,
        attributes:true,attributeFilter:['style','hidden']
       });
    }
  }
  function restore(){
   if(disposed)return;disposed=true;observer?.disconnect();releaseNarrative();restoreFinaleFeedback();
   for(const n of original){
    const field=fields.get(n);
    if(field&&!n.contains(field))
     n.insertBefore(field,n.querySelector('.tp-ice-game-feedback'));
   }
   body.append(...original);
   if(current?.stage===stage)current=null;
  }
  stage=root.TPStoryStage.mount({
   story:profile.story,title:profile.title,
    caption:profile.story==='suicune'?profile.introTitle:'Bestehende Geschichte',
   onClose:()=>root.TPAppMenu.show('stories'),onDispose:restore,
   onFrame:()=>{if(!body.isConnected)stage.dispose();}
  });
  observer=new MutationObserver(distribute);
  observer.observe(body,{childList:true});
  current={stage,body,dispose:()=>stage.dispose()};
  distribute();return stage.state();
 }
 function resume(body,options={}){
   const pageId=options.pageId||'tp-articuno-page';
  Promise.resolve().then(()=>{
   const app=document.getElementById('tp-app-page');
   if(!body?.isConnected||!app||app.hidden||
      document.getElementById(pageId)!==body)return;
   if(current?.body===body&&current.stage.page.isConnected)return;
   open(options);
  }).catch(error=>{
   try{root.TPDiagnostics?.record('manager',error);}catch(_){}
   console.error('P07a Storybühnen-Rückkehr',error);
  });
 }
 root.TPArticunoStoryStage=Object.freeze({
  open,resume,dispose:()=>current?.dispose()
 });
})(globalThis);
