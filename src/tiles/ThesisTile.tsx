import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Discipline } from "../data";
import { crackPaths } from "../lib/crack";
import { useScramble } from "../lib/Scramble";
import { useSite } from "../lib/site";

type Verb = { id: Discipline; word: string };

const VERBS: Verb[] = [
  { id: "web", word: "build" },
  { id: "sec", word: "break" },
  { id: "data", word: "measure" },
];

/**
 * The thesis. Each verb is a filter, and each one previews itself on hover:
 * "build" assembles from noise, "break" cracks the tile, "measure" dimensions itself.
 */
export function ThesisTile() {
  const { filter, setFilter } = useSite();
  const tileRef = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<Discipline | null>(null);
  const [impact, setImpact] = useState<{ x: number; y: number; w: number } | null>(null);

  const paths = useMemo(
    () => (impact ? crackPaths(impact.x, impact.y, impact.w * 0.9, 11) : []),
    [impact],
  );

  const aim = (el: HTMLElement) => {
    const tile = tileRef.current;
    if (!tile) return;
    const t = tile.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setImpact({ x: r.left - t.left + r.width * 0.55, y: r.top - t.top + r.height * 0.5, w: t.width });
  };

  return (
    <section
      ref={tileRef}
      className="tile flex min-h-[360px] flex-col justify-between p-6"
      style={{ containerType: "inline-size" }}
      aria-label="What I do"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
        style={{ opacity: hover === "sec" ? 1 : 0, transition: "opacity .3s" }}
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            fill="none"
            stroke="var(--color-bone)"
            strokeWidth={i === paths.length - 1 ? 0.8 : 0.9}
            strokeOpacity={0.75}
            strokeDasharray={1}
            strokeDashoffset={hover === "sec" ? 0 : 1}
            style={{ transition: `stroke-dashoffset ${0.35 + (i % 4) * 0.08}s cubic-bezier(.2,.9,.3,1)` }}
          />
        ))}
      </svg>

      <p className="label relative">What I do</p>

      <h2
        className="display relative my-8 text-bone"
        style={{ fontSize: "min(10.5cqw, 64px)", lineHeight: 1.08 }}
      >
        {VERBS.map((v) => (
          <span key={v.id} className="block whitespace-nowrap">
            I{" "}
            <VerbButton
              verb={v}
              active={filter === v.id}
              hovered={hover === v.id}
              onEnter={(el) => {
                setHover(v.id);
                if (v.id === "sec") aim(el);
              }}
              onLeave={() => setHover(null)}
              onPick={() => setFilter(filter === v.id ? "all" : v.id)}
            />{" "}
            it
          </span>
        ))}
      </h2>

      <p className="relative text-[13px] text-ash">
        {filter === "all" ? "Pick a verb to filter the work." : "Pick it again to see everything."}
      </p>
    </section>
  );
}

function VerbButton({
  verb,
  active,
  hovered,
  onEnter,
  onLeave,
  onPick,
}: {
  verb: Verb;
  active: boolean;
  hovered: boolean;
  onEnter: (el: HTMLElement) => void;
  onLeave: () => void;
  onPick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [text, play] = useScramble(verb.word, 420);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (hovered && ref.current) setWidth(Math.round(ref.current.offsetWidth));
  }, [hovered]);

  const enter = () => {
    if (!ref.current) return;
    onEnter(ref.current);
    if (verb.id === "web") play();
  };

  const broken = hovered && verb.id === "sec";

  return (
    <button
      ref={ref}
      type="button"
      onMouseEnter={enter}
      onFocus={enter}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      onClick={onPick}
      aria-pressed={active}
      aria-label={`${verb.word}: show ${verb.id === "web" ? "web" : verb.id === "sec" ? "security" : "data"} work`}
      className="relative cursor-pointer rounded-[4px] px-[0.08em] transition-colors duration-200"
      style={{
        background: active ? "var(--color-bone)" : "transparent",
        color: active ? "var(--color-void)" : "inherit",
        textDecorationLine: active ? "none" : "underline",
        textDecorationStyle: "dotted",
        textDecorationThickness: "0.06em",
        textUnderlineOffset: "0.14em",
      }}
    >
      <span aria-hidden className="relative inline-block">
        {broken ? (
          // Split the word along a diagonal and nudge the halves apart.
          <>
            <span style={{ clipPath: "polygon(0 0, 100% 0, 100% 38%, 0 62%)", display: "inline-block", transform: "translate(-1px,-2px) rotate(-1deg)" }}>
              {text}
            </span>
            <span className="absolute inset-0" style={{ clipPath: "polygon(0 62%, 100% 38%, 100% 100%, 0 100%)", transform: "translate(2px,2px) rotate(1deg)" }}>
              {text}
            </span>
          </>
        ) : (
          text
        )}
      </span>

      {hovered && verb.id === "data" && (
        <span aria-hidden className="pointer-events-none absolute left-0 right-0 top-[calc(100%+0.05em)] flex items-center">
          <span className="h-[9px] w-px bg-bone" />
          <span className="h-px flex-1 bg-bone/70" />
          <span className="mono mx-1.5 text-[11px] font-normal tracking-normal text-bone">{width}px</span>
          <span className="h-px flex-1 bg-bone/70" />
          <span className="h-[9px] w-px bg-bone" />
        </span>
      )}
    </button>
  );
}
