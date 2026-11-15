// Supported OpenNext custom-worker entry point. Build generates the import.
import handler from './.open-next/worker.js';
import { applyCachePolicy } from './cloudflare/cache-policy.mjs';
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js';
const worker = {
  async fetch(request, env, ctx) {
    return applyCachePolicy(request, await handler.fetch(request, env, ctx));
  },
};

export default worker;
