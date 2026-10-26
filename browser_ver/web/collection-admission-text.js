(function(root){
 'use strict';
 const locales={
 "en": {
  "notice": "Take in the waiting Pokémon",
  "title": "Take in Pokémon",
  "member": "{name} · Lv. {level}",
  "ask": "Your team has six members. Add this Pokémon to your team?",
  "choose": "Which team member should be replaced?",
  "team": "Add to team",
  "box": "Send to a box",
  "accept": "Take in now",
  "care": "Care Pokémon — fixed",
  "later": "Later",
  "boxes": "Open boxes",
  "waiting": "All boxes are full. This Pokémon will wait until space is available.",
  "saving": "Saving admission…",
  "saved": "Pokémon taken in and saved.",
  "failed": "Admission was not saved. Please try again.",
  "reload": "Save confirmation is unclear. Please reload.",
  "reloadButton": "Reload app",
  "blocked": "A Pokémon is waiting. Complete its admission before another capture or join.",
  "core": "Please load the current game core.",
  "noCatch": "No wild Pokémon can be caught here.",
  "unreadable": "Collection or admission data cannot be read. No capture is allowed.",
  "capturePending": "Capture confirmed. The Pokémon is waiting to be taken in.",
  "captureFailed": "Capture was not saved. Please try again."
 },
 "de": {
  "notice": "Wartendes Pokémon aufnehmen",
  "title": "Pokémon aufnehmen",
  "member": "{name} · Lv. {level}",
  "ask": "Dein Team hat sechs Mitglieder. Dieses Pokémon ins Team aufnehmen?",
  "choose": "Welches Teammitglied soll ersetzt werden?",
  "team": "Ins Team aufnehmen",
  "box": "In einer Box ablegen",
  "accept": "Jetzt aufnehmen",
  "care": "Pflege-Pokémon — fest",
  "later": "Später",
  "boxes": "Boxen öffnen",
  "waiting": "Alle Boxen sind voll. Dieses Pokémon wartet, bis ein Platz frei ist.",
  "saving": "Aufnahme wird gespeichert …",
  "saved": "Pokémon aufgenommen und gespeichert.",
  "failed": "Aufnahme nicht gespeichert. Bitte erneut versuchen.",
  "reload": "Speicherabschluss unklar. Bitte neu laden.",
  "reloadButton": "App neu laden",
  "blocked": "Ein Pokémon wartet. Erst seine Aufnahme abschließen, bevor ein weiterer Fang oder Anschluss möglich ist.",
  "core": "Bitte den aktuellen Spielkern laden.",
  "noCatch": "Hier ist kein wildes Pokémon fangbar.",
  "unreadable": "Sammlungs- oder Aufnahmedaten sind nicht lesbar. Kein Fang möglich.",
  "capturePending": "Fang bestätigt. Das Pokémon wartet auf seine Aufnahme.",
  "captureFailed": "Fang nicht gespeichert. Bitte erneut versuchen."
 },
 "es": {
  "notice": "Recibir al Pokémon que espera",
  "title": "Recibir Pokémon",
  "member": "{name} · Nv. {level}",
  "ask": "Tu equipo tiene seis miembros. ¿Quieres incorporar este Pokémon?",
  "choose": "¿Qué miembro del equipo quieres sustituir?",
  "team": "Incorporar al equipo",
  "box": "Enviar a una caja",
  "accept": "Recibir ahora",
  "care": "Pokémon de crianza — fijo",
  "later": "Más tarde",
  "boxes": "Abrir cajas",
  "waiting": "Todas las cajas están llenas. Este Pokémon esperará hasta que haya espacio.",
  "saving": "Guardando la incorporación…",
  "saved": "Pokémon recibido y guardado.",
  "failed": "No se ha guardado la incorporación. Inténtalo de nuevo.",
  "reload": "La confirmación del guardado no está clara. Vuelve a cargar.",
  "reloadButton": "Recargar aplicación",
  "blocked": "Hay un Pokémon esperando. Completa su incorporación antes de otra captura o unión.",
  "core": "Carga el núcleo actual del juego.",
  "noCatch": "Aquí no hay un Pokémon salvaje que se pueda capturar.",
  "unreadable": "No se pueden leer los datos de colección o incorporación. No se permite capturar.",
  "capturePending": "Captura confirmada. El Pokémon espera su incorporación.",
  "captureFailed": "No se ha guardado la captura. Inténtalo de nuevo."
 },
 "fr": {
  "notice": "Accueillir le Pokémon en attente",
  "title": "Accueillir un Pokémon",
  "member": "{name} · N. {level}",
  "ask": "Ton équipe compte six membres. Ajouter ce Pokémon à ton équipe ?",
  "choose": "Quel membre de l’équipe remplacer ?",
  "team": "Ajouter à l’équipe",
  "box": "Envoyer dans une boîte",
  "accept": "Accueillir maintenant",
  "care": "Pokémon élevé — fixe",
  "later": "Plus tard",
  "boxes": "Ouvrir les boîtes",
  "waiting": "Toutes les boîtes sont pleines. Ce Pokémon attendra qu’une place se libère.",
  "saving": "Enregistrement de l’accueil…",
  "saved": "Pokémon accueilli et sauvegardé.",
  "failed": "L’accueil n’a pas été sauvegardé. Réessaie.",
  "reload": "La confirmation de sauvegarde est incertaine. Recharge l’application.",
  "reloadButton": "Recharger l’application",
  "blocked": "Un Pokémon attend. Termine son accueil avant une nouvelle capture ou arrivée.",
  "core": "Charge le moteur de jeu actuel.",
  "noCatch": "Aucun Pokémon sauvage ne peut être capturé ici.",
  "unreadable": "Les données de collection ou d’accueil sont illisibles. Capture impossible.",
  "capturePending": "Capture confirmée. Le Pokémon attend d’être accueilli.",
  "captureFailed": "La capture n’a pas été sauvegardée. Réessaie."
 }
};
 let ready=false;
 function register(){
  if(ready)return;
  for(const code of ['en','de','es','fr'])
   root.TPText.registerLocale(code,Object.fromEntries(
    Object.entries(locales[code]).map(([key,value])=>['admission.'+key,value])
   ));
  ready=true;
 }
 function t(key,params={}){register();return root.TPText.t('admission.'+key,params);}
 root.TPAdmissionText=Object.freeze({t});
 if(root.TPText?.registerLocale)register();
})(typeof globalThis!=='undefined'?globalThis:this);
