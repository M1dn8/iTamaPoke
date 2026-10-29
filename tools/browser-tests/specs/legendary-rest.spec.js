 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./legendary-fixtures');

const pageRoot=(page,p)=>page.locator('#tp-'+p.id+'-page');
const admission=page=>page.locator('#tp-admission-page');
async function quiet(page){
 await page.waitForFunction(()=>
  !tpSaveReplacing&&!TPCollection.busy&&!TPCollection.blocked&&
  !window.TPAdmissionUI?.busy
 );
}
async function state(page,p){
 await quiet(page);
 return page.evaluate(p=>{
  const s=TPCollection.read();
  const values=TPStoreTools.parseLegacy(exportStateBytes(Module)).values;
  const entries=JSON.parse(Module.ccall('tp_journal_json','string',[],[]));
  return {
   phase:window[p.service].view().phase,
   pending:TPAdmission.read().pending,
   team:s.team,active:s.active,total:s.mons.length,
   joined:s.mons.filter(m=>m.data.admission?.source==='story:kanto:'+p.id),
   wins:values.get('bwin')?.value||0,
   journal:entries.filter(e=>e.k===4&&e.s===p.dex&&(e.f&2)).length
  };
 },p);
}
async function seedArt(page,p){
 const width=24,height=24,bytes=Buffer.alloc(15+width*height);
 bytes.write('TPK2',0,'ascii');bytes[4]=1;bytes.writeUInt16LE(1,5);
 bytes.writeUInt16LE(0xf800,7);bytes.set([0,width,height,1],9);
 bytes.writeUInt16LE(120,13);
 await page.evaluate(async({dex,raw})=>{
  await importSpriteFiles([new File(
   [Uint8Array.from(raw)],'p'+String(dex).padStart(3,'0')+'.bin'
  )]);
 },{dex:p.dex,raw:Array.from(bytes)});
}
async function setup(page,p,{step=0,full=false}={}){
 await page.emulateMedia({reducedMotion:'reduce'});
 await H.prepare(page,F.fixture(H.fixture(0),p.id,{step}),1);
 await H.game(page);
 await page.evaluate(async full=>{
  await TPCollectionGame.ensureCurrent();
  const care=TPCollection.read().active;
  await TPCollection.apply('catchWild',{
   dex:376,level:100,nickname:'Trial Alpha',shiny:false,origin:'wild',
   data:{stats:{atk:3000,def:3000,spe:3000},genes:null,training:null}
  },0);
  const alpha=TPCollection.read().nextId-1;
  for(const id of [...TPCollection.read().team])
   await TPCollection.apply('unselectTeam',id);
  await TPCollection.apply('selectTeam',alpha);
  if(full){
   await TPCollection.apply('selectTeam',care);
   for(let i=0;i<4;i++){
    await TPCollection.apply('catchWild',{
     dex:25,level:20,nickname:'Reserve '+i,shiny:false,origin:'wild',
     data:{stats:{atk:50,def:50,spe:50}}
    },0);
    await TPCollection.apply('selectTeam',TPCollection.read().nextId-1);
   }
  }
  Module.ccall('tp_seed_random',null,['number'],[314159]);
 },full);
 await seedArt(page,p);
 await H.openStories(page);
 const tile=page.locator('#tp-stories-page button[data-story="'+p.id+'"]');
 await expect(tile).toBeEnabled();
 await expect(tile).toContainText(p.place);
 await tile.click();
 await expect(pageRoot(page,p)).toBeVisible();
}
async function solve(page,p){
 const root=pageRoot(page,p);
 const label=await page.evaluate(p=>window[p.text].t('investigate'),p);
 await root.getByRole('button',{name:label,exact:true}).click();
 await root.locator('.tp-ice-open').click();

 if(p.id==='moltres'){
  await root.locator('[data-cell="20"]').click();
  await root.locator('[data-cell="15"]').click();
  await root.getByRole('button',{name:'Rätsel zurücksetzen',exact:true}).click();
  await expect(root.locator('[data-cell="20"]')).toHaveAttribute('data-rock','true');
  for(const path of [
   [20,15,10,11,12,7,2,1,0],
   [22,17,12,7,2,1],
   [21,22,17,12,7,2]
  ]){
   await root.locator('[data-cell="'+path[0]+'"]').click();
   for(const cell of path.slice(1))
    await root.locator('[data-cell="'+cell+'"]').click();
  }
 }else if(p.id==='mewtwo'){
  for(let hit=0;hit<3;hit++){
   await page.waitForFunction(()=>{
    const field=document.querySelector('#tp-mewtwo-page .tp-psi-field');
    const ring=field?.querySelector('circle[stroke-width="4"]');
    const radius=Number(ring?.getAttribute('r'));
    return field?.dataset.ready==='true'&&radius>=44&&radius<=48;
   });
   if(hit<2){
    await root.locator('.tp-psi-field').click();
    await expect(root.locator('.tp-psi-progress'))
     .toHaveText('Impulse: '+(hit+1)+'/3');
   }else{
    const box=await root.locator('.tp-psi-field').boundingBox();
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
    await page.mouse.down();
    const challenge=root.locator('.tp-zapdos-challenge');
    await expect(challenge).toBeVisible();
    // Intentional sustained input, not a retry or increased timeout.
    await page.waitForTimeout(800);
    await expect(challenge).toBeDisabled();
    expect(await page.evaluate(()=>screen)).toBe('settings');
    await page.mouse.up();
   }
  }
 }else{
  await root.locator('.tp-mew-hide-card[data-hint=""]').first().click();
  await expect(root.locator('.tp-mew-hide-progress'))
   .toHaveText('Entdeckungen: 0/3');
  for(let hit=0;hit<3;hit++){
   await root.locator('.tp-mew-hide-card:not([data-hint=""])').click();
   if(hit<2)await expect(root.locator('.tp-mew-hide-progress'))
    .toHaveText('Entdeckungen: '+(hit+1)+'/3');
  }
 }
 await expect(root.locator('.tp-zapdos-challenge')).toBeEnabled();
}
async function begin(page,p){
 const root=pageRoot(page,p);
 await expect(root.locator('.tp-zapdos-challenge')).toBeEnabled();
 await expect(root.locator('canvas[data-dex="'+p.dex+'"]'))
  .toHaveAttribute('data-ready','true');
 await root.locator('.tp-zapdos-challenge').click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.enemy.dex))
  .toBe(p.dex);
 expect(await page.evaluate(()=>Module.ccall(
  'tp_battle_wild_level','number',[],[]
 ))).toBe(50);
 expect(await page.evaluate(()=>TPBattleView.target('catch'))).toBeNull();
}
async function fight(page){
 for(let turn=0;turn<30;turn++){
  if(await page.evaluate(()=>!!fns.battleResolved()))break;
  await H.battleAction(page,'quick');
 }
 expect(await page.evaluate(()=>!!fns.battleResolved())).toBe(true);
 expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);
}
async function saved(page,p){
 await expect.poll(()=>page.evaluate(dex=>Module.ccall(
  'tp_story_duel_get','number',['number','number'],[dex,2]
 ),p.dex)).toBe(1);
 await quiet(page);
}
async function completed(page,p,before){
 await expect(pageRoot(page,p).locator('.tp-zapdos-finale-art')).toBeVisible();
 const done=await state(page,p);
 expect(done.phase).toBe('complete');
 expect(done.pending).toBeNull();
 expect(done.total).toBe(before.total+1);
 expect(done.active).toBe(before.active);
 expect(done.joined).toHaveLength(1);
 expect(done.joined[0].dex).toBe(p.dex);
 expect(done.joined[0].level).toBe(50);
 expect(done.journal).toBe(1);
 const duplicate=await page.evaluate(async()=>{
  try{await TPAdmission.complete({mode:'auto'});return 'UNEXPECTED';}
  catch(error){return error.code;}
 });
 expect(duplicate).toBe('NO_PENDING_ADMISSION');
 await page.reload();await H.waitReady(page);await quiet(page);
 const restored=await state(page,p);
 expect(restored.joined).toEqual(done.joined);
 expect(restored.team).toEqual(done.team);
 expect(restored.journal).toBe(1);
 await H.openStories(page);
 const tile=page.locator('#tp-stories-page button[data-story="'+p.id+'"]');
 await expect(tile).toBeDisabled();
 await expect(tile).toHaveAttribute('data-complete','true');
 return done;
}

