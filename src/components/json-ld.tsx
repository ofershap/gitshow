import type { GitHubUser } from "@/lib/types";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
      "Replace github.com with gitshow.dev in any profile URL to get a stunning developer portfolio.",
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
    "@type": "WebApplication",
    name: "GitShow",
    url: "https://gitshow.dev",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "Generate a stunning developer portfolio from any public GitHub profile. No signup, no config.",
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
  };
}

export function profilePageJsonLd(
  user: GitHubUser,
  repoCount: number,
  totalStars: number,
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

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${user.name ?? user.login}'s Developer Portfolio`,
    url: `https://gitshow.dev/${user.login}`,
    description: `${repoCount} open source projects, ${totalStars} stars${user.bio ? `. ${user.bio}` : ""}`,
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
