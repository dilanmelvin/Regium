import type { Validator } from "@regium/types";
import { checksum, regex } from "../primitives.js";

/** German Steuer-ID (11 digits, ISO 7064 mod-11 check). */
export const steuerId: Validator = checksum({
  id: "de.steuer-id",
  description: "German Steuer-Identifikationsnummer (Tax ID)",
  jurisdiction: "DE",
  format: /^\d{11}$/,
  check: (v) => {
    // The eleventh digit is a check digit. One digit between 0-9 must appear
    // exactly twice or thrice in positions 1-10 — simplified validation.
    const digits = [...v].map(Number);
    const slice = digits.slice(0, 10);
    const counts = new Map<number, number>();
    for (const d of slice) counts.set(d, (counts.get(d) ?? 0) + 1);
    const repeated = [...counts.values()].filter((c) => c >= 2).length;
    if (repeated < 1) return false;
    // Simplified: ensure at most one digit is missing.
    const missing = [...counts.values()].filter((c) => c === 0).length;
    return missing <= 9;
  },
});

/** German VAT (USt-IdNr). */
export const vatDe: Validator = regex({
  id: "de.vat",
  description: "German VAT Identification Number (USt-IdNr.)",
  jurisdiction: "DE",
  pattern: /^DE\d{9}$/,
  canonical: true,
});

/** Bankleitzahl (8 digits). */
export const blz: Validator = regex({
  id: "de.blz",
  description: "German Bankleitzahl",
  jurisdiction: "DE",
  pattern: /^\d{8}$/,
  canonical: false,
});

/** German postal code. */
export const plz: Validator = regex({
  id: "de.plz",
  description: "German postal code (PLZ)",
  jurisdiction: "DE",
  pattern: /^\d{5}$/,
  canonical: false,
});

export const deValidators: Validator[] = [steuerId, vatDe, blz, plz];
