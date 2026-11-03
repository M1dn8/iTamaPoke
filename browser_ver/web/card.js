// Stat card, ported from PetScreen.swift's renderCard + its eight page
// functions. Profile/Personality/Battle/Medals/Progress live here;
// Daily/Box/Expedition are in expedition.js. Also the rename keyboard
// (renderKeyboard/keyboardTap).

let cardPage = 0;
const CARD_PAGE_COUNT = 8;
function cardPageCount(){return window.TPMega?.visible()?9:CARD_PAGE_COUNT;}
let nameDraft = "";


/* UI01 care status: four information views */
const statusUI=(function(){
 "use strict";
 const words={
  en:{title:"Your Pokémon",profile:"Profile",values:"Stats",today:"Today",
   achievements:"Achievements",rename:"Rename",mega:"Mega Evolution",
   records:"Game records",battle:"Battle record",medal:"Medal",
   earned:"Earned",missing:"Not earned yet",none:"No medals available",
   best:"Best streak"},
  de:{title:"Dein Pokémon",profile:"Profil",values:"Werte",today:"Heute",
   achievements:"Erfolge",rename:"Namen ändern",mega:"Mega-Entwicklung",
   records:"Spielrekorde",battle:"Kampfbilanz",medal:"Medaille",
   earned:"Erhalten",missing:"Noch nicht erhalten",none:"Keine Medaillen verfügbar",
   best:"Beste Serie"},
  es:{title:"Tu Pokémon",profile:"Perfil",values:"Estadísticas",today:"Hoy",
   achievements:"Logros",rename:"Cambiar nombre",mega:"Megaevolución",
   records:"Récords de juegos",battle:"Récord de combate",medal:"Medalla",
   earned:"Conseguida",missing:"Aún no conseguida",none:"No hay medallas disponibles",
   best:"Mejor racha"},
  fr:{title:"Votre Pokémon",profile:"Profil",values:"Statistiques",today:"Aujourd’hui",
   achievements:"Succès",rename:"Renommer",mega:"Méga-Évolution",
   records:"Records des jeux",battle:"Bilan des combats",medal:"Médaille",
   earned:"Obtenue",missing:"Pas encore obtenue",none:"Aucune médaille disponible",
   best:"Meilleure série"}
 };
 const profileWords={"en": {"bond": "Bond", "age": "Age", "careStreak": "Care streak", "days": "{count} days", "record": "Best {count}", "berry": "Favourite berry", "unknownBerry": "Not known yet", "short0": "Occasionally +1 joy", "short1": "Occasionally +2 joy", "short2": "Occasionally +2 joy", "short3": "Occasionally +1 bond", "short4": "Occasionally +2 energy"}, "de": {"bond": "Bindung", "age": "Alter", "careStreak": "Pflegeserie", "days": "{count} Tage", "record": "Rekord {count}", "berry": "Lieblingsbeere", "unknownBerry": "Noch unbekannt", "short0": "Gelegentlich +1 Freude", "short1": "Gelegentlich +2 Freude", "short2": "Gelegentlich +2 Freude", "short3": "Gelegentlich +1 Bindung", "short4": "Gelegentlich +2 Energie"}, "es": {"bond": "Vínculo", "age": "Edad", "careStreak": "Racha de cuidados", "days": "{count} días", "record": "Récord {count}", "berry": "Baya favorita", "unknownBerry": "Aún desconocida", "short0": "A veces +1 alegría", "short1": "A veces +2 alegría", "short2": "A veces +2 alegría", "short3": "A veces +1 vínculo", "short4": "A veces +2 energía"}, "fr": {"bond": "Lien", "age": "Âge", "careStreak": "Série de soins", "days": "{count} jours", "record": "Record {count}", "berry": "Baie préférée", "unknownBerry": "Encore inconnue", "short0": "Parfois +1 joie", "short1": "Parfois +2 joie", "short2": "Parfois +2 joie", "short3": "Parfois +1 lien", "short4": "Parfois +2 énergie"}};
 const profileCorrections={"en": {"dayOne": "{count} day", "careMistakes": "Care mistakes", "berryShort": "Berry", "berryUnknownShort": "Unknown", "berryColour0": "Red", "berryColour1": "Blue", "berryColour2": "Green"}, "de": {"dayOne": "{count} Tag", "careMistakes": "Pflegepatzer", "berryShort": "Beere", "berryUnknownShort": "Unbekannt", "berryColour0": "Rot", "berryColour1": "Blau", "berryColour2": "Grün"}, "es": {"dayOne": "{count} día", "careMistakes": "Descuidos", "berryShort": "Baya", "berryUnknownShort": "Desconocida", "berryColour0": "Roja", "berryColour1": "Azul", "berryColour2": "Verde"}, "fr": {"dayOne": "{count} jour", "careMistakes": "Soins manqués", "berryShort": "Baie", "berryUnknownShort": "Inconnue", "berryColour0": "Rouge", "berryColour1": "Bleue", "berryColour2": "Verte"}};
 for(const code of ["en","de","es","fr"])Object.assign(words[code],profileWords[code],profileCorrections[code]);
 const valueWords={"en": {"growth": "Growth", "training": "Training", "maximum": "Maximum level", "megaActive": "Mega form active"}, "de": {"growth": "Wachstum", "training": "Training", "maximum": "Maximallevel", "megaActive": "Mega-Form aktiv"}, "es": {"growth": "Crecimiento", "training": "Entrenamiento", "maximum": "Nivel máximo", "megaActive": "Forma Mega activa"}, "fr": {"growth": "Croissance", "training": "Entraînement", "maximum": "Niveau maximal", "megaActive": "Forme Méga active"}};
 for(const code of ["en","de","es","fr"])Object.assign(words[code],valueWords[code]);
 const growthWords={"en": {"viewEvolution": "View evolution", "view": "View", "profileLevel": "Lv.{level} → {next} · {minutes} min", "profileMaximum": "Lv.{level} · MAX"}, "de": {"viewEvolution": "Entwicklung ansehen", "view": "Ansehen", "profileLevel": "Lv.{level} → {next} · {minutes} Min", "profileMaximum": "Lv.{level} · MAX"}, "es": {"viewEvolution": "Ver evolución", "view": "Ver", "profileLevel": "Nv.{level} → {next} · {minutes} min", "profileMaximum": "Nv.{level} · MAX"}, "fr": {"viewEvolution": "Voir l’évolution", "view": "Voir", "profileLevel": "Niv.{level} → {next} · {minutes} min", "profileMaximum": "Niv.{level} · MAX"}};
 for(const code of ["en","de","es","fr"])Object.assign(words[code],growthWords[code]);
 const todayWords={"en": {"dailyTitle": "Your day", "dailyOverview": "Daily view", "dailyCount": "{done} / {total} completed", "dailyAllDone": "All done!", "dailyOpen": "Open", "dailyDone": "Done", "dailyPerGoal": "Per goal", "dailyAutomatic": "up to · automatic", "dailyJoy": "Joy", "dailyGoal0": "Care", "dailyGoal1": "Play", "dailyGoal2": "Win", "dailyGoal3": "Catch", "dailyGoal4": "Memory", "dailyHelp0": "Feeding or cleaning count.", "dailyHelp1": "Ball and type games count.", "dailyHelp2": "Won battles count.", "dailyHelp3": "Catch-game hits and catches count.", "dailyHelp4": "Completed memory rounds count."}, "de": {"dailyTitle": "Dein Tag", "dailyOverview": "Tagesblick", "dailyCount": "{done} / {total} geschafft", "dailyAllDone": "Alles geschafft!", "dailyOpen": "Offen", "dailyDone": "Geschafft", "dailyPerGoal": "Pro Ziel", "dailyAutomatic": "bis zu · automatisch", "dailyJoy": "Freude", "dailyGoal0": "Pflegen", "dailyGoal1": "Spielen", "dailyGoal2": "Siegen", "dailyGoal3": "Fangen", "dailyGoal4": "Merken", "dailyHelp0": "Füttern oder Saubermachen zählt.", "dailyHelp1": "Ball- und Typenspiel zählen.", "dailyHelp2": "Gewonnene Kämpfe zählen.", "dailyHelp3": "Fangspiel-Treffer und Fänge zählen.", "dailyHelp4": "Geschaffte Merkrunden zählen."}, "es": {"dailyTitle": "Tu día", "dailyOverview": "Resumen", "dailyCount": "{done} / {total} completados", "dailyAllDone": "¡Todo listo!", "dailyOpen": "Pendiente", "dailyDone": "Completado", "dailyPerGoal": "Por objetivo", "dailyAutomatic": "hasta · automático", "dailyJoy": "Alegría", "dailyGoal0": "Cuidar", "dailyGoal1": "Jugar", "dailyGoal2": "Ganar", "dailyGoal3": "Atrapar", "dailyGoal4": "Memoria", "dailyHelp0": "Alimentar o limpiar cuenta.", "dailyHelp1": "Cuentan los juegos de pelota y tipos.", "dailyHelp2": "Cuentan los combates ganados.", "dailyHelp3": "Cuentan los aciertos de captura y las capturas.", "dailyHelp4": "Cuentan las rondas de memoria completadas."}, "fr": {"dailyTitle": "Votre journée", "dailyOverview": "Vue du jour", "dailyCount": "{done} / {total} terminés", "dailyAllDone": "Tout est fait !", "dailyOpen": "À faire", "dailyDone": "Terminé", "dailyPerGoal": "Par objectif", "dailyAutomatic": "jusqu’à · automatique", "dailyJoy": "Joie", "dailyGoal0": "Soigner", "dailyGoal1": "Jouer", "dailyGoal2": "Gagner", "dailyGoal3": "Attraper", "dailyGoal4": "Mémoire", "dailyHelp0": "Nourrir ou nettoyer compte.", "dailyHelp1": "Les jeux de balle et de types comptent.", "dailyHelp2": "Les combats gagnés comptent.", "dailyHelp3": "Les réussites du jeu de capture et les captures comptent.", "dailyHelp4": "Les manches de mémoire réussies comptent."}};
 for(const code of ["en","de","es","fr"])Object.assign(words[code],todayWords[code]);
 const medalWords={"de": {"medalCollected": "{count} / {total} gesammelt", "medalRule0": "Level 10 erreichen.", "medalRule1": "Level 25 erreichen.", "medalRule2": "Level 50 erreichen.", "medalRule3": "Die Lieblingsbeere entdecken.", "medalRule4": "Eine Pflegeserie von 7 Tagen erreichen.", "medalRule5": "Bindung 100 erreichen.", "medalRule6": "Eine Endform erreichen.", "medalRule7": "Gewicht 0, ab Level 5 und ohne Pflegepatzer.", "medalUnlocked": "Freigeschaltet", "medalLocked": "Noch offen"}, "en": {"medalCollected": "{count} / {total} collected", "medalRule0": "Reach level 10.", "medalRule1": "Reach level 25.", "medalRule2": "Reach level 50.", "medalRule3": "Discover the favourite berry.", "medalRule4": "Reach a 7-day care streak.", "medalRule5": "Reach 100 bond.", "medalRule6": "Reach a final form.", "medalRule7": "Weight 0, level 5 or above, no care mistakes.", "medalUnlocked": "Unlocked", "medalLocked": "Still open"}, "es": {"medalCollected": "{count} / {total} conseguidas", "medalRule0": "Alcanza el nivel 10.", "medalRule1": "Alcanza el nivel 25.", "medalRule2": "Alcanza el nivel 50.", "medalRule3": "Descubre la baya favorita.", "medalRule4": "Alcanza 7 días seguidos de cuidados.", "medalRule5": "Alcanza 100 de vínculo.", "medalRule6": "Alcanza una forma final.", "medalRule7": "Peso 0, nivel 5 o más, sin descuidos.", "medalUnlocked": "Desbloqueada", "medalLocked": "Pendiente"}, "fr": {"medalCollected": "{count} / {total} obtenues", "medalRule0": "Atteindre le niveau 10.", "medalRule1": "Atteindre le niveau 25.", "medalRule2": "Atteindre le niveau 50.", "medalRule3": "Découvrir la baie préférée.", "medalRule4": "Atteindre 7 jours de soins consécutifs.", "medalRule5": "Atteindre un lien de 100.", "medalRule6": "Atteindre une forme finale.", "medalRule7": "Poids 0, niveau 5 minimum, aucun soin manqué.", "medalUnlocked": "Débloquée", "medalLocked": "À obtenir"}};
 for(const code of ["en","de","es","fr"])Object.assign(words[code],medalWords[code]);
 const scoreboardWords={"de": {"battleWins": "Siege", "battleLosses": "Niederlagen", "battleCurrent": "Aktuelle Serie", "battleBest": "Beste Serie"}, "en": {"battleWins": "Wins", "battleLosses": "Losses", "battleCurrent": "Current streak", "battleBest": "Best streak"}, "es": {"battleWins": "Victorias", "battleLosses": "Derrotas", "battleCurrent": "Racha actual", "battleBest": "Mejor racha"}, "fr": {"battleWins": "Victoires", "battleLosses": "Défaites", "battleCurrent": "Série actuelle", "battleBest": "Meilleure série"}};
 for(const code of ["en","de","es","fr"])Object.assign(words[code],scoreboardWords[code]);
 if(window.TPText?.registerLocale){
  for(const code of ["en","de","es","fr"]){
   TPText.registerLocale(code,Object.fromEntries(
    Object.entries(words[code]).map(([key,value])=>["careStatus."+key,value])
   ));
  }
 }
 const t=(key,params={})=>TPText.t("careStatus."+key,params);
 const pages={profile:0,values:4,today:2,achievements:5};
 const aliases={0:"profile",1:"profile",2:"today",4:"values",5:"achievements",6:"values"};
 let root=null,active=false,raf=null,lastKey="",lastRefresh=-Infinity;
 let image=null,buffer=null,lastPaint=-Infinity,detail="medal-0";
 let previousTab="",previousDetail="";
 let profileDetails=false;

 function personalityInfo(){

  const kind=fns.personalityKind(),col=personalityColor(kind);
  const names=TPText.pick(["Ausgeglichen","Verspielt","Mutig","Ruhig","Gemütlich"],["Balanced","Playful","Brave","Calm","Cozy"]);
  const causes=TPText.pick(["Abwechslung ohne klaren Schwerpunkt.","Geprägt durch regelmäßige Spiele.","Geprägt durch gewonnene Kämpfe.","Geprägt durch Pflege und Zuwendung.","Geprägt durch regelmäßige Erholung."],["Varied activities without a clear focus.","Shaped by regular games.","Shaped by won battles.","Shaped by care and affection.","Shaped by regular rest."]);
  const bonuses=TPText.pick(["Bonus: gelegentlich +1 Freude bei Aktivitäten.","Bonus: gelegentlich +2 Freude nach Spielen.","Bonus: gelegentlich +2 Freude nach Siegen.","Bonus: gelegentlich +1 Bindung bei Pflege.","Bonus: gelegentlich +2 Energie beim Aufwachen."],["Bonus: occasional +1 joy from activities.","Bonus: occasional +2 joy after games.","Bonus: occasional +2 joy after wins.","Bonus: occasional +1 bond from care.","Bonus: occasional +2 energy on waking."]);

  return {
   kind,
   name:names[kind]||names[0],
   cause:causes[kind]||causes[0],
   bonus:bonuses[kind]||bonuses[0]
  };
 }
 function locked(){
  return renameUI.busy||renameUI.blocked||tpSaveReplacing||!!window.TPMega?.busy||
   !!window.TPCollection?.busy||!!window.TPCollection?.blocked;
 }
 function inContext(){
  return screen==="card"&&Object.prototype.hasOwnProperty.call(aliases,cardPage)&&
   !fns.ceremony()&&!fns.evolvingNow()&&
   !window.TPAppMenu?.active&&!window.TPBoxes?.active&&
   !window.TPAdmissionUI?.active&&!window.TPCollectionGame?.dialogOpen;
 }
 function node(tag,value,cls){
  const n=document.createElement(tag);
  if(value!==undefined)n.textContent=value;
  if(cls)n.className=cls;
  return n;
 }
 function icon(kind){
  const n=node("span",undefined,"tp-status-icon");
  n.setAttribute("aria-hidden","true");
  const paths={
   battleBoard:'<path d="M2 4h20v15H2ZM12 4v15M6 19v3m12-3v3"/><path d="M5 8h4m-4 4h4m6-4h4m-4 4h4"/>',
   flagWin:'<path d="M5 22V3m0 1h13l-3 4 3 4H5"/>',
   flagLoss:'<path d="M5 22V3m0 5 13 5-4 2 2 5-11-5"/>',
   recordClean:'<path d="m5 18 9-9 4 4-9 9ZM14 9l3-6 4 4-3 6"/><circle cx="5" cy="6" r="2"/><path d="M9 2v3m-2-1h4M2 12h3"/>',
   recordType:'<path d="m12 2 9 5v10l-9 5-9-5V7Z"/><path d="m8 8 4 4 4-4m-4 4v6"/>',
   recordStreak:'<path d="M12 2c2 6 9 8 7 15-2 8-16 6-14-2 1-4 4-5 4-9 1 3 3 5 4 6 2-3 0-7-1-10Z"/>',
   recordCup:'<path d="M7 3h10v7a5 5 0 0 1-10 0ZM7 5H3v3c0 4 3 5 5 5m9-8h4v3c0 4-3 5-5 5M12 15v5m-5 2h10m-8-2h6"/>',
   dailyCare:'<path d="M12 18 5 11C0 5 7 1 12 7c5-6 12-2 7 4Z"/><path d="M3 20h13l5-5"/>',
   dailyCatch:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/>',
   dailyMemo:'<rect x="3" y="3" width="7" height="7" fill="#c56562" stroke="none"/><rect x="14" y="3" width="7" height="7" fill="#d6ad55" stroke="none"/><rect x="3" y="14" width="7" height="7" fill="#6396bd" stroke="none"/><rect x="14" y="14" width="7" height="7" fill="#699c70" stroke="none"/>',
   joy:'<circle cx="12" cy="12" r="9"/><path d="M7 14c2 5 8 5 10 0M8 8v1m8-1v1"/>',
   attack:'<path d="m4 20 5-5m-3-3 6 6M8 13 18 3l3 3-10 10M17 4l3 3"/>',
   defence:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Z"/>',
   initiative:'<path d="m12 4 8 8-8 8M4 4l8 8-8 8"/>',
   natureBalanced:'<path d="M12 3v18M6 21h12M4 7h16M6 7l-4 8h8ZM18 7l-4 8h8Z"/>',
   naturePlayful:'<circle cx="12" cy="12" r="9"/><path d="M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3"/>',
   natureBrave:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Zm-5 9 3 3 7-7"/>',
   natureCalm:'<path d="M4 20C1 7 11 3 21 3c0 11-5 19-17 17ZM4 20 17 7"/>',
   natureCozy:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m6 8 2 2m10-2-2 2M6 16l2-2m10 2-2-2"/>',
   heart:'<path d="M12 21 4 13C-3 6 5-1 12 6c7-7 15 0 8 7Z"/>',
   flame:'<path d="M12 2c2 6 8 8 8 13a8 8 0 0 1-16 0c0-4 3-7 5-9 0 5 3 6 3 6s2-4 0-10Z"/>',
   clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
   level:'<path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z"/>',
   evolution:'<path d="M12 22V12M12 14 5 7M12 14l7-7M5 7V2M19 7V2M2 5l3-3 3 3m8 0 3-3 3 3"/>',
   care:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Zm-5 10 3 3 7-7"/>',
   profile:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/>',
   values:'<path d="M3 20h18M5 16V9h3v7M11 16V4h3v12M17 16v-5h3v5"/>',
   today:'<path d="M4 5h16v16H4ZM8 2v6M16 2v6M4 10h16m-12 5 3 3 5-5"/>',
   achievements:'<circle cx="12" cy="9" r="6"/><path d="m8 14-2 8 6-3 6 3-2-8"/>',
   rename:'<path d="m4 16 12-12 4 4L8 20l-5 1ZM13 7l4 4"/>',
   mega:'<path d="m3 7 9-5 9 5v10l-9 5-9-5ZM7 16V8l5 5 5-5v8"/>'
  };
  if(kind==="back"&&window.TPNavBack){
   const c=node("canvas");c.width=c.height=24;
   TPNavBack.draw(c.getContext("2d"),0,0,24,"#315b83");
   n.append(c);
  }else{
   n.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '+
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+
    (paths[kind]||paths.profile)+'</svg>';
  }
  return n;
 }
 function button(label,key,fn,disabled=false){
  const n=node("button",label);n.type="button";n.disabled=!!disabled;
  n.dataset.statusFocus=key;
  n.addEventListener("click",()=>{
   if(!active||!inContext()||locked()||n.disabled||!n.isConnected)return;
   fn();if(active)render(true);
  });
  return n;
 }
 function hide(){
  if(renameUI.active&&!renameUI.busy)renameUI.cancel(false);
  profileDetails=false;
  active=false;if(root)root.hidden=true;
  if(raf!==null)cancelAnimationFrame(raf);raf=null;
 }
 function back(){
  if(locked())return;
  if(renameUI.active){renameUI.cancel();return;}
  if(aliases[cardPage]==="today"&&todayPick>=0){
   todayPick=-1;render(true);return;
  }
  if(profileDetails&&aliases[cardPage]==="profile"){
   profileDetails=false;render(true);return;
  }
  hide();screen="idle";dragStart=dragNow=null;canvas.focus?.();
 }
 function rename(){
  if(locked())return;
  if(renameUI.active){renameUI.cancel();return;}
  Module.ccall("tp_kb_set",null,["string"],[
   fns.hasNick()!==0?fns.name():""
  ]);
  kbSync();profileDetails=false;cardPage=0;
  renameUI.begin();render(true);
 }
 function ensure(){
  if(root)return;
  const host=document.getElementById("tp-game-shell");
  if(!host)throw Error("Spielrahmen fehlt.");
  if(typeof hubDexDesignTokens==="function"){
   for(const [key,value]of Object.entries(hubDexDesignTokens()))
    host.style.setProperty(key,value);
  }
  root=node("section");root.id="tp-status-page";root.hidden=true;
  root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");
  host.append(root);
  root.addEventListener("keydown",event=>{
   if(event.key==="Escape"){
    event.preventDefault();event.stopPropagation();back();return;
   }
   if(event.key!=="Tab")return;
   const buttons=Array.from(root.querySelectorAll("button:not(:disabled)"));
   if(!buttons.length){event.preventDefault();return;}
   const first=buttons[0],last=buttons[buttons.length-1];
   if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();last.focus();
   }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();first.focus();
   }
  });
 }
 function bar(label,value,maximum=260,colour=''){
  const row=node("div",undefined,"tp-status-stat");
  const track=node("span",undefined,"tp-status-track");
  track.setAttribute("aria-hidden","true");
  const fill=node("span");
  fill.style.width=Math.max(0,Math.min(100,value/Math.max(1,maximum)*100))+"%";
  if(colour)fill.style.backgroundColor=colour;
  track.append(fill);
  row.append(node("span",label),track,node("span",String(value)));
  row.dataset.value=String(value);
  return row;
 }

 /* UI01 status: profile and values plaques */
 function plaque(kind,title,value,cls=""){
  const card=node("article",undefined,"tp-status-plaque "+cls);
  const head=node("div",undefined,"tp-status-plaque-head");
  head.append(icon(kind),node("h3",title));
  card.append(head);
  if(value!==undefined)card.append(node("p",value));
  return card;
 }
 function fact(kind,value,cls=""){
  const card=node("div",undefined,"tp-status-fact "+cls);
  card.append(icon(kind),node("p",value));
  return card;
 }
 function progressTrack(value,maximum,colour){
  const track=node("span",undefined,"tp-status-track tp-status-progress");
  track.setAttribute("aria-hidden","true");
  const fill=node("span");
  fill.style.width=Math.max(0,Math.min(100,value/Math.max(1,maximum)*100))+"%";
  fill.style.backgroundColor=colour;
  track.append(fill);
  return track;
 }


 /* UI01 profile: compact two-display composition */

 /* UI01 profile: name pencil and care mistakes */
 function dayText(count){
  return t(Number(count)===1?"dayOne":"days",{count});
 }
 function profileCare(state){
  const card=node("article",undefined,
   "tp-status-plaque tp-status-care tp-status-profile-care"+
   (state.mistakeCount>0?" tp-status-care-warning":""));
  card.dataset.statusCarePatzer="";
  card.title=state.mistakes;
  const value=node("div",undefined,"tp-status-care-value");
  value.append(icon("care"),node("strong",String(state.mistakeCount)));
  card.append(node("h4",t("careMistakes")),value);
  return card;
 }

 function readBerry(info,age){
  info=String(info).trim();age=String(age).trim();
  const separated=!!age&&info.endsWith(age);
  const label=separated?info.slice(0,-age.length).trim():info;
  const normalized=label.normalize("NFD").replace(/\p{M}/gu,"").toUpperCase();
  const labels=[
   ["RED BERRY","ROTE BEERE","BAYA ROJA","BAIE ROUGE"],
   ["BLUE BERRY","BLAUE BEERE","BAYA AZUL","BAIE BLEUE"],
   ["GREEN BERRY","GRUNE BEERE","GRUENE BEERE","BAYA VERDE","BAIE VERTE"]
  ];
  const colour=labels.findIndex(values=>values.includes(normalized));
  return {label,colour,separated,unknown:label.includes("?")};
 }
 /* UI01 profile: centered name and plaque headings */
 function metric(kind,label,value,record){
  const card=node("article",undefined,"tp-status-profile-metric");
  card.append(node("h4",label));
  const line=node("div",undefined,"tp-status-metric-value");
  line.append(icon(kind),node("strong",value));
  card.append(line,node("p",record===undefined?"":t("record",{count:record})));
  return card;
 }
 function profileFacts(state){
  const facts=node("div",undefined,"tp-status-profile-facts");
  const match=String(state.age).match(/[0-9]+/u);
  const age=match?dayText(Number(match[0])):state.age;
  const ageCard=metric("clock",t("age"),age);
  ageCard.dataset.statusAge="";
  const streak=metric("flame",t("careStreak"),
   dayText(state.streakCount),state.bestStreak);
  streak.dataset.statusCareStreak="";
  facts.append(ageCard,streak);return facts;
 }
 function berryCard(berry){
  const card=node("article",undefined,"tp-status-plaque tp-status-berry");
  card.dataset.statusBerry="";
  const image=node("canvas");image.width=image.height=32;
  image.setAttribute("aria-hidden","true");
  const c=image.getContext("2d");c.imageSmoothingEnabled=false;
  if(berry.colour>=0){
   const map=[TPIcon.food,TPIcon.berryBlue,TPIcon.berryGreen][berry.colour];
   drawIconOn(c,map,0,0,2);
  }else{
   c.strokeStyle="#71818b";c.lineWidth=2;
   c.strokeRect(8,11,17,16);
   c.beginPath();c.moveTo(16,11);c.lineTo(19,5);c.lineTo(25,5);c.stroke();
   if(berry.unknown){
    c.fillStyle="#71818b";c.font="bold 13px monospace";
    c.textAlign="center";c.fillText("?",16,24);
   }
  }
  const value=berry.unknown?t("berryUnknownShort"):
   berry.colour>=0?t("berryColour"+berry.colour):berry.label;
  const label=node("p",value,"tp-status-berry-label");
  card.title=berry.label;
  card.setAttribute("aria-label",t("berry")+": "+value);
  const line=node("div",undefined,"tp-status-berry-choice");
  line.append(image,label);
  card.append(node("h4",t("berryShort")),line);
  return card;
 }


 /* UI01 values: growth training and evolution */

 /* UI01 growth portrait and values evolution shortcut */
 let returnFocus="";
 let trainingScene=null,lastTrainingPaint=-Infinity;
 function profileLevelLine(state){
  if(state.levelNumber>=100)
   return t("profileMaximum",{level:state.levelNumber});
  return t("profileLevel",{
   level:state.levelNumber,next:state.levelNumber+1,
   minutes:Math.max(0,state.per-state.into)
  });
 }
 function profileGrowthRing(state){
  const ring=node("span",undefined,"tp-status-growth-ring tp-status-portrait-ring");
  const ratio=levelFraction(state.levelNumber,state.into,state.per);
  const circumference=2*Math.PI*21;
  ring.setAttribute("role","progressbar");
  ring.setAttribute("aria-label",t("growth"));
  ring.setAttribute("aria-valuemin","0");
  ring.setAttribute("aria-valuemax","100");
  ring.setAttribute("aria-valuenow",String(Math.round(ratio*100)));
  ring.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true">'+
   '<circle cx="24" cy="24" r="21" fill="none" stroke="#ded2bd" stroke-width="2"/>'+
   '<circle cx="24" cy="24" r="21" fill="none" stroke="#c4a246" stroke-width="2" '+
   'stroke-linecap="round" transform="rotate(-90 24 24)" '+
   'stroke-dasharray="'+circumference+' '+circumference+'" '+
   'stroke-dashoffset="'+circumference*(1-ratio)+'"/>'+
   '</svg>';
  return ring;
 }
 function openEvolutionFromValues(){
  if(locked()||aliases[cardPage]!=="values"||
     typeof window.TPComfort?.openEvolution!=="function")return;
  returnFocus="evolution";
  hide();
  try{TPComfort.openEvolution();}
  catch(error){statusUI.draw(performance.now());throw error;}
 }
 function paintTraining(now){
  if(!trainingScene||now-lastTrainingPaint<140)return;
  lastTrainingPaint=now;
  const c=trainingScene.getContext("2d");
  const reduced=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const sway=reduced?0:Math.round(Math.sin(now/650)*2);
  c.clearRect(0,0,224,64);c.imageSmoothingEnabled=false;
  const r=(x,y,w,h,colour)=>{c.fillStyle=colour;c.fillRect(x,y,w,h);};
  r(0,0,224,64,"#e7f0ed");r(0,52,224,12,"#dce6d5");
  r(8,60,208,2,"#b9cdb0");
  r(17,8,4,51,"#8d795d");r(58,8,4,51,"#8d795d");
  r(17,8,45,4,"#a08b69");r(38,12,2,10,"#586671");
  r(27+sway,22,24,30,"#c85858");r(27+sway,35,24,5,"#96464a");
  r(31+sway,25,3,20,"#dd9290");

  c.fillStyle="#4e9361";c.strokeStyle="#386d49";c.lineWidth=2;
  c.beginPath();c.moveTo(112,13);c.lineTo(130,20);c.lineTo(127,43);
  c.lineTo(112,54);c.lineTo(97,43);c.lineTo(94,20);c.closePath();
  c.fill();c.stroke();
  c.strokeStyle="#e7f0d7";c.lineWidth=3;
  c.beginPath();c.moveTo(103,31);c.lineTo(110,38);c.lineTo(122,25);c.stroke();

  const shift=reduced?0:Math.floor(now/250)%3;
  r(158+shift*2,24,22,3,"#d1ad38");
  r(151+shift*2,34,26,3,"#d1ad38");
  r(160+shift*2,44,18,3,"#d1ad38");
  c.strokeStyle="#b5952f";c.lineWidth=4;
  c.beginPath();c.moveTo(187,19);c.lineTo(202,34);c.lineTo(187,49);c.stroke();
 }


 /* UI01 today: tasks and daily camp */
 let todayPick=-1,todayCanvas=null,todaySnapshot=null,todayBuffer=null;
 let lastTodayPaint=-Infinity;
 const todayKinds=["dailyCare","naturePlayful","attack","dailyCatch","dailyMemo"];
 const todayColours=["#c66d89","#6396bd","#c85858","#bc913d","#8670a3"];

 function dailyDoneCount(goals){
  return goals.filter(goal=>goal.done).length;
 }
 function todayTone(label){
  const value=String(label).normalize("NFD").replace(/\p{M}/gu,"").toUpperCase();
  if(["NIGHT","NACHT","NOCHE","NUIT","NOTTE","NOITE"].includes(value))return "night";
  if(["EVENING","ABEND","TARDE","SOIR","SERA"].includes(value))return "evening";
  if(["MORNING","MORGEN","MANANA","MATIN","MATTINA","MANHA"].includes(value))return "morning";
  if(["DAY","TAG","DIA","JOUR","GIORNO"].includes(value))return "day";
  return null;
 }
 function todayTitle(goal){
  return goal.kind>=0&&goal.kind<=4?t("dailyGoal"+goal.kind):goal.label;
 }
 function todayProgress(goal){
  const progress=node("div",undefined,"tp-today-progress");
  progress.setAttribute("aria-label",goal.progress+" / "+goal.target);
  if(goal.target>1){
   const pips=node("span",undefined,"tp-today-pips");
   pips.setAttribute("aria-hidden","true");
   for(let i=0;i<goal.target;i++){
    pips.append(node("span",undefined,i<goal.progress?"filled":""));
   }
   progress.append(pips,node("span",goal.progress+" / "+goal.target));
  }else{
   progress.append(node("span",goal.done?"✓":"○","tp-today-progress-mark"),
    node("span",t(goal.done?"dailyDone":"dailyOpen")));
  }
  return progress;
 }
 function todayBonus(){
  const card=node("div",undefined,"tp-today-bonus");
  card.setAttribute("aria-label",t("dailyPerGoal")+": "+
   t("dailyJoy")+" +4, "+t("bond")+" +1; "+t("dailyAutomatic"));
  const values=node("div",undefined,"tp-today-bonus-values");
  for(const [kind,value]of [["joy","+4"],["heart","+1"]]){
   const item=node("span");
   item.append(icon(kind),node("strong",value));values.append(item);
  }
  card.append(node("h4",t("dailyPerGoal")),values,node("p",t("dailyAutomatic")));
  return card;
 }
 function renderToday(left,right,state,data){
  left.className+=" tp-status-today-left";
  right.className+=" tp-status-today-right";
  const done=dailyDoneCount(state.goals);
  const all=state.goals.length>0&&done===state.goals.length;
  right.dataset.statusTodayView=todayPick<0?"overview":"goal";
  right.dataset.todayAllDone=String(all);
  const grid=node("div",undefined,"tp-today-board");
  state.goals.forEach((goal,index)=>{
   const pick=button("","daily-goal-"+index,()=>{todayPick=index;},locked());
   pick.dataset.statusGoal=String(index);
   pick.dataset.done=String(goal.done);pick.title=goal.label;
   pick.style.setProperty("--tp-goal-colour",todayColours[goal.kind]||"#718b9b");
   pick.setAttribute("aria-pressed",String(todayPick===index));
   pick.setAttribute("aria-label",todayTitle(goal)+" "+goal.progress+" / "+
    goal.target+" · "+t(goal.done?"dailyDone":"dailyOpen"));
   pick.append(icon(todayKinds[goal.kind]||"today"),
    node("span",todayTitle(goal),"tp-today-goal-title"),todayProgress(goal));
   if(goal.done)pick.append(node("span","✓","tp-today-done-tick"));
   grid.append(pick);
  });
  const overview=button("","daily-overview",()=>{todayPick=-1;},locked());
  overview.dataset.todayOverview="";
  overview.setAttribute("aria-pressed",String(todayPick<0));
  overview.setAttribute("aria-label",t("dailyOverview")+" "+done+" / "+state.goals.length);
  overview.append(icon("today"),node("span",t("dailyOverview"),"tp-today-goal-title"),
   node("span",done+" / "+state.goals.length,"tp-today-overview-count"));
  grid.append(overview);left.append(grid);

  const goal=todayPick>=0?state.goals[todayPick]:null;
  if(!goal){
   todayCanvas=node("canvas",undefined,"tp-today-scene");
   todayCanvas.width=224;todayCanvas.height=112;
   todayCanvas.setAttribute("role","img");
   todayCanvas.setAttribute("aria-label",data.name+" · "+state.phase);
   const sceneBox=node("div",undefined,"tp-today-scene-box");sceneBox.append(todayCanvas);
   todaySnapshot={phase:state.phase,all};
   const summary=node("div",undefined,"tp-today-summary");
   const stamps=node("span",undefined,"tp-today-stamps");
   stamps.setAttribute("aria-hidden","true");
   state.goals.forEach(item=>{
    stamps.append(node("span",item.done?"✓":"·",item.done?"complete":""));
   });
   summary.append(node("span",all?t("dailyAllDone"):
    t("dailyCount",{done,total:state.goals.length})),stamps);
   right.append(node("h3",state.phase,"tp-today-phase"),sceneBox,summary,todayBonus());
  }else{
   const art=node("div",undefined,"tp-today-detail-art");
   art.style.color=todayColours[goal.kind]||"#718b9b";
   art.append(icon(todayKinds[goal.kind]||"today"));
   const progress=todayProgress(goal);
   progress.style.setProperty("--tp-goal-colour",todayColours[goal.kind]||"#718b9b");
   right.append(node("h3",todayTitle(goal)),art,
    node("p",goal.kind>=0&&goal.kind<=4?t("dailyHelp"+goal.kind):goal.label,
     "tp-today-help"),progress,todayBonus());
  }
  lastTodayPaint=-Infinity;
 }
 function paintToday(now){
  if(!todayCanvas||!todaySnapshot||now-lastTodayPaint<140)return;
  lastTodayPaint=now;
  const c=todayCanvas.getContext("2d");
  const reduced=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let tone=todayTone(todaySnapshot.phase);
  if(!tone){
   const hour=typeof sceneHour==="function"?sceneHour():new Date().getHours();
   tone=hour<6||hour>=20?"night":hour<8?"morning":hour>=18?"evening":"day";
  }
  const night=tone==="night";
  const r=(x,y,w,h,colour)=>{c.fillStyle=colour;c.fillRect(x,y,w,h);};
  c.clearRect(0,0,224,112);c.imageSmoothingEnabled=false;
  r(0,0,224,112,night?"#25364b":tone==="evening"?"#e4ad89":
   tone==="morning"?"#e8cab0":"#d9e9e5");
  r(0,69,224,43,night?"#486551":"#a9c398");
  r(0,94,224,18,night?"#3b5846":"#93b284");
  if(night){
   r(178,10,16,16,"#e8e4c7");r(185,7,12,16,"#25364b");
   for(const [x,y]of [[16,14],[58,23],[105,9],[145,31],[213,20]])
    r(x,y,2,2,"#e5e8df");
  }else{
   r(178,11,16,16,tone==="evening"?"#d98a58":"#ead28c");
   r(174,15,24,8,tone==="evening"?"#d98a58":"#ead28c");
   const shift=reduced?0:Math.floor(now/1200)%5;
   r(20+shift,18,31,7,"#f4f0df");r(27+shift,13,18,7,"#f4f0df");
  }
  r(28,46,6,31,"#8a6b50");r(16,31,30,25,night?"#3d604b":"#6e9c65");
  r(183,65,27,16,night?"#3d604b":"#6e9c65");
  r(77,93,70,7,night?"#6b7d58":"#ccd4a0");
  r(87,89,50,13,night?"#6b7d58":"#ccd4a0");

  const sprite=typeof currentSprite!=="undefined"?currentSprite:null;
  const sleeping=fns.sleeping()!==0;
  const act=sleeping&&sprite?.actions?.[TPAct.sleep]?TPAct.sleep:
   todaySnapshot.all&&sprite?.actions?.[TPAct.pose]?TPAct.pose:TPAct.idle;
  const action=sprite?.actions?.[act];
  const image=action?frameImageData(sprite,act,
   reduced?0:frameIndexAt(action,now,true)):null;
  const bounds=image&&typeof hubDexBounds==="function"?hubDexBounds(image):null;
  if(bounds){
   if(!todayBuffer)todayBuffer=document.createElement("canvas");
   todayBuffer.width=image.width;todayBuffer.height=image.height;
   todayBuffer.getContext("2d").putImageData(image,0,0);
   const scale=Math.min(3,62/bounds.w,61/bounds.h);
   c.drawImage(todayBuffer,bounds.x,bounds.y,bounds.w,bounds.h,
    112-bounds.w*scale/2,96-bounds.h*scale,bounds.w*scale,bounds.h*scale);
  }else{
   c.fillStyle=night?"#e5e8df":"#71818b";
   c.textAlign="center";c.font="bold 26px monospace";c.fillText("?",112,83);
  }
  if(todaySnapshot.all){
   for(const [x,y]of [[79,30],[111,20],[144,31]]){
    r(x,y-4,2,10,"#d2ad4c");r(x-4,y,10,2,"#d2ad4c");
   }
  }
 }

 function statScale(values){
  return Math.max(260,...values);
 }
 function levelFraction(level,into,per){
  return level>=100?1:Math.max(0,Math.min(1,into/Math.max(1,per)));
 }
 function trainingCard(state){
  const card=node("article",undefined,"tp-status-plaque tp-status-training");
  const head=node("div",undefined,"tp-status-training-head");
  head.append(node("h4",t("training")),node("span","0–100"));
  trainingScene=node("canvas",undefined,"tp-status-training-scene");
  trainingScene.width=224;trainingScene.height=64;
  trainingScene.setAttribute("role","img");
  trainingScene.setAttribute("aria-label",t("training"));
  const grid=node("div",undefined,"tp-status-training-grid");
  const kinds=["attack","defence","initiative"];
  const colours=["#c85858","#4e9361","#d1ad38"];
  state.training.forEach((value,index)=>{
   const token=node("div",undefined,"tp-status-training-token");
   token.dataset.statusTraining=String(index);
   token.dataset.value=String(value);
   token.style.setProperty("--tp-training-colour",colours[index]);
   token.setAttribute("aria-label",fns.statLabel(index)+": "+value+" / 100");
   const label=node("div");
   label.append(icon(kinds[index]),node("span",fns.statLabel(index)));
   token.append(label,node("strong",String(value)));
   grid.append(token);
  });
  card.append(head,trainingScene,grid);return card;
 }
 function evolutionCard(state){
  const card=button("","evolution",openEvolutionFromValues,
   locked()||typeof window.TPComfort?.openEvolution!=="function");
  card.className="tp-status-plaque tp-status-evolution tp-status-evolution-"+state.evolutionKind;
  card.dataset.statusEvolution="";
  card.setAttribute("aria-label",t("viewEvolution"));
  card.title=t("viewEvolution");
  const copy=node("div");
  copy.append(node("h4",fns.evolutionLabel()),node("p",state.evolution),
   node("span",t("view"),"tp-status-evolution-action"));
  card.append(icon("evolution"),copy,
   node("span","›","tp-status-evolution-arrow"));
  return card;
 }

 function portrait(data,tab,state){
  const n=node("div",undefined,"tp-status-portrait");
  image=node("canvas");image.width=180;image.height=140;
  image.setAttribute("role","img");image.setAttribute("aria-label",data.name);
  if(tab==="profile")n.append(profileGrowthRing(state));
  n.append(image);
  const level=node("p",tab==="profile"?profileLevelLine(state):fns.levelLine());
  if(tab==="profile"){
   level.className="tp-status-growth-line";
   level.title=state.levelNumber>=100?t("maximum"):state.next;
  }
  const content=[n,node("h3",data.name),level];
  if(data.species)content.push(node("p",data.species,"tp-status-muted"));
  if(tab==="profile"){
   // Renaming is placed directly beside the name.
  }else{
   const labels=[fns.statLabel(0),fns.statLabel(1),fns.statLabel(2)];
   const values=[fns.atkStat(),fns.defStat(),fns.speStat()];
   const scale=statScale(values);
   for(let i=0;i<3;i++){
    const colour=["#c85858","#4e9361","#d1ad38"][i];
    const row=bar(labels[i],values[i],scale,colour);
    row.dataset.statusStat=String(i);
    row.dataset.scale=String(scale);
    content.push(row);
   }
  }
  return content;
 }

