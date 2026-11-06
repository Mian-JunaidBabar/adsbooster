import Image from "next/image";

/** Persistent WhatsApp logo button, bottom-right on tablet and desktop. */
export default function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <a
      className="whatsapp-button floating-whatsapp"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <Image
        src="/whatsapp-logo.svg"
        alt=""
        width={64}
        height={64}
        priority
        aria-hidden="true"
      />
    </a>
  );
}
