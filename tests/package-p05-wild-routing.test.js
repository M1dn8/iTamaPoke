'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
let checks=0;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};

function extract(source,name){
 const start=source.indexOf('function '+name+'(');
 assert(start>=0,'function exists: '+name);
 const open=source.indexOf('{',start);
 let depth=1,end=open+1;
 for(;end<source.length&&depth;end++){
  if(source[end]==='{')depth++;
  else if(source[end]==='}')depth--;
 }
 assert.equal(depth,0,'complete function: '+name);
 return source.slice(start,end);
}

const starts=[];
let dismissed=0,legacy=0;
const context={
 screen:'card',battleReturn:'idle',fns:{battleCanStart:()=>1},
 Module:{
  _tp_wild_dismiss(){dismissed++;},
  _tp_wild_accept(){throw Error('premature legacy prompt start');},
  _tp_battle_start(){legacy++;}
 },
 TPWildTeam:{start:prompt=>{starts.push(prompt);}}
};
context.window=context;
vm.createContext(context);
vm.runInContext(extract(
 fs.readFileSync('browser_ver/web/card.js','utf8'),'cardStatsTap'
),context);
vm.runInContext(extract(
 fs.readFileSync('browser_ver/web/battle.js','utf8'),'wildPromptTap'
),context);

vm.runInContext('cardStatsTap(103,308)',context);
eq(starts,[false]);eq(context.screen,'card');eq(context.battleReturn,'idle');
context.screen='idle';
vm.runInContext('wildPromptTap(200,240)',context);
eq(starts,[false,true]);eq(context.screen,'idle');
vm.runInContext('wildPromptTap(200,300)',context);
eq(dismissed,1);

context.TPWildTeam=null;context.screen='card';
vm.runInContext('cardStatsTap(103,308)',context);
eq(legacy,1);eq(context.screen,'battle');eq(context.battleReturn,'card');

const catalogueContext={
 console,Map,Set,Object,Number,String,Proxy,Reflect,
 fns:{language:()=>3},
 document:{documentElement:{},getElementById:()=>null},
 setInterval(){}
};
catalogueContext.window=catalogueContext;
vm.createContext(catalogueContext);
vm.runInContext(
 fs.readFileSync('browser_ver/web/de-ui.js','utf8'),catalogueContext
);
vm.runInContext(
 fs.readFileSync('browser_ver/web/wild-team.js','utf8'),catalogueContext
);
const T=catalogueContext.TPText;
const keys=Object.keys(T.catalogue('en')).filter(k=>k.startsWith('wildTeam.'));
assert(keys.length>0);
T.clearMissing();
for(const locale of ['en','de','es','fr']){
 eq(Object.keys(T.catalogue(locale)).filter(k=>k.startsWith('wildTeam.')).sort(),
  [...keys].sort());
 for(const key of keys){
  const value=T.t(key,{
   name:'Test',level:21,hp:40,max:100,ready:1,total:2
  },locale);
  assert(!value.includes('{')&&!value.startsWith('wildTeam.'));
  checks++;
 }
}
eq(Array.from(T.missingKeys()),[]);
console.log('P05 wild routing/catalogues passed: '+checks+
 ' assertions; actual manual/prompt handlers delegate without premature '+
 'screen change, dismissal and legacy isolation, four complete new '+
 'catalogues and substituted placeholders. Prompt routing simulation, '+
 'not a real-browser natural encounter.');
