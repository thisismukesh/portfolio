// app.jsx — portfolio. dark, lowercase, folder-tab cabinet.

const TABS = [
{ id: 'current', label: 'current' },
{ id: 'experience', label: 'experience' },
{ id: 'projects', label: 'projects' },
{ id: 'tech', label: 'tech stack' },
{ id: 'events', label: 'events' }];


// ─── content (placeholder; CMS-backed later) ─────────────────────────────
const CONTENT = {
  experience: [
  {
    role: 'senior product engineer',
    org: 'stripe',
    dates: '2023 — present',
    blurb: 'shipping internal tools for the payments dashboard team. mostly typescript, a little go.',
    link: { label: 'stripe.com', href: 'https://stripe.com' }
  },
  {
    role: 'product engineer',
    org: 'linear',
    dates: '2021 — 2023',
    blurb: 'worked on the issue editor and keyboard-driven flows. learned to care about latency.',
    link: { label: 'linear.app', href: 'https://linear.app' }
  },
  {
    role: 'founding engineer',
    org: 'kiln (acquired)',
    dates: '2019 — 2021',
    blurb: 'built the first version of a ceramics marketplace with two friends. wore every hat.',
    link: null
  },
  {
    role: 'swe intern',
    org: 'google',
    dates: 'summer 2018',
    blurb: 'a small infra project on the search team. shipped one button.',
    link: null
  }],

  projects: [
  {
    name: 'inkwell',
    blurb: 'a quiet writing app for long-form drafts. local-first, no cloud, no ai.',
    tags: ['swift', 'swiftui', 'sqlite'],
    link: { label: 'github →', href: '#' }
  },
  {
    name: 'tinyplot',
    blurb: 'a 2kb javascript library for hand-drawn looking charts. mostly an excuse to learn rough.js.',
    tags: ['typescript', 'canvas'],
    link: { label: 'github →', href: '#' }
  },
  {
    name: 'morning pages',
    blurb: 'an rss reader that only updates once a day, at 7am. trying to slow myself down.',
    tags: ['rust', 'htmx', 'sqlite'],
    link: { label: 'morningpages.app →', href: '#' }
  },
  {
    name: 'field notes',
    blurb: 'monthly essays on engineering culture, mostly written on the train. ~1.2k subscribers.',
    tags: ['writing'],
    link: { label: 'read →', href: '#' }
  }],

  tech: [
  { label: 'languages', items: ['typescript', 'rust', 'python', 'go', 'swift'] },
  { label: 'frontend', items: ['react', 'svelte', 'tailwind', 'framer motion'] },
  { label: 'backend', items: ['node', 'postgres', 'redis', 'sqlite'] },
  { label: 'ops & infra', items: ['docker', 'fly.io', 'vercel', 'cloudflare'] },
  { label: 'design', items: ['figma', 'framer', 'rive'] },
  { label: 'reaching for next', items: ['zig', 'sveltekit', 'duckdb'] }],

  events: [
  {
    name: 'react summit — amsterdam',
    date: 'jun 2025',
    blurb: 'talk: “the case for boring frontends.” recording up soon.',
    link: { label: 'details →', href: '#' }
  },
  {
    name: 'local first conf',
    date: 'may 2025',
    blurb: 'attendee. lots of good corridor conversations about crdts.',
    link: null
  },
  {
    name: 'sf typescript meetup',
    date: 'feb 2025',
    blurb: 'lightning talk on writing types that explain themselves.',
    link: { label: 'slides →', href: '#' }
  },
  {
    name: 'rustconf — montréal',
    date: 'sep 2024',
    blurb: 'first time in montréal. came back with too many stickers.',
    link: null
  }]

};

// ─── tab content panels ──────────────────────────────────────────────────

