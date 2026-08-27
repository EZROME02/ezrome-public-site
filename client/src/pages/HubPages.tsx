import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { ChannelGlyph, HubShell } from "@/components/HubShell";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Clapperboard,
  Compass,
  Film,
  Flag,
  MessageCircle,
  Play,
  Plus,
  Radio,
  Share2,
  Sparkles,
  Trophy,
  Upload,
  UserPlus,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  listOfflineVideos,
  getOfflineVideo,
  removeOfflineVideo,
  type OfflineVideo,
} from "@/lib/offlineLibrary";
import { OfflineSaveControl } from "@/components/OfflineSaveControl";
import {
  isWatchLater,
  toggleWatchLater,
  watchLaterChangeEvent,
} from "@/lib/watchLater";
import { toast } from "sonner";
import { Link, useLocation, useRoute } from "wouter";

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function Gate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading)
    return <div className="lane-blank">Loading your creator station…</div>;
  if (!isAuthenticated)
    return (
      <div className="lane-blank">
        <Radio className="size-6" />
        <h2>Your station is waiting.</h2>
        <p>
          Sign in to publish a signal, create a channel, follow creators, or
          join the discussion.
        </p>
        <button className="loop-primary" onClick={startLogin}>
          Sign in to continue <ArrowRight className="size-4" />
        </button>
      </div>
    );
  return <>{children}</>;
}

function WatchLaterButton({
  item,
}: {
  item: {
    id: number;
    title: string;
    channelName: string;
    format: "video" | "short";
  };
}) {
  const [saved, setSaved] = useState(() => isWatchLater(item.id));
  useEffect(() => {
    const eventName = watchLaterChangeEvent();
    const sync = () => setSaved(isWatchLater(item.id));
    window.addEventListener(eventName, sync);
    return () => window.removeEventListener(eventName, sync);
  }, [item.id]);
  const onToggle = () => {
    const added = toggleWatchLater(item);
    setSaved(added);
    toast.success(
      added ? "Saved to Watch Later." : "Removed from Watch Later."
    );
  };
  return (
    <button
      className={`tile-watch-later ${saved ? "is-saved" : ""}`}
      onClick={onToggle}
      aria-pressed={saved}
    >
      <Bookmark className="size-3.5" /> {saved ? "Saved" : "Watch later"}
    </button>
  );
}

function MediaTile({
  item,
  portrait = false,
}: {
  item: {
    id: number;
    title: string;
    thumbnailUrl: string | null;
    videoUrl: string;
    channelName: string;
    channelHandle: string;
    channelAccent: string;
    viewCount: number;
    publishedAt: Date;
    format: "video" | "short";
  };
  portrait?: boolean;
}) {
  return (
    <article className={portrait ? "short-tile" : "explore-tile"}>
      <Link href={`/watch/${item.id}`} className="tile-visual">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt="" />
        ) : (
          <div className="tile-placeholder">
            <Play className="size-6" />
            <span>{portrait ? "SHORT" : "VIDEO"}</span>
          </div>
        )}
        <span className="tile-count">{item.viewCount} views</span>
      </Link>
      <div className="tile-meta">
        <Link href={`/channel/${item.channelHandle}`}>
          <ChannelGlyph name={item.channelName} color={item.channelAccent} />
        </Link>
        <div>
          <Link href={`/watch/${item.id}`}>{item.title}</Link>
          <small>
            {item.channelName} · {formatDate(item.publishedAt)}
          </small>
          <WatchLaterButton item={item} />
        </div>
      </div>
    </article>
  );
}

