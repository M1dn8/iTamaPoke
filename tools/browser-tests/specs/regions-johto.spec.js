const {test,expect}=require('@playwright/test');const H=require('./helpers');
function fixture(badges=0){const base=H.fixture(0),fields=new Map();let p=4;for(let i=0;i<base.readUInt32LE(0);i++){const n=base[p++],k=base.toString('utf8',p,p+n);p+=n;const type=base[p++],size=base.readUInt32LE(p);p+=4;fields.set(k,[type,Buffer.from(base.subarray(p,p+size))]);p+=size;}
 const extra={dexn:376,eggT2:376,age:5940,full:100,joy:100,ene:100,hyg:100,bond:100,gatk:100,gdef:100,gspe:100,tatk:100,tdef:100,tspe:100,mgver:3,agver:1,agmask:0,jagver:1,jagmask:badges,shy:true};
 for(const [k,v]of Object.entries(extra)){const b=typeof v==='boolean'?Buffer.from([+v]):Buffer.alloc(8);if(typeof v!=='boolean')b.writeBigInt64LE(BigInt(v));fields.set(k,[typeof v==='boolean'?0:1,b]);}fields.set('nick',[2,Buffer.from('Johto-Test')]);const count=Buffer.alloc(4);count.writeUInt32LE(fields.size);return Buffer.concat([count,...[...fields].map(([k,[type,v]])=>{const key=Buffer.from(k),len=Buffer.alloc(4);len.writeUInt32LE(v.length);return Buffer.concat([Buffer.from([key.length]),key,Buffer.from([type]),len,v]);})]);}
