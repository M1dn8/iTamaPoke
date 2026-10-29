/* Shared encounter tap guard. No gameplay or persistence authority. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPStoryTapGuard=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create({
  now=()=>performance.now(),setTimer=setTimeout,
  clearTimer=clearTimeout,onChange=()=>{}
 }={}){
  let active=false,until=0,timer=null;
  const down=new Map(),unbind=[];
  function ready(){
   return !active||(now()>=until&&down.size===0);
  }
  function refresh(){
   if(timer!==null)clearTimer(timer);
   timer=null;
   // One clock sample owns both notification and timer scheduling.
   const sampled=now();
   const isReady=!active||(sampled>=until&&down.size===0);
   onChange(isReady);
   if(active&&sampled<until){
    timer=setTimer(()=>{
     timer=null;refresh();
    },Math.max(1,until-sampled));
   }
  }
  function pointer(type,id,relevant=true){
   if(type==='pointerdown'){
    const fresh=active&&relevant&&ready();
    down.set(id,fresh);
    if(active&&relevant&&!fresh){
     until=Math.max(until,now()+350);refresh();
    }
   }else{
    const fresh=down.get(id);
    down.delete(id);
    if(active){
     if(fresh!==true||now()<until||down.size)
      until=Math.max(until,now()+350);
     refresh();
    }
   }
  }
  function reset(){
   active=false;until=0;
   for(const id of down.keys())down.set(id,false);
   refresh();
  }
  return Object.freeze({
   ready,pointer,reset,
   debug(){
    return Object.freeze({
     active,now:now(),until,ready:ready(),
     held:Object.freeze([...down.keys()])
    });
   },
   arm(){
    active=true;until=now()+650;
    for(const id of down.keys())down.set(id,false);
    refresh();
   },
   bind(doc,visible=()=>true){
    for(const type of ['pointerdown','pointerup','pointercancel']){
     const handler=event=>pointer(type,event.pointerId,visible());
     doc.addEventListener(type,handler,true);
     unbind.push(()=>doc.removeEventListener(type,handler,true));
    }
   },
   dispose(){
    reset();down.clear();
    for(const remove of unbind.splice(0))remove();
   }
  });
 }
 return Object.freeze({create});
});
