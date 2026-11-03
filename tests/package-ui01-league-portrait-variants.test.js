
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const vm=require('node:vm'),crypto=require('node:crypto');
const source=fs.readFileSync('browser_ver/web/league-kanto.js','utf8');
function extract(name){
 const expression=new RegExp('function\\s+'+name+'\\s*\\([^)]*\\)\\s*\\{');
 const match=expression.exec(source);assert(match);
 const opening=source.indexOf('{',match.index);
 let depth=0,quote=null,escaped=false;
 for(let i=opening;i<source.length;i++){
  const char=source[i];
  if(quote){
   if(escaped)escaped=false;
   else if(char==='\\')escaped=true;
   else if(char===quote)quote=null;
   continue;
  }
  if(char==="'"||char==='"'||char==='`')quote=char;
  else if(char==='{')depth++;
  else if(char==='}'&&!--depth)return source.slice(match.index,i+1);
 }
 throw Error('Function end missing: '+name);
}
const original=extract('leaguePagePaintOriginal')
 .replace('function leaguePagePaintOriginal(','function leaguePagePaint(');
assert.equal(
 crypto.createHash('sha256').update(original).digest('hex'),
 "7f728048714678c4dc499c188b195861155d6a735a54a6fbd773dd3c8d30c5f0"
);
const c={Number,Math,Uint8Array};
vm.createContext(c);vm.runInContext(extract('leaguePortraitRect'),c);
const pixels=new Uint8Array(80*80*4);
for(let y=10;y<70;y++)for(let x=20;x<40;x++)
 pixels[(y*80+x)*4+3]=255;
const crop=c.leaguePortraitRect(80,80,pixels);
assert(crop&&crop.y<=10&&crop.h<60);
assert(crop.x>=0&&crop.y>=0&&crop.x+crop.w<=80&&crop.y+crop.h<=80);
assert.equal(c.leaguePortraitRect(80,80,new Uint8Array(80*80*4)),null);
assert.equal(c.leaguePortraitRect(0,1,[]),null);
assert.equal(
 JSON.stringify(c.leaguePortraitRect(1,1,new Uint8Array([0,0,0,255]))),
 JSON.stringify({x:0,y:0,w:1,h:1})
);
console.log('League portrait variants passed: original painter retained byte-for-byte after name normalization; bounded upper crop, padding and empty/invalid fallback. Artistic suitability remains a manual review.');
