import { createContext, useContext } from "react";
import type { Filter } from "../data";
import type { GithubSnapshot } from "./github";

interface Site {
  filter: Filter;
  setFilter: (f: Filter) => void;
  openProject: (id: string) => void;
  github: GithubSnapshot;
}

export const SiteContext = createContext<Site | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteContext");
  return ctx;
}
