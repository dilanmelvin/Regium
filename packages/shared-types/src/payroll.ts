import { z } from "zod";
import { LocalizedStringSchema } from "./compliance.js";

export const PayrollFrequencySchema = z.enum([
  "weekly",
  "bi-weekly",
  "semi-monthly",
  "monthly",
  "quarterly",
  "annually",
]);
export type PayrollFrequency = z.infer<typeof PayrollFrequencySchema>;

export const SalaryComponentTypeSchema = z.enum([
  "earning",
  "allowance",
  "deduction",
  "employer-contribution",
  "employee-contribution",
  "reimbursement",
  "bonus",
  "tax",
]);
export type SalaryComponentType = z.infer<typeof SalaryComponentTypeSchema>;

export const ComputationStrategySchema = z.enum([
  "fixed",
  "percent-of-basic",
  "percent-of-gross",
  "percent-of-ctc",
  "slab",
  "formula",
  "statutory",
]);
export type ComputationStrategy = z.infer<typeof ComputationStrategySchema>;

export const SalaryComponentSchema = z.object({
  id: z.string().min(1),
  name: LocalizedStringSchema,
  type: SalaryComponentTypeSchema,
  computation: ComputationStrategySchema,
  /** Default rate (percent: 0-100, fixed: amount). */
  defaultRate: z.number().nonnegative().optional(),
  /** Whether this component is taxable. */
  taxable: z.boolean().optional(),
  /** Whether this component is mandatory. */
  mandatory: z.boolean().optional(),
  /** Cap (max amount per period), if any. */
  cap: z.number().positive().optional(),
  /** Floor (min amount per period), if any. */
  floor: z.number().nonnegative().optional(),
  description: LocalizedStringSchema.optional(),
});
export type SalaryComponent = z.infer<typeof SalaryComponentSchema>;

export const ContributionSchema = z.object({
  id: z.string().min(1),
  name: LocalizedStringSchema,
  /** "employer" or "employee" or "both". */
  payer: z.enum(["employer", "employee", "both"]),
  rate: z.number().min(0).max(100),
  /** Wage ceiling beyond which contribution is capped. */
  ceiling: z.number().positive().optional(),
  /** Wage floor below which contribution does not apply. */
  floor: z.number().nonnegative().optional(),
  authority: z.string().optional(),
  description: LocalizedStringSchema.optional(),
});
export type Contribution = z.infer<typeof ContributionSchema>;

export const PayrollRulesSchema = z.object({
  frequencies: z.array(PayrollFrequencySchema).min(1),
  defaultFrequency: PayrollFrequencySchema,
  components: z.array(SalaryComponentSchema).optional(),
  contributions: z.array(ContributionSchema).optional(),
  /** Standard working days per month (used for pro-rata). */
  workingDaysPerMonth: z.number().positive().optional(),
  /** Standard working hours per day. */
  workingHoursPerDay: z.number().positive().optional(),
  /** Whether overtime is mandated by law. */
  overtimeMandatory: z.boolean().optional(),
  /** Overtime multiplier (e.g., 1.5x for weekday OT). */
  overtimeMultiplier: z.number().positive().optional(),
  /** Whether 13th month / annual bonus is mandated. */
  thirteenthMonth: z.boolean().optional(),
  /** Currency for payroll calculations (usually country currency). */
  currency: z.string().length(3).optional(),
});
export type PayrollRules = z.infer<typeof PayrollRulesSchema>;
