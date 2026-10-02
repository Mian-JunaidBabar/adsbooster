import {
  Search,
  Megaphone,
  Check,
  CalendarDays,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Compass,
} from "lucide-react";

export const content = {
  hero: {
    eyebrow: "Start growing today",
    headline: "Get more leads and sales with high‑ROI paid ads",
    subline:
      "We help Pakistani businesses grow through Meta and Google ads. Skip the guesswork and get a proven system that brings ready-to-buy customers to your WhatsApp or website.",
    checklist: [
      "Stop wasting money on ads that don't convert",
      "Get a steady stream of qualified leads",
      "Work with a team that understands the local market",
    ],
    whatsappPrefill:
      "Hi AdsBoosters, I want more leads for my business. Can we talk?",
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
      },
      {
        title: "Meta Ads",
        description:
          "Facebook and Instagram campaigns with lead forms and click-to-WhatsApp ads.",
        icon: Megaphone,
      },
      {
        title: "Google Page Ranking",
        description:
          "Improve your local visibility so you show up first when customers search.",
        icon: MapPin,
      },
      {
        title: "Social media management",
        description:
          "Monthly content calendar, posting and inbox replies so your pages stay active.",
        icon: CalendarDays,
      },
    ],
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
        body: "Campaigns go live with tracking on every form, call and WhatsApp chat.",
      },
      {
        step: "04",
        title: "Optimise and report",
        body: "Weekly changes and a plain report: leads, cost per lead, what is next.",
      },
    ],
  },
  stats: [] as ProofStat[],
  testimonials: [] as Testimonial[],
  pricing: {
    eyebrow: "Pricing",
    headline: "One monthly fee. Ad spend stays yours.",
    subline:
      "You pay the platforms directly for ad spend, so you always see exactly where your money goes.",
    plans: [
      {
        name: "Ads management",
        price: "PKR ___ / month",
        description: "+ ad spend, paid directly to the platform",
        features: [
          "Google or Meta campaigns",
          "Ad creatives and copy",
          "Lead tracking to WhatsApp",
          "Weekly report and call",
        ],
      },
      {
        name: "Social media management",
        price: "PKR ___ / month",
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
        question: "Do you work with businesses outside Lahore or Karachi?",
        answer:
          "Yes, we run ads for businesses across Pakistan and handle everything over calls and WhatsApp.",
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
    copyright: "© AdsBoosters.pk. All rights reserved.",
    tagline: "Performance marketing for Pakistani businesses.",
  },
};

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

export function isPlaceholder(value: string) {
  return !value.trim() || /\[[^\]]*\]/.test(value);
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
