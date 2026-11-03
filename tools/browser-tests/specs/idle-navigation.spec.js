const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const snapshot=page=>page.evaluate(()=>({
 sleeping:fns.sleeping(),active:TPCollection.read().active,
 ids:TPCollection.read().mons.map(mon=>mon.id),
 care:[fns.fullness(),fns.joy(),fns.energy(),fns.hygiene(),fns.bond()],
 records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()]
}));
async function pressIdle(page,label){
 const point=await page.evaluate(label=>{
  const button=BUTTONS.find(button=>button.label===label);
  return button?{x:button.x,y:button.y}:null;
 },label);
 expect(point).not.toBeNull();
 await H.tap(page,point.x,point.y);
}
async function horizontal(page,direction){
 const start=await H.point(page,direction>0?100:360,180);
 const end=await H.point(page,direction>0?360:100,180);
 await page.mouse.move(start.x,start.y);await page.mouse.down();
 await page.mouse.move(end.x,end.y,{steps:8});await page.mouse.up();
}
test.beforeEach(async({page})=>{await H.prepare(page);await H.game(page);});

test('Hauptbildschirm: beide seitlichen Gesten bleiben ohne Navigation oder Pflege',async({page})=>{
 const before=await snapshot(page);
 for(const direction of [-1,1]){
  await horizontal(page,direction);
  expect(await page.evaluate(()=>screen)).toBe('idle');
 }
 expect(await snapshot(page)).toEqual(before);
});

test('Sichtbare Zentrale öffnet weiterhin den aktuellen Pokédex',async({page})=>{
 const before=await snapshot(page);
 await pressIdle(page,'POKEDEX');
 const hub=page.locator('#tp-app-page.tp-pokedex-hub');
 await expect(hub).toBeVisible();
 await hub.getByRole('button',{name:await H.uiText(page,'menu.dex'),exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>({screen,dexScreen,dexPage,dexFilter})))
  .toEqual({screen:'dex',dexScreen:'grid',dexPage:0,dexFilter:0});
 await expect(page.locator('#tp-dex-back')).toBeVisible();
 await page.locator('#tp-dex-back').click();
 await expect(hub).toBeVisible();
 await hub.locator('.tp-app-head button').click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 expect(await snapshot(page)).toEqual(before);
});

test('Ruhemodus: Zentrale öffnen und schließen weckt nicht und pflegt nicht',async({page})=>{
 await pressIdle(page,'LIGHT');
 await expect.poll(()=>page.evaluate(()=>fns.sleeping())).toBe(1);
 const before=await snapshot(page);
 await pressIdle(page,'POKEDEX');
 const hub=page.locator('#tp-app-page.tp-pokedex-hub');
 await expect(hub).toBeVisible();
 expect(await snapshot(page)).toEqual(before);
 await hub.locator('.tp-app-head button').click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 expect(await snapshot(page)).toEqual(before);
 await pressIdle(page,'FEED');
 expect(await page.evaluate(()=>performance.now()<feedMenuUntil)).toBe(false);
 expect(await snapshot(page)).toEqual(before);
});

test('Ruhemodus: bestehendes Speichergate sperrt weiterhin den Zentraleneinstieg',async({page})=>{
 await pressIdle(page,'LIGHT');
 await expect.poll(()=>page.evaluate(()=>fns.sleeping())).toBe(1);
 const before=await snapshot(page);
 const previous=await page.evaluate(()=>{const old=tpSaveReplacing;tpSaveReplacing=true;return old;});
 try{
  await pressIdle(page,'POKEDEX');
  expect(await page.evaluate(()=>TPAppMenu.active)).toBe(false);
  expect(await page.evaluate(()=>screen)).toBe('idle');
 }finally{
  await page.evaluate(value=>{tpSaveReplacing=value;},previous);
 }
 expect(await snapshot(page)).toEqual(before);
});
