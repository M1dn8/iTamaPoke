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
 const megaPage=page.locator('#tp-mega-page');
 if(await megaPage.isVisible()){
  await megaPage.locator('[data-mega-back]').click();
 }

 if(await page.evaluate(()=>screen==='keyboard')){
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 }
 const inlineName=page.locator('#tp-inline-name');
 if(await inlineName.isVisible()){
  await page.locator('#tp-status-page [data-status-back]').click();
  await expect(inlineName).not.toBeVisible();
 }
 if(await page.evaluate(()=>screen==='activity')){
  await page.locator('#tp-activity-page').getByRole('button',{
   name:await uiText(page,'common.back'),exact:true
  }).click();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 }

 if(await page.evaluate(()=>!!window.TPActions?.active))
  await tap(page,233,200);
 if(await page.evaluate(()=>screen==='gamemenu')){
  await page.locator('#tp-games-page [data-play-focus="back"]').click();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 }
 if(await page.evaluate(()=>
  screen==='expedition'||screen==='card'&&cardPage===7)){
  for(let step=0;step<2;step++){
   await page.locator('#tp-expedition-page [data-exp-back]').click();
   if(await page.evaluate(()=>screen==='idle'))break;
  }
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 }

 const dexBack=page.locator('#tp-dex-back');
 if(await dexBack.isVisible())await dexBack.click();
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
  const index=await page.evaluate(()=>cardPage);
  if([0,1,2,4,5,6].includes(index)){
   const status=page.locator('#tp-status-page');
   await expect(status).toBeVisible();
   for(let step=0;step<3;step++){
    await status.locator('[data-status-back]').click();
    if(await page.evaluate(()=>screen==='idle'))break;
   }
  }else{
   await tap(page,233,406);
  }
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
async function prepare(page,initial=fixture(),expectedSpecies=1){
 await page.addInitScript(()=>{try{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});}catch(_e){}});
 await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 await page.goto('/');await waitReady(page);await importSave(page,initial,expectedSpecies);
}
async function openHubSection(page,key){
 await openHub(page);
 await page.locator('#tp-app-page').getByRole('button',{
  name:await uiText(page,key),exact:true
 }).click();
}
async function openSpeciesSearch(page){
 await openHubSection(page,'menu.dex');
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('dex');
 await page.locator('#tp-dex-search').click();
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
 const dexBack=page.locator('#tp-dex-back');
 if(await dexBack.isVisible())await dexBack.click();
 await expect(page.locator('#tp-app-page').getByRole('heading',{
  name:await uiText(page,'navigation.hub'),exact:true
 })).toBeVisible();
}
async function diary(page){return openJournal(page);}
async function battleAction(page,action,options={}){
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
  const point=(p,action)=>{
   if(!p)return null;
   if(window.TPBattlePokedex?.active)
    return TPBattlePokedex.actionPoint(action);
   return {
    x:rect.left+p.x*rect.width/466,
    y:rect.top+p.y*rect.height/466
   };
  };
  const desiredPoint=point(ui.target(a),a);
  const backPoint=desiredPoint?null:point(ui.target('back'),'back');
  const fightPoint=desiredPoint||backPoint?null:point(ui.target('fight'),'fight');
  return {
   id,round,rests,resolved,menu,mode:m.mode,league,
   confirmAbort:!resolved,
   desired:desiredPoint,fight:fightPoint,back:backPoint
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
 // Use the captured, validated coordinate; never read the target again.
 await page.mouse.click(before.desired.x,before.desired.y);
 if(action==='leave'&&options.confirm!==false){
  const next=page.locator('#tp-battle-page [data-battle-action="confirm-no-catch"]');
  await expect(next).toBeVisible();await next.click();
 }

 if(action==='abort'&&before.confirmAbort&&options.confirm!==false){
  const confirmation=page.locator('#tp-give-up-confirm');
  await expect(confirmation).toBeVisible();
  await confirmation.locator('[data-give-up="yes"]').click();
 }
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


async function selectStory(page,id){
 const tile=page.locator('#tp-stories-page button[data-story="'+id+'"]');
 await expect(tile).toHaveCount(1);
 await expect(tile).toBeEnabled();
 for(let attempt=0;attempt<4&&!await tile.isVisible();attempt++){
  const next=page.locator('#tp-stories-next');
  const previous=page.locator('#tp-stories-prev');
  if(await next.isVisible()&&await next.isEnabled())await next.click();
  else if(await previous.isVisible()&&await previous.isEnabled())await previous.click();
  else break;
 }
 await expect(tile).toBeVisible();
 await tile.click();
 await expect(tile).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#tp-story-preview')).toHaveAttribute('data-story',id);
 return tile;
}
async function startStory(page,id){
 await selectStory(page,id);
 const start=page.locator('#tp-story-preview button[data-story-start="'+id+'"]');
 await expect(start).toBeEnabled();
 await start.click();
}
module.exports={openStatus,openExpedition,startGame,openGames,selectStory,startStory,uiText,openSpeciesSearch,openStories,openJournal,openEggPlanning,openEvolution,backToHub,closeHubModal,openHub,waitForWildCatchReady,battleAction,fixture,waitReady,point,tap,openMenu,game,modal,importSave,prepare,diary};


async function openGames(page){
 if(await page.evaluate(()=>screen==='gamemenu'))return;
 await game(page);await tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>window.TPActions?.mode)).toBe('root');
 const target=await page.evaluate(()=>TPActions.targets.find(item=>item.id==='games'));
 expect(target?.enabled).toBe(true);
 await tap(page,target.x+target.w/2,target.y+target.h/2);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('gamemenu');
}