function CurrentPanel({ accent }) {
  return (
    <div className="prose">
      <p>
        hey, i'm mukesh. i live in brooklyn and write software for a living. these days i'm a senior engineer at 
        <a className="ilink" href="https://stripe.com">stripe</a>,
        working on the payments dashboard. it's quiet, careful work and i like it that way.
      </p>
      <p>
        on the side i'm slowly building <a className="ilink" href="#">inkwell</a>, a
        local-first writing app for people who keep too many notebooks. i'm also taking
        a pottery class on saturday mornings, which has somehow improved my code reviews.
      </p>
      <p>
        i write a small monthly essay called <a className="ilink" href="#">field notes</a>{' '}
        about engineering culture — mostly drafted on the q train. if you want to chat
        about any of this, or about ceramics, or you have book recs,{' '}
        <a className="ilink" href="mailto:mukesh.gtr34@gmail.com">send me an email</a>. i
        try to reply to everyone.
      </p>
      <p className="kicker" style={{ '--accent': accent }}>
        <span className="dot" /> available for the occasional advisory / review.
      </p>
    </div>);

}

function ExperiencePanel() {
  return (
    <ul className="cards">
      {CONTENT.experience.map((e, i) =>
      <li key={i} className="card">
          <div className="card-head">
            <span className="card-title">{e.role}</span>
            <span className="card-sep">·</span>
            <span className="card-org">{e.org}</span>
            <span className="card-meta">{e.dates}</span>
          </div>
          <p className="card-body">{e.blurb}</p>
          {e.link && <a className="card-link" href={e.link.href}>{e.link.label} →</a>}
        </li>
      )}
    </ul>);

}

function ProjectsPanel() {
  return (
    <ul className="cards">
      {CONTENT.projects.map((p, i) =>
      <li key={i} className="card">
          <div className="card-head">
            <span className="card-title">{p.name}</span>
          </div>
          <p className="card-body">{p.blurb}</p>
          <div className="card-foot">
            <div className="tags">
              {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
            {p.link && <a className="card-link" href={p.link.href}>{p.link.label}</a>}
          </div>
        </li>
      )}
    </ul>);

}

function TechPanel() {
  return (
    <div className="tech">
      {CONTENT.tech.map((g) =>
      <div key={g.label} className="tech-group">
          <div className="tech-label">{g.label}</div>
          <div className="tech-items">
            {g.items.map((i, idx) =>
          <React.Fragment key={i}>
                <span className="tech-item">{i}</span>
                {idx < g.items.length - 1 && <span className="tech-dot">·</span>}
              </React.Fragment>
          )}
          </div>
        </div>
      )}
    </div>);

}

function EventsPanel() {
  return (
    <ul className="cards">
      {CONTENT.events.map((e, i) =>
      <li key={i} className="card">
          <div className="card-head">
            <span className="card-title">{e.name}</span>
            <span className="card-meta">{e.date}</span>
          </div>
          <p className="card-body">{e.blurb}</p>
          {e.link && <a className="card-link" href={e.link.href}>{e.link.label}</a>}
        </li>
      )}
    </ul>);

}

const PANELS = {
  current: CurrentPanel,
  experience: ExperiencePanel,
  projects: ProjectsPanel,
  tech: TechPanel,
  events: EventsPanel
};

// ─── tweaks ──────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "font": "manrope",
  "showAvailability": true
} /*EDITMODE-END*/;

