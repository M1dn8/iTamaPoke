const {expect}=require('@playwright/test');
function number(n){const b=Buffer.alloc(8);b.writeBigInt64LE(BigInt(n));return b;}
function fixture(entries=120){
 const diary=Buffer.alloc(entries*36);const now=Math.floor(Date.now()/1000);
 for(let i=0;i<entries;i++){const o=i*36;diary.writeUInt32LE(now-entries+i,o);diary.writeUInt16LE(1,o+4);diary.writeUInt16LE(1,o+6);diary.writeUInt16LE(i+1,o+8);diary[o+10]=6;}
 const reg=Buffer.alloc(129);reg.set([255,255,255,1]);
 const fields={init:[0,Buffer.from([1])],dexn:[1,number(1)],eggT2:[1,number(1)],age:[1,number(540)],full:[1,number(80)],joy:[1,number(80)],ene:[1,number(80)],hyg:[1,number(80)],bond:[1,number(20)],gatk:[1,number(100)],gdef:[1,number(100)],gspe:[1,number(100)],lang:[1,number(3)],chi:[1,number(entries)],stpk:[0,Buffer.from([0])],nick:[2,Buffer.from('Browser-Test')],dexreg:[3,reg],dexcgt:[3,Buffer.alloc(129)],dexsh:[3,Buffer.alloc(129)],medal:[1,number(129)],psver:[1,number(1)],pskind:[1,number(0)],psvec:[3,Buffer.alloc(4)],jrver:[1,number(1)],jrcount:[1,number(entries)],jrdata:[3,diary],jrlvl:[1,number(1)],jrdex:[1,number(3)]};
 const count=Buffer.alloc(4);count.writeUInt32LE(Object.keys(fields).length);
 return Buffer.concat([count,...Object.entries(fields).map(([key,[type,value]])=>{const k=Buffer.from(key),len=Buffer.alloc(4);len.writeUInt32LE(value.length);return Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),len,value]);})]);
}
async function waitReady(page){await page.waitForFunction(()=>typeof TPAppMenu!=='undefined'&&TPAppMenu.ready===true&&(!window.TPCollectionGame||TPCollectionGame.ready));}
async function point(page,x,y){const r=await page.locator('#tp').boundingBox();return {x:r.x+x*r.width/466,y:r.y+y*r.height/466};}
async function tap(page,x,y){const p=await point(page,x,y);await page.mouse.click(p.x,p.y);}
async function openMenu(page){
 const root=page.locator('#tp-app-page');if(await root.isVisible())return;
 const a=await point(page,233,110),b=await point(page,233,300);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect(root).toBeVisible();
}
async function game(page){const root=page.locator('#tp-app-page');if(await root.isVisible())await root.getByRole('button',{name:'Zurück zum Pokémon',exact:true}).click();}
const modal=page=>page.locator('#tp-game-shell > .tp-modal:visible');
async function importSave(page,buffer,expectedSpecies=1){
 await openMenu(page);await page.waitForFunction(()=>Array.from(document.querySelectorAll('.tp-tools button')).some(b=>b.textContent.trim()==='Sicherungen'&&!b.disabled));await page.getByRole('button',{name:'Sicherungen',exact:true}).click();
 const panel=modal(page);await expect(panel).toBeVisible();
 await panel.locator('input[type=file]').setInputFiles({name:'Browser-Test.tpsave',mimeType:'application/octet-stream',buffer});
 const apply=panel.getByRole('button',{name:'Importieren und aktuellen Stand ersetzen',exact:true});await expect(apply).toBeVisible();
 const accept=dialog=>dialog.accept();page.once('dialog',accept);
 await Promise.all([page.waitForEvent('load'),apply.click()]);await waitReady(page);
 await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(expectedSpecies);
}
async function prepare(page){
 await page.addInitScript(()=>{try{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});}catch(_e){}});
 await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 await page.goto('/');await waitReady(page);await importSave(page,fixture());
}
async function diary(page){await openMenu(page);await page.getByRole('button',{name:'Tagebuch',exact:true}).click();return page.locator('.tp-app-list');}
async function battleAction(page,action){
 const target=a=>page.evaluate(a=>{const ui=window.TPBattleView,m=ui?.current;if(!m||tpSaveReplacing)return null;if(screen==='league'){if(!TPLeague.state.live||TPLeague.busy||m.id!==TPLeague.state.battleId)return null;}else if(screen!=='battle'||!Module.ccall('tp_battle_is_open','number',[],[])||m.id!==Module.ccall('tp_bv_get','number',['number'],[0]))return null;return ui.target(a)||null;},a);
 if(['quick','heavy','dodge','rest'].includes(action)&&!(await target(action))){
  const back=await target('back');if(back)await tap(page,back.x,back.y);
  await expect.poll(()=>target('fight')).not.toBe(null);const p=await target('fight');await tap(page,p.x,p.y);
 }else if(action==='abort'&&!(await target('abort'))){const back=await target('back');if(back)await tap(page,back.x,back.y);}
 await expect.poll(()=>target(action)).not.toBe(null);const p=await target(action);
 if(action==='abort'&&await page.evaluate(()=>TPBattleView.current?.mode!=='wild'&&!TPBattleView.current?.resolved))page.once('dialog',d=>d.accept());
 await tap(page,p.x,p.y);
}


async function waitForWildCatchReady(page){
 await expect.poll(()=>page.evaluate(()=>({
  resolved:!!fns.battleResolved(),
  offered:!!fns.battleCatchOffered(),
  resultPending:JSON.parse(
   Module.ccall('tp_wt_view','string',[],[])
  ).resultPending,
  busy:TPCollection.busy,
  blocked:TPCollection.blocked,
  gate:tpSaveReplacing
 }))).toEqual({
  resolved:true,offered:true,resultPending:false,
  busy:false,blocked:false,gate:false
 });
}

module.exports={waitForWildCatchReady,battleAction,fixture,waitReady,point,tap,openMenu,game,modal,importSave,prepare,diary};
