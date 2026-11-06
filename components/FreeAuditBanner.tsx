"use client";

import { ArrowRight, Check } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { trackLead } from "../lib/track";
import { websiteSchema } from "../lib/website";
import { whatsappLink } from "../lib/whatsapp";

type FreeAuditBannerProps = {
  eyebrow: string;
  headline: string;
  checks: string[];
  label: string;
  placeholder: string;
  button: string;
  note: string;
  whatsappPrefill: string;
};

/**
 * Dark banner with a one-field form: the visitor types their website and
 * WhatsApp opens with it in the message. Nothing is sent from the page, so
 * the note says WhatsApp opens rather than claiming anything was submitted.
 */
export default function FreeAuditBanner({
  eyebrow,
  headline,
  checks,
  label,
  placeholder,
  button,
  note,
  whatsappPrefill,
}: FreeAuditBannerProps) {
  const id = useId();
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = new FormData(event.currentTarget).get("website");
    const result = websiteSchema.safeParse(input ?? "");
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter your website");
      return;
    }
    setError("");
    const href = whatsappLink(`${whatsappPrefill} ${result.data}`);
    if (!href) return;
    trackLead("whatsapp", "audit-banner");
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="audit-banner" data-reveal>
      <div className="audit-banner-copy">
        <div className="eyebrow">{eyebrow}</div>
        <h2 id={`${id}-title`}>{headline}</h2>
        <ul className="audit-banner-checks">
          {checks.map((check) => (
            <li key={check}>
              <Check size={18} aria-hidden="true" />
              {check}
            </li>
          ))}
        </ul>
      </div>

      <form
        className="audit-banner-form"
        onSubmit={onSubmit}
        noValidate
        aria-labelledby={`${id}-title`}
      >
        <label className="sr-only" htmlFor={`${id}-website`}>
          {label}
        </label>
        <div className="audit-banner-field">
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-help`}
            onChange={() => error && setError("")}
          />
          <button type="submit" className="primary-button">
            {button}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
        <p id={`${id}-help`} className="audit-banner-help" aria-live="polite">
          {error ? <span className="audit-banner-error">{error}</span> : note}
        </p>
      </form>
    </div>
  );
}
