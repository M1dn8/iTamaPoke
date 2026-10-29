 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

function fixture(region=0){
 const base=H.fixture(0),fields=new Map();
 let at=4;
 for(let i=0;i<base.readUInt32LE(0);i++){
  const length=base[at++];
  const key=base.toString('utf8',at,at+length);at+=length;
  const type=base[at++],size=base.readUInt32LE(at);at+=4;
  fields.set(key,[type,Buffer.from(base.subarray(at,at+size))]);at+=size;
 }
 for(const [key,value] of Object.entries({
  agver:1,agmask:255,jagver:1,jagmask:255,
  lgver:1,lgkdate:region===1?1700000000:0,
  ene:100,full:100,joy:100,hyg:100
 })){
  const bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));
  fields.set(key,[1,bytes]);
 }
 fields.set('lgkdone',[0,Buffer.from([region===1?1:0])]);
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);
 return Buffer.concat([count,...Array.from(fields,([key,[type,value]])=>{
  const name=Buffer.from(key),length=Buffer.alloc(4);
  length.writeUInt32LE(value.length);
  return Buffer.concat([
   Buffer.from([name.length]),name,Buffer.from([type]),length,value
  ]);
 })]);
}

async function quiet(page){
 await page.waitForFunction(()=>
  !tpSaveReplacing&&!TPCollection.busy&&!TPCollection.blocked&&
  !TPLeague.busy&&!Module.ccall('tp_f4_store_pending','number',[],[])
 );
}
async function openLeague(page,region){
 await H.game(page);
 const a=await H.point(page,233,300),b=await H.point(page,233,110);
 await page.mouse.move(a.x,a.y);await page.mouse.down();
 await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 for(let i=0;i<4;i++)await H.tap(page,350,382);
 await H.tap(page,363,308);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');
 if(await page.evaluate(()=>TPArena.region)!==region){
  await H.tap(page,402,21);
  await expect.poll(()=>page.evaluate(()=>TPArena.choosingRegion)).toBe(true);
  await page.waitForFunction(()=>!TPRegions.locked());
  await H.tap(page,233,region===1?270:155);
 }
 await expect.poll(()=>page.evaluate(()=>TPArena.region)).toBe(region);
 await H.tap(page,130,435);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('league');
 await quiet(page);
 await expect.poll(()=>page.evaluate(()=>TPLeague.state?.teamMode)).toBe(true);
}
async function setup(page,{region=0,weakFirst=false,allWeak=false}={}){
 if(region===1)await H.importSave(page,fixture(1),1);
 await H.game(page);
 const seed=await page.evaluate(async({weakFirst,allWeak})=>{
  await TPCollectionGame.ensureCurrent();
  const active=TPCollection.read().active,ids=[];
  for(let i=0;i<2;i++){
   const weak=allWeak||weakFirst&&i===0;
   await TPCollection.apply('catchWild',{
    dex:6,level:weak?1:30,
    nickname:i?'Liga Beta':'Liga Alpha',
    shiny:i===1,origin:'wild',
    data:{
     stats:weak?{atk:1,def:1,spe:1}:{atk:3000,def:3000,spe:3000},
     genes:null,training:null
    }
   },0);
   ids.push(TPCollection.read().nextId-1);
  }
  for(const id of [...TPCollection.read().team])
   await TPCollection.apply('unselectTeam',id);
  for(const id of ids)await TPCollection.apply('selectTeam',id);
  Module.ccall('tp_seed_random',null,['number'],[314159]);
  return {active,ids};
 },{weakFirst,allWeak});
 await openLeague(page,region);
 return seed;
}
const state=page=>page.evaluate(()=>TPLeague.state);
const model=page=>page.evaluate(()=>JSON.parse(JSON.stringify(TPCollection.read())));
const energy=page=>page.evaluate(()=>TPBattleEnergy.view.energy);
const disk=page=>page.evaluate(async()=>Array.from(new Uint8Array(await loadSave())));

