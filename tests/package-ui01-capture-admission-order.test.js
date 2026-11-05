'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/collection-admission-ui.js','utf8');

let now=1000,draws=0,writes=0;
const capture={busy:true,phase:'saving'};
const pending={
 ticket:7,kind:'capture',
 pokemon:{dex:25,level:17,nickname:'Fangprobe',shiny:false}
};
const state={
 revision:1,active:1,team:[1,2,3,4,5,6],
 mons:Array.from({length:6},(_,i)=>({
  id:i+1,dex:25,level:17,nickname:'Team-'+i
 }))
};
const c={
 console,Module:{},screen:'battle',choice:'none',
 tpSaveReplacing:false,dragStart:null,dragNow:null,
 performance:{now:()=>now},
 document:{visibilityState:'visible'},
 TPAppMenu:{ready:true,active:false},
 TPBoxes:{active:false},
 TPCollectionGame:{dialogOpen:false},
 TPArena:{busy:false},TPLeague:{busy:false},
 TPAdmissionText:{t:key=>key},
 TPCollectionModel:{summary:()=>({stored:5,capacity:240})},
 TPCollection:{read:()=>state,busy:false,blocked:false},
 TPAdmission:{
  supported:true,read:()=>({pending}),autoAttempted:()=>true,
  complete:async()=>{writes++;throw Error('Unexpected automatic admission');}
 },
 TPBattleView:{capture},
 TPBattlePokedex:{
  active:true,
  admission(element){
   if(c.screen!=='battle')return false;
   element.inert=!!capture.busy;
   return true;
  }
 },
 fns:{
  dexName:d=>'Art '+d,battleResolved:()=>1,
  battleCatchDone:()=>1,battleCatchSuccess:()=>1
 },
 requestAnimationFrame(){},
 drawProbe(){draws++;capture.busy=false;capture.phase='caught';}
};
require(process.cwd()+'/tests/helpers/ui01-dom.cjs').installDOM(c);
c.window=c;
vm.createContext(c);
vm.runInContext(source,c);

assert.equal(
 c.TPAdmissionUI.open(),false,
 'CAPTURE_ADMISSION_BUSY_GATE'
);
assert.equal(c.TPAdmissionUI.active,false);

const main=fs.readFileSync('browser_ver/web/main.js','utf8');
const start=main.indexOf('  function frame(t) {');
const end=main.indexOf('    // Frozen while a decision dialog',start);
assert(start>=0&&end>start,'Actual frame boundary missing');
vm.runInContext(main.slice(start,end)+'\n drawProbe();\n}\n',c);

c.frame(0);
assert.equal(draws,1,'Capture drawing must remain reachable');
assert.equal(c.TPAdmissionUI.active,false);
assert.equal(capture.busy,false);

now+=300;
c.frame(1);
assert.equal(c.TPAdmissionUI.active,true);
assert.equal(draws,1,'Open admission retains the normal frame freeze');
const page=c.document.getElementById('tp-admission-page');
assert(page);
assert.equal(page.inert,false,'Admission must open in an operable state');
assert.equal(writes,0,'Opening a full-team decision must not write a save');
assert.equal(c.tpSaveReplacing,false);
assert.equal(c.TPCollection.blocked,false);

c.TPAdmissionUI.close();
for(const flag of ['save','busy','blocked']){
 if(flag==='save')c.tpSaveReplacing=true;
 else c.TPCollection[flag]=true;
 assert.equal(c.TPAdmissionUI.open(),false,'Preserved guard: '+flag);
 c.tpSaveReplacing=false;
 c.TPCollection.busy=false;
 c.TPCollection.blocked=false;
}

capture.busy=true;
c.screen='idle';
assert.equal(c.TPAdmissionUI.open(),true);
c.TPAdmissionUI.close();
assert.equal(writes,0);

console.log(
 'Capture/admission ordering passed: actual admission module and early frame '+
 'gates; no opening during capture, continued capture drawing, operable later '+
 'decision, retained save guards and recovery availability. '+
 'DOM/capture state simulated; no native storage or iPhone visual claim.'
);


// UI01 admission restoration redraw regression
{
 const viewSource=fs.readFileSync('browser_ver/web/battle-view.js','utf8');
 const startMatch=/\bfunction\s+restoreAdmission\s*\(\s*\)/.exec(viewSource);
 assert(startMatch,'Actual admission restoration missing');
 const a=startMatch.index;
 const tail=viewSource.slice(a);
 const endMatch=/\bfunction\s+hide\s*\(\s*\)/.exec(tail);
 assert(endMatch&&endMatch.index>0,'Restoration boundary missing');
 const b=a+endMatch.index;
 const content={};
 const element={inert:true,parentNode:content};
 const host={append(child){child.parentNode=this;}};
 const removed=[];
 const scope={
  admissionPage:element,content,host,admissionRecovery:true,recoveryTicket:7,
  admissionBack:null,admissionBox:null,incoming:{dex:25},
  key:'previous-caught-frame',
  page:{removeAttribute:name=>removed.push(name)}
 };
 vm.runInNewContext(
  viewSource.slice(a,b)+'\nglobalThis.restore=restoreAdmission;',scope
 );
 scope.restore();
 assert.equal(scope.key,'','ADMISSION_RESTORE_REDRAW');
 assert.equal(element.inert,false);
 assert.equal(element.parentNode,host);
 assert.equal(scope.admissionPage,null);
 assert(removed.includes('data-battle-admission'));
 console.log('Admission restoration passed: container returned, inert cleared and controls scheduled for redraw.');
}


// UI01 admission recovery ownership contract.
{
 const viewSource=fs.readFileSync('browser_ver/web/battle-view.js','utf8');
 const a=viewSource.search(/\bfunction\s+recoveryAlive\s*\(/);
 assert(a>=0,'Recovery ownership predicate missing');
 const rest=viewSource.slice(a);
 const b=rest.search(/\bfunction\s+restoreAdmission\s*\(/);
 assert(b>0,'Recovery predicate boundary missing');
 const moduleIdentity={};
 let ticket=7,active=true,screenName='idle';
 const r={
  admissionRecovery:true,recoveryTicket:7,
  owner:moduleIdentity,Module:moduleIdentity,
  game:()=>screenName,
  root:{
   TPAdmissionUI:{get active(){return active;}},
   TPAdmission:{read:()=>({pending:ticket===null?null:{ticket}})}
  }
 };
 vm.runInNewContext(
  rest.slice(0,b)+'\nglobalThis.check=recoveryAlive;',r
 );
 assert.equal(r.check(),true);
 r.owner={};assert.equal(r.check(),false);
 r.owner=moduleIdentity;
 ticket=8;assert.equal(r.check(),false);
 ticket=7;active=false;assert.equal(r.check(),false);
 active=true;screenName='battle';assert.equal(r.check(),false);
 screenName='idle';ticket=null;assert.equal(r.check(),false);
 console.log('Admission recovery ownership passed: matching module/ticket/screen required; no native battle mutation.');
}
