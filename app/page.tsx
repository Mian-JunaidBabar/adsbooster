"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  ExternalLink,
  Mail,
  MapPin,
  Megaphone,
  MessageSquareText,
  Play,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";

const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const WHATSAPP_NUMBER = rawWhatsApp.replace(/\D/g, "");

if (process.env.NODE_ENV === "production" && !WHATSAPP_NUMBER) {
  console.warn(
    "WARNING: NEXT_PUBLIC_WHATSAPP_NUMBER is missing. WhatsApp buttons will be hidden.",
  );
}

const audienceContent = {
  other: {
    label: "Other Businesses",
    type: "Local business",
    headline: "Leads and sales from ads that pay back.",
    sub: "Google, Meta and TikTok campaigns for local businesses, managed weekly and reported in plain numbers: enquiries, cost per lead, sales.",
    proof: "Retail, real estate, education, restaurants and more",
    prefill:
      "Assalam o Alaikum, mujhe apne business ke liye ads se leads chahiye.",
  },
  clinic: {
    label: "Clinics",
    type: "Clinic",
    headline: "Fill your clinic’s appointment book.",
    sub: "Meta and Google campaigns that bring booking enquiries straight to your front desk on WhatsApp, tracked back to the ad that sent them.",
    proof: "Campaigns for dental, skin and physiotherapy clinics",
    prefill:
      "Assalam o Alaikum, meri clinic hai aur mujhe ads se zyada bookings chahiye.",
  },
  visa: {
    label: "Visa Consultants",
    type: "Visa consultancy",
    headline: "Serious leads for your visa consultancy.",
    sub: "Ads that reach people already planning to study or work abroad, filtered so your counsellors spend time on real applicants.",
    proof: "Lead campaigns for study-abroad and work-visa consultants",
    prefill:
      "Assalam o Alaikum, main visa consultant hoon aur mujhe qualified leads chahiye.",
  },
} as const;

const services = [
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
    title: "TikTok Ads",
    description:
      "Short video ads that reach younger buyers at a lower cost per enquiry.",
    icon: Play,
  },
  {
    title: "Social media management",
    description:
      "Monthly content calendar, posting and inbox replies so your pages stay active.",
    icon: CalendarDays,
  },
];

const processSteps = [
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
];

const stats = [
  { value: "[00]", label: "Active clients" },
  { value: "[00k]", label: "Leads delivered" },
  { value: "[PKR 000]", label: "Avg. cost per lead" },
  { value: "[00]", label: "Cities served" },
];

const testimonials = [
  {
    quote:
      "[Real client quote about results, e.g. leads per month or cost per lead before and after.]",
    name: "[Client name]",
    role: "[Role]",
    business: "[Business]",
    city: "[City]",
  },
  {
    quote:
      "[Second real client quote. Use their words, lightly edited for length.]",
    name: "[Client name]",
    role: "[Role]",
    business: "[Business]",
    city: "[City]",
  },
];