async function savedRun(page,region){
 return page.evaluate(region=>{
  const parsed=TPStoreTools.parseLegacy(exportStateBytes(Module));
  const field=parsed.values.get(region===0?'lgkrun':'jlgrun');
  return field?TPLeagueTeamState.decode(field.value,region):null;
 },region);
}
async function profile(page,region){
 return page.evaluate(region=>{
  const values=TPStoreTools.parseLegacy(exportStateBytes(Module)).values;
  const get=(key,fallback)=>values.has(key)?values.get(key).value:fallback;
  return {
   done:get(region===0?'lgkdone':'jlgdone',false),
   date:get(region===0?'lgkdate':'jlgdate',0),
   hallVersion:get(region===0?'lhver':'jlhver',0),
   hasRun:values.has(region===0?'lgkrun':'jlgrun'),
   careBattleBonus:get('blvl',0)
  };
 },region);
}
async function rendered(page){
 await expect.poll(()=>page.evaluate(()=>{
  if(screen!=='league'||tpSaveReplacing||TPLeague.busy)return false;
  const v=TPLeague.state,ui=TPBattleView,m=ui.current;
  if(!v.live||!m||m.mode!=='league'||m.id!==v.battleId||
     m.round!==v.round||m.player.hp!==v.hp||m.enemy.hp!==v.enemyHp||
     m.resolved!==!!v.resolved||m.wildTeam?.active!==v.active||
     m.wildTeam?.needsSwitch!==!!v.needsSwitch)return false;
  if(v.resolved)return !!ui.target('abort')||!!ui.target('retry');
  if(v.needsSwitch||ui.menu==='team')
   return v.members.every((p,i)=>
    !!ui.target('member'+i)===(p.hp>0&&i!==v.active));
  if(ui.menu==='moves')return !!ui.target('heavy');
  return ui.menu==='main'&&!!ui.target('fight');
 })).toBe(true);
}
async function action(page,name){
 try{
  await rendered(page);
  const before=await state(page);
  await H.battleAction(page,name);
  if(['quick','heavy','dodge','rest'].includes(name)){
   await expect.poll(()=>page.evaluate(before=>{
    const v=TPLeague.state;
    return !v.live||v.battleId!==before.battleId||
     v.round>before.round||!!v.resolved||!!v.needsSwitch;
   },before)).toBe(true);
  }else if(/^member[0-5]$/.test(name)){
   await expect.poll(()=>page.evaluate(()=>TPLeague.state.active))
    .toBe(Number(name.slice(6)));
  }else if(name==='info'){
   await expect.poll(()=>page.evaluate(()=>TPBattleView.menu)).toBe('team');
  }else if(name==='back'){
   await expect.poll(()=>page.evaluate(()=>TPBattleView.menu)).toBe('main');
  }
 }catch(error){
  console.error('League action diagnostic:',name,JSON.stringify(
   await page.evaluate(()=>({
    screen,gate:tpSaveReplacing,native:TPLeague.state,
    controller:TPLeague.diagnostics,collectionBusy:TPCollection.busy,
    blocked:TPCollection.blocked,rendered:TPBattleView.current,
    menu:TPBattleView.menu
   })).catch(()=>null)
  ));
  throw error;
 }
}
async function teamMenu(page){
 await rendered(page);
 const menu=await page.evaluate(()=>TPBattleView.menu);
 if(menu==='moves'||menu==='info')await action(page,'back');
 if(menu!=='team')await action(page,'info');
 await rendered(page);
}
async function select(page,index){
 if((await state(page)).active===index)return;
 await teamMenu(page);
 await action(page,'member'+index);
}
async function start(page){
 await H.tap(page,233,380);
 await expect.poll(()=>page.evaluate(()=>({
  live:TPLeague.state.live,team:TPLeague.state.teamMode,
  busy:TPLeague.busy,gate:tpSaveReplacing
 }))).toEqual({live:1,team:true,busy:false,gate:false});
 await rendered(page);
}
async function resume(page){
 const phase=await page.evaluate(()=>TPLeague.diagnostics.phase);
 await H.tap(page,233,phase==='checkpoint'?270:359);
 await expect.poll(()=>page.evaluate(()=>TPLeague.state.live)).toBe(1);
 await quiet(page);await rendered(page);
}
async function beatCurrent(page,{retry=false,final=false}={}){
 const index=(await state(page)).index;
 for(let turn=0;turn<80;turn++){
  const v=await state(page);
  if(!v.live||v.resolved)break;
  if(v.needsSwitch)throw Error('Unexpected forced switch in strong fixture');
  await action(page,'heavy');
 }
 if(retry){
  await expect.poll(()=>page.evaluate(()=>TPLeague.diagnostics.phase))
   .toBe('retry');
  expect((await state(page)).won).toBe(1);
 }else if(final){
  await expect.poll(()=>page.evaluate(()=>TPHall.active)).toBe(true);
  await quiet(page);
 }else{
  await expect.poll(()=>page.evaluate(()=>({
   phase:TPLeague.diagnostics.phase,
   state:TPLeague.state.state,live:TPLeague.state.live,
   index:TPLeague.state.index
  }))).toEqual({phase:'checkpoint',state:1,live:0,index:index+1});
  await quiet(page);
 }
}
async function loseMember(page){
 for(let turn=0;turn<80;turn++){
  const v=await state(page);
  if(v.resolved||v.needsSwitch)return;
  await action(page,'quick');
 }
 throw Error('Weak fixture did not reach defeat or forced switch');
}
async function rejectWrite(page,number=1){
 await page.evaluate(number=>{
  window.__leagueOriginalWrite=writeSave;
  let count=0;
  writeSave=async function(bytes,force){
   if(++count===number)throw Error('P05c intentional quota');
   return window.__leagueOriginalWrite(bytes,force);
  };
 },number);
}
async function restoreWrite(page){
 await page.evaluate(()=>{
  writeSave=window.__leagueOriginalWrite;
  delete window.__leagueOriginalWrite;
 });
}

