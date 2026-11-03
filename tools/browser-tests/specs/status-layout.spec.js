const {test,expect}=require('@playwright/test');
const H=require('./helpers');
test.beforeEach(async({page})=>{await H.prepare(page);});

for(const width of [320,390,480]){
 test('Status: vier Rubriken, Rahmen und unveränderte Pflege '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const root=await H.openStatus(page);
  await expect(root.locator('[data-status-tab]')).toHaveCount(4);
  const before=await page.evaluate(()=>({
   active:TPCollection.read().active,
   ids:TPCollection.read().mons.map(mon=>mon.id),
   records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()]
  }));
  for(const tab of ['profile','values','today','achievements']){
   await root.locator('[data-status-tab="'+tab+'"]').click();
   await expect(root).toHaveAttribute('data-status-view',tab);
   await expect.poll(()=>page.evaluate(()=>{
    const root=document.getElementById('tp-status-page');
    const panes=Array.from(root.querySelectorAll('.tp-pokedex-display'))
     .map(element=>element.getBoundingClientRect());
    const buttons=Array.from(root.querySelectorAll('[data-status-tab]'));
    return panes.length===2&&panes[0].right<panes[1].left&&buttons.every(element=>{
     const r=element.getBoundingClientRect();
     return r.width>=43&&r.height>=43&&
      r.bottom<=Math.min(...panes.map(pane=>pane.top))-1;
    });
   })).toBe(true);
   expect(await page.evaluate(()=>screen)).toBe('card');
  }
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,
   ids:TPCollection.read().mons.map(mon=>mon.id),
   records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()]
  }))).toEqual(before);
  await page.keyboard.press('Escape');
  await expect(root).not.toBeVisible();
  expect(await page.evaluate(()=>screen)).toBe('idle');
 });
}
test('Status: echte Werte, Tagesziele und Medaillen vollständig erreichbar',async({page})=>{
 const root=await H.openStatus(page);
 await root.locator('[data-status-tab="values"]').click();
 const values=await page.evaluate(()=>[fns.atkStat(),fns.defStat(),fns.speStat()]);
 for(let index=0;index<3;index++){
  await expect(root.locator('[data-status-stat="'+index+'"]'))
   .toHaveAttribute('data-value',String(values[index]));
 }
 await root.locator('[data-status-tab="today"]').click();
 const goals=await page.evaluate(()=>fns.dailyGoalCount());
 await expect(root.locator('[data-status-goal]')).toHaveCount(goals);
 await root.locator('[data-status-tab="achievements"]').click();
 const count=await page.evaluate(()=>fns.medalCount());
 await expect(root.locator('[data-status-medal]')).toHaveCount(count);
 if(count){
  const first=root.locator('[data-status-medal="0"]');
  await first.scrollIntoViewIfNeeded();await first.click();
  await expect(root.locator('.tp-status-scroll').nth(1))
   .toContainText(await page.evaluate(()=>fns.medalDescription(0)));
 }
 const records=root.locator('[data-status-achievement="records"]');
 await records.scrollIntoViewIfNeeded();await records.click();
 await expect(root.locator('[data-status-record]')).toHaveCount(5);
 const battle=root.locator('[data-status-achievement="battle"]');
 await battle.scrollIntoViewIfNeeded();await battle.click();
 await expect(root.locator('[data-battle-best] strong')).toHaveText(String(await page.evaluate(()=>fns.bestBattleStreak())));
});
test('Status: Namensänderung öffnet Eingabe rechts im Profil',async({page})=>{
 const root=await H.openStatus(page);
 const before=await page.evaluate(()=>({
  active:TPCollection.read().active,
  draft:fns.hasNick()!==0?fns.name():''
 }));
 await root.locator('[data-status-rename]').click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 await expect(root).toBeVisible();
 await expect(root.locator('#tp-inline-name')).toBeVisible();
 expect(await page.evaluate(()=>nameDraft)).toBe(before.draft);
 expect(await page.evaluate(()=>TPCollection.read().active)).toBe(before.active);
});


