'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../../browser_ver/web/egg-planning.js'),'utf8');
function setup({egg=false,fail=false,unraised=false}={}){
 const state={generation:0,type:0,unraised};
 const used={generation:2,type:5,unraised:true};
 let writes=0,reloads=0;
 const alerts=[],calls=[];
 class E{
  constructor(tag){
   this.tagName=tag;this.children=[];this.dataset={};this.attributes={};
   this.style={overflow:"",setProperty(k,v){this[k]=v;}};
   this.handlers={};this.hidden=false;this.disabled=false;
   this.textContent="";this.className="";
  }
  appendChild(n){this.children.push(n);n.parentNode=this;return n;}
  append(...nodes){nodes.forEach(n=>this.appendChild(n));}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  setAttribute(k,v){this.attributes[k]=String(v);}
  getAttribute(k){return this.attributes[k]??null;}
  addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}
  focus(){context.document.activeElement=this;}
  async click(){
   if(this.disabled)return;
   for(const fn of this.handlers.click||[])await fn();
  }
  querySelectorAll(){return flat(this).filter(n=>n.tagName==="button"&&!n.disabled);}
 }
 const flat=n=>[n,...n.children.flatMap(flat)];
 const body=new E('body'),shell=new E('div'),tools=new E('div');
 shell.id='tp-game-shell';body.append(shell,tools);
 const locales={};
 const mod={ccall(name,_return,_types,args=[]){
  calls.push(name);
  if(name==='tp_egg_plan_can_set')return egg?0:1;
  if(name==='tp_egg_plan_set'){
   state.generation=args[0];state.type=args[1];state.unraised=!!args[2];return 1;
  }
  const plan=name.includes('_used_')?used:state;
  if(name.endsWith('_generation'))return plan.generation;
  if(name.endsWith('_type'))return plan.type;
  if(name.endsWith('_unraised'))return Number(plan.unraised);
  throw Error('Unexpected native call: '+name);
 }};
 const context={
  Module:mod,fns:{isEgg:()=>Number(egg),evolvingNow:()=>0,ceremony:()=>0,
   wildPromptActive:()=>0,awaitingStarter:()=>0},
  screen:'settings',tpSaveReplacing:false,dragStart:null,dragNow:null,
  choice:'none',feedMenuUntil:0,confirmUntil:0,
  document:{body,activeElement:null,createElement:t=>new E(t),
   getElementById:id=>flat(body).find(n=>n.id===id),querySelector:()=>tools},
  TPText:{
   registerLocale(code,entries){locales[code]={...locales[code],...entries};},
   t:key=>locales.de[key],language:()=>'de'
  },
  hubDexDesignTokens:()=>({'--tp-pokedex-panel-top':'112px'}),
  setInterval(){},alert:message=>alerts.push(message),console:{error(){}},
  exportStateBytes:()=>new Uint8Array([1,2,3]),
  writeSave:async()=>{writes++;if(fail)throw Error('quota fixture');},
  location:{reload(){reloads++;}}
 };
 context.window=context;vm.createContext(context);vm.runInContext(source,context);
 context.TPEggPlanning.open();
 const byLabel=label=>flat(body).find(n=>n.attributes['aria-label']===label);
 const byClass=name=>flat(body).find(n=>n.className.split(' ').includes(name));
 const byData=(key,value)=>flat(body).find(n=>n.dataset[key]===String(value));
 const byId=id=>flat(body).find(n=>n.id===id);
 return {context,state,used,alerts,calls,flat,body,byLabel,byClass,byData,byId,
  get writes(){return writes;},get reloads(){return reloads;}};
}
module.exports={setup};
