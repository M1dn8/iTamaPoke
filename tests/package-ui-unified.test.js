const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('browser_ver/web/ui-scale.js','utf8'),css=fs.readFileSync('browser_ver/web/app-theme.css','utf8');let width=466;const tokens={},canvas={getBoundingClientRect:()=>({width})},shell={style:{setProperty:(n,v)=>tokens[n]=v}};
const c={window:null,Number,Math,Object,document:{getElementById:id=>id==='tp'?canvas:id==='tp-game-shell'?shell:null},ResizeObserver:class{observe(){}},addEventListener(){}};c.window=c;vm.createContext(c);vm.runInContext(src,c);
for(width of [304,374,466]){c.TPUIScale.sync();assert.equal(c.TPUIScale.scale,width/466);assert(Math.abs(parseFloat(tokens['--tp-canvas-title'])-20*width/466)<1e-9);assert(Math.abs(parseFloat(tokens['--tp-canvas-stroke'])-2*width/466)<1e-9);}
// UI01 bundled closeout test alignment.
const activationWaves=css.match(
 /@keyframes\s+tp-mega-activation-wave\s*\{\s*0%\s*\{[^{}]*\}\s*100%\s*\{[^{}]*\}\s*\}/g
)||[];
assert.equal(activationWaves.length,1,'Exactly one local Mega activation animation');
assert(/0%\s*\{opacity:\.8;transform:scale\(\.85\)\}/.test(activationWaves[0]));
assert(/100%\s*\{opacity:0;transform:scale\(1\.2\)\}/.test(activationWaves[0]));
const layoutCss=css.replace(activationWaves[0],'');
assert(!/transform\s*:[^;{}]*\bscale(?:X|Y|3d)?\s*\(/i.test(layoutCss),
 'Scaling outside the explicitly approved local activation animation is forbidden');assert(!css.includes('width:466px!important'));assert(!css.includes('height:466px!important'));for(const s of ['var(--tp-canvas-title)','var(--tp-canvas-control)','min-height:44px!important','.tp-f4-care-dialog'])assert(css.includes(s),s);
for(const n of ['arena','battle-training','battle','card','expedition','league-hall','league-kanto','mega','regional-reward-egg'])for(const l of fs.readFileSync('browser_ver/web/'+n+'.js','utf8').split('\n'))if(l.includes('ctx.font'))assert(!/sans-serif|system-ui/.test(l),n);
const card=fs.readFileSync('browser_ver/web/card.js','utf8');assert(card.includes('ctx.fillText(fns.backHint(), TP.cx, 400)'));assert(!card.includes('roundRect(70,398,326,36,8)'));
const a=card.indexOf('function cardTap('),b=card.indexOf('// --- Rename keyboard',a),q={window:{},screen:'card',cardPage:4,TP:{cx:233},cardStatsTap(){},cardPageCount:()=>8};vm.createContext(q);vm.runInContext(card.slice(a,b),q);q.cardTap(233,382);assert.equal(q.screen,'card');q.cardTap(233,406);assert.equal(q.screen,'idle');q.screen='card';q.cardTap(233,435);assert.equal(q.screen,'card');
assert(fs.readFileSync('browser_ver/web/sw.js','utf8').includes('"./ui-scale.js"'));assert(css.includes('--tp-page-radius:12px'));
assert(css.includes('border-radius:var(--tp-page-radius)!important'));
console.log('Canvas reference passed: native DOM layout, no global transforms, matching text/stroke tokens, original card footer/navigation, shared monospace and offline wiring.');
