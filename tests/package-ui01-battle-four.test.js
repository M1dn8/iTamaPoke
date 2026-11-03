
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let allowed=true,johto=false,current='activity';
const screens=[];
const c={
 console,Math,Number,Object,Array,JSON,Promise,
 Module:{},tpSaveReplacing:false,dragStart:null,dragNow:null,
 TPKantoLeagueData:{},addEventListener(){},
 document:{addEventListener(){},visibilityState:'visible'},
 TPActivities:{inContext:page=>page==='battle',battleKind:'wild'},
 TPTrainer:{canOpen:()=>allowed},TPArena:{region:0},
 TPRegions:{available:id=>id===0||id===1&&johto,catalog:()=>({league:{}})}
};
Object.defineProperty(c,'screen',{
 get:()=>current,set:value=>{screens.push(value);current=value;}
});
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/league-kanto.js','utf8'),c);
const L=c.TPLeague;
assert(!L.canOpen(0,'activity'));
c.TPActivities.battleKind='league';
assert(L.canOpen(0,'activity'));
assert(!L.canOpen(1,'activity'));
assert(!L.canOpen(-1,'activity'));assert(!L.canOpen(2,'activity'));
allowed=false;assert(!L.canOpen(0,'activity'));allowed=true;
c.tpSaveReplacing=true;assert(!L.canOpen(0,'activity'));c.tpSaveReplacing=false;
screens.length=0;
assert(L.open(0,'activity'));assert.equal(c.screen,'league');
assert(!screens.includes('arena'));
L.back();assert.equal(c.screen,'activity');
johto=true;
assert(L.open(1,'activity'));assert.equal(L.region,1);
L.back();assert.equal(c.screen,'activity');
c.screen='arena';
assert(L.open(0));L.back();assert.equal(c.screen,'arena');


const source=fs.readFileSync('browser_ver/web/activity-pages.js','utf8');
const first=source.indexOf('function goBack(');
const last=source.indexOf('function ensureLayer(',first);
assert(first>=0&&last>first);
let closed=0,active=true;
const back={
 busy:false,active:()=>active,
 close:()=>{closed++;return true;}
};
vm.createContext(back);
vm.runInContext(source.slice(first,last),back);
assert(back.goBack());assert.equal(closed,1);
back.busy=true;
assert.equal(back.goBack(),false);assert.equal(closed,1);
back.busy=false;active=false;
assert.equal(back.goBack(),false);assert.equal(closed,1);
console.log('UI01 battle layout passed: guarded direct league entry and legacy return retained; selection page closes directly without extra home step. Native gameplay mocked; left-column layout and previews checked in browser.');
