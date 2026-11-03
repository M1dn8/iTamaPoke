
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

for(const width of [320,390,430]){
 test('Arena-Auswahl: zwei Displays, echte Leiter und kein Start durch Auswahl '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await H.game(page);
  await H.tap(page,157,404);
  await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
  const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
  await H.tap(page,target.x+target.w/2,target.y+target.h/2);
  await page.locator('[data-activity-choice="arena"]').click();
  await page.locator('[data-activity-start="arena"]').click();
  const root=page.locator('#tp-arena-page');
  await expect(root).toBeVisible();
  await expect(root.locator('.tp-activity-left [data-arena-leader]')).toHaveCount(8);
  await expect(root.locator('.tp-activity-right .tp-arena-portrait')).toBeVisible();
  const before=await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()));
  for(const index of [0,1,7]){
   const choice=root.locator('[data-arena-leader="'+index+'"]');
   await choice.click();
   await expect(choice).toHaveAttribute('aria-pressed','true');
   expect(await page.evaluate(()=>screen)).toBe('arena');
   expect(await page.evaluate(()=>
    Module.ccall('tp_battle_is_open','number',[],[])
   )).toBe(0);
   expect(await page.evaluate(()=>
    TPCollectionModel.encode(TPCollection.read())
   )).toBe(before);
   const right=await root.locator('.tp-activity-right').boundingBox();
   const open=await root.locator('[data-arena-open]').boundingBox();
   expect(open.height).toBeGreaterThanOrEqual(44);
   expect(open.x).toBeGreaterThanOrEqual(right.x-1);
   expect(open.x+open.width).toBeLessThanOrEqual(right.x+right.width+1);
   expect(open.y+open.height).toBeLessThanOrEqual(right.y+right.height+1);
  }
  await root.locator('[data-arena-exit]').click();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
  await expect(root).toBeHidden();
 });
}


for(const width of [320,390,430]){
 test('Arena: alle acht Orden ohne Scrollen und direkter Regionswechsel '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await H.game(page);await H.tap(page,157,404);
  await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
  const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
  await H.tap(page,target.x+target.w/2,target.y+target.h/2);
  await page.locator('[data-activity-choice="arena"]').click();
  await page.locator('[data-activity-start="arena"]').click();
  const root=page.locator('#tp-arena-page');

  async function assertGrid(){
   const grid=root.locator('[data-arena-list="badges"]');
   await expect(grid.locator('[data-arena-leader]')).toHaveCount(8);
   expect(await grid.evaluate(el=>
    el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1
   )).toBe(true);
   const bounds=await root.locator('.tp-activity-left').boundingBox();
   for(let i=0;i<8;i++){
    const button=grid.locator('[data-arena-leader="'+i+'"]');
    await expect(button).toBeVisible();
    await expect(button.locator('canvas')).toBeVisible();
    const box=await button.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(bounds.x-1);
    expect(box.y).toBeGreaterThanOrEqual(bounds.y-1);
    expect(box.x+box.width).toBeLessThanOrEqual(bounds.x+bounds.width+1);
    expect(box.y+box.height).toBeLessThanOrEqual(bounds.y+bounds.height+1);
   }
  }

  await assertGrid();
  const before=await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()));
  await root.locator('[data-arena-leader="7"]').click();
  await expect(root.locator('[data-arena-leader="7"]'))
   .toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()))).toBe(before);
  expect(await page.evaluate(()=>
   Module.ccall('tp_battle_is_open','number',[],[])
  )).toBe(0);

  await root.locator('[data-arena-region-toggle]').click();
  await expect(root.locator('[data-arena-region="0"]')).toBeVisible();
  const johto=root.locator('[data-arena-region="1"]');
  if(await page.evaluate(()=>TPRegions.available(1))){
   await johto.click();
   await expect.poll(()=>page.evaluate(()=>TPArena.region)).toBe(1);
   await assertGrid();
  }else{
   await expect(johto).toBeDisabled();
   await root.locator('[data-arena-region="0"]').click();
   await assertGrid();
  }
  await root.locator('[data-arena-exit]').click();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
 });
}


test('Arena-Rahmen: direkte Icons, richtige Liga-Sperre und reduzierte rechte Info',
async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await H.prepare(page);await H.game(page);await H.tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
 const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
 await H.tap(page,target.x+target.w/2,target.y+target.h/2);
 await page.locator('[data-activity-choice="arena"]').click();
 await page.locator('[data-activity-start="arena"]').click();
 const root=page.locator('#tp-arena-page');
 await expect(root).toBeVisible();
 await expect(root.locator('[data-arena-options]')).toHaveCount(0);
 const head=await root.locator('.tp-arena-actions').boundingBox();
 const display=await root.locator('.tp-activity-body').boundingBox();
 expect(Math.abs(head.x-display.x)).toBeLessThanOrEqual(1);
 expect(Math.abs(head.width-display.width)).toBeLessThanOrEqual(1);
 expect(head.y+head.height).toBeLessThanOrEqual(display.y+1);
 await expect(root.locator('.tp-activity-head [data-arena-exit]')).toBeVisible();
 for(const id of ['regions','badges','league']){
  const button=root.locator('[data-arena-option="'+id+'"]');
  await expect(button).toBeVisible();
  await expect(button.locator('canvas')).toBeVisible();
  const box=await button.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(box.x).toBeGreaterThanOrEqual(head.x-1);
  expect(box.x+box.width).toBeLessThanOrEqual(head.x+head.width+1);
  expect(box.y).toBeGreaterThanOrEqual(head.y-1);
  expect(box.y+box.height).toBeLessThanOrEqual(head.y+head.height+1);
 }
 const mask=await page.evaluate(()=>
  TPRegions.call(Module,TPArena.region,'tp_f3_mask','number',[])
 );
 const league=root.locator('[data-arena-option="league"]');
 if(mask>=0&&(mask&255)===255)await expect(league).toBeEnabled();
 else await expect(league).toBeDisabled();
 for(let i=0;i<8;i++)
  await expect(root.locator('[data-arena-leader="'+i+'"]'))
   .toHaveAttribute('data-owned',String(mask>=0&&!!(mask&(1<<i))));
 const info=root.locator('.tp-activity-right .tp-activity-info');
 await expect(info).not.toContainText('Noch offen');
 await expect(info).not.toContainText('Erhalten');
 await expect(info).not.toContainText(/\d+ Pokémon/);
 await expect(info).not.toContainText('Lv.');
});
