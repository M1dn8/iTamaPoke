/* Shared battle-control labels; rendering does not own combat rules. */
(function(root){
 'use strict';
 const locales={
 "en": {
  "fight": "Fight",
  "pokemon": "Pokémon",
  "heal": "Heal",
  "giveUp": "Give up",
  "quick": "Quick",
  "dodge": "Dodge",
  "heavy": "Heavy",
  "back": "Back"
 },
 "de": {
  "fight": "Kampf",
  "pokemon": "Pokémon",
  "heal": "Heilung",
  "giveUp": "Aufgeben",
  "quick": "Schnell",
  "dodge": "Ausweichen",
  "heavy": "Kräftig",
  "back": "Zurück"
 },
 "es": {
  "fight": "Luchar",
  "pokemon": "Pokémon",
  "heal": "Curar",
  "giveUp": "Rendirse",
  "quick": "Rápido",
  "dodge": "Esquivar",
  "heavy": "Fuerte",
  "back": "Volver"
 },
 "fr": {
  "fight": "Combat",
  "pokemon": "Pokémon",
  "heal": "Soigner",
  "giveUp": "Abandonner",
  "quick": "Rapide",
  "dodge": "Esquiver",
  "heavy": "Puissant",
  "back": "Retour"
 }
};
 for(const code of ['en','de','es','fr'])
  root.TPText.registerLocale(code,Object.fromEntries(
   Object.entries(locales[code]).map(([key,value])=>['battleControls.'+key,value])
  ));
 root.TPBattleControlsText=Object.freeze({
  t:key=>root.TPText.t('battleControls.'+key)
 });
})(typeof globalThis!=='undefined'?globalThis:this);