function NameDisplay() {
  const textRef = React.useRef(null);
  const [vb, setVb] = React.useState('0 0 1000 130');

  React.useEffect(() => {
    const measure = () => {
      if (!textRef.current) return;
      const b = textRef.current.getBBox();
      const pad = 4;
      setVb(`${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`);
    };
    measure();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <svg
      className="name-svg"
      viewBox={vb}
      preserveAspectRatio="xMidYMid meet"
      aria-label="mukesh saravanan">
      
      <text ref={textRef} x="0" y="100" fill="currentColor">
        mukesh saravanan
      </text>
    </svg>);

}

const PALETTES = {
  warm: {
    // peach, sage, dusty blue, plum, rose
    current: 'oklch(0.78 0.10 65)',
    experience: 'oklch(0.74 0.08 155)',
    projects: 'oklch(0.74 0.09 240)',
    tech: 'oklch(0.73 0.08 320)',
    events: 'oklch(0.76 0.10 25)'
  },
  cool: {
    current: 'oklch(0.76 0.09 195)',
    experience: 'oklch(0.74 0.08 230)',
    projects: 'oklch(0.74 0.09 270)',
    tech: 'oklch(0.74 0.08 310)',
    events: 'oklch(0.76 0.09 175)'
  },
  earth: {
    current: 'oklch(0.74 0.08 70)',
    experience: 'oklch(0.70 0.06 130)',
    projects: 'oklch(0.70 0.05 200)',
    tech: 'oklch(0.68 0.05 50)',
    events: 'oklch(0.72 0.08 30)'
  },
  mono: {
    current: 'oklch(0.85 0.005 80)',
    experience: 'oklch(0.74 0.005 80)',
    projects: 'oklch(0.64 0.005 80)',
    tech: 'oklch(0.54 0.005 80)',
    events: 'oklch(0.44 0.005 80)'
  }
};

const FONTS = {
  manrope: '"Manrope", system-ui, sans-serif',
  lexend: '"Lexend", system-ui, sans-serif',
  poppins: '"Poppins", system-ui, sans-serif'
};

// ─── app ─────────────────────────────────────────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = React.useState('current');
  const [animKey, setAnimKey] = React.useState(0);

  const colors = PALETTES[t.palette] || PALETTES.warm;
  const accent = colors[active];

  // re-key the content node so the css fade-in animation replays on change
  const onSelect = (id) => {
    if (id === active) return;
    setActive(id);
    setAnimKey((k) => k + 1);
  };

  const Panel = PANELS[active];

  return (
    <div className="page" style={{ fontFamily: FONTS[t.font] || FONTS.manrope, '--accent': accent }}>
      <main className="layout">
        {/* identity block */}
        <section className="identity">
          <h1 className="name">
            <window.NameAnimated />
          </h1>
          <p className="tagline">software, slowly. brooklyn.</p>
          <nav className="links" aria-label="elsewhere">
            <a href="https://linkedin.com" className="link">linkedin</a>
            <span className="link-sep">·</span>
            <a href="https://github.com" className="link">github</a>
            <span className="link-sep">·</span>
            <a href="https://x.com" className="link">twitter</a>
          </nav>
        </section>

        {/* file cabinet */}
        <section className="cabinet" aria-label="sections">
          <div className="tabs" role="tablist">
            {TABS.map((tab) => {
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`tab ${isActive ? 'is-active' : ''}`}
                  style={{ '--c': colors[tab.id] }}
                  onClick={(e) => {
                    const el = e.currentTarget;
                    el.classList.remove('is-pressing');
                    // force reflow so re-adding the class restarts the animation
                    void el.offsetWidth;
                    el.classList.add('is-pressing');
                    onSelect(tab.id);
                  }}
                  onAnimationEnd={(e) => {
                    if (e.animationName === 'key-press') {
                      e.currentTarget.classList.remove('is-pressing');
                    }
                  }}>
                  
                  <span className="tab-label">{tab.label}</span>
                </button>);

            })}
          </div>

          <div className="panel" style={{ '--accent': accent }}>
            <div key={animKey} className="panel-body">
              <Panel accent={accent} />
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span>{`© ${new Date().getFullYear()} mukesh saravanan`}</span>
      </footer>

      <TweaksPanel title="tweaks">
        <TweakSection label="palette" />
        <TweakColor
          label="accents"
          value={[colors.current, colors.experience, colors.projects, colors.tech, colors.events]}
          options={Object.keys(PALETTES).map((k) => {
            const p = PALETTES[k];
            return [p.current, p.experience, p.projects, p.tech, p.events];
          })}
          onChange={(arr) => {
            const found = Object.entries(PALETTES).find(([, p]) =>
            JSON.stringify([p.current, p.experience, p.projects, p.tech, p.events]) === JSON.stringify(arr)
            );
            if (found) setTweak('palette', found[0]);
          }} />
        
        <TweakRadio
          label="set"
          value={t.palette}
          options={['warm', 'cool', 'earth', 'mono']}
          onChange={(v) => setTweak('palette', v)} />
        
        <TweakSection label="type" />
        <TweakRadio
          label="family"
          value={t.font}
          options={['manrope', 'lexend', 'poppins']}
          onChange={(v) => setTweak('font', v)} />
        
        <TweakSection label="content" />
        <TweakToggle
          label="show availability"
          value={t.showAvailability}
          onChange={(v) => setTweak('showAvailability', v)} />
        
      </TweaksPanel>

      {/* hidden CSS hook for availability toggle */}
      <style>{`.kicker{display:${t.showAvailability ? 'inline-flex' : 'none'}}`}</style>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);