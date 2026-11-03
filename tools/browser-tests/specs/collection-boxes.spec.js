const {test,expect}=require('@playwright/test');const H=require('./helpers');



async function verifyBoxChoices(root){
 await root.getByRole('button',{name:'Boxen',exact:true}).click();
 const initial=Number(await root.getAttribute('data-current-box'));
 const visited=new Set();
 for(let step=0;step<10;step++){
  const current=Number(await root.getAttribute('data-current-box'));
  expect(Number.isInteger(current)&&current>=0&&current<10).toBe(true);
  expect(visited.has(current)).toBe(false);
  visited.add(current);
  const next=root.locator('#tp-box-next-box');
  await expect(next).toBeVisible();
  await expect(next).toBeEnabled();
  await next.click();
 }
 expect([...visited].sort((a,b)=>a-b))
  .toEqual(Array.from({length:10},(_,index)=>index));
 await expect(root).toHaveAttribute('data-current-box',String(initial));
}
test.beforeEach(async({page})=>{await H.prepare(page);});




async function ui01CollectionSnapshot(page){
 return page.evaluate(()=>{
  const s=TPCollection.read();
  return {
   active:s.active,team:s.team,
   mons:s.mons.map(m=>({
    id:m.id,dex:m.dex,nickname:m.nickname,origin:m.origin,shiny:m.shiny
   })),
   boxes:s.boxes
  };
 });
}
async function ui01OpenCollection(page){
 await H.openHub(page);
 await page.locator('#tp-app-page')
  .getByRole('button',{name:'Boxen',exact:true}).click();
 const boxes=page.locator('#tp-box-page');
 await expect(boxes).toBeVisible();
 await expect(page.locator('#tp-app-page')).toBeHidden();
 await expect(boxes.getByRole('button',{name:/^Teamplanung /}))
  .toHaveAttribute('aria-pressed','true');
 await boxes.getByRole('button',{name:'Boxen',exact:true}).click();
}

test('UI01 Sammlung: Zentralenzugang, Rueckweg und Reload ohne Kopien',
 async({page})=>{
  await H.game(page);
  await page.evaluate(()=>TPCollectionGame.ensureCurrent());
  const before=await ui01CollectionSnapshot(page);
  const cardBefore=await page.evaluate(()=>cardPage);
  await ui01OpenCollection(page);
  expect(await page.evaluate(()=>cardPage)).toBe(cardBefore);
  const boxes=page.locator('#tp-box-page');
  await verifyBoxChoices(boxes);
  await boxes.locator('.tp-box-head button').click();
  await expect(boxes).toBeHidden();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
  expect(await ui01CollectionSnapshot(page)).toEqual(before);

  await ui01OpenCollection(page);
  await boxes.locator('.tp-box-head button').click();
  await page.reload();await H.waitReady(page);
  await ui01OpenCollection(page);
  expect(await ui01CollectionSnapshot(page)).toEqual(before);
  await boxes.locator('.tp-box-head button').click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
 });

test('UI01 Sammlung: Hub-Schreibfehler bleibt wiederholbar und dauerhaft',async({page})=>{
 await H.game(page);
 const stored=await page.evaluate(async()=>{
  await TPCollectionGame.ensureCurrent();
  await TPCollection.apply('catchWild',{
   dex:25,level:17,nickname:'Vorher',shiny:false,origin:'wild',
   data:{stats:{atk:42,def:31,spe:60},genes:null,training:null}
  },0);
  return TPCollection.read().nextId-1;
 });
 await ui01OpenCollection(page);
 const boxes=page.locator('#tp-box-page');
 await boxes.locator('[data-mon-id="'+stored+'"]').click();
 await boxes.getByRole('button',{name:'Verwalten',exact:true}).click();
 await boxes.getByRole('button',{name:'Namen ändern',exact:true}).click();
 const input=boxes.getByLabel('Spitzname',{exact:true});
 await input.fill('UI01-Testname');
 const snapshot=()=>page.evaluate(()=>{
  const size=Module.ccall('tp_f4_store_size','number',[],[]);
  const ptr=Module.ccall('tp_f4_store_ptr','number',[],[]);
  return {
   model:TPCollectionModel.encode(TPCollection.read()),
   native:Array.from(Module.HEAPU8.slice(ptr,ptr+size))
  };
 });
 const before=await snapshot();
 await page.evaluate(()=>{
  window.__ui01BoxWrite=writeSave;
  writeSave=async()=>{throw Error('UI01 intentional quota');};
 });
 try{
  await boxes.getByRole('button',{name:'Speichern',exact:true}).click();
  await expect(boxes.getByText(/Speichern fehlgeschlagen/)).toBeVisible();
  expect(await snapshot()).toEqual(before);
  expect(await page.evaluate(()=>TPCollection.blocked)).toBe(false);
  await expect(input).toHaveValue('UI01-Testname');
  await page.evaluate(()=>{writeSave=window.__ui01BoxWrite;});
  await boxes.getByRole('button',{name:'Speichern',exact:true}).click();
  await expect(boxes.getByText('Gespeichert.',{exact:true})).toBeVisible();
  await expect.poll(()=>page.evaluate(id=>
   TPCollection.read().mons.find(m=>m.id===id)?.nickname,stored
  )).toBe('UI01-Testname');
  const saved=await page.evaluate(()=>({
   active:TPCollection.read().active,
   ids:TPCollection.read().mons.map(m=>m.id),
   boxes:TPCollection.read().boxes
  }));
  await page.reload();await H.waitReady(page);
  expect(await page.evaluate(id=>
   TPCollection.read().mons.find(m=>m.id===id)?.nickname,stored
  )).toBe('UI01-Testname');
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,
   ids:TPCollection.read().mons.map(m=>m.id),
   boxes:TPCollection.read().boxes
  }))).toEqual(saved);
 }finally{
  await page.evaluate(()=>{
   if(window.__ui01BoxWrite)writeSave=window.__ui01BoxWrite;
  }).catch(()=>{});
 }
});
