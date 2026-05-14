import { z } from "zod";
import { LocalizedStringSchema } from "./compliance.js";

export const FormFieldTypeSchema = z.enum([
  "text",
  "number",
  "date",
  "select",
  "multiselect",
  "id",
  "iban",
  "phone",
  "email",
  "file",
  "checkbox",
  "radio",
  "textarea",
  "currency",
  "custom",
]);
export type FormFieldType = z.infer<typeof FormFieldTypeSchema>;

export const FormFieldOptionSchema = z.object({
  value: z.string().min(1),
  label: LocalizedStringSchema,
});
export type FormFieldOption = z.infer<typeof FormFieldOptionSchema>;

export const FormFieldSchema = z.object({
  id: z.string().min(1),
  type: FormFieldTypeSchema,
  label: LocalizedStringSchema,
  helpText: LocalizedStringSchema.optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  sensitive: z.boolean().optional(),
  validatorIds: z.array(z.string()).optional(),
  /** Static options for select/radio. */
  options: z.array(FormFieldOptionSchema).optional(),
  /** Field IDs this field's visibility depends on. */
  dependsOn: z.array(z.string()).optional(),
  mask: z.string().optional(),
  /** Reference to the underlying ComplianceField id, if any. */
  fieldRef: z.string().optional(),
  /** Default value. */
  defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
});
export type FormField = z.infer<typeof FormFieldSchema>;

export const FormSectionSchema = z.object({
  id: z.string().min(1),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  fields: z.array(FormFieldSchema),
});
export type FormSection = z.infer<typeof FormSectionSchema>;

export const FormSchemaSchema = z.object({
  id: z.string().min(1),
  jurisdiction: z.string().min(2),
  audience: z.enum(["company", "employee", "payroll", "custom"]),
  locale: z.string().min(2),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  sections: z.array(FormSectionSchema).min(1),
  version: z.string().min(1),
});
export type FormSchema = z.infer<typeof FormSchemaSchema>;
