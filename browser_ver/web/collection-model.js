/* iTamaPoke F4-A: immutable collection/box rules. No game hooks or I/O.
 * Existing dex bitmaps are deliberately NOT inputs to this model.
 * Original implementation; no third-party party blobs or battle math.
 */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TPCollectionModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const BOXES=10,SLOTS=20,TEAM=6,MAX_ID=0xffffffff,MAX_TEXT=4*1024*1024;
class CollectionError extends Error{constructor(code){super(code);this.name='CollectionError';this.code=code;}}
function fail(code){throw new CollectionError(code);}
function int(v,min,max){return Number.isSafeInteger(v)&&v>=min&&v<=max;}
function plain(v){return !!v&&typeof v==='object'&&!Array.isArray(v)&&Object.getPrototypeOf(v)===Object.prototype;}
function keys(v,names){if(!plain(v))fail('INVALID_OBJECT');const k=Object.keys(v);if(k.length!==names.length||k.some(x=>!names.includes(x)))fail('UNKNOWN_OR_MISSING_FIELD');}
function utf8(s){return new TextEncoder().encode(s);}
function text(s,maxBytes){if(typeof s!=='string'||utf8(s).length>maxBytes||/[\u0000-\u001f\u007f]/u.test(s))return false;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);if(c>=0xd800&&c<=0xdbff){const d=s.charCodeAt(++i);if(!(d>=0xdc00&&d<=0xdfff))return false;}else if(c>=0xdc00&&c<=0xdfff)return false;}return true;}
function jsonData(v,depth=0,budget={n:0}){if(++budget.n>1024||depth>8)fail('DATA_TOO_COMPLEX');if(v===null||typeof v==='boolean')return;if(typeof v==='number'){if(!Number.isFinite(v))fail('INVALID_DATA');return;}if(typeof v==='string'){if(!text(v,4096))fail('INVALID_DATA');return;}if(Array.isArray(v)){for(const x of v)jsonData(x,depth+1,budget);return;}if(!plain(v))fail('INVALID_DATA');for(const k of Object.keys(v)){if(['__proto__','constructor','prototype'].includes(k)||!text(k,80))fail('INVALID_DATA_KEY');jsonData(v[k],depth+1,budget);}}
function snapshot(m){keys(m,['dex','level','nickname','shiny','origin','data']);if(!int(m.dex,1,1025)||!int(m.level,1,100)||!text(m.nickname,23)||typeof m.shiny!=='boolean'||!['existing','raised','wild'].includes(m.origin)||!plain(m.data))fail('INVALID_POKEMON');jsonData(m.data);if(utf8(JSON.stringify(m.data)).length>16384)fail('DATA_TOO_LARGE');}
function validate(s){keys(s,['schema','version','revision','nextId','boxes','active','team','mons']);if(s.schema!=='itamapoke.collection'||s.version!==1)fail('UNSUPPORTED_VERSION');if(!int(s.revision,0,0x7ffffffe)||!int(s.nextId,1,MAX_ID))fail('INVALID_COUNTER');if(!Array.isArray(s.boxes)||s.boxes.length!==BOXES||!Array.isArray(s.mons)||s.mons.length>BOXES*SLOTS+1||!Array.isArray(s.team)||s.team.length>TEAM)fail('INVALID_CAPACITY');
 const ids=new Set();let maximum=0;for(const m of s.mons){keys(m,['id','dex','level','nickname','shiny','origin','data']);const {id,...rest}=m;if(!int(id,1,MAX_ID-1)||ids.has(id))fail('INVALID_ID');snapshot(rest);ids.add(id);maximum=Math.max(maximum,id);}if(s.nextId<=maximum)fail('INVALID_NEXT_ID');
 const locations=new Set();function use(id){if(!ids.has(id)||locations.has(id))fail('INVALID_LOCATION');locations.add(id);}
 if(s.active!==null){use(s.active);const m=s.mons.find(x=>x.id===s.active);if(m.origin==='wild')fail('WILD_CANNOT_BECOME_CARE_PET');}
 for(const b of s.boxes){keys(b,['name','slots']);if(!text(b.name,160)||!b.name.trim()||!Array.isArray(b.slots)||b.slots.length!==SLOTS)fail('INVALID_BOX');for(const id of b.slots)if(id!==null)use(id);}
 if(locations.size!==ids.size)fail('ORPHAN_POKEMON');const selected=new Set();for(const id of s.team){if(!ids.has(id)||selected.has(id))fail('INVALID_TEAM');selected.add(id);}return s;
}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){for(const x of Object.values(v))freeze(x);Object.freeze(v);}return v;}
function clone(v){return JSON.parse(JSON.stringify(v));}
function create(){return freeze({schema:'itamapoke.collection',version:1,revision:0,nextId:1,boxes:Array.from({length:BOXES},(_,i)=>({name:'Box '+(i+1),slots:Array(SLOTS).fill(null)})),active:null,team:[],mons:[]});}
function change(s,fn){validate(s);const n=clone(s);fn(n);if(s.revision>=0x7ffffffe)fail('REVISION_EXHAUSTED');n.revision=s.revision+1;validate(n);return freeze(n);}
function mon(s,id){const m=s.mons.find(x=>x.id===id);if(!m)fail('NOT_FOUND');return m;}
function boxIndex(i){if(!int(i,0,BOXES-1))fail('INVALID_BOX_INDEX');}
function freeSlot(s,start){boxIndex(start);for(let k=0;k<BOXES;k++){const box=(start+k)%BOXES,slot=s.boxes[box].slots.indexOf(null);if(slot>=0)return {box,slot};}fail('BOXES_FULL');}
function stored(s,id){for(let box=0;box<BOXES;box++){const slot=s.boxes[box].slots.indexOf(id);if(slot>=0)return {box,slot};}fail(id===s.active?'ACTIVE_NOT_IN_BOX':'NOT_FOUND');}
function allocate(s,m){if(s.nextId>=MAX_ID)fail('IDS_EXHAUSTED');const id=s.nextId++;s.mons.push({id,...clone(m)});return id;}
function attachCurrent(s,m){snapshot(m);if(m.origin==='wild')fail('WILD_CANNOT_BECOME_CARE_PET');return change(s,n=>{if(n.active!==null)fail('CARE_PET_EXISTS');n.active=allocate(n,m);if(m.origin==='existing'&&n.team.length<TEAM)n.team.push(n.active);});}
function syncCurrent(s,id,m){snapshot(m);return change(s,n=>{if(n.active!==id)fail('STALE_CARE_ID');const old=mon(n,id);if(old.origin!==m.origin)fail('ORIGIN_CHANGED');n.mons[n.mons.indexOf(old)]={id,...clone(m)};});}
function catchWild(s,m,start=0){snapshot(m);if(m.origin!=='wild')fail('NOT_A_WILD_CAPTURE');return change(s,n=>{const place=freeSlot(n,start),id=allocate(n,m);n.boxes[place.box].slots[place.slot]=id;});}
function endCare(s,id,mode,{box=0,confirmed=false}={}){if(!['keep','release','runaway'].includes(mode))fail('INVALID_ENDING');if(mode==='release'&&confirmed!==true)fail('CONFIRMATION_REQUIRED');return change(s,n=>{if(n.active!==id)fail('STALE_CARE_ID');mon(n,id);if(mode==='keep'){const at=freeSlot(n,box);n.boxes[at.box].slots[at.slot]=id;}else{n.mons=n.mons.filter(m=>m.id!==id);n.team=n.team.filter(x=>x!==id);}n.active=null;});}
function renameBox(s,box,name){boxIndex(box);return change(s,n=>{n.boxes[box].name=name;});}
function renamePokemon(s,id,name){return change(s,n=>{mon(n,id).nickname=name;});}
function moveBox(s,id,target){boxIndex(target);return change(s,n=>{const from=stored(n,id);if(from.box===target)return;const slot=n.boxes[target].slots.indexOf(null);if(slot<0)fail('TARGET_BOX_FULL');n.boxes[from.box].slots[from.slot]=null;n.boxes[target].slots[slot]=id;});}
function selectTeam(s,id,replaceId=null){return change(s,n=>{mon(n,id);if(n.team.includes(id))fail('ALREADY_SELECTED');if(replaceId!==null){const at=n.team.indexOf(replaceId);if(at<0)fail('REPLACEMENT_NOT_SELECTED');n.team[at]=id;}else{if(n.team.length>=TEAM)fail('TEAM_FULL');n.team.push(id);}});}
function unselectTeam(s,id){return change(s,n=>{const at=n.team.indexOf(id);if(at<0)fail('NOT_SELECTED');n.team.splice(at,1);});}
function moveTeam(s,id,direction){if(direction!==-1&&direction!==1)fail('INVALID_DIRECTION');return change(s,n=>{const at=n.team.indexOf(id);if(at<0)fail('NOT_SELECTED');const to=at+direction;if(to<0||to>=n.team.length)return;[n.team[at],n.team[to]]=[n.team[to],n.team[at]];});}
function releaseStored(s,id,{confirmed=false}={}){if(confirmed!==true)fail('CONFIRMATION_REQUIRED');return change(s,n=>{const p=stored(n,id);n.boxes[p.box].slots[p.slot]=null;n.mons=n.mons.filter(m=>m.id!==id);n.team=n.team.filter(x=>x!==id);});}
// P05: called by the bound native result action, not a generic UI operation.
function grantStoredBattleLevel(s,id){
 validate(s);stored(s,id);
 const current=mon(s,id);
 if(current.level===100)return s;
 const stats=current.data.stats;
 if(!plain(stats)||!['atk','def','spe'].every(k=>int(stats[k],1,65534)))fail('BATTLE_STATS_UNAVAILABLE');
 return change(s,n=>{
  const m=mon(n,id);
  m.level++;
  for(const k of ['atk','def','spe'])m.data.stats[k]++;
 });
}
function summary(s){validate(s);return freeze({stored:s.boxes.reduce((a,b)=>a+b.slots.filter(x=>x!==null).length,0),capacity:BOXES*SLOTS,active:s.active,team:s.team.slice(),boxes:s.boxes.map(b=>({name:b.name,used:b.slots.filter(x=>x!==null).length,capacity:SLOTS}))});}
function checksum(str){let h=2166136261;for(const b of utf8(str)){h^=b;h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');}
function encode(s){validate(s);const payload=JSON.stringify(s);return JSON.stringify({format:'ITC1',payload,checksum:checksum(payload)});}
function decode(raw){if(typeof raw!=='string'||utf8(raw).length>MAX_TEXT)fail('INVALID_CONTAINER');let e;try{e=JSON.parse(raw);}catch(_){fail('INVALID_CONTAINER');}keys(e,['format','payload','checksum']);if(e.format!=='ITC1'||typeof e.payload!=='string'||typeof e.checksum!=='string'||checksum(e.payload)!==e.checksum)fail('INVALID_CHECKSUM');let s;try{s=JSON.parse(e.payload);}catch(_){fail('INVALID_PAYLOAD');}validate(s);return freeze(s);}
// Persistence adapter: prepare an immutable candidate; publish only when the
// caller's atomic durable write resolves. Rejected writes keep the old model.
// This does not yet implement the native Pet/IndexedDB whole-save transaction.
function session(initial,persist){if(typeof persist!=='function')fail('PERSIST_REQUIRED');let state=decode(encode(initial)),busy=false;return Object.freeze({get(){return state;},get busy(){return busy;},async apply(operation,...args){if(busy)fail('BUSY');if(!['attachCurrent','syncCurrent','catchWild','endCare','renameBox','renamePokemon','moveBox','selectTeam','unselectTeam','moveTeam','releaseStored'].includes(operation))fail('UNKNOWN_OPERATION');busy=true;try{const candidate=api[operation](state,...args);const result=await persist(encode(candidate));if(result===false)fail('PERSIST_REJECTED');state=candidate;return state;}finally{busy=false;}}});}
const api=Object.freeze({BOXES,SLOTS,TEAM,CollectionError,create,validate,attachCurrent,syncCurrent,catchWild,endCare,renameBox,renamePokemon,moveBox,selectTeam,unselectTeam,moveTeam,releaseStored,grantStoredBattleLevel,summary,encode,decode,session});return api;
});
