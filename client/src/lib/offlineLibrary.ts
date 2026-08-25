export type OfflineVideo = {
  id: number;
  title: string;
  channelName: string;
  format: "video" | "short";
  mimeType: string;
  savedAt: number;
  bytes: number;
};

type StoredVideo = OfflineVideo & { blob: Blob };

const DB_NAME = "ezrome-offline-library";
const STORE_NAME = "videos";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Offline library is unavailable in this browser."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error || new Error("Could not open offline library."));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
  });
}

export async function listOfflineVideos(): Promise<OfflineVideo[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onerror = () => reject(request.error || new Error("Could not read offline library."));
    request.onsuccess = () => resolve((request.result as StoredVideo[]).sort((a, b) => b.savedAt - a.savedAt).map(({ blob: _blob, ...item }) => item));
  });
}

export async function hasOfflineVideo(id: number): Promise<boolean> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getKey(id);
    request.onerror = () => reject(request.error || new Error("Could not check offline library."));
    request.onsuccess = () => resolve(request.result !== undefined);
  });
}

export async function saveOfflineVideo(video: OfflineVideo, blob: Blob): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const record: StoredVideo = { ...video, blob, bytes: blob.size };
    const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(record);
    request.onerror = () => reject(request.error || new Error("Could not save video offline."));
    request.onsuccess = () => resolve();
  });
}

export async function getOfflineVideo(id: number): Promise<{ metadata: OfflineVideo; blob: Blob } | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
    request.onerror = () => reject(request.error || new Error("Could not load offline video."));
    request.onsuccess = () => {
      const record = request.result as StoredVideo | undefined;
      if (!record) return resolve(undefined);
      const { blob, ...metadata } = record;
      resolve({ metadata, blob });
    };
  });
}

export async function removeOfflineVideo(id: number): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
    request.onerror = () => reject(request.error || new Error("Could not remove video from offline library."));
    request.onsuccess = () => resolve();
  });
}
