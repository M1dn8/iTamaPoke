 'use strict';
const assert=require('node:assert/strict');
const M=require('../browser_ver/web/collection-model.js');
const A=require('../browser_ver/web/collection-admission-model.js');
const Z=require('../browser_ver/web/articuno-story-model.js');

let checks=0;
const ok=value=>{assert(value);checks++;};
const eq=(actual,expected)=>{assert.deepEqual(actual,expected);checks++;};
const rejects=(fn,code)=>{
 assert.throws(fn,error=>error.code===code);checks++;
};
const clone=value=>JSON.parse(JSON.stringify(value));
const bird={
 dex:144,level:50,nickname:'',shiny:false,origin:'wild',
 data:{stats:{atk:120,def:110,spe:130},genes:null,training:null}
};
function care(){
 return M.attachCurrent(M.create(),{
  dex:376,level:45,nickname:'Atlas',shiny:false,origin:'existing',
  data:{stats:{atk:170,def:190,spe:110},
   genes:{atk:100,def:100,spe:100},training:{atk:0,def:0,spe:0}}
 });
}
function ready(){
 return Z.advance(Z.advance(Z.create(),'investigate'),'secure');
}
function fullTeam(){
 let s=care();
 for(let i=0;i<5;i++){
  s=M.catchWild(s,{
   dex:25,level:20,nickname:'Stored '+i,shiny:false,origin:'wild',
   data:{stats:{atk:50,def:50,spe:50}}
  });
  s=M.selectTeam(s,s.nextId-1);
 }
 return s;
}

const initial=Z.create(),empty=A.create();
ok(Object.isFrozen(initial));
eq(Z.view(initial,empty),{phase:'investigate',canBattle:false,ticket:0});
const investigated=Z.advance(initial,'investigate');
eq(Z.view(investigated,empty).phase,'secure');
const prepared=Z.advance(investigated,'secure');
eq(Z.view(prepared,empty),{phase:'duel',canBattle:true,ticket:0});
eq(initial.step,0);
rejects(()=>Z.advance(initial,'secure'),'INVALID_ARTICUNO_TRANSITION');
rejects(()=>Z.advance(investigated,'investigate'),'INVALID_ARTICUNO_TRANSITION');
rejects(()=>Z.advance(prepared,'secure'),'INVALID_ARTICUNO_TRANSITION');
rejects(()=>Z.confirmVictory(initial,empty,bird),'ARTICUNO_NOT_READY');

for(const pokemon of [
 {...bird,dex:145},{...bird,level:49},{...bird,level:51},
 {...bird,shiny:true},{...bird,origin:'raised'}
])rejects(()=>Z.confirmVictory(prepared,empty,pokemon),
 'INVALID_ARTICUNO_INDIVIDUAL');

const unrelated=A.queue(empty,{
 kind:'capture',source:'wild:other',pokemon:{...bird,dex:25,level:20}
});
eq(Z.view(prepared,unrelated).canBattle,false);
rejects(()=>Z.confirmVictory(prepared,unrelated,bird),'ADMISSION_ALREADY_PENDING');
eq(unrelated.pending.source,'wild:other');

const won=Z.confirmVictory(prepared,empty,bird);
eq(prepared.step,2);eq(empty.pending,null);
ok(Object.isFrozen(won)&&Object.isFrozen(won.story)&&
 Object.isFrozen(won.admission.pending.pokemon.data));
eq(won.admission.pending.kind,'join');
eq(won.admission.pending.source,Z.SOURCE);
eq(won.story.ticket,won.admission.pending.ticket);
eq(Z.view(won.story,won.admission),{
 phase:'waiting',canBattle:false,ticket:won.story.ticket
});
rejects(()=>Z.confirmVictory(won.story,won.admission,bird),'ARTICUNO_NOT_READY');
rejects(()=>Z.advance(won.story,'investigate'),'INVALID_ARTICUNO_TRANSITION');
rejects(()=>Z.validateLink(prepared,won.admission),'ORPHAN_ARTICUNO_ADMISSION');
rejects(()=>Z.validateLink(won.story,empty),'ARTICUNO_TICKET_NOT_RESERVED');

for(const [mode,collection,options] of [
 ['auto',care(),{mode:'auto'}],
 ['box',fullTeam(),{mode:'box'}],
 ['replace',fullTeam(),null]
]){
 const before=collection;
 const choice=options||{mode:'replace',replaceId:before.team[2]};
 const result=A.complete(won.admission,before,choice);
 eq(result.collection.active,before.active);
 eq(result.collection.mons.length,before.mons.length+1);
 eq(Z.view(won.story,result.admission).phase,'complete');
 const joined=result.collection.mons.find(m=>m.id===result.id);
 eq(joined.dex,144);eq(joined.level,50);eq(joined.shiny,false);
 eq(joined.data.admission,{
  ticket:won.story.ticket,kind:'join',source:Z.SOURCE
 });
 if(mode==='box')eq(result.collection.team,before.team);
 if(mode==='replace'){
  eq(result.collection.team[2],result.id);
  ok(result.collection.mons.some(m=>m.id===choice.replaceId));
 }
 const released=M.releaseStored(result.collection,result.id,{confirmed:true});
 eq(Z.view(won.story,result.admission).phase,'complete');
 ok(!released.mons.some(m=>m.id===result.id));
 rejects(()=>Z.confirmVictory(won.story,result.admission,bird),'ARTICUNO_NOT_READY');

 const later=A.queue(result.admission,{
  kind:'capture',source:'wild:later',pokemon:{...bird,dex:25,level:20}
 });
 eq(Z.view(won.story,later).phase,'complete');
}

