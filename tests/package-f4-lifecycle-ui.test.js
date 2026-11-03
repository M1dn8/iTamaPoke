
const assert=require('node:assert/strict');
const M=require('../browser_ver/web/collection-model.js');
const L=require('../browser_ver/web/collection-lifecycle.js');
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.events={};this.style={};this.disabled=false;}
 append(...nodes){this.children.push(...nodes);for(const n of nodes)n.parent=this;}
 setAttribute(){}
 addEventListener(key,fn){this.events[key]=fn;}
 focus(){global.focused=this;}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 async click(){if(!this.disabled)return this.events.click?.();}
}
function flatten(node){return [node,...node.children.flatMap(flatten)];}
function find(root,label){
 const matches=flatten(root).filter(n=>n.tag==='button'&&n.textContent===label);
 assert.equal(matches.length,1,'Unique action: '+label);return matches[0];
}
(async()=>{
 const host=new Element('host');
 const oldDoc=global.document,oldConfirm=global.confirm,oldMenu=global.TPAppMenu;
 global.document={getElementById:()=>host,createElement:tag=>new Element(tag)};
 let idleReturns=0,systemConfirms=0;
 global.TPAppMenu={close(){idleReturns++;},show(){throw Error('Back must not open the Pokedex hub');}};
 global.confirm=()=>{systemConfirms++;throw Error('System confirmation must not be used');};
 let state=M.attachCurrent(M.create(),{
  dex:376,level:100,nickname:'Atlas',shiny:true,origin:'existing',
  data:{lifeToken:1,genes:{atk:100,def:100,spe:100}}
 });
 const ends=[];
 const native={
  valid:true,initialized:true,token:1,profileDex:376,ceremony:0,
  snapshot:{dex:376,level:100,nickname:'Atlas',shiny:true,
   data:{genes:{atk:100,def:100,spe:100}}}
 };
 const mod={
  _tp_f4_life_state(){},_tp_f4_life_ensure(){},_tp_f4_life_end(){},
  ccall(name){
   if(name==='tp_f4_life_state')return JSON.stringify(native);
   throw Error(name);
  },onSfx(){}
 };
 const ctrl={
  busy:false,read:()=>state,
  async act(operation,...args){
   if(operation==='careSync')return state;
   ends.push(args);native.ceremony=3;
   state=M.endCare(state,state.active,args[1]?'keep':'release',{confirmed:true});
   return state;
  }
 };
 const life=L.create(mod,M,{nameForDex:()=> 'Metagross'});life.bind(ctrl);
 try{
  const opens=await Promise.all([life.openEnd('release'),life.openEnd('release')]);
  assert.equal(opens.filter(Boolean).length,1);
  assert.equal(host.children.length,1);
  let root=host.children[0];
  assert.equal(global.focused.textContent,'Zurück');
  assert(flatten(root).some(n=>n.textContent==='Atlas ✦'));
  assert(!flatten(root).some(n=>n.textContent==='Abbrechen'));
  assert(flatten(root).some(n=>n.textContent==='Freilassen ist endgültig!'));
  const before=state;
  await find(root,'Ja').click();
  assert.equal(ends.length,0,'Hidden Yes must not perform an unconfirmed release');
  await find(root,'Freilassen').click();
  assert.equal(global.focused.textContent,'Nein');
  assert(flatten(root).some(n=>n.tag==='h2'&&n.textContent==='Sicher?'));
  assert.equal(state,before);
  await find(root,'Nein').click();
  assert.equal(state,before);assert.equal(ends.length,0);
  await find(root,'Zurück').click();
  assert(!life.dialogOpen);assert.equal(idleReturns,1);
  assert.equal(state,before);
  assert(await life.openEnd('release'));
  root=host.children[0];
  await find(root,'In Box verschieben').click();
  assert.equal(ends.length,1);assert.equal(ends[0][1],true);
  assert.equal(state.active,null);assert(!life.dialogOpen);assert.equal(state.mons.length,1);
  native.ceremony=0;
  state=M.attachCurrent(state,{
   dex:1,level:1,nickname:'',shiny:false,origin:'raised',
   data:{lifeToken:1,genes:{atk:100,def:100,spe:100}}
  });
  native.snapshot={dex:1,level:1,nickname:'',shiny:false,
   data:{genes:{atk:100,def:100,spe:100}}};
  const releasedID=state.active;
  assert(await life.openEnd('release'));root=host.children[0];
  await find(root,'Freilassen').click();await find(root,'Ja').click();
  assert.equal(ends.length,2);
  assert.equal(ends[1][1],false);
  assert.equal(ends[1][3],true,'Permanent removal must carry explicit confirmation');
  assert.equal(state.active,null);
  assert(!state.mons.some(mon=>mon.id===releasedID));
  assert(!life.dialogOpen);
  native.ceremony=0;
  state=M.attachCurrent(state,{
   dex:1,level:1,nickname:'',shiny:false,origin:'raised',
   data:{lifeToken:1,genes:{atk:100,def:100,spe:100}}
  });
  while(M.summary(state).stored<M.summary(state).capacity)state=M.catchWild(state,{
   dex:25,level:1,nickname:'',shiny:false,origin:'wild',
   data:{genes:null,training:null}
  });
  assert.equal(M.summary(state).stored,240);
  assert(await life.openEnd('release'));root=host.children[0];
  assert(find(root,'In Box verschieben').disabled);
  await find(root,'Zurück').click();
  assert(!life.dialogOpen);
  assert.equal(systemConfirms,0);
  console.log('F4 lifecycle UI passed: internal final question, initial No focus, no premature release, No/back cancellation, keep once, explicitly confirmed removal, full-box guard and no system dialog. DOM/model simulation, not browser acceptance.');
 }finally{
  global.document=oldDoc;global.confirm=oldConfirm;global.TPAppMenu=oldMenu;
 }
})().catch(error=>{console.error(error);process.exit(1);});
