// Evolution/farewell/runaway, ported from PetScreen.swift's
// drawEvolveButton/drawEndingButton/drawChoiceDialog/drawEvolveFX/
// drawCeremony -- halo rings, turning rays, sparks, rain, rising hearts,
// and the white-out reveal all included. The one real simplification:
// evolveFx flickers the current sprite against itself rather than the old
// species against the new one, since this build doesn't keep a second
// sprite around for the form being evolved from.

let choice = "none"; // none | evolve | farewell

// TP.evoBtn / TP.farBtn on iOS: both sit in the middle of the screen, not
// at the bottom. The browser build used to draw them at y 372, straight
// over the four action buttons -- so the evolve CTA covered FEED and there
// was no way to raise a stat back to 40 once it appeared.
// Written out rather than derived from TP.cx: this file is parsed before
// main.js, where TP is declared, so a top-level `TP.cx` here throws during
// script load and takes every function in this file with it -- which then
// breaks the idle tap handler at its first `choice` reference, i.e. every
// button on the screen. (Same trap as dex.js's cryBtnRect and icons.js's
// palette, both of which dodge it by computing on first use.)
// TP.cx is 233, so these are TP.evoBtn / TP.farBtn exactly.
const EVO_BTN = { x: 105, y: 172, w: 256, h: 64 };
const FAR_BTN = { x: 29, y: 176, w: 408, h: 58 };

function drawEvolveButton(now) {
  const p = Math.round(5 * Math.sin(now * 0.006));
  const x = EVO_BTN.x - p, y = EVO_BTN.y - p, w = EVO_BTN.w + p * 2, h = EVO_BTN.h + p * 2;
  ctx.fillStyle = UI.barBad;
  roundRect(x, y, w, h, 18); ctx.fill();
  ctx.strokeStyle = UI.white; ctx.lineWidth = 2;
  roundRect(x, y, w, h, 18); ctx.stroke();
  roundRect(x + 2, y + 2, w - 4, h - 4, 16); ctx.stroke();
  ctx.fillStyle = UI.white;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 20px monospace";
  ctx.fillText(fns.evolveButtonText(), TP.cx, y + h / 2);
  ctx.textBaseline = "alphabetic";
}

function drawEndingButton(now, text, fill, textColor, amplitude, rate) {
  const p = Math.round(amplitude * Math.sin(now * rate));
  const x = FAR_BTN.x - p, y = FAR_BTN.y - p, w = FAR_BTN.w + p * 2, h = FAR_BTN.h + p * 2;
  ctx.fillStyle = fill;
  roundRect(x, y, w, h, 16); ctx.fill();
  ctx.strokeStyle = UI.ink; ctx.lineWidth = 1;
  roundRect(x, y, w, h, 16); ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 15px monospace";
  ctx.fillText(text, TP.cx, y + h / 2);
  ctx.textBaseline = "alphabetic";
}

// Called from the idle screen's own draw, after the buttons row -- mirrors
// PetScreen.swift's render() precedence: evolve first, then runaway, then
// the voluntary farewell.
function drawEvolveEndingOverlay(now) {
  if(window.TPHomeEvolution?.active)return;
  if (fns.wantsEvolve() !== 0) {
    drawEvolveButton(now);
  } else if (fns.canRunaway() !== 0) {
    drawEndingButton(now, fns.runawayButtonText(), "#3a445a", "#c8d2e0", 3, 0.003);
  } else if (fns.wantsFarewell() !== 0) {
    drawEndingButton(now, fns.farewellButtonText(), UI.barWarn, UI.ink, 4, 0.005);
  }
}

function evolveEndingTap(x, y) {
  // Each CTA is checked against its own rect (they differ in width), in the
  // same precedence render() uses.
  if (fns.wantsEvolve() !== 0) {
    if (inRect(x, y, EVO_BTN)) {
      if(window.TPHomeEvolution)window.TPHomeEvolution.request();
      else choice="evolve";
      return true;
    }
    return false;
  }
  if (!inRect(x, y, FAR_BTN)) return false;
  if (fns.canRunaway() !== 0) { if(window.TPCollectionGame)window.TPCollectionGame.end("runaway",false);else Module._tp_start_runaway();return true; }
  if (fns.wantsFarewell() !== 0) { choice = "farewell"; return true; }
  return false;
}

