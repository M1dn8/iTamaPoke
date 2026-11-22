 'use strict';
const {test,expect}=require('@playwright/test');
const path=require('node:path');
const H=require('./helpers');
for(const width of [320,390])test('P07a Quelle: gemeinsame Storybühne '+width,async({page})=>{
 await page.setViewportSize({width,height:844});
 await H.prepare(page,H.fixture(0));
 const snapshot=()=>page.evaluate(()=>({
  active:TPCollection.read().active,team:TPCollection.read().team,
  ids:TPCollection.read().mons.map(m=>m.id),
  steps:[144,146,150,151].map(d=>Module.ccall('tp_story_step','number',['number'],[d]))
 }));
 const before=await snapshot();
 for(const file of ['story-stage.js','story-narrative.js','suicune-source-preview.js','suicune-story-stage.js'])
  await page.addScriptTag({path:path.resolve(__dirname,'../../../browser_ver/web',file)});
 await page.evaluate(()=>TPSuicuneSourcePreview.open(2));
 const stage=page.locator('#tp-story-stage');
 await expect(stage).toBeVisible();
 const tiles=stage.locator('[data-sui-tile]');
 await expect(tiles).toHaveCount(3);
 await expect(stage.locator('[data-sui-select]')).toHaveCount(0);
 await expect(stage.locator('[data-sui-rotate]')).toHaveCount(0);
 for(const tile of await tiles.all()){
  const box=await tile.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
 }
 const geometry=await page.evaluate(()=>{
  const s=TPStoryStage.state();
  const lower=document.querySelector('#tp-story-stage .tp-story-copy');
  const bounds=lower.getBoundingClientRect();
  return {
   ...s,viewportWidth:innerWidth,viewportHeight:innerHeight,
   contents:[...lower.children].map(n=>{
    const r=n.getBoundingClientRect();
    return {bottom:r.bottom,right:r.right};
   }),
   bottom:bounds.bottom,right:bounds.right
  };
 });
 expect(geometry.upper.y+geometry.upper.height).toBeLessThanOrEqual(geometry.lower.y);
 expect(geometry.hull.x).toBeGreaterThanOrEqual(0);
 expect(geometry.hull.y).toBeGreaterThanOrEqual(0);
 expect(geometry.hull.x+geometry.hull.width).toBeLessThanOrEqual(geometry.viewportWidth);
 expect(geometry.hull.y+geometry.hull.height).toBeLessThanOrEqual(geometry.viewportHeight);
 expect(geometry.lowerOverflow).toBe(false);
 for(const part of geometry.contents){
  expect(part.bottom).toBeLessThanOrEqual(geometry.bottom);
  expect(part.right).toBeLessThanOrEqual(geometry.right);
 }
 for(const index of [0,0,1,1,1,2])
  await stage.locator('[data-sui-tile="'+index+'"]').click();
 expect(await page.evaluate(()=>TPSuicuneSourcePreview.state().solved)).toBe(true);
 expect(await page.evaluate(()=>TPSuicuneSourcePreview.state().moves)).toBe(6);
 await expect(stage).toHaveAttribute('data-sui-phase','clear');
 expect(await snapshot()).toEqual(before);
 const clearCard=stage.locator('.tp-story-card');
 await expect(clearCard).toBeVisible();
 const clearPages=Number(await clearCard.getAttribute('data-pages'));
 expect(clearPages).toBeGreaterThanOrEqual(1);
 for(let i=1;i<clearPages;i++)
  await clearCard.locator('[data-story-next]').click();
 await stage.getByRole('button',{name:'Zum anderen Ufer',exact:true}).click();
 await expect(stage).toHaveAttribute('data-sui-phase','encounter');
 await expect(stage.locator('canvas.tp-sui-portrait')).toBeVisible();
 await expect(stage.getByRole('button',{name:'Prüfkampf noch nicht angebunden'})).toBeDisabled();
 expect(await snapshot()).toEqual(before);
 await page.locator('#tp-game-shell').screenshot({
  path:test.info().outputPath('suicune-storybuehne-'+width+'.png')
 });
 await stage.locator('.tp-story-frame-back-slot button').click();
 await expect(stage).toHaveCount(0);
 expect(await page.locator('#tp-app-page').evaluate(n=>n.inert)).toBe(false);
 expect(await snapshot()).toEqual(before);
});

