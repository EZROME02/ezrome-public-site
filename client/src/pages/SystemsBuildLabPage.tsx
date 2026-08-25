import { useMemo, useState } from "react";
import { ArrowRight, Binary, Blocks, Check, Code2, Cpu, Database, Layers3, Monitor, RotateCcw, Workflow } from "lucide-react";
import { Link } from "wouter";
import { HubShell } from "@/components/HubShell";

const topics = [
  { title: "Operating systems", kicker: "01 / PLATFORM", icon: Cpu, color: "cyan", body: "The control layer that manages hardware, memory, files, processes, permissions, and the services applications depend on.", build: "Map how Android, browsers, and servers coordinate the EZROME experience." },
  { title: "Graphical user interfaces", kicker: "02 / INTERFACE", icon: Monitor, color: "violet", body: "The visual language of windows, navigation, controls, feedback, and accessibility that turns system power into usable experiences.", build: "Break down the Signal Commons navigation, creator studio, offline library, and responsive layouts." },
  { title: "Language translators", kicker: "03 / TRANSLATION", icon: Code2, color: "cyan", body: "Compilers, interpreters, and assemblers translate human-written instructions into forms a machine can execute.", build: "Trace a feature from TypeScript and React through bundling, server execution, and the browser." },
  { title: "Utility programs", kicker: "04 / TOOLING", icon: Blocks, color: "violet", body: "Focused tools that maintain, protect, inspect, configure, compress, back up, or improve a system.", build: "Identify the tools behind testing, storage safety, offline caching, migrations, and release checks." },
  { title: "Application software", kicker: "05 / PRODUCT", icon: Layers3, color: "cyan", body: "Software created for people’s goals: communication, media, education, creativity, productivity, and community.", build: "Classify EZROME’s Watch, Shorts, Football, Community, Creator, and AI surfaces." },
  { title: "Systems development life cycle", kicker: "06 / DELIVERY", icon: Workflow, color: "violet", body: "A repeatable path from discovery and requirements through design, implementation, testing, release, operations, and improvement.", build: "Use the EZROME roadmap to move from signal to prototype, verified release candidate, and staged launch." },
  { title: "Data representation", kicker: "07 / SIGNAL", icon: Binary, color: "cyan", body: "The ways systems encode text, numbers, images, audio, video, permissions, and states so they can be stored and processed.", build: "Explore bits, bytes, metadata, media keys, timestamps, offline records, and source-aware content states." },
] as const;

const lifecycle = [
  ["Discover", "Name the problem, audience, constraints, and outcome."],
  ["Design", "Shape the experience, data model, risks, and acceptance checks."],
  ["Build", "Turn the design into working software and documented decisions."],
  ["Verify", "Test behavior, accessibility, security, and real-world edge cases."],
  ["Release", "Ship deliberately with ownership, support, monitoring, and rollback."],
  ["Improve", "Learn from evidence and iterate without losing the thread."],
] as const;

const translatorSteps = [
  ["Source code", "TypeScript and JSX express the intent in a human-readable form."],
  ["Transform", "The toolchain resolves imports, types, components, and assets."],
  ["Bundle", "Code is optimized into browser-ready modules and server output."],
  ["Execute", "The browser and server run the resulting instructions."],
] as const;

function toBinary(value: string) { return Array.from(value).map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" "); }
function fromBinary(value: string) { return value.trim().split(/\s+/).filter(Boolean).map((chunk) => String.fromCharCode(parseInt(chunk, 2))).join(""); }

