import type { ValidationResult, Validator } from "../types/index.js";

/**
 * A small set of universally useful validators registered automatically
 * by `createRegium()` so consumers can validate IBAN/SWIFT/email/phone
 * without explicitly installing or registering @regium/validators.
 *
 * For richer jurisdictional validators, install @regium/validators or
 * use a country pack.
 */

function canonicalize(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function mod97(value: string): number {
  let remainder = 0;
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code >= 48 && code <= 57) remainder = (remainder * 10 + (code - 48)) % 97;
    else if (code >= 65 && code <= 90) remainder = (remainder * 100 + (code - 55)) % 97;
  }
  return remainder;
}

const iban: Validator = {
  id: "global.iban",
  description: "International Bank Account Number (ISO 13616) — mod-97 checksum",
  jurisdiction: "global",
  kind: "checksum",
  normalize: (v) => canonicalize(v),
  validate(value): ValidationResult {
    const c = canonicalize(value);
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(c)) {
      return {
        ok: false,
        errors: [{ code: "E_FORMAT", message: "Invalid IBAN format" }],
        normalized: c,
      };
    }
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
    return canonicalize(value)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  },
};

const swift: Validator = {
  id: "global.swift",
  description: "SWIFT/BIC code (ISO 9362)",
  jurisdiction: "global",
  kind: "regex",
  normalize: (v) => canonicalize(v),
  validate(value): ValidationResult {
    const c = canonicalize(value);
    return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(c)
      ? { ok: true, errors: [], normalized: c }
      : { ok: false, errors: [{ code: "E_FORMAT", message: "Invalid SWIFT/BIC" }], normalized: c };
  },
};

const phoneE164: Validator = {
  id: "global.phone-e164",
  description: "E.164 international phone number",
  jurisdiction: "global",
  kind: "regex",
  validate(value): ValidationResult {
    const v = value.trim();
    return /^\+[1-9]\d{1,14}$/.test(v)
      ? { ok: true, errors: [], normalized: v }
      : {
          ok: false,
          errors: [{ code: "E_FORMAT", message: "Invalid E.164 phone" }],
          normalized: v,
        };
  },
};

const email: Validator = {
  id: "global.email",
  description: "RFC 5322-compliant email address",
  jurisdiction: "global",
  kind: "regex",
  validate(value): ValidationResult {
    const v = value.trim();
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
      ? { ok: true, errors: [], normalized: v }
      : { ok: false, errors: [{ code: "E_FORMAT", message: "Invalid email" }], normalized: v };
  },
};

const passThrough: Validator = {
  id: "global.passthrough",
  description: "Always-valid pass-through",
  jurisdiction: "global",
  kind: "custom",
  validate: (value) => ({ ok: true, errors: [], normalized: value.trim() }),
};

export const globalValidators: Validator[] = [iban, swift, phoneE164, email, passThrough];
