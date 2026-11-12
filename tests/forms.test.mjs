import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const code=stripTypeScriptTypes(readFileSync(new URL('../lib/forms.ts',import.meta.url),'utf8'));
const {letterForm,formPositions}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('Seen and Sheen have the four correct joining sequences',()=>{
 assert.deepEqual(formPositions.map(p=>letterForm('س',p.id)),['سـ','ـسـ','ـس','س']);
 assert.deepEqual(formPositions.map(p=>letterForm('ش',p.id)),['شـ','ـشـ','ـش','ش']);
});
test('hands point toward the joining neighbours in right-to-left text',()=>{
 assert.deepEqual(formPositions.map(p=>[p.left,p.right]),[[true,false],[true,true],[false,true],[false,false]]);
});
test('fatḥa stays on the letter while preserving both connectors',()=>{
 for(const letter of ['س','ش'])for(const p of formPositions){const result=letterForm(letter,p.id,true);assert(result.includes(letter+'َ'));assert.equal(result.replace('َ',''),letterForm(letter,p.id))}
});
