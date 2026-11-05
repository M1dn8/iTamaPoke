'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/league-kanto.js','utf8');
const a=source.indexOf('function leagueCompletionEvidence(');
const b=source.indexOf('function leagueCompletionDecorate(',a);
assert(a>=0&&b>a);
const context={};
vm.createContext(context);
vm.runInContext(source.slice(a,b)+'\nglobalThis.read=leagueCompletionEvidence;',context);

function read(payload,regional=true){
 const calls=[];
 const mod={
  ...(regional?{_tp_region_hall_view(){}}:{_tp_hall_view(){}}),
  ccall(name,type,types,args){
   calls.push({name,type,types:Array.from(types),args:Array.from(args)});
   return JSON.stringify(payload);
  }
 };
 const result=JSON.parse(JSON.stringify(context.read(mod)));
 assert.equal(calls.length,1);
 assert.equal(calls[0].name,regional?'tp_region_hall_view':'tp_hall_view');
 assert.equal(JSON.stringify(calls[0].args),regional?'[0]':'[]');
 return result;
}
for(let mask=0;mask<8;mask++)
 assert.equal(read({supported:1,variants:mask,wins:3}).mask,mask);
assert.equal(read({supported:1,variants:1,wins:3}).mask,1);
assert.equal(read({supported:1,variants:7,wins:3},false).mask,7);
for(const variants of [-1,8,'1',null])
 assert.equal(read({supported:1,variants}).mask,null);
assert.equal(read({supported:0,variants:7}).mask,null);
assert.equal(read({supported:1,variants:0,legacy:1}).legacy,true);
assert.equal(read({supported:1,variants:1,legacy:1}).legacy,false);
assert.equal(context.read({}).mask,null);
assert.equal(context.read({
 _tp_region_hall_view(){},ccall(){throw Error('unreadable');}
}).mask,null);
console.log(
 'League completion evidence passed: all eight masks, explicit Kanto owner, '+
 'legacy fallback, three same-variant wins count once and unreadable data '+
 'not guessed. Actual reader function; native RPC simulated.'
);
