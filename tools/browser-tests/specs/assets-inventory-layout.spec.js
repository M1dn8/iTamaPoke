const {test,expect}=require('@playwright/test');
const H=require('./helpers');
async function open(page){
 await H.openMenu(page);
 const menu=page.locator('#tp-app-page');
 await menu.locator('[data-admin-action="settings"]').click();
 await menu.locator('[data-admin-action="files"]').click();
 await menu.locator('[data-admin-action="inventory"]').click();
 const panel=page.locator('#tp-manager-panel[data-manager-layout="assets"]');
 await expect(panel).toBeVisible();
 return panel;
}
const identity=page=>page.evaluate(()=>({
 active:TPCollection.read().active,ids:TPCollection.read().mons.map(mon=>mon.id),
 records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()]
}));
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Bestand: Kategorien und echte Steuerungen im gemeinsamen Rahmen '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const before=await identity(page),panel=await open(page);
  await expect(panel.locator('.tp-pokedex-display')).toHaveCount(2);
  await expect(panel.locator('[data-assets-category]')).toHaveCount(4);
  await expect(panel.locator('[data-assets-tool]')).toHaveCount(3);
  const only=panel.locator('input[type="checkbox"]');
  await expect(only).toBeChecked();await only.uncheck();
  for(const category of ['trainers','cries','texts','graphics']){
   await panel.locator('[data-assets-category="'+category+'"]').click();
   await expect(panel.locator('[data-assets-category="'+category+'"]'))
    .toHaveAttribute('aria-pressed','true');
   await expect(only).not.toBeChecked();
   await expect(panel.locator('[data-assets-import]')).toHaveCount(1);
  }
  await expect.poll(()=>panel.locator('.tp-assets-content').evaluateAll(panes=>
   panes.length===1&&panes.every(pane=>{
    const box=pane.getBoundingClientRect();
    return Array.from(pane.children).filter(child=>child.getClientRects().length>0)
     .every(child=>{const r=child.getBoundingClientRect();
      return r.top>=box.top-1&&r.bottom<=box.bottom+1;});
   }))).toBe(true);
  const overview=panel.locator('[data-assets-graphic-overview]');
  await expect(overview.locator('.tp-assets-coverage-card')).toHaveCount(2);
  expect(await overview.evaluate(node=>node.scrollHeight<=node.clientHeight+1)).toBe(true);
  await panel.locator('[data-assets-tool="info"]').click();
  for(let index=0;index<3;index++){
   await expect(panel.locator('[data-assets-info-counter]')).toHaveText((index+1)+' / 3');
   await expect(panel.locator('.tp-assets-info-page')).toHaveAttribute('data-assets-info-page',String(index));
   if(index<2)await panel.locator('[data-assets-info-next]').click();
  }
  await expect(panel.locator('.tp-assets-info-page'))
   .toContainText(await page.evaluate(()=>TPText.t('assetsPage.infoLocal')));
  await expect(panel.locator('.tp-assets-info-page'))
   .toContainText(await page.evaluate(()=>TPText.t('assetsPage.infoBackup')));
  await panel.locator('[data-assets-category="graphics"]').click();
  const chooser=await Promise.all([
   page.waitForEvent('filechooser'),panel.locator('[data-assets-import="graphics"]').click()
  ]);
  await chooser[0].setFiles([]);
  await panel.locator('.tp-modal-head button').click();
  await expect(panel).toBeHidden();
  await expect(page.locator('#tp-app-page')).toHaveClass(/tp-admin-files/);
  expect(await identity(page)).toEqual(before);
 });
}
test('Bestand: vorhandener Export fehlender Grafiken bleibt erreichbar',async({page})=>{
 const panel=await open(page);
 await panel.locator('[data-assets-tool="export"]').click();
 await expect(panel.locator('[data-assets-export-explanation]'))
  .toContainText(await page.evaluate(()=>TPText.t('assetsPage.exportHint')));
 const [download]=await Promise.all([
  page.waitForEvent('download'),panel.locator('[data-assets-export-confirm]').click()
 ]);
 expect(download.suggestedFilename()).toBe('iTamaPoke-fehlende-Grafiken.txt');
});
