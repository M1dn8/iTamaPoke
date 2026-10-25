const assert=require('node:assert/strict'),fs=require('node:fs');
const expected=require('./fixtures/johto-gs-catalog.json'),arena=require('../browser_ver/web/arena-johto.js'),league=require('../browser_ver/web/league-johto-data.js');
assert.equal(arena.region,'Johto');assert.equal(arena.edition,'Gold/Silber');assert.equal(league.edition,'Gold/Silber');assert.equal(arena.leaders.length,8);assert.equal(league.elite.length,4);assert(league.elite.every(t=>t.length===5));assert.equal(league.champion.length,6);
const actual={arena:arena.leaders.map(({color,...a})=>a),league:{names:league.names,elite:league.elite,champion:league.champion}};
assert.deepEqual(actual.arena,expected.arena);assert.deepEqual(actual.league,expected.league);
function frozen(v){if(v&&typeof v==='object'){assert(Object.isFrozen(v));for(const item of Object.values(v))frozen(item);}}frozen(arena);frozen(league);
for(const a of arena.leaders){assert(/^#[0-9a-f]{6}$/i.test(a.color));for(const [dex,level]of a.team){assert(Number.isInteger(dex)&&dex>=1&&dex<=251);assert(level>=1&&level<=100);}}
if(process.env.TP_JOHTO_NATIVE){const native=JSON.parse(fs.readFileSync(process.env.TP_JOHTO_NATIVE,'utf8'));assert.deepEqual(native,actual);}
assert.deepEqual(league.champion,[[130,44],[149,47],[149,47],[142,46],[6,46],[149,50]]);
assert.equal(arena.leaders[0].name,'Falk');assert.equal(arena.leaders[0].badge,'Flügelorden');
console.log('Johto Gold/Silver JS catalog passed: golden roster fixture, exact native parity when supplied, deeply frozen data, German names/badges and original Champion levels. No runtime registration.');
