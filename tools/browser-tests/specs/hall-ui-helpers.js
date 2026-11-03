
'use strict';
const {expect}=require('@playwright/test');
const H=require('./helpers');
async function press(page,selector){
 const root=page.locator('#tp-hall-page');
 await expect(root).toBeVisible();
 const button=root.locator(selector);
 await expect(button).toBeVisible();await expect(button).toBeEnabled();
 await button.click();
}
const back=page=>press(page,'[data-hall-back]');
const egg=page=>press(page,'[data-hall-egg]');
const acknowledge=page=>press(page,'[data-hall-acknowledge]');
async function ceremony(page){
 const ack=page.locator('#tp-hall-page [data-hall-acknowledge]');
 if(await ack.isVisible())await acknowledge(page);
 else await press(page,'[data-hall-celebrate]');
}
async function open(page,region=0){
 await H.game(page);await H.tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
 const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
 await H.tap(page,target.x+target.w/2,target.y+target.h/2);
 await page.locator('[data-activity-choice="league"]').click();
 await page.locator('[data-battle-region-toggle]').click();
 await page.locator('[data-battle-region="'+region+'"]').click();
 await page.locator('[data-activity-start="league"]').click();
 await page.locator('#tp-league-page [data-league-hall]').click();
 await expect.poll(()=>page.evaluate(()=>TPHall.active)).toBe(true);
 await expect(page.locator('#tp-hall-page')).toBeVisible();
}
module.exports={open,back,egg,acknowledge,ceremony};
