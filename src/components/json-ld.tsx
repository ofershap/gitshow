import type { GitHubUser, ContributionsData } from "@/lib/types";
import type { RepoShowroomData } from "@/lib/repo-types";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GitShow",
    url: "https://gitshow.dev",
    description:
      "Replace github.com with gitshow.dev in any profile or repository URL to get a developer portfolio or open source showroom.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://gitshow.dev/{username}",
      },
      "query-input": "required name=username",
    },
  };
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GitShow",
    url: "https://gitshow.dev",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "Generate a developer portfolio from any public GitHub profile, or a showroom page for any repository. Replace github.com with gitshow.dev — no signup, no config, no deploy.",
    featureList: [
      "npm download statistics across all packages",
      "Smart repo categorization by type (MCP Servers, CLI Tools, React & UI, DevOps, AI & ML)",
      "Open source contributions to external projects",
      "Tech stack language breakdown visualization",
      "Focus areas topic cloud",
      "Project creation timeline",
      "Daily-refreshed social preview cards for X and LinkedIn",
      "Embeddable README badge card",
      "One-click share to X and LinkedIn",
      "Works for users, organizations, and repositories",
      "Repository showroom with team, languages, commit activity, and community health",
      "Per-repo OG images for social sharing",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Ofer Shapira",
      url: "https://github.com/ofershap",
    },
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    browserRequirements: "Requires a modern web browser",
    softwareVersion: "1.0",
    screenshot: "https://gitshow.dev/api/og",
  };
}

export const productFaqs = [
  {
    question: "What is GitShow?",
    answer: "GitShow is a free, open source GitHub portfolio generator. It turns a public GitHub profile into a portfolio, and a public repository into a project showroom. It is a separate project, not a GitHub product.",
  },
  {
    question: "How do I turn my GitHub profile into a portfolio?",
    answer: "Replace github.com with gitshow.dev in your profile URL. For example, github.com/ofershap becomes gitshow.dev/ofershap. You do not need to sign up, connect a GitHub account, or deploy a site.",
  },
  {
    question: "What does GitShow add to a GitHub profile?",
    answer: "It groups original projects by category and shows npm download statistics, public contribution activity, languages, and focus areas. Repository pages show contributors, commit activity, community health, releases, and recent issues and pull requests. Available data varies by profile and repository.",
  },
  {
    question: "Does it work for organizations and individual repositories?",
    answer: "Yes. Use gitshow.dev/organization for a public organization, or gitshow.dev/owner/repo for a public repository. Private repositories are not supported.",
  },
  {
    question: "How current are the data and social preview images?",
    answer: "Profile and repository pages use a 24-hour revalidation interval. Cached data can remain visible while a refresh runs. Social preview images are generated in a daily refresh; a new page may show the default image until the next refresh. GitHub API limits or a failed refresh can delay updates.",
  },
  {
    question: "Can I embed a portfolio badge in my README?",
    answer: "Yes. Use the README badge example above and replace YOUR_USERNAME with your GitHub username. The badge links back to your GitShow profile. GitShow is free to use and its source is available under the MIT license.",
  },
];

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: productFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function profilePageJsonLd(
  user: GitHubUser,
  repoCount: number,
  totalStars: number,
  contributions?: ContributionsData | null,
) {
  const sameAs: string[] = [user.html_url];
  if (user.twitter_username) {
    sameAs.push(`https://twitter.com/${user.twitter_username}`);
  }
  if (user.blog) {
    const blog = user.blog.startsWith("http")
      ? user.blog
      : `https://${user.blog}`;
    sameAs.push(blog);
  }

  const contribDesc = contributions
    ? `, ${contributions.totalCommits} commits and ${contributions.totalPullRequests} PRs to external projects`
    : "";

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${user.name ?? user.login}'s Developer Portfolio`,
    url: `https://gitshow.dev/${user.login}`,
    description: `${repoCount} open source projects, ${totalStars} stars${contribDesc}${user.bio ? `. ${user.bio}` : ""}`,
    mainEntity: {
      "@type": "Person",
      name: user.name ?? user.login,
      url: user.html_url,
      image: user.avatar_url,
      description: user.bio ?? undefined,
      sameAs,
      ...(user.company && { worksFor: { "@type": "Organization", name: user.company.replace(/^@/, "") } }),
      ...(user.location && { homeLocation: { "@type": "Place", name: user.location } }),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "GitShow",
          item: "https://gitshow.dev",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: user.name ?? user.login,
          item: `https://gitshow.dev/${user.login}`,
        },
      ],
    },
  };
}

export function repoShowroomJsonLd(data: RepoShowroomData) {
  const { repo, contributors, languages, latestRelease, openPrsCount, openIssuesCount, communityHealth } = data;
  const topContributors = contributors.slice(0, 10).map((c) => ({
    "@type": "Person" as const,
    name: c.login,
    url: c.html_url,
    image: c.avatar_url,
  }));

  const topLangs = languages.slice(0, 5).map((l) => l.name);

  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: repo.name,
      url: `https://gitshow.dev/${repo.full_name}`,
      codeRepository: repo.html_url,
      ...(repo.description && { description: repo.description }),
      ...(repo.homepage && { mainEntityOfPage: repo.homepage }),
      ...(repo.license && { license: `https://opensource.org/licenses/${repo.license}` }),
      ...(repo.language && { programmingLanguage: repo.language }),
      ...(topLangs.length > 1 && { runtimePlatform: topLangs.join(", ") }),
      ...(latestRelease && { softwareVersion: latestRelease.tag_name }),
      ...(repo.topics.length > 0 && { keywords: repo.topics.join(", ") }),
      dateCreated: repo.created_at,
      dateModified: repo.pushed_at,
      author: {
        "@type": "Organization",
        name: repo.owner.login,
        url: repo.owner.html_url,
        image: repo.owner.avatar_url,
      },
      ...(topContributors.length > 0 && { contributor: topContributors }),
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/LikeAction",
          userInteractionCount: repo.stargazers_count,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ForkAction",
          userInteractionCount: repo.forks_count,
        },
      ],
      ...(communityHealth && {
        review: {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: communityHealth.health_percentage,
            bestRating: 100,
            worstRating: 0,
          },
          name: "Community Health Score",
        },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "GitShow",
          item: "https://gitshow.dev",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: repo.owner.login,
          item: `https://gitshow.dev/${repo.owner.login}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: repo.name,
          item: `https://gitshow.dev/${repo.full_name}`,
        },
      ],
    },
  ];
}
