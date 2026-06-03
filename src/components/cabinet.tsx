"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
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
      <section className="flex w-full flex-col items-center gap-[18px]">
        {name}
        {/* Identity row: photo + tagline + nav.
            - Desktop (md+): photo on the left (1 tab wide = 20% of the block),
              tagline + nav stacked vertically beside it, left-aligned.
            - Mobile: photo on top centered (40% so it has weight), tagline +
              nav below centered like before. Side-by-side is too cramped at
              ~390px once the tagline + nav take their natural width. */}
        <div className="flex w-full flex-col items-center gap-[18px] md:flex-row md:gap-5">
          <Image
            src="/me.jpg"
            alt="Mukesh"
            width={300}
            height={300}
            priority
            className="aspect-square w-[40%] shrink-0 object-cover md:w-[20%]"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 text-center md:text-left">
            <p className="text-[20px] font-semibold tracking-[0.005em] text-[var(--accent)] transition-colors duration-200">
              {tagline}
            </p>
            <nav
              // -ml-1.5 (6px) on desktop offsets the first nav-link's left padding
              // so its text aligns flush with the tagline above. Mobile stays centered.
              className="flex flex-wrap items-center justify-center text-[18px] text-fg-2 md:-ml-1.5 md:justify-start"
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
          </div>
        </div>
      </section>

      {/* Desktop: browser-tab cabinet. Hidden below md. */}
      <section className="hidden w-full flex-col md:flex" aria-label="sections">
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

        <div className="relative z-[1] flex w-full flex-col rounded-b-[12px] border border-hair bg-bg-panel px-[clamp(22px,4vw,56px)] py-10 shadow-[0_1px_0_oklch(1_0_0/.03)_inset,0_30px_80px_-40px_rgba(0,0,0,.6)]">
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

      {/* Mobile: vertical accordion. Only this is shown below md. */}
      <section className="flex w-full flex-col gap-2 md:hidden" aria-label="sections">
        {TABS.map((tab) => {
          const isOpen = tab.id === active;
          return (
            <div
              key={tab.id}
              className="overflow-hidden rounded-[10px] border border-hair bg-bg-panel"
              style={{ ["--c" as string]: ACCENTS[tab.id] }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`acc-${tab.id}`}
                onClick={() => setActive(tab.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[16px] font-bold transition-colors"
                style={{
                  color: isOpen ? "var(--c)" : "var(--color-fg-2)",
                  borderLeft: "3px solid var(--c)",
                }}
              >
                <span className="flex-1">{tab.label}</span>
                <span
                  aria-hidden
                  className="text-[18px] leading-none transition-transform duration-200"
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    color: isOpen ? "var(--c)" : "var(--color-fg-3)",
                  }}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`acc-${tab.id}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.3, 0.7, 0.4, 1] }}
                    className="overflow-hidden"
                    style={{ ["--accent" as string]: ACCENTS[tab.id] }}
                  >
                    <div className="flex w-full flex-col items-center px-5 pb-6 pt-2">
                      {panels[tab.id]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>
    </main>
  );
}