for(const p of F.profiles){
 test(p.id+': real minigame, protected encounter and automatic admission',async({page})=>{
  await setup(page,p);
  if(p.id==='mew'){
   const geometry=await pageRoot(page,p).locator('.tp-nugget-scene').evaluate(node=>{
    const center=selector=>{
     const b=node.querySelector(selector).getBBox();return b.x+b.width/2;
    };
    return {
     bridge:center('[data-bridge-deck]'),
     bush:center('[data-hiding-place="bush"]'),
     rock:center('[data-hiding-place="rock"]')
    };
   });
   expect(geometry.bridge).toBeCloseTo(190,1);
   expect(geometry.bridge).toBeGreaterThan(geometry.bush);
   expect(geometry.bridge).toBeLessThan(geometry.rock);
  }
  const before=await state(page,p);
  await solve(page,p);await begin(page,p);await fight(page);await saved(page,p);
  const waiting=await state(page,p);
  expect(waiting.phase).toBe('waiting');
  expect(waiting.total).toBe(before.total);
  expect(waiting.journal).toBe(0);
  await H.battleAction(page,'ok');
  await completed(page,p,before);
 });

 for(const mode of ['replace','late-box']){
  test(p.id+': full team '+mode+' uses saved admission finale',async({page})=>{
   await setup(page,p,{step:2,full:true});
   const before=await state(page,p);
   expect(before.team).toHaveLength(6);
   await begin(page,p);await fight(page);await saved(page,p);
   await H.battleAction(page,'ok');
   await expect(admission(page)).toBeVisible();
   await expect(pageRoot(page,p).locator('.tp-zapdos-finale-art')).toHaveCount(0);
   if(mode==='replace'){
    await admission(page).getByRole('button',{name:'Ins Team aufnehmen',exact:true}).click();
    await expect(admission(page).getByRole('button',{name:/Pflege-Pokémon — fest/})).toBeDisabled();
    await admission(page).getByRole('button',{name:/^Reserve 0 ·/}).click();
   }else{
    await admission(page).getByRole('button',{name:'Später',exact:true}).click();
    expect((await state(page,p)).phase).toBe('waiting');
    expect((await state(page,p)).total).toBe(before.total);
    await page.reload();await H.waitReady(page);await H.game(page);
    await expect(admission(page)).toBeVisible();
    await admission(page).getByRole('button',{name:'In einer Box ablegen',exact:true}).click();
   }
   const done=await completed(page,p,before);
   if(mode==='late-box')expect(done.team).toEqual(before.team);
   else{
    expect(done.team).toHaveLength(6);
    expect(done.team).toContain(done.joined[0].id);
    expect(await page.evaluate(id=>TPCollection.read().mons.some(m=>m.id===id),
     before.team[2])).toBe(true);
   }
  });
 }

 test(p.id+': result and admission quota retry without duplicate reward',async({page})=>{
  await setup(page,p,{step:2});
  const before=await state(page,p);
  await begin(page,p);
  const battle=await page.evaluate(dex=>Module.ccall(
   'tp_story_duel_get','number',['number','number'],[dex,4]
  ),p.dex);
  await page.evaluate(dex=>{
   window.__legendaryWrite=writeSave;
   writeSave=async(bytes,force=false)=>{
    if(force&&Module.ccall('tp_story_duel_get','number',
     ['number','number'],[dex,1]))
     throw Error('intentional legendary result quota');
    return window.__legendaryWrite(bytes,force);
   };
  },p.dex);
  await fight(page);
  await expect.poll(()=>page.evaluate(p=>window[p.ui].error,p))
   .toBe('Speichern fehlgeschlagen. Bitte erneut versuchen.');
  expect((await state(page,p)).pending).toBeNull();
  expect((await state(page,p)).phase).toBe('duel');
  await page.evaluate(()=>{writeSave=window.__legendaryWrite;});
  await H.battleAction(page,'resultRetry');await saved(page,p);
  expect(await page.evaluate(dex=>Module.ccall(
   'tp_story_duel_get','number',['number','number'],[dex,4]
  ),p.dex)).toBe(battle);
  expect((await state(page,p)).wins).toBe(before.wins+1);

  await page.evaluate(()=>{
   writeSave=async()=>{throw Error('intentional legendary admission quota');};
  });
  await H.battleAction(page,'ok');
  await expect(pageRoot(page,p).getByText(
   'Speichern fehlgeschlagen. Bitte erneut versuchen.',{exact:true}
  )).toBeVisible();
  const failed=await state(page,p);
  expect(failed.phase).toBe('waiting');
  expect(failed.total).toBe(before.total);
  expect(failed.journal).toBe(0);
  await expect(pageRoot(page,p).locator('.tp-zapdos-finale-art')).toHaveCount(0);
  await page.evaluate(()=>{writeSave=window.__legendaryWrite;});
  await pageRoot(page,p).getByRole('button',{name:'Aufnahme fortsetzen',exact:true}).click();
  await admission(page).getByRole('button',{name:'Jetzt aufnehmen',exact:true}).click();
  const done=await completed(page,p,before);
  expect(done.wins).toBe(before.wins+1);
 });
}

