
const HU=require('./hall-ui-helpers');
const {test,expect}=require('@playwright/test');const H=require('./helpers');const C=require('../fixtures/kanto-reward-catalog.json');
function fixture(future=false){const base=H.fixture(0),fields=[];const extra={lgver:1,lgkdone:true,lgkdate:1700000000,agver:1,agmask:255};if(future)Object.assign(extra,{rkver:2,rkstate:1,rkdex:4,rkarm:0,rkborn:0});for(const [key,value]of Object.entries(extra)){const k=Buffer.from(key),b=typeof value==='boolean'?Buffer.from([value?1:0]):Buffer.alloc(8);if(typeof value!=='boolean')b.writeBigInt64LE(BigInt(value));const n=Buffer.alloc(4);n.writeUInt32LE(b.length);fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([typeof value==='boolean'?0:1]),n,b]));}const count=Buffer.alloc(4);count.writeUInt32LE(base.readUInt32LE(0)+fields.length);return Buffer.concat([count,base.subarray(4),...fields]);}
async function openGift(page){
 await HU.open(page,0);
 await HU.egg(page);
 await expect.poll(()=>page.evaluate(()=>TPRewardEgg.active)).toBe(true);
}
async function choose(page){
 await page.locator('#tp-reward-egg-page [data-reward-dex="4"]').click();
 expect(await page.evaluate(()=>TPRewardEgg.diagnostics.chosen)).toBe(4);
 await page.locator('#tp-reward-egg-page [data-reward-primary]').click();
 await page.locator('#tp-reward-egg-page [data-reward-action="confirm"]').click();
}
async function expectSavedGiftState(page,state){
 await expect.poll(()=>page.evaluate(()=>({
  state:TPRewardEgg.view.state,
  busy:TPRewardEgg.busy,
  replacing:tpSaveReplacing,
  pending:Module.ccall('tp_f4_store_pending','number',[],[])
 }))).toEqual({state,busy:false,replacing:false,pending:0});
}