function drawChoiceDialog() {
  const isEvolve = choice === "evolve";
  ctx.fillStyle = UI.white;
  roundRect(73, 156, 320, 188, 16); ctx.fill();
  ctx.strokeStyle = UI.ink; ctx.lineWidth = 2;
  roundRect(73, 156, 320, 188, 16); ctx.stroke();
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "center";
  ctx.font = "bold 15px monospace";
  ctx.fillText(isEvolve ? fns.evolveQuestion() : fns.farewellQuestion(), TP.cx, 182);

  // TP.choiceAction / TP.choiceKeep: 93,206 and 93,268, 280x52.
  const actFill = isEvolve ? UI.barBad : UI.barWarn;
  const keepFill = isEvolve ? UI.track : UI.barOK;
  ctx.fillStyle = actFill;
  roundRect(93, 206, 280, 52, 12); ctx.fill();
  ctx.fillStyle = keepFill;
  roundRect(93, 268, 280, 52, 12); ctx.fill();
  ctx.textBaseline = "middle";
  ctx.fillStyle = isEvolve ? UI.white : UI.ink;
  ctx.font = "bold 15px monospace";
  ctx.fillText(isEvolve ? fns.evolveButtonText() : fns.farewellGoText(), TP.cx, 206 + 26);
  ctx.fillStyle = isEvolve ? UI.ink : UI.white;
  ctx.fillText(isEvolve ? fns.evolveKeepText() : fns.farewellStayText(), TP.cx, 268 + 26);
  ctx.textBaseline = "alphabetic";

  // The evolve CTA can appear as soon as the level requirement is met
  // (see tp_wants_evolve), before all 4 care stats are actually at 40+ --
  // tapping "Evolve" while that's still true used to just silently do
  // nothing and close the dialog, no indication why. Surface the same
  // ready/blocked line the Progress page shows, in the gap between the
  // Keep button (ends y 322) and the dialog's own bottom edge (y 344),
  // matching PetScreen.swift's drawChoiceDialog fix.
  if (isEvolve && fns.evolutionStatusKind() === 2) {
    ctx.fillStyle = UI.barWarn;
    ctx.font = "12px monospace";
    ctx.fillText(fns.evolutionStatus(), TP.cx, 332);
  }
}

function choiceDialogTap(x, y) {
  if (x >= 93 && x <= 373 && y >= 206 && y <= 258) {
    if (choice === "evolve") {
      // tp_evolve() itself already no-ops when a stat has dropped back
      // under 40 (or the pet fell asleep) since the button first appeared
      // -- give an explicit "denied" cue in that case rather than letting
      // the dialog just vanish with nothing happening.
      if (fns.canEvolveNow() !== 0) Module._tp_evolve();
      else playSfx(7); // deny
    } else {
      choice="none";if(window.TPCollectionGame)window.TPCollectionGame.openEnd("farewell");else Module._tp_start_farewell();
    }
    choice = "none";
    return;
  }
  if (x >= 93 && x <= 373 && y >= 268 && y <= 320) {
    if (choice === "evolve") Module._tp_decline_evolve();
    else Module._tp_decline_farewell();
    choice = "none";
  }
}

// Draws the current sprite's idle frame as a flat black silhouette at
// (x, groundY), matching drawSpriteIdle(silhouette: true)'s look -- source-
// atop composites solid ink only where the frame already has pixels, so
// the shape stays exact without re-deriving it from alpha manually.
function drawSilhouette(x, groundY, scale) {
  if (!currentSprite) return;
  const a = currentSprite.actions[TPAct.idle];
  if (!a) return;
  const img = frameImageData(currentSprite, TPAct.idle, 0);
  if (!img) return;
  const w = a.w * scale, h = a.h * scale;
  frameCanvas.width = a.w; frameCanvas.height = a.h;
  frameCtx.putImageData(img, 0, 0);
  frameCtx.globalCompositeOperation = "source-atop";
  frameCtx.fillStyle = "#1a1a1a";
  frameCtx.fillRect(0, 0, a.w, a.h);
  frameCtx.globalCompositeOperation = "source-over";
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameCanvas, x - w / 2, groundY - h, w, h);
}

