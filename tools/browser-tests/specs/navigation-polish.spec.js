const {test,expect}=require('@playwright/test');const H=require('./helpers');
test.beforeEach(async({page})=>{await H.prepare(page);});
test('UI: Quellenzugang ohne Scrollen sichtbar, Quelle oeffnet und Zurueck fuehrt zu Einstellungen',async({page})=>{
 await H.openMenu(page);await page.getByRole('button',{name:'Einstellungen',exact:true}).click();
 const link=page.getByRole('button',{name:'Quellen & Nutzungsrechte',exact:true});await expect(link).toBeVisible();
 const info=await link.evaluate(n=>{const root=document.getElementById('tp-app-page'),a=root.getBoundingClientRect(),b=n.getBoundingClientRect();return {direct:n.parentElement===root,top:b.top-a.top,bottom:b.bottom-a.top,height:a.height,scroll:root.querySelector('.tp-app-actions').scrollTop};});
 expect(info.direct).toBe(true);expect(info.top).toBeGreaterThanOrEqual(0);expect(info.bottom).toBeLessThanOrEqual(info.height);expect(info.scroll).toBe(0);
 await link.click();await expect(page.getByRole('heading',{name:'Quellen & Nutzungsrechte',exact:true})).toBeVisible();await page.getByRole('button',{name:'Zurück',exact:true}).click();await expect(page.getByRole('heading',{name:'Einstellungen',exact:true})).toBeVisible();await expect(link).toBeVisible();
});
test('UI: Arena-Detail ohne Importknopf und ohne alte Datei-Tippflaeche; Rueckweg bleibt',async({page})=>{
 await H.game(page);const a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');for(let i=0;i<4;i++)await H.tap(page,350,382);await expect.poll(()=>page.evaluate(()=>cardPage)).toBe(4);
 await page.evaluate(()=>{window.__uiArenaText=[];const real=ctx.fillText;ctx.fillText=function(value,...args){window.__uiArenaText.push(String(value));if(window.__uiArenaText.length>500)window.__uiArenaText.shift();return real.call(this,value,...args);};});
 await H.tap(page,363,308);await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');await H.tap(page,130,134);await expect.poll(()=>page.evaluate(()=>window.__uiArenaText.includes('Arena herausfordern'))).toBe(true);
 expect(await page.evaluate(()=>window.__uiArenaText.some(s=>s.includes('Grafiken laden')||s.includes('laden (PNG)')))).toBe(false);
 let choosers=0;page.on('filechooser',()=>{choosers++;});await H.tap(page,233,396);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));expect(choosers).toBe(0);expect(await page.evaluate(()=>screen)).toBe('arena');
 await H.tap(page,233,435);await expect.poll(()=>page.evaluate(()=>document.getElementById('status').textContent)).toBe('Arena · Kanto-Auswahl');
});
