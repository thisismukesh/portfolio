// name-anim.jsx — the name stays put, centered. a slow, calm stream of
// random numbers + symbols rolls through it left → right. each letter
// momentarily becomes a glyph from the stream, then returns to itself.
//
// each letter is rendered at its OWN measured x position, so the symbols
// (which have different widths than the letters) don't shove the rest of
// the name sideways — every letter stays put, only its glyph changes.

const { useState, useEffect, useRef } = React;

const ANIM_NAME = 'mukesh saravanan';
const CHARS = ANIM_NAME.split('');
const N = CHARS.length;

const BASE_Y = 130;
const FALLBACK_VIEWBOX = `0 0 1100 180`;

// glyph pool the stream pulls from
const POOL = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`\\'.split('');
const randSym = () => POOL[Math.floor(Math.random() * POOL.length)];

// ─── timings (calm + slow) ───────────────────────────────────────────────
const WAVE_DURATION = 6800;   // one full L→R pass
const PAUSE_BETWEEN = 1800;   // beat between sweeps with the name fully back
const SCRAMBLE_TICK = 110;    // ms between band reshuffles (slower = calmer)
const BAND          = 4.2;    // half-width of the stream in characters
                              // — total stream length ≈ 8 chars, ~half the name

function NameAnimated() {
  const [cells, setCells] = useState(CHARS.map((g) => ({ glyph: g, kind: 'en' })));
  const [viewBox, setViewBox] = useState(FALLBACK_VIEWBOX);
  // measured center-x of each character in the english name. null until measured.
  const [centers, setCenters] = useState(null);
  const measureRef = useRef(null);

  // measure viewBox + per-character centers once + after fonts load
  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled || !measureRef.current) return;
      const el = measureRef.current;
      const b = el.getBBox();
      if (!b.width) return;
      const padX = 6;
      const padY = 24;
      setViewBox(
        `${b.x - padX} ${b.y - padY} ${b.width + padX * 2} ${b.height + padY * 2}`
      );

      // per-char centers via getExtentOfChar — gives a tight bbox per glyph
      try {
        const c = [];
        for (let i = 0; i < N; i++) {
          const ex = el.getExtentOfChar(i);
          c.push(ex.x + ex.width / 2);
        }
        setCenters(c);
      } catch (e) {
        // some renderers don't implement getExtentOfChar — fall back to even
        // spacing across the bbox so layout still works
        const step = b.width / N;
        setCenters(Array.from({ length: N }, (_, i) => b.x + step * (i + 0.5)));
      }
    };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measure);
    };
  }, []);

  // wave loop — runs once, schedules its own raf, cancellable
  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let timer = 0;
    let lastTick = 0;
    // independent scramble snapshot so band glyphs reshuffle on their own
    // (slow) clock rather than re-rolling every frame
    let scrambleSnap = CHARS.map((ch) => (ch === ' ' ? ' ' : randSym()));

    const run = async () => {
      // hold a beat on the static name before the first wave kicks off
      await new Promise((res) => { timer = setTimeout(res, 800); });
      if (cancelled) return;

      while (!cancelled) {
        await new Promise((resolve) => {
          const start = performance.now();
          const loop = (now) => {
            if (cancelled) return;
            const t = (now - start) / WAVE_DURATION;

            if (t >= 1) {
              // all back to english
              setCells(CHARS.map((g) => ({ glyph: g, kind: 'en' })));
              resolve();
              return;
            }

            if (now - lastTick > SCRAMBLE_TICK) {
              lastTick = now;
              scrambleSnap = CHARS.map((ch) =>
                ch === ' ' ? ' ' : randSym()
              );
            }

            // head sweeps from -BAND to N + BAND so every letter gets covered
            const head = -BAND + t * (N + BAND * 2);

            const next = CHARS.map((ch, i) => {
              const d = i - head;
              if (Math.abs(d) <= BAND) {
                if (ch === ' ') return { glyph: ' ', kind: 'wave' };
                return { glyph: scrambleSnap[i], kind: 'wave' };
              }
              return { glyph: ch, kind: 'en' };
            });
            setCells(next);
            raf = requestAnimationFrame(loop);
          };
          raf = requestAnimationFrame(loop);
        });
        if (cancelled) return;

        await new Promise((res) => { timer = setTimeout(res, PAUSE_BETWEEN); });
      }
    };
    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  // for the fallback render (centers not measured yet), center the whole name
  const [vx, , vw] = viewBox.split(' ').map(Number);
  const centerX = vx + vw / 2;

  return (
    <div className="name-anim" aria-label={ANIM_NAME}>
      <svg className="name-svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        {/* hidden measuring text — gives us viewBox + per-char centers */}
        <text
          ref={measureRef}
          x="0"
          y={BASE_Y}
          textAnchor="start"
          fill="transparent"
          aria-hidden="true"
          style={{ visibility: 'hidden' }}
        >
          {ANIM_NAME}
        </text>

        {centers ? (
          // each char rendered at its measured center → symbols can't shove
          // neighbors around because their slot is fixed
          cells.map((c, i) => (
            <text
              key={i}
              x={centers[i]}
              y={BASE_Y}
              textAnchor="middle"
              fill={c.kind === 'wave' ? 'var(--accent, currentColor)' : 'currentColor'}
            >
              {c.glyph === ' ' ? '\u00a0' : c.glyph}
            </text>
          ))
        ) : (
          // pre-measurement fallback — just show the centered name as one
          <text x={centerX} y={BASE_Y} textAnchor="middle" fill="currentColor">
            {ANIM_NAME}
          </text>
        )}
      </svg>
    </div>
  );
}

window.NameAnimated = NameAnimated;