for(const [id,options,allowed] of [
 ['moltres',{kanto:127},false],
 ['moltres',{kanto:255},true],
 ['mewtwo',{league:false},false],
 ['mewtwo',{league:true},true],
 ['mew',{hall:0},false],
 ['mew',{hall:1},false],
 ['mew',{hall:2},true]
]){
 test(id+': native/catalogue unlock '+JSON.stringify(options),async({page})=>{
  const p=F.profiles.find(p=>p.id===id);
  await H.prepare(page,F.fixture(H.fixture(0),id,options),1);
  await H.openStories(page);
  const tile=page.locator('#tp-stories-page button[data-story="'+id+'"]');
  expect(await page.evaluate(dex=>Module.ccall(
   'tp_story_access','number',['number'],[dex]
  ),p.dex)).toBe(Number(allowed));
  if(allowed){
   await expect(tile).toContainText(p.place);
   await expect(tile).toBeEnabled();
  }else{
   await expect(tile).toHaveCount(0);
   await expect(page.locator('#tp-stories-page'))
    .not.toContainText(p.place);
  }
 });
}

// P06 catalogue progressive discovery with real native prerequisites.
{
 const locations=[
  ['zapdos','Kraftwerk'],
  ['articuno','Eishöhle'],
  ['moltres','Siegesstraße'],
  ['mewtwo','Azuria-Höhle'],
  ['mew','Nuggetbrücke']
 ];
 const cases=[
  {name:'empty',kanto:0,league:false,hall:0,shown:[]},
  {name:'four badges',kanto:15,league:false,hall:0,
   shown:['zapdos']},
  {name:'six badges',kanto:63,league:false,hall:0,
   shown:['zapdos','articuno']},
  {name:'eight badges',kanto:255,league:false,hall:0,
   shown:['zapdos','articuno','moltres']},
  {name:'Kanto champion',kanto:255,league:true,hall:0,
   shown:['zapdos','articuno','moltres','mewtwo']},
  {name:'complete prerequisites',kanto:255,league:true,hall:2,
   shown:['zapdos','articuno','moltres','mewtwo','mew']}
 ];

 for(const scenario of cases){
  test('P06 catalogue: discovery '+scenario.name,async({page})=>{
   await H.prepare(page,F.fixture(H.fixture(0),'mew',{
    kanto:scenario.kanto,
    league:scenario.league,
    hall:scenario.hall
   }),1);

   async function verifyCatalogue(){
    await quiet(page);
    await H.openHub(page);

    const badge=page.locator(
     '#tp-app-page button[data-hub="stories"] .tp-hub-count'
    );
    if(scenario.shown.length){
     await expect(badge).toHaveText(String(scenario.shown.length));
    }else{
     await expect(badge).toHaveCount(0);
    }

    await H.openStories(page);
    const catalogue=page.locator('#tp-stories-page');
    await expect(catalogue).toBeVisible();

    // Verify the real core, not substituted JavaScript access() results.
    const nativeAccess=await page.evaluate(()=>{
     const result={
      zapdos:Module.ccall('tp_zpd_access','number',[],[])
     };
     for(const [id,dex] of [
      ['articuno',144],['moltres',146],
      ['mewtwo',150],['mew',151]
     ]){
      result[id]=Module.ccall(
       'tp_story_access','number',['number'],[dex]
      );
     }
     return result;
    });
    expect(nativeAccess).toEqual(Object.fromEntries(
     locations.map(([id])=>[id,Number(scenario.shown.includes(id))])
    ));

    await expect(catalogue.locator('button[data-story]'))
     .toHaveCount(scenario.shown.length);

    for(const [id,place] of locations){
     const tile=catalogue.locator('button[data-story="'+id+'"]');
     if(scenario.shown.includes(id)){
      await expect(tile).toHaveCount(1);
      await expect(tile).toBeEnabled();
      await expect(tile).toContainText(place);
      await expect(tile).toHaveAttribute('data-complete','false');
      await expect(tile.locator('.tp-story-open-dot')).toHaveCount(1);
     }else{
      await expect(tile).toHaveCount(0);
      await expect(catalogue).not.toContainText(place);
     }
    }

    const empty=catalogue.locator('.tp-stories-empty');
    if(scenario.shown.length){
     await expect(empty).toHaveCount(0);
    }else{
     await expect(empty).toBeVisible();
     await expect(empty).toHaveAttribute('role','status');
     await expect(empty).toHaveText(
      'Hier ist noch nichts zu entdecken. Komm später wieder!'
     );
    }

    await expect(catalogue.locator('.tp-story-open-dot'))
     .toHaveCount(scenario.shown.length);
    await expect(catalogue).not.toContainText('Freischaltung');
    await expect(catalogue).not.toContainText(
     /Zapdos|Arktos|Articuno|Lavados|Moltres|Mewtu|Mewtwo|\bMew\b/
    );
   }

   await verifyCatalogue();
   await page.reload();
   await H.waitReady(page);
   await verifyCatalogue();
  });
 }
}
