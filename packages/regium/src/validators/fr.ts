import type { Validator } from "../types/index.js";
import { regex } from "./primitives.js";

/** French SIREN (9 digits, Luhn). */
export const siren: Validator = {
  id: "fr.siren",
  description: "French SIREN (corporate identifier)",
  jurisdiction: "FR",
  kind: "checksum",
  validate(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 9) {
      return {
        ok: false,
        errors: [{ code: "E_FORMAT", message: "SIREN must be 9 digits" }],
        normalized: digits,
      };
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const ch = digits[i];
      if (ch === undefined)
        return { ok: false, errors: [{ code: "E_FORMAT", message: "Invalid SIREN" }] };
      let n = Number(ch);
      if (i % 2 === 1) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
    }
    return sum % 10 === 0
      ? { ok: true, errors: [], normalized: digits }
      : {
          ok: false,
          errors: [{ code: "E_CHECKSUM", message: "SIREN Luhn check failed" }],
          normalized: digits,
        };
  },
};

/** French SIRET (14 digits, Luhn over the whole). */
export const siret: Validator = {
  id: "fr.siret",
  description: "French SIRET (establishment identifier)",
  jurisdiction: "FR",
  kind: "checksum",
  validate(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 14) {
      return {
        ok: false,
        errors: [{ code: "E_FORMAT", message: "SIRET must be 14 digits" }],
        normalized: digits,
      };
    }
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      const ch = digits[i];
      if (ch === undefined)
        return { ok: false, errors: [{ code: "E_FORMAT", message: "Invalid SIRET" }] };
      let n = Number(ch);
      if (i % 2 === 0) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
    }
    return sum % 10 === 0
      ? { ok: true, errors: [], normalized: digits }
      : {
          ok: false,
          errors: [{ code: "E_CHECKSUM", message: "SIRET Luhn check failed" }],
          normalized: digits,
        };
  },
};

/** French VAT (TVA): FR + 2 chars + SIREN. */
export const tva: Validator = regex({
  id: "fr.tva",
  description: "French VAT Number (TVA)",
  jurisdiction: "FR",
  pattern: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/,
  canonical: true,
});

/** French postal code. */
export const codePostal: Validator = regex({
  id: "fr.code-postal",
  description: "French postal code",
  jurisdiction: "FR",
  pattern: /^\d{5}$/,
  canonical: false,
});

export const frValidators: Validator[] = [siren, siret, tva, codePostal];
