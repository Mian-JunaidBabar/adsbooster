export const audienceKeys = [
  "other",
  "clinic",
  "skincare",
  "education",
] as const;

export type AudienceKey = (typeof audienceKeys)[number];

export type AudienceContent = {
  label: string;
  type: string;
  headline: string;
  sub: string;
  proof?: string;
  prefill: string;
  niches: string[];
};

export const audienceContent: Record<AudienceKey, AudienceContent> = {
  other: {
    label: "Other Businesses",
    type: "Local business",
    headline: "Leads and sales from ads that pay back.",
    sub: "Google and Meta campaigns for local businesses, managed weekly and reported in plain numbers: enquiries, cost per lead, sales.",
    prefill:
      "Assalam o Alaikum, mujhe apne business ke liye ads se leads chahiye.",
    niches: [
      "Lead generation, store visits or online sales, whichever you need",
      "Ad creatives and copy included",
      "Monthly strategy review",
    ],
  },
  clinic: {
    label: "Clinics",
    type: "Clinic",
    headline: "Fill your clinic’s appointment book.",
    sub: "Meta and Google campaigns that bring booking enquiries straight to your front desk on WhatsApp, tracked back to the ad that sent them.",
    prefill:
      "Assalam o Alaikum, meri clinic hai aur mujhe ads se zyada bookings chahiye.",
    niches: [
      "Patient enquiry campaigns by area and specialty",
      "WhatsApp booking setup so enquiries do not get lost",
      "Doctor and clinic branding content",
    ],
  },
  skincare: {
    label: "Skin Care & Beauty",
    type: "Skin care & beauty",
    headline: "More enquiries for your skin care and beauty business.",
    sub: "Meta and Google campaigns for salons, skin care studios and beauty brands, with clear enquiry tracking and copy that stays within platform policies.",
    prefill:
      "Assalam o Alaikum, mujhe apne skin care ya beauty business ke liye ads se enquiries chahiye.",
    niches: [
      "Local campaigns for salons, studios and beauty brands",
      "Offer-led creatives without medical or guaranteed-result claims",
      "WhatsApp enquiry tracking from ad to response",
    ],
  },
  education: {
    label: "Education & Visa",
    type: "Education & visa",
    headline: "Serious leads for education and visa services.",
    sub: "Ads for institutes and visa consultants reaching people ready to learn, study or work abroad, with lead filtering before the WhatsApp chat.",
    proof: "Lead campaigns for study-abroad and work-visa consultants",
    prefill:
      "Assalam o Alaikum, mujhe education ya visa services ke liye qualified leads chahiye.",
    niches: [
      "Campaigns by destination, course or subject",
      "Lead filters for qualification, budget and timeline",
      "Spam and fake-number control before follow-up",
    ],
  },
};

export const audienceAliases: Record<string, AudienceKey> = {
  clinic: "clinic",
  clinics: "clinic",
  skincare: "skincare",
  "skin-care": "skincare",
  beauty: "skincare",
  education: "education",
  visa: "education",
  "education-visa": "education",
  other: "other",
  businesses: "other",
};

export function audienceFromParam(value: string | null): AudienceKey {
  return (value && audienceAliases[value]) || "other";
}
