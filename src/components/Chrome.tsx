import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { FILTERS, PROFILE, type Filter } from "../data";
import { useSite } from "../lib/site";

/** The floating filter dock: the thesis verbs, always within thumb reach. */
export function Dock({ counts }: { counts: Record<Filter, number> }) {
  const { filter, setFilter } = useSite();
  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3"
      aria-label="Filter the work"
    >
      <div className="pointer-events-auto flex rounded-full bg-black/80 p-1 ring-1 ring-edge-hi backdrop-blur-xl">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={on}
              aria-label={`${f.label}: ${counts[f.id]} tiles`}
              className={`relative flex h-10 cursor-pointer items-center gap-1 rounded-full px-3.5 text-[14px] transition-colors sm:px-4 ${
                on ? "text-void" : "text-ash hover:text-bone"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="dock-active"
                  className="absolute inset-0 rounded-full bg-bone"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                />
              )}
              <span className="relative">{f.verb}</span>
              <sup className="mono relative text-[9px] opacity-60">{counts[f.id]}</sup>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** Name pill in the corner that takes you back up, once you've scrolled. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-4 left-4 z-50 hidden h-12 cursor-pointer items-center gap-2.5 rounded-full bg-black/80 pl-1.5 pr-4 text-[14px] text-bone ring-1 ring-edge-hi backdrop-blur-xl transition-all duration-300 xl:flex ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      tabIndex={show ? 0 : -1}
      aria-label="Back to top"
    >
      <img src={PROFILE.avatar} alt="" className="h-9 w-9 rounded-full object-cover grayscale" />
      {PROFILE.name}
      <ArrowUp className="h-4 w-4 text-ash" aria-hidden />
    </button>
  );
}

export function Footer() {
  return (
    <footer className="label mx-auto mt-16 max-w-[1800px] px-5 pb-28">
      <span>© {new Date().getFullYear()} {PROFILE.name}</span>
    </footer>
  );
}
