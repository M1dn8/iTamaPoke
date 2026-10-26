/* P06 immutable admission model. No native calls, storage or UI.
 * A bounded pending admission is separate from the ordinary collection.
 * The caller must persist admission+collection candidates atomically.
 */
(function(root,factory){
 'use strict';
 if(typeof module==='object'&&module.exports)
  module.exports=factory(require('./collection-model.js'));
 else root.TPAdmissionModel=factory(root.TPCollectionModel);
})(typeof globalThis!=='undefined'?globalThis:this,function(M){
 'use strict';
 const VERSION=1,MAX_BYTES=65536,MAX_COUNTER=0x7fffffff;
 const MAX_REVISION=0x7ffffffe;
 const encoder=new TextEncoder();
 class AdmissionError extends Error{
  constructor(code){super(code);this.name='AdmissionError';this.code=code;}
 }
 const fail=code=>{throw new AdmissionError(code);};
 const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v)&&
  Object.getPrototypeOf(v)===Object.prototype;
 function keys(value,expected){
  if(!plain(value))fail('INVALID_ADMISSION_OBJECT');
  const actual=Object.keys(value);
  if(actual.length!==expected.length||actual.some(k=>!expected.includes(k)))
   fail('UNKNOWN_ADMISSION_FIELD');
 }
 function clone(value){return JSON.parse(JSON.stringify(value));}
 function freeze(value){
  if(value&&typeof value==='object'&&!Object.isFrozen(value)){
   for(const item of Object.values(value))freeze(item);
   Object.freeze(value);
  }
  return value;
 }
 function tagged(pending){
  const pokemon=clone(pending.pokemon);
  if(!plain(pokemon.data)||Object.hasOwn(pokemon.data,'admission'))
   fail('RESERVED_ADMISSION_METADATA');
  // Existing collection origin "wild" identifies non-care encounters.
  // capture/join provenance is retained explicitly, not invented later.
  pokemon.data.admission={
   ticket:pending.ticket,kind:pending.kind,source:pending.source
  };
  return pokemon;
 }
 function validate(state){
  keys(state,['schema','version','revision','nextTicket','pending']);
  if(state.schema!=='itamapoke.admission'||state.version!==VERSION)
   fail('UNSUPPORTED_ADMISSION_VERSION');
  if(!integer(state.revision,0,MAX_REVISION)||
     !integer(state.nextTicket,1,MAX_COUNTER))
   fail('INVALID_ADMISSION_COUNTER');
  if(state.pending!==null){
   const p=state.pending;
   keys(p,['ticket','kind','source','pokemon']);
   if(!integer(p.ticket,1,state.nextTicket-1)||
      !['capture','join'].includes(p.kind)||
      typeof p.source!=='string'||
      !/^[a-z][a-z0-9._:-]{0,95}$/.test(p.source)||
      state.revision>=MAX_REVISION)
    fail('INVALID_PENDING_ADMISSION');
   // Reuse actual collection snapshot validation, including UTF-8,
   // data limits and the existing non-care origin rule.
   M.catchWild(M.create(),tagged(p));
  }
  return state;
 }
 function create(){
  return freeze({
   schema:'itamapoke.admission',version:VERSION,
   revision:0,nextTicket:1,pending:null
  });
 }
 function change(state,update){
  validate(state);
  if(state.revision>=MAX_REVISION)fail('ADMISSION_REVISION_EXHAUSTED');
  const next=clone(state);update(next);next.revision++;
  validate(next);return freeze(next);
 }
 function checksum(text){
  let hash=2166136261;
  for(const byte of encoder.encode(text))
   hash=Math.imul(hash^byte,16777619);
  return (hash>>>0).toString(16).padStart(8,'0');
 }
 function encode(state){
  validate(state);
  const payload=JSON.stringify(state);
  const result=JSON.stringify({
   format:'ITA1',payload,checksum:checksum(payload)
  });
  if(encoder.encode(result).length>MAX_BYTES)
   fail('ADMISSION_TOO_LARGE');
  return result;
 }
 function decode(raw){
  if(typeof raw!=='string'||encoder.encode(raw).length>MAX_BYTES)
   fail('INVALID_ADMISSION_CONTAINER');
  let envelope,state;
  try{envelope=JSON.parse(raw);}catch(_){fail('INVALID_ADMISSION_CONTAINER');}
  keys(envelope,['format','payload','checksum']);
  if(envelope.format!=='ITA1'||typeof envelope.payload!=='string'||
     typeof envelope.checksum!=='string'||
     envelope.checksum!==checksum(envelope.payload))
   fail('INVALID_ADMISSION_CHECKSUM');
  try{state=JSON.parse(envelope.payload);}
  catch(_){fail('INVALID_ADMISSION_PAYLOAD');}
  validate(state);return freeze(state);
 }
 function queue(state,{kind,source,pokemon}){
  validate(state);
  if(state.pending!==null)fail('ADMISSION_ALREADY_PENDING');
  if(state.nextTicket>=MAX_COUNTER)fail('ADMISSION_TICKETS_EXHAUSTED');
  // Leave one revision available to finish the reserved admission.
  if(state.revision>=MAX_REVISION-1)fail('ADMISSION_REVISION_EXHAUSTED');
  const next=change(state,n=>{
   n.pending={ticket:n.nextTicket++,kind,source,pokemon:clone(pokemon)};
  });
  encode(next);return next;
 }
 function complete(state,collection,options={}){
  validate(state);M.validate(collection);
  if(!state.pending)fail('NO_PENDING_ADMISSION');
  if(!plain(options)||Object.keys(options).some(
   k=>!['mode','replaceId','box'].includes(k)
  ))fail('INVALID_ADMISSION_CHOICE');
  const mode=options.mode??'auto',box=options.box??0;
  if(!['auto','box','replace'].includes(mode)||
     !integer(box,0,M.BOXES-1))fail('INVALID_ADMISSION_CHOICE');
  const pending=state.pending;
  if(collection.mons.some(m=>
   m.data.admission?.ticket===pending.ticket
  ))fail('ADMISSION_ALREADY_APPLIED');
  if(M.summary(collection).stored>=M.BOXES*M.SLOTS)fail('BOXES_FULL');

  if(mode==='replace'){
   if(options.replaceId===collection.active)fail('CARE_MEMBER_PINNED');
   if(collection.team.length!==M.TEAM||
      !collection.team.includes(options.replaceId))
    fail('INVALID_REPLACEMENT_MEMBER');
  }else{
   if(options.replaceId!==undefined)fail('INVALID_ADMISSION_CHOICE');
   if(mode==='auto'&&collection.team.length>=M.TEAM)
    fail('TEAM_DECISION_REQUIRED');
  }

  const id=collection.nextId;
  let nextCollection=M.catchWild(collection,tagged(pending),box);
  if(mode==='auto')nextCollection=M.selectTeam(nextCollection,id);
  else if(mode==='replace')
   nextCollection=M.selectTeam(nextCollection,id,options.replaceId);
  const nextAdmission=change(state,n=>{n.pending=null;});
  return freeze({
   admission:nextAdmission,collection:nextCollection,
   id,ticket:pending.ticket
  });
 }
 return Object.freeze({
  VERSION,MAX_BYTES,AdmissionError,create,validate,encode,decode,queue,complete
 });
});
