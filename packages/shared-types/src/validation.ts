import { z } from "zod";

export const ValidatorKindSchema = z.enum(["regex", "checksum", "async", "composite", "custom"]);
export type ValidatorKind = z.infer<typeof ValidatorKindSchema>;

export interface ValidationError {
  code: string;
  message: string;
  /** Optional path within the input value. */
  path?: (string | number)[];
}

export interface ValidationWarning {
  code: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
  /** Canonical, normalized form of the input (uppercase, no spaces, etc.). */
  normalized?: string;
}

/**
 * A Validator is the smallest composable unit of compliance checking.
 * Validators are pure, deterministic functions.
 */
export interface Validator<TInput = string, TContext = unknown> {
  id: string;
  description: string;
  jurisdiction: string; // ISO2 / "global"
  kind: ValidatorKind;
  validate(value: TInput, ctx?: TContext): ValidationResult;
  parse?(value: TInput): TInput;
  format?(value: TInput): string;
  normalize?(value: TInput): TInput;
  mask?(value: TInput): string;
}

export const ValidatorBindingSchema = z.object({
  fieldId: z.string().min(1),
  validatorId: z.string().min(1),
  /** Optional context to pass to the validator (e.g., entity type). */
  context: z.record(z.unknown()).optional(),
});
export type ValidatorBinding = z.infer<typeof ValidatorBindingSchema>;
