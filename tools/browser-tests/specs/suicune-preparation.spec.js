 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const path=require('node:path');

function fixture(mask=15,unlocked=true){
 const base=H.fixture(0),fields=new Map();
 let at=4;
 for(let i=0;i<base.readUInt32LE(0);i++){
  const length=base[at++];
  const key=base.toString('utf8',at,at+length);at+=length;
  const type=base[at++],size=base.readUInt32LE(at);at+=4;
  fields.set(key,[type,Buffer.from(base.subarray(at,at+size))]);at+=size;
 }
 const extra={
  agver:1,agmask:255,jagver:1,jagmask:mask,
  lgver:1,lgkdone:unlocked,lgkdate:unlocked?1700000000:0
 };
 for(const [key,value] of Object.entries(extra)){
  const data=typeof value==='boolean'?Buffer.from([+value]):Buffer.alloc(8);
  if(typeof value!=='boolean')data.writeBigInt64LE(BigInt(value));
  fields.set(key,[typeof value==='boolean'?0:1,data]);
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);
 return Buffer.concat([count,...Array.from(fields,([key,[type,data]])=>{
  const name=Buffer.from(key),length=Buffer.alloc(4);
  length.writeUInt32LE(data.length);
  return Buffer.concat([
   Buffer.from([name.length]),name,Buffer.from([type]),length,data
  ]);
 })]);
}

async function prepared(page,unlocked=true){
 await H.prepare(page,fixture(15,unlocked));
 await H.game(page);
 await page.waitForFunction(()=>window.TPSuicune?.supported===true);
 await page.evaluate(async()=>{await TPCollectionGame.ensureCurrent();});
 await page.waitForFunction(()=>
  !tpSaveReplacing&&!TPCollection.busy&&!TPCollection.blocked
 );
}
async function disk(page){
 return page.evaluate(async()=>Array.from(new Uint8Array(await loadSave())));
}
async function state(page){
 return page.evaluate(()=>({
  story:TPSuicune.read().step,
  native:Module.ccall('tp_story_step','number',['number'],[245]),
  busy:TPCollection.busy,
  blocked:TPCollection.blocked,
  replacing:tpSaveReplacing,
  pending:Module.ccall('tp_f4_store_pending','number',[],[])
 }));
}
async function kanto(page){
 return page.evaluate(()=>{
  const values=TPStoreTools.parseLegacy(exportStateBytes(Module)).values;
  return ['agver','agmask','lgver','lgkdone','lgkdate'].map(
   key=>[key,values.get(key).type,values.get(key).value]
  );
 });
}

test('P07a Suicune: vier Johto-Orden umgehen das Regionsgate nicht',async({page})=>{
 await prepared(page,false);
 expect(await page.evaluate(()=>TPSuicune.access().badges)).toBe(4);
 expect(await page.evaluate(()=>TPSuicune.access().unlocked)).toBe(false);
 const before=await disk(page);
 const result=await page.evaluate(async()=>{
  try{
   await TPSuicune.advance('investigate');
   return 'unexpected-success';
  }catch(error){return error.code||error.message;}
 });
 expect(result).toBe('NATIVE_SUICUNE_ADVANCE_REFUSED');
 expect(await disk(page)).toEqual(before);
 expect(await state(page)).toEqual({
  story:0,native:0,busy:false,blocked:false,replacing:false,pending:0
 });
});

