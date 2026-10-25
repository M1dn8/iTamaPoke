// F3: local arena UI, profile badge case and commit-confirmed handover.
(function(){'use strict';
let data=window.TPKantoArena,region=0,choosingRegion=false;
let selected=0,tab='leaders',detail=false,origin='leaders',session=null,saving=false,artBusy=false,message='';
const pictures=new Map(),loading=new Set();let artGeneration=0;
const call=(name,...args)=>Module.ccall(name,'number',args.map(()=> 'number'),args);
const scoped=(mod,r,name,...args)=>window.TPRegions?TPRegions.call(mod,r,name,'number',args):r===0?mod.ccall(name,'number',args.map(()=> 'number'),args):0;
const regional=(r,name,...args)=>scoped(Module,r,name,...args);
const label=()=>region===1?'Johto':'Kanto';
const get=k=>call('tp_f3_get',k),mask=()=>regional(region,'tp_f3_mask');
function chooseRegion(id){if(screen!=='arena'||busy()||active()||tpSaveReplacing||!Number.isInteger(id)||id<0||id>1||window.TPRegions?.locked())return false;if(id===1&&!window.TPRegions?.available(1)){message='Johto benoetigt den neuen Spielkern.';return false;}const info=window.TPRegions?.catalog(id);if(!info&&id!==0)return false;if(window.TPRegions&&!TPRegions.remember(id))return false;region=id;data=info?info.arena:window.TPKantoArena;selected=0;tab=origin='leaders';detail=false;session=null;message='';choosingRegion=false;invalidatePortraits();return true;}
function regionPicker(){ctx.fillStyle=UI.bgDay;ctx.fillRect(0,0,466,466);text('Region waehlen',233,44,22);text('Orden, Liga und Ehrenei bleiben getrennt.',233,83,13);for(let id=0;id<2;id++){const y=125+id*113,enabled=id===0||!!window.TPRegions?.available(id),p=window.TPRegions?.progress(id);button((region===id?'✓ ':'')+(id===0?'Kanto · Rot/Blau':'Johto · Gold/Silber'),60,y,346,68,enabled);text(enabled?(p&&p.mask>=0?'Orden '+Array.from({length:8},(_,i)=>!!(p.mask&(1<<i))).filter(Boolean).length+' / 8'+(p.league.done?' · Champ-Titel':''):'Fortschrittsdaten nicht lesbar'):'Neuen Spielkern laden.',233,y+91,12);}button('Zurueck',70,414,326,36);statusEl.textContent='Regionen · Kanto / Johto';}

function active(){try{return typeof Module!=='undefined'&&!!Module&&!!get(0);}catch(_e){return false;}}
function busy(){return saving||artBusy;}
function canOpen(){return !busy()&&!!window.TPTrainer?.canOpen();}
function open(){if(!canOpen())return false;session=null;message='';tab='leaders';detail=false;dragStart=dragNow=null;screen='arena';const wanted=window.TPRegions?.selected||0;if(!chooseRegion(wanted))chooseRegion(0);return true;}
function back(){if(busy())return;Module._tp_battle_close();session=null;screen='arena';detail=false;dragStart=dragNow=null;}
function leave(){if(busy())return;Module._tp_battle_close();session=null;screen='card';cardPage=4;dragStart=dragNow=null;}
function abort(){if(saving)return false;const saved=session?.phase==='done';if(active())Module._tp_battle_close();session=null;screen='arena';detail=false;message=saved?'Arena beendet – Orden gespeichert.':'Arena beendet; kein weiterer Orden vergeben.';dragStart=dragNow=null;return true;}
function start(id=selected){
 if(screen!=='arena'||busy()||tpSaveReplacing||document.visibilityState!=='visible'||choice!=='none'||!Number.isInteger(id)||id<0||id>=data.leaders.length||window.TPTraining?.busy||window.TPMega?.busy||window.TPExpeditions?.busy)return false;
 if(window.TPBattleEnergy)return startPaid(id);
 const token=regional(region,'tp_f3_start',id);if(!token){message='Arena gerade nicht verfügbar.';return false;}
 selected=id;session={region,id,token,mod:Module,phase:'fighting',since:performance.now(),error:''};dragStart=dragNow=null;battleReturn='arena';screen='battle';picture(id);return true;
}
async function startPaid(id){
 if(!window.TPBattleEnergy?.supported){message='Bitte den aktuellen Spielkern bauen.';return false;}
 const e=window.TPBattleEnergy.view;
 if(!e?.arena.can){message=window.TPBattleEnergy.line('arena');return false;}
 const owner=region,mod=Module;const paid=(name,...args)=>scoped(mod,owner,name,...args);saving=true;tpSaveReplacing=true;tpSaveEpoch++;let ticket=0,durable=false;
 try{ticket=paid('tp_energy_arena_begin',id);if(!ticket)throw Error('Arena-Start gerade nicht moeglich.');const bytes=exportStateBytes(mod);TPStoreTools.parseLegacy(bytes);if(await writeSave(bytes,true)!==true)throw Error('Energiekosten nicht gespeichert.');durable=true;const token=paid('tp_energy_arena_finish',ticket,1);if(token<=0)throw Error('Kosten gespeichert. Bitte App neu oeffnen.');selected=id;session={region:owner,id,token,mod,phase:'fighting',since:performance.now(),error:''};message='';dragStart=dragNow=null;battleReturn='arena';screen='battle';picture(id);if(document.visibilityState!=='visible'){Module._tp_battle_close();session=null;screen='arena';detail=false;}return true;
 }catch(e){if(ticket&&!durable)paid('tp_energy_arena_finish',ticket,0);message=e.message||String(e);return false;}
 finally{tpSaveEpoch++;tpSaveReplacing=false;saving=false;}
}
function checkEnd(){
 if(!session||session.mod!==Module||!active()||session.phase!=='fighting'||!fns.battleResolved()||!fns.battlePlayerWon()||window.TPTrainer.get(3))return false;
 complete();return true;
}
async function complete(){
 if(!session||saving||session.mod!==Module||!active()||!['fighting','failed'].includes(session.phase))return false;
 const s=session,mod=Module;let applied=false,committed=false,locked=false;saving=true;s.phase='saving';s.error='';
 const native=(name,...args)=>scoped(mod,s.region??0,name,...args);
 try{
  if(tpSaveReplacing||window.TPTraining?.busy||window.TPMega?.busy||window.TPExpeditions?.busy)throw Error('Speicherung gerade gesperrt');
  tpSaveReplacing=true;tpSaveEpoch++;locked=true;
  const result=native('tp_f3_apply',s.token);
  if(result===2){s.phase='repeat';s.since=performance.now();return true;}
  if(result!==1)throw Error('Arena-Abschluss nicht bestätigt');
  applied=true;await writeSave(exportStateBytes(mod),true);committed=true;
  if(!native('tp_f3_finish',s.token,1))throw Error('Ordens-Commit nicht bestätigt');
  s.phase='done';s.since=performance.now();if(typeof playSfx==='function')playSfx(6);return true;
 }catch(e){
  if(applied&&!committed)native('tp_f3_finish',s.token,0);
  window.TPDiagnostics?.record('manager',e);s.phase=committed?'done':'failed';s.since=performance.now();s.error=committed?'Gespeichert; bei Anzeigeproblemen neu öffnen.':'Nicht gespeichert – kein neuer Orden übernommen.';return false;
 }finally{
  if(locked){tpSaveEpoch++;tpSaveReplacing=false;}saving=false;
  if(document.visibilityState!=='visible'&&s.phase!=='failed'){if(active())Module._tp_battle_close();session=null;screen='arena';detail=false;}
 }
}
function text(value,x,y,size=16,color=UI.ink,max=390){ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle=color;ctx.font=`${size}px monospace`;ctx.fillText(String(value),x,y,max);}
function button(label,x,y,w=326,h=42,enabled=true){ctx.fillStyle=enabled?UI.white:'#e5e5df';roundRect(x,y,w,h,10);ctx.fill();ctx.strokeStyle=enabled?UI.ink:UI.track;ctx.lineWidth=1;ctx.stroke();text(label,x+w/2,y+h/2+6,16,enabled?UI.ink:'#747474',w-16);}
function badge(id,x,y,r=24,owned=true){
 if(region===1){if(window.TPBadgeUI?.drawJohto)window.TPBadgeUI.drawJohto(Number(id),x,y,r,owned);else{ctx.strokeStyle=UI.ink;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}return;}if(window.TPBadgeUI){window.TPBadgeUI.draw(Number(id),x,y,r,owned);return;}
 const l=data.leaders[id];ctx.save();ctx.translate(x,y);ctx.scale(r/30,r/30);ctx.strokeStyle=owned?l.color:'#8f9292';ctx.fillStyle=owned?l.color:'#dedfda';ctx.lineWidth=2;
 function poly(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();ctx.stroke();}
 if(id===0){poly([[-15,-25],[15,-25],[26,-11],[26,11],[15,25],[-15,25],[-26,11],[-26,-11]]);ctx.beginPath();ctx.moveTo(-15,-25);ctx.lineTo(15,25);ctx.moveTo(15,-25);ctx.lineTo(-15,25);ctx.stroke();}
 else if(id===1){ctx.beginPath();ctx.moveTo(0,-29);ctx.bezierCurveTo(10,-13,24,1,24,12);ctx.bezierCurveTo(24,35,-24,35,-24,12);ctx.bezierCurveTo(-24,1,-10,-13,0,-29);ctx.fill();ctx.stroke();}
 else if(id===2){const pts=[];for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,d=i%2?18:29;pts.push([Math.cos(a)*d,Math.sin(a)*d]);}poly(pts);ctx.fillStyle=owned?'#6a9ba2':'#f7efe6';ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();}
 else if(id===3){const colors=['#b53a3a','#a27819','#718141','#39814e','#397ab6','#7466a1','#ac5a91','#c37d68'];for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.fillStyle=owned?colors[i]:'#dedfda';ctx.beginPath();ctx.arc(Math.cos(a)*17,Math.sin(a)*17,11,0,Math.PI*2);ctx.fill();ctx.stroke();}ctx.fillStyle=owned?'#f4d872':'#eee';ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.stroke();}
 else if(id===4){ctx.beginPath();ctx.moveTo(0,28);ctx.bezierCurveTo(-48,-4,-18,-37,0,-13);ctx.bezierCurveTo(18,-37,48,-4,0,28);ctx.fill();ctx.stroke();}
 else if(id===5){ctx.beginPath();ctx.arc(0,0,27,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=owned?'#f4d872':'#eee';ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.stroke();}
 else if(id===6){poly([[0,-30],[8,-12],[23,-21],[18,-1],[29,8],[11,11],[0,29],[-11,11],[-29,8],[-18,-1],[-23,-21],[-8,-12]]);}
 else{ctx.beginPath();ctx.moveTo(-18,26);ctx.bezierCurveTo(-41,-7,-8,-27,24,-28);ctx.bezierCurveTo(27,8,6,35,-18,26);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-24,32);ctx.lineTo(15,-18);ctx.stroke();}
 ctx.restore();
}
function owned(id,m=mask()){return m>=0&&!!(m&(1<<id));}
function date(id){const value=regional(region,'tp_f3_date',id);return value?new Date(value*1000).toLocaleDateString('de-DE'):'Datum nicht hinterlegt';}
function draw(){
 if(choosingRegion){regionPicker();return;}
 ctx.fillStyle='#f7efe6';ctx.fillRect(0,0,466,466);const m=mask();
 if(m<0){button('Regionen',348,6,108,30);text('Ordensstand nicht unterstützt',233,170,20);text('Keine Arena-Vergabe möglich.',233,205,16);button('Zurück',70,410);return;}
 if(detail){drawDetail(m);return;}
 text((tab==='badges'?'Ordenkoffer · ':'Arenen · ')+label(),190,30,20,UI.ink,280);button('Regionen',348,6,108,30);button('Arenen',70,44,156,34);button('Orden',240,44,156,34);
 if(tab==='badges'){drawCase(m);return;}
 text(tab==='badges'?label()+' · '+Array.from({length:8},(_,i)=>owned(i,m)?1:0).reduce((a,b)=>a+b,0)+' von 8':(region===1?'Gold/Silber':'Rot/Blau')+' · feste Originallevel',233,97,13);
 for(let i=0;i<8;i++){
  const l=data.leaders[i],x=i%2?242:44,y=104+Math.floor(i/2)*72,got=owned(i,m);
  ctx.fillStyle=UI.white;roundRect(x,y,180,66,11);ctx.fill();ctx.strokeStyle=got?l.color:'#c8cbc5';ctx.lineWidth=got?2:1;ctx.stroke();badge(i,x+30,y+31,19,tab==='leaders'||got);
  text(tab==='badges'?l.badge:l.name,x+113,y+23,15,UI.ink,124);text(tab==='badges'?(got?'✓ Erhalten':'Noch offen'):l.city,x+113,y+43,11,UI.ink,124);
  if(tab==='leaders')text(l.team.length+' Pokémon · Lv. '+Math.min(...l.team.map(m=>m[1]))+'–'+Math.max(...l.team.map(m=>m[1])),x+113,y+58,10,UI.ink,124);
 }
 if(message)text(message,233,403,11,UI.barBad);button('Liga',70,414,126,36);button('Zurück',206,414,190,36);statusEl.textContent='Arena · '+(tab==='badges'?'Ordenkoffer':label()+'-Auswahl');
}
function drawCase(m){
 text('Deine '+label()+'-Sammlung · '+Array.from({length:8},(_,i)=>owned(i,m)?1:0).reduce((a,b)=>a+b,0)+' von 8',233,101,14);
 ctx.fillStyle='#54645b';roundRect(38,113,390,239,22);ctx.fill();ctx.fillStyle='#e7e5d9';roundRect(48,123,370,219,16);ctx.fill();ctx.strokeStyle='#9b9279';ctx.lineWidth=2;ctx.stroke();
 for(let i=0;i<8;i++){const x=98+(i%4)*90,y=132+Math.floor(i/4)*105,got=owned(i,m);ctx.fillStyle=got?'#fffdf4':'#d1d7cd';roundRect(x-39,y,78,94,12);ctx.fill();ctx.strokeStyle=got?'#b49959':'#9ba89a';ctx.lineWidth=got?2:1;ctx.stroke();badge(i,x,y+36,25,got);text(data.leaders[i].badge,x,y+74,10,UI.ink,74);text(got?'✓ Erhalten':'Offen',x,y+88,9,UI.ink,74);}
 if(message)text(message,233,390,11,UI.barBad);button('Zurück zum Kampfbereich',70,414,326,36);statusEl.textContent='Arena · Ordenkoffer';
}
function drawDetail(m){
 const l=data.leaders[selected],got=owned(selected,m);
 TPOpponentTeam.header({name:l.name,subtitle:label()+' · '+l.city,color:l.color,image:picture(selected),kind:'arena'});
 badge(selected,119,43,17,got);
 text(l.badge+(got?' · Erhalten':''),283,86,16,UI.ink,280);
 TPOpponentTeam.draw(l.team,{y:110,rowHeight:60});
 text(got?'Erstmals erhalten: '+date(selected):'Sieg über das ganze Team gibt diesen Orden.',233,303,12);text(message||'Du kämpfst mit deinem aktuellen Pokémon.',233,321,12,message?UI.barBad:UI.ink);
 button(got?'Erneut herausfordern':'Arena herausfordern',70,333,326,42,!busy()&&!tpSaveReplacing&&(!window.TPBattleEnergy||!!window.TPBattleEnergy.view?.arena.can));if(window.TPBattleEnergy)text(window.TPBattleEnergy.line('arena'),233,395,11,UI.ink,410);button('Zurück',70,420,326,30,!busy());statusEl.textContent='Arena · '+l.name;
}
function tap(x,y){
 if(busy())return;if(choosingRegion){if(y>=414){choosingRegion=false;return;}if(x>=60&&x<=406){if(y>=125&&y<=193)chooseRegion(0);else if(y>=238&&y<=306)chooseRegion(1);}return;}if(x>=348&&x<=456&&y>=6&&y<=36&&!detail){if(!active()&&!tpSaveReplacing&&!window.TPRegions?.locked())choosingRegion=true;return;}if(mask()<0){if(x>=70&&x<=396&&y>=410&&y<=452)leave();return;}
 if(detail){if(x<70||x>396)return;if(y>=333&&y<=375)start(selected);else if(y>=420&&y<=450){detail=false;tab=origin;message='';}return;}
 if(y>=44&&y<=78){if(x>=70&&x<=226)tab='leaders';else if(x>=240&&x<=396)tab='badges';return;}
 if(tab==='badges'){for(let i=0;i<8;i++){const cx=98+i%4*90,top=132+Math.floor(i/4)*105;if(x>=cx-39&&x<=cx+39&&y>=top&&y<=top+94){selected=i;origin=tab;detail=true;message='';return;}}if(x>=70&&x<=396&&y>=414&&y<=450)leave();return;}
 for(let i=0;i<8;i++){const left=i%2?242:44,top=104+Math.floor(i/2)*72;if(x>=left&&x<=left+180&&y>=top&&y<=top+66){selected=i;origin=tab;detail=true;message='';return;}}
 if(y>=414&&y<=450){if(x>=70&&x<=196)window.TPLeague?.open(region);else if(x>=206&&x<=396)leave();}
}
function drawLeader(id,x,y,w,h){
 const image=picture(id);if(image){const s=Math.min(w/image.width,h/image.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(image,x+(w-image.width*s)/2,y+h-image.height*s,image.width*s,image.height*s);return;}
 ctx.fillStyle='#a9b5ae';ctx.beginPath();ctx.arc(x+w/2,y+29,21,0,Math.PI*2);ctx.fill();roundRect(x+w/2-27,y+54,54,h-54,14);ctx.fill();ctx.strokeStyle='#83938a';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(x+w/2+20,y+65);ctx.lineTo(x+w+10,y+80);ctx.stroke();text('Grafik nicht geladen',x+w/2,y+h+16,10,UI.ink,136);
}
function handover(now){
 const s=session,l=data.leaders[s.id];ctx.fillStyle='#f7efe6';ctx.fillRect(0,0,466,466);text(s.phase==='saving'?'Arena gewonnen – speichern …':s.phase==='failed'?'Arena gewonnen – nicht gespeichert':'Arena gewonnen!',233,40,23);text(l.name+' · '+l.city,233,70,16);drawLeader(s.id,62,130,110,140);drawBattleSprite(fns.speciesId(),340,now,true,110);
 const awarded=s.phase==='done',reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches,progress=awarded?(reduced?1:Math.max(0,Math.min(1,(now-s.since)/1000))):0;
 const x=awarded?164+69*(1-(1-progress)**3):233;badge(s.id,x,218,awarded?22+progress*21:36,s.phase!=='failed');
 if(awarded&&progress<1&&!reduced){ctx.strokeStyle=l.color;ctx.lineWidth=2;for(let i=0;i<8;i++){const a=i*Math.PI/4,d=51+progress*12;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*d,218+Math.sin(a)*d);ctx.lineTo(x+Math.cos(a)*(d+7),218+Math.sin(a)*(d+7));ctx.stroke();}}
 text(l.name,117,304,15);text(window.TPMega?.battleActive()?window.TPMega.name():fns.name(),340,304,15,UI.ink,160);text(s.phase==='saving'?'Bitte kurz warten.':s.phase==='repeat'?'Orden bereits erhalten – gut gekämpft!':s.phase==='failed'?'Kein neuer Orden übernommen.':l.name+' überreicht dir den '+l.badge+'!',233,337,16);
 if(s.error)text(s.error,233,357,11,UI.barBad);if(!saving){button(s.phase==='failed'?'Speichern erneut versuchen':'Ordenkoffer öffnen',70,371,326,36);button(s.phase==='failed'?'Arena verlassen':'Weiter',70,418,326,32);}statusEl.textContent='Arena · '+s.phase;
}
function intercept(now){if(!session||session.mod!==Module||!active())return false;checkEnd();if(!['saving','done','repeat','failed'].includes(session.phase))return false;handover(now);return true;}
function battleTap(x,y){
 if(!session||!active()||!['saving','done','repeat','failed'].includes(session.phase))return false;if(saving)return true;
 if(x>=70&&x<=396&&y>=371&&y<=407){if(session.phase==='failed')complete();else{back();tab='badges';}}else if(x>=70&&x<=396&&y>=418&&y<=450)back();return true;
}
// Local raster portraits only; no fetches and no remote URLs.
let dbPromise=null;
function database(){
 if(dbPromise)return dbPromise;
 dbPromise=new Promise((resolve,reject)=>{const request=indexedDB.open('itamapoke-arena-art',1);let settled=false;const timer=setTimeout(()=>{if(!settled){settled=true;reject(Error('Grafikspeicher nicht erreichbar'));}},10000);
 request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('portraits'))request.result.createObjectStore('portraits');};
 request.onsuccess=()=>{clearTimeout(timer);if(settled){request.result.close();return;}settled=true;request.result.onversionchange=()=>{request.result.close();dbPromise=null;};resolve(request.result);};request.onerror=()=>{clearTimeout(timer);settled=true;reject(request.error);};
 }).catch(e=>{dbPromise=null;throw e;});return dbPromise;
}
async function decode(blob){const url=URL.createObjectURL(blob);try{return await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('PNG nicht lesbar'));img.src=url;});}finally{URL.revokeObjectURL(url);}}
// Read both legacy Blob portraits and portable PNG byte buffers.
function portraitBlob(value){
 if(value instanceof Blob)return value;
 if(value instanceof ArrayBuffer||ArrayBuffer.isView(value))return new Blob([value],{type:'image/png'});
 throw Error('Gespeicherte Leitergrafik hat ein unbekanntes Format.');
}
function invalidatePortraits(){artGeneration++;pictures.clear();loading.clear();}
function picture(id){
 if(region!==0)return TPOpponentTeam.portrait('johto-arena-'+data.leaders[id].id);
 if(pictures.has(id))return pictures.get(id);
 if(!loading.has(id)){const generation=artGeneration;loading.add(id);(async()=>{let image=null;try{
  if(window.TPTrainerArt){try{const result=await TPTrainerArt.picture(data.leaders[id].id);if(result)image=result.image;}catch(e){window.TPDiagnostics?.record('manager',e);}}
  if(!image){const db=await database(),value=await new Promise((resolve,reject)=>{const tx=db.transaction('portraits','readonly'),q=tx.objectStore('portraits').get(data.leaders[id].id);let found=null;q.onsuccess=()=>{found=q.result;};tx.oncomplete=()=>resolve(found);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Lesen abgebrochen'));});image=value?await decode(portraitBlob(value)):null;}
  if(generation===artGeneration&&!pictures.has(id))pictures.set(id,image);
 }catch(_){if(generation===artGeneration&&!pictures.has(id))pictures.set(id,null);}finally{if(generation===artGeneration)loading.delete(id);}})();}return null;
}
async function importPortrait(file,id){
 if(region!==0)throw Error('Johto-Leitergrafiken sind noch nicht importierbar; Platzhalter bleibt sichtbar.');
 if(artBusy||saving||screen!=='arena'||active()||tpSaveReplacing||!Number.isInteger(id)||id<0||id>=8)throw Error('Grafikimport gerade gesperrt');artBusy=true;message='';
 try{
  if(!file||file.size<24||file.size>1024*1024)throw Error('Bitte eine PNG bis 1 MB auswählen.');const bytes=new Uint8Array(await file.arrayBuffer());if([137,80,78,71,13,10,26,10].some((v,i)=>bytes[i]!==v))throw Error('Datei ist keine PNG.');const view=new DataView(bytes.buffer),width=view.getUint32(16),height=view.getUint32(20);if(!width||!height||width>1024||height>1024)throw Error('PNG-Abmessungen: maximal 1024 × 1024.');
  const image=await decode(new Blob([bytes],{type:'image/png'}));const canvas=document.createElement('canvas'),s=Math.min(1,512/image.width,512/image.height);canvas.width=Math.max(1,Math.round(image.width*s));canvas.height=Math.max(1,Math.round(image.height*s));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  const clean=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG konnte nicht vorbereitet werden')),'image/png'));const normalized=await decode(clean),db=await database(),stored=await clean.arrayBuffer();
  await new Promise((resolve,reject)=>{const tx=db.transaction('portraits','readwrite');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Speichern abgebrochen'));tx.objectStore('portraits').put(stored,data.leaders[id].id);});pictures.set(id,normalized);if(window.TPTrainerArt)invalidatePortraits();message='Leitergrafik lokal gespeichert.';return true;
 }catch(e){message=e.message||'Grafik konnte nicht geladen werden.';throw e;}finally{artBusy=false;}
}
let picker=null;
function pickPortrait(id){
 if(busy())return;picker?.remove();const input=document.createElement('input');picker=input;input.type='file';input.accept='image/png,.png';input.hidden=true;input.setAttribute('data-tp-arena-portrait','');document.body.appendChild(input);input.addEventListener('change',()=>{const file=input.files?.[0];input.remove();if(file)importPortrait(file,id).catch(e=>window.TPDiagnostics?.record('manager',e));},{once:true});input.addEventListener('cancel',()=>input.remove(),{once:true});input.click();
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible'&&active()&&!saving)abort();});window.addEventListener('pagehide',()=>{if(active()&&!saving)abort();});
window.TPArena=Object.freeze({open,chooseRegion,get region(){return region;},get choosingRegion(){return choosingRegion;},canOpen,start,active,abort,draw,tap,intercept,battleTap,checkEnd,complete,badge,importPortrait,invalidatePortraits,get busy(){return busy();},get snapshot(){return session?{region:session.region??0,id:session.id,token:session.token,phase:session.phase,error:session.error}:null;}});
})();
