'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./story-fixtures');
const body=page=>page.locator('#tp-zapdos-page');
const tap=page=>body(page).locator('button[data-security-tap]');
const progress=page=>body(page).locator('.tp-power-progress');
async function openStory(page){
 await H.openStories(page);
 await page.locator('#tp-stories-page button[data-story="zapdos"]').click();
 await expect(body(page)).toBeVisible();
}
async function securePage(page){
 await openStory(page);
 await body(page).getByRole('button',{name:'Fortsetzen',exact:true}).click();
 await expect(tap(page)).toBeEnabled();
 await expect(progress(page)).toHaveText('0 / 10');
}
async function taps(page,count){
 for(let i=0;i<count;i++)await tap(page).click();
}
async function duel(page){
 await expect(body(page).getByRole('button',{
  name:'Prüfduell beginnen',exact:true
 })).toBeEnabled();
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(2);
}
test.beforeEach(async({page})=>{
 await H.prepare(page,F.withProgress(H.fixture(),{kanto:63,notice:1}));
});

test('Sicherung: erst zehn Tipps geben den gespeicherten Storyuebergang frei',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await securePage(page);
 expect(await page.evaluate(()=>TPZapdosUI.advance('secure'))).toBe(false);
 await taps(page,9);
 await expect(progress(page)).toHaveText('9 / 10');
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(1);
 await taps(page,1);await duel(page);
 await page.reload();await H.waitReady(page);await openStory(page);
 await duel(page);
});

test('Sicherung: Zeitablauf setzt nur den Versuch zurueck und erlaubt Neustart',async({page})=>{
 await securePage(page);
 await taps(page,3);
 await expect(progress(page)).toHaveText('3 / 10');
 await expect(progress(page)).toHaveText('0 / 10',{timeout:8000});
 await expect(body(page).locator('.tp-power-feedback'))
  .toHaveText('Zeit abgelaufen. Versuche es erneut.');
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(1);
 await expect(tap(page)).toBeEnabled();
 await taps(page,10);await duel(page);
});

test('Sicherung: fehlgeschlagene Speicherung behaelt Erfolg fuer Schreibwiederholung',async({page})=>{
 await securePage(page);
 await page.evaluate(()=>{
  window.__securityWrite=writeSave;
  writeSave=async()=>{throw Error('intentional security quota');};
 });
 await taps(page,10);
 await expect(body(page).getByText(
  'Speichern fehlgeschlagen. Bitte erneut versuchen.',{exact:true}
 )).toBeVisible();
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(1);
 await expect(progress(page)).toHaveText('10 / 10');
 await expect(tap(page)).toBeEnabled();
 await expect(tap(page)).toHaveText(
  await page.evaluate(()=>TPZapdosUI.text('retry'))
 );
 await page.evaluate(()=>{writeSave=window.__securityWrite;});
 await tap(page).click();await duel(page);
 await page.reload();await H.waitReady(page);await openStory(page);
 await duel(page);
});

test('Sicherung: Verlassen verwirft nur den unvollstaendigen Versuch',async({page})=>{
 await securePage(page);
 await taps(page,3);
 await page.evaluate(()=>TPAppMenu.show('stories'));
 await expect(page.locator('#tp-stories-page')).toBeVisible();
 await page.locator('#tp-stories-page button[data-story="zapdos"]').click();
 await expect(progress(page)).toHaveText('0 / 10');
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(1);
 await taps(page,10);await duel(page);
});

test('Sicherung: Aufgabenbeschreibung und Taste in allen vier Sprachen',async({page})=>{
 await securePage(page);
 for(const [code,word,label] of [
  [0,'diez','Asegurar la instalación'],
  [1,'ten','Secure the facility'],
  [2,'dix','Sécuriser la centrale'],
  [3,'zehnmal','Anlage sichern']
 ]){
  await page.evaluate(code=>{
   Module.ccall('tp_set_language',null,['number'],[code]);
   TPAppMenu.show('zapdos');
  },code);
  await expect(body(page).locator('.tp-power-copy>p')).toContainText(word);
  await expect(tap(page)).toHaveText(label);
  await expect(progress(page)).toHaveText('0 / 10');
 }
});

test('Sicherung: Timer laesst Schaltflaechentext und laufenden Mausdruck stabil',async({page})=>{
 await securePage(page);
 await taps(page,1);
 await expect(progress(page)).toHaveText('1 / 10');

 await page.evaluate(()=>{
  const button=document.querySelector(
   '#tp-zapdos-page button[data-security-tap]'
  );
  window.__securityTextMutations=0;
  window.__securityTextObserver=new MutationObserver(records=>{
   window.__securityTextMutations+=records.length;
  });
  window.__securityTextObserver.observe(button,{
   childList:true,characterData:true,subtree:true
  });
 });

 const box=await tap(page).boundingBox();
 expect(box).not.toBeNull();
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
 await page.mouse.down();
 try{
  await page.evaluate(()=>new Promise(resolve=>{
   requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()));
  }));
 }finally{
  await page.mouse.up();
 }

 await expect(progress(page)).toHaveText('2 / 10');
 const mutations=await page.evaluate(()=>{
  const observer=window.__securityTextObserver;
  const count=window.__securityTextMutations+
   observer.takeRecords().length;
  observer.disconnect();
  return count;
 });
 expect(mutations).toBe(0);

 await taps(page,1);
 await expect(progress(page)).toHaveText('3 / 10');
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(1);
});
