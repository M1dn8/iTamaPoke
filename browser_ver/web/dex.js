// Pokedex grid + detail, ported from PetScreen.swift's renderGalleryGrid/
// renderGalleryDetail. TPThumbs' own sprite-atlas thumbnails aren't ported
// (that's a separate packed-atlas format this build doesn't parse); grid
// tiles instead reuse whatever full TPK2 sprite the user already picked
// locally for that species (see dexThumbFor below), falling back to the
// dex number for anything not picked yet.

// Was a second cache+in-flight-guard of its own; that's sprites.js's
// spriteFor() now, shared with the wild-battle opponent so there's one
// copy of the "sync peek, lazy load, don't refire" rule rather than two
// that can drift.
function dexThumbFor(dex) {
  return spriteFor(dex, false);
}

// Static idle-pose frame at a fixed box size -- grid thumbnails don't
// animate (16 of them redrawn every frame is enough cost already).
function drawDexThumb(sprite, x, y, box) {
  const a = sprite.actions[TPAct.idle];
  if (!a) return;
  const img = frameImageData(sprite, TPAct.idle, 0);
  if (!img) return;
  const s = Math.min(box / a.w, box / a.h);
  const w = a.w * s, h = a.h * s;
  frameCanvas.width = a.w; frameCanvas.height = a.h;
  frameCtx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameCanvas, x + (box - w) / 2, y + (box - h) / 2, w, h);
}

// The detail view's portrait plays the idle cycle, as the iOS detail
// view's sprite does; only the grid tiles stay static.
function drawDexPortrait(sprite, x, y, box, now) {
  const a = sprite.actions[TPAct.idle];
  if (!a) return;
  const frame = frameIndexAt(a, now, true);
  const img = frameImageData(sprite, TPAct.idle, frame);
  if (!img) return;
  const s = Math.min(box / a.w, box / a.h);
  const w = a.w * s, h = a.h * s;
  frameCanvas.width = a.w; frameCanvas.height = a.h;
  frameCtx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameCanvas, x + (box - w) / 2, y + (box - h) / 2, w, h);
}

const TYPE_COLORS = {
  1: "#a8a878", 2: "#f08030", 3: "#6890f0", 4: "#f8d030", 5: "#78c850",
  6: "#98d8d8", 7: "#c03028", 8: "#a040a0", 9: "#e0c068", 10: "#a890f0",
  11: "#f85888", 12: "#a8b820", 13: "#b8a038", 14: "#705898", 15: "#7038f8",
  16: "#705848", 17: "#b8b8d0", 18: "#ee99ac",
};

let dexScreen = "grid"; // grid | detail
let dexFilter = 0;      // 0 all, 1 raised, 2 caught
let dexPage = 0;
let dexDetailDex = 0;
let dexDetailPage = 0;  // 0 portrait, 1 dex entry text

function dexVisible(dex) {
  if (dexFilter === 1) return fns.dexRegistered(dex) !== 0;
  if (dexFilter === 2) return fns.dexCaught(dex) !== 0;
  return true;
}

function dexFilteredCount() {
  if (typeof tpComfortDexIds === "function") return tpComfortDexIds().length;
  let n=0;for(let d=1;d<=fns.dexCount();d++)if(dexVisible(d))n++;
  return n;
}

function dexAt(index) {
  if (typeof tpComfortDexIds === "function") return tpComfortDexIds()[index] || 0;
  let i=index;for(let d=1;d<=fns.dexCount();d++)if(dexVisible(d)){if(i--===0)return d;}
  return 0;
}

function dexPageCount() {
  return Math.max(1, Math.ceil(dexFilteredCount() / 16));
}

// Labels from the string table (S_FILTER_ALL / S_RAISED_MARK / S_CAUGHT_MARK),
// same as PetScreen's filter row, so they follow the UI language.
const DEX_FILTER_PILLS = [
  { x: 74, w: 96, label: () => fns.filterAllText() },
  { x: 180, w: 96, label: () => fns.raisedMarkText() },
  { x: 286, w: 96, label: () => fns.caughtMarkText() },
];
const GAL_X = 71, GAL_Y = 96, GAL_CELL = 82;

// D3b: one current filtered list per synchronous raster draw, no new cache.

// UI01 hub Pokedex: presentation only; no collection or discovery writes.
const HUB_DEX_PORTRAIT_SCALE=.65;

// UI01 shared Pokedex design model.
const HUB_DEX_DESIGN=Object.freeze({
 inset:12,toolbarTop:62,panelTop:112,panelBottom:42,
 displayGap:10,pad:4,cellGap:4,menuRowGap:5,
 frameBorder:4,frameRadius:12,displayBorder:2,displayRadius:8,
 spineWidth:6,spineInset:2,spineRadius:2,
 shineOffset:-2,shineInset:6,shineWidth:1,
 shell:"#a83a43",ink:"#292831",display:"#cbdce2",
 spine:"#723039",shine:"#c86b72",title:"#fff5e8"
});
function hubDexDesignTokens(){
 const d=HUB_DEX_DESIGN,px=value=>value+"px";
 return {
  "--tp-pokedex-inset":px(d.inset),
  "--tp-pokedex-toolbar-top":px(d.toolbarTop),
  "--tp-pokedex-panel-top":px(d.panelTop),
  "--tp-pokedex-panel-bottom":px(d.panelBottom),
  "--tp-pokedex-frame-border":px(d.frameBorder),
  "--tp-pokedex-frame-radius":px(d.frameRadius),
  "--tp-pokedex-display-border":px(d.displayBorder),
  "--tp-pokedex-display-radius":px(d.displayRadius),
  "--tp-pokedex-half-gap":px(d.displayGap/2),
  "--tp-pokedex-pad":px(d.pad),
  "--tp-pokedex-column-gap":px(d.displayGap+2*d.pad),
  "--tp-pokedex-menu-row-gap":px(d.menuRowGap),
  "--tp-pokedex-spine-width":px(d.spineWidth),
  "--tp-pokedex-spine-half":px(d.spineWidth/2),
  "--tp-pokedex-spine-inset":px(d.spineInset),
  "--tp-pokedex-spine-radius":px(d.spineRadius),
  "--tp-pokedex-shine-left":px(d.spineWidth/2+d.shineOffset),
  "--tp-pokedex-shine-inset":px(d.shineInset-d.spineInset),
  "--tp-pokedex-shine-width":px(d.shineWidth),
  "--tp-pokedex-shell":d.shell,
  "--tp-pokedex-ink":d.ink,
  "--tp-pokedex-display":d.display,
  "--tp-pokedex-spine":d.spine,
  "--tp-pokedex-shine":d.shine,
  "--tp-pokedex-title":d.title
 };
}
// End UI01 shared Pokedex design model.

