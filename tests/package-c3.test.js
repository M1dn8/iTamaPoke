const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const chart=JSON.parse(fs.readFileSync(process.env.C3_TYPE_CHART||"/tmp/c3-type-chart.json","utf8"));
let lang=3,seed=123,awards=0,persists=0,sackOver=false;const metrics=[98,30,99,95],math=Object.create(Math);
math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const mod={ccall(name,ret,types,args){assert.equal(name,"tp_c3_metric");return metrics[args[0]];},_tp_type_effect_pct:(a,d)=>chart[a][d],_tp_last_gain:()=>5,
 _tp_type_result(){awards++;metrics[0]=Math.min(100,metrics[0]+5);return 1;},_tp_catch_result(){awards++;metrics[2]=Math.min(100,metrics[2]+5);return 1;},_tp_clean_result(){awards++;metrics[3]=Math.min(100,metrics[3]+20);return 1;},
 _tp_sack_start(){sackOver=false;},_tp_sack_is_over:()=>sackOver?1:0,_tp_sack_new_high:()=>1,_tp_sack_step(now){if(!sackOver&&now>=1000){metrics[0]=Math.min(100,metrics[0]+5);sackOver=true;}}};
const ctx={Module:mod,fns:{language:()=>lang},Math:math,TP:{cx:233,cy:233},console,document:{getElementById:()=>null},setInterval(){},saveNow(){persists++;return Promise.resolve();},playSfx(){}};ctx.window=ctx;vm.createContext(ctx);
for(const file of ["de-ui.js","mini-progress.js","minigames.js"])vm.runInContext(fs.readFileSync("browser_ver/web/"+file,"utf8"),ctx);
const names=ctx.TPText.types(["","NORMAL","FIRE"]);assert.equal(names[2],"FEUER");assert.equal(ctx.TPText.status("Catch · score 5 · misses 1/3"),"Fangen · Punkte 5 · Fehler 1/3");lang=1;assert.equal(names[2],"FIRE");assert.equal(ctx.TPText.status("Play menu"),"Play menu");lang=3;
const g=vm.runInContext("TypeGame",ctx);g.start(0);assert.equal(g.defenders.length,18);const seen=new Set();
for(let i=0;i<1000;i++){g.nextQuestion(i*10);seen.add(g.enemy);assert.equal(new Set(g.choices).size,3);assert.equal(g.choices.filter(t=>chart[t][g.enemy]>100).length,1);assert(chart[g.choices[g.correct]][g.enemy]>100);}assert.equal(seen.size,18);
g.start(1000);let now=1100;
for(let miss=1;miss<=3;miss++){const wrong=(g.correct+1)%3;assert.equal(g.tap(wrong,now),"miss");assert.equal(g.misses,miss);for(let i=0;i<20;i++)assert.equal(g.tap(g.correct,now+10+i),"ignored");assert.equal(g.misses,miss);g.step(now+699);assert.equal(g.overUntil,0);g.step(now+700);now+=1000;}
assert(g.overUntil>0);assert.equal(awards,1);assert.equal(ctx.TPMini.text("type"),"Angriff +2");g.step(now+10000);assert.equal(awards,1);
g.start(10000);assert.equal(g.tap(g.correct,14200),"miss");assert.equal(g.score,0);assert.equal(g.misses,1);
ctx.TPMini.begin("catch");ctx.TPMini.award("catch",9);assert.equal(ctx.TPMini.text("catch"),"Tempo +1");const before=awards;ctx.TPMini.award("catch",9);assert.equal(awards,before);
ctx.TPMini.begin("clean");ctx.TPMini.award("clean",5);assert.equal(ctx.TPMini.text("clean"),"Hygiene +5");ctx.TPMini.begin("clean");ctx.TPMini.award("clean",5);assert.equal(ctx.TPMini.text("clean"),"Hygiene bereits maximal");
metrics[0]=98;const sack=vm.runInContext("SackGame",ctx);sack.start(0);sack.step(1000);assert.equal(ctx.TPMini.text("sack"),"Angriff +2");sack.step(1001);assert.equal(metrics[0],100);assert(persists>=5);
console.log("C3 JS passed: German language switching, all 18 types, unique answers, feedback/deadline, capped actual rewards and once-only awards.");
