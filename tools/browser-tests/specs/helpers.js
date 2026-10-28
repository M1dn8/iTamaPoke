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
async function uiText(page,key){
 const value=await page.evaluate(key=>TPText.t(key),key);
 expect(value,'Missing UI translation: '+key).not.toBe(key);
 return value;
}
async function openMenu(page){
 const root=page.locator('#tp-app-page');
 const title=await uiText(page,'menu.title');
 if(await root.getByRole('heading',{name:title,exact:true}).isVisible())return;
 await game(page);
 const a=await point(page,233,110),b=await point(page,233,300);
 await page.mouse.move(a.x,a.y);await page.mouse.down();
 await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();
 await expect(root).toBeVisible();
 await expect(root.getByRole('heading',{name:title,exact:true})).toBeVisible();
 await expect(root.getByRole('button',{
  name:await uiText(page,'menu.backups'),exact:true
 })).toBeVisible();
}
async function openHub(page){
 const root=page.locator('#tp-app-page');
 const name=await uiText(page,'navigation.hub');
 const heading=root.getByRole('heading',{name,exact:true});
 if(await heading.isVisible())return;
 await game(page);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 await tap(page,385,404);
 await expect(heading).toBeVisible();
}
async function game(page){
 const root=page.locator('#tp-app-page');
 for(let step=0;step<6&&await root.isVisible();step++){
  const home=root.getByRole('button',{
   name:await uiText(page,'menu.home'),exact:true
  });
  if(await home.isVisible())await home.click();
  else await root.locator('.tp-app-head').getByRole('button',{
   name:await uiText(page,'common.back'),exact:true
  }).click();
 }
 await expect(root).toBeHidden();
 if(await page.evaluate(()=>screen==='card')){
  await tap(page,233,406);
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 }
}
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
async function prepare(page,initial=fixture()){
 await page.addInitScript(()=>{try{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});}catch(_e){}});
 await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 await page.goto('/');await waitReady(page);await importSave(page,initial);
}
async function openHubSection(page,key){
 await openHub(page);
 await page.locator('#tp-app-page').getByRole('button',{
  name:await uiText(page,key),exact:true
 }).click();
}
async function openSpeciesSearch(page){
 await openHubSection(page,'navigation.species');
 await expect(modal(page)).toBeVisible();
 return modal(page);
}
async function openStories(page){
 await openHubSection(page,'zapdos.menu');
 const list=page.locator('#tp-stories-page');
 await expect(list).toBeVisible();return list;
}
async function openJournal(page){
 await openHubSection(page,'menu.journal');
 const root=page.locator('#tp-app-page');
 await expect(root.getByRole('heading',{
  name:await uiText(page,'menu.journal'),exact:true
 })).toBeVisible();
 return root.locator('.tp-app-list');
}
async function openEggPlanning(page){
 await openHubSection(page,'menu.eggs');
 await expect(modal(page)).toBeVisible();return modal(page);
}
async function openEvolution(page){
 await openHubSection(page,'menu.evolution');
 await expect(modal(page)).toBeVisible();return modal(page);
}
async function backToHub(page){
 await page.locator('#tp-app-page .tp-app-head').getByRole('button',{
  name:await uiText(page,'common.back'),exact:true
 }).click();
 await expect(page.locator('#tp-app-page').getByRole('heading',{
  name:await uiText(page,'navigation.hub'),exact:true
 })).toBeVisible();
}
async function closeHubModal(page){
 await expect(modal(page)).toBeVisible();
 await modal(page).locator('.tp-modal-head').getByRole('button',{
  name:await uiText(page,'common.back'),exact:true
 }).click();
 await expect(page.locator('#tp-app-page').getByRole('heading',{
  name:await uiText(page,'navigation.hub'),exact:true
 })).toBeVisible();
}
async function diary(page){return openJournal(page);}
async function battleAction(page,action){
 const capture=()=>page.evaluate(a=>{
  const ui=window.TPBattleView,m=ui?.current;
  if(!m||tpSaveReplacing)return null;
  let id,round,rests,resolved,league=null;
  if(screen==='league'){
   const s=TPLeague.state;
   if(!s.live||TPLeague.busy)return null;
   id=s.battleId;round=s.round;rests=s.rests;resolved=!!s.resolved;
   league={region:s.region,index:s.index};
  }else{
   if(screen!=='battle'||!Module.ccall('tp_battle_is_open','number',[],[]))return null;
   id=Module.ccall('tp_bv_get','number',['number'],[0]);
   round=fns.battleRound();
   rests=Module.ccall('tp_battle_rest_uses_left','number',[],[]);
   resolved=!!fns.battleResolved();
  }
  if(m.id!==id||m.round!==round||m.rests!==rests||!!m.resolved!==resolved)return null;
  const menu=ui.menu,fight=ui.target('fight'),back=ui.target('back');
  // A menu switch can precede publication of its next drawn target map.
  if((menu==='moves'&&fight)||(menu==='main'&&back))return null;
  const rect=document.getElementById('tp').getBoundingClientRect();
  if(!rect.width||!rect.height)return null;
  const point=p=>p?{
   x:rect.left+p.x*rect.width/466,
   y:rect.top+p.y*rect.height/466
  }:null;
  return {
   id,round,rests,resolved,menu,mode:m.mode,league,
   confirmAbort:m.mode!=='wild'&&!resolved,
   desired:point(ui.target(a)),fight:point(fight),back:point(back)
  };
 },action);
 const waitChoice=async()=>{
  let selected=null;
  const attack=['quick','heavy','dodge'].includes(action);
  const canBack=attack||action==='rest'||action==='abort';
  await expect.poll(async()=>{
   selected=await capture();
   return !!selected&&(!!selected.desired||
    (canBack&&!!selected.back)||(attack&&!!selected.fight));
  },{message:'Current drawn battle target for '+action}).toBe(true);
  return selected;
 };
 let before=null;
 for(let navigation=0;navigation<3;navigation++){
  const selected=await waitChoice();
  if(selected.desired){before=selected;break;}
  const point=selected.back||selected.fight;
  if(!point)throw Error('No visible navigation route for '+action);
  await page.mouse.click(point.x,point.y);
 }
 if(!before?.desired)throw Error('Battle navigation did not expose '+action);
 if(action==='abort'&&before.confirmAbort)
  page.once('dialog',dialog=>dialog.accept());
 // Use the captured, validated coordinate; never read the target again.
 await page.mouse.click(before.desired.x,before.desired.y);
 if(['quick','heavy','dodge','rest'].includes(action)){
  await expect.poll(()=>page.evaluate(previous=>{
   if(previous.league){
    const s=TPLeague.state;
    if(!s||s.region!==previous.league.region)return false;
    if(s.battleId===previous.id&&
       (s.round>previous.round||!!s.resolved||!!s.needsSwitch))return true;
    if(s.live||TPLeague.busy||tpSaveReplacing||s.pending||
       window.TPCollection?.busy||window.TPCollection?.blocked)return false;
    if(TPLeague.diagnostics?.phase!=='checkpoint')return false;
    return s.index===previous.league.index+1||
     (previous.league.index===25&&s.index===0&&!!s.done&&!s.state);
   }
   if(screen!=='battle'||!Module.ccall('tp_battle_is_open','number',[],[]))return false;
   return Module.ccall('tp_bv_get','number',['number'],[0])===previous.id&&
    (fns.battleRound()>previous.round||!!fns.battleResolved());
  },{id:before.id,round:before.round,league:before.league}),{
   message:'One real battle action must take effect: '+action
  }).toBe(true);
 }else if(['fight','back','info'].includes(action)){
  const expected=action==='fight'?'moves':action==='back'?'main':null;
  await expect.poll(()=>page.evaluate(expected=>{
   const menu=TPBattleView.menu;
   return expected?menu===expected:['team','info'].includes(menu);
  },expected)).toBe(true);
 }
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

module.exports={uiText,openSpeciesSearch,openStories,openJournal,openEggPlanning,openEvolution,backToHub,closeHubModal,openHub,waitForWildCatchReady,battleAction,fixture,waitReady,point,tap,openMenu,game,modal,importSave,prepare,diary};
