const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const ids=['ball','catch','memo','clean','type'];
test.beforeEach(async({page})=>{await H.prepare(page);});

for(const width of [320,390,480]){
 test('Spieleauswahl: alle fünf Spiele ohne Blätterpfeile '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  await H.openGames(page);
  const root=page.locator('#tp-games-page');
  await expect(root).toBeVisible();
  await expect(root.locator('[data-play-game]')).toHaveCount(5);
  await expect(root.locator(
   '[data-play-previous],[data-play-next],.tp-play-footer'
  )).toHaveCount(0);
  if(width>=390){
   await expect.poll(()=>page.evaluate(()=>{
    const grid=document.querySelector('#tp-games-page .tp-play-grid');
    return grid.scrollHeight<=grid.clientHeight+1;
   })).toBe(true);
  }
  await page.evaluate(()=>{
   window.gameStarts=[];
   GAME_STARTERS.forEach((original,index)=>{
    GAME_STARTERS[index]=(...args)=>{
     window.gameStarts.push(index);return original(...args);
    };
   });
  });
  const before=await page.evaluate(()=>({
   records:GAME_TILES.map(item=>item.hi()),
   active:TPCollection.read().active,
   members:TPCollection.read().mons.map(mon=>mon.id)
  }));
  for(const id of ids){
   const tile=root.locator('[data-play-game="'+id+'"]');
   await tile.scrollIntoViewIfNeeded();
   await tile.click();
   await expect(tile).toHaveAttribute('aria-pressed','true');
   const valid=await tile.evaluate(element=>{
    const pane=document.querySelector(
     '#tp-games-page .tp-pokedex-display-left'
    ).getBoundingClientRect();
    const r=element.getBoundingClientRect();
    const grid=document.querySelector('#tp-games-page .tp-play-grid');
    return {
     inDisplay:r.width>=43&&r.height>=47&&r.left>=pane.left&&
      r.right<=pane.right&&r.top>=pane.top&&r.bottom<=pane.bottom,
     tile:{
      x:r.x,y:r.y,width:r.width,height:r.height,
      right:r.right,bottom:r.bottom
     },
     display:{
      x:pane.x,y:pane.y,width:pane.width,height:pane.height,
      right:pane.right,bottom:pane.bottom
     },
     scrollTop:grid.scrollTop,
     scrollHeight:grid.scrollHeight,
     clientHeight:grid.clientHeight
    };
   });
   expect(valid.inDisplay,JSON.stringify({game:id,...valid},null,2)).toBe(true);
   expect(await page.evaluate(()=>screen)).toBe('gamemenu');
  }
  expect(await page.evaluate(()=>window.gameStarts)).toEqual([]);
  expect(await page.evaluate(()=>({
   records:GAME_TILES.map(item=>item.hi()),
   active:TPCollection.read().active,
   members:TPCollection.read().mons.map(mon=>mon.id)
  }))).toEqual(before);

  const start=root.locator('[data-play-start]');
  expect(await start.evaluate(element=>{
   const pane=document.querySelector(
    '#tp-games-page .tp-pokedex-display-right'
   ).getBoundingClientRect();
   const r=element.getBoundingClientRect();
   return r.width>=43&&r.height>=43&&r.left>=pane.left&&
    r.right<=pane.right&&r.top>=pane.top&&r.bottom<=pane.bottom;
  })).toBe(true);
  await page.keyboard.press('Escape');
  await expect(root).not.toBeVisible();
  expect(await page.evaluate(()=>screen)).toBe('idle');
 });
}
for(let index=0;index<ids.length;index++){
 test('Spieleauswahl: genau ein echter Start für '+ids[index],async({page})=>{
  await H.openGames(page);
  await page.evaluate(()=>{
   window.gameStarts=[];
   GAME_STARTERS.forEach((original,index)=>{
    GAME_STARTERS[index]=(...args)=>{
     window.gameStarts.push(index);return original(...args);
    };
   });
  });
  await H.startGame(page,index);
  expect(await page.evaluate(()=>window.gameStarts)).toEqual([index]);
 });
}
test('Spieleauswahl: Typensymbole und Haken ohne echten Spielstart',async({page})=>{
 await H.openGames(page);
 const root=page.locator('#tp-games-page');
 await expect(root).toBeVisible();
 await page.evaluate(()=>{
  window.previewStarts=[];
  GAME_STARTERS.forEach((original,index)=>{
   GAME_STARTERS[index]=(...args)=>{
    window.previewStarts.push(index);return original(...args);
   };
  });
 });
 const before=await page.evaluate(()=>({
  scores:GAME_TILES.map(item=>item.hi()),mode:gameMode,
  typeScore:TypeGame.score,misses:TypeGame.misses
 }));
 const tile=root.locator('[data-play-game="type"]');
 await tile.scrollIntoViewIfNeeded();
 await tile.click();
 await expect(tile).toHaveAttribute('aria-pressed','true');
 await expect.poll(()=>page.evaluate(()=>{
  const canvas=document.querySelector('#tp-games-page .tp-play-preview');
  const pixels=canvas.getContext('2d').getImageData(
   0,0,canvas.width,canvas.height
  ).data;
  let green=0;
  for(let index=0;index<pixels.length;index+=4){
   if(pixels[index]===47&&pixels[index+1]===107&&pixels[index+2]===68)green++;
  }
  return green>20;
 })).toBe(true);
 expect(await page.evaluate(()=>window.previewStarts)).toEqual([]);
 expect(await page.evaluate(()=>({
  scores:GAME_TILES.map(item=>item.hi()),mode:gameMode,
  typeScore:TypeGame.score,misses:TypeGame.misses
 }))).toEqual(before);
 expect(await page.evaluate(()=>screen)).toBe('gamemenu');
});
