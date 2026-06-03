"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// continuous wave: the name stays centered and filling the block (SVG viewBox
// measured from the rendered text). a slow stream of numbers/symbols rolls
// through it left → right on a loop; each letter momentarily becomes a stream
// glyph, then returns to itself. each char renders at its OWN measured center
// so symbols (different widths) never shove neighbors sideways.

const POOL = "0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~".split("");
const randSym = () => POOL[Math.floor(Math.random() * POOL.length)];

const WAVE_DURATION = 6800; // one full L→R pass
const PAUSE_BETWEEN = 1800; // beat between sweeps, name fully back
const SCRAMBLE_TICK = 110; // ms between band reshuffles
const BAND = 4.2; // half-width of the stream in characters (~8 total)
const BASE_Y = 100;

export function NameAnimated({ name }: { name: string }) {
  const chars = Array.from(name);
  const N = chars.length;
  const reduce = useReducedMotion();

  const measureRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState("0 0 1100 140");
  const [centers, setCenters] = useState<number[] | null>(null);
  const [cells, setCells] = useState<{ glyph: string; wave: boolean }[]>(
    chars.map((g) => ({ glyph: g, wave: false })),
  );

  // measure viewBox + per-character centers (after fonts load + on resize)
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled || !el) return;
      const b = el.getBBox();
      if (!b.width) return;
      const padX = 6;
      const padY = 22;
      setViewBox(`${b.x - padX} ${b.y - padY} ${b.width + padX * 2} ${b.height + padY * 2}`);
      try {
        const c: number[] = [];
        for (let i = 0; i < N; i++) {
          const ex = el.getExtentOfChar(i);
          c.push(ex.x + ex.width / 2);
        }
        setCenters(c);
      } catch {
        const step = b.width / N;
        setCenters(chars.map((_, i) => b.x + step * (i + 0.5)));
      }
    };
    measure();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, [N]); // eslint-disable-line react-hooks/exhaustive-deps

  // wave loop — when prefers-reduced-motion is on we skip the loop entirely
  // and render the static name directly (see the render branch below), so
  // there's no cells reset needed here.
  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> = 0 as unknown as ReturnType<typeof setTimeout>;
    let lastTick = 0;
    let scrambleSnap = chars.map((ch) => (ch === " " ? " " : randSym()));

    const run = async () => {
      await new Promise<void>((res) => {
        timer = setTimeout(res, 800);
      });
      if (cancelled) return;

      while (!cancelled) {
        await new Promise<void>((resolve) => {
          const start = performance.now();
          const loop = (now: number) => {
            if (cancelled) return;
            const t = (now - start) / WAVE_DURATION;
            if (t >= 1) {
              setCells(chars.map((g) => ({ glyph: g, wave: false })));
              resolve();
              return;
            }
            if (now - lastTick > SCRAMBLE_TICK) {
              lastTick = now;
              scrambleSnap = chars.map((ch) => (ch === " " ? " " : randSym()));
            }
            // Sweep head from fully off-screen-left (head = -BAND*2) to fully
            // off-screen-right (head = N + BAND), so the band never "pops in"
            // mid-character at the start/end of the pass.
            const head = -BAND * 2 + t * (N + BAND * 3);
            setCells(
              chars.map((ch, i) => {
                const d = i - head;
                if (Math.abs(d) < BAND) {
                  return { glyph: ch === " " ? " " : scrambleSnap[i], wave: true };
                }
                return { glyph: ch, wave: false };
              }),
            );
            raf = requestAnimationFrame(loop);
          };
          raf = requestAnimationFrame(loop);
        });
        if (cancelled) return;
        await new Promise<void>((res) => {
          timer = setTimeout(res, PAUSE_BETWEEN);
        });
      }
    };
    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [N, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const [vx, , vw] = viewBox.split(" ").map(Number);
  const centerX = vx + vw / 2;

  // When prefers-reduced-motion is on, render static glyphs instead of whatever
  // wave-state cells last held (the wave loop is also skipped above).
  const renderedCells = reduce
    ? chars.map((g) => ({ glyph: g, wave: false }))
    : cells;

  return (
    <h1 aria-label={name} className="block w-full leading-[0] text-fg">
      <span className="sr-only">{name}</span>
      <svg
        aria-hidden
        className="block h-auto w-full overflow-visible [&_text]:font-extrabold [&_text]:tracking-[-0.038em] [&_text]:[font-size:100px]"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        <text
          ref={measureRef}
          x="0"
          y={BASE_Y}
          fill="transparent"
          style={{ visibility: "hidden" }}
        >
          {name}
        </text>
        {centers ? (
          renderedCells.map((c, i) => (
            <text
              key={i}
              x={centers[i]}
              y={BASE_Y}
              textAnchor="middle"
              fill={c.wave ? "var(--accent)" : "currentColor"}
            >
              {c.glyph === " " ? " " : c.glyph}
            </text>
          ))
        ) : (
          <text x={centerX} y={BASE_Y} textAnchor="middle" fill="currentColor">
            {name}
          </text>
        )}
      </svg>
    </h1>
  );
}
