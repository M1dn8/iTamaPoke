/* Shared battle presentation. Original Canvas scenery, no bundled species art.
 * Native snapshots own stats/damage; this module only renders and routes taps.
 */
(function(){'use strict';let key='',menu='main',last=null,targets={},feedbackAt=0,feedbackKey='',captureFx=null,captureView=null;
const activeStoryUI=()=>window.TPMewUI?.owns()?window.TPMewUI:
 window.TPMewtuUI?.owns()?window.TPMewtuUI:
 window.TPLavadosUI?.owns()?window.TPLavadosUI:
 window.TPArktosUI?.owns()?window.TPArktosUI:window.TPZapdosUI;
const leagueText=(key,params={})=>window.TPLeagueText?
 window.TPLeagueText.t(key,params):TPText.t('leagueTeam.'+key,params);
const call=(n,...a)=>Module.ccall(n,'number',a.map(()=> 'number'),a);
// The application loads the registered labels. Isolated legacy renderer
// fixtures may intentionally provide neither that module nor TPText.
const controlText=key=>{
 if(window.TPBattleControlsText)return window.TPBattleControlsText.t(key);
 if(typeof TPText!=='undefined')return TPText.t('battleControls.'+key);
 return ({
  fight:'Kampf',pokemon:'Pokémon',heal:'Heilung',giveUp:'Aufgeben',
  quick:'Schnell',dodge:'Ausweichen',heavy:'Kräftig',back:'Zurück'
 })[key]||key;
};
const themes=['ice','rock','ghost','dragon','champ'];

let teamIndicators=null;
function teamText(key,params){return window.TPWildTeam.text(key,params);}
function teamBall(x,y,ready,active){
 if(ready)ball(x,y,5);
 else{
  ctx.save();ctx.lineWidth=1.3;ctx.strokeStyle='#666b70';
  ctx.fillStyle='#b5b7b8';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);
  ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.stroke();
  ctx.strokeStyle='#3e4247';ctx.beginPath();
  ctx.moveTo(x-4,y-4);ctx.lineTo(x+4,y+4);
  ctx.moveTo(x+4,y-4);ctx.lineTo(x-4,y+4);ctx.stroke();ctx.restore();
 }
 if(active){
  ctx.save();ctx.strokeStyle='#292831';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(x-5,y+9);ctx.lineTo(x+5,y+9);
  ctx.stroke();ctx.restore();
 }
}
function drawTeamIndicators(m){
 teamIndicators=null;
 if(!m.wildTeam)return;
 const player=m.wildTeam.members.map((p,i)=>Object.freeze({
  id:p.id,ready:p.hp>0,active:i===m.wildTeam.active
 }));
 const enemy=(m.enemyTeam||[{ready:m.enemy.hp>0,active:true}]).map(p=>Object.freeze({...p}));
 teamIndicators=Object.freeze({
  player:Object.freeze(player),enemy:Object.freeze(enemy)
 });
 player.forEach((p,i)=>teamBall(239+i*18,201,p.ready,p.active));
 enemy.forEach((p,i)=>teamBall(35+i*18,126,p.ready,p.active));
 text(teamText('count',{
  ready:player.filter(p=>p.ready).length,total:player.length
 }),438,204,9,'#292831',96,'right');
 text(teamText('count',{
  ready:enemy.filter(p=>p.ready).length,total:enemy.length
 }),227,129,9,'#292831',150,'right');
}
function drawTeamMenu(m){
 const state=m.wildTeam;
 panel(26,126,414,168);
 text(teamText(state.needsSwitch?'forced':'choose'),233,143,11);
 state.members.forEach((p,i)=>{
  const x=34+(i%2)*203,y=150+Math.floor(i/2)*46;
  const enabled=p.hp>0&&i!==state.active;
  button('member'+i,p.nick||fns.dexName(p.dex),x,y,195,42,enabled);
  const condition=p.hp<=0?teamText('fainted'):
   i===state.active?teamText('active'):'';
  text('Lv. '+p.level+' · '+teamText('hp',{hp:p.hp,max:p.maxHp})+
   (condition?' · '+condition:''),x+97.5,y+37,9,'#5d5960',183);
 });
 if(state.needsSwitch){
  button('abort',m.mode==='league'?leagueText('giveUp'):m.mode==='zapdos'?activeStoryUI().text('abort'):teamText('flee'),50,350,366);
 }else{
  button('back',TPText.t('common.back'),50,350,366);
 }
}

const johtoThemes=['psychic','poison','rock','dark','dragon'];
function text(s,x,y,size=13,color='#292831',max=420,align='center'){ctx.fillStyle=color;ctx.textAlign=align;ctx.font=size+'px monospace';ctx.fillText(String(s),x,y,max);}
function panel(x,y,w,h,color='#fff'){ctx.fillStyle=color;roundRect(x,y,w,h,9);ctx.fill();ctx.strokeStyle='#292831';ctx.lineWidth=1.5;ctx.stroke();}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.fill();}
function background(theme){const palettes={psychic:['#c6b6d6','#81709b','#e1d7de'],poison:['#adbd9a','#6b7f61','#d5d9ba'],dark:['#7b758c','#3c374d','#aaa3b6'],ice:['#bfdce5','#729baa','#dcebef'],rock:['#b4a381','#756b56','#c9b891'],ghost:['#63556e','#352d46','#82738a'],dragon:['#a4b6a9','#526f65','#d2cbb0'],champ:['#dfcfaa','#ad9765','#eee2c7'],field:['#b7d3bf','#638d72','#d6dbc3']},p=palettes[theme]||palettes.field;ctx.fillStyle=p[0];ctx.fillRect(0,0,466,294);ctx.fillStyle=p[1];ctx.fillRect(0,28,466,164);ctx.fillStyle=p[2];ctx.fillRect(0,192,466,102);
 for(let y=194;y<294;y+=20){ctx.fillStyle=p[0];ctx.fillRect(0,y,466,1);for(let x=(y%40?24:0);x<466;x+=64)ctx.fillRect(x,y,1,20);}
 if(theme==='ice'){for(const x of [8,82,250,404]){poly([[x,192],[x+17,61],[x+36,96],[x+42,192]],'#ccebf1');poly([[x+17,61],[x+36,96],[x+22,192]],'#8cc3d3');}ctx.fillStyle='#effcff';for(let i=0;i<20;i++)ctx.fillRect((i*73)%466,34+(i*41)%150,2,2);}
 else if(theme==='psychic'){for(const x of [55,160,305,410]){ctx.strokeStyle='#e8def0';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,114,30,0,Math.PI*2);ctx.stroke();poly([[x,66],[x+16,114],[x,162],[x-16,114]],'#a18ab6');}}
 else if(theme==='poison'){for(const x of [8,98,278,378]){poly([[x,192],[x+18,64],[x+47,45],[x+70,192]],'#748965');ctx.fillStyle='#a7bd91';ctx.fillRect(x+20,89,18,103);}ctx.fillStyle='#7f6a91';for(let i=0;i<9;i++){ctx.beginPath();ctx.arc(20+i*51,171+(i%2)*9,8,0,Math.PI*2);ctx.fill();}}
 else if(theme==='dark'){for(const x of [18,181,344]){ctx.fillStyle='#282536';ctx.fillRect(x,42,103,150);ctx.strokeStyle='#aaa3b6';ctx.lineWidth=2;ctx.strokeRect(x+10,53,83,129);}poly([[190,192],[276,192],[317,294],[149,294]],'#514a63');}
 else if(theme==='rock'){for(const x of [-20,70,250,390]){poly([[x,192],[x+10,46],[x+47,30],[x+75,98],[x+92,192]],'#8d8167');poly([[x+10,46],[x+47,30],[x+42,192],[x,192]],'#b9a17b');}ctx.fillStyle='#645f50';ctx.fillRect(195,55,75,137);ctx.fillStyle='#bca882';ctx.fillRect(204,66,56,126);}
 else if(theme==='ghost'){for(const x of [18,181,344]){ctx.fillStyle='#29283d';ctx.fillRect(x,44,103,148);ctx.fillStyle='#8e789c';ctx.fillRect(x+9,53,85,130);ctx.fillStyle='#473b59';ctx.fillRect(x+18,62,67,121);}ctx.fillStyle='#b3a1ba';for(let i=0;i<6;i++)ctx.fillRect((i*91)%466,181+i*13,130,3);}
 else if(theme==='dragon'||theme==='champ'){for(const x of [14,98,334,418]){ctx.fillStyle='#a9905d';ctx.fillRect(x,38,28,154);ctx.fillStyle='#f0daa1';ctx.fillRect(x+5,44,7,142);ctx.fillRect(x-3,34,34,7);}ctx.fillStyle=theme==='champ'?'#8e424c':'#355e56';ctx.fillRect(194,35,78,157);poly([[194,192],[272,192],[317,294],[149,294]],theme==='champ'?'#a94d54':'#4b7a68');poly([[233,56],[252,80],[233,104],[214,80]],'#e8c96d');}
 else{poly([[0,170],[55,71],[130,174],[210,66],[295,169],[384,70],[466,164],[466,193],[0,193]],'#65927b');ctx.fillStyle='#aac89c';ctx.fillRect(0,183,466,15);}
 // Distinct opponent/player footing, like the supplied two-sided battle scene.
 ctx.fillStyle=theme==='ghost'?'#a493ab':'#eff0da';ctx.beginPath();ctx.ellipse(353,185,83,15,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=theme==='ghost'?'#6e5a7c':'#b3b9a0';ctx.beginPath();ctx.ellipse(112,284,91,16,0,0,Math.PI*2);ctx.fill();}
