import { GitHubUser } from "@/lib/types";
import { formatNumber, memberSince } from "@/lib/utils";
import Image from "next/image";

interface ProfileHeaderProps {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
}

export function ProfileHeader({
  user,
  totalStars,
  totalForks,
}: ProfileHeaderProps) {
  return (
    <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:col-span-2">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Image
          src={user.avatar_url}
          alt={user.name ?? user.login}
          width={120}
          height={120}
          className="rounded-full ring-2 ring-white/20"
          priority
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {user.name ?? user.login}
          </h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:underline"
          >
            @{user.login}
          </a>
          {user.bio && (
            <p className="mt-2 text-sm text-gray-300">{user.bio}</p>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-gray-400 sm:justify-start">
            {user.company && (
              <span className="flex items-center gap-1">
                <BuildingIcon />
                {user.company}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPinIcon />
                {user.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarIcon />
              Member since {memberSince(user.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBadge label="Repos" value={user.public_repos} />
        <StatBadge label="Stars" value={totalStars} />
        <StatBadge label="Forks" value={totalForks} />
        <StatBadge label="Followers" value={user.followers} />
      </div>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
      <div className="text-lg font-bold text-white">{formatNumber(value)}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function BuildingIcon() {
  return (
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
        d="M3 21h18M9 8h1m-1 4h1m4-4h1m-1 4h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
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
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
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
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}
