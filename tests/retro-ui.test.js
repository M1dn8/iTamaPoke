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
assert(!css.includes('system-ui'));assert(!/@import|url\(/i.test(css));
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
console.log('Retro UI: original canvas palette, shared controls and local-only typography passed.');
