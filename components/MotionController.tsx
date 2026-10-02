"use client";

import { useEffect } from "react";

const STAGGER_MS = 70;
const FAILSAFE_MS = 2500;

/**
 * The one script behind all motion on the page. It renders nothing.
 *
 * - Scroll reveals: elements marked `data-reveal` (optional `data-reveal-delay`
 *   = stagger index) rise in once when 15% visible. CSS only hides them after
 *   this script adds `reveal-ready` to <html>, so without JS, without
 *   IntersectionObserver, or with reduced motion everything is simply visible.
 * - Off-screen loops: `data-pause-offscreen` elements get `data-paused="true"`
 *   while they are out of view, which CSS uses to pause their animation.
 */
export default function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const observers: IntersectionObserver[] = [];
    let failsafe: number | undefined;

    if ("IntersectionObserver" in window) {
      const loops = document.querySelectorAll<HTMLElement>(
        "[data-pause-offscreen]",
      );
      const loopObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.paused = String(
            !entry.isIntersecting,
          );
        }
      });
      loops.forEach((el) => loopObserver.observe(el));
      observers.push(loopObserver);
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduced && "IntersectionObserver" in window) {
      const items = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal]"),
      );
      const reveal = (el: HTMLElement) => el.classList.add("is-revealed");

      // Anything already on screen stays put: no hiding, no delay.
      const pending = items.filter((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (top < window.innerHeight && bottom > 0) {
          el.classList.add("is-revealed", "is-instant");
          return false;
        }
        el.style.setProperty(
          "--reveal-delay",
          `${(Number(el.dataset.revealDelay) || 0) * STAGGER_MS}ms`,
        );
        return true;
      });

      const revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target as HTMLElement);
            revealObserver.unobserve(entry.target);
          }
        },
        { threshold: 0.15 },
      );
      pending.forEach((el) => revealObserver.observe(el));
      observers.push(revealObserver);

      root.classList.add("reveal-ready");

      // A broken observer must never leave blank sections.
      const armFailsafe = () => {
        failsafe = window.setTimeout(() => {
          pending.forEach((el) => {
            if (!el.classList.contains("is-revealed")) {
              el.classList.add("is-instant");
              reveal(el);
            }
          });
        }, FAILSAFE_MS);
      };
      if (document.readyState === "complete") armFailsafe();
      else window.addEventListener("load", armFailsafe, { once: true });
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.clearTimeout(failsafe);
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
