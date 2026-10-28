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
   timer=null;onChange(ready());
   if(active&&now()<until){
    timer=setTimer(()=>{
     timer=null;refresh();
    },Math.max(1,until-now()));
   }
  }
  function pointer(type,id){
   if(!active)return;
   if(type==='pointerdown'){
    const fresh=ready();
    down.set(id,fresh);
    if(!fresh){
     until=Math.max(until,now()+350);refresh();
    }
   }else{
    const fresh=down.get(id);
    down.delete(id);
    if(fresh!==true||now()<until||down.size)
     until=Math.max(until,now()+350);
    refresh();
   }
  }
  function reset(){
   active=false;until=0;down.clear();refresh();
  }
  return Object.freeze({
   ready,pointer,reset,
   arm(){
    active=true;until=now()+650;down.clear();refresh();
   },
   bind(doc,visible=()=>true){
    for(const type of ['pointerdown','pointerup','pointercancel']){
     const handler=event=>{
      if(visible())pointer(type,event.pointerId);
     };
     doc.addEventListener(type,handler,true);
     unbind.push(()=>doc.removeEventListener(type,handler,true));
    }
   },
   dispose(){
    reset();
    for(const remove of unbind.splice(0))remove();
   }
  });
 }
 return Object.freeze({create});
});
