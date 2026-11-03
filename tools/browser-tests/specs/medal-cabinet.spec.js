const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const snapshot=page=>page.evaluate(()=>({
 active:TPCollection.read().active,
 ids:TPCollection.read().mons.map(mon=>mon.id),
 medals:Array.from({length:fns.medalCount()},(_,i)=>fns.hasMedal(i)),
 records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()],
 battle:[fns.battleRecordLine(),fns.battleStreakLine(),fns.battleBestLine()]
}));
async function fits(page){
 await expect.poll(()=>page.evaluate(()=>{
  const panes=Array.from(document.querySelectorAll('#tp-status-page .tp-status-scroll'));
  return panes.length===2&&panes.every(pane=>{
   const box=pane.getBoundingClientRect();
   return pane.scrollHeight<=pane.clientHeight+1&&Array.from(pane.children).every(child=>{
    const r=child.getBoundingClientRect();
    return r.top>=box.top-1&&r.bottom<=box.bottom+1;
   });
  });
 })).toBe(true);
}
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Medaillenvitrine: alle Motive und Nebenansichten ohne Scrollen '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const root=await H.openStatus(page);
  await root.locator('[data-status-tab="achievements"]').click();
  const before=await snapshot(page);
  const count=await page.evaluate(()=>fns.medalCount());
  expect(count).toBe(8);
  await expect(root.locator('[data-status-medal]')).toHaveCount(count);
  const sizes=await root.locator('[data-status-medal]').evaluateAll(nodes=>nodes.map(node=>{
   const r=node.getBoundingClientRect();return {w:r.width,h:r.height};
  }));
  expect(sizes.every(size=>size.w>=24&&size.h>=24)).toBe(true);
  for(let index=0;index<count;index++){
   const pick=root.locator('[data-status-medal="'+index+'"]');
   await pick.click();
   await expect(pick).toHaveAttribute('aria-pressed','true');
   await expect(pick).toHaveAttribute('data-earned',String(before.medals[index]!==0));
   await expect(root.locator('.tp-medal-gallery-right'))
    .toContainText(await page.evaluate(i=>fns.medalDescription(i),index));
   await expect(root.locator('.tp-medal-podium')).toHaveCount(1);
   await fits(page);
  }
  await root.locator('[data-status-achievement="records"]').click();
  await expect(root.locator('[data-status-record]')).toHaveCount(5);
  await fits(page);
  await root.locator('[data-status-achievement="battle"]').click();
  await expect(root.locator('[data-battle-best] strong')).toHaveText(String(await page.evaluate(()=>fns.bestBattleStreak())));
  await fits(page);
  expect(await snapshot(page)).toEqual(before);
 });
}
