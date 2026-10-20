(function(){
"use strict";
const names=["","NORMAL","FEUER","WASSER","ELEKTRO","PFLANZE","EIS","KAMPF","GIFT","BODEN","FLUG","PSYCHO","KÄFER","GESTEIN","GEIST","DRACHE","UNLICHT","STAHL","FEE"];
function de(){try{return !fns||typeof fns.language!=="function"||fns.language()===3;}catch(_e){return true;}}
function pick(a,b){return de()?a:b;}
function types(original){return new Proxy(original,{get(target,key,receiver){if(de()&&typeof key==="string"&&/^[0-9]+$/.test(key)&&Number(key)<names.length)return names[Number(key)];return Reflect.get(target,key,receiver);}});}
function status(value){
 if(!de())return value;let s=String(value);
 for(const[a,b]of [["Play menu","Spiele"],["Choose your starter","Starter wählen"],["EGG","Ei"],["Settings","Einstellungen"],["Catch","Fangen"],["Memo","Merken"],["Clean","Putzen"],["Type","Typentraining"],["Sack","Boxsack"],["Dex detail","Pokédex-Detail"],["Dex","Pokédex"],["Battle","Kampf"],["Card","Karte"],["Rename","Umbenennen"],["error:","Fehler:"]])if(s===a||s.startsWith(a+" ")||s.startsWith(a+":")){s=b+s.slice(a.length);break;}
 for(const[a,b]of [["game over","beendet"],["Battle stats","Kampfwerte"],["Personality","Wesen"],["playback","Vorgabe"],["input","Eingabe"],["sleeping","schläft"],["misses","Fehler"],["rounds","Runden"],["round","Runde"],["score","Punkte"],["hits","Treffer"],["done","beendet"],["sound","Ton"],["lang","Sprache"],["bond","Bindung"],["page","Seite"],["filter","Filter"],["won","gewonnen"],["lost","verloren"],["FUL","Nahrung"],["JOY","Freude"],["HP","KP"]])s=s.replace(new RegExp("\\b"+a+"\\b","g"),b);
 return s;
}
let last=null;
function refresh(){
 let lang;try{lang=fns&&typeof fns.language==="function"?fns.language():3;}catch(_e){lang=3;}
 if(last===lang)return;last=lang;
 if(document.documentElement)document.documentElement.lang=["es","en","fr","de","it","pt","ko","en"][lang]||"de";
 const labels={spriteLoad:["Grafiken laden…","Load sprites…"],dexEntryLoad:["Pokédex-Texte…","Load dex text…"],cryLoad:["Rufe laden…","Load cries…"],saveExport:["Sichern…","Save file…"],saveImport:["Spielstand laden…","Load save…"],gameReset:["Neues Spiel…","Reset game…"]};
 for(const[id,text]of Object.entries(labels)){const n=document.getElementById(id);if(n)n.textContent=text[lang===3?0:1];}
}
window.TPText={de,pick,types,status,typeName:i=>names[i]||"?",refresh};
refresh();setInterval(()=>{refresh();if(de()){const n=document.getElementById("build");if(n&&/^build\b/i.test(n.textContent))n.textContent=n.textContent.replace(/^build\s+local/i,"Version lokal").replace(/^build\b/i,"Version");}},700);
})();
