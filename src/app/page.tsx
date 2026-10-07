import { Portfolio } from "@/components/Portfolio";
import { getGithubSnapshot } from "@/lib/github";

// Re-render at most once an hour, picking up fresh GitHub numbers.
export const revalidate = 3600;

export default async function Home() {
  const github = await getGithubSnapshot();
  return <Portfolio github={github} />;
}
