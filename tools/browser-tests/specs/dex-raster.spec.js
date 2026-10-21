const {test,expect}=require('@playwright/test');const H=require('./helpers');
async function search(page){await H.openMenu(page);await page.waitForFunction(()=>Array.from(document.querySelectorAll('.tp-tools button')).some(b=>['Dex-Suche','Pokédex-Suche'].includes(b.textContent.trim())&&!b.disabled));await page.getByRole('button',{name:'Pokédex',exact:true}).click();await expect(H.modal(page)).toBeVisible();}
async function grid(page){await expect.poll(()=>page.evaluate(()=>screen==='dex'&&dexScreen==='grid')).toBe(true);}
async function back(page){await H.tap(page,408,25);await expect(page.locator('#tp-app-page')).toBeVisible();}
test.beforeEach(async({page})=>{await H.prepare(page);});
test('Raster: ein Listenabruf, letzte Teilseite, Detail und Rueckweg',async({page})=>{
 await search(page);await page.getByRole('button',{name:'Erste Dex-Seite',exact:true}).click();await grid(page);
 const calls=await page.evaluate(()=>{const real=tpComfortDexIds;let calls=0;tpComfortDexIds=()=>{calls++;return real();};try{drawDexGrid();return calls;}finally{tpComfortDexIds=real;}});expect(calls).toBe(1);
 await H.tap(page,100,456);await expect.poll(()=>page.evaluate(()=>dexPage)).toBe(64);expect(await page.evaluate(()=>dexGridSnapshot().ids.slice(dexPage*16,dexPage*16+16))).toEqual([1025]);
 await H.tap(page,103,128);await expect.poll(()=>page.evaluate(()=>dexScreen)).toBe('detail');expect(await page.evaluate(()=>dexDetailDex)).toBe(1025);await H.tap(page,233,424);await grid(page);await back(page);
});
test('Raster: leere Suche und Sammelfilter bleiben aktuell',async({page})=>{
 await search(page);await page.getByRole('searchbox',{name:'Name oder Nummer',exact:true}).fill('#1026');await page.getByRole('button',{name:'Filter im Pokédex anwenden',exact:true}).click();await grid(page);expect(await page.evaluate(()=>dexGridSnapshot().ids.length)).toBe(0);await back(page);
 await search(page);await page.getByRole('searchbox',{name:'Name oder Nummer',exact:true}).fill('');await H.modal(page).locator('select').nth(2).selectOption('raised');await page.getByRole('button',{name:'Filter im Pokédex anwenden',exact:true}).click();await grid(page);expect(await page.evaluate(()=>dexGridSnapshot().ids.length)).toBe(25);
 await H.tap(page,334,78);await expect.poll(()=>page.evaluate(()=>dexFilter)).toBe(2);expect(await page.evaluate(()=>dexGridSnapshot().ids.length)).toBe(0);expect(await page.evaluate(()=>[fns.registeredCount(),fns.caughtCount()])).toEqual([25,0]);
});
