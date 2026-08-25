import { describe, expect, it } from "vitest";
import { assertAllowedThumbnailUpload, assertAllowedVideoUpload, MAX_VIDEO_BYTES, safeUploadName } from "./videoValidation";

describe("creator media validation", () => {
  it("accepts an MP4 within the beta upload limit", () => {
    expect(() => assertAllowedVideoUpload("video/mp4", 2048)).not.toThrow();
  });

  it("rejects video uploads over the beta limit", () => {
    expect(() => assertAllowedVideoUpload("video/mp4", MAX_VIDEO_BYTES + 1)).toThrow(/10 MB/);
  });

  it("rejects non-image thumbnail types", () => {
    expect(() => assertAllowedThumbnailUpload("video/mp4", 100)).toThrow(/JPG/);
  });

  it("creates a safe fallback upload name", () => {
    expect(safeUploadName("creator reel.MP4", "video")).toBe("video.mp4");
  });
});