test('Status: Profilplaketten und feste Wertefarben',async({page})=>{
 const root=await H.openStatus(page);
 await root.locator('[data-status-tab="profile"]').click();
 const right=root.locator('.tp-status-scroll').nth(1);
 await expect(right.locator('.tp-status-personality')).toBeVisible();
 await expect(right.locator('.tp-status-bond')).toBeVisible();
 const left=root.locator('.tp-status-scroll').nth(0);
 await expect(left.locator('.tp-status-profile-metric')).toHaveCount(2);
 await expect(left.locator('[data-status-age]')).toBeVisible();
 await expect(left.locator('[data-status-care-streak]')).toBeVisible();
 await expect(right.locator('.tp-status-bond h3')).toHaveText('Bindung');
 const berry=await page.evaluate(()=>{
  const info=fns.infoLine().trim(),age=fns.personalityAgeLine().trim();
  return {info,age,separated:info.endsWith(age),
   label:info.slice(0,-age.length).trim()};
 });
 expect(berry.separated).toBe(true);
 await expect(right.locator('[data-status-berry]')).not.toContainText(berry.age);
 await expect(right.locator('[data-status-berry]'))
  .toHaveAttribute('title',berry.label);
 await expect(right.locator('[data-status-care-patzer] strong'))
  .toHaveText(String(await page.evaluate(()=>fns.careMistakes())));
 await expect(root.locator('[data-status-rename]')).toHaveCount(1);

 await root.locator('[data-status-tab="values"]').click();
 const colours=['rgb(200, 88, 88)','rgb(78, 147, 97)','rgb(209, 173, 56)'];
 const values=await page.evaluate(()=>[fns.atkStat(),fns.defStat(),fns.speStat()]);
 for(let index=0;index<3;index++){
  const row=root.locator('[data-status-stat="'+index+'"]');
  await expect(row).toHaveAttribute('data-value',String(values[index]));
  await expect(row.locator('.tp-status-track>span'))
   .toHaveCSS('background-color',colours[index]);
 }
 await expect(right.locator('.tp-status-training-scene')).toBeVisible();
 await expect(right.locator('.tp-status-evolution'))
  .toContainText(await page.evaluate(()=>fns.evolutionStatus()));
 await expect(right.locator('.tp-status-care')).toHaveCount(0);
});


for(const width of [320,390,480]){
 test('Statusprofil: ohne Scrollen und Wesensdetails '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const root=await H.openStatus(page);
  await root.locator('[data-status-tab="profile"]').click();
  async function fits(){
   await expect.poll(()=>page.evaluate(()=>{
    const root=document.getElementById('tp-status-page');
    const panes=Array.from(root.querySelectorAll('.tp-status-scroll'));
    return panes.length===2&&panes.every(pane=>{
     const outer=pane.getBoundingClientRect();
     return pane.scrollHeight<=pane.clientHeight+1&&
      Array.from(pane.children).every(child=>{
       const r=child.getBoundingClientRect();
       return r.top>=outer.top-1&&r.bottom<=outer.bottom+1;
      });
    });
   })).toBe(true);
  }
  await fits();
  const before=await page.evaluate(()=>({
   active:TPCollection.read().active,
   streak:fns.streak(),best:fns.bestStreak(),bond:fns.bond()
  }));
  await root.locator('[data-status-personality]').click();
  await expect(root).toHaveAttribute('data-status-profile-mode','personality');
  await expect(root.locator('.tp-status-personality-full')).toBeVisible();
  await fits();
  await root.locator('[data-status-back]').click();
  await expect(root).toHaveAttribute('data-status-profile-mode','summary');
  expect(await page.evaluate(()=>screen)).toBe('card');
  await fits();
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,
   streak:fns.streak(),best:fns.bestStreak(),bond:fns.bond()
  }))).toEqual(before);
 });
}


