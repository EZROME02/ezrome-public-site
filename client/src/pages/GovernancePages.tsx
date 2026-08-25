import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ShieldCheck, Trash2, Flag, Sparkles, ArrowRight } from "lucide-react";
import { HubShell } from "@/components/HubShell";
import { Gate } from "@/pages/HubPages";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function GovernancePage() {
  const { isAuthenticated, user } = useAuth();
  const [reason, setReason] = useState("");
  const deletion = trpc.media.deletionStatus.useQuery(undefined, { enabled: isAuthenticated });
  const creatorVideos = trpc.media.creatorVideos.useQuery(undefined, { enabled: isAuthenticated });
  const toggleDownload = trpc.media.setDownloadable.useMutation({ onSuccess: () => { toast.success("Download permission updated."); void creatorVideos.refetch(); }, onError: (error) => toast.error(error.message) });
  const cancel = trpc.media.cancelDeletion.useMutation({ onSuccess: () => { toast.success("Deletion request cancelled."); void deletion.refetch(); }, onError: (error) => toast.error(error.message) });
  const request = trpc.media.requestDeletion.useMutation({
    onSuccess: () => { toast.success("Deletion request recorded. Support will confirm the next step."); void deletion.refetch(); },
    onError: (error) => toast.error(error.message),
  });

  return (
    <HubShell active="Station">
      <section className="lane-intro compact"><div><span>TRUST & SAFETY</span><h1>Your account,<br /><em>your control.</em></h1><p>EZROME keeps reporting, creator rights, offline controls, and account deletion visible before launch.</p></div></section>
      {!isAuthenticated ? <Gate><></></Gate> : <div className="explore-grid">
        <article className="lane-blank"><ShieldCheck className="size-6" /><h2>Human review queue</h2><p>Reports are stored with an open, under-review, resolved, or dismissed state. Founder-controlled moderators make the final call.</p>{user?.role === "admin" && <Link className="loop-outline" href="/moderation">Open moderation dashboard <ArrowRight className="size-4" /></Link>}</article>
        <article className="lane-blank"><Trash2 className="size-6" /><h2>Delete my account</h2><p>Request deletion of your EZROME account and associated creator records. This is a request flow, not an irreversible instant action.</p><textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Optional reason" maxLength={500} /><button className="loop-primary" disabled={request.isPending || deletion.data?.status === "requested"} onClick={() => request.mutate({ reason })}>{deletion.data?.status === "requested" ? "Deletion requested" : "Request account deletion"}</button>{deletion.data?.status === "requested" && <button className="loop-outline" onClick={() => cancel.mutate()}>Cancel request</button>}</article>
        <article className="lane-blank"><Sparkles className="size-6" /><h2>Manage downloads</h2><p>Change offline permission for already-published signals. Rights-controlled signed access follows this setting.</p>{creatorVideos.data?.length ? creatorVideos.data.map((video) => <label className="rights-check" key={video.id}><input type="checkbox" checked={video.downloadable === 1} onChange={(event) => toggleDownload.mutate({ videoId: video.id, downloadable: event.target.checked })} /> <span>{video.title} · {video.downloadable === 1 ? "downloads on" : "downloads off"}</span></label>) : <span>No creator videos yet.</span>}</article>
      </div>}<Link href="/release-checklist" className="loop-outline">Open V1 release checklist <ArrowRight className="size-4" /></Link>
    </HubShell>
  );
}

export function PremiumPage() {
  const products = trpc.media.digitalProducts.useQuery();
  const entitlement = trpc.media.entitlement.useQuery(undefined, { enabled: true });
  const utils = trpc.useUtils();
  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const chooseTier = trpc.media.setPendingTier.useMutation({ onSuccess: (value) => { setPendingTier(value?.pendingTier || null); void utils.media.entitlement.invalidate(); toast.success("Tier saved as pending. No charge has been made."); }, onError: (error) => toast.error(error.message) });
  const clearTier = trpc.media.clearPendingTier.useMutation({ onSuccess: (value) => { setPendingTier(value?.pendingTier || null); void utils.media.entitlement.invalidate(); toast.success("Pending tier cleared."); }, onError: (error) => toast.error(error.message) });
  useEffect(() => { setPendingTier(entitlement.data?.pendingTier || null); }, [entitlement.data?.pendingTier]);
  return (
    <HubShell active="Explore">
      <section className="lane-intro compact"><div><span>DIGITAL EZROME FEATURES</span><h1>Charge for<br /><em>the signal.</em></h1><p>These are digital features consumed inside EZROME. Android purchases should use Google Play Billing when the Play build is launched; no checkout is active yet.</p></div></section>
      <div className="explore-grid">{products.data?.map((product) => <article className="lane-blank" key={product.id}><Sparkles className="size-6" /><span>{product.billing.replaceAll("_", " ").toUpperCase()}</span><h2>{product.name}</h2><p>{product.description}</p>{product.id === "signal_plus" || product.id === "founder_circle" ? <button className="loop-outline" onClick={() => chooseTier.mutate({ tier: product.id })}>{pendingTier === product.id ? "Pending activation" : "Choose tier"} <ArrowRight className="size-4" /></button> : <span className="account-link-loading">Included in a supported tier</span>}</article>)}</div>
      <div className="watch-description"><span>CURRENT PLAN</span><p>{entitlement.data ? `${entitlement.data.tier} · ${entitlement.data.status}` : "free · active"}. No charge has been made.</p>{entitlement.data?.pendingTier && <><small>Pending choice: {entitlement.data.pendingTier}</small><button className="loop-outline" onClick={() => clearTier.mutate()}>Cancel pending choice</button></>}</div><div className="watch-description"><span>SEPARATE CATEGORY</span><p>Physical goods, live events, consulting, sponsorships, or external services are not included in these digital entitlements and would need a separate commercial and policy review.</p></div>
    </HubShell>
  );
}

export function ModerationPage() {
  const reports = trpc.moderation.queue.useQuery(undefined);
  const update = trpc.moderation.update.useMutation({ onSuccess: () => { toast.success("Report state updated."); void reports.refetch(); }, onError: (error) => toast.error(error.message) });
  return (
    <HubShell active="Station">
      <section className="lane-intro compact"><div><span>FOUNDER MODERATION</span><h1>Review the<br /><em>open signals.</em></h1><p>Only founder-authorized moderators can move a report through its review states.</p></div></section>
      {reports.isLoading ? <div className="lane-blank">Loading moderation queue…</div> : <div className="notification-list">{reports.data?.length ? reports.data.map((report) => <article key={report.id}><Flag className="size-4" /><div><strong>#{report.id} · {report.reason}</strong><p>{report.details || "No additional details."}</p><small>{report.status}</small></div><select value={report.status} onChange={(event) => update.mutate({ id: report.id, status: event.target.value as "open" | "under_review" | "resolved" | "dismissed" })}><option value="open">Open</option><option value="under_review">Under review</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select></article>) : <div className="lane-blank"><ShieldCheck className="size-6" /><h2>Queue is clear.</h2><p>No community reports are waiting for founder review.</p></div>}</div>}
    </HubShell>
  );
}
