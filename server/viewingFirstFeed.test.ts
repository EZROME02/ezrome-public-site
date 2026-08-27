import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/HubPages.tsx"),
  "utf8"
);
const librarySource = readFileSync(
  resolve(process.cwd(), "client/src/pages/OfflineLibrary.tsx"),
  "utf8"
);
const styleSource = readFileSync(
  resolve(process.cwd(), "client/src/hub.css"),
  "utf8"
);

describe("viewing-first media hub", () => {
  it("keeps the vertical viewer behavior and safe viewer actions in the page source", () => {
    expect(pageSource).toContain("IntersectionObserver");
    expect(styleSource).toContain("scroll-snap-type: y mandatory");
    expect(pageSource).toContain("OfflineSaveControl");
    expect(pageSource).toContain(
      'details: "Viewer submitted this short for review."'
    );
    expect(pageSource).toContain("navigator.share");
    expect(pageSource).toContain("rights-cleared signals");
    expect(pageSource).toContain("shorts.isLoading");
    expect(pageSource).toContain("shorts.isError");
    expect(pageSource).toContain("shorts.refetch");
    expect(pageSource).toContain('typeof IntersectionObserver === "undefined"');
    expect(pageSource).toContain("reportPending");
  });

  it("keeps discovery search and category controls available", () => {
    expect(pageSource).toContain("SEARCH THE NETWORK");
    expect(pageSource).toContain('"Hip-hop"');
    expect(pageSource).toContain('"Football"');
    expect(pageSource).toContain("No matching signals.");
    expect(pageSource).toContain("WatchLaterButton");
    expect(pageSource).toContain("toggleWatchLater");
  });

  it("defines responsive viewer and filter styles", () => {
    expect(styleSource).toContain(".shorts-feed");
    expect(styleSource).toContain("scroll-snap-type: y mandatory");
    expect(styleSource).toContain(".vertical-short-actions");
    expect(styleSource).toContain(".explore-filters button.is-active");
    expect(styleSource).toContain(".watch-later-panel");
    expect(librarySource).toContain("WATCH LATER / DEVICE LIST");
    expect(styleSource).toContain("prefers-reduced-motion: reduce");
  });
});
