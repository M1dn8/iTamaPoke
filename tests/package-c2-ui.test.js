const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const source=fs.readFileSync("browser_ver/web/expedition-planning.js","utf8");
async function controllerTest(route=1,fail=false,blocked=false){
 let undo,finished=null,writes=0,reloads=0;
 let s=[80,80,80,80,20,0,0,0,0,0,0,0,0,255,255,0,0,0,0,0,1,1,1,1,255,0,0];
 if(blocked){s[9]=1;s[10]=2;s[24]=2;s[22]=3;}
 const initial=s.slice(),requests=[];
 const cost=(m,r)=>r>=1&&r<=3&&m===15?12:r===4&&m===30?26:255;
 const mod={ccall(name,ret,types,args){
  if(name==="tp_c2_get")return s[args[0]];
  if(name==="tp_c2_cost")return cost(...args);
  if(name==="tp_c2_reason"){const [m,r]=args;return cost(m,r)===255?1:s[9]?6:s[19+r]>=3?11:0;}
  if(name==="tp_c2_can_claim")return s[9]>0&&s[9]<Date.now()/1000&&s[20+s[24]]<3?1:0;
  if(name==="tp_c2_apply"){
   undo=s.slice();requests.push(args);const [action,m,r,item]=args;
   if(action===0){s[0]-=cost(m,r);s[9]=Math.floor(Date.now()/1000)+m*60;s[10]=r;s[12]=m;s[24]=r-1;s[26]=1;}
   else if(action===1){if(s[20+s[24]]>=3)return 0;s[14]=s[24];s[20+s[24]]++;s[9]=0;s[26]=0;}
   else s[20+item]--;return 1;
  }
  if(name==="tp_c2_finish"){finished=args[0];if(!finished)s=undo;return 1;}
  throw Error(name);
 }};
 const ctx={Module:mod,fns:{isEgg:()=>0,evolvingNow:()=>0,ceremony:()=>0,wildPromptActive:()=>0},screen:"card",tpSaveReplacing:false,tpSaveEpoch:0,dragStart:null,dragNow:null,document:{querySelectorAll:()=>[],addEventListener(){},createElement(){throw Error("No extra DOM allowed");}},window:{location:{reload(){reloads++;}}},Date,console:{error(){}},exportStateBytes:()=>new Uint8Array([s[0]]),writeSave:async(bytes,force)=>{writes++;assert.equal(force,true);if(fail)throw Error("simulated failure");}};
 vm.createContext(ctx);vm.runInContext(source,ctx);const api=ctx.window.TPExpeditions;assert.equal(api.targets.length,4);
 if(blocked){assert.equal(api.view().canClaim,false);await api.use(2);assert.equal(s[22],2);assert.equal(api.view().canClaim,true);await api.claim();assert.equal(s[22],3);assert.equal(s[9],0);assert.equal(reloads,0);return;}
 await api.start(route);assert.equal(writes,1);assert.equal(ctx.Module,mod);assert.equal(ctx.tpSaveReplacing,false);assert.equal(api.busy,false);assert.equal(reloads,0);assert.equal(ctx.tpSaveEpoch,2);
 if(fail){assert.equal(finished,0);assert.deepEqual(s,initial);}
 else{assert.equal(finished,1);assert.equal(requests[0][1],route===4?30:15);assert.equal(s[0],route===4?54:68);assert.equal(s[10],route);assert.equal(s[24],route-1);assert.equal(api.view().pending,true);}
}
function extract(text,sig){const a=text.indexOf(sig);assert(a>=0);let p=text.indexOf("{",a)+1,d=1;while(d){if(text[p]==="{")d++;else if(text[p]==="}")d--;p++;}return text.slice(a,p);}
async function staleAutosaveTest(){
 const main=fs.readFileSync("browser_ver/web/main.js","utf8"),fn=extract(main,"async function writeSave(bytes, force = false)");const writes=[];let resolveOld,opens=0;
 const db={transaction(){const tx={objectStore(){return {put(v){writes.push(v);queueMicrotask(()=>tx.oncomplete());}};}};return tx;}};
 const ctx={tpSaveReplacing:false,console,STORE_NAME:"save",SAVE_KEY:"state",openDb(){return ++opens===1?new Promise(r=>resolveOld=r):Promise.resolve(db);}};
 vm.createContext(ctx);vm.runInContext("var tpSaveEpoch=0;\n"+fn,ctx);const old=ctx.writeSave("stale");ctx.tpSaveReplacing=true;ctx.tpSaveEpoch++;await ctx.writeSave("new",true);ctx.tpSaveEpoch++;ctx.tpSaveReplacing=false;resolveOld(db);await old;assert.deepEqual(writes,["new"]);await ctx.writeSave("fresh");assert.deepEqual(writes,["new","fresh"]);
}
function canvasTest(){
 const text=fs.readFileSync("browser_ver/web/expedition.js","utf8"),calls=[];let pending=false,ready=false;
 const api={busy:false,view:()=>({pending,ready}),start:r=>calls.push(["start",r]),claim:()=>calls.push(["claim"]),use:i=>calls.push(["use",i]),tell(){}};
 const ctx={window:{TPExpeditions:api},expeditionTrainChoiceOpen:false,fns:{expeditionItemCount:()=>1,trainStatUsable:()=>1}};vm.createContext(ctx);vm.runInContext(extract(text,"function cardExpeditionTap("),ctx);
 ctx.cardExpeditionTap(100,100);ctx.cardExpeditionTap(340,185);assert.deepEqual(calls,[["start",1],["start",4]]);
 pending=ready=true;ctx.cardExpeditionTap(100,330);ctx.cardExpeditionTap(230,170);assert.deepEqual(calls.slice(-2),[["use",2],["claim"]]);
 assert(!extract(text,"function drawCardExpedition()").includes("Expeditionen oeffnen"));
}
(async()=>{for(let r=1;r<=4;r++)await controllerTest(r);await controllerTest(1,true);await controllerTest(1,false,true);await staleAutosaveTest();canvasTest();console.log("C2 fixed UI passed: four one-tap missions, exact times/costs, guaranteed item mapping, no extra DOM/reload, rollback and stale-autosave guard.");})().catch(e=>{console.error(e);process.exit(1);});
