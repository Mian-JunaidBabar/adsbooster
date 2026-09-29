export function normalizePhone(
  input: string | null | undefined,
): string | null {
  if (!input) return null;

  const cleaned = input
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-()]/g, "")
    .replace(/^00/, "+");

  if (!/^\+?[0-9]+$/.test(cleaned)) return null;

  const digits = cleaned.replace(/\+/g, "");

  if (digits.startsWith("92") && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `+92${digits.slice(1)}`;
  }

  if (digits.length === 10 && digits.startsWith("3")) {
    return `+92${digits}`;
  }

  if (cleaned.startsWith("+92") && digits.length === 12) {
    return `+${digits}`;
  }

  return null;
}
