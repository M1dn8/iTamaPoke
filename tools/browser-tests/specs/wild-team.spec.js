'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

async function openBattleCard(page){
 await H.game(page);
 const a=await H.point(page,233,300);
 const b=await H.point(page,233,110);
 await page.mouse.move(a.x,a.y);
 await page.mouse.down();
 await page.mouse.move(b.x,b.y,{steps:8});
 await page.mouse.up();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 for(let i=0;i<4;i++)await H.tap(page,350,382);
 await expect.poll(()=>page.evaluate(()=>cardPage)).toBe(4);
}

async function setup(page,{weak=false,empty=false}={}){
 await H.game(page);
 const seed=await page.evaluate(async({weak,empty})=>{
  await TPCollectionGame.ensureCurrent();
  const active=TPCollection.read().active;
  const ids=[];
  if(!empty){
   for(let i=0;i<2;i++){
    // Synthetic values isolate transitions; not a battle-balancing fixture.
    const fragile=weak&&i===0;
    await TPCollection.apply('catchWild',{
     dex:25,level:fragile?1:20+i*10,
     nickname:i===0?'P05 Alpha':'P05 Beta',
     shiny:false,origin:'wild',
     data:{
      stats:fragile?{atk:1,def:1,spe:1}:{atk:1000,def:1000,spe:1000},
      genes:null,training:null
     }
    },0);
    ids.push(TPCollection.read().nextId-1);
   }
  }
  for(const id of [...TPCollection.read().team]){
   await TPCollection.apply('unselectTeam',id);
  }
  for(const id of ids)await TPCollection.apply('selectTeam',id);
  return {active,ids};
 },{weak,empty});
 await openBattleCard(page);
 return seed;
}

async function start(page,count){
 await H.tap(page,103,308);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 await expect.poll(()=>page.evaluate(
  ()=>TPBattleView.current?.wildTeam?.count
 )).toBe(count);
 await expect.poll(()=>page.evaluate(()=>({
  starting:TPWildTeam.starting,busy:TPCollection.busy,gate:tpSaveReplacing
 }))).toEqual({starting:false,busy:false,gate:false});
}

async function state(page){
 return page.evaluate(()=>({
  team:TPWildTeam.view,
  round:fns.battleRound(),
  rests:Module.ccall('tp_battle_rest_uses_left','number',[],[]),
  activeCare:TPCollection.read().active
 }));
}

async function teamMenu(page){
 const menu=await page.evaluate(()=>TPBattleView.menu);
 if(menu==='moves'||menu==='info')await H.battleAction(page,'back');
 if(menu!=='team')await H.battleAction(page,'info');
 await expect.poll(()=>page.evaluate(()=>TPBattleView.menu)).toBe('team');
}

async function finish(page){
 for(let i=0;i<80;i++){
  const stopped=await page.evaluate(()=>
   !!fns.battleResolved()||!!TPWildTeam.view?.needsSwitch
  );
  if(stopped)break;
  await H.battleAction(page,'heavy');
 }
 expect(await page.evaluate(()=>!!fns.battleResolved())).toBe(true);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);
}

test.beforeEach(async({page})=>{await H.prepare(page);});

test('P05 UI: voluntary switch costs a turn, retains HP and shares heals',
 async({page})=>{
  const seed=await setup(page);
  await start(page,2);

  await expect.poll(()=>page.evaluate(
   ()=>TPBattleView.teamIndicators?.player.map(p=>p.ready)
  )).toEqual([true,true]);
  expect(await page.evaluate(
   ()=>TPBattleView.teamIndicators.enemy.length
  )).toBe(1);

  await H.battleAction(page,'rest');
  const first=await state(page);
  expect(first.rests).toBe(1);

  await teamMenu(page);
  expect(await page.evaluate(()=>TPBattleView.target('member0'))).toBe(null);
  await H.battleAction(page,'member1');
  const switched=await state(page);

  expect(switched.team.active).toBe(1);
  expect(switched.round).toBe(first.round+1);
  expect(switched.rests).toBe(1);
  expect(switched.team.members[0].hp).toBe(first.team.members[0].hp);
  expect(switched.team.members[1].hp)
   .toBeLessThan(switched.team.members[1].maxHp);
  expect(switched.activeCare).toBe(seed.active);
  await expect.poll(()=>page.evaluate(
   ()=>TPBattleView.current?.player.nick
  )).toBe('P05 Beta');

  await teamMenu(page);
  await H.battleAction(page,'member0');
  const returned=await state(page);
  expect(returned.team.active).toBe(0);
  expect(returned.round).toBe(switched.round+1);
  expect(returned.rests).toBe(1);
  expect(returned.team.members[0].hp)
   .toBeLessThan(first.team.members[0].hp);
  expect(returned.team.members[1].hp)
   .toBe(switched.team.members[1].hp);
  expect(returned.activeCare).toBe(seed.active);
 });

