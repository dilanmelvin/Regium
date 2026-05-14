import type { Validator } from "@regium/types";
import { luhnIsValid } from "@regium/utils";
import { regex } from "../primitives.js";

/** Canadian Social Insurance Number (Luhn-protected, 9 digits). */
export const sin: Validator = {
  id: "ca.sin",
  description: "Canadian Social Insurance Number",
  jurisdiction: "CA",
  kind: "checksum",
  validate(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 9) {
      return {
        ok: false,
        errors: [{ code: "E_FORMAT", message: "SIN must be 9 digits" }],
        normalized: digits,
      };
    }
    return luhnIsValid(digits)
      ? { ok: true, errors: [], normalized: digits }
      : {
          ok: false,
          errors: [{ code: "E_CHECKSUM", message: "SIN Luhn check failed" }],
          normalized: digits,
        };
  },
};

/** Canadian Business Number (BN), 9 digits. */
export const bn: Validator = regex({
  id: "ca.bn",
  description: "Canadian Business Number (CRA)",
  jurisdiction: "CA",
  pattern: /^\d{9}$/,
  canonical: false,
});

/** Canadian postal code (A1A 1A1). */
export const caPostal: Validator = regex({
  id: "ca.postal",
  description: "Canadian postal code",
  jurisdiction: "CA",
  pattern: /^[ABCEGHJKLMNPRSTVXY]\d[A-Z] ?\d[A-Z]\d$/i,
  canonical: false,
});

/** Canadian transit number (5 digits) + institution number (3 digits). */
export const transit: Validator = regex({
  id: "ca.transit",
  description: "Canadian bank transit + institution",
  jurisdiction: "CA",
  pattern: /^\d{5}-?\d{3}$/,
  canonical: false,
});

export const caValidators: Validator[] = [sin, bn, caPostal, transit];
