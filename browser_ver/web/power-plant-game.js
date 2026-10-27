/* Transient security challenge; published story progress owns persistence. */
(function(root){
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 #tp-app-page .tp-power-game{
  display:flex;flex-direction:column;gap:6px;
 }
 #tp-app-page .tp-power-game-row{
  display:flex;justify-content:space-between;align-items:center;
  gap:10px;font-size:12px;line-height:1.3;
 }
 #tp-app-page .tp-power-game button{
  touch-action:manipulation;
 }
 `;
 document.head.appendChild(style);

 function create({text,available,complete}){
  let count=0,deadline=0,frame=0,solved=false;
  let pending=false,disposed=false,locked=false,notice='';
  const element=document.createElement('div');
  element.className='tp-power-game';
  const row=document.createElement('div');
  row.className='tp-power-game-row';
  const progress=document.createElement('span');
  progress.className='tp-power-progress';
  progress.setAttribute('aria-live','polite');
  const clock=document.createElement('span');
  clock.className='tp-power-clock';
  clock.setAttribute('role','timer');
  clock.setAttribute('aria-live','off');
  row.append(progress,clock);
  const feedback=document.createElement('p');
  feedback.className='tp-power-feedback';
  feedback.setAttribute('role','status');
  const tap=document.createElement('button');
  tap.type='button';tap.setAttribute('data-security-tap','');
  element.append(row,feedback,tap);

  function refresh(){
   if(disposed)return;
   const value=count+' / 10';
   if(progress.textContent!==value)progress.textContent=value;
   const remaining=deadline?
    Math.max(0,Math.min(5000,deadline-performance.now())):5000;
   const time=solved?text('gameComplete'):
    text('gameTime',{seconds:(Math.ceil(remaining/100)/10).toFixed(1)});
   if(clock.textContent!==time)clock.textContent=time;
   if(feedback.textContent!==notice)feedback.textContent=notice;
   const display=notice?'':'none';
   if(feedback.style.display!==display)feedback.style.display=display;
   const label=text(solved?'retry':'secure');
   if(tap.textContent!==label)tap.textContent=label;
   const disabled=locked||pending||!available();
   if(tap.disabled!==disabled)tap.disabled=disabled;
  }
  function stop(){
   if(frame)cancelAnimationFrame(frame);
   frame=0;deadline=0;
  }
  function reset(expired){
   if(disposed||solved||pending)return;
   stop();count=0;
   notice=expired?text('gameExpired'):'';
   refresh();
  }
  function tick(){
   frame=0;
   if(disposed||!deadline)return;
   if(!element.isConnected||document.visibilityState!=='visible'||
      !available()){
    reset(false);return;
   }
   if(performance.now()>=deadline){reset(true);return;}
   refresh();frame=requestAnimationFrame(tick);
  }
  async function submit(){
   if(disposed||pending||!solved||locked||!available())return;
   pending=true;refresh();
   try{await complete();}
   catch(error){
    try{root.TPDiagnostics?.record('write',error);}catch(_){}
   }finally{pending=false;refresh();}
  }
  tap.addEventListener('keydown',event=>{
   if(event.repeat&&(event.key==='Enter'||event.key===' '))
    event.preventDefault();
  });
  tap.addEventListener('click',()=>{
   if(disposed||pending||locked||!available())return;
   if(solved){void submit();return;}
   const now=performance.now();
   if(deadline&&now>=deadline){reset(true);return;}
   if(!deadline)deadline=now+5000;
   notice='';count++;
   if(count===10){
    solved=true;stop();refresh();void submit();
   }else{
    refresh();
    if(!frame)frame=requestAnimationFrame(tick);
   }
  });
  function visibilityChanged(){
   if(document.visibilityState!=='visible')reset(false);
   else refresh();
  }
  document.addEventListener('visibilitychange',visibilityChanged);

  return Object.freeze({
   attach(host,disabled){
    if(disposed)throw Error('Disposed security challenge');
    locked=!!disabled;host.append(element);refresh();
   },
   dispose(){
    if(disposed)return;
    disposed=true;stop();
    document.removeEventListener('visibilitychange',visibilityChanged);
   },
   get solved(){return solved;}
  });
 }
 root.TPPowerPlantGame=Object.freeze({create});
})(typeof globalThis!=='undefined'?globalThis:this);
