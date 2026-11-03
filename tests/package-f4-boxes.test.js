const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../browser_ver/web/collection-model.js'),B=require('../browser_ver/web/collection-boxes.js');
let count=0;const eq=(a,b)=>{assert.deepEqual(a,b);count++;},ok=v=>{assert(v);count++;};
class Element{constructor(tag){this.tagName=tag;this.children=[];this.events={};this.style={};this.hidden=false;this.disabled=false;this.textContent='';this.value='';}append(...a){this.children.push(...a);for(const n of a)n.parent=this;}appendChild(n){this.append(n);return n;}replaceChildren(){this.children=[];}setAttribute(k,v){this[k]=v;}addEventListener(k,f){this.events[k]=f;}focus(){focused=this;}querySelectorAll(){return flatten(this).filter(x=>x.tagName==='button');}async click(){if(!this.disabled){const result=this.events.click?.();if(result?.then)await result;await new Promise(r=>setImmediate(r));}}}
function flatten(n){return [n,...n.children.flatMap(flatten)];}let focused=null;
function find(root,text){const matches=flatten(root).filter(x=>x.tagName==='button'&&x.textContent===text);assert.equal(matches.length,1,'unique button '+text);return matches[0];}
function includesText(root,text){return flatten(root).some(x=>String(x.textContent).includes(text));}
const mon=(origin='wild',dex=25,level=17)=>({dex,level,nickname:'',shiny:false,origin,data:{stats:{atk:42,def:31,spe:60},genes:null,training:null}});

