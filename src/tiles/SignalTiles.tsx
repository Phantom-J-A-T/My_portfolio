import { useState } from "react";
import { motion } from "motion/react";
import { Lock, LockOpen } from "lucide-react";
import { LANGUAGE_SERIES, SECRET_NOTE } from "../data";
import { DitherImage } from "../lib/DitherImage";
import { EmailButton } from "../lib/EmailButton";
import { Scramble, useScramble } from "../lib/Scramble";

/* ---------- Redacted write-up (security placeholder) ---------- */

// [text, redacted] pairs. TODO: replace with a real write-up teaser.
const DOC: [string, boolean][] = [
  ["Target: ", false],
  ["your first box", true],
  [". Recon turned up ", false],
  ["the open ports", true],
  [", the foothold came from ", false],
  ["the vulnerable service", true],
  [", and root came from ", false],
  ["a privilege escalation", true],
  [". Lessons: ", false],
  ["what you'd do differently", true],
  [".", false],
];

export function RedactedTile() {
  const [open, setOpen] = useState(false);
  return (
    <article
      className="tile group cursor-pointer p-6"
      data-scramble-host
      data-open={open}
      onClick={() => setOpen((o) => !o)}
    >
      <p className="label flex items-center justify-between">
        <span className="flex items-center gap-2">
          CTF write-up
          <span className="rounded-[4px] px-1 text-bone ring-1 ring-edge-hi">draft</span>
        </span>
        <span>{open ? "Tap to redact" : "Hover or tap"}</span>
      </p>
      <h3 className="mt-4">
        <Scramble text="Classified until published" className="text-[17px] font-medium text-bone" />
      </h3>
      <p className="mt-3 text-[14px] leading-[1.9] text-ash">
        {DOC.map(([t, hidden], i) =>
          hidden ? (
            <span key={i} className="redact" style={{ transitionDelay: `${i * 35}ms, ${i * 35 + 200}ms` }}>
              {t}
            </span>
          ) : (
            <span key={i}>{t}</span>
          ),
        )}
      </p>
    </article>
  );
}

/* ---------- Cracked-glass statement ---------- */

export function CrackTile() {
  return (
    <article className="tile decrypt h-[320px]">
      <span className="absolute inset-0 block">
        <DitherImage src="/img/cracked-glass.jpg" alt="" className="h-full w-full" contrast={1.5} />
      </span>
      <p className="absolute bottom-3 left-3 right-3 rounded-[12px] bg-black/90 px-4 py-3.5 text-[16px] leading-snug text-bone ring-1 ring-edge">
        Every system has a crack. I'd rather find it before someone else does.
      </p>
    </article>
  );
}

/* ---------- Encrypted note ---------- */

export function CipherTile() {
  const cipher = btoa(SECRET_NOTE);
  const [open, setOpen] = useState(false);
  const [plain, play] = useScramble(SECRET_NOTE, 900);

  const decrypt = () => {
    setOpen(true);
    play();
  };

  return (
    <article className="tile p-6">
      <p className="label flex items-center justify-between">
        <span>Encrypted note</span>
        <span>base64</span>
      </p>
      <p
        className={`mono mt-4 break-all text-[13px] leading-[1.8] ${open ? "text-bone" : "text-dim"}`}
        aria-live="polite"
      >
        {open ? plain : cipher}
      </p>
      {open ? (
        <EmailButton className="mt-5" label="Copy my email" solid />
      ) : (
        <button type="button" onClick={decrypt} className="pill mt-5 w-full">
          <Lock className="h-4 w-4" aria-hidden />
          Decrypt it
        </button>
      )}
      {open && (
        <p className="label mt-3 flex items-center gap-1.5">
          <LockOpen className="h-3 w-3" aria-hidden /> Decoded
        </p>
      )}
    </article>
  );
}

/* ---------- Data: a single-series bar chart ---------- */

export function ChartTile() {
  const { title, caption, points } = LANGUAGE_SERIES;
  const max = Math.max(...points.map((p) => p.value));
  const [active, setActive] = useState<number | null>(null);

  return (
    <article className="tile p-6">
      <p className="label flex items-center justify-between">
        <span>Data</span>
        <span>{caption}</span>
      </p>
      <h3 className="mt-4 text-[17px] font-medium text-bone">{title}</h3>
      <p className="text-[13px] text-ash">Mostly backend: Python leads with {points[0].value}.</p>

      <div className="relative mt-6 h-[150px]" onMouseLeave={() => setActive(null)}>
        {/* recessive grid: half and max */}
        {[0.5, 1].map((g) => (
          <div
            key={g}
            className="absolute inset-x-0 border-t border-dashed border-edge"
            style={{ bottom: `${g * 100}%` }}
          >
            <span className="mono absolute -top-[9px] left-0 bg-slab pr-1.5 text-[10px] text-dim">
              {Math.round(max * g)}
            </span>
          </div>
        ))}
        <div className="absolute inset-0 left-7 flex items-end gap-[6px]" role="list" aria-label={title}>
          {points.map((p, i) => {
            const on = active === null ? i === 0 : active === i;
            return (
              <button
                key={p.label}
                type="button"
                role="listitem"
                aria-label={`${p.label}: ${p.value}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="relative flex h-full flex-1 cursor-default items-end"
              >
                <motion.span
                  className="block w-full origin-bottom rounded-t-[4px] bg-bone transition-opacity duration-200"
                  style={{ height: `${(p.value / max) * 100}%`, opacity: on ? 1 : 0.28 }}
                  initial={{ transform: "scaleY(0)" }}
                  whileInView={{ transform: "scaleY(1)" }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.15 + i * 0.045 }}
                />
                {on && (
                  <span
                    className="mono pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-bone px-1.5 py-0.5 text-[10px] text-void"
                    style={{ bottom: `calc(${(p.value / max) * 100}% + 6px)` }}
                  >
                    {p.label} · {p.value}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="ml-7 border-t border-edge-hi" />
      <p className="label mt-2 ml-7 flex gap-[6px]">
        {points.map((p) => (
          <span key={p.label} className="flex-1 truncate text-center text-[9.5px]">
            {p.label}
          </span>
        ))}
      </p>
    </article>
  );
}

/* ---------- Contact ---------- */

export function ContactTile() {
  return (
    <section className="tile p-6" style={{ containerType: "inline-size" }} aria-label="Contact" data-scramble-host>
      <p className="label">Contact</p>
      <h2 className="display mt-5 text-bone" style={{ fontSize: "min(17cqw, 60px)" }}>
        <Scramble text="Say hello" />
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-ash">
        Something to build, break or measure? Email is the fastest way to reach me: freelance, full-time, or a quick
        question.
      </p>
      <EmailButton className="mt-6" solid />
    </section>
  );
}
