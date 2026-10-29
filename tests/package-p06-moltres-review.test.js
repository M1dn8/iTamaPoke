'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const portrait=fs.readFileSync('browser_ver/web/zapdos-portrait.js','utf8');
const scale=portrait.match(/const scale=([^;]+);/);
assert(scale,'Shared portrait scale expression missing.');
for(const dex of [144,145,146]){
 const width=40,height=40;
 const actual=vm.runInNewContext(scale[1],{dex,width,height,Math});
 const expected=Math.min(6,352/width,164/height)*(dex===145?1:.8);
 assert.equal(actual,expected);
}
const finale=fs.readFileSync('browser_ver/web/zapdos-finale.js','utf8');
assert(finale.includes('root.TPZapdosPortrait.create(text,options)'));

const styles=[];
class E{
 constructor(){this.dataset={};this.attributes={};}
 setAttribute(k,v){this.attributes[k]=String(v);}
}
const context={
 document:{
  createElement:()=>new E(),
  head:{appendChild:node=>styles.push(node)}
 }
};
vm.createContext(context);
vm.runInContext(
 fs.readFileSync('browser_ver/web/victory-road-scene.js','utf8'),context
);
for(const kind of ['outside','blocked']){
 const scene=context.TPVictoryRoadScene.create(kind,'Review scene');
 assert.equal(scene.dataset.state,kind);
 assert.equal(scene.attributes['aria-label'],'Review scene');
 assert(scene.innerHTML.includes('data-feather="between-rocks"'));
 for(const name of ['left','right','rear'])
  assert(scene.innerHTML.includes('data-rock="'+name+'"'));
 assert(scene.innerHTML.includes('translate(190 141) rotate(-23)'));
 assert(scene.innerHTML.includes('feGaussianBlur'));
}
const inner=context.TPVictoryRoadScene.create('inner','Inner chamber');
assert(!inner.innerHTML.includes('data-feather="between-rocks"'));
assert(!inner.innerHTML.includes('data-rock="left"'));
const css=styles[0].textContent;
assert(css.includes('@keyframes tp-victory-feather-shimmer'));
assert(css.includes('prefers-reduced-motion:reduce'));
assert(css.includes('container-type:size'));
assert(css.includes('flex-direction:column'));
assert(!css.includes('grid-template-columns:minmax(0,228px) minmax(0,1fr)'));
const game=fs.readFileSync('browser_ver/web/victory-road-game.js','utf8');
assert(game.includes("aria-describedby','tp-victory-instructions'"));
assert(game.includes('Bewege alle drei Felsen'));
assert(game.indexOf('field,feedback,controls')>=0);
console.log(
 'Lavados review correction checks passed: shared reduced portrait/finale '+
 'scale, both preparation scenes, feather/rock anchors, glow, reduced-motion '+
 'fallback, centered-layout rules and retained accessible instructions. '+
 'Source/DOM-double checks only; real appearance and touch sizing require review.'
);
