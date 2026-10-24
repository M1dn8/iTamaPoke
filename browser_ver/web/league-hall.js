/* Kanto Hall: original pixel room, immutable native winner snapshots.
 * No Pokemon artwork is bundled; winner sprites use the existing local loader.
 */
(function(){'use strict';
let active=false,busy=false,celebration=false,message='',selected=0,openedAt=0;
const c=(n,...a)=>Module.ccall(n,'number',a.map(()=> 'number'),a);
function ready(){try{return !!Module&&typeof Module._tp_hall_view==='function';}catch(_){return false;}}
function view(){return ready()?JSON.parse(Module.ccall('tp_hall_view','string',[],[])):{supported:0,legacy:0,legacyDate:0,wins:0,seen:0,variants:0,pendingCeremony:0,records:[]};}
function open(celebrate=false){if(screen!=='league'||busy||tpSaveReplacing)return false;try{if(JSON.parse(Module.ccall('tp_lg_view','string',[],[])).live)return false;}catch(_){return false;}const v=view();active=true;message='';selected=Math.max(0,v.records.length-1);celebration=!!celebrate&&!!v.pendingCeremony;openedAt=performance.now();dragStart=dragNow=null;return true;}
function close(){if(busy)return;active=false;celebration=false;message='';dragStart=dragNow=null;}
async function acknowledge(){if(busy||tpSaveReplacing)return false;const v=view();if(!v.supported)return false;if(!v.pendingCeremony){celebration=false;return true;}busy=true;tpSaveReplacing=true;tpSaveEpoch++;let token=0,durable=false;
 try{token=c('tp_lg_prepare_seen');if(!token)throw Error('Ehrung gerade nicht abschliessbar.');const bytes=exportStateBytes(Module);TPStoreTools.parseLegacy(bytes);if(await writeSave(bytes,true)!==true)throw Error('Speicherung nicht bestaetigt.');durable=true;if(c('tp_lg_finish',token,1)!==1)throw Error('Gespeichert. Fuer den lokalen Abschluss bitte neu laden.');celebration=false;message='Dein Ehrenplatz bleibt dauerhaft erhalten.';return true;
 }catch(e){if(token&&!durable)c('tp_lg_finish',token,0);message=e.message||String(e);return false;}
 finally{tpSaveEpoch++;tpSaveReplacing=false;busy=false;}}
function text(s,x,y,size=14,color='#34423d',max=410){ctx.fillStyle=color;ctx.textAlign='center';ctx.font=size+'px monospace';ctx.fillText(String(s),x,y,max);}
function box(x,y,w,h,fill,stroke='#b9aa8c'){ctx.fillStyle=fill;roundRect(x,y,w,h,7);ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
function button(s,x,y,w=326,h=36){box(x,y,w,h,'#fffaf0');text(s,x+w/2,y+h/2+5,14,'#34423d',w-12);}
function room(){ctx.fillStyle='#eee7d7';ctx.fillRect(0,0,466,466);ctx.fillStyle='#d6c8ab';ctx.fillRect(20,45,426,213);ctx.fillStyle='#f8efd8';ctx.fillRect(28,53,410,188);ctx.fillStyle='#b49b6b';ctx.fillRect(20,238,426,12);ctx.fillStyle='#ddd3bd';ctx.fillRect(20,250,426,154);
 for(let y=250;y<404;y+=26){ctx.fillStyle=(y%52===42)?'#e8dfcc':'#e0d5bc';ctx.fillRect(20,y,426,1);for(let x=20+(y%52===42?0:34);x<446;x+=68)ctx.fillRect(x,y,1,26);}
 ctx.fillStyle='#923f43';ctx.beginPath();ctx.moveTo(208,250);ctx.lineTo(258,250);ctx.lineTo(294,404);ctx.lineTo(172,404);ctx.closePath();ctx.fill();ctx.strokeStyle='#d6b25a';ctx.lineWidth=3;ctx.stroke();
 for(const x of [42,400]){ctx.fillStyle='#baa77e';ctx.fillRect(x,69,24,160);ctx.fillStyle='#e7d7b2';ctx.fillRect(x+5,75,6,146);ctx.fillStyle='#a38c5f';ctx.fillRect(x-3,64,30,8);ctx.fillRect(x-3,225,30,8);}
 ctx.fillStyle='#c7ad73';ctx.fillRect(170,235,126,13);ctx.fillStyle='#eee0ba';ctx.fillRect(179,226,108,9);
 const throne=['..........gggggg..........','........ggyyyyyygg........','......ggyyggggggyygg......','.....gyyggppppppggyyg.....','....gyygppppppppppgyyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','....gygppppppppppppgyg....','...ggygppppppppppppgygg...','...gyygppppppppppppgyyg...','...gyyggggggggggggggyyg...','...gyyyyyyyyyyyyyyyyyyg...','...gggggggggggggggggggg...','....ggg............ggg....','....gyg............gyg....','....ggg............ggg....'];
 const colors={g:'#8d692b',y:'#ddba60',p:'#754652'};for(let r=0;r<throne.length;r++){const row=throne[r];for(let i=0;i<row.length;){let j=i+1;while(j<row.length&&row[j]===row[i])j++;if(colors[row[i]]){ctx.fillStyle=colors[row[i]];ctx.fillRect(181+i*4,81+r*4,(j-i)*4,4);}i=j;}}
 text('KANTO',233,65,13,'#8a6b32');for(let i=0;i<8;i++){const x=92+(i%4)*21+(i>=4?200:0);ctx.fillStyle='#c6a650';ctx.beginPath();ctx.moveTo(x,100);ctx.lineTo(x+6,106);ctx.lineTo(x,112);ctx.lineTo(x-6,106);ctx.closePath();ctx.fill();}}
function sprite(r){if(!r)return;const s=r.form?megaSpriteFor(!!r.shiny,r.form):spriteFor(r.dex,!!r.shiny);if(!s){text('?',233,212,40,'#fff2bf');return;}const a=s.actions[TPAct.idle];if(!a)return;const img=frameImageData(s,TPAct.idle,frameIndexAt(a,performance.now(),true));if(!img)return;frameCanvas.width=a.w;frameCanvas.height=a.h;frameCtx.putImageData(img,0,0);const z=Math.min(3,112/a.w,110/a.h);ctx.imageSmoothingEnabled=false;ctx.drawImage(frameCanvas,233-a.w*z/2,235-a.h*z,a.w*z,a.h*z);}
function date(n){return n?new Date(n*1000).toLocaleDateString('de-DE'):'Datum nicht erfasst';}
function draw(){if(window.TPRewardEgg?.active){window.TPRewardEgg.draw();return;}const v=view();room();text(celebration?'Du bist Champ von Kanto!':'Ruhmeshalle · Kanto',233,30,22);if(!v.supported){box(34,275,398,108,'#fffaf0');text(ready()?'Ruhmeshallendaten nicht unterstützt.':'Bitte den neuen Spielkern bauen.',233,315,15);button('Zurück zur Liga',70,416);statusEl.textContent='Ruhmeshalle nicht verfügbar';return;}
 if(!celebration)button('Shiny-Ei',80,144,94,34);
 const r=v.records[selected]||null;if(r)sprite(r);else text(v.legacy?'KANTO-CHAMP':'DEIN EHRENPLATZ',233,205,17,'#fff1be');
 if(celebration&&performance.now()-openedAt<5000){const t=(performance.now()-openedAt)/1000;for(let i=0;i<18;i++){ctx.fillStyle=['#d6b34e','#fff0b0','#ad6870'][i%3];ctx.fillRect(32+(i*29)%400,60+((i*43+t*42)%180),3,6);}}
 box(34,274,398,124,'#fffaf0');if(r){const species=fns.dexName(r.dex);text(r.nick||species,233,298,20);text((r.nick?species+' · ':'')+'Lv. '+r.level+(r.shiny?' · SCHILLERND':''),233,320,13);text('Erfasster Sieg '+r.sequence+' · '+date(r.date),233,341,12);text('Champvariante: '+['Glurak','Turtok','Bisaflor'][r.variant],233,360,12);text('Erfasste Siege: '+v.wins+' · Varianten: '+[0,1,2].filter(i=>v.variants&(1<<i)).length+' / 3',233,382,12);}
 else if(v.legacy){text('Dein Kanto-Abschluss ist bestätigt.',233,300,16);text('Sieger-Pokémon damals nicht gespeichert.',233,325,13);text('Wir tragen kein heutiges Pokémon nachträglich ein.',233,348,12);text(date(v.legacyDate),233,376,12);}
 else{text('Dieser Platz wartet auf deinen Champsieg.',233,315,16);text('Das tatsächlich siegreiche Pflege-Pokémon',233,344,13);text('wird hier dauerhaft aufgenommen.',233,365,13);}
 if(v.records.length>1&&!celebration){button('‹',34,239,40,28);button('›',392,239,40,28);text((selected+1)+' / '+v.records.length,233,264,11);}
 if(message)text(message,233,410,11,'#934941');
 if(celebration){button('Später',70,424,146,32);button('Ehrung abschließen',250,424,146,32);}else if(v.pendingCeremony){button('Zurück',70,424,146,32);button('Siegerehrung',250,424,146,32);}else button('Zurück zur Liga',70,424,326,32);
 statusEl.textContent=celebration?'Siegerehrung · dein tatsächliches Sieger-Pokémon':v.legacy?'Ruhmeshalle · ältere Abschlüsse bleiben anerkannt':'Ruhmeshalle · '+v.wins+' erfasste Siege';}
function tap(x,y){if(busy||tpSaveReplacing)return;if(window.TPRewardEgg?.active){window.TPRewardEgg.tap(x,y);return;}const v=view();if(!celebration&&v.supported&&x>=80&&x<=174&&y>=144&&y<=178){window.TPRewardEgg?.open();return;}if(y>=424&&y<=460){if(celebration){if(x>=70&&x<=216)close();else if(x>=250&&x<=396)acknowledge();}else if(v.pendingCeremony){if(x>=70&&x<=216)close();else if(x>=250&&x<=396){celebration=true;openedAt=performance.now();message='';}}else if(x>=70&&x<=396)close();return;}
 if(!celebration&&v.records.length>1&&y>=239&&y<=267){if(x>=34&&x<=74)selected=Math.max(0,selected-1);else if(x>=392&&x<=432)selected=Math.min(v.records.length-1,selected+1);}}
window.TPHall=Object.freeze({open,close,draw,tap,acknowledge,get active(){return active;},get busy(){return busy||!!window.TPRewardEgg?.busy;},get view(){return view();},get diagnostics(){return Object.freeze({active,busy,celebration,message,selected});}});
})();
