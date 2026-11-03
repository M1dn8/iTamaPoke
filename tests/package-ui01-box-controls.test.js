
'use strict';
const assert=require('node:assert/strict');
const M=require('../browser_ver/web/collection-model.js');
const B=require('../browser_ver/web/collection-boxes.js');
class E{
 constructor(tag){
  this.tagName=tag;this.children=[];this.events={};this.style={};
  this.className='';this.textContent='';this.hidden=false;this.disabled=false;
 }
 append(...nodes){this.children.push(...nodes);for(const n of nodes)n.parent=this;}
 appendChild(n){this.append(n);return n;}
 replaceChildren(){this.children=[];}
 setAttribute(k,v){this[k]=v;}
 addEventListener(k,fn){this.events[k]=fn;}
 focus(){}
 querySelectorAll(){return flat(this).filter(n=>n.tagName==='button');}
 async click(){
  if(this.disabled)return;
  this.events.click?.();
  await new Promise(resolve=>setImmediate(resolve));
 }
}
const flat=n=>[n,...n.children.flatMap(flat)];
function find(root,label){
 const matches=flat(root).filter(n=>n.tagName==='button'&&n.textContent===label);
 assert.equal(matches.length,1,label);return matches[0];
}
const snap=origin=>({
 dex:25,level:17,nickname:'',shiny:false,origin,
 data:{bond:24,careMistakes:3,stats:{atk:42,def:31,spe:60},genes:null}
});
(async()=>{
 let state=M.attachCurrent(M.create(),snap('existing'));
 state=M.catchWild(state,snap('wild'));
 const care=state.active,stored=state.nextId-1;
 const session=M.session(state,async()=>true);
 const controller={read:()=>session.get(),apply:(...a)=>session.apply(...a),
  get busy(){return session.busy;},blocked:false};
 const host=new E('host');
 const ui=B.create({
  model:M,getController:()=>controller,getHost:()=>host,
  document:{createElement:t=>new E(t)},nameForDex:id=>'Species '+id,
  getEvolutionRules:()=>[{to:26,baseLevel:16,bond:30,time:1}],
  schedule:()=>0,cancel(){},repeat:()=>0,stop(){}
 });
 assert(ui.open());
 const root=host.children[0];
 const tools=flat(root).find(n=>n.className==='tp-box-toolbar');
 assert.equal(tools.children.length,3);
 assert.deepEqual(tools.children.map(n=>n.textContent),['Boxen','Teamplanung 1 / 6','Info']);
 assert(!flat(root).some(n=>['Boxauswahl','Box umbenennen'].includes(n.textContent)));
 await flat(root).find(n=>n['data-mon-id']===String(stored)).click();
 await find(root,'Verwalten').click();
 assert(find(root,'Freilassen'));
 await find(root,'Details').click();
 const subject=flat(root).find(n=>n.className.includes('tp-box-evolution-subject'));
 assert(subject,'Detailkarte vorhanden');
 assert.equal(subject.children.at(-1).className,'tp-box-battle-stats');
 assert(!flat(root).some(n=>n.tagName==='details'||n.className==='tp-evo-penalty'));
 assert.equal(flat(root).filter(n=>n.className==='tp-evo-check').length,5);
 const add=find(root,'Ins Team');
 const back=find(root,'Zurück zur Verwaltung');
 assert(add.parent.className.includes('tp-box-detail-actions'));assert(add.parent.parent.className.includes('tp-box-column-left'));
 assert(back.parent.className.includes('tp-box-detail-actions'));assert(back.parent.parent.className.includes('tp-box-column-left'));
 const before=session.get();
 await add.click();
 assert.deepEqual(session.get().team,[care,stored]);
 assert.equal(session.get().active,care);
 assert.deepEqual(session.get().mons,before.mons);
 assert.deepEqual(session.get().boxes,before.boxes);
 assert(find(root,'Ins Team').disabled);
 const saved=M.encode(session.get());
 await find(root,'Zurück zur Verwaltung').click();
 assert.equal(root['data-box-view'],'manage');
 assert.equal(M.encode(session.get()),saved);
 ui.close();
 console.log('UI01 box controls passed: three tools, no metadata below bars, conditions-only right display, left-display add/back actions, actual team addition, unchanged care/individuals/locations, duplicate-add guard and non-mutating back navigation.');
})().catch(error=>{console.error(error);process.exit(1);});