function VerticalShortCard({
  item,
  index,
  onReport,
  reportPending,
}: {
  item: {
    id: number;
    title: string;
    description?: string | null;
    thumbnailUrl: string | null;
    videoUrl: string;
    channelName: string;
    channelHandle: string;
    channelAccent: string;
    viewCount: number;
    publishedAt: Date;
    format: "video" | "short";
    downloadable: number;
  };
  index: number;
  onReport: (id: number) => void;
  reportPending?: boolean;
}) {
  const [muted, setMuted] = useState(true);
  const [shared, setShared] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const share = async () => {
    const url = `${window.location.origin}/watch/${item.id}`;
    try {
      if (navigator.share)
        await navigator.share({
          title: item.title,
          text: `Watch ${item.title} on EZROME`,
          url,
        });
      else await navigator.clipboard.writeText(url);
      setShared(true);
      toast.success("Short link ready to share.");
    } catch {
      /* Native share cancellation is not an error. */
    }
  };
  return (
    <article className="vertical-short-card">
      <div className="vertical-short-media">
        <video
          ref={videoRef}
          className="vertical-short-video"
          src={item.videoUrl}
          poster={item.thumbnailUrl || undefined}
          muted={muted}
          loop
          playsInline
          preload={index < 2 ? "metadata" : "none"}
          aria-label={item.title}
        />
        <div className="vertical-short-gradient" />
        <div className="vertical-short-badge">
          <span>SHORT / {String(index + 1).padStart(2, "0")}</span>
          <strong>EZROME SIGNAL</strong>
        </div>
        <button
          className="vertical-short-mute"
          onClick={() => setMuted(value => !value)}
          aria-label={muted ? "Unmute short" : "Mute short"}
        >
          {muted ? (
            <VolumeX className="size-4" />
          ) : (
            <Volume2 className="size-4" />
          )}
        </button>
        <div className="vertical-short-copy">
          <Link
            href={`/channel/${item.channelHandle}`}
            className="vertical-short-channel"
          >
            <ChannelGlyph name={item.channelName} color={item.channelAccent} />
            <span>@{item.channelHandle}</span>
          </Link>
          <h2>{item.title}</h2>
          <p>{item.description || "Creator-owned short-form signal."}</p>
          <span className="vertical-short-source">
            Creator upload · rights state recorded · {item.viewCount} views
          </span>
        </div>
        <div className="vertical-short-actions">
          <button onClick={share} className={shared ? "is-active" : ""}>
            <Share2 className="size-4" />
            <span>{shared ? "Shared" : "Share"}</span>
          </button>
          <button
            onClick={() => onReport(item.id)}
            disabled={reportPending}
            aria-label={`Report ${item.title}`}
          >
            <Flag className="size-4" />
            <span>Report</span>
          </button>
          <Link href={`/watch/${item.id}`}>
            <Play className="size-4" />
            <span>Watch</span>
          </Link>
        </div>
      </div>
      <OfflineSaveControl video={item} />
    </article>
  );
}

