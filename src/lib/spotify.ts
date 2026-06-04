// Server-side Spotify client.
//
// Uses the Authorization Code refresh token flow: a one-time OAuth dance gives
// us a refresh token (stored in env), which we trade for a short-lived access
// token on every server request. The user never authenticates — this is YOUR
// listening data, surfaced on YOUR site.
//
// Required env (Vercel project settings):
//   SPOTIFY_CLIENT_ID       — from your Spotify dev app
//   SPOTIFY_CLIENT_SECRET   — from your Spotify dev app
//   SPOTIFY_REFRESH_TOKEN   — captured once via the OAuth dance (scope: user-library-read)
//
// If any env var is missing or the API fails, getDailyLikedSong returns null —
// the UI then falls back to a static "not playing" state.

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const LIKED_URL = "https://api.spotify.com/v1/me/tracks";

export type LikedSong = {
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  url: string;
};

type SpotifyTrack = {
  track: {
    name: string;
    external_urls: { spotify: string };
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string; width: number; height: number }[];
    };
  };
};

type SpotifyLikedResponse = {
  items: SpotifyTrack[];
  total: number;
};

async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    // Token requests are individually short-lived; do not cache the response.
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

// Deterministic "song of the day": seed a pseudo-random index from today's
// UTC date string so every visitor on the same day sees the same track, but
// the pick rotates daily without manual intervention.
function pickIndexForToday(total: number): number {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  let h = 5381;
  for (let i = 0; i < today.length; i++) {
    h = ((h << 5) + h + today.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % Math.max(1, total);
}

export async function getDailyLikedSong(): Promise<LikedSong | null> {
  const token = await getAccessToken();
  if (!token) return null;

  // First page only — we need the `total` to pick today's index, then a
  // second request to fetch that one item.
  const headRes = await fetch(`${LIKED_URL}?limit=1&offset=0`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!headRes.ok) return null;
  const head = (await headRes.json()) as SpotifyLikedResponse;
  const total = head.total ?? 0;
  if (!total) return null;

  const idx = pickIndexForToday(total);
  const pickRes = await fetch(`${LIKED_URL}?limit=1&offset=${idx}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!pickRes.ok) return null;
  const pick = (await pickRes.json()) as SpotifyLikedResponse;
  const item = pick.items[0];
  if (!item) return null;

  const t = item.track;
  // Spotify returns images largest-first; pick a mid-size for the square.
  const img = t.album.images[1]?.url ?? t.album.images[0]?.url ?? null;
  return {
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    albumArt: img,
    url: t.external_urls.spotify,
  };
}
