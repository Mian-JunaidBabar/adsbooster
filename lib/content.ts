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
  /** Link text at the bottom of the card. Defaults to "Learn more". */
  cue?: string;
};

export type FaqEntry = {
  question: string;
  answer: string;
  /** Optional link appended to the answer, e.g. to a section on the page. */
  link?: { href: string; label: string };
};

/**
 * All page copy lives here as plain objects, so a future industry page can be
 * a copy of this file with different words.
 */
export const content = {
  nav: [
    { id: "results", label: "Results" },
    { id: "services", label: "Services" },
    { id: "process", label: "Process" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
    { id: "audit", label: "Free audit" },
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
    proofLine: "123K views in 28 days for SS Traders, Lahore",
  },
  /** Client proof. Bracketed values are placeholders and stay hidden until filled. */
  results: {
    eyebrow: "Results",
    headline: "A Lahore foundry supplier reached 42,000 new people in 28 days.",
    subline:
      "SS Traders sells ferro alloys and foundry chemicals, a market most agencies won't touch.",
    workLine: "[One line on what AdsBoosters did for SS Traders]",
    stats: [
      { value: 123, suffix: "K", label: "views on Facebook in 28 days" },
      {
        value: 99,
        suffix: "%",
        label: "of views from people who didn't follow the page yet",
      },
      { value: 71, label: "visitors from Google search in the same month" },
    ] as ProofStat[],
    banner: {
      src: "/results/ss-traders-banner.webp",
      alt: "SS Traders, foundry and furnace chemicals supplier in Lahore",
      width: 640,
      height: 435,
    },
    screenshots: [
      {
        src: "/results/ss-traders-meta-insights.webp",
        alt: "Meta insights showing 123.2K views and 42,208 viewers for SS Traders in 28 days",
        caption: "Facebook reach, Meta Business Suite, 14 Sep to 11 Oct 2026",
        width: 492,
        height: 322,
      },
      {
        src: "/results/ss-traders-search-console.webp",
        alt: "Google Search Console showing 71 clicks and 1.05K impressions for sstraders.pk",
        caption: "Google Search Console, last 28 days",
        width: 1190,
        height: 410,
      },
    ],
    quote: {
      text: "[One or two lines from the SS Traders owner.]",
      name: "[Owner name]",
      business: "SS Traders, Lahore",
    },
    ctaLabel: "Get results like this",
    whatsappPrefill:
      "Assalam o Alaikum, I saw the SS Traders results and want the same for my business.",
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
        title: "SEO and Google Maps ranking",
        description:
          "Get your business showing higher on Google Search and Google Maps.",
        icon: TrendingUp,
        accent: "cyan",
        href: whatsappLink(
          "Assalam o Alaikum, mujhe apna business Google par upar rank karwana hai.",
        ),
        cue: "Ask on WhatsApp",
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
        // Amount in PKR, e.g. "40,000". Empty or [bracketed] shows "Custom quote";
        // a real amount shows "Starting from 40,000 PKR a month".
        price: "[amount]",
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
        price: "[amount]",
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
        answer: "No. We work month to month.",
      },
      {
        question: "Can I see results from other clients?",
        answer: "Yes, see",
        link: { href: "#results", label: "SS Traders above" },
      },
    ] as FaqEntry[],
  },
  audit: {
    headline: "Tell us what you sell. We'll show you where the leads are.",
    subline:
      "Free audit of your current ads, or a first campaign plan if you're starting out. We reply on WhatsApp within 15 minutes, 10am to 8pm.",
    chatLine: "Rather just chat? Message us on WhatsApp",
  },
  footer: {
    tagline: "Performance marketing for Pakistani businesses.",
    copyright: "© 2026 AdsBoosters.pk",
    platforms: "Google · Meta",
    // The one contact email for the whole site, legal pages included.
    // Awaiting the client's confirmation of the final address.
    email: "adsboosters6030@gmail.com",
    phone: { label: "+92 345 5058317", href: "tel:+923455058317" },
    // Shown once the client sends it; a [bracketed] value stays hidden.
    address: "[Lahore address]",
    social: [
      {
        label: "Facebook",
        // TODO: swap for the page's clean URL (facebook.com/<name>) once the client sends it.
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
