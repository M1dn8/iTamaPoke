const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
if(!globalThis.crypto)globalThis.crypto=require('node:crypto').webcrypto;
const H=require('./helpers');
globalThis.TPCollectionModel=require('../../../browser_ver/web/collection-model.js');
const T=require('../../../browser_ver/web/storage-tools.js');
let errors;
test.beforeEach(async({page})=>{errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await H.prepare(page);});
test.afterEach(async()=>{expect(errors).toEqual([]);});
test('Navigation: zwei Menueintraege und sechs Zentralenzugaenge mit Rueckwegen',async({page})=>{
 await H.game(page);await H.openMenu(page);
 await expect(page.locator('#toolbar')).toBeHidden();
 await expect(page.locator('.tp-tools')).toBeHidden();
 const root=page.locator('#tp-app-page');
 await expect(root.locator('.tp-app-grid button')).toHaveText([
  'Sicherungen','Einstellungen'
 ]);
 for(const name of ['Tagebuch','Geschichten','Pokédex','Eier','Entwicklung'])
  await expect(root.getByRole('button',{name,exact:true})).toHaveCount(0);

 async function modalBack(){
  const p=H.modal(page);
  await expect(p).toBeVisible();
  const themedPanel=await p.locator('.tp-egg-plan-panel,.tp-evolution-panel').count();
  await expect(p.locator('.tp-panel')).toHaveCSS(
   'background-color',themedPanel?'rgb(168, 58, 67)':'rgb(247, 239, 230)'
  );
  const box=await p.locator('.tp-panel').boundingBox();
  const shell=await page.locator('#tp-game-shell').boundingBox();
  expect(Math.abs(box.width-shell.width)).toBeLessThan(3);
  await p.locator('.tp-modal-head button').click();
  await expect(root).toBeVisible();
 }

 await page.waitForFunction(()=>Array.from(
  document.querySelectorAll('.tp-tools button')
 ).some(b=>b.textContent.trim()==='Sicherungen'&&!b.disabled));
 await root.getByRole('button',{name:'Sicherungen',exact:true}).click();
 await modalBack();
 await expect(root.locator('.tp-app-grid button')).toHaveText([
  'Sicherungen','Einstellungen'
 ]);

 await H.openHub(page);
 await expect(root.locator('.tp-app-grid button')).toHaveText([
  'Tagebuch','Geschichten','Pokédex','Eier','Entwicklung','Boxen'
 ]);
 for(const name of ['Entwicklung','Eier']){
  await root.getByRole('button',{name,exact:true}).click();
  await modalBack();
  await expect(root.getByRole('heading',{
   name:'Pokédex-Zentrale',exact:true
  })).toBeVisible();
 }
 await H.openMenu(page);
 await root.getByRole('button',{name:'Einstellungen',exact:true}).click();
 await expect(root.getByRole('button',{
  name:'Dateien verwalten',exact:true
 })).toBeVisible();
 await root.getByRole('button',{name:'Zurück',exact:true}).click();
 await expect(root.locator('.tp-app-grid button')).toHaveText([
  'Sicherungen','Einstellungen'
 ]);
});
test('Dateiauswahl bleibt ueber das neue Menue erreichbar',async({page})=>{
 await H.openMenu(page);await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('button',{name:'Dateien verwalten',exact:true}).click();
 for(const label of ['Grafiken laden (Pokemon und Leiter)','Rufe laden','Pokédex-Texte laden']){
  const [chooser]=await Promise.all([page.waitForEvent('filechooser'),page.getByRole('button',{name:label,exact:true}).click()]);await chooser.setFiles([]);
 }
 await expect(page.getByRole('heading',{name:'Dateien',exact:true})).toBeVisible();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.tp-tools button')).some(b=>['Dateien','Assets'].includes(b.textContent.trim())&&!b.disabled));await page.getByRole('button',{name:'Dateibestand prüfen',exact:true}).click();await expect(H.modal(page)).toBeVisible();await H.modal(page).locator('.tp-modal-head button').click();await expect(page.getByRole('heading',{name:'Dateien',exact:true})).toBeVisible();
});
test('Tagebuch erreicht alle 120 Eintraege ueber Seiten und behaelt sie nach Reload',async({page})=>{
 const list=await H.diary(page);
 await expect(list.locator('article')).toHaveCount(120);
 const firstKey=await list.locator('article:visible').first()
  .getAttribute('data-journal-key');
 const reached=new Set();
 let finished=false;
 for(let attempt=0;attempt<210;attempt++){
  const keys=await list.locator('article:visible').evaluateAll(
   rows=>rows.map(row=>row.dataset.journalKey)
  );
  expect(keys.length).toBeGreaterThan(0);
  expect(keys.length).toBeLessThanOrEqual(3);
  keys.forEach(key=>reached.add(key));
  const next=page.locator('#tp-journal-next');
  if(await next.isDisabled()){finished=true;break;}
  await next.click();
 }
 expect(finished).toBe(true);
 expect(reached.size).toBe(120);
 await expect(page.getByRole('heading',{name:'Tagebuch',exact:true})).toBeVisible();
 await page.reload();await H.waitReady(page);
 const restored=await H.diary(page);
 await expect(restored.locator('article')).toHaveCount(120);
 await expect(restored.locator('article:visible')).toHaveCount(3);
 expect(await restored.locator('article:visible').first()
  .getAttribute('data-journal-key')).toBe(firstKey);
});

