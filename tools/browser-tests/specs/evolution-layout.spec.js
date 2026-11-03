
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const T=require('../../../browser_ver/web/storage-tools.js');
function specimen(dex){
 const values=T.parseLegacy(H.fixture(0)).values;
 for(const [key,value]of Object.entries({
  dexn:dex,age:2640,bond:80,full:100,joy:100,ene:100,hyg:100,jrlvl:7
 }))values.set(key,{type:1,value});
 const chunks=[];
 for(const [key,{type,value}]of values){
  const name=Buffer.from(key);
  let data;
  if(type===0)data=Buffer.from([+value]);
  else if(type===1){data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(value));}
  else data=Buffer.from(value);
  const size=Buffer.alloc(4);size.writeUInt32LE(data.length);
  chunks.push(Buffer.concat([Buffer.from([name.length]),name,Buffer.from([type]),size,data]));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(values.size);
 return Buffer.concat([count,...chunks]);
}
async function checkFit(page){
 await expect.poll(()=>H.modal(page).evaluate(n=>{
  const panel=n.querySelector('.tp-panel'),outer=panel.getBoundingClientRect();
  const shown=el=>el.getClientRects().length>0;
  const failures=[];
  for(const el of [panel,...Array.from(n.querySelectorAll(
   '.tp-evo-subject,.tp-evo-goal,.tp-evo-goal-card,.tp-evo-actions,.tp-evo-info'
  )).filter(shown)]){
   if(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1)
    failures.push({element:el.className,reason:'overflow',
     client:[el.clientWidth,el.clientHeight],scroll:[el.scrollWidth,el.scrollHeight]});
  }
  for(const el of Array.from(n.querySelectorAll('button')).filter(shown)){
   const r=el.getBoundingClientRect();
   if(r.width<44||r.height<44||el.scrollWidth>el.clientWidth+1||
      el.scrollHeight>el.clientHeight+1||r.left<outer.left||r.right>outer.right||
      r.top<outer.top||r.bottom>outer.bottom)
    failures.push({element:el.id||el.getAttribute('aria-label')||el.textContent,
     reason:'control',size:[r.width,r.height]});
  }
  return failures;
 })).toEqual([]);
}
async function checkFrame(page){
 const data=await H.modal(page).evaluate(n=>{
  const shell=document.getElementById('tp-game-shell').getBoundingClientRect();
  const g=hubDexLayout();
  return {
   actual:Array.from(n.querySelectorAll('.tp-evo-frame .tp-pokedex-display')).map(el=>{
    const r=el.getBoundingClientRect();
    return {x:r.x-shell.x,y:r.y-shell.y,w:r.width,h:r.height};
   }),
   expected:g.displays.map(r=>({x:r.x/g.u,y:r.y/g.u,w:r.w/g.u,h:r.h/g.u}))
  };
 });
 expect(data.actual).toHaveLength(2);
 for(let i=0;i<2;i++)for(const key of ['x','y','w','h'])
  expect(Math.abs(data.actual[i][key]-data.expected[i][key])).toBeLessThan(1);
}
for(const width of [320,390,430])for(const dex of [1,133]){
 test('UI01 Entwicklung: Rahmen und native Bedingungen '+dex+' bei '+width,async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page,specimen(dex),dex);
  const before=await page.evaluate(()=>({
   species:fns.speciesId(),active:TPCollection.read().active,count:TPCollection.read().mons.length
  }));
  const modal=await H.openEvolution(page);
  await expect(modal.locator('.tp-evolution-panel')).toBeVisible();
  const targetSetting=modal.getByRole('switch',{
   name:'Zielwahl im Hauptspiel',exact:true
  });
  await expect(targetSetting).toBeVisible();
  await expect(targetSetting.locator('svg path')).toHaveAttribute(
   'd','M12 21V12L5 5M12 12l7-7M5 10V5h5M14 5h5v5'
  );
  await checkFrame(page);await checkFit(page);
  const count=await page.evaluate(()=>Module.ccall(
   'tp_evo_rule_count','number',['number'],[fns.speciesId()]
  ));
  expect(count).toBeGreaterThan(0);
  if(dex===133)expect(count).toBeGreaterThan(1);
  async function conditions(){
   const index=Number(await modal.locator('#tp-evolution-goal').getAttribute('data-rule-index'));
   const expected=await page.evaluate(index=>{
    const field=key=>Module.ccall('tp_evo_rule_field','number',
     ['number','number','number'],[fns.speciesId(),index,key]);
    return {target:field(0),flags:[4,5,6,7,8].map(key=>!!field(key)),ready:!!field(9)};
   },index);
   await expect(modal.locator('#tp-evolution-goal'))
    .toHaveAttribute('data-target',String(expected.target));
   expect(await modal.locator('[data-evo-check]').evaluateAll(
    rows=>rows.map(row=>row.dataset.ok==='true')
   )).toEqual(expected.flags);
   const action=modal.locator('button[data-evo-choose]');
   if(expected.ready)await expect(action).toBeEnabled();
   else await expect(action).toBeDisabled();
  }
  await conditions();
  if(count>1){
   await modal.locator('#tp-evolution-next').click();
   await conditions();await checkFit(page);
   await modal.locator('#tp-evolution-prev').click();
  }else{
   await expect(modal.locator('#tp-evolution-prev')).toBeHidden();
   await expect(modal.locator('#tp-evolution-next')).toBeHidden();
  }
  await modal.getByRole('button',{name:'Voraussetzungen aktualisieren',exact:true}).click();
  await conditions();
  await modal.getByRole('button',{name:'Info',exact:true}).click();
  await expect(modal.locator('.tp-evo-info')).toBeVisible();
  await expect(modal.locator('.tp-evo-info')).toContainText(
   'Hier wählst und bestätigst du das Ziel.'
  );
  const alignment=await modal.locator('.tp-evo-info-column').evaluateAll(cards=>
   cards.map(card=>({
    icon:card.querySelector('.tp-evo-icon').getBoundingClientRect().y,
    heading:card.querySelector('h3').getBoundingClientRect().y
   }))
  );
  expect(alignment).toHaveLength(2);
  expect(Math.abs(alignment[0].icon-alignment[1].icon)).toBeLessThan(1);
  expect(Math.abs(alignment[0].heading-alignment[1].heading)).toBeLessThan(1);
  await checkFit(page);
  await page.keyboard.press('Escape');
  await expect(modal.locator('.tp-evo-goal')).toBeVisible();
  expect(await page.evaluate(()=>({
   species:fns.speciesId(),active:TPCollection.read().active,count:TPCollection.read().mons.length
  }))).toEqual(before);
  await modal.locator('.tp-modal-head').getByRole('button',{name:'Zurück',exact:true}).click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
 });
}
test('UI01 Entwicklung: Endform ohne Aktion und Zielpfeile',async({page})=>{
 await H.prepare(page,specimen(3),3);
 const modal=await H.openEvolution(page);
 expect(await page.evaluate(()=>Module.ccall(
  'tp_evo_rule_count','number',['number'],[3]
 ))).toBe(0);
 await expect(modal.locator('button[data-evo-choose]')).toHaveCount(0);
 await expect(modal.locator('.tp-evo-empty')).toContainText(
  'Diese Art besitzt keine weitere Entwicklung.'
 );
 await expect(modal.locator('#tp-evolution-prev')).toBeHidden();
 await expect(modal.locator('#tp-evolution-next')).toBeHidden();
 await checkFit(page);
});
