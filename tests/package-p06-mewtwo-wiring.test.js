'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync('browser_ver/web/main.js','utf8');
const begin=source.indexOf('const resultBridge=');
const end=source.indexOf('if(capture){',begin);
assert(begin>=0&&end>begin,'App initialization section not found');
const bootCode=source.slice(begin,end);

function boot(withArktos,withLavados=true,withMewtu=true){
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
 if(withLavados)window.TPLavadosModel={tag:'moltres-model'};
 if(withMewtu)window.TPMewtuModel={tag:'mewtwo-model'};
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
assert.equal(full.instances.length,4);
const [zapdos,articuno,moltres,mewtwo]=full.instances;
assert.equal(zapdos.profile,'zapdos');
assert.equal(articuno.profile,'articuno');
assert.equal(zapdos.bridge.base,full.plainBridge);
assert.equal(articuno.bridge.base,zapdos.bridge);
assert.equal(moltres.profile,'moltres');
assert.equal(moltres.bridge.base,articuno.bridge);
assert.equal(moltres.bound,full.controller);
assert.equal(full.window.TPLavados,moltres);
assert.equal(moltres.args[2],full.window.TPLavadosModel);
assert.equal(mewtwo.profile,'mewtwo');
assert.equal(mewtwo.bridge.base,moltres.bridge);
assert.equal(mewtwo.bound,full.controller);
assert.equal(full.window.TPMewtu,mewtwo);
assert.equal(mewtwo.args[2],full.window.TPMewtuModel);
assert.equal(full.options.bridge.base,mewtwo.bridge);
assert.equal(zapdos.bound,full.controller);
assert.equal(articuno.bound,full.controller);
assert.equal(full.admission.bound,full.controller);
assert.equal(full.window.TPZapdos,zapdos);
assert.equal(full.window.TPArktos,articuno);
assert.equal(articuno.args[2],full.window.TPArktosModel);

for(const profile of ['zapdos','articuno','moltres','mewtwo']){
 for(const suffix of ['Notice','Advance','Prepare','Result'])
  assert.equal(typeof full.options.nativeActions[profile+suffix],'function');
}

assert.throws(
 ()=>full.options.acquire('articunoResult'),
 /Spiel ist gerade beschaeftigt/
);
assert.equal(full.context.tpSaveReplacing,false);

full.context.screen='battle';
for(const context of ['articunoResult','zapdosResult','moltresResult','mewtwoResult']){
 const release=full.options.acquire(context);
 assert.equal(full.context.tpSaveReplacing,true);
 assert.equal(typeof release,'function');
 release();
 assert.equal(full.context.tpSaveReplacing,false);
}
full.context.screen='settings';
for(const context of ['articunoNotice','articunoAdvance','articunoPrepare','moltresNotice','moltresAdvance','moltresPrepare','mewtwoNotice','mewtwoAdvance','mewtwoPrepare']){
 const release=full.options.acquire(context);
 assert.equal(full.context.tpSaveReplacing,true);
 release();
 assert.equal(full.context.tpSaveReplacing,false);
}

const fallback=boot(false,false,false);
assert.equal(fallback.instances.length,1);
assert.equal(fallback.options.bridge.base,fallback.instances[0].bridge);
assert.equal(fallback.window.TPArktos,undefined);
assert.equal(fallback.window.TPZapdos,fallback.instances[0]);
assert.equal(fallback.instances[0].bound,fallback.controller);

console.log('P06 Mewtu app wiring passed: actual initialization code, '+
 'shared adapter chain/controller, all four action namespaces, service binding, '+
 'battle-only result contexts and unchanged Zapdos fallback. '+
 'Dependencies are simulated; no WASM/browser/UI acceptance claim.');

assert.throws(
 ()=>full.options.acquire('moltresResult'),
 /Spiel ist gerade beschaeftigt/
);
assert.equal(full.context.tpSaveReplacing,false);
const withoutIce=boot(false,true,false);
assert.deepEqual(
 withoutIce.instances.map(instance=>instance.profile),['zapdos','moltres']
);
assert.equal(
 withoutIce.options.bridge.base,withoutIce.instances[1].bridge
);
assert.equal(withoutIce.window.TPLavados,withoutIce.instances[1]);
console.log('Lavados fallback checks passed: battle-only result context and independent optional profile wiring.');

assert.throws(
 ()=>full.options.acquire('mewtwoResult'),
 /Spiel ist gerade beschaeftigt/
);
const withoutBirds=boot(false,false,true);
assert.deepEqual(
 withoutBirds.instances.map(instance=>instance.profile),['zapdos','mewtwo']
);
assert.equal(
 withoutBirds.options.bridge.base,withoutBirds.instances[1].bridge
);
assert.equal(withoutBirds.window.TPMewtu,withoutBirds.instances[1]);

class SceneNode{
 constructor(){this.dataset={};this.attributes={};}
 setAttribute(k,v){this.attributes[k]=v;}
}
const sceneStyles=[];
const sceneContext={
 document:{
  createElement:()=>new SceneNode(),
  head:{appendChild:node=>sceneStyles.push(node)}
 }
};
vm.createContext(sceneContext);
vm.runInContext(
 fs.readFileSync('browser_ver/web/cerulean-cave-scene.js','utf8'),
 sceneContext
);
for(const kind of ['outside','blocked']){
 const scene=sceneContext.TPCeruleanCaveScene.create(kind,'cave');
 assert(scene.innerHTML.includes('data-barrier="active"'));
 assert(scene.innerHTML.includes('data-floating-stones="true"'));
 assert.equal(scene.attributes['aria-label'],'cave');
}
const cleared=sceneContext.TPCeruleanCaveScene.create('inner','cleared');
assert(!cleared.innerHTML.includes('data-barrier="active"'));
assert(cleared.innerHTML.includes('data-cleared="true"'));
assert(sceneStyles[0].textContent.includes('prefers-reduced-motion'));
console.log(
 'Mewtu app/scene checks passed: optional-profile fallback, battle-only '+
 'result context, barrier/cleared scenery and reduced-motion rules. '+
 'Dependencies simulated; no visual acceptance claim.'
);