test('Externe Sicherung nimmt grosses Tagebuch mit und stellt es wieder her',async({page},info)=>{
 await H.openMenu(page);await page.getByRole('button',{name:'Sicherungen',exact:true}).click();const p=H.modal(page);
 await p.locator('[data-saves-category="export"]').click();
 const [download]=await Promise.all([page.waitForEvent('download'),p.getByRole('button',{name:'Version 1 exportieren',exact:true}).click()]);const path=info.outputPath('synthetische-sicherung.tpsave');await download.saveAs(path);const bytes=await fs.readFile(path);const decoded=await T.decode(bytes);expect(decoded.summary.dex).toBe(1);expect(decoded.values.get('jrcount').value).toBe(120);
 await p.locator('.tp-modal-head button').click();await page.getByRole('button',{name:'Einstellungen',exact:true}).click();
 const accept=d=>d.accept();page.on('dialog',accept);await Promise.all([page.waitForEvent('load'),page.getByRole('button',{name:'Neues Spiel',exact:true}).click()]);page.off('dialog',accept);await H.waitReady(page);
 await H.importSave(page,bytes);const list=await H.diary(page);await expect(list.locator('article')).toHaveCount(120);
});
test('Deutsches Typenspiel sperrt Mehrfachtipps bei Rueckmeldung',async({page})=>{
 await H.game(page);await H.openGames(page);await expect.poll(()=>page.evaluate(()=>screen)).toBe('gamemenu');await H.startGame(page,4);await expect.poll(()=>page.evaluate(()=>screen)).toBe('game');expect(await page.evaluate(()=>TYPE_NAMES[2])).toBe('FEUER');
 const wrong=await page.evaluate(()=>(TypeGame.correct+1)%3);const pos=await H.point(page,200,234+wrong*60);for(let i=0;i<3;i++)await page.mouse.click(pos.x,pos.y);expect(await page.evaluate(()=>TypeGame.misses)).toBe(1);
 await page.waitForFunction(()=>TypeGame.feedbackUntil===0);
 for(let i=0;i<2;i++){
  const index=await page.evaluate(()=>(TypeGame.correct+1)%3);await H.tap(page,200,234+index*60);if(i===0)await page.waitForFunction(()=>TypeGame.feedbackUntil===0);
 }
 await page.waitForFunction(()=>TypeGame.overUntil>0);await page.waitForFunction(()=>screen==='idle');
});


test('Eierplan: Speichern und Neuladen kehrt zur Pokedex-Zentrale zurueck',async({page})=>{
 await H.openHub(page);
 const before=await page.evaluate(()=>({
  dex:fns.speciesId(),
  active:TPCollection.read().active,
  count:TPCollection.read().mons.length,
  generation:Module.ccall('tp_egg_plan_generation','number',[],[])
 }));
 const generation=before.generation===2?3:2;
 const root=page.locator('#tp-app-page');
 await root.getByRole('button',{name:'Eier',exact:true}).click();
 const panel=H.modal(page);
 await expect(panel).toBeVisible();
 await panel.getByRole('button',{name:'Bevorzugte Generation',exact:true}).click();
  await panel.locator('button[data-egg-generation="'+generation+'"]').click();
 await Promise.all([
  page.waitForEvent('load'),
  panel.getByRole('button',{
   name:'Plan speichern und neu laden',exact:true
  }).click()
 ]);
 await H.waitReady(page);
 await expect(root.getByRole('heading',{
  name:'Pokédex-Zentrale',exact:true
 })).toBeVisible();
 expect(await page.evaluate(()=>({
  dex:fns.speciesId(),
  active:TPCollection.read().active,
  count:TPCollection.read().mons.length,
  generation:Module.ccall('tp_egg_plan_generation','number',[],[])
 }))).toEqual({...before,generation});
});


