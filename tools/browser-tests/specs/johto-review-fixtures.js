
'use strict';
const H=require('./helpers');
const F=require('../fixtures/kanto-hall.json');
const P=require('./story-fixtures');

function kantoWinnerFixture(kind='winner'){const base=H.fixture(0),extra={agver:1,agmask:255,lgver:1,lgkdone:true,lgkdate:kind==='legacy'?1600000000:1700000000};if(kind!=='legacy'){extra.lhver=kind==='future'?2:1;extra.lhdata=Buffer.from(F.hex,'hex');}const fields=[];for(const [key,value]of Object.entries(extra)){const k=Buffer.from(key),v=Buffer.isBuffer(value)?value:typeof value==='boolean'?Buffer.from([value?1:0]):(()=>{const b=Buffer.alloc(8);b.writeBigInt64LE(BigInt(value));return b;})();const size=Buffer.alloc(4);size.writeUInt32LE(v.length);fields.push(Buffer.concat([Buffer.from([k.length]),k,Buffer.from([Buffer.isBuffer(value)?3:typeof value==='boolean'?0:1]),size,v]));}const count=Buffer.alloc(4);count.writeUInt32LE(base.readUInt32LE(0)+fields.length);return Buffer.concat([count,base.subarray(4),...fields]);}

const definitions=[
 {name:'01-johto-ohne-orden',mask:0,unlocked:true},
 {name:'02-johto-ein-orden',mask:1,unlocked:true},
 {name:'03-johto-drei-orden',mask:7,unlocked:true},
 {name:'04-johto-vier-abwechselnd',mask:85,unlocked:true},
 {name:'05-johto-sieben-orden',mask:127,unlocked:true},
 {name:'06-johto-acht-orden',mask:255,unlocked:true},
 {name:'07-johto-vier-andere',mask:170,unlocked:true},
 {name:'08-kontrolle-johto-ohne-kanto-sieg',mask:255,unlocked:false}
];

function createCases(){
 const winner=kantoWinnerFixture('winner');
 return definitions.map(item=>({
  ...item,
  raw:P.withProgress(item.unlocked?winner:H.fixture(0),{
   kanto:255,johto:item.mask
  })
 }));
}
module.exports={definitions,createCases};