async function startGame(page,index){
 const ids=['ball','catch','memo','clean','type'];
 expect(Number.isInteger(index)&&index>=0&&index<ids.length).toBe(true);
 await openGames(page);
 const root=page.locator('#tp-games-page');
 await expect(root).toBeVisible();
 const target=root.locator('[data-play-game="'+ids[index]+'"]');
 await expect(target).toHaveCount(1);
 await target.scrollIntoViewIfNeeded();
 await target.click();
 await root.locator('[data-play-start]').click();
 await expect.poll(()=>page.evaluate(()=>({screen,mode:gameMode})))
  .toEqual({screen:'game',mode:index});
 await expect(root).not.toBeVisible();
}


async function openExpedition(page){
 if(await page.evaluate(()=>screen!=='expedition')){
  await game(page);await tap(page,157,404);
  await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
  const target=await page.evaluate(()=>TPActions.targets.find(
   item=>item.id==='expedition'
  ));
  expect(target?.enabled).toBe(true);
  await tap(page,target.x+target.w/2,target.y+target.h/2);
 }
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('expedition');
 await expect(page.locator('#tp-expedition-page')).toBeVisible();
}


async function openStatus(page){
 const current=await page.evaluate(()=>({
  screen,page:cardPage
 }));
 if(current.screen!=='card'||![0,1,2,4,5,6].includes(current.page)){
  await game(page);
  const a=await point(page,233,300),b=await point(page,233,110);
  await page.mouse.move(a.x,a.y);await page.mouse.down();
  await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();
 }
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 const root=page.locator('#tp-status-page');
 await expect(root).toBeVisible();
 return root;
}