const hubDexBoundsCache=new WeakMap();
let hubDexTextRegistered=false;
let hubDexDescriptionKey="",hubDexDescriptionPage=0;
const hubDexTextKeys=[
 "info","text","generation","raised","caught","missing","shiny",
 "noText","unknown","cry","stop"
];
const hubDexLocales={
 en:["Info","Text","Generation {n}","Raised","Caught","Not collected",
  "Shiny discovered","No Pokédex text loaded.","Not discovered yet.","Cry","Stop"],
 de:["Info","Text","Generation {n}","Aufgezogen","Gefangen","Noch nicht erfasst",
  "Schillernd entdeckt","Kein Pokédex-Text geladen.","Noch nicht entdeckt.","Ruf","Stopp"],
 es:["Info","Texto","Generación {n}","Criado","Capturado","No registrado",
  "Variocolor descubierto","No hay texto Pokédex cargado.","Aún no descubierto.","Grito","Parar"],
 fr:["Infos","Texte","Génération {n}","Élevé","Capturé","Non enregistré",
  "Chromatique découvert","Aucun texte Pokédex chargé.","Pas encore découvert.","Cri","Arrêt"]
};

const hubDexEmptyLocales={
 en:{
  emptyTitle:"No entries",
  emptyCaught:"Caught Pokémon will appear here.",
  emptyRaised:"Raised Pokémon will appear here.",
  emptyAll:"New discoveries will appear here.",
  emptySearch:"Adjust your search or filter."
 },
 de:{
  emptyTitle:"Keine Einträge",
  emptyCaught:"Gefangene Pokémon erscheinen hier.",
  emptyRaised:"Aufgezogene Pokémon erscheinen hier.",
  emptyAll:"Neue Entdeckungen erscheinen hier.",
  emptySearch:"Passe Suche oder Filter an."
 },
 es:{
  emptyTitle:"Sin entradas",
  emptyCaught:"Aquí aparecerán los Pokémon capturados.",
  emptyRaised:"Aquí aparecerán los Pokémon criados.",
  emptyAll:"Aquí aparecerán nuevos descubrimientos.",
  emptySearch:"Ajusta la búsqueda o el filtro."
 },
 fr:{
  emptyTitle:"Aucune entrée",
  emptyCaught:"Les Pokémon capturés apparaîtront ici.",
  emptyRaised:"Les Pokémon élevés apparaîtront ici.",
  emptyAll:"Les découvertes apparaîtront ici.",
  emptySearch:"Modifie la recherche ou le filtre."
 }
};

function hubDexText(key,params={}){
 if(!hubDexTextRegistered&&typeof globalThis.TPText?.registerLocale==="function"){
  for(const code of ["en","de","es","fr"])
   TPText.registerLocale(code,Object.fromEntries(
    hubDexTextKeys.map((name,i)=>["dexHub."+name,hubDexLocales[code][i]])
     .concat(Object.entries(hubDexEmptyLocales[code]).map(
      ([name,value])=>["dexHub."+name,value]
     ))
   ));
  hubDexTextRegistered=true;
 }
 const full="dexHub."+key;
 const translated=globalThis.TPText?.t?.(full,params);
 if(typeof translated==="string"&&translated!==full)return translated;
 const code=["es","en","fr","de"][fns.language()]||"en";
 const value=hubDexEmptyLocales[code]?.[key]||
  hubDexLocales[code][hubDexTextKeys.indexOf(key)]||key;
 return value.replace(/\{(\w+)\}/g,(_,name)=>String(params[name]??""));
}

