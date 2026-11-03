'use strict';
const assert=require('node:assert/strict');
const {setup}=require('./helpers/ui01-egg-planning.cjs');

(async()=>{
 const a=setup();
 await a.byLabel('Bevorzugte Generation').click();
 await a.byData('eggGeneration',2).click();
 await a.byLabel('Bevorzugter Typ').click();
 await a.byData('eggType',5).click();
 assert.equal(a.byClass('tp-egg-art').dataset.wishType,'5');
 assert(a.byClass('tp-egg-art').innerHTML.includes('#98c779'));
 assert.equal(a.state.type,0);
 assert.equal(a.state.generation,0);
 assert.equal(a.writes,0);
 assert(!a.flat(a.body).some(n=>['select','input'].includes(n.tagName)));
 assert(!a.byClass('tp-egg-stamp'));
 await a.byLabel('Bevorzugte Generation').click();
 await a.byId('tp-egg-choice-next').click();
 await a.byData('eggGeneration',9).click();
 await a.byLabel('Bevorzugte Generation').click();
 assert(a.byData('eggGeneration',7));
 assert(a.byData('eggGeneration',8));
 assert(a.byData('eggGeneration',9));
 assert(!a.byData('eggGeneration',0));
 await a.byData('eggGeneration',9).click();
 a.byClass('tp-egg-picker').clientWidth=162;
 await a.byLabel('Bevorzugte Generation').click();
 assert.equal(a.byClass('tp-egg-picker').dataset.columns,'3');
 assert.equal(a.byClass('tp-egg-picker').children.length,9);
 assert.equal(a.byId('tp-egg-choice-prev').hidden,true);
 assert.equal(a.byId('tp-egg-choice-next').hidden,true);
 assert(!a.byData('eggGeneration',0));
 await a.byData('eggGeneration',1).click();
 await a.byLabel('Bevorzugter Typ').click();
 assert.equal(a.byClass('tp-egg-picker').dataset.columns,'3');
 assert.equal(a.byClass('tp-egg-picker').children.length,9);
 assert(!a.byData('eggType',0));
 await a.byData('eggType',5).click();
 assert.equal(a.byClass('tp-egg-art').dataset.wishType,'0');
 await a.byLabel('Info').click();
 assert.equal(a.byClass('tp-egg-info-panel').hidden,false);
 const typeControlCategory=a.flat(a.byLabel('Bevorzugter Typ'))
  .find(n=>n.dataset.eggCategory==='type');
 const typeInfoCategory=a.flat(a.byClass('tp-egg-info-panel'))
  .find(n=>n.dataset.eggCategory==='type');
 assert(typeControlCategory);
 assert(typeInfoCategory);
 assert.equal(typeControlCategory.innerHTML,typeInfoCategory.innerHTML);
 const modal=a.byClass('tp-modal');
 const escape=(modal.handlers.keydown||[])[0];
 assert(escape);
 escape({key:'Escape',preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
 assert.equal(a.byClass('tp-egg-preview').hidden,false);
 const fixed=setup({egg:true});
 assert.equal(fixed.byLabel('Bevorzugter Typ').disabled,true);
 assert.equal(fixed.byClass('tp-egg-art').dataset.wishType,'5');
 assert.equal(fixed.writes,0);
 const failed=setup({fail:true});
 await failed.byLabel('Bevorzugte Generation').click();
 await failed.byData('eggGeneration',2).click();
 await failed.byLabel('Plan speichern und neu laden').click();
 assert.equal(failed.writes,1);
 assert.equal(failed.state.generation,0);
 assert.equal(failed.context.tpSaveReplacing,false);
 assert.equal(failed.context.TPEggPlanning.busy,false);
 assert.equal(failed.alerts.length,1);
 const success=setup({unraised:true});
 await success.byLabel('Bevorzugte Generation').click();
 await success.byData('eggGeneration',2).click();
 await success.byLabel('Plan speichern und neu laden').click();
 assert.equal(success.writes,1);
 assert.equal(success.state.generation,2);
 assert.equal(success.state.unraised,true,'Hidden existing preference must be preserved');
 assert.equal(success.reloads,1);
 assert.equal(success.context.Module,null);
 assert.equal(success.context.tpSaveReplacing,true);
 const reset=setup({unraised:true});
 await reset.byLabel('Bevorzugte Generation').click();
 await reset.byData('eggGeneration',2).click();
 await reset.byLabel('Bevorzugter Typ').click();
 await reset.byData('eggType',5).click();
 await reset.byLabel('Zufall wiederherstellen').click();
 assert.equal(reset.state.generation,0);
 assert.equal(reset.state.type,0);
 assert.equal(reset.state.unraised,false);
 assert.equal(reset.writes,1);
 assert.equal(reset.reloads,1);
 for(const check of [a,fixed])
  assert(check.calls.every(name=>[
   'tp_egg_plan_can_set','tp_egg_plan_generation','tp_egg_plan_type',
   'tp_egg_plan_unraised','tp_egg_used_generation','tp_egg_used_type',
   'tp_egg_used_unraised'
  ].includes(name)));
 console.log('UI01 egg planning revision 2 passed: internal generation/type choices, colour preview, no native dropdowns, preserved hidden weighting, read-only used wishes, original rollback and reload gate. DOM/native dependencies simulated; no manual visual acceptance claimed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
