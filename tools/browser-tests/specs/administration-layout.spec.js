const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const identity=page=>page.evaluate(()=>({
 active:TPCollection.read().active,
 ids:TPCollection.read().mons.map(mon=>mon.id),
 records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()]
}));
async function fits(root){
 try{
  await expect.poll(()=>root.locator('.tp-admin-content').evaluateAll(panes=>
   panes.length===2&&panes.every(pane=>{
    const box=pane.getBoundingClientRect();
    return pane.scrollHeight<=pane.clientHeight+1&&Array.from(pane.children)
     .filter(child=>child.getClientRects().length>0).every(child=>{
      const r=child.getBoundingClientRect();
      return r.top>=box.top-1&&r.bottom<=box.bottom+1;
     });
   }))).toBe(true);
 }catch(error){
  const geometry=await root.evaluate(root=>{
   const grid=root.querySelector('.tp-admin-body');
   return {
    page:root.className,
    gridRows:grid?getComputedStyle(grid).gridTemplateRows:null,
    panes:Array.from(root.querySelectorAll('.tp-admin-content')).map(pane=>{
     const box=pane.getBoundingClientRect();
     return {
      height:box.height,clientHeight:pane.clientHeight,scrollHeight:pane.scrollHeight,
      children:Array.from(pane.children).filter(child=>child.getClientRects().length>0)
       .map(child=>{
        const r=child.getBoundingClientRect(),style=getComputedStyle(child);
        return {
         class:child.className,text:child.textContent.trim().slice(0,70),
         top:r.top-box.top,bottom:r.bottom-box.bottom,height:r.height,
         minHeight:style.minHeight,font:style.font,flex:style.flex
        };
       })
     };
    })
   };
  });
  error.message+='\nVerwaltungsgeometrie: '+JSON.stringify(geometry);
  throw error;
 }
}
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Verwaltung: Menü, Einstellungen und Dateien im gemeinsamen Rahmen '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  await H.openMenu(page);
  const root=page.locator('#tp-app-page');
  const before=await identity(page);
  await expect(root).toHaveClass(/tp-admin-main/);
  await expect(root.locator('.tp-pokedex-display')).toHaveCount(2);
  await expect(root.locator('.tp-app-grid button')).toHaveCount(2);
  expect(await root.locator('.tp-admin-body.tp-app-grid').evaluate(
   node=>getComputedStyle(node).gridTemplateRows.trim().split(/\\s+/).length)).toBe(1);
  await fits(root);

  await root.locator('[data-admin-action="settings"]').click();
  await expect(root).toHaveClass(/tp-admin-settings/);
  await expect(root.locator('.tp-admin-tile-grid>button')).toHaveCount(4);
  await expect(root.locator('.tp-app-rights-link')).toBeVisible();
  await expect(root.locator('.tp-app-danger button')).toBeVisible();
  await fits(root);

  await root.locator('[data-admin-action="files"]').click();
  await expect(root).toHaveClass(/tp-admin-files/);
  await expect(root.locator('.tp-admin-tile-grid>button')).toHaveCount(4);
  await expect(root.locator('[data-admin-action="graphics"]'))
   .toHaveText(await page.evaluate(()=>TPText.t('adminPage.graphicsShort')));
  await expect(root.locator('[data-admin-action="graphics"]'))
   .toHaveAttribute('aria-label',await page.evaluate(()=>TPText.t('menu.graphics')));
  await expect(root.locator('[data-admin-action="inventory"]'))
   .toHaveText(await page.evaluate(()=>TPText.t('adminPage.inventoryShort')));
  await expect(root.locator('[data-admin-action="inventory"]'))
   .toHaveAttribute('aria-label',/\S/);
  await fits(root);
  const chooser=await Promise.all([
   page.waitForEvent('filechooser'),
   root.locator('[data-admin-action="graphics"]').click()
  ]);
  await chooser[0].setFiles([]);
  await root.locator('.tp-app-head button').click();
  await expect(root).toHaveClass(/tp-admin-settings/);
  expect(await identity(page)).toEqual(before);
 });
}
test('Verwaltung: vorhandener Ton- und Sprachwechsel bleibt bedienbar',async({page})=>{
 await H.openMenu(page);
 const root=page.locator('#tp-app-page');
 await root.locator('[data-admin-action="settings"]').click();
 const before=await identity(page);
 const sound=await page.evaluate(()=>soundMode);
 await root.locator('[data-admin-action="sound"]').click();
 await expect.poll(()=>page.evaluate(()=>soundMode)).toBe((sound+1)%3);
 const language=await page.evaluate(()=>fns.language());
 const count=await page.evaluate(()=>LANG_CODES.length);
 await root.locator('[data-admin-action="language"]').click();
 await expect.poll(()=>page.evaluate(()=>fns.language())).toBe((language+1)%count);
 expect(await identity(page)).toEqual(before);
});
