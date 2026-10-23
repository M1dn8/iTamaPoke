// Wild battle screen, ported from PetScreen.swift's renderBattle/battleTap
// (itself a screen design over ShadowEnemyx/TamaPoke ("Expanded")'s
// battle.h combat math -- see upstream-expanded/README.md). All game state
// lives in browser_battle.cpp/battle.cpp; this file only draws it and
// forwards taps, same split as the rest of this port.

// Where closing the battle returns to: the Battle stats page when it was
// started from there, the idle screen for a wild encounter -- the iOS app's
// own "stay on the stat page after a battle" rule.
let battleReturn = "idle";

function drawBattleHpBar(x, y, cur, max, color) {
  const w = 150, m = max === 0 ? 1 : max;
  const fw = Math.min(w * cur / m, w);
  ctx.fillStyle = UI.track;
  roundRect(x, y, w, 14, 4);
  ctx.fill();
  if (fw > 2) { ctx.fillStyle = color; roundRect(x, y, fw, 14, 4); ctx.fill(); }
}

// Reuses the idle sprite loader/frame-walker already loaded for the raised
// species. The wild side used to always fall back to the "?" placeholder
// unless the opponent happened to be the same species you're raising --
// `currentSprite` only ever holds the *active* pet. Now it also consults
// what sprites.js has already parsed, and kicks off a load for anything it
// hasn't seen yet, so the opponent shows its real sprite from the second
// frame onwards (the first draw after a species is first requested still
// shows "?" for the moment the IndexedDB read takes). `undefined` means
// never requested; `null` means requested and no local file exists, which
// stays on "?" without re-requesting every frame.
function battleSprite(dex) {
  return dex === currentDex ? currentSprite : spriteFor(dex, false);
}

function drawBattleSprite(dex, x, now, player=false) {
  const sprite=player?(window.TPMega?.battleActive()?megaSpriteFor(window.TPMega.shiny(),window.TPMega.battleForm()):spriteFor(dex,!!window.TPMega?.shiny())):spriteFor(dex,false);
  if (!sprite) {
    ctx.font = "bold 40px monospace";
    ctx.fillStyle = "#98a0b0";
    ctx.textAlign = "center";
    ctx.fillText("?", x, 260);
    return;
  }
  const a = sprite.actions[TPAct.idle];
  if (!a) return;
  const frame = frameIndexAt(a, now, true);
  const img = frameImageData(sprite, TPAct.idle, frame);
  if (!img) return;
  const s = Math.min(spriteScale(sprite, a), 3);
  const w = a.w * s, h = a.h * s;
  frameCanvas.width = a.w; frameCanvas.height = a.h;
  frameCtx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameCanvas, x - w / 2, 286 - (a.base > 0 ? a.base : a.h) * s, w, h);
}

