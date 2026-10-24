const assert=require("node:assert/strict"),fs=require("node:fs");
const css=fs.readFileSync("browser_ver/web/app-theme.css","utf8"),index=fs.readFileSync("browser_ver/web/index.html","utf8"),sw=fs.readFileSync("browser_ver/web/sw.js","utf8");
assert.equal(index.split('href="app-theme.css"').length-1,1);assert(index.indexOf('href="app-theme.css"')>index.indexOf('href="app-menu.css"'));assert(sw.includes('"./app-theme.css"'));
for(const text of ["--tp-page:#f7efe6","--tp-card:#fff",".tp-modal-head h2",".tp-panel button",".tp-panel .tp-card","input:not([type=checkbox])","color-scheme:light","min-height:44px",".tp-app-danger button"])assert(css.includes(text),text);
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
console.log("C5 theme wiring and shared page/control style checks passed; visual browser check still required.");
