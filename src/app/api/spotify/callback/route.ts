// ONE-SHOT Spotify OAuth helper to capture a refresh token for the
// "song of the day" tile. Delete this file after the refresh token has
// been captured and added to SPOTIFY_REFRESH_TOKEN in Vercel.
//
// Flow:
//   1. Visit /api/spotify/callback?init=<SPOTIFY_BOOTSTRAP_SECRET>
//      → redirects you to Spotify's authorize page
//   2. Approve the scope on Spotify
//   3. Spotify bounces back to /api/spotify/callback?code=...
//      → this route exchanges the code for a refresh token and renders it
//   4. Copy the refresh token, add it to Vercel as SPOTIFY_REFRESH_TOKEN
//   5. Delete this route
//
// The `init` step requires a secret so randoms can't kick off the flow.
// The callback step verifies an HMAC-signed `state` we issued, so we never
// process a `code` we didn't ask for.

import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const REDIRECT_URI = "https://mukesh.cc/api/spotify/callback";
const SCOPE = "user-library-read";

// Anyone hitting this route over the public internet would otherwise be able
// to kick off (and complete) an OAuth flow against our Spotify app. The
// bootstrap secret gates the start; the signed state gates the callback.
function getBootstrapSecret(): string | null {
  return process.env.SPOTIFY_BOOTSTRAP_SECRET ?? null;
}

function signState(secret: string): string {
  // State payload is just a fixed string we sign — we only need integrity, not
  // any data. Spotify echoes `state` back on the callback so we verify the
  // round-trip came from a flow we started.
  const payload = "spotify-bootstrap";
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyState(state: string, secret: string): boolean {
  const [payload, sig] = state.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const bootstrapSecret = getBootstrapSecret();

  if (!clientId || !clientSecret) {
    return new NextResponse("Spotify client env vars missing.", { status: 500 });
  }
  if (!bootstrapSecret) {
    return new NextResponse(
      "SPOTIFY_BOOTSTRAP_SECRET is not set. Add it to Vercel before running this flow.",
      { status: 500 },
    );
  }

  const init = url.searchParams.get("init");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Step 1: kick off the OAuth flow.
  if (init) {
    if (init !== bootstrapSecret) {
      return new NextResponse("Bad bootstrap secret.", { status: 403 });
    }
    const authorize = new URL("https://accounts.spotify.com/authorize");
    authorize.searchParams.set("client_id", clientId);
    authorize.searchParams.set("response_type", "code");
    authorize.searchParams.set("redirect_uri", REDIRECT_URI);
    authorize.searchParams.set("scope", SCOPE);
    authorize.searchParams.set("state", signState(bootstrapSecret));
    return NextResponse.redirect(authorize.toString());
  }

  // Step 3: Spotify bounced back with a code.
  if (code) {
    if (!state || !verifyState(state, bootstrapSecret)) {
      return new NextResponse("Bad or missing state.", { status: 403 });
    }
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      cache: "no-store",
    });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      return new NextResponse(`Token exchange failed: ${text}`, { status: 502 });
    }
    const json = (await tokenRes.json()) as {
      refresh_token?: string;
      access_token?: string;
      scope?: string;
      expires_in?: number;
    };
    if (!json.refresh_token) {
      return new NextResponse("No refresh_token in response.", { status: 502 });
    }
    // Plain text so it's trivial to copy. The token is shown to whoever
    // completed the OAuth dance — same person who already had the bootstrap
    // secret, so this is an acceptable echo. Delete this route afterward.
    return new NextResponse(
      [
        "SUCCESS",
        "",
        "Copy the refresh token below into Vercel as SPOTIFY_REFRESH_TOKEN,",
        "then delete this route file (src/app/api/spotify/callback/route.ts)",
        "and unset SPOTIFY_BOOTSTRAP_SECRET in Vercel.",
        "",
        "scope: " + (json.scope ?? ""),
        "",
        "SPOTIFY_REFRESH_TOKEN=" + json.refresh_token,
      ].join("\n"),
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  if (error) {
    return new NextResponse(`Spotify returned error: ${error}`, { status: 400 });
  }

  // No params: explain how to use this route.
  return new NextResponse(
    "Pass ?init=<SPOTIFY_BOOTSTRAP_SECRET> to start the OAuth flow.",
    { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
