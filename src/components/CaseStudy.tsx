import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { PROJECTS, type Project } from "../data";
import { CodeBlock } from "../lib/Code";
import { DitherImage } from "../lib/DitherImage";
import { GithubIcon } from "../lib/icons";
import { useSite } from "../lib/site";
import { DISCIPLINE_NAME } from "../tiles/ProjectTile";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const { openProject } = useSite();
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [decrypted, setDecrypted] = useState(false);

  const i = PROJECTS.findIndex((p) => p.id === project.id);
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  const lenis = useLenis();

  // Lock page scroll, trap Escape, and hand focus back when closed.
  useEffect(() => {
    lenis?.stop();
    const before = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") openProject(next.id);
      if (e.key === "ArrowLeft") openProject(prev.id);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      before?.focus?.({ preventScroll: true });
    };
  }, [onClose, openProject, next.id, prev.id, lenis]);

  // Re-run the decrypt wipe each time a different project opens.
  useEffect(() => {
    setDecrypted(false);
    scrollRef.current?.scrollTo({ top: 0 });
    const t = window.setTimeout(() => setDecrypted(true), 520);
    return () => window.clearTimeout(t);
  }, [project.id]);

  return (
    <motion.div
      ref={scrollRef}
      layoutScroll
      data-lenis-prevent
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain px-3 py-3 sm:px-8 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
    >
      {/* Backdrop and panel fade; the image itself travels from its tile at full opacity. */}
      <motion.div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
        onClick={onClose}
      />
      <article key={project.id} className="relative mx-auto w-full max-w-[880px]">
        <motion.div
          className="tile absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        />

        <motion.button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="pill icon-btn absolute right-4 top-4 z-10 bg-black/80"
          aria-label="Close case study"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <X className="h-4 w-4" aria-hidden />
        </motion.button>

        <motion.div
          layoutId={`media-${project.id}`}
          className="relative overflow-hidden rounded-t-[var(--radius-tile)]"
          transition={{ duration: 0.5, ease: EASE_IN_OUT }}
        >
          {project.image ? (
            <DitherImage
              src={project.image}
              alt={`${project.title} preview`}
              open={decrypted}
              className="h-[clamp(240px,46vw,440px)] w-full"
              {...project.tone}
            />
          ) : project.code ? (
            <div className="bg-slab">
              <p className="label flex items-center justify-between border-b border-edge px-6 py-4 pr-16">
                <span className="normal-case tracking-normal">{project.code.file}</span>
                <span>{project.code.lang}</span>
              </p>
              <div className="thin-scroll overflow-x-auto px-5 py-6">
                <CodeBlock code={project.code} className="text-[12.5px]" />
              </div>
            </div>
          ) : null}
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.18 }}
        >
        <div className="p-6 sm:p-10">
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1">
            {project.discipline.map((d) => DISCIPLINE_NAME[d]).join(" / ")}
            <span className="text-dim">{project.year}</span>
            <span className="text-dim">{project.role}</span>
          </p>
          <h2 id="case-title" className="display mt-4 text-bone" style={{ fontSize: "clamp(34px, 6vw, 60px)" }}>
            {project.title}
          </h2>
          <p className="mt-2 text-[15px] text-ash">{project.kicker}</p>

          {project.draft && (
            <p className="mono mt-6 rounded-[10px] px-4 py-3 text-[12px] text-bone ring-1 ring-edge-hi">
              Placeholder project. Details coming soon.
            </p>
          )}

          <div className="mt-8 grid gap-10 md:grid-cols-[1fr_230px]">
            <div>
              <p className="text-[19px] leading-snug text-bone">{project.summary}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ash">{project.body}</p>

              <h3 className="label mt-10">What it does</h3>
              <ul className="mt-3 divide-y divide-edge border-y border-edge">
                {project.notes.map((n) => (
                  <li key={n} className="flex gap-3 py-3 text-[14px] text-bone">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-bone" aria-hidden />
                    {n}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="space-y-8">
              <div>
                <h3 className="label">Stack</h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li key={s} className="mono rounded-full px-2.5 py-1 text-[11px] text-bone ring-1 ring-edge">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="label">Links</h3>
                <LinkPill href={project.live} label="Visit the live site" icon={<ArrowUpRight className="h-4 w-4" aria-hidden />} />
                <LinkPill href={project.source} label="View the source" icon={<GithubIcon className="h-4 w-4" />} />
              </div>
            </aside>
          </div>

          <nav className="mt-12 flex items-center justify-between gap-3 border-t border-edge pt-6" aria-label="More projects">
            <button type="button" onClick={() => openProject(prev.id)} className="pill min-w-0">
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{prev.title}</span>
            </button>
            <button type="button" onClick={() => openProject(next.id)} className="pill min-w-0">
              <span className="truncate">{next.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </nav>
        </div>
        </motion.div>
      </article>
    </motion.div>
  );
}

function LinkPill({ href, label, icon }: { href: string | null; label: string; icon: React.ReactNode }) {
  if (!href) {
    return (
      <span className="pill w-full cursor-not-allowed justify-between text-dim" aria-disabled="true">
        {label}
        <span className="label text-dim">soon</span>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className="pill w-full justify-between">
      {label}
      {icon}
    </a>
  );
}