async function manage(root){
 const b=flatten(root).find(n=>n.tagName==='button'&&n.textContent==='Verwalten');
 if(b)await b.click();
}
async function chooseBox(root,index){
 return (async()=>{
  for(let attempt=0;attempt<10;attempt++){
   if(Number(root['data-current-box'])===index)return;
   const next=flatten(root).find(n=>n.id==='tp-box-next-box');
   assert(next&&!next.disabled,'Next box control available');
   await next.click();
  }
  throw Error('Box choice not reached');
 })();
}
(async()=>{
 let s=M.attachCurrent(M.create(),{...mon('existing',376,100),nickname:'Atlas',data:{stats:{atk:190,def:190,spe:120},genes:{atk:100,def:100,spe:100},training:{atk:50,def:50,spe:50}}});for(let i=0;i<7;i++)s=M.catchWild(s,mon('wild',25,17+i));
 let rejectWrite=false,writes=0;const session=M.session(s,async raw=>{writes++;M.decode(raw);if(rejectWrite)throw Error('quota');});const controller={read:()=>session.get(),apply:(...a)=>session.apply(...a),get busy(){return session.busy;},blocked:false};
 const host=new Element('host');let closed=0,renamedActive=0,rafs=0,stops=0;const ui=B.create({model:M,getController:()=>controller,getHost:()=>host,nameForDex:d=>'Species '+d,onClose:()=>closed++,renameActive:()=>renamedActive++,document:{createElement:t=>new Element(t)},schedule:()=>++rafs,cancel:()=>stops++,repeat:()=>1,stop:()=>stops++});
 ok(ui.open());eq(host.children.length,1);let root=host.children[0];eq(flatten(root).filter(x=>x.className==='tp-box-tile').length,7);eq(flatten(root).filter(x=>x.className==='tp-box-empty').length,17);ok(includesText(root,'Teamänderungen wechseln nicht'));ok(includesText(root,'Atlas'));eq(flatten(root).find(n=>n.className==='tp-box-toolbar').children.length,3);
 await chooseBox(root,1);eq(ui.state.box,1);eq(flatten(root).filter(x=>x.className==='tp-box-empty').length,24);
 await chooseBox(root,0);eq(ui.state.box,0);
 let input;await controller.apply('renameBox',0,'Elektro');ui.refresh();eq(session.get().boxes[0].name,'Elektro');ok(!flatten(root).some(n=>n.textContent==='Box umbenennen'));
 let tile=flatten(root).find(x=>x.className==='tp-box-tile');await tile.click();eq(ui.state.selected,2);await manage(root);await find(root,'Details').click();eq(session.get().mons.find(m=>m.id===2).data.genes,null);eq(flatten(root).filter(n=>n['data-stat']).length,3);ok(includesText(root,'Exemplar #2'));ok(!flatten(root).some(n=>n.tagName==='summary'&&n.textContent==='Exemplardaten'));await find(root,'Zurück zur Verwaltung').click();
 await manage(root);await find(root,'Namen ändern').click();input=flatten(root).find(x=>x.tagName==='input');input.value='Blitz';input.events.input();await find(root,'Speichern').click();eq(session.get().mons.find(x=>x.id===2).nickname,'Blitz');
 await manage(root);await find(root,'In andere Box verschieben').click();let target=flatten(root).find(x=>x['data-target-box']==='3');ok(target&&!target.disabled);await target.click();await find(root,'Verschieben').click();eq(session.get().boxes[3].slots[0],2);eq(session.get().active,1);
 await manage(root);await find(root,'Ins Team').click();eq(session.get().team,[1,2]);
 await find(root,'Teamplanung 2 / 6').click();
 await flatten(root).find(x=>x['data-team-id']==='2').click();
 await manage(root);await find(root,'Aus Teamplanung nehmen').click();eq(session.get().team,[1]);
 await find(root,'Boxen').click();await chooseBox(root,3);
 await flatten(root).find(x=>x['data-mon-id']==='2').click();
 await manage(root);await find(root,'Freilassen').click();eq(focused.textContent,'Abbrechen');ok(includesText(root,'Nicht wiederherstellbar'));await find(root,'Abbrechen').click();ok(session.get().mons.some(x=>x.id===2));
 // Rejected durable write keeps the individual, location, team and draft.
 rejectWrite=true;await manage(root);await find(root,'Namen ändern').click();input=flatten(root).find(x=>x.tagName==='input');input.value='Nicht speichern';input.events.input();const before=session.get();await find(root,'Speichern').click();eq(session.get(),before);ok(includesText(root,'Speichern fehlgeschlagen'));await find(root,'Abbrechen').click();rejectWrite=false;
 await manage(root);await find(root,'Freilassen').click();rejectWrite=true;const releaseBefore=session.get();await find(root,'Dieses Exemplar endgueltig freilassen').click();eq(session.get(),releaseBefore);ok(session.get().mons.some(x=>x.id===2));rejectWrite=false;await find(root,'Dieses Exemplar endgueltig freilassen').click();ok(!session.get().mons.some(x=>x.id===2));eq(session.get().active,1);eq(ui.state.selected,null);
 eq(session.get().active,1);ok(!flatten(root).some(x=>x.textContent==='Freilassen'));await manage(root);await find(root,'Namen ändern').click();eq(renamedActive,1);eq(ui.active,false);eq(closed,1);
 ok(ui.open());await find(root,'Teamplanung 1 / 6').click();eq(ui.state.tab,'team');await flatten(root).find(x=>x.className==='tp-box-empty'&&x.tagName==='button'&&!x.hidden).click();let choices=flatten(root).filter(x=>x.className==='tp-box-tile'&&!x.disabled&&!x.hidden);ok(choices.length>0);await choices[0].click();await find(root,'Ins Team').click();eq(session.get().team.length,2);
 const second=session.get().team[1];await flatten(root).find(n=>n['data-team-id']===String(second)).click();await manage(root);await flatten(root).find(x=>x.tagName==='button'&&x.textContent==='Nach vorne'&&!x.disabled).click();eq(session.get().team[0],second);await flatten(root).find(x=>x.tagName==='button'&&x.textContent==='Nach hinten'&&!x.disabled).click();eq(session.get().team[1],second);await find(root,'Teamplanung 2 / 6').click();eq(flatten(root).filter(x=>x['data-team-id'])[0]['data-team-id'],'1');eq(flatten(root).filter(x=>x['data-team-id'])[0]['data-care-pinned'],'true');
 // Fill plan via the model's existing controller, then exercise explicit replace.
 for(const m of session.get().mons.filter(m=>!session.get().team.includes(m.id)).slice(0,4))await controller.apply('selectTeam',m.id);
 ui.refresh();eq(session.get().team.length,6);ok(!flatten(root).some(x=>x.tagName==='button'&&x.textContent==='Freien Teamplatz belegen'));
 await find(root,'Boxen').click();const unselected=session.get().mons.find(m=>m.id!==session.get().active&&!session.get().team.includes(m.id));ok(unselected);const boxIndex=session.get().boxes.findIndex(b=>b.slots.includes(unselected.id));await chooseBox(root,boxIndex);tile=flatten(root).find(x=>x.className==='tp-box-tile'&&flatten(x).some(n=>String(n.textContent).includes('#'+unselected.id)));await tile.click();await manage(root);await find(root,'Ins Team').click();eq(ui.state.modal,'replace');const priorTeam=session.get().team.slice();
 const replace=flatten(root).find(x=>x.tagName==='button'&&
  x.textContent.includes('Aktuelles Pflege-Pokemon'));
 ok(replace.disabled);await replace.click();eq(session.get().team,priorTeam);
 const removed=priorTeam.find(id=>id!==session.get().active);
 const allowed=flatten(root).find(x=>x.tagName==='button'&&
  x.textContent.includes(' · #'+removed+' · '));
 ok(allowed&&!allowed.disabled);await allowed.click();
 ok(session.get().team.includes(unselected.id)&&session.get().team.includes(1));
 ok(!session.get().team.includes(removed));eq(session.get().active,1);
 await find(root,'Zurück zur Übersicht').click();ui.close();eq(stops,4);eq(ui.active,false);eq(M.summary(session.get()).stored,6);ok(writes>8);
 const brokenHost=new Element('host');const broken=B.create({model:M,getController:()=>({read(){throw Error('future schema');},busy:false,blocked:false}),getHost:()=>brokenHost,document:{createElement:t=>new Element(t)},schedule:()=>0,cancel(){},repeat:()=>0,stop(){}});ok(broken.open());ok(includesText(brokenHost,'Sammlung nicht lesbar'));eq(flatten(brokenHost).filter(x=>x.tagName==='button').map(x=>x.textContent),['Zurück']);broken.close();
 const defaultHost=new Element('host');let callback=null;const context={console,TextEncoder,Date,Object,screen:'card',cardPage:3,choice:'none',tpSaveReplacing:false,dragStart:null,dragNow:null,feedMenuUntil:0,confirmUntil:0,TPCollectionModel:M,TPCollection:controller,TPCollectionGame:{supported:true,ready:true,dialogOpen:false,message:''},TPAppMenu:{ready:true},TPMega:{visible:()=>false},fns:{ceremony:()=>0,evolvingNow:()=>0,dexName:d=>'Name '+d},document:{getElementById:()=>defaultHost,createElement:t=>{const e=new Element(t);if(t==='canvas')e.getContext=()=>({clearRect(){},fillText(){},drawImage(){},putImageData(){}});return e;}},requestAnimationFrame:fn=>{callback=fn;return 1;},cancelAnimationFrame(){},setInterval:()=>1,clearInterval(){},canvas:{focus(){}},cardTap(){},spriteFor:()=>null};context.globalThis=context;vm.createContext(context);vm.runInContext(fs.readFileSync('browser_ver/web/collection-boxes.js','utf8'),context);ok(context.TPBoxes.open());eq(context.screen,'settings');callback(200);context.TPBoxes.close();eq(context.screen,'card');eq(context.cardPage,3);

 // UI01: browser adapter opens only from the real hub and preserves identity.
 let hubReturns=0;
 context.TPAppMenu={
  ready:true,active:true,page:'pokedex',
  close(){this.active=false;context.screen='idle';},
  show(which){
   eq(which,'pokedex');hubReturns++;
   this.active=true;this.page=which;context.screen='settings';
  }
 };
 context.screen='settings';context.cardPage=6;
 const unchanged=M.encode(session.get());
 ok(context.TPBoxes.open('pokedex'));
 eq(context.TPAppMenu.active,false);
 eq(context.cardPage,6);
 context.TPBoxes.close();
 eq(hubReturns,1);
 eq(context.TPAppMenu.active,true);
 eq(context.screen,'settings');
 eq(M.encode(session.get()),unchanged);

 const resetHub=()=>{
  context.screen='settings';context.cardPage=6;
  context.tpSaveReplacing=false;
  context.TPCollection=controller;
  context.TPCollectionGame.supported=true;
  context.TPCollectionGame.dialogOpen=false;
  context.TPAppMenu.ready=true;
  context.TPAppMenu.active=true;
  context.TPAppMenu.page='pokedex';
  context.TPAdmissionUI={active:false};
  context.fns.ceremony=()=>0;
  context.fns.evolvingNow=()=>0;
 };
 for(const change of [
  ()=>{context.tpSaveReplacing=true;},
  ()=>{context.TPCollection={...controller,busy:true};},
  ()=>{context.TPCollection={...controller,blocked:true};},
  ()=>{context.TPCollectionGame.dialogOpen=true;},
  ()=>{context.TPCollectionGame.supported=false;},
  ()=>{context.TPAppMenu.ready=false;},
  ()=>{context.TPAppMenu.active=false;},
  ()=>{context.TPAppMenu.page='settings';},
  ()=>{context.TPAdmissionUI.active=true;},
  ()=>{context.fns.ceremony=()=>1;},
  ()=>{context.fns.evolvingNow=()=>1;},
  ()=>{context.screen='battle';}
 ]){
  resetHub();change();
  eq(context.TPBoxes.open('pokedex'),false);
  eq(context.TPBoxes.active,false);
 }
 resetHub();
 eq(context.TPBoxes.open('unknown'),false);
 eq(M.encode(session.get()),unchanged);

 console.log('F4-C boxes UI passed: '+count+' assertions; actual model and durable-model session, ten box selection, rename, exact move, no invented genes, active rename delegation/no release, six-slot explicit replacement/reorder, confirmed single release, quota rollback and timer cleanup. DOM simulation, not real browser.');
})().catch(e=>{console.error(e);process.exit(1);});
