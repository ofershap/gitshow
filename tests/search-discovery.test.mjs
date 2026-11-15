import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const sitemap=fs.readFileSync(new URL('../public/sitemap.xml',import.meta.url),'utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
test('sitemap keeps the36canonical public URLs without invented dates',()=>{
 assert.equal(urls.length,36);assert.equal(new Set(urls).size,36);
 assert.ok(urls.every(u=>u.startsWith('https://gitshow.dev')));
 for(const u of ['https://gitshow.dev','https://gitshow.dev/ofershap','https://gitshow.dev/vercel/next.js'])assert.ok(urls.includes(u));
 assert.ok(!sitemap.includes('<lastmod>'));assert.ok(!urls.some(u=>u.includes('/api/')));
});
test('crawler discovery routes are static, not Next worker routes',()=>{
 for(const f of ['robots.ts','sitemap.ts'])assert.ok(!fs.existsSync(new URL('../src/app/'+f,import.meta.url)));
 const robots=fs.readFileSync(new URL('../public/robots.txt',import.meta.url),'utf8');
 assert.match(robots,/User-Agent: \*/i);assert.match(robots,/Allow: \//);assert.match(robots,/Disallow: \/api\//);assert.match(robots,/Sitemap: https:\/\/gitshow.dev\/sitemap.xml/);
});
