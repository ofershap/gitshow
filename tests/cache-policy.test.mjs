import test from 'node:test';
import assert from 'node:assert/strict';
import {applyCachePolicy} from '../cloudflare/cache-policy.mjs';
const base='https://gitshow.dev';
const response=(status=200,headers={})=>new Response(status===204?null:'public',{status,headers:{'cache-control':'s-maxage=86400, stale-while-revalidate=2592000','vary':'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Url',...headers}});
for(const path of ['/','/ofershap','/ofershap/gitshow','/api/og','/api/og/ofershap','/api/og/ofershap/gitshow','/api/card/ofershap']) {
 test('preserves public TTL and variants '+path,()=>{
  const r=applyCachePolicy(new Request(base+path),response());
  assert.equal(r.headers.get('cache-control'),'s-maxage=86400, stale-while-revalidate=2592000');
  for(const v of ['RSC','Next-Router-State-Tree','Next-Router-Prefetch','Next-Url','Cookie','Authorization','Host']) assert.ok(r.headers.get('vary').includes(v));
 });
}
for(const [name,path,method,req,res] of [
 ['unknown route','/internal/admin/details','GET',{},response()],
 ['unknown API','/api/admin','GET',{},response()],
 ['higher-priority zero TTL','/ofershap','GET',{},response(200,{'cdn-cache-control':'max-age=0'})],
 ['highest-priority zero TTL','/ofershap','GET',{},response(200,{'cloudflare-cdn-cache-control':'max-age=0'})],
 ['post','/ofershap','POST',{},response()],
 ['cookie','/ofershap','GET',{'cookie':'session=example'},response()],
 ['authorization','/ofershap','GET',{'authorization':'Bearer test'},response()],
 ...[301,302,307,308,400,401,403,404,429,500,503].map(s=>['status '+s,'/ofershap','GET',{},response(s)]),
 ...['private, max-age=100','no-store','no-cache','max-age=0',''].map(s=>['control '+s,'/ofershap','GET',{},response(200,{'cache-control':s})]),
 ['cookie set','/ofershap','GET',{},response(200,{'set-cookie':'sid=test'})],
 ['cdn private','/ofershap','GET',{},response(200,{'cdn-cache-control':'private'})],
 ['cf private','/ofershap','GET',{},response(200,{'cloudflare-cdn-cache-control':'no-store'})],
 ]) test('does not cache '+name,()=>{
 const r=applyCachePolicy(new Request(base+path,{method,headers:req}),res);
 assert.equal(r.headers.get('cloudflare-cdn-cache-control'),'no-store');
 assert.equal(r.headers.get('cache-control'),'private, no-store');
 });
test('HEAD preserves a public response',()=>assert.equal(applyCachePolicy(new Request(base+'/ofershap',{method:'HEAD'}),response()).status,200));
test('RSC and prefetch retain content type and Next dimensions',()=>{
 const r=applyCachePolicy(new Request(base+'/ofershap',{headers:{RSC:'1','Next-Router-Prefetch':'1'}}),response(200,{'content-type':'text/x-component'}));
 assert.equal(r.headers.get('content-type'),'text/x-component');
 assert.ok(r.headers.get('vary').includes('RSC'));
});
