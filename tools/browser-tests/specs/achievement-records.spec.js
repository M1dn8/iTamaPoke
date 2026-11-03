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
 test('Erfolge: spielerische Rekordkarten und Bilanzplaketten '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const root=await H.openStatus(page);
  await root.locator('[data-status-tab="achievements"]').click();
  const before=await snapshot(page);

  await root.locator('[data-status-achievement="records"]').click();
  await expect(root.locator('[data-status-record]')).toHaveCount(5);
  for(let index=0;index<5;index++){
   const card=root.locator('[data-status-record="'+index+'"]');
   await expect(card.locator('.tp-status-icon svg')).toHaveCount(1);
   await expect(card.locator('.tp-record-value strong')).toHaveText(String(before.records[index]));
  }
  await fits(page);

  await root.locator('[data-status-achievement="battle"]').click();
  await expect(root.locator('[data-status-battle-record]')).toHaveCount(3);
  const totals=before.battle[0].match(/[0-9]+/g);
  const current=before.battle[1].match(/[0-9]+/g);
  expect(totals).toHaveLength(2);expect(current).toHaveLength(1);
  await expect(root.locator('[data-battle-wins] strong')).toHaveText(totals[0]);
  await expect(root.locator('[data-battle-losses] strong')).toHaveText(totals[1]);
  await expect(root.locator('[data-battle-current] strong')).toHaveText(current[0]);
  await expect(root.locator('[data-battle-best] strong'))
   .toHaveText(String(await page.evaluate(()=>fns.bestBattleStreak())));
  await expect(root.locator('[data-status-battle-record="0"] .tp-status-icon svg'))
   .toHaveCount(2);
  await expect(root.locator('[data-status-battle-record="1"] .tp-status-icon svg'))
   .toHaveCount(1);
  await expect(root.locator('[data-status-battle-record="2"] .tp-status-icon svg'))
   .toHaveCount(1);
  await fits(page);

  await root.locator('[data-status-medal="0"]').click();
  await expect(root.locator('.tp-medal-podium')).toHaveCount(1);
  await expect(root.locator('[data-status-medal]')).toHaveCount(8);
  expect(await snapshot(page)).toEqual(before);
 });
}
