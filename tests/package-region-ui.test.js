const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function env(){
 let saveResolve,saveReject,pending=null,arenaActive=false,arenaOwner=-1,arenaPhase=0;const calls=[],text=[],storage=new Map(),masks=[1,0];
 const states=[0,1].map(()=>({supported:1,unlocked:1,state:0,live:0,done:0,index:0,actor:1,battleId:1,records:[],playerDex:376,playerLevel:100,level:40,hp:300,maxHp:300,rests:5}));
 const halls=[{supported:1,records:[],wins:0,seen:0,pendingCeremony:0},{supported:1,records:[{dex:158,level:50,shiny:1,form:0,life:1,date:1700000000,variant:0,nick:'J-Sieger',sequence:1}],wins:1,seen:0,pendingCeremony:1,variants:1}];
 const gifts=[0,1].map(()=>({supported:1,eligible:1,state:0,dex:0,candidates:[152,155,158],canChoose:1,canArm:0,canDisarm:0,queueSupported:1,armedRegion:-1}));
 const mod={ccall(n,type,_types,args=[]){calls.push([n,...args]);const regional=n.startsWith('tp_region_'),r=regional?args[0]:0,a=regional?args.slice(1):args;
  if(n==='tp_lg_owned')return states.some(s=>s.live)||pending?.kind==='league'?1:0;
  if(n==='tp_f4_store_pending')return pending&&pending.kind!=='league'?1:0;
  if(n==='tp_f4_store_pending_token')return pending?.token||0;
  if(n==='tp_f3_get')return [arenaActive?1:0,0,13,arenaPhase][a[0]]||0;
  if(n==='tp_f3_mask'||n==='tp_region_arena_mask')return masks[r];
  if(n==='tp_f3_date'||n==='tp_region_arena_date')return 1700000000;
  if(n==='tp_region_arena_session_region')return arenaOwner;
  if(n==='tp_energy_arena_begin'||n==='tp_region_energy_arena_begin'){assert(!pending);pending={kind:'entry',owner:r,token:8};arenaActive=true;arenaOwner=r;return 8;}
  if(n==='tp_energy_arena_finish'||n==='tp_region_energy_arena_finish'){assert(pending&&pending.owner===r&&a[0]===8);pending=null;if(!a[1]){arenaActive=false;arenaOwner=-1;return 1;}return 13;}
  if(n==='tp_f3_apply'||n==='tp_region_arena_apply'){assert.equal(r,arenaOwner);assert.equal(a[0],13);arenaPhase=1;return 1;}
  if(n==='tp_f3_finish'||n==='tp_region_arena_finish'){assert.equal(r,arenaOwner);assert.equal(a[0],13);if(a[1]){masks[r]|=1;arenaPhase=2;}else arenaPhase=0;return 1;}
  if(n==='tp_lg_view'||n==='tp_region_lg_view')return JSON.stringify(states[r]);
  if(n==='tp_lg_prepare_start'||n==='tp_region_lg_prepare_start'||n==='tp_lg_prepare_seen'||n==='tp_region_lg_prepare_seen'){assert(!pending);pending={kind:'league',owner:r,token:7,seen:n.includes('seen')};return 7;}
  if(n==='tp_lg_finish'||n==='tp_region_lg_finish'){assert(pending&&pending.owner===r&&a[0]===7);if(a[1]){if(pending.seen){halls[r].seen=1;halls[r].pendingCeremony=0;}else{states[r].state=2;states[r].live=1;}}pending=null;return 1;}
  if(n==='tp_lg_abort'||n==='tp_region_lg_abort'){states[r].live=0;return 1;}
  if(n==='tp_hall_view'||n==='tp_region_hall_view')return JSON.stringify(halls[r]);
  if(n==='tp_rg_view'||n==='tp_region_rg_view')return JSON.stringify(gifts[r]);
  if(n==='tp_rg_prepare'||n==='tp_region_rg_prepare'){assert(!pending);pending={kind:'gift',owner:r,token:9,before:{...gifts[r]}};gifts[r].state=1;gifts[r].dex=a[1];gifts[r].canChoose=0;return 9;}
  if(n==='tp_f4_store_finish'||n==='tp_region_rg_finish'){assert(pending&&pending.owner===r&&a[0]===9);if(!a[1])gifts[r]=pending.before;pending=null;return 1;}
  throw Error('Unexpected RPC '+n+' '+JSON.stringify(args));
 },_tp_battle_close(){arenaActive=false;arenaOwner=-1;},_tp_lg_view(){},_tp_hall_view(){},_tp_rg_view(){},_tp_lg_owned(){},_tp_f3_get(){},_tp_f4_store_pending(){}};
 const ctx=new Proxy({fillText:s=>text.push(String(s))},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
 const c={window:null,console,Module:mod,ctx,UI:{bgDay:'#f7efe6',ink:'#292831',track:'#ded2bd',white:'#fff',barBad:'#9c3030'},TP:{cx:233},screen:'card',battleReturn:'card',cardPage:4,choice:'none',tpSaveReplacing:false,tpSaveEpoch:0,dragStart:null,dragNow:null,performance:{now:()=>2000},document:{visibilityState:'visible',addEventListener(){}},addEventListener(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},TPTrainer:{canOpen:()=>true,get:k=>k===3?0:2,active:()=>arenaActive},TPBattleEnergy:{supported:true,view:{arena:{can:1},elite:{can:1},champ:{can:1}},line:()=>''},fns:{speciesId:()=>376,name:()=> 'Aktiv',dexName:d=>'Art '+d,battleResolved:()=>true,battlePlayerWon:()=>true},TPStoreTools:{parseLegacy(){}},exportStateBytes:()=>new Uint8Array([1]),writeSave:()=>new Promise((r,j)=>{saveResolve=r;saveReject=j;}),roundRect(){},drawBattleSprite(){},playSfx(){},spriteFor:()=>null,megaSpriteFor:()=>null,confirm:()=>true,queueMicrotask,statusEl:{textContent:''},TPAct:{idle:0},Math,Date,Map,Set,Promise,Object,Number,setTimeout,clearTimeout};c.window=c;vm.createContext(c);
 const load=(n,transform=x=>x)=>vm.runInContext(transform(fs.readFileSync('browser_ver/web/'+n,'utf8')),c);
 for(const n of ['arena-kanto.js','league-kanto-data.js','arena-johto.js','league-johto-data.js','regions-ui.js'])load(n);
 for(const n of c.TPRegions.required)mod['_'+n]=()=>{};
 // Load the real shared presentation module before arena and league.
 Object.assign(c,{
  ensureSprite(){},
  typeColor565:()=>0,
  rgb565:()=>'#000000',
  TYPE_NAMES:{1:'Normal'}
 });
 Object.assign(c.fns,{
  dexType1:()=>1,
  dexType2:()=>0
 });
 load('badge-ui.js');
 load('opponent-team.js');
 load('arena.js');
 load('league-kanto.js',s=>s.replace('window.TPLeague=Object.freeze','window.__forceLeagueRegion=r=>region=r;window.__leagueTransaction=transaction;window.TPLeague=Object.freeze'));
 load('league-hall.js',s=>s.replace('window.TPHall=Object.freeze','window.__forceHallRegion=r=>region=r;window.TPHall=Object.freeze'));
 load('regional-reward-egg.js',s=>s.replace('window.TPRewardEgg=Object.freeze','window.__forceGiftRegion=r=>region=r;window.__giftTransaction=transaction;window.TPRewardEgg=Object.freeze'));
 return {c,calls,text,states,halls,gifts,masks,resolve:()=>saveResolve(true),reject:()=>saveReject(Error('synthetic UI quota'))};
}
(async()=>{
 const e=env(),c=e.c;assert(c.TPRegions.available(1));assert.equal(c.TPRegions.catalog(1).champ,'Siegfried');assert.equal(c.TPRegions.catalog(1).league.champions.length,1);assert.equal(c.TPRegions.catalog(0).champ,'Blau');
 assert(c.TPArena.open());assert(c.TPArena.chooseRegion(1));assert.equal(c.TPArena.region,1);let p=c.TPArena.start(0);assert.equal(c.TPArena.chooseRegion(0),false);e.reject();assert.equal(await p,false);assert(e.calls.some(x=>x[0]==='tp_region_energy_arena_finish'&&x[1]===1&&x[3]===0));
 p=c.TPArena.start(0);e.resolve();assert(await p);assert.equal(c.TPArena.snapshot.region,1);assert(!c.TPArena.chooseRegion(0));p=c.TPArena.complete();e.resolve();assert(await p);assert.equal(c.TPArena.snapshot.phase,'done');assert.equal(e.masks[0],1);assert.equal(e.masks[1],1);c.TPArena.abort();
 assert(c.TPLeague.open());assert.equal(c.TPLeague.region,1);p=c.__leagueTransaction('tp_lg_prepare_start',[0]);c.__forceLeagueRegion(0);e.resolve();assert(await p);assert(e.calls.some(x=>x[0]==='tp_region_lg_finish'&&x[1]===1&&x[3]===1));c.__forceLeagueRegion(1);assert.equal(c.TPLeague.state.region,1);c.TPLeague.back();
 c.screen='league';assert(c.TPHall.open(false,1));e.text.length=0;c.TPHall.draw();assert(e.text.includes('J-Sieger'));assert(!e.text.includes('Aktiv'));assert(e.text.includes('Champ: Siegfried'));p=c.TPHall.acknowledge();c.__forceHallRegion(0);e.resolve();assert(await p);assert.equal(e.halls[0].seen,0);assert.equal(e.halls[1].seen,1);c.__forceHallRegion(1);
 assert(c.TPRewardEgg.open());p=c.__giftTransaction(0,152);c.__forceGiftRegion(0);e.reject();assert.equal(await p,false);assert(e.calls.some(x=>x[0]==='tp_region_rg_finish'&&x[1]===1&&x[3]===0));c.__forceGiftRegion(1);p=c.__giftTransaction(0,152);c.__forceGiftRegion(0);e.resolve();assert(await p);c.__forceGiftRegion(1);assert.equal(e.gifts[0].state,0);assert.equal(e.gifts[1].dex,152);
 e.gifts[1].canArm=0;e.gifts[1].armedRegion=0;e.text.length=0;c.TPRewardEgg.draw();assert(e.text.some(x=>x.includes('Kanto-Ei bereits vorgemerkt')));const count=e.calls.length;c.TPRewardEgg.tap(233,386);assert.equal(e.calls.filter(x=>x[0]==='tp_region_rg_prepare').length,e.calls.slice(0,count).filter(x=>x[0]==='tp_region_rg_prepare').length);
 const drawContext=env();vm.runInContext(fs.readFileSync('browser_ver/web/battle-view.js','utf8'),drawContext.c);const themes=[];for(const index of [0,5,10,15,20]){drawContext.c.TPBattleView.drawLeague({region:1,battleId:index+1,index,playerDex:376,playerLevel:100,form:0,shiny:0,hp:200,maxHp:300,atk:300,def:200,spe:200,dex:178,level:40,enemyHp:100,enemyMaxHp:150,round:0,rests:5,live:1});themes.push(drawContext.c.TPBattleView.current.theme);assert.equal(drawContext.c.TPBattleView.current.region,1);}assert.equal(new Set(themes).size,5);assert(drawContext.c.TPBattleView.current.title.includes('Siegfried'));
 const cold=env();delete cold.c.Module._tp_region_rg_finish;assert(!cold.c.TPRegions.available(1));assert(cold.c.TPArena.open());assert(!cold.c.TPArena.chooseRegion(1));assert.equal(cold.c.TPArena.region,0);assert.equal(cold.c.TPRegions.catalog(2),null);assert(!cold.c.TPRegions.remember(2));
 console.log('Regional UI passed: old-core Johto refusal; independent catalogs, remembered selection guards, captured arena/league/Hall/gift owners across deferred writes and forced context changes; quota rollback, actual saved winner labels and visible cross-region egg queue. VM tests, not browser/native integration.');
})().catch(e=>{console.error(e);process.exit(1);});