for(const width of [320,390,430]){
 test('UI01 Zentrale: Gehaeuse und echte Icon-Zugaenge bei '+width,
  async({page})=>{
   await page.setViewportSize({width,height:568});
   await H.openHub(page);
   const hub=page.locator('#tp-app-page.tp-pokedex-hub');
   await expect(hub).toBeVisible();
   await expect(hub.locator('.tp-app-grid button')).toHaveText([
    'Tagebuch','Geschichten','Pokédex','Eier','Entwicklung','Boxen'
   ]);
   await expect(hub.locator('.tp-hub-icon')).toHaveCount(6);
   await expect(hub.locator('.tp-hub-icon svg')).toHaveCount(6);
   for(const [key,colour] of [
    ['journal','rgb(49, 91, 131)'],
    ['stories','rgb(113, 83, 138)'],
    ['species','rgb(150, 60, 69)'],
    ['eggs','rgb(134, 96, 51)'],
    ['evolution','rgb(62, 116, 85)'],
    ['collection','rgb(53, 107, 112)']
   ]){
    await expect(hub.locator(
     'button[data-hub="'+key+'"] .tp-hub-icon'
    )).toHaveCSS('color',colour);
   }
   await expect.poll(()=>hub.evaluate(n=>{
    const outer=n.getBoundingClientRect();
    return n.scrollHeight<=n.clientHeight+1&&
     n.scrollWidth<=n.clientWidth+1&&
     Array.from(n.querySelectorAll('button')).every(button=>{
      const r=button.getBoundingClientRect();
      const compact=!button.closest('.tp-app-grid')||r.height<=58;
      return compact&&r.width>=44&&r.height>=44&&
       button.scrollWidth<=button.clientWidth+1&&
       button.scrollHeight<=button.clientHeight+1&&
       r.left>=outer.left-1&&r.right<=outer.right+1&&
       r.top>=outer.top-1&&r.bottom<=outer.bottom+1;
     });
   })).toBe(true);
   await hub.getByRole('button',{name:'Geschichten',exact:true}).click();
   await expect(page.locator('#tp-stories-page')).toBeVisible();
   await page.locator('#tp-app-page > .tp-app-head')
    .getByRole('button',{name:'Zurück',exact:true}).click();
   await expect(hub).toBeVisible();
   await expect(hub.locator('.tp-hub-icon')).toHaveCount(6);
  });
}


for(const width of [320,390,430]){
 test('UI01 Kopfzeile: Zurueck bleibt positionsgleich bei '+width,
  async({page})=>{
   await page.setViewportSize({width,height:568});
   await H.openHub(page);
   const app=page.locator('#tp-app-page');
   const hub=page.locator('#tp-app-page.tp-pokedex-hub');
   const hubBack=hub.locator(':scope > .tp-app-head > button');
   await expect(hubBack).toHaveText('Zurück');
   const shell=page.locator('#tp-game-shell');

   async function geometry(button){
    const b=await button.boundingBox();
    const frame=await shell.boundingBox();
    expect(b).not.toBeNull();
    expect(frame).not.toBeNull();
    return {
     right:frame.x+frame.width-b.x-b.width,
     top:b.y-frame.y,
     width:b.width,height:b.height
    };
   }

   async function expectRounded(surface){
    for(const corner of [
     'border-top-left-radius','border-top-right-radius',
     'border-bottom-left-radius','border-bottom-right-radius'
    ]){
     await expect(surface).toHaveCSS(corner,'12px');
    }
   }
   await expectRounded(shell);
   await expect(shell).toHaveCSS('overflow-x','hidden');
   await expect(shell).toHaveCSS('overflow-y','hidden');
   await expectRounded(hub);

   const reference=await geometry(hubBack);
   expect(reference.width).toBeCloseTo(64,0);
   expect(reference.height).toBeCloseTo(44,0);

   for(const [label,kind] of [
    ['Geschichten','page'],
    ['Tagebuch','page'],
    ['Eier','modal'],
    ['Entwicklung','modal'],
    ['Pokédex','dex'],
    ['Boxen','boxes']
   ]){
    await expect(hub).toBeVisible();
    await hub.getByRole('button',{name:label,exact:true}).click();

    const back=kind==='dex'?page.locator('#tp-dex-back'):
     kind==='modal'?
     H.modal(page).locator('.tp-modal-head > button'):
     kind==='boxes'?
      page.locator('#tp-box-page > .tp-box-head > button'):
      app.locator(':scope > .tp-app-head > button');

    await expect(back).toBeVisible();
    await expect(back).toBeEnabled();
    await expect(back).toHaveText('Zurück');
    const surface=kind==='dex'?shell:
     kind==='modal'?
     H.modal(page).locator('.tp-panel'):
     kind==='boxes'?page.locator('#tp-box-page'):app;
    await expectRounded(surface);
    const actual=await geometry(back);

    for(const key of ['right','top','width','height']){
     expect(
      Math.abs(actual[key]-reference[key]),
      label+' / '+key
     ).toBeLessThan(1);
    }

    await back.click();
    await expect(hub).toBeVisible();
    const restored=await geometry(hubBack);
    for(const key of ['right','top','width','height']){
     expect(
      Math.abs(restored[key]-reference[key]),
      'Hub return from '+label+' / '+key
     ).toBeLessThan(1);
    }
   }
  });
}