function hubDexLayout(width){
 if(!(width>0))
  width=globalThis.document?.getElementById("tp")?.getBoundingClientRect?.().width||466;
 const d=HUB_DEX_DESIGN,u=466/width;
 const pad=d.pad*u,gap=d.cellGap*u;
 const panel={
  x:d.inset*u,y:d.panelTop*u,
  w:466-2*d.inset*u,h:466-(d.panelTop+d.panelBottom)*u
 };
 const half=(panel.w-d.displayGap*u)/2;
 const displays=[
  {x:panel.x,y:panel.y,w:half,h:panel.h},
  {x:panel.x+half+d.displayGap*u,y:panel.y,w:half,h:panel.h}
 ];
 const filterWidth=(panel.w-2*pad-2*gap)/3;
 const filters=Array.from({length:3},(_,i)=>({
  x:panel.x+pad+i*(filterWidth+gap),
  y:d.toolbarTop*u,w:filterWidth,h:26*u
 }));
 const cellW=(half-2*pad-gap)/2;
 const cellH=(panel.h-2*pad-3*gap)/4;
 const cells=Array.from({length:16},(_,i)=>{
  const side=Math.floor(i/8),local=i%8;
  return {
   x:displays[side].x+pad+(local%2)*(cellW+gap),
   y:panel.y+pad+Math.floor(local/2)*(cellH+gap),
   w:cellW,h:cellH
  };
 });
 const navY=466-36*u;
 const previous={x:panel.x+pad,y:navY,w:30*u,h:24*u};
 const next={x:panel.x+panel.w-pad-30*u,y:navY,w:30*u,h:24*u};
 const left={
  x:displays[0].x+pad,y:panel.y+pad,
  w:half-2*pad,h:panel.h-2*pad
 };
 const right={x:displays[1].x+pad,y:left.y,w:left.w,h:left.h};
 const tabs=[
  {x:right.x,y:right.y+right.h-26*u,w:(right.w-gap)/2,h:26*u},
  {x:right.x+(right.w+gap)/2,y:right.y+right.h-26*u,w:(right.w-gap)/2,h:26*u}
 ];
 const entryY=left.y+left.h-26*u;
 const detailPrevious=previous;
 const detailNext=next;
 const cry={x:left.x,y:entryY,w:left.w,h:26*u};
 const artBase={
  x:left.x,y:left.y+67*u,w:left.w,
  h:Math.max(20*u,entryY-left.y-73*u)
 };
 const portraitInset=(1-HUB_DEX_PORTRAIT_SCALE)/2;
 const art={
  x:artBase.x+artBase.w*portraitInset,
  y:artBase.y+artBase.h*portraitInset,
  w:artBase.w*HUB_DEX_PORTRAIT_SCALE,
  h:artBase.h*HUB_DEX_PORTRAIT_SCALE
 };
 const textPrevious={x:right.x,y:tabs[0].y-27*u,w:26*u,h:22*u};
 const textNext={x:right.x+right.w-26*u,y:textPrevious.y,w:26*u,h:22*u};
 return {
  u,pad,gap,panel,displays,filters,cells,previous,next,
  left,right,tabs,cry,detailPrevious,detailNext,artBase,art,
  textPrevious,textNext
 };
}
function hubDexHit(r,x,y){
 return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;
}
function hubDexBounds(image){
 if(!image||!image.data||!image.width||!image.height)return null;
 if(hubDexBoundsCache.has(image))return hubDexBoundsCache.get(image);
 let left=image.width,top=image.height,right=-1,bottom=-1;
 for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
  if(image.data[(y*image.width+x)*4+3]){
   left=Math.min(left,x);right=Math.max(right,x);
   top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
 }
 const bounds=right<left?null:{x:left,y:top,w:right-left+1,h:bottom-top+1};
 hubDexBoundsCache.set(image,bounds);
 return bounds;
}
function hubDexImagePlacement(image,box){
 const b=hubDexBounds(image);if(!b)return null;
 const scale=Math.min(box.w/b.w,box.h/b.h);
 return {
  sx:b.x,sy:b.y,sw:b.w,sh:b.h,
  x:box.x+(box.w-b.w*scale)/2,
  y:box.y+(box.h-b.h*scale)/2,
  w:b.w*scale,h:b.h*scale
 };
}
function hubDexImage(dex,known,animated=false){
 if(animated&&known){
  const sprite=dexThumbFor(dex),a=sprite?.actions?.[TPAct.idle];
  if(a){
   const image=frameImageData(sprite,TPAct.idle,frameIndexAt(a,performance.now(),true));
   if(image)return image;
  }
 }
 if(typeof thumbImageData==="function"){
  const atlas=thumbImageData(dex,!known);
  if(atlas?.data)return atlas.data;
 }
 if(known){
  const sprite=dexThumbFor(dex);
  if(sprite?.actions?.[TPAct.idle])return frameImageData(sprite,TPAct.idle,0);
 }
 return null;
}
function hubDexPaintImage(image,box){
 const p=hubDexImagePlacement(image,box);if(!p)return false;
 frameCanvas.width=image.width;frameCanvas.height=image.height;
 frameCtx.putImageData(image,0,0);ctx.imageSmoothingEnabled=false;
 ctx.drawImage(frameCanvas,p.sx,p.sy,p.sw,p.sh,p.x,p.y,p.w,p.h);
 return true;
}
function hubDexLabel(text,x,y,w,g,size=12,bold=false,align="center"){
 ctx.textAlign=align;ctx.textBaseline="middle";
 ctx.font=(bold?"bold ":"")+(size*g.u)+"px monospace";
 ctx.fillText(String(text),x,y,w);
}
function hubDexBox(r,g,fill="#f6f9fa"){
 ctx.fillStyle=fill;ctx.strokeStyle="#292831";ctx.lineWidth=1.5*g.u;
 roundRect(r.x,r.y,r.w,r.h,5*g.u);ctx.fill();ctx.stroke();
}
function hubDexButton(r,label,g,selected=false,disabled=false){
 hubDexBox(r,g,disabled?"#b9c7cd":selected?"#315b83":"#f6f9fa");
 ctx.fillStyle=disabled?"#74838a":selected?"#fff":"#292831";
 hubDexLabel(label,r.x+r.w/2,r.y+r.h/2,r.w-6*g.u,g,10,true);
}