/* UI01 achievements: game record cards and battle plaques */
 /* UI01 achievements: medal cabinet */

 /* UI01 profile: golden Mega emblem */
 function megaDisplayMode(view,sleeping){
  if(!view?.supported)return "dormant";
  if(view.active)return "active";
  if(sleeping||!view.now||view.now<view.cool)return "dormant";
  return view.quest||view.stone?"ready":"dormant";
 }
 function megaEmblemArt(){
  const art=node("span",undefined,"tp-mega-glyph");
  art.setAttribute("aria-hidden","true");
  art.innerHTML='<svg viewBox="0 0 28 28" fill="none">'+
   '<defs><linearGradient id="tp-profile-mega-gold" x1="3" y1="2" x2="25" y2="27" gradientUnits="userSpaceOnUse">'+
   '<stop stop-color="#fff4bd"/><stop offset=".23" stop-color="#edc65c"/>'+
   '<stop offset=".47" stop-color="#b77c20"/><stop offset=".61" stop-color="#ffe79b"/>'+
   '<stop offset="1" stop-color="#c58b2c"/></linearGradient></defs>'+
   '<path d="m14 2 11 6v12l-11 6-11-6V8Z" fill="url(#tp-profile-mega-gold)" stroke="#88601f" stroke-width="1.3"/>'+
   '<path d="M8 19V9l6 6 6-6v10" stroke="#805419" stroke-width="2" stroke-linejoin="round"/>'+
   '<path d="m5 9 9-5 8 4M5 10v8" stroke="#fff7ce" stroke-width="1.4" stroke-linecap="round"/>'+
   '<path d="M23 2v6m-3-3h6" stroke="#fff6ce" stroke-width="1.1" stroke-linecap="round"/>'+
   '</svg>';
  return art;
 }

 function medalArt(index,got){
  const art=node("span",undefined,"tp-medal-art");
  art.dataset.earned=String(got);
  art.dataset.medalKind=String(index);
  art.setAttribute("aria-hidden","true");
  const colours=["#a88d55","#7d9aa6","#c59b3e","#b79349",
   "#c07e4c","#bd7188","#8d83b6","#629478"];
  art.style.setProperty("--tp-medal-colour",got?colours[index]:"#a0a89a");
  const motifs=[
   '<text x="12" y="14.5" text-anchor="middle" fill="currentColor" stroke="none" font-family="monospace" font-size="7" font-weight="bold">10</text>',
   '<text x="12" y="14.5" text-anchor="middle" fill="currentColor" stroke="none" font-family="monospace" font-size="7" font-weight="bold">25</text>',
   '<text x="12" y="14.5" text-anchor="middle" fill="currentColor" stroke="none" font-family="monospace" font-size="7" font-weight="bold">50</text>',
   '<path d="M12 8c-6-4-8 3-5 7 2 3 8 3 10-1 2-4-1-8-5-6Zm0 0c-1-4 3-5 5-5-1 3-2 5-5 5Z"/>',
   '<path d="M12 5c1 4 6 5 4 10-2 5-10 2-9-2 0-2 2-3 2-5 1 2 2 3 3 3 1-2 0-4 0-6Z"/>',
   '<path d="M12 17 7 12c-4-4 1-8 5-4 4-4 9 0 5 4Z"/>',
   '<path d="m12 5 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm-7 0 1 2m12-2-1 2"/>',
   '<path d="m8 8 8 8M6 6l-2 2 3 3 2-2m6 6-2 2 3 3 2-2M8 4l3 3m6 6 3 3"/>'
  ];
  art.innerHTML='<svg viewBox="0 0 24 26" fill="none" stroke="currentColor" '+
   'stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">'+
   '<path d="m7 16-2 9 7-3 7 3-2-9" fill="var(--tp-medal-face)"/>'+
   '<circle cx="12" cy="11" r="10" fill="var(--tp-medal-face)"/>'+
   '<circle cx="12" cy="11" r="8" opacity=".55"/>'+
   (motifs[index]||motifs[0])+'</svg>';
  return art;
 }

 /* UI01 status: scoreboard and centred navigation */
 function battleNumbers(line,count){
  const parts=String(line).match(/[0-9]+/g)||[];
  if(parts.length!==count)return null;
  const values=parts.map(Number);
  return values.every(value=>Number.isSafeInteger(value)&&value>=0)?values:null;
 }
 function battleScore(state){
  const ledger=node("div",undefined,"tp-medal-battle tp-battle-plaques tp-score-ledger");
  const totals=battleNumbers(state.battle[0],2);
  const first=node("article",undefined,"tp-battle-record-plaque tp-battle-scoreboard");
  first.dataset.statusBattleRecord="0";
  if(totals){
   for(const [index,key,motif]of [
    [0,"battleWins","flagWin"],[1,"battleLosses","flagLoss"]
   ]){
    const cell=node("div",undefined,"tp-score-cell");
    cell.dataset[index===0?"battleWins":"battleLosses"]="";
    const value=node("div",undefined,"tp-score-value");
    value.append(icon(motif),node("strong",String(totals[index])));
    cell.append(value,node("span",t(key),"tp-score-label"));
    first.append(cell);
   }
  }else{
   first.className="tp-battle-record-plaque tp-battle-raw";
   first.append(icon("battleBoard"),node("p",state.battle[0]));
  }
  ledger.append(first);

  const current=battleNumbers(state.battle[1],1);
  const entries=[
   {index:1,key:"battleCurrent",motif:"recordStreak",
    value:current?current[0]:null,raw:state.battle[1],colour:"#6396bd"},
   {index:2,key:"battleBest",motif:"recordCup",
    value:state.best,raw:state.battle[2],colour:"#bc913d"}
  ];
  for(const entry of entries){
   const plaque=node("article",undefined,"tp-battle-record-plaque tp-score-series");
   plaque.dataset.statusBattleRecord=String(entry.index);
   plaque.dataset[entry.index===1?"battleCurrent":"battleBest"]="";
   plaque.style.setProperty("--tp-battle-record-colour",entry.colour);
   if(entry.value===null||!Number.isSafeInteger(entry.value)||entry.value<0){
    plaque.className="tp-battle-record-plaque tp-battle-raw";
    plaque.append(icon(entry.motif),node("p",entry.raw));
   }else{
    plaque.dataset.zero=String(entry.value===0);
    plaque.append(icon(entry.motif),node("span",t(entry.key)),
     node("strong",String(entry.value)));
   }
   ledger.append(plaque);
  }
  return ledger;
 }

 function renderAchievements(left,right,state){
  left.className+=" tp-medal-gallery-left";
  right.className+=" tp-medal-gallery-right";
  const count=state.medals.filter(medal=>medal.got).length;
  left.append(node("p",t("medalCollected",{count,total:state.medals.length}),
   "tp-medal-count"));
  const grid=node("div",undefined,"tp-status-medals tp-medal-cabinet");
  state.medals.forEach((_,index)=>grid.append(medalChoice(index)));
  left.append(grid);

  const categories=node("div",undefined,"tp-medal-actions");
  for(const id of ["records","battle"]){
   const pick=button("",id,()=>{detail=id;},locked());
   pick.dataset.statusAchievement=id;
   pick.title=t(id);pick.setAttribute("aria-label",t(id));
   pick.setAttribute("aria-pressed",String(detail===id));
   pick.append(icon(id==="records"?"values":"battleBoard"));categories.append(pick);
  }
  right.append(categories);
  if(detail==="records"){
   right.append(node("h3",t("records")));
   const rows=node("div",undefined,"tp-medal-records tp-record-cards");
   const labels=[fns.ballRecordLabel(),fns.catchRecordLabel(),fns.memoRecordLabel(),
    fns.cleanRecordLabel(),fns.typeRecordLabel()];
   const motifs=["naturePlayful","dailyCatch","dailyMemo","recordClean","recordType"];
   const colours=["#6396bd","#bc913d","#8670a3","#629478","#c66d89"];
   state.records.forEach((value,index)=>{
    const row=node("div",undefined,"tp-medal-record");
    row.dataset.statusRecord=String(index);
    row.style.setProperty("--tp-record-colour",colours[index]);
    const result=node("div",undefined,"tp-record-value");
    const score=node("strong",String(value));
    if(String(value).length>4)score.className="tp-record-value-compact";
    result.append(icon(motifs[index]),score);
    row.append(node("span",labels[index],"tp-record-label"),result);
    rows.append(row);
   });
   right.append(rows);
  }else if(detail==="battle"){
   right.append(node("h3",t("battle")));
   right.append(battleScore(state));
  }else{
   let index=Number(detail.replace("medal-",""));
   if(!Number.isInteger(index)||index<0||index>=state.medals.length)index=0;
   const medal=state.medals[index];
   if(!medal){right.append(node("p",t("none")));return;}
   right.dataset.medalSelected=String(index);
   right.dataset.medalEarned=String(medal.got);
   const stage=node("div",undefined,"tp-medal-podium");
   stage.dataset.earned=String(medal.got);
   stage.append(medalArt(index,medal.got));
   const status=node("p",t(medal.got?"medalUnlocked":"medalLocked"),
    "tp-medal-status");
   status.dataset.earned=String(medal.got);
   right.append(node("h3",medal.description),stage,
    node("p",t("medalRule"+index),"tp-medal-rule"),status);
   if(index<3&&!medal.got){
    const target=[10,25,50][index];
    right.append(node("p",Math.min(state.level,target)+" / "+target,
     "tp-medal-level-progress"));
   }
  }
 }

 function medalChoice(index){
  const got=fns.hasMedal(index)!==0;
  const n=button("","medal-"+index,()=>{detail="medal-"+index;},locked());
  n.dataset.statusMedal=String(index);
  n.dataset.earned=String(got);
  n.setAttribute("aria-label",fns.medalDescription(index)+" · "+
   t(got?"medalUnlocked":"medalLocked"));
  n.title=fns.medalDescription(index);
  n.setAttribute("aria-pressed",String(detail==="medal-"+index));
  n.append(medalArt(index,got));
  if(got)n.append(node("span","✓","tp-medal-earned-mark"));
  return n;
 }
 function render(force=false){
  if(!active)return;
  const tab=aliases[cardPage];
  if(tab==="profile"&&renameUI.active&&renameUI.mounted){
   renameUI.refresh();return;
  }
  if(tab==="today"&&!locked())Module._tp_ensure_daily_goals();
  if(typeof ensureSprite==="function")ensureSprite(fns.speciesId());
  const megaActive=!!window.TPMega?.active();
  const data={
   name:megaActive?window.TPMega.name():fns.name(),
   species:fns.hasNick()!==0?(megaActive?fns.name():fns.speciesName()):"",
   level:fns.levelLine(),dex:fns.speciesId(),locked:locked(),
   mega:!!window.TPMega?.visible(),megaActive
  };
  let state;
  if(tab==="profile"){
   state={...personalityInfo(),bond:fns.bond(),info:fns.infoLine(),
    streak:fns.streakLine(),age:fns.personalityAgeLine(),
    streakCount:fns.streak(),bestStreak:fns.bestStreak(),
    mistakes:fns.mistakesLine(),mistakeCount:fns.careMistakes(),
    levelNumber:fns.level(),into:fns.minutesIntoLevel(),per:fns.minutesPerLevel(),
    next:fns.nextLevelLine()};
   state.berry=readBerry(state.info,state.age);
  }else if(tab==="values"){
   state={stats:[fns.atkStat(),fns.defStat(),fns.speStat()],
    training:[17,18,19].map(index=>Module.ccall("tp_c2_get","number",["number"],[index])),
    levelNumber:fns.level(),
    into:fns.minutesIntoLevel(),per:fns.minutesPerLevel(),
    next:fns.nextLevelLine(),evolution:fns.evolutionStatus(),
    evolutionKind:fns.evolutionStatusKind()};
  }else if(tab==="today"){
   state={
    phase:fns.dayPhaseLabel(),reward:fns.dailyRewardLine(),
    goals:Array.from({length:fns.dailyGoalCount()},(_,i)=>({
     label:fns.dailyGoalLabel(i),kind:fns.dailyGoalKind(i),done:fns.dailyGoalComplete(i)!==0,
     progress:fns.dailyGoalProgress(i),target:fns.dailyGoalTarget(i)
    }))
   };
  }else{
   state={
    medals:Array.from({length:fns.medalCount()},(_,i)=>({
     description:fns.medalDescription(i),got:fns.hasMedal(i)!==0
    })),
    records:[fns.gameHigh(),fns.catchHigh(),fns.memoHigh(),fns.cleanHigh(),fns.typeHigh()],
    battle:[fns.battleRecordLine(),fns.battleStreakLine(),fns.battleBestLine()],
    best:fns.bestBattleStreak(),level:fns.level()
   };
  }
  const megaMode=tab==="profile"&&data.mega?
   megaDisplayMode(window.TPMega.view(),fns.sleeping()!==0):"dormant";
  const next=JSON.stringify([tab,detail,todayPick,profileDetails,megaMode,data,state,t("title"),t("records")]);
  if(!force&&next===lastKey)return;
  lastKey=next;
  const oldScrolls=Array.from(root.querySelectorAll(".tp-status-scroll"));
  const leftScroll=previousTab===tab?(oldScrolls[0]?.scrollTop||0):0;
  const rightScroll=previousTab===tab&&previousDetail===detail?
   (oldScrolls[1]?.scrollTop||0):0;
  const focused=root.contains(document.activeElement)?
   document.activeElement.dataset.statusFocus:null;
  previousTab=tab;previousDetail=detail;
  root.replaceChildren();image=null;trainingScene=null;todayCanvas=null;
  root.dataset.statusView=tab;
  root.dataset.statusProfileMode=renameUI.active?"rename":profileDetails?"personality":"summary";
  root.setAttribute("aria-label",t(tab==="today"?"dailyTitle":"title"));

  const head=node("header",undefined,"tp-status-head");
  const exit=button(TPText.t("common.back"),"back",back,locked());
  exit.dataset.statusBack="";
  exit.setAttribute("aria-label",TPText.t("common.back"));
  exit.replaceChildren(icon("back"));
  head.append(node("h2",t(tab==="today"?"dailyTitle":"title")),exit);

  const tabs=node("div",undefined,"tp-status-tabs");
  for(const id of ["profile","values","today","achievements"]){
   const pick=button(t(id),"tab-"+id,()=>{if(renameUI.active)renameUI.cancel(false);profileDetails=false;if(id==="today")todayPick=-1;cardPage=pages[id];},locked());
   pick.dataset.statusTab=id;pick.setAttribute("aria-label",t(id));pick.title=t(id);
   pick.setAttribute("aria-pressed",String(tab===id));
   pick.replaceChildren(icon(id));tabs.append(pick);
  }
  let profileMega=null;
  if(tab==="profile"&&data.mega&&!profileDetails){
   const mega=button(t("mega"),"mega",()=>{cardPage=8;hide();},locked());
   mega.dataset.statusMega="";
   mega.setAttribute("aria-label",t("mega"));mega.title=t("mega");
   mega.replaceChildren(icon("mega"));profileMega=mega;
  }

  const frame=node("div",undefined,"tp-status-frame");
  frame.setAttribute("aria-hidden","true");
  for(const cls of [
   "tp-pokedex-display tp-pokedex-display-left",
   "tp-pokedex-display tp-pokedex-display-right","tp-pokedex-spine"
  ])frame.append(node("span",undefined,cls));

  const body=node("div",undefined,"tp-status-body");
  const left=node("div",undefined,"tp-status-column");
  const right=node("div",undefined,"tp-status-column");
  const a=node("div",undefined,"tp-status-scroll");
  const b=node("div",undefined,"tp-status-scroll");
  left.append(a);right.append(b);

  if(tab==="profile"||tab==="values"){
   const content=portrait(data,tab,state);
   if(tab==="profile"){
    const picture=content.shift();
    a.className+=" tp-status-profile-left";
    b.className+=" tp-status-profile-right";
    const nameRow=node("div",undefined,"tp-status-name-row");
    const nameStack=node("div",undefined,"tp-status-name-stack");
    const nameText=content.shift();
    nameStack.append(nameText,...content);
    const edit=button("","rename",rename,locked());
    edit.dataset.statusRename="";
    edit.setAttribute("aria-label",t("rename"));
    edit.replaceChildren(icon("rename"));
    nameText.append(edit);
    nameRow.append(nameStack);
    a.append(nameRow,picture,profileFacts(state));
   }else{
    a.className+=" tp-status-values-left";
    b.className+=" tp-status-values-right";
    a.append(...content);
    if(data.megaActive){
     const badge=icon("mega");
     badge.className+=" tp-status-active-form";
     badge.title=t("megaActive");
     a.querySelector("h3").prepend(badge);
    }
   }
   if(tab==="profile"){
    const natureKinds=["natureBalanced","naturePlayful","natureBrave","natureCalm","natureCozy"];
    const kind=natureKinds[state.kind]||natureKinds[0];
    if(renameUI.active){
     renameUI.mount(b);
    }else if(profileDetails){
     const full=plaque(kind,state.name,state.cause,
      "tp-status-personality tp-status-personality-full tp-status-nature-"+state.kind);
     full.append(node("p",state.bonus,"tp-status-bonus"));
     b.append(full);
    }else{
     const nature=button("","personality",()=>{profileDetails=true;},locked());
     nature.className="tp-status-plaque tp-status-personality tp-status-nature-"+state.kind;
     nature.dataset.statusPersonality="";
     nature.setAttribute("aria-label",state.name);
     const head=node("div",undefined,"tp-status-plaque-head");
     head.append(icon(kind),node("h3",state.name));
     nature.append(head,node("p",t("short"+(state.kind>=0&&state.kind<=4?state.kind:0)),
      "tp-status-short-bonus"));
     const bond=plaque("heart",t("bond"),undefined,"tp-status-bond");
     bond.append(bar("",state.bond,100,"#c66d89"));
     const bottom=node("div",undefined,"tp-status-profile-bottom");
     bottom.append(berryCard(state.berry),profileCare(state));
     b.append(nature,bond,bottom);
    }

   }else{
    b.append(trainingCard(state),evolutionCard(state));
   }
  }else if(tab==="today"){
   renderToday(a,b,state,data);
  }else{
   renderAchievements(a,b,state);
  }
  if(profileMega){
   const portrait=a.querySelector(".tp-status-portrait");
   if(portrait){
    portrait.classList.add("tp-mega-portrait");
    profileMega.classList.add("tp-mega-emblem");
    profileMega.dataset.statusMega="";
    profileMega.dataset.megaMode=megaMode;
    profileMega.replaceChildren(megaEmblemArt());
    portrait.append(profileMega);
   }
  }
  body.append(left,right);root.append(head,tabs,frame,body);
  a.scrollTop=leftScroll;b.scrollTop=rightScroll;
  const focus=focused?Array.from(root.querySelectorAll("button")).find(
   n=>n.dataset.statusFocus===focused&&!n.disabled
  ):exit;
  if(renameUI.active)renameUI.focusInput();
  else focus?.focus({preventScroll:true});
  lastPaint=-Infinity;paint(performance.now());
 }
 function paint(now){
  paintToday(now);
  paintTraining(now);
  if(!image||now-lastPaint<140)return;
  lastPaint=now;
  if(["profile","values"].includes(root.dataset.statusView)){
   const width=Math.max(1,Math.round(image.clientWidth));
   const height=Math.max(1,Math.round(image.clientHeight));
   if(image.width!==width)image.width=width;
   if(image.height!==height)image.height=height;
  }
  const c=image.getContext("2d");
  c.clearRect(0,0,image.width,image.height);c.imageSmoothingEnabled=false;
  const sprite=typeof currentSprite!=="undefined"?currentSprite:null;
  const action=sprite?.actions?.[TPAct.idle];
  const frame=action?frameImageData(sprite,TPAct.idle,frameIndexAt(action,now,true)):null;
  const bounds=frame&&typeof hubDexBounds==="function"?hubDexBounds(frame):null;
  if(!bounds){
   c.fillStyle="#71818b";c.font="bold "+Math.max(10,Math.min(30,image.height-4))+"px monospace";c.textAlign="center";
   c.fillText("?",image.width/2,image.height/2+10);return;
  }
  if(!buffer)buffer=document.createElement("canvas");
  if(buffer.width!==frame.width)buffer.width=frame.width;
  if(buffer.height!==frame.height)buffer.height=frame.height;
  buffer.getContext("2d").putImageData(frame,0,0);
  const scale=root.dataset.statusView==="profile"?
   Math.min(4,Math.min(image.width,image.height)*.82/Math.hypot(bounds.w,bounds.h)):
   Math.min(4,(image.width-8)/bounds.w,(image.height-8)/bounds.h);
  c.drawImage(buffer,bounds.x,bounds.y,bounds.w,bounds.h,
   (image.width-bounds.w*scale)/2,(image.height-bounds.h*scale)/2,
   bounds.w*scale,bounds.h*scale);
 }
 function draw(now=performance.now()){
  if(!inContext()){hide();return false;}
  const restarting=!active;
  ensure();active=true;root.hidden=false;
  if(restarting||now-lastRefresh>=160){
   lastRefresh=now;render(restarting);
  }
  if(returnFocus){
   const desired=returnFocus;returnFocus="";
   const target=Array.from(root.querySelectorAll("button")).find(
    n=>n.dataset.statusFocus===desired&&!n.disabled
   );
   target?.focus({preventScroll:true});
  }
  paint(now);statusEl.textContent=t(aliases[cardPage]);
  if(raf===null)raf=requestAnimationFrame(time=>{
   raf=null;if(active)draw(time);
  });
  return true;
 }
 return Object.freeze({draw,hide,refresh(){if(active)render(true);}});
})();

