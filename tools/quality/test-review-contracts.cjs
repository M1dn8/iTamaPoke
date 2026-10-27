 'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
// Runner config scope: evaluate the actual argument expression,
// not a separately reconstructed command.
const runner=read('tools/quality/review-check.cjs');
const argumentExpression=runner.match(/const args=(\[[\s\S]*?\]);/);
assert(argumentExpression,'Runner argument expression missing');
for(const workers of [1,2])
for(const name of ['test-collection','navigation-smoke','affected','full','quick']){
 const selection=name==='navigation-smoke'?
  ['specs/navigation-smoke.spec.js']:[];
 const args=require('node:vm').runInNewContext(argumentExpression[1],{
  cli:'playwright-cli',root,path,selection,name,workers
 });
 const index=args.indexOf('--config');
 assert(index>=0,'Explicit Playwright configuration missing: '+name);
 assert.equal(args.filter(value=>value==='--config').length,1);
 assert.equal(args[index+1],
  path.join(root,'tools/browser-tests/playwright.config.js'));
 assert(args.includes('--retries=0'));
 assert(args.includes('--workers='+workers));
 assert(args.includes('--max-failures='+
  (name==='navigation-smoke'?1:5)));
}
const config=read('tools/browser-tests/playwright.config.js');
assert.match(config,/retries:\s*0\b/,'Automatic whole-test retries must remain disabled');
assert.match(config,/maxFailures:\s*5\b/,'Default regression error budget changed');
const helper=read('tools/browser-tests/specs/helpers.js');
for(const name of ['openSpeciesSearch','openStories','openJournal','openEggPlanning','openEvolution','backToHub','closeHubModal'])
 assert.match(helper,new RegExp('async function '+name+'\\('),'Missing navigation contract: '+name);
assert(!helper.includes('TPAppMenu.show('),'Shared navigation must not bypass visible controls');
let count=0;
for(const file of fs.readdirSync(path.join(root,'tools/browser-tests/specs')).filter(x=>x.endsWith('.spec.js'))){
 const source=read('tools/browser-tests/specs/'+file);count++;
 assert(!/getByRole\(\s*['"]button['"]\s*,\s*\{\s*name:\s*['"]Pokédex['"]/.test(source),file+': obsolete direct Pokedex entry');
 assert(!/getByRole\(\s*['"]button['"]\s*,\s*\{\s*name:\s*['"]Störungen untersuchen['"]/.test(source),file+': obsolete introduction label');
}
assert.match(read('browser_ver/web/stories-ui.js'),/!entry\.available\|\|entry\.done/,'Completed story must remain disabled');
console.log('Review contract preflight passed: '+count+' browser spec files scanned. Static checks do not replace browser execution.');
