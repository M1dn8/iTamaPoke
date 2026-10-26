const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const catalog=require('../browser_ver/web/arena-kanto.js');assert.equal(catalog.region,'Kanto');assert.equal(catalog.edition,'Rot/Blau');assert.deepEqual(catalog.leaders.map(l=>l.team.length),[2,2,3,3,4,4,4,5]);assert.deepEqual(catalog.leaders[4].team,[[109,37],[89,39],[109,37],[110,43]]);
if(process.env.F3_NATIVE_JSON)assert.deepEqual(JSON.parse(fs.readFileSync(process.env.F3_NATIVE_JSON,'utf8')),catalog.leaders.map(({id,name,city,badge,team})=>({id,name,city,badge,team})));
const code=fs.readFileSync('browser_ver/web/arena.js','utf8');

const M=require('../browser_ver/web/collection-model.js');

function env({
 fail=false,delay=false,initial=0,failPrepare=false,failEntry=false
}={}){
 let serial=0,entryToken=0,open=false,attached=false,staged=false;
 let won=false,resolved=false,next=false,mask=initial,phase=0;
 let energy=100,date=initial?1700000000:0,release;
 let failWrite=fail,writes=0,prepares=0,resultWrites=0,entryWrites=0;
 const events={},texts=[],calls=[];
 const model=M.attachCurrent(M.create(),{
  dex:150,level:100,nickname:'Test',shiny:false,origin:'existing',
  data:{stats:{atk:400,def:400,spe:400},
   genes:{atk:100,def:100,spe:100},lifeToken:1}
 });
 const c={
  Date,Math,Object,Number,Promise,Uint8Array,DataView,Blob,console,
  setTimeout,clearTimeout,performance:{now:()=>5000},
  TPKantoArena:catalog,TPCollectionModel:M,
  screen:'card',cardPage:4,battleReturn:'card',choice:'none',
  dragStart:null,dragNow:null,tpSaveReplacing:false,tpSaveEpoch:0,
  document:{
   visibilityState:'visible',
   addEventListener:(key,fn)=>events[key]=fn
  },
  addEventListener:(key,fn)=>events[key]=fn,
  UI:{ink:'#111',white:'#fff',track:'#aaa',barBad:'#a00',bgDay:'#fff'},
  TP:{cx:233},
  ctx:new Proxy({fillText:t=>texts.push(t)},{
   get:(target,key)=>key in target?target[key]:(()=>{}),
   set(target,key,value){target[key]=value;return true;}
  }),
  roundRect(){},statusEl:{},drawBattleSprite(){},
  TPBattleView:{
   drawMember(){},
   label:p=>'Dex '+p.dex
  },
  fns:{
   battleResolved:()=>resolved,battlePlayerWon:()=>won,
   speciesId:()=>150,name:()=>'Test',dexName:id=>'Dex '+id,
   wildPromptActive:()=>false,dexType1:()=>1,dexType2:()=>0
  },
  TPTrainer:{
   canOpen:()=>c.screen==='card'&&c.cardPage===4&&!open,
   get:key=>key===3?next:0
  },
  TPCollection:{read:()=>model,busy:false,blocked:false},
  TPDiagnostics:{record(){}},
  TPStoreTools:{parseLegacy(){}},
  exportStateBytes:()=>new Uint8Array([mask,energy]),
  writeSave:async(bytes,force)=>{
   writes++;
   assert(force&&c.tpSaveReplacing);
   assert.equal(bytes[0],mask);
   assert.equal(bytes[1],energy);
   if(entryToken){
    entryWrites++;
    if(failEntry)throw Error('fixture entry write failure');
   }else{
    resultWrites++;
    if(delay)await new Promise(resolve=>release=resolve);
    if(failWrite)throw Error('fixture result write failure');
   }
   return true;
  },
  Module:{
   _tp_wt_arena_attach(){},
   ccall(name,type,types,args=[]){
    calls.push(name);
    if(name==='tp_f3_mask')return mask;
    if(name==='tp_f3_date')return mask&(1<<args[0])?date:0;
    if(name==='tp_f3_get')return [open,0,serial,phase][args[0]];
    if(name==='tp_wt_stage_begin'){
     if(open)return 0;staged=false;return args[0]===1?1:0;
    }
    if(name==='tp_wt_stage_entry'){
     staged=args[0]===0&&args[1]===model.active;
     return staged?1:0;
    }
    if(name==='tp_energy_arena_begin'){
     if(open||energy<45)return 0;
     open=true;attached=false;phase=0;next=false;
     resolved=won=false;serial++;energy-=25;
     entryToken=serial+100;
     return entryToken;
    }
    if(name==='tp_wt_arena_attach'){
     if(!open||!staged||args[0]!==serial||attached)return 0;
     attached=true;staged=false;return 1;
    }
    if(name==='tp_energy_arena_finish'){
     if(!entryToken||args[0]!==entryToken)return 0;
     entryToken=0;
     if(!args[1]){
      energy+=25;open=false;attached=false;return 1;
     }
     return serial;
    }
    if(name==='tp_wt_view')return JSON.stringify({
     live:open&&attached?1:0,arena:open&&attached,
     region:0,session:serial,count:attached?1:0,active:0,
     seriesDone:resolved&&!next,resultDone:phase>=2,won,
     opponentCount:2,needsSwitch:false,
     members:attached?[{
      id:model.active,dex:150,level:100,nick:'Test',
      shiny:false,form:0,hp:won?100:resolved?0:100,maxHp:100,
      levelGains:0
     }]:[]
    });
    throw Error(name);
   },
   _tp_battle_close(){
    open=false;attached=false;resolved=false;next=false;
   }
  },
  spriteFor:()=>null,ensureSprite(){},
  typeColor565:()=>0,rgb565:()=>'#000000',TYPE_NAMES:{1:'Normal'}
 };
 c.TPBattleEnergy={
  supported:true,
  get view(){return {energy,arena:{can:energy>=45}};},
  line:()=>'Arena · 25 Energie'
 };

 // UI dependency double. Actual result adapter/controller/save parsing
 // are exercised by package-p05-arena-result.test.js.
 c.TPArenaResult={
  supported:true,
  async prepare(){
   prepares++;
   if(failPrepare)throw Error('fixture preparation failure');
  },
  async complete(){
   if(!open||!attached||!resolved||next||phase||c.tpSaveReplacing)
    throw Error('fixture invalid result context');
   const oldMask=mask,oldDate=date;
   const outcome=won?(mask&1?2:1):3;
   c.tpSaveReplacing=true;c.tpSaveEpoch++;
   try{
    if(outcome===1){mask|=1;date=1700000001;}
    if(await c.writeSave(c.exportStateBytes(),true)!==true)
     throw Error('fixture write not confirmed');
    phase=outcome===1?2:outcome===2?3:4;
   }catch(error){
    mask=oldMask;date=oldDate;
    throw error;
   }finally{
    c.tpSaveEpoch++;c.tpSaveReplacing=false;
   }
  }
 };
 c.window=c;
 vm.createContext(c);
 vm.runInContext(
  fs.readFileSync('browser_ver/web/opponent-team.js','utf8'),
  c,{filename:'opponent-team.js'}
 );
 vm.runInContext(code,c,{filename:'arena.js'});
 return {
  c,api:c.TPArena,events,texts,calls,
  win(){resolved=won=true;next=false;},
  lose(){resolved=true;won=false;next=false;},
  partial(){resolved=won=true;next=true;},
  next(){next=false;resolved=won=false;},
  setFail:value=>failWrite=value,
  release:()=>{assert(release);release();},
  get mask(){return mask;},get date(){return date;},
  get energy(){return energy;},get open(){return open;},
  get writes(){return writes;},get prepares(){return prepares;},
  get resultWrites(){return resultWrites;},
  get entryWrites(){return entryWrites;}
 };
}

