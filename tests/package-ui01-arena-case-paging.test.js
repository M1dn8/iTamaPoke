
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/arena.js','utf8');
const first=source.indexOf('function arenaCaseRegions(');
const last=source.indexOf('const arenaSubCropCache=',first);
assert(first>=0&&last>first);
let johto=false,locked=false,busy=false;
const c={
 screen:'arena',detail:false,tab:'badges',origin:'badges',region:0,
 tpSaveReplacing:false,arenaPageKey:'old',busy:()=>busy,
 TPRegions:{available:id=>id===0||johto,locked:()=>locked},
 chooseRegion:id=>{
  if(id===1&&!johto)return false;
  c.region=id;c.tab='leaders';return true;
 }
};
c.window=c;vm.createContext(c);
vm.runInContext(source.slice(first,last),c);
assert.equal(JSON.stringify(c.arenaCaseRegions()),'[0]');
assert.equal(c.arenaCaseMove(1),false);
johto=true;
assert(c.arenaCaseMove(1));
assert.equal(c.region,1);assert.equal(c.tab,'badges');
assert.equal(c.arenaCaseMove(1),false);
assert(c.arenaCaseMove(-1));assert.equal(c.region,0);
locked=true;assert.equal(c.arenaCaseMove(1),false);locked=false;
c.detail=true;assert.equal(c.arenaCaseMove(1),false);c.detail=false;
busy=true;assert.equal(c.arenaCaseMove(1),false);busy=false;
assert.equal(c.arenaCaseMove(2),false);
console.log('Arena case paging passed: available regions only, Johto gate respected, bounded previous/next, case mode preserved and busy/locked contexts refused. Native region unlock is not substituted in browser tests.');