test('UI01 Pokédex: direktes Raster, Suche und Rueckweg ohne Freischaltungen',
 async({page})=>{
  await H.game(page);
  const snapshot=()=>page.evaluate(()=>({
   raised:fns.registeredCount(),caught:fns.caughtCount(),
   dex:fns.speciesId(),active:TPCollection.read().active,
   ids:TPCollection.read().mons.map(m=>m.id)
  }));
  const before=await snapshot();
  await H.openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{
   name:await H.uiText(page,'menu.dex'),exact:true
  }).click();
  await expect.poll(()=>page.evaluate(()=>({
   screen,dexScreen,dexPage,dexFilter
  }))).toEqual({
   screen:'dex',dexScreen:'grid',dexPage:0,dexFilter:0
  });
  await expect(H.modal(page)).toHaveCount(0);
  await expect(page.locator('#tp-dex-back')).toHaveText(
   await H.uiText(page,'common.back')
  );
  await page.locator('#tp-dex-search').click();
  await expect(H.modal(page)).toBeVisible();
  await H.modal(page).locator('.tp-modal-head button').click();
  await expect(page.locator('#tp-dex-back')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('dex');
  await page.locator('#tp-dex-back').click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
  expect(await snapshot()).toEqual(before);
 });


test('UI01 Pokédex: Rueckkehr bei gesetztem UI-Speichergate',
 async({page})=>{
  await H.game(page);
  await page.evaluate(()=>TPCollectionGame.ensureCurrent());

  const identity=()=>page.evaluate(()=>{
   const s=TPCollection.read();
   return {
    active:s.active,team:s.team,
    ids:s.mons.map(m=>m.id),
    boxes:s.boxes
   };
  });
  const before=await identity();

  await H.openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{
   name:await H.uiText(page,'menu.dex'),exact:true
  }).click();

  const back=page.locator('#tp-dex-back');
  await expect(back).toBeEnabled();

  // Explicit UI-contract simulation, not a native storage transaction.
  // Enter the gate before the ordinary click listener receives the event.
  await back.evaluate(button=>{
   window.__ui01GateEntered=false;
   button.addEventListener('click',()=>{
    window.__ui01GatePrevious=tpSaveReplacing;
    window.__ui01GateEntered=true;
    tpSaveReplacing=true;
   },{capture:true,once:true});
  });

  try{
   await back.click();

   expect(await page.evaluate(()=>({
    entered:window.__ui01GateEntered,
    previous:window.__ui01GatePrevious,
    held:tpSaveReplacing,
    collectionBusy:TPCollection.busy
   }))).toEqual({
    entered:true,previous:false,held:true,collectionBusy:false
   });

   await expect(back).toBeDisabled();
   await expect(page.locator('#tp-app-page')).toBeHidden();
   await expect.poll(()=>page.evaluate(()=>screen)).toBe('dex');

   await page.evaluate(()=>{
    tpSaveReplacing=window.__ui01GatePrevious;
    window.__ui01GateEntered=false;
   });

   // No second click: the original request must complete automatically.
   await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
   await expect(back).toBeHidden();
   expect(await identity()).toEqual(before);
  }finally{
   await page.evaluate(()=>{
    if(window.__ui01GateEntered){
     tpSaveReplacing=window.__ui01GatePrevious;
     window.__ui01GateEntered=false;
    }
   }).catch(()=>{});
  }
 });

test('UI01 Pokédex: Sammlungsschreiben im Raster abgewiesen',
 async({page})=>{
  await H.openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{
   name:await H.uiText(page,'menu.dex'),exact:true
  }).click();

  await expect.poll(()=>page.evaluate(()=>screen)).toBe('dex');

  const result=await page.evaluate(async()=>{
   const before=TPCollectionModel.encode(TPCollection.read());
   const originalWrite=writeSave;
   let forcedWrites=0;
   writeSave=async(bytes,force=false)=>{
    if(force)forcedWrites++;
    return originalWrite(bytes,force);
   };

   let accepted=false,error=null;
   try{
    await TPCollection.apply('renameBox',0,'Nicht-erlaubt-im-Dex');
    accepted=true;
   }catch(cause){
    error={
     name:cause.name,
     code:cause.code||null,
     message:cause.message
    };
   }finally{
    writeSave=originalWrite;
   }

   return {
    accepted,error,forcedWrites,
    unchanged:TPCollectionModel.encode(TPCollection.read())===before,
    busy:TPCollection.busy,
    blocked:TPCollection.blocked,
    gate:tpSaveReplacing,
    screen
   };
  });

  expect(result).toEqual({
   accepted:false,
   error:{
    name:'Error',
    code:null,
    message:'Sammlung: Spiel ist gerade beschaeftigt.'
   },
   forcedWrites:0,
   unchanged:true,
   busy:false,
   blocked:false,
   gate:false,
   screen:'dex'
  });

  await page.locator('#tp-dex-back').click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
 });


