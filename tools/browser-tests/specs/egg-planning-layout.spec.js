
'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

async function checkFrame(page){
 const data=await H.modal(page).evaluate(n=>{
  const shell=document.getElementById('tp-game-shell').getBoundingClientRect();
  const g=hubDexLayout();
  return {
   actual:Array.from(n.querySelectorAll('.tp-egg-frame .tp-pokedex-display')).map(el=>{
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
async function checkFit(page){
 await expect.poll(()=>H.modal(page).evaluate(n=>{
  const panel=n.querySelector('.tp-panel'),outer=panel.getBoundingClientRect();
  const errors=[],shown=el=>el.getClientRects().length>0;
  for(const el of [panel,...Array.from(n.querySelectorAll(
   '.tp-egg-settings,.tp-egg-right,.tp-egg-actions,.tp-egg-info-panel,.tp-egg-picker,.tp-egg-preview'
  )).filter(shown)]){
   if(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1)
    errors.push({element:el.className,reason:'overflow',
     client:[el.clientWidth,el.clientHeight],scroll:[el.scrollWidth,el.scrollHeight]});
  }
  for(const el of Array.from(n.querySelectorAll('button')).filter(shown)){
   const r=el.getBoundingClientRect();
   if(r.width<44||r.height<44||r.left<outer.left||r.right>outer.right||
      r.top<outer.top||r.bottom>outer.bottom)
    errors.push({element:el.id||el.getAttribute('aria-label')||el.textContent,
     reason:'control',size:[r.width,r.height]});
  }
  return errors;
 })).toEqual([]);
}



async function pickType(modal,value){
 if(!Number.isInteger(value)||value<0||value>18)
  throw Error('Invalid requested egg type: '+value);
 const current=Number(await modal.locator('.tp-egg-art').getAttribute('data-wish-type'));
 if(current===value)return;
 const wanted=value===0?current:value;
 if(wanted===0)return;
 await modal.getByRole('button',{name:'Bevorzugter Typ',exact:true}).click();
 await expect(modal.locator('button[data-egg-type="0"]')).toHaveCount(0);
 const picker=modal.locator('.tp-egg-picker');
 const columns=Number(await picker.getAttribute('data-columns'));
 const size=columns*3;
 const targetPage=Math.floor((wanted-1)/size);
 for(let attempt=0;attempt<5;attempt++){
  const first=Number(await modal.locator('button[data-egg-type]').first()
   .getAttribute('data-egg-type'));
  const currentPage=Math.floor((first-1)/size);
  if(currentPage===targetPage)break;
  const forward=currentPage<targetPage;
  const control=modal.locator(forward?'#tp-egg-choice-next':'#tp-egg-choice-prev');
  await expect(control).toBeEnabled();await control.click();
  await expect.poll(async()=>Math.floor((Number(
   await modal.locator('button[data-egg-type]').first().getAttribute('data-egg-type')
  )-1)/size)).toBe(currentPage+(forward?1:-1));
 }
 const target=modal.locator('button[data-egg-type="'+wanted+'"]');
 await expect(target).toBeVisible();
 const colours=[
  "#fff4d6","#c9c4b3","#efaa83","#8cbbdf","#efdb82",
  "#98c779","#abe0df","#d29285","#bd98cc","#d9bd88",
  "#bcc4e8","#e7a2bf","#c1ce84","#c9bb8b","#aaa0ca",
  "#a99be3","#a79b92","#bdcbd0","#e7b8d3"
 ];
 const hex=colours[wanted].slice(1);
 const rgb='rgb('+[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)).join(', ')+')';
 await expect(target).toHaveCSS('background-color',rgb);
 await target.click();
 await expect(modal.locator('.tp-egg-art')).toHaveAttribute('data-wish-type',String(value));
}

for(const width of [320,390,430]){
 test('UI01 Eier: interne Auswahl, reine Icons und unveränderter Typwunsch bei '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});await H.prepare(page);
  const before=await page.evaluate(()=>({
   active:TPCollection.read().active,count:TPCollection.read().mons.length,
   generation:Module.ccall('tp_egg_plan_generation','number',[],[]),
   type:Module.ccall('tp_egg_plan_type','number',[],[]),
   unraised:Module.ccall('tp_egg_plan_unraised','number',[],[])
  }));
  const modal=await H.openEggPlanning(page);
  await checkFrame(page);await checkFit(page);
  await expect(modal.locator('select,input')).toHaveCount(0);
  await expect(modal.locator('.tp-egg-stamp')).toHaveCount(0);
  await expect(modal.locator('.tp-egg-settings>button')).toHaveCount(2);
  const head=modal.locator('.tp-modal-head');
  await expect(head).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  for(const action of await modal.locator('.tp-egg-actions>button').all())
   expect((await action.textContent()).trim()).toBe('');

  await modal.getByRole('button',{name:'Bevorzugte Generation',exact:true}).click();
  const generationValues=()=>modal.locator('button[data-egg-generation]').evaluateAll(
   nodes=>nodes.map(n=>Number(n.dataset.eggGeneration))
  );
  expect(await generationValues()).toEqual(
   width===320?[1,2,3,4,5,6]:[1,2,3,4,5,6,7,8,9]
  );
  await expect(modal.locator('button[data-egg-generation="0"]')).toHaveCount(0);
  await expect(modal.locator('button[data-egg-generation="2"] .tp-egg-gen-number'))
   .toHaveText('2');
  if(width===320){
   await expect(modal.locator('#tp-egg-choice-next')).toBeVisible();
   await modal.locator('#tp-egg-choice-next').click();
   expect(await generationValues()).toEqual([7,8,9]);
  }else{
   await expect(modal.locator('#tp-egg-choice-prev')).toBeHidden();
   await expect(modal.locator('#tp-egg-choice-next')).toBeHidden();
  }
  await checkFit(page);
  await modal.locator('button[data-egg-generation="9"]').click();
  await modal.getByRole('button',{name:'Bevorzugter Typ',exact:true}).click();
  await expect(modal.locator('button[data-egg-type]')).toHaveCount(width===320?6:9);
  await expect(modal.locator('button[data-egg-type="0"]')).toHaveCount(0);
  for(const id of ['tp-egg-choice-prev','tp-egg-choice-next']){
   const carrier=modal.locator('#'+id);
   await expect(carrier).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
   await expect(carrier).toHaveCSS('box-shadow','none');
   await expect(carrier).toHaveCSS('border-top-width','0px');
  }
  await expect(modal.locator('#tp-egg-choice-prev .tp-egg-nav-face')).toHaveText('<');
  await expect(modal.locator('#tp-egg-choice-next .tp-egg-nav-face')).toHaveText('>');
  await expect(modal.locator('#tp-egg-choice-next .tp-egg-nav-face'))
   .toHaveCSS('font-size','10px');
  await checkFit(page);
  await page.keyboard.press('Escape');
  await expect(modal.locator('.tp-egg-preview')).toBeVisible();
  for(const value of [...Array.from({length:19},(_,i)=>i),0,18,0,5]){
   await pickType(modal,value);
   await expect(modal.locator('.tp-egg-art')).toHaveAttribute('data-wish-type',String(value));
   await checkFit(page);
  }
  await expect(modal.locator('.tp-egg-shell')).toHaveCSS('fill','rgb(152, 199, 121)');
  await expect(modal.locator('.tp-egg-colour-note')).toHaveCount(0);
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,count:TPCollection.read().mons.length,
   generation:Module.ccall('tp_egg_plan_generation','number',[],[]),
   type:Module.ccall('tp_egg_plan_type','number',[],[]),
   unraised:Module.ccall('tp_egg_plan_unraised','number',[],[])
  }))).toEqual(before);
  await modal.getByRole('button',{name:'Info',exact:true}).click();
  await expect(modal.locator('.tp-egg-info-panel')).toBeVisible();
  const infoAlignment=await modal.locator('.tp-egg-info-card').evaluateAll(cards=>
   cards.map(card=>{
    const scene=card.querySelector('.tp-egg-info-scene').getBoundingClientRect();
    const heading=card.querySelector('h3').getBoundingClientRect();
    return {sceneY:scene.y,sceneHeight:scene.height,headingY:heading.y};
   })
  );
  expect(infoAlignment).toHaveLength(2);
  expect(Math.abs(infoAlignment[0].sceneY-infoAlignment[1].sceneY)).toBeLessThan(1);
  expect(Math.abs(infoAlignment[0].sceneHeight-infoAlignment[1].sceneHeight)).toBeLessThan(1);
  expect(Math.abs(infoAlignment[0].headingY-infoAlignment[1].headingY)).toBeLessThan(1);
  const categoryLeft=modal.locator('#tp-egg-type [data-egg-category="type"] svg');
  const categoryInfo=modal.locator('.tp-egg-info-panel [data-egg-category="type"] svg');
  await expect(categoryLeft).toHaveCount(1);
  await expect(categoryInfo).toHaveCount(1);
  expect(await categoryInfo.evaluate(n=>n.outerHTML))
   .toBe(await categoryLeft.evaluate(n=>n.outerHTML));
  await expect(modal.locator('.tp-egg-info-card')).toHaveCount(2);
  await expect(modal.locator('.tp-egg-info-scene')).toHaveCount(2);
  await expect(modal.locator('.tp-egg-info-panel')).toContainText('Du wählst');
  await expect(modal.locator('.tp-egg-info-panel')).toContainText('Der Zufall entscheidet');
  await expect(modal.getByRole('button',{name:'Info',exact:true}))
   .toBeFocused();
  await expect(modal.locator('.tp-egg-info-panel')).not.toContainText('Kandidatenpool');
  await expect(modal.locator('.tp-egg-info-panel')).not.toContainText('27-faches');
  await checkFit(page);
  await page.keyboard.press('Escape');
  await expect(modal.locator('.tp-egg-preview')).toBeVisible();
  await modal.locator('.tp-modal-head').getByRole('button',{name:'Zurück',exact:true}).click();
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
 });
}


