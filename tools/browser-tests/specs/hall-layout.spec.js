
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers'),HU=require('./hall-ui-helpers');
const F=require('./johto-review-fixtures');

for(const width of [320,390,430]){
 test('Ruhmeshalle: gespeicherter Sieger, zwei Displays und Ehrung ohne automatische Buchung '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page,F.createCases()[0].raw);
  await HU.open(page,0);
  const root=page.locator('#tp-hall-page');
  const record=await page.evaluate(()=>TPHall.view.records[
   TPHall.diagnostics.selected
  ]);
  await expect(root.locator('.tp-hall-portrait'))
   .toHaveAttribute('data-hall-dex',String(record.dex));
  await expect(root.locator('.tp-hall-plaque:visible')).toContainText(record.nick);
  expect(await page.evaluate(()=>fns.speciesId())).toBe(1);
  const before=await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }));
  await expect(root.locator('[data-hall-detail-panel]')).toBeHidden();
  await root.locator('[data-hall-info]').click();
  await expect(root.locator('[data-hall-detail-panel]')).toBeVisible();
  await expect(root.locator('.tp-hall-info')).toContainText(record.nick);
  await HU.back(page);
  await expect(root.locator('[data-hall-detail-panel]')).toBeHidden();
  expect(await page.evaluate(()=>TPHall.active)).toBe(true);
  await root.locator('[data-hall-celebrate]').click();
  await expect(root).toHaveAttribute('data-hall-celebration','true');
  await expect(root.locator('[data-hall-acknowledge]')).toBeVisible();
  expect(await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }))).toEqual(before);
  const scene=await root.locator('.tp-hall-stage').boundingBox();
  const body=await root.locator('.tp-activity-body').boundingBox();
  const variant=await page.evaluate(()=>TPHall.layoutVariant);
  expect(scene.x).toBeGreaterThanOrEqual(body.x-1);
  expect(scene.y).toBeGreaterThanOrEqual(body.y-1);
  expect(scene.x+scene.width).toBeLessThanOrEqual(body.x+body.width+1);
  expect(scene.y+scene.height).toBeLessThanOrEqual(body.y+body.height+1);
  if(variant===1){
   expect(Math.abs(scene.width-body.width)).toBeLessThanOrEqual(1);
   expect(Math.abs(scene.height-body.height)).toBeLessThanOrEqual(1);
  }else{
   const gallery=await root.locator('.tp-hall-gallery').boundingBox();
   const spine=root.locator('.tp-activity-frame .tp-pokedex-spine');
   await expect(spine).toBeVisible();
   const middle=await spine.boundingBox();
   if(variant>=3){
    expect(scene.y+scene.height).toBeLessThanOrEqual(middle.y+1);
    expect(middle.y+middle.height).toBeLessThanOrEqual(gallery.y+1);
    expect(middle.width).toBeGreaterThan(middle.height);
   }else{
    expect(scene.x+scene.width).toBeLessThanOrEqual(middle.x+1);
    expect(middle.x+middle.width).toBeLessThanOrEqual(gallery.x+1);
   }
   expect(gallery.x).toBeGreaterThanOrEqual(body.x-1);
   expect(gallery.y).toBeGreaterThanOrEqual(body.y-1);
   expect(gallery.x+gallery.width).toBeLessThanOrEqual(body.x+body.width+1);
   expect(gallery.y+gallery.height).toBeLessThanOrEqual(body.y+body.height+1);
  }
  expect(await root.locator('.tp-hall-stage').evaluate(el=>
   getComputedStyle(el).transform
  )).toBe('none');
  await HU.back(page);
  await expect.poll(()=>page.evaluate(()=>TPHall.active)).toBe(false);
  await expect(root).toBeHidden();
  expect(await page.evaluate(()=>TPHall.view.seen)).toBe(before.seen);
 });
}


for(const size of [
 {width:568,height:320},{width:844,height:390},{width:926,height:430}
]){
 test('Ruhmeshalle V2: Querformat, freier Mittelsteg und Größenrückkehr '+
 size.width+'x'+size.height,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await H.prepare(page,F.createCases()[0].raw);
  await HU.open(page,0);
  test.skip(await page.evaluate(()=>TPHall.layoutVariant)!==2,
   'Rückfallprüfung nur bei aktiver Variante 2.');
  await page.setViewportSize(size);
  const root=page.locator('#tp-hall-page');
  await expect(root).toHaveAttribute('data-hall-layout-variant','2');
  const shell=page.locator('#tp-game-shell');
  await expect(shell).toHaveAttribute('data-hall-layout','v2');
  const box=await shell.boundingBox();
  expect(box.width).toBeGreaterThan(box.height);
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x+box.width).toBeLessThanOrEqual(size.width+1);
  expect(box.y+box.height).toBeLessThanOrEqual(size.height+1);
  const stage=await root.locator('.tp-hall-stage').boundingBox();
  const gallery=await root.locator('.tp-hall-gallery').boundingBox();
  const middle=root.locator('.tp-activity-frame .tp-pokedex-spine');
  await expect(middle).toBeVisible();
  const spine=await middle.boundingBox();
  expect(stage.x+stage.width).toBeLessThanOrEqual(spine.x+1);
  expect(spine.x+spine.width).toBeLessThanOrEqual(gallery.x+1);
  const before=await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }));
  await root.locator('[data-hall-info]').click();
  await expect(root.locator('[data-hall-detail-panel]')).toBeVisible();
  await HU.back(page);
  await expect(root.locator('[data-hall-detail-panel]')).toBeHidden();
  expect(await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }))).toEqual(before);
  await HU.back(page);
  await expect(shell).not.toHaveAttribute('data-hall-layout','v2');
 });
}


