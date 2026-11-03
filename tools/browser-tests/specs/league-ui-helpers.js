
'use strict';
const {expect}=require('@playwright/test');
async function press(page,selector){
 const root=page.locator('#tp-league-page');
 await expect(root).toBeVisible();
 const button=root.locator(selector);
 await expect(button).toBeVisible();
 if(await button.isDisabled()){
  await expect(button).toBeDisabled();return false;
 }
 await button.click();return true;
}
const start=page=>press(page,'[data-league-start]');
const resume=page=>press(page,'[data-league-resume]');
const hall=page=>press(page,'[data-league-hall]');
const back=page=>press(page,'[data-league-back]');
async function variant(page,index){
 await press(page,'[data-league-variants]');
 await press(page,'[data-league-variant="'+index+'"]');
}
module.exports={start,resume,hall,back,variant};


// UI01 closeout: wait for the visible resume control; never retry a click.
async function resumeVisibleLeague(page){
 const saved=page.locator('#tp-battle-page [data-league-resume]');
 const overview=page.locator('#tp-league-page [data-league-resume]');
 let selected=null;
 await expect.poll(async()=>{
  if(await saved.isVisible()){selected=saved;return true;}
  if(await overview.isVisible()){selected=overview;return true;}
  return false;
 }).toBe(true);
 await expect(selected).toBeVisible();
 if(await selected.isDisabled()){
  await expect(selected).toBeDisabled();
  return false;
 }
 await selected.click();
 return true;
}
module.exports={...module.exports,resume:resumeVisibleLeague};
