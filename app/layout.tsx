import type { Metadata } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { content, isPlaceholder } from "../lib/content";
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
const metaPixelId = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").replace(
  /\D/g,
  "",
);
const { address, phone, social } = content.footer;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AdsBoosters.pk",
  url: siteUrl,
  image: `${siteUrl}/logo.webp`,
  telephone: phone.href.replace("tel:", ""),
  email: content.footer.email,
  address: {
    "@type": "PostalAddress",
    ...(isPlaceholder(address) ? {} : { streetAddress: address }),
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
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
        name: "SEO and Google Maps ranking",
        description:
          "Help your business show higher on Google Search and Google Maps.",
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
  sameAs: social.map(({ href }) => href),
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
    card: "summary_large_image",
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
      {isProduction && metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}
      <body>{children}</body>
    </html>
  );
}
