const {test,expect}=require('@playwright/test');const H=require('./helpers');
function strong(marked=false){const b=H.fixture(),fields=[];let p=4;for(let i=0;i<b.readUInt32LE(0);i++){const n=b[p++],key=b.toString('utf8',p,p+n);p+=n;const type=b[p++],size=b.readUInt32LE(p);p+=4;const value=Buffer.from(b.subarray(p,p+size));p+=size;if(key==='dexcgt'&&marked){value.fill(255);value[value.length-1]=1;}if(key==='dexn')value.writeBigInt64LE(376n);if(key==='age')value.writeBigInt64LE(5940n);if(['gatk','gdef','gspe'].includes(key))value.writeBigInt64LE(110n);if(['full','joy','ene','hyg','bond'].includes(key))value.writeBigInt64LE(100n);const k=Buffer.from(key),len=Buffer.alloc(4);len.writeUInt32LE(value.length);fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),len,value]));}for(const key of ['tatk','tdef','tspe']){const k=Buffer.from(key),len=Buffer.alloc(4),value=Buffer.alloc(8);len.writeUInt32LE(8);value.writeBigInt64LE(100n);fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([1]),len,value]));}const count=Buffer.alloc(4);count.writeUInt32LE(fields.length);return Buffer.concat([count,...fields]);}
async function importStrong(page,marked=false){await H.openMenu(page);await page.getByRole('button',{name:'Sicherungen',exact:true}).click();const panel=H.modal(page);await expect(panel).toBeVisible();await panel.locator('input[type=file]').setInputFiles({name:'Capture-Metagross.tpsave',mimeType:'application/octet-stream',buffer:strong(marked)});const apply=panel.getByRole('button',{name:'Importieren und aktuellen Stand ersetzen',exact:true});await expect(apply).toBeVisible();page.once('dialog',dialog=>dialog.accept());await Promise.all([page.waitForEvent('load'),apply.click()]);await H.waitReady(page);await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(376);}
async function battle(page){await H.prepareWildCapture(page);}

async function start(page,marked=false){await importStrong(page,marked);await battle(page);await expect.poll(()=>page.evaluate(()=>!TPCollection.busy&&!tpSaveReplacing)).toBe(true);await expect.poll(()=>page.evaluate(()=>TPBattleView.current?.mode)).toBe('wild');await expect.poll(()=>page.evaluate(()=>!!TPBattleView.target('catch'))).toBe(true);}


test('Nicht fangen: Rückpfeil erhält offene Fangwahl, Weiter bestätigt einmal',
async({page})=>{
 await H.prepare(page);await start(page);
 const root=page.locator('#tp-battle-page');
 const expectedReturn=await page.evaluate(()=>battleReturn);
 const snapshot=()=>page.evaluate(()=>({
  hp:fns.battlePlayerHp(),round:fns.battleRound(),
  done:!!fns.battleCatchDone(),tried:!!fns.battleCatchTried(),
  count:TPCollection.read().mons.length,active:TPCollection.read().active,
  team:TPCollection.read().team,energy:TPBattleEnergy.view.energy,
  pending:TPAdmission.read().pending
 }));
 const before=await snapshot();
 expect(before.done).toBe(false);expect(before.tried).toBe(false);
 await expect(root.locator('[data-battle-action="leave"]')).toHaveText('nicht fangen');

 await H.battleAction(page,'leave',{confirm:false});
 await expect(root).toHaveAttribute('data-no-catch-confirm','true');
 await expect(root.locator('[data-battle-action="confirm-no-catch"]')).toHaveText('Weiter');
 expect(await snapshot()).toEqual(before);

 const back=root.locator('[data-battle-action="cancel-no-catch"]');
 await expect(back).toBeVisible();
 await back.click();
 await expect(root.locator('[data-battle-action="catch"]')).toBeVisible();
 await expect(root.locator('[data-battle-action="leave"]')).toBeVisible();
 expect(await snapshot()).toEqual(before);

 await H.battleAction(page,'leave',{confirm:false});
 await root.locator('[data-battle-action="confirm-no-catch"]').click();
 await expect.poll(()=>page.evaluate(()=>
  Module.ccall('tp_battle_is_open','number',[],[])
 )).toBe(0);
 await expect.poll(()=>page.evaluate(()=>screen)).toBe(expectedReturn);
 expect(await page.evaluate(()=>TPCollection.read().mons.length)).toBe(before.count);
 expect(await page.evaluate(()=>TPCollection.read().active)).toBe(before.active);
 expect(await page.evaluate(()=>TPAdmission.read().pending)).toEqual(before.pending);
});
