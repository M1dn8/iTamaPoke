// UI01 bundled closeout test alignment.
'use strict';
const assert=require('node:assert/strict');
const {setup}=require('./helpers/ui01-egg-planning.cjs');

async function run(fail,unraised){
 const e=setup({fail,unraised});
 const mod=e.context.Module,setCalls=[];
 const originalCall=mod.ccall;
 mod.ccall=function(name,...args){
  if(name==='tp_egg_plan_set')setCalls.push(Array.from(args[2]));
  return originalCall.call(this,name,...args);
 };
 const originalWrite=e.context.writeSave;
 e.context.writeSave=async(bytes,force)=>{
  assert.equal(force,true);
  return originalWrite(bytes,force);
 };
 await e.byLabel('Bevorzugte Generation').click();
 if(!e.byData('eggGeneration',9))
  await e.byId('tp-egg-choice-next').click();
 assert(e.byData('eggGeneration',9));
 await e.byData('eggGeneration',9).click();
 await e.byLabel('Bevorzugter Typ').click();
 await e.byData('eggType',5).click();

 assert.equal(e.state.generation,0);
 assert.equal(e.state.type,0);
 assert.equal(e.state.unraised,unraised);
 assert.equal(e.writes,0);
 await e.byLabel('Plan speichern und neu laden').click();
 assert.equal(e.writes,1);
 assert.deepEqual(setCalls[0],[9,5,unraised?1:0]);

 if(fail){
  assert.deepEqual(setCalls,[[9,5,unraised?1:0],[0,0,unraised?1:0]]);
  assert.equal(e.state.generation,0);
  assert.equal(e.state.type,0);
  assert.equal(e.state.unraised,unraised);
  assert.equal(e.reloads,0);
  assert.equal(e.context.Module,mod);
  assert.equal(e.context.tpSaveReplacing,false);
  assert.equal(e.context.TPEggPlanning.busy,false);
  assert.equal(e.alerts.length,1);
 }else{
  assert.equal(setCalls.length,1);
  assert.equal(e.state.generation,9);
  assert.equal(e.state.type,5);
  assert.equal(e.state.unraised,unraised);
  assert.equal(e.reloads,1);
  assert.equal(e.context.Module,null);
  assert.equal(e.context.tpSaveReplacing,true);
 }
}
(async()=>{
 for(const unraised of [false,true]){
  await run(false,unraised);
  await run(true,unraised);
 }
 console.log('C1 UI passed: actual tile selection, forced save, reload gate, complete rollback and both preserved weighting states.');
})().catch(error=>{console.error(error);process.exitCode=1;});
