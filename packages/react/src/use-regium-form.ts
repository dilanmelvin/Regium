import { buildFormFromFields, validateForm } from "@regium/forms";
import type { ComplianceField, FormSchema } from "@regium/types";
import { useCallback, useMemo, useState } from "react";
import { useRegium } from "./context.js";

export interface UseRegiumFormOptions {
  country: string;
  audience: "company" | "employee";
  locale?: string;
}

export interface UseRegiumFormResult {
  schema: FormSchema;
  fields: ComplianceField[];
  values: Record<string, string>;
  errors: Record<string, string[]>;
  setValue: (id: string, value: string) => void;
  validate: () => boolean;
  reset: () => void;
  isValid: boolean;
}

/**
 * Build a form schema from a country's compliance fields and manage local state.
 * Pure, headless — render however you like.
 */
export function useRegiumForm(opts: UseRegiumFormOptions): UseRegiumFormResult {
  const regium = useRegium();
  const fields =
    opts.audience === "company"
      ? regium.getCompanyFields(opts.country)
      : regium.getEmployeeFields(opts.country);

  const schema = useMemo(
    () =>
      buildFormFromFields({
        jurisdiction: opts.country,
        audience: opts.audience,
        fields,
        locale: opts.locale ?? "en",
      }),
    [opts.country, opts.audience, opts.locale, fields],
  );

  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const setValue = useCallback((id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const validate = useCallback((): boolean => {
    const result = validateForm(schema, values, {
      getValidator: (id) => {
        try {
          return regium.getValidator(id);
        } catch {
          return undefined;
        }
      },
    });
    setErrors(result.errors);
    return result.ok;
  }, [schema, values, regium]);

  const reset = useCallback(() => {
    setValues({});
    setErrors({});
  }, []);

  return {
    schema,
    fields,
    values,
    errors,
    setValue,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}
