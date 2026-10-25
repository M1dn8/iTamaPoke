'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');

function careFixture(level){
 const base=H.fixture(0);
 const result=Buffer.from(base);
 let at=4;
 for(let i=0;i<result.readUInt32LE(0);i++){
  const length=result[at++];
  const key=result.toString('utf8',at,at+length);
  at+=length;
  const type=result[at++];
  const size=result.readUInt32LE(at);at+=4;
  if(key==='age'){
   if(type!==1||size!==8)throw Error('Unexpected fixture age field');
   result.writeBigInt64LE(BigInt((level-1)*60),at);
  }
  at+=size;
 }
 return result;
}

async function stored(page){
 return page.evaluate(async()=>{
  const raw=await new Promise((resolve,reject)=>{
   const request=indexedDB.open('itamapoke',1);
   request.onerror=()=>reject(request.error);
   request.onsuccess=()=>{
    const db=request.result;
    const tx=db.transaction('save','readonly');
    const read=tx.objectStore('save').get('state');
    let value;
    read.onsuccess=()=>{value=read.result;};
    tx.oncomplete=()=>{db.close();resolve(value);};
    tx.onabort=()=>{
     const error=tx.error||Error('IndexedDB transaction aborted');
     db.close();reject(error);
    };
   };
  });
  const parsed=TPStoreTools.parseLegacy(new Uint8Array(raw));
  return {
   level:parsed.summary.level,
   records:{
    wins:parsed.values.get('bwin')?.value||0,
    losses:parsed.values.get('bloss')?.value||0,
    streak:parsed.values.get('bstk')?.value||0,
    best:parsed.values.get('bbstk')?.value||0
   },
   collection:TPCollectionModel.decode(new TextDecoder().decode(
    parsed.values.get('f4col').value
   ))
  };
 });
}

async function readyResult(page,{care=false,level=20}={}){
 await H.importSave(page,careFixture(care?level:10));
 await H.game(page);
 await expect.poll(()=>page.evaluate(
  ()=>!!window.TPWildResult?.supported
 )).toBe(true);

 return page.evaluate(async({care,level})=>{
  await TPCollectionGame.ensureCurrent();
  const active=TPCollection.read().active;
  let winner=active;

  if(!care){
   // Synthetic test-only combat values, not a balancing fixture.
   await TPCollection.apply('catchWild',{
    dex:25,level,nickname:'P05 IndexedDB',shiny:false,origin:'wild',
    data:{stats:{atk:1000,def:1000,spe:1000},genes:null,training:null}
   },0);
   winner=TPCollection.read().nextId-1;
  }

  for(const id of [...TPCollection.read().team]){
   if(id!==winner)await TPCollection.apply('unselectTeam',id);
  }
  if(!TPCollection.read().team.includes(winner)){
   await TPCollection.apply('selectTeam',winner);
  }
  await TPCollectionGame.ensureCurrent();

  const before=TPCollection.read();
  const m=before.mons.find(p=>p.id===winner);
  const call=(name,args=[])=>Module.ccall(
   name,'number',args.map(v=>typeof v==='string'?'string':'number'),args
  );
  if(call('tp_wt_stage_begin',[1])!==1)throw Error('Roster begin refused');
  if(call('tp_wt_stage_entry',[
   0,m.id,m.dex,m.level,m.data.stats.atk,m.data.stats.def,m.data.stats.spe,
   m.id===active?1:0,m.shiny?1:0,m.nickname
  ])!==1)throw Error('Roster member refused');
  if(call('tp_wt_start',[0])!==1)throw Error('Team battle start refused');

  battleReturn='idle';screen='battle';
  for(let i=0;i<80&&!fns.battleResolved();i++){
   Module._tp_battle_heavy_attack();
  }
  const result=JSON.parse(Module.ccall('tp_wt_view','string',[],[]));
  if(!fns.battlePlayerWon()||!result.resultPending||
     result.winnerId!==winner)throw Error('Victory fixture did not resolve');

  return {
   winner,active,before,
   pet:Module.ccall('tp_f4_current_snapshot','string',[],[])
  };
 },{care,level});
}

test.beforeEach(async({page})=>{await H.prepare(page);});

