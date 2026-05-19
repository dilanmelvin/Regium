import { z } from "zod";

export const FieldSensitivitySchema = z.enum(["public", "internal", "pii", "secret"]);
export type FieldSensitivity = z.infer<typeof FieldSensitivitySchema>;

export const FieldCategorySchema = z.enum([
  "tax-id",
  "national-id",
  "social-security",
  "pension",
  "registration",
  "banking",
  "passport",
  "visa",
  "immigration",
  "insurance",
  "payroll",
  "labor",
  "vat-gst",
  "corporate",
  "other",
]);
export type FieldCategory = z.infer<typeof FieldCategorySchema>;

export const LocalizedStringSchema = z.union([
  z.string().min(1),
  z.record(z.string().min(2), z.string().min(1)),
]);
export type LocalizedString = string | Record<string, string>;

export const ComplianceFieldSchema = z.object({
  /** Stable identifier within the country, e.g. "PAN", "GSTIN", "EIN". */
  id: z.string().min(1),
  category: FieldCategorySchema,
  label: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  /** Validator IDs from @regium/validators that apply to this field. */
  validatorIds: z.array(z.string().min(1)).optional(),
  /** Whether the field is required for the entity type. */
  required: z.boolean().optional(),
  /** Whether this field uniquely identifies the entity. */
  unique: z.boolean().optional(),
  sensitivity: FieldSensitivitySchema.optional(),
  /** Display mask, e.g. "AAAAA9999A". */
  mask: z.string().optional(),
  /** Example value (must be synthetic, never real PII). */
  example: z.string().optional(),
  /** Authority that issues this ID. */
  issuingAuthority: z.string().optional(),
  /** When this field applies (e.g., only certain entity types). */
  appliesTo: z.array(z.string()).optional(),
  /** Help URL on government portal. */
  helpUrl: z.string().url().optional(),
});
export type ComplianceField = z.infer<typeof ComplianceFieldSchema>;

export const CompanyFieldsSchema = z.array(ComplianceFieldSchema);
export type CompanyFields = z.infer<typeof CompanyFieldsSchema>;

export const EmployeeFieldsSchema = z.array(ComplianceFieldSchema);
export type EmployeeFields = z.infer<typeof EmployeeFieldsSchema>;

export const ImmigrationCategorySchema = z.object({
  id: z.string().min(1),
  name: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  /** Maximum stay in days, if applicable. */
  maxStayDays: z.number().int().positive().optional(),
  /** Whether dependents can accompany. */
  dependentsAllowed: z.boolean().optional(),
  /** Whether holder can work. */
  workAllowed: z.boolean().optional(),
  /** Authority that issues this category. */
  issuingAuthority: z.string().optional(),
});
export type ImmigrationCategory = z.infer<typeof ImmigrationCategorySchema>;

export const ImmigrationSchema = z.object({
  visaCategories: z.array(ImmigrationCategorySchema).optional(),
  workPermitCategories: z.array(ImmigrationCategorySchema).optional(),
  notes: LocalizedStringSchema.optional(),
});
export type Immigration = z.infer<typeof ImmigrationSchema>;
