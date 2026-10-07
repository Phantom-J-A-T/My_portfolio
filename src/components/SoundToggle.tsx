import { useEffect, useSyncExternalStore } from "react";
import { soundtrack } from "../lib/sound";

const subscribe = (fn: () => void) => soundtrack().subscribe(fn);
const getPlaying = () => soundtrack().playing;
const getServer = () => false;

export function useSoundOn() {
  return useSyncExternalStore(subscribe, getPlaying, getServer);
}

/**
 * Sound switch, living at the end of the filter dock. Off by default; the soundtrack only starts from this click
 * (or the terminal). While it plays, scroll speed opens the arp filter and hovering
 * a project plays a note in key.
 */
export function SoundToggle() {
  const on = useSoundOn();

  useEffect(() => {
    if (!on) return;
    const track = soundtrack();

    // Scroll speed → filter, eased so it breathes rather than jitters.
    let lastY = window.scrollY;
    let lastT = performance.now();
    let level = 0;
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT); // px per ms
      lastY = window.scrollY;
      lastT = now;
      level += (Math.min(1, v / 2.5) - level) * 0.08;
      track.setMotion(level);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // A note when the pointer arrives on a project.
    let current: Element | null = null;
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-cursor]") ?? null;
      if (el && el !== current) track.blip();
      current = el;
    };
    document.addEventListener("pointerover", onOver);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", onOver);
    };
  }, [on]);

  return (
    <button
      type="button"
      onClick={() => soundtrack().toggle()}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound off" : "Sound on"}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-bone transition-colors hover:bg-white/10"
    >
      <span className="eq flex h-3.5 items-end gap-[3px]" data-on={on} aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="w-[3px] rounded-full bg-bone" />
        ))}
      </span>
    </button>
  );
}
