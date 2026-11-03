const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('browser_ver/web/main.js','utf8');
const a=source.indexOf('function onSwipe(dir) {');
const b=source.indexOf("// Ports PetScreen.swift's onSwipeV",a);
assert(a>=0&&b>a);
const button=/function idleButtonAvailable\(label,sleeping\) \{[\s\S]*?\n\}/.exec(source);
assert(button);
let egg=0,starter=0;
const c={
 screen:'idle',choice:'none',tpSaveReplacing:false,
 dexScreen:'detail',dexPage:7,dexFilter:2,dexDetailPage:0,
 cardPage:0,starterPage:1,
 fns:{awaitingStarter:()=>starter,isEgg:()=>egg,ceremony:()=>0,evolvingNow:()=>0},
 swipeAllowed:()=>true,cardPageCount:()=>8,starterPageCount:()=>3,dexPageCount:()=>4
};
c.window=c;vm.createContext(c);
vm.runInContext(source.slice(a,b),c);
vm.runInContext(button[0],c);
for(const direction of [-1,1]){
 c.screen='idle';c.dexScreen='detail';c.dexPage=7;c.dexFilter=2;
 c.onSwipe(direction);
 assert.equal(c.screen,'idle');
 assert.equal(c.dexPage,7);assert.equal(c.dexFilter,2);
}
assert.equal(c.openPokedexFromIdle(),true);
assert.equal(c.screen,'dex');assert.equal(c.dexScreen,'grid');
assert.equal(c.dexPage,0);assert.equal(c.dexFilter,0);
c.screen='idle';c.TPCollection={busy:true};
assert.equal(c.openPokedexFromIdle(),false);
assert.equal(c.screen,'idle');delete c.TPCollection;
egg=1;assert.equal(c.openPokedexFromIdle(),false);egg=0;
c.tpSaveReplacing=true;assert.equal(c.openPokedexFromIdle(),false);c.tpSaveReplacing=false;
starter=1;c.starterPage=1;c.onSwipe(1);assert.equal(c.starterPage,0);starter=0;
c.screen='dex';c.dexScreen='grid';c.dexPage=1;c.onSwipe(-1);
assert.equal(c.dexPage,2);
c.dexScreen='detail';c.dexDetailPage=0;c.onSwipe(-1);assert.equal(c.dexDetailPage,1);
for(const label of ['FEED','PLAY','CLEAN']){
 assert.equal(c.idleButtonAvailable(label,true),false);
 assert.equal(c.idleButtonAvailable(label,false),true);
}
assert.equal(c.idleButtonAvailable('LIGHT',true),true);
assert.equal(c.idleButtonAvailable('POKEDEX',true),true);
console.log('Hauptnavigation: keine Idle-Wischroute, expliziter Einstieg und enge Schlafausnahme bestanden.');
