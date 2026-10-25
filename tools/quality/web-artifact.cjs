const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const PRIVATE=/^(p|ps)[0-9]+(-mega(-[a-z]+)?)?\.bin$|^psnd[0-9]+\.|^dexentries_|^thumbs\.bin$|^trainer-(kanto|johto)-.*\.bin$/i;
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
function fail(s){throw Error(s);}
function tree(root){
 root=path.resolve(root);const files=[];
 function walk(dir,rel=''){
  for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
   if(item.name.startsWith('.'))continue;
   const p=path.join(dir,item.name),r=rel?rel+'/'+item.name:item.name;
   if(item.isSymbolicLink())fail('Symlink in web artifact: '+r);
   if(PRIVATE.test(item.name))fail('Private game asset in web artifact: '+r);
   if(item.isDirectory())walk(p,r);else if(item.isFile()){const b=fs.readFileSync(p);files.push({path:r,bytes:b.length,sha256:digest(b)});}else fail('Unsupported file: '+r);
  }
 }
 walk(root);return files.sort((a,b)=>a.path.localeCompare(b.path));
}
function stamp(web,sha){
 if(!/^[a-f0-9]{40}$/.test(sha))fail('Expected full Git SHA');const short=sha.slice(0,12);
 const index=fs.readFileSync(path.join(web,'index.html'),'utf8');const tag=(index.match(/<meta\b[^>]*>/gi)||[]).find(x=>/\bname=["']tp-build["']/i.test(x));
 const content=tag&&tag.match(/\bcontent=["']([^"']+)["']/);if(!content||content[1]!==short)fail('HTML build stamp mismatch');
 const sw=fs.readFileSync(path.join(web,'sw.js'),'utf8').match(/\bconst\s+VERSION\s*=\s*["']([^"']+)["']/);
 if(!sw||sw[1]!==short)fail('Service worker build stamp mismatch');
 if(!fs.readFileSync(path.join(web,'tp_core.js')).length)fail('Missing JS core');
 const wasm=fs.readFileSync(path.join(web,'tp_core.wasm'));if(wasm.length<8||!wasm.subarray(0,8).equals(Buffer.from([0,97,115,109,1,0,0,0])))fail('Missing/invalid WASM core');
}
function lockCheck(pkg,lock){
 const p=JSON.parse(pkg),l=JSON.parse(lock),v=p.devDependencies?.['@playwright/test'];
 if(v!=='1.64.1'||p.overrides?.playwright!==v||p.overrides?.['playwright-core']!==v)fail('Playwright version policy changed');
 if(l.packages?.['']?.devDependencies?.['@playwright/test']!==v)fail('Generated lock belongs to another package definition');return v;
}
function create(web,candidate,lockfile,pkgfile,sha){
 web=path.resolve(web);candidate=path.resolve(candidate);if(candidate===web||candidate.startsWith(web+path.sep))fail('Candidate must be outside web root');
 if(fs.existsSync(candidate))fail('Candidate directory already exists');stamp(web,sha);const files=tree(web),lock=fs.readFileSync(lockfile),pkg=fs.readFileSync(pkgfile);const version=lockCheck(pkg,lock);
 fs.mkdirSync(path.join(candidate,'web'),{recursive:true});fs.mkdirSync(path.join(candidate,'proof'));
 for(const file of files){const dest=path.join(candidate,'web',file.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(web,file.path),dest);}
 fs.writeFileSync(path.join(candidate,'proof','package-lock.json'),lock);
 const manifest={schema:1,commit:sha,playwright:version,packageSha256:digest(pkg),lockSha256:digest(lock),files};
 fs.writeFileSync(path.join(candidate,'proof','manifest.json'),JSON.stringify(manifest,null,2)+'\n');verify(path.join(candidate,'web'),candidate,pkgfile,sha,digest(fs.readFileSync(path.join(candidate,'proof','manifest.json'))));return manifest;
}
function verify(web,candidate,pkgfile,sha,expectedManifestSha){
 const manifestBytes=fs.readFileSync(path.join(candidate,'proof','manifest.json'));if(!/^[a-f0-9]{64}$/.test(expectedManifestSha||'')||digest(manifestBytes)!==expectedManifestSha)fail('Manifest differs from the build job seal');const manifest=JSON.parse(manifestBytes);
 if(manifest.schema!==1||manifest.commit!==sha||manifest.playwright!=='1.64.1')fail('Artifact origin/schema mismatch');
 const pkg=fs.readFileSync(pkgfile),lock=fs.readFileSync(path.join(candidate,'proof','package-lock.json'));
 lockCheck(pkg,lock);if(digest(pkg)!==manifest.packageSha256||digest(lock)!==manifest.lockSha256)fail('Dependency definition/lock mismatch');
 stamp(web,sha);const actual=tree(web);if(JSON.stringify(actual)!==JSON.stringify(manifest.files))fail('Web artifact changed: file set/size/hash mismatch');return manifest;
}
function cli(args){const mode=args.shift(),opts={};while(args.length){const key=args.shift();if(!key?.startsWith('--')||!args.length)fail('Invalid arguments');opts[key.slice(2)]=args.shift();}for(const key of ['web','candidate','package','sha'])if(!opts[key])fail('Missing --'+key);
 const m=mode==='create'?create(opts.web,opts.candidate,opts.lock||fail('Missing --lock'),opts.package,opts.sha):mode==='verify'?verify(opts.web,opts.candidate,opts.package,opts.sha,opts['manifest-sha']):fail('Unknown mode');console.log(mode+': '+m.files.length+' exact web files, commit '+m.commit);}
module.exports={tree,create,verify};if(require.main===module){try{cli(process.argv.slice(2));}catch(e){console.error(e.message);process.exit(1);}}
