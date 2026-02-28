import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProfile, NotFoundError } from "@/lib/github";
import { HeroCard } from "@/components/hero-card";
import { CategorySection } from "@/components/category-section";
import { NpmCard } from "@/components/npm-card";
import { TechStack } from "@/components/tech-stack";
import { TopicCloud } from "@/components/topic-cloud";
import { ShareBar } from "@/components/share-bar";
import { SocialLinks } from "@/components/social-links";
import { Footer } from "@/components/footer";
import { JsonLd, profilePageJsonLd } from "@/components/json-ld";
import { ContributionsCard, shouldShowContributions, shouldShowContributionsFirst } from "@/components/contributions-card";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profileUrl = `https://gitshow.dev/${username}`;

  try {
    const { user, totalStars, repos, contributions } = await fetchProfile(username);
    const displayName = user.name ?? user.login;
    const title = `${displayName} — Developer Portfolio`;
    const contribMeta = contributions && contributions.topRepos.length >= 2
      ? `, contributor to ${contributions.totalReposContributedTo} projects`
      : "";
    const description = `${displayName}'s open source portfolio: ${repos.length} projects, ${totalStars} stars${contribMeta}${user.bio ? `. ${user.bio}` : ""}`;

    const ogImage = `/api/og/${username}?v=${Math.floor(Date.now() / 3600000)}`;

    return {
      title,
      description,
      alternates: {
        canonical: profileUrl,
      },
      openGraph: {
        title,
        description,
        url: profileUrl,
        siteName: "GitShow",
        locale: "en_US",
        images: [{ url: ogImage, width: 1200, height: 630, alt: `${displayName}'s developer portfolio on GitShow` }],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        site: "@ofaborsh",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: `${username} — GitShow`,
      alternates: { canonical: profileUrl },
    };
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  let data;
  try {
    data = await fetchProfile(username);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const {
    user,
    repos,
    languages,
    categories,
    totalStars,
    totalForks,
    npmStats,
    topTopics,
    activityTimeline,
    contributions,
  } = data;

  const showContributions = shouldShowContributions(contributions, repos.length);
  const contributionsFirst = showContributions && contributions && shouldShowContributionsFirst(contributions, repos.length);

  return (
    <article className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
      <JsonLd data={profilePageJsonLd(user, repos.length, totalStars, contributions)} />
      <div className="animate-fade-up">
        <HeroCard
          user={user}
          totalStars={totalStars}
          totalForks={totalForks}
          repoCount={repos.length}
          npmStats={npmStats}
        />
      </div>

      {contributionsFirst && contributions && (
        <div className="mt-8 animate-fade-up stagger-2">
          <ContributionsCard contributions={contributions} username={user.login} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div id="projects" className="lg:col-span-8 animate-fade-up stagger-2 scroll-mt-6">
          <CategorySection categories={categories} />
        </div>

        <div className="lg:col-span-4 space-y-5">
          {showContributions && !contributionsFirst && contributions && (
            <div className="animate-fade-up stagger-3">
              <ContributionsCard contributions={contributions} username={user.login} />
            </div>
          )}
          {npmStats && npmStats.packages.length > 0 && (
            <div className="animate-fade-up stagger-3">
              <NpmCard stats={npmStats} />
            </div>
          )}
          <div className="animate-fade-up stagger-4">
            <TechStack languages={languages} />
          </div>
          <div className="animate-fade-up stagger-5">
            <TopicCloud topics={topTopics} />
          </div>
          <div className="animate-fade-up stagger-6">
            <SocialLinks user={user} />
          </div>
        </div>
      </div>

      <div className="mt-12 animate-fade-up stagger-8">
        <ShareBar user={user} />
      </div>

      <Footer />
    </article>
  );
}