export function SystemsBuildLabPage() {
  const [text, setText] = useState("EZROME");
  const [binary, setBinary] = useState(() => toBinary("EZROME"));
  const [stage, setStage] = useState(0);
  const [translatorStep, setTranslatorStep] = useState(0);
  const [binaryMode, setBinaryMode] = useState<"text" | "binary">("text");
  const binaryOutput = useMemo(() => binaryMode === "text" ? toBinary(text) : fromBinary(binary), [binaryMode, binary, text]);
  const resetDemos = () => { setText("EZROME"); setBinary(toBinary("EZROME")); setStage(0); setTranslatorStep(0); setBinaryMode("text"); };

  return <HubShell active="Build Lab"><section className="lane-intro compact build-lab-hero"><div><span>EZROME / TECH FOUNDATIONS</span><h1>Understand the system.<br /><em>Build with intent.</em></h1><p>A practical learning lane for the ideas underneath every digital experience—from operating systems and interfaces to data, software, and the development life cycle.</p><div className="build-lab-actions"><Link href="/release-checklist" className="top-create">View EZROME release map <ArrowRight className="size-4" /></Link><Link href="/projects/ezrome-ai" className="loop-outline">See the build in public</Link></div></div><div className="build-lab-orbit" aria-hidden="true"><div className="orbit-core"><span>EZ</span></div><i /><i /><i /></div></section><section className="channel-content"><div className="hub-section-title"><div><span>THE FOUNDATION STACK</span><h2>Seven ways to read a digital world.</h2></div><span>07 / TOPICS</span></div><div className="systems-topic-grid">{topics.map(({ title, kicker, icon: Icon, color, body, build }) => <article className={`systems-topic-card systems-topic-${color}`} key={title}><div className="systems-topic-top"><span>{kicker}</span><Icon className="size-6" /></div><h3>{title}</h3><p>{body}</p><div className="systems-topic-build"><span>EZROME CONNECTION</span><strong>{build}</strong></div></article>)}</div>

  <div className="hub-section-title systems-demo-heading"><div><span>INTERACTIVE SIGNALS</span><h2>Try the concepts, don’t just read them.</h2></div><button className="loop-outline systems-reset" onClick={resetDemos}><RotateCcw className="size-4" /> Reset demos</button></div>
  <div className="systems-demo-grid">
    <article className="systems-demo-card"><div className="systems-demo-label"><span>DEMO 01 / DATA REPRESENTATION</span><Binary className="size-5" /></div><h3>Text ↔ binary</h3><p>See how a short text signal can be represented as eight-bit character values. Edit either side and observe the representation change.</p><div className="systems-toggle" role="group" aria-label="Choose binary converter direction"><button className={binaryMode === "text" ? "is-selected" : ""} onClick={() => setBinaryMode("text")}>Text to binary</button><button className={binaryMode === "binary" ? "is-selected" : ""} onClick={() => setBinaryMode("binary")}>Binary to text</button></div>{binaryMode === "text" ? <label className="systems-field">Text input<input value={text} maxLength={18} onChange={(event) => { setText(event.target.value); setBinary(toBinary(event.target.value)); }} /></label> : <label className="systems-field">Eight-bit groups<input value={binary} onChange={(event) => setBinary(event.target.value)} /></label>}<div className="systems-output" aria-live="polite"><span>OUTPUT</span><strong>{binaryOutput || "—"}</strong></div><small className="systems-learning">Learning outcome: data is a representation layer, not the human meaning itself.</small></article>
    <article className="systems-demo-card"><div className="systems-demo-label"><span>DEMO 02 / DELIVERY</span><Workflow className="size-5" /></div><h3>Walk the SDLC</h3><p>Move through a product life cycle and connect each stage to the evidence a responsible team should produce.</p><div className="systems-progress" aria-label={`SDLC stage ${stage + 1} of ${lifecycle.length}`}><div style={{ width: `${((stage + 1) / lifecycle.length) * 100}%` }} /></div><div className="systems-stage"><span>STAGE {String(stage + 1).padStart(2, "0")} / {lifecycle.length}</span><h4>{lifecycle[stage][0]}</h4><p>{lifecycle[stage][1]}</p></div><div className="systems-demo-actions"><button className="loop-outline" disabled={stage === 0} onClick={() => setStage((current) => Math.max(0, current - 1))}>Previous</button><button className="top-create" disabled={stage === lifecycle.length - 1} onClick={() => setStage((current) => Math.min(lifecycle.length - 1, current + 1))}>{stage === lifecycle.length - 1 ? "Complete" : "Next stage"} <ArrowRight className="size-4" /></button></div><small className="systems-learning">Learning outcome: reliable software is a loop of evidence, not only a coding moment.</small></article>
    <article className="systems-demo-card"><div className="systems-demo-label"><span>DEMO 03 / LANGUAGE TRANSLATORS</span><Code2 className="size-5" /></div><h3>Follow the translation flow</h3><p>Step through how a developer idea becomes instructions that a browser or server can execute.</p><div className="translator-flow">{translatorSteps.map(([title], index) => <button key={title} className={translatorStep === index ? "translator-node is-selected" : "translator-node"} onClick={() => setTranslatorStep(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong></button>)}</div><div className="systems-stage"><span>SELECTED LAYER</span><h4>{translatorSteps[translatorStep][0]}</h4><p>{translatorSteps[translatorStep][1]}</p></div><div className="systems-demo-actions"><button className="top-create" onClick={() => setTranslatorStep((current) => (current + 1) % translatorSteps.length)}>Advance flow <ArrowRight className="size-4" /></button></div><small className="systems-learning">Learning outcome: translators preserve intent while changing representation.</small></article>
  </div>
  <div className="watch-description systems-build-prompt"><div><span>BUILD LAB PROMPT</span><h3>Pick one layer. Explain it in your own signal.</h3><p>Create a short video, diagram, post, or mini-demo showing how one of these foundations shapes the apps people use every day. Draft it in Creator Studio, then share the build process with the community.</p></div><Link href="/create" className="top-create">Open Creator Studio <ArrowRight className="size-4" /></Link></div><div className="systems-data-strip"><Database className="size-5" /><span>LEARN BY TRACING THE FLOW</span><strong>hardware → system software → application → data → human outcome</strong></div></section></HubShell>;
}
