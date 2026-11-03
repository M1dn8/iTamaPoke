const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('browser_ver/web/card.js','utf8');
const a=source.indexOf('/* UI01 inline profile name editor */');
const b=source.indexOf('function drawKeyboard()',a);
assert(a>=0&&b>a);
const c={console,TextEncoder,document:{getElementById(){return null;},documentElement:{}},
 setInterval(){return 0;},clearInterval(){}};
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/de-ui.js','utf8'),c);
vm.runInContext(source.slice(a,b),c);
assert.equal(vm.runInContext('typeof renameUI.draw',c),'function');
const keys=Object.keys(c.TPText.catalogue('en'))
 .filter(key=>key.startsWith('nameEditor.')).sort();
for(const code of ['en','de','es','fr']){
 assert.deepEqual(Object.keys(c.TPText.catalogue(code))
  .filter(key=>key.startsWith('nameEditor.')).sort(),keys);
}
const validator=/function validateName\(value,initial,capacity\)\{[\s\S]*?\n \}/.exec(source);
assert(validator);vm.runInContext(validator[0],c);
assert.equal(c.validateName('Atlas','',23),'');
assert.equal(c.validateName('ABCDEFGHIJK','',23),'');
assert.equal(c.validateName('ABCDEFGHIJKL','',23),'long');
assert.equal(c.validateName('Browser-Test','Browser-Test',23),'');
assert.equal(c.validateName('가'.repeat(7),'',23),'');
assert.equal(c.validateName('가'.repeat(8),'',23),'long');
assert.equal(c.validateName('A\nB','',23),'invalid');
assert.equal(c.validateName('\ud800','',23),'invalid');
assert.equal(c.validateName('','',23),'');
console.log('Namenseditor: Start, vier Kataloge, Unicode-, Zeichen- und Byteprüfung bestanden.');
