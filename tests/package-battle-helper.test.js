 'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('tools/browser-tests/specs/helpers.js','utf8');
let assertions=0;
const expect={poll(callback){return {async toBe(value){
 let actual;
 for(let attempt=0;attempt<8;attempt++){
  actual=await callback();
  if(actual===value){assertions++;return;}
 }
 assert.equal(actual,value,'Simulated poll exhausted');
}};}};
const moduleObject={exports:{}};
vm.runInNewContext(source,{
 require:name=>name==='@playwright/test'?{expect}:require(name),
 module:moduleObject,Buffer
});
async function scenario({initialDelay=0,effectDelay=0,ignore=false,menu='main'}={}){
 const state={id:7,round:0,rests:2,resolved:false,menu};
 const clicks=[];let targetReads=0,effectPending=false;
 function advance(){
  if(effectPending&&!ignore){
   if(effectDelay-->0)return;
   effectPending=false;state.round++;state.rests--;
  }
 }
 const context={
  screen:'battle',tpSaveReplacing:false,
  Module:{ccall(name){
   if(name==='tp_battle_is_open')return 1;
   if(name==='tp_bv_get')return state.id;
   if(name==='tp_battle_rest_uses_left')return state.rests;
   throw Error(name);
  }},
  fns:{battleRound(){advance();return state.round;},battleResolved:()=>false},
  document:{getElementById:()=>({getBoundingClientRect:()=>({left:0,top:0,width:466,height:466})})}
 };
 const ui={
  get current(){
   if(initialDelay-->0)return null;
   return {id:state.id,round:state.round,rests:state.rests,resolved:false,mode:'trainer'};
  },
  get menu(){return state.menu;},
  target(action){
   if(action==='back'&&state.menu==='moves')return {x:329,y:425};
   if(action==='fight'&&state.menu==='main')return {x:137,y:371};
   if(action==='rest'&&state.menu==='main'){
    targetReads++;
    // Subsequent target reads deliberately disappear.
    return targetReads===1?{x:329,y:371}:null;
   }
   return null;
  }
 };
 context.TPBattleView=ui;context.window=context;vm.createContext(context);
 const page={
  evaluate(fn,arg){context.__arg=arg;return Promise.resolve(vm.runInContext('('+fn.toString()+')(__arg)',context));},
  mouse:{async click(x,y){
   clicks.push([x,y]);
   if(y===425){state.menu='main';return;}
   if(x===329&&y===371)effectPending=true;
   else throw Error('Unexpected navigation/click '+x+','+y);
  }},
  once(){throw Error('Unexpected dialog');}
 };
 let error=null;
 try{await moduleObject.exports.battleAction(page,'rest');}
 catch(caught){error=caught;}
 return {state,clicks,targetReads,error};
}
(async()=>{
 for(const options of [{},{initialDelay:2},{effectDelay:3},{menu:'moves'}]){
  const result=await scenario(options);
  assert.equal(result.error,null,result.error?.stack);
  assert.equal(result.state.rests,1);
  assert.equal(result.state.round,1);
  assert.equal(result.clicks.filter(([x,y])=>x===329&&y===371).length,1);
  assert.equal(result.targetReads,1);
 }
 const ignored=await scenario({ignore:true});
 assert(ignored.error,'Missing action effect must fail, not trigger another click');
 assert.equal(ignored.clicks.length,1);
 assert.equal(ignored.state.rests,2);
 console.log('Battle helper protocol passed: one captured target, delayed first frame, delayed action effect, moves-page return and no repeated click on missing effect. Mock protocol only; real combat remains a browser test.');
})().catch(error=>{console.error(error);process.exit(1);});
