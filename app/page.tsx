"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  MapPin,
  MessageSquareText,
} from "lucide-react";
import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { content, getCompleteStats, getCompleteTestimonials } from "../lib/content";
import CountUp from "react-countup";

const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const WHATSAPP_NUMBER = rawWhatsApp.replace(/\D/g, "");

if (process.env.NODE_ENV === "production" && !WHATSAPP_NUMBER) {
  console.warn(
    "WARNING: NEXT_PUBLIC_WHATSAPP_NUMBER is missing. WhatsApp buttons will be hidden.",
  );
}

const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(content.hero.whatsappPrefill)}`
  : "";

type LeadFormState = {
  name: string;
  email: string;
  businessType: string;
  businessTypeOther: string;
  city: string;
  phone: string;
  budget: string;
  company: string;
};

const initialForm: LeadFormState = {
  name: "",
  email: "",
  businessType: "",
  businessTypeOther: "",
  city: "",
  phone: "",
  budget: "",
  company: "",
};

export default function Home() {
  const [form, setForm] = useState<LeadFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState("");

  const stats = getCompleteStats(content.stats);
  const testimonials = getCompleteTestimonials(content.testimonials);

  // Reveal System & Nav Active State Observer
  useEffect(() => {
    const reveals = document.querySelectorAll("[data-reveal]");
    document.body.classList.add("reveal-ready");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    reveals.forEach((el) => revealObserver.observe(el));

    const sections = document.querySelectorAll("section[id]");
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
    );

    sections.forEach((el) => navObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      navObserver.disconnect();
    };
  }, []);

  // Attribution
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramsToKeep = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "gclid",
        "fbclid",
        "ttclid",
      ];

      const raw = sessionStorage.getItem("adsbooster_attr");
      const sessionData = raw ? JSON.parse(raw) : {};

      let updated = false;
      for (const param of paramsToKeep) {
        if (urlParams.has(param) && !sessionData[param]) {
          sessionData[param] = urlParams.get(param);
          updated = true;
        }
      }

      if (!sessionData.landingUrl) {
        sessionData.landingUrl = window.location.href.split("#")[0];
        updated = true;
      }

      if (!sessionData.referrer && document.referrer) {
        sessionData.referrer = document.referrer;
        updated = true;
      }

      if (updated) {
        sessionStorage.setItem("adsbooster_attr", JSON.stringify(sessionData));
      }

      queueMicrotask(() => setAttribution(sessionData));
    } catch {
      // Ignore storage errors
    }

    queueMicrotask(() => setStartedAt(new Date().toISOString()));
  }, []);

  const handleFieldChange =
    (field: keyof LeadFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setServerMessage("");
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof LeadFormState, string>> = {};

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "company" && key !== "businessTypeOther" && !value.trim()) {
        nextErrors[key as keyof LeadFormState] = "This field is required.";
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setTimeout(() => {
        const firstErrorKey = Object.keys(nextErrors)[0];
        const el = document.getElementsByName(firstErrorKey)[0];
        if (el) (el as HTMLElement).focus();
      }, 0);
      return;
    }

    setIsSubmitting(true);
    setServerMessage("");

    try {
      const payload = {
        ...form,
        startedAt,
        utmSource: attribution.utm_source,
        utmMedium: attribution.utm_medium,
        utmCampaign: attribution.utm_campaign,
        utmContent: attribution.utm_content,
        utmTerm: attribution.utm_term,
        clickId: attribution.gclid || attribution.fbclid || attribution.ttclid, // Retained for ad-tracking attribution in case TikTok clicks are routed via custom campaigns
        landingUrl: attribution.landingUrl,
        referrer: attribution.referrer,
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.fields) {
          setErrors(data.fields);
          setTimeout(() => {
            const firstErrorKey = Object.keys(data.fields)[0];
            const el = document.getElementsByName(firstErrorKey)[0];
            if (el) (el as HTMLElement).focus();
          }, 0);
        } else {
          setServerMessage(data.error ?? "Your enquiry could not be sent.");
        }
        return;
      }

      setForm(initialForm);
      setErrors({});
      setIsSent(true);
    } catch {
      setServerMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSent(false);
    setForm(initialForm);
    setErrors({});
    setServerMessage("");
    setStartedAt(new Date().toISOString());
  };

  return (
    <main className="adsbooster-page">
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

          <nav className="nav-links nav-pills" aria-label="Main navigation">
            <a href="#services" className={activeSection === "services" ? "active" : ""}>Services</a>
            <a href="#process" className={activeSection === "process" ? "active" : ""}>Process</a>
            <a href="#pricing" className={activeSection === "pricing" ? "active" : ""}>Pricing</a>
            <a href="#faq" className={activeSection === "faq" ? "active" : ""}>FAQ</a>
          </nav>

          {WHATSAPP_NUMBER ? (
            <a
              className="whatsapp-button header-whatsapp"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquareText size={18} />
              WhatsApp
            </a>
          ) : null}
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-shapes" aria-hidden="true">
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
            <div className="eyebrow" data-reveal>{content.hero.eyebrow}</div>

            <h1 data-reveal data-reveal-delay="100">{content.hero.headline}</h1>

            <p className="hero-subline" data-reveal data-reveal-delay="200">{content.hero.subline}</p>

            <ul className="hero-checklist" data-reveal data-reveal-delay="300">
              {content.hero.checklist.map((item) => (
                <li key={item}>
                  <Check size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="cta-stack" data-reveal data-reveal-delay="400">
              {WHATSAPP_NUMBER ? (
                <a
                  className="whatsapp-button full-width"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquareText size={18} />
                  Chat on WhatsApp
                </a>
              ) : null}
              <span className="reply-line">
                {content.hero.whatsappReplyText}
              </span>
            </div>
          </div>

          <aside id="audit" className="audit-card" data-reveal data-reveal-delay="500">
            <div className="audit-card-inner">
              {isSent ? (
                <>
                  <div className="small-label">Free ad audit</div>
                  <h2>Thanks, we have your details.</h2>
                  <div className="success-box">
                    <Check size={18} />
                    <span>Enquiry received</span>
                  </div>
                  {WHATSAPP_NUMBER ? (
                    <a
                      className="whatsapp-button full-width"
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquareText size={18} />
                      Chat on WhatsApp
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={resetForm}
                  >
                    Send another enquiry
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="small-label">Free ad audit</div>
                  <h2>Tell us about your business.</h2>

                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleFieldChange("company")}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-label="Company (leave blank)"
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: 0,
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      border: 0,
                    }}
                  />

                  <label className="field-block">
                    <span>Your name</span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFieldChange("name")}
                      placeholder="Ali Khan"
                    />
                    {errors.name ? <small>{errors.name}</small> : null}
                  </label>

                  <label className="field-block">
                    <span>Email address</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFieldChange("email")}
                      placeholder="ali@example.com"
                    />
                    {errors.email ? <small>{errors.email}</small> : null}
                  </label>

                  <label className="field-block">
                    <span>What kind of business do you have?</span>
                    <select
                      name="businessType"
                      value={form.businessType}
                      onChange={handleFieldChange("businessType")}
                    >
                      <option value="" disabled>Select one</option>
                      <option>E-commerce</option>
                      <option>Clinic / Healthcare</option>
                      <option>Real Estate / Travel / Visa</option>
                      <option>B2B / Agency</option>
                      <option>Other</option>
                    </select>
                    {errors.businessType ? (
                      <small>{errors.businessType}</small>
                    ) : null}
                  </label>

                  {form.businessType === "Other" && (
                    <label className="field-block slide-down">
                      <span>Please specify</span>
                      <input
                        type="text"
                        name="businessTypeOther"
                        value={form.businessTypeOther}
                        onChange={handleFieldChange("businessTypeOther")}
                        placeholder="e.g. Software house"
                        maxLength={80}
                      />
                    </label>
                  )}

                  <label className="field-block">
                    <span>City</span>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleFieldChange("city")}
                      placeholder="Lahore"
                    />
                    {errors.city ? <small>{errors.city}</small> : null}
                  </label>

                  <label className="field-block">
                    <span>WhatsApp number</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleFieldChange("phone")}
                      placeholder="03XX XXXXXXX"
                    />
                    {errors.phone ? <small>{errors.phone}</small> : null}
                  </label>

                  <label className="field-block">
                    <span>Monthly ad budget</span>
                    <select
                      name="budget"
                      value={form.budget}
                      onChange={handleFieldChange("budget")}
                    >
                      <option value="" disabled>
                        Choose a range
                      </option>
                      <option>Under 50k PKR</option>
                      <option>50k–150k PKR</option>
                      <option>150k–500k PKR</option>
                      <option>500k+ PKR</option>
                    </select>
                    {errors.budget ? <small>{errors.budget}</small> : null}
                  </label>

                  {serverMessage ? (
                    <div className="form-error">{serverMessage}</div>
                  ) : null}

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send my details"}
                    {!isSubmitting ? <ArrowRight size={16} /> : null}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="services" className="page-section surface-section">
        <div className="container">
          <div className="section-heading-block">
            <div className="eyebrow" data-reveal>{content.services.eyebrow}</div>
            <h2 data-reveal data-reveal-delay="100">{content.services.headline}</h2>
            <p className="section-lead" data-reveal data-reveal-delay="200">
              {content.services.subline}
            </p>
          </div>

          <div className="card-grid four-up">
            {content.services.items.map(({ title, description, icon: Icon }, i) => (
              <article key={title} className="content-card service-card" data-reveal data-reveal-delay={300 + i * 100}>
                <div className="icon-wrap">
                  <Icon size={18} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="page-section paper-section">
        <div className="container">
          <div className="section-heading-block">
            <div className="eyebrow" data-reveal>{content.process.eyebrow}</div>
            <h2 data-reveal data-reveal-delay="100">{content.process.headline}</h2>
          </div>

          <div className="process-timeline">
            {content.process.steps.map(({ step, title, body }, i) => (
              <article key={step} className="content-card process-card" data-reveal data-reveal-delay={200 + i * 100}>
                <div className="step-label">{step}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="stats-band">
          <div className="container stats-grid">
            {stats.map(({ value, label }, i) => (
              <div key={label} className="stat-item" data-reveal data-reveal-delay={i * 100}>
                <div className="stat-value">
                  <CountUp end={value} enableScrollSpy scrollSpyOnce />
                </div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="page-section paper-section">
          <div className="container">
            <div className="section-heading-block narrow">
              <div className="eyebrow" data-reveal>Clients</div>
              <h2 data-reveal data-reveal-delay="100">What our clients say</h2>
            </div>

            <div className="testimonial-grid">
              {testimonials.map(({ quote, name, role, business, city }, i) => (
                <blockquote key={quote} className="testimonial-box" data-reveal data-reveal-delay={200 + i * 100}>
                  <p>“{quote}”</p>
                  <footer>
                    <strong>{name}</strong>
                    <span>{role}</span>
                    <span>
                      {business}, {city}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="pricing" className="page-section surface-section">
        <div className="container">
          <div className="section-heading-block narrow">
            <div className="eyebrow" data-reveal>{content.pricing.eyebrow}</div>
            <h2 data-reveal data-reveal-delay="100">{content.pricing.headline}</h2>
            <p className="section-lead" data-reveal data-reveal-delay="200">
              {content.pricing.subline}
            </p>
          </div>

          <div className="pricing-grid">
            {content.pricing.plans.map(({ name, price, description, features }, i) => (
              <article key={name} className="pricing-card" data-reveal data-reveal-delay={300 + i * 100}>
                <div className="plan-name">{name}</div>
                <div className="plan-price">
                  {price.includes("___") || !price.trim() ? "Custom quote" : price}
                </div>
                <p>{description}</p>
                <ul>
                  {features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a href="#audit" className="secondary-button">
                  Get a free ad audit
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="page-section paper-section">
        <div className="container faq-wrap">
          <div className="section-heading-block narrow">
            <div className="eyebrow" data-reveal>{content.faqs.eyebrow}</div>
            <h2 data-reveal data-reveal-delay="100">{content.faqs.headline}</h2>
          </div>

          <div className="faq-list">
            {content.faqs.items.map(({ question, answer }, i) => (
              <details key={question} className="faq-item" data-reveal data-reveal-delay={200 + i * 50}>
                <summary>
                  {question}
                  <div className="faq-icon"><Check size={18} /></div>
                </summary>
                <div className="faq-answer">
                  <p>{answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-wrap" data-reveal>
        <div className="container">
          <div className="final-cta">
            <div className="final-cta-copy">
              <h2>{content.finalCta.headline}</h2>
              <p>{content.finalCta.subline}</p>
            </div>
            <div className="final-cta-actions">
              {WHATSAPP_NUMBER ? (
                <a
                  className="whatsapp-button full-width"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquareText size={18} />
                  Chat on WhatsApp
                </a>
              ) : null}
              <a href="#audit" className="secondary-button full-width">
                Send an enquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-main">
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
          </div>
          <div className="footer-meta">
            <span className="copyright">{content.footer.copyright}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
