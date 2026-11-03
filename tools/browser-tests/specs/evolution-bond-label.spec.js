const {test,expect}=require('@playwright/test');
const H=require('./helpers');

test('Entwicklung: keine Mindestbindung statt irreführender Nullquote',async({page})=>{
 await H.prepare(page);
 await H.openHub(page);
 await page.getByRole('button',{name:'Entwicklung',exact:true}).click();
 const label=page.locator(
  '#tp-evolution-goal [data-evo-check="1"] .tp-evo-check-label'
 );
 await expect(label).toHaveText('Keine Mindestbindung');
 expect(await page.evaluate(()=>Module.ccall(
  'tp_evo_rule_field','number',['number','number','number'],
  [fns.speciesId(),0,2]
 ))).toBe(0);
});
