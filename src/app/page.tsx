import { getPortfolioContent } from "@/sanity/queries";
import { NameAnimated } from "@/components/name-animated";
import { Cabinet } from "@/components/cabinet";
import { FooterYear } from "@/components/footer-year";
import { Notch } from "@/components/notch";
import { getDailyLikedSong } from "@/lib/spotify";
import {
  CurrentPanel,
  ExperiencePanel,
  ProjectsPanel,
  EventsPanel,
} from "@/components/panels";
import type { TabId } from "@/lib/types";

// Hourly background revalidation. CMS edits hit immediately via the signed
// webhook (`revalidateTag("portfolio")`); Spotify "song of the day" is
// deterministic per UTC day, so we only need to re-fetch it a few times
// a day at most.
export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mukeshsaravanan.dev";

export default async function Home() {
  const [{ settings, current, experience, projects, events }, song] =
    await Promise.all([getPortfolioContent(), getDailyLikedSong()]);

  // All panels are rendered on the server and handed to the Tabs island, so the
  // full content ships in the initial HTML — crawlers see everything.
  const panels: Record<TabId, React.ReactNode> = {
    current: <CurrentPanel data={current} />,
    experience: <ExperiencePanel data={experience} />,
    projects: <ProjectsPanel data={projects} />,
    events: <EventsPanel data={events} />,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    description: settings.tagline,
    url: SITE_URL,
    sameAs: settings.links.map((l) => l.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Notch song={song} />

      <div className="flex min-h-screen flex-col px-[clamp(20px,4vw,56px)] pb-[clamp(20px,3vw,40px)] pt-[clamp(48px,5vw,72px)]">
        <Cabinet
          name={<NameAnimated name={settings.name} />}
          tagline={settings.tagline}
          links={settings.links}
          panels={panels}
        />

        <footer className="mx-auto mt-20 flex w-full items-center justify-center font-mono text-[14px] tracking-[0.04em] text-fg-2">
          <span>
            © <FooterYear initialYear={new Date().getFullYear()} /> | built by yours truly, {settings.name}
          </span>
        </footer>
      </div>
    </>
  );
}
