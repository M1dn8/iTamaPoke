 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

async function quiet(page){
 await page.waitForFunction(()=>
  !tpSaveReplacing&&!TPCollection.busy&&!TPCollection.blocked&&
  !Module.ccall('tp_f4_store_pending','number',[],[])
 );
}
async function openArena(page,region){
 await H.game(page);
 const a=await H.point(page,233,300),b=await H.point(page,233,110);
 await page.mouse.move(a.x,a.y);
 await page.mouse.down();
 await page.mouse.move(b.x,b.y,{steps:8});
 await page.mouse.up();
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
 await H.tap(page,130,134);
 await quiet(page);
}
async function setup(page,{region=0,weak=false,loss=false,allWeak=false}={}){
 await H.game(page);
 const seed=await page.evaluate(async({weak,loss,allWeak})=>{
  await TPCollectionGame.ensureCurrent();
  const active=TPCollection.read().active;
  const careLevel=TPCollection.read().mons.find(m=>m.id===active).level;
  const ids=[];
  for(let i=0;i<2;i++){
   const fragile=allWeak||(weak&&i===0);
   const stats=loss?
    (i===0?{atk:1000,def:60,spe:1000}:{atk:1,def:1,spe:1}):
    fragile?{atk:1,def:1,spe:1}:{atk:1000,def:1000,spe:1000};
   await TPCollection.apply('catchWild',{
    dex:25,level:loss?(i===0?20:1):fragile?1:i===0?20:30,
    nickname:i===0?'Arena Alpha':'Arena Beta',
    shiny:false,origin:'wild',
    data:{stats,genes:null,training:null}
   },0);
   ids.push(TPCollection.read().nextId-1);
  }
  for(const id of [...TPCollection.read().team])
   await TPCollection.apply('unselectTeam',id);
  for(const id of ids)await TPCollection.apply('selectTeam',id);
  return {active,careLevel,ids};
 },{weak,loss,allWeak});
 await openArena(page,region);
 return seed;
}
async function start(page){
 await H.tap(page,233,354);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 await expect.poll(()=>page.evaluate(()=>({
  team:TPArena.snapshot?.team,
  count:TPBattleView.current?.wildTeam?.count,
  busy:TPArena.busy,gate:tpSaveReplacing
 }))).toEqual({team:true,count:2,busy:false,gate:false});
}

// A native opponent change precedes its next rendered Canvas frame.
// Never decide which menu to use from the previous battle snapshot.
async function rendered(page){
 await expect.poll(()=>page.evaluate(()=>{
  if(screen!=='battle'||tpSaveReplacing||TPArena.busy)return false;
  const ui=TPBattleView,m=ui.current,v=TPArena.teamView;
  if(!m||!v||m.mode!=='arena')return false;
  if(m.id!==Module.ccall('tp_bv_get','number',['number'],[0])||
     m.round!==fns.battleRound()||
     m.resolved!==!!fns.battleResolved()||
     m.next!==!!TPTrainer.get(3)||
     m.player.hp!==fns.battlePlayerHp()||
     m.enemy.hp!==fns.battleEnemyHp()||
     m.rests!==Module.ccall('tp_battle_rest_uses_left','number',[],[])||
     m.wildTeam?.active!==v.active||
     m.wildTeam?.needsSwitch!==v.needsSwitch)return false;

  if(m.resolved)return m.next&&!!ui.target('next');
  if(v.needsSwitch||ui.menu==='team'){
   if(ui.target('fight')||ui.target('info'))return false;
   return v.members.every((member,index)=>
    !!ui.target('member'+index)===(member.hp>0&&index!==v.active)
   );
  }
  if(ui.menu==='moves')
   return !!ui.target('heavy')&&!ui.target('fight');
  return ui.menu==='main'&&!!ui.target('fight')&&!ui.target('back');
 })).toBe(true);
}
async function action(page,name){
 try{
  await rendered(page);
  const before=await page.evaluate(()=>({
   id:Module.ccall('tp_bv_get','number',['number'],[0]),
   round:fns.battleRound()
  }));
  await H.battleAction(page,name);

  if(['quick','heavy','dodge','rest'].includes(name)){
   await expect.poll(()=>page.evaluate(before=>
    Module.ccall('tp_bv_get','number',['number'],[0])!==before.id||
    fns.battleRound()>before.round||
    !!fns.battleResolved()||!!TPArena.teamView?.needsSwitch,
    before
   )).toBe(true);
   // Native state may advance before the next Canvas frame.
   // Final results have their own persistence/phase waits.
   const stillFighting=await page.evaluate(()=>
    screen==='battle'&&TPArena.snapshot?.phase==='fighting'&&
    (!fns.battleResolved()||!!TPTrainer.get(3))
   );
   if(stillFighting)await rendered(page);
  }else if(name==='next'){
   await expect.poll(()=>page.evaluate(()=>
    Module.ccall('tp_bv_get','number',['number'],[0])
   )).not.toBe(before.id);
  }else if(/^member[0-5]$/.test(name)){
   await expect.poll(()=>page.evaluate(()=>TPArena.teamView?.active))
    .toBe(Number(name.slice(6)));
  }else if(name==='info'){
   await expect.poll(()=>page.evaluate(()=>TPBattleView.menu)).toBe('team');
  }else if(name==='back'){
   await expect.poll(()=>page.evaluate(()=>TPBattleView.menu)).toBe('main');
  }
 }catch(error){
  const diagnostic=await page.evaluate(()=>({
   screen,gate:tpSaveReplacing,arena:TPArena.snapshot,
   native:TPArena.teamView,
   round:fns.battleRound(),resolved:!!fns.battleResolved(),
   next:!!TPTrainer.get(3),
   nativeId:Module.ccall('tp_bv_get','number',['number'],[0]),
   rendered:TPBattleView.current,menu:TPBattleView.menu,
   targets:Object.fromEntries(
    ['fight','back','info','heavy','next','member0','member1'].map(
     key=>[key,TPBattleView.target(key)]
    )
   )
  })).catch(()=>null);
  console.error('Arena action diagnostic:',name,JSON.stringify(diagnostic));
  throw error;
 }
}

