/**
 * Reusable checksum primitives used by validators.
 * All functions are pure and side-effect free.
 */

/** ISO 7064 mod-97-10 (used by IBAN). Returns remainder when treated as integer mod 97. */
export function mod97(value: string): number {
  // Process the string in chunks to avoid BigInt overhead while staying correct.
  let remainder = 0;
  for (const ch of value) {
    const digit = ch.charCodeAt(0);
    if (digit >= 48 && digit <= 57) {
      remainder = (remainder * 10 + (digit - 48)) % 97;
    } else if (digit >= 65 && digit <= 90) {
      // A=10, B=11 ... Z=35
      const code = digit - 55;
      remainder = (remainder * 100 + code) % 97;
    } else if (digit >= 97 && digit <= 122) {
      const code = digit - 87;
      remainder = (remainder * 100 + code) % 97;
    } else {
      // Skip whitespace / punctuation
    }
  }
  return remainder;
}

/** Luhn (mod-10) checksum, used by credit cards and many national IDs. */
export function luhnIsValid(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** Verhoeff checksum, used by India's Aadhaar. */
const VERHOEFF_D: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

export function verhoeffIsValid(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return false;
  let c = 0;
  const reversed = [...digits].reverse();
  for (let i = 0; i < reversed.length; i++) {
    const ch = reversed[i];
    if (ch === undefined) return false;
    const d = Number(ch);
    if (Number.isNaN(d)) return false;
    const row = VERHOEFF_D[c];
    if (!row) return false;
    const pRow = VERHOEFF_P[i % 8];
    if (!pRow) return false;
    const pVal = pRow[d];
    if (pVal === undefined) return false;
    const next = row[pVal];
    if (next === undefined) return false;
    c = next;
  }
  return c === 0;
}

/** Strip non-alphanumeric and uppercase. */
export function canonicalize(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}
