
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function recorder(){
 const log=[];
 return {log,ctx:new Proxy({},{
  get:(object,key)=>(...args)=>log.push([key,...args]),
  set:(object,key,value)=>{
   log.push(['set',key,value]);object[key]=value;return true;
  }
 })};
}
const global=recorder(),c={ctx:global.ctx,Math};
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/badge-ui.js','utf8'),c);
for(const method of ['draw','drawJohto'])for(let id=0;id<8;id++){
 global.log.length=0;
 c.TPBadgeUI[method](id,32,32,25,true);
 const reference=JSON.stringify(global.log);
 global.log.length=0;
 const target=recorder();
 c.TPBadgeUI[method](id,32,32,25,true,target.ctx);
 assert.equal(global.log.length,0);
 assert.equal(JSON.stringify(target.log),reference);
}
console.log('Badge target passed: all 16 Kanto/Johto shapes retain original drawing commands; explicit canvas target leaves global canvas untouched.');
