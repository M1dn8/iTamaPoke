
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/league-kanto.js','utf8');
const first=source.indexOf('/* UI01 saved league checkpoint:');
const end=source.indexOf('/* End UI01 saved league checkpoint. */',first);
assert(first>=0&&end>first);
class Element{
 constructor(tag,text,cls){
  this.tag=tag;this.textContent=text||'';this.className=cls||'';
  this.children=[];this.attributes={};this.style={};
 }
 append(...items){this.children.push(...items);}
 setAttribute(k,v){this.attributes[k]=String(v);}
}
const c={Math,Number,Array,Object,JSON,
 leaguePageHero:null,leaguePagePortraits:[],
 D:{names:['A','B','C','D','Champ'],
  elite:Array.from({length:4},()=>Array(5).fill([1,1])),
  champions:Array.from({length:3},()=>Array(6).fill([1,1]))},
 fns:{dexName:id=>'Species '+id,dexType1:()=>0,dexType2:()=>0},
 leaguePageNode:(tag,text,cls)=>new Element(tag,text,cls)};
vm.createContext(c);vm.runInContext(source.slice(first,end),c);
const v={index:1,variant:0,active:0,dex:95,level:54,members:[
 {id:1,dex:6,level:30,nick:'Stored',shiny:false,form:0,hp:40,maxHp:80,rests:4},
 {id:2,dex:9,level:30,nick:'Fainted',shiny:true,form:0,hp:0,maxHp:60,rests:2}
]};
const before=JSON.stringify(v),left=new Element('div'),right=new Element('div');
c.leagueCheckpointBody(v,left,right);
const walk=n=>[n,...n.children.flatMap(walk)];
assert.equal(left.children[0].attributes['data-league-next-index'],'1');
assert.equal(c.leaguePagePortraits.length,5);
assert.equal(walk(left).filter(n=>n.className==='tp-checkpoint-progress').length,0);
const balls=walk(left).find(n=>n.className==='tp-checkpoint-balls');
assert.equal(balls.attributes['aria-label'],'Pokémon 2 / 5');
assert.equal(balls.children.length,5);
assert.equal(balls.children.filter(n=>n.attributes['data-ball']==='done').length,1);
const rows=walk(right).filter(n=>'data-league-member-id' in n.attributes);
assert.equal(rows.length,2);
assert(walk(right).some(n=>n.tag==='h3'&&n.textContent==='Dein Team'));
assert.equal(rows[0].attributes['data-hp'],'40');
assert.equal(rows[0].attributes['data-rests'],'4');
assert.equal(rows[0].attributes['data-active'],'true');
assert.equal(rows[1].attributes['data-ko'],'true');
assert.equal(rows[1].attributes['data-rests'],'2');
assert(walk(rows[1]).some(n=>
 n.className==='tp-checkpoint-ko'&&n.textContent==='Besiegt'));
for(let i=0;i<rows.length;i++){
 assert.equal(walk(rows[i]).filter(n=>
  n.className==='tp-checkpoint-heals').length,0);
 const bar=walk(rows[i]).find(n=>n.className==='tp-checkpoint-hp');
 assert.equal(bar.attributes['aria-valuenow'],String(v.members[i].hp));
}
assert.equal(JSON.stringify(v),before);
assert.equal(walk(right).filter(n=>n.tag==='button').length,0);
assert.equal(vm.runInContext('leagueCheckpointCards.length',c),3);
const next=new Element('div');
c.leagueCheckpointBody({...v,index:20},next,new Element('div'));
assert(walk(next).some(n=>n.textContent==='Champ'));
const champBalls=walk(next).find(n=>n.className==='tp-checkpoint-balls');
assert.equal(champBalls.attributes['aria-label'],'Pokémon 1 / 6');
assert.equal(champBalls.children.length,6);
console.log('Checkpoint details passed: portraits, exact HP/heal pips, explicit KO, champion boundary and read-only state.');