test.beforeEach(async({page})=>{await H.prepare(page);});
test('Ehrenei: kein Titel kein Anspruch, keine Legendaeren und kein Ditto',async({page})=>{await openGift(page);const v=await page.evaluate(()=>TPRewardEgg.view);expect(v.eligible).toBe(0);expect(v.candidates).toEqual(C);for(const d of [6,25,132,144,145,146,150,151,152])expect(v.candidates).not.toContain(d);expect(await page.evaluate(()=>Module.ccall('tp_rg_prepare','number',['number','number'],[0,4]))).toBe(0);expect(await page.evaluate(()=>TPRewardEgg.view.state)).toBe(0);});
test('Ehrenei: echte Auswahl, Quota-Ruecknahme, Reservierung/Vormerkung und Reload ohne aktuelle Pflege zu ersetzen',async({page})=>{await H.importSave(page,fixture());await openGift(page);const active=await page.evaluate(()=>TPCollection.read().active);const species=await page.evaluate(()=>fns.speciesId());await page.evaluate(()=>{window.giftWrite=writeSave;writeSave=async()=>{throw Error('synthetic gift quota');};});await choose(page);await expect.poll(()=>page.evaluate(()=>TPRewardEgg.diagnostics.message)).toContain('synthetic gift quota');expect(await page.evaluate(()=>TPRewardEgg.view.state)).toBe(0);expect(await page.evaluate(()=>tpSaveReplacing)).toBe(false);await page.evaluate(()=>{writeSave=window.giftWrite;});await choose(page);await expectSavedGiftState(page,1);expect(await page.evaluate(()=>TPRewardEgg.view.dex)).toBe(4);expect(await page.evaluate(()=>fns.speciesId())).toBe(species);expect(await page.evaluate(()=>TPCollection.read().active)).toBe(active);await page.locator('#tp-reward-egg-page [data-reward-primary]').click();await expectSavedGiftState(page,2);await page.evaluate(()=>{
 const original=writeSave;
 window.giftDisarmOriginal=original;
 writeSave=async(bytes,force=false)=>{
  if(force)await new Promise(resolve=>{window.releaseGiftDisarm=resolve;});
  return original(bytes,force);
 };
});
await page.locator('#tp-reward-egg-page [data-reward-primary]').click();
await expect.poll(()=>page.evaluate(()=>({
 state:TPRewardEgg.view.state,busy:TPRewardEgg.busy,
 replacing:tpSaveReplacing,pending:Module.ccall('tp_f4_store_pending','number',[],[])
}))).toEqual({state:1,busy:true,replacing:true,pending:1});
await page.evaluate(()=>{
 writeSave=window.giftDisarmOriginal;
 window.releaseGiftDisarm();
});
await expectSavedGiftState(page,1);
await page.reload();await H.waitReady(page);await openGift(page);expect(await page.evaluate(()=>TPRewardEgg.view.state)).toBe(1);expect(await page.evaluate(()=>TPRewardEgg.view.dex)).toBe(4);expect(await page.evaluate(()=>TPCollection.read().active)).toBe(active);expect(await page.evaluate(()=>fns.speciesId())).toBe(species);});
test('Ehrenei: bewusste Vormerkung, normaler Pflegeabschluss mit Behalten, echtes Shiny-Schluepfen und genau ein Anspruch',async({page})=>{await H.importSave(page,fixture());await openGift(page);const oldID=await page.evaluate(()=>TPCollection.read().active);await choose(page);await expectSavedGiftState(page,1);await page.locator('#tp-reward-egg-page [data-reward-primary]').click();await expectSavedGiftState(page,2);await page.reload();await H.waitReady(page);await H.game(page);expect(await page.evaluate(()=>fns.speciesId())).toBe(1);await page.evaluate(()=>TPCollectionGame.openEnd('release'));const dialog=page.getByRole('dialog',{name:'Pflege beenden',exact:true});await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:'In Box verschieben',exact:true}).click();await expect(dialog).not.toBeVisible();await expect.poll(()=>page.evaluate(()=>fns.ceremony())).toBe(3);await page.reload();await H.waitReady(page);expect(await page.evaluate(()=>fns.isEgg())).toBe(1);expect(await page.evaluate(()=>TPRewardEgg.view.state)).toBe(3);const used=await page.evaluate(()=>TPRewardEgg.view.bornLife);expect(used).toBeGreaterThan(1);await H.game(page);for(let i=0;i<3;i++)await H.tap(page,233,200);await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(4);const snap=await page.evaluate(()=>JSON.parse(Module.ccall('tp_f4_current_snapshot','string',[],[])));expect(snap.shiny).toBe(true);for(const gene of Object.values(snap.data.genes)){expect(gene).toBeGreaterThanOrEqual(90);expect(gene).toBeLessThanOrEqual(110);}await expect.poll(()=>page.evaluate(()=>TPCollection.read().mons.length)).toBe(2);expect(await page.evaluate(id=>TPCollection.read().boxes.flatMap(b=>b.slots).filter(x=>x===id).length,oldID)).toBe(1);await page.reload();await H.waitReady(page);expect(await page.evaluate(()=>fns.speciesId())).toBe(4);expect(await page.evaluate(()=>TPRewardEgg.view.state)).toBe(3);expect(await page.evaluate(()=>TPRewardEgg.view.bornLife)).toBe(used);await openGift(page);expect(await page.evaluate(()=>TPRewardEgg.view.canChoose)).toBe(0);expect(await page.evaluate(()=>TPRewardEgg.view.canArm)).toBe(0);});
test('Ehrenei: Zukunftsmetadaten werden nicht repariert oder neu freigegeben',async({page})=>{await H.importSave(page,fixture(true));await openGift(page);expect(await page.evaluate(()=>TPRewardEgg.view.supported)).toBe(0);expect(await page.evaluate(()=>TPRewardEgg.view.canChoose)).toBe(0);expect(await page.evaluate(()=>Module.ccall('tp_rg_prepare','number',['number','number'],[0,7]))).toBe(0);});



