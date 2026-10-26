/* P05c additions use the existing language registry.
 * Historical league strings are not claimed as fully translated here.
 */
(function(root){
 'use strict';
 const catalogues={
 "de": {
  "core": "Bitte den aktuellen Spielkern und die Kampfansicht laden.",
  "contextChanged": "Liga-Startkontext geändert.",
  "contextReload": "Spielkern oder Region geändert – bitte neu laden.",
  "reload": "Speicherabschluss unklar – bitte App neu laden.",
  "replaceTeam": "Gespeicherten Teamlauf bewusst durch einen neuen Teamlauf ersetzen?",
  "replaceSingle": "Vorhandenen Einzellauf durch einen neuen Einzellauf ersetzen?",
  "activeRests": "Aktives Mitglied · Heilungen: {count} / 5",
  "budget": "Sammlungsteam · je Mitglied fünf Heilungen im Lauf.",
  "newTeam": "Neuen Teamlauf starten",
  "newSingle": "Neuen Einzellauf starten",
  "startTeam": "Mit Sammlungsteam starten",
  "startSingle": "Einzellauf starten",
  "giveUp": "Aufgeben",
  "member": "Teammitglied {current} / {total}",
  "startLevel": "{species} · Start-Lv. {level}{shiny}",
  "shiny": " · SCHILLERND",
  "memberWins": "Siege {wins} · verbuchte Level +{gains}{winner}",
  "lastWinner": " · letzter Sieger",
  "teamTitle": "Teamtitel {sequence} · {date}",
  "teamSummary": "Eingefrorenes Team · {count} Mitglieder · Titel gesamt {wins}",
  "hallStatus": "Ruhmeshalle · eingefrorenes Siegerteam",
  "noHeal": "Keine Heilung",
  "counterReady": "Konter bereit",
  "enemyDodged": "Gegner ausgewichen",
  "playerDodged": "Ausgewichen",
  "teamUnavailable": "Kein gültiges Liga-Team verfügbar.",
  "careChanged": "Die Pflegebindung passt nicht mehr zu diesem Lauf.",
  "boundChanged": "Gebundene Mitglieder fehlen oder ihr gespeicherter Fortschritt passt nicht mehr.",
  "statsUnavailable": "Kampfwerte eines Liga-Mitglieds fehlen oder sind nicht verwendbar.",
  "transactionRefused": "Der Liga-Zustand hat sich geändert. Die Aktion wurde nicht übernommen.",
  "actionRefused": "Ligaaktion gerade nicht möglich.",
  "saveFailed": "Ligaaktion nicht gespeichert. Bitte erneut versuchen.",
  "busy": "Eine andere Aktion wird noch abgeschlossen."
 },
 "en": {
  "core": "Please load the current game core and battle view.",
  "contextChanged": "The league start context changed.",
  "contextReload": "The game core or region changed — please reload.",
  "reload": "Save confirmation is unclear — please reload the app.",
  "replaceTeam": "Replace the saved team run with a new team run?",
  "replaceSingle": "Replace the existing solo run with a new solo run?",
  "activeRests": "Active member · heals: {count} / 5",
  "budget": "Collection team · five heals per member for the run.",
  "newTeam": "Start a new team run",
  "newSingle": "Start a new solo run",
  "startTeam": "Start with collection team",
  "startSingle": "Start solo run",
  "giveUp": "Give up",
  "member": "Team member {current} / {total}",
  "startLevel": "{species} · starting Lv. {level}{shiny}",
  "shiny": " · SHINY",
  "memberWins": "Wins {wins} · recorded levels +{gains}{winner}",
  "lastWinner": " · final winner",
  "teamTitle": "Team title {sequence} · {date}",
  "teamSummary": "Frozen team · {count} members · total titles {wins}",
  "hallStatus": "Hall of Fame · frozen winning team",
  "noHeal": "No healing",
  "counterReady": "Counter ready",
  "enemyDodged": "Opponent dodged",
  "playerDodged": "Dodged",
  "teamUnavailable": "No valid league team is available.",
  "careChanged": "The care binding no longer matches this run.",
  "boundChanged": "Bound members are missing or their recorded progress no longer matches.",
  "statsUnavailable": "A league member's battle stats are missing or unusable.",
  "transactionRefused": "The league state changed. The action was not applied.",
  "actionRefused": "The league action is not available right now.",
  "saveFailed": "The league action was not saved. Please try again.",
  "busy": "Another action is still being completed."
 },
 "es": {
  "core": "Carga el núcleo actual del juego y la vista de combate.",
  "contextChanged": "El contexto de inicio de la Liga ha cambiado.",
  "contextReload": "El núcleo del juego o la región han cambiado; vuelve a cargar.",
  "reload": "La confirmación del guardado no está clara; vuelve a cargar la aplicación.",
  "replaceTeam": "¿Sustituir el recorrido de equipo guardado por uno nuevo?",
  "replaceSingle": "¿Sustituir el recorrido individual existente por uno nuevo?",
  "activeRests": "Miembro activo · curaciones: {count} / 5",
  "budget": "Equipo de la colección · cinco curaciones por miembro durante el recorrido.",
  "newTeam": "Iniciar nuevo recorrido de equipo",
  "newSingle": "Iniciar nuevo recorrido individual",
  "startTeam": "Iniciar con el equipo de la colección",
  "startSingle": "Iniciar recorrido individual",
  "giveUp": "Abandonar",
  "member": "Miembro del equipo {current} / {total}",
  "startLevel": "{species} · Nv. inicial {level}{shiny}",
  "shiny": " · VARIOCOLOR",
  "memberWins": "Victorias {wins} · niveles registrados +{gains}{winner}",
  "lastWinner": " · vencedor final",
  "teamTitle": "Título de equipo {sequence} · {date}",
  "teamSummary": "Equipo fijado · {count} miembros · títulos totales {wins}",
  "hallStatus": "Hall de la Fama · equipo vencedor fijado",
  "noHeal": "Sin curación",
  "counterReady": "Contraataque listo",
  "enemyDodged": "El rival ha esquivado",
  "playerDodged": "Esquivado",
  "teamUnavailable": "No hay un equipo válido para la Liga.",
  "careChanged": "La identidad de crianza ya no coincide con este recorrido.",
  "boundChanged": "Faltan miembros vinculados o su progreso registrado ya no coincide.",
  "statsUnavailable": "Faltan estadísticas de combate de un miembro o no son utilizables.",
  "transactionRefused": "El estado de la Liga ha cambiado. No se ha aplicado la acción.",
  "actionRefused": "La acción de la Liga no está disponible ahora.",
  "saveFailed": "No se ha guardado la acción de la Liga. Inténtalo de nuevo.",
  "busy": "Todavía se está completando otra acción."
 },
 "fr": {
  "core": "Charge le moteur de jeu actuel et la vue de combat.",
  "contextChanged": "Le contexte de départ de la Ligue a changé.",
  "contextReload": "Le moteur de jeu ou la région a changé ; recharge l’application.",
  "reload": "La confirmation de sauvegarde est incertaine ; recharge l’application.",
  "replaceTeam": "Remplacer le parcours d’équipe sauvegardé par un nouveau parcours ?",
  "replaceSingle": "Remplacer le parcours individuel existant par un nouveau parcours ?",
  "activeRests": "Membre actif · soins : {count} / 5",
  "budget": "Équipe de la collection · cinq soins par membre pour le parcours.",
  "newTeam": "Nouveau parcours d’équipe",
  "newSingle": "Nouveau parcours individuel",
  "startTeam": "Jouer avec l’équipe de la collection",
  "startSingle": "Démarrer un parcours individuel",
  "giveUp": "Abandonner",
  "member": "Membre de l’équipe {current} / {total}",
  "startLevel": "{species} · N. initial {level}{shiny}",
  "shiny": " · CHROMATIQUE",
  "memberWins": "Victoires {wins} · niveaux enregistrés +{gains}{winner}",
  "lastWinner": " · vainqueur final",
  "teamTitle": "Titre d’équipe {sequence} · {date}",
  "teamSummary": "Équipe figée · {count} membres · titres au total {wins}",
  "hallStatus": "Panthéon · équipe victorieuse figée",
  "noHeal": "Aucun soin",
  "counterReady": "Contre-attaque prête",
  "enemyDodged": "L’adversaire a esquivé",
  "playerDodged": "Esquivé",
  "teamUnavailable": "Aucune équipe valide pour la Ligue.",
  "careChanged": "L’identité du Pokémon élevé ne correspond plus à ce parcours.",
  "boundChanged": "Des membres liés manquent ou leur progression enregistrée ne correspond plus.",
  "statsUnavailable": "Les statistiques de combat d’un membre sont absentes ou inutilisables.",
  "transactionRefused": "L’état de la Ligue a changé. L’action n’a pas été appliquée.",
  "actionRefused": "L’action de la Ligue n’est pas disponible actuellement.",
  "saveFailed": "L’action de la Ligue n’a pas été sauvegardée. Réessaie.",
  "busy": "Une autre action est encore en cours."
 }
};
 let registered=false;
 function register(){
  if(registered)return;
  if(!root.TPText||typeof root.TPText.registerLocale!=='function')
   throw Error('LEAGUE_TEXT_REGISTRY_UNAVAILABLE');
  // The registry requires English base keys before any translation.
  for(const code of ['en','de','es','fr']){
   const messages=catalogues[code];
   root.TPText.registerLocale(code,Object.fromEntries(
    Object.entries(messages).map(([key,value])=>['leagueTeam.'+key,value])
   ));
  }
  registered=true;
 }
 function t(key,params={}){
  register();
  return root.TPText.t('leagueTeam.'+key,params);
 }
 const notes=Object.freeze({
  'Keine Heilung':'noHeal','Konter bereit':'counterReady',
  'Gegner ausgewichen':'enemyDodged','Ausgewichen':'playerDodged'
 });
 const errors=Object.freeze({
  INVALID_REGION:'teamUnavailable',INVALID_LEAGUE_START:'teamUnavailable',
  LEAGUE_COLLECTION_MISSING:'teamUnavailable',
  LEAGUE_TEAM_UNAVAILABLE:'teamUnavailable',
  LEAGUE_CARE_BINDING_CHANGED:'careChanged',
  LEAGUE_ROSTER_CHANGED:'boundChanged',
  LEAGUE_STORED_PROGRESS_CHANGED:'boundChanged',
  LEAGUE_STATS_UNAVAILABLE:'statsUnavailable',
  LEAGUE_CORE_UNAVAILABLE:'core',COLLECTION_NOT_BOUND:'core',
  RELOAD_REQUIRED:'reload',BUSY:'busy',
  NATIVE_LEAGUE_WIN_REFUSED:'transactionRefused',
  LEAGUE_WIN_PLAN_CHANGED:'transactionRefused',
  LEAGUE_TRANSACTION_CHANGED:'transactionRefused',
  LEAGUE_PREPARED_STATE_CHANGED:'transactionRefused',
  LEAGUE_CHECKPOINT_REQUIRED:'transactionRefused',
  LEAGUE_ACTIVE_RUN_REQUIRED:'transactionRefused',
  LEAGUE_RUN_UNAVAILABLE:'transactionRefused',
  LEAGUE_RUN_POINTER_INVALID:'transactionRefused',
  NATIVE_BEGIN_REFUSED:'actionRefused',
  NATIVE_STAGE_REFUSED:'saveFailed',WRITE_NOT_CONFIRMED:'saveFailed'
 });
 root.TPLeagueText=Object.freeze({
  t,
  note:value=>notes[value]?t(notes[value]):value||'',
  error:value=>errors[value?.code]?t(errors[value.code]):
   value?.message||String(value)
 });
 if(root.TPText&&typeof root.TPText.registerLocale==='function')register();
})(typeof globalThis!=='undefined'?globalThis:this);
