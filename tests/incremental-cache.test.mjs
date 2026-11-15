import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise our adapter against the cache interfaces without external storage.
function harness({ failRead = false, failWrite = false } = {}) {
  const entries = new Map();
  const fallbackReads = [];
  const errors = [];
  const cache = {
    async match(key) { if (failRead) throw Error('read failed'); return entries.get(key)?.clone(); },
    async put(key, response) { if (failWrite) throw Error('write failed'); entries.set(key, response); },
    async delete(key) { return entries.delete(key); },
  };
  const source = fs.readFileSync(new URL('../src/lib/expiring-kv-cache.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(js, {
    module: compiledModule, exports: compiledModule.exports, Response, Date,
    process: { env: { NEXT_BUILD_ID: 'test-build' } },
    caches: { open: async () => cache },
    require(name) {
      if (name.endsWith('/logger.js')) return { error: (...args) => errors.push(args) };
      if (name.endsWith('/kv-incremental-cache')) return { default: { name: 'kv', get: async (...args) => { fallbackReads.push(args); return null; } } };
      throw Error('Unexpected dependency: ' + name);
    },
  });
  return { adapter: compiledModule.exports.default, entries, fallbackReads, errors };
}

test('ISR writes only to Cache API, keeps build/type isolation and reads stored values', async () => {
  const h = harness();
  await h.adapter.set('/ofershap', { html: 'profile' }, 'cache');
  assert.equal(h.entries.size, 1);
  const [key, response] = [...h.entries][0];
  assert.equal(key, 'http://cache.local/test-build/ofershap.cache');
  assert.equal(response.headers.get('cache-control'), 'max-age=604800');
  assert.deepEqual((await h.adapter.get('/ofershap', 'cache')).value, { html: 'profile' });
  assert.equal(h.fallbackReads.length, 0);
  assert.equal(await h.adapter.get('/ofershap', 'fetch'), null);
  assert.equal(h.fallbackReads.length, 1);
});

test('ISR miss/failure falls back read-only and write failures do not break the page', async () => {
  const h = harness({ failRead: true, failWrite: true });
  assert.equal(await h.adapter.get('missing', 'cache'), null);
  assert.equal(h.fallbackReads.length, 1);
  await assert.doesNotReject(h.adapter.set('missing', {}, 'cache'));
  assert.equal(h.errors.length, 2);
});

test('ISR delete removes the page entry from Cache API', async () => {
  const h = harness();
  await h.adapter.set('ofershap', {}, 'cache');
  await h.adapter.delete('ofershap');
  assert.equal(h.entries.size, 0);
});