test('P07a Suicune: echte Speicherung, Fehler-Rollback und Reload der Quelle',async({page})=>{
 await prepared(page,true);
 expect(await page.evaluate(()=>TPSuicune.access().unlocked)).toBe(true);
 const originalKanto=await kanto(page);

 await page.evaluate(async()=>{await TPSuicune.advance('investigate');});
 expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(1);
 const before=await disk(page);

 await page.evaluate(()=>{
  window.p07aOriginalWrite=writeSave;
  window.p07aWriteReached=false;
  window.p07aOutcome='pending';
  writeSave=async function(bytes,force=false){
   const step=Module.ccall('tp_story_step','number',['number'],[245]);
   if(force&&step===2){
    window.p07aWriteReached=true;
    return new Promise((resolve,reject)=>{window.p07aRejectWrite=reject;});
   }
   return window.p07aOriginalWrite(bytes,force);
  };
  window.p07aCompletion=TPSuicune.advance('secure',[2,0,0]).then(
   ()=>{window.p07aOutcome='resolved';},
   error=>{
    window.p07aOutcome='rejected';
    window.p07aFailure=error.code||error.message;
   }
  );
 });

 await page.waitForFunction(()=>window.p07aWriteReached===true);
 expect(await state(page)).toEqual({
  story:1,native:2,busy:true,blocked:false,replacing:true,pending:1
 });
 expect(await disk(page)).toEqual(before);

 await page.evaluate(()=>{
  window.p07aRejectWrite(Error('P07a intentional source-save failure'));
 });
 await expect.poll(()=>page.evaluate(()=>window.p07aOutcome)).toBe('rejected');
 await page.evaluate(()=>window.p07aCompletion);
 expect(await state(page)).toEqual({
  story:1,native:1,busy:false,blocked:false,replacing:false,pending:0
 });
 expect(await disk(page)).toEqual(before);
 expect(await kanto(page)).toEqual(originalKanto);

 await page.evaluate(async()=>{
  writeSave=window.p07aOriginalWrite;
  await TPSuicune.advance('secure',[2,0,2]);
 });
 expect(await state(page)).toEqual({
  story:2,native:2,busy:false,blocked:false,replacing:false,pending:0
 });
 expect(await page.evaluate(()=>TPSuicune.view().phase)).toBe('duel');

 const stored=await disk(page);
 expect(stored).not.toEqual(before);
 const storedStep=await page.evaluate(async()=>{
  const parsed=TPStoreTools.parseLegacy(new Uint8Array(await loadSave()));
  return parsed.values.get('suistep').value;
 });
 expect(storedStep).toBe(2);
 expect(await kanto(page)).toEqual(originalKanto);

 await page.reload();
 await H.waitReady(page);
 await page.waitForFunction(()=>window.TPSuicune?.supported===true);
 expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(2);
 expect(await page.evaluate(()=>TPSuicune.view().phase)).toBe('duel');
 expect(await kanto(page)).toEqual(originalKanto);

 const result=await page.evaluate(async()=>{
  try{
   await TPSuicune.advance('secure',[2,0,0]);
   return 'unexpected-success';
  }catch(error){return error.code||error.message;}
 });
 expect(result).toBe('INVALID_SUICUNE_TRANSITION');
});