for(const setup of [
 {care:false,level:20},
 {care:false,level:100},
 {care:true,level:99},
 {care:true,level:100}
]){
 test(`P05 result: ${setup.care?'care':'stored'} level ${setup.level}, real commit and reload`,
  async({page})=>{
   const initial=await readyResult(page,setup);
   await page.evaluate(()=>TPWildResult.complete());
   const expected=Math.min(100,setup.level+1);

   await expect.poll(()=>page.evaluate(id=>
    TPCollection.read().mons.find(m=>m.id===id).level,initial.winner
   )).toBe(expected);

   const saved=await stored(page);
   expect(saved.collection.mons.find(m=>m.id===initial.winner).level)
    .toBe(expected);
   expect(saved.collection.active).toBe(initial.active);
   expect(saved.records).toEqual({wins:1,losses:0,streak:1,best:1});

   if(!setup.care){
    const member=saved.collection.mons.find(m=>m.id===initial.winner);
    expect(member.data.training).toBe(null);
    expect(member.data.genes).toBe(null);
    const gain=setup.level<100?1:0;
    expect(member.data.stats).toEqual({
     atk:1000+gain,def:1000+gain,spe:1000+gain
    });
    expect(saved.level).toBe(10);
   }else{
    expect(saved.level).toBe(expected);
    const old=initial.before.mons.find(m=>m.id===initial.active);
    const current=saved.collection.mons.find(m=>m.id===initial.active);
    expect(current.data.ageMinutes).toBe(old.data.ageMinutes);
    expect(current.data.training).toEqual(old.data.training);
   }

   expect(await page.evaluate(()=>
    JSON.parse(Module.ccall('tp_wt_view','string',[],[])).resultPending
   )).toBe(false);

   const duplicate=await page.evaluate(async()=>{
    try{await TPWildResult.complete();return 'unexpected success';}
    catch(error){return error.code;}
   });
   expect(duplicate).toBe('NATIVE_BEGIN_REFUSED');
   expect((await stored(page)).records)
    .toEqual({wins:1,losses:0,streak:1,best:1});

   await page.reload();await H.waitReady(page);await H.game(page);
   expect(await page.evaluate(id=>
    TPCollection.read().mons.find(m=>m.id===id).level,initial.winner
   )).toBe(expected);
   expect((await stored(page)).collection.team)
    .toEqual(initial.before.team);
  });
}

test('P05 result: failed durable write rolls back actual native state and IndexedDB, retry once',
 async({page})=>{
  const initial=await readyResult(page,{care:true,level:99});
  const oldDisk=await stored(page);

  const failure=await page.evaluate(async()=>{
   const original=writeSave;
   writeSave=async(bytes,force=false)=>{
    if(force)throw Error('P05 intentional result quota');
    return original(bytes,force);
   };
   try{
    await TPWildResult.complete();
    return {failed:false};
   }catch(error){
    return {
     failed:true,
     collection:TPCollection.read(),
     pet:Module.ccall('tp_f4_current_snapshot','string',[],[]),
     pending:JSON.parse(Module.ccall('tp_wt_view','string',[],[])).resultPending,
     token:Module.ccall('tp_f4_store_pending','number',[],[]),
     busy:TPCollection.busy,gate:tpSaveReplacing
    };
   }finally{writeSave=original;}
  });

  expect(failure.failed).toBe(true);
  expect(failure.collection).toEqual(initial.before);
  expect(failure.pet).toBe(initial.pet);
  expect(failure.pending).toBe(true);
  expect(failure.token).toBe(0);
  expect(failure.busy).toBe(false);
  expect(failure.gate).toBe(false);
  expect(await stored(page)).toEqual(oldDisk);

  await page.evaluate(()=>TPWildResult.complete());
  expect((await stored(page)).level).toBe(100);
  expect((await stored(page)).records)
   .toEqual({wins:1,losses:0,streak:1,best:1});
  await page.reload();await H.waitReady(page);
  expect((await stored(page)).level).toBe(100);
 });

test('P05 result: deferred real write keeps old published model and blocks a second reward',
 async({page})=>{
  const initial=await readyResult(page);
  await page.evaluate(()=>{
   window.__p05Write=writeSave;
   writeSave=async(bytes,force=false)=>{
    if(force)await new Promise(resolve=>{window.__p05Release=resolve;});
    return window.__p05Write(bytes,force);
   };
   window.__p05Task=TPWildResult.complete();
  });
  await page.waitForFunction(()=>typeof window.__p05Release==='function');

  const during=await page.evaluate(async()=>{
   let duplicate='';
   try{await TPWildResult.complete();}catch(error){duplicate=error.code;}
   return {
    duplicate,busy:TPCollection.busy,gate:tpSaveReplacing,
    collection:TPCollection.read()
   };
  });
  expect(during).toEqual({
   duplicate:'BUSY',busy:true,gate:true,collection:initial.before
  });

  await page.evaluate(async()=>{
   try{window.__p05Release();await window.__p05Task;}
   finally{writeSave=window.__p05Write;}
  });
  expect((await stored(page)).collection.mons.find(
   m=>m.id===initial.winner
  ).level).toBe(21);
  expect(await page.evaluate(()=>({
   busy:TPCollection.busy,gate:tpSaveReplacing,
   token:Module.ccall('tp_f4_store_pending','number',[],[])
  }))).toEqual({busy:false,gate:false,token:0});
 });
