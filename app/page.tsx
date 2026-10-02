import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Compass,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import type { CSSProperties } from "react";
import CountUp from "../components/CountUp";
import FaqItem from "../components/FaqItem";
import LeadForm from "../components/LeadForm";
import MotionController from "../components/MotionController";
import NavPills from "../components/NavPills";
import StickyWhatsApp from "../components/StickyWhatsApp";
import {
  content,
  getCompleteStats,
  getCompleteTestimonials,
  isPlaceholder,
  type ServiceItem,
} from "../lib/content";
import { hasWhatsApp, whatsappLink } from "../lib/whatsapp";

const whatsappHref = whatsappLink(content.hero.whatsappPrefill);

/** Scroll-reveal marker; `index` staggers siblings by 70 ms each. */
const reveal = (index = 0) => ({
  "data-reveal": "",
  "data-reveal-delay": index,
});

/** Hero entrance: each piece rises in 60 ms after the one before it. */
const rise = (index: number) => ({ "--i": index }) as CSSProperties;

type ServiceCardProps = ServiceItem & { index: number };

function ServiceCard({
  title,
  description,
  icon: Icon,
  accent,
  href,
  index,
}: ServiceCardProps) {
  const inner = (
    <>
      <div className="icon-wrap">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </>
  );
  const className = "content-card service-card";

  if (href === undefined) {
    return (
      <article className={className} data-accent={accent} {...reveal(index)}>
        {inner}
      </article>
    );
  }

  const target = href || "#audit";
  const external = target.startsWith("http");
  return (
    <a
      className={`${className} is-link`}
      data-accent={accent}
      href={target}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...reveal(index)}
    >
      {inner}
      <span className="card-cue">
        Learn more <ArrowRight size={16} aria-hidden="true" />
      </span>
    </a>
  );
}

function WhatsAppIcon() {
  return <MessageSquareText size={18} aria-hidden="true" />;
}

