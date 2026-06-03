"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ACCENTS, TABS } from "@/lib/palette";
import type { TabId } from "@/lib/types";
import { externalLinkProps } from "@/lib/external";

type NavLink = { label: string; href: string };

// Owns the active-tab state and sets --accent on a shared root wrapping the
// whole main column, so BOTH the nav links (identity block) and the tab cabinet
// react to the active tab. `name` and the panels are server-rendered and passed
// in via props — SSR/SEO is preserved.
export function Cabinet({
  name,
  tagline,
  links,
  panels,
}: {
  name: ReactNode;
  tagline: string;
  links: NavLink[];
  panels: Record<TabId, ReactNode>;
}) {
  const [active, setActive] = useState<TabId>("current");
  const accent = ACCENTS[active];

  const onClick = (id: TabId, el: HTMLButtonElement) => {
    el.classList.remove("is-pressing");
    void el.offsetWidth;
    el.classList.add("is-pressing");
    setActive(id);
  };

  return (
    <main
      className="mx-auto flex w-full max-w-block flex-1 flex-col items-center gap-[clamp(40px,5vw,72px)] pt-[clamp(16px,3vw,40px)]"
      style={{ ["--accent" as string]: accent }}
    >
      <section className="flex w-full flex-col items-center gap-[18px] text-center">
        {name}
        <p className="mt-0.5 text-[19px] tracking-[0.005em] text-fg-3">
          {tagline}
        </p>
        <nav
          className="mt-2.5 flex flex-wrap items-center justify-center text-[18px] text-fg-2"
          aria-label="elsewhere"
        >
          {links.map((l, i) => (
            <span key={l.href} className="inline-flex items-center">
              {i > 0 && <span className="sep px-3">·</span>}
              <a href={l.href} className="nav-link" {...externalLinkProps(l.href)}>
                {l.label}
              </a>
            </span>
          ))}
        </nav>
      </section>

      <section className="flex w-full flex-col" aria-label="sections">
        <div className="relative z-[2] -mb-px flex w-full items-end" role="tablist">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`tab ${isActive ? "is-active" : ""}`}
                style={{ ["--c" as string]: ACCENTS[tab.id] }}
                onClick={(e) => onClick(tab.id, e.currentTarget)}
                onAnimationEnd={(e) => {
                  if (e.animationName === "key-press") {
                    e.currentTarget.classList.remove("is-pressing");
                  }
                }}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative z-[1] flex w-full flex-col rounded-b-[12px] border border-hair bg-bg-panel px-[clamp(22px,4vw,56px)] pb-10 pt-9 shadow-[0_1px_0_oklch(1_0_0/.03)_inset,0_30px_80px_-40px_rgba(0,0,0,.6)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="flex w-full flex-col items-center"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: [0.3, 0.7, 0.4, 1] }}
            >
              {panels[active]}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
