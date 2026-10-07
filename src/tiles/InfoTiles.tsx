import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { PROFILE, TODOS, TOOLCHAIN } from "../data";
import { GITHUB_WEEKS as WEEKS } from "../data";
import { GithubIcon } from "../lib/icons";
import { Scramble } from "../lib/Scramble";
import { useSite } from "../lib/site";
import { useClock } from "../lib/useClock";

/* ---------- Currently at ---------- */

export function NowTile() {
  const { openProject } = useSite();
  const role = PROFILE.roles[0];
  return (
    <button
      type="button"
      onClick={() => openProject(role.project)}
      className="tile press block w-full cursor-pointer p-6 text-left"
      data-scramble-host
      data-cursor="open"
      aria-label={`Currently ${role.title} at ${role.org}, building ${role.product}. Open the ${role.product} case study`}
    >
      <span className="flex items-center justify-between">
        <span className="label">Currently at</span>
        <span className="label text-dim">{PROFILE.roles.length}</span>
      </span>
      <span className="mt-2 flex items-center justify-between gap-4">
        <span className="min-w-0">
          <Scramble text={role.org} className="block text-[17px] font-medium text-bone" />
          <span className="mt-6 block text-[15px] text-bone">{PROFILE.name}</span>
          <span className="block text-[14px] text-ash">
            {role.title}, building {role.product}
          </span>
        </span>
        <Seal initials={role.org.slice(0, 2).toUpperCase()} />
      </span>
    </button>
  );
}

/** A slowly turning dotted ring with the organisation's initials. */
function Seal({ initials }: { initials: string }) {
  const dots = 36;
  return (
    <span className="relative flex h-[92px] w-[92px] shrink-0 items-center justify-center" aria-hidden>
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_40s_linear_infinite]">
        {Array.from({ length: dots }, (_, i) => {
          const a = (i / dots) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={(50 + Math.cos(a) * 46).toFixed(2)}
              cy={(50 + Math.sin(a) * 46).toFixed(2)}
              r={i % 3 === 0 ? 1.8 : 1}
              fill="var(--color-bone)"
              opacity={i % 3 === 0 ? 0.9 : 0.35}
            />
          );
        })}
      </svg>
      <span className="display text-[26px] text-bone">{initials}</span>
    </span>
  );
}

/* ---------- GitHub ---------- */

/** Renders the server-fetched snapshot; never calls GitHub from the browser. */
export function GithubTile() {
  const { github } = useSite();
  const user = PROFILE.links.githubUser;
  const { repos, followers, days } = github;
  const total = days?.reduce((n, d) => n + d.count, 0);
  const cells = days ?? Array.from({ length: WEEKS * 7 }, () => null);

  return (
    <article className="tile p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.07] ring-1 ring-edge">
          <GithubIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="label">github.com</p>
          <p className="truncate text-[15px] text-bone">@{user}</p>
          <p className="text-[13px] text-ash">
            {repos != null ? `${repos} public repos · ${followers ?? 0} followers` : "Backend, security and data work"}
          </p>
        </div>
        <a href={PROFILE.links.github} target="_blank" rel="noreferrer" className="pill">
          Follow
        </a>
      </div>

      <div
        className="mt-6 grid gap-[3px]"
        style={{ gridTemplateRows: "repeat(7, 1fr)", gridAutoFlow: "column", gridAutoColumns: "1fr" }}
        role="img"
        aria-label={total != null ? `${total} contributions in the last ${WEEKS} weeks` : "Contribution graph"}
      >
        {cells.map((d, i) => (
          <span
            key={i}
            title={d ? `${d.count} on ${d.date}` : undefined}
            className="aspect-square rounded-[2px] bg-bone"
            style={{ opacity: d ? [0.07, 0.3, 0.5, 0.75, 1][d.level] : 0.05 }}
          />
        ))}
      </div>
      <p className="label mt-3 flex justify-between">
        <span>Last {WEEKS} weeks</span>
        {total != null ? (
          <span>{total} contributions</span>
        ) : (
          <a href={PROFILE.links.github} target="_blank" rel="noreferrer" className="hover:text-bone">
            View the profile
          </a>
        )}
      </p>
    </article>
  );
}

/* ---------- Location, clock and globe ---------- */

