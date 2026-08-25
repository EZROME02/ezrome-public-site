/**
 * Signal Ledger design reminder: this page is an asymmetric public-work archive, not a generic product landing page.
 * Use midnight navy, Signal Turquoise evidence markers, Swiss-inspired type hierarchy, and calm proof-first storytelling.
 */
import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowUpRight,
  Asterisk,
  Code2,
  ExternalLink,
  Github,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const PROJECT_URL = "https://ezrome.co.za/projects";
const GITHUB_URL = "https://github.com/EZROME02";

const projectRecords = [
  {
    number: "01",
    title: "EZROME AI",
    status: "Built & demonstrated",
    body: "A source-aware intelligence and productivity workspace shaped around clear provenance, useful work, and responsible AI states.",
    slug: "ezrome-ai",
  },
  {
    number: "02",
    title: "AI Productivity Assistant",
    status: "Built & demonstrated",
    body: "Practical experiments in making digital work more structured, visible, and manageable for everyday builders.",
    slug: "ai-productivity-assistant",
  },
  {
    number: "03",
    title: "EZROME Intelligence",
    status: "In development",
    body: "An evolving direction for public-information research, citations, freshness, and careful reasoning in one workspace.",
    slug: "ezrome-intelligence",
  },
];

const proofItems = [
  ["01", "Build with receipts", "Public commits, decisions, and lessons make the process inspectable."],
  ["02", "Keep claims exact", "Status language stays tied to what exists now, not what may arrive later."],
  ["03", "Move culture forward", "Technology should respect the energy, ambition, and context of the people using it."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#071319] text-[#edf7f6] selection:bg-[#19e6d2] selection:text-[#071319]">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="EZROME home">
          <span className="css-brand-mark" aria-hidden="true"><i /><i /><i /><b /></span>
          <span>EZROME</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          <a href="#record" className="nav-link">The record</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#frequency" className="nav-link">Frequency</a>
        </nav>

        <Button asChild className="hidden h-10 rounded-none bg-[#19e6d2] px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#071319] hover:bg-[#c8fff8] lg:inline-flex">
          <a href={PROJECT_URL} target="_blank" rel="noreferrer">
            Open projects <ArrowUpRight className="ml-2 size-3.5" />
          </a>
        </Button>

        <button
          className="menu-toggle lg:hidden"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {menuOpen && (
        <nav className="mobile-nav lg:hidden" aria-label="Mobile navigation">
          <a onClick={() => setMenuOpen(false)} href="#record">The record</a>
          <a onClick={() => setMenuOpen(false)} href="#projects">Projects</a>
          <a onClick={() => setMenuOpen(false)} href="#frequency">Frequency</a>
          <a onClick={() => setMenuOpen(false)} href={PROJECT_URL} target="_blank" rel="noreferrer">Open projects <ArrowUpRight className="size-4" /></a>
        </nav>
      )}

      <main id="top">
        <section className="hero-ledger">
          <div className="hero-rail" aria-hidden="true">
            <span>TRANSMISSION / 2026</span>
            <span className="hero-rail-dot" />
            <span>ISSUE / 08</span>
          </div>

          <div className="hero-copy">
            <div className="eyebrow appear-one"><span className="status-dot" /> PUBLIC WORKBENCH</div>
            <h1 className="hero-heading appear-two">
              Culture moves fast.<br />
              <em>The work</em> needs receipts.
            </h1>
            <p className="hero-intro appear-three">
              EZROME is a public workbench for practical AI, digital craft, and the people building what comes next.
            </p>
            <div className="hero-actions appear-four">
              <Button asChild className="h-12 rounded-none bg-[#19e6d2] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#071319] hover:bg-[#c8fff8]">
                <a href={PROJECT_URL} target="_blank" rel="noreferrer">View public projects <ArrowUpRight className="ml-2 size-4" /></a>
              </Button>
              <a className="text-action" href="#record">Read the working notes <ArrowDownRight className="size-4" /></a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Abstract EZROME technology signal artwork">
            <img src="/manus-storage/ezrome-hero-signal-ledger_1169080b.jpg" alt="Abstract technical materials with cyan signal traces" />
            <div className="hero-visual-stamp">
              <span>FIELD NOTE</span>
              <strong>01 / 03</strong>
            </div>
          </div>

          <div className="hero-ticker">
            <span>AI / PRODUCTIVITY / DIGITAL CRAFT / CULTURE / PUBLIC BUILD</span>
            <Asterisk className="size-4 text-[#19e6d2]" />
            <span>AI / PRODUCTIVITY / DIGITAL CRAFT / CULTURE / PUBLIC BUILD</span>
          </div>
        </section>

        <section id="record" className="record-section">
          <div className="section-label"><span>01</span> THE RECORD</div>
          <div className="record-layout">
            <div>
              <p className="kicker">WHAT EZROME IS WORKING TOWARD</p>
              <h2 className="section-heading">Useful technology, <em>made visible.</em></h2>
            </div>
            <div className="record-copy">
              <p>
                The point is not to perform innovation. The point is to keep building practical systems that help people think, organize, research, and move their work forward.
              </p>
              <p>
                This site keeps the story close to the evidence: public project records, honest status labels, and a founder-led view of what is changing.
              </p>
              <a className="underlined-link" href={GITHUB_URL} target="_blank" rel="noreferrer">Inspect the public GitHub <Github className="size-4" /></a>
            </div>
          </div>

          <div className="proof-grid">
            {proofItems.map(([number, title, body]) => (
              <article className="proof-card" key={number}>
                <span className="proof-number">{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="proof-rule" />
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="projects-section">
          <div className="projects-heading-row">
            <div className="section-label section-label-light"><span>02</span> PROJECT RECORDS</div>
            <p>Three public directions.<br />One working practice.</p>
          </div>
          <div className="project-list">
            {projectRecords.map((project) => (
              <Link className="project-row" href={`/projects/${project.slug}`} key={project.number}>
                <span className="project-index">{project.number}</span>
                <div className="project-title-wrap">
                  <h3>{project.title}</h3>
                  <p>{project.body}</p>
                </div>
                <div className="project-status"><span className="status-tick" /> {project.status}</div>
                <MoveUpRight className="project-arrow size-5" />
              </Link>
            ))}
          </div>
          <div className="projects-footnote">
            <span>STATUS LANGUAGE IS DELIBERATE.</span>
            <span>See current scope before assuming a release.</span>
          </div>
        </section>

        <section className="build-section">
          <div className="build-art">
            <img src="/manus-storage/ezrome-build-public_3fd0ee89.jpg" alt="Technical project notebook and modular workbench" />
            <div className="build-marker"><Code2 className="size-4" /> BUILT IN PUBLIC</div>
          </div>
          <div className="build-copy">
            <div className="section-label"><span>03</span> BUILD NOTES</div>
            <h2 className="section-heading">The work behind <em>the signal.</em></h2>
            <p>
              Every milestone matters when you are building in public: a clearer route, a stronger check, a better story, a more useful experience. Those details are not side notes. They are the practice.
            </p>
            <p>
              EZROME shares the decisions, experiments, and lessons that make progress legible — without pretending that unfinished work is finished.
            </p>
            <Button asChild variant="outline" className="mt-7 h-11 rounded-none border-[#163c44] bg-transparent px-4 text-xs font-bold uppercase tracking-[0.13em] text-[#07242b] hover:border-[#19e6d2] hover:bg-[#19e6d2]">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">Follow the build <Github className="ml-2 size-4" /></a>
            </Button>
          </div>
        </section>

        <section id="frequency" className="frequency-section">
          <div className="frequency-top">
            <div className="section-label section-label-dark"><span>04</span> SIGNAL FREQUENCY</div>
            <p className="frequency-caption">A culture-first point of view for the builders who keep their hands on the work.</p>
          </div>
          <div className="frequency-layout">
            <div className="frequency-copy">
              <h2>Built from the<br /><em>same energy</em><br />that moves culture.</h2>
              <p>
                There is rigor in the studio, discipline in the code, and a reason to make technology feel less distant. EZROME keeps those ideas in the same room.
              </p>
              <a className="text-action text-action-bright" href="https://www.instagram.com/xillahwethuii/" target="_blank" rel="noreferrer">Follow the public notes <ExternalLink className="size-4" /></a>
            </div>
            <div className="frequency-art">
              <img src="/manus-storage/ezrome-culture-frequency_26b421c2.jpg" alt="Abstract dark contours and turquoise signal bars" />
              <span className="frequency-tag">CULTURE × SYSTEMS</span>
            </div>
          </div>
        </section>

        <section className="dispatch-section">
          <div className="dispatch-image"><img src="/manus-storage/ezrome-project-record_7e15c06a.jpg" alt="Abstract project record cards and translucent glass" /></div>
          <div className="dispatch-card">
            <div className="section-label section-label-light"><span>05</span> PROJECT DISPATCH</div>
            <div className="eyebrow"><Sparkles className="size-3.5 text-[#19e6d2]" /> START WITH THE WORK</div>
            <h2>Open the project record.</h2>
            <p>See what is being developed, what has been demonstrated, and where EZROME is heading next.</p>
            <Button asChild className="h-12 rounded-none bg-[#19e6d2] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#071319] hover:bg-[#c8fff8]">
              <a href={PROJECT_URL} target="_blank" rel="noreferrer">Explore EZROME <ArrowUpRight className="ml-2 size-4" /></a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><span className="css-brand-mark" aria-hidden="true"><i /><i /><i /><b /></span> EZROME</div>
        <p>Practical AI. Public work. Built with intent.</p>
        <div className="footer-links">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/xillah-wethu-385aa63b4" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://x.com/XillahW37827" target="_blank" rel="noreferrer">X</a>
        </div>
      </footer>
    </div>
  );
}
