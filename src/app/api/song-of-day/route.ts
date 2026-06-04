// Returns today's "song of the day" pick from Spotify Liked Songs. The notch
// component fetches this once at UTC midnight to animate the day-rollover
// without needing a page refresh.
//
// Same caching profile as the main page (1h revalidate) — the underlying
// pickIndexForToday is deterministic per UTC day, so within a day the
// response is stable, and at the day boundary we want the new value to be
// available promptly.

import { NextResponse } from "next/server";
import { getDailyLikedSong } from "@/lib/spotify";

export const revalidate = 3600;

export async function GET() {
  const song = await getDailyLikedSong();
  return NextResponse.json({ song });
}
