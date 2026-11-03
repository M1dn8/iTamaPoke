
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/comfort.js','utf8');
function setup({empty=false,deny=false}={}){
 let species=1,saves=0;
 const calls=[],alerts=[],storage=new Map();
 const rules=empty?[]:[
  [2,16,0,0,1,1,1,1,1,1,16],
  [3,32,0,0,0,1,1,1,1,0,32]
 ];
 class E{
  constructor(tag){
   this.tagName=tag;this.children=[];this.className="";this.textContent="";
   this.style={setProperty(k,v){this[k]=v;}};this.dataset={};this.attributes={};
   this.handlers={};this.hidden=false;this.disabled=false;
  }
  appendChild(n){this.children.push(n);n.parentNode=this;return n;}
  append(...nodes){nodes.forEach(n=>this.appendChild(n));}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  before(n){
   const p=this.parentNode;p.children.splice(p.children.indexOf(this),0,n);n.parentNode=p;
  }
  setAttribute(k,v){this.attributes[k]=String(v);}
  getAttribute(k){return this.attributes[k]??null;}
  addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}
  focus(){context.document.activeElement=this;}
  querySelectorAll(selector){
   if(selector===".tp-modal-head button"){
    const h=flat(this).find(n=>n.className==="tp-modal-head");
    return h?h.children.filter(n=>n.tagName==="button"):[];
   }
   return flat(this).filter(n=>n!==this&&n.tagName==="button"&&!n.disabled);
  }
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  async click(){if(!this.disabled)for(const fn of this.handlers.click||[])await fn();}
 }
 const flat=n=>[n,...n.children.flatMap(flat)];
 const body=new E('body'),head=new E('head'),canvas=new E('canvas'),shell=new E('div');
 canvas.id='tp';shell.id='tp-game-shell';body.append(canvas,shell);
 const locales={};
 const context={
  Module:{ccall(name,_return,_types,args=[]){
   calls.push(name);
   if(name==='tp_evo_rule_count')return rules.length;
   if(name==='tp_evo_rule_field')return rules[args[1]][args[2]];
   if(name==='tp_evo_choose'){if(deny)return 0;species=args[0];return 1;}
   throw Error('Unexpected native call: '+name);
  }},
  fns:{speciesId:()=>species,language:()=>3,level:()=>20,bond:()=>80,
   fullness:()=>80,joy:()=>80,energy:()=>80,hygiene:()=>80,
   awaitingStarter:()=>0,isEgg:()=>0,evolvingNow:()=>0,ceremony:()=>0,wildPromptActive:()=>0},
  TP_DEX_META:[1,2,3].map((id,index)=>({
   id,names:{de:['Bisasam','Bisaknosp','Bisaflor'][index],en:['Bulbasaur','Ivysaur','Venusaur'][index]}
  })),
  TPText:{registerLocale(code,entries){locales[code]={...locales[code],...entries};},
   t:key=>locales.de[key]},
  localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},
  document:{body,head,activeElement:null,createElement:t=>new E(t),
   getElementById:id=>flat(body).find(n=>n.id===id)},
  hubDexDesignTokens:()=>({'--tp-pokedex-panel-top':'112px'}),
  screen:'settings',choice:'none',dragStart:null,dragNow:null,feedMenuUntil:0,confirmUntil:0,
  setInterval(){},alert:message=>alerts.push(message),confirm:()=>true,
  saveNow:async()=>{saves++;}
 };
 context.window=context;
if(context.fns){
 if(typeof context.fns.minutesIntoLevel!=='function')context.fns.minutesIntoLevel=()=>30;
 if(typeof context.fns.minutesPerLevel!=='function')context.fns.minutesPerLevel=()=>60;
 if(typeof context.fns.nextLevelLine!=='function')context.fns.nextLevelLine=()=> '30 Min bis zum nächsten Level';
}
if(typeof context.clearInterval!=='function')context.clearInterval=()=>{};
vm.createContext(context);vm.runInContext(source,context);
 context.TPComfort.openEvolution();
 const byId=id=>flat(body).find(n=>n.id===id);
 const byLabel=label=>flat(body).find(n=>n.attributes['aria-label']===label);
 const choose=()=>flat(body).find(n=>n.dataset.evoChoose);
 return {context,calls,alerts,storage,flat,body,byId,byLabel,choose,
  get species(){return species;},get saves(){return saves;}};
}
(async()=>{
 const a=setup();
 assert.equal(a.byId('tp-evolution-goal').dataset.target,'2');
 assert.equal(a.flat(a.body).filter(n=>n.dataset.evoCheck!==undefined).length,5);
 assert.equal(a.choose().disabled,false);
 await a.byId('tp-evolution-next').click();
 assert.equal(a.byId('tp-evolution-goal').dataset.target,'3');
 assert.equal(a.choose().disabled,true);
 assert.equal(a.saves,0);
 await a.byId('tp-evolution-prev').click();
 await a.byLabel('Zielwahl im Hauptspiel').click();
 assert.equal(a.context.TPComfort.autoEvolve(),true);
 assert.equal(a.storage.get('tp-auto-evolve'),'1');
 assert.equal(a.saves,0);
 await a.byLabel('Info').click();
 await a.byLabel('Info').click();
 await a.choose().click();
 assert.equal(a.species,2);
 assert.equal(a.saves,1);
 assert.equal(a.calls.filter(name=>name==='tp_evo_choose').length,1);
 const empty=setup({empty:true});
 assert(!empty.choose());
 assert.equal(empty.byId('tp-evolution-prev').hidden,true);
 assert.equal(empty.byId('tp-evolution-next').hidden,true);
 const denied=setup({deny:true});
 await denied.choose().click();
 assert.equal(denied.species,1);
 assert.equal(denied.saves,0);
 assert.equal(denied.alerts.length,1);
 console.log('UI01 evolution passed: actual comfort renderer, target selection, native flags, disabled action, retained auto preference, original confirmation/choose/save route, refusal refresh and final-stage state. Native/DOM dependencies simulated; no visual acceptance claimed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
