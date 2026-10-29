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
 assert(arenaSource.includes(
  'if(region===1)await H.importSave(page,arenaFixture(region),1);'
 ));
 console.log('Arena fixture prerequisite passed: Kanto base unchanged, Johto receives typed historical Kanto completion before team setup.');
}
