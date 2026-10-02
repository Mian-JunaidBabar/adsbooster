import type { Metadata } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adsboosters.pk";
const isProduction = process.env.NODE_ENV === "production";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AdsBoosters.pk",
  url: siteUrl,
  description:
    "Google and Meta ads, Google ranking and social media management for businesses in Pakistan.",
  knowsAbout: [
    "Google Ads",
    "Meta Ads",
    "Google search ranking (SEO)",
    "Social media management",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Google Ads",
        description:
          "Search and Maps ads that bring enquiries from people already looking for your business.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Meta Ads",
        description:
          "Facebook and Instagram campaigns with lead forms and click-to-WhatsApp ads.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Google Page Ranking",
        description:
          "Help your business show higher on Google Search and Maps.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Social media management",
        description:
          "Monthly content calendar, posting and inbox replies for your pages.",
      },
    },
  ],
  areaServed: { "@type": "Country", name: "Pakistan" },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61593563594054",
    "https://www.instagram.com/adsboosters.pk",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Urdu"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AdsBoosters.pk",
  url: siteUrl,
  inLanguage: "en-PK",
};

const SEO_TITLE = "AdsBoosters.pk | Google & Meta Ads Agency in Pakistan";
const SEO_DESCRIPTION =
  "Get more leads and sales from Google and Meta ads and social media. We run your campaigns and report every week in plain numbers. Free ad audit.";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "AdsBoosters.pk",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: "AdsBoosters",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${barlow.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
      </head>
      {isProduction ? (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-VKXFX75ZRM"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VKXFX75ZRM');
gtag('config', 'G-GTMDWH0T54');`}
          </Script>
        </>
      ) : null}
      <body>{children}</body>
    </html>
  );
}