test('P07a Suicune: sichtbare Bachbedienung speichert nur bestätigt',async({page})=>{
 async function loadStage(){
  for(const file of [
   'story-stage.js','story-narrative.js',
   'suicune-source-preview.js','suicune-story-stage.js'
  ])await page.addScriptTag({
   path:path.resolve(__dirname,'../../../browser_ver/web',file)
  });
  await page.evaluate(()=>TPSourceStoryStage.openLive());
 }
 async function reveal(stage,name){
  const button=stage.getByRole('button',{name,exact:true});
  const card=stage.locator('.tp-story-card');
  await expect(card).toHaveAttribute('data-pages',/^[1-9][0-9]*$/);
  const pages=Number(await card.getAttribute('data-pages'));
  for(let i=0;i<pages&&!await button.isVisible();i++){
   const next=card.locator('[data-story-next]');
   await expect(next).toBeEnabled();
   await next.click();
  }
  await expect(button).toBeVisible();
  return button;
 }
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  await prepared(page,true);
  const originalKanto=await kanto(page);
  await loadStage();
  const stage=page.locator('#tp-story-stage');
  await expect(stage).toHaveAttribute('data-sui-mode','live');
  await expect(stage).toHaveAttribute('data-sui-phase','intro');
  const start=await reveal(stage,'Wasserlauf verbinden');
  await start.click();
  await expect(stage).toHaveAttribute('data-sui-phase','puzzle');
  await expect(stage).toHaveAttribute('data-sui-saving','false');
  expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(1);
  const before=await disk(page);

  await page.evaluate(()=>{
   window.p07aVisibleOriginalWrite=writeSave;
   window.p07aVisibleWriteReached=false;
   writeSave=async function(bytes,force=false){
    const step=Module.ccall('tp_story_step','number',['number'],[245]);
    if(force&&step===2){
     window.p07aVisibleWriteReached=true;
     return new Promise((resolve,reject)=>{window.p07aVisibleReject=reject;});
    }
    return window.p07aVisibleOriginalWrite(bytes,force);
   };
  });
  for(const index of [0,0,1,1,1,2])
   await stage.locator('[data-sui-tile="'+index+'"]').click();

  await page.waitForFunction(()=>window.p07aVisibleWriteReached===true);
  await expect(stage).toHaveAttribute('data-sui-phase','puzzle');
  await expect(stage).toHaveAttribute('data-sui-saving','true');
  await expect(stage.getByRole('button',{name:'Zum anderen Ufer',exact:true}))
   .toHaveCount(0);
  for(const tile of await stage.locator('[data-sui-tile]').all())
   await expect(tile).toBeDisabled();
  const pending=await page.evaluate(()=>TPSuicuneSourcePreview.state());
  expect(pending.prototype).toBe(false);
  expect(pending.confirmedStep).toBe(1);
  expect(pending.saving).toBe(true);
  expect(await disk(page)).toEqual(before);

  await page.evaluate(()=>{
   window.p07aVisibleReject(Error('P07a visible source-save failure'));
  });
  await expect(stage).toHaveAttribute('data-sui-save-error','true');
  await expect(stage).toHaveAttribute('data-sui-saving','false');
  await expect(stage).toHaveAttribute('data-sui-phase','puzzle');
  expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(1);
  expect(await disk(page)).toEqual(before);

  const retry=stage.locator('[data-sui-save-retry]');
  await expect(retry).toBeVisible();
  await expect(retry).toBeEnabled();
  await page.evaluate(()=>{writeSave=window.p07aVisibleOriginalWrite;});
  await retry.click();
  await expect(stage).toHaveAttribute('data-sui-phase','clear');
  await expect(stage).toHaveAttribute('data-sui-saving','false');
  await expect(stage).toHaveAttribute('data-sui-save-error','false');
  await expect(stage.locator('.tp-sui-portrait')).toHaveCount(0);
  expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(2);
  expect(await page.evaluate(()=>TPSuicuneSourcePreview.state().confirmedStep)).toBe(2);
  expect(await kanto(page)).toEqual(originalKanto);
  expect(await page.evaluate(async()=>
   TPStoreTools.parseLegacy(new Uint8Array(await loadSave())).values.get('suistep').value
  )).toBe(2);

  await page.reload();
  await H.waitReady(page);
  await loadStage();
  await expect(stage).toHaveAttribute('data-sui-phase','clear');
  await expect(stage.locator('.tp-sui-portrait')).toHaveCount(0);
  const shore=await reveal(stage,'Zum anderen Ufer');
  await shore.click();
  await expect(stage).toHaveAttribute('data-story','suicune');
  await expect(stage.locator('canvas[data-dex="245"]')).toBeVisible();
  await expect(stage.locator('.tp-zapdos-challenge')).toBeEnabled();
  expect(await page.evaluate(()=>
   Module.ccall('tp_battle_is_open','number',[],[])
  )).toBe(0);
  await page.locator('#tp-game-shell').screenshot({
   path:test.info().outputPath('suicune-live-quelle-'+width+'.png')
  });

  const saved=await disk(page);
  await page.evaluate(()=>TPSuicuneSourcePreview.open(2));
  await expect(stage).toHaveAttribute('data-sui-mode','preview');
  for(const index of [0,0,1,1,1,2])
   await stage.locator('[data-sui-tile="'+index+'"]').click();
  await expect(stage).toHaveAttribute('data-sui-phase','clear');
  expect(await page.evaluate(()=>TPSuicuneSourcePreview.state().prototype)).toBe(true);
  expect(await disk(page)).toEqual(saved);
  expect(await kanto(page)).toEqual(originalKanto);
 }
});

