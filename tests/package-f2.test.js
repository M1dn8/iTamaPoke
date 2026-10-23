const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const battle=fs.readFileSync('browser_ver/web/battle.js','utf8');
const calls=[],events={},labels=[];let running=false,next=false,team=-1;
const c={console,Math,Object,Date,screen:'card',cardPage:4,choice:'none',dragStart:null,dragNow:null,tpSaveReplacing:false,document:{visibilityState:'visible',addEventListener:(k,f)=>events[k]=f},addEventListener:(k,f)=>events[k]=f,TP:{cx:233},UI:{ink:'#111',bgDay:'#fff',barBad:'#f00',barOK:'#0f0',track:'#888'},ctx:new Proxy({fillText:t=>labels.push(t)},{get:(t,k)=>t[k]||(()=>{}),set(t,k,v){t[k]=v;return true;}}),roundRect(){},drawGameScene:()=>({ink:'#111'}),statusEl:{},TPTraining:{busy:false},fns:{battleResolved:()=>0,battleAttackMenuOpen:()=>0},Module:{ccall(name,type,types,args){calls.push([name,...args]);if(name==='tp_f2_can')return !running;if(name==='tp_f2_start'){if(running)return 0;running=true;team=args[0];return 1;}if(name==='tp_f2_get')return [running,team===1?2:1,0,next,team][args[0]]||0;if(name==='tp_f2_next'){assert(next);next=false;return 1;}if(name==='tp_battle_is_open')return running;throw Error(name);},_tp_battle_close(){calls.push(['close']);running=false;next=false;}}};c.window=c;vm.createContext(c);vm.runInContext(battle,c);
assert(c.TPTrainer.canOpen());assert(c.TPTrainer.open());assert.equal(c.screen,'trainer');c.TPTrainer.draw();assert(labels.includes('Teamduell · 2 Gegner'));
c.TPTrainer.tap(233,260);assert(running&&team===1&&c.screen==='battle');assert(!c.TPTrainer.start(0));next=true;c.battleTap(233,390);assert(!next&&calls.some(x=>x[0]==='tp_f2_next'));
c.document.visibilityState='hidden';events.visibilitychange();assert(!running&&c.screen==='card'&&c.cardPage===4);
c.document.visibilityState='visible';assert(c.TPTrainer.open());c.TPTrainer.tap(233,190);assert(running&&team===0);events.pagehide();assert(!running&&c.screen==='card');
c.tpSaveReplacing=true;assert(!c.TPTrainer.open());c.tpSaveReplacing=false;c.TPTraining.busy=true;assert(!c.TPTrainer.open());c.TPTraining.busy=false;
c.screen='trainer';c.document.visibilityState='hidden';assert(!c.TPTrainer.start(1));c.document.visibilityState='visible';c.TPTrainer.tap(233,390);assert.equal(c.screen,'card');
// Exercise the actual F1 controller/drawing with a rectangular frame.
const training=fs.readFileSync('browser_ver/web/battle-training.js','utf8');
const f1=fs.readFileSync('tests/package-f1.test.js','utf8');
const createEnv=new Function('assert','vm','source',f1.slice(f1.indexOf('function env('),f1.indexOf('(async()=>{'))+';return env;')(assert,vm,training);
for(const dims of [[55,90],[160,40],[32,32]]){
 const e=createEnv();assert(e.api.start(1));const ellipses=[],images=[],dots=[];
 e.ctx.currentSprite={actions:{0:{w:dims[0],h:dims[1],base:dims[1]}}};e.ctx.TPAct={idle:0};e.ctx.spriteHas=()=>true;e.ctx.frameIndexAt=()=>0;e.ctx.frameImageData=()=>({});e.ctx.spriteScale=()=>2;e.ctx.frameCanvas={};e.ctx.frameCtx={putImageData(){}};
 e.ctx.ctx.ellipse=(...a)=>ellipses.push(a);e.ctx.ctx.drawImage=(...a)=>images.push(a);e.ctx.ctx.arc=(...a)=>dots.push(a);
 e.api.draw(1500);assert.equal(ellipses.length,1);assert.equal(images.length,1);assert.equal(dots.length,12);
 const [cx,cy,rx,ry]=ellipses[0],[,x,y,w,h]=images[0];
 for(const px of [x,x+w])for(const py of [y,y+h])assert(((px-cx)/rx)**2+((py-cy)/ry)**2<1,'shield must enclose all actor corners');
 assert(cy-ry>90&&cy+ry<300,'shell must clear heading and counter');
 for(const [x,y] of dots)assert(((x-cx)/rx)**2+((y-cy)/ry)**2>1,'incoming point must stay outside shell');
 assert.equal(e.api.snapshot.hits,0,'visual attacks must not count as taps');
}
assert(fs.readFileSync('browser_ver/web/main.js','utf8').includes('screen === "trainer"'));
assert(fs.readFileSync('browser_ver/web/app-menu.js','utf8').includes('"battle","trainer","keyboard"'));
console.log('F2 UI passed: trainer menu/start/back, native next forwarding, background/pagehide abort, busy guards, rectangular sprite enclosure, 12 visual-only incoming points outside shell, menu ownership.');
