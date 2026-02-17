import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProfile, NotFoundError, RateLimitError } from "@/lib/github";
import { HeroCard } from "@/components/hero-card";
import { CategorySection } from "@/components/category-section";
import { NpmCard } from "@/components/npm-card";
import { TechStack } from "@/components/tech-stack";
import { TopicCloud } from "@/components/topic-cloud";
import { ActivityGraph } from "@/components/activity-graph";
import { ShareBar } from "@/components/share-bar";
import { SocialLinks } from "@/components/social-links";
import { Footer } from "@/components/footer";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;

  try {
    const { user, totalStars, repos } = await fetchProfile(username);
    const title = `${user.name ?? user.login} — GitShow`;
    const description = `${repos.length} open source projects · ${totalStars} stars${user.bio ? ` · ${user.bio}` : ""}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [`/api/og/${username}`],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`/api/og/${username}`],
      },
    };
  } catch {
    return { title: `${username} — GitShow` };
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  try {
    const data = await fetchProfile(username);
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
    } = data;

    return (
      <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-6">
        <HeroCard
          user={user}
          totalStars={totalStars}
          totalForks={totalForks}
          repoCount={repos.length}
          npmStats={npmStats}
        />

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <CategorySection categories={categories} />
          </div>

          <div className="space-y-5">
            {npmStats && npmStats.packages.length > 0 && (
              <NpmCard stats={npmStats} />
            )}
            <TechStack languages={languages} />
            <TopicCloud topics={topTopics} />
            <ActivityGraph timeline={activityTimeline} />
            <SocialLinks user={user} />
          </div>
        </div>

        <div className="mt-10">
          <ShareBar user={user} />
        </div>

        <Footer />
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    if (error instanceof RateLimitError) {
      throw error;
    }
    throw error;
  }
}
