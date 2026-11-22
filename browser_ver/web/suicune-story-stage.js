/* P07a shared-stage source view; existing pure water model retained. */
(function(root){
 'use strict';
 const model=root.TPSuicuneSourcePreview;
 if(!model)throw Error('SOURCE_MODEL_MISSING');
 let instance=null;
 const node=(tag,cls,text)=>{
  const n=document.createElement(tag);
  if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;
 };
 function scenery(state,phase='clear'){
   const clear=phase==='clear'||phase==='encounter';
   const trees=[[4,0,1.1],[35,-10,.75],[72,3,.65],[116,-16,.8],[164,-15,.9],[242,-2,1.2]];
   const wood=trees.map(([x,y,z],i)=>`<g transform="translate(${x} ${y}) scale(${z})">
    <path d="M-4 25H5V123H-4" fill="#65705a"/>
    <path d="M-28 78 0 0 28 78ZM-23 52 0-14 23 52Z"
     fill="${i%2?'#365f54':'#477466'}"/>
    <path d="M-14 42 0 0 14 42" fill="#719581" opacity=".7"/></g>`).join('');
   const paths=[
    'M0 58Q35 47 57 74T78 106',
    'M78 106Q84 139 113 133L141 123',
    'M141 123Q161 116 180 128'
   ];
   return `<svg viewBox="0 0 260 180" preserveAspectRatio="xMidYMid meet"
    role="img" aria-label="Eine Waldquelle mit Bach, Ufersteinen und Bäumen">
    <defs><linearGradient id="tp-source-depth" x2="0" y2="1">
    <stop stop-color="#557f74"/><stop offset="1" stop-color="#c2d6a9"/>
    </linearGradient></defs>
    <path fill="url(#tp-source-depth)" d="M0 0H260V180H0Z"/>
    <path d="M88 0 143 0 210 180 152 180Z" fill="#e5f0bd" opacity=".13"/>
    ${wood}
    <path fill="#9bbd91" d="M0 110Q48 86 109 112T260 105V180H0Z"/>
    <path fill="#86a781" d="M0 151Q50 125 106 158T260 148V180H0Z"/>
    <ellipse cx="193" cy="132" rx="54" ry="29" fill="#5e8577"/>
    <ellipse cx="193" cy="127" rx="47" ry="23"
     fill="${clear?'#80d2cf':'#a5b697'}"/>
    ${paths.map((d,i)=>`
     <path d="${d}" fill="none" stroke="#789774" stroke-width="23" stroke-linecap="round"/>
     <path d="${d}" fill="none" stroke="${state.connected.length>i?'#76c9cc':'#b3bea0'}"
      stroke-width="11" stroke-linecap="round"/>
     ${state.connected.length>i?`<path class="tp-sui-flow" d="${d}"
      fill="none" stroke="#d2faf4" stroke-width="2"/>`:''}
    `).join('')}
    <path d="M0 58Q17 52 32 58" fill="none" stroke="#76c9cc"
     stroke-width="11" stroke-linecap="round"/>
    <path class="tp-sui-flow" d="M0 58Q17 52 32 58"
     fill="none" stroke="#e2ffff" stroke-width="2"/>
    <path d="M166 127q24-7 49 0m-34 11q19-4 33 0"
     fill="none" stroke="${clear?'#e1ffff':'#c9cfb2'}" stroke-width="2"/>
    <path fill="#7b9076" d="m22 157 8-17 19-3 13 17-8 17H29Z"/>
    <path fill="#a6b69a" d="m31 143 15-3 10 11-24 3Z"/>
    <path fill="#81967b" d="m139 157 9-11 14 4 7 17h-32Z"/>
    <path d="M8 174q-2-22-9-30m9 30q4-25 14-36M235 175q-2-22 9-35"
     fill="none" stroke="#567f57" stroke-width="3"/>
    <g class="tp-sui-fog" fill="#edf6e5" opacity="${clear?'.07':'.19'}">
     <ellipse cx="60" cy="91" rx="75" ry="11"/>
     <ellipse cx="213" cy="74" rx="67" ry="13"/>
    </g></svg>`;
  }


 function createScene(){
  const frame=node('div','tp-sui-landscape');
  frame.style.cssText='position:absolute;inset:0;overflow:hidden;background:#4c8278';
  frame.innerHTML=scenery(model.createRound([2,0,0]).view(),'encounter');
  frame.firstElementChild.style.cssText='display:block;width:100%;height:100%';
  return frame;
 }

 /* P07a reusable source narrative theme. */
 const sourceNarrativeTheme="\n  /* P07a living source and directly playable waterbed. */\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-copy{\n   padding:0;gap:0;overflow:hidden;background:#aec7a1\n  }\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-card[data-kind=\"water\"]{\n   position:relative;padding:8px;gap:4px;\n   grid-template-rows:22px minmax(0,1fr) 44px;\n   background-color:#d8e5c5;\n   background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20240%20180%22%3E%0A%3Cdefs%3E%0A%20%3ClinearGradient%20id%3D%22ground%22%20x2%3D%220%22%20y2%3D%221%22%3E%0A%20%20%3Cstop%20stop-color%3D%22%23eef2d9%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23b8d0a5%22%2F%3E%0A%20%3C%2FlinearGradient%3E%0A%20%3ClinearGradient%20id%3D%22water%22%20x2%3D%221%22%20y2%3D%221%22%3E%0A%20%20%3Cstop%20stop-color%3D%22%238ccbd0%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%233c919d%22%2F%3E%0A%20%3C%2FlinearGradient%3E%0A%3C%2Fdefs%3E%0A%3Cpath%20fill%3D%22url%28%23ground%29%22%20d%3D%22M0%200H240V180H0Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23e2eacb%22%20d%3D%22M0%208Q80%2030%20153%203T240%2017V116Q171%20105%2088%20124T0%20105Z%22%2F%3E%0A%3Cpath%20d%3D%22M218-15Q169%2028%20204%2063T193%20114Q163%20150%20211%20192%22%0A%20fill%3D%22none%22%20stroke%3D%22%2387ab88%22%20stroke-width%3D%2248%22%2F%3E%0A%3Cpath%20d%3D%22M218-15Q169%2028%20204%2063T193%20114Q163%20150%20211%20192%22%0A%20fill%3D%22none%22%20stroke%3D%22url%28%23water%29%22%20stroke-width%3D%2232%22%2F%3E%0A%3Cpath%20d%3D%22M213%200Q181%2031%20208%2061M203%2087Q195%20106%20185%20120M188%20143Q186%20157%20204%20177%22%0A%20fill%3D%22none%22%20stroke%3D%22%23ddffff%22%20stroke-width%3D%222%22%20opacity%3D%22.65%22%2F%3E%0A%3Cpath%20fill%3D%22%23769873%22%20d%3D%22M0%20148Q26%20128%2049%20147L63%20180H0ZM219%20149l21-12v43h-28Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23839781%22%20d%3D%22m3%20160%2010-20%2022-4%2021%2017-4%2027H8Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23b0bda2%22%20d%3D%22m13%20144%2022-4%2015%2012-25%205Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23a7b69b%22%20d%3D%22m143%20172%2012-13%2018%205%205%2016h-35Z%22%2F%3E%0A%3Cpath%20fill%3D%22%23c5cfb1%22%20d%3D%22m151%20164%206-3%2012%205-16%203Z%22%2F%3E%0A%3Cg%20fill%3D%22none%22%20stroke%3D%22%236d9468%22%20stroke-width%3D%222%22%3E%0A%20%3Cpath%20d%3D%22M58%20172q-5-18-11-20m11%2020q1-20%2010-28m-10%2028q11-12%2018-12%22%2F%3E%0A%20%3Cpath%20d%3D%22M230%20152q-7-19-12-22m12%2022q0-22%207-28%22%2F%3E%0A%3C%2Fg%3E%0A%3Cg%20fill%3D%22%23f5f7d8%22%20opacity%3D%22.75%22%3E%0A%20%3Ccircle%20cx%3D%22174%22%20cy%3D%2229%22%20r%3D%222%22%2F%3E%3Ccircle%20cx%3D%22184%22%20cy%3D%2276%22%20r%3D%221.5%22%2F%3E%0A%20%3Ccircle%20cx%3D%22164%22%20cy%3D%22119%22%20r%3D%222%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E\");\n   background-size:100% 100%;background-repeat:no-repeat;\n   color:#284d46\n  }\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-card> :not([hidden]){\n   position:relative;z-index:1\n  }\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-card::before{\n   content:\"\";position:absolute;right:8px;top:54%;\n   width:42px;height:19px;pointer-events:none;\n   background:radial-gradient(ellipse,#edffff99,transparent 65%);\n   animation:tp-source-reflection 4s ease-in-out infinite alternate\n  }\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-card-head h3{\n   font:700 12px/1.15 system-ui,-apple-system,sans-serif;\n   color:#31594c;letter-spacing:.1px\n  }\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-card-sign{\n   width:22px;height:22px;flex-basis:22px;\n   color:#357e82;background:#eaffed9c\n  }\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-card-body{\n   padding:1px 2px 0;background-image:none;\n   color:#254a43;font:13px/1.35 system-ui,-apple-system,sans-serif;\n   text-shadow:0 1px #ffffff80\n  }\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-copy .tp-story-card button{\n   border-color:#7e9d7a;background:#eaf2ddde;color:#315b4e;\n   border-radius:12px;box-shadow:inset 0 1px #ffffffa8\n  }\n  #tp-story-stage:is([data-story=\"suicune-preview\"],[data-story=\"suicune\"]) .tp-story-copy .tp-story-native>button{\n   background:linear-gradient(180deg,#e9f2d9eb,#c4d8b6eb);\n   border-color:#6f9578;font-weight:700\n  }\n  #tp-story-stage .tp-sui-bed{\n   position:absolute;left:50%;top:50%;\n   transform:translate(-50%,-50%);\n   width:min(calc(100% - 4px),calc((var(--tp-story-w) - 4px) * 1.3333333333));\n   aspect-ratio:240/180;box-sizing:border-box\n  }\n  #tp-story-stage .tp-sui-bed>svg{\n   position:absolute;inset:0;width:100%;height:100%;display:block\n  }\n  #tp-story-stage .tp-story-copy .tp-sui-bed>button{\n   position:absolute;width:33.3333333333%;height:44.4444444444%;\n   min-width:44px;min-height:44px;\n   margin:0!important;padding:0!important;\n   background:transparent!important;border:0!important;\n   border-radius:32%;box-shadow:none!important;\n   cursor:pointer;touch-action:manipulation\n  }\n  #tp-story-stage .tp-story-copy .tp-sui-bed>button:active{\n   background:#f0ffff40!important\n  }\n  #tp-story-stage .tp-sui-bed>button:focus-visible{\n   outline:2px solid #f5f6cc;outline-offset:-4px\n  }\n  @keyframes tp-source-reflection{\n   from{opacity:.3;transform:translateY(-3px)}\n   to{opacity:.7;transform:translateY(3px)}\n  }\n  #tp-story-stage[data-reduced=\"true\"] .tp-story-card::before{animation:none}\n  @media(prefers-reduced-motion:reduce){\n   #tp-story-stage .tp-story-card::before{animation:none!important}\n  }\n";
 function ensureTheme(){
  if(document.getElementById('tp-source-narrative-theme'))return;
  const style=node('style');style.id='tp-source-narrative-theme';
  style.textContent=sourceNarrativeTheme;document.head.append(style);
  const paper=[...style.sheet.cssRules].find(rule=>
   rule.selectorText?.includes('.tp-story-card[data-kind="water"]')
  );
  if(!paper)throw Error('SOURCE_PAPER_STYLE_MISSING');
  const properties={
   'background-color':'--tp-source-paper-color',
   'background-image':'--tp-source-paper-image',
   'background-size':'--tp-source-paper-size',
   'background-repeat':'--tp-source-paper-repeat'
  };
  const tokens=Object.entries(properties).map(([property,name])=>
   name+':'+paper.style.getPropertyValue(property)+';'
  ).join('');
  style.sheet.insertRule('#tp-game-shell{'+tokens+'}',style.sheet.cssRules.length);
 }
 function dispose(){instance?.dispose();instance=null;model.dispose();}
 /* P07a live source persistence; previews stay read-only. */
 function open(number=1){return openStage(number,false);}
 function openLive(){return openStage(1,true);}
 function openStage(number=1,live=false){
  if(!Number.isInteger(number)||number<1||number>8)throw Error('INVALID_PREVIEW_CASE');
  if(typeof root.TPStoryNarrative?.decorate!=='function')
   throw Error('STORY_NARRATIVE_NOT_LOADED');

  const service=live?root.TPSuicune:null;
   let confirmedStep=0;
   if(live){
    if(!service?.supported)throw Error('SUICUNE_CORE_UNAVAILABLE');
    const access=service.access();
    if(!access.unlocked)throw Error('SUICUNE_LOCKED');
    confirmedStep=service.read().step;
    if(!Number.isInteger(confirmedStep)||confirmedStep<0||confirmedStep>2)
     throw Error('SUICUNE_PREPARATION_CONTEXT_REQUIRED');
   }
   dispose();root.TPAppMenu.show('stories');
  const preset=live?{
    rot:confirmedStep===2?[2,0,0]:[0,1,1],
    phase:['intro','puzzle','clear'][confirmedStep]
   }:model.cases[number-1];
   const round=model.createRound([...preset.rot]);
  let phase=preset.phase,selected=0,portrait=null,lastPaint=-Infinity,disposed=false;
   let busy=false,failure='',fatal=false;
  let releaseNarrative=()=>{};
  const reduced=!!preset.reduced||!!root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const style=node('style');
  style.textContent=`
  #tp-story-stage .tp-sui-landscape{
   position:absolute;inset:0;overflow:hidden;background:#4c8278
  }
  #tp-story-stage .tp-sui-landscape>svg,
  #tp-story-stage .tp-sui-portrait{
   position:absolute;inset:0;width:100%;height:100%;object-fit:contain
  }
  #tp-story-stage .tp-sui-portrait{pointer-events:none;image-rendering:pixelated}
  #tp-story-stage .tp-sui-controls{
   display:grid;grid-template-columns:minmax(132px,1fr) 76px;
   gap:5px;align-items:center;min-height:0
  }
  #tp-story-stage .tp-sui-selectors{display:flex;gap:3px}
  #tp-story-stage .tp-sui-selectors button{flex:1;min-width:44px;height:44px}
  #tp-story-stage button[aria-pressed="true"]{
   background:#d4ece5;outline:2px solid #347b88;outline-offset:-3px
  }
  #tp-story-stage .tp-sui-rotate{
   height:70px;display:flex;flex-direction:column;
   align-items:center;justify-content:center;padding:0!important
  }
  #tp-story-stage .tp-sui-rotate svg{display:block;width:44px;height:44px}
  #tp-story-stage .tp-sui-flow{
   stroke-dasharray:4 13;animation:tp-sui-flowing 1.1s linear infinite
  }
  #tp-story-stage .tp-sui-fog{
   animation:tp-sui-fogging 7s ease-in-out infinite alternate;pointer-events:none
  }
  #tp-story-stage[data-reduced="true"] .tp-sui-flow,
  #tp-story-stage[data-reduced="true"] .tp-sui-fog{animation:none}
  @keyframes tp-sui-flowing{to{stroke-dashoffset:-34}}
  @keyframes tp-sui-fogging{to{transform:translateX(9px)}}
  @media(prefers-reduced-motion:reduce){
   #tp-story-stage .tp-sui-flow,#tp-story-stage .tp-sui-fog{animation:none!important}
  }`;
  ensureTheme();
  style.textContent+=`
   #tp-story-stage[data-sui-mode="live"] .tp-sui-save-state{
    position:absolute;left:7px;right:7px;bottom:5px;z-index:3;
    padding:6px;background:#edf5e5ed;border-radius:8px;
    color:#294f53;box-sizing:border-box
   }
   #tp-story-stage .tp-sui-save-state p{
    margin:0;font:12px/1.3 system-ui,-apple-system,sans-serif
   }
   #tp-story-stage .tp-sui-save-state button{
    width:100%;margin-top:4px;min-height:44px
   }`;
   document.head.append(style);
  const stage=root.TPStoryStage.mount({
   story:'suicune-preview',title:'Die verborgene Quelle',
   caption:live?'Quellenaufgabe':'P07a · Vorschau ohne Speicherung',
   onClose:()=>root.TPAppMenu.show('stories'),
   onDispose:()=>{releaseNarrative();disposed=true;style.remove();},
   onFrame:paintSprite
  });
  stage.page.dataset.reduced=String(reduced);
   stage.page.dataset.suiMode=live?'live':'preview';
  function action(text,fn){
   const b=node('button','',text);b.type='button';b.disabled=busy;
   b.addEventListener('click',()=>{
    if(disposed||busy||!b.isConnected||document.visibilityState!=='visible')return;
    fn();render();
   });return b;
  }

   async function persistStep(actionName){
    if(!live||disposed||busy||fatal)return;
    busy=true;failure='';render();
    try{
     const proof=actionName==='secure'?[...round.view().rotations]:undefined;
     await service.advance(actionName,proof);
     if(disposed)return;
     const expected=actionName==='secure'?2:1;
     if(service!==root.TPSuicune||service.read().step!==expected){
      fatal=true;throw Error('SUICUNE_SOURCE_CONFIRMATION_MISMATCH');
     }
     confirmedStep=expected;
     phase=expected===2?'clear':'puzzle';
    }catch(error){
     fatal=fatal||error.code==='RELOAD_REQUIRED'||!!root.TPCollection?.blocked;
     failure=fatal?
      'Speicherabschluss unklar. Bitte neu laden.':
      'Nicht gespeichert. Bitte erneut versuchen.';
    }finally{
     busy=false;
     if(!disposed)render();
    }
   }
   function appendSaveState(host,puzzle){
    if(!live||(!busy&&!failure))return;
    const container=puzzle?node('div','tp-sui-save-state'):host;
    const message=node('p','',busy?'Wird gespeichert …':failure);
    message.setAttribute('role','status');
    container.append(message);
    if(puzzle&&!busy&&!fatal){
     const retry=action('Speichern erneut versuchen',()=>{void persistStep('secure');});
     retry.dataset.suiSaveRetry='';
     container.append(retry);
    }
    if(puzzle)host.append(container);
   }

   function channel(index,state){
   const d=index===2?'M0 35H70':'M35 0V20Q35 35 50 35H70';
   const wet=state.connected.includes(index),r=state.rotations[index];
   return `<g transform="rotate(${r*90} 35 35)">
    <path d="${d}" fill="none" stroke="#738b70" stroke-width="27" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${wet?'#63c9d4':'#a6b69a'}" stroke-width="15"/>
    ${wet?`<path class="tp-sui-flow" d="${d}" fill="none" stroke="#d2faf4"
    stroke-width="2" style="animation-direction:${r===2||index===1&&r===3?'reverse':'normal'}"/>`:''}
    </g>`;
  }
  function waterbed(state){
   const pieces=[[30,5],[30,85],[110,85]].map(([x,y],i)=>`
    <g transform="translate(${x} ${y})">
     <ellipse cx="40" cy="40" rx="42" ry="38" fill="#b9cda1"/>
     <g transform="scale(1.142857142857)">${channel(i,state)}</g>
    </g>`).join('');
   return `<svg viewBox="0 0 240 180" aria-hidden="true">
    <defs><linearGradient id="tp-bed-ground" x2="0" y2="1">
     <stop stop-color="#d0dfb4"/><stop offset="1" stop-color="#94b48c"/>
    </linearGradient></defs>
    <path fill="url(#tp-bed-ground)" d="M0 0H240V180H0Z"/>
    <path d="M0 45H30M190 125H216" fill="none" stroke="#738b70"
     stroke-width="30" stroke-linecap="round"/>
    <path d="M0 45H30" fill="none" stroke="#63c9d4" stroke-width="17"/>
    <path class="tp-sui-flow" d="M0 45H30" fill="none" stroke="#dcffff" stroke-width="2"/>
    <ellipse cx="215" cy="129" rx="23" ry="29" fill="#698c77"/>
    <ellipse cx="217" cy="126" rx="18" ry="23"
     fill="${state.solved?'#7dd7d7':'#adbf9c'}"/>
    <path d="M190 125H216" fill="none"
     stroke="${state.solved?'#63c9d4':'#a6b69a'}" stroke-width="17"/>
    ${pieces}
    <path fill="#7b9076" d="m4 112 9-16 15 4 5 18-20 8Z"/>
    <path fill="#b3c3a3" d="m13 99 12 3 4 10-17 3Z"/>
    <path fill="#7c9376" d="m131 28 15-13 20 5 6 18-17 10-21-6Z"/>
    <path fill="#b6c7a6" d="m145 19 18 4 4 9-26 3Z"/>
    <path fill="#849a7a" d="m68 172 13-9 17 5 3 12H67Z"/>
    <path d="M5 170q6-19 18-25m-18 25q0-22-5-31M184 52q-4-24 9-40"
     fill="none" stroke="#5e875c" stroke-width="3"/>
    <path d="M206 117q9-4 17 0m-16 17q10-3 16 0"
     fill="none" stroke="#dfedcc" stroke-width="2"/>
    </svg>`;
  }
  function render(){
    if(disposed)return;
   releaseNarrative();releaseNarrative=()=>{};
   const previous=document.activeElement;
   const focusTile=previous?.dataset?.suiTile;
   const state=round.view();
   stage.upper.replaceChildren();stage.lower.replaceChildren();portrait=null;
   stage.page.dataset.suiPhase=phase;
    stage.page.dataset.suiSaving=String(busy);
    stage.page.dataset.suiSaveError=String(!!failure);
   const scene=node('div','tp-sui-landscape');
   scene.innerHTML=scenery(state,phase);stage.upper.append(scene);
   scene.addEventListener('click',event=>{
    if(phase!=='puzzle'||disposed)return;
    const part=event.target.closest('[data-source-section]');
    if(part){selected=Number(part.dataset.sourceSection);render();}
   });
   if(phase==='encounter'){
    portrait=node('canvas','tp-sui-portrait');
    portrait.width=260;portrait.height=180;scene.append(portrait);
    if(typeof ensureSprite==='function')ensureSprite(245);
   }
   if(phase==='intro'){
     const start=action('Wasserlauf verbinden',()=>{
      if(live){void persistStep('investigate');}
      else phase='puzzle';
     });
     start.disabled=busy||(live&&fatal);
     stage.lower.append(node('h3','','Eine stille Quelle'),
      node('p','','Ein blauer Schimmer liegt über dem Wasser. Verbinde den versiegten Bachlauf.'),
      start);
     appendSaveState(stage.lower,false);
    }else if(phase==='puzzle'){
    const bed=node('div','tp-sui-bed');
    bed.setAttribute('role','group');
    bed.setAttribute('aria-label','Verbinde den Bachlauf. Tippe einen Bachabschnitt an, um ihn zu drehen.');
    bed.innerHTML=waterbed(state);
    const positions=[[30,5],[30,85],[110,85]];
    positions.forEach(([x,y],index)=>{
     const tile=action('',()=>{
      selected=index;
      round.rotate(index);
       if(round.view().solved){
        if(live){void persistStep('secure');}
        else phase='clear';
       }
     });
     tile.dataset.suiTile=String(index);
      tile.disabled=live&&(busy||state.solved||fatal);
     tile.setAttribute('aria-label','Bachabschnitt '+(index+1)+' drehen');
     tile.style.left=(x/240*100)+'%';
     tile.style.top=(y/180*100)+'%';
     bed.append(tile);
    });
    appendSaveState(bed,true);
     stage.lower.append(bed);
   }else if(phase==='clear'){
    stage.lower.append(node('h3','','Das Wasser fließt!'),
     node('p','','Die Quelle wird klar. Ein kühler Wind streicht über das Ufer.'),
     action('Zum anderen Ufer',()=>{
       if(live){
        dispose();
        root.TPAppMenu.show('suicune',{encounter:true});
       }else phase='encounter';
      }));
   }else{
    stage.lower.append(node('h3','','Suicune'),
     node('p','','Am anderen Ufer wartet Suicune.'));
    const b=action('Prüfkampf noch nicht angebunden',()=>{});
    b.disabled=true;stage.lower.append(b);
   }
   if(phase==='puzzle'&&focusTile!==undefined){
    stage.lower.querySelector('[data-sui-tile="'+focusTile+'"]')
     ?.focus({preventScroll:true});
   }
   if(phase!=='puzzle')
    releaseNarrative=root.TPStoryNarrative?.decorate(stage.lower,{
     kind:'water',title:'Die verborgene Quelle'
    })||(()=>{});
  }
  const cuts=new WeakMap(),buffer=document.createElement('canvas');
  function paintSprite(now){
   if(!portrait||now-lastPaint<120)return;lastPaint=now;
   const p=portrait.getContext('2d');p.clearRect(0,0,260,180);
   const sprite=typeof spriteFor==='function'?spriteFor(245,false):null;
   const idle=typeof TPAct==='undefined'?0:TPAct.idle;
   const anim=sprite?.actions?.[idle];
   if(!anim){
    p.fillStyle='#173d51';p.font='11px monospace';p.textAlign='center';
    p.fillText('Suicune-Grafik fehlt',185,90);return;
   }
   const image=frameImageData(sprite,idle,reduced?0:frameIndexAt(anim,now,true));
   if(!image)return;
   let cut=cuts.get(image);
   if(cut===undefined){
    let l=image.width,t=image.height,r=-1,b=-1;
    for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)
     if(image.data[(y*image.width+x)*4+3]){
      l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);
     }
    cut=r>=l?{x:l,y:t,w:r-l+1,h:b-t+1}:null;cuts.set(image,cut);
   }
   if(!cut)return;
   buffer.width=image.width;buffer.height=image.height;
   buffer.getContext('2d').putImageData(image,0,0);
   const z=Math.min(114/cut.w,132/cut.h);p.imageSmoothingEnabled=false;
   p.drawImage(buffer,cut.x,cut.y,cut.w,cut.h,
    190-cut.w*z/2,172-cut.h*z,cut.w*z,cut.h*z);
  }
  instance={
   dispose:()=>stage.dispose(),
   state:()=>disposed?null:({
     prototype:!live,case:live?null:number,phase,selected,
     ...(live?{saving:busy,error:failure,confirmedStep}:{}),
     ...round.view()
    })
  };
  render();return instance.state();
 }
 root.TPSuicuneSourcePreview=Object.freeze({
  ...model,open,dispose,state:()=>instance?.state()||null
 });
 root.TPSourceStoryStage=Object.freeze({open,openLive,dispose,createScene,ensureTheme});
})(globalThis);