test('Statusprofil: Stift direkt am Namen ohne sichtbare Kachel',async({page})=>{
 const root=await H.openStatus(page);
 await root.locator('[data-status-tab="profile"]').click();
 const edit=root.locator('.tp-status-name-row [data-status-rename]');
 await expect(edit).toHaveCount(1);
 await expect(edit).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 await expect(edit).toHaveCSS('border-top-width','0px');
 await expect(root.locator('.tp-status-tabs [data-status-rename]')).toHaveCount(0);
 const valid=await edit.evaluate(element=>{
  const name=element.closest('.tp-status-name-row').querySelector('h3').getBoundingClientRect();
  const glyph=element.querySelector('.tp-status-icon').getBoundingClientRect();
  return glyph.left>=name.right&&glyph.width<=18&&glyph.height<=18;
 });
 expect(valid).toBe(true);
});


test('Statusprofil: Name, Level und Plakettenüberschriften zentriert',async({page})=>{
 const root=await H.openStatus(page);
 await root.locator('[data-status-tab="profile"]').click();
 await expect.poll(()=>page.evaluate(()=>{
  const root=document.getElementById('tp-status-page');
  const pane=root.querySelector('.tp-pokedex-display-left').getBoundingClientRect();
  const name=root.querySelector('.tp-status-name-stack>h3');
  const level=root.querySelector('.tp-status-name-stack>p');
  const r=name.getBoundingClientRect();
  const nameCentered=Math.abs((r.left+r.right)/2-(pane.left+pane.right)/2)<=1;
  const levelCentered=getComputedStyle(level).textAlign==='center';
  const cards=Array.from(root.querySelectorAll('.tp-status-personality,.tp-status-bond'));
  const headingsCentered=cards.length===2&&cards.every(card=>{
   const icon=card.querySelector('.tp-status-plaque-head>.tp-status-icon')
    .getBoundingClientRect();
   const heading=card.querySelector('.tp-status-plaque-head>h3')
    .getBoundingClientRect();
   const box=card.getBoundingClientRect();
   const left=Math.min(icon.left,heading.left);
   const right=Math.max(icon.right,heading.right);
   return Math.abs((left+right)/2-(box.left+box.right)/2)<=1;
  });
  return nameCentered&&levelCentered&&headingsCentered;
 })).toBe(true);
});


for(const width of [320,390,480]){
 test('Werte: Wachstum, Training und Entwicklung ohne Scrollen '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const root=await H.openStatus(page);
  await root.locator('[data-status-tab="values"]').click();
  await expect(root).toHaveAttribute('data-status-view','values');
  await expect(root.locator('[data-status-training]')).toHaveCount(3);
  const values=await page.evaluate(()=>({
   stats:[fns.atkStat(),fns.defStat(),fns.speStat()],
   training:[17,18,19].map(index=>Module.ccall('tp_c2_get','number',['number'],[index])),
   into:fns.minutesIntoLevel(),per:fns.minutesPerLevel(),level:fns.level()
  }));
  const scale=Math.max(260,...values.stats);
  for(let index=0;index<3;index++){
   await expect(root.locator('[data-status-stat="'+index+'"]'))
    .toHaveAttribute('data-value',String(values.stats[index]));
   await expect(root.locator('[data-status-stat="'+index+'"]'))
    .toHaveAttribute('data-scale',String(scale));
   await expect(root.locator('[data-status-training="'+index+'"]'))
    .toHaveAttribute('data-value',String(values.training[index]));
  }
  const ratio=values.level>=100?1:
   Math.max(0,Math.min(1,values.into/Math.max(1,values.per)));
  await expect(root.locator('.tp-status-growth-ring')).toHaveCount(0);
  await root.locator('[data-status-tab="profile"]').click();
  await expect(root.locator('.tp-status-growth-ring'))
   .toHaveAttribute('aria-valuenow',String(Math.round(ratio*100)));
  await root.locator('[data-status-tab="values"]').click();
  await expect.poll(()=>page.evaluate(()=>{
   const root=document.getElementById('tp-status-page');
   const panes=Array.from(root.querySelectorAll('.tp-status-scroll'));
   return panes.length===2&&panes.every(pane=>{
    const outer=pane.getBoundingClientRect();
    return pane.scrollHeight<=pane.clientHeight+1&&
     Array.from(pane.children).every(child=>{
      const r=child.getBoundingClientRect();
      return r.top>=outer.top-1&&r.bottom<=outer.bottom+1;
     });
   });
  })).toBe(true);
 });
}

