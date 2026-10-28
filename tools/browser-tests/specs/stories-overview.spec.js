'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./story-fixtures');
const J=require('./journal-fixtures');
const root=page=>page.locator('#tp-app-page');
const tile=page=>page.locator('#tp-stories-page button[data-story="zapdos"]');

test('Geschichten: drei Kanto-Orden bleiben trotz acht Johto-Orden gesperrt',async({page})=>{
 await H.prepare(page,F.withProgress(H.fixture(),{kanto:7,johto:255}));
 await H.openHub(page);
 await expect(page.locator('#tp-story-unlock')).toBeEmpty();
 await expect(root(page).locator(
  'button[data-hub="stories"] .tp-hub-count'
 )).toHaveCount(0);
 await root(page).getByRole('button',{name:'Geschichten',exact:true}).click();
 await expect(tile(page)).toBeDisabled();
 await expect(tile(page).locator('.tp-story-open-dot')).toHaveCount(0);
 await expect(tile(page)).toContainText('3/4');
 const result=await page.evaluate(async()=>{
  try{await TPZapdos.advance('investigate');return 'unexpected-success';}
  catch(error){return error.code||error.message;}
 });
 expect(result).toBe('NATIVE_ZAPDOS_ADVANCE_REFUSED');
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(0);
 expect(await page.evaluate(()=>TPCollection.blocked)).toBe(false);
});

test('Geschichten: vierter Orden zeigt Hinweis; Schreibfehler bleibt wiederholbar',async({page})=>{
 await H.prepare(page,F.withProgress(H.fixture(),{kanto:15}));
 await H.openHub(page);
 const hint=page.locator('#tp-story-unlock');
 await expect(hint.getByRole('button',{
  name:'In deinem Pokédex ist eine neue Geschichte verfügbar.',exact:true
 })).toBeVisible();
 await page.evaluate(()=>{
  window.__storyWrite=writeSave;
  writeSave=async()=>{throw Error('Story notice quota fixture');};
 });
 await hint.getByRole('button',{name:'In deinem Pokédex ist eine neue Geschichte verfügbar.',exact:true}).click();
 await expect(hint).toContainText('Speichern fehlgeschlagen');
 expect(await page.evaluate(()=>TPZapdos.access().noticeRead)).toBe(false);
 expect(await page.evaluate(()=>TPCollection.busy||tpSaveReplacing)).toBe(false);
 await page.evaluate(()=>{writeSave=window.__storyWrite;});
 await hint.getByRole('button',{name:'In deinem Pokédex ist eine neue Geschichte verfügbar.',exact:true}).click();
 await expect(page.locator('#tp-stories-page')).toBeVisible();
 expect(await page.evaluate(()=>TPZapdos.access().noticeRead)).toBe(true);
 await page.reload();await H.waitReady(page);await H.openHub(page);
 await expect(page.locator('#tp-story-unlock')).toBeEmpty();
 expect(await page.evaluate(()=>TPZapdos.access().noticeRead)).toBe(true);
 await root(page).getByRole('button',{name:'Geschichten',exact:true}).click();
 await expect(tile(page)).toBeEnabled();
 await tile(page).click();
 await expect(page.locator('#tp-zapdos-page')).toBeVisible();
 await root(page).locator('.tp-app-head').getByRole('button',{
  name:'Zurück',exact:true
 }).click();
 await expect(page.locator('#tp-stories-page')).toBeVisible();
 await expect(tile(page).locator('.tp-story-open-dot')).toHaveCount(1);
 await expect(tile(page).locator('.tp-story-open-dot'))
  .toHaveCSS('background-color','rgb(179, 38, 30)');
});

for(const step of [1,2])
 test('Geschichten: vorhandener Schritt '+step+' bleibt ohne Orden erreichbar',async({page})=>{
  await H.prepare(page);await H.game(page);
  await page.evaluate(()=>TPCollectionGame.ensureCurrent());
  const bytes=Buffer.from(await page.evaluate(
   ()=>Array.from(exportStateBytes(Module))
  ));
  await H.importSave(page,F.withProgress(bytes,{kanto:0,step}));
  await H.openHub(page);
  await expect(page.locator('#tp-story-unlock')).toBeEmpty();
  await root(page).getByRole('button',{name:'Geschichten',exact:true}).click();
  await expect(tile(page)).toBeEnabled();
  await tile(page).click();
  await expect(page.locator('#tp-zapdos-page')).toBeVisible();
  expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(step);
  expect(await page.evaluate(()=>TPZapdos.access().badges)).toBe(0);
 });