test('P05 UI: forced switch, defeated indicators and actual winner level after reload',
 async({page})=>{
  const seed=await setup(page,{weak:true});
  await start(page,2);

  for(let i=0;i<20;i++){
   if(await page.evaluate(()=>TPWildTeam.view.needsSwitch))break;
   await H.battleAction(page,'heavy');
  }
  await expect.poll(()=>page.evaluate(
   ()=>TPWildTeam.view.needsSwitch
  )).toBe(true);
  await expect.poll(()=>page.evaluate(
   ()=>TPBattleView.teamIndicators?.player.map(p=>p.ready)
  )).toEqual([false,true]);
  await expect.poll(()=>page.evaluate(
   ()=>TPBattleView.target('member1')!==null
  )).toBe(true);

  expect(await page.evaluate(()=>TPBattleView.target('member0'))).toBe(null);
  expect(await page.evaluate(()=>TPBattleView.target('heavy'))).toBe(null);
  const before=await state(page);
  await H.battleAction(page,'member1');
  const after=await state(page);

  expect(after.round).toBe(before.round);
  expect(after.team.members[1].hp).toBe(after.team.members[1].maxHp);
  expect(after.team.members[0].hp).toBe(0);
  expect(after.activeCare).toBe(seed.active);

  await finish(page);
  await expect.poll(()=>page.evaluate(id=>
   TPCollection.read().mons.find(m=>m.id===id).level,seed.ids[1]
  )).toBe(31);
  await expect.poll(()=>page.evaluate(
   ()=>TPWildTeam.view.resultPending
  )).toBe(false);
  await expect.poll(()=>page.evaluate(
   ()=>TPBattleView.teamIndicators?.enemy.map(p=>p.ready)
  )).toEqual([false]);

  expect(await page.evaluate(id=>
   TPCollection.read().mons.find(m=>m.id===id).level,seed.ids[0]
  )).toBe(1);
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(seed.active);

  await page.reload();await H.waitReady(page);await H.game(page);
  expect(await page.evaluate(id=>
   TPCollection.read().mons.find(m=>m.id===id).level,seed.ids[1]
  )).toBe(31);
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(seed.active);
 });

test('P05 UI: empty plan uses the existing care individual without making a copy',
 async({page})=>{
  const seed=await setup(page,{empty:true});
  await start(page,1);
  const battle=await state(page);

  expect(battle.team.members[0].id).toBe(seed.active);
  expect(battle.activeCare).toBe(seed.active);
  expect(await page.evaluate(()=>TPCollection.read().team)).toEqual([]);
  expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(1);
  await expect.poll(()=>page.evaluate(
   ()=>TPBattleView.teamIndicators?.player.length
  )).toBe(1);

  await H.battleAction(page,'abort');
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
  expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(1);
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(seed.active);
 });

test('P05 UI: result quota exposes retry, then catch does not repeat the level reward',
 async({page})=>{
  const seed=await setup(page);
  await start(page,2);
  const before=await page.evaluate(()=>TPCollection.read());

  await page.evaluate(()=>{
   window.__p05UiWrite=writeSave;
   writeSave=async(bytes,force=false)=>{
    if(force)throw Error('P05 UI intentional result quota');
    return window.__p05UiWrite(bytes,force);
   };
  });
  await finish(page);

  await expect.poll(()=>page.evaluate(
   ()=>TPBattleView.target('resultRetry')!==null
  )).toBe(true);
  expect(await page.evaluate(()=>TPCollection.read())).toEqual(before);
  expect(await page.evaluate(()=>TPWildTeam.view.resultPending)).toBe(true);
  expect(await page.evaluate(()=>TPBattleView.target('catch'))).toBe(null);
  expect(await page.evaluate(()=>TPBattleView.target('ok'))).toBe(null);

  await page.evaluate(()=>{writeSave=window.__p05UiWrite;});
  await H.battleAction(page,'resultRetry');
  await expect.poll(()=>page.evaluate(id=>
   TPCollection.read().mons.find(m=>m.id===id).level,seed.ids[0]
  )).toBe(21);
  await expect.poll(()=>page.evaluate(
   ()=>TPBattleView.target('catch')!==null
  )).toBe(true);

  await H.battleAction(page,'catch');
  await expect.poll(()=>page.evaluate(
   ()=>!!TPBattleView.capture?.committed
  )).toBe(true);
  await expect.poll(()=>page.evaluate(()=>TPCollection.busy)).toBe(false);
  expect(await page.evaluate(id=>
   TPCollection.read().mons.find(m=>m.id===id).level,seed.ids[0]
  )).toBe(21);
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(seed.active);
 });

test('P05 UI: preparation write failure does not open a battle and a new start succeeds',
 async({page})=>{
  await setup(page);
  const before=await page.evaluate(()=>TPCollection.read());

  await page.evaluate(()=>{
   window.__p05PrepareWrite=writeSave;
   writeSave=async(bytes,force=false)=>{
    if(force)throw Error('P05 UI intentional preparation quota');
    return window.__p05PrepareWrite(bytes,force);
   };
  });
  await H.tap(page,103,308);
  await expect.poll(()=>page.evaluate(()=>TPWildTeam.notice.length>0))
   .toBe(true);
  expect(await page.evaluate(()=>screen)).toBe('card');
  expect(await page.evaluate(()=>
   Module.ccall('tp_battle_is_open','number',[],[])
  )).toBe(0);
  expect(await page.evaluate(()=>TPCollection.read())).toEqual(before);
  expect(await page.evaluate(()=>({
   busy:TPCollection.busy,gate:tpSaveReplacing
  }))).toEqual({busy:false,gate:false});

  await page.evaluate(()=>{writeSave=window.__p05PrepareWrite;});
  await start(page,2);
 });
