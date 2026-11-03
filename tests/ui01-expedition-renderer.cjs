const fs=require('node:fs'),vm=require('node:vm');
const assert=require('node:assert/strict');
module.exports=async function(source){
 source=source||fs.readFileSync('browser_ver/web/expedition.js','utf8');
 let context;
 class Element{
  constructor(tag){
   this.tagName=tag;this.children=[];this.dataset={};this.handlers={};
   this.style={setProperty(){}};this.disabled=false;this.hidden=false;
   this.className='';this.scrollTop=0;
  }
  append(...nodes){for(const n of nodes){this.children.push(n);n.parentNode=this;}}
  replaceChildren(...nodes){
   for(const n of this.children)n.parentNode=null;
   this.children=[];this.append(...nodes);
  }
  setAttribute(key,value){this[key]=String(value);}
  addEventListener(key,fn){(this.handlers[key]??=[]).push(fn);}
  get isConnected(){return !!this.parentNode;}
  focus(){context.document.activeElement=this;}
  contains(target){return walk(this).includes(target);}
  querySelectorAll(selector){
   return walk(this).slice(1).filter(n=>
    selector.startsWith('button')?n.tagName==='button'&&
     (!selector.includes(':not')||!n.disabled):
    selector.startsWith('.')&&n.className.split(' ').includes(selector.slice(1))
   );
  }
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  getContext(){return new Proxy({},{
   get(target,key){return key in target?target[key]:(()=>{});}
  });}
  click(){
   if(this.disabled)return;
   for(const fn of this.handlers.click||[])fn({target:this});
  }
 }
 function walk(n){return [n,...n.children.flatMap(walk)];}
 const body=new Element('body'),host=new Element('div'),canvas=new Element('canvas');
 host.id='tp-game-shell';body.append(host);
 const calls=[],s=Array(27).fill(0);
 for(let i=20;i<24;i++)s[i]=1;
 s[10]=2;s[24]=2;s[26]=1;
 let pending=false,ready=false;
 const api={
  targets:[1,2,3,4].map(route=>({
   route,name:'Route '+route,item:'Item '+route,
   minutes:route===4?30:15,cost:route===4?26:12
  })),
  itemNames:['Nahrung','Energie','Pflege','Training'],
  oldNames:['Alt','A','B','C','D'],busy:false,reason(){return '';},
  view(){return {s,pending,ready,left:5,busy:false,quiet:true,
   canClaim:true,reasons:[0,0,0,0],notice:''};},
  start(route){calls.push(['start',route]);return Promise.resolve(true);},
  claim(){calls.push(['claim']);return Promise.resolve(true);},
  use(item,stat){
   calls.push(stat===undefined?['use',item]:['use',item,stat]);
   return Promise.resolve(true);
  }
 };
 context={
  console,screen:'expedition',cardPage:7,choice:'none',tpSaveReplacing:false,
  expeditionTrainChoiceOpen:false,dragStart:null,dragNow:null,canvas,
  TPExpeditions:api,statusEl:{textContent:''},
  fns:{language:()=>3,expeditionTitle:()=>'Expedition',
   trainStatUsable:()=>1,trainStatLabel:i=>['ANG','VERT','TMP'][i]},
  TPIcon:{food:[],clean:[]},drawIconOn(){},
  performance:{now:()=>1000},requestAnimationFrame:()=>1,cancelAnimationFrame(){},
  setInterval(){return 0;},clearInterval(){},
  document:{
   body,documentElement:{},visibilityState:'visible',activeElement:null,
   createElement:tag=>new Element(tag),
   getElementById:id=>walk(body).find(n=>n.id===id)||null
  }
 };
 context.window=context;vm.createContext(context);
 vm.runInContext(fs.readFileSync('browser_ver/web/de-ui.js','utf8'),context);
 const a=source.indexOf('/* UI01 expedition double display */');
 const b=source.indexOf('function drawCardExpedition()',a);
 assert(a>=0&&b>a);
 vm.runInContext(source.slice(a,b),context);
 const render=()=>vm.runInContext('expeditionUI.draw()',context);
 const find=(key,value='')=>{
  const n=walk(host).find(n=>n.dataset[key]===value);
  assert(n,'Missing visible control: '+key+'='+value);return n;
 };
 const flush=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};
 render();
 find('expRoute','1').click();assert.equal(calls.length,0);
 find('expStart').click();await flush();
 find('expRoute','4').click();find('expStart').click();await flush();
 assert.deepEqual(calls,[['start',1],['start',4]]);
 pending=ready=true;render();
 find('expItem','2').click();await flush();
 find('expClaim').click();await flush();
 assert.deepEqual(calls.slice(-2),[['use',2],['claim']]);
 find('expItem','3').click();
 find('expStat','0').click();await flush();
 assert.deepEqual(calls.at(-1),['use',3,0]);
 find('expItem','3').click();find('expBack').click();
 assert.equal(context.screen,'expedition');
 find('expBack').click();assert.equal(context.screen,'idle');
 console.log('Expeditionsrenderer: DOM-Auswahl, Start, Abholen, Verwendung, Training und Rückweg bestanden.');
};
