
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/main.js','utf8');
const matches=[...source.matchAll(/\bacquire\s*:\s*(\(\s*context\s*\)\s*=>\s*\{)/g)];
assert.equal(matches.length,1);
const match=matches[0],start=match.index+match[0].indexOf(match[1]);
const opening=source.indexOf('{',start);
let depth=0,quote=null,escaped=false,end=-1;
for(let i=opening;i<source.length;i++){
 const char=source[i];
 if(quote){
  if(escaped)escaped=false;
  else if(char==='\\')escaped=true;
  else if(char===quote)quote=null;
  continue;
 }
 if(char==="'"||char==='"'||char==='`')quote=char;
 else if(char==='{')depth++;
 else if(char==='}'&&!--depth){end=i+1;break;}
}
assert(end>opening);
const mod={};
const c={
 Module:mod,mod,screen:'activity',choice:'none',
 tpSaveReplacing:false,tpSaveEpoch:0,dragStart:null,dragNow:null,
 TPAppMenu:{ready:true},
 TPActivities:{inContext:page=>page==='battle',battleKind:'wild'},
 fns:{ceremony:()=>false,evolvingNow:()=>false,wildPromptActive:()=>false}
};
c.window=c;vm.createContext(c);
vm.runInContext('acquire='+source.slice(start,end),c);
let release=c.acquire('wildPrepare');
assert.equal(c.tpSaveReplacing,true);
release();assert.equal(c.tpSaveReplacing,false);

for(const kind of ['trainer','arena','league','home']){
 c.TPActivities.battleKind=kind;
 assert.throws(()=>c.acquire('wildPrepare'));
}
c.TPActivities.battleKind='wild';
c.TPActivities.inContext=()=>false;
assert.throws(()=>c.acquire('wildPrepare'));
c.TPActivities.inContext=page=>page==='battle';

for(const context of [
 'careSync','careEnd','admissionComplete','leagueStart','arenaPrepare','wildResult'
])assert.throws(()=>c.acquire(context));

c.screen='card';
release=c.acquire('wildPrepare');release();
c.screen='idle';
release=c.acquire('careSync');release();
c.screen='activity';c.tpSaveReplacing=true;
assert.throws(()=>c.acquire('wildPrepare'));
console.log('Wild activity gate passed: actual acquire function permits only wild preparation in the active wild context, retains legacy contexts and rejects unrelated activity writes.');
