'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./story-fixtures');
const body=page=>page.locator('#tp-zapdos-page');
async function openStory(page){
 await H.openStories(page);
 await page.locator('#tp-stories-page button[data-story="zapdos"]').click();
 await expect(body(page)).toBeVisible();
}
test.beforeEach(async({page})=>{
 await H.prepare(page,F.withProgress(H.fixture(),{kanto:63,notice:1}));
});
for(const width of [320,390])
 test('Kraftwerk: Aussen-/Innenansicht und zentrierte Vorbereitung bei '+width,async({page},info)=>{
  await page.setViewportSize({width,height:568});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await openStory(page);
  await expect(body(page).locator('.tp-power-scene[data-scene="outside"] svg'))
   .toBeVisible();
  await expect(body(page).locator('.tp-power-copy h3'))
   .toHaveCSS('text-align','center');
  await expect(body(page).locator('.tp-power-copy > p'))
   .toHaveCSS('text-align','center');
  await expect(body(page).locator('.tp-power-flicker').first())
   .toHaveCSS('animation-name','tp-power-flicker');
  await expect(body(page).locator('.tp-power-flicker').first())
   .toHaveCSS('animation-duration','2.4s');
  await expect(body(page).locator('.tp-power-flicker').first())
   .toHaveAttribute('fill','#ffe784');
  await page.locator('#tp-game-shell').screenshot({
   path:info.outputPath('kraftwerk-aussen-'+width+'.png')
  });
  await body(page).getByRole('button',{name:'Fortsetzen',exact:true}).click();
  await expect(body(page).locator('.tp-power-scene[data-scene="inside"] svg'))
   .toBeVisible();
  await expect(body(page).getByRole('heading',{
   name:'Sichere die Anlage',exact:true
  })).toBeVisible();
  await expect(body(page).locator('.tp-power-copy > p'))
   .toContainText('Sichere die Anlage');
  expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(1);
  await page.locator('#tp-game-shell').screenshot({
   path:info.outputPath('kraftwerk-innen-'+width+'.png')
  });
  await page.reload();await H.waitReady(page);await openStory(page);
  await expect(body(page).locator('.tp-power-scene[data-scene="inside"]'))
   .toBeVisible();
  expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(1);
 });

test('Kraftwerk: reduzierte Bewegung schaltet Lichtanimation aus',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await openStory(page);
 await expect(body(page).locator('.tp-power-flicker').first())
  .toHaveCSS('animation-name','none');
 await expect(body(page).getByRole('button',{
  name:'Fortsetzen',exact:true
 })).toBeEnabled();
});
