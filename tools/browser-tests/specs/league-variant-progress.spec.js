'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers'),F=require('./story-fixtures');
const halls=require('../fixtures/p06-mew-hall.json');

function fixture(mask){
 const base=F.withProgress(H.fixture(0),{kanto:255,johto:0});
 const fields=new Map();let at=4;
 for(let i=0;i<base.readUInt32LE(0);i++){
  const length=base[at++],key=base.toString('utf8',at,at+length);
  at+=length;
  const type=base[at++],size=base.readUInt32LE(at);at+=4;
  fields.set(key,[type,Buffer.from(base.subarray(at,at+size))]);at+=size;
 }
 const number=value=>{
  const bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));return bytes;
 };
 fields.set('lgver',[1,number(1)]);
 fields.set('lgkdone',[0,Buffer.from([mask?1:0])]);
 fields.set('lgkdate',[1,number(mask?1700000000:0)]);
 fields.delete('lhver');fields.delete('lhdata');
 if(mask){
  const hall=halls.find(row=>row.mask===mask);
  if(!hall)throw Error('Native hall fixture missing: '+mask);
  fields.set('lhver',[1,number(hall.version)]);
  fields.set('lhdata',[3,Buffer.from(hall.hex,'hex')]);
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);
 return Buffer.concat([count,...Array.from(fields,([key,[type,value]])=>{
  const name=Buffer.from(key),length=Buffer.alloc(4);
  length.writeUInt32LE(value.length);
  return Buffer.concat([Buffer.from([name.length]),name,Buffer.from([type]),length,value]);
 })]);
}
async function openLeague(page){
 const activity=await H.openBattleSelection(page);
 await activity.locator('[data-activity-choice="league"]').click();
 await activity.locator('[data-battle-region-toggle]').click();
 await activity.locator('[data-battle-region="0"]').click();
 await activity.locator('[data-activity-start="league"]').click();
 await expect(page.locator('#tp-league-page')).toBeVisible();
}
async function unchangedState(page){
 return page.evaluate(()=>({
  collection:TPCollectionModel.encode(TPCollection.read()),
  energy:TPBattleEnergy.view.energy,
  hall:Module.ccall('tp_region_hall_view','string',['number'],[0])
 }));
}
for(const mask of [0,1,3,7]){
 test('UI01 Kanto-Varianten: gespeicherte Maske '+mask,async({page})=>{
  await page.setViewportSize({width:320,height:568});
  await H.prepare(page,fixture(mask));
  await openLeague(page);
  const root=page.locator('#tp-league-page');
  const count=[0,1,2].filter(index=>!!(mask&(1<<index))).length;
  await expect(root.locator('[data-league-progress-count]')).toHaveText(count+'/3');
  const before=await unchangedState(page);
  await root.locator('[data-league-variants]').click();
  await expect(root.locator('[data-league-variant]')).toHaveCount(3);
  for(let i=0;i<3;i++){
   const button=root.locator('[data-league-variant="'+i+'"]');
   await expect(button).toHaveAttribute('data-league-completed',String(!!(mask&(1<<i))));
   await expect(button).toBeEnabled();
   await expect(button.locator('canvas')).toBeVisible();
   if(mask&(1<<i))
    await expect(button.locator('.tp-league-completed-mark')).toHaveText('✓');
  }
  await root.locator('[data-league-variant="0"]').click();
  await expect(root).toHaveAttribute('data-league-view','overview');
  await expect(root.locator('[data-league-variants]'))
   .toHaveAttribute('data-league-completed',String(!!(mask&1)));
  expect(await unchangedState(page)).toEqual(before);
  const progress=root.locator('[data-league-progress-count]');
  expect(await progress.evaluate(element=>{
   const a=element.getBoundingClientRect();
   const b=document.getElementById('tp-game-shell').getBoundingClientRect();
   return a.width>0&&a.left>=b.left-1&&a.right<=b.right+1;
  })).toBe(true);
  await page.reload();await H.waitReady(page);
  await openLeague(page);
  await expect(root.locator('[data-league-progress-count]')).toHaveText(count+'/3');
 });
}
