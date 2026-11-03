
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

for(const width of [320,390,430]){
 test('UI01 Boxen: Teamstart, Auswahl links und freie Plätze bei '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page);await H.game(page);
  await page.evaluate(async()=>{
   await TPCollectionGame.ensureCurrent();
   for(let i=0;i<3;i++)await TPCollection.apply('catchWild',{
    dex:1,level:17+i,nickname:'Blatt '+(i+1),shiny:false,origin:'wild',
    data:{stats:{atk:42+i,def:31+i,spe:60+i},genes:null,training:null}
   },0);
  });
  const initial=await page.evaluate(()=>({
   active:TPCollection.read().active,count:TPCollection.read().mons.length,
   team:TPCollection.read().team
  }));
  await H.openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{name:'Boxen',exact:true}).click();
  const root=page.locator('#tp-box-page');
  await expect(root.getByRole('button',{name:/^Teamplanung /}))
   .toHaveAttribute('aria-pressed','true');
  await expect(root.locator('.tp-box-column-right .tp-box-grid')).toBeVisible();
  await expect(root.locator('.tp-box-column-left .tp-box-battle-card')).toBeVisible();
  await expect(root.locator('[data-stat]')).toHaveCount(3);
  await root.locator('.tp-box-column-right .tp-box-empty').first().click();
  await expect(root.locator('.tp-box-column-right .tp-box-grid')).toBeVisible();
  await expect(root.locator('.tp-box-tile')).toHaveCount(3);
  const tile=root.locator('.tp-box-column-right .tp-box-tile:visible').first();
  const chosen=Number(await tile.getAttribute('data-mon-id'));
  await expect(tile.locator('.tp-box-tile-name')).toBeVisible();
  await tile.click();
  expect(await page.evaluate(()=>TPCollection.read().team)).toEqual(initial.team);
  const expected=await page.evaluate(
   id=>TPCollection.read().mons.find(m=>m.id===id).data.stats,chosen
  );
  for(const [key,value]of Object.entries(expected))
   await expect(root.locator('[data-stat="'+key+'"]'))
    .toHaveAttribute('data-stat-value',String(value));
  await root.getByRole('button',{name:'Ins Team',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>TPCollection.read().team.includes(
   Number(document.querySelector(
    '#tp-box-page [data-team-id][aria-pressed="true"]'
   )?.getAttribute('data-team-id'))
  ))).toBe(true);
  expect(await page.evaluate(()=>TPCollection.read().team))
   .toEqual([...initial.team,chosen]);
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,count:TPCollection.read().mons.length
  }))).toEqual({active:initial.active,count:initial.count});
  await expect(root.getByRole('button',{name:/^Teamplanung /}))
   .toHaveAttribute('aria-pressed','true');
  await root.locator(
   '.tp-box-column-right button[data-team-id="'+initial.active+'"]'
  ).click();
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(initial.active);
 });
}
