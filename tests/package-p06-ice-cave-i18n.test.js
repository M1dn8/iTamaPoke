'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const languageSource=fs.readFileSync(
 'browser_ver/web/de-ui.js','utf8'
);
const gameSource=fs.readFileSync(
 'browser_ver/web/ice-cave-game.js','utf8'
);
const keys=[
 'start','again','target','area','time',
 'complete','retrySave','saveFailed','failed'
];

for(const initialLanguage of [0,1,2,3]){
 const context={
  console,
  fns:{language:()=>initialLanguage},
  document:{
   documentElement:{},
   getElementById:()=>null
  },
  setInterval:()=>0
 };
 context.window=context;
 vm.createContext(context);

 vm.runInContext(languageSource,context);
 vm.runInContext(gameSource,context);

 // First access must register English before the other catalogues.
 assert.doesNotThrow(()=>context.TPIceCaveGame.text('start'));

 context.TPText.clearMissing();

 for(const code of ['en','de','es','fr']){
  const catalogue=context.TPText.catalogue(code);
  for(const key of keys){
   assert.equal(
    typeof catalogue['articunoGame.'+key],
    'string',
    code+': '+key
   );
  }
  assert.equal(
   context.TPText.t('articunoGame.time',{seconds:'10.0'},code),
   '10.0 s'
  );
 }

 assert.equal(
  context.TPText.t('articunoGame.failed',{},'de'),
  'Der Schneesturm ist zu stark, ich muss es noch einmal versuchen.'
 );
 assert.equal(context.TPText.missingKeys().length,0);
}
console.log(
 'Arktos minigame i18n integration passed: actual language registry, '+
 'first access in all four UI languages, English-first registration, '+
 'complete catalogues, time placeholders and exact German failure text. '+
 'No browser/touch acceptance claim.'
);
