const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const H=require('./helpers');
const T=require('../../../browser_ver/web/storage-tools.js');

const header=fs.readFileSync('upstream-expanded/pet.h','utf8');
const minutes=header.match(/^#define\s+MINUTES_PER_LEVEL\s+(\d+)/m);
if(!minutes)throw Error('MINUTES_PER_LEVEL nicht eindeutig lesbar.');
const minutesPerLevel=Number(minutes[1]);

function encode(values){
 const chunks=[];
 for(const [key,entry]of values){
  const name=Buffer.from(key,'utf8');
  let data;
  if(entry.type===0)data=Buffer.from([entry.value?1:0]);
  else if(entry.type===1){
   data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(entry.value));
  }else if(entry.type===2)data=Buffer.from(entry.value,'utf8');
  else if(entry.type===3)data=Buffer.from(entry.value);
  else throw Error('Unbekannter Fixture-Typ.');
  const length=Buffer.alloc(4);length.writeUInt32LE(data.length);
  chunks.push(Buffer.concat([Buffer.from([name.length]),name,Buffer.from([entry.type]),length,data]));
 }
 const count=Buffer.alloc(4);count.writeUInt32LE(values.size);
 const bytes=Buffer.concat([count,...chunks]);
 T.parseLegacy(bytes);
 return bytes;
}
function fixture(bond,used,epoch){
 const values=new Map(T.parseLegacy(H.fixture(0)).values);
 // This isolated fixture deliberately uses the existing legacy migration.
 values.delete('f4col');
 const day=Math.floor((epoch+3600)/86400);
 const numbers={
  dexn:172,eggT2:172,age:100*minutesPerLevel,
  full:90,joy:90,ene:90,hyg:90,bond,
  seen:epoch,cday:day,psver:1,pskind:0,psbday:day,psbond:used,
  gatk:100,gdef:100,gspe:100,lang:3
 };
 for(const [key,value]of Object.entries(numbers))
  values.set(key,{type:1,value});
 values.set('sleep',{type:0,value:false});
 values.set('nick',{type:2,value:'Bindungs-Test'});
 values.set('psvec',{type:3,value:Buffer.alloc(4)});
 const registered=Buffer.from(values.get('dexreg').value);
 registered[(172-1)>>3]|=1<<((172-1)&7);
 values.set('dexreg',{type:3,value:registered});
 return encode(values);
}
async function setup(page,bond,used=0){
 const epoch=Math.floor(Date.now()/1000);
 await page.clock.setFixedTime(new Date(epoch*1000));
 await H.prepare(page);
 await H.importSave(page,fixture(bond,used,epoch),172);
 await H.game(page);
 await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(172);
 await expect.poll(()=>page.evaluate(()=>fns.level())).toBe(100);
 await expect.poll(()=>page.evaluate(()=>fns.bond())).toBe(bond);
 return epoch;
}
async function action(page){
 return page.evaluate(async()=>{
  const before=fns.bond();
  Module.ccall('tp_catch_result','number',['number'],[0]);
  await saveNow(Module);
  const values=TPStoreTools.parseLegacy(exportStateBytes(Module)).values;
  const get=key=>values.get(key)?.value;
  return {
   before,bond:fns.bond(),stored:get('bond'),
   budget:get('psbond'),budgetDay:get('psbday'),careDay:get('cday'),
   build:document.querySelector('meta[name="tp-build"]')?.content||'local'
  };
 });
}

test('Bindung Web-App: 50 wird 51 und überlebt vollständigen Reload',async({page})=>{
 await setup(page,50);
 const state=await action(page);
 console.log('Bindungsprobe 50 -> 51:',state);
 expect(state.bond).toBe(51);
 expect(state.stored).toBe(51);
 expect(state.budget).toBe(1);
 await page.reload();await H.waitReady(page);
 await expect.poll(()=>page.evaluate(()=>fns.bond())).toBe(51);
});

test('Bindung Web-App: Tageslimit bleibt beim Reload und erneuert sich am Folgetag',async({page})=>{
 const epoch=await setup(page,50,8);
 const sameDay=await action(page);
 expect(sameDay.bond).toBe(50);
 expect(sameDay.budget).toBe(8);
 await page.reload();await H.waitReady(page);
 await expect.poll(()=>page.evaluate(()=>fns.bond())).toBe(50);

 await page.clock.setFixedTime(new Date((epoch+86400)*1000));
 await page.reload();await H.waitReady(page);
 const nextDay=await action(page);
 console.log('Bindungsprobe Folgetag:',nextDay);
 expect(nextDay.bond).toBe(55);
 expect(nextDay.stored).toBe(55);
 expect(nextDay.budget).toBe(1);
 await page.reload();await H.waitReady(page);
 await expect.poll(()=>page.evaluate(()=>fns.bond())).toBe(55);
});

test('Bindung Web-App: Pichu 59 -> 60, echte Entwicklung und gespeichertes Pikachu',async({page})=>{
 await setup(page,59);
 expect(await page.evaluate(()=>Module.ccall(
  'tp_evo_rule_field','number',['number','number','number'],[172,0,9]
 ))).toBe(0);

 const state=await action(page);
 expect(state.bond).toBe(60);
 expect(await page.evaluate(()=>Module.ccall(
  'tp_evo_rule_field','number',['number','number','number'],[172,0,9]
 ))).toBe(1);

 const evolved=await page.evaluate(async()=>{
  const result=Module.ccall('tp_evo_choose','number',['number'],[25]);
  await saveNow(Module);
  return {result,species:fns.speciesId(),bond:fns.bond()};
 });
 expect(evolved).toEqual({result:1,species:25,bond:60});
 await page.reload();await H.waitReady(page);
 await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(25);
 await expect.poll(()=>page.evaluate(()=>fns.bond())).toBe(60);
});
