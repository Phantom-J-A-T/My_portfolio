import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Discipline, Project } from "../data";
import { CodeBlock } from "../lib/Code";
import { DitherImage } from "../lib/DitherImage";
import { Scramble } from "../lib/Scramble";
import { useSite } from "../lib/site";

export const DISCIPLINE_NAME: Record<Discipline, string> = {
  web: "Web",
  sec: "Security",
  data: "Data",
};

export const OPEN_CURSOR = "open";

function Tags({ project }: { project: Project }) {
  return (
    <span className="label flex flex-wrap items-center gap-x-2 gap-y-1">
      {project.discipline.map((d) => DISCIPLINE_NAME[d]).join(" / ")}
      <span className="text-dim">{project.year}</span>
      {project.draft && <span className="rounded-[4px] px-1 text-bone ring-1 ring-edge-hi">draft</span>}
    </span>
  );
}

/** The whole tile is the link: no inner button, just the cursor and hover states. */
function TileButton({
  project,
  className,
  style,
  children,
}: {
  project: Project;
  className: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const { openProject } = useSite();
  return (
    <button
      type="button"
      onClick={() => openProject(project.id)}
      className={`tile decrypt press group block w-full cursor-pointer text-left ${className}`}
      style={style}
      data-scramble-host
      data-cursor={OPEN_CURSOR}
      aria-label={`${project.title}: ${project.kicker}. Open case study`}
    >
      {children}
    </button>
  );
}

/** Image that drifts against the scroll inside its frame, so the grid feels deep. */
function ParallaxMedia({
  project,
  className,
  height,
  tall = false,
}: {
  project: Project;
  className: string;
  height?: number;
  tall?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const transform = useTransform(scrollYProgress, [0, 1], ["translateY(-7%)", "translateY(7%)"]);

  return (
    <motion.span
      ref={ref}
      layoutId={`media-${project.id}`}
      className={`block overflow-hidden ${className}`}
      style={height ? { height } : undefined}
    >
      <motion.span className="absolute inset-x-0 -inset-y-[9%] block" style={reduce ? undefined : { transform }}>
        <DitherImage
          src={(tall && project.imageTall) || project.image!}
          alt=""
          className="h-full w-full"
          {...project.tone}
        />
      </motion.span>
    </motion.span>
  );
}

/** Caption chip that floats over full-bleed media. */
function Chip({ project }: { project: Project }) {
  return (
    <span className="absolute bottom-3 left-3 right-3 z-[2] block rounded-[12px] bg-black/90 px-3.5 py-3 ring-1 ring-edge">
      <Scramble text={project.title} className="block text-[15px] font-medium text-bone" />
      <span className="mt-0.5 block text-[13px] text-ash">{project.kicker}</span>
    </span>
  );
}

/** Full-bleed image with a floating caption chip. */
export function ProjectPoster({ project, height = 440 }: { project: Project; height?: number }) {
  return (
    <TileButton project={project} className="" style={{ height }}>
      <ParallaxMedia project={project} className="absolute inset-0" tall />
      <Chip project={project} />
    </TileButton>
  );
}

/** Image on top, words underneath. */
export function ProjectCard({ project, imageHeight = 220 }: { project: Project; imageHeight?: number }) {
  return (
    <TileButton project={project} className="">
      <ParallaxMedia project={project} className="relative w-full" height={imageHeight} />
      <span className="block p-5">
        <Tags project={project} />
        <Scramble text={project.title} className="mt-3 block text-[17px] font-medium text-bone" />
        <span className="mt-1.5 block text-[14px] leading-relaxed text-ash">{project.summary}</span>
      </span>
    </TileButton>
  );
}

/**
 * Real code from the repo as the visual. A dim copy sits underneath and a bright
 * copy wipes in from the top on hover, the same "decrypt" as the images.
 */
export function ProjectCode({ project, height = 420 }: { project: Project; height?: number }) {
  const code = project.code!;
  return (
    <TileButton project={project} className="" style={{ height }}>
      <motion.span layoutId={`media-${project.id}`} className="absolute inset-0 block overflow-hidden bg-slab">
        <span className="label flex items-center justify-between border-b border-edge px-5 py-3.5">
          <span className="truncate normal-case tracking-normal">{code.file}</span>
          <span className="pl-3">{code.lang}</span>
        </span>
        <span className="relative block px-4 pt-4">
          <CodeBlock code={code} className="opacity-45" />
          <span className="code-bright absolute inset-0 block px-4 pt-4" aria-hidden>
            <CodeBlock code={code} />
          </span>
        </span>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slab via-slab/80 to-transparent" />
      </motion.span>
      <Chip project={project} />
    </TileButton>
  );
}