export default function Home() {
  const stats = getCompleteStats(content.stats);
  const testimonials = getCompleteTestimonials(content.testimonials);
  const quoteHref = whatsappLink(content.pricing.quotePrefill);

  return (
    <main className="adsbooster-page">
      <MotionController />

      <header className="site-header">
        <div className="container header-inner">
          <Link
            className="navbar-logo"
            href="/"
            aria-label="AdsBoosters.pk home"
          >
            <Image
              src="/logo-white.webp"
              alt="AdsBoosters.pk"
              width={210}
              height={45}
              priority
            />
          </Link>

          <NavPills items={content.nav} />

          {hasWhatsApp ? (
            <a
              className="whatsapp-button header-whatsapp"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon />
              <span className="header-whatsapp-label">WhatsApp</span>
            </a>
          ) : null}
        </div>
      </header>

      <section className="hero-section" data-hero>
        <div className="hero-shapes" aria-hidden="true" data-pause-offscreen>
          <div className="shape shape-1" />
          <div className="shape shape-2" />
        </div>
        <div className="hero-map" aria-hidden="true">
          <Image
            src="/hero-map.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", opacity: 0.5 }}
          />
        </div>

        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow hero-rise" style={rise(0)}>
              {content.hero.eyebrow}
            </div>

            <h1>{content.hero.headline}</h1>

            <p className="hero-subline hero-rise" style={rise(1)}>
              {content.hero.subline}
            </p>

            <ul className="hero-checklist">
              {content.hero.checklist.map((item, i) => (
                <li key={item} className="hero-rise" style={rise(2 + i)}>
                  <Check size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div
              className="cta-stack hero-rise"
              style={rise(2 + content.hero.checklist.length)}
            >
              {hasWhatsApp ? (
                <a
                  className="whatsapp-button full-width"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              ) : null}
              <span className="reply-line">
                {content.hero.whatsappReplyText}
              </span>
            </div>
          </div>

          <aside id="audit" className="audit-card">
            <LeadForm whatsappHref={whatsappHref} />
          </aside>
        </div>
      </section>

      <section id="services" className="page-section surface-section">
        <div className="container">
          <div className="section-heading-block" {...reveal()}>
            <div className="eyebrow">{content.services.eyebrow}</div>
            <h2>{content.services.headline}</h2>
            <p className="section-lead">{content.services.subline}</p>
          </div>

          <div className="card-grid four-up">
            {content.services.items.map((item, i) => (
              <ServiceCard key={item.title} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="page-section paper-section">
        <div className="container">
          <div className="section-heading-block" {...reveal()}>
            <div className="eyebrow">{content.process.eyebrow}</div>
            <h2>{content.process.headline}</h2>
          </div>

          <ol className="process-timeline">
            {content.process.steps.map(({ step, title, body }, i) => (
              <li key={step} className="process-step" {...reveal(i)}>
                <span className="step-badge">{step}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {stats.length > 0 ? (
        <section className="stats-band" data-count-scope>
          <div className="container stats-grid">
            {stats.map(({ value, prefix, suffix, label }) => (
              <div key={label} className="stat-item">
                <div className="stat-value">
                  <CountUp value={value} prefix={prefix} suffix={suffix} />
                </div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {testimonials.length > 0 ? (
        <section id="testimonials" className="page-section paper-section">
          <div className="container">
            <div className="section-heading-block narrow" {...reveal()}>
              <div className="eyebrow">Clients</div>
              <h2>What our clients say</h2>
            </div>

            <div className="testimonial-grid">
              {testimonials.map(
                ({ quote, name, role, business, city }, i) => (
                  <blockquote
                    key={quote}
                    className="testimonial-box"
                    {...reveal(i)}
                  >
                    <p>{quote}</p>
                    <footer>
                      <strong>{name}</strong>
                      <span>{role}</span>
                      <span>
                        {business}, {city}
                      </span>
                    </footer>
                  </blockquote>
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      <section id="pricing" className="page-section surface-section">
        <div className="container">
          <div className="section-heading-block narrow" {...reveal()}>
            <div className="eyebrow">{content.pricing.eyebrow}</div>
            <h2>{content.pricing.headline}</h2>
            <p className="section-lead">{content.pricing.subline}</p>
          </div>

          <div className="pricing-grid">
            {content.pricing.plans.map(
              ({ name, price, description, features }, i) => {
                const hasPrice = !isPlaceholder(price);
                const asksOnWhatsApp = !hasPrice && quoteHref;
                return (
                  <article key={name} className="pricing-card" {...reveal(i)}>
                    <div className="plan-name">{name}</div>
                    <div className="plan-price">
                      {hasPrice ? price : "Custom quote"}
                    </div>
                    <p>{description}</p>
                    <ul>
                      {features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    {asksOnWhatsApp ? (
                      <a
                        className="whatsapp-button"
                        href={quoteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon />
                        Get a quote on WhatsApp
                      </a>
                    ) : (
                      <a href="#audit" className="secondary-button">
                        Get a free ad audit
                      </a>
                    )}
                  </article>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section id="faq" className="page-section paper-section">
        <div className="container faq-wrap">
          <div className="section-heading-block narrow" {...reveal()}>
            <div className="eyebrow">{content.faqs.eyebrow}</div>
            <h2>{content.faqs.headline}</h2>
          </div>

          <div className="faq-list">
            {content.faqs.items.map(({ question, answer }, i) => (
              <FaqItem
                key={question}
                question={question}
                answer={answer}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-wrap">
        <div className="container">
          <div className="final-cta" data-pause-offscreen {...reveal()}>
            <div className="final-cta-copy">
              <h2>{content.finalCta.headline}</h2>
              <p>{content.finalCta.subline}</p>
            </div>
            <div className="final-cta-actions">
              {hasWhatsApp ? (
                <a
                  className="whatsapp-button full-width"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              ) : null}
              <a href="#audit" className="secondary-button full-width">
                Get a free ad audit
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Image
              src="/icon1.png"
              alt="AdsBoosters.pk"
              width={72}
              height={72}
              className="footer-logo-image"
            />
            <div>
              <strong>AdsBoosters.pk</strong>
              <p>{content.footer.tagline}</p>
            </div>
          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h3>
                <Compass size={15} aria-hidden="true" /> Explore
              </h3>
              {content.nav.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="link-underline">
                  {label}
                </a>
              ))}
            </div>

            <div className="footer-column">
              <h3>
                <Mail size={15} aria-hidden="true" /> Contact
              </h3>
              <a
                href={`mailto:${content.footer.email}`}
                className="link-underline"
              >
                Email us
              </a>
              {hasWhatsApp ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  Chat on WhatsApp
                </a>
              ) : null}
              <span>
                <MapPin size={15} aria-hidden="true" /> Pakistan · Serving
                nationwide
              </span>
            </div>

            <div className="footer-column">
              <h3>
                <ShieldCheck size={15} aria-hidden="true" /> Legal
              </h3>
              <Link href="/privacy" className="link-underline">
                Privacy policy
              </Link>
              <Link href="/terms" className="link-underline">
                Terms of service
              </Link>
            </div>

            <div className="footer-column">
              <h3>
                <ExternalLink size={15} aria-hidden="true" /> Follow
              </h3>
              {content.footer.social.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-meta">
            <div className="copyright">{content.footer.copyright}</div>
            <div className="footer-platforms">{content.footer.platforms}</div>
            <div className="footer-credit">
              Designed and developed by{" "}
              <a
                href={content.footer.credit.href}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                {content.footer.credit.label}{" "}
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {hasWhatsApp ? <StickyWhatsApp href={whatsappHref} /> : null}
    </main>
  );
}
