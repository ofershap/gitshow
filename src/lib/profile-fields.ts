import type { GitHubRepo, GitHubUser } from './types';

// REST responses contain many URL templates and nested objects that our UI
// never uses. A TypeScript type does not remove those fields at runtime.
// Project at the fetch boundary before categories are serialized into RSC/ISR.
export function profileRepoFields(repo: GitHubRepo): GitHubRepo {
  return {
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    homepage: repo.homepage,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    language: repo.language,
    topics: repo.topics,
    fork: repo.fork,
    archived: repo.archived,
    pushed_at: repo.pushed_at,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
  };
}

export function profileUserFields(user: GitHubUser): GitHubUser {
  return {
    login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
    html_url: user.html_url,
    bio: user.bio,
    company: user.company,
    location: user.location,
    blog: user.blog,
    twitter_username: user.twitter_username,
    public_repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    created_at: user.created_at,
  };
}
