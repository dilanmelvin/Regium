import type { Validator } from "../types/index.js";
import { canonicalize, verhoeffIsValid } from "../utils/index.js";
import { checksum, regex } from "./primitives.js";

/** Indian Permanent Account Number (PAN). 10 alphanumeric: AAAAA9999A. */
export const pan: Validator = regex({
  id: "in.pan",
  description: "Permanent Account Number (Income Tax Department)",
  jurisdiction: "IN",
  pattern: /^[A-Z]{5}\d{4}[A-Z]$/,
  canonical: true,
});

/** Indian Tax Deduction Account Number. 10 alphanumeric: AAAA9999A. */
export const tan: Validator = regex({
  id: "in.tan",
  description: "Tax Deduction and Collection Account Number",
  jurisdiction: "IN",
  pattern: /^[A-Z]{4}\d{5}[A-Z]$/,
  canonical: true,
});

/** GSTIN: 15-character format with state, PAN, entity, default 'Z' and check digit. */
export const gstin: Validator = checksum({
  id: "in.gstin",
  description: "Goods and Services Tax Identification Number",
  jurisdiction: "IN",
  format: /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  check: (v) => {
    // GSTIN check digit per the GSTN algorithm.
    const code = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const factor = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      const ch = v[i];
      if (ch === undefined) return false;
      const idx = code.indexOf(ch);
      if (idx < 0) return false;
      const f = factor[i] ?? 1;
      const product = idx * f;
      sum += Math.floor(product / 36) + (product % 36);
    }
    const checkValue = (36 - (sum % 36)) % 36;
    const expected = code[checkValue];
    return expected === v[14];
  },
});

/** Aadhaar: 12-digit ID with Verhoeff checksum. */
export const aadhaar: Validator = checksum({
  id: "in.aadhaar",
  description: "Aadhaar number (UIDAI) with Verhoeff checksum",
  jurisdiction: "IN",
  format: /^\d{12}$/,
  check: (v) => verhoeffIsValid(v),
});

/** Indian Financial System Code (banking). */
export const ifsc: Validator = regex({
  id: "in.ifsc",
  description: "Indian Financial System Code (RBI)",
  jurisdiction: "IN",
  pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  canonical: true,
});

/** Corporate Identification Number (CIN), 21 chars. */
export const cin: Validator = regex({
  id: "in.cin",
  description: "Corporate Identification Number (MCA)",
  jurisdiction: "IN",
  pattern: /^[LUF]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
  canonical: true,
});

/** Universal Account Number (PF). */
export const uan: Validator = regex({
  id: "in.uan",
  description: "Universal Account Number (EPFO)",
  jurisdiction: "IN",
  pattern: /^\d{12}$/,
  canonical: true,
});

export const inValidators: Validator[] = [pan, tan, gstin, aadhaar, ifsc, cin, uan];
