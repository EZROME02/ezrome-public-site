import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Download, Loader2, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { hasOfflineVideo, saveOfflineVideo } from "@/lib/offlineLibrary";

type DownloadableVideo = {
  id: number;
  title: string;
  format: "video" | "short";
  channelName: string;
  downloadable: number;
};

export function OfflineSaveControl({ video }: { video: DownloadableVideo }) {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const ticket = trpc.media.offlineTicket.useQuery({ id: video.id }, { enabled: false });

  useEffect(() => {
    if (!isAuthenticated || video.downloadable !== 1) return;
    hasOfflineVideo(video.id).then(setSaved).catch(() => setSaved(false));
  }, [isAuthenticated, video.downloadable, video.id]);

  if (video.downloadable !== 1) return null;

  const save = async () => {
    if (!isAuthenticated) {
      startLogin();
      return;
    }
    if (!navigator.onLine) {
      toast.error("Connect to the internet to save this video offline.");
      return;
    }
    setSaving(true);
    try {
      const result = await ticket.refetch();
      if (!result.data) throw new Error("Offline access is unavailable for this video.");
      const response = await fetch(result.data.url);
      if (!response.ok) throw new Error("The video could not be downloaded.");
      const blob = await response.blob();
      await saveOfflineVideo({ id: video.id, title: video.title, channelName: video.channelName, format: video.format, mimeType: result.data.mimeType, savedAt: Date.now(), bytes: blob.size }, blob);
      setSaved(true);
      toast.success("Saved to your offline library.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save this video offline.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="offline-save-control"><button className={`watch-action ${saved ? "is-saved" : ""}`} onClick={save} disabled={saving}>{saving ? <Loader2 className="size-4 animate-spin" /> : !navigator.onLine ? <WifiOff className="size-4" /> : <Download className="size-4" />}{saving ? "Saving…" : saved ? "Saved offline" : "Save offline"}</button><span>Rights-controlled · device only</span></div>;
}
