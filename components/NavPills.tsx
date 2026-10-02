"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavPillsProps = {
  items: { id: string; label: string }[];
};

/**
 * Section pills for the sticky header. The pill for the section crossing the
 * middle of the screen is active (one IntersectionObserver, no scroll
 * listeners). Below 860px the pills collapse into a menu button.
 */
export default function NavPills({ items }: NavPillsProps) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        // Last one in page order wins if two touch the band at once.
        setActive(
          items
            .map((item) => item.id)
            .filter((id) => inBand.has(id))
            .pop() ?? "",
        );
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );

    items.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav
        id="site-nav"
        className={open ? "nav-pills is-open" : "nav-pills"}
        aria-label="Main navigation"
      >
        {items.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={active === id ? "active" : undefined}
            aria-current={active === id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <Menu size={20} aria-hidden="true" />
        )}
      </button>
    </>
  );
}
