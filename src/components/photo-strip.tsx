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
      className="mx-auto grid w-full max-w-block grid-cols-3 items-stretch gap-[clamp(8px,1.5vw,20px)]"
      aria-label="photo and now playing"
    >
      {/* Photo (1/3): the square sets the row height. */}
      <figure className="flex flex-col gap-2.5">
        <div className="relative aspect-square overflow-hidden rounded-[10px] border border-hair bg-bg-panel">
          <Image
            src={PHOTO.src}
            alt={PHOTO.alt}
            fill
            sizes="(min-width: 768px) 33vw, 33vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-center font-mono text-[12.5px] tracking-[0.02em] text-fg-3">
          {PHOTO.caption}
        </figcaption>
      </figure>
      {/* Mini-player spans the remaining two columns. h-full + flex makes its
          tile fill the same height as the photo's square, so both captions
          land on the same baseline. */}
      <div className="col-span-2 flex h-full flex-col">
        <LikedSongTile />
      </div>
    </section>
  );
}
