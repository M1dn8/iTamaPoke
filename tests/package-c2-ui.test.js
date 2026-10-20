const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const source=fs.readFileSync("browser_ver/web/expedition-planning.js","utf8");
async function test(mode){
 let ctx,undo=null,finished=0,writes=0,reloads=0;
 let state=[80,80,80,80,20,0,0,0,0,0,0,0,0,255,255,0,0,0,0,0,1,1,1,1,255,0];
 if(mode==="blocked"){state[9]=1;state[24]=2;state[22]=3;}
 const initial=state.slice();
 class Element{
  constructor(tag){this.tagName=tag;this.children=[];this.handlers={};this.style={};this.textContent="";this.disabled=false;}
  appendChild(n){this.children.push(n);return n;}append(...ns){ns.forEach(n=>this.appendChild(n));}replaceChildren(){this.children=[];}
  addEventListener(k,f){(this.handlers[k]??=[]).push(f);}setAttribute(k,v){this[k]=v;}focus(){ctx.document.activeElement=this;}
  querySelectorAll(selector){return flatten(this).filter(n=>["button","select"].includes(n.tagName)&&(!selector.includes(":not")||!n.disabled));}
  async click(){for(const f of this.handlers.click||[])await f({target:this});}
 }
 const flatten=n=>[n,...(n.children||[]).flatMap(flatten)],body=new Element("body");
 const mod={ccall(name,ret,types,args){
  if(name==="tp_c2_get")return state[args[0]];
  if(name==="tp_c2_cost")return ({15:12,30:20,60:32}[args[0]]||255)+(args[1]===4?6:0);
  if(name==="tp_c2_chance")return args[0]===30?22:13;
  if(name==="tp_c2_weight"){const [r,i]=args;return state[20+i]>=3?0:r===i+1?3:1;}
  if(name==="tp_c2_reason")return state[9]?6:0;
  if(name==="tp_c2_can_claim")return state[9]>0&&state[9]<Date.now()/1000&&state[20+state[24]]<3?1:0;
  if(name==="tp_c2_apply"){
   undo=state.slice();const [action,minutes,route,item]=args;
   if(action===0){state[0]-=({15:12,30:20,60:32}[minutes])+(route===4?6:0);state[9]=Math.floor(Date.now()/1000)+minutes*60;state[10]=route;state[12]=minutes;state[24]=1;}
   else if(action===2)state[20+item]--;return 1;
  }
  if(name==="tp_c2_finish"){finished=args[0];if(!finished)state=undo;undo=null;return 1;}
  throw Error(name);
 }};
 ctx={Module:mod,fns:{isEgg:()=>0,evolvingNow:()=>0,ceremony:()=>0,wildPromptActive:()=>0},screen:"card",tpSaveReplacing:false,dragStart:null,dragNow:null,choice:"none",feedMenuUntil:0,confirmUntil:0,expeditionTrainChoiceOpen:false,
  document:{body,activeElement:null,createElement:tag=>new Element(tag)},window:{location:{reload(){reloads++;}}},Date,console:{error(){}},alert(){},confirm:()=>true,setInterval(){},exportStateBytes:()=>new Uint8Array([state[0]]),writeSave:async(raw,force)=>{writes++;assert.equal(force,true);if(mode==="failure")throw Error("simulated storage failure");}
 };
 vm.createContext(ctx);vm.runInContext(source,ctx);ctx.window.TPExpeditions.open();
 let nodes=flatten(body);
 if(mode==="blocked"){
  assert.equal(nodes.find(n=>n.textContent==="Belohnung abholen").disabled,true);
  assert.equal(nodes.find(n=>n.textContent==="Pflege verwenden").disabled,false);
  assert(nodes.some(n=>n.textContent.includes("Die Belohnung bleibt gespeichert")));return;
 }
 const selects=nodes.filter(n=>n.tagName==="select");selects[0].value="2";selects[1].value="30";
 await nodes.find(n=>n.textContent==="Expedition starten").click();assert.equal(writes,1);
 if(mode==="failure"){assert.equal(finished,0);assert.deepEqual(state,initial);assert.equal(reloads,0);assert.equal(ctx.tpSaveReplacing,false);assert.equal(ctx.Module,mod);}
 else{assert.equal(finished,1);assert.equal(state[0],60);assert.equal(state[10],2);assert.equal(state[12],30);assert.equal(reloads,1);assert.equal(ctx.Module,null);assert.equal(ctx.tpSaveReplacing,true);}
}
(async()=>{await test("success");await test("failure");await test("blocked");console.log("C2 UI unit checks passed: durable-action gate, rollback and inventory usable while claim is blocked.");})().catch(e=>{console.error(e);process.exit(1);});