function drawCard(now) {
  const count=cardPageCount();if(cardPage>=count)cardPage=0;
  ctx.fillStyle = UI.bgDay;
  ctx.fillRect(0, 0, TP.screen, TP.screen);

  switch (cardPage) {
    case 0: drawCardProfile(now); break;
    case 1: drawCardPersonality(); break;
    case 2: drawCardDaily(); break;
    case 3: drawCardBox(); break;
    case 4: drawCardStats(); break;
    case 5: drawCardMedals(); break;
    case 6: drawCardProgress(); break;
    case 7: drawCardExpedition(); break;
    case 8: window.TPMega.draw(); break;
  }

  const dotsX = TP.cx - (count - 1) * 13;
  for (let i = 0; i < count; i++) {
    const cx = dotsX + i * 26;
    ctx.beginPath();
    ctx.arc(cx, 382, i === cardPage ? 5 : 4, 0, Math.PI * 2);
    if (i === cardPage) { ctx.fillStyle = UI.ink; ctx.fill(); }
    else { ctx.strokeStyle = UI.ink; ctx.lineWidth = 1; ctx.stroke(); }
  }
  ctx.fillStyle = UI.track;
  ctx.textAlign = "center";
  ctx.font = "12px monospace";
  if(window.TPNavBack)window.TPNavBack.draw(ctx,TP.cx-10,396,20);
  else ctx.fillText(fns.backHint(), TP.cx, 400);
}

