'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
class E{
 constructor(tag){
  this.tagName=tag;this.children=[];this.dataset={};this.style={};
  this.attributes={};this.textContent='';this.isConnected=true;
 }
 append(...nodes){this.children.push(...nodes);}
 appendChild(node){this.append(node);return node;}
 replaceChildren(...nodes){this.children=[...nodes];}
 setAttribute(k,v){this.attributes[k]=String(v);}
 addEventListener(){}
 closest(){return {hidden:false};}
}
const locales={};
const states={
 zapdos:{unlocked:true,newlyUnlocked:true,phase:'investigate',badges:8},
 articuno:{unlocked:true,newlyUnlocked:false,phase:'secure',badges:8},
 moltres:{unlocked:true,newlyUnlocked:false,phase:'waiting',badges:8},
 mewtwo:{unlocked:true,newlyUnlocked:false,phase:'complete',badges:8},
 mew:{unlocked:true,newlyUnlocked:true,phase:'investigate',badges:8}
};
const service=id=>({noticeSupported:true,access:()=>states[id]});
const context={
 document:{
  createElement:tag=>new E(tag),
  head:{appendChild(){}},
  querySelector:()=>null
 },
 TPText:{
  registerLocale(code,entries){
   locales[code]={...(locales[code]||{}),...entries};
  },
  t(key,params={}){
   assert.equal(typeof locales.de[key],'string','Missing key: '+key);
   return locales.de[key].replace(/\{(\w+)\}/g,(_,k)=>String(params[k]));
  }
 },
 TPZapdos:service('zapdos'),TPArktos:service('articuno'),
 TPLavados:service('moltres'),TPMewtu:service('mewtwo'),TPMew:service('mew'),
 tpSaveReplacing:false,setInterval:()=>0
};
vm.createContext(context);
for(const file of [
 'articuno-story-text.js','moltres-story-text.js',
 'mewtwo-story-text.js','mew-story-text.js','stories-ui.js'
])vm.runInContext(fs.readFileSync('browser_ver/web/'+file,'utf8'),context);

const text=node=>node.textContent+node.children.map(text).join('');
const host=new E('host');
context.TPStoriesUI.mount(host);
const tiles=new Map(host.children.filter(n=>n.dataset.story)
 .map(n=>[n.dataset.story,n]));
for(const [id,expected] of [
 ['zapdos','Kraftwerk · Neu'],
 ['articuno','Eishöhle · Offen'],
 ['moltres','Siegesstraße · Offen'],
 ['mewtwo','Azuria-Höhle · Abgeschlossen'],
 ['mew','Nuggetbrücke · Neu']
]){
 assert.equal(text(tiles.get(id)),expected);
 assert(!/Zapdos|Arktos|Lavados|Mewtu|Articuno|Moltres|Mewtwo|Mew/.test(text(tiles.get(id))));
}
assert.equal(tiles.get('mewtwo').disabled,true);

states.moltres={unlocked:false,newlyUnlocked:false,phase:'investigate',badges:7};
context.TPStoriesUI.mount(host);
const locked=host.children.find(n=>n.dataset.story==='moltres');
assert.equal(locked,undefined);
assert(!text(host).includes('Siegesstraße'));
assert(!text(host).includes('Lavados'));


