const {test,expect}=require('@playwright/test');
const H=require('./helpers');
async function open(page){
 await H.openMenu(page);
 const root=page.locator('#tp-app-page');
 await root.locator('[data-admin-action="settings"]').click();
 await root.locator('.tp-app-rights-link').click();
 await expect(root).toHaveClass(/tp-admin-rights/);
 await expect(root.getByRole('heading',{
  name:'Quellen & Nutzungsrechte',exact:true
 })).toBeVisible();
 await expect(root.locator('.tp-rights-device')).toHaveAttribute('data-rights-ready','true');
 return root;
}
const identity=page=>page.evaluate(()=>({
 active:TPCollection.read().active,ids:TPCollection.read().mons.map(mon=>mon.id),
 records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()]
}));
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Quellen: vier Bereiche, sichere Einträge und gemeinsamer Rückweg '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const before=await identity(page),root=await open(page);
  await expect(root.locator('.tp-pokedex-display')).toHaveCount(2);
  await expect(root.locator('[data-rights-category]')).toHaveCount(4);
  const names=await page.evaluate(()=>TPRightsData.entries.map(entry=>entry.name));
  for(let index=0;index<names.length;index++){
   const visible=root.locator('[data-rights-entry]:visible');
   await expect(visible).toHaveCount(1);
   await expect(visible.locator('h3')).toHaveText(names[index]);
   if(index<names.length-1)await root.locator('[data-rights-next]').click();
  }
  for(const category of ['trainers','licenses','notes']){
   await root.locator('[data-rights-category="'+category+'"]').click();
   await expect(root.locator('.tp-rights-device')).toHaveAttribute('data-rights-view',category);
   await expect(root.locator('[data-rights-entry]:visible')).toHaveCount(1);
  }
  await root.locator('.tp-app-head button').click();
  await expect(root).toHaveClass(/tp-admin-settings/);
  expect(await identity(page)).toEqual(before);
 });
}
test('Quellen: vollständige Lizenztexte und keine automatischen externen Abrufe',async({page})=>{
 const outbound=[];
 const origin=new URL(page.url()).origin;
 page.on('request',request=>{
  if(/^https?:/.test(request.url())&&new URL(request.url()).origin!==origin)
   outbound.push(request.url());
 });
 const root=await open(page);
 await root.locator('[data-rights-category="licenses"]').click();
 const count=await page.evaluate(()=>TPRightsData.licenses.length);
 for(let index=0;index<count;index++){
  const expected=await page.evaluate(index=>TPRightsData.licenses[index].text,index);
  const card=root.locator('[data-rights-entry]:visible');
  expect(await card.locator('[data-rights-original]').textContent()).toBe(expected);
  if(await page.evaluate(()=>TPText.language()==='de')){
   await expect(card.locator('[data-rights-translation="de"]')).toBeVisible();
   expect((await card.locator('[data-rights-translation="de"]').textContent()).length).toBeGreaterThan(5000);
   await expect(card.locator('[data-rights-original]')).toBeHidden();
   await card.locator('summary').click();
   await expect(card.locator('[data-rights-original]')).toBeVisible();
   expect(await card.locator('[data-rights-original]').textContent()).toBe(expected);
  }
  if(index<count-1)await root.locator('[data-rights-next]').click();
 }
 const urls=await root.locator('a').evaluateAll(nodes=>nodes.map(node=>({
  href:node.href,target:node.target,rel:node.rel
 })));
 for(const link of urls){
  expect(/^https?:/.test(link.href)).toBe(true);
  expect(link.target).toBe('_blank');
  expect(link.rel).toContain('noopener');
 }
 expect(outbound).toEqual([]);
});
