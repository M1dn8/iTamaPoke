 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

async function seed(page,{fullBoxes=false}={}){
 await H.game(page);
 return page.evaluate(async fullBoxes=>{
  await TPCollectionGame.ensureCurrent();
  const original=TPCollection.read();
  let s=original;
  const target=fullBoxes?200:5;
  while(TPCollectionModel.summary(s).stored<target){
   s=TPCollectionModel.catchWild(s,{
    dex:25,level:20,nickname:'Box '+s.nextId,shiny:false,origin:'wild',
    data:{stats:{atk:100,def:100,spe:100}}
   });
   if(s.team.length<6)s=TPCollectionModel.selectTeam(s,s.nextId-1);
  }
  const a=TPAdmissionModel.queue(TPAdmission.read(),{
   kind:'join',source:'story:test:admission',
   pokemon:{dex:145,level:50,nickname:'Wartender Vogel',shiny:false,
    origin:'wild',data:{stats:{atk:100,def:100,spe:100}}}
  });
  const token=Module.ccall('tp_f4_store_begin','number',[],[]);
  if(!token)throw Error('Fixture transaction refused');
  const oldChoice=choice;choice='admission-fixture';
  tpSaveReplacing=true;tpSaveEpoch++;
  let durable=false;
  try{
   for(const [name,data,extra] of [
    ['tp_f4_store_stage',new TextEncoder().encode(TPCollectionModel.encode(s)),[]],
    ['tp_f4_admission_stage',new TextEncoder().encode(TPAdmissionModel.encode(a)),[1]]
   ]){
    const ptr=Module._malloc(data.length);
    try{
     Module.HEAPU8.set(data,ptr);
     const args=[token,ptr,data.length,...extra];
     if(Module.ccall(name,'number',args.map(()=>'number'),args)!==1)
      throw Error('Fixture stage refused');
    }finally{Module._free(ptr);}
   }
   const bytes=exportStateBytes(Module);
   TPStoreTools.parseLegacy(bytes);
   if(await writeSave(bytes,true)!==true)throw Error('Fixture save refused');
   durable=true;
   if(Module.ccall('tp_f4_store_finish','number',['number','number'],[token,1])!==1)
    throw Error('Fixture confirm refused');
  }catch(error){
   if(!durable)Module.ccall('tp_f4_store_finish','number',
    ['number','number'],[token,0]);
   throw error;
  }finally{tpSaveEpoch++;tpSaveReplacing=false;choice=oldChoice;}
  return {active:s.active,team:s.team,mons:s.mons.length};
 },fullBoxes);
}
const dialog=page=>page.locator('#tp-admission-page');
async function pendingDialog(page){
 await expect(dialog(page)).toBeVisible();
 await expect(dialog(page).getByRole('button',{name:'Später',exact:true}))
  .toBeEnabled();
}
test.beforeEach(async({page})=>{await H.prepare(page);});

test('P06 admission: pinned care, explicit replacement and both individuals retained',
 async({page})=>{
  const before=await seed(page);await pendingDialog(page);
  await dialog(page).getByRole('button',{name:'Ins Team aufnehmen',exact:true}).click();
  await expect(dialog(page).getByRole('button',{name:/Pflege-Pokémon — fest/}))
   .toBeDisabled();
  const replacement=before.team[2];
  await dialog(page).getByRole('button',{name:new RegExp('^Box '+replacement+' ·')})
   .click();
  await expect.poll(()=>page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
  const s=await page.evaluate(()=>TPCollection.read());
  expect(s.active).toBe(before.active);
  expect(s.team[2]).toBe(s.nextId-1);
  expect(s.mons.some(m=>m.id===replacement)).toBe(true);
  expect(s.mons.length).toBe(before.mons+1);
  await page.reload();await H.waitReady(page);
  expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
 });

test('P06 admission: box decision preserves all six selected members',
 async({page})=>{
  const before=await seed(page);await pendingDialog(page);
  await dialog(page).getByRole('button',{name:'In einer Box ablegen',exact:true})
   .click();
  await expect.poll(()=>page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
  expect(await page.evaluate(()=>TPCollection.read().team)).toEqual(before.team);
 });

test('P06 admission: full boxes wait across reload; box release enables later admission',
 async({page})=>{
  test.setTimeout(90000);
  await seed(page,{fullBoxes:true});await pendingDialog(page);
  await expect(dialog(page).getByText(/Alle Boxen sind voll/)).toBeVisible();
  await page.reload();await H.waitReady(page);await H.game(page);
  await pendingDialog(page);
  await dialog(page).getByRole('button',{name:'Boxen öffnen',exact:true}).click();
  const boxes=page.locator('#tp-box-page');
  await expect(boxes).toBeVisible();
  await boxes.locator('.tp-box-tile').last().click();
  await boxes.getByRole('button',{name:'Endgueltig freilassen',exact:true}).click();
  await boxes.getByRole('button',{
   name:'Dieses Exemplar endgueltig freilassen',exact:true
  }).click();
  await expect(boxes.getByText('Gespeichert.',{exact:true})).toBeVisible();
  await boxes.getByRole('button',{
   name:'Wartendes Pokémon aufnehmen',exact:true
  }).click();
  await pendingDialog(page);
  await dialog(page).getByRole('button',{name:'In einer Box ablegen',exact:true})
   .click();
  await expect.poll(()=>page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
  expect(await page.evaluate(()=>TPCollectionModel.summary(TPCollection.read()).stored))
   .toBe(200);
 });

test('P06 admission: failed claim keeps pending and disk; retry admits exactly once',
 async({page})=>{
  const before=await seed(page);await pendingDialog(page);
  const disk=await page.evaluate(async()=>Array.from(await loadSave()));
  await page.evaluate(()=>{
   window.__admissionWrite=writeSave;
   writeSave=async()=>{throw Error('intentional admission quota');};
  });
  await dialog(page).getByRole('button',{name:'In einer Box ablegen',exact:true})
   .click();
  await expect(dialog(page).getByText(
   'Aufnahme nicht gespeichert. Bitte erneut versuchen.',{exact:true}
  )).toBeVisible();
  expect(await page.evaluate(async()=>Array.from(await loadSave()))).toEqual(disk);
  expect(await page.evaluate(()=>!!TPAdmission.read().pending)).toBe(true);
  expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(before.mons);
  await page.evaluate(()=>{writeSave=window.__admissionWrite;});
  await dialog(page).getByRole('button',{name:'In einer Box ablegen',exact:true})
   .click();
  await expect.poll(()=>page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
  expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(before.mons+1);
 });