test('UI01 Pokédex: nativer Klick bleibt ueber Aktualisierungsframes stabil',
 async({page})=>{
  await H.openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{
   name:await H.uiText(page,'menu.dex'),exact:true
  }).click();

  const back=page.locator('#tp-dex-back');
  await expect(back).toBeVisible();
  await expect(back).toBeEnabled();

  await back.evaluate(button=>{
   const probe={
    button,label:button.firstChild,mutations:0,frames:0,observer:null
   };
   probe.observer=new MutationObserver(records=>{
    probe.mutations+=records.length;
   });
   probe.observer.observe(button,{
    attributes:true,childList:true,characterData:true,subtree:true
   });
   window.__ui01StableButton=probe;
  });

  const box=await back.boundingBox();
  expect(box).not.toBeNull();
  let pressed=false;
  try{
   await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
   await page.mouse.down();
   pressed=true;

   // Exercise the real navigation updater across frames while pressed.
   await page.evaluate(()=>{
    const probe=window.__ui01StableButton;
    const update=()=>{
     TPAppMenu.drawDexBack();
     probe.frames++;
     if(probe.frames<8)requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
   });
   await expect.poll(()=>page.evaluate(()=>
    window.__ui01StableButton.frames
   )).toBe(8);

   const stability=await page.evaluate(()=>{
    const probe=window.__ui01StableButton;
    probe.observer.disconnect();
    return {
     mutations:probe.mutations,
     sameTextNode:probe.button.firstChild===probe.label,
     connected:probe.button.isConnected,
     enabled:!probe.button.disabled
    };
   });
   expect(stability).toEqual({
    mutations:0,sameTextNode:true,connected:true,enabled:true
   });

   await page.mouse.up();
   pressed=false;
   await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
   await expect(back).toBeHidden();
  }finally{
   if(pressed)await page.mouse.up().catch(()=>{});
   await page.evaluate(()=>{
    window.__ui01StableButton?.observer?.disconnect();
   }).catch(()=>{});
  }
 });


test('UI01 Pokédex: Detail-Zurueck erhaelt Rasterseite und Filter',
 async({page})=>{
  await H.openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{
   name:await H.uiText(page,'menu.dex'),exact:true
  }).click();

  await expect.poll(()=>page.evaluate(()=>screen)).toBe('dex');

  // Existing raised filter, followed by the second populated raster page.
  {const p=await page.evaluate(()=>hubDexLayout().filters[1]);await H.tap(page,p.x+p.w/2,p.y+p.h/2);}
  await expect.poll(()=>page.evaluate(()=>dexFilter)).toBe(1);
  {const p=await page.evaluate(()=>hubDexLayout().next);await H.tap(page,p.x+p.w/2,p.y+p.h/2);}
  await expect.poll(()=>page.evaluate(()=>dexPage)).toBe(1);

  const before=await page.evaluate(()=>({
   page:dexPage,filter:dexFilter,
   ids:dexGridSnapshot().ids,
   raised:fns.registeredCount(),caught:fns.caughtCount()
  }));
  expect(before.ids.length).toBeGreaterThan(16);

  {const p=await page.evaluate(()=>hubDexLayout().cells[0]);await H.tap(page,p.x+p.w/2,p.y+p.h/2);}
  await expect.poll(()=>page.evaluate(()=>dexScreen)).toBe('detail');
  expect(await page.evaluate(()=>dexDetailDex))
   .toBe(before.ids[before.page*16]);

  await page.locator('#tp-dex-back').click();
  await expect.poll(()=>page.evaluate(()=>({
   screen,dexScreen,page:dexPage,filter:dexFilter
  }))).toEqual({
   screen:'dex',dexScreen:'grid',
   page:before.page,filter:before.filter
  });
  await expect(page.locator('#tp-app-page')).toBeHidden();

  expect(await page.evaluate(()=>({
   ids:dexGridSnapshot().ids,
   raised:fns.registeredCount(),caught:fns.caughtCount()
  }))).toEqual({
   ids:before.ids,raised:before.raised,caught:before.caught
  });

  await page.locator('#tp-dex-back').click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
 });


for(const width of [320,390,430]){
 test('UI01 Pokédex: Gehaeuse und Titelposition bei '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.openHub(page);
  const title=page.locator('#tp-app-page > .tp-app-head h2');
  const reference=await title.boundingBox();
  await page.locator('#tp-app-page').getByRole('button',{
   name:await H.uiText(page,'menu.dex'),exact:true
  }).click();
  const dexTitle=page.locator('#tp-dex-title');
  await expect(dexTitle).toBeVisible();
  await expect(dexTitle).toHaveText(await H.uiText(page,'menu.dex'));
  const actual=await dexTitle.boundingBox();
  expect(Math.abs(actual.x+actual.width/2-reference.x-reference.width/2))
   .toBeLessThan(1);
  expect(Math.abs(actual.y+actual.height/2-reference.y-reference.height/2))
   .toBeLessThan(1);

  const colours=await page.evaluate(()=>{
   drawDexGrid();
   const g=hubDexLayout();
   const pixel=(x,y)=>Array.from(ctx.getImageData(
    Math.floor(x),Math.floor(y),1,1
   ).data).slice(0,3);
   return {
    shell:pixel(6*g.u,60*g.u),
    display:pixel(g.panel.x+3*g.u,g.panel.y+g.panel.h/2)
   };
  });
  expect(colours).toEqual({
   shell:[168,58,67],display:[203,220,226]
  });

  const p=await page.evaluate(()=>hubDexLayout().cells[0]);
  await H.tap(page,p.x+p.w/2,p.y+p.h/2);
  await expect.poll(()=>page.evaluate(()=>dexScreen)).toBe('detail');
  await expect(dexTitle).toBeVisible();
  await page.locator('#tp-dex-back').click();
  await expect.poll(()=>page.evaluate(()=>dexScreen)).toBe('grid');
  await page.locator('#tp-dex-back').click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
 });
}


