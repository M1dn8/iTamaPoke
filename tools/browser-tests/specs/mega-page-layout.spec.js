const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const H=require('./helpers'),F=require('./mega-review-fixtures');
const T=require('../../../browser_ver/web/storage-tools.js');
const directory=process.env.TP_MEGA_REVIEW_SAVES||
 path.join(os.homedir(),'Downloads','iTamaPoke-UI01-Megareview-20261102');
for(const width of [320,390,480]){
 test('Mega-Seite: gemeinsamer Rahmen, Ring und Rückweg '+width,async({page})=>{
  const definition=F.definitions[1];
  const stored=await T.decode(fs.readFileSync(path.join(directory,definition.name+'.tpsave')));
  expect(stored.values.get('dexn').value).toBe(definition.dex);
  const decoded=await F.createFreshCase(definition);
  await page.setViewportSize({width,height:844});
  await H.prepare(page,decoded.raw,definition.dex);
  const status=await H.openStatus(page);
  const reference=await status.locator('.tp-pokedex-display').evaluateAll(nodes=>
   nodes.map(node=>{const r=node.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}));
  const before=await page.evaluate(()=>({
   active:TPCollection.read().active,ids:TPCollection.read().mons.map(mon=>mon.id),
   stone:TPMega.view(true).stone,activeMega:TPMega.view(true).active
  }));
  const profileM=await status.locator('.tp-mega-glyph svg').evaluate(
   svg=>svg.outerHTML.replaceAll('tp-profile-mega-gold','SHARED-GOLD'));
  await status.locator('[data-status-mega]').click();
  const root=page.locator('#tp-mega-page');
  await expect(root).toBeVisible();
  await expect(root.locator('.tp-pokedex-display')).toHaveCount(2);
  await expect(root.locator('[data-mega-portrait]')).toHaveAttribute('data-mega-portrait','base');
  await expect(root.locator('.tp-mega-halo svg')).toHaveCount(1);
  const pageM=await root.locator('.tp-mega-ring-emblem svg').evaluate(
   svg=>svg.outerHTML.replaceAll('tp-mega-page-gold','SHARED-GOLD'));
  expect(pageM).toBe(profileM);
  const actor=await root.locator('[data-mega-portrait]').elementHandle();
  expect(actor).not.toBeNull();
  const epoch=await page.evaluate(()=>TPMega.view(true).now);
  await expect.poll(()=>page.evaluate(()=>TPMega.view(true).now))
   .toBeGreaterThan(epoch+1);
  expect(await actor.evaluate(canvas=>canvas.isConnected&&
   canvas===document.querySelector('#tp-mega-page [data-mega-portrait]'))).toBe(true);
  await expect(root.locator('[data-mega-action="activate"]')).toBeEnabled();
  await expect(root.locator('[data-mega-time]')).toBeHidden();
  const actual=await root.locator('.tp-pokedex-display').evaluateAll(nodes=>
   nodes.map(node=>{const r=node.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}));
  for(let i=0;i<2;i++)for(const key of ['x','y','w','h']){
   expect(Math.abs(actual[i][key]-reference[i][key])).toBeLessThanOrEqual(1.5);
  }
  await expect.poll(()=>root.locator('.tp-status-scroll').evaluateAll(panes=>
   panes.length===2&&panes.every(pane=>{
    const box=pane.getBoundingClientRect();
    return pane.scrollHeight<=pane.clientHeight+1&&Array.from(pane.children)
    .filter(child=>child.getClientRects().length>0).every(child=>{
     const r=child.getBoundingClientRect();return r.top>=box.top-1&&r.bottom<=box.bottom+1;
    });
   }))).toBe(true);
  await root.locator('[data-mega-back]').click();
  await expect(root).toBeHidden();
  await expect(status).toBeVisible();
  await expect(status).toHaveAttribute('data-status-view','profile');
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,ids:TPCollection.read().mons.map(mon=>mon.id),
   stone:TPMega.view(true).stone,activeMega:TPMega.view(true).active
  }))).toEqual(before);
 });
}
