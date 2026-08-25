export const MAX_VIDEO_BYTES = 10 * 1024 * 1024;
export const MAX_THUMBNAIL_BYTES = 4 * 1024 * 1024;

const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const THUMBNAIL_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function assertAllowedVideoUpload(contentType: string, byteLength: number) {
  if (!VIDEO_TYPES.has(contentType)) throw new Error("Use an MP4, WebM, or MOV video file.");
  if (byteLength <= 0 || byteLength > MAX_VIDEO_BYTES) throw new Error("Video files must be between 1 byte and 10 MB for this beta upload flow.");
}

export function assertAllowedThumbnailUpload(contentType: string, byteLength: number) {
  if (!THUMBNAIL_TYPES.has(contentType)) throw new Error("Use a JPG, PNG, or WebP thumbnail image.");
  if (byteLength <= 0 || byteLength > MAX_THUMBNAIL_BYTES) throw new Error("Thumbnail files must be between 1 byte and 4 MB.");
}

export function safeUploadName(name: string, fallback: string) {
  const extension = name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${fallback}.${extension || "bin"}`;
}