async function ui01PokedexTarget(page,key,index=null){
 const r=await page.evaluate(({key,index})=>{
  const g=hubDexLayout();
  return index===null?g[key]:g[key][index];
 },{key,index});
 expect(r).toBeTruthy();
 await H.tap(page,r.x+r.w/2,r.y+r.h/2);
}
async function ui01OpenPokedex(page){
 await H.openHub(page);
 await page.locator('#tp-app-page').getByRole('button',{
  name:await H.uiText(page,'menu.dex'),exact:true
 }).click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('dex');
}

test('UI01 Pokédex: acht Eintraege je Display und buchartige Reihenfolge',
 async({page})=>{
  await ui01OpenPokedex(page);
  const initial=await page.evaluate(()=>({
   ids:dexGridSnapshot().ids.slice(0,16),
   raised:fns.registeredCount(),caught:fns.caughtCount()
  }));
  expect(initial.ids.length).toBe(16);
  for(const index of [0,7,8,15]){
   const placement=await page.evaluate(index=>{
    const g=hubDexLayout(),r=g.cells[index];
    const display=g.displays[Math.floor(index/8)];
    return {
     inside:r.x>=display.x&&r.x+r.w<=display.x+display.w&&
      r.y>=display.y&&r.y+r.h<=display.y+display.h
    };
   },index);
   expect(placement.inside).toBe(true);
   await ui01PokedexTarget(page,'cells',index);
   await expect.poll(()=>page.evaluate(()=>dexScreen)).toBe('detail');
   expect(await page.evaluate(()=>dexDetailDex)).toBe(initial.ids[index]);
   await page.locator('#tp-dex-back').click();
   await expect.poll(()=>page.evaluate(()=>dexScreen)).toBe('grid');
  }
  expect(await page.evaluate(()=>({
   raised:fns.registeredCount(),caught:fns.caughtCount()
  }))).toEqual({raised:initial.raised,caught:initial.caught});
 });

test('UI01 Pokédex: Detailpfeile erhalten Filter und folgen der Rasterseite',
 async({page})=>{
  await ui01OpenPokedex(page);
  await ui01PokedexTarget(page,'filters',1);
  await expect.poll(()=>page.evaluate(()=>dexFilter)).toBe(1);
  await ui01PokedexTarget(page,'next');
  await expect.poll(()=>page.evaluate(()=>dexPage)).toBe(1);
  const ids=await page.evaluate(()=>dexGridSnapshot().ids);
  expect(ids.length).toBeGreaterThan(17);
  await ui01PokedexTarget(page,'cells',0);
  await expect.poll(()=>page.evaluate(()=>dexDetailDex)).toBe(ids[16]);

  await ui01PokedexTarget(page,'tabs',1);
  await expect.poll(()=>page.evaluate(()=>dexDetailPage)).toBe(1);
  await ui01PokedexTarget(page,'detailNext');
  await expect.poll(()=>page.evaluate(()=>({
   id:dexDetailDex,tab:dexDetailPage
  }))).toEqual({id:ids[17],tab:0});

  await ui01PokedexTarget(page,'detailPrevious');
  await expect.poll(()=>page.evaluate(()=>dexDetailDex)).toBe(ids[16]);
  await ui01PokedexTarget(page,'detailPrevious');
  await expect.poll(()=>page.evaluate(()=>({
   id:dexDetailDex,page:dexPage,filter:dexFilter
  }))).toEqual({id:ids[15],page:0,filter:1});

  await page.locator('#tp-dex-back').click();
  await expect.poll(()=>page.evaluate(()=>({
   view:dexScreen,page:dexPage,filter:dexFilter
  }))).toEqual({view:'grid',page:0,filter:1});
  await page.locator('#tp-dex-back').click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
 });

test('UI01 Pokédex: Detailpfeile springen nicht ueber Listenenden',
 async({page})=>{
  await ui01OpenPokedex(page);
  const counts=await page.evaluate(()=>({
   raised:fns.registeredCount(),caught:fns.caughtCount()
  }));
  await ui01PokedexTarget(page,'cells',0);
  const first=await page.evaluate(()=>dexDetailDex);
  expect(await page.evaluate(()=>hubDexDetailNavigation().canPrevious)).toBe(false);
  await ui01PokedexTarget(page,'detailPrevious');
  expect(await page.evaluate(()=>dexDetailDex)).toBe(first);

  await page.locator('#tp-dex-back').click();
  await ui01PokedexTarget(page,'previous');
  const last=await page.evaluate(()=>dexGridSnapshot().ids.at(-1));
  await ui01PokedexTarget(page,'cells',0);
  await expect.poll(()=>page.evaluate(()=>dexDetailDex)).toBe(last);
  expect(await page.evaluate(()=>hubDexDetailNavigation().canNext)).toBe(false);
  await ui01PokedexTarget(page,'detailNext');
  expect(await page.evaluate(()=>dexDetailDex)).toBe(last);

  await ui01PokedexTarget(page,'detailPrevious');
  await expect.poll(()=>page.evaluate(()=>dexDetailDex)).toBe(last-1);
  expect(await page.evaluate(()=>({
   raised:fns.registeredCount(),caught:fns.caughtCount()
  }))).toEqual(counts);
 });


