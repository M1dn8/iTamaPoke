const {test,expect}=require('@playwright/test');const H=require('./helpers');
async function card(page){await H.game(page);const a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');for(let i=0;i<4;i++)await H.tap(page,350,382);await expect.poll(()=>page.evaluate(()=>cardPage)).toBe(4);}
async function metrics(page){return page.evaluate(()=>[0,1,2].map(i=>Module.ccall('tp_c3_metric','number',['number'],[i])));}
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const item of [{name:'Staerke',x:103,kind:0},{name:'Tempo',x:233,kind:2},{name:'Verteidigung',x:363,kind:1}]){
 test(item.name+': echte Runde, einzelner Pointerzaehler, passender Wert und Rekord nach Reload',async({page})=>{
  await card(page);const before=await metrics(page);await H.tap(page,item.x,254);await expect.poll(()=>page.evaluate(()=>TPTraining.snapshot?.phase)).toBe('running');
  for(let i=0;i<16;i++){await H.tap(page,233,200);await page.waitForTimeout(35);}expect(await page.evaluate(()=>TPTraining.snapshot.hits)).toBe(16);expect(await metrics(page)).toEqual(before);
  await expect.poll(()=>page.evaluate(()=>TPTraining.snapshot?.phase),{timeout:15000}).toBe('done');const s=await page.evaluate(()=>TPTraining.snapshot);expect(s.gain).toBe(4);expect(s.after-s.before).toBe(4);const after=await metrics(page);for(let i=0;i<3;i++)expect(after[i]).toBe(before[i]+(i===item.kind?4:0));
  await H.tap(page,233,390);await page.reload();await H.waitReady(page);expect(await metrics(page)).toEqual(after);await card(page);await H.tap(page,item.x,254);expect(await page.evaluate(()=>TPTraining.snapshot.record)).toBe(16);await H.tap(page,233,422);expect(await metrics(page)).toEqual(after);
 });
}
test('Speicherfehler rollt echte native Vergabe zurueck, Hintergrundabbruch gibt nichts',async({page})=>{
 await card(page);const before=await metrics(page);await page.evaluate(()=>{window.f1RealWrite=writeSave;writeSave=async()=>{throw new DOMException('synthetic training failure','QuotaExceededError');};});await H.tap(page,233,254);for(let i=0;i<8;i++){await H.tap(page,233,200);await page.waitForTimeout(35);}await expect.poll(()=>page.evaluate(()=>TPTraining.snapshot?.phase),{timeout:15000}).toBe('failed');expect(await metrics(page)).toEqual(before);expect(await page.evaluate(()=>tpSaveReplacing)).toBe(false);await page.evaluate(()=>{writeSave=window.f1RealWrite;});await H.tap(page,233,390);
 await H.tap(page,363,254);await H.tap(page,233,200);await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'});document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');expect(await metrics(page)).toEqual(before);expect(await page.evaluate(()=>TPTraining.snapshot.phase)).toBe('aborted');
});
