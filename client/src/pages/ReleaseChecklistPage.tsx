import { ArrowRight, CheckCircle2, CircleAlert, LockKeyhole, Rocket } from "lucide-react";
import { Link } from "wouter";
import { HubShell } from "@/components/HubShell";

const implementationItems = [
  ["Free-first V1 scope", "Watch, Shorts, Creator Stations, Community, Football/Rated Opinionz, culture, search, offline library, reporting, moderation, deletion, and AI foundations.", true],
  ["Billing deferred safely", "Digital products are catalogued for future Google Play Billing; no live charges or active checkout are enabled.", true],
  ["Trust and safety", "Human review states, visible reporting, creator download controls, account deletion requests, and cancellation are implemented.", true],
  ["Offline boundaries", "Downloaded signals use rights-controlled access and limited offline playback behavior.", true],
  ["Approval-based automation", "AI-assisted newsroom and release workflows prepare drafts and queues; they do not auto-publish, auto-charge, or submit releases.", true],
] as const;

const ownerItems = [
  ["Publish final policies", "Replace drafts with attorney-reviewed Privacy Policy, Terms, Community Guidelines, Copyright/Reporting Policy, and the public account-deletion resource."],
  ["Confirm support identity", "Choose the support and copyright-reporting inbox shown to users and reviewers."],
  ["Own Android release", "Create or confirm com.ezrome.app in your Google Play Console account and keep production signing under your control."],
  ["Configure testing", "Recruit closed-test users and test on real Android devices across sign-in, uploads, offline playback, deletion, reports, and moderation."],
  ["Activate monetization later", "Only after free V1 is stable: define product IDs, prices, regions, trials, server verification, renewals, refunds, and revocation."],
] as const;

export function ReleaseChecklistPage() {
  return <HubShell active="Station"><section className="lane-intro compact"><div><span>EZROME V1 / RELEASE CONTROL</span><h1>Build once.<br /><em>Ship with proof.</em></h1><p>This is the active finalization checklist for the free-first Google Play release candidate. The platform is not represented as Google-approved until the owner-controlled gates are completed.</p></div><Rocket className="size-12 text-cyan-300" /></section><section className="channel-content"><div className="hub-section-title"><div><span>IMPLEMENTED IN EZROME</span><h2>Release candidate foundations.</h2></div><span>5 / 5</span></div><div className="explore-grid">{implementationItems.map(([title, body]) => <article className="lane-blank" key={title}><CheckCircle2 className="size-6 text-cyan-300" /><span>READY IN CODE</span><h3>{title}</h3><p>{body}</p></article>)}</div><div className="hub-section-title"><div><span>OWNER-CONTROLLED GATES</span><h2>What must happen before Submit.</h2></div><span>0 / 5</span></div><div className="explore-grid">{ownerItems.map(([title, body]) => <article className="lane-blank" key={title}><LockKeyhole className="size-6 text-violet-300" /><span>REQUIRES YOUR ACTION</span><h3>{title}</h3><p>{body}</p></article>)}</div><div className="watch-description"><CircleAlert className="size-5" /><div><span>SAFE AUTOMATION BOUNDARY</span><p>The future Kimi-compatible assistant may prepare source summaries, release notes, QA matrices, and policy checklists. It must remain approval-based and must not access private signing keys, publish to Play Console, accept legal terms, or trigger payments.</p></div></div><Link href="/settings" className="loop-outline">Open trust and safety controls <ArrowRight className="size-4" /></Link></section></HubShell>;
}
