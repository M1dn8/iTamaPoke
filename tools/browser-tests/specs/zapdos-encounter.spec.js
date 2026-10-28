'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const F=require('./story-fixtures');
const body=page=>page.locator('#tp-zapdos-page');
const art=page=>body(page).locator('canvas[data-dex="145"]');

// Synthetic red/green squares, not Pokemon artwork.
function syntheticSprite(){
 const pixels=24*24;
 const bytes=Buffer.alloc(19+pixels*2);
 bytes.write('TPK2',0,'ascii');
 bytes[4]=1;bytes.writeUInt16LE(2,5);
 bytes.writeUInt16LE(0xf800,7);
 bytes.writeUInt16LE(0x07e0,9);
 bytes.set([0,24,24,2],11);
 bytes.writeUInt16LE(120,15);
 bytes.writeUInt16LE(120,17);
 bytes.fill(0,19,19+pixels);
 bytes.fill(1,19+pixels);
 return Array.from(bytes);
}
async function seedSprite(page){
 await page.evaluate(async raw=>{
  const db=await openAssetDb();
  await new Promise((resolve,reject)=>{
   const tx=db.transaction(ASSET_STORE,'readwrite');
   tx.objectStore(ASSET_STORE).put(
    new Uint8Array(raw).buffer,'p145.bin'
   );
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error);
   tx.onabort=()=>reject(tx.error||Error('fixture transaction aborted'));
  });
 },syntheticSprite());
}
async function openStory(page){
 await H.openStories(page);
 await page.locator('#tp-stories-page button[data-story="zapdos"]').click();
 await expect(body(page)).toBeVisible();
}
async function encounter(page){
 await openStory(page);
 await body(page).getByRole('button',{name:'Fortsetzen',exact:true}).click();
 for(let i=0;i<10;i++)
  await body(page).locator('button[data-security-tap]').click();
 await expect(body(page).getByRole('button',{
  name:'Prüfduell beginnen',exact:true
 })).toBeEnabled();
}
test.beforeEach(async({page})=>{
 await H.prepare(page,F.withProgress(H.fixture(),{kanto:63,notice:1}));
});

for(const width of [320,390])
 test('Begegnung: lokaler TPK2-Frame, zentrierte Darstellung und Reload bei '+width,async({page},info)=>{
  await page.setViewportSize({width,height:568});
  await seedSprite(page);
  const before=await page.evaluate(()=>({
   active:TPCollection.read().active,
   dex:fns.speciesId(),
   count:TPCollection.read().mons.length
  }));
  const external=[];
  page.on('request',request=>{
   const url=new URL(request.url());
   if(['http:','https:'].includes(url.protocol)&&
      url.origin!==new URL(page.url()).origin)
    external.push(request.url());
  });
  await encounter(page);
  await expect(art(page)).toHaveAttribute('data-ready','true');
  await expect(art(page)).toHaveAttribute('aria-label','Zapdos');
  await expect(body(page).locator(':scope > h3'))
   .toHaveCSS('text-align','center');
  await expect(body(page).locator(':scope > p').first())
   .toHaveCSS('text-align','center');

  const image=await art(page).evaluate(canvas=>{
   const c=canvas.getContext('2d');
   const data=c.getImageData(0,0,canvas.width,canvas.height).data;
   let opaque=0;
   for(let i=3;i<data.length;i+=4)if(data[i])opaque++;
   return {
    center:Array.from(c.getImageData(192,90,1,1).data),
    opaque,
    smoothing:c.imageSmoothingEnabled
   };
  });
  expect(image.center).toEqual([255,0,0,255]);
  expect(image.opaque).toBeGreaterThan(1000);
  expect(image.smoothing).toBe(false);
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,
   dex:fns.speciesId(),
   count:TPCollection.read().mons.length
  }))).toEqual(before);
  expect(await body(page).evaluate(node=>
   node.scrollWidth<=node.clientWidth+1
  )).toBe(true);
  expect(external).toEqual([]);
  await page.locator('#tp-game-shell').screenshot({
   path:info.outputPath('begegnung-synthetische-testgrafik-'+width+'.png')
  });

  await page.reload();await H.waitReady(page);await openStory(page);
  await expect(art(page)).toHaveAttribute('data-ready','true');
  expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(2);
 });

