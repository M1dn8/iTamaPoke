'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync('browser_ver/web/main.js','utf8');
const begin=source.indexOf('const resultBridge=');
const end=source.indexOf('if(capture){',begin);
assert(begin>=0&&end>begin,'App initialization section not found');
const bootCode=source.slice(begin,end);

function boot(withArktos,withLavados=true,withMewtu=true,withMew=true){
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
 if(withMew)window.TPMewModel={tag:'mew-model'};
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
assert.equal(full.instances.length,5);
const [zapdos,articuno,moltres,mewtwo,mew]=full.instances;
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
assert.equal(mew.profile,'mew');
assert.equal(mew.bridge.base,mewtwo.bridge);
assert.equal(mew.bound,full.controller);
assert.equal(full.window.TPMew,mew);
assert.equal(mew.args[2],full.window.TPMewModel);
assert.equal(full.options.bridge.base,mew.bridge);
assert.equal(zapdos.bound,full.controller);
assert.equal(articuno.bound,full.controller);
assert.equal(full.admission.bound,full.controller);
assert.equal(full.window.TPZapdos,zapdos);
assert.equal(full.window.TPArktos,articuno);
assert.equal(articuno.args[2],full.window.TPArktosModel);

for(const profile of ['zapdos','articuno','moltres','mewtwo','mew']){
 for(const suffix of ['Notice','Advance','Prepare','Result'])
  assert.equal(typeof full.options.nativeActions[profile+suffix],'function');
}

assert.throws(
 ()=>full.options.acquire('articunoResult'),
 /Spiel ist gerade beschaeftigt/
);
assert.equal(full.context.tpSaveReplacing,false);

full.context.screen='battle';
for(const context of ['articunoResult','zapdosResult','moltresResult','mewtwoResult','mewResult']){
 const release=full.options.acquire(context);
 assert.equal(full.context.tpSaveReplacing,true);
 assert.equal(typeof release,'function');
 release();
 assert.equal(full.context.tpSaveReplacing,false);
}
full.context.screen='settings';
for(const context of ['articunoNotice','articunoAdvance','articunoPrepare','moltresNotice','moltresAdvance','moltresPrepare','mewtwoNotice','mewtwoAdvance','mewtwoPrepare','mewNotice','mewAdvance','mewPrepare']){
 const release=full.options.acquire(context);
 assert.equal(full.context.tpSaveReplacing,true);
 release();
 assert.equal(full.context.tpSaveReplacing,false);
}

const fallback=boot(false,false,false,false);
assert.equal(fallback.instances.length,1);
assert.equal(fallback.options.bridge.base,fallback.instances[0].bridge);
assert.equal(fallback.window.TPArktos,undefined);
assert.equal(fallback.window.TPZapdos,fallback.instances[0]);
assert.equal(fallback.instances[0].bound,fallback.controller);

console.log('P06 Mew app wiring passed: actual initialization code, '+
 'shared adapter chain/controller, all five action namespaces, service binding, '+
 'battle-only result contexts and unchanged Zapdos fallback. '+
 'Dependencies are simulated; no WASM/browser/UI acceptance claim.');

assert.throws(
 ()=>full.options.acquire('moltresResult'),
 /Spiel ist gerade beschaeftigt/
);
assert.equal(full.context.tpSaveReplacing,false);
const withoutIce=boot(false,true,false,false);
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
const withoutBirds=boot(false,false,true,false);
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

assert.throws(
 ()=>full.options.acquire('mewResult'),/Spiel ist gerade beschaeftigt/
);
const onlyMew=boot(false,false,false,true);
assert.deepEqual(
 onlyMew.instances.map(instance=>instance.profile),['zapdos','mew']
);
assert.equal(onlyMew.window.TPMew,onlyMew.instances[1]);
assert.equal(onlyMew.options.bridge.base,onlyMew.instances[1].bridge);

const forestStyles=[];
const forestContext={
 document:{
  createElement:()=>new SceneNode(),
  head:{appendChild:node=>forestStyles.push(node)}
 }
};
vm.createContext(forestContext);
vm.runInContext(
 fs.readFileSync('browser_ver/web/nugget-bridge-scene.js','utf8'),
 forestContext
);
const approach=forestContext.TPNuggetBridgeScene.create('outside','north');
assert(approach.innerHTML.includes('data-bridge="nugget"'));
assert(approach.innerHTML.includes('data-bridge-deck="center"'));
for(const kind of ['outside','blocked','inner']){
 const scene=forestContext.TPNuggetBridgeScene.create(kind,'clearing');
 assert.equal(scene.attributes['aria-label'],'clearing');
 for(const place of ['bush','tree','rock'])
  assert(scene.innerHTML.includes('data-hiding-place="'+place+'"'));
 assert.equal(
  scene.innerHTML.includes('data-pink-trace="true"'),kind!=='inner'
 );
}
assert(forestStyles[0].textContent.includes('prefers-reduced-motion'));
const portraitSource=fs.readFileSync('browser_ver/web/zapdos-portrait.js','utf8');
const expression=portraitSource.match(/const scale=([^;]+);/);
assert(expression);
for(const dex of [144,145,146,150,151]){
 const width=40,height=40;
 const actual=vm.runInNewContext(expression[1],{dex,width,height,Math});
 const expected=Math.min(6,352/width,164/height)*
  (dex===151?.65:dex===145?1:.8);
 assert.equal(actual,expected);
}
console.log(
 'Mew app/scene checks passed: five-profile wiring, optional-profile '+
 'fallback, battle-only result, Nugget Bridge approach, three hiding '+
 'places, clue/cleared scenes and species-specific shared portrait scale. '+
 'Dependencies simulated; no visual acceptance claim.'
);
