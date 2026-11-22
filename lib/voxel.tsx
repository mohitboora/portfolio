import type { ReactNode } from "react";

/** A face decal in the box's local face coordinates (u across, v up), 0..1 */
export type Decal = { plane: "L" | "R"; u: number; v: number; w: number; h: number; c: string };

export type Box = {
  x: number;
  y: number;
  z: number;
  w?: number;
  d?: number;
  h?: number;
  c: string;
  decals?: Decal[];
};

export type Proj = (x: number, y: number, z: number) => [number, number];

const S = 20; // pixels per voxel unit

const proj: Proj = (x, y, z) => [(x - y) * S * 0.866, (x + y) * S * 0.5 - z * S];

function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `rgb(${r},${g},${b})`;
}

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pts = (arr: [number, number][]) => arr.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

function BoxSvg({ b }: { b: Box }) {
  const { x, y, z, w = 1, d = 1, h = 1, c } = b;
  const top = pts([proj(x, y, z + h), proj(x + w, y, z + h), proj(x + w, y + d, z + h), proj(x, y + d, z + h)]);
  const left = pts([proj(x, y + d, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x, y + d, z + h)]);
  const right = pts([proj(x + w, y, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x + w, y, z + h)]);
  return (
    <g stroke="rgba(0,0,0,0.28)" strokeWidth={0.7} strokeLinejoin="round">
      <polygon points={left} fill={shade(c, 0.78)} />
      <polygon points={right} fill={shade(c, 0.5)} />
      <polygon points={top} fill={shade(c, 1.25)} />
      {b.decals?.map((dc, i) => {
        const u0 = dc.u;
        const u1 = dc.u + dc.w;
        const v0 = dc.v;
        const v1 = dc.v + dc.h;
        const p: [number, number][] =
          dc.plane === "L"
            ? [
                proj(x + u0 * w, y + d, z + v0 * h),
                proj(x + u1 * w, y + d, z + v0 * h),
                proj(x + u1 * w, y + d, z + v1 * h),
                proj(x + u0 * w, y + d, z + v1 * h),
              ]
            : [
                proj(x + w, y + u0 * d, z + v0 * h),
                proj(x + w, y + u1 * d, z + v0 * h),
                proj(x + w, y + u1 * d, z + v1 * h),
                proj(x + w, y + u0 * d, z + v1 * h),
              ];
        return <polygon key={i} points={pts(p)} fill={dc.c} stroke="none" />;
      })}
    </g>
  );
}

type Props = {
  boxes: Box[];
  className?: string;
  /** drawn behind all boxes (glows, shadows) */
  under?: (p: Proj) => ReactNode;
  /** drawn on top of all boxes (legs, lines) */
  over?: (p: Proj) => ReactNode;
  idPrefix?: string;
};

export function IsoScene({ boxes, className, under, over }: Props) {
  const sorted = [...boxes].sort((a, b) => {
    const da = a.x + (a.w ?? 1) / 2 + a.y + (a.d ?? 1) / 2 + a.z + (a.h ?? 1) / 2;
    const db = b.x + (b.w ?? 1) / 2 + b.y + (b.d ?? 1) / 2 + b.z + (b.h ?? 1) / 2;
    return da - db;
  });
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const b of boxes) {
    const { x, y, z, w = 1, d = 1, h = 1 } = b;
    for (const [px, py, pz] of [
      [x, y, z],
      [x + w, y, z],
      [x, y + d, z],
      [x + w, y + d, z],
      [x, y, z + h],
      [x + w, y, z + h],
      [x, y + d, z + h],
      [x + w, y + d, z + h],
    ]) {
      const [sx, sy] = proj(px, py, pz);
      minX = Math.min(minX, sx);
      maxX = Math.max(maxX, sx);
      minY = Math.min(minY, sy);
      maxY = Math.max(maxY, sy);
    }
  }
  const pad = 20;
  const vb = `${(minX - pad).toFixed(0)} ${(minY - pad).toFixed(0)} ${(maxX - minX + pad * 2).toFixed(0)} ${(maxY - minY + pad * 2).toFixed(0)}`;
  return (
    <svg viewBox={vb} className={className} aria-hidden="true" focusable="false" shapeRendering="geometricPrecision">
      {under?.(proj)}
      {sorted.map((b, i) => (
        <BoxSvg key={i} b={b} />
      ))}
      {over?.(proj)}
    </svg>
  );
}

