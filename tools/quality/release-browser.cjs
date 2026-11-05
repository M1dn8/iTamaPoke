#!/usr/bin/env node
// UI01 release profile cleanup: explicit scope, no empty or skipped release checks.
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const dir=path.join(root,'tools/browser-tests');
const basePath=path.join(dir,'playwright.config.js');
const cli=path.join(dir,'node_modules/@playwright/test/cli.js');
const listOnly=process.argv.length===3&&process.argv[2]==='--list';
if(process.argv.length>(listOnly?3:2))throw Error('Usage: release-browser.cjs [--list]');
const both=['chromium-mobil','webkit-mobil'];
const rules=[
 ['Navigation','navigation-smoke.spec.js','^Navigation smoke:',4],
 ['Persistenz','collection-persistence.spec.js','^F4-B2:',3],
 ['Externe Sicherung','app.spec.js','^Externe Sicherung ',1],
 ['Team','collection-team.spec.js','^UI01 Release-Team:',2],
 ['Boxenteam','box-team-layout.spec.js','^UI01 Boxen:.*320$',1],
 ['Boxenaktionen','box-detail-actions.spec.js','^UI01 Boxdetails:.*320$',1],
 ['Boxen-Schreibfehler','collection-boxes.spec.js','^UI01 Sammlung: Hub-Schreibfehler',1],
 ['Pflegeabschluss','care-ending-layout.spec.js','^UI01 Pflege-Ende:.*(?:320|erst internes Ja.*)$',2],
 ['Wildfang','collection-capture.spec.js','^F4-B3a:',2],
 ['Nicht fangen','no-catch-decision.spec.js','^Nicht fangen:',1],
 ['Aufgeben','give-up.spec.js','^Aufgeben:.*(?:wild|league)$',2],
 ['Mega','mega-review.spec.js','^(?:Mega-Review: 0[234]-.*-bereit|Mega-Grafikschutz.*)$',4],
 ['Expedition','expedition-layout.spec.js','^Expedition: (?:echter Start und gespeicherter Lauf 1$|Speicherfehler|echtes Abholen)',3],
 ['Ehrenei','regional-reward-egg.spec.js','^Ehrenei: (?:echte Auswahl|bewusste Vormerkung)',2],
 ['Quellen','rights-layout.spec.js','^Quellen: .*Lizenztexte.*extern',1],
 ['Lokale Sicherung','saves-layout.spec.js','^Sicherungen: vorhandene lokale Speicheraktion',1],
 ['Entwicklungsanzeige','evolution-bond-label.spec.js','^Entwicklung: keine Mindestbindung',1],
 ['Fangabschluss','capture-admission-flow.spec.js','^UI01 Fangabschluss:',2],
 ['Arena-Sechserteam','arena-team.spec.js','^UI01 Arena-Team6:',4],
 ['Liga-Pflichtwechsel','league-team.spec.js','^P05c UI: forced replacement adds no turn/damage',1,['webkit-mobil']],
 ['Kanto-Variantenfortschritt','league-variant-progress.spec.js','^UI01 Kanto-Varianten:',4],
 ['Liga-Gesamtablauf','league-flow.spec.js','.*',1,['webkit-mobil']]
].map(([name,file,title,count,projects=both])=>({name,file,title,count,projects}));

const base=require(basePath);
if(!Array.isArray(base.projects)||base.projects.length!==2||
 !both.every(name=>base.projects.some(p=>p.name===name)))
 throw Error('Erwartete Chromium-/WebKit-Projekte fehlen.');
