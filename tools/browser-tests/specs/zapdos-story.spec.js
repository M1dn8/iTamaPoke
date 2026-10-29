 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./story-fixtures');
const pageRoot=page=>page.locator('#tp-zapdos-page');
const admission=page=>page.locator('#tp-admission-page');
async function zapdosJournal(page){
 return page.evaluate(()=>{
  const entries=JSON.parse(Module.ccall('tp_journal_json','string',[],[]));
  return {
   joins:entries.filter(entry=>
    entry.k===4&&entry.s===145&&(entry.f&2)
   ),
   unread:JSON.parse(Module.ccall(
    'tp_journal_unread_state','string',[],[]
   ))
  };
 });
}
async function expectSavedStoryFinale(page){
 const finale=pageRoot(page).locator('.tp-zapdos-finale-art');
 await expect(finale).toBeVisible();
 await expect(pageRoot(page).getByRole('heading',{
  name:'Kraftwerk-Abenteuer abgeschlossen',exact:true
 })).toBeVisible();

 const before=await page.evaluate(()=>{
  const s=TPCollection.read();
  return {
   ids:s.mons.map(mon=>mon.id),team:s.team,active:s.active,
   pending:TPAdmission.read().pending
  };
 });
 expect(before.pending).toBeNull();
 await expect(finale).toHaveAttribute('data-capture','playing');
 await expect(finale).toHaveAttribute('data-capture','done',{
  timeout:11000
 });
 await expect(finale.locator('.tp-zapdos-finale-caption'))
  .toHaveText('Zapdos wurde aufgenommen!');
 expect(await page.evaluate(()=>{
  const s=TPCollection.read();
  return {
   ids:s.mons.map(mon=>mon.id),team:s.team,active:s.active,
   pending:TPAdmission.read().pending
  };
 })).toEqual(before);
}
async function completedCatalogue(page){
 await H.openStories(page);
 await expect(page.locator('#tp-stories-page')).toBeVisible();
 const tile=page.locator('#tp-stories-page button[data-story="zapdos"]');
 await expect(tile).toBeDisabled();
 await expect(tile).toHaveAttribute('data-complete','true');
 await expect(tile).toContainText('Abgeschlossen');
 await expect(tile).toHaveCSS('opacity','0.65');
 await expect(tile.locator('.tp-story-open-dot')).toHaveCount(0);
 expect(await page.evaluate(()=>TPZapdos.view().phase)).toBe('complete');
}
async function openStory(page){
 await H.game(page);
 await page.evaluate(()=>TPCollectionGame.ensureCurrent());
 await H.openStories(page);
 await expect(page.locator('#tp-stories-page')).toBeVisible();
 await page.locator('#tp-stories-page').getByRole('button',{name:/^Kraftwerk/}).click();
 await expect(pageRoot(page)).toBeVisible();
}
async function prepare(page){
 await openStory(page);
 await pageRoot(page).getByRole('button',{name:'Fortsetzen',exact:true}).click();
 for(let i=0;i<10;i++)
  await pageRoot(page).getByRole('button',{
   name:'Anlage sichern',exact:true
  }).click();
 try{
  await expect(pageRoot(page).getByRole('button',{
   name:'Prüfduell beginnen',exact:true
  })).toBeEnabled();
 }catch(error){
  const diagnostic=await page.evaluate(()=>({
   screen,visibility:document.visibilityState,
   focused:document.hasFocus(),
   guard:TPZapdosUI.encounterGuardState,
   step:TPZapdos.read().step,
   collectionBusy:TPCollection.busy,
   collectionBlocked:TPCollection.blocked,
   storyBusy:TPZapdosUI.busy,
   gate:tpSaveReplacing,
   tapReady:document.querySelector(
    '#tp-zapdos-page .tp-zapdos-challenge'
   )?.dataset.tapReady
  })).catch(cause=>({diagnosticError:cause.message}));
  await test.info().attach('zapdos-encounter-guard-state',{
   body:Buffer.from(JSON.stringify(diagnostic,null,2)),
   contentType:'application/json'
  });
  throw error;
 }
}
async function begin(page){
 await pageRoot(page).getByRole('button',{name:'Prüfduell beginnen',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.mode)).toBe('zapdos');
 expect(await page.evaluate(()=>fns.battleWildDex())).toBe(145);
 expect(await page.evaluate(()=>Module.ccall(
  'tp_battle_wild_level','number',[],[]
 ))).toBe(50);
 expect(await page.evaluate(()=>TPBattleView.target('catch'))).toBe(null);
}
async function fight(page){
 for(let i=0;i<40;i++){
  if(await page.evaluate(()=>!!fns.battleResolved()))break;
  await H.battleAction(page,'quick');
 }
 expect(await page.evaluate(()=>!!fns.battleResolved())).toBe(true);
}
async function saved(page){
 await expect.poll(()=>page.evaluate(()=>Module.ccall(
  'tp_zpd_get','number',['number'],[2]
 ))).toBe(1);
 await expect.poll(()=>page.evaluate(()=>!TPCollection.busy&&!tpSaveReplacing))
  .toBe(true);
}
function strongFixture(){
 const b=H.fixture(),fields=[];let p=4;
 for(let i=0;i<b.readUInt32LE(0);i++){
  const n=b[p++],key=b.toString('utf8',p,p+n);p+=n;
  const type=b[p++],size=b.readUInt32LE(p);p+=4;
  const value=Buffer.from(b.subarray(p,p+size));p+=size;
  if(key==='dexn')value.writeBigInt64LE(376n);
  if(key==='age')value.writeBigInt64LE(5940n);
  if(['gatk','gdef','gspe'].includes(key))value.writeBigInt64LE(110n);
  if(['full','joy','ene','hyg','bond'].includes(key))value.writeBigInt64LE(100n);
  const k=Buffer.from(key),len=Buffer.alloc(4);len.writeUInt32LE(value.length);
  fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),len,value]));
 }
 for(const key of ['tatk','tdef','tspe']){
  const k=Buffer.from(key),len=Buffer.alloc(4),v=Buffer.alloc(8);
  len.writeUInt32LE(8);v.writeBigInt64LE(100n);
  fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([1]),len,v]));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.length);
 return F.withProgress(Buffer.concat([count,...fields]),{kanto:63,notice:1});
}
async function strong(page){
 await H.openMenu(page);
 await page.getByRole('button',{name:'Sicherungen',exact:true}).click();
 const panel=H.modal(page);
 await panel.locator('input[type=file]').setInputFiles({
  name:'Zapdos-test.tpsave',mimeType:'application/octet-stream',buffer:strongFixture()
 });
 const apply=panel.getByRole('button',{name:'Importieren und aktuellen Stand ersetzen',exact:true});
 page.once('dialog',d=>d.accept());
 await Promise.all([page.waitForEvent('load'),apply.click()]);
 await H.waitReady(page);
}
async function fill(page,count){
 await H.game(page);await page.evaluate(()=>TPCollectionGame.ensureCurrent());
 return page.evaluate(async count=>{
  let s=TPCollection.read();
  while(TPCollectionModel.summary(s).stored<count){
   const index=TPCollectionModel.summary(s).stored;
   s=TPCollectionModel.catchWild(s,{
    dex:25,level:20,nickname:'Fixture '+index,shiny:false,origin:'wild',
    data:{stats:{atk:50,def:50,spe:50}}
   });
   if(s.team.length<6)s=TPCollectionModel.selectTeam(s,s.nextId-1);
  }
  const token=Module.ccall('tp_f4_store_begin','number',[],[]);
  if(!token)throw Error('Fixture begin refused');
  const previous=choice;choice='zapdos-fixture';
  tpSaveReplacing=true;tpSaveEpoch++;let durable=false;
  try{
   const bytes=new TextEncoder().encode(TPCollectionModel.encode(s));
   const ptr=Module._malloc(bytes.length);
   try{
    Module.HEAPU8.set(bytes,ptr);
    if(Module.ccall('tp_f4_store_stage','number',
     ['number','number','number'],[token,ptr,bytes.length])!==1)
     throw Error('Fixture stage refused');
   }finally{Module._free(ptr);}
   const save=exportStateBytes(Module);TPStoreTools.parseLegacy(save);
   if(await writeSave(save,true)!==true)throw Error('Fixture write refused');
   durable=true;
   if(Module.ccall('tp_f4_store_finish','number',
    ['number','number'],[token,1])!==1)throw Error('Fixture finish refused');
  }catch(error){
   if(!durable)Module.ccall('tp_f4_store_finish','number',
    ['number','number'],[token,0]);
   throw error;
  }finally{tpSaveEpoch++;tpSaveReplacing=false;choice=previous;}
  return {team:s.team,active:s.active,count:s.mons.length};
 },count);
}
test.beforeEach(async({page})=>{
 await H.prepare(page,F.withProgress(H.fixture(),{kanto:63,notice:1}));
});
test('P06 Zapdos: ordered preparation persists and story labels use four locales',async({page})=>{
 await prepare(page);
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(2);
 await page.reload();await H.waitReady(page);await openStory(page);
 await expect(pageRoot(page).getByRole('button',{name:'Prüfduell beginnen',exact:true})).toBeEnabled();
 for(const [code,title] of [[0,'Kanto · Central de Energía'],[1,'Kanto · Power Plant'],
  [2,'Kanto · Centrale'],[3,'Kanto · Kraftwerk']]){
  await page.evaluate(code=>{
   Module.ccall('tp_set_language',null,['number'],[code]);
   TPAppMenu.show('zapdos');
  },code);
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
 }
});
test('P06 Zapdos: rejected preparation write remains retryable',async({page})=>{
 await openStory(page);
 await page.evaluate(()=>{
  window.__zWrite=writeSave;writeSave=async()=>{throw Error('intentional quota');};
 });
 await pageRoot(page).getByRole('button',{name:'Fortsetzen',exact:true}).click();
 await expect(pageRoot(page).getByText('Speichern fehlgeschlagen. Bitte erneut versuchen.',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(0);
 await page.evaluate(()=>{writeSave=window.__zWrite;});
 await pageRoot(page).getByRole('button',{name:'Fortsetzen',exact:true}).click();
 await expect(pageRoot(page).getByRole('button',{name:'Anlage sichern',exact:true})).toBeEnabled();
});
test('P06 Zapdos: actual victory, automatic admission and completion survive reload',async({page})=>{
 await strong(page);await prepare(page);
 const before=await page.evaluate(()=>TPCollection.read().mons.length);
 await begin(page);await fight(page);await saved(page);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(3);
 expect(await page.evaluate(()=>!!TPAdmission.read().pending)).toBe(true);
 expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(before);
 expect(await page.evaluate(()=>TPBattleView.target('catch'))).toBe(null);
 await H.battleAction(page,'ok');
 await expect(pageRoot(page).getByRole('heading',{name:'Kraftwerk-Abenteuer abgeschlossen',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
 expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(before+1);
 await H.openHub(page);
 await expect(page.locator(
  '#tp-app-page button[data-hub="stories"] .tp-hub-count'
 )).toHaveText('1');
 expect(await page.evaluate(()=>TPArktos.read().step)).toBe(0);
 await page.locator('#tp-app-page').getByRole('button',{
  name:'Geschichten',exact:true
 }).click();
 await expect(page.locator('#tp-stories-page')).toBeVisible();
 const arktosTile=page.locator(
  '#tp-stories-page button[data-story="articuno"]'
 );
 await expect(arktosTile).toBeEnabled();
 await expect(arktosTile).toHaveAttribute('data-complete','false');
 await expect(arktosTile.locator('.tp-story-open-dot')).toHaveCount(1);
 await expect(page.locator(
  '#tp-stories-page button[data-story="zapdos"] .tp-story-open-dot'
 )).toHaveCount(0);
 await page.reload();await H.waitReady(page);await H.openHub(page);
 await expect(page.locator(
  '#tp-app-page button[data-hub="stories"] .tp-hub-count'
 )).toHaveText('1');
 expect(await page.evaluate(()=>TPArktos.read().step)).toBe(0);
 await completedCatalogue(page);
});
test('P06 Zapdos: full team uses pinned-care replacement and retains outgoing individual',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await strong(page);await seedFinaleSprite(page);const before=await fill(page,5);await prepare(page);
 await begin(page);await fight(page);await saved(page);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);
 await H.battleAction(page,'ok');await expect(admission(page)).toBeVisible();
 await admission(page).getByRole('button',{name:'Ins Team aufnehmen',exact:true}).click();
 await expect(admission(page).getByRole('button',{name:/Pflege-Pokémon — fest/})).toBeDisabled();
 await admission(page).getByRole('button',{name:/^Fixture 0 ·/}).click();
 await expect.poll(()=>page.evaluate(()=>TPCollection.busy?'busy':TPZapdos.view().phase)).toBe('complete');
 await expectSavedStoryFinale(page);
  expect((await zapdosJournal(page)).joins).toHaveLength(1);
 const after=await page.evaluate(()=>TPCollection.read());
 expect(after.active).toBe(before.active);
 expect(after.team[1]).toBe(after.nextId-1);
 expect(after.mons.some(m=>m.id===before.team[1])).toBe(true);
});
test('P06 Zapdos: full boxes retain won trial across reload and release permits box admission',async({page})=>{
 test.setTimeout(120000);
 await page.emulateMedia({reducedMotion:'no-preference'});
 await strong(page);await seedFinaleSprite(page);await fill(page,200);await prepare(page);
 await begin(page);await fight(page);await saved(page);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);
 await H.battleAction(page,'ok');
 await expect(admission(page).getByText(/Alle Boxen sind voll/)).toBeVisible();
 await page.reload();await H.waitReady(page);await H.game(page);
 await expect(admission(page)).toBeVisible();
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(3);
 expect(await page.evaluate(()=>Module.ccall('tp_zpd_get','number',['number'],[0]))).toBe(0);
 await admission(page).getByRole('button',{name:'Boxen öffnen',exact:true}).click();
 const boxes=page.locator('#tp-box-page');await expect(boxes).toBeVisible();
 await boxes.locator('.tp-box-tile').last().click();
 await boxes.getByRole('button',{name:'Endgueltig freilassen',exact:true}).click();
 await boxes.getByRole('button',{name:'Dieses Exemplar endgueltig freilassen',exact:true}).click();
 await expect(boxes.getByText('Gespeichert.',{exact:true})).toBeVisible();
 await boxes.getByRole('button',{name:'Wartendes Pokémon aufnehmen',exact:true}).click();
 await admission(page).getByRole('button',{name:'In einer Box ablegen',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>TPCollection.busy?'busy':TPZapdos.view().phase)).toBe('complete');
 await expectSavedStoryFinale(page);
  expect((await zapdosJournal(page)).joins).toHaveLength(1);
 expect(await page.evaluate(()=>TPCollectionModel.summary(TPCollection.read()).stored)).toBe(200);
});
test('P06 Zapdos: result quota failure retries same battle without second victory',async({page})=>{
 await strong(page);await prepare(page);await begin(page);
 const before=await page.evaluate(()=>({
  id:Module.ccall('tp_zpd_get','number',['number'],[4]),
  wins:TPStoreTools.parseLegacy(exportStateBytes(Module)).values.get('bwin').value
 }));
 await page.evaluate(()=>{
  window.__zResultWrite=writeSave;
  writeSave=async(bytes,force=false)=>{
   if(force&&Module.ccall('tp_zpd_get','number',['number'],[1]))
    throw Error('intentional result quota');
   return window.__zResultWrite(bytes,force);
  };
 });
 await fight(page);
 await expect.poll(()=>page.evaluate(()=>TPZapdosUI.error)).toBe('Speichern fehlgeschlagen. Bitte erneut versuchen.');
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(2);
 expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
 expect(await page.evaluate(()=>TPBattleView.target('ok'))).toBe(null);
 await page.evaluate(()=>{writeSave=window.__zResultWrite;});
 await H.battleAction(page,'resultRetry');await saved(page);
 expect(await page.evaluate(()=>Module.ccall('tp_zpd_get','number',['number'],[4]))).toBe(before.id);
 expect(await page.evaluate(()=>TPStoreTools.parseLegacy(exportStateBytes(Module)).values.get('bwin').value)).toBe(before.wins+1);
 await H.battleAction(page,'ok');
 await expect(pageRoot(page).getByRole('heading',{name:'Kraftwerk-Abenteuer abgeschlossen',exact:true})).toBeVisible();
});
test('P06 Zapdos: abort and actual loss leave preparation without admission',async({page})=>{
 await prepare(page);await begin(page);
 await H.battleAction(page,'abort');
 await expect(pageRoot(page)).toBeVisible();
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(2);
 expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
 await begin(page);await fight(page);await saved(page);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(false);
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(2);
 expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
 await H.battleAction(page,'ok');
 await expect(pageRoot(page).getByRole('button',{name:'Prüfduell beginnen',exact:true})).toBeEnabled();
});

async function seedFinaleSprite(page){
 // Synthetic test square; not Pokemon artwork.
 const width=24,height=24;
 const bytes=Buffer.alloc(15+width*height);
 bytes.write('TPK2',0,'ascii');
 bytes[4]=1;bytes.writeUInt16LE(1,5);
 bytes.writeUInt16LE(0xf800,7);
 bytes.set([0,width,height,1],9);
 bytes.writeUInt16LE(120,13);
 await page.evaluate(async raw=>{
  const db=await openAssetDb();
  await new Promise((resolve,reject)=>{
   const tx=db.transaction(ASSET_STORE,'readwrite');
   tx.objectStore(ASSET_STORE).put(
    new Uint8Array(raw).buffer,'p145.bin'
   );
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error);
   tx.onabort=()=>reject(tx.error||Error('fixture transaction aborted'));
  });
 },Array.from(bytes));
}
for(const reduced of [false,true])
 test('P06 Zapdos: gespeicherte Aufnahme zeigt rein visuelles Finale – '+(reduced?'reduziert':'animiert'),async({page})=>{
  await page.setViewportSize({width:reduced?390:320,height:568});
  await page.emulateMedia({
   reducedMotion:reduced?'reduce':'no-preference'
  });
  await strong(page);await seedFinaleSprite(page);await prepare(page);
  const before=await page.evaluate(()=>TPCollection.read().mons.length);
  await begin(page);await fight(page);await saved(page);
  expect(await page.evaluate(()=>TPZapdosUI.headline)).toBe('Du bist würdig!');
  expect(await page.evaluate(()=>TPZapdosUI.reward))
   .toBe('Zapdos möchte sich dir anschließen.');
  await H.battleAction(page,'ok');

  const finale=pageRoot(page).locator('.tp-zapdos-finale-art');
  await expect(finale).toBeVisible();
  await expect(pageRoot(page).getByRole('heading',{
   name:'Kraftwerk-Abenteuer abgeschlossen',exact:true
  })).toBeVisible();

  const admitted=await page.evaluate(()=>{
   const s=TPCollection.read();
   return {
    ids:s.mons.map(mon=>mon.id),
    active:s.active,
    count:s.mons.length,
    zapdos:s.mons.filter(mon=>mon.dex===145).length,
    pending:TPAdmission.read().pending
   };
  });
  expect(admitted.count).toBe(before+1);
  expect(admitted.zapdos).toBe(1);
  expect(admitted.pending).toBeNull();

  if(!reduced)
   await expect(finale).toHaveAttribute('data-capture','playing');
  await expect(finale).toHaveAttribute('data-capture','done',{
   timeout:11000
  });
  await expect(finale.locator('.tp-zapdos-finale-caption'))
   .toHaveText('Zapdos wurde aufgenommen!');
  expect(await page.evaluate(()=>{
   const s=TPCollection.read();
   return {
    ids:s.mons.map(mon=>mon.id),
    active:s.active,
    count:s.mons.length,
    zapdos:s.mons.filter(mon=>mon.dex===145).length,
    pending:TPAdmission.read().pending
   };
  })).toEqual(admitted);

  await expect(pageRoot(page).getByRole('button',{
   name:'Abschließen',exact:true
  })).toHaveCount(0);
  const layout=await pageRoot(page).evaluate(node=>{
   const outer=node.getBoundingClientRect();
   const texts=[...node.querySelectorAll(
    ':scope > h3, :scope > p, .tp-zapdos-finale-caption, .tp-zapdos-finale-note'
   )].filter(item=>getComputedStyle(item).display!=='none');
   return {
    noScroll:node.scrollHeight<=node.clientHeight+1,
    noHorizontalScroll:node.scrollWidth<=node.clientWidth+1,
    textsInside:texts.every(item=>{
     const box=item.getBoundingClientRect();
     return box.top>=outer.top-1&&box.bottom<=outer.bottom+1;
    })
   };
  });
  expect(layout).toEqual({
   noScroll:true,noHorizontalScroll:true,textsInside:true
  });
  await page.locator('#tp-app-page > .tp-app-head')
   .getByRole('button').click();
  await expect(page.locator('#tp-stories-page')).toBeVisible();

  await page.reload();await H.waitReady(page);await completedCatalogue(page);
  expect(await page.evaluate(()=>TPCollection.read().mons.length))
   .toBe(before+1);
  expect(await page.evaluate(()=>
   TPCollection.read().mons.filter(mon=>mon.dex===145).length
  )).toBe(1);
  await expect(pageRoot(page).getByRole('button',{
   name:'Prüfduell beginnen',exact:true
  })).toHaveCount(0);
 });

test('P06 Zapdos: Anschluss-Tagebuch wird atomar gespeichert und nicht dupliziert',async({page})=>{
 await strong(page);await prepare(page);
 await begin(page);await fight(page);await saved(page);

 // Winning reserves admission, but is not yet the completed admission.
 const waiting=await zapdosJournal(page);
 expect(waiting.joins).toHaveLength(0);
 expect(await page.evaluate(()=>!!TPAdmission.read().pending)).toBe(true);

 await page.evaluate(()=>{
  window.__legendaryJournalWrite=writeSave;
  writeSave=async()=>{throw Error('intentional admission journal quota');};
 });
 await H.battleAction(page,'ok');
 await expect(pageRoot(page).getByText(
  'Speichern fehlgeschlagen. Bitte erneut versuchen.',{exact:true}
 )).toBeVisible();

 const failed=await zapdosJournal(page);
 expect(failed.joins).toHaveLength(0);
 expect(failed.unread).toEqual(waiting.unread);
 expect(await page.evaluate(()=>!!TPAdmission.read().pending)).toBe(true);
 expect(await page.evaluate(()=>TPZapdos.view().phase)).toBe('waiting');

 await page.evaluate(()=>{writeSave=window.__legendaryJournalWrite;});
 // Exercise the actual admission controller and native transaction.
 await page.evaluate(()=>TPAdmission.complete({mode:'auto'}));
 const completed=await zapdosJournal(page);
 expect(completed.joins).toHaveLength(1);
 expect(completed.unread.total).toBe(waiting.unread.total+1);
 expect(completed.unread.seen).toBe(waiting.unread.seen);
 expect(completed.unread.unread).toBe(waiting.unread.unread+1);
 expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);

 const duplicate=await page.evaluate(async()=>{
  try{
   await TPAdmission.complete({mode:'auto'});
   return 'UNEXPECTED_SUCCESS';
  }catch(error){return error.code;}
 });
 expect(duplicate).toBe('NO_PENDING_ADMISSION');
 expect((await zapdosJournal(page)).joins).toHaveLength(1);

 await H.openHub(page);
 await expect(page.locator(
  '#tp-app-page button[data-hub="journal"] .tp-hub-count'
 )).toHaveText(String(completed.unread.unread));
 await page.locator('#tp-app-page').getByRole('button',{
  name:'Tagebuch',exact:true
 }).click();
 await expect(page.locator('#tp-app-page .tp-app-list')).toContainText(
  'Das legendäre Pokémon Zapdos hat sich dir angeschlossen.'
 );
 await expect.poll(()=>page.evaluate(()=>TPJournalUnread.read().unread))
  .toBe(0);

 await page.reload();await H.waitReady(page);
 await completedCatalogue(page);
 expect((await zapdosJournal(page)).joins).toHaveLength(1);
 expect(await page.evaluate(()=>
  TPCollection.read().mons.filter(mon=>mon.dex===145).length
 )).toBe(1);
});
