const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
let context,overlay=null;const observers=new Map();
function flatten(n){return[n,...(n.children||[]).flatMap(flatten)];}
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.handlers={};this.style={};this.dataset={};this.className="";this.textContent="";this._hidden=false;this.disabled=false;}
 get hidden(){return this._hidden;}set hidden(v){this._hidden=v;for(const cb of observers.get(this)||[])cb();}
 appendChild(n){if(n.parentNode){const i=n.parentNode.children.indexOf(n);if(i>=0)n.parentNode.children.splice(i,1);}this.children.push(n);n.parentNode=this;return n;}
 append(...ns){ns.forEach(n=>this.appendChild(n));}insertBefore(n,ref){this.children.splice(this.children.indexOf(ref),0,n);n.parentNode=this;}
 replaceChildren(){this.children=[];}setAttribute(k,v){this[k]=v;}getAttribute(k){return this[k]??null;}focus(){context.document.activeElement=this;}
 addEventListener(k,f){(this.handlers[k]??=[]).push(f);}
 click(){for(const fn of this.handlers.click||[])fn({target:this,preventDefault(){},stopImmediatePropagation(){}});}
 querySelectorAll(sel){if(sel===".tp-modal-head button"){const head=flatten(this).find(n=>n.className==="tp-modal-head");return head?head.querySelectorAll("button"):[];}return flatten(this).filter(n=>n!==this&&((sel.startsWith("button")&&n.tagName==="button"&&(!sel.includes(":not")||!n.disabled))||(sel.startsWith(".")&&n.className.split(" ").includes(sel.slice(1)))));}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
}
const body=new Element("body"),canvas=new Element("canvas");canvas.id="tp";body.appendChild(canvas);let fileClicks=0,resetClicks=0;
const oldButtons=["Entwicklung","Dex-Suche","Eier","Sicherungen","Dateien"].map(name=>{const b=new Element("button");b.textContent=name;return b;});
oldButtons.find(b=>b.textContent==="Sicherungen").addEventListener("click",()=>{overlay=new Element("div");overlay.className="tp-modal";const panel=new Element("section"),head=new Element("div"),back=new Element("button");panel.className="tp-panel";head.className="tp-modal-head";back.textContent="Schliessen";back.addEventListener("click",()=>overlay.hidden=true);head.appendChild(back);panel.appendChild(head);overlay.appendChild(panel);body.appendChild(overlay);});
const ids={tp:canvas,spriteLoad:new Element("button"),gameReset:new Element("button")};ids.spriteLoad.addEventListener("click",()=>fileClicks++);ids.gameReset.addEventListener("click",()=>resetClicks++);
const stored=new Map(),data=[{t:1000,k:7,s:1,a:2,b:1,n:""},{t:1100,k:7,s:1,a:2,b:1,n:""}];
context={Module:{ccall:()=>JSON.stringify(data)},fns:{ceremony:()=>0,evolvingNow:()=>0,wildPromptActive:()=>0,language:()=>3,dexName:d=>d===1?"Bisasam":"Bisaknosp"},screen:"idle",choice:"none",tpSaveReplacing:false,TPExpeditions:{busy:false},dragStart:null,dragNow:null,feedMenuUntil:0,confirmUntil:0,soundMode:2,LANG_CODES:["ES","EN","FR","DE","IT","PT","KR","kr"],setSoundMode(n){context.soundMode=n;},playSfx(){},saveNow(){},setInterval(){},setTimeout(){},MutationObserver:class{constructor(cb){this.cb=cb;}observe(target){if(target!==body)(observers.get(target)||observers.set(target,[]).get(target)).push(this.cb);}},sessionStorage:{setItem:(k,v)=>stored.set(k,v),getItem:k=>stored.get(k),removeItem:k=>stored.delete(k)},document:{body,activeElement:null,createElement:t=>new Element(t),getElementById:id=>ids[id]||flatten(body).find(n=>n.id===id),querySelectorAll(sel){return sel===".tp-tools button"?oldButtons:sel===".tp-modal"?flatten(body).filter(n=>n.className==="tp-modal"):[];}}};context.window=context;
vm.createContext(context);vm.runInContext(fs.readFileSync("browser_ver/web/de-ui.js","utf8"),context);vm.runInContext(fs.readFileSync("browser_ver/web/zapdos-story-text.js","utf8"),context);vm.runInContext(fs.readFileSync("browser_ver/web/app-menu.js","utf8"),context);
const app=context.TPAppMenu;assert.equal(app.swipe(1),false);app.markReady();assert.equal(app.swipe(1),true);assert.equal(app.active,true);assert.equal(context.screen,"settings");
const root=flatten(body).find(n=>n.id==="tp-app-page");let labels=()=>flatten(root).filter(n=>n.tagName==="button").map(n=>n.textContent);

