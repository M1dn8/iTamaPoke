const {test,expect}=require('@playwright/test');const H=require('./helpers');
function strong(marked=false){const b=H.fixture(),fields=[];let p=4;for(let i=0;i<b.readUInt32LE(0);i++){const n=b[p++],key=b.toString('utf8',p,p+n);p+=n;const type=b[p++],size=b.readUInt32LE(p);p+=4;const value=Buffer.from(b.subarray(p,p+size));p+=size;if(key==='dexcgt'&&marked){value.fill(255);value[value.length-1]=1;}if(key==='dexn')value.writeBigInt64LE(376n);if(key==='age')value.writeBigInt64LE(5940n);if(['gatk','gdef','gspe'].includes(key))value.writeBigInt64LE(110n);if(['full','joy','ene','hyg','bond'].includes(key))value.writeBigInt64LE(100n);const k=Buffer.from(key),len=Buffer.alloc(4);len.writeUInt32LE(value.length);fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),len,value]));}for(const key of ['tatk','tdef','tspe']){const k=Buffer.from(key),len=Buffer.alloc(4),value=Buffer.alloc(8);len.writeUInt32LE(8);value.writeBigInt64LE(100n);fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([1]),len,value]));}const count=Buffer.alloc(4);count.writeUInt32LE(fields.length);return Buffer.concat([count,...fields]);}
async function importStrong(page,marked=false){await H.openMenu(page);await page.getByRole('button',{name:'Sicherungen',exact:true}).click();const panel=H.modal(page);await expect(panel).toBeVisible();await panel.locator('input[type=file]').setInputFiles({name:'Capture-Metagross.tpsave',mimeType:'application/octet-stream',buffer:strong(marked)});const apply=panel.getByRole('button',{name:'Importieren und aktuellen Stand ersetzen',exact:true});await expect(apply).toBeVisible();page.once('dialog',dialog=>dialog.accept());await Promise.all([page.waitForEvent('load'),apply.click()]);await H.waitReady(page);await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(376);}
async function battle(page){await H.game(page);const a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');for(let i=0;i<4;i++)await H.tap(page,350,382);let selected=false;for(let attempt=0;attempt<16;attempt++){await H.tap(page,103,308);await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');const types=await page.evaluate(()=>[fns.dexType1(fns.battleWildDex()),fns.dexType2(fns.battleWildDex())]);if(types.every(t=>![2,9,14,16].includes(t))){selected=true;break;}await H.battleAction(page,'abort');await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');}expect(selected).toBe(true);for(let i=0;i<40;i++){if(await page.evaluate(()=>!!fns.battleResolved()))break;await H.battleAction(page,'quick');}expect(await page.evaluate(()=>!!fns.battleResolved())).toBe(true);expect(await page.evaluate(()=>!!fns.battlePlayerWon())).toBe(true);await H.waitForWildCatchReady(page);
expect(await page.evaluate(()=>!!fns.battleCatchOffered())).toBe(true);}

