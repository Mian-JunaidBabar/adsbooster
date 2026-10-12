"use client";

import { Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";

type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/**
 * Proof screenshots side by side (equal heights on desktop: each column is as
 * wide as its image's aspect ratio). A tap opens the image full size in a
 * native <dialog>, so visitors can check the numbers. Esc, the close button or
 * a tap on the backdrop closes it.
 */
export default function ResultShots({ shots }: { shots: Shot[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Shot | null>(null);

  const open = (shot: Shot) => {
    setActive(shot);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  const columns = shots
    .map(({ width, height }) => `${(width / height).toFixed(3)}fr`)
    .join(" ");

  return (
    <>
      <div
        className="result-shots"
        style={{ "--shot-cols": columns } as CSSProperties}
      >
        {shots.map((shot, i) => (
          <figure
            key={shot.src}
            className="result-shot"
            data-reveal
            data-reveal-delay={i}
          >
            <button
              type="button"
              className="result-shot-frame"
              onClick={() => open(shot)}
              aria-label={`View full size: ${shot.caption}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes="(max-width: 767px) 100vw, 60vw"
              />
              <span className="result-shot-zoom" aria-hidden="true">
                <Maximize2 size={16} />
              </span>
            </button>
            <figcaption>{shot.caption}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={active?.caption ?? "Screenshot"}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onClose={() => setActive(null)}
      >
        {active ? (
          <figure>
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="100vw"
            />
            <figcaption>{active.caption}</figcaption>
          </figure>
        ) : null}
        <button
          type="button"
          className="lightbox-close"
          onClick={close}
          aria-label="Close"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </dialog>
    </>
  );
}
