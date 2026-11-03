const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('browser_ver/web/diagnostics.js','utf8');
const a=source.indexOf('/* UI01 diagnostics: grouped technical display */');
const b=source.indexOf('function mount(host,alive){',a);
assert(a>=0&&b>a);
const c={console,fns:{language:()=>3},document:{getElementById(){return null;},documentElement:{}},
 setInterval(){return 0;},clearInterval(){}};
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/de-ui.js','utf8'),c);
vm.runInContext(source.slice(a,b),c);
const state={
 version:'test-version',letzteSpeicherung:null,speicherergebnis:'Fehler',fehler:[],
 pruefung:{spielstand:{status:'Lesetest'},offline:{status:'Test',vorhanden:2,erwartet:3},
 dateien:{Grafikdateien:7},speicher:{genutzt:1048576,rahmen:2097152}},
 grafikcache:{bekanntePufferBytes:1024,geladeneObjekte:2}
};
const before=JSON.stringify(state);
const rows=c.diagnosticUiRows(state,'');
assert.equal(rows.save.find(row=>row.key==='saveStatus').value,'Lesetest');
assert.equal(rows.files.find(row=>row.key==='Grafikdateien').value,'7');
assert.equal(rows.memory.find(row=>row.key==='objects').value,'2');
assert.equal(rows.system.find(row=>row.key==='version').value,'test-version');
assert.equal(JSON.stringify(state),before);
const overview=c.diagnosticUiOverviewNumbers(state);
assert.equal(overview.offlineRatio,2/3);
assert.equal(overview.memoryRatio,.5);
assert.equal(overview.graphics,7);
assert.equal(overview.cries,null);
const unknown=c.diagnosticUiOverviewNumbers({fehler:[]});
assert.equal(unknown.offlineRatio,null);
assert.equal(unknown.memoryRatio,null);
assert.equal(unknown.used,null);
assert.equal(JSON.stringify(state),before);
for(const code of ['en','de','es','fr']){
 assert.equal(typeof c.TPText.catalogue(code)['diagnosticsPage.note'],'string');
}
console.log('Diagnose-Darstellung: vorhandene Werte, vier Kataloge und unveränderte Eingangsdaten bestanden.');
