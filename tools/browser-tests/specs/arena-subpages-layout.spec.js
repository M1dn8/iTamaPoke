
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers'),AU=require('./arena-ui-helpers');

async function openArena(page){
 await H.game(page);await H.tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
 const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
 await H.tap(page,target.x+target.w/2,target.y+target.h/2);
 await page.locator('[data-activity-choice="arena"]').click();
 await page.locator('[data-activity-start="arena"]').click();
 await expect(page.locator('#tp-arena-page')).toBeVisible();
}

for(const width of [320,390,430]){
 test('Arena-Unterseiten: Gegnerkarten, Koffer und Rückwege '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await openArena(page);
  const root=page.locator('#tp-arena-page');
  const before=await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()));
  const count=await page.evaluate(()=>TPKantoArena.leaders[0].team.length);
  await AU.details(page,0);
  await expect(root).toHaveAttribute('data-arena-view','detail');
  await expect(root.locator('[data-arena-member]')).toHaveCount(count);
  await expect(root.locator('.tp-arena-types>span').first()).toBeVisible();
  const right=await root.locator('.tp-arena-detail-actions').boundingBox();
  const button=await root.locator('[data-arena-challenge]').boundingBox();
  expect(button.height).toBeGreaterThanOrEqual(44);
  expect(button.x).toBeGreaterThanOrEqual(right.x-1);
  expect(button.x+button.width).toBeLessThanOrEqual(right.x+right.width+1);
  expect(button.y).toBeGreaterThanOrEqual(right.y-1);
  expect(button.y+button.height).toBeLessThanOrEqual(right.y+right.height+1);
  const display=await root.locator('.tp-activity-right').boundingBox();
  expect(button.y+button.height).toBeLessThanOrEqual(display.y+1);
  expect(await page.evaluate(()=>
   Module.ccall('tp_battle_is_open','number',[],[])
  )).toBe(0);
  expect(await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()))).toBe(before);
  await root.locator('[data-arena-subback]').click();
  await expect(root).toHaveAttribute('data-arena-view','leaders');

  await AU.option(page,'badges');
  await expect(root).toHaveAttribute('data-arena-view','case');
  const grid=root.locator('[data-arena-list="badges"]');
  await expect(grid.locator('[data-arena-case-badge]')).toHaveCount(8);
  expect(await grid.evaluate(el=>
   el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1
  )).toBe(true);
  await root.locator('[data-arena-case-badge="7"]').click();
  await expect(root.locator('[data-arena-case-badge="7"]'))
   .toHaveAttribute('aria-pressed','true');
  await root.locator('[data-arena-open]').click();
  await expect(root).toHaveAttribute('data-arena-view','detail');
  await root.locator('[data-arena-subback]').click();
  await expect(root).toHaveAttribute('data-arena-view','case');
  await root.locator('[data-arena-subback]').click();
  await expect(root).toHaveAttribute('data-arena-view','leaders');
  expect(await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()))).toBe(before);
 });
}


for(const width of [320,390,430]){
 test('Arena: Team nutzt beide Displays und Kofferpfeile respektieren Freigaben '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await openArena(page);
  const root=page.locator('#tp-arena-page');
  const largest=await page.evaluate(()=>
   TPKantoArena.leaders.reduce((best,leader,index)=>
    leader.team.length>TPKantoArena.leaders[best].team.length?index:best,0)
  );
  const count=await page.evaluate(index=>
   TPKantoArena.leaders[index].team.length,largest);
  await AU.details(page,largest);
  const lists=root.locator('.tp-arena-team-list');
  await expect(lists).toHaveCount(2);
  await expect(lists.nth(0).locator('[data-arena-member]'))
   .toHaveCount(Math.ceil(count/2));
  await expect(lists.nth(1).locator('[data-arena-member]'))
   .toHaveCount(Math.floor(count/2));
  expect(Math.ceil(count/2)).toBeLessThanOrEqual(3);
  for(let i=0;i<2;i++){
   expect(await lists.nth(i).evaluate(el=>
    el.scrollHeight<=el.clientHeight+1
   )).toBe(true);
  }
  await expect(root.locator('.tp-activity-right [data-arena-challenge]')).toHaveCount(0);
  await expect(root.locator('.tp-arena-detail-actions [data-arena-challenge]')).toBeVisible();
  const footer=await root.locator('.tp-arena-sub-footer').boundingBox();
  const costLabel=root.locator('.tp-arena-sub-footer .tp-arena-frame-status');
  await expect(costLabel).toBeVisible();
  const cost=await costLabel.boundingBox();
  expect(cost.x).toBeGreaterThanOrEqual(footer.x-1);
  expect(cost.x+cost.width).toBeLessThanOrEqual(footer.x+footer.width+1);
  expect(cost.y).toBeGreaterThanOrEqual(footer.y-1);
  expect(cost.y+cost.height).toBeLessThanOrEqual(footer.y+footer.height+1);
  const cards=await root.locator('[data-arena-member]').evaluateAll(items=>
   items.map(item=>{
    const box=item.getBoundingClientRect();
    return {bottom:box.bottom};
   })
  );
  expect(cards.length).toBeGreaterThan(0);
  for(const card of cards){
   expect(card.bottom,'Kosteninformation darf keine Pokémon-Karte überdecken')
    .toBeLessThanOrEqual(cost.y+1);
  }

  await root.locator('[data-arena-subback]').click();
  await AU.option(page,'badges');
  const previous=root.locator('[data-arena-case-prev]');
  const next=root.locator('[data-arena-case-next]');
  await expect(previous).toBeVisible();await expect(next).toBeVisible();
  await expect(previous).toBeDisabled();
  const before=await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()));
  if(await page.evaluate(()=>TPRegions.available(1))){
   await expect(next).toBeEnabled();await next.click();
   await expect.poll(()=>page.evaluate(()=>TPArena.region)).toBe(1);
   await expect(root).toHaveAttribute('data-arena-view','case');
   await expect(previous).toBeEnabled();await expect(next).toBeDisabled();
   await previous.click();
   await expect.poll(()=>page.evaluate(()=>TPArena.region)).toBe(0);
  }else{
   await expect(next).toBeDisabled();
   expect(await page.evaluate(()=>TPArena.region)).toBe(0);
  }
  expect(await page.evaluate(()=>TPCollectionModel.encode(TPCollection.read()))).toBe(before);
 });
}


