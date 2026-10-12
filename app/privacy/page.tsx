import type { Metadata } from "next";
import Link from "next/link";
import { content } from "../../lib/content";

const title = "Privacy Policy | AdsBoosters.pk";
const description = "How AdsBoosters.pk collects and uses enquiry information.";

export const metadata: Metadata = {
  title,
  description,
  // Each legal page is its own canonical, not the homepage.
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "AdsBoosters.pk",
    url: "/privacy",
    title,
    description,
    // A page-level openGraph replaces the root one, so the image is re-listed.
    images: ["/opengraph-image"],
  },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="container legal-shell">
        <Link className="legal-back" href="/">
          ← Back to AdsBoosters.pk
        </Link>
        <p className="eyebrow">Legal</p>
        <h1>Privacy policy</h1>
        <p className="legal-intro">
          Effective September 29, 2026. This policy explains how AdsBoosters.pk
          handles information submitted through this website.
        </p>

        <section className="legal-section">
          <h2>Information we collect</h2>
          <p>
            When you request an ad audit, we may collect your name, WhatsApp
            number, business type, city, estimated monthly ad budget and, if you
            choose to give it, your email address.
          </p>
        </section>

        <section className="legal-section">
          <h2>How we use it</h2>
          <p>
            We use this information to respond to your enquiry, prepare an ad
            audit, contact you about the requested service, and improve our
            lead-handling process. We do not sell your personal information.
          </p>
        </section>

        <section className="legal-section">
          <h2>Service providers</h2>
          <p>
            Enquiry information may be processed through our private Google
            Sheet for lead management and Resend for transactional email. These
            providers process information only to deliver the requested service.
          </p>
        </section>

        <section className="legal-section">
          <h2>Analytics</h2>
          <p>
            We use Google Analytics to understand how visitors use this website
            and improve our campaigns and content. Google may process usage data
            through cookies or similar technologies. You can manage cookies in
            your browser settings or use Google&apos;s available opt-out tools.
          </p>
        </section>

        <section className="legal-section">
          <h2>Meta Pixel</h2>
          <p>
            We use the Meta Pixel to measure our Facebook and Instagram ads. It
            records page visits and when someone sends the audit form or taps a
            WhatsApp button, so we can see which ads bring enquiries. It does
            not send the details you type into the form. Meta may use cookies
            for this; you can control ad preferences in your Facebook or
            Instagram settings and block cookies in your browser.
          </p>
        </section>

        <section className="legal-section">
          <h2>Retention and security</h2>
          <p>
            We keep enquiry information only for as long as it is useful for
            follow-up, service delivery, record keeping, or legal obligations.
            We use reasonable technical and organisational safeguards, but no
            internet transmission can be guaranteed to be completely secure.
          </p>
        </section>

        <section className="legal-section">
          <h2>Your choices</h2>
          <p>
            You can ask us to correct or delete your enquiry information by
            emailing{" "}
            <a href={`mailto:${content.footer.email}`}>{content.footer.email}</a>
            .
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
            <a href={`mailto:${content.footer.email}`}>{content.footer.email}</a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
