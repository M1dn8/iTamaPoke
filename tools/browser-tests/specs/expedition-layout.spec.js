const {test,expect}=require('@playwright/test');
const H=require('./helpers');
function readyFixture(item=2,base=H.fixture(0)){
 const fields=new Map();let at=4;
 for(let i=0;i<base.readUInt32LE(0);i++){
  const size=base[at++],key=base.toString('utf8',at,at+size);at+=size;
  const type=base[at++],length=base.readUInt32LE(at);at+=4;
  fields.set(key,[type,Buffer.from(base.subarray(at,at+length))]);at+=length;
 }
 for(const [key,value]of Object.entries({
  exend:Math.floor(Date.now()/1000)-30,exroute:item+1,exrwd:item,exmins:60
 })){
  const bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));
  fields.set(key,[1,bytes]);
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);
 return Buffer.concat([count,...Array.from(fields,([key,[type,value]])=>{
  const name=Buffer.from(key),length=Buffer.alloc(4);length.writeUInt32LE(value.length);
  return Buffer.concat([Buffer.from([name.length]),name,Buffer.from([type]),length,value]);
 })]);
}
async function quiet(page){
 await page.waitForFunction(()=>!TPExpeditions.busy&&!tpSaveReplacing);
}
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Expedition: Auswahl ohne Start und klare Displaygrenzen '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  await H.openExpedition(page);
  const root=page.locator('#tp-expedition-page');
  await expect(root.locator('[data-exp-route]')).toHaveCount(4);
  await expect(root.locator('[data-exp-item]')).toHaveCount(4);
  const before=await page.evaluate(()=>TPExpeditions.view().s.slice());
  for(let route=1;route<=4;route++){
   const pick=root.locator('[data-exp-route="'+route+'"]');
   await pick.click();await expect(pick).toHaveAttribute('aria-pressed','true');
   expect(await pick.evaluate(element=>{
    const pane=document.querySelector('#tp-expedition-page .tp-pokedex-display-left')
     .getBoundingClientRect();
    const r=element.getBoundingClientRect();
    return r.width>=43&&r.height>=47&&r.left>=pane.left&&r.right<=pane.right&&
     r.top>=pane.top&&r.bottom<=pane.bottom;
   })).toBe(true);
  }
  expect(await page.evaluate(()=>TPExpeditions.view().s.slice())).toEqual(before);
  expect(await root.locator('[data-exp-start]').evaluate(element=>{
   const pane=document.querySelector('#tp-expedition-page .tp-pokedex-display-right')
    .getBoundingClientRect();
   const r=element.getBoundingClientRect();
   return r.width>=43&&r.height>=43&&r.left>=pane.left&&r.right<=pane.right&&
    r.top>=pane.top&&r.bottom<=pane.bottom;
  })).toBe(true);
  await page.keyboard.press('Escape');
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 });
}
for(const route of [1,2,3,4]){
 test('Expedition: echter Start und gespeicherter Lauf '+route,async({page})=>{
  await H.openExpedition(page);
  const root=page.locator('#tp-expedition-page');
  const before=await page.evaluate(()=>TPExpeditions.view().s[0]);
  await root.locator('[data-exp-route="'+route+'"]').click();
  await root.locator('[data-exp-start]').click();
  await quiet(page);
  await expect(root).toHaveAttribute('data-exp-state','running');
  const v=await page.evaluate(()=>TPExpeditions.view());
  expect(v.pending).toBe(true);expect(v.s[10]).toBe(route);
  expect(v.s[12]).toBe(route===4?30:15);
  expect(v.s[24]).toBe(route-1);expect(v.s[26]).toBe(1);
  expect(v.s[0]).toBe(before-(route===4?26:12));
  await page.reload();await H.waitReady(page);await H.openExpedition(page);
  expect(await page.evaluate(()=>TPExpeditions.view().s[10])).toBe(route);
  await expect(root).toHaveAttribute('data-exp-state','running');
 });
}
test('Expedition: Speicherfehler nimmt echten Start zurück',async({page})=>{
 await H.openExpedition(page);
 const before=await page.evaluate(()=>TPExpeditions.view().s.slice());
 await page.evaluate(()=>{window.expWrite=writeSave;writeSave=async()=>{
  throw Error('synthetic expedition quota');
 };});
 await page.locator('#tp-expedition-page [data-exp-start]').click();
 await quiet(page);
 await expect.poll(()=>page.evaluate(()=>TPExpeditions.view().pending)).toBe(false);
 expect(await page.evaluate(()=>TPExpeditions.view().s.slice())).toEqual(before);
 expect(await page.evaluate(()=>TPExpeditions.view().notice)).toContain('fehlgeschlagen');
 await page.evaluate(()=>{writeSave=window.expWrite;});
});
test('Expedition: echtes Abholen und Training mit bewusster Wertwahl',async({page})=>{
 await H.importSave(page,readyFixture(3));await H.openExpedition(page);
 const root=page.locator('#tp-expedition-page');
 await expect(root).toHaveAttribute('data-exp-state','ready');
 await root.locator('[data-exp-claim]').click();await quiet(page);
 await expect.poll(()=>page.evaluate(()=>TPExpeditions.view().s[23])).toBe(1);
 await root.locator('[data-exp-item="3"]').click();
 await expect(root).toHaveAttribute('data-exp-state','training');
 const before=await page.evaluate(()=>TPExpeditions.view().s[17]);
 await root.locator('[data-exp-stat="0"]').click();await quiet(page);
 await expect.poll(()=>page.evaluate(()=>TPExpeditions.view().s[23])).toBe(0);
 expect(await page.evaluate(()=>TPExpeditions.view().s[17])).toBe(before+2);
 await page.reload();await H.waitReady(page);await H.openExpedition(page);
 expect(await page.evaluate(()=>TPExpeditions.view().s[23])).toBe(0);
 expect(await page.evaluate(()=>TPExpeditions.view().s[17])).toBe(before+2);
});
