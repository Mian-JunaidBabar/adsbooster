"use client";

import { useEffect, useState } from "react";
import WhatsAppLogo from "./WhatsAppLogo";

/** Mobile bar that slides up once the hero has scrolled out of view. */
export default function StickyWhatsApp({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) =>
      setVisible(!entry.isIntersecting),
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mobile-sticky-cta" data-visible={visible}>
      <a
        className="whatsapp-button full-width"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppLogo size={20} />
        Chat on WhatsApp
      </a>
    </div>
  );
}
