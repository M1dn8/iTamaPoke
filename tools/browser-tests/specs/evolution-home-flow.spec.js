'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const T=require('../../../browser_ver/web/storage-tools.js');

function readyBulbasaur(dex=1){
 const fields=T.parseLegacy(H.fixture(0)).values;
 for(const [key,value]of Object.entries({
  dexn:dex,eggT2:dex,age:dex===133?2640:900,bond:80,
  full:100,joy:100,ene:100,hyg:100
 }))fields.set(key,{type:1,value});
 const chunks=[];
 for(const [key,{type,value}]of fields){
  const name=Buffer.from(key);
  let bytes;
  if(type===0)bytes=Buffer.from([Number(value)]);
  else if(type===1){
   bytes=Buffer.alloc(8);
   bytes.writeBigInt64LE(BigInt(value));
  }else bytes=Buffer.from(value);
  const size=Buffer.alloc(4);size.writeUInt32LE(bytes.length);
  chunks.push(Buffer.concat([
   Buffer.from([name.length]),name,Buffer.from([type]),size,bytes
  ]));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);
 return Buffer.concat([count,...chunks]);
}

for(const answer of ['Nein','Ja']){
 test('home evolution: direct '+answer+' without page detour or browser confirmation',
 async({page})=>{
  await page.addInitScript(()=>{
   localStorage.setItem('tp-auto-evolve','0');
  });
  await H.prepare(page,readyBulbasaur(),1);
  await H.game(page);
  await expect.poll(()=>page.evaluate(()=>fns.canEvolveNow())).toBe(1);

  const before=await page.evaluate(()=>{
   const s=TPCollection.read();
   const m=s.mons.find(m=>m.id===s.active);
   return {
    active:s.active,total:s.mons.length,dex:fns.speciesId(),
    life:m?.data.lifeToken
   };
  });
  const browserDialogs=[];
  page.on('dialog',async dialog=>{
   browserDialogs.push({type:dialog.type(),message:dialog.message()});
   await dialog.dismiss();
  });

  const question=page.locator('#tp-home-evolution');
  await expect(question).toBeVisible();
  await expect(question).toHaveAttribute('role','dialog');
  await expect(question.getByRole('button',{name:'Ja',exact:true}))
   .toBeVisible();
  await expect(question.getByRole('button',{name:'Nein',exact:true}))
   .toBeVisible();
  expect(await page.evaluate(()=>screen)).toBe('idle');
  await expect(page.locator('.tp-evolution-modal:visible')).toHaveCount(0);
  await expect(page.locator('#tp-app-page')).toBeHidden();

  await question.getByRole('button',{name:answer,exact:true}).click();
  await expect(question).toBeHidden();
  expect(await page.evaluate(()=>screen)).toBe('idle');
  await expect(page.locator('.tp-evolution-modal:visible')).toHaveCount(0);
  expect(browserDialogs).toEqual([]);

  if(answer==='Nein'){
   expect(await page.evaluate(()=>fns.speciesId())).toBe(before.dex);
   expect(await page.evaluate(()=>fns.evolvingNow())).toBe(0);
   await expect.poll(()=>page.evaluate(()=>fns.wantsEvolve())).toBe(0);
  }else{
   await expect.poll(()=>page.evaluate(()=>fns.evolvingNow())).toBe(1);
   await expect.poll(()=>page.evaluate(()=>fns.evolvingNow())).toBe(0);
   expect(await page.evaluate(()=>fns.speciesId())).toBe(2);
   await expect.poll(()=>page.evaluate(()=>{
    const s=TPCollection.read();
    return s.mons.find(m=>m.id===s.active)?.dex;
   })).toBe(2);
  }

  const after=await page.evaluate(()=>{
   const s=TPCollection.read();
   return {
    active:s.active,total:s.mons.length,
    life:s.mons.find(m=>m.id===s.active)?.data.lifeToken
   };
  });
  expect(after.active).toBe(before.active);
  expect(after.total).toBe(before.total);
  expect(after.life).toBe(before.life);
  expect(browserDialogs).toEqual([]);
 });
}

/* P07a final missing flow proofs. */
for(const answer of ['Nein','Ja']){
 test('home evolution: branching '+answer+' stays on home and preserves identity',
 async({page})=>{
  await page.addInitScript(()=>{
   localStorage.setItem('tp-auto-evolve','0');
  });
  await H.prepare(page,readyBulbasaur(133),133);
  await H.game(page);
  const question=page.locator('#tp-home-evolution');
  await expect(question).toBeVisible();

  const before=await page.evaluate(()=>{
   const s=TPCollection.read();
   const ready=[];
   const count=Module.ccall('tp_evo_rule_count','number',['number'],[133]);
   for(let i=0;i<count;i++){
    const field=key=>Module.ccall('tp_evo_rule_field','number',
     ['number','number','number'],[133,i,key]);
    if(field(9))ready.push(field(0));
   }
   return {
    id:s.active,total:s.mons.length,
    life:s.mons.find(m=>m.id===s.active)?.data.lifeToken,
    targets:[...new Set(ready)]
   };
  });
  expect(before.targets.length).toBeGreaterThan(1);
  await expect(question.locator('.tp-home-evo-targets button'))
   .toHaveCount(before.targets.length);
  const yes=question.getByRole('button',{name:'Ja',exact:true});
  await expect(yes).toBeDisabled();

  const dialogs=[];
  page.on('dialog',async d=>{dialogs.push(d.type());await d.dismiss();});
  await page.evaluate(()=>{
   window.homeEvolutionCalls=0;
   window.homeEvolutionOriginalCall=Module.ccall;
   Module.ccall=function(name,...args){
    if(name==='tp_evo_choose')window.homeEvolutionCalls++;
    return window.homeEvolutionOriginalCall.call(this,name,...args);
   };
  });
  try{
   if(answer==='Ja'){
    await question.locator('.tp-home-evo-targets button').first().click();
    await expect(yes).toBeEnabled();
   }
   await question.getByRole('button',{name:answer,exact:true}).click();
   await expect(question).toBeHidden();
   expect(await page.evaluate(()=>screen)).toBe('idle');
   await expect(page.locator('.tp-evolution-modal:visible')).toHaveCount(0);

   if(answer==='Ja'){
    await expect.poll(()=>page.evaluate(()=>fns.evolvingNow())).toBe(1);
    await expect.poll(()=>page.evaluate(()=>fns.evolvingNow())).toBe(0);
    expect(await page.evaluate(()=>fns.speciesId())).toBe(before.targets[0]);
    await expect.poll(()=>page.evaluate(()=>{
     const s=TPCollection.read();
     return s.mons.find(m=>m.id===s.active)?.dex;
    })).toBe(before.targets[0]);
   }else{
    expect(await page.evaluate(()=>fns.speciesId())).toBe(133);
    expect(await page.evaluate(()=>fns.evolvingNow())).toBe(0);
    await expect.poll(()=>page.evaluate(()=>fns.wantsEvolve())).toBe(0);
   }
   expect(await page.evaluate(()=>window.homeEvolutionCalls))
    .toBe(answer==='Ja'?1:0);
   const after=await page.evaluate(()=>{
    const s=TPCollection.read();
    return {
     id:s.active,total:s.mons.length,
     life:s.mons.find(m=>m.id===s.active)?.data.lifeToken
    };
   });
   expect(after).toEqual({
    id:before.id,total:before.total,life:before.life
   });
   expect(dialogs).toEqual([]);
  }finally{
   await page.evaluate(()=>{
    Module.ccall=window.homeEvolutionOriginalCall;
   });
  }
 });
}
