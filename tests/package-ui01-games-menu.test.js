'use strict';
const fs=require('node:fs'),path=require('node:path');
const vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const main=fs.readFileSync(path.join(root,'browser_ver/web/main.js'),'utf8');
const start=main.indexOf('/* UI01 games selection: shared double display */');
const end=main.indexOf('function drawGameMenu()',start);
assert(start>=0&&end>start);
const context={
 console,document:{getElementById(){return null;},documentElement:{}},
 setInterval(){return 0;}
};
context.window=context;vm.createContext(context);
vm.runInContext(fs.readFileSync(
 path.join(root,'browser_ver/web/de-ui.js'),'utf8'
),context);
vm.runInContext(main.slice(start,end),context);
assert.equal(vm.runInContext('typeof gameMenuUI.show',context),'function');
const english=Object.keys(context.TPText.catalogue('en'))
 .filter(key=>key.startsWith('gamesMenu.')).sort();
assert(english.length>0);
for(const code of ['en','de','es','fr']){
 assert.deepEqual(Object.keys(context.TPText.catalogue(code))
  .filter(key=>key.startsWith('gamesMenu.')).sort(),english);
 assert.equal(typeof context.TPText.t('gamesMenu.start',{},code),'string');
}
console.log('Spieleauswahl: Startprüfung und vier Sprachkataloge bestanden.');


// Shared type-symbol consistency
const eggSource=fs.readFileSync(
 path.join(root,'browser_ver/web/egg-planning.js'),'utf8'
);
const symbolMatch=/const typePaths\s*=\s*(\[[\s\S]*?\]);/.exec(eggSource);
assert(symbolMatch,'Existing type symbols must be available');
const typePaths=vm.runInNewContext(symbolMatch[1]);
for(const type of [1,2,3,5]){
 assert(main.includes(JSON.stringify(typePaths[type])),
  'Preview must use the existing symbol for type '+type);
}
console.log('Typvorschau: vorhandene Symbolformen unverändert übernommen.');
