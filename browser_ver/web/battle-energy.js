// Read-only display adapter. Native code owns prices, gating and debits.
(function(){'use strict';
function supported(){try{return !!Module&&typeof Module._tp_energy_state==='function';}catch(_){return false;}}
function view(){return supported()?JSON.parse(Module.ccall('tp_energy_state','string',[],[])):null;}
function line(kind){const s=view(),q=s?.[kind];if(!q)return 'Aktuellen Spielkern laden.';return q.can?'Energie '+s.energy+' → '+(s.energy-q.cost)+' · Kosten '+q.cost:'Energie '+s.energy+' / '+q.required+' benoetigt · Kosten '+q.cost;}
window.TPBattleEnergy=Object.freeze({get supported(){return supported();},get view(){return view();},line});
})();
