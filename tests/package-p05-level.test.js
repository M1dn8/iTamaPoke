'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');

const context = {
  TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, DataView,
  Map, Set, console, crypto: crypto.webcrypto
};
vm.createContext(context);
vm.runInContext(
  fs.readFileSync('browser_ver/web/storage-tools.js', 'utf8'),
  context
);
const T = context.TPStoreTools;
let checks = 0;
function eq(actual, expected) {
  assert.deepEqual(actual, expected);
  checks++;
}
function pack(entries) {
  const fields = entries.map(([key, type, value]) => {
    const k = Buffer.from(key);
    let data;
    if (type === 0) data = Buffer.from([value ? 1 : 0]);
    else if (type === 1) {
      data = Buffer.alloc(8);
      data.writeBigInt64LE(BigInt(value));
    } else if (type === 2) data = Buffer.from(value, 'utf8');
    else data = Buffer.from(value);
    const length = Buffer.alloc(4);
    length.writeUInt32LE(data.length);
    return Buffer.concat([
      Buffer.from([k.length]), k, Buffer.from([type]), length, data
    ]);
  });
  const count = Buffer.alloc(4);
  count.writeUInt32LE(fields.length);
  return new Uint8Array(Buffer.concat([count, ...fields]));
}
function fixture({age = 95, dex = 1, bonus, type = 1} = {}) {
  const fields = [
    ['init', 0, true],
    ['dexn', 1, dex],
    ['eggT2', 1, 1],
    ['age', 1, age],
    ['future-p05', 2, 'preserve']
  ];
  if (bonus !== undefined) fields.push(['blvl', type, bonus]);
  return pack(fields);
}
function envelope(raw) {
  const metadata = Buffer.from(JSON.stringify({
    schema: 1,
    dexCount: 1025,
    payloadLength: raw.length,
    sha256: crypto.createHash('sha256').update(raw).digest('hex')
  }));
  const header = Buffer.alloc(12);
  header.set([84, 80, 83, 86]);
  header.writeUInt32LE(1, 4);
  header.writeUInt32LE(metadata.length, 8);
  return new Uint8Array(Buffer.concat([
    header, metadata, Buffer.from(raw)
  ]));
}
async function rejected(raw) {
  assert.throws(() => T.parseLegacy(raw));
  checks++;
  await assert.rejects(T.decode(raw));
  checks++;
  // A correct envelope checksum must not bypass payload validation.
  await assert.rejects(T.decode(envelope(raw)));
  checks++;
}

(async () => {
  const legacy = fixture();
  eq(T.parseLegacy(legacy).summary.level, 2);
  eq(T.parseLegacy(legacy).values.has('blvl'), false);
  eq((await T.decode(await T.seal(legacy, {}))).summary.level, 2);

  for (const age of [0, 59, 60, 95, 119, 120, 5880, 5940, 0xffffffff]) {
    for (const bonus of [0, 1, 50, 99]) {
      const raw = fixture({age, bonus});
      const expected = Math.min(100, 1 + Math.floor(age / 60) + bonus);
      const parsed = T.parseLegacy(raw);
      eq(parsed.summary.level, expected);
      eq(parsed.summary.age, age);
      eq(parsed.values.get('blvl').value, bonus);
      eq(parsed.values.get('future-p05').value, 'preserve');

      const decoded = await T.decode(await T.seal(raw, {
        note: 'P05 level fixture'
      }));
      eq(decoded.summary.level, expected);
      eq(Buffer.from(decoded.raw), Buffer.from(raw));
    }
  }

  eq(T.parseLegacy(fixture({age: 5880, bonus: 1})).summary.level, 100);
  eq(T.parseLegacy(fixture({age: 5940, bonus: 99})).summary.level, 100);

  for (const bonus of [-1, 100, 255, 256, 4294967296]) {
    await rejected(fixture({bonus}));
  }
  await rejected(fixture({bonus: true, type: 0}));
  await rejected(fixture({bonus: '1', type: 2}));
  await rejected(fixture({bonus: new Uint8Array([1]), type: 3}));
  await rejected(fixture({dex: -1, bonus: 1}));

  eq(T.parseLegacy(fixture({dex: -1, bonus: 0})).summary.dex, -1);
  eq(T.parseLegacy(fixture({dex: -1})).values.has('blvl'), false);

  const once = T.parseLegacy(fixture({bonus: 1}));
  eq(T.parseLegacy(once.raw).summary.level, once.summary.level);
  eq(T.parseLegacy(once.raw).values.get('blvl').value, 1);

  console.log(
    'P05 level storage passed: ' + checks +
    ' assertions; legacy default, strict bonus type/range, age unchanged, ' +
    'level cap, raw/sealed round trips, checked-envelope rejection, ' +
    'egg exclusion and unknown-field preservation. No combat wiring claimed.'
  );
})().catch(error => {
  console.error(error);
  process.exit(1);
});