// Port of drawEvolveFX(): a pulsing halo, turning rays, a flickering
// silhouette, sparks, and a white-out reveal at the end. Flickers the
// current sprite against itself rather than old-vs-new (the browser build
// doesn't keep the pre-evolution species' sprite around separately), which
// is the one real simplification versus PetScreen.swift's version.
function drawEvolveFx(now) {
  // Scene behind the flash, as on iOS. The creature itself is a silhouette
  // here on purpose -- PetScreen.swift's drawEvolveFX draws both the old
  // and the new form with silhouette: true and reveals the result with
  // the white-out.
  const hour = sceneHour();
  drawScene(fns.dexBiome(fns.speciesId()), now, sceneIsNight(hour, false), hour);
  const t = fns.evolveProgress();
  const cx = TP.cx, cy = 304 - 96, n = now;

  const halo = 36 + t * 150 + 8 * Math.sin(n * 0.02);
  ctx.strokeStyle = UI.white;
  ctx.lineWidth = 2;
  for (let k = 0; k < 4; k++) {
    const r = halo - k * 7;
    if (r > 0) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }
  }

  const base = n * 0.004;
  for (let i = 0; i < 12; i++) {
    const a = base + i * (Math.PI / 6);
    const len = 90 + 70 * (0.5 + 0.5 * Math.sin(n * 0.012 + i));
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    ctx.stroke();
  }

  const period = Math.max(60 + 220 * (1 - t), 1);
  if (t < 0.9 || (now / period) % 2 < 1) drawSilhouette(cx, 304, 3);

  for (let i = 0; i < 10; i++) {
    const a = i * (Math.PI / 5) + t * 4.0;
    const d = (now / 14 + i * 33) % 200;
    const sx = cx + Math.cos(a) * d, sy = cy + Math.sin(a) * d;
    ctx.fillStyle = i & 1 ? "#ffe070" : UI.white;
    ctx.fillRect(sx - 2, sy - 2, 5, 5);
  }

  if (t > 0.9) {
    ctx.fillStyle = UI.white;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(300 * (t - 0.9) / 0.1, 0), 0, Math.PI * 2);
    ctx.fill();
  }

  statusEl.textContent = TPText.status(`Evolving · ${Math.round(t * 100)}%`);
}

// The creature itself during a ceremony: the real animated sprite in the
// given action (pose / walk / hurt), or a flat silhouette for the runaway's
// blink-out frames -- drawSpriteIdle(act:silhouette:) on iOS.
function drawCeremonySprite(x, groundY, act, silhouette, now) {
  if (!currentSprite) return;
  if (silhouette) { drawSilhouette(x, groundY, 3); return; }
  if (!spriteHas(currentSprite, act)) act = TPAct.idle;
  const a = currentSprite.actions[act];
  if (!a) return;
  const frame = frameIndexAt(a, now, true);
  const img = frameImageData(currentSprite, act, frame);
  if (!img) return;
  const s = spriteScale(currentSprite, a);
  const w = a.w * s, h = a.h * s;
  frameCanvas.width = a.w; frameCanvas.height = a.h;
  frameCtx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameCanvas, x - w / 2, groundY - (a.base > 0 ? a.base : a.h) * s, w, h);
}

