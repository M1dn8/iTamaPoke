 'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const M=require('../browser_ver/web/collection-model.js');
const L=require('../browser_ver/web/league-team-state.js');
let checks=0;
const ok=v=>{assert(v);checks++;};
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const clone=v=>JSON.parse(JSON.stringify(v));

function fixture(count=2){
 return {
  region:0,phase:2,variant:0,index:0,active:0,
  care:{id:100,life:1,age:540,dex:150,
   geneAtk:100,geneDef:100,geneSpe:100,shiny:false},
  members:Array.from({length:count},(_,i)=>({
   id:100+i,dex:i?25:150,level:30,atk:100,def:400,spe:100,
   type1:1,type2:0,form:0,shiny:false,
   maxHp:580,hp:580,rests:5,wins:0,levelGains:0,
   nick:i?'Blitz "Zwei"':'Care'
  }))
 };
}
function hash(bytes,count=bytes.length){
 let h=2166136261;
 for(let i=0;i<count;i++)h=Math.imul(h^bytes[i],16777619)>>>0;
 return h;
}
function repair(bytes){
 new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength)
  .setUint32(bytes.length-4,hash(bytes,bytes.length-4),true);
 return bytes;
}
function pack(entries){
 const chunks=entries.map(([key,type,value])=>{
  const k=Buffer.from(key);
  let data;
  if(type===0)data=Buffer.from([+value]);
  else if(type===1){data=Buffer.alloc(8);data.writeBigInt64LE(BigInt(value));}
  else data=Buffer.from(value);
  const length=Buffer.alloc(4);length.writeUInt32LE(data.length);
  return Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),length,data]);
 });
 const count=Buffer.alloc(4);count.writeUInt32LE(chunks.length);
 return new Uint8Array(Buffer.concat([count,...chunks]));
}
function model(){
 const initial=clone(M.create());initial.nextId=100;
 return M.attachCurrent(initial,{
  dex:150,level:30,nickname:'Care',shiny:false,origin:'existing',
  data:{lifeToken:1,genes:{atk:100,def:100,spe:100},
   stats:{atk:100,def:400,spe:100}}
 });
}
function save(run,region=0){
 return pack([
  ['init',0,true],['dexn',1,150],['age',1,540],['blvl',1,20],
  ['gatk',1,100],['gdef',1,100],['gspe',1,100],
  ['f4lver',1,1],['f4life',1,1],
  ['f4col',3,new TextEncoder().encode(M.encode(model()))],
  [region===0?'lgver':'jlgver',1,1],
  [region===0?'lgkdone':'jlgdone',0,false],
  [region===0?'lgkdate':'jlgdate',1,0],
  [region===0?'lgkrun':'jlgrun',3,run]
 ]);
}
function parser(codec=true){
 const context={TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,
  TPCollectionModel:M,...(codec?{TPLeagueTeamState:L}:{})};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(
  'browser_ver/web/storage-tools.js','utf8'
 ),context);
 return context.TPStoreTools;
}

const baseline=fixture(),encoded=L.encode(baseline);
const native=process.env.P05_LEAGUE_STATE_NATIVE_HEX;
assert(native,'Native codec reference must be supplied by the quality runner');
eq(Buffer.from(encoded).toString('hex'),native);
eq(L.decode(encoded,0),baseline);
ok(Object.isFrozen(L.decode(encoded,0).members[0]));

for(const region of [0,1]){
 for(let variant=0;variant<(region===0?3:1);variant++){
  for(let count=1;count<=6;count++){
   for(const index of [0,1,19,20,25]){
    const s=fixture(count);
    Object.assign(s,{region,variant,index,phase:index?1:2});
    s.members[0].wins=index;s.members[0].levelGains=index;
    if(count>1){s.members[1].hp=0;s.members[1].rests=0;}
    if(count>2)s.members[2].nick='雷';
    const raw=L.encode(s);
    eq(L.decode(raw,region),s);
    eq(Buffer.from(L.encode(L.decode(raw,region))),Buffer.from(raw));
    assert.throws(()=>L.decode(raw,1-region));
   }
  }
 }
}

for(const mutate of [
 s=>s.region=2,s=>s.phase=3,s=>s.index=26,s=>s.active=6,
 s=>s.care.life=0,s=>s.members[1].id=100,
 s=>s.members[0].hp=0,s=>s.members[1].rests=6,
 s=>s.members[1].maxHp++,s=>s.members[1].wins=1,
 s=>s.members[1].nick='\ud800',
 s=>s.members[1].nick='\u0000',
 s=>s.members[1].nick='x'.repeat(24)
]){
 const bad=clone(baseline);mutate(bad);
 assert.throws(()=>L.encode(bad));checks++;
}
for(let size=0;size<encoded.length;size++)
 assert.throws(()=>L.decode(encoded.slice(0,size),0));
for(let index=0;index<encoded.length;index++){
 const bad=encoded.slice();bad[index]^=1;
 assert.throws(()=>L.decode(bad,0));
}
for(const [offset,value] of [
 [3,2],[4,3],[6,26],[7,6],[8,0],[26,2],
 [40,0],[43,2],[48,6],[49,1]
]){
 const bad=encoded.slice();bad[offset]=value;repair(bad);
 assert.throws(()=>L.decode(bad,0));
}
const P=parser();
for(const region of [0,1]){
 const s=fixture();s.region=region;
 const raw=L.encode(s),key=region===0?'lgkrun':'jlgrun';
 const parsed=P.parseLegacy(save(raw,region));
 eq(Buffer.from(parsed.values.get(key).value),Buffer.from(raw));
 assert.throws(()=>P.parseLegacy(save(raw,1-region)));
 const future=raw.slice();future[3]=2;repair(future);
 assert.throws(()=>P.parseLegacy(save(future,region)));
 const damaged=raw.slice();damaged[30]^=1;
 assert.throws(()=>P.parseLegacy(save(damaged,region)));
}
assert.throws(()=>parser(false).parseLegacy(save(encoded)));

// A well-formed old 88-byte single-player checkpoint remains untouched.
const legacy=new Uint8Array(88),view=new DataView(legacy.buffer);
const fields=[1,1,0,1,580,580,5,150,0,100,100,100,540,1,
 100,400,100,30,1,0,0];
fields.forEach((value,index)=>view.setUint32(index*4,value,true));
repair(legacy);
eq(Buffer.from(P.parseLegacy(save(legacy)).values.get('lgkrun').value),
 Buffer.from(legacy));

// A structurally valid historical team binding may be non-current.
// Resume ownership must be checked by the controller, not by erasing history.
const historical=fixture();historical.care.life=2;
ok(P.parseLegacy(save(L.encode(historical))).values.has('lgkrun'));

console.log('P05c JS league-state passed: '+checks+
 ' assertions plus rejection checks; actual native wire parity, immutable '+
 'regional roundtrips, UTF-8/bounds/checksum/future refusal, strict-save '+
 'team validation and unchanged legacy bytes. Historical actor bindings '+
 'preserved; no resume ownership or gameplay integration claimed.');