// P07a portrait-layer regression: real component, isolated layout fixture.
test('P07a Arktos: Porträtebenen in der Storybühne',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await H.prepare(page,H.fixture(0));
 const before=await page.evaluate(()=>TPArktos.read());
 for(const file of ['story-stage.js','story-narrative.js','articuno-story-stage.js'])
  await page.addScriptTag({
   path:path.resolve(__dirname,'../../../browser_ver/web',file)
  });

 await page.evaluate(()=>{
  TPAppMenu.show('stories');
  const body=document.createElement('div');
  body.id='tp-articuno-page';
  document.getElementById('tp-app-page').append(body);
  const art=TPZapdosPortrait.create(
   (...args)=>TPArktosText.t(...args),
   {dex:144,scene:()=>TPIceCaveScene.create('inner')}
  );
  window.p07aLayoutPortrait=art;
  body.append(art.element);
  TPArticunoStoryStage.open();
 });

 const stage=page.locator('#tp-story-stage');
 const art=stage.locator('.tp-zapdos-portrait');
 const canvas=art.locator('canvas[data-dex="144"]');
 await expect(art).toBeVisible();
 await expect(art).toHaveCSS('isolation','isolate');
 await expect(canvas).toHaveCSS('position','absolute');
 await expect(canvas).toHaveCSS('z-index','1');
 await expect(canvas).toHaveAttribute('data-ready',/^(true|missing)$/);

 const geometry=await canvas.evaluate(n=>{
  const a=n.getBoundingClientRect();
  const b=n.parentElement.getBoundingClientRect();
  return {
   width:a.width,height:a.height,
   inside:a.left>=b.left&&a.top>=b.top&&
    a.right<=b.right&&a.bottom<=b.bottom
  };
 });
 expect(geometry.width).toBeGreaterThan(0);
 expect(geometry.height).toBeGreaterThan(0);
 expect(geometry.inside).toBe(true);
 expect(await page.evaluate(()=>TPArktos.read())).toEqual(before);

 await page.evaluate(()=>{
  TPArticunoStoryStage.dispose();
  TPArticunoStoryStage.resume(document.getElementById('tp-articuno-page'));
 });
 await expect(stage).toBeVisible();
 await expect(stage.locator('canvas[data-dex="144"]')).toHaveCSS('position','absolute');
 expect(await page.evaluate(()=>TPArktos.read())).toEqual(before);
 await page.evaluate(()=>{
  TPArticunoStoryStage.dispose();
  window.p07aLayoutPortrait.dispose();
  document.getElementById('tp-articuno-page').remove();
  delete window.p07aLayoutPortrait;
 });
 await expect(stage).toHaveCount(0);
 expect(await page.evaluate(()=>TPArktos.read())).toEqual(before);
});

