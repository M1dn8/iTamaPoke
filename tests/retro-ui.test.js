const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const css=fs.readFileSync('browser_ver/web/app-theme.css','utf8');
const source=fs.readFileSync('browser_ver/web/main.js','utf8');
const palette=source.slice(source.indexOf('const rgb565'),source.indexOf('// Same four buttons'));
const context={};vm.createContext(context);vm.runInContext(palette+';globalThis.palette=UI;',context);
function hex(rgb){return '#'+rgb.match(/\d+/g).map(n=>Number(n).toString(16).padStart(2,'0')).join('');}
for(const [token,key] of [['page','bgDay'],['ink','ink'],['track','track']]){
 const value=/--tp-PLACE:([^;\s}]+)/.source.replace('PLACE',token);
 assert.equal(css.match(new RegExp(value))[1],hex(context.palette[key]),token+' must match canvas UI');
}
for(const text of ['--tp-font:monospace','.tp-box-page button','.tp-rights-card',
 ':focus-visible',':disabled',':active','input[type=checkbox]:checked::after',
 'input[type=radio]:checked::after','progress::-webkit-progress-value',
 'progress::-moz-progress-bar','min-height:44px'])assert(css.includes(text),text);
assert(!css.includes('system-ui'));(() => {
 // Accepted P07a journey decoration: exactly one pinned, inline SVG rule.
 // No general data-URL exception; imports and all additional URLs stay forbidden.
 const selector='#tp-story-stage[data-story="suicune"] .tp-story-card[data-journey="true"] .tp-story-card-body';
 const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const pattern=new RegExp(escaped+'\\{[^{}]*\\}','g');
 const sha=value=>require('node:crypto').createHash('sha256').update(value).digest('hex');
 function checkLocalTheme(value){
  const rules=[...value.matchAll(pattern)];
  assert.equal(rules.length,1,'Expected one accepted journey decoration');
  assert.equal(sha(rules[0][0]),'5f37ea9935ba964b7dcf71a5a89eb8ed71c3f5f0f93af9fe2b12fcba2b43dec4','Journey decoration changed: review required');
  const rest=value.slice(0,rules[0].index)+value.slice(rules[0].index+rules[0][0].length);
  assert(!/@import|url\(/i.test(rest),'Unexpected CSS import or URL');
 }
 checkLocalTheme(css);
 assert.throws(()=>checkLocalTheme(css+'\n@import "https://example.invalid/style.css";'));
 assert.throws(()=>checkLocalTheme(css+'\n.bad{background:url("https://example.invalid/a.svg")}'));
 assert.throws(()=>checkLocalTheme(css+'\n.bad{background:url("data:image/svg+xml,unreviewed")}'));
 assert.throws(()=>checkLocalTheme(css.replace('data:image/svg+xml;charset=utf-8,','https://example.invalid/')));
})();
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
console.log('Retro UI: original canvas palette, shared controls and local-only typography passed.');
