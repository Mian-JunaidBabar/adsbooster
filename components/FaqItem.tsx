"use client";

import { ChevronDown } from "lucide-react";
import { useRef, type MouseEvent } from "react";

const CLOSE_MS = 250;

type FaqItemProps = {
  question: string;
  answer: string;
  index: number;
};

/**
 * A native <details> whose answer opens and closes smoothly. Without JS it is
 * a plain <details>. With JS the summary click is taken over only to animate:
 * `data-open="false"` holds the answer at 0fr while `open` is set or about to
 * be removed, which is what lets the 0fr to 1fr transition run both ways.
 */
export default function FaqItem({ question, answer, index }: FaqItemProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);
  const isOpen = useRef(false);

  const toggle = (event: MouseEvent<HTMLElement>) => {
    const details = detailsRef.current;
    if (!details) return;
    event.preventDefault();
    window.clearTimeout(timer.current);
    cancelAnimationFrame(frame.current ?? 0);

    const opening = !isOpen.current;
    isOpen.current = opening;
    const instant = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (opening) {
      if (instant) {
        details.dataset.open = "true";
        details.open = true;
      } else {
        // Paint the collapsed state for a frame first, so the change can transition.
        details.dataset.open = "false";
        details.open = true;
        frame.current = requestAnimationFrame(() => {
          frame.current = requestAnimationFrame(() => {
            details.dataset.open = "true";
          });
        });
      }
    } else {
      details.dataset.open = "false";
      if (instant) details.open = false;
      else
        timer.current = window.setTimeout(
          () => (details.open = false),
          CLOSE_MS,
        );
    }
  };

  return (
    <details
      ref={detailsRef}
      className="faq-item"
      data-reveal
      data-reveal-delay={index}
    >
      <summary onClick={toggle}>
        {question}
        <ChevronDown className="faq-chevron" size={20} aria-hidden="true" />
      </summary>
      <div className="faq-answer">
        <div>
          <p>{answer}</p>
        </div>
      </div>
    </details>
  );
}
