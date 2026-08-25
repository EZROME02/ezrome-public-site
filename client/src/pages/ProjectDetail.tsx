/**
 * Signal Ledger design reminder: project pages are inspectable records. Use metadata, status labels, and demos that explain without fabricating live product behavior.
 */
import { Button } from "@/components/ui/button";
import { getProject, type ProjectRecord } from "@/lib/projects";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, ExternalLink, Github, Info, Network, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useRoute } from "wouter";

function Header() {
  return (
    <header className="detail-header">
      <Link className="brand-lockup" href="/" aria-label="EZROME home">
        <span className="css-brand-mark" aria-hidden="true"><i /><i /><i /><b /></span>
        <span>EZROME</span>
      </Link>
      <div className="detail-header-meta"><span>PROJECT RECORD</span><span>2026 / 08</span></div>
      <Link href="/#projects" className="detail-back-link"><ArrowLeft className="size-4" /> All records</Link>
    </header>
  );
}

function StatusPill({ project }: { project: ProjectRecord }) {
  return <span className={`detail-status status-${project.statusTone}`}><span />{project.status}</span>;
}

function RecordArtifact({ project }: { project: ProjectRecord }) {
  if (project.demoKind === "source") {
    return <div className="detail-artifact artifact-source" aria-hidden="true"><span className="artifact-label">PROVENANCE GRID</span><div className="artifact-source-cells"><i>FACT</i><i>REPORT</i><i>ANALYSIS</i></div><span className="artifact-code">SOURCE / 03</span></div>;
  }
  if (project.demoKind === "planner") {
    return <div className="detail-artifact artifact-planner" aria-hidden="true"><span className="artifact-label">FOCUS MAP</span><div className="artifact-planner-bars"><i /><i /><i /><i /></div><span className="artifact-code">PRIORITY / 04</span></div>;
  }
  return <div className="detail-artifact artifact-trace" aria-hidden="true"><span className="artifact-label">RESEARCH TRACE</span><div className="artifact-trace-path"><i /><i /><i /><i /></div><span className="artifact-code">RECORD / 04</span></div>;
}

function SourceDemo() {
  const [claim, setClaim] = useState("A project claim should make its evidence state visible.");
  const [state, setState] = useState<"Verified" | "Reported" | "AI analysis">("Verified");
  const descriptions = {
    Verified: "Evidence state: verified input. A real source link and date would be required before treating this as a verified fact.",
    Reported: "Evidence state: reported information. Preserve the source and attribution; do not present it as independently verified.",
    "AI analysis": "Evidence state: analysis. This is an interpretation layer, not a claim of independently confirmed fact.",
  };

  return (
    <div className="demo-console">
      <div className="demo-console-top"><span>LOCAL DEMO</span><span>NO LIVE RETRIEVAL</span></div>
      <label className="demo-input-label" htmlFor="claim-demo">Claim under review</label>
      <textarea id="claim-demo" value={claim} onChange={(event) => setClaim(event.target.value)} className="demo-textarea" rows={3} />
      <div className="demo-controls" aria-label="Select evidence state">
        {(Object.keys(descriptions) as Array<keyof typeof descriptions>).map((item) => (
          <button key={item} onClick={() => setState(item)} className={`demo-select ${state === item ? "is-selected" : ""}`}>{item}</button>
        ))}
      </div>
      <div className="demo-result"><span className="demo-state-dot" /><div><strong>{state}</strong><p>{descriptions[state]}</p></div></div>
    </div>
  );
}