// Port of drawCeremony(): a golden halo + rising hearts and a walk-off
// right for a farewell; rain + a flinch + fading walk-off left for a
// runaway.
function drawCeremonyFx(now) {
  const panic = fns.ceremony() === 2; // CER_RUNAWAY
  // The creature's own habitat behind the ending, as PetScreen.swift's
  // render() draws the scene before drawCeremony; a runaway happens under
  // a night sky.
  const hour = sceneHour();
  drawScene(fns.dexBiome(fns.speciesId()), now, panic || sceneIsNight(hour, false), hour);
  const t = fns.ceremonyProgress();
  const n = now;
  let x = TP.cx;
  let act = TPAct.idle;
  let hidden = false;

  if (panic) {
    ctx.strokeStyle = "#6a84b0";
    ctx.lineWidth = 1;
    for (let i = 0; i < 46; i++) {
      const rx = (i * 47 + now / 3) % TP.screen;
      const ry = (i * 91 + now / 2) % 470;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 12); ctx.stroke();
    }
    if (t < 0.30) {
      act = TPAct.hurt;
      x = TP.cx + 4 * Math.sin(n * 0.04);
    } else {
      act = TPAct.walkL;
      x = TP.cx - ((t - 0.30) / 0.70) * (TP.cx + 120);
      hidden = t > 0.6 && (now / 160) % 2 < 1;
    }
  } else {
    const gcy = 304 - 96;
    ctx.strokeStyle = "#ffdf8a";
    ctx.lineWidth = 2;
    for (let k = 0; k < 4; k++) {
      const r = 60 + k * 34 + 10 * Math.sin(n * 0.02);
      ctx.beginPath(); ctx.arc(TP.cx, gcy, r, 0, Math.PI * 2); ctx.stroke();
    }
    for (let i = 0; i < 16; i++) {
      const px = (i * 71 + 28) % TP.screen;
      const py = 410 - ((now / 8 + i * 70) % 360);
      if (py < 30) continue;
      if (i % 4 === 0) {
        drawIcon(TPIcon.heart, px - 8, py - 8, 1);  // same glyph as PetScreen.swift's drawCeremony
      } else {
        ctx.fillStyle = i % 2 === 1 ? "#ffe79f" : "#ff9ac0";
        ctx.fillRect(px, py, 4, 4);
      }
    }
    if (t < 0.45) {
      act = TPAct.pose;
    } else {
      act = TPAct.walkR;
      x = TP.cx + ((t - 0.45) / 0.55) * (TP.cx + 140);
    }
  }

  // The real animated sprite -- bowing, then walking off (farewell), or
  // flinching, then a fading walk-off (runaway). Only the runaway's blink
  // frames are a silhouette, exactly as drawSpriteIdle(silhouette:) on iOS;
  // this used to draw a silhouette for the whole ceremony.
  drawCeremonySprite(x, 304, act, panic && hidden, now);
  if (!panic && fns.showHeart() !== 0) drawIcon(TPIcon.heart, x + 50, 304 - 190, 2);

  if (panic && t < 0.55) {
    ctx.fillStyle = "#9ac4e8";
    ctx.fillRect(x + 6, 304 - 150 + ((now / 6) % 40), 3, 6);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = panic ? UI.inkNight : UI.ink;
  ctx.font = "bold 20px monospace";
  ctx.fillText(fns.name(), TP.cx, 60);
  ctx.font = "16px monospace";
  ctx.fillText(fns.ceremonyMessage(), TP.cx, 90);

  statusEl.textContent = TPText.status(`Ceremony · ${fns.ceremonyMessage()}`);
}

// Drawn instead of the normal idle scene while a ceremony/evolution
// animation is in progress. Deliberately simplified from
// PetScreen.swift's drawEvolveFX/drawCeremony in one way: it flickers the
// current sprite against itself during evolution rather than the old form
// against the new one, since this build doesn't keep a second sprite
// around for the species being evolved from.
function drawCeremonyOrEvolving(now) {
  if (fns.evolvingNow() !== 0) { drawEvolveFx(now); return; }
  drawCeremonyFx(now);
}

