'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const AU=require('./arena-ui-helpers');
const T=require('../../../browser_ver/web/storage-tools.js');

function fixture(region,weak=false){
 const fields=T.parseLegacy(H.fixture(0)).values;
 for(const [key,value]of Object.entries({
  dexn:weak?10:376,eggT2:weak?10:376,age:weak?0:5940,bond:80,
  full:100,joy:100,ene:100,hyg:100,
  tatk:weak?0:100,tdef:weak?0:100,tspe:weak?0:100,
  agver:1,agmask:region===1?255:0,
  lgver:1,lgkdate:region===1?1700000000:0,
  jagver:1,jagmask:0,jlgver:1,jlgdate:0
 }))fields.set(key,{type:1,value});
 fields.set('lgkdone',{type:0,value:region===1});
 fields.set('jlgdone',{type:0,value:false});
 const chunks=[];
 for(const [key,{type,value}]of fields){
  const name=Buffer.from(key);
  let bytes;
  if(type===0)bytes=Buffer.from([Number(value)]);
  else if(type===1){
   bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));
  }else bytes=Buffer.from(value);
  const size=Buffer.alloc(4);size.writeUInt32LE(bytes.length);
  chunks.push(Buffer.concat([
   Buffer.from([name.length]),name,Buffer.from([type]),size,bytes
  ]));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);
 return Buffer.concat([count,...chunks]);
}
const mask=(page,region)=>page.evaluate(region=>
 TPRegions.call(Module,region,'tp_f3_mask','number',[]),region
);
const date=(page,region)=>page.evaluate(region=>
 TPRegions.call(Module,region,'tp_f3_date','number',[0]),region
);

async function winSeries(page){
 for(let opponent=0;opponent<6;opponent++){
  for(let turn=0;turn<30;turn++){
   if(await page.evaluate(()=>
    TPArena.snapshot?.phase!=='fighting'||!!fns.battleResolved()
   ))break;
   await H.battleAction(page,'quick');
  }
  if(await page.evaluate(()=>TPArena.snapshot?.phase!=='fighting'))return;
  expect(await page.evaluate(()=>!!fns.battleResolved())).toBe(true);
  if(await page.evaluate(()=>TPTrainer.get(3)===1)){
   await H.battleAction(page,'next');
  }else{
   await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase))
    .not.toBe('fighting');
   return;
  }
 }
 throw Error('Arena series did not finish within bounded test rounds');
}

for(const region of [0,1]){
 test('arena award device: confirmed regional badge '+region,
 async({page},testInfo)=>{
  await page.setViewportSize({width:region===0?320:390,height:844});
  await H.prepare(page,fixture(region),376);
  await H.game(page);
  await page.emulateMedia({
   reducedMotion:region===0?'reduce':'no-preference'
  });
  const arena=await H.openArenaSelection(page);
  if(await page.evaluate(()=>TPArena.region)!==region){
   await arena.locator('[data-arena-region-toggle]').click();
   await AU.region(page,region);
  }
  await AU.details(page,0);
  expect(await AU.challenge(page)).toBe(true);
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
  expect(await mask(page,region)).toBe(0);

  if(region===0){
   await page.evaluate(()=>{
    window.awardOriginalWrite=writeSave;
    writeSave=async(bytes,force=false)=>{
     if(force&&TPArena.teamView()?.seriesDone)
      throw Error('intentional award persistence failure');
     return window.awardOriginalWrite(bytes,force);
    };
   });
  }
  await winSeries(page);
  const stage=page.locator('#tp-story-stage[data-story="arena-award"]');

  if(region===0){
   await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase))
    .toBe('failed');
   expect(await mask(page,region)).toBe(0);
   await expect(stage).toBeVisible();
   await expect(stage).toHaveAttribute('data-awarded','false');
   await expect(stage).toHaveAttribute('data-arena-result','failed');
   await page.evaluate(()=>{writeSave=window.awardOriginalWrite;});
   await stage.locator('[data-arena-award-action="primary"]').click();
  }

  await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase))
   .toBe('done');
  expect(await mask(page,region)).toBe(1);
  const awardedAt=await date(page,region);
  expect(awardedAt).toBeGreaterThan(0);

  await expect(stage).toBeVisible();
  await expect(stage).toHaveAttribute('data-awarded','true');
  await expect(stage).toHaveAttribute('data-arena-result','done');
  await expect(stage.locator('.tp-pokedex-display')).toHaveCount(2);
  const badge=await page.evaluate(region=>
   TPRegions.catalog(region).arena.leaders[0].badge,region
  );
  await expect(stage).toContainText(badge);
  await expect(stage.locator('[data-arena-award-scene]')).toBeVisible();
  await expect(stage.locator('[data-arena-award-action="primary"]'))
   .toBeEnabled();
  await expect(stage.locator('[data-arena-award-action="secondary"]'))
   .toBeEnabled();
  await page.screenshot({
   path:testInfo.outputPath('ordenuebergabe-region-'+region+'.png')
  });

  await stage.locator('[data-arena-award-action="primary"]').click();
  await expect(stage).toHaveCount(0);
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');

  if(region===0){
   await AU.details(page,0);
   expect(await AU.challenge(page)).toBe(true);
   await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
   await winSeries(page);
   await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase))
    .toBe('repeat');
   await expect(stage).toBeVisible();
   await expect(stage).toHaveAttribute('data-awarded','false');
   await expect(stage).toHaveAttribute('data-arena-result','repeat');
   expect(await mask(page,region)).toBe(1);
   expect(await date(page,region)).toBe(awardedAt);
   await stage.locator('[data-arena-award-action="secondary"]').click();
   await expect(stage).toHaveCount(0);
  }

  await page.reload();
  await H.waitReady(page);
  expect(await mask(page,region)).toBe(1);
  expect(await date(page,region)).toBe(awardedAt);
  await expect(stage).toHaveCount(0);
 });
}

/* P07a final missing flow proofs. */
test('arena award device: loss gives no badge and no award',async({page})=>{
 await H.prepare(page,fixture(0,true),10);
 await H.game(page);
 await page.emulateMedia({reducedMotion:'reduce'});
 await H.openArenaSelection(page);
 await AU.details(page,0);
 expect(await AU.challenge(page)).toBe(true);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 await winSeries(page);
 await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('lost');
 const stage=page.locator('#tp-story-stage[data-story="arena-award"]');
 await expect(stage).toBeVisible();
 await expect(stage).toHaveAttribute('data-arena-result','lost');
 await expect(stage).toHaveAttribute('data-awarded','false');
 expect(await mask(page,0)).toBe(0);
 expect(await date(page,0)).toBe(0);
 await expect(stage.locator('[data-arena-award-action="primary"]'))
  .toBeEnabled();
 await stage.locator('[data-arena-award-action="primary"]').click();
 await expect(stage).toHaveCount(0);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');
 await page.reload();
 await H.waitReady(page);
 expect(await mask(page,0)).toBe(0);
 expect(await date(page,0)).toBe(0);
});
