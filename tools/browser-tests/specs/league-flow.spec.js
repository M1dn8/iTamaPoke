 'use strict';
const HU=require('./hall-ui-helpers');

const LU=require('./league-ui-helpers');

const AU=require('./arena-ui-helpers');

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
  agver:1,agmask:255,jagver:1,jagmask:170,
  age:1740,gatk:3000,gdef:3000,gspe:3000,
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
 await H.openArenaSelection(page);
 if(await page.evaluate(()=>TPArena.region)!==region){
  await AU.option(page,'regions');
  await expect.poll(()=>page.evaluate(()=>TPArena.choosingRegion)).toBe(true);
  await page.waitForFunction(()=>!TPRegions.locked());
  await AU.region(page,region);
 }
 await expect.poll(()=>page.evaluate(()=>TPArena.region)).toBe(region);
 await AU.option(page,'league');
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('league');
 await quiet(page);
 await expect.poll(()=>page.evaluate(()=>TPLeague.state?.teamMode)).toBe(true);
}
async function setup(page,{region=0,weakFirst=false,allWeak=false}={}){
 if(region===1)await H.importSave(page,fixture(1),1);
 await H.game(page);
 const seed=await page.evaluate(async({weakFirst,allWeak})=>{
  await TPCollectionGame.ensureCurrent();
  const active=TPCollection.read().active,ids=[active];
  for(let i=0;i<5;i++){
   const weak=allWeak||weakFirst&&i===0;
   await TPCollection.apply('catchWild',{
    dex:[6,9,25,94,149][i],level:weak?1:30,
    nickname:['Glut','Welle','Funke','Spuk','Drache'][i],
    shiny:i===1,origin:'wild',
    data:{
     stats:weak?{atk:1,def:1,spe:1}:{atk:3000,def:3000,spe:3000},
     genes:null,training:null
    }
   },0);
   ids.push(TPCollection.read().nextId-1);
  }
  for(const id of [...TPCollection.read().team])
   if(id!==active)await TPCollection.apply('unselectTeam',id);
  for(const id of ids)
   if(!TPCollection.read().team.includes(id))
    await TPCollection.apply('selectTeam',id);
  const planned=TPCollection.read();
  if(planned.team.length!==6||planned.team[0]!==active||
     !planned.team.every((id,index)=>id===ids[index]))
   throw Error('Testteam muss aus Pflege-Pokémon und fünf weiteren Mitgliedern bestehen.');
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
 const before=await state(page);
 const target=Array.from({length:before.members.length},(_,offset)=>
  (index+offset)%before.members.length
 ).find(position=>before.members[position].hp>0);
 if(target===undefined)
  throw Error('Vorbereitung gescheitert: kein kampffähiges Teammitglied mehr.');
 if(before.active===target&&!before.needsSwitch)return;
 if(!before.needsSwitch)await teamMenu(page);
 await action(page,'member'+target);
 const after=await state(page);
 expect(after.active).toBe(target);
 if(before.needsSwitch){
  expect(after.needsSwitch).toBe(0);
  expect(after.round).toBe(before.round);
  expect(after.enemyHp).toBe(before.enemyHp);
  expect(after.hp).toBe(before.members[target].hp);
  expect(after.members[before.active].hp).toBe(0);
  console.log('Erzwungener Wechsel geprüft:',before.index,
   before.active+' → '+target);
 }
}
async function start(page){
 await LU.start(page);
 await expect.poll(()=>page.evaluate(()=>({
  live:TPLeague.state.live,team:TPLeague.state.teamMode,
  busy:TPLeague.busy,gate:tpSaveReplacing
 }))).toEqual({live:1,team:true,busy:false,gate:false});
 await rendered(page);
}
async function resume(page){
 await LU.resume(page);
 await expect.poll(()=>page.evaluate(()=>TPLeague.state.live)).toBe(1);
 await quiet(page);await rendered(page);
}
async function beatCurrent(page,{retry=false,final=false}={}){
 const index=(await state(page)).index;
 let winnerId=null;
 for(let turn=0;turn<80;turn++){
  const v=await state(page);
  if(!v.live||v.resolved)break;
  if(v.needsSwitch){
   await select(page,(v.active+1)%v.members.length);
   continue;
  }
  winnerId=v.members[v.active].id;
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
 return winnerId;
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




test('Liga-Ablauf: Einzelsieg kompakt, Trainerwechsel und Reload als Übersicht',
async({page})=>{
 test.setTimeout(180000);
 await H.prepare(page);await H.importSave(page,fixture(),1);
 await setup(page);await start(page);await select(page,1);
 const teamBefore=await page.evaluate(()=>({
  round:TPLeague.state.round,hp:TPLeague.state.hp,active:TPLeague.state.active,
  members:TPLeague.state.members.map(m=>({id:m.id,hp:m.hp,rests:m.rests}))
 }));
 await H.battleAction(page,'info');
 const choices=page.locator('#tp-battle-page [data-battle-action^="member"]');
 await expect(choices).toHaveCount(6);
 await expect(choices.locator('.tp-battle-team-image')).toHaveCount(6);
 const teamLayout=await page.locator('#tp-battle-page .tp-battle-content').evaluate(el=>({
  height:el.clientHeight,scrollHeight:el.scrollHeight,
  width:el.clientWidth,scrollWidth:el.scrollWidth
 }));
 expect(teamLayout.scrollHeight).toBeLessThanOrEqual(teamLayout.height+1);
 expect(teamLayout.scrollWidth).toBeLessThanOrEqual(teamLayout.width+1);

 for(let i=0;i<6;i++){
  const member=await page.evaluate(i=>TPLeague.state.members[i],i);
  await expect(choices.nth(i).locator('.tp-battle-team-copy'))
   .toContainText(member.hp+'/'+member.maxHp+' KP');
 }
 await H.battleAction(page,'back');
 expect(await page.evaluate(()=>({
  round:TPLeague.state.round,hp:TPLeague.state.hp,active:TPLeague.state.active,
  members:TPLeague.state.members.map(m=>({id:m.id,hp:m.hp,rests:m.rests}))
 }))).toEqual(teamBefore);


 const originalDisk=await disk(page);
 await rejectWrite(page);
 await beatCurrent(page,{retry:true});
 expect(await disk(page)).toEqual(originalDisk);
 await expect(page.locator('#tp-league-page[data-league-view="victory"]:visible'))
  .toHaveCount(0);
 expect(await page.evaluate(()=>TPBattleView.target('next'))).toBe(null);

 await restoreWrite(page);
 await H.battleAction(page,'retry');
 await expect.poll(()=>page.evaluate(()=>TPLeague.diagnostics.phase)).toBe('checkpoint');
 await quiet(page);
 const root=page.locator(
  '#tp-league-page:visible:not([aria-hidden="true"]),'+
  '#tp-battle-page[data-battle-state="saved"]:visible'
 );
 await expect(root).toHaveAttribute('data-league-view','victory');
 await expect(root.getByRole('heading',{name:'Sieg gespeichert'})).toBeVisible();
 expect((await state(page)).live).toBe(0);
 expect((await state(page)).index).toBe(1);

 const saved=await savedRun(page,0);
 await H.tap(page,100,150);
 expect(await savedRun(page,0)).toEqual(saved);
 expect((await state(page)).live).toBe(0);

 await page.reload();await H.waitReady(page);await openLeague(page,0);
 await expect(root).toHaveAttribute('data-league-view','checkpoint');
 expect(await savedRun(page,0)).toEqual(saved);

 for(let index=1;index<5;index++){
  await resume(page);
  expect((await state(page)).index).toBe(index);
  await beatCurrent(page);
  await expect(root).toHaveAttribute(
   'data-league-view',index===4?'checkpoint':'victory'
  );
  expect((await state(page)).live).toBe(0);
  if(index===2){
   const before=await savedRun(page,0);
   await root.locator('[data-league-saved-overview]').click();
   await expect(root).toHaveAttribute('data-league-view','checkpoint');
   expect(await savedRun(page,0)).toEqual(before);
  }
 }
 expect((await savedRun(page,0)).index).toBe(5);
 await expect(root.locator('.tp-checkpoint-heals')).toHaveCount(0);
 await expect(root.locator('.tp-checkpoint-saved>h3')).toHaveText('Dein Team');
});
