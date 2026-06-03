import { getPortfolioContent } from "@/sanity/queries";
import { NameAnimated } from "@/components/name-animated";
import { Cabinet } from "@/components/cabinet";
import { FooterYear } from "@/components/footer-year";
import {
  CurrentPanel,
  ExperiencePanel,
  ProjectsPanel,
  TechPanel,
  EventsPanel,
} from "@/components/panels";
import type { TabId } from "@/lib/types";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mukeshsaravanan.dev";

export default async function Home() {
  const { settings, current, experience, projects, tech, events } =
    await getPortfolioContent();

  // All panels are rendered on the server and handed to the Tabs island, so the
  // full content ships in the initial HTML — crawlers see everything.
  const panels: Record<TabId, React.ReactNode> = {
    current: <CurrentPanel data={current} />,
    experience: <ExperiencePanel data={experience} />,
    projects: <ProjectsPanel data={projects} />,
    tech: <TechPanel data={tech} />,
    events: <EventsPanel data={events} />,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    description: settings.tagline,
    url: SITE_URL,
    sameAs: settings.links.map((l) => l.href),
    knowsAbout: tech.flatMap((g) => g.items),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex min-h-screen flex-col px-[clamp(20px,4vw,56px)] pb-[clamp(20px,3vw,40px)] pt-[clamp(12px,2vw,24px)]">
        <Cabinet
          name={<NameAnimated name={settings.name} />}
          tagline={settings.tagline}
          links={settings.links}
          panels={panels}
        />

        <footer className="mx-auto mt-20 flex w-full items-center justify-center font-mono text-[14px] tracking-[0.04em] text-fg-2">
          <span>
            © <FooterYear initialYear={new Date().getFullYear()} /> {settings.name}
          </span>
        </footer>
      </div>
    </>
  );
}
