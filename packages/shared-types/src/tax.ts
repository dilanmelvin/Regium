import { z } from "zod";
import { LocalizedStringSchema } from "./compliance.js";

export const TaxSlabSchema = z.object({
  /** Lower bound of the slab (inclusive). */
  from: z.number().nonnegative(),
  /** Upper bound of the slab (inclusive). null = no upper bound. */
  to: z.number().positive().nullable(),
  /** Marginal tax rate, percent (0-100). */
  rate: z.number().min(0).max(100),
  /** Optional fixed amount added at this slab boundary. */
  fixedAmount: z.number().nonnegative().optional(),
});
export type TaxSlab = z.infer<typeof TaxSlabSchema>;

export const TaxRegimeSchema = z.object({
  id: z.string().min(1),
  name: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  slabs: z.array(TaxSlabSchema).min(1),
  /** Standard deduction available under this regime. */
  standardDeduction: z.number().nonnegative().optional(),
  /** Whether this regime is the default. */
  default: z.boolean().optional(),
  /** Currency for the slab amounts. */
  currency: z.string().length(3),
  /** Frequency the slabs are applied at (usually annual). */
  period: z.enum(["annual", "monthly"]).optional(),
});
export type TaxRegime = z.infer<typeof TaxRegimeSchema>;

export const TaxSurchargeSchema = z.object({
  threshold: z.number().nonnegative(),
  rate: z.number().min(0).max(100),
  description: LocalizedStringSchema.optional(),
});
export type TaxSurcharge = z.infer<typeof TaxSurchargeSchema>;

export const TaxRulesSchema = z.object({
  regimes: z.array(TaxRegimeSchema).min(1),
  defaultRegimeId: z.string().min(1),
  /** Health & education cess, social levy, etc., applied on tax. */
  cessRate: z.number().min(0).max(100).optional(),
  /** Surcharges applied on top of base tax (HNI surcharges). */
  surcharges: z.array(TaxSurchargeSchema).optional(),
  /** Authority name. */
  authority: z.string().min(1),
  /** Tax year start (MM-DD). */
  taxYearStart: z
    .string()
    .regex(/^\d{2}-\d{2}$/)
    .optional(),
});
export type TaxRules = z.infer<typeof TaxRulesSchema>;
