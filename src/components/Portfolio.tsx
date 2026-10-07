"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ReactLenis } from "lenis/react";
import { PROJECTS, type Discipline, type Filter } from "../data";
import { SiteContext } from "../lib/site";
import { CaseStudy } from "./CaseStudy";
import { BackToTop, Dock, Footer } from "./Chrome";
import { Boot, Crosshair, Spotlight } from "./Motion";
import { soundtrack } from "../lib/sound";
import { ProfileTile } from "../tiles/ProfileTile";
import { ThesisTile } from "../tiles/ThesisTile";
import { ProjectCard, ProjectCode, ProjectPoster } from "../tiles/ProjectTile";
import { ClockTile, GithubTile, NowTile, TodoTile, ToolchainTile } from "../tiles/InfoTiles";
import { TerminalTile } from "../tiles/TerminalTile";
import { ChartTile, CipherTile, ContactTile, CrackTile, RedactedTile } from "../tiles/SignalTiles";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * "always": every filter. "all": only the unfiltered view.
 * A discipline list: the unfiltered view plus those filters.
 * `h` is a first guess at the height; real heights replace it once measured.
 */
type Show = "always" | "all" | Discipline[];
type TileDef = { id: string; show: Show; h: number; el: ReactNode };

const project = (id: string) => PROJECTS.find((p) => p.id === id)!;
const work = (id: string, el: ReactNode, h: number): TileDef => ({ id, show: project(id).discipline, h, el });

// Order is the reading order: the work leads, the widgets punctuate it.
const TILES: TileDef[] = [
  { id: "profile", show: "always", h: 470, el: <ProfileTile /> },
  work("plugr", <ProjectPoster project={project("plugr")} height={560} />, 560),
  { id: "thesis", show: "always", h: 360, el: <ThesisTile /> },
  { id: "now", show: ["web", "sec"], h: 200, el: <NowTile /> },
  work("exam-cbt", <ProjectPoster project={project("exam-cbt")} height={460} />, 460),
  work("ip-shield", <ProjectCode project={project("ip-shield")} height={460} />, 460),
  work("job-nexus", <ProjectPoster project={project("job-nexus")} height={380} />, 380),
  work("airbnb-db", <ProjectCode project={project("airbnb-db")} height={440} />, 440),
  { id: "terminal", show: ["sec"], h: 380, el: <TerminalTile /> },
  work("skoolconnect", <ProjectPoster project={project("skoolconnect")} height={420} />, 420),
  work("graphql-crm", <ProjectCode project={project("graphql-crm")} height={460} />, 460),
  { id: "chart", show: ["data"], h: 360, el: <ChartTile /> },
  work("coffee-app", <ProjectCode project={project("coffee-app")} height={420} />, 420),
  { id: "github", show: ["web"], h: 290, el: <GithubTile /> },
  work("travel-payments", <ProjectCode project={project("travel-payments")} height={420} />, 420),
  { id: "crack", show: ["sec"], h: 320, el: <CrackTile /> },
  work("property-cache", <ProjectCode project={project("property-cache")} height={440} />, 440),
  work("princess-store", <ProjectCard project={project("princess-store")} />, 400),
  { id: "clock", show: "all", h: 280, el: <ClockTile /> },
  work("typing-test", <ProjectPoster project={project("typing-test")} height={380} />, 380),
  { id: "redacted", show: ["sec"], h: 260, el: <RedactedTile /> },
  { id: "todo", show: "all", h: 250, el: <TodoTile /> },
  { id: "toolchain", show: "always", h: 150, el: <ToolchainTile /> },
  { id: "cipher", show: ["sec"], h: 230, el: <CipherTile /> },
  { id: "contact", show: "always", h: 300, el: <ContactTile /> },
];

const visible = (t: TileDef, f: Filter) =>
  t.show === "always" || f === "all" || (Array.isArray(t.show) && t.show.includes(f as Discipline));

/** 0 until mounted, so the server render and first client render agree. */
function useColumnCount() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const get = () => {
      const w = window.innerWidth;
      return w >= 1400 ? 4 : w >= 1000 ? 3 : w >= 640 ? 2 : 1;
    };
    const onResize = () => setN(get());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return n;
}

type Placed = { tile: TileDef; col: number; x: number; y: number };

/**
 * Greedy masonry on real heights: each tile drops into the shortest column so far.
 * Returns absolute positions plus how far each column falls short of the tallest.
 */
function layout(tiles: TileDef[], n: number, colW: number, gap: number, measured: Map<string, number>) {
  const heights = Array(n).fill(0);
  const placed: Placed[] = tiles.map((tile) => {
    const col = heights.indexOf(Math.min(...heights));
    const p = { tile, col, x: col * (colW + gap), y: heights[col] };
    heights[col] += (measured.get(tile.id) ?? tile.h) + gap;
    return p;
  });
  const colHeights = heights.map((h) => Math.max(0, h - gap));
  const tallest = Math.max(0, ...colHeights);
  return { placed, tallest, shortfall: colHeights.map((h) => tallest - h) };
}

const SPRING = { stiffness: 170, damping: 28, mass: 0.9 };

/**
 * One tile, absolutely positioned. Its position springs to new slots when the
 * layout changes, it drifts with its column so all columns end flush, and it
 * wipes open (top to bottom) the first time it scrolls into view.
 */
