const assert=require('node:assert/strict'),fs=require('node:fs');
const main=fs.readFileSync('.github/workflows/build-browser.yml','utf8'),gate=fs.readFileSync('.github/workflows/quality-gate.yml','utf8'),runner=fs.readFileSync('tools/quality/run-all.sh','utf8');
assert(main.includes('uses: ./.github/workflows/quality-gate.yml'));const a=main.indexOf('  web:\n'),b=main.indexOf('  android:\n',a);assert(a>=0&&b>a);const web=main.slice(a,b);assert(web.includes('needs: quality'));assert(web.includes('name: iTamaPoke-D1-Test'));assert(main.includes('needs: [web, android]'));assert(!gate.includes('continue-on-error'));
assert(gate.indexOf('name: Browserpruefungen')<gate.indexOf('name: Nur erfolgreich geprueften Webstand bereitstellen'));
for(const name of ['package-a.test.js','package-b.test.js','package-c1-ui.test.js','package-c2-ui.test.js','package-c3.test.js','package-c4-ui.test.js','package-c5-ui.test.js','package-c5-theme.test.js','package-c4.cpp','package-c5.cpp'])assert(runner.includes(name),name);
const pkg=JSON.parse(fs.readFileSync('tools/browser-tests/package.json','utf8'));assert.equal(pkg.devDependencies['@playwright/test'],'1.64.1');assert.equal(pkg.overrides.playwright,'1.64.1');assert.equal(pkg.overrides['playwright-core'],'1.64.1');
console.log('D1 gate wiring passed: shared tests, no failure bypass, exact tested artifact reused for publishing.');
