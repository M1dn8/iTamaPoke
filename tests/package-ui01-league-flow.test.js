
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/league-kanto.js','utf8');
const a=source.indexOf('/* UI01 league flow:');
const b=source.indexOf('function leaguePageNode(',a);
assert(a>=0&&b>a);
let current={teamMode:true,live:1,resolved:1,won:1,index:0},finish;
const mod={};
const c={Number,Promise,Module:mod,region:0,phase:'fight',error:'',
 document:{visibilityState:'visible'},window:{},view:()=>current,
 teamTransaction:()=>new Promise(resolve=>finish=resolve),
 transaction:()=>{throw Error('Unexpected legacy transaction');}};
vm.createContext(c);vm.runInContext(source.slice(a,b),c);
(async()=>{
 for(const index of [1,2,3,4,6,9,11,14,16,19,21,22,23,24,25])
  assert(c.leagueVictoryInsideTrainer(index));
 for(const index of [0,5,10,15,20,26])
  assert(!c.leagueVictoryInsideTrainer(index));
 const task=c.saveWin();
 assert.equal(vm.runInContext('leagueVictory',c),null);
 current={live:0,supported:1,unlocked:1,actor:1,state:1,index:1};
 c.phase='checkpoint';finish(true);await task;
 assert(c.leagueVictoryActive(current));
 c.phase='choose';assert(!c.leagueVictoryActive(current));c.phase='checkpoint';
 c.Module={};assert(!c.leagueVictoryActive(current));c.Module=mod;
 current={teamMode:true,live:1,resolved:1,won:1,index:1};
 const rejected=c.saveWin();finish(false);await rejected;
 assert.equal(vm.runInContext('leagueVictory',c),null);
 console.log('League flow passed: confirmed save only, trainer boundaries, reload phase, module ownership and rejected save.');
})().catch(error=>{console.error(error);process.exitCode=1;});
