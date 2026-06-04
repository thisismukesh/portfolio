"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { LikedSong } from "@/lib/spotify";
import { externalLinkProps } from "@/lib/external";

// MacBook-style notch fixed to the top of the viewport. Collapsed state:
// a black rounded-bottom pill with the song title scrolling marquee-style
// inside it. Hovered state: the pill expands downward into a mini-player
// overlay with album art, title, artist, album, and a Spotify wordmark.
//
// At UTC midnight, the displayed song slides up and out, the next day's
// song is fetched from /api/song-of-day, then slides in from below — a
// "tape changing" moment.
//
// The component is hydration-safe: it renders the server-passed `song`
// on initial paint, then takes over client-side. If no song is available
// (Spotify env not configured), the notch shows a static empty pill.

type Props = { song: LikedSong | null };

// 60 seconds buffer past midnight — Vercel ISR may serve a stale page for
// up to `revalidate` seconds, so we wait a touch past UTC midnight to make
// sure the new daily index has rolled over on the API too.
const MIDNIGHT_BUFFER_MS = 60_000;

function msUntilNextUtcMidnight(now = new Date()): number {
  const next = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0,
    ),
  );
  return next.getTime() - now.getTime();
}

export function Notch({ song: initialSong }: Props) {
  const [song, setSong] = useState<LikedSong | null>(initialSong);
  const [open, setOpen] = useState(false);
  // `rolling` plays the song-changeover transition: current song slides up
  // and out, then the next song slides in from below.
  const [rolling, setRolling] = useState(false);
  // Touch devices have no hover — we use click to toggle there. Sniff once
  // on mount so SSR/hydration is stable.
  const [isTouch, setIsTouch] = useState(false);
  const notchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    setIsTouch(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // On touch devices, clicking anywhere outside the notch should close it.
  useEffect(() => {
    if (!isTouch || !open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (notchRef.current && !notchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [isTouch, open]);

  // Schedule a one-shot fetch at the next UTC midnight (+buffer) to swap
  // in the new daily song. After it fires, schedule another for the
  // following midnight, indefinitely.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const scheduleNext = () => {
      const delay = msUntilNextUtcMidnight() + MIDNIGHT_BUFFER_MS;
      timer = setTimeout(async () => {
        if (cancelled) return;
        try {
          // Play the "rolling over" animation: collapse → fetch → reveal.
          setRolling(true);
          const res = await fetch("/api/song-of-day", { cache: "no-store" });
          if (res.ok) {
            const json = (await res.json()) as { song: LikedSong | null };
            if (!cancelled) setSong(json.song);
          }
          // Tiny pause so the unmount/mount keys both have time to play out
          // visibly even when the network is fast.
          setTimeout(() => {
            if (!cancelled) setRolling(false);
            scheduleNext();
          }, 600);
        } catch {
          if (!cancelled) setRolling(false);
          scheduleNext();
        }
      }, delay);
    };

    scheduleNext();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Single source of truth for open/close: hover on pointer devices,
  // click on touch devices. The body component takes these as callbacks.
  const handleHoverStart = isTouch ? undefined : () => setOpen(true);
  const handleHoverEnd = isTouch ? undefined : () => setOpen(false);
  const handleClick = isTouch ? () => setOpen((v) => !v) : undefined;

  return (
    <div
      ref={notchRef}
      // Fixed, centered, z-above everything. pointer-events-none on the
      // wrapper so the empty edges don't catch clicks; the notch itself
      // re-enables pointer events.
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
      aria-hidden={false}
    >
      <NotchBody
        song={song}
        open={open}
        rolling={rolling}
        isTouch={isTouch}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleClick}
      />
    </div>
  );
}

function NotchBody({
  song,
  open,
  rolling,
  isTouch,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  song: LikedSong | null;
  open: boolean;
  rolling: boolean;
  isTouch: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onClick?: () => void;
}) {
  // Mobile notches are smaller — narrower phone screens and a smaller
  // visual budget. Desktop sizes stay generous.
  const collapsedW = isTouch ? 170 : 220;
  const collapsedH = isTouch ? 24 : 28;
  const openW = isTouch ? 300 : 360;
  const openH = open ? (song ? (isTouch ? 100 : 116) : isTouch ? 32 : 36) : collapsedH;

  return (
    <motion.div
      // pointer-events restored so the notch is interactive. Container is the
      // black pill itself: bottom corners rounded, top corners flush with
      // the viewport edge (notch is "carved" out of the bezel).
      className="pointer-events-auto relative cursor-pointer overflow-hidden bg-black shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={onClick}
      role={isTouch ? "button" : undefined}
      aria-expanded={isTouch ? open : undefined}
      animate={{
        width: open ? openW : collapsedW,
        height: openH,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        {open && song ? (
          <ExpandedPlayer key="expanded" song={song} />
        ) : (
          <CollapsedMarquee key={`collapsed-${song?.title ?? "empty"}`} song={song} rolling={rolling} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CollapsedMarquee({
  song,
  rolling,
}: {
  song: LikedSong | null;
  rolling: boolean;
}) {
  const text = song ? `${song.title} — ${song.artist}` : "♫";
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  // Measure the text and the visible track so we can compute marquee
  // distance/duration based on actual rendered sizes. We use ResizeObserver
  // so the marquee starts as soon as either dimension becomes non-zero —
  // important on mobile where the parent's spring animation can keep the
  // track's measured width at 0 for the first few frames after mount, and
  // a one-shot measure would lock in that 0 forever (gating the marquee).
  useEffect(() => {
    const measure = () => {
      if (measureRef.current) setTextWidth(measureRef.current.offsetWidth);
      if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (measureRef.current) ro.observe(measureRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [text]);

  // Marquee duration: keep speed consistent regardless of text length.
  // We move the text by (textWidth + trackWidth) pixels — text starts off
  // the right edge and ends fully off the left edge — so duration scales
  // linearly with that distance.
  const SPEED_PX_PER_SEC = 50;
  const distance = textWidth + trackWidth;
  const duration = distance > 0 ? distance / SPEED_PX_PER_SEC : 8;

  return (
    <motion.div
      key="marquee"
      // The "rolling" prop plays the changeover: slide the current text up
      // and out. New content mounts on the new song (AnimatePresence key
      // changes via the song.title in the parent).
      initial={{ y: rolling ? 0 : 0, opacity: rolling ? 0 : 1 }}
      animate={{ y: rolling ? -30 : 0, opacity: rolling ? 0 : 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.3, 0.7, 0.4, 1] }}
      className="absolute inset-0 flex items-center"
    >
      <div
        ref={trackRef}
        className="relative h-full w-full overflow-hidden"
      >
        {/* Hidden ruler used to measure the text's natural width */}
        <span
          ref={measureRef}
          className="invisible absolute whitespace-nowrap font-mono text-[11px] tracking-[0.04em]"
          aria-hidden
        >
          {text}
        </span>
        {/* Visible marquee: animated text track */}
        {trackWidth > 0 && (
          <motion.div
            className="absolute top-1/2 flex -translate-y-1/2 items-center whitespace-nowrap font-mono text-[11px] tracking-[0.04em] text-white/85"
            initial={{ x: trackWidth }}
            animate={{ x: -textWidth }}
            transition={{
              duration,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {text}
          </motion.div>
        )}
        {/* Subtle fade gradients at each edge so text glides in and out */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black to-transparent" />
      </div>
    </motion.div>
  );
}

function ExpandedPlayer({ song }: { song: LikedSong }) {
  return (
    <motion.a
      key="player"
      href={song.url}
      {...externalLinkProps(song.url)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.3, 0.7, 0.4, 1] }}
      className="absolute inset-0 flex items-center gap-3 px-4 py-3"
      aria-label={`Listen to ${song.title} by ${song.artist} on Spotify`}
    >
      <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[4px] bg-neutral-900">
        {song.albumArt && (
          <Image
            src={song.albumArt}
            alt={`${song.album} cover art`}
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="truncate text-[13.5px] font-semibold leading-tight text-white">
          {song.title}
        </div>
        <div className="mt-0.5 truncate font-mono text-[11px] leading-tight tracking-[0.01em] text-white/75">
          {song.artist}
        </div>
        <div className="mt-0.5 truncate font-mono text-[10px] leading-tight tracking-[0.01em] text-white/55">
          {song.album}
        </div>
        <div className="mt-1.5 inline-flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.04em] text-[#1DB954]">
          <svg viewBox="0 0 168 168" className="h-2.5 w-2.5" aria-hidden>
            <path
              fill="currentColor"
              d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.07-5.91 4.04-8.98 2.15-22.51-13.84-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35-1.04-3.453.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.98zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z"
            />
          </svg>
          Spotify
        </div>
      </div>
    </motion.a>
  );
}
