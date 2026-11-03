const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./mega-review-fixtures');
const T=require('../../../browser_ver/web/storage-tools.js');



// UI01 Mega functional sprite fixture: isolated tests only, not Pokémon artwork.
async function importFunctionalMegaSprite(page,definition){
 const info=[1,2,3].map(id=>T.megaFormInfo(id)).find(item=>item.dex===definition.dex);
 if(!info)throw Error("Mega-Form zur Testart fehlt.");
 const filename=definition.shiny?info.shiny:info.normal;
 await page.evaluate(async filename=>{
  const bytes=Uint8Array.from([84,80,75,50,1,1,0,224,7,0,1,1,1,70,0,0]);
  await TPManager.importAssets('sprites',[new File([bytes],filename)]);
 },filename);
 await H.modal(page).locator('.tp-modal-head button').click();
}

for(const definition of F.definitions){
 test('Mega-Review: '+definition.name,async({page})=>{
  const decoded=await F.createFreshCase(definition);
  expect(decoded.values.get('dexn').value).toBe(definition.dex);
  expect(Buffer.isBuffer(decoded.raw)).toBe(true);
  await H.prepare(page,decoded.raw,definition.dex);
  await importFunctionalMegaSprite(page,definition);
  const root=await H.openStatus(page);
  await root.locator('[data-status-tab="profile"]').click();
  const mega=root.locator('.tp-status-portrait [data-status-mega]');
  await expect(mega).toHaveCount(1);
  await expect(mega).toBeVisible();
  await expect(mega).toBeEnabled();
  await expect(root.locator('.tp-status-tabs [data-status-mega]')).toHaveCount(0);
  await expect(root.locator('.tp-status-tool-slot')).toHaveCount(0);
  await expect(mega).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  await expect(mega.locator('.tp-mega-glyph svg')).toHaveCount(1);
  const contained=await mega.evaluate(button=>{
   const b=button.getBoundingClientRect();
   const p=button.closest('.tp-status-portrait').getBoundingClientRect();
   return b.width>=44&&b.height>=44&&b.left>=p.left-1&&
    b.right<=p.right+1&&b.top>=p.top-1&&b.bottom<=p.bottom+1;
  });
  expect(contained).toBe(true);
  const identity=await page.evaluate(()=>({
   active:TPCollection.read().active,ids:TPCollection.read().mons.map(mon=>mon.id)
  }));

  await mega.click();
  await expect.poll(()=>page.evaluate(()=>({screen,page:cardPage})))
   .toEqual({screen:'card',page:8});
  const initial=await page.evaluate(()=>TPMega.view(true));
  expect(initial.dex).toBe(definition.dex);
  expect(Boolean(initial.supported)).toBe(true);
  expect(Boolean(initial.active)).toBe(false);

  if(definition.cooldown){
   expect(initial.cool).toBeGreaterThan(initial.now);
   await expect(page.locator('#tp-mega-page [data-mega-action]')).toBeDisabled();
   expect(Boolean(await page.evaluate(()=>TPMega.view(true).active))).toBe(false);
  }else{
   if(definition.quest){
    expect(Boolean(initial.quest)).toBe(true);
    expect(Boolean(initial.stone)).toBe(false);
    await page.locator('#tp-mega-page [data-mega-action="claim"]').click();
    await expect.poll(()=>page.evaluate(()=>Boolean(TPMega.view(true).stone))).toBe(true);
    await expect.poll(()=>page.evaluate(()=>TPMega.busy)).toBe(false);
   }else{
    expect(Boolean(initial.stone)).toBe(true);
   }
   await page.locator('#tp-mega-page [data-mega-action="activate"]').click();
   await expect.poll(()=>page.evaluate(()=>Boolean(TPMega.view(true).active))).toBe(true);
   await expect.poll(()=>page.evaluate(()=>TPMega.busy)).toBe(false);
   await expect(page.locator('#tp-mega-page [data-mega-time]')).toBeVisible();
   expect(await page.evaluate(()=>TPMega.shiny())).toBe(Boolean(definition.shiny));
  }
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,ids:TPCollection.read().mons.map(mon=>mon.id)
  }))).toEqual(identity);
 });
}

test('Mega-Grafikschutz bleibt ohne Funktionsgrafik wirksam',async({page})=>{
 const definition=F.definitions[1];
  const decoded=await F.createFreshCase(definition);
  expect(decoded.values.get('dexn').value).toBe(definition.dex);
  expect(Buffer.isBuffer(decoded.raw)).toBe(true);
 await H.prepare(page,decoded.raw,definition.dex);
 const root=await H.openStatus(page);
 await root.locator('.tp-status-portrait [data-status-mega]').click();
 await expect.poll(()=>page.evaluate(()=>cardPage)).toBe(8);
 const before=await page.evaluate(()=>TPMega.view(true));
 await page.locator('#tp-mega-page [data-mega-action="activate"]').click();
 await expect.poll(()=>page.evaluate(()=>TPMega.busy)).toBe(false);
 const after=await page.evaluate(()=>TPMega.view(true));
 expect(Boolean(after.active)).toBe(false);
 expect(after.end).toBe(before.end);
 expect(after.cool).toBe(before.cool);
});
