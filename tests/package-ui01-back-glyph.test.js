
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class Element{
 constructor(tag){
  this.tagName=tag;this.children=[];this.attributes={};this.value='';
  this.disabled=false;
 }
 get textContent(){return this.value+this.children.map(n=>n.textContent).join('');}
 set textContent(v){this.replaceChildren();this.value=String(v);}
 replaceChildren(...nodes){
  for(const n of this.children)n.parentNode=null;
  this.children=nodes;this.value='';
  for(const n of nodes)n.parentNode=this;
 }
 setAttribute(k,v){this.attributes[k]=String(v);}
 getAttribute(k){return this.attributes[k]??null;}
}
const events={},c={WeakMap,Object,String,console,
 TPText:{t:()=> 'Zurück'},document:{readyState:'loading',
  createElement:tag=>new Element(tag),
  addEventListener:(name,fn)=>events[name]=fn}};
c.globalThis=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/icons.js','utf8'),c);
const api=c.TPNavBack;assert(api);
for(const name of ['Zurück','Zurück zur Übersicht','Zurueck','Back',
 'Back to Pokémon','Retour','Atrás'])assert(api.isBackLabel(name),name);
for(const name of ['Abbrechen','Beenden','Später','Zuruecksetzen',
 'Backups','Vormerkung zuruecknehmen'])assert(!api.isBackLabel(name),name);

// Spanish menu.home differs from the short common.back label.
const originalTranslation=c.TPText.t;
const spanish={
 'common.back':'Atrás',
 'menu.home':'Volver al Pokémon'
};
c.TPText.t=key=>spanish[key]||key;
assert(api.isBackLabel('Volver al Pokémon'));
assert(api.isBackLabel('Atrás'));
assert(!api.isBackLabel('Volver a intentarlo'));
assert(!api.isBackLabel('Cancelar'));
const homeButton=new Element('button');
homeButton.textContent='Volver al Pokémon';
const homeHandler=()=>73;
homeButton.onclick=homeHandler;
api.decorate(homeButton,spanish['menu.home']);
assert.equal(homeButton.getAttribute('data-tp-nav-back'),'true');
assert.equal(homeButton.getAttribute('aria-label'),'Volver al Pokémon');
assert.equal(homeButton.textContent,'Volver al Pokémon');
assert.equal(homeButton.onclick,homeHandler);
assert.equal(homeButton.children.length,2);
c.TPText.t=originalTranslation;

const b=new Element('button');b.textContent='Zurück';b.disabled=true;
const click=()=>42;b.onclick=click;
api.decorate(b,'Zurück');
assert.equal(b.textContent,'Zurück');
assert.equal(b.getAttribute('aria-label'),'Zurück');
assert.equal(b.children.length,2);
assert.equal(b.disabled,true);assert.equal(b.onclick,click);
const icon=b.children[0];api.decorate(b,'Zurück');
assert.equal(b.children[0],icon);
b.textContent='Back';api.decorate(b,'Back');
assert.equal(b.textContent,'Back');assert.equal(b.children.length,2);
assert.equal(b.getAttribute('aria-label'),'Back');
const cancel=new Element('button');cancel.textContent='Abbrechen';
api.decorate(cancel,'Abbrechen');assert.equal(cancel.children.length,0);
const commands=[];
const p=new Proxy({},{
 get:(_,key)=>(...args)=>commands.push([key,...args]),set:()=>true
});
api.draw(p,10,20,24);
assert(commands.some(x=>x[0]==='moveTo'&&x[1]===4&&x[2]===8));
assert(commands.some(x=>x[0]==='lineTo'&&x[1]===12&&x[2]===8));
assert.equal(commands.filter(x=>x[0]==='bezierCurveTo').length,2);
assert.equal(commands.at(-1)[0],'restore');
console.log('Shared back passed: curved glyph, idempotence, translated names, preserved handler and disabled state, no cancel conversion.');
