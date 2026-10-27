const {test,expect}=require('@playwright/test');
const H=require('./helpers');
test.use({serviceWorkers:'allow'});
test('Chromium: warmer Offlinecache startet ohne Netzwerk',async({page,context,browserName})=>{
 test.skip(browserName!=='chromium','Offlinecache zunaechst in Chromium; WebKit-Navigation wird separat getestet.');
 await H.prepare(page);await page.waitForFunction(()=>navigator.serviceWorker&&navigator.serviceWorker.controller);await page.evaluate(()=>navigator.serviceWorker.ready);
 await context.setOffline(true);await page.reload();await H.waitReady(page);await H.openMenu(page);await expect(page.getByRole('button',{name:'Sicherungen',exact:true})).toBeVisible();await H.openHub(page);await expect(page.getByRole('button',{name:'Tagebuch',exact:true})).toBeVisible();
 const diagnostic=await page.evaluate(()=>TPDiagnostics.check());expect(diagnostic.pruefung.offline.status).toBe('Vollständig');
});
