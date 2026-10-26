 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');

function context(){
 const words=[];
 const ctx=new Proxy({},{
  get(target,key){return key in target?target[key]:(()=>{});},
  set(target,key,value){target[key]=value;return true;}
 });
 ctx.fillText=s=>words.push(String(s));
 const c={
  window:null,console,ctx,words,UI:{ink:'#222',white:'#fff',track:'#aaa',
   barBad:'#900',barOK:'#090'},roundRect(){},
  document:{visibilityState:'visible',addEventListener(){}},
  addEventListener(){},screen:'arena',choice:'none',
  tpSaveReplacing:false,tpSaveEpoch:0,dragStart:null,dragNow:null,
  performance:{now:()=>0},queueMicrotask,confirm:()=>true,
  statusEl:{textContent:''},fns:{dexName:d=>'Species '+d},
  spriteFor:()=>null,megaSpriteFor:()=>null,
  TPAct:{idle:0},TPText:{t:key=>key},
  TPWildTeam:{text:key=>key},TPCollection:{busy:false,blocked:false},
  TPBattleView:{drawLeague(){},tapLeague(){return 'member1';}},
  location:{reload(){}}
 };
 c.window=c;
 vm.createContext(c);
 vm.runInContext(fs.readFileSync(
  'browser_ver/web/league-kanto-data.js','utf8'
 ),c);
 return c;
}
function load(c,path){vm.runInContext(fs.readFileSync(path,'utf8'),c);}
function teamView(){
 return {
  kind:'empty',supported:1,unlocked:1,done:0,state:0,live:0,
  actor:1,variant:0,index:0,resolved:0,won:0,battleId:1,
  active:0,needsSwitch:0,hp:100,maxHp:100,rests:5,
  enemyHp:100,enemyMaxHp:100,dex:87,level:54,
  playerDex:150,playerLevel:30,form:0,shiny:0,nick:'Care',
  atk:100,def:100,spe:100,round:0,
  members:[
   {id:1,dex:150,level:30,nick:'Care',hp:100,maxHp:100},
   {id:2,dex:25,level:30,nick:'Box',hp:100,maxHp:100}
  ]
 };
}
(async()=>{
 const c=context(),calls=[];
 let v=teamView(),failWin=false;
 c.Module={
  _tp_lg_view(){},_tp_lgt_view(){},
  ccall(name,type,types,args){
   calls.push([name,args]);
   if(name==='tp_lgt_view')return JSON.stringify(v);
   if(name==='tp_lgt_switch')return 1;
   if(name==='tp_lgt_abort'){v.live=0;return 1;}
   if(name==='tp_lg_view')return JSON.stringify({supported:1,live:0});
   throw Error(name);
  }
 };
 c.TPLeagueCollection={
  supported:true,
  async prepare(){calls.push(['prepare']);},
  async start(region,variant,replace){
   calls.push(['start',region,variant,replace]);
   v={...v,kind:'team',live:1,state:2};
  },
  async resume(){v={...v,live:1,state:2};},
  async complete(){
   if(failWin)throw Error('quota');
   v={...v,live:0,state:1,index:1,resolved:0,won:0};
  }
 };
 let source=fs.readFileSync('browser_ver/web/league-kanto.js','utf8');
 source=source.replace('window.TPLeague=Object.freeze({',
  'window.__league={start,resume,saveWin,teamTransaction};'+
  'window.TPLeague=Object.freeze({');
 vm.runInContext(source,c);
 assert(c.TPLeague.open());
 await c.__league.start();
 assert(calls.some(row=>row[0]==='prepare'));
 assert(calls.some(row=>row[0]==='start'&&row[1]===0));
 assert.equal(c.TPLeague.state.teamMode,true);
 c.TPLeague.tap(1,1);
 assert(calls.some(row=>row[0]==='tp_lgt_switch'&&
  row[1][0]===0&&row[1][1]===1));
 v={...v,resolved:1,won:1};
 failWin=true;
 assert.equal(await c.__league.saveWin(),false);
 assert.equal(c.TPLeague.diagnostics.phase,'retry');
 assert.equal(v.live,1);
 failWin=false;
 assert.equal(await c.__league.saveWin(),true);
 assert.equal(c.TPLeague.diagnostics.phase,'checkpoint');
 assert(!c.TPLeague.busy);

 // Existing 88-byte runs stay on the legacy view path.
 v={kind:'legacy'};
 c.Module.ccall=(name)=>{
  if(name==='tp_lgt_view')return JSON.stringify(v);
  if(name==='tp_lg_view')return JSON.stringify({
   supported:1,state:1,live:0,actor:1,index:1
  });
  throw Error(name);
 };
 assert.equal(c.TPLeague.state.teamMode,undefined);
 assert.equal(c.TPLeague.state.state,1);

 // The shared renderer receives the actual ordered team and forced-switch flag.
 const b=context();
 b.screen='league';
 load(b,'browser_ver/web/battle-view.js');
 const forced={...teamView(),teamMode:true,live:1,state:2,
  needsSwitch:1,hp:0};
 forced.members[0].hp=0;
 b.TPBattleView.drawLeague(forced);
 assert.equal(b.TPBattleView.current.wildTeam.needsSwitch,true);
 assert.equal(b.TPBattleView.teamIndicators.player[0].ready,false);
 assert.equal(b.TPBattleView.teamIndicators.player[1].ready,true);
 assert(b.TPBattleView.target('member1'));
 assert.equal(b.TPBattleView.target('member0'),null);

 // Hall navigation uses captured members, not today's care snapshot.
 const h=context();h.screen='league';
 const records=[{
  sequence:1,dex:25,level:30,shiny:1,form:0,life:1,
  date:1700000000,variant:0,nick:'Frozen B',winnerId:2,
  team:{active:1,care:{id:100},members:[
   {id:1,dex:25,level:30,nick:'Frozen A',shiny:false,
    form:0,wins:20,levelGains:20},
   {id:2,dex:25,level:30,nick:'Frozen B',shiny:true,
    form:0,wins:6,levelGains:6}
  ]}
 }];
 h.Module={
  _tp_hall_view(){},_tp_lg_owned(){},
  ccall(name){
   if(name==='tp_lg_owned')return 0;
   if(name==='tp_lg_view')return '{"live":0}';
   if(name==='tp_hall_view')return JSON.stringify({
    supported:1,wins:1,seen:1,variants:1,pendingCeremony:0,
    legacy:0,records
   });
   throw Error(name);
  }
 };
 load(h,'browser_ver/web/league-hall.js');
 assert(h.TPHall.open());
 h.TPHall.draw();
 assert(h.words.includes('Frozen B'));
 assert.equal(h.TPHall.diagnostics.memberSelected,1);
 h.TPHall.tap(90,215);h.words.length=0;
 h.TPHall.draw();
 assert(h.words.includes('Frozen A'));
 assert.equal(h.TPHall.diagnostics.memberSelected,0);

 console.log('P05c league UI passed: team start routing, ordered switch RPC, '+
  'save failure/retry/checkpoint, unchanged legacy routing, actual shared '+
  'forced-switch targets and frozen Hall-member navigation. Native RPC '+
  'is mocked; actual browser/WASM execution remains required.');
})().catch(error=>{console.error(error);process.exit(1);});
