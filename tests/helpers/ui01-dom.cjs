// UI01 bundled closeout test alignment.
'use strict';
function installDOM(context){
 const document=context.document||(context.document={});
 class E{
  constructor(tag){
   this.tagName=String(tag).toUpperCase();this.nodeType=tag==='#text'?3:1;
   this.children=[];this.parentNode=null;this.dataset={};this.attributes={};
   this.className='';this.id='';this.hidden=false;this.disabled=false;
   this._text='';this.handlers={};this.clientWidth=160;this.clientHeight=160;
   this.style={setProperty(k,v){this[k]=String(v);},getPropertyValue(k){return this[k]||'';}};
   const read=()=>this.className.split(/\s+/).filter(Boolean);
   this.classList={
    add:(...xs)=>{this.className=[...new Set([...read(),...xs])].join(' ');},
    remove:(...xs)=>{this.className=read().filter(x=>!xs.includes(x)).join(' ');},
    contains:x=>read().includes(x),
    toggle:(x,force)=>{
     const on=force===undefined?!read().includes(x):Boolean(force);
     if(on)this.classList.add(x);else this.classList.remove(x);
     return on;
    }
   };
  }
  get textContent(){return this._text+this.children.map(n=>n.textContent||'').join('');}
  set textContent(v){this.replaceChildren();this._text=String(v??'');}
  get firstElementChild(){return this.children.find(n=>n.nodeType===1)||null;}
  get firstChild(){return this.children[0]||null;}
  get parentElement(){return this.parentNode;}
  get isConnected(){for(let n=this;n;n=n.parentNode)if(n===document.documentElement)return true;return false;}
  append(...nodes){for(let n of nodes){if(typeof n!=='object'){const t=new E('#text');t.textContent=n;n=t;}this.appendChild(n);}}
  appendChild(n){
   if(n.parentNode)n.parentNode.removeChild(n);
   n.parentNode=this;this.children.push(n);return n;
  }
  prepend(...nodes){
   for(const n of [...nodes].reverse()){
    if(n.parentNode)n.parentNode.removeChild(n);
    n.parentNode=this;this.children.unshift(n);
   }
  }
  removeChild(n){
   const i=this.children.indexOf(n);if(i<0)throw Error('Child not found');
   this.children.splice(i,1);n.parentNode=null;return n;
  }
  remove(){if(this.parentNode)this.parentNode.removeChild(this);}
  replaceChildren(...nodes){
   for(const n of this.children)n.parentNode=null;
   this.children=[];this._text='';this.append(...nodes);
  }
  setAttribute(k,v){
   this.attributes[k]=String(v);
   if(k==='id')this.id=String(v);
   if(k==='class')this.className=String(v);
   if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=String(v);
  }
  getAttribute(k){
   if(k==='id')return this.id||null;
   if(k==='class')return this.className||null;
   if(k.startsWith('data-')){
    const key=k.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase());
    return this.dataset[key]??null;
   }
   return this.attributes[k]??null;
  }
  removeAttribute(k){delete this.attributes[k];}
  addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}
  removeEventListener(k,fn){this.handlers[k]=(this.handlers[k]||[]).filter(x=>x!==fn);}
  async click(){
   if(this.disabled)return;
   const e={type:'click',target:this,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}};
   for(const fn of [...(this.handlers.click||[])])await fn.call(this,e);
  }
  focus(){document.activeElement=this;}
  contains(other){for(let n=other;n;n=n.parentNode)if(n===this)return true;return false;}
  getClientRects(){
   for(let n=this;n;n=n.parentNode)
    if(n.hidden||n.style.display==='none')return [];
   return this.isConnected?[this.getBoundingClientRect()]:[];
  }
  getBoundingClientRect(){
   return {x:0,y:0,left:0,top:0,right:this.clientWidth,bottom:this.clientHeight,
    width:this.clientWidth,height:this.clientHeight};
  }
  matches(selector){
   let s=selector.trim(),ok=true;
   s=s.replace(/:not\(([^()]*(?:\([^()]*\))?[^()]*)\)/g,(_,inner)=>{
    if(this.matches(inner))ok=false;return '';
   });
   s=s.replace(/:(disabled|enabled)/g,(_,kind)=>{
    if(kind==='disabled'?!this.disabled:this.disabled)ok=false;return '';
   });
   const tag=s.match(/^[\w-]+|^\*/);
   if(tag){if(tag[0]!=='*'&&tag[0].toUpperCase()!==this.tagName)ok=false;s=s.slice(tag[0].length);}
   while(s){
    let m=s.match(/^([.#])([\w-]+)/);
    if(m){if(m[1]==='.'?!this.classList.contains(m[2]):this.id!==m[2])ok=false;s=s.slice(m[0].length);continue;}
    m=s.match(/^\[([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?\]/);
    if(m){
     const wanted=m[2]??m[3]??m[4],actual=this.getAttribute(m[1]);
     if(wanted===undefined?actual===null:actual!==wanted)ok=false;
     s=s.slice(m[0].length);continue;
    }
    throw Error('Unsupported test selector: '+selector);
   }
   return ok;
  }
  querySelectorAll(selector){
   const variants=selector.split(',').map(x=>x.trim().split(/\s+(?![^\[]*\])/));
   return flat(this).slice(1).filter(n=>n.nodeType===1&&variants.some(parts=>{
    if(!n.matches(parts[parts.length-1]))return false;
    let p=n.parentNode;
    for(let i=parts.length-2;i>=0;i--){
     while(p&&!p.matches(parts[i]))p=p.parentNode;
     if(!p)return false;p=p.parentNode;
    }
    return true;
   }));
  }
  querySelector(s){return this.querySelectorAll(s)[0]||null;}
  closest(s){for(let n=this;n;n=n.parentNode)if(n.matches(s))return n;return null;}
  getContext(){return context.ctx;}
 }
 function flat(n){return [n,...n.children.flatMap(flat)];}
 const html=new E('html'),body=new E('body'),shell=new E('div'),canvas=new E('canvas');
 shell.id='tp-game-shell';canvas.id='tp';canvas.width=canvas.height=466;
 shell.clientWidth=shell.clientHeight=466;
 html.append(body);body.append(shell);shell.append(canvas);
 Object.assign(document,{
  documentElement:html,body,activeElement:null,
  createElement:tag=>new E(tag),
  createElementNS:(_ns,tag)=>new E(tag),
  createTextNode:text=>{const n=new E('#text');n.textContent=text;return n;},
  getElementById:id=>flat(html).find(n=>n.id===id)||null,
  querySelector:s=>html.querySelector(s),
  querySelectorAll:s=>html.querySelectorAll(s)
 });
 context.canvas=canvas;
 if(!context.TP)context.TP={screen:466,cx:233};
 if(!context.ResizeObserver)context.ResizeObserver=class{observe(){}disconnect(){}};
 if(!context.addEventListener)context.addEventListener=()=>{};
 if(context.ctx){
  context.ctx.canvas=canvas;
  context.ctx.measureText=s=>({width:String(s).length*6});
  context.ctx.createLinearGradient=()=>({addColorStop(){}});
  context.ctx.createRadialGradient=()=>({addColorStop(){}});
 }
 return {
  document,canvas,shell,flat,
  visibleTexts:()=>flat(body)
   .filter(n=>n.getClientRects().length&&n._text)
   .map(n=>n._text)
 };
}
module.exports={installDOM};
