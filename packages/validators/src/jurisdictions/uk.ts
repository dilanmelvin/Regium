import type { Validator } from "@regium/types";
import { regex } from "../primitives.js";

/** UK National Insurance Number. */
export const nino: Validator = regex({
  id: "uk.nino",
  description: "UK National Insurance Number",
  jurisdiction: "UK",
  pattern: /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\d{6}[A-D]$/,
  canonical: true,
});

/** UK Unique Taxpayer Reference. */
export const utr: Validator = regex({
  id: "uk.utr",
  description: "UK Unique Taxpayer Reference (HMRC)",
  jurisdiction: "UK",
  pattern: /^\d{10}$/,
  canonical: true,
});

/** UK Sort Code. */
export const sortCode: Validator = regex({
  id: "uk.sort-code",
  description: "UK bank sort code",
  jurisdiction: "UK",
  pattern: /^\d{2}-?\d{2}-?\d{2}$/,
  canonical: false,
});

/** UK postcode (relaxed BS 7666). */
export const postcode: Validator = regex({
  id: "uk.postcode",
  description: "UK postcode",
  jurisdiction: "UK",
  pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
  canonical: false,
});

export const ukValidators: Validator[] = [nino, utr, sortCode, postcode];
