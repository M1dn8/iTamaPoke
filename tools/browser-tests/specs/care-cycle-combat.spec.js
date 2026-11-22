'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const AU=require('./arena-ui-helpers');

async function observe(page){
 return page.evaluate(()=>{
  const read=fn=>{
   try{return fn();}
   catch(error){return {error:error.code||error.message};}
  };
  return {
   screen:typeof screen==='string'?screen:null,
   native:read(()=>JSON.parse(Module.ccall(
    'tp_f4_life_state','string',[],[]
   ))),
   collection:read(()=>{
    const s=TPCollection.read();
    return {
     revision:s.revision,active:s.active,team:s.team,
     needsPlacement:TPCollectionModel.needsCarePlacement(s),
     mons:s.mons.map(m=>({
      id:m.id,dex:m.dex,origin:m.origin,
      lifeToken:m.data.lifeToken,level:m.level
     })),
     slots:s.boxes.map(b=>b.slots)
    };
   }),
   gates:read(()=>({
    replacing:tpSaveReplacing,
    busy:TPCollection.busy,blocked:TPCollection.blocked,
    dialog:TPCollectionGame.dialogOpen,
    lifeMessage:TPCollectionGame.message,
    battleCanStart:fns.battleCanStart(),
    ceremony:fns.ceremony(),egg:fns.isEgg(),
    wildNotice:window.TPWildTeam?.notice||''
   })),
   battle:read(()=>window.TPBattleView?.current||null),
   roster:read(()=>window.TPWildTeam?.view||null)
  };
 });
}
async function settled(page){
 await page.waitForFunction(()=>
  !tpSaveReplacing&&!TPCollection.busy&&!TPCollectionGame.dialogOpen
 );
}

