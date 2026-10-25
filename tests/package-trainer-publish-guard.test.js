'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const artifact=require('../tools/quality/web-artifact.cjs');
const trainers=require('../browser_ver/web/trainer-art.js');

let checks=0;
const workflows=[
 '.github/workflows/quality-gate.yml',
 '.github/workflows/build-browser.yml'
].map(filename=>{
 const source=fs.readFileSync(filename,'utf8');
 const matches=[...source.matchAll(/grep -Eiq '([^']+)'/g)]
  .filter(match=>match[1].includes('trainer-'));
 assert.equal(matches.length,1,'Eindeutige Mediensperre: '+filename);
 checks++;
 return {filename,pattern:matches[0][1]};
});

function workflowRejects(pattern,name){
 const result=spawnSync(
  'bash',
  ['-c', 'printf "%s\\n" "$1" | grep -Eiq "$2"',
   'trainer-publish-test',name,pattern],
  {encoding:'utf8'}
 );
 if(result.error)throw result.error;
 assert(
  result.status===0||result.status===1,
  'grep-Ausführung fehlgeschlagen: '+result.stderr
 );
 return result.status===0;
}

const trainerNames=trainers.entries.map(entry=>entry.key);
assert.equal(trainerNames.length,26);
assert.equal(new Set(trainerNames).size,26);
checks+=2;

const privateNames=[...new Set([
 ...trainerNames,
 ...trainerNames.map(name=>name.toUpperCase()),
 'p001.bin',
 'ps025.bin',
 'p006-mega-x.bin',
 'ps376-mega.bin',
 'psnd001.bin',
 'thumbs.bin'
])];

const publicNames=[
 'index.html',
 'opponent-team.js',
 'trainer-art.js',
 'arena-johto.js',
 'league-kanto.js',
 'rights.js',
 'sw.js',
 'LICENSE',
 'NOTICE'
];

for(const name of privateNames){
 for(const rule of workflows){
  assert.equal(
   workflowRejects(rule.pattern,name),true,
   rule.filename+' muss private Datei sperren: '+name
  );
  checks++;
 }
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'trainer-private-'));
 try{
  fs.writeFileSync(path.join(directory,name),Buffer.from([1,2,3]));
  assert.throws(
   ()=>artifact.tree(directory),
   /Private game asset/,
   'Artefaktsperre muss private Datei ablehnen: '+name
  );
  checks++;
 }finally{
  fs.rmSync(directory,{recursive:true,force:true});
 }
}

for(const name of publicNames){
 for(const rule of workflows){
  assert.equal(
   workflowRejects(rule.pattern,name),false,
   rule.filename+' darf Programm-/Hinweisdatei nicht sperren: '+name
  );
  checks++;
 }
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'trainer-public-'));
 try{
  fs.writeFileSync(path.join(directory,name),'Synthetic test content\n');
  assert.doesNotThrow(
   ()=>artifact.tree(directory),
   'Artefaktsperre darf Programm-/Hinweisdatei nicht sperren: '+name
  );
  checks++;
 }finally{
  fs.rmSync(directory,{recursive:true,force:true});
 }
}

console.log(
 'Trainer publication guards passed: '+checks+' assertions; '+
 'all 26 names and uppercase variants checked against both workflow '+
 'patterns and the artifact guard; existing media examples blocked; '+
 'program and notice files allowed. Synthetic bytes only.'
);