function drawCardProfile(now) {
  const hasMega=!!window.TPMega?.visible();if(hasMega)ensureSprite(fns.speciesId());
  ctx.textAlign = "center";
  const megaActive = !!window.TPMega?.active();
  const head = megaActive ? window.TPMega.name() : fns.name();
  ctx.fillStyle = UI.ink;
  ctx.font = head.length <= 11 ? "bold 26px monospace" : "bold 20px monospace";
  ctx.fillText(head, TP.cx, head.length <= 11 ? 44 : 50);

  if (fns.hasNick() !== 0) {
    ctx.fillStyle = UI.track;
    ctx.font = "13px monospace";
    ctx.fillText(`(${megaActive ? fns.name() : fns.speciesName()})`, TP.cx, 70);
  }

  if (currentSprite) {
    const a = currentSprite.actions[TPAct.idle];
    if (a) {
      const frame = frameIndexAt(a, now, true);
      const img = frameImageData(currentSprite, TPAct.idle, frame);
      if (img) {
        const s = Math.min(spriteScale(currentSprite, a), 4);
        const w = a.w * s, h = a.h * s;
        frameCanvas.width = a.w; frameCanvas.height = a.h;
        frameCtx.putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(frameCanvas, TP.cx - w / 2, 206 - (a.base > 0 ? a.base : a.h) * s, w, h);
      }
    }
  }

  // The same little flame the idle screen's streak badge uses, not an
  // emoji (which renders differently per platform, or not at all).
  drawFlame(118, 220, 16);
  ctx.textAlign = "left";
  ctx.font = "13px monospace";
  ctx.fillStyle = UI.ink;
  ctx.fillText(fns.streakLine(), 140, 232);

  const bondLabel = fns.bondLabel(), bond = fns.bond();
  ctx.fillText(bondLabel, 60, 262);
  ctx.fillStyle = UI.track;
  roundRect(150, 254, 160, 11, 3); ctx.fill();
  ctx.fillStyle = "#d4527e";
  roundRect(150, 254, 160 * Math.min(bond, 100) / 100, 11, 3); ctx.fill();
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "right";
  ctx.fillText(`${bond}`, 330, 262);

  ctx.textAlign = "center";
  ctx.fillText(fns.infoLine(), TP.cx, hasMega?282:300);
  ctx.fillStyle = UI.track;
  ctx.fillText(fns.renameHint(), TP.cx, hasMega?305:332);
  if(hasMega)window.TPMega.drawProfileLink();

  statusEl.textContent = TPText.status(`Card · ${head} · bond ${bond}`);
}

