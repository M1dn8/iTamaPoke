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
 await H.importSave(page,strong(),376);
 await H.openWildBattleSelection(page);
 await H.startWildBattleFromSelection(page);
}
const targets=(page,names)=>page.evaluate(names=>Object.fromEntries(
 names.map(name=>[name,TPBattleView.target(name)])
),names);


async function giveUpActivity(page,kind){
 await H.game(page);await H.tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
 const target=await page.evaluate(()=>TPActions.targets.find(t=>t.id==='battle'));
 await H.tap(page,target.x+target.w/2,target.y+target.h/2);
 await page.locator('[data-activity-choice="'+kind+'"]').click();
 if(kind==='arena'){
  await page.locator('[data-battle-region-toggle]').click();
  await page.locator('[data-battle-region="0"]').click();
 }
 await page.locator('[data-activity-start="'+kind+'"]').click();
 if(kind==='trainer'){
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('trainer');
  await H.tap(page,233,190);
 }else{
  const arena=page.locator('#tp-arena-page');
  await expect(arena).toBeVisible();
  await arena.locator('[data-arena-leader="0"]').click();
  await arena.locator('[data-arena-open]').click();
  await arena.locator('[data-arena-challenge]').click();
 }
}
for(const mode of ['wild','trainer','arena','league']){
 test('Aufgeben: In-Game-Nein unverändert, Ja beendet wirklich '+mode,
 async({page})=>{
  const F=require('./johto-review-fixtures');
  const HU=require('./hall-ui-helpers'),LU=require('./league-ui-helpers');
  await H.prepare(page,F.createCases()[0].raw);
  if(mode==='wild')await start(page);
  else if(mode==='league'){
   await HU.open(page,0);await HU.back(page);await LU.start(page);
  }else await giveUpActivity(page,mode);

  await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.mode)).toBe(mode);
  let browserDialogs=0;
  page.on('dialog',dialog=>{browserDialogs++;void dialog.dismiss();});
  const returnScreen=mode==='league'?'activity':
   await page.evaluate(()=>battleReturn);
  const snapshot=()=>page.evaluate(()=>({
   id:TPBattleView.current.id,round:TPBattleView.current.round,
   playerHp:TPBattleView.current.player.hp,enemyHp:TPBattleView.current.enemy.hp,
   rests:TPBattleView.current.rests,energy:TPBattleEnergy.view.energy,
   open:Module.ccall('tp_battle_is_open','number',[],[])
  }));
  const before=await snapshot();
  expect(before.open).toBe(1);

  await H.battleAction(page,'abort',{confirm:false});
  const dialog=page.locator('#tp-give-up-confirm');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText('Wirklich aufgeben?');

  const panel=await dialog.locator('.tp-give-up-panel').boundingBox();
  const shell=await page.locator('#tp-game-shell').boundingBox();
  const lower=page.locator('#tp-battle-page .tp-battle-panel');
  if(await lower.isVisible()){
   const box=await lower.boundingBox();
   expect(panel.x).toBeGreaterThanOrEqual(box.x-1);
   expect(panel.y).toBeGreaterThanOrEqual(box.y-1);
   expect(panel.x+panel.width).toBeLessThanOrEqual(box.x+box.width+1);
   expect(panel.y+panel.height).toBeLessThanOrEqual(box.y+box.height+1);
  }else{
   expect(panel.y).toBeGreaterThanOrEqual(shell.y+shell.height*299/466-1);
   expect(panel.y+panel.height).toBeLessThanOrEqual(shell.y+shell.height+1);
  }
  await expect(dialog.locator('[data-give-up="yes"]'))
   .toHaveCSS('background-color','rgb(62, 116, 85)');
  await expect(dialog.locator('[data-give-up="no"]'))
   .toHaveCSS('background-color','rgb(150, 60, 69)');
  await expect(dialog.locator('[data-give-up="no"]')).toBeFocused();

  await dialog.getByRole('button',{name:'Nein',exact:true}).click();
  await expect(dialog).toBeHidden();
  expect(await snapshot()).toEqual(before);

  await H.battleAction(page,'abort',{confirm:false});
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  expect(await snapshot()).toEqual(before);

  await H.battleAction(page,'abort',{confirm:false});
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button',{name:'Ja',exact:true}).click();
  await expect(dialog).toBeHidden();
  await expect.poll(()=>page.evaluate(()=>
   Module.ccall('tp_battle_is_open','number',[],[])
  )).toBe(0);
  await expect.poll(()=>page.evaluate(()=>screen)).toBe(returnScreen);
  expect(await page.evaluate(()=>TPBattleEnergy.view.energy)).toBe(before.energy);
  if(mode==='league')
   expect(await page.evaluate(()=>TPLeague.state.live)).toBe(0);
  expect(browserDialogs).toBe(0);
 });
}