for(const width of [320,390]){
 test('P07a Suicune: Katalog und regulärer Quellenstart '+width,async({page})=>{
  await page.setViewportSize({width,height:844});

  await prepared(page,false);
  await H.openStories(page);
  expect(await page.evaluate(()=>TPSuicune.access().badges)).toBe(4);
  expect(await page.evaluate(()=>TPSuicune.access().unlocked)).toBe(false);
  await expect(
   page.locator('#tp-stories-page button[data-story="suicune"]')
  ).toHaveCount(0);

  await prepared(page,true);
  await H.openStories(page);
  const before=await disk(page);
  const beforeAccess=await page.evaluate(()=>TPSuicune.access());
  await page.evaluate(()=>{
   window.p07aCatalogueWrite=writeSave;
   window.p07aCatalogueWrites=0;
   writeSave=async()=>{
    window.p07aCatalogueWrites++;
    throw Error('P07a catalogue selection must not write');
   };
  });
  try{
   const tile=await H.selectStory(page,'suicune');
   await expect(tile.locator('.tp-story-place-icon svg')).toBeVisible();
   await expect(page.locator('#tp-story-preview'))
    .toHaveAttribute('data-story','suicune');
   await expect(page.locator('#tp-story-preview p'))
    .toHaveText('Ein blauer Schimmer liegt über dem Wasser.');
   expect(await page.evaluate(()=>window.p07aCatalogueWrites)).toBe(0);
   expect(await page.evaluate(()=>TPSuicune.access())).toEqual(beforeAccess);
   expect(await disk(page)).toEqual(before);
  }finally{
   await page.evaluate(()=>{writeSave=window.p07aCatalogueWrite;});
  }

  await H.startStory(page,'suicune');
  const stage=page.locator('#tp-story-stage');
  await expect(stage).toBeVisible();
  await expect(stage).toHaveAttribute('data-sui-mode','live');
  await expect(stage).toHaveAttribute('data-sui-phase','intro');
  expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(0);

  const start=stage.getByRole('button',{name:'Wasserlauf verbinden',exact:true});
  const card=stage.locator('.tp-story-card');
  await expect(card).toHaveAttribute('data-pages',/^[1-9][0-9]*$/);
  const pages=Number(await card.getAttribute('data-pages'));
  for(let i=0;i<pages&&!await start.isVisible();i++){
   const next=card.locator('[data-story-next]');
   await expect(next).toBeEnabled();
   await next.click();
  }
  await expect(start).toBeVisible();
  await start.click();
  await expect(stage).toHaveAttribute('data-sui-phase','puzzle');
  await expect(stage).toHaveAttribute('data-sui-saving','false');
  expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(1);

  await page.reload();
  await H.waitReady(page);
  await H.openStories(page);
  await H.startStory(page,'suicune');
  await expect(stage).toHaveAttribute('data-sui-phase','puzzle');

  for(const index of [0,0,1,1,1,2])
   await stage.locator('[data-sui-tile="'+index+'"]').click();
  await expect(stage).toHaveAttribute('data-sui-phase','clear');
  await expect(stage).toHaveAttribute('data-sui-saving','false');
  expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(2);

  await page.reload();
  await H.waitReady(page);
  await H.openStories(page);
  await H.startStory(page,'suicune');
  await expect(stage).toHaveAttribute('data-sui-phase','clear');
  await expect(stage.locator('.tp-sui-portrait')).toHaveCount(0);
  expect(await page.evaluate(()=>
   Module.ccall('tp_battle_is_open','number',[],[])
  )).toBe(0);
 });
}

test('P07a Suicune: nativer Prüfkampfstart und Quellenerhalt',async({page})=>{
 await prepared(page,true);
 const originalKanto=await kanto(page);

 async function probe(){
  return page.evaluate(()=>{
   const call=(name,args=[])=>Module.ccall(
    name,'number',
    args.map(v=>typeof v==='string'?'string':'number'),args
   );
   const state=TPCollection.read();
   const ids=state.team.length?state.team:
    state.active===null?[]:[state.active];
   if(!ids.length||ids.length>6)throw Error('TEST_TEAM_UNAVAILABLE');
   if(call('tp_wt_stage_begin',[ids.length])!==1)
    throw Error('TEST_STAGE_REFUSED');
   for(let i=0;i<ids.length;i++){
    const member=state.mons.find(mon=>mon.id===ids[i]);
    const stats=member?.data.stats;
    if(!member||!stats)throw Error('TEST_STATS_UNAVAILABLE');
    if(call('tp_wt_stage_entry',[
     i,member.id,member.dex,member.level,
     stats.atk,stats.def,stats.spe,
     member.id===state.active?1:0,
     member.shiny?1:0,member.nickname
    ])!==1)throw Error('TEST_MEMBER_REFUSED');
   }
   try{
    const started=call('tp_story_duel_start',[245]);
    return {
     started,
     open:call('tp_battle_is_open'),
     owned:call('tp_story_duel_get',[245,0]),
     dex:started?fns.battleWildDex():null
    };
   }finally{
    if(call('tp_battle_is_open'))Module._tp_battle_close();
   }
  });
 }

 expect(await probe()).toEqual({
  started:0,open:0,owned:0,dex:null
 });
 expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(0);

 await page.evaluate(async()=>{
  await TPSuicune.advance('investigate');
  await TPSuicune.advance('secure',[2,0,0]);
  await TPSuicune.prepare();
 });
 const saved=await disk(page);
 const members=await page.evaluate(()=>TPCollection.read().mons.map(mon=>mon.id));

 expect(await probe()).toEqual({
  started:1,open:1,owned:1,dex:245
 });
 expect(await page.evaluate(()=>
  Module.ccall('tp_battle_is_open','number',[],[])
 )).toBe(0);
 expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(2);
 expect(await disk(page)).toEqual(saved);
 expect(await kanto(page)).toEqual(originalKanto);
 expect(await page.evaluate(()=>TPCollection.read().mons.map(mon=>mon.id)))
  .toEqual(members);

 await page.reload();
 await H.waitReady(page);
 expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(2);
 expect(await page.evaluate(()=>TPSuicune.view().phase)).toBe('duel');
 expect(await kanto(page)).toEqual(originalKanto);
});