for(const width of [320,390,430]){
 test('UI01 Pokédex: leerer Gefangen-Filter bleibt im Doppeldisplay bei '+width,
  async({page})=>{
   await page.setViewportSize({width,height:568});
   await ui01OpenPokedex(page);
   const before=await page.evaluate(()=>({
    raised:fns.registeredCount(),caught:fns.caughtCount(),
    active:TPCollection.read().active,
    ids:TPCollection.read().mons.map(m=>m.id)
   }));
   expect(before.caught).toBe(0);

   await ui01PokedexTarget(page,'filters',2);
   await expect.poll(()=>page.evaluate(()=>({
    filter:dexFilter,count:dexGridSnapshot().ids.length
   }))).toEqual({filter:2,count:0});

   const painted=await page.evaluate(()=>{
    const paints=[],original=ctx.fillText;
    ctx.fillText=function(value,x,y,maxWidth){
     paints.push({text:String(value),x,y,maxWidth});
     return original.apply(this,arguments);
    };
    try{drawDexGrid();}finally{ctx.fillText=original;}
    const g=hubDexLayout();
    return {
     sides:g.displays.map(display=>({
      display,
      texts:paints.filter(p=>
       p.x>=display.x&&p.x<=display.x+display.w&&
       p.y>=display.y&&p.y<=display.y+display.h
      )
     })),
     oldMessage:paints.some(p=>p.text==='Keine Treffer'),
     u:g.u
    };
   });

   expect(painted.oldMessage).toBe(false);
   const joined=side=>side.texts.map(p=>p.text).join('').replace(/\s/g,'');
   expect(joined(painted.sides[0])).toBe('KeineEinträge');
   expect(joined(painted.sides[1]))
    .toBe('GefangenePokémonerscheinenhier.');

   for(const side of painted.sides){
    expect(side.texts.length).toBeGreaterThan(0);
    for(const line of side.texts){
     expect(Math.abs(line.x-side.display.x-side.display.w/2))
      .toBeLessThan(1);
     expect(line.maxWidth).toBeLessThanOrEqual(side.display.w-16*painted.u+.01);
    }
   }

   // The empty view must not reset the chosen filter or change ownership.
   expect(await page.evaluate(()=>dexFilter)).toBe(2);
   expect(await page.evaluate(()=>({
    raised:fns.registeredCount(),caught:fns.caughtCount(),
    active:TPCollection.read().active,
    ids:TPCollection.read().mons.map(m=>m.id)
   }))).toEqual(before);

   await ui01PokedexTarget(page,'filters',0);
   await expect.poll(()=>page.evaluate(()=>dexGridSnapshot().ids.length))
    .toBeGreaterThan(0);
   await page.locator('#tp-dex-back').click();
   await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
  });
}


for(const width of [320,390,430]){
 test('UI01 Pokédex: Raster und Detail teilen Gehaeuse und Pfeilpositionen bei '+width,
  async({page})=>{
   await page.setViewportSize({width,height:568});
   await ui01OpenPokedex(page);

   const raster=await page.evaluate(()=>{
    const g=hubDexLayout();
    return {
     panel:g.panel,displays:g.displays,
     previous:g.previous,next:g.next
    };
   });

   await ui01PokedexTarget(page,'cells',0);
   await expect.poll(()=>page.evaluate(()=>dexScreen)).toBe('detail');

   const detail=await page.evaluate(()=>{
    drawDexDetail();
    const g=hubDexLayout();
    const pixel=(x,y)=>Array.from(ctx.getImageData(
     Math.floor(x),Math.floor(y),1,1
    ).data).slice(0,3);
    return {
     panel:g.panel,displays:g.displays,
     previous:g.detailPrevious,next:g.detailNext,
     above:pixel(g.panel.x+3*g.u,g.panel.y-6*g.u),
     below:pixel(g.panel.x+3*g.u,g.panel.y+g.panel.h+3*g.u)
    };
   });

   expect({
    panel:detail.panel,displays:detail.displays,
    previous:detail.previous,next:detail.next
   }).toEqual(raster);

   // The previously enlarged detail display would paint blue here.
   expect(detail.above).toEqual([168,58,67]);
   expect(detail.below).toEqual([168,58,67]);

   const ids=await page.evaluate(()=>dexGridSnapshot().ids);
   expect(ids.length).toBeGreaterThan(1);
   await ui01PokedexTarget(page,'detailNext');
   await expect.poll(()=>page.evaluate(()=>dexDetailDex)).toBe(ids[1]);
   await ui01PokedexTarget(page,'detailPrevious');
   await expect.poll(()=>page.evaluate(()=>dexDetailDex)).toBe(ids[0]);

   await page.locator('#tp-dex-back').click();
   await expect.poll(()=>page.evaluate(()=>dexScreen)).toBe('grid');
   const restored=await page.evaluate(()=>{
    const g=hubDexLayout();
    return {
     panel:g.panel,displays:g.displays,
     previous:g.previous,next:g.next
    };
   });
   expect(restored).toEqual(raster);

   await page.locator('#tp-dex-back').click();
   await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
  });
}


