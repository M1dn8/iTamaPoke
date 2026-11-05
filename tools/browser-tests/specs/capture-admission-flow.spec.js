// UI01: actual capture persistence, full team and pending admission recovery.
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const CF=require('./care-team-fixtures');

test.beforeEach(async({page})=>{
 const raw=CF.withCare(H.fixture(0),{
  dex:376,level:100,nickname:'Fangprüfung'
 });
 await H.prepare(page,raw,376);
 await H.game(page);
 await page.evaluate(async()=>{
  await TPCollectionGame.ensureCurrent();
  for(let i=0;i<5;i++){
   await TPCollection.apply('catchWild',{
    dex:25,level:20,nickname:'Reserve-'+i,shiny:false,origin:'wild',
    data:{stats:{atk:80,def:80,spe:80},genes:null,training:null}
   },0);
   const id=TPCollection.read().nextId-1;
   if(!TPCollection.read().team.includes(id))
    await TPCollection.apply('selectTeam',id);
  }
 });
 expect(await page.evaluate(()=>TPCollection.read().team.length)).toBe(6);
 await H.prepareWildCapture(page);
});

async function captureWithDelayedSave(page){
 const before=await page.evaluate(()=>({
  active:TPCollection.read().active,
  team:[...TPCollection.read().team],
  ids:TPCollection.read().mons.map(m=>m.id),
  preview:JSON.parse(Module.ccall('tp_f4_capture_snapshot','string',[],[]))
 }));
 await page.evaluate(()=>{
  const original=TPCapture;
  window.TPCapture=Object.create(original,{
   tryCatch:{value(...args){
    Module.ccall('tp_seed_random',null,['number'],[1]);
    return original.tryCatch(...args);
   }}
  });
  window.__captureOriginalWrite=writeSave;
  window.__captureWriteHeld=false;
  writeSave=(bytes,force=false)=>{
   if(force&&!window.__captureWriteHeld){
    window.__captureWriteHeld=true;
    return new Promise((resolve,reject)=>{
     let released=false;
     window.__releaseCaptureWrite=()=>{
      if(released)return;
      released=true;
      Promise.resolve()
       .then(()=>window.__captureOriginalWrite(bytes,force))
       .then(resolve,reject);
     };
    });
   }
   return window.__captureOriginalWrite(bytes,force);
  };
 });
 try{
  await H.battleAction(page,'catch');
  await expect.poll(()=>page.evaluate(()=>window.__captureWriteHeld))
   .toBe(true);
  expect(await page.evaluate(()=>TPCollection.busy)).toBe(true);
  expect(await page.evaluate(()=>TPAdmissionUI.active)).toBe(false);
  await page.evaluate(()=>window.__releaseCaptureWrite());
  await expect.poll(()=>page.evaluate(()=>({
   done:!!fns.battleCatchDone(),
   success:!!fns.battleCatchSuccess(),
   busy:TPCollection.busy,
   saving:tpSaveReplacing
  }))).toEqual({done:true,success:true,busy:false,saving:false});

  await expect(page.locator('#tp-admission-page')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>({
   active:TPAdmissionUI.active,
   captureBusy:!!TPBattleView.capture?.busy,
   inert:!!document.getElementById('tp-admission-page').inert
  }))).toEqual({active:true,captureBusy:false,inert:false});
  await expect(page.locator(
   '#tp-admission-page [data-admission-action="box"]'
  )).toBeEnabled();
  expect(await page.evaluate(()=>TPCollection.read().mons.map(m=>m.id)))
   .toEqual(before.ids);
  expect(await page.evaluate(()=>!!TPAdmission.read().pending)).toBe(true);
  return before;
 }finally{
  await page.evaluate(()=>{
   window.__releaseCaptureWrite?.();
   if(window.__captureOriginalWrite)
    writeSave=window.__captureOriginalWrite;
  }).catch(()=>{});
 }
}

