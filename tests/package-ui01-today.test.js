const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('browser_ver/web/card.js','utf8');
const context={};vm.createContext(context);
for(const name of ['dailyDoneCount','todayTone']){
 const found=new RegExp('function '+name+'\\([^\\n]*\\)\\{[\\s\\S]*?\\n \\}').exec(source);
 assert(found,'Actual daily UI helper missing: '+name);
 vm.runInContext(found[0],context);
}
assert.equal(context.dailyDoneCount([{done:true},{done:false},{done:true}]),2);
assert.equal(context.dailyDoneCount([{done:false,progress:5,target:5}]),0);
assert.equal(context.todayTone('NACHT'),'night');
assert.equal(context.todayTone('NIGHT'),'night');
assert.equal(context.todayTone('NUIT'),'night');
assert.equal(context.todayTone('MORGEN'),'morning');
assert.equal(context.todayTone('SOIR'),'evening');
assert.equal(context.todayTone('DÍA'),'day');
assert.equal(context.todayTone('unknown'),null);
console.log('Heute: Abschlussflags und Tagesphasen-Darstellung bestanden.');
