 'use strict';
const assert=require('node:assert/strict');
const P=require('../browser_ver/web/suicune-source-preview.js');
let solved=0;
for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++){
 const v=P.createRound([a,b,c]).view();
 if(v.solved){solved++;assert.equal(a,2);assert.equal(b,0);assert([0,2].includes(c));}
}
assert.equal(solved,2);
const round=P.createRound();
for(const index of [0,0,1,1,1,2])assert.equal(round.rotate(index),true);
assert.equal(round.view().solved,true);
assert.equal(round.rotate(0),false);
assert.deepEqual([...round.view().connected],[0,1,2]);
for(const bad of [[],[0,1],[0,1,4],[0,-1,1],null])
 assert.throws(()=>P.createRound(bad));
assert.equal(P.cases.length,8);
assert.equal(new Set(P.cases.map(c=>c.name)).size,8);
console.log('P07a water prototype passed: 64 rotations, two genuinely connected solutions, playable route, solved lock and strict input validation. No native/save authority.');
