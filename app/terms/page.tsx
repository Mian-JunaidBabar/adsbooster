import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | AdsBoosters.pk",
  description: "Terms for using AdsBoosters.pk services and website.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="container legal-shell">
        <Link className="legal-back" href="/">
          ← Back to AdsBoosters.pk
        </Link>
        <p className="eyebrow">Legal</p>
        <h1>Terms of service</h1>
        <p className="legal-intro">
          Effective September 29, 2026. By using this website or requesting an
          ad audit, you agree to these terms.
        </p>

        <section className="legal-section">
          <h2>Our services</h2>
          <p>
            AdsBoosters.pk provides paid advertising strategy, campaign
            management, creative support, landing-page guidance, and social
            media services. The exact scope, fee, timeline, and deliverables
            will be confirmed with you before work begins.
          </p>
        </section>

        <section className="legal-section">
          <h2>Advertising results</h2>
          <p>
            Advertising performance depends on the offer, market, budget,
            platform policies, creative, tracking, and other factors outside our
            control. We do not guarantee a specific number of leads, sales,
            return on ad spend, approval, or business outcome.
          </p>
        </section>

        <section className="legal-section">
          <h2>Ad spend and access</h2>
          <p>
            Platform ad spend is separate from our fees and should be paid
            directly to the relevant advertising platform. You remain
            responsible for providing accurate business information, approving
            advertising materials, and maintaining access to your own accounts.
          </p>
        </section>

        <section className="legal-section">
          <h2>Acceptable use</h2>
          <p>
            You agree not to use our website or services for unlawful,
            deceptive, fraudulent, infringing, or harmful activity. You are
            responsible for ensuring that your products, claims, and campaigns
            comply with applicable law and advertising-platform policies.
          </p>
        </section>

        <section className="legal-section">
          <h2>Intellectual property</h2>
          <p>
            Each party keeps ownership of materials it supplied. Unless agreed
            otherwise in writing, final materials created specifically for your
            project may be used by you after agreed invoices are paid. Our
            general methods, templates, and know-how remain ours.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
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
