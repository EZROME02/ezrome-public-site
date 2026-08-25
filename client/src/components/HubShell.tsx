import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Bell, Clapperboard, Compass, Film, MessageCircle, Plus, Radio, Search, Trophy, UserRound, Library } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";

const lanes = [
  ["/", "Watch", Clapperboard],
  ["/shorts", "Shorts", Film],
  ["/football", "Football", Trophy],
  ["/community", "Community", MessageCircle],
  ["/explore", "Explore", Compass],
  ["/library", "Library", Library],
] as const;

export function Mark() {
  return <span className="loop-mark" aria-hidden="true"><i /><i /><i /><b /></span>;
}

export function ChannelGlyph({ name, color = "#19E6D2" }: { name?: string | null; color?: string | null }) {
  return <span className="channel-glyph" style={{ "--channel-accent": color || "#19E6D2" } as React.CSSProperties}>{(name || "E").trim().slice(0, 1).toUpperCase()}</span>;
}

export function HubShell({ children, active }: { children: ReactNode; active?: string }) {
  const { user, loading, logout } = useAuth();
  const [location] = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);
  const station = trpc.media.station.useQuery(undefined, { enabled: Boolean(user) });
  const currentLane = active || "Watch";
  const laneCodes: Record<string, string> = { Watch: "01", Shorts: "02", Football: "03", Community: "04", Explore: "05", Create: "ST", Station: "CS", Notifications: "NT", Library: "06" };
  return <div className="loop-app" data-lane={currentLane}>
    <header className="loop-topbar">
      <Link href="/" className="loop-brand"><Mark /><span>EZROME</span><b>LOOP</b></Link>
      <div className="loop-search"><Search className="size-4" /><span>Search signals, channels, and stories</span><kbd>/</kbd></div>
      <div className="loop-actions">
        <Link href="/create" className="top-create"><Plus className="size-4" /> Create</Link>
        <Link href="/notifications" className="top-icon" aria-label="Notifications"><Bell className="size-4" /></Link>
        {loading ? <span className="top-avatar skeleton-dot" /> : user ? <div className="account-wrap"><button className="top-avatar account-trigger" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen} aria-label="Open creator account menu"><ChannelGlyph name={user.name} /></button>{accountOpen && <div className="account-popover"><span>CREATOR ACCOUNT</span><strong>{user.name || "EZROME Creator"}</strong>{station.data ? <Link href={`/channel/${station.data.handle}`} onClick={() => setAccountOpen(false)}>Open my station <ArrowRight className="size-3.5" /></Link> : <span className="account-link-loading">Preparing station…</span>}<button onClick={() => { setAccountOpen(false); void logout(); }}>Sign out</button></div>}</div> : <button className="signin-button" onClick={startLogin}>Sign in</button>}
      </div>
    </header>
    <aside className="loop-rail">
      <div className="rail-kicker"><Radio className="size-3" /> SIGNAL LANES</div>
      {lanes.map(([href, label, Icon]) => <Link href={href} key={label} className={`rail-link ${active === label || (href === "/" && location === "/") ? "rail-active" : ""}`}><Icon className="size-4" /><span>{label}</span></Link>)}
      <div className="rail-divider" />
      <Link href="/projects/ezrome-ai" className="rail-link"><UserRound className="size-4" /><span>EZROME AI</span></Link>
      <div className="rail-foot"><span className="live-pulse" /> CREATOR BETA<br />MEDIA / 10 MB MAX</div>
    </aside>
    <main className="loop-main"><div className="loop-lane-strap"><span>LANE / {laneCodes[currentLane] || "00"}</span><strong>{currentLane}</strong><i /><small>EZROME SIGNAL COMMONS</small></div>{children}<footer className="loop-footer"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/community-guidelines">Community Guidelines</Link><Link href="/copyright">Report rights issue</Link><Link href="/account-deletion">Delete account</Link></footer></main>
    <nav className="loop-mobile-dock" aria-label="Mobile navigation">
      {lanes.slice(0, 4).map(([href, label, Icon]) => <Link href={href} key={label} className={active === label ? "dock-active" : ""}><Icon className="size-4" /><span>{label}</span></Link>)}
      <Link href="/create"><Plus className="size-4" /><span>Create</span></Link><Link href="/library" className={active === "Library" ? "dock-active" : ""}><Library className="size-4" /><span>Library</span></Link>
    </nav>
  </div>;
}