// P03: exercise the actual menu and settings with the real TPText catalogues.
const originalLanguage=context.fns.language;
for(const [index,menuLabel,settingsLabel,soundLabel,languageLabel,manageLabel] of [
 [3,'Menü','Einstellungen','Ton: An','Sprache: Deutsch','Dateien verwalten'],
 [1,'Menu','Settings','Sound: On','Language: English','Manage files'],
 [0,'Menú','Ajustes','Sonido: Activado','Idioma: Español','Gestionar archivos'],
 [2,'Menu','Paramètres','Son : Activé','Langue : Français','Gérer les fichiers'],
 [7,'Menu','Settings','Sound: On','Language: Korean names','Manage files']
]){
 context.fns.language=()=>index;
 app.show('main');
 assert(flatten(root).some(n=>n.textContent===menuLabel));
 assert(labels().includes(settingsLabel));
 app.show('settings');
 assert(labels().includes(soundLabel));
 assert(labels().includes(languageLabel));
 assert(labels().includes(manageLabel));
 app.show('files');
 assert(labels().includes(context.TPText.t('adminPage.graphicsShort')));
assert.equal(
 flatten(root).find(n=>n.dataset?.adminAction==='graphics').getAttribute('aria-label'),
 context.TPText.t('menu.graphics')
);
}
context.fns.language=originalLanguage;
context.TPText.refresh();
app.show('main');

assert.deepEqual(labels(),["Sicherungen","Einstellungen","Zurück zum Pokémon"]);
const click=text=>{const b=flatten(root).find(n=>n.tagName==="button"&&n.textContent===text);assert(b,text);b.click();};
app.show("pokedex");
assert.deepEqual(labels(),["Zurück","Tagebuch","Geschichten","Pokédex","Eier","Entwicklung","Boxen"]);
const collectionRequests=[];
context.TPBoxes={
 active:false,
 open(origin){collectionRequests.push(origin);return true;}
};
click("Boxen");
assert.deepEqual(collectionRequests,["pokedex"]);
delete context.TPBoxes;
click("Tagebuch");assert(flatten(root).some(n=>n.textContent.includes("Energie ×2 erhalten")));click("Zurück");
assert(flatten(root).some(n=>n.textContent==="Pokédex-Zentrale"));
click("Zurück");assert.equal(context.screen,"idle");assert.equal(app.active,false);
app.show("main");
click("Sicherungen");assert.equal(root.hidden,true);assert.equal(overlay.parentNode.id,"tp-game-shell");assert.equal(overlay.querySelector(".tp-modal-head button").textContent,"Zurück");overlay.querySelector(".tp-modal-head button").click();assert.equal(root.hidden,false);
click("Einstellungen");
const rights=flatten(root).find(n=>n.tagName==="button"&&n.textContent==="Quellen & Nutzungsrechte");assert(rights);assert(rights.parentNode.className.split(' ').includes('tp-admin-content'));assert.equal(rights.style.flex,"0 0 auto");
assert(!root.querySelector(".tp-app-actions").children.includes(rights));
click("Dateien verwalten");flatten(root).find(n=>n.dataset?.adminAction==="graphics").click();assert.equal(fileClicks,1);click("Zurück");click("Neues Spiel");assert.equal(resetClicks,1);click("Zurück");click("Zurück zum Pokémon");assert.equal(context.screen,"idle");assert.equal(app.active,false);
assert(app.eventText({k:1,s:999,a:999,f:1,n:"secret"}).includes("Ei"));assert(!app.eventText({k:1,s:999,a:999,f:1,n:"secret"}).includes("secret"));
assert.equal(app.groupEntries(data).length,1);assert.equal(app.groupEntries(data)[0].count,2);assert(app.eventText({k:3,s:1,a:2,n:"Flamme"}).includes("Flamme"));
const css=fs.readFileSync("browser_ver/web/app-menu.css","utf8");assert(css.includes("#toolbar,.tp-tools{display:none!important}"));assert(css.includes("touch-action:pan-y"));