async function menu(page){
 await rendered(page);
 const current=await page.evaluate(()=>TPBattleView.menu);
 if(current==='moves'||current==='info')await action(page,'back');
 if(current!=='team')await action(page,'info');
 await expect.poll(()=>page.evaluate(()=>TPBattleView.menu)).toBe('team');
 await rendered(page);
}
async function beatCurrent(page,move='heavy'){
 for(let i=0;i<80;i++){
  const s=await page.evaluate(()=>({
   resolved:!!fns.battleResolved(),
   forced:!!TPArena.teamView?.needsSwitch
  }));
  if(s.resolved||s.forced)break;
  await action(page,move);
 }
 expect(await page.evaluate(()=>!!fns.battleResolved())).toBe(true);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);
}
async function finishSeries(page){
 for(let i=0;i<160;i++){
  const s=await page.evaluate(()=>({
   phase:TPArena.snapshot?.phase,
   resolved:!!fns.battleResolved(),
   next:!!TPTrainer.get(3),
   forced:!!TPArena.teamView?.needsSwitch
  }));
  if(s.phase!=='fighting'||s.resolved&&!s.next)return;
  if(s.forced)throw Error('Unexpected forced switch in strong-team fixture');
  await action(page,s.next?'next':'heavy');
 }
 throw Error('Arena fixture exceeded action limit');
}
async function loseCurrent(page){
 for(let i=0;i<120;i++){
  const stopped=await page.evaluate(()=>
   !!fns.battleResolved()||!!TPArena.teamView?.needsSwitch
  );
  if(stopped)return;
  await action(page,'dodge');
 }
 throw Error('Defeat fixture exceeded action limit');
}
const mask=(page,r)=>page.evaluate(r=>Module.ccall(
 'tp_region_arena_mask','number',['number'],[r]
),r);
const levels=(page,ids)=>page.evaluate(ids=>ids.map(id=>
 TPCollection.read().mons.find(m=>m.id===id).level
),ids);

test.beforeEach(async({page})=>{await H.prepare(page);});

