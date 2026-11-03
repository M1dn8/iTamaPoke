const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const c={console,
 document:{getElementById(){return null;},documentElement:{}},
 setInterval(){return 0;},clearInterval(){}};
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/de-ui.js','utf8'),c);
vm.runInContext(fs.readFileSync('browser_ver/web/mega.js','utf8'),c);
assert.equal(typeof c.TPMega,'object');
for(const key of ['view','act','draw','hide']){
 assert.equal(typeof c.TPMega[key],'function',key);
}
const keys=Object.keys(c.TPText.catalogue('en')).filter(key=>key.startsWith('megaPage.'));
assert(keys.length>0);
for(const code of ['de','en','es','fr']){
 const catalogue=c.TPText.catalogue(code);
 for(const key of keys)assert.equal(typeof catalogue[key],'string',code+': '+key);
}
console.log('Mega-Start: echtes Sprachregister, vier Kataloge und öffentliche UI-Schnittstelle bestanden.');