function name(p){if(p.form===2)return 'Megametagross';if(p.form){const f=window.TPStoreTools?.megaFormInfo?.(p.form);if(f&&f.dex===p.dex)return f.name;}return fns.dexName(p.dex);}
function hp(p,x,y,w){ctx.fillStyle='#647568';roundRect(x,y,w,9,3);ctx.fill();const z=Math.max(0,Math.min(1,p.hp/Math.max(1,p.maxHp)));if(z>0){ctx.fillStyle=z>.5?'#6ab97a':z>.2?'#dfbc55':'#d86a61';roundRect(x,y,w*z,9,3);ctx.fill();}}

// Visual capture state never rolls a result or writes a save itself.
function ball(x,y,r=10,angle=0,opened=false){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.lineWidth=1.5;ctx.strokeStyle='#292831';
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,opened?4:0,r,0,Math.PI);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#c65350';ctx.beginPath();ctx.arc(0,opened?-4:0,r,Math.PI,Math.PI*2);ctx.closePath();ctx.fill();ctx.stroke();
 if(!opened){ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r,0);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,r*.28,0,Math.PI*2);ctx.fill();ctx.stroke();}ctx.restore();}
function ownsCapture(m){return !!captureFx&&m.mode==='wild'&&captureFx.id===m.id&&captureFx.mod===Module;}
function commitCapture(fx){
 if(fx.started||captureFx!==fx||fx.mod!==Module)return;
 fx.started=true;
 Promise.resolve().then(()=>{
  if(captureFx!==fx||fx.mod!==Module)return false;
  if(!window.TPCapture)throw Error('Fangverwaltung nicht bereit.');
  return window.TPCapture.tryCatch(window.TPBoxes?.state.box||0);
 }).then(ok=>{
  if(captureFx!==fx||fx.mod!==Module)return;
  fx.settled=true;fx.committed=ok===true;
  fx.success=fx.committed&&!!call('tp_battle_catch_success');
  fx.detail=window.TPCapture?.message||'';
  if(!fx.committed)fx.error=window.TPCapture?.error||'Nicht gespeichert – Fang erneut versuchen.';
 }).catch(error=>{if(captureFx===fx&&fx.mod===Module){fx.settled=true;fx.committed=false;fx.error=error.message||String(error);}});
}
function startCapture(m){
 if(m.mode!=='wild'||!m.resolved||!m.catchOffered||m.catchDone||m.catchAllowed===false)return;
 if(ownsCapture(m)&&!captureFx.settled)return;
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 captureFx={id:m.id,mod:Module,at:null,phases:[],duration:reduced?0:1800,started:false,settled:false,committed:false,success:false,previouslyCaught:!!m.enemy.caught,detail:'',error:''};targets={};
}
function captureState(m){
 const fx=ownsCapture(m)?captureFx:null;
 if(fx){if(fx.at===null)fx.at=performance.now();const elapsed=Math.max(0,performance.now()-fx.at);
  if(elapsed>=fx.duration&&!fx.started)commitCapture(fx);
  if(!fx.settled){
   let phase='saving',x=353,y=174,angle=0,hide=true;
   if(elapsed<550&&fx.duration){const t=elapsed/550;phase='throw';x=112+241*t;y=240-102*t-110*Math.sin(Math.PI*t);angle=t*Math.PI*3;hide=false;}
   else if(elapsed<800&&fx.duration){phase='absorb';y=138+36*(elapsed-550)/250;}
   else if(elapsed<fx.duration){phase='shake';angle=Math.sin((elapsed-800)/1000*Math.PI*6)*.22;}
   return {phase,busy:true,hide,ball:{x,y,angle,opened:false},committed:false,success:false,headline:phase==='saving'?'Fang wird gespeichert …':'Fangversuch …',detail:name(m.enemy)+' · Lv. '+m.enemy.level};
  }
  if(!fx.committed)return {phase:'error',busy:false,hide:false,committed:false,success:false,headline:'Nicht gespeichert – erneut versuchen.',detail:fx.error};
  return {phase:fx.success?'caught':'escaped',busy:false,hide:fx.success,ball:{x:353,y:174,angle:0,opened:!fx.success},committed:true,success:fx.success,headline:fx.success?'Gefangen!':'Entkommen!',detail:name(m.enemy)+' · Lv. '+m.enemy.level+(fx.success&&fx.detail?' · '+fx.detail:'')};
 }
 if(m.mode==='wild'&&m.catchDone){const tried=m.catchTried,success=tried&&m.catchSuccess;return {phase:tried?(success?'caught':'escaped'):'left',busy:false,hide:false,committed:true,success,headline:tried?(success?'Gefangen!':'Entkommen!'):'Ohne Fang weiter.',detail:name(m.enemy)+' · Lv. '+m.enemy.level+(success&&window.TPCapture?.message?' · '+window.TPCapture.message:'')};}
 return null;
}
if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{
 // Before a transaction starts, backgrounding cancels only the visual attempt.
 if(document.visibilityState!=='visible'&&captureFx&&!captureFx.started){captureFx=null;captureView=null;targets={};}
});

function status(p,x,y,w){panel(x,y,w,70);if(p.caught)ball(x+15,y+13,6);text(name(p)+' · Lv. '+p.level,x+w/2+(p.caught?9:0),y+17,12,'#292831',w-(p.caught?38:14));if(p.nick)text(p.nick,x+w/2,y+30,10,'#5d5960',w-16);hp(p,x+14,y+39,w-28);text(p.hp+' / '+p.maxHp+' KP',x+w-14,y+62,11,'#292831',w-20,'right');if(p.shiny)text('★',x+15,y+61,11,'#a38326',14);}
function sprite(p,x,bottom,limit){const s=p.form?megaSpriteFor(!!p.shiny,p.form):spriteFor(p.dex,!!p.shiny);if(!s){text('?',x,bottom-25,40,'#fff9db');return;}const a=s.actions[TPAct.idle];if(!a)return;const image=frameImageData(s,TPAct.idle,frameIndexAt(a,performance.now(),true));if(!image)return;frameCanvas.width=a.w;frameCanvas.height=a.h;frameCtx.putImageData(image,0,0);let z=Math.min(3,limit/a.w,limit/a.h);if(p.form===2)z*=.75;ctx.imageSmoothingEnabled=false;ctx.drawImage(frameCanvas,x-a.w*z/2,bottom-(a.base>0?a.base:a.h)*z,a.w*z,a.h*z);}
let battleDeviceButtons=[],battleDeviceSummary='';
function button(action,label,x,y,w,h=42,enabled=true){
 battleDeviceButtons.push({action,label,x,y,w,h,enabled});panel(x,y,w,h,enabled?'#fff':'#d7d6cb');if(action==='back'&&window.TPNavBack)
 window.TPNavBack.draw(ctx,x+w/2-12,y+h/2-12,24,enabled?'#315b83':'#81877e');
 else text(label,x+w/2,y+h/2+5,14,enabled?'#292831':'#81877e',w-14);if(enabled)targets[action]={x,y,w,h};}