function hubDexFrame(g){
 const d=HUB_DEX_DESIGN,b=d.frameBorder*g.u;
 ctx.fillStyle=d.shell;ctx.fillRect(0,0,466,466);
 ctx.strokeStyle=d.ink;ctx.lineWidth=b;
 roundRect(b/2,b/2,466-b,466-b,(d.frameRadius-d.frameBorder/2)*g.u);
 ctx.stroke();
 const line=d.displayBorder*g.u;
 ctx.lineWidth=line;
 for(const display of g.displays){
  ctx.fillStyle=d.display;ctx.strokeStyle=d.ink;
  roundRect(
   display.x+line/2,display.y+line/2,
   display.w-line,display.h-line,
   (d.displayRadius-d.displayBorder/2)*g.u
  );
  ctx.fill();ctx.stroke();
 }
 const x=g.panel.x+g.panel.w/2;
 ctx.fillStyle=d.spine;
 roundRect(
  x-d.spineWidth*g.u/2,g.panel.y+d.spineInset*g.u,
  d.spineWidth*g.u,g.panel.h-2*d.spineInset*g.u,d.spineRadius*g.u
 );
 ctx.fill();
 ctx.fillStyle=d.shine;
 ctx.fillRect(
  x+d.shineOffset*g.u,g.panel.y+d.shineInset*g.u,
  d.shineWidth*g.u,g.panel.h-2*d.shineInset*g.u
 );
}
function hubDexState(dex){
 const raised=fns.dexRegistered(dex)!==0,caught=fns.dexCaught(dex)!==0;
 return {raised,caught,known:!!dexLookupMode||raised||caught,shiny:fns.dexShiny(dex)!==0};
}
function hubDexStatus(text){
 if(statusEl.textContent!==text)statusEl.textContent=text;
}

function hubDexEmptyLines(text,width,g){
 ctx.font=(11*g.u)+"px monospace";
 const lines=[];let line="";
 for(const word of String(text).split(/\s+/)){
  const next=line?line+" "+word:word;
  if(line&&ctx.measureText(next).width>width){
   lines.push(line);line=word;
  }else line=next;
 }
 if(line)lines.push(line);
 return lines;
}
function hubDexDrawEmpty(g){
 const searched=typeof tpDexFilter!=="undefined"&&(
  !!String(tpDexFilter.query||"").trim()||
  !!tpDexFilter.gen||!!tpDexFilter.type||
  !!tpDexFilter.status&&tpDexFilter.status!=="all"
 );
 const message=hubDexText(searched?"emptySearch":
  dexFilter===2?"emptyCaught":dexFilter===1?"emptyRaised":"emptyAll");

 for(let side=0;side<2;side++){
  const display=g.displays[side],cx=display.x+display.w/2;
  ctx.save();
  try{
   // Keep every part of this message inside its own display.
   ctx.beginPath();
   ctx.rect(
    display.x+2*g.u,display.y+2*g.u,
    display.w-4*g.u,display.h-4*g.u
   );
   ctx.clip();

   const width=display.w-16*g.u;
   const lines=hubDexEmptyLines(
    side===0?hubDexText("emptyTitle"):message,width,g
   );
   const middle=display.y+display.h/2;

   if(side===0){
    const iconY=middle-22*g.u;
    ctx.fillStyle="#e7f0f4";ctx.strokeStyle="#315b83";
    ctx.lineWidth=1.5*g.u;
    roundRect(cx-14*g.u,iconY-10*g.u,28*g.u,20*g.u,3*g.u);
    ctx.fill();ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx-7*g.u,iconY);
    ctx.lineTo(cx+7*g.u,iconY);
    ctx.stroke();
   }

   const start=side===0?
    middle+13*g.u-(lines.length-1)*7.5*g.u:
    middle-(lines.length-1)*7.5*g.u;
   ctx.fillStyle="#315b83";
   lines.forEach((line,i)=>hubDexLabel(
    line,cx,start+i*15*g.u,width,g,11,side===0
   ));
  }finally{ctx.restore();}
 }
}

function drawHubDexGrid(){
 const g=hubDexLayout(),snapshot=dexGridSnapshot();
 if(dexPage>=snapshot.pages)dexPage=0;
 ctx.save();
 try{
  hubDexFrame(g);
  g.filters.forEach((r,i)=>hubDexButton(r,DEX_FILTER_PILLS[i].label(),g,i===dexFilter));
  g.cells.forEach((r,i)=>{
   const dex=snapshot.ids[dexPage*16+i];if(!dex)return;
   const state=hubDexState(dex);
   hubDexBox(r,g,state.known?"#f6f9fa":"#b9ccd4");
   const box={x:r.x+2*g.u,y:r.y+2*g.u,w:r.w-4*g.u,h:r.h-4*g.u};
   if(!hubDexPaintImage(hubDexImage(dex,state.known),box)){
    ctx.fillStyle="#292831";
    hubDexLabel(state.known?"#"+dex:"?",r.x+r.w/2,r.y+r.h/2,r.w-4*g.u,g,13,true);
   }
   if(state.shiny||state.caught&&!state.raised){
    ctx.fillStyle="#866033";
    hubDexLabel(state.shiny?"*":"C",r.x+r.w-6*g.u,r.y+7*g.u,10*g.u,g,9,true);
   }
  });
  if(!snapshot.ids.length)hubDexDrawEmpty(g);
  const singlePage=snapshot.pages<=1;
  hubDexButton(g.previous,"<",g,false,singlePage);
  hubDexButton(g.next,">",g,false,singlePage);
  ctx.fillStyle="#292831";
  hubDexLabel((dexPage+1)+" / "+snapshot.pages,233,
   g.previous.y+6*g.u,g.panel.w-90*g.u,g,10,true);
  hubDexLabel(fns.raisedCaughtLine(),233,
   g.previous.y+18*g.u,g.panel.w-90*g.u,g,9);
  hubDexStatus(TPText.status(
   "Dex · page "+(dexPage+1)+"/"+snapshot.pages+
   " · filter "+DEX_FILTER_PILLS[dexFilter].label()
  ));
 }finally{ctx.restore();}
}
function hubDexGridTap(x,y){
 const g=hubDexLayout();
 for(let i=0;i<3;i++)if(hubDexHit(g.filters[i],x,y)){
  dexFilter=i;dexPage=0;return;
 }
 for(let i=0;i<16;i++)if(hubDexHit(g.cells[i],x,y)){
  const dex=dexAt(dexPage*16+i);
  if(dex>0){dexDetailDex=dex;dexDetailPage=0;dexScreen="detail";}
  return;
 }
 const pages=dexPageCount();
 if(hubDexHit(g.previous,x,y))dexPage=(dexPage-1+pages)%pages;
 else if(hubDexHit(g.next,x,y))dexPage=(dexPage+1)%pages;
}
function hubDexWrap(text,width,g,size=11){
 ctx.font=(size*g.u)+"px monospace";
 const lines=[];let line="";
 for(const char of String(text).replace(/\s+/g," ").trim()){
  if(line&&ctx.measureText(line+char).width>width){
   lines.push(line.trimEnd());line=char.trimStart();
  }else line+=char;
 }
 if(line)lines.push(line.trimEnd());
 return lines;
}
function hubDexDescription(dex,known,g){
 const text=known?(dexEntryFor(dex)||hubDexText("noText")):hubDexText("unknown");
 const key=dex+"|"+fns.language()+"|"+text;
 if(key!==hubDexDescriptionKey){hubDexDescriptionKey=key;hubDexDescriptionPage=0;}
 const lineHeight=15*g.u;
 const available=g.textPrevious.y-(g.right.y+27*g.u)-5*g.u;
 const perPage=Math.max(1,Math.floor(available/lineHeight));
 const lines=hubDexWrap(text,g.right.w,g);
 const pages=Math.max(1,Math.ceil(lines.length/perPage));
 hubDexDescriptionPage=Math.min(hubDexDescriptionPage,pages-1);
 return {lines,pages,perPage,lineHeight};
}