test('Werte: Maximallevel zeigt keine weitere Levelankündigung',async({page})=>{
 const base=H.fixture(0),fields=[];let at=4;
 for(let i=0;i<base.readUInt32LE(0);i++){
  const start=at,length=base[at++];
  const key=base.toString('utf8',at,at+length);at+=length;
  const type=base[at++],size=base.readUInt32LE(at);at+=4;
  const value=Buffer.from(base.subarray(at,at+size));at+=size;
  if(key==='age'){
   expect(type).toBe(1);expect(size).toBe(8);
   value.writeBigInt64LE(1000000n);
   fields.push(Buffer.concat([base.subarray(start,at-size),value]));
  }else fields.push(base.subarray(start,at));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.length);
 await H.importSave(page,Buffer.concat([count,...fields]));
 const root=await H.openStatus(page);
 await root.locator('[data-status-tab="profile"]').click();
 expect(await page.evaluate(()=>fns.level())).toBe(100);
 await expect(root.locator('.tp-status-growth-line'))
  .toContainText('MAX');
 await expect(root.locator('.tp-status-growth-ring'))
  .toHaveAttribute('aria-valuenow','100');
 await expect(root.locator('.tp-status-growth-line'))
  .not.toContainText(await page.evaluate(()=>fns.nextLevelLine()));
});


test('Werte: Entwicklungs-Direkteinstieg und Rückkehr ohne Datenänderung',async({page})=>{
 const root=await H.openStatus(page);
 await root.locator('[data-status-tab="values"]').click();
 const before=await page.evaluate(()=>({
  active:TPCollection.read().active,
  ids:TPCollection.read().mons.map(mon=>mon.id),
  dex:fns.speciesId()
 }));
 await root.locator('[data-status-evolution]').click();
 const evolution=page.locator('.tp-evolution-modal:visible');
 await expect(evolution).toBeVisible();
 await expect(root).not.toBeVisible();
 const growth=await page.evaluate(()=>({
  level:fns.level(),into:fns.minutesIntoLevel(),per:fns.minutesPerLevel(),
  text:fns.nextLevelLine()
 }));
 const ratio=growth.level>=100?1:
  Math.max(0,Math.min(1,growth.into/Math.max(1,growth.per)));
 await expect(evolution.locator('.tp-evo-growth-ring')).toBeVisible();
 await expect(evolution.locator('.tp-evo-growth-ring'))
  .toHaveAttribute('aria-valuenow',String(Math.round(ratio*100)));
 if(growth.level<100){
  await expect(evolution.locator('.tp-evo-growth-caption')).toHaveText(growth.text);
 }
 await expect(evolution.locator('.tp-evo-frame .tp-pokedex-display')).toHaveCount(2);
 await evolution.locator('.tp-modal-head button').click();
 await expect(evolution).not.toBeVisible();
 await expect(root).toBeVisible();
 await expect(root).toHaveAttribute('data-status-view','values');
 expect(await page.evaluate(()=>({screen,page:cardPage})))
  .toEqual({screen:'card',page:4});
 expect(await page.evaluate(()=>({
  active:TPCollection.read().active,
  ids:TPCollection.read().mons.map(mon=>mon.id),
  dex:fns.speciesId()
 }))).toEqual(before);
});


test('Profil: kleiner Abstand zwischen Name und Levelhinweis',async({page})=>{
 const root=await H.openStatus(page);
 await root.locator('[data-status-tab="profile"]').click();
 const gap=await root.locator('.tp-status-name-stack').evaluate(element=>{
  const name=element.querySelector('h3').getBoundingClientRect();
  const level=element.querySelector('.tp-status-growth-line').getBoundingClientRect();
  return level.top-name.bottom;
 });
 expect(gap).toBeGreaterThanOrEqual(3);
});
