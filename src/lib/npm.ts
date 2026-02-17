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
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data: NpmSearchResult = await res.json();
    const packageNames = data.objects.map((o) => o.package.name);

    if (packageNames.length === 0) return null;

    const BATCH_SIZE = 50;
    const batches: string[][] = [];
    for (let i = 0; i < Math.min(packageNames.length, 200); i += BATCH_SIZE) {
      batches.push(packageNames.slice(i, i + BATCH_SIZE));
    }

    const allPackages: { name: string; downloads: number }[] = [];

    for (const batch of batches) {
      const results = await Promise.all(
        batch.map(async (name) => {
          try {
            const r = await fetch(
              `${NPM_API}/downloads/point/last-month/${encodeURIComponent(name)}`,
              { next: { revalidate: 3600 } }
            );
            if (!r.ok) return { name, downloads: 0 };
            const d: NpmDownloads = await r.json();
            return { name: d.package, downloads: d.downloads };
          } catch {
            return { name, downloads: 0 };
          }
        })
      );
      allPackages.push(...results);
    }

    const sorted = allPackages
      .filter((p) => p.downloads > 0)
      .sort((a, b) => b.downloads - a.downloads);
    const totalDownloads = sorted.reduce((sum, p) => sum + p.downloads, 0);

    return { totalDownloads, packages: sorted };
  } catch {
    return null;
  }
}
