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

/**
 * Feeds the pointer position to whichever tile is under it, for the border light.
 * Painted directly (no easing) and re-hit-tested every frame while the pointer or
 * the page is moving, so the light stays locked to the cursor even mid-scroll.
 */
export function Spotlight() {
  useEffect(() => {
    if (!finePointer()) return;
    let x = -1;
    let y = -1;
    let raf = 0;
    let activeUntil = 0;

    const paint = () => {
      if (x >= 0) {
        const tile = document.elementFromPoint(x, y)?.closest<HTMLElement>(".tile");
        if (tile) {
          const r = tile.getBoundingClientRect();
          tile.style.setProperty("--mx", `${x - r.left}px`);
          tile.style.setProperty("--my", `${y - r.top}px`);
        }
      }
      raf = performance.now() < activeUntil ? requestAnimationFrame(paint) : 0;
    };

    // Keep painting for a moment after the last input, while scroll and springs settle.
    const wake = () => {
      activeUntil = performance.now() + 600;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      paint(); // this frame, not the next one
      wake();
    };
    const onLeave = () => {
      x = y = -1;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", wake);
    };
  }, []);
  return null;
}