test('P07a Suicune: gemeinsame Begegnung, Tippsperre und Rückkehr',async({page})=>{
 await prepared(page,true);
 await page.evaluate(async()=>{
  await TPSuicune.advance('investigate');
  await TPSuicune.advance('secure',[2,0,0]);
 });
 const originalKanto=await kanto(page);

 async function openEncounter(held=false){
  await H.openStories(page);
  await H.startStory(page,'suicune');
  const stage=page.locator('#tp-story-stage');
  await expect(stage).toHaveAttribute('data-sui-phase','clear');
  const shore=stage.getByRole('button',{name:'Zum anderen Ufer',exact:true});
  const card=stage.locator('.tp-story-card');
  await expect(card).toHaveAttribute('data-pages',/^[1-9][0-9]*$/);
  const pages=Number(await card.getAttribute('data-pages'));
  for(let i=0;i<pages&&!await shore.isVisible();i++){
   const next=card.locator('[data-story-next]');
   await expect(next).toBeEnabled();
   await next.click();
  }
  await expect(shore).toBeVisible();
  if(held)await page.evaluate(()=>{
   document.dispatchEvent(new PointerEvent('pointerdown',{
    pointerId:777,bubbles:true
   }));
  });
  await shore.click();
  await expect(stage).toHaveAttribute('data-story','suicune');
  await expect(stage.locator('canvas[data-dex="245"]')).toBeVisible();
  return stage.locator('.tp-zapdos-challenge');
 }

 const challenge=await openEncounter(true);
 expect(await page.evaluate(()=>TPSuicuneUI.start())).toBe(false);
 await page.evaluate(()=>{window.p07aHeldAt=performance.now();});
 await page.waitForFunction(()=>performance.now()-window.p07aHeldAt>=700);
 await expect(challenge).toBeDisabled();
 expect(await page.evaluate(()=>TPSuicuneUI.start())).toBe(false);

 expect(await page.evaluate(async()=>{
  document.dispatchEvent(new PointerEvent('pointerup',{
   pointerId:777,bubbles:true
  }));
  return TPSuicuneUI.start();
 })).toBe(false);

 const rapid=await page.evaluate(async()=>{
  const outcomes=[];
  for(let i=0;i<8;i++){
   document.dispatchEvent(new PointerEvent('pointerdown',{
    pointerId:888,bubbles:true
   }));
   outcomes.push(await TPSuicuneUI.start());
   document.dispatchEvent(new PointerEvent('pointerup',{
    pointerId:888,bubbles:true
   }));
  }
  return outcomes;
 });
 expect(rapid).toEqual(Array(8).fill(false));

 await expect(challenge).toBeEnabled();
 await challenge.click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.enemy.dex)).toBe(245);
 expect(await page.evaluate(()=>TPBattleView.current.enemy.level)).toBe(50);
 expect(await page.evaluate(()=>TPSuicuneUI.owns())).toBe(true);
 expect(await page.evaluate(()=>TPBattleView.current.catchAllowed)).toBe(false);

 expect(await page.evaluate(()=>TPSuicuneUI.abort(true))).toBe(true);
 await expect(page.locator('#tp-story-stage'))
  .toHaveAttribute('data-sui-phase','clear');
 expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(2);
 expect(await kanto(page)).toEqual(originalKanto);

 await page.reload();
 await H.waitReady(page);
 const retry=await openEncounter();
 await expect(retry).toBeEnabled();
 await retry.click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');

 const outcome=await page.evaluate(()=>{
  for(let i=0;i<80&&!fns.battleResolved();i++)
   Module._tp_battle_dodge();
  return {resolved:!!fns.battleResolved(),won:!!fns.battlePlayerWon()};
 });
 expect(outcome).toEqual({resolved:true,won:false});
 await expect.poll(()=>page.evaluate(()=>
  Module.ccall('tp_story_duel_get','number',['number','number'],[245,2])
 )).toBe(1);
 expect(await page.evaluate(()=>TPSuicuneUI.finish())).toBe(true);
 await expect(page.locator('#tp-story-stage'))
  .toHaveAttribute('data-sui-phase','clear');
 expect(await page.evaluate(()=>TPSuicune.read().step)).toBe(2);
 expect(await page.evaluate(()=>TPAdmission.read().pending)).toBeNull();
 expect(await kanto(page)).toEqual(originalKanto);
});
