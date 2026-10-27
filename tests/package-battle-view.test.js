 'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
let texts=[],sprites=[],calls=[];
const pix={actions:{0:{w:40,h:40,base:40}}};
const ctx=new Proxy({
 fillText:s=>texts.push(String(s)),
 drawImage:(...args)=>calls.push(args)
},{
 get:(target,key)=>key in target?target[key]:()=>{},
 set:(target,key,value)=>(target[key]=value,true)
});
const c={
 window:null,console,ctx,roundRect(){},performance:{now:()=>100},
 frameCanvas:{},frameCtx:{putImageData(){}},
 frameIndexAt:()=>0,frameImageData:()=>({}),TPAct:{idle:0},
 fns:{dexName:d=>'Art '+d},
 TPStoreTools:{megaFormInfo:()=>({dex:376,name:'Mega-Metagross'})},
 spriteFor:(dex,shiny)=>{sprites.push(['normal',dex,shiny]);return pix;},
 megaSpriteFor:(shiny,form)=>{sprites.push(['mega',shiny,form]);return pix;},
 statusEl:{textContent:''}
};
c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync('browser_ver/web/battle-view.js','utf8'),c);

const base={
 mode:'league',id:1,theme:'ice',title:'Lorelei',round:1,rests:5,
 resolved:false,won:false,dealt:37,taken:12,heal:0,
 player:{
  dex:376,level:50,form:2,shiny:1,nick:'Stahl & <Zwei>',
  hp:523,maxHp:820,atk:400,def:300,spe:200
 },
 enemy:{dex:87,level:54,hp:200,maxHp:500}
};
function position(action,x,y){
 const target=c.TPBattleView.target(action);
 assert(target,'Missing action: '+action);
 assert.equal(target.x,x,action+' horizontal position');
 assert.equal(target.y,y,action+' vertical position');
}
function mainGrid(healing=true){
 position('fight',137,371);
 position('info',137,425);
 position('abort',329,425);
 if(healing)position('rest',329,371);
 else assert.equal(c.TPBattleView.target('rest'),null);
 for(const action of ['quick','heavy','dodge','back'])
  assert.equal(c.TPBattleView.target(action),null);
}
function movesGrid(){
 position('heavy',137,371);
 position('dodge',329,371);
 position('quick',137,425);
 position('back',329,425);
 for(const action of ['rest','fight','info','abort'])
  assert.equal(c.TPBattleView.target(action),null);
}

c.TPBattleView.draw(base);
assert(texts.includes('Megametagross · Lv. 50'));
assert(texts.includes('523 / 820 KP')&&texts.includes('200 / 500 KP'));
assert(texts.includes('Stahl & <Zwei>'));
assert.deepEqual(sprites[1],['mega',true,2]);
assert.equal(calls[1][3],90);
mainGrid();

const view={battleId:1,index:0,playerDex:376,playerLevel:50,form:2,shiny:1};
const rest=c.TPBattleView.target('rest');
assert.equal(c.TPBattleView.tapLeague(rest.x,rest.y,view),'rest');
assert.equal(c.TPBattleView.menu,'main');

const fight=c.TPBattleView.target('fight');
assert.equal(c.TPBattleView.tapLeague(fight.x,fight.y,view),null);
assert.equal(c.TPBattleView.menu,'moves');
c.TPBattleView.draw(base);
movesGrid();

const heavy=c.TPBattleView.target('heavy');
assert.equal(c.TPBattleView.tapLeague(heavy.x,heavy.y,view),'heavy');
const back=c.TPBattleView.target('back');
assert.equal(c.TPBattleView.tapLeague(back.x,back.y,view),null);
assert.equal(c.TPBattleView.menu,'main');
c.TPBattleView.draw(base);
mainGrid();
c.TPBattleView.draw({...base,rests:0});
mainGrid(false);

// Same shared main layout for each presentation mode.
// These are renderer fixtures, not native combat simulations.
for(const [index,mode] of ['wild','trainer','arena','league','zapdos'].entries()){
 c.TPBattleView.draw({...base,mode,id:10+index,rests:2});
 mainGrid();
 c.TPBattleView.draw({...base,mode,id:10+index,rests:0});
 mainGrid(false);
}

const traces=[];
for(const theme of ['ice','rock','ghost','dragon','champ']){
 const seq=[],previous=c.ctx;
 c.ctx=new Proxy({},{
  get:(_target,key)=>(...args)=>seq.push([key,...args]),
  set:(_target,key,value)=>(seq.push([key,value]),true)
 });
 c.TPBattleView.background(theme);
 traces.push(JSON.stringify(seq));c.ctx=previous;
}
assert.equal(new Set(traces).size,5);

c.TPBattleView.draw({
 ...base,id:30,resolved:true,won:true,next:true,mode:'trainer'
});
assert(c.TPBattleView.target('next'));
for(const action of ['quick','heavy','dodge','fight','rest','back'])
 assert.equal(c.TPBattleView.target(action),null);

console.log('Shared battle UI passed: actual drawn Mega/name/level, numeric '+
 'HP, shiny routing, 75% Metagross scale, five distinct scenery traces, '+
 'two four-button grids, main-page healing, no moves-page healing, regular '+
 'back routing, zero-rest lock, five presentation-mode layouts and no '+
 'stale combat targets on results. Isolated renderer, not native combat.');