for(const width of [320,390])
 test('Infohinweis: vollstaendig sichtbar und direkt zu Geschichten bei '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page,F.withProgress(
   J.withUnread(H.fixture(),7),{kanto:63}
  ));
  await H.game(page);
  await page.evaluate(()=>{
   window.__storyInfoPaint=[];
   window.__storyInfoFill=ctx.fillText;
   ctx.fillText=function(value,...args){
    if(String(value)==='i'&&args[0]===403&&args[1]===386)
     window.__storyInfoPaint.push({text:String(value),ink:this.fillStyle});
    return window.__storyInfoFill.call(this,value,...args);
   };
  });
  try{
   await expect.poll(()=>page.evaluate(
    ()=>window.__storyInfoPaint.length
   )).toBeGreaterThan(0);
   expect(await page.evaluate(
    ()=>window.__storyInfoPaint.at(-1).ink
   )).toBe('#ffffff');
  }finally{
   await page.evaluate(()=>{ctx.fillText=window.__storyInfoFill;});
  }

  await H.openHub(page);
  const panel=root(page);
  const hint=page.locator('#tp-story-unlock');
  const info=hint.getByRole('button',{
   name:'In deinem Pokédex ist eine neue Geschichte verfügbar.',exact:true
  });
  await expect(info).toBeVisible();
  await expect(info).toHaveCSS('background-color','rgb(231, 240, 255)');
  await expect(info).toHaveCSS('color','rgb(23, 55, 94)');
  await expect(info.locator('.tp-story-info-symbol'))
   .toHaveCSS('background-color','rgb(23, 55, 94)');
  await expect(info.locator('.tp-story-info-symbol'))
   .toHaveCSS('color','rgb(255, 255, 255)');
  const count=panel.locator('button[data-hub="stories"] .tp-hub-count');
  await expect(count).toHaveText('2');
  expect(await page.evaluate(()=>({
   zapdos:TPZapdos.access().unlocked,
   arktos:TPArktos.access().unlocked
  }))).toEqual({zapdos:true,arktos:true});
  await expect(count).toHaveCSS('background-color','rgb(179, 38, 30)');
  await expect(count).toHaveCSS('color','rgb(255, 255, 255)');
  await expect(panel.locator(
   'button[data-hub="journal"] .tp-hub-count'
  )).toHaveText('7');
  await expect(hint.locator('button')).toHaveCount(1);
  await expect(hint.locator('h3')).toHaveCount(0);
  await expect(info.locator('.tp-story-info-symbol')).toHaveText('i');
  await expect(info.locator('.tp-story-info-text')).toHaveCSS(
   'text-align','center'
  );
  await expect(panel.locator('.tp-app-grid button')).toHaveCount(5);
  await expect.poll(()=>panel.evaluate(n=>{
   const outer=n.getBoundingClientRect();
   return n.scrollHeight<=n.clientHeight+1&&
    n.scrollWidth<=n.clientWidth+1&&
    Array.from(n.querySelectorAll('button')).every(button=>{
     const r=button.getBoundingClientRect();
     return r.top>=outer.top-1&&r.bottom<=outer.bottom+1&&
      r.left>=outer.left-1&&r.right<=outer.right+1;
    });
  })).toBe(true);
  const full=await hint.boundingBox(),button=await info.boundingBox();
  expect(Math.abs(full.width-button.width)).toBeLessThan(1);

  await info.click();
  await expect(page.locator('#tp-stories-page')).toBeVisible();
  expect(await page.evaluate(()=>TPZapdos.access().noticeRead)).toBe(true);
  expect(await page.evaluate(()=>TPArktos.access().noticeRead)).toBe(true);
  await page.reload();await H.waitReady(page);await H.openHub(page);
  await expect(page.locator('#tp-story-unlock')).toBeEmpty();
  await expect(root(page).locator(
   'button[data-hub="stories"] .tp-hub-count'
  )).toHaveText('2');
 });


// Explicit fixed expectations, including eight irrelevant Johto badges.
for(const [badges,expectedCount,zapdosOpen,arktosOpen] of [
 [3,0,false,false],
 [4,1,true,false],
 [5,1,true,false],
 [6,2,true,true]
]){
 test(
  'Geschichten: feste Freischaltungen und Zaehler bei '+
   badges+' Kanto-Orden',
  async({page})=>{
   await H.prepare(page,F.withProgress(H.fixture(),{
    kanto:(1<<badges)-1,johto:255
   }));
   await H.openHub(page);

   const counter=root(page).locator(
    'button[data-hub="stories"] .tp-hub-count'
   );
   if(expectedCount===0)await expect(counter).toHaveCount(0);
   else await expect(counter).toHaveText(String(expectedCount));

   expect(await page.evaluate(()=>({
    zapdos:TPZapdos.access().unlocked,
    arktos:TPArktos.access().unlocked
   }))).toEqual({
    zapdos:zapdosOpen,arktos:arktosOpen
   });

   await root(page).getByRole('button',{
    name:'Geschichten',exact:true
   }).click();

   const zapdos=page.locator(
    '#tp-stories-page button[data-story="zapdos"]'
   );
   const arktos=page.locator(
    '#tp-stories-page button[data-story="articuno"]'
   );
   if(zapdosOpen)await expect(zapdos).toBeEnabled();
   else await expect(zapdos).toBeDisabled();

   if(arktosOpen)await expect(arktos).toBeEnabled();
   else await expect(arktos).toBeDisabled();
  }
 );
}
