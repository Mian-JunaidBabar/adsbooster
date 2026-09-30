import type { Metadata } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AdsBoosters.pk",
  url: siteUrl,
  description:
    "Performance advertising agency for clinics, visa consultants and local businesses in Pakistan.",
  areaServed: { "@type": "Country", name: "Pakistan" },
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

export const metadata: Metadata = {
  title: "AdsBoosters.pk | Performance Ads Agency",
  description:
    "Performance ads for clinics, visa consultants and local businesses in Pakistan.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "AdsBoosters.pk",
    title: "AdsBoosters.pk | Performance Ads Agency",
    description:
      "Performance ads for clinics, visa consultants and local businesses in Pakistan.",
  },
  twitter: {
    card: "summary",
    title: "AdsBoosters.pk | Performance Ads Agency",
    description:
      "Performance ads for clinics, visa consultants and local businesses in Pakistan.",
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
      <body>{children}</body>
    </html>
  );
}