function drawBattle(now) {
  if(!Module.ccall("tp_battle_is_open","number",[],[])){screen=battleReturn;return;}
  // The creature's own habitat behind the fight, as renderBattle's
  // drawGameScene does on iOS -- not a flat panel.
  const { night, ink } = drawGameScene();
  const trainer=window.TPTrainer.active();
  if(trainer&&(!Module.ccall('tp_f2_can_actor','number',[],[])||document.visibilityState!=='visible')){window.TPTrainer.abort();return;}
  if(trainer){ctx.fillStyle=ink;ctx.textAlign='center';ctx.font='12px sans-serif';ctx.fillText('Gegner '+(window.TPTrainer.get(2)+1)+' / '+window.TPTrainer.get(1),TP.cx,62);}

  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.font = "bold 20px monospace";
  ctx.fillText(fns.battleTitle(), TP.cx, 40);

  ctx.textAlign = "left";
  ctx.font = "bold 15px monospace";
  ctx.fillText(fns.battlePlayerLabel(), 28, 88);
  const rightLabel = fns.battleEnemyLabel();
  ctx.textAlign = "right";
  ctx.fillText(rightLabel, 438, 88);

  drawBattleHpBar(28, 110, fns.battlePlayerHp(), fns.battlePlayerMaxHp(), UI.barOK);
  drawBattleHpBar(288, 110, fns.battleEnemyHp(), fns.battleEnemyMaxHp(), UI.barBad);

  const dex = fns.speciesId(), wildDex = fns.battleWildDex();
  ctx.textAlign = "left";
  ctx.font = "10px monospace";
  const pt1=window.TPMega?.battleType(1)||fns.dexType1(dex),pt2=window.TPMega?window.TPMega.battleType(2):fns.dexType2(dex);
  const t1=TYPE_NAMES[pt1]||"";
  const t2=pt2?("/"+(TYPE_NAMES[pt2]||"")):"";
  ctx.fillStyle = TYPE_COLORS[fns.dexType1(dex)] || ink;
  ctx.fillText(t1 + t2, 28, 134);
  const et1 = TYPE_NAMES[fns.dexType1(wildDex)] || "";
  const et2 = fns.dexType2(wildDex) ? "/" + TYPE_NAMES[fns.dexType2(wildDex)] : "";
  ctx.textAlign = "right";
  ctx.fillStyle = TYPE_COLORS[fns.dexType1(wildDex)] || ink;
  ctx.fillText(et1 + et2, 438, 134);

  const resolved = fns.battleResolved() !== 0;
  if (!resolved || (trainer&&window.TPTrainer.get(3))) {
    ctx.fillStyle = UI.track;
    roundRect(188, 102, 90, 32, 9);
    ctx.fill();
    ctx.fillStyle = UI.bgDay;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 13px monospace";
    ctx.fillText(fns.battleRunText(), 233, 118);
    ctx.textBaseline = "alphabetic";
  }
  // Small "already caught" marker beside the wild side's HP bar, same glyph
  // and spot as PetScreen.swift's renderBattle. Drawn after the RUN box so
  // it isn't painted over while the battle is still in progress (the iOS
  // build had exactly that bug until its draw order was fixed).
  if (fns.battleWildAlreadyCaught() !== 0) drawIcon(TPIcon.food, 258, 108, 1);

  drawBattleSprite(dex, 142, now, true);
  drawBattleSprite(wildDex, 328, now);

  if(trainer&&window.TPTrainer.get(3)){
    ctx.textAlign='center';ctx.fillStyle=ink;ctx.font='bold 22px sans-serif';ctx.fillText('Gegner besiegt',TP.cx,316);
    ctx.font='14px sans-serif';ctx.fillText('Deine Rest-KP: '+fns.battlePlayerHp()+' / '+fns.battlePlayerMaxHp(),TP.cx,344);
    window.TPTrainer.button('Nächster Gegner',365,UI.barOK);
    statusEl.textContent='Trainerkampf: Gegnerwechsel ohne Heilung';return;
  }
  if (resolved) {
    const won = fns.battlePlayerWon() !== 0;
    ctx.fillStyle = won ? UI.barOK : UI.barBad;
    ctx.textAlign = "center";
    ctx.font = "bold 32px monospace";
    ctx.fillText(trainer?(won?'SIEG':'NIEDERLAGE'):fns.battleResultText(), TP.cx, 312);
    ctx.fillStyle = ink;
    ctx.font = "13px monospace";
    ctx.fillText(fns.battleRoundsLine(), TP.cx, 338);
    ctx.fillText(fns.battleDamageLine(), TP.cx, 360);

    if(trainer){ctx.font='12px sans-serif';ctx.fillStyle=ink;ctx.fillText('Grundsystem – noch ohne Belohnungen',TP.cx,382);}
    if (won) {
      const reward = fns.battleRewardLine();
      if (reward) { ctx.fillStyle = UI.barWarn; ctx.fillText(reward, TP.cx, 382); }
    } else {
      const cc = fns.battleCloseChanceText();
      if (cc) { ctx.fillStyle = UI.barWarn; ctx.fillText(cc, TP.cx, 382); }
    }

    const catchOffered = fns.battleCatchOffered() !== 0, catchDone = fns.battleCatchDone() !== 0;
    if (catchOffered && !catchDone) {
      ctx.fillStyle = UI.barOK;
      roundRect(76, 396, 148, 52, 14); ctx.fill();
      ctx.fillStyle = UI.track;
      roundRect(242, 396, 148, 52, 14); ctx.fill();
      ctx.fillStyle = UI.bgDay;
      ctx.font = "bold 13px monospace";
      ctx.textBaseline = "middle";
      ctx.fillText(fns.battleCatchWildText(), 150, 422);
      ctx.fillText(fns.battleLeaveWildText(), 316, 422);
      ctx.textBaseline = "alphabetic";
    } else {
      if (catchDone && fns.battleCatchTried() !== 0) {
        const success = fns.battleCatchSuccess() !== 0;
        ctx.fillStyle = success ? UI.barOK : UI.barBad;
        ctx.font = "13px monospace";
        ctx.fillText(success ? fns.battleCaughtOkText() : fns.battleEscapedText(), TP.cx, 382);
      }
      ctx.fillStyle = UI.barOK;
      roundRect(118, 396, 230, 52, 14); ctx.fill();
      ctx.fillStyle = UI.bgDay;
      ctx.font = "bold 16px monospace";
      ctx.textBaseline = "middle";
      ctx.fillText(fns.battleOkText(), TP.cx, 422);
      ctx.textBaseline = "alphabetic";
    }
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = ink;
    ctx.font = "13px monospace";
    ctx.fillText(fns.battleRoundLabel(), 32, 322);
    const msg = fns.battleMessage();
    if (msg) {
      ctx.textAlign = "center";
      ctx.fillText(msg, TP.cx, 322);
      const dmg = fns.battleLastEnemyDamage();
      if (dmg > 0) {
        ctx.fillStyle = UI.barBad;
        ctx.fillText("-" + dmg, TP.cx, 344);
      }
    }

    if (fns.battleAttackMenuOpen() !== 0) {
      ctx.fillStyle = UI.barBad;
      roundRect(74, 298, 150, 46, 12); ctx.fill();
      ctx.fillStyle = UI.barWarn;
      roundRect(242, 298, 150, 46, 12); ctx.fill();
      ctx.fillStyle = UI.bgDay;
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(fns.battleQuickAttackText(), 149, 321);
      ctx.fillText(fns.battleHeavyAttackText(), 317, 321);
      ctx.textBaseline = "alphabetic";
    }

    ctx.fillStyle = UI.barBad;
    roundRect(58, 358, 108, 58, 13); ctx.fill();
    ctx.fillStyle = "#4C98D9";
    roundRect(179, 358, 108, 58, 13); ctx.fill();
    ctx.fillStyle = UI.barOK;
    roundRect(300, 358, 108, 58, 13); ctx.fill();
    ctx.fillStyle = UI.bgDay;
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fns.battleAttackText(), 112, 387);
    ctx.fillText(fns.battleDodgeText(), 233, 387);
    ctx.fillText(fns.battleRestText(), 354, 387);
    ctx.textBaseline = "alphabetic";
  }

  statusEl.textContent = TPText.status(resolved
    ? `Battle · ${fns.battlePlayerWon() ? "won" : "lost"}`
    : `Battle · round ${fns.battleRound() + 1} · HP ${fns.battlePlayerHp()}/${fns.battlePlayerMaxHp()}`);
}

