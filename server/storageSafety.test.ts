import { describe, expect, it } from "vitest";
import { encodeStorageKey } from "./storageSafety";

describe("storage safety encoder", () => {
  it("normalizes unsafe key segments", () => {
    const key = encodeStorageKey(["creator-media", 7, "../private file?.mp4"]);
    expect(key).toBe("creator-media/7/__private_file_.mp4");
    expect(key).not.toContain("..");
    expect(key).not.toContain(" ");
  });
});
