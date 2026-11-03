const {test,expect}=require('@playwright/test');
const H=require('./helpers');
async function open(page){
 await H.openMenu(page);
 await page.locator('#tp-app-page').getByRole('button',{name:'Sicherungen',exact:true}).click();
 const modal=page.locator('.tp-modal[data-manager-layout="saves"]:visible');
 await expect(modal).toBeVisible();
 return modal;
}
async function manualCount(page){
 return page.evaluate(()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('itamapoke-management',1);
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result;
   const read=db.transaction('snapshots','readonly').objectStore('snapshots').getAll();
   read.onerror=()=>{db.close();reject(read.error);};
   read.onsuccess=()=>{const n=read.result.filter(x=>x.kind==='manual').length;db.close();resolve(n);};
  };
 }));
}
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Sicherungen: vier Kategorien und unveränderte Auswahl '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const before=await page.evaluate(()=>({
   active:TPCollection.read().active,ids:TPCollection.read().mons.map(x=>x.id)
  }));
  const modal=await open(page);
  await expect(modal.locator('[data-saves-category]')).toHaveCount(4);
  for(const category of ['export','load','copies','save']){
   await modal.locator('[data-saves-category="'+category+'"]').click();
   await expect(modal.locator('.tp-panel')).toHaveAttribute('data-saves-view',category);
  }
  await modal.locator('[data-saves-info]').click();
  await expect(modal.locator('.tp-panel')).toHaveAttribute('data-saves-view','info');
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,ids:TPCollection.read().mons.map(x=>x.id)
  }))).toEqual(before);
 });
}
test('Sicherungen: vorhandene lokale Speicheraktion legt genau eine manuelle Kopie an',async({page})=>{
 let modal=await open(page);
 const before=await manualCount(page);
 await modal.getByRole('button',{name:'Jetzt lokal sichern',exact:true}).click();
 await expect.poll(()=>manualCount(page)).toBe(before+1);
 modal=page.locator('.tp-modal[data-manager-layout="saves"]:visible');
 await modal.locator('[data-saves-category="copies"]').click();
 await expect(modal.locator('[data-saves-action="restore"]:visible')).toHaveCount(1);
 await expect(modal.locator('[data-saves-action="share"]:visible')).toHaveCount(1);
 await expect(modal.locator('[data-saves-action="delete"]:visible')).toHaveCount(1);
});
test('Quellen: Pfeilfelder entsprechen den echten Pokédex-Rechtecken',async({page})=>{
 await H.openMenu(page);
 const root=page.locator('#tp-app-page');
 await root.locator('[data-admin-action="settings"]').click();
 await root.locator('.tp-app-rights-link').click();
 await expect(root.locator('[data-rights-next] .tp-ui01-paging-face')).toBeVisible();
 const geometry=await root.evaluate(owner=>{
  const canvas=document.getElementById('tp').getBoundingClientRect();
  const g=hubDexLayout(canvas.width),scale=canvas.width/466;
  return ['previous','next'].map((key,index)=>{
   const button=owner.querySelector(index?'[data-rights-next]':'[data-rights-previous]');
   const actual=button.querySelector('rect').getBoundingClientRect(),r=g[key];
   return {
    actual:{x:actual.x,y:actual.y,w:actual.width,h:actual.height},
    expected:{x:canvas.x+r.x*scale,y:canvas.y+r.y*scale,w:r.w*scale,h:r.h*scale}
   };
  });
 });
 for(const item of geometry)for(const key of ['x','y','w','h'])
  expect(
   Math.abs(item.actual[key]-item.expected[key]),
   JSON.stringify({axis:key,actual:item.actual,expected:item.expected})
  ).toBeLessThan(1);
});

test('Sicherungen Revision 2: echtes Gehäuse und kompakte Hauptansichten',async({page})=>{
 await page.setViewportSize({width:320,height:844});
 const modal=await open(page),panel=modal.locator('.tp-panel');
 const expected=await page.evaluate(()=>{
  const probe=document.createElement('span');
  probe.style.backgroundColor=HUB_DEX_DESIGN.shell;
  document.body.append(probe);
  const color=getComputedStyle(probe).backgroundColor;
  probe.remove();return color;
 });
 await expect(panel).toHaveCSS('background-color',expected);
 await expect(modal.locator('.tp-saves-head')).toHaveCSS('border-bottom-style','none');
 for(const category of ['save','export','load']){
  await modal.locator('[data-saves-category="'+category+'"]').click();
  if(category==='save'){
   await expect(modal.locator('.tp-saves-current-station')).toBeVisible();
   await expect(modal.locator('.tp-saves-current-stats>div')).toHaveCount(2);
  }else{
   await expect(modal.locator('[data-saves-scene="'+category+'"]')).toBeVisible();
  }
  await expect.poll(()=>modal.locator('.tp-saves-right').evaluate(
   node=>node.scrollHeight<=node.clientHeight+1)).toBe(true);
 }
});

test('Sicherungen: Infokarten enthalten vollständige Originalhinweise',async({page})=>{
 const fs=require('node:fs');
 const source=fs.readFileSync('browser_ver/web/management.js','utf8');
 const start=source.indexOf('async function openSaves(){');
 const end=source.indexOf('\nasync function allKeys(',start);
 expect(start).toBeGreaterThanOrEqual(0);
 expect(end).toBeGreaterThan(start);
 const expected=[...source.slice(start,end).matchAll(/note\(("(?:\\.|[^"\\])*")\)/g)]
  .map(match=>JSON.parse(match[1]));
 expect(expected.length).toBe(3);

 const modal=await open(page),panel=modal.locator('.tp-panel');
 await modal.locator('[data-saves-category="export"]').click();
 await modal.locator('[data-saves-info]').click();
 await expect(panel).toHaveAttribute('data-saves-view','info');

 const count=await modal.locator('[data-saves-info-card]').count();
 expect(count===2||count===3).toBe(true);
 for(let index=0;index<count;index++){
  const visible=modal.locator('[data-saves-info-card]:visible');
  await expect(visible).toHaveCount(1);
  expect(await visible.locator('p').textContent()).toBe(expected[index]);
  await expect(visible.locator('.tp-saves-scene-graphic')).toBeVisible();
  if(index<count-1)await modal.locator('[data-saves-next]').click();
 }
 await expect(modal.locator('[data-saves-next]')).toBeDisabled();
 for(let index=count-1;index>0;index--)
  await modal.locator('[data-saves-previous]').click();
 await expect(modal.locator('[data-saves-previous]')).toBeDisabled();

 await modal.locator('[data-saves-info]').click();
 await expect(panel).toHaveAttribute('data-saves-view','export');
 await expect(modal.getByRole('button',{name:'Version 1 exportieren',exact:true})).toBeVisible();
});
