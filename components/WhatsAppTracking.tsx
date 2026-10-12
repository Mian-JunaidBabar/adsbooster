"use client";

import { useEffect } from "react";
import { trackLead } from "../lib/track";

/**
 * Fires a Lead event for every WhatsApp link click on the page, with one
 * listener instead of a handler on each button. `placement` is the id of the
 * section the link sits in, or "header" / "sticky-bar".
 */
export default function WhatsAppTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(
        'a[href^="https://wa.me/"]',
      );
      if (!link) return;
      const placement =
        link.closest("section[id]")?.id ??
        (link.closest(".site-header")
          ? "header"
          : link.closest(".mobile-sticky-cta")
            ? "sticky-bar"
            : "other");
      trackLead("whatsapp", placement);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