function battleTap(x, y) {
  if(window.TPTrainer.active()&&window.TPTrainer.get(3)){
    if(x>=118&&x<=348&&y>=365&&y<=417){Module.ccall('tp_f2_next','number',[],[]);return;}
    if(x>=184&&x<=282&&y>=100&&y<=136)window.TPTrainer.abort();
    return;
  }
  const resolved = fns.battleResolved() !== 0;
  if (resolved) {
    const catchOffered = fns.battleCatchOffered() !== 0, catchDone = fns.battleCatchDone() !== 0;
    if (catchOffered && !catchDone) {
      if (x >= 76 && x <= 224 && y >= 392 && y <= 448) { Module._tp_battle_try_catch(); return; }
      if (x >= 242 && x <= 390 && y >= 392 && y <= 448) { Module._tp_battle_leave_wild(); return; }
      return;
    }
    if (x >= 118 && x <= 348 && y >= 392 && y <= 454) {
      Module._tp_battle_close();
      screen = battleReturn;
    }
    return;
  }
  if (fns.battleAttackMenuOpen() !== 0) {
    if (x >= 66 && x <= 232 && y >= 292 && y <= 352) { Module._tp_battle_quick_attack(); return; }
    if (x >= 234 && x <= 400 && y >= 292 && y <= 352) { Module._tp_battle_heavy_attack(); return; }
    Module._tp_battle_close_attack_menu();
    return;
  }
  if (x >= 184 && x <= 282 && y >= 100 && y <= 136) {
    Module._tp_battle_close();
    screen = battleReturn;
    return;
  }
  if (x >= 46 && x <= 174 && y >= 344 && y <= 428) {
    Module._tp_battle_open_attack_menu();
  } else if (x >= 169 && x <= 297 && y >= 344 && y <= 428) {
    Module._tp_battle_dodge();
  } else if (x >= 292 && x <= 420 && y >= 344 && y <= 428) {
    Module._tp_battle_rest();
  }
}

