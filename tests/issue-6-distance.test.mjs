import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';

test('changing draw distance rebuilds the chunk queue without movement (#6)', () => {
 const world = readFileSync('src/js/03-world.js', 'utf8');
 const start = world.indexOf('let queue=[],lcx=');
 assert.ok(start >= 0);
 const C = new Map();
 const context = {
   RD: 2, P: { x: 0, z: 0 }, C, LIM: 500, _ck: -1,
   ck: (x,z) => x + ',' + z,
   getC: (x,z) => {
     const k=x+','+z;
     if(!C.has(k)) C.set(k,{cx:x,cz:z,v:false});
     return C.get(k);
   },
   mesh: c => {c.v = true},
   drop: () => {},
   performance: { now: () => 0 },
   Math
 };
 runInNewContext(world.slice(start), context);
 context.stream(true);
 const before = C.size;
 context.stream(true);
 assert.equal(C.size, before, 'unchanged radius should not enqueue more chunks');
 context.RD = 4;
 context.stream(true);
 assert.ok(C.size > before, 'larger radius must load more chunks without moving');
});