const pricing = [
  {
    name: "Ads management",
    price: "PKR ___ / month",
    description: "+ ad spend, paid directly to the platform",
    features: [
      "Google, Meta or TikTok campaigns",
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
];

const faqs = [
  {
    question: "Is ad spend included in your fee?",
    answer:
      "No. Ad spend is always separate and paid directly to Google, Meta or TikTok. Our fee covers planning, creatives and management.",
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
    question: "Kya aap sirf Lahore/Karachi mein kaam karte hain?",
    answer:
      "Nahi. Hum poore Pakistan mein businesses ke liye ads chalate hain, aur calls aur WhatsApp par kaam karte hain.",
  },
  {
    question: "Is there a long contract?",
    answer:
      "No. We work month to month. You own your ad accounts, pages and data.",
  },
];

type LeadFormState = {
  name: string;
  email: string;
  businessType: string;
  city: string;
  phone: string;
  budget: string;
  company: string;
};

const initialForm: LeadFormState = {
  name: "",
  email: "",
  businessType: "Local business",
  city: "",
  phone: "",
  budget: "",
  company: "",
};

export default function Home() {
  const [audience, setAudience] =
    useState<keyof typeof audienceContent>("other");
  const [form, setForm] = useState<LeadFormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LeadFormState, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [attribution, setAttribution] = useState<Record<string, string>>({});

  const audienceDetails = audienceContent[audience];
  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(audienceDetails.prefill)}`
    : "";

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

      const forParam = urlParams.get("for");
      queueMicrotask(() => {
        if (forParam === "clinics" || forParam === "clinic") {
          setAudience("clinic");
          setForm((prev) => ({
            ...prev,
            businessType: audienceContent.clinic.type,
          }));
        } else if (forParam === "visa") {
          setAudience("visa");
          setForm((prev) => ({
            ...prev,
            businessType: audienceContent.visa.type,
          }));
        } else {
          setAudience("other");
          setForm((prev) => ({
            ...prev,
            businessType: audienceContent.other.type,
          }));
        }
      });
    } catch {
      // Ignore storage errors
    }

    queueMicrotask(() => setStartedAt(new Date().toISOString()));
  }, []);

  const selectAudience = (nextAudience: keyof typeof audienceContent) => {
    setAudience(nextAudience);
    setForm((current) => ({
      ...current,
      businessType: audienceContent[nextAudience].type,
    }));
  };

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
      if (key !== "company" && !value.trim()) {
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
        audience,
        startedAt,
        utmSource: attribution.utm_source,
        utmMedium: attribution.utm_medium,
        utmCampaign: attribution.utm_campaign,
        utmContent: attribution.utm_content,
        utmTerm: attribution.utm_term,
        clickId: attribution.gclid || attribution.fbclid || attribution.ttclid,
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

          <nav className="nav-links" aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
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
            <div className="eyebrow">Paid ads · Pakistan</div>

            <div
              className="hero-chips"
              role="tablist"
              aria-label="Business audience selector"
            >
              {(
                Object.keys(audienceContent) as Array<
                  keyof typeof audienceContent
                >
              ).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={key === audience ? "chip active" : "chip"}
                  role="tab"
                  aria-selected={key === audience}
                  onClick={() => selectAudience(key)}
                >
                  {audienceContent[key].label}
                </button>
              ))}
            </div>

            <h1>{audienceDetails.headline}</h1>

            <p className="hero-subline">{audienceDetails.sub}</p>

            <div className="cta-stack">
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
                Replies within 15 minutes, 10am–8pm
              </span>
            </div>

            <div className="proof-row">
              <Check size={18} />
              <span>{audienceDetails.proof}</span>
            </div>
          </div>

          <aside id="audit" className="audit-card">
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
                    <span>Business type</span>
                    <select
                      name="businessType"
                      value={form.businessType}
                      onChange={handleFieldChange("businessType")}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      <option>Clinic</option>
                      <option>Visa consultancy</option>
                      <option>Local business</option>
                    </select>
                    {errors.businessType ? (
                      <small>{errors.businessType}</small>
                    ) : null}
                  </label>

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
            <div className="eyebrow">What we run</div>
            <h2>Ads that bring enquiries, not just clicks.</h2>
            <p className="section-lead">
              We plan, launch and manage your campaigns end to end, then report
              in plain language every week.
            </p>
          </div>

          <div className="card-grid four-up">
            {services.map(({ title, description, icon: Icon }) => (
              <article key={title} className="content-card service-card">
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
            <div className="eyebrow">How it works</div>
            <h2>From first message to live ads in about a week</h2>
          </div>

          <div className="card-grid four-up">
            {processSteps.map(({ step, title, body }) => (
              <article key={step} className="content-card process-card">
                <div className="step-label">{step}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div className="container stats-grid">
          {stats.map(({ value, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section paper-section">
        <div className="container">
          <div className="section-heading-block narrow">
            <div className="eyebrow">Clients</div>
            <h2>What our clients say</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map(({ quote, name, role, business, city }) => (
              <blockquote key={quote} className="testimonial-box">
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

      <section id="pricing" className="page-section surface-section">
        <div className="container">
          <div className="section-heading-block narrow">
            <div className="eyebrow">Pricing</div>
            <h2>One monthly fee. Ad spend stays yours.</h2>
            <p className="section-lead">
              You pay the platforms directly for ad spend, so you always see
              exactly where your money goes.
            </p>
          </div>

          <div className="pricing-grid">
            {pricing.map(({ name, price, description, features }) => (
              <article key={name} className="pricing-card">
                <div className="plan-name">{name}</div>
                <div className="plan-price">{price}</div>
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
            <div className="eyebrow">FAQ</div>
            <h2>Questions we hear most</h2>
          </div>

          <div className="faq-list">
            {faqs.map(({ question, answer }) => (
              <details key={question} className="faq-item">
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-wrap">
        <div className="container">
          <div className="final-cta">
            <div className="final-cta-copy">
              <h2>
                Tell us what you sell. We will show you where the leads are.
              </h2>
              <p>
                Free audit of your current ads, or a first-campaign plan if you
                are starting out.
              </p>
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
              <a className="secondary-button full-width" href="#audit">
                Get a free ad audit
              </a>
              <a
                className="tertiary-link"
                href="https://cal.com/adsboosters"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a 15-min call
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-main">
            <div
              className="footer-brand"
              aria-label="AdsBoosters.pk footer logo"
            >
              <Image
                src="/logo.webp"
                alt="AdsBoosters.pk"
                width={88}
                height={88}
                className="footer-logo-image"
              />
              <div>
                <strong>AdsBoosters.pk</strong>
                <p>Performance ads for businesses ready to grow.</p>
              </div>
            </div>

            <div className="footer-column">
              <h3>
                <Compass size={15} /> Explore
              </h3>
              <a href="#services">Services</a>
              <a href="#process">Process</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className="footer-column">
              <h3>
                <Mail size={15} /> Contact
              </h3>
              <a href="mailto:adsboosters6030@gmail.com">
                <Mail size={15} /> Email us
              </a>
              {WHATSAPP_NUMBER ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              ) : null}
              <span>
                <MapPin size={15} /> Pakistan · Serving nationwide
              </span>
            </div>

            <div className="footer-column">
              <h3>
                <ShieldCheck size={15} /> Legal
              </h3>
              <a href="/privacy">
                <ShieldCheck size={15} /> Privacy policy
              </a>
              <a href="/terms">Terms of service</a>
            </div>

            <div className="footer-column">
              <h3>
                <ExternalLink size={15} /> Follow
              </h3>
              <a
                href="https://www.facebook.com/profile.php?id=61593563594054"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={15} /> Facebook
              </a>
              <a
                href="https://www.instagram.com/adsboosters.pk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={15} /> Instagram
              </a>
            </div>
          </div>

          <div className="footer-meta">
            <div className="copyright">© 2026 AdsBoosters.pk</div>
            <div className="footer-platforms">Google · Meta · TikTok</div>
            <div className="footer-credit">
              Designed and developed by{" "}
              <a
                href="https://deepdevsolutions.com"
                target="_blank"
                rel="noreferrer"
              >
                Deep Dev Solutions <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {WHATSAPP_NUMBER ? (
        <div className="mobile-sticky-cta">
          <a
            className="whatsapp-button full-width"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquareText size={18} />
            Chat on WhatsApp
          </a>
        </div>
      ) : null}
    </main>
  );
}
