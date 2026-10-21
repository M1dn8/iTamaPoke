const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../browser_ver/web/storage-tools.js');
assert.equal(T.canonicalSprite('P006-MEGA-X.BIN').key,'p006-mega-x.bin');assert.equal(T.canonicalSprite('ps006-mega-x.bin').form,'mega-x');assert.equal(T.canonicalSprite('p006-mega-y.bin'),null);assert.equal(T.canonicalSprite('p1026.bin'),null);
let data={dex:6,form:1,name:"Mega-Glurak X",baseName:"Glurak",supported:1,stone:0,quest:1,training:3,active:0,now:1700000000,cool:0,shiny:0,base:[100,100,100]},undo=null,asset=null,fail=false,calls=[];
const c={TPStoreTools:T,console,Date,JSON,Object,Math,Promise,Uint8Array,setTimeout,screen:'card',cardPage:8,choice:'none',tpSaveReplacing:false,tpSaveEpoch:0,
 fns:{sleeping:()=>0,ceremony:()=>0,evolvingNow:()=>0,wildPromptActive:()=>0},TPDiagnostics:{record(){}},
 loadMegaSprite:async()=>asset,exportStateBytes:()=>new Uint8Array([1]),writeSave:async(bytes,force)=>{assert.equal(force,true);calls.push('write');if(fail)throw Error('synthetic');},
 Module:{ccall(name,type,types,args){if(name==='tp_e_view')return JSON.stringify(data);if(name==='tp_e_shiny')return data.shiny;if(name==='tp_e_apply'){calls.push('apply');undo={...data};if(args[0]===0)data.stone=1;else data.active=1;return 1;}if(name==='tp_e_finish'){calls.push('finish:'+args[0]);if(!args[0])data=undo;return 1;}return 0;}}};
c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('browser_ver/web/mega.js','utf8'),c);
(async()=>{
 assert(c.TPMega.visible());fail=true;assert.equal(await c.TPMega.act(0),false);assert.equal(data.stone,0);assert.deepEqual(calls,['apply','write','finish:0']);assert.equal(c.tpSaveReplacing,false);
 fail=false;calls=[];assert(await c.TPMega.act(0));assert.equal(data.stone,1);assert.deepEqual(calls,['apply','write','finish:1']);calls=[];assert.equal(await c.TPMega.act(1),false);assert.equal(data.active,0);assert.deepEqual(calls,[]);
 asset={};assert(await c.TPMega.act(1));assert.equal(data.active,1);assert.deepEqual(calls,['apply','write','finish:1']);assert.equal(c.tpSaveReplacing,false);
 const card=fs.readFileSync('browser_ver/web/card.js','utf8');assert(card.includes('const CARD_PAGE_COUNT = 8;'));assert(card.includes('function cardPageCount()'));assert(card.includes('case 8: window.TPMega.draw()'));for(const n of ['case 3: drawCardBox','case 7: drawCardExpedition'])assert(card.includes(n));
 for(const file of ['.github/workflows/build-browser.yml','.github/workflows/quality-gate.yml'])assert(fs.readFileSync(file,'utf8').includes('(-mega(-[a-z]+)?)?'));
 assert(fs.readFileSync('browser_ver/web/sw.js','utf8').includes('./mega.js'));assert(fs.readFileSync('browser_ver/build.sh','utf8').includes('browser_mega.cpp'));
 console.log('E JS passed: explicit local Mega names, rollback/commit order, missing-art activation refusal, preserved card indices and publishing guard.');
})().catch(e=>{console.error(e);process.exit(1);});
