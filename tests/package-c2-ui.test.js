const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const source=fs.readFileSync("browser_ver/web/expedition-planning.js","utf8");
async function controllerTest(fail=false,blocked=false){
 let ctx,undo,finished=null,writes=0,reloads=0;
 let values=[80,80,80,80,20,0,0,0,0,0,0,0,0,255,255,0,0,0,0,0,1,1,1,1,255,0];
 if(blocked){values[9]=1;values[24]=2;values[22]=3;}
 const initial=values.slice();
 const mod={ccall(name,ret,types,args){
  if(name==="tp_c2_get")return values[args[0]];
  if(name==="tp_c2_cost")return ({15:12,30:20,60:32}[args[0]])+(args[1]===4?6:0);
  if(name==="tp_c2_reason")return values[9]?6:0;
  if(name==="tp_c2_can_claim")return values[9]>0&&values[9]<Date.now()/1000&&values[20+values[24]]<3?1:0;
  if(name==="tp_c2_apply"){
   undo=values.slice();const [action,minutes,route,item]=args;
   if(action===0){values[0]-=({15:12,30:20,60:32}[minutes])+(route===4?6:0);values[9]=Math.floor(Date.now()/1000)+minutes*60;values[10]=route;values[12]=minutes;values[24]=1;}
   else if(action===1){if(values[20+values[24]]>=3)return 0;values[14]=values[24];values[20+values[24]]++;values[9]=0;}
   else values[20+item]--;return 1;
  }
  if(name==="tp_c2_finish"){finished=args[0];if(!finished)values=undo;return 1;}
  throw Error(name);
 }};
 ctx={Module:mod,fns:{isEgg:()=>0,evolvingNow:()=>0,ceremony:()=>0,wildPromptActive:()=>0},screen:"card",tpSaveReplacing:false,tpSaveEpoch:0,dragStart:null,dragNow:null,
  document:{querySelectorAll:()=>[],addEventListener(){},createElement(){throw Error("No extra DOM allowed");}},window:{location:{reload(){reloads++;}}},Date,console:{error(){}},exportStateBytes:()=>new Uint8Array([values[0]]),writeSave:async(bytes,force)=>{writes++;assert.equal(force,true);if(fail)throw Error("simulated failure");}
 };
 vm.createContext(ctx);vm.runInContext(source,ctx);const api=ctx.window.TPExpeditions;
 if(blocked){assert.equal(api.view().canClaim,false);await api.use(2);assert.equal(values[22],2);assert.equal(api.view().canClaim,true);await api.claim();assert.equal(values[22],3);assert.equal(values[9],0);assert.equal(reloads,0);return;}
 api.selectRoute(2);await api.start(30);assert.equal(writes,1);assert.equal(ctx.Module,mod);assert.equal(ctx.tpSaveReplacing,false);assert.equal(api.busy,false);assert.equal(reloads,0);assert.equal(ctx.tpSaveEpoch,2);
 if(fail){assert.equal(finished,0);assert.deepEqual(values,initial);}
 else{assert.equal(finished,1);assert.equal(values[0],60);assert.equal(values[10],2);assert.equal(values[12],30);assert.equal(api.view().pending,true);}
}
function extractFunction(text,signature){const a=text.indexOf(signature);assert(a>=0);let p=text.indexOf("{",a)+1,depth=1;while(depth){if(text[p]==="{")depth++;else if(text[p]==="}")depth--;p++;}return text.slice(a,p);}
async function staleAutosaveTest(){
 const main=fs.readFileSync("browser_ver/web/main.js","utf8"),fn=extractFunction(main,"async function writeSave(bytes, force = false)");
 const writes=[];let resolveOld,opens=0;
 const db={transaction(){const tx={objectStore(){return {put(value){writes.push(value);queueMicrotask(()=>tx.oncomplete());}};}};return tx;}};
 const ctx={tpSaveReplacing:false,console,STORE_NAME:"save",SAVE_KEY:"state",openDb(){opens++;return opens===1?new Promise(r=>resolveOld=r):Promise.resolve(db);}};
 vm.createContext(ctx);vm.runInContext("var tpSaveEpoch=0;\n"+fn,ctx);
 const old=ctx.writeSave("stale");ctx.tpSaveReplacing=true;ctx.tpSaveEpoch++;
 await ctx.writeSave("new",true);ctx.tpSaveEpoch++;ctx.tpSaveReplacing=false;
 resolveOld(db);await old;assert.deepEqual(writes,["new"]);
 await ctx.writeSave("fresh");assert.deepEqual(writes,["new","fresh"]);
}
function canvasTest(){
 const text=fs.readFileSync("browser_ver/web/expedition.js","utf8"),tap=extractFunction(text,"function cardExpeditionTap(");const calls=[];
 let pending=false,ready=false;
 const api={busy:false,view:()=>({pending,ready}),selectRoute:i=>calls.push(["route",i]),start:m=>calls.push(["start",m]),claim:()=>calls.push(["claim"]),use:(i,s)=>calls.push(["use",i,s]),tell:()=>{}};
 const ctx={window:{TPExpeditions:api},expeditionTrainChoiceOpen:false,fns:{expeditionItemCount:()=>1,trainStatUsable:()=>1}};vm.createContext(ctx);vm.runInContext(tap,ctx);
 ctx.cardExpeditionTap(200,80);ctx.cardExpeditionTap(210,175);assert.deepEqual(calls,[["route",1],["start",30]]);
 pending=ready=true;ctx.cardExpeditionTap(100,330);ctx.cardExpeditionTap(230,170);assert.deepEqual(calls.slice(-2),[["use",2,undefined],["claim"]]);
 assert(!extractFunction(text,"function drawCardExpedition()").includes("Expeditionen oeffnen"));
}
(async()=>{await controllerTest();await controllerTest(true);await controllerTest(false,true);await staleAutosaveTest();canvasTest();console.log("C2 simple UI passed: direct canvas buttons, no extra DOM/reload, rollback, blocked-inventory use and stale-autosave rejection.");})().catch(e=>{console.error(e);process.exit(1);});
