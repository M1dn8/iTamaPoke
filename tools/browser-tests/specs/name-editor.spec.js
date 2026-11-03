const {test,expect}=require('@playwright/test');
const H=require('./helpers');
test.beforeEach(async({page})=>{await H.prepare(page);});
async function open(page){
 const status=await H.openStatus(page);
 await status.locator('[data-status-tab="profile"]').click();
 await status.locator('[data-status-rename]').click();
 expect(await page.evaluate(()=>screen)).toBe('card');
 const editor=status.locator('#tp-inline-name');
 await expect(editor).toBeVisible();
 await expect(page.locator('#tp-name-page')).toHaveCount(0);
 return editor;
}
const current=page=>page.evaluate(()=>{
 const state=TPCollection.read(),mon=state.mons.find(m=>m.id===state.active);
 return {id:state.active,nick:fns.hasNick()!==0?fns.name():'',
  stored:mon.nickname,ids:state.mons.map(m=>m.id)};
});
test('Inline-Umbenennung: Entwurf und Zurück verändern keinen Namen',async({page})=>{
 const editor=await open(page),before=await current(page);
 const visibleName=await page.evaluate(()=>fns.name());
 await editor.locator('[data-name-input]').fill('Atlas');
 await expect(page.locator('#tp-status-page .tp-status-name-stack>h3'))
  .toHaveText(visibleName);
 expect(await current(page)).toEqual(before);
 await page.locator('#tp-status-page [data-status-back]').click();
 await expect(editor).not.toBeVisible();
 expect(await page.evaluate(()=>screen)).toBe('card');
 await expect(page.locator('#tp-status-page [data-status-personality]')).toBeVisible();
 expect(await current(page)).toEqual(before);
});
test('Inline-Umbenennung: erneuter Stift verwirft Entwurf',async({page})=>{
 const editor=await open(page),before=await current(page);
 await editor.locator('[data-name-input]').fill('Atlas');
 await page.locator('#tp-status-page [data-status-rename]').click();
 await expect(editor).not.toBeVisible();
 expect(await current(page)).toEqual(before);
});
test('Inline-Umbenennung: Rubrikwechsel verwirft Entwurf',async({page})=>{
 const editor=await open(page),before=await current(page);
 await editor.locator('[data-name-input]').fill('Atlas');
 await page.locator('#tp-status-page [data-status-tab="values"]').click();
 await expect(editor).not.toBeVisible();
 await expect(page.locator('#tp-status-page')).toHaveAttribute('data-status-view','values');
 expect(await current(page)).toEqual(before);
});
test('Inline-Umbenennung: Übernehmen und Reload erhalten Namen und Identität',async({page})=>{
 const editor=await open(page),before=await current(page);
 await editor.locator('[data-name-input]').fill('Atlas');
 await editor.locator('[data-name-apply]').click();
 await expect(editor).not.toBeVisible();
 await expect.poll(()=>current(page)).toEqual({...before,nick:'Atlas',stored:'Atlas'});
 expect(await page.evaluate(()=>screen)).toBe('card');
 await expect(page.locator('#tp-status-page [data-status-personality]')).toBeVisible();
 await page.reload();await H.waitReady(page);
 expect(await current(page)).toEqual({...before,nick:'Atlas',stored:'Atlas'});
});
test('Inline-Umbenennung: koreanischer Text bleibt vollständig gespeichert',async({page})=>{
 const editor=await open(page),before=await current(page);
 const capacity=await page.evaluate(()=>fns.nickCapacity());
 const value='가'.repeat(Math.min(4,Math.floor(capacity/3)));
 expect(value.length).toBeGreaterThan(0);
 await editor.locator('[data-name-input]').fill(value);
 await editor.locator('[data-name-apply]').click();
 await expect(editor).not.toBeVisible();
 await page.reload();await H.waitReady(page);
 expect(await current(page)).toEqual({...before,nick:value,stored:value});
});
test('Inline-Umbenennung: Überlänge wird nicht abgeschnitten',async({page})=>{
 const editor=await open(page),before=await current(page);
 const capacity=await page.evaluate(()=>fns.nickCapacity());
 const value='A'.repeat(Math.min(capacity,11)+1);
 await editor.locator('[data-name-input]').fill(value);
 await expect(editor.locator('[data-name-input]')).toHaveValue(value);
 await expect(editor.locator('[data-name-apply]')).toBeDisabled();
 await expect(editor.locator('[role="alert"]')).not.toBeEmpty();
 expect(await current(page)).toEqual(before);
});
test('Inline-Umbenennung: Speicherfehler und echte Wiederholung',async({page})=>{
 const editor=await open(page),before=await current(page);
 await page.evaluate(()=>{
  window.nameOriginalWrite=writeSave;
  writeSave=async()=>{throw Error('synthetic rename quota');};
 });
 await editor.locator('[data-name-input]').fill('Atlas');
 await editor.locator('[data-name-apply]').click();
 await expect(editor.locator('[role="alert"]')).toContainText('Nicht gespeichert');
 expect(await current(page)).toEqual(before);
 await expect(editor.locator('[data-name-input]')).toHaveValue('Atlas');
 expect(await page.evaluate(()=>screen)).toBe('card');
 await page.evaluate(()=>{writeSave=window.nameOriginalWrite;});
 await editor.locator('[data-name-apply]').click();
 await expect(editor).not.toBeVisible();
 expect(await current(page)).toEqual({...before,nick:'Atlas',stored:'Atlas'});
});