test.beforeEach(async({page})=>{
 await H.prepare(page);
 await H.importSave(page,fixture(),1);
});

for(const region of [0,1]){
 test('P05c UI: region '+region+
  ', two actual winners, individual heals, reload and final team Hall',
 async({page})=>{
  test.setTimeout(180000);
  const seed=await setup(page,{region});
  await start(page);
  let v=await state(page);
  expect(v.members.map(m=>m.id)).toEqual(seed.ids);
  expect(v.members.map(m=>m.dex)).toEqual([6,6]);
  expect(v.members.map(m=>m.rests)).toEqual([5,5]);
  expect(await energy(page)).toBe(50);

  await action(page,'rest');
  v=await state(page);
  expect(v.members.map(m=>m.rests)).toEqual([4,5]);
  const hp0=v.members[0].hp,round0=v.round;
  await select(page,1);
  v=await state(page);
  expect(v.round).toBe(round0+1);
  expect(v.members[0].hp).toBe(hp0);
  expect(v.rests).toBe(5);
  const hp1=v.members[1].hp;
  await select(page,0);
  v=await state(page);
  expect(v.members[1].hp).toBe(hp1);
  expect(v.rests).toBe(4);

  await beatCurrent(page);
  const checkpoint=await savedRun(page,region);
  expect(checkpoint.care.id).toBe(seed.active);
  expect(checkpoint.members.map(m=>m.id)).toEqual(seed.ids);
  expect(checkpoint.members.map(m=>m.rests)).toEqual([4,5]);
  let current=await model(page);
  expect(current.mons.find(m=>m.id===seed.ids[0]).level).toBe(31);
  expect(checkpoint.members[0].level).toBe(30);

  await page.reload();await H.waitReady(page);
  await openLeague(page,region);
  expect(await savedRun(page,region)).toEqual(checkpoint);
  await resume(page);
  v=await state(page);
  expect(v.hp).toBe(checkpoint.members[checkpoint.active].hp);
  expect(v.rests).toBe(4);
  expect(v.round).toBe(0);

  for(let index=1;index<26;index++){
   v=await state(page);
   expect(v.index).toBe(index);
   expect(v.members.map(m=>m.level)).toEqual([30,30]);
   expect(await energy(page)).toBe(index<20?50:20);
   await select(page,index%2);
   await beatCurrent(page,{final:index===25});
   if(index<25)await resume(page);
  }

  const hall=await page.evaluate(()=>TPHall.view);
  expect(hall.wins).toBe(1);
  expect(hall.records).toHaveLength(1);
  const record=hall.records[0];
  expect(record.winnerId).toBe(seed.ids[1]);
  expect(record.team.care.id).toBe(seed.active);
  expect(record.team.members.map(m=>m.id)).toEqual(seed.ids);
  expect(record.team.members.map(m=>m.level)).toEqual([30,30]);
  expect(record.team.members.map(m=>m.wins)).toEqual([13,13]);
  expect(record.team.members.map(m=>m.levelGains)).toEqual([13,13]);
  current=await model(page);
  expect(seed.ids.map(id=>current.mons.find(m=>m.id===id).level))
   .toEqual([43,43]);
  expect(seed.ids.map(id=>current.mons.find(m=>m.id===id).data.stats.atk))
   .toEqual([3013,3013]);
  const finalProfile=await profile(page,region);
  expect(finalProfile.done).toBe(true);
  expect(finalProfile.hallVersion).toBe(2);
  expect(finalProfile.hasRun).toBe(false);
  expect(finalProfile.careBattleBonus).toBe(0);
  expect((await profile(page,1-region)).done).toBe(region===1);

  await H.tap(page,333,440);
  await expect.poll(()=>page.evaluate(()=>TPHall.view.seen)).toBe(1);
  await quiet(page);
  await page.reload();await H.waitReady(page);
  await openLeague(page,region);
  await H.tap(page,130,440);
  await expect.poll(()=>page.evaluate(()=>TPHall.active)).toBe(true);
  const reloaded=await page.evaluate(()=>TPHall.view);
  expect(reloaded.records).toEqual(hall.records);
  expect(reloaded.wins).toBe(1);
  expect(reloaded.pendingCeremony).toBe(0);
 });
}

