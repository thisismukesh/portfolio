# portfolio

Personal portfolio — Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Sanity CMS. Deployed on Vercel.

Single page, dark theme. Identity block (animated name + links) on top, a browser-tab cabinet below where each tab reveals a section: current, experience, projects, tech stack, events. All content is server-rendered for SEO; tab switching and the name reveal are client islands.

> Inspired by Dominik Koch, Anish Kamatam and Farza Majeed.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in Sanity values when ready
npm run dev                         # http://localhost:3000
```

The site renders immediately using typed fallback content in `src/lib/fallback.ts` — **no Sanity credentials required to run locally**. Wire Sanity (below) to manage content from a dashboard.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | `tsc --noEmit` |

## Project structure

```
design-reference/        original HTML/CSS/JS prototype (not built — kept for reference)
src/
  app/
    layout.tsx           fonts (next/font), <html>, global metadata
    page.tsx             server component — fetches content, renders all panels + JSON-LD
    globals.css          Tailwind layers + tab/link/badge effects + keyframes
    studio/[[...tool]]/  embedded Sanity Studio at /studio
    api/revalidate/      Sanity webhook → on-demand ISR
  components/
    name-animated.tsx    client island — SVG name that fills the block, scramble-in reveal
    tabs.tsx             client island — tab state + Framer Motion panel transitions
    panels.tsx           server components — the five section panels
  lib/
    types.ts             content types
    fallback.ts          placeholder content (renders before Sanity is wired)
    palette.ts           per-tab accent colors + tab list
  sanity/
    schema.ts            document schemas (siteSettings, current, experience, project, techGroup, event)
    client.ts            Sanity client
    queries.ts           GROQ query + fallback merge
    env.ts               env reading + `sanityConfigured` flag
sanity.config.ts         Studio config
```

## Connecting Sanity

1. Create a free project at <https://sanity.io/manage>. Note the **Project ID** and use dataset `production`.
2. Add to `.env.local` (and to Vercel → Project → Settings → Environment Variables):

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
   SANITY_REVALIDATE_SECRET=any_long_random_string
   ```

3. Add `http://localhost:3000` and your production URL to the project's CORS origins (sanity.io/manage → API → CORS origins).
4. Run `npm run dev` and open `/studio`. Log in, then create one document of each type (Site settings, Current, plus Experience / Project / Tech group / Event entries). Until you do, each section falls back to placeholder content automatically.

### On-demand revalidation (publish → live)

Pages use ISR (`revalidate = 60`) and also rebuild instantly on publish:

1. sanity.io/manage → API → **Webhooks** → Create webhook.
2. URL: `https://your-domain.com/api/revalidate`
3. Trigger on: create / update / delete. Dataset: `production`.
4. Secret: the same value as `SANITY_REVALIDATE_SECRET`.

The webhook hits `src/app/api/revalidate/route.ts`, which verifies the signature and revalidates the `portfolio` cache tag.

## Deploying on Vercel

1. Push to GitHub, import the repo at <https://vercel.com/new>.
2. Add the four env vars above (set `NEXT_PUBLIC_SITE_URL` to your final domain for correct OpenGraph/canonical URLs).
3. Deploy. Then configure the Sanity webhook against the live URL.

## Editing content without Sanity

Edit `src/lib/fallback.ts`. It's fully typed and mirrors the Sanity schema, so anything you put there is exactly what Sanity will later replace.
