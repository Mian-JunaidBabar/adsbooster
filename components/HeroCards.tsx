import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import type { ProofStat } from "../lib/content";
import { PhoneChatMotif } from "./motifs";

type HeroCardsProps = {
  client: string;
  stats: ProofStat[];
  chips: string[];
};

/**
 * The hero's right side: real results numbers on floating cards around a
 * phone drawing. Rises in after the hero copy (hero entrance index 6 on),
 * then the cards drift slowly; the loop pauses while off screen.
 */
export default function HeroCards({ client, stats, chips }: HeroCardsProps) {
  return (
    <div className="hero-visual" data-pause-offscreen>
      <PhoneChatMotif className="hero-phone hero-rise" />
      {stats.map(({ value, prefix, suffix, label }, i) => (
        <div
          key={label}
          className="float-card hero-rise"
          style={{ "--i": 6 + i } as CSSProperties}
        >
          <p className="float-card-value">
            {prefix}
            {value}
            {suffix}
          </p>
          <p className="float-card-label">
            {label} · <strong>{client}</strong>
          </p>
          {chips[i] ? (
            <span className="chip">
              <Check size={14} aria-hidden="true" />
              {chips[i]}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
