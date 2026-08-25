export function encodeStorageKey(parts: Array<string | number>) {
  const encoded = parts.map((part) => String(part).normalize("NFKC").replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.{2,}/g, "_").slice(0, 120));
  return encoded.join("/");
}
