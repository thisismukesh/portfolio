import type { PortableTextBlock } from "@portabletext/react";
import type { PortfolioContent } from "./types";

// Helper to build a Portable Text paragraph with inline links, matching the
// prototype's "current" copy. Marks reference link annotations by key.
function para(
  children: { text: string; link?: string }[],
): PortableTextBlock {
  const markDefs: { _key: string; _type: "link"; href: string }[] = [];
  const spans = children.map((c, i) => {
    const marks: string[] = [];
    if (c.link) {
      const key = `l${i}`;
      markDefs.push({ _key: key, _type: "link", href: c.link });
      marks.push(key);
    }
    return { _type: "span" as const, _key: `s${i}`, text: c.text, marks };
  });
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "normal",
    markDefs,
    children: spans,
  };
}

export const FALLBACK_CONTENT: PortfolioContent = {
  settings: {
    name: "mukesh saravanan",
    tagline: "software, slowly. brooklyn.",
    links: [
      { label: "linkedin", href: "https://linkedin.com" },
      { label: "github", href: "https://github.com" },
      { label: "twitter", href: "https://x.com" },
    ],
  },
  current: {
    showAvailability: true,
    availability: "available for the occasional advisory / review.",
    body: [
      para([
        { text: "hey, i'm mukesh. i live in brooklyn and write software for a living. these days i'm a senior engineer at " },
        { text: "stripe", link: "https://stripe.com" },
        { text: ", working on the payments dashboard. it's quiet, careful work and i like it that way." },
      ]),
      para([
        { text: "on the side i'm slowly building " },
        { text: "inkwell", link: "#" },
        { text: ", a local-first writing app for people who keep too many notebooks. i'm also taking a pottery class on saturday mornings, which has somehow improved my code reviews." },
      ]),
      para([
        { text: "i write a small monthly essay called " },
        { text: "field notes", link: "#" },
        { text: " about engineering culture — mostly drafted on the q train. if you want to chat about any of this, or about ceramics, or you have book recs, " },
        { text: "send me an email", link: "mailto:mukesh.gtr34@gmail.com" },
        { text: ". i try to reply to everyone." },
      ]),
    ],
  },
  experience: [
    { role: "senior product engineer", org: "stripe", dates: "2023 — present", blurb: "shipping internal tools for the payments dashboard team. mostly typescript, a little go.", link: { label: "stripe.com", href: "https://stripe.com" } },
    { role: "product engineer", org: "linear", dates: "2021 — 2023", blurb: "worked on the issue editor and keyboard-driven flows. learned to care about latency.", link: { label: "linear.app", href: "https://linear.app" } },
    { role: "founding engineer", org: "kiln (acquired)", dates: "2019 — 2021", blurb: "built the first version of a ceramics marketplace with two friends. wore every hat.", link: null },
    { role: "swe intern", org: "google", dates: "summer 2018", blurb: "a small infra project on the search team. shipped one button.", link: null },
  ],
  projects: [
    { name: "inkwell", blurb: "a quiet writing app for long-form drafts. local-first, no cloud, no ai.", tags: ["swift", "swiftui", "sqlite"], link: { label: "github →", href: "#" } },
    { name: "tinyplot", blurb: "a 2kb javascript library for hand-drawn looking charts. mostly an excuse to learn rough.js.", tags: ["typescript", "canvas"], link: { label: "github →", href: "#" } },
    { name: "morning pages", blurb: "an rss reader that only updates once a day, at 7am. trying to slow myself down.", tags: ["rust", "htmx", "sqlite"], link: { label: "morningpages.app →", href: "#" } },
    { name: "field notes", blurb: "monthly essays on engineering culture, mostly written on the train. ~1.2k subscribers.", tags: ["writing"], link: { label: "read →", href: "#" } },
  ],
  tech: [
    { label: "languages", items: ["typescript", "rust", "python", "go", "swift"] },
    { label: "frontend", items: ["react", "svelte", "tailwind", "framer motion"] },
    { label: "backend", items: ["node", "postgres", "redis", "sqlite"] },
    { label: "ops & infra", items: ["docker", "fly.io", "vercel", "cloudflare"] },
    { label: "design", items: ["figma", "framer", "rive"] },
    { label: "reaching for next", items: ["zig", "sveltekit", "duckdb"] },
  ],
  events: [
    { name: "react summit — amsterdam", date: "jun 2025", blurb: "talk: “the case for boring frontends.” recording up soon.", link: { label: "details →", href: "#" } },
    { name: "local first conf", date: "may 2025", blurb: "attendee. lots of good corridor conversations about crdts.", link: null },
    { name: "sf typescript meetup", date: "feb 2025", blurb: "lightning talk on writing types that explain themselves.", link: { label: "slides →", href: "#" } },
    { name: "rustconf — montréal", date: "sep 2024", blurb: "first time in montréal. came back with too many stickers.", link: null },
  ],
};
