var dexLookupMode = false;
(function(root){
  "use strict";
  function normalize(value){return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^\p{L}\p{N}]/gu,"");}
  function matches(mon,filter,status){
    const raw=String(filter.query||"").trim().replace(/^#/,"");
    if(raw){
      if(/^\d+$/.test(raw)){if(mon.id!==Number(raw))return false;}
      else if(!Object.values(mon.names).some(name=>normalize(name).includes(normalize(raw))))return false;
    }
    if(Number(filter.gen)>0 && mon.gen!==Number(filter.gen))return false;
    if(Number(filter.type)>0 && !mon.types.includes(Number(filter.type)))return false;
    const s=status||{raised:false,caught:false};
    if(filter.status==="missing" && (s.raised||s.caught))return false;
    if(filter.status==="raised" && !s.raised)return false;
    if(filter.status==="caught" && !s.caught)return false;
    return true;
  }
  function family(data,id){
    const index=new Map(data.map(m=>[m.id,m]));
    function base(d){const seen=new Set();while(index.has(d)&&index.get(d).parent&&!seen.has(d)){seen.add(d);d=index.get(d).parent;}return d;}
    const origin=base(id);return data.filter(m=>base(m.id)===origin);
  }
  const api={normalize,matches,family};
  root.TPDexTools=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);
