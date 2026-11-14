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
      `https://registry.npmjs.org/-/v1/search?text=maintainer:${username}&size=250`
    );
    if (!res.ok) return null;

    const data: NpmSearchResult = await res.json();
    const packageNames = data.objects.map((o) => o.package.name);

    if (packageNames.length === 0) return null;

    const limitedNames = packageNames.slice(0, 200);
    // Scoped packages are not supported by the bulk endpoint; fetch them individually.
    const bulkNames = limitedNames.filter((n) => !n.startsWith("@"));
    const scopedNames = limitedNames.filter((n) => n.startsWith("@"));
    const results: { name: string; downloads: number }[] = [];
    for (const name of scopedNames) {
      try {
        const r = await fetch(
          `${NPM_API}/downloads/point/last-month/${encodeURIComponent(name)}`
        );
        if (!r.ok) {
          results.push({ name, downloads: 0 });
          continue;
        }
        const d: NpmDownloads = await r.json();
        results.push({ name: d.package, downloads: d.downloads });
      } catch {
        results.push({ name, downloads: 0 });
      }
    }
    // Bulk endpoint: one subrequest per chunk instead of one per package.
    // Per-package fetching (up to 200 requests) blows the Cloudflare
    // Workers subrequest limit on accounts with many packages.
    const CHUNK = 100;
    for (let start = 0; start < bulkNames.length; start += CHUNK) {
      const chunk = bulkNames.slice(start, start + CHUNK);
      try {
        const r = await fetch(
          `${NPM_API}/downloads/point/last-month/${chunk.join(",")}`
        );
        if (!r.ok) continue;
        const data = (await r.json()) as Record<string, NpmDownloads | null>;
        for (const name of chunk) {
          const d = data[name];
          results.push({ name, downloads: d?.downloads ?? 0 });
        }
      } catch {
        // skip chunk; others may still succeed
      }
    }

    const sorted = results
      .filter((p) => p.downloads > 0)
      .sort((a, b) => b.downloads - a.downloads);
    const totalDownloads = sorted.reduce((sum, p) => sum + p.downloads, 0);

    return { totalDownloads, packages: sorted };
  } catch {
    return null;
  }
}
