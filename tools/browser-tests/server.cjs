const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
function makeServer(root){
 root=fs.realpathSync(root);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.wasm':'application/wasm','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
 return http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let file;
  try{
   const url=new URL(req.url,'http://127.0.0.1'),name=decodeURIComponent(url.pathname);
   if(name.includes(String.fromCharCode(0))||name.includes(String.fromCharCode(92))||name.split('/').some(p=>p.startsWith('.')))throw Error('Blocked path');
   file=path.resolve(root,'.'+name);if(file!==root&&!file.startsWith(root+path.sep))throw Error('Outside root');
   if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');file=fs.realpathSync(file);
   if(!file.startsWith(root+path.sep)||!fs.statSync(file).isFile())throw Error('Not a file');
  }catch(_e){res.writeHead(404);res.end();return;}
  const stat=fs.statSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache'});
  if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
 });
}
module.exports={makeServer};
if(require.main===module){
 const args=process.argv.slice(2),opts={};while(args.length){const key=args.shift();if(!['--root','--port'].includes(key)||!args.length)throw Error('Invalid server arguments');opts[key]=args.shift();}
 const port=Number(opts['--port']||8765);if(!Number.isInteger(port)||port<0||port>65535)throw Error('Invalid port');
 const server=makeServer(opts['--root']||'browser_ver/web');server.listen(port,'127.0.0.1',()=>console.log('Local test server: '+server.address().port));server.on('error',e=>{console.error(e.message);process.exit(1);});
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
}
