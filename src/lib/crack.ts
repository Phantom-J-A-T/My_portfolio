// Procedural fracture lines: a few jagged rays from an impact point,
// each throwing off shorter branches. Seeded so the same crack renders every time.

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function crackPaths(cx: number, cy: number, reach: number, seed = 7, rays = 9) {
  const rand = rng(seed);
  const paths: string[] = [];

  const walk = (x: number, y: number, angle: number, length: number, depth: number) => {
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    const steps = 5 + Math.floor(rand() * 5);
    const step = length / steps;
    for (let i = 0; i < steps; i++) {
      angle += (rand() - 0.5) * 0.7;
      x += Math.cos(angle) * step;
      y += Math.sin(angle) * step;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      if (depth < 2 && rand() < 0.28) {
        walk(x, y, angle + (rand() < 0.5 ? -1 : 1) * (0.5 + rand() * 0.6), length * 0.4, depth + 1);
      }
    }
    paths.push(d);
  };

  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2 + rand() * 0.5;
    walk(cx, cy, angle, reach * (0.55 + rand() * 0.6), 0);
  }

  // A small ring of shattered glass around the impact.
  const ring: string[] = [];
  for (let i = 0; i <= 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const r = 10 + rand() * 9;
    ring.push(`${i ? "L" : "M"}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  paths.push(ring.join(" "));
  return paths;
}