for(const region of [0,1]){
 test(`P05b UI: region ${region}, individual heals, both winners and reload`,
 async({page})=>{
  const seed=await setup(page,{region});
  await start(page);
  await expect.poll(()=>page.evaluate(()=>
   TPBattleView.teamIndicators?.enemy.length
  )).toBe(2);
  expect(await page.evaluate(()=>TPBattleView.current.player.nick))
   .toBe('Arena Alpha');
  expect(await page.evaluate(()=>TPBattleView.current.player.dex)).toBe(25);

  await action(page,'rest');
  const first=await page.evaluate(()=>({
   round:fns.battleRound(),rests:TPBattleView.current.rests
  }));
  expect(first.rests).toBe(1);
  await menu(page);await action(page,'member1');
  expect(await page.evaluate(()=>fns.battleRound())).toBe(first.round+1);
  expect(await page.evaluate(()=>Module.ccall(
   'tp_battle_rest_uses_left','number',[],[]
  ))).toBe(2);
  await action(page,'rest');
  await menu(page);await action(page,'member0');
  expect(await page.evaluate(()=>Module.ccall(
   'tp_battle_rest_uses_left','number',[],[]
  ))).toBe(1);

  await beatCurrent(page);
  expect(await mask(page,region)).toBe(0);
  expect(await levels(page,seed.ids)).toEqual([20,30]);
  const carry=await page.evaluate(()=>({
   hp:fns.battlePlayerHp(),rests:Module.ccall(
    'tp_battle_rest_uses_left','number',[],[]
   )
  }));
  await action(page,'next');
  expect(await page.evaluate(()=>({
   hp:fns.battlePlayerHp(),rests:Module.ccall(
    'tp_battle_rest_uses_left','number',[],[]
   )
  }))).toEqual(carry);
  await menu(page);await action(page,'member1');
  await beatCurrent(page);
  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('done');
  expect(await levels(page,seed.ids)).toEqual([21,31]);
  expect(await mask(page,region)).toBe(1);
  expect(await mask(page,1-region)).toBe(0);
  expect(await page.evaluate(()=>!!fns.battleCatchOffered())).toBe(false);
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(seed.active);
  expect(await page.evaluate(id=>
   TPCollection.read().mons.find(m=>m.id===id).level,seed.active
  )).toBe(seed.careLevel);

  await page.reload();await H.waitReady(page);
  expect(await levels(page,seed.ids)).toEqual([21,31]);
  expect(await mask(page,region)).toBe(1);
  expect(await mask(page,1-region)).toBe(0);
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(seed.active);
 });
}

test('P05b UI: forced switch has no extra turn and defeated member stays out',
 async({page})=>{
  const seed=await setup(page,{weak:true});
  await start(page);
  for(let i=0;i<40;i++){
   if(await page.evaluate(()=>TPArena.teamView.needsSwitch))break;
   await action(page,'heavy');
  }
  await expect.poll(()=>page.evaluate(()=>TPArena.teamView.needsSwitch))
   .toBe(true);
  await expect.poll(()=>page.evaluate(()=>
   TPBattleView.teamIndicators?.player.map(m=>m.ready)
  )).toEqual([false,true]);
  const before=await page.evaluate(()=>({
   round:fns.battleRound(),enemyHp:fns.battleEnemyHp()
  }));
  await action(page,'member1');
  expect(await page.evaluate(()=>({
   round:fns.battleRound(),enemyHp:fns.battleEnemyHp()
  }))).toEqual(before);
  expect(await page.evaluate(()=>TPArena.teamView.members[1].hp))
   .toBe(await page.evaluate(()=>TPArena.teamView.members[1].maxHp));
  await beatCurrent(page);await action(page,'next');
  expect(await page.evaluate(()=>TPArena.teamView.members[0].hp)).toBe(0);
  await menu(page);
  expect(await page.evaluate(()=>TPBattleView.target('member0'))).toBe(null);
  await action(page,'back');
  await beatCurrent(page);
  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('done');
  expect(await levels(page,seed.ids)).toEqual([1,32]);
 });

test('P05b UI: timeout loss after one KO saves earned bonus without a badge',
 async({page})=>{
  test.setTimeout(120000);
  const seed=await setup(page,{loss:true});
  await start(page);
  await page.evaluate(()=>Module.ccall(
   'tp_seed_random',null,['number'],[7]
  ));
  await beatCurrent(page,'quick');await action(page,'next');
  await loseCurrent(page);
  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('lost');
  expect(await page.evaluate(()=>fns.battleRound())).toBe(20);
  expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(false);
  expect(await page.evaluate(()=>TPArena.teamView.needsSwitch)).toBe(false);
  expect(await page.evaluate(()=>TPArena.teamView.members[0].hp)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>TPArena.teamView.members[1].hp))
   .toBe(await page.evaluate(()=>TPArena.teamView.members[1].maxHp));
  expect(await levels(page,seed.ids)).toEqual([21,1]);
  expect(await mask(page,0)).toBe(0);
  expect(await mask(page,1)).toBe(0);
  expect(await page.evaluate(()=>!!fns.battleCatchOffered())).toBe(false);
  await page.reload();await H.waitReady(page);
  expect(await levels(page,seed.ids)).toEqual([21,1]);
  expect(await mask(page,0)).toBe(0);
 });


test('P05b UI: entire team KO ends the arena without a badge',
 async({page})=>{
  const seed=await setup(page,{allWeak:true});
  await start(page);
  for(let i=0;i<40;i++){
   if(await page.evaluate(()=>
    !!fns.battleResolved()||TPArena.teamView.needsSwitch
   ))break;
   await action(page,'heavy');
  }
  await expect.poll(()=>page.evaluate(()=>TPArena.teamView.needsSwitch))
   .toBe(true);
  expect(await page.evaluate(()=>TPArena.teamView.members[0].hp)).toBe(0);
  await action(page,'member1');
  for(let i=0;i<40;i++){
   if(await page.evaluate(()=>!!fns.battleResolved()))break;
   await action(page,'heavy');
  }
  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('lost');
  expect(await page.evaluate(()=>TPArena.teamView.members.map(m=>m.hp)))
   .toEqual([0,0]);
  expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(false);
  expect(await levels(page,seed.ids)).toEqual([1,1]);
  expect(await mask(page,0)).toBe(0);
  expect(await mask(page,1)).toBe(0);
  await page.reload();await H.waitReady(page);
  expect(await levels(page,seed.ids)).toEqual([1,1]);
  expect(await mask(page,0)).toBe(0);
 });

