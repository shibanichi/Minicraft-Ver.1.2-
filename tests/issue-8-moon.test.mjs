import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('moon traverses its arc throughout the night (#8)', () => {
  const src = readFileSync('src/js/02-renderer.js', 'utf8');
  const match = src.match(/const half=([^;]+);/);
  assert.ok(match, 'day/night half phase');
  const arc = (phase) => {
    const day = phase < .5;
    return Function('day', 'phase', 'return ' + match[1])(day, phase);
  };
  assert.equal(arc(.5), 0);
  assert.ok(arc(.625) > 0);
  assert.ok(arc(.875) > arc(.625));
  assert.ok(arc(.999) < 1 && arc(.999) > .99);
  assert.equal(arc(.25), .5);
});
