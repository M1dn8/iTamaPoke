/* New simplified geometric interface drawings, no extracted game pixels. */
(function(){'use strict';const palette=['#8c9aa4','#439ac9','#c9a33d','#b97ca7','#c37396','#b99a38','#c45f42','#4d9372'];
function draw(id,x,y,r=24,owned=true){ctx.save();ctx.translate(x,y);ctx.scale(r/30,r/30);ctx.strokeStyle=owned?'#344f45':'#94a095';ctx.fillStyle=owned?palette[id]:'#d5dcd1';ctx.lineWidth=2;
 function poly(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();ctx.stroke();}
 if(id===0){poly([[-12,-27],[12,-27],[27,-12],[27,12],[12,27],[-12,27],[-27,12],[-27,-12]]);ctx.fillStyle=owned?'#e2e8e8':'#e6ebe2';poly([[0,-18],[18,0],[0,18],[-18,0]]);ctx.beginPath();ctx.moveTo(-12,-27);ctx.lineTo(-18,0);ctx.lineTo(-12,27);ctx.moveTo(12,-27);ctx.lineTo(18,0);ctx.lineTo(12,27);ctx.stroke();}
 else if(id===1){ctx.beginPath();ctx.moveTo(0,-29);ctx.bezierCurveTo(42,8,20,29,0,29);ctx.bezierCurveTo(-20,29,-42,8,0,-29);ctx.fill();ctx.stroke();}
 else if(id===2){const points=[];for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,d=i%2?18:29;points.push([Math.cos(a)*d,Math.sin(a)*d]);}poly(points);ctx.fillStyle=owned?'#f3da7d':'#e8ede3';ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();ctx.stroke();}
 else if(id===3){for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.fillStyle=owned?['#c77a9f','#af7db5','#7d91b6','#68a6a0','#7eac78','#c2af65','#ce976a','#c97c79'][i]:'#d5dcd1';ctx.beginPath();ctx.arc(Math.cos(a)*17,Math.sin(a)*17,10,0,Math.PI*2);ctx.fill();ctx.stroke();}ctx.fillStyle=owned?'#f0d58c':'#e8ede3';ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();ctx.stroke();}
 else if(id===4){ctx.beginPath();ctx.moveTo(0,27);ctx.bezierCurveTo(-48,-3,-19,-38,0,-14);ctx.bezierCurveTo(19,-38,48,-3,0,27);ctx.fill();ctx.stroke();}
 else if(id===5){ctx.beginPath();ctx.arc(0,0,27,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=owned?'#f2dd91':'#e8ede3';ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();ctx.stroke();}
 else if(id===6)poly([[0,-29],[8,-12],[24,-20],[18,0],[28,8],[12,12],[0,29],[-12,12],[-28,8],[-18,0],[-24,-20],[-8,-12]]);
 else{ctx.beginPath();ctx.moveTo(-19,26);ctx.bezierCurveTo(-37,-9,-5,-28,25,-28);ctx.bezierCurveTo(26,7,8,34,-19,26);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-23,31);ctx.lineTo(14,-17);ctx.stroke();}ctx.restore();}
window.TPBadgeUI=Object.freeze({draw});})();
