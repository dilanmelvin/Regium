import { z } from "zod";
import { LocalizedStringSchema } from "./compliance.js";

export const LeaveTypeSchema = z.enum([
  "annual",
  "casual",
  "sick",
  "maternity",
  "paternity",
  "parental",
  "bereavement",
  "study",
  "sabbatical",
  "public-holiday",
  "compensatory",
  "unpaid",
  "other",
]);
export type LeaveType = z.infer<typeof LeaveTypeSchema>;

export const LeavePolicySchema = z.object({
  type: LeaveTypeSchema,
  name: LocalizedStringSchema,
  /** Statutory minimum days per year. */
  minDaysPerYear: z.number().nonnegative(),
  /** Whether unused leave is encashable / carries forward. */
  carryForward: z.boolean().optional(),
  /** Max days that may carry forward. */
  maxCarryForward: z.number().nonnegative().optional(),
  /** Whether the leave is paid. */
  paid: z.boolean().optional(),
  /** Eligibility waiting period (days from join). */
  eligibilityDays: z.number().nonnegative().optional(),
  description: LocalizedStringSchema.optional(),
});
export type LeavePolicy = z.infer<typeof LeavePolicySchema>;

export const TerminationRuleSchema = z.object({
  /** Minimum statutory notice period (days). */
  minNoticeDays: z.number().nonnegative(),
  /** Whether severance pay is statutory. */
  severanceMandatory: z.boolean().optional(),
  /** Severance formula: months of pay per year of service. */
  severanceMonthsPerYear: z.number().nonnegative().optional(),
  /** Probation maximum (months). */
  maxProbationMonths: z.number().nonnegative().optional(),
  description: LocalizedStringSchema.optional(),
});
export type TerminationRule = z.infer<typeof TerminationRuleSchema>;

export const LaborRulesSchema = z.object({
  standardWeeklyHours: z.number().positive().optional(),
  maxWeeklyHours: z.number().positive().optional(),
  maxDailyHours: z.number().positive().optional(),
  weeklyOffDays: z.number().int().min(0).max(7).optional(),
  /** Minimum wage in country currency, if uniform nationally. */
  minimumWage: z
    .object({
      amount: z.number().positive(),
      period: z.enum(["hour", "day", "week", "month"]),
      currency: z.string().length(3),
    })
    .optional(),
  leavePolicies: z.array(LeavePolicySchema).optional(),
  termination: TerminationRuleSchema,
  /** Public holidays observance authority. */
  holidayAuthority: z.string().optional(),
  /** Whether collective bargaining is recognized. */
  collectiveBargaining: z.boolean().optional(),
});
export type LaborRules = z.infer<typeof LaborRulesSchema>;
