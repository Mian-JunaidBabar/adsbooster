/**
 * Decorative inline SVG drawings. Abstract shapes only (no text, no numbers),
 * so they never stand in for real client data. Colours mirror the tokens in
 * app/globals.css.
 */
const C = {
  ink: "#0b1220",
  navyDeep: "#0a1a30",
  paper: "#f7f8fc",
  line: "#e6e9f0",
  grey: "#c9cfdb",
  boost: "#1f5fff",
  boostTint: "#eaf0ff",
  sky: "#5bb8e0",
  sun: "#ffb020",
};

/** Four-point sparkle centred on (x, y). */
function sparkle(x: number, y: number, r: number) {
  return `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`;
}

/** A phone showing a chat, a new-lead card and a rising bar chart. */
export function PhoneChatMotif({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 460"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="130" cy="448" rx="92" ry="8" fill={C.ink} opacity="0.08" />
      <rect x="20" y="10" width="220" height="430" rx="36" fill={C.navyDeep} />
      <rect x="32" y="22" width="196" height="406" rx="26" fill={C.paper} />
      <rect x="105" y="30" width="50" height="10" rx="5" fill={C.navyDeep} />

      {/* Chat header */}
      <rect x="32" y="50" width="196" height="44" fill="#fff" />
      <circle cx="58" cy="72" r="12" fill={C.boost} />
      <rect
        x="78"
        y="64"
        width="70"
        height="7"
        rx="3.5"
        fill={C.ink}
        opacity="0.85"
      />
      <rect x="78" y="76" width="44" height="5" rx="2.5" fill={C.grey} />
      <rect x="32" y="94" width="196" height="1" fill={C.line} />

      {/* Incoming and outgoing messages */}
      <rect
        x="46"
        y="112"
        width="128"
        height="40"
        rx="14"
        fill="#fff"
        stroke={C.line}
      />
      <rect x="58" y="124" width="96" height="6" rx="3" fill={C.grey} />
      <rect x="58" y="136" width="64" height="6" rx="3" fill={C.grey} />
      <rect x="96" y="166" width="120" height="34" rx="14" fill={C.boost} />
      <rect
        x="108"
        y="180"
        width="90"
        height="6"
        rx="3"
        fill="#fff"
        opacity="0.85"
      />

      {/* New-lead card */}
      <rect
        x="49"
        y="219"
        width="170"
        height="74"
        rx="16"
        fill={C.ink}
        opacity="0.06"
      />
      <rect
        x="46"
        y="216"
        width="170"
        height="74"
        rx="16"
        fill="#fff"
        stroke={C.line}
      />
      <circle cx="70" cy="242" r="12" fill={C.sun} />
      <path
        d="M64.5 242.5l4 4 7-8"
        fill="none"
        stroke={C.navyDeep}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="90"
        y="234"
        width="80"
        height="7"
        rx="3.5"
        fill={C.ink}
        opacity="0.85"
      />
      <rect x="90" y="247" width="56" height="5" rx="2.5" fill={C.grey} />
      <rect x="60" y="266" width="142" height="10" rx="5" fill={C.boostTint} />
      <rect x="60" y="266" width="96" height="10" rx="5" fill={C.boost} />

      {/* Rising bars */}
      <rect x="58" y="354" width="18" height="30" rx="5" fill={C.boostTint} />
      <rect x="86" y="336" width="18" height="48" rx="5" fill={C.boostTint} />
      <rect x="114" y="344" width="18" height="40" rx="5" fill={C.boostTint} />
      <rect x="142" y="318" width="18" height="66" rx="5" fill={C.boostTint} />
      <rect x="170" y="300" width="18" height="84" rx="5" fill={C.boost} />

      <rect
        x="46"
        y="396"
        width="170"
        height="20"
        rx="10"
        fill="#fff"
        stroke={C.line}
      />

      <path d={sparkle(10, 128, 10)} fill={C.sun} />
      <path d={sparkle(250, 64, 8)} fill={C.sky} />
      <path d={sparkle(244, 300, 6)} fill={C.boost} />
    </svg>
  );
}

/** An ad post that isn't working, with a question-mark thought bubble. */
export function ThinkingMotif({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 160"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="90" cy="86" r="68" fill={C.boostTint} />

      {/* Ad post */}
      <rect
        x="33"
        y="73"
        width="96"
        height="72"
        rx="12"
        fill={C.ink}
        opacity="0.06"
      />
      <rect
        x="30"
        y="70"
        width="96"
        height="72"
        rx="12"
        fill="#fff"
        stroke={C.line}
      />
      <rect
        x="40"
        y="80"
        width="76"
        height="30"
        rx="6"
        fill={C.sky}
        opacity="0.3"
      />
      <path
        d="M46 96l14 4 14-2 14 3 20-1"
        fill="none"
        stroke={C.sky}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="40" y="118" width="56" height="6" rx="3" fill={C.grey} />
      <rect x="40" y="128" width="36" height="6" rx="3" fill={C.grey} />

      {/* Thought bubble */}
      <circle cx="126" cy="76" r="4" fill="#fff" stroke={C.line} />
      <circle cx="136" cy="62" r="6" fill="#fff" stroke={C.line} />
      <ellipse cx="146" cy="34" rx="28" ry="24" fill="#fff" stroke={C.line} />
      <path
        d="M138.5 28a7.5 7.5 0 1 1 10.5 6.9c-2 .9-3 2.4-3 4.6v1.5"
        fill="none"
        stroke={C.boost}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="146" cy="48" r="2.6" fill={C.boost} />

      <path d={sparkle(18, 44, 9)} fill={C.sun} />
      <path d={sparkle(160, 122, 6)} fill={C.sky} />
    </svg>
  );
}

/** A megaphone with sound waves, for the dark audit panel. */
export function MegaphoneMotif({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="96" cy="84" r="70" fill="#fff" opacity="0.05" />
      <rect
        x="60"
        y="98"
        width="14"
        height="38"
        rx="5"
        fill="#fff"
        opacity="0.85"
      />
      <path d="M50 66L120 36v96L50 104z" fill={C.boost} />
      <ellipse cx="120" cy="84" rx="10" ry="48" fill={C.sky} />
      <rect x="32" y="64" width="22" height="42" rx="8" fill="#fff" />
      <path
        d="M142 64q12 20 0 40"
        fill="none"
        stroke={C.sun}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M158 50q22 34 0 68"
        fill="none"
        stroke={C.sun}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path d={sparkle(22, 30, 9)} fill={C.sun} />
      <path d={sparkle(180, 138, 6)} fill={C.sky} />
    </svg>
  );
}