test('P05c UI: forced replacement adds no turn/damage and fainted reserve survives reload',
 async({page})=>{
  const seed=await setup(page,{weakFirst:true});
  await start(page);
  await loseMember(page);
  let v=await state(page);
  expect(v.needsSwitch).toBe(1);
  expect(v.resolved).toBe(0);
  expect(v.members[0].hp).toBe(0);
  const before={round:v.round,enemyHp:v.enemyHp,hp:v.members[1].hp};
  await action(page,'member1');
  v=await state(page);
  expect(v.round).toBe(before.round);
  expect(v.enemyHp).toBe(before.enemyHp);
  expect(v.hp).toBe(before.hp);
  expect(v.members[0].hp).toBe(0);
  await beatCurrent(page);
  await page.reload();await H.waitReady(page);
  await openLeague(page,0);await resume(page);
  v=await state(page);
  expect(v.members[0].id).toBe(seed.ids[0]);
  expect(v.members[0].hp).toBe(0);
  await teamMenu(page);
  expect(await page.evaluate(()=>TPBattleView.target('member0'))).toBe(null);
  expect(await page.evaluate(()=>TPBattleView.teamIndicators.player[0].ready))
   .toBe(false);
 });

test('P05c UI: entire team loss gives no title, reward or resume checkpoint',
 async({page})=>{
  const seed=await setup(page,{allWeak:true});
  const before=await model(page);
  await start(page);
  await loseMember(page);
  expect((await state(page)).needsSwitch).toBe(1);
  await action(page,'member1');await loseMember(page);
  await expect.poll(()=>page.evaluate(()=>({
   resolved:TPLeague.state.resolved,won:TPLeague.state.won
  }))).toEqual({resolved:1,won:0});
  const after=await model(page);
  expect(seed.ids.map(id=>after.mons.find(m=>m.id===id).level))
   .toEqual(seed.ids.map(id=>before.mons.find(m=>m.id===id).level));
  expect((await profile(page,0)).done).toBe(false);
  expect((await profile(page,0)).hallVersion).toBe(0);
  await H.battleAction(page,'abort');
  expect(await page.evaluate(()=>Module.ccall(
   'tp_lgt_prepare_resume','number',['number'],[0]
  ))).toBe(0);
 });