const pinned=fullTeam();
rejects(()=>A.complete(won.admission,pinned,{
 mode:'replace',replaceId:pinned.active
}),'CARE_MEMBER_PINNED');

let packed=fullTeam();
while(M.summary(packed).stored<M.BOXES*M.SLOTS)
 packed=M.catchWild(packed,{
  dex:25,level:20,nickname:'',shiny:false,origin:'wild',
  data:{stats:{atk:50,def:50,spe:50}}
 });
rejects(()=>A.complete(won.admission,packed,{mode:'box'}),'BOXES_FULL');
eq(Z.view(won.story,won.admission).phase,'waiting');
eq(won.admission.pending.pokemon.dex,144);

const wrongSource=clone(won.admission);
wrongSource.pending.source='story:other';
rejects(()=>Z.validateLink(won.story,wrongSource),'ARTICUNO_ADMISSION_MISMATCH');
const wrongLevel=clone(won.admission);
wrongLevel.pending.pokemon.level=51;
rejects(()=>Z.validateLink(won.story,wrongLevel),'INVALID_ARTICUNO_INDIVIDUAL');
const impossibleTicket={...won.story,ticket:2};
rejects(()=>Z.validateLink(impossibleTicket,won.admission),
 'ARTICUNO_TICKET_NOT_RESERVED');

for(const state of [initial,investigated,prepared,won.story]){
 const restored=Z.decode(Z.encode(state));
 eq(restored,state);ok(Object.isFrozen(restored));
}
rejects(()=>Z.decode(Z.encode(initial).replace('ITA1','ITA2')),
 'INVALID_ARTICUNO_CHECKSUM');
const broken=JSON.parse(Z.encode(prepared));
broken.payload=broken.payload.replace('"step":2','"step":1');
rejects(()=>Z.decode(JSON.stringify(broken)),'INVALID_ARTICUNO_CHECKSUM');
rejects(()=>Z.decode('{'),'INVALID_ARTICUNO_CONTAINER');
rejects(()=>Z.decode('x'.repeat(Z.MAX_BYTES+1)),'INVALID_ARTICUNO_CONTAINER');
rejects(()=>Z.validate({...initial,version:2}),'UNSUPPORTED_ARTICUNO_VERSION');
rejects(()=>Z.validate({...initial,extra:true}),'UNKNOWN_ARTICUNO_FIELD');
rejects(()=>Z.validate({...initial,step:1}),'INVALID_ARTICUNO_STATE');
rejects(()=>Z.validate({...initial,ticket:1}),'INVALID_ARTICUNO_STATE');
rejects(()=>Z.validate({...won.story,ticket:0}),'INVALID_ARTICUNO_STATE');

console.log('P06 Arktos model passed: '+checks+' assertions; actual admission '+
 'and collection models, ordered preparation, fixed non-shiny level-50 '+
 'individual, single victory reservation, linked waiting/completed states, '+
 'auto/box/replacement, pinned care, retained replaced individual, full-box '+
 'waiting, release without renewed entitlement, reload containers and '+
 'invalid-state rejection. Pure candidates only; native victory authority, '+
 'whole-save wiring and story UI are not yet claimed.');

const pilot=require('../browser_ver/web/zapdos-story-model.js');
assert.equal(pilot.SOURCE,'story:kanto:zapdos');
assert.equal(Z.SOURCE,'story:kanto:articuno');
assert.throws(()=>pilot.validate(Z.create()));
assert.throws(()=>Z.validate(pilot.create()));
assert.throws(()=>pilot.decode(Z.encode(Z.create())));
assert.throws(()=>Z.decode(pilot.encode(pilot.create())));
for(const key of ['unknown','__proto__','constructor'])
 assert.throws(()=>pilot.forStory(key),
  error=>error.code==='UNSUPPORTED_STORY_PROFILE');
assert.equal(pilot.create().schema,'itamapoke.story.zapdos');
assert.equal(JSON.parse(pilot.encode(pilot.create())).format,'ITZ1');
assert.equal(Z.create().schema,'itamapoke.story.articuno');
assert.equal(JSON.parse(Z.encode(Z.create())).format,'ITA1');
console.log('P06 profile separation passed: Zapdos compatibility, '+
 'distinct Arktos schema/source/container, cross-profile refusal '+
 'and unsupported-profile refusal. No native/UI integration claim.');