test('UI01 Eier: Zufallsicon setzt gespeicherte Wünsche zurück und kehrt zur Zentrale zurück',
 async({page})=>{
  await H.prepare(page);
  const before=await page.evaluate(()=>({
   active:TPCollection.read().active,count:TPCollection.read().mons.length
  }));
  let modal=await H.openEggPlanning(page);
  await modal.getByRole('button',{name:'Bevorzugte Generation',exact:true}).click();
  await modal.locator('button[data-egg-generation="2"]').click();
  await pickType(modal,5);
  await Promise.all([
   page.waitForEvent('load'),
   modal.getByRole('button',{name:'Plan speichern und neu laden',exact:true}).click()
  ]);
  await H.waitReady(page);
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
  expect(await page.evaluate(()=>({
   generation:Module.ccall('tp_egg_plan_generation','number',[],[]),
   type:Module.ccall('tp_egg_plan_type','number',[],[])
  }))).toEqual({generation:2,type:5});
  modal=await H.openEggPlanning(page);
  await Promise.all([
   page.waitForEvent('load'),
   modal.getByRole('button',{name:'Zufall wiederherstellen',exact:true}).click()
  ]);
  await H.waitReady(page);
  await expect(page.locator('#tp-app-page.tp-pokedex-hub')).toBeVisible();
  expect(await page.evaluate(()=>({
   generation:Module.ccall('tp_egg_plan_generation','number',[],[]),
   type:Module.ccall('tp_egg_plan_type','number',[],[]),
   unraised:Module.ccall('tp_egg_plan_unraised','number',[],[])
  }))).toEqual({generation:0,type:0,unraised:0});
  expect(await page.evaluate(()=>({
   active:TPCollection.read().active,count:TPCollection.read().mons.length
  }))).toEqual(before);
 });
