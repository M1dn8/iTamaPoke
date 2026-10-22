const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),{performance}=require('node:perf_hooks');
const args=process.argv.slice(2);
if(args[0]==='--summary'){
 const file=args[1];if(!file||!fs.existsSync(file)){console.log('No completed timing records.');process.exit(0);}
 const rows=JSON.parse(fs.readFileSync(file,'utf8'));console.log('| Schritt | Sekunden | Exit |\n|---|---:|---:|');for(const r of rows)console.log(`| ${r.label} | ${(r.ms/1000).toFixed(2)} | ${r.exit} |`);
}else{
 const file=args.shift(),label=args.shift();let cwd=process.cwd();if(args[0]==='--cwd'){args.shift();cwd=path.resolve(args.shift());}
 if(!file||!/^[a-z0-9-]{1,40}$/.test(label||'')||args.shift()!=='--'||!args.length){console.error('Usage: timed-run FILE LABEL [--cwd DIR] -- COMMAND ARGS');process.exit(2);}
 const start=performance.now(),r=cp.spawnSync(args[0],args.slice(1),{cwd,stdio:'inherit',env:process.env}),exit=r.status===null?1:r.status;
 const row={label,ms:Math.round((performance.now()-start)*1000)/1000,exit,signal:r.signal||null};if(r.error)console.error(r.error.message);
 const records=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):[];records.push(row);fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});const temp=file+'.'+process.pid+'.tmp';fs.writeFileSync(temp,JSON.stringify(records,null,2)+'\n');fs.renameSync(temp,file);
 console.log(`CI-Zeit ${label}: ${(row.ms/1000).toFixed(2)} s, Exit ${exit}`);process.exit(exit);
}
