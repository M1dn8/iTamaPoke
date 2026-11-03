'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const context={
 console,
 document:{getElementById(){return null;},documentElement:{}},
 setInterval(){return 0;}
};
context.window=context;
vm.createContext(context);
vm.runInContext(
 fs.readFileSync(path.join(root,'browser_ver/web/de-ui.js'),'utf8'),
 context,{filename:'de-ui.js'}
);
vm.runInContext(
 fs.readFileSync(path.join(root,'browser_ver/web/regional-reward-egg.js'),'utf8'),
 context,{filename:'regional-reward-egg.js'}
);
assert.equal(typeof context.TPRewardEgg,'object');
assert.equal(typeof context.TPRewardEgg.open,'function');
assert.equal(typeof context.TPRewardEgg.draw,'function');
assert.equal(context.TPRewardEgg.active,false);
for(const code of ['en','de']){
 const catalogue=context.TPText.catalogue(code);
 for(const key of ['title','reserve','confirm','yes','no']){
  assert.equal(typeof catalogue['rewardDevice.'+key],'string');
 }
}
console.log('Ehrenei-Startprüfung bestanden: echtes Sprachregister, Kataloge und API-Initialisierung.');
