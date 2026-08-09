import { NpmStats } from "./types";

const NPM_API = "https://api.npmjs.org";

interface NpmSearchResult {
  objects: { package: { name: string; publisher?: { username?: string } } }[];
}

interface NpmDownloads {
  downloads: number;
  package: string;
}

export async function fetchNpmStats(
  username: string
): Promise<NpmStats | null> {
  try {
    const res = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=maintainer:${username}&size=250`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const data: NpmSearchResult = await res.json();
    const packageNames = data.objects.map((o) => o.package.name);

    if (packageNames.length === 0) return null;

    const limitedNames = packageNames.slice(0, 200);
    const CONCURRENCY = 6;
    const results: { name: string; downloads: number }[] = new Array(
      limitedNames.length
    );
    let nextIndex = 0;

    async function worker() {
      while (true) {
        const i = nextIndex++;
        if (i >= limitedNames.length) break;
        const name = limitedNames[i];
        try {
          const r = await fetch(
            `${NPM_API}/downloads/point/last-month/${encodeURIComponent(name)}`,
            { next: { revalidate: 86400 } }
          );
          if (!r.ok) {
            results[i] = { name, downloads: 0 };
            continue;
          }
          const d: NpmDownloads = await r.json();
          results[i] = { name: d.package, downloads: d.downloads };
        } catch {
          results[i] = { name, downloads: 0 };
        }
      }
    }

    await Promise.all(
      Array.from(
        { length: Math.min(CONCURRENCY, limitedNames.length) },
        () => worker()
      )
    );

    const sorted = results
      .filter((p) => p.downloads > 0)
      .sort((a, b) => b.downloads - a.downloads);
    const totalDownloads = sorted.reduce((sum, p) => sum + p.downloads, 0);

    return { totalDownloads, packages: sorted };
  } catch {
    return null;
  }
}
