
'use strict';
const LU=require('./league-ui-helpers');

const {test,expect}=require('@playwright/test');
const H=require('./helpers');
async function menu(page){
 await H.game(page);await H.tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
}
async function choose(page,id){
 const target=await page.evaluate(id=>TPActions.targets.find(item=>item.id===id),id);
 expect(target?.enabled,id).toBe(true);
 await H.tap(page,target.x+target.w/2,target.y+target.h/2);
}
test('UI01 Pokéball: nur vier Haupticons, Außenklick und Spielen',async({page})=>{
 await H.prepare(page);await menu(page);
 expect(await page.evaluate(()=>TPActions.targets.map(item=>item.id)))
  .toEqual(['games','training','battle','expedition']);
 const bond=await page.evaluate(()=>fns.bond());
 await H.tap(page,233,200);
 expect(await page.evaluate(()=>TPActions.active)).toBe(false);
 expect(await page.evaluate(()=>fns.bond())).toBe(bond);
 await menu(page);await choose(page,'games');
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('gamemenu');
 await page.locator('#tp-games-page [data-play-focus="back"]').click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
});
for(const width of [320,390,430]){
 test('UI01 Training: eigene Seite, Auswahl ohne Start und Rückweg bei '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await menu(page);await choose(page,'training');
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
  const root=page.locator('#tp-activity-page');
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute('data-activity-page','training');
  await expect(root.locator('.tp-training-scene')).toBeVisible();
  await expect(root.locator('.tp-training-caption')).toHaveText('Kraft aufbauen');
  await expect(root.locator('.tp-training-tags')).toContainText('10 s');
  await expect(root.locator('.tp-activity-metric')).toHaveCount(0);
  expect(await page.evaluate(()=>TPActions.active)).toBe(false);
  await expect(root.locator('[data-activity-choice]')).toHaveCount(3);
  const before=await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()));
  for(const id of ['strength','defence','speed']){
   await root.locator('[data-activity-choice="'+id+'"]').click();
   await expect(root.locator('[data-activity-choice="'+id+'"]'))
    .toHaveAttribute('aria-pressed','true');
   expect(await page.evaluate(()=>screen)).toBe('activity');
   expect(await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()))).toBe(before);
   const start=root.locator('[data-activity-start="'+id+'"]');
   await expect(start).toBeVisible();await expect(start).toBeEnabled();
   const column=await root.locator('.tp-activity-right').boundingBox();
   const button=await start.boundingBox();
   expect(button.height).toBeGreaterThanOrEqual(44);
   expect(button.x).toBeGreaterThanOrEqual(column.x-1);
   expect(button.x+button.width).toBeLessThanOrEqual(column.x+column.width+1);
   expect(button.y+button.height).toBeLessThanOrEqual(column.y+column.height+1);
   await start.click();
   await expect.poll(()=>page.evaluate(()=>screen)).toBe('game');
   await H.tap(page,233,422);
   await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
   await expect(root).toBeVisible();
  }
  await root.getByRole('button',{name:'Zurück',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 });
}


for(const width of [320,390,430]){
 test('UI01 Kampf: vier Einträge links, Vorschau und Aktion rechts '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await menu(page);await choose(page,'battle');
  const root=page.locator('#tp-activity-page');
  await expect(root).toHaveAttribute('data-battle-view','wild');
  await expect(root.locator('.tp-activity-left [data-activity-choice]')).toHaveCount(4);
  await expect(root.locator('.tp-activity-right [data-activity-choice]')).toHaveCount(0);
  await expect(root.locator('.tp-activity-right .tp-battle-scene')).toBeVisible();

  const before=await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()));
  for(const id of ['wild','trainer','arena','league']){
   const choice=root.locator('.tp-activity-left [data-activity-choice="'+id+'"]');
   await choice.scrollIntoViewIfNeeded();
   await choice.click();
   await expect(choice).toHaveAttribute('aria-pressed','true');
   await expect(root).toHaveAttribute('data-battle-view',id);
   await expect(root.locator('.tp-activity-right .tp-battle-scene'))
    .toHaveAttribute('data-preview-scene',id);
   const column=await root.locator('.tp-activity-left').boundingBox();
   const box=await choice.boundingBox();
   expect(box.height).toBeGreaterThanOrEqual(44);
   expect(box.x).toBeGreaterThanOrEqual(column.x-1);
   expect(box.x+box.width).toBeLessThanOrEqual(column.x+column.width+1);

   await expect(root.locator('.tp-activity-right .tp-battle-scene')).toBeVisible();
   await expect(root.locator('.tp-activity-right .tp-battle-caption')).toBeVisible();
   const start=root.locator('.tp-activity-right [data-activity-start="'+id+'"]');
   await expect(start).toBeVisible();
   const right=await root.locator('.tp-activity-right').boundingBox();
   const action=await start.boundingBox();
   expect(action.height).toBeGreaterThanOrEqual(44);
   expect(action.x).toBeGreaterThanOrEqual(right.x-1);
   expect(action.x+action.width).toBeLessThanOrEqual(right.x+right.width+1);
   expect(action.y+action.height).toBeLessThanOrEqual(right.y+right.height+1);
   expect(await page.evaluate(()=>screen)).toBe('activity');
   expect(await page.evaluate(()=>
    Module.ccall('tp_battle_is_open','number',[],[])
   )).toBe(0);
   expect(await page.evaluate(()=>
    TPCollectionModel.encode(TPCollection.read())
   )).toBe(before);

   if(id!=='wild'){
    await start.click();
    await expect.poll(()=>page.evaluate(()=>screen)).toBe(id);
    if(id==='arena')
     await page.locator('#tp-arena-page [data-arena-exit]').click();
    else if(id==='league')await LU.back(page);else await H.tap(page,233,390);
    await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
    await expect(root).toHaveAttribute('data-battle-view',id);
   await expect(root.locator('.tp-activity-right .tp-battle-scene'))
    .toHaveAttribute('data-preview-scene',id);
    await expect(root.locator('.tp-activity-left [data-activity-choice]')).toHaveCount(4);
   }
  }
  await root.getByRole('button',{name:'Zurück',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 });
}