for(const rule of rules)fs.accessSync(path.join(dir,'specs',rule.file));
fs.accessSync(cli);
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'itamapoke-release-config-'));
const config=path.join(temp,'playwright.config.cjs');
const result=path.join(dir,'test-results/release-results.json');
const projects=base.projects.map((project,index)=>{
 const selected=rules.filter(r=>r.projects.includes(project.name));
 const grep=selected.map(r=>
  '(?:'+escape(r.file)+' .*'+r.title.replace(/^\^/,'')+')'
 ).join('|');
 return `{...base.projects[${index}],testMatch:${JSON.stringify(
  [...new Set(selected.map(r=>'**/'+r.file))]
 )},grep:new RegExp(${JSON.stringify(grep)})}`;
});
fs.writeFileSync(config,`
const base=require(${JSON.stringify(basePath)});
module.exports={...base,
 testDir:${JSON.stringify(path.join(dir,'specs'))},
 outputDir:${JSON.stringify(path.join(dir,'test-results'))},
 retries:0,forbidOnly:true,failOnFlakyTests:true,
 reporter:[['list'],['json',{outputFile:${JSON.stringify(result)}}],
 ['html',{open:'never',outputFolder:${JSON.stringify(path.join(dir,'playwright-report'))}}]],
 projects:[${projects.join(',\n')}]
};
`);
const env={...process.env};
delete env.PLAYWRIGHT_JSON_OUTPUT_NAME;
delete env.PLAYWRIGHT_JSON_OUTPUT_FILE;
delete env.PLAYWRIGHT_JSON_OUTPUT_DIR;
function entries(report){
 const rows=[];
 function walk(suite,inherited){
  const file=suite.file||inherited;
  for(const spec of suite.specs||[])
   for(const test of spec.tests||[])
    rows.push({
     file:path.basename(spec.file||file),
     title:spec.title,project:test.projectName,test
    });
  for(const child of suite.suites||[])walk(child,file);
 }
 for(const suite of report.suites||[])walk(suite,'');
 return rows;
}
function verify(report){
 if(report.errors?.length)throw Error(JSON.stringify(report.errors));
 const rows=entries(report);
 let expected=0;
 for(const rule of rules){
  for(const project of rule.projects){
   const matches=rows.filter(row=>row.project===project&&row.file===rule.file&&
    new RegExp(rule.title).test(row.title));
   if(matches.length!==rule.count)
    throw Error(`${rule.name} / ${project}: erwartet ${rule.count}, gefunden ${matches.length}`);
   if(matches.some(row=>row.test.expectedStatus!=='passed'))
    throw Error(`${rule.name}: übersprungene oder absichtlich fehlschlagende Pflichtprüfung.`);
   expected+=rule.count;
  }
 }
 if(rows.length!==expected)throw Error(`Unerwarteter Prüfumfang: ${rows.length} statt ${expected}`);
 return expected;
}
try{
 const collected=spawnSync(process.execPath,
  [cli,'test','--config',config,'--list','--reporter=json'],
  {cwd:dir,env,encoding:'utf8',maxBuffer:20*1024*1024,timeout:120000});
 if(collected.error)throw collected.error;
 if(collected.status!==0)throw Error(collected.stderr||collected.stdout);
 const expected=verify(JSON.parse(collected.stdout));
 console.log(`UI01-Pflichtprofil: ${expected} Browserprüfungen; genau ein vollständiger Liga-Flow.`);
 for(const rule of rules)
  console.log(`- ${rule.name}: ${rule.count} Fall/Fälle × ${rule.projects.length} Browser`);
 if(!listOnly){
  fs.mkdirSync(path.dirname(result),{recursive:true});
  fs.rmSync(result,{force:true});
  const run=spawnSync(process.execPath,
   [cli,'test','--config',config,'--workers=1','--retries=0','--max-failures=1'],
   {cwd:dir,env,stdio:'inherit'});
  if(run.error)throw run.error;
  if(run.status!==0)throw Error(`Release-Browserprüfung fehlgeschlagen: ${run.status}`);
  const report=JSON.parse(fs.readFileSync(result,'utf8'));
  verify(report);
  if(report.stats.expected!==expected||report.stats.skipped||
     report.stats.unexpected||report.stats.flaky)
   throw Error('Pflichtprofil nicht vollständig ohne Auslassungen bestanden.');
  console.log('UI01-Pflichtprofil vollständig bestanden. Keine Aussage zur optionalen Gesamtregression.');
 }
}catch(error){
 console.error(error.message);process.exitCode=1;
}finally{
 fs.rmSync(temp,{recursive:true,force:true});
}
