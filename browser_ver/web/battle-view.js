/* Shared battle presentation. Original Canvas scenery, no bundled species art.
 * Native snapshots own stats/damage; this module only renders and routes taps.
 */
(function(){'use strict';let key='',menu='main',last=null,targets={},feedbackAt=0,feedbackKey='',captureFx=null,captureView=null;
const call=(n,...a)=>Module.ccall(n,'number',a.map(()=> 'number'),a);
const themes=['ice','rock','ghost','dragon','champ'];
function text(s,x,y,size=13,color='#292831',max=420,align='center'){ctx.fillStyle=color;ctx.textAlign=align;ctx.font=size+'px monospace';ctx.fillText(String(s),x,y,max);}
function panel(x,y,w,h,color='#fff'){ctx.fillStyle=color;roundRect(x,y,w,h,9);ctx.fill();ctx.strokeStyle='#292831';ctx.lineWidth=1.5;ctx.stroke();}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.fill();}
function background(theme){const palettes={ice:['#bfdce5','#729baa','#dcebef'],rock:['#b4a381','#756b56','#c9b891'],ghost:['#63556e','#352d46','#82738a'],dragon:['#a4b6a9','#526f65','#d2cbb0'],champ:['#dfcfaa','#ad9765','#eee2c7'],field:['#b7d3bf','#638d72','#d6dbc3']},p=palettes[theme]||palettes.field;ctx.fillStyle=p[0];ctx.fillRect(0,0,466,294);ctx.fillStyle=p[1];ctx.fillRect(0,28,466,164);ctx.fillStyle=p[2];ctx.fillRect(0,192,466,102);
 for(let y=194;y<294;y+=20){ctx.fillStyle=p[0];ctx.fillRect(0,y,466,1);for(let x=(y%40?24:0);x<466;x+=64)ctx.fillRect(x,y,1,20);}
 if(theme==='ice'){for(const x of [8,82,250,404]){poly([[x,192],[x+17,61],[x+36,96],[x+42,192]],'#ccebf1');poly([[x+17,61],[x+36,96],[x+22,192]],'#8cc3d3');}ctx.fillStyle='#effcff';for(let i=0;i<20;i++)ctx.fillRect((i*73)%466,34+(i*41)%150,2,2);}
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
function button(action,label,x,y,w,h=42,enabled=true){panel(x,y,w,h,enabled?'#fff':'#d7d6cb');text(label,x+w/2,y+h/2+5,14,enabled?'#292831':'#81877e',w-14);if(enabled)targets[action]={x,y,w,h};}
function prepare(m){const k=m.mode+':'+m.id;if(k!==key){key=k;menu='main';captureFx=null;captureView=null;}last=m;targets={};const fk=k+':'+m.round;if(fk!==feedbackKey){feedbackKey=fk;feedbackAt=performance.now();}}
function draw(m){prepare(m);const capture=captureState(m);if(capture&&ownsCapture(m)&&!captureFx.phases.includes(capture.phase))captureFx.phases.push(capture.phase);captureView=capture?Object.freeze({...capture,battleId:m.id,phases:Object.freeze(ownsCapture(m)?captureFx.phases.slice():[capture.phase])}):null;background(m.theme);text(m.title,233,21,14,m.theme==='ghost'?'#fff8e6':'#292831');if(!capture?.hide)sprite(m.enemy,353,180,108);sprite(m.player,112,280,132);status(m.enemy,18,44,220);status(m.player,222,213,226);if(capture?.ball){const b=capture.ball;ball(b.x,b.y,10,b.angle,b.opened);}
 if(m.round&&performance.now()-feedbackAt<1800){if(m.dealt)text('−'+m.dealt+' KP',353,73,17,'#b84544',150);if(m.taken)text('−'+m.taken+' KP',112,224,17,'#b84544',150);if(m.heal)text('+'+m.heal+' KP',112,199,16,'#2b8260',150);}
 ctx.fillStyle='#f7efe6';ctx.fillRect(0,299,466,167);ctx.fillStyle='#292831';ctx.fillRect(0,296,466,3);
 const summary=capture?.headline||m.error||(!m.resolved?(m.round?'Gegner −'+m.dealt+' KP · Du −'+m.taken+' KP'+(m.heal?' · Heilung +'+m.heal:''):'Wähle deine Aktion.'):m.next?'Gegner besiegt. Rest-KP bleiben erhalten.':m.mode==='league'&&m.won?'Sieg wird dauerhaft gespeichert.':m.won?'Sieg!':'Niederlage.');text(summary,233,318,12,m.error?'#a14646':'#292831',438);
 text(capture?.detail||('Runde '+(m.round||0)+' · Heilungen '+m.rests+(m.note?' · '+m.note:'')),233,335,10,'#5d5960',438);
 if(capture?.busy){/* No actionable targets during flight, shaking or save. */}
 else if(menu==='info'&&!m.resolved){panel(26,126,414,159);text(name(m.player)+' · Lv. '+m.player.level,233,151,18);text(m.player.nick||'Kampfwerte beim Start erfasst',233,176,12);text('KP '+m.player.hp+' / '+m.player.maxHp,233,201,15);text('ANG '+m.player.atk+' · VER '+m.player.def+' · INI '+m.player.spe,233,227,12);text('Kein Teamwechsel in diesem Kampfsystem.',233,254,11);button('back','Zurück',50,350,366);}
 else if(m.resolved){if(m.next)button('next','Nächster Gegner',50,350,366);else if(m.mode==='league'&&m.won){if(m.retry)button('retry','Speichern erneut versuchen',50,350,366);button('abort','Lauf verlassen',50,408,366,36);}else if(m.catchOffered&&!m.catchDone){button('catch',m.catchAllowed===false?'Fangen gesperrt':'Fangen',50,350,174,42,m.catchAllowed!==false);button('leave','Weiter ohne Fang',242,350,174);}else button(m.mode==='league'?'abort':'ok',m.mode==='league'?'Zur Ligaübersicht':'Weiter',50,350,366);}
 else if(menu==='moves'){button('quick','Schnell',50,350,174);button('heavy','Kräftig',242,350,174);button('dodge','Ausweichen',50,404,174);button('rest','Heilen ('+m.rests+')',242,404,174,42,m.rests>0);button('back','‹',202,448,62,17);}
 else{button('fight','Kampf',50,350,366);button('info','Pokémon',50,404,174);button('abort',m.mode==='wild'?'Fliehen':'Aufgeben',242,404,174);}
 statusEl.textContent=capture?capture.headline+' '+capture.detail:m.title+' · '+m.player.hp+'/'+m.player.maxHp+' KP';}
function actionAt(x,y){for(const [a,r]of Object.entries(targets))if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)return a;return null;}
function handle(x,y,m){const k=m.mode+':'+m.id;if(k!==key){key=k;menu='main';targets={};return null;}const a=actionAt(x,y);if(a==='fight'){menu='moves';return null;}if(a==='info'){menu='info';return null;}if(a==='back'){menu='main';return null;}if(m.resolved&&!['next','catch','leave','ok','retry','abort'].includes(a))return null;return a;}
function leagueModel(v,error='',retry=false){const trainer=Math.min(4,Math.floor(v.index/5));return {mode:'league',id:v.battleId,theme:themes[trainer],title:(trainer<4?'Top Vier · '+['Lorelei','Bruno','Agathe','Siegfried'][trainer]:'Champ · Blau')+' · '+(trainer===4?v.index-19:v.index%5+1)+'/'+(trainer===4?6:5),round:v.round,rests:v.rests,note:v.note||'',resolved:!!v.resolved,won:!!v.won,dealt:v.dealt||0,taken:v.taken||0,heal:v.heal||0,error,retry,player:{dex:v.playerDex,level:v.playerLevel,form:v.form,shiny:v.shiny,nick:v.nick,hp:v.hp,maxHp:v.maxHp,atk:v.atk,def:v.def,spe:v.spe},enemy:{dex:v.dex,level:v.level,hp:v.enemyHp,maxHp:v.enemyMaxHp}};}
function standard(){const b=k=>call('tp_bv_get',k),trainer=!!window.TPTrainer.active(),arena=b(10),form=b(5);const capture=trainer?null:window.TPCapture?.status();return {mode:trainer?(arena>=0?'arena':'trainer'):'wild',id:b(0),theme:arena>=0?['rock','ice','field','field','ghost','ghost','champ','rock'][arena]:'field',title:trainer?(arena>=0?window.TPKantoArena?.leaders?.[arena]?.name||'Arena':'Trainerkampf')+' · '+(window.TPTrainer.get(2)+1)+'/'+window.TPTrainer.get(1):'Wilder Kampf',round:fns.battleRound(),note:fns.battleMessage(),rests:call('tp_battle_rest_uses_left'),resolved:!!fns.battleResolved(),won:!!fns.battlePlayerWon(),next:trainer&&!!window.TPTrainer.get(3),catchOffered:!!fns.battleCatchOffered(),catchDone:!!fns.battleCatchDone(),catchTried:!trainer&&!!call('tp_battle_catch_tried'),catchSuccess:!trainer&&!!call('tp_battle_catch_success'),catchAllowed:capture?capture.allowed:true,error:capture?.message||'',dealt:b(7),taken:b(8),heal:b(9),player:{dex:fns.speciesId(),level:b(1),form,shiny:b(6),nick:Module.ccall('tp_bv_nick','string',[],[]),hp:fns.battlePlayerHp(),maxHp:fns.battlePlayerMaxHp(),atk:b(2),def:b(3),spe:b(4)},enemy:{caught:!trainer&&(captureFx&&captureFx.id===b(0)&&captureFx.mod===Module?(captureFx.previouslyCaught||(captureFx.committed&&captureFx.success)):!!call('tp_battle_wild_already_caught')),dex:fns.battleWildDex(),level:call('tp_battle_wild_level'),hp:fns.battleEnemyHp(),maxHp:fns.battleEnemyMaxHp()}};}
function supported(){try{return !!Module&&typeof Module._tp_bv_get==='function';}catch(_){return false;}}
function drawStandard(){if(!supported())return false;if(!call('tp_battle_is_open')){captureFx=null;captureView=null;targets={};screen=battleReturn;return true;}if(window.TPTrainer.active()&&(!call('tp_f2_can_actor')||document.visibilityState!=='visible')){window.TPTrainer.abort();return true;}draw(standard());return true;}
function abort(m){if(m.mode!=='wild'&&!m.resolved&&!confirm('Kampf aufgeben? Bereits bezahlte Energie wird nicht erstattet.'))return false;if(m.mode==='trainer'||m.mode==='arena')window.TPTrainer.abort();else{Module._tp_battle_close();screen=battleReturn;}return true;}
function tapStandard(x,y){if(!supported())return false;const m=standard();if(ownsCapture(m)&&!captureFx.settled)return true;const a=handle(x,y,m);if(!a)return true;if(a==='quick')Module._tp_battle_quick_attack();else if(a==='heavy')Module._tp_battle_heavy_attack();else if(a==='dodge')Module._tp_battle_dodge();else if(a==='rest')Module._tp_battle_rest();else if(a==='next')call('tp_f2_next');else if(a==='catch')startCapture(m);else if(a==='leave'){captureFx=null;captureView=null;Module._tp_battle_leave_wild();}else if(a==='ok'){Module._tp_battle_close();screen=battleReturn;}else if(a==='abort')abort(m);return true;}
function tapLeague(x,y,v,error='',retry=false){return handle(x,y,leagueModel(v,error,retry));}
window.TPBattleView=Object.freeze({draw,drawStandard,tapStandard,drawLeague:(v,e,r)=>draw(leagueModel(v,e,r)),tapLeague,get current(){return last;},get capture(){return captureView;},label:name,target:a=>{const r=targets[a];return r?{x:r.x+r.w/2,y:r.y+r.h/2}:null;},get menu(){return menu;},background});
})();
