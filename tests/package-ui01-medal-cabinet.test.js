const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('browser_ver/web/card.js','utf8');
const found=/function medalArt\(index,got\)\{[\s\S]*?\n \}/.exec(source);
assert(found,'Actual medal renderer missing');
const context={node(){return{
 dataset:{},style:{setProperty(){}},setAttribute(){},innerHTML:''
};}};
vm.createContext(context);vm.runInContext(found[0],context);
const drawings=[];
for(let index=0;index<8;index++){
 const open=context.medalArt(index,false),earned=context.medalArt(index,true);
 assert.equal(open.dataset.earned,'false');
 assert.equal(earned.dataset.earned,'true');
 assert.equal(open.dataset.medalKind,String(index));
 assert.match(open.innerHTML,/<svg /);
 drawings.push(open.innerHTML);
}
assert.equal(new Set(drawings).size,8,'Eight distinct medal motifs required');
console.log('Medaillenvitrine: acht Motive und beide Darstellungszustände bestanden.');