test('P07a Erzählfenster: Originaltext vollständig und Originalaktion erhalten',async({page})=>{
 await page.setViewportSize({width:320,height:844});
 await H.prepare(page,H.fixture(0));
 for(const file of ['story-stage.js','story-narrative.js'])
  await page.addScriptTag({
   path:path.resolve(__dirname,'../../../browser_ver/web',file)
  });
 const expected=await page.evaluate(()=>{
  TPAppMenu.show('stories');
  const stage=TPStoryStage.mount({
   story:'narrative-layout',title:'Layoutprüfung',caption:'Test',
   onClose:()=>TPAppMenu.show('stories')
  });
  const title=document.createElement('h3');title.textContent='An der Quelle';
  const paragraph=document.createElement('p');
  paragraph.textContent=Array(8).fill(
   'Ein schmaler Bach führt zwischen den Steinen zum Ufer.'
  ).join(' ');
  const action=document.createElement('button');
  action.textContent='Vorhandene Aktion';action.disabled=true;
  stage.lower.append(title,paragraph,action);
  window.p07aOriginalAction=action;
  window.p07aReleaseNarrative=TPStoryNarrative.decorate(stage.lower,{
   kind:'water'
  });
  return paragraph.textContent;
 });
 const card=page.locator('#tp-story-stage .tp-story-card');
 await expect(card).toBeVisible();
 await expect(card).toHaveAttribute('data-pages',/^[1-9][0-9]*$/);
 const count=Number(await card.getAttribute('data-pages'));
 expect(count).toBeGreaterThan(1);
 const passages=[];
 for(let i=0;i<count;i++){
  passages.push(await card.locator('.tp-story-card-body').textContent());
  expect(await card.locator('.tp-story-card-body').evaluate(
   n=>n.scrollHeight<=n.clientHeight
  )).toBe(true);
  if(i<count-1){
   await expect(card.getByRole('button',{name:'Vorhandene Aktion'})).toBeHidden();
   await card.locator('[data-story-next]').click();
  }
 }
 expect(passages.join(' ').replace(/\s+/g,' ').trim()).toBe(expected);
 await expect(card.getByRole('button',{name:'Vorhandene Aktion'})).toBeDisabled();
 expect(await card.getByRole('button',{name:'Vorhandene Aktion'}).evaluate(
  n=>n===window.p07aOriginalAction
 )).toBe(true);
 await page.evaluate(()=>{
  window.p07aReleaseNarrative();
  TPStoryStage.dispose();
  delete window.p07aOriginalAction;
  delete window.p07aReleaseNarrative;
 });
});

test('P07a Arktos: Eis-Erzählbild und vollständiger Originaltext',async({page})=>{
 await H.prepare(page,H.fixture(0));
 for(const file of ['story-stage.js','story-narrative.js','articuno-story-stage.js'])
  await page.addScriptTag({
   path:path.resolve(__dirname,'../../../browser_ver/web',file)
  });

 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  const before=await page.evaluate(()=>TPArktos.read());
  const expected=await page.evaluate(()=>{
   TPAppMenu.show('stories');
   const body=document.createElement('div');
   body.id='tp-articuno-page';
   const copy=document.createElement('div');copy.className='tp-power-copy';
   const title=document.createElement('h3');
   title.textContent=TPArktosText.t('introTitle');
   const paragraph=document.createElement('p');
   paragraph.textContent=TPArktosText.t('intro');
   const action=document.createElement('button');
   action.textContent=TPArktosText.t('investigate');
   action.disabled=true;
   window.p07aIceLayoutAction=action;
   copy.append(title,paragraph,action);
   body.append(TPIceCaveScene.create('outside'),copy);
   document.getElementById('tp-app-page').append(body);
   TPArticunoStoryStage.open();
   return paragraph.textContent.trim();
  });

  const card=page.locator('#tp-story-stage .tp-story-card[data-kind="ice"]');
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute('data-pages',/^[1-9][0-9]*$/);
  const geometry=await card.evaluate(n=>{
   const lower=n.closest('.tp-story-copy');
   const body=n.querySelector('.tp-story-card-body');
   return {
    fillsWidth:n.clientWidth===lower.clientWidth,
    fillsHeight:n.clientHeight===lower.clientHeight,
    bodyHeight:body.clientHeight,
    background:getComputedStyle(n).backgroundImage,
    overflow:n.scrollHeight>n.clientHeight
   };
  });
  expect(geometry.fillsWidth).toBe(true);
  expect(geometry.fillsHeight).toBe(true);
  expect(geometry.bodyHeight).toBeGreaterThan(0);
  expect(geometry.background).toContain('data:image/svg+xml');
  expect(geometry.overflow).toBe(false);

  const pages=Number(await card.getAttribute('data-pages'));
  const passages=[];
  for(let i=0;i<pages;i++){
   const body=card.locator('.tp-story-card-body');
   passages.push(await body.textContent());
   expect(await body.evaluate(n=>n.scrollHeight<=n.clientHeight)).toBe(true);
   if(i<pages-1)await card.locator('[data-story-next]').click();
  }
  expect(passages.join(' ').replace(/\s+/g,' ').trim())
   .toBe(expected.replace(/\s+/g,' ').trim());
  const action=card.locator('.tp-story-native>button');
  await expect(action).toBeVisible();
  await expect(action).toBeDisabled();
  expect(await action.evaluate(n=>n===window.p07aIceLayoutAction)).toBe(true);
  expect(await page.evaluate(()=>TPArktos.read())).toEqual(before);

  await page.locator('#tp-game-shell').screenshot({
   path:test.info().outputPath('arktos-eis-erzaehlbild-'+width+'.png')
  });
  await page.evaluate(()=>{
   TPArticunoStoryStage.dispose();
   document.getElementById('tp-articuno-page').remove();
   delete window.p07aIceLayoutAction;
  });
 }
});

