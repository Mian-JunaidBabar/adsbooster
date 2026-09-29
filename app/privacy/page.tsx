import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AdsBoosters.pk",
  description: "How AdsBoosters.pk collects and uses enquiry information.",
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
            When you request an ad audit, we may collect your name, email
            address, business type, city, WhatsApp number, and estimated monthly
            ad budget.
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
            <a href="mailto:adsboosters6030@gmail.com">
              adsboosters6030@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
            <a href="mailto:adsboosters6030@gmail.com">
              adsboosters6030@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
