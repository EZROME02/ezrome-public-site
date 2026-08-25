export function assertOfflineEligible(input: { authenticated: boolean; downloadable: number; status: string; visibility: string }) {
  if (!input.authenticated) throw new Error("Sign in to save videos for offline playback.");
  if (input.downloadable !== 1 || input.status !== "published" || input.visibility !== "public") throw new Error("This video is not available for offline playback.");
  return true as const;
}
