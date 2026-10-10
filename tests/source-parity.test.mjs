import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';

const original = readFileSync('ミニクラフト_Ver1.5.html', 'utf8');
const entry = readFileSync('index.html', 'utf8');
const css = readFileSync('src/styles/game.css', 'utf8');
const scripts = [...entry.matchAll(/<script src="\.\/(src\/js\/[^"]+)"\s*><\/script>/g)].map(m => m[1]);

test('the new entrypoint includes all ordered classic script parts', () => {
  assert.equal(scripts.length, 11);
  assert.equal(scripts[0], 'src/js/01-block-registry.js');
  assert.equal(scripts.at(-1), 'src/js/11-settings.js');
  assert.ok(entry.indexOf('three.min.js') < entry.indexOf(scripts[0]));
  assert.ok(!entry.includes('<style>'));
});

test('stylesheet is unchanged from the legacy snapshot', () => {
  const m = original.match(/<style>([\s\S]*?)<\/style>/);
  assert.ok(m);
  assert.equal(css, m[1]);
});

test('concatenated scripts are byte-for-byte equal to the original inline JavaScript', () => {
  const m = original.match(/<script>\n([\s\S]*?)\n<\/script><\/body><\/html>/);
  assert.ok(m);
  assert.equal(scripts.map(p => readFileSync(p, 'utf8')).join(''), m[1]);
});

test('each extracted JavaScript section parses', () => {
  for (const path of scripts) {
    assert.doesNotThrow(() => execFileSync(process.execPath, ['--check', path], {stdio: 'pipe'}), path);
  }
});
