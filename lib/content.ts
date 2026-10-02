import {
  CalendarDays,
  Megaphone,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { whatsappLink } from "./whatsapp";

export type ProofStat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  business: string;
  city: string;
};

export type ServiceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Token used for the icon badge and the thin top bar. */
  accent: "blue" | "cyan" | "navy";
  /** When set, the whole card becomes a link. */
  href?: string;
};

/**
 * All page copy lives here as plain objects, so a future industry page can be
 * a copy of this file with different words.
 */
export const content = {
  nav: [
    { id: "services", label: "Services" },
    { id: "process", label: "Process" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ],
  hero: {
    eyebrow: "PERFORMANCE ADS · GOOGLE · META · SOCIAL MEDIA",
    headline: "More leads and sales from ads that pay back.",
    subline:
      "We plan, run and manage your Google and Meta ads and your social media, then report every week in plain numbers: enquiries, cost per lead, sales.",
    checklist: [
      "Works for clinics, education, skin care, beauty and any local business",
      "Ad creatives and copy included",
      "You own your ad accounts and data",
    ],
    whatsappPrefill:
      "Assalam o Alaikum, mujhe apne business ke liye ads aur social media se zyada leads chahiye.",
    whatsappReplyText: "Replies within 15 minutes, 10am–8pm",
  },
  services: {
    eyebrow: "What we run",
    headline: "Ads that bring enquiries, not just clicks.",
    subline:
      "We plan, launch and manage your campaigns end to end, then report in plain language every week.",
    items: [
      {
        title: "Google Ads",
        description:
          "Search and Maps ads for people already looking for what you offer, in your city.",
        icon: Search,
        accent: "blue",
      },
      {
        title: "Meta Ads",
        description:
          "Facebook and Instagram campaigns with lead forms and click-to-WhatsApp ads.",
        icon: Megaphone,
        accent: "cyan",
      },
      {
        title: "Google Page Ranking",
        description:
          "Get your business showing higher on Google Search and Maps.",
        icon: TrendingUp,
        accent: "navy",
        // The client will send a URL. Until then this opens WhatsApp; replace
        // the value on this one line to change where the card goes.
        href: whatsappLink(
          "Assalam o Alaikum, mujhe apna business Google par upar rank karwana hai.",
        ),
      },
      {
        title: "Social media management",
        description:
          "Monthly content calendar, posting and inbox replies so your pages stay active.",
        icon: CalendarDays,
        accent: "blue",
      },
    ] as ServiceItem[],
  },
  process: {
    eyebrow: "How it works",
    headline: "From first message to live ads in about a week",
    steps: [
      {
        step: "01",
        title: "Free audit",
        body: "We review your current ads or market and tell you what we would change.",
      },
      {
        step: "02",
        title: "Plan and creatives",
        body: "Targeting, budget split and ad creatives, agreed with you before launch.",
      },
      {
        step: "03",
        title: "Launch",
        body: "Campaigns go live with tracking on every form and WhatsApp chat.",
      },
      {
        step: "04",
        title: "Optimise and report",
        body: "Weekly changes and a plain report: leads, cost per lead, what is next.",
      },
    ],
  },
  /** Real numbers only, supplied by the client. Empty hides the whole strip. */
  stats: [] as ProofStat[],
  /** Real quotes only, supplied by the client. Empty hides the whole section. */
  testimonials: [] as Testimonial[],
  pricing: {
    eyebrow: "Pricing",
    headline: "One monthly fee. Ad spend stays yours.",
    subline:
      "You pay the platforms directly for ad spend, so you always see exactly where your money goes.",
    quotePrefill:
      "Assalam o Alaikum, mujhe ads aur social media management ka quote chahiye.",
    plans: [
      {
        name: "Ads management",
        // Leave empty until the owner sets a price: the card shows "Custom quote".
        price: "",
        description: "+ ad spend, paid directly to the platform",
        features: [
          "Google and Meta campaigns",
          "Ad creatives and copy",
          "Lead tracking to WhatsApp",
          "Weekly report on WhatsApp",
        ],
      },
      {
        name: "Social media management",
        price: "",
        description: "Ad spend not included",
        features: [
          "Monthly content calendar",
          "Posts and stories designed",
          "Inbox and comment replies",
          "Monthly performance summary",
        ],
      },
    ],
  },
  faqs: {
    eyebrow: "FAQ",
    headline: "Questions we hear most",
    items: [
      {
        question: "Is ad spend included in your fee?",
        answer:
          "No. Ad spend is always separate and paid directly to Google or Meta. Our fee covers planning, creatives and management.",
      },
      {
        question: "How soon will I get leads?",
        answer:
          "Most campaigns start bringing enquiries in the first week after launch. We tune targeting in the first month to lower your cost per lead.",
      },
      {
        question: "Do I need a minimum ad budget?",
        answer:
          "We recommend starting from 50k PKR a month in ad spend so there is enough data to optimise. We will tell you honestly if your budget is too small.",
      },
      {
        question: "Which businesses do you work with?",
        answer:
          "Any business that sells a product or service and wants more enquiries or sales, across Pakistan. That includes clinics, education, skin care, beauty, retail and local services. If ads are not a good fit for you, we will say so in the free audit.",
      },
      {
        question: "Who owns the ad account and pages?",
        answer:
          "You do. We only ask for advertiser access to manage campaigns. The data, the pixel and the pages remain yours.",
      },
      {
        question: "Is there a long contract?",
        answer:
          "No. We work month to month. You own your ad accounts, pages and data.",
      },
    ],
  },
  finalCta: {
    headline: "Tell us what you sell. We will show you where the leads are.",
    subline:
      "Free audit of your current ads, or a first-campaign plan if you are starting out.",
  },
  footer: {
    tagline: "Performance marketing for Pakistani businesses.",
    copyright: "© 2026 AdsBoosters.pk",
    platforms: "Google · Meta",
    email: "adsboosters6030@gmail.com",
    social: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61593563594054",
      },
      { label: "Instagram", href: "https://www.instagram.com/adsboosters.pk" },
    ],
    credit: {
      label: "Deep Dev Solutions",
      href: "https://deepdevsolutions.com",
    },
  },
};

/** A value that was never filled in: empty, `[bracketed]` or `___`. */
export function isPlaceholder(value: string) {
  return !value.trim() || /\[[^\]]*\]/.test(value) || /_{2,}/.test(value);
}

export function getCompleteStats(stats: ProofStat[]) {
  return stats.filter(
    (stat) => !isPlaceholder(stat.label) && Number.isFinite(stat.value),
  );
}

export function getCompleteTestimonials(testimonialsToCheck: Testimonial[]) {
  return testimonialsToCheck.filter((testimonial) =>
    Object.values(testimonial).every(
      (value) => typeof value === "string" && !isPlaceholder(value),
    ),
  );
}