for(const width of [320,390,430])for(const notice of [false,true]){
 test('UI01 Zentrale: gemeinsamer Displayrahmen bei '+width+' Hinweis '+notice,
  async({page})=>{
   await page.setViewportSize({width,height:568});
   if(notice){
    const F=require('./story-fixtures');
    await H.importSave(page,F.withProgress(H.fixture(),{kanto:63}));
   }
   await H.openHub(page);
   const hub=page.locator('#tp-app-page.tp-pokedex-hub');

   async function frameSnapshot(){
    return hub.evaluate(n=>{
     const shell=document.getElementById('tp-game-shell').getBoundingClientRect();
     const g=hubDexLayout();
     const panels=Array.from(n.querySelectorAll('.tp-pokedex-display')).map(el=>{
      const r=el.getBoundingClientRect();
      return {x:r.x-shell.x,y:r.y-shell.y,w:r.width,h:r.height};
     });
     const expected=g.displays.map(r=>({
      x:r.x/g.u,y:r.y/g.u,w:r.w/g.u,h:r.h/g.u
     }));
     const spine=n.querySelector('.tp-pokedex-spine');
     const bridge=spine.getBoundingClientRect();
     const style=getComputedStyle(spine);
     const shine=getComputedStyle(spine,'::before');
     return {
      panels,expected,
      spine:{
       x:bridge.x-shell.x,y:bridge.y-shell.y,
       w:bridge.width,h:bridge.height,
       colour:style.backgroundColor,shine:shine.backgroundColor
      }
     };
    });
   }

   async function verify(){
    const snapshot=await frameSnapshot();
    expect(snapshot.panels).toHaveLength(2);
    for(let i=0;i<2;i++)for(const key of ['x','y','w','h'])
     expect(Math.abs(snapshot.panels[i][key]-snapshot.expected[i][key]))
      .toBeLessThan(1);
    expect(snapshot.spine.w).toBeCloseTo(6,0);
    expect(snapshot.spine.colour).toBe('rgb(114, 48, 57)');
    expect(snapshot.spine.shine).toBe('rgb(200, 107, 114)');

    await expect(hub.locator('.tp-app-grid button')).toHaveCount(6);
    await expect.poll(()=>hub.evaluate(n=>{
     const outer=n.getBoundingClientRect();
     const buttons=Array.from(n.querySelectorAll('button'));
     const overlap=(a,b)=>
      Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&
      Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5;
     return n.scrollHeight<=n.clientHeight+1&&
      n.scrollWidth<=n.clientWidth+1&&
      buttons.every(button=>{
       const r=button.getBoundingClientRect();
       return r.width>=44&&r.height>=44&&
        button.scrollWidth<=button.clientWidth+1&&
        button.scrollHeight<=button.clientHeight+1&&
        r.left>=outer.left&&r.right<=outer.right&&
        r.top>=outer.top&&r.bottom<=outer.bottom;
      })&&buttons.every((a,i)=>
       buttons.slice(i+1).every(b=>
        !overlap(a.getBoundingClientRect(),b.getBoundingClientRect())
       )
      );
    })).toBe(true);
    return snapshot.panels;
   }

   const initial=await verify();
   const hint=page.locator('#tp-story-unlock');
   if(notice){
    const button=hint.getByRole('button',{
     name:'In deinem Pokédex ist eine neue Geschichte verfügbar.',exact:true
    });
    await expect(button).toBeVisible();
    await page.evaluate(()=>{
     window.__hubNoticeWrite=writeSave;
     writeSave=async()=>{throw Error('UI01 notice layout quota');};
    });
    try{
     await button.click();
     await expect(hint.locator('.tp-story-info-text'))
      .toHaveText('Speichern fehlgeschlagen. Erneut tippen.');
     expect(await verify()).toEqual(initial);
    }finally{
     await page.evaluate(()=>{writeSave=window.__hubNoticeWrite;});
    }
    await button.click();
    await expect(page.locator('#tp-stories-page')).toBeVisible();
    await page.locator('#tp-app-page > .tp-app-head')
     .getByRole('button',{name:'Zurück',exact:true}).click();
    await expect(hub).toBeVisible();
    await expect(hint).toBeEmpty();
    expect(await verify()).toEqual(initial);
   }else{
    await expect(hint).toBeEmpty();
   }
  });
}
