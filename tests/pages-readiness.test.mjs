import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

// Deploy from a branch: main / (root) must work without any build step.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entryPath = join(root, 'index.html');
const html = readFileSync(entryPath, 'utf8');
const localScripts = [...html.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)].map(m => m[1]);
const localStyles = [...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"\s*>/g)].map(m => m[1]);
const linkedAssets = [...localScripts, ...localStyles];

test('root entrypoint is directly publishable by GitHub Pages', () => {
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /<canvas\s+id="c"><\/canvas>/);
  assert.ok(existsSync(join(root, '.nojekyll')), 'disable Jekyll preprocessing');
  assert.doesNotMatch(html, /<base\s+href=/i, 'do not override project-site base URL');
});

test('all local scripts and styles exist and use Pages-safe relative URLs', () => {
  assert.equal(localScripts.length, 15, 'Three.js CDN followed by 14 local game sections');
  assert.equal(localStyles.length, 1);
  assert.match(localScripts[0], /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\//);
  const actualLocalScripts = localScripts.slice(1);
  assert.equal(new Set(actualLocalScripts).size, 14);
  assert.ok(actualLocalScripts.every(src => src.startsWith('./src/js/')));
  assert.deepEqual(actualLocalScripts, readdirSync(join(root, 'src/js'))
    .filter(name => name.endsWith('.js')).sort().map(name => './src/js/' + name));
  assert.deepEqual(localStyles, ['./src/styles/game.css']);
  for (const path of [...actualLocalScripts, ...localStyles]) {
    assert.ok(path.startsWith('./'), `non-relative project asset: ${path}`);
    const file = resolve(root, path);
    assert.ok(!relative(root, file).startsWith('..' + sep), `asset escapes repository root: ${path}`);
    assert.ok(existsSync(file) && statSync(file).isFile(), `missing Pages asset: ${path}`);
  }
});

test('the HTML has no JavaScript build dependencies or upstream-specific absolute local URLs', () => {
  assert.doesNotMatch(html, /<script\s+type="module"/i);
  assert.doesNotMatch(html, /(?:src|href)="\/(?:src|assets|dist)\//i);
  assert.doesNotMatch(html, /(?:src|href)="(?:file:|\.\.\/)/i);
});
