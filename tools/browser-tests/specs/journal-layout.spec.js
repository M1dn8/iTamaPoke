'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const J=require('./journal-fixtures');

async function settled(page){
 await expect.poll(()=>page.evaluate(()=>
  !TPCollection.busy&&!tpSaveReplacing&&TPJournalUnread.read().initialized
 )).toBe(true);
}
async function checkFrame(page){
 const shape=await page.locator('#tp-app-page').evaluate(n=>{
  const shell=document.getElementById('tp-game-shell').getBoundingClientRect();
  const g=hubDexLayout();
  return {
   actual:Array.from(n.querySelectorAll('.tp-journal-frame .tp-pokedex-display'))
    .map(el=>{
     const r=el.getBoundingClientRect();
     return {x:r.x-shell.x,y:r.y-shell.y,w:r.width,h:r.height};
    }),
   expected:g.displays.map(r=>({
    x:r.x/g.u,y:r.y/g.u,w:r.w/g.u,h:r.h/g.u
   }))
  };
 });
 expect(shape.actual).toHaveLength(2);
 for(let i=0;i<2;i++)for(const key of ['x','y','w','h'])
  expect(Math.abs(shape.actual[i][key]-shape.expected[i][key])).toBeLessThan(1);
}
async function checkFit(page){
 await expect.poll(()=>page.locator('#tp-app-page').evaluate(n=>{
  const outer=n.getBoundingClientRect();
  const visible=el=>el.getClientRects().length>0;
  const failures=[];
  const describe=el=>el.id||el.className||el.tagName;
  const controls=Array.from(n.querySelectorAll('button')).filter(visible);
  const regions=[n,...Array.from(n.querySelectorAll(
   '#tp-journal-list,#tp-journal-detail,.tp-journal-card,.tp-journal-toolbar'
  )).filter(visible)];
  for(const el of regions){
   if(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1)
    failures.push({element:describe(el),reason:'overflow',
     client:[el.clientWidth,el.clientHeight],scroll:[el.scrollWidth,el.scrollHeight]});
  }
  for(const el of controls){
   const r=el.getBoundingClientRect();
   if(r.width<44||r.height<44||el.scrollWidth>el.clientWidth+1||
      el.scrollHeight>el.clientHeight+1||
      r.left<outer.left||r.right>outer.right||
      r.top<outer.top||r.bottom>outer.bottom)
    failures.push({element:describe(el),reason:'control',
     size:[r.width,r.height],client:[el.clientWidth,el.clientHeight],
     scroll:[el.scrollWidth,el.scrollHeight]});
  }
  const copy=n.querySelector('.tp-journal-copy');
  if(copy&&visible(copy)){
   const r=copy.getBoundingClientRect();
   const card=copy.closest('.tp-journal-card').getBoundingClientRect();
   if(copy.scrollWidth>copy.clientWidth+1||
      r.left<card.left||r.right>card.right||
      r.top<card.top||r.bottom>card.bottom)
    failures.push({element:'journal-copy',reason:'text bounds'});
  }
  return failures;
 })).toEqual([]);
}
for(const width of [320,390,430]){
 test('UI01 Tagebuch: direkte Filter, untere Navigation und schreibfreie Auswahl bei '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page,J.withUnread(H.fixture(),7));
  const list=await H.openJournal(page);await settled(page);
  await expect(list.locator('article')).toHaveCount(120);
  await expect(list.locator('article[data-journal-new="true"] .tp-unread-dot'))
   .toHaveCount(7);
  await expect(page.locator('.tp-journal-toolbar button[data-journal-filter]'))
   .toHaveCount(6);
  await expect(page.locator('#tp-journal-filter')).toHaveCount(0);
  await expect(page.locator('.tp-journal-filter-grid')).toHaveCount(0);
  await expect(page.locator('.tp-journal-text-nav')).toHaveCount(0);
  await checkFrame(page);await checkFit(page);

  const geometry=await page.locator('#tp-app-page').evaluate(n=>{
   const canvas=document.getElementById('tp').getBoundingClientRect();
   const g=hubDexLayout();
   const faces=['prev','next'].map(id=>{
    const r=n.querySelector('#tp-journal-'+id+' .tp-journal-nav-face')
     .getBoundingClientRect();
    return {x:r.x-canvas.x,y:r.y-canvas.y,w:r.width,h:r.height};
   });
   const expected=[g.previous,g.next].map(r=>({
    x:r.x/g.u,y:r.y/g.u,w:r.w/g.u,h:r.h/g.u
   }));
   return {faces,expected};
  });
  for(let i=0;i<2;i++)for(const key of ['x','y','w','h'])
   expect(Math.abs(geometry.faces[i][key]-geometry.expected[i][key])).toBeLessThan(1);

  const before=await page.evaluate(()=>({
   unread:TPJournalUnread.read(),
   entries:Module.ccall('tp_journal_json','string',[],[])
  }));
  await page.evaluate(()=>{
   window.__journalLayoutWrite=writeSave;
   window.__journalLayoutWrites=0;
   writeSave=async()=>{
    window.__journalLayoutWrites++;
    throw Error('Journal presentation must not write');
   };
  });
  try{
   const first=await list.locator('article button[aria-pressed="true"]')
    .locator('..').getAttribute('data-journal-key');
   await page.locator('#tp-journal-next').click();
   const second=await list.locator('article button[aria-pressed="true"]')
    .locator('..').getAttribute('data-journal-key');
   expect(second).not.toBe(first);
   await page.locator('#tp-journal-prev').click();
   expect(await list.locator('article button[aria-pressed="true"]')
    .locator('..').getAttribute('data-journal-key')).toBe(first);
   await page.locator('button[data-journal-filter="success"]').click();
   await page.locator('button[data-journal-filter="all"]').click();
   expect(await page.evaluate(()=>window.__journalLayoutWrites)).toBe(0);
   expect(await page.evaluate(()=>({
    unread:TPJournalUnread.read(),
    entries:Module.ccall('tp_journal_json','string',[],[])
   }))).toEqual(before);
   await expect(list.locator('article[data-journal-new="true"] .tp-unread-dot'))
    .toHaveCount(7);
   await checkFit(page);
  }finally{
   await page.evaluate(()=>{writeSave=window.__journalLayoutWrite;});
  }
 });

 test('UI01 Tagebuch: Ereigniskarte, Filter und begrenzter Textscroll bei '+width,
 async({page})=>{
  await page.setViewportSize({width,height:568});
  await H.prepare(page,J.withUnread(H.fixture(),0));
  await page.evaluate(()=>{
   const original=Module.ccall.bind(Module);
   const entries=Array.from({length:14},(_,index)=>({
    t:1000+index,k:index+1,s:1,a:index===9?255:2,b:1,f:0,n:'Flamme'
   }));
   Module.ccall=(name,...args)=>name==='tp_journal_json'?
    JSON.stringify(entries):original(name,...args);
  });
  const list=await H.openJournal(page);await settled(page);
  await expect(list.locator('article')).toHaveCount(14);
  const categories={
   all:[1,2,3,4,5,6,7,8,9,10,11,12,13,14],
   pokemon:[1,2,3,4,5,11],level:[8],
   success:[6,9,10],expedition:[7],mega:[12,13,14]
  };
  for(const [category,kinds]of Object.entries(categories)){
   const filter=page.locator('button[data-journal-filter="'+category+'"]');
   await expect(filter).toBeVisible();
   await filter.click();
   await expect(filter).toHaveAttribute('aria-pressed','true');
   const shown=await list.locator('article:visible').evaluateAll(
    rows=>rows.map(row=>Number(row.dataset.journalKind))
   );
   expect(shown.length).toBeGreaterThan(0);
   expect(shown.length).toBeLessThanOrEqual(3);
   expect(shown.every(kind=>kinds.includes(kind))).toBe(true);
   await checkFit(page);
   if(category==='level'){
    await expect(page.locator('#tp-journal-prev')).toBeHidden();
    await expect(page.locator('#tp-journal-next')).toBeHidden();
   }
  }
  await page.locator('button[data-journal-filter="success"]').click();
  const medal=list.locator('article[data-journal-kind="10"]');
  await medal.locator('button').click();
  const full=await medal.locator('p').textContent();
  const copy=page.locator('.tp-journal-copy');
  await expect(copy).toHaveText(full);
  await expect(copy).toHaveAttribute('tabindex','0');
  await expect(page.locator('.tp-journal-card-badge svg')).toBeVisible();
  await expect(page.locator('.tp-journal-card-title')).not.toBeEmpty();
  await expect(page.locator('.tp-journal-text-nav')).toHaveCount(0);
  const scrollable=await copy.evaluate(n=>n.scrollHeight>n.clientHeight+1);
  if(scrollable){
   await copy.evaluate(n=>{n.scrollTop=n.scrollHeight;});
   await expect.poll(()=>copy.evaluate(n=>n.scrollTop)).toBeGreaterThan(0);
   await expect(copy).toHaveText(full);
  }
  await expect.poll(()=>page.locator('#tp-app-page').evaluate(n=>n.scrollTop)).toBe(0);
  await checkFit(page);
 });
}

