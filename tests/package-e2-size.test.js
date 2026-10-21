const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../browser_ver/web/storage-tools.js');
const source=fs.readFileSync('browser_ver/web/sprites.js','utf8');
const context={TPStoreTools:T,console,Uint8Array,ArrayBuffer,Map,Set};context.window=context;vm.createContext(context);vm.runInContext(source,context);
function legacy(sprite,a,maxS=5){const idleH=sprite.actions[0]?sprite.actions[0].h:0;let s=idleH>0?Math.floor(170/idleH):maxS;s=Math.min(Math.max(s,2),maxS);while(s>2&&a.h*s>250)s--;return s;}
function actor(h,form){const actions=new Array(12).fill(null);actions[0]={w:146,h,base:h-1};const s={actions};if(form!==undefined)Object.defineProperty(s,'_tpMegaForm',{value:form});return s;}
for(const height of [1,20,40,48,56,64,96,118,255])for(const actionH of [1,40,96,180,255])for(const maxS of [2,3,4,5])for(const form of [undefined,0,1,3]){const sprite=actor(height,form),a={h:actionH};assert.equal(context.spriteScale(sprite,a,maxS),legacy(sprite,a,maxS),'normal/other form changed');}
const meta=actor(118,2),idle=meta.actions[0];assert.equal(context.spriteScale(meta,idle),1.5);assert.equal(idle.w*context.spriteScale(meta,idle),219);assert.equal(idle.h*context.spriteScale(meta,idle),177);
for(const ground of [206,286,340,394]){const scale=context.spriteScale(meta,idle),y=ground-idle.base*scale;assert.equal(y+idle.base*scale,ground);}
function fixture(){const pixels=Buffer.alloc(146*118,255);pixels[116*146+73]=0;return Buffer.concat([Buffer.from([84,80,75,50,1,1,0,0,0,0,146,118,1,90,0]),pixels]);}
(async()=>{
 const bytes=fixture();const requested=[];context.loadSpriteAsset=async name=>{requested.push(name);return bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);};
 const normal=context.parseTPK2(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));assert.equal(normal._tpMegaForm,undefined);assert.equal(context.spriteScale(normal,normal.actions[0]),2);
 const glurak=await context.loadMegaSprite(false,1);assert.equal(glurak._tpMegaForm,1);assert.equal(context.spriteScale(glurak,glurak.actions[0]),2);
 for(const shiny of [false,true]){const loaded=await context.loadMegaSprite(shiny,2);assert.equal(loaded._tpMegaForm,2);assert.equal(context.spriteScale(loaded,loaded.actions[0]),1.5);const d=Object.getOwnPropertyDescriptor(loaded,'_tpMegaForm');assert.equal(d.enumerable,false);assert.equal(d.writable,false);}
 assert.deepEqual(requested,['p006-mega-x.bin','p376-mega.bin','ps376-mega.bin']);
 // Expiry outside a running fight cannot change the loaded battle snapshot's size.
 context.TPMega={active:()=>false};assert.equal(context.spriteScale(meta,idle),1.5);assert.equal(context.spriteScale(normal,normal.actions[0]),2);
 // Actual drawPet uses the same helper and keeps its centre/ground anchor.
 const main=fs.readFileSync('browser_ver/web/main.js','utf8'),a=main.indexOf('function drawPet(ink)'),b=main.indexOf('function drawEgg(',a);assert(a>=0&&b>a);
 const draws=[];context.ctx={drawImage(...args){draws.push(args);}};context.TP={cx:233,petGround:340};context.petPose={act:0,elapsedMs:0,loop:true,x:233,yOffset:0};context.frameCanvas={};context.frameCtx={putImageData(){}};context.frameImageData=()=>({});context.frameIndexAt=()=>0;context.spriteHas=(sprite,id)=>!!sprite.actions[id];
 vm.runInContext(main.slice(a,b),context);context.currentSprite=meta;context.drawPet('#000');let out=draws.pop();assert.equal(out[3],219);assert.equal(out[4],177);assert.equal(out[1]+out[3]/2,233);assert.equal(out[2]+idle.base*1.5,340);
 context.currentSprite=normal;context.drawPet('#000');out=draws.pop();assert.equal(out[3],292);assert.equal(out[4],236);
 assert.equal(normal.blob.length,bytes.length);assert.equal(normal._tpMegaForm,undefined);
 console.log('E2 display size passed: only loaded Mega-Metagross normal/shiny is 75%; normals/other forms unchanged; real drawPet keeps centre/ground; cache tags immutable and no live-state dependency.');
})().catch(e=>{console.error(e);process.exit(1);});
