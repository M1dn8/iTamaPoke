const {test,expect}=require('@playwright/test');const H=require('./helpers');
function trainedFixture(){
 const base=H.fixture(),extra=[];let pos=4;for(let i=0;i<base.readUInt32LE(0);i++){const len=base[pos++],key=base.toString('utf8',pos,pos+len);pos+=len+1;const size=base.readUInt32LE(pos);pos+=4;if(key==='age')base.writeBigInt64LE(5940n,pos);pos+=size;}
 for(const key of ['tatk','tdef','tspe']){const k=Buffer.from(key),len=Buffer.alloc(4),v=Buffer.alloc(8);len.writeUInt32LE(8);v.writeBigInt64LE(100n);extra.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([1]),len,v]));}
 const count=Buffer.alloc(4);count.writeUInt32LE(base.readUInt32LE(0)+3);return Buffer.concat([count,base.subarray(4),...extra]);
}
async function card(page){await H.game(page);const a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');for(let i=0;i<4;i++)await H.tap(page,350,382);await expect.poll(()=>page.evaluate(()=>cardPage)).toBe(4);}

async function arena(page){await H.tap(page,363,308);await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');await H.tap(page,130,134);}
async function begin(page){await arena(page);await H.tap(page,233,354);await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');}
async function match(page){for(let i=0;i<24;i++){const s=await page.evaluate(()=>({resolved:!!fns.battleResolved(),next:!!TPTrainer.get(3),phase:TPArena.snapshot?.phase}));if(s.resolved||s.phase!=='fighting')return s;await H.tap(page,112,387);await H.tap(page,149,321);}throw Error('Arena exceeded native turn limit');}
const mask=page=>page.evaluate(()=>Module.ccall('tp_f3_mask','number',[],[]));
test.beforeEach(async({page})=>{await H.prepare(page);await H.importSave(page,trainedFixture());await card(page);});
test('Arena: echte Serie, genau ein gespeicherter Orden, Koffer, Reload und Backup-Wiederherstellung',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await begin(page);expect(await mask(page)).toBe(0);await match(page);expect(await page.evaluate(()=>TPTrainer.get(3))).toBe(1);expect(await mask(page)).toBe(0);
 const carry=await page.evaluate(()=>[fns.battlePlayerHp(),Module.ccall('tp_battle_rest_uses_left','number',[],[])]);await H.tap(page,233,390);expect(await page.evaluate(()=>[fns.battlePlayerHp(),Module.ccall('tp_battle_rest_uses_left','number',[],[])])).toEqual(carry);
 await match(page);await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('done');expect(await mask(page)).toBe(1);expect(await page.evaluate(()=>fns.battleCatchOffered())).toBe(0);
 const date=await page.evaluate(()=>Module.ccall('tp_f3_date','number',['number'],[0]));expect(date).toBeGreaterThan(0);await H.tap(page,233,390);await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');const saved=Buffer.from(await page.evaluate(()=>Array.from(exportStateBytes(Module))));await page.reload();await H.waitReady(page);expect(await mask(page)).toBe(1);
 await card(page);await begin(page);await match(page);await H.tap(page,233,390);await match(page);await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('repeat');expect(await mask(page)).toBe(1);expect(await page.evaluate(()=>Module.ccall('tp_f3_date','number',['number'],[0]))).toBe(date);
 await H.tap(page,233,435);await H.tap(page,233,435);await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');await H.importSave(page,trainedFixture());expect(await mask(page)).toBe(0);await H.importSave(page,saved);expect(await mask(page)).toBe(1);expect(errors).toEqual([]);
});
test('Arena: Speicherfehler, erneute Speicherung und Hintergrundabbruch ohne weiteren Orden',async({page})=>{
 await begin(page);await match(page);await H.tap(page,233,390);await page.evaluate(()=>{window.f3Write=writeSave;writeSave=async()=>{throw new DOMException('synthetic badge write failure','QuotaExceededError');};});await match(page);await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('failed');expect(await mask(page)).toBe(0);expect(await page.evaluate(()=>tpSaveReplacing)).toBe(false);
 await page.evaluate(()=>{writeSave=window.f3Write;});await H.tap(page,233,390);await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('done');expect(await mask(page)).toBe(1);await H.tap(page,233,435);await H.tap(page,130,134);await H.tap(page,233,354);await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'});document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');expect(await mask(page)).toBe(1);expect(await page.evaluate(()=>TPArena.snapshot)).toBe(null);
});
test('Arena: lokale PNG-Auswahl und Speicherung ohne Netzwerk oder vorzeitigen Orden',async({page})=>{
 await arena(page);const external=[];page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:8765/'))external.push(r.url());});const chooser=page.waitForEvent('filechooser');await H.tap(page,233,396);const input=await chooser;
 await input.setFiles({name:'rocko.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVR4nGN0q4j6z0ABYKJE86gBowaMGjCYDAAAvLgCN3gxOuEAAAAASUVORK5CYII=','base64')});await expect.poll(()=>page.evaluate(()=>TPArena.busy)).toBe(false);
 await expect.poll(()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('itamapoke-arena-art',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('portraits','readonly'),q=tx.objectStore('portraits').get('rocko');let exists=false;q.onsuccess=()=>exists=q.result instanceof Blob;tx.oncomplete=()=>{db.close();resolve(exists);};tx.onerror=()=>reject(tx.error);};r.onerror=()=>reject(r.error);}))).toBe(true);
 expect(await mask(page)).toBe(0);expect(external).toEqual([]);await page.reload();await H.waitReady(page);expect(await mask(page)).toBe(0);
});
