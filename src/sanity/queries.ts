import { groq } from "next-sanity";
import { client } from "./client";
import { sanityConfigured } from "./env";
import { FALLBACK_CONTENT } from "@/lib/fallback";
import type { PortfolioContent } from "@/lib/types";

const linkProjection = `link{ label, href }`;

const QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]{ name, tagline, links[]{ label, href } },
  "current": *[_type == "current"][0]{ body, availability, showAvailability },
  "experience": *[_type == "experience"] | order(order asc, _createdAt asc){ role, org, dates, blurb, ${linkProjection} },
  "projects": *[_type == "project"] | order(order asc, _createdAt asc){ name, blurb, tags, ${linkProjection} },
  "tech": *[_type == "techGroup"] | order(order asc, _createdAt asc){ label, items },
  "events": *[_type == "event"] | order(order asc, _createdAt asc){ name, date, blurb, ${linkProjection} }
}`;

// Fetch content from Sanity, falling back to local placeholder content for any
// section that's missing or empty. This keeps the site rendering before Sanity
// is configured and degrades gracefully if a single document hasn't been added.
export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (!sanityConfigured) return FALLBACK_CONTENT;

  try {
    const data = await client.fetch<Partial<PortfolioContent>>(
      QUERY,
      {},
      { next: { revalidate: 60, tags: ["portfolio"] } },
    );

    return {
      settings: data.settings ?? FALLBACK_CONTENT.settings,
      current: data.current ?? FALLBACK_CONTENT.current,
      experience: data.experience?.length ? data.experience : FALLBACK_CONTENT.experience,
      projects: data.projects?.length ? data.projects : FALLBACK_CONTENT.projects,
      tech: data.tech?.length ? data.tech : FALLBACK_CONTENT.tech,
      events: data.events?.length ? data.events : FALLBACK_CONTENT.events,
    };
  } catch {
    return FALLBACK_CONTENT;
  }
}
