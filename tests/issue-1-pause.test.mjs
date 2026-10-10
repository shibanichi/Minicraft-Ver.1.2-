import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

test('paused frame renders but never advances simulation (#1)', () => {
  const src=readFileSync('src/js/08-game-loop.js','utf8');
  const code=src.slice(src.indexOf('function loop(now){'));
  assert.ok(code.startsWith('function loop(now){'));
  let rendered=0,scheduled=0;
  const ctx={pauseMenuOpen:true,last:0,ren:{render:()=>rendered++},scene:{},cam:{},
    requestAnimationFrame:()=>scheduled++,Math};
  vm.runInNewContext(code,ctx);
  ctx.loop(1337);
  assert.equal(ctx.last,1337);
  assert.equal(rendered,1);
  assert.equal(scheduled,2,'initial animation registration plus paused frame');
  assert.equal(ctx.fr,undefined,'gameplay update should be bypassed');
});
test('paused input cannot manipulate world or continue held actions (#1)',()=>{
  const src=readFileSync('src/js/04-player-ui.js','utf8');
  assert.match(src,/keydown',e=>\{if\(pauseMenuOpen\)/);
  assert.match(src,/mousedown',e=>\{\s*if\(pauseMenuOpen\|\|/);
  assert.match(src,/if\(pauseMenuOpen\|\|e\.button!==0/);
  assert.match(src,/if\(pauseMenuOpen\|\|e\.button!==2/);
  assert.match(src,/pauseMenuOpen=true;[^\n]*leftBreakHeld=false;/);
});
