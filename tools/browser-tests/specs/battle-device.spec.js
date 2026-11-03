 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
function strong(){
 const b=H.fixture(0),fields=[];let p=4;
 for(let i=0;i<b.readUInt32LE(0);i++){
  const n=b[p++],key=b.toString('utf8',p,p+n);p+=n;
  const type=b[p++],size=b.readUInt32LE(p);p+=4;
  const value=Buffer.from(b.subarray(p,p+size));p+=size;
  if(key==='dexn')value.writeBigInt64LE(376n);
  if(key==='age')value.writeBigInt64LE(5940n);
  if(['gatk','gdef','gspe'].includes(key))value.writeBigInt64LE(110n);
  if(['full','joy','ene','hyg','bond'].includes(key))value.writeBigInt64LE(100n);
  const k=Buffer.from(key),len=Buffer.alloc(4);len.writeUInt32LE(value.length);
  fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),len,value]));
 }
 for(const key of ['tatk','tdef','tspe']){
  const k=Buffer.from(key),len=Buffer.alloc(4),v=Buffer.alloc(8);
  len.writeUInt32LE(8);v.writeBigInt64LE(100n);
  fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([1]),len,v]));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.length);
 return Buffer.concat([count,...fields]);
}
async function start(page){
 await H.importSave(page,strong(),376);
 await H.openWildBattleSelection(page);
 await H.startWildBattleFromSelection(page);
}

const targets=(page,names)=>page.evaluate(names=>Object.fromEntries(
 names.map(name=>[name,TPBattleView.target(name)])
),names);


test('Gedrehtes Kampfgerät: ganze Hülle, getrennte Displays und echte Aktionen',
async({page})=>{
 await H.prepare(page);await start(page);
 const device=page.locator('#tp-battle-page');
 await expect(device).toBeVisible();
 const scene=await device.locator('.tp-battle-scene').evaluate(el=>{
  const box=el.getBoundingClientRect();
  return {width:el.width,height:el.height,
   expectedWidth:Math.round(box.width*2),expectedHeight:Math.round(box.height*2)};
 });
 expect(scene.width).toBe(scene.expectedWidth);
 expect(scene.height).toBe(scene.expectedHeight);
 await expect(device.locator('.tp-battle-scene'))
  .toHaveAttribute('data-battle-paint','viewport');
 await expect(device.locator('.tp-battle-frame-menu')).not.toHaveText('');

 await expect(device).toBeVisible();
 const rotation=await device.evaluate(el=>{
  const m=new DOMMatrix(getComputedStyle(el).transform);
  return [m.a,m.b,m.c,m.d];
 });
 [0,1,-1,0].forEach((v,i)=>expect(rotation[i]).toBeCloseTo(v,5));
 const upper=await device.locator('.tp-battle-upper').boundingBox();
 const lower=await device.locator('.tp-battle-lower').boundingBox();

 const boxSlot=await device.locator('.tp-battle-frame-box-slot').boundingBox();
 expect(boxSlot.x).toBeGreaterThanOrEqual(lower.x+lower.width+1);
 expect(boxSlot.y).toBeGreaterThanOrEqual(lower.y-1);
 expect(boxSlot.y+boxSlot.height).toBeLessThanOrEqual(lower.y+lower.height+1);

 expect(upper.y+upper.height).toBeLessThanOrEqual(lower.y+1);
 const middle=await device.locator('.tp-pokedex-spine').boundingBox();
 expect(middle.width).toBeGreaterThan(middle.height);
 for(const action of ['fight','rest','info','abort']){
  const button=device.locator('[data-battle-action="'+action+'"]');
  await expect(button).toBeVisible();
  const box=await button.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
 }
 const before=await page.evaluate(()=>({
  round:fns.battleRound(),hp:fns.battlePlayerHp(),
  enemy:fns.battleEnemyHp(),energy:TPBattleEnergy.view.energy
 }));
 const originalTop=(await device.locator('[data-battle-action="fight"]').boundingBox()).y;
 await H.battleAction(page,'fight');
 const movesTop=(await device.locator('[data-battle-action="heavy"]').boundingBox()).y;
 expect(Math.abs(movesTop-originalTop)).toBeLessThanOrEqual(1);
 await H.battleAction(page,'back');
 expect(await page.evaluate(()=>({
  round:fns.battleRound(),hp:fns.battlePlayerHp(),
  enemy:fns.battleEnemyHp(),energy:TPBattleEnergy.view.energy
 }))).toEqual(before);
 await H.battleAction(page,'quick');
 await expect.poll(()=>page.evaluate(()=>fns.battleRound())).toBe(before.round+1);
});


test('Kampfgeräte-CSS darf die Aktivitätenvorschau nicht überlagern',
async({page})=>{
 await H.prepare(page);
 await H.game(page);
 await H.tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
 const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
 await H.tap(page,target.x+target.w/2,target.y+target.h/2);
 await page.locator('[data-activity-choice="trainer"]').click();

 const preview=page.locator('#tp-activity-page .tp-battle-scene');
 const open=page.locator('[data-activity-start="trainer"]');
 await expect(preview).toBeVisible();
 await expect(preview).not.toHaveCSS('position','absolute');
 await expect(open).toBeVisible();

 await expect.poll(()=>open.evaluate(el=>{
  const box=el.getBoundingClientRect();
  const top=document.elementFromPoint(box.x+box.width/2,box.y+box.height/2);
  return !!top&&(top===el||el.contains(top));
 })).toBe(true);

 await open.click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('trainer');
});
