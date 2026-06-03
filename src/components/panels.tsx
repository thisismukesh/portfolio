import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type {
  Current,
  Experience,
  Project,
  TechGroup,
  EventItem,
} from "@/lib/types";
import { externalLinkProps } from "@/lib/external";

const ptComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      return (
        <a className="ilink" href={href} {...externalLinkProps(href)}>
          {children}
        </a>
      );
    },
  },
  block: {
    normal: ({ children }) => <p className="text-fg-2">{children}</p>,
  },
};

export function CurrentPanel({ data }: { data: Current }) {
  return (
    <div className="flex w-full max-w-[56ch] flex-col gap-[22px] text-[18px] leading-[1.7] tracking-[0.002em] text-fg-2">
      <PortableText value={data.body} components={ptComponents} />
      {data.showAvailability && (
        <p className="kicker mx-auto mt-6 w-fit self-center">
          <span className="dot" /> {data.availability}
        </p>
      )}
    </div>
  );
}

function CardList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex w-full max-w-[56ch] flex-col gap-1">{children}</ul>
  );
}

function cardClass(i: number, total: number) {
  return [
    "flex flex-col gap-2 border-t border-hair-2 py-[22px] pb-6",
    i === 0 ? "border-t-0 pt-1" : "",
    i === total - 1 ? "pb-1" : "",
  ].join(" ");
}

export function ExperiencePanel({ data }: { data: Experience[] }) {
  return (
    <CardList>
      {data.map((e, i) => (
        <li key={i} className={cardClass(i, data.length)}>
          <div className="flex flex-wrap items-baseline gap-[10px] text-[17.5px]">
            <span className="font-semibold tracking-[-0.003em] text-fg">{e.role}</span>
            <span className="sep self-center">·</span>
            <span className="font-medium text-[var(--accent)]">{e.org}</span>
            <span className="ml-auto font-mono text-[14px] tracking-[0.01em] text-fg-3">{e.dates}</span>
          </div>
          <p className="max-w-[56ch] text-[16.5px] leading-[1.6] text-fg-2">{e.blurb}</p>
          {e.link && (
            <a className="card-link self-start border-b border-[color-mix(in_oklab,var(--accent)_50%,transparent)] pb-px text-[14.5px] text-fg-2 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]" href={e.link.href} {...externalLinkProps(e.link.href)}>
              {e.link.label} →
            </a>
          )}
        </li>
      ))}
    </CardList>
  );
}

export function ProjectsPanel({ data }: { data: Project[] }) {
  return (
    <CardList>
      {data.map((p, i) => (
        <li key={i} className={cardClass(i, data.length)}>
          <div className="flex flex-wrap items-baseline gap-[10px] text-[17.5px]">
            <span className="font-semibold tracking-[-0.003em] text-[var(--accent)]">{p.name}</span>
          </div>
          <p className="max-w-[56ch] text-[16.5px] leading-[1.6] text-fg-2">{p.blurb}</p>
          <div className="mt-1 flex flex-wrap gap-[6px]">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-hair px-[10px] py-1 font-mono text-[12.5px] tracking-[0.01em] text-fg-3">
                {t}
              </span>
            ))}
          </div>
        </li>
      ))}
    </CardList>
  );
}

export function TechPanel({ data }: { data: TechGroup[] }) {
  return (
    <div className="flex w-full max-w-[56ch] flex-col gap-[26px]">
      {data.map((g, gi) => (
        <div
          key={g.label}
          className={`flex flex-col gap-2 pb-[22px] md:grid md:grid-cols-[160px_1fr] md:items-baseline md:gap-6 ${gi === data.length - 1 ? "" : "border-b border-hair-2"}`}
        >
          <div className="text-[17px] font-bold tracking-[-0.005em] text-[var(--accent)]">{g.label}</div>
          <div className="flex flex-wrap items-baseline text-[17px] leading-[1.8] tracking-[0.002em] text-fg-2">
            {g.items.map((item, idx) => (
              <span key={item} className="flex items-baseline">
                <span className="text-fg">{item}</span>
                {idx < g.items.length - 1 && (
                  <span className="sep px-[10px] align-[-0.18em] text-[28px] leading-[0]">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function EventsPanel({ data }: { data: EventItem[] }) {
  return (
    <CardList>
      {data.map((e, i) => (
        <li key={i} className={cardClass(i, data.length)}>
          <div className="flex flex-wrap items-baseline gap-[10px] text-[17.5px]">
            <span className="font-semibold tracking-[-0.003em] text-[var(--accent)]">{e.name}</span>
            <span className="ml-auto font-mono text-[14px] tracking-[0.01em] text-fg-3">{e.date}</span>
          </div>
          <p className="max-w-[56ch] text-[16.5px] leading-[1.6] text-fg-2">{e.blurb}</p>
        </li>
      ))}
    </CardList>
  );
}