for(const width of [320,390,430]){
 test('Arena: feste Kartengröße unabhängig vom Team und äußere Kofferpfeile '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await openArena(page);
  const root=page.locator('#tp-arena-page');
  await AU.details(page,0);
  const small=await root.locator('[data-arena-member]').first().boundingBox();
  await root.locator('[data-arena-subback]').click();

  const largest=await page.evaluate(()=>
   TPKantoArena.leaders.reduce((best,leader,index)=>
    leader.team.length>TPKantoArena.leaders[best].team.length?index:best,0)
  );
  await AU.details(page,largest);
  const large=await root.locator('[data-arena-member]').first().boundingBox();
  expect(Math.abs(small.height-large.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(small.width-large.width)).toBeLessThanOrEqual(1);
  await expect(root.locator('.tp-arena-detail-actions [data-arena-challenge]'))
   .toBeVisible();
  await expect(root.locator('.tp-arena-sub-footer [data-arena-challenge]'))
   .toHaveCount(0);
  await root.locator('[data-arena-subback]').click();

  await AU.option(page,'badges');
  const footer=await root.locator('.tp-arena-sub-footer').boundingBox();
  const previous=await root.locator('[data-arena-case-prev]').boundingBox();
  const next=await root.locator('[data-arena-case-next]').boundingBox();
  expect(Math.abs(previous.x-footer.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(next.x+next.width-footer.x-footer.width)).toBeLessThanOrEqual(1);
  expect(previous.height).toBeGreaterThanOrEqual(44);
  expect(next.height).toBeGreaterThanOrEqual(44);
 });
}


for(const width of [320,390,430]){
 test('Arena: VS-Grafik und Energiekosten tatsächlich mittig '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await openArena(page);await AU.details(page,0);
  const root=page.locator('#tp-arena-page');
  const button=root.locator('[data-arena-challenge]');
  const icon=button.locator('canvas[data-arena-icon="challenge-vs"]');
  await expect(icon).toBeVisible();
  const buttonBox=await button.boundingBox();
  const iconBox=await icon.boundingBox();
  expect(Math.abs(
   buttonBox.x+buttonBox.width/2-iconBox.x-iconBox.width/2
  )).toBeLessThanOrEqual(1);
  expect(Math.abs(
   buttonBox.y+buttonBox.height/2-iconBox.y-iconBox.height/2
  )).toBeLessThanOrEqual(1);

  const ink=await icon.evaluate(canvas=>{
   const ctx=canvas.getContext('2d');
   const image=ctx.getImageData(0,0,canvas.width,canvas.height);
   let left=canvas.width,top=canvas.height,right=-1,bottom=-1;
   for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
    if(image.data[(y*canvas.width+x)*4+3]){
     left=Math.min(left,x);right=Math.max(right,x);
     top=Math.min(top,y);bottom=Math.max(bottom,y);
    }
   }
   return {
    found:right>=left,
    dx:(left+right+1)/2-canvas.width/2,
    dy:(top+bottom+1)/2-canvas.height/2
   };
  });
  expect(ink.found).toBe(true);
  expect(Math.abs(ink.dx)).toBeLessThanOrEqual(1);
  expect(Math.abs(ink.dy)).toBeLessThanOrEqual(1);

  const footer=await root.locator('.tp-arena-sub-footer').boundingBox();
  const cost=await root.locator('.tp-arena-frame-status').boundingBox();
  expect(Math.abs(
   cost.x+cost.width/2-footer.x-footer.width/2
  )).toBeLessThanOrEqual(1);
 });
}
