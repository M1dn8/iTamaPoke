
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers'),F=require('./story-fixtures');

async function openLeague(page){
 await H.game(page);await H.tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
 const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
 await H.tap(page,target.x+target.w/2,target.y+target.h/2);
 await page.locator('[data-activity-choice="league"]').click();
 await page.locator('[data-battle-region-toggle]').click();
 await page.locator('[data-battle-region="0"]').click();
 await page.locator('[data-activity-start="league"]').click();
 await expect(page.locator('#tp-league-page')).toBeVisible();
}

for(const width of [320,390,430]){
 test('Liga: fünf Porträts, drei feste Teamplätze je Display und keine Zahlung durch Vorschau '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page,F.withProgress(H.fixture(0),{kanto:255,johto:0}));
  await openLeague(page);
  const root=page.locator('#tp-league-page');
  await expect(root.locator('[data-league-opponent]')).toHaveCount(5);
  await expect(root.locator('.tp-league-hero')).toBeVisible();
  await expect(root.locator('[data-league-start]')).toBeEnabled();
  const before=await page.evaluate(()=>({
   model:TPCollectionModel.encode(TPCollection.read()),
   energy:TPBattleEnergy.view.energy
  }));
  await root.locator('[data-league-opponent="4"]').click();
  await root.locator('[data-league-team]').click();
  await expect(root).toHaveAttribute('data-league-view','team');
  await expect(root.locator('[data-league-member]')).toHaveCount(6);
  const columns=root.locator('.tp-league-team-list');
  await expect(columns.nth(0).locator('[data-league-member]')).toHaveCount(3);
  await expect(columns.nth(1).locator('[data-league-member]')).toHaveCount(3);
  for(let i=0;i<2;i++){
   expect(await columns.nth(i).evaluate(el=>
    el.scrollHeight<=el.clientHeight+1
   )).toBe(true);
  }
  expect(await page.evaluate(()=>({
   model:TPCollectionModel.encode(TPCollection.read()),
   energy:TPBattleEnergy.view.energy
  }))).toEqual(before);
  expect(await page.evaluate(()=>TPLeague.state.live)).toBe(0);
  await root.locator('[data-league-back]').click();
  await expect(root).toHaveAttribute('data-league-view','overview');
  await root.locator('[data-league-variants]').click();
  await root.locator('[data-league-variant="2"]').click();
  await expect(root).toHaveAttribute('data-league-view','overview');
  expect(await page.evaluate(()=>TPBattleEnergy.view.energy)).toBe(before.energy);
  await root.locator('[data-league-back]').click();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
  await expect(root).toBeHidden();
 });
}


test('Liga: Champ-Partner statt Nummer und Energiekosten im unteren Rahmen',async({page})=>{
 await H.prepare(page,F.withProgress(H.fixture(0),{kanto:255,johto:0}));
 await openLeague(page);
 const root=page.locator('#tp-league-page');
 const selector=root.locator('[data-league-variants]');
 await expect(selector.locator('canvas[data-league-companion]')).toBeVisible();
 const expected=await page.evaluate(()=>
  TPKantoLeagueData.champions[0][TPKantoLeagueData.champions[0].length-1][0]
 );
 await expect(selector.locator('canvas'))
  .toHaveAttribute('data-league-companion',String(expected));
 const before=await page.evaluate(()=>({
  model:TPCollectionModel.encode(TPCollection.read()),
  energy:TPBattleEnergy.view.energy
 }));
 await selector.click();
 await expect(root.locator('[data-league-variant]')).toHaveCount(3);
 await expect(root.locator('[data-league-variant="2"] canvas')).toBeVisible();
 await root.locator('[data-league-variant="2"]').click();
 const partner=await page.evaluate(()=>
  TPKantoLeagueData.champions[2][TPKantoLeagueData.champions[2].length-1][0]
 );
 await expect(selector.locator('canvas'))
  .toHaveAttribute('data-league-companion',String(partner));
 await expect(root.locator('.tp-league-energy')).toBeVisible();
 await expect(root.locator('.tp-league-energy')).toContainText('Kosten');
 expect(await page.evaluate(()=>({
  model:TPCollectionModel.encode(TPCollection.read()),
  energy:TPBattleEnergy.view.energy
 }))).toEqual(before);
});


test('Liga-Porträts: aktive Variante ohne Änderung von Team oder Energie',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await H.prepare(page,F.withProgress(H.fixture(0),{kanto:255,johto:0}));
 await openLeague(page);
 const root=page.locator('#tp-league-page');
 const variant=await page.evaluate(()=>TPLeague.portraitVariant);
 expect(['Original','A','B']).toContain(variant);
 const before=await page.evaluate(()=>({
  model:TPCollectionModel.encode(TPCollection.read()),
  energy:TPBattleEnergy.view.energy
 }));
 for(let i=0;i<5;i++){
  await root.locator('[data-league-opponent="'+i+'"]').click();
  await expect(root.locator('.tp-league-hero'))
   .toHaveAttribute('data-league-portrait-variant',variant);
 }
 await expect(root.locator(
  '[data-league-opponent] canvas[data-league-portrait-variant]'
 )).toHaveCount(5);
 expect(await page.evaluate(()=>({
  model:TPCollectionModel.encode(TPCollection.read()),
  energy:TPBattleEnergy.view.energy
 }))).toEqual(before);
 expect(await page.evaluate(()=>TPLeague.state.live)).toBe(0);
});
