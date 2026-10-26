/* P05c team-run wire codec. No gameplay, collection mutation or I/O. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPLeagueTeamState=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const enc=new TextEncoder(),dec=new TextDecoder('utf-8',{fatal:true});
 const MAX=1024;
 function fail(){throw Object.assign(Error('INVALID_LEAGUE_TEAM_STATE'),{
  code:'INVALID_LEAGUE_TEAM_STATE'
 });}
 const int=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 const id=v=>int(v,1,0xfffffffe);
 function name(s){
  if(typeof s!=='string'||enc.encode(s).length>23||
     /[\u0000-\u001f\u007f]/u.test(s))return false;
  for(let i=0;i<s.length;i++){
   const c=s.charCodeAt(i);
   if(c>=0xd800&&c<=0xdbff){
    const next=s.charCodeAt(++i);
    if(!(next>=0xdc00&&next<=0xdfff))return false;
   }else if(c>=0xdc00&&c<=0xdfff)return false;
  }
  return true;
 }
 function maxHp(m){
  return Math.min(65535,Math.max(
   30+m.level*5+m.def,18+m.level*3+Math.floor(m.def/2)
  ));
 }
 function validateState(s,terminal){
  if(!s||!int(s.region,0,1)||![1,2].includes(s.phase)||
     !int(s.variant,0,s.region===0?2:0)||
     (terminal?s.index!==26:!int(s.index,0,25))||
     (terminal&&s.phase!==1)||
     s.phase===1&&s.index===0||
     !Array.isArray(s.members)||!int(s.members.length,1,6)||
     !int(s.active,0,s.members.length-1))fail();
  const c=s.care;
  if(!c||!id(c.id)||!int(c.life,1,0x7fffffff)||
     !int(c.age,0,0xffffffff)||!int(c.dex,1,1025)||
     !['geneAtk','geneDef','geneSpe'].every(k=>int(c[k],0,255))||
     typeof c.shiny!=='boolean')fail();
  const ids=new Set();
  let wins=0;
  for(const m of s.members){
   if(!m||!id(m.id)||ids.has(m.id)||!int(m.dex,1,1025)||
      !int(m.level,1,100)||
      !['atk','def','spe'].every(k=>int(m[k],1,65535))||
      !int(m.type1,1,18)||!int(m.type2,0,18)||!int(m.form,0,3)||
      typeof m.shiny!=='boolean'||!name(m.nick)||
      !int(m.maxHp,1,65535)||m.maxHp!==maxHp(m)||
      !int(m.hp,0,m.maxHp)||!int(m.rests,0,5)||
      !int(m.wins,0,26)||
      !int(m.levelGains,0,Math.min(m.wins,100-m.level)))fail();
   if(m.id===c.id){
    if(m.dex!==c.dex||m.shiny!==c.shiny)fail();
   }else if(m.levelGains!==Math.min(m.wins,100-m.level))fail();
   ids.add(m.id);wins+=m.wins;
  }
  if(wins!==s.index||s.members[s.active].hp===0)fail();
  return s;
 }
 function validate(s){return validateState(s,false);}
 function validateTerminal(s){return validateState(s,true);}
 function checksum(b,count=b.length){
  let value=2166136261;
  for(let i=0;i<count;i++){
   value^=b[i];value=Math.imul(value,16777619);
  }
  return value>>>0;
 }
 function freeze(v){
  if(v&&typeof v==='object'){
   for(const item of Object.values(v))freeze(item);
   Object.freeze(v);
  }
  return v;
 }
 function encodeWire(s,terminal){
  validateState(s,terminal);
  const out=[76,84,s.region===0?75:74,1,
   s.phase,s.variant,s.index,s.active,s.members.length];
  const byte=v=>out.push(v&255);
  const word=v=>{byte(v);byte(v>>>8);};
  const number=v=>{for(let i=0;i<4;i++)byte(v>>>(8*i));};
  const c=s.care;
  number(c.id);number(c.life);number(c.age);word(c.dex);
  byte(c.geneAtk);byte(c.geneDef);byte(c.geneSpe);byte(+c.shiny);
  for(const m of s.members){
   number(m.id);word(m.dex);byte(m.level);
   word(m.atk);word(m.def);word(m.spe);
   byte(m.type1);byte(m.type2);byte(m.form);byte(+m.shiny);
   word(m.maxHp);word(m.hp);
   byte(m.rests);byte(m.wins);byte(m.levelGains);
   const nick=enc.encode(m.nick);byte(nick.length);
   out.push(...nick);
  }
  number(checksum(out));
  if(out.length>MAX)fail();
  return Uint8Array.from(out);
 }
 function encode(s){return encodeWire(s,false);}
 function encodeTerminal(s){return encodeWire(s,true);}
 function decodeWire(input,region,terminal){
  const b=input instanceof Uint8Array?input:new Uint8Array(input);
  if(!int(region,0,1)||b.length<31||b.length>MAX||
     b[0]!==76||b[1]!==84||b[2]!==(
      region===0?75:74
     )||b[3]!==1)fail();
  const end=b.length-4;
  const view=new DataView(b.buffer,b.byteOffset,b.byteLength);
  if(view.getUint32(end,true)!==checksum(b,end))fail();
  let at=4;
  const requireBytes=n=>{if(at+n>end)fail();};
  const byte=()=>{requireBytes(1);return b[at++];};
  const word=()=>{requireBytes(2);const n=view.getUint16(at,true);at+=2;return n;};
  const number=()=>{requireBytes(4);const n=view.getUint32(at,true);at+=4;return n;};
  const boolean=()=>{const n=byte();if(n>1)fail();return !!n;};
  const s={
   region,phase:byte(),variant:byte(),index:byte(),active:byte(),
   care:null,members:[]
  };
  const count=byte();
  if(!int(count,1,6))fail();
  s.care={
   id:number(),life:number(),age:number(),dex:word(),
   geneAtk:byte(),geneDef:byte(),geneSpe:byte(),shiny:boolean()
  };
  for(let i=0;i<count;i++){
   const m={
    id:number(),dex:word(),level:byte(),
    atk:word(),def:word(),spe:word(),
    type1:byte(),type2:byte(),form:byte(),shiny:boolean(),
    maxHp:word(),hp:word(),rests:byte(),wins:byte(),levelGains:byte(),
    nick:''
   };
   const length=byte();
   if(length>23)fail();
   requireBytes(length);
   try{m.nick=dec.decode(b.slice(at,at+length));}catch(_){fail();}
   at+=length;s.members.push(m);
  }
  if(at!==end)fail();
  validateState(s,terminal);
  return freeze(s);
 }
 function decode(input,region){return decodeWire(input,region,false);}
 function decodeTerminal(input,region){
  return decodeWire(input,region,true);
 }
 return Object.freeze({
  MAX,validate,encode,decode,validateTerminal,encodeTerminal,decodeTerminal
 });
});