function prepare(m){const k=m.mode+':'+m.id;if(k!==key){key=k;menu='main';captureFx=null;captureView=null;}last=m;targets={};const fk=k+':'+m.round;if(fk!==feedbackKey){feedbackKey=fk;feedbackAt=performance.now();}}
function drawOriginal(m){prepare(m);const capture=captureState(m);if(capture&&ownsCapture(m)&&!captureFx.phases.includes(capture.phase))captureFx.phases.push(capture.phase);captureView=capture?Object.freeze({...capture,battleId:m.id,phases:Object.freeze(ownsCapture(m)?captureFx.phases.slice():[capture.phase])}):null;background(m.theme);window.TPBattlePokedex?.captureBackground();text(m.title,233,21,14,(m.theme==='ghost'||m.theme==='dark')?'#fff8e6':'#292831');if(!capture?.hide)sprite(m.enemy,353,180,108);sprite(m.player,112,280,132);status(m.enemy,18,44,220);status(m.player,222,213,226);drawTeamIndicators(m);if(capture?.ball){const b=capture.ball;ball(b.x,b.y,10,b.angle,b.opened);}
 if(m.round&&performance.now()-feedbackAt<1800){if(m.dealt)text('−'+m.dealt+' KP',353,73,17,'#b84544',150);if(m.taken)text('−'+m.taken+' KP',112,224,17,'#b84544',150);if(m.heal)text('+'+m.heal+' KP',112,199,16,'#2b8260',150);}
 window.TPBattlePokedex?.capture(m);ctx.fillStyle='#f7efe6';ctx.fillRect(0,299,466,167);ctx.fillStyle='#292831';ctx.fillRect(0,296,466,3);
 const summary=capture?.headline||m.error||m.headline||(m.resultPending?teamText('saving'):m.wildTeam?.needsSwitch?teamText('forced'):'')||(!m.resolved?(m.round?'Gegner −'+m.dealt+' KP · Du −'+m.taken+' KP'+(m.heal?' · Heilung +'+m.heal:''):''):m.next?'Gegner besiegt. Rest-KP bleiben erhalten.':m.mode==='league'&&m.won?'Sieg wird dauerhaft gespeichert.':m.won?'Sieg!':'Niederlage.');battleDeviceSummary=summary;text(summary,233,318,12,m.error?'#a14646':'#292831',438);
 text(capture?.detail||m.reward||('Runde '+(m.round||0)+' · Heilungen '+m.rests+(m.note?' · '+m.note:'')),233,335,10,'#5d5960',438);
 if(m.resultPending){
  if(!m.resultSaving&&m.error){
   button('resultRetry',m.mode==='zapdos'?activeStoryUI().text('retry'):teamText('retry'),50,350,366);
  }else{
   text(teamText('saving'),233,378,14);
  }
 }
 else if(m.wildTeam&&!m.resolved&&
   (m.wildTeam.needsSwitch||menu==='team')){
  drawTeamMenu(m);
 }
 else if(capture?.busy){/* No actionable targets during flight, shaking or save. */}
 else if(menu==='info'&&!m.resolved){panel(26,126,414,159);text(name(m.player)+' · Lv. '+m.player.level,233,151,18);text(m.player.nick||'Kampfwerte beim Start erfasst',233,176,12);text('KP '+m.player.hp+' / '+m.player.maxHp,233,201,15);text('ANG '+m.player.atk+' · VER '+m.player.def+' · INI '+m.player.spe,233,227,12);text('Kein Teamwechsel in diesem Kampfsystem.',233,254,11);button('back','Zurück',50,350,366);}
 else if(m.resolved){if(m.next)button('next','Nächster Gegner',50,350,366);else if(m.mode==='league'&&m.won){if(m.retry)button('retry','Speichern erneut versuchen',50,350,366);button('abort','Lauf verlassen',50,408,366,36);}else if(m.catchOffered&&!m.catchDone){button('catch',m.catchAllowed===false?'Fangen gesperrt':'Fangen',50,350,174,42,m.catchAllowed!==false);button('leave','Weiter ohne Fang',242,350,174);}else button(m.mode==='league'?'abort':'ok',m.mode==='league'?'Zur Ligaübersicht':'Weiter',50,350,366);}
 else if(menu==='moves'){
  button('heavy',controlText('heavy'),50,350,174);
  button('dodge',controlText('dodge'),242,350,174);
  button('quick',controlText('quick'),50,404,174);
  button('rest',controlText('healAction')+' ('+m.rests+')',242,404,174,42,m.rests>0);
  button('back',controlText('back'),8,8,44,36);
 }
 else{
  button('fight',controlText('fight'),50,350,174);
  button('rest',controlText('heal')+' ('+m.rests+')',242,350,174,42,m.rests>0);
  button('info',controlText('pokemon'),50,404,174);
  button('abort',controlText('giveUp'),242,404,174);
 }
 statusEl.textContent=capture?capture.headline+' '+capture.detail:m.title+' · '+m.player.hp+'/'+m.player.maxHp+' KP';}
function draw(m){
 battleDeviceButtons=[];battleDeviceSummary='';
 drawOriginal(m);
 window.TPBattlePokedex?.render(m,battleDeviceButtons,battleDeviceSummary);
}
function actionAt(x,y){for(const [a,r]of Object.entries(targets))if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)return a;return null;}
function handle(x,y,m){if(window.TPGiveUp?.pending)return null;const k=m.mode+':'+m.id;if(k!==key){key=k;menu='main';targets={};return null;}const a=actionAt(x,y);if(a==='fight'){menu='moves';return null;}if(a==='info'){menu=m.wildTeam?'team':'info';return null;}if(a==='back'){menu='main';return null;}if(m.resolved&&!['next','catch','leave','ok','retry','abort','resultRetry'].includes(a))return null;if(a==='rest'||a&&/^member[0-5]$/.test(a))menu='main';return a;}
function leagueTeam(v){
 if(!v.teamMode||!Array.isArray(v.members)||!v.members.length)return null;
 return {
  live:v.live,count:v.members.length,active:v.active,
  needsSwitch:!!v.needsSwitch,members:v.members
 };
}
function leagueEnemies(v){
 if(!v.teamMode)return null;
 const region=v.region??0;
 const data=window.TPRegions?.catalog(region)?.league||
  (region===1?window.TPJohtoLeagueData:window.TPKantoLeagueData);
 const trainer=Math.min(4,Math.floor(v.index/5));
 const slot=trainer===4?v.index-20:v.index%5;
 const roster=trainer<4?data?.elite?.[trainer]:
  data?.champions?.[v.variant]||data?.champion;
 return roster?.map((_,i)=>({
  ready:i>slot||(i===slot&&v.enemyHp>0),active:i===slot
 }))||null;
}
function leagueModel(v,error='',retry=false){const trainer=Math.min(4,Math.floor(v.index/5)),region=v.region??window.TPLeague?.region??0,names=region===1?(window.TPJohtoLeagueData?.names||['Willi','Koga','Bruno','Melanie','Siegfried']):['Lorelei','Bruno','Agathe','Siegfried','Blau'];return {region,...(v.teamMode?{wildTeam:leagueTeam(v),enemyTeam:leagueEnemies(v)}:{}),mode:'league',id:v.battleId,theme:(region===1?johtoThemes:themes)[trainer],title:(trainer<4?'Top Vier · '+names[trainer]:'Champ · '+names[4])+' · '+(trainer===4?v.index-19:v.index%5+1)+'/'+(trainer===4?6:5),round:v.round,rests:v.rests,note:v.note||'',resolved:!!v.resolved,won:!!v.won,dealt:v.dealt||0,taken:v.taken||0,heal:v.heal||0,error,retry,player:{dex:v.playerDex,level:v.playerLevel,form:v.form,shiny:v.shiny,nick:v.nick,hp:v.hp,maxHp:v.maxHp,atk:v.atk,def:v.def,spe:v.spe},enemy:{dex:v.dex,level:v.level,hp:v.enemyHp,maxHp:v.enemyMaxHp}};}

