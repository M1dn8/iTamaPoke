const {test,expect}=require('@playwright/test');const H=require('./helpers');const C=require('../fixtures/kanto-reward-catalog.json');
function fixture(future=false){const base=H.fixture(0),fields=[];const extra={lgver:1,lgkdone:true,lgkdate:1700000000,agver:1,agmask:255};if(future)Object.assign(extra,{rkver:2,rkstate:1,rkdex:4,rkarm:0,rkborn:0});for(const [key,value]of Object.entries(extra)){const k=Buffer.from(key),b=typeof value==='boolean'?Buffer.from([value?1:0]):Buffer.alloc(8);if(typeof value!=='boolean')b.writeBigInt64LE(BigInt(value));const n=Buffer.alloc(4);n.writeUInt32LE(b.length);fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([typeof value==='boolean'?0:1]),n,b]));}const count=Buffer.alloc(4);count.writeUInt32LE(base.readUInt32LE(0)+fields.length);return Buffer.concat([count,base.subarray(4),...fields]);}
async function openGift(page){await H.game(page);const a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');for(let i=0;i<4;i++)await H.tap(page,350,382);await H.tap(page,363,308);await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');await H.tap(page,130,435);await expect.poll(()=>page.evaluate(()=>screen)).toBe('league');await H.tap(page,140,440);await expect.poll(()=>page.evaluate(()=>TPHall.active)).toBe(true);await H.tap(page,127,160);await expect.poll(()=>page.evaluate(()=>TPRewardEgg.active)).toBe(true);}
async function choose(page){await H.tap(page,233,132);expect(await page.evaluate(()=>TPRewardEgg.diagnostics.chosen)).toBe(4);page.once('dialog',d=>d.accept());await H.tap(page,320,440);}
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
test('Ehrenei: echte Auswahl, Quota-Ruecknahme, Reservierung/Vormerkung und Reload ohne aktuelle Pflege zu ersetzen',async({page})=>{await H.importSave(page,fixture());await openGift(page);const active=await page.evaluate(()=>TPCollection.read().active);const species=await page.evaluate(()=>fns.speciesId());await page.evaluate(()=>{window.giftWrite=writeSave;writeSave=async()=>{throw Error('synthetic gift quota');};});await choose(page);await expect.poll(()=>page.evaluate(()=>TPRewardEgg.diagnostics.message)).toContain('synthetic gift quota');expect(await page.evaluate(()=>TPRewardEgg.view.state)).toBe(0);expect(await page.evaluate(()=>tpSaveReplacing)).toBe(false);await page.evaluate(()=>{writeSave=window.giftWrite;});await choose(page);await expectSavedGiftState(page,1);expect(await page.evaluate(()=>TPRewardEgg.view.dex)).toBe(4);expect(await page.evaluate(()=>fns.speciesId())).toBe(species);expect(await page.evaluate(()=>TPCollection.read().active)).toBe(active);await H.tap(page,233,386);await expectSavedGiftState(page,2);await page.evaluate(()=>{
 const original=writeSave;
 window.giftDisarmOriginal=original;
 writeSave=async(bytes,force=false)=>{
  if(force)await new Promise(resolve=>{window.releaseGiftDisarm=resolve;});
  return original(bytes,force);
 };
});
await H.tap(page,233,386);
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
test('Ehrenei: bewusste Vormerkung, normaler Pflegeabschluss mit Behalten, echtes Shiny-Schluepfen und genau ein Anspruch',async({page})=>{await H.importSave(page,fixture());await openGift(page);const oldID=await page.evaluate(()=>TPCollection.read().active);await choose(page);await expectSavedGiftState(page,1);await H.tap(page,233,386);await expectSavedGiftState(page,2);await page.reload();await H.waitReady(page);await H.game(page);expect(await page.evaluate(()=>fns.speciesId())).toBe(1);await page.evaluate(()=>TPCollectionGame.openEnd('release'));const dialog=page.getByRole('dialog',{name:'Pflege beenden',exact:true});await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:'Pflege beenden und behalten',exact:true}).click();await expect(dialog).not.toBeVisible();await expect.poll(()=>page.evaluate(()=>fns.ceremony())).toBe(3);await page.reload();await H.waitReady(page);expect(await page.evaluate(()=>fns.isEgg())).toBe(1);expect(await page.evaluate(()=>TPRewardEgg.view.state)).toBe(3);const used=await page.evaluate(()=>TPRewardEgg.view.bornLife);expect(used).toBeGreaterThan(1);await H.game(page);for(let i=0;i<3;i++)await H.tap(page,233,200);await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(4);const snap=await page.evaluate(()=>JSON.parse(Module.ccall('tp_f4_current_snapshot','string',[],[])));expect(snap.shiny).toBe(true);for(const gene of Object.values(snap.data.genes)){expect(gene).toBeGreaterThanOrEqual(90);expect(gene).toBeLessThanOrEqual(110);}await expect.poll(()=>page.evaluate(()=>TPCollection.read().mons.length)).toBe(2);expect(await page.evaluate(id=>TPCollection.read().boxes.flatMap(b=>b.slots).filter(x=>x===id).length,oldID)).toBe(1);await page.reload();await H.waitReady(page);expect(await page.evaluate(()=>fns.speciesId())).toBe(4);expect(await page.evaluate(()=>TPRewardEgg.view.state)).toBe(3);expect(await page.evaluate(()=>TPRewardEgg.view.bornLife)).toBe(used);await openGift(page);expect(await page.evaluate(()=>TPRewardEgg.view.canChoose)).toBe(0);expect(await page.evaluate(()=>TPRewardEgg.view.canArm)).toBe(0);});
test('Ehrenei: Zukunftsmetadaten werden nicht repariert oder neu freigegeben',async({page})=>{await H.importSave(page,fixture(true));await openGift(page);expect(await page.evaluate(()=>TPRewardEgg.view.supported)).toBe(0);expect(await page.evaluate(()=>TPRewardEgg.view.canChoose)).toBe(0);expect(await page.evaluate(()=>Module.ccall('tp_rg_prepare','number',['number','number'],[0,7]))).toBe(0);});
