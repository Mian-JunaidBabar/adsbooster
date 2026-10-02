"use client";

import { useEffect, useRef } from "react";
import { COUNT_UP_MS, decimalsOf, formatCount, valueAt } from "../lib/count-up";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
};

/**
 * Renders the final number on the server. In the browser it counts up once,
 * when the surrounding strip is 40% visible, and stops on the exact value.
 * Reduced-motion and no-JS visitors just keep the number they were served.
 */
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = decimalsOf(value);
  const finalText = `${prefix}${formatCount(value, decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const show = (n: number) => {
      el.textContent = `${prefix}${formatCount(n, decimals)}${suffix}`;
    };
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          show(valueAt(elapsed, value));
          if (elapsed < COUNT_UP_MS) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    show(0);
    observer.observe(el.closest("[data-count-scope]") ?? el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = finalText;
    };
  }, [value, prefix, suffix, decimals, finalText]);

  return <span ref={ref}>{finalText}</span>;
}
