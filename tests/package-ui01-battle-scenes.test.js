
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/activity-pages.js','utf8');
const first=source.indexOf('function paintBattleDestination(');
const last=source.indexOf('function paintBattlePreview(',first);
assert(first>=0&&last>first);
const c={iconPalette:()=>({}),Math};
vm.createContext(c);
vm.runInContext(source.slice(first,last),c);
function run(kind,time){
 const commands=[];let saved=0,restored=0;
 const paint={
  fillStyle:'',
  save(){saved++;},
  restore(){restored++;},
  fillRect(x,y,w,h){commands.push([this.fillStyle,x,y,w,h]);}
 };
 const result=c.paintBattleDestination(paint,kind,time);
 for(const [,x,y,w,h]of commands){
  assert(x>=0&&y>=0&&w>0&&h>0);
  assert(x+w<=224&&y+h<=112);
 }
 return {result,commands,saved,restored};
}
for(const kind of ['arena','league']){
 const a=run(kind,0),b=run(kind,600);
 assert(a.result);assert(a.commands.length>20);
 assert.equal(a.saved,1);assert.equal(a.restored,1);
 assert.notDeepEqual(a.commands,b.commands);
}
assert.deepEqual(run('trainer',0),{
 result:false,commands:[],saved:0,restored:0
});
assert.deepEqual(run('wild',0),{
 result:false,commands:[],saved:0,restored:0
});
assert.notDeepEqual(run('arena',0).commands,run('league',0).commands);
console.log('UI01 battle scenes passed: separate arena/league motifs, bounded canvas geometry, animation phases, balanced drawing state and no trainer/wild replacement. Visual approval remains separate.');
