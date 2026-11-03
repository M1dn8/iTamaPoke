const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./asset-media-fixtures');

const identity=page=>page.evaluate(()=>({
 active:TPCollection.read().active,
 ids:TPCollection.read().mons.map(mon=>mon.id),
 records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()]
}));
async function openInventory(page){
 await H.openMenu(page);
 const menu=page.locator('#tp-app-page');
 await menu.locator('[data-admin-action="settings"]').click();
 await menu.locator('[data-admin-action="files"]').click();
 await menu.locator('[data-admin-action="inventory"]').click();
 const panel=page.locator('#tp-manager-panel[data-manager-layout="assets"]');
 await expect(panel).toBeVisible();return panel;
}
async function choose(page,inventory,category,files){
 await inventory.locator('[data-assets-category="'+category+'"]').click();
 const [chooser]=await Promise.all([
  page.waitForEvent('filechooser'),
  inventory.locator('[data-assets-import="'+category+'"]').click()
 ]);
 await chooser.setFiles(files);
 const station=page.locator('#tp-manager-panel[data-manager-layout="assets-job"]');
 await expect(station).toBeVisible();
 return station;
}
async function counts(station,expected){
 for(const [key,value]of Object.entries(expected)){
  await expect(station.locator('[data-asset-job-count="'+key+'"] strong'))
   .toHaveText(String(value));
 }
 await expect(station.locator('[data-asset-job-action="pause"]')).toHaveCount(0);
 await expect(station.locator('.tp-job-scene svg')).toHaveCount(1);
}
async function readEntry(page){
 return page.evaluate(async()=>{
  const table=await loadDexEntryLang('de');
  return {stored:table[1]||null,display:dexEntryFor(1)};
 });
}
test.beforeEach(async({page})=>{await H.prepare(page);});

test('Rufe: echter Picker, gemeinsame Station, gespeicherte Bytes und Dekodierung',async({page})=>{
 const before=await identity(page),wav=F.silentWav();
 const inventory=await openInventory(page);
 const station=await choose(page,inventory,'cries',{
  name:'psnd001.wav',mimeType:'audio/wav',buffer:wav
 });
 await expect(station).toHaveAttribute('data-asset-job-phase','done');
 await counts(station,{imported:1,skipped:0,rejected:0});
 expect(Buffer.from(await page.evaluate(async()=>{
  const raw=await loadCryBytes(1);return Array.from(new Uint8Array(raw));
 }))).toEqual(wav);
 const audio=await page.evaluate(async()=>{
  const raw=await loadCryBytes(1);
  const decoded=await ensureCtx().decodeAudioData(raw.slice(0));
  return {channels:decoded.numberOfChannels,duration:decoded.duration};
 });
 expect(audio.channels).toBe(1);expect(audio.duration).toBeGreaterThan(0);
 await page.reload();await H.waitReady(page);
 await expect.poll(()=>page.evaluate(()=>hasCry(1))).toBe(true);
 expect(Buffer.from(await page.evaluate(async()=>{
  const raw=await loadCryBytes(1);return Array.from(new Uint8Array(raw));
 }))).toEqual(wav);
 expect(await identity(page)).toEqual(before);
});

test('Texte: echter Import, Nur-fehlende-Verhalten und Anzeige nach Neuladen',async({page})=>{
 const before=await identity(page);
 let inventory=await openInventory(page);
 const file={name:'dex_entries_de.txt',mimeType:'text/plain',buffer:F.textFile()};
 let station=await choose(page,inventory,'texts',file);
 await expect(station).toHaveAttribute('data-asset-job-phase','done');
 await counts(station,{imported:1,skipped:0,rejected:0});
 expect(await readEntry(page)).toEqual({stored:F.testEntry,display:F.testEntry});

 await station.locator('[data-asset-job-action="return"]').click();
 inventory=page.locator('#tp-manager-panel[data-manager-layout="assets"]');
 await expect(inventory.locator('input[type="checkbox"]')).toBeChecked();
 station=await choose(page,inventory,'texts',file);
 await expect(station).toHaveAttribute('data-asset-job-phase','done');
 await counts(station,{imported:0,skipped:1,rejected:0});

 await page.reload();await H.waitReady(page);
 expect(await readEntry(page)).toEqual({stored:F.testEntry,display:F.testEntry});
 expect(await identity(page)).toEqual(before);
});

test('Texte: fehlerhafte zweite Datei rollt bestätigte erste Datei nicht zurück',async({page})=>{
 const inventory=await openInventory(page);
 const station=await choose(page,inventory,'texts',[
  {name:'dex_entries_de.txt',mimeType:'text/plain',buffer:F.textFile()},
  {name:'dex_entries_fr.txt',mimeType:'text/plain',buffer:Buffer.from('Kein gültiger Datensatz\n')}
 ]);
 await expect(station).toHaveAttribute('data-asset-job-phase','warning');
 await counts(station,{imported:1,skipped:0,rejected:1});
 expect((await readEntry(page)).stored).toBe(F.testEntry);
 await station.locator('[data-asset-job-details]').click();
 await expect(station.locator('.tp-job-details')).toContainText('dex_entries_fr.txt');
 await expect(station.locator('[data-asset-job-action="report"]')).toBeVisible();
});

test('Rufe: ungültiger Dateiname wird weiterhin zurückgewiesen',async({page})=>{
 const inventory=await openInventory(page);
 const station=await choose(page,inventory,'cries',{
  name:'ruf001.wav',mimeType:'audio/wav',buffer:F.silentWav()
 });
 await expect(station).toHaveAttribute('data-asset-job-phase','warning');
 await counts(station,{imported:0,skipped:0,rejected:1});
 expect(await page.evaluate(async()=>Boolean(await loadCryBytes(1)))).toBe(false);
 await station.locator('[data-asset-job-details]').click();
 await expect(station.locator('.tp-job-details')).toContainText('ruf001.wav');
});