export function ShortsLane() {
  const shorts = trpc.media.feed.useQuery({ format: "short", limit: 36 });
  const report = trpc.media.report.useMutation({
    onSuccess: () => toast.success("Report submitted for human review."),
    onError: error => toast.error(error.message),
  });
  const feedRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = feedRef.current;
    if (!root || !shorts.data?.length) return;
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video"));
    if (typeof IntersectionObserver === "undefined") {
      videos[0]?.play().catch(() => undefined);
      return () => videos.forEach(video => video.pause());
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.7)
            void video.play().catch(() => undefined);
          else video.pause();
        });
      },
      { root, threshold: [0, 0.7, 1] }
    );
    videos.forEach(video => observer.observe(video));
    return () => {
      observer.disconnect();
      videos.forEach(video => video.pause());
    };
  }, [shorts.data]);
  return (
    <HubShell active="Shorts">
      <section className="lane-intro">
        <div>
          <span>02 / SHORTS / VIEW FIRST</span>
          <h1>
            Scroll the
            <br />
            <em>signal stream.</em>
          </h1>
          <p>
            Open EZROME to watch first. Swipe through creator-owned shorts,
            follow the context, and save rights-cleared signals for limited
            offline playback.
          </p>
        </div>
        <div className="lane-intro-note">
          <Video className="size-5" /> VERTICAL VIEWER
          <br />
          MUTED AUTOPLAY / TAP FOR SOUND
        </div>
      </section>
      <section className="shorts-viewer">
        <div className="shorts-viewer-head">
          <div>
            <span>THE LOOP / FOR YOU</span>
            <h2>One short at a time.</h2>
          </div>
          <span className="shorts-viewer-hint">
            <Bookmark className="size-4" /> Save what you want to revisit
          </span>
        </div>
        {shorts.isLoading ? (
          <div className="lane-blank wide" aria-live="polite">
            <Film className="size-7 animate-pulse" />
            <h2>Loading the signal stream.</h2>
            <p>Finding published shorts and preparing the viewer.</p>
          </div>
        ) : shorts.isError ? (
          <div className="lane-blank wide" role="alert">
            <Film className="size-7" />
            <h2>The stream is unavailable.</h2>
            <p>
              Check your connection and try again. Your saved device library is
              still available offline.
            </p>
            <button
              className="loop-outline"
              onClick={() => void shorts.refetch()}
            >
              Try again <ArrowRight className="size-4" />
            </button>
          </div>
        ) : shorts.data?.length ? (
          <div
            ref={feedRef}
            className="shorts-feed"
            aria-label="EZROME vertical short-video feed"
          >
            {shorts.data.map((item, index) => (
              <VerticalShortCard
                key={item.id}
                item={item}
                index={index}
                reportPending={report.isPending}
                onReport={id =>
                  report.mutate({
                    videoId: id,
                    reason: "other",
                    details: "Viewer submitted this short for review.",
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="lane-blank wide" role="status">
            <Film className="size-7" />
            <h2>No shorts have been published.</h2>
            <p>
              The viewer is ready. Creator-owned shorts will appear here as they
              are published.
            </p>
            <Link href="/explore" className="loop-outline">
              Browse all signals <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>
    </HubShell>
  );
}

function DiscussionComposer({
  fixedTopic,
}: {
  fixedTopic?: "community" | "football";
}) {
  const { isAuthenticated } = useAuth();
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState<"community" | "football" | "build">(
    fixedTopic || "community"
  );
  const utils = trpc.useUtils();
  const post = trpc.media.post.useMutation({
    onSuccess: () => {
      setBody("");
      utils.media.community.invalidate();
      toast.success("Your signal is live in the community lane.");
    },
    onError: error => toast.error(error.message),
  });
  if (!isAuthenticated)
    return (
      <div className="composer-locked">
        <Sparkles className="size-4" /> Sign in to post a signal, question,
        match read, or build note.<button onClick={startLogin}>Sign in</button>
      </div>
    );
  return (
    <div className="signal-composer">
      <textarea
        value={body}
        onChange={event => setBody(event.target.value)}
        maxLength={1000}
        placeholder="Share a thought worth following…"
      />
      <div>
        <div className="topic-toggle">
          {(["community", "football", "build"] as const).map(item => (
            <button
              key={item}
              className={topic === item ? "topic-active" : ""}
              onClick={() => setTopic(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          className="loop-primary"
          disabled={body.trim().length < 3 || post.isPending}
          onClick={() => post.mutate({ body, topic })}
        >
          {post.isPending ? "Publishing…" : "Publish signal"}{" "}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function DiscussionFeed({
  topic,
}: {
  topic?: "community" | "football" | "build";
}) {
  const feed = trpc.media.community.useQuery(topic ? { topic } : undefined);
  if (!feed.data?.length)
    return (
      <div className="discussion-empty">
        <MessageCircle className="size-5" />
        <p>
          No posts in this lane yet. The first thoughtful signal sets the tone.
        </p>
      </div>
    );
  return (
    <div className="discussion-feed">
      {feed.data.map(post => (
        <article className="discussion-card" key={post.id}>
          <div className="discussion-head">
            <ChannelGlyph name={post.channelName} color={post.channelAccent} />
            <div>
              <Link href={`/channel/${post.channelHandle}`}>
                {post.channelName}
              </Link>
              <small>
                {post.topic} · {formatDate(post.createdAt)}
              </small>
            </div>
            <span className={`post-topic topic-${post.topic}`}>
              {post.topic}
            </span>
          </div>
          <p>{post.body}</p>
          <div className="discussion-stats">
            <span>
              <Sparkles className="size-3.5" /> {post.reactionCount}
            </span>
            <span>
              <MessageCircle className="size-3.5" /> {post.commentCount}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CommunityLane() {
  return (
    <HubShell active="Community">
      <section className="community-layout">
        <div className="community-main">
          <div className="lane-intro compact">
            <div>
              <span>04 / COMMUNITY</span>
              <h1>
                Conversation is
                <br />
                <em>part of the work.</em>
              </h1>
            </div>
          </div>
          <DiscussionComposer />
          <DiscussionFeed />
        </div>
        <aside className="community-side">
          <span>COMMUNITY STANDARD</span>
          <h3>Own your signal.</h3>
          <p>
            Post work you have the right to share. Do not publish private
            information, harassment, or unlawful material. More reporting and
            moderation controls are planned for the production release.
          </p>
          <Link href="/football">
            Enter Football Hub <ArrowRight className="size-4" />
          </Link>
        </aside>
      </section>
    </HubShell>
  );
}

export function FootballHub() {
  return (
    <HubShell active="Football">
      <section className="football-hero">
        <div>
          <span>03 / FOOTBALL HUB</span>
          <h1>
            Rated Opinionz.
            <br />
            <em>Read the game.</em>
          </h1>
          <p>
            A space for thoughtful football news, player analysis, match reads,
            and opinion — with context over noise.
          </p>
        </div>
        <div className="football-board">
          <span>RATED OPINIONZ BOT</span>
          <strong>
            CONNECTED
            <br />
            WHEN CONFIGURED
          </strong>
          <p>
            The assistant lane will summarize sources and clearly label
            analysis. It is not active in this beta build yet.
          </p>
        </div>
      </section>
      <section className="football-layout">
        <div>
          <div className="hub-section-title">
            <div>
              <span>FOOTBALL / COMMUNITY</span>
              <h2>Current reads.</h2>
            </div>
          </div>
          <DiscussionComposer fixedTopic="football" />
          <DiscussionFeed topic="football" />
        </div>
        <aside className="football-side">
          <Trophy className="size-5" />
          <h3>Build the football record.</h3>
          <p>
            Creator channels can post analysis now. Live scores, news providers,
            player data, and AI summaries need connected data sources before
            they can be shown as current information.
          </p>
        </aside>
      </section>
    </HubShell>
  );
}

export function ExploreLane() {
  const feed = trpc.media.feed.useQuery({ limit: 48 });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Hip-hop", "Football", "Culture", "Build"];
  const filtered = useMemo(
    () =>
      (feed.data || []).filter(item => {
        const haystack = `${item.title} ${item.channelName}`.toLowerCase();
        const matchesQuery =
          !query.trim() || haystack.includes(query.trim().toLowerCase());
        const matchesCategory =
          category === "All" || haystack.includes(category.toLowerCase());
        return matchesQuery && matchesCategory;
      }),
    [feed.data, query, category]
  );
  return (
    <HubShell active="Explore">
      <section className="lane-intro">
        <div>
          <span>05 / EXPLORE / VIEW + FIND</span>
          <h1>
            Find a new
            <br />
            <em>signal station.</em>
          </h1>
          <p>
            Search public creator uploads across the EZROME network. Browse by
            culture, football, hip-hop, or build notes, then open a full watch
            page or save a rights-cleared signal.
          </p>
        </div>
        <Link href="/create" className="loop-primary">
          <Plus className="size-4" /> Start a station
        </Link>
      </section>
      <section className="explore-tools">
        <label>
          <span>SEARCH THE NETWORK</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search videos and creators"
            aria-label="Search videos and creators"
          />
        </label>
        <div className="explore-filters" aria-label="Filter videos by category">
          {categories.map(item => (
            <button
              key={item}
              className={category === item ? "is-active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
      {filtered.length ? (
        <section className="explore-grid">
          {filtered.map(item => (
            <MediaTile key={item.id} item={item} />
          ))}
        </section>
      ) : (
        <div className="lane-blank wide">
          <Compass className="size-7" />
          <h2>
            {feed.data?.length
              ? "No matching signals."
              : "Discovery starts with creators."}
          </h2>
          <p>
            {feed.data?.length
              ? "Try another search or category."
              : "There are no public videos to explore yet. Publish the first signal or invite a creator to open their station."}
          </p>
          {feed.data?.length ? (
            <button
              className="loop-outline"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          ) : (
            <Link href="/create" className="loop-outline">
              Publish a signal <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      )}
    </HubShell>
  );
}

export function WatchPage() {
  const [, params] = useRoute("/watch/:id");
  const id = Number(params?.id);
  const video = trpc.media.watch.useQuery(
    { id },
    { enabled: Number.isFinite(id) && id > 0 }
  );
  const share = trpc.media.share.useMutation();
  const report = trpc.media.report.useMutation({
    onSuccess: () => toast.success("Report submitted for human review."),
    onError: error => toast.error(error.message),
  });
  const onShare = async () => {
    if (!video.data) return;
    const url = `${window.location.origin}/watch/${video.data.id}`;
    try {
      if (navigator.share)
        await navigator.share({ title: video.data.title, url });
      else await navigator.clipboard.writeText(url);
      share.mutate({ id: video.data.id });
      toast.success("Share link ready.");
    } catch {
      /* The user cancelled native share; no action needed. */
    }
  };
  if (video.isLoading)
    return (
      <HubShell active="Watch">
        <div className="lane-blank">Loading this signal…</div>
      </HubShell>
    );
  if (!video.data)
    return (
      <HubShell active="Watch">
        <div className="lane-blank">
          <Clapperboard className="size-6" />
          <h2>This video record is unavailable.</h2>
          <Link href="/" className="loop-outline">
            Return to Watch <ArrowLeft className="size-4" />
          </Link>
        </div>
      </HubShell>
    );
  return (
    <HubShell active="Watch">
      <section className="watch-layout">
        <div className="watch-main">
          <video
            className="watch-player"
            controls
            src={video.data.videoUrl}
            poster={video.data.thumbnailUrl || undefined}
          />
          <OfflineSaveControl video={video.data} />
          <div className="watch-meta">
            <span>
              {video.data.format === "short" ? "SHORT SIGNAL" : "VIDEO SIGNAL"}
            </span>
            <h1>{video.data.title}</h1>
            <div>
              <Link
                href={`/channel/${video.data.channelHandle}`}
                className="watch-channel"
              >
                <ChannelGlyph
                  name={video.data.channelName}
                  color={video.data.channelAccent}
                />
                <span>
                  {video.data.channelName}
                  <small>@{video.data.channelHandle}</small>
                </span>
              </Link>
              <button onClick={onShare} className="watch-action">
                <Share2 className="size-4" /> Share
              </button>
              <button
                onClick={() =>
                  report.mutate({
                    videoId: video.data!.id,
                    reason: "other",
                    details: "Viewer submitted this signal for review.",
                  })
                }
                className="watch-action"
                disabled={report.isPending}
              >
                <Flag className="size-4" />{" "}
                {report.isPending ? "Reporting…" : "Report"}
              </button>
            </div>
          </div>
          <div className="watch-description">
            <span>VIDEO RECORD / {formatDate(video.data.publishedAt)}</span>
            <p>
              {video.data.description ||
                "This creator has not added a description yet."}
            </p>
          </div>
        </div>
        <aside className="watch-aside">
          <span>CREATOR STATION</span>
          <h3>Keep the signal moving.</h3>
          <p>
            Follow this creator’s public work, shorts, community notes, and
            future records.
          </p>
          <Link
            href={`/channel/${video.data.channelHandle}`}
            className="loop-outline"
          >
            Open station <ArrowRight className="size-4" />
          </Link>
        </aside>
      </section>
    </HubShell>
  );
}

export function ChannelPage() {
  const [, params] = useRoute("/channel/:handle");
  const channel = trpc.media.channel.useQuery(
    { handle: params?.handle || "" },
    { enabled: Boolean(params?.handle) }
  );
  if (channel.isLoading)
    return (
      <HubShell active="Station">
        <div className="lane-blank">Loading creator station…</div>
      </HubShell>
    );
  if (!channel.data)
    return (
      <HubShell active="Station">
        <div className="lane-blank">
          <Radio className="size-6" />
          <h2>This station is not public yet.</h2>
          <Link href="/" className="loop-outline">
            Return to the network
          </Link>
        </div>
      </HubShell>
    );
  const { channel: record, videos } = channel.data;
  return (
    <HubShell active="Station">
      <section
        className="channel-hero"
        style={
          { "--station-accent": record.accentColor } as React.CSSProperties
        }
      >
        <ChannelGlyph name={record.displayName} color={record.accentColor} />
        <div>
          <span>CREATOR STATION / @{record.handle}</span>
          <h1>{record.displayName}</h1>
          <p>
            {record.bio || "This creator has not added a station note yet."}
          </p>
        </div>
        <div className="channel-hero-actions">
          <button className="loop-primary">
            <UserPlus className="size-4" /> Follow station
          </button>
          <span>CHANNEL / ACTIVE</span>
        </div>
      </section>
      <section className="channel-content">
        <div className="hub-section-title">
          <div>
            <span>PUBLIC MEDIA</span>
            <h2>Signals from this station.</h2>
          </div>
          <Link href="/create">
            Create your signal <ArrowRight className="size-4" />
          </Link>
        </div>
        {videos.length ? (
          <div className="explore-grid">
            {videos.map(item => (
              <MediaTile
                key={item.id}
                item={{
                  ...item,
                  channelName: record.displayName,
                  channelHandle: record.handle,
                  channelAccent: record.accentColor,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="lane-blank wide">
            <Upload className="size-6" />
            <h2>No public media yet.</h2>
            <p>
              This channel exists, but its first video or short has not been
              published.
            </p>
          </div>
        )}
      </section>
    </HubShell>
  );
}

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function UploadStudio() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<"video" | "short">("video");
  const [visibility, setVisibility] = useState<"public" | "unlisted">("public");
  const [downloadable, setDownloadable] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [rights, setRights] = useState(false);
  const publish = trpc.media.publish.useMutation({
    onSuccess: ({ id }) => {
      toast.success("Your signal has been published.");
      setLocation(`/watch/${id}`);
    },
    onError: error => toast.error(error.message),
  });
  const submit = async () => {
    if (!videoFile) return toast.error("Choose a video file first.");
    if (!rights)
      return toast.error(
        "Confirm that you have the rights to publish this media."
      );
    if (videoFile.size > 10 * 1024 * 1024)
      return toast.error("This beta accepts videos up to 10 MB.");
    const video = {
      name: videoFile.name,
      type: videoFile.type,
      base64: await toBase64(videoFile),
    };
    const thumbnail = thumbnailFile
      ? {
          name: thumbnailFile.name,
          type: thumbnailFile.type,
          base64: await toBase64(thumbnailFile),
        }
      : undefined;
    publish.mutate({
      title,
      description,
      format,
      visibility,
      downloadable,
      video,
      thumbnail,
    });
  };
  return (
    <HubShell active="Create">
      {!isAuthenticated ? (
        <Gate>
          <></>
        </Gate>
      ) : (
        <section className="studio-layout">
          <div className="studio-head">
            <span>CREATOR STUDIO / BETA</span>
            <h1>
              Make the
              <br />
              <em>next signal.</em>
            </h1>
            <p>
              Upload original or licensed media for your creator station. This
              direct beta flow accepts MP4, WebM, or MOV files up to 10 MB. It
              does not transcode, auto-moderate, or host livestreams.
            </p>
          </div>
          <form
            className="studio-form"
            onSubmit={event => {
              event.preventDefault();
              submit();
            }}
          >
            <label>
              Signal title
              <input
                value={title}
                onChange={event => setTitle(event.target.value)}
                minLength={3}
                maxLength={120}
                placeholder="Give the video a clear name"
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={description}
                onChange={event => setDescription(event.target.value)}
                maxLength={2000}
                placeholder="Add context, ownership notes, or a call to action"
              />
            </label>
            <div className="studio-grid">
              <label>
                Format
                <select
                  value={format}
                  onChange={event =>
                    setFormat(event.target.value as "video" | "short")
                  }
                >
                  <option value="video">Video</option>
                  <option value="short">Short</option>
                </select>
              </label>
              <label>
                Visibility
                <select
                  value={visibility}
                  onChange={event =>
                    setVisibility(event.target.value as "public" | "unlisted")
                  }
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </label>
            </div>
            <label className="file-label">
              Video file
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={event =>
                  setVideoFile(event.target.files?.[0] || null)
                }
                required
              />
              <span>
                {videoFile
                  ? `${videoFile.name} · ${(videoFile.size / 1024 / 1024).toFixed(1)} MB`
                  : "MP4, WebM, or MOV · 10 MB max"}
              </span>
            </label>
            <label className="file-label">
              Thumbnail{" "}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={event =>
                  setThumbnailFile(event.target.files?.[0] || null)
                }
              />
              <span>
                {thumbnailFile
                  ? thumbnailFile.name
                  : "Optional JPG, PNG, or WebP · 4 MB max"}
              </span>
            </label>
            <label className="rights-check">
              <input
                type="checkbox"
                checked={downloadable}
                onChange={event => setDownloadable(event.target.checked)}
              />{" "}
              <span>
                Allow signed, device-only offline downloads for viewers.
              </span>
            </label>
            <label className="rights-check">
              <input
                type="checkbox"
                checked={rights}
                onChange={event => setRights(event.target.checked)}
              />{" "}
              <span>
                I own this media or have permission to publish it, and it does
                not contain unlawful, exploitative, or private content.
              </span>
            </label>
            <button
              className="loop-primary studio-submit"
              disabled={publish.isPending || title.trim().length < 3}
            >
              {publish.isPending ? "Publishing…" : "Publish to station"}{" "}
              <ArrowRight className="size-4" />
            </button>
          </form>
        </section>
      )}
    </HubShell>
  );
}

export function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const list = trpc.media.notifications.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  return (
    <HubShell active="Notifications">
      <section className="notifications-page">
        <div className="lane-intro compact">
          <div>
            <span>NOTIFICATIONS</span>
            <h1>
              Keep up with
              <br />
              <em>your signal.</em>
            </h1>
          </div>
        </div>
        {!isAuthenticated ? (
          <Gate>
            <></>
          </Gate>
        ) : list.data?.length ? (
          <div className="notification-list">
            {list.data.map(item => (
              <article key={item.id}>
                <Bell className="size-4" />
                <div>
                  <p>{item.message}</p>
                  <small>{formatDate(item.createdAt)}</small>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="lane-blank wide">
            <Bell className="size-6" />
            <h2>No station alerts yet.</h2>
            <p>
              Follow, reaction, comment, and system notifications will land here
              as the network grows.
            </p>
          </div>
        )}
      </section>
    </HubShell>
  );
}