// Optional validation of the actual saves prepared for the manual journal review.
// Normal regression runs retain their existing tests without requiring this folder.
if(process.env.TP_JOURNAL_REVIEW_SAVES){
 const fs=require('node:fs');
 const path=require('node:path');
 const folder=process.env.TP_JOURNAL_REVIEW_SAVES;
 const manifest=JSON.parse(fs.readFileSync(path.join(folder,'review.json'),'utf8'));
 const expectedCounts=[24,24,1,1,12,0,120,200];
 const expectedUnread=[7,0,1,1,4,0,12,200];
 for(let index=0;index<manifest.names.length;index++){
  test('UI01 Tagebuch-Reviewspielstand '+manifest.names[index],async({page})=>{
   const raw=fs.readFileSync(path.join(folder,manifest.names[index]+'.tpsave'));
   await H.prepare(page,raw);
   const before=await page.evaluate(()=>({
    entries:JSON.parse(Module.ccall('tp_journal_json','string',[],[])),
    unread:TPJournalUnread.read()
   }));
   expect(before.entries).toHaveLength(expectedCounts[index]);
   expect(before.unread.unread).toBe(expectedUnread[index]);

   const list=await H.openJournal(page);
   await settled(page);
   await checkFrame(page);
   await checkFit(page);

   const groups=await page.evaluate(()=>
    TPAppMenu.groupEntries(JSON.parse(
     Module.ccall('tp_journal_json','string',[],[])
    )).length
   );
   await expect(list.locator('article')).toHaveCount(groups);
   await expect(list.locator('article:visible')).toHaveCount(Math.min(3,groups));

   if(!groups){
    await expect(list.locator('.tp-journal-empty')).toBeVisible();
   }else{
    const reached=new Set();
    let finished=false;
    for(let pageNumber=0;pageNumber<210;pageNumber++){
     const keys=await list.locator('article:visible').evaluateAll(
      rows=>rows.map(row=>row.dataset.journalKey)
     );
     keys.forEach(key=>reached.add(key));
     const next=page.locator('#tp-journal-next');
     if(await next.isDisabled()){finished=true;break;}
     await next.click();
    }
    expect(finished).toBe(true);
    expect(reached.size).toBe(groups);
   }

   if(index===2){
    await expect(page.locator('.tp-journal-text-nav')).toHaveCount(0);
    await expect(page.locator('#tp-journal-prev')).toBeHidden();
    await expect(page.locator('#tp-journal-next')).toBeHidden();
   }

   await expect.poll(()=>page.evaluate(()=>TPJournalUnread.read().unread)).toBe(0);
   const storedCount=await page.evaluate(()=>JSON.parse(
    Module.ccall('tp_journal_json','string',[],[])
   ).length);
   expect(storedCount).toBe(expectedCounts[index]);
  });
 }
}
