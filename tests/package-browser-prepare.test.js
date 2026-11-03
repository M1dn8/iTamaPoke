'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');

const source=fs.readFileSync(
 'tools/browser-tests/specs/helpers.js','utf8'
);
const start=source.indexOf('async function prepare(');
const end=source.indexOf('async function openHubSection(',start);
assert(start>=0&&end>start);

const imports=[],events=[];
const defaultFixture=Buffer.from([1]);
const context={
 fixture:()=>defaultFixture,
 waitReady:async page=>{events.push(['ready',page]);},
 importSave:async(...args)=>{imports.push(args);}
};
vm.createContext(context);
vm.runInContext(
 source.slice(start,end)+'\nglobalThis.prepareTest=prepare;',
 context
);

const page={
 addInitScript:async()=>{events.push(['init']);},
 route:async()=>{events.push(['route']);},
 goto:async value=>{events.push(['goto',value]);}
};

(async()=>{
 await context.prepareTest(page);
 assert.equal(imports[0][0],page);
 assert.equal(imports[0][1],defaultFixture);
 assert.equal(imports[0][2],1);

 const custom=Buffer.from([2]);
 await context.prepareTest(page,custom);
 assert.equal(imports[1][1],custom);
 assert.equal(imports[1][2],1);

 const johto=Buffer.from([3]);
 await context.prepareTest(page,johto,376);
 assert.equal(imports[2][1],johto);
 assert.equal(imports[2][2],376);

 assert.equal(events.filter(e=>e[0]==='goto').length,3);
 assert(source.includes(
  'await expect.poll(()=>page.evaluate(()=>fns.speciesId())).toBe(expectedSpecies)'
 ));

 const spec=fs.readFileSync(
  'tools/browser-tests/specs/regions-johto.spec.js','utf8'
 );
 assert(spec.includes('await H.prepare(page,fixture(),376);'));

 console.log(
  'Browser prepare helper passed: default species 1 preserved, custom '+
  'fixture preserved, explicit species 376 forwarded and actual import '+
  'species assertion retained. Mocked setup only; browser test follows.'
 );
})().catch(error=>{
 console.error(error);process.exit(1);
});

