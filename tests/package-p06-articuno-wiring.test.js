'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync('browser_ver/web/main.js','utf8');
const begin=source.indexOf('const resultBridge=');
const end=source.indexOf('if(capture){',begin);
assert(begin>=0&&end>begin,'App initialization section not found');
const bootCode=source.slice(begin,end);

function boot(withArktos){
 let options;
 const instances=[];
 const controller={tag:'shared-controller'};
 const plainBridge={tag:'plain'};
 const admission={
  nativeActions:{admissionComplete(){}},
  wrapBridge:base=>({tag:'admission-wrapper',base}),
  bind:value=>{admission.bound=value;}
 };
 const window={
  TPCollectionModel:{},
  TPZapdosModel:{tag:'zapdos-model'},
  TPAdmissionModel:{},
  TPAppMenu:{ready:true},
  TPCollectionZapdos:{
   create(...args){
    const profile=args[7]||'zapdos';
    const instance={
     profile,args,
     bridge:{tag:profile,base:args[5]},
     nativeActions:{
      [profile+'Notice'](){},
      [profile+'Advance'](){},
      [profile+'Prepare'](){},
      [profile+'Result'](){}
     },
     bind(value){instance.bound=value;}
    };
    instances.push(instance);
    return instance;
   }
  },
  TPCollectionPersistence:{
   create(value){options=value;return controller;}
  },
  TPStoreTools:{parseLegacy:bytes=>bytes}
 };
 if(withArktos)window.TPArktosModel={tag:'articuno-model'};
 const mod={};
 const context={
  window,mod,Module:mod,admission,plainBridge,
  leagueStart:null,arenaResult:null,wildResult:null,capture:null,life:null,
  screen:'settings',choice:'none',
  tpSaveReplacing:false,tpSaveEpoch:0,dragStart:null,dragNow:null,
  fns:{
   ceremony:()=>0,evolvingNow:()=>0,wildPromptActive:()=>0
  },
  exportStateBytes:()=>new Uint8Array(),
  writeSave:async()=>true
 };
 vm.createContext(context);
 vm.runInContext(bootCode,context);
 return {window,context,instances,options,controller,plainBridge,admission};
}

const full=boot(true);
assert.equal(full.instances.length,2);
const [zapdos,articuno]=full.instances;
assert.equal(zapdos.profile,'zapdos');
assert.equal(articuno.profile,'articuno');
assert.equal(zapdos.bridge.base,full.plainBridge);
assert.equal(articuno.bridge.base,zapdos.bridge);
assert.equal(full.options.bridge.base,articuno.bridge);
assert.equal(zapdos.bound,full.controller);
assert.equal(articuno.bound,full.controller);
assert.equal(full.admission.bound,full.controller);
assert.equal(full.window.TPZapdos,zapdos);
assert.equal(full.window.TPArktos,articuno);
assert.equal(articuno.args[2],full.window.TPArktosModel);

for(const profile of ['zapdos','articuno']){
 for(const suffix of ['Notice','Advance','Prepare','Result'])
  assert.equal(typeof full.options.nativeActions[profile+suffix],'function');
}

assert.throws(
 ()=>full.options.acquire('articunoResult'),
 /Spiel ist gerade beschaeftigt/
);
assert.equal(full.context.tpSaveReplacing,false);

full.context.screen='battle';
for(const context of ['articunoResult','zapdosResult']){
 const release=full.options.acquire(context);
 assert.equal(full.context.tpSaveReplacing,true);
 assert.equal(typeof release,'function');
 release();
 assert.equal(full.context.tpSaveReplacing,false);
}
full.context.screen='settings';
for(const context of ['articunoNotice','articunoAdvance','articunoPrepare']){
 const release=full.options.acquire(context);
 assert.equal(full.context.tpSaveReplacing,true);
 release();
 assert.equal(full.context.tpSaveReplacing,false);
}

const fallback=boot(false);
assert.equal(fallback.instances.length,1);
assert.equal(fallback.options.bridge.base,fallback.instances[0].bridge);
assert.equal(fallback.window.TPArktos,undefined);
assert.equal(fallback.window.TPZapdos,fallback.instances[0]);
assert.equal(fallback.instances[0].bound,fallback.controller);

console.log('P06 Arktos app wiring passed: actual initialization code, '+
 'shared adapter chain/controller, both action namespaces, service binding, '+
 'battle-only result contexts and unchanged Zapdos fallback. '+
 'Dependencies are simulated; no WASM/browser/UI acceptance claim.');
