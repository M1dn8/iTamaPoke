(function(){
"use strict";
const config={ball:{metric:2,fn:"_tp_play_result"},catch:{metric:2,fn:"_tp_catch_result"},memo:{metric:1,fn:"_tp_memo_result"},clean:{metric:3,fn:"_tp_clean_result"},type:{metric:0,fn:"_tp_type_result"},sack:{metric:0}},results={};
function metric(i){try{const n=Module.ccall("tp_c3_metric","number",["number"],[i]);return n>=0&&n<=100?n:null;}catch(_e){return null;}}
function begin(k){results[k]=null;}
function record(k,before,after,newHigh){results[k]={metric:config[k].metric,before,after,delta:before===null||after===null?null:Math.max(0,after-before),newHigh};}
function persist(){if(typeof saveNow==="function"&&Module)Promise.resolve(saveNow(Module)).catch(e=>console.warn("[minispiel]",e));}
function award(k,score){if(results[k])return results[k].newHigh;const c=config[k],before=metric(c.metric),high=Module[c.fn](score);record(k,before,metric(c.metric),high);persist();return high;}
function sackStep(now){const wasOver=Module._tp_sack_is_over()!==0,before=wasOver?null:metric(0);Module._tp_sack_step(now);if(!wasOver&&Module._tp_sack_is_over()!==0&&!results.sack){record("sack",before,metric(0),Module._tp_sack_new_high());persist();}}
function text(k){const r=results[k];if(!r||r.delta===null)return TPText.pick("Ergebnis","Result");const n=TPText.pick(["Angriff","Verteidigung","Tempo","Hygiene"][r.metric],["Attack","Defence","Speed","Hygiene"][r.metric]);if(r.delta>0)return n+" +"+r.delta;if(r.after>=100)return n+TPText.pick(" bereits maximal"," already maxed");return TPText.pick("Kein Trainingsgewinn","No training gain");}
window.TPMini={begin,award,sackStep,text,result:k=>results[k]};
})();
