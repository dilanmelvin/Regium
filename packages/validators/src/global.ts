import type { Validator } from "@regium/types";
import { canonicalize, luhnIsValid, mod97 } from "@regium/utils";
import { checksum, regex } from "./primitives.js";

/** ISO 13616 IBAN validator (mod-97-10). Optional country-specific length check. */
export const iban: Validator = {
  id: "global.iban",
  description: "International Bank Account Number (ISO 13616) — mod-97 checksum",
  jurisdiction: "global",
  kind: "checksum",
  normalize: (v) => canonicalize(v),
  validate(value) {
    const c = canonicalize(value);
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(c)) {
      return {
        ok: false,
        errors: [{ code: "E_FORMAT", message: "Invalid IBAN format" }],
        normalized: c,
      };
    }
    // Move first 4 chars to end and run mod-97.
    const rearranged = c.slice(4) + c.slice(0, 4);
    const ok = mod97(rearranged) === 1;
    return ok
      ? { ok: true, errors: [], normalized: c }
      : {
          ok: false,
          errors: [{ code: "E_CHECKSUM", message: "IBAN checksum failed" }],
          normalized: c,
        };
  },
  format(value) {
    const c = canonicalize(value);
    return c.replace(/(.{4})/g, "$1 ").trim();
  },
};

/** ISO 9362 SWIFT/BIC code (8 or 11 chars). */
export const swift: Validator = regex({
  id: "global.swift",
  description: "SWIFT/BIC code (ISO 9362)",
  jurisdiction: "global",
  pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  canonical: true,
});

/** E.164 phone number. */
export const phoneE164: Validator = regex({
  id: "global.phone-e164",
  description: "E.164 international phone number",
  jurisdiction: "global",
  pattern: /^\+[1-9]\d{1,14}$/,
  canonical: false,
});

/** Email per a pragmatic subset of RFC 5322. */
export const email: Validator = regex({
  id: "global.email",
  description: "RFC 5322-compliant email address",
  jurisdiction: "global",
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  canonical: false,
});

/** Luhn-protected number (e.g., generic credit card). */
export const luhn: Validator = checksum({
  id: "global.luhn",
  description: "Luhn (mod-10) check",
  jurisdiction: "global",
  format: /^\d{8,19}$/,
  check: (v) => luhnIsValid(v),
});

/** A no-op validator that always passes. Useful as a placeholder. */
export const passThrough: Validator = {
  id: "global.passthrough",
  description: "Always-valid pass-through",
  jurisdiction: "global",
  kind: "custom",
  validate: (value) => ({ ok: true, errors: [], normalized: value.trim() }),
};

/** Built-in global validators registered by default. */
export const globalValidators: Validator[] = [iban, swift, phoneE164, email, luhn, passThrough];
