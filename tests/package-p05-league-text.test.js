 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const catalogues={},registrationOrder=[];
let locale='de';
const context={
 TPText:{
  registerLocale(code,messages){
   assert(!catalogues[code]);
   if(code!=='en'){
    for(const key of Object.keys(messages)){
     if(!catalogues.en||!Object.hasOwn(catalogues.en,key))
      throw Error('Register English text first: '+key);
    }
   }
   registrationOrder.push(code);
   catalogues[code]=messages;
  },
  t(key,params={}){
   const value=catalogues[locale][key];
   assert.equal(typeof value,'string','Missing '+locale+': '+key);
   return value.replace(/\{([^}]+)\}/g,(_,name)=>{
    assert(Object.hasOwn(params,name),'Missing parameter '+name);
    return String(params[name]);
   });
  }
 }
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(
 'browser_ver/web/league-team-text.js','utf8'
),context);

assert.deepEqual(registrationOrder,['en','de','es','fr']);
assert.throws(()=>context.TPText.registerLocale('it',{
 'leagueTeam.unregisteredTestKey':'Test'
}),/Register English text first/);
const keys=Object.keys(catalogues.de).sort();
const parameters=value=>Array.from(value.matchAll(/\{([^}]+)\}/g),
 match=>match[1]).sort();
for(const code of ['de','en','es','fr']){
 assert.deepEqual(Object.keys(catalogues[code]).sort(),keys);
 for(const key of keys){
  assert(catalogues[code][key].trim());
  assert.deepEqual(parameters(catalogues[code][key]),
   parameters(catalogues.de[key]));
 }
 locale=code;
 assert(context.TPLeagueText.t('activeRests',{count:4}).includes('4 / 5'));
 assert(context.TPLeagueText.t('member',{current:2,total:6}).includes('2 / 6'));
 assert.equal(context.TPLeagueText.note('Keine Heilung'),
  catalogues[code]['leagueTeam.noHeal']);
 assert.equal(context.TPLeagueText.error({code:'LEAGUE_ROSTER_CHANGED'}),
  catalogues[code]['leagueTeam.boundChanged']);
}
assert.equal(context.TPLeagueText.error(Error('P05c intentional quota')),
 'P05c intentional quota');
assert.equal(context.TPLeagueText.note(''),'');

console.log('P05c language additions passed: '+keys.length+
 ' identical keys across de/en/es/fr, matching parameters, registry lookup, '+
 'native-note mapping and localized domain errors. Historical league UI '+
 'is not claimed as fully translated.');