function standard(){
 const b=k=>call('tp_bv_get',k),trainer=!!window.TPTrainer.active();
 const story=!!activeStoryUI()?.owns();
 const arena=b(10),form=b(5);
 const arenaRegion=trainer&&arena>=0&&
  typeof Module._tp_region_arena_session_region==='function'?
  call('tp_region_arena_session_region'):0;
 const arenaCatalog=arenaRegion===1?window.TPJohtoArena:window.TPKantoArena;
 const capture=trainer||story?null:window.TPCapture?.status();
 const arenaTeam=trainer&&arena>=0?window.TPArena?.teamView:null;
 const team=trainer?arenaTeam:window.TPWildTeam?.view;
 const teamActive=!!team?.live&&team.count>0;
 const enemyIndex=trainer?window.TPTrainer.get(2):0;
 const enemyTeam=arenaTeam?arenaCatalog?.leaders?.[arena]?.team.map((_,i)=>({
  ready:i>enemyIndex||(i===enemyIndex&&fns.battleEnemyHp()>0),
  active:i===enemyIndex
 })):null;
 return {
  wildTeam:teamActive?team:null,enemyTeam,
  resultPending:story?activeStoryUI().resultPending:
   teamActive&&(arenaTeam?team.seriesDone&&!team.resultDone:team.resultPending),
  resultSaving:story?activeStoryUI().saving:
   teamActive&&(arenaTeam?!!window.TPArena?.busy:!!window.TPWildTeam?.saving),
  reward:story?activeStoryUI().reward:
   teamActive&&!arenaTeam?window.TPWildTeam?.reward||'':'',
  headline:story?activeStoryUI().headline:'',
  region:arena>=0?arenaRegion:0,
  mode:story?'zapdos':trainer?(arena>=0?'arena':'trainer'):'wild',
  id:b(0),
  theme:story&&fns.battleWildDex()===150?'psychic':story&&fns.battleWildDex()===146?'rock':arena>=0?(arenaRegion===1?
   ['field','field','field','ghost','rock','rock','ice','dragon']:
   ['rock','ice','field','field','ghost','ghost','champ','rock'])[arena]:'field',
  title:story?activeStoryUI().text('battleTitle'):
   trainer?(arena>=0?arenaCatalog?.leaders?.[arena]?.name||'Arena':'Trainerkampf')+
   ' · '+(enemyIndex+1)+'/'+window.TPTrainer.get(1):'Wilder Kampf',
  round:fns.battleRound(),note:fns.battleMessage(),
  rests:call('tp_battle_rest_uses_left'),
  resolved:!!fns.battleResolved(),won:!!fns.battlePlayerWon(),
  next:trainer&&!!window.TPTrainer.get(3),
  catchOffered:!story&&!!fns.battleCatchOffered(),
  catchDone:!story&&!!fns.battleCatchDone(),
  catchTried:!trainer&&!story&&!!call('tp_battle_catch_tried'),
  catchSuccess:!trainer&&!story&&!!call('tp_battle_catch_success'),
  catchAllowed:!story&&(capture?capture.allowed:true),
  error:story?activeStoryUI().error:
   (arenaTeam?window.TPArena?.snapshot?.error:
    teamActive?window.TPWildTeam?.error:'')||capture?.message||'',
  dealt:b(7),taken:b(8),heal:b(9),
  player:{
   dex:teamActive?call('tp_wt_player_dex'):fns.speciesId(),
   level:b(1),form,shiny:b(6),
   nick:Module.ccall('tp_bv_nick','string',[],[]),
   hp:fns.battlePlayerHp(),maxHp:fns.battlePlayerMaxHp(),
   atk:b(2),def:b(3),spe:b(4)
  },
  enemy:{
   caught:story?activeStoryUI().caught:
    !trainer&&(captureFx&&captureFx.id===b(0)&&captureFx.mod===Module?
     (captureFx.previouslyCaught||(captureFx.committed&&captureFx.success)):
     !!call('tp_battle_wild_already_caught')),
   dex:fns.battleWildDex(),level:call('tp_battle_wild_level'),
   hp:fns.battleEnemyHp(),maxHp:fns.battleEnemyMaxHp()
  }
 };
}
function supported(){try{return !!Module&&typeof Module._tp_bv_get==='function';}catch(_){return false;}}
function drawStandard(){if(!supported())return false;if(!call('tp_battle_is_open')){captureFx=null;captureView=null;targets={};screen=battleReturn;return true;}if(window.TPTrainer.active()&&(!call('tp_f2_can_actor')||document.visibilityState!=='visible')){window.TPTrainer.abort();return true;}window.TPZapdosUI?.poll();window.TPArktosUI?.poll();window.TPLavadosUI?.poll();window.TPMewtuUI?.poll();window.TPMewUI?.poll();window.TPWildTeam?.poll();draw(standard());return true;}
function abort(m){
 const leave=()=>{
  if(m.mode==='trainer'||m.mode==='arena')window.TPTrainer.abort();
  else{
   Module._tp_battle_close();
   if(Module.ccall('tp_battle_is_open','number',[],[]))return false;
   screen=battleReturn;
  }
  return !Module.ccall('tp_battle_is_open','number',[],[]);
 };
 return m.resolved?leave():window.TPGiveUp.request(m,leave);
}
function tapStandard(x,y){
 if(!supported())return false;
 const m=standard();
 if(ownsCapture(m)&&!captureFx.settled)return true;
 const a=handle(x,y,m);if(!a)return true;
 if(m.mode==='zapdos'){
  if(a==='resultRetry'){activeStoryUI().retry();return true;}
  if(/^member[0-5]$/.test(a)){
   activeStoryUI().switchTo(Number(a.slice(6)));return true;
  }
  if(a==='ok'){activeStoryUI().finish();return true;}
  if(a==='abort'){
   const owner=activeStoryUI();
   if(m.resolved)owner.abort(true);
   else window.TPGiveUp.request(m,()=>owner.abort(true));
   return true;
  }
 }else{
  if(a==='resultRetry'){
   if(m.mode==='arena')window.TPArena?.complete();
   else window.TPWildTeam?.retry();
   return true;
  }
  if(/^member[0-5]$/.test(a)){
   if(m.mode==='arena')window.TPArena?.switchTo(Number(a.slice(6)));
   else window.TPWildTeam?.switchTo(Number(a.slice(6)));
   return true;
  }
 }
 if(a==='quick')Module._tp_battle_quick_attack();
 else if(a==='heavy')Module._tp_battle_heavy_attack();
 else if(a==='dodge')Module._tp_battle_dodge();
 else if(a==='rest')Module._tp_battle_rest();
 else if(a==='next')call('tp_f2_next');
 else if(a==='catch')startCapture(m);
 else if(a==='leave'){
  captureFx=null;captureView=null;Module._tp_battle_leave_wild();
 }else if(a==='ok'){
  Module._tp_battle_close();screen=battleReturn;
 }else if(a==='abort')abort(m);
 return true;
}
function tapLeague(x,y,v,error='',retry=false){return handle(x,y,leagueModel(v,error,retry));}
window.TPBattleView=Object.freeze({draw,drawStandard,tapStandard,drawLeague:(v,e,r)=>draw(leagueModel(v,e,r)),tapLeague,get current(){return last;},get capture(){return captureView;},get teamIndicators(){return teamIndicators;},label:name,drawMember:(p,x,bottom,limit)=>sprite(p,x,bottom,limit),target:a=>{const r=targets[a];return r?{x:r.x+r.w/2,y:r.y+r.h/2}:null;},get menu(){return menu;},background});
})();


/* UI01 in-game give-up confirmation: owns no combat mutation. */
(function(root){
 'use strict';
 let pending=null,layer=null,previousFocus=null;
 const words={
  de:{question:'Wirklich aufgeben?',yes:'Ja',no:'Nein'},
  en:{question:'Really give up?',yes:'Yes',no:'No'},
  es:{question:'¿Seguro que quieres rendirte?',yes:'Sí',no:'No'},
  fr:{question:'Vraiment abandonner ?',yes:'Oui',no:'Non'}
 };
 if(root.TPText?.registerLocale)
  for(const code of ['en','de','es','fr'])
   root.TPText.registerLocale(code,Object.fromEntries(
    Object.entries(words[code]).map(([key,value])=>['battleGiveUp.'+key,value])
   ));
 const text=key=>root.TPText?.t?
  root.TPText.t('battleGiveUp.'+key):words.de[key];

 function blocked(){
  return !!(typeof tpSaveReplacing!=='undefined'&&tpSaveReplacing)||
   !!root.TPCollection?.busy||!!root.TPCollection?.blocked||
   !!root.TPLeague?.busy||!!root.TPArena?.busy;
 }
 function identity(m){
  return [m.mode,m.id,m.region??0,m.round,m.wildTeam?.active??null,
   m.player.hp,m.enemy.hp].join('/');
 }
 function valid(request){
  if(!request||request.mod!==Module||blocked()||
     document.visibilityState!=='visible')return false;
  const m=root.TPBattleView?.current;
  if(!m||m.resolved||identity(m)!==request.key)return false;
  if(m.mode==='league'){
   const v=root.TPLeague?.state;
   return !!v?.live&&!v.resolved&&!v.pending&&
    v.region===(m.region??0)&&v.battleId===m.id&&v.round===m.round;
  }
  return !!Module.ccall('tp_battle_is_open','number',[],[])&&
   Module.ccall('tp_bv_get','number',['number'],[0])===m.id;
 }
 function cancel(){
  pending=null;
  if(layer)layer.hidden=true;
  if(previousFocus?.isConnected)previousFocus.focus?.();
 }
 function request(m,execute){
  if(pending||!m||m.resolved||blocked()||typeof execute!=='function')return false;
  const candidate={mod:Module,key:identity(m),execute};
  if(!valid(candidate))return false;
  const host=document.getElementById('tp-game-shell');
  if(!host)return false;

  if(!layer){
   layer=document.createElement('section');
   layer.id='tp-give-up-confirm';
   layer.setAttribute('role','dialog');
   layer.setAttribute('aria-modal','true');
   layer.setAttribute('aria-labelledby','tp-give-up-title');
   host.append(layer);
  }
  previousFocus=document.activeElement;
  pending=candidate;
  layer.replaceChildren();layer.hidden=false;

  const panel=document.createElement('div');
  panel.className='tp-give-up-panel';
  const title=document.createElement('h2');
  title.id='tp-give-up-title';title.textContent=text('question');
  const choices=document.createElement('div');
  choices.className='tp-give-up-choices';

  const yes=document.createElement('button');
  yes.type='button';yes.textContent=text('yes');
  yes.setAttribute('data-give-up','yes');
  const no=document.createElement('button');
  no.type='button';no.textContent=text('no');
  no.setAttribute('data-give-up','no');

  yes.addEventListener('click',()=>{
   const action=pending;
   if(!valid(action)){cancel();return;}
   pending=null;layer.hidden=true;
   action.execute();
  });
  no.addEventListener('click',cancel);
  choices.append(yes,no);panel.append(title,choices);layer.append(panel);
  no.focus?.();

  function watch(){
   if(!pending)return;
   if(!valid(pending)){cancel();return;}
   root.requestAnimationFrame(watch);
  }
  root.requestAnimationFrame(watch);
  return false;
 }
 root.TPGiveUp=Object.freeze({
  request,cancel,get pending(){return !!pending;}
 });
 if(root.document?.addEventListener){
  document.addEventListener('keydown',event=>{
   if(!pending)return;
   if(event.key==='Escape'){
    event.preventDefault();event.stopImmediatePropagation();cancel();return;
   }
   if(event.key==='Tab'&&layer){
    const buttons=Array.from(layer.querySelectorAll('button'));
    const first=buttons[0],last=buttons[buttons.length-1];
    if(event.shiftKey&&document.activeElement===first){
     event.preventDefault();last.focus();
    }else if(!event.shiftKey&&document.activeElement===last){
     event.preventDefault();first.focus();
    }
   }
  },true);
  document.addEventListener('visibilitychange',()=>{
   if(document.visibilityState!=='visible')cancel();
  });
 }
})(typeof globalThis!=='undefined'?globalThis:this);


