const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const source=fs.readFileSync("browser_ver/web/egg-planning.js","utf8");
async function run(fail){
 let context;
 class Element{
  constructor(tag){this.tagName=tag;this.children=[];this.handlers={};this.style={};this.textContent="";this.disabled=false;}
  appendChild(node){this.children.push(node);return node;}append(...nodes){nodes.forEach(n=>this.appendChild(n));}
  replaceChildren(){this.children=[];}setAttribute(key,value){this[key]=value;}
  addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}focus(){context.document.activeElement=this;}
  async click(){for(const fn of this.handlers.click||[])await fn({target:this});}
 }
 const bar=new Element("div"),body=new Element("body");body.appendChild(bar);
 const plan={generation:0,type:0,unraised:0};let reloads=0,writes=0;
 const mod={ccall(name,ret,types,args){
  if(name==="tp_egg_plan_set"){[plan.generation,plan.type,plan.unraised]=args;return 1;}
  if(name==="tp_egg_plan_can_set")return 1;
  if(name.startsWith("tp_egg_used_"))return 0;
  return plan[name.replace("tp_egg_plan_","")];
 }};
 context={Module:mod,fns:{isEgg:()=>0,evolvingNow:()=>0,ceremony:()=>0,wildPromptActive:()=>0,awaitingStarter:()=>0},screen:"idle",tpSaveReplacing:false,dragStart:null,dragNow:null,choice:"none",feedMenuUntil:0,confirmUntil:0,
  document:{body,createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text}),querySelector:()=>bar,activeElement:null},
  console:{error(){}},alert(){},setInterval(){},window:{location:{reload(){reloads++;}}},
  exportStateBytes:()=>new Uint8Array([1]),writeSave:async(raw,force)=>{assert.equal(force,true);writes++;if(fail)throw Error("simulated storage failure");}
 };
 vm.createContext(context);vm.runInContext(source,context);
 function flatten(n){return [n,...(n.children||[]).flatMap(flatten)];}
 const launch=bar.children[0];await launch.click();
 const nodes=flatten(body),selects=nodes.filter(n=>n.tagName==="select");selects[0].value="9";selects[1].value="5";nodes.find(n=>n.type==="checkbox").checked=true;
 await nodes.find(n=>n.textContent==="Plan speichern und neu laden").click();assert.equal(writes,1);
 if(fail){assert.equal(plan.generation,0);assert.equal(plan.type,0);assert.equal(plan.unraised,0);assert.equal(reloads,0);assert.equal(context.Module,mod);assert.equal(context.tpSaveReplacing,false);}
 else{assert.equal(plan.generation,9);assert.equal(plan.type,5);assert.equal(plan.unraised,1);assert.equal(reloads,1);assert.equal(context.Module,null);assert.equal(context.tpSaveReplacing,true);}
}
(async()=>{await run(false);await run(true);console.log("C1 UI unit checks passed: commit/reload gate and rollback on storage failure.");})().catch(e=>{console.error(e);process.exit(1);});
