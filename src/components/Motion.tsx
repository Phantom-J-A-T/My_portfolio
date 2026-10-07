import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { PROFILE } from "../data";
import { useScramble } from "../lib/Scramble";

const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
const BOOT_KEY = "phantom:booted";

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * First-visit intro: the name decodes, a progress hairline fills, then the
 * curtain wipes up as the grid assembles underneath. Once per session;
 * click or any key skips it.
 */
export function Boot({ tiles, onReveal }: { tiles: number; onReveal: () => void }) {
  const [phase, setPhase] = useState<"run" | "exit" | "gone">("run");
  const [name, play] = useScramble(PROFILE.name.toUpperCase(), 760);
  const [step, setStep] = useState(0);
  const revealed = useRef(false);
  const lenis = useLenis();

  const exit = () => {
    if (revealed.current) return;
    revealed.current = true;
    sessionStorage.setItem(BOOT_KEY, "1");
    setPhase("exit");
    onReveal();
  };

  useEffect(() => {
    const skipParam = new URLSearchParams(window.location.search).has("skipintro");
    if (sessionStorage.getItem(BOOT_KEY) || skipParam || prefersReduced()) {
      revealed.current = true;
      setPhase("gone");
      onReveal();
      return;
    }
    document.body.style.overflow = "hidden";
    play();
    const timers = [
      window.setTimeout(() => setStep(1), 60),
      window.setTimeout(() => setStep(2), 380),
      window.setTimeout(() => setStep(3), 760),
      window.setTimeout(exit, 1250),
    ];
    const skip = () => exit();
    window.addEventListener("keydown", skip);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hold the page still while the intro plays.
  useEffect(() => {
    if (phase === "run") lenis?.stop();
    else {
      document.body.style.overflow = "";
      lenis?.start();
    }
  }, [phase, lenis]);

  if (phase === "gone") return null;

  const log = [`loading ${tiles} tiles`, "dithering images", "ready"];

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex cursor-pointer flex-col items-center justify-center bg-void px-6"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: phase === "exit" ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 0.7, ease: EASE_IN_OUT }}
      onAnimationComplete={() => phase === "exit" && setPhase("gone")}
      onClick={exit}
      aria-hidden
    >
      <p className="display text-center text-bone" style={{ fontSize: "clamp(34px, 7vw, 92px)" }}>
        {name}
      </p>
      <div className="mt-8 h-px w-[min(320px,70vw)] bg-edge">
        <div
          className="h-full origin-left bg-bone"
          style={{
            transform: `scaleX(${step / 3})`,
            transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      </div>
      <ul className="mono mt-5 h-[60px] w-[min(320px,70vw)] text-[11px] leading-[20px] text-ash">
        {log.slice(0, step).map((l, i) => (
          <li key={l} className={i === step - 1 ? "text-bone" : ""}>
            &gt; {l}
          </li>
        ))}
      </ul>
      <p className="label absolute bottom-8">Click or press any key to skip</p>
    </motion.div>
  );
}

/** Feeds the pointer position to whichever tile is under it, for the border light. */
export function Spotlight() {
  useEffect(() => {
    if (!finePointer()) return;
    const onMove = (e: PointerEvent) => {
      const tile = (e.target as Element | null)?.closest?.<HTMLElement>(".tile");
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
      tile.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

/** Faint viewport hairlines that track the pointer, with a coordinate readout. */
export function Crosshair() {
  const [enabled, setEnabled] = useState(false);
  const h = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setEnabled(finePointer()), []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    let overLink = false;
    const pad = (n: number) => String(Math.round(n)).padStart(4, "0");
    const draw = () => {
      raf = 0;
      if (h.current) h.current.style.transform = `translate3d(0, ${y}px, 0)`;
      if (v.current) v.current.style.transform = `translate3d(${x}px, 0, 0)`;
      if (label.current) {
        label.current.style.transform = `translate3d(${x + 14}px, ${y + 14}px, 0)`;
        label.current.textContent = `x ${pad(x)}  y ${pad(y)}`;
        label.current.style.opacity = overLink ? "0" : "1";
      }
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      overLink = !!(e.target as Element | null)?.closest?.("[data-cursor]");
      if (root.current) root.current.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onLeave = () => root.current && (root.current.style.opacity = "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={root} className="crosshair" style={{ opacity: 0, transition: "opacity 0.2s ease" }} aria-hidden>
      <div ref={h} className="h-px w-full bg-white/[0.09]" />
      <div ref={v} className="h-full w-px bg-white/[0.09]" />
      <div ref={label} className="mono whitespace-pre text-[10px] tracking-wide text-white/60" />
    </div>
  );
}
