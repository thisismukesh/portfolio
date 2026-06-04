import Image from "next/image";
import { LikedSongTile } from "./liked-song-tile";

// Three equidistant tiles below the identity row, above the cabinet. Width
// matches the cabinet (max-w-block on the parent main), so tiles scale fluidly.
// First two are static photos; the third is a random track from my Spotify
// Liked Songs (fetched server-side, refreshed on each visit per `revalidate`).

type Photo = { src: string; alt: string; caption: string };

const PHOTOS: Photo[] = [
  { src: "/me.jpg", alt: "Mukesh", caption: "me" },
  { src: "/me-2.jpg", alt: "Mukesh", caption: "..." },
];

export async function PhotoStrip() {
  return (
    <section
      className="mx-auto grid w-full max-w-block grid-cols-3 gap-[clamp(8px,1.5vw,20px)]"
      aria-label="photos and now playing"
    >
      {PHOTOS.map((p) => (
        <figure key={p.src} className="flex flex-col gap-2.5">
          <div className="relative aspect-square overflow-hidden rounded-[10px] border border-hair bg-bg-panel">
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 768px) 33vw, 33vw"
              className="object-cover"
            />
          </div>
          <figcaption className="text-center font-mono text-[12.5px] tracking-[0.02em] text-fg-3">
            {p.caption}
          </figcaption>
        </figure>
      ))}
      <LikedSongTile />
    </section>
  );
}
