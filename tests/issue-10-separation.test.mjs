import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('player file responsibilities load in the exact original order (#10)',()=>{
 const index=readFileSync('index.html','utf8');
 const expected=['04-0-player-ui','04-1-input','04-2-containers','04-3-dropped-items'];
 const files=expected.map(name=>'src/js/'+name+'.js');
 const positions=files.map(f=>index.indexOf('./'+f));
 assert.ok(positions.every(p=>p>=0));
 assert.ok(positions.every((p,i)=>i===0||p>positions[i-1]));
 const content=files.map(f=>readFileSync(f,'utf8')).join('');
 assert.ok(content.includes('function save(man){'));
 assert.ok(content.includes("addEventListener('keydown'"));
 assert.ok(content.includes('function openChest('));
 assert.ok(content.includes('function spawnDrop('));
});
