const {test,expect}=require('@playwright/test');
const H=require('./helpers');
test.beforeEach(async({page})=>{await H.prepare(page);});
for(const width of [320,390,480]){
 test('Statusnavigation: vier Buttons mittig über beiden Displays '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  const root=await H.openStatus(page);
  for(const tab of ['profile','values','today','achievements']){
   await root.locator('[data-status-tab="'+tab+'"]').click();
   await expect.poll(()=>page.evaluate(()=>{
    const root=document.getElementById('tp-status-page');
    const tabs=Array.from(root.querySelectorAll('[data-status-tab]'))
     .map(node=>node.getBoundingClientRect());
    const displays=Array.from(root.querySelectorAll('.tp-pokedex-display'))
     .map(node=>node.getBoundingClientRect());
    if(tabs.length!==4||displays.length!==2)return false;
    const group=(tabs[0].left+tabs[3].right)/2;
    const panels=(Math.min(...displays.map(r=>r.left))+
     Math.max(...displays.map(r=>r.right)))/2;
    const tools=Array.from(root.querySelectorAll('.tp-status-tool-slot>button'))
     .map(node=>node.getBoundingClientRect());
    const outer=root.getBoundingClientRect();
    return Math.abs(group-panels)<=1.5&&
     tabs.every(r=>r.width>=44&&r.height>=44)&&
     tools.every(r=>r.left>=tabs[3].right&&r.right<=outer.right+1);
   })).toBe(true);
  }
 });
}
