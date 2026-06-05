import type { PortableTextBlock } from "@portabletext/react";

export type Link = { label: string; href: string } | null;

export type TabId = "current" | "experience" | "projects" | "events";

export type SiteSettings = {
  name: string;
  tagline: string;
  links: { label: string; href: string }[];
};

export type Current = {
  body: PortableTextBlock[];
  availability: string;
  showAvailability: boolean;
};

export type Experience = {
  role: string;
  org: string;
  dates: string;
  blurb: string;
  link: Link;
};

export type Project = {
  name: string;
  blurb: string;
  tags: string[];
  link: Link;
};

export type EventItem = {
  name: string;
  date: string;
  blurb: string;
  link: Link;
};

export type PortfolioContent = {
  settings: SiteSettings;
  current: Current;
  experience: Experience[];
  projects: Project[];
  events: EventItem[];
};