/* UI01 rotated battle device: view adapter, existing input and capture transactions. */
(function(root){
 'use strict';
 let page=null,host=null,upper=null,lower=null,scene=null,content=null;
 let summary=null,detail=null,focusBuffer=null,buffer=null;
 let model=null,owner=null,key='',sizeKey='',preview=null,previewKey='';
 let admissionPage=null,incoming=null,savedCard=null,savedOwner=null,savedIndex=-1;


 const deviceWords={
  en:{actions:'Actions',moves:'Moves',team:'Your team',info:'Info',saved:'Victory saved',round:'Round',capture:'Catch result',box:'Send to box',noCatch:'Do not catch',noCatchQuestion:'Continue without catching?',continue:'Continue'},
  de:{actions:'Aktionen',moves:'Attacken',team:'Dein Team',info:'Info',saved:'Sieg gespeichert',round:'Runde',capture:'Fang-Ergebnis',box:'In Box ablegen',noCatch:'nicht fangen',noCatchQuestion:'Ohne Fang weiter?',continue:'Weiter'},
  es:{actions:'Acciones',moves:'Movimientos',team:'Tu equipo',info:'Info',saved:'Victoria guardada',round:'Turno',capture:'Resultado',box:'Enviar a caja',noCatch:'No capturar',noCatchQuestion:'¿Continuar sin capturar?',continue:'Continuar'},
  fr:{actions:'Actions',moves:'Attaques',team:'Ton équipe',info:'Info',saved:'Victoire enregistrée',round:'Tour',capture:'Résultat',box:'Placer en boîte',noCatch:'Ne pas capturer',noCatchQuestion:'Continuer sans capturer ?',continue:'Continuer'}
 };
 if(root.TPText?.registerLocale)for(const code of ['en','de','es','fr'])
  root.TPText.registerLocale(code,Object.fromEntries(
   Object.entries(deviceWords[code]).map(([key,value])=>['battleDevice.'+key,value])
  ));
 const deviceText=key=>root.TPText?.t?root.TPText.t('battleDevice.'+key):deviceWords.de[key];
 function frameText(m,isSaved=false){
  const heading=page.querySelector('.tp-battle-frame-title');
  const title=m.title.replace(/\s*·\s*\d+\/\d+\s*$/,'');
  if(heading.textContent!==title)heading.textContent=title;
  const caption=page.querySelector('.tp-battle-frame-menu');
  const cap=root.TPBattleView.capture;
  const menu=root.TPBattleView.menu;
  const text=isSaved?deviceText('saved'):
   cap?.committed?deviceText('capture'):
   deviceText(menu==='moves'?'moves':menu==='team'?'team':menu==='info'?'info':'actions')+
   ' · '+deviceText('round')+' '+m.round;
  if(caption.textContent!==text)caption.textContent=text;
 }

 const node=(tag,cls,text)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;
  return el;
 };
 const game=()=>typeof screen==='string'?screen:'';
 function blocked(){
  return !!(typeof tpSaveReplacing!=='undefined'&&tpSaveReplacing)||
   !!root.TPCollection?.busy||!!root.TPCollection?.blocked||
   !!root.TPLeague?.busy||!!root.TPArena?.busy||!!root.TPGiveUp?.pending;
 }
 function live(m){
  if(!m||owner!==Module)return false;
  if(m.mode==='league'){
   const v=root.TPLeague?.state;
   return game()==='league'&&!!v?.live&&v.battleId===m.id;
  }
  if(game()!=='battle')return false;
  if(m.mode==='arena'&&root.TPArena?.snapshot?.phase&&
     root.TPArena.snapshot.phase!=='fighting')return false;
  return !!Module.ccall('tp_battle_is_open','number',[],[]);
 }
 function savedAlive(){
  return !!savedCard&&savedCard.isConnected&&owner===Module&&game()==='league'&&
   root.TPLeague?.diagnostics?.phase==='checkpoint'&&
   root.TPLeague.state.index===savedIndex&&!root.TPLeague.state.live&&
   savedOwner?.getAttribute('data-league-view')==='victory';
 }

 // UI01 admission recovery device
 let admissionRecovery=false,recoveryTicket=null;
 function recoveryAlive(){
  if(!admissionRecovery||owner!==Module||!root.TPAdmissionUI?.active||
     !['idle','card','settings'].includes(game()))return false;
  try{
   return root.TPAdmission?.read()?.pending?.ticket===recoveryTicket;
  }catch(_){return false;}
 }

 function restoreAdmission(){
   admissionRecovery=false;recoveryTicket=null;
  if(admissionPage){
    key=''; // Rebuild controls after admission.
   admissionPage.inert=false;
   if(admissionPage.parentNode===content)host.append(admissionPage);
  }
  if(admissionBack)admissionBack.remove();
  if(admissionBox)admissionBox.remove();
  admissionBack=null;admissionBox=null;
  admissionPage=null;incoming=null;if(page)page.removeAttribute('data-battle-admission');
 }
 function hide(){
  restoreAdmission();
  if(page)page.hidden=true;
  host?.removeAttribute('data-battle-device');
  if(savedOwner)savedOwner.removeAttribute('aria-hidden');
  savedCard=null;savedOwner=null;savedIndex=-1;key='';noCatch=null;
 }
 function ensure(){
  if(page)return true;
  host=document.getElementById('tp-game-shell');
  if(!host)return false;
  if(typeof hubDexDesignTokens==='function')
   for(const [name,value]of Object.entries(hubDexDesignTokens()))
    host.style.setProperty(name,value);

  page=node('section');page.id='tp-battle-page';page.hidden=true;
  page.setAttribute('role','region');page.setAttribute('aria-label','Kampf');
  const heading=node('h2','tp-battle-frame-title',
   root.TPBattleControlsText?.t('fight')||'Kampf');
  const frame=node('div','tp-battle-frame');
  upper=node('div','tp-pokedex-display tp-pokedex-display-left tp-battle-upper');
  lower=node('div','tp-pokedex-display tp-pokedex-display-right tp-battle-lower');
  const spine=node('span','tp-pokedex-spine');
  spine.setAttribute('aria-hidden','true');

  scene=node('canvas','tp-battle-scene');scene.width=466;scene.height=296;
  scene.setAttribute('role','img');scene.setAttribute('aria-label','Kampfansicht');
  const panel=node('div','tp-battle-panel');
  summary=node('p','tp-battle-summary');
  detail=node('p','tp-battle-detail');
  content=node('div','tp-battle-content');
  panel.append(summary,detail,content);
  upper.append(scene);lower.append(panel);
  frame.append(upper,lower,spine);
  const caption=node('p','tp-battle-frame-menu','');
  const backSlot=node('div','tp-battle-frame-back-slot');
  const boxSlot=node('div','tp-battle-frame-box-slot');
  page.append(heading,frame,caption,backSlot,boxSlot);host.append(page);

  function watch(){
   if(!page.hidden){
    if(!live(model)&&!savedAlive()&&!recoveryAlive())hide();
    else{
     measure();
     if(root.TPAdmissionUI?.active&&(game()==='battle'||recoveryAlive())){
      const p=document.getElementById('tp-admission-page');
      if(p){
       let mon=null;
       try{mon=root.TPAdmission?.read()?.pending?.pokemon;}catch(_){}
       admission(p,mon);
      }
     }else if(admissionPage){
      restoreAdmission();key='';
     }
    }
   }
   root.requestAnimationFrame(watch);
  }
  root.requestAnimationFrame(watch);
  return true;
 }
 function measure(){
  const w=lower.clientWidth,h=lower.clientHeight;
  if(!w||!h)return;
  const dimensions=w+'/'+h;
  if(dimensions!==sizeKey){
   sizeKey=dimensions;
   page.style.setProperty('--tp-battle-w',w+'px');
   page.style.setProperty('--tp-battle-h',h+'px');
   scene.width=Math.max(1,Math.round(h*2));
   scene.height=Math.max(1,Math.round(w*2));
  }
  const pane=lower.querySelector('.tp-battle-panel').getBoundingClientRect();
  const box=host.getBoundingClientRect();
  const values={
   '--tp-battle-lower-x':pane.x-box.x,
   '--tp-battle-lower-y':pane.y-box.y,
   '--tp-battle-lower-w':pane.width,
   '--tp-battle-lower-h':pane.height
  };
  for(const [name,value]of Object.entries(values))
   if(host.style.getPropertyValue(name)!==value+'px')
    host.style.setProperty(name,value+'px');
 }
 function capture(m){
  if(typeof document==='undefined'||
     typeof document.getElementById!=='function'||
     typeof root.requestAnimationFrame!=='function')return;
  const canvas=document.getElementById('tp');if(!canvas)return;
  if(!buffer){
   buffer=document.createElement('canvas');
   buffer.width=466;buffer.height=296;
  }
  buffer.getContext('2d').drawImage(canvas,0,0,466,296,0,0,466,296);
  const id=m.mode+'/'+m.id;
  if(m.mode==='wild'&&(previewKey!==id||owner!==Module||
     !preview&&m.catchOffered&&!m.catchDone)){
   previewKey=id;preview=null;
   try{
    const p=JSON.parse(Module.ccall('tp_f4_capture_snapshot','string',[],[]));
    const mon=p?.pokemon||p;
    if(mon?.dex===m.enemy.dex)preview=mon;
   }catch(_){}
  }
 }

 let backgroundBuffer=null,pokemonBuffer=null;
 const spriteCuts=new WeakMap();
 function captureBackground(){
  if(typeof document==='undefined'||typeof root.requestAnimationFrame!=='function')return;
  const canvas=document.getElementById('tp');if(!canvas)return;
  if(!backgroundBuffer){
   backgroundBuffer=document.createElement('canvas');
   backgroundBuffer.width=466;backgroundBuffer.height=296;
  }
  backgroundBuffer.getContext('2d').drawImage(canvas,0,0,466,296,0,0,466,296);
 }
 function drawPokemon(p,mon,cx,bottom,maxWidth,maxHeight,measureOnly=false){
  const sprite=mon.form?megaSpriteFor(!!mon.shiny,mon.form):spriteFor(mon.dex,!!mon.shiny);
  if(!sprite){ensureSprite(mon.dex);return;}
  const action=sprite.actions[TPAct.idle];if(!action)return;
  const reduced=!!root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const frame=frameImageData(sprite,TPAct.idle,
   reduced?0:frameIndexAt(action,performance.now(),true));
  if(!frame)return;
  let cut=spriteCuts.get(frame);
  if(cut===undefined){
   let l=frame.width,t=frame.height,r=-1,b=-1;
   for(let y=0;y<frame.height;y++)for(let x=0;x<frame.width;x++)
    if(frame.data[(y*frame.width+x)*4+3]){
     l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);
    }
   cut=r>=l?{x:l,y:t,w:r-l+1,h:b-t+1}:null;
   spriteCuts.set(frame,cut);
  }
  if(!cut)return;
  if(!pokemonBuffer)pokemonBuffer=document.createElement('canvas');
  pokemonBuffer.width=frame.width;pokemonBuffer.height=frame.height;
  pokemonBuffer.getContext('2d').putImageData(frame,0,0);
  const z=Math.min(6,maxWidth/cut.w,maxHeight/cut.h);
  if(measureOnly)return {width:cut.w*z,height:cut.h*z};
  p.save();if(mon.hp===0)p.globalAlpha=.45;
  p.drawImage(pokemonBuffer,cut.x,cut.y,cut.w,cut.h,
   cx-cut.w*z/2,bottom-cut.h*z,cut.w*z,cut.h*z);
  p.restore();
 }
 function hud(p,mon,x,y,width,balls){
  p.fillStyle='#fffaf0';p.fillRect(x,y,width,66);
  p.strokeStyle='#8196a1';p.lineWidth=2;p.strokeRect(x,y,width,66);
  p.fillStyle='#292831';p.textAlign='left';p.font='bold 19px monospace';
  p.fillText(root.TPBattleView.label(mon),x+6,y+21,width-12);
  p.font='16px monospace';
  p.fillText('Lv. '+mon.level+' · '+mon.hp+'/'+mon.maxHp+' KP',x+6,y+41,width-12);
  p.fillStyle='#d6e0e5';p.fillRect(x+6,y+47,width-12,6);
  p.fillStyle=mon.hp/mon.maxHp<.25?'#963c45':'#3e7455';
  p.fillRect(x+6,y+47,(width-12)*Math.max(0,mon.hp/mon.maxHp),6);
  (balls||[]).forEach((ball,i)=>{
   const bx=x+12+i*15,by=y+60;
   p.fillStyle=ball.ready?'#a83a43':'#a0a7aa';
   p.beginPath();p.arc(bx,by,5,0,Math.PI*2);p.fill();
   p.strokeStyle=ball.active?'#315b83':'#34423d';
   p.lineWidth=ball.active?3:1;p.stroke();
  });
 }

 let battleTeamThumbs=[];
 function paintTeam(){
  for(const {canvas,mon}of battleTeamThumbs){
   if(!canvas.isConnected)continue;
   const p=canvas.getContext('2d');
   p.clearRect(0,0,96,64);p.imageSmoothingEnabled=false;
   drawPokemon(p,mon,48,62,92,60);
  }
 }
 function drawCaptureBall(p,cap,w,h){
  if(!cap?.ball)return;
  let x=w*.75,y=h*.45;
  if(cap.phase==='throw'){
   const t=Math.max(0,Math.min(1,(cap.ball.x-112)/241));
   x=w*(.25+.50*t);
   y=h*(.78-.38*t-.32*Math.sin(Math.PI*t));
  }else if(cap.phase==='absorb'){
   const t=Math.max(0,Math.min(1,(cap.ball.y-138)/36));
   y=h*(.35+.10*t);
  }
  const r=16,opened=!!cap.ball.opened;
  p.save();p.translate(x,y);p.rotate(cap.ball.angle||0);
  p.lineWidth=3;p.strokeStyle='#292831';
  p.fillStyle='#fff';p.beginPath();
  p.arc(0,opened?6:0,r,0,Math.PI);p.closePath();p.fill();p.stroke();
  p.fillStyle='#c65350';p.beginPath();
  p.arc(0,opened?-6:0,r,Math.PI,Math.PI*2);
  p.closePath();p.fill();p.stroke();
  if(!opened){
   p.beginPath();p.moveTo(-r,0);p.lineTo(r,0);p.stroke();
   p.fillStyle='#fff';p.beginPath();p.arc(0,0,r*.28,0,Math.PI*2);
   p.fill();p.stroke();
  }
  p.restore();
 }

 function paint(){
  if(!scene||(!buffer&&!admissionRecovery))return;
  const p=scene.getContext('2d'),w=scene.width,h=scene.height;
  p.clearRect(0,0,w,h);p.imageSmoothingEnabled=false;
  const cap=root.TPBattleView?.capture;
  const mon=admissionRecovery?incoming:cap?.committed&&cap.success?(incoming||preview):null;
  if(mon){
   scene.setAttribute('data-caught-dex',String(mon.dex));
   scene.setAttribute('data-battle-paint','caught');
   scene.setAttribute('aria-label',fns.dexName(mon.dex)+' · Lv. '+mon.level+
    (mon.shiny?' · Schillernd':''));
   p.fillStyle=typeof hubDexDesignTokens==='function'?
    hubDexDesignTokens()['--tp-pokedex-display']:'#cbdce2';
   p.fillRect(0,0,w,h);p.fillStyle='#292831';p.textAlign='center';
   const measured=drawPokemon(p,mon,0,0,w*.84,h*.62,true);
   const imageHeight=measured?.height||h*.55;
   const top=Math.max(4,(h-imageHeight-78)/2);
   p.font='bold 28px monospace';
   p.fillText(fns.dexName(mon.dex),w/2,top+26,w-16);
   const bottom=top+36+imageHeight;
   drawPokemon(p,mon,w/2,bottom,w*.84,h*.62);
   p.font='bold 36px monospace';
   p.fillText('Lv. '+mon.level+(mon.shiny?' · ★':''),w/2,bottom+32,w-16);
   return;
  }
  scene.removeAttribute('data-caught-dex');
  scene.setAttribute('data-battle-paint','viewport');
  if(backgroundBuffer)p.drawImage(backgroundBuffer,0,0,w,h);
  else{p.fillStyle='#cbdce2';p.fillRect(0,0,w,h);}
  if(!model)return;
  scene.setAttribute('aria-label',model.title+' · '+
   root.TPBattleView.label(model.player)+' gegen '+root.TPBattleView.label(model.enemy));
  if(!cap?.hide)drawPokemon(p,model.enemy,w*.75,h*.57,w*.46,h*.43);
  drawPokemon(p,model.player,w*.25,h-10,w*.53,h*.59);
  const teams=root.TPBattleView.teamIndicators;
  hud(p,model.enemy,6,6,w*.49-8,teams?.enemy);
  hud(p,model.player,w*.50,h-74,w*.50-6,teams?.player);
  drawCaptureBall(p,cap,w,h);
 }


 /* UI01 no-catch decision: no native leave before Continue. */
 let noCatch=null,battleActionEntries=[],battleActionSummary='';
 function noCatchActive(m){
  return !!noCatch&&noCatch.mod===Module&&m.mode==='wild'&&
   m.id===noCatch.stamp.id&&m.round===noCatch.stamp.round&&m.resolved&&
   m.catchOffered&&!m.catchDone&&!m.resultPending&&!m.resultSaving&&live(m)&&
   root.TPBattleView.menu===noCatch.stamp.menu&&
   document.visibilityState==='visible'&&
   Module.ccall('tp_bv_get','number',['number'],[0])===m.id&&
   fns.battleRound()===m.round&&!fns.battleCatchDone();
 }
 function drawNoCatch(m){
  if(!noCatchActive(m)){noCatch=null;return false;}
  page.setAttribute('data-no-catch-confirm','true');
  summary.textContent=deviceText('noCatchQuestion');detail.textContent='';
  const nextKey=JSON.stringify(['no-catch',m.id,m.round,blocked()]);
  if(key===nextKey)return true;
  key=nextKey;content.replaceChildren();battleTeamThumbs=[];
  const slot=page.querySelector('.tp-battle-frame-back-slot');
  slot.replaceChildren();
  page.querySelector('.tp-battle-frame-box-slot').replaceChildren();
  const choices=node('div','tp-battle-buttons');
  const next=node('button','',deviceText('continue'));
  next.type='button';next.disabled=blocked();
  next.setAttribute('data-battle-action','confirm-no-catch');
  const back=node('button');back.type='button';back.disabled=blocked();
  back.setAttribute('data-battle-action','cancel-no-catch');
  root.TPNavBack?.decorate(back,root.TPText.t('common.back'));
  back.addEventListener('click',()=>{
   if(!back.isConnected||blocked()||!noCatchActive(root.TPBattleView.current))return;
   noCatch=null;key='';render(model,battleActionEntries,battleActionSummary);
  });
  next.addEventListener('click',()=>{
   if(!next.isConnected||blocked()||!noCatchActive(root.TPBattleView.current))return;
   const selected=noCatch;noCatch=null;key='';
   dispatch(selected.entry,selected.stamp,selected.mod,true);
   if(Module===selected.mod&&fns.battleCatchDone()&&!fns.battleCatchTried()){
    Module._tp_battle_close();
    if(!Module.ccall('tp_battle_is_open','number',[],[]))screen=battleReturn;
   }
  });
  choices.append(next);content.append(choices);slot.append(back);
  return true;
 }
 /* End UI01 no-catch decision. */

 function dispatch(entry,stamp,mod,confirmedLeave=false){
  if(!page||page.hidden||mod!==Module||blocked()||
     root.TPAdmissionUI?.active||!live(model))return;
  const current=root.TPBattleView.current;
  if(!current||current.mode!==stamp.mode||current.id!==stamp.id||
     current.round!==stamp.round||root.TPBattleView.menu!==stamp.menu)return;
  if(current.mode==='league'){
   const v=root.TPLeague.state;
   if(v.battleId!==stamp.id||v.round!==stamp.round)return;
  }else if(Module.ccall('tp_bv_get','number',['number'],[0])!==stamp.id||
           fns.battleRound()!==stamp.round)return;
  if(entry.action==='leave'&&model.mode==='wild'&&!model.catchDone&&!confirmedLeave){
   noCatch={mod,stamp,entry};key='';
   render(model,battleActionEntries,battleActionSummary);return;
  }
  if(typeof handleTap==='function')
   handleTap(entry.x+entry.w/2,entry.y+entry.h/2);
 }
 function render(m,buttons,title){
  if(typeof document==='undefined'||
     typeof document.getElementById!=='function'||
     typeof root.requestAnimationFrame!=='function'||
     !document.getElementById('tp-game-shell'))return;
  owner=Module;model=m;battleActionEntries=buttons;battleActionSummary=title;
  if(!live(m)){if(!savedAlive())hide();return;}
  if(!ensure())return;

  page.hidden=false;host.setAttribute('data-battle-device','true');
  page.setAttribute('data-battle-state','live');
  page.setAttribute('data-battle-mode',m.mode);
  page.setAttribute('data-battle-menu',m.wildTeam?.needsSwitch?'team':root.TPBattleView.menu);
  page.removeAttribute('data-league-view');
  frameText(m);
  measure();paint();paintTeam();

  const cap=root.TPBattleView.capture;
  page.setAttribute('data-capture-phase',cap?.phase||'');
  summary.textContent=cap?.headline||title||m.title;
  detail.textContent=cap?.detail||m.reward||m.note||'';
  if(drawNoCatch(m))return;
  page.removeAttribute('data-no-catch-confirm');
  if(root.TPAdmissionUI?.active&&admissionPage){
   admissionPage.inert=!!cap?.busy;return;
  }
  if(admissionPage)restoreAdmission();
  savedCard=null;
  if(savedOwner)savedOwner.removeAttribute('aria-hidden');
  savedOwner=null;savedIndex=-1;

  const next=JSON.stringify([
   m.mode,m.id,m.round,m.resolved,m.player.hp,m.enemy.hp,
   root.TPBattleView.menu,cap?.phase,m.error,m.resultPending,m.resultSaving,
   m.wildTeam?.active,m.wildTeam?.needsSwitch,buttons
  ]);
  if(next===key)return;
  key=next;content.replaceChildren();battleTeamThumbs=[];
  page.querySelector('.tp-battle-frame-back-slot').replaceChildren();
  page.querySelector('.tp-battle-frame-box-slot').replaceChildren();
  if(root.TPBattleView.menu==='info'&&!m.resolved){
   content.append(node('p','tp-battle-stats',
    m.player.hp+' / '+m.player.maxHp+' KP · ANG '+m.player.atk+
    ' · VER '+m.player.def+' · INI '+m.player.spe));
  }
  const grid=node('div','tp-battle-buttons');content.append(grid);
  for(const entry of buttons){
   const button=node('button','',entry.action==='leave'?deviceText('noCatch'):entry.label);
   button.type='button';button.disabled=!entry.enabled;
   button.setAttribute('data-battle-action',entry.action);
   if(/^member[0-5]$/.test(entry.action)){
    const index=Number(entry.action.slice(6));
    const mon=m.wildTeam?.members?.[index];
    if(mon){
     button.textContent='';button.className='tp-battle-team-choice';
     button.setAttribute('data-active',String(index===m.wildTeam.active));
     button.setAttribute('data-ko',String(mon.hp===0));
     button.setAttribute('aria-label',(mon.nick||fns.dexName(mon.dex))+
      ', '+mon.hp+' von '+mon.maxHp+' KP'+(mon.hp===0?', besiegt':''));
     const image=node('canvas','tp-battle-team-image');
     image.width=96;image.height=64;image.setAttribute('aria-hidden','true');
     image.setAttribute('data-team-dex',String(mon.dex));
     const copy=node('span','tp-battle-team-copy');
     copy.append(node('b','',mon.nick||fns.dexName(mon.dex)),
      node('small','',(mon.hp===0?'Besiegt · ':'')+mon.hp+'/'+mon.maxHp+' KP'));
     const track=node('span','tp-battle-team-hp'),fill=node('span');
     fill.style.width=(mon.hp/mon.maxHp*100)+'%';
     track.append(fill);copy.append(track);
     button.append(image,copy);battleTeamThumbs.push({canvas:image,mon});
    }
   }
   if(entry.action==='back')
    root.TPNavBack?.decorate(button,root.TPText.t('common.back'));
   const stamp={
    mode:m.mode,id:m.id,round:m.round,menu:root.TPBattleView.menu
   },mod=Module;
   button.addEventListener('click',()=>{
    if(!button.disabled&&button.isConnected)dispatch(entry,stamp,mod);
   });
   if(entry.action==='back'||
      entry.action==='abort'&&(m.wildTeam?.needsSwitch||root.TPBattleView.menu==='team')){
    if(entry.action==='abort'){
     button.replaceChildren(node('span','tp-battle-frame-action-label',entry.label));
    }
    page.querySelector('.tp-battle-frame-back-slot').append(button);
   }else grid.append(button);
  }

  if(m.wildTeam?.needsSwitch||root.TPBattleView.menu==='team'){
   const count=buttons.filter(item=>/^member[0-5]$/.test(item.action)).length;
   for(let i=count;i<6;i++){
    const empty=node('div','tp-battle-empty-team');
    empty.setAttribute('aria-hidden','true');grid.append(empty);
   }
  }
 }

 function saved(v,finished,source){
  if(!ensure())return false;
  owner=Module;model=root.TPBattleView.current;
  const card=source.querySelector('.tp-league-saved-card')||savedCard;
  if(!card)return false;
  page.hidden=false;host.setAttribute('data-battle-device','true');
  page.setAttribute('data-battle-state','saved');
  page.setAttribute('data-league-view','victory');
  page.setAttribute('data-battle-mode','league');
  summary.textContent='';detail.textContent='';frameText(model,true);
  if(card.parentNode!==content){
   restoreAdmission();content.replaceChildren();content.append(card);
  }
  savedCard=card;savedOwner=source;savedIndex=v.index;
  source.setAttribute('aria-hidden','true');
  key='';measure();paint();return true;
 }


 let admissionQueued=false,admissionBack=null,admissionBox=null;

 function admission(element,mon){
  if(game()!=='battle'){
    if(!root.TPAdmissionUI?.active||
       !['idle','card','settings'].includes(game())||
       typeof Module==='undefined'||!Module)return false;
    let pending;
    try{pending=root.TPAdmission?.read()?.pending;}catch(_){return false;}
    if(!pending?.pokemon||!Number.isInteger(pending.pokemon.dex))return false;
    mon=pending.pokemon;
    const fresh=!admissionRecovery||recoveryTicket!==pending.ticket||owner!==Module;
    if(!ensure())return false;
    if(fresh){
     restoreAdmission();
     owner=Module;model=null;
     admissionRecovery=true;recoveryTicket=pending.ticket;
     battleTeamThumbs=[];key='';
     page.querySelector('.tp-battle-frame-back-slot').replaceChildren();
     page.querySelector('.tp-battle-frame-box-slot').replaceChildren();
    }
    page.hidden=false;
    host.setAttribute('data-battle-device','true');
    page.setAttribute('data-battle-state','admission');
    page.setAttribute('data-battle-mode','admission');
    page.setAttribute('data-battle-menu','admission');
    page.removeAttribute('data-league-view');
    const title=root.TPAdmissionText.t('title');
    page.setAttribute('aria-label',title);
    page.querySelector('.tp-battle-frame-title').textContent=title;
    page.querySelector('.tp-battle-frame-menu').textContent=title;
    summary.textContent=root.TPAdmissionText.t('member',{
     name:mon.nickname||fns.dexName(mon.dex),level:mon.level
    });
    detail.textContent='';
   }else if(!page||page.hidden||model?.mode!=='wild')return false;
  admissionPage=element;if(mon)incoming=mon;
  page.setAttribute('data-battle-admission','true');
  if(element.parentNode!==content){
   content.replaceChildren();content.append(element);
  }
  element.style.display='flex';
  element.inert=!!root.TPBattleView.capture?.busy;
  if(!admissionQueued){
   admissionQueued=true;
   Promise.resolve().then(()=>{
    admissionQueued=false;
    if(admissionPage!==element||!root.TPAdmissionUI?.active)return;
    if(Array.from(element.children).some(el=>el.className==='tp-battle-admission-actions'))return;

    const children=Array.from(element.children);
    const replacing=children.some(el=>el.getAttribute('data-admission-action')==='replace');
    element.setAttribute('data-admission-team-selection',String(replacing));
    const focused=document.activeElement;
    if(admissionBack)admissionBack.remove();
    if(admissionBox)admissionBox.remove();
    admissionBack=null;admissionBox=null;
    let exceptional=true,s=null;
    try{
     s=root.TPCollection.read();
     const sum=root.TPCollectionModel.summary(s);
     exceptional=!!root.TPCollection.blocked||
      sum.stored>=sum.capacity||!!element.querySelector('.tp-box-message');
    }catch(_){}
    const info=node('div','tp-battle-admission-info');
    const actions=node('div','tp-battle-admission-actions');
    if(replacing)battleTeamThumbs=[];

    for(const child of children){
     if(child.tagName!=='BUTTON'){info.append(child);continue;}
     const kind=child.getAttribute('data-admission-action');
     if(kind==='boxes'){child.remove();continue;}
     if(kind==='later'){
      if(exceptional&&!child.disabled){
       admissionBack=child;
       root.TPNavBack?.decorate(child,root.TPText.t('common.back'));
       page.querySelector('.tp-battle-frame-back-slot').append(child);
      }else child.remove();
      continue;
     }
     if(kind==='back'){
      admissionBack=child;
      root.TPNavBack?.decorate(child,root.TPText.t('common.back'));
      page.querySelector('.tp-battle-frame-back-slot').append(child);continue;
     }
     if(kind==='box'&&replacing){
      admissionBox=child;child.textContent='';
      child.setAttribute('aria-label',deviceText('box'));
      child.setAttribute('title',deviceText('box'));
      const icon=node('span','tp-battle-box-symbol');
      icon.setAttribute('aria-hidden','true');
      icon.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18v14H3zM2 3h20v4H2zM9 12h6"/></svg>';
      child.append(icon);
      page.querySelector('.tp-battle-frame-box-slot').append(child);continue;
     }
     if(kind==='box')child.textContent=deviceText('box');
     if(kind==='accept')child.textContent=root.TPAdmissionText.t('team');
     if(kind==='replace'){
      const id=Number(child.getAttribute('data-admission-member-id'));
      const stored=s?.mons.find(p=>p.id===id);
      const runtime=model?.wildTeam?.members?.find(p=>p.id===id);
      if(stored){
       const title=stored.nickname||fns.dexName(stored.dex);
       child.className='tp-battle-team-choice';
       child.setAttribute('data-pinned',String(id===s.active));
       child.setAttribute('aria-label',title+
        (id===s.active?' · Pflege-Pokémon, fest':'')+
        (runtime?', '+runtime.hp+' von '+runtime.maxHp+' KP':', KP nicht verfügbar'));
       const image=node('canvas','tp-battle-team-image');
       image.width=96;image.height=64;image.setAttribute('aria-hidden','true');
       const copy=node('span','tp-battle-team-copy');
       copy.append(node('b','',title),
        node('small','',id===s.active?'Fest · '+(runtime?runtime.hp+'/'+runtime.maxHp+' KP':'KP —'):
         runtime?runtime.hp+'/'+runtime.maxHp+' KP':'KP —'));
       child.replaceChildren(image,copy);
       battleTeamThumbs.push({canvas:image,mon:runtime||stored});
      }
     }
     actions.append(child);
    }
    info.hidden=!exceptional;
    element.replaceChildren(info,actions);
    if(focused&&element.contains(focused))focused.focus?.({preventScroll:true});
    else{element.tabIndex=-1;element.focus?.({preventScroll:true});}
   });
  }
  measure();paint();paintTeam();return true;
 }

 function actionPoint(action){
  if(!page||page.hidden)return null;
  const button=page.querySelector('[data-battle-action="'+action+'"]');
  if(!button||button.disabled)return null;
  button.scrollIntoView({block:'nearest',inline:'nearest'});
  const box=button.getBoundingClientRect();
  return box.width&&box.height?{x:box.x+box.width/2,y:box.y+box.height/2}:null;
 }
 root.TPBattlePokedex=Object.freeze({
  capture,captureBackground,render,saved,admission,actionPoint,
  get active(){return !!page&&!page.hidden;}
 });
})(typeof globalThis!=='undefined'?globalThis:this);
