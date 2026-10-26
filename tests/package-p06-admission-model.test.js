 'use strict';
const assert=require('node:assert/strict');
const M=require('../browser_ver/web/collection-model.js');
const A=require('../browser_ver/web/collection-admission-model.js');

const pokemon=(index=0)=>({
 dex:index===99?145:25,level:30,nickname:index===99?'Zapdos':'Mon '+index,
 shiny:false,origin:'wild',
 data:{stats:{atk:100,def:100,spe:100},genes:null,training:null}
});
function collection(count=5){
 let s=M.attachCurrent(M.create(),{
  dex:1,level:10,nickname:'Care',shiny:false,origin:'existing',
  data:{lifeToken:1,genes:{atk:100,def:100,spe:100}}
 });
 for(let i=0;i<count;i++){
  s=M.catchWild(s,pokemon(i));
  if(s.team.length<M.TEAM)s=M.selectTeam(s,s.nextId-1);
 }
 return s;
}
const throws=(fn,code)=>assert.throws(fn,e=>e.code===code);

const empty=A.create();
const pending=A.queue(empty,{
 kind:'join',source:'story:kanto:zapdos',pokemon:pokemon(99)
});
assert.equal(empty.pending,null);
assert.equal(pending.pending.ticket,1);
assert(Object.isFrozen(pending.pending.pokemon.data));
assert.deepEqual(A.decode(A.encode(pending)),pending);
throws(()=>A.queue(pending,{
 kind:'capture',source:'wild:2',pokemon:pokemon()
}),'ADMISSION_ALREADY_PENDING');

const fullTeam=collection();
const fullBefore=M.encode(fullTeam),pendingBefore=A.encode(pending);
throws(()=>A.complete(pending,fullTeam),'TEAM_DECISION_REQUIRED');
throws(()=>A.complete(pending,fullTeam,{
 mode:'replace',replaceId:fullTeam.active
}),'CARE_MEMBER_PINNED');
assert.equal(M.encode(fullTeam),fullBefore);
assert.equal(A.encode(pending),pendingBefore);

const replacement=fullTeam.team[2];
const placed=A.complete(pending,fullTeam,{
 mode:'replace',replaceId:replacement
});
assert.equal(placed.admission.pending,null);
assert.equal(placed.collection.team[2],placed.id);
assert.equal(placed.collection.active,fullTeam.active);
assert(placed.collection.mons.some(m=>m.id===replacement));
assert(placed.collection.boxes.some(b=>b.slots.includes(replacement)));
assert(placed.collection.boxes.some(b=>b.slots.includes(placed.id)));
assert.equal(placed.collection.mons.find(m=>m.id===placed.id).dex,145);
assert.deepEqual(
 placed.collection.mons.find(m=>m.id===placed.id).data.admission,
 {ticket:1,kind:'join',source:'story:kanto:zapdos'}
);
throws(()=>A.complete(pending,placed.collection,{
 mode:'box'
}),'ADMISSION_ALREADY_APPLIED');
throws(()=>A.complete(placed.admission,placed.collection),'NO_PENDING_ADMISSION');

// Preparing a candidate is not publishing it: old inputs remain unchanged.
assert.equal(M.encode(fullTeam),fullBefore);
assert.equal(A.encode(pending),pendingBefore);
const retry=A.complete(pending,fullTeam,{
 mode:'replace',replaceId:replacement
});
assert.deepEqual(retry,placed);

const boxed=A.complete(pending,fullTeam,{mode:'box'});
assert.deepEqual(boxed.collection.team,fullTeam.team);
assert.equal(boxed.collection.mons.length,fullTeam.mons.length+1);

const small=collection(1);
const automatic=A.complete(pending,small);
assert.deepEqual(automatic.collection.team,[...small.team,automatic.id]);
assert.equal(automatic.collection.active,small.active);

let packed=collection();
while(M.summary(packed).stored<200)
 packed=M.catchWild(packed,pokemon());
const packedBefore=M.encode(packed);
for(const choice of [
 {mode:'box'},{mode:'replace',replaceId:packed.team[1]}
]){
 throws(()=>A.complete(pending,packed,choice),'BOXES_FULL');
}
assert.equal(M.encode(packed),packedBefore);
assert.equal(A.encode(pending),pendingBefore);

// Reload pending state, free a real box slot, then finish without a new roll.
const reloaded=A.decode(A.encode(pending));
const released=packed.boxes.flatMap(b=>b.slots)
 .find(id=>id!==null&&!packed.team.includes(id));
const freed=M.releaseStored(packed,released,{confirmed:true});
const admitted=A.complete(reloaded,freed,{mode:'box'});
assert.equal(admitted.collection.mons.find(m=>m.id===admitted.id).dex,145);
assert.equal(admitted.admission.pending,null);

const next=A.queue(placed.admission,{
 kind:'capture',source:'wild:next',pokemon:pokemon()
});
assert.equal(next.pending.ticket,2);
assert.equal(next.pending.kind,'capture');

const reserved=pokemon();reserved.data.admission={ticket:1};
assert.throws(()=>A.queue(empty,{
 kind:'capture',source:'wild:bad',pokemon:reserved
}));
assert.throws(()=>A.queue(empty,{
 kind:'capture',source:'',pokemon:pokemon()
}));

function envelope(state){
 const payload=JSON.stringify(state);let hash=2166136261;
 for(const byte of new TextEncoder().encode(payload))
  hash=Math.imul(hash^byte,16777619);
 return JSON.stringify({
  format:'ITA1',payload,checksum:(hash>>>0).toString(16).padStart(8,'0')
 });
}
const future=JSON.parse(JSON.stringify(pending));future.version=2;
throws(()=>A.decode(envelope(future)),'UNSUPPORTED_ADMISSION_VERSION');
const unknown=JSON.parse(JSON.stringify(pending));unknown.extra=true;
throws(()=>A.decode(envelope(unknown)),'UNKNOWN_ADMISSION_FIELD');

const raw=A.encode(pending);
for(let i=0;i<raw.length;i++){
 const damaged=raw.slice(0,i)+String.fromCharCode(raw.charCodeAt(i)^1)+
  raw.slice(i+1);
 assert.throws(()=>A.decode(damaged));
}
console.log('P06 admission model passed: bounded immutable capture/join '+
 'reservation, version/checksum/counter guards, one pending admission, '+
 'automatic team addition, explicit full-team decision, pinned care ID, '+
 'position-preserving replacement without release, box-only choice, '+
 'full-box waiting/reload/free-slot completion, provenance tickets and '+
 'duplicate-application refusal. No native persistence, catch migration, '+
 'gameplay lock or dialog integration claimed.');
