const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('browser_ver/web/card.js','utf8');
const found=/function battleNumbers\(line,count\)\{[\s\S]*?\n \}/.exec(source);
assert(found,'Actual display adapter missing');
const c={};vm.createContext(c);vm.runInContext(found[0],c);
for(const line of ['S/N 12/5','W/L 12/5','VD 12/5','V/D 12/5']){
 assert.deepEqual(Array.from(c.battleNumbers(line,2)),[12,5]);
}
assert.deepEqual(Array.from(c.battleNumbers('SERIE 7',1)),[7]);
assert.deepEqual(Array.from(c.battleNumbers('S/N 0/0',2)),[0,0]);
assert.equal(c.battleNumbers('unbekannt',2),null);
assert.equal(c.battleNumbers('V2 12/5',2),null);
console.log('Ergebnistafel: reine Zahlenanzeige und sicherer Rohtext-Rückfall bestanden.');
