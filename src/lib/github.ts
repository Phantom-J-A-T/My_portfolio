import { GITHUB_WEEKS as WEEKS, PROFILE } from "../data";

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export interface GithubSnapshot {
  repos: number | null;
  followers: number | null;
  days: ContributionDay[] | null;
}

const HOUR = 3600;

/**
 * Server-only. Fetches the GitHub numbers once and lets Next cache them for an hour,
 * so visitors' browsers never call GitHub (no rate limits, no loading state).
 * A GITHUB_TOKEN env var, if set, raises GitHub's limit from 60 to 5,000 requests an hour.
 * Each part fails independently and quietly; the tile handles missing data.
 */
export async function getGithubSnapshot(): Promise<GithubSnapshot> {
  const user = PROFILE.links.githubUser;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const [profile, contributions] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${user}`, { headers, next: { revalidate: HOUR } }).then((r) =>
      r.ok ? r.json() : Promise.reject(new Error(`GitHub ${r.status}`)),
    ),
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, { next: { revalidate: HOUR } }).then(
      (r) => (r.ok ? r.json() : Promise.reject(new Error(`Contributions ${r.status}`))),
    ),
  ]);

  return {
    repos: profile.status === "fulfilled" ? profile.value.public_repos : null,
    followers: profile.status === "fulfilled" ? profile.value.followers : null,
    days:
      contributions.status === "fulfilled"
        ? (contributions.value.contributions as ContributionDay[]).slice(-WEEKS * 7)
        : null,
  };
}
