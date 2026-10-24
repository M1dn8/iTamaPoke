const {test,expect}=require('@playwright/test');const H=require('./helpers');
test.beforeEach(async({page})=>{await H.prepare(page);});
async function look(locator){return locator.evaluate(n=>{const s=getComputedStyle(n);return {font:s.fontFamily,color:s.color,bg:s.backgroundColor,border:s.borderTopColor,width:s.borderTopWidth,height:n.getBoundingClientRect().height};});}
async function original(page){return page.evaluate(()=>({bg:UI.bgDay.replaceAll(',',', '),ink:UI.ink.replaceAll(',',', '),track:UI.track.replaceAll(',',', ')}));}
async function matches(locator,palette,background){const s=await look(locator);expect(s.font).toContain('monospace');expect(s.color).toBe(palette.ink);if(background)expect(s.bg).toBe(background);}
async function fits(locator){expect(await locator.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);}
test('Retro: Menue, Fokus, gesperrter und gedrueckter Button folgen dem Spiel',async({page})=>{
 await H.openMenu(page);const palette=await original(page),root=page.locator('#tp-app-page');await matches(root,palette,palette.bg);
 const button=root.getByRole('button',{name:'Entwicklung',exact:true});const s=await look(button);expect(s.border).toBe(palette.ink);const stroke=await button.evaluate(()=>{
 const shell=document.getElementById('tp-game-shell'),canvas=document.getElementById('tp');
 const expected=2*canvas.getBoundingClientRect().width/466;
 const declared=parseFloat(getComputedStyle(shell).getPropertyValue('--tp-canvas-stroke'));
 // Ask this browser to snap the expected Canvas-scaled stroke at its actual DPR.
 const probe=document.createElement('span');probe.style.cssText='position:fixed;visibility:hidden;pointer-events:none;border:'+expected+'px solid transparent';
 document.body.appendChild(probe);const snapped=getComputedStyle(probe).borderTopWidth;probe.remove();
 return {expected,declared,snapped};
 });
 expect(Math.abs(stroke.declared-stroke.expected)).toBeLessThan(.01);
 expect(s.width).toBe(stroke.snapped);expect(parseFloat(s.width)).toBeGreaterThan(0);expect(s.height).toBeGreaterThanOrEqual(44);
 // Test the app's explicit focus wrapping, not mobile WebKit's native Tab order.
 const first=root.getByRole('button',{name:'Tagebuch',exact:true});
 const last=root.getByRole('button',{name:'Zurück zum Pokémon',exact:true});
 await first.focus();await first.press('Shift+Tab');await expect(last).toBeFocused();
 await last.press('Tab');await expect(first).toBeFocused();
 await expect.poll(()=>first.evaluate(n=>getComputedStyle(n).outlineStyle)).toBe('solid');
 await button.focus();await expect(button).toBeFocused();
 await button.evaluate(n=>n.disabled=true);await expect(button).toHaveCSS('opacity','0.55');await button.evaluate(n=>n.disabled=false);
 // A style-only fixture keeps the held-button check separate from navigation.
 await root.evaluate(n=>{const b=document.createElement('button');b.type='button';b.textContent='Retro-Pruefbutton';b.dataset.retroPress='true';n.appendChild(b);});
 const probe=root.locator('button[data-retro-press]');
 await probe.hover();await page.mouse.down();
 try{await expect(probe).toHaveCSS('background-color',palette.track);}finally{await page.mouse.up();await probe.evaluate(n=>n.remove());}
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.tp-tools button')).some(b=>b.textContent.trim()==='Entwicklung'&&!b.disabled));
 await button.click();
 const panel=H.modal(page).locator('.tp-panel');await expect(panel).toBeVisible();await matches(panel,palette,palette.bg);await fits(panel);
});
test('Retro: Quellen, Dateiverwaltung, Checkbox und Fortschritt bei schmaler Breite',async({page})=>{
 await page.setViewportSize({width:320,height:568});await H.openMenu(page);const palette=await original(page);
 await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await fits(page.locator('#tp-app-page'));
 await page.getByRole('button',{name:'Quellen & Nutzungsrechte',exact:true}).click();await expect(page.locator('.tp-rights-card').first()).toBeVisible();await matches(page.locator('.tp-rights-scroll'),palette);await fits(page.locator('#tp-app-page'));
 await page.getByRole('button',{name:'Zurück',exact:true}).click();await page.getByRole('button',{name:'Dateien verwalten',exact:true}).click();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.tp-tools button')).some(b=>b.textContent.trim()==='Dateien'&&!b.disabled));
 await page.getByRole('button',{name:'Dateibestand prüfen',exact:true}).click();const panel=H.modal(page).locator('.tp-panel');await expect(panel).toBeVisible();await matches(panel,palette,palette.bg);
 const checkbox=panel.locator('input[type=checkbox]');await expect(checkbox).toBeChecked();await checkbox.uncheck();await expect(checkbox).not.toBeChecked();await checkbox.check();await expect(checkbox).toHaveCSS('appearance','none');await expect(checkbox).toHaveCSS('border-top-color',palette.ink);
 // Test-only progress node: no imported assets and no storage writes.
 await panel.evaluate(n=>{const p=document.createElement('progress');p.max=10;p.value=4;p.dataset.retroTest='true';n.appendChild(p);});
 await expect(panel.locator('progress[data-retro-test]')).toHaveCSS('border-top-color',palette.ink);await fits(panel);
});
test('Retro: Boxen und Eingaben behalten Darstellung, Scrollen und Rueckweg',async({page})=>{
 await H.game(page);const palette=await original(page),a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 for(let i=0;i<3;i++)await H.tap(page,350,382);await H.tap(page,233,354);const root=page.locator('#tp-box-page');await expect(root).toBeVisible();await matches(root,palette,palette.bg);
 await matches(root.getByLabel('Boxauswahl'),palette,'rgb(255, 255, 255)');await page.setViewportSize({width:320,height:568});await fits(root);await fits(root.locator('.tp-box-scroll'));
 await root.getByRole('button',{name:'Box umbenennen',exact:true}).click();await matches(root.getByLabel('Boxname'),palette,'rgb(255, 255, 255)');await root.getByRole('button',{name:'Abbrechen',exact:true}).click();
 await root.getByRole('button',{name:'Zurueck',exact:true}).click();await expect(root).toBeHidden();expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(1);
});
