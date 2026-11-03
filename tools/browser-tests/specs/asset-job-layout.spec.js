const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const sprite=()=>Buffer.from([84,80,75,50,1,1,0,224,7,0,1,1,1,70,0,0]);
async function open(page){
 await H.openMenu(page);
 const menu=page.locator('#tp-app-page');
 await menu.locator('[data-admin-action="settings"]').click();
 await menu.locator('[data-admin-action="files"]').click();
 await menu.locator('[data-admin-action="inventory"]').click();
 const panel=page.locator('#tp-manager-panel[data-manager-layout="assets"]');
 await expect(panel).toBeVisible();return panel;
}
async function importFiles(page,panel,files){
 const [chooser]=await Promise.all([
  page.waitForEvent('filechooser'),panel.locator('[data-assets-import="graphics"]').click()
 ]);
 await chooser.setFiles(files);
}
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Dateistation: echter Import, Prüfung, Ergebnis und Rückweg '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const id=await page.evaluate(()=>TPCollection.read().active);
  let panel=await open(page);
  await importFiles(page,panel,{name:'p001.bin',mimeType:'application/octet-stream',buffer:sprite()});
  panel=page.locator('#tp-manager-panel[data-manager-layout="assets-job"]');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-asset-job-phase','done');
  await expect(panel.locator('.tp-pokedex-display')).toHaveCount(2);
  await expect(panel.locator('[data-asset-job-count="imported"] strong')).toHaveText('1');
  expect(Buffer.from(await page.evaluate(async()=>Array.from(new Uint8Array(await loadSpriteAsset('p001.bin'))))))
   .toEqual(sprite());
  await panel.locator('[data-asset-job-action="return"]').click();
  panel=page.locator('#tp-manager-panel[data-manager-layout="assets"]');
  await panel.locator('[data-assets-tool="validate"]').click();
  panel=page.locator('#tp-manager-panel[data-manager-layout="assets-job"]');
  await expect(panel).toHaveAttribute('data-asset-job-phase','done');
  await expect(panel.locator('[data-asset-job-count="valid"] strong')).toHaveText('1');
  await expect.poll(()=>panel.locator('.tp-job-content').evaluateAll(nodes=>nodes.every(node=>{
   const box=node.getBoundingClientRect();
   return Array.from(node.children).filter(child=>child.getClientRects().length>0).every(child=>{
    const r=child.getBoundingClientRect();return r.top>=box.top-1&&r.bottom<=box.bottom+1;
   });
  }))).toBe(true);
  await panel.locator('[data-asset-job-details]').click();
  await expect(panel.locator('.tp-job-details')).toBeVisible();
  await expect(panel.locator('.tp-manager-status')).toContainText('Gueltig: 1');
  await panel.locator('[data-asset-job-action="return"]').click();
  await expect(page.locator('#tp-manager-panel[data-manager-layout="assets"]')).toBeVisible();
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(id);
 });
}
test('Dateistation: vorhandene Pausenfunktion stoppt nach bestätigter Bearbeitung',async({page})=>{
 const panel=await open(page);
 const files=Array.from({length:200},(_,index)=>({
  name:'p'+String(index+1).padStart(3,'0')+'.bin',
  mimeType:'application/octet-stream',buffer:sprite()
 }));
 await importFiles(page,panel,files);
 const station=page.locator('#tp-manager-panel[data-manager-layout="assets-job"]');
 await station.locator('[data-asset-job-action="pause"]').click();
 await expect(station).toHaveAttribute('data-asset-job-phase','paused');
 const count=Number(await station.locator('[data-asset-job-count="imported"] strong').textContent());
 expect(count).toBeLessThan(200);
 const stored=await page.evaluate(async()=>{
  const db=await openAssetDb();
  try{return await new Promise((resolve,reject)=>{
   const request=db.transaction(ASSET_STORE,'readonly').objectStore(ASSET_STORE).count();
   request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });}finally{db.close();}
 });
 expect(stored).toBe(count);
});
