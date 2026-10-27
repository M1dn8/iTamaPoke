#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const mode=process.argv[2]||'affected';
const workersRaw=process.env.TP_TEST_WORKERS||(process.env.CI?'1':'2');
if(!/^[12]$/.test(workersRaw)){
 console.error('TP_TEST_WORKERS muss 1 oder 2 sein.');
 process.exit(2);
}
const workers=Number(workersRaw);
const quickSelection=process.argv.slice(3);
if(mode==='quick'&&!quickSelection.length){
 console.error('quick benoetigt eine ausdrueckliche Testauswahl.');
 process.exit(2);
}
if(!['quick','preflight','smoke','affected','full','native'].includes(mode)){
 console.error('Usage: node tools/quality/review-check.cjs [quick|preflight|smoke|affected|full|native]');process.exit(2);
}
const log=fs.mkdtempSync(path.join(os.tmpdir(),'itamapoke-review-'));
const manifest={mode,workers,node:process.version,started:new Date().toISOString(),stages:[],status:'running'};
const hash=file=>fs.existsSync(file)?crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'):null;
function sourceFingerprint(){
 const rows=[];
 const exclude=new Set(['node_modules','.git','test-results','playwright-report','coverage']);
 function walk(dir){
  if(!fs.existsSync(dir))return;
  for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
   if(exclude.has(item.name))continue;
   const full=path.join(dir,item.name);
   if(item.isDirectory())walk(full);
   else if(/\.(?:js|cjs|mjs|ts|json|css|html|cpp|h|inc|py|sh|wasm)$/.test(item.name))
    rows.push([path.relative(root,full),hash(full)]);
  }
 }
 for(const dir of ['browser_ver/web','browser_ver/core','upstream-expanded','tests','tools/browser-tests','tools/quality'])walk(path.join(root,dir));
 return crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
}
manifest.sourceFingerprint=sourceFingerprint();
manifest.wasmSha256=hash(path.join(root,'browser_ver/web/tp_core.wasm'));
function save(){fs.writeFileSync(path.join(log,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');}
save();console.log('Pruefprofil:',mode,'Worker:',workers,'\nBerichte:',log);
async function run(name,command,args,env={}){
 console.log('\n=== '+name+' ===');
 const record={name,command:[command,...args],started:new Date().toISOString()};
 manifest.stages.push(record);save();
 const out=fs.createWriteStream(path.join(log,name+'.log'));
 const code=await new Promise(resolve=>{
  const child=spawn(command,args,{cwd:root,env:{...process.env,...env},stdio:['inherit','pipe','pipe']});
  child.stdout.on('data',data=>{process.stdout.write(data);out.write(data);});
  child.stderr.on('data',data=>{process.stderr.write(data);out.write(data);});
  child.on('error',error=>{console.error(error.message);out.write(error.stack+'\n');});
  child.on('close',value=>{out.end();resolve(value===null?1:value);});
 });
 record.code=code;record.finished=new Date().toISOString();save();
 if(code!==0)throw Error(name+' fehlgeschlagen (Exit '+code+').');
}
const cli=path.join(root,'tools/browser-tests/node_modules/@playwright/test/cli.js');
async function browser(name,selection=[],list=false){
 if(!fs.existsSync(cli))throw Error('Lokale Playwright-Installation fehlt; kein automatisches Nachladen.');
 const args=[cli,'test','--config',path.join(root,'tools/browser-tests/playwright.config.js'),...selection,'--retries=0','--workers='+workers,
  '--max-failures='+(name==='navigation-smoke'?1:5)];
 if(list)args.push('--list','--reporter=list');
 else args.push('--reporter=list,json,html','--output='+path.join(log,name+'-artifacts'));
 await run(name,process.execPath,args,{
  PLAYWRIGHT_JSON_OUTPUT_NAME:path.join(log,name+'.json'),
  PLAYWRIGHT_HTML_OUTPUT_DIR:path.join(log,name+'-html'),
  PLAYWRIGHT_HTML_OPEN:'never'
 });
}
async function preflight(){
 await run('diff-check','git',['diff','--check']);
 await run('test-contracts',process.execPath,['tools/quality/test-review-contracts.cjs']);
 await run('menu-renderer',process.execPath,['tests/package-c5-ui.test.js']);
 for(const file of fs.readdirSync(path.join(root,'tools/browser-tests/specs')).filter(x=>x.endsWith('.js')))
  await run('syntax-'+file,process.execPath,['--check','tools/browser-tests/specs/'+file]);
 await run('config-syntax',process.execPath,['--check','tools/browser-tests/playwright.config.js']);
 await browser('test-collection',[],true);
}
(async()=>{
 try{
  if(mode==='native')await run('native-quality','bash',['tools/quality/run-all.sh']);
  else{
   await preflight();
   if(mode!=='preflight'){
    if(!manifest.wasmSha256)throw Error('WASM-Kern fehlt; erst browser_ver/build.sh ausfuehren.');
    if(mode!=='quick')await browser('navigation-smoke',['specs/navigation-smoke.spec.js']);
   }
   if(mode==='quick')await browser('quick',quickSelection);
   if(mode==='affected')await browser('affected',[
    'specs/app.spec.js','specs/dex-raster.spec.js','specs/i18n.spec.js',
    'specs/navigation-polish.spec.js','specs/battle-controls.spec.js',
    'specs/journal-unread.spec.js','specs/stories-overview.spec.js',
    'specs/power-plant-scenes.spec.js','specs/power-plant-game.spec.js',
    'specs/zapdos-encounter.spec.js','specs/zapdos-story.spec.js',
    'specs/offline.spec.js'
   ]);
   if(mode==='full')await browser('full');
  }
  if(sourceFingerprint()!==manifest.sourceFingerprint)
   throw Error('Quellen waehrend des Laufs geaendert; Ergebnis gilt nicht fuer einen einheitlichen Stand.');
  manifest.status='passed';
 }catch(error){manifest.status='failed';manifest.error=error.message;console.error('\n'+error.message);process.exitCode=1;}
 finally{manifest.finished=new Date().toISOString();save();console.log('\nErgebnis:',manifest.status,'\nBerichte:',log);}
})();