function personalityColor(kind) {
  return { 0: UI.barOK, 1: UI.barWarn, 2: UI.barBad, 3: "#4C98D9", 4: "#B3C8D9" }[kind] || UI.barOK;
}

function drawPersonalityRecord(x, y, label, value, color) {
  ctx.fillStyle = UI.white;
  roundRect(x, y, 118, 34, 8); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  roundRect(x, y, 118, 34, 8); ctx.stroke();
  // Label and number share one vertical centre (the iOS build had them on
  // mismatched baselines until it was fixed there too).
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.font = "10px monospace";
  ctx.fillText(label, x + 10, y + 17);
  ctx.fillStyle = UI.ink;
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`${value}`, x + 108, y + 17);
  ctx.textBaseline = "alphabetic";
}

function drawCardPersonality() {
  const kind=fns.personalityKind(),col=personalityColor(kind);
  const names=TPText.pick(["Ausgeglichen","Verspielt","Mutig","Ruhig","Gemütlich"],["Balanced","Playful","Brave","Calm","Cozy"]);
  const causes=TPText.pick(["Abwechslung ohne klaren Schwerpunkt.","Geprägt durch regelmäßige Spiele.","Geprägt durch gewonnene Kämpfe.","Geprägt durch Pflege und Zuwendung.","Geprägt durch regelmäßige Erholung."],["Varied activities without a clear focus.","Shaped by regular games.","Shaped by won battles.","Shaped by care and affection.","Shaped by regular rest."]);
  const bonuses=TPText.pick(["Bonus: gelegentlich +1 Freude bei Aktivitäten.","Bonus: gelegentlich +2 Freude nach Spielen.","Bonus: gelegentlich +2 Freude nach Siegen.","Bonus: gelegentlich +1 Bindung bei Pflege.","Bonus: gelegentlich +2 Energie beim Aufwachen."],["Bonus: occasional +1 joy from activities.","Bonus: occasional +2 joy after games.","Bonus: occasional +2 joy after wins.","Bonus: occasional +1 bond from care.","Bonus: occasional +2 energy on waking."]);
  ctx.textAlign="center";ctx.fillStyle=UI.ink;ctx.font="bold 20px monospace";ctx.fillText(fns.personalityTitle(),TP.cx,44);
  ctx.fillStyle=col;roundRect(62,66,342,58,14);ctx.fill();ctx.fillStyle=UI.bgDay;ctx.font="bold 20px monospace";ctx.fillText(names[kind]||names[0],TP.cx,103);
  ctx.fillStyle=UI.ink;ctx.font="12px monospace";ctx.fillText(causes[kind]||causes[0],TP.cx,153);ctx.fillText(bonuses[kind]||bonuses[0],TP.cx,180);
  ctx.fillStyle=UI.track;ctx.fillText(fns.personalityAgeLine(),TP.cx,217);ctx.fillStyle=UI.ink;ctx.font="bold 14px monospace";ctx.fillText(fns.recordsTitle(),TP.cx,246);
  drawPersonalityRecord(52,270,fns.ballRecordLabel(),fns.gameHigh(),UI.barOK);drawPersonalityRecord(178,270,fns.catchRecordLabel(),fns.catchHigh(),UI.barWarn);drawPersonalityRecord(304,270,fns.memoRecordLabel(),fns.memoHigh(),"#4C98D9");
  drawPersonalityRecord(52,314,fns.cleanRecordLabel(),fns.cleanHigh(),UI.barOK);drawPersonalityRecord(178,314,fns.typeRecordLabel(),fns.typeHigh(),"#F3B7D9");drawPersonalityRecord(304,314,fns.statsBattleTitle(),fns.bestBattleStreak(),UI.barBad);
  statusEl.textContent=TPText.pick("Karte · Wesen · ","Card · Personality · ")+(names[kind]||names[0]);
}

