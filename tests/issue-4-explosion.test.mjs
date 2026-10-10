import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

test('creeper explosion drops chest contents and removes container data (#4)', () => {
  const src=readFileSync('src/js/05-entities.js','utf8');
  const code=src.slice(src.indexOf('function explode(m){'),src.indexOf('function stepMob('));
  assert.ok(code.startsWith('function explode(m){'));
  const dropped=[],changes=[],chests={'1,5,1':[[1001,4],null]},cleared=[];
  const ctx={H:80,FL:new Uint8Array(256),CONTB:new Map([[40,27]]),chests,
    getB:(x,y,z)=>x===1&&y===5&&z===1?40:0,
    spawnDrop:(...a)=>dropped.push(a),applyChanges:c=>changes.push(...c),
    P:{x:100,y:100,z:100},shieldUp:false,Math,
    rmMob:()=>cleared.push(true)};
  vm.runInNewContext(code,ctx);
  ctx.explode({x:1.5,y:4.5,z:1.5});
  assert.equal(chests['1,5,1'],undefined);
  assert.equal(dropped.length,1);
  assert.deepEqual(dropped[0].slice(0,2),[1001,4]);
  assert.ok(changes.some(([x,y,z,v])=>x===1&&y===5&&z===1&&v===0));
  assert.equal(cleared.length,1);
});
