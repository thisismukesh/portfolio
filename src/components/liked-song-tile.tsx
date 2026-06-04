import Image from "next/image";
import { getDailyLikedSong } from "@/lib/spotify";
import { externalLinkProps } from "@/lib/external";

// Third tile: a deterministic-per-day pick from my Spotify Liked Songs. Same
// for every visitor on a given UTC day; rotates at UTC midnight as the daily
// hash changes. If Spotify env vars aren't set or the API errors, falls back
// to a static empty-state.

export async function LikedSongTile() {
  const song = await getDailyLikedSong();

  if (!song) {
    return (
      <figure className="flex flex-col gap-2.5">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[10px] border border-hair bg-bg-panel">
          <span className="font-mono text-[12px] tracking-[0.04em] text-fg-3">
            song of the day
          </span>
        </div>
        <figcaption className="text-center font-mono text-[12.5px] tracking-[0.02em] text-fg-3">
          ♫
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="flex flex-col gap-2.5">
      <a
        href={song.url}
        {...externalLinkProps(song.url)}
        className="group relative block aspect-square overflow-hidden rounded-[10px] border border-hair bg-bg-panel"
        aria-label={`Listen to ${song.title} by ${song.artist} on Spotify`}
      >
        {song.albumArt && (
          <Image
            src={song.albumArt}
            alt={`${song.album} cover art`}
            fill
            sizes="(min-width: 768px) 33vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        {/* Bottom gradient overlay so the track title stays readable on any
            album art. Kept subtle — the art is the hero. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
          <div className="truncate text-[13.5px] font-semibold text-white">
            {song.title}
          </div>
          <div className="truncate font-mono text-[11.5px] tracking-[0.01em] text-white/70">
            {song.artist}
          </div>
        </div>
      </a>
      <figcaption className="text-center font-mono text-[12.5px] tracking-[0.02em] text-fg-3">
        song of the day
      </figcaption>
    </figure>
  );
}
