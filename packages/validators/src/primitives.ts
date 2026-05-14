import type { ValidationResult, Validator } from "@regium/types";
import { canonicalize } from "@regium/utils";

export interface RegexValidatorOptions {
  id: string;
  description: string;
  jurisdiction: string;
  pattern: RegExp;
  /** Whether to canonicalize (uppercase, strip non-alphanumeric) before matching. */
  canonical?: boolean;
  /** Custom error code/message overrides. */
  errorCode?: string;
  errorMessage?: string;
}

/** Build a regex validator. */
export function regex(opts: RegexValidatorOptions): Validator {
  const errorCode = opts.errorCode ?? "E_FORMAT";
  const errorMessage = opts.errorMessage ?? `Value does not match expected format for ${opts.id}`;
  return {
    id: opts.id,
    description: opts.description,
    jurisdiction: opts.jurisdiction,
    kind: "regex",
    normalize(value) {
      return opts.canonical ? canonicalize(value) : value.trim();
    },
    validate(value): ValidationResult {
      const normalized = opts.canonical ? canonicalize(value) : value.trim();
      if (opts.pattern.test(normalized)) {
        return { ok: true, errors: [], normalized };
      }
      return {
        ok: false,
        errors: [{ code: errorCode, message: errorMessage }],
        normalized,
      };
    },
  };
}

export interface ChecksumValidatorOptions {
  id: string;
  description: string;
  jurisdiction: string;
  /** First validate format. */
  format?: RegExp;
  /** Whether to canonicalize before checking. */
  canonical?: boolean;
  /** The checksum function returning true if value is valid. */
  check: (canonical: string) => boolean;
  errorCode?: string;
  errorMessage?: string;
}

export function checksum(opts: ChecksumValidatorOptions): Validator {
  return {
    id: opts.id,
    description: opts.description,
    jurisdiction: opts.jurisdiction,
    kind: "checksum",
    normalize(value) {
      return opts.canonical === false ? value.trim() : canonicalize(value);
    },
    validate(value): ValidationResult {
      const normalized = opts.canonical === false ? value.trim() : canonicalize(value);
      if (opts.format && !opts.format.test(normalized)) {
        return {
          ok: false,
          errors: [
            {
              code: opts.errorCode ?? "E_FORMAT",
              message: opts.errorMessage ?? `Invalid format for ${opts.id}`,
            },
          ],
          normalized,
        };
      }
      const ok = opts.check(normalized);
      return ok
        ? { ok: true, errors: [], normalized }
        : {
            ok: false,
            errors: [
              {
                code: opts.errorCode ?? "E_CHECKSUM",
                message: opts.errorMessage ?? `Invalid checksum for ${opts.id}`,
              },
            ],
            normalized,
          };
    },
  };
}

/** Compose multiple validators; all must pass. */
export function compose(
  id: string,
  description: string,
  jurisdiction: string,
  parts: Validator[],
): Validator {
  return {
    id,
    description,
    jurisdiction,
    kind: "composite",
    validate(value, ctx) {
      const errors = [];
      let normalized: string | undefined;
      for (const v of parts) {
        const r = v.validate(value, ctx);
        if (!r.ok) errors.push(...r.errors);
        if (r.normalized) normalized = r.normalized;
      }
      return { ok: errors.length === 0, errors, normalized };
    },
  };
}