function TileShell({
  id,
  x,
  y,
  width,
  shift,
  progress,
  ready,
  delay,
  onHeight,
  children,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  shift: number;
  progress: MotionValue<number>;
  ready: boolean;
  delay: number;
  onHeight: (id: string, h: number) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const show = ready && inView;

  const tx = useMotionValue(x);
  const ty = useMotionValue(y);
  const sx = useSpring(tx, SPRING);
  const sy = useSpring(ty, SPRING);
  const shiftMV = useMotionValue(shift);
  const placedOnce = useRef(false);

  // First placement is instant; later moves spring from where the tile was.
  useEffect(() => {
    if (!placedOnce.current) {
      tx.jump(x);
      ty.jump(y);
      sx.jump(x);
      sy.jump(y);
      placedOnce.current = true;
    } else {
      tx.set(x);
      ty.set(y);
    }
  }, [x, y, sx, sy, tx, ty]);

  useEffect(() => shiftMV.set(shift), [shift, shiftMV]);

  const transform = useTransform(
    [sx, sy, progress, shiftMV] as MotionValue<number>[],
    ([px, py, p, s]: number[]) => `translate3d(${px}px, ${(py + p * s).toFixed(1)}px, 0)`,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onHeight(id, el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [id, onHeight]);

  // The outer box is what gets observed and positioned; the clip lives on the inner one,
  // because IntersectionObserver treats a fully clipped element as never visible.
  return (
    <motion.div
      ref={ref}
      className="absolute left-0 top-0"
      style={{ width, transform }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
    >
      <motion.div
        initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)", transform: "translateY(28px)" }}
        animate={
          show
            ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", transform: "translateY(0px)" }
            : { opacity: 0, clipPath: "inset(0% 0% 100% 0%)", transform: "translateY(28px)" }
        }
        transition={{
          default: { duration: 0.8, ease: EASE_OUT, delay },
          opacity: { duration: 0.5, ease: EASE_OUT, delay },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const columns = useColumnCount();
  const reduce = useReducedMotion();
  const firstReveal = useRef(true);
  const gridRef = useRef<HTMLDivElement>(null);

  // Grid width drives column width; measured tile heights drive placement.
  const [gridW, setGridW] = useState(0);
  const measured = useRef(new Map<string, number>());
  const [measureTick, setMeasureTick] = useState(0);
  const pending = useRef(0);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setGridW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onTileHeight = useCallback((id: string, h: number) => {
    if (Math.abs((measured.current.get(id) ?? 0) - h) < 2) return;
    measured.current.set(id, h);
    cancelAnimationFrame(pending.current);
    pending.current = requestAnimationFrame(() => setMeasureTick((v) => v + 1));
  }, []);

  // Grid-relative scroll progress, smoothed a touch so the columns glide.
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  // Deep link: /#exam-cbt opens that case study.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (PROJECTS.some((p) => p.id === id)) setOpenId(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => (firstReveal.current = false), 2000);
    return () => window.clearTimeout(t);
  }, [ready]);

  const openProject = useCallback((id: string) => {
    soundtrack().whoosh();
    setOpenId(id);
    history.replaceState(null, "", `#${id}`);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  const mounted = columns > 0 && gridW > 0;
  const n = columns || 1;
  const gap = n > 1 ? 20 : 12;
  const colW = mounted ? (gridW - gap * (n - 1)) / n : 0;
  const shown = useMemo(() => TILES.filter((t) => visible(t, filter)), [filter]);
  const grid = useMemo(
    () => layout(shown, n, colW, gap, measured.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shown, n, colW, gap, measureTick],
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        (["all", "web", "sec", "data"] as Filter[]).map((f) => [f, TILES.filter((t) => visible(t, f)).length]),
      ) as Record<Filter, number>,
    [],
  );
  const align = n > 1 && !reduce;
  const open = openId ? PROJECTS.find((p) => p.id === openId) : undefined;

  const page = (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto max-w-[1800px] px-3 pt-3 sm:px-5 sm:pt-5">
        <div ref={gridRef} className="relative" style={mounted ? { height: grid.tallest } : undefined}>
          {mounted ? (
            <AnimatePresence initial={false}>
              {grid.placed.map(({ tile, col, x, y }, i) => (
                <TileShell
                  key={tile.id}
                  id={tile.id}
                  x={x}
                  y={y}
                  width={colW}
                  shift={align ? grid.shortfall[col] : 0}
                  progress={progress}
                  ready={ready}
                  delay={firstReveal.current ? 0.12 + col * 0.07 + Math.min(Math.floor(i / n), 3) * 0.09 : 0.04}
                  onHeight={onTileHeight}
                >
                  {tile.el}
                </TileShell>
              ))}
            </AnimatePresence>
          ) : (
            // Server render and first paint: a plain stack, so the content is in the HTML.
            <div className="flex flex-col gap-3 opacity-0">
              {shown.map((t) => (
                <div key={t.id}>{t.el}</div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Dock counts={counts} />
      <BackToTop />
      <Spotlight />
      <Crosshair />
      <AnimatePresence>{open && <CaseStudy key="case" project={open} onClose={close} />}</AnimatePresence>
      <Boot tiles={TILES.length} onReveal={() => setReady(true)} />
    </MotionConfig>
  );

  return (
    <SiteContext.Provider value={{ filter, setFilter, openProject }}>
      {reduce ? page : <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.9 }}>{page}</ReactLenis>}
    </SiteContext.Provider>
  );
}
