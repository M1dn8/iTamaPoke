
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers'),HU=require('./hall-ui-helpers');
const F=require('./johto-review-fixtures');

async function backIcon(button){
 await expect(button).toBeVisible();
 await expect(button).toHaveAttribute('data-tp-nav-back','true');
 await expect(button.locator('.tp-nav-back-icon svg')).toBeVisible();
 const box=await button.boundingBox();
 expect(box.width).toBeGreaterThanOrEqual(44);
 expect(box.height).toBeGreaterThanOrEqual(44);
}
for(const language of [3,1,0,2]){
 test('Gemeinsamer Rückpfeil: Menü, Zentrale und Werkzeuge '+language,
 async({page})=>{
  await H.prepare(page);await H.game(page);
  await page.evaluate(()=>TPCollectionGame.ensureCurrent());
  await page.evaluate(index=>{
   Module.ccall('tp_set_language',null,['number'],[index]);TPText.refresh();
  },language);
  const identity=()=>page.evaluate(()=>({
   dex:fns.speciesId(),active:TPCollection.read().active,
   team:TPCollection.read().team,count:TPCollection.read().mons.length
  }));
  const before=await identity();
  await H.openMenu(page);
  await backIcon(page.locator('#tp-app-page .tp-app-home'));
  await H.openHub(page);
  await backIcon(page.locator('#tp-app-page .tp-app-head button'));

  await H.openJournal(page);
  await backIcon(page.locator('#tp-app-page .tp-app-head button'));
  await H.backToHub(page);
  await H.openStories(page);
  await backIcon(page.locator('#tp-app-page .tp-app-head button'));
  await H.backToHub(page);

  await H.openSpeciesSearch(page);
  await backIcon(H.modal(page).locator('.tp-modal-head button'));
  await H.closeHubModal(page);
  await H.openEggPlanning(page);
  await backIcon(H.modal(page).locator('.tp-modal-head button'));
  await H.closeHubModal(page);
  await H.openEvolution(page);
  await backIcon(H.modal(page).locator('.tp-modal-head button'));
  await H.closeHubModal(page);

  await page.locator('#tp-app-page').getByRole('button',{
   name:await H.uiText(page,'navigation.collection'),exact:true
  }).click();
  const boxes=page.locator('#tp-box-page');
  await expect(boxes).toBeVisible();
  await backIcon(boxes.locator('.tp-box-head button'));
  await boxes.locator('.tp-box-head button').click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
  await H.game(page);
  expect(await identity()).toEqual(before);
 });
}
test('Gemeinsamer Rückpfeil: Liga-Rückweg und unveränderte Ruhmeshalle',
async({page})=>{
 await H.prepare(page,F.createCases()[0].raw);
 await HU.open(page,0);
 const hall=page.locator('#tp-hall-page');
 await expect(hall.locator('[data-tp-nav-back]')).toHaveCount(0);
 await expect(hall.locator('[data-hall-back-icon="curved-left"]')).toBeVisible();
 await HU.back(page);
 const league=page.locator('#tp-league-page [data-league-back]');
 await backIcon(league);await league.click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
 const activity=page.locator('#tp-activity-page .tp-activity-head button');
 await backIcon(activity);await activity.click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
});
