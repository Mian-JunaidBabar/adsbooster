type TrackingWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

/**
 * One lead signal, sent to the Meta Pixel as `Lead` and to Google Analytics as
 * `generate_lead`. Both scripts only load in production; elsewhere this is a
 * no-op. Never pass names, phone numbers or other personal data here.
 */
export function trackLead(method: "form" | "whatsapp", placement: string) {
  const w = window as TrackingWindow;
  w.fbq?.("track", "Lead", { content_name: method, content_category: placement });
  w.gtag?.("event", "generate_lead", { method, placement });
}