function hubDexDetailNavigation(){
 const ids=dexGridSnapshot().ids;
 const index=ids.indexOf(dexDetailDex);
 return {
  ids,index,
  canPrevious:index>0,
  canNext:index>=0&&index<ids.length-1
 };
}
function hubDexMoveDetail(direction){
 if(direction!==-1&&direction!==1)return false;
 const navigation=hubDexDetailNavigation();
 const index=navigation.index+direction;
 if(navigation.index<0||index<0||index>=navigation.ids.length)return false;
 if(typeof stopCry==="function")stopCry();
 dexDetailDex=navigation.ids[index];
 dexDetailPage=0;
 dexPage=Math.floor(index/16);
 hubDexDescriptionKey="";
 hubDexDescriptionPage=0;
 return true;
}

function drawHubDexDetail(){
 const g=hubDexLayout(),dex=dexDetailDex,state=hubDexState(dex);
 ctx.save();
 try{
  hubDexFrame(g,true);
  const l=g.left,r=g.right,u=g.u;
  ctx.fillStyle="#5d5960";
  hubDexLabel("#"+String(dex).padStart(3,"0"),l.x+l.w/2,l.y+8*u,l.w,g,10);
  ctx.fillStyle="#292831";
  hubDexLabel(state.known?fns.dexName(dex):"???",
   l.x+l.w/2,l.y+28*u,l.w,g,12,true);
  if(state.known){
   const types=[fns.dexType1(dex),fns.dexType2(dex)].filter(Boolean);
   const chipWidth=(l.w-4*u*(types.length-1))/types.length;
   types.forEach((type,i)=>{
    const chip={x:l.x+i*(chipWidth+4*u),y:l.y+41*u,w:chipWidth,h:18*u};
    hubDexBox(chip,g,TYPE_COLORS[type]||"#cbdce2");
    ctx.fillStyle="#292831";
    hubDexLabel(TYPE_NAMES[type]||"?",chip.x+chip.w/2,chip.y+chip.h/2,
     chip.w-4*u,g,9,true);
   });
  }
  const art=g.art;
  if(!hubDexPaintImage(hubDexImage(dex,state.known,true),art)){
   ctx.fillStyle="#5d5960";
   hubDexLabel("?",art.x+art.w/2,art.y+art.h/2,art.w,g,36,true);
  }
  if(state.known&&typeof hasCry==="function"&&hasCry(dex)){
   hubDexButton(g.cry,hubDexText(cryProgress(dex)!==null?"stop":"cry"),g);
  }
  const entryNavigation=hubDexDetailNavigation();
  hubDexButton(g.detailPrevious,"<",g,false,!entryNavigation.canPrevious);
  hubDexButton(g.detailNext,">",g,false,!entryNavigation.canNext);
  ctx.fillStyle="#292831";
  hubDexLabel(hubDexText(dexDetailPage?"text":"info"),
   r.x+r.w/2,r.y+9*u,r.w,g,12,true);
  if(dexDetailPage===0){
   const meta=typeof TP_DEX_META!=="undefined"?TP_DEX_META[dex-1]:null;
   const values=state.known?[
    meta?.gen?hubDexText("generation",{n:meta.gen}):"",
    state.raised?hubDexText("raised"):"",
    state.caught?hubDexText("caught"):"",
    !state.raised&&!state.caught?hubDexText("missing"):"",
    state.shiny?hubDexText("shiny"):""
   ].filter(Boolean):[hubDexText("unknown")];
   let y=r.y+35*u;
   for(const value of values){
    for(const line of hubDexWrap(value,r.w,g)){
     hubDexLabel(line,r.x,y,r.w,g,11,false,"left");y+=15*u;
    }
    y+=7*u;
   }
  }else{
   const description=hubDexDescription(dex,state.known,g);
   const lines=description.lines.slice(
    hubDexDescriptionPage*description.perPage,
    (hubDexDescriptionPage+1)*description.perPage
   );
   lines.forEach((line,i)=>hubDexLabel(
    line,r.x,r.y+28*u+i*description.lineHeight,r.w,g,11,false,"left"
   ));
   if(description.pages>1){
    hubDexButton(g.textPrevious,"<",g);
    hubDexButton(g.textNext,">",g);
    ctx.fillStyle="#292831";
    hubDexLabel((hubDexDescriptionPage+1)+"/"+description.pages,
     r.x+r.w/2,g.textPrevious.y+11*u,r.w-56*u,g,9);
   }
  }
  hubDexButton(g.tabs[0],hubDexText("info"),g,dexDetailPage===0);
  hubDexButton(g.tabs[1],hubDexText("text"),g,dexDetailPage===1);
  hubDexStatus(TPText.status(
   "Dex detail · #"+dex+" "+(state.known?fns.dexName(dex):"???")
  ));
 }finally{ctx.restore();}
}
function hubDexDetailTap(x,y){
 const g=hubDexLayout(),state=hubDexState(dexDetailDex);
 if(hubDexHit(g.detailPrevious,x,y)){hubDexMoveDetail(-1);return;}
 if(hubDexHit(g.detailNext,x,y)){hubDexMoveDetail(1);return;}
 for(let i=0;i<2;i++)if(hubDexHit(g.tabs[i],x,y)){
  if(i!==dexDetailPage&&typeof stopCry==="function")stopCry();
  dexDetailPage=i;return;
 }
 if(dexDetailPage===1){
  const description=hubDexDescription(dexDetailDex,state.known,g);
  if(hubDexHit(g.textPrevious,x,y))
   hubDexDescriptionPage=Math.max(0,hubDexDescriptionPage-1);
  else if(hubDexHit(g.textNext,x,y))
   hubDexDescriptionPage=Math.min(description.pages-1,hubDexDescriptionPage+1);
 }
 if(hubDexHit(g.cry,x,y)&&state.known&&
    typeof hasCry==="function"&&hasCry(dexDetailDex)){
  if(cryProgress(dexDetailDex)!==null)stopCry();else playCry(dexDetailDex);
 }
}

