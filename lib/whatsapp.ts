const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(
  /\D/g,
  "",
);

if (process.env.NODE_ENV === "production" && !WHATSAPP_NUMBER) {
  console.warn(
    "WARNING: NEXT_PUBLIC_WHATSAPP_NUMBER is missing. WhatsApp buttons will be hidden.",
  );
}

export const hasWhatsApp = WHATSAPP_NUMBER.length > 0;

/** wa.me link with a prefilled message, or "" when no number is configured. */
export function whatsappLink(text: string) {
  return hasWhatsApp
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    : "";
}