// Idle-screen wild-encounter prompt: a small "fight or later" card, shown
// only while the idle screen itself is the front-most thing (mirrors
// PetScreen.swift's mainScreenReadyForWild gate).
function drawWildPrompt() {
  ctx.fillStyle = UI.white;
  roundRect(82, 156, 302, 178, 18); ctx.fill();
  ctx.strokeStyle = UI.ink; ctx.lineWidth = 2;
  roundRect(82, 156, 302, 178, 18); ctx.stroke();
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "center";
  ctx.font = "bold 18px monospace";
  ctx.fillText(fns.battleWildQuestionText(), TP.cx, 182);
  ctx.font = "13px monospace";
  ctx.fillText(fns.battleWildPromptLine(), TP.cx, 212);

  ctx.fillStyle = UI.barBad;
  roundRect(93, 226, 280, 44, 12); ctx.fill();
  ctx.fillStyle = UI.track;
  roundRect(93, 278, 280, 44, 12); ctx.fill();
  ctx.fillStyle = UI.white;
  ctx.font = "bold 15px monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(fns.battleFightText(), TP.cx, 248);
  ctx.fillStyle = UI.bgDay;
  ctx.fillText(fns.battleLaterText(), TP.cx, 300);
  ctx.textBaseline = "alphabetic";
}

function wildPromptTap(x, y) {
  if (x >= 93 && x <= 373 && y >= 226 && y <= 270) {
    Module._tp_wild_accept();
    battleReturn = "idle";
    screen = "battle"; // its own screen id, distinct from the minigames' "game"
    return;
  }
  if (x >= 93 && x <= 373 && y >= 278 && y <= 322) {
    Module._tp_wild_dismiss();
  }
}

// F2 UI owns no combat state. Native code validates the selected roster.
(function(){'use strict';
const call=(name,...args)=>Module.ccall(name,'number',args.map(()=> 'number'),args);
const get=k=>call('tp_f2_get',k);
function active(){return !!get(0);}
function canOpen(){try{return screen==='card'&&cardPage===4&&choice==='none'&&!tpSaveReplacing&&!window.TPTraining?.busy&&!window.TPMega?.busy&&!window.TPExpeditions?.busy&&!!call('tp_f2_can');}catch(_e){return false;}}
function open(){if(!canOpen())return false;dragStart=dragNow=null;screen='trainer';return true;}
function back(){dragStart=dragNow=null;screen='card';cardPage=4;}
function abort(){if(active())Module._tp_battle_close();back();}
function button(label,y,color){ctx.fillStyle=color;roundRect(118,y,230,52,12);ctx.fill();ctx.fillStyle=UI.bgDay;ctx.textAlign='center';ctx.font='bold 16px sans-serif';ctx.fillText(label,TP.cx,y+32);}
function start(team){
 if(screen!=='trainer'||tpSaveReplacing||document.visibilityState!=='visible'||window.TPTraining?.busy||window.TPMega?.busy||window.TPExpeditions?.busy)return false;
 if(!call('tp_f2_start',team))return false;
 dragStart=dragNow=null;battleReturn='card';screen='battle';return true;
}
function draw(){
 const {ink}=drawGameScene();ctx.fillStyle=ink;ctx.textAlign='center';ctx.font='bold 24px sans-serif';ctx.fillText('Trainerkämpfe',TP.cx,58);
 ctx.font='15px sans-serif';ctx.fillText('Dein aktuelles Pokémon kämpft allein.',TP.cx,100);
 ctx.fillText('Rest-KP und Erholungen bleiben erhalten.',TP.cx,126);
 button('Einzelduell · 1 Gegner',165,'#397ab6');button('Teamduell · 2 Gegner',235,UI.barBad);
 ctx.fillStyle=ink;ctx.font='13px sans-serif';ctx.fillText('Noch ohne Belohnungen und Fangoption.',TP.cx,320);
 ctx.fillText('App-Wechsel oder Neuladen beendet die Serie.',TP.cx,343);
 button('Zurück',365,UI.track);statusEl.textContent='Trainerkämpfe · Grundsystem';
}
function tap(x,y){if(x<118||x>348)return;if(y>=165&&y<=217)start(0);else if(y>=235&&y<=287)start(1);else if(y>=365&&y<=417)back();}
function hidden(){if(typeof Module==='undefined'||!Module)return;if(document.visibilityState!=='visible'&&(screen==='trainer'||active()))abort();}
document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',()=>{if(typeof Module!=='undefined'&&Module&&(screen==='trainer'||active()))abort();});
window.TPTrainer=Object.freeze({get,active,canOpen,open,start,abort,draw,tap,button});
})();
