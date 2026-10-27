 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const pageRoot=page=>page.locator('#tp-zapdos-page');
const admission=page=>page.locator('#tp-admission-page');
async function openStory(page){
 await H.game(page);
 await page.evaluate(()=>TPCollectionGame.ensureCurrent());
 await H.openMenu(page);
 await page.getByRole('button',{name:'Geschichten',exact:true}).click();
 await expect(pageRoot(page)).toBeVisible();
}
async function prepare(page){
 await openStory(page);
 await pageRoot(page).getByRole('button',{name:'Störungen untersuchen',exact:true}).click();
 await pageRoot(page).getByRole('button',{name:'Anlage sichern',exact:true}).click();
 await expect(pageRoot(page).getByRole('button',{name:'Prüfduell beginnen',exact:true}))
  .toBeEnabled();
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
 return Buffer.concat([count,...fields]);
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
test.beforeEach(async({page})=>{await H.prepare(page);});
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
 await pageRoot(page).getByRole('button',{name:'Störungen untersuchen',exact:true}).click();
 await expect(pageRoot(page).getByText('Speichern fehlgeschlagen. Bitte erneut versuchen.',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(0);
 await page.evaluate(()=>{writeSave=window.__zWrite;});
 await pageRoot(page).getByRole('button',{name:'Störungen untersuchen',exact:true}).click();
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
 await page.reload();await H.waitReady(page);await openStory(page);
 await expect(pageRoot(page).getByRole('heading',{name:'Kraftwerk-Abenteuer abgeschlossen',exact:true})).toBeVisible();
 await expect(pageRoot(page).getByRole('button',{name:'Prüfduell beginnen',exact:true})).toHaveCount(0);
});
test('P06 Zapdos: full team uses pinned-care replacement and retains outgoing individual',async({page})=>{
 await strong(page);const before=await fill(page,5);await prepare(page);
 await begin(page);await fight(page);await saved(page);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);
 await H.battleAction(page,'ok');await expect(admission(page)).toBeVisible();
 await admission(page).getByRole('button',{name:'Ins Team aufnehmen',exact:true}).click();
 await expect(admission(page).getByRole('button',{name:/Pflege-Pokémon — fest/})).toBeDisabled();
 await admission(page).getByRole('button',{name:/^Fixture 0 ·/}).click();
 await expect.poll(()=>page.evaluate(()=>TPCollection.busy?'busy':TPZapdos.view().phase)).toBe('complete');
 const after=await page.evaluate(()=>TPCollection.read());
 expect(after.active).toBe(before.active);
 expect(after.team[1]).toBe(after.nextId-1);
 expect(after.mons.some(m=>m.id===before.team[1])).toBe(true);
});
test('P06 Zapdos: full boxes retain won trial across reload and release permits box admission',async({page})=>{
 test.setTimeout(120000);
 await strong(page);await fill(page,200);await prepare(page);
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
