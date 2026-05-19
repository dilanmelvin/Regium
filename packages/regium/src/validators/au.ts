import type { Validator } from "../types/index.js";
import { checksum, regex } from "./primitives.js";

/** Australian Tax File Number (TFN). 8 or 9 digit weighted check. */
export const tfn: Validator = checksum({
  id: "au.tfn",
  description: "Australian Tax File Number (ATO)",
  jurisdiction: "AU",
  format: /^\d{8,9}$/,
  check: (v) => {
    const weights8 = [10, 7, 8, 4, 6, 3, 5, 1];
    const weights9 = [1, 4, 3, 7, 5, 8, 6, 9, 10];
    const weights = v.length === 8 ? weights8 : weights9;
    let sum = 0;
    for (let i = 0; i < v.length; i++) {
      const ch = v[i];
      if (ch === undefined) return false;
      sum += Number(ch) * (weights[i] ?? 1);
    }
    return sum % 11 === 0;
  },
});

/** Australian Business Number (ABN). 11 digits with weighted check. */
export const abn: Validator = checksum({
  id: "au.abn",
  description: "Australian Business Number (ATO)",
  jurisdiction: "AU",
  format: /^\d{11}$/,
  check: (v) => {
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    let sum = 0;
    for (let i = 0; i < 11; i++) {
      const ch = v[i];
      if (ch === undefined) return false;
      let n = Number(ch);
      if (i === 0) n -= 1;
      sum += n * (weights[i] ?? 1);
    }
    return sum % 89 === 0;
  },
});

/** Bank-State-Branch code (BSB). 6 digits with optional dash. */
export const bsb: Validator = regex({
  id: "au.bsb",
  description: "Australian Bank-State-Branch code",
  jurisdiction: "AU",
  pattern: /^\d{3}-?\d{3}$/,
  canonical: false,
});

export const auValidators: Validator[] = [tfn, abn, bsb];
