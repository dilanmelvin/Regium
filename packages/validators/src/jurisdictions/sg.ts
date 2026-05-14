import type { Validator } from "@regium/types";
import { checksum, regex } from "../primitives.js";

const NRIC_WEIGHTS = [2, 7, 6, 5, 4, 3, 2];
const NRIC_ST_LETTERS = "JZIHGFEDCBA";
const NRIC_FG_LETTERS = "XWUTRQPNMLK";
const NRIC_MY_LETTERS = "JZIHGFEDCBA"; // legacy mapping

/** Singapore NRIC / FIN. */
export const nric: Validator = checksum({
  id: "sg.nric",
  description: "Singapore NRIC / FIN",
  jurisdiction: "SG",
  format: /^[STFGM]\d{7}[A-Z]$/,
  check: (v) => {
    const prefix = v[0];
    const digits = v.slice(1, 8);
    const provided = v[8];
    if (!prefix || !provided) return false;
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const ch = digits[i];
      if (ch === undefined) return false;
      sum += Number(ch) * (NRIC_WEIGHTS[i] ?? 1);
    }
    if (prefix === "T" || prefix === "G") sum += 4;
    if (prefix === "M") sum += 3;
    const idx = sum % 11;
    let table: string;
    if (prefix === "S" || prefix === "T") table = NRIC_ST_LETTERS;
    else if (prefix === "F" || prefix === "G") table = NRIC_FG_LETTERS;
    else if (prefix === "M") table = NRIC_MY_LETTERS;
    else return false;
    return table[idx] === provided;
  },
});

/** Singapore Unique Entity Number (relaxed format). */
export const uen: Validator = regex({
  id: "sg.uen",
  description: "Singapore Unique Entity Number (ACRA)",
  jurisdiction: "SG",
  pattern: /^(\d{8}[A-Z]|\d{9}[A-Z]|[ST]\d{2}[A-Z]{2}\d{4}[A-Z]|R\d{2}LP\d{4}[A-Z])$/,
  canonical: true,
});

/** Singapore postal code. */
export const sgPostal: Validator = regex({
  id: "sg.postal",
  description: "Singapore 6-digit postal code",
  jurisdiction: "SG",
  pattern: /^\d{6}$/,
  canonical: false,
});

export const sgValidators: Validator[] = [nric, uen, sgPostal];
