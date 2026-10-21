const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const source=fs.readFileSync("browser_ver/web/card.js","utf8");
function extract(text,sig){const a=text.indexOf(sig);assert(a>=0);let p=text.indexOf("{",a)+1,d=1;while(d){if(text[p]==="{")d++;else if(text[p]==="}")d--;p++;}return text.slice(a,p);}
const fn=extract(source,"function drawCardPersonality()");
assert(!fn.includes("createElement")&&!fn.includes("alert("));
for(let kind=0;kind<5;kind++){
 const text=[],records=[];const fns=new Proxy({personalityKind:()=>kind,personalityTitle:()=>"WESEN",personalityAgeLine:()=>"ALTER 0d",recordsTitle:()=>"REKORDE"},{get:(t,k)=>t[k]||(()=>0)});
 const ctx={fns,TPText:{pick:(de)=>de},TP:{cx:233},UI:{ink:"ink",bgDay:"bg",track:"track",barOK:"ok",barWarn:"warn",barBad:"bad"},ctx:{fill(){},fillText(s){text.push(String(s));}},roundRect(){},personalityColor:()=>"color",drawPersonalityRecord(...args){records.push(args);},statusEl:{}};
 vm.createContext(ctx);vm.runInContext(fn,ctx);ctx.drawCardPersonality();
 assert(text.includes(["Ausgeglichen","Verspielt","Mutig","Ruhig","Gemütlich"][kind]));assert(text.some(s=>s.startsWith("Bonus:")));assert.equal(records.length,6);assert(ctx.statusEl.textContent.startsWith("Karte · Wesen ·"));
 if(kind===4){assert(text.some(s=>s.includes("Aufwachen")));assert(!text.some(s=>s.includes("Träge")));}
}
console.log("C4 UI passed: five German personalities, causes/bonuses, six existing records and no new menu.");