for(const size of [
 {width:320,height:568},{width:390,height:844},{width:430,height:844}
]){
 test('Ruhmeshalle V3: horizontale Displays und gemeinsame Farben '+
 size.width+'x'+size.height,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await H.prepare(page,F.createCases()[0].raw);
  await HU.open(page,0);
  test.skip(await page.evaluate(()=>TPHall.layoutVariant)!==3,
   'Darstellungsprüfung nur bei aktiver Variante 3.');
  await page.setViewportSize(size);
  const root=page.locator('#tp-hall-page');
  await expect(root).toHaveAttribute('data-hall-layout-variant','3');
  const shell=page.locator('#tp-game-shell');
  await expect(shell).toHaveAttribute('data-hall-layout','v3');
  const box=await shell.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x+box.width).toBeLessThanOrEqual(size.width+1);
  expect(box.y+box.height).toBeLessThanOrEqual(size.height+1);

  const upper=await root.locator('.tp-hall-stage').boundingBox();
  const lower=await root.locator('.tp-hall-gallery').boundingBox();
  const spine=root.locator('.tp-activity-frame .tp-pokedex-spine');
  await expect(spine).toBeVisible();
  const middle=await spine.boundingBox();
  expect(upper.y+upper.height).toBeLessThanOrEqual(middle.y+1);
  expect(middle.y+middle.height).toBeLessThanOrEqual(lower.y+1);
  expect(middle.width).toBeGreaterThan(middle.height);
  expect(Math.abs(upper.width-lower.width)).toBeLessThanOrEqual(1);
  await expect(root.locator('.tp-hall-gallery-canvas')).toBeHidden();

  const colors=await page.evaluate(()=>{
   const host=document.getElementById('tp-game-shell');
   const root=document.getElementById('tp-hall-page');
   const sample=document.createElement('span');
   sample.style.backgroundColor=
    getComputedStyle(root).getPropertyValue('--tp-pokedex-display').trim();
   host.append(sample);
   const expected=getComputedStyle(sample).backgroundColor;
   sample.remove();
   const p=root.querySelector('.tp-hall-portrait');
   return {
    expected,
    upper:getComputedStyle(root.querySelector('.tp-hall-stage')).backgroundColor,
    lower:getComputedStyle(root.querySelector('.tp-hall-gallery')).backgroundColor,
    pixel:Array.from(p.getContext('2d').getImageData(0,0,1,1).data)
   };
  });
  expect(colors.upper).toBe(colors.expected);
  expect(colors.lower).toBe(colors.expected);
  expect('rgb('+colors.pixel.slice(0,3).join(', ')+')').toBe(colors.expected);
  expect(colors.pixel[3]).toBe(255);

  const before=await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }));
  await root.locator('[data-hall-info]').click();
  await expect(root.locator('[data-hall-detail-panel]')).toBeVisible();
  await HU.back(page);
  await expect(root.locator('[data-hall-detail-panel]')).toBeHidden();
  expect(await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }))).toEqual(before);
  await HU.back(page);
  await expect(shell).not.toHaveAttribute('data-hall-layout','v3');
 });
}


