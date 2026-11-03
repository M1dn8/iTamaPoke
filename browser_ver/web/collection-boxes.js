/* F4-C collection UI. All writes use TPCollection.apply, never a second store. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{
 root.TPCollectionBoxes=api;
 let returnTo='card';const frameBounds=new WeakMap();
 root.TPBoxes=api.create({model:root.TPCollectionModel,getController:()=>root.TPCollection,getHost:()=>document.getElementById('tp-game-shell'),
  canOpen:origin=>!!root.TPCollectionGame?.supported&&!!root.TPAppMenu?.ready&&fns.ceremony()===0&&!fns.evolvingNow()&&!root.TPCollection?.busy&&!root.TPCollectionGame?.dialogOpen&&!root.TPAdmissionUI?.active&&!tpSaveReplacing&&choice==='none'&&(
   origin==='card'&&screen==='card'&&cardPage===3||
   origin==='pokedex'&&screen==='settings'&&
    root.TPAppMenu?.active&&root.TPAppMenu?.page==='pokedex'&&
    !root.TPCollection?.blocked
  ),
  getWarning:()=>root.TPCollectionGame?.message||'',nameForDex:d=>fns.dexName(d),onOpen:origin=>{
   returnTo=origin;
   if(origin==='pokedex')root.TPAppMenu.close();
   screen='settings';dragStart=null;dragNow=null;feedMenuUntil=confirmUntil=0;},onClose:reason=>{
   if(returnTo==='pokedex'&&reason==='back'){
    screen='idle';root.TPAppMenu.show('pokedex');
   }else{
    screen='card';
    cardPage=returnTo==='pokedex'&&reason==='rename'?0:3;
    canvas.focus?.();
   }
  },
  renameActive:()=>{screen='card';cardPage=0;cardTap(233,root.TPMega?.visible()?300:330);},
  getEvolutionRules:mon=>{
 if(typeof Module==='undefined'||typeof Module.ccall!=='function')return null;
 const count=Module.ccall('tp_evo_rule_count','number',['number'],[mon.dex]);
 if(!Number.isInteger(count)||count<0||count>64)
  throw Error('Entwicklungsdaten nicht lesbar.');
 const result=[];
 for(let index=0;index<count;index++){
  const field=key=>Module.ccall('tp_evo_rule_field','number',
   ['number','number','number'],[mon.dex,index,key]);
  const item={to:field(0),baseLevel:field(10),bond:field(2),time:field(3)};
  if(!Number.isInteger(item.to)||item.to<1||item.to>1025||
     !Number.isInteger(item.baseLevel)||item.baseLevel<0||item.baseLevel>100||
     !Number.isInteger(item.bond)||item.bond<0||item.bond>100||
     !Number.isInteger(item.time)||item.time<0||item.time>3)
   throw Error('Entwicklungsregel nicht lesbar.');
  result.push(item);
 }
 return result;
},
 drawSprite:(target,mon,t)=>{
 const c=target.getContext('2d');
 c.clearRect(0,0,target.width,target.height);
 const sprite=spriteFor(mon.dex,mon.shiny);
 if(!sprite){
  c.font='24px sans-serif';c.fillStyle='#8b9991';c.textAlign='center';
  c.fillText('?',target.width/2,Math.min(35,target.height-3));return;
 }
 const action=sprite.actions[TPAct.idle];if(!action)return;
 const image=frameImageData(sprite,TPAct.idle,frameIndexAt(action,t,true));
 if(!image)return;
 let bounds=frameBounds.get(image);
 if(!frameBounds.has(image)){
  const width=image.width||action.w,height=image.height||action.h;
  let left=width,top=height,right=-1,bottom=-1;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)
   if(image.data[(y*width+x)*4+3]){
    left=Math.min(left,x);right=Math.max(right,x);
    top=Math.min(top,y);bottom=Math.max(bottom,y);
   }
  bounds=right>=left?{x:left,y:top,w:right-left+1,h:bottom-top+1}:null;
  frameBounds.set(image,bounds);
 }
 if(!bounds)return;
 const off=api.frameCanvas||(api.frameCanvas=document.createElement('canvas'));
 off.width=image.width||action.w;off.height=image.height||action.h;
 off.getContext('2d').putImageData(image,0,0);
 const scale=Math.min((target.width-4)/bounds.w,(target.height-4)/bounds.h,3);
 c.imageSmoothingEnabled=false;
 c.drawImage(off,bounds.x,bounds.y,bounds.w,bounds.h,
  (target.width-bounds.w*scale)/2,(target.height-bounds.h*scale)/2,
  bounds.w*scale,bounds.h*scale);
}
 });
}})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function create({model:M,getController,getHost,canOpen=()=>true,getWarning=()=>'',nameForDex=d=>'Pokemon #'+d,onOpen=()=>{},onClose=()=>{},renameActive=()=>{},drawSprite=()=>{},getEvolutionRules=()=>null,document:doc=globalThis.document,schedule=fn=>globalThis.requestAnimationFrame?.(fn),cancel=id=>globalThis.cancelAnimationFrame?.(id),repeat=fn=>globalThis.setInterval(fn,700),stop=id=>globalThis.clearInterval(id)}={}){
 let root=null,active=false,busy=false,tab='boxes',box=0,selected=null,modal=null,message='',revision=-1,raf=null,timer=null,lastDraw=0,thumbs=[],page=0,pickerPage=0,subview='overview',teamPick=null,detailPage=0;
 const controller=()=>{const c=getController();if(!c)throw Error('Sammlung nicht bereit.');return c;};
 function read(){return controller().read();}
 function node(tag,text,cls){const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
 function button(text,fn,disabled=false,cls=''){const b=node('button',text,cls);b.type='button';b.disabled=disabled;b.addEventListener('click',()=>{if(!active||b.isConnected===false||b.disabled||busy||getController()?.busy||getController()?.blocked)return;try{const result=fn();if(result?.catch)result.catch(fail);}catch(e){fail(e);}});return b;}
 function fail(e){message=({'TEAM_FULL':'Alle sechs Plaetze sind belegt. Bitte ausdruecklich ersetzen.','TARGET_BOX_FULL':'Die Zielbox ist voll.','CONFIRMATION_REQUIRED':'Bestaetigung fehlt.','INVALID_BOX':'Bitte einen gueltigen Boxnamen verwenden.','INVALID_POKEMON':'Name zu lang oder ungueltig.','RELOAD_REQUIRED':'Bitte neu laden – Speicherzustand pruefen.'})[e.code]||e.message||String(e);if(active)render();}
 function title(m){return (m.nickname||nameForDex(m.dex))+(m.shiny?' ✦':'');}
 function location(s,id){if(s.active===id)return 'Aktuelles Pflege-Pokemon';for(let b=0;b<s.boxes.length;b++){const i=s.boxes[b].slots.indexOf(id);if(i>=0)return s.boxes[b].name+' · Platz '+(i+1);}return 'Nicht mehr vorhanden';}
 function mon(s,id){return s.mons.find(x=>x.id===id);}
 function portrait(m,w=72,h=54){const c=node('canvas');c.width=w;c.height=h;c.setAttribute('aria-label',title(m));thumbs.push({canvas:c,mon:m});return c;}
 function locked(){return busy||controller().busy||controller().blocked;}
 async function run(operation,...args){if(locked())return;busy=true;message='Speichern ...';render();try{await controller().apply(operation,...args);message='Gespeichert.';modal=null;
 if(operation==='selectTeam'&&teamPick){
  selected=args[0];teamPick=null;tab='team';page=0;subview='overview';
 }}catch(e){message=e.code==='RELOAD_REQUIRED'?'Speicherabschluss unklar – bitte neu laden.':'Speichern fehlgeschlagen – Aenderung nicht gespeichert. '+(e.code||e.message);}finally{busy=false;render();}}
 function open(origin='card'){
  if(!['card','pokedex'].includes(origin)||active||!canOpen(origin))return false;const host=getHost();if(!host)return false;if(!root){root=node('section',undefined,'tp-box-page');root.id='tp-box-page';root.setAttribute('aria-label','Individuelle Boxen und Teamplanung');host.appendChild(root);root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!locked()){e.preventDefault();if(modal){modal=null;render();}else if(subview!=='overview'){subview='overview';render();}else if(selected!==null){selected=null;render();}else close();}});}active=true;subview='overview';teamPick=null;if(origin==='pokedex'){tab='team';page=0;selected=null;}root.hidden=false;onOpen(origin);render();root.querySelectorAll('button')[0]?.focus();raf=schedule(animate);timer=repeat(refresh);return true;}
 function close(reason='back'){if(!active||locked())return;active=false;root.hidden=true;if(raf!==null)cancel(raf);if(timer!==null)stop(timer);raf=timer=null;modal=null;selected=null;teamPick=null;onClose(reason);}
 function animate(t){if(!active)return;if(t-lastDraw>=140){lastDraw=t;for(const x of thumbs){try{drawSprite(x.canvas,x.mon,t);}catch(_){}}}raf=schedule(animate);}
 function refresh(){if(!active||busy||modal)return;try{if(controller().busy)return;const s=read();if(s.revision!==revision)render();}catch(e){fail(e);}}

function applyDesign(){
 const host=getHost();
 if(typeof globalThis.hubDexDesignTokens==='function')
  for(const [key,value]of Object.entries(globalThis.hubDexDesignTokens()))
   host?.style?.setProperty?.(key,value);
}
function icon(kind){
 const paths={
  boxes:'<path d="M3 7h18v14H3ZM2 3h20v4H2ZM7 11h10"/>',
  team:'<circle cx="6" cy="7" r="3"/><circle cx="18" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/>',
  current:'<path d="M12 21 3 12C-2 5 7 0 12 6c5-6 14-1 9 6Z"/>',
  folder:'<path d="M2 6h8l3 3h9l-3 12H2ZM2 6V3h8l3 3h7v3"/>',
  rename:'<path d="m4 16 12-12 4 4L8 20l-5 1ZM13 7l4 4"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 6v1"/>',
  add:'<path d="M12 3v18M3 12h18"/>',confirm:'<path d="m4 12 5 5L20 5"/>'
 };
 const span=node('span',undefined,'tp-box-icon');
 span.setAttribute('aria-hidden','true');
 span.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '+
  'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+paths[kind]+'</svg>';
 return span;
}
function tool(label,kind,fn,disabled,pressed=false){
 const b=button(label,fn,disabled);
 b.setAttribute('aria-label',label);b.setAttribute('title',label);
 b.setAttribute('aria-pressed',String(pressed));b.append(icon(kind));
 return b;
}
function viewBack(){
 if(teamPick&&!modal){
  teamPick=null;tab='team';page=0;selected=null;
  subview='overview';message='';render();return;
 }
 if(modal){modal=null;render();return;}
 if(subview!=='overview'){subview='overview';render();return;}
 close();
}
function selectIndividual(id){
 selected=id;subview='overview';message='';render();
}
function pendingAdmission(){
 try{
  return !!(globalThis.TPAdmission?.supported&&globalThis.TPAdmissionUI&&
   globalThis.TPAdmission.read().pending);
 }catch(_){return false;}
}
function infoCards(body){
 const left=node('section',undefined,'tp-box-info-card');
 const right=node('section',undefined,'tp-box-info-card');
 left.tabIndex=0;right.tabIndex=0;
 left.append(icon('boxes'),node('h3','Deine Sammlung'),
  node('p','Gelagerte Pokémon altern nicht und entwickeln oder trainieren sich nicht automatisch.'));
 right.append(icon('team'),node('h3','Nur Teamplanung'),
  node('p','Teamänderungen wechseln nicht das aktuelle Pflege-Pokémon.'));
 if(pendingAdmission())right.append(button('Aufnahme fortsetzen',()=>{
  close('admission');globalThis.TPAdmissionUI.open();
 },locked()));
 body.append(left,right);
}
function boxSummary(s,body){
 const card=node('article',undefined,'tp-box-card tp-box-summary');
 card.append(icon('boxes'),node('h3',s.boxes[box].name),
  node('p',s.boxes[box].slots.filter(id=>id!==null).length+' / '+s.boxes[box].slots.length+' Plätze belegt'));
 body.append(card);
}
function selectBox(index){
 box=index;page=0;selected=null;subview='overview';message='';render();
}

function startTeamPick(replaceId=null){
 const s=read();
 const eligible=item=>item.slots.some(id=>id!==null&&!s.team.includes(id));
 if(!eligible(s.boxes[box])){
  const first=s.boxes.findIndex(eligible);
  if(first>=0)box=first;
 }
 teamPick={replace:replaceId};
 tab='boxes';page=0;selected=null;modal=null;
 subview='overview';message='';render();
}
function preview(s,m,body,disabled,showAction=true){
 if(!m){
  const empty=node('article',undefined,'tp-box-battle-card tp-box-no-selection');
  empty.append(icon('team'),node('p','Wähle ein Pokémon oder einen freien Teamplatz.'));
  body.append(empty);return;
 }
 const card=node('article',undefined,'tp-box-battle-card');
 const hero=node('div',undefined,'tp-box-battle-hero');
 const action=teamPick?
  button('Ins Team',()=>{
   if(!teamPick)return;
   return teamPick.replace===null?run('selectTeam',m.id):
    run('selectTeam',m.id,teamPick.replace);
  },disabled||s.team.includes(m.id),'tp-box-manage tp-box-take'):
  button('Verwalten',()=>{
   selected=m.id;subview='manage';message='';render();
  },disabled,'tp-box-manage');
 action.setAttribute('aria-label',teamPick?'Ins Team':'Verwalten');
 action.setAttribute('title',teamPick?'Für den Teamplatz übernehmen':'Verwalten');
 action.append(icon(teamPick?'confirm':'info'));
 hero.append(portrait(m,96,72));if(showAction)hero.append(action);
 const graph=node('div',undefined,'tp-box-battle-stats');
 const keys=[['atk','ANG'],['def','VERT'],['spe','TMP']];
 const known=s.mons.flatMap(item=>keys.map(([key])=>item.data.stats?.[key]))
  .filter(value=>Number.isFinite(value)&&value>=0);
 const maximum=Math.max(1,...known);
 for(const [key,label]of keys){
  const value=m.data.stats?.[key];
  const valid=Number.isFinite(value)&&value>=0;
  const row=node('div',undefined,'tp-box-stat');
  row.setAttribute('data-stat',key);
  row.setAttribute('data-stat-value',valid?String(value):'unknown');
  const track=node('span',undefined,'tp-box-stat-track');
  const fill=node('span',undefined,'tp-box-stat-fill');
  fill.style.width=(valid?Math.min(100,value/maximum*100):0)+'%';
  track.append(fill);
  row.append(node('span',label),track,node('span',valid?String(value):'—'));
  row.setAttribute('aria-label',label+': '+(valid?value:'nicht vorhanden'));
  row.setAttribute('title','Balken relativ zum höchsten vorhandenen Sammlungswert');
  graph.append(row);
 }
 card.append(hero,node('h3',title(m)),
  node('p','Lv. '+m.level+' · Exemplar #'+m.id,'tp-box-battle-level'));
 if(!showAction)card.append(node('p','Bindung: '+
  (Number.isInteger(m.data.bond)?m.data.bond:'—'),'tp-box-detail-bond'));
 card.append(graph);
 body.append(card);
}

function manage(s,m,body,disabled){
 const card=node('div',undefined,'tp-box-action-grid');
 function action(label,fn,column,row,off=false,danger=false){
  const b=button(label,fn,disabled||off,danger?'tp-box-danger':'');
  b.setAttribute('data-action-column',String(column));
  b.setAttribute('data-action-row',String(row));
  card.append(b);
 }
 const pinned=m.id===s.active;
 if(tab==='team'&&s.team.includes(m.id)){
  const index=s.team.indexOf(m.id);
  action('Nach vorne',()=>run('moveTeam',m.id,-1),1,1,index===0);
  action('Nach hinten',()=>run('moveTeam',m.id,1),2,1,index===s.team.length-1);
  action('Ersetzen',()=>startTeamPick(m.id),1,2,pinned);
  action('Aus Teamplanung nehmen',()=>run('unselectTeam',m.id),2,2,pinned);
 }else{
  action('Ins Team',()=>{
   if(s.team.length>=M.TEAM){modal={kind:'replace',id:m.id};render();}
   else return run('selectTeam',m.id);
  },1,1,s.team.includes(m.id));
  action('In andere Box verschieben',()=>{
   modal={kind:'move',id:m.id,target:box};render();
  },1,2,pinned);
  action('Namen ändern',()=>{
   if(read().active===m.id){close('rename');renameActive();}
   else{modal={kind:'name',id:m.id,draft:m.nickname};render();}
  },2,1);
  action('Freilassen',()=>{
   modal={kind:'release',id:m.id};render();
  },2,2,pinned,true);
 }
 action('Details',()=>{detailPage=0;subview='details';render();},1,3);
 action('Zurück zur Übersicht',()=>{
  selected=null;subview='overview';render();
 },2,3);
 body.append(card);
}
function renderSlots(s,left,disabled){
 const grid=node('div',undefined,'tp-box-grid');
 const ids=tab==='boxes'?s.boxes[box].slots:
  Array.from({length:6},(_,index)=>teamRoster(s)[index]??null);
 const first=page*6;
 ids.forEach((id,index)=>{
  if(id===null){
   const empty=tab==='team'?
    button('Teamplatz '+(index+1)+' · frei',()=>{
     startTeamPick();
    },disabled,'tp-box-empty'):
    node('div','Platz '+(index+1)+' · frei','tp-box-empty');
   empty.hidden=index<first||index>=first+6;
   grid.append(empty);return;
  }
  const m=mon(s,id);
  const tile=button('',()=>selectIndividual(id),disabled||!!teamPick&&s.team.includes(id),'tp-box-tile');
  tile.setAttribute('aria-label',title(m)+' · Lv. '+m.level+' · Exemplar #'+m.id);
  tile.setAttribute('aria-pressed',String((selected??(tab==='team'?(s.active??s.team[0]):null))===id));
  if(tab==='team'){tile.setAttribute('data-team-id',String(id));tile.setAttribute('data-care-pinned',String(id===s.active));}
  tile.setAttribute('data-mon-id',String(id));
  tile.append(portrait(m,64,32),
   node('span',title(m),'tp-box-tile-name'),
   node('small','Lv. '+m.level+' · #'+m.id,'tp-box-sr'));
  tile.hidden=index<first||index>=first+6;
  grid.append(tile);
 });
 left.append(grid);
}
function renderBoxPicker(s,right,disabled){
 const grid=node('div',undefined,'tp-box-picker');
 s.boxes.forEach((item,index)=>{
  const label=item.name+' · '+item.slots.filter(id=>id!==null).length+' / '+item.slots.length;
  const b=button('',()=>selectBox(index),disabled);
  b.setAttribute('data-box-index',String(index));
  b.setAttribute('aria-label',label);
  b.setAttribute('aria-pressed',String(box===index));
  b.append(icon('boxes'),node('span',item.name,'tp-box-choice-name'));
  b.hidden=index<pickerPage*6||index>=pickerPage*6+6;
  grid.append(b);
 });
 right.append(grid);
}


function teamRoster(s){
 return s.active===null?s.team.slice():
  [s.active,...s.team.filter(id=>id!==s.active)];
}
function informationCard(s,m){
 const holder=node('div');
 preview(s,m,holder,false,false);
 const card=holder.children[0];
 card.className+=' tp-box-card tp-box-evolution-subject';
 return card;
}
function renderCarePlacement(s,body,disabled){
 const left=node('div',undefined,'tp-box-column tp-box-column-left tp-box-preview');
 const right=node('div',undefined,'tp-box-column tp-box-column-right');
 preview(s,mon(s,s.active),left,disabled,false);
 const grid=node('div',undefined,'tp-box-grid');
 for(const id of s.team){
  const old=mon(s,id);
  const choice=button('',()=>{
   teamPick={replace:id};
   return run('selectTeam',s.active,id);
  },disabled,'tp-box-tile');
  choice.setAttribute('aria-label','Durch Pflege-Pokémon ersetzen: '+title(old)+' · #'+id);
  choice.append(portrait(old,64,32),node('span',title(old),'tp-box-tile-name'));
  grid.append(choice);
 }
 right.append(grid);body.append(left,right);
}
function detailActions(s,m,disabled){
 const actions=node('div',undefined,'tp-box-detail-actions');
 const add=button('Ins Team',()=>{
  teamPick=null;
  if(s.team.length>=M.TEAM){
   modal={kind:'replace',id:m.id};render();
  }else return run('selectTeam',m.id);
 },disabled||s.team.includes(m.id),'tp-box-detail-action');
 add.setAttribute('aria-label','Ins Team');
 add.setAttribute('title',s.team.includes(m.id)?'Bereits im Team':'Ins Team');
 add.append(icon('add'));
 const back=button('Zurück zur Verwaltung',()=>{
  subview='manage';message='';render();
 },disabled,'tp-box-detail-action');
 back.setAttribute('aria-label','Zurück zur Verwaltung');
 back.setAttribute('title','Zurück zur Verwaltung');
 back.append(node('span','←','tp-box-detail-action-symbol'));
 actions.append(add,back);
 return actions;
}

function renderEvolutionDetails(s,m,right,disabled){
 const card=node('div',undefined,'tp-evo-goal-card tp-box-evolution-card');
 let targets;
 try{targets=getEvolutionRules(m);}catch(_){targets=null;}
 if(targets===null){
  card.append(node('h3','Entwicklung'),
   node('p','Entwicklungsdaten momentan nicht verfügbar.'));
  detailPage=0;
 }else if(!targets.length){
  card.append(node('h3','Entwicklung'),
   node('p','Diese Art besitzt keine weitere Entwicklung.'));
  detailPage=0;
 }else{
  detailPage=Math.max(0,Math.min(targets.length-1,detailPage));
  const target=targets[detailPage],mistakes=m.data.careMistakes;
  const knownMistakes=Number.isSafeInteger(mistakes)&&mistakes>=0;
  const required=knownMistakes?Math.min(100,target.baseLevel+mistakes):null;
  const values=['fullness','joy','energy','hygiene'].map(key=>m.data[key]);
  const care=values.every(value=>Number.isInteger(value)&&value>=0&&value<=100)?
   Math.min(...values):null;
  const checks=node('div',undefined,'tp-evo-checks');
  checks.tabIndex=0;
  const rows=[
   [required===null?
    'Level mindestens '+target.baseLevel+' · Pflegefehler unbekannt':
    'Level '+m.level+' / '+required,
    required===null?null:m.level>=required],
   ['Bindung '+(Number.isInteger(m.data.bond)?m.data.bond:'—')+' / '+target.bond,
    Number.isInteger(m.data.bond)?m.data.bond>=target.bond:null],
   ['Zeit: '+['Beliebig','Tagsüber','Nachts','Abends'][target.time]+' (UTC)',null],
   [care===null?'Pflege mindestens 40':'Pflege '+care+' / 40',
    care===null?null:care>=40],
   ['Wach erforderlich',null]
  ];
  for(const [label,ok]of rows){
   const row=node('div',undefined,'tp-evo-check');
   row.setAttribute('data-ok',ok===null?'unknown':String(ok));
   row.append(node('span',label,'tp-evo-check-label'),
    node('span',ok===null?'—':ok?'✓':'○','tp-evo-check-mark'));
   checks.append(row);
  }
  card.append(node('h3',nameForDex(target.to)),checks);
 }
 right.append(card);
 return Array.isArray(targets)?targets.length:0;
}

function editor(s,body,disabled){const kind=modal.kind,m=modal.id===undefined?null:mon(s,modal.id);if(modal.id!==undefined&&!m){modal=null;selected=null;message='Exemplar nicht mehr vorhanden.';return;}
  const card=node('section',undefined,'tp-box-card tp-box-editor');card.setAttribute('data-editor-kind',kind);const nameActions=node('div',undefined,'tp-box-editor-actions');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');
  if(kind==='boxName'||kind==='name'){card.append(node('h3',kind==='boxName'?'Box umbenennen':'Namen ändern'));const input=node('input');input.type='text';input.value=modal.draft;input.setAttribute('aria-label',kind==='boxName'?'Boxname':'Spitzname');input.disabled=disabled;input.addEventListener('input',()=>{modal.draft=input.value;});card.append(input);if(kind==='boxName')card.append(node('p','Boxnamen duerfen nicht leer sein.'));nameActions.append(button('Speichern',()=>kind==='boxName'?run('renameBox',box,modal.draft):run('renamePokemon',m.id,modal.draft),disabled));card.append(nameActions);}

if(kind==='move'){
 card.className+=' tp-box-move-editor';
 card.append(node('h3','Zielbox wählen'));
 const available=index=>Number.isInteger(index)&&index>=0&&index<s.boxes.length&&
  s.boxes[index].slots.includes(null)&&!s.boxes[index].slots.includes(m.id);
 if(!available(modal.target))
  modal.target=s.boxes.findIndex((_,index)=>available(index));
 const grid=node('div',undefined,'tp-box-move-grid');
 grid.setAttribute('aria-label','Zielboxen');
 const choices=[];
 const move=button('Verschieben',()=>run('moveBox',m.id,modal.target),
  disabled||!available(modal.target));
 for(let index=0;index<s.boxes.length;index++){
  const item=s.boxes[index],used=item.slots.filter(id=>id!==null).length;
  const here=item.slots.includes(m.id),full=!item.slots.includes(null);
  const label=item.name+' · '+used+' / '+item.slots.length+
   (here?' · aktuelle Box':full?' · voll':'');
  const choice=button('',()=>{
   modal.target=index;
   for(const entry of choices)
    entry.button.setAttribute('aria-pressed',String(entry.index===index));
   move.disabled=disabled||!available(index);
  },disabled||here||full,'tp-box-move-choice');
  choice.setAttribute('data-target-box',String(index));
  choice.setAttribute('aria-label',label);
  choice.setAttribute('title',label);
  choice.setAttribute('aria-pressed',String(index===modal.target));
  choice.append(icon('boxes'),
   node('span',item.name,'tp-box-move-name'),
   node('small',here?'Hier':used+' / '+item.slots.length));
  choices.push({button:choice,index});grid.append(choice);
 }
 nameActions.append(move);
 card.append(grid,nameActions);
}
  if(kind==='release'){card.append(node('h3','Dieses Exemplar endgueltig freilassen?'),node('p',title(m)+' · Lv. '+m.level+' · Exemplar #'+m.id),node('p',location(s,m.id)),node('p','Nicht wiederherstellbar. Historische Fang- und Artennachweise bleiben erhalten.'),node('p',s.team.includes(m.id)?'Dieses Pokemon ist im Teamplan. Sein Platz wird ebenfalls frei.':'Kein anderes Exemplar wird entfernt.'));card.append(button('Dieses Exemplar endgueltig freilassen',()=>run('releaseStored',m.id,{confirmed:true}),disabled||s.active===m.id,'tp-box-danger'));}
  if(kind==='replace'){card.append(node('h3','Welchen Teamplatz durch '+title(m)+' ersetzen?'));for(const id of s.team){const old=mon(s,id);card.append(button(title(old)+' · Lv. '+old.level+' · #'+id+' · '+location(s,id),()=>run('selectTeam',m.id,id),disabled||id===s.active));}}
  if(kind==='pick'){card.append(node('h3',modal.replace===null?'Naechsten freien Teamplatz belegen':'Teammitglied ersetzen'));for(const candidate of s.mons.filter(m=>!s.team.includes(m.id)))card.append(button(title(candidate)+' · Lv. '+candidate.level+' · #'+candidate.id+' · '+location(s,candidate.id),()=>run('selectTeam',candidate.id,modal.replace),disabled));}
  const cancelButton=button('Abbrechen',()=>{modal=null;render();},disabled);if(kind==='name'||kind==='boxName'||kind==='move')nameActions.append(cancelButton);else card.append(cancelButton);body.append(card);if(!disabled)cancelButton.focus();
 }

function render(){
 if(!active)return;
 thumbs=[];root.replaceChildren();applyDesign();
 root.setAttribute('data-ui01-collection','true');
 let s;
 try{s=read();revision=s.revision;}
 catch(e){
  root.append(node('p','Sammlung nicht lesbar. Keine Aenderungen moeglich.'),
   button(globalThis.TPText?.t('common.back')||'Zurück',close));
  return;
 }
 if(selected!==null&&!mon(s,selected)){
  selected=null;subview='overview';modal=null;
 }
 const disabled=locked();const repair=M.needsCarePlacement(s);let detailCount=0;
 root.setAttribute('data-current-box',String(box));
 const head=node('header',undefined,'tp-box-head');
 head.append(node('h2',repair?'Pflegeplatz zuordnen':teamPick?(teamPick.replace===null?'Team ergänzen':'Team ersetzen'):'Boxen'),
  button(globalThis.TPText?.t('common.back')||'Zurück',viewBack,disabled));
 root.append(head);
 const frame=node('div',undefined,'tp-box-frame');
 frame.setAttribute('aria-hidden','true');
 for(const cls of [
  'tp-pokedex-display tp-pokedex-display-left',
  'tp-pokedex-display tp-pokedex-display-right',
  'tp-pokedex-spine'
 ]){
  const part=node('span',undefined,cls);
  part.setAttribute('aria-hidden','true');frame.append(part);
 }
 root.append(frame);

const toolsDisabled=disabled||repair;
 const tools=node('div',undefined,'tp-box-toolbar');
 tools.append(
  tool('Boxen','boxes',()=>{
   teamPick=null;tab='boxes';page=0;selected=null;modal=null;
   subview='overview';message='';render();
  },toolsDisabled,tab==='boxes'),
  tool('Teamplanung '+s.team.length+' / 6','team',()=>{
   teamPick=null;tab='team';page=0;selected=null;modal=null;
   subview='overview';message='';render();
  },toolsDisabled,tab==='team'),
  tool('Info','info',()=>{
   subview=subview==='info'?'overview':'info';
   modal=null;message='';render();
  },toolsDisabled,subview==='info')
 );
 tools.setAttribute('data-tools','3');
 root.append(tools);
 const body=node('div',undefined,'tp-box-work-area');
 root.append(body);
 const rules=node('p',
  'Teamänderungen wechseln nicht das aktuelle Pflege-Pokémon.',
  'tp-box-note tp-box-sr');
 root.append(rules);
 const m=repair?mon(s,s.active):selected!==null?mon(s,selected):
  tab==='team'&&s.team.length?mon(s,s.active??s.team[0]):
  s.active!==null?mon(s,s.active):null;
 root.setAttribute('data-box-view',repair?'carePlacement':modal?'editor':subview);
 if(repair){renderCarePlacement(s,body,disabled);}
 else if(modal){
  const left=node('div',undefined,'tp-box-column tp-box-column-left tp-box-preview');
  const right=node('div',undefined,'tp-box-column tp-box-column-right tp-box-editor-pane');
  if(m)left.append(informationCard(s,m));else boxSummary(s,left);
  body.append(left,right);editor(s,right,disabled);
 }else if(subview==='manage'&&m){
  manage(s,m,body,disabled);
 }else if(subview==='info'){
  body.className+=' tp-box-info-view';infoCards(body);
 }else if(subview==='details'&&m){
  const left=node('div',undefined,'tp-box-column tp-box-column-left tp-box-preview');
  const right=node('div',undefined,'tp-box-column tp-box-column-right tp-box-detail-note');
  left.append(informationCard(s,m),detailActions(s,m,disabled));
  detailCount=renderEvolutionDetails(s,m,right,disabled);
  body.append(left,right);
 }else{
  const left=node('div',undefined,'tp-box-column tp-box-column-left tp-box-preview');
  const right=node('div',undefined,'tp-box-column tp-box-column-right');
  const slots=tab==='boxes'?s.boxes[box].slots.length:6;
  page=Math.max(0,Math.min(Math.max(0,Math.ceil(slots/6)-1),page));
  preview(s,m,left,disabled);
  if(subview==='boxPicker')renderBoxPicker(s,right,disabled);
  else renderSlots(s,right,disabled);
  body.append(left,right);
 }
 const pages=repair?1:subview==='details'?Math.max(1,detailCount):subview==='boxPicker'?Math.ceil(s.boxes.length/6):
  Math.ceil((tab==='boxes'?s.boxes[box].slots.length:6)/6);
 const currentPage=subview==='details'?detailPage:subview==='boxPicker'?pickerPage:page;
 const navigable=!repair&&!modal&&['overview','boxPicker','details'].includes(subview)&&pages>1;
 const previous=button('',()=>{
  if(subview==='details')detailPage--;else if(subview==='boxPicker')pickerPage--;else page--;
  message='';render();
 },disabled||currentPage===0,'tp-box-page-nav');
 previous.id='tp-box-prev';
 const next=button('',()=>{
  if(subview==='details')detailPage++;else if(subview==='boxPicker')pickerPage++;else page++;
  message='';render();
 },disabled||currentPage>=pages-1,'tp-box-page-nav');
 next.id='tp-box-next';
 for(const [control,label]of [[previous,'<'],[next,'>']])
  control.append(node('span',label,'tp-box-nav-face'));
 previous.hidden=next.hidden=!navigable;
 const warning=getWarning();
 const feedback=[warning,message,repair?'Wähle ein Mitglied, dessen Teamplatz das Pflege-Pokémon erhält. Es bleibt in seiner Box.':'',controller().blocked?
  'Bitte neu laden – Speicherbestaetigung pruefen.':''].filter(Boolean).join('\n');
 const footer=node('p',feedback||(
  subview==='details'?'Entwicklungsziel · '+(detailCount?detailPage+1:0)+' / '+detailCount:
  subview==='boxPicker'?'Boxwahl · '+(pickerPage+1)+' / '+pages:
  tab==='boxes'?s.boxes[box].name+' · '+(page+1)+' / '+pages:
  'Teamplanung '+s.team.length+' / 6'
 ),feedback?'tp-box-message tp-box-footer':'tp-box-footer');
 if(feedback){footer.setAttribute('role','status');footer.tabIndex=0;}

if(!repair&&!modal&&subview==='overview'&&tab==='boxes'){
  const group=node('div',undefined,'tp-box-footer-group tp-box-footer-boxes');
  const boxPrevious=button('',()=>selectBox((box+s.boxes.length-1)%s.boxes.length),
   disabled,'tp-box-page-nav');
  const boxNext=button('',()=>selectBox((box+1)%s.boxes.length),
   disabled,'tp-box-page-nav');
  boxPrevious.id='tp-box-prev-box';boxNext.id='tp-box-next-box';
  boxPrevious.setAttribute('aria-label','Vorige Box');
  boxNext.setAttribute('aria-label','Naechste Box');
  boxPrevious.append(node('span','<','tp-box-nav-face'));
  boxNext.append(node('span','>','tp-box-nav-face'));
  const boxLabel=node('span','Box\n'+(box+1)+' / '+s.boxes.length,'tp-box-footer-label');
  group.append(boxPrevious,boxLabel,boxNext);
  const slots=node('div',undefined,'tp-box-footer-group tp-box-footer-slots');
  previous.hidden=next.hidden=pages<=1;
  previous.setAttribute('aria-label','Vorige Platzseite');
  next.setAttribute('aria-label','Naechste Platzseite');
  slots.append(previous,node('span','Plätze\n'+(page+1)+' / '+pages,'tp-box-footer-label'),next);
  group.hidden=slots.hidden=false;
  if(feedback){
   boxLabel.textContent=feedback;
   boxLabel.className+=' tp-box-message';
   boxLabel.setAttribute('role','status');boxLabel.tabIndex=0;
   boxLabel.setAttribute('title',feedback);
  }
  footer.hidden=true;footer.textContent='';
  root.append(group,slots,footer);
 }else root.append(previous,footer,next);
}

return Object.freeze({open,close,refresh,get active(){return active;},get busy(){return busy;},get state(){return {box,tab,selected,modal:modal?.kind||null};}});
}
return {create};
});
