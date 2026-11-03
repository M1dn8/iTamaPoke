
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const dialogFor=page=>page.getByRole('dialog',{name:'Pflege beenden',exact:true});
async function open(page,width=390){
 await page.setViewportSize({width,height:568});
 await H.prepare(page);await H.game(page);
 await page.evaluate(()=>TPCollectionGame.ensureCurrent());
 await page.evaluate(()=>TPCollectionGame.openEnd('release'));
 const dialog=dialogFor(page);await expect(dialog).toBeVisible();return dialog;
}
async function snapshot(page){
 return page.evaluate(()=>({
  model:JSON.stringify(TPCollection.read()),ceremony:fns.ceremony()
 }));
}
for(const width of [320,390,430]){
 test('UI01 Pflege-Ende: interne Sicher-Abfrage und Zurueck bei '+width,async({page})=>{
  const dialog=await open(page,width);
  const unexpected=[];
  page.on('dialog',async dialog=>{
   unexpected.push({type:dialog.type(),message:dialog.message()});
   await dialog.dismiss();
  });
  await expect(dialog.getByRole('button',{name:'Zurück',exact:true})).toBeFocused();
  await expect(dialog.getByRole('button',{name:'Abbrechen',exact:true})).toHaveCount(0);
  await expect(dialog.locator('.tp-f4-care-description')).toHaveCount(0);
  await expect(dialog.locator('.tp-f4-care-identity')).toHaveCount(0);
  await expect(dialog.locator('.tp-f4-care-stats')).toContainText('Lv.');
  await expect(dialog.locator('.tp-f4-care-warning'))
   .toHaveText('Freilassen ist endgültig!');
  const frame=await dialog.evaluate(n=>{
   const shell=document.getElementById('tp-game-shell').getBoundingClientRect();
   const g=hubDexLayout();
   return {
    actual:Array.from(n.querySelectorAll('.tp-f4-care-frame .tp-pokedex-display')).map(el=>{
     const r=el.getBoundingClientRect();
     return {x:r.x-shell.x,y:r.y-shell.y,w:r.width,h:r.height};
    }),
    expected:g.displays.map(r=>({x:r.x/g.u,y:r.y/g.u,w:r.w/g.u,h:r.h/g.u}))
   };
  });
  for(let i=0;i<2;i++)for(const key of ['x','y','w','h'])
   expect(Math.abs(frame.actual[i][key]-frame.expected[i][key])).toBeLessThan(1);
  const before=await snapshot(page);
  await dialog.getByRole('button',{name:'Freilassen',exact:true}).click();
  await expect(dialog.getByRole('heading',{name:'Sicher?',exact:true})).toBeVisible();
  const yes=dialog.getByRole('button',{name:'Ja',exact:true});
  const no=dialog.getByRole('button',{name:'Nein',exact:true});
  await expect(no).toBeFocused();
  await expect(yes).toHaveCSS('background-color','rgb(223, 241, 227)');
  await expect(no).toHaveCSS('background-color','rgb(251, 228, 227)');
  expect(await snapshot(page)).toEqual(before);
  await no.click();
  await expect(dialog.getByRole('button',{name:'Freilassen',exact:true})).toBeVisible();
  expect(await snapshot(page)).toEqual(before);
  await expect.poll(()=>dialog.evaluate(n=>{
   const outer=n.getBoundingClientRect();
   return n.scrollWidth<=n.clientWidth+1&&n.scrollHeight<=n.clientHeight+1&&
    Array.from(n.querySelectorAll('button')).filter(b=>b.getClientRects().length).every(b=>{
     const r=b.getBoundingClientRect();
     return r.width>=44&&r.height>=44&&
      b.scrollWidth<=b.clientWidth+1&&b.scrollHeight<=b.clientHeight+1&&
      r.left>=outer.left&&r.right<=outer.right&&r.top>=outer.top&&r.bottom<=outer.bottom;
    });
  })).toBe(true);
  await dialog.getByRole('button',{name:'Zurück',exact:true}).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('#tp-app-page')).toBeHidden();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
  expect(await snapshot(page)).toEqual(before);
  expect(unexpected).toEqual([]);
 });
}
test('UI01 Pflege-Ende: erst internes Ja entfernt genau das aktuelle Exemplar',async({page})=>{
 const dialog=await open(page);
 const unexpected=[];
 page.on('dialog',async dialog=>{unexpected.push(dialog.type());await dialog.dismiss();});
 const before=await page.evaluate(()=>({
  active:TPCollection.read().active,
  ids:TPCollection.read().mons.map(mon=>mon.id)
 }));
 await dialog.getByRole('button',{name:'Freilassen',exact:true}).click();
 expect(await page.evaluate(()=>TPCollection.read().active)).toBe(before.active);
 await dialog.getByRole('button',{name:'Ja',exact:true}).click();
 await expect(dialog).toBeHidden();
 await expect.poll(()=>page.evaluate(()=>fns.ceremony())).toBe(3);
 const after=await page.evaluate(()=>({
  active:TPCollection.read().active,
  ids:TPCollection.read().mons.map(mon=>mon.id)
 }));
 expect(after.active).toBe(null);
 expect(after.ids).toEqual(before.ids.filter(id=>id!==before.active));
 await page.reload();await H.waitReady(page);
 expect(await page.evaluate(()=>TPCollection.read().mons.some(mon=>mon.id===before.active)))
  .toBe(false);
 expect(unexpected).toEqual([]);
});