function dexGridSnapshot() {
  let ids;
  if (typeof tpComfortDexIds === "function") {
    ids = tpComfortDexIds();
  } else {
    ids = [];
    const count = fns.dexCount();
    for (let dex = 1; dex <= count; dex++) if (dexVisible(dex)) ids.push(dex);
  }
  return {ids, pages: Math.max(1, Math.ceil(ids.length / 16))};
}

function drawDexGrid() {
  if(globalThis.TPAppMenu?.dexFromHub){drawHubDexGrid();return;}
  const snapshot = dexGridSnapshot();
  const pages = snapshot.pages;
  ctx.fillStyle = UI.bgDay;
  ctx.fillRect(0, 0, TP.screen, TP.screen);
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "center";
  ctx.font = "bold 24px monospace";
  // Korean UIs title the gallery 도감, everything else keeps POKEDEX -- the
  // same one-off PetScreen.swift makes (no StrId exists for it upstream).
  const lang = fns.language();
  ctx.fillText(lang === 6 || lang === 7 ? "도감" : "POKEDEX", TP.cx, 30);
  ctx.font = "15px monospace";
  ctx.fillText(`${fns.raisedCaughtLine()}  /${fns.dexCount()}`, TP.cx, 54);

  for (let i = 0; i < 3; i++) {
    const p = DEX_FILTER_PILLS[i];
    const selected = i === dexFilter;
    ctx.fillStyle = selected ? UI.ink : UI.white;
    roundRect(p.x, 68, p.w, 22, 7);
    ctx.fill();
    ctx.strokeStyle = UI.ink;
    ctx.lineWidth = 1;
    roundRect(p.x, 68, p.w, 22, 7);
    ctx.stroke();
    ctx.fillStyle = selected ? UI.bgDay : UI.ink;
    ctx.font = "bold 13px monospace";
    ctx.fillText(p.label(), p.x + p.w / 2, 84);
  }

  if (dexPage >= pages) dexPage = 0;
  if (snapshot.ids.length === 0) {
    ctx.fillStyle = UI.ink; ctx.font = "18px monospace";
    ctx.fillText("Keine Treffer - Dex-Suche pruefen", TP.cx, 230);
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const dex = snapshot.ids[dexPage * 16 + r * 4 + c] || 0;
      if (dex <= 0) continue;
      const x = GAL_X + c * GAL_CELL, y = GAL_Y + r * GAL_CELL;
      const registered = fns.dexRegistered(dex) !== 0;
      const caught = fns.dexCaught(dex) !== 0;
      const known = dexLookupMode || registered || caught;

      ctx.fillStyle = known ? (registered ? "#bfe8c8" : "#f5dca0") : "#dfe3ea";
      roundRect(x, y, 64, 64, 10);
      ctx.fill();
      ctx.strokeStyle = UI.ink;
      ctx.lineWidth = 1;
      roundRect(x, y, 64, 64, 10);
      ctx.stroke();

      // A thumbnail if this species' sprite has already been picked locally
      // (see sprites.js's spriteCache -- reused rather than re-parsed), the
      // dex number otherwise. Ports TPThumbs' silhouette-vs-real-art split
      // loosely: known-but-not-picked still falls back to the number rather
      // than a silhouette, since this port has no separate thumbnail atlas.
      // thumbs.bin first (real art if known, ink silhouette if not --
      // upstream's rule); without the atlas, the full sprite for a known
      // species; otherwise the number / "?".
      let drawn = thumbsLoaded() && drawThumb(dex, x + 6, y + 6, 52, !known);
      if (!drawn && known) {
        const thumb = dexThumbFor(dex);
        if (thumb) { drawDexThumb(thumb, x + 6, y + 6, 52); drawn = true; }
      }
      if (!drawn) {
        ctx.fillStyle = known ? UI.ink : "#9099a8";
        ctx.font = "bold 18px monospace";
        ctx.fillText(known ? `#${dex}` : "?", x + 32, y + 37);
      }
      if (fns.dexShiny(dex) !== 0) {
        ctx.fillStyle = UI.barWarn;
        ctx.font = "bold 15px monospace";
        ctx.fillText("*", x + 56, y + 13);
      } else if (caught && !registered) {
        ctx.fillStyle = UI.barWarn;
        ctx.font = "bold 12px monospace";
        ctx.fillText("C", x + 54, y + 13);
      }
    }
  }

  ctx.fillStyle = UI.ink;
  ctx.font = "bold 15px monospace";
  ctx.fillText(`${dexPage + 1} / ${pages}`, TP.cx, 440);
  ctx.fillStyle = UI.track;
  ctx.font = "15px monospace";
  ctx.fillText(TPText.pick("< zurück · weiter > · Feld antippen","< prev · next >  ·  tap a tile"),TP.cx,456);

  statusEl.textContent = TPText.status(`Dex · page ${dexPage + 1}/${pages} · filter ${DEX_FILTER_PILLS[dexFilter].label()}`);
}

