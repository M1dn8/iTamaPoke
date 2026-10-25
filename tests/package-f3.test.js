const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const catalog=require('../browser_ver/web/arena-kanto.js');assert.equal(catalog.region,'Kanto');assert.equal(catalog.edition,'Rot/Blau');assert.deepEqual(catalog.leaders.map(l=>l.team.length),[2,2,3,3,4,4,4,5]);assert.deepEqual(catalog.leaders[4].team,[[109,37],[89,39],[109,37],[110,43]]);
if(process.env.F3_NATIVE_JSON)assert.deepEqual(JSON.parse(fs.readFileSync(process.env.F3_NATIVE_JSON,'utf8')),catalog.leaders.map(({id,name,city,badge,team})=>({id,name,city,badge,team})));
const code=fs.readFileSync('browser_ver/web/arena.js','utf8');
function env({fail=false,delay=false,initial=0}={}){
 let serial=0,open=false,won=false,resolved=false,next=false,mask=initial,phase=0,before=0,release,failWrite=fail,writes=0;const events={},texts=[],calls=[];
 const c={Date,Math,Object,Number,Promise,Uint8Array,DataView,Blob,console,setTimeout,clearTimeout,performance:{now:()=>5000},TPKantoArena:catalog,screen:'card',cardPage:4,battleReturn:'card',choice:'none',dragStart:null,dragNow:null,tpSaveReplacing:false,tpSaveEpoch:0,document:{visibilityState:'visible',addEventListener:(k,f)=>events[k]=f},addEventListener:(k,f)=>events[k]=f,UI:{ink:'#111',white:'#fff',track:'#aaa',barBad:'#a00',bgDay:'#fff'},TP:{cx:233},ctx:new Proxy({fillText:t=>texts.push(t)},{get:(t,k)=>k in t?t[k]:(()=>{}),set(t,k,v){t[k]=v;return true;}}),roundRect(){},statusEl:{},drawBattleSprite(){},fns:{battleResolved:()=>resolved,battlePlayerWon:()=>won,speciesId:()=>150,name:()=>'Test',dexName:i=>'Dex '+i},TPTrainer:{canOpen:()=>c.screen==='card'&&c.cardPage===4&&!open,get:k=>k===3?next:0},TPDiagnostics:{record(){}},exportStateBytes:()=>new Uint8Array([mask]),writeSave:async(bytes,force)=>{writes++;assert(force&&c.tpSaveReplacing);assert.equal(bytes[0],mask);if(delay)await new Promise(r=>release=r);if(failWrite)throw Error('fixture write failure');},Module:{ccall(name,type,types,args){calls.push(name);if(name==='tp_f3_mask')return mask;if(name==='tp_f3_date')return mask&(1<<args[0])?1700000000:0;if(name==='tp_f3_get')return [open,0,serial,phase][args[0]];if(name==='tp_f3_start'){if(open)return 0;open=true;phase=0;resolved=won=false;return ++serial;}if(name==='tp_f3_apply'){if(!open||!resolved||!won||next||phase||args[0]!==serial)return 0;if(mask&1){phase=3;return 2;}before=mask;mask|=1;phase=1;return 1;}if(name==='tp_f3_finish'){assert.equal(args[0],serial);assert.equal(phase,1);if(!args[1])mask=before;phase=args[1]?2:0;return 1;}throw Error(name);},_tp_battle_close(){assert.notEqual(phase,1);open=false;}}};c.window=c;
 // Use the real shared presentation module with deterministic local UI doubles.
 Object.assign(c,{
  spriteFor:()=>null,
  ensureSprite(){},
  typeColor565:()=>0,
  rgb565:()=>'#000000',
  TYPE_NAMES:{1:'Normal'}
 });
 Object.assign(c.fns,{
  dexType1:()=>1,
  dexType2:()=>0
 });
 vm.createContext(c);
 vm.runInContext(
  fs.readFileSync('browser_ver/web/opponent-team.js','utf8'),
  c,
  {filename:'opponent-team.js'}
 );
 vm.runInContext(code,c);
 return {c,api:c.TPArena,events,texts,calls,win(){resolved=won=true;},partial(){resolved=won=true;next=true;},next(){next=false;resolved=won=false;},setFail:v=>failWrite=v,release:()=>release(),get mask(){return mask;},get writes(){return writes;}};
}
(async()=>{
 const e=env();assert(e.api.open());e.api.draw();assert(e.texts.includes('Rocko'));e.api.tap(130,134);e.api.draw();assert(e.texts.some(x=>x.includes('Lv. 12')));assert(e.api.start(0));e.partial();assert(!e.api.checkEnd()&&!e.writes);e.next();e.win();assert(e.api.checkEnd()&&e.api.busy);assert(!await e.api.complete());await new Promise(setImmediate);assert.equal(e.api.snapshot.phase,'done');assert.equal(e.mask,1);assert.equal(e.writes,1);assert(!e.c.tpSaveReplacing&&e.c.tpSaveEpoch===2);assert(e.api.intercept(5500));assert(e.texts.some(x=>x.includes('überreicht')));assert(!await e.api.complete());assert(e.api.battleTap(233,390));assert.equal(e.c.screen,'arena');e.api.draw();assert(e.texts.includes('Ordenkoffer · Kanto'));
 const f=env({fail:true});f.api.open();f.api.start(0);f.win();f.api.checkEnd();await new Promise(setImmediate);assert.equal(f.api.snapshot.phase,'failed');assert.equal(f.mask,0);assert(!f.c.tpSaveReplacing);f.api.intercept(6000);assert.equal(f.writes,1);f.setFail(false);assert(await f.api.complete());assert.equal(f.mask,1);
 const p=env({delay:true});p.api.open();p.api.start(0);p.win();p.api.checkEnd();p.c.document.visibilityState='hidden';p.events.visibilitychange();assert(p.api.busy);assert.equal(p.api.abort(),false);p.release();await new Promise(setImmediate);assert.equal(p.mask,1);assert.equal(p.api.snapshot,null);assert.equal(p.c.screen,'arena');
 const r=env({initial:1});r.api.open();r.api.start(0);r.win();assert(await r.api.complete());assert.equal(r.api.snapshot.phase,'repeat');assert(!r.writes&&r.mask===1);
 const a=env();a.api.open();a.api.start(0);a.c.document.visibilityState='hidden';a.events.visibilitychange();assert(!a.mask&&a.api.snapshot===null&&a.c.screen==='arena');const i=env();i.api.open();await assert.rejects(()=>i.api.importPortrait(new Blob(['bad']),0),/PNG/);assert(!i.api.busy&&!i.writes);
 const card=fs.readFileSync('browser_ver/web/card.js','utf8'),start=card.indexOf('function drawCardStats()'),end=card.indexOf('function drawCardMedals()',start),routes=[],rects=[];
 const c={TP:{cx:233},UI:{ink:'#111',white:'#fff',track:'#aaa',barBad:'#f00',barWarn:'#aa0',bgDay:'#fff'},ctx:new Proxy({},{get:()=>()=>{}}),roundRect:(...r)=>rects.push(r),drawStatBar(){},TPText:{status:s=>s},statusEl:{},fns:{statsBattleTitle:()=>'Kampf',statLabel:i=>i,atkStat:()=>100,defStat:()=>100,speStat:()=>100,battleCanStart:()=>1,wildBattleText:()=>'Wildkampf',battleRecordLine:()=>'',battleStreakLine:()=>'',battleBestLine:()=>''},TPTraining:{canStart:()=>true,start:k=>routes.push(k),notice:''},TPTrainer:{canOpen:()=>true,open:()=>routes.push('trainer')},TPArena:{canOpen:()=>true,open:()=>routes.push('arena')},Module:{_tp_battle_start:()=>routes.push('wild')}};c.window=c;vm.createContext(c);vm.runInContext(card.slice(start,end),c);c.drawCardStats();for(const x of [103,233,363])c.cardStatsTap(x,308);assert.deepEqual(routes,['wild','trainer','arena']);assert.deepEqual(rects.filter(r=>r[1]===286).map(r=>[r[0],r[2]]),[[44,118],[174,118],[304,118]]);
 assert(fs.readFileSync('browser_ver/web/sw.js','utf8').includes('./arena.js'));assert(fs.readFileSync('browser_ver/web/index.html','utf8').includes('src="arena-kanto.js"'));console.log('F3 UI passed: catalog parity, final-win/single-flight/commit/rollback/retry, background-save durability, repeat/abort/portrait refusal and centered navigation.');
})().catch(e=>{console.error(e);process.exit(1);});