test('Begegnung: fehlende lokale Grafik blockiert das Pruefduell nicht',async({page})=>{
 await encounter(page);
 await expect(art(page)).toHaveAttribute('data-ready','missing');
 await expect(body(page).locator('.tp-zapdos-art-status'))
  .toContainText('Die lokale Zapdos-Grafik fehlt');
 await expect(body(page).getByRole('button',{
  name:'Prüfduell beginnen',exact:true
 })).toBeEnabled();
 expect(await page.evaluate(()=>TPZapdos.read().step)).toBe(2);
});

test('Begegnung: neue Beschreibung und Grafikname in vier Sprachen',async({page})=>{
 await seedSprite(page);await encounter(page);
 for(const [code,word,name] of [
  [0,'digno','Zapdos'],
  [1,'worthy','Zapdos'],
  [2,'digne','Électhor'],
  [3,'würdig','Zapdos']
 ]){
  await page.evaluate(code=>{
   Module.ccall('tp_set_language',null,['number'],[code]);
   TPAppMenu.show('zapdos');
  },code);
  await expect(art(page)).toHaveAttribute('data-ready','true');
  await expect(art(page)).toHaveAttribute('aria-label',name);
  await expect(body(page).locator(':scope > p').first())
   .toContainText(word);
 }
});

for(const input of ['Antippen','Tastatur'])
 test('Begegnung: Grafik statt sichtbarem Startbutton – '+input,async({page})=>{
  await seedSprite(page);
  await encounter(page);
  await expect(art(page)).toHaveAttribute('data-ready','true');
  await expect(body(page).getByRole('heading',{
   name:'Ein wildes Zapdos',exact:true
  })).toBeVisible();
  await expect(body(page).getByText(
   'Beweise Zapdos, dass du würdig bist!',{exact:true}
  )).toBeVisible();
  await expect(body(page).getByText(
   'Zapdos · Level 50',{exact:true}
  )).toBeVisible();
  await expect(body(page)).not.toContainText('Ohne Fangwurf');
  await expect(body(page).getByText(
   'Prüfduell beginnen',{exact:true}
  )).toHaveCount(0);

  const target=body(page).getByRole('button',{
   name:'Prüfduell beginnen',exact:true
  });
  await expect(target).toHaveClass('tp-zapdos-challenge');
  await expect(target).toHaveText('');
  await expect(target).toBeEnabled();

  if(input==='Antippen'){
   await body(page).locator('.tp-zapdos-portrait').click();
  }else{
   await target.focus();
   await expect(target).toBeFocused();
   await page.keyboard.press('Enter');
  }
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
  await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.mode))
   .toBe('zapdos');
  expect(await page.evaluate(()=>fns.battleWildDex())).toBe(145);
 });

test('Begegnung: gehaltene und alte Eingabe startet kein Duell',async({page})=>{
 await seedSprite(page);
 await openStory(page);
 await body(page).getByRole('button',{
  name:'Fortsetzen',exact:true
 }).click();

 for(let i=0;i<10;i++)
  await body(page).locator('button[data-security-tap]').click();

 await expect.poll(()=>page.evaluate(()=>TPZapdos.read().step)).toBe(2);

 const immediate=await page.evaluate(async()=>{
  TPAppMenu.show('zapdos');
  document.dispatchEvent(new PointerEvent('pointerdown',{
   pointerId:777,bubbles:true
  }));
  window.__tapGuardHeldAt=performance.now();
  return TPZapdosUI.start();
 });
 expect(immediate).toBe(false);
 expect(await page.evaluate(()=>screen)).toBe('settings');

 // The finger remains down beyond the initial protection period.
 await page.waitForFunction(
  ()=>performance.now()-window.__tapGuardHeldAt>=700
 );
 const target=body(page).getByRole('button',{
  name:'Prüfduell beginnen',exact:true
 });
 await expect(target).toBeDisabled();
 expect(await page.evaluate(()=>TPZapdosUI.start())).toBe(false);

 const released=await page.evaluate(async()=>{
  document.dispatchEvent(new PointerEvent('pointerup',{
   pointerId:777,bubbles:true
  }));
  return TPZapdosUI.start();
 });
 expect(released).toBe(false);
 expect(await page.evaluate(()=>screen)).toBe('settings');

 await expect(target).toBeEnabled();
 await target.click();
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 expect(await page.evaluate(()=>fns.battleWildDex())).toBe(145);
});
