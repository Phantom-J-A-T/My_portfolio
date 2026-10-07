import { useEffect, useRef, type CSSProperties } from "react";

// 8x8 ordered-dither threshold map, built from the recursive Bayer definition.
const BAYER = (() => {
  let m = [[0]];
  while (m.length < 8) {
    const n = m.length;
    const next: number[][] = Array.from({ length: n * 2 }, () => Array(n * 2).fill(0));
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = m[y][x] * 4;
        next[y][x] = v;
        next[y][x + n] = v + 2;
        next[y + n][x] = v + 3;
        next[y + n][x + n] = v + 1;
      }
    }
    m = next;
  }
  return m.flat().map((v) => (v + 0.5) / 64);
})();

const INK = 236; // matches --color-bone

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Size of one dither dot in CSS pixels. */
  cell?: number;
  contrast?: number;
  brightness?: number;
  /** Forces the decrypted state, e.g. inside an open case study. */
  open?: boolean;
  style?: CSSProperties;
  /** Render light areas as empty and dark as ink: light UIs read as negatives. */
  invert?: boolean;
  /** Focal point for object-fit: cover, 0–1 on each axis. */
  focus?: [number, number];
}

export function DitherImage({
  src,
  alt,
  className = "",
  cell = 3,
  contrast = 1.25,
  brightness = 0,
  open = false,
  focus = [0.5, 0.5],
  invert = false,
  style,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.decoding = "async";
    img.src = src;
    let cancelled = false;

    const draw = () => {
      if (cancelled || !img.naturalWidth) return;
      const w = Math.max(1, Math.ceil(wrap.clientWidth / cell));
      const h = Math.max(1, Math.ceil(wrap.clientHeight / cell));
      canvas.width = w;
      canvas.height = h;

      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) * focus[0], (h - dh) * focus[1], dw, dh);

      const frame = ctx.getImageData(0, 0, w, h);
      const px = frame.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          let lum = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
          if (invert) lum = 1 - lum;
          lum = (lum - 0.5) * contrast + 0.5 + brightness;
          const v = lum > BAYER[(y & 7) * 8 + (x & 7)] ? INK : 0;
          px[i] = px[i + 1] = px[i + 2] = v;
          px[i + 3] = 255;
        }
      }
      ctx.putImageData(frame, 0, 0);
    };

    img.onload = draw;
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [src, cell, contrast, brightness, invert, focus[0], focus[1]]);

  return (
    <span
      ref={wrapRef}
      className={`dither relative block overflow-hidden bg-void ${className}`}
      data-open={open}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%` }}
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
    </span>
  );
}
