// Package A: local-only development inspector and searchable dex.
let tpDexFilter = {query:"",gen:0,type:0,status:"all"};
let tpDexCacheKey = "";
let tpDexCacheIds = [];
function tpComfortDexIds(){
  const key=JSON.stringify(tpDexFilter)+":"+fns.registeredCount()+":"+fns.caughtCount()+":"+dexFilter;
  if(key!==tpDexCacheKey){
    tpDexCacheKey=key;
    tpDexCacheIds=TP_DEX_META.filter(m=>TPDexTools.matches(m,tpDexFilter,{raised:!!fns.dexRegistered(m.id),caught:!!fns.dexCaught(m.id)})&&dexVisible(m.id)).map(m=>m.id);
  }
  return tpDexCacheIds;
}
(function(){
  "use strict";
  const typeNames=["Alle Typen","Normal","Feuer","Wasser","Elektro","Pflanze","Eis","Kampf","Gift","Boden","Flug","Psycho","Kaefer","Gestein","Geist","Drache","Unlicht","Stahl","Fee"];
  const langCodes=["es","en","fr","de","it","pt","ko","ko"];
  let previousFocus=null;
  let auto=false;
  try{auto=localStorage.getItem("tp-auto-evolve")==="1";}catch(_e){}
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const button=(text,fn)=>{const n=el("button",text);n.type="button";n.addEventListener("click",fn);return n;};
  const style=el("style");style.textContent=`
  .tp-tools{display:flex;gap:8px;flex-wrap:wrap;width:min(100%,466px);margin:8px auto}
  .tp-tools button{flex:1;min-height:44px}
  .tp-modal[hidden]{display:none!important}
  .tp-modal{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.8);padding:12px;padding-top:max(12px,env(safe-area-inset-top));padding-bottom:max(12px,env(safe-area-inset-bottom));box-sizing:border-box;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;text-align:left}
  .tp-panel{background:#171c2b;color:#f4f6ff;border:1px solid #69718d;border-radius:16px;padding:16px;max-width:620px;margin:auto;font:16px/1.45 system-ui;box-sizing:border-box}
  .tp-panel h2{margin:0;font-size:22px}.tp-panel h3{font-size:18px;margin:4px 0 10px}
  .tp-panel button,.tp-panel input,.tp-panel select{font:inherit;min-height:44px;border:1px solid #8790a9;border-radius:8px;padding:8px;background:#272f45;color:#fff;box-sizing:border-box;max-width:100%}
  .tp-panel button:disabled{opacity:.45}.tp-panel button{cursor:pointer}
  .tp-panel input[type=checkbox]{min-height:24px;width:24px;vertical-align:middle;margin-right:8px}
  .tp-panel label{display:block;margin:10px 0}.tp-panel input[type=search],.tp-panel select{width:100%}
  .tp-modal-head,.tp-modal-row{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}
  .tp-card{border:1px solid #66718d;border-radius:12px;padding:12px;margin:12px 0;background:#20283a}
  .tp-card p{margin:5px 0}.tp-small{color:#c3cbdf;font-size:14px}
  .tp-ok{color:#9ce8b8}.tp-no{color:#ffd28c}
  .tp-panel :focus-visible{outline:3px solid #9ebeff;outline-offset:2px}
  `;document.head.appendChild(style);
  const bar=el("div",undefined,"tp-tools");
  const evoButton=button("Entwicklung",()=>openEvolution());
  const dexButton=button("Dex-Suche",()=>openDex());
  bar.append(evoButton,dexButton);
  document.getElementById("tp").before(bar);
  const overlay=el("div",undefined,"tp-modal");overlay.hidden=true;
  const panel=el("section",undefined,"tp-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-labelledby","tp-modal-title");
  overlay.appendChild(panel);document.body.appendChild(overlay);
  function loaded(){return !!Module&&typeof fns.speciesId==="function";}
  function safe(){return loaded()&&!fns.awaitingStarter()&&!["game","gamemenu","battle","keyboard"].includes(screen)&&!fns.evolvingNow()&&!fns.ceremony()&&!fns.wildPromptActive();}
  function updateButtons(){const ok=safe();evoButton.disabled=!ok||!!fns.isEgg();dexButton.disabled=!ok;}
  evoButton.disabled=dexButton.disabled=true;
  setInterval(updateButtons,1000);
  function close(){overlay.hidden=true;document.body.style.overflow="";if(previousFocus&&previousFocus.focus)previousFocus.focus();}
  function begin(title){
    if(!safe()){alert("Bitte zuerst Spiel, Kampf oder Dialog beenden.");return false;}
    previousFocus=document.activeElement;panel.replaceChildren();
    const row=el("div",undefined,"tp-modal-head");const h=el("h2",title);h.id="tp-modal-title";
    const exit=button("Schliessen",close);row.append(h,exit);panel.appendChild(row);
    overlay.hidden=false;document.body.style.overflow="hidden";
    dragStart=null;dragNow=null;choice="none";feedMenuUntil=0;confirmUntil=0;
    exit.focus();return true;
  }
  overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
  overlay.addEventListener("keydown",e=>{
    if(e.key==="Escape"){e.preventDefault();close();return;}
    if(e.key!=="Tab")return;
    const nodes=Array.from(panel.querySelectorAll("button:not(:disabled),input,select,[tabindex='0']")).filter(n=>!n.hidden);
    const first=nodes[0],last=nodes[nodes.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  function name(id){const m=TP_DEX_META[id-1];const lang=langCodes[fns.language()]||"en";return m?(m.names[lang]||m.names.en):String(id);}
  function field(from,i,f){return Module.ccall("tp_evo_rule_field","number",["number","number","number"],[from,i,f]);}
  function check(text,ok){return el("p",(ok?"✓ ":"○ ")+text,ok?"tp-ok":"tp-no");}
  function openEvolution(){
    if(!begin("Entwicklungen"))return;
    const from=fns.speciesId();
    panel.appendChild(el("p",name(from)+" · Level "+fns.level()+" · Bindung "+fns.bond()));
    panel.appendChild(el("p","Sonderentwicklungen nutzen unsere vereinfachten Spielregeln. Regionale Sonderfaelle sind teilweise auf Artebene abgebildet. Zeitbedingungen folgen der internen Spielzeit (UTC).","tp-small"));
    const setting=el("label");const box=el("input");box.type="checkbox";box.checked=auto;
    box.addEventListener("change",()=>{auto=box.checked;try{localStorage.setItem("tp-auto-evolve",auto?"1":"0");}catch(_e){}});
    setting.append(box,document.createTextNode("Automatische Zielwahl beim bisherigen Entwicklungsdialog"));panel.appendChild(setting);
    panel.appendChild(button("Voraussetzungen aktualisieren",openEvolution));
    const n=Module.ccall("tp_evo_rule_count","number",["number"],[from]);
    if(!n){panel.appendChild(el("p","Diese Art besitzt keine weitere Entwicklung."));return;}
    for(let i=0;i<n;i++){
      const to=field(from,i,0),lvl=field(from,i,1),bond=field(from,i,2),time=field(from,i,3);
      const card=el("article",undefined,"tp-card");card.appendChild(el("h3",name(from)+" → "+name(to)));
      card.appendChild(check("Level "+fns.level()+" / "+lvl,!!field(from,i,4)));
      card.appendChild(check("Bindung "+fns.bond()+" / "+bond,!!field(from,i,5)));
      card.appendChild(check("Zeit: "+["beliebig","tagsueber","nachts","abends"][time],!!field(from,i,6)));
      const min=Math.min(fns.fullness(),fns.joy(),fns.energy(),fns.hygiene());
      card.appendChild(check("Niedrigster Pflegewert "+min+" / 40",!!field(from,i,7)));
      card.appendChild(check("Wach",!!field(from,i,8)));
      if(lvl>field(from,i,10))card.appendChild(el("p","Pflegefehler sind im benoetigten Level bereits beruecksichtigt.","tp-small"));
      const act=button("Zu "+name(to)+" entwickeln",async()=>{
        if(!safe()||fns.speciesId()!==from){close();return;}
        if(!confirm(name(from)+" wirklich zu "+name(to)+" entwickeln?"))return;
        const ok=Module.ccall("tp_evo_choose","number",["number"],[to]);
        if(!ok){alert("Die Voraussetzungen sind nicht mehr erfuellt.");openEvolution();return;}
        close();screen="idle";choice="none";await saveNow(Module);
      });
      act.disabled=!field(from,i,9);card.appendChild(act);panel.appendChild(card);
    }
  }
  function status(id){return {raised:!!fns.dexRegistered(id),caught:!!fns.dexCaught(id)};}
  function showInDex(id){
    tpDexFilter={query:"",gen:0,type:0,status:"all"};tpDexCacheKey="";
    dexFilter=0;dexPage=Math.floor((id-1)/16);dexDetailDex=id;dexDetailPage=0;dexScreen="detail";screen="dex";close();
  }
  function openFamily(id){
    if(!begin("Entwicklungsfamilie"))return;
    panel.appendChild(el("p","Uebersicht nach unseren vereinfachten Art-Verbindungen. Sie markiert keine Art als gesammelt.","tp-small"));
    for(const m of TPDexTools.family(TP_DEX_META,id)){
      const card=el("article",undefined,"tp-card");const s=status(m.id);
      card.appendChild(el("h3","#"+m.id+" "+((dexLookupMode||s.raised||s.caught)?name(m.id):"???")));
      if(m.parent)card.appendChild(el("p","Vorentwicklung: #"+m.parent));
      card.appendChild(el("p",s.raised?"Aufgezogen":s.caught?"Gefangen":"Noch nicht gesammelt"));
      card.appendChild(button("Im Pokédex oeffnen",()=>showInDex(m.id)));panel.appendChild(card);
    }
    panel.appendChild(button("Zur Suche",openDex));
  }
  function openDex(){
    if(!begin("Pokédex-Suche"))return;
    const query=el("input");query.type="search";query.placeholder="Name oder Nummer, z.B. Evoli oder 133";query.value=tpDexFilter.query;query.setAttribute("aria-label","Name oder Nummer");
    const gen=el("select"),type=el("select"),collection=el("select");
    function opt(select,value,label){const o=el("option",label);o.value=String(value);select.appendChild(o);}
    opt(gen,0,"Alle Generationen");for(let g=1;g<=9;g++)opt(gen,g,"Generation "+g);
    typeNames.forEach((s,i)=>opt(type,i,s));
    [["all","Alle Sammelstaende"],["missing","Noch nicht gesammelt"],["raised","Aufgezogen"],["caught","Gefangen"]].forEach(([v,t])=>opt(collection,v,t));
    gen.value=String(tpDexFilter.gen);type.value=String(tpDexFilter.type);collection.value=tpDexFilter.status;
    function labeled(label,node){const l=el("label",label);l.appendChild(node);panel.appendChild(l);}
    labeled("Suche",query);labeled("Generation",gen);labeled("Typ",type);labeled("Sammlung",collection);
    const lookup=el("input");lookup.type="checkbox";lookup.checked=dexLookupMode;
    const ll=el("label");ll.append(lookup,document.createTextNode("Nachschlage-Modus: unbekannte Namen und Bilder zeigen (ohne Sammelfreischaltung)"));panel.appendChild(ll);
    const actions=el("div",undefined,"tp-modal-row");panel.appendChild(actions);
    const results=el("div");results.setAttribute("aria-live","polite");panel.appendChild(results);
    let resultPage=0;
    function read(){tpDexFilter={query:query.value,gen:Number(gen.value),type:Number(type.value),status:collection.value};dexLookupMode=lookup.checked;tpDexCacheKey="";}
    function apply(){read();dexFilter=0;dexPage=0;dexScreen="grid";screen="dex";close();}
    actions.append(button("Filter im Pokédex anwenden",apply),button("Zuruecksetzen",()=>{query.value="";gen.value="0";type.value="0";collection.value="all";resultPage=0;render();}));
    const jumps=el("div",undefined,"tp-modal-row");
    jumps.append(button("Erste Dex-Seite",()=>{tpDexFilter={query:"",gen:0,type:0,status:"all"};tpDexCacheKey="";dexFilter=0;dexPage=0;dexScreen="grid";screen="dex";close();}),button("Letzte Dex-Seite",()=>{tpDexFilter={query:"",gen:0,type:0,status:"all"};tpDexCacheKey="";dexFilter=0;dexPage=Math.ceil(fns.dexCount()/16)-1;dexScreen="grid";screen="dex";close();}));panel.appendChild(jumps);
    function render(){
      read();results.replaceChildren();
      const filtered=TP_DEX_META.filter(m=>TPDexTools.matches(m,tpDexFilter,status(m.id)));
      const pages=Math.max(1,Math.ceil(filtered.length/24));resultPage=Math.max(0,Math.min(resultPage,pages-1));
      results.appendChild(el("p",filtered.length+" Treffer · Seite "+(resultPage+1)+" / "+pages));
      for(const m of filtered.slice(resultPage*24,resultPage*24+24)){
        const s=status(m.id),known=s.raised||s.caught;
        const card=el("article",undefined,"tp-card");card.appendChild(el("h3","#"+m.id+" "+((dexLookupMode||known)?name(m.id):"???")));
        card.appendChild(el("p","Generation "+m.gen+" · "+m.types.map(t=>typeNames[t]).join(" / ")));
        card.appendChild(el("p",s.raised?"Aufgezogen":s.caught?"Gefangen":"Noch nicht gesammelt"));
        const row=el("div",undefined,"tp-modal-row");row.append(button("Ansehen",()=>showInDex(m.id)),button("Familie",()=>openFamily(m.id)));card.appendChild(row);results.appendChild(card);
      }
      const nav=el("div",undefined,"tp-modal-row");const prev=button("Zurueck",()=>{resultPage--;render();});prev.disabled=resultPage===0;const next=button("Weiter",()=>{resultPage++;render();});next.disabled=resultPage>=pages-1;nav.append(prev,next);results.appendChild(nav);
    }
    [query,gen,type,collection,lookup].forEach(n=>n.addEventListener(n===query?"input":"change",()=>{resultPage=0;render();}));
    render();
  }
  window.TPComfort={openEvolution,openDex,autoEvolve:()=>auto};
})();
