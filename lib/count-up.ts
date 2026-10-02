export const COUNT_UP_MS = 1600;

/** Ease-out cubic: fast start, gentle landing. */
export function easeOut(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function decimalsOf(value: number) {
  return (String(value).split(".")[1] ?? "").length;
}

export function formatCount(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** The number to show `elapsedMs` after the count started. Lands on `end` exactly. */
export function valueAt(elapsedMs: number, end: number) {
  if (elapsedMs >= COUNT_UP_MS) return end;
  if (elapsedMs <= 0) return 0;
  return end * easeOut(elapsedMs / COUNT_UP_MS);
}
