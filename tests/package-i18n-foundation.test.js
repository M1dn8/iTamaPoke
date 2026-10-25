'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

let lang=3;
const elements=Object.fromEntries([
 'spriteLoad','dexEntryLoad','cryLoad',
 'saveExport','saveImport','gameReset'
].map(id=>[id,{textContent:''}]));
const intervals=[];
const c={
 fns:{language:()=>lang},
 document:{
  documentElement:{lang:'de'},
  getElementById:id=>elements[id]||null
 },
 setInterval:fn=>{intervals.push(fn);return intervals.length;}
};
c.window=c;
vm.createContext(c);
vm.runInContext(
 fs.readFileSync('browser_ver/web/de-ui.js','utf8'),c,
 {filename:'de-ui.js'}
);
const T=c.TPText;
let checks=0;
function eq(actual,expected){assert.deepEqual(actual,expected);checks++;}

eq(JSON.stringify(T.coreLocales),
 JSON.stringify(['es','en','fr','de','it','pt','ko','en']));

const englishKeys=Object.keys(T.catalogue('en')).sort();
for(const code of ['de','en','es','fr']){
 eq(JSON.stringify(Object.keys(T.catalogue(code)).sort()),
    JSON.stringify(englishKeys));
 eq(Object.isFrozen(T.catalogue(code)),true);
}

const expected=[
 [0,'es','Cargar gráficos…','Cargar partida…'],
 [1,'en','Load sprites…','Load save…'],
 [2,'fr','Charger les graphismes…','Charger une sauvegarde…'],
 [3,'de','Grafiken laden…','Spielstand laden…'],
 [4,'it','Load sprites…','Load save…'],
 [5,'pt','Load sprites…','Load save…'],
 [6,'ko','Load sprites…','Load save…'],
 [7,'en','Load sprites…','Load save…']
];
for(const [index,code,sprites,save] of expected){
 lang=index;
 T.refresh();
 eq(T.language(),code);
 eq(c.document.documentElement.lang,code);
 eq(elements.spriteLoad.textContent,sprites);
 eq(elements.saveImport.textContent,save);
}

lang=3;
eq(T.pick('Deutsch','English'),'Deutsch');
eq(T.status('Catch · score 5 · misses 1/3'),
 'Fangen · Punkte 5 · Fehler 1/3');
const types=T.types(['','NORMAL','FIRE']);
eq(types[2],'FEUER');
lang=1;
eq(T.pick('Deutsch','English'),'English');
eq(types[2],'FIRE');
eq(T.status('Play menu'),'Play menu');

eq(T.t('assets.count',{count:6},'fr'),'6 fichiers');
eq(T.t('assets.count',{count:0},'es'),'0 archivos');
eq(T.t('assets.count',{count:'$&'},'en'),'$& files');

T.clearMissing();
eq(T.t('assets.count',{},'en'),'{count} files');
eq(T.missingKeys().includes('en:assets.count:count'),true);
eq(T.t('unknown.key',{},'de'),'unknown.key');
eq(T.missingKeys().includes('de:unknown.key'),true);

T.clearMissing();
eq(T.t('common.back',{},'it'),'Back');
eq(T.missingKeys().includes('it:common.back'),true);

T.registerLocale('nl',{
 'common.back':'Terug',
 'assets.count':'{count} bestanden'
});
eq(T.t('common.back',{},'nl'),'Terug');
eq(T.t('assets.count',{count:6},'nl'),'6 bestanden');
eq(T.t('common.sound',{},'nl'),'Sound');

assert.throws(()=>T.registerLocale('xx',{
 'assets.count':'{different} files'
}),/placeholders/);checks++;
assert.throws(()=>T.registerLocale('xx',{
 'not.registered':'Unknown'
}),/English/);checks++;
assert.throws(()=>T.registerLocale('bad code',{}),/locale/);checks++;
assert.throws(()=>T.registerLocale('xx',{'common.back':7}),/translation/);checks++;
eq(T.catalogue('xx'),null);

T.registerLocale('en',{'test.literal':'Hello {name}'});
T.registerLocale('fr',{'test.literal':'Bonjour {name}'});
eq(T.t('test.literal',{name:'<script>literal</script>'},'fr'),
 'Bonjour <script>literal</script>');

lang=3;
T.refresh();
T.registerLocale('de',{'files.sprites':'Testbeschriftung'});
T.refresh();
eq(elements.spriteLoad.textContent,'Testbeschriftung');

lang=99;
eq(T.language(),'en');

const startup={
 document:{getElementById:()=>null},
 setInterval(){}
};
startup.window=startup;
vm.createContext(startup);
vm.runInContext(fs.readFileSync('browser_ver/web/de-ui.js','utf8'),startup);
eq(startup.TPText.language(),'de');
eq(startup.TPText.t('common.back'),'Zurück');

console.log(
 'Browser i18n foundation passed: '+checks+' assertions; '+
 'core index mapping, four complete pilot catalogues, English fallback, '+
 'placeholders, missing-key reporting, registration, live file labels '+
 'and legacy TPText compatibility. No persistence/browser-layout claim.'
);
