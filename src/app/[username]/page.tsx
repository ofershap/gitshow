import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProfile, NotFoundError } from "@/lib/github";
import { getTopRepos } from "@/lib/utils";
import { ProfileHeader } from "@/components/profile-header";
import { RepoCard } from "@/components/repo-card";
import { LanguageChart } from "@/components/language-chart";
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
    const data = await fetchProfile(username);
    const title = data.user.name
      ? `${data.user.name} (@${username})`
      : `@${username}`;
    const description =
      data.user.bio ??
      `${data.user.public_repos} repos, ${data.totalStars} stars`;

    return {
      title: `${title} — GitShow`,
      description,
      openGraph: {
        title: `${title} — GitShow`,
        description,
        images: [`/api/og/${username}`],
        type: "profile",
        url: `/${username}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} — GitShow`,
        description,
        images: [`/api/og/${username}`],
      },
    };
  } catch {
    return {
      title: `@${username} — GitShow`,
    };
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  let data;
  try {
    data = await fetchProfile(username);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const topRepos = getTopRepos(data.repos, 6);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ProfileHeader
          user={data.user}
          totalStars={data.totalStars}
          totalForks={data.totalForks}
        />

        <div className="flex flex-col gap-4">
          {data.languages.length > 0 && (
            <LanguageChart languages={data.languages} />
          )}
          <SocialLinks user={data.user} />
        </div>

        <div className="col-span-full">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Top Repositories
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topRepos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        </div>

        {data.repos.length > 6 && (
          <div className="col-span-full text-center">
            <a
              href={`${data.user.html_url}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white"
            >
              View all {data.repos.length} repositories on GitHub
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </a>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
