
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const A=require('../browser_ver/web/action-menu.js');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 let time=0,allowed=true,calls=[];
 const menu=A.create({clock:()=>time,canOpen:()=>allowed,
  invoke:id=>{calls.push(id);return true;}});
 assert(menu.open());
 assert.deepEqual(menu.targets.map(item=>item.id),['games','training','battle','expedition']);
 assert(menu.tap(200,320));await flush();
 assert.deepEqual(calls,['training']);assert.equal(menu.active,false);
 calls=[];assert(menu.open());
 assert(menu.tap(20,200));assert.equal(menu.active,false);assert.deepEqual(calls,[]);
 for(const map of Object.values(A.icons)){
  assert.equal(map.length,16);
  for(const row of map){assert.equal(row.length,16);assert(/^[.kwcCsSrRgGbB]+$/.test(row));}
 }
 menu.open();menu.tap(134,320);await flush();
 assert.deepEqual(calls,['games']);assert(!menu.active);
 allowed=false;assert(!menu.open());allowed=true;
 menu.open();time=6001;assert(!menu.active);
 let resolve;
 const pending=A.create({canOpen:()=>true,
  invoke:()=>new Promise(r=>{resolve=r;})});
 pending.open();pending.tap(134,320);
 assert(pending.busy);assert(!pending.close());assert(!pending.open());
 pending.close(true);resolve(true);await flush();
 assert(!pending.active&&!pending.busy);
 function context(){
  const events={},c={
   console,Date,Math,Object,JSON,Promise,Number,Array,Set,Uint8Array,
   performance:{now:()=>1000},
   document:{visibilityState:'visible',addEventListener:(n,f)=>{events[n]=f;}},
   addEventListener:(n,f)=>{events[n]=f;},
   screen:'activity',cardPage:2,gameMode:0,choice:'none',
   dragStart:null,dragNow:null,holdFired:false,tpSaveReplacing:false,tpSaveEpoch:0,
   fns:{speciesId:()=>1,name:()=>'Test',isEgg:()=>0,ceremony:()=>0,
    evolvingNow:()=>0,wildPromptActive:()=>0},
   TPActivities:{inContext:()=>true},TPDiagnostics:{record(){}},
   ensureSprite(){},playSfx(){},statusEl:{},toScreenSpace:(x,y)=>({x,y}),
   TP:{cx:233,screen:466},UI:{},roundRect(){},drawGameScene:()=>({ink:'#000'}),
   ctx:new Proxy({},{get:()=>()=>{},set:()=>true}),
   Module:{ccall:(name)=>name==='tp_f1_start'?1:name==='tp_f1_get'?0:1,
    _tp_battle_close(){}}
  };
  c.window=c;vm.createContext(c);return {c,events};
 }
 const training=context();
 vm.runInContext(fs.readFileSync('browser_ver/web/battle-training.js','utf8'),training.c);
 assert(!training.c.TPTraining.canStart());
 assert(training.c.TPTraining.canStart('activity'));
 assert(training.c.TPTraining.start(0,1000,'activity'));
 assert.equal(training.c.screen,'game');
 training.c.TPTraining.abort();assert.equal(training.c.screen,'activity');
 training.c.screen='card';training.c.cardPage=4;
 assert(training.c.TPTraining.start(1));training.c.TPTraining.abort();
 assert.equal(training.c.screen,'card');assert.equal(training.c.cardPage,4);
 const trainer=context();
 vm.runInContext(fs.readFileSync('browser_ver/web/battle.js','utf8'),trainer.c);
 assert(!trainer.c.TPTrainer.canOpen());
 assert(trainer.c.TPTrainer.open('activity'));
 trainer.c.TPTrainer.tap(233,390);assert.equal(trainer.c.screen,'activity');
 trainer.c.screen='card';trainer.c.cardPage=4;
 assert(trainer.c.TPTrainer.open());
 trainer.c.TPTrainer.tap(233,390);assert.equal(trainer.c.screen,'card');

 const glyphCommands=[],targetCommands=[];
 const glyphContext={
  UI:{ink:'#111'},rgb565:value=>'rgb565:'+value,
  ctx:{fillStyle:'',fillRect(...args){glyphCommands.push([this.fillStyle,...args]);}},
  target:{fillStyle:'',fillRect(...args){targetCommands.push([this.fillStyle,...args]);}}
 };
 vm.createContext(glyphContext);
 vm.runInContext(fs.readFileSync('browser_ver/web/icons.js','utf8'),glyphContext);
 vm.runInContext("drawIcon(['kr.','w..'],2,3,2)",glyphContext);
 vm.runInContext("drawIconOn(target,['kr.','w..'],2,3,2)",glyphContext);
 assert.equal(glyphCommands.length,3);
 assert.deepEqual(targetCommands,glyphCommands);


 const pageSource=fs.readFileSync('browser_ver/web/activity-pages.js','utf8');
 const previewStart=pageSource.indexOf('function battlePreviewInfo(');
 const previewEnd=pageSource.indexOf('function paintBattlePreview(',previewStart);
 assert(previewStart>=0&&previewEnd>previewStart);
 const care={id:11,dex:1,nickname:'Care',shiny:false};
 const lead={id:22,dex:25,nickname:'Teamstart',shiny:false};
 const roster=Object.freeze({
  active:11,team:Object.freeze([22,11]),
  mons:Object.freeze([care,lead])
 });
 const previewContext={
  root:{TPCollection:{read:()=>roster}},
  view:{selected:'wild'},
  fns:{name:()=>'Care',dexName:id=>'Species '+id}
 };
 vm.createContext(previewContext);
 vm.runInContext(pageSource.slice(previewStart,previewEnd),previewContext);
 let own=previewContext.battlePreviewInfo();
 assert.equal(own.member,lead);assert.equal(own.count,2);
 assert.equal(own.name,'Teamstart');
 previewContext.view.selected='trainer';
 own=previewContext.battlePreviewInfo();
 assert.equal(own.member,care);assert.equal(own.count,1);
 previewContext.view.selected='arena';
 own=previewContext.battlePreviewInfo();
 assert.equal(own.member,lead);assert.equal(own.count,2);
 assert.deepEqual(roster.team,[22,11]);

 const main=fs.readFileSync('browser_ver/web/main.js','utf8');
 const a=main.indexOf('function checkHold(');
 const b=main.indexOf('\ncanvas.addEventListener',a);
 assert(a>=0&&b>a);
 const held=context();
 Object.assign(held.c,{screen:'idle',
  dragStart:{x:233,y:200},dragNow:{x:233,y:200},dragStartAt:0,
  actionTouchOwned:true,confirmUntil:0,feedMenuUntil:0,
  TPActions:{active:false,busy:false}
 });
 vm.runInContext(main.slice(a,b),held.c);
 held.c.checkHold(4000);
 assert.equal(held.c.confirmUntil,0);assert.equal(held.c.holdFired,false);
 held.c.actionTouchOwned=false;held.c.checkHold(4000);
 assert.equal(held.c.confirmUntil,14000);assert.equal(held.c.holdFired,true);
 console.log('UI01 action menu passed: four entries, submenus, outside-tap ownership, expiry, rejected opening, async lock/stale close, real training/trainer activity and legacy card return paths, and held-touch release protection. Native calls mocked; browser proof remains separate.');
})().catch(error=>{console.error(error);process.exit(1);});
