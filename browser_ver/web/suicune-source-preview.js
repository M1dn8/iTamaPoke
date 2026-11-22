/* P07a visual prototype. No story, save, reward or combat authority. */
(function(root,factory){
 'use strict';
 const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPSuicuneSourcePreview=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
 'use strict';
 const positions=[[0,0],[1,0],[1,1]];
 const steps=[[-1,0],[0,1],[1,0],[0,-1]];
 function trace(rotations){
  const reached=[],visited=new Set();
  let index=0,entry=3;
  for(let turn=0;turn<4;turn++){
   if(visited.has(index))return {connected:reached,solved:false};
   visited.add(index);
   const base=index===2?[1,3]:[0,1];
   const ports=base.map(p=>(p+rotations[index])%4);
   if(!ports.includes(entry))return {connected:reached,solved:false};
   reached.push(index);
   const exit=ports.find(p=>p!==entry);
   if(index===2&&exit===1)return {connected:reached,solved:true};
   const [row,column]=positions[index];
   const nextRow=row+steps[exit][0],nextColumn=column+steps[exit][1];
   const next=positions.findIndex(p=>p[0]===nextRow&&p[1]===nextColumn);
   if(next<0)return {connected:reached,solved:false};
   index=next;entry=(exit+2)%4;
  }
  return {connected:reached,solved:false};
 }
 function createRound(initial=[0,1,1]){
  if(!Array.isArray(initial)||initial.length!==3||
     initial.some(n=>!Number.isInteger(n)||n<0||n>3))
   throw Error('INVALID_WATER_ROTATIONS');
  let rotations=[...initial],moves=0;
  function view(){
   const flow=trace(rotations);
   return Object.freeze({
    rotations:Object.freeze([...rotations]),
    connected:Object.freeze(flow.connected),
    solved:flow.solved,moves
   });
  }
  return Object.freeze({
   view,
   rotate(index){
    if(!Number.isInteger(index)||index<0||index>2||view().solved)return false;
    rotations[index]=(rotations[index]+1)%4;moves++;return true;
   }
  });
 }
 const cases=Object.freeze([
  {name:'01-quelle-entdecken',phase:'intro',rot:[0,1,1]},
  {name:'02-wasserweg-beginnen',phase:'puzzle',rot:[0,1,1]},
  {name:'03-erster-bachabschnitt',phase:'puzzle',rot:[2,1,1]},
  {name:'04-wasser-bis-zur-quelle',phase:'puzzle',rot:[2,0,1]},
  {name:'05-wasserweg-verbunden',phase:'clear',rot:[2,0,0]},
  {name:'06-suicune-am-ufer',phase:'encounter',rot:[2,0,0]},
  {name:'07-gereinigte-quelle',phase:'clear',rot:[2,0,2]},
  {name:'08-ruhige-darstellung',phase:'puzzle',rot:[0,1,1],reduced:true}
 ].map(item=>Object.freeze({...item,rot:Object.freeze(item.rot)})));
 let instance=null,serial=0;
 function dispose(){if(instance)instance.dispose();instance=null;}
 function style(){
  if(document.getElementById('tp-sui-preview-style'))return;
  const s=document.createElement('style');s.id='tp-sui-preview-style';
  s.textContent=`
  .tp-sui-preview{display:flex;flex-direction:column;gap:5px;
   height:100%;min-height:0;min-width:0;box-sizing:border-box;overflow:hidden}
  .tp-sui-preview p,.tp-sui-preview h3{margin:0;line-height:1.2}
  .tp-sui-preview h3{font:700 12px monospace}
  .tp-sui-preview p{font:11px monospace}
  .tp-sui-scene{position:relative;flex:1;min-height:85px;overflow:hidden;
   border-radius:6px;background:#456e66}
  .tp-sui-scene>svg{display:block;width:100%;height:100%}
  .tp-sui-mist{animation:tp-sui-mist 5s ease-in-out infinite alternate}
  @keyframes tp-sui-mist{to{transform:translateX(8px)}}
  .tp-sui-preview[data-reduced="true"] .tp-sui-mist{animation:none}
  @media(prefers-reduced-motion:reduce){.tp-sui-mist{animation:none!important}}
  .tp-sui-prototype{font:9px monospace!important;color:#655d51}
  .tp-sui-board{display:grid;grid-template-columns:repeat(2,minmax(44px,1fr));
   grid-template-rows:48px 48px;gap:4px;min-height:100px}
  .tp-sui-board button{width:100%;height:48px;min-height:48px!important;
   padding:0!important;margin:0!important;box-sizing:border-box;touch-action:manipulation}
  .tp-sui-board button svg{display:block;margin:auto;width:44px;height:44px}
  .tp-sui-board-note{display:flex;align-items:center;justify-content:center;
   font:10px monospace;color:#315b83;text-align:center}
  .tp-sui-preview .tp-sui-action{margin:0!important;padding:4px!important;
   min-height:44px!important;font:11px monospace}
  .tp-sui-portrait{position:absolute;inset:22% 8% 3%;width:84%;height:75%;
   image-rendering:pixelated;pointer-events:none}
  `;
  document.head.append(s);
 }
 function scenery(count,clear,id){
  const trees=[[16,40,.9],[62,8,1.2],[120,18,.8],[180,-4,1.1],
   [260,6,1],[325,25,1.3],[362,60,.9]];
  const wood=trees.map(([x,y,z])=>`<g transform="translate(${x} ${y}) scale(${z})">
   <path d="M-8 0H8V180H-8Z" fill="#5a6551"/>
   <path d="M-38 110 0 0 38 110ZM-33 73 0-18 33 73Z" fill="#305d54"/>
   <path d="M-22 66 0 2 22 66Z" fill="#4a7c68"/></g>`).join('');
  const water=clear?'#6ccbd0':'#8b9a78';
  const paths=['M22 66Q60 55 75 94L100 112',
   'M100 112Q128 128 135 156L156 173',
   'M156 173Q185 201 225 214'];
  return `<svg viewBox="0 0 384 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
   <defs><linearGradient id="${id}" x2="0" y2="1">
   <stop stop-color="#729f92"/><stop offset="1" stop-color="#bdd2ad"/></linearGradient></defs>
   <path fill="url(#${id})" d="M0 0H384V280H0Z"/>
   ${wood}
   <path d="M0 220Q80 152 190 173T384 190V280H0Z" fill="#91b594"/>
   <ellipse cx="244" cy="224" rx="113" ry="44" fill="#547e73"/>
   <ellipse cx="244" cy="218" rx="103" ry="34" fill="${water}"/>
   ${paths.map((d,i)=>`<path d="${d}" fill="none" stroke="#667e68" stroke-width="25" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${i<count?'#87dce0':'#a5b29a'}" stroke-width="14" stroke-linecap="round"/>`).join('')}
   <path d="M178 215q45-13 105 0M200 230q38-7 73 0" fill="none"
    stroke="${clear?'#d8ffff':'#aeb79b'}" stroke-width="3" opacity=".8"/>
   <path d="m121 205 11-18 12 19Zm171 32 12-15 14 18Z" fill="#88927e"/>
   <path d="M45 226q-8-27-15-29m15 29q6-30 17-38M322 224q-2-30 12-39"
    fill="none" stroke="#507b58" stroke-width="4"/>
   <g class="tp-sui-mist" fill="#eef4ed" opacity="${clear?'.10':'.36'}">
    <ellipse cx="85" cy="116" rx="105" ry="18"/><ellipse cx="278" cy="146" rx="127" ry="22"/>
   </g>
   ${clear?'<path d="m278 189 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#f1ffff"/>':''}
   </svg>`;
 }
 function open(number=1){
  if(!Number.isInteger(number)||number<1||number>8)throw Error('INVALID_PREVIEW_CASE');
  dispose();style();
  root.TPAppMenu.show('stories');
  const originalLeft=document.getElementById('tp-stories-page');
  const originalRight=document.getElementById('tp-story-preview');
  if(!originalLeft||!originalRight)throw Error('Existing story displays missing');
  const left=originalLeft.cloneNode(false),right=originalRight.cloneNode(false);
  originalLeft.replaceWith(left);originalRight.replaceWith(right);
  left.hidden=right.hidden=false;
  left.style.cssText=right.style.cssText='min-height:0;min-width:0;height:100%;overflow:hidden';
  const nav=document.getElementById('tp-stories-prev')?.parentElement;
  if(nav){nav.replaceChildren();nav.hidden=true;}
  const heading=document.querySelector('#tp-app-page .tp-app-head h2');
  if(heading)heading.textContent='Die verborgene Quelle';
  const preset=cases[number-1],round=createRound([...preset.rot]);
  let phase=preset.phase,disposed=false,frame=0,portrait=null,lastPaint=-Infinity;
  const id='tp-sui-water-'+(++serial);
  const make=(tag,text,cls)=>{
   const n=document.createElement(tag);if(cls)n.className=cls;
   if(text!==undefined)n.textContent=text;return n;
  };
  const action=(label,fn)=>{
   const b=make('button',label,'tp-sui-action');b.type='button';
   b.addEventListener('click',()=>{if(!disposed){fn();render();}});return b;
  };
  function render(){
   left.replaceChildren();right.replaceChildren();portrait=null;
   const state=round.view(),clear=phase==='clear'||phase==='encounter';
   const a=make('div',undefined,'tp-sui-preview');
   a.dataset.reduced=String(!!preset.reduced);
   const scene=make('div',undefined,'tp-sui-scene');
   scene.innerHTML=scenery(state.connected.length,clear,id);
   if(phase==='encounter'){
    portrait=make('canvas',undefined,'tp-sui-portrait');
    portrait.width=192;portrait.height=160;scene.append(portrait);
    if(typeof ensureSprite==='function')ensureSprite(245);
   }
   a.append(scene,make('p',phase==='intro'?'Ein blauer Schimmer im Nebel.':
    phase==='encounter'?'Am anderen Ufer wartet Suicune.':
    clear?'Die Quelle ist wieder klar.':'Wasser fließt bis zur Unterbrechung.'));
   a.append(make('p','P07a · Vorschau, ohne Speicherung','tp-sui-prototype'));
   const b=make('div',undefined,'tp-sui-preview');
   b.dataset.suiPhase=phase;
   if(phase==='intro'){
    b.append(make('h3','Eine stille Quelle'),
     make('p','Ihr Wasser fließt kaum noch. Verbinde den Bachlauf.'),
     action('Wasserlauf verbinden',()=>{phase='puzzle';}));
   }else if(phase==='puzzle'){
    b.append(make('h3','Verbinde den Bach'));
    const board=make('div',undefined,'tp-sui-board');
    for(let cell=0;cell<4;cell++){
     const index=[0,-1,1,2][cell];
     if(index<0){board.append(make('div','Zur Quelle →','tp-sui-board-note'));continue;}
     const tile=make('button');tile.type='button';tile.dataset.suiTile=String(index);
     tile.setAttribute('aria-label','Bachstück '+(index+1)+' drehen');
     const wet=state.connected.includes(index);
     tile.innerHTML=`<svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="2" y="2" width="60" height="60" rx="9" fill="#c5d3b4"/>
      <g transform="rotate(${state.rotations[index]*90} 32 32)">
      <path d="${index===2?'M0 32H64':'M32 0V20Q32 32 44 32H64'}"
       fill="none" stroke="#84937a" stroke-width="22"/>
      <path d="${index===2?'M0 32H64':'M32 0V20Q32 32 44 32H64'}"
       fill="none" stroke="${wet?'#55b6c8':'#b6c5a8'}" stroke-width="12"/>
      </g></svg>`;
     tile.addEventListener('click',()=>{
      if(disposed)return;
      round.rotate(index);if(round.view().solved)phase='clear';render();
     });
     board.append(tile);
    }
    b.append(board,make('p','Tippen dreht. Kein Zeitlimit.'));
   }else if(phase==='clear'){
    b.append(make('h3','Das Wasser fließt!'),
     make('p','Ein kühler Wind streicht über die Quelle.'),
     action('Zum anderen Ufer',()=>{phase='encounter';}));
   }else{
    b.append(make('h3','Suicune'),
     make('p','Die Begegnung und der Prüfkampf werden im nächsten Schritt angebunden.'));
    const next=action('Prüfkampf noch nicht angebunden',()=>{});
    next.disabled=true;b.append(next);
   }
   left.append(a);right.append(b);
  }
  function paintSprite(now){
   if(!portrait||now-lastPaint<120)return;lastPaint=now;
   const p=portrait.getContext('2d');p.clearRect(0,0,192,160);
   const sprite=typeof spriteFor==='function'?spriteFor(245,false):null;
   const idle=typeof TPAct==='undefined'?0:TPAct.idle;
   const anim=sprite?.actions?.[idle];
   if(!anim){
    p.fillStyle='#254f65';p.font='11px monospace';p.textAlign='center';
    p.fillText('Suicune-Grafik fehlt',96,100);return;
   }
   const image=frameImageData(sprite,idle,preset.reduced?0:frameIndexAt(anim,now,true));
   if(!image)return;
   const buffer=document.createElement('canvas');buffer.width=image.width;buffer.height=image.height;
   buffer.getContext('2d').putImageData(image,0,0);
   const scale=Math.min(176/image.width,148/image.height);
   p.imageSmoothingEnabled=false;
   p.drawImage(buffer,96-image.width*scale/2,156-image.height*scale,
    image.width*scale,image.height*scale);
  }
  function stop(){disposed=true;if(frame)root.cancelAnimationFrame(frame);}
  function tick(now){
   if(disposed)return;
   if(!left.isConnected||!right.isConnected||
      document.getElementById('tp-app-page')?.hidden){stop();return;}
   paintSprite(now);frame=root.requestAnimationFrame(tick);
  }
  instance={dispose:stop,state:()=>({
   prototype:true,case:number,phase,...round.view()
  })};
  render();frame=root.requestAnimationFrame(tick);
  return instance.state();
 }
 return Object.freeze({createRound,cases,open,dispose,state:()=>instance?.state()||null});
});
