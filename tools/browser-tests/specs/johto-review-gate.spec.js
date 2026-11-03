
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./johto-review-fixtures');

for(const item of F.createCases()){
 test('Johto-Review: echte Freischaltung und Ordenstand '+item.name,async({page})=>{
  await H.prepare(page,item.raw);
  await H.game(page);
  await expect.poll(()=>page.evaluate(()=>TPRegions.available(1)))
   .toBe(item.unlocked);

  await H.tap(page,157,404);
  await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
  const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
  await H.tap(page,target.x+target.w/2,target.y+target.h/2);
  await page.locator('[data-activity-choice="arena"]').click();
  await page.locator('[data-battle-region-toggle]').click();
  const johto=page.locator('[data-battle-region="1"]');

  if(!item.unlocked){
   await expect(johto).toBeDisabled();
   return;
  }

  await expect(johto).toBeEnabled();
  await johto.click();
  await page.locator('[data-activity-start="arena"]').click();
  const root=page.locator('#tp-arena-page');
  await expect(root).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>TPArena.region)).toBe(1);
  const actual=await page.evaluate(()=>
   TPRegions.call(Module,1,'tp_f3_mask','number',[])
  );
  expect(actual).toBe(item.mask);
  for(let i=0;i<8;i++){
   await expect(root.locator('[data-arena-leader="'+i+'"]'))
    .toHaveAttribute('data-owned',String(!!(item.mask&(1<<i))));
  }
  const league=root.locator('[data-arena-option="league"]');
  if(item.mask===255)await expect(league).toBeEnabled();
  else await expect(league).toBeDisabled();
 });
}