async function placeInBox(page,before){
 await page.locator(
  '#tp-admission-page [data-admission-action="box"]'
 ).click();
 await expect.poll(()=>page.evaluate(()=>({
  pending:!!TPAdmission.read().pending,
  active:TPAdmissionUI.active,
  busy:TPCollection.busy,
  saving:tpSaveReplacing
 }))).toEqual({pending:false,active:false,busy:false,saving:false});
 const state=await page.evaluate(()=>TPCollection.read());
 expect(state.active).toBe(before.active);
 expect(state.team).toEqual(before.team);
 const added=state.mons.filter(m=>!before.ids.includes(m.id));
 expect(added).toHaveLength(1);
 expect(added[0].dex).toBe(before.preview.dex);
 expect(added[0].level).toBe(before.preview.level);
 expect(added[0].origin).toBe('wild');
 expect(state.boxes.flatMap(b=>b.slots).filter(id=>id===added[0].id))
  .toHaveLength(1);
 return state.mons.map(m=>m.id);
}

test('UI01 Fangabschluss: volle Teamplanung, Boxentscheidung und Weiter bleiben bedienbar',
 async({page})=>{
  test.setTimeout(90000);
  const before=await captureWithDelayedSave(page);
  const ids=await placeInBox(page,before);
  await expect(page.locator(
   '#tp-battle-page [data-battle-action="ok"]'
  )).toBeVisible();
  await H.battleAction(page,'ok');
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
  await page.reload();await H.waitReady(page);
  expect(await page.evaluate(()=>TPCollection.read().mons.map(m=>m.id)))
   .toEqual(ids);
  expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
 });

test('UI01 Fangabschluss: offene Aufnahme überlebt Reload und wird genau einmal abgelegt',
 async({page})=>{
  test.setTimeout(90000);
  const before=await captureWithDelayedSave(page);
  await page.reload();await H.waitReady(page);
  const device=page.locator('#tp-battle-page');
  await expect(device).toBeVisible();
  await expect(device).toHaveAttribute('data-battle-state','admission');
  await expect(device).toHaveAttribute('data-battle-mode','admission');
  await expect(device).toHaveAttribute('data-battle-admission','true');
  await expect(device.locator('#tp-admission-page')).toBeVisible();
  await expect(device.locator('.tp-battle-scene'))
   .toHaveAttribute('data-caught-dex',String(before.preview.dex));
  const resumed=await page.evaluate(()=>({
   screen,
   battleOpen:Module.ccall('tp_battle_is_open','number',[],[])
  }));
  expect(resumed.battleOpen).toBe(0);
  expect(resumed.screen).not.toBe('battle');
  for(const viewport of [{width:320,height:568},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   await expect(device).toBeVisible();
   expect(await device.evaluate(element=>{
    const a=element.getBoundingClientRect();
    const b=document.getElementById('tp-game-shell').getBoundingClientRect();
    return a.width>0&&a.height>0&&
     a.left>=b.left-1&&a.top>=b.top-1&&
     a.right<=b.right+1&&a.bottom<=b.bottom+1;
   })).toBe(true);
  }
  await page.locator('#tp-game-shell').screenshot({
   path:test.info().outputPath('aufnahme-nach-reload.png')
  });
  await expect(page.locator(
   '#tp-admission-page [data-admission-action="box"]'
  )).toBeEnabled();
  const ids=await placeInBox(page,before);
  await expect(device).toBeHidden();
  await expect.poll(()=>page.evaluate(()=>
   document.getElementById('tp-game-shell').hasAttribute('data-battle-device')
  )).toBe(false);
  expect(await page.evaluate(()=>({
   screen,
   battleOpen:Module.ccall('tp_battle_is_open','number',[],[])
  }))).toEqual(resumed);
  await page.reload();await H.waitReady(page);
  expect(await page.evaluate(()=>TPCollection.read().mons.map(m=>m.id)))
   .toEqual(ids);
  expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
 });
