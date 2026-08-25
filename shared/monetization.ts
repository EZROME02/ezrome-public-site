export const DIGITAL_EZROME_PRODUCTS = [
  { id: "signal_plus", name: "EZROME Premium", billing: "google_play_billing", description: "Ad-light access, premium hip-hop and entertainment drops, and expanded offline library limits." },
  { id: "brainwork", name: "Brainwork Studio", billing: "google_play_billing", description: "AI Assistant credits, creator ideation tools, and premium productivity content." },
  { id: "rated_opinionz", name: "Rated Opinionz Intelligence", billing: "google_play_billing", description: "Premium football intelligence, reports, and analysis briefs." },
  { id: "founder_circle", name: "Founder Circle", billing: "google_play_billing", description: "Premium digital newsroom reports, early features, and founder-only content." },
] as const;

export const NON_DIGITAL_EZROME_OFFERINGS = ["merchandise", "live_events", "consulting", "sponsorships", "production_services"] as const;

export function isDigitalEzromeProduct(id: string) {
  return DIGITAL_EZROME_PRODUCTS.some((product) => product.id === id);
}
