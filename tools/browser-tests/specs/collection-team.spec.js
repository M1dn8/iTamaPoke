// UI01 release profile cleanup: current team UI and durable rollback.
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

async function seed(page,count){
 await H.game(page);
 return page.evaluate(async count=>{
  await TPCollectionGame.ensureCurrent();
  const care=TPCollection.read().active,ids=[];
  for(let i=0;i<count;i++){
   await TPCollection.apply('catchWild',{
    dex:25,level:17,nickname:'Release-'+i,shiny:false,origin:'wild',
    data:{stats:{atk:42,def:31,spe:60},genes:null,training:null}
   },0);
   ids.push(TPCollection.read().nextId-1);
  }
  return {care,ids};
 },count);
}
async function candidate(page,id){
 const root=page.locator('#tp-box-page');
 if(!await root.isVisible()){
  await H.openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{name:'Boxen',exact:true}).click();
 }
 await expect(root).toBeVisible();
 await root.getByRole('button',{name:/^Teamplanung /}).click();
 const empty=root.locator('.tp-box-column-right .tp-box-empty:visible').first();
 await expect(empty).toBeVisible();await empty.click();
 const pick=root.locator('.tp-box-column-right [data-mon-id="'+id+'"]:visible');
 await expect(pick).toHaveCount(1);await pick.click();
 await expect(root.getByRole('button',{name:'Ins Team',exact:true})).toBeVisible();
 return root;
}
async function team(page,expected){
 await expect.poll(()=>page.evaluate(()=>TPCollection.read().team)).toEqual(expected);
}
async function snapshot(page){
 return page.evaluate(async()=>{
  const size=Module.ccall('tp_f4_store_size','number',[],[]);
  const ptr=Module.ccall('tp_f4_store_ptr','number',[],[]);
  const raw=new Uint8Array(await loadSave());
  const field=TPStoreTools.parseLegacy(raw).values.get('f4col');
  return {
   model:TPCollectionModel.encode(TPCollection.read()),
   native:Array.from(Module.HEAPU8.slice(ptr,ptr+size)),
   disk:field?{type:field.type,value:typeof field.value==='string'?field.value:Array.from(field.value)}:null
  };
 });
}
test.beforeEach(async({page})=>{await H.prepare(page);});

test('UI01 Release-Team: fünf UI-Zuweisungen, Schutz und Reload',async({page})=>{
 const {care,ids}=await seed(page,6);
 await team(page,[care]);
 for(let i=0;i<5;i++){
  const root=await candidate(page,ids[i]);
  await root.getByRole('button',{name:'Ins Team',exact:true}).click();
  await team(page,[care,...ids.slice(0,i+1)]);
 }
 const protection=await page.evaluate(async({care,extra})=>{
  const before=TPCollectionModel.encode(TPCollection.read()),codes=[];
  for(const [operation,id]of [['unselectTeam',care],['selectTeam',extra]]){
   try{await TPCollection.apply(operation,id);codes.push(null);}
   catch(error){codes.push(error.code);}
  }
  return {codes,unchanged:before===TPCollectionModel.encode(TPCollection.read())};
 },{care,extra:ids[5]});
 expect(protection).toEqual({
  codes:['CARE_MEMBER_PINNED','TEAM_FULL'],unchanged:true
 });
 await page.reload();await H.waitReady(page);await H.game(page);
 await team(page,[care,...ids.slice(0,5)]);
 expect(await page.evaluate(()=>({
  active:TPCollection.read().active,count:TPCollection.read().mons.length
 }))).toEqual({active:care,count:7});
});

test('UI01 Release-Team: Schreibfehler bleibt rücknehmbar und Wiederholung speichert einmal',async({page})=>{
 const {care,ids}=await seed(page,1);
 let root=await candidate(page,ids[0]);
 const before=await snapshot(page);
 expect(before.disk).not.toBeNull();
 await page.evaluate(()=>{
  window.__releaseTeamWrite=writeSave;
  writeSave=async(bytes,force=false)=>{
   if(force)throw Error('UI01 intentional team quota');
   return window.__releaseTeamWrite(bytes,force);
  };
 });
 try{
  await root.getByRole('button',{name:'Ins Team',exact:true}).click();
  await expect(root.getByText(/Speichern fehlgeschlagen/)).toBeVisible();
  await team(page,[care]);
  expect(await snapshot(page)).toEqual(before);
 }finally{
  await page.evaluate(()=>{writeSave=window.__releaseTeamWrite;});
 }
 root=await candidate(page,ids[0]);
 await root.getByRole('button',{name:'Ins Team',exact:true}).click();
 await team(page,[care,ids[0]]);
 await page.reload();await H.waitReady(page);await H.game(page);
 await team(page,[care,ids[0]]);
 expect(await page.evaluate(()=>({
  active:TPCollection.read().active,count:TPCollection.read().mons.length
 }))).toEqual({active:care,count:2});
});