for(const width of [320,390]){
 test('Ehrenei: gemeinsame Kachelfarbe und richtige Rahmenplätze '+width,
 async({page})=>{
  await page.setViewportSize({width,height:844});
  await H.importSave(page,fixture());
  await openGift(page);
  const device=page.locator('#tp-reward-egg-page');
  await expect(device).toBeVisible();

  await expect.poll(()=>page.evaluate(()=>{
   const root=document.getElementById('tp-reward-egg-page');
   const upper=root.querySelector('.tp-reward-upper').getBoundingClientRect();
   const lower=root.querySelector('.tp-reward-lower').getBoundingClientRect();
   const content=root.querySelector('.tp-reward-lower .tp-reward-upright')
    .getBoundingClientRect();
   const shell=root.getBoundingClientRect();
   const action=root.querySelector('[data-reward-primary]')
    .getBoundingClientRect();
   const arrows=Array.from(root.querySelectorAll('.tp-reward-pager>button'));
   const tiles=Array.from(root.querySelectorAll('[data-reward-dex]'));

   const probe=document.createElement('span');
   probe.style.backgroundColor='var(--tp-card,#fffaf0)';
   root.append(probe);
   const expected=getComputedStyle(probe).backgroundColor;
   probe.remove();

   const insideHeight=(rect,pane)=>
    rect.top>=pane.top&&rect.bottom<=pane.bottom;
   const rightFrame=rect=>
    rect.left>=Math.max(upper.right,lower.right)+1&&
    rect.right<=shell.right-1&&rect.width>=43&&rect.height>=43;

   return upper.bottom<lower.top&&
    rightFrame(action)&&insideHeight(action,upper)&&
    arrows.length===2&&arrows.every(element=>{
     const rect=element.getBoundingClientRect();
     return rightFrame(rect)&&insideHeight(rect,lower);
    })&&tiles.length>0&&tiles.every(element=>{
     const rect=element.getBoundingClientRect();
     return rect.width>=43&&rect.height>=43&&
      rect.left>=content.left-1&&rect.right<=content.right+1&&
      rect.top>=content.top-1&&rect.bottom<=content.bottom+1;
    })&&Array.from(root.querySelectorAll('button')).every(
     element=>getComputedStyle(element).backgroundColor===expected
    );
  })).toBe(true);

  const before=await page.evaluate(()=>({
   active:TPCollection.read().active,
   state:TPRewardEgg.view.state,
   pending:Module.ccall('tp_f4_store_pending','number',[],[])
  }));
  await device.locator('[data-reward-dex="4"]').click();

  const sharedBackground=await page.evaluate(()=>{
   const root=document.getElementById('tp-reward-egg-page');
   const probe=document.createElement('span');
   probe.style.backgroundColor='var(--tp-card,#fffaf0)';
   root.append(probe);
   const color=getComputedStyle(probe).backgroundColor;
   probe.remove();
   return color;
  });
  await expect(device.locator('[data-reward-dex="4"]'))
   .toHaveCSS('background-color',sharedBackground);

  await device.locator('[data-reward-primary]').click();
  await expect(device.locator('[data-reward-action="confirm"]')).toBeVisible();
  await expect(device.locator('[data-reward-action="confirm"]'))
   .toHaveCSS('background-color',sharedBackground);
  await expect(device.locator('[data-reward-action="cancel"]'))
   .toHaveCSS('background-color',sharedBackground);
  await device.locator('[data-reward-action="cancel"]').click();

  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,
   state:TPRewardEgg.view.state,
   pending:Module.ccall('tp_f4_store_pending','number',[],[])
  }))).toEqual(before);

  const first=await page.evaluate(()=>TPRewardEgg.diagnostics.page);
  await device.locator('[data-reward-action="next"]').click();
  expect(await page.evaluate(()=>TPRewardEgg.diagnostics.page)).toBe(first+1);
  await device.locator('[data-reward-action="previous"]').click();
  expect(await page.evaluate(()=>TPRewardEgg.diagnostics.page)).toBe(first);
 });
}
