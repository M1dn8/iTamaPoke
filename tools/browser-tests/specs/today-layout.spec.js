const {test,expect}=require('@playwright/test');
const H=require('./helpers');
async function open(page){
 const root=await H.openStatus(page);
 await root.locator('[data-status-tab="today"]').click();
 await expect(root).toHaveAttribute('data-status-view','today');
 return root;
}
const snapshot=page=>page.evaluate(()=>({
 active:TPCollection.read().active,
 joy:fns.joy(),bond:fns.bond(),
 goals:Array.from({length:fns.dailyGoalCount()},(_,index)=>({
  kind:fns.dailyGoalKind(index),progress:fns.dailyGoalProgress(index),
  target:fns.dailyGoalTarget(index),done:fns.dailyGoalComplete(index)
 }))
}));
function fixture(day,complete=false){
 const base=H.fixture(0),fields=new Map();let at=4;
 for(let i=0;i<base.readUInt32LE(0);i++){
  const length=base[at++],key=base.toString('utf8',at,at+length);at+=length;
  const type=base[at++],size=base.readUInt32LE(at);at+=4;
  fields.set(key,[type,Buffer.from(base.subarray(at,at+size))]);at+=size;
 }
 for(const [key,value]of Object.entries({dgday:day,dgdone:complete?7:1})){
  const bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));fields.set(key,[1,bytes]);
 }
 fields.set('dgtype',[3,Buffer.from([0,1,3])]);
 fields.set('dgprog',[3,Buffer.from(complete?[1,1,5]:[1,0,2])]);
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);
 return Buffer.concat([count,...Array.from(fields,([key,[type,value]])=>{
  const name=Buffer.from(key),size=Buffer.alloc(4);size.writeUInt32LE(value.length);
  return Buffer.concat([Buffer.from([name.length]),name,Buffer.from([type]),size,value]);
 })]);
}
async function nativeDay(page){
 return page.evaluate(()=>{
  const parsed=TPStoreTools.parseLegacy(exportStateBytes(Module));
  return parsed.values.get('dgday').value;
 });
}
async function fits(page){
 await expect.poll(()=>page.evaluate(()=>{
  const root=document.getElementById('tp-status-page');
  const panes=Array.from(root.querySelectorAll('.tp-status-scroll'));
  return panes.length===2&&panes.every(pane=>{
   const box=pane.getBoundingClientRect();
   return pane.scrollHeight<=pane.clientHeight+1&&
    Array.from(pane.children).every(child=>{
     const r=child.getBoundingClientRect();
     return r.top>=box.top-1&&r.bottom<=box.bottom+1;
    });
  });
 })).toBe(true);
}
test.beforeEach(async({page})=>{await H.prepare(page);});

for(const width of [320,390,480]){
 test('Heute: Aufgabenbrett und Details ohne Scrollen '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const root=await open(page),before=await snapshot(page);
  await expect(root.locator('[data-status-goal]')).toHaveCount(3);
  await expect(root.locator('[data-today-overview]')).toHaveCount(1);
  await expect(root.locator('.tp-status-today-right'))
   .toHaveAttribute('data-status-today-view','overview');
  await fits(page);
  for(let index=0;index<3;index++){
   const tile=root.locator('[data-status-goal="'+index+'"]');
   await tile.click();
   await expect(tile).toHaveAttribute('aria-pressed','true');
   await expect(root.locator('.tp-status-today-right'))
    .toHaveAttribute('data-status-today-view','goal');
   await fits(page);
   expect(await snapshot(page)).toEqual(before);
  }
  await root.locator('[data-status-back]').click();
  await expect(root.locator('.tp-status-today-right'))
   .toHaveAttribute('data-status-today-view','overview');
  expect(await page.evaluate(()=>screen)).toBe('card');
  await fits(page);
  await root.locator('[data-status-back]').click();
  expect(await page.evaluate(()=>screen)).toBe('idle');
 });
}
for(const complete of [false,true]){
 test('Heute: synthetischer '+(complete?'fertiger':'teilweiser')+
  ' Zustand vergibt beim Ansehen keinen Bonus',async({page})=>{
  await open(page);
  const day=await nativeDay(page);
  await H.importSave(page,fixture(day,complete));
  const root=await open(page);
  const before=await snapshot(page);
  expect(before.goals.map(goal=>goal.kind)).toEqual([0,1,3]);
  expect(before.goals.filter(goal=>goal.done).length).toBe(complete?3:1);
  await expect(root.locator('.tp-status-today-right'))
   .toHaveAttribute('data-today-all-done',String(complete));
  for(let index=0;index<3;index++){
   await root.locator('[data-status-goal="'+index+'"]').click();
   await root.locator('[data-today-overview]').click();
  }
  expect(await snapshot(page)).toEqual(before);
  await expect(root.locator('[data-name-apply],[data-exp-claim]')).toHaveCount(0);
 });
}

test('Heute: abgeschlossene Kacheln deutlich markiert',async({page})=>{
 await open(page);
 const day=await nativeDay(page);
 await H.importSave(page,fixture(day,false));
 const root=await open(page),before=await snapshot(page);
 const done=root.locator('[data-status-goal="0"]');
 await expect(done).toHaveAttribute('data-done','true');
 await expect(done).toHaveCSS('background-color','rgb(229, 239, 223)');
 await expect(done.locator('.tp-today-done-tick')).toHaveCSS('background-color','rgb(78, 147, 97)');
 await done.click();
 await expect(done).toHaveAttribute('aria-pressed','true');
 await expect(done).toHaveCSS('border-top-color','rgb(99, 150, 189)');
 await expect(done).toHaveCSS('background-color','rgb(229, 239, 223)');
 expect(await snapshot(page)).toEqual(before);
});