// Fixture-only recovery after the Top Four. League HP/rest/index bytes are untouched.
function recovered(raw){const copy=Buffer.from(raw);let p=4;for(let i=0;i<copy.readUInt32LE(0);i++){const n=copy[p++],k=copy.toString('utf8',p,p+n);p+=n;const type=copy[p++],size=copy.readUInt32LE(p);p+=4;if(k==='ene'){if(type!==1||size!==8)throw Error('Bad energy field');copy.writeBigInt64LE(100n,p);}p+=size;}return copy;}
async function exitToIdle(page){
 await H.tap(page,233,435);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');
 await expect(page.locator('#status')).toHaveText('Arena · Johto-Auswahl', {timeout:10000});
 await expect.poll(()=>page.evaluate(()=>({screen,busy:TPArena.busy})), {timeout:10000}).toEqual({screen:'arena',busy:false});
 await H.tap(page,300,435);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');
 await page.waitForFunction(()=>screen==='card'&&cardPage===4&&statusEl.textContent===TPText.statusCard('Battle stats')&&!tpSaveReplacing&&!window.TPCollection?.busy&&!window.TPCollectionGame?.dialogOpen&&!window.TPArena?.busy&&!window.TPTraining?.busy&&!window.TPMega?.busy&&!window.TPLeague?.busy&&!window.TPExpeditions?.busy&&!window.TPAppMenu?.active&&choice==='none');
 await H.tap(page,233,406);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
}
async function openArena(page){await H.game(page);const a=await H.point(page,233,300),b=await H.point(page,233,110);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');for(let i=0;i<4;i++)await H.tap(page,350,382);await H.tap(page,363,308);await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');}
async function johto(page){await openArena(page);if(await page.evaluate(()=>TPArena.region===1))return;await H.tap(page,402,21);await expect.poll(()=>page.evaluate(()=>TPArena.choosingRegion)).toBe(true);await page.waitForFunction(()=>!TPRegions.locked());await H.tap(page,233,270);await expect.poll(()=>page.evaluate(()=>TPArena.region)).toBe(1);}
const mask=(page,r)=>page.evaluate(r=>Module.ccall('tp_region_arena_mask','number',['number'],[r]),r);
const reward=page=>page.evaluate(()=>JSON.parse(Module.ccall('tp_region_rg_view','string',['number'],[1])));
async function quiet(page){await page.waitForFunction(()=>!tpSaveReplacing&&!TPCollection.busy&&!Module.ccall('tp_f4_store_pending','number',[],[]));}
async function resumeStoredLeague(page){
 await quiet(page);
 await expect.poll(()=>page.evaluate(()=>{const v=TPLeague.state;return screen==='league'&&TPLeague.region===1&&!TPLeague.busy&&!tpSaveReplacing&&v.supported&&v.unlocked&&v.actor&&v.state===1&&!v.live&&(v.index!==20||!!TPBattleEnergy.view.champ.can)?true:false;})).toBe(true);
 const phase=await page.evaluate(()=>TPLeague.diagnostics.phase);
 if(phase==='choose'){
  await expect.poll(()=>page.evaluate(()=>document.getElementById('status').textContent)).toBe('Johto-Liga');
  await H.tap(page,233,360); // The overview's Fortsetzen control (343..377).
 }else if(phase==='checkpoint'){
  await H.tap(page,233,270); // The immediate checkpoint's Weiter/Champ control.
 }else throw Error('Unexpected league page before resume: '+phase);
}
async function savedLeague(page,index,live){await expect.poll(()=>page.evaluate(()=>({index:TPLeague.state.index,live:TPLeague.state.live,busy:TPLeague.busy,replacing:tpSaveReplacing}))).toEqual({index,live,busy:false,replacing:false});}
test.beforeEach(async({page})=>{await H.prepare(page);await page.waitForFunction(()=>!!window.TPRegions);expect(await page.evaluate(()=>TPRegions.available(1))).toBe(true);});
test('Johto UI: Auswahl, echte Falk-Serie, eigener Orden und Neustart ohne Kanto-Aenderung',async({page})=>{
 await H.importSave(page,fixture(),376);await johto(page);expect(await mask(page,0)).toBe(0);expect(await mask(page,1)).toBe(0);await H.tap(page,130,134);await quiet(page);await H.tap(page,233,354);await expect.poll(()=>page.evaluate(()=>screen)).toBe('battle');
 await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.region)).toBe(1);expect(await page.evaluate(()=>TPBattleView.current.title)).toContain('Falk');expect(await page.evaluate(()=>TPBattleView.current.enemy.level)).toBe(7);expect(await page.evaluate(()=>TPBattleEnergy.view.energy)).toBe(75);expect(await page.evaluate(()=>TPArena.chooseRegion(0))).toBe(false);
 for(let i=0;i<12&&!await page.evaluate(()=>!!fns.battleResolved());i++)await H.battleAction(page,'quick');expect(await page.evaluate(()=>!!TPTrainer.get(3))).toBe(true);expect(await mask(page,1)).toBe(0);await H.battleAction(page,'next');await expect.poll(()=>page.evaluate(()=>TPBattleView.current.enemy.level)).toBe(9);
 for(let i=0;i<12&&!await page.evaluate(()=>!!fns.battleResolved());i++)await H.battleAction(page,'quick');await expect.poll(()=>page.evaluate(()=>TPArena.snapshot?.phase)).toBe('done');expect(await mask(page,1)).toBe(1);expect(await mask(page,0)).toBe(0);expect(await page.evaluate(()=>!!fns.battleCatchOffered())).toBe(false);await H.tap(page,233,435);await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');
 await page.reload();await H.waitReady(page);await openArena(page);expect(await page.evaluate(()=>TPArena.region)).toBe(1);expect(await mask(page,1)).toBe(1);expect(await mask(page,0)).toBe(0);
});
test('Johto UI: fehlgeschlagene Startspeicherung rollt Kosten/Sitzung zurueck',async({page})=>{
 await H.importSave(page,fixture(),376);await johto(page);await H.tap(page,130,134);await quiet(page);await page.evaluate(()=>{window.__johtoWrite=writeSave;writeSave=async(bytes,force=false)=>{if(force&&Module.ccall('tp_region_arena_session_region','number',[],[])===1){window.__johtoEntryAttempt=true;throw Error('synthetic Johto entry quota');}return window.__johtoWrite(bytes,force);};});await H.tap(page,233,354);
 await expect.poll(()=>page.evaluate(()=>window.__johtoEntryAttempt===true)).toBe(true);
 await expect.poll(()=>page.evaluate(()=>({busy:TPArena.busy,pending:Module.ccall('tp_f4_store_pending','number',[],[]),open:Module.ccall('tp_battle_is_open','number',[],[]),energy:TPBattleEnergy.view.energy,replacing:tpSaveReplacing}))).toEqual({busy:false,pending:0,open:0,energy:100,replacing:false});expect(await page.evaluate(()=>TPArena.region)).toBe(1);expect(await mask(page,0)).toBe(0);expect(await mask(page,1)).toBe(0);await page.evaluate(()=>{writeSave=window.__johtoWrite;});
});
test('Johto UI: echte Liga, regionale Ehrung und bewusstes Shiny-Ei ohne Kanto-Anspruch',async({page})=>{
 test.setTimeout(120000);await H.importSave(page,fixture(255),376);await johto(page);await H.tap(page,130,435);await expect.poll(()=>page.evaluate(()=>screen)).toBe('league');expect(await page.evaluate(()=>TPLeague.region)).toBe(1);await quiet(page);await H.tap(page,233,380);await savedLeague(page,0,1);
 for(let index=0;index<26;index++){
  await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.region)).toBe(1);
  for(let turn=0;turn<80;turn++){const v=await page.evaluate(()=>TPLeague.state);if(!v.live||v.resolved)break;await H.battleAction(page,v.rests&&v.hp*100<v.maxHp*40?'rest':'quick');}
  if(index<25){await savedLeague(page,index+1,0);if(index===19){const carry=await page.evaluate(()=>({hp:TPLeague.state.hp,rests:TPLeague.state.rests}));const raw=Buffer.from(await page.evaluate(()=>Array.from(exportStateBytes(Module))));await exitToIdle(page);await H.importSave(page,recovered(raw),376);await johto(page);await H.tap(page,130,435);await savedLeague(page,20,0);expect(await page.evaluate(()=>({hp:TPLeague.state.hp,rests:TPLeague.state.rests}))).toEqual(carry);}await resumeStoredLeague(page);await savedLeague(page,index+1,1);}else await savedLeague(page,0,0);
 }
 await expect.poll(()=>page.evaluate(()=>TPHall.active)).toBe(true);expect(await page.evaluate(()=>TPHall.region)).toBe(1);const hall=await page.evaluate(()=>TPHall.view);expect(hall.wins).toBe(1);expect(hall.records[0].dex).toBe(376);expect(hall.records[0].nick).toBe('Johto-Test');expect(await page.evaluate(()=>JSON.parse(Module.ccall('tp_hall_view','string',[],[])).wins)).toBe(0);expect(await mask(page,0)).toBe(0);
 await H.tap(page,320,440);await expect.poll(()=>page.evaluate(()=>!TPHall.busy&&!tpSaveReplacing&&TPHall.view.seen===TPHall.view.wins)).toBe(true);await H.tap(page,127,160);await expect.poll(()=>page.evaluate(()=>TPRewardEgg.active)).toBe(true);expect(await page.evaluate(()=>TPRewardEgg.region)).toBe(1);await H.tap(page,233,100);expect(await page.evaluate(()=>TPRewardEgg.diagnostics.chosen)).toBe(152);page.once('dialog',d=>d.accept());await H.tap(page,320,440);
 await expect.poll(()=>page.evaluate(()=>!TPRewardEgg.busy&&!tpSaveReplacing&&TPRewardEgg.view.state===1)).toBe(true);await H.tap(page,233,386);await expect.poll(()=>page.evaluate(()=>!TPRewardEgg.busy&&!tpSaveReplacing&&TPRewardEgg.view.state===2)).toBe(true);expect(await page.evaluate(()=>fns.speciesId())).toBe(376);
 await H.tap(page,233,445);await H.tap(page,233,445);await H.tap(page,315,440);await expect.poll(()=>page.evaluate(()=>screen)).toBe('arena');await H.tap(page,300,435);await expect.poll(()=>page.evaluate(()=>screen)).toBe('card');await H.tap(page,233,406);await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
 const oldID=await page.evaluate(()=>TPCollection.read().active);await page.evaluate(()=>TPCollectionGame.openEnd('release'));const dialog=page.getByRole('dialog',{name:'Pflege beenden',exact:true});await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:'Pflege beenden und behalten',exact:true}).click();await expect(dialog).not.toBeVisible();await expect.poll(()=>page.evaluate(()=>fns.isEgg())).toBe(1);await H.tap(page,233,200);await H.tap(page,233,200);await H.tap(page,233,200);await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(152);await expect.poll(()=>page.evaluate(()=>TPCollection.read().mons.length)).toBe(2);
 const born=await page.evaluate(()=>JSON.parse(Module.ccall('tp_f4_current_snapshot','string',[],[])));expect(born.shiny).toBe(true);for(const gene of Object.values(born.data.genes)){expect(gene).toBeGreaterThanOrEqual(90);expect(gene).toBeLessThanOrEqual(110);}expect(await page.evaluate(id=>TPCollection.read().boxes.flatMap(b=>b.slots).filter(x=>x===id).length,oldID)).toBe(1);expect((await reward(page)).state).toBe(3);expect(await page.evaluate(()=>JSON.parse(Module.ccall('tp_rg_view','string',[],[])).eligible)).toBe(0);
 await page.reload();await H.waitReady(page);expect(await page.evaluate(()=>fns.speciesId())).toBe(152);expect((await reward(page)).state).toBe(3);expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(2);const kept=await page.evaluate(()=>JSON.parse(Module.ccall('tp_region_hall_view','string',['number'],[1])).records[0]);expect(kept.dex).toBe(376);expect(kept.level).toBe(100);expect(kept.nick).toBe('Johto-Test');
});
