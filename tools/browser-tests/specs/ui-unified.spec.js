const {test,expect}=require('@playwright/test');const H=require('./helpers');
async function card(page){const a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');}
async function sameFrame(page,locator){const a=await locator.boundingBox(),b=await page.locator('#tp').boundingBox();expect(a).not.toBe(null);expect(Math.abs(a.width-b.width)).toBeLessThan(1);expect(Math.abs(a.height-b.height)).toBeLessThan(1);expect(Math.abs(a.x-b.x)).toBeLessThan(1);expect(Math.abs(a.y-b.y)).toBeLessThan(1);expect(await locator.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);}
for(const width of [320,390])test('Design: gleicher Massstab, acht Karten und Pflege-Dialog bei '+width+' Pixeln',async({page},info)=>{
 await page.setViewportSize({width,height:844});await H.prepare(page);await page.waitForFunction(()=>!!window.TPUIScale);await H.openMenu(page);
 await expect.poll(()=>page.evaluate(()=>Math.abs(TPUIScale.scale-document.getElementById('tp').getBoundingClientRect().width/466))).toBeLessThan(.001);
 const root=page.locator('#tp-app-page');await sameFrame(page,root);const heading=root.locator('.tp-app-head h2');await expect.poll(()=>heading.evaluate(n=>Math.abs(parseFloat(getComputedStyle(n).fontSize)-20*TPUIScale.scale))).toBeLessThan(.05);expect(await heading.evaluate(n=>getComputedStyle(n).fontFamily)).toContain('monospace');
 const button=root.getByRole('button',{name:'Sicherungen',exact:true});expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
 const headingPixels=await heading.evaluate(n=>parseFloat(getComputedStyle(n).fontSize));await page.locator('#tp-game-shell').screenshot({path:info.outputPath('menue-'+width+'.png')});
 await H.game(page);await page.evaluate(()=>{window.__unifiedCardPaint=[];const paint=ctx.fillText;ctx.fillText=function(value,...args){window.__unifiedCardPaint.push({text:String(value),font:this.font,x:args[0],y:args[1]});return paint.call(this,value,...args);};const draw=drawCard;drawCard=function(...args){window.__unifiedCardPaint=[];window.__unifiedCardPage=cardPage;return draw(...args);};});
 await card(page);
 for(let i=0;i<8;i++){
  await expect.poll(()=>page.evaluate(()=>cardPage)).toBe(i);await expect.poll(()=>page.evaluate(()=>window.__unifiedCardPage)).toBe(i);await expect.poll(()=>page.evaluate(()=>window.__unifiedCardPaint.some(p=>p.y===400&&p.text===fns.backHint()))).toBe(true);
  expect(await page.evaluate(()=>window.__unifiedCardPaint.every(p=>p.font.includes('monospace')))).toBe(true);
  if(i===4){const size=await page.evaluate(()=>{const p=window.__unifiedCardPaint.find(p=>p.text===fns.statsBattleTitle()&&p.y===54);return p?parseFloat(p.font.match(/([\d.]+)px/)[1])*document.getElementById('tp').getBoundingClientRect().width/466:0;});expect(Math.abs(size-headingPixels)).toBeLessThan(.5);await page.locator('#tp-game-shell').screenshot({path:info.outputPath('kampfkarte-'+width+'.png')});}
  if(i<7)await H.tap(page,350,382);
 }
 await H.tap(page,233,406);await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');const before=await page.evaluate(()=>({active:TPCollection.read().active,count:TPCollection.read().mons.length,dex:fns.speciesId()}));
 await page.evaluate(()=>TPCollectionGame.openEnd('release'));const dialog=page.getByRole('dialog',{name:'Pflege beenden',exact:true});await expect(dialog).toBeVisible();await sameFrame(page,dialog);expect(await dialog.evaluate(n=>getComputedStyle(n).fontFamily)).toContain('monospace');await expect(dialog).toHaveCSS('background-color','rgb(247, 239, 230)');await dialog.getByRole('button',{name:'Abbrechen',exact:true}).click();await expect(dialog).not.toBeVisible();expect(await page.evaluate(()=>({active:TPCollection.read().active,count:TPCollection.read().mons.length,dex:fns.speciesId()}))).toEqual(before);
});
