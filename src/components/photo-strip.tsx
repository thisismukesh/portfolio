import Image from "next/image";
import { LikedSongTile } from "./liked-song-tile";

// Tile strip below the identity row, above the cabinet. Width matches the
// cabinet (max-w-block on the parent main). Single row: a square photo on
// the left (1/3 width) and a wide Spotify mini-player on the right (2/3
// width) — the player's natural horizontal proportions get room to breathe.

const PHOTO = { src: "/me.jpg", alt: "Mukesh", caption: "me" };

export async function PhotoStrip() {
  return (
    <section
      className="mx-auto grid w-full max-w-block grid-cols-[1fr_3fr] items-stretch gap-[clamp(8px,1.5vw,20px)]"
      aria-label="photo and now playing"
    >
      {/* Photo (1/4 width): square. With the column narrower, the photo gets
          smaller, but the row height is set by the larger player tile via
          its explicit aspect ratio — so this square no longer drives height.
          aspect-square keeps the photo proportional inside its column;
          object-cover handles the crop. */}
      <figure className="flex flex-col justify-end gap-2.5">
        <div className="relative aspect-square overflow-hidden rounded-[10px] border border-hair bg-bg-panel">
          <Image
            src={PHOTO.src}
            alt={PHOTO.alt}
            fill
            sizes="(min-width: 768px) 25vw, 25vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-center font-mono text-[12.5px] tracking-[0.02em] text-fg-3">
          {PHOTO.caption}
        </figcaption>
      </figure>
      {/* Mini-player (3/4 width): wider AND taller than the photo. We set its
          height via aspect-ratio on the tile container — roughly 3:1 — so the
          row stretches to that height, and the photo (smaller square)
          centers itself vertically inside the row via the figure's flex. */}
      <div className="flex flex-col">
        <LikedSongTile />
      </div>
    </section>
  );
}
