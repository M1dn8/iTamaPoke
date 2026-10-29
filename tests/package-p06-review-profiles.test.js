'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync('tools/review/manual-review.cjs','utf8');
const start=source.indexOf('// P06 review profile configuration');
const end=source.indexOf('// End P06 review profile configuration',start);
assert(start>=0&&end>start);
const block=source.slice(start,end);

function evaluate(manifest,exists=true){
 const context={
  path,saves:'/synthetic-review',
  fs:{
   existsSync:()=>exists,
   readFileSync:()=>JSON.stringify(manifest)
  }
 };
 vm.createContext(context);
 vm.runInContext(block+'\nglobalThis.result={reviewStory,names};',context);
 return context.result;
}
const legacy=evaluate(null,false);
assert.equal(legacy.reviewStory,'articuno');
assert.equal(legacy.names.length,8);
assert.equal(legacy.names[4],'05-arktos-minispiel');

const names=Array.from({length:8},(_,i)=>
 String(i+1).padStart(2,'0')+'-lavados-fall'
);
const valid={schema:1,story:'moltres',names};
const current=evaluate(valid);
assert.equal(current.reviewStory,'moltres');
assert.deepEqual(Array.from(current.names),names);
assert(Object.isFrozen(current.names));

for(const invalid of [
 null,[],{}, {...valid,schema:2},
 {...valid,story:'unknown'}, {...valid,extra:true},
 {...valid,names:names.slice(1)},
 {...valid,names:[...names.slice(0,7),'../escape']},
 {...valid,names:[...names.slice(0,7),names[0]]},
 {...valid,names:[...names.slice(0,7),null]}
])assert.throws(()=>evaluate(invalid));

assert(source.includes('iTamaPoke-Revisionsbrowser-Playwright'));
assert(source.includes('chromium.launchPersistentContext(profile,options)'));
assert(source.includes("serviceWorkers:'block'"));
assert(source.includes("['TPLavadosModel','moltres-story-model.js']"));
assert(source.includes("['TPMewtuModel','mewtwo-story-model.js']"));
assert(source.includes("['TPMewModel','mew-story-model.js']"));
const mewNames=names.map(name=>name.replace('lavados','mew'));
const mewProfile=evaluate({schema:1,story:'mew',names:mewNames});
assert.equal(mewProfile.reviewStory,'mew');
assert.deepEqual(Array.from(mewProfile.names),mewNames);

const mewtuNames=names.map(name=>name.replace('lavados','mewtwo'));
const mewtuProfile=evaluate({schema:1,story:'mewtwo',names:mewtuNames});
assert.equal(mewtuProfile.reviewStory,'mewtwo');
assert.deepEqual(Array.from(mewtuProfile.names),mewtuNames);

assert(source.includes("'p146.bin'"));
assert(source.includes('arktos:read('));
assert(source.includes('lavados:read('));
assert(!source.includes('channel:'));

// Catalogue profile keeps the existing browser and routes every case to the list.
{
 const catalogueNames=names.map(name=>name.replace('lavados','katalog'));
 const catalogue=evaluate({
  schema:1,story:'catalogue',names:catalogueNames
 });
 assert.equal(catalogue.reviewStory,'catalogue');
 assert.deepEqual(Array.from(catalogue.names),catalogueNames);
 assert(Object.isFrozen(catalogue.names));

 const routeStart=source.indexOf('async function openStory(){');
 const routeEnd=source.indexOf('\nasync function graphics(){',routeStart);
 assert(routeStart>=0&&routeEnd>routeStart);
 const routing=source.slice(routeStart,routeEnd);

 for(const story of ['articuno','moltres','mewtwo','mew','catalogue']){
  for(let current=1;current<=8;current++){
   let routed=null;
   vm.runInNewContext(routing+'\nopenStory();',{
    reviewStory:story,current,
    page:{evaluate(_callback,target){routed=target;}}
   });
   assert.equal(
    routed,
    story==='catalogue'||current<=3?'stories':story,
    'Wrong review route: '+story+' / '+current
   );
  }
 }
 assert(source.includes("await loadCase(reviewStory==='catalogue'?1:5);"));
}

console.log(
 'Review profile checks passed: unchanged Arktos fallback, Lavados manifest, '+
 'strict names/schema validation, existing persistent Playwright profile, '+
 'local sprites, screenshot diagnostics and catalogue routing. No browser launched.'
);
