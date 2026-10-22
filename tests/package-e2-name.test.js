const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const main=fs.readFileSync('browser_ver/web/main.js','utf8'),card=fs.readFileSync('browser_ver/web/card.js','utf8');
const header=main.split('\n').find(s=>s.includes('ctx.fillText(window.TPMega?.active()?'));assert(header);
const start=card.indexOf('function drawCardProfile(now)'),end=card.indexOf('  if (currentSprite) {',start);assert(start>=0&&end>start);const profile=card.slice(start,end)+'}\n';
let state={active:false,nick:'',species:'Metagross',mega:'Mega-Metagross',level:46,shiny:false},texts=[];
const c={window:null,TP:{cx:233},UI:{ink:'#000',track:'#aaa'},ctx:{fillText(...args){texts.push(args);}},ensureSprite(){},fns:{name:()=>state.nick||state.species,hasNick:()=>state.nick?1:0,speciesName:()=>state.species,speciesId:()=>state.species==='Metagross'?376:6,level:()=>state.level,headerName:()=>((state.shiny?'*':'')+(state.nick||state.species)+' · Lv.'+state.level)}};
c.window=c;c.TPMega={active:()=>state.active,visible:()=>true,name:()=>state.mega,shiny:()=>state.shiny};vm.createContext(c);vm.runInContext(profile,c);
function title(){const saved=JSON.stringify(state);texts=[];vm.runInContext(header,c);assert.equal(JSON.stringify(state),saved);return texts[0][0];}
function profileText(){const saved=JSON.stringify(state);texts=[];c.drawCardProfile(0);assert.equal(JSON.stringify(state),saved);return texts.map(x=>x[0]);}
assert.equal(title(),'Metagross · Lv.46');assert.equal(profileText()[0],'Metagross');
state.active=true;assert.equal(title(),'Mega-Metagross · Lv.46');assert.deepEqual(profileText(),['Mega-Metagross']);
state.nick='Metagross';assert.equal(title(),'Mega-Metagross · Lv.46');assert.deepEqual(profileText(),['Mega-Metagross','(Metagross)']);
state.nick='Atlas';assert.equal(title(),'Mega-Metagross · Lv.46');assert.deepEqual(profileText(),['Mega-Metagross','(Atlas)']);assert.equal(state.nick,'Atlas');
state.shiny=true;assert.equal(title(),'*Mega-Metagross · Lv.46');assert.equal(state.shiny,true);
state.active=false;assert.equal(title(),'*Atlas · Lv.46');assert.deepEqual(profileText(),['Atlas','(Metagross)']);assert.equal(state.nick,'Atlas');
state={active:true,nick:'',species:'Glurak',mega:'Mega-Glurak X',level:57,shiny:false};assert.equal(title(),'Mega-Glurak X · Lv.57');assert.equal(profileText()[0],'Mega-Glurak X');
state.active=false;assert.equal(title(),'Glurak · Lv.57');assert.equal(profileText()[0],'Glurak');
state={active:false,nick:'',species:'Ei',mega:'Mega-Metagross',level:0,shiny:false};assert.equal(title(),'Ei · Lv.0');
assert(main.includes('form=window.TPMega?.active()?window.TPMega.form():0'));assert(card.includes('spriteScale(currentSprite, a)'));
console.log('E2 display names passed: active form in header/profile, nickname kept as subtitle, exact rollback on expiry, shiny/level preserved, both forms, no game-state writes.');