// UI01: icons decorate the existing real routes without changing their labels.
app.show("pokedex");
const hubIcons=flatten(root).filter(n=>n.className==="tp-hub-icon");
assert.equal(hubIcons.length,6);
for(const icon of hubIcons){
 assert.equal(icon["aria-hidden"],"true");
 assert(icon.innerHTML.includes('viewBox="0 0 24 24"'));
 assert.equal(icon.parentNode.tagName,"button");
}
assert.deepEqual(
 flatten(root).filter(n=>n.dataset.hub).map(n=>n.dataset.hub),
 ["journal","stories","species","eggs","evolution","collection"]
);
click("Zurück");
assert.equal(app.active,false);


// UI01: execute the real original swipe function for the new hub entry.
{
 const main=fs.readFileSync("browser_ver/web/main.js","utf8");
 const start=main.indexOf("function onSwipe(dir) {");
 const end=main.indexOf("// Ports PetScreen.swift's onSwipeV",start);
 assert(start>=0&&end>start);
 context.fns.awaitingStarter=()=>0;
 let egg=0;
 context.fns.isEgg=()=>egg;
 context.swipeAllowed=()=>true;
 context.dexScreen="detail";context.dexPage=8;context.dexFilter=2;
 vm.runInContext(main.slice(start,end),context);

 app.show("pokedex");click("Pokédex");
 assert.equal(context.screen,"dex");
 assert.equal(context.dexScreen,"grid");
 assert.equal(context.dexPage,0);
 assert.equal(context.dexFilter,0);
 assert.equal(app.active,false);
 assert.equal(app.dexFromHub,true);
 assert.equal(app.returnDex(),true);
 assert.equal(app.page,"pokedex");
 assert.equal(app.active,true);

 egg=1;click("Pokédex");
 assert.equal(context.screen,"settings");
 assert.equal(app.active,true);
 egg=0;
 context.tpSaveReplacing=true;click("Pokédex");
 assert.equal(context.screen,"settings");
 context.tpSaveReplacing=false;
}


// UI01: a transient gate must not lose an already requested return.
{
 const originalCollection=context.TPCollection;
 const originalModule=context.Module;
 try{
  app.show("pokedex");click("Pokédex");
  assert.equal(context.screen,"dex");
  context.TPCollection={busy:true};
  assert.equal(app.returnDex(),true);
  assert.equal(context.screen,"dex");
  assert.equal(app.active,false);

  context.TPCollection.busy=false;
  app.drawDexBack();
  assert.equal(context.screen,"settings");
  assert.equal(app.page,"pokedex");
  assert.equal(app.active,true);

  // A request from an obsolete module must not navigate later.
  delete context.TPCollection;
  app.show("pokedex");click("Pokédex");
  context.TPCollection={busy:true};
  assert.equal(app.returnDex(),true);
  context.Module={...originalModule};
  context.TPCollection.busy=false;
  app.drawDexBack();
  assert.equal(context.screen,"dex");
  assert.equal(app.active,false);

  context.Module=originalModule;
  assert.equal(app.returnDex(),true);
  assert.equal(app.page,"pokedex");
  assert.equal(app.active,true);
 }finally{
  context.Module=originalModule;
  if(originalCollection===undefined)delete context.TPCollection;
  else context.TPCollection=originalCollection;
 }
}


// UI01: repeated navigation draws must not replace an unchanged label.
{
 app.show("pokedex");click("Pokédex");
 const back=flatten(body).find(n=>n.id==="tp-dex-back");
 assert(back);
 const descriptor=Object.getOwnPropertyDescriptor(back,"textContent");
 assert(descriptor&&Object.prototype.hasOwnProperty.call(descriptor,"value"));
 let value=back.textContent,writes=0;
 Object.defineProperty(back,"textContent",{
  configurable:true,
  get(){return value;},
  set(next){writes++;value=next;}
 });
 try{
  for(let frame=0;frame<12;frame++)app.drawDexBack();
  assert.equal(writes,0,"Unchanged back label must not be rewritten");
 }finally{
  Object.defineProperty(back,"textContent",descriptor);
 }
 assert.equal(app.returnDex(),true);
 assert.equal(app.page,"pokedex");
}


// UI01: detail-back preserves the existing raster page and collection filter.
{
 app.show("pokedex");click("Pokédex");
 context.dexScreen="detail";
 context.dexDetailPage=1;
 context.dexPage=3;
 context.dexFilter=1;
 assert.equal(app.returnDex(),true);
 assert.equal(context.screen,"dex");
 assert.equal(context.dexScreen,"grid");
 assert.equal(context.dexDetailPage,0);
 assert.equal(context.dexPage,3);
 assert.equal(context.dexFilter,1);
 assert.equal(app.active,false);
 assert.equal(app.dexFromHub,true);

 assert.equal(app.returnDex(),true);
 assert.equal(app.page,"pokedex");
 assert.equal(app.active,true);
}


