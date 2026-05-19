import type { BankingRules, ValidationResult } from "../types/index.js";
import { iban, swift } from "../validators/index.js";

/** Validate an IBAN. */
export function validateIBAN(value: string): ValidationResult {
  return iban.validate(value);
}

/** Validate a SWIFT/BIC. */
export function validateSWIFT(value: string): ValidationResult {
  return swift.validate(value);
}

/** Format an IBAN for display (groups of 4). */
export function formatIBAN(value: string): string {
  return iban.format ? iban.format(value) : value;
}

/** Build a high-level banking helper bound to a country's banking rules. */
export function createBanking(rules: BankingRules) {
  return {
    rules,
    requiresSwift: () => rules.swiftRequired ?? true,
    primaryFormat: () => rules.primaryFormat,
    /** Validate an account number length against the rules. */
    validateAccountLength(accountNumber: string): ValidationResult {
      const len = accountNumber.replace(/\s/g, "").length;
      if (len < rules.accountNumberLength.min || len > rules.accountNumberLength.max) {
        return {
          ok: false,
          errors: [
            {
              code: "E_LENGTH",
              message: `Account number must be ${rules.accountNumberLength.min}-${rules.accountNumberLength.max} chars`,
            },
          ],
        };
      }
      return { ok: true, errors: [] };
    },
  };
}

export type { BankingRules };
