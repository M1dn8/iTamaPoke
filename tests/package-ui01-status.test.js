const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('browser_ver/web/card.js','utf8');
const a=source.indexOf('/* UI01 care status: four information views */');
const b=source.indexOf('function drawCard(now)',a);
assert(a>=0&&b>a);
const context={
 console,document:{getElementById(){return null;},documentElement:{}},
 setInterval(){return 0;},clearInterval(){}
};
context.window=context;vm.createContext(context);
vm.runInContext(fs.readFileSync('browser_ver/web/de-ui.js','utf8'),context);
vm.runInContext(source.slice(a,b),context);
assert.equal(vm.runInContext('typeof statusUI.draw',context),'function');
const keys=Object.keys(context.TPText.catalogue('en'))
 .filter(key=>key.startsWith('careStatus.')).sort();
assert(keys.length>0);
for(const code of ['en','de','es','fr']){
 assert.deepEqual(Object.keys(context.TPText.catalogue(code))
  .filter(key=>key.startsWith('careStatus.')).sort(),keys);
}
console.log('Statusansicht: Startprüfung und vier Sprachkataloge bestanden.');


// Profile day singular and plural
const dayFunctionMatch=/function dayText\(count\)\{[\s\S]*?\n \}/.exec(source);
assert(dayFunctionMatch,'Real day formatter must exist');
context.t=(key,params)=>context.TPText.t('careStatus.'+key,params,'de');
vm.runInContext(dayFunctionMatch[0],context);
for(const [count,expected]of [
 [0,'0 Tage'],[1,'1 Tag'],[2,'2 Tage'],[3,'3 Tage'],[4,'4 Tage']
]){
 assert.equal(context.dayText(count),expected);
}
console.log('Profil: echte Tagesformatierung für Einzahl und Mehrzahl bestanden.');


// Values scale and growth presentation
for(const functionName of ['statScale','levelFraction']){
 const expression=new RegExp('function '+functionName+'\\([^\\n]*\\)\\{[\\s\\S]*?\\n \\}');
 const found=expression.exec(source);
 assert(found,'Real values helper missing: '+functionName);
 vm.runInContext(found[0],context);
}
assert.equal(context.statScale([40,70,90]),260);
assert.equal(context.statScale([300,450,350]),450);
assert.equal(context.statScale([3000,4500,3500]),4500);
assert.equal(context.levelFraction(10,30,60),0.5);
assert.equal(context.levelFraction(100,0,60),1);
assert.equal(context.levelFraction(10,0,60),0);
console.log('Werte: gemeinsame Skala und Wachstumsdarstellung bestanden.');


// Compact profile level caption
const profileCaption=/function profileLevelLine\(state\)\{[\s\S]*?\n \}/.exec(source);
assert(profileCaption);
vm.runInContext(profileCaption[0],context);
assert.equal(
 context.profileLevelLine({levelNumber:12,into:30,per:60}),
 'Lv.12 → 13 · 30 Min'
);
assert.equal(
 context.profileLevelLine({levelNumber:100,into:0,per:60}),
 'Lv.100 · MAX'
);
console.log('Profilwachstum: kompakter Levelhinweis und Maximum-Markierung bestanden.');
