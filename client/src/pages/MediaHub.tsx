import { HubShell, ChannelGlyph } from "@/components/HubShell";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CirclePlay, Clapperboard, Compass, MessageCircle, Radio, Sparkles, Trophy, Upload } from "lucide-react";
import { Link } from "wouter";

function timeLabel(date: Date | string) {
  const diff = Math.max(0, Date.now() - new Date(date).getTime());
  const days = Math.floor(diff / 86_400_000);
  return days === 0 ? "Today" : days === 1 ? "1 day ago" : `${days} days ago`;
}

function VideoCard({ item }: { item: { id: number; title: string; description: string | null; thumbnailUrl: string | null; format: "video" | "short"; channelName: string; channelHandle: string; channelAccent: string; viewCount: number; publishedAt: Date } }) {
  return <article className="signal-card">
    <Link href={`/watch/${item.id}`} className="signal-thumbnail">{item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" /> : <div className="thumbnail-empty"><CirclePlay className="size-7" /><span>{item.format === "short" ? "SHORT SIGNAL" : "VIDEO SIGNAL"}</span></div>}<span className="media-lane">{item.format === "short" ? "SHORT" : "WATCH"}</span></Link>
    <div className="signal-card-info"><Link href={`/channel/${item.channelHandle}`}><ChannelGlyph name={item.channelName} color={item.channelAccent} /></Link><div><Link href={`/watch/${item.id}`} className="signal-title">{item.title}</Link><Link href={`/channel/${item.channelHandle}`} className="signal-channel">{item.channelName}</Link><p>{item.viewCount} views · {timeLabel(item.publishedAt)}</p></div></div>
  </article>;
}

export default function MediaHub() {
  const feed = trpc.media.feed.useQuery({ limit: 24 });
  const shorts = trpc.media.feed.useQuery({ format: "short", limit: 8 });
  const discussions = trpc.media.community.useQuery({ topic: "football" });
  return <HubShell active="Watch">
    <section className="hub-hero">
      <div className="hub-hero-copy"><div className="loop-eyebrow"><span className="live-pulse" /> EZROME SOCIAL & MEDIA HUB</div><h1>Publish a signal.<br /><em>Build a station.</em></h1><p>A culture-aware creator space for video, short-form work, football thinking, community conversation, and public projects.</p><div className="hero-hub-actions"><Link href="/create" className="loop-primary"><Upload className="size-4" /> Open creator studio</Link><Link href="/explore" className="loop-text-link">Explore signal lanes <ArrowRight className="size-4" /></Link></div></div>
      <div className="hub-hero-meter"><div className="meter-top"><span>LIVE BOARD</span><span>01 / 05</span></div><div className="meter-lanes"><i /><i /><i /><i /><i /></div><div className="meter-bottom"><span>WATCH</span><span>SHORTS</span><span>FOOTBALL</span><span>COMMUNITY</span><span>AI DESK</span></div></div>
    </section>

    <section className="hub-section"><div className="hub-section-title"><div><span>01 / WATCH</span><h2>New from the network.</h2></div><Link href="/explore">Open all signals <ArrowRight className="size-4" /></Link></div>{feed.isLoading ? <div className="hub-loading-grid"><i /><i /><i /></div> : feed.data?.length ? <div className="video-grid">{feed.data.map((item) => <VideoCard item={item} key={item.id} />)}</div> : <div className="hub-empty"><Clapperboard className="size-6" /><h3>No public signals yet.</h3><p>The watch lane is empty until creators publish their first media. Open a creator station to send the first one.</p><Link href="/create" className="loop-outline">Create a video <ArrowRight className="size-4" /></Link></div>}</section>

    <section className="hub-split-section"><div className="hub-section compact"><div className="hub-section-title"><div><span>02 / SHORTS</span><h2>Fast signal.</h2></div><Link href="/shorts">View lane <ArrowRight className="size-4" /></Link></div>{shorts.data?.length ? <div className="short-strip">{shorts.data.map((item) => <VideoCard item={item} key={item.id} />)}</div> : <div className="lane-empty"><Radio className="size-5" /><span>Vertical video is ready for the first creator signal.</span></div>}</div>
      <div className="hub-section compact football-panel"><div className="hub-section-title"><div><span>03 / FOOTBALL HUB</span><h2>Rated opinionz.</h2></div><Link href="/football">Open hub <ArrowRight className="size-4" /></Link></div>{discussions.data?.length ? <div className="football-post">{discussions.data[0]?.body}</div> : <div className="lane-empty"><Trophy className="size-5" /><span>Post the first match read, player analysis, or football debate.</span></div>}</div>
    </section>

    <section className="hub-lane-grid"><article><Sparkles className="size-5" /><span>AI DESK / ROADMAP</span><h3>Summaries with receipts.</h3><p>Video and post assistance will surface its source state and never pretend an unconnected model is active.</p></article><article><MessageCircle className="size-5" /><span>COMMUNITY / LIVE</span><h3>Posts that keep moving.</h3><p>Discuss football, creator work, and what is being built — then carry the thread into your station.</p><Link href="/community">Join discussion <ArrowRight className="size-4" /></Link></article><article><Compass className="size-5" /><span>CREATOR STATIONS</span><h3>More than a profile.</h3><p>Every signed-in creator gets a shareable channel record for videos, shorts, posts, and public work.</p></article></section>
  </HubShell>;
}
