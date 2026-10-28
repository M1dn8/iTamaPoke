'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
class Element{
 constructor(tag){
  this.tagName=tag;this.children=[];this.style={};this.dataset={};
  this.isConnected=true;this.hidden=false;
 }
 append(...nodes){this.children.push(...nodes);}
 appendChild(node){this.append(node);return node;}
 replaceChildren(...nodes){this.children=[...nodes];}
 addEventListener(){}
 closest(){return {hidden:false};}
 setAttribute(name,value){this[name]=value;}
}
const phases={zapdos:'investigate',articuno:'investigate'};
const advances=[],portraits=[],finales=[],games=[];
const service=id=>({
 supported:true,noticeSupported:true,
 view:()=>({phase:phases[id],canBattle:phases[id]==='duel'}),
 access:()=>({unlocked:true,badges:6,phase:phases[id]}),
 advance:async action=>{
  advances.push([id,action]);
  phases[id]=action==='investigate'?'secure':'duel';
 }
});
function gameFactory(kind){
 return {create(options){
  const game={
   kind,options,solved:false,
   start(){game.started=true;return true;},
   attach(host){host.append(new Element('game'));},
   dispose(){game.disposed=true;}
  };
  games.push(game);return game;
 }};
}
const context={
 console,
 document:{visibilityState:'visible',createElement:tag=>new Element(tag)},
 Module:{ccall(name){
  if(name==='tp_battle_can_start')return 1;
  throw Error('Unexpected native call: '+name);
 }},
 tpSaveReplacing:false,screen:'settings',choice:'none',statusEl:{},
 TPCollection:{busy:false,blocked:false},
 TPZapdos:service('zapdos'),TPArktos:service('articuno'),
 TPZapdosText:{t:key=>'Zapdos:'+key},
 TPArktosText:{t:key=>'Arktos:'+key},
 TPStoriesUI:{text:key=>key},TPAppMenu:{active:true},
 TPPowerPlantScene:{create:()=>new Element('plant')},
 TPIceCaveScene:{create:()=>new Element('cave')},
 TPPowerPlantGame:gameFactory('plant'),
 TPIceCaveGame:{...gameFactory('ice'),text:key=>key},
 TPZapdosPortrait:{create(text,options={}){
  portraits.push(options.dex||145);
  return {element:new Element('portrait'),dispose(){}};
 }},
 TPZapdosFinale:{create(text,options={}){
  finales.push(options.dex||145);
  return {element:new Element('finale'),dispose(){}};
 }}
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(
 'browser_ver/web/zapdos-story-ui.js','utf8'
),context);
(async()=>{
 assert.notEqual(context.TPZapdosUI,context.TPArktosUI);
 assert.equal(context.TPZapdosUI.text('level'),'Zapdos:level');
 assert.equal(context.TPArktosUI.text('level'),'Arktos:level');
 for(const [id,api,kind,dex] of [
  ['zapdos',context.TPZapdosUI,'plant',145],
  ['articuno',context.TPArktosUI,'ice',144]
 ]){
  const host=new Element('host');api.mount(host);
  assert.equal(host.id,
   id==='zapdos'?'tp-zapdos-page':'tp-articuno-page');
  const gameCountBefore=games.length;
  await api.advance('investigate');
  if(id==='articuno'){
   assert.equal(games.length,gameCountBefore);
   assert.equal(api.openChallenge(),true);
   assert.equal(api.openChallenge(),false);
   assert.equal(games[games.length-1].started,true);
  }else{
   assert.equal(api.openChallenge(),false);
  }
  const game=games[games.length-1];
  assert.equal(game.kind,kind);
  assert.equal(await api.advance('secure'),false);
  assert.equal(phases[id],'secure');
  game.solved=true;
  assert.equal(await api.advance('secure'),true);
  assert.equal(phases[id],'duel');assert(game.disposed);
  assert.equal(portraits[portraits.length-1],dex);
  phases[id]='complete';api.mount(host);
  assert.equal(finales[finales.length-1],dex);
 }
 assert.equal(advances.length,4);
 console.log('Shared story UI passed: actual controller factory, '+
  'independent profiles, correct minigame, unsolved-task refusal, '+
  'encounter and finale profile forwarding. DOM/art/native dependencies '+
  'simulated; no visual browser acceptance claim.');
})().catch(error=>{console.error(error);process.exit(1);});