function drawDexDetail() {
  if(globalThis.TPAppMenu?.dexFromHub){drawHubDexDetail();return;}
  const dex = dexDetailDex;
  const registered = fns.dexRegistered(dex) !== 0;
  const caught = fns.dexCaught(dex) !== 0;
  const known = dexLookupMode || registered || caught;
  const shiny = fns.dexShiny(dex) !== 0;

  ctx.fillStyle = UI.bgDay;
  ctx.fillRect(0, 0, TP.screen, TP.screen);
  ctx.fillStyle = "rgb(216,31,38)";
  ctx.fillRect(0, 0, TP.screen, 64);
  ctx.fillStyle = UI.white;
  ctx.textAlign = "center";
  ctx.font = "bold 22px monospace";
  ctx.fillText("POKeDEX", TP.cx, 40);

  ctx.fillStyle = UI.track;
  ctx.font = "15px monospace";
  ctx.fillText(`#${String(dex).padStart(3, "0")}`, TP.cx, 90);
  const name = (known ? fns.dexName(dex) : "???") + (known && shiny ? " *" : "");
  ctx.fillStyle = UI.ink;
  ctx.font = "bold 28px monospace";
  ctx.fillText(name, TP.cx, 124);

  if (dexDetailPage === 0) {
    if (known) {
      const t1 = fns.dexType1(dex), t2 = fns.dexType2(dex);
      const types = t2 ? [t1, t2] : [t1];
      let totalW = 0;
      const labels = types.map((t) => TYPE_NAMES[t] || "?");
      ctx.font = "bold 14px monospace";
      const widths = labels.map((l) => ctx.measureText(l).width + 24);
      totalW = widths.reduce((a, b) => a + b, 0) + (types.length - 1) * 8;
      let cx = TP.cx - totalW / 2;
      for (let i = 0; i < types.length; i++) {
        ctx.fillStyle = TYPE_COLORS[types[i]] || "#888";
        roundRect(cx, 155, widths[i], 24, 12);
        ctx.fill();
        ctx.strokeStyle = UI.ink;
        ctx.lineWidth = 1;
        roundRect(cx, 155, widths[i], 24, 12);
        ctx.stroke();
        ctx.fillStyle = UI.white;
        ctx.fillText(labels[i], cx + widths[i] / 2, 171);
        cx += widths[i] + 8;
      }
    }

    // Portrait: the species' own sprite once it's been picked locally. This
    // used to be a 🐾 emoji for every known species regardless -- the grid
    // tiles right next door were already drawing real art via dexThumbFor,
    // so the detail view was the odd one out. Falls back to the same "?"
    // the grid uses when there's no local file for this species.
    const portrait = known ? dexThumbFor(dex) : null;
    if (portrait) {
      drawDexPortrait(portrait, TP.cx - 60, 200, 120, performance.now());
    } else if (thumbsLoaded() && drawThumb(dex, TP.cx - 60, 200, 120, !known)) {
      // atlas still (silhouette for an unseen species), as on iOS
    } else {
      ctx.font = "bold 56px monospace";
      ctx.fillStyle = known ? UI.ink : "#c8ccd4";
      ctx.fillText("?", TP.cx, 280);
    }

    ctx.font = "bold 17px monospace";
    if (registered) {
      ctx.fillStyle = UI.barOK;
      ctx.fillText(fns.raisedMarkText(), TP.cx, caught ? 384 : 396);
    }
    if (caught) {
      ctx.fillStyle = UI.barWarn;
      ctx.fillText(fns.caughtMarkText(), TP.cx, registered ? 406 : 396);
    }
  } else {
    drawDexEntryPage(dex, known);
  }

  if (dexDetailPage === 0 && known) drawCryButton(dex);

  // Two page dots -- tap either to switch pages, matching PetScreen.swift's
  // portrait/dex-entry split.
  const dotsX = TP.cx - 13;
  for (let i = 0; i < 2; i++) {
    const cx = dotsX + i * 26;
    ctx.beginPath();
    ctx.arc(cx, 400, i === dexDetailPage ? 5 : 4, 0, Math.PI * 2);
    if (i === dexDetailPage) { ctx.fillStyle = UI.ink; ctx.fill(); }
    else { ctx.strokeStyle = UI.ink; ctx.lineWidth = 1; ctx.stroke(); }
  }

  ctx.fillStyle = UI.track;
  ctx.font = "15px monospace";
  if(window.TPNavBack)window.TPNavBack.draw(ctx,TP.cx-12,404,24);
  else ctx.fillText(fns.detailBackText(), TP.cx, 424);

  statusEl.textContent = TPText.status(`Dex detail · #${dex} ${known ? fns.dexName(dex) : "???"}`);
}

// Port of PetScreen.swift's drawCryButton/cryButtonRect: a capsule that
// fills with the POKeDEX masthead's own red as the clip plays, sitting
// between the portrait and the page dots. Hidden entirely when this species
// has no cry file installed -- same guard as the tap handler's.
// Computed on call, not at load: dex.js is parsed before main.js, where TP
// is defined, so a top-level `TP.cx` here would throw during script load
// (and leave this const permanently in its temporal dead zone).
function cryBtnRect() {
  return { x: TP.cx - 75, y: 326, w: 150, h: 20 };
}