function drawStatBar(y, label, value, maxBar, color) {
  ctx.textAlign = "left";
  ctx.fillStyle = UI.ink;
  ctx.font = "12px monospace";
  ctx.fillText(label, 40, y + 15);
  ctx.textAlign = "right";
  ctx.fillText(`${value}`, 396, y + 15);
  ctx.fillStyle = UI.track;
  roundRect(150, y + 4, 160, 11, 3); ctx.fill();
  ctx.fillStyle = color;
  roundRect(150, y + 4, 160 * Math.min(value / maxBar, 1), 11, 3); ctx.fill();
}

function drawCardStats() {
  ctx.textAlign='center';ctx.fillStyle=UI.ink;ctx.font='bold 20px monospace';ctx.fillText(fns.statsBattleTitle(),TP.cx,54);
  drawStatBar(104,fns.statLabel(0),fns.atkStat(),260,UI.barBad);
  drawStatBar(143,fns.statLabel(1),fns.defStat(),260,'#4C98D9');
  drawStatBar(182,fns.statLabel(2),fns.speStat(),260,UI.barWarn);
  ctx.font='12px monospace';ctx.fillStyle=UI.track;ctx.textAlign='center';ctx.fillText('TRAINING',TP.cx,225);
  const ready=!!window.TPTraining?.canStart();
  for(const [x,label,color]of [[44,'Stärke',UI.barBad],[174,'Tempo','#a27819'],[304,'Verteidigung','#397ab6']]){
    ctx.fillStyle=ready?UI.white:UI.track;roundRect(x,232,118,44,10);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=UI.ink;ctx.font='13px monospace';ctx.fillText(label,x+59,260);
  }
  for(const [x,label,color,on]of [[44,fns.wildBattleText(),'#4C98D9',fns.battleCanStart()!==0],[174,'TRAINER',UI.barBad,!!window.TPTrainer?.canOpen()],[304,'ARENA','#39814e',!!window.TPArena?.canOpen()]]){
    ctx.fillStyle=on?color:UI.track;roundRect(x,286,118,44,11);ctx.fill();ctx.fillStyle=UI.bgDay;ctx.font='bold 13px monospace';ctx.fillText(label,x+59,314,110);
  }
  ctx.textAlign='center';ctx.fillStyle=UI.ink;ctx.font='11px monospace';ctx.fillText(fns.battleRecordLine(),103,350);ctx.fillText(fns.battleStreakLine(),233,350);ctx.fillText(fns.battleBestLine(),363,350);
  if(window.TPTraining?.notice){ctx.textAlign='center';ctx.fillStyle=UI.barBad;ctx.font='11px monospace';ctx.fillText(window.TPTraining.notice,TP.cx,371);}
  statusEl.textContent=window.TPWildTeam?.notice||TPText.status('Card · Battle stats');
}
function cardStatsTap(x,y){
  if(y>=232&&y<=276){for(const [left,kind] of [[44,0],[174,2],[304,1]])if(x>=left&&x<=left+118){window.TPTraining?.start(kind);return;}}
  if(x>=304&&x<=422&&y>=286&&y<=330){window.TPArena?.open();return;}
  if(x>=174&&x<=292&&y>=286&&y<=330){window.TPTrainer?.open();return;}
  if(x>=44&&x<=162&&y>=286&&y<=330){if(window.TPWildTeam){window.TPWildTeam.start(false);return;}if(fns.battleCanStart()!==0){Module._tp_battle_start();battleReturn='card';screen='battle';}return;}
}

