// regium — main entry
// Core registry, plugin host, createRegium
export {
  createRegium,
  Registry,
  RegiumError,
  CountryNotFoundError,
  ValidatorNotFoundError,
  FieldNotFoundError,
} from "./core/index.js";
export type { Regium, RegiumOptions, ValidateRequest } from "./core/index.js";

// Public types
export * from "./types/index.js";

// Utility functions
export * from "./utils/index.js";

// All validators (PAN, IBAN, CPF, etc.)
export * from "./validators/index.js";

// Form, payroll, tax, labor, banking engines
export * from "./forms/index.js";
export * from "./payroll/index.js";
export * from "./tax/index.js";
export * from "./labor/index.js";
export * from "./banking/index.js";
export * from "./localization/index.js";