// UI01: CSS central hub receives the same model as the canvas Pokedex.
{
 const source=fs.readFileSync("browser_ver/web/dex.js","utf8");
 const start=source.indexOf("// UI01 shared Pokedex design model.");
 const end=source.indexOf("// End UI01 shared Pokedex design model.",start);
 assert(start>=0&&end>start);
 vm.runInContext(source.slice(start,end),context);
 const shell=flatten(body).find(n=>n.id==="tp-game-shell");
 const values={};
 shell.style.setProperty=(name,value)=>{values[name]=value;};
 shell.style.getPropertyValue=name=>values[name]||"";
 app.show("pokedex");
 assert.equal(values["--tp-pokedex-panel-top"],"112px");
 assert.equal(values["--tp-pokedex-panel-bottom"],"42px");
 assert.equal(values["--tp-pokedex-spine-width"],"6px");
 assert.equal(values["--tp-pokedex-column-gap"],"18px");
 const panels=flatten(root).filter(n=>
  n.className.split(" ").includes("tp-pokedex-display")
 );
 assert.equal(panels.length,2);
 assert(panels.every(n=>n.getAttribute("aria-hidden")==="true"));
 assert.equal(flatten(root).filter(n=>n.className==="tp-pokedex-spine").length,1);
}



// UI01-06 revision 3: direct filters, entry navigation and complete event cards.
{
 const previousCall=context.Module.ccall;
 const fixture=Array.from({length:14},(_,index)=>({
  t:1000+index,k:index+1,s:1,a:index===9?255:2,b:1,f:0,n:"Flamme"
 }));
 context.Module.ccall=(name,...args)=>name==="tp_journal_json"?
  JSON.stringify(fixture):previousCall(name,...args);
 const find=id=>flatten(root).find(n=>n.id===id);
 const rows=()=>flatten(root).filter(n=>n.tagName==="article");
 const shown=()=>rows().filter(n=>!n.hidden);
 app.show("journal");
 assert.equal(rows().length,14);
 assert.equal(shown().length,3);
 const filters=()=>flatten(root).filter(n=>n.dataset.journalFilter);
 assert.equal(filters().length,6);
 assert(!find("tp-journal-filter"));
 assert(!find("tp-journal-text-next"));
 assert(!find("tp-journal-text-prev"));
 const categories={
  all:[1,2,3,4,5,6,7,8,9,10,11,12,13,14],
  pokemon:[1,2,3,4,5,11],level:[8],
  success:[6,9,10],expedition:[7],mega:[12,13,14]
 };
 for(const [category,kinds]of Object.entries(categories)){
  filters().find(n=>n.dataset.journalFilter===category).click();
  assert(shown().length>0&&shown().length<=3);
  assert(shown().every(n=>kinds.includes(Number(n.dataset.journalKind))));
  assert.equal(
   filters().find(n=>n.dataset.journalFilter===category).getAttribute("aria-pressed"),
   "true"
  );
 }
 filters().find(n=>n.dataset.journalFilter==="all").click();
 const reached=new Set();
 for(let i=0;i<20;i++){
  const selected=rows().find(n=>
   n._journalButton.getAttribute("aria-pressed")==="true"
  );
  assert(selected&&!selected.hidden);
  reached.add(selected.dataset.journalKey);
  if(find("tp-journal-next").disabled)break;
  find("tp-journal-next").click();
 }
 assert.equal(reached.size,14);
 filters().find(n=>n.dataset.journalFilter==="success").click();
 const medal=shown().find(n=>n.dataset.journalKind==="10");
 assert(medal);
 medal._journalButton.click();
 const expected=medal.children.find(n=>n.tagName==="p").textContent;
 const copy=flatten(root).find(n=>n.className==="tp-journal-copy");
 assert.equal(copy.textContent,expected);
 assert.equal(copy.tabIndex,0);
 filters().find(n=>n.dataset.journalFilter==="level").click();
 assert.equal(shown().length,1);
 assert.equal(find("tp-journal-prev").hidden,true);
 assert.equal(find("tp-journal-next").hidden,true);
 context.Module.ccall=previousCall;
 app.show("pokedex");
}

console.log("C5 UI passed (rights link outside scrolling list): two main entries and six hub entries, no top bars, proxy full pages/back, files/reset routing, diary grouping and no egg spoilers.");
