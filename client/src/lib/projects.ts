/** Signal Ledger data reminder: keep every claim tied to the verified public project record and label planned work plainly. */
export type DemoKind = "source" | "planner" | "trace";

export type ProjectRecord = {
  slug: string;
  number: string;
  title: string;
  label: string;
  status: string;
  statusTone: "live" | "build" | "planned";
  summary: string;
  statement: string;
  sourceUrl: string;
  sourceLabel: string;
  demoKind: DemoKind;
  demoTitle: string;
  demoNote: string;
  capabilities: Array<{ title: string; detail: string; state: "Built" | "Demonstrated" | "Planned" }>;
  proof: Array<{ label: string; value: string }>;
};

export const projectRecords: ProjectRecord[] = [
  {
    slug: "ezrome-ai",
    number: "01",
    title: "EZROME AI",
    label: "Source-aware intelligence workspace",
    status: "Built & demonstrated",
    statusTone: "live",
    summary: "A source-aware intelligence and productivity workspace designed to separate verified facts, reported information, and AI analysis.",
    statement: "Useful intelligence does not only need answers. It needs a clear record of what is known, what is reported, and what still needs checking.",
    sourceUrl: "https://github.com/EZROME02/sixolile-mtyhali-portfolio-web-app",
    sourceLabel: "Open public portfolio repository",
    demoKind: "source",
    demoTitle: "Evidence-state console",
    demoNote: "A local interface demonstration of the project’s provenance model. It does not retrieve sources or validate a live claim.",
    capabilities: [
      { title: "Evidence states", detail: "Separates verified facts, reported information, and AI analysis in the user experience.", state: "Built" },
      { title: "Source-aware responses", detail: "The public product direction calls for source, publication, freshness, and provider status to accompany retrieved claims.", state: "Demonstrated" },
      { title: "Research workspace", detail: "Live web retrieval, citations, freshness, and saved research remain a future product surface.", state: "Planned" },
    ],
    proof: [
      { label: "Product surface", value: "Intelligence + productivity" },
      { label: "Trust model", value: "Provenance states" },
      { label: "Public record", value: "Portfolio repository" },
    ],
  },
  {
    slug: "ai-productivity-assistant",
    number: "02",
    title: "AI Productivity Assistant",
    label: "Structured workplace copilot",
    status: "Built & demonstrated",
    statusTone: "live",
    summary: "A responsive workplace dashboard for drafting, summarizing, prioritizing, researching, and thinking through work with human review built in.",
    statement: "Work gets lighter when the system gives your thinking a better shape — without pretending that an unfinished draft is a finished decision.",
    sourceUrl: "https://github.com/EZROME02/AI-Productivity-Assistant",
    sourceLabel: "Open public assistant repository",
    demoKind: "planner",
    demoTitle: "Priority-map console",
    demoNote: "A local interaction inspired by the project’s planner model. It does not make an AI request, store data, or produce a real schedule.",
    capabilities: [
      { title: "Workplace toolset", detail: "The public record includes email drafting, meeting-note summaries, task planning, research briefs, and an AI coworker chat.", state: "Built" },
      { title: "Human review", detail: "Outputs are structured for preview, editing, copying, or download before use.", state: "Built" },
      { title: "Responsible AI", detail: "The project documents explicit uncertainty, confirmation placeholders, and sensitive-data guidance.", state: "Demonstrated" },
    ],
    proof: [
      { label: "Core tools", value: "5 workspace modes" },
      { label: "Output design", value: "Structured + editable" },
      { label: "Runtime rule", value: "Server-side model calls" },
    ],
  },
  {
    slug: "ezrome-intelligence",
    number: "03",
    title: "EZROME Intelligence",
    label: "Public-information research direction",
    status: "In development",
    statusTone: "planned",
    summary: "An evolving research direction for source-led public information, explicit freshness, structured synthesis, and useful business context.",
    statement: "A research tool should show its trail — not turn a confident-looking answer into a substitute for evidence.",
    sourceUrl: "https://github.com/EZROME02/sixolile-mtyhali-portfolio-web-app",
    sourceLabel: "Open public platform record",
    demoKind: "trace",
    demoTitle: "Research-trace console",
    demoNote: "A local walkthrough of the intended evidence flow. Live retrieval, source adapters, and persistent storage remain development phases.",
    capabilities: [
      { title: "Research provenance", detail: "The planned experience centers source information, publication context, freshness, and explicit AI-analysis states.", state: "Planned" },
      { title: "Public-information boundary", detail: "The product direction does not treat inferred private intentions or sensitive private data as public facts.", state: "Demonstrated" },
      { title: "Persistent workspaces", detail: "Authentication, storage, retrieval adapters, and business tools are described as separate future phases.", state: "Planned" },
    ],
    proof: [
      { label: "Current status", value: "In development" },
      { label: "Research frame", value: "Sources + freshness" },
      { label: "Release rule", value: "No implied live search" },
    ],
  },
];

export function getProject(slug?: string) {
  return projectRecords.find((project) => project.slug === slug);
}
