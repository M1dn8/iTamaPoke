const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
if(!globalThis.crypto)globalThis.crypto=require('node:crypto').webcrypto;
const H=require('./helpers');
const T=require('../../../browser_ver/web/storage-tools.js');
let errors;
test.beforeEach(async({page})=>{errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await H.prepare(page);});
test.afterEach(async()=>{expect(errors).toEqual([]);});
test('Sechs Kacheln, Vollseiten, Rueckwege und gemeinsame Optik',async({page})=>{
 await H.game(page);await H.openMenu(page);await expect(page.locator('#toolbar')).toBeHidden();await expect(page.locator('.tp-tools')).toBeHidden();
 const root=page.locator('#tp-app-page');for(const name of ['Tagebuch','Entwicklung','Pokédex','Eier','Sicherungen','Einstellungen'])await expect(root.getByRole('button',{name,exact:true})).toBeVisible();
 for(const name of ['Entwicklung','Pokédex','Eier','Sicherungen']){
  await page.waitForFunction(label=>Array.from(document.querySelectorAll('.tp-tools button')).some(b=>b.textContent.trim()===label&&!b.disabled),name==='Pokédex'?'Dex-Suche':name);await root.getByRole('button',{name,exact:true}).click();const p=H.modal(page);await expect(p).toBeVisible();await expect(p.locator('.tp-panel')).toHaveCSS('background-color','rgb(244, 240, 231)');
  const box=await p.locator('.tp-panel').boundingBox(),shell=await page.locator('#tp-game-shell').boundingBox();expect(Math.abs(box.width-shell.width)).toBeLessThan(3);await p.locator('.tp-modal-head button').click();await expect(root).toBeVisible();
 }
 await root.getByRole('button',{name:'Einstellungen',exact:true}).click();await expect(root.getByRole('button',{name:'Dateien verwalten',exact:true})).toBeVisible();await root.getByRole('button',{name:'Zurück',exact:true}).click();
});
test('Dateiauswahl bleibt ueber das neue Menue erreichbar',async({page})=>{
 await H.openMenu(page);await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('button',{name:'Dateien verwalten',exact:true}).click();
 for(const label of ['Pokémon-Grafiken laden','Rufe laden','Pokédex-Texte laden']){
  const [chooser]=await Promise.all([page.waitForEvent('filechooser'),page.getByRole('button',{name:label,exact:true}).click()]);await chooser.setFiles([]);
 }
 await expect(page.getByRole('heading',{name:'Dateien',exact:true})).toBeVisible();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.tp-tools button')).some(b=>['Dateien','Assets'].includes(b.textContent.trim())&&!b.disabled));await page.getByRole('button',{name:'Dateibestand prüfen',exact:true}).click();await expect(H.modal(page)).toBeVisible();await H.modal(page).locator('.tp-modal-head button').click();await expect(page.getByRole('heading',{name:'Dateien',exact:true})).toBeVisible();
});
test('Tagebuch scrollt in seiner Seite und bleibt nach Reload erhalten',async({page})=>{
 const list=await H.diary(page);await expect(list.locator('article')).toHaveCount(120);if(page.context().browser().browserType().name()==='webkit'){await list.evaluate(n=>n.scrollBy(0,600));}else{await list.hover();await page.mouse.wheel(0,600);}await expect.poll(()=>list.evaluate(n=>n.scrollTop)).toBeGreaterThan(0);await expect(page.getByRole('heading',{name:'Tagebuch',exact:true})).toBeVisible();
 await page.reload();await H.waitReady(page);const next=await H.diary(page);await expect(next.locator('article')).toHaveCount(120);
});
test('Externe Sicherung nimmt grosses Tagebuch mit und stellt es wieder her',async({page},info)=>{
 await H.openMenu(page);await page.getByRole('button',{name:'Sicherungen',exact:true}).click();const p=H.modal(page);
 const [download]=await Promise.all([page.waitForEvent('download'),p.getByRole('button',{name:'Version 1 exportieren',exact:true}).click()]);const path=info.outputPath('synthetische-sicherung.tpsave');await download.saveAs(path);const bytes=await fs.readFile(path);const decoded=await T.decode(bytes);expect(decoded.summary.dex).toBe(1);expect(decoded.values.get('jrcount').value).toBe(120);
 await p.locator('.tp-modal-head button').click();await page.getByRole('button',{name:'Einstellungen',exact:true}).click();
 const accept=d=>d.accept();page.on('dialog',accept);await Promise.all([page.waitForEvent('load'),page.getByRole('button',{name:'Neues Spiel',exact:true}).click()]);page.off('dialog',accept);await H.waitReady(page);
 await H.importSave(page,bytes);const list=await H.diary(page);await expect(list.locator('article')).toHaveCount(120);
});
test('Deutsches Typenspiel sperrt Mehrfachtipps bei Rueckmeldung',async({page})=>{
 await H.game(page);await H.tap(page,202,404);await expect.poll(()=>page.evaluate(()=>screen)).toBe('gamemenu');await H.tap(page,233,355);await expect.poll(()=>page.evaluate(()=>screen)).toBe('game');expect(await page.evaluate(()=>TYPE_NAMES[2])).toBe('FEUER');
 const wrong=await page.evaluate(()=>(TypeGame.correct+1)%3);const pos=await H.point(page,200,234+wrong*60);for(let i=0;i<3;i++)await page.mouse.click(pos.x,pos.y);expect(await page.evaluate(()=>TypeGame.misses)).toBe(1);
 await page.waitForFunction(()=>TypeGame.feedbackUntil===0);
 for(let i=0;i<2;i++){
  const index=await page.evaluate(()=>(TypeGame.correct+1)%3);await H.tap(page,200,234+index*60);if(i===0)await page.waitForFunction(()=>TypeGame.feedbackUntil===0);
 }
 await page.waitForFunction(()=>TypeGame.overUntil>0);await page.waitForFunction(()=>screen==='idle');
});
