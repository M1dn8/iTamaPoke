/* P06 Zapdos pilot state. Pure candidates only, no battle/storage authority.
 * A trusted native-result adapter must verify victory before confirmVictory().
 * Persist the returned story and admission together in the existing transaction.
 */
(function(root,factory){
 'use strict';
 if(typeof module==='object'&&module.exports)
  module.exports=factory(require('./collection-admission-model.js'),require('./collection-model.js'));
 else root.TPZapdosModel=factory(root.TPAdmissionModel,root.TPCollectionModel);
})(typeof globalThis!=='undefined'?globalThis:this,function storyFactory(A,M,profile){
 'use strict';
 if(profile===undefined)profile='zapdos';
 const profiles=Object.freeze({
  zapdos:Object.freeze({
   dex:145,source:'story:kanto:zapdos',
   schema:'itamapoke.story.zapdos',format:'ITZ1',code:'ZAPDOS'
  }),
  articuno:Object.freeze({
   dex:144,source:'story:kanto:articuno',
   schema:'itamapoke.story.articuno',format:'ITA1',code:'ARTICUNO'
  })
 });
 if(!Object.prototype.hasOwnProperty.call(profiles,profile))
  throw Object.assign(Error('UNSUPPORTED_STORY_PROFILE'),{
   code:'UNSUPPORTED_STORY_PROFILE'
  });
 const config=profiles[profile];
 const VERSION=1,MAX_BYTES=4096,SOURCE=config.source;
 const SCHEMA=config.schema,FORMAT=config.format,DEX=config.dex;
 const encoder=new TextEncoder();
 class StoryError extends Error{
  constructor(code){super(code);this.name='StoryError';this.code=code;}
 }
 const fail=code=>{
  throw new StoryError(code.replace(/ZAPDOS/g,config.code));
 };
 const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v)&&
  Object.getPrototypeOf(v)===Object.prototype;
 function keys(value,expected){
  if(!plain(value))fail('INVALID_ZAPDOS_OBJECT');
  const actual=Object.keys(value);
  if(actual.length!==expected.length||actual.some(k=>!expected.includes(k)))
   fail('UNKNOWN_ZAPDOS_FIELD');
 }
 function freeze(value){
  if(value&&typeof value==='object'&&!Object.isFrozen(value)){
   for(const item of Object.values(value))freeze(item);
   Object.freeze(value);
  }
  return value;
 }
 function validate(state){
  keys(state,['schema','version','revision','step','ticket']);
  if(state.schema!==SCHEMA||state.version!==VERSION)
   fail('UNSUPPORTED_ZAPDOS_VERSION');
  if(!integer(state.step,0,3)||state.revision!==state.step||
     !integer(state.ticket,0,0x7ffffffe)||
     (state.step===3?state.ticket===0:state.ticket!==0))
   fail('INVALID_ZAPDOS_STATE');
  return state;
 }
 function create(){
  return freeze({
   schema:SCHEMA,version:VERSION,
   revision:0,step:0,ticket:0
  });
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
   format:FORMAT,payload,checksum:checksum(payload)
  });
  if(encoder.encode(result).length>MAX_BYTES)fail('ZAPDOS_STATE_TOO_LARGE');
  return result;
 }
 function decode(raw){
  if(typeof raw!=='string'||encoder.encode(raw).length>MAX_BYTES)
   fail('INVALID_ZAPDOS_CONTAINER');
  let envelope,state;
  try{envelope=JSON.parse(raw);}catch(_){fail('INVALID_ZAPDOS_CONTAINER');}
  keys(envelope,['format','payload','checksum']);
  if(envelope.format!==FORMAT||typeof envelope.payload!=='string'||
     typeof envelope.checksum!=='string'||
     envelope.checksum!==checksum(envelope.payload))
   fail('INVALID_ZAPDOS_CHECKSUM');
  try{state=JSON.parse(envelope.payload);}
  catch(_){fail('INVALID_ZAPDOS_PAYLOAD');}
  validate(state);return freeze(state);
 }
 function advance(state,action){
  validate(state);
  if(!((state.step===0&&action==='investigate')||
       (state.step===1&&action==='secure')))
   fail('INVALID_ZAPDOS_TRANSITION');
  return freeze({...state,step:state.step+1,revision:state.revision+1});
 }
 function pokemonValid(pokemon){
  if(!plain(pokemon)||pokemon.dex!==DEX||pokemon.level!==50||
     pokemon.shiny!==false||pokemon.origin!=='wild')
   fail('INVALID_ZAPDOS_INDIVIDUAL');
 }
 function validateLink(state,admission){
  validate(state);A.validate(admission);
  const pending=admission.pending;
  if(state.step!==3){
   if(pending?.source===SOURCE)fail('ORPHAN_ZAPDOS_ADMISSION');
   return state;
  }
  if(admission.nextTicket<=state.ticket)
   fail('ZAPDOS_TICKET_NOT_RESERVED');
  if(pending){
   if(pending.ticket<state.ticket)fail('ZAPDOS_ADMISSION_ORDER');
   if(pending.ticket===state.ticket){
    if(pending.kind!=='join'||pending.source!==SOURCE)
     fail('ZAPDOS_ADMISSION_MISMATCH');
    pokemonValid(pending.pokemon);
   }else if(pending.source===SOURCE){
    fail('DUPLICATE_ZAPDOS_ADMISSION');
   }
  }
  return state;
 }
 function fromNative(version,step,ticket){
  return freeze(validate({
   schema:SCHEMA,version,
   revision:step,step,ticket
  }));
 }
 function validateProfile(state,admission,collection){
  validateLink(state,admission);M.validate(collection);
  const joined=collection.mons.filter(
   m=>m.data.admission?.source===SOURCE
  );
  if(joined.length>1)fail('DUPLICATE_ZAPDOS_INDIVIDUAL');
  for(const m of joined){
   if(state.step!==3||m.data.admission.ticket!==state.ticket||
      m.data.admission.kind!=='join'||m.dex!==DEX||m.level<50||
      m.shiny!==false||m.origin!=='wild')
    fail('ZAPDOS_COLLECTION_MISMATCH');
  }
  return state;
 }
 function confirmVictory(state,admission,pokemon){
  validateLink(state,admission);
  if(state.step!==2)fail('ZAPDOS_NOT_READY');
  pokemonValid(pokemon);
  const nextAdmission=A.queue(admission,{
   kind:'join',source:SOURCE,pokemon
  });
  const story=freeze({
   ...state,step:3,revision:3,ticket:nextAdmission.pending.ticket
  });
  validateLink(story,nextAdmission);
  return freeze({story,admission:nextAdmission});
 }
 function view(state,admission){
  validateLink(state,admission);
  const waiting=state.step===3&&
   admission.pending?.ticket===state.ticket;
  return freeze({
   phase:state.step===3?(waiting?'waiting':'complete'):
    ['investigate','secure','duel'][state.step],
   canBattle:state.step===2&&admission.pending===null,
   ticket:state.ticket
  });
 }
 return Object.freeze({
  forStory:name=>storyFactory(A,M,name),
  VERSION,MAX_BYTES,SOURCE,StoryError,create,validate,encode,decode,
  advance,validateLink,validateProfile,fromNative,confirmVictory,view
 });
});
