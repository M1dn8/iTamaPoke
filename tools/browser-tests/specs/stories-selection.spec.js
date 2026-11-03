'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./story-fixtures');

for(const width of [320,390,430]){
 test('UI01 Geschichten: Rahmen und schreibfreie Auswahl bei '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page,F.withProgress(H.fixture(),{kanto:63}));
  await H.openStories(page);
  const root=page.locator('#tp-app-page.tp-pokedex-stories');

  const shape=await root.evaluate(n=>{
   const shell=document.getElementById('tp-game-shell').getBoundingClientRect();
   const g=hubDexLayout();
   return {
    actual:Array.from(n.querySelectorAll('.tp-stories-frame .tp-pokedex-display'))
     .map(el=>{
      const r=el.getBoundingClientRect();
      return {x:r.x-shell.x,y:r.y-shell.y,w:r.width,h:r.height};
     }),
    expected:g.displays.map(r=>({
     x:r.x/g.u,y:r.y/g.u,w:r.w/g.u,h:r.h/g.u
    }))
   };
  });
  expect(shape.actual).toHaveLength(2);
  for(let i=0;i<2;i++)for(const key of ['x','y','w','h'])
   expect(Math.abs(shape.actual[i][key]-shape.expected[i][key])).toBeLessThan(1);

  const before=await page.evaluate(()=>({
   zapdos:TPZapdos.access(),articuno:TPArktos.access(),
   count:TPCollection.read().mons.length
  }));
  await page.evaluate(()=>{
   window.__storySelectionWrite=writeSave;
   window.__storySelectionWrites=0;
   writeSave=async()=>{
    window.__storySelectionWrites++;
    throw Error('UI01 selection must not write');
   };
  });
  try{
   for(const id of ['zapdos','articuno','zapdos']){
    const tile=await H.selectStory(page,id);
    await expect(tile.locator('.tp-story-place-icon svg')).toBeVisible();
    await expect(tile.locator('.tp-story-open-dot')).toHaveCount(1);
    await expect(page.locator('#tp-story-preview p')).not.toContainText(
     /\b(?:Zapdos|Arktos|Articuno|Lavados|Moltres|Mewtu|Mewtwo|Mew)\b/
    );
    await expect(root).toBeVisible();
   }
   expect(await page.evaluate(()=>window.__storySelectionWrites)).toBe(0);
   expect(await page.evaluate(()=>({
    zapdos:TPZapdos.access(),articuno:TPArktos.access(),
    count:TPCollection.read().mons.length
   }))).toEqual(before);
  }finally{
   await page.evaluate(()=>{writeSave=window.__storySelectionWrite;});
  }

  await expect.poll(()=>root.evaluate(n=>{
   const outer=n.getBoundingClientRect();
   const visible=el=>el.getClientRects().length>0;
   const controls=Array.from(n.querySelectorAll('button')).filter(visible);
   const regions=[
    n,n.querySelector('#tp-stories-page'),n.querySelector('#tp-story-preview'),
    n.querySelector('#tp-story-preview p')
   ];
   return regions.every(el=>
    el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1
   )&&controls.every(el=>{
    const r=el.getBoundingClientRect();
    return r.width>=44&&r.height>=44&&
     el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1&&
     r.left>=outer.left&&r.right<=outer.right&&
     r.top>=outer.top&&r.bottom<=outer.bottom;
   });
  })).toBe(true);

  await H.startStory(page,'zapdos');
  await expect(page.locator('#tp-zapdos-page')).toBeVisible();
  expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(0);
  await page.locator('#tp-app-page > .tp-app-head')
   .getByRole('button',{name:'Zurück',exact:true}).click();
  await expect(root).toBeVisible();
  await expect(page.locator('#tp-story-preview')).toHaveAttribute('data-story','zapdos');
  await expect(page.locator('#tp-stories-page button[data-story="zapdos"]'))
   .toHaveAttribute('aria-pressed','true');
 });
}
