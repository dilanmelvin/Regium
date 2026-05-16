import type { Validator } from "../types/index.js";
import { regex } from "./primitives.js";

/** UAE Emirates ID (15 digits, format 784-YYYY-NNNNNNN-N). */
export const emiratesId: Validator = regex({
  id: "ae.emirates-id",
  description: "UAE Emirates ID",
  jurisdiction: "AE",
  pattern: /^784-?\d{4}-?\d{7}-?\d$/,
  canonical: false,
});

/** UAE Trade Licence number (relaxed). */
export const aeTradeLicence: Validator = regex({
  id: "ae.trade-licence",
  description: "UAE Trade Licence Number",
  jurisdiction: "AE",
  pattern: /^[A-Z0-9-]{4,20}$/i,
  canonical: false,
});

/** UAE Tax Registration Number (TRN). 15 digits. */
export const aeTrn: Validator = regex({
  id: "ae.trn",
  description: "UAE Tax Registration Number (FTA)",
  jurisdiction: "AE",
  pattern: /^\d{15}$/,
  canonical: false,
});

export const aeValidators: Validator[] = [emiratesId, aeTradeLicence, aeTrn];
