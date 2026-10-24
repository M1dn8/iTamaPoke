const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
let context,overlay=null;const observers=new Map();
function flatten(n){return[n,...(n.children||[]).flatMap(flatten)];}
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.handlers={};this.style={};this.className="";this.textContent="";this._hidden=false;this.disabled=false;}
 get hidden(){return this._hidden;}set hidden(v){this._hidden=v;for(const cb of observers.get(this)||[])cb();}
 appendChild(n){if(n.parentNode){const i=n.parentNode.children.indexOf(n);if(i>=0)n.parentNode.children.splice(i,1);}this.children.push(n);n.parentNode=this;return n;}
 append(...ns){ns.forEach(n=>this.appendChild(n));}insertBefore(n,ref){this.children.splice(this.children.indexOf(ref),0,n);n.parentNode=this;}
 replaceChildren(){this.children=[];}setAttribute(k,v){this[k]=v;}focus(){context.document.activeElement=this;}
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
vm.createContext(context);vm.runInContext(fs.readFileSync("browser_ver/web/app-menu.js","utf8"),context);
const app=context.TPAppMenu;assert.equal(app.swipe(1),false);app.markReady();assert.equal(app.swipe(1),true);assert.equal(app.active,true);assert.equal(context.screen,"settings");
const root=flatten(body).find(n=>n.id==="tp-app-page");let labels=()=>flatten(root).filter(n=>n.tagName==="button").map(n=>n.textContent);
for(const name of ["Tagebuch","Entwicklung","Pokédex","Eier","Sicherungen","Einstellungen"])assert(labels().includes(name));
const click=text=>{const b=flatten(root).find(n=>n.tagName==="button"&&n.textContent===text);assert(b,text);b.click();};
click("Tagebuch");assert(flatten(root).some(n=>n.textContent.includes("Energie ×2 erhalten")));click("Zurück");
click("Sicherungen");assert.equal(root.hidden,true);assert.equal(overlay.parentNode.id,"tp-game-shell");assert.equal(overlay.querySelector(".tp-modal-head button").textContent,"Zurück");overlay.querySelector(".tp-modal-head button").click();assert.equal(root.hidden,false);
click("Einstellungen");
const rights=flatten(root).find(n=>n.tagName==="button"&&n.textContent==="Quellen & Nutzungsrechte");assert(rights);assert.equal(rights.parentNode,root);assert.equal(rights.style.flex,"0 0 auto");
assert(!root.querySelector(".tp-app-actions").children.includes(rights));
click("Dateien verwalten");click("Grafiken laden (Pokemon und Leiter)");assert.equal(fileClicks,1);click("Zurück");click("Neues Spiel");assert.equal(resetClicks,1);click("Zurück");click("Zurück zum Pokémon");assert.equal(context.screen,"idle");assert.equal(app.active,false);
assert(app.eventText({k:1,s:999,a:999,f:1,n:"secret"}).includes("Ei"));assert(!app.eventText({k:1,s:999,a:999,f:1,n:"secret"}).includes("secret"));
assert.equal(app.groupEntries(data).length,1);assert.equal(app.groupEntries(data)[0].count,2);assert(app.eventText({k:3,s:1,a:2,n:"Flamme"}).includes("Flamme"));
const css=fs.readFileSync("browser_ver/web/app-menu.css","utf8");assert(css.includes("#toolbar,.tp-tools{display:none!important}"));assert(css.includes("touch-action:pan-y"));
console.log("C5 UI passed (rights link outside scrolling list): six tiles, no top bars, proxy full pages/back, files/reset routing, diary grouping and no egg spoilers.");
