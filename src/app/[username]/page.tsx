import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProfile, NotFoundError } from "@/lib/github";
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
  } = data;

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
      <div className="animate-fade-up">
        <HeroCard
          user={user}
          totalStars={totalStars}
          totalForks={totalForks}
          repoCount={repos.length}
          npmStats={npmStats}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8 animate-fade-up stagger-2">
          <CategorySection categories={categories} />
        </div>

        <div className="lg:col-span-4 space-y-5">
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
            <ActivityGraph timeline={activityTimeline} />
          </div>
          <div className="animate-fade-up stagger-7">
            <SocialLinks user={user} />
          </div>
        </div>
      </div>

      <div className="mt-12 animate-fade-up stagger-8">
        <ShareBar user={user} />
      </div>

      <Footer />
    </div>
  );
}
