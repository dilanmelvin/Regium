import type { Validator } from "@regium/types";
import { regex } from "../primitives.js";

/** US Social Security Number. */
export const ssn: Validator = regex({
  id: "us.ssn",
  description: "US Social Security Number",
  jurisdiction: "US",
  pattern: /^(?!000|666|9\d{2})\d{3}-?(?!00)\d{2}-?(?!0000)\d{4}$/,
  canonical: false,
});

/** US Employer Identification Number. */
export const ein: Validator = regex({
  id: "us.ein",
  description: "Employer Identification Number (IRS)",
  jurisdiction: "US",
  pattern: /^\d{2}-?\d{7}$/,
  canonical: false,
});

/** US ABA routing number. 9 digits with mod-10 weighted check. */
export const aba: Validator = {
  id: "us.aba-routing",
  description: "ABA Routing Transit Number",
  jurisdiction: "US",
  kind: "checksum",
  validate(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 9) {
      return {
        ok: false,
        errors: [{ code: "E_FORMAT", message: "ABA routing must be 9 digits" }],
        normalized: digits,
      };
    }
    const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const ch = digits[i];
      if (ch === undefined)
        return { ok: false, errors: [{ code: "E_FORMAT", message: "Invalid ABA digit" }] };
      sum += Number(ch) * (weights[i] ?? 1);
    }
    const ok = sum % 10 === 0;
    return ok
      ? { ok: true, errors: [], normalized: digits }
      : {
          ok: false,
          errors: [{ code: "E_CHECKSUM", message: "ABA routing checksum failed" }],
          normalized: digits,
        };
  },
};

/** US ZIP code (5 or ZIP+4). */
export const zip: Validator = regex({
  id: "us.zip",
  description: "US ZIP code (5 or ZIP+4)",
  jurisdiction: "US",
  pattern: /^\d{5}(-\d{4})?$/,
  canonical: false,
});

export const usValidators: Validator[] = [ssn, ein, aba, zip];
