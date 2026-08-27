import { useAuth } from "@/_core/hooks/useAuth";
import {
  getOfflineVideo,
  listOfflineVideos,
  removeOfflineVideo,
  type OfflineVideo,
} from "@/lib/offlineLibrary";
import {
  listWatchLater,
  removeWatchLater,
  type WatchLaterItem,
  watchLaterChangeEvent,
} from "@/lib/watchLater";
import {
  ArrowLeft,
  Download,
  Loader2,
  Play,
  Trash2,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { HubShell } from "@/components/HubShell";
import { Gate } from "@/pages/HubPages";
import { toast } from "sonner";

const bytesLabel = (bytes: number) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function OfflineLibraryPage() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<OfflineVideo[]>([]);
  const [online, setOnline] = useState(true);
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const refresh = () =>
    listOfflineVideos()
      .then(setItems)
      .catch(() => setItems([]));
  useEffect(() => {
    setOnline(navigator.onLine);
    refresh();
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);
  useEffect(() => {
    const sync = () => setWatchLater(listWatchLater());
    sync();
    const eventName = watchLaterChangeEvent();
    window.addEventListener(eventName, sync);
    return () => window.removeEventListener(eventName, sync);
  }, []);
  const remove = async (id: number) => {
    await removeOfflineVideo(id);
    setItems(current => current.filter(item => item.id !== id));
    toast.success("Removed from this device.");
  };
  return (
    <HubShell active="Library">
      <section className="library-page">
        <div className="lane-intro compact">
          <div>
            <span>06 / LIBRARY</span>
            <h1>
              Your saved
              <br />
              <em>signals.</em>
            </h1>
            <p>
              Downloaded videos stay on this device for offline playback. They
              are not re-uploaded or shared by Ezrome.
            </p>
          </div>
          <div
            className={`offline-status ${online ? "is-online" : "is-offline"}`}
          >
            {online ? (
              <Download className="size-4" />
            ) : (
              <WifiOff className="size-4" />
            )}{" "}
            {online ? "SYNC READY" : "OFFLINE MODE"}
          </div>
        </div>
        <section className="watch-later-panel">
          <div className="hub-section-title">
            <div>
              <span>WATCH LATER / DEVICE LIST</span>
              <h2>Keep the signal moving.</h2>
            </div>
            <Link href="/explore">
              Find more <ArrowLeft className="size-4" />
            </Link>
          </div>
          {watchLater.length ? (
            <div className="watch-later-list">
              {watchLater.map(item => (
                <article className="watch-later-row" key={item.id}>
                  <Link href={`/watch/${item.id}`} className="watch-later-play">
                    <Play className="size-4" />
                  </Link>
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {item.channelName} · {item.format.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => removeWatchLater(item.id)}
                    aria-label={`Remove ${item.title} from Watch Later`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className="watch-later-empty">
              Save videos from Explore to build a private, device-local queue.
              Watch Later does not copy or redistribute the media.
            </p>
          )}
        </section>
        {!isAuthenticated ? (
          <Gate>
            <></>
          </Gate>
        ) : items.length ? (
          <div className="offline-list">
            {items.map(item => (
              <article key={item.id} className="offline-row">
                <Link href={`/offline/${item.id}`} className="offline-play">
                  <Play className="size-5" />
                </Link>
                <div className="offline-row-copy">
                  <strong>{item.title}</strong>
                  <span>
                    {item.channelName} · {item.format.toUpperCase()} ·{" "}
                    {bytesLabel(item.bytes)}
                  </span>
                </div>
                <button
                  className="offline-remove"
                  onClick={() => void remove(item.id)}
                  aria-label={`Remove ${item.title} from this device`}
                >
                  <Trash2 className="size-4" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="lane-blank wide">
            <Download className="size-7" />
            <h2>No saved signals yet.</h2>
            <p>
              Open a published video while connected, then choose Save offline.
              Download access is limited to media its creator has marked
              available.
            </p>
            <Link href="/" className="loop-outline">
              Find a signal <ArrowLeft className="size-4" />
            </Link>
          </div>
        )}
        <p className="library-note">
          <span>DEVICE LIBRARY / PRIVATE</span> Offline playback has limited
          exposure: discovery, sharing, comments, notifications, and fresh
          newsroom content require a connection.
        </p>
      </section>
    </HubShell>
  );
}

export function OfflineWatchPage() {
  const [, params] = useRoute("/offline/:id");
  const { isAuthenticated } = useAuth();
  const [record, setRecord] = useState<{
    metadata: OfflineVideo;
    blob: Blob;
  }>();
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let objectUrl: string | undefined;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    const id = Number(params?.id);
    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }
    getOfflineVideo(id)
      .then(value => {
        setRecord(value);
        if (value) {
          objectUrl = URL.createObjectURL(value.blob);
          setUrl(objectUrl);
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isAuthenticated, params?.id]);
  return (
    <HubShell active="Library">
      {!isAuthenticated ? (
        <Gate>
          <></>
        </Gate>
      ) : loading ? (
        <div className="lane-blank">
          <Loader2 className="size-6 animate-spin" />
          Loading device library…
        </div>
      ) : !record || !url ? (
        <div className="lane-blank">
          <WifiOff className="size-6" />
          <h2>This offline copy is unavailable.</h2>
          <Link href="/library" className="loop-outline">
            Return to library <ArrowLeft className="size-4" />
          </Link>
        </div>
      ) : (
        <section className="offline-watch">
          <Link href="/library" className="back-link">
            <ArrowLeft className="size-4" /> Library
          </Link>
          <video className="watch-player" controls autoPlay src={url} />
          <div className="offline-watch-meta">
            <span>OFFLINE COPY / DEVICE ONLY</span>
            <h1>{record.metadata.title}</h1>
            <p>
              {record.metadata.channelName} · Saved{" "}
              {new Date(record.metadata.savedAt).toLocaleDateString()}
            </p>
            <small>
              <WifiOff className="size-3.5" /> Network features are unavailable
              while you are offline.
            </small>
          </div>
        </section>
      )}
    </HubShell>
  );
}