for(const size of [
 {width:320,height:568},{width:390,height:844},
 {width:844,height:390}
]){
 test('Ruhmeshalle V4: ganzes Gerät gedreht, Linse mitgedreht '+
 size.width+'x'+size.height,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await H.prepare(page,F.createCases()[0].raw);
  await HU.open(page,0);
  test.skip(await page.evaluate(()=>TPHall.layoutVariant)!==4,
   'Gesamtdrehungsprüfung nur bei aktiver Variante 4.');
  await page.setViewportSize(size);
  const root=page.locator('#tp-hall-page');
  const shell=page.locator('#tp-game-shell');
  await expect(shell).toHaveAttribute('data-hall-layout','v4');
  const box=await root.boundingBox();
  expect(Math.abs(box.width-box.height)).toBeLessThanOrEqual(1);
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x+box.width).toBeLessThanOrEqual(size.width+1);
  expect(box.y+box.height).toBeLessThanOrEqual(size.height+1);

  const geometry=await root.evaluate(el=>{
   const m=new DOMMatrix(getComputedStyle(el).transform);
   const canvas=el.querySelector('.tp-hall-portrait');
   const upright=m.multiply(new DOMMatrix(getComputedStyle(canvas).transform));
   const lens=getComputedStyle(el,'::before');
   const probe=document.createElement('span');
   Object.assign(probe.style,{
    position:'absolute',left:lens.left,top:lens.top,
    width:lens.width,height:lens.height,boxSizing:lens.boxSizing,
    border:lens.borderTopWidth+' solid transparent',
    opacity:'0',pointerEvents:'none'
   });
   el.append(probe);
   const p=probe.getBoundingClientRect();
   const result={
    rotation:[m.a,m.b,m.c,m.d],
    upright:[upright.a,upright.b,upright.c,upright.d],
    lens:{x:p.x+p.width/2,y:p.y+p.height/2}
   };
   probe.remove();return result;
  });
  [0,1,-1,0].forEach((value,index)=>
   expect(geometry.rotation[index]).toBeCloseTo(value,5));
  [1,0,0,1].forEach((value,index)=>
   expect(geometry.upright[index]).toBeCloseTo(value,5));
  expect(geometry.lens.x).toBeGreaterThan(box.x+box.width/2);
  expect(geometry.lens.y).toBeLessThan(box.y+box.height/2);

  const upper=await root.locator('.tp-hall-stage').boundingBox();
  const lower=await root.locator('.tp-hall-gallery').boundingBox();
  const middle=await root.locator('.tp-activity-frame .tp-pokedex-spine').boundingBox();
  expect(upper.y+upper.height).toBeLessThanOrEqual(middle.y+1);
  expect(middle.y+middle.height).toBeLessThanOrEqual(lower.y+1);
  expect(middle.width).toBeGreaterThan(middle.height);

  const before=await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }));
  await root.locator('[data-hall-info]').click();
  await expect(root.locator('[data-hall-detail-panel]')).toBeVisible();
  await HU.back(page);
  await expect(root.locator('[data-hall-detail-panel]')).toBeHidden();
  expect(await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }))).toEqual(before);
  await HU.back(page);
  await expect(shell).not.toHaveAttribute('data-hall-layout','v4');
  await expect(root).toBeHidden();
  expect(await shell.evaluate(el=>
   getComputedStyle(el).position)).not.toBe('fixed');
 });
}


for(const width of [320,390,430]){
 test('Ruhmeshalle V4 Details: Rahmenabstand, Raumgrafik und Urkunde '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page,F.createCases()[0].raw);
  await HU.open(page,0);
  const root=page.locator('#tp-hall-page');
  await expect(root).toHaveAttribute('data-hall-detail-revision','1');
  const heading=root.locator('.tp-activity-head h2');
  await expect(heading).toHaveText('Ruhmeshalle');
  expect(await heading.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  const back=root.locator('[data-hall-back]');
  await expect(back).toHaveAccessibleName('Zurück');
  await expect(back.locator('[data-hall-back-icon="curved-left"]')).toBeVisible();
  const counter=await root.locator('.tp-hall-entry-counter').boundingBox();
  const body=await root.locator('.tp-activity-body').boundingBox();
  expect(counter.x+counter.width).toBeLessThanOrEqual(body.x-1);
  await expect(root.locator('.tp-hall-entry-counter')).toHaveText(/^\d+\/\d+$/);
  await expect.poll(()=>root.locator('.tp-hall-portrait').evaluate(el=>{
   const p=el.getContext('2d');
   const pixel=(x,y)=>Array.from(p.getImageData(x,y,1,1).data);
   return {
    wall:pixel(0,0),
    floor:pixel(0,279),
    carpet:pixel(280,270)
   };
  })).toEqual({
   wall:[214,200,171,255],
   floor:[221,211,189,255],
   carpet:[146,63,67,255]
  });
  const record=await page.evaluate(()=>TPHall.view.records[TPHall.diagnostics.selected]);
  const certificate=root.locator('[data-hall-certificate="true"]');
  await expect(certificate).toContainText('Kanto-Liga');
  await expect(certificate).toContainText(record.nick);
  await expect(certificate).toContainText('Sieg-Level '+record.level);
  await expect(certificate).toContainText('Sieg '+record.sequence);
  const before=await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }));
  await root.locator('[data-hall-info]').click();
  await HU.back(page);
  expect(await page.evaluate(()=>({
   records:TPHall.view.records,seen:TPHall.view.seen,
   model:TPCollectionModel.encode(TPCollection.read())
  }))).toEqual(before);
  await HU.back(page);
  await expect(page.locator('#tp-game-shell')).not.toHaveAttribute('data-hall-layout','v4');
 });
}
