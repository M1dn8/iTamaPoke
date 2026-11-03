// Stat card pages Daily/Box/Expedition, ported from PetScreen.swift's
// renderCardDaily/renderCardBox/renderCardExpedition + the idle screen's
// expedition HUD chip. All state lives in the real C++ Pet (via
// browser_card2.cpp); this is drawing + tap only.

function dailyGoalColor(kind) {
  return { 0: "#d4527e", 1: UI.barWarn, 2: UI.barBad, 3: UI.barOK, 4: "#4C98D9" }[kind] || UI.track;
}

function drawCardDaily() {
  Module._tp_ensure_daily_goals();
  ctx.textAlign = "center";
  ctx.fillStyle = UI.ink;
  ctx.font = "bold 20px monospace";
  ctx.fillText(fns.dailyTitle(), TP.cx, 50);
  ctx.fillStyle = UI.track;
  ctx.font = "11px monospace";
  ctx.fillText(fns.dayPhaseLabel(), TP.cx, 74);

  const count = fns.dailyGoalCount();
  let done = 0;
  for (let i = 0; i < count; i++) {
    const y = 96 + i * 66;
    const complete = fns.dailyGoalComplete(i) !== 0;
    if (complete) done++;
    const col = dailyGoalColor(fns.dailyGoalKind(i));
    ctx.fillStyle = complete ? col : UI.white;
    roundRect(58, y, 350, 48, 12); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 1;
    roundRect(58, y, 350, 48, 12); ctx.stroke();
    ctx.textAlign = "left";
    ctx.fillStyle = complete ? UI.bgDay : UI.ink;
    ctx.font = "13px monospace";
    ctx.fillText(fns.dailyGoalLabel(i), 76, y + 28);
    ctx.textAlign = "right";
    if (complete) {
      ctx.fillText("✓ " + fns.doneText(), 390, y + 28);
    } else {
      ctx.fillText(`${fns.dailyGoalProgress(i)}/${fns.dailyGoalTarget(i)}`, 390, y + 28);
    }
  }

  ctx.textAlign = "center";
  ctx.fillStyle = done === count ? UI.barOK : UI.track;
  ctx.font = "13px monospace";
  ctx.fillText(fns.dailyRewardLine(), TP.cx, 310);

  statusEl.textContent = TPText.status(`Card · Daily · ${done}/${count}`);
}

let boxPage = 0;

function drawCardBox() {
  ctx.fillStyle=UI.white;roundRect(70,338,326,32,10);ctx.fill();ctx.strokeStyle=UI.ink;ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=UI.ink;ctx.font="14px monospace";ctx.textAlign="center";ctx.fillText("Individuelle Boxen & Teamplanung",233,359);
  Module._tp_box_invalidate(); // cheap at this size; always fresh rather than stale after a catch
  const rows = 5;
  const pages = fns.boxPageCount(rows);
  if (boxPage >= pages) boxPage = Math.max(0, pages - 1);

  ctx.textAlign = "left";
  ctx.fillStyle = UI.ink;
  ctx.font = "bold 18px monospace";
  ctx.fillText(fns.boxTitle(), 40, 40);

  ctx.fillStyle = UI.white;
  roundRect(302, 30, 96, 26, 9); ctx.fill();
  ctx.strokeStyle = UI.ink; ctx.lineWidth = 1;
  roundRect(302, 30, 96, 26, 9); ctx.stroke();
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "center";
  ctx.font = "11px monospace";
  ctx.fillText(fns.boxSortLabel(), 350, 47);

  ctx.textAlign = "left";
  ctx.font = "13px monospace";
  ctx.fillText(fns.caughtCountLine(), 40, 62);
  ctx.fillStyle = UI.track;
  ctx.font = "10px monospace";
  ctx.fillText(fns.knownCountLine(), 40, 78);
  ctx.fillText(fns.dexGoalLine(), 230, 78);

  if (fns.caughtCount() === 0) {
    ctx.fillStyle = UI.white;
    roundRect(82, 130, 302, 60, 16); ctx.fill();
    ctx.strokeStyle = UI.track; ctx.lineWidth = 1;
    roundRect(82, 130, 302, 60, 16); ctx.stroke();
    ctx.fillStyle = UI.track;
    ctx.textAlign = "center";
    ctx.font = "13px monospace";
    ctx.fillText(fns.noCatchesText(), TP.cx, 164);
    drawBoxPager(pages);
    statusEl.textContent = TPText.status(`Card · Box · empty`);
    return;
  }

  for (let i = 0; i < rows; i++) {
    const dex = fns.boxDexAt(boxPage * rows + i);
    if (dex <= 0) break;
    const y = 90 + i * 36;
    const raised = fns.dexRegistered(dex) !== 0;
    ctx.fillStyle = UI.white;
    roundRect(40, y, 350, 30, 9); ctx.fill();
    ctx.strokeStyle = TYPE_COLORS[fns.dexType1(dex)] || UI.ink;
    ctx.lineWidth = 1;
    roundRect(40, y, 350, 30, 9); ctx.stroke();
    ctx.fillStyle = UI.ink;
    ctx.textAlign = "left";
    ctx.font = "11px monospace";
    ctx.fillText(`#${String(dex).padStart(3, "0")} ${fns.dexName(dex)}`, 50, y + 19);
    const t1 = TYPE_NAMES[fns.dexType1(dex)] || "";
    const t2 = fns.dexType2(dex) ? "/" + TYPE_NAMES[fns.dexType2(dex)] : "";
    ctx.textAlign = "right";
    ctx.fillStyle = TYPE_COLORS[fns.dexType1(dex)] || UI.ink;
    ctx.font = "9px monospace";
    ctx.fillText(t1 + t2, 380, y + (raised ? 14 : 19));
    if (raised) { ctx.fillStyle = UI.barOK; ctx.fillText(fns.raisedMarkText(), 380, y + 26); }
  }

  drawBoxPager(pages);
  statusEl.textContent = TPText.status(`Card · Box · page ${boxPage + 1}/${pages}`);
}

