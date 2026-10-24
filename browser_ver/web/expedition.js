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

const EXP_TILE_X = [50, 180, 310];
const EXP_ITEM_POS = [[50, 204], [244, 204], [50, 268], [244, 268]];

let expeditionTrainChoiceOpen = false;

function drawCardExpedition() {
  ctx.textAlign="center";ctx.fillStyle=UI.ink;ctx.font="bold 20px monospace";ctx.fillText(fns.expeditionTitle(),TP.cx,44);
  const api=window.TPExpeditions;let v=null;try{v=api&&api.view();}catch(_e){}
  if(!v){ctx.font="13px monospace";ctx.fillText("Test-Build bitte aktualisieren",TP.cx,120);return;}
  const box=(x,y,w,h,enabled,color)=>{ctx.fillStyle=enabled?UI.white:rgb565(0xE4E7);roundRect(x,y,w,h,10);ctx.fill();ctx.strokeStyle=enabled?color:UI.track;ctx.lineWidth=2;roundRect(x,y,w,h,10);ctx.stroke();};
  if(!v.pending){
    const positions=[[32,66],[244,66],[32,148],[244,148]],colors=[UI.barWarn,"#4C98D9",UI.barOK,UI.barBad];
    for(let i=0;i<4;i++){
      const t=api.targets[i],x=positions[i][0],y=positions[i][1],enabled=!v.busy&&v.quiet&&v.reasons[i]===0;
      box(x,y,190,70,enabled,colors[i]);ctx.fillStyle=enabled?UI.ink:UI.track;ctx.font="bold 15px monospace";ctx.fillText(t.name,x+95,y+25);
      ctx.font="11px monospace";ctx.fillText(t.item+" ×1 · "+t.minutes+" Min · -"+t.cost,x+95,y+50);
    }
  }else{
    ctx.fillStyle=UI.ink;ctx.font="bold 16px monospace";ctx.fillText((api.oldNames[v.s[10]]||"Expedition")+(v.s[26]?"":" (alt)"),TP.cx,91);
    ctx.font="14px monospace";ctx.fillText(v.ready?api.itemNames[v.s[24]]+" ×1 gefunden":"Noch "+v.left+" Min",TP.cx,123);
    if(v.ready){const enabled=!v.busy&&v.quiet&&v.canClaim;box(118,148,230,44,enabled,UI.barOK);ctx.fillStyle=enabled?UI.ink:UI.track;ctx.font="bold 15px monospace";ctx.fillText("Abholen",TP.cx,176);}
  }
  ctx.fillStyle=UI.track;ctx.font="12px monospace";
  const hint=v.notice||(v.ready&&!v.canClaim?(v.s[20+v.s[24]]>=3?api.itemNames[v.s[24]]+"fach voll – Gegenstand verwenden":"Abholung gerade gesperrt"):!v.pending?"Expedition antippen und starten":"Inventar");
  ctx.fillText(hint,TP.cx,239);
  drawExpeditionItem(50,250,0);drawExpeditionItem(244,250,1);drawExpeditionItem(50,314,2);drawExpeditionItem(244,314,3);
  if(expeditionTrainChoiceOpen)drawExpeditionTrainChoice();statusEl.textContent=TPText.status("Card · Expedition");
}

function drawExpeditionItem(x, y, index) {
  const count = fns.expeditionItemCount(index);
  const col = rgb565(fns.expeditionItemColor(index));
  // An empty slot is a faded card, not a black hole -- same light panel
  // the iOS build uses, with the outline and text greyed instead.
  ctx.fillStyle = count > 0 ? UI.white : rgb565(0xE4E7);   // PetScreen's empty-slot fill
  roundRect(x, y, 172, 54, 9); ctx.fill();
  ctx.strokeStyle = count > 0 ? col : UI.track; ctx.lineWidth = 1;
  roundRect(x, y, 172, 54, 9); ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 22, y + 27, 12, 0, Math.PI * 2);
  ctx.fillStyle = count > 0 ? col : UI.track;
  ctx.fill();
  ctx.textAlign = "left";
  ctx.fillStyle = count > 0 ? UI.ink : UI.track;
  ctx.font = "11px monospace";
  ctx.fillText(["Nahrung", "Energie", "Pflege", "Training"][index], x + 42, y + 24);
  ctx.textAlign = "right";
  ctx.font = "bold 13px monospace";
  ctx.fillText(`x${count}`, x + 160, y + 34);
}

function drawExpeditionTrainChoice() {
  ctx.fillStyle = UI.white;
  roundRect(58, 118, 350, 190, 14); ctx.fill();
  ctx.strokeStyle = UI.ink; ctx.lineWidth = 2;
  roundRect(58, 118, 350, 190, 14); ctx.stroke();
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "center";
  ctx.font = "13px monospace";
  ctx.fillText(fns.trainChoiceTitle(), TP.cx, 140);

  const cols = [UI.barBad, "#4C98D9", UI.barWarn];
  for (let i = 0; i < 3; i++) {
    const x = 74 + i * 108;
    const usable = fns.trainStatUsable(i) !== 0;
    ctx.fillStyle = usable ? cols[i] : UI.track;
    roundRect(x, 172, 102, 66, 9); ctx.fill();
    ctx.fillStyle = UI.bgDay;
    ctx.font = "bold 13px monospace";
    ctx.fillText(fns.trainStatLabel(i), x + 51, 190);
    ctx.font = "11px monospace";
    ctx.fillText(usable ? "+2" : fns.trainMaxedText(), x + 51, 214);
  }
  ctx.fillStyle = UI.track;
  ctx.font = "12px monospace";
  ctx.fillText(fns.backHint(), TP.cx, 288);
}

function expeditionItemAt(x, y) {
  if (!((y >= 204 && y <= 258) || (y >= 268 && y <= 322))) return null;
  const left = x >= 50 && x <= 222, right = x >= 244 && x <= 416;
  if (!left && !right) return null;
  const row = y >= 268 ? 1 : 0;
  return row * 2 + (right ? 1 : 0);
}

function cardExpeditionTap(x,y) {
  const api=window.TPExpeditions;if(!api||api.busy)return;const v=api.view();if(!v)return;
  if(expeditionTrainChoiceOpen){
    if(y>=172&&y<=238&&x>=74&&x<=398){const stat=Math.floor((x-74)/108);if(stat<=2&&fns.trainStatUsable(stat)!==0)api.use(3,stat);else api.tell("Training bereits maximal");}
    expeditionTrainChoiceOpen=false;return;
  }
  if(y>=250&&y<=304||y>=314&&y<=368){
    const col=x>=50&&x<=222?0:x>=244&&x<=416?1:-1;if(col<0)return;const item=(y>=314?2:0)+col;
    if(fns.expeditionItemCount(item)===0){api.tell("Kein Gegenstand vorhanden");return;}
    if(item===3)expeditionTrainChoiceOpen=true;else api.use(item);return;
  }
  if(v.pending){if(v.ready&&x>=118&&x<=348&&y>=148&&y<=192)api.claim();return;}
  const positions=[[32,66],[244,66],[32,148],[244,148]];
  for(let i=0;i<4;i++)if(x>=positions[i][0]&&x<=positions[i][0]+190&&y>=positions[i][1]&&y<=positions[i][1]+70){api.start(i+1);return;}
}

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
