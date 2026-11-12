import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const code=stripTypeScriptTypes(readFileSync(new URL('../lib/game.ts',import.meta.url),'utf8'));
const {newDeck,listeningChoices,targetLetters,distractorLetters}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('six rounds give equal practice to Seen and Sheen',()=>{
 for(let n=0;n<100;n++){const deck=newDeck();assert.equal(deck.length,6);assert.equal(deck.filter(i=>i===0).length,3);assert.equal(deck.filter(i=>i===1).length,3)}
});
test('each listening round has one target and four distinct other letters',()=>{
 for(const target of [0,1])for(let n=0;n<200;n++){
  const choices=listeningChoices(target);assert.equal(choices.length,5);assert.equal(new Set(choices).size,5);
  assert.equal(choices.filter(c=>c===targetLetters[target]).length,1);
  assert(!choices.includes(targetLetters[1-target]));
  assert.equal(choices.filter(c=>distractorLetters.includes(c)).length,4);
 }
});
test('invalid targets cannot create an unanswerable round',()=>{assert.throws(()=>listeningChoices(-1),RangeError);assert.throws(()=>listeningChoices(2),RangeError)});