test('P07a Arktos: vorhandenes Aufnahmefinale in der Storybühne',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await H.prepare(page,H.fixture(0));
 for(const file of ['story-stage.js','story-narrative.js','articuno-story-stage.js'])
  await page.addScriptTag({
   path:path.resolve(__dirname,'../../../browser_ver/web',file)
  });

 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  const before=await page.evaluate(()=>TPArktos.read());
  await page.evaluate(()=>{
   TPAppMenu.show('stories');
   const body=document.createElement('div');
   body.id='tp-articuno-page';
   body.className='tp-app-list tp-zapdos-encounter tp-zapdos-finale';
   const text=(...args)=>TPArktosText.t(...args);
   const art=TPZapdosFinale.create(text,{
    dex:144,
    scene:()=>TPIceCaveScene.create('inner',text('sceneLabel'))
   });
   const title=document.createElement('h3');
   title.textContent=text('completeTitle');
   const detail=document.createElement('p');
   detail.textContent=text('completeText');
   const level=document.createElement('p');
   level.textContent=text('level');
   body.append(title,art.element,detail,level);
   document.getElementById('tp-app-page').append(body);
   window.p07aFinaleFixture={body,art};
   TPArticunoStoryStage.open();
  });

  const stage=page.locator('#tp-story-stage');
  await expect(stage).toHaveAttribute('data-story-finale','true');
  const art=stage.locator('.tp-zapdos-finale-art');
  await expect(art).toBeVisible();
  await expect(art).toHaveAttribute('data-capture','done',{timeout:15000});
  expect(await art.evaluate(n=>{
   const lower=document.querySelector('#tp-story-stage .tp-story-copy');
   return !!lower&&!lower.contains(n)&&n===window.p07aFinaleFixture.art.element;
  })).toBe(true);

  const portrait=art.locator('.tp-zapdos-portrait');
  await expect(portrait).toBeVisible();
  const size=await portrait.boundingBox();
  expect(size).not.toBeNull();
  expect(size.width).toBeGreaterThan(0);
  expect(size.height).toBeGreaterThan(0);
  const ball=art.locator('.tp-zapdos-capture-ball');
  await expect(ball).toBeVisible();
  await expect(ball).toHaveCSS('opacity','1');
  await expect(art.locator('.tp-zapdos-finale-caption')).not.toHaveText('');
  expect(await page.evaluate(()=>TPArktos.read())).toEqual(before);

  await page.locator('#tp-game-shell').screenshot({
   path:test.info().outputPath('arktos-aufnahmefinale-'+width+'.png')
  });
  await page.evaluate(()=>{
   TPArticunoStoryStage.dispose();
   window.p07aFinaleFixture.art.dispose();
   window.p07aFinaleFixture.body.remove();
   delete window.p07aFinaleFixture;
  });
 }
});
