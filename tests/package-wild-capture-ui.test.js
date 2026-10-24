const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('browser_ver/web/battle-view.js','utf8');
function env(result=true,owned=false,reduced=false){
 let now=0,attempts=0,rolls=0,resolve;const labels=[],arcs=[],events={};
 const state={id:1,open:true,done:false,tried:false,success:false,owned,allowed:true,error:'',message:''};
 const mod={_tp_bv_get(){},ccall(n,_r,_t,a){
  if(n==='tp_bv_get')return [state.id,97,200,190,180,0,0,0,0,0,-1][a[0]]||0;
  if(n==='tp_bv_nick')return 'Pflege';
  if(n==='tp_battle_is_open')return +state.open;
  if(n==='tp_battle_catch_tried')return +state.tried;
  if(n==='tp_battle_catch_success')return +state.success;
  if(n==='tp_battle_wild_already_caught')return +state.owned;
  if(n==='tp_battle_wild_level')return 25;
  if(n==='tp_battle_rest_uses_left')return 2;
  throw Error('Unexpected call '+n);
 },_tp_battle_close(){state.open=false;},_tp_battle_leave_wild(){state.done=true;state.tried=false;}};
 const ctx=new Proxy({fillText:t=>labels.push(String(t)),arc:(...a)=>arcs.push(a)},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
 const capture={status:()=>({allowed:state.allowed,message:state.error}),get error(){return state.error;},get message(){return state.message||state.error;},tryCatch(){attempts++;if(!rolls)rolls++;state.done=state.tried=true;state.success=result;state.owned=owned||result;return new Promise(r=>resolve=ok=>{if(!ok){state.done=state.tried=state.success=false;state.owned=owned;state.error='Speichern fehlgeschlagen – Fang erneut versuchen.';}else{state.error='';state.message=result?'Abgelegt: Box 1':'';}r(ok);});}};
 const c={window:null,console,ctx,Module:mod,performance:{now:()=>now},matchMedia:()=>({matches:reduced}),document:{visibilityState:'visible',addEventListener:(n,fn)=>events[n]=fn},screen:'battle',battleReturn:'card',roundRect(){},spriteFor:()=>null,megaSpriteFor:()=>null,statusEl:{textContent:''},TPTrainer:{active:()=>false},TPCapture:capture,TPBoxes:{state:{box:0}},fns:{dexName:d=>'Art '+d,battleRound:()=>1,battleMessage:()=>'',battleResolved:()=>1,battlePlayerWon:()=>1,battleCatchOffered:()=>1,battleCatchDone:()=>+state.done,speciesId:()=>376,battlePlayerHp:()=>80,battlePlayerMaxHp:()=>100,battleWildDex:()=>25,battleEnemyHp:()=>0,battleEnemyMaxHp:()=>60}};
 c.window=c;vm.createContext(c);vm.runInContext(source,c);const ui=c.TPBattleView;
 const draw=()=>{labels.length=0;arcs.length=0;ui.drawStandard();};
 const tap=a=>{const p=ui.target(a);assert(p,'missing target '+a);ui.tapStandard(p.x,p.y);};
 const flush=()=>new Promise(setImmediate);
 return {c,state,ui,draw,tap,flush,labels,arcs,time:t=>now=t,release:ok=>{assert(resolve);resolve(ok);},get attempts(){return attempts;},get rolls(){return rolls;},hide(){c.document.visibilityState='hidden';events.visibilitychange();},show(){c.document.visibilityState='visible';events.visibilitychange();}};
}
(async()=>{
 for(const owned of [false,true]){const e=env(true,owned);e.draw();assert.equal(e.ui.current.enemy.caught,owned);assert.equal(e.arcs.filter(a=>a[2]===6).length,owned?2:0);}
 for(const success of [false,true]){
  const e=env(success);e.draw();e.tap('catch');assert.equal(e.attempts,0);e.draw();assert.equal(e.ui.capture.phase,'throw');assert.equal(e.ui.capture.ball.x,112);
  for(let i=0;i<3;i++)e.ui.tapStandard(137,371);assert.equal(e.attempts,0);assert.equal(e.ui.target('catch'),null);
  e.time(550);e.draw();assert.equal(e.ui.capture.phase,'absorb');assert.equal(e.ui.capture.hide,true);
  e.time(800);e.draw();assert.equal(e.ui.capture.phase,'shake');
  e.time(1800);e.draw();await e.flush();assert.equal(e.attempts,1);e.draw();assert.equal(e.ui.capture.phase,'saving');assert.equal(e.ui.capture.committed,false);assert.equal(e.ui.current.enemy.caught,false);assert(!e.labels.includes('Gefangen!'));assert.equal(e.ui.target('ok'),null);
  for(let i=0;i<3;i++)e.ui.tapStandard(137,371);assert.equal(e.attempts,1);
  e.release(true);await e.flush();e.draw();assert.equal(e.ui.capture.phase,success?'caught':'escaped');assert.equal(e.ui.capture.hide,success);assert.equal(e.ui.capture.ball.opened,!success);assert.equal(e.ui.current.enemy.caught,success);assert(e.labels.includes(success?'Gefangen!':'Entkommen!'));if(success)assert(e.labels.some(x=>x.includes('Abgelegt: Box 1')));
  assert.equal(e.rolls,1);e.tap('ok');e.draw();assert.equal(e.c.screen,'card');assert.equal(e.ui.capture,null);
 }
 const e=env(true);e.draw();e.tap('catch');e.draw();e.time(1800);e.draw();await e.flush();e.release(false);await e.flush();e.draw();assert.equal(e.ui.capture.phase,'error');assert.equal(e.ui.current.enemy.caught,false);assert.equal(e.state.done,false);assert(e.ui.target('catch'));e.tap('catch');e.draw();e.time(3600);e.draw();await e.flush();assert.equal(e.attempts,2);assert.equal(e.rolls,1);e.release(true);await e.flush();e.draw();assert.equal(e.ui.capture.phase,'caught');
 const hidden=env();hidden.draw();hidden.tap('catch');hidden.hide();hidden.show();hidden.time(3000);hidden.draw();await hidden.flush();assert.equal(hidden.attempts,0);assert.equal(hidden.ui.capture,null);assert(hidden.ui.target('catch'));
 const reduced=env(false,false,true);reduced.draw();reduced.tap('catch');reduced.draw();await reduced.flush();assert.equal(reduced.attempts,1);assert.equal(reduced.ui.capture.phase,'saving');reduced.release(true);await reduced.flush();reduced.draw();assert.equal(reduced.ui.capture.phase,'escaped');
 const blocked=env();blocked.state.allowed=false;blocked.draw();assert.equal(blocked.ui.target('catch'),null);blocked.ui.tapStandard(137,371);await blocked.flush();assert.equal(blocked.attempts,0);
 const left=env();left.draw();left.tap('leave');left.draw();assert.equal(left.ui.capture.phase,'left');assert(left.labels.includes('Ohne Fang weiter.'));assert.equal(left.attempts,0);
 console.log('Wild capture UI passed: historical painted marker; throw/absorb/shake; one attempt; no provisional success; saved success/failure; quota retry without extra roll; background cancel; reduced motion; capacity guard; skip and return. Native storage remains covered separately.');
})().catch(e=>{console.error(e);process.exit(1);});
