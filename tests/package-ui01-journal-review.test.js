 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm');

(async()=>{
 const source=fs.readFileSync('tools/review/manual-review.cjs','utf8');
 const a=source.indexOf('// P06 review profile configuration');
 const b=source.indexOf('// End P06 review profile configuration');
 assert(a>=0&&b>a);
 const config=source.slice(a,b);
 const start=source.indexOf('async function openStory(){');
 const end=source.indexOf('async function graphics(){',start);
 assert(start>=0&&end>start);
 const open=source.slice(start,end);
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'itamapoke-journal-contract-'));
 const names=Array.from({length:8},(_,i)=>
  String(i+1).padStart(2,'0')+'-tagebuch-test'
 );
 function contextFor(story){
  fs.writeFileSync(path.join(directory,'review.json'),JSON.stringify({
   schema:1,story,names
  }));
  const calls=[];
  const context={fs,path,saves:directory,current:1,
   page:{evaluate:async(_callback,value)=>{calls.push(value);}}};
  vm.createContext(context);
  vm.runInContext(config,context);
  vm.runInContext(open,context);
  return {context,calls};
 }
 try{
  const journal=contextFor('journal');
  for(let i=1;i<=8;i++){
   journal.context.current=i;
   await journal.context.openStory();
  }
  assert.deepEqual(journal.calls,Array(8).fill('journal'));
  const catalogue=contextFor('catalogue');
  catalogue.context.current=8;
  await catalogue.context.openStory();
  assert.deepEqual(catalogue.calls,['stories']);
  const arktos=contextFor('articuno');
  arktos.context.current=1;await arktos.context.openStory();
  arktos.context.current=5;await arktos.context.openStory();
  assert.deepEqual(arktos.calls,['stories','articuno']);
  assert.throws(()=>contextFor('unknown-profile'));
  fs.writeFileSync(path.join(directory,'review.json'),JSON.stringify({
   schema:1,story:'journal',names:names.slice(0,7)
  }));
  assert.throws(()=>{
   const context={fs,path,saves:directory};
   vm.createContext(context);vm.runInContext(config,context);
  });
 }finally{
  fs.rmSync(directory,{recursive:true,force:true});
 }
 console.log('UI01 journal review contract passed: explicit profile, eight cases, journal routes, retained story routes and invalid-profile refusal. No manual visual acceptance claimed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