function drawBoxPager(pages) {
  const prevOn = boxPage > 0, nextOn = boxPage + 1 < pages;
  const off = rgb565(0xE71C);   // PetScreen's disabled pager fill
  ctx.fillStyle = prevOn ? UI.track : off;
  roundRect(58, 296, 90, 32, 11); ctx.fill();
  ctx.fillStyle = nextOn ? UI.track : off;
  roundRect(288, 296, 90, 32, 11); ctx.fill();
  ctx.fillStyle = UI.bgDay;
  ctx.textAlign = "center";
  ctx.font = "bold 16px monospace";
  ctx.fillText("<", 103, 318);
  ctx.fillText(">", 333, 318);
  ctx.fillStyle = UI.track;
  ctx.font = "11px monospace";
  ctx.fillText(fns.pageLine(boxPage + 1, pages), TP.cx, 322);
}

function cardBoxTap(x, y) {
  if(x>=70&&x<=396&&y>=338&&y<=370){window.TPBoxes?.open();return;}
  if (x >= 302 && x <= 398 && y >= 30 && y <= 56) {
    Module._tp_cycle_box_sort();
    return;
  }
  if (y >= 296 && y <= 328) {
    const pages = fns.boxPageCount(5);
    if (x >= 58 && x <= 148 && boxPage > 0) boxPage--;
    else if (x >= 288 && x <= 378 && boxPage + 1 < pages) boxPage++;
  }
}


