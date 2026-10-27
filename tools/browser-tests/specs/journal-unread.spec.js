'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const J=require('./journal-fixtures');
const panel=page=>page.locator('#tp-app-page');
const badge=page=>panel(page).locator(
 'button[data-hub="journal"] .tp-hub-count'
);
async function journal(page){await H.openJournal(page);}
async function back(page){await H.backToHub(page);}

test('Tagebuchzaehler: Lesen bestaetigt sieben Eintraege dauerhaft',async({page})=>{
 await H.prepare(page,J.withUnread(H.fixture(),7));
 await H.openHub(page);await expect(badge(page)).toHaveText('7');
 await journal(page);
 await expect(panel(page).locator(
  'article[data-journal-new="true"] .tp-unread-dot'
 )).toHaveCount(7);
 await expect.poll(()=>page.evaluate(()=>TPJournalUnread.read().unread)).toBe(0);
 await back(page);await expect(badge(page)).toHaveCount(0);
 await journal(page);
 await expect(panel(page).locator(
  'article .tp-unread-dot'
 )).toHaveCount(0);
 await back(page);
 await page.reload();await H.waitReady(page);await H.openHub(page);
 await expect(badge(page)).toHaveCount(0);
 expect(await page.evaluate(()=>TPJournalUnread.read().unread)).toBe(0);
});

test('Tagebuchzaehler: Schreibfehler behaelt neue Eintraege und erlaubt Wiederholung',async({page})=>{
 await H.prepare(page,J.withUnread(H.fixture(),3));
 await H.openHub(page);await expect(badge(page)).toHaveText('3');
 await page.evaluate(()=>{
  window.__journalWrite=writeSave;
  writeSave=async()=>{throw Error('Journal read quota fixture');};
 });
 await journal(page);
 await expect(panel(page).locator('.tp-app-notice'))
  .toContainText('Lesestand konnte nicht gespeichert werden');
 expect(await page.evaluate(()=>TPJournalUnread.read().unread)).toBe(3);
 await expect(panel(page).locator(
  'article[data-journal-new="true"] .tp-unread-dot'
 )).toHaveCount(3);
 expect(await page.evaluate(()=>TPCollection.busy||tpSaveReplacing)).toBe(false);
 await page.evaluate(()=>{writeSave=window.__journalWrite;});
 await back(page);await expect(badge(page)).toHaveText('3');
 await journal(page);
 await expect.poll(()=>page.evaluate(()=>TPJournalUnread.read().unread)).toBe(0);
 await back(page);await expect(badge(page)).toHaveCount(0);
});

test('Tagebuchzaehler: echte neue Spielereignisse zaehlen bei voller 200er-Liste',async({page})=>{
 await H.prepare(page,J.withUnread(H.fixture(200),0));
 await H.game(page);
 const before=await page.evaluate(()=>TPJournalUnread.read().total);
 await H.tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('gamemenu');
 await H.tap(page,233,355);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('game');

 const correct=await page.evaluate(()=>TypeGame.correct);
 await H.tap(page,200,234+correct*60);
 await page.waitForFunction(()=>TypeGame.feedbackUntil===0);
 for(let i=0;i<3;i++){
  const wrong=await page.evaluate(()=>(TypeGame.correct+1)%3);
  await H.tap(page,200,234+wrong*60);
  if(i<2)await page.waitForFunction(()=>TypeGame.feedbackUntil===0);
 }
 await page.waitForFunction(()=>screen==='idle');
 await H.openHub(page);
 const current=await page.evaluate(()=>TPJournalUnread.read());
 expect(current.total).toBeGreaterThan(before);
 expect(current.unread).toBeGreaterThan(0);
 expect(await page.evaluate(()=>JSON.parse(
  Module.ccall('tp_journal_json','string',[],[])
 ).length)).toBe(200);
 await expect(badge(page)).toHaveText(String(current.unread));
 await journal(page);
 await expect.poll(()=>page.evaluate(()=>TPJournalUnread.read().unread)).toBe(0);
 await page.reload();await H.waitReady(page);await H.openHub(page);
 await expect(badge(page)).toHaveCount(0);
});

test('Tagebuchzaehler: alter Bestand wird nicht als neue Meldung aufgezaehlt',async({page})=>{
 await H.prepare(page);
 await H.openHub(page);
 expect(await page.evaluate(()=>TPJournalUnread.read().unread)).toBe(0);
 await expect(badge(page)).toHaveCount(0);
 await journal(page);
 await expect.poll(()=>page.evaluate(()=>TPJournalUnread.read().initialized))
  .toBe(true);
 await back(page);await expect(badge(page)).toHaveCount(0);
});