async function start(page,marked=false){await importStrong(page,marked);await battle(page);await expect.poll(()=>page.evaluate(()=>!TPCollection.busy&&!tpSaveReplacing)).toBe(true);await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.mode)).toBe('wild');await expect.poll(()=>page.evaluate(()=>!!TPBattleView.target('catch'))).toBe(true);}
test.beforeEach(async({page})=>{await H.prepare(page);});
test('Wildfang UI: historischer Fangstatus zeichnet Pokeball am Gegner ohne neue Boxeintraege',async({page})=>{
 await start(page,true);expect(await page.evaluate(()=>!!fns.battleWildAlreadyCaught())).toBe(true);await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.enemy.caught)).toBe(true);
 await page.evaluate(()=>{window.__wildMarkerPaints=0;const arc=ctx.arc;ctx.arc=function(...args){if(args[2]===6)window.__wildMarkerPaints++;return arc.apply(this,args);};});
 await expect.poll(()=>page.evaluate(()=>window.__wildMarkerPaints)).toBeGreaterThan(0);expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(1);
});
test('Wildfang UI: Wurf, gesperrte Mehrfachtipps, keine vorzeitige Erfolgsmeldung und bestaetigtes Ergebnis',async({page})=>{
 await start(page);
 const preview=await page.evaluate(()=>JSON.parse(
  Module.ccall('tp_f4_capture_snapshot','string',[],[])
 ));
 const before=await page.evaluate(()=>({
  count:TPCollection.read().mons.length,
  active:TPCollection.read().active,
  team:TPCollection.read().team
 }));
 expect(before.team.length).toBeLessThan(6);

 await page.evaluate(()=>{
  window.__wildCaptureWrites=0;
  window.__wildCaptureGates=[];
  window.__wildCaptureOriginal=writeSave;
  writeSave=async(bytes,force=false)=>{
   if(force&&fns.battleCatchDone()&&fns.battleCatchTried()){
    window.__wildCaptureWrites++;
    const gate={
     pending:Module.ccall('tp_f4_admission_pending','number',[],[]),
     released:false
    };
    const held=new Promise(resolve=>{gate.resolve=resolve;});
    window.__wildCaptureGates.push(gate);
    await held;
   }
   return window.__wildCaptureOriginal(bytes,force);
  };
  window.__releaseWildCapture=()=>{
   const gate=window.__wildCaptureGates.find(g=>!g.released);
   if(!gate)throw Error('No capture write is waiting');
   gate.released=true;gate.resolve();
  };
 });

 try{
  await H.battleAction(page,'catch');
  await expect.poll(()=>page.evaluate(()=>TPBattleView.capture?.busy)).toBe(true);
  for(let i=0;i<3;i++)await H.tap(page,137,371);
  expect(await page.evaluate(()=>TPBattleView.target('catch'))).toBe(null);

  await expect.poll(()=>page.evaluate(()=>window.__wildCaptureWrites)).toBe(1);
  expect(await page.evaluate(()=>TPBattleView.capture?.phase)).toBe('saving');
  expect(await page.evaluate(()=>TPBattleView.capture?.phases)).toContain('throw');
  expect(await page.evaluate(()=>TPBattleView.capture?.committed)).toBe(false);
  expect(await page.evaluate(()=>TPBattleView.target('ok'))).toBe(null);
  expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(before.count);
  expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);

  // The native candidate is tentative; neither public state has advanced.
  const success=await page.evaluate(()=>!!fns.battleCatchSuccess());
  expect(await page.evaluate(()=>window.__wildCaptureGates[0].pending))
   .toBe(success?1:0);
  await page.evaluate(()=>window.__releaseWildCapture());

  if(success){
   // The first save confirmed the catch. Hold the automatic admission save.
   await expect.poll(()=>page.evaluate(()=>window.__wildCaptureWrites)).toBe(2);
   expect(await page.evaluate(()=>window.__wildCaptureGates[1].pending)).toBe(0);
   expect(await page.evaluate(()=>!!TPAdmission.read().pending)).toBe(true);
   expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(before.count);
   expect(await page.evaluate(()=>TPCollection.read().team)).toEqual(before.team);
   expect(await page.evaluate(()=>TPBattleView.capture?.committed)).toBe(false);
   expect(await page.evaluate(()=>TPBattleView.target('ok'))).toBe(null);

   for(let i=0;i<3;i++)await H.tap(page,137,371);
   expect(await page.evaluate(()=>window.__wildCaptureWrites)).toBe(2);
   await page.evaluate(()=>window.__releaseWildCapture());
  }

  await expect.poll(()=>page.evaluate(()=>
   !!fns.battleCatchDone()&&!TPCollection.busy&&!tpSaveReplacing
  )).toBe(true);
  await expect.poll(()=>page.evaluate(()=>TPBattleView.capture?.phase))
   .toBe(success?'caught':'escaped');

  const visual=await page.evaluate(()=>TPBattleView.capture);
  expect(visual.headline).toBe(success?'Gefangen!':'Entkommen!');
  expect(visual.detail).toContain('Lv. '+preview.level);
  expect(visual.committed).toBe(true);
  expect(await page.evaluate(()=>window.__wildCaptureWrites)).toBe(success?2:1);
  expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
  expect(await page.evaluate(()=>TPCollection.read().mons.length))
   .toBe(before.count+(success?1:0));
  expect(await page.evaluate(()=>TPCollection.read().active)).toBe(before.active);

  if(success){
   const saved=await page.evaluate(()=>TPAdmissionText.t('saved'));
   expect(visual.detail).toContain(saved);
   const after=await page.evaluate(()=>TPCollection.read());
   expect(after.team).toEqual([...before.team,after.nextId-1]);
   await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.enemy.caught))
    .toBe(true);
  }

  await page.evaluate(()=>{writeSave=window.__wildCaptureOriginal;});
  await H.battleAction(page,'ok');
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
  await page.reload();await H.waitReady(page);
  expect(await page.evaluate(()=>TPCollection.read().mons.length))
   .toBe(before.count+(success?1:0));
  expect(await page.evaluate(()=>TPAdmission.read().pending)).toBe(null);
 }finally{
  await page.evaluate(()=>{
   if(window.__wildCaptureOriginal)writeSave=window.__wildCaptureOriginal;
   for(const gate of window.__wildCaptureGates||[]){
    if(!gate.released){gate.released=true;gate.resolve();}
   }
  }).catch(()=>{});
 }
});