test('UI01 Expedition: vorhandener eigenständiger Einstieg bleibt erhalten',async({page})=>{
 await H.prepare(page);await H.game(page);
 const before=await page.evaluate(()=>cardPage);
 await menu(page);await choose(page,'expedition');
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('expedition');
 expect(await page.evaluate(()=>cardPage)).toBe(before);
 await page.locator('#tp-expedition-page [data-exp-back]').click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
});


test('UI01 Kampfvorschau: richtige Individuen, kein Start durch Auswahl',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await H.prepare(page);await H.game(page);
 const initial=await page.evaluate(async()=>{
  await TPCollectionGame.ensureCurrent();
  await TPCollection.apply('catchWild',{
   dex:25,level:17,nickname:'Teamstart',shiny:false,origin:'wild',
   data:{stats:{atk:42,def:31,spe:60},genes:null,training:null}
  },0);
  const lead=TPCollection.read().nextId-1;
  await TPCollection.apply('selectTeam',lead);
  await TPCollection.apply('moveTeam',lead,-1);
  return {lead,care:TPCollection.read().active,
   model:TPCollectionModel.encode(TPCollection.read())};
 });
 await menu(page);await choose(page,'battle');
 const root=page.locator('#tp-activity-page');
 await expect(root).toHaveAttribute('data-activity-page','battle');
 for(const [id,member]of [
  ['wild',initial.lead],['trainer',initial.care],['arena',initial.lead]
 ]){
  await root.locator('[data-activity-choice="'+id+'"]').click();
  const preview=root.locator('.tp-battle-scene');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute('data-preview-mon-id',String(member));
  await expect(root.locator('.tp-battle-caption')).toBeVisible();
  await expect(root.locator('.tp-activity-metric')).toHaveCount(0);
  expect(await page.evaluate(()=>screen)).toBe('activity');
  expect(await page.evaluate(()=>
   Module.ccall('tp_battle_is_open','number',[],[])
  )).toBe(0);
  expect(await page.evaluate(()=>
   TPCollectionModel.encode(TPCollection.read())
  )).toBe(initial.model);
  const column=await root.locator('.tp-activity-right').boundingBox();
  const start=await root.locator('[data-activity-start="'+id+'"]').boundingBox();
  expect(start.height).toBeGreaterThanOrEqual(44);
  expect(start.x).toBeGreaterThanOrEqual(column.x-1);
  expect(start.x+start.width).toBeLessThanOrEqual(column.x+column.width+1);
  expect(start.y+start.height).toBeLessThanOrEqual(column.y+column.height+1);
 }
});


test('UI01 Wildkampf: echter Start aus Aktivität und Rückkehr',async({page})=>{
 await H.prepare(page);await menu(page);await choose(page,'battle');
 const root=page.locator('#tp-activity-page');
 await root.locator('[data-activity-choice="wild"]').click();
 await page.evaluate(()=>{
  window.__wildStartFailure=null;
  const previous=window.TPDiagnostics;
  if(previous)window.TPDiagnostics={...previous,record(kind,error){
   window.__wildStartFailure={
    kind,code:error?.code||'',message:error?.message||String(error)
   };
   previous.record(kind,error);
  }};
 });
 const start=root.locator('[data-activity-start="wild"]');
 await expect(start).toBeEnabled();
 await start.click();
 await expect.poll(()=>page.evaluate(()=>({
  screen,notice:TPWildTeam.notice||'',error:window.__wildStartFailure
 })),{timeout:10000}).toMatchObject({screen:'battle'});
 expect(await page.evaluate(()=>
  Module.ccall('tp_battle_is_open','number',[],[])
 )).toBe(1);
 expect(await page.evaluate(()=>battleReturn)).toBe('activity');
 await H.battleAction(page,'abort');
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
 await expect(root).toBeVisible();
 await expect(root).toHaveAttribute('data-battle-view','wild');
});


test('Kampf-Auswahl: Region oben statt im scrollbaren rechten Display',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await H.prepare(page);await menu(page);await choose(page,'battle');
 const root=page.locator('#tp-activity-page');
 await root.locator('[data-activity-choice="league"]').click();
 await expect(root.locator('.tp-activity-right [data-battle-region]')).toHaveCount(0);
 await expect(root.locator('[data-battle-region-toggle]')).toBeVisible();
 const before=await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()));
 await root.locator('[data-battle-region-toggle]').click();
 await expect(root.locator('.tp-activity-left [data-battle-region]')).toHaveCount(2);
 await root.locator('[data-battle-region="0"]').click();
 await expect(root.locator('[data-activity-choice]')).toHaveCount(4);
 expect(await page.evaluate(()=>TPRegions.selected)).toBe(0);
 expect(await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()))).toBe(before);
 expect(await page.evaluate(()=>screen)).toBe('activity');
});