/* Direct home evolution decision; native evolution remains authoritative. */
(function(root){
 'use strict';
 const words={
  en:{title:'Evolution',yes:'Yes',no:'No',target:'Choose an evolution.'},
  de:{title:'Entwicklung',yes:'Ja',no:'Nein',target:'Wähle ein Entwicklungsziel.'},
  es:{title:'Evolución',yes:'Sí',no:'No',target:'Elige una evolución.'},
  fr:{title:'Évolution',yes:'Oui',no:'Non',target:'Choisis une évolution.'}
 };
 let registered=false,element=null,owner=null,busy=false,previousFocus=null;
 function tr(key){
  if(!registered&&root.TPText?.registerLocale){
   for(const [code,entries]of Object.entries(words))
    root.TPText.registerLocale(code,Object.fromEntries(
     Object.entries(entries).map(([name,value])=>['homeEvolution.'+name,value])
    ));
   registered=true;
  }
  return root.TPText?.t('homeEvolution.'+key)||words.de[key];
 }
 function report(error){
  try{root.TPDiagnostics?.record('manager',error);}catch(_){}
 }
 function permitted(open=false){
  return typeof Module!=='undefined'&&!!Module&&screen==='idle'&&
   choice===(open?'evolve':'none')&&document.visibilityState==='visible'&&
   !!root.TPCollectionGame?.ready&&!tpSaveReplacing&&
   !root.TPCollection?.busy&&!root.TPCollection?.blocked&&
   !root.TPCollectionGame?.dialogOpen&&!root.TPAppMenu?.active&&
   !root.TPBoxes?.active&&!root.TPAdmissionUI?.active&&
   !root.TPAdmissionUI?.busy&&!root.TPActions?.active&&!root.TPActions?.busy&&
   !root.TPActivities?.active&&!root.TPMega?.busy&&!root.TPTraining?.busy&&
   !root.TPArena?.busy&&!root.TPLeague?.busy&&!root.TPExpeditions?.busy&&
   !fns.isEgg()&&!fns.awaitingStarter()&&!fns.sleeping()&&
   !fns.ceremony()&&!fns.evolvingNow()&&!fns.wildPromptActive()&&
   performance.now()>=feedMenuUntil&&performance.now()>=confirmUntil;
 }
 function identity(){
  const s=root.TPCollection.read();
  const m=s.mons.find(m=>m.id===s.active);
  const native=JSON.parse(Module.ccall('tp_f4_life_state','string',[],[]));
  if(!m||!native.valid||!native.snapshot||
     m.dex!==fns.speciesId()||m.data.lifeToken!==native.token)
   return null;
  return {mod:Module,id:m.id,dex:m.dex,life:native.token};
 }
 function valid(){
  if(!owner||!permitted(true))return false;
  const current=identity();
  return !!current&&current.mod===owner.mod&&current.id===owner.id&&
   current.dex===owner.dex&&current.life===owner.life;
 }
 function hide(){
  if(element)element.hidden=true;
  owner=null;
  if(choice==='evolve')choice='none';
  if(previousFocus?.isConnected)previousFocus.focus?.({preventScroll:true});
  previousFocus=null;
 }
 function ensure(){
  if(element)return;
  const host=document.getElementById('tp-game-shell');
  if(!host)throw Error('HOME_EVOLUTION_HOST_MISSING');
  const style=document.createElement('style');
  style.textContent=`
   #tp-home-evolution[hidden]{display:none!important}
   #tp-home-evolution{
    position:absolute;inset:0;z-index:950;display:flex;
    align-items:center;justify-content:center;padding:12px;
    box-sizing:border-box;background:rgba(35,48,49,.38);
    touch-action:manipulation;
   }
   #tp-home-evolution .tp-home-evo-card{
    /* Compact home evolution, matching the existing release colours. */
    width:64%;max-width:300px;min-width:min(210px,100%);
    max-height:100%;overflow:auto;
    box-sizing:border-box;padding:14px;border:1px solid #292831;
    border-radius:16px;background:#fff;color:#292831;
    box-shadow:none;font:clamp(11px,3.2vw,15px)/1.3 monospace;
    text-align:center;
   }
   #tp-home-evolution h2{
    position:absolute;width:1px;height:1px;margin:-1px;padding:0;
    overflow:hidden;clip-path:inset(50%);white-space:nowrap;
   }
   #tp-home-evolution p{margin:4px 0 18px;font-weight:700}
   #tp-home-evolution .tp-home-evo-actions{
    display:grid;grid-template-columns:1fr 1fr;gap:20px;
   }
   #tp-home-evolution button{
    min-height:48px;min-width:44px;padding:8px;
    border:0;border-radius:12px;
    background:#fffaf0;color:#292831;font:inherit;font-weight:700;
   }
   #tp-home-evolution [data-home-evo-answer]{
    color:#fff;text-transform:uppercase;
   }
   #tp-home-evolution [data-home-evo-answer="yes"]{
    background:var(--tp-home-evo-yes);
   }
   #tp-home-evolution [data-home-evo-answer="no"]{
    background:var(--tp-home-evo-no);
   }
   #tp-home-evolution button:disabled{opacity:.5}
   #tp-home-evolution .tp-home-evo-targets{
    display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
    gap:6px;margin-bottom:12px;
   }
   #tp-home-evolution [aria-pressed="true"]{
    outline:2px solid #315b83;outline-offset:1px;
   }
  `;
  document.head.append(style);
  element=document.createElement('section');
  element.id='tp-home-evolution';element.hidden=true;
  element.style.setProperty('--tp-home-evo-yes',UI.barOK);
  element.style.setProperty('--tp-home-evo-no',UI.barBad);
  element.setAttribute('role','dialog');
  element.setAttribute('aria-modal','true');
  element.setAttribute('aria-labelledby','tp-home-evolution-title');
  for(const type of ['pointerdown','pointerup','click'])
   element.addEventListener(type,event=>event.stopPropagation());
  element.addEventListener('keydown',event=>{
   if(event.key==='Escape'){
    event.preventDefault();event.stopPropagation();answer(false);return;
   }
   if(event.key!=='Tab')return;
   const buttons=[...element.querySelectorAll('button:not(:disabled)')];
   const first=buttons[0],last=buttons[buttons.length-1];
   if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();last?.focus();
   }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();first?.focus();
   }
  });
  host.append(element);
 }
 function node(tag,value){
  const n=document.createElement(tag);
  if(value!==undefined)n.textContent=value;
  return n;
 }
 function targets(){
  const count=Module.ccall('tp_evo_rule_count','number',['number'],[owner.dex]);
  if(!Number.isInteger(count)||count<1||count>64)
   throw Error('HOME_EVOLUTION_RULES_INVALID');
  const ready=new Set();
  for(let i=0;i<count;i++){
   const field=key=>Module.ccall('tp_evo_rule_field','number',
    ['number','number','number'],[owner.dex,i,key]);
   if(field(9))ready.add(field(0));
  }
  return [...ready];
 }
 function answer(yes){
  if(busy||!owner)return;
  try{
   if(!valid()){hide();return;}
   if(yes&&(!fns.canEvolveNow()||owner.target===null))return;
   busy=true;
   const mod=owner.mod;
   if(!yes){mod._tp_decline_evolve();hide();return;}
   const ok=owner.target===0?
    (mod._tp_evolve(),!!fns.evolvingNow()):
    mod.ccall('tp_evo_choose','number',['number'],[owner.target])===1;
   if(!ok){hide();playSfx(7);return;}
   hide();
   Promise.resolve(saveNow(mod)).catch(report);
  }catch(error){report(error);hide();}
  finally{busy=false;}
 }
 function request(){
  if(owner||busy||!permitted()||!fns.wantsEvolve()||!fns.canEvolveNow())
   return false;
  const current=identity();
  if(!current)return false;
  ensure();owner=current;
  try{
   const options=targets();
   if(!options.length){owner=null;return false;}
   const automatic=!!root.TPComfort?.autoEvolve();
   owner.target=automatic?0:options.length===1?options[0]:null;
   const card=node('div');card.className='tp-home-evo-card';
   const title=node('h2',tr('title'));title.id='tp-home-evolution-title';
   const question=node('p',fns.evolveQuestion());
   card.append(title,question);
   const actions=node('div');actions.className='tp-home-evo-actions';
   const yes=node('button',tr('yes')),no=node('button',tr('no'));
   yes.type=no.type='button';
   yes.dataset.homeEvoAnswer='yes';no.dataset.homeEvoAnswer='no';
   yes.disabled=owner.target===null;
   yes.addEventListener('click',()=>answer(true));
   no.addEventListener('click',()=>answer(false));
   if(owner.target===null){
    const grid=node('div');grid.className='tp-home-evo-targets';
    card.append(node('p',tr('target')));
    for(const target of options){
     const pick=node('button',fns.dexName(target));pick.type='button';
     pick.setAttribute('aria-pressed','false');
     pick.addEventListener('click',()=>{
      if(busy||!valid())return;
      owner.target=target;
      for(const button of grid.children)
       button.setAttribute('aria-pressed',String(button===pick));
      yes.disabled=false;
     });
     grid.append(pick);
    }
    card.append(grid);
   }
   actions.append(yes,no);card.append(actions);
   element.replaceChildren(card);
   previousFocus=document.activeElement;
   choice='evolve';dragStart=dragNow=null;element.hidden=false;
   no.focus({preventScroll:true});
   return true;
  }catch(error){report(error);owner=null;return false;}
 }
 function poll(){
  try{
   if(owner){if(!valid())hide();return;}
   request();
  }catch(error){report(error);}
 }
 root.TPHomeEvolution=Object.freeze({
  request,poll,get active(){return !!owner&&!element?.hidden;}
 });
})(globalThis);