// UI01 closeout: shared visible battle selection and wild capture preparation.
async function openBattleSelection(page){
 await game(page);
 await page.waitForFunction(()=>!tpSaveReplacing&&!TPCollection.busy);
 await tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');

 const target=await page.evaluate(
  ()=>TPActions.targets.find(item=>item.id==='battle')||null
 );
 expect(target,'Visible battle action must have a real target').not.toBeNull();
 await tap(page,target.x+target.w/2,target.y+target.h/2);

 const root=page.locator('#tp-activity-page');
 await expect(root).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
 return root;
}
async function openWildBattleSelection(page){
 const root=await openBattleSelection(page);
 await root.locator('[data-activity-choice="wild"]').click();
 await expect(root).toHaveAttribute('data-battle-view','wild');
 await expect(root.locator('[data-activity-start="wild"]')).toBeVisible();
 return root;
}
async function startWildBattleFromSelection(page){
 const root=page.locator('#tp-activity-page');
 await expect(root).toBeVisible();
 await expect(root).toHaveAttribute('data-battle-view','wild');
 const start=root.locator('[data-activity-start="wild"]');
 await expect(start).toBeEnabled();
 await start.click();

 await expect.poll(()=>page.evaluate(()=>({
  screen,
  notice:TPWildTeam.notice||''
 }))).toMatchObject({screen:'battle'});

 expect(await page.evaluate(()=>Module.ccall(
  'tp_battle_is_open','number',[],[]
 ))).toBe(1);
 await expect.poll(()=>page.evaluate(()=>
  TPBattleView.current?.mode==='wild'&&
  TPBattleView.current.id===Module.ccall(
   'tp_bv_get','number',['number'],[0]
  )
 )).toBe(true);
 expect(await page.evaluate(()=>battleReturn)).toBe('activity');
}
async function prepareWildCapture(page){
 await openWildBattleSelection(page);
 let selected=false;
 for(let attempt=0;attempt<16;attempt++){
  await startWildBattleFromSelection(page);
  const types=await page.evaluate(()=>[
   fns.dexType1(fns.battleWildDex()),
   fns.dexType2(fns.battleWildDex())
  ]);
  if(types.every(type=>![2,9,14,16].includes(type))){
   selected=true;break;
  }
  await battleAction(page,'abort');
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
  await expect(page.locator('#tp-activity-page')).toBeVisible();
 }
 expect(selected,'A suitable real opponent must be reached within the existing attempt limit').toBe(true);
 for(let round=0;round<40;round++){
  if(await page.evaluate(()=>!!fns.battleResolved()))break;
  await battleAction(page,'quick');
 }
 expect(await page.evaluate(()=>!!fns.battleResolved())).toBe(true);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);
 await waitForWildCatchReady(page);
 expect(await page.evaluate(()=>!!fns.battleCatchOffered())).toBe(true);
}
Object.assign(module.exports,{
 openBattleSelection,openWildBattleSelection,
 startWildBattleFromSelection,prepareWildCapture
});


// UI01 closeout: migrate battle, arena and training entry routes.
async function battleSelectionRoot(page){
 const root=page.locator('#tp-activity-page');
 if(await root.isVisible()&&await root.getAttribute('data-activity-page')==='battle')
  return root;
 return openBattleSelection(page);
}
async function openArenaSelection(page){
 const activity=await battleSelectionRoot(page);
 await activity.locator('[data-activity-choice="arena"]').click();
 const start=activity.locator('[data-activity-start="arena"]');
 await expect(start).toBeEnabled();
 await start.click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');
 const arena=page.locator('#tp-arena-page');
 await expect(arena).toBeVisible();
 return arena;
}
async function openTrainerSelection(page){
 const activity=await battleSelectionRoot(page);
 await activity.locator('[data-activity-choice="trainer"]').click();
 const start=activity.locator('[data-activity-start="trainer"]');
 await expect(start).toBeEnabled();
 await start.click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('trainer');
}
async function openTrainingSelection(page){
 const root=page.locator('#tp-activity-page');
 if(await root.isVisible()&&await root.getAttribute('data-activity-page')==='training')
  return root;
 await game(page);
 await page.waitForFunction(()=>!tpSaveReplacing&&!TPCollection.busy);
 await tap(page,157,404);
 await expect.poll(()=>page.evaluate(()=>TPActions.mode)).toBe('root');
 const target=await page.evaluate(
  ()=>TPActions.targets.find(item=>item.id==='training')||null
 );
 expect(target,'Visible training action must have a target').not.toBeNull();
 await tap(page,target.x+target.w/2,target.y+target.h/2);
 await expect(root).toBeVisible();
 await expect(root).toHaveAttribute('data-activity-page','training');
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
 return root;
}
async function startTrainingFromSelection(page,id){
 expect(['strength','defence','speed']).toContain(id);
 const root=await openTrainingSelection(page);
 await root.locator('[data-activity-choice="'+id+'"]').click();
 const start=root.locator('[data-activity-start="'+id+'"]');
 await expect(start).toBeEnabled();
 await start.click();
 await expect.poll(()=>page.evaluate(()=>TPTraining.snapshot?.phase)).toBe('running');
}
async function clickWildStartOnly(page){
 const root=page.locator('#tp-activity-page');
 await expect(root).toBeVisible();
 await expect(root).toHaveAttribute('data-battle-view','wild');
 const button=root.locator('[data-activity-start="wild"]');
 await expect(button).toBeEnabled();
 await button.click();
}
Object.assign(module.exports,{
 openArenaSelection,openTrainerSelection,openTrainingSelection,
 startTrainingFromSelection,clickWildStartOnly
});

