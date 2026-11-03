
'use strict';
const {expect}=require('@playwright/test');

async function option(page,id){
 const root=page.locator('#tp-arena-page');
 await expect(root).toBeVisible();
 const target=root.locator('[data-arena-option="'+id+'"]');
 await expect(target).toBeVisible();
 await target.click();
}
async function details(page,index){
 const root=page.locator('#tp-arena-page');
 await expect(root).toBeVisible();
 const target=root.locator('[data-arena-leader="'+index+'"]');
 if(!await target.isVisible())
  await root.locator('[data-arena-region-toggle]').click();
 await target.click();
 await root.locator('[data-arena-open]').click();
 await expect(root).toHaveAttribute('data-arena-view','detail');
}
async function leave(page){
 const root=page.locator('#tp-arena-page');
 await expect(root).toBeVisible();
 await root.locator('[data-arena-exit]').click();
}
async function region(page,id){
 const root=page.locator('#tp-arena-page');
 await expect(root).toBeVisible();
 await root.locator('[data-arena-region="'+id+'"]').click();
}
async function challenge(page){
 const root=page.locator('#tp-arena-page');
 await expect(root).toHaveAttribute('data-arena-view','detail');
 const button=root.locator('[data-arena-challenge]');
 await expect(button).toBeVisible();
 if(await button.isDisabled()){
  await expect(button).toBeDisabled();
  return false;
 }
 await button.click();
 return true;
}
module.exports={option,details,leave,region,challenge};
