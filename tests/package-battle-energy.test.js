const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const M=require('../browser_ver/web/collection-model.js');

let energy=80,paid=0,prepares=0,writes=0;
let release,reject,releasePrepare,rejectPrepare;
let tentative=false,attached=false,staged=false;
const finish=[];
const turn=()=>new Promise(setImmediate);

const collection=M.attachCurrent(M.create(),{
 dex:150,level:100,nickname:'Energy-Test',shiny:false,origin:'existing',
 data:{
  stats:{atk:400,def:400,spe:400},
  genes:{atk:100,def:100,spe:100},lifeToken:1
 }
});
const data={
 leaders:Array.from({length:8},(_,id)=>({
  id,name:'Leader',color:'#999',city:'City',badge:'Badge',
  team:[[74,12],[95,14]]
 }))
};

const ctx={
 window:null,console,
 document:{visibilityState:'visible',addEventListener(){}},
 addEventListener(){},
 screen:'arena',choice:'none',tpSaveReplacing:false,tpSaveEpoch:0,
 dragStart:null,dragNow:null,battleReturn:'idle',
 performance:{now:()=>0},
 TPKantoArena:data,
 TPTrainer:{canOpen:()=>true},
 TPCollectionModel:M,
 TPCollection:{read:()=>collection,busy:false,blocked:false},
 TPArenaResult:{
  supported:true,
  prepare(){
   prepares++;
   return new Promise((resolve,reject)=>{
    releasePrepare=resolve;rejectPrepare=reject;
   });
  }
 },
 fns:{wildPromptActive:()=>false},
 TPBattleEnergy:{
  supported:true,
  get view(){
   return {energy,arena:{cost:25,required:45,can:energy>=45?1:0}};
  },
  line:()=>'Energy'
 },
 Module:{
  _tp_wt_arena_attach(){},
  ccall(name,type,types,args=[]){
   if(name==='tp_wt_stage_begin'){
    assert(!tentative);
    assert.equal(args[0],1);
    staged=false;
    return 1;
   }
   if(name==='tp_wt_stage_entry'){
    assert.equal(args[0],0);
    assert.equal(args[1],collection.active);
    staged=true;
    return 1;
   }
   if(name==='tp_energy_arena_begin'){
    assert(!tentative&&staged);
    assert(ctx.tpSaveReplacing);
    if(energy<45)return 0;
    paid++;energy-=25;tentative=true;
    return 8;
   }
   if(name==='tp_wt_arena_attach'){
    assert(tentative&&staged&&!attached);
    assert.equal(args[0],13);
    attached=true;staged=false;
    return 1;
   }
   if(name==='tp_energy_arena_finish'){
    assert(tentative);
    assert.equal(args[0],8);
    finish.push(args[1]);
    if(!args[1]){
     energy+=25;tentative=false;attached=false;
     return 1;
    }
    assert(attached);
    return 13;
   }
   if(name==='tp_f3_get'){
    return [tentative?1:0,0,tentative?13:0,0][args[0]];
   }
   if(name==='tp_f3_mask')return 0;
   throw Error(name);
  },
  _tp_battle_close(){tentative=false;attached=false;staged=false;}
 },
 exportStateBytes:()=>new Uint8Array([energy]),
 TPStoreTools:{
  parseLegacy(bytes){assert.equal(bytes[0],55);}
 },
 writeSave(bytes,force){
  writes++;
  assert(force&&ctx.tpSaveReplacing&&tentative&&attached);
  assert.equal(bytes[0],55);
  return new Promise((resolve,rejectWrite)=>{
   release=resolve;reject=rejectWrite;
  });
 },
 statusEl:{textContent:''}
};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(
 fs.readFileSync('browser_ver/web/arena.js','utf8'),
 ctx,{filename:'arena.js'}
);

(async()=>{
 energy=44;
 assert.equal(await ctx.TPArena.start(0),false);
 assert.equal(paid,0);
 assert.equal(prepares,0);

 // Preparation failure must not debit energy or open native combat.
 energy=80;
 const preparationFailure=ctx.TPArena.start(0);
 assert(ctx.TPArena.busy);
 assert(!ctx.tpSaveReplacing);
 assert.equal(energy,80);
 assert.equal(paid,0);
 rejectPrepare(Error('preparation quota'));
 assert.equal(await preparationFailure,false);
 assert(!ctx.TPArena.busy&&!ctx.tpSaveReplacing&&!tentative);
 assert.equal(energy,80);
 assert.equal(writes,0);

 // Preparation is exclusive, but the paid-start gate is not yet held.
 const first=ctx.TPArena.start(0);
 assert(ctx.TPArena.busy);
 assert(!ctx.tpSaveReplacing);
 assert.equal(energy,80);
 assert.equal(paid,0);
 assert.equal(await ctx.TPArena.start(0),false);

 releasePrepare();
 await turn();
 assert(ctx.TPArena.busy&&ctx.tpSaveReplacing);
 assert.equal(energy,55);
 assert.equal(paid,1);
 assert(tentative&&attached);
 assert.equal(ctx.TPArena.snapshot,null);
 assert.equal(await ctx.TPArena.start(0),false);

 reject(Error('entry quota'));
 assert.equal(await first,false);
 assert.equal(energy,80);
 assert.equal(ctx.screen,'arena');
 assert(!tentative&&!attached);
 assert(!ctx.TPArena.busy&&!ctx.tpSaveReplacing);
 assert.equal(ctx.tpSaveEpoch,2);

 // Retry performs one new debit and publishes only the confirmed token.
 const second=ctx.TPArena.start(0);
 assert(ctx.TPArena.busy&&!ctx.tpSaveReplacing);
 assert.equal(energy,80);
 releasePrepare();
 await turn();
 assert(ctx.TPArena.busy&&ctx.tpSaveReplacing&&energy===55);
 assert.equal(ctx.TPArena.snapshot,null);
 release(true);
 assert.equal(await second,true);
 assert.equal(ctx.screen,'battle');
 assert.equal(energy,55);
 assert.equal(ctx.TPArena.snapshot.token,13);
 assert.equal(ctx.TPArena.snapshot.team,true);
 assert.deepEqual(finish,[0,1]);
 assert.equal(paid,2);
 assert.equal(prepares,3);
 assert.equal(writes,2);
 assert.equal(ctx.tpSaveEpoch,4);
 assert(!ctx.TPArena.busy&&!ctx.tpSaveReplacing);

 // Aborting an already paid session does not refund entry energy.
 assert(ctx.TPArena.abort());
 assert.equal(ctx.screen,'arena');
 assert.equal(ctx.TPArena.snapshot,null);
 assert.equal(energy,55);
 assert(!tentative&&!attached);

 console.log(
  'Energy arena UI passed: reserve gate, exclusive deferred preparation, '+
  'neutral preparation failure, pre-save team attachment, provisional '+
  '25-energy debit, held save gate, exact rollback, durable session token, '+
  'duplicate-start refusal and no abort refund. UI dependency doubles; '+
  'native energy/store transactions tested separately.'
 );
})().catch(error=>{console.error(error);process.exit(1);});
