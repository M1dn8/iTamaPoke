 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
function strong(){
 const b=H.fixture(0),fields=[];let p=4;
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
async function start(page){
 await H.importSave(page,strong(),376);await H.game(page);
 const a=await H.point(page,233,300),b=await H.point(page,233,110);
 await page.mouse.move(a.x,a.y);await page.mouse.down();
 await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 for(let i=0;i<4;i++)await H.tap(page,350,382);
 await H.tap(page,103,308);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.mode)).toBe('wild');
}
const targets=(page,names)=>page.evaluate(names=>Object.fromEntries(
 names.map(name=>[name,TPBattleView.target(name)])
),names);
test.beforeEach(async({page})=>{await H.prepare(page);});
test('Review controls: four-button grids and healing from the moves page',async({page})=>{
 await start(page);
 await expect.poll(()=>targets(page,['fight','rest','info','abort'])).toEqual({
  fight:{x:137,y:371},rest:{x:329,y:371},
  info:{x:137,y:425},abort:{x:329,y:425}
 });
 await H.battleAction(page,'fight');
 await expect.poll(()=>page.evaluate(()=>TPBattleView.menu)).toBe('moves');
 await expect.poll(()=>targets(page,['quick','dodge','heavy','back','rest'])).toEqual({
  heavy:{x:137,y:371},dodge:{x:329,y:371},
  quick:{x:137,y:425},back:{x:329,y:425},rest:null
 });
 const round=await page.evaluate(()=>fns.battleRound());
 await H.battleAction(page,'rest');
 await expect.poll(()=>page.evaluate(()=>fns.battleRound())).toBeGreaterThan(round);
 await expect.poll(()=>page.evaluate(()=>TPBattleView.menu)).toBe('main');
 await expect.poll(()=>targets(page,['rest','quick'])).toEqual({
  rest:{x:329,y:371},quick:null
 });
});
test('Review controls: shared labels render in four languages',async({page})=>{
 await start(page);
 await page.evaluate(()=>{
  window.__controlPaint=[];
  window.__controlFill=ctx.fillText;
  ctx.fillText=function(value,...args){
   window.__controlPaint.push(String(value));
   if(window.__controlPaint.length>300)window.__controlPaint.splice(0,150);
   return window.__controlFill.call(this,value,...args);
  };
 });
 try{
  for(const [code,fight,heal,giveUp] of [
   [0,'Luchar','Curar','Rendirse'],[1,'Fight','Heal','Give up'],
   [2,'Combat','Soigner','Abandonner'],[3,'Kampf','Heilung','Aufgeben']
  ]){
   await page.evaluate(code=>{
    Module.ccall('tp_set_language',null,['number'],[code]);
    TPText.refresh();window.__controlPaint=[];
   },code);
   await expect.poll(()=>page.evaluate(labels=>{
    const texts=window.__controlPaint;
    return texts.includes(labels[0])&&
     texts.some(t=>t.startsWith(labels[1]+' ('))&&texts.includes(labels[2]);
   },[fight,heal,giveUp])).toBe(true);
  }
 }finally{
  await page.evaluate(()=>{ctx.fillText=window.__controlFill;});
 }
});


test('Review navigation: fifth care button opens the Pokedex hub',async({page})=>{
 await H.importSave(page,strong(),376);
 await H.game(page);
 await page.evaluate(()=>{
  Module.ccall('tp_set_language',null,['number'],[3]);
  TPText.refresh();
 });
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');

 expect(await page.evaluate(()=>BUTTONS.map(b=>({
  label:b.label,x:b.x,y:b.y
 })))).toEqual([
  {label:'FEED',x:81,y:404},
  {label:'PLAY',x:157,y:404},
  {label:'LIGHT',x:233,y:404},
  {label:'CLEAN',x:309,y:404},
  {label:'POKEDEX',x:385,y:404}
 ]);

 await H.tap(page,385,404);
 const root=page.locator('#tp-app-page');
 const hub=()=>expect(root.getByRole('heading',{
  name:'Pokédex-Zentrale',exact:true
 })).toBeVisible();
 const back=()=>root.locator('.tp-app-head')
  .getByRole('button',{name:'Zurück',exact:true}).click();
 await hub();

 await root.getByRole('button',{name:'Tagebuch',exact:true}).click();
 await expect(root.getByRole('heading',{
  name:'Tagebuch',exact:true
 })).toBeVisible();
 await back();
 await hub();

 await root.getByRole('button',{name:'Geschichten',exact:true}).click();
 await expect(page.locator('#tp-stories-page')).toBeVisible();
 await back();
 await hub();

 await root.getByRole('button',{name:'Arten-Pokédex',exact:true}).click();
 const modal=page.locator('.tp-modal:visible');
 await expect(modal).toHaveCount(1);
 await modal.locator('.tp-modal-head button').click();
 await hub();

 await root.getByRole('button',{name:'Arten-Pokédex',exact:true}).click();
 await expect(modal).toHaveCount(1);
 await modal.getByRole('button',{
  name:'Filter im Pokédex anwenden',exact:true
 }).click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('dex');
 await expect.poll(()=>page.evaluate(()=>TPAppMenu.active)).toBe(false);
 await H.tap(page,408,26);
 await hub();

 await back();
 await expect.poll(()=>page.evaluate(()=>({
  screen,active:TPAppMenu.active
 }))).toEqual({screen:'idle',active:false});
});
