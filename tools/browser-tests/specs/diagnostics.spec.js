const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');const H=require('./helpers');
async function open(page){await H.openMenu(page);await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('button',{name:'Diagnose',exact:true}).click();await expect(page.getByRole('heading',{name:'Diagnose',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toBeEnabled();}
test.beforeEach(async({page})=>{await H.prepare(page);});
test('Diagnose prueft lesend und kehrt in Einstellungen zurueck',async({page})=>{
 await open(page);const p=await page.evaluate(()=>TPDiagnostics.state());expect(p.pruefung.spielstand.status).toBe('Gespeicherte Kopie lesbar');expect(p.pruefung.dateien.Grafikdateien).toBe(0);await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Zurück',exact:true}).click();await expect(page.getByRole('heading',{name:'Einstellungen',exact:true})).toBeVisible();
});
test('Lokaler Diagnosebericht enthaelt keine Spielstandinhalte',async({page},info)=>{
 await page.evaluate(()=>TPDiagnostics.record('manager',{name:'Error',message:'GEHEIM Browser-Test',stack:'GEHEIM'}));await open(page);
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Bericht speichern',exact:true}).click()]);const path=info.outputPath('diagnose.json');await download.saveAs(path);const text=await fs.readFile(path,'utf8'),data=JSON.parse(text);expect(data.format).toBe('iTamaPoke-Diagnose-1');expect(text).not.toContain('Browser-Test');expect(text).not.toContain('GEHEIM');expect(data.fehler.some(x=>x.code==='manager')).toBe(true);
});
test('Fehlgeschlagener Schreibversuch wird nicht als gespeichert bestaetigt',async({page})=>{
 const result=await page.evaluate(async()=>{await saveNow(Module);const before=TPDiagnostics.state().letzteSpeicherung;const real=openDb;try{openDb=async()=>{throw new DOMException('Synthetischer Test','QuotaExceededError');};await writeSave(new Uint8Array([0]));}finally{openDb=real;}return {before,after:TPDiagnostics.state()};});expect(result.before).not.toBeNull();expect(result.after.speicherergebnis).toBe('Fehler');expect(result.after.letzteSpeicherung).toEqual(result.before);await open(page);await expect(page.locator('.tp-diagnostics')).toContainText('Letzter erfasster Schreibversuch fehlgeschlagen');
});
