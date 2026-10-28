'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('tools/browser-tests/specs/helpers.js','utf8');
const marker='page.evaluate(previous=>{';
const start=source.indexOf(marker);
const end=source.indexOf('\n  },{id:before.id',start);
assert(start>=0&&end>start,'Actual action-effect callback missing');
assert(source.includes('league:before.league'),'League identity must be captured before clicking');
const callback=source.slice(start+'page.evaluate('.length,end+'\n  }'.length);
let checks=0;
function check(expected,changes={},options={}){
 const before={id:7,round:3,league:{region:0,index:4}};
 Object.assign(before.league,options.before||{});
 const state={region:0,index:4,battleId:7,round:3,resolved:0,
  needsSwitch:0,live:1,state:2,done:0,pending:0,...changes};
 const context={
  screen:options.screen||'league',tpSaveReplacing:!!options.gate,
  TPLeague:{state,busy:!!options.busy,diagnostics:{phase:options.phase||'checkpoint'}},
  window:{TPCollection:{busy:false,blocked:!!options.blocked}}
 };
 const evaluate=vm.runInNewContext('('+callback+')',context);
 assert.equal(evaluate(before),expected,JSON.stringify({state,options}));checks++;
}
check(true,{round:4});
check(true,{resolved:1});
check(true,{needsSwitch:1});
check(true,{live:0,battleId:0,round:0,index:5,state:1});
check(true,{region:1,live:0,battleId:0,round:0,index:5,state:1},{before:{region:1}});
check(true,{live:0,battleId:0,round:0,index:0,state:0,done:1},
 {before:{index:25},screen:'hall'});
check(false);
check(false,{live:0,battleId:0,round:0,index:4},{phase:'choose'});
check(false,{live:0,battleId:0,round:0,index:5,state:1},{busy:true});
check(false,{live:0,battleId:0,round:0,index:5,state:1},{gate:true});
check(false,{live:0,battleId:0,round:0,index:5,state:1},{phase:'retry'});
check(false,{live:0,battleId:0,round:0,index:5,state:1},{blocked:true});
check(false,{region:1,live:0,battleId:0,round:0,index:5,state:1});
check(false,{battleId:99,round:4});
console.log('League transition protocol passed: '+checks+' cases; actual helper predicate, simulated league states, no real combat claim.');
