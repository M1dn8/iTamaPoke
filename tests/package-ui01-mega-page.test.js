const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('browser_ver/web/mega.js','utf8');
const c={};vm.createContext(c);
for(const name of ['megaPageMode','megaClockValue']){
 const match=new RegExp('function '+name+'\\([^\\n]*\\)\\{[\\s\\S]*?\\n\\}').exec(source);
 assert(match,name);vm.runInContext(match[0],c);
}
const base={supported:1,active:0,stone:0,quest:0,now:100,cool:0};
assert.equal(c.megaPageMode(base,false),'quest');
assert.equal(c.megaPageMode({...base,quest:1},false),'claim');
assert.equal(c.megaPageMode({...base,stone:1},false),'ready');
assert.equal(c.megaPageMode({...base,stone:1,cool:200},false),'cooldown');
assert.equal(c.megaPageMode({...base,active:1},false),'active');
assert.equal(c.megaPageMode(base,true),'sleep');
const clock=c.megaClockValue({active:1,end:1000,now:550});
assert.equal(clock.seconds,450);assert.equal(clock.ratio,.5);
console.log('Mega-Seite: native Zustandsdarstellung und reine Laufzeitanzeige bestanden.');