test('P05c UI: failed victory save preserves disk and model; visible retry grants once',
 async({page})=>{
  const seed=await setup(page);
  await start(page);
  const before=await model(page),stored=await disk(page);
  await rejectWrite(page);
  await beatCurrent(page,{retry:true});
  expect(await disk(page)).toEqual(stored);
  expect(await model(page)).toEqual(before);
  expect((await savedRun(page,0)).index).toBe(0);
  expect((await profile(page,0)).done).toBe(false);
  await restoreWrite(page);
  await H.battleAction(page,'retry');
  await expect.poll(()=>page.evaluate(()=>TPLeague.diagnostics.phase))
   .toBe('checkpoint');
  await quiet(page);
  const after=await model(page);
  expect(after.mons.find(m=>m.id===seed.ids[0]).level).toBe(31);
  expect(after.mons.find(m=>m.id===seed.ids[1]).level).toBe(30);
  expect((await savedRun(page,0)).members[0].wins).toBe(1);
  await page.reload();await H.waitReady(page);
  await openLeague(page,0);
  const reloaded=await model(page);
  expect(reloaded.mons.find(m=>m.id===seed.ids[0]).level).toBe(31);
 });

for(const [name,number] of [['preparation',1],['paid entry',2]]){
 test('P05c UI: '+name+' quota refuses combat and paid energy; retry succeeds',
 async({page})=>{
  const seed=await setup(page);
  await rejectWrite(page,number);
  await H.tap(page,233,380);
  await expect.poll(()=>page.evaluate(()=>TPLeague.diagnostics.error))
   .toContain('P05c intentional quota');
  await quiet(page);
  expect((await state(page)).live).toBe(0);
  expect(await energy(page)).toBe(100);
  expect(await savedRun(page,0)).toBe(null);
  const current=await model(page);
  expect(current.team).toEqual(seed.ids);
  expect(seed.ids.map(id=>current.mons.find(m=>m.id===id).level))
   .toEqual([30,30]);
  await restoreWrite(page);
  await start(page);
  expect(await energy(page)).toBe(50);
 });
}


test('P05c UI: changed planning does not replace the saved bound team',
 async({page})=>{
  const M=require('../../../browser_ver/web/collection-model.js');
  const seed=await setup(page);
  await start(page);await beatCurrent(page);
  const checkpoint=await savedRun(page,0);
  const bytes=Buffer.from(await disk(page));
  const fields=[];
  let at=4;
  for(let i=0;i<bytes.readUInt32LE(0);i++){
   const length=bytes[at++];
   const key=bytes.toString('utf8',at,at+length);at+=length;
   const type=bytes[at++],size=bytes.readUInt32LE(at);at+=4;
   let value=Buffer.from(bytes.subarray(at,at+size));at+=size;
   if(key==='f4col'){
    let collection=M.decode(value.toString('utf8'));
    collection=M.moveTeam(collection,seed.ids[0],1);
    collection=M.unselectTeam(collection,seed.ids[0]);
    collection=M.selectTeam(collection,seed.active);
    expect(collection.team).toEqual([seed.ids[1],seed.active]);
    value=Buffer.from(M.encode(collection));
   }
   const name=Buffer.from(key),len=Buffer.alloc(4);
   len.writeUInt32LE(value.length);
   fields.push(Buffer.concat([
    Buffer.from([name.length]),name,Buffer.from([type]),len,value
   ]));
  }
  const count=Buffer.alloc(4);count.writeUInt32LE(fields.length);
  const backup=Buffer.concat([count,...fields]);

  // Import through the real backup UI after reload, not by replacing RPCs.
  await page.reload();await H.waitReady(page);
  await H.importSave(page,backup,1);
  await openLeague(page,0);
  expect((await model(page)).team).toEqual([seed.ids[1],seed.active]);
  expect(await savedRun(page,0)).toEqual(checkpoint);
  await resume(page);
  expect((await state(page)).members.map(m=>m.id)).toEqual(seed.ids);
  expect((await model(page)).team).toEqual([seed.ids[1],seed.active]);

  // Rewards still go to the bound fighter, even if unselected today.
  await beatCurrent(page);
  const after=await model(page);
  expect(after.mons.find(m=>m.id===seed.ids[0]).level).toBe(32);
  expect(after.team).toEqual([seed.ids[1],seed.active]);
 });
