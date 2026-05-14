import type {
  ComplianceField,
  FieldCategory,
  FormField,
  FormFieldType,
  FormSchema,
  FormSection,
} from "@regium/types";

export interface BuildFormOptions {
  jurisdiction: string;
  audience: "company" | "employee" | "payroll" | "custom";
  fields: ComplianceField[];
  locale: string;
  /** Optional title for the form. */
  title?: string;
  /** Optional version override. */
  version?: string;
}

/** Map a ComplianceField category to a sensible default form input type. */
function categoryToType(category: FieldCategory): FormFieldType {
  switch (category) {
    case "tax-id":
    case "national-id":
    case "social-security":
    case "pension":
    case "registration":
    case "vat-gst":
    case "corporate":
    case "insurance":
    case "payroll":
    case "labor":
    case "passport":
    case "visa":
    case "immigration":
      return "id";
    case "banking":
      return "iban";
    default:
      return "text";
  }
}

/**
 * Build a `FormSchema` directly from a list of compliance fields.
 * Fields are grouped into a single section labeled by audience.
 */
export function buildFormFromFields(opts: BuildFormOptions): FormSchema {
  const formFields: FormField[] = opts.fields.map((f) => ({
    id: f.id,
    type: categoryToType(f.category),
    label: f.label,
    helpText: f.description,
    required: f.required ?? false,
    sensitive: f.sensitivity === "pii" || f.sensitivity === "secret",
    validatorIds: f.validatorIds ?? [],
    fieldRef: f.id,
    mask: f.mask,
  }));

  const sections: FormSection[] = [
    {
      id: `${opts.audience}-section`,
      title: opts.audience === "company" ? "Company compliance" : "Employee compliance",
      fields: formFields,
    },
  ];

  return {
    id: `form.${opts.jurisdiction.toLowerCase()}.${opts.audience}`,
    jurisdiction: opts.jurisdiction.toUpperCase(),
    audience: opts.audience,
    locale: opts.locale,
    title: opts.title ?? `${opts.audience} form (${opts.jurisdiction})`,
    sections,
    version: opts.version ?? "0.1.0",
  };
}

/** Form-side helper to validate values against a schema using validator ids. */
export interface FormValidationContext {
  /** Async-aware resolver returning a validator by id. */
  getValidator: (
    id: string,
  ) =>
    | { validate: (value: string) => { ok: boolean; errors: { code: string; message: string }[] } }
    | undefined;
}

export interface FormValidationOutcome {
  ok: boolean;
  errors: Record<string, string[]>;
}

/** Validate a flat record of values against a FormSchema. */
export function validateForm(
  schema: FormSchema,
  values: Record<string, string>,
  ctx: FormValidationContext,
): FormValidationOutcome {
  const errors: Record<string, string[]> = {};
  for (const section of schema.sections) {
    for (const field of section.fields) {
      const v = values[field.id];
      if (field.required && (v === undefined || v.trim() === "")) {
        errors[field.id] = [
          `${typeof field.label === "string" ? field.label : field.id} is required`,
        ];
        continue;
      }
      if (v === undefined || v.trim() === "") continue;
      const fieldErrors: string[] = [];
      for (const id of field.validatorIds ?? []) {
        const validator = ctx.getValidator(id);
        if (!validator) {
          fieldErrors.push(`Validator "${id}" not registered`);
          continue;
        }
        const r = validator.validate(v);
        if (!r.ok) for (const e of r.errors) fieldErrors.push(e.message);
      }
      if (fieldErrors.length) errors[field.id] = fieldErrors;
    }
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export type { FormSchema, FormField, FormSection };