function drawCardMedals() {
  ctx.textAlign = "center";
  ctx.fillStyle = UI.ink;
  ctx.font = "bold 20px monospace";
  ctx.fillText(fns.medalsLine(), TP.cx, 54);

  const count = fns.medalCount();
  for (let i = 0; i < count; i++) {
    const x = 28 + (i % 2) * 206, y = 104 + Math.floor(i / 2) * 54;
    const got = fns.hasMedal(i) !== 0;
    ctx.fillStyle = got ? UI.barOK : UI.track;
    roundRect(x, y, 196, 44, 10); ctx.fill();
    ctx.fillStyle = got ? UI.bgDay : "#84888a";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "12px monospace";
    ctx.fillText((got ? "✓ " : "") + fns.medalDescription(i), x + 12, y + 22);
    ctx.textBaseline = "alphabetic";
  }
  statusEl.textContent = TPText.status(`Card · ${fns.medalsLine()}`);
}

function drawCardProgress() {
  ctx.textAlign = "center";
  ctx.fillStyle = UI.ink;
  ctx.font = "bold 20px monospace";
  ctx.fillText(fns.progressTitle(), TP.cx, 50);

  ctx.font = "bold 40px monospace";
  ctx.fillText(fns.levelLine(), TP.cx, 106);

  const bx = 93, bw = 280, by = 158, bh = 22;
  ctx.fillStyle = UI.track;
  roundRect(bx, by, bw, bh, 6); ctx.fill();
  const fw = (bw - 4) * fns.minutesIntoLevel() / fns.minutesPerLevel();
  if (fw > 0) { ctx.fillStyle = UI.barOK; roundRect(bx + 2, by + 2, fw, bh - 4, 5); ctx.fill(); }
  ctx.fillStyle = UI.ink;
  ctx.font = "13px monospace";
  ctx.fillText(fns.nextLevelLine(), TP.cx, by + 45);

  ctx.fillStyle = UI.track;
  ctx.fillText(fns.evolutionLabel(), TP.cx, 236);
  const kind = fns.evolutionStatusKind();
  ctx.fillStyle = kind === 1 ? UI.barOK : kind === 2 ? UI.barBad : UI.ink;
  ctx.font = "bold 14px monospace";
  ctx.fillText(fns.evolutionStatus(), TP.cx, 260);

  ctx.fillStyle = fns.careMistakes() > 0 ? UI.barBad : UI.ink;
  ctx.font = "13px monospace";
  ctx.fillText(fns.mistakesLine(), TP.cx, 316);

  statusEl.textContent = TPText.status(`Card · ${fns.levelLine()}`);
}