let expeditionTrainChoiceOpen=false;
/* UI01 expedition double display */
const expeditionUI=(function(){
 "use strict";
 const words={
  en:{start:"Start expedition",claim:"Collect",remaining:"{minutes} min remaining",
   found:"{item} ×1 found",details:"{minutes} min · {cost} energy",
   reward:"Find: {item} ×1",core:"Expedition data unavailable.",
   full:"Item compartment full. Use an item first.",blocked:"Collection is currently blocked.",
   running:"On an expedition",training:"Choose a training stat",max:"Maximum reached",
   failed:"Action failed.",saving:"Saving…",legacy:"Earlier expedition"},
  de:{start:"Expedition starten",claim:"Abholen",remaining:"Noch {minutes} Min",
   found:"{item} ×1 gefunden",details:"{minutes} Min · {cost} Energie",
   reward:"Fund: {item} ×1",core:"Expeditionsdaten nicht verfügbar.",
   full:"Gegenstandsfach voll. Zuerst einen Gegenstand verwenden.",blocked:"Abholung gerade gesperrt.",
   running:"Auf Expedition",training:"Trainingswert wählen",max:"Bereits maximal",
   failed:"Aktion fehlgeschlagen.",saving:"Speichern…",legacy:"Frühere Expedition"},
  es:{start:"Iniciar expedición",claim:"Recoger",remaining:"Quedan {minutes} min",
   found:"{item} ×1 encontrado",details:"{minutes} min · {cost} de energía",
   reward:"Hallazgo: {item} ×1",core:"Datos de expedición no disponibles.",
   full:"Compartimento lleno. Usa primero un objeto.",blocked:"La recogida está bloqueada.",
   running:"De expedición",training:"Elige una estadística",max:"Máximo alcanzado",
   failed:"La acción ha fallado.",saving:"Guardando…",legacy:"Expedición anterior"},
  fr:{start:"Lancer l’expédition",claim:"Récupérer",remaining:"Encore {minutes} min",
   found:"{item} ×1 trouvé",details:"{minutes} min · {cost} énergie",
   reward:"Trouvaille : {item} ×1",core:"Données d’expédition indisponibles.",
   full:"Compartiment plein. Utilisez d’abord un objet.",blocked:"Récupération bloquée.",
   running:"En expédition",training:"Choisissez une statistique",max:"Maximum atteint",
   failed:"Échec de l’action.",saving:"Enregistrement…",legacy:"Ancienne expédition"}
 };
 if(window.TPText?.registerLocale){
  for(const code of ["en","de","es","fr"]){
   TPText.registerLocale(code,Object.fromEntries(
    Object.entries(words[code]).map(([key,value])=>["expeditionUI."+key,value])
   ));
  }
 }
 const t=(key,params={})=>TPText.t("expeditionUI."+key,params);
 let root=null,active=false,selected=1,uiBusy=false,raf=null;
 let key="",lastRefresh=-Infinity,lastPaint=-Infinity,scene=null,sceneRoute=1;
 let copyKind="",localNotice="";
 const api=()=>window.TPExpeditions;
 const inContext=()=>screen==="expedition"||(screen==="card"&&cardPage===7);
 function state(){try{return api()?.view()||null;}catch(_){return null;}}
 function locked(v){
  return uiBusy||tpSaveReplacing||!!api()?.busy||!!v?.busy||
   !!window.TPCollection?.busy||!!window.TPCollection?.blocked;
 }
 function node(tag,value,cls){
  const n=document.createElement(tag);
  if(value!==undefined)n.textContent=value;
  if(cls)n.className=cls;
  return n;
 }
 function button(label,focus,fn,disabled=false){
  const n=node("button",label);n.type="button";n.disabled=!!disabled;
  n.dataset.expFocus=focus;
  n.addEventListener("click",()=>{
   if(!active||!inContext()||locked(state())||n.disabled||!n.isConnected)return;
   fn();if(active)render(true);
  });
  return n;
 }
 function icon(item){
  const image=node("canvas");image.width=image.height=32;
  image.setAttribute("aria-hidden","true");
  const c=image.getContext("2d");c.imageSmoothingEnabled=false;
  if(item===-1){
   if(window.TPNavBack)TPNavBack.draw(c,4,4,24,"#315b83");
   else{
    c.strokeStyle="#315b83";c.lineWidth=3;c.beginPath();
    c.moveTo(15,7);c.lineTo(6,16);c.lineTo(15,25);
    c.moveTo(6,16);c.lineTo(25,16);c.stroke();
   }
  }else if(item===0)drawIconOn(c,TPIcon.food,0,0,2);
  else if(item===2)drawIconOn(c,TPIcon.clean,0,0,2);
  else if(item===1){
   c.fillStyle="#6396bd";
   for(const [x,y,w,h]of [[18,2,6,7],[13,8,7,7],[8,14,14,5],[14,19,6,6],[10,25,6,6]])
    c.fillRect(x,y,w,h);
  }else{
   const map=window.TPActions?.icons?.training;
   if(map)drawIconOn(c,map,0,0,2);
   else{
    c.fillStyle="#292831";c.fillRect(15,1,2,6);
    c.fillStyle="#ba5b56";c.fillRect(9,7,14,21);
    c.fillStyle="#292831";c.fillRect(9,16,14,3);
   }
  }
  return image;
 }
 function hide(){
  active=false;if(root)root.hidden=true;
  if(raf!==null)cancelAnimationFrame(raf);raf=null;
 }
 function back(){
  if(locked(state()))return;
  if(expeditionTrainChoiceOpen){
   expeditionTrainChoiceOpen=false;render(true);return;
  }
  hide();dragStart=dragNow=null;screen="idle";canvas.focus?.();
 }
 async function run(fn){
  if(locked(state()))return;
  uiBusy=true;localNotice="";render(true);
  try{await fn();}
  catch(error){localNotice=error.message||t("failed");}
  finally{uiBusy=false;if(active&&inContext())render(true);}
 }
 function ensure(){
  if(root)return;
  const host=document.getElementById("tp-game-shell");
  if(!host)throw Error("Spielrahmen fehlt.");
  if(typeof hubDexDesignTokens==="function"){
   for(const [name,value]of Object.entries(hubDexDesignTokens()))
    host.style.setProperty(name,value);
  }
  root=node("section");root.id="tp-expedition-page";root.hidden=true;
  root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");
  host.append(root);
  root.addEventListener("keydown",event=>{
   if(event.key==="Escape"){
    event.preventDefault();event.stopPropagation();back();return;
   }
   if(event.key!=="Tab")return;
   const buttons=Array.from(root.querySelectorAll("button")).filter(n=>!n.disabled);
   if(!buttons.length){event.preventDefault();return;}
   if(event.shiftKey&&document.activeElement===buttons[0]){
    event.preventDefault();buttons[buttons.length-1].focus();
   }else if(!event.shiftKey&&document.activeElement===buttons[buttons.length-1]){
    event.preventDefault();buttons[0].focus();
   }
  });
 }
 function picture(route){
  const holder=node("div",undefined,"tp-exp-picture");
  scene=node("canvas");scene.width=224;scene.height=112;sceneRoute=route;
  scene.setAttribute("role","img");
  scene.setAttribute("aria-label",api()?.oldNames?.[route]||fns.expeditionTitle());
  holder.append(scene);return holder;
 }
 function render(force=false){
  if(!active)return;
  const v=state(),controller=api();
  const target=controller?.targets?.find(item=>item.route===selected)||
   controller?.targets?.[0];
  const kind=selected+":"+!!v?.pending+":"+expeditionTrainChoiceOpen;
  const next=JSON.stringify([v,selected,uiBusy,expeditionTrainChoiceOpen,
   localNotice,t("start"),fns.expeditionTitle()]);
  if(!force&&next===key)return;
  key=next;
  const focused=root.contains(document.activeElement)?
   document.activeElement.dataset.expFocus:null;
  const oldCopy=root.querySelector(".tp-exp-copy");
  const scroll=copyKind===kind&&oldCopy?oldCopy.scrollTop:0;
  copyKind=kind;root.replaceChildren();scene=null;
  root.setAttribute("aria-label",fns.expeditionTitle());
  root.dataset.expState=!v?"unavailable":
   expeditionTrainChoiceOpen?"training":v.pending?(v.ready?"ready":"running"):"choose";

  const head=node("header",undefined,"tp-exp-head");
  const exit=button(TPText.t("common.back"),"back",back,locked(v));
  exit.dataset.expBack="";exit.setAttribute("aria-label",TPText.t("common.back"));
  exit.title=TPText.t("common.back");exit.replaceChildren(icon(-1));
  head.append(node("h2",fns.expeditionTitle()),exit);

  const frame=node("div",undefined,"tp-exp-frame");
  frame.setAttribute("aria-hidden","true");
  for(const cls of [
   "tp-pokedex-display tp-pokedex-display-left",
   "tp-pokedex-display tp-pokedex-display-right","tp-pokedex-spine"
  ])frame.append(node("span",undefined,cls));

  const toolbar=node("div",undefined,"tp-exp-inventory");
  for(let item=0;item<4;item++){
   const count=v?Number(v.s[20+item]):0;
   const name=controller?.itemNames?.[item]||String(item);
   const use=button(name+" ×"+count,"item-"+item,()=>{
    if(item===3)expeditionTrainChoiceOpen=true;
    else run(()=>controller.use(item));
   },!v||locked(v)||!v.quiet||count<1||expeditionTrainChoiceOpen);
   use.dataset.expItem=String(item);
   use.setAttribute("aria-label",name+" ×"+count);use.title=name+" ×"+count;
   use.replaceChildren(icon(item),node("span",String(count),"tp-exp-count"));
   toolbar.append(use);
  }

  const body=node("div",undefined,"tp-exp-body");
  const left=node("div",undefined,"tp-exp-left");
  const right=node("div",undefined,"tp-exp-right");
  const copy=node("div",undefined,"tp-exp-copy");
  if(!v){
   copy.append(node("p",t("core")));right.append(copy);
  }else{
   if(v.pending){
    const running=node("div",undefined,"tp-exp-running");
    running.append(picture(v.s[10]),
     node("h3",controller.oldNames[v.s[10]]||fns.expeditionTitle()));
    if(!v.s[26])running.append(node("p",t("legacy")));
    left.append(running);
   }else{
    const choices=node("div",undefined,"tp-exp-choices");
    for(const destination of controller.targets){
     const pick=button(destination.name,"route-"+destination.route,()=>{
      selected=destination.route;localNotice="";
     },locked(v)||expeditionTrainChoiceOpen);
     pick.dataset.expRoute=String(destination.route);
     pick.setAttribute("aria-pressed",String(selected===destination.route));
     pick.replaceChildren(icon(destination.route-1),node("span",destination.name));
     choices.append(pick);
    }
    left.append(choices);
   }

   if(expeditionTrainChoiceOpen){
    copy.append(node("h3",t("training")));
    const choices=node("div",undefined,"tp-exp-training");
    for(let stat=0;stat<3;stat++){
     const usable=fns.trainStatUsable(stat)!==0;
     const pick=button(fns.trainStatLabel(stat)+(usable?" +2":" · "+t("max")),
      "stat-"+stat,()=>{
       expeditionTrainChoiceOpen=false;run(()=>controller.use(3,stat));
      },locked(v)||!v.quiet||!usable);
     pick.dataset.expStat=String(stat);choices.append(pick);
    }
    copy.append(choices);right.append(copy);
   }else if(v.pending){
    copy.append(node("h3",v.ready?
     t("found",{item:controller.itemNames[v.s[24]]}):t("running")));
    if(!v.ready)copy.append(node("p",t("remaining",{minutes:v.left})));
    if(v.ready&&!v.canClaim){
     copy.append(node("p",t(v.s[20+v.s[24]]>=3?"full":"blocked"),"tp-exp-notice"));
    }
    right.append(copy);
    if(v.ready){
     const claim=button(t("claim"),"claim",()=>run(()=>controller.claim()),
      locked(v)||!v.quiet||!v.canClaim);
     claim.dataset.expClaim="";right.append(claim);
    }
   }else{
    copy.append(node("h3",target.name),picture(target.route),
     node("p",t("details",{minutes:target.minutes,cost:target.cost})),
     node("p",t("reward",{item:target.item})));
    const index=controller.targets.findIndex(item=>item.route===target.route);
    const reason=v.reasons[index];
    if(reason)copy.append(node("p",controller.reason(reason,target.cost),"tp-exp-notice"));
    right.append(copy);
    const start=button(t("start"),"start",()=>run(()=>controller.start(target.route)),
     locked(v)||!v.quiet||reason!==0);
    start.dataset.expStart="";right.append(start);
   }
   const message=locked(v)?t("saving"):localNotice||v.notice;
   if(message){
    const note=node("p",message,"tp-exp-notice");
    note.setAttribute("role","status");copy.append(note);
   }
  }
  body.append(left,right);root.append(head,toolbar,frame,body);
  copy.scrollTop=scroll;
  const focus=focused?Array.from(root.querySelectorAll("button")).find(
   n=>n.dataset.expFocus===focused&&!n.disabled
  ):exit;
  focus?.focus({preventScroll:true});
  lastPaint=-Infinity;paint(performance.now());
 }

 /* UI01 expedition scenes: berries spring forest training */
 function paint(now){
  if(!scene||now-lastPaint<140)return;
  lastPaint=now;
  const c=scene.getContext("2d"),route=sceneRoute||1;
  const reduced=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const phase=reduced?0:Math.floor(now/260)%4;
  const r=(x,y,w,h,colour)=>{
   c.fillStyle=colour;
   c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
  };
  function tree(x,ground,scale=1){
   const q=(dx,dy,w,h,colour)=>
    r(x+dx*scale,ground+dy*scale,w*scale,h*scale,colour);
   q(-3,-25,7,26,"#88664a");
   q(-2,-23,2,22,"#b08a5a");
   q(-16,-43,32,23,"#47784e");
   q(-11,-54,23,21,"#568c58");
   q(-18,-37,12,13,"#568c58");
   q(7,-39,13,15,"#3b6745");
   q(-8,-49,12,7,"#78a66b");
  }
  function bush(x,y,colour="#c45463",small=false){
   const w=small?22:34,h=small?16:24;
   r(x+4,y,w-8,h,"#47784e");
   r(x,y+5,w,h-9,"#568c58");
   r(x+6,y+2,w-14,5,"#78a66b");
   const berries=small?[[5,7],[13,5],[15,11]]:
    [[6,9],[13,6],[22,8],[9,16],[19,15],[27,13]];
   for(const [dx,dy]of berries){
    r(x+dx,y+dy,small?3:4,small?3:4,colour);
    r(x+dx,y+dy,1,1,"#ffe6cf");
   }
  }
  function cone(x,y){
   r(x+4,y,4,4,"#d48a49");
   r(x+2,y+4,8,4,"#df9c53");
   r(x,y+8,12,4,"#d48a49");
   r(x+2,y+5,8,2,"#fff1cf");
   r(x-2,y+12,16,3,"#866044");
  }

  c.clearRect(0,0,224,112);
  c.imageSmoothingEnabled=false;
  r(0,0,224,112,"#e7f0ed");
  r(0,49,224,22,"#c5d9bd");
  r(0,65,224,47,"#abc69b");
  r(0,96,224,16,"#95b485");

  if(route===1){
   r(96,61,25,18,"#d8c8a5");
   r(91,77,34,17,"#dfcfad");
   r(84,94,46,18,"#dfcfad");
   tree(15,61,.65);tree(204,61,.7);
   bush(39,44,"#bf596b",true);
   bush(148,43,"#6577ad",true);
   bush(8,64,"#bf596b");
   bush(48,78,"#6577ad");
   bush(144,66,"#bf596b");
   bush(184,82,"#6577ad");
   for(const [x,y]of [[82,66],[133,94],[25,101],[172,99]]){
    r(x,y,3,3,"#f2deb0");
    r(x+1,y-2,1,2,"#699653");
   }
  }else if(route===2){
   tree(21,65,.8);tree(211,72,.7);
   r(64,67,18,16,"#d8c8a5");
   r(57,81,23,16,"#dfcfad");
   r(48,96,28,16,"#dfcfad");

   r(139,25,35,11,"#9ca6a2");
   r(130,36,53,24,"#87938f");
   r(143,18,22,12,"#b5bcb4");
   r(131,39,12,10,"#acb3a9");
   r(172,41,16,22,"#737f7d");
   r(151,35,17,9,"#4c6266");
   r(156,42,8,23,"#659ebc");
   r(158,43,3,21,"#c4e5e6");

   r(132,60,51,20,"#8d9d94");
   r(137,62,42,15,"#78afc5");
   r(143,59,29,20,"#78afc5");
   r(143+phase,66,23,2,"#d6eff0");
   r(150,72,18,10,"#78afc5");
   r(139,81,22,10,"#78afc5");
   r(128,90,24,12,"#78afc5");
   r(119,101,26,11,"#78afc5");
   r(151+phase,76,8,2,"#c4e5e6");
   r(139+phase,88,10,2,"#c4e5e6");
   r(126+phase,104,11,2,"#c4e5e6");

   for(const [x,y]of [[116,80],[174,82],[154,102]]){
    r(x,y,10,5,"#9aa69b");
    r(x+2,y-2,6,3,"#b4bcae");
   }
   for(const x of [110,184]){
    r(x,67,2,14,"#69965c");
    r(x+5,71,2,11,"#568452");
   }
  }else if(route===3){
   r(0,36,224,28,"#8faf85");
   for(const [x,y,s]of [
    [6,70,.8],[39,65,.85],[76,60,.7],[117,58,.7],
    [155,63,.85],[189,66,.9],[222,72,.8]
   ])tree(x,y,s);

   r(70,69,83,25,"#c6d6a6");
   r(59,77,104,14,"#c6d6a6");
   r(91,85,31,27,"#dfcfad");
   r(80,103,54,9,"#dfcfad");

   tree(14,111,1.15);
   tree(209,111,1.2);
   bush(43,91,"#bda06c",true);
   bush(157,91,"#bda06c",true);
   for(const [x,y]of [[78,79],[137,83],[70,94],[149,74]]){
    r(x,y,3,3,"#f2deb0");
    r(x+1,y+3,1,4,"#6f9258");
   }
  }else{
   r(0,65,224,47,"#c8c6a2");
   r(71,63,62,49,"#dfcfad");
   r(85,52,40,15,"#dfcfad");
   tree(10,61,.65);tree(216,62,.65);

   r(31,27,30,28,"#a24f4f");
   r(35,31,22,20,"#f1e5cb");
   r(40,35,12,12,"#6396bd");
   r(44,39,4,4,"#a24f4f");
   r(44,55,4,24,"#88664a");
   r(33,77,27,4,"#88664a");

   r(17,88,4,20,"#7d6650");
   r(56,88,4,20,"#7d6650");
   r(17,85,43,5,"#ba5b56");
   r(25,85,8,5,"#f1e5cb");
   r(43,85,8,5,"#f1e5cb");

   r(89,78,3,32,"#94784f");
   r(119,78,3,32,"#94784f");
   for(const y of [80,88,96,104])r(89,y,33,3,"#b99660");
   cone(73,61);cone(116,47);cone(129,94);

   r(151,17,4,88,"#7c6d5b");
   r(208,17,4,88,"#7c6d5b");
   r(151,17,61,5,"#947c5a");
   r(178,22,3,14,"#586671");
   const sway=reduced?0:Math.round(Math.sin(now/650)*2);
   r(166+sway,36,27,45,"#ba5b56");
   r(166+sway,53,27,6,"#873e46");
   r(170+sway,40,4,23,"#d38373");
   r(163,103,39,4,"#a99c78");
  }
 }
 function draw(){
  if(!inContext()){hide();return;}
  ensure();active=true;root.hidden=false;
  const now=performance.now();
  if(now-lastRefresh>=140){lastRefresh=now;render();}
  paint(now);statusEl.textContent=fns.expeditionTitle();
  if(raf===null)raf=requestAnimationFrame(()=>{
   raf=null;if(active)draw();
  });
 }
 return Object.freeze({draw,hide});
})();
function drawCardExpedition(){expeditionUI.draw();}
function cardExpeditionTap(x,y){return false;}

