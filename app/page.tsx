"use client";

import Image from "next/image";
import { ArrowRight, Check, MessageSquareText, Play } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

const chipLabels = ["Clinics", "Visa consultants", "Other businesses"];

const services = [
  {
    title: "Performance marketing",
    description:
      "Google, Meta and TikTok campaigns built for leads and booked calls.",
    icon: Play,
  },
  {
    title: "Creative & copy",
    description:
      "Offer testing, hooks and landing page messaging designed around conversion.",
    icon: MessageSquareText,
  },
  {
    title: "Landing pages",
    description:
      "Fast, mobile-first pages that turn traffic into enquiries and WhatsApp chats.",
    icon: ArrowRight,
  },
  {
    title: "Reporting",
    description:
      "Clear weekly reporting with spend, cost per lead, and the next optimisation move.",
    icon: Check,
  },
];

const process = [
  {
    step: "01",
    title: "Audit",
    body: "We review your offer, funnel and current ads to find the bottlenecks.",
  },
  {
    step: "02",
    title: "Build",
    body: "We set up the campaign structure, creative and tracking for faster conversion.",
  },
  {
    step: "03",
    title: "Scale",
    body: "We test offers, audiences and angles to push profitable growth with confidence.",
  },
  {
    step: "04",
    title: "Report",
    body: "You get clear numbers and the next move to keep the pipeline performing.",
  },
];

const stats = [
  { value: "6x", label: "Average ROAS" },
  { value: "3.4x", label: "Lead lift" },
  { value: "10k+", label: "Leads tracked" },
  { value: "PKR 9.8M", label: "Managed spend" },
];

const testimonials = [
  {
    quote:
      "Their team kept the process simple. We got cleaner leads, a stronger offer and a better pipeline in under a month.",
    name: "Dr. Ayesha Noor",
    role: "Clinic owner",
    business: "Aster Care",
    city: "Lahore",
  },
  {
    quote:
      "We were getting traffic but not the right enquiries. AdsBoosters rebuilt the funnel and the quality improved immediately.",
    name: "Hamza Iqbal",
    role: "Director",
    business: "Northview Visa",
    city: "Islamabad",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "PKR 25,000",
    description:
      "Best for new businesses and small clinics testing paid ads with a focused funnel.",
    features: ["Campaign setup", "Landing page review", "Weekly reporting"],
  },
  {
    name: "Growth",
    price: "PKR 60,000",
    description:
      "Built for brands ready to scale beyond one campaign and improve lead quality at the same time.",
    features: [
      "Everything in Starter",
      "Creative testing",
      "Conversion optimization",
    ],
  },
];

const faqs = [
  {
    question: "How fast can we launch?",
    answer:
      "Most campaigns launch within 7 to 14 days after we receive the offer, ad account access, and goals.",
  },
  {
    question: "Do you work with clinics and visa consultants?",
    answer:
      "Yes. We work with health clinics, visa consultants, education businesses and local service companies that need better leads.",
  },
  {
    question: "Do you handle creatives and landing pages?",
    answer:
      "Yes. We create ad creative, campaign copy and landing page messaging that supports the offer and conversion goals.",
  },
  {
    question: "What do you charge?",
    answer:
      "Pricing depends on the campaign scope, ad spend and reporting requirements. We keep it transparent and tied to performance.",
  },
];

type LeadFormState = {
  name: string;
  email: string;
  businessType: string;
  city: string;
  phone: string;
  budget: string;
};

const initialForm: LeadFormState = {
  name: "",
  email: "",
  businessType: "",
  city: "",
  phone: "",
  budget: "",
};