export function ClockTile() {
  const { h, m, s } = useClock(PROFILE.timezone);
  return (
    <article className="tile flex h-[280px] flex-col justify-between p-6">
      <div className="relative z-10">
        <p className="label">Based in</p>
        <p className="mt-1 text-[17px] text-bone">{PROFILE.location} · working remotely</p>
        <p className="text-[13px] text-ash">West Africa Time, UTC+1</p>
      </div>
      <p className="display relative z-10 text-[44px] text-bone" aria-label={`Local time ${h}:${m}`}>
        {h}
        <span className="blink">:</span>
        {m}
        <span className="text-[22px] text-ash">{s}</span>
      </p>
      <Globe />
    </article>
  );
}

/** A dot sphere that turns slowly, with Nigeria lit. */
function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = 260;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Fibonacci sphere.
    const N = 900;
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = Math.PI * (3 - Math.sqrt(5)) * i;
      return [Math.cos(t) * r, y, Math.sin(t) * r];
    });
    const { lat, lon } = PROFILE.coords;
    const la = (lat * Math.PI) / 180;
    const lo = (lon * Math.PI) / 180;
    const home = [Math.cos(la) * Math.cos(lo), -Math.sin(la), Math.cos(la) * Math.sin(lo)];

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rot = -lo - Math.PI / 2 + 0.6;
    let raf = 0;
    let visible = true;
    const R = size * 0.46;
    const c = size / 2;

    const project = (p: number[]) => {
      const x = p[0] * Math.cos(rot) - p[2] * Math.sin(rot);
      const z = p[0] * Math.sin(rot) + p[2] * Math.cos(rot);
      const tilt = 0.35;
      const y = p[1] * Math.cos(tilt) - z * Math.sin(tilt);
      const z2 = p[1] * Math.sin(tilt) + z * Math.cos(tilt);
      return [c + x * R, c + y * R, z2];
    };

    const frame = () => {
      ctx.clearRect(0, 0, size, size);
      for (const p of pts) {
        const [x, y, z] = project(p);
        if (z < -0.15) continue;
        ctx.globalAlpha = 0.08 + Math.max(0, z) * 0.45;
        ctx.fillStyle = "#ececec";
        ctx.fillRect(x, y, 1.4, 1.4);
      }
      const [hx, hy, hz] = project(home);
      if (hz > 0) {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(hx, hy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(hx, hy, 8 + ((performance.now() / 60) % 10), 0, Math.PI * 2);
        ctx.strokeStyle = "#ececec";
        ctx.stroke();
      }
      if (!still && visible) {
        rot += 0.0025;
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) frame();
    });
    io.observe(canvas);
    frame();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute -bottom-[70px] -right-[60px] h-[260px] w-[260px]"
    />
  );
}

/* ---------- To-do ---------- */

export function TodoTile() {
  const done = TODOS.filter((t) => t.done).length;
  return (
    <article className="tile p-6">
      <p className="label flex justify-between">
        <span>To-do</span>
        <span>
          {done}/{TODOS.length}
        </span>
      </p>
      <ul className="mt-4 space-y-2.5">
        {TODOS.map((t) => (
          <li key={t.text} className="flex items-center gap-3 text-[14px]">
            <span
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] ${
                t.done ? "bg-bone text-void" : "ring-1 ring-edge-hi"
              }`}
              aria-hidden
            >
              {t.done && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className={t.done ? "text-dim line-through decoration-dim" : "text-bone"}>
              <span className="sr-only">{t.done ? "Done: " : "To do: "}</span>
              {t.text}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ---------- Toolchain ---------- */

export function ToolchainTile() {
  const { filter } = useSite();
  const rows = [TOOLCHAIN.slice(0, 9), TOOLCHAIN.slice(9)];
  return (
    <article className="tile py-6">
      <p className="label flex justify-between px-6">
        <span>Toolchain</span>
        <span>{TOOLCHAIN.length} tools</span>
      </p>
      <p className="sr-only">{TOOLCHAIN.map((t) => t.name).join(", ")}</p>
      <div className="marquee-wrap mt-4 space-y-2 overflow-hidden" aria-hidden>
        {rows.map((row, r) => (
          <div
            key={r}
            className="marquee flex w-max gap-2"
            style={{ animationDirection: r ? "reverse" : "normal" }}
          >
            {[...row, ...row, ...row, ...row].map((t, i) => (
              <span
                key={i}
                className="mono rounded-full px-3 py-1.5 text-[12px] text-bone ring-1 ring-edge transition-opacity duration-500"
                style={{ opacity: filter === "all" || filter === t.d ? 1 : 0.2 }}
              >
                {t.name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}