function PlannerDemo() {
  const [focus, setFocus] = useState<"Plan" | "Protect" | "Progress">("Plan");
  const content = {
    Plan: { title: "Shape the day", summary: "Turn a broad work intention into a short, visible plan.", tasks: ["Define the one outcome", "Block a focused work window", "List the next three actions"] },
    Protect: { title: "Protect the important", summary: "Keep high-value work from being buried under reactive tasks.", tasks: ["Identify the decision that matters", "Move low-value work later", "Keep a buffer before the deadline"] },
    Progress: { title: "Close the loop", summary: "Make work legible enough to review, improve, and share.", tasks: ["Capture the result", "Review open risks", "Write the next starting point"] },
  } as const;
  const current = content[focus];

  return (
    <div className="demo-console">
      <div className="demo-console-top"><span>LOCAL DEMO</span><span>NO AI REQUEST</span></div>
      <div className="demo-controls" aria-label="Select planning mode">
        {(Object.keys(content) as Array<keyof typeof content>).map((item) => (
          <button key={item} onClick={() => setFocus(item)} className={`demo-select ${focus === item ? "is-selected" : ""}`}>{item}</button>
        ))}
      </div>
      <div className="planner-output">
        <span className="planner-index">0{(["Plan", "Protect", "Progress"] as const).indexOf(focus) + 1}</span>
        <div><h4>{current.title}</h4><p>{current.summary}</p></div>
        <ul>{current.tasks.map((task) => <li key={task}><Check className="size-3.5" /> {task}</li>)}</ul>
      </div>
      <p className="demo-disclaimer"><Info className="size-3.5" /> This is a static interaction demonstrating the project’s priority-planning framing.</p>
    </div>
  );
}

function TraceDemo() {
  const [step, setStep] = useState(0);
  const steps = [
    ["Question", "Start with a bounded question and make the scope visible."],
    ["Sources", "Attach source, publication context, and freshness before synthesis."],
    ["Synthesis", "Separate reported material, factual support, and interpretation."],
    ["Record", "Keep a clear trail so users can inspect the work and revisit it later."],
  ];
  const active = steps[step];

  return (
    <div className="demo-console">
      <div className="demo-console-top"><span>LOCAL DEMO</span><span>FUTURE WORKFLOW</span></div>
      <div className="trace-line" role="tablist" aria-label="Research trace steps">
        {steps.map(([label], index) => (
          <button key={label} role="tab" aria-selected={step === index} onClick={() => setStep(index)} className={`trace-node ${step === index ? "is-active" : ""}`}>
            <span>{`0${index + 1}`}</span>{label}
          </button>
        ))}
      </div>
      <div className="trace-output"><Network className="size-5" /><div><span>STEP {`0${step + 1}`}</span><h4>{active[0]}</h4><p>{active[1]}</p></div></div>
      <p className="demo-disclaimer"><Info className="size-3.5" /> The screen demonstrates intended provenance flow; it does not search, store, or validate information.</p>
    </div>
  );
}

function InteractiveDemo({ project }: { project: ProjectRecord }) {
  if (project.demoKind === "source") return <SourceDemo />;
  if (project.demoKind === "planner") return <PlannerDemo />;
  return <TraceDemo />;
}

function MediaPlaceholders({ project }: { project: ProjectRecord }) {
  return (
    <section className="detail-media-section">
      <div className="detail-section-label"><span>03</span> APPROVED MEDIA</div>
      <div className="detail-media-header"><div><h2>{project.mediaHeading}</h2><p>{project.mediaContext}</p></div><span className="media-pending-label">MEDIA / AWAITING APPROVAL</span></div>
      <div className={`detail-media-grid media-${project.demoKind}`}>
        <article className="walkthrough-placeholder">
          <div className={`walkthrough-screen screen-${project.demoKind}`}>
            <div className="screen-topline"><span>WALKTHROUGH / 00:00</span><span>PLACEHOLDER</span></div>
            <div className="screen-center"><span className="play-void">▶</span><strong>{project.title}</strong><small>VIDEO SLOT / APPROVED RECORDING REQUIRED</small></div>
            <div className="screen-track"><span /></div>
          </div>
          <div className="media-card-caption"><span>VIDEO RECORD</span><p>Use this panel for a short, approved product walkthrough that shows a real interface, live build, or verified process.</p></div>
        </article>
        <article className="screenshots-placeholder">
          <div className="screenshot-grid">
            {['01', '02', '03'].map((number, index) => <div className={`shot-slot shot-${index + 1}`} key={number}><span>SCREEN / {number}</span><div className="shot-lines"><i /><i /><i /></div><small>APPROVED CAPTURE PENDING</small></div>)}
          </div>
          <div className="media-card-caption"><span>SCREENSHOT INDEX</span><p>Use these frames for current, permission-cleared product views. Remove any private information before publication.</p></div>
        </article>
      </div>
    </section>
  );
}