{
 const arenaSource=fs.readFileSync(
  'tools/browser-tests/specs/arena-team.spec.js','utf8'
 );
 const a=arenaSource.indexOf('function arenaFixture(region){');
 const b=arenaSource.indexOf('async function setup(',a);
 assert(a>=0&&b>a);
 const base=Buffer.alloc(4);
 const probe={Buffer,H:{fixture:()=>base}};
 vm.createContext(probe);
 vm.runInContext(
  arenaSource.slice(a,b)+'\nglobalThis.makeArena=arenaFixture;',probe
 );
 assert.equal(probe.makeArena(0),base);
 const positive=probe.makeArena(1);
 const entries=new Map();let at=4;
 for(let i=0;i<positive.readUInt32LE(0);i++){
  const length=positive[at++],key=positive.toString('utf8',at,at+length);
  at+=length;
  const type=positive[at++],size=positive.readUInt32LE(at);at+=4;
  entries.set(key,{type,value:positive.subarray(at,at+size)});at+=size;
 }
 assert.equal(entries.get('lgver').type,1);
 assert.equal(entries.get('lgver').value.readBigInt64LE(),1n);
 assert.equal(entries.get('lgkdone').type,0);
 assert.equal(entries.get('lgkdone').value[0],1);
 assert.equal(entries.get('lgkdate').value.readBigInt64LE(),1700000000n);
 // Current setup must import the real care fixture before preparing the team.
 const setupEnd=arenaSource.indexOf('async function start(',b);
 assert(setupEnd>b,'Arena setup boundary missing');
 const CF=require('../tools/browser-tests/specs/care-team-fixtures');
 function validCareBase(){
  const entries=[['init',true],['dexn',1],['age',0]];
  const count=Buffer.alloc(4);count.writeUInt32LE(entries.length);
  return Buffer.concat([count,...entries.map(([key,value])=>{
   const name=Buffer.from(key);
   const boolean=typeof value==='boolean';
   const data=boolean?Buffer.from([Number(value)]):Buffer.alloc(8);
   if(!boolean)data.writeBigInt64LE(BigInt(value));
   const size=Buffer.alloc(4);size.writeUInt32LE(data.length);
   return Buffer.concat([
    Buffer.from([name.length]),name,
    Buffer.from([boolean?0:1]),size,data
   ]);
  })]);
 }
 const header=fs.readFileSync('upstream-expanded/pet.h','utf8');
 const levelMatch=header.match(/^#define\s+MINUTES_PER_LEVEL\s+(\d+)/m);
 assert(levelMatch,'Native level duration missing');
 const perLevel=Number(levelMatch[1]);

 function fieldsOf(bytes){
  const fields=new Map();let at=4;
  for(let i=0;i<bytes.readUInt32LE(0);i++){
   const length=bytes[at++];
   const key=bytes.toString('utf8',at,at+length);at+=length;
   const type=bytes[at++],size=bytes.readUInt32LE(at);at+=4;
   assert(!fields.has(key),'Duplicate fixture field: '+key);
   fields.set(key,{type,value:bytes.subarray(at,at+size)});at+=size;
  }
  assert.equal(at,bytes.length);
  return fields;
 }
 async function verifyCurrentArenaPreparation(){
  let checked=0;
  for(const region of [0,1]){
   for(const options of [{},{weak:true},{allWeak:true},{loss:true}]){
    const order=[],imported=[],seed={active:7,ids:[7,8]};
    const pageProbe={
     evaluate:async()=>{
      order.push('team');
      return seed;
     }
    };
    const scope={
     Buffer,CF,
     H:{
      fixture:()=>validCareBase(),
      importSave:async(...args)=>{
       order.push('import');imported.push(args);
      },
      game:async page=>{
       assert.equal(page,pageProbe);order.push('game');
      }
     },
     openArena:async(page,selectedRegion)=>{
      assert.equal(page,pageProbe);
      assert.equal(selectedRegion,region);
      order.push('arena');
     }
    };
    vm.createContext(scope);
    vm.runInContext(
     arenaSource.slice(a,setupEnd)+'\nglobalThis.runSetup=setup;',scope
    );
    assert.equal(await scope.runSetup(pageProbe,{region,...options}),seed);
    assert.deepEqual(order,['import','game','team','arena']);
    assert.equal(imported.length,1);
    assert.equal(imported[0][0],pageProbe);
    assert.equal(imported[0][2],25,'Actual care species must be imported');

    const fields=fieldsOf(imported[0][1]);
    const number=key=>{
     assert.equal(fields.get(key)?.type,1,key);
     return fields.get(key).value.readBigInt64LE();
    };
    assert.equal(number('dexn'),25n);
    assert.equal(number('eggT2'),25n);
    assert.equal(fields.get('nick').type,2);
    assert.equal(fields.get('nick').value.toString('utf8'),'Arena Alpha');
    const weak=!!(options.weak||options.allWeak);
    assert.equal(number('age'),BigInt((weak?0:19)*perLevel));
    if(region===1){
     assert.equal(number('lgver'),1n);
     assert.equal(fields.get('lgkdone').type,0);
     assert.equal(fields.get('lgkdone').value[0],1);
     assert.equal(number('lgkdate'),1700000000n);
    }else{
     assert.equal(fields.has('lgkdone'),false);
    }
    checked++;
   }
  }
  console.log(
   'Arena preparation contract passed: '+checked+
   ' actual setup routes; care species/name/age, typed Johto prerequisite '+
   'and import-before-team-before-arena order. Team execution mocked; '+
   'no native combat or browser execution claimed.'
  );
 }
 verifyCurrentArenaPreparation().catch(error=>{
  console.error(error);process.exitCode=1;
 });
}