test('P05b UI: failed result rolls back badge and levels; retry commits once',
 async({page})=>{
  const seed=await setup(page);
  await start(page);
  const before=await page.evaluate(()=>TPCollection.read());
  await page.evaluate(()=>{
   window.__arenaWrite=writeSave;
   writeSave=async(bytes,force=false)=>{
    if(force&&TPArena.snapshot?.phase==='saving')
     throw Error('intentional arena result quota');
    return window.__arenaWrite(bytes,force);
   };
  });
  await finishSeries(page);
  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('failed');
  expect(await mask(page,0)).toBe(0);
  expect(await page.evaluate(()=>TPCollection.read())).toEqual(before);
  expect(await page.evaluate(()=>({
   busy:TPCollection.busy,blocked:TPCollection.blocked,gate:tpSaveReplacing
  }))).toEqual({busy:false,blocked:false,gate:false});
  await page.evaluate(()=>{writeSave=window.__arenaWrite;});
  await H.tap(page,233,390);
  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('done');
  expect(await levels(page,seed.ids)).toEqual([22,30]);
  expect(await mask(page,0)).toBe(1);
  expect(await page.evaluate(()=>TPArena.complete())).toBe(false);
  await page.reload();await H.waitReady(page);
  expect(await levels(page,seed.ids)).toEqual([22,30]);
  expect(await mask(page,0)).toBe(1);
 });

test('P05b UI: repeat victory saves new bonuses and preserves badge date',
 async({page})=>{
  const seed=await setup(page);
  await start(page);await finishSeries(page);
  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('done');
  const date=await page.evaluate(()=>Module.ccall(
   'tp_f3_date','number',['number'],[0]
  ));
  expect(await levels(page,seed.ids)).toEqual([22,30]);
  await H.tap(page,233,435);
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');
  await expect(page.locator('#status')).toHaveText('Arena · Kanto-Auswahl');
  await H.tap(page,130,134);await quiet(page);
  await start(page);
  expect(await page.evaluate(()=>TPArena.teamView.members.every(
   m=>m.hp===m.maxHp
  ))).toBe(true);
  expect(await page.evaluate(()=>Module.ccall(
   'tp_battle_rest_uses_left','number',[],[]
  ))).toBe(2);
  await finishSeries(page);
  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('repeat');
  expect(await levels(page,seed.ids)).toEqual([24,30]);
  expect(await page.evaluate(()=>Module.ccall(
   'tp_f3_date','number',['number'],[0]
  ))).toBe(date);
  await page.reload();await H.waitReady(page);
  expect(await levels(page,seed.ids)).toEqual([24,30]);
 });

for(const stage of ['prepare','entry']){
 test(`P05b UI: ${stage} quota refuses start without energy loss`,
 async({page})=>{
  await setup(page);
  const energy=await page.evaluate(()=>TPBattleEnergy.view.energy);
  await page.evaluate(stage=>{
   window.__arenaStartWrite=writeSave;
   writeSave=async(bytes,force=false)=>{
    const active=Module.ccall(
     'tp_region_arena_session_region','number',[],[]
    )>=0;
    if(force&&(stage==='prepare'?!active:active)){
     window.__arenaStartFailure=true;
     throw Error('intentional arena start quota');
    }
    return window.__arenaStartWrite(bytes,force);
   };
  },stage);
  await H.tap(page,233,354);
  await expect.poll(()=>page.evaluate(()=>window.__arenaStartFailure===true))
   .toBe(true);
  await expect.poll(()=>page.evaluate(()=>({
   screen,busy:TPArena.busy,gate:tpSaveReplacing,
   pending:Module.ccall('tp_f4_store_pending','number',[],[]),
   open:Module.ccall('tp_battle_is_open','number',[],[])
  }))).toEqual({
   screen:'arena',busy:false,gate:false,pending:0,open:0
  });
  expect(await page.evaluate(()=>TPBattleEnergy.view.energy)).toBe(energy);
  expect(await mask(page,0)).toBe(0);
  await page.evaluate(()=>{writeSave=window.__arenaStartWrite;});
  await start(page);
 });
}
