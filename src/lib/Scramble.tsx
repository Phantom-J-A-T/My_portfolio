import { useCallback, useEffect, useRef, useState, type ElementType } from "react";

const GLYPHS = "01<>/\\|_-=+*#%&?";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Returns the scrambled string and a function that replays the decode. */
export function useScramble(text: string, duration = 520) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const play = useCallback(() => {
    if (reducedMotion()) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(t * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        s += i < revealed || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    setOut(text);
    return () => cancelAnimationFrame(raf.current);
  }, [text]);

  return [out, play] as const;
}

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  /** Replays when the nearest [data-scramble-host] ancestor is hovered. */
  onHost?: boolean;
}

/** Text that decodes from glyph noise when it scrolls into view. */
export function Scramble({ text, as: Tag = "span", className, onHost = true }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [out, play] = useScramble(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    const host = onHost ? el.closest("[data-scramble-host]") : null;
    host?.addEventListener("mouseenter", play);
    return () => {
      io.disconnect();
      host?.removeEventListener("mouseenter", play);
    };
  }, [play, onHost]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </Tag>
  );
}
