import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/lib/profile-fields.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { profileRepoFields, profileUserFields } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const repo = { name: 'sample', description: 'עברית and English', html_url: 'https://github.com/example/sample', homepage: null, stargazers_count: 0, forks_count: 2, language: null, topics: ['mcp','react'], fork: false, archived: false, pushed_at: '2026-11-15T00:00:00Z', created_at: '2025-01-01T00:00:00Z', updated_at: '2026-11-15T00:00:00Z' };
const user = { login: 'example', name: null, avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4', html_url: 'https://github.com/example', bio: null, company: null, location: null, blog: '', twitter_username: null, public_repos: 0, followers: 0, following: 1, created_at: '2020-01-01T00:00:00Z' };
test('repository projection preserves the full typed display contract and order without raw REST extras', () => {
 const raw = {...repo, owner: {large: 'x'.repeat(5000)}, permissions: {push: false}, events_url: 'https://api.github.com/repos/example/sample/events'};
 assert.deepEqual(profileRepoFields(raw), repo);
 assert.deepEqual(Object.keys(profileRepoFields(raw)), Object.keys(repo));
 assert.deepEqual([raw,{...raw,name:'other'}].map(profileRepoFields).map(r=>r.name),['sample','other']);
 assert.equal(raw.owner.large.length,5000);
});
test('user projection keeps nulls/zeroes and all typed fields without incidental API state', () => {
 assert.deepEqual(profileUserFields({...user, plan: {name:'free'}, events_url: 'unused'}),user);
});
test('repository projection retains every field read by category search, ranking and rendering', () => {
 const ui = fs.readFileSync(new URL('../src/components/category-section.tsx',import.meta.url),'utf8');
 const reads = [...ui.matchAll(/(?:repo|r)\.([a-z_]+)/g)].map(m=>m[1]);
 for(const field of reads) assert.ok(Object.hasOwn(profileRepoFields(repo),field),field);
 const model = fs.readFileSync(new URL('../src/lib/types.ts',import.meta.url),'utf8');
 for (const [name,projected] of [['GitHubRepo',profileRepoFields(repo)],['GitHubUser',profileUserFields(user)]]) {
  const block=model.match(new RegExp('export interface '+name+' \\{([\\s\\S]*?)\\n\\}'))[1];
  const keys=[...block.matchAll(/^  ([a-z_]+):/gm)].map(m=>m[1]).sort();
  assert.deepEqual(Object.keys(projected).sort(),keys);
 }
});
