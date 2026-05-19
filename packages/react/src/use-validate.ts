import type { ValidationResult } from "@regium/core";
import { useCallback, useState } from "react";
import { useRegium } from "./context.js";

export interface UseValidateResult {
  result: ValidationResult | null;
  validate: (country: string, field: string, value: string) => ValidationResult;
  reset: () => void;
}

/** Imperative validate hook for ad-hoc checks. */
export function useValidate(): UseValidateResult {
  const regium = useRegium();
  const [result, setResult] = useState<ValidationResult | null>(null);

  const validate = useCallback(
    (country: string, field: string, value: string) => {
      const r = regium.validate({ country, field, value });
      setResult(r);
      return r;
    },
    [regium],
  );

  const reset = useCallback(() => setResult(null), []);

  return { result, validate, reset };
}