(async()=>{
 const e=env();
 assert(e.api.open());
 e.api.draw();assert(e.texts.includes('Rocko'));
 e.api.tap(130,134);e.api.draw();
 assert(e.texts.some(x=>x.includes('Lv. 12')));
 assert(await e.api.start(0));
 assert.equal(e.prepares,1);
 assert.equal(e.entryWrites,1);
 assert.equal(e.energy,75);
 assert(e.api.snapshot.team);
 assert.equal(e.api.teamView.count,1);

 e.partial();
 assert(!e.api.checkEnd());
 assert.equal(e.resultWrites,0);
 e.next();e.win();
 assert(e.api.checkEnd()&&e.api.busy);
 assert(!await e.api.complete());
 await new Promise(setImmediate);
 assert.equal(e.api.snapshot.phase,'done');
 assert.equal(e.mask,1);
 assert.equal(e.resultWrites,1);
 assert.equal(e.writes,2);
 assert(!e.c.tpSaveReplacing&&e.c.tpSaveEpoch===4);
 assert(e.api.intercept(5500));
 assert(e.texts.some(x=>x.includes('überreicht')));
 assert(!await e.api.complete());
 assert(e.api.battleTap(233,390));
 assert.equal(e.c.screen,'arena');
 e.api.draw();
 assert(e.texts.includes('Ordenkoffer · Kanto'));

 const f=env({fail:true});
 assert(f.api.open());assert(await f.api.start(0));
 f.win();assert(f.api.checkEnd());
 await new Promise(setImmediate);
 assert.equal(f.api.snapshot.phase,'failed');
 assert.equal(f.mask,0);
 assert(!f.c.tpSaveReplacing);
 f.api.intercept(6000);
 assert.equal(f.resultWrites,1);
 f.setFail(false);
 assert(await f.api.complete());
 assert.equal(f.mask,1);
 assert.equal(f.resultWrites,2);

 const p=env({delay:true});
 assert(p.api.open());assert(await p.api.start(0));
 p.win();assert(p.api.checkEnd());
 p.c.document.visibilityState='hidden';
 p.events.visibilitychange();
 assert(p.api.busy);
 assert.equal(p.api.abort(),false);
 p.release();
 await new Promise(setImmediate);
 assert.equal(p.mask,1);
 assert.equal(p.api.snapshot,null);
 assert.equal(p.c.screen,'arena');
 assert(!p.c.tpSaveReplacing);

 const r=env({initial:1});
 assert(r.api.open());assert(await r.api.start(0));
 const firstDate=r.date;
 r.win();assert(await r.api.complete());
 assert.equal(r.api.snapshot.phase,'repeat');
 assert.equal(r.resultWrites,1);
 assert.equal(r.mask,1);
 assert.equal(r.date,firstDate);

 const loss=env();
 assert(loss.api.open());assert(await loss.api.start(0));
 loss.lose();assert(loss.api.checkEnd());
 await new Promise(setImmediate);
 assert.equal(loss.api.snapshot.phase,'lost');
 assert.equal(loss.resultWrites,1);
 assert.equal(loss.mask,0);
 assert(loss.api.intercept(6000));
 assert(loss.texts.includes('Arena verloren'));
 assert(loss.api.battleTap(233,390));
 assert.equal(loss.c.screen,'arena');

 const a=env();
 assert(a.api.open());assert(await a.api.start(0));
 a.c.document.visibilityState='hidden';
 a.events.visibilitychange();
 assert(!a.mask&&a.api.snapshot===null&&a.c.screen==='arena');
 assert.equal(a.energy,75);
 assert.equal(a.resultWrites,0);

 for(const options of [{failPrepare:true},{failEntry:true}]){
  const refused=env(options);
  assert(refused.api.open());
  assert.equal(await refused.api.start(0),false);
  assert(!refused.open);
  assert.equal(refused.energy,100);
  assert.equal(refused.api.snapshot,null);
  assert(!refused.api.busy&&!refused.c.tpSaveReplacing);
 }

 const i=env();
 assert(i.api.open());
 await assert.rejects(
  ()=>i.api.importPortrait(new Blob(['bad']),0),/PNG/
 );
 assert(!i.api.busy&&!i.writes);
 const card=fs.readFileSync('browser_ver/web/card.js','utf8'),start=card.indexOf('function drawCardStats()'),end=card.indexOf('function drawCardMedals()',start),routes=[],rects=[];
 const c={TP:{cx:233},UI:{ink:'#111',white:'#fff',track:'#aaa',barBad:'#f00',barWarn:'#aa0',bgDay:'#fff'},ctx:new Proxy({},{get:()=>()=>{}}),roundRect:(...r)=>rects.push(r),drawStatBar(){},TPText:{status:s=>s},statusEl:{},fns:{statsBattleTitle:()=>'Kampf',statLabel:i=>i,atkStat:()=>100,defStat:()=>100,speStat:()=>100,battleCanStart:()=>1,wildBattleText:()=>'Wildkampf',battleRecordLine:()=>'',battleStreakLine:()=>'',battleBestLine:()=>''},TPTraining:{canStart:()=>true,start:k=>routes.push(k),notice:''},TPTrainer:{canOpen:()=>true,open:()=>routes.push('trainer')},TPArena:{canOpen:()=>true,open:()=>routes.push('arena')},Module:{_tp_battle_start:()=>routes.push('wild')}};c.window=c;vm.createContext(c);vm.runInContext(card.slice(start,end),c);c.drawCardStats();for(const x of [103,233,363])c.cardStatsTap(x,308);assert.deepEqual(routes,['wild','trainer','arena']);assert.deepEqual(rects.filter(r=>r[1]===286).map(r=>[r[0],r[2]]),[[44,118],[174,118],[304,118]]);

 assert(fs.readFileSync('browser_ver/web/sw.js','utf8').includes('./arena.js'));
 assert(fs.readFileSync('browser_ver/web/sw.js','utf8').includes('./collection-arena-result.js'));
 assert(fs.readFileSync('browser_ver/web/index.html','utf8').includes('src="arena-kanto.js"'));
 console.log('F3 UI passed: catalog parity, awaited paid-team start, preparation/entry refusal, final-only single-flight result, rollback/retry, background-save durability, persisted repeat/date stability, loss result, abort without refund, portrait refusal and centered navigation. UI dependency doubles; native/model/browser integration tested separately.');
})().catch(error=>{console.error(error);process.exit(1);});