// UI01 release: Mega tests use the real profile link and visible actions.
async function megaProfile(page){
 const root=await openStatus(page);
 await root.locator('[data-status-tab="profile"]').click();
 return root;
}
async function openMegaPage(page){
 const profile=await megaProfile(page);
 const link=profile.locator('.tp-status-portrait [data-status-mega]');
 await expect(link).toHaveCount(1);
 await expect(link).toBeVisible();
 await link.click();
 const root=page.locator('#tp-mega-page');
 await expect(root).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>({screen,page:cardPage})))
  .toEqual({screen:'card',page:8});
 return root;
}
async function megaPrimary(page){
 const state=await page.evaluate(()=>TPMega.view(true));
 expect(state).not.toBeNull();
 const action=state.stone?'activate':'claim';
 const button=page.locator('#tp-mega-page [data-mega-action="'+action+'"]');
 await expect(button).toBeVisible();
 await expect(button).toBeEnabled();
 await button.click();
 await expect.poll(()=>page.evaluate(()=>TPMega.busy)).toBe(false);
}
async function backFromMega(page){
 const root=page.locator('#tp-mega-page');
 const label=await uiText(page,'common.back');
 const escaped=label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const back=root.getByRole('button',{name:new RegExp('^'+escaped)});
 await expect(back).toHaveCount(1);
 await back.click();
 await expect(root).toBeHidden();
}
Object.assign(module.exports,{megaProfile,openMegaPage,megaPrimary,backFromMega});

// UI01 release: current collection navigation and team candidate controls.
async function openCollectionTeam(page){
 const root=page.locator('#tp-box-page');
 if(!await root.isVisible()){
  await openHub(page);
  await page.locator('#tp-app-page').getByRole('button',{name:'Boxen',exact:true}).click();
 }
 await expect(root).toBeVisible();
 const team=root.getByRole('button',{name:/^Teamplanung /});
 await team.click();await expect(team).toHaveAttribute('aria-pressed','true');
 return root;
}
async function openStoredBoxes(page){
 const root=await openCollectionTeam(page);
 await root.getByRole('button',{name:'Boxen',exact:true}).click();
 return root;
}
async function chooseTeamCandidate(page,id){
 const root=await openCollectionTeam(page);
 const empty=root.locator('.tp-box-column-right .tp-box-empty:visible').first();
 await expect(empty).toBeVisible();await empty.click();
 const candidate=root.locator('.tp-box-column-right [data-mon-id="'+id+'"]:visible');
 await expect(candidate).toHaveCount(1);await candidate.click();
 return root;
}
Object.assign(module.exports,{openCollectionTeam,openStoredBoxes,chooseTeamCandidate});
