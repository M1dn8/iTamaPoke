const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const H=require('./helpers');
const identity=page=>page.evaluate(()=>({
 active:TPCollection.read().active,ids:TPCollection.read().mons.map(mon=>mon.id),
 records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()]
}));
async function open(page){
 await H.openMenu(page);
 const root=page.locator('#tp-app-page');
 await root.locator('[data-admin-action="settings"]').click();
 await root.locator('[data-admin-action="diagnostics"]').click();
 await expect(root).toHaveClass(/tp-admin-diagnostics/);
 await expect(root.locator('.tp-diagnostic-status'))
  .toHaveText(await page.evaluate(()=>TPText.t('diagnosticsPage.done')));
 return root;
}
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Diagnose: vier Bereiche, echte Werte und unveränderte Pflege '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const before=await identity(page),root=await open(page);
  await expect(root.locator('.tp-pokedex-display')).toHaveCount(2);
  await expect(root.locator('[data-diagnostic-category]')).toHaveCount(4);
  for(const category of ['save','files','memory','system']){
   await root.locator('[data-diagnostic-category="'+category+'"]').click();
   await expect(root.locator('.tp-diagnostics')).toHaveAttribute('data-diagnostic-view',category);
   await expect(root.locator('.tp-diagnostic-overview')).toBeVisible();
   await expect.poll(()=>root.locator('.tp-diagnostic-values').evaluate(
    node=>node.scrollHeight<=node.clientHeight+1)).toBe(true);
   await root.locator('[data-diagnostic-details]').click();
   await expect(root.locator('.tp-diagnostic-values')).toHaveAttribute('data-diagnostic-mode','details');
   await expect(root.locator('.tp-diagnostic-values .tp-diagnostic-row')).not.toHaveCount(0);
   await root.locator('[data-diagnostic-details]').click();
   await expect(root.locator('.tp-diagnostic-values')).toHaveAttribute('data-diagnostic-mode','overview');
  }
  await expect(root.locator('[data-diagnostic-field="version"] p'))
   .toHaveText(await page.evaluate(()=>String(TPDiagnostics.state().version)));
  await root.locator('[data-diagnostic-check]').click();
  await expect(root.locator('.tp-diagnostic-status'))
   .toHaveText(await page.evaluate(()=>TPText.t('diagnosticsPage.done')));
  await root.locator('.tp-app-head button').click();
  await expect(root).toHaveClass(/tp-admin-settings/);
  expect(await identity(page)).toEqual(before);
 });
}
test('Diagnose: tatsächlicher Berichtsexport bleibt erhalten',async({page})=>{
 const root=await open(page);
 const [download]=await Promise.all([
  page.waitForEvent('download'),root.locator('[data-diagnostic-export]').click()
 ]);
 expect(download.suggestedFilename()).toMatch(/^iTamaPoke-Diagnose-.*\.json$/);
 const report=JSON.parse(await fs.readFile(await download.path(),'utf8'));
 expect(report.format).toBe('iTamaPoke-Diagnose-1');
});