/* ---------- Scene generators ---------- */

const LEAVES = ["#1d5a24", "#25702c", "#174a1d", "#2c7f33", "#1a5230", "#1f6a5c", "#1b6470"];
const BARK = ["#3a2616", "#46301c", "#2f1f12"];

/** A blocky Minecraft-style tree canopy + trunk cluster, designed to be cropped by the viewport edge */
export function treeBoxes(seed: number, trunkHeight = 12): Box[] {
  const r = rng(seed);
  const boxes: Box[] = [];
  for (let z = 0; z < trunkHeight; z++) {
    boxes.push({ x: 0, y: 0, z, w: 2, d: 2, c: BARK[Math.floor(r() * BARK.length)] });
  }
  const layers = [
    { z: trunkHeight - 4, rad: 4.2 },
    { z: trunkHeight - 3, rad: 5.2 },
    { z: trunkHeight - 2, rad: 5.4 },
    { z: trunkHeight - 1, rad: 4.6 },
    { z: trunkHeight, rad: 3.4 },
    { z: trunkHeight + 1, rad: 2.2 },
  ];
  for (const L of layers) {
    const R = Math.ceil(L.rad);
    for (let i = -R; i <= R; i++) {
      for (let j = -R; j <= R; j++) {
        const dist = Math.hypot(i, j);
        if (dist > L.rad + r() * 1.1 - 0.4) continue;
        if (i >= 0 && i < 2 && j >= 0 && j < 2 && L.z < trunkHeight) continue;
        // teal-lit blocks are rarer, giving the cool rim light from the reference
        const teal = r() < 0.18;
        const c = teal ? LEAVES[5 + Math.floor(r() * 2)] : LEAVES[Math.floor(r() * 5)];
        boxes.push({ x: i, y: j, z: L.z, c });
      }
    }
  }
  // a few stray floating leaf blocks
  for (let k = 0; k < 7; k++) {
    boxes.push({
      x: Math.round((r() - 0.5) * 14),
      y: Math.round((r() - 0.5) * 14),
      z: trunkHeight + 2 + Math.floor(r() * 4),
      c: LEAVES[Math.floor(r() * LEAVES.length)],
    });
  }
  return boxes;
}

const GRASS = ["#2f7a2a", "#37862f", "#2a6b26", "#3f8f33"];
const DIRT = ["#4a3320", "#3d2a1a"];
const CREEPER = "#2f9e6e";
const FACE = "#04120a";

