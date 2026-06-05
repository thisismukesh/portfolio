import type { TabId } from "./types";

// muted, desaturated accents — one per tab. the accent system IS the tab colors.
export const ACCENTS: Record<TabId, string> = {
  current: "oklch(0.78 0.10 65)", // peach
  experience: "oklch(0.74 0.08 155)", // sage
  projects: "oklch(0.74 0.09 240)", // dusty blue
  events: "oklch(0.76 0.10 25)", // rose
};

export const TABS: { id: TabId; label: string }[] = [
  { id: "current", label: "current" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "events", label: "events" },
];
