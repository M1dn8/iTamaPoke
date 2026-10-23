const {test,expect}=require('@playwright/test');const H=require('./helpers');
async function stored(page){return page.evaluate(async()=>{
 const raw=await new Promise((resolve,reject)=>{const q=indexedDB.open('itamapoke',1);q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,tx=db.transaction('save','readonly'),r=tx.objectStore('save').get('state');let value;r.onsuccess=()=>{value=r.result;};tx.oncomplete=()=>{db.close();resolve(value);};tx.onerror=()=>reject(tx.error);};});
 const field=TPStoreTools.parseLegacy(new Uint8Array(raw)).values.get('f4col');return field?TPCollectionModel.decode(new TextDecoder().decode(field.value)):null;
});}
test.beforeEach(async({page})=>{await H.prepare(page);await H.game(page);await expect.poll(()=>page.evaluate(()=>typeof TPCollection!=='undefined'&&screen==='idle')).toBe(true);});
test('F4-B2: real native store + IndexedDB commit, reload and legacy import without invented individuals',async({page})=>{
 expect(await page.evaluate(()=>Module.ccall('tp_f4_store_size','number',[],[]))).toBeGreaterThan(0);
 await page.evaluate(()=>TPCollection.apply('renameBox',0,'B2 gespeichert'));
 expect((await stored(page)).boxes[0].name).toBe('B2 gespeichert');
 expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(1);expect(await page.evaluate(()=>TPCollection.read().mons[0].origin)).toBe('existing');
 await page.reload();await H.waitReady(page);await H.game(page);
 expect(await page.evaluate(()=>TPCollection.read().boxes[0].name)).toBe('B2 gespeichert');
 await H.importSave(page,H.fixture());await H.game(page);
 expect(await page.evaluate(()=>Module.ccall('tp_f4_store_size','number',[],[]))).toBeGreaterThan(0);
 expect((await stored(page)).mons.length).toBe(1);expect((await stored(page)).boxes[0].name).toBe('Box 1');
});
test('F4-B2: quota/open failure keeps native collection and disk at the previous save',async({page})=>{
 await page.evaluate(()=>TPCollection.apply('renameBox',0,'Vorher'));
 const result=await page.evaluate(async()=>{const original=openDb,before=TPCollection.read(),pet=Module.ccall('tp_f4_current_snapshot','string',[],[]);let failed=false;
 openDb=()=>Promise.reject(Error('F4-B2 intentional open failure'));
 try{await TPCollection.apply('renameBox',0,'Nicht speichern');}catch(_){failed=true;}finally{openDb=original;}
 return {failed,equal:JSON.stringify(TPCollection.read())===JSON.stringify(before),petEqual:Module.ccall('tp_f4_current_snapshot','string',[],[])===pet,pending:Module.ccall('tp_f4_store_pending','number',[],[]),busy:TPCollection.busy,gate:tpSaveReplacing};});
 expect(result).toEqual({failed:true,equal:true,petEqual:true,pending:0,busy:false,gate:false});
 expect((await stored(page)).boxes[0].name).toBe('Vorher');
});
test('F4-B2: deferred durable write locks frames/navigation and rejects a second operation',async({page})=>{
 await page.evaluate(()=>{window.__f4OriginalWrite=writeSave;window.__f4OriginalCall=Module.ccall;window.__f4Ticks=0;Module.ccall=function(...args){if(args[0]==='tp_tick')window.__f4Ticks++;return window.__f4OriginalCall.apply(Module,args);};writeSave=async(bytes,force=false)=>{if(force)await new Promise(resolve=>{window.__f4Release=resolve;});return window.__f4OriginalWrite(bytes,force);};window.__f4Task=TPCollection.apply('renameBox',0,'Nach Commit');});
 await page.waitForFunction(()=>typeof window.__f4Release==='function');
 const during=await page.evaluate(async()=>{let duplicate=false;try{await TPCollection.apply('renameBox',1,'Parallel');}catch(e){duplicate=e.code==='BUSY';}onSwipe(-1);handleTap(233,390);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return {duplicate,screen,busy:TPCollection.busy,gate:tpSaveReplacing,ticks:window.__f4Ticks,visibleName:TPCollection.read().boxes[0].name};});
 expect(during).toEqual({duplicate:true,screen:'idle',busy:true,gate:true,ticks:0,visibleName:'Box 1'});
 await page.evaluate(async()=>{window.__f4Release();await window.__f4Task;writeSave=window.__f4OriginalWrite;Module.ccall=window.__f4OriginalCall;});
 expect((await stored(page)).boxes[0].name).toBe('Nach Commit');
 expect(await page.evaluate(()=>({busy:TPCollection.busy,gate:tpSaveReplacing,pending:Module.ccall('tp_f4_store_pending','number',[],[])}))).toEqual({busy:false,gate:false,pending:0});
});
