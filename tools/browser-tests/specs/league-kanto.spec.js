
const LU=require('./league-ui-helpers');

const AU=require('./arena-ui-helpers');
const {test,expect}=require('@playwright/test');const H=require('./helpers');
function fixture(mask=255){const base=H.fixture(0),fields=[];let at=4;for(let i=0;i<base.readUInt32LE(0);i++){const start=at,n=base[at++],key=base.toString('utf8',at,at+n);at+=n+1;const size=base.readUInt32LE(at);at+=4;const value=Buffer.from(base.subarray(at,at+size));at+=size;if(key==='dexn'||key==='eggT2')value.writeBigInt64LE(150n);if(key==='age')value.writeBigInt64LE(5940n);fields.push(Buffer.concat([base.subarray(start,at-size),value]));}for(const [key,value]of Object.entries({agver:1,agmask:mask,tatk:100,tdef:100,tspe:100})){const k=Buffer.from(key),v=Buffer.alloc(8),n=Buffer.alloc(4);v.writeBigInt64LE(BigInt(value));n.writeUInt32LE(8);fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([1]),n,v]));}const count=Buffer.alloc(4);count.writeUInt32LE(fields.length);return Buffer.concat([count,...fields]);}
async function league(page){await H.openArenaSelection(page);await AU.option(page,'league');await expect.poll(()=>page.evaluate(()=>screen)).toBe('league');}
test.beforeEach(async({page})=>{await H.prepare(page);});

test('Liga: fehlender achter Orden sperrt native und sichtbare Freigabe',async({page})=>{
 await H.importSave(page,fixture(127),150);
 await H.openArenaSelection(page);
 const icon=page.locator('#tp-arena-page [data-arena-option="league"]');
 await expect(icon).toBeVisible();
 await expect(icon).toBeDisabled();
 const before=await page.evaluate(()=>({
  model:TPCollectionModel.encode(TPCollection.read()),
  energy:TPBattleEnergy.view.energy
 }));
 expect(await page.evaluate(()=>
  Module.ccall('tp_lg_prepare_start','number',['number'],[0])
 )).toBe(0);
 expect(await page.evaluate(()=>screen)).toBe('arena');
 expect(await page.evaluate(()=>({
  model:TPCollectionModel.encode(TPCollection.read()),
  energy:TPBattleEnergy.view.energy
 }))).toEqual(before);
});

test('Liga: gewaehlte Originalvariante, echte Heilung, Sieg-Checkpoint, Reload und Fortsetzung ohne Auffuellen',async({page})=>{await H.importSave(page,fixture(),150);await league(page);await LU.variant(page,2);await LU.start(page);await expect.poll(()=>page.evaluate(()=>TPLeague.state?.live)).toBe(1);let v=await page.evaluate(()=>TPLeague.state);expect(v.variant).toBe(2);expect(v.dex).toBe(87);expect(v.level).toBe(54);expect(v.rests).toBe(5);await H.battleAction(page,'rest');expect(await page.evaluate(()=>TPLeague.state.rests)).toBe(4);
 for(let i=0;i<30;i++){v=await page.evaluate(()=>TPLeague.state);if(!v.live||v.resolved||v.index!==0)break;await H.battleAction(page,'heavy');}await expect.poll(()=>page.evaluate(()=>{const s=TPLeague.state;const d=TPLeague.diagnostics;return {state:s.state,live:s.live,index:s.index,phase:d.phase,error:d.error};})).toEqual({state:1,live:0,index:1,phase:'checkpoint',error:''});v=await page.evaluate(()=>TPLeague.state);expect(v.index).toBe(1);expect(v.rests).toBe(4);const hp=v.hp;await page.reload();await H.waitReady(page);await league(page);expect(await page.evaluate(()=>TPLeague.state.hp)).toBe(hp);await LU.resume(page);await expect.poll(()=>page.evaluate(()=>TPLeague.state.live)).toBe(1);v=await page.evaluate(()=>TPLeague.state);expect(v.index).toBe(1);expect(v.rests).toBe(4);expect(v.hp).toBe(hp);
});
