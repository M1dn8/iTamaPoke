'use strict';
const assert=require('node:assert/strict');
const G=require('../browser_ver/web/ice-cave-game.js');

const round=G.createRound();
assert.equal(round.view().phase,'idle');
assert(round.start(1000));
assert(!round.start(1000));
const first=round.view().targets[0].id;
assert(round.hit(first,1100));
assert(!round.hit(first,1100));
for(let i=1;i<10;i++){
 const now=1000+i*550+100;
 const targets=round.tick(now).targets;
 assert(round.hit(targets[targets.length-1].id,now));
}
assert.equal(round.view().hits,10);
assert.equal(round.view().phase,'complete');
assert(!round.start(7000));
assert(!round.hit(first,7000));
assert(Object.isFrozen(round.view()));
assert(Object.isFrozen(round.view().targets));

const failed=G.createRound();
failed.start(0);
const old=failed.view().targets[0].id;
assert.equal(failed.tick(10000).phase,'failed');
assert(!failed.hit(old,10000));
assert(failed.start(11000));
assert.equal(failed.view().hits,0);
assert.equal(failed.view().remaining,10000);
assert(!failed.hit(old,11000));
const expired=failed.view().targets[0].id;
failed.tick(12801);
assert(!failed.hit(expired,12801));
assert.equal(failed.view().hits,0);
failed.cancel();
assert.equal(failed.view().phase,'idle');
assert(failed.start(13000));
assert.throws(()=>failed.tick(12999),/INVALID_GAME_CLOCK/);
assert.throws(()=>failed.tick(NaN),/INVALID_GAME_CLOCK/);

const nine=G.createRound();
nine.start(0);
for(let i=0;i<9;i++){
 const now=i*550+100,targets=nine.tick(now).targets;
 assert(nine.hit(targets[targets.length-1].id,now));
}
assert.equal(nine.tick(10000).phase,'failed');
assert.equal(nine.view().hits,9);

const translations={};
globalThis.TPText={
 registerLocale(code,entries){translations[code]=entries;},
 t(key){return translations.de[key];}
};
assert.equal(G.text('failed'),
 'Der Schneesturm ist zu stark, ich muss es noch einmal versuchen.');
for(const code of ['de','en','es','fr']){
 assert.equal(Object.keys(translations[code]).length,9);
 assert.equal(typeof translations[code]['articunoGame.again'],'string');
}
delete globalThis.TPText;

console.log('Arktos ice game logic passed: ten distinct hits, ten-second '+
 'deadline, nine-hit failure, duplicate/expired/old-attempt refusal, '+
 'free reset/retry, cancel and immutable views. Exact German failure '+
 'message and four locale catalogues verified. Pure round logic; '+
 'no DOM/touch/save acceptance claim.');

// P06 random icicle positions
const positions=[0.12,0.83,0.31,0.94];
let positionIndex=0;
const randomRound=G.createRound(()=>positions[positionIndex++]);
randomRound.start(0);
const randomView=randomRound.tick(1650);
assert.deepEqual(randomView.targets.map(target=>target.x),positions);
assert.throws(
 ()=>G.createRound(()=>NaN).start(0),
 /INVALID_GAME_RANDOM/
);
console.log(
 'Arktos random positions passed: injected random coordinates, '+
 'non-sequential positions and invalid random value refusal.'
);