/** Campfire clearing with a creeper and a spider, echoing the reference's bottom-right scene */
export function campfireScene(): { boxes: Box[]; under: (p: Proj) => ReactNode; over: (p: Proj) => ReactNode } {
  const r = rng(77);
  const boxes: Box[] = [];

  // ground slab 14 x 9
  for (let x = 0; x < 14; x++) {
    for (let y = 0; y < 9; y++) {
      boxes.push({ x, y, z: -1, c: GRASS[Math.floor(r() * GRASS.length)] });
      if (x === 13 || y === 8) boxes.push({ x, y, z: -2, c: DIRT[Math.floor(r() * 2)] });
    }
  }
  // raised grass step
  for (let x = 8; x < 14; x++) for (let y = 0; y < 4; y++) boxes.push({ x, y, z: 0, c: GRASS[Math.floor(r() * 4)] });

  // campfire (logs + flames) at x=9..10, y=1..2 on the step
  boxes.push({ x: 9, y: 1, z: 1, w: 2, d: 0.6, h: 0.6, c: "#4a2d18" });
  boxes.push({ x: 9, y: 2, z: 1, w: 2, d: 0.6, h: 0.6, c: "#3b2412" });
  boxes.push({ x: 9.4, y: 1.4, z: 1.6, w: 1.2, d: 1.2, h: 1, c: "#ff6a1a" });
  boxes.push({ x: 9.6, y: 1.6, z: 2.6, w: 0.8, d: 0.8, h: 1, c: "#ffb02e" });
  boxes.push({ x: 9.75, y: 1.75, z: 3.6, w: 0.5, d: 0.5, h: 0.7, c: "#ffe27a" });

  // stump with candles
  boxes.push({ x: 5, y: 1, z: 0, w: 1.4, d: 1.4, h: 1.6, c: "#5a3a22" });
  boxes.push({ x: 5.4, y: 1.4, z: 1.6, w: 0.3, d: 0.3, h: 0.7, c: "#e8d9a8" });
  boxes.push({ x: 5.9, y: 1.7, z: 1.6, w: 0.3, d: 0.3, h: 0.5, c: "#e8d9a8" });

  // creeper at (7,3)
  const cx = 7;
  const cy = 3.4;
  for (const [lx, ly] of [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ]) {
    boxes.push({ x: cx + lx, y: cy + ly, z: 0, w: 1, d: 1, h: 1.5, c: "#27845c" });
  }
  boxes.push({ x: cx, y: cy + 0.5, z: 1.5, w: 2, d: 1, h: 3, c: CREEPER });
  const face: Decal[] = [];
  const rows = [
    "........",
    "........",
    ".##..##.",
    ".##..##.",
    "...##...",
    "..####..",
    "..####..",
    "..#..#..",
  ];
  rows.forEach((row, ri) =>
    row.split("").forEach((ch, ci) => {
      if (ch === "#") face.push({ plane: "L", u: ci / 8, v: 1 - (ri + 1) / 8, w: 1 / 8, h: 1 / 8, c: FACE });
    }),
  );
  boxes.push({ x: cx, y: cy, z: 4.5, w: 2, d: 2, h: 2, c: "#35aa78", decals: face });

  // spider on the raised ground behind
  const sx = 3;
  const sy = 1.2;
  boxes.push({ x: sx, y: sy, z: 0, w: 1.8, d: 1.6, h: 0.9, c: "#2a2028" });
  boxes.push({
    x: sx - 1.1,
    y: sy + 0.1,
    z: 0.1,
    w: 1.1,
    d: 1.3,
    h: 1,
    c: "#3a2c36",
    decals: [
      { plane: "L", u: 0.12, v: 0.45, w: 0.22, h: 0.22, c: "#ff3b3b" },
      { plane: "L", u: 0.6, v: 0.45, w: 0.22, h: 0.22, c: "#ff3b3b" },
    ],
  });

  const under = (p: Proj) => {
    const [fx, fy] = p(10, 2, 2);
    return (
      <>
        <defs>
          <radialGradient id="fireGlow">
            <stop offset="0" stopColor="#ff9a2e" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#ff6a1a" stopOpacity="0.16" />
            <stop offset="1" stopColor="#ff6a1a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="flicker" cx={fx} cy={fy} r={170} fill="url(#fireGlow)" />
      </>
    );
  };

  const over = (p: Proj) => {
    // spider legs
    const legs: ReactNode[] = [];
    const base = [
      [sx + 0.2, sy + 1.6],
      [sx + 0.7, sy + 1.6],
      [sx + 1.2, sy + 1.6],
      [sx + 1.7, sy + 1.5],
    ];
    base.forEach(([bx, by], i) => {
      const a = p(bx, by, 0.5);
      const b = p(bx + 0.3, by + 1.2, 1.3 - i * 0.05);
      const c = p(bx + 0.6, by + 2, -0.9);
      legs.push(
        <polyline key={i} points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`} fill="none" stroke="#1d151b" strokeWidth={5} strokeLinejoin="miter" />,
      );
    });
    return <>{legs}</>;
  };

  return { boxes, under, over };
}
