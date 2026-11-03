
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

for(const width of [320,390,430]){
 test('UI01 Boxdetails: linke Aktionen und spielinterne Zielbox bei '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await H.game(page);
  const initial=await page.evaluate(async()=>{
   await TPCollectionGame.ensureCurrent();
   await TPCollection.apply('catchWild',{
    dex:25,level:17,nickname:'Testexemplar',shiny:false,origin:'wild',
    data:{stats:{atk:42,def:31,spe:60},bond:24,careMistakes:3,
     genes:null,training:null}
   },0);
   return {id:TPCollection.read().nextId-1,
    active:TPCollection.read().active,count:TPCollection.read().mons.length};
  });
  await H.openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{name:'Boxen',exact:true}).click();
  const root=page.locator('#tp-box-page');
  await root.getByRole('button',{name:'Boxen',exact:true}).click();
  await root.locator('[data-mon-id="'+initial.id+'"]').click();
  await root.getByRole('button',{name:'Verwalten',exact:true}).click();
  await root.getByRole('button',{name:'Details',exact:true}).click();
  const left=root.locator('.tp-box-column-left');
  const plus=left.getByRole('button',{name:'Ins Team',exact:true});
  const back=left.getByRole('button',{name:'Zurück zur Verwaltung',exact:true});
  await expect(plus).toBeVisible();await expect(back).toBeVisible();
  const bounds=await left.boundingBox();
  expect(bounds).toBeTruthy();
  for(const control of [plus,back]){
   const box=await control.boundingBox();
   expect(box).toBeTruthy();
   expect(box.width).toBeGreaterThanOrEqual(44);
   expect(box.height).toBeGreaterThanOrEqual(44);
   expect(box.x).toBeGreaterThanOrEqual(bounds.x-1);
   expect(box.y).toBeGreaterThanOrEqual(bounds.y-1);
   expect(box.x+box.width).toBeLessThanOrEqual(bounds.x+bounds.width+1);
   expect(box.y+box.height).toBeLessThanOrEqual(bounds.y+bounds.height+1);
  }
  await plus.click();
  await expect.poll(()=>page.evaluate(
   id=>TPCollection.read().team.includes(id),initial.id
  )).toBe(true);
  await back.click();
  await root.getByRole('button',{name:'Namen ändern',exact:true}).click();
  const editor=root.locator('.tp-box-editor');
  await expect(editor.locator('p')).toHaveCount(0);
  await root.getByLabel('Spitzname',{exact:true}).fill('Neuer Name');
  await root.getByRole('button',{name:'Speichern',exact:true}).click();
  await expect.poll(()=>page.evaluate(
   id=>TPCollection.read().mons.find(m=>m.id===id)?.nickname,initial.id
  )).toBe('Neuer Name');
  await root.getByRole('button',{name:'In andere Box verschieben',exact:true}).click();
  await expect(root.locator('select')).toHaveCount(0);
  await expect(root.locator('[data-target-box]')).toHaveCount(10);
  await root.locator('[data-target-box="3"]').click();
  await expect(root.locator('[data-target-box="3"]'))
   .toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(
   id=>TPCollection.read().boxes[0].slots.includes(id),initial.id
  )).toBe(true);
  await root.getByRole('button',{name:'Verschieben',exact:true}).click();
  await expect.poll(()=>page.evaluate(
   id=>TPCollection.read().boxes[3].slots.includes(id),initial.id
  )).toBe(true);
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,count:TPCollection.read().mons.length
  }))).toEqual({active:initial.active,count:initial.count});
 });
}