function drawCryButton(dex) {
  if (!hasCry(dex)) return;
  const r = cryBtnRect(), radius = r.h / 2;
  ctx.fillStyle = UI.white;
  roundRect(r.x, r.y, r.w, r.h, radius);
  ctx.fill();
  ctx.strokeStyle = UI.ink;
  ctx.lineWidth = 1;
  roundRect(r.x, r.y, r.w, r.h, radius);
  ctx.stroke();

  const progress = cryProgress(dex);
  if (progress !== null && progress > 0) {
    ctx.fillStyle = "rgb(216,31,38)";  // the masthead red, as on iOS
    roundRect(r.x + 2, r.y + 2, (r.w - 4) * progress, r.h - 4, radius - 2);
    ctx.fill();
  }

  // The icon gets its own circle at the capsule's left end rather than
  // sitting directly on the (sometimes red) track, so it stays legible
  // whether or not the gauge has reached that far yet.
  const icx = r.x + radius, icy = r.y + r.h / 2;
  const playing = progress !== null;
  ctx.beginPath();
  ctx.arc(icx, icy, radius - 2, 0, Math.PI * 2);
  ctx.fillStyle = playing ? "rgb(216,31,38)" : UI.ink;
  ctx.fill();
  ctx.fillStyle = UI.white;
  if (playing) {                       // pause bars
    ctx.fillRect(icx - 4, icy - 5, 3, 10);
    ctx.fillRect(icx + 1, icy - 5, 3, 10);
  } else {                             // play triangle
    ctx.beginPath();
    ctx.moveTo(icx - 3, icy - 5);
    ctx.lineTo(icx - 3, icy + 5);
    ctx.lineTo(icx + 5, icy);
    ctx.closePath();
    ctx.fill();
  }
}

// Port of drawDexEntry(): a bordered text box, shrink-and-wrap. Simplified
// from TPDexEntryText.wrap's real-width/character-mode wrapping to plain
// canvas measureText word-wrap -- good enough for the Latin-script text the
// picked entry files actually contain (PokeAPI's "ko" text wraps oddly as a
// result, same caveat the file-picker note below calls out).
function drawDexEntryPage(dex, known) {
  const x = 50, y = 146, w = 366, h = 236;
  ctx.fillStyle = UI.white;
  roundRect(x, y, w, h, 12); ctx.fill();
  ctx.strokeStyle = UI.ink; ctx.lineWidth = 1;
  roundRect(x, y, w, h, 12); ctx.stroke();

  const text = known ? dexEntryFor(dex) : null;
  if (!text) {
    ctx.fillStyle = UI.track;
    ctx.textAlign = "center";
    ctx.font = "15px monospace";
    ctx.fillText(known ? TPText.pick("Kein Pokédex-Text geladen","NO DEX ENTRY") : "???",TP.cx,y+h/2+5);
    return;
  }

  const pad = 14, usableW = w - 2 * pad;
  ctx.font = "15px monospace";
  ctx.textAlign = "left";
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? line + " " + word : word;
    if (ctx.measureText(candidate).width <= usableW) { line = candidate; continue; }
    if (line) lines.push(line);
    line = word;
  }
  if (line) lines.push(line);

  const lineH = 21;
  let ty = y + pad + 13;
  for (const l of lines) {
    if (ty > y + h - pad) break; // overflow: same "just stop" as a fixed box
    ctx.fillStyle = UI.ink;
    ctx.fillText(l, x + pad, ty);
    ty += lineH;
  }
}

function dexGridTap(x, y) {
  for (let i = 0; i < 3; i++) {
    const p = DEX_FILTER_PILLS[i];
    if (x >= p.x && x < p.x + p.w && y >= 70 && y < 88) {
      dexFilter = i; dexPage = 0;
      return;
    }
  }
  if (y >= GAL_Y && y < GAL_Y + 4 * GAL_CELL) {
    const c = Math.floor((x - GAL_X) / GAL_CELL);
    const r = Math.floor((y - GAL_Y) / GAL_CELL);
    if (c >= 0 && c < 4 && r >= 0 && r < 4) {
      const dex = dexAt(dexPage * 16 + r * 4 + c);
      if (dex > 0) { dexDetailDex = dex; dexDetailPage = 0; dexScreen = "detail"; return; }
    }
  }
  if (y >= 448 && y < 464) {
    const pages = dexPageCount();
    if (x < TP.cx) dexPage = (dexPage - 1 + pages) % pages;
    else dexPage = (dexPage + 1) % pages;
    return;
  }
  if (y > 460) screen = "idle";
}

function dexDetailTap(x, y) {
  // Cry capsule, page 0 only and only for a species with a file installed
  // -- tapping it again while it plays stops it, as on iOS.
  const known = fns.dexRegistered(dexDetailDex) !== 0 || fns.dexCaught(dexDetailDex) !== 0;
  const cb = cryBtnRect();
  if (dexDetailPage === 0 && known && hasCry(dexDetailDex) &&
      x >= cb.x && x <= cb.x + cb.w &&
      y >= cb.y - 6 && y <= cb.y + cb.h + 6) {
    if (cryProgress(dexDetailDex) !== null) stopCry();
    else playCry(dexDetailDex);
    return;
  }
  if (y >= 388 && y <= 412) {
    const next = x < TP.cx ? 0 : 1;
    if (next !== 0) stopCry();  // leaving page 0 -- its button goes with it
    dexDetailPage = next;
    return;
  }
  // Only the "tap: back" hint (drawn at y 424) closes the detail view now,
  // not the whole rest of the screen -- same reasoning as cardTap's fix.
  if (x >= 66 && x <= 400 && y >= 412 && y <= 444) {
    stopCry();
    dexScreen = "grid";
  }
}