// --- Idle-screen expedition HUD chip ----------------------------------

// TP.expeditionHud on iOS: x 310, y 106, 112x34 -- tapping it opens the
// card's Expedition page (see main.js's idle tap handler).
const EXP_HUD = { x: 310, y: 106, w: 112, h: 34 };

function drawExpeditionHud() {
  const state = fns.expeditionHudState();
  if (state === 0) return;
  const r = EXP_HUD;
  const color = state === 2 ? UI.barOK : state === 3 ? UI.barWarn : "#4C98D9";
  ctx.fillStyle = UI.white;
  roundRect(r.x, r.y, r.w, r.h, 8); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 2;
  roundRect(r.x, r.y, r.w, r.h, 8); ctx.stroke();
  ctx.beginPath();
  ctx.arc(r.x + 17, r.y + 17, 9, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
  ctx.textBaseline = "middle";
  ctx.fillStyle = UI.white;
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText(state === 2 ? "!" : state === 3 ? "+" : ">", r.x + 17, r.y + 17);
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "left";
  ctx.font = "10px monospace";
  ctx.fillText(fns.expeditionHudLabel(), r.x + 31, r.y + 17);
  ctx.textBaseline = "alphabetic";
}

function expeditionHudTap(x, y) {
  return fns.expeditionHudState() !== 0 && inRect(x, y, EXP_HUD);
}


// UI01: standalone and card routes share the real expedition UI.
function drawStandaloneExpedition(){expeditionUI.draw();}
function standaloneExpeditionTap(x,y){return false;}