function cardTap(x, y) {
  if(window.TPMega?.busy)return;
  const hasMega=!!window.TPMega?.visible();
  if(cardPage===0&&hasMega&&x>=75&&x<=391&&y>=324&&y<=368){cardPage=8;return;}
  if(cardPage===8&&hasMega&&window.TPMega.tap(x,y))return;
  if (cardPage === 0 && (hasMega?(y>=290&&y<=318):(y>=320&&y<=344))) {
    // Start from the current nickname rather than blank, so a small fix
    // doesn't mean retyping the whole name.
    Module.ccall("tp_kb_set", null, ["string"], [fns.hasNick() !== 0 ? fns.name() : ""]);
    kbSync();
    screen = "keyboard";
    return;
  }
  if (cardPage === 4) cardStatsTap(x, y);
  if (cardPage === 3) { cardBoxTap(x, y);if(window.TPBoxes?.active)return; }
  if (cardPage === 7) cardExpeditionTap(x, y);
  if (y >= 370 && y <= 394) {
    // Page-dot row: tap left half to go back a page, right half forward.
    if (x < TP.cx) cardPage = (cardPage - 1 + cardPageCount()) % cardPageCount();
    else cardPage = (cardPage + 1) % cardPageCount();
    return;
  }
  // Only the "tap: back" hint itself closes the card now (also swipe up,
  // see main.js's onSwipeV) -- it used to be the entire rest of the page
  // below the buttons, same bug as PetScreen.swift's cardTap had (see its
  // own comment): any stray tap while reading a page, or mid-swipe, closed
  // the whole card.
  if (x >= 66 && x <= 400 && y >= 388 && y <= 420) screen = "idle";
}

// --- Rename keyboard -------------------------------------------------
/* UI01 inline profile name editor */
const renameUI=(function(){
 "use strict";
 const words={
  en:{title:"Rename",name:"Name",apply:"Apply",long:"The name is too long.",
   invalid:"Please use a valid name.",saving:"Saving…",
   failed:"Not saved. Please try again.",reload:"Save state unclear. Please reload.",
   changed:"The Pokémon or game state has changed."},
  de:{title:"Namen ändern",name:"Name",apply:"Übernehmen",long:"Der Name ist zu lang.",
   invalid:"Bitte einen gültigen Namen eingeben.",saving:"Speichern…",
   failed:"Nicht gespeichert. Bitte erneut versuchen.",reload:"Speicherstand unklar. Bitte neu laden.",
   changed:"Pokémon oder Spielzustand hat sich geändert."},
  es:{title:"Cambiar nombre",name:"Nombre",apply:"Aplicar",long:"El nombre es demasiado largo.",
   invalid:"Introduce un nombre válido.",saving:"Guardando…",
   failed:"No se ha guardado. Inténtalo de nuevo.",reload:"Estado de guardado incierto. Recarga.",
   changed:"El Pokémon o la partida ha cambiado."},
  fr:{title:"Renommer",name:"Nom",apply:"Appliquer",long:"Le nom est trop long.",
   invalid:"Veuillez saisir un nom valide.",saving:"Enregistrement…",
   failed:"Non enregistré. Réessayez.",reload:"Sauvegarde incertaine. Rechargez.",
   changed:"Le Pokémon ou la partie a changé."}
 };
 if(window.TPText?.registerLocale){
  for(const code of ["en","de","es","fr"]){
   TPText.registerLocale(code,Object.fromEntries(
    Object.entries(words[code]).map(([key,value])=>["nameEditor."+key,value])
   ));
  }
 }
 const t=key=>TPText.t("nameEditor."+key);

 let root=null,input=null,applyButton=null,notice=null;
 let active=false,busy=false,fatal=false,composing=false,edited=false;
 let mounted=false,wantsFocus=false;
 let owner=null,identity=null,original="",initial="",draft="",message="";
 function validateName(value,initial,capacity){
  if(typeof value!=="string"||!Number.isInteger(capacity)||capacity<1||capacity>255)
   return "invalid";
  if(/[\u0000-\u001f\u007f]/u.test(value))return "invalid";
  for(let i=0;i<value.length;i++){
   const code=value.charCodeAt(i);
   if(code>=0xd800&&code<=0xdbff){
    const next=value.charCodeAt(++i);
    if(!(next>=0xdc00&&next<=0xdfff))return "invalid";
   }else if(code>=0xdc00&&code<=0xdfff)return "invalid";
  }
  if(new TextEncoder().encode(value).length>capacity)return "long";
  const hangul=/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/u.test(value);
  if(!hangul&&Array.from(value).length>11&&value!==initial)return "long";
  return "";
 }
 function node(tag,value,cls){
  const n=document.createElement(tag);
  if(value!==undefined)n.textContent=value;
  if(cls)n.className=cls;
  return n;
 }
 function careIdentity(){
  try{
   const state=TPCollection.read();
   const mon=state.mons.find(item=>item.id===state.active);
   return mon?{id:mon.id,life:mon.data.lifeToken}:null;
  }catch(_){return null;}
 }
 function sameIdentity(){
  const current=careIdentity();
  return Module===owner&&identity&&current&&
   current.id===identity.id&&current.life===identity.life;
 }
 function blocked(){
  return tpSaveReplacing||!!window.TPCollection?.busy||
   !!window.TPCollection?.blocked||!!window.TPMega?.busy||
   !!window.TPExpeditions?.busy||!!window.TPTraining?.busy;
 }
 function coreName(){return fns.hasNick()!==0?fns.name():"";}

 function finish(notify=true){
  active=false;mounted=false;wantsFocus=false;
  if(root)root.hidden=true;
  input?.blur();
  if(notify)statusUI.refresh();
 }
 function cancel(notify=true){
  if(busy||fatal||blocked())return;
  if(Module===owner){
   Module.ccall("tp_kb_set",null,["string"],[original]);kbSync();
  }
  finish(notify);
 }
 function begin(){
  if(active)return;
  ensure();
  owner=Module;identity=careIdentity();original=coreName();
  initial=fns.kbText();draft=initial;message="";
  busy=fatal=composing=edited=false;
  active=true;mounted=false;wantsFocus=true;
  input.value=draft;root.hidden=false;update();
 }
 function mount(host){
  ensure();host.append(root);root.hidden=false;mounted=true;update();
 }
 function focusInput(){
  if(!active||!mounted||!wantsFocus||!root.isConnected)return;
  wantsFocus=false;
  input.focus({preventScroll:true});input.select();
 }
 function syncDraft(){
  if(!active||busy)return;
  draft=input.value;edited=true;message="";
  if(!composing&&!validateName(draft,initial,fns.nickCapacity())){
   Module.ccall("tp_kb_set",null,["string"],[draft]);
   kbSync();
  }
  update();
 }
 async function commit(){
  if(!active||busy||fatal||blocked()||composing)return;
  draft=input.value;
  const invalid=validateName(draft,initial,fns.nickCapacity());
  if(invalid){edited=true;update();return;}
  if(!sameIdentity()||!window.TPCollectionGame?.supported||
     fns.isEgg()!==0||fns.ceremony()||fns.evolvingNow()){
   message=t("changed");update();return;
  }
  if(draft===original){cancel();return;}
  busy=true;message="";update();
  let renamed=false;
  try{
   Module.ccall("tp_kb_set",null,["string"],[draft]);kbSync();
   if(fns.kbText()!==draft)throw Error("DRAFT_MISMATCH");
   Module.ccall("tp_rename",null,["string"],[draft]);
   renamed=true;
   cardPage=0;screen="card";
   await TPCollectionGame.ensureCurrent();
   if(!sameIdentity())throw Error("CARE_IDENTITY_CHANGED");
   const state=TPCollection.read();
   const mon=state.mons.find(item=>item.id===state.active);
   const bytes=await loadSave();
   if(!bytes)throw Error("SAVE_MISSING");
   const saved=TPStoreTools.parseLegacy(new Uint8Array(bytes));
   const savedName=saved.values.get("nick")?.value||"";
   if(coreName()!==draft||mon?.nickname!==draft||savedName!==draft)
    throw Error("NAME_SAVE_NOT_CONFIRMED");
   busy=false;finish();
  }catch(error){
   if(!window.TPCollection?.blocked&&sameIdentity()){
    if(renamed)Module.ccall("tp_rename",null,["string"],[original]);
    Module.ccall("tp_kb_set",null,["string"],[draft]);kbSync();
    cardPage=0;screen="card";message=t("failed");
   }else{
    fatal=true;message=t("reload");
   }
   if(window.TPDiagnostics?.record)TPDiagnostics.record("rename",error);
  }finally{
   busy=false;if(active)update();
  }
 }

 function ensure(){
  if(root)return;
  root=node("div");root.id="tp-inline-name";root.hidden=true;
  root.setAttribute("role","group");
  root.setAttribute("aria-label",t("title"));
  input=node("input");input.type="text";input.dataset.nameInput="";
  input.setAttribute("aria-label",t("name"));
  input.setAttribute("autocomplete","off");
  input.setAttribute("autocapitalize","none");
  input.setAttribute("autocorrect","off");
  input.setAttribute("inputmode","text");
  input.setAttribute("enterkeyhint","done");
  input.spellcheck=false;
  input.addEventListener("compositionstart",()=>{composing=true;update();});
  input.addEventListener("compositionend",()=>{composing=false;syncDraft();});
  input.addEventListener("input",syncDraft);
  input.addEventListener("keydown",event=>{
   if(event.key==="Enter"&&!composing&&!event.isComposing){
    event.preventDefault();event.stopPropagation();void commit();
   }
  });
  notice=node("p",undefined,"tp-inline-name-notice");
  notice.setAttribute("role","alert");
  applyButton=node("button",t("apply"));applyButton.type="button";
  applyButton.dataset.nameApply="";
  applyButton.addEventListener("click",()=>{void commit();});
  root.append(input,notice,applyButton);
  root.addEventListener("keydown",event=>{
   if(event.key==="Escape"&&!composing&&!event.isComposing){
    event.preventDefault();event.stopPropagation();cancel();
   }
  });
 }
 function update(){
  if(!active)return;
  const invalid=validateName(draft,initial,fns.nickCapacity());
  input.disabled=busy||fatal;
  applyButton.disabled=busy||fatal||blocked()||composing||!!invalid;
  notice.textContent=busy?t("saving"):message||
   (edited&&!composing&&invalid?t(invalid==="long"?"long":"invalid"):"");
 }
 function draw(){
  // Existing callers enter through "keyboard"; they now reach the same inline UI.
  if(screen==="keyboard"){
   cardPage=0;screen="card";
   if(!active)begin();
   statusUI.draw(performance.now());
  }
  update();
 }
 return Object.freeze({
  begin,mount,focusInput,cancel,draw,
  refresh:update,
  get active(){return active;},
  get busy(){return busy;},
  get blocked(){return fatal;},
  get mounted(){return active&&mounted&&!!root?.isConnected;}
 });
})();
function drawKeyboard(){renameUI.draw();}
function kbSync(){nameDraft=fns.kbText();}
function keyboardTap(x,y){return false;}
