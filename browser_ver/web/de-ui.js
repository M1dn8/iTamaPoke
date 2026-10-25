(function(){
"use strict";

// Browser text catalogues share the core's existing language selection.
// No separate storage or second language preference is introduced.
const coreLocales=Object.freeze(['es','en','fr','de','it','pt','ko','en']);
const catalogues=new Map(
 Object.entries({"de":{"files.sprites":"Grafiken laden…","files.dex":"Pokédex-Texte…","files.cries":"Rufe laden…","save.export":"Sichern…","save.import":"Spielstand laden…","game.reset":"Neues Spiel…","common.back":"Zurück","common.language":"Sprache","common.sound":"Ton","assets.count":"{count} Dateien"},"en":{"files.sprites":"Load sprites…","files.dex":"Load dex text…","files.cries":"Load cries…","save.export":"Save file…","save.import":"Load save…","game.reset":"Reset game…","common.back":"Back","common.language":"Language","common.sound":"Sound","assets.count":"{count} files"},"es":{"files.sprites":"Cargar gráficos…","files.dex":"Textos de la Pokédex…","files.cries":"Cargar gritos…","save.export":"Guardar partida…","save.import":"Cargar partida…","game.reset":"Nueva partida…","common.back":"Volver","common.language":"Idioma","common.sound":"Sonido","assets.count":"{count} archivos"},"fr":{"files.sprites":"Charger les graphismes…","files.dex":"Textes du Pokédex…","files.cries":"Charger les cris…","save.export":"Sauvegarder…","save.import":"Charger une sauvegarde…","game.reset":"Nouvelle partie…","common.back":"Retour","common.language":"Langue","common.sound":"Son","assets.count":"{count} fichiers"}}).map(([code,messages])=>[
  code,Object.freeze({...messages})
 ])
);
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
const missing=new Set();
function recordMissing(value){
 if(missing.size<256)missing.add(value);
}
function language(){
 try{
  if(typeof fns==='undefined'||typeof fns.language!=='function')return 'de';
  const index=fns.language();
  return Number.isInteger(index)&&index>=0&&index<coreLocales.length
   ?coreLocales[index]:'en';
 }catch(_error){return 'de';}
}
function placeholders(value){
 return [...new Set(
  [...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(match=>match[1])
 )].sort().join(',');
}
function t(key,params={},locale=language()){
 const code=String(locale).toLowerCase();
 const selected=catalogues.get(code);
 const fallback=catalogues.get('en');
 let value;
 if(selected&&own(selected,key)){
  value=selected[key];
 }else if(own(fallback,key)){
  value=fallback[key];
  recordMissing(code+':'+key);
 }else{
  recordMissing(code+':'+key);
  return String(key);
 }
 return value.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g,(token,name)=>{
  if(params&&own(params,name))return String(params[name]);
  recordMissing(code+':'+key+':'+name);
  return token;
 });
}
function registerLocale(code,messages){
 if(typeof code!=='string'||!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(code)){
  throw Error('Invalid browser locale code');
 }
 code=code.toLowerCase();
 if(!messages||typeof messages!=='object'||Array.isArray(messages)){
  throw Error('Invalid browser catalogue');
 }
 const english=catalogues.get('en');
 for(const [key,value] of Object.entries(messages)){
  if(!/^[A-Za-z][A-Za-z0-9_.-]*$/.test(key)||typeof value!=='string'){
   throw Error('Invalid browser translation');
  }
  if(code!=='en'){
   if(!own(english,key))throw Error('Register English text first: '+key);
   if(placeholders(value)!==placeholders(english[key])){
    throw Error('Translation placeholders differ: '+key);
   }
  }else{
   for(const [otherCode,other] of catalogues){
    if(otherCode!=='en'&&own(other,key)&&
       placeholders(other[key])!==placeholders(value)){
     throw Error('Translation placeholders differ: '+key);
    }
   }
  }
 }
 catalogues.set(code,Object.freeze({
  ...(catalogues.get(code)||{}),...messages
 }));
 last=null;
}
function catalogue(code){
 return catalogues.get(String(code).toLowerCase())||null;
}
function missingKeys(){return Object.freeze([...missing]);}
function clearMissing(){missing.clear();}

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
 if(document.documentElement)document.documentElement.lang=language();
 const labels={spriteLoad:"files.sprites",dexEntryLoad:"files.dex",cryLoad:"files.cries",saveExport:"save.export",saveImport:"save.import",gameReset:"game.reset"};
 for(const[id,key]of Object.entries(labels)){const n=document.getElementById(id);if(n)n.textContent=t(key);}
}

// P03 pilot: menu labels; journal narratives remain a later migration.
for(const [code,messages] of Object.entries({"en":{"menu.title":"Menu","menu.journal":"Journal","menu.evolution":"Evolution","menu.dex":"Pokédex","menu.eggs":"Eggs","menu.backups":"Backups","menu.settings":"Settings","menu.files":"Files","menu.diagnostics":"Diagnostics","menu.rights":"Sources & usage rights","menu.home":"Back to your Pokémon","menu.manage":"Manage files","menu.graphics":"Load graphics (Pokémon and trainers)","menu.cries":"Load cries","menu.dextext":"Load Pokédex text","menu.inventory":"Check stored files","menu.reset":"New game","menu.resetNotice":"Starts a new save. Existing confirmation prompts still apply.","menu.diagnosticsUnavailable":"Diagnostics unavailable. Please open the current build.","menu.journalUnavailable":"Journal unavailable. Please open the current test build.","menu.unavailable":"This feature is currently unavailable.","menu.ambiguous":"The requested feature could not be identified uniquely.","menu.ariaCanvas":"Pokémon game. Swipe down or press Arrow Down to open the menu.","menu.aria":"Game menu","menu.journalEntries":"Journal entries","settings.sound":"Sound: {value}","settings.language":"Language: {value}","sound.off":"Off","sound.vibration":"Vibration","sound.on":"On","language.es":"Spanish","language.en":"English","language.fr":"French","language.de":"German","language.it":"Italian","language.pt":"Portuguese","language.ko":"Korean","language.koNames":"Korean names"},"de":{"menu.title":"Menü","menu.journal":"Tagebuch","menu.evolution":"Entwicklung","menu.dex":"Pokédex","menu.eggs":"Eier","menu.backups":"Sicherungen","menu.settings":"Einstellungen","menu.files":"Dateien","menu.diagnostics":"Diagnose","menu.rights":"Quellen & Nutzungsrechte","menu.home":"Zurück zum Pokémon","menu.manage":"Dateien verwalten","menu.graphics":"Grafiken laden (Pokemon und Leiter)","menu.cries":"Rufe laden","menu.dextext":"Pokédex-Texte laden","menu.inventory":"Dateibestand prüfen","menu.reset":"Neues Spiel","menu.resetNotice":"Startet mit einem neuen Spielstand. Vorherige Sicherheitsabfragen bleiben erhalten.","menu.diagnosticsUnavailable":"Diagnose nicht verfügbar. Bitte aktuellen Build öffnen.","menu.journalUnavailable":"Tagebuch nicht verfügbar. Bitte den aktuellen Test-Build öffnen.","menu.unavailable":"Diese Funktion ist gerade nicht verfügbar.","menu.ambiguous":"Funktion gerade nicht eindeutig verfügbar.","menu.ariaCanvas":"Pokémon-Spiel. Nach unten wischen oder Pfeil nach unten: Menü.","menu.aria":"Spielmenü","menu.journalEntries":"Tagebucheinträge","settings.sound":"Ton: {value}","settings.language":"Sprache: {value}","sound.off":"Aus","sound.vibration":"Vibration","sound.on":"An","language.es":"Spanisch","language.en":"Englisch","language.fr":"Französisch","language.de":"Deutsch","language.it":"Italienisch","language.pt":"Portugiesisch","language.ko":"Koreanisch","language.koNames":"Koreanische Namen"},"es":{"menu.title":"Menú","menu.journal":"Diario","menu.evolution":"Evolución","menu.dex":"Pokédex","menu.eggs":"Huevos","menu.backups":"Copias de seguridad","menu.settings":"Ajustes","menu.files":"Archivos","menu.diagnostics":"Diagnóstico","menu.rights":"Fuentes y derechos de uso","menu.home":"Volver al Pokémon","menu.manage":"Gestionar archivos","menu.graphics":"Cargar gráficos (Pokémon y entrenadores)","menu.cries":"Cargar gritos","menu.dextext":"Cargar textos de la Pokédex","menu.inventory":"Comprobar archivos guardados","menu.reset":"Nueva partida","menu.resetNotice":"Inicia una partida nueva. Se mantienen las confirmaciones de seguridad.","menu.diagnosticsUnavailable":"Diagnóstico no disponible. Abre la versión actual.","menu.journalUnavailable":"Diario no disponible. Abre la versión de prueba actual.","menu.unavailable":"Esta función no está disponible ahora.","menu.ambiguous":"No se ha podido identificar una única función.","menu.ariaCanvas":"Juego Pokémon. Desliza hacia abajo o pulsa la flecha abajo para abrir el menú.","menu.aria":"Menú del juego","menu.journalEntries":"Entradas del diario","settings.sound":"Sonido: {value}","settings.language":"Idioma: {value}","sound.off":"Desactivado","sound.vibration":"Vibración","sound.on":"Activado","language.es":"Español","language.en":"Inglés","language.fr":"Francés","language.de":"Alemán","language.it":"Italiano","language.pt":"Portugués","language.ko":"Coreano","language.koNames":"Nombres en coreano"},"fr":{"menu.title":"Menu","menu.journal":"Journal","menu.evolution":"Évolution","menu.dex":"Pokédex","menu.eggs":"Œufs","menu.backups":"Sauvegardes","menu.settings":"Paramètres","menu.files":"Fichiers","menu.diagnostics":"Diagnostic","menu.rights":"Sources et droits d’utilisation","menu.home":"Retour au Pokémon","menu.manage":"Gérer les fichiers","menu.graphics":"Charger les graphismes (Pokémon et Dresseurs)","menu.cries":"Charger les cris","menu.dextext":"Charger les textes du Pokédex","menu.inventory":"Vérifier les fichiers enregistrés","menu.reset":"Nouvelle partie","menu.resetNotice":"Commence une nouvelle partie. Les confirmations de sécurité sont conservées.","menu.diagnosticsUnavailable":"Diagnostic indisponible. Ouvrez la version actuelle.","menu.journalUnavailable":"Journal indisponible. Ouvrez la version de test actuelle.","menu.unavailable":"Cette fonction est actuellement indisponible.","menu.ambiguous":"La fonction demandée n’a pas pu être identifiée de manière unique.","menu.ariaCanvas":"Jeu Pokémon. Balayez vers le bas ou appuyez sur la flèche bas pour ouvrir le menu.","menu.aria":"Menu du jeu","menu.journalEntries":"Entrées du journal","settings.sound":"Son : {value}","settings.language":"Langue : {value}","sound.off":"Désactivé","sound.vibration":"Vibration","sound.on":"Activé","language.es":"Espagnol","language.en":"Anglais","language.fr":"Français","language.de":"Allemand","language.it":"Italien","language.pt":"Portugais","language.ko":"Coréen","language.koNames":"Noms coréens"}}))registerLocale(code,messages);
window.TPText={de,pick,types,status,typeName:i=>names[i]||"?",refresh,language,t,registerLocale,catalogue,missingKeys,clearMissing,coreLocales};
refresh();setInterval(()=>{refresh();if(de()){const n=document.getElementById("build");if(n&&/^build\b/i.test(n.textContent))n.textContent=n.textContent.replace(/^build\s+local/i,"Version lokal").replace(/^build\b/i,"Version");}},700);
})();
