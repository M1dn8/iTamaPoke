const {test,expect}=require('@playwright/test');
const H=require('./helpers');
test.beforeEach(async({page})=>{await H.prepare(page);});
test('Messwerte aus echten Vordergrund-Durchlaeufen ohne Menue-Zeichenscheinwerte',async({page})=>{
 await H.game(page);await expect.poll(()=>page.evaluate(()=>TPPerformance.snapshot().messreihen['Zeichenpfad/idle']?.fenster||0)).toBeGreaterThanOrEqual(6);
 const s=await page.evaluate(()=>TPPerformance.snapshot());expect(s.phase).toBe('D3b-Vergleichsversion');expect(s.startBisErstemDurchlaufMs).not.toBeNull();expect(s.messreihen['Nativer Takt/idle'].fenster).toBeGreaterThan(0);expect(s.messreihen['Zeichenpfad/idle'].p95Ms).toBeGreaterThanOrEqual(0);
 await H.openMenu(page);await expect.poll(()=>page.evaluate(()=>TPPerformance.snapshot().messreihen['Nativer Takt/menue']?.fenster||0)).toBeGreaterThan(1);const menu=await page.evaluate(()=>TPPerformance.snapshot());expect(menu.messreihen['Zeichenpfad/menue']).toBeUndefined();
});
test('Diagnosebericht enthaelt begrenzte lokale Leistungs- und Grafikdaten',async({page})=>{
 await page.evaluate(()=>saveNow(Module));await page.evaluate(()=>TPDiagnostics.check());const data=await page.evaluate(()=>TPDiagnostics.report());expect(data.leistung.schreibvorgaenge.bestaetigt).toBeGreaterThan(0);expect(data.leistung.messreihen['Schreiben/bestaetigt'].fenster).toBeGreaterThan(0);expect(data.leistung.messreihen['Zustands-Export'].fenster).toBeGreaterThan(0);expect(data.grafikcache.bekanntePufferBytes).toBeGreaterThanOrEqual(0);for(const row of Object.values(data.leistung.messreihen))expect(row.fenster).toBeLessThanOrEqual(180);expect(JSON.stringify(data)).not.toContain('Browser-Test');
 await H.openMenu(page);await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('button',{name:'Diagnose',exact:true}).click();await expect(page.getByRole('button',{name:'Prüfen',exact:true})).toBeEnabled();await expect(page.locator('.tp-diagnostics')).toContainText('D3b – Pokédex-Vergleich');
});