/* Full team requires an explicit care-slot decision. */
for(const scenario of [
 {ending:'release',full:false},
 {ending:'keep',full:false},
 {ending:'release',full:true},
 {ending:'keep',full:true}
]){
 const {ending,full}=scenario;
 /* Cover both battle entries and both full-team endings. */
 for(const combat of ['wild','arena']){
  test('care cycle: '+(full?'full team ':'')+ending+' -> hatch -> '+combat+' without boxes',
  async({page},testInfo)=>{
   const observations=[];
   const record=async label=>{
    const value=await observe(page);
    observations.push({label,value});
    return value;
   };
   try{
    await H.prepare(page,H.fixture(0),1);
    await H.game(page);
    await settled(page);
    if(full){
     await page.evaluate(async()=>{
      for(let i=0;i<5;i++){
       await TPCollection.apply('catchWild',{
        dex:25,level:20,nickname:'Care cycle reserve '+i,
        shiny:false,origin:'wild',
        data:{stats:{atk:50,def:50,spe:50},genes:null,training:null}
       },0);
       const id=TPCollection.read().nextId-1;
       await TPCollection.apply('selectTeam',id);
      }
     });
    }
    const initial=await record('initial');
    expect(initial.collection.team).toHaveLength(full?6:1);
    const oldId=initial.collection.active;
    const oldMon=initial.collection.mons.find(m=>m.id===oldId);
    expect(oldMon.dex).toBe(1);
    expect(initial.collection.team).toContain(oldId);

    await page.evaluate(()=>TPCollectionGame.openEnd('release'));
    const dialog=page.getByRole('dialog',{
     name:'Pflege beenden',exact:true
    });
    await expect(dialog).toBeVisible();
    if(ending==='keep'){
     await dialog.getByRole('button',{
      name:'In Box verschieben',exact:true
     }).click();
    }else{
     await dialog.getByRole('button',{
      name:'Freilassen',exact:true
     }).click();
     await dialog.getByRole('button',{name:'Ja',exact:true}).click();
    }
    await expect(dialog).toBeHidden();
    await expect.poll(()=>page.evaluate(()=>fns.ceremony())).toBe(3);
    await expect.poll(()=>page.evaluate(()=>fns.isEgg())).toBe(1);
    await expect.poll(()=>page.evaluate(()=>fns.ceremony())).toBe(0);
    await settled(page);

    const egg=await record('new egg');
    expect(egg.collection.active).toBeNull();
    expect(egg.native.token).toBeGreaterThan(initial.native.token);
    expect(egg.collection.mons.some(m=>m.id===oldId))
     .toBe(ending==='keep');

    for(let tap=0;tap<3;tap++){
     await H.tap(page,233,220);
     await settled(page);
    }
    await expect.poll(()=>page.evaluate(()=>fns.isEgg())).toBe(0);

    const hatch=await record('after real hatch');
    await expect.poll(()=>page.evaluate(()=>({
     native:JSON.parse(Module.ccall('tp_f4_life_state','string',[],[])).token,
     active:TPCollection.read().active,
     mon:TPCollection.read().mons.find(m=>m.id===TPCollection.read().active)
      ?.data.lifeToken
    }))).toMatchObject({
     native:egg.native.token,mon:egg.native.token
    });
    const current=await record('before battle selection');
    const newId=current.collection.active;
    expect(newId).not.toBeNull();
    expect(newId).not.toBe(oldId);
    const newMon=current.collection.mons.find(m=>m.id===newId);
    expect(newMon.dex).toBe(hatch.native.snapshot.dex);
    expect(newMon.lifeToken).toBe(egg.native.token);
    expect(current.collection.mons.some(m=>m.id===oldId))
     .toBe(ending==='keep');

    if(full&&ending==='release'){
     expect(current.collection.team).toHaveLength(6);
     expect(current.collection.team).toContain(newId);
     expect(current.collection.needsPlacement).toBe(false);
    }
    let activity=await H.openWildBattleSelection(page);
    if(full&&ending==='keep'){
     if(combat==='arena')
      await activity.locator('[data-activity-choice="arena"]').click();
     expect(current.collection.team).toHaveLength(6);
     expect(current.collection.needsPlacement).toBe(true);
     expect(current.collection.team).not.toContain(newId);
     expect(current.collection.team).toContain(oldId);
     await record('full team before requesting battle');
     const start=activity.locator('[data-activity-start="'+combat+'"]');
     await expect(start).toBeEnabled();
     await start.click();

     const placement=page.locator(
      '#tp-box-page[data-box-view="carePlacement"]'
     );
     await expect(placement,
      'Kampfzugang muss die notwendige Pflegeplatz-Auswahl anbieten'
     ).toBeVisible();
     expect(await page.evaluate(()=>Module.ccall(
      'tp_battle_is_open','number',[],[]
     ))).toBe(0);
     await record('explicit care-slot decision offered');

     await placement.locator('.tp-box-head')
      .getByRole('button',{name:'Zurück',exact:true}).click();
     await expect(placement).toBeHidden();
     await expect(activity).toBeVisible();
     const cancelled=await record('care-slot decision cancelled');
     expect(cancelled.collection.active).toBe(newId);
     expect(cancelled.collection.team).toEqual(current.collection.team);
     expect(cancelled.collection.mons.map(m=>m.id))
      .toEqual(current.collection.mons.map(m=>m.id));
     expect(cancelled.collection.needsPlacement).toBe(true);
     expect(await page.evaluate(()=>Module.ccall(
      'tp_battle_is_open','number',[],[]
     ))).toBe(0);

     const retry=activity.locator('[data-activity-start="'+combat+'"]');
     await expect(retry).toBeEnabled();
     await retry.click();
     await expect(placement).toBeVisible();

     const replaceOld=placement.getByRole('button',{
      name:new RegExp('^Durch Pflege-Pokémon ersetzen: .* · #'+oldId+'$')
     });
     await expect(replaceOld).toBeEnabled();
     await replaceOld.click();
     await expect.poll(()=>page.evaluate(id=>
      TPCollection.read().team.includes(id),newId
     )).toBe(true);
     await settled(page);
     const assigned=await record('care slot explicitly assigned');
     expect(assigned.collection.active).toBe(newId);
     expect(assigned.collection.needsPlacement).toBe(false);
     expect(assigned.collection.team).toHaveLength(6);
     expect(assigned.collection.team).not.toContain(oldId);
     expect(assigned.collection.mons.find(m=>m.id===oldId)).toEqual(oldMon);
     expect(assigned.collection.slots.flat().filter(id=>id===oldId))
      .toHaveLength(1);
     expect(assigned.collection.mons.map(m=>m.id))
      .toEqual(current.collection.mons.map(m=>m.id));

     const boxes=page.locator('#tp-box-page');
     await expect(boxes).toHaveAttribute('data-box-view','overview');
     await boxes.locator('.tp-box-head')
      .getByRole('button',{name:'Zurück',exact:true}).click();
     await expect(boxes).toBeHidden();
     await expect(activity).toBeVisible();
     await expect.poll(()=>page.evaluate(()=>screen)).toBe('activity');
     expect(await page.evaluate(()=>Module.ccall(
      'tp_battle_is_open','number',[],[]
     ))).toBe(0);
     await expect(activity).toHaveAttribute('data-battle-view',combat);
    }
    if(combat==='wild'){
     await record('wild selection before start');
     await H.startWildBattleFromSelection(page);
    }else{
     await activity.locator('[data-activity-choice="arena"]').click();
     const open=activity.locator('[data-activity-start="arena"]');
     await expect(open).toBeEnabled();
     await open.click();
     await AU.details(page,0);
     await record('arena detail before start');
     const challenge=page.locator('#tp-arena-page [data-arena-challenge]');
     await expect(challenge).toBeEnabled();
     await challenge.click();
     await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
    }

    const running=await record('battle started');
    expect(await page.evaluate(()=>Module.ccall(
     'tp_battle_is_open','number',[],[]
    ))).toBe(1);
    expect(running.collection.active).toBe(newId);
    expect(running.collection.team).toContain(newId);
    await expect.poll(()=>page.evaluate(id=>
     !!TPWildTeam.view?.live&&
     TPWildTeam.view.members.some(m=>m.id===id),newId
    )).toBe(true);
    if(ending==='release'){
     expect(running.collection.team).not.toContain(oldId);
     expect(await page.evaluate(id=>
      TPWildTeam.view.members.some(m=>m.id===id),oldId
     )).toBe(false);
    }
   }finally{
    try{await record('final observation');}catch(_){}
    await testInfo.attach('care-cycle-observations',{
     body:Buffer.from(JSON.stringify(observations,null,2)),
     contentType:'application/json'
    });
   }
  });
 }
}
