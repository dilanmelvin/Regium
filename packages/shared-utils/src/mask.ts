/**
 * Apply a display mask to a string. Mask characters:
 *   A — uppercase letter
 *   a — lowercase letter
 *   9 — digit
 *   * — any character
 * Any other mask character is preserved literally.
 */
export function applyMask(value: string, mask: string): string {
  const chars = [...value];
  let i = 0;
  let out = "";
  for (const m of mask) {
    const ch = chars[i];
    if (ch === undefined) break;
    if (m === "A") {
      out += ch.toUpperCase();
      i++;
    } else if (m === "a") {
      out += ch.toLowerCase();
      i++;
    } else if (m === "9") {
      if (/[0-9]/.test(ch)) {
        out += ch;
        i++;
      } else {
        i++; // skip mismatched
      }
    } else if (m === "*") {
      out += ch;
      i++;
    } else {
      out += m;
      // only consume input if it matches the literal
      if (ch === m) i++;
    }
  }
  return out;
}

/** Replace the middle of a string with `*` for display of sensitive values. */
export function maskSensitive(value: string, visibleStart = 2, visibleEnd = 2): string {
  if (value.length <= visibleStart + visibleEnd) {
    return "*".repeat(value.length);
  }
  const start = value.slice(0, visibleStart);
  const end = value.slice(value.length - visibleEnd);
  const hidden = "*".repeat(Math.max(value.length - visibleStart - visibleEnd, 0));
  return `${start}${hidden}${end}`;
}
