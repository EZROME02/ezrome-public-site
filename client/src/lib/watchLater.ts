export type WatchLaterItem = {
  id: number;
  title: string;
  channelName: string;
  format: "video" | "short";
  savedAt: number;
};

const STORAGE_KEY = "ezrome-watch-later";
const CHANGE_EVENT = "ezrome-watch-later-change";

function readItems(): WatchLaterItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || "[]"
    ) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is WatchLaterItem =>
          Boolean(
            item &&
              typeof item === "object" &&
              "id" in item &&
              "title" in item &&
              "channelName" in item &&
              "format" in item
          )
        )
      : [];
  } catch {
    return [];
  }
}

function writeItems(items: WatchLaterItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function listWatchLater(): WatchLaterItem[] {
  return readItems().sort((a, b) => b.savedAt - a.savedAt);
}

export function isWatchLater(id: number): boolean {
  return readItems().some(item => item.id === id);
}

export function toggleWatchLater(
  item: Omit<WatchLaterItem, "savedAt">
): boolean {
  const items = readItems();
  const exists = items.some(saved => saved.id === item.id);
  writeItems(
    exists
      ? items.filter(saved => saved.id !== item.id)
      : [...items, { ...item, savedAt: Date.now() }]
  );
  return !exists;
}

export function removeWatchLater(id: number) {
  writeItems(readItems().filter(item => item.id !== id));
}

export function watchLaterChangeEvent(): string {
  return CHANGE_EVENT;
}
