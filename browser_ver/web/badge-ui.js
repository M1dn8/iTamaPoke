/* New simplified geometric interface drawings, no extracted game pixels. */
(function(){'use strict';const palette=['#8c9aa4','#439ac9','#c9a33d','#b97ca7','#c37396','#b99a38','#c45f42','#4d9372'];
function draw(id,x,y,r=24,owned=true,paint=ctx){paint.save();paint.translate(x,y);paint.scale(r/30,r/30);paint.strokeStyle=owned?'#344f45':'#94a095';paint.fillStyle=owned?palette[id]:'#d5dcd1';paint.lineWidth=2;
 function poly(points){paint.beginPath();points.forEach((p,i)=>i?paint.lineTo(...p):paint.moveTo(...p));paint.closePath();paint.fill();paint.stroke();}
 if(id===0){poly([[-12,-27],[12,-27],[27,-12],[27,12],[12,27],[-12,27],[-27,12],[-27,-12]]);paint.fillStyle=owned?'#e2e8e8':'#e6ebe2';poly([[0,-18],[18,0],[0,18],[-18,0]]);paint.beginPath();paint.moveTo(-12,-27);paint.lineTo(-18,0);paint.lineTo(-12,27);paint.moveTo(12,-27);paint.lineTo(18,0);paint.lineTo(12,27);paint.stroke();}
 else if(id===1){paint.beginPath();paint.moveTo(0,-29);paint.bezierCurveTo(42,8,20,29,0,29);paint.bezierCurveTo(-20,29,-42,8,0,-29);paint.fill();paint.stroke();}
 else if(id===2){const points=[];for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,d=i%2?18:29;points.push([Math.cos(a)*d,Math.sin(a)*d]);}poly(points);paint.fillStyle=owned?'#f3da7d':'#e8ede3';paint.beginPath();paint.arc(0,0,10,0,Math.PI*2);paint.fill();paint.stroke();}
 else if(id===3){for(let i=0;i<8;i++){const a=i*Math.PI/4;paint.fillStyle=owned?['#c77a9f','#af7db5','#7d91b6','#68a6a0','#7eac78','#c2af65','#ce976a','#c97c79'][i]:'#d5dcd1';paint.beginPath();paint.arc(Math.cos(a)*17,Math.sin(a)*17,10,0,Math.PI*2);paint.fill();paint.stroke();}paint.fillStyle=owned?'#f0d58c':'#e8ede3';paint.beginPath();paint.arc(0,0,10,0,Math.PI*2);paint.fill();paint.stroke();}
 else if(id===4){paint.beginPath();paint.moveTo(0,27);paint.bezierCurveTo(-48,-3,-19,-38,0,-14);paint.bezierCurveTo(19,-38,48,-3,0,27);paint.fill();paint.stroke();}
 else if(id===5){paint.beginPath();paint.arc(0,0,27,0,Math.PI*2);paint.fill();paint.stroke();paint.fillStyle=owned?'#f2dd91':'#e8ede3';paint.beginPath();paint.arc(0,0,16,0,Math.PI*2);paint.fill();paint.stroke();}
 else if(id===6)poly([[0,-29],[8,-12],[24,-20],[18,0],[28,8],[12,12],[0,29],[-12,12],[-28,8],[-18,0],[-24,-20],[-8,-12]]);
 else{paint.beginPath();paint.moveTo(-19,26);paint.bezierCurveTo(-37,-9,-5,-28,25,-28);paint.bezierCurveTo(26,7,8,34,-19,26);paint.fill();paint.stroke();paint.beginPath();paint.moveTo(-23,31);paint.lineTo(14,-17);paint.stroke();}paint.restore();}

// Original simplified Johto symbols, not extracted game graphics.
function drawJohto(id,x,y,r=24,owned=true,paint=ctx){if(!Number.isInteger(id)||id<0||id>7)return;const colors=['#8c9aa4','#7eac78','#aeb7bc','#82738a','#b53a3a','#8a9aab','#729baa','#a27819'];paint.save();paint.translate(x,y);paint.scale(r/30,r/30);paint.strokeStyle=owned?'#292831':'#94a095';paint.fillStyle=owned?colors[id]:'#d5dcd1';paint.lineWidth=2;
 const poly=pts=>{paint.beginPath();pts.forEach((p,i)=>i?paint.lineTo(...p):paint.moveTo(...p));paint.closePath();paint.fill();paint.stroke();};
 if(id===0){poly([[0,27],[-23,5],[-27,-15],[-12,-7],[0,-27],[12,-7],[27,-15],[23,5]]);paint.beginPath();paint.moveTo(0,-20);paint.lineTo(0,24);paint.stroke();}
 else if(id===1){for(const a of [-1,1]){paint.beginPath();paint.ellipse(a*12,0,13,22,a*.3,0,Math.PI*2);paint.fill();paint.stroke();}paint.fillStyle=owned?'#596b46':'#94a095';paint.beginPath();paint.ellipse(0,0,6,25,0,0,Math.PI*2);paint.fill();paint.stroke();}
 else if(id===2){poly([[0,-28],[25,0],[0,28],[-25,0]]);paint.fillStyle=owned?'#fff':'#e6e9de';paint.beginPath();paint.arc(0,0,10,0,Math.PI*2);paint.fill();paint.stroke();}
 else if(id===3){paint.beginPath();paint.moveTo(-23,23);paint.bezierCurveTo(-30,-31,30,-31,23,23);paint.lineTo(12,15);paint.lineTo(0,26);paint.lineTo(-12,15);paint.closePath();paint.fill();paint.stroke();paint.fillStyle='#fff';paint.fillRect(-12,-5,7,8);paint.fillRect(5,-5,7,8);}
 else if(id===4){poly([[-21,9],[-21,-13],[-12,-23],[-4,-16],[4,-23],[13,-16],[21,-15],[24,6],[12,25],[-10,25]]);paint.beginPath();paint.moveTo(-20,8);paint.lineTo(17,8);paint.stroke();}
 else if(id===5){poly([[-15,-25],[15,-25],[29,0],[15,25],[-15,25],[-29,0]]);poly([[0,-17],[16,0],[0,17],[-16,0]]);}
 else if(id===6){poly([[-27,16],[-17,-20],[-5,2],[4,-28],[15,0],[24,-13],[28,22],[0,29]]);paint.strokeStyle=owned?'#fff':'#94a095';paint.beginPath();paint.moveTo(0,-16);paint.lineTo(0,24);paint.stroke();}
 else{poly([[-25,23],[-20,-15],[-5,-5],[3,-28],[11,-8],[27,-22],[21,5],[7,25]]);paint.beginPath();paint.moveTo(-17,15);paint.lineTo(15,-8);paint.stroke();}
 paint.restore();}

window.TPBadgeUI=Object.freeze({draw,drawJohto});})();
