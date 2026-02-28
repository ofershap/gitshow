import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRepoShowroom, RepoNotFoundError } from "@/lib/github-repo";
import { RepoHero } from "@/components/repo/RepoHero";
import { RepoAchievements } from "@/components/repo/RepoAchievements";
import { TeamSection } from "@/components/repo/TeamSection";
import { DiscussionList } from "@/components/repo/DiscussionList";
import { LanguageBar } from "@/components/repo/LanguageBar";
import { CommitSparkline } from "@/components/repo/CommitSparkline";
import { CommunityHealth } from "@/components/repo/CommunityHealth";
import { RepoAgentSummary } from "@/components/repo/RepoAgentSummary";
import { Footer } from "@/components/footer";
import { JsonLd, repoShowroomJsonLd } from "@/components/json-ld";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ username: string; repo: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username: owner, repo } = await params;
  const url = `https://gitshow.dev/${owner}/${repo}`;

  try {
    const data = await fetchRepoShowroom(owner, repo);
    const title = `${data.repo.full_name} — Open Source Showroom`;
    const langInfo = data.repo.language ? ` Built with ${data.repo.language}.` : "";
    const desc =
      data.repo.description
        ? `${data.repo.description} — ${data.repo.stargazers_count} stars, ${data.contributors.length} contributors.${langInfo}`
        : `Open source project: ${data.repo.stargazers_count} stars, ${data.contributors.length} contributors.${langInfo}`;

    const ogImage = `/api/og/${owner}/${repo}?v=${Math.floor(Date.now() / 3600000)}`;

    return {
      title,
      description: desc,
      keywords: [
        data.repo.name,
        owner,
        ...(data.repo.topics ?? []),
        data.repo.language,
        "open source",
        "github",
      ].filter(Boolean) as string[],
      alternates: { canonical: url },
      openGraph: {
        title,
        description: desc,
        url,
        siteName: "GitShow",
        locale: "en_US",
        images: [{ url: ogImage, width: 1200, height: 630, alt: `${data.repo.full_name} on GitShow` }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        site: "@ofaborsh",
        title,
        description: desc,
        images: [ogImage],
      },
    };
  } catch {
    return { title: `${owner}/${repo} — GitShow`, alternates: { canonical: url } };
  }
}

export default async function RepoShowroomPage({ params }: PageProps) {
  const { username: owner, repo } = await params;

  let data;
  try {
    data = await fetchRepoShowroom(owner, repo);
  } catch (error) {
    if (error instanceof RepoNotFoundError) notFound();
    throw error;
  }

  const hasLangsOrSparkline =
    data.languages.length > 0 || data.weeklyCommits.length > 0;

  const jsonLdItems = repoShowroomJsonLd(data);

  return (
    <article className="mx-auto min-h-screen max-w-4xl px-4 py-12 md:px-6 md:py-16">
      {jsonLdItems.map((item, i) => (
        <JsonLd key={i} data={item} />
      ))}
      <nav className="mb-6 flex items-center gap-1.5 font-mono text-xs text-zinc-500 animate-fade-up">
        <a href="/" className="transition hover:text-teal-400">GitShow</a>
        <span className="text-zinc-600">/</span>
        <a href={`/${owner}`} className="transition hover:text-teal-400">{owner}</a>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">{repo}</span>
      </nav>
      <div className="animate-fade-up">
        <RepoHero data={data} />
      </div>

      <div className="mt-12 animate-fade-up stagger-2">
        <RepoAchievements data={data} />
      </div>

      <div className="mt-20 animate-fade-up stagger-3">
        <TeamSection
          contributors={data.contributors}
          contributorCount={data.contributorCount}
          repoUrl={data.repo.html_url}
        />
      </div>

      {hasLangsOrSparkline && (
        <>
          <div className="mt-8 grid gap-6 animate-fade-up stagger-4 md:grid-cols-2">
            {data.languages.length > 0 && (
              <LanguageBar
                languages={data.languages}
                repoUrl={data.repo.html_url}
              />
            )}
            {data.weeklyCommits.length > 0 && (
              <CommitSparkline
                weeklyCommits={data.weeklyCommits}
                repoUrl={data.repo.html_url}
              />
            )}
          </div>
        </>
      )}

      {data.communityHealth && (
        <div className="mt-8 animate-fade-up stagger-5">
          <CommunityHealth
            health={data.communityHealth}
            repoUrl={data.repo.html_url}
          />
        </div>
      )}

      <div
        className="my-20 h-px w-full shrink-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        aria-hidden
      />

      <div className="animate-fade-up stagger-6">
        <DiscussionList
          items={data.recentActivity.filter((i) => i.state === "open")}
          repoUrl={data.repo.html_url}
          statusData={data}
        />
      </div>

      <div className="mt-8 animate-fade-up stagger-7">
        <DiscussionList
          items={data.recentActivity.filter((i) => i.state === "closed")}
          repoUrl={data.repo.html_url}
          variant="merged"
        />
      </div>

      <div className="mt-20">
        <RepoAgentSummary owner={owner} repo={repo} data={data} />
      </div>

      <div
        className="my-20 h-px w-full shrink-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        aria-hidden
      />

      <Footer />
    </article>
  );
}