function MissingProject() {
  return (
    <div className="detail-page"><Header /><main className="missing-project"><div className="eyebrow"><span className="status-dot" /> RECORD NOT FOUND</div><h1>This project record is not available.</h1><Link href="/#projects" className="text-action">Return to the public records <ArrowLeft className="size-4" /></Link></main></div>
  );
}

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const project = getProject(params?.slug);
  if (!project) return <MissingProject />;

  return (
    <div className={`detail-page project-${project.demoKind}`}>
      <Header />
      <main>
        <section className="detail-hero">
          <div className="detail-rail"><span>RECORD / {project.number}</span><span className="detail-rail-rule" /><span>PUBLIC</span></div>
          <div className="detail-hero-main">
            <div className="detail-pretitle"><span>0{project.number}</span> {project.label}</div>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <div className="detail-actions"><StatusPill project={project} /><a className="detail-source-link" href={project.sourceUrl} target="_blank" rel="noreferrer"><Github className="size-4" /> {project.sourceLabel} <ArrowUpRight className="size-3.5" /></a></div>
          </div>
          <RecordArtifact project={project} />
          <aside className="detail-hero-statement"><Sparkles className="size-4" /><p>{project.statement}</p><span>EZROME WORKING NOTE</span></aside>
        </section>

        <section className="detail-proof-strip">
          {project.proof.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}
        </section>

        <section className="detail-section detail-capabilities">
          <div className="detail-section-label"><span>01</span> CURRENT RECORD</div>
          <div className="detail-section-header"><h2>{project.recordHeading}</h2><p>{project.recordContext}</p></div>
          <div className="capability-list">
            {project.capabilities.map((capability, index) => <article key={capability.title} className="capability-row"><span>0{index + 1}</span><h3>{capability.title}</h3><p>{capability.detail}</p><small className={`capability-state state-${capability.state.toLowerCase()}`}>{capability.state}</small></article>)}
          </div>
        </section>

        <section className="detail-demo-section">
          <div className="detail-section-label detail-section-label-dark"><span>02</span> INTERACTIVE NOTE</div>
          <div className="detail-demo-heading"><div><h2>{project.demoTitle}</h2><p>{project.demoNote}</p></div><span className="demo-badge">SAFE / LOCAL</span></div>
          <InteractiveDemo project={project} />
        </section>

        <MediaPlaceholders project={project} />

        <section className="detail-next-section">
          <div><div className="detail-section-label"><span>04</span> NEXT INSPECTION</div><h2>{project.nextHeading}</h2></div>
          <div className="detail-next-actions"><Link className="next-record-link" href="/#projects">Return to all project records <ChevronRight className="size-4" /></Link><Button asChild className="h-11 rounded-none bg-[#19e6d2] px-4 text-xs font-bold uppercase tracking-[.13em] text-[#071319] hover:bg-[#c8fff8]"><a href="https://ezrome.co.za/projects" target="_blank" rel="noreferrer">Open EZROME projects <ExternalLink className="ml-2 size-4" /></a></Button></div>
        </section>
      </main>
      <footer className="site-footer"><div className="footer-brand"><span className="css-brand-mark" aria-hidden="true"><i /><i /><i /><b /></span> EZROME</div><p>Practical AI. Public work. Built with intent.</p><div className="footer-links"><a href="https://github.com/EZROME02" target="_blank" rel="noreferrer">GitHub</a><Link href="/">Home</Link></div></footer>
    </div>
  );
}
