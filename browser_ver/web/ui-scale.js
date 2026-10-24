/* Canvas is the reference. Only typography/stroke tokens follow its scale.
   DOM pages keep their native size, flow and scrolling; no page transforms. */
(function(){'use strict';const BASE=466;let current=1,lastWidth=-1;
 function sync(){const shell=document.getElementById('tp-game-shell'),canvas=document.getElementById('tp');if(!shell||!canvas)return;const width=canvas.getBoundingClientRect().width;if(!Number.isFinite(width)||width<=0||Math.abs(width-lastWidth)<.01)return;lastWidth=width;current=width/BASE;
  const tokens={'--tp-ui-scale':current,'--tp-canvas-title':20*current+'px','--tp-canvas-body':13*current+'px','--tp-canvas-control':14*current+'px','--tp-canvas-section':14*current+'px','--tp-canvas-caption':11*current+'px','--tp-canvas-small':10*current+'px','--tp-canvas-stroke':2*current+'px','--tp-canvas-radius':8*current+'px','--tp-canvas-space':9*current+'px'};
  for(const [name,value]of Object.entries(tokens))shell.style.setProperty(name,String(value));
 }
 window.TPUIScale=Object.freeze({sync,base:BASE,get scale(){return current;}});sync();const canvas=document.getElementById('tp');if(canvas&&typeof ResizeObserver==='function')new ResizeObserver(sync).observe(canvas);window.addEventListener('resize',sync);window.addEventListener('pageshow',sync);
})();
