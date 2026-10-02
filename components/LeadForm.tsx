"use client";

import { ArrowRight, Check, MessageSquareText } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { budgetOptions, businessTypes } from "../lib/form-options";

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

type FormErrors = Partial<Record<keyof LeadFormState, string>>;

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

const attributionParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "ttclid", // TikTok ads may be run later; kept so those clicks are already tracked.
];

/** Fields with error text get aria-invalid and a description link. */
function fieldProps(name: keyof LeadFormState, errors: FormErrors) {
  return errors[name]
    ? { "aria-invalid": true, "aria-describedby": `${name}-error` }
    : {};
}

export default function LeadForm({ whatsappHref }: { whatsappHref: string }) {
  const [form, setForm] = useState<LeadFormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [attribution, setAttribution] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const raw = sessionStorage.getItem("adsbooster_attr");
      const sessionData = raw ? JSON.parse(raw) : {};

      let updated = false;
      for (const param of attributionParams) {
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

  const focusField = (name: string) =>
    setTimeout(() => {
      const el = document.getElementsByName(name)[0];
      if (el) (el as HTMLElement).focus();
    }, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "company" && key !== "businessTypeOther" && !value.trim()) {
        nextErrors[key as keyof LeadFormState] = "This field is required.";
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      focusField(Object.keys(nextErrors)[0]);
      return;
    }

    setIsSubmitting(true);
    setServerMessage("");

    try {
      const { businessTypeOther, ...fields } = form;
      const payload = {
        ...fields,
        ...(form.businessType === "Other" && businessTypeOther.trim()
          ? { businessTypeOther }
          : {}),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.fields) {
          setErrors(data.fields);
          focusField(Object.keys(data.fields)[0]);
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

  if (isSent) {
    return (
      <div className="audit-card-inner audit-success">
        <div className="small-label">Free ad audit</div>
        <h2>Thanks, we have your details.</h2>
        <div className="success-box">
          <Check size={18} aria-hidden="true" />
          <span>Enquiry received</span>
        </div>
        {whatsappHref ? (
          <a
            className="whatsapp-button full-width"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquareText size={18} aria-hidden="true" />
            Chat on WhatsApp
          </a>
        ) : null}
        <button type="button" className="secondary-button" onClick={resetForm}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="audit-card-inner" onSubmit={handleSubmit} noValidate>
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
        className="honeypot"
      />

      <label className="field-block">
        <span>Your name</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleFieldChange("name")}
          placeholder="Ali Khan"
          {...fieldProps("name", errors)}
        />
        {errors.name ? <small id="name-error">{errors.name}</small> : null}
      </label>

      <label className="field-block">
        <span>Email address</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleFieldChange("email")}
          placeholder="ali@example.com"
          {...fieldProps("email", errors)}
        />
        {errors.email ? <small id="email-error">{errors.email}</small> : null}
      </label>

      <label className="field-block">
        <span>What kind of business do you have?</span>
        <select
          name="businessType"
          value={form.businessType}
          onChange={handleFieldChange("businessType")}
          required
          {...fieldProps("businessType", errors)}
        >
          <option value="" disabled>
            Select one
          </option>
          {businessTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        {errors.businessType ? (
          <small id="businessType-error">{errors.businessType}</small>
        ) : null}
      </label>

      {form.businessType === "Other" ? (
        <label className="field-block fade-rise">
          <span>
            Tell us in a few words <em>(optional)</em>
          </span>
          <input
            type="text"
            name="businessTypeOther"
            value={form.businessTypeOther}
            onChange={handleFieldChange("businessTypeOther")}
            placeholder="e.g. Software house"
            maxLength={80}
            {...fieldProps("businessTypeOther", errors)}
          />
          {errors.businessTypeOther ? (
            <small id="businessTypeOther-error">
              {errors.businessTypeOther}
            </small>
          ) : null}
        </label>
      ) : null}

      <label className="field-block">
        <span>City</span>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleFieldChange("city")}
          placeholder="Lahore"
          {...fieldProps("city", errors)}
        />
        {errors.city ? <small id="city-error">{errors.city}</small> : null}
      </label>

      <label className="field-block">
        <span>WhatsApp number</span>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleFieldChange("phone")}
          placeholder="03XX XXXXXXX"
          {...fieldProps("phone", errors)}
        />
        {errors.phone ? <small id="phone-error">{errors.phone}</small> : null}
      </label>

      <label className="field-block">
        <span>Monthly ad budget</span>
        <select
          name="budget"
          value={form.budget}
          onChange={handleFieldChange("budget")}
          {...fieldProps("budget", errors)}
        >
          <option value="" disabled>
            Choose a range
          </option>
          {budgetOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {errors.budget ? (
          <small id="budget-error">{errors.budget}</small>
        ) : null}
      </label>

      {serverMessage ? <div className="form-error">{serverMessage}</div> : null}

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send my details"}
        {!isSubmitting ? <ArrowRight size={16} aria-hidden="true" /> : null}
      </button>
    </form>
  );
}