// Progressive discovery: hidden stories must not leak into the catalogue.
{
 const ids=['zapdos','articuno','moltres','mewtwo','mew'];
 const saved=Object.fromEntries(ids.map(id=>[id,{...states[id]}]));
 const hub=new E('button');
 hub.removeAttribute=function(key){delete this.attributes[key];};
 hub.querySelector=function(selector){
  return this.children.find(child=>
   selector==='.tp-hub-count'&&child.className==='tp-hub-count'
  )||null;
 };
 hub.appendChild=function(child){
  this.children.push(child);
  child.remove=()=>{
   this.children=this.children.filter(candidate=>candidate!==child);
  };
  return child;
 };
 const originalQuery=context.document.querySelector;
 context.document.querySelector=selector=>
  selector.includes('data-hub="stories"')?hub:null;

 const catalogue=new E('host');
 const hint=new E('host');
 const shown=()=>catalogue.children
  .filter(child=>child.dataset.story)
  .map(child=>child.dataset.story).sort();
 const badge=()=>hub.querySelector('.tp-hub-count');
 const reset=()=>{
  for(const id of ids)states[id]={
   unlocked:false,newlyUnlocked:false,
   phase:'investigate',badges:0
  };
 };

 reset();
 context.TPStoriesUI.mount(catalogue);
 assert.deepEqual(shown(),[]);
 assert.equal(text(catalogue),
  'Hier ist noch nichts zu entdecken. Komm später wieder!');
 assert.equal(catalogue.children[0].className,'tp-stories-empty');
 assert.equal(catalogue.children[0].attributes.role,'status');
 assert.equal(badge(),null);
 assert.equal(hub.attributes['aria-description'],undefined);

 // Every newly eligible story appears, without revealing later locations.
 for(let index=0;index<ids.length;index++){
  const id=ids[index];
  states[id]={...states[id],unlocked:true,newlyUnlocked:true};
  context.TPStoriesUI.mount(catalogue);
  assert.deepEqual(shown(),ids.slice(0,index+1).sort());
  assert(!catalogue.children.some(child=>
   child.className==='tp-stories-empty'
  ));
  assert.equal(badge().textContent,String(index+1));
  assert.equal(
   catalogue.children.filter(child=>child.dataset.story)
    .flatMap(child=>child.children)
    .filter(child=>child.className==='tp-unread-dot tp-story-open-dot')
    .length,
   index+1
  );
 }

 // Completed stories remain visible, disabled and without open-story dots.
 // Completion remains visible even if access() reports unlocked=false.
 states.zapdos={
  ...states.zapdos,unlocked:false,newlyUnlocked:false,phase:'complete'
 };
 context.TPStoriesUI.mount(catalogue);
 const completed=catalogue.children.find(child=>
  child.dataset.story==='zapdos'
 );
 assert(completed);
 assert.equal(completed.disabled,true);
 assert.equal(completed.dataset.complete,'true');
 assert.equal(text(completed),'Kraftwerk · Abgeschlossen');
 assert(!completed.children.some(child=>
  child.className==='tp-unread-dot tp-story-open-dot'
 ));
 assert.equal(badge().textContent,'4');

 // A different save/state must clear old tiles and the hub counter.
 reset();
 context.TPStoriesUI.mount(catalogue);
 assert.deepEqual(shown(),[]);
 assert.equal(badge(),null);
 assert.equal(hub.attributes['aria-description'],undefined);

 // Ineligible or completed entries must not produce a new-story notice.
 states.mew.newlyUnlocked=true;
 context.TPStoriesUI.mountHint(hint);
 assert.equal(hint.children.length,0);
 assert.equal(badge(),null);

 states.zapdos={...states.zapdos,unlocked:true,newlyUnlocked:true};
 context.TPStoriesUI.mountHint(hint);
 assert.equal(hint.children.length,1);
 assert.equal(badge().textContent,'1');

 states.zapdos.phase='complete';
 context.TPStoriesUI.mountHint(hint);
 assert.equal(hint.children.length,0);
 assert.equal(badge(),null);

 // Empty state is translated in every supported locale.
 reset();
 const originalTranslate=context.TPText.t;
 for(const code of ['en','de','es','fr']){
  context.TPText.t=(key,params={})=>{
   assert.equal(typeof locales[code][key],'string','Missing key: '+key);
   return locales[code][key].replace(/\{(\w+)\}/g,(_,k)=>String(params[k]));
  };
  context.TPStoriesUI.mount(catalogue);
  assert.equal(text(catalogue),locales[code]['stories.empty']);
  assert.equal(catalogue.children[0].className,'tp-stories-empty');
 }
 context.TPText.t=originalTranslate;

 // Missing core support is an error state, not an empty valid catalogue.
 const services=[
  context.TPZapdos,context.TPArktos,context.TPLavados,
  context.TPMewtu,context.TPMew
 ];
 for(const entry of services)entry.noticeSupported=false;
 context.TPStoriesUI.mount(catalogue);
 assert.equal(text(catalogue),locales.de['stories.unavailable']);
 assert(!catalogue.children.some(child=>
  child.className==='tp-stories-empty'
 ));
 for(const entry of services)entry.noticeSupported=true;

 // Read failures must remain distinguishable from no unlocked stories.
 const originalAccess=context.TPZapdos.access;
 context.TPZapdos.access=()=>{throw Error('Unreadable fixture');};
 context.TPStoriesUI.mount(catalogue);
 assert.equal(text(catalogue),locales.de['stories.invalid']);
 context.TPZapdos.access=originalAccess;

 context.document.querySelector=originalQuery;
 for(const id of ids)states[id]=saved[id];
}

for(const [prefix,names] of [
 ['articuno',['Arktos','Articuno','Artikodin']],
 ['moltres',['Lavados','Moltres','Sulfura']],
 ['mewtwo',['Mewtu','Mewtwo']],
 ['mew',['Mew']]
])for(const code of ['en','de','es','fr']){
 const place=locales[code][prefix+'.place'];
 assert.equal(typeof place,'string');
 assert(!names.some(name=>place.includes(name)));
}
console.log(
 'Story catalogue passed: location-only labels in four locales, '+
 'new/open/completed states, waiting admission shown as open, '+
 'locked stories absent, completed stories retained and disabled, '+
 'progressive discovery, empty states, counters and notices verified. '+
 'Actual catalogue renderer with DOM doubles; no visual acceptance claim.'
);