export default function Home() {
  const [form, setForm] = useState<LeadFormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LeadFormState, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

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
      if (!value.trim()) {
        nextErrors[key as keyof LeadFormState] = "This field is required.";
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setServerMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setServerMessage(data.error ?? "Your enquiry could not be sent.");
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
  };

  return (
    <main className="adsbooster-page">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-lockup" aria-label="AdsBoosters.pk logo">
            <span className="brand-word">Ads</span>
            <span className="brand-swoosh" aria-hidden="true" />
            <span className="brand-word">Boosters</span>
            <span className="brand-domain">.pk</span>
          </div>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>

          <a
            className="whatsapp-button header-whatsapp"
            href="https://wa.me/923000000000?text=Hi%20AdsBoosters%2C%20I%20want%20a%20free%20ad%20audit"
          >
            <MessageSquareText size={18} />
            WhatsApp
          </a>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-map" aria-hidden="true">
          <Image
            src="/hero-map.png"
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
              {chipLabels.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  className={index === 0 ? "chip active" : "chip"}
                  role="tab"
                  aria-selected={index === 0}
                >
                  {label}
                </button>
              ))}
            </div>

            <h1>More leads from the ads you already run.</h1>

            <p className="hero-subline">
              We help clinics, visa consultants and local businesses turn ad
              spend into qualified enquiries and booked calls.
            </p>

            <div className="cta-stack">
              <a
                className="whatsapp-button full-width"
                href="https://wa.me/923000000000?text=Hi%20AdsBoosters%2C%20I%20want%20a%20free%20ad%20audit"
              >
                <MessageSquareText size={18} />
                Chat on WhatsApp
              </a>
              <span className="reply-line">
                Replies within 15 minutes, 10am–8pm
              </span>
            </div>

            <div className="proof-row">
              <Check size={18} />
              <span>
                Trusted by businesses that want real growth, not vanity metrics.
              </span>
            </div>
          </div>

          <aside className="audit-card">
            <div className="audit-card-inner">
              {isSent ? (
                <>
                  <div className="small-label">Free ad audit</div>
                  <h2>Thanks, we have your details.</h2>
                  <div className="success-box">
                    <Check size={18} />
                    <span>Enquiry received</span>
                  </div>
                  <a
                    className="whatsapp-button full-width"
                    href="https://wa.me/923000000000?text=Hi%20AdsBoosters%2C%20I%20want%20a%20free%20ad%20audit"
                  >
                    <MessageSquareText size={18} />
                    Chat on WhatsApp
                  </a>
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

                  <label className="field-block">
                    <span>Your name</span>
                    <input
                      type="text"
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
                      value={form.email}
                      onChange={handleFieldChange("email")}
                      placeholder="ali@example.com"
                    />
                    {errors.email ? <small>{errors.email}</small> : null}
                  </label>

                  <label className="field-block">
                    <span>Business type</span>
                    <select
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
                      value={form.phone}
                      onChange={handleFieldChange("phone")}
                      placeholder="03XX XXXXXXX"
                    />
                    {errors.phone ? <small>{errors.phone}</small> : null}
                  </label>

                  <label className="field-block">
                    <span>Monthly ad budget</span>
                    <select
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
            <div className="eyebrow">How we work</div>
            <h2>A clear process that keeps the funnel moving.</h2>
          </div>

          <div className="card-grid four-up">
            {process.map(({ step, title, body }) => (
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

      <section className="page-section surface-section">
        <div className="container">
          <div className="section-heading-block narrow">
            <div className="eyebrow">Testimonials</div>
            <h2>What clients say when the pipeline starts working.</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map(({ quote, name, role, business, city }) => (
              <blockquote key={name} className="testimonial-box">
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

      <section id="pricing" className="page-section paper-section">
        <div className="container">
          <div className="section-heading-block narrow">
            <div className="eyebrow">Pricing</div>
            <h2>Simple monthly plans for businesses ready to grow.</h2>
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
                <button type="button" className="secondary-button">
                  Get a free ad audit
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="page-section surface-section">
        <div className="container faq-wrap">
          <div className="section-heading-block narrow">
            <div className="eyebrow">FAQ</div>
            <h2>Questions clients ask before starting.</h2>
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
            <div>
              <div className="small-label light">
                Want better campaign results?
              </div>
              <h2>Book a free ad audit.</h2>
            </div>

            <a
              className="whatsapp-button"
              href="https://wa.me/923000000000?text=Hi%20AdsBoosters%2C%20I%20want%20a%20free%20ad%20audit"
            >
              <MessageSquareText size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand" aria-label="AdsBoosters.pk footer logo">
            <Image
              src="/logo-white.png"
              alt="AdsBoosters.pk"
              width={160}
              height={32}
            />
          </div>

          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="copyright">© 2026 AdsBoosters.pk</div>
        </div>
      </footer>
    </main>
  );
}
