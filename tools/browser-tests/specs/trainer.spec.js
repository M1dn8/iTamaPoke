const {test,expect}=require('@playwright/test');const H=require('./helpers');
function trainedFixture(){
 const base=H.fixture(),extra=[];
 for(const key of ['tatk','tdef','tspe']){const k=Buffer.from(key),len=Buffer.alloc(4),v=Buffer.alloc(8);len.writeUInt32LE(8);v.writeBigInt64LE(100n);extra.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([1]),len,v]));}
 const count=Buffer.alloc(4);count.writeUInt32LE(base.readUInt32LE(0)+3);return Buffer.concat([count,base.subarray(4),...extra]);
}
async function card(page){await H.game(page);const a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');for(let i=0;i<4;i++)await H.tap(page,350,382);await expect.poll(()=>page.evaluate(()=>cardPage)).toBe(4);}
async function state(page){return page.evaluate(()=>({active:TPTrainer.active(),next:!!TPTrainer.get(3),index:TPTrainer.get(2),count:TPTrainer.get(1),hp:fns.battlePlayerHp(),max:fns.battlePlayerMaxHp(),rests:Module.ccall('tp_battle_rest_uses_left','number',[],[]),resolved:!!fns.battleResolved(),won:!!fns.battlePlayerWon(),catch:!!fns.battleCatchOffered(),reward:fns.battleRewardLine(),stats:[0,1,2].map(i=>Module.ccall('tp_c3_metric','number',['number'],[i]))}));}
async function fight(page){for(let n=0;n<24;n++){const s=await state(page);if(s.resolved)return s;await H.battleAction(page,'quick');}throw Error('Battle did not resolve within native turn limit');}
test.beforeEach(async({page})=>{await H.prepare(page);await H.importSave(page,trainedFixture());await card(page);});
for(const team of [0,1])test('Trainer '+(team+1)+': echter Kampf, Rest-KP/Erholungen, keine Fangoption oder Belohnung',async({page})=>{
 await H.tap(page,233,308);await expect.poll(()=>page.evaluate(()=>screen)).toBe('trainer');await H.tap(page,233,team===0?190:260);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');let s=await state(page);expect(s.count).toBe(team+1);const original=s.stats;
 expect(s.rests).toBe(2);
 await H.battleAction(page,'rest');
 await expect.poll(async()=>(await state(page)).rests).toBe(1);
 s=await state(page);expect(s.rests).toBe(1);
 s=await fight(page);expect(s.won).toBe(true);expect(s.catch).toBe(false);expect(s.reward).toBe('');
 if(team===1){
  expect(s.next).toBe(true);expect(s.hp).toBeLessThan(s.max);const hp=s.hp,rests=s.rests;
  await H.battleAction(page,'next');const next=await state(page);expect(next.index).toBe(1);expect(next.hp).toBe(hp);expect(next.rests).toBe(rests);expect(next.resolved).toBe(false);
  s=await fight(page);expect(s.won).toBe(true);expect(s.next).toBe(false);expect(s.catch).toBe(false);expect(s.reward).toBe('');
 }
 expect(s.stats).toEqual(original);await H.battleAction(page,'ok');await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');expect((await state(page)).active).toBe(false);
 await page.reload();await H.waitReady(page);expect((await state(page)).active).toBe(false);expect((await state(page)).stats).toEqual(original);
});
test('Trainer-Hintergrundabbruch, Wildkampf unveraendert erreichbar und Schild zeichnet ohne Autotreffer',async({page})=>{
 await H.tap(page,233,308);await H.tap(page,233,260);expect((await state(page)).active).toBe(true);
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');expect((await state(page)).active).toBe(false);
 await page.evaluate(()=>{delete document.visibilityState;document.dispatchEvent(new Event('visibilitychange'));});
 await H.tap(page,103,308);await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');expect((await state(page)).active).toBe(false);await H.battleAction(page,'abort');
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 await page.evaluate(()=>{window.f2Ellipses=[];const original=ctx.ellipse.bind(ctx);ctx.ellipse=(...args)=>{window.f2Ellipses.push(args);if(window.f2Ellipses.length>5)window.f2Ellipses.shift();return original(...args);};});
 await H.tap(page,363,254);await expect.poll(()=>page.evaluate(()=>TPTraining.snapshot?.phase)).toBe('running');await expect.poll(()=>page.evaluate(()=>window.f2Ellipses.length)).toBeGreaterThan(0);
 expect(await page.evaluate(()=>TPTraining.snapshot.hits)).toBe(0);await H.tap(page,233,200);expect(await page.evaluate(()=>TPTraining.snapshot.hits)).toBe(1);await H.tap(page,233,422);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');expect(await page.evaluate(()=>TPTraining.snapshot.phase)).toBe('aborted');
});
